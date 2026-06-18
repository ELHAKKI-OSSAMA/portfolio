"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const GB_LABELS = {
  en: {
    title: "Gradient Boosting — Sequential Correction",
    subtitle: "each tree targets residuals from previous",
    addTreeBtn: "Add Tree",
    trueFuncLegend: "── True function (hidden)",
    ensembleLegend: "── Ensemble prediction",
    treeChip: (i: number) => `Tree ${i + 1}`,
    hint: 'Click "Add Tree" to start boosting',
    treesLabel: "Trees",
    mseLabel: "MSE",
    improvementLabel: "Improvement",
  },
  fr: {
    title: "Gradient Boosting — Correction Séquentielle",
    subtitle: "chaque arbre cible les résidus du précédent",
    addTreeBtn: "Ajouter Arbre",
    trueFuncLegend: "── Fonction vraie (cachée)",
    ensembleLegend: "── Prédiction d'ensemble",
    treeChip: (i: number) => `Arbre ${i + 1}`,
    hint: 'Cliquez "Ajouter Arbre" pour commencer le boosting',
    treesLabel: "Arbres",
    mseLabel: "ECM",
    improvementLabel: "Amélioration",
  },
  ar: {
    title: "Gradient Boosting — تصحيح تسلسلي",
    subtitle: "كل شجرة تستهدف بواقي الشجرة السابقة",
    addTreeBtn: "إضافة شجرة",
    trueFuncLegend: "── الدالة الحقيقية (مخفية)",
    ensembleLegend: "── تنبؤ المجموعة",
    treeChip: (i: number) => `شجرة ${i + 1}`,
    hint: 'انقر "إضافة شجرة" لبدء التعزيز',
    treesLabel: "الأشجار",
    mseLabel: "MSE",
    improvementLabel: "التحسين",
  },
} as const;

const W = 520, H = 260, PAD = 40;
const N_POINTS = 25;
const LEARNING_RATE = 0.6;

const trueFunc = (x: number) => 3 * Math.sin(x * 0.8) + 0.5 * x;
const SEED_POINTS = Array.from({ length: N_POINTS }, (_, i) => {
  const x = (i / (N_POINTS - 1)) * 10;
  return { x, y: trueFunc(x) + (Math.sin(i * 17.3) * 1.8) };
});

function fitStump(xs: number[], residuals: number[]): (x: number) => number {
  let bestThresh = 0, bestGain = Infinity;
  const thresholds = Array.from({ length: 20 }, (_, i) => 0.5 + i * 0.5);
  for (const t of thresholds) {
    const left = residuals.filter((_, i) => xs[i] <= t);
    const right = residuals.filter((_, i) => xs[i] > t);
    if (left.length === 0 || right.length === 0) continue;
    const lMean = left.reduce((a, b) => a + b, 0) / left.length;
    const rMean = right.reduce((a, b) => a + b, 0) / right.length;
    const gain = left.reduce((s, r) => s + (r - lMean) ** 2, 0) + right.reduce((s, r) => s + (r - rMean) ** 2, 0);
    if (gain < bestGain) { bestGain = gain; bestThresh = t; }
  }
  const leftResids = residuals.filter((_, i) => xs[i] <= bestThresh);
  const rightResids = residuals.filter((_, i) => xs[i] > bestThresh);
  const lMean = leftResids.length ? leftResids.reduce((a, b) => a + b, 0) / leftResids.length : 0;
  const rMean = rightResids.length ? rightResids.reduce((a, b) => a + b, 0) / rightResids.length : 0;
  return (x: number) => x <= bestThresh ? lMean : rMean;
}

function toCanvasX(x: number) { return PAD + (x / 10) * (W - 2 * PAD); }
function toCanvasY(y: number, yMin: number, yMax: number) {
  return H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD);
}

const COLORS = ["#6c63ff", "#00d4aa", "#f59e0b", "#ff6b6b", "#ec4899", "#06b6d4"];

