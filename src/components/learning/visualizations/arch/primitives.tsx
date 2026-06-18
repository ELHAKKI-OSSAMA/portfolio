"use client";

"use client";

/**
 * ArchDiagram — topic-specific architecture visualizations.
 * NO switcher — each type renders only that topic's architecture.
 * Fully light/dark-mode aware using CSS custom properties.
 */

import { useVizTheme, type VizTheme } from "@/hooks/useVizTheme";

export type ArchType =
  | "linear-regression"
  | "decision-tree"
  | "random-forest"
  | "gradient-boosting"
  | "xgboost"
  | "lightgbm"
  | "catboost"
  | "bagging"
  | "svm"
  | "knn"
  | "svr"
  | "mlp"
  | "cnn"
  | "resnet"
  | "vit"
  | "transformer"
  | "bert"
  | "rnn"
  | "lstm"
  | "gru"
  | "gan"
  | "vae"
  | "evaluation"
  | "bias-variance"
  | "multiclass";

// ── Shared primitives ─────────────────────────────────────────────────────────

// Full viz-theme type (incl. ink()) so arch sub-components stay in sync.
type VT = VizTheme;

const ARROW_DEFS = (id: string, color: string) => (
  <defs>
    <marker id={id} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 Z" fill={color} />
    </marker>
  </defs>
);

function Arrow({
  x1, y1, x2, y2, color, markerId,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; markerId: string;
}) {
  // Shorten the line so arrowhead sits nicely
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ex = x2 - (dx / len) * 7;
  const ey = y2 - (dy / len) * 7;
  return (
    <line x1={x1} y1={y1} x2={ex} y2={ey}
      stroke={color} strokeWidth={1.5}
      markerEnd={`url(#${markerId})`} />
  );
}

function Box({
  x, y, w, h, label, sublabel, bg, textColor, rx = 8, dashed,
}: {
  x: number; y: number; w: number; h: number;
  label: string; sublabel?: string;
  bg: string; textColor: string;
  rx?: number; dashed?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill={bg} stroke={bg}
        strokeWidth={dashed ? 1.5 : 0}
        strokeDasharray={dashed ? "5,3" : undefined}
        opacity={dashed ? 0.7 : 1}
      />
      <text x={x + w / 2} y={y + h / 2 + (sublabel ? -5 : 5)}
        textAnchor="middle" fontSize={10} fontWeight="600" fill={textColor}>
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 9}
          textAnchor="middle" fontSize={8} fill={textColor} opacity={0.75}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

// Compute readable text color for a given background hex
function textOn(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? "#111" : "#fff";
}

// ── Architecture renders ──────────────────────────────────────────────────────

// 1. Linear Regression — feature vector → weighted sum → output

export type { VT };
export { ARROW_DEFS, Arrow, Box, textOn };
