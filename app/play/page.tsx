import { GameClient } from "@/components/game/GameClient";

export const metadata = {
  title: "Play — Sports Drink Tycoon",
};

export default function PlayPage() {
  return (
    <div data-game-shell>
      <GameClient />
      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
