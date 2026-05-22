"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";

// ── Constants ───────────────────────────────────────────────────────────────
const W = 520, H = 460, PAD = 44;
const H_TOP = 230, H_BOT = 180;
const ERR_Y0 = H_TOP + 20;          // y-origin of bottom error chart
const MAX_DEGREE = 11;

// ── Ground truth + noisy data ────────────────────────────────────────────────
const TRUE_FN = (x: number) => Math.sin(2 * Math.PI * x);
const SEED = (i: number) => Math.sin(i * 53.1 + 7.9) * 0.5 + 0.5;

const N = 36;
const ALL_DATA = Array.from({ length: N }, (_, i) => {
  const x = 0.05 + (i / (N - 1)) * 0.88;
  return { x, y: TRUE_FN(x) + (SEED(i) - 0.5) * 1.2 };
});

// 2-out-of-3 train, 1-out-of-3 test
const TRAIN = ALL_DATA.filter((_, i) => i % 3 !== 0);
const TEST  = ALL_DATA.filter((_, i) => i % 3 === 0);

// ── Polynomial fitting (stable: normalized x, ridge regression) ───────────────
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

function polyFit(pts: typeof TRAIN, degree: number): (x: number) => number {
  const dim = degree + 1;
  // Normalize x to [-1, 1] for numerical stability
  const xn = (x: number) => 2 * x - 1; // data is in [0.05, 0.93] ≈ [0, 1]
  const xs = pts.map(p => xn(p.x));
  const ys = pts.map(p => p.y);
  // Ridge regularization scales with degree
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

function mse(pts: typeof TRAIN, fn: (x: number) => number) {
  return pts.reduce((s, p) => s + (p.y - fn(p.x)) ** 2, 0) / pts.length;
}

// ── Pre-compute train/test MSE for all degrees ──────────────────────────────
const DEGREES = Array.from({ length: MAX_DEGREE }, (_, i) => i + 1);

const ERRORS = DEGREES.map(d => {
  const fn = polyFit(TRAIN, d);
  return { degree: d, trainMSE: mse(TRAIN, fn), testMSE: mse(TEST, fn) };
});

// ── SVG coordinate helpers ───────────────────────────────────────────────────
const X_MIN = 0, X_MAX = 1;
const Y_MIN = -2.2, Y_MAX = 2.2;

function toSX(x: number) {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
}
function toSY_top(y: number) {
  return H_TOP - PAD / 2 - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H_TOP - PAD);
}

// Error chart coords
const ERR_PAD_L = PAD;
const ERR_W = W - 2 * PAD;
const maxErr = Math.max(...ERRORS.map(e => e.testMSE)) * 1.1;

function errX(d: number) {
  return ERR_PAD_L + ((d - 1) / (MAX_DEGREE - 1)) * ERR_W;
}
function errY(v: number) {
  return ERR_Y0 + H_BOT - PAD / 2 - (v / maxErr) * (H_BOT - PAD / 1.4);
}

