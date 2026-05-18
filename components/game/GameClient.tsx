"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/game/store";
import { TitleScreen } from "./TitleScreen";
import { Office } from "./Office";
import { EventModal } from "./EventModal";
import { QuarterEndModal } from "./QuarterEndModal";
import { QuarterTransition } from "./QuarterTransition";
import { GameOver } from "./GameOver";
import { PressConferenceModal } from "./PressConferenceModal";

export function GameClient() {
  const phase = useGame((s) => s.phase);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="h-screen w-screen grid place-items-center bg-night-deep text-paper-faint pixel-label">
        BOOTING…
      </div>
    );
  }

  if (phase === "title") return <TitleScreen />;
  if (phase === "game-over") return <GameOver />;
  if (phase === "quarter-transition") return <QuarterTransition />;
  if (phase === "press-conference") return <PressConferenceModal />;

  return (
    <>
      <Office />
      {phase === "event" && <EventModal />}
      {phase === "quarter-end" && <QuarterEndModal />}
    </>
  );
}
