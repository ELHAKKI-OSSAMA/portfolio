"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const PD_LABELS = {
  en: {
    title: "Partial Dependence Plot",
    showICE: "Show ICE curves",
    hideICE: "Hide ICE curves",
    yLabel: "Predicted output",
    pdpLegend: "PDP (average)",
    iceLegend: "ICE (per sample)",
    insight: (feat: string) =>
      `PDP marginalizes over all other features — shows average effect of ${feat} on prediction. ICE curves show per-sample effects; divergence from PDP reveals interaction effects.`,
    featureLabels: ["Income (€k)", "Age (years)", "Credit Score"] as readonly string[],
  },
  fr: {
    title: "Tracé de Dépendance Partielle",
    showICE: "Afficher les courbes ICE",
    hideICE: "Masquer les courbes ICE",
    yLabel: "Sortie prédite",
    pdpLegend: "PDP (moyenne)",
    iceLegend: "ICE (par échantillon)",
    insight: (feat: string) =>
      `Le PDP marginalise sur toutes les autres caractéristiques — montre l'effet moyen de ${feat} sur la prédiction. Les courbes ICE montrent les effets par échantillon ; la divergence par rapport au PDP révèle des effets d'interaction.`,
    featureLabels: ["Revenu (k€)", "Âge (années)", "Score de crédit"] as readonly string[],
  },
  ar: {
    title: "مخطط الاعتمادية الجزئية",
    showICE: "إظهار منحنيات ICE",
    hideICE: "إخفاء منحنيات ICE",
    yLabel: "الإخراج المتوقع",
    pdpLegend: "PDP (متوسط)",
    iceLegend: "ICE (لكل عينة)",
    insight: (feat: string) =>
      `يُهمِّش PDP على جميع الميزات الأخرى — يُظهر التأثير المتوسط لـ ${feat} على التنبؤ. تُظهر منحنيات ICE التأثيرات لكل عينة؛ الاختلاف عن PDP يكشف تأثيرات التفاعل.`,
    featureLabels: ["الدخل (k€)", "العمر (سنوات)", "نقاط الائتمان"] as readonly string[],
  },
} as const;

const W = 520, H = 200;
const PAD = { l:44, r:24, t:20, b:36 };
const PW = W - PAD.l - PAD.r, PH = H - PAD.t - PAD.b;

const N = 50; // x points

// Simulate PDP + ICE curves for 3 features
function buildCurves(featureIdx: number) {
  const pdp: number[] = [];
  const ice: number[][] = [];
  const nIce = 12;

  for (let i = 0; i < N; i++) {
    const x = i / (N - 1);
    // Different PDP shapes per feature
    let base = 0;
    if (featureIdx === 0) base = 2.5 * x - 1.2 * x * x + 0.3 * Math.sin(5 * x);
    if (featureIdx === 1) base = -0.8 + 2.2 * Math.exp(-3 * (x - 0.7) ** 2);
    if (featureIdx === 2) base = 1.5 * x * (1 - x) * 4;
    pdp.push(base);
  }

  for (let j = 0; j < nIce; j++) {
    const offset  = (j / nIce - 0.5) * 0.8;
    const stretch = 0.7 + (j / nIce) * 0.6;
    const curve   = pdp.map(v => v * stretch + offset + (Math.random() - 0.5) * 0.06);
    ice.push(curve);
  }

  return { pdp, ice };
}

const FEATURES = [
  { name:"income",       unit:"€k",  label:"Income (€k)",       xRange:["20k","100k"] },
  { name:"age",          unit:"yrs", label:"Age (years)",        xRange:["20","70"] },
  { name:"credit_score", unit:"",    label:"Credit Score",       xRange:["300","850"] },
];

function vToSVG(v: number, minV: number, maxV: number) {
  return PAD.t + PH - ((v - minV) / (maxV - minV || 1)) * PH;
}

function iToSVG(i: number) {
  return PAD.l + (i / (N - 1)) * PW;
}

