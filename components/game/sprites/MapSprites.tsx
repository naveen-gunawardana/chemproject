"use client";

import type { PanelId } from "@/lib/game/types";

const INK = "#0a0612";
const PAPER = "#f4e9d2";
const WINDOW = "#5fa8ff";
const WINDOW_LIT = "#ffeb6e";
const TILE = 48;

function size(w: number, h: number): { W: number; H: number } {
  return { W: w * TILE, H: h * TILE };
}

// === FUNCTIONAL BUILDINGS — each genuinely unique ===

export function RecipeBenchSprite({ w, h }: { w: number; h: number }) {
  const { W, H } = size(w, h);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      shapeRendering="crispEdges"
      style={{ display: "block", overflow: "visible" }}
    >
      <rect x={0} y={H - 4} width={W} height={4} fill="#000" opacity={0.3} />

      {/* Walls (cream brick) */}
      <rect
        x={4}
        y={H * 0.4}
        width={W - 8}
        height={H * 0.6 - 6}
        fill={PAPER}
        stroke={INK}
        strokeWidth={3}
      />
      {/* Brick courses */}
      {[0.5, 0.65, 0.8, 0.92].map((p, i) => (
        <rect
          key={i}
          x={6}
          y={H * p}
          width={W - 12}
          height={1.5}
          fill={INK}
          opacity={0.15}
        />
      ))}

      {/* Foundation accent */}
      <rect
        x={4}
        y={H - 14}
        width={W - 8}
        height={8}
        fill="#3a8a30"
        stroke={INK}
        strokeWidth={3}
      />

      {/* Two big windows with bubbling chemistry */}
      {[12, W - 44].map((wx, idx) => (
        <g key={idx}>
          <rect
            x={wx}
            y={H * 0.5}
            width={32}
            height={32}
            fill={INK}
            stroke={INK}
            strokeWidth={3}
          />
          <rect
            x={wx + 2}
            y={H * 0.5 + 2}
            width={28}
            height={28}
            fill={idx === 0 ? "#facc15" : "#86efac"}
          />
          {/* Beaker silhouette */}
          <polygon
            points={`${wx + 9},${H * 0.5 + 8} ${wx + 23},${H * 0.5 + 8} ${wx + 25},${H * 0.5 + 26} ${wx + 7},${H * 0.5 + 26}`}
            fill={idx === 0 ? "#5fa8ff" : "#ff7a1f"}
            stroke={INK}
            strokeWidth={1}
          />
          {/* Bubbles */}
          <circle cx={wx + 14} cy={H * 0.5 + 14} r={2} fill="#fff" />
          <circle cx={wx + 20} cy={H * 0.5 + 18} r={1.5} fill="#fff" />
          {/* Window cross frame */}
          <rect x={wx + 15} y={H * 0.5} width={2} height={32} fill={INK} />
          <rect x={wx} y={H * 0.5 + 15} width={32} height={2} fill={INK} />
        </g>
      ))}

      {/* Door */}
      <rect
        x={W / 2 - 16}
        y={H - 50}
        width={32}
        height={44}
        fill="#5e4a37"
        stroke={INK}
        strokeWidth={3}
      />
      <rect x={W / 2 - 13} y={H - 47} width={26} height={28} fill="#3a8a30" />
      <rect x={W / 2 - 3} y={H - 25} width={3} height={3} fill="#facc15" />

      {/* Domed roof */}
      <ellipse
        cx={W / 2}
        cy={H * 0.4}
        rx={W / 2 - 4}
        ry={H * 0.18}
        fill="#3a8a30"
        stroke={INK}
        strokeWidth={3}
      />
      <ellipse
        cx={W / 2}
        cy={H * 0.4 - 4}
        rx={W / 2 - 14}
        ry={H * 0.14}
        fill="#4ea832"
      />
      <ellipse
        cx={W / 2 - 8}
        cy={H * 0.4 - 8}
        rx={20}
        ry={8}
        fill="#86efac"
        opacity={0.6}
      />

      {/* Smokestack vent */}
      <rect
        x={W / 2 - 6}
        y={4}
        width={12}
        height={20}
        fill="#5e4a37"
        stroke={INK}
        strokeWidth={2}
      />
      <rect x={W / 2 - 8} y={2} width={16} height={6} fill="#3a3354" stroke={INK} strokeWidth={2} />
      {/* Steam puffs (CSS animated via animateTransform if desired) */}
      <ellipse cx={W / 2 - 8} cy={-2} rx={6} ry={4} fill="#fff" opacity={0.7} />
      <ellipse cx={W / 2 + 6} cy={-6} rx={8} ry={5} fill="#fff" opacity={0.5} />
      <ellipse cx={W / 2 - 4} cy={-12} rx={10} ry={6} fill="#fff" opacity={0.3} />

      {/* Hanging sign on door */}
      <rect x={W / 2 - 26} y={H - 60} width={52} height={14} fill="#5e4a37" stroke={INK} strokeWidth={2} />
      <rect x={W / 2 - 24} y={H - 58} width={48} height={10} fill={INK} />
      <text
        x={W / 2}
        y={H - 49}
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--font-silkscreen)"
        fill="#86efac"
        fontWeight="bold"
      >
        LAB
      </text>
    </svg>
  );
}

