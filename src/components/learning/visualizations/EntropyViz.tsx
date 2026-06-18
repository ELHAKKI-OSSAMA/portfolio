"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";
import { useVizTheme } from "@/hooks/useVizTheme";

// ── i18n labels ────────────────────────────────────────────────────────────────
const EV_LABELS = {
  en: {
    title: "Entropy & Information",
    tabs: { entropy: "Entropy", crossentropy: "Cross-Entropy", kl: "KL Divergence" } as Record<string,string>,
    entropyLabels: { uniform: "Uniform", biased: "Biased", certain: "Certain", twopeaks: "Two peaks", skewed: "Skewed" } as Record<string,string>,
    ceLabels: { good: "Good model", wrong: "Wrong class", uncertain: "Uncertain", overconfident: "Overconfident wrong" } as Record<string,string>,
    klLabels: { same: "Same", shifted: "Shifted", wider: "Wider", narrow: "Narrow" } as Record<string,string>,
    ceClasses: ["Cat", "Dog", "Bird", "Fish"],
    uniformLine: "1/6 uniform",
    yAxisProb: "Probability",
    ceGroundTruth: "P (ground truth)",
    ceModel: "Q (model)",
    klFormula: "KL(P‖Q) = Σ P(x) log(P(x)/Q(x)) — always ≥ 0, equals 0 only when P=Q",
    insightLabel: "Information theory:",
    insightBody: "Entropy measures uncertainty. Cross-entropy is the loss function for classifiers — minimising it forces Q → P. KL divergence measures how far Q is from P — used in VAEs and RLHF.",
  },
  fr: {
    title: "Entropie & Information",
    tabs: { entropy: "Entropie", crossentropy: "Entropie Croisée", kl: "Divergence KL" } as Record<string,string>,
    entropyLabels: { uniform: "Uniforme", biased: "Biaisé", certain: "Certain", twopeaks: "Deux pics", skewed: "Asymétrique" } as Record<string,string>,
    ceLabels: { good: "Bon modèle", wrong: "Mauvaise classe", uncertain: "Incertain", overconfident: "Trop confiant erroné" } as Record<string,string>,
    klLabels: { same: "Identique", shifted: "Décalé", wider: "Plus large", narrow: "Étroit" } as Record<string,string>,
    ceClasses: ["Chat", "Chien", "Oiseau", "Poisson"],
    uniformLine: "1/6 uniforme",
    yAxisProb: "Probabilité",
    ceGroundTruth: "P (vérité terrain)",
    ceModel: "Q (modèle)",
    klFormula: "KL(P‖Q) = Σ P(x) log(P(x)/Q(x)) — toujours ≥ 0, nul ssi P=Q",
    insightLabel: "Théorie de l'information :",
    insightBody: "L'entropie mesure l'incertitude. L'entropie croisée est la perte des classifieurs — la minimiser force Q → P. La divergence KL mesure l'écart de Q par rapport à P — VAE et RLHF.",
  },
  ar: {
    title: "الإنتروبيا والمعلومات",
    tabs: { entropy: "الإنتروبيا", crossentropy: "الإنتروبيا التقاطعية", kl: "تباين KL" } as Record<string,string>,
    entropyLabels: { uniform: "موحد", biased: "متحيز", certain: "يقيني", twopeaks: "قمتان", skewed: "منحرف" } as Record<string,string>,
    ceLabels: { good: "نموذج جيد", wrong: "فئة خاطئة", uncertain: "غير متأكد", overconfident: "ثقة مفرطة وخطأ" } as Record<string,string>,
    klLabels: { same: "متطابق", shifted: "مُزاح", wider: "أوسع", narrow: "ضيق" } as Record<string,string>,
    ceClasses: ["قطة", "كلب", "طائر", "سمكة"],
    uniformLine: "1/6 موحد",
    yAxisProb: "الاحتمال",
    ceGroundTruth: "P (الحقيقة)",
    ceModel: "Q (النموذج)",
    klFormula: "KL(P‖Q) = Σ P(x) log(P(x)/Q(x)) — دائماً ≥ 0، يساوي 0 فقط عند P=Q",
    insightLabel: "نظرية المعلومات:",
    insightBody: "الإنتروبيا تقيس عدم اليقين. الإنتروبيا التقاطعية هي دالة خسارة المصنفات — تقليلها يجبر Q → P. تباين KL يقيس بُعد Q عن P — VAEs وRLHF.",
  },
} as const;

