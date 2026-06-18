"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const BV_LABELS = {
  en: {
    title: "Bias–Variance Tradeoff",
    subtitle: (d: number) =>
      d <= 3
        ? `degree ${d} — high bias · flat line misses sine curve`
        : d >= 8
        ? `degree ${d} — high variance · curves diverge across datasets`
        : `degree ${d} — balanced · curves cluster near truth`,
    trueFnBtn: "True fn",
    otherDatasetsBtn: "Other datasets",
    residualsBtn: "Residuals",
    fittedCurveLabel: "Fitted curve — solid = this dataset · faint = 5 other bootstrap datasets",
    highBiasAnnotation: "← HIGH BIAS: model can't capture the curved pattern →",
    highVarAnnotation: "spread = HIGH VARIANCE",
    trainLegend: "Train",
    testLegend: "Test",
    trueFnLegend: "True fn",
    otherDatasetsLegend: "5 other datasets",
    trainErrLegend: "Train err",
    testErrLegend: "Test err",
    panelATitle: "Train MSE vs Test MSE",
    panelBLeft: "Train — Bias² / Var",
    panelBRight: "Test — Bias² / Var",
    bias2Legend: "Bias²",
    varianceLegend: "Variance",
    underfitZone: "Underfit",
    goodZone: "Good",
    overfitZone: "Overfit",
    diagUnderfitting: "Underfitting (High Bias)",
    diagUnderfittingHint: (cur: string, min: string) =>
      `test MSE ${cur} > min ${min} — model too rigid`,
    diagOptimal: (d: number) => `Optimal — degree ${d}`,
    diagOptimalHint: (mse: string) => `min test MSE ${mse} — best generalisation`,
    diagGoodBalance: "Good Balance",
    diagGoodBalanceHint: (mse: string) => `slight overfit · test MSE ${mse}`,
    diagOverfitting: "Overfitting (High Variance)",
    diagOverfittingHint: (mse: string) =>
      `test MSE ${mse} rising — variance hurts generalisation`,
    degreeLabel: "Degree:",
    footerFormula: (optDeg: number) =>
      `E[(ŷ−y)²] = Bias²[ŷ] + Var[ŷ] + σ²  ·  ★ = degree ${optDeg} minimises test MSE`,
    statDegree: "Degree",
    statTrainBias2: "Train Bias²",
    statTrainVar: "Train Var",
    statTestBias2: "Test Bias²",
    statTestVar: "Test Var",
    statTestMSE: "Test MSE",
  },
  fr: {
    title: "Compromis Biais–Variance",
    subtitle: (d: number) =>
      d <= 3
        ? `degré ${d} — biais élevé · la droite rate la courbe sinusoïdale`
        : d >= 8
        ? `degré ${d} — variance élevée · les courbes divergent selon les jeux`
        : `degré ${d} — équilibré · les courbes se regroupent près de la vérité`,
    trueFnBtn: "Vrai fn",
    otherDatasetsBtn: "Autres jeux",
    residualsBtn: "Résidus",
    fittedCurveLabel: "Courbe ajustée — pleine = ce jeu · estompé = 5 autres jeux bootstrap",
    highBiasAnnotation: "← BIAIS ÉLEVÉ : le modèle ne peut pas capturer la courbe →",
    highVarAnnotation: "dispersion = VARIANCE ÉLEVÉE",
    trainLegend: "Entraîn.",
    testLegend: "Test",
    trueFnLegend: "Vrai fn",
    otherDatasetsLegend: "5 autres jeux",
    trainErrLegend: "Err. entraîn.",
    testErrLegend: "Err. test",
    panelATitle: "ECM entraîn. vs ECM test",
    panelBLeft: "Entraîn. — Biais² / Var",
    panelBRight: "Test — Biais² / Var",
    bias2Legend: "Biais²",
    varianceLegend: "Variance",
    underfitZone: "Sous-ajust.",
    goodZone: "Équilibré",
    overfitZone: "Sur-ajust.",
    diagUnderfitting: "Sous-ajustement (Biais Élevé)",
    diagUnderfittingHint: (cur: string, min: string) =>
      `ECM test ${cur} > min ${min} — modèle trop rigide`,
    diagOptimal: (d: number) => `Optimal — degré ${d}`,
    diagOptimalHint: (mse: string) => `ECM test min ${mse} — meilleure généralisation`,
    diagGoodBalance: "Bon Équilibre",
    diagGoodBalanceHint: (mse: string) => `léger sur-ajustement · ECM test ${mse}`,
    diagOverfitting: "Sur-ajustement (Variance Élevée)",
    diagOverfittingHint: (mse: string) =>
      `ECM test ${mse} en hausse — la variance nuit à la généralisation`,
    degreeLabel: "Degré :",
    footerFormula: (optDeg: number) =>
      `E[(ŷ−y)²] = Biais²[ŷ] + Var[ŷ] + σ²  ·  ★ = degré ${optDeg} minimise l'ECM test`,
    statDegree: "Degré",
    statTrainBias2: "Biais² Entraîn.",
    statTrainVar: "Var Entraîn.",
    statTestBias2: "Biais² Test",
    statTestVar: "Var Test",
    statTestMSE: "ECM Test",
  },
  ar: {
    title: "مقايضة التحيز–التباين",
    subtitle: (d: number) =>
      d <= 3
        ? `درجة ${d} — تحيز عالٍ · الخط المستقيم يفشل في التقاط المنحنى`
        : d >= 8
        ? `درجة ${d} — تباين عالٍ · المنحنيات تتباعد عبر مجموعات البيانات`
        : `درجة ${d} — متوازن · المنحنيات تتجمع قرب الحقيقة`,
    trueFnBtn: "الدالة الحقيقية",
    otherDatasetsBtn: "مجموعات أخرى",
    residualsBtn: "البواقي",
    fittedCurveLabel: "المنحنى المُضبَّط — مصمت = هذا الجهاز · خافت = 5 مجموعات bootstrap أخرى",
    highBiasAnnotation: "← تحيز عالٍ: النموذج لا يستطيع التقاط النمط المنحني →",
    highVarAnnotation: "انتشار = تباين عالٍ",
    trainLegend: "تدريب",
    testLegend: "اختبار",
    trueFnLegend: "الدالة الحقيقية",
    otherDatasetsLegend: "5 مجموعات أخرى",
    trainErrLegend: "خطأ التدريب",
    testErrLegend: "خطأ الاختبار",
    panelATitle: "MSE تدريب vs MSE اختبار",
    panelBLeft: "تدريب — تحيز² / تباين",
    panelBRight: "اختبار — تحيز² / تباين",
    bias2Legend: "تحيز²",
    varianceLegend: "تباين",
    underfitZone: "تقصير",
    goodZone: "توازن",
    overfitZone: "إفراط",
    diagUnderfitting: "تقصير في الملاءمة (تحيز عالٍ)",
    diagUnderfittingHint: (cur: string, min: string) =>
      `MSE اختبار ${cur} > الأدنى ${min} — النموذج صلب جداً`,
    diagOptimal: (d: number) => `مثالي — درجة ${d}`,
    diagOptimalHint: (mse: string) => `أدنى MSE اختبار ${mse} — أفضل تعميم`,
    diagGoodBalance: "توازن جيد",
    diagGoodBalanceHint: (mse: string) => `إفراط طفيف · MSE اختبار ${mse}`,
    diagOverfitting: "إفراط في الملاءمة (تباين عالٍ)",
    diagOverfittingHint: (mse: string) =>
      `MSE اختبار ${mse} في ارتفاع — التباين يضر بالتعميم`,
    degreeLabel: "الدرجة:",
    footerFormula: (optDeg: number) =>
      `E[(ŷ−y)²] = Bias²[ŷ] + Var[ŷ] + σ²  ·  ★ = درجة ${optDeg} تُقلل MSE الاختبار`,
    statDegree: "الدرجة",
    statTrainBias2: "تحيز² التدريب",
    statTrainVar: "تباين التدريب",
    statTestBias2: "تحيز² الاختبار",
    statTestVar: "تباين الاختبار",
    statTestMSE: "MSE الاختبار",
  },
} as const;