export function ResearchTowerSprite({ w, h }: { w: number; h: number }) {
  const { W, H } = size(w, h);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      shapeRendering="crispEdges"
      style={{ display: "block", overflow: "visible" }}
    >
      <rect x={0} y={H - 4} width={W} height={4} fill="#000" opacity={0.3} />

      {/* Tower base (3 stacked levels) */}
      <rect x={6} y={H - 56} width={W - 12} height={50} fill="#c4b29c" stroke={INK} strokeWidth={3} />
      <rect x={12} y={H - 100} width={W - 24} height={44} fill="#d4c19c" stroke={INK} strokeWidth={3} />
      <rect x={18} y={H - 140} width={W - 36} height={40} fill="#e4d1ac" stroke={INK} strokeWidth={3} />

      {/* Windows on each level */}
      {[0, 1, 2].map((lvl) => {
        const yBase = H - 140 + lvl * 44;
        const pad = 18 - lvl * 6;
        const windowsCount = 3;
        const usable = W - 36 + lvl * 12 - 8;
        return Array.from({ length: windowsCount }).map((_, i) => (
          <g key={`${lvl}-${i}`}>
            <rect
              x={pad + 4 + (i * usable) / windowsCount + usable / windowsCount / 2 - 7}
              y={yBase + 8}
              width={14}
              height={16}
              fill="#ffb700"
              stroke={INK}
              strokeWidth={2}
            />
            <rect
              x={pad + 4 + (i * usable) / windowsCount + usable / windowsCount / 2 - 1}
              y={yBase + 8}
              width={2}
              height={16}
              fill={INK}
            />
          </g>
        ));
      })}

      {/* Door */}
      <rect x={W / 2 - 14} y={H - 36} width={28} height={30} fill={INK} stroke={INK} strokeWidth={3} />
      <rect x={W / 2 - 11} y={H - 33} width={22} height={20} fill="#ffb700" />

      {/* Roof platform */}
      <rect x={20} y={H - 148} width={W - 40} height={8} fill="#3a3354" stroke={INK} strokeWidth={3} />

      {/* Satellite dish */}
      <ellipse cx={W / 2 - 16} cy={H - 158} rx={12} ry={5} fill="#c4b29c" stroke={INK} strokeWidth={2} />
      <rect x={W / 2 - 17} y={H - 162} width={2} height={6} fill={INK} />
      <rect x={W / 2 - 18} y={H - 156} width={3} height={10} fill={INK} />

      {/* Antenna with blinking light */}
      <rect x={W / 2 + 12} y={H - 170} width={3} height={25} fill={INK} />
      <rect x={W / 2 + 18} y={H - 168} width={2} height={20} fill={INK} />
      <circle cx={W / 2 + 13.5} cy={H - 172} r={3} fill="#e84545" className="blink" />

      {/* Sign */}
      <rect x={W / 2 - 22} y={H - 86} width={44} height={12} fill={INK} />
      <text
        x={W / 2}
        y={H - 77}
        textAnchor="middle"
        fontSize="7"
        fontFamily="var(--font-silkscreen)"
        fill="#ffb700"
      >
        R&D
      </text>
    </svg>
  );
}

export function AdsHQSprite({ w, h }: { w: number; h: number }) {
  const { W, H } = size(w, h);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      shapeRendering="crispEdges"
      style={{ display: "block", overflow: "visible" }}
    >
      <rect x={0} y={H - 4} width={W} height={4} fill="#000" opacity={0.3} />

      {/* Bright orange office walls */}
      <rect x={4} y={H * 0.5} width={W - 8} height={H * 0.5 - 6} fill="#ff7a1f" stroke={INK} strokeWidth={3} />
      <rect x={W - 12} y={H * 0.52} width={6} height={H * 0.46 - 12} fill={INK} opacity={0.25} />

      {/* Vertical stripe accent */}
      <rect x={W / 2 - 2} y={H * 0.5} width={4} height={H * 0.5 - 6} fill="#facc15" />

      {/* Windows (glass front) */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const wx = 10 + col * ((W - 20) / 4);
          const wy = H * 0.55 + row * 22;
          return (
            <rect
              key={`${row}-${col}`}
              x={wx}
              y={wy}
              width={(W - 20) / 4 - 6}
              height={14}
              fill={(row + col) % 2 === 0 ? WINDOW_LIT : WINDOW}
              stroke={INK}
              strokeWidth={2}
            />
          );
        }),
      )}

      {/* Door */}
      <rect x={W / 2 - 14} y={H - 32} width={28} height={26} fill={INK} stroke={INK} strokeWidth={3} />
      <rect x={W / 2 - 11} y={H - 29} width={22} height={18} fill="#facc15" />

      {/* Roof flat */}
      <rect x={0} y={H * 0.5 - 6} width={W} height={6} fill={INK} />

      {/* BIG BILLBOARD on top */}
      <rect x={W / 2 - 50} y={4} width={100} height={H * 0.5 - 24} fill={INK} stroke={INK} strokeWidth={3} />
      <rect x={W / 2 - 47} y={7} width={94} height={H * 0.5 - 30} fill="#ff1744" />
      {/* Stars + STAR text */}
      {[-30, -10, 10, 30].map((dx, i) => (
        <text
          key={i}
          x={W / 2 + dx}
          y={H * 0.5 / 2 - 4}
          textAnchor="middle"
          fontSize="14"
          fill="#facc15"
          stroke={INK}
          strokeWidth={0.5}
        >
          ★
        </text>
      ))}
      <text
        x={W / 2}
        y={H * 0.5 - 18}
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--font-pixel)"
        fill="#fff"
        fontWeight="bold"
      >
        ADS
      </text>
      {/* Billboard support posts */}
      <rect x={W / 2 - 38} y={H * 0.5 - 14} width={4} height={14} fill={INK} />
      <rect x={W / 2 + 34} y={H * 0.5 - 14} width={4} height={14} fill={INK} />

      {/* Marquee lights around billboard (animate via blink class) */}
      {[-45, -30, -15, 0, 15, 30, 45].map((dx, i) => (
        <circle
          key={i}
          cx={W / 2 + dx}
          cy={6}
          r={2}
          fill={i % 2 === 0 ? "#facc15" : "#fff"}
        />
      ))}
    </svg>
  );
}

