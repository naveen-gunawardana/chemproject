"use client";

import { useState } from "react";
import { useGame, selectIsResearched } from "@/lib/game/store";
import { ingredients } from "@/lib/game/data/ingredients";
import { researchById } from "@/lib/game/data/research";
import { calcRecipeStats } from "@/lib/game/systems/recipe";
import type { Ingredient, IngredientCategory } from "@/lib/game/types";
import { AlertTriangle, Lock, BookOpen, Sliders } from "lucide-react";
import { LearnModal } from "../LearnModal";
import { ChemistryAnalysisPanel } from "../ChemistryAnalysis";

const CATEGORY_ORDER: {
  key: IngredientCategory;
  label: string;
  hint: string;
}[] = [
  {
    key: "cation",
    label: "ELECTROLYTE IONS",
    hint: "Charged particles. Coulombic interactions in action.",
  },
  {
    key: "sugar",
    label: "SUGARS / SWEETENERS",
    hint: "The flavor driver. And the social-impact driver.",
  },
  { key: "acid", label: "ACIDS", hint: "Tartness + preservation." },
  { key: "flavor", label: "FLAVOR & COLOR", hint: "What kids see in the store." },
  { key: "premium", label: "PREMIUM ADD-INS", hint: "For marketing surface area." },
];

