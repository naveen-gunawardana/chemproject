"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useGame, selectUnreadCount } from "@/lib/game/store";
import { employees, employeeById } from "@/lib/game/data/employees";
import { buildingsByDef, FLOOR_COLOR } from "@/lib/game/data/buildings";
import {
  PLACEMENTS,
  DECORATIONS,
  generateTileGrid,
  TILE_SIZE,
  MAP_W,
  MAP_H,
  type Placement,
  type FunctionalPlacement,
  type SlotPlacement,
  type OfficePlacement,
} from "@/lib/game/data/map";
import type {
  BuildingFloor,
  BuildingInstance,
  Employee,
  PanelId,
} from "@/lib/game/types";
import { BuildModal } from "./BuildModal";
import {
  RecipeBenchSprite,
  ResearchTowerSprite,
  AdsHQSprite,
  MailRoomSprite,
  SalesStorefrontSprite,
  DataCenterSprite,
  StaffOfficeBlockSprite,
  EmptyPlotSprite,
  ConstructionSprite,
  FloorBuildingSprite,
  getBuildingExtraHeight,
  TreeSprite,
  BushSprite,
  BenchSprite,
  FountainSprite,
  LampPostSprite,
  MiniWorker,
} from "./sprites/MapSprites";
import { X, Banknote, Star } from "lucide-react";
import { WorkerSprite } from "./WorkerSprite";

const STAFF_PROMOTE_MULT = { 2: 2, 3: 4 } as const;
const LEVEL_BONUS_MULT = { 1: 1, 2: 1.4, 3: 1.8 } as const;
const LEVEL_SALARY_MULT = { 1: 1, 2: 1.7, 3: 2.5 } as const;

const TILE_BG: Record<string, string> = {
  grass1: "#5cbc3e",
  grass2: "#52ad36",
  grass3: "#4a9a30",
  path: "#c4b29c",
  road: "#3a3354",
  "road-stripe": "#3a3354",
};

const FUNCTIONAL_SPRITE: Record<
  PanelId,
  React.FC<{ w: number; h: number }>
> = {
  lab: RecipeBenchSprite,
  rd: ResearchTowerSprite,
  ads: AdsHQSprite,
  inbox: MailRoomSprite,
  sales: SalesStorefrontSprite,
  compare: DataCenterSprite,
};

const PANEL_LABEL: Record<PanelId, string> = {
  lab: "RECIPE LAB",
  rd: "RESEARCH",
  ads: "ADS HQ",
  inbox: "MAIL ROOM",
  sales: "SALES",
  compare: "MARKET RESEARCH",
};

const PANEL_LABEL_COLOR: Record<PanelId, string> = {
  lab: "#86efac",
  rd: "#ffb700",
  ads: "#ff7a1f",
  inbox: "#b07bff",
  sales: "#facc15",
  compare: "#4ecdc4",
};

// Icon char per build def, used by FloorBuildingSprite
const BUILDING_ICON: Record<string, string> = {
  bottling: "🍾",
  packaging: "📦",
  coldstorage: "❄",
  wetlab: "⚗",
  qclab: "🧪",
  colorlab: "🎨",
  loadingdock: "🚛",
  fleet: "🚐",
  dtcwarehouse: "🏬",
  marketingstudio: "🎬",
  legaloffice: "⚖",
  boardroom: "🏛",
  ceosuite: "✦",
};

interface MapViewProps {
  onOpenPanel: (id: PanelId) => void;
}

