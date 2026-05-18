"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { Trophy, AlertTriangle, Sparkles, X } from "lucide-react";

const KIND_COLOR = {
  good: "var(--color-profit)",
  bad: "var(--color-loss)",
  info: "var(--color-cyan)",
} as const;

const KIND_ICON = {
  good: Sparkles,
  bad: AlertTriangle,
  info: Trophy,
} as const;

const AUTO_DISMISS_MS = 6000;

export function ToastSystem() {
  const toasts = useGame((s) => s.toasts);
  const dismiss = useGame((s) => s.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const ids = toasts.map((t) => {
      const ageMs = Date.now() - t.ts;
      const remaining = Math.max(500, AUTO_DISMISS_MS - ageMs);
      return setTimeout(() => dismiss(t.id), remaining);
    });
    return () => ids.forEach(clearTimeout);
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[400] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => {
        const Icon = KIND_ICON[t.kind];
        const color = KIND_COLOR[t.kind];
        return (
          <div
            key={t.id}
            className="pixel-panel pointer-events-auto ticker-pop"
            style={{
              borderColor: color,
              maxWidth: 360,
            }}
          >
            <div
              className="pixel-titlebar"
              style={{ background: color, color: "var(--color-ink)" }}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" strokeWidth={3} />
                {t.title}
              </span>
              <button
                onClick={() => dismiss(t.id)}
                className="pixel-label"
              >
                <X className="w-3 h-3" strokeWidth={3} />
              </button>
            </div>
            <div
              className="p-3 text-paper leading-snug"
              style={{ fontFamily: "var(--font-screen)", fontSize: 18 }}
            >
              {t.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
