"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useGame } from "@/lib/game/store";
import { competitors } from "@/lib/game/data/competitors";
import { calcRecipeStats } from "@/lib/game/systems/recipe";
import { PublicHealthPanel } from "../PublicHealthPanel";

const AUDIENCE_COLOR: Record<string, string> = {
  athletes: "#ff7a1f",
  kids: "#ff3a78",
  teens: "#b07bff",
  lifestyle: "#4ecdc4",
  medical: "#5fa8ff",
  control: "#6ee658",
};

export function DashboardTab() {
  const recipe = useGame((s) => s.recipe);
  const price = useGame((s) => s.pricePerBottle);
  const brand = useGame((s) => s.brandColor);
  const companyName = useGame((s) => s.companyName);
  const history = useGame((s) => s.history);
  const stats = calcRecipeStats(recipe);

  // Scatter data: competitors + you
  const scatterData = competitors.map((c) => ({
    name: c.brand,
    sugar: c.sugarG,
    sodium: c.sodiumMg,
    color: AUDIENCE_COLOR[c.audience],
    audience: c.audience,
  }));
  const youPoint = {
    name: companyName,
    sugar: stats.sugarG,
    sodium: stats.sodiumMg,
    color: brand,
    audience: "you",
  };
  const allPoints = [...scatterData, youPoint];

  // History line chart data
  const historyData = history.map((h, i) => ({
    q: i + 1,
    revenue: h.revenue,
    profit: h.netProfit,
    units: h.unitsSold / 1000,
  }));

  return (
    <div className="grid lg:grid-cols-2 gap-4 h-full overflow-auto">
      <div className="lg:col-span-2">
        <PublicHealthPanel />
      </div>
      <div className="pixel-panel">
        <div className="pixel-titlebar">
          <span>COMPETITOR_MAP</span>
          <span className="text-paper-faint">Na⁺ vs SUGAR</span>
        </div>
        <div className="p-4">
          <div style={{ width: "100%", height: 360 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 8 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#4a3f6e" />
                <XAxis
                  type="number"
                  dataKey="sugar"
                  name="Sugar"
                  unit="g"
                  stroke="#c4b29c"
                  domain={[0, 45]}
                  tick={{ fontFamily: "var(--font-vt323)", fontSize: 14 }}
                />
                <YAxis
                  type="number"
                  dataKey="sodium"
                  name="Sodium"
                  unit="mg"
                  stroke="#c4b29c"
                  domain={[0, 600]}
                  tick={{ fontFamily: "var(--font-vt323)", fontSize: 14 }}
                />
                <ZAxis range={[150, 150]} />
                <Tooltip
                  cursor={{ stroke: "#ff7a1f", strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "var(--color-night-deep)",
                    border: "3px solid var(--color-ink)",
                    fontFamily: "var(--font-vt323)",
                    color: "var(--color-paper)",
                    fontSize: 14,
                  }}
                  formatter={(v, name) => [`${v}${name === "Sugar" ? "g" : "mg"}`, String(name)]}
                  labelFormatter={(_l, payload) =>
                    (payload?.[0]?.payload?.name as string) ?? ""
                  }
                />
                <Scatter name="Drinks" data={allPoints} shape="square">
                  {allPoints.map((p, idx) => (
                    <Cell
                      key={idx}
                      fill={p.color}
                      stroke={p.audience === "you" ? "var(--color-paper)" : "var(--color-ink)"}
                      strokeWidth={p.audience === "you" ? 4 : 2}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <Legend2 />
        </div>
      </div>

      <div className="space-y-4">
        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>YOUR_HISTORY</span>
            <span className="text-paper-faint">REVENUE / PROFIT</span>
          </div>
          <div className="p-4">
            {historyData.length === 0 ? (
              <div className="text-center py-8 pixel-label text-paper-faint">
                NO QUARTERS PLAYED YET.
                <br />
                <br />
                END A QUARTER TO GENERATE DATA.
              </div>
            ) : (
              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer>
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#4a3f6e" />
                    <XAxis
                      dataKey="q"
                      stroke="#c4b29c"
                      tick={{ fontFamily: "var(--font-vt323)", fontSize: 14 }}
                      label={{ value: "Quarter", position: "insideBottom", fontSize: 11, fill: "#c4b29c" }}
                    />
                    <YAxis
                      stroke="#c4b29c"
                      tick={{ fontFamily: "var(--font-vt323)", fontSize: 14 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-night-deep)",
                        border: "3px solid var(--color-ink)",
                        fontFamily: "var(--font-vt323)",
                        color: "var(--color-paper)",
                      }}
                    />
                    <Legend wrapperStyle={{ fontFamily: "var(--font-vt323)", fontSize: 14 }} />
                    <Line
                      dataKey="revenue"
                      stroke="var(--color-cyan)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-cyan)", r: 4 }}
                    />
                    <Line
                      dataKey="profit"
                      stroke={brand}
                      strokeWidth={3}
                      dot={{ fill: brand, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>READ_THE_TREND</span>
            <span className="text-paper-faint">DA 📊</span>
          </div>
          <div className="p-4 text-paper" style={{ fontSize: 14 }}>
            <p className="leading-snug">
              Plot sodium vs. sugar across real sports drinks. Two clear
              clusters emerge:
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="pixel-pip" style={{ color: "#ff3a78" }} /> Kid-targeted brands sit in the
                low-Na⁺ / high-sugar corner.
              </li>
              <li>
                <span className="pixel-pip" style={{ color: "#ff7a1f" }} /> Athlete brands cluster around
                250 mg Na⁺ + 30 g sugar.
              </li>
              <li>
                <span className="pixel-pip" style={{ color: "#5fa8ff" }} /> Medical drinks: high Na⁺,
                low sugar — built for rehydration, not refreshment.
              </li>
            </ul>
            <p className="mt-3 leading-snug text-paper-faint italic">
              Manufacturer label tolerance is ±20% — error bars matter.
              See R&D tab to model uncertainty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend2() {
  const items = [
    { color: "#ff7a1f", label: "Athletes" },
    { color: "#ff3a78", label: "Kids" },
    { color: "#b07bff", label: "Teens" },
    { color: "#4ecdc4", label: "Lifestyle" },
    { color: "#5fa8ff", label: "Medical" },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pixel-label text-paper-dim" style={{ fontSize: 10 }}>
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-2">
          <span className="pixel-pip" style={{ color: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