export function MailRoomSprite({ w, h }: { w: number; h: number }) {
  const { W, H } = size(w, h);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      shapeRendering="crispEdges"
      style={{ display: "block", overflow: "visible" }}
    >
      <rect x={0} y={H - 4} width={W} height={4} fill="#000" opacity={0.3} />

      {/* Cottage walls */}
      <rect x={4} y={H * 0.4} width={W - 8} height={H * 0.6 - 6} fill={PAPER} stroke={INK} strokeWidth={3} />
      {/* Brick pattern */}
      {[0.5, 0.65, 0.8].map((p, i) => (
        <g key={i}>
          <rect x={4} y={H * p} width={W - 8} height={1.5} fill={INK} opacity={0.18} />
        </g>
      ))}

      {/* Two windows */}
      {[10, W - 28].map((wx, idx) => (
        <g key={idx}>
          <rect x={wx} y={H * 0.5} width={18} height={18} fill="#5fa8ff" stroke={INK} strokeWidth={2} />
          <rect x={wx + 8} y={H * 0.5} width={2} height={18} fill={INK} />
        </g>
      ))}

      {/* Door */}
      <rect x={W / 2 - 14} y={H - 36} width={28} height={30} fill="#b07bff" stroke={INK} strokeWidth={3} />
      <rect x={W / 2 - 6} y={H - 18} width={3} height={3} fill="#facc15" />

      {/* Peaked roof (triangle) */}
      <polygon
        points={`0,${H * 0.4} ${W / 2},${H * 0.1} ${W},${H * 0.4}`}
        fill="#b07bff"
        stroke={INK}
        strokeWidth={3}
      />
      <polygon
        points={`8,${H * 0.4} ${W / 2},${H * 0.15} ${W - 8},${H * 0.4}`}
        fill="#9560e8"
      />

      {/* Chimney */}
      <rect x={W * 0.65} y={H * 0.15} width={10} height={20} fill="#5e4a37" stroke={INK} strokeWidth={2} />
      {/* Smoke */}
      <ellipse cx={W * 0.65 + 5} cy={H * 0.1} rx={5} ry={4} fill="#fff" opacity={0.7} />
      <ellipse cx={W * 0.65 + 10} cy={H * 0.05} rx={6} ry={4} fill="#fff" opacity={0.5} />

      {/* Mailbox out front (left side) */}
      <rect x={4} y={H - 30} width={8} height={20} fill="#5e4a37" stroke={INK} strokeWidth={2} />
      <rect x={2} y={H - 38} width={12} height={10} fill="#e84545" stroke={INK} strokeWidth={2} />
      <rect x={11} y={H - 35} width={3} height={4} fill="#facc15" />

      {/* Letters scattered */}
      <rect x={W - 18} y={H - 14} width={6} height={4} fill={PAPER} stroke={INK} strokeWidth={1} />
      <rect x={W - 14} y={H - 12} width={6} height={4} fill={PAPER} stroke={INK} strokeWidth={1} />
    </svg>
  );
}

export function SalesStorefrontSprite({ w, h }: { w: number; h: number }) {
  const { W, H } = size(w, h);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      shapeRendering="crispEdges"
      style={{ display: "block", overflow: "visible" }}
    >
      <rect x={0} y={H - 4} width={W} height={4} fill="#000" opacity={0.3} />

      {/* Storefront walls */}
      <rect x={4} y={H * 0.35} width={W - 8} height={H * 0.65 - 6} fill={PAPER} stroke={INK} strokeWidth={3} />

      {/* Big display window with $ register */}
      <rect x={10} y={H * 0.55} width={W / 2 - 14} height={H * 0.3} fill="#facc15" stroke={INK} strokeWidth={3} />
      {/* Cash register inside */}
      <rect x={20} y={H * 0.7} width={28} height={14} fill={INK} />
      <rect x={22} y={H * 0.72} width={24} height={4} fill="#86efac" />
      <text
        x={W / 4 - 4}
        y={H * 0.65}
        textAnchor="middle"
        fontSize="20"
        fontFamily="var(--font-pixel)"
        fill={INK}
        fontWeight="bold"
      >
        $
      </text>

      {/* Right side: door */}
      <rect x={W / 2 + 8} y={H * 0.55} width={W / 2 - 16} height={H * 0.4} fill="#3a3354" stroke={INK} strokeWidth={3} />
      <rect x={W / 2 + 12} y={H * 0.58} width={W / 2 - 24} height={H * 0.3} fill="#5fa8ff" opacity={0.7} />
      <rect x={W - 24} y={H * 0.75} width={3} height={3} fill="#facc15" />

      {/* Striped awning over both */}
      {Array.from({ length: 12 }).map((_, i) => {
        const stripeW = (W - 12) / 12;
        return (
          <rect
            key={i}
            x={6 + i * stripeW}
            y={H * 0.32}
            width={stripeW}
            height={14}
            fill={i % 2 === 0 ? "#facc15" : INK}
            stroke={INK}
            strokeWidth={1}
          />
        );
      })}
      {/* Awning trim */}
      <polygon
        points={`6,${H * 0.46} ${W - 6},${H * 0.46} ${W - 12},${H * 0.52} 12,${H * 0.52}`}
        fill="#facc15"
        stroke={INK}
        strokeWidth={2}
      />

      {/* Flat roof */}
      <rect x={0} y={H * 0.28} width={W} height={H * 0.07} fill="#3a3354" stroke={INK} strokeWidth={3} />

      {/* Big SALE sign on roof */}
      <rect x={W / 2 - 30} y={H * 0.1} width={60} height={H * 0.18} fill="#e84545" stroke={INK} strokeWidth={3} />
      <text
        x={W / 2}
        y={H * 0.22}
        textAnchor="middle"
        fontSize="14"
        fontFamily="var(--font-pixel)"
        fill="#fff"
        fontWeight="bold"
      >
        SALE
      </text>
      {/* Sign supports */}
      <rect x={W / 2 - 26} y={H * 0.27} width={3} height={H * 0.04} fill={INK} />
      <rect x={W / 2 + 22} y={H * 0.27} width={3} height={H * 0.04} fill={INK} />

      {/* OPEN flag */}
      <rect x={W - 18} y={H * 0.4} width={2} height={20} fill={INK} />
      <polygon points={`${W - 16},${H * 0.4} ${W - 6},${H * 0.42} ${W - 16},${H * 0.46}`} fill="#3a8a30" stroke={INK} strokeWidth={1} />
    </svg>
  );
}

