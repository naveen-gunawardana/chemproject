import { taglines } from "../data/taglines";
import { events } from "../data/events";
import { employeeById } from "../data/employees";
import type {
  BuildingInstance,
  Demographic,
  EmployeeLevel,
  GameEvent,
  MarketingCampaign,
  QuarterResult,
  Recipe,
  RevenueStreams,
} from "../types";
import { calcRecipeStats } from "./recipe";
import { computeBuildingBonuses } from "./building";

const DEMO_POOL: Record<Demographic, number> = {
  athletes: 8_000_000,
  kids: 22_000_000,
  teens: 16_000_000,
  lifestyle: 60_000_000,
  medical: 4_000_000,
};

function demographicFitScore(
  demo: Demographic,
  recipe: Recipe,
  marketability: number,
): number {
  const stats = calcRecipeStats(recipe);
  let fit = marketability;
  switch (demo) {
    case "athletes":
      if (stats.sodiumMg >= 150 && stats.sodiumMg <= 400) fit += 2;
      if (stats.sugarG >= 10 && stats.sugarG <= 30) fit += 1;
      break;
    case "kids":
      if (stats.sugarG >= 15) fit += 3;
      if ((recipe["red40"] ?? 0) > 0 || (recipe["blue1"] ?? 0) > 0) fit += 2;
      if (stats.caffeineMg > 0) fit -= 4;
      break;
    case "teens":
      if (stats.sugarG >= 5 || stats.caffeineMg > 0) fit += 2;
      break;
    case "lifestyle":
      if ((recipe["stevia"] ?? 0) > 0 || (recipe["natflavor"] ?? 0) > 0)
        fit += 2;
      if (stats.sugarG > 25) fit -= 2;
      break;
    case "medical":
      if (stats.sodiumMg >= 200 && stats.sugarG <= 10) fit += 3;
      if (stats.sugarG > 15) fit -= 4;
      break;
  }
  return Math.max(0, Math.min(15, fit));
}

const CHANNEL_REACH: Record<string, number> = {
  tv: 0.45,
  instagram: 0.6,
  tiktok: 0.85,
  school: 0.95,
  gym: 0.55,
  medical: 0.4,
};

const CHANNEL_KIDS_BONUS: Record<string, number> = {
  school: 4,
  tiktok: 2,
  instagram: 1,
};

// Tuned so a basic recipe + modest marketing breaks even,
// and a well-formulated recipe with a tagline turns a meaningful profit.
const CONVERSION_BASELINE = 0.003;

export interface SimContext {
  recipe: Recipe;
  price: number;
  campaign: MarketingCampaign;
  rdSpend: number;
  prevMarketSharePct: number;
  prevBrandTrust: number;
  prevPressSentiment: number;
  quarter: number;
  hiredEmployees: string[];
  staffLevels: Record<string, EmployeeLevel>;
  buildings: BuildingInstance[];
  revenueStreams: RevenueStreams;
}

interface StaffBonuses {
  productionCostMult: number;
  reachMult: number;
  conversionMult: number;
  negativeEventMult: number;
  channelBoosts: Record<string, number>;
  brandTrustMult: number;
  taglineTruthBonus: number;
}

function computeStaffBonuses(
  hired: string[],
  staffLevels: Record<string, EmployeeLevel>,
): StaffBonuses {
  const LEVEL_MULT: Record<number, number> = { 1: 1, 2: 1.4, 3: 1.8 };
  const b: StaffBonuses = {
    productionCostMult: 1,
    reachMult: 1,
    conversionMult: 1,
    negativeEventMult: 1,
    channelBoosts: {},
    brandTrustMult: 1,
    taglineTruthBonus: 0,
  };
  for (const id of hired) {
    const lvl = staffLevels[id] ?? 1;
    const mult = LEVEL_MULT[lvl] ?? 1;
    switch (id) {
      case "chemist":
        // L1 -5%, L2 -7%, L3 -9% via multiplied "savings"
        b.productionCostMult *= 1 - 0.05 * mult;
        break;
      case "marketing":
        b.reachMult *= 1 + 0.25 * mult;
        break;
      case "sales":
        b.conversionMult *= 1 + 0.15 * mult;
        break;
      case "lobbyist":
        b.negativeEventMult *= 1 - 0.3 * (mult / 1.8);
        break;
      case "influencer":
        b.channelBoosts["tiktok"] =
          (b.channelBoosts["tiktok"] ?? 1) * (1 + 0.4 * mult);
        b.channelBoosts["instagram"] =
          (b.channelBoosts["instagram"] ?? 1) * (1 + 0.4 * mult);
        break;
      case "brand":
        b.brandTrustMult *= 1 + 0.3 * mult;
        b.taglineTruthBonus += 5 * mult;
        break;
    }
  }
  return b;
}

