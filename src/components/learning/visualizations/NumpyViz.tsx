"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";
import { useVizTheme } from "@/hooks/useVizTheme";

// ── i18n strings ───────────────────────────────────────────────────────────────
const LABELS = {
  en: {
    title: "NumPy Visualiser",
    tabBroadcast: "Broadcasting",
    tabLoopVec: "Loop vs Vector",
    matA: "A (3×3)",
    matB: "+ b (1×3) broadcast →",
    matRes: "Result (3×3)",
    ruleText: "b is stretched across all 3 rows — no copy in memory.",
    chartTitle: "NumPy is 100-500× faster than Python loops",
    yLabel: "Time (ms)",
    legendLoop: "Python loop",
    legendNumpy: "NumPy",
    insightBroadcastLabel: "Broadcasting:",
    insightBroadcastBody:
      "Broadcasting avoids explicit loops and memory copies — the rule: align shapes from the right, each dimension must be equal or 1.",
    insightVecLabel: "Vectorisation:",
    insightVecBody:
      "NumPy operations run in C/Fortran under the hood. For 1M elements, vectorized is ~400× faster. This matters when you compute gradients over millions of parameters.",
  },
  fr: {
    title: "Visualiseur NumPy",
    tabBroadcast: "Diffusion",
    tabLoopVec: "Boucle vs Vecteur",
    matA: "A (3×3)",
    matB: "+ b (1×3) diffusion →",
    matRes: "Résultat (3×3)",
    ruleText: "b est étiré sur les 3 rangées — aucune copie en mémoire.",
    chartTitle: "NumPy est 100-500× plus rapide que les boucles Python",
    yLabel: "Temps (ms)",
    legendLoop: "Boucle Python",
    legendNumpy: "NumPy",
    insightBroadcastLabel: "Diffusion :",
    insightBroadcastBody:
      "La diffusion évite les boucles explicites et les copies mémoire — règle : alignez les formes par la droite, chaque dimension doit être égale ou 1.",
    insightVecLabel: "Vectorisation :",
    insightVecBody:
      "Les opérations NumPy s'exécutent en C/Fortran en arrière-plan. Pour 1M d'éléments, le vectorisé est ~400× plus rapide. Cela compte lors du calcul de gradients sur des millions de paramètres.",
  },
  ar: {
    title: "مُتخيِّل NumPy",
    tabBroadcast: "البث",
    tabLoopVec: "حلقة مقابل متجه",
    matA: "A (3×3)",
    matB: "+ b (1×3) بث ←",
    matRes: "النتيجة (3×3)",
    ruleText: "يمتد b عبر 3 صفوف — لا نسخ في الذاكرة.",
    chartTitle: "NumPy أسرع بـ 100-500× من حلقات Python",
    yLabel: "الوقت (مللي ث)",
    legendLoop: "حلقة Python",
    legendNumpy: "NumPy",
    insightBroadcastLabel: "البث:",
    insightBroadcastBody:
      "يتجنب البث الحلقات الصريحة ونسخ الذاكرة — القاعدة: قارن الأشكال من اليمين، كل بُعد يجب أن يكون متساوياً أو 1.",
    insightVecLabel: "التجميع:",
    insightVecBody:
      "تعمل عمليات NumPy بلغة C/Fortran في الخلفية. لمليون عنصر، المتجّه أسرع بـ ~400×. هذا مهم عند حساب التدرجات على ملايين المعاملات.",
  },
} as const;

// ── Constants ──────────────────────────────────────────────────────────────────
const W = 520;
const H_BROADCAST = 260;
const H_LOOP = 220;

// ── Fixed data ─────────────────────────────────────────────────────────────────
const A: number[][] = [
  [2, 4, 1],
  [3, 1, 5],
  [1, 2, 3],
];
const B_VEC: number[] = [10, 20, 30];
const RESULT: number[][] = [
  [12, 24, 31],
  [13, 21, 35],
  [11, 22, 33],
];

// Loop vs vectorised illustrative times
const SIZES = ["1k", "10k", "100k", "1M"];
const LOOP_TIMES = [0.8, 7.2, 68, 710];
const NUMPY_TIMES = [0.01, 0.05, 0.2, 1.8];

