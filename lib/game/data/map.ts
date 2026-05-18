import type { BuildingFloor, PanelId } from "../types";

export const TILE_SIZE = 48;
export const MAP_W = 24;
export const MAP_H = 16;

export type TileType =
  | "grass1"
  | "grass2"
  | "grass3"
  | "path"
  | "road"
  | "road-stripe"
  | "tree"
  | "bush"
  | "fountain"
  | "bench";

export interface FunctionalPlacement {
  kind: "functional";
  panel: PanelId;
  x: number;
  y: number;
  w: number;
  h: number;
  roofColor: string;
  wallColor: string;
  accentColor: string;
  iconKind:
    | "flask"
    | "microscope"
    | "megaphone"
    | "mailbox"
    | "dollar"
    | "chart"
    | "office";
}

export interface OfficePlacement {
  kind: "office";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SlotPlacement {
  kind: "slot";
  floor: BuildingFloor;
  slot: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Placement =
  | FunctionalPlacement
  | OfficePlacement
  | SlotPlacement;

// Hand-placed building positions for a balanced top-down campus.
export const PLACEMENTS: Placement[] = [
  // === TOP ROW: Lab + Research + Ads + Inbox ===
  {
    kind: "functional",
    panel: "lab",
    x: 2,
    y: 2,
    w: 3,
    h: 3,
    roofColor: "#86efac",
    wallColor: "#f4e9d2",
    accentColor: "#3a7d35",
    iconKind: "flask",
  },
  {
    kind: "functional",
    panel: "rd",
    x: 7,
    y: 2,
    w: 3,
    h: 3,
    roofColor: "#ffb700",
    wallColor: "#f4e9d2",
    accentColor: "#8a6300",
    iconKind: "microscope",
  },
  {
    kind: "functional",
    panel: "ads",
    x: 12,
    y: 2,
    w: 3,
    h: 3,
    roofColor: "#ff7a1f",
    wallColor: "#f4e9d2",
    accentColor: "#a13d00",
    iconKind: "megaphone",
  },
  {
    kind: "functional",
    panel: "inbox",
    x: 17,
    y: 2,
    w: 2,
    h: 3,
    roofColor: "#b07bff",
    wallColor: "#f4e9d2",
    accentColor: "#5a3aa0",
    iconKind: "mailbox",
  },

  // === LAB FLOOR BUILD SLOTS ===
  { kind: "slot", floor: "lab", slot: 0, x: 2, y: 6, w: 3, h: 3 },
  { kind: "slot", floor: "lab", slot: 1, x: 6, y: 6, w: 2, h: 3 },
  { kind: "slot", floor: "lab", slot: 2, x: 9, y: 6, w: 2, h: 3 },

  // === OFFICE FLOOR BUILD SLOTS ===
  { kind: "slot", floor: "office", slot: 0, x: 12, y: 6, w: 2, h: 3 },
  { kind: "slot", floor: "office", slot: 1, x: 15, y: 6, w: 2, h: 3 },

  // === MIDDLE: Office block (employees) + Sales + Compare ===
  {
    kind: "functional",
    panel: "sales",
    x: 2,
    y: 10,
    w: 3,
    h: 3,
    roofColor: "#facc15",
    wallColor: "#f4e9d2",
    accentColor: "#92700a",
    iconKind: "dollar",
  },
  { kind: "office", x: 7, y: 10, w: 6, h: 3 },
  {
    kind: "functional",
    panel: "compare",
    x: 15,
    y: 10,
    w: 3,
    h: 3,
    roofColor: "#4ecdc4",
    wallColor: "#f4e9d2",
    accentColor: "#1d7470",
    iconKind: "chart",
  },

  // === PRODUCTION FLOOR BUILD SLOTS ===
  { kind: "slot", floor: "production", slot: 0, x: 19, y: 2, w: 3, h: 3 },
  { kind: "slot", floor: "production", slot: 1, x: 19, y: 6, w: 3, h: 3 },
  { kind: "slot", floor: "production", slot: 2, x: 19, y: 10, w: 3, h: 3 },

  // === DISTRIBUTION FLOOR BUILD SLOTS ===
  { kind: "slot", floor: "distribution", slot: 0, x: 2, y: 14, w: 3, h: 2 },
  { kind: "slot", floor: "distribution", slot: 1, x: 6, y: 14, w: 3, h: 2 },
  { kind: "slot", floor: "distribution", slot: 2, x: 10, y: 14, w: 3, h: 2 },

  // === EXECUTIVE FLOOR (Y2+) ===
  { kind: "slot", floor: "executive", slot: 0, x: 14, y: 14, w: 3, h: 2 },
  { kind: "slot", floor: "executive", slot: 1, x: 18, y: 14, w: 3, h: 2 },
];

// Generate the background tile grid. Mostly grass; specific paths added.
export function generateTileGrid(): TileType[][] {
  const grid: TileType[][] = [];
  for (let y = 0; y < MAP_H; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < MAP_W; x++) {
      // Top road
      if (y === 0) {
        row.push(x % 4 === 2 ? "road-stripe" : "road");
        continue;
      }
      // Horizontal paths between building rows
      if (y === 5 || y === 9 || y === 13) {
        row.push("path");
        continue;
      }
      // Grass with variation (deterministic from position)
      const noise = (x * 31 + y * 17 + x * y) % 11;
      if (noise < 7) row.push("grass1");
      else if (noise < 9) row.push("grass2");
      else row.push("grass3");
    }
    grid.push(row);
  }
  return grid;
}

// Decoration sprites scattered on grass tiles. Positions chosen to not
// overlap with building footprints.
export interface Decoration {
  type: "tree" | "bush" | "fountain" | "bench";
  x: number; // tile coords
  y: number;
}

export const DECORATIONS: Decoration[] = [
  // Trees on edges
  { type: "tree", x: 0, y: 3 },
  { type: "tree", x: 0, y: 7 },
  { type: "tree", x: 0, y: 11 },
  { type: "tree", x: 5, y: 1 },
  { type: "tree", x: 11, y: 1 },
  { type: "tree", x: 16, y: 1 },
  { type: "tree", x: 22, y: 3 },
  { type: "tree", x: 22, y: 7 },
  { type: "tree", x: 22, y: 11 },
  // Bushes
  { type: "bush", x: 1, y: 4 },
  { type: "bush", x: 5, y: 4 },
  { type: "bush", x: 11, y: 4 },
  { type: "bush", x: 16, y: 4 },
  { type: "bush", x: 6, y: 8 },
  { type: "bush", x: 14, y: 8 },
  { type: "bush", x: 5, y: 12 },
  { type: "bush", x: 14, y: 12 },
  { type: "bush", x: 18, y: 12 },
  // Benches near paths
  { type: "bench", x: 13, y: 8 },
  { type: "bench", x: 6, y: 12 },
];
