"use client";

import { useState, useMemo } from "react";
import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const SVM_LABELS = {
  en: {
    title: "SVM — Maximum Margin Classifier",
    linearBtn: "Linear",
    rbfBtn: "RBF kernel",
    classPos: "Class +1",
    classNeg: "Class −1",
    marginLabel: (m: string) => `margin = ${m}`,
    supportVec: "Support vec",
    cDesc: (c: number) => c < 1.5 ? "↔ wide margin" : c < 5 ? "balanced" : "↔ narrow margin",
    gammaDesc: (g: number) => g < 0.4 ? "smooth" : g < 1.2 ? "moderate" : "tight (overfit)",
    cPenalty: "C (penalty)",
    supportVecsLabel: "Support Vecs",
    accuracyLabel: "Accuracy",
  },
  fr: {
    title: "SVM — Classificateur à Marge Maximale",
    linearBtn: "Linéaire",
    rbfBtn: "Noyau RBF",
    classPos: "Classe +1",
    classNeg: "Classe −1",
    marginLabel: (m: string) => `marge = ${m}`,
    supportVec: "Vect. support",
    cDesc: (c: number) => c < 1.5 ? "↔ large marge" : c < 5 ? "équilibré" : "↔ marge étroite",
    gammaDesc: (g: number) => g < 0.4 ? "lisse" : g < 1.2 ? "modéré" : "serré (sur-ajustement)",
    cPenalty: "C (pénalité)",
    supportVecsLabel: "Vect. support",
    accuracyLabel: "Précision",
  },
  ar: {
    title: "SVM — مُصنِّف الهامش الأقصى",
    linearBtn: "خطي",
    rbfBtn: "نواة RBF",
    classPos: "الفئة +1",
    classNeg: "الفئة −1",
    marginLabel: (m: string) => `الهامش = ${m}`,
    supportVec: "متجه دعم",
    cDesc: (c: number) => c < 1.5 ? "↔ هامش واسع" : c < 5 ? "متوازن" : "↔ هامش ضيق",
    gammaDesc: (g: number) => g < 0.4 ? "سلس" : g < 1.2 ? "معتدل" : "ضيق (إفراط)",
    cPenalty: "C (عقوبة)",
    supportVecsLabel: "متجهات دعم",
    accuracyLabel: "دقة",
  },
} as const;

const W = 520, H = 280, PAD = 40;

type Point = { x: number; y: number; label: 1 | -1 };

// ── Linearly separable dataset ────────────────────────────────────────────────
// Class +1 (y > x region), Class -1 (y < x region)
// True optimal boundary: y = x
const LINEAR_PTS: Point[] = [
  { x: 2.0, y: 7.0, label:  1 },  // y−x=5
  { x: 3.0, y: 8.2, label:  1 },  // y−x=5.2
  { x: 2.5, y: 5.8, label:  1 },  // y−x=3.3  ← closest to boundary
  { x: 4.0, y: 9.0, label:  1 },  // y−x=5
  { x: 3.5, y: 6.5, label:  1 },  // y−x=3    ← support vector candidate
  { x: 1.5, y: 8.0, label:  1 },  // y−x=6.5
  { x: 7.0, y: 3.0, label: -1 },  // x−y=4
  { x: 8.0, y: 2.0, label: -1 },  // x−y=6
  { x: 7.5, y: 4.5, label: -1 },  // x−y=3    ← support vector candidate
  { x: 6.0, y: 1.5, label: -1 },  // x−y=4.5
  { x: 8.5, y: 3.5, label: -1 },  // x−y=5
  { x: 6.5, y: 2.5, label: -1 },  // x−y=4
];

// ── Concentric rings dataset (RBF SVM demo) ───────────────────────────────────
const SEED = (i: number) => Math.abs(Math.sin(i * 73.9 + 2.3));