// ── Dimensions ────────────────────────────────────────────────────────────────
const W = 680, PAD = 56;
const H_TOP = 270;        // fitted-curve panel
const H_BAR = 350;        // two bottom panels stacked
const H = H_TOP + H_BAR + 28;
const CHART_BOT = H_TOP - 48;       // x-axis y in top panel (leaves 48 px for ticks + legend)
const MAX_DEGREE = 11;

// ── Ground truth — sklearn example: cos(1.5·π·x)  ────────────────────────────
const TRUE_FN = (x: number) => Math.cos(1.5 * Math.PI * x);

// ── Deterministic RNG helper (used for bootstrap sampling) ───────────────────
const seeded = (i: number, s: number) => Math.abs(Math.sin(i * 53.1 + s * 7.9));

// ── Training + test data — exact values from mlu-explain bias-variance article ─
// Source: mlu-explain.github.io/bias-variance/ · SVG circle coordinates
// converted via: data_x=(cx-30.675)/603.5, data_y=(164.48-cy)/117.13

const TRAIN = [
  { x: 0.004, y:  0.568 },
  { x: 0.217, y:  0.638 },
  { x: 0.113, y:  0.580 },
  { x: 0.322, y:  0.573 },
  { x: 0.447, y: -0.589 },
  { x: 0.527, y: -0.410 },
  { x: 0.629, y: -0.845 },
  { x: 0.748, y: -0.102 },
  { x: 0.838, y: -0.187 },
  { x: 1.000, y:  0.354 } // normalized from ~1.049
];

const TEST = [
  { x: 0.027, y:  0.244 },
  { x: 0.160, y:  0.274 },
  { x: 0.249, y:  1.102 },
  { x: 0.366, y: -0.028 },
  { x: 0.440, y: -0.269 },
  { x: 0.502, y: -1.248 },
  { x: 0.602, y: -0.542 },
  { x: 0.758, y: -0.976 },
  { x: 0.843, y:  0.231 },
  { x: 0.956, y:  1.158 }
];

// ── Ghost bootstrap samples (5 resamples of TRAIN) ────────────────────────────
const N_GHOST = 5;
const GHOST_TRAINS = Array.from({ length: N_GHOST }, (_, g) =>
  Array.from({ length: TRAIN.length }, (_, i) => {
    const idx = Math.abs(Math.floor(seeded(i, g + 2) * 1000)) % TRAIN.length;
    return TRAIN[idx];
  })
);

// ── Polynomial fitting (Gaussian elimination + ridge) ────────────────────────
function gaussElim(A: number[][], b: number[]): number[] {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let r = col + 1; r < n; r++)
      if (Math.abs(M[r][col]) > Math.abs(M[maxRow][col])) maxRow = r;
    [M[col], M[maxRow]] = [M[maxRow], M[col]];
    const piv = M[col][col];
    if (Math.abs(piv) < 1e-14) continue;
    for (let r = col + 1; r < n; r++) {
      const f = M[r][col] / piv;
      for (let k = col; k <= n; k++) M[r][k] -= f * M[col][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = M[i][n];
    for (let j = i + 1; j < n; j++) x[i] -= M[i][j] * x[j];
    x[i] /= M[i][i] || 1;
  }
  return x;
}

