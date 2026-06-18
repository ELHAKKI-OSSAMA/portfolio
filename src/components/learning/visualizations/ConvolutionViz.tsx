"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const CONV_LABELS = {
  en: {
    title: "CNN Operations",
    convSubtitle: "8×8 input → 3×3 kernel → 6×6 feature map",
    pipelineSubtitle: "Feature map → ReLU → 2×2 Max Pool",
    tabConv: "Convolution",
    tabPipeline: "ReLU + Pool",
    kernelLabel: "Kernel:",
    kernelNames: ["Edge Detect", "Horizontal", "Vertical", "Blur"] as readonly string[],
    svgInput: "Input (8×8)",
    svgKernel: "Kernel (3×3)",
    svgFeatureMap: "Feature Map (6×6)",
    pause: "Pause",
    animate: "Animate",
    resume: "Resume",
    computed: (n: number) => `${n}/36 computed`,
    outputLabel: "output =",
    svgFmLabel: "Feature Map",
    svgReluLabel: "After ReLU",
    svgPoolLabel: "After 2×2 MaxPool",
    animatePool: "Animate Pool",
    hintPre: "ReLU kills",
    hintNeg: "negative activations",
    hintPost: "· 2×2 MaxPool: 6×6 →",
    legendFm: "Feature Map",
    legendFmVal: "6×6",
    legendRelu: "After ReLU",
    legendReluVal: "6×6 (neg → 0)",
    legendPool: "After MaxPool",
    legendPoolVal: "3×3",
  },
  fr: {
    title: "Opérations CNN",
    convSubtitle: "entrée 8×8 → noyau 3×3 → carte 6×6",
    pipelineSubtitle: "Carte de caractéristiques → ReLU → MaxPool 2×2",
    tabConv: "Convolution",
    tabPipeline: "ReLU + Pool",
    kernelLabel: "Noyau :",
    kernelNames: ["Détection contours", "Horizontal", "Vertical", "Flou"] as readonly string[],
    svgInput: "Entrée (8×8)",
    svgKernel: "Noyau (3×3)",
    svgFeatureMap: "Carte de caract. (6×6)",
    pause: "Pause",
    animate: "Animer",
    resume: "Reprendre",
    computed: (n: number) => `${n}/36 calculés`,
    outputLabel: "sortie =",
    svgFmLabel: "Carte de caract.",
    svgReluLabel: "Après ReLU",
    svgPoolLabel: "Après MaxPool 2×2",
    animatePool: "Animer Pool",
    hintPre: "ReLU supprime les",
    hintNeg: "activations négatives",
    hintPost: "· MaxPool 2×2 : 6×6 →",
    legendFm: "Carte de caract.",
    legendFmVal: "6×6",
    legendRelu: "Après ReLU",
    legendReluVal: "6×6 (nég → 0)",
    legendPool: "Après MaxPool",
    legendPoolVal: "3×3",
  },
  ar: {
    title: "عمليات CNN",
    convSubtitle: "مدخل 8×8 → نواة 3×3 → خريطة 6×6",
    pipelineSubtitle: "خريطة الميزات → ReLU → MaxPool 2×2",
    tabConv: "الالتفاف",
    tabPipeline: "ReLU + Pool",
    kernelLabel: "النواة:",
    kernelNames: ["كشف الحواف", "أفقي", "عمودي", "تمويه"] as readonly string[],
    svgInput: "المدخل (8×8)",
    svgKernel: "النواة (3×3)",
    svgFeatureMap: "خريطة الميزات (6×6)",
    pause: "إيقاف مؤقت",
    animate: "تحريك",
    resume: "استئناف",
    computed: (n: number) => `${n}/36 محسوب`,
    outputLabel: "الخرج =",
    svgFmLabel: "خريطة الميزات",
    svgReluLabel: "بعد ReLU",
    svgPoolLabel: "بعد MaxPool 2×2",
    animatePool: "تحريك Pool",
    hintPre: "يُلغي ReLU",
    hintNeg: "التنشيطات السلبية",
    hintPost: "· MaxPool 2×2: 6×6 →",
    legendFm: "خريطة الميزات",
    legendFmVal: "6×6",
    legendRelu: "بعد ReLU",
    legendReluVal: "6×6 (سلبي → 0)",
    legendPool: "بعد MaxPool",
    legendPoolVal: "3×3",
  },
} as const;

