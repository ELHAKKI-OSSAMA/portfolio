"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";
import { useVizTheme } from "@/hooks/useVizTheme";

// ── i18n labels ────────────────────────────────────────────────────────────────
const VIZ_LABELS = {
  en: {
    title: "Gradient Descent Optimizers",
    contourTitle: "Loss Surface f(θ) = θ₁² + 4θ₂²",
    start: "start",
    chartTitle: "Loss vs Step (log scale)",
    stepLabel: "step",
    playBtn: (playing: boolean, done: boolean) => playing ? "Pause" : done ? "Replay" : "Play",
    stepCounter: "Step:",
    lossLabel: "Loss:",
    lrLabel: "η (learning rate)",
    unstable: "⚠ unstable",
    insightAdam: "Adam",
    insightAdamBody: "adapts the learning rate per-parameter — it's the default for deep learning.",
    insightGD: "Vanilla GD",
    insightGDBody: "is stable but slow on ill-conditioned problems (elongated loss surfaces like this one).",
  },
  fr: {
    title: "Optimiseurs de Descente de Gradient",
    contourTitle: "Surface de perte f(θ) = θ₁² + 4θ₂²",
    start: "départ",
    chartTitle: "Perte vs Étape (éch. log)",
    stepLabel: "étape",
    playBtn: (playing: boolean, done: boolean) => playing ? "Pause" : done ? "Rejouer" : "Jouer",
    stepCounter: "Étape :",
    lossLabel: "Perte :",
    lrLabel: "η (taux d'apprentissage)",
    unstable: "⚠ instable",
    insightAdam: "Adam",
    insightAdamBody: "adapte le taux d'apprentissage par paramètre — c'est le choix par défaut pour le deep learning.",
    insightGD: "GD classique",
    insightGDBody: "est stable mais lent sur les problèmes mal conditionnés (surfaces de perte allongées comme celle-ci).",
  },
  ar: {
    title: "محسِّنات الانحدار التدرجي",
    contourTitle: "سطح الخسارة f(θ) = θ₁² + 4θ₂²",
    start: "البداية",
    chartTitle: "الخسارة مقابل الخطوة (مق. لوغ)",
    stepLabel: "خطوة",
    playBtn: (playing: boolean, done: boolean) => playing ? "إيقاف" : done ? "إعادة" : "تشغيل",
    stepCounter: "الخطوة:",
    lossLabel: "الخسارة:",
    lrLabel: "η (معدل التعلم)",
    unstable: "⚠ غير مستقر",
    insightAdam: "Adam",
    insightAdamBody: "يُكيِّف معدل التعلم لكل معامل — هو الخيار الافتراضي للتعلم العميق.",
    insightGD: "GD الكلاسيكي",
    insightGDBody: "مستقر لكنه بطيء في المشاكل سيئة التكييف (أسطح الخسارة المستطيلة كهذه).",
  },
} as const;

// ── Dimensions ─────────────────────────────────────────────────────────────────
const W = 520;
const H = 300;
const PAD_LEFT = 10;
const PAD_TOP = 20;
const CONTOUR_W = 240;
const CONTOUR_H = 260;
const CONTOUR_CX = PAD_LEFT + CONTOUR_W / 2; // center x of contour panel
const CONTOUR_CY = PAD_TOP + CONTOUR_H / 2;  // center y of contour panel

// Right panel dimensions
const CHART_X = PAD_LEFT + CONTOUR_W + 10;
const CHART_W = W - CHART_X - 8;
const CHART_Y = PAD_TOP + 10;
const CHART_H = CONTOUR_H - 20;

// ── Parameter space bounds ─────────────────────────────────────────────────────
const PX_MIN = -4, PX_MAX = 4;
const PY_MIN = -3, PY_MAX = 3;

// ── Coordinate transforms ──────────────────────────────────────────────────────
function paramToSvgX(px: number): number {
  return CONTOUR_CX + (px / (PX_MAX - PX_MIN)) * CONTOUR_W;
}
function paramToSvgY(py: number): number {
  return CONTOUR_CY - (py / (PY_MAX - PY_MIN)) * CONTOUR_H;
}

