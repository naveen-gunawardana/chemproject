export interface PressQuestion {
  id: string;
  reporter: string;
  outlet: string;
  question: string;
  answers: PressAnswer[];
}

export interface PressAnswer {
  id: string;
  text: string;
  /** 0-100: how rigorous is the claim/evidence/reasoning chain? */
  defensibility: number;
  /** 0-100: how true is the underlying claim? */
  truthPct: number;
  /** Positive = adds to social impact (worse); negative = reduces */
  socialImpactDelta: number;
  /** Optional flavor tag for the post-game letter */
  framing?: "transparency" | "deflection" | "denial" | "spin" | "commit";
}

export interface PressConference {
  year: number;
  intro: string;
  questions: PressQuestion[];
}

export const pressConferences: PressConference[] = [
  // === YEAR 1 ===
  {
    year: 1,
    intro:
      "It's the end of your first fiscal year. Three reporters are waiting. Each question is a chance to defend a real decision you made. Choose carefully — your answers are recorded.",
    questions: [
      {
        id: "y1q1",
        reporter: "Maya Reyes",
        outlet: "Nutrition Watch Quarterly",
        question:
          "Critics say sports-drink marketing exploits chemistry buzzwords that most consumers don't understand. How do you respond?",
        answers: [
          {
            id: "y1q1a",
            text: "Our drinks meet all FDA labeling requirements.",
            defensibility: 50,
            truthPct: 85,
            socialImpactDelta: 0,
            framing: "deflection",
          },
          {
            id: "y1q1b",
            text: "Consumers understand more than you think. They're choosing us.",
            defensibility: 30,
            truthPct: 30,
            socialImpactDelta: 3,
            framing: "denial",
          },
          {
            id: "y1q1c",
            text: "We're committing to publish ingredient-by-ingredient role labels next quarter.",
            defensibility: 80,
            truthPct: 70,
            socialImpactDelta: -2,
            framing: "commit",
          },
        ],
      },
      {
        id: "y1q2",
        reporter: "Tomás Aguilar",
        outlet: "Health Policy Review",
        question:
          "Your product contains added sugar. WHO recommends under 25 g per day for children. How is that acceptable in a drink marketed as 'hydration'?",
        answers: [
          {
            id: "y1q2a",
            text: "Sugar provides essential energy for athletes during exertion.",
            defensibility: 50,
            truthPct: 60,
            socialImpactDelta: 0,
            framing: "spin",
          },
          {
            id: "y1q2b",
            text: "Our customers are responsible for their own nutritional choices.",
            defensibility: 40,
            truthPct: 70,
            socialImpactDelta: 2,
            framing: "deflection",
          },
          {
            id: "y1q2c",
            text: "We're investing in low-sugar reformulations and will publish results.",
            defensibility: 75,
            truthPct: 60,
            socialImpactDelta: -1,
            framing: "commit",
          },
        ],
      },
      {
        id: "y1q3",
        reporter: "Dr. Elena Park",
        outlet: "Pediatrics Today",
        question:
          "Pediatricians are concerned about sports drinks being marketed to children. What is your company's policy?",
        answers: [
          {
            id: "y1q3a",
            text: "We do not market to children.",
            defensibility: 40,
            truthPct: 30,
            socialImpactDelta: 1,
            framing: "denial",
          },
          {
            id: "y1q3b",
            text: "Parents — not children — make purchasing decisions.",
            defensibility: 50,
            truthPct: 65,
            socialImpactDelta: 1,
            framing: "deflection",
          },
          {
            id: "y1q3c",
            text: "We're voluntarily restricting all marketing to under-12 audiences.",
            defensibility: 85,
            truthPct: 60,
            socialImpactDelta: -4,
            framing: "commit",
          },
        ],
      },
    ],
  },

  // === YEAR 2 ===
  {
    year: 2,
    intro:
      "Year 2 is over. The press is sharper this round. They've seen your decisions accumulate. Each answer becomes part of your public record.",
    questions: [
      {
        id: "y2q1",
        reporter: "Jordan Wei",
        outlet: "FDA Compliance Weekly",
        question:
          "An independent lab tested your latest batch. Their measured electrolyte concentrations differ from your label by 15%. How do you account for that?",
        answers: [
          {
            id: "y2q1a",
            text: "FDA tolerance bands allow ±20%. We are in compliance.",
            defensibility: 75,
            truthPct: 95,
            socialImpactDelta: 0,
            framing: "transparency",
          },
          {
            id: "y2q1b",
            text: "Our internal QC is more rigorous than FDA standards.",
            defensibility: 30,
            truthPct: 30,
            socialImpactDelta: 2,
            framing: "spin",
          },
          {
            id: "y2q1c",
            text: "We've engaged a third-party auditor to verify all facilities.",
            defensibility: 85,
            truthPct: 60,
            socialImpactDelta: -1,
            framing: "commit",
          },
        ],
      },
      {
        id: "y2q2",
        reporter: "Riya Nair",
        outlet: "Truth In Advertising",
        question:
          "An industry watchdog rated your tagline 'misleading.' Will you change it?",
        answers: [
          {
            id: "y2q2a",
            text: "Marketing language is aspirational, not literal scientific claim.",
            defensibility: 60,
            truthPct: 90,
            socialImpactDelta: 0,
            framing: "transparency",
          },
          {
            id: "y2q2b",
            text: "Our R&D team stands behind every claim we make.",
            defensibility: 25,
            truthPct: 25,
            socialImpactDelta: 2,
            framing: "denial",
          },
          {
            id: "y2q2c",
            text: "Our next campaign will only use claims with peer-reviewed evidence.",
            defensibility: 80,
            truthPct: 65,
            socialImpactDelta: -2,
            framing: "commit",
          },
        ],
      },
      {
        id: "y2q3",
        reporter: "Aisha Brown",
        outlet: "Public Health Tribune",
        question:
          "An aggregate public health study estimates your brand alone contributes meaningfully to childhood sugar intake. Your response?",
        answers: [
          {
            id: "y2q3a",
            text: "Those models rely on flawed assumptions and we dispute them.",
            defensibility: 30,
            truthPct: 35,
            socialImpactDelta: 3,
            framing: "denial",
          },
          {
            id: "y2q3b",
            text: "We acknowledge the data and are publishing our own public-health impact report.",
            defensibility: 90,
            truthPct: 70,
            socialImpactDelta: -5,
            framing: "transparency",
          },
          {
            id: "y2q3c",
            text: "Consumer choice drives our business. Adults decide for their families.",
            defensibility: 40,
            truthPct: 75,
            socialImpactDelta: 1,
            framing: "deflection",
          },
        ],
      },
    ],
  },
];

export function pressConferenceForYear(year: number): PressConference | null {
  return pressConferences.find((c) => c.year === year) ?? null;
}
