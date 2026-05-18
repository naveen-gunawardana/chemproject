import { researchById, researchNodes } from "../data/research";
import { hasBuildingAtTier } from "./building";
import type { BuildingInstance, ResearchNode } from "../types";

export function unlockedIngredientIds(
  researchUnlocked: string[],
): Set<string> {
  const ids = new Set<string>();
  for (const rid of researchUnlocked) {
    const node = researchById[rid];
    if (!node) continue;
    for (const u of node.unlocks) {
      if (u.kind === "ingredient") ids.add(u.id);
    }
  }
  return ids;
}

export function canResearch(
  node: ResearchNode,
  researchUnlocked: string[],
  buildings: BuildingInstance[],
): { ok: true } | { ok: false; reason: string } {
  if (researchUnlocked.includes(node.id)) {
    return { ok: false, reason: "Already researched" };
  }
  for (const p of node.prerequisites) {
    if (p.kind === "research") {
      if (!researchUnlocked.includes(p.id)) {
        const name = researchById[p.id]?.name ?? p.id;
        return { ok: false, reason: `Requires research: ${name}` };
      }
    } else if (p.kind === "building") {
      if (!hasBuildingAtTier(buildings, p.defId, p.tier)) {
        return {
          ok: false,
          reason: `Requires building ${p.defId} at tier ${p.tier}`,
        };
      }
    }
  }
  return { ok: true };
}

export function visibleResearchNodes(): ResearchNode[] {
  return researchNodes;
}
