"use client";

import { useState, useMemo } from "react";
import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";

const W = 520, H = 280, PAD = 40;

type Point = { x: number; y: number; label: 1 | -1 };

// ── Linearly separable dataset (Linear SVM demo) ─────────────────────────────
const LINEAR_PTS: Point[] = [
  { x: 2.0, y: 7.0, label: 1 },  { x: 3.0, y: 8.2, label: 1 },
  { x: 2.5, y: 5.8, label: 1 },  { x: 4.0, y: 9.0, label: 1 },
  { x: 3.5, y: 6.5, label: 1 },  { x: 1.5, y: 8.0, label: 1 },
  { x: 7.0, y: 3.0, label: -1 }, { x: 8.0, y: 2.0, label: -1 },
  { x: 7.5, y: 4.5, label: -1 }, { x: 6.0, y: 1.5, label: -1 },
  { x: 8.5, y: 3.5, label: -1 }, { x: 6.5, y: 2.5, label: -1 },
];

// ── Concentric rings dataset (RBF SVM demo) ───────────────────────────────────
// Inner ring: class +1, outer ring: class -1
const SEED = (i: number) => Math.sin(i * 73.9 + 2.3) * 0.5 + 0.5;

const RBF_PTS: Point[] = [
  // Inner ring: class +1 (r ≈ 1.5–2.2 from center)
  ...Array.from({ length: 8 }, (_, i) => {
    const θ = (i / 8) * 2 * Math.PI + 0.4;
    const r = 1.6 + SEED(i) * 0.5;
    return { x: 5 + r * Math.cos(θ), y: 5 + r * Math.sin(θ), label: 1 as const };
  }),
  // Outer ring: class -1 (r ≈ 3.4–4.4 from center)
  ...Array.from({ length: 10 }, (_, i) => {
    const θ = (i / 10) * 2 * Math.PI;
    const r = 3.5 + SEED(i + 50) * 0.8;
    return { x: 5 + r * Math.cos(θ), y: 5 + r * Math.sin(θ), label: -1 as const };
  }),
];

// ── Coordinate helpers ────────────────────────────────────────────────────────
const toCX = (x: number) => PAD + (x / 10) * (W - 2 * PAD);
const toCY = (y: number) => H - PAD - (y / 10) * (H - 2 * PAD);

// ── Linear SVM helpers ────────────────────────────────────────────────────────
function computeLinear(C: number) {
  // Fixed direction w = (1,1)/√2, b controls separation line x+y = 10
  const w = [1 / Math.sqrt(2), 1 / Math.sqrt(2)];
  const b = -10 / Math.sqrt(2);
  // Margin widens as C decreases (softer boundary)
  const margin = 2 / (1 + 0.05 / Math.max(0.1, C));
  return { w, b, margin };
}

// ── RBF kernel decision function (kernel density classifier) ─────────────────
function rbf(x1: number, y1: number, x2: number, y2: number, gamma: number) {
  return Math.exp(-gamma * ((x1 - x2) ** 2 + (y1 - y2) ** 2));
}