export function DataCenterSprite({ w, h }: { w: number; h: number }) {
  const { W, H } = size(w, h);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      shapeRendering="crispEdges"
      style={{ display: "block", overflow: "visible" }}
    >
      <rect x={0} y={H - 4} width={W} height={4} fill="#000" opacity={0.3} />

      {/* Industrial concrete walls */}
      <rect x={4} y={H * 0.25} width={W - 8} height={H * 0.75 - 6} fill="#8a7d6e" stroke={INK} strokeWidth={3} />

      {/* Concrete texture lines */}
      {[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((p, i) => (
        <rect key={i} x={6} y={H * p} width={W - 12} height={1} fill={INK} opacity={0.12} />
      ))}

      {/* Big server-room window with blinking lights */}
      <rect x={10} y={H * 0.32} width={W - 20} height={H * 0.32} fill={INK} stroke={INK} strokeWidth={3} />
      {/* Server racks visible */}
      {[0, 1, 2, 3].map((rack) => {
        const rx = 16 + rack * ((W - 32) / 4);
        const rw = (W - 32) / 4 - 4;
        return (
          <g key={rack}>
            <rect x={rx} y={H * 0.34} width={rw} height={H * 0.28} fill="#1a1530" stroke="#4a3f6e" strokeWidth={1} />
            {/* LEDs */}
            {[0, 1, 2, 3, 4].map((led) => (
              <rect
                key={led}
                x={rx + 2}
                y={H * 0.36 + led * 8}
                width={rw - 4}
                height={2}
                fill={(rack + led) % 3 === 0 ? "#86efac" : (rack + led) % 3 === 1 ? "#facc15" : "#5fa8ff"}
                opacity={0.9}
              />
            ))}
          </g>
        );
      })}

      {/* Door */}
      <rect x={W / 2 - 14} y={H - 30} width={28} height={24} fill="#4ecdc4" stroke={INK} strokeWidth={3} />
      <rect x={W / 2 - 11} y={H - 27} width={22} height={16} fill="#1d7470" />
      {/* Keypad */}
      <rect x={W / 2 + 8} y={H - 24} width={4} height={6} fill="#facc15" stroke={INK} strokeWidth={1} />

      {/* AC units on right side */}
      <rect x={W - 22} y={H - 60} width={18} height={24} fill="#c4b29c" stroke={INK} strokeWidth={2} />
      <rect x={W - 20} y={H - 58} width={14} height={4} fill={INK} />
      <rect x={W - 20} y={H - 52} width={14} height={4} fill={INK} />
      <rect x={W - 20} y={H - 46} width={14} height={4} fill={INK} />

      {/* Industrial flat roof with antennas */}
      <rect x={0} y={H * 0.18} width={W} height={H * 0.08} fill="#5e4a37" stroke={INK} strokeWidth={3} />
      <rect x={8} y={H * 0.05} width={3} height={H * 0.16} fill={INK} />
      <rect x={W - 12} y={H * 0.02} width={3} height={H * 0.2} fill={INK} />
      <circle cx={9.5} cy={H * 0.04} r={2} fill="#e84545" className="blink" />

      {/* Satellite dish */}
      <ellipse cx={W / 2} cy={H * 0.1} rx={14} ry={5} fill="#c4b29c" stroke={INK} strokeWidth={2} />
      <rect x={W / 2 - 1} y={H * 0.1} width={2} height={H * 0.12} fill={INK} />

      {/* Sign */}
      <rect x={W / 2 - 26} y={H * 0.7} width={52} height={12} fill={INK} />
      <text
        x={W / 2}
        y={H * 0.78}
        textAnchor="middle"
        fontSize="7"
        fontFamily="var(--font-silkscreen)"
        fill="#4ecdc4"
      >
        DATA
      </text>
    </svg>
  );
}

