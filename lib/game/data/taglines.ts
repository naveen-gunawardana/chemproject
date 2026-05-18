import type { TaglineTemplate } from "../types";

// Each tagline has a hidden "truth %" — the share of consumers / regulators
// who would still find the claim defensible after fact-checking. Higher
// social-impact cost reflects how much the framing pushes consumption among
// people who don't need it (especially kids).
export const taglines: TaglineTemplate[] = [
  // Honest-ish, broad
  {
    id: "t-honest-quench",
    text: "Quenches your thirst.",
    truthPct: 95,
    socialImpactCost: 1,
    marketingBoost: 1,
  },
  {
    id: "t-honest-salt",
    text: "Sodium + sugar in water. That's the recipe.",
    truthPct: 100,
    socialImpactCost: 0,
    marketingBoost: 0,
  },

  // Athlete-pitched
  {
    id: "t-athlete-replenish",
    text: "Replenish what you lose.",
    truthPct: 70,
    socialImpactCost: 3,
    marketingBoost: 6,
    fits: ["athletes"],
  },
  {
    id: "t-athlete-edge",
    text: "Win the second half.",
    truthPct: 35,
    socialImpactCost: 4,
    marketingBoost: 8,
    fits: ["athletes", "teens"],
  },
  {
    id: "t-athlete-storm",
    text: "Drink lightning. Become storm.",
    truthPct: 10,
    socialImpactCost: 6,
    marketingBoost: 9,
    fits: ["athletes", "teens"],
  },

  // Kid-pitched
  {
    id: "t-kid-champion",
    text: "Vital electrolytes for growing champions.",
    truthPct: 25,
    socialImpactCost: 9,
    marketingBoost: 9,
    fits: ["kids", "teens"],
  },
  {
    id: "t-kid-sunshine",
    text: "Like sunshine in a bottle.",
    truthPct: 80,
    socialImpactCost: 6,
    marketingBoost: 6,
    fits: ["kids"],
  },
  {
    id: "t-kid-fun",
    text: "The cool drink your friends are on.",
    truthPct: 95,
    socialImpactCost: 8,
    marketingBoost: 7,
    fits: ["kids", "teens"],
  },

  // Lifestyle / wellness
  {
    id: "t-life-wellness",
    text: "Hydration is wellness.",
    truthPct: 80,
    socialImpactCost: 2,
    marketingBoost: 6,
    fits: ["lifestyle"],
  },
  {
    id: "t-life-natural",
    text: "Naturally sourced. Nothing artificial.",
    truthPct: 50,
    socialImpactCost: 3,
    marketingBoost: 8,
    fits: ["lifestyle"],
  },
  {
    id: "t-life-quantum",
    text: "Quantum cascade electrolyte science.",
    truthPct: 5,
    socialImpactCost: 6,
    marketingBoost: 8,
    fits: ["lifestyle"],
  },

  // Medical / rehydration
  {
    id: "t-med-clinical",
    text: "Clinical-grade rehydration.",
    truthPct: 60,
    socialImpactCost: 1,
    marketingBoost: 5,
    fits: ["medical"],
  },
  {
    id: "t-med-recovery",
    text: "Recover faster — backed by chemistry.",
    truthPct: 45,
    socialImpactCost: 2,
    marketingBoost: 7,
    fits: ["medical", "athletes"],
  },

  // Vague + universal
  {
    id: "t-vague-essential",
    text: "Three essential salts your body craves.",
    truthPct: 55,
    socialImpactCost: 4,
    marketingBoost: 7,
  },
  {
    id: "t-vague-power",
    text: "Power for the relentless.",
    truthPct: 30,
    socialImpactCost: 5,
    marketingBoost: 8,
  },
  // === MORE OPTIONS ===
  {
    id: "t-edge-unleashed",
    text: "Unleash your inner storm.",
    truthPct: 15,
    socialImpactCost: 7,
    marketingBoost: 10,
    fits: ["athletes", "teens"],
  },
  {
    id: "t-honest-watersugar",
    text: "Water, salt, and a little sugar.",
    truthPct: 100,
    socialImpactCost: 0,
    marketingBoost: 1,
  },
  {
    id: "t-kid-rainbow",
    text: "Rainbow flavors. Rainbow energy.",
    truthPct: 60,
    socialImpactCost: 10,
    marketingBoost: 10,
    fits: ["kids"],
  },
  {
    id: "t-teen-tiktok",
    text: "Your FYP made you buy it.",
    truthPct: 95,
    socialImpactCost: 9,
    marketingBoost: 10,
    fits: ["teens"],
  },
  {
    id: "t-life-mindful",
    text: "Mindful hydration. Mindful you.",
    truthPct: 60,
    socialImpactCost: 2,
    marketingBoost: 7,
    fits: ["lifestyle"],
  },
  {
    id: "t-life-bio",
    text: "Biohacker-grade electrolytes.",
    truthPct: 25,
    socialImpactCost: 4,
    marketingBoost: 9,
    fits: ["lifestyle"],
  },
  {
    id: "t-med-iv",
    text: "Like an IV bag, but cooler.",
    truthPct: 20,
    socialImpactCost: 3,
    marketingBoost: 8,
    fits: ["medical", "lifestyle"],
  },
  {
    id: "t-athlete-bloodline",
    text: "Run the bloodline of champions.",
    truthPct: 8,
    socialImpactCost: 7,
    marketingBoost: 10,
    fits: ["athletes"],
  },
  {
    id: "t-vague-cellular",
    text: "Cellular precision in every sip.",
    truthPct: 25,
    socialImpactCost: 4,
    marketingBoost: 8,
  },
  {
    id: "t-vague-supercharge",
    text: "Supercharge what's already there.",
    truthPct: 35,
    socialImpactCost: 4,
    marketingBoost: 8,
  },
  {
    id: "t-vague-hydrolock",
    text: "Hydro-lock technology, activated.",
    truthPct: 5,
    socialImpactCost: 6,
    marketingBoost: 9,
  },
  {
    id: "t-vague-elemental",
    text: "Elemental. Essential. Effortless.",
    truthPct: 40,
    socialImpactCost: 3,
    marketingBoost: 8,
  },
];