export default function PartialDependenceViz({ accentColor = "#8b5cf6" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(PD_LABELS);
  const [featIdx, setFeatIdx] = useState(0);
  const [showICE, setShowICE] = useState(false);

  const { pdp, ice } = useMemo(() => buildCurves(featIdx), [featIdx]);
  const feat = FEATURES[featIdx];

  const allVals = showICE ? [...pdp, ...ice.flat()] : pdp;
  const minV    = Math.min(...allVals);
  const maxV    = Math.max(...allVals);

  function toPath(vals: number[]) {
    return vals.map((v, i) => `${i===0?"M":"L"}${iToSVG(i).toFixed(1)},${vToSVG(v,minV,maxV).toFixed(1)}`).join(" ");
  }

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {L.title} — {L.featureLabels[featIdx]}
        </span>
        <button onClick={() => setShowICE(v=>!v)}
          className="px-3 py-1 rounded-lg text-xs font-semibold"
          style={{ backgroundColor:showICE?`${accentColor}22`:"transparent", color:showICE?accentColor:vt.textMuted, border:`1px solid ${showICE?accentColor+"55":"var(--border)"}` }}>
          {showICE ? L.hideICE : L.showICE}
        </button>
      </div>

      {/* feature tabs */}
      <div className="flex gap-1 px-5 pt-3">
        {FEATURES.map((f, i) => (
          <button key={f.name} onClick={() => setFeatIdx(i)}
            className="flex-1 py-1 rounded-lg text-xs font-semibold"
            style={{ backgroundColor:featIdx===i?`${accentColor}22`:"transparent", color:featIdx===i?accentColor:vt.textMuted, border:`1px solid ${featIdx===i?accentColor+"55":"var(--border)"}` }}>
            {f.name}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* grid */}
        {[0,0.25,0.5,0.75,1].map(f => (
          <line key={f} x1={PAD.l} y1={PAD.t + f*PH} x2={W-PAD.r} y2={PAD.t + f*PH} stroke={vt.grid} strokeWidth={1} />
        ))}
        {/* zero line */}
        {minV < 0 && maxV > 0 && (
          <line x1={PAD.l} y1={vToSVG(0,minV,maxV)} x2={W-PAD.r} y2={vToSVG(0,minV,maxV)}
            stroke={vt.gridStrong} strokeWidth={1} strokeDasharray="4,3" />
        )}
        {/* axes */}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t+PH} stroke={vt.axis} strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t+PH} x2={W-PAD.r} y2={PAD.t+PH} stroke={vt.axis} strokeWidth={1} />

        {/* ICE curves */}
        {showICE && ice.map((curve, j) => (
          <motion.path key={j} d={toPath(curve)} fill="none"
            stroke={accentColor+"30"} strokeWidth={1} strokeLinecap="round"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: j*0.03 }} />
        ))}

        {/* PDP */}
        <motion.path key={featIdx} d={toPath(pdp)} fill="none"
          stroke={accentColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ duration:0.8, ease:"easeOut" }} />

        {/* x-axis labels */}
        {[0,0.5,1].map(f => (
          <text key={f} x={PAD.l + f*PW} y={PAD.t+PH+14} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
            {f === 0 ? feat.xRange[0] : f === 1 ? feat.xRange[1] : ""}
          </text>
        ))}
        <text x={PAD.l + PW/2} y={H-4} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
          {L.featureLabels[featIdx]}
        </text>

        {/* y-axis label */}
        <text x={12} y={PAD.t + PH/2} textAnchor="middle" fontSize={8} fill={vt.textMuted}
          transform={`rotate(-90,12,${PAD.t+PH/2})`}>{L.yLabel}</text>

        {/* legend */}
        <g transform={`translate(${W-120},${PAD.t+4})`}>
          <line x1={0} y1={6} x2={18} y2={6} stroke={accentColor} strokeWidth={2.5} />
          <text x={22} y={10} fontSize={9} fill={vt.textMuted}>{L.pdpLegend}</text>
          {showICE && <>
            <line x1={0} y1={22} x2={18} y2={22} stroke={accentColor+"50"} strokeWidth={1} />
            <text x={22} y={26} fontSize={9} fill={vt.textMuted}>{L.iceLegend}</text>
          </>}
        </g>
      </svg>

      {/* insight bar */}
      <div className="px-5 py-2 border-t" style={{ borderColor:"var(--border)" }}>
        <p className="text-xs" style={{ color:vt.textMuted }}>
          {L.insight(feat.name)}
        </p>
      </div>
    </div>
  );
}
