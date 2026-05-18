"use client";

import { useGame } from "@/lib/game/store";
import { competitors } from "@/lib/game/data/competitors";
import { calcRecipeStats } from "@/lib/game/systems/recipe";

interface RealCompanyArchetype {
  name: string;
  profitTier: number; // 0..10
  impactTier: number; // 0..10
  blurb: string;
}

const ARCHETYPES: RealCompanyArchetype[] = [
  {
    name: "Pedialyte 2010s",
    profitTier: 5,
    impactTier: 2,
    blurb: "Niche, medical, broadly positive.",
  },
  {
    name: "BODYARMOR 2015",
    profitTier: 6,
    impactTier: 4,
    blurb: "Premium athlete-positioned. Generally well-rated.",
  },
  {
    name: "Liquid I.V. 2020",
    profitTier: 7,
    impactTier: 5,
    blurb: "DTC + lifestyle marketing. Quietly aggressive.",
  },
  {
    name: "Gatorade 2018",
    profitTier: 9,
    impactTier: 7,
    blurb: "Industry leader. Heavy school + athlete marketing.",
  },
  {
    name: "Prime 2023",
    profitTier: 8,
    impactTier: 9,
    blurb: "Influencer-led, kid-targeted, regulatory scrutiny.",
  },
  {
    name: "Vitamin Water 2008",
    profitTier: 7,
    impactTier: 8,
    blurb: "Wellness branding for sugar water. Sued in 2009.",
  },
];

function findClosestArchetype(
  profit: number,
  impact: number,
): RealCompanyArchetype {
  // Normalize to 0..10 scales
  const pTier = Math.max(0, Math.min(10, profit / 200_000));
  const iTier = Math.max(0, Math.min(10, impact / 30));
  let best = ARCHETYPES[0];
  let bestDist = Infinity;
  for (const a of ARCHETYPES) {
    const d =
      Math.pow(a.profitTier - pTier, 2) + Math.pow(a.impactTier - iTier, 2);
    if (d < bestDist) {
      bestDist = d;
      best = a;
    }
  }
  return best;
}

export function GameOver() {
  const game = useGame();
  const reset = useGame((s) => s.resetGame);
  const stats = calcRecipeStats(game.recipe);
  const profit = game.cash - 250_000;
  const archetype = findClosestArchetype(profit, game.socialImpact);

  const verdictLine = ((): string => {
    if (profit > 1_000_000 && game.socialImpact < 30)
      return "An ethical winner — rare in this industry.";
    if (profit > 1_000_000 && game.socialImpact > 100)
      return "A profitable, harmful brand.";
    if (profit < 0 && game.socialImpact < 30)
      return "Ethical but financially struggling.";
    if (profit < 0) return "A failure on both axes.";
    if (game.socialImpact > 100)
      return "Society pays so your spreadsheet wins.";
    return "A middle-of-the-pack brand.";
  })();

  return (
    <div className="h-screen w-screen overflow-auto bg-night-deep p-6">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12 title-pop">
          <div className="pixel-label text-paper-faint mb-4">
            END OF YEAR 3 · FINAL REPORT
          </div>
          <h1
            className="pixel-h1"
            style={{
              color: "var(--color-orange)",
              textShadow:
                "4px 4px 0 var(--color-orange-deep), 8px 8px 0 var(--color-red)",
            }}
          >
            GAME OVER.
          </h1>
          <p
            className="pixel-body text-paper-dim mt-4 max-w-2xl mx-auto leading-snug"
          >
            You ran <span className="text-paper">{game.companyName}</span> for
            12 quarters. Here&apos;s what you built.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <BigStat
            label="NET PROFIT"
            value={
              profit >= 0
                ? `+$${(profit / 1000).toFixed(0)}K`
                : `-$${(Math.abs(profit) / 1000).toFixed(0)}K`
            }
            color={profit >= 0 ? "var(--color-profit)" : "var(--color-loss)"}
          />
          <BigStat
            label="MARKET SHARE"
            value={`${game.marketSharePct.toFixed(1)}%`}
            color="var(--color-cyan)"
          />
          <BigStat
            label="SOCIAL IMPACT"
            value={`${Math.round(game.socialImpact)}`}
            color="var(--color-loss)"
            sub="LOWER IS BETTER"
          />
        </div>

        <div className="pixel-panel mb-8">
          <div className="pixel-titlebar">
            <span>VERDICT</span>
            <span className="text-paper-faint">SHAREHOLDER LETTER</span>
          </div>
          <div className="p-6 text-paper leading-snug space-y-4" style={{ fontFamily: "var(--font-screen)", fontSize: 22 }}>
            <p>
              <span className="italic">&ldquo;{game.mission}&rdquo;</span> — your
              opening mission statement.
            </p>
            <p className="text-orange">{verdictLine}</p>
            <p>
              Your final position is closest to{" "}
              <span
                className="text-paper"
                style={{ fontFamily: "var(--font-pixel)", fontSize: 14 }}
              >
                {archetype.name}
              </span>{" "}
              — {archetype.blurb}
            </p>
            {game.events.some((e) => e.eventId === "school-deal") && (
              <p className="italic text-paper-faint">
                You accepted at least one school sponsorship. The kids in those
                districts didn&apos;t get to vote on that.
              </p>
            )}
            {stats.sugarG > 25 && (
              <p className="italic text-paper-faint">
                Your final formula contains {stats.sugarG}g sugar per serving.
                That&apos;s {Math.round(stats.sugarG / 4)} teaspoons of sugar in
                a single 500 mL drink.
              </p>
            )}
            {game.brandTrust < 30 && (
              <p className="italic text-paper-faint">
                Brand trust ended at {Math.round(game.brandTrust)}. Consumers
                noticed.
              </p>
            )}
          </div>
        </div>

        <div className="pixel-panel mb-8">
          <div className="pixel-titlebar">
            <span>THE ARGUMENT</span>
            <span className="text-paper-faint">S&S 🌍</span>
          </div>
          <div className="p-6 text-paper space-y-3" style={{ fontFamily: "var(--font-screen)", fontSize: 20 }}>
            <p className="leading-snug">
              Sports drinks companies sell salt water at gross margins of 70%+
              by leveraging chemistry buzzwords most consumers don&apos;t
              understand. The clearest evidence is{" "}
              <em>how easy it was for you</em> to optimize one.
            </p>
            <p className="leading-snug">
              The game was the argument.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={reset}
            className="pixel-btn pixel-btn-primary"
            style={{ fontSize: 14, padding: "16px 32px" }}
          >
            ▶ PLAY AGAIN
          </button>
          <p
            className="mt-6 pixel-label text-paper-faint"
            style={{ fontSize: 10 }}
          >
            TRY: ETHICAL CEO MODE — TARGET LIFESTYLE, AVOID SCHOOLS, KEEP SUGAR
            UNDER 10G. SEE IF YOU CAN STILL TURN A PROFIT.
          </p>
        </div>
      </div>
    </div>
  );
}

function BigStat({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
}) {
  return (
    <div className="pixel-panel">
      <div className="pixel-titlebar">
        <span>{label}</span>
      </div>
      <div className="p-5 text-center">
        <div className="pixel-cash" style={{ color, fontSize: 36 }}>
          {value}
        </div>
        {sub && (
          <div className="pixel-label text-paper-faint mt-2" style={{ fontSize: 9 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
