"use client";

import { useGame } from "@/lib/game/store";
import { buildingsAvailableForFloor } from "@/lib/game/systems/building";
import { buildingsByDef } from "@/lib/game/data/buildings";
import type { BuildingFloor, BuildingInstance } from "@/lib/game/types";
import { X, Hammer, ArrowUp, Clock } from "lucide-react";

interface Props {
  floor: BuildingFloor;
  slot: number;
  existing: BuildingInstance | null;
  onClose: () => void;
}

export function BuildModal({ floor, slot, existing, onClose }: Props) {
  const cash = useGame((s) => s.cash);
  const allBuildings = useGame((s) => s.buildings);
  const queueBuilding = useGame((s) => s.queueBuilding);
  const upgradeBuilding = useGame((s) => s.upgradeBuilding);

  if (existing) {
    return (
      <ExistingDetail
        instance={existing}
        instanceIndex={allBuildings.indexOf(existing)}
        cash={cash}
        onClose={onClose}
        onUpgrade={(idx) => {
          upgradeBuilding(idx);
          onClose();
        }}
      />
    );
  }

  // Empty slot: show pickable buildings (filter out those already on this floor)
  const placedOnFloor = new Set(
    allBuildings
      .filter((b) => buildingsByDef[b.defId]?.floor === floor)
      .map((b) => b.defId),
  );
  const options = buildingsAvailableForFloor(floor).filter(
    (b) => !placedOnFloor.has(b.id),
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[160] bg-black/75 grid place-items-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-panel w-full max-w-2xl max-h-[90vh] flex flex-col screen-enter"
      >
        <div className="pixel-titlebar shrink-0">
          <span className="flex items-center gap-2">
            <Hammer className="w-3.5 h-3.5" strokeWidth={3} />
            BUILD · {floor.toUpperCase()} FLOOR · SLOT {slot + 1}
          </span>
          <button onClick={onClose}>
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
        <div className="overflow-auto p-5 space-y-3">
          {options.length === 0 ? (
            <p className="pixel-label text-paper-faint text-center py-8">
              ALL POSSIBLE BUILDINGS FOR THIS FLOOR ARE PLACED.
            </p>
          ) : (
            options.map((def) => {
              const tier1 = def.tiers[0];
              const canPay = cash >= tier1.cost;
              return (
                <div key={def.id} className="pixel-panel-inset p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="shrink-0 w-12 h-12 grid place-items-center pixel-border"
                      style={{
                        background: "var(--color-night-3)",
                        fontSize: 22,
                      }}
                    >
                      {def.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="pixel-h3 text-orange"
                        style={{ fontSize: 14 }}
                      >
                        {def.name}
                      </h3>
                      <p
                        className="text-paper-dim leading-snug mt-1"
                        style={{ fontFamily: "var(--font-screen)", fontSize: 18 }}
                      >
                        {def.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="pixel-panel-inset p-2">
                      <div
                        className="pixel-label text-paper-faint"
                        style={{ fontSize: 8 }}
                      >
                        T1 COST
                      </div>
                      <div
                        className="pixel-data text-amber"
                        style={{ fontSize: 16 }}
                      >
                        ${(tier1.cost / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div className="pixel-panel-inset p-2">
                      <div
                        className="pixel-label text-paper-faint"
                        style={{ fontSize: 8 }}
                      >
                        BUILD TIME
                      </div>
                      <div
                        className="pixel-data text-cyan flex items-center gap-1"
                        style={{ fontSize: 16 }}
                      >
                        <Clock className="w-3 h-3" />
                        {tier1.quartersToBuild}Q
                      </div>
                    </div>
                    <div className="pixel-panel-inset p-2">
                      <div
                        className="pixel-label text-paper-faint"
                        style={{ fontSize: 8 }}
                      >
                        TIERS
                      </div>
                      <div
                        className="pixel-data text-purple"
                        style={{ fontSize: 16 }}
                      >
                        {def.tiers.length}
                      </div>
                    </div>
                  </div>

                  <p
                    className="pixel-label text-paper-faint mt-3 leading-snug"
                    style={{ fontSize: 10, textTransform: "none" }}
                  >
                    {tier1.description}
                  </p>

                  <button
                    onClick={() => {
                      queueBuilding(def.id, floor, slot);
                      onClose();
                    }}
                    disabled={!canPay}
                    className="pixel-btn pixel-btn-primary w-full mt-3"
                    style={{
                      opacity: canPay ? 1 : 0.5,
                      cursor: canPay ? "pointer" : "not-allowed",
                    }}
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    {canPay
                      ? `BREAK GROUND — $${(tier1.cost / 1000).toFixed(0)}K`
                      : "INSUFFICIENT FUNDS"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function ExistingDetail({
  instance,
  instanceIndex,
  cash,
  onClose,
  onUpgrade,
}: {
  instance: BuildingInstance;
  instanceIndex: number;
  cash: number;
  onClose: () => void;
  onUpgrade: (idx: number) => void;
}) {
  const def = buildingsByDef[instance.defId];
  if (!def) return null;
  const currentTier = def.tiers[instance.tier - 1];
  const nextTier = def.tiers[instance.tier];
  const isBuilding = instance.building !== null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[160] bg-black/75 grid place-items-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-panel w-full max-w-lg screen-enter"
      >
        <div className="pixel-titlebar">
          <span>{def.name.toUpperCase()}</span>
          <button onClick={onClose}>
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="shrink-0 w-14 h-14 grid place-items-center pixel-border"
              style={{
                background: "var(--color-night-3)",
                fontSize: 26,
              }}
            >
              {def.icon}
            </div>
            <div>
              <h3 className="pixel-h3 text-orange">{def.name}</h3>
              <p
                className="text-paper-dim mt-1"
                style={{ fontFamily: "var(--font-screen)", fontSize: 18 }}
              >
                {def.description}
              </p>
              <div
                className="pixel-label text-amber mt-2"
                style={{ fontSize: 10 }}
              >
                ◆ CURRENT: TIER {instance.tier}{" "}
                {Array.from({ length: instance.tier })
                  .map(() => "★")
                  .join("")}
              </div>
            </div>
          </div>

          {isBuilding && instance.building && (
            <div
              className="pixel-panel-inset p-3 flex items-center gap-3"
              style={{ borderColor: "var(--color-cyan)" }}
            >
              <div
                className="pixel-label text-cyan animate-pulse"
                style={{ fontSize: 16 }}
              >
                ⚙
              </div>
              <div>
                <div
                  className="pixel-label text-cyan"
                  style={{ fontSize: 10 }}
                >
                  UNDER CONSTRUCTION
                </div>
                <div
                  className="text-paper"
                  style={{ fontFamily: "var(--font-screen)", fontSize: 18 }}
                >
                  {instance.building.quartersLeft} QUARTER
                  {instance.building.quartersLeft === 1 ? "" : "S"} REMAINING ·
                  GOING TO T{instance.building.targetTier}
                </div>
              </div>
            </div>
          )}

          {currentTier && (
            <div className="pixel-panel-inset p-3">
              <div
                className="pixel-label text-paper-faint mb-2"
                style={{ fontSize: 9 }}
              >
                CURRENT EFFECTS
              </div>
              <p
                className="text-paper"
                style={{
                  fontFamily: "var(--font-screen)",
                  fontSize: 18,
                }}
              >
                {currentTier.description}
              </p>
            </div>
          )}

          {nextTier && !isBuilding && (
            <div
              className="pixel-panel-inset p-3"
              style={{ borderColor: "var(--color-amber)" }}
            >
              <div
                className="pixel-label text-amber mb-2"
                style={{ fontSize: 9 }}
              >
                ↑ UPGRADE TO TIER {instance.tier + 1}
              </div>
              <p
                className="text-paper mb-2"
                style={{ fontFamily: "var(--font-screen)", fontSize: 18 }}
              >
                {nextTier.description}
              </p>
              <div className="flex items-baseline justify-between">
                <span
                  className="pixel-label text-paper-faint"
                  style={{ fontSize: 10 }}
                >
                  COST · BUILD TIME
                </span>
                <span
                  className="pixel-data text-amber"
                  style={{ fontSize: 18 }}
                >
                  ${(nextTier.cost / 1000).toFixed(0)}K ·{" "}
                  {nextTier.quartersToBuild}Q
                </span>
              </div>
              <button
                onClick={() => onUpgrade(instanceIndex)}
                disabled={cash < nextTier.cost}
                className="pixel-btn pixel-btn-primary w-full mt-3"
                style={{
                  opacity: cash >= nextTier.cost ? 1 : 0.5,
                  cursor: cash >= nextTier.cost ? "pointer" : "not-allowed",
                }}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                {cash >= nextTier.cost
                  ? "BREAK GROUND"
                  : "INSUFFICIENT FUNDS"}
              </button>
            </div>
          )}

          {!nextTier && (
            <div
              className="pixel-label text-center"
              style={{ color: "var(--color-purple)", fontSize: 11 }}
            >
              ◆ MAX TIER REACHED ◆
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