export function StaffOfficeBlockSprite({
  w,
  h,
  workerColors,
}: {
  w: number;
  h: number;
  workerColors: string[];
}) {
  const { W, H } = size(w, h);
  const winRows = 3;
  const winCols = Math.max(5, Math.floor(w * 1.4));
  const padX = 14;
  const padTop = 32;
  const padBottom = 20;
  const cellW = (W - padX * 2) / winCols;
  const cellH = (H - padTop - padBottom) / winRows;
  const winW = Math.floor(cellW * 0.65);
  const winH = Math.floor(cellH * 0.7);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      shapeRendering="crispEdges"
      style={{ display: "block", overflow: "visible" }}
    >
      <rect x={0} y={H - 4} width={W} height={4} fill="#000" opacity={0.3} />

      {/* Building walls (glass-front office) */}
      <rect x={4} y={20} width={W - 8} height={H - 26} fill="#3a3354" stroke={INK} strokeWidth={3} />
      <rect x={W - 12} y={22} width={6} height={H - 30} fill={INK} opacity={0.25} />

      {/* Brick base */}
      <rect x={4} y={H - 14} width={W - 8} height={8} fill="#1a1530" stroke={INK} strokeWidth={3} />

      {/* Roof / top strip */}
      <rect x={0} y={14} width={W} height={6} fill="#1a1530" stroke={INK} strokeWidth={3} />
      <rect x={4} y={6} width={W - 8} height={10} fill="#b07bff" stroke={INK} strokeWidth={3} />

      {/* Sign */}
      <rect x={W / 2 - 50} y={2} width={100} height={14} fill={INK} stroke={INK} strokeWidth={2} />
      <text
        x={W / 2}
        y={12}
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-silkscreen)"
        fill="#b07bff"
        fontWeight="bold"
      >
        STAFF HQ
      </text>

      {/* Window grid with worker silhouettes */}
      {Array.from({ length: winRows }).map((_, r) =>
        Array.from({ length: winCols }).map((_, c) => {
          const idx = r * winCols + c;
          const occupied = idx < workerColors.length;
          const color = workerColors[idx] ?? "#444";
          const x = padX + c * cellW + (cellW - winW) / 2;
          const y = padTop + r * cellH + (cellH - winH) / 2;
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width={winW}
                height={winH}
                fill={occupied ? WINDOW_LIT : "#5fa8ff"}
                stroke={INK}
                strokeWidth={2}
              />
              {occupied && (
                <>
                  <rect x={x + winW / 2 - 4} y={y + 3} width={8} height={5} fill="#f4c8a3" />
                  <rect x={x + winW / 2 - 3} y={y + 4} width={1.5} height={1.5} fill={INK} />
                  <rect x={x + winW / 2 + 1.5} y={y + 4} width={1.5} height={1.5} fill={INK} />
                  <rect x={x + winW / 2 - 5} y={y + 8} width={10} height={winH - 8} fill={color} />
                </>
              )}
              <rect x={x + winW / 2 - 0.5} y={y} width={1} height={winH} fill={INK} />
              <rect x={x} y={y + winH / 2 - 0.5} width={winW} height={1} fill={INK} />
            </g>
          );
        }),
      )}

      {/* Glass door at base */}
      <rect x={W / 2 - 18} y={H - 32} width={36} height={26} fill="#5fa8ff" stroke={INK} strokeWidth={3} opacity={0.8} />
      <rect x={W / 2} y={H - 32} width={1} height={26} fill={INK} />
    </svg>
  );
}

// === BUILD-PLOT SPRITES (empty + under construction + active) ===

export function EmptyPlotSprite({ w, h, color }: { w: number; h: number; color: string }) {
  const { W, H } = size(w, h);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} shapeRendering="crispEdges">
      {/* Dirt plot */}
      <rect
        x={4}
        y={4}
        width={W - 8}
        height={H - 8}
        fill="#7a6248"
        stroke={INK}
        strokeWidth={3}
        strokeDasharray="8 6"
      />
      {/* Dirt patches */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 10 + ((i * 37) % (W - 25));
        const y = 10 + ((i * 53) % (H - 25));
        return (
          <rect key={i} x={x} y={y} width={5} height={3} fill="#5e4a37" />
        );
      })}
      {/* Survey markers (corner stakes) */}
      <rect x={2} y={2} width={4} height={10} fill="#e84545" />
      <rect x={W - 6} y={2} width={4} height={10} fill="#e84545" />
      <rect x={2} y={H - 12} width={4} height={10} fill="#e84545" />
      <rect x={W - 6} y={H - 12} width={4} height={10} fill="#e84545" />
      {/* Construction sign */}
      <rect x={W / 2 - 30} y={H / 2 - 18} width={60} height={28} fill="#facc15" stroke={INK} strokeWidth={3} />
      <rect x={W / 2 - 28} y={H / 2 - 16} width={56} height={24} fill={INK} />
      <text
        x={W / 2}
        y={H / 2 - 4}
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-silkscreen)"
        fill="#facc15"
        fontWeight="bold"
      >
        + BUILD
      </text>
      <text
        x={W / 2}
        y={H / 2 + 5}
        textAnchor="middle"
        fontSize="6"
        fontFamily="var(--font-silkscreen)"
        fill={color}
      >
        PLOT
      </text>
      {/* Sign post */}
      <rect x={W / 2 - 1} y={H / 2 + 10} width={2} height={10} fill="#5e4a37" />
    </svg>
  );
}

