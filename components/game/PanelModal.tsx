"use client";

import { X } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  accent?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function PanelModal({ title, subtitle, accent, onClose, children }: Props) {
  return (
    <div className="fixed inset-0 z-[150] bg-night-deep/95 backdrop-blur-sm flex items-stretch p-3 screen-enter">
      <div
        className="pixel-panel flex-1 flex flex-col overflow-hidden"
        style={{ borderColor: accent }}
      >
        <div
          className="pixel-titlebar shrink-0"
          style={{ background: accent, color: accent ? "var(--color-ink)" : undefined }}
        >
          <span className="flex items-center gap-2">
            <span>◆ {title}</span>
            {subtitle && (
              <span className="opacity-70">· {subtitle}</span>
            )}
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1 pixel-label"
          >
            EXIT <X className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