// ── Dense eval xs for drawing curves ────────────────────────────────────────
const EVAL_XS = Array.from({ length: 120 }, (_, i) =>
  X_MIN + (i / 119) * (X_MAX - X_MIN)
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function BiasVarianceViz({ accentColor = "#10b981" }: { accentColor?: string }) {
  const [degree, setDegree] = useState(3);
  const [showTrue, setShowTrue] = useState(true);
  const vt = useVizTheme();

  const fitFn = useMemo(() => polyFit(TRAIN, degree), [degree]);

  const fitPath = useMemo(() => {
    return EVAL_XS.map((x, i) => {
      const y = Math.max(Y_MIN - 0.2, Math.min(Y_MAX + 0.2, fitFn(x)));
      return `${i === 0 ? "M" : "L"}${toSX(x).toFixed(1)},${toSY_top(y).toFixed(1)}`;
    }).join(" ");
  }, [fitFn]);

  const truePath = EVAL_XS.map((x, i) => {
    const y = TRUE_FN(x);
    return `${i === 0 ? "M" : "L"}${toSX(x).toFixed(1)},${toSY_top(y).toFixed(1)}`;
  }).join(" ");

  const trainPath = ERRORS.map((e, i) =>
    `${i === 0 ? "M" : "L"}${errX(e.degree).toFixed(1)},${errY(e.trainMSE).toFixed(1)}`
  ).join(" ");
  const testPath = ERRORS.map((e, i) =>
    `${i === 0 ? "M" : "L"}${errX(e.degree).toFixed(1)},${errY(e.testMSE).toFixed(1)}`
  ).join(" ");

  const currentErr = ERRORS.find(e => e.degree === degree)!;
  const overfit = (currentErr.testMSE - currentErr.trainMSE).toFixed(3);

  const diagnosis =
    degree <= 2
      ? { label: "Underfitting (High Bias)", color: "#ff6b6b", hint: "Too simple — raise degree" }
      : degree >= 9
      ? { label: "Overfitting (High Variance)", color: "#f59e0b", hint: "Fits noise — lower degree or regularize" }
      : { label: "Good Balance", color: accentColor, hint: "Train ≈ Test error — sweet spot" };

  const optDeg = ERRORS.reduce((best, e) => (e.testMSE < best.testMSE ? e : best)).degree;

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Bias–Variance Tradeoff
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            degree {degree} polynomial · real fitting on noisy data
          </span>
        </div>
        <button
          onClick={() => setShowTrue(s => !s)}
          className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: showTrue ? `${accentColor}20` : "var(--bg-card)",
            color: showTrue ? accentColor : "var(--text-muted)",
            border: `1px solid ${showTrue ? accentColor + "40" : "var(--border)"}`,
          }}
        >
          True fn
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* ── TOP PANEL: Data + fit ── */}

        {/* Panel label */}
        <text x={PAD} y={14} fontSize={9} fill={vt.textMuted}>
          Fitted curve on training data
        </text>

        {/* Grid */}
        {[-1.5, 0, 1.5].map(v => (
          <g key={v}>
            <line x1={PAD} y1={toSY_top(v)} x2={W - PAD} y2={toSY_top(v)}
              stroke={vt.grid} strokeWidth={1} />
            <text x={PAD - 5} y={toSY_top(v) + 4} textAnchor="end" fontSize={8}
              fill={vt.textMuted}>{v}</text>
          </g>
        ))}

        {/* Underfitting / Overfitting zone labels */}
        {degree <= 2 && (
          <rect x={PAD} y={H_TOP - PAD + 2} width={W - 2 * PAD} height={16} rx={4}
            fill="#ff6b6b10" stroke="#ff6b6b30" strokeWidth={1} />
        )}

        {/* True function (ghost) */}
        {showTrue && (
          <path d={truePath} fill="none" stroke={vt.gridStrong}
            strokeWidth={1.5} strokeDasharray="6,4" opacity={0.7} />
        )}

        {/* Fitted polynomial */}
        <motion.path
          d={fitPath} fill="none" stroke={accentColor} strokeWidth={2.5}
          animate={{ d: fitPath }}
          transition={{ duration: 0.35 }}
        />

        {/* Test points */}
        {TEST.map((pt, i) => (
          <circle key={`test-${i}`}
            cx={toSX(pt.x)} cy={toSY_top(pt.y)} r={4}
            fill="none"
            stroke="#f59e0b" strokeWidth={1.5} opacity={0.8}
          />
        ))}

        {/* Training points */}
        {TRAIN.map((pt, i) => (
          <circle key={`train-${i}`}
            cx={toSX(pt.x)} cy={toSY_top(pt.y)} r={4}
            fill={vt.pointFill}
            stroke={vt.isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)"}
            strokeWidth={1.5}
          />
        ))}

        {/* Legend: top panel */}
        <circle cx={PAD + 6} cy={H_TOP - 22} r={4} fill={vt.pointFill}
          stroke={vt.isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)"} strokeWidth={1.5} />
        <text x={PAD + 14} y={H_TOP - 18} fontSize={8} fill={vt.textMuted}>Train</text>
        <circle cx={PAD + 52} cy={H_TOP - 22} r={4} fill="none" stroke="#f59e0b" strokeWidth={1.5} />
        <text x={PAD + 60} y={H_TOP - 18} fontSize={8} fill={vt.textMuted}>Test</text>
        {showTrue && (
          <>
            <line x1={PAD + 98} y1={H_TOP - 22} x2={PAD + 116} y2={H_TOP - 22}
              stroke={vt.gridStrong} strokeWidth={1.5} strokeDasharray="5,3" />
            <text x={PAD + 120} y={H_TOP - 18} fontSize={8} fill={vt.textMuted}>True fn</text>
          </>
        )}

        {/* Top axis */}
        <line x1={PAD} y1={H_TOP - PAD / 2} x2={W - PAD} y2={H_TOP - PAD / 2}
          stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={18} x2={PAD} y2={H_TOP - PAD / 2} stroke={vt.axis} strokeWidth={1.5} />
        {[0.2, 0.4, 0.6, 0.8].map(v => (
          <text key={v} x={toSX(v)} y={H_TOP - PAD / 2 + 13}
            textAnchor="middle" fontSize={8} fill={vt.textMuted}>{v}</text>
        ))}

        {/* ── DIVIDER ── */}
        <line x1={0} y1={H_TOP + 8} x2={W} y2={H_TOP + 8} stroke={vt.grid} strokeWidth={1} />

        {/* ── BOTTOM PANEL: Train / Test error vs degree ── */}
        <text x={PAD} y={ERR_Y0 + 12} fontSize={9} fill={vt.textMuted}>
          Train vs Test error by polynomial degree
        </text>

        {/* Error grid */}
        {[0.25, 0.5, 0.75].map(frac => (
          <g key={frac}>
            <line x1={ERR_PAD_L} y1={errY(maxErr * frac)} x2={W - PAD} y2={errY(maxErr * frac)}
              stroke={vt.grid} strokeWidth={1} />
            <text x={ERR_PAD_L - 4} y={errY(maxErr * frac) + 4}
              textAnchor="end" fontSize={8} fill={vt.textMuted}>
              {(maxErr * frac).toFixed(2)}
            </text>
          </g>
        ))}

        {/* Optimal degree marker */}
        <line x1={errX(optDeg)} y1={ERR_Y0 + 18} x2={errX(optDeg)} y2={errY(0)}
          stroke={accentColor} strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
        <text x={errX(optDeg)} y={ERR_Y0 + 16} textAnchor="middle" fontSize={8}
          fill={accentColor} opacity={0.8}>opt</text>

        {/* Underfitting / Overfitting zone fills */}
        <rect x={ERR_PAD_L} y={ERR_Y0 + 18} width={errX(3) - ERR_PAD_L} height={errY(0) - ERR_Y0 - 18}
          fill="#ff6b6b" opacity={0.04} />
        <rect x={errX(8)} y={ERR_Y0 + 18} width={W - PAD - errX(8)} height={errY(0) - ERR_Y0 - 18}
          fill="#f59e0b" opacity={0.04} />

        {/* Test MSE path (behind) */}
        <path d={testPath} fill="none" stroke="#f59e0b" strokeWidth={2} />
        {/* Train MSE path */}
        <path d={trainPath} fill="none" stroke="#6c63ff" strokeWidth={2} />

        {/* Current degree vertical line */}
        <motion.line
          x1={errX(degree)} y1={ERR_Y0 + 18}
          x2={errX(degree)} y2={errY(0) + 2}
          stroke={diagnosis.color} strokeWidth={2.5}
          animate={{ x1: errX(degree), x2: errX(degree) }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
        {/* Dot on train */}
        <motion.circle
          cx={errX(degree)} cy={errY(currentErr.trainMSE)} r={5}
          fill="#6c63ff"
          animate={{ cx: errX(degree), cy: errY(currentErr.trainMSE) }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
        {/* Dot on test */}
        <motion.circle
          cx={errX(degree)} cy={errY(currentErr.testMSE)} r={5}
          fill="#f59e0b"
          animate={{ cx: errX(degree), cy: errY(currentErr.testMSE) }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />

        {/* Degree axis ticks */}
        <line x1={ERR_PAD_L} y1={errY(0)} x2={W - PAD} y2={errY(0)}
          stroke={vt.axis} strokeWidth={1.5} />
        <line x1={ERR_PAD_L} y1={ERR_Y0 + 18} x2={ERR_PAD_L} y2={errY(0)}
          stroke={vt.axis} strokeWidth={1.5} />
        {DEGREES.filter(d => d % 2 === 1 || d === 1).map(d => (
          <text key={d} x={errX(d)} y={errY(0) + 14}
            textAnchor="middle" fontSize={8} fill={d === degree ? diagnosis.color : vt.textMuted}
            fontWeight={d === degree ? "bold" : "normal"}>
            {d}
          </text>
        ))}
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
          Polynomial Degree →
        </text>

        {/* Error legend */}
        <line x1={W - 120} y1={ERR_Y0 + 28} x2={W - 102} y2={ERR_Y0 + 28}
          stroke="#6c63ff" strokeWidth={2} />
        <text x={W - 98} y={ERR_Y0 + 32} fontSize={8} fill="#6c63ff">Train MSE</text>
        <line x1={W - 120} y1={ERR_Y0 + 42} x2={W - 102} y2={ERR_Y0 + 42}
          stroke="#f59e0b" strokeWidth={2} />
        <text x={W - 98} y={ERR_Y0 + 46} fontSize={8} fill="#f59e0b">Test MSE</text>
      </svg>

      {/* Degree slider */}
      <div className="px-5 pt-2 pb-3 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs w-20" style={{ color: "var(--text-muted)" }}>
            Degree:{" "}
            <span className="font-mono font-bold" style={{ color: accentColor }}>
              {degree}
            </span>
          </span>
          <input
            type="range" min={1} max={MAX_DEGREE} step={1} value={degree}
            onChange={e => setDegree(parseInt(e.target.value))}
            className="flex-1"
            style={{ accentColor: diagnosis.color }}
          />
        </div>
        <motion.div
          key={diagnosis.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            backgroundColor: `${diagnosis.color}12`,
            border: `1px solid ${diagnosis.color}30`,
          }}
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: diagnosis.color }} />
          <span className="text-xs font-semibold" style={{ color: diagnosis.color }}>
            {diagnosis.label}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>— {diagnosis.hint}</span>
        </motion.div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-4 border-t text-center" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "Degree", value: degree.toString(), color: accentColor },
          { label: "Train MSE", value: currentErr.trainMSE.toFixed(3), color: "#6c63ff" },
          { label: "Test MSE", value: currentErr.testMSE.toFixed(3), color: "#f59e0b" },
          { label: "Overfit Gap", value: overfit, color: parseFloat(overfit) > 0.3 ? "#ff6b6b" : accentColor },
        ].map(({ label, value, color }) => (
          <div key={label} className="py-2.5">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
            <div className="text-sm font-bold font-mono" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
