"use client";

import { useState } from "react";
import { useGame } from "@/lib/game/store";
import {
  pressConferenceForYear,
  type PressAnswer,
} from "@/lib/game/data/pressConference";
import { Mic, Check } from "lucide-react";

export function PressConferenceModal() {
  const year = useGame((s) => s.year);
  const yearAnswered = year - 1; // year that just completed
  const conference = pressConferenceForYear(yearAnswered);
  const submitAnswer = useGame((s) => s.submitPressAnswer);
  const complete = useGame((s) => s.completePressConference);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<string, PressAnswer | null>>({});

  if (!conference) {
    // Safety: skip to next quarter
    complete();
    return null;
  }

  const q = conference.questions[step];
  const lastStep = step === conference.questions.length - 1;
  const answeredCount = Object.values(picked).filter(Boolean).length;

  const handlePick = (a: PressAnswer) => {
    setPicked((p) => ({ ...p, [q.id]: a }));
    submitAnswer(q.id, a.id, a.defensibility, a.truthPct, a.socialImpactDelta);
  };

  const advance = () => {
    if (!picked[q.id]) return;
    if (lastStep) {
      complete();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] bg-night-deep overflow-y-auto screen-enter">
      <div className="min-h-full flex items-center justify-center p-4">
      <div
        className="pixel-panel w-full max-w-3xl"
        style={{ borderColor: "#e84545" }}
      >
        <div
          className="pixel-titlebar"
          style={{ background: "#e84545", color: "var(--color-paper)" }}
        >
          <span className="flex items-center gap-2">
            <Mic className="w-4 h-4" strokeWidth={3} />
            PRESS CONFERENCE · YEAR {yearAnswered} REVIEW
          </span>
          <span className="text-paper-faint">
            QUESTION {step + 1} / {conference.questions.length}
          </span>
        </div>

        <div className="p-6">
          {step === 0 && (
            <p
              className="text-paper leading-snug italic mb-5"
              style={{
                fontFamily: "var(--font-screen)",
                fontSize: 20,
              }}
            >
              {conference.intro}
            </p>
          )}

          {/* Question */}
          <div className="pixel-panel-inset p-4 mb-4">
            <div
              className="pixel-label text-cyan mb-2"
              style={{ fontSize: 10 }}
            >
              {q.reporter.toUpperCase()} · {q.outlet}
            </div>
            <p
              className="text-paper leading-snug"
              style={{
                fontFamily: "var(--font-screen)",
                fontSize: 22,
              }}
            >
              &ldquo;{q.question}&rdquo;
            </p>
          </div>

          {/* Answers */}
          <div className="space-y-2 mb-5">
            {q.answers.map((a) => {
              const isPicked = picked[q.id]?.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => handlePick(a)}
                  className="w-full pixel-panel-inset p-4 text-left transition"
                  style={{
                    borderColor: isPicked
                      ? "#facc15"
                      : "var(--color-ink)",
                    background: isPicked
                      ? "var(--color-night-3)"
                      : undefined,
                  }}
                >
                  <p
                    className="text-paper leading-snug"
                    style={{
                      fontFamily: "var(--font-screen)",
                      fontSize: 20,
                    }}
                  >
                    {a.text}
                  </p>
                  {isPicked && (
                    <div className="mt-3 pt-3 border-t-[3px] border-ink space-y-1">
                      <div
                        className="pixel-label"
                        style={{ fontSize: 9 }}
                      >
                        <span className="text-paper-faint">
                          DEFENSIBILITY:{" "}
                        </span>
                        <span
                          style={{
                            color:
                              a.defensibility >= 70
                                ? "var(--color-profit)"
                                : a.defensibility >= 50
                                  ? "var(--color-warn)"
                                  : "var(--color-loss)",
                          }}
                        >
                          {a.defensibility}/100
                        </span>
                        <span className="text-paper-faint mx-2">·</span>
                        <span className="text-paper-faint">TRUTH: </span>
                        <span
                          style={{
                            color:
                              a.truthPct >= 70
                                ? "var(--color-profit)"
                                : a.truthPct >= 40
                                  ? "var(--color-warn)"
                                  : "var(--color-loss)",
                          }}
                        >
                          {a.truthPct}%
                        </span>
                        {a.socialImpactDelta !== 0 && (
                          <>
                            <span className="text-paper-faint mx-2">·</span>
                            <span className="text-paper-faint">
                              SOC. IMPACT:{" "}
                            </span>
                            <span
                              style={{
                                color:
                                  a.socialImpactDelta < 0
                                    ? "var(--color-profit)"
                                    : "var(--color-loss)",
                              }}
                            >
                              {a.socialImpactDelta > 0 ? "+" : ""}
                              {a.socialImpactDelta}
                            </span>
                          </>
                        )}
                        {a.framing && (
                          <>
                            <span className="text-paper-faint mx-2">·</span>
                            <span
                              className="text-paper-faint"
                              style={{ fontStyle: "italic" }}
                            >
                              framing: {a.framing}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {conference.questions.map((_, i) => (
                <span
                  key={i}
                  className="pixel-pip"
                  style={{
                    color:
                      i === step
                        ? "#facc15"
                        : i < step || picked[conference.questions[i].id]
                          ? "var(--color-profit)"
                          : "var(--color-paper-faint)",
                    width: 10,
                    height: 10,
                  }}
                />
              ))}
            </div>
            <button
              onClick={advance}
              disabled={!picked[q.id]}
              className="pixel-btn pixel-btn-primary"
              style={{
                opacity: picked[q.id] ? 1 : 0.5,
                cursor: picked[q.id] ? "pointer" : "not-allowed",
              }}
            >
              {lastStep ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={3} />
                  FINISH CONFERENCE
                </>
              ) : (
                "NEXT QUESTION ▶"
              )}
            </button>
          </div>
        </div>

        {/* Footer caption */}
        <div className="pixel-titlebar" style={{ background: "var(--color-night-deep)" }}>
          <span className="text-paper-faint" style={{ fontSize: 9 }}>
            ARG 🗣 · YOUR ANSWERS ARE GRADED ON THE CLAIM/EVIDENCE/REASONING CHAIN
          </span>
          <span className="text-paper-faint" style={{ fontSize: 9 }}>
            {answeredCount}/{conference.questions.length} ANSWERED
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}
