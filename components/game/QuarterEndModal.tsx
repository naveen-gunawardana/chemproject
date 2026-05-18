"use client";

import { useGame, selectQuarterLabel } from "@/lib/game/store";

function formatCash(n: number): string {
  const sign = n >= 0 ? "+" : "-";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function QuarterEndModal() {
  const result = useGame((s) => s.lastResult);
  const dismiss = useGame((s) => s.dismissResult);
  const game = useGame();
  const brand = useGame((s) => s.brandColor);

  if (!result) return null;

  const profit = result.netProfit;
  const positive = profit >= 0;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 grid place-items-center p-4 screen-enter">
      <div className="pixel-panel w-full max-w-3xl">
        <div className="pixel-titlebar" style={{ background: brand, color: "var(--color-ink)" }}>
          <span>QUARTER_REPORT</span>
          <span>{selectQuarterLabel({ ...game, quarter: result.quarter, year: Math.ceil(result.quarter / 4) } as any)}</span>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="pixel-label text-paper-faint mb-2">NET PROFIT</div>
            <div
              className="pixel-cash count-pop"
              style={{
                fontSize: 56,
                color: positive ? "var(--color-profit)" : "var(--color-loss)",
              }}
            >
              {formatCash(profit)}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <ResultStat label="Revenue" value={`$${(result.revenue / 1000).toFixed(0)}K`} color="var(--color-cyan)" />
            <ResultStat label="Units sold" value={`${(result.unitsSold / 1000).toFixed(0)}K`} />
            <ResultStat label="Production" value={`-$${(result.productionCost / 1000).toFixed(0)}K`} color="var(--color-loss)" />
            <ResultStat label="Marketing" value={`-$${(result.marketingSpend / 1000).toFixed(0)}K`} color="var(--color-loss)" />
          </div>

          <div className="pixel-divider mb-6" />

          <div className="grid grid-cols-3 gap-3 mb-6">
            <DeltaStat
              label="MARKET"
              delta={result.marketShareDelta}
              suffix="%"
              color="var(--color-cyan)"
            />
            <DeltaStat
              label="TRUST"
              delta={result.brandTrustDelta}
              color="var(--color-profit)"
            />
            <DeltaStat
              label="SOC. IMPACT"
              delta={result.socialImpactDelta}
              color="var(--color-loss)"
              invertColor
            />
          </div>

          {result.newsHeadlines.length > 0 && (
            <div className="pixel-panel-inset p-4 mb-6">
              <div className="pixel-label text-orange mb-2">▶ NEWS WIRE</div>
              {result.newsHeadlines.map((h, i) => (
                <p
                  key={i}
                  className="text-paper leading-snug ticker-pop"
                  style={{
                    fontFamily: "var(--font-screen)",
                    fontSize: 20,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  · {h}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={() => dismiss()}
            className="pixel-btn pixel-btn-primary w-full"
            style={{ fontSize: 14 }}
          >
            {game.quarter >= 12 ? "VIEW FINAL REPORT ▶" : "CONTINUE TO NEXT QUARTER ▶"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="pixel-panel-inset p-3">
      <div className="pixel-label text-paper-faint mb-1" style={{ fontSize: 9 }}>
        {label}
      </div>
      <div
        className="pixel-data"
        style={{ color: color ?? "var(--color-paper)", fontSize: 22 }}
      >
        {value}
      </div>
    </div>
  );
}

function DeltaStat({
  label,
  delta,
  suffix = "",
  color = "var(--color-paper)",
  invertColor,
}: {
  label: string;
  delta: number;
  suffix?: string;
  color?: string;
  invertColor?: boolean;
}) {
  const positive = delta >= 0;
  const isGood = invertColor ? !positive : positive;
  return (
    <div className="pixel-panel-inset p-3 text-center">
      <div className="pixel-label text-paper-faint mb-1" style={{ fontSize: 9 }}>
        {label}
      </div>
      <div
        className="pixel-data"
        style={{
          color: isGood ? "var(--color-profit)" : "var(--color-loss)",
          fontSize: 24,
        }}
      >
        {delta >= 0 ? "+" : ""}
        {delta}
        {suffix}
      </div>
    </div>
  );
}
