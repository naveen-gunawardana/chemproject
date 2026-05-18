"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { defaultRecipe, ingredientById } from "./data/ingredients";
import {
  simulateQuarter,
  computeQuarterlySalaries,
} from "./systems/simulate";
import {
  tickConstruction,
} from "./systems/building";
import { canResearch } from "./systems/research";
import { researchById, researchNodes } from "./data/research";
import { buildingsByDef } from "./data/buildings";
import { employeeById } from "./data/employees";
import {
  checkAchievements,
  recordAchievement,
} from "./systems/achievements";
import { achievementsById } from "./data/achievements";
import type {
  AchievementRecord,
  BuildingFloor,
  BuildingInstance,
  Demographic,
  Channel,
  DistributionChannel,
  EmployeeLevel,
  EventEffects,
  GameEvent,
  GameEventRecord,
  InboxMessage,
  MarketingCampaign,
  PressAnswerRecord,
  PublicHealthCumulative,
  QuarterResult,
  Recipe,
  RevenueStreams,
  Toast,
} from "./types";
import { events as eventCatalog } from "./data/events";
import { calcRecipeStats } from "./systems/recipe";

export type GamePhase =
  | "title"
  | "playing"
  | "event"
  | "quarter-end"
  | "quarter-transition"
  | "press-conference"
  | "game-over";

export interface GameState {
  // Meta
  phase: GamePhase;
  companyName: string;
  mission: string;
  brandColor: string;

  // Time
  quarter: number;
  year: number;

  // Economic
  cash: number;
  marketSharePct: number;
  brandTrust: number;
  pressSentiment: number;
  socialImpact: number;
  lifetimeRevenue: number;

  // Player decisions
  recipe: Recipe;
  pricePerBottle: number;
  campaign: MarketingCampaign;
  distribution: Record<DistributionChannel, boolean>;
  rdSpendThisQuarter: number;

  // Staffing
  hiredEmployees: string[];
  staffLevels: Record<string, EmployeeLevel>;

  // Buildings
  buildings: BuildingInstance[];

  // Research
  researchUnlocked: string[];

  // Revenue streams
  revenueStreams: RevenueStreams;

  // Tracking for achievements
  consecutiveHighSodium: number;
  consecutiveHighSugar: number;
  hasSchoolDeal: boolean;
  hasLawsuit: boolean;

  // Public health cumulative tracker (for Market Research panel)
  publicHealthCumulative: PublicHealthCumulative;

  // Press conference records (Argumentation)
  pressAnswers: PressAnswerRecord[];

  // Records
  history: QuarterResult[];
  events: GameEventRecord[];
  newsLog: { quarter: number; text: string }[];
  inbox: InboxMessage[];
  achievementsUnlocked: AchievementRecord[];
  toasts: Toast[];

  // Modal
  pendingEvent: GameEvent | null;
  lastResult: QuarterResult | null;

  // Actions
  initGame: (input: {
    companyName: string;
    mission: string;
    brandColor: string;
  }) => void;
  setRecipeAmount: (ingredientId: string, amount: number) => void;
  setPrice: (price: number) => void;
  setCampaign: (partial: Partial<MarketingCampaign>) => void;
  toggleDistribution: (ch: DistributionChannel) => void;
  setRdSpend: (amount: number) => void;
  hireEmployee: (id: string) => void;
  fireEmployee: (id: string) => void;
  promoteEmployee: (id: string) => void;
  queueBuilding: (defId: string, floor: BuildingFloor, slot: number) => void;
  upgradeBuilding: (instIdx: number) => void;
  startResearch: (nodeId: string) => void;
  toggleRevenueStream: (stream: keyof RevenueStreams) => void;
  markInboxRead: (id: string) => void;
  markAllInboxRead: () => void;
  endQuarter: () => void;
  resolveEvent: (choiceId?: string) => void;
  dismissResult: () => void;
  beginNextQuarter: () => void;
  submitPressAnswer: (
    questionId: string,
    answerId: string,
    defensibility: number,
    truthPct: number,
    socialImpactDelta: number,
  ) => void;
  completePressConference: () => void;
  pushToast: (t: Omit<Toast, "id" | "ts">) => void;
  dismissToast: (id: string) => void;
  resetGame: () => void;
}

