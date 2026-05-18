// Core shared types for Sports Drink Tycoon.

export type Demographic =
  | "athletes"
  | "kids"
  | "teens"
  | "lifestyle"
  | "medical";

export type Channel =
  | "tv"
  | "instagram"
  | "tiktok"
  | "school"
  | "gym"
  | "medical";

export type DistributionChannel =
  | "retail"
  | "vending"
  | "online"
  | "subscription"
  | "school_cafeteria";

export type IngredientCategory =
  | "cation"
  | "anion"
  | "sugar"
  | "acid"
  | "flavor"
  | "premium";

export interface Ingredient {
  id: string;
  name: string;
  symbol?: string;
  charge?: number;
  category: IngredientCategory;
  costPerUnit: number;
  unit: "mg" | "g";
  defaultAmount: number;
  maxAmount: number;
  role: string;
  dailyNeed?: number;
  marketability: number;
  source: string;
  dissociation?: string;
  color: string;
  /** Research node ID required to unlock. Undefined = unlocked at start. */
  research?: string;
  /** Tier 2 chemistry explainer paragraph. */
  chemistry?: string;
  /** Tier 3 deep dive paragraph (Coulombic details). */
  deepDive?: string;
  /** Ionic radius in picometres (cations only). */
  ionicRadiusPm?: number;
}

export type Recipe = Record<string, number>;

export interface Competitor {
  id: string;
  brand: string;
  variant: string;
  servingMl: number;
  sodiumMg: number;
  potassiumMg: number;
  sugarG: number;
  pricePerBottle: number;
  audience: Demographic | "control";
  marketSharePct: number;
  marketingPower: number;
  established: number;
}

export interface TaglineTemplate {
  id: string;
  text: string;
  truthPct: number;
  socialImpactCost: number;
  marketingBoost: number;
  fits?: Demographic[];
}

export interface MarketingCampaign {
  demographic: Demographic;
  channel: Channel;
  taglineId: string | null;
  budget: number;
}

export interface QuarterResult {
  quarter: number;
  revenue: number;
  productionCost: number;
  marketingSpend: number;
  rdSpend: number;
  netProfit: number;
  marketShareDelta: number;
  brandTrustDelta: number;
  socialImpactDelta: number;
  unitsSold: number;
  newsHeadlines: string[];
  eventFired: GameEventRecord | null;
  passiveRevenue?: number;
}

export interface GameEventRecord {
  eventId: string;
  quarter: number;
  title: string;
  description: string;
  effects: EventEffects;
  choiceTakenId?: string;
}

export interface EventEffects {
  cash?: number;
  marketSharePct?: number;
  brandTrust?: number;
  pressSentiment?: number;
  socialImpact?: number;
}

export interface EventChoice {
  id: string;
  label: string;
  description?: string;
  effects: EventEffects;
}

export type EventTrigger =
  | "always"
  | "highSugar"
  | "highSodium"
  | "targetingKids"
  | "lowBrandTrust"
  | "highSocialImpact"
  | "lateGame";

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  trigger: EventTrigger;
  weight: number;
  effects?: EventEffects;
  choices?: EventChoice[];
}

export interface NewsTemplate {
  id: string;
  text: string;
  background: boolean;
  trigger?: EventTrigger;
}

export type EmployeeRoom =
  | "lab"
  | "marketing"
  | "sales"
  | "lobby"
  | "social"
  | "brand";

export interface Employee {
  id: string;
  name: string;
  role: string;
  room: EmployeeRoom;
  hireCost: number;
  salary: number;
  color: string;
  shirtColor: string;
  bio: string;
  bonusText: string;
}

export type EmployeeLevel = 1 | 2 | 3;

export interface InboxMessage {
  id: string;
  quarter: number;
  sender: "news" | "event" | "employee" | "tip" | "achievement";
  subject: string;
  body: string;
  read: boolean;
}

// === Buildings ===

export type BuildingFloor =
  | "office"
  | "production"
  | "lab"
  | "distribution"
  | "executive";

export type BuildingEffectKind =
  | "productionCostMult"
  | "reachMult"
  | "conversionMult"
  | "channelBoost"
  | "researchSpeed"
  | "unlockChannel"
  | "trustPerQuarter"
  | "legalEventDampen"
  | "passiveCash";

export interface BuildingEffect {
  kind: BuildingEffectKind;
  value: number;
  channel?: Channel;
}

export interface BuildingTier {
  cost: number;
  quartersToBuild: number;
  effects: BuildingEffect[];
  description: string;
}

export interface BuildingDef {
  id: string;
  name: string;
  floor: BuildingFloor;
  description: string;
  icon: string;
  tiers: BuildingTier[];
}

export interface BuildingInstance {
  defId: string;
  tier: number; // 0 = unbuilt placeholder; 1..maxTier = active
  building: { quartersLeft: number; targetTier: number } | null;
  slot: number; // floor slot index
}

// === Research ===

export interface ResearchNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  prerequisites: ResearchPrereq[];
  unlocks: ResearchUnlock[];
  position: { x: number; y: number };
}

export type ResearchPrereq =
  | { kind: "research"; id: string }
  | { kind: "building"; defId: string; tier: number };

export type ResearchUnlock = { kind: "ingredient"; id: string };

// === Achievements ===

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  hidden?: boolean;
  goodNews: boolean; // true = celebration, false = mark-of-shame
}

export interface AchievementRecord {
  id: string;
  quarter: number;
}

// === Toasts ===

export interface Toast {
  id: string;
  title: string;
  body: string;
  kind: "good" | "bad" | "info";
  ts: number; // unix ms
}

// === Revenue streams (late game) ===

export interface RevenueStreams {
  merch: boolean;
  licensing: boolean;
  subscription: boolean;
}

// === Panel IDs (functional rooms) ===

export type PanelId = "lab" | "ads" | "sales" | "rd" | "compare" | "inbox";

// === Public health tracking ===

export interface PublicHealthCumulative {
  totalUnitsShipped: number;
  sodiumMgShipped: number; // cumulative across all units
  sugarGShipped: number;
  unitsToKids: number;
  unitsToTeens: number;
  sodiumMgToKids: number;
  sugarGToKids: number;
  sodiumMgToTeens: number;
  sugarGToTeens: number;
}

// === Press Conference (Argumentation) ===

export interface PressAnswerRecord {
  year: number;
  questionId: string;
  answerId: string;
  defensibility: number; // 0-100
  truthPct: number; // 0-100
  socialImpactDelta: number;
}
