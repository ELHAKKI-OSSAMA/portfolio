"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const AN_LABELS = {
  en: {
    titleZscore: (s: number) => `Anomaly Detection — Z-Score (σ=${s})`,
    titleIqr: "Anomaly Detection — IQR × 1.5 Fence",
    zscore: "Z-Score",
    iqr: "IQR",
    normal: "Normal",
    detected: "Detected anomaly",
    missed: "True outlier (missed)",
    statTotal: "Total points",
    statTrue: "True outliers",
    statDetected: "Detected",
    statMissed: "Missed",
  },
  fr: {
    titleZscore: (s: number) => `Détection d'Anomalies — Z-Score (σ=${s})`,
    titleIqr: "Détection d'Anomalies — Clôture IQR × 1,5",
    zscore: "Z-Score",
    iqr: "IQR",
    normal: "Normal",
    detected: "Anomalie détectée",
    missed: "Vrai aberrant (manqué)",
    statTotal: "Points totaux",
    statTrue: "Vrais aberrants",
    statDetected: "Détectés",
    statMissed: "Manqués",
  },
  ar: {
    titleZscore: (s: number) => `اكتشاف الشذوذ — Z-Score (σ=${s})`,
    titleIqr: "اكتشاف الشذوذ — سياج IQR × 1.5",
    zscore: "Z-Score",
    iqr: "IQR",
    normal: "طبيعي",
    detected: "شذوذ مكتشف",
    missed: "قيمة متطرفة حقيقية (مفوّتة)",
    statTotal: "إجمالي النقاط",
    statTrue: "قيم متطرفة حقيقية",
    statDetected: "مكتشف",
    statMissed: "مفوّت",
  },
} as const;

const W = 520, H = 230;
const PAD = { l:36, r:20, t:20, b:32 };
const PW = W - PAD.l - PAD.r, PH = H - PAD.t - PAD.b;

// 25 normal points (mean ≈ 260,115, σ_x≈55, σ_y≈40)
const NORMAL = [
  [205,105],[225,130],[240,95],[250,115],[260,140],[270,100],[285,120],
  [230,85], [255,75], [275,135],[290,105],[300,125],[310,95], [245,150],
  [265,80], [280,145],[320,115],[235,110],[260,125],[295,90], [270,150],
  [315,130],[240,100],[285,75], [250,135],
];

// 5 true outliers
const OUTLIERS = [[90,40],[430,185],[110,190],[400,50],[170,195]];

const ALL = [...NORMAL, ...OUTLIERS];
const IS_OUTLIER = [...Array(NORMAL.length).fill(false), ...Array(OUTLIERS.length).fill(true)];

function mean(arr: number[]) { return arr.reduce((a,b)=>a+b,0)/arr.length; }
function std(arr: number[], m: number) { return Math.sqrt(arr.reduce((a,b)=>a+(b-m)**2,0)/arr.length); }

const xs = ALL.map(p=>p[0]), ys = ALL.map(p=>p[1]);
const MX = mean(xs), MY = mean(ys);
const SX = std(xs,MX), SY = std(ys,MY);
const SIGMA = 2.5;

// IQR fences
function iqr(arr: number[]) {
  const s = [...arr].sort((a,b)=>a-b);
  const q1 = s[Math.floor(s.length*0.25)];
  const q3 = s[Math.floor(s.length*0.75)];
  return { q1, q3, lo: q1 - 1.5*(q3-q1), hi: q3 + 1.5*(q3-q1) };
}
const IQR_X = iqr(xs), IQR_Y = iqr(ys);

type Method = "zscore" | "iqr";