export function ConstructionSprite({
  w,
  h,
  quartersLeft,
}: {
  w: number;
  h: number;
  quartersLeft?: number;
}) {
  const { W, H } = size(w, h);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} shapeRendering="crispEdges" style={{ overflow: "visible" }}>
      {/* Foundation */}
      <rect x={4} y={H - 18} width={W - 8} height={14} fill="#7a6248" stroke={INK} strokeWidth={3} />

      {/* Scaffolding posts */}
      {[8, W / 2 - 3, W - 14].map((sx, i) => (
        <rect key={i} x={sx} y={12} width={5} height={H - 28} fill="#9a7a4a" stroke={INK} strokeWidth={2} />
      ))}

      {/* Cross beams */}
      <rect x={6} y={H * 0.4} width={W - 12} height={4} fill="#9a7a4a" stroke={INK} strokeWidth={2} />
      <rect x={6} y={H * 0.65} width={W - 12} height={4} fill="#9a7a4a" stroke={INK} strokeWidth={2} />
      <rect x={6} y={18} width={W - 12} height={4} fill="#9a7a4a" stroke={INK} strokeWidth={2} />

      {/* Top warning tape */}
      <rect x={0} y={4} width={W} height={6} fill="#facc15" />
      <rect x={0} y={4} width={W} height={6} fill="url(#caution)" />
      <defs>
        <pattern id="caution" x="0" y="0" width="12" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill={INK} />
        </pattern>
      </defs>

      {/* Crane arm */}
      <rect x={W - 16} y={-12} width={3} height={36} fill={INK} />
      <rect x={W - 36} y={-12} width={26} height={3} fill={INK} />
      <rect x={W - 36} y={-9} width={3} height={12} fill="#facc15" />
      {/* Cable + hook */}
      <rect x={W - 36} y={3} width={1} height={20} fill={INK} />
      <rect x={W - 39} y={23} width={6} height={5} fill="#5e4a37" stroke={INK} strokeWidth={1} />

      {/* Construction worker on site */}
      <rect x={W / 2 - 4} y={H - 28} width={8} height={6} fill="#f4c8a3" />
      <rect x={W / 2 - 5} y={H - 32} width={10} height={4} fill="#facc15" stroke={INK} strokeWidth={1} />
      <rect x={W / 2 - 5} y={H - 22} width={10} height={10} fill="#5fa8ff" />

      {/* Quarters-left badge */}
      {quartersLeft !== undefined && (
        <g>
          <rect x={W / 2 - 22} y={H - 50} width={44} height={16} fill={INK} stroke="#facc15" strokeWidth={2} />
          <text
            x={W / 2}
            y={H - 39}
            textAnchor="middle"
            fontSize="9"
            fontFamily="var(--font-silkscreen)"
            fill="#facc15"
            fontWeight="bold"
          >
            {quartersLeft}Q LEFT
          </text>
        </g>
      )}
    </svg>
  );
}

// Skyscraper sprite — grows visibly with tier. Tiers 1-3 = short building.
// Tiers 4-6 = mid-rise. Tiers 7-9 = skyscraper. Tier 10 = mega-tower with glow.
interface FloorBuildingProps {
  w: number;
  h: number;
  floorColor: string;
  iconChar: string;
  tier: number;
  variant: number; // 0|1|2 sub-variant
}

const FLOOR_PIXEL_HEIGHT = 24;

export function getBuildingExtraHeight(tier: number): number {
  const extraFloors = Math.max(0, tier - 3);
  const setback = tier >= 7 ? 20 : 0;
  const spire = tier >= 8 ? 32 : 0;
  return extraFloors * FLOOR_PIXEL_HEIGHT + setback + spire;
}

