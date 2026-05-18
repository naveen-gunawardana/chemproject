import type { AchievementDef } from "../types";

export const achievements: AchievementDef[] = [
  {
    id: "first-bottle",
    title: "First Bottle Sold",
    description: "You shipped something. Real cash. Real consequences.",
    goodNews: true,
  },
  {
    id: "millionaire",
    title: "$1M Lifetime Revenue",
    description: "First million through the door. The board sends champagne.",
    goodNews: true,
  },
  {
    id: "fivemillionaire",
    title: "$5M Lifetime Revenue",
    description: "Big-leagues territory. Industry analysts are watching.",
    goodNews: true,
  },
  {
    id: "industry-titan",
    title: "Industry Titan",
    description: "Market share crossed 30%. You set the agenda now.",
    goodNews: true,
  },
  {
    id: "peoples-champion",
    title: "People's Champion",
    description: "Brand trust above 85. Consumers genuinely like you.",
    goodNews: true,
  },
  {
    id: "public-enemy",
    title: "Public Enemy",
    description: "Press sentiment below -50. The watchdogs sharpened the knives.",
    goodNews: false,
  },
  {
    id: "ethical-profit",
    title: "Ethical Profit",
    description: "Reached endgame with cash > $500K AND social impact < 30.",
    goodNews: true,
  },
  {
    id: "school-deal",
    title: "First School Sponsorship",
    description: "Signed your first school district. Kids on the bottle.",
    goodNews: false,
  },
  {
    id: "first-lawsuit",
    title: "First Lawsuit",
    description: "Plaintiffs filed. The legal team is on the phone.",
    goodNews: false,
  },
  {
    id: "whistleblower",
    title: "Whistleblower Bait",
    description: "Social impact above 100. Someone inside is taking notes.",
    goodNews: false,
  },
  {
    id: "big-sodium",
    title: "Big Sodium",
    description: "Sodium > 500mg per serving for three quarters running.",
    goodNews: false,
  },
  {
    id: "sugar-junkie",
    title: "Sugar Junkie",
    description: "Sugar > 30g per serving for three quarters running.",
    goodNews: false,
  },
  {
    id: "tech-pioneer",
    title: "Tech Pioneer",
    description: "Every research node unlocked.",
    goodNews: true,
  },
  {
    id: "empire-builder",
    title: "Empire Builder",
    description: "All building slots on three floors filled with active builds.",
    goodNews: true,
  },
  {
    id: "full-staff",
    title: "Full Staff",
    description: "All six employees hired.",
    goodNews: true,
  },
  {
    id: "maxed-out",
    title: "Maxed Out",
    description: "Promoted any employee to Level 3.",
    goodNews: true,
  },
  {
    id: "survivor",
    title: "Survivor",
    description: "Reached Quarter 12. Made it to the verdict.",
    goodNews: true,
  },
  {
    id: "bankrupt",
    title: "Bankrupt",
    description: "Cash dropped below zero. The board is concerned.",
    goodNews: false,
  },
];

export const achievementsById = Object.fromEntries(
  achievements.map((a) => [a.id, a]),
) as Record<string, AchievementDef>;