const initialRecipe: Recipe = { ...defaultRecipe };
const initialCampaign: MarketingCampaign = {
  demographic: "athletes",
  channel: "tv",
  taglineId: null,
  budget: 15_000,
};
const initialDistribution: Record<DistributionChannel, boolean> = {
  retail: true,
  vending: false,
  online: false,
  subscription: false,
  school_cafeteria: false,
};
const initialRevenueStreams: RevenueStreams = {
  merch: false,
  licensing: false,
  subscription: false,
};

const initialPublicHealth: PublicHealthCumulative = {
  totalUnitsShipped: 0,
  sodiumMgShipped: 0,
  sugarGShipped: 0,
  unitsToKids: 0,
  unitsToTeens: 0,
  sodiumMgToKids: 0,
  sugarGToKids: 0,
  sodiumMgToTeens: 0,
  sugarGToTeens: 0,
};

function pushInbox(
  state: GameState,
  msg: Omit<InboxMessage, "id" | "read">,
): void {
  const id = `${msg.quarter}-${msg.sender}-${state.inbox.length}-${Math.floor(Math.random() * 1000)}`;
  state.inbox.push({ ...msg, id, read: false });
}

function pushToastImmer(
  state: GameState,
  t: Omit<Toast, "id" | "ts">,
): void {
  const id = `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  state.toasts.push({ ...t, id, ts: Date.now() });
  // keep at most 5 toasts on screen
  if (state.toasts.length > 5) state.toasts.shift();
}

const STAFF_PROMOTE_MULT = { 2: 2, 3: 4 } as const;

export const useGame = create<GameState>()(
  persist(
    immer((set, get) => ({
      phase: "title",
      companyName: "",
      mission: "",
      brandColor: "#ff7a1f",
      quarter: 1,
      year: 1,
      cash: 400_000,
      marketSharePct: 22,
      brandTrust: 50,
      pressSentiment: 0,
      socialImpact: 0,
      lifetimeRevenue: 0,
      recipe: { ...initialRecipe },
      pricePerBottle: 2.49,
      campaign: { ...initialCampaign },
      distribution: { ...initialDistribution },
      rdSpendThisQuarter: 0,
      hiredEmployees: [],
      staffLevels: {},
      buildings: [],
      researchUnlocked: ["basic-electrolytes"],
      revenueStreams: { ...initialRevenueStreams },
      consecutiveHighSodium: 0,
      consecutiveHighSugar: 0,
      hasSchoolDeal: false,
      hasLawsuit: false,
      publicHealthCumulative: { ...initialPublicHealth },
      pressAnswers: [],
      history: [],
      events: [],
      newsLog: [],
      inbox: [],
      achievementsUnlocked: [],
      toasts: [],
      pendingEvent: null,
      lastResult: null,

      initGame: ({ companyName, mission, brandColor }) => {
        set((s) => {
          s.companyName = companyName.trim() || "ION+";
          s.mission = mission.trim() || "Hydrate. Win. Repeat.";
          s.brandColor = brandColor;
          s.phase = "playing";
          s.quarter = 1;
          s.year = 1;
          s.cash = 400_000;
          s.marketSharePct = 22;
          s.brandTrust = 50;
          s.pressSentiment = 0;
          s.socialImpact = 0;
          s.lifetimeRevenue = 0;
          s.recipe = { ...initialRecipe };
          s.pricePerBottle = 2.49;
          s.campaign = { ...initialCampaign };
          s.distribution = { ...initialDistribution };
          s.rdSpendThisQuarter = 0;
          s.hiredEmployees = [];
          s.staffLevels = {};
          s.buildings = [];
          s.researchUnlocked = ["basic-electrolytes"];
          s.revenueStreams = { ...initialRevenueStreams };
          s.consecutiveHighSodium = 0;
          s.consecutiveHighSugar = 0;
          s.hasSchoolDeal = false;
          s.hasLawsuit = false;
          s.publicHealthCumulative = { ...initialPublicHealth };
          s.pressAnswers = [];
          s.history = [];
          s.events = [];
          s.newsLog = [];
          s.inbox = [];
          s.achievementsUnlocked = [];
          s.toasts = [];
          s.pendingEvent = null;
          s.lastResult = null;
          pushInbox(s, {
            quarter: 1,
            sender: "tip",
            subject: "Welcome aboard, CEO.",
            body: `You inherited $400K, a basic recipe (5 starter ingredients), and 22% of a fragmented market.\n\nFirst priorities:\n· HQ → BUILD your first floor improvements (Wet Lab, Bottling Line).\n· R&D → RESEARCH new ingredients to expand your formula.\n· LAB → tune the recipe.\n· ADS → pick a demographic.\n\nHit END QUARTER when you're ready. Year 1 is forgiving. Year 3 is not.`,
          });
        });
      },

      setRecipeAmount: (id, amount) =>
        set((s) => {
          s.recipe[id] = Math.max(0, amount);
        }),

      setPrice: (p) =>
        set((s) => {
          s.pricePerBottle = Math.max(0.5, Math.min(8, p));
        }),

      setCampaign: (partial) =>
        set((s) => {
          Object.assign(s.campaign, partial);
        }),

      toggleDistribution: (ch) =>
        set((s) => {
          s.distribution[ch] = !s.distribution[ch];
        }),

      setRdSpend: (amt) =>
        set((s) => {
          s.rdSpendThisQuarter = Math.max(0, amt);
        }),

      hireEmployee: (id) => {
        const emp = employeeById[id];
        if (!emp) return;
        const state = get();
        if (state.hiredEmployees.includes(id)) return;
        if (state.cash < emp.hireCost) return;
        set((s) => {
          s.cash -= emp.hireCost;
          s.hiredEmployees.push(id);
          s.staffLevels[id] = 1;
          pushInbox(s, {
            quarter: s.quarter,
            sender: "employee",
            subject: `${emp.name} starts today.`,
            body: `${emp.name} (${emp.role}) is on the team.\nHire cost: $${emp.hireCost.toLocaleString()}.\nSalary: $${emp.salary.toLocaleString()}/q.\n\n"${emp.bio}"\n\nBonus: ${emp.bonusText}.`,
          });
          pushToastImmer(s, {
            title: "NEW HIRE",
            body: `${emp.name} joined the team.`,
            kind: "good",
          });
        });
      },

      fireEmployee: (id) => {
        set((s) => {
          const emp = employeeById[id];
          if (!emp) return;
          const lvl = s.staffLevels[id] ?? 1;
          const SAL_MULT = { 1: 1, 2: 1.7, 3: 2.5 } as const;
          const severance = Math.round(
            emp.salary * (SAL_MULT[lvl] ?? 1) / 2,
          );
          s.hiredEmployees = s.hiredEmployees.filter((e) => e !== id);
          delete s.staffLevels[id];
          s.cash -= severance;
          pushInbox(s, {
            quarter: s.quarter,
            sender: "employee",
            subject: `${emp.name} has left ${s.companyName}.`,
            body: `${emp.name} (${emp.role}) is no longer on the team. Severance: $${severance.toLocaleString()}.`,
          });
        });
      },

      promoteEmployee: (id) => {
        const state = get();
        const emp = employeeById[id];
        if (!emp || !state.hiredEmployees.includes(id)) return;
        const current = state.staffLevels[id] ?? 1;
        if (current >= 3) return;
        const next = (current + 1) as EmployeeLevel;
        const cost =
          emp.hireCost *
          (STAFF_PROMOTE_MULT[next as 2 | 3] ?? 1);
        if (state.cash < cost) return;
        set((s) => {
          s.cash -= cost;
          s.staffLevels[id] = next;
          pushInbox(s, {
            quarter: s.quarter,
            sender: "employee",
            subject: `${emp.name} promoted to L${next}`,
            body: `Promotion bonus paid: $${cost.toLocaleString()}.\n\nNew level multiplies their bonus output. Salary increases automatically next quarter.`,
          });
          pushToastImmer(s, {
            title: `${emp.name} → L${next}`,
            body: `Bonus multiplied. Salary increased.`,
            kind: "good",
          });
        });
      },

      queueBuilding: (defId, floor, slot) => {
        const def = buildingsByDef[defId];
        if (!def || def.floor !== floor) return;
        const state = get();
        const existing = state.buildings.find(
          (b) =>
            buildingsByDef[b.defId]?.floor === floor && b.slot === slot,
        );
        if (existing) return;
        const tier1 = def.tiers[0];
        if (!tier1) return;
        if (state.cash < tier1.cost) return;
        set((s) => {
          s.cash -= tier1.cost;
          s.buildings.push({
            defId,
            tier: 0,
            building: { quartersLeft: tier1.quartersToBuild, targetTier: 1 },
            slot,
          });
          pushInbox(s, {
            quarter: s.quarter,
            sender: "tip",
            subject: `Construction queued: ${def.name}`,
            body: `${def.name} (T1) will be operational in ${tier1.quartersToBuild} quarter(s). Cost: $${tier1.cost.toLocaleString()}.\n\n${tier1.description}`,
          });
          pushToastImmer(s, {
            title: "CONSTRUCTION",
            body: `${def.name} broke ground.`,
            kind: "info",
          });
        });
      },

      upgradeBuilding: (instIdx) => {
        const state = get();
        const inst = state.buildings[instIdx];
        if (!inst) return;
        const def = buildingsByDef[inst.defId];
        if (!def) return;
        if (inst.building !== null) return;
        const nextTier = inst.tier + 1;
        const tier = def.tiers[nextTier - 1];
        if (!tier) return;
        if (state.cash < tier.cost) return;
        set((s) => {
          s.cash -= tier.cost;
          s.buildings[instIdx].building = {
            quartersLeft: tier.quartersToBuild,
            targetTier: nextTier,
          };
          pushInbox(s, {
            quarter: s.quarter,
            sender: "tip",
            subject: `Upgrading: ${def.name} → T${nextTier}`,
            body: `Upgrade work begins. Operational in ${tier.quartersToBuild} quarter(s). Cost: $${tier.cost.toLocaleString()}.`,
          });
        });
      },

      startResearch: (nodeId) => {
        const node = researchById[nodeId];
        if (!node) return;
        const state = get();
        const check = canResearch(node, state.researchUnlocked, state.buildings);
        if (!check.ok) return;
        if (state.cash < node.cost) return;
        set((s) => {
          s.cash -= node.cost;
          s.researchUnlocked.push(nodeId);
          pushInbox(s, {
            quarter: s.quarter,
            sender: "tip",
            subject: `Research complete: ${node.name}`,
            body: `${node.description}\n\nUnlocks: ${node.unlocks
              .map((u) => ingredientById[u.id]?.name ?? u.id)
              .join(", ")}`,
          });
          pushToastImmer(s, {
            title: "RESEARCHED",
            body: `${node.name} — new ingredients unlocked.`,
            kind: "good",
          });
        });
      },

      toggleRevenueStream: (stream) => {
        set((s) => {
          s.revenueStreams[stream] = !s.revenueStreams[stream];
        });
      },

      markInboxRead: (id) =>
        set((s) => {
          const m = s.inbox.find((m) => m.id === id);
          if (m) m.read = true;
        }),

      markAllInboxRead: () =>
        set((s) => {
          for (const m of s.inbox) m.read = true;
        }),

      endQuarter: () => {
        const state = get();
        const totalSalary = computeQuarterlySalaries(
          state.hiredEmployees,
          state.staffLevels,
        );

        const result = simulateQuarter({
          recipe: state.recipe,
          price: state.pricePerBottle,
          campaign: state.campaign,
          rdSpend: state.rdSpendThisQuarter,
          prevMarketSharePct: state.marketSharePct,
          prevBrandTrust: state.brandTrust,
          prevPressSentiment: state.pressSentiment,
          quarter: state.quarter,
          hiredEmployees: state.hiredEmployees,
          staffLevels: state.staffLevels,
          buildings: state.buildings,
          revenueStreams: state.revenueStreams,
        });

        set((s) => {
          s.cash += result.netProfit - totalSalary;
          s.lifetimeRevenue += Math.max(0, result.revenue);
          s.marketSharePct = Math.max(
            0,
            Math.min(100, s.marketSharePct + result.marketShareDelta),
          );
          s.brandTrust = Math.max(
            0,
            Math.min(100, s.brandTrust + result.brandTrustDelta),
          );
          s.socialImpact = Math.max(0, s.socialImpact + result.socialImpactDelta);
          s.history.push(result);

          // Public health accumulator
          const recipeStatsNow = calcRecipeStats(state.recipe);
          const totalSodiumThisQ = result.unitsSold * recipeStatsNow.sodiumMg;
          const totalSugarThisQ = result.unitsSold * recipeStatsNow.sugarG;
          s.publicHealthCumulative.totalUnitsShipped += result.unitsSold;
          s.publicHealthCumulative.sodiumMgShipped += totalSodiumThisQ;
          s.publicHealthCumulative.sugarGShipped += totalSugarThisQ;
          if (state.campaign.demographic === "kids") {
            s.publicHealthCumulative.unitsToKids += result.unitsSold;
            s.publicHealthCumulative.sodiumMgToKids += totalSodiumThisQ;
            s.publicHealthCumulative.sugarGToKids += totalSugarThisQ;
          } else if (state.campaign.demographic === "teens") {
            s.publicHealthCumulative.unitsToTeens += result.unitsSold;
            s.publicHealthCumulative.sodiumMgToTeens += totalSodiumThisQ;
            s.publicHealthCumulative.sugarGToTeens += totalSugarThisQ;
          }

          // Tick construction
          s.buildings = tickConstruction(s.buildings);

          // Headline news → inbox
          for (const headline of result.newsHeadlines) {
            s.newsLog.push({ quarter: s.quarter, text: headline });
            pushInbox(s, {
              quarter: s.quarter,
              sender: "news",
              subject: headline.length > 60 ? headline.slice(0, 57) + "…" : headline,
              body: headline,
            });
          }
          // Payroll
          if (totalSalary > 0) {
            pushInbox(s, {
              quarter: s.quarter,
              sender: "tip",
              subject: `Payroll posted: $${(totalSalary / 1000).toFixed(1)}K`,
              body: `Salaries deducted: $${totalSalary.toLocaleString()} across ${s.hiredEmployees.length} staff.`,
            });
          }

          // Consecutive trackers (use current recipe)
          const stats = (() => {
            const sodium = s.recipe["na"] ?? 0;
            const sugar = (s.recipe["hfcs"] ?? 0) + (s.recipe["cane"] ?? 0) + (s.recipe["dex"] ?? 0);
            return { sodium, sugar };
          })();
          if (stats.sodium > 500) s.consecutiveHighSodium += 1;
          else s.consecutiveHighSodium = 0;
          if (stats.sugar > 30) s.consecutiveHighSugar += 1;
          else s.consecutiveHighSugar = 0;

          if (result.eventFired) {
            const ev = eventCatalog.find((e) => e.id === result.eventFired!.eventId)!;
            s.pendingEvent = ev;
            s.phase = "event";
            s.lastResult = result;
          } else {
            s.phase = "quarter-end";
            s.lastResult = result;
          }
        });

        // Check achievements after all state updated
        checkAndPushAchievements(get, set);
      },

      resolveEvent: (choiceId) => {
        const state = get();
        const ev = state.pendingEvent;
        if (!ev) return;
        const choice = ev.choices?.find((c) => c.id === choiceId);
        const effects: EventEffects = choice ? choice.effects : ev.effects ?? {};
        set((s) => {
          if (effects.cash) s.cash += effects.cash;
          if (effects.marketSharePct)
            s.marketSharePct = Math.max(
              0,
              Math.min(100, s.marketSharePct + effects.marketSharePct),
            );
          if (effects.brandTrust)
            s.brandTrust = Math.max(
              0,
              Math.min(100, s.brandTrust + effects.brandTrust),
            );
          if (effects.pressSentiment)
            s.pressSentiment = Math.max(
              -100,
              Math.min(100, s.pressSentiment + effects.pressSentiment),
            );
          if (effects.socialImpact)
            s.socialImpact = Math.max(0, s.socialImpact + effects.socialImpact);
          s.events.push({
            eventId: ev.id,
            quarter: s.quarter,
            title: ev.title,
            description: ev.description,
            effects,
            choiceTakenId: choice?.id,
          });
          s.newsLog.push({ quarter: s.quarter, text: ev.title });
          pushInbox(s, {
            quarter: s.quarter,
            sender: "event",
            subject: ev.title,
            body: `${ev.description}\n\n${choice ? `You chose: ${choice.label}` : "Acknowledged."}`,
          });
          if (ev.id === "school-deal" && choice?.id === "accept")
            s.hasSchoolDeal = true;
          if (ev.id === "parents-lawsuit") s.hasLawsuit = true;
          s.pendingEvent = null;
          s.phase = "quarter-end";
        });
        checkAndPushAchievements(get, set);
      },

      dismissResult: () => {
        set((s) => {
          if (s.quarter >= 12) {
            s.phase = "game-over";
            return;
          }
          s.quarter += 1;
          s.year = Math.ceil(s.quarter / 4);
          s.rdSpendThisQuarter = 0;
          s.lastResult = null;
          // Trigger press conference after Y1 (entering Q5) and Y2 (entering Q9)
          if (s.quarter === 5 || s.quarter === 9) {
            s.phase = "press-conference";
          } else {
            s.phase = "quarter-transition";
          }
        });
        checkAndPushAchievements(get, set);
      },

      beginNextQuarter: () => {
        set((s) => {
          s.phase = "playing";
        });
      },

      submitPressAnswer: (questionId, answerId, defensibility, truthPct, socialImpactDelta) => {
        set((s) => {
          const yearAnswered = s.year - 1;
          s.pressAnswers.push({
            year: yearAnswered,
            questionId,
            answerId,
            defensibility,
            truthPct,
            socialImpactDelta,
          });
          if (socialImpactDelta !== 0) {
            s.socialImpact = Math.max(0, s.socialImpact + socialImpactDelta);
          }
          // Trust nudges based on how defensible the answer was
          s.brandTrust = Math.max(
            0,
            Math.min(100, s.brandTrust + (defensibility - 50) / 12),
          );
        });
      },

      completePressConference: () => {
        const state = get();
        const yearAnswered = state.year - 1;
        const answers = state.pressAnswers.filter((a) => a.year === yearAnswered);
        const avgDefens =
          answers.length > 0
            ? answers.reduce((sum, a) => sum + a.defensibility, 0) / answers.length
            : 0;
        const avgTruth =
          answers.length > 0
            ? answers.reduce((sum, a) => sum + a.truthPct, 0) / answers.length
            : 0;
        set((s) => {
          s.phase = "quarter-transition";
          // Press sentiment moves based on avg defensibility (-20 to +20)
          const sentimentDelta = Math.round((avgDefens - 50) / 2.5);
          s.pressSentiment = Math.max(
            -100,
            Math.min(100, s.pressSentiment + sentimentDelta),
          );
          pushInbox(s, {
            quarter: s.quarter,
            sender: "event",
            subject: `Press conference Y${yearAnswered} · summary`,
            body: `Average defensibility: ${avgDefens.toFixed(0)}/100. Average truthfulness: ${avgTruth.toFixed(0)}%.\n\n${
              avgDefens >= 75
                ? "Press generally favorable. Brand trust rising."
                : avgDefens >= 50
                  ? "Mixed coverage. Press sentiment held steady."
                  : "Critical coverage. Brand under scrutiny."
            }\n\nPress sentiment delta: ${sentimentDelta >= 0 ? "+" : ""}${sentimentDelta}`,
          });
          pushToastImmer(s, {
            title: "PRESS Y" + yearAnswered + " COMPLETE",
            body: `Defensibility ${avgDefens.toFixed(0)}/100 · sentiment ${sentimentDelta >= 0 ? "+" : ""}${sentimentDelta}`,
            kind: avgDefens >= 60 ? "good" : "bad",
          });
        });
      },

      pushToast: (t) =>
        set((s) => {
          pushToastImmer(s, t);
        }),

      dismissToast: (id) =>
        set((s) => {
          s.toasts = s.toasts.filter((t) => t.id !== id);
        }),

      resetGame: () => {
        set((s) => {
          s.phase = "title";
          s.companyName = "";
          s.mission = "";
          s.brandColor = "#ff7a1f";
          s.quarter = 1;
          s.year = 1;
          s.cash = 400_000;
          s.marketSharePct = 22;
          s.brandTrust = 50;
          s.pressSentiment = 0;
          s.socialImpact = 0;
          s.lifetimeRevenue = 0;
          s.recipe = { ...initialRecipe };
          s.pricePerBottle = 2.49;
          s.campaign = { ...initialCampaign };
          s.distribution = { ...initialDistribution };
          s.rdSpendThisQuarter = 0;
          s.hiredEmployees = [];
          s.staffLevels = {};
          s.buildings = [];
          s.researchUnlocked = ["basic-electrolytes"];
          s.revenueStreams = { ...initialRevenueStreams };
          s.consecutiveHighSodium = 0;
          s.consecutiveHighSugar = 0;
          s.hasSchoolDeal = false;
          s.hasLawsuit = false;
          s.publicHealthCumulative = { ...initialPublicHealth };
          s.pressAnswers = [];
          s.history = [];
          s.events = [];
          s.newsLog = [];
          s.inbox = [];
          s.achievementsUnlocked = [];
          s.toasts = [];
          s.pendingEvent = null;
          s.lastResult = null;
        });
      },
    })),
    {
      name: "sdt-save-v3",
      version: 3,
      migrate: (state: unknown, _version: number) => {
        // schema changed substantially between v1/v2 and v3; cleanest to reset.
        return undefined;
      },
    },
  ),
);