export interface SimResult extends QuarterResult {}

export function simulateQuarter(ctx: SimContext): SimResult {
  const stats = calcRecipeStats(ctx.recipe);
  const buildingBonus = computeBuildingBonuses(ctx.buildings);
  const staffBonus = computeStaffBonuses(ctx.hiredEmployees, ctx.staffLevels);
  const ceoSuiteMult = buildingBonus.hasCEOSuite ? 1.1 : 1;

  const tagline = ctx.campaign.taglineId
    ? taglines.find((t) => t.id === ctx.campaign.taglineId) ?? null
    : null;

  const demoPool = DEMO_POOL[ctx.campaign.demographic];
  const channelMult =
    (CHANNEL_REACH[ctx.campaign.channel] ?? 0.4) *
    (staffBonus.channelBoosts[ctx.campaign.channel] ?? 1) *
    (buildingBonus.channelBoosts[ctx.campaign.channel] ?? 1);
  const budgetReachBoost = Math.min(1, ctx.campaign.budget / 250_000);
  const reach =
    demoPool *
    channelMult *
    (0.3 + budgetReachBoost * 0.7) *
    staffBonus.reachMult *
    ceoSuiteMult *
    buildingBonus.reachMult;

  const fit = demographicFitScore(
    ctx.campaign.demographic,
    ctx.recipe,
    stats.marketability,
  );

  const effectiveTruth = tagline
    ? Math.min(100, tagline.truthPct + staffBonus.taglineTruthBonus)
    : 50;
  const taglineMult = tagline
    ? 0.7 + tagline.marketingBoost * 0.05 + effectiveTruth * 0.002
    : 0.4;

  const priceMult = priceCurve(ctx.price);
  const trustMult = 0.5 + ctx.prevBrandTrust / 200;

  const conversion = Math.max(
    0,
    CONVERSION_BASELINE *
      fit *
      taglineMult *
      priceMult *
      trustMult *
      staffBonus.conversionMult *
      buildingBonus.conversionMult,
  );
  const unitsSold = Math.round(reach * conversion);

  const revenue = unitsSold * ctx.price;
  const productionCost =
    unitsSold *
    stats.productionCost *
    staffBonus.productionCostMult *
    buildingBonus.productionCostMult;
  const marketingSpend = ctx.campaign.budget;
  const rdSpend = ctx.rdSpend;

  // Passive revenue from late-game streams + buildings
  let passive = buildingBonus.passiveCash;
  if (ctx.revenueStreams.merch) passive += 5_000;
  if (ctx.revenueStreams.licensing) passive += 20_000;
  if (ctx.revenueStreams.subscription) passive += 30_000;

  const netProfit =
    revenue - productionCost - marketingSpend - rdSpend + passive;

  const marketShareDelta = Math.max(
    -3,
    Math.min(3, (unitsSold - reach * 0.0002) / 250_000),
  );

  let brandTrustDelta = 0;
  if (tagline) brandTrustDelta += (effectiveTruth - 50) / 25;
  if (stats.fda.severe) brandTrustDelta -= 8;
  else if (stats.fda.warnings.length) brandTrustDelta -= 2;
  if (ctx.revenueStreams.licensing) brandTrustDelta -= 2;
  if (ctx.revenueStreams.subscription) brandTrustDelta += 1;
  brandTrustDelta *= staffBonus.brandTrustMult;
  brandTrustDelta += buildingBonus.trustPerQuarter;

  let socialImpactDelta = 0;
  socialImpactDelta += stats.sugarG * 0.25;
  if (
    ctx.campaign.demographic === "kids" ||
    ctx.campaign.demographic === "teens"
  ) {
    socialImpactDelta +=
      4 + (CHANNEL_KIDS_BONUS[ctx.campaign.channel] ?? 0);
    if (stats.sugarG > 15) socialImpactDelta += 3;
  }
  if (tagline) socialImpactDelta += tagline.socialImpactCost;

  const newsHeadlines = generateNews(stats, ctx, tagline);

  const eligibleEvents = events.filter((e) =>
    eventApplies(e, stats, ctx, socialImpactDelta),
  );
  const weightedEvents = eligibleEvents.map((e) => {
    const isNegative = isNegativeEvent(e);
    return isNegative
      ? {
          ...e,
          weight: e.weight * staffBonus.negativeEventMult * buildingBonus.legalEventDampen,
        }
      : e;
  });
  const eventFired = pickWeighted(weightedEvents);

  return {
    quarter: ctx.quarter,
    revenue: Math.round(revenue),
    productionCost: Math.round(productionCost),
    marketingSpend: Math.round(marketingSpend),
    rdSpend: Math.round(rdSpend),
    netProfit: Math.round(netProfit),
    marketShareDelta: round1(marketShareDelta),
    brandTrustDelta: round1(brandTrustDelta),
    socialImpactDelta: round1(socialImpactDelta),
    unitsSold,
    newsHeadlines,
    passiveRevenue: Math.round(passive),
    eventFired: eventFired
      ? {
          eventId: eventFired.id,
          quarter: ctx.quarter,
          title: eventFired.title,
          description: eventFired.description,
          effects: eventFired.effects ?? {},
        }
      : null,
  };
}