export function LabTab() {
  const recipe = useGame((s) => s.recipe);
  const setRecipeAmount = useGame((s) => s.setRecipeAmount);
  const researchUnlocked = useGame((s) => s.researchUnlocked);
  const brand = useGame((s) => s.brandColor);
  const stats = calcRecipeStats(recipe);
  const [learn, setLearn] = useState<Ingredient | null>(null);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-4 h-full">
      <div className="space-y-6 pr-2 overflow-auto">
        {CATEGORY_ORDER.map((cat) => {
          const items = ingredients.filter((i) => i.category === cat.key);
          if (!items.length) return null;
          return (
            <section key={cat.key}>
              <div className="flex items-baseline justify-between mb-3 px-1">
                <h3 className="pixel-h3 text-orange">{cat.label}</h3>
                <span className="pixel-label text-paper-faint">{cat.hint}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {items.map((i) => {
                  const unlocked =
                    !i.research || researchUnlocked.includes(i.research);
                  return unlocked ? (
                    <IngredientRow
                      key={i.id}
                      ing={i}
                      amount={recipe[i.id] ?? 0}
                      onChange={(v) => setRecipeAmount(i.id, v)}
                      onLearn={() => setLearn(i)}
                      brand={brand}
                    />
                  ) : (
                    <LockedRow key={i.id} ing={i} />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="space-y-3 overflow-auto">
        <div className="pixel-panel">
          <div className="pixel-titlebar">
            <span>FORMULATION_STATS</span>
            <span className="text-paper-faint">/SERVING</span>
          </div>
          <div className="p-4 space-y-3">
            <StatLine label="Cost / bottle" value={`$${stats.productionCost.toFixed(2)}`} />
            <StatLine label="Sodium" value={`${stats.sodiumMg} mg`} warn={stats.sodiumMg > 500} />
            <StatLine label="Potassium" value={`${stats.potassiumMg} mg`} />
            <StatLine label="Sugar" value={`${stats.sugarG} g`} warn={stats.sugarG > 30} />
            <StatLine label="Calories" value={`${stats.calories} kcal`} />
            {stats.caffeineMg > 0 && (
              <StatLine
                label="Caffeine"
                value={`${stats.caffeineMg} mg`}
                warn={stats.caffeineMg > 200}
              />
            )}
            <div className="pixel-divider my-2" />
            <div>
              <div className="pixel-label text-paper-dim mb-2">MARKETABILITY</div>
              <div className="pixel-progress">
                <div
                  className="pixel-progress-fill"
                  style={{
                    width: `${stats.marketability * 10}%`,
                    color: brand,
                  }}
                />
              </div>
              <div className="pixel-label text-paper-faint mt-1">
                {stats.marketability.toFixed(1)} / 10
              </div>
            </div>
          </div>
        </div>

        {stats.fda.warnings.length > 0 && (
          <div
            className="pixel-panel"
            style={{
              background: "var(--color-night-2)",
              borderColor: "var(--color-warn)",
            }}
          >
            <div
              className="pixel-titlebar"
              style={{ background: "var(--color-warn)", color: "var(--color-ink)" }}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                FDA FLAGS
              </span>
              <span>{stats.fda.severe ? "SEVERE" : "ADVISORY"}</span>
            </div>
            <ul className="p-4 space-y-2 text-paper">
              {stats.fda.warnings.map((w) => (
                <li key={w} className="pixel-label" style={{ fontSize: 10 }}>
                  ▶ {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        <CoulombicSummary recipe={recipe} />

        <ChemistryAnalysisPanel recipe={recipe} />
      </aside>

      {learn && (
        <LearnModal ing={learn} onClose={() => setLearn(null)} />
      )}
    </div>
  );
}

function IngredientRow({
  ing,
  amount,
  onChange,
  onLearn,
  brand,
}: {
  ing: Ingredient;
  amount: number;
  onChange: (v: number) => void;
  onLearn: () => void;
  brand: string;
}) {
  const pct = (amount / ing.maxAmount) * 100;
  return (
    <div className="pixel-panel-inset p-3">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <div className="flex items-baseline gap-2 min-w-0">
          {ing.symbol ? (
            <span
              className="pixel-h3 shrink-0"
              style={{ color: ing.color, fontSize: 14 }}
            >
              {ing.symbol}
              {ing.charge !== undefined && (
                <sup style={{ fontSize: 8 }}>
                  {ing.charge > 0
                    ? `${ing.charge}+`
                    : `${Math.abs(ing.charge)}−`}
                </sup>
              )}
            </span>
          ) : (
            <span
              className="pixel-pip mr-1"
              style={{ color: ing.color }}
            />
          )}
          <span
            className="pixel-label text-paper truncate"
            style={{ fontSize: 11 }}
          >
            {ing.name}
          </span>
        </div>
        <button
          onClick={onLearn}
          className="pixel-label text-paper-faint hover:text-orange transition flex items-center gap-1"
          style={{ fontSize: 9 }}
          aria-label="Learn"
        >
          <BookOpen className="w-3 h-3" />
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={ing.maxAmount}
        step={ing.maxAmount > 50 ? 10 : ing.maxAmount > 5 ? 0.5 : 0.05}
        value={amount}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="pixel-slider"
        style={{ accentColor: brand }}
      />
      <div
        className="flex justify-between mt-2 pixel-label text-paper-dim"
        style={{ fontSize: 9 }}
      >
        <span>
          {amount.toFixed(amount < 1 ? 2 : 0)} {ing.unit}
        </span>
        <span className="text-paper-faint">{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

function LockedRow({ ing }: { ing: Ingredient }) {
  const node = ing.research ? researchById[ing.research] : null;
  return (
    <div
      className="pixel-panel-inset p-3 relative"
      style={{ opacity: 0.6, background: "var(--color-night-deep)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Lock className="w-3 h-3 text-paper-faint" strokeWidth={2.5} />
        <span
          className="pixel-label text-paper-faint truncate"
          style={{ fontSize: 11 }}
        >
          ??? {ing.category.toUpperCase()}
        </span>
      </div>
      <div className="pixel-label text-paper-faint" style={{ fontSize: 9 }}>
        UNLOCK VIA RESEARCH: {node?.name ?? "—"}
      </div>
      <div
        className="pixel-label text-paper-faint mt-1"
        style={{ fontSize: 9 }}
      >
        ▶ GO TO R&D TAB
      </div>
    </div>
  );
}

function StatLine({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="pixel-label text-paper-dim">{label}</span>
      <span
        className="pixel-data"
        style={{
          fontSize: 20,
          color: warn ? "var(--color-warn)" : "var(--color-paper)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function CoulombicSummary({ recipe }: { recipe: Record<string, number> }) {
  const presentIons = ingredients.filter(
    (i) => i.category === "cation" && (recipe[i.id] ?? 0) > 0,
  );
  if (!presentIons.length) return null;
  return (
    <div className="pixel-panel">
      <div className="pixel-titlebar">
        <span>COULOMBIC.LOG</span>
        <span className="text-paper-faint">EU 🦉</span>
      </div>
      <div
        className="p-4 space-y-2 text-paper"
        style={{ fontSize: 14 }}
      >
        <p className="leading-snug">
          In water, ionic compounds dissociate via ion–dipole forces. Each
          present ion is surrounded by oriented H₂O molecules.
        </p>
        <div
          className="space-y-1 mt-3"
          style={{ fontFamily: "var(--font-screen)", fontSize: 16 }}
        >
          {presentIons.map((i) => (
            <div key={i.id} style={{ color: i.color }}>
              {i.dissociation}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
