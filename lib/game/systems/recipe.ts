import { ingredients, ingredientById } from "../data/ingredients";
import type { Recipe } from "../types";

const SERVING_ML = 500;

export function calcProductionCost(recipe: Recipe): number {
  let cost = 0;
  for (const [id, amount] of Object.entries(recipe)) {
    const ing = ingredientById[id];
    if (!ing) continue;
    cost += ing.costPerUnit * amount;
  }
  // Add fixed overhead per bottle (bottle, label, water, transport)
  return cost + 0.18;
}

export function calcSodiumMg(recipe: Recipe): number {
  return recipe["na"] ?? 0;
}

export function calcPotassiumMg(recipe: Recipe): number {
  return recipe["k"] ?? 0;
}

export function calcSugarG(recipe: Recipe): number {
  return (recipe["hfcs"] ?? 0) + (recipe["cane"] ?? 0) + (recipe["dex"] ?? 0);
}

export function calcCalories(recipe: Recipe): number {
  // 4 cal/g of sugar; non-sugar contribution negligible
  return Math.round(calcSugarG(recipe) * 4);
}

export function calcCaffeineG(recipe: Recipe): number {
  return recipe["caffeine"] ?? 0;
}

export function calcMarketability(recipe: Recipe): number {
  // Pillar scoring: each "story pillar" (ions, sweetness, flavor, premium,
  // synergy) is capped independently so dumping every slider to max can't
  // trivially yield 10. A focused recipe scores well; a kitchen-sink recipe
  // is penalized.
  const ion = ionPillar(recipe);
  const sweet = sweetPillar(recipe);
  const flavor = flavorPillar(recipe);
  const premium = premiumPillar(recipe);
  const synergy = synergyPillar(recipe);
  const base = ion + sweet + flavor + premium + synergy;

  const activeCount = ingredients.filter(
    (i) => (recipe[i.id] ?? 0) > 0,
  ).length;
  const focus =
    activeCount <= 6
      ? 1
      : Math.max(0.4, 1 - (activeCount - 6) * 0.08);

  return Math.max(0, Math.min(10, base * focus));
}

function ionPillar(recipe: Recipe): number {
  // Best ion at full credit + small bonus for a second ion. Cap 3.
  const present = ["na", "k", "ca", "mg"]
    .filter((id) => (recipe[id] ?? 0) > 0)
    .map((id) => {
      const ing = ingredientById[id];
      const sat = Math.min(1, (recipe[id] ?? 0) / ing.maxAmount);
      return { id, score: ing.marketability * sat };
    })
    .sort((a, b) => b.score - a.score);
  if (!present.length) return 0;
  const best = present[0].score / 7 * 2.5;
  const second = present[1] ? 0.5 : 0;
  return Math.min(3, best + second);
}

function sweetPillar(recipe: Recipe): number {
  // Best sweetener counts; mixing 3+ sweeteners penalized.
  const sugarIds = ["hfcs", "cane", "dex", "sucralose", "stevia"];
  const present = sugarIds
    .filter((id) => (recipe[id] ?? 0) > 0)
    .map((id) => {
      const ing = ingredientById[id];
      const sat = Math.min(1, (recipe[id] ?? 0) / ing.maxAmount);
      return { score: ing.marketability * sat };
    })
    .sort((a, b) => b.score - a.score);
  if (!present.length) return 0;
  let s = present[0].score / 9 * 2.5;
  if (present.length >= 3) s -= 1;
  if (present.length >= 4) s -= 1;
  return Math.max(0, Math.min(3, s));
}

function flavorPillar(recipe: Recipe): number {
  const nat = Math.min(1, (recipe["natflavor"] ?? 0) / 3);
  const art = Math.min(1, (recipe["artflavor"] ?? 0) / 3);
  const dye =
    (recipe["red40"] ?? 0) > 0 || (recipe["blue1"] ?? 0) > 0 ? 0.5 : 0;
  // Conflicting message: natural + artificial together
  if (nat > 0 && art > 0) return Math.max(0, dye - 0.4);
  if (nat > 0) return Math.min(2, nat * 1.8 + dye);
  if (art > 0) return Math.min(2, art * 0.6 + dye);
  return Math.min(2, dye);
}

function premiumPillar(recipe: Recipe): number {
  const count = ["bcaa", "caffeine", "bvits"].filter(
    (id) => (recipe[id] ?? 0) > 0,
  ).length;
  return Math.min(3, count * 1.1);
}

function synergyPillar(recipe: Recipe): number {
  let bonus = 0;
  // Classic athlete: meaningful Na + K + a sugar
  if (
    (recipe["na"] ?? 0) >= 100 &&
    (recipe["k"] ?? 0) >= 20 &&
    calcSugarG(recipe) >= 10
  ) {
    bonus += 1.2;
  }
  // Clean natural story: stevia + natural flavor, no artificial/dyes
  if (
    (recipe["stevia"] ?? 0) > 0 &&
    (recipe["natflavor"] ?? 0) > 0 &&
    (recipe["artflavor"] ?? 0) === 0 &&
    (recipe["red40"] ?? 0) === 0 &&
    (recipe["blue1"] ?? 0) === 0
  ) {
    bonus += 1.2;
  }
  // Kid-marketing combo: dyes + plenty of sugar
  if (
    ((recipe["red40"] ?? 0) > 0 || (recipe["blue1"] ?? 0) > 0) &&
    calcSugarG(recipe) >= 20
  ) {
    bonus += 0.8;
  }
  return Math.min(2, bonus);
}

export function validateFDA(recipe: Recipe): {
  warnings: string[];
  severe: boolean;
} {
  const warnings: string[] = [];
  let severe = false;

  const sodium = calcSodiumMg(recipe);
  const sugar = calcSugarG(recipe);
  const caffeine = calcCaffeineG(recipe);

  if (sodium > 600) {
    warnings.push(`Sodium ${sodium}mg/serving exceeds advisable threshold (600mg).`);
    if (sodium > 800) severe = true;
  }
  if (sugar > 40) {
    warnings.push(`Sugar ${sugar}g/serving is above WHO daily added-sugar guidance.`);
    if (sugar > 60) severe = true;
  }
  if (caffeine > 0.2) {
    warnings.push(`Caffeine ${(caffeine * 1000).toFixed(0)}mg/serving is high for general consumption.`);
    if (caffeine > 0.3) severe = true;
  }
  if (sodium === 0 && sugar === 0 && (recipe["sucralose"] ?? 0) === 0) {
    warnings.push("Recipe contains no measurable electrolytes or sweeteners. Effectively flavored water.");
  }

  return { warnings, severe };
}

export interface RecipeStats {
  productionCost: number;
  sodiumMg: number;
  potassiumMg: number;
  sugarG: number;
  calories: number;
  caffeineMg: number;
  marketability: number;
  fda: { warnings: string[]; severe: boolean };
}

export function calcRecipeStats(recipe: Recipe): RecipeStats {
  return {
    productionCost: calcProductionCost(recipe),
    sodiumMg: calcSodiumMg(recipe),
    potassiumMg: calcPotassiumMg(recipe),
    sugarG: calcSugarG(recipe),
    calories: calcCalories(recipe),
    caffeineMg: Math.round(calcCaffeineG(recipe) * 1000),
    marketability: calcMarketability(recipe),
    fda: validateFDA(recipe),
  };
}

export const SERVING_SIZE_ML = SERVING_ML;