function kernelDecision(x: number, y: number, pts: Point[], gamma: number, C: number): number {
  // Kernel density: each point votes by label × RBF weight
  // C softens boundary (less certain near it)
  return pts.reduce((s, pt) => s + pt.label * rbf(x, y, pt.x, pt.y, gamma), 0);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SVMViz({ accentColor = "#f97316" }: { accentColor?: string }) {
  const [C, setC] = useState(1.0);
  const [gamma, setGamma] = useState(0.5);
  const [kernelMode, setKernelMode] = useState<"linear" | "rbf">("linear");
  const vt = useVizTheme();

  // ── Linear mode computations ──────────────────────────────────────────────
  const { w, b, margin } = useMemo(() => computeLinear(C), [C]);

  const lineY = (x: number) => (-b - w[0] * x) / w[1];
  const marginY = (x: number, sign: number) => lineY(x) + sign * (margin / 2) / w[1];

  const linearSVs = useMemo(() =>
    LINEAR_PTS.filter(pt => (w[0] * pt.x + w[1] * pt.y + b) * pt.label < 1.2),
    [w, b]
  );

  function plotLine(fn: (x: number) => number) {
    return Array.from({ length: 40 }, (_, i) => {
      const x = i / 39 * 10;
      const y = Math.max(0, Math.min(10, fn(x)));
      return `${i === 0 ? "M" : "L"}${toCX(x).toFixed(1)},${toCY(y).toFixed(1)}`;
    }).join(" ");
  }

  // ── RBF mode: coarse grid decision coloring ───────────────────────────────
  const GRID_COLS = 16, GRID_ROWS = 12;

  const rbfGrid = useMemo(() => {
    return Array.from({ length: GRID_ROWS }, (_, ri) =>
      Array.from({ length: GRID_COLS }, (_, ci) => {
        const gx = (ci + 0.5) / GRID_COLS * 10;
        const gy = (ri + 0.5) / GRID_ROWS * 10;
        const score = kernelDecision(gx, gy, RBF_PTS, gamma, C);
        // Soft threshold: C controls margin softness
        const margin_ = 0.3 / Math.max(0.1, C);
        const label = score > margin_ ? 1 : score < -margin_ ? -1 : 0;
        return { gx, gy, score, label };
      })
    );
  }, [gamma, C]);

  // Support vectors for RBF: points within margin band (|score| < threshold)
  const rbfSVs = useMemo(() => {
    const thresh = 1.0 / Math.max(0.1, C);
    return RBF_PTS.filter(pt => {
      const score = kernelDecision(pt.x, pt.y, RBF_PTS, gamma, C);
      return Math.abs(score - pt.label * (RBF_PTS.reduce((s, p) =>
        s + p.label * rbf(pt.x, pt.y, p.x, p.y, gamma), 0
      ))) < thresh;
    });
  }, [gamma, C]);

  const accuracy = useMemo(() => {
    const pts = kernelMode === "linear" ? LINEAR_PTS : RBF_PTS;
    let correct = 0;
    if (kernelMode === "linear") {
      correct = pts.filter(pt => (w[0] * pt.x + w[1] * pt.y + b) * pt.label > 0).length;
    } else {
      correct = pts.filter(pt => {
        const score = kernelDecision(pt.x, pt.y, RBF_PTS, gamma, C);
        return score * pt.label > 0;
      }).length;
    }
    return correct / pts.length;
  }, [kernelMode, w, b, gamma, C]);

  const svCount = kernelMode === "linear" ? linearSVs.length : rbfSVs.length;
  const pts = kernelMode === "linear" ? LINEAR_PTS : RBF_PTS;

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          SVM — Maximum Margin Classifier
        </span>
        <div className="flex gap-2">
          {(["linear", "rbf"] as const).map(k => (
            <button
              key={k}
              onClick={() => setKernelMode(k)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: kernelMode === k ? `${accentColor}25` : "var(--bg-card)",
                color: kernelMode === k ? accentColor : "var(--text-muted)",
                border: `1px solid ${kernelMode === k ? accentColor + "50" : "var(--border)"}`,
              }}
            >
              {k === "linear" ? "Linear" : "RBF kernel"}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid */}
        {[2, 4, 6, 8].map(v => (
          <g key={v}>
            <line x1={toCX(v)} y1={PAD} x2={toCX(v)} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />
            <line x1={PAD} y1={toCY(v)} x2={W - PAD} y2={toCY(v)} stroke={vt.grid} strokeWidth={1} />
          </g>
        ))}

        {/* ── LINEAR MODE ── */}
        {kernelMode === "linear" && (
          <>
            {/* Margin band fill */}
            <path
              d={[
                `M${toCX(0)},${toCY(Math.min(10, marginY(0, 1)))}`,
                `L${toCX(10)},${toCY(Math.min(10, marginY(10, 1)))}`,
                `L${toCX(10)},${toCY(Math.max(0, marginY(10, -1)))}`,
                `L${toCX(0)},${toCY(Math.max(0, marginY(0, -1)))}`,
                "Z",
              ].join(" ")}
              fill={accentColor} opacity={0.07}
            />
            {/* Margin boundaries */}
            <motion.path d={plotLine(x => marginY(x, 1))} fill="none"
              stroke={accentColor} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.6}
              animate={{ d: plotLine(x => marginY(x, 1)) }} transition={{ duration: 0.3 }} />
            <motion.path d={plotLine(x => marginY(x, -1))} fill="none"
              stroke={accentColor} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.6}
              animate={{ d: plotLine(x => marginY(x, -1)) }} transition={{ duration: 0.3 }} />
            {/* Decision boundary */}
            <path d={plotLine(lineY)} fill="none" stroke={accentColor} strokeWidth={2.5} />
            <text x={toCX(8)} y={toCY(6.5)} fontSize={9} fill={accentColor} opacity={0.85}>
              margin = {margin.toFixed(2)}
            </text>
          </>
        )}

        {/* ── RBF MODE: background grid coloring ── */}
        {kernelMode === "rbf" && rbfGrid.map((row, ri) =>
          row.map(({ gx, gy, label }, ci) => {
            const pw = (W - 2 * PAD) / GRID_COLS;
            const ph = (H - 2 * PAD) / GRID_ROWS;
            const sx = toCX(gx) - pw / 2;
            const sy = toCY(gy) - ph / 2;
            if (label === 0) return null;
            return (
              <rect key={`${ri}-${ci}`}
                x={sx} y={sy} width={pw} height={ph}
                fill={label === 1 ? "#6c63ff" : "#ff6b6b"}
                opacity={0.09}
              />
            );
          })
        )}

        {/* ── RBF decision boundary line (where score ≈ 0) ── */}
        {kernelMode === "rbf" && (() => {
          // Draw boundary at D(x,y) = 0 using marching squares (simplified)
          // Since it's concentric, just draw contour where score changes sign
          const cellW = (W - 2 * PAD) / GRID_COLS;
          const cellH = (H - 2 * PAD) / GRID_ROWS;
          const segments: ReactElement[] = [];

          for (let ri = 0; ri < GRID_ROWS - 1; ri++) {
            for (let ci = 0; ci < GRID_COLS - 1; ci++) {
              const s00 = rbfGrid[ri][ci].score;
              const s10 = rbfGrid[ri][ci + 1].score;
              const s01 = rbfGrid[ri + 1]?.[ci]?.score ?? 0;

              const x0 = toCX((ci + 0.5) / GRID_COLS * 10);
              const y0 = toCY((ri + 0.5) / GRID_ROWS * 10);

              if ((s00 > 0) !== (s10 > 0)) {
                segments.push(
                  <line key={`h-${ri}-${ci}`}
                    x1={x0 + cellW / 2} y1={y0} x2={x0 + cellW / 2} y2={y0 + cellH}
                    stroke={accentColor} strokeWidth={1.5} opacity={0.6}
                  />
                );
              }
              if ((s00 > 0) !== (s01 > 0)) {
                segments.push(
                  <line key={`v-${ri}-${ci}`}
                    x1={x0} y1={y0 + cellH / 2} x2={x0 + cellW} y2={y0 + cellH / 2}
                    stroke={accentColor} strokeWidth={1.5} opacity={0.6}
                  />
                );
              }
            }
          }
          return <>{segments}</>;
        })()}

        {/* ── Data points ── */}
        {pts.map((pt, i) => {
          const isSV = kernelMode === "linear"
            ? linearSVs.includes(pt)
            : Math.abs(kernelDecision(pt.x, pt.y, RBF_PTS, gamma, C)) < 2.5 / Math.max(0.1, C);
          const color = pt.label === 1 ? "#6c63ff" : "#ff6b6b";
          return (
            <g key={i}>
              {isSV && (
                <circle cx={toCX(pt.x)} cy={toCY(pt.y)} r={14}
                  fill="none" stroke={color} strokeWidth={2} opacity={0.45} />
              )}
              <motion.circle
                cx={toCX(pt.x)} cy={toCY(pt.y)}
                r={isSV ? 7 : 5}
                fill={color}
                stroke={vt.isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.85)"}
                strokeWidth={isSV ? 2 : 1.5}
                animate={{ r: isSV ? 7 : 5 }}
                transition={{ duration: 0.3 }}
              />
            </g>
          );
        })}

        {/* ── RBF mode label ── */}
        {kernelMode === "rbf" && (
          <text x={W - PAD - 4} y={PAD + 14} textAnchor="end" fontSize={9} fill={accentColor}>
            K(x,x&#x27;) = exp(−γ‖x−x&#x27;‖²)
          </text>
        )}

        {/* Legend */}
        <circle cx={PAD + 6} cy={PAD + 14} r={4} fill="#6c63ff" />
        <text x={PAD + 14} y={PAD + 18} fontSize={8.5} fill={vt.textMuted}>Class +1</text>
        <circle cx={PAD + 6} cy={PAD + 28} r={4} fill="#ff6b6b" />
        <text x={PAD + 14} y={PAD + 32} fontSize={8.5} fill={vt.textMuted}>Class −1</text>

        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        {[2, 4, 6, 8].map(v => (
          <text key={v} x={toCX(v)} y={H - PAD + 13}
            textAnchor="middle" fontSize={8} fill={vt.textMuted}>{v}</text>
        ))}
      </svg>

      {/* Controls */}
      <div className="px-5 pt-2 pb-3 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs w-20" style={{ color: "var(--text-muted)" }}>
            C = <span className="font-mono font-bold" style={{ color: accentColor }}>{C.toFixed(1)}</span>
          </span>
          <input type="range" min={0.1} max={10} step={0.1} value={C}
            onChange={e => setC(parseFloat(e.target.value))}
            className="flex-1" style={{ accentColor }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {C < 2 ? "wide margin" : C < 6 ? "balanced" : "narrow margin"}
          </span>
        </div>
        {kernelMode === "rbf" && (
          <div className="flex items-center gap-3">
            <span className="text-xs w-20" style={{ color: "var(--text-muted)" }}>
              γ = <span className="font-mono font-bold" style={{ color: accentColor }}>{gamma.toFixed(2)}</span>
            </span>
            <input type="range" min={0.1} max={2.0} step={0.05} value={gamma}
              onChange={e => setGamma(parseFloat(e.target.value))}
              className="flex-1" style={{ accentColor }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {gamma < 0.5 ? "smooth boundary" : gamma < 1.2 ? "moderate" : "tight (overfit risk)"}
            </span>
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "C (penalty)", value: C.toFixed(1), color: accentColor },
          { label: "Support Vecs", value: svCount.toString(), color: accentColor },
          { label: "Accuracy", value: `${(accuracy * 100).toFixed(0)}%`, color: accuracy > 0.9 ? "#00d4aa" : "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="py-2.5">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
            <div className="text-sm font-bold font-mono" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
