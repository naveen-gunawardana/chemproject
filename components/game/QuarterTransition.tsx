"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/game/store";

const FLAVOR: Record<number, string> = {
  1: "Day one. The market is yours to learn.",
  2: "Word is spreading. Competitors notice.",
  3: "The first earnings call looms.",
  4: "Year 1 ends. Press is hot.",
  5: "Year 2. The honeymoon is over.",
  6: "Regulators have started reading your label.",
  7: "Mid-tenure. People know the brand now.",
  8: "End of Year 2. Lock in your strategy.",
  9: "Year 3. The decisions are louder.",
  10: "Watchdogs are watching.",
  11: "One quarter from the verdict.",
  12: "Final quarter. The board is watching.",
};

export function QuarterTransition() {
  const game = useGame();
  const begin = useGame((s) => s.beginNextQuarter);
  const q = ((game.quarter - 1) % 4) + 1;
  const flavor = FLAVOR[game.quarter] ?? "Another quarter, another tradeoff.";

  useEffect(() => {
    const id = setTimeout(() => begin(), 1900);
    return () => clearTimeout(id);
  }, [begin]);

  return (
    <div
      className="fixed inset-0 z-[300] bg-night-deep grid place-items-center cursor-pointer"
      onClick={() => begin()}
    >
      <div className="text-center px-6 screen-enter">
        <div
          className="pixel-label text-paper-faint mb-6 blink"
          style={{ fontSize: 11 }}
        >
          ◆ ROLLING TO NEXT QUARTER ◆
        </div>

        <div
          className="pixel-h1"
          style={{
            fontSize: 24,
            color: "var(--color-paper-dim)",
            letterSpacing: "0.1em",
          }}
        >
          YEAR {game.year}
        </div>

        <div
          className="pixel-h1 mt-3"
          style={{
            fontSize: 88,
            color: game.brandColor,
            textShadow: `6px 6px 0 var(--color-orange-deep), 12px 12px 0 var(--color-red)`,
            lineHeight: 1.1,
          }}
        >
          QUARTER {q}
        </div>

        <div
          className="text-paper mt-8 italic"
          style={{ fontFamily: "var(--font-screen)", fontSize: 24 }}
        >
          {flavor}
        </div>

        <div
          className="pixel-label text-paper-faint mt-12"
          style={{ fontSize: 9 }}
        >
          {game.companyName.toUpperCase()} · CLICK TO SKIP
        </div>
      </div>
    </div>
  );
}
