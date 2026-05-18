"use client";

import { useState } from "react";
import { useGame } from "@/lib/game/store";
import { researchNodes, researchById } from "@/lib/game/data/research";
import { canResearch } from "@/lib/game/systems/research";
import { ingredientById } from "@/lib/game/data/ingredients";
import { buildingsByDef } from "@/lib/game/data/buildings";
import { Lock, Check, FlaskConical, X } from "lucide-react";
import type { ResearchNode } from "@/lib/game/types";

const COL_W = 220;
const COL_GAP = 32;
const NODE_H = 110;
const NODE_GAP = 22;
const Y_OFFSET = 2; // shift node.position.y so min is 0

export function ResearchTree() {
  const cash = useGame((s) => s.cash);
  const unlocked = useGame((s) => s.researchUnlocked);
  const buildings = useGame((s) => s.buildings);
  const research = useGame((s) => s.startResearch);
  const [open, setOpen] = useState<ResearchNode | null>(null);

  // Coords helpers
  const nodeX = (n: ResearchNode) => n.position.x * (COL_W + COL_GAP);
  const nodeY = (n: ResearchNode) => (n.position.y + Y_OFFSET) * (NODE_H + NODE_GAP);

  // Compute container size
  const maxX = Math.max(...researchNodes.map((n) => n.position.x));
  const maxY = Math.max(...researchNodes.map((n) => n.position.y + Y_OFFSET));
  const minY = Math.min(...researchNodes.map((n) => n.position.y + Y_OFFSET));
  const totalW = (maxX + 1) * COL_W + maxX * COL_GAP;
  const totalH = (maxY - minY + 1) * (NODE_H + NODE_GAP);

  // Lines from prereq → node
  const lines: { from: ResearchNode; to: ResearchNode }[] = [];
  for (const n of researchNodes) {
    for (const p of n.prerequisites) {
      if (p.kind === "research") {
        const from = researchById[p.id];
        if (from) lines.push({ from, to: n });
      }
    }
  }

  return (
    <div className="pixel-panel">
      <div className="pixel-titlebar">
        <span>RESEARCH_TREE</span>
        <span className="text-paper-faint">
          {unlocked.length}/{researchNodes.length} UNLOCKED
        </span>
      </div>
      <div className="overflow-auto p-6">
        <div
          className="relative"
          style={{ width: totalW, height: totalH, minWidth: totalW }}
        >
          <svg
            className="absolute inset-0 pointer-events-none"
            width={totalW}
            height={totalH}
            style={{ imageRendering: "pixelated" }}
          >
            {lines.map((l, i) => {
              const x1 = nodeX(l.from) + COL_W;
              const y1 = nodeY(l.from) + NODE_H / 2 - minY * (NODE_H + NODE_GAP);
              const x2 = nodeX(l.to);
              const y2 = nodeY(l.to) + NODE_H / 2 - minY * (NODE_H + NODE_GAP);
              const midX = (x1 + x2) / 2;
              const path = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
              const done = unlocked.includes(l.to.id);
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke={done ? "var(--color-orange)" : "var(--color-night-bevel-light)"}
                  strokeWidth={3}
                  strokeDasharray={done ? "none" : "6 6"}
                />
              );
            })}
          </svg>

          {researchNodes.map((n) => {
            const x = nodeX(n);
            const y = nodeY(n) - minY * (NODE_H + NODE_GAP);
            const isUnlocked = unlocked.includes(n.id);
            const check = isUnlocked
              ? { ok: false as const, reason: "Already researched" }
              : canResearch(n, unlocked, buildings);
            const canPay = cash >= n.cost;
            const available = check.ok && canPay;
            return (
              <button
                key={n.id}
                onClick={() => setOpen(n)}
                className="absolute pixel-panel-inset p-3 text-left transition"
                style={{
                  left: x,
                  top: y,
                  width: COL_W,
                  height: NODE_H,
                  background: isUnlocked
                    ? "var(--color-night-3)"
                    : available
                      ? "var(--color-night-2)"
                      : "var(--color-night-deep)",
                  borderColor: isUnlocked
                    ? "var(--color-orange)"
                    : available
                      ? "var(--color-amber)"
                      : "var(--color-ink)",
                  opacity: isUnlocked ? 1 : available ? 1 : 0.6,
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <span
                    className="pixel-label text-paper truncate"
                    style={{
                      fontSize: 11,
                      color: isUnlocked
                        ? "var(--color-orange)"
                        : "var(--color-paper)",
                    }}
                  >
                    {n.name}
                  </span>
                  {isUnlocked ? (
                    <Check
                      className="w-3.5 h-3.5 text-orange shrink-0"
                      strokeWidth={3}
                    />
                  ) : check.ok ? (
                    <FlaskConical
                      className="w-3.5 h-3.5 text-amber shrink-0"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Lock
                      className="w-3.5 h-3.5 text-paper-faint shrink-0"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
                <div
                  className="pixel-label text-paper-faint"
                  style={{ fontSize: 9 }}
                >
                  ${(n.cost / 1000).toFixed(0)}K · UNLOCKS{" "}
                  {n.unlocks.length} INGREDIENT
                  {n.unlocks.length === 1 ? "" : "S"}
                </div>
                <div
                  className="pixel-label text-paper-faint mt-2 leading-snug"
                  style={{ fontSize: 9, textTransform: "none" }}
                >
                  {n.unlocks
                    .map((u) => ingredientById[u.id]?.name ?? u.id)
                    .join(", ")}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {open && (
        <ResearchModal
          node={open}
          onClose={() => setOpen(null)}
          onResearch={() => {
            research(open.id);
            setOpen(null);
          }}
        />
      )}
    </div>
  );
}

function ResearchModal({
  node,
  onClose,
  onResearch,
}: {
  node: ResearchNode;
  onClose: () => void;
  onResearch: () => void;
}) {
  const cash = useGame((s) => s.cash);
  const unlocked = useGame((s) => s.researchUnlocked);
  const buildings = useGame((s) => s.buildings);
  const isUnlocked = unlocked.includes(node.id);
  const check = isUnlocked
    ? { ok: false as const, reason: "Already researched" }
    : canResearch(node, unlocked, buildings);
  const canPay = cash >= node.cost;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[160] bg-black/75 grid place-items-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-panel w-full max-w-md screen-enter"
        style={{ borderColor: "var(--color-amber)" }}
      >
        <div
          className="pixel-titlebar"
          style={{ background: "var(--color-amber)", color: "var(--color-ink)" }}
        >
          <span className="flex items-center gap-2">
            <FlaskConical className="w-3.5 h-3.5" strokeWidth={3} />
            RESEARCH NODE
          </span>
          <button onClick={onClose}>
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <h3 className="pixel-h3 text-orange">{node.name}</h3>
          <p
            className="text-paper leading-snug"
            style={{ fontFamily: "var(--font-screen)", fontSize: 22 }}
          >
            {node.description}
          </p>

          <div className="pixel-panel-inset p-3">
            <div
              className="pixel-label text-paper-faint mb-1"
              style={{ fontSize: 9 }}
            >
              UNLOCKS
            </div>
            <div className="flex flex-wrap gap-2">
              {node.unlocks.map((u) => {
                const ing = ingredientById[u.id];
                if (!ing) return null;
                return (
                  <span
                    key={u.id}
                    className="pixel-label px-2 py-1"
                    style={{
                      background: ing.color,
                      color: "var(--color-ink)",
                      fontSize: 10,
                    }}
                  >
                    {ing.name}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="pixel-panel-inset p-3">
            <div
              className="pixel-label text-paper-faint mb-2"
              style={{ fontSize: 9 }}
            >
              PREREQUISITES
            </div>
            {node.prerequisites.length === 0 ? (
              <div
                className="pixel-label"
                style={{ fontSize: 11, color: "var(--color-profit)" }}
              >
                ✓ NONE
              </div>
            ) : (
              <ul className="space-y-1">
                {node.prerequisites.map((p, i) => {
                  let label = "";
                  let met = false;
                  if (p.kind === "research") {
                    const dep = researchById[p.id];
                    label = `Research: ${dep?.name ?? p.id}`;
                    met = unlocked.includes(p.id);
                  } else {
                    const def = buildingsByDef[p.defId];
                    label = `${def?.name ?? p.defId} (T${p.tier})`;
                    met = buildings.some(
                      (b) =>
                        b.defId === p.defId && b.tier >= p.tier && b.building === null,
                    );
                  }
                  return (
                    <li
                      key={i}
                      className="pixel-label flex items-center gap-2"
                      style={{
                        fontSize: 10,
                        color: met
                          ? "var(--color-profit)"
                          : "var(--color-loss)",
                      }}
                    >
                      {met ? "✓" : "✗"} {label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex items-baseline justify-between">
            <span className="pixel-label text-paper-dim">COST</span>
            <span
              className="pixel-data"
              style={{
                fontSize: 28,
                color: canPay ? "var(--color-amber)" : "var(--color-loss)",
              }}
            >
              ${(node.cost / 1000).toFixed(0)}K
            </span>
          </div>

          <button
            onClick={onResearch}
            disabled={!check.ok || !canPay}
            className="pixel-btn pixel-btn-primary w-full"
            style={{
              opacity: check.ok && canPay ? 1 : 0.5,
              cursor: check.ok && canPay ? "pointer" : "not-allowed",
            }}
          >
            {isUnlocked
              ? "ALREADY UNLOCKED"
              : !check.ok
                ? check.reason.toUpperCase()
                : !canPay
                  ? "INSUFFICIENT FUNDS"
                  : "RESEARCH NOW"}
          </button>
        </div>
      </div>
    </div>
  );
}