// ── Loss function and gradient ─────────────────────────────────────────────────
// f(x,y) = x² + 4y²   →  grad = [2x, 8y]
function loss(x: number, y: number): number {
  return x * x + 4 * y * y;
}
function gradX(x: number): number { return 2 * x; }
function gradY(y: number): number { return 8 * y; }

// ── Contour levels ─────────────────────────────────────────────────────────────
// c = x²+4y² → ellipse: a=sqrt(c), b=sqrt(c)/2 in param space
const CONTOUR_LEVELS = [0.4, 0.9, 1.7, 2.8, 4.2, 5.9, 8.0, 10.5, 13.5];

// Convert param-space ellipse radii to SVG pixel radii
function paramRadiusXtoSvg(rx: number): number {
  return (rx / (PX_MAX - PX_MIN)) * CONTOUR_W;
}
function paramRadiusYtoSvg(ry: number): number {
  return (ry / (PY_MAX - PY_MIN)) * CONTOUR_H;
}

// ── Optimizer definitions ──────────────────────────────────────────────────────
type OptimizerKey = "gd" | "sgd" | "momentum" | "adam";

interface Optimizer {
  key: OptimizerKey;
  label: string;
  color: string;
}

const OPTIMIZERS: Optimizer[] = [
  { key: "gd",       label: "GD",       color: "#6c63ff" },
  { key: "sgd",      label: "SGD",      color: "#ff6b6b" },
  { key: "momentum", label: "Momentum", color: "#f59e0b" },
  { key: "adam",     label: "Adam",     color: "#22c55e" },
];

// Fixed noise pattern for SGD (stable, no Math.random())
const SGD_NOISE_X = [
   0.00,  0.30, -0.25,  0.40, -0.35,  0.28, -0.20,  0.38, -0.32,  0.22,
  -0.18,  0.35, -0.30,  0.25, -0.22,  0.18, -0.15,  0.28, -0.20,  0.14,
  -0.12,  0.22, -0.18,  0.15, -0.12,  0.10, -0.08,  0.16, -0.12,  0.08,
  -0.06,  0.12, -0.10,  0.08, -0.06,  0.05, -0.04,  0.08, -0.06,  0.04,
  -0.03,  0.06, -0.05,  0.04, -0.03,  0.02, -0.02,  0.04, -0.03,  0.02,
];
const SGD_NOISE_Y = [
   0.00,  0.20, -0.28,  0.22, -0.30,  0.18, -0.24,  0.20, -0.26,  0.16,
  -0.20,  0.18, -0.22,  0.14, -0.18,  0.12, -0.16,  0.14, -0.18,  0.10,
  -0.14,  0.12, -0.14,  0.09, -0.10,  0.08, -0.10,  0.08, -0.08,  0.06,
  -0.08,  0.06, -0.06,  0.04, -0.06,  0.04, -0.04,  0.04, -0.04,  0.03,
  -0.03,  0.03, -0.03,  0.02, -0.02,  0.02, -0.02,  0.02, -0.02,  0.01,
];

// ── Simulate optimizers ────────────────────────────────────────────────────────
interface Point { x: number; y: number }

function simulateGD(steps: number, lr: number): Point[] {
  const pts: Point[] = [{ x: 3.0, y: 2.2 }];
  let cx = 3.0, cy = 2.2;
  for (let i = 0; i < steps; i++) {
    cx -= lr * gradX(cx);
    cy -= lr * gradY(cy);
    if (!isFinite(cx) || !isFinite(cy)) break;
    pts.push({ x: cx, y: cy });
  }
  return pts;
}

function simulateSGD(steps: number, lr: number): Point[] {
  const pts: Point[] = [{ x: 3.0, y: 2.2 }];
  let cx = 3.0, cy = 2.2;
  for (let i = 0; i < steps; i++) {
    const nx = SGD_NOISE_X[i] ?? 0;
    const ny = SGD_NOISE_Y[i] ?? 0;
    cx -= lr * (gradX(cx) + nx);
    cy -= lr * (gradY(cy) + ny);
    if (!isFinite(cx) || !isFinite(cy)) break;
    pts.push({ x: cx, y: cy });
  }
  return pts;
}