// ── Constants ──────────────────────────────────────────────────────────────────
const W = 520;
const H_ENTROPY = 200;
const H_CROSS = 180;
const H_KL = 200;

const BLUE = "#06b6d4";
const MAX_ENTROPY_6 = Math.log2(6); // ≈2.5849

// ── Math helpers ───────────────────────────────────────────────────────────────
function safeLog2(x: number): number {
  return x <= 0 ? 0 : Math.log2(x);
}
function safeLn(x: number): number {
  return x <= 0 ? 0 : Math.log(x);
}

function entropy(p: number[]): number {
  return -p.reduce((acc, pi) => acc + pi * safeLog2(pi), 0);
}

function crossEntropy(p: number[], q: number[]): number {
  return -p.reduce((acc, pi, i) => acc + pi * safeLog2(Math.max(q[i], 1e-10)), 0);
}

function klDivergence(p: number[], q: number[]): number {
  return p.reduce((acc, pi, i) => {
    if (pi <= 0) return acc;
    return acc + pi * safeLn(pi / Math.max(q[i], 1e-10));
  }, 0);
}

// ── Normal PDF ─────────────────────────────────────────────────────────────────
function normalPDF(x: number, mu: number, sigma: number): number {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

// ── Entropy color (red=0 → green=log2(6)) ──────────────────────────────────────
function entropyColor(h: number, maxH: number): string {
  const t = Math.min(h / maxH, 1);
  const r = Math.round(255 * (1 - t));
  const g = Math.round(200 * t);
  return `rgb(${r},${g},40)`;
}

// ── KL color (green≈0 → red for large) ────────────────────────────────────────
function klColor(kl: number): string {
  const t = Math.min(kl / 3, 1);
  const r = Math.round(255 * t);
  const g = Math.round(34 + (200 - 34) * (1 - t));
  return `rgb(${r},${g},40)`;
}

// ── Cross-entropy color ────────────────────────────────────────────────────────
function ceColor(ce: number): string {
  if (ce < 1) return "#22c55e";
  if (ce < 3) return "#f97316";
  return "#ff6b6b";
}

type TabType = "entropy" | "crossentropy" | "kl";

// ── Entropy presets ────────────────────────────────────────────────────────────
type EntropyPreset = "uniform" | "biased" | "certain" | "twopeaks" | "skewed";

const ENTROPY_PRESETS: Record<EntropyPreset, { label: string; dist: number[] }> = {
  uniform: { label: "Uniform", dist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6] },
  biased: { label: "Biased", dist: [0.5, 0.2, 0.15, 0.08, 0.05, 0.02] },
  certain: { label: "Certain", dist: [1, 0, 0, 0, 0, 0] },
  twopeaks: { label: "Two peaks", dist: [0.4, 0.05, 0.05, 0.05, 0.4, 0.05] },
  skewed: { label: "Skewed", dist: [0.6, 0.2, 0.1, 0.05, 0.03, 0.02] },
};

// ── Cross-entropy presets ──────────────────────────────────────────────────────
type CEPreset = "good" | "wrong" | "uncertain" | "overconfident";