export default function GradientBoostingViz({ accentColor = "#f59e0b" }: { accentColor?: string }) {
  const [numTrees, setNumTrees] = useState(0);
  const vt = useVizTheme();
  const L = useVizLocale(GB_LABELS);
  const xs = SEED_POINTS.map(p => p.x);
  const ys = SEED_POINTS.map(p => p.y);

  const { predictions, trees } = useMemo(() => {
    const initPred = Array(N_POINTS).fill(ys.reduce((a, b) => a + b) / N_POINTS);
    const trees: Array<(x: number) => number> = [];
    let preds = [...initPred];

    for (let t = 0; t < Math.min(numTrees, 6); t++) {
      const residuals = ys.map((y, i) => y - preds[i]);
      const tree = fitStump(xs, residuals);
      trees.push(tree);
      preds = preds.map((p, i) => p + LEARNING_RATE * tree(xs[i]));
    }
    return { predictions: preds, trees };
  }, [numTrees, ys, xs]);

  const mse = SEED_POINTS.reduce((s, p, i) => s + (p.y - predictions[i]) ** 2, 0) / N_POINTS;
  const baseMse = SEED_POINTS.reduce((s, p) => s + (p.y - ys.reduce((a, b) => a + b) / N_POINTS) ** 2, 0) / N_POINTS;

  const allY = [...ys, ...predictions];
  const yMin = Math.min(...allY) - 1;
  const yMax = Math.max(...allY) + 1;

  const densX = Array.from({ length: 100 }, (_, i) => (i / 99) * 10);
  const truePath = densX.map(x => ({ x, y: trueFunc(x) }));
  const predPath = densX.map(x => {
    let p = ys.reduce((a, b) => a + b) / N_POINTS;
    for (let t = 0; t < Math.min(numTrees, trees.length); t++) {
      p += LEARNING_RATE * trees[t](x);
    }
    return { x, y: p };
  });

  const pathStr = (pts: Array<{ x: number; y: number }>) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${toCanvasX(p.x)},${toCanvasY(p.y, yMin, yMax)}`).join(" ");

  return (
    <VizCard>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {L.subtitle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNumTrees(n => Math.min(6, n + 1))}
            disabled={numTrees >= 6}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: numTrees < 6 ? `${accentColor}25` : "var(--bg-card)",
              color: numTrees < 6 ? accentColor : "var(--text-muted)",
              border: `1px solid ${numTrees < 6 ? accentColor + "50" : "var(--border)"}`,
            }}
          >
            <Plus size={11} />
            {L.addTreeBtn}
          </button>
          <button
            onClick={() => setNumTrees(0)}
            className="p-1.5 rounded-lg"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[2, 4, 6, 8, 10].map(v => {
          const cx = toCanvasX(v);
          return <line key={v} x1={cx} y1={PAD} x2={cx} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />;
        })}

        {/* True function (ghost) */}
        <path d={pathStr(truePath)} fill="none" stroke={vt.gridStrong} strokeWidth={2} strokeDasharray="6,4" />

        {/* Ensemble prediction */}
        <AnimatePresence>
          {numTrees > 0 && (
            <motion.path
              key={numTrees}
              d={pathStr(predPath)}
              fill="none"
              stroke={accentColor}
              strokeWidth={2.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Base prediction (dotted) */}
        {numTrees === 0 && (
          <line
            x1={PAD} y1={toCanvasY(ys.reduce((a, b) => a + b) / N_POINTS, yMin, yMax)}
            x2={W - PAD} y2={toCanvasY(ys.reduce((a, b) => a + b) / N_POINTS, yMin, yMax)}
            stroke={accentColor} strokeWidth={2} strokeDasharray="8,6"
          />
        )}

        {/* Data points colored by residual */}
        {SEED_POINTS.map((pt, i) => {
          const residual = pt.y - predictions[i];
          const isNeg = residual < 0;
          const cx = toCanvasX(pt.x);
          const cy = toCanvasY(pt.y, yMin, yMax);
          return (
            <g key={i}>
              {numTrees > 0 && (
                <line
                  x1={cx} y1={cy}
                  x2={cx} y2={toCanvasY(predictions[i], yMin, yMax)}
                  stroke={isNeg ? "#ff6b6b" : "#00d4aa"}
                  strokeWidth={1.5} opacity={0.5}
                />
              )}
              <circle cx={cx} cy={cy} r={4} fill={vt.pointFill} opacity={0.85} />
            </g>
          );
        })}

        {/* Legend */}
        <text x={PAD + 4} y={PAD + 14} fontSize={10} fill={vt.textMuted}>{L.trueFuncLegend}</text>
        <text x={PAD + 4} y={PAD + 26} fontSize={10} fill={vt.ink(accentColor)}>{L.ensembleLegend}</text>
      </svg>

      {/* Tree chips */}
      <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
        {Array.from({ length: numTrees }, (_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: `${COLORS[i]}20`, color: COLORS[i], border: `1px solid ${COLORS[i]}40` }}
          >
            {L.treeChip(i)}
          </motion.span>
        ))}
        {numTrees === 0 && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {L.hint}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
        {[
          { label: L.treesLabel, value: numTrees.toString() },
          { label: L.mseLabel, value: mse.toFixed(3) },
          { label: L.improvementLabel, value: `${((1 - mse / baseMse) * 100).toFixed(1)}%` },
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
