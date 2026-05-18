"use client";

import { useGame } from "@/lib/game/store";
import { calcRecipeStats } from "@/lib/game/systems/recipe";
import type {
  DistributionChannel,
  RevenueStreams,
} from "@/lib/game/types";
import { hasBuildingAtTier } from "@/lib/game/systems/building";

const CHANNELS: {
  id: DistributionChannel;
  label: string;
  impact: string;
  bonus: string;
}[] = [
  { id: "retail", label: "Retail Stores", impact: "Broad", bonus: "Volume baseline" },
  { id: "vending", label: "Vending Machines", impact: "Captive", bonus: "+ casual demand" },
  { id: "online", label: "Online / DTC", impact: "Subscribers", bonus: "Better margins" },
  { id: "subscription", label: "Subscription", impact: "Lifestyle", bonus: "Recurring revenue" },
  { id: "school_cafeteria", label: "School Cafeterias", impact: "Kids", bonus: "⚠ High social cost" },
];

export function SalesTab() {
  const price = useGame((s) => s.pricePerBottle);
  const setPrice = useGame((s) => s.setPrice);
  const distribution = useGame((s) => s.distribution);
  const toggleDist = useGame((s) => s.toggleDistribution);
  const recipe = useGame((s) => s.recipe);
  const stats = calcRecipeStats(recipe);
  const brand = useGame((s) => s.brandColor);
  const year = useGame((s) => s.year);
  const buildings = useGame((s) => s.buildings);
  const revenueStreams = useGame((s) => s.revenueStreams);
  const toggleStream = useGame((s) => s.toggleRevenueStream);

  const margin = price - stats.productionCost;
  const marginPct = price > 0 ? (margin / price) * 100 : 0;
  const marginColor =
    marginPct < 40
      ? "var(--color-loss)"
      : marginPct < 60
        ? "var(--color-warn)"
        : "var(--color-profit)";

  const merchUnlocked = year >= 2;
  const licensingUnlocked =
    year >= 2 && hasBuildingAtTier(buildings, "marketingstudio", 2);
  const subscriptionUnlocked = hasBuildingAtTier(buildings, "dtcwarehouse", 1);

  return (
    <div className="grid lg:grid-cols-2 gap-4 h-full overflow-auto">
      <section className="space-y-4 overflow-auto">
        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>PRICE_PER_BOTTLE</span>
            <span className="text-paper-faint">MSRP</span>
          </div>
          <div className="p-5">
            <div className="text-center mb-4">
              <div
                className="pixel-cash"
                style={{ fontSize: 48, color: brand }}
              >
                ${price.toFixed(2)}
              </div>
              <div className="pixel-label text-paper-faint mt-1">
                PER 500 ML BOTTLE
              </div>
            </div>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.1}
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="pixel-slider"
            />
            <div
              className="flex justify-between pixel-label text-paper-faint mt-2"
              style={{ fontSize: 9 }}
            >
              <span>$0.50</span>
              <span>$4.00</span>
              <span>$8.00</span>
            </div>
          </div>
        </div>

        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>MARGIN_REPORT</span>
            <span className="text-paper-faint">% GROSS</span>
          </div>
          <div className="p-5 space-y-3">
            <Row label="Production cost" value={`$${stats.productionCost.toFixed(2)}`} />
            <Row label="MSRP" value={`$${price.toFixed(2)}`} />
            <div className="pixel-divider my-2" />
            <Row
              label="Gross margin"
              value={`$${margin.toFixed(2)} / bottle`}
              big
              color={marginColor}
            />
            <div className="pt-2">
              <div className="pixel-progress" style={{ height: 14 }}>
                <div
                  className="pixel-progress-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, marginPct))}%`,
                    color: marginColor,
                  }}
                />
              </div>
              <div
                className="pixel-label mt-2 text-center"
                style={{ color: marginColor, fontSize: 11 }}
              >
                {marginPct.toFixed(1)}% MARGIN
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 overflow-auto">
        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>DISTRIBUTION_CHANNELS</span>
            <span className="text-paper-faint">TOGGLE</span>
          </div>
          <div className="p-3 space-y-2">
            {CHANNELS.map((c) => {
              const active = distribution[c.id];
              const isSchool = c.id === "school_cafeteria";
              return (
                <button
                  key={c.id}
                  onClick={() => toggleDist(c.id)}
                  className="w-full pixel-panel-inset p-3 flex items-center justify-between gap-3 text-left transition"
                  style={{
                    background: active ? "var(--color-night-3)" : undefined,
                    borderColor: active
                      ? isSchool
                        ? "var(--color-loss)"
                        : brand
                      : undefined,
                  }}
                >
                  <div>
                    <div
                      className="pixel-label text-paper"
                      style={{ fontSize: 11 }}
                    >
                      {c.label}
                    </div>
                    <div
                      className="pixel-label text-paper-faint mt-1"
                      style={{ fontSize: 9 }}
                    >
                      {c.impact} · {c.bonus}
                    </div>
                  </div>
                  <span
                    className="pixel-pip"
                    style={{
                      color: active
                        ? isSchool
                          ? "var(--color-loss)"
                          : "var(--color-profit)"
                        : "var(--color-paper-faint)",
                      width: 16,
                      height: 16,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>REVENUE_STREAMS</span>
            <span className="text-paper-faint">PASSIVE / QUARTER</span>
          </div>
          <div className="p-3 space-y-2">
            <RevenueStreamRow
              id="merch"
              label="Merch Line"
              desc="Bottles, towels, branded swag. +$5K/q."
              unlocked={merchUnlocked}
              lockMsg="Unlocks Year 2."
              active={revenueStreams.merch}
              onToggle={() => toggleStream("merch")}
              brand={brand}
            />
            <RevenueStreamRow
              id="licensing"
              label="Licensing Deal"
              desc="Grocery chain private-labels your formula. +$20K/q. -2 brand trust."
              unlocked={licensingUnlocked}
              lockMsg="Requires Y2 + Marketing Studio T2."
              active={revenueStreams.licensing}
              onToggle={() => toggleStream("licensing")}
              brand={brand}
              warning
            />
            <RevenueStreamRow
              id="subscription"
              label="Subscription Service"
              desc="Monthly delivery direct to consumers. +$30K/q. +1 brand trust."
              unlocked={subscriptionUnlocked}
              lockMsg="Requires DTC Warehouse."
              active={revenueStreams.subscription}
              onToggle={() => toggleStream("subscription")}
              brand={brand}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function RevenueStreamRow({
  id,
  label,
  desc,
  unlocked,
  lockMsg,
  active,
  onToggle,
  brand,
  warning,
}: {
  id: keyof RevenueStreams;
  label: string;
  desc: string;
  unlocked: boolean;
  lockMsg: string;
  active: boolean;
  onToggle: () => void;
  brand: string;
  warning?: boolean;
}) {
  return (
    <button
      onClick={unlocked ? onToggle : undefined}
      disabled={!unlocked}
      className="w-full pixel-panel-inset p-3 flex items-center justify-between gap-3 text-left transition"
      style={{
        background: active ? "var(--color-night-3)" : undefined,
        borderColor: !unlocked
          ? "var(--color-paper-faint)"
          : active
            ? warning
              ? "var(--color-warn)"
              : brand
            : undefined,
        opacity: unlocked ? 1 : 0.5,
        cursor: unlocked ? "pointer" : "not-allowed",
      }}
    >
      <div className="flex-1 min-w-0">
        <div
          className="pixel-label text-paper"
          style={{ fontSize: 11 }}
        >
          {label}
        </div>
        <div
          className="pixel-label text-paper-faint mt-1"
          style={{ fontSize: 9 }}
        >
          {unlocked ? desc : `🔒 ${lockMsg}`}
        </div>
      </div>
      <span
        className="pixel-pip"
        style={{
          color: active ? "var(--color-profit)" : "var(--color-paper-faint)",
          width: 16,
          height: 16,
        }}
      />
    </button>
  );
}

function Row({
  label,
  value,
  big,
  color,
}: {
  label: string;
  value: string;
  big?: boolean;
  color?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="pixel-label text-paper-dim">{label}</span>
      <span
        className="pixel-data"
        style={{
          fontSize: big ? 26 : 18,
          color: color ?? "var(--color-paper)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