const CE_PRESETS: Record<CEPreset, { label: string; p: number[]; q: number[]; note: string }> = {
  good: {
    label: "Good model",
    p: [1, 0, 0, 0],
    q: [0.85, 0.08, 0.05, 0.02],
    note: "loss low",
  },
  wrong: {
    label: "Wrong class",
    p: [1, 0, 0, 0],
    q: [0.05, 0.80, 0.10, 0.05],
    note: "loss high",
  },
  uncertain: {
    label: "Uncertain",
    p: [1, 0, 0, 0],
    q: [0.35, 0.30, 0.20, 0.15],
    note: "loss medium",
  },
  overconfident: {
    label: "Overconfident wrong",
    p: [0, 1, 0, 0],
    q: [0.95, 0.02, 0.02, 0.01],
    note: "loss very high",
  },
};

const CE_CLASSES = ["Cat", "Dog", "Bird", "Fish"];

// ── KL presets ────────────────────────────────────────────────────────────────
type KLPreset = "same" | "shifted" | "wider" | "narrow";

const KL_PRESETS: Record<KLPreset, { label: string; mu: number; sigma: number; klApprox: string }> = {
  same: { label: "Same", mu: 0, sigma: 1, klApprox: "≈0.00" },
  shifted: { label: "Shifted", mu: 2, sigma: 1, klApprox: "≈2.00" },
  wider: { label: "Wider", mu: 0, sigma: 2, klApprox: "≈0.19" },
  narrow: { label: "Narrow", mu: 0, sigma: 0.5, klApprox: "≈0.84" },
};