function priceCurve(price: number): number {
  if (price < 1.0) return 1.4;
  if (price < 1.5) return 1.2;
  if (price < 2.5) return 1.0;
  if (price < 4.0) return 0.75;
  return 0.5;
}

function eventApplies(
  e: GameEvent,
  stats: ReturnType<typeof calcRecipeStats>,
  ctx: SimContext,
  socialImpactDelta: number,
): boolean {
  switch (e.trigger) {
    case "always":
      return true;
    case "highSugar":
      return stats.sugarG > 20;
    case "highSodium":
      return stats.sodiumMg > 450;
    case "targetingKids":
      return ctx.campaign.demographic === "kids" || ctx.campaign.demographic === "teens";
    case "lowBrandTrust":
      return ctx.prevBrandTrust < 40;
    case "highSocialImpact":
      return socialImpactDelta > 12;
    case "lateGame":
      return ctx.quarter >= 9;
  }
}

function isNegativeEvent(e: GameEvent): boolean {
  const negativeTitles = [
    "FDA",
    "Backlash",
    "Lawsuit",
    "Hearing",
    "Whistleblower",
    "Tax",
    "Disruption",
  ];
  return negativeTitles.some((t) => e.title.includes(t));
}

function pickWeighted<T extends { weight: number }>(items: T[]): T | null {
  if (!items.length) return null;
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

function generateNews(
  stats: ReturnType<typeof calcRecipeStats>,
  ctx: SimContext,
  tagline: { text: string; truthPct: number } | null,
): string[] {
  const lines: string[] = [];
  if (stats.fda.severe) lines.push(`FDA flags severe label issues with your latest batch.`);
  if (stats.sugarG > 25 && ctx.campaign.demographic === "kids") {
    lines.push(`Pediatricians' association warns about high-sugar drinks marketed to children.`);
  }
  if (ctx.campaign.channel === "school") {
    lines.push(`Parents at local PTA question your school-district sponsorship.`);
  }
  if (tagline && tagline.truthPct < 30) {
    lines.push(`Watchdog rates "${tagline.text}" as misleading.`);
  }
  if (stats.marketability < 3) {
    lines.push(`Industry analysts call your latest formula "uninspired".`);
  }
  return lines.slice(0, 2);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function computeQuarterlySalaries(
  hired: string[],
  staffLevels: Record<string, EmployeeLevel>,
): number {
  const LEVEL_SALARY_MULT: Record<number, number> = { 1: 1, 2: 1.7, 3: 2.5 };
  return hired.reduce((sum, id) => {
    const emp = employeeById[id];
    if (!emp) return sum;
    const lvl = staffLevels[id] ?? 1;
    return sum + Math.round(emp.salary * (LEVEL_SALARY_MULT[lvl] ?? 1));
  }, 0);
}

export interface QuarterProjection {
  unitsSold: number;
  revenue: number;
  productionCost: number;
  marketingSpend: number;
  rdSpend: number;
  salaries: number;
  passive: number;
  netProfit: number;
}

// Deterministic forecast for the NEXT End Quarter result. Excludes random
// events. Used by the HUD to warn the player before they commit.
export function projectQuarter(ctx: SimContext): QuarterProjection {
  const stats = calcRecipeStats(ctx.recipe);
  const buildingBonus = computeBuildingBonuses(ctx.buildings);
  const staffBonus = computeStaffBonuses(ctx.hiredEmployees, ctx.staffLevels);
  const ceoSuiteMult = buildingBonus.hasCEOSuite ? 1.1 : 1;
  const tagline = ctx.campaign.taglineId
    ? taglines.find((t) => t.id === ctx.campaign.taglineId) ?? null
    : null;

  const demoPool = DEMO_POOL[ctx.campaign.demographic];
  const channelMult =
    (CHANNEL_REACH[ctx.campaign.channel] ?? 0.4) *
    (staffBonus.channelBoosts[ctx.campaign.channel] ?? 1) *
    (buildingBonus.channelBoosts[ctx.campaign.channel] ?? 1);
  const budgetReachBoost = Math.min(1, ctx.campaign.budget / 250_000);
  const reach =
    demoPool *
    channelMult *
    (0.3 + budgetReachBoost * 0.7) *
    staffBonus.reachMult *
    ceoSuiteMult *
    buildingBonus.reachMult;

  const fit = demographicFitScore(
    ctx.campaign.demographic,
    ctx.recipe,
    stats.marketability,
  );
  const effectiveTruth = tagline
    ? Math.min(100, tagline.truthPct + staffBonus.taglineTruthBonus)
    : 50;
  const taglineMult = tagline
    ? 0.7 + tagline.marketingBoost * 0.05 + effectiveTruth * 0.002
    : 0.4;
  const priceMult = priceCurve(ctx.price);
  const trustMult = 0.5 + ctx.prevBrandTrust / 200;

  const conversion = Math.max(
    0,
    CONVERSION_BASELINE *
      fit *
      taglineMult *
      priceMult *
      trustMult *
      staffBonus.conversionMult *
      buildingBonus.conversionMult,
  );
  const unitsSold = Math.round(reach * conversion);
  const revenue = unitsSold * ctx.price;
  const productionCost =
    unitsSold *
    stats.productionCost *
    staffBonus.productionCostMult *
    buildingBonus.productionCostMult;
  const marketingSpend = ctx.campaign.budget;
  const rdSpend = ctx.rdSpend;
  const salaries = computeQuarterlySalaries(
    ctx.hiredEmployees,
    ctx.staffLevels,
  );

  let passive = buildingBonus.passiveCash;
  if (ctx.revenueStreams.merch) passive += 5_000;
  if (ctx.revenueStreams.licensing) passive += 20_000;
  if (ctx.revenueStreams.subscription) passive += 30_000;

  const netProfit =
    revenue - productionCost - marketingSpend - rdSpend - salaries + passive;

  return {
    unitsSold,
    revenue: Math.round(revenue),
    productionCost: Math.round(productionCost),
    marketingSpend,
    rdSpend,
    salaries,
    passive: Math.round(passive),
    netProfit: Math.round(netProfit),
  };
}
