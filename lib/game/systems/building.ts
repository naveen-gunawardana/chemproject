import { buildings, buildingsByDef } from "../data/buildings";
import type {
  BuildingDef,
  BuildingEffect,
  BuildingFloor,
  BuildingInstance,
  BuildingTier,
} from "../types";

export interface BuildingBonuses {
  productionCostMult: number;
  reachMult: number;
  conversionMult: number;
  channelBoosts: Record<string, number>;
  researchSpeedMult: number;
  unlockedChannelSlots: number;
  trustPerQuarter: number;
  legalEventDampen: number;
  passiveCash: number;
  hasCEOSuite: boolean;
}

export function emptyBuildingBonuses(): BuildingBonuses {
  return {
    productionCostMult: 1,
    reachMult: 1,
    conversionMult: 1,
    channelBoosts: {},
    researchSpeedMult: 1,
    unlockedChannelSlots: 0,
    trustPerQuarter: 0,
    legalEventDampen: 1,
    passiveCash: 0,
    hasCEOSuite: false,
  };
}

export function computeBuildingBonuses(
  instances: BuildingInstance[],
): BuildingBonuses {
  const b = emptyBuildingBonuses();
  for (const inst of instances) {
    if (inst.tier <= 0) continue;
    const def = buildingsByDef[inst.defId];
    if (!def) continue;
    const tier = def.tiers[inst.tier - 1];
    if (!tier) continue;
    for (const eff of tier.effects) applyEffect(b, eff);
    if (def.id === "ceosuite") b.hasCEOSuite = true;
  }
  return b;
}

function applyEffect(b: BuildingBonuses, eff: BuildingEffect): void {
  switch (eff.kind) {
    case "productionCostMult":
      b.productionCostMult *= eff.value;
      break;
    case "reachMult":
      b.reachMult *= eff.value;
      break;
    case "conversionMult":
      b.conversionMult *= eff.value;
      break;
    case "channelBoost":
      if (eff.channel) {
        b.channelBoosts[eff.channel] =
          (b.channelBoosts[eff.channel] ?? 1) * eff.value;
      }
      break;
    case "researchSpeed":
      b.researchSpeedMult *= eff.value;
      break;
    case "unlockChannel":
      b.unlockedChannelSlots += eff.value;
      break;
    case "trustPerQuarter":
      b.trustPerQuarter += eff.value;
      break;
    case "legalEventDampen":
      b.legalEventDampen *= eff.value;
      break;
    case "passiveCash":
      b.passiveCash += eff.value;
      break;
  }
}

export function hasBuildingAtTier(
  instances: BuildingInstance[],
  defId: string,
  tier: number,
): boolean {
  return instances.some(
    (i) => i.defId === defId && i.tier >= tier && i.building === null,
  );
}

export function tickConstruction(instances: BuildingInstance[]): BuildingInstance[] {
  return instances.map((i) => {
    if (!i.building) return i;
    const left = i.building.quartersLeft - 1;
    if (left <= 0) {
      return { ...i, tier: i.building.targetTier, building: null };
    }
    return { ...i, building: { ...i.building, quartersLeft: left } };
  });
}

export function buildingsForFloor(
  instances: BuildingInstance[],
  floor: BuildingFloor,
): BuildingInstance[] {
  return instances
    .filter((i) => buildingsByDef[i.defId]?.floor === floor)
    .sort((a, b) => a.slot - b.slot);
}

export function buildingsAvailableForFloor(floor: BuildingFloor): BuildingDef[] {
  return buildings.filter((b) => b.floor === floor);
}

export function nextTierOf(def: BuildingDef, currentTier: number): BuildingTier | null {
  return def.tiers[currentTier] ?? null;
}
