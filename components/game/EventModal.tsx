"use client";

import { useGame } from "@/lib/game/store";
import type { EventEffects } from "@/lib/game/types";
import { AlertOctagon } from "lucide-react";

export function EventModal() {
  const event = useGame((s) => s.pendingEvent);
  const resolveEvent = useGame((s) => s.resolveEvent);
  const brand = useGame((s) => s.brandColor);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 grid place-items-center p-4 screen-enter">
      <div
        className="pixel-panel w-full max-w-2xl"
        style={{ borderColor: brand }}
      >
        <div
          className="pixel-titlebar"
          style={{ background: brand, color: "var(--color-ink)" }}
        >
          <span className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4" strokeWidth={3} />
            INCOMING EVENT
          </span>
          <span>RESPOND.EXE</span>
        </div>
        <div className="p-6 space-y-4">
          <h2 className="pixel-h2 text-orange">{event.title}</h2>
          <p
            className="text-paper leading-snug"
            style={{ fontFamily: "var(--font-screen)", fontSize: 22 }}
          >
            {event.description}
          </p>

          <div className="pixel-divider my-3" />

          {event.choices ? (
            <div className="space-y-2">
              <p className="pixel-label text-paper-dim">CHOOSE YOUR RESPONSE</p>
              {event.choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => resolveEvent(c.id)}
                  className="w-full pixel-panel-inset p-4 text-left hover:bg-night-3 transition"
                >
                  <div className="pixel-label text-paper" style={{ fontSize: 12 }}>
                    {c.label}
                  </div>
                  {c.description && (
                    <div
                      className="text-paper-faint mt-2 leading-snug"
                      style={{ fontFamily: "var(--font-screen)", fontSize: 18 }}
                    >
                      {c.description}
                    </div>
                  )}
                  <EffectsPreview effects={c.effects} />
                </button>
              ))}
            </div>
          ) : (
            <>
              <EffectsPreview effects={event.effects ?? {}} />
              <button
                onClick={() => resolveEvent()}
                className="pixel-btn pixel-btn-primary w-full mt-4"
              >
                ACKNOWLEDGE
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EffectsPreview({ effects }: { effects: EventEffects }) {
  const items: { label: string; value: string; color: string }[] = [];
  if (effects.cash !== undefined) {
    items.push({
      label: "CASH",
      value: `${effects.cash >= 0 ? "+" : ""}$${Math.abs(effects.cash).toLocaleString()}`,
      color: effects.cash >= 0 ? "var(--color-profit)" : "var(--color-loss)",
    });
  }
  if (effects.marketSharePct !== undefined) {
    items.push({
      label: "MARKET",
      value: `${effects.marketSharePct >= 0 ? "+" : ""}${effects.marketSharePct}%`,
      color: effects.marketSharePct >= 0 ? "var(--color-cyan)" : "var(--color-loss)",
    });
  }
  if (effects.brandTrust !== undefined) {
    items.push({
      label: "TRUST",
      value: `${effects.brandTrust >= 0 ? "+" : ""}${effects.brandTrust}`,
      color: effects.brandTrust >= 0 ? "var(--color-profit)" : "var(--color-loss)",
    });
  }
  if (effects.pressSentiment !== undefined) {
    items.push({
      label: "PRESS",
      value: `${effects.pressSentiment >= 0 ? "+" : ""}${effects.pressSentiment}`,
      color: effects.pressSentiment >= 0 ? "var(--color-cyan)" : "var(--color-loss)",
    });
  }
  if (effects.socialImpact !== undefined && effects.socialImpact > 0) {
    items.push({
      label: "SOC. IMPACT",
      value: `+${effects.socialImpact}`,
      color: "var(--color-loss)",
    });
  }
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t-[3px] border-ink">
      {items.map((i) => (
        <div key={i.label} className="flex items-baseline gap-2">
          <span className="pixel-label text-paper-faint" style={{ fontSize: 9 }}>
            {i.label}
          </span>
          <span
            style={{
              color: i.color,
              fontFamily: "var(--font-screen)",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {i.value}
          </span>
        </div>
      ))}
    </div>
  );
}
