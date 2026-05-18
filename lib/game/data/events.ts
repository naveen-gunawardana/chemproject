import type { GameEvent } from "../types";

export const events: GameEvent[] = [
  {
    id: "fda-inspection",
    title: "FDA Inspection",
    description:
      "An FDA inspector tests three random bottles from your latest run. Your label tolerance is ±20%; how does your batch read?",
    trigger: "always",
    weight: 8,
    choices: [
      {
        id: "comply",
        label: "Cooperate fully",
        description: "Lose 1 quarter of trust gain but avoid penalty.",
        effects: { brandTrust: 3, pressSentiment: 2 },
      },
      {
        id: "stonewall",
        label: "Send the lawyers",
        description: "Buys you time. The press will notice.",
        effects: { cash: -25000, pressSentiment: -8, socialImpact: 4 },
      },
    ],
  },
  {
    id: "viral-positive",
    title: "Viral Moment",
    description:
      "An athlete posts a 4-second clip slamming your drink before a big game. The clip blows up.",
    trigger: "always",
    weight: 6,
    effects: { marketSharePct: 1.5, brandTrust: 5, pressSentiment: 6 },
  },
  {
    id: "viral-negative",
    title: "Viral Backlash",
    description:
      "A nutrition TikToker dissects your label for 5M followers. They focus on the sugar grams per serving and the kids in your ads.",
    trigger: "highSugar",
    weight: 7,
    effects: {
      marketSharePct: -1,
      brandTrust: -8,
      pressSentiment: -10,
      socialImpact: 3,
    },
  },
  {
    id: "school-deal",
    title: "School District Offer",
    description:
      "A nearby school district wants to put your drink in their cafeterias and athletic facilities. $40K sponsorship, exclusive 2-year deal.",
    trigger: "always",
    weight: 7,
    choices: [
      {
        id: "accept",
        label: "Sign the deal",
        description: "Cash + market share + a lot of social impact.",
        effects: {
          cash: 40000,
          marketSharePct: 1.2,
          socialImpact: 12,
          pressSentiment: -3,
        },
      },
      {
        id: "decline",
        label: "Decline",
        description: "Trust nudges up; cash stays put.",
        effects: { brandTrust: 4, pressSentiment: 3 },
      },
    ],
  },
  {
    id: "celebrity-offer",
    title: "Celebrity Endorsement",
    description:
      "A mid-tier celebrity will post your drink to their feed for $30K. Quick lift; quick drop.",
    trigger: "always",
    weight: 5,
    choices: [
      {
        id: "pay",
        label: "Pay them",
        description: "Marketing spike, fades fast.",
        effects: {
          cash: -30000,
          marketSharePct: 1.5,
          brandTrust: 2,
        },
      },
      {
        id: "pass",
        label: "Pass",
        description: "Save the cash.",
        effects: {},
      },
    ],
  },
  {
    id: "competitor-recall",
    title: "Competitor Recall",
    description:
      "A rival sports drink is recalled after contamination reports. Empty shelves.",
    trigger: "always",
    weight: 4,
    effects: { marketSharePct: 2.5, brandTrust: 1 },
  },
  {
    id: "sugar-tax",
    title: "Sugar Tax Proposal",
    description:
      "Your state legislature is debating an added-sugar tax that would apply to your drink. Lobbying decisions await.",
    trigger: "highSugar",
    weight: 5,
    choices: [
      {
        id: "lobby",
        label: "Lobby against",
        description: "Burn cash, dodge the bullet.",
        effects: { cash: -50000, pressSentiment: -4, socialImpact: 6 },
      },
      {
        id: "reformulate",
        label: "Quietly cut sugar 20%",
        description: "Long-term sentiment improves.",
        effects: { brandTrust: 4, pressSentiment: 5, socialImpact: -3 },
      },
      {
        id: "ignore",
        label: "Ignore it",
        description: "If it passes, you pay. If not, you didn't waste cash.",
        effects: { socialImpact: 3 },
      },
    ],
  },
  {
    id: "parents-lawsuit",
    title: "Parents File Suit",
    description:
      "A class-action suit alleges your kid-focused marketing misled families about health benefits.",
    trigger: "targetingKids",
    weight: 6,
    effects: {
      cash: -75000,
      brandTrust: -10,
      pressSentiment: -12,
      socialImpact: 8,
    },
  },
  {
    id: "congress-hearing",
    title: "Congressional Hearing",
    description:
      "You've been subpoenaed to testify on industry marketing-to-minors practices.",
    trigger: "highSocialImpact",
    weight: 4,
    effects: {
      cash: -100000,
      brandTrust: -8,
      pressSentiment: -10,
      socialImpact: 5,
    },
  },
  {
    id: "wellness-blog",
    title: "Wellness Blog Endorsement",
    description:
      "A top wellness influencer reviews your drink positively. Lifestyle demo notices.",
    trigger: "always",
    weight: 5,
    effects: { marketSharePct: 0.8, brandTrust: 3, pressSentiment: 2 },
  },
  {
    id: "supply-disruption",
    title: "Supply Chain Disruption",
    description:
      "Sucralose supplier in Asia hit by tariffs. Premium-ingredient costs jump.",
    trigger: "always",
    weight: 4,
    effects: { cash: -20000 },
  },
  {
    id: "scientific-study",
    title: "New Scientific Study",
    description:
      "A peer-reviewed study finds plain water adequate for the vast majority of exercise contexts. Media picks it up.",
    trigger: "always",
    weight: 4,
    effects: { marketSharePct: -1.2, pressSentiment: -5 },
  },
  {
    id: "athlete-collab",
    title: "Athlete Collab",
    description:
      "An Olympic-level athlete wants to co-design a signature flavor with you.",
    trigger: "always",
    weight: 4,
    choices: [
      {
        id: "yes",
        label: "Co-design it",
        description: "Costs cash; pays back in trust + market share.",
        effects: { cash: -60000, marketSharePct: 1.5, brandTrust: 6 },
      },
      {
        id: "no",
        label: "Decline politely",
        description: "Status quo.",
        effects: {},
      },
    ],
  },
  {
    id: "whistleblower",
    title: "Whistleblower Leak",
    description:
      "Internal marketing memos leak. They include explicit kid-targeting language.",
    trigger: "highSocialImpact",
    weight: 5,
    effects: {
      brandTrust: -12,
      pressSentiment: -15,
      socialImpact: 4,
    },
  },
  {
    id: "rd-breakthrough",
    title: "R&D Breakthrough",
    description:
      "Your lab discovers a cheaper way to source electrolytes. Margin improves.",
    trigger: "always",
    weight: 3,
    effects: { cash: 30000 },
  },
];
