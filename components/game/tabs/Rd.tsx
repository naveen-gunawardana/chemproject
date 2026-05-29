"use client";

import { useGame } from "@/lib/game/store";
import { ingredientById } from "@/lib/game/data/ingredients";
import { calcRecipeStats } from "@/lib/game/systems/recipe";
import { ResearchTree } from "../ResearchTree";

export function RdTab() {
  const recipe = useGame((s) => s.recipe);
  const rdSpend = useGame((s) => s.rdSpendThisQuarter);
  const setRd = useGame((s) => s.setRdSpend);
  const cash = useGame((s) => s.cash);
  const stats = calcRecipeStats(recipe);

  const presentIons = Object.entries(recipe)
    .filter(([id, amt]) => ingredientById[id]?.category === "cation" && amt > 0)
    .map(([id, amt]) => ({ ing: ingredientById[id], amount: amt }));

  const measurements = presentIons.map(({ ing, amount }) => {
    const noise = Math.sin(amount * 31) * 0.15 + 0.05;
    const measured = amount * (1 + noise);
    const within = Math.abs(measured - amount) / amount <= 0.2;
    return { ing, label: amount, measured: Math.round(measured), within };
  });

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-4 h-full overflow-auto">
      <ResearchTree />

      <div className="space-y-4">
        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>LAB_BENCH</span>
            <span className="text-paper-faint">FDA ±20% TOLERANCE</span>
          </div>
          <div
            className="p-4 text-paper"
            style={{ fontSize: 14 }}
          >
            <p className="leading-snug mb-3">
              Three bottles sent to independent lab. Each ion has measurement
              uncertainty. FDA permits ±20% from label.
            </p>
            {measurements.length === 0 ? (
              <p className="pixel-label text-paper-faint">
                No ions in current recipe.
              </p>
            ) : (
              <table
                className="w-full text-paper"
                style={{ fontFamily: "var(--font-screen)", fontSize: 16 }}
              >
                <thead>
                  <tr
                    className="pixel-label text-paper-faint"
                    style={{ fontSize: 9 }}
                  >
                    <th className="text-left pb-2">ION</th>
                    <th className="text-right pb-2">LABEL</th>
                    <th className="text-right pb-2">MEASURED</th>
                    <th className="text-right pb-2">PASS?</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((m) => (
                    <tr key={m.ing.id} className="border-t-[3px] border-ink">
                      <td className="py-2" style={{ color: m.ing.color }}>
                        {m.ing.symbol}
                        <sup>
                          {m.ing.charge && m.ing.charge > 0
                            ? `${m.ing.charge}+`
                            : `${Math.abs(m.ing.charge ?? 0)}−`}
                        </sup>
                      </td>
                      <td className="text-right">{m.label.toFixed(0)} mg</td>
                      <td className="text-right">{m.measured} mg</td>
                      <td className="text-right">
                        <span
                          style={{
                            color: m.within
                              ? "var(--color-profit)"
                              : "var(--color-loss)",
                          }}
                        >
                          {m.within ? "PASS" : "FAIL"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>R&D_BUDGET</span>
            <span className="text-paper-faint">THIS QUARTER</span>
          </div>
          <div className="p-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="pixel-label text-paper-dim">SPEND</span>
              <span className="pixel-data text-amber">
                ${rdSpend >= 1_000_000
                  ? `${(rdSpend / 1_000_000).toFixed(2)}M`
                  : `${(rdSpend / 1000).toFixed(0)}K`}
              </span>
            </div>
            {(() => {
              const dynamicMax = Math.max(
                50_000,
                Math.min(2_000_000, Math.round(cash * 0.4)),
              );
              const step = dynamicMax > 500_000 ? 10_000 : 5_000;
              return (
                <>
                  <input
                    type="range"
                    min={0}
                    max={dynamicMax}
                    step={step}
                    value={Math.min(rdSpend, dynamicMax)}
                    onChange={(e) => setRd(parseInt(e.target.value))}
                    className="pixel-slider"
                  />
                  <div
                    className="flex justify-between pixel-label text-paper-faint mt-1"
                    style={{ fontSize: 9 }}
                  >
                    <span>$0</span>
                    <span>
                      ${dynamicMax >= 1_000_000
                        ? `${(dynamicMax / 1_000_000).toFixed(2)}M`
                        : `${(dynamicMax / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                </>
              );
            })()}
            <p
              className="pixel-label text-paper-faint mt-3 leading-snug"
              style={{ fontSize: 10 }}
            >
              R&D budget represents one-off lab work this quarter. CAP SCALES
              WITH CASH. Wet Lab buildings still required for advanced research.
            </p>
          </div>
        </div>

        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>COULOMBIC.LOG</span>
            <span className="text-paper-faint">EU 🦉</span>
          </div>
          <div
            className="p-4 text-paper space-y-3"
            style={{ fontSize: 14 }}
          >
            <p className="leading-snug">
              <strong className="text-orange">Coulomb&apos;s Law</strong>{" "}
              describes the force between two charged particles:
            </p>
            <div className="pixel-panel-inset p-3 text-center">
              F = k · q₁q₂ / r²
            </div>
            <p className="leading-snug">
              Ionic compounds (NaCl, KCl, MgCl₂...) are held together by
              Coulombic attraction between opposite charges. Water dissolves
              them via ion-dipole forces — the same physics, just three-way.
            </p>
            <p className="leading-snug text-paper-faint italic">
              Every ingredient in your LEARN modals walks through the
              Coulombic story for that compound.
            </p>
          </div>
        </div>

        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>SIG_FIG_NOTE</span>
          </div>
          <div
            className="p-4 text-paper"
            style={{ fontSize: 14 }}
          >
            <p>
              Label sodium reads{" "}
              <span
                className="text-amber pixel-data"
                style={{ fontSize: 16 }}
              >
                {stats.sodiumMg} mg
              </span>
              . FDA tolerates measurement in the range{" "}
              <span className="text-amber">
                {Math.round(stats.sodiumMg * 0.8)}–
                {Math.round(stats.sodiumMg * 1.2)} mg
              </span>
              . That ±20% tolerance is a real source of error when comparing
              brand data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