function simulateMomentum(steps: number, lr: number): Point[] {
  const mu = 0.85;
  const pts: Point[] = [{ x: 3.0, y: 2.2 }];
  let cx = 3.0, cy = 2.2;
  let vx = 0, vy = 0;
  for (let i = 0; i < steps; i++) {
    vx = mu * vx - lr * gradX(cx);
    vy = mu * vy - lr * gradY(cy);
    cx += vx;
    cy += vy;
    if (!isFinite(cx) || !isFinite(cy)) break;
    pts.push({ x: cx, y: cy });
  }
  return pts;
}

function simulateAdam(steps: number, lr: number): Point[] {
  const b1 = 0.9, b2 = 0.999, eps = 1e-8;
  const pts: Point[] = [{ x: 3.0, y: 2.2 }];
  let cx = 3.0, cy = 2.2;
  let mx = 0, my = 0, vx = 0, vy = 0;
  for (let i = 1; i <= steps; i++) {
    const gx = gradX(cx), gy = gradY(cy);
    mx = b1 * mx + (1 - b1) * gx;
    my = b1 * my + (1 - b1) * gy;
    vx = b2 * vx + (1 - b2) * gx * gx;
    vy = b2 * vy + (1 - b2) * gy * gy;
    const mxHat = mx / (1 - Math.pow(b1, i));
    const myHat = my / (1 - Math.pow(b1, i));
    const vxHat = vx / (1 - Math.pow(b2, i));
    const vyHat = vy / (1 - Math.pow(b2, i));
    cx -= lr * mxHat / (Math.sqrt(vxHat) + eps);
    cy -= lr * myHat / (Math.sqrt(vyHat) + eps);
    if (!isFinite(cx) || !isFinite(cy)) break;
    pts.push({ x: cx, y: cy });
  }
  return pts;
}

const N_STEPS = 50;
const DEFAULT_LR: Record<OptimizerKey, number> = { gd: 0.08, sgd: 0.08, momentum: 0.08, adam: 0.15 };

const INITIAL_PATHS: Record<OptimizerKey, Point[]> = {
  gd:       simulateGD(N_STEPS, DEFAULT_LR.gd),
  sgd:      simulateSGD(N_STEPS, DEFAULT_LR.sgd),
  momentum: simulateMomentum(N_STEPS, DEFAULT_LR.momentum),
  adam:     simulateAdam(N_STEPS, DEFAULT_LR.adam),
};

const MAX_LOSS = Math.max(
  ...Object.values(INITIAL_PATHS).flatMap(arr => arr.slice(0, 1).map(p => loss(p.x, p.y)))
);

