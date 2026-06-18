"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const RNN_LABELS = {
  en: {
    title: "RNN — Recurrent Neural Network",
    subtitle: (step: number, token: string) => `step ${step}/4 · token: "${token}"`,
    prev: "← Prev",
    next: "Next token →",
    vanishingGrad: (scale: string) => `⚠ Vanishing gradient: signal at t=1 is ${scale}× original — long-range memory lost`,
    statToken: "Token",
    statMean: "h̄ (mean)",
    statOutput: "Output",
    statGradScale: "Grad scale",
  },
  fr: {
    title: "RNN — Réseau Neuronal Récurrent",
    subtitle: (step: number, token: string) => `étape ${step}/4 · token : « ${token} »`,
    prev: "← Préc",
    next: "Token suivant →",
    vanishingGrad: (scale: string) => `⚠ Gradient évanescent : le signal à t=1 est ${scale}× l'original — mémoire long terme perdue`,
    statToken: "Token",
    statMean: "h̄ (moy.)",
    statOutput: "Sortie",
    statGradScale: "Éch. gradient",
  },
  ar: {
    title: "RNN — شبكة عصبية متكررة",
    subtitle: (step: number, token: string) => `خطوة ${step}/4 · رمز: "${token}"`,
    prev: "→ السابق",
    next: "الرمز التالي ←",
    vanishingGrad: (scale: string) => `⚠ تلاشي التدرج: الإشارة عند t=1 تساوي ${scale}× الأصل — فُقدت الذاكرة بعيدة المدى`,
    statToken: "رمز",
    statMean: "h̄ (متوسط)",
    statOutput: "مخرج",
    statGradScale: "مقياس التدرج",
  },
} as const;

const W = 520, H = 300;
const TOKENS = ["The", "cat", "sat", "mat"];

// Fixed weights  — Wx is 4×2: 4 hidden dims, 2 input dims
const Wx = [
  [ 0.5, -0.3],
  [-0.2,  0.7],
  [ 0.4,  0.3],
  [ 0.6, -0.4],
];
const Wh = [
  [0.4, 0.1, -0.2, 0.3],
  [-0.1, 0.6, 0.2, -0.3],
  [0.2, -0.1, 0.5, 0.1],
  [-0.3, 0.2, -0.1, 0.6],
]; // 4×4
const B = [0.1, -0.1, 0.1, -0.1];

// Simple token embeddings (2D)
function tokenEmbed(tokenIdx: number): [number, number] {
  const table: [number, number][] = [
    [0.6, -0.3],
    [-0.4, 0.7],
    [0.8, 0.2],
    [-0.2, -0.6],
  ];
  return table[tokenIdx] ?? [0, 0];
}

function matVec2x4(M: number[][], x: [number, number]): [number, number, number, number] {
  return [
    M[0][0] * x[0] + M[0][1] * x[1],
    M[1][0] * x[0] + M[1][1] * x[1],
    M[2][0] * x[0] + M[2][1] * x[1],
    M[3][0] * x[0] + M[3][1] * x[1],
  ] as [number, number, number, number];
}

function matVec4x4(M: number[][], x: [number, number, number, number]): [number, number, number, number] {
  return [
    M[0][0] * x[0] + M[0][1] * x[1] + M[0][2] * x[2] + M[0][3] * x[3],
    M[1][0] * x[0] + M[1][1] * x[1] + M[1][2] * x[2] + M[1][3] * x[3],
    M[2][0] * x[0] + M[2][1] * x[1] + M[2][2] * x[2] + M[2][3] * x[3],
    M[3][0] * x[0] + M[3][1] * x[1] + M[3][2] * x[2] + M[3][3] * x[3],
  ] as [number, number, number, number];
}

function tanh4(v: [number, number, number, number]): [number, number, number, number] {
  return v.map(Math.tanh) as [number, number, number, number];
}