const ORANGE = "#f97316";
const GREEN = "#22c55e";
const RED = "#ff6b6b";

type Tab = "broadcasting" | "loopvec";

// ── Helpers ────────────────────────────────────────────────────────────────────
function toLog(v: number): number {
  return Math.log10(Math.max(v, 0.001));
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function NumpyViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(LABELS);
  const [tab, setTab] = useState<Tab>("broadcasting");
  const [hoveredBar, setHoveredBar] = useState<{ groupIdx: number; barIdx: number } | null>(null);

  // ── Broadcasting layout ────────────────────────────────────────────────────
  const cellSize = 34;
  const cellGap = 2;
  const matrixWidth = 3 * cellSize + 2 * cellGap;
  const matrixHeight = 3 * cellSize + 2 * cellGap;
  const vecHeight = cellSize;

  // Positions (x, y of top-left)
  const aX = 14;
  const aY = 36;
  const plusX = aX + matrixWidth + 14;
  const bX = plusX + 22;
  const bY = aY + matrixHeight / 2 - vecHeight / 2;
  const arrowX = bX + matrixWidth + 12;
  const resX = arrowX + 28;
  const resY = aY;

  // ── Bar chart layout (log scale) ──────────────────────────────────────────
  const BAR_PAD_L = 52;
  const BAR_PAD_R = 12;
  const BAR_PAD_T = 24;
  const BAR_PAD_B = 36;
  const CHART_W = W - BAR_PAD_L - BAR_PAD_R;
  const CHART_H = H_LOOP - BAR_PAD_T - BAR_PAD_B;
  const Y0 = BAR_PAD_T;
  const Y1 = BAR_PAD_T + CHART_H;
  const X0 = BAR_PAD_L;

  const logMin = -3; // log10(0.001)
  const logMax = toLog(750);

  const yTicks = useMemo(() => {
    const ticks: { val: number; label: string }[] = [
      { val: 0.01, label: "0.01" },
      { val: 0.1, label: "0.1" },
      { val: 1, label: "1" },
      { val: 10, label: "10" },
      { val: 100, label: "100" },
      { val: 1000, label: "1000" },
    ];
    return ticks.filter(t => toLog(t.val) >= logMin && toLog(t.val) <= logMax);
  }, []);

  function logToSvgY(v: number): number {
    const lv = toLog(v);
    return Y1 - ((lv - logMin) / (logMax - logMin)) * CHART_H;
  }

  const groupW = CHART_W / 4;
  const barW = groupW * 0.28;

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
          {(["broadcasting", "loopvec"] as Tab[]).map(t => (
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
              {t === "broadcasting" ? L.tabBroadcast : L.tabLoopVec}
            </button>
          ))}
        </div>
      </div>

      {/* ── Broadcasting tab ── */}
      {tab === "broadcasting" && (
        <svg viewBox={`0 0 ${W} ${H_BROADCAST}`} className="w-full">
          {/* Panel A */}
          <motion.g
            key="panel-a"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0 }}
          >
            <text x={aX + matrixWidth / 2} y={aY - 6} textAnchor="middle" fontSize={10} fill={vt.textMuted}>
              {L.matA}
            </text>
            {A.map((row, ri) =>
              row.map((val, ci) => (
                <g key={`a-${ri}-${ci}`}>
                  <rect
                    x={aX + ci * (cellSize + cellGap)}
                    y={aY + ri * (cellSize + cellGap)}
                    width={cellSize}
                    height={cellSize}
                    rx={4}
                    fill={`${accentColor}18`}
                    stroke={`${accentColor}50`}
                    strokeWidth={1}
                  />
                  <text
                    x={aX + ci * (cellSize + cellGap) + cellSize / 2}
                    y={aY + ri * (cellSize + cellGap) + cellSize / 2 + 5}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight="600"
                    fill={vt.ink(accentColor)}
                  >
                    {val}
                  </text>
                </g>
              ))
            )}
          </motion.g>

          {/* Plus sign */}
          <motion.g
            key="panel-plus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <text
              x={plusX + 10}
              y={aY + matrixHeight / 2 + 6}
              textAnchor="middle"
              fontSize={20}
              fontWeight="bold"
              fill={vt.textMuted}
            >
              +
            </text>
          </motion.g>

          {/* Panel b (row vector) */}
          <motion.g
            key="panel-b"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <text x={bX + matrixWidth / 2} y={bY - 6} textAnchor="middle" fontSize={10} fill={vt.textMuted}>
              {L.matB}
            </text>
            {B_VEC.map((val, ci) => (
              <g key={`b-${ci}`}>
                <rect
                  x={bX + ci * (cellSize + cellGap)}
                  y={bY}
                  width={cellSize}
                  height={cellSize}
                  rx={4}
                  fill={`${ORANGE}22`}
                  stroke={`${ORANGE}66`}
                  strokeWidth={1}
                />
                <text
                  x={bX + ci * (cellSize + cellGap) + cellSize / 2}
                  y={bY + cellSize / 2 + 5}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="600"
                  fill={ORANGE}
                >
                  {val}
                </text>
              </g>
            ))}
            {/* Dashed broadcast lines */}
            {B_VEC.map((_, ci) => {
              const bCellCx = bX + ci * (cellSize + cellGap) + cellSize / 2;
              return [1, 2].map(ri => (
                <line
                  key={`dash-${ci}-${ri}`}
                  x1={bCellCx}
                  y1={bY + cellSize}
                  x2={resX + ci * (cellSize + cellGap) + cellSize / 2}
                  y2={resY + ri * (cellSize + cellGap)}
                  stroke={ORANGE}
                  strokeWidth={0.7}
                  strokeDasharray="3,3"
                  opacity={0.3}
                />
              ));
            })}
          </motion.g>

          {/* Arrow between panels */}
          <motion.g
            key="panel-arrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <line
              x1={arrowX}
              y1={aY + matrixHeight / 2}
              x2={arrowX + 22}
              y2={aY + matrixHeight / 2}
              stroke={vt.axis}
              strokeWidth={1.5}
            />
            <polygon
              points={`${arrowX + 18},${aY + matrixHeight / 2 - 4} ${arrowX + 26},${aY + matrixHeight / 2} ${arrowX + 18},${aY + matrixHeight / 2 + 4}`}
              fill={vt.axis}
            />
          </motion.g>

          {/* Panel Result */}
          <motion.g
            key="panel-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <text x={resX + matrixWidth / 2} y={resY - 6} textAnchor="middle" fontSize={10} fill={vt.textMuted}>
              {L.matRes}
            </text>
            {RESULT.map((row, ri) =>
              row.map((val, ci) => (
                <g key={`res-${ri}-${ci}`}>
                  <rect
                    x={resX + ci * (cellSize + cellGap)}
                    y={resY + ri * (cellSize + cellGap)}
                    width={cellSize}
                    height={cellSize}
                    rx={4}
                    fill={`${GREEN}18`}
                    stroke={`${GREEN}55`}
                    strokeWidth={1}
                  />
                  <text
                    x={resX + ci * (cellSize + cellGap) + cellSize / 2}
                    y={resY + ri * (cellSize + cellGap) + cellSize / 2 + 5}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight="600"
                    fill={GREEN}
                  >
                    {val}
                  </text>
                </g>
              ))
            )}
          </motion.g>

          {/* Rule text */}
          <text
            x={W / 2}
            y={H_BROADCAST - 12}
            textAnchor="middle"
            fontSize={10}
            fill={vt.textMuted}
          >
            {L.ruleText}
          </text>
        </svg>
      )}

      {/* ── Loop vs Vector tab ── */}
      {tab === "loopvec" && (
        <svg viewBox={`0 0 ${W} ${H_LOOP}`} className="w-full">
          {/* Title */}
          <text x={W / 2} y={14} textAnchor="middle" fontSize={10} fontWeight="600" fill={vt.textMuted}>
            {L.chartTitle}
          </text>

          {/* Y grid + axis labels */}
          {yTicks.map(tick => {
            const cy = logToSvgY(tick.val);
            return (
              <g key={tick.label}>
                <line x1={X0} y1={cy} x2={X0 + CHART_W} y2={cy} stroke={vt.grid} strokeWidth={1} />
                <text x={X0 - 3} y={cy + 3} fontSize={9} fill={vt.textMuted} textAnchor="end">
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Y axis label */}
          <text
            x={10}
            y={Y0 + CHART_H / 2}
            fontSize={9}
            fill={vt.textMuted}
            textAnchor="middle"
            transform={`rotate(-90, 10, ${Y0 + CHART_H / 2})`}
          >
            {L.yLabel}
          </text>

          {/* Axes */}
          <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke={vt.axis} strokeWidth={1.5} />
          <line x1={X0} y1={Y1} x2={X0 + CHART_W} y2={Y1} stroke={vt.axis} strokeWidth={1.5} />

          {/* Bars */}
          {SIZES.map((size, gi) => {
            const groupCenterX = X0 + gi * groupW + groupW / 2;
            const loopBarX = groupCenterX - barW - 2;
            const numpyBarX = groupCenterX + 2;

            const loopY = logToSvgY(LOOP_TIMES[gi]);
            const numpyY = logToSvgY(NUMPY_TIMES[gi]);

            const loopHovered = hoveredBar?.groupIdx === gi && hoveredBar?.barIdx === 0;
            const numpyHovered = hoveredBar?.groupIdx === gi && hoveredBar?.barIdx === 1;

            return (
              <g key={`group-${gi}`}>
                {/* Loop bar */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: gi * 0.05 }}
                >
                  <rect
                    x={loopBarX}
                    y={loopY}
                    width={barW}
                    height={Y1 - loopY}
                    rx={2}
                    fill={RED}
                    opacity={loopHovered ? 1 : 0.75}
                    onMouseEnter={() => setHoveredBar({ groupIdx: gi, barIdx: 0 })}
                    onMouseLeave={() => setHoveredBar(null)}
                    style={{ cursor: "pointer" }}
                  />
                  {loopHovered && (
                    <text
                      x={loopBarX + barW / 2}
                      y={loopY - 4}
                      textAnchor="middle"
                      fontSize={9}
                      fill={RED}
                      fontWeight="bold"
                    >
                      {LOOP_TIMES[gi]}ms
                    </text>
                  )}
                </motion.g>

                {/* NumPy bar */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: gi * 0.05 + 0.025 }}
                >
                  <rect
                    x={numpyBarX}
                    y={numpyY}
                    width={barW}
                    height={Y1 - numpyY}
                    rx={2}
                    fill={accentColor}
                    opacity={numpyHovered ? 1 : 0.75}
                    onMouseEnter={() => setHoveredBar({ groupIdx: gi, barIdx: 1 })}
                    onMouseLeave={() => setHoveredBar(null)}
                    style={{ cursor: "pointer" }}
                  />
                  {numpyHovered && (
                    <text
                      x={numpyBarX + barW / 2}
                      y={numpyY - 4}
                      textAnchor="middle"
                      fontSize={9}
                      fill={vt.ink(accentColor)}
                      fontWeight="bold"
                    >
                      {NUMPY_TIMES[gi]}ms
                    </text>
                  )}
                </motion.g>

                {/* X axis label */}
                <text
                  x={groupCenterX}
                  y={Y1 + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill={vt.textMuted}
                >
                  {size}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <rect x={X0 + 4} y={Y0 + 2} width={10} height={10} rx={2} fill={RED} opacity={0.8} />
          <text x={X0 + 18} y={Y0 + 11} fontSize={9} fill={vt.textMuted}>{L.legendLoop}</text>
          <rect x={X0 + 80} y={Y0 + 2} width={10} height={10} rx={2} fill={accentColor} opacity={0.8} />
          <text x={X0 + 94} y={Y0 + 11} fontSize={9} fill={vt.textMuted}>{L.legendNumpy}</text>
        </svg>
      )}

      {/* ── Insight bar ── */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="px-4 py-2 border-t"
        style={{ borderColor: "var(--border)", backgroundColor: vt.surface }}
      >
        <p className="text-xs" style={{ color: vt.textMuted }}>
          {tab === "broadcasting" ? (
            <>
              <span style={{ color: accentColor, fontWeight: 600 }}>{L.insightBroadcastLabel}</span>{" "}
              {L.insightBroadcastBody}
            </>
          ) : (
            <>
              <span style={{ color: accentColor, fontWeight: 600 }}>{L.insightVecLabel}</span>{" "}
              {L.insightVecBody}
            </>
          )}
        </p>
      </motion.div>
    </VizCard>
  );
}
