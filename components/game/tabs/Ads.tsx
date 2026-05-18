"use client";

import { useMemo } from "react";
import { useGame } from "@/lib/game/store";
import { taglines } from "@/lib/game/data/taglines";
import { calcRecipeStats } from "@/lib/game/systems/recipe";
import type { Demographic, Channel } from "@/lib/game/types";

const DEMOS: { id: Demographic; label: string; desc: string; emoji: string }[] = [
  { id: "athletes", label: "Athletes", desc: "Small. Discerning.", emoji: "🏃" },
  { id: "kids", label: "Kids 5–12", desc: "Big. Parents pay.", emoji: "👶" },
  { id: "teens", label: "Teens 13–18", desc: "TikTok-pilled.", emoji: "📱" },
  { id: "lifestyle", label: "Lifestyle", desc: "Wellness adults.", emoji: "🧘" },
  { id: "medical", label: "Medical", desc: "Sick or recovering.", emoji: "🏥" },
];

const CHANNELS: { id: Channel; label: string; desc: string }[] = [
  { id: "tv", label: "TV", desc: "Broad reach. Pricey." },
  { id: "instagram", label: "Instagram", desc: "Demo-targeted." },
  { id: "tiktok", label: "TikTok", desc: "Viral or nothing." },
  { id: "school", label: "Schools", desc: "Captive audience." },
  { id: "gym", label: "Gyms", desc: "Athlete crossover." },
  { id: "medical", label: "Clinics", desc: "FDA-watched." },
];

