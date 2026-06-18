"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, RotateCcw, Play } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const DT_LABELS = {
  en: {
    title: "Decision Tree — 1D Regression",
    statsText: (splits: number, leaves: number, mse: string) =>
      `${splits} splits · ${leaves} leaves · MSE ${mse}`,
    pauseBtn: "⏸ Pause",
    replayBtn: "↺ Replay",
    growBtn: "Grow",
    stepBtn: "Step",
    dtLegend: "DT step fn",
    rootMsg1: "Root: predict mean(y) for all x",
    rootMsg2: "Click Grow or Step to add splits →",
    criterionText: "Split criterion: MSE gain = MSE(parent) − [nₗ/n·MSE(L) + nᵣ/n·MSE(R)]",
    splitsLabel: "Splits",
    leavesLabel: "Leaves",
    mseLabel: "MSE",
    targetLabel: "Target",
  },
  fr: {
    title: "Arbre de Décision — Régression 1D",
    statsText: (splits: number, leaves: number, mse: string) =>
      `${splits} coupures · ${leaves} feuilles · ECM ${mse}`,
    pauseBtn: "⏸ Pause",
    replayBtn: "↺ Rejouer",
    growBtn: "Grandir",
    stepBtn: "Étape",
    dtLegend: "fn. escalier",
    rootMsg1: "Racine : prédire mean(y) pour tout x",
    rootMsg2: "Cliquez Grandir ou Étape pour ajouter des coupures →",
    criterionText: "Critère de coupure : gain ECM = ECM(parent) − [nₗ/n·ECM(G) + nᵣ/n·ECM(D)]",
    splitsLabel: "Coupures",
    leavesLabel: "Feuilles",
    mseLabel: "ECM",
    targetLabel: "Cible",
  },
  ar: {
    title: "شجرة القرار — انحدار أحادي البعد",
    statsText: (splits: number, leaves: number, mse: string) =>
      `${splits} تقسيم · ${leaves} أوراق · MSE ${mse}`,
    pauseBtn: "⏸ إيقاف",
    replayBtn: "↺ إعادة",
    growBtn: "نمو",
    stepBtn: "خطوة",
    dtLegend: "دالة درجية",
    rootMsg1: "الجذر: التنبؤ بـmean(y) لجميع x",
    rootMsg2: "انقر نمو أو خطوة لإضافة تقسيمات →",
    criterionText: "معيار التقسيم: مكسب MSE = MSE(أصل) − [nₗ/n·MSE(ي) + nᵣ/n·MSE(ي)]",
    splitsLabel: "تقسيمات",
    leavesLabel: "أوراق",
    mseLabel: "MSE",
    targetLabel: "الهدف",
  },
} as const;

// ── Dimensions ────────────────────────────────────────────────────────────────
const W = 520, H = 300, PAD = 44;
const X_MIN = -3.3, X_MAX = 3.3;
const Y_MIN = -4.0, Y_MAX = 4.0;

// ── Deterministic seeded RNG ──────────────────────────────────────────────────
const seeded = (i: number, s: number) =>
  Math.abs(Math.sin(i * 37.3 + s * 11.7) * 0.5 + 0.5);

// ── Dataset: 80 pts, x ∈ [-3.1, 3.1], sklearn-style noise ───────────────────
// y1 = π·sin(x) + noise,  y2 = π·cos(x) + noise
// every 5th sample gets an extra ±0.5 kick (mirrors sklearn's y[::5] trick)
const N = 80;
const DATA = Array.from({ length: N }, (_, i) => {
  const x = -3.1 + (i / (N - 1)) * 6.2 + (seeded(i, 0) - 0.5) * 0.06;
  const xc = Math.max(-3.1, Math.min(3.1, x));
  const n1 = (seeded(i, 2) - 0.5) * 0.3 + (i % 5 === 0 ? (seeded(i, 4) - 0.5) * 1.0 : 0);
  const n2 = (seeded(i, 3) - 0.5) * 0.3 + (i % 5 === 0 ? (seeded(i, 5) - 0.5) * 1.0 : 0);
  return { x: xc, y1: Math.PI * Math.sin(xc) + n1, y2: Math.PI * Math.cos(xc) + n2 };
});

// ── SVG coordinate helpers ─────────────────────────────────────────────────────
const toSVGX = (x: number) =>
  PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