const RBF_PTS: Point[] = [
  ...Array.from({ length: 8 }, (_, i) => {
    const θ = (i / 8) * 2 * Math.PI + 0.4;
    const r = 1.6 + SEED(i) * 0.5;
    return { x: 5 + r * Math.cos(θ), y: 5 + r * Math.sin(θ), label: 1 as const };
  }),
  ...Array.from({ length: 10 }, (_, i) => {
    const θ = (i / 10) * 2 * Math.PI;
    const r = 3.5 + SEED(i + 50) * 0.8;
    return { x: 5 + r * Math.cos(θ), y: 5 + r * Math.sin(θ), label: -1 as const };
  }),
];

// ── Coordinate helpers ────────────────────────────────────────────────────────
const toCX = (x: number) => PAD + (x / 10) * (W - 2 * PAD);
const toCY = (y: number) => H - PAD - (y / 10) * (H - 2 * PAD);

// ── Linear SVM — optimal separating hyperplane ────────────────────────────────
// Boundary: y = x  (unit normal w = [-1,1]/√2, b = 0)
// +1 class: y > x  →  w·x = (-x+y)/√2 > 0  ✓
// -1 class: y < x  →  w·x = (-x+y)/√2 < 0  ✓
// Closest support vectors: (3.5, 6.5) and (7.5, 4.5) both at dist 3/√2 ≈ 2.12
// Max geometric margin = 2 * 2.12 ≈ 4.24

const W_LIN = [-1 / Math.sqrt(2), 1 / Math.sqrt(2)] as const;
const B_LIN = 0;

function computeLinear(C: number) {
  // Hard-margin half-width ≈ 3 (in data-y units when line is y=x)
  // Large C = narrow margin (penalize violations heavily)
  // Small C = wide soft margin (allow violations)
  const halfMargin = Math.min(5.5, 2.0 + 3.0 / Math.max(0.1, C));
  return { halfMargin };
}

// Decision boundary: y = x
const lineY  = (x: number) => x;
// Margin lines: y = x ± halfMargin
const marginY = (x: number, sign: number, hm: number) => x + sign * hm;

// ── RBF kernel ────────────────────────────────────────────────────────────────
function rbf(x1: number, y1: number, x2: number, y2: number, gamma: number) {
  return Math.exp(-gamma * ((x1 - x2) ** 2 + (y1 - y2) ** 2));
}

