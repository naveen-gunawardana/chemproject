import type { ResearchNode } from "../types";

export const researchNodes: ResearchNode[] = [
  {
    id: "basic-electrolytes",
    name: "Basic Electrolytes",
    description:
      "The starter pack. Sodium, potassium, citric acid — your first recipe building blocks.",
    cost: 0,
    prerequisites: [],
    unlocks: [
      { kind: "ingredient", id: "na" },
      { kind: "ingredient", id: "k" },
      { kind: "ingredient", id: "citric" },
      { kind: "ingredient", id: "hfcs" },
      { kind: "ingredient", id: "artflavor" },
    ],
    position: { x: 0, y: 0 },
  },
  {
    id: "sweetener-science",
    name: "Sweetener Science",
    description:
      "Investigate alternative carbohydrate sources. Unlocks cane sugar + dextrose.",
    cost: 20_000,
    prerequisites: [{ kind: "research", id: "basic-electrolytes" }],
    unlocks: [
      { kind: "ingredient", id: "cane" },
      { kind: "ingredient", id: "dex" },
    ],
    position: { x: 1, y: -1 },
  },
  {
    id: "synthetic-sweeteners",
    name: "Synthetic Sweeteners",
    description: "Sucralose — 600× sweeter than sucrose, enables 'zero sugar' claims.",
    cost: 30_000,
    prerequisites: [{ kind: "research", id: "sweetener-science" }],
    unlocks: [{ kind: "ingredient", id: "sucralose" }],
    position: { x: 2, y: -2 },
  },
  {
    id: "natural-sweeteners",
    name: "Natural Sweeteners",
    description:
      "Stevia + natural flavor compounds. Requires a Wet Lab T2 to extract reliably.",
    cost: 50_000,
    prerequisites: [
      { kind: "research", id: "sweetener-science" },
      { kind: "building", defId: "wetlab", tier: 2 },
    ],
    unlocks: [
      { kind: "ingredient", id: "stevia" },
      { kind: "ingredient", id: "natflavor" },
    ],
    position: { x: 2, y: 0 },
  },
  {
    id: "color-chemistry",
    name: "Color Chemistry",
    description:
      "Food-grade synthetic dyes. Requires a dedicated Color Lab.",
    cost: 15_000,
    prerequisites: [
      { kind: "research", id: "basic-electrolytes" },
      { kind: "building", defId: "colorlab", tier: 1 },
    ],
    unlocks: [
      { kind: "ingredient", id: "red40" },
      { kind: "ingredient", id: "blue1" },
    ],
    position: { x: 1, y: 1 },
  },
  {
    id: "trace-minerals",
    name: "Trace Minerals",
    description:
      "Calcium + Magnesium. Bone-health and recovery marketing surface.",
    cost: 40_000,
    prerequisites: [
      { kind: "research", id: "basic-electrolytes" },
      { kind: "building", defId: "wetlab", tier: 1 },
    ],
    unlocks: [
      { kind: "ingredient", id: "ca" },
      { kind: "ingredient", id: "mg" },
    ],
    position: { x: 1, y: 2 },
  },
  {
    id: "performance-compounds",
    name: "Performance Compounds",
    description:
      "Caffeine + BCAA blend. Unlocks 'energy' marketing positioning.",
    cost: 80_000,
    prerequisites: [
      { kind: "research", id: "trace-minerals" },
      { kind: "building", defId: "wetlab", tier: 2 },
    ],
    unlocks: [
      { kind: "ingredient", id: "caffeine" },
      { kind: "ingredient", id: "bcaa" },
    ],
    position: { x: 2, y: 2 },
  },
  {
    id: "vitamin-complex",
    name: "Vitamin Complex",
    description: "B-vitamin blend. Adds 'wellness' marketing surface area.",
    cost: 60_000,
    prerequisites: [
      { kind: "research", id: "trace-minerals" },
      { kind: "building", defId: "wetlab", tier: 2 },
    ],
    unlocks: [{ kind: "ingredient", id: "bvits" }],
    position: { x: 2, y: 3 },
  },
];

export const researchById = Object.fromEntries(
  researchNodes.map((n) => [n.id, n]),
) as Record<string, ResearchNode>;
