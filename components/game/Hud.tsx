"use client";

import { useEffect, useRef, useState } from "react";
import {
  useGame,
  selectTotalSalary,
} from "@/lib/game/store";
import { projectQuarter } from "@/lib/game/systems/simulate";
import {
  Coins,
  TrendingUp,
  Heart,
  Newspaper,
  FastForward,
  Users,
  TrendingDown,
} from "lucide-react";

function formatCash(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${sign}$${(abs / 1000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs).toLocaleString()}`;
}

function useAnimatedNumber(value: number, duration = 800): number {
  const [display, setDisplay] = useState(value);
  const startValueRef = useRef(value);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (Math.abs(value - display) < 0.5) {
      setDisplay(value);
      return;
    }
    startValueRef.current = display;
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTimeRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next =
        startValueRef.current + (value - startValueRef.current) * eased;
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}

export function Hud() {
  const game = useGame();
  const totalSalary = useGame(selectTotalSalary);
  const animCash = useAnimatedNumber(game.cash, 900);
  const animShare = useAnimatedNumber(game.marketSharePct, 600);
  const animTrust = useAnimatedNumber(game.brandTrust, 600);
  const animPress = useAnimatedNumber(game.pressSentiment, 600);

  const cashColor = game.cash >= 0 ? "var(--color-amber)" : "var(--color-loss)";

  return (
    <header className="pixel-panel mx-3 mt-3 mb-2 flex items-stretch flex-wrap gap-px">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-3 border-r-[3px] border-ink min-w-[200px]">
        <div
          className="w-10 h-10 grid place-items-center text-ink pixel-border"
          style={{
            background: game.brandColor,
            boxShadow:
              "inset 3px 3px 0 0 rgba(255,255,255,0.4), inset -3px -3px 0 0 rgba(0,0,0,0.4)",
          }}
        >
          <span className="pixel-h3" style={{ fontSize: 12 }}>
            {game.companyName.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="leading-tight">
          <div className="pixel-label text-paper">{game.companyName}</div>
          <div
            className="pixel-label text-paper-faint flex items-center gap-1"
            style={{ fontSize: 9 }}
          >
            <span className="pixel-pip" style={{ color: "var(--color-profit)", width: 6, height: 6 }} />
            Q{game.quarter}/12 · SAVED
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-stretch flex-wrap">
        <Stat
          icon={<Coins className="w-4 h-4" />}
          label="CASH"
          value={formatCash(animCash)}
          color={cashColor}
        />
        <Stat
          icon={<TrendingUp className="w-4 h-4" />}
          label="MARKET"
          value={`${animShare.toFixed(1)}%`}
          color="var(--color-cyan)"
        />
        <Stat
          icon={<Heart className="w-4 h-4" />}
          label="TRUST"
          value={`${Math.round(animTrust)}`}
          color="var(--color-green)"
          progress={animTrust}
        />
        <Stat
          icon={<Newspaper className="w-4 h-4" />}
          label="PRESS"
          value={
            animPress > 0
              ? `+${Math.round(animPress)}`
              : `${Math.round(animPress)}`
          }
          color={
            animPress >= 0 ? "var(--color-cyan)" : "var(--color-loss)"
          }
        />
        {game.hiredEmployees.length > 0 && (
          <Stat
            icon={<Users className="w-4 h-4" />}
            label="STAFF"
            value={`${game.hiredEmployees.length}`}
            color="var(--color-purple)"
            sub={`-$${(totalSalary / 1000).toFixed(0)}K/Q`}
          />
        )}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 border-l-[3px] border-ink">
        <ProjectionTile />
        <button
          onClick={() => game.endQuarter()}
          className="pixel-btn pixel-btn-primary glow-pulse"
          style={{ fontSize: 12, color: "var(--color-ink)" }}
        >
          <FastForward className="w-4 h-4" strokeWidth={3} />
          END QUARTER
        </button>
      </div>
    </header>
  );
}

function ProjectionTile() {
  const game = useGame();
  const projection = projectQuarter({
    recipe: game.recipe,
    price: game.pricePerBottle,
    campaign: game.campaign,
    rdSpend: game.rdSpendThisQuarter,
    prevMarketSharePct: game.marketSharePct,
    prevBrandTrust: game.brandTrust,
    prevPressSentiment: game.pressSentiment,
    quarter: game.quarter,
    hiredEmployees: game.hiredEmployees,
    staffLevels: game.staffLevels,
    buildings: game.buildings,
    revenueStreams: game.revenueStreams,
  });
  const positive = projection.netProfit >= 0;
  const color = positive
    ? "var(--color-profit)"
    : "var(--color-loss)";
  const Icon = positive ? TrendingUp : TrendingDown;
  const abs = Math.abs(projection.netProfit);
  const formatted =
    abs >= 1_000_000
      ? `${positive ? "+" : "-"}$${(abs / 1_000_000).toFixed(2)}M`
      : abs >= 1000
        ? `${positive ? "+" : "-"}$${(abs / 1000).toFixed(1)}K`
        : `${positive ? "+" : "-"}$${abs}`;
  return (
    <div
      className="text-right leading-tight pixel-panel-inset px-3 py-2"
      title={`Revenue ~$${(projection.revenue / 1000).toFixed(1)}K · Cost ~$${(
        (projection.productionCost +
          projection.marketingSpend +
          projection.rdSpend +
          projection.salaries) /
        1000
      ).toFixed(1)}K · Net ${formatted}`}
      style={{ minWidth: 110 }}
    >
      <div
        className="pixel-label text-paper-faint flex items-center gap-1 justify-end"
        style={{ fontSize: 9 }}
      >
        <Icon className="w-3 h-3" style={{ color }} strokeWidth={2.5} />
        EST. NET
      </div>
      <div
        className="pixel-h3"
        style={{ color, fontSize: 16 }}
      >
        {formatted}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  color,
  progress,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
  progress?: number;
  sub?: string;
}) {
  return (
    <div className="flex-1 min-w-[140px] px-4 py-3 border-r-[3px] border-ink">
      <div className="pixel-label text-paper-faint flex items-center gap-2 mb-1">
        <span style={{ color: color ?? "var(--color-paper-dim)" }}>{icon}</span>
        {label}
      </div>
      <div
        className="pixel-data"
        style={{ color: color ?? "var(--color-paper)" }}
      >
        {value}
      </div>
      {sub && (
        <div
          className="pixel-label text-paper-faint mt-1"
          style={{ fontSize: 9 }}
        >
          {sub}
        </div>
      )}
      {progress !== undefined && (
        <div className="pixel-progress mt-2" style={{ height: 8 }}>
          <div
            className="pixel-progress-fill"
            style={{
              width: `${Math.max(0, Math.min(100, progress))}%`,
              color: color ?? "var(--color-paper)",
            }}
          />
        </div>
      )}
    </div>
  );
}