export function MapView({ onOpenPanel }: MapViewProps) {
  const allBuildings = useGame((s) => s.buildings);
  const year = useGame((s) => s.year);
  const hired = useGame((s) => s.hiredEmployees);
  const companyName = useGame((s) => s.companyName);
  const unread = useGame(selectUnreadCount);
  const [empOpen, setEmpOpen] = useState<string | null>(null);
  const [buildOpen, setBuildOpen] = useState<{
    floor: BuildingFloor;
    slot: number;
  } | null>(null);
  const [officeOpen, setOfficeOpen] = useState(false);

  const tiles = useMemo(() => generateTileGrid(), []);

  const buildModalExisting = buildOpen
    ? allBuildings.find(
        (b) =>
          buildingsByDef[b.defId]?.floor === buildOpen.floor &&
          b.slot === buildOpen.slot,
      ) ?? null
    : null;

  const workerColors = hired
    .map((id) => employeeById[id]?.shirtColor ?? "#888")
    .slice(0, 18);

  const mapWidth = MAP_W * TILE_SIZE;
  const mapHeight = MAP_H * TILE_SIZE;

  // Compute scale to fit container
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      const c = containerRef.current;
      if (!c) return;
      const margin = 32;
      const sX = (c.clientWidth - margin) / mapWidth;
      const sY = (c.clientHeight - margin) / mapHeight;
      const s = Math.max(0.5, Math.min(1.8, Math.min(sX, sY)));
      setScale(s);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [mapWidth, mapHeight]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden bg-night-deep grid place-items-center relative"
      style={{ background: "#1a1530" }}
    >
      {/* Floating banner: company + click hint */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none pixel-label text-paper-faint bg-night-deep/70 px-3 py-1 border-2 border-ink"
        style={{ fontSize: 10 }}
      >
        {companyName.toUpperCase()} CAMPUS · CLICK BUILDINGS TO ENTER
      </div>

      {/* Scaled map */}
      <div
        style={{
          width: mapWidth,
          height: mapHeight,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        className="relative"
      >
        {/* Map frame */}
        <div
          className="absolute inset-0 pixel-border"
          style={{
            boxShadow:
              "inset 6px 6px 0 0 var(--color-night-bevel-dark), inset -6px -6px 0 0 var(--color-night-bevel-light), 0 0 0 4px var(--color-ink)",
          }}
        />

        {/* Tile background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: `repeat(${MAP_W}, ${TILE_SIZE}px)`,
            gridAutoRows: `${TILE_SIZE}px`,
          }}
        >
          {tiles.flatMap((row, y) =>
            row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                style={{
                  background: TILE_BG[tile],
                  position: "relative",
                }}
              >
                {tile === "road-stripe" && (
                  <div
                    style={{
                      position: "absolute",
                      left: 10,
                      top: TILE_SIZE / 2 - 3,
                      width: TILE_SIZE - 20,
                      height: 5,
                      background: "#facc15",
                    }}
                  />
                )}
                {tile === "path" && (x + y) % 3 === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 8,
                      top: 8,
                      width: 4,
                      height: 4,
                      background: "#9a8767",
                    }}
                  />
                )}
                {tile === "grass2" && (
                  <GrassDetail variant={2} seed={x * 7 + y * 3} />
                )}
                {tile === "grass3" && (
                  <GrassDetail variant={3} seed={x * 11 + y * 5} />
                )}
              </div>
            )),
          )}
        </div>

        {/* Decorations layer */}
        <div className="absolute inset-0 pointer-events-none">
          {DECORATIONS.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.x * TILE_SIZE,
                top: d.y * TILE_SIZE - (d.type === "tree" ? 20 : 0),
              }}
            >
              {d.type === "tree" && <TreeSprite size={48} />}
              {d.type === "bush" && <BushSprite size={36} />}
              {d.type === "bench" && <BenchSprite size={48} />}
            </div>
          ))}
          {/* Lamp posts at intersections */}
          {[
            [5.5, 5.2],
            [5.5, 9.2],
            [5.5, 13.2],
            [18.5, 5.2],
            [18.5, 9.2],
            [18.5, 13.2],
          ].map(([x, y], i) => (
            <div
              key={`lamp-${i}`}
              style={{
                position: "absolute",
                left: x * TILE_SIZE,
                top: y * TILE_SIZE - 36,
              }}
            >
              <LampPostSprite size={44} />
            </div>
          ))}
          {/* Central fountain */}
          <div
            style={{
              position: "absolute",
              left: 13 * TILE_SIZE - 12,
              top: 7 * TILE_SIZE - 24,
            }}
          >
            <FountainSprite size={88} />
          </div>
        </div>

        {/* Walking workers on paths */}
        <WalkingWorkers />

        {/* Buildings layer */}
        {PLACEMENTS.map((p, i) => (
          <PlacementRenderer
            key={i}
            p={p}
            allBuildings={allBuildings}
            year={year}
            workerColors={workerColors}
            hired={hired}
            onOpenPanel={onOpenPanel}
            onOpenSlot={(floor, slot) => setBuildOpen({ floor, slot })}
            onOpenOffice={() => setOfficeOpen(true)}
            unread={unread}
          />
        ))}

        {/* Atmospheric sun overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 25% 5%, rgba(255,225,140,0.20), transparent 55%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {empOpen && (
        <EmployeeModal
          emp={employeeById[empOpen]!}
          onClose={() => setEmpOpen(null)}
        />
      )}
      {officeOpen && (
        <OfficeStaffModal
          onClose={() => setOfficeOpen(false)}
          onPickEmp={(id) => {
            setOfficeOpen(false);
            setEmpOpen(id);
          }}
        />
      )}
      {buildOpen && (
        <BuildModal
          floor={buildOpen.floor}
          slot={buildOpen.slot}
          existing={buildModalExisting}
          onClose={() => setBuildOpen(null)}
        />
      )}
    </div>
  );
}

function GrassDetail({ variant, seed }: { variant: 2 | 3; seed: number }) {
  const dots = (seed % 3) + 1;
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: dots }).map((_, i) => {
        const x = (seed * (i + 1)) % 36;
        const y = (seed * (i + 2) + 13) % 36;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + 4,
              top: y + 4,
              width: 3,
              height: variant === 3 ? 4 : 3,
              background: variant === 3 ? "#86efac" : "#4ea832",
              opacity: 0.7,
            }}
          />
        );
      })}
    </div>
  );
}

function PlacementRenderer({
  p,
  allBuildings,
  year,
  workerColors,
  hired,
  onOpenPanel,
  onOpenSlot,
  onOpenOffice,
  unread,
}: {
  p: Placement;
  allBuildings: BuildingInstance[];
  year: number;
  workerColors: string[];
  hired: string[];
  onOpenPanel: (id: PanelId) => void;
  onOpenSlot: (floor: BuildingFloor, slot: number) => void;
  onOpenOffice: () => void;
  unread: number;
}) {
  if (p.kind === "functional")
    return <FunctionalBuilding p={p} onClick={() => onOpenPanel(p.panel)} unread={unread} />;
  if (p.kind === "office")
    return <OfficeBuilding p={p} onClick={onOpenOffice} workerColors={workerColors} hiredCount={hired.length} />;
  return (
    <SlotBuilding
      p={p}
      allBuildings={allBuildings}
      yearLocked={p.floor === "executive" && year < 2}
      onClick={() => {
        if (p.floor === "executive" && year < 2) return;
        onOpenSlot(p.floor, p.slot);
      }}
    />
  );
}

function FunctionalBuilding({
  p,
  onClick,
  unread,
}: {
  p: FunctionalPlacement;
  onClick: () => void;
  unread: number;
}) {
  const Sprite = FUNCTIONAL_SPRITE[p.panel];
  const labelColor = PANEL_LABEL_COLOR[p.panel];
  const label = PANEL_LABEL[p.panel];
  return (
    <button
      onClick={onClick}
      className="absolute group"
      style={{
        left: p.x * TILE_SIZE,
        top: p.y * TILE_SIZE,
        width: p.w * TILE_SIZE,
        height: p.h * TILE_SIZE,
        cursor: "pointer",
        transition: "transform 120ms",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      title={label}
    >
      <Sprite w={p.w} h={p.h} />
      <div
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 pixel-label whitespace-nowrap px-2 py-0.5"
        style={{
          background: "var(--color-ink)",
          color: labelColor,
          fontSize: 9,
          letterSpacing: "0.1em",
          border: `2px solid ${labelColor}`,
        }}
      >
        {label}
      </div>
      {p.panel === "inbox" && unread > 0 && (
        <div
          className="absolute -top-2 -right-2 px-1.5 pixel-border"
          style={{
            background: "var(--color-orange)",
            color: "var(--color-ink)",
            fontSize: 10,
            fontFamily: "var(--font-silkscreen)",
            minWidth: 20,
            textAlign: "center",
          }}
        >
          {unread > 99 ? "99+" : unread}
        </div>
      )}
    </button>
  );
}

function OfficeBuilding({
  p,
  onClick,
  workerColors,
  hiredCount,
}: {
  p: OfficePlacement;
  onClick: () => void;
  workerColors: string[];
  hiredCount: number;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute group"
      style={{
        left: p.x * TILE_SIZE,
        top: p.y * TILE_SIZE,
        width: p.w * TILE_SIZE,
        height: p.h * TILE_SIZE,
        cursor: "pointer",
        transition: "transform 120ms",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      title="Open Staff"
    >
      <StaffOfficeBlockSprite w={p.w} h={p.h} workerColors={workerColors} />
      <div
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 pixel-label whitespace-nowrap px-2 py-0.5"
        style={{
          background: "var(--color-ink)",
          color: "#b07bff",
          fontSize: 9,
          letterSpacing: "0.1em",
          border: "2px solid #b07bff",
        }}
      >
        STAFF · {hiredCount}/6
      </div>
    </button>
  );
}

function SlotBuilding({
  p,
  allBuildings,
  yearLocked,
  onClick,
}: {
  p: SlotPlacement;
  allBuildings: BuildingInstance[];
  yearLocked: boolean;
  onClick: () => void;
}) {
  const existing = allBuildings.find(
    (b) =>
      buildingsByDef[b.defId]?.floor === p.floor && b.slot === p.slot,
  );
  const floorColor = FLOOR_COLOR[p.floor];

  if (yearLocked) {
    return (
      <div
        className="absolute"
        style={{
          left: p.x * TILE_SIZE,
          top: p.y * TILE_SIZE,
          width: p.w * TILE_SIZE,
          height: p.h * TILE_SIZE,
          opacity: 0.4,
          pointerEvents: "none",
        }}
      >
        <EmptyPlotSprite w={p.w} h={p.h} color={floorColor} />
        <div
          className="absolute inset-0 grid place-items-center pixel-label"
          style={{ color: "#fff", fontSize: 14 }}
        >
          🔒 Y2
        </div>
      </div>
    );
  }

  const state: "empty" | "building" | "active" = !existing
    ? "empty"
    : existing.building
      ? "building"
      : "active";

  const def = existing ? buildingsByDef[existing.defId] : null;
  const tier = existing?.tier ?? 0;
  const extraH = state === "active" ? getBuildingExtraHeight(tier) : 0;

  return (
    <button
      onClick={onClick}
      className="absolute group"
      style={{
        left: p.x * TILE_SIZE,
        top: p.y * TILE_SIZE - extraH,
        width: p.w * TILE_SIZE,
        height: p.h * TILE_SIZE + extraH,
        cursor: "pointer",
        transition: "transform 120ms",
        zIndex: tier > 3 ? 10 + tier : 1,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      title={def ? `${def.name} T${tier}` : "Build here"}
    >
      {state === "active" && existing && def && (
        <FloorBuildingSprite
          w={p.w}
          h={p.h}
          floorColor={floorColor}
          iconChar={BUILDING_ICON[def.id] ?? def.icon}
          tier={existing.tier}
          variant={p.slot}
        />
      )}
      {state === "building" && (
        <ConstructionSprite
          w={p.w}
          h={p.h}
          quartersLeft={existing!.building!.quartersLeft}
        />
      )}
      {state === "empty" && (
        <EmptyPlotSprite w={p.w} h={p.h} color={floorColor} />
      )}
      {def && state === "active" && (
        <div
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 pixel-label whitespace-nowrap px-2 py-0.5"
          style={{
            background: "var(--color-ink)",
            color: floorColor,
            fontSize: 9,
            border: `2px solid ${floorColor}`,
          }}
        >
          {def.name.toUpperCase()} · T{tier}
        </div>
      )}
    </button>
  );
}

function WalkingWorkers() {
  const hired = useGame((s) => s.hiredEmployees);
  const workers = useMemo(() => {
    const colors = hired
      .map((id) => employeeById[id]?.shirtColor)
      .filter(Boolean) as string[];
    if (colors.length === 0) colors.push("#ff7a1f", "#5fa8ff", "#86efac");
    return [
      { color: colors[0] ?? "#ff7a1f", row: 5, duration: 22, delay: 0, dir: 1 as const },
      { color: colors[1] ?? "#5fa8ff", row: 9, duration: 26, delay: 4, dir: -1 as const },
      { color: colors[2] ?? "#86efac", row: 13, duration: 24, delay: 8, dir: 1 as const },
      { color: colors[0] ?? "#ff7a1f", row: 5, duration: 30, delay: 12, dir: -1 as const },
      { color: colors[1] ?? "#5fa8ff", row: 13, duration: 28, delay: 16, dir: 1 as const },
    ];
  }, [hired]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {workers.map((w, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: w.row * TILE_SIZE + 12,
            left: w.dir === 1 ? -24 : MAP_W * TILE_SIZE + 24,
            animation: `walk-${w.dir === 1 ? "right" : "left"} ${w.duration}s linear ${w.delay}s infinite`,
          }}
        >
          <MiniWorker color={w.color} />
        </div>
      ))}
      <style>{`
        @keyframes walk-right {
          from { transform: translateX(0); }
          to { transform: translateX(${MAP_W * TILE_SIZE + 60}px); }
        }
        @keyframes walk-left {
          from { transform: translateX(0); }
          to { transform: translateX(-${MAP_W * TILE_SIZE + 60}px); }
        }
      `}</style>
    </div>
  );
}

// === MODALS (employee + office staff list) ===

function OfficeStaffModal({
  onClose,
  onPickEmp,
}: {
  onClose: () => void;
  onPickEmp: (id: string) => void;
}) {
  const hired = useGame((s) => s.hiredEmployees);
  const levels = useGame((s) => s.staffLevels);
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[180] bg-black/70 grid place-items-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-panel w-full max-w-2xl screen-enter"
      >
        <div
          className="pixel-titlebar"
          style={{ background: "#b07bff", color: "var(--color-ink)" }}
        >
          <span>STAFF DIRECTORY</span>
          <button onClick={onClose}>
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {employees.map((emp) => {
            const isHired = hired.includes(emp.id);
            const lvl = levels[emp.id] ?? 1;
            return (
              <button
                key={emp.id}
                onClick={() => onPickEmp(emp.id)}
                className="pixel-panel-inset p-3 text-left transition relative"
                style={{
                  borderColor: isHired ? emp.color : undefined,
                  background: isHired ? "var(--color-night-3)" : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="floaty">
                    <WorkerSprite shirt={emp.shirtColor} size={28} />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="pixel-label text-paper truncate"
                      style={{ fontSize: 10 }}
                    >
                      {emp.name}
                    </div>
                    <div
                      className="pixel-label text-paper-faint truncate"
                      style={{ fontSize: 9 }}
                    >
                      {emp.role}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className="pixel-label"
                    style={{
                      fontSize: 9,
                      color: isHired ? emp.color : "var(--color-paper-faint)",
                    }}
                  >
                    {isHired ? "ACTIVE" : "VACANT"}
                  </span>
                  {isHired && (
                    <span style={{ color: emp.color, fontSize: 10 }}>
                      {"★".repeat(lvl)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmployeeModal({
  emp,
  onClose,
}: {
  emp: Employee;
  onClose: () => void;
}) {
  const cash = useGame((s) => s.cash);
  const hired = useGame((s) => s.hiredEmployees.includes(emp.id));
  const level = useGame((s) => s.staffLevels[emp.id] ?? 1);
  const hire = useGame((s) => s.hireEmployee);
  const fire = useGame((s) => s.fireEmployee);
  const promote = useGame((s) => s.promoteEmployee);
  const canHire = !hired && cash >= emp.hireCost;
  const promoteCost =
    level < 3
      ? emp.hireCost * (STAFF_PROMOTE_MULT[(level + 1) as 2 | 3] ?? 1)
      : 0;
  const canPromote = hired && level < 3 && cash >= promoteCost;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/70 grid place-items-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-panel w-full max-w-lg screen-enter"
        style={{ borderColor: emp.color }}
      >
        <div
          className="pixel-titlebar"
          style={{ background: emp.color, color: "var(--color-ink)" }}
        >
          <span>EMPLOYEE.DOSSIER</span>
          <button onClick={onClose}>
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 pixel-panel-inset p-3 relative">
              <WorkerSprite shirt={emp.shirtColor} size={56} />
              {hired && (
                <div
                  className="absolute -top-2 -right-2 px-1 pixel-border bg-night-3"
                  style={{ color: emp.color, fontSize: 10 }}
                >
                  {Array.from({ length: level }).map(() => "★").join("")}
                </div>
              )}
            </div>
            <div>
              <h3 className="pixel-h3 text-orange">{emp.name}</h3>
              <div
                className="pixel-label text-paper-dim mt-1"
                style={{ fontSize: 10 }}
              >
                {emp.role.toUpperCase()} · LEVEL {level}
              </div>
            </div>
          </div>

          <p
            className="text-paper mt-5 leading-snug italic"
            style={{ fontFamily: "var(--font-screen)", fontSize: 22 }}
          >
            &ldquo;{emp.bio}&rdquo;
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="pixel-panel-inset p-3">
              <div className="pixel-label text-paper-faint" style={{ fontSize: 9 }}>
                {hired ? "PROMOTE COST" : "HIRE COST"}
              </div>
              <div className="pixel-data text-amber" style={{ fontSize: 22 }}>
                $
                {((hired && level < 3 ? promoteCost : emp.hireCost) / 1000).toFixed(0)}K
              </div>
            </div>
            <div className="pixel-panel-inset p-3">
              <div className="pixel-label text-paper-faint" style={{ fontSize: 9 }}>
                SALARY / Q
              </div>
              <div className="pixel-data text-cyan" style={{ fontSize: 22 }}>
                $
                {(
                  (emp.salary * (LEVEL_SALARY_MULT[level as 1 | 2 | 3] ?? 1)) /
                  1000
                ).toFixed(0)}
                K
              </div>
            </div>
          </div>

          <div
            className="pixel-panel-inset p-3 mt-3"
            style={{
              borderColor: emp.color,
              background: "var(--color-night-deep)",
            }}
          >
            <div className="pixel-label text-paper-faint" style={{ fontSize: 9 }}>
              BONUS @ L{level} (×
              {LEVEL_BONUS_MULT[level as 1 | 2 | 3]?.toFixed(1) ?? "1.0"})
            </div>
            <div
              className="mt-1"
              style={{
                fontFamily: "var(--font-screen)",
                fontSize: 20,
                color: emp.color,
              }}
            >
              {emp.bonusText}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="pixel-btn pixel-btn-ghost flex-1">
              CANCEL
            </button>
            {!hired && (
              <button
                onClick={() => {
                  hire(emp.id);
                  onClose();
                }}
                disabled={!canHire}
                className="pixel-btn pixel-btn-primary flex-1"
                style={{
                  opacity: canHire ? 1 : 0.5,
                  cursor: canHire ? "pointer" : "not-allowed",
                }}
              >
                <Banknote className="w-4 h-4" />
                {canHire ? "HIRE NOW" : "NEED MORE $"}
              </button>
            )}
            {hired && level < 3 && (
              <button
                onClick={() => {
                  promote(emp.id);
                  onClose();
                }}
                disabled={!canPromote}
                className="pixel-btn pixel-btn-primary flex-1"
                style={{
                  opacity: canPromote ? 1 : 0.5,
                  cursor: canPromote ? "pointer" : "not-allowed",
                }}
              >
                <Star className="w-4 h-4" strokeWidth={3} />
                {canPromote ? `PROMOTE → L${level + 1}` : "NEED MORE $"}
              </button>
            )}
            {hired && (
              <button
                onClick={() => {
                  fire(emp.id);
                  onClose();
                }}
                className="pixel-btn pixel-btn-danger"
                style={{ fontSize: 10 }}
              >
                FIRE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
