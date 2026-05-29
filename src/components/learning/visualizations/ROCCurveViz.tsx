"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const ROC_LABELS = {
  en: {
    title: "ROC Curve — Interactive Threshold",
    confusionMatrixLabel: "Confusion Matrix",
    fprAxis: "FPR (1-Specificity)",
    tprAxis: "TPR (Recall)",
    truePositive: "True Positive",
    falsePositive: "False Positive",
    falseNegative: "False Negative",
    trueNegative: "True Negative",
    metricThreshold: "Threshold",
    metricRecall: "Recall (TPR)",
    metricFPR: "FPR",
    metricPrecision: "Precision",
    metricF1: "F1",
    thresholdLabel: "Threshold:",
    dragHint: "drag →",
  },
  fr: {
    title: "Courbe ROC — Seuil Interactif",
    confusionMatrixLabel: "Matrice de Confusion",
    fprAxis: "TFP (1-Spécificité)",
    tprAxis: "TVP (Rappel)",
    truePositive: "Vrai Positif",
    falsePositive: "Faux Positif",
    falseNegative: "Faux Négatif",
    trueNegative: "Vrai Négatif",
    metricThreshold: "Seuil",
    metricRecall: "Rappel (TVP)",
    metricFPR: "TFP",
    metricPrecision: "Précision",
    metricF1: "F1",
    thresholdLabel: "Seuil :",
    dragHint: "glisser →",
  },
  ar: {
    title: "منحنى ROC — عتبة تفاعلية",
    confusionMatrixLabel: "مصفوفة الارتباك",
    fprAxis: "معدل الإيجابية الكاذبة",
    tprAxis: "معدل الإيجابية الحقيقية",
    truePositive: "إيجابي حقيقي",
    falsePositive: "إيجابي كاذب",
    falseNegative: "سلبي كاذب",
    trueNegative: "سلبي حقيقي",
    metricThreshold: "العتبة",
    metricRecall: "الاستدعاء (TVP)",
    metricFPR: "TFP",
    metricPrecision: "الدقة",
    metricF1: "F1",
    thresholdLabel: "العتبة:",
    dragHint: "اسحب →",
  },
} as const;

const W = 280, H = 280, PAD = 40;

const SCORES: Array<{ score: number; label: 0 | 1 }> = [
  ...Array.from({ length: 40 }, (_, i) => ({
    score: 0.4 + 0.55 * (i / 39) + (Math.sin(i * 2.3) * 0.08),
    label: 1 as const,
  })),
  ...Array.from({ length: 60 }, (_, i) => ({
    score: 0.05 + 0.5 * (i / 59) + (Math.sin(i * 1.7) * 0.06),
    label: 0 as const,
  })),
];

function computeROC(threshold: number) {
  const tp = SCORES.filter(s => s.label === 1 && s.score >= threshold).length;
  const fp = SCORES.filter(s => s.label === 0 && s.score >= threshold).length;
  const fn = SCORES.filter(s => s.label === 1 && s.score < threshold).length;
  const tn = SCORES.filter(s => s.label === 0 && s.score < threshold).length;
  const tpr = (tp + fn) === 0 ? 0 : tp / (tp + fn);
  const fpr = (fp + tn) === 0 ? 0 : fp / (fp + tn);
  const precision = (tp + fp) === 0 ? 0 : tp / (tp + fp);
  const f1 = precision + tpr === 0 ? 0 : 2 * precision * tpr / (precision + tpr);
  return { tp, fp, fn, tn, tpr, fpr, precision, f1 };
}

function computeFullROC(): Array<{ fpr: number; tpr: number }> {
  return Array.from({ length: 101 }, (_, i) => {
    const { fpr, tpr } = computeROC(1 - i / 100);
    return { fpr, tpr };
  });
}

function computeAUC(curve: Array<{ fpr: number; tpr: number }>): number {
  let auc = 0;
  for (let i = 1; i < curve.length; i++) {
    auc += (curve[i].fpr - curve[i - 1].fpr) * (curve[i].tpr + curve[i - 1].tpr) / 2;
  }
  return Math.abs(auc);
}

