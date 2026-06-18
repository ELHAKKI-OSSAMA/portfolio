"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const SVR_LABELS = {
  en: {
    title: "SVR — Support Vector Regression",
    subtitle: "ε-tube ignores points inside · only boundary points drive the fit",
    tabSvr: "SVR",
    tabLinear: "Linear Reg",
    legendInside: "Inside ε-tube (ignored)",
    legendSV: "Support vectors (drive fit)",
    sliderEpsilonHint: "wider tube = fewer SVs",
    sliderCHint: "high C = penalizes violations",
    statSV: "Support Vectors",
    statMSE: "ε-loss MSE",
    statInside: "Inside tube",
  },
  fr: {
    title: "SVR — Régression à Vecteurs de Support",
    subtitle: "le tube ε ignore les points intérieurs · seuls les points frontières guident l'ajustement",
    tabSvr: "SVR",
    tabLinear: "Rég. Linéaire",
    legendInside: "Dans le tube ε (ignoré)",
    legendSV: "Vecteurs de support (guident l'ajust.)",
    sliderEpsilonHint: "tube plus large = moins de VS",
    sliderCHint: "C élevé = pénalise les violations",
    statSV: "Vecteurs de support",
    statMSE: "MSE ε-loss",
    statInside: "Dans le tube",
  },
  ar: {
    title: "SVR — انحدار متجهات الدعم",
    subtitle: "الأنبوب ε يتجاهل النقاط الداخلية · نقاط الحدود فقط تحدد الملاءمة",
    tabSvr: "SVR",
    tabLinear: "انحدار خطي",
    legendInside: "داخل الأنبوب ε (متجاهل)",
    legendSV: "متجهات الدعم (تحدد الملاءمة)",
    sliderEpsilonHint: "أنبوب أوسع = متجهات دعم أقل",
    sliderCHint: "C مرتفع = يعاقب على الانتهاكات",
    statSV: "متجهات الدعم",
    statMSE: "MSE خسارة ε",
    statInside: "داخل الأنبوب",
  },
} as const;

const W = 520, H = 280, PAD = 40;

const trueFunc = (x: number) => 3 * Math.sin(x * 0.7) + 0.25 * x;

const SEED = (i: number) => Math.sin(i * 23.7 + 5.1) * 0.5 + 0.5;
const DATA = Array.from({ length: 20 }, (_, i) => {
  const x = 0.5 + i * 0.48;
  return { x, y: trueFunc(x) + (SEED(i) - 0.5) * 2.5 };
});

const X_RANGE: [number, number] = [0, 10];
const Y_RANGE: [number, number] = [-4, 7];