const toSVGY = (y: number) =>
  H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD);

// ── Leaf type ─────────────────────────────────────────────────────────────────
interface Leaf {
  xMin: number; xMax: number;
  meanY1: number; meanY2: number;
  pts: typeof DATA;
}

// ── MSE helper ────────────────────────────────────────────────────────────────
function mse(pts: typeof DATA, key: "y1" | "y2"): number {
  if (!pts.length) return 0;
  const mean = pts.reduce((s, p) => s + p[key], 0) / pts.length;
  return pts.reduce((s, p) => s + (p[key] - mean) ** 2, 0) / pts.length;
}

function leafMean(pts: typeof DATA, key: "y1" | "y2"): number {
  if (!pts.length) return 0;
  return pts.reduce((s, p) => s + p[key], 0) / pts.length;
}

// ── Build greedy 1-D regression tree (axis = x only) ─────────────────────────
function buildTree(maxSplits: number) {
  const splits: { x: number; depth: number }[] = [];
  const leafsAtStep: Leaf[][] = [];

  let leaves: Leaf[] = [{
    xMin: X_MIN, xMax: X_MAX,
    meanY1: leafMean(DATA, "y1"),
    meanY2: leafMean(DATA, "y2"),
    pts: [...DATA],
  }];
  leafsAtStep.push(leaves);

  for (let step = 0; step < maxSplits; step++) {
    let bestGain = -Infinity;
    let bestLeafIdx = 0;
    let bestSplitX = 0;

    for (let li = 0; li < leaves.length; li++) {
      const leaf = leaves[li];
      if (leaf.pts.length < 4) continue;
      const sorted = [...leaf.pts].sort((a, b) => a.x - b.x);
      const parentMse = mse(sorted, "y1") + mse(sorted, "y2");

      for (let si = 1; si < sorted.length; si++) {
        if (sorted[si].x === sorted[si - 1].x) continue;
        const sx = (sorted[si - 1].x + sorted[si].x) / 2;
        const left  = sorted.slice(0, si);
        const right = sorted.slice(si);
        const childMse =
          (left.length  * (mse(left, "y1")  + mse(left, "y2")) +
           right.length * (mse(right, "y1") + mse(right, "y2"))) / sorted.length;
        const gain = parentMse - childMse;
        if (gain > bestGain) { bestGain = gain; bestLeafIdx = li; bestSplitX = sx; }
      }
    }
    if (bestGain <= 0) break;

    const leaf = leaves[bestLeafIdx];
    const leftPts  = leaf.pts.filter(p => p.x <= bestSplitX);
    const rightPts = leaf.pts.filter(p => p.x >  bestSplitX);
    const newLeaves: Leaf[] = [
      ...leaves.slice(0, bestLeafIdx),
      { xMin: leaf.xMin, xMax: bestSplitX, meanY1: leafMean(leftPts, "y1"),  meanY2: leafMean(leftPts, "y2"),  pts: leftPts  },
      { xMin: bestSplitX, xMax: leaf.xMax, meanY1: leafMean(rightPts, "y1"), meanY2: leafMean(rightPts, "y2"), pts: rightPts },
      ...leaves.slice(bestLeafIdx + 1),
    ];
    leaves = newLeaves;
    splits.push({ x: bestSplitX, depth: step });
    leafsAtStep.push([...leaves]);
  }
  return { splits, leafsAtStep };
}

const { splits: ALL_SPLITS, leafsAtStep: ALL_LEAVES } = buildTree(12);

// ── True-function smooth curve (200 points) ───────────────────────────────────
const CURVE_PTS = Array.from({ length: 200 }, (_, i) => {
  const x = X_MIN + (i / 199) * (X_MAX - X_MIN);
  return { x, y1: Math.PI * Math.sin(x), y2: Math.PI * Math.cos(x) };
});

