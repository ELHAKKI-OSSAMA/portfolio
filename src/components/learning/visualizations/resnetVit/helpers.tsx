"use client";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";

export type VT = ReturnType<typeof useVizTheme>;

// ── Deterministic pseudo-random ───────────────────────────────────────────────
export function seed(i: number, j: number) {
  return (Math.sin(i * 31.7 + j * 17.3 + 5.1) * 0.5 + 0.5);
}

// ── ResNet feature map data ───────────────────────────────────────────────────
export const INPUT_FM: number[][] = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) => seed(r, c))
);
export const AFTER_CONV1: number[][] = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) => Math.max(0, seed(r + 1, c + 2) * 0.8 + 0.1))
);
export const AFTER_CONV2: number[][] = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) => seed(r + 3, c + 5) * 0.85)
);
export const OUTPUT_FM: number[][] = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) =>
    Math.min(1, INPUT_FM[r][c] * 0.4 + AFTER_CONV2[r][c] * 0.6 + 0.05)
  )
);

export function heatColor(v: number, _isDark: boolean) {
  const r = Math.round(50 + v * 180);
  const g = Math.round(20 + v * 100);
  const b = Math.round(220 - v * 140);
  return `rgb(${r},${g},${b})`;
}

// ── ViT data ──────────────────────────────────────────────────────────────────
export const VIT_IMAGE: number[][] = Array.from({ length: 8 }, (_, r) =>
  Array.from({ length: 8 }, (_, c) => {
    const base = (r + c) / 14;
    const spot = Math.exp(-((r - 3) ** 2 + (c - 3) ** 2) / 4) * 0.5;
    return Math.min(1, base + spot);
  })
);

export const PATCH_COLORS = [
  "#6c63ff", "#f97316", "#22c55e", "#06b6d4",
  "#ec4899", "#f59e0b", "#8b5cf6", "#ef4444",
  "#10b981", "#3b82f6", "#d97706", "#7c3aed",
  "#be185d", "#065f46", "#1e3a5f", "#4c1d95",
];

// ── Step labels ───────────────────────────────────────────────────────────────
export const RESNET_STEPS = ["Input FM", "Conv 3×3", "BN + ReLU", "Conv 3×3 + BN", "F(x) + x → ReLU", "Output FM"];
export const VIT_STEPS    = ["Image input", "Extract patches", "Project patches", "Add [CLS] + pos", "Transformer ×L", "MLP head → class"];

// ── Shared layout constants ───────────────────────────────────────────────────
export const BLOCK_W = 72;
export const BLOCK_H = 32;

// ── Block component ───────────────────────────────────────────────────────────
export function Block({ x, y, label, color, active, vt }: {
  x: number; y: number; label: string; color: string; active: boolean; vt: VT;
}) {
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.35 }} transition={{ duration: 0.3 }}>
      <rect x={x} y={y} width={BLOCK_W} height={BLOCK_H} rx={5}
        fill={active ? color + "25" : "transparent"}
        stroke={active ? color : vt.border}
        strokeWidth={active ? 2 : 1}
      />
      <text x={x + BLOCK_W / 2} y={y + BLOCK_H / 2 + 4} textAnchor="middle"
        fontSize={9} fill={active ? color : vt.textMuted} fontWeight={active ? "bold" : "normal"}>
        {label}
      </text>
    </motion.g>
  );
}

// ── Arrow component ───────────────────────────────────────────────────────────
export function Arrow({ x1, y1, x2, y2, color, dashed = false }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len, ny = dy / len;
  const ex = x2 - nx * 6, ey = y2 - ny * 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? "5,4" : undefined} />
      <polygon points={`${x2},${y2} ${ex - ny * 4},${ey + nx * 4} ${ex + ny * 4},${ey - nx * 4}`}
        fill={color} />
    </g>
  );
}

// ── FeatureMap component ──────────────────────────────────────────────────────
export function FeatureMap({ data, x, y, cellSize, vt, highlight = false, highlightColor = "#6c63ff" }: {
  data: number[][]; x: number; y: number; cellSize: number; vt: VT;
  highlight?: boolean; highlightColor?: string;
}) {
  return (
    <g>
      {data.map((row, r) => row.map((v, c) => (
        <rect key={`${r}-${c}`}
          x={x + c * cellSize} y={y + r * cellSize}
          width={cellSize - 1} height={cellSize - 1}
          rx={1} fill={heatColor(v, vt.isDark)} opacity={0.85}
        />
      )))}
      {highlight && (
        <rect x={x - 1} y={y - 1}
          width={data[0].length * cellSize + 1} height={data.length * cellSize + 1}
          rx={3} fill="none" stroke={highlightColor} strokeWidth={2}
        />
      )}
    </g>
  );
}
