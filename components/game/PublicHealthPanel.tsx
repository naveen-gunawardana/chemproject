"use client";

import { useGame } from "@/lib/game/store";
import {
  computeHealthMetrics,
  HEALTH_SOURCES,
} from "@/lib/game/systems/health";

export function PublicHealthPanel() {
  const cumulative = useGame((s) => s.publicHealthCumulative);
  const quarter = useGame((s) => s.quarter);
  const quartersPlayed = Math.max(1, quarter - 1);
  const m = computeHealthMetrics(cumulative, quartersPlayed);

  const kidExceeds = m.kidSodiumShareOfDailyPct > 100;
  const sugarExceeds = m.kidSugarShareOfDailyPct > 100;

  return (
    <div className="pixel-panel">
      <div className="pixel-titlebar">
        <span>PUBLIC_HEALTH_IMPACT</span>
        <span className="text-paper-faint">S&S 🌍</span>
      </div>
      <div className="p-4 text-paper space-y-5" style={{ fontSize: 14 }}>
        <div className="grid grid-cols-2 gap-3">
          <Stat
            label="UNITS SHIPPED"
            value={fmtNum(m.totalUnits)}
            color="var(--color-cyan)"
          />
          <Stat
            label="SUGAR DELIVERED"
            value={`${fmtNum(m.totalSugarKg)} kg`}
            color="var(--color-warn)"
          />
          <Stat
            label="SODIUM DELIVERED"
            value={`${m.totalSodiumKg} kg`}
            color="var(--color-warn)"
          />
          <Stat
            label="KIDS REACHED"
            value={fmtNum(m.uniqueKidsReached)}
            color={
              m.uniqueKidsReached > 0
                ? "var(--color-loss)"
                : "var(--color-paper-dim)"
            }
          />
        </div>

        <div className="pixel-divider" />

        <section>
          <div
            className="pixel-label text-orange mb-2"
            style={{ fontSize: 10 }}
          >
            ◆ AVG IMPACT ON A SINGLE KID CUSTOMER
          </div>
          <div className="space-y-3">
            <ImpactRow
              label="Daily sodium from your drink"
              value={`${m.avgKidDailySodiumFromYou} mg/day`}
              pct={m.kidSodiumShareOfDailyPct}
              cap={100}
              capLabel="of kid's daily AI (NIH 1800 mg)"
              warn={kidExceeds}
            />
            <ImpactRow
              label="Daily added sugar from your drink"
              value={`${m.avgKidDailySugarFromYou} g/day`}
              pct={m.kidSugarShareOfDailyPct}
              cap={100}
              capLabel="of kid's WHO sugar cap (25 g)"
              warn={sugarExceeds}
            />
          </div>
        </section>

        <div className="pixel-divider" />

        <section>
          <div
            className="pixel-label text-orange mb-2"
            style={{ fontSize: 10 }}
          >
            ◆ MODELED HEALTH OUTCOMES
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat
              label="EST. ER VISITS"
              value={fmtNum(m.estimatedERVisits)}
              color={
                m.estimatedERVisits > 0
                  ? "var(--color-loss)"
                  : "var(--color-paper-dim)"
              }
              sub="Sodium-overload modeled"
            />
            <Stat
              label="OBESITY INDEX"
              value={`${m.childhoodObesityContribution}/100`}
              color={
                m.childhoodObesityContribution > 30
                  ? "var(--color-loss)"
                  : "var(--color-paper-dim)"
              }
              sub="Composite kid-impact index"
            />
          </div>
        </section>

        <div className="pixel-divider" />

        <section>
          <div
            className="pixel-label text-paper-faint mb-2"
            style={{ fontSize: 9 }}
          >
            METHODOLOGY · CITATIONS
          </div>
          <p
            className="text-paper-dim leading-snug"
            style={{ fontSize: 12 }}
          >
            Aggregates assume 8 bottles/kid/quarter (rough repeat-buyer estimate).
            Per-kid metrics divide cumulative shipments by estimated unique
            customers. ER visit estimate scales with sodium-per-unit vs.
            400 mg baseline.
          </p>
          <ul
            className="mt-3 space-y-1 text-paper-faint"
            style={{ fontSize: 11 }}
          >
            {HEALTH_SOURCES.map((s) => (
              <li key={s.label}>
                <strong style={{ color: "var(--color-cyan)" }}>
                  {s.label}:
                </strong>{" "}
                {s.body}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color?: string;
  sub?: string;
}) {
  return (
    <div className="pixel-panel-inset p-3">
      <div className="pixel-label text-paper-faint" style={{ fontSize: 9 }}>
        {label}
      </div>
      <div
        className="pixel-data"
        style={{ color: color ?? "var(--color-paper)", fontSize: 22 }}
      >
        {value}
      </div>
      {sub && (
        <div
          className="pixel-label text-paper-faint mt-1"
          style={{ fontSize: 8 }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function ImpactRow({
  label,
  value,
  pct,
  cap,
  capLabel,
  warn,
}: {
  label: string;
  value: string;
  pct: number;
  cap: number;
  capLabel: string;
  warn: boolean;
}) {
  const filled = Math.max(0, Math.min(200, pct));
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="pixel-label text-paper-dim" style={{ fontSize: 10 }}>
          {label}
        </span>
        <span
          className="pixel-data"
          style={{
            fontSize: 16,
            color: warn ? "var(--color-loss)" : "var(--color-paper)",
          }}
        >
          {value}
        </span>
      </div>
      <div
        className="relative h-4 border-[3px] border-ink"
        style={{ background: "var(--color-night-deep)" }}
      >
        {/* 100% cap marker */}
        <div
          className="absolute h-full w-0.5"
          style={{ left: "50%", background: "#fff", opacity: 0.6 }}
        />
        <div
          className="absolute h-full"
          style={{
            width: `${Math.min(100, filled / 2)}%`,
            background: warn ? "var(--color-loss)" : "var(--color-warn)",
          }}
        />
        {filled > 100 && (
          <div
            className="absolute h-full"
            style={{
              left: "50%",
              width: `${(filled - 100) / 2}%`,
              background: "var(--color-loss)",
              opacity: 0.7,
            }}
          />
        )}
      </div>
      <div
        className="flex justify-between pixel-label text-paper-faint mt-1"
        style={{ fontSize: 9 }}
      >
        <span>{filled.toFixed(1)}%</span>
        <span>{capLabel}</span>
      </div>
    </div>
  );
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
