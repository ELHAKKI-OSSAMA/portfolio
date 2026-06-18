"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";
import { useVizTheme } from "@/hooks/useVizTheme";

// ── Dimensions ─────────────────────────────────────────────────────────────────
const W = 520;
const H = 220;
const PAD_L = 46;
const PAD_R = 12;
const PAD_T = 18;
const PAD_B = 32;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const PLOT_X0 = PAD_L;
const PLOT_Y0 = PAD_T;
const PLOT_X1 = PAD_L + PLOT_W;
const PLOT_Y1 = PAD_T + PLOT_H;

// ── Math helpers ───────────────────────────────────────────────────────────────
function factorial(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function binomCoeff(n: number, k: number): number {
  if (k > n) return 0;
  // Use log space to avoid overflow
  let logC = 0;
  for (let i = 0; i < k; i++) {
    logC += Math.log(n - i) - Math.log(i + 1);
  }
  return Math.exp(logC);
}

// ── Normal PDF ─────────────────────────────────────────────────────────────────
function normalPDF(x: number, mu: number, sigma: number): number {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

// ── Binomial PMF ───────────────────────────────────────────────────────────────
function binomialPMF(k: number, n: number, p: number): number {
  return binomCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// ── Poisson PMF ────────────────────────────────────────────────────────────────
function poissonPMF(k: number, lambda: number): number {
  // Use log to avoid overflow
  const logPMF = k * Math.log(lambda) - lambda - Math.log(factorial(Math.min(k, 20)));
  // For k > 20 use Stirling approximation for factorial
  if (k > 20) {
    const logFactK = k * Math.log(k) - k + 0.5 * Math.log(2 * Math.PI * k);
    return Math.exp(k * Math.log(lambda) - lambda - logFactK);
  }
  return Math.exp(logPMF);
}

// ── Distribution types ─────────────────────────────────────────────────────────
type DistKey = "normal" | "binomial" | "poisson";

// ── Coordinate transforms ──────────────────────────────────────────────────────
function toSvgX(xVal: number, xMin: number, xMax: number): number {
  return PLOT_X0 + ((xVal - xMin) / (xMax - xMin)) * PLOT_W;
}
function toSvgY(yVal: number, yMax: number): number {
  return PLOT_Y1 - (yVal / yMax) * PLOT_H;
}

// ── Sigma shading configuration ─────────────────────────────────────────────────
type SigmaLevel = 1 | 2;

// ── Component ──────────────────────────────────────────────────────────────────
// ── i18n ──────────────────────────────────────────────────────────────────────
const PV_LABELS = {
  en: {
    title: "Probability Distributions",
    shadeOff: "Shade σ",
    yAxis: "Probability / Density",
    withinSigma: (label: string, level: number) => `${label} within ±${level}σ`,
    insight: {
      normal: (mu: number, sigma: number) =>
        `Bell-shaped, defined by μ=${mu} and σ=${sigma.toFixed(1)}. 68-95-99.7 rule: 68% within ±1σ, 95% within ±2σ, 99.7% within ±3σ.`,
      binomial: (n: number, p: number, mean: string, std: string) =>
        `Counts successes in ${n} trials with p=${p.toFixed(2)}. Mean = np = ${mean}, Std = √(np(1−p)) = ${std}. Approximates Normal for large n.`,
      poisson: (lambda: number) =>
        `Models count of events with rate λ=${lambda.toFixed(1)} per interval. Mean = Var = λ. Approaches Normal as λ → ∞.`,
    },
  },
  fr: {
    title: "Distributions de Probabilité",
    shadeOff: "Ombrer σ",
    yAxis: "Probabilité / Densité",
    withinSigma: (label: string, level: number) => `${label} dans ±${level}σ`,
    insight: {
      normal: (mu: number, sigma: number) =>
        `Courbe en cloche, définie par μ=${mu} et σ=${sigma.toFixed(1)}. Règle 68-95-99.7 : 68% dans ±1σ, 95% dans ±2σ, 99.7% dans ±3σ.`,
      binomial: (n: number, p: number, mean: string, std: string) =>
        `Compte les succès sur ${n} essais avec p=${p.toFixed(2)}. Moyenne = np = ${mean}, Éc.-type = √(np(1−p)) = ${std}. Approche la Normale pour n grand.`,
      poisson: (lambda: number) =>
        `Modélise le comptage d'événements avec taux λ=${lambda.toFixed(1)} par intervalle. Moyenne = Var = λ. Approche la Normale pour λ → ∞.`,
    },
  },
  ar: {
    title: "التوزيعات الاحتمالية",
    shadeOff: "ظلال σ",
    yAxis: "الاحتمال / الكثافة",
    withinSigma: (label: string, level: number) => `${label} ضمن ±${level}σ`,
    insight: {
      normal: (mu: number, sigma: number) =>
        `منحنى جرسي، معرّف بـ μ=${mu} وσ=${sigma.toFixed(1)}. قاعدة 68-95-99.7: 68% في ±1σ، 95% في ±2σ، 99.7% في ±3σ.`,
      binomial: (n: number, p: number, mean: string, std: string) =>
        `يحسب النجاحات في ${n} تجربة مع p=${p.toFixed(2)}. المتوسط = np = ${mean}، الانحراف = √(np(1−p)) = ${std}. يقترب من العادي لـ n كبير.`,
      poisson: (lambda: number) =>
        `يُنمذج عدد الأحداث بمعدل λ=${lambda.toFixed(1)} لكل فترة. المتوسط = التباين = λ. يقترب من العادي عند λ → ∞.`,
    },
  },
} as const;

export default function ProbabilityViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(PV_LABELS);

  const [dist, setDist] = useState<DistKey>("normal");
  const [sigmaLevel, setSigmaLevel] = useState<SigmaLevel | null>(1);

  // Normal params
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);

  // Binomial params
  const [nBinom, setNBinom] = useState(10);
  const [pBinom, setPBinom] = useState(0.5);

  // Poisson param
  const [lambda, setLambda] = useState(3);

  // ── Compute data ─────────────────────────────────────────────────────────────
  const plotData = useMemo(() => {
    if (dist === "normal") {
      const xMin = -5, xMax = 5;
      const yMax = 1.5;
      const N = 300;
      const xs = Array.from({ length: N }, (_, i) => xMin + (i / (N - 1)) * (xMax - xMin));
      const ys = xs.map(x => normalPDF(x, mu, sigma));
      // Build filled path for shaded region
      let shadePath = "";
      if (sigmaLevel !== null) {
        const lo = mu - sigmaLevel * sigma;
        const hi = mu + sigmaLevel * sigma;
        const shadeXs = xs.filter(x => x >= lo && x <= hi);
        if (shadeXs.length > 0) {
          const firstSx = toSvgX(shadeXs[0], xMin, xMax);
          const firstSy = toSvgY(normalPDF(shadeXs[0], mu, sigma), yMax);
          shadePath = `M${firstSx.toFixed(1)},${PLOT_Y1} L${firstSx.toFixed(1)},${firstSy.toFixed(1)} `;
          for (let i = 1; i < shadeXs.length; i++) {
            const sx = toSvgX(shadeXs[i], xMin, xMax);
            const sy = toSvgY(normalPDF(shadeXs[i], mu, sigma), yMax);
            shadePath += `L${sx.toFixed(1)},${sy.toFixed(1)} `;
          }
          const lastSx = toSvgX(shadeXs[shadeXs.length - 1], xMin, xMax);
          shadePath += `L${lastSx.toFixed(1)},${PLOT_Y1} Z`;
        }
      }
      // Build main curve path
      const curvePath = xs
        .map((x, i) => {
          const sy = toSvgY(Math.min(ys[i], yMax), yMax);
          const sx = toSvgX(x, xMin, xMax);
          return `${i === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`;
        })
        .join(" ");
      return { type: "continuous" as const, xMin, xMax, yMax, curvePath, shadePath };
    }

    if (dist === "binomial") {
      const xMin = -0.5, xMax = nBinom + 0.5;
      const ks = Array.from({ length: nBinom + 1 }, (_, k) => k);
      const pmfs = ks.map(k => binomialPMF(k, nBinom, pBinom));
      const yMax = Math.max(...pmfs) * 1.25;
      return { type: "discrete" as const, xMin, xMax, yMax, ks, pmfs };
    }

    // Poisson
    const maxK = 20;
    const xMin = -0.5, xMax = maxK + 0.5;
    const ks = Array.from({ length: maxK + 1 }, (_, k) => k);
    const pmfs = ks.map(k => poissonPMF(k, lambda));
    const yMax = Math.max(...pmfs) * 1.25;
    return { type: "discrete" as const, xMin, xMax, yMax, ks, pmfs };
  }, [dist, mu, sigma, sigmaLevel, nBinom, pBinom, lambda]);

  // ── Y-axis ticks ─────────────────────────────────────────────────────────────
  const yTicks = useMemo(() => {
    const yMax = plotData.yMax;
    const step = yMax > 0.5 ? 0.5 : yMax > 0.2 ? 0.1 : 0.05;
    const ticks: number[] = [];
    for (let v = 0; v <= yMax; v = Math.round((v + step) * 1000) / 1000) {
      ticks.push(v);
    }
    return ticks.filter(t => t <= yMax);
  }, [plotData.yMax]);

  // ── X-axis ticks ─────────────────────────────────────────────────────────────
  const xTicks = useMemo(() => {
    if (dist === "normal") {
      return [-4, -2, 0, 2, 4];
    }
    if (dist === "binomial") {
      const step = nBinom > 20 ? 5 : nBinom > 10 ? 2 : 1;
      const ticks: number[] = [];
      for (let i = 0; i <= nBinom; i += step) ticks.push(i);
      return ticks;
    }
    // Poisson
    return [0, 5, 10, 15, 20];
  }, [dist, nBinom]);

  // ── Bar width for discrete ────────────────────────────────────────────────────
  const barWidth = useMemo(() => {
    if (plotData.type !== "discrete") return 0;
    const xMin = plotData.xMin, xMax = plotData.xMax;
    const totalBars = plotData.ks.length;
    return (PLOT_W / (xMax - xMin)) * 0.7 / totalBars * (xMax - xMin);
  }, [plotData]);

  // ── Insight text ──────────────────────────────────────────────────────────────
  const insight = useMemo(() => {
    if (dist === "normal") return L.insight.normal(mu, sigma);
    if (dist === "binomial") {
      const mean = (nBinom * pBinom).toFixed(2);
      const std = Math.sqrt(nBinom * pBinom * (1 - pBinom)).toFixed(2);
      return L.insight.binomial(nBinom, pBinom, mean, std);
    }
    return L.insight.poisson(lambda);
  }, [dist, mu, sigma, nBinom, pBinom, lambda, L]);

  // ── Coverage probability label ────────────────────────────────────────────────
  const coverageLabel = sigmaLevel === 1 ? "68%" : sigmaLevel === 2 ? "95%" : null;

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
          {(["normal", "binomial", "poisson"] as DistKey[]).map(d => (
            <button
              key={d}
              onClick={() => setDist(d)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                backgroundColor: dist === d ? `${accentColor}22` : "transparent",
                color: dist === d ? accentColor : vt.textMuted,
                border: `1px solid ${dist === d ? `${accentColor}55` : vt.border}`,
              }}
            >
              {d === "normal" ? "Normal" : d === "binomial" ? "Binomial" : "Poisson"}
            </button>
          ))}
          {dist === "normal" && (
            <button
              onClick={() => setSigmaLevel(s => (s === null ? 1 : s === 1 ? 2 : null))}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: sigmaLevel !== null ? `${accentColor}18` : "transparent",
                color: sigmaLevel !== null ? accentColor : vt.textMuted,
                border: `1px solid ${sigmaLevel !== null ? `${accentColor}40` : vt.border}`,
              }}
            >
              {sigmaLevel === null ? L.shadeOff : `±${sigmaLevel}σ (${coverageLabel})`}
            </button>
          )}
        </div>
      </div>

      {/* ── SVG ── */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">

        {/* Y grid */}
        {yTicks.map(t => {
          const cy = toSvgY(t, plotData.yMax);
          return (
            <g key={t}>
              <line x1={PLOT_X0} y1={cy} x2={PLOT_X1} y2={cy} stroke={vt.grid} strokeWidth={1} />
              <text x={PLOT_X0 - 3} y={cy + 3} fontSize={9} fill={vt.textMuted} textAnchor="end">
                {t.toFixed(t < 0.1 ? 2 : 1)}
              </text>
            </g>
          );
        })}

        {/* Y axis label */}
        <text
          x={10}
          y={PLOT_Y0 + PLOT_H / 2}
          fontSize={9}
          fill={vt.textMuted}
          textAnchor="middle"
          transform={`rotate(-90, 10, ${PLOT_Y0 + PLOT_H / 2})`}
        >
          {L.yAxis}
        </text>

        {/* Axes */}
        <line x1={PLOT_X0} y1={PLOT_Y0} x2={PLOT_X0} y2={PLOT_Y1} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PLOT_X0} y1={PLOT_Y1} x2={PLOT_X1} y2={PLOT_Y1} stroke={vt.axis} strokeWidth={1.5} />

        {/* X axis ticks + labels */}
        {xTicks.map(t => {
          const cx = toSvgX(t, plotData.xMin, plotData.xMax);
          return (
            <g key={t}>
              <line x1={cx} y1={PLOT_Y1} x2={cx} y2={PLOT_Y1 + 3} stroke={vt.axis} strokeWidth={1} />
              <text x={cx} y={PLOT_Y1 + 11} fontSize={9} fill={vt.textMuted} textAnchor="middle">{t}</text>
            </g>
          );
        })}

        {/* ── NORMAL: shaded region ── */}
        {dist === "normal" && plotData.type === "continuous" && plotData.shadePath && (
          <path
            d={plotData.shadePath}
            fill={accentColor}
            opacity={0.18}
          />
        )}

        {/* ── NORMAL: mu line ── */}
        {dist === "normal" && (
          <>
            <line
              x1={toSvgX(mu, plotData.xMin, plotData.xMax)}
              y1={PLOT_Y0}
              x2={toSvgX(mu, plotData.xMin, plotData.xMax)}
              y2={PLOT_Y1}
              stroke={accentColor}
              strokeWidth={1}
              strokeDasharray="4,3"
              opacity={0.5}
            />
            <text
              x={toSvgX(mu, plotData.xMin, plotData.xMax)}
              y={PLOT_Y0 + 8}
              fontSize={9}
              fill={vt.ink(accentColor)}
              textAnchor="middle"
              opacity={0.8}
            >
              μ
            </text>
          </>
        )}

        {/* ── NORMAL: sigma bracket labels ── */}
        {dist === "normal" && sigmaLevel !== null && (
          <>
            <line
              x1={toSvgX(mu - sigmaLevel * sigma, plotData.xMin, plotData.xMax)}
              y1={PLOT_Y1 + 2}
              x2={toSvgX(mu + sigmaLevel * sigma, plotData.xMin, plotData.xMax)}
              y2={PLOT_Y1 + 2}
              stroke={accentColor}
              strokeWidth={1.5}
              opacity={0.5}
            />
            <text
              x={toSvgX(mu, plotData.xMin, plotData.xMax)}
              y={PLOT_Y1 + 20}
              fontSize={8.5}
              fill={vt.ink(accentColor)}
              textAnchor="middle"
              opacity={0.8}
            >
              {L.withinSigma(coverageLabel!, sigmaLevel!)}
            </text>
          </>
        )}

        {/* ── NORMAL: continuous curve ── */}
        {dist === "normal" && plotData.type === "continuous" && (
          <motion.path
            key={`normal-${mu}-${sigma}`}
            d={plotData.curvePath}
            fill="none"
            stroke={accentColor}
            strokeWidth={2.5}
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          />
        )}

        {/* ── DISCRETE: bars ── */}
        {dist !== "normal" && plotData.type === "discrete" && plotData.ks.map((k, i) => {
          const pmf = plotData.pmfs[i];
          const bx = toSvgX(k, plotData.xMin, plotData.xMax);
          const by = toSvgY(pmf, plotData.yMax);
          const bh = PLOT_Y1 - by;
          if (bh < 0.5) return null;
          return (
            <motion.g
              key={`bar-${dist}-${k}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.015, duration: 0.2 }}
            >
              <rect
                x={bx - barWidth / 2}
                y={by}
                width={barWidth}
                height={bh}
                rx={2}
                fill={accentColor}
                opacity={0.75}
              />
            </motion.g>
          );
        })}

        {/* ── Mean line for discrete ── */}
        {dist === "binomial" && (() => {
          const meanK = nBinom * pBinom;
          const mx = toSvgX(meanK, plotData.xMin, plotData.xMax);
          return (
            <>
              <line x1={mx} y1={PLOT_Y0} x2={mx} y2={PLOT_Y1} stroke={accentColor} strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
              <text x={mx} y={PLOT_Y0 + 8} fontSize={9} fill={vt.ink(accentColor)} textAnchor="middle" opacity={0.8}>μ={meanK.toFixed(1)}</text>
            </>
          );
        })()}
        {dist === "poisson" && (() => {
          const mx = toSvgX(lambda, plotData.xMin, plotData.xMax);
          return (
            <>
              <line x1={mx} y1={PLOT_Y0} x2={mx} y2={PLOT_Y1} stroke={accentColor} strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
              <text x={mx} y={PLOT_Y0 + 8} fontSize={9} fill={vt.ink(accentColor)} textAnchor="middle" opacity={0.8}>λ={lambda.toFixed(1)}</text>
            </>
          );
        })()}

      </svg>

      {/* ── Sliders ── */}
      <div
        className="px-4 py-2 border-t space-y-1.5"
        style={{ borderColor: "var(--border)" }}
      >
        {dist === "normal" && (
          <>
            <div className="flex items-center gap-3">
              <span className="text-xs w-20" style={{ color: vt.textMuted }}>
                μ: <span className="font-mono font-bold" style={{ color: accentColor }}>{mu.toFixed(1)}</span>
              </span>
              <input
                type="range" min={-2} max={2} step={0.1} value={mu}
                onChange={e => setMu(parseFloat(e.target.value))}
                className="flex-1"
                style={{ accentColor }}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs w-20" style={{ color: vt.textMuted }}>
                σ: <span className="font-mono font-bold" style={{ color: accentColor }}>{sigma.toFixed(2)}</span>
              </span>
              <input
                type="range" min={0.3} max={2.5} step={0.05} value={sigma}
                onChange={e => setSigma(parseFloat(e.target.value))}
                className="flex-1"
                style={{ accentColor }}
              />
            </div>
          </>
        )}

        {dist === "binomial" && (
          <>
            <div className="flex items-center gap-3">
              <span className="text-xs w-20" style={{ color: vt.textMuted }}>
                n: <span className="font-mono font-bold" style={{ color: accentColor }}>{nBinom}</span>
              </span>
              <input
                type="range" min={5} max={30} step={1} value={nBinom}
                onChange={e => setNBinom(parseInt(e.target.value))}
                className="flex-1"
                style={{ accentColor }}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs w-20" style={{ color: vt.textMuted }}>
                p: <span className="font-mono font-bold" style={{ color: accentColor }}>{pBinom.toFixed(2)}</span>
              </span>
              <input
                type="range" min={0.1} max={0.9} step={0.01} value={pBinom}
                onChange={e => setPBinom(parseFloat(e.target.value))}
                className="flex-1"
                style={{ accentColor }}
              />
            </div>
          </>
        )}

        {dist === "poisson" && (
          <div className="flex items-center gap-3">
            <span className="text-xs w-20" style={{ color: vt.textMuted }}>
              λ: <span className="font-mono font-bold" style={{ color: accentColor }}>{lambda.toFixed(1)}</span>
            </span>
            <input
              type="range" min={0.5} max={10} step={0.1} value={lambda}
              onChange={e => setLambda(parseFloat(e.target.value))}
              className="flex-1"
              style={{ accentColor }}
            />
          </div>
        )}
      </div>

      {/* ── Insight bar ── */}
      <motion.div
        key={dist}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="px-4 py-2 border-t"
        style={{ borderColor: "var(--border)", backgroundColor: vt.surface }}
      >
        <p className="text-xs" style={{ color: vt.textMuted }}>
          <span style={{ color: accentColor, fontWeight: 600 }}>
            {dist === "normal" ? "Normal" : dist === "binomial" ? "Binomial" : "Poisson"}:
          </span>{" "}
          {insight}
        </p>
      </motion.div>
    </VizCard>
  );
}
