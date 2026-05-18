"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/game/store";

const BRAND_PRESETS = [
  { id: "orange", color: "#ff7a1f", label: "Sun Orange" },
  { id: "red", color: "#e84545", label: "Hot Red" },
  { id: "lime", color: "#a3e635", label: "Lime Acid" },
  { id: "cyan", color: "#4ecdc4", label: "Cyan Splash" },
  { id: "magenta", color: "#ff3a78", label: "Magenta Punch" },
  { id: "amber", color: "#ffb700", label: "Amber Bolt" },
];

const SUGGESTED_NAMES = ["ION+", "STORMADE", "HYDRA9", "ELEKTRA", "VITALIQ"];

export function TitleScreen() {
  const initGame = useGame((s) => s.initGame);
  const hasSave = useGame((s) => s.history.length > 0 || s.phase !== "title");

  const [name, setName] = useState("");
  const [mission, setMission] = useState("");
  const [brand, setBrand] = useState("#ff7a1f");
  const [showSetup, setShowSetup] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  const start = () => {
    initGame({
      companyName: name || SUGGESTED_NAMES[tick % SUGGESTED_NAMES.length],
      mission: mission || "Hydrate. Win. Repeat.",
      brandColor: brand,
    });
  };

  const resume = () => {
    useGame.setState({ phase: "playing" });
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-night-deep flex items-center justify-center">
      <FloatingPixels />

      <div className="relative z-10 max-w-3xl w-full px-6 text-center">
        {!showSetup ? (
          <div className="title-pop">
            <div className="pixel-label text-orange mb-6 blink">
              ◆ PRESS START ◆
            </div>
            <h1
              className="pixel-h1 mb-2 text-paper"
              style={{
                textShadow:
                  "6px 6px 0 var(--color-orange-deep), 12px 12px 0 var(--color-red)",
                fontSize: "min(11vw, 76px)",
                lineHeight: 1.2,
              }}
            >
              SPORTS DRINK
              <br />
              <span style={{ color: "var(--color-orange)" }}>TYCOON</span>
            </h1>

            <p className="pixel-body text-paper-dim mt-8 mb-10 max-w-xl mx-auto leading-snug">
              Run a sports drink company. Make a recipe. Market it to everyone.
              Discover what you built.
            </p>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setShowSetup(true)}
                className="pixel-btn pixel-btn-primary text-base"
                style={{ fontSize: 16, padding: "16px 32px" }}
              >
                ▶ NEW GAME
              </button>
              {hasSave && (
                <button
                  onClick={resume}
                  className="pixel-btn"
                  style={{ fontSize: 12 }}
                >
                  ⏵ CONTINUE
                </button>
              )}
            </div>

            <div className="mt-12 pixel-label text-paper-faint flex items-center justify-center gap-2">
              <span className="pixel-pip" style={{ color: "var(--color-profit)" }} />
              <span>AUTO-SAVES TO YOUR BROWSER</span>
            </div>
            <div className="mt-4 pixel-label text-paper-faint">
              v0.2 · CHEMISTRY FINAL S26 · NAVEEN GUNAWARDANA
            </div>
          </div>
        ) : (
          <div className="screen-enter">
            <div className="pixel-label text-orange mb-4">
              ◆ INCORPORATE YOUR COMPANY ◆
            </div>
            <h2 className="pixel-h2 text-paper mb-8">
              Let&apos;s build a brand.
            </h2>

            <div className="pixel-panel p-6 text-left max-w-xl mx-auto">
              <div className="pixel-titlebar -mx-6 -mt-6 mb-6">
                <span>CORP_REGISTRY.EXE</span>
                <span className="text-paper-faint">[1/3]</span>
              </div>

              <label className="pixel-label text-paper-dim block mb-2">
                Company name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 16))}
                placeholder={SUGGESTED_NAMES[tick % SUGGESTED_NAMES.length]}
                className="pixel-input mb-1"
                maxLength={16}
              />
              <div className="pixel-label text-paper-faint mb-6">
                {name.length}/16 · TRY: {SUGGESTED_NAMES.slice(0, 3).join(", ")}
              </div>

              <label className="pixel-label text-paper-dim block mb-2">
                Mission statement (under 60 chars)
              </label>
              <input
                value={mission}
                onChange={(e) => setMission(e.target.value.slice(0, 60))}
                placeholder="Hydrate. Win. Repeat."
                className="pixel-input mb-6"
                maxLength={60}
              />

              <label className="pixel-label text-paper-dim block mb-3">
                Brand color
              </label>
              <div className="grid grid-cols-6 gap-2 mb-6">
                {BRAND_PRESETS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBrand(b.color)}
                    title={b.label}
                    className="aspect-square pixel-border"
                    style={{
                      background: b.color,
                      borderColor:
                        brand === b.color
                          ? "var(--color-paper)"
                          : "var(--color-ink)",
                      boxShadow:
                        brand === b.color
                          ? `0 0 0 2px ${b.color}, inset 3px 3px 0 0 rgba(255,255,255,0.3), inset -3px -3px 0 0 rgba(0,0,0,0.4)`
                          : "inset 3px 3px 0 0 rgba(255,255,255,0.3), inset -3px -3px 0 0 rgba(0,0,0,0.4)",
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 pixel-divider mt-6"></div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setShowSetup(false)}
                  className="pixel-btn pixel-btn-ghost"
                >
                  ← BACK
                </button>
                <button onClick={start} className="pixel-btn pixel-btn-primary">
                  START Y1·Q1 ▶
                </button>
              </div>
            </div>

            <div className="mt-8 pixel-label text-paper-faint">
              Q1 OPENING CASH: $250,000 · 12 QUARTERS TO PLAY
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FloatingPixels() {
  // Static array of pixel particles drifting upward
  const pixels = Array.from({ length: 40 }, (_, i) => {
    const left = (i * 37) % 100;
    const delay = (i * 0.3) % 8;
    const size = (i % 3) + 2;
    const color = ["#ff7a1f", "#ffb700", "#4ecdc4", "#b07bff"][i % 4];
    return { left, delay, size, color, key: i };
  });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pixels.map((p) => (
        <span
          key={p.key}
          className="absolute"
          style={{
            left: `${p.left}%`,
            bottom: "-20px",
            width: p.size * 2,
            height: p.size * 2,
            background: p.color,
            opacity: 0.7,
            animation: `pixel-drift 12s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pixel-drift {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-110vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