export function FloorBuildingSprite({
  w,
  h,
  floorColor,
  iconChar,
  tier,
  variant,
}: FloorBuildingProps) {
  const TILE = 48;
  const W = w * TILE;
  const baseH = h * TILE;
  const extraFloors = Math.max(0, tier - 3);
  const extraH = extraFloors * FLOOR_PIXEL_HEIGHT;
  const setback = tier >= 7 ? 20 : 0;
  const spire = tier >= 8 ? 32 : 0;
  const totalH = baseH + extraH + setback + spire;

  // Y coordinates within the SVG
  const spireY = 0;
  const setbackY = spireY + spire;
  const setbackH = setback;
  const towerTop = setbackY + setbackH;
  const towerH = totalH - towerTop;
  const groundFloorY = totalH - 60;
  const isSkyscraper = tier >= 7;
  const isMegaTower = tier >= 9;

  // Tower x bounds with setback
  const towerX = 4;
  const towerW = W - 8;
  const setbackX = W / 4;
  const setbackInnerW = W / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${totalH}`}
      width={W}
      height={totalH}
      shapeRendering="crispEdges"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Foundation shadow */}
      <rect x={0} y={totalH - 4} width={W} height={4} fill="#000" opacity={0.35} />

      {/* Tower walls */}
      <rect
        x={towerX}
        y={towerTop}
        width={towerW}
        height={towerH - 6}
        fill={isMegaTower ? "#3a3354" : PAPER}
        stroke={INK}
        strokeWidth={3}
      />
      {/* Right wall shading */}
      <rect
        x={W - 10}
        y={towerTop + 2}
        width={4}
        height={towerH - 12}
        fill={INK}
        opacity={isMegaTower ? 0.4 : 0.18}
      />

      {/* Mid-floor windows (only for tiers with extra floors) */}
      {extraFloors > 0 && (() => {
        const windowsPerFloor = Math.max(3, Math.floor((W - 16) / 16));
        return Array.from({ length: extraFloors }).map((_, fIdx) => {
          const fy = groundFloorY - (fIdx + 1) * FLOOR_PIXEL_HEIGHT;
          return (
            <g key={fIdx}>
              {Array.from({ length: windowsPerFloor }).map((_, wIdx) => {
                const colW = (W - 20) / windowsPerFloor;
                const wx = 10 + wIdx * colW + (colW - 12) / 2;
                const lit = (fIdx + wIdx + tier) % 3 !== 0;
                return (
                  <g key={wIdx}>
                    <rect
                      x={wx}
                      y={fy + 4}
                      width={12}
                      height={14}
                      fill={lit ? WINDOW_LIT : "#1a1530"}
                      stroke={INK}
                      strokeWidth={1.5}
                    />
                    <rect x={wx + 5.5} y={fy + 4} width={1} height={14} fill={INK} />
                  </g>
                );
              })}
              {/* Floor divider */}
              <rect
                x={towerX}
                y={fy + 22}
                width={towerW}
                height={1}
                fill={INK}
                opacity={0.25}
              />
            </g>
          );
        });
      })()}

      {/* Setback (skyscraper architectural step) */}
      {setback > 0 && (
        <g>
          <rect
            x={setbackX}
            y={setbackY}
            width={setbackInnerW}
            height={setbackH}
            fill={PAPER}
            stroke={INK}
            strokeWidth={3}
          />
          {/* setback windows */}
          {[0, 1, 2].map((i) => {
            const wx = setbackX + 6 + i * ((setbackInnerW - 12) / 3) + 2;
            return (
              <rect
                key={i}
                x={wx}
                y={setbackY + 4}
                width={(setbackInnerW - 12) / 3 - 4}
                height={setbackH - 8}
                fill={WINDOW_LIT}
                stroke={INK}
                strokeWidth={1}
              />
            );
          })}
        </g>
      )}

      {/* Spire / pyramid top */}
      {spire > 0 && (
        <g>
          {/* Pyramid top */}
          <polygon
            points={`${setbackX},${setbackY} ${W / 2},${spireY + 4} ${setbackX + setbackInnerW},${setbackY}`}
            fill={floorColor}
            stroke={INK}
            strokeWidth={3}
          />
          {/* Mast */}
          <rect x={W / 2 - 1} y={spireY - 24} width={2} height={28} fill={INK} />
          {/* Blinking light at top */}
          <circle cx={W / 2} cy={spireY - 24} r={3} fill="#e84545" className="blink" />
          {isMegaTower && (
            <>
              {/* Side mini-spires */}
              <rect x={setbackX + 8} y={setbackY - 12} width={2} height={14} fill={INK} />
              <rect x={setbackX + setbackInnerW - 10} y={setbackY - 12} width={2} height={14} fill={INK} />
              <circle cx={setbackX + 9} cy={setbackY - 14} r={2} fill="#facc15" className="blink" />
              <circle cx={setbackX + setbackInnerW - 9} cy={setbackY - 14} r={2} fill="#facc15" className="blink" />
            </>
          )}
        </g>
      )}

      {/* No-spire roof (tiers without spire): triangle roof */}
      {spire === 0 && setback === 0 && (
        <g>
          <polygon
            points={`0,${towerTop} 14,${towerTop - 10} ${W - 14},${towerTop - 10} ${W},${towerTop}`}
            fill={floorColor}
            stroke={INK}
            strokeWidth={3}
          />
          {/* Variant-specific feature */}
          {variant === 0 && tier >= 2 && (
            // Smokestack
            <g>
              <rect x={W - 22} y={towerTop - 28} width={10} height={20} fill="#5e4a37" stroke={INK} strokeWidth={2} />
              <rect x={W - 24} y={towerTop - 30} width={14} height={4} fill="#3a3354" stroke={INK} strokeWidth={2} />
              <ellipse cx={W - 14} cy={towerTop - 32} rx={6} ry={3} fill="#fff" opacity={0.7} />
            </g>
          )}
          {variant === 1 && tier >= 2 && (
            // Antenna
            <g>
              <rect x={W / 2 - 1} y={towerTop - 24} width={2} height={20} fill={INK} />
              <circle cx={W / 2} cy={towerTop - 24} r={2.5} fill="#e84545" className="blink" />
            </g>
          )}
          {variant === 2 && tier >= 2 && (
            // Solar panels
            <g>
              {[0, 1].map((i) => (
                <rect
                  key={i}
                  x={W * 0.3 + i * (W * 0.2)}
                  y={towerTop - 8}
                  width={W * 0.15}
                  height={6}
                  fill="#1a1530"
                  stroke="#5fa8ff"
                  strokeWidth={1}
                />
              ))}
            </g>
          )}
        </g>
      )}

      {/* Brick band base */}
      <rect
        x={towerX}
        y={totalH - 14}
        width={towerW}
        height={8}
        fill={floorColor}
        stroke={INK}
        strokeWidth={3}
      />

      {/* Ground-floor windows */}
      {[12, W - 32].map((wx, i) => (
        <g key={i}>
          <rect
            x={wx}
            y={groundFloorY + 4}
            width={20}
            height={16}
            fill={WINDOW_LIT}
            stroke={INK}
            strokeWidth={2}
          />
          <rect x={wx + 9} y={groundFloorY + 4} width={2} height={16} fill={INK} />
        </g>
      ))}

      {/* Door */}
      <rect
        x={W / 2 - 14}
        y={totalH - 36}
        width={28}
        height={30}
        fill={INK}
        stroke={INK}
        strokeWidth={3}
      />
      <rect
        x={W / 2 - 11}
        y={totalH - 33}
        width={22}
        height={20}
        fill={floorColor}
        opacity={0.85}
      />

      {/* Sign with icon (above door) */}
      <rect
        x={W / 2 - 18}
        y={groundFloorY - 6}
        width={36}
        height={16}
        fill={INK}
      />
      <text x={W / 2} y={groundFloorY + 5} textAnchor="middle" fontSize="12">
        {iconChar}
      </text>

      {/* Tier badge */}
      <g transform={`translate(4, ${groundFloorY - 20})`}>
        <rect width={28} height={12} fill="#facc15" stroke={INK} strokeWidth={2} />
        <text
          x={14}
          y={9}
          textAnchor="middle"
          fontSize="8"
          fontFamily="var(--font-silkscreen)"
          fontWeight="bold"
          fill={INK}
        >
          T{tier}
        </text>
      </g>

      {/* Mega-tower glow */}
      {isMegaTower && (
        <rect
          x={towerX}
          y={towerTop}
          width={towerW}
          height={towerH - 6}
          fill="none"
          stroke={floorColor}
          strokeWidth={1}
          opacity={0.6}
          className="glow-pulse"
        />
      )}
    </svg>
  );
}

// === DECORATIONS ===

export function TreeSprite({ size = 48 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 48 64"
      width={size}
      height={(size / 48) * 64}
      shapeRendering="crispEdges"
      style={{ display: "block" }}
    >
      <rect x={20} y={42} width={8} height={22} fill="#5e4a37" stroke={INK} strokeWidth={2} />
      <rect x={22} y={44} width={2} height={20} fill={INK} opacity={0.4} />
      <ellipse cx={24} cy={36} rx={22} ry={14} fill="#2d6a25" stroke={INK} strokeWidth={2} />
      <ellipse cx={24} cy={22} rx={20} ry={16} fill="#3a8a30" stroke={INK} strokeWidth={2} />
      <ellipse cx={16} cy={14} rx={7} ry={5} fill="#86efac" opacity={0.7} />
      <circle cx={28} cy={26} r={2} fill="#1a1530" opacity={0.3} />
    </svg>
  );
}

export function BushSprite({ size = 36 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 36 24"
      width={size}
      height={(size / 36) * 24}
      shapeRendering="crispEdges"
      style={{ display: "block" }}
    >
      <ellipse cx={11} cy={16} rx={11} ry={8} fill="#3a8a30" stroke={INK} strokeWidth={2} />
      <ellipse cx={25} cy={16} rx={11} ry={8} fill="#3a8a30" stroke={INK} strokeWidth={2} />
      <ellipse cx={18} cy={10} rx={10} ry={8} fill="#4a9d40" stroke={INK} strokeWidth={2} />
      <ellipse cx={14} cy={7} rx={4} ry={3} fill="#86efac" opacity={0.7} />
      {/* Small flowers */}
      <circle cx={8} cy={14} r={1.5} fill="#ff7a1f" />
      <circle cx={28} cy={15} r={1.5} fill="#ffeb6e" />
    </svg>
  );
}

export function BenchSprite({ size = 48 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 48 32"
      width={size}
      height={(size / 48) * 32}
      shapeRendering="crispEdges"
      style={{ display: "block" }}
    >
      <rect x={6} y={16} width={36} height={6} fill="#9a7a4a" stroke={INK} strokeWidth={2} />
      <rect x={6} y={6} width={36} height={6} fill="#9a7a4a" stroke={INK} strokeWidth={2} />
      <rect x={10} y={22} width={4} height={10} fill="#5e4a37" stroke={INK} strokeWidth={2} />
      <rect x={34} y={22} width={4} height={10} fill="#5e4a37" stroke={INK} strokeWidth={2} />
      <rect x={6} y={11} width={36} height={1} fill={INK} opacity={0.3} />
    </svg>
  );
}

export function FountainSprite({ size = 96 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      style={{ display: "block" }}
    >
      {/* Outer pool */}
      <ellipse cx={48} cy={72} rx={44} ry={18} fill="#4ecdc4" stroke={INK} strokeWidth={3} />
      <ellipse cx={48} cy={70} rx={40} ry={14} fill="#86efac" opacity={0.3} />
      {/* Stone rim */}
      <ellipse cx={48} cy={72} rx={44} ry={18} fill="none" stroke="#9a7d62" strokeWidth={2} />
      {/* Center base */}
      <rect x={38} y={42} width={20} height={28} fill="#c4b29c" stroke={INK} strokeWidth={3} />
      <rect x={40} y={44} width={2} height={24} fill={INK} opacity={0.3} />
      {/* Top bowl */}
      <ellipse cx={48} cy={42} rx={22} ry={6} fill="#c4b29c" stroke={INK} strokeWidth={3} />
      {/* Spout */}
      <rect x={46} y={22} width={4} height={20} fill="#c4b29c" stroke={INK} strokeWidth={2} />
      {/* Water spray */}
      <circle cx={48} cy={20} r={5} fill="#4ecdc4" opacity={0.85} />
      <circle cx={40} cy={28} r={3} fill="#4ecdc4" opacity={0.7} />
      <circle cx={56} cy={28} r={3} fill="#4ecdc4" opacity={0.7} />
      <circle cx={48} cy={36} r={2} fill="#fff" opacity={0.6} />
      {/* Water sparkles */}
      <rect x={42} y={66} width={3} height={1} fill="#fff" opacity={0.8} />
      <rect x={55} y={70} width={3} height={1} fill="#fff" opacity={0.8} />
    </svg>
  );
}

export function LampPostSprite({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 48"
      width={(size / 48) * 16}
      height={size}
      shapeRendering="crispEdges"
      style={{ display: "block" }}
    >
      <rect x={6} y={42} width={4} height={6} fill="#1a1530" />
      <rect x={7} y={10} width={2} height={32} fill="#3a3354" stroke={INK} strokeWidth={1} />
      <rect x={2} y={4} width={12} height={8} fill="#3a3354" stroke={INK} strokeWidth={2} />
      <rect x={4} y={6} width={8} height={4} fill="#facc15" opacity={0.9} />
    </svg>
  );
}

export function MiniWorker({ color = "#ff7a1f" }: { color?: string }) {
  return (
    <svg
      width="16"
      height="26"
      viewBox="0 0 7 12"
      shapeRendering="crispEdges"
      style={{ display: "block" }}
    >
      <rect x={2} y={0} width={3} height={3} fill="#f4c8a3" />
      <rect x={1} y={1} width={1} height={2} fill="#1a1530" />
      <rect x={5} y={1} width={1} height={2} fill="#1a1530" />
      <rect x={2} y={2} width={1} height={1} fill={INK} />
      <rect x={4} y={2} width={1} height={1} fill={INK} />
      <rect x={1} y={3} width={5} height={5} fill={color} />
      <rect x={1} y={3} width={5} height={1} fill="#fff" opacity={0.2} />
      <rect x={1} y={8} width={2} height={4} fill="#1a1530" />
      <rect x={4} y={8} width={2} height={4} fill="#1a1530" />
    </svg>
  );
}
