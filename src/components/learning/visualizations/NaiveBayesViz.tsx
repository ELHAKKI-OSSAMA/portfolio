"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const NB_LABELS = {
  en: {
    title: "Naïve Bayes — Posterior Probability",
    queryX: "Query x:",
    decision: "Decision",
  },
  fr: {
    title: "Naïf de Bayes — Probabilité Postérieure",
    queryX: "Requête x :",
    decision: "Décision",
  },
  ar: {
    title: "بايز الساذج — الاحتمال اللاحق",
    queryX: "استعلام x:",
    decision: "القرار",
  },
} as const;

const W = 520, H = 200;
const PAD_L = 40, PAD_R = 20, PAD_T = 20, PAD_B = 32;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

// Two Gaussian classes
const CLS = [
  { name:"Spam",   mu:-1.2, sigma:0.9, prior:0.3, color:"#f97316" },
  { name:"Ham",    mu: 1.4, sigma:1.0, prior:0.7, color:"#22c55e" },
];

const X_MIN = -4, X_MAX = 5;

function gaussian(x: number, mu: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function xToSVG(x: number) {
  return PAD_L + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
}

function buildCurve(mu: number, sigma: number, steps = 200) {
  const pts: {x:number;y:number}[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
    pts.push({ x, y: gaussian(x, mu, sigma) });
  }
  return pts;
}

const MAX_PDF = 0.50;
function yToSVG(pdf: number) {
  return PAD_T + PLOT_H - (pdf / MAX_PDF) * PLOT_H;
}

function ptsToPath(pts: {x:number;y:number}[]) {
  return pts.map((p, i) => `${i===0?"M":"L"}${xToSVG(p.x).toFixed(1)},${yToSVG(p.y).toFixed(1)}`).join(" ");
}

const QUERY_STEPS = [-3, -2, -1, 0, 1, 2, 3, 4];

export default function NaiveBayesViz({ accentColor = "#8b5cf6" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(NB_LABELS);
  const [qStep, setQStep] = useState(4); // default at x=0

  const qx = QUERY_STEPS[qStep];
  const svgQx = xToSVG(qx);

  const likelihoods = CLS.map(c => gaussian(qx, c.mu, c.sigma));
  const evidences   = CLS.map((c, i) => likelihoods[i] * c.prior);
  const total       = evidences.reduce((a,b)=>a+b,0);
  const posteriors  = evidences.map(e => e / total);

  const decision = posteriors[0] > posteriors[1] ? CLS[0] : CLS[1];

  const curves = useMemo(() => CLS.map(c => buildCurve(c.mu, c.sigma)), []);

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {L.title}
        </span>
        <span className="text-xs font-mono" style={{ color:accentColor }}>
          P(C|x) = P(x|C) · P(C) / P(x)
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* x axis */}
        <line x1={PAD_L} y1={PAD_T+PLOT_H} x2={W-PAD_R} y2={PAD_T+PLOT_H}
          stroke={vt.axis} strokeWidth={1} />
        {[-3,-2,-1,0,1,2,3,4].map(v => (
          <g key={v}>
            <line x1={xToSVG(v)} y1={PAD_T+PLOT_H} x2={xToSVG(v)} y2={PAD_T+PLOT_H+4}
              stroke={vt.axis} strokeWidth={1} />
            <text x={xToSVG(v)} y={PAD_T+PLOT_H+14} textAnchor="middle" fontSize={8} fill={vt.textMuted}>{v}</text>
          </g>
        ))}

        {/* filled areas under curve */}
        {curves.map((pts, ci) => {
          const c = CLS[ci];
          const base = PAD_T + PLOT_H;
          const areaPath = ptsToPath(pts) + ` L${xToSVG(X_MAX)},${base} L${xToSVG(X_MIN)},${base} Z`;
          return (
            <path key={ci} d={areaPath} fill={c.color + "22"} />
          );
        })}

        {/* curve lines */}
        {curves.map((pts, ci) => {
          const c = CLS[ci];
          return (
            <path key={ci} d={ptsToPath(pts)} fill="none" stroke={c.color} strokeWidth={2} />
          );
        })}

        {/* query vertical line */}
        <motion.line
          x1={svgQx} y1={PAD_T} x2={svgQx} y2={PAD_T+PLOT_H}
          stroke={accentColor} strokeWidth={2} strokeDasharray="4,3"
          animate={{ x1: svgQx, x2: svgQx }}
          transition={{ type:"spring", stiffness:200 }} />

        {/* likelihood dots on curves */}
        {CLS.map((c, ci) => {
          const py = yToSVG(likelihoods[ci]);
          return (
            <motion.g key={ci} animate={{ opacity:1 }}>
              <line x1={PAD_L} y1={py} x2={svgQx} y2={py}
                stroke={c.color + "60"} strokeWidth={1} strokeDasharray="3,2" />
              <circle cx={svgQx} cy={py} r={5} fill={c.color} stroke={vt.bg} strokeWidth={1.5} />
            </motion.g>
          );
        })}

        {/* legend */}
        {CLS.map((c, ci) => (
          <g key={ci} transform={`translate(${W-100}, ${32+ci*20})`}>
            <circle cx={6} cy={0} r={5} fill={c.color} />
            <text x={14} y={4} fontSize={9} fill={vt.textMuted}>{c.name} (P={c.prior})</text>
          </g>
        ))}

        {/* query label */}
        <text x={svgQx} y={PAD_T - 6} textAnchor="middle" fontSize={9} fill={vt.ink(accentColor)} fontWeight="bold">
          x = {qx}
        </text>
      </svg>

      {/* slider */}
      <div className="px-5 py-3 border-t" style={{ borderColor:"var(--border)" }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs" style={{ color:vt.textMuted }}>{L.queryX}</span>
          <input type="range" min={0} max={QUERY_STEPS.length-1} value={qStep}
            onChange={e => setQStep(Number(e.target.value))}
            className="flex-1"
            style={{ accentColor }} />
          <span className="text-xs font-mono font-bold" style={{ color:accentColor }}>x = {qx}</span>
        </div>

        {/* posterior bars */}
        <div className="flex gap-4">
          {CLS.map((c, ci) => (
            <div key={ci} className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color:c.color, fontWeight:600 }}>P({c.name}|x)</span>
                <span style={{ color:"var(--text-primary)", fontWeight:700 }}>{(posteriors[ci]*100).toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor:vt.surface }}>
                <motion.div className="h-2 rounded-full"
                  style={{ backgroundColor:c.color }}
                  animate={{ width:`${posteriors[ci]*100}%` }}
                  transition={{ type:"spring", stiffness:200 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* decision */}
      <div className="grid grid-cols-3 border-t text-center" style={{ borderColor:"var(--border)" }}>
        {CLS.map((c, ci) => (
          <div key={ci} className="py-3">
            <div className="text-xs" style={{ color:vt.textMuted }}>P(x | {c.name})</div>
            <div className="text-sm font-bold font-mono" style={{ color:c.color }}>
              {likelihoods[ci].toFixed(3)}
            </div>
          </div>
        ))}
        <div className="py-3">
          <div className="text-xs" style={{ color:vt.textMuted }}>{L.decision}</div>
          <div className="text-sm font-bold" style={{ color:decision.color }}>→ {decision.name}</div>
        </div>
      </div>
    </div>
  );
}