function lossToChartX(step: number): number {
  return CHART_X + (step / N_STEPS) * CHART_W;
}
function lossToChartY(l: number): number {
  const logL = Math.log(Math.max(l, 1e-6) + 1);
  const logMax = Math.log(MAX_LOSS + 1);
  return CHART_Y + CHART_H - (logL / logMax) * CHART_H;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GradientDescentViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(VIZ_LABELS);
  const [activeKey, setActiveKey] = useState<OptimizerKey>("gd");
  const [step, setStep] = useState(N_STEPS);
  const [playing, setPlaying] = useState(false);
  const [lr, setLr] = useState(DEFAULT_LR.gd);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Recompute paths whenever LR changes (for active optimizer), use defaults for others
  const allPaths = useMemo<Record<OptimizerKey, Point[]>>(() => ({
    gd:       simulateGD(N_STEPS, activeKey === "gd" ? lr : DEFAULT_LR.gd),
    sgd:      simulateSGD(N_STEPS, activeKey === "sgd" ? lr : DEFAULT_LR.sgd),
    momentum: simulateMomentum(N_STEPS, activeKey === "momentum" ? lr : DEFAULT_LR.momentum),
    adam:     simulateAdam(N_STEPS, activeKey === "adam" ? lr : DEFAULT_LR.adam),
  }), [lr, activeKey]);

  const allLosses = useMemo<Record<OptimizerKey, number[]>>(() => ({
    gd:       allPaths.gd.map(p => loss(p.x, p.y)),
    sgd:      allPaths.sgd.map(p => loss(p.x, p.y)),
    momentum: allPaths.momentum.map(p => loss(p.x, p.y)),
    adam:     allPaths.adam.map(p => loss(p.x, p.y)),
  }), [allPaths]);

  // Clamp step to actual path length (path can be shorter if optimizer diverges at high LR)
  const pathLen = allPaths[activeKey].length;
  const displayStep = Math.min(step, pathLen - 1);

  const animate = useCallback((now: number) => {
    if (now - lastTimeRef.current > 100) {
      lastTimeRef.current = now;
      setStep(s => {
        const maxStep = allPaths[activeKey].length - 1;
        if (s >= maxStep) {
          setPlaying(false);
          return maxStep;
        }
        return s + 1;
      });
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [allPaths, activeKey]);

  useEffect(() => {
    if (playing) {
      if (displayStep >= pathLen - 1) setStep(0);
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    }
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [playing, animate, displayStep, pathLen]);

  // When switching optimizer, reset LR to its default
  function switchOptimizer(key: OptimizerKey) {
    setActiveKey(key);
    setLr(DEFAULT_LR[key]);
    setStep(N_STEPS);
    setPlaying(false);
  }

  // Build contour path for each optimizer up to current step
  const pathUpTo = useCallback((key: OptimizerKey, upToStep: number): string => {
    const pts = allPaths[key].slice(0, upToStep + 1);
    return pts
      .map((p, i) => {
        const sx = paramToSvgX(p.x);
        const sy = paramToSvgY(p.y);
        return `${i === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`;
      })
      .join(" ");
  }, [allPaths]);

  // Loss polyline up to current step
  const lossPolyline = useCallback((key: OptimizerKey, upToStep: number): string => {
    return allLosses[key]
      .slice(0, upToStep + 1)
      .map((l, i) => `${lossToChartX(i).toFixed(1)},${lossToChartY(l).toFixed(1)}`)
      .join(" ");
  }, [allLosses]);

  const currentLoss = useMemo(() => {
    return allLosses[activeKey][displayStep] ?? 0;
  }, [allLosses, activeKey, displayStep]);

  // y-axis ticks for loss chart (log scale)
  const lossYTicks = [MAX_LOSS, MAX_LOSS * 0.3, MAX_LOSS * 0.05, 0.001];

  return (
    <VizCard>
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b flex-wrap gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {L.title}
        </span>
        <div className="flex items-center gap-2">
          {/* Optimizer toggle buttons */}
          {OPTIMIZERS.map(opt => (
            <button
              key={opt.key}
              onClick={() => switchOptimizer(opt.key)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: activeKey === opt.key ? `${opt.color}22` : "transparent",
                color: activeKey === opt.key ? opt.color : vt.textMuted,
                border: `1px solid ${activeKey === opt.key ? `${opt.color}55` : vt.border}`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── SVG ── */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">

        {/* ══ LEFT: Contour plot ══ */}

        {/* Contour ellipses */}
        {CONTOUR_LEVELS.map((c, i) => {
          const rx = paramRadiusXtoSvg(Math.sqrt(c));
          const ry = paramRadiusYtoSvg(Math.sqrt(c) / 2);
          const opacity = 0.15 + i * 0.05;
          return (
            <ellipse
              key={c}
              cx={CONTOUR_CX}
              cy={CONTOUR_CY}
              rx={rx}
              ry={ry}
              fill="none"
              stroke={vt.gridStrong}
              strokeWidth={1}
              opacity={opacity}
            />
          );
        })}

        {/* Axes */}
        <line
          x1={PAD_LEFT}
          y1={CONTOUR_CY}
          x2={PAD_LEFT + CONTOUR_W}
          y2={CONTOUR_CY}
          stroke={vt.axis}
          strokeWidth={1}
        />
        <line
          x1={CONTOUR_CX}
          y1={PAD_TOP}
          x2={CONTOUR_CX}
          y2={PAD_TOP + CONTOUR_H}
          stroke={vt.axis}
          strokeWidth={1}
        />

        {/* Axis labels */}
        <text x={PAD_LEFT + CONTOUR_W - 2} y={CONTOUR_CY + 12} fontSize={10} fill={vt.textMuted} textAnchor="end">θ₁</text>
        <text x={CONTOUR_CX + 3} y={PAD_TOP + 8} fontSize={10} fill={vt.textMuted}>θ₂</text>

        {/* Minimum marker */}
        <circle cx={CONTOUR_CX} cy={CONTOUR_CY} r={4} fill="none" stroke={vt.axis} strokeWidth={1.5} />
        <circle cx={CONTOUR_CX} cy={CONTOUR_CY} r={1.5} fill={vt.axis} />

        {/* Optimizer paths (faint for non-active) */}
        {OPTIMIZERS.map(opt => {
          const isActive = opt.key === activeKey;
          const d = pathUpTo(opt.key, displayStep);
          return (
            <g key={opt.key}>
              <path
                d={d}
                fill="none"
                stroke={opt.color}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.9 : 0.22}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Current point dot */}
              {isActive && (() => {
                const pts = allPaths[opt.key];
                const pt = pts[displayStep];
                return (
                  <circle
                    cx={paramToSvgX(pt.x)}
                    cy={paramToSvgY(pt.y)}
                    r={4}
                    fill={opt.color}
                    stroke={vt.bg}
                    strokeWidth={1.5}
                  />
                );
              })()}
            </g>
          );
        })}

        {/* Start point */}
        <circle
          cx={paramToSvgX(3.0)}
          cy={paramToSvgY(2.2)}
          r={3.5}
          fill="none"
          stroke={vt.textMuted}
          strokeWidth={1.5}
          strokeDasharray="3,2"
        />
        <text
          x={paramToSvgX(3.0) + 5}
          y={paramToSvgY(2.2) - 4}
          fontSize={9}
          fill={vt.textMuted}
        >
          {L.start}
        </text>

        {/* Contour panel label */}
        <text x={PAD_LEFT + 4} y={PAD_TOP + 10} fontSize={10} fill={vt.textMuted} fontWeight="bold">
          {L.contourTitle}
        </text>

        {/* Separator */}
        <line
          x1={PAD_LEFT + CONTOUR_W + 6}
          y1={PAD_TOP}
          x2={PAD_LEFT + CONTOUR_W + 6}
          y2={PAD_TOP + CONTOUR_H}
          stroke={vt.grid}
          strokeWidth={1}
        />

        {/* ══ RIGHT: Loss-vs-step chart ══ */}

        {/* Chart label */}
        <text x={CHART_X + 2} y={CHART_Y - 4} fontSize={10} fill={vt.textMuted} fontWeight="bold">
          {L.chartTitle}
        </text>

        {/* Y grid + ticks */}
        {lossYTicks.map((l, i) => {
          const cy = lossToChartY(l);
          if (cy < CHART_Y || cy > CHART_Y + CHART_H) return null;
          return (
            <g key={i}>
              <line x1={CHART_X} y1={cy} x2={CHART_X + CHART_W} y2={cy} stroke={vt.grid} strokeWidth={1} />
              <text x={CHART_X - 2} y={cy + 3} fontSize={8} fill={vt.textFaint} textAnchor="end">
                {l < 0.01 ? l.toExponential(0) : l.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={CHART_X} y1={CHART_Y} x2={CHART_X} y2={CHART_Y + CHART_H} stroke={vt.axis} strokeWidth={1} />
        <line x1={CHART_X} y1={CHART_Y + CHART_H} x2={CHART_X + CHART_W} y2={CHART_Y + CHART_H} stroke={vt.axis} strokeWidth={1} />

        {/* X ticks */}
        {[0, 10, 20, 30, 40, 50].map(s => (
          <text key={s} x={lossToChartX(s)} y={CHART_Y + CHART_H + 10} fontSize={8} fill={vt.textMuted} textAnchor="middle">{s}</text>
        ))}
        <text x={CHART_X + CHART_W / 2} y={CHART_Y + CHART_H + 18} fontSize={8} fill={vt.textMuted} textAnchor="middle">{L.stepLabel}</text>

        {/* Loss polylines (all optimizers) */}
        {OPTIMIZERS.map(opt => {
          const isActive = opt.key === activeKey;
          const pts = lossPolyline(opt.key, displayStep);
          return (
            <polyline
              key={opt.key}
              points={pts}
              fill="none"
              stroke={opt.color}
              strokeWidth={isActive ? 2 : 1}
              opacity={isActive ? 0.9 : 0.22}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {/* Active optimizer legend label on chart */}
        {OPTIMIZERS.map(opt => {
          const lastStep = displayStep;
          const l = allLosses[opt.key][lastStep] ?? 0;
          const cy = lossToChartY(l);
          const cx = lossToChartX(lastStep);
          if (opt.key !== activeKey) return null;
          return (
            <g key={`legend-${opt.key}`}>
              <circle cx={cx} cy={cy} r={3} fill={opt.color} />
            </g>
          );
        })}

      </svg>

      {/* ── Controls ── */}
      <div
        className="px-4 py-2 border-t flex items-center gap-4 flex-wrap"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() => {
            if (displayStep >= pathLen - 1 && !playing) {
              setStep(0);
              setPlaying(true);
            } else {
              setPlaying(p => !p);
            }
          }}
          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
          style={{
            backgroundColor: `${accentColor}22`,
            color: accentColor,
            border: `1px solid ${accentColor}44`,
          }}
        >
          {L.playBtn(playing, displayStep >= pathLen - 1)}
        </button>

        <input
          type="range"
          min={0}
          max={pathLen - 1}
          step={1}
          value={displayStep}
          onChange={e => { setPlaying(false); setStep(parseInt(e.target.value)); }}
          className="flex-1"
          style={{ accentColor }}
        />

        <span className="text-xs font-mono" style={{ color: vt.textMuted }}>
          {L.stepCounter} <span style={{ color: accentColor }}>{displayStep}</span>
          {pathLen < N_STEPS + 1 && <span style={{ color: "#f97316" }}> /{pathLen - 1}</span>}
        </span>
        <span className="text-xs font-mono" style={{ color: vt.textMuted }}>
          {L.lossLabel} <span style={{ color: OPTIMIZERS.find(o => o.key === activeKey)?.color }}>
            {currentLoss.toFixed(4)}
          </span>
        </span>
      </div>

      {/* ── Learning rate slider ── */}
      <div
        className="px-4 py-2 border-t flex items-center gap-3 flex-wrap"
        style={{ borderColor: "var(--border)", backgroundColor: vt.surface }}
      >
        <span className="text-xs font-semibold" style={{ color: vt.textMuted }}>{L.lrLabel}</span>
        <input
          type="range"
          min={0.01}
          max={activeKey === "adam" ? 0.5 : 0.25}
          step={0.01}
          value={lr}
          onChange={e => { setLr(parseFloat(e.target.value)); setStep(N_STEPS); setPlaying(false); }}
          className="flex-1"
          style={{ accentColor }}
        />
        <span className="text-xs font-mono w-12 text-right" style={{ color: OPTIMIZERS.find(o => o.key === activeKey)?.color }}>
          {lr.toFixed(2)}
        </span>
        {lr > (activeKey === "adam" ? 0.35 : 0.18) && (
          <span className="text-xs" style={{ color: "#f97316" }}>{L.unstable}</span>
        )}
      </div>

      {/* ── Insight bar ── */}
      <div
        className="px-4 py-2 border-t"
        style={{ borderColor: "var(--border)", backgroundColor: vt.surface }}
      >
        <p className="text-xs" style={{ color: vt.textMuted }}>
          <span style={{ color: "#22c55e", fontWeight: 600 }}>{L.insightAdam}</span>{" "}
          {L.insightAdamBody}{" "}
          <span style={{ color: "#6c63ff", fontWeight: 600 }}>{L.insightGD}</span>{" "}
          {L.insightGDBody}
        </p>
      </div>
    </VizCard>
  );
}
