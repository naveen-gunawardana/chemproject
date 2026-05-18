import type {
  BuildingDef,
  BuildingEffect,
  BuildingFloor,
  BuildingTier,
} from "../types";

// === Tier scaling helpers ===

const TIER_COUNT = 10;
const COST_MULT = 2.2; // cost grows ~2.2x per tier

function tierCost(baseCost: number, tier: number): number {
  return Math.round(baseCost * Math.pow(COST_MULT, tier - 1));
}

function quartersToBuild(tier: number): number {
  if (tier <= 3) return 1;
  if (tier <= 6) return 2;
  if (tier <= 8) return 3;
  return 4;
}

// Linear scaling helper for effect values
function linScale(from: number, to: number, tier: number, totalTiers = TIER_COUNT): number {
  if (totalTiers === 1) return to;
  const t = (tier - 1) / (totalTiers - 1);
  return from + (to - from) * t;
}

interface MakeBuildingArgs {
  id: string;
  name: string;
  floor: BuildingFloor;
  icon: string;
  description: string;
  baseCost: number;
  effects: (tier: number) => BuildingEffect[];
  description_for_tier: (tier: number) => string;
}

function makeBuilding({
  id,
  name,
  floor,
  icon,
  description,
  baseCost,
  effects,
  description_for_tier,
}: MakeBuildingArgs): BuildingDef {
  const tiers: BuildingTier[] = Array.from({ length: TIER_COUNT }).map((_, i) => {
    const tier = i + 1;
    return {
      cost: tierCost(baseCost, tier),
      quartersToBuild: quartersToBuild(tier),
      effects: effects(tier),
      description: description_for_tier(tier),
    };
  });
  return { id, name, floor, icon, description, tiers };
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

// === Building definitions ===

export const buildings: BuildingDef[] = [
  // === PRODUCTION ===
  makeBuilding({
    id: "bottling",
    name: "Bottling Line",
    floor: "production",
    icon: "🍾",
    description: "Fills, caps, and labels bottles. Higher tiers slash production cost.",
    baseCost: 50_000,
    effects: (tier) => [
      { kind: "productionCostMult", value: linScale(0.92, 0.3, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — production cost × ${linScale(0.92, 0.3, tier).toFixed(2)} (saves ${pct(1 - linScale(0.92, 0.3, tier))})`,
  }),
  makeBuilding({
    id: "packaging",
    name: "Packaging Plant",
    floor: "production",
    icon: "📦",
    description: "Label design + premium packaging. Boosts shelf appeal.",
    baseCost: 30_000,
    effects: (tier) => [
      { kind: "conversionMult", value: linScale(1.05, 1.5, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — conversion × ${linScale(1.05, 1.5, tier).toFixed(2)} (+${pct(linScale(1.05, 1.5, tier) - 1)})`,
  }),
  makeBuilding({
    id: "coldstorage",
    name: "Cold Storage",
    floor: "production",
    icon: "❄",
    description: "Chilled warehousing. Prevents spoilage events; modest conversion boost.",
    baseCost: 40_000,
    effects: (tier) => [
      { kind: "conversionMult", value: linScale(1.05, 1.3, tier) },
      { kind: "legalEventDampen", value: linScale(0.7, 0.2, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — conv ×${linScale(1.05, 1.3, tier).toFixed(2)} · spoilage events ×${linScale(0.7, 0.2, tier).toFixed(2)}`,
  }),

  // === R&D LAB ===
  makeBuilding({
    id: "wetlab",
    name: "Wet Lab",
    floor: "lab",
    icon: "⚗",
    description: "Hands-on chemistry. Higher tiers unlock advanced research + speed it up.",
    baseCost: 40_000,
    effects: (tier) => [
      { kind: "researchSpeed", value: linScale(1.0, 3.5, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — research speed × ${linScale(1.0, 3.5, tier).toFixed(2)}`,
  }),
  makeBuilding({
    id: "qclab",
    name: "Quality Lab",
    floor: "lab",
    icon: "🧪",
    description: "FDA pre-check + label tolerance testing. Reduces legal-event severity.",
    baseCost: 60_000,
    effects: (tier) => [
      { kind: "legalEventDampen", value: linScale(0.65, 0.15, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — legal events ×${linScale(0.65, 0.15, tier).toFixed(2)} (less severe)`,
  }),
  makeBuilding({
    id: "colorlab",
    name: "Color Lab",
    floor: "lab",
    icon: "🎨",
    description: "Specialized food-color chemistry. Unlocks dyes + kid-targeting boost.",
    baseCost: 25_000,
    effects: (tier) => [
      { kind: "reachMult", value: linScale(1.02, 1.2, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — kid-channel reach × ${linScale(1.02, 1.2, tier).toFixed(2)}`,
  }),

  // === DISTRIBUTION ===
  makeBuilding({
    id: "loadingdock",
    name: "Loading Dock",
    floor: "distribution",
    icon: "🚛",
    description: "Receives + ships product. Unlocks distribution channels.",
    baseCost: 30_000,
    effects: (tier) => [
      { kind: "unlockChannel", value: 1 },
      { kind: "conversionMult", value: linScale(1.05, 1.4, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — conv × ${linScale(1.05, 1.4, tier).toFixed(2)} + +1 channel slot`,
  }),
  makeBuilding({
    id: "fleet",
    name: "Delivery Fleet",
    floor: "distribution",
    icon: "🚐",
    description: "Branded delivery trucks. Higher tiers = bigger regional reach.",
    baseCost: 50_000,
    effects: (tier) => [
      { kind: "conversionMult", value: linScale(1.15, 1.7, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — retail/vending volume × ${linScale(1.15, 1.7, tier).toFixed(2)}`,
  }),
  makeBuilding({
    id: "dtcwarehouse",
    name: "DTC Warehouse",
    floor: "distribution",
    icon: "🏬",
    description:
      "Direct-to-consumer fulfillment. Unlocks subscription revenue + scales passive income.",
    baseCost: 80_000,
    effects: (tier) => [
      { kind: "passiveCash", value: Math.round(linScale(2000, 50_000, tier)) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — +$${(linScale(2000, 50_000, tier) / 1000).toFixed(1)}K/q passive`,
  }),

  // === OFFICE ===
  makeBuilding({
    id: "marketingstudio",
    name: "Marketing Studio",
    floor: "office",
    icon: "🎬",
    description: "In-house creative production. Stretches marketing dollars further.",
    baseCost: 40_000,
    effects: (tier) => [
      { kind: "reachMult", value: linScale(1.15, 2.5, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — campaign reach × ${linScale(1.15, 2.5, tier).toFixed(2)}`,
  }),
  makeBuilding({
    id: "legaloffice",
    name: "Legal Office",
    floor: "office",
    icon: "⚖",
    description: "In-house counsel. Halves cash hit from legal events.",
    baseCost: 60_000,
    effects: (tier) => [
      { kind: "legalEventDampen", value: linScale(0.55, 0.1, tier) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — legal events ×${linScale(0.55, 0.1, tier).toFixed(2)} (huge dampen)`,
  }),

  // === EXECUTIVE (Y2+) ===
  makeBuilding({
    id: "boardroom",
    name: "Boardroom",
    floor: "executive",
    icon: "🏛",
    description: "Where the big calls happen. Steady passive trust gain.",
    baseCost: 150_000,
    effects: (tier) => [
      { kind: "trustPerQuarter", value: Math.round(linScale(2, 25, tier)) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — +${Math.round(linScale(2, 25, tier))} brand trust per quarter`,
  }),
  makeBuilding({
    id: "ceosuite",
    name: "CEO Suite",
    floor: "executive",
    icon: "✦",
    description: "Cosmetic prestige + passive income from licensing your image.",
    baseCost: 200_000,
    effects: (tier) => [
      { kind: "passiveCash", value: Math.round(linScale(3000, 60_000, tier)) },
    ],
    description_for_tier: (tier) =>
      `T${tier} — +$${(linScale(3000, 60_000, tier) / 1000).toFixed(1)}K/q passive · +10% staff bonus`,
  }),
];

export const buildingsByDef = Object.fromEntries(
  buildings.map((b) => [b.id, b]),
) as Record<string, BuildingDef>;

export const FLOOR_ORDER: BuildingFloor[] = [
  "executive",
  "office",
  "production",
  "lab",
  "distribution",
];

export const FLOOR_LABEL: Record<BuildingFloor, string> = {
  executive: "EXECUTIVE",
  office: "OFFICE",
  production: "PRODUCTION",
  lab: "R&D LAB",
  distribution: "DISTRIBUTION",
};

export const FLOOR_COLOR: Record<BuildingFloor, string> = {
  executive: "#b07bff",
  office: "#ff7a1f",
  production: "#5fa8ff",
  lab: "#86efac",
  distribution: "#facc15",
};

export const FLOOR_SLOTS: Record<BuildingFloor, number> = {
  executive: 2,
  office: 2,
  production: 3,
  lab: 3,
  distribution: 3,
};