function checkAndPushAchievements(
  getFn: () => GameState,
  setFn: (fn: (s: GameState) => void) => void,
): void {
  const s = getFn();
  const filledByFloor: Record<string, number> = {};
  for (const b of s.buildings) {
    const def = buildingsByDef[b.defId];
    if (!def) continue;
    filledByFloor[def.floor] = (filledByFloor[def.floor] ?? 0) + 1;
  }
  const highestLevel = Object.values(s.staffLevels).reduce<number>(
    (max, l) => Math.max(max, l as number),
    1,
  );
  const stats = {
    sodiumMg: s.recipe["na"] ?? 0,
    sugarG:
      (s.recipe["hfcs"] ?? 0) + (s.recipe["cane"] ?? 0) + (s.recipe["dex"] ?? 0),
  };
  const newly = checkAchievements({
    quarter: s.quarter,
    cash: s.cash,
    lifetimeRevenue: s.lifetimeRevenue,
    marketSharePct: s.marketSharePct,
    brandTrust: s.brandTrust,
    pressSentiment: s.pressSentiment,
    socialImpact: s.socialImpact,
    sodiumMg: stats.sodiumMg,
    sugarG: stats.sugarG,
    hiredEmployeeCount: s.hiredEmployees.length,
    highestStaffLevel: highestLevel,
    researchCount: s.researchUnlocked.length,
    totalResearchCount: researchNodes.length,
    filledBuildingSlotsByFloor: filledByFloor,
    consecutiveHighSodium: s.consecutiveHighSodium,
    consecutiveHighSugar: s.consecutiveHighSugar,
    hasSchoolDeal: s.hasSchoolDeal,
    hasLawsuit: s.hasLawsuit,
    reachedEnd: s.phase === "game-over",
    alreadyUnlocked: new Set(s.achievementsUnlocked.map((a) => a.id)),
  });

  if (newly.length === 0) return;

  setFn((draft) => {
    for (const id of newly) {
      const def = achievementsById[id];
      if (!def) continue;
      draft.achievementsUnlocked.push(recordAchievement(id, draft.quarter));
      pushInbox(draft, {
        quarter: draft.quarter,
        sender: "achievement",
        subject: `🏆 ${def.title}`,
        body: def.description,
      });
      pushToastImmer(draft, {
        title: `🏆 ${def.title}`,
        body: def.description,
        kind: def.goodNews ? "good" : "bad",
      });
    }
  });
}

export function selectQuarterLabel(s: GameState): string {
  const q = ((s.quarter - 1) % 4) + 1;
  return `Y${s.year} · Q${q}`;
}

export function selectUnreadCount(s: GameState): number {
  return s.inbox.filter((m) => !m.read).length;
}

export function selectTotalSalary(s: GameState): number {
  return computeQuarterlySalaries(s.hiredEmployees, s.staffLevels);
}

export function selectIsResearched(s: GameState, ingId: string): boolean {
  const ing = ingredientById[ingId];
  if (!ing) return false;
  if (!ing.research) return true; // unlocked at start
  return s.researchUnlocked.includes(ing.research);
}
