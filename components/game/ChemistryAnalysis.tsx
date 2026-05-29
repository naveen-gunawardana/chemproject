"use client";

import {
  analyzeChemistry,
  PLASMA_OSMOLARITY,
} from "@/lib/game/systems/chemistry";
import type { Recipe } from "@/lib/game/types";

export function ChemistryAnalysisPanel({ recipe }: { recipe: Recipe }) {
  const a = analyzeChemistry(recipe);

  const classColor = {
    hypo: "var(--color-cyan)",
    iso: "var(--color-profit)",
    hyper: "var(--color-loss)",
  }[a.osmolarityClass];
  const classLabel = {
    hypo: "HYPOTONIC",
    iso: "ISOTONIC ✓",
    hyper: "HYPERTONIC",
  }[a.osmolarityClass];

  return (
    <div className="pixel-panel">
      <div className="pixel-titlebar">
        <span>CHEMISTRY_ANALYSIS</span>
        <span className="text-paper-faint">EU 🦉</span>
      </div>
      <div className="p-4 space-y-4 text-paper" style={{ fontSize: 14 }}>
        {/* Osmolarity */}
        <section>
          <div
            className="pixel-label text-orange mb-2"
            style={{ fontSize: 10 }}
          >
            ◆ OSMOLARITY (vs blood plasma)
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span
              className="pixel-data"
              style={{ fontSize: 26, color: classColor }}
            >
              {a.osmolarity} mOsm/L
            </span>
            <span
              className="pixel-label"
              style={{ fontSize: 11, color: classColor }}
            >
              {classLabel}
            </span>
          </div>
          {/* Visual bar */}
          <div
            className="relative h-5 border-[3px] border-ink"
            style={{ background: "var(--color-night-deep)" }}
          >
            {/* Iso zone */}
            <div
              className="absolute h-full"
              style={{
                left: `${(270 / 600) * 100}%`,
                width: `${((310 - 270) / 600) * 100}%`,
                background: "rgba(110, 230, 88, 0.25)",
              }}
            />
            {/* Plasma marker */}
            <div
              className="absolute h-full w-0.5"
              style={{
                left: `${(PLASMA_OSMOLARITY / 600) * 100}%`,
                background: "var(--color-profit)",
              }}
            />
            {/* Your drink */}
            <div
              className="absolute h-full w-1"
              style={{
                left: `${(Math.min(600, a.osmolarity) / 600) * 100}%`,
                background: classColor,
                boxShadow: `0 0 0 2px var(--color-ink)`,
              }}
            />
          </div>
          <div
            className="flex justify-between pixel-label text-paper-faint mt-1"
            style={{ fontSize: 8 }}
          >
            <span>0</span>
            <span>290 (plasma)</span>
            <span>600 mOsm/L</span>
          </div>
          <p
            className="text-paper-dim mt-2 leading-snug"
            style={{ fontSize: 13 }}
          >
            <strong>{a.osmolarityDelta >= 0 ? "+" : ""}
            {a.osmolarityDelta}</strong> mOsm/L vs plasma.{" "}
            {a.osmolarityClass === "iso"
              ? "Absorbs at roughly the same rate as water — optimal for athletes."
              : a.osmolarityClass === "hypo"
                ? "Absorbs faster than water — fine for quick hydration but limited fuel."
                : "Above plasma — slows water absorption, can cause GI distress."}
          </p>
        </section>

        <div className="pixel-divider" />

        {/* Conductivity */}
        <section>
          <div
            className="pixel-label text-orange mb-1"
            style={{ fontSize: 10 }}
          >
            ◆ ELECTRICAL CONDUCTIVITY
          </div>
          <div className="flex items-baseline justify-between">
            <span className="pixel-data text-cyan" style={{ fontSize: 22 }}>
              {a.conductivitySpermL} mS/cm
            </span>
            <span
              className="pixel-label text-paper-faint"
              style={{ fontSize: 9 }}
            >
              SUM OVER ALL IONS · σ = Σ Cᵢλᵢ
            </span>
          </div>
          <p
            className="text-paper-dim mt-2 leading-snug"
            style={{ fontSize: 13 }}
          >
            Free ions in solution carry charge. More ions → higher conductivity.
            Pure water: ~0.0005 mS/cm. Seawater: ~50 mS/cm. Sports drinks: ~3-8
            mS/cm depending on electrolyte load.
          </p>
        </section>

        <div className="pixel-divider" />

        {/* Ion balance */}
        <section>
          <div
            className="pixel-label text-orange mb-2"
            style={{ fontSize: 10 }}
          >
            ◆ ION INVENTORY (mmol/L)
          </div>
          <table
            className="w-full"
            style={{ fontFamily: "var(--font-screen)", fontSize: 16 }}
          >
            <tbody>
              <Row label="Na⁺ (sodium)" value={`${a.naMolarityMM} mM`} color="#facc15" />
              <Row label="K⁺ (potassium)" value={`${a.kMolarityMM} mM`} color="#c084fc" />
              <Row label="Cl⁻ (chloride, paired)" value={`${(a.totalIonMolarityMM - a.naMolarityMM - a.kMolarityMM).toFixed(1)} mM`} color="#86efac" />
              <Row label="Sugar (non-ionic)" value={`${a.sugarMolarityMM} mM`} color="#ffb700" />
              <tr><td colSpan={3}><div className="pixel-divider my-1" /></td></tr>
              <Row label="Total ions" value={`${a.totalIonMolarityMM} mM`} bold />
            </tbody>
          </table>
        </section>

        <div className="pixel-divider" />

        {/* Coulomb force */}
        <section>
          <div
            className="pixel-label text-orange mb-1"
            style={{ fontSize: 10 }}
          >
            ◆ COULOMB FORCE · Na⁺ ↔ Cl⁻ @ 1 nm
          </div>
          <div className="pixel-panel-inset p-3 text-center">
            <div
              style={{
                fontFamily: "var(--font-screen)",
                fontSize: 18,
                color: "var(--color-paper)",
              }}
            >
              F = k · q₁q₂ / r²
            </div>
            <div
              className="pixel-data text-amber mt-2"
              style={{ fontSize: 22 }}
            >
              {a.coulombForceN.toExponential(2)} N
            </div>
            <p
              className="text-paper-dim mt-2 leading-snug"
              style={{ fontSize: 12 }}
            >
              ≈ 0.23 nN per ion pair at 1 nm. In water, ion-dipole forces from
              H₂O overcome this attraction — that&apos;s why NaCl dissolves
              instead of staying as crystals.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) {
  return (
    <tr>
      <td className="pl-1 py-0.5">
        {color && (
          <span
            className="pixel-pip mr-2"
            style={{ color, width: 8, height: 8 }}
          />
        )}
        <span style={{ fontWeight: bold ? "bold" : "normal" }}>{label}</span>
      </td>
      <td
        className="text-right tabular-nums"
        style={{
          color: color ?? "var(--color-paper)",
          fontWeight: bold ? "bold" : "normal",
        }}
      >
        {value}
      </td>
    </tr>
  );
}