export default function AnomalyViz({ accentColor = "#ef4444" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(AN_LABELS);
  const [method, setMethod] = useState<Method>("zscore");

  const detected = useMemo(() => ALL.map(([x,y]) => {
    if (method === "zscore") {
      return Math.abs((x-MX)/SX) > SIGMA || Math.abs((y-MY)/SY) > SIGMA;
    } else {
      return x < IQR_X.lo || x > IQR_X.hi || y < IQR_Y.lo || y > IQR_Y.hi;
    }
  }), [method]);

  const trueOutliers  = IS_OUTLIER.filter(Boolean).length;
  const detectedCount = detected.filter(Boolean).length;
  const missed        = IS_OUTLIER.filter((v,i)=>v && !detected[i]).length;

  // Z-score ellipse radii in SVG px
  const ell_rx = SIGMA * SX;
  const ell_ry = SIGMA * SY;

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {method === "zscore" ? L.titleZscore(SIGMA) : L.titleIqr}
        </span>
        <div className="flex gap-1">
          {(["zscore","iqr"] as Method[]).map(m => (
            <button key={m} onClick={() => setMethod(m)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{ backgroundColor:method===m?`${accentColor}22`:"transparent", color:method===m?accentColor:vt.textMuted, border:`1px solid ${method===m?accentColor+"55":"var(--border)"}` }}>
              {m === "zscore" ? L.zscore : L.iqr}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* axes */}
        <line x1={PAD.l} y1={PAD.t+PH} x2={W-PAD.r} y2={PAD.t+PH} stroke={vt.axis} strokeWidth={1} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t+PH} stroke={vt.axis} strokeWidth={1} />

        {/* Z-score ellipse boundary */}
        {method === "zscore" && (
          <motion.ellipse key="ellipse"
            cx={MX} cy={MY} rx={ell_rx} ry={ell_ry}
            fill={accentColor+"08"} stroke={accentColor+"60"} strokeWidth={1.5} strokeDasharray="6,3"
            initial={{ scale:0 }} animate={{ scale:1 }}
            style={{ transformOrigin:`${MX}px ${MY}px` }}
            transition={{ duration:0.5, ease:"easeOut" }} />
        )}

        {/* IQR fence rectangle */}
        {method === "iqr" && (
          <motion.rect key="fence"
            x={IQR_X.lo} y={IQR_Y.lo} width={IQR_X.hi-IQR_X.lo} height={IQR_Y.hi-IQR_Y.lo}
            fill={accentColor+"08"} stroke={accentColor+"60"} strokeWidth={1.5} strokeDasharray="6,3"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }} />
        )}

        {/* mean crosshair */}
        <line x1={MX-12} y1={MY} x2={MX+12} y2={MY} stroke={vt.textFaint} strokeWidth={1} />
        <line x1={MX} y1={MY-12} x2={MX} y2={MY+12} stroke={vt.textFaint} strokeWidth={1} />

        {/* data points */}
        {ALL.map(([x,y], i) => {
          const isAnom = detected[i];
          const isTrueAnom = IS_OUTLIER[i];
          const col = isAnom ? accentColor : (isTrueAnom ? "#f97316" : "#22c55e");
          return (
            <motion.g key={i} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay: i*0.015, type:"spring", stiffness:400 }}>
              <circle cx={x} cy={y} r={isAnom ? 6 : 4}
                fill={col+(isAnom?"cc":"88")} stroke={col} strokeWidth={isAnom ? 2 : 1} />
              {isAnom && (
                <>
                  <line x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke={accentColor} strokeWidth={1.5} />
                  <line x1={x+5} y1={y-5} x2={x-5} y2={y+5} stroke={accentColor} strokeWidth={1.5} />
                </>
              )}
            </motion.g>
          );
        })}

        {/* legend */}
        <g transform={`translate(${W-130},${PAD.t+4})`}>
          {[{col:"#22c55e",lbl:L.normal},{col:accentColor,lbl:L.detected},{col:"#f97316",lbl:L.missed}].map((it,k) => (
            <g key={k} transform={`translate(0,${k*16})`}>
              <circle cx={6} cy={0} r={4} fill={it.col+"88"} stroke={it.col} strokeWidth={1.5} />
              <text x={14} y={4} fontSize={9} fill={vt.textMuted}>{it.lbl}</text>
            </g>
          ))}
        </g>
      </svg>

      {/* stats */}
      <div className="grid grid-cols-4 border-t text-center" style={{ borderColor:"var(--border)" }}>
        {[
          { label: L.statTotal,    val:`${ALL.length}`,     col:"var(--text-primary)" },
          { label: L.statTrue,     val:`${trueOutliers}`,   col:"#f97316" },
          { label: L.statDetected, val:`${detectedCount}`,  col:accentColor },
          { label: L.statMissed,   val:`${missed}`,         col: missed===0 ? "#22c55e" : "#f97316" },
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
