import { achievements, achievementsById } from "../data/achievements";
import type { AchievementRecord } from "../types";

export interface AchievementCheckState {
  quarter: number;
  cash: number;
  lifetimeRevenue: number;
  marketSharePct: number;
  brandTrust: number;
  pressSentiment: number;
  socialImpact: number;
  sodiumMg: number;
  sugarG: number;
  hiredEmployeeCount: number;
  highestStaffLevel: number;
  researchCount: number;
  totalResearchCount: number;
  filledBuildingSlotsByFloor: Record<string, number>;
  consecutiveHighSodium: number;
  consecutiveHighSugar: number;
  hasSchoolDeal: boolean;
  hasLawsuit: boolean;
  reachedEnd: boolean;
  alreadyUnlocked: Set<string>;
}

export function checkAchievements(s: AchievementCheckState): string[] {
  const newly: string[] = [];
  const add = (id: string) => {
    if (!s.alreadyUnlocked.has(id) && achievementsById[id]) newly.push(id);
  };

  if (s.lifetimeRevenue > 0) add("first-bottle");
  if (s.lifetimeRevenue >= 1_000_000) add("millionaire");
  if (s.lifetimeRevenue >= 5_000_000) add("fivemillionaire");
  if (s.marketSharePct >= 30) add("industry-titan");
  if (s.brandTrust >= 85) add("peoples-champion");
  if (s.pressSentiment <= -50) add("public-enemy");
  if (s.reachedEnd && s.cash >= 500_000 && s.socialImpact <= 30)
    add("ethical-profit");
  if (s.hasSchoolDeal) add("school-deal");
  if (s.hasLawsuit) add("first-lawsuit");
  if (s.socialImpact >= 100) add("whistleblower");
  if (s.consecutiveHighSodium >= 3) add("big-sodium");
  if (s.consecutiveHighSugar >= 3) add("sugar-junkie");
  if (s.researchCount === s.totalResearchCount && s.totalResearchCount > 0)
    add("tech-pioneer");
  const filledFloors = Object.entries(s.filledBuildingSlotsByFloor)
    .filter(([f, n]) => n >= 3 && f !== "executive").length;
  if (filledFloors >= 3) add("empire-builder");
  if (s.hiredEmployeeCount >= 6) add("full-staff");
  if (s.highestStaffLevel >= 3) add("maxed-out");
  if (s.reachedEnd) add("survivor");
  if (s.cash < 0) add("bankrupt");

  return newly;
}

export function recordAchievement(
  id: string,
  quarter: number,
): AchievementRecord {
  return { id, quarter };
}

export const ALL_ACHIEVEMENTS = achievements;