function polyFit(pts: { x: number; y: number }[], degree: number): (x: number) => number {
  const dim = degree + 1;
  const xn = (x: number) => 2 * x - 1;
  const xs = pts.map(p => xn(p.x));
  const ys = pts.map(p => p.y);
  const lambda = 1e-6 * Math.pow(8, Math.max(0, degree - 4));
  const VtV = Array.from({ length: dim }, (_, i) =>
    Array.from({ length: dim }, (_, j) => {
      const s = xs.reduce((acc, x) => acc + Math.pow(x, i + j), 0);
      return i === j ? s + lambda * pts.length : s;
    })
  );
  const Vty = Array.from({ length: dim }, (_, i) =>
    xs.reduce((acc, x, ri) => acc + Math.pow(x, i) * ys[ri], 0)
  );
  const beta = gaussElim(VtV, Vty);
  return (x: number) => {
    const xnorm = xn(x);
    return beta.reduce((s, b, k) => s + b * Math.pow(xnorm, k), 0);
  };
}

function mse(pts: { x: number; y: number }[], fn: (x: number) => number) {
  return pts.reduce((s, p) => s + (p.y - fn(p.x)) ** 2, 0) / pts.length;
}

// ── Pre-compute eval xs ───────────────────────────────────────────────────────
const EVAL_XS = Array.from({ length: 120 }, (_, i) => i / 119);
const DEGREES = Array.from({ length: MAX_DEGREE }, (_, i) => i + 1);

// ── Pre-compute ghost fits per degree ─────────────────────────────────────────
const GHOST_FNS: ((x: number) => number)[][] = DEGREES.map(d =>
  GHOST_TRAINS.map(gt => polyFit(gt, d))
);

// ── Bias²/Variance helper — evaluated at a specific set of points ─────────────
function decompAt(
  pts: { x: number; y: number }[],
  ghosts: ((x: number) => number)[]
) {
  const stats = pts.map(pt => {
    const preds = ghosts.map(fn => Math.max(-3, Math.min(3, fn(pt.x))));
    const mean  = preds.reduce((s, p) => s + p, 0) / preds.length;
    return {
      bias2:    (mean - TRUE_FN(pt.x)) ** 2,
      variance: preds.reduce((s, p) => s + (p - mean) ** 2, 0) / preds.length,
    };
  });
  return {
    bias2:    stats.reduce((s, v) => s + v.bias2,    0) / stats.length,
    variance: stats.reduce((s, v) => s + v.variance, 0) / stats.length,
  };
}

// ── Bias²/Variance at TRAIN points (how rigid the model is on training data) ──
const DECOMP_TRAIN = DEGREES.map((d, di) => ({
  degree: d, ...decompAt(TRAIN, GHOST_FNS[di]),
}));

// ── Bias²/Variance at TEST points (how well the model generalises) ────────────
const DECOMP_TEST = DEGREES.map((d, di) => ({
  degree: d, ...decompAt(TEST, GHOST_FNS[di]),
}));

// ── Train / test MSE per degree ───────────────────────────────────────────────
const ERRORS = DEGREES.map(d => {
  const fn = polyFit(TRAIN, d);
  return { degree: d, trainMSE: mse(TRAIN, fn), testMSE: mse(TEST, fn) };
});

// ── Real zone boundaries ──────────────────────────────────────────────────────
// OPT_DEG  : degree with minimum test MSE → empirical sweet spot
const OPT_DEG   = ERRORS.reduce((b, e) => e.testMSE < b.testMSE ? e : b).degree;
// CROSS_DEG: degree where test bias² ≈ test variance → theoretical boundary
const CROSS_DEG = DECOMP_TEST.reduce((b, d) =>
  Math.abs(d.bias2 - d.variance) < Math.abs(b.bias2 - b.variance) ? d : b).degree;
// GOOD_DEG : last degree whose test MSE is still within 25% of the optimal
const GOOD_DEG = ERRORS.reduce(
  (g, e) => e.degree > OPT_DEG && e.testMSE < ERRORS[OPT_DEG - 1].testMSE * 1.25 ? e.degree : g,
  OPT_DEG
);

// ── SVG coordinate helpers — top panel (fitted curves) ───────────────────────
const X_MIN = 0, X_MAX = 1;
const Y_MIN = -2.2, Y_MAX = 2.2;
function toSX(x: number) {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
}
function toSY(y: number) {
  return CHART_BOT - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (CHART_BOT - 30);
}

// ── Panel A: Train MSE vs Test MSE (line chart) ───────────────────────────────
const MSE_Y0  = H_TOP + 10;              // top of MSE panel
const MSE_BOT = H_TOP + H_BAR / 2 - 14; // bottom axis y
const MSE_H   = MSE_BOT - MSE_Y0 - 36;  // drawable height
const MSE_W   = W - 2 * PAD;
const maxMSE  = Math.max(...ERRORS.map(e => Math.max(e.trainMSE, e.testMSE))) * 1.15;
function mseX(d: number) { return PAD + ((d - 1) / (MAX_DEGREE - 1)) * MSE_W; }
function mseY(v: number)  { return MSE_BOT - (v / maxMSE) * MSE_H; }

// ── Panel B: Bias²/Variance split — left=Train, right=Test ───────────────────
const BV_Y0   = H_TOP + H_BAR / 2 + 16;
const BV_BOT  = H_TOP + H_BAR - 10;
const BV_H    = BV_BOT - BV_Y0 - 36;
const HALF_W  = W / 2;
const BV_EACH = HALF_W - PAD - 24;         // pixel width per half (24px gap each side of center)
const BAR_W_BV = Math.max(4, BV_EACH / (MAX_DEGREE * 1.7));
const maxBVTr = Math.max(...DECOMP_TRAIN.map(d => d.bias2 + d.variance)) * 1.2;
const maxBVTe = Math.max(...DECOMP_TEST.map(d => d.bias2 + d.variance)) * 1.2;
function bvXT(d: number) { return PAD + ((d - 1) / (MAX_DEGREE - 1)) * BV_EACH; }
function bvXE(d: number) { return HALF_W + 24 + ((d - 1) / (MAX_DEGREE - 1)) * BV_EACH; }
function bvHT(v: number) { return (v / maxBVTr) * BV_H; }
function bvHE(v: number) { return (v / maxBVTe) * BV_H; }