function kernelDecision(x: number, y: number, pts: Point[], gamma: number): number {
  return pts.reduce((s, pt) => s + pt.label * rbf(x, y, pt.x, pt.y, gamma), 0);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SVMViz({ accentColor = "#f97316" }: { accentColor?: string }) {
  const [C, setC] = useState(1.0);
  const [gamma, setGamma] = useState(0.5);
  const [kernelMode, setKernelMode] = useState<"linear" | "rbf">("linear");
  const vt = useVizTheme();
  const L = useVizLocale(SVM_LABELS);

  // ── Linear helpers ────────────────────────────────────────────────────────
  const { halfMargin } = useMemo(() => computeLinear(C), [C]);

  const geometricMargin = ((halfMargin * 2) / Math.sqrt(2)).toFixed(2);

  function plotLine(fn: (x: number) => number) {
    return Array.from({ length: 40 }, (_, i) => {
      const x = i / 39 * 10;
      const y = Math.max(-0.5, Math.min(10.5, fn(x)));
      return `${i === 0 ? "M" : "L"}${toCX(x).toFixed(1)},${toCY(y).toFixed(1)}`;
    }).join(" ");
  }

  // Support vectors: points with smallest |y - x| (closest to boundary y = x)
  const linearSVs = useMemo(() =>
    LINEAR_PTS.filter(pt => Math.abs(pt.y - pt.x) < halfMargin * 0.72 + 0.5),
    [halfMargin]
  );

  // ── RBF grid ─────────────────────────────────────────────────────────────
  const GRID_COLS = 16, GRID_ROWS = 12;

  const rbfGrid = useMemo(() =>
    Array.from({ length: GRID_ROWS }, (_, ri) =>
      Array.from({ length: GRID_COLS }, (_, ci) => {
        const gx = (ci + 0.5) / GRID_COLS * 10;
        const gy = (ri + 0.5) / GRID_ROWS * 10;
        const score = kernelDecision(gx, gy, RBF_PTS, gamma);
        return { gx, gy, score };
      })
    ), [gamma]
  );

  const rbfSVs = useMemo(() =>
    RBF_PTS.filter(pt => {
      const score = kernelDecision(pt.x, pt.y, RBF_PTS, gamma);
      return Math.abs(score) < 2.5 / Math.max(0.1, C);
    }), [gamma, C]
  );

  // ── Accuracy ──────────────────────────────────────────────────────────────
  const accuracy = useMemo(() => {
    if (kernelMode === "linear") {
      // Boundary y = x: class +1 if y > x, class -1 if y < x
      const correct = LINEAR_PTS.filter(pt =>
        ((pt.y - pt.x) > 0) === (pt.label === 1)
      ).length;
      return correct / LINEAR_PTS.length;
    } else {
      const correct = RBF_PTS.filter(pt => {
        const score = kernelDecision(pt.x, pt.y, RBF_PTS, gamma);
        return score * pt.label > 0;
      }).length;
      return correct / RBF_PTS.length;
    }
  }, [kernelMode, gamma, C]);

  const pts = kernelMode === "linear" ? LINEAR_PTS : RBF_PTS;
  const svCount = kernelMode === "linear" ? linearSVs.length : rbfSVs.length;

  return (
    <div className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {L.title}
        </span>
        <div className="flex gap-2">
          {(["linear", "rbf"] as const).map(k => (
            <button key={k} onClick={() => setKernelMode(k)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: kernelMode === k ? `${accentColor}25` : "var(--bg-card)",
                color: kernelMode === k ? accentColor : "var(--text-muted)",
                border: `1px solid ${kernelMode === k ? accentColor + "50" : "var(--border)"}`,
              }}>
              {k === "linear" ? L.linearBtn : L.rbfBtn}
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
            <text x={toCX(v)} y={H - PAD + 13} textAnchor="middle" fontSize={8} fill={vt.textMuted}>{v}</text>
          </g>
        ))}

        {/* ── LINEAR MODE ────────────────────────────────────────────────────── */}
        {kernelMode === "linear" && (
          <>
            {/* Margin band fill */}
            <motion.path
              d={[
                `M${toCX(0)},${toCY(marginY(0, 1, halfMargin))}`,
                `L${toCX(10)},${toCY(marginY(10, 1, halfMargin))}`,
                `L${toCX(10)},${toCY(marginY(10, -1, halfMargin))}`,
                `L${toCX(0)},${toCY(marginY(0, -1, halfMargin))}`,
                "Z",
              ].join(" ")}
              fill={accentColor} opacity={0.07}
              animate={{ d: [
                `M${toCX(0)},${toCY(marginY(0, 1, halfMargin))}`,
                `L${toCX(10)},${toCY(marginY(10, 1, halfMargin))}`,
                `L${toCX(10)},${toCY(marginY(10, -1, halfMargin))}`,
                `L${toCX(0)},${toCY(marginY(0, -1, halfMargin))}`,
                "Z",
              ].join(" ") }}
              transition={{ duration: 0.3 }}
            />

            {/* Margin boundary lines */}
            <motion.path
              d={plotLine(x => marginY(x, 1, halfMargin))} fill="none"
              stroke={accentColor} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.65}
              animate={{ d: plotLine(x => marginY(x, 1, halfMargin)) }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d={plotLine(x => marginY(x, -1, halfMargin))} fill="none"
              stroke={accentColor} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.65}
              animate={{ d: plotLine(x => marginY(x, -1, halfMargin)) }}
              transition={{ duration: 0.3 }}
            />

            {/* Decision boundary y = x */}
            <path d={plotLine(lineY)} fill="none" stroke={accentColor} strokeWidth={2.5} />

            {/* Margin annotation */}
            <text x={toCX(7.5)} y={toCY(5.5)} fontSize={9} fill={vt.ink(accentColor)} opacity={0.9}
              fontFamily="monospace">
              {L.marginLabel(geometricMargin)}
            </text>

            {/* Margin bracket arrows */}
            <line x1={toCX(6.5)} y1={toCY(marginY(6.5, 0, 0))}
                  x2={toCX(6.5)} y2={toCY(marginY(6.5, 1, halfMargin))}
              stroke={accentColor} strokeWidth={1} opacity={0.5} strokeDasharray="3,2" />
            <line x1={toCX(6.5)} y1={toCY(marginY(6.5, 0, 0))}
                  x2={toCX(6.5)} y2={toCY(marginY(6.5, -1, halfMargin))}
              stroke={accentColor} strokeWidth={1} opacity={0.5} strokeDasharray="3,2" />

            {/* Class region labels */}
            <text x={toCX(1.8)} y={toCY(8.5)} fontSize={9} fill={vt.ink("#6c63ff")} opacity={0.7}
              fontWeight="bold">{L.classPos}</text>
            <text x={toCX(6.5)} y={toCY(1.5)} fontSize={9} fill={vt.ink("#ff6b6b")} opacity={0.7}
              fontWeight="bold">{L.classNeg}</text>
          </>
        )}

        {/* ── RBF MODE ─────────────────────────────────────────────────────── */}
        {kernelMode === "rbf" && rbfGrid.map((row, ri) =>
          row.map(({ gx, gy, score }, ci) => {
            const pw = (W - 2 * PAD) / GRID_COLS;
            const ph = (H - 2 * PAD) / GRID_ROWS;
            if (Math.abs(score) < 0.05) return null;
            return (
              <rect key={`${ri}-${ci}`}
                x={toCX(gx) - pw / 2} y={toCY(gy) - ph / 2}
                width={pw} height={ph}
                fill={score > 0 ? "#6c63ff" : "#ff6b6b"} opacity={0.09}
              />
            );
          })
        )}

        {/* RBF boundary contour */}
        {kernelMode === "rbf" && (() => {
          const cellW = (W - 2 * PAD) / GRID_COLS;
          const cellH = (H - 2 * PAD) / GRID_ROWS;
          const segments: ReactElement[] = [];
          for (let ri = 0; ri < GRID_ROWS - 1; ri++) {
            for (let ci = 0; ci < GRID_COLS - 1; ci++) {
              const s00 = rbfGrid[ri][ci].score;
              const s10 = rbfGrid[ri][ci + 1]?.score ?? 0;
              const s01 = rbfGrid[ri + 1]?.[ci]?.score ?? 0;
              const x0 = toCX((ci + 0.5) / GRID_COLS * 10);
              const y0 = toCY((ri + 0.5) / GRID_ROWS * 10);
              if ((s00 > 0) !== (s10 > 0)) {
                segments.push(
                  <line key={`h-${ri}-${ci}`}
                    x1={x0 + cellW / 2} y1={y0} x2={x0 + cellW / 2} y2={y0 + cellH}
                    stroke={accentColor} strokeWidth={1.5} opacity={0.65} />
                );
              }
              if ((s00 > 0) !== (s01 > 0)) {
                segments.push(
                  <line key={`v-${ri}-${ci}`}
                    x1={x0} y1={y0 + cellH / 2} x2={x0 + cellW} y2={y0 + cellH / 2}
                    stroke={accentColor} strokeWidth={1.5} opacity={0.65} />
                );
              }
            }
          }
          return <>{segments}</>;
        })()}

        {/* Data points */}
        {pts.map((pt, i) => {
          const isSV = kernelMode === "linear"
            ? linearSVs.some(sv => sv === pt)
            : Math.abs(kernelDecision(pt.x, pt.y, RBF_PTS, gamma)) < 2.5 / Math.max(0.1, C);
          const color = pt.label === 1 ? "#6c63ff" : "#ff6b6b";
          return (
            <g key={i}>
              {isSV && (
                <motion.circle cx={toCX(pt.x)} cy={toCY(pt.y)} r={15}
                  fill="none" stroke={color} strokeWidth={2} opacity={0.4}
                  animate={{ r: 15 }} transition={{ duration: 0.3 }} />
              )}
              <motion.circle
                cx={toCX(pt.x)} cy={toCY(pt.y)} r={isSV ? 7 : 5}
                fill={color}
                stroke={vt.isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.85)"}
                strokeWidth={isSV ? 2 : 1.5}
                animate={{ r: isSV ? 7 : 5 }}
                transition={{ duration: 0.3 }}
              />
            </g>
          );
        })}

        {/* Kernel label */}
        {kernelMode === "rbf" && (
          <text x={W - PAD - 4} y={PAD + 14} textAnchor="end" fontSize={9}
            fill={vt.ink(accentColor)} fontFamily="monospace">
            K(x,x&#x27;) = exp(−γ‖x−x&#x27;‖²)
          </text>
        )}

        {/* Legend */}
        <circle cx={PAD + 6} cy={PAD + 12} r={4} fill="#6c63ff" />
        <text x={PAD + 15} y={PAD + 16} fontSize={8.5} fill={vt.textMuted}>{L.classPos}</text>
        <circle cx={PAD + 6} cy={PAD + 26} r={4} fill="#ff6b6b" />
        <text x={PAD + 15} y={PAD + 30} fontSize={8.5} fill={vt.textMuted}>{L.classNeg}</text>
        {kernelMode === "linear" && (
          <>
            <circle cx={PAD + 68} cy={PAD + 12} r={6} fill="none" stroke="#6c63ff" strokeWidth={1.5} opacity={0.6} />
            <text x={PAD + 78} y={PAD + 16} fontSize={8.5} fill={vt.textMuted}>{L.supportVec}</text>
          </>
        )}

        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
      </svg>

      {/* Controls */}
      <div className="px-5 pt-2 pb-3 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs w-24" style={{ color: "var(--text-muted)" }}>
            C = <span className="font-mono font-bold" style={{ color: accentColor }}>{C.toFixed(1)}</span>
          </span>
          <input type="range" min={0.1} max={10} step={0.1} value={C}
            onChange={e => setC(parseFloat(e.target.value))}
            className="flex-1" style={{ accentColor }} />
          <span className="text-xs w-28 text-right" style={{ color: "var(--text-muted)" }}>
            {L.cDesc(C)}
          </span>
        </div>
        {kernelMode === "rbf" && (
          <div className="flex items-center gap-3">
            <span className="text-xs w-24" style={{ color: "var(--text-muted)" }}>
              γ = <span className="font-mono font-bold" style={{ color: accentColor }}>{gamma.toFixed(2)}</span>
            </span>
            <input type="range" min={0.05} max={2.0} step={0.05} value={gamma}
              onChange={e => setGamma(parseFloat(e.target.value))}
              className="flex-1" style={{ accentColor }} />
            <span className="text-xs w-28 text-right" style={{ color: "var(--text-muted)" }}>
              {L.gammaDesc(gamma)}
            </span>
          </div>
        )}
      </div>

      {/* Stats footer */}
      <StatGrid py="py-2.5" items={[
          { label: L.cPenalty, value: C.toFixed(1), color: accentColor },
          { label: L.supportVecsLabel, value: svCount.toString(), color: accentColor },
          { label: L.accuracyLabel, value: `${(accuracy * 100).toFixed(0)}%`,
            color: accuracy > 0.9 ? "#00d4aa" : accuracy > 0.7 ? "#f59e0b" : "#ff6b6b" },
      ]} />
    </div>
  );
}