// ── Input + Kernels ───────────────────────────────────────────────────────────
const INPUT_8: number[][] = [
  [0.1, 0.1, 0.1, 0.9, 0.9, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.9, 0.9, 0.9, 0.9, 0.1, 0.1],
  [0.1, 0.9, 0.9, 0.1, 0.1, 0.9, 0.9, 0.1],
  [0.9, 0.9, 0.1, 0.1, 0.1, 0.1, 0.9, 0.9],
  [0.9, 0.9, 0.1, 0.1, 0.1, 0.1, 0.9, 0.9],
  [0.1, 0.9, 0.9, 0.1, 0.1, 0.9, 0.9, 0.1],
  [0.1, 0.1, 0.9, 0.9, 0.9, 0.9, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.9, 0.9, 0.1, 0.1, 0.1],
];

const KERNELS = [
  { name: "Edge Detect", values: [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]] },
  { name: "Horizontal",  values: [[-1,-1,-1],[0,0,0],[1,1,1]] },
  { name: "Vertical",    values: [[-1,0,1],[-1,0,1],[-1,0,1]] },
  { name: "Blur",        values: [[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]] },
];

// ── Math helpers ──────────────────────────────────────────────────────────────
function applyConv(input: number[][], kernel: number[][]): number[][] {
  return Array.from({ length: 6 }, (_, r) =>
    Array.from({ length: 6 }, (_, c) => {
      let s = 0;
      for (let kr = 0; kr < 3; kr++)
        for (let kc = 0; kc < 3; kc++)
          s += input[r + kr][c + kc] * kernel[kr][kc];
      return s;
    })
  );
}

function normalize(m: number[][]): number[][] {
  const flat = m.flat();
  const min = Math.min(...flat), max = Math.max(...flat);
  const range = max - min || 1;
  return m.map(row => row.map(v => (v - min) / range));
}

function applyReLU(m: number[][]): number[][] {
  return m.map(row => row.map(v => Math.max(0, v)));
}

function maxPool2x2(m: number[][]): number[][] {
  // 6×6 → 3×3
  return Array.from({ length: 3 }, (_, r) =>
    Array.from({ length: 3 }, (_, c) =>
      Math.max(m[r*2][c*2], m[r*2][c*2+1], m[r*2+1][c*2], m[r*2+1][c*2+1])
    )
  );
}

// ── Color helpers ─────────────────────────────────────────────────────────────
function cellColor(v: number, isDark: boolean) {
  if (isDark) {
    // dark navy (low) → bright sky blue (high) — never pure black
    const r = Math.round(40 + v * 80);
    const g = Math.round(50 + v * 160);
    const b = Math.round(100 + v * 150);
    return `rgb(${r},${g},${b})`;
  }
  const i = Math.round(v * 255);
  return `rgb(${255 - i},${255 - Math.round(i * 0.7)},${255 - Math.round(i * 0.5)})`;
}

function kernelColor(v: number) {
  if (v > 0.5) return "#00d4aa";
  if (v < -0.5) return "#ff6b6b";
  return "#f59e0b";
}

// ── Layout constants ──────────────────────────────────────────────────────────
const CELL = 34;
const GAP  = 22;
const INPUT_OFF  = 0;
const KERNEL_OFF = INPUT_OFF + 8 * CELL + GAP + 18;
const OUTPUT_OFF = KERNEL_OFF + 3 * CELL + GAP + 28;
const TOTAL_W    = OUTPUT_OFF + 6 * CELL + 8;

// Pipeline section layout
const PC = 28;  // pool cell size (slightly smaller)

// ── Component ─────────────────────────────────────────────────────────────────
type Tab = "conv" | "pipeline";

