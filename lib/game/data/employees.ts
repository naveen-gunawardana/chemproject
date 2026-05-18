import type { Employee, EmployeeRoom } from "../types";

export const employees: Employee[] = [
  {
    id: "chemist",
    name: "Dr. Marlowe",
    role: "Chief Chemist",
    room: "lab",
    hireCost: 20_000,
    salary: 8_000,
    color: "#86efac",
    shirtColor: "#86efac",
    bio: "Twenty years in industrial chemistry. Quietly refuses to put more than 35 g of sugar in a single serving.",
    bonusText: "−5% production cost",
  },
  {
    id: "marketing",
    name: "Tasha Reed",
    role: "Marketing Director",
    room: "marketing",
    hireCost: 30_000,
    salary: 12_000,
    color: "#ff7a1f",
    shirtColor: "#ff7a1f",
    bio: "Came from a soft-drinks giant. Knows what sells, knows what scans.",
    bonusText: "+25% marketing reach",
  },
  {
    id: "sales",
    name: "Mike Kowalski",
    role: "Sales Director",
    room: "sales",
    hireCost: 25_000,
    salary: 10_000,
    color: "#5fa8ff",
    shirtColor: "#5fa8ff",
    bio: "Best closer in beverage distribution. Two phones at all times.",
    bonusText: "+15% conversion rate",
  },
  {
    id: "lobbyist",
    name: 'Jenny "The Fixer" Ngo',
    role: "Government Affairs",
    room: "lobby",
    hireCost: 50_000,
    salary: 20_000,
    color: "#b07bff",
    shirtColor: "#b07bff",
    bio: "Former FDA staff. Senators on a first-name basis. Plays the long game.",
    bonusText: "−30% negative event risk",
  },
  {
    id: "influencer",
    name: "Devon Ash",
    role: "Creator Partnerships",
    room: "social",
    hireCost: 15_000,
    salary: 6_000,
    color: "#ff3a78",
    shirtColor: "#ff3a78",
    bio: "Knows every fitness-TikTok creator under 25. Lives on FaceTime.",
    bonusText: "+40% TikTok / Instagram reach",
  },
  {
    id: "brand",
    name: "Sofia Vargas",
    role: "Brand Strategist",
    room: "brand",
    hireCost: 40_000,
    salary: 15_000,
    color: "#4ecdc4",
    shirtColor: "#4ecdc4",
    bio: "Lifestyle brand veteran. Believes the bottle is the message.",
    bonusText: "+30% brand trust gain",
  },
];

export const employeeById = Object.fromEntries(
  employees.map((e) => [e.id, e]),
) as Record<string, Employee>;

export const ROOM_LABEL: Record<EmployeeRoom, string> = {
  lab: "R&D LAB",
  marketing: "MARKETING",
  sales: "SALES FLOOR",
  lobby: "GOV AFFAIRS",
  social: "CREATOR DESK",
  brand: "BRAND STUDIO",
};

export const ROOM_ICON: Record<EmployeeRoom, string> = {
  lab: "⚗",
  marketing: "📣",
  sales: "💵",
  lobby: "🏛",
  social: "📱",
  brand: "✦",
};