// ── Component ─────────────────────────────────────────────────────────────────
export default function DecisionTreeViz({
  accentColor = "#00d4aa",
}: { accentColor?: string }) {
  const [revealed, setRevealed]   = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showY2, setShowY2]       = useState(false);
  const vt = useVizTheme();
  const L = useVizLocale(DT_LABELS);

  const yKey      = showY2 ? "y2" : "y1";
  const trueColor = showY2 ? "#f97316" : "#6c63ff";
  const stepColor = accentColor;

  const currentLeaves = ALL_LEAVES[revealed] ?? ALL_LEAVES[ALL_LEAVES.length - 1];
  const currentSplit  = ALL_SPLITS[revealed - 1] ?? null;

  // Current MSE for active output
  const curMse = useMemo(() => {
    let total = 0;
    for (const leaf of currentLeaves) {
      const mean = showY2 ? leaf.meanY2 : leaf.meanY1;
      for (const p of leaf.pts) total += (p[yKey] - mean) ** 2;
    }
    return total / (N || 1);
  }, [currentLeaves, showY2, yKey]);

  // Auto-play
  useMemo(() => {
    if (!isPlaying) return;
    if (revealed < ALL_SPLITS.length) {
      const t = setTimeout(() => setRevealed(r => r + 1), 650);
      return () => clearTimeout(t);
    }
    setIsPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, revealed]);

  const handlePlay = () => {
    if (revealed >= ALL_SPLITS.length) {
      setRevealed(0);
      setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying(p => !p);
    }
  };

  // True-function SVG path
  const truePath = CURVE_PTS
    .map((p, i) => `${i === 0 ? "M" : "L"}${toSVGX(p.x).toFixed(1)},${toSVGY(showY2 ? p.y2 : p.y1).toFixed(1)}`)
    .join(" ");

  return (
    <VizCard>
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b flex-wrap gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {L.statsText(revealed, currentLeaves.length, curMse.toFixed(3))}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle y1/y2 */}
          <button
            onClick={() => setShowY2(v => !v)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: showY2 ? "#f9731625" : "#6c63ff25",
              color:           showY2 ? "#f97316"  : "#6c63ff",
              border: `1px solid ${showY2 ? "#f9731650" : "#6c63ff50"}`,
            }}
          >
            {showY2 ? "y₂ = π·cos(x)" : "y₁ = π·sin(x)"}
          </button>
          <button
            onClick={handlePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ backgroundColor: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}50` }}
          >
            {isPlaying
              ? L.pauseBtn
              : revealed >= ALL_SPLITS.length
              ? L.replayBtn
              : <><Play size={11} /> {L.growBtn}</>}
          </button>
          <button
            disabled={revealed >= ALL_SPLITS.length}
            onClick={() => setRevealed(r => Math.min(ALL_SPLITS.length, r + 1))}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              opacity: revealed >= ALL_SPLITS.length ? 0.4 : 1,
            }}
          >
            <ChevronRight size={12} /> {L.stepBtn}
          </button>
          <button
            onClick={() => { setRevealed(0); setIsPlaying(false); }}
            className="p-1.5 rounded-lg"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* ── SVG ── */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD}     x2={PAD}      y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={toSVGX(0)} y1={PAD} x2={toSVGX(0)} y2={H - PAD}
          stroke={vt.grid} strokeWidth={1} strokeDasharray="3,3" />
        <line x1={PAD} y1={toSVGY(0)} x2={W - PAD} y2={toSVGY(0)}
          stroke={vt.grid} strokeWidth={1} strokeDasharray="3,3" />

        {/* Axis tick labels */}
        {([-3, -2, -1, 0, 1, 2, 3] as number[]).map(v => (
          <text key={v} x={toSVGX(v)} y={H - PAD + 14}
            textAnchor="middle" fontSize={9} fill={vt.textMuted}>{v}</text>
        ))}
        {([-3, 0, 3] as number[]).map(v => (
          <text key={v} x={PAD - 6} y={toSVGY(v) + 4}
            textAnchor="end" fontSize={9} fill={vt.textMuted}>{v}</text>
        ))}
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>x</text>
        <text x={10} y={H / 2} textAnchor="middle" fontSize={9} fill={vt.textMuted}
          transform={`rotate(-90,10,${H / 2})`}>y</text>

        {/* Step function: leaf regions + horizontal lines */}
        {currentLeaves.map((leaf, i) => {
          const lx   = toSVGX(Math.max(X_MIN, leaf.xMin));
          const rx   = toSVGX(Math.min(X_MAX, leaf.xMax));
          const mean = showY2 ? leaf.meanY2 : leaf.meanY1;
          const sy   = toSVGY(mean);
          const y0   = toSVGY(0);
          return (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <rect
                x={lx} y={Math.min(sy, y0)}
                width={Math.max(0, rx - lx)}
                height={Math.abs(y0 - sy)}
                fill={stepColor} opacity={0.09}
              />
              <line x1={lx} y1={sy} x2={rx} y2={sy}
                stroke={stepColor} strokeWidth={2.5} />
            </motion.g>
          );
        })}

        {/* Vertical split lines */}
        {ALL_SPLITS.slice(0, revealed).map((s, i) => (
          <motion.line key={i}
            x1={toSVGX(s.x)} y1={PAD}
            x2={toSVGX(s.x)} y2={H - PAD}
            stroke={i === revealed - 1 ? accentColor : vt.border}
            strokeWidth={i === revealed - 1 ? 2 : 1}
            strokeDasharray="5,3"
            opacity={0.65}
            initial={{ scaleY: 0, originY: "50%" }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}

        {/* True function curve */}
        <path d={truePath} fill="none" stroke={trueColor} strokeWidth={2} strokeDasharray="7,4" opacity={0.85} />

        {/* Data points */}
        {DATA.map((pt, i) => (
          <motion.circle
            key={i}
            cx={toSVGX(pt.x)}
            cy={toSVGY(showY2 ? pt.y2 : pt.y1)}
            r={3}
            fill={trueColor}
            opacity={0.5}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.004 }}
          />
        ))}

        {/* Legend */}
        <line x1={W - 108} y1={22} x2={W - 88} y2={22} stroke={trueColor} strokeWidth={2} strokeDasharray="6,3" />
        <text x={W - 84} y={26} fontSize={8.5} fill={trueColor}>
          {showY2 ? "π·cos(x)" : "π·sin(x)"}
        </text>
        <line x1={W - 108} y1={38} x2={W - 88} y2={38} stroke={stepColor} strokeWidth={2.5} />
        <text x={W - 84} y={42} fontSize={8.5} fill={stepColor}>{L.dtLegend}</text>

        {/* Current split annotation */}
        {currentSplit && (
          <AnimatePresence>
            <motion.g
              key={revealed}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <rect
                x={toSVGX(currentSplit.x) + 4} y={PAD + 4}
                width={72} height={16} rx={4}
                fill={`${accentColor}20`} stroke={accentColor} strokeWidth={1}
              />
              <text x={toSVGX(currentSplit.x) + 8} y={PAD + 15}
                fontSize={8.5} fill={vt.ink(accentColor)} fontFamily="monospace">
                x ≤ {currentSplit.x.toFixed(2)}
              </text>
            </motion.g>
          </AnimatePresence>
        )}

        {/* Info badge: initial (no splits) */}
        {revealed === 0 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x={PAD + 8} y={PAD + 6} width={220} height={32} rx={6}
              fill={vt.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}
              stroke={vt.border} strokeWidth={1} />
            <text x={PAD + 18} y={PAD + 20} fontSize={8.5} fill={vt.textMuted}>
              {L.rootMsg1}
            </text>
            <text x={PAD + 18} y={PAD + 34} fontSize={8} fill={vt.textMuted}>
              {L.rootMsg2}
            </text>
          </motion.g>
        )}
      </svg>

      {/* ── Formula bar ── */}
      <div className="px-5 py-2 border-t flex flex-wrap gap-x-5 gap-y-1 items-center"
        style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          <span style={{ color: accentColor }}>{L.criterionText}</span>
        </span>
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          Gini = 1−Σpₖ²  ·  IG = H(parent)−Σwᵢ·H(childᵢ)
        </span>
      </div>

      {/* ── Stats footer ── */}
      <div
        className="grid grid-cols-4 border-t text-center"
        style={{ borderColor: "var(--border)" }}
      >
        {[
          { label: L.splitsLabel,  value: `${revealed} / ${ALL_SPLITS.length}` },
          { label: L.leavesLabel,  value: `${currentLeaves.length}` },
          { label: L.mseLabel,     value: curMse.toFixed(3) },
          { label: L.targetLabel,  value: showY2 ? "π·cos(x)" : "π·sin(x)" },
        ].map(({ label, value }) => (
          <div key={label} className="py-3">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
            <div className="text-sm font-bold font-mono" style={{ color: accentColor }}>{value}</div>
          </div>
        ))}
      </div>
    </VizCard>
  );
}