// ── Numeric KL for two Normals (sampling) ─────────────────────────────────────
function computeKLNormal(mu1: number, s1: number, mu2: number, s2: number): number {
  const n = 200;
  const xMin = -6;
  const xMax = 6;
  let kl = 0;
  for (let i = 0; i < n; i++) {
    const x = xMin + (i / (n - 1)) * (xMax - xMin);
    const p = normalPDF(x, mu1, s1);
    const q = normalPDF(x, mu2, s2);
    if (p > 1e-10) {
      kl += p * Math.log(p / Math.max(q, 1e-10)) * ((xMax - xMin) / n);
    }
  }
  return Math.max(kl, 0);
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function EntropyViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(EV_LABELS);
  const [tab, setTab] = useState<TabType>("entropy");
  const [entropyPreset, setEntropyPreset] = useState<EntropyPreset>("uniform");
  const [cePreset, setCePreset] = useState<CEPreset>("good");
  const [klPreset, setKlPreset] = useState<KLPreset>("same");

  // ── Entropy computations ───────────────────────────────────────────────────
  const entropyData = useMemo(() => {
    const dist = ENTROPY_PRESETS[entropyPreset].dist;
    const h = entropy(dist);
    return { dist, h };
  }, [entropyPreset]);

  // ── Cross-entropy computations ─────────────────────────────────────────────
  const ceData = useMemo(() => {
    const { p, q } = CE_PRESETS[cePreset];
    const hp = entropy(p);
    const hpq = crossEntropy(p, q);
    const kl = hpq - hp;
    return { p, q, hp, hpq, kl };
  }, [cePreset]);

  // ── KL computations ────────────────────────────────────────────────────────
  const klData = useMemo(() => {
    const { mu, sigma } = KL_PRESETS[klPreset];
    const p = { mu: 0, sigma: 1 };
    const kl = computeKLNormal(p.mu, p.sigma, mu, sigma);
    // Build paths for SVG
    const n = 200;
    const xMin = -5;
    const xMax = 5;
    const PAD_L = 44;
    const PAD_R = 12;
    const PAD_T = 18;
    const PAD_B = 30;
    const plotW = W - PAD_L - PAD_R;
    const plotH = H_KL - PAD_T - PAD_B;
    const x0 = PAD_L;
    const y1 = PAD_T + plotH;
    const yMax = 0.6;

    function sx(x: number): number {
      return x0 + ((x - xMin) / (xMax - xMin)) * plotW;
    }
    function sy(y: number): number {
      return y1 - (y / yMax) * plotH;
    }

    const xVals = Array.from({ length: n }, (_, i) => xMin + (i / (n - 1)) * (xMax - xMin));

    const pVals = xVals.map(x => normalPDF(x, p.mu, p.sigma));
    const qVals = xVals.map(x => normalPDF(x, mu, sigma));

    // Filled area for P
    const pFill =
      `M${sx(xVals[0]).toFixed(1)},${y1} ` +
      xVals.map((x, i) => `L${sx(x).toFixed(1)},${sy(Math.min(pVals[i], yMax)).toFixed(1)}`).join(" ") +
      ` L${sx(xVals[n - 1]).toFixed(1)},${y1} Z`;

    // Line for Q
    const qLine = xVals
      .map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(Math.min(qVals[i], yMax)).toFixed(1)}`)
      .join(" ");

    return { kl, pFill, qLine, x0, y1, plotH, PAD_T, PAD_L, PAD_R, PAD_B };
  }, [klPreset]);

  // ── Entropy SVG layout ─────────────────────────────────────────────────────
  const ENT_PAD_L = 44;
  const ENT_PAD_R = 12;
  const ENT_PAD_T = 18;
  const ENT_PAD_B = 32;
  const entChartW = W - ENT_PAD_L - ENT_PAD_R;
  const entChartH = H_ENTROPY - ENT_PAD_T - ENT_PAD_B;
  const entX0 = ENT_PAD_L;
  const entY1 = ENT_PAD_T + entChartH;
  const entBarW = entChartW / 6 * 0.55;

  // ── Cross-entropy SVG layout ───────────────────────────────────────────────
  const CE_PAD_L = 44;
  const CE_PAD_R = 12;
  const CE_PAD_T = 18;
  const CE_PAD_B = 30;
  const ceChartW = W - CE_PAD_L - CE_PAD_R;
  const ceChartH = H_CROSS - CE_PAD_T - CE_PAD_B;
  const ceX0 = CE_PAD_L;
  const ceY1 = CE_PAD_T + ceChartH;
  const ceGroupW = ceChartW / 4;
  const ceBarW = ceGroupW * 0.3;

  // ── KL SVG layout ──────────────────────────────────────────────────────────
  const KL_PAD_L = 44;
  const KL_PAD_T = 18;
  const KL_PAD_B = 30;
  const klPlotH = H_KL - KL_PAD_T - KL_PAD_B;
  const klY1 = KL_PAD_T + klPlotH;
  const klX0 = KL_PAD_L;

  return (
    <VizCard>
      {/* ── Header / tab buttons ── */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b flex-wrap gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {L.title}
        </span>
        <div className="flex items-center gap-2">
          {(["entropy", "crossentropy", "kl"] as TabType[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: tab === t ? `${accentColor}22` : "transparent",
                color: tab === t ? accentColor : vt.textMuted,
                border: `1px solid ${tab === t ? `${accentColor}55` : vt.border}`,
              }}
            >
              {L.tabs[t]}
            </button>
          ))}
        </div>
      </div>

      {/* ── ENTROPY TAB ── */}
      {tab === "entropy" && (
        <>
          {/* Controls + H value */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b flex-wrap gap-2"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              {(Object.keys(ENTROPY_PRESETS) as EntropyPreset[]).map(key => (
                <button
                  key={key}
                  onClick={() => setEntropyPreset(key)}
                  className="px-2 py-0.5 rounded-md text-xs font-medium transition-all"
                  style={{
                    backgroundColor: entropyPreset === key ? `${accentColor}22` : "transparent",
                    color: entropyPreset === key ? accentColor : vt.textMuted,
                    border: `1px solid ${entropyPreset === key ? `${accentColor}55` : vt.border}`,
                  }}
                >
                  {L.entropyLabels[key]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono" style={{ color: vt.textMuted }}>H =</span>
              <span
                className="text-lg font-bold font-mono"
                style={{ color: entropyColor(entropyData.h, MAX_ENTROPY_6) }}
              >
                {entropyData.h.toFixed(2)}
              </span>
              <span className="text-xs font-mono" style={{ color: vt.textMuted }}>bits</span>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H_ENTROPY}`} className="w-full">
            {/* Y grid */}
            {[0, 0.25, 0.5, 0.75, 1].map(tick => {
              const cy = entY1 - tick * entChartH;
              return (
                <g key={tick}>
                  <line x1={entX0} y1={cy} x2={entX0 + entChartW} y2={cy} stroke={vt.grid} strokeWidth={1} />
                  <text x={entX0 - 3} y={cy + 3} fontSize={9} fill={vt.textMuted} textAnchor="end">
                    {tick.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Uniform baseline dashed */}
            {(() => {
              const uniformY = entY1 - (1 / 6) * entChartH;
              return (
                <line
                  x1={entX0}
                  y1={uniformY}
                  x2={entX0 + entChartW}
                  y2={uniformY}
                  stroke={vt.gridStrong}
                  strokeWidth={1}
                  strokeDasharray="5,3"
                />
              );
            })()}
            <text
              x={entX0 + entChartW - 2}
              y={entY1 - (1 / 6) * entChartH - 3}
              fontSize={8}
              fill={vt.textMuted}
              textAnchor="end"
            >
              {L.uniformLine}
            </text>

            {/* Axes */}
            <line x1={entX0} y1={ENT_PAD_T} x2={entX0} y2={entY1} stroke={vt.axis} strokeWidth={1.5} />
            <line x1={entX0} y1={entY1} x2={entX0 + entChartW} y2={entY1} stroke={vt.axis} strokeWidth={1.5} />

            {/* Bars */}
            {entropyData.dist.map((p, i) => {
              const barH = p * entChartH;
              const bx = entX0 + i * (entChartW / 6) + (entChartW / 6 - entBarW) / 2;
              const by = entY1 - barH;
              return (
                <motion.g
                  key={`ent-bar-${entropyPreset}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <rect
                    x={bx}
                    y={by}
                    width={entBarW}
                    height={barH}
                    rx={3}
                    fill={accentColor}
                    opacity={0.8}
                  />
                  <text
                    x={bx + entBarW / 2}
                    y={entY1 + 13}
                    textAnchor="middle"
                    fontSize={10}
                    fill={vt.textMuted}
                  >
                    {i + 1}
                  </text>
                  {p > 0.05 && (
                    <text
                      x={bx + entBarW / 2}
                      y={by - 3}
                      textAnchor="middle"
                      fontSize={8}
                      fill={vt.ink(accentColor)}
                    >
                      {p.toFixed(2)}
                    </text>
                  )}
                </motion.g>
              );
            })}

            {/* Y axis label */}
            <text
              x={10}
              y={ENT_PAD_T + entChartH / 2}
              fontSize={9}
              fill={vt.textMuted}
              textAnchor="middle"
              transform={`rotate(-90, 10, ${ENT_PAD_T + entChartH / 2})`}
            >
              P(x)
            </text>
          </svg>
        </>
      )}

      {/* ── CROSS-ENTROPY TAB ── */}
      {tab === "crossentropy" && (
        <>
          {/* Controls + CE value */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b flex-wrap gap-2"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              {(Object.keys(CE_PRESETS) as CEPreset[]).map(key => (
                <button
                  key={key}
                  onClick={() => setCePreset(key)}
                  className="px-2 py-0.5 rounded-md text-xs font-medium transition-all"
                  style={{
                    backgroundColor: cePreset === key ? `${accentColor}22` : "transparent",
                    color: cePreset === key ? accentColor : vt.textMuted,
                    border: `1px solid ${cePreset === key ? `${accentColor}55` : vt.border}`,
                  }}
                >
                  {L.ceLabels[key]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-mono" style={{ color: vt.textMuted }}>H(P,Q)</div>
                <div className="text-base font-bold font-mono" style={{ color: ceColor(ceData.hpq) }}>
                  {ceData.hpq.toFixed(3)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono" style={{ color: vt.textMuted }}>H(P)</div>
                <div className="text-sm font-bold font-mono" style={{ color: vt.textMuted }}>
                  {ceData.hp.toFixed(3)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono" style={{ color: vt.textMuted }}>KL(P‖Q)</div>
                <div className="text-sm font-bold font-mono" style={{ color: klColor(ceData.kl) }}>
                  {ceData.kl.toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H_CROSS}`} className="w-full">
            {/* Y grid */}
            {[0, 0.25, 0.5, 0.75, 1].map(tick => {
              const cy = ceY1 - tick * ceChartH;
              return (
                <g key={tick}>
                  <line x1={ceX0} y1={cy} x2={ceX0 + ceChartW} y2={cy} stroke={vt.grid} strokeWidth={1} />
                  <text x={ceX0 - 3} y={cy + 3} fontSize={9} fill={vt.textMuted} textAnchor="end">
                    {tick.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1={ceX0} y1={CE_PAD_T} x2={ceX0} y2={ceY1} stroke={vt.axis} strokeWidth={1.5} />
            <line x1={ceX0} y1={ceY1} x2={ceX0 + ceChartW} y2={ceY1} stroke={vt.axis} strokeWidth={1.5} />

            {/* Y axis label */}
            <text
              x={10}
              y={CE_PAD_T + ceChartH / 2}
              fontSize={9}
              fill={vt.textMuted}
              textAnchor="middle"
              transform={`rotate(-90, 10, ${CE_PAD_T + ceChartH / 2})`}
            >
              {L.yAxisProb}
            </text>

            {/* Grouped bars: P (blue) and Q (accent) */}
            {CE_CLASSES.map((cls, i) => {
              const groupCenterX = ceX0 + i * ceGroupW + ceGroupW / 2;
              const pBarX = groupCenterX - ceBarW - 1.5;
              const qBarX = groupCenterX + 1.5;
              const pVal = ceData.p[i];
              const qVal = ceData.q[i];
              return (
                <g key={`ce-group-${i}`}>
                  {/* P bar */}
                  <motion.g
                    key={`ce-p-${cePreset}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <rect
                      x={pBarX}
                      y={ceY1 - pVal * ceChartH}
                      width={ceBarW}
                      height={pVal * ceChartH}
                      rx={2}
                      fill={BLUE}
                      opacity={0.8}
                    />
                  </motion.g>

                  {/* Q bar */}
                  <motion.g
                    key={`ce-q-${cePreset}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 + 0.03 }}
                  >
                    <rect
                      x={qBarX}
                      y={ceY1 - qVal * ceChartH}
                      width={ceBarW}
                      height={qVal * ceChartH}
                      rx={2}
                      fill={accentColor}
                      opacity={0.8}
                    />
                  </motion.g>

                  {/* X label */}
                  <text
                    x={groupCenterX}
                    y={ceY1 + 14}
                    textAnchor="middle"
                    fontSize={10}
                    fill={vt.textMuted}
                  >
                    {L.ceClasses[i]}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <rect x={ceX0 + 4} y={CE_PAD_T + 2} width={10} height={10} rx={2} fill={BLUE} opacity={0.8} />
            <text x={ceX0 + 18} y={CE_PAD_T + 11} fontSize={9} fill={vt.textMuted}>{L.ceGroundTruth}</text>
            <rect x={ceX0 + 110} y={CE_PAD_T + 2} width={10} height={10} rx={2} fill={accentColor} opacity={0.8} />
            <text x={ceX0 + 124} y={CE_PAD_T + 11} fontSize={9} fill={vt.textMuted}>{L.ceModel}</text>
          </svg>
        </>
      )}

      {/* ── KL TAB ── */}
      {tab === "kl" && (
        <>
          {/* Controls + KL value */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b flex-wrap gap-2"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              {(Object.keys(KL_PRESETS) as KLPreset[]).map(key => (
                <button
                  key={key}
                  onClick={() => setKlPreset(key)}
                  className="px-2 py-0.5 rounded-md text-xs font-medium transition-all"
                  style={{
                    backgroundColor: klPreset === key ? `${accentColor}22` : "transparent",
                    color: klPreset === key ? accentColor : vt.textMuted,
                    border: `1px solid ${klPreset === key ? `${accentColor}55` : vt.border}`,
                  }}
                >
                  {L.klLabels[key]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono" style={{ color: vt.textMuted }}>KL(P‖Q) =</span>
              <span
                className="text-lg font-bold font-mono"
                style={{ color: klColor(klData.kl) }}
              >
                {klData.kl.toFixed(3)}
              </span>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H_KL}`} className="w-full">
            {/* Y grid */}
            {[0.1, 0.2, 0.3, 0.4, 0.5].map(tick => {
              const cy = klY1 - (tick / 0.6) * klPlotH;
              return (
                <g key={tick}>
                  <line x1={klX0} y1={cy} x2={W - 12} y2={cy} stroke={vt.grid} strokeWidth={1} />
                  <text x={klX0 - 3} y={cy + 3} fontSize={9} fill={vt.textMuted} textAnchor="end">
                    {tick.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1={klX0} y1={KL_PAD_T} x2={klX0} y2={klY1} stroke={vt.axis} strokeWidth={1.5} />
            <line x1={klX0} y1={klY1} x2={W - 12} y2={klY1} stroke={vt.axis} strokeWidth={1.5} />

            {/* X axis ticks */}
            {[-4, -2, 0, 2, 4].map(tick => {
              const cx = klX0 + ((tick + 5) / 10) * (W - 12 - klX0);
              return (
                <g key={tick}>
                  <line x1={cx} y1={klY1} x2={cx} y2={klY1 + 3} stroke={vt.axis} strokeWidth={1} />
                  <text x={cx} y={klY1 + 12} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* P filled area */}
            <motion.path
              key={`kl-p-fill-${klPreset}`}
              d={klData.pFill}
              fill={BLUE}
              opacity={0.25}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ duration: 0.3 }}
            />

            {/* P border line */}
            <motion.path
              key={`kl-p-line-${klPreset}`}
              d={klData.pFill.replace(/ Z$/, "").replace(/^M[^ ]+ L/, "M").replace(/ L[^ ]+ Z$/, "")}
              fill="none"
              stroke={BLUE}
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Q line */}
            <motion.path
              key={`kl-q-line-${klPreset}`}
              d={klData.qLine}
              fill="none"
              stroke={accentColor}
              strokeWidth={2.5}
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />

            {/* Legend */}
            <rect x={klX0 + 4} y={KL_PAD_T + 2} width={20} height={10} rx={2} fill={BLUE} opacity={0.5} />
            <text x={klX0 + 28} y={KL_PAD_T + 11} fontSize={9} fill={vt.textMuted}>P (μ=0, σ=1)</text>
            <line
              x1={klX0 + 120}
              y1={KL_PAD_T + 7}
              x2={klX0 + 140}
              y2={KL_PAD_T + 7}
              stroke={accentColor}
              strokeWidth={2.5}
            />
            <text x={klX0 + 144} y={KL_PAD_T + 11} fontSize={9} fill={vt.textMuted}>
              Q (μ={KL_PRESETS[klPreset].mu}, σ={KL_PRESETS[klPreset].sigma})
            </text>

            {/* Formula reminder */}
            <text x={W / 2} y={klY1 + 24} textAnchor="middle" fontSize={9} fill={vt.textFaint}>
              {L.klFormula}
            </text>
          </svg>
        </>
      )}

      {/* ── Global insight bar ── */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="px-4 py-2 border-t"
        style={{ borderColor: "var(--border)", backgroundColor: vt.surface }}
      >
        <p className="text-xs" style={{ color: vt.textMuted }}>
          <span style={{ color: accentColor, fontWeight: 600 }}>{L.insightLabel}</span>{" "}
          {L.insightBody}
        </p>
      </motion.div>
    </VizCard>
  );
}
