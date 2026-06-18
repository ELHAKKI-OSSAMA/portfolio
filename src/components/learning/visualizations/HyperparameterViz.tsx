"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const HP_LABELS = {
  en: {
    title: "Hyperparameter Tuning",
    grid: "Grid Search",
    random: "Random Search",
    bayes: "Bayesian Optimisation",
    statMethod: "Method",
    statEvals: "Evaluations",
    statBest: "Best accuracy",
  },
  fr: {
    title: "Réglage des Hyperparamètres",
    grid: "Grille",
    random: "Aléatoire",
    bayes: "Optimisation Bayésienne",
    statMethod: "Méthode",
    statEvals: "Évaluations",
    statBest: "Meilleure précision",
  },
  ar: {
    title: "ضبط المعاملات الفائقة",
    grid: "شبكة",
    random: "عشوائي",
    bayes: "تحسين بايزي",
    statMethod: "الطريقة",
    statEvals: "التقييمات",
    statBest: "أفضل دقة",
  },
} as const;

const W = 520, H = 260;
const MARGIN = { top: 36, right: 20, bottom: 44, left: 56 };

// Grid: C (regularisation) × max_depth
const C_VALS    = [0.01, 0.1, 1, 10, 100];
const DEPTH_VALS = [2, 4, 6, 8];

// Simulated accuracy surface  (rows = depth, cols = C)
const ACC: number[][] = [
  [0.61, 0.66, 0.71, 0.69, 0.67],
  [0.65, 0.73, 0.81, 0.80, 0.76],
  [0.67, 0.76, 0.88, 0.86, 0.79],
  [0.66, 0.74, 0.84, 0.83, 0.78],
];

