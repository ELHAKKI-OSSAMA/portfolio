"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const CM_LABELS = {
  en: {
    tabConfusionMatrix: "Confusion Matrix",
    tabPrecisionRecall: "Precision-Recall",
    thresholdLabel: "Threshold:",
    actualAxis: "Actual",
    predictedNeg: "Predicted Neg",
    predictedPos: "Predicted Pos",
    actualNeg: "Actual Neg",
    actualPos: "Actual Pos",
    metricPrecision: "Precision",
    metricRecall: "Recall",
    metricF1: "F1",
    metricAccuracy: "Accuracy",
    thresholdHint: "Drag threshold left → more positives predicted (higher recall, lower precision). Right → fewer positives (higher precision, lower recall).",
    prCurveDesc: "PR curve traces Precision vs Recall as threshold varies. The dot shows your current threshold.",
    recallAxisLabel: "Recall",
    precisionAxisLabel: "Precision",
  },
  fr: {
    tabConfusionMatrix: "Matrice de Confusion",
    tabPrecisionRecall: "Précision-Rappel",
    thresholdLabel: "Seuil :",
    actualAxis: "Réel",
    predictedNeg: "Prédit Nég",
    predictedPos: "Prédit Pos",
    actualNeg: "Réel Nég",
    actualPos: "Réel Pos",
    metricPrecision: "Précision",
    metricRecall: "Rappel",
    metricF1: "F1",
    metricAccuracy: "Exactitude",
    thresholdHint: "Glisser le seuil à gauche → plus de positifs prédits (rappel élevé, précision faible). À droite → moins de positifs (précision élevée, rappel faible).",
    prCurveDesc: "La courbe PR trace la précision vs le rappel selon le seuil. Le point montre votre seuil actuel.",
    recallAxisLabel: "Rappel",
    precisionAxisLabel: "Précision",
  },
  ar: {
    tabConfusionMatrix: "مصفوفة الارتباك",
    tabPrecisionRecall: "الدقة-الاستدعاء",
    thresholdLabel: "العتبة:",
    actualAxis: "الفعلي",
    predictedNeg: "متنبأ سلبي",
    predictedPos: "متنبأ إيجابي",
    actualNeg: "فعلي سلبي",
    actualPos: "فعلي إيجابي",
    metricPrecision: "الدقة",
    metricRecall: "الاستدعاء",
    metricF1: "F1",
    metricAccuracy: "الدقة الكلية",
    thresholdHint: "اسحب العتبة يساراً ← مزيد من الإيجابيات المتنبأة (استدعاء أعلى، دقة أقل). يميناً ← إيجابيات أقل (دقة أعلى، استدعاء أقل).",
    prCurveDesc: "منحنى PR يتتبع الدقة مقابل الاستدعاء بتغير العتبة. النقطة تُظهر عتبتك الحالية.",
    recallAxisLabel: "الاستدعاء",
    precisionAxisLabel: "الدقة",
  },
} as const;

// 100 sample predictions (score, true label)
const SAMPLES: Array<{ score: number; label: 0 | 1 }> = [
  ...Array.from({ length: 45 }, (_, i) => ({
    score: 0.38 + 0.56 * (i / 44) + Math.sin(i * 2.1) * 0.07,
    label: 1 as const,
  })),
  ...Array.from({ length: 55 }, (_, i) => ({
    score: 0.04 + 0.52 * (i / 54) + Math.sin(i * 1.9) * 0.06,
    label: 0 as const,
  })),
];

function computeMatrix(threshold: number) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const s of SAMPLES) {
    const pred = s.score >= threshold ? 1 : 0;
    if (pred === 1 && s.label === 1) tp++;
    else if (pred === 1 && s.label === 0) fp++;
    else if (pred === 0 && s.label === 1) fn++;
    else tn++;
  }
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall    = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1        = precision + recall === 0 ? 0 : 2 * precision * recall / (precision + recall);
  const accuracy  = (tp + tn) / SAMPLES.length;
  return { tp, fp, fn, tn, precision, recall, f1, accuracy };
}