const toSVGX = (x: number) => PAD + ((x - X_RANGE[0]) / (X_RANGE[1] - X_RANGE[0])) * (W - 2 * PAD);
const toSVGY = (y: number) => H - PAD - ((y - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * (H - 2 * PAD);

// Simple SVR: fit a line with epsilon-insensitive loss
function svrFit(pts: typeof DATA, C: number): { m: number; b: number } {
  // Regularized linear regression approximation of SVR primal
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  const num = pts.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
  const den = pts.reduce((s, p) => s + (p.x - mx) ** 2, 0) + (1 / Math.max(0.01, C)) * n;
  const m = num / den;
  return { m, b: my - m * mx };
}

const XS = Array.from({ length: 100 }, (_, i) => X_RANGE[0] + (i / 99) * (X_RANGE[1] - X_RANGE[0]));

export default function SVRViz({ accentColor = "#f97316" }: { accentColor?: string }) {
  const [epsilon, setEpsilon] = useState(0.8);
  const [C, setC] = useState(1.0);
  const [mode, setMode] = useState<"svr" | "linear">("svr");
  const vt = useVizTheme();
  const L = useVizLocale(SVR_LABELS);

  const { m, b } = useMemo(() => svrFit(DATA, C), [C]);

  const classify = (pt: typeof DATA[0]) => {
    const pred = m * pt.x + b;
    const res = pt.y - pred;
    if (Math.abs(res) <= epsilon) return "inside";
    return res > 0 ? "above" : "below";
  };

  const pathStr = (fn: (x: number) => number, offset = 0) =>
    XS.map((x, i) => {
      const y = fn(x) + offset;
      return `${i === 0 ? "M" : "L"}${toSVGX(x)},${toSVGY(Math.max(Y_RANGE[0], Math.min(Y_RANGE[1], y)))}`;
    }).join(" ");

  const linearFn = (x: number) => m * x + b;
  const trueFn = (x: number) => trueFunc(x);

  const svPath = pathStr(linearFn);
  const upperTubePath = pathStr(linearFn, epsilon);
  const lowerTubePath = pathStr(linearFn, -epsilon);
  const truePath = pathStr(trueFn);

  const tubeAreaPath = [
    upperTubePath,
    ` L${toSVGX(XS[XS.length - 1])},${toSVGY(linearFn(XS[XS.length - 1]) - epsilon)}`,
    ...XS.slice().reverse().map((x, i) => `${i === 0 ? "" : "L"}${toSVGX(x)},${toSVGY(linearFn(x) - epsilon)}`),
    "Z",
  ].join(" ");

  const supportVectors = DATA.filter(pt => classify(pt) !== "inside");
  const mse = DATA.reduce((s, pt) => {
    const pred = m * pt.x + b;
    const res = Math.max(0, Math.abs(pt.y - pred) - epsilon);
    return s + res * res;
  }, 0) / DATA.length;

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
        <div className="flex gap-2">
          {(["svr", "linear"] as const).map(m_ => (
            <button key={m_} onClick={() => setMode(m_)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: mode === m_ ? `${accentColor}25` : "var(--bg-card)",
                color: mode === m_ ? accentColor : "var(--text-muted)",
                border: `1px solid ${mode === m_ ? accentColor + "50" : "var(--border)"}`,
              }}>
              {m_ === "svr" ? L.tabSvr : L.tabLinear}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid */}
        {[-2, 0, 2, 4, 6].map(v => (
          <g key={v}>
            <line x1={PAD} y1={toSVGY(v)} x2={W - PAD} y2={toSVGY(v)} stroke={vt.grid} strokeWidth={1} />
            <text x={PAD - 6} y={toSVGY(v) + 4} textAnchor="end" fontSize={9} fill={vt.textMuted}>{v}</text>
          </g>
        ))}
        {[2, 4, 6, 8].map(v => (
          <text key={v} x={toSVGX(v)} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{v}</text>
        ))}

        {/* ε-tube fill */}
        {mode === "svr" && (
          <path d={tubeAreaPath} fill={accentColor} opacity={0.08} />
        )}

        {/* True function (ghost) */}
        <path d={truePath} fill="none" stroke={vt.gridStrong} strokeWidth={1.5} strokeDasharray="6,4" />

        {/* Tube boundaries */}
        {mode === "svr" && (
          <>
            <motion.path d={upperTubePath} fill="none" stroke={accentColor} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.7}
              animate={{ d: upperTubePath }} transition={{ duration: 0.3 }} />
            <motion.path d={lowerTubePath} fill="none" stroke={accentColor} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.7}
              animate={{ d: lowerTubePath }} transition={{ duration: 0.3 }} />
            {/* ε label */}
            <text x={toSVGX(9.5)} y={toSVGY(linearFn(9.5) + epsilon) - 4} fontSize={9} fill={vt.ink(accentColor)} textAnchor="end">
              +ε
            </text>
            <text x={toSVGX(9.5)} y={toSVGY(linearFn(9.5) - epsilon) + 12} fontSize={9} fill={vt.ink(accentColor)} textAnchor="end">
              −ε
            </text>
          </>
        )}

        {/* SVR regression line */}
        <motion.path d={svPath} fill="none" stroke={accentColor} strokeWidth={2.5}
          animate={{ d: svPath }} transition={{ duration: 0.3 }} />

        {/* Residual lines for support vectors */}
        {mode === "svr" && supportVectors.map((sv, i) => {
          const pred = m * sv.x + b;
          const boundary = sv.y > pred ? pred + epsilon : pred - epsilon;
          return (
            <line key={i}
              x1={toSVGX(sv.x)} y1={toSVGY(sv.y)}
              x2={toSVGX(sv.x)} y2={toSVGY(boundary)}
              stroke="#ff6b6b" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.7}
            />
          );
        })}

        {/* Data points */}
        {DATA.map((pt, i) => {
          const status = classify(pt);
          const isSV = status !== "inside";
          const color = status === "inside" ? vt.pointFill : "#ff6b6b";
          return (
            <g key={i}>
              {isSV && mode === "svr" && (
                <circle cx={toSVGX(pt.x)} cy={toSVGY(pt.y)} r={12}
                  fill="none" stroke="#ff6b6b" strokeWidth={2} opacity={0.5} />
              )}
              <circle cx={toSVGX(pt.x)} cy={toSVGY(pt.y)} r={isSV && mode === "svr" ? 6 : 4}
                fill={color}
                stroke={vt.isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.8)"} strokeWidth={1.5} />
            </g>
          );
        })}

        {/* Legend */}
        <circle cx={PAD + 8} cy={PAD + 14} r={4} fill={vt.pointFill} stroke={vt.axis} strokeWidth={1.5} />
        <text x={PAD + 16} y={PAD + 18} fontSize={9} fill={vt.textMuted}>{L.legendInside}</text>
        <circle cx={PAD + 8} cy={PAD + 28} r={4} fill="#ff6b6b" />
        <circle cx={PAD + 8} cy={PAD + 28} r={10} fill="none" stroke="#ff6b6b" strokeWidth={1.5} opacity={0.5} />
        <text x={PAD + 22} y={PAD + 32} fontSize={9} fill={vt.textMuted}>{L.legendSV}</text>

        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
      </svg>

      {/* Sliders */}
      <div className="px-5 py-3 space-y-2 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs w-20" style={{ color: "var(--text-muted)" }}>
            ε = <span className="font-mono font-bold" style={{ color: accentColor }}>{epsilon.toFixed(2)}</span>
          </span>
          <input type="range" min={0.1} max={2.5} step={0.05} value={epsilon}
            onChange={e => setEpsilon(parseFloat(e.target.value))} className="flex-1" style={{ accentColor }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{L.sliderEpsilonHint}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs w-20" style={{ color: "var(--text-muted)" }}>
            C = <span className="font-mono font-bold" style={{ color: accentColor }}>{C.toFixed(1)}</span>
          </span>
          <input type="range" min={0.1} max={10} step={0.1} value={C}
            onChange={e => setC(parseFloat(e.target.value))} className="flex-1" style={{ accentColor }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{L.sliderCHint}</span>
        </div>
      </div>

      <StatGrid py="py-3" items={[
          { label: L.statSV, value: supportVectors.length.toString(), color: "#ff6b6b" },
          { label: L.statMSE, value: mse.toFixed(3), color: accentColor },
          { label: L.statInside, value: `${DATA.length - supportVectors.length}/${DATA.length}`, color: "var(--text-primary)" },
      ]} />
    </VizCard>
  );
}