export default function ConvolutionViz({ accentColor = "#06b6d4" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(CONV_LABELS);
  const [kernelIdx, setKernelIdx]   = useState(0);
  const [pos, setPos]               = useState(0);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [revealed, setRevealed]     = useState(new Set<number>());
  const [tab, setTab]               = useState<Tab>("conv");
  const [poolPos, setPoolPos]       = useState(-1); // -1 = idle, 0-8 = animating

  const kernel    = KERNELS[kernelIdx].values;
  const outputRaw = applyConv(INPUT_8, kernel);
  const outputNorm = normalize(outputRaw);
  // Also compute raw (not normalized) for showing negative values in ReLU demo
  const featureMapRaw = normalize(outputRaw); // values in [0,1]
  const shiftedToCenter = outputRaw.map(row => row.map(v => v)); // keep raw for ReLU demo
  const rawNorm2 = normalize(outputRaw); // 0-1 normalized
  // For ReLU: values below 0.5 are "negative" in the centered sense
  const reluInput = rawNorm2; // use centered: values < 0.5 → 0 after shifting
  const relued = applyReLU(rawNorm2.map(row => row.map(v => v - 0.5))).map(row => row.map(v => v + 0));
  const reluedNorm = normalize(relued);
  const pooled = maxPool2x2(reluedNorm);

  const row = Math.floor(pos / 6);
  const col = pos % 6;

  const reset = useCallback(() => {
    setPos(0);
    setIsPlaying(false);
    setRevealed(new Set());
  }, []);

  useEffect(() => { reset(); }, [kernelIdx, reset]);

  // Conv animation
  useEffect(() => {
    if (!isPlaying || tab !== "conv") return;
    const t = setTimeout(() => {
      setRevealed(prev => new Set([...prev, pos]));
      if (pos < 35) setPos(p => p + 1);
      else setIsPlaying(false);
    }, 70);
    return () => clearTimeout(t);
  }, [isPlaying, pos, tab]);

  // Pool animation
  useEffect(() => {
    if (tab !== "pipeline" || poolPos < 0 || poolPos >= 9) return;
    const t = setTimeout(() => {
      setPoolPos(p => (p < 8 ? p + 1 : -2)); // -2 = done
    }, 220);
    return () => clearTimeout(t);
  }, [poolPos, tab]);

  return (
    <VizCard>
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {tab === "conv" ? L.convSubtitle : L.pipelineSubtitle}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {(["conv", "pipeline"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: tab === t ? `${accentColor}25` : "var(--bg-card)",
                color: tab === t ? accentColor : "var(--text-muted)",
                border: `1px solid ${tab === t ? accentColor + "50" : "var(--border)"}`,
              }}>
              {t === "conv" ? L.tabConv : L.tabPipeline}
            </button>
          ))}
        </div>
      </div>

      {/* ── Kernel selector ── */}
      <div className="flex items-center gap-2 px-5 py-2 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{L.kernelLabel}</span>
        {KERNELS.map((k, i) => (
          <button key={k.name} onClick={() => setKernelIdx(i)}
            className="px-2 py-0.5 rounded-md text-xs font-medium transition-all"
            style={{
              backgroundColor: kernelIdx === i ? `${accentColor}25` : "transparent",
              color: kernelIdx === i ? accentColor : "var(--text-muted)",
              border: `1px solid ${kernelIdx === i ? accentColor + "50" : "transparent"}`,
            }}>
            {L.kernelNames[i]}
          </button>
        ))}
      </div>

      {/* ── TAB: Convolution animation ── */}
      {tab === "conv" && (
        <>
          <div className="overflow-x-auto px-3 pt-4 pb-2">
            <svg viewBox={`0 0 ${TOTAL_W} ${8 * CELL + 22}`} style={{ width: "100%", minWidth: 400 }}>
              {/* Input label */}
              <text x={INPUT_OFF + 4 * CELL} y={8 * CELL + 16} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{L.svgInput}</text>

              {/* Input grid */}
              {INPUT_8.map((rowArr, r) =>
                rowArr.map((v, c) => {
                  const inK = r >= row && r < row + 3 && c >= col && c < col + 3;
                  return (
                    <rect key={`in-${r}-${c}`}
                      x={INPUT_OFF + c * CELL} y={r * CELL}
                      width={CELL - 2} height={CELL - 2} rx={2}
                      fill={cellColor(v, vt.isDark)}
                      stroke={inK ? accentColor : "none"}
                      strokeWidth={inK ? 2 : 0}
                      opacity={inK ? 1 : 0.75}
                    />
                  );
                })
              )}

              {/* Kernel highlight box */}
              <motion.rect
                x={INPUT_OFF + col * CELL - 1} y={row * CELL - 1}
                width={3 * CELL} height={3 * CELL}
                fill={accentColor} opacity={0.13} rx={4}
                animate={{ x: INPUT_OFF + col * CELL - 1, y: row * CELL - 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />

              {/* ✱ */}
              <text x={KERNEL_OFF - 14} y={4 * CELL + 5} textAnchor="middle" fontSize={16} fill={vt.ink(accentColor)} opacity={0.8}>✱</text>

              {/* Kernel grid */}
              <text x={KERNEL_OFF + 1.5 * CELL} y={8 * CELL + 16} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{L.svgKernel}</text>
              {kernel.map((rowArr, r) =>
                rowArr.map((v, c) => {
                  const kc = kernelColor(v);
                  return (
                    <g key={`k-${r}-${c}`}>
                      <rect x={KERNEL_OFF + c * CELL} y={r * CELL} width={CELL - 2} height={CELL - 2}
                        rx={4} fill={`${kc}28`} stroke={kc} strokeWidth={1.5} />
                      <text x={KERNEL_OFF + c * CELL + CELL / 2} y={r * CELL + CELL / 2 + 4}
                        textAnchor="middle" fontSize={9} fill={kc} fontFamily="monospace">
                        {v.toFixed(v % 1 === 0 ? 0 : 1)}
                      </text>
                    </g>
                  );
                })
              )}

              {/* = */}
              <text x={OUTPUT_OFF - 14} y={4 * CELL + 5} textAnchor="middle" fontSize={16} fill={vt.ink(accentColor)} opacity={0.8}>=</text>

              {/* Feature map output */}
              <text x={OUTPUT_OFF + 3 * CELL} y={8 * CELL + 16} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{L.svgFeatureMap}</text>
              {Array.from({ length: 6 }, (_, r) =>
                Array.from({ length: 6 }, (_, c) => {
                  const isRev = revealed.has(r * 6 + c);
                  const isCur = row === r && col === c;
                  const v = outputNorm[r]?.[c] ?? 0;
                  return (
                    <g key={`out-${r}-${c}`}>
                      <rect x={OUTPUT_OFF + c * CELL} y={r * CELL} width={CELL - 2} height={CELL - 2}
                        rx={2}
                        fill={isRev ? cellColor(v, vt.isDark) : vt.surface}
                        stroke={isCur ? accentColor : "none"}
                        strokeWidth={isCur ? 2.5 : 0}
                        opacity={isRev ? 1 : 0.35}
                      />
                      {isRev && (
                        <text x={OUTPUT_OFF + c * CELL + CELL / 2} y={r * CELL + CELL / 2 + 4}
                          textAnchor="middle" fontSize={8}
                          fill={vt.isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)"}
                          fontFamily="monospace">
                          {v.toFixed(2)}
                        </text>
                      )}
                    </g>
                  );
                })
              )}
            </svg>
          </div>

          <div className="px-5 pb-4 pt-2 border-t flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}50` }}
            >
              {isPlaying ? <><Pause size={11} /> {L.pause}</> : <><Play size={11} /> {revealed.size === 0 ? L.animate : L.resume}</>}
            </button>
            <button onClick={reset} className="p-1.5 rounded-lg"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              <RotateCcw size={12} />
            </button>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              [{row},{col}] · {L.computed(revealed.size)} ·
              {L.outputLabel} <span className="font-mono" style={{ color: accentColor }}>
                {outputNorm[row]?.[col]?.toFixed(3)}
              </span>
            </span>
          </div>
        </>
      )}

      {/* ── TAB: ReLU + Pool pipeline ── */}
      {tab === "pipeline" && (() => {
        // Pool animation: highlight 2x2 block being pooled
        const poolRow = poolPos >= 0 ? Math.floor(poolPos / 3) : -1;
        const poolCol = poolPos >= 0 ? poolPos % 3 : -1;

        // SVG layout: three 6x6 (or 3x3) grids
        const P_CELL_FM = 36;  // feature map cell
        const P_CELL_PL = 52;  // pooled cell (bigger)
        const P_GAP = 36;
        const OFF_FM   = 8;
        const OFF_RELU = OFF_FM + 6 * P_CELL_FM + P_GAP;
        const OFF_POOL = OFF_RELU + 6 * P_CELL_FM + P_GAP;
        const P_TOTAL  = OFF_POOL + 3 * P_CELL_PL + 8;
        const P_H      = 6 * P_CELL_FM + 24;

        return (
          <>
            <div className="overflow-x-auto px-3 pt-4 pb-2">
              <svg viewBox={`0 0 ${P_TOTAL} ${P_H}`} style={{ width: "100%", minWidth: 400 }}>

                {/* Labels */}
                <text x={OFF_FM + 3 * P_CELL_FM} y={P_H - 6} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{L.svgFmLabel}</text>
                <text x={OFF_RELU + 3 * P_CELL_FM} y={P_H - 6} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{L.svgReluLabel}</text>
                <text x={OFF_POOL + 1.5 * P_CELL_PL} y={P_H - 6} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{L.svgPoolLabel}</text>

                {/* Arrows */}
                <text x={OFF_FM + 6 * P_CELL_FM + 6} y={3 * P_CELL_FM + 6} fontSize={14} fill={vt.ink(accentColor)} opacity={0.7}>→</text>
                <text x={OFF_RELU - 4} y={3 * P_CELL_FM - 12} textAnchor="middle" fontSize={8}
                  fill={vt.ink(accentColor)} fontFamily="monospace">ReLU</text>
                <text x={OFF_RELU + 6 * P_CELL_FM + 6} y={3 * P_CELL_FM + 6} fontSize={14} fill={vt.ink(accentColor)} opacity={0.7}>→</text>
                <text x={OFF_RELU + 6 * P_CELL_FM + P_GAP / 2} y={3 * P_CELL_FM - 12} textAnchor="middle" fontSize={8}
                  fill={vt.ink(accentColor)} fontFamily="monospace">MaxPool</text>

                {/* ── Feature Map (raw conv output, 0-1 normalized) ── */}
                {Array.from({ length: 6 }, (_, r) =>
                  Array.from({ length: 6 }, (_, c) => {
                    const v = featureMapRaw[r][c];
                    const isPoolBlock = poolRow >= 0 && Math.floor(r/2) === poolRow && Math.floor(c/2) === poolCol;
                    return (
                      <g key={`fm-${r}-${c}`}>
                        <rect x={OFF_FM + c * P_CELL_FM} y={r * P_CELL_FM}
                          width={P_CELL_FM - 2} height={P_CELL_FM - 2} rx={2}
                          fill={cellColor(v, vt.isDark)}
                          stroke={isPoolBlock ? "#f59e0b" : "none"}
                          strokeWidth={isPoolBlock ? 2 : 0}
                          opacity={isPoolBlock ? 1 : 0.85}
                        />
                        <text x={OFF_FM + c * P_CELL_FM + P_CELL_FM / 2} y={r * P_CELL_FM + P_CELL_FM / 2 + 4}
                          textAnchor="middle" fontSize={8}
                          fill={vt.isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)"}
                          fontFamily="monospace">
                          {v.toFixed(2)}
                        </text>
                      </g>
                    );
                  })
                )}

                {/* ── After ReLU (negatives zeroed) ── */}
                {Array.from({ length: 6 }, (_, r) =>
                  Array.from({ length: 6 }, (_, c) => {
                    const raw = featureMapRaw[r][c] - 0.5; // shift center
                    const activated = Math.max(0, raw) + 0.5; // relu
                    const isKilled = raw < 0;
                    const isPoolBlock = poolRow >= 0 && Math.floor(r/2) === poolRow && Math.floor(c/2) === poolCol;
                    return (
                      <g key={`relu-${r}-${c}`}>
                        <motion.rect x={OFF_RELU + c * P_CELL_FM} y={r * P_CELL_FM}
                          width={P_CELL_FM - 2} height={P_CELL_FM - 2} rx={2}
                          fill={isKilled
                            ? (vt.isDark ? "rgba(255,107,107,0.15)" : "rgba(255,107,107,0.12)")
                            : cellColor(activated, vt.isDark)}
                          stroke={isPoolBlock ? "#f59e0b" : isKilled ? "#ff6b6b" : "none"}
                          strokeWidth={isPoolBlock ? 2 : isKilled ? 1 : 0}
                          opacity={isKilled ? 0.6 : 0.9}
                        />
                        <text x={OFF_RELU + c * P_CELL_FM + P_CELL_FM / 2} y={r * P_CELL_FM + P_CELL_FM / 2 + 4}
                          textAnchor="middle" fontSize={8}
                          fill={isKilled ? "#ff6b6b" : (vt.isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)")}
                          fontFamily="monospace">
                          {isKilled ? "0" : (activated).toFixed(2)}
                        </text>
                      </g>
                    );
                  })
                )}

                {/* ── Pool highlight on relu grid (animated) ── */}
                {poolRow >= 0 && (
                  <motion.rect
                    x={OFF_RELU + poolCol * 2 * P_CELL_FM - 1}
                    y={poolRow * 2 * P_CELL_FM - 1}
                    width={2 * P_CELL_FM + 1} height={2 * P_CELL_FM + 1}
                    fill="#f59e0b" opacity={0.15} rx={4}
                    stroke="#f59e0b" strokeWidth={2}
                    animate={{
                      x: OFF_RELU + poolCol * 2 * P_CELL_FM - 1,
                      y: poolRow * 2 * P_CELL_FM - 1,
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                  />
                )}

                {/* ── After MaxPool (3×3) ── */}
                {Array.from({ length: 3 }, (_, r) =>
                  Array.from({ length: 3 }, (_, c) => {
                    const v = pooled[r][c];
                    const isAnimating = poolRow === r && poolCol === c;
                    const isDone = poolPos === -2 || (poolPos >= 0 && r * 3 + c < poolPos);
                    const visible = isDone || isAnimating || poolPos < 0;
                    return (
                      <g key={`pool-${r}-${c}`}>
                        <AnimatePresence>
                          {visible && (
                            <motion.rect
                              x={OFF_POOL + c * P_CELL_PL} y={r * P_CELL_PL}
                              width={P_CELL_PL - 3} height={P_CELL_PL - 3} rx={4}
                              fill={cellColor(v, vt.isDark)}
                              stroke={isAnimating ? "#f59e0b" : "none"}
                              strokeWidth={2}
                              initial={poolPos >= 0 ? { opacity: 0, scale: 0.7 } : { opacity: 1, scale: 1 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.25 }}
                            />
                          )}
                        </AnimatePresence>
                        {visible && (
                          <text x={OFF_POOL + c * P_CELL_PL + P_CELL_PL / 2} y={r * P_CELL_PL + P_CELL_PL / 2 + 4}
                            textAnchor="middle" fontSize={10}
                            fill={vt.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)"}
                            fontFamily="monospace" fontWeight="bold">
                            {v.toFixed(2)}
                          </text>
                        )}
                      </g>
                    );
                  })
                )}
              </svg>
            </div>

            {/* Pipeline controls */}
            <div className="px-5 pb-4 pt-2 border-t flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={() => setPoolPos(0)}
                disabled={poolPos >= 0 && poolPos < 9}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: `${accentColor}25`, color: accentColor,
                  border: `1px solid ${accentColor}50`,
                  opacity: (poolPos >= 0 && poolPos < 9) ? 0.5 : 1,
                }}
              >
                <Play size={11} />
                {L.animatePool}
              </button>
              <button onClick={() => setPoolPos(-1)} className="p-1.5 rounded-lg"
                style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                <RotateCcw size={12} />
              </button>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {L.hintPre} <span style={{ color: "#ff6b6b" }}>{L.hintNeg}</span> {L.hintPost} <span style={{ color: "#f59e0b" }}>3×3</span>
              </span>
            </div>

            {/* Pipeline legend */}
            <StatGrid py="py-2.5" items={[
                { label: L.legendFm, value: L.legendFmVal, color: accentColor },
                { label: L.legendRelu, value: L.legendReluVal, color: "#ff6b6b" },
                { label: L.legendPool, value: L.legendPoolVal, color: "#f59e0b" },
            ]} />
          </>
        );
      })()}
    </VizCard>
  );
}