// ── Ghost colors (subtle) ─────────────────────────────────────────────────────
const GHOST_COLORS = ["#94a3b8","#64748b","#7c9abf","#a0b4c8","#8090a8"];

// ── Component ─────────────────────────────────────────────────────────────────
export default function BiasVarianceViz({ accentColor = "#10b981" }: { accentColor?: string }) {
  const [degree, setDegree]           = useState(3);
  const [showTrue, setShowTrue]       = useState(true);
  const [showGhost, setShowGhost]     = useState(true);
  const [showResiduals, setShowResiduals] = useState(true);
  const vt = useVizTheme();
  const L = useVizLocale(BV_LABELS);

  const mainFn = useMemo(() => polyFit(TRAIN, degree), [degree]);
  const ghostFns = GHOST_FNS[degree - 1];

  // Build SVG paths
  const mainPath = useMemo(() =>
    EVAL_XS.map((x, i) => {
      const y = Math.max(Y_MIN - 0.1, Math.min(Y_MAX + 0.1, mainFn(x)));
      return `${i === 0 ? "M" : "L"}${toSX(x).toFixed(1)},${toSY(y).toFixed(1)}`;
    }).join(" ")
  , [mainFn]);

  const ghostPaths = useMemo(() =>
    ghostFns.map(fn =>
      EVAL_XS.map((x, i) => {
        const y = Math.max(Y_MIN - 0.1, Math.min(Y_MAX + 0.1, fn(x)));
        return `${i === 0 ? "M" : "L"}${toSX(x).toFixed(1)},${toSY(y).toFixed(1)}`;
      }).join(" ")
    )
  , [ghostFns]);

  const truePath = EVAL_XS.map((x, i) => {
    const y = TRUE_FN(x);
    return `${i === 0 ? "M" : "L"}${toSX(x).toFixed(1)},${toSY(y).toFixed(1)}`;
  }).join(" ");

  const curTr  = DECOMP_TRAIN.find(d => d.degree === degree)!;
  const curTe  = DECOMP_TEST.find(d => d.degree === degree)!;
  const curErr = ERRORS.find(e => e.degree === degree)!;
  const optTestMSE = ERRORS[OPT_DEG - 1].testMSE;

  // Diagnosis from actual test-MSE curve — OPT_DEG is the real minimum
  const diagnosis =
    degree < OPT_DEG
      ? { label: L.diagUnderfitting, color: "#ef4444",
          hint: L.diagUnderfittingHint(curErr.testMSE.toFixed(3), optTestMSE.toFixed(3)) }
    : degree === OPT_DEG
      ? { label: L.diagOptimal(OPT_DEG), color: accentColor,
          hint: L.diagOptimalHint(optTestMSE.toFixed(3)) }
    : curErr.testMSE < optTestMSE * 1.25
      ? { label: L.diagGoodBalance, color: accentColor,
          hint: L.diagGoodBalanceHint(curErr.testMSE.toFixed(3)) }
      : { label: L.diagOverfitting, color: "#f59e0b",
          hint: L.diagOverfittingHint(curErr.testMSE.toFixed(3)) };

  return (
    <div className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b flex-wrap gap-2"
        style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: diagnosis.color }}>
            {L.subtitle(degree)}
          </span>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setShowTrue(s => !s)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: showTrue ? "#e9456020" : "transparent",
              color: showTrue ? "#e94560" : "var(--text-muted)",
              border: `1px solid ${showTrue ? "#e9456040" : "var(--border)"}`,
            }}>
            {L.trueFnBtn}
          </button>
          <button onClick={() => setShowGhost(s => !s)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: showGhost ? "#94a3b820" : "transparent",
              color: showGhost ? "#94a3b8" : "var(--text-muted)",
              border: `1px solid ${showGhost ? "#94a3b840" : "var(--border)"}`,
            }}>
            {L.otherDatasetsBtn}
          </button>
          <button onClick={() => setShowResiduals(s => !s)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: showResiduals ? "#3b82f620" : "transparent",
              color: showResiduals ? "#3b82f6" : "var(--text-muted)",
              border: `1px solid ${showResiduals ? "#3b82f640" : "var(--border)"}`,
            }}>
            {L.residualsBtn}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">

        {/* ══ TOP PANEL: fitted curves ══ */}
        <text x={PAD} y={13} fontSize={12} fill={vt.textMuted}>
          {L.fittedCurveLabel}
        </text>

        {/* Grid */}
        {[-1.5, 0, 1.5].map(v => (
          <g key={v}>
            <line x1={PAD} y1={toSY(v)} x2={W - PAD} y2={toSY(v)}
              stroke={vt.grid} strokeWidth={1} />
            <text x={PAD - 5} y={toSY(v) + 4} textAnchor="end" fontSize={12} fill={vt.textMuted}>{v}</text>
          </g>
        ))}

        {/* Ghost curves (variance spread) */}
        {showGhost && ghostPaths.map((p, i) => (
          <path key={`g-${i}`} d={p} fill="none"
            stroke={vt.isDark ? GHOST_COLORS[i] : "#9ca3af"}
            strokeWidth={1.2} opacity={0.45} />
        ))}

        {/* True fn */}
        {showTrue && (
          <path d={truePath} fill="none" stroke="#e94560"
            strokeWidth={2} strokeDasharray="7,4" opacity={0.9} />
        )}

        {/* Main fitted curve */}
        <motion.path
          d={mainPath} fill="none" stroke={accentColor} strokeWidth={2.5}
          animate={{ d: mainPath }}
          transition={{ duration: 0.3 }} />

        {/* ── Residual error lines (sklearn-style) ── */}
        {showResiduals && TRAIN.map((pt, i) => {
          const cy = Math.max(Y_MIN - 0.1, Math.min(Y_MAX + 0.1, mainFn(pt.x)));
          return (
            <line key={`resid-tr-${i}`}
              x1={toSX(pt.x)} y1={toSY(pt.y)}
              x2={toSX(pt.x)} y2={toSY(cy)}
              stroke="#3b82f6" strokeWidth={1.2} opacity={0.45}
            />
          );
        })}
        {showResiduals && TEST.map((pt, i) => {
          const cy = Math.max(Y_MIN - 0.1, Math.min(Y_MAX + 0.1, mainFn(pt.x)));
          return (
            <line key={`resid-te-${i}`}
              x1={toSX(pt.x)} y1={toSY(pt.y)}
              x2={toSX(pt.x)} y2={toSY(cy)}
              stroke="#ef4444" strokeWidth={1.2} opacity={0.5}
            />
          );
        })}

        {/* Degree-1 annotation: show the gap */}
        {degree <= 2 && (
          <g>
            <rect x={PAD} y={toSY(0.8)} width={W - 2 * PAD} height={toSY(-0.8) - toSY(0.8)}
              fill="#ef444406" stroke="#ef444420" strokeWidth={1} strokeDasharray="4,3" />
            <text x={toSX(0.5)} y={toSY(1.2)} textAnchor="middle" fontSize={12} fill={vt.ink("#ef4444")}>
              {L.highBiasAnnotation}
            </text>
          </g>
        )}

        {/* High-variance annotation */}
        {degree >= 9 && showGhost && (
          <text x={toSX(0.85)} y={toSY(1.8)} textAnchor="end" fontSize={12} fill={vt.ink("#f59e0b")}>
            {L.highVarAnnotation}
          </text>
        )}

        {/* Data points — test (red outline), train (blue fill) */}
        {TEST.map((pt, i) => (
          <circle key={`te-${i}`}
            cx={toSX(pt.x)} cy={toSY(pt.y)} r={3.5}
            fill="none" stroke="#ef4444" strokeWidth={1.8} opacity={0.82} />
        ))}
        {TRAIN.map((pt, i) => (
          <circle key={`tr-${i}`}
            cx={toSX(pt.x)} cy={toSY(pt.y)} r={3.5}
            fill="#3b82f6"
            stroke={vt.isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)"}
            strokeWidth={1.2} opacity={0.85} />
        ))}

        {/* Legend */}
        <circle cx={PAD + 6}   cy={H_TOP - 24} r={3.5} fill="#3b82f6" />
        <text   x={PAD + 14}  y={H_TOP - 20}  fontSize={11.5} fill={vt.textMuted}>{L.trainLegend}</text>
        <circle cx={PAD + 50}  cy={H_TOP - 24} r={3.5} fill="none" stroke="#ef4444" strokeWidth={1.8} />
        <text   x={PAD + 58}  y={H_TOP - 20}  fontSize={11.5} fill={vt.textMuted}>{L.testLegend}</text>
        {showTrue && (
          <>
            <line x1={PAD + 94} y1={H_TOP - 24} x2={PAD + 112} y2={H_TOP - 24}
              stroke="#e94560" strokeWidth={2} strokeDasharray="6,3" />
            <text x={PAD + 116} y={H_TOP - 20} fontSize={11.5} fill={vt.ink("#e94560")}>{L.trueFnLegend}</text>
          </>
        )}
        {showGhost && (
          <>
            <line x1={PAD + 158} y1={H_TOP - 24} x2={PAD + 176} y2={H_TOP - 24}
              stroke="#9ca3af" strokeWidth={1.5} />
            <text x={PAD + 180} y={H_TOP - 20} fontSize={11.5} fill={vt.textMuted}>{L.otherDatasetsLegend}</text>
          </>
        )}
        {showResiduals && (
          <>
            <line x1={PAD + 280} y1={H_TOP - 26} x2={PAD + 270} y2={H_TOP - 18}
              stroke="#3b82f6" strokeWidth={1.5} />
            <text x={PAD + 286} y={H_TOP - 20} fontSize={11.5} fill={vt.ink("#3b82f6")}>{L.trainErrLegend}</text>
            <line x1={PAD + 346} y1={H_TOP - 26} x2={PAD + 346} y2={H_TOP - 18}
              stroke="#ef4444" strokeWidth={1.5} />
            <text x={PAD + 352} y={H_TOP - 20} fontSize={11.5} fill={vt.ink("#ef4444")}>{L.testErrLegend}</text>
          </>
        )}

        {/* Axes */}
        <line x1={PAD} y1={CHART_BOT} x2={W - PAD} y2={CHART_BOT} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={30} x2={PAD} y2={CHART_BOT} stroke={vt.axis} strokeWidth={1.5} />
        {[0.25, 0.5, 0.75].map(v => (
          <text key={v} x={toSX(v)} y={CHART_BOT + 12} textAnchor="middle" fontSize={12} fill={vt.textMuted}>{v}</text>
        ))}

        {/* ── DIVIDER ── */}
        <line x1={0} y1={H_TOP + 6} x2={W} y2={H_TOP + 6} stroke={vt.grid} strokeWidth={1} />

        {/* ══ PANEL A: Train MSE vs Test MSE ══ */}
        <text x={PAD} y={MSE_Y0 + 22} fontSize={11.5} fill={vt.textMuted} fontWeight="bold">
          {L.panelATitle}
        </text>
        {/* Panel A legend */}
        <line x1={W - 166} y1={MSE_Y0 + 18} x2={W - 152} y2={MSE_Y0 + 18}
          stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5,3" />
        <circle cx={W - 159} cy={MSE_Y0 + 18} r={2} fill="#3b82f6" />
        <text x={W - 148} y={MSE_Y0 + 22} fontSize={11.5} fill={vt.ink("#3b82f6")}>{L.trainLegend}</text>
        <line x1={W - 104} y1={MSE_Y0 + 18} x2={W - 90} y2={MSE_Y0 + 18}
          stroke="#ef4444" strokeWidth={1.8} />
        <circle cx={W - 97} cy={MSE_Y0 + 18} r={2} fill="#ef4444" />
        <text x={W - 86} y={MSE_Y0 + 22} fontSize={11.5} fill={vt.ink("#ef4444")}>{L.testLegend}</text>

        {/* ── Panel A: zone fills — Underfit / Good Balance / Overfit ── */}
        {/* Underfit zone */}
        <rect x={mseX(1) - 4} y={MSE_Y0 + 36}
          width={mseX(OPT_DEG) - mseX(1) + 4} height={MSE_H}
          fill="#ef4444" opacity={0.05} />
        {/* Good Balance zone — always show at least 1-degree wide around OPT_DEG */}
        {(() => {
          const gEnd = GOOD_DEG > OPT_DEG ? mseX(GOOD_DEG) : mseX(Math.min(OPT_DEG + 1, MAX_DEGREE));
          return (
            <rect x={mseX(OPT_DEG)} y={MSE_Y0 + 36}
              width={gEnd - mseX(OPT_DEG)} height={MSE_H}
              fill={accentColor} opacity={0.10} />
          );
        })()}
        {/* Overfit zone */}
        <rect x={GOOD_DEG > OPT_DEG ? mseX(GOOD_DEG) : mseX(Math.min(OPT_DEG + 1, MAX_DEGREE))} y={MSE_Y0 + 36}
          width={mseX(MAX_DEGREE) - (GOOD_DEG > OPT_DEG ? mseX(GOOD_DEG) : mseX(Math.min(OPT_DEG + 1, MAX_DEGREE))) + 4} height={MSE_H}
          fill="#f59e0b" opacity={0.05} />
        {/* OPT_DEG marker (green dashed) */}
        <line x1={mseX(OPT_DEG)} y1={MSE_Y0 + 36} x2={mseX(OPT_DEG)} y2={MSE_BOT}
          stroke={accentColor} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.7} />
        {/* GOOD_DEG boundary (amber dashed) */}
        {GOOD_DEG > OPT_DEG && (
          <line x1={mseX(GOOD_DEG)} y1={MSE_Y0 + 36} x2={mseX(GOOD_DEG)} y2={MSE_BOT}
            stroke="#f59e0b" strokeWidth={1} strokeDasharray="3,3" opacity={0.55} />
        )}

        {/* ── Panel A: y grid ── */}
        {[0.33, 0.66, 1.0].map(frac => (
          <g key={frac}>
            <line x1={PAD} y1={mseY(maxMSE * frac)} x2={W - PAD} y2={mseY(maxMSE * frac)}
              stroke={vt.grid} strokeWidth={1} />
            <text x={PAD - 3} y={mseY(maxMSE * frac) + 3} textAnchor="end" fontSize={11} fill={vt.textMuted}>
              {(maxMSE * frac).toFixed(2)}
            </text>
          </g>
        ))}

        {/* ── Panel A: Train MSE polyline ── */}
        <polyline
          points={ERRORS.map(e => `${mseX(e.degree).toFixed(1)},${mseY(e.trainMSE).toFixed(1)}`).join(' ')}
          fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5,3" opacity={0.9}
        />
        {/* ── Panel A: Test MSE polyline ── */}
        <polyline
          points={ERRORS.map(e => `${mseX(e.degree).toFixed(1)},${mseY(e.testMSE).toFixed(1)}`).join(' ')}
          fill="none" stroke="#ef4444" strokeWidth={1.8} opacity={0.9}
        />
        {/* ── Panel A: dots ── */}
        {ERRORS.map(e => {
          const active = e.degree === degree;
          return (
            <g key={`md-${e.degree}`}>
              <circle cx={mseX(e.degree)} cy={mseY(e.trainMSE)} r={active ? 4 : 2}
                fill="#3b82f6" opacity={active ? 1 : 0.55}
                stroke={active ? (vt.isDark ? "#0f2244" : "#fff") : "none"} strokeWidth={active ? 1.5 : 0} />
              <circle cx={mseX(e.degree)} cy={mseY(e.testMSE)} r={active ? 4 : 2}
                fill="#ef4444" opacity={active ? 1 : 0.55}
                stroke={active ? (vt.isDark ? "#440f0f" : "#fff") : "none"} strokeWidth={active ? 1.5 : 0} />
            </g>
          );
        })}

        {/* ── Panel A: degree tick labels ── */}
        {DEGREES.map(d => (
          <text key={d} x={mseX(d)} y={MSE_BOT + 11} textAnchor="middle" fontSize={11.5}
            fill={d === degree ? diagnosis.color : d === OPT_DEG ? accentColor : vt.textMuted}
            fontWeight={d === degree || d === OPT_DEG ? "bold" : "normal"}>
            {d === OPT_DEG ? `${d}★` : d}
          </text>
        ))}
        {/* ── Panel A: zone labels ── */}
        {OPT_DEG > 1 && (
          <text x={mseX(Math.ceil(OPT_DEG / 2))} y={MSE_Y0 + 52}
            textAnchor="middle" fontSize={10.5} fill="#ef4444" opacity={0.8}>{L.underfitZone}</text>
        )}
        {GOOD_DEG > OPT_DEG && (
          <text x={mseX(Math.round((OPT_DEG + GOOD_DEG) / 2))} y={MSE_Y0 + 52}
            textAnchor="middle" fontSize={10.5} fill={vt.ink(accentColor)} opacity={0.85}>{L.goodZone}</text>
        )}
        {GOOD_DEG < MAX_DEGREE && (
          <text x={mseX(Math.round((GOOD_DEG + MAX_DEGREE) / 2))} y={MSE_Y0 + 52}
            textAnchor="middle" fontSize={10.5} fill="#f59e0b" opacity={0.8}>{L.overfitZone}</text>
        )}
        {/* ── Panel A: axes ── */}
        <line x1={PAD} y1={MSE_BOT} x2={W - PAD} y2={MSE_BOT} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={MSE_Y0 + 36} x2={PAD} y2={MSE_BOT} stroke={vt.axis} strokeWidth={1.5} />

        {/* ── DIVIDER between panels ── */}
        <line x1={0} y1={BV_Y0 - 6} x2={W} y2={BV_Y0 - 6} stroke={vt.grid} strokeWidth={1} />

        {/* ══ PANEL B: Bias²/Variance — left=Train, right=Test ══ */}
        {/* Left label */}
        <text x={PAD} y={BV_Y0 + 26} fontSize={11.5} fill={vt.textMuted} fontWeight="bold">
          {L.panelBLeft}
        </text>
        {/* Shared legend (center) */}
        <rect x={HALF_W - 52} y={BV_Y0 + 16} width={10} height={10} rx={2} fill="#6c63ff" />
        <text x={HALF_W - 38} y={BV_Y0 + 26} fontSize={12} fill={vt.ink("#6c63ff")}>{L.bias2Legend}</text>
        <rect x={HALF_W + 2} y={BV_Y0 + 16} width={10} height={10} rx={2} fill="#f59e0b" />
        <text x={HALF_W + 16} y={BV_Y0 + 26} fontSize={12} fill={vt.ink("#f59e0b")}>{L.varianceLegend}</text>
        {/* Right label */}
        <text x={W - PAD} y={BV_Y0 + 26} textAnchor="end" fontSize={11.5} fill={vt.textMuted} fontWeight="bold">
          {L.panelBRight}
        </text>
        {/* Center split line */}
        <line x1={HALF_W} y1={BV_Y0 + 32} x2={HALF_W} y2={BV_BOT + 10}
          stroke={vt.grid} strokeWidth={1} strokeDasharray="3,3" />

        {/* Zone fills — left Train panel (CROSS_DEG boundary) */}
        {CROSS_DEG > 1 && (
          <rect x={bvXT(1) - BAR_W_BV} y={BV_Y0 + 36}
            width={bvXT(CROSS_DEG) - bvXT(1) + BAR_W_BV * 0.5} height={BV_H + 4}
            fill="#ef4444" opacity={0.05} />
        )}
        {/* Green balance zone — Train: from OPT_DEG to CROSS_DEG (or ±1 if equal) */}
        {(() => {
          const balStart = bvXT(OPT_DEG) - BAR_W_BV * 0.5;
          const balEnd   = CROSS_DEG > OPT_DEG
            ? bvXT(CROSS_DEG) + BAR_W_BV * 0.5
            : bvXT(Math.min(OPT_DEG + 1, MAX_DEGREE)) + BAR_W_BV * 0.5;
          return (
            <rect x={balStart} y={BV_Y0 + 36}
              width={balEnd - balStart} height={BV_H + 4}
              fill={accentColor} opacity={0.09} />
          );
        })()}
        <rect x={bvXT(CROSS_DEG) + BAR_W_BV * 0.5} y={BV_Y0 + 36}
          width={bvXT(MAX_DEGREE) - bvXT(CROSS_DEG) + BAR_W_BV} height={BV_H + 4}
          fill="#f59e0b" opacity={0.05} />
        <line x1={bvXT(OPT_DEG)} y1={BV_Y0 + 36} x2={bvXT(OPT_DEG)} y2={BV_BOT}
          stroke={accentColor} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.65} />

        {/* Zone fills — right Test panel (CROSS_DEG boundary) */}
        {CROSS_DEG > 1 && (
          <rect x={bvXE(1) - BAR_W_BV} y={BV_Y0 + 36}
            width={bvXE(CROSS_DEG) - bvXE(1) + BAR_W_BV * 0.5} height={BV_H + 4}
            fill="#ef4444" opacity={0.05} />
        )}
        {/* Green balance zone — Test: same bounds as Train */}
        {(() => {
          const balStart = bvXE(OPT_DEG) - BAR_W_BV * 0.5;
          const balEnd   = CROSS_DEG > OPT_DEG
            ? bvXE(CROSS_DEG) + BAR_W_BV * 0.5
            : bvXE(Math.min(OPT_DEG + 1, MAX_DEGREE)) + BAR_W_BV * 0.5;
          return (
            <rect x={balStart} y={BV_Y0 + 36}
              width={balEnd - balStart} height={BV_H + 4}
              fill={accentColor} opacity={0.09} />
          );
        })()}
        <rect x={bvXE(CROSS_DEG) + BAR_W_BV * 0.5} y={BV_Y0 + 36}
          width={bvXE(MAX_DEGREE) - bvXE(CROSS_DEG) + BAR_W_BV} height={BV_H + 4}
          fill="#f59e0b" opacity={0.05} />
        <line x1={bvXE(OPT_DEG)} y1={BV_Y0 + 36} x2={bvXE(OPT_DEG)} y2={BV_BOT}
          stroke={accentColor} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.65} />

        {/* Y grid — left */}
        {[0.5, 1.0].map(frac => (
          <g key={`bvtg-${frac}`}>
            <line x1={PAD} y1={BV_BOT - bvHT(maxBVTr * frac)} x2={HALF_W - 24}
              y2={BV_BOT - bvHT(maxBVTr * frac)} stroke={vt.grid} strokeWidth={1} />
            <text x={PAD - 3} y={BV_BOT - bvHT(maxBVTr * frac) + 3}
              textAnchor="end" fontSize={10.5} fill={vt.textMuted}>
              {(maxBVTr * frac).toFixed(2)}
            </text>
          </g>
        ))}
        {/* Y grid — right */}
        {[0.5, 1.0].map(frac => (
          <g key={`bveg-${frac}`}>
            <line x1={HALF_W + 24} y1={BV_BOT - bvHE(maxBVTe * frac)} x2={W - PAD}
              y2={BV_BOT - bvHE(maxBVTe * frac)} stroke={vt.grid} strokeWidth={1} />
            <text x={HALF_W + 21} y={BV_BOT - bvHE(maxBVTe * frac) + 3}
              textAnchor="end" fontSize={10.5} fill={vt.textMuted}>
              {(maxBVTe * frac).toFixed(2)}
            </text>
          </g>
        ))}

        {/* Train bars */}
        {DECOMP_TRAIN.map(d => {
          const bx     = bvXT(d.degree);
          const hBias  = bvHT(d.bias2);
          const hVar   = bvHT(d.variance);
          const active = d.degree === degree;
          return (
            <g key={`btr-${d.degree}`}>
              <rect x={bx - BAR_W_BV / 2} y={BV_BOT - hBias - hVar} width={BAR_W_BV} height={hBias}
                fill="#6c63ff" opacity={active ? 1 : 0.45} rx={1} />
              <rect x={bx - BAR_W_BV / 2} y={BV_BOT - hVar} width={BAR_W_BV} height={hVar}
                fill="#f59e0b" opacity={active ? 1 : 0.45} rx={1} />
              {active && (
                <rect x={bx - BAR_W_BV / 2 - 1} y={BV_BOT - hBias - hVar - 1}
                  width={BAR_W_BV + 2} height={hBias + hVar + 1}
                  fill="none" stroke={diagnosis.color} strokeWidth={1.5} rx={2} />
              )}
              <text x={bx} y={BV_BOT + 11} textAnchor="middle" fontSize={11}
                fill={active ? diagnosis.color : d.degree === OPT_DEG ? accentColor : vt.textMuted}
                fontWeight={active || d.degree === OPT_DEG ? "bold" : "normal"}>
                {d.degree === OPT_DEG ? `${d.degree}★` : d.degree}
              </text>
            </g>
          );
        })}

        {/* Test bars */}
        {DECOMP_TEST.map(d => {
          const bx     = bvXE(d.degree);
          const hBias  = bvHE(d.bias2);
          const hVar   = bvHE(d.variance);
          const active = d.degree === degree;
          return (
            <g key={`bte-${d.degree}`}>
              <rect x={bx - BAR_W_BV / 2} y={BV_BOT - hBias - hVar} width={BAR_W_BV} height={hBias}
                fill="#6c63ff" opacity={active ? 1 : 0.45} rx={1} />
              <rect x={bx - BAR_W_BV / 2} y={BV_BOT - hVar} width={BAR_W_BV} height={hVar}
                fill="#f59e0b" opacity={active ? 1 : 0.45} rx={1} />
              {active && (
                <rect x={bx - BAR_W_BV / 2 - 1} y={BV_BOT - hBias - hVar - 1}
                  width={BAR_W_BV + 2} height={hBias + hVar + 1}
                  fill="none" stroke={diagnosis.color} strokeWidth={1.5} rx={2} />
              )}
              <text x={bx} y={BV_BOT + 11} textAnchor="middle" fontSize={11}
                fill={active ? diagnosis.color : d.degree === OPT_DEG ? accentColor : vt.textMuted}
                fontWeight={active || d.degree === OPT_DEG ? "bold" : "normal"}>
                {d.degree === OPT_DEG ? `${d.degree}★` : d.degree}
              </text>
            </g>
          );
        })}

        {/* BV axes — left */}
        <line x1={PAD} y1={BV_BOT} x2={HALF_W - 24} y2={BV_BOT} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={BV_Y0 + 36} x2={PAD} y2={BV_BOT} stroke={vt.axis} strokeWidth={1.5} />
        {/* BV axes — right */}
        <line x1={HALF_W + 24} y1={BV_BOT} x2={W - PAD} y2={BV_BOT} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={HALF_W + 24} y1={BV_Y0 + 36} x2={HALF_W + 24} y2={BV_BOT} stroke={vt.axis} strokeWidth={1.5} />

        {/* Footer formula */}
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={12} fill={vt.textMuted}>
          {L.footerFormula(OPT_DEG)}
        </text>

      </svg>

      {/* ── Slider ── */}
      <div className="px-5 pt-2 pb-3 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs w-24" style={{ color: "var(--text-muted)" }}>
            {L.degreeLabel}{" "}
            <span className="font-mono font-bold" style={{ color: accentColor }}>{degree}</span>
          </span>
          <input type="range" min={1} max={MAX_DEGREE} step={1} value={degree}
            onChange={e => setDegree(parseInt(e.target.value))}
            className="flex-1" style={{ accentColor: diagnosis.color }} />
        </div>
        <motion.div
          key={diagnosis.label}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            backgroundColor: `${diagnosis.color}12`,
            border: `1px solid ${diagnosis.color}30`,
          }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: diagnosis.color }} />
          <span className="text-xs font-semibold" style={{ color: diagnosis.color }}>{diagnosis.label}</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>— {diagnosis.hint}</span>
        </motion.div>
      </div>

      {/* ── Stats footer ── */}
      <div className="grid grid-cols-6 border-t text-center" style={{ borderColor: "var(--border)" }}>
        {[
          { label: L.statDegree,     value: degree.toString(),          color: accentColor },
          { label: L.statTrainBias2, value: curTr.bias2.toFixed(3),    color: "#6c63ff" },
          { label: L.statTrainVar,   value: curTr.variance.toFixed(3), color: "#f59e0b" },
          { label: L.statTestBias2,  value: curTe.bias2.toFixed(3),    color: "#6c63ff" },
          { label: L.statTestVar,    value: curTe.variance.toFixed(3), color: "#f59e0b" },
          { label: L.statTestMSE,    value: curErr.testMSE.toFixed(3), color: diagnosis.color },
        ].map(({ label, value, color }) => (
          <div key={label} className="py-2">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
            <div className="text-sm font-bold font-mono" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