// PR curve data
function computePRCurve() {
  return Array.from({ length: 101 }, (_, i) => {
    const thresh = i / 100;
    const { precision, recall } = computeMatrix(thresh);
    return { precision, recall };
  });
}

const PR_CURVE = computePRCurve();

const W = 260;
const H = 240;
const PAD = 36;
const IW = W - PAD * 2;
const IH = H - PAD * 2;

function prcPath(): string {
  return PR_CURVE
    .map(({ precision, recall }, i) => {
      const x = PAD + recall * IW;
      const y = PAD + IH - precision * IH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const CELL_COLORS = {
  tp: "#22c55e",
  tn: "#06b6d4",
  fp: "#f43f5e",
  fn: "#f59e0b",
};

// Internal tab keys — kept in English for state management
const TABS = ["Confusion Matrix", "Precision-Recall"] as const;
type Tab = (typeof TABS)[number];

export default function ConfusionMatrixViz({ accentColor = "#06b6d4" }: { accentColor?: string }) {
  const [threshold, setThreshold] = useState(0.5);
  const [tab, setTab] = useState<Tab>("Confusion Matrix");
  const vt = useVizTheme();
  const L = useVizLocale(CM_LABELS);

  const cm = useMemo(() => computeMatrix(threshold), [threshold]);

  const metrics = [
    { label: L.metricPrecision, value: cm.precision, color: CELL_COLORS.tp },
    { label: L.metricRecall,    value: cm.recall,    color: CELL_COLORS.fn },
    { label: L.metricF1,        value: cm.f1,         color: accentColor },
    { label: L.metricAccuracy,  value: cm.accuracy,   color: CELL_COLORS.tn },
  ];

  // Locale-aware tab labels (display only — internal state stays English)
  const tabLabels: Record<Tab, string> = {
    "Confusion Matrix": L.tabConfusionMatrix,
    "Precision-Recall": L.tabPrecisionRecall,
  };

  // Current PR point on the curve
  const prDotX = PAD + cm.recall * IW;
  const prDotY = PAD + IH - cm.precision * IH;

  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ backgroundColor: vt.surface, borderColor: vt.border }}
    >
      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              tab === t
                ? { backgroundColor: accentColor, color: "#fff" }
                : { backgroundColor: `${accentColor}15`, color: vt.textMuted }
            }
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Threshold slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs w-28 flex-shrink-0" style={{ color: vt.textMuted }}>
          {L.thresholdLabel} <strong style={{ color: accentColor }}>{threshold.toFixed(2)}</strong>
        </span>
        <input
          type="range" min={0} max={1} step={0.01} value={threshold}
          onChange={e => setThreshold(Number(e.target.value))}
          className="flex-1 h-1"
          style={{ accentColor }}
        />
      </div>

      {tab === "Confusion Matrix" && (
        <>
          {/* 2×2 matrix */}
          <div className="flex gap-3 items-start">
            {/* Axis labels */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-semibold mb-1" style={{ color: vt.textMuted, writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
                {L.actualAxis}
              </span>
            </div>
            <div className="flex-1">
              {/* Col headers */}
              <div className="flex mb-1 pl-14">
                <span className="flex-1 text-center text-xs font-semibold" style={{ color: vt.textMuted }}>{L.predictedNeg}</span>
                <span className="flex-1 text-center text-xs font-semibold" style={{ color: vt.textMuted }}>{L.predictedPos}</span>
              </div>
              {/* Row 0: Actual Neg */}
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-semibold w-14 text-right pr-2 flex-shrink-0" style={{ color: vt.textMuted }}>{L.actualNeg}</span>
                {[{ k: "tn" as const, v: cm.tn }, { k: "fp" as const, v: cm.fp }].map(({ k, v }) => (
                  <motion.div
                    key={k}
                    className="flex-1 aspect-square rounded-xl flex flex-col items-center justify-center"
                    style={{ backgroundColor: `${CELL_COLORS[k]}22`, border: `2px solid ${CELL_COLORS[k]}60` }}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                  >
                    <motion.span
                      className="text-2xl font-bold"
                      style={{ color: CELL_COLORS[k] }}
                      key={v}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {v}
                    </motion.span>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: CELL_COLORS[k] }}>{k.toUpperCase()}</span>
                  </motion.div>
                ))}
              </div>
              {/* Row 1: Actual Pos */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold w-14 text-right pr-2 flex-shrink-0" style={{ color: vt.textMuted }}>{L.actualPos}</span>
                {[{ k: "fn" as const, v: cm.fn }, { k: "tp" as const, v: cm.tp }].map(({ k, v }) => (
                  <motion.div
                    key={k}
                    className="flex-1 aspect-square rounded-xl flex flex-col items-center justify-center"
                    style={{ backgroundColor: `${CELL_COLORS[k]}22`, border: `2px solid ${CELL_COLORS[k]}60` }}
                  >
                    <motion.span
                      className="text-2xl font-bold"
                      style={{ color: CELL_COLORS[k] }}
                      key={v}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {v}
                    </motion.span>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: CELL_COLORS[k] }}>{k.toUpperCase()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Metric pills */}
          <div className="grid grid-cols-4 gap-2">
            {metrics.map(m => (
              <div
                key={m.label}
                className="rounded-lg px-2 py-2 text-center"
                style={{ backgroundColor: `${m.color}15`, border: `1px solid ${m.color}30` }}
              >
                <div className="text-base font-bold" style={{ color: m.color }}>{(m.value * 100).toFixed(1)}%</div>
                <div className="text-xs" style={{ color: vt.textMuted }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div className="text-xs p-2 rounded-lg" style={{ backgroundColor: `${accentColor}12`, color: accentColor }}>
            {L.thresholdHint}
          </div>
        </>
      )}

      {tab === "Precision-Recall" && (
        <div>
          <p className="text-xs mb-3" style={{ color: vt.textMuted }}>
            {L.prCurveDesc}
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto">
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map(frac => (
              <g key={frac}>
                <line x1={PAD} x2={PAD + IW} y1={PAD + frac * IH} y2={PAD + frac * IH} stroke={vt.grid} strokeWidth={1} />
                <line x1={PAD + frac * IW} x2={PAD + frac * IW} y1={PAD} y2={PAD + IH} stroke={vt.grid} strokeWidth={1} />
                <text x={PAD - 4} y={PAD + (1 - frac) * IH + 4} textAnchor="end" fontSize={9} fill={vt.textFaint}>{frac.toFixed(1)}</text>
                <text x={PAD + frac * IW} y={PAD + IH + 14} textAnchor="middle" fontSize={9} fill={vt.textFaint}>{frac.toFixed(1)}</text>
              </g>
            ))}
            <text x={PAD + IW / 2} y={H - 2} textAnchor="middle" fontSize={10} fill={vt.textMuted}>{L.recallAxisLabel}</text>
            <text x={10} y={PAD + IH / 2} textAnchor="middle" fontSize={10} fill={vt.textMuted}
              transform={`rotate(-90, 10, ${PAD + IH / 2})`}>{L.precisionAxisLabel}</text>

            {/* PR curve */}
            <motion.path
              d={prcPath()}
              fill="none"
              stroke={accentColor}
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Current threshold dot */}
            <circle
              cx={prDotX}
              cy={prDotY}
              r={6}
              fill={accentColor}
              stroke={vt.bg}
              strokeWidth={2}
            />
            <text x={prDotX + 8} y={prDotY - 4} fontSize={9} fill={vt.ink(accentColor)}>
              T={threshold.toFixed(2)}
            </text>
          </svg>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              { label: L.metricPrecision, value: cm.precision, color: CELL_COLORS.tp },
              { label: L.metricRecall,    value: cm.recall,    color: CELL_COLORS.fn },
            ].map(m => (
              <div
                key={m.label}
                className="rounded-lg px-3 py-2 text-center"
                style={{ backgroundColor: `${m.color}15`, border: `1px solid ${m.color}30` }}
              >
                <div className="text-xl font-bold" style={{ color: m.color }}>{(m.value * 100).toFixed(1)}%</div>
                <div className="text-xs" style={{ color: vt.textMuted }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
