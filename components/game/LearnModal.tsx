"use client";

import { useState } from "react";
import type { Ingredient } from "@/lib/game/types";
import { X, BookOpen, FlaskConical, Atom } from "lucide-react";

type Tab = "role" | "chemistry" | "deep";

export function LearnModal({
  ing,
  onClose,
}: {
  ing: Ingredient;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("role");

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] bg-black/75 grid place-items-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-panel w-full max-w-2xl max-h-[90vh] flex flex-col screen-enter"
        style={{ borderColor: ing.color }}
      >
        <div
          className="pixel-titlebar shrink-0"
          style={{ background: ing.color, color: "var(--color-ink)" }}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" strokeWidth={3} />
            LEARN.EXE · {ing.name.toUpperCase()}
          </span>
          <button onClick={onClose}>
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* Header */}
        <div className="p-5 flex items-center gap-4 border-b-[3px] border-ink">
          <div
            className="w-16 h-16 grid place-items-center pixel-border"
            style={{
              background: ing.color,
              boxShadow:
                "inset 3px 3px 0 0 rgba(255,255,255,0.3), inset -3px -3px 0 0 rgba(0,0,0,0.4)",
            }}
          >
            {ing.symbol ? (
              <span
                className="pixel-h3"
                style={{ fontSize: 18, color: "var(--color-ink)" }}
              >
                {ing.symbol}
                {ing.charge !== undefined && (
                  <sup style={{ fontSize: 10 }}>
                    {ing.charge > 0
                      ? `${ing.charge}+`
                      : `${Math.abs(ing.charge)}−`}
                  </sup>
                )}
              </span>
            ) : (
              <span
                style={{
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-pixel)",
                  fontSize: 22,
                }}
              >
                {ing.name.slice(0, 2)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="pixel-h3 text-orange">{ing.name}</h2>
            <div
              className="pixel-label text-paper-faint mt-1"
              style={{ fontSize: 10 }}
            >
              CATEGORY: {ing.category.toUpperCase()} · MAX{" "}
              {ing.maxAmount} {ing.unit}/SERVING
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-[3px] border-ink shrink-0">
          <TabBtn active={tab === "role"} onClick={() => setTab("role")} icon={<BookOpen className="w-3 h-3" />} label="Role" />
          <TabBtn
            active={tab === "chemistry"}
            onClick={() => setTab("chemistry")}
            icon={<FlaskConical className="w-3 h-3" />}
            label="Chemistry"
            disabled={!ing.chemistry}
          />
          <TabBtn
            active={tab === "deep"}
            onClick={() => setTab("deep")}
            icon={<Atom className="w-3 h-3" />}
            label="Coulombic deep dive"
            disabled={!ing.deepDive}
          />
        </div>

        <div
          className="flex-1 overflow-auto p-6 text-paper space-y-4"
          style={{ fontFamily: "var(--font-screen)", fontSize: 22 }}
        >
          {tab === "role" && (
            <>
              <Section label="ROLE IN THE BODY">{ing.role}</Section>
              {ing.dailyNeed && (
                <Section label="DAILY NEED">
                  {ing.dailyNeed} {ing.unit}/day (NIH adequate intake)
                </Section>
              )}
              <Section label="SOURCE">{ing.source}</Section>
              {ing.dissociation && (
                <Section label="DISSOCIATION">
                  <div
                    className="pixel-panel-inset p-3"
                    style={{ fontSize: 22, color: ing.color }}
                  >
                    {ing.dissociation}
                  </div>
                </Section>
              )}
              {ing.ionicRadiusPm && (
                <Section label="IONIC RADIUS">
                  {ing.ionicRadiusPm} pm · charge {ing.charge ?? "—"}
                </Section>
              )}
            </>
          )}

          {tab === "chemistry" && ing.chemistry && (
            <p className="leading-snug">{ing.chemistry}</p>
          )}

          {tab === "deep" && ing.deepDive && (
            <>
              <div
                className="pixel-label text-paper-faint"
                style={{ fontSize: 10 }}
              >
                ⚛ COULOMBIC INTERACTIONS · EU 🦉
              </div>
              <p className="leading-snug">{ing.deepDive}</p>
              {ing.charge !== undefined && (
                <div className="pixel-panel-inset p-4 mt-4">
                  <div
                    className="pixel-label text-orange mb-2"
                    style={{ fontSize: 10 }}
                  >
                    ◆ COULOMB&apos;S LAW
                  </div>
                  <div
                    className="text-center"
                    style={{ fontSize: 26 }}
                  >
                    F = k · q₁q₂ / r²
                  </div>
                  <div
                    className="pixel-label text-paper-faint mt-3"
                    style={{ fontSize: 10, lineHeight: 1.5 }}
                  >
                    Larger charges → stronger force. Larger distance → weaker
                    force (squared!). This single equation governs every ionic
                    bond + dissolution in the {ing.name} story.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex-1 px-4 py-3 pixel-label flex items-center justify-center gap-2 transition border-r-[3px] border-ink last:border-r-0"
      style={{
        background: active
          ? "var(--color-night-3)"
          : "var(--color-night)",
        color: active
          ? "var(--color-orange)"
          : disabled
            ? "var(--color-paper-faint)"
            : "var(--color-paper-dim)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: 10,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="pixel-label text-paper-faint mb-2"
        style={{ fontSize: 9 }}
      >
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