export function AdsTab() {
  const campaign = useGame((s) => s.campaign);
  const setCampaign = useGame((s) => s.setCampaign);
  const recipe = useGame((s) => s.recipe);
  const brand = useGame((s) => s.brandColor);
  const companyName = useGame((s) => s.companyName);
  const stats = calcRecipeStats(recipe);

  const availableTaglines = useMemo(() => {
    const fits = taglines.filter(
      (t) => !t.fits || t.fits.includes(campaign.demographic),
    );
    // Pick 4 stable suggestions seeded by demographic
    const seed = campaign.demographic.length;
    return fits.slice(seed % Math.max(1, fits.length - 3), seed % Math.max(1, fits.length - 3) + 4);
  }, [campaign.demographic]);

  const selectedTagline = taglines.find((t) => t.id === campaign.taglineId);

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-4 h-full">
      <div className="space-y-5 overflow-auto pr-2">
        {/* Demographic */}
        <section>
          <h3 className="pixel-h3 text-orange mb-3">TARGET DEMOGRAPHIC</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {DEMOS.map((d) => {
              const active = campaign.demographic === d.id;
              const ethical = d.id !== "kids" && d.id !== "teens";
              return (
                <button
                  key={d.id}
                  onClick={() => setCampaign({ demographic: d.id })}
                  className="pixel-panel-inset p-3 text-left transition"
                  style={{
                    background: active ? "var(--color-night-3)" : undefined,
                    borderColor: active ? brand : undefined,
                    boxShadow: active
                      ? `inset 3px 3px 0 0 ${brand}55, inset -3px -3px 0 0 var(--color-night-bevel-dark)`
                      : undefined,
                  }}
                >
                  <div className="text-2xl mb-1">{d.emoji}</div>
                  <div className="pixel-label text-paper" style={{ fontSize: 10 }}>
                    {d.label}
                  </div>
                  <div className="pixel-label text-paper-faint mt-1" style={{ fontSize: 8 }}>
                    {d.desc}
                  </div>
                  {!ethical && (
                    <div
                      className="pixel-label mt-2"
                      style={{ fontSize: 8, color: "var(--color-magenta)" }}
                    >
                      ⚠ HIGH IMPACT
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Channel */}
        <section>
          <h3 className="pixel-h3 text-orange mb-3">CHANNEL</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CHANNELS.map((c) => {
              const active = campaign.channel === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCampaign({ channel: c.id })}
                  className="pixel-panel-inset p-3 text-left"
                  style={{
                    background: active ? "var(--color-night-3)" : undefined,
                    borderColor: active ? brand : undefined,
                  }}
                >
                  <div className="pixel-label text-paper" style={{ fontSize: 11 }}>
                    {c.label}
                  </div>
                  <div className="pixel-label text-paper-faint mt-1" style={{ fontSize: 9 }}>
                    {c.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tagline */}
        <section>
          <h3 className="pixel-h3 text-orange mb-3">TAGLINE</h3>
          <div className="space-y-2">
            {availableTaglines.map((t) => {
              const active = campaign.taglineId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setCampaign({ taglineId: t.id })}
                  className="w-full pixel-panel-inset p-4 text-left transition"
                  style={{
                    background: active ? "var(--color-night-3)" : undefined,
                    borderColor: active ? brand : undefined,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="text-paper italic"
                      style={{ fontFamily: "var(--font-screen)", fontSize: 22, lineHeight: 1.2 }}
                    >
                      &ldquo;{t.text}&rdquo;
                    </span>
                    {active && (
                      <span className="pixel-label text-orange" style={{ fontSize: 9 }}>
                        ▶ ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 mt-3">
                    <Meter
                      label="MARKET BOOST"
                      value={t.marketingBoost}
                      max={10}
                      color="var(--color-green)"
                    />
                    <Meter
                      label="IMPACT COST"
                      value={t.socialImpactCost}
                      max={10}
                      color="var(--color-loss)"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Budget */}
        <section>
          <h3 className="pixel-h3 text-orange mb-3">BUDGET</h3>
          <BudgetSlider />
        </section>
      </div>

      {/* Right side: Ad poster preview */}
      <aside className="overflow-auto">
        <div className="pixel-panel sticky top-0">
          <div className="pixel-titlebar">
            <span>PREVIEW.PNG</span>
            <span className="text-paper-faint">LIVE</span>
          </div>
          <div className="p-3">
            <AdPoster
              brand={brand}
              companyName={companyName}
              tagline={selectedTagline?.text ?? "[no tagline selected]"}
              demographic={campaign.demographic}
              channel={campaign.channel}
              sugarG={stats.sugarG}
              sodiumMg={stats.sodiumMg}
            />
            <p
              className="pixel-label text-paper-faint mt-3 text-center"
              style={{ fontSize: 9 }}
            >
              YOUR AD AS IT WOULD RUN ON {channelLabel(campaign.channel)}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Meter({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div className="flex-1">
      <div className="pixel-label text-paper-faint" style={{ fontSize: 8 }}>
        {label}
      </div>
      <div className="pixel-progress mt-1" style={{ height: 10 }}>
        <div
          className="pixel-progress-fill"
          style={{ width: `${(value / max) * 100}%`, color }}
        />
      </div>
    </div>
  );
}

function BudgetSlider() {
  const campaign = useGame((s) => s.campaign);
  const setCampaign = useGame((s) => s.setCampaign);
  const cash = useGame((s) => s.cash);
  // Scales: small early, large as empire grows. Hard cap at $10M.
  const dynamicMax = Math.max(
    100_000,
    Math.min(10_000_000, Math.round(cash * 0.6)),
  );
  const step = dynamicMax > 1_000_000 ? 10_000 : 5_000;

  return (
    <div className="pixel-panel-inset p-4">
      <div className="flex justify-between items-baseline mb-2">
        <span className="pixel-label text-paper-dim">SPEND THIS QUARTER</span>
        <span className="pixel-data text-amber">
          ${campaign.budget >= 1_000_000
            ? `${(campaign.budget / 1_000_000).toFixed(2)}M`
            : `${(campaign.budget / 1000).toFixed(0)}K`}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={dynamicMax}
        step={step}
        value={Math.min(campaign.budget, dynamicMax)}
        onChange={(e) => setCampaign({ budget: parseInt(e.target.value) })}
        className="pixel-slider"
      />
      <div
        className="flex justify-between pixel-label text-paper-faint mt-2"
        style={{ fontSize: 9 }}
      >
        <span>$0</span>
        <span>
          ${dynamicMax >= 1_000_000
            ? `${(dynamicMax / 2 / 1_000_000).toFixed(1)}M`
            : `${(dynamicMax / 2 / 1000).toFixed(0)}K`}
        </span>
        <span>
          ${dynamicMax >= 1_000_000
            ? `${(dynamicMax / 1_000_000).toFixed(1)}M`
            : `${(dynamicMax / 1000).toFixed(0)}K`}
        </span>
      </div>
      <p
        className="pixel-label text-paper-faint mt-2"
        style={{ fontSize: 9 }}
      >
        CAP SCALES WITH CASH ON HAND
      </p>
    </div>
  );
}

function channelLabel(c: Channel): string {
  return (
    {
      tv: "BROADCAST TV",
      instagram: "INSTAGRAM REEL",
      tiktok: "TIKTOK FYP",
      school: "SCHOOL POSTER",
      gym: "GYM TOWEL CARD",
      medical: "PHARMACY ENDCAP",
    } as const
  )[c];
}

function AdPoster({
  brand,
  companyName,
  tagline,
  demographic,
  sugarG,
  sodiumMg,
}: {
  brand: string;
  companyName: string;
  tagline: string;
  demographic: Demographic;
  channel: Channel;
  sugarG: number;
  sodiumMg: number;
}) {
  return (
    <div
      className="aspect-[3/4] relative overflow-hidden pixel-border"
      style={{
        background: `linear-gradient(135deg, ${brand}, #050507 80%)`,
        boxShadow: "inset 4px 4px 0 0 rgba(255,255,255,0.2), inset -4px -4px 0 0 rgba(0,0,0,0.5)",
      }}
    >
      <div className="absolute inset-0 [background:repeating-linear-gradient(-45deg,transparent_0_24px,rgba(0,0,0,0.15)_24px_28px)]" />

      <div className="relative h-full p-5 flex flex-col">
        <div
          className="pixel-label"
          style={{ fontSize: 9, color: "var(--color-ink)" }}
        >
          ◆ NEW · OFFICIAL HYDRATION OF YOU
        </div>

        <h2
          className="mt-4 pixel-h2"
          style={{
            color: "var(--color-ink)",
            fontSize: 24,
            lineHeight: 1.2,
            textShadow:
              "3px 3px 0 rgba(255,255,255,0.7), 6px 6px 0 rgba(0,0,0,0.3)",
          }}
        >
          {companyName}
        </h2>

        <div className="flex-1 grid place-items-center">
          {/* Pixel bottle */}
          <div
            className="relative"
            style={{ width: 70, height: 140, imageRendering: "pixelated" }}
          >
            <div
              className="absolute"
              style={{
                background: "var(--color-ink)",
                top: 0,
                left: 25,
                width: 20,
                height: 18,
              }}
            />
            <div
              className="absolute"
              style={{
                background: brand,
                top: 12,
                left: 20,
                width: 30,
                height: 8,
                border: "3px solid var(--color-ink)",
              }}
            />
            <div
              className="absolute"
              style={{
                background: "var(--color-paper)",
                top: 20,
                left: 10,
                width: 50,
                height: 110,
                border: "3px solid var(--color-ink)",
                boxShadow: "inset 4px 4px 0 rgba(255,255,255,0.3), inset -4px -4px 0 rgba(0,0,0,0.4)",
              }}
            />
            <div
              className="absolute pixel-label"
              style={{
                top: 60,
                left: 10,
                width: 50,
                textAlign: "center",
                color: "var(--color-ink)",
                fontSize: 9,
              }}
            >
              {companyName.slice(0, 4)}
            </div>
          </div>
        </div>

        <div
          className="pixel-body italic mt-4"
          style={{
            color: "var(--color-paper)",
            textShadow: "2px 2px 0 rgba(0,0,0,0.6)",
            fontSize: 18,
            lineHeight: 1.15,
          }}
        >
          &ldquo;{tagline}&rdquo;
        </div>

        <div
          className="pixel-label mt-3 flex gap-3"
          style={{ color: "var(--color-ink)", fontSize: 8 }}
        >
          <span>{sodiumMg}mg Na⁺</span>
          <span>·</span>
          <span>{sugarG}g sugar</span>
          <span>·</span>
          <span>{demographic.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
