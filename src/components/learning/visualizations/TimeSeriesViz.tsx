"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const TS_LABELS = {
  en: {
    title: "Time Series",
    viewNames: { original:"Original", trend:"Trend", seasonal:"Seasonal", residual:"Residual" } as Record<string,string>,
    viewLabels: { original:"Original series", trend:"Trend component", seasonal:"Seasonal component", residual:"Residual / noise" } as Record<string,string>,
    showForecast: "Show forecast",
    hideForecast: "Hide forecast",
    showing: "— showing:",
    monthLabels: ["Jan Y1","Jan Y2","Jan Y3","Jan Y4","Dec Y4"] as readonly string[],
    trendLbl: "Trend",
    seasonalLbl: "Seasonal",
    residualLbl: "Residual",
  },
  fr: {
    title: "Séries Temporelles",
    viewNames: { original:"Originale", trend:"Tendance", seasonal:"Saisonnière", residual:"Résiduelle" } as Record<string,string>,
    viewLabels: { original:"Série originale", trend:"Composante tendance", seasonal:"Composante saisonnière", residual:"Résidu / bruit" } as Record<string,string>,
    showForecast: "Afficher la prévision",
    hideForecast: "Masquer la prévision",
    showing: "— affichage :",
    monthLabels: ["Jan A1","Jan A2","Jan A3","Jan A4","Déc A4"] as readonly string[],
    trendLbl: "Tendance",
    seasonalLbl: "Saisonnière",
    residualLbl: "Résidu",
  },
  ar: {
    title: "السلاسل الزمنية",
    viewNames: { original:"أصلية", trend:"اتجاه", seasonal:"موسمية", residual:"بقايا" } as Record<string,string>,
    viewLabels: { original:"السلسلة الأصلية", trend:"مكوّن الاتجاه", seasonal:"المكوّن الموسمي", residual:"البقايا / ضوضاء" } as Record<string,string>,
    showForecast: "إظهار التنبؤ",
    hideForecast: "إخفاء التنبؤ",
    showing: "— يُعرض:",
    monthLabels: ["يناير S1","يناير S2","يناير S3","يناير S4","ديسمبر S4"] as readonly string[],
    trendLbl: "اتجاه",
    seasonalLbl: "موسمية",
    residualLbl: "بقايا",
  },
} as const;