export default function ROCCurveViz({ accentColor = "#ff6b6b" }: { accentColor?: string }) {
  const [threshold, setThreshold] = useState(0.5);
  const vt = useVizTheme();
  const L = useVizLocale(ROC_LABELS);

  const rocCurve = useMemo(() => computeFullROC(), []);
  const auc = useMemo(() => computeAUC(rocCurve), [rocCurve]);
  const { tp, fp, fn, tn, tpr, fpr, precision, f1 } = useMemo(() => computeROC(threshold), [threshold]);

  const toSVG = (fpr: number, tpr: number) => ({
    x: PAD + fpr * (W - 2 * PAD),
    y: H - PAD - tpr * (H - 2 * PAD),
  });

  const pathD = rocCurve
    .map((pt, i) => {
      const { x, y } = toSVG(pt.fpr, pt.tpr);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const currentPt = toSVG(fpr, tpr);

  const cmCells = [
    { label: "TP", value: tp, color: "#00d4aa", desc: L.truePositive },
    { label: "FP", value: fp, color: "#ff6b6b", desc: L.falsePositive },
    { label: "FN", value: fn, color: "#f59e0b", desc: L.falseNegative },
    { label: "TN", value: tn, color: "#6c63ff", desc: L.trueNegative },
  ];

  return (
    <VizCard>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {L.title}
        </span>
        <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
          AUC = {auc.toFixed(4)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-0">
        <div className="flex-1">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {[0.25, 0.5, 0.75].map(v => {
              const { x } = toSVG(v, 0);
              const { y } = toSVG(0, v);
              return (
                <g key={v}>
                  <line x1={x} y1={PAD} x2={x} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />
                  <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke={vt.grid} strokeWidth={1} />
                  <text x={x} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{v}</text>
                  <text x={PAD - 6} y={y + 3} textAnchor="end" fontSize={9} fill={vt.textMuted}>{v}</text>
                </g>
              );
            })}

            {/* Diagonal (random classifier) */}
            <line
              x1={toSVG(0, 0).x} y1={toSVG(0, 0).y}
              x2={toSVG(1, 1).x} y2={toSVG(1, 1).y}
              stroke={vt.gridStrong} strokeWidth={1} strokeDasharray="4,4"
            />

            {/* AUC fill */}
            <path
              d={`${pathD} L${toSVG(1, 0).x},${toSVG(1, 0).y} L${toSVG(0, 0).x},${toSVG(0, 0).y} Z`}
              fill={accentColor} opacity={0.08}
            />

            {/* ROC curve */}
            <path d={pathD} fill="none" stroke={accentColor} strokeWidth={2.5} />

            {/* Axes */}
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
            <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={10} fill={vt.textMuted}>{L.fprAxis}</text>
            <text x={10} y={H / 2} textAnchor="middle" fontSize={10} fill={vt.textMuted}
              transform={`rotate(-90,10,${H / 2})`}>{L.tprAxis}</text>

            {/* Current threshold point */}
            <motion.circle
              cx={currentPt.x} cy={currentPt.y} r={7}
              fill={accentColor} stroke={vt.pointFill} strokeWidth={2}
              animate={{ cx: currentPt.x, cy: currentPt.y }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />

            <motion.line
              x1={PAD} y1={currentPt.y} x2={currentPt.x} y2={currentPt.y}
              stroke={accentColor} strokeWidth={1} strokeDasharray="3,3" opacity={0.5}
              animate={{ y1: currentPt.y, y2: currentPt.y }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
            <motion.line
              x1={currentPt.x} y1={currentPt.y} x2={currentPt.x} y2={H - PAD}
              stroke={accentColor} strokeWidth={1} strokeDasharray="3,3" opacity={0.5}
              animate={{ x1: currentPt.x, x2: currentPt.x }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </svg>
        </div>

        {/* Right panel */}
        <div className="p-4 flex flex-col gap-3 min-w-[180px]">
          <div>
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{L.confusionMatrixLabel}</p>
            <div className="grid grid-cols-2 gap-1">
              {cmCells.map(({ label, value, color, desc }) => (
                <motion.div
                  key={label}
                  className="p-2 rounded-lg text-center"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-lg font-bold font-mono" style={{ color }}>{value}</div>
                  <div className="text-xs font-semibold" style={{ color }}>{label}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)", fontSize: "9px" }}>{desc}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {[
            { label: L.metricThreshold, value: threshold.toFixed(2), color: "var(--text-primary)" },
            { label: L.metricRecall,    value: tpr.toFixed(3),       color: "#00d4aa" },
            { label: L.metricFPR,       value: fpr.toFixed(3),       color: "#ff6b6b" },
            { label: L.metricPrecision, value: precision.toFixed(3), color: "#f59e0b" },
            { label: L.metricF1,        value: f1.toFixed(3),        color: accentColor },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
              <span className="text-xs font-mono font-bold" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs w-20" style={{ color: "var(--text-muted)" }}>
            {L.thresholdLabel} <span style={{ color: accentColor }} className="font-mono">{threshold.toFixed(2)}</span>
          </span>
          <input
            type="range" min={0.01} max={0.99} step={0.01}
            value={threshold}
            onChange={e => setThreshold(parseFloat(e.target.value))}
            className="flex-1" style={{ accentColor }}
          />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{L.dragHint}</span>
        </div>
      </div>
    </VizCard>
  );
}
