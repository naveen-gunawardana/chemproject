"use client";

// Pixel-art office worker, drawn as an inline SVG so no image assets needed.
export function WorkerSprite({
  shirt = "#ff7a1f",
  hair = "#1a1530",
  skin = "#f4c8a3",
  size = 32,
}: {
  shirt?: string;
  hair?: string;
  skin?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={(size / 5) * 8}
      viewBox="0 0 5 8"
      style={{ imageRendering: "pixelated", display: "block" }}
    >
      {/* hair */}
      <rect x="1" y="0" width="3" height="1" fill={hair} />
      <rect x="0" y="0" width="1" height="2" fill={hair} />
      <rect x="4" y="0" width="1" height="2" fill={hair} />
      {/* face */}
      <rect x="1" y="1" width="3" height="2" fill={skin} />
      <rect x="1" y="2" width="1" height="1" fill={hair} />
      <rect x="3" y="2" width="1" height="1" fill={hair} />
      {/* shirt */}
      <rect x="0" y="3" width="5" height="3" fill={shirt} />
      <rect x="0" y="3" width="5" height="1" fill="#fff" fillOpacity="0.15" />
      {/* belt */}
      <rect x="0" y="6" width="5" height="1" fill="#1a1530" />
      {/* legs */}
      <rect x="1" y="7" width="1" height="1" fill="#0d0a1a" />
      <rect x="3" y="7" width="1" height="1" fill="#0d0a1a" />
    </svg>
  );
}

// Tiny desk icon to pair with worker
export function DeskSprite({ size = 32, color = "#4a3f6e" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={(size / 6) * 4}
      viewBox="0 0 6 4"
      style={{ imageRendering: "pixelated", display: "block" }}
    >
      <rect x="0" y="0" width="6" height="1" fill={color} />
      <rect x="0" y="0" width="6" height="1" fill="#fff" fillOpacity="0.25" />
      <rect x="0" y="1" width="1" height="3" fill={color} />
      <rect x="5" y="1" width="1" height="3" fill={color} />
      <rect x="2" y="1" width="2" height="1" fill="#1a1a2e" />
    </svg>
  );
}

export function MonitorSprite({ size = 24, glow = "#4ecdc4" }: { size?: number; glow?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 6 6"
      style={{ imageRendering: "pixelated", display: "block" }}
    >
      <rect x="0" y="0" width="6" height="4" fill="#1a1530" />
      <rect x="1" y="1" width="4" height="2" fill={glow} />
      <rect x="2" y="4" width="2" height="1" fill="#4a3f6e" />
      <rect x="1" y="5" width="4" height="1" fill="#4a3f6e" />
    </svg>
  );
}