function computeRNN() {
  const steps: Array<{
    token: string;
    x: [number, number];
    h: [number, number, number, number];
    y: number;
  }> = [];

  let h: [number, number, number, number] = [0, 0, 0, 0];

  for (let t = 0; t < TOKENS.length; t++) {
    const x = tokenEmbed(t);
    const wxPart = matVec2x4(Wx, x);
    const whPart = matVec4x4(Wh, h);
    const raw: [number, number, number, number] = [
      wxPart[0] + whPart[0] + B[0],
      wxPart[1] + whPart[1] + B[1],
      wxPart[2] + whPart[2] + B[2],
      wxPart[3] + whPart[3] + B[3],
    ];
    h = tanh4(raw);
    const y = (h[0] + h[1] + h[2] + h[3]) / 4;
    steps.push({ token: TOKENS[t], x, h, y });
  }
  return steps;
}

const TOKEN_COLORS = ["#6c63ff", "#f97316", "#22c55e", "#06b6d4"];

const CELL_W = 88;
const CELL_H = 56;
const ROW_Y = [36, 120, 210];
const CELL_GAP = 108;
const START_X = 40;

function cellX(t: number) {
  return START_X + t * CELL_GAP;
}

export default function RNNViz({ accentColor = "#06b6d4" }: { accentColor?: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const vt = useVizTheme();
  const L = useVizLocale(RNN_LABELS);

  const steps = useMemo(() => computeRNN(), []);

  const visibleSteps = steps.slice(0, activeStep + 1);

  function barColor(v: number) {
    const abs = Math.abs(v);
    if (abs > 0.7) return "#6c63ff";
    if (abs > 0.4) return "#f97316";
    return "#22c55e";
  }

  const gradientWarning = activeStep > 2;

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{L.title}</span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {L.subtitle(activeStep + 1, TOKENS[activeStep])}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(s => Math.max(0, s - 1))}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: activeStep > 0 ? `${accentColor}25` : "var(--bg-card)",
              color: activeStep > 0 ? accentColor : "var(--text-muted)",
              border: `1px solid ${activeStep > 0 ? accentColor + "50" : "var(--border)"}`,
            }}
          >
            {L.prev}
          </button>
          <button
            disabled={activeStep === 3}
            onClick={() => setActiveStep(s => Math.min(3, s + 1))}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: activeStep < 3 ? `${accentColor}25` : "var(--bg-card)",
              color: activeStep < 3 ? accentColor : "var(--text-muted)",
              border: `1px solid ${activeStep < 3 ? accentColor + "50" : "var(--border)"}`,
            }}
          >
            {L.next}
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Row labels */}
        <text x={12} y={ROW_Y[0] + CELL_H / 2 + 5} fontSize={9} fill={vt.textMuted} textAnchor="middle" transform={`rotate(-90,12,${ROW_Y[0] + CELL_H / 2})`}>x_t</text>
        <text x={12} y={ROW_Y[1] + CELL_H / 2 + 5} fontSize={9} fill={vt.textMuted} textAnchor="middle" transform={`rotate(-90,12,${ROW_Y[1] + CELL_H / 2})`}>h_t</text>
        <text x={12} y={ROW_Y[2] + CELL_H / 2 + 5} fontSize={9} fill={vt.textMuted} textAnchor="middle" transform={`rotate(-90,12,${ROW_Y[2] + CELL_H / 2})`}>y_t</text>

        {/* Draw all 4 token cells (input row) */}
        {TOKENS.map((token, t) => {
          const active = t <= activeStep;
          const cx = cellX(t);
          return (
            <motion.g
              key={`x-${t}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: t === activeStep ? 0.05 : 0 }}
            >
              <rect
                x={cx}
                y={ROW_Y[0]}
                width={CELL_W}
                height={CELL_H}
                rx={6}
                fill={active ? TOKEN_COLORS[t] + "25" : vt.surface}
                stroke={active ? TOKEN_COLORS[t] : vt.border}
                strokeWidth={active ? 1.5 : 1}
              />
              <text
                x={cx + CELL_W / 2}
                y={ROW_Y[0] + CELL_H / 2 + 5}
                textAnchor="middle"
                fontSize={13}
                fontWeight="bold"
                fill={active ? TOKEN_COLORS[t] : vt.textFaint}
              >
                {token}
              </text>
              <text
                x={cx + CELL_W / 2}
                y={ROW_Y[0] + CELL_H - 6}
                textAnchor="middle"
                fontSize={8}
                fill={active ? TOKEN_COLORS[t] + "aa" : vt.textFaint}
              >
                x_{t + 1}
              </text>
            </motion.g>
          );
        })}

        {/* Vertical arrows x_t → h_t */}
        {visibleSteps.map((_, t) => {
          const cx = cellX(t) + CELL_W / 2;
          return (
            <motion.g key={`arr-xh-${t}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <line
                x1={cx} y1={ROW_Y[0] + CELL_H}
                x2={cx} y2={ROW_Y[1]}
                stroke={TOKEN_COLORS[t]} strokeWidth={1.5}
                markerEnd="url(#arrowhead)"
              />
            </motion.g>
          );
        })}

        {/* Hidden state cells + bars */}
        {TOKENS.map((_, t) => {
          const active = t <= activeStep;
          const cx = cellX(t);
          const step = steps[t];
          return (
            <g key={`h-${t}`}>
              <motion.rect
                x={cx}
                y={ROW_Y[1]}
                width={CELL_W}
                height={CELL_H}
                rx={6}
                fill={active ? accentColor + "20" : vt.surface}
                stroke={active ? accentColor : vt.border}
                strokeWidth={active ? 2 : 1}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: active ? 1 : 0.5 }}
                transition={{ delay: t === activeStep ? 0.2 : 0 }}
              />
              {/* Bar chart inside hidden cell — motion.g owns opacity, plain rect owns geometry */}
              {active && step.h.map((hv, di) => {
                const barMaxH = CELL_H - 16;
                const barH = Math.abs(hv) * barMaxH * 0.9;
                const barW = (CELL_W - 12) / 4 - 2;
                const bx = cx + 6 + di * (barW + 2);
                return (
                  <motion.g
                    key={di}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: t === activeStep ? 0.3 + di * 0.05 : 0 }}
                  >
                    <rect
                      x={bx}
                      y={ROW_Y[1] + CELL_H - 8 - barH}
                      width={barW}
                      height={barH}
                      rx={2}
                      fill={barColor(hv)}
                    />
                  </motion.g>
                );
              })}
              <text
                x={cx + CELL_W / 2}
                y={ROW_Y[1] + 12}
                textAnchor="middle"
                fontSize={8}
                fill={active ? accentColor : vt.textFaint}
              >
                h_{t + 1}
              </text>
            </g>
          );
        })}

        {/* Horizontal arrows h_{t-1} → h_t */}
        {visibleSteps.slice(1).map((_, idx) => {
          const t = idx + 1;
          const fromX = cellX(t - 1) + CELL_W;
          const toX = cellX(t);
          const midY = ROW_Y[1] + CELL_H / 2;
          return (
            <motion.g key={`arr-hh-${t}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <line
                x1={fromX} y1={midY}
                x2={toX} y2={midY}
                stroke={accentColor} strokeWidth={2}
                strokeDasharray={t === activeStep ? "none" : "4,3"}
              />
              <polygon
                points={`${toX},${midY - 4} ${toX + 7},${midY} ${toX},${midY + 4}`}
                fill={accentColor}
              />
            </motion.g>
          );
        })}

        {/* Vertical arrows h_t → y_t */}
        {visibleSteps.map((_, t) => {
          const cx = cellX(t) + CELL_W / 2;
          return (
            <motion.g key={`arr-hy-${t}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              <line
                x1={cx} y1={ROW_Y[1] + CELL_H}
                x2={cx} y2={ROW_Y[2]}
                stroke={vt.textMuted} strokeWidth={1.5}
              />
              <polygon
                points={`${cx - 4},${ROW_Y[2]} ${cx + 4},${ROW_Y[2]} ${cx},${ROW_Y[2] + 7}`}
                fill={vt.textMuted}
              />
            </motion.g>
          );
        })}

        {/* Output cells */}
        {TOKENS.map((_, t) => {
          const active = t <= activeStep;
          const cx = cellX(t);
          const step = steps[t];
          return (
            <g key={`y-${t}`}>
              <motion.rect
                x={cx}
                y={ROW_Y[2]}
                width={CELL_W}
                height={CELL_H}
                rx={6}
                fill={vt.surface}
                stroke={active ? vt.gridStrong : vt.border}
                strokeWidth={1}
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0.4 }}
                transition={{ delay: t === activeStep ? 0.5 : 0 }}
              />
              {active && (
                <text
                  x={cx + CELL_W / 2}
                  y={ROW_Y[2] + CELL_H / 2 + 5}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="monospace"
                  fill={vt.text}
                >
                  {step.y.toFixed(3)}
                </text>
              )}
              <text
                x={cx + CELL_W / 2}
                y={ROW_Y[2] + CELL_H - 6}
                textAnchor="middle"
                fontSize={8}
                fill={vt.textFaint}
              >
                y_{t + 1}
              </text>
            </g>
          );
        })}

        {/* Arrow marker def */}
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill={vt.textMuted} />
          </marker>
        </defs>

        {/* Vanishing gradient warning — spans all 4 cells */}
        <AnimatePresence>
          {gradientWarning && (
            <motion.g
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Wide banner below output row, x=40 to x=468 covers all 4 cells */}
              <rect
                x={40} y={ROW_Y[2] + CELL_H + 4}
                width={W - 52} height={24}
                rx={6} fill="#ff6b6b22" stroke="#ff6b6b60" strokeWidth={1}
              />
              <text x={52} y={ROW_Y[2] + CELL_H + 20} fontSize={9} fill={vt.ink("#ff6b6b")}>
                {L.vanishingGrad((0.15 ** (activeStep - 1)).toFixed(4))}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Formula bar — all RNN equations */}
      <div className="px-5 py-2.5 border-t space-y-1" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-wrap gap-x-6 gap-y-1 items-center">
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            h₀ = <span style={{ color: accentColor }}>0</span>
          </span>
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            hₜ = tanh(<span style={{ color: accentColor }}>Wₓ</span>·xₜ + <span style={{ color: accentColor }}>Wₕ</span>·hₜ₋₁ + b)
          </span>
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            yₜ = <span style={{ color: accentColor }}>Wᵧ</span>·hₜ + bᵧ
          </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 items-center">
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            Wₓ: <span style={{ color: accentColor }}>4×2</span>
          </span>
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            Wₕ: <span style={{ color: accentColor }}>4×4</span>
          </span>
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            Wᵧ: <span style={{ color: accentColor }}>1×4</span>
          </span>
          <span className="text-xs font-mono" style={{ color: accentColor }}>
            h_{"{"}
            {activeStep + 1}
            {"}"} = [{steps[activeStep].h.map(v => v.toFixed(2)).join(", ")}]
          </span>
        </div>
      </div>

      {/* Stats */}
      <StatGrid py="py-3" items={[
          { label: L.statToken, value: `"${TOKENS[activeStep]}"`, color: TOKEN_COLORS[activeStep] },
          { label: L.statMean, value: (steps[activeStep].h.reduce((a, b) => a + Math.abs(b), 0) / 4).toFixed(3), color: accentColor },
          { label: L.statOutput, value: steps[activeStep].y.toFixed(4), color: "var(--text-primary)" },
          { label: L.statGradScale, value: activeStep > 0 ? (0.15 ** activeStep).toExponential(1) : "1.0", color: activeStep > 2 ? "#ff6b6b" : "#22c55e" },
      ]} />
    </VizCard>
  );
}