function accColor(v: number, isDark: boolean, alpha = 0.82): string {
  const t = Math.max(0, Math.min(1, (v - 0.6) / 0.3));
  if (isDark) {
    // Dark mode: dark teal → vibrant green
    const r = 34;
    const g = Math.round(84 + 113 * t);
    const b = Math.round(84 + 10 * t);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  // Light mode: soft slate-blue → vivid green
  const r = Math.round(148 - 126 * t);
  const g = Math.round(163 + 34 * t);
  const b = Math.round(183 - 89 * t);
  return `rgba(${r},${g},${b},${alpha})`;
}

function accTextColor(v: number, isDark: boolean): string {
  const t = Math.max(0, Math.min(1, (v - 0.6) / 0.3));
  if (isDark) return "white";
  // Light mode: slate cells are light (dark text), green cells are darker (white text)
  const lum = 148 - 126 * t; // proxy: r channel drops as luminance drops
  return lum > 110 ? "rgba(0,0,0,0.72)" : "white";
}

// Random search: 10 random (di, ci) samples
const RANDOM_SAMPLES = [
  {di:2,ci:2},{di:0,ci:3},{di:3,ci:1},{di:1,ci:4},{di:2,ci:0},
  {di:0,ci:1},{di:3,ci:3},{di:1,ci:2},{di:2,ci:3},{di:0,ci:4},
];

// Bayesian: greedy sequence homing in on best
const BAYES_SAMPLES = [
  {di:0,ci:0},{di:2,ci:4},{di:1,ci:1},{di:2,ci:2},{di:2,ci:3},
  {di:3,ci:2},{di:1,ci:2},{di:2,ci:2},
];

const CELL_W = (W - MARGIN.left - MARGIN.right) / C_VALS.length;
const CELL_H = (H - MARGIN.top - MARGIN.bottom) / DEPTH_VALS.length;

export default function HyperparameterViz({ accentColor = "#f97316" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(HP_LABELS);
  const [method, setMethod] = useState<"grid"|"random"|"bayes">("grid");
  const [hovCell, setHovCell] = useState<{di:number;ci:number}|null>(null);

  const activeSamples = method === "random" ? RANDOM_SAMPLES : method === "bayes" ? BAYES_SAMPLES : null;

  const best = useMemo(() => {
    if (!activeSamples) return null;
    return activeSamples.reduce((b, s) => ACC[s.di][s.ci] > ACC[b.di][b.ci] ? s : b, activeSamples[0]);
  }, [activeSamples]);

  const evals = method === "grid" ? C_VALS.length * DEPTH_VALS.length : activeSamples?.length ?? 0;
  const bestAcc = method === "grid"
    ? Math.max(...ACC.flat())
    : (best ? ACC[best.di][best.ci] : 0);

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {L.title} — {method === "grid" ? L.grid : method === "random" ? L.random : L.bayes}
        </span>
        <div className="flex gap-1">
          {(["grid","random","bayes"] as const).map(m => (
            <button key={m} onClick={() => setMethod(m)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: method===m ? `${accentColor}22` : "transparent",
                color: method===m ? accentColor : vt.textMuted,
                border: `1px solid ${method===m ? accentColor+"55" : "var(--border)"}`,
              }}>
              {m === "grid" ? L.grid : m === "random" ? L.random : L.bayes}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* heatmap cells */}
        {DEPTH_VALS.map((_, di) =>
          C_VALS.map((_, ci) => {
            const acc = ACC[di][ci];
            const sx = MARGIN.left + ci * CELL_W;
            const sy = MARGIN.top + (DEPTH_VALS.length - 1 - di) * CELL_H;
            const isHov = hovCell?.di === di && hovCell?.ci === ci;
            const isActive = method === "grid" || (activeSamples?.some(s => s.di===di && s.ci===ci) ?? false);
            const isBest = best && best.di===di && best.ci===ci;
            return (
              <g key={`${di}-${ci}`}
                onMouseEnter={() => setHovCell({di,ci})}
                onMouseLeave={() => setHovCell(null)}
                style={{ cursor:"pointer" }}>
                <rect x={sx+1} y={sy+1} width={CELL_W-2} height={CELL_H-2} rx={3}
                  fill={isActive ? accColor(acc, vt.isDark, isHov ? 1 : 0.82) : vt.surface}
                  stroke={isBest ? accentColor : "transparent"} strokeWidth={2.5} />
                {isActive && (
                  <text x={sx+CELL_W/2} y={sy+CELL_H/2+4} textAnchor="middle" fontSize={9} fontWeight="bold"
                    fill={accTextColor(acc, vt.isDark)}>
                    {acc.toFixed(2)}
                  </text>
                )}
                {method !== "grid" && activeSamples && !isActive && (
                  <text x={sx+CELL_W/2} y={sy+CELL_H/2+4} textAnchor="middle" fontSize={8}
                    fill={vt.textFaint}>?</text>
                )}
              </g>
            );
          })
        )}

        {/* Random / Bayesian sample dots */}
        {activeSamples && activeSamples.map((s, k) => {
          const sx = MARGIN.left + s.ci * CELL_W + CELL_W / 2;
          const sy = MARGIN.top + (DEPTH_VALS.length - 1 - s.di) * CELL_H + CELL_H / 2;
          const isBest = best && best.di===s.di && best.ci===s.ci;
          return (
            <motion.g key={k} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay: k * 0.08, type:"spring", stiffness:400 }}>
              <circle cx={sx} cy={sy} r={isBest ? 8 : 5}
                fill={isBest ? `${accentColor}30` : "none"}
                stroke={accentColor} strokeWidth={isBest ? 2.5 : 1.5} />
              {isBest && <text x={sx} y={sy+4} textAnchor="middle" fontSize={8}
                fill={vt.ink(accentColor)} stroke={vt.isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)"}
                strokeWidth={2.5} paintOrder="stroke" fontWeight="bold">★</text>}
            </motion.g>
          );
        })}

        {/* X axis (C) */}
        {C_VALS.map((c, ci) => (
          <text key={ci}
            x={MARGIN.left + ci * CELL_W + CELL_W / 2}
            y={H - MARGIN.bottom + 14}
            textAnchor="middle" fontSize={9} fill={vt.textMuted}>
            {c < 1 ? c : c >= 100 ? "100" : c}
          </text>
        ))}
        <text x={MARGIN.left + (C_VALS.length * CELL_W) / 2} y={H - 4}
          textAnchor="middle" fontSize={9} fill={vt.textMuted}>C (regularisation)</text>

        {/* Y axis (depth) */}
        {DEPTH_VALS.map((d, di) => (
          <text key={di}
            x={MARGIN.left - 8}
            y={MARGIN.top + (DEPTH_VALS.length - 1 - di) * CELL_H + CELL_H / 2 + 4}
            textAnchor="end" fontSize={9} fill={vt.textMuted}>
            {d}
          </text>
        ))}
        <text x={14} y={MARGIN.top + (DEPTH_VALS.length * CELL_H) / 2}
          textAnchor="middle" fontSize={9} fill={vt.textMuted}
          transform={`rotate(-90,14,${MARGIN.top + (DEPTH_VALS.length * CELL_H) / 2})`}>
          max_depth
        </text>

        {/* hover tooltip */}
        {hovCell && (() => {
          const tx = MARGIN.left + hovCell.ci * CELL_W + CELL_W + 4;
          const ty = MARGIN.top + (DEPTH_VALS.length - 1 - hovCell.di) * CELL_H - 2;
          const clampedTx = Math.min(tx, W - 96);
          return (
            <g>
              <rect x={clampedTx} y={ty} width={90} height={32} rx={4} fill={vt.surface} stroke={vt.border} strokeWidth={1} />
              <text x={clampedTx+6} y={ty+13} fontSize={9} fill={vt.text}>
                acc = {ACC[hovCell.di][hovCell.ci].toFixed(3)}
              </text>
              <text x={clampedTx+6} y={ty+26} fontSize={9} fill={vt.textMuted}>
                C={C_VALS[hovCell.ci]}, d={DEPTH_VALS[hovCell.di]}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* stats */}
      <div className="grid grid-cols-3 border-t text-center" style={{ borderColor:"var(--border)" }}>
        {[
          { label:L.statMethod, val: method === "grid" ? L.grid : method === "random" ? L.random : L.bayes, col:accentColor },
          { label:L.statEvals, val:`${evals}`, col:"var(--text-primary)" },
          { label:L.statBest, val:`${(bestAcc*100).toFixed(1)}%`, col:"#22c55e" },
        ].map(({ label, val, col }) => (
          <div key={label} className="py-3">
            <div className="text-xs" style={{ color:vt.textMuted }}>{label}</div>
            <div className="text-sm font-bold font-mono" style={{ color:col }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
