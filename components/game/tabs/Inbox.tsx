"use client";

import { useState } from "react";
import { useGame } from "@/lib/game/store";
import type { InboxMessage } from "@/lib/game/types";
import { CheckCheck, Mail, MailOpen, AlertOctagon, Newspaper, UserPlus, Lightbulb, Trophy } from "lucide-react";

const SENDER_LABEL: Record<InboxMessage["sender"], string> = {
  news: "NEWS WIRE",
  event: "ALERT",
  employee: "HR",
  tip: "ASSISTANT",
  achievement: "TROPHY",
};

const SENDER_COLOR: Record<InboxMessage["sender"], string> = {
  news: "var(--color-cyan)",
  event: "var(--color-loss)",
  employee: "var(--color-amber)",
  tip: "var(--color-paper-faint)",
  achievement: "var(--color-purple)",
};

const SENDER_ICON: Record<InboxMessage["sender"], typeof Newspaper> = {
  news: Newspaper,
  event: AlertOctagon,
  employee: UserPlus,
  tip: Lightbulb,
  achievement: Trophy,
};

export function InboxTab() {
  const inbox = useGame((s) => s.inbox);
  const markRead = useGame((s) => s.markInboxRead);
  const markAllRead = useGame((s) => s.markAllInboxRead);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sorted = [...inbox].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return b.quarter - a.quarter;
  });
  const active =
    sorted.find((m) => m.id === activeId) ?? sorted[0] ?? null;

  const unread = inbox.filter((m) => !m.read).length;

  return (
    <div className="grid lg:grid-cols-[1fr_1.4fr] gap-3 h-full overflow-hidden">
      {/* Message list */}
      <div className="pixel-panel flex flex-col overflow-hidden">
        <div className="pixel-titlebar">
          <span>INBOX · {inbox.length} MSGS</span>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="pixel-label flex items-center gap-1 hover:text-paper"
            >
              <CheckCheck className="w-3 h-3" /> ALL READ
            </button>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          {sorted.length === 0 ? (
            <div className="p-8 text-center pixel-label text-paper-faint">
              EMPTY · END A QUARTER TO RECEIVE MAIL
            </div>
          ) : (
            <ul>
              {sorted.map((m) => {
                const Icon = SENDER_ICON[m.sender];
                const isActive = active?.id === m.id;
                return (
                  <li
                    key={m.id}
                    onClick={() => {
                      setActiveId(m.id);
                      if (!m.read) markRead(m.id);
                    }}
                    className="cursor-pointer border-b-[3px] border-ink px-3 py-2.5 flex items-start gap-2 transition"
                    style={{
                      background: isActive
                        ? "var(--color-night-3)"
                        : m.read
                          ? undefined
                          : "rgba(255,122,31,0.08)",
                    }}
                  >
                    <Icon
                      className="w-3.5 h-3.5 mt-1 shrink-0"
                      style={{ color: SENDER_COLOR[m.sender] }}
                      strokeWidth={2.5}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className="pixel-label truncate"
                          style={{
                            fontSize: 9,
                            color: SENDER_COLOR[m.sender],
                          }}
                        >
                          {SENDER_LABEL[m.sender]} · Q{m.quarter}
                        </span>
                        {!m.read && (
                          <span
                            className="pixel-pip"
                            style={{ color: "var(--color-orange)" }}
                          />
                        )}
                      </div>
                      <div
                        className="text-paper truncate mt-0.5"
                        style={{
                          fontFamily: "var(--font-screen)",
                          fontSize: 16,
                          fontWeight: m.read ? "normal" : "bold",
                        }}
                      >
                        {m.subject}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="pixel-panel flex flex-col overflow-hidden">
        <div className="pixel-titlebar">
          {active ? (
            <>
              <span
                style={{ color: SENDER_COLOR[active.sender] }}
                className="flex items-center gap-2"
              >
                {active.read ? <MailOpen className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                {SENDER_LABEL[active.sender]}
              </span>
              <span className="text-paper-faint">Q{active.quarter}</span>
            </>
          ) : (
            <span>READING_PANE</span>
          )}
        </div>
        <div className="flex-1 overflow-auto p-6">
          {active ? (
            <article>
              <h2
                className="text-orange pixel-h3"
                style={{ fontSize: 16, lineHeight: 1.4 }}
              >
                {active.subject}
              </h2>
              <div className="pixel-divider my-4" />
              <p
                className="text-paper leading-snug whitespace-pre-line"
                style={{ fontFamily: "var(--font-screen)", fontSize: 22 }}
              >
                {active.body}
              </p>
            </article>
          ) : (
            <p className="pixel-label text-paper-faint">SELECT A MESSAGE</p>
          )}
        </div>
      </div>
    </div>
  );
}
