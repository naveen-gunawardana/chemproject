import type { PublicHealthCumulative } from "../types";

// Assumed bottles per unique consumer per quarter (rough repeat-buyer estimate)
const BOTTLES_PER_KID_PER_QUARTER = 8;
const BOTTLES_PER_TEEN_PER_QUARTER = 6;

// NIH adequate intakes (mg/day) — children 9-13, adolescents 14-18
const KID_SODIUM_AI = 1800; // mg/day
const KID_SUGAR_GUIDANCE = 25; // g/day added sugar (WHO/AHA for children)
const TEEN_SODIUM_AI = 2300;
const TEEN_SUGAR_GUIDANCE = 25;

const QUARTER_DAYS = 91; // 13 weeks

export interface HealthMetrics {
  totalUnits: number;
  sodiumMgShipped: number;
  sugarGShipped: number;

  uniqueKidsReached: number;
  uniqueTeensReached: number;
  uniqueYouthReached: number;

  // Per-kid daily averages from your drink alone
  avgKidDailySodiumFromYou: number; // mg/day
  avgKidDailySugarFromYou: number; // g/day

  // % of daily kid recommendations contributed by your drink
  kidSodiumShareOfDailyPct: number;
  kidSugarShareOfDailyPct: number;

  // Rough modeled health outcomes (illustrative)
  estimatedERVisits: number;
  childhoodObesityContribution: number; // arbitrary index 0-100

  // Aggregate sugar served (helpful "weight" framing)
  totalSugarKg: number;
  totalSodiumKg: number;
}

export function computeHealthMetrics(
  c: PublicHealthCumulative,
  quartersPlayed: number,
): HealthMetrics {
  const uniqueKidsReached = c.unitsToKids
    ? Math.round(c.unitsToKids / (BOTTLES_PER_KID_PER_QUARTER * Math.max(1, quartersPlayed)))
    : 0;
  const uniqueTeensReached = c.unitsToTeens
    ? Math.round(c.unitsToTeens / (BOTTLES_PER_TEEN_PER_QUARTER * Math.max(1, quartersPlayed)))
    : 0;
  const uniqueYouthReached = uniqueKidsReached + uniqueTeensReached;

  // Per-kid daily averages
  // c.sodiumMgToKids = total mg of sodium consumed by kid customers across all quarters
  // dailySodiumPerKid = total / (uniqueKids * dayCount)
  const dayCount = Math.max(1, quartersPlayed) * QUARTER_DAYS;
  const avgKidDailySodiumFromYou =
    uniqueKidsReached > 0
      ? c.sodiumMgToKids / uniqueKidsReached / dayCount
      : 0;
  const avgKidDailySugarFromYou =
    uniqueKidsReached > 0
      ? c.sugarGToKids / uniqueKidsReached / dayCount
      : 0;

  const kidSodiumShareOfDailyPct =
    (avgKidDailySodiumFromYou / KID_SODIUM_AI) * 100;
  const kidSugarShareOfDailyPct =
    (avgKidDailySugarFromYou / KID_SUGAR_GUIDANCE) * 100;

  // ER visits estimate: rough — assumes 1 in 50,000 units involving high-sodium
  // overload triggers a documented ER visit. Multiplied by overload factor.
  const sodiumPerUnit =
    c.totalUnitsShipped > 0
      ? c.sodiumMgShipped / c.totalUnitsShipped
      : 0;
  const sodiumOverloadFactor = Math.max(0, sodiumPerUnit / 400); // baseline 400 mg ~ avg
  const estimatedERVisits = Math.round(
    (c.totalUnitsShipped / 50_000) * sodiumOverloadFactor,
  );

  // Childhood obesity contribution (illustrative composite 0-100)
  // Driven by total sugar to kids + repeat exposure
  const obesityRaw =
    (c.sugarGToKids / 100_000) * 0.5 +
    (uniqueKidsReached / 1000) * 0.5;
  const childhoodObesityContribution = Math.min(100, Math.round(obesityRaw));

  return {
    totalUnits: c.totalUnitsShipped,
    sodiumMgShipped: c.sodiumMgShipped,
    sugarGShipped: c.sugarGShipped,
    uniqueKidsReached,
    uniqueTeensReached,
    uniqueYouthReached,
    avgKidDailySodiumFromYou: round1(avgKidDailySodiumFromYou),
    avgKidDailySugarFromYou: round1(avgKidDailySugarFromYou),
    kidSodiumShareOfDailyPct: round1(kidSodiumShareOfDailyPct),
    kidSugarShareOfDailyPct: round1(kidSugarShareOfDailyPct),
    estimatedERVisits,
    childhoodObesityContribution,
    totalSugarKg: round1(c.sugarGShipped / 1000),
    totalSodiumKg: round1(c.sodiumMgShipped / 1_000_000),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export const HEALTH_SOURCES = [
  {
    label: "AHA · sodium",
    body: 'American Heart Association. (2019). "Dietary Sodium and Cardiovascular Disease Risk." Circulation, 139(9).',
  },
  {
    label: "Harvard SPH · kids",
    body: 'Harvard T.H. Chan School of Public Health. (2024). "Sports & Energy Drinks — The Nutrition Source."',
  },
  {
    label: "NIH · daily intake",
    body: 'NIH Office of Dietary Supplements. (2024). "Sodium, Potassium, and Chloride — Fact Sheets."',
  },
  {
    label: "WHO · sugar",
    body: 'World Health Organization. (2015). "Guideline: Sugars intake for adults and children." (<25g added sugar / day for children.)',
  },
];
