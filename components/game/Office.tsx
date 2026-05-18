"use client";

import { useState } from "react";
import { Hud } from "./Hud";
import { MapView } from "./MapView";
import { LabTab } from "./tabs/Lab";
import { AdsTab } from "./tabs/Ads";
import { SalesTab } from "./tabs/Sales";
import { RdTab } from "./tabs/Rd";
import { DashboardTab } from "./tabs/Dashboard";
import { InboxTab } from "./tabs/Inbox";
import { ToastSystem } from "./ToastSystem";
import { PanelModal } from "./PanelModal";
import type { PanelId } from "@/lib/game/types";

const PANEL_META: Record<
  PanelId,
  { title: string; subtitle: string; accent: string; Component: React.FC }
> = {
  lab: {
    title: "RECIPE BENCH",
    subtitle: "Formulation lab",
    accent: "#86efac",
    Component: LabTab,
  },
  rd: {
    title: "RESEARCH",
    subtitle: "Tech tree + sig-figs lab",
    accent: "#ffb700",
    Component: RdTab,
  },
  ads: {
    title: "ADS HQ",
    subtitle: "Marketing campaign builder",
    accent: "#ff7a1f",
    Component: AdsTab,
  },
  sales: {
    title: "SALES DESK",
    subtitle: "Pricing · distribution · revenue streams",
    accent: "#facc15",
    Component: SalesTab,
  },
  compare: {
    title: "MARKET RESEARCH",
    subtitle: "Data analysis — competitor benchmarking + trend identification",
    accent: "#4ecdc4",
    Component: DashboardTab,
  },
  inbox: {
    title: "MAIL ROOM",
    subtitle: "News · alerts · achievements",
    accent: "#b07bff",
    Component: InboxTab,
  },
};

export function Office() {
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null);

  return (
    <div className="h-screen w-screen flex flex-col bg-night-deep overflow-hidden">
      <Hud />

      <main className="flex-1 overflow-hidden">
        <MapView onOpenPanel={setOpenPanel} />
      </main>

      <ToastSystem />

      {openPanel &&
        (() => {
          const meta = PANEL_META[openPanel];
          const Body = meta.Component;
          return (
            <PanelModal
              title={meta.title}
              subtitle={meta.subtitle}
              accent={meta.accent}
              onClose={() => setOpenPanel(null)}
            >
              <Body />
            </PanelModal>
          );
        })()}
    </div>
  );
}