const W = 520, H = 210;
const PAD = { top:20, right:20, bottom:36, left:44 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const N = 48; // 4 years of monthly data

function buildSeries() {
  const t: number[] = [];
  const trend: number[] = [];
  const seasonal: number[] = [];
  const residual: number[] = [];
  const original: number[] = [];

  for (let i = 0; i < N; i++) {
    const tr  = 10 + 0.18 * i;
    const sea = 4 * Math.sin(2 * Math.PI * i / 12);
    const res = (Math.sin(i * 2.7) * 0.8 + Math.cos(i * 1.3) * 0.6);
    t.push(i);
    trend.push(tr);
    seasonal.push(sea);
    residual.push(res);
    original.push(tr + sea + res);
  }
  return { t, trend, seasonal, residual, original };
}

// Simple 3-step ahead forecast from last 6 points (linear extrapolation)
function forecast(original: number[]): number[] {
  const last = original.slice(-6);
  const slope = (last[5] - last[0]) / 5;
  return [1,2,3].map(k => last[5] + slope * k);
}

type View = "original" | "trend" | "seasonal" | "residual";


const VIEW_COLORS: Record<View, string> = {
  original: "#6c63ff",
  trend:    "#f97316",
  seasonal: "#22c55e",
  residual: "#06b6d4",
};

export default function TimeSeriesViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(TS_LABELS);
  const [view, setView] = useState<View>("original");
  const [showForecast, setShowForecast] = useState(false);

  const { trend, seasonal, residual, original } = useMemo(buildSeries, []);
  const fc = useMemo(() => forecast(original), [original]);

  const data: Record<View, number[]> = { original, trend, seasonal, residual };
  const series = data[view];

  const allVals = [...series, ...(showForecast && view === "original" ? fc : [])];
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const range = maxV - minV || 1;

  function xS(i: number, total = N) {
    return PAD.left + (i / (total - 1)) * PLOT_W;
  }
  function yS(v: number) {
    return PAD.top + PLOT_H - ((v - minV) / range) * PLOT_H;
  }
  const stepX = PLOT_W / (N - 1);
  const vbW = showForecast && view === "original" ? W + 42 : W;

  const linePath = series
    .map((v, i) => `${i===0?"M":"L"}${xS(i).toFixed(1)},${yS(v).toFixed(1)}`)
    .join(" ");

  const fcPath = fc
    .map((v, k) => `${k===0?"M":"L"}${(xS(N-1) + (k+1)*stepX).toFixed(1)},${yS(v).toFixed(1)}`)
    .join(" ");
  const fcStart = `M${xS(N-1).toFixed(1)},${yS(series[N-1]).toFixed(1)} ` + fcPath;

  // x-axis ticks every 12 months
  const xTicks = [0,12,24,36,47];

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {L.title} — {L.viewLabels[view]}
        </span>
        <button onClick={() => setShowForecast(v => !v)}
          disabled={view !== "original"}
          className="px-3 py-1 rounded-lg text-xs font-semibold"
          style={{
            backgroundColor: showForecast && view==="original" ? `${accentColor}22` : "transparent",
            color: view==="original" ? (showForecast ? accentColor : vt.textMuted) : vt.textFaint,
            border:`1px solid ${showForecast && view==="original" ? accentColor+"55" : "var(--border)"}`,
          }}>
          {showForecast ? L.hideForecast : L.showForecast}
        </button>
      </div>

      {/* decomposition tabs */}
      <div className="flex gap-1 px-5 pt-3">
        {(["original","trend","seasonal","residual"] as View[]).map(v => (
          <button key={v} onClick={() => setView(v)}
            className="px-3 py-1 rounded-lg text-xs font-semibold flex-1"
            style={{
              backgroundColor: view===v ? `${VIEW_COLORS[v]}22` : "transparent",
              color: view===v ? VIEW_COLORS[v] : vt.textMuted,
              border:`1px solid ${view===v ? VIEW_COLORS[v]+"55" : "var(--border)"}`,
            }}>
            {L.viewNames[v]}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${vbW} ${H}`} className="w-full">
        {/* grid */}
        {[0,0.25,0.5,0.75,1].map(f => {
          const y = PAD.top + f * PLOT_H;
          return <line key={f} x1={PAD.left} y1={y} x2={W-PAD.right} y2={y} stroke={vt.grid} strokeWidth={1} />;
        })}

        {/* x axis ticks */}
        {xTicks.map(i => (
          <g key={i}>
            <line x1={xS(i)} y1={PAD.top+PLOT_H} x2={xS(i)} y2={PAD.top+PLOT_H+4} stroke={vt.axis} strokeWidth={1} />
            <text x={xS(i)} y={PAD.top+PLOT_H+16} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
              {i===0 ? L.monthLabels[0] : i===12 ? L.monthLabels[1] : i===24 ? L.monthLabels[2] : i===36 ? L.monthLabels[3] : L.monthLabels[4]}
            </text>
          </g>
        ))}

        {/* y axis */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top+PLOT_H} stroke={vt.axis} strokeWidth={1} />

        {/* zero line for seasonal/residual */}
        {(view === "seasonal" || view === "residual") && (
          <line x1={PAD.left} y1={yS(0)} x2={W-PAD.right} y2={yS(0)}
            stroke={vt.gridStrong} strokeWidth={1} strokeDasharray="4,3" />
        )}

        {/* forecast shading */}
        {showForecast && view === "original" && (
          <rect x={xS(N-1)} y={PAD.top} width={3 * stepX + 10} height={PLOT_H}
            fill={accentColor + "08"} />
        )}

        {/* main line */}
        <motion.path key={view} d={linePath} fill="none"
          stroke={VIEW_COLORS[view]} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ duration:0.8, ease:"easeOut" }} />

        {/* forecast line */}
        {showForecast && view === "original" && (
          <motion.path d={fcStart} fill="none"
            stroke={accentColor} strokeWidth={2} strokeDasharray="5,3" strokeLinecap="round"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }} />
        )}

        {/* forecast dots */}
        {showForecast && view === "original" && fc.map((v, k) => (
          <motion.g key={k} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.5 + k*0.1 }}>
            <circle cx={xS(N-1) + (k+1)*stepX} cy={yS(v)} r={5}
              fill={accentColor} stroke={vt.bg} strokeWidth={1.5} />
          </motion.g>
        ))}
      </svg>

      {/* formula bar */}
      <div className="px-5 py-2 border-t" style={{ borderColor:"var(--border)" }}>
        <span className="text-xs font-mono" style={{ color:vt.textMuted }}>
          y(t) = <span style={{ color:VIEW_COLORS.trend }}>{L.trendLbl}</span> +{" "}
          <span style={{ color:VIEW_COLORS.seasonal }}>{L.seasonalLbl}</span> +{" "}
          <span style={{ color:VIEW_COLORS.residual }}>{L.residualLbl}</span>
          {view !== "original" && (
            <span style={{ color:VIEW_COLORS[view], marginLeft:8 }}>
              {L.showing} {L.viewLabels[view]}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
