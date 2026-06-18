"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const SP_LABELS = {
  en: {
    title: "Audio Feature Extraction Pipeline",
    tabs: ["Waveform", "Spectrogram", "Mel Spectrogram"] as readonly string[],
    timeAxis: "Time (samples)",
    ampAxis: "Amplitude",
    stftXAxis: "Time frames",
    melXAxis: "Time (10ms frames)",
    insights: {
      waveform: "Raw audio = pressure values sampled 16,000×/sec. This signal mixes 3 sinusoids — F1=low (0.6 amplitude), F2=mid (0.4), F3=high (0.2).",
      spectrogram: "STFT applies a sliding window FFT — each column is one 25ms frame. Bright cells = strong frequency at that time. Both F1 and F2 are clearly visible.",
      mel: "Mel scale compresses high frequencies (humans hear logarithmically). 80 Mel bins replace thousands of FFT bins — the standard input format for speech models like Whisper.",
    },
  },
  fr: {
    title: "Pipeline d'Extraction de Caractéristiques Audio",
    tabs: ["Forme d'onde", "Spectrogramme", "Spectrogramme Mel"] as readonly string[],
    timeAxis: "Temps (échantillons)",
    ampAxis: "Amplitude",
    stftXAxis: "Trames temporelles",
    melXAxis: "Temps (trames de 10ms)",
    insights: {
      waveform: "Audio brut = valeurs de pression échantillonnées 16 000×/sec. Ce signal mélange 3 sinusoïdes — F1=bas (amplitude 0.6), F2=moyen (0.4), F3=haut (0.2).",
      spectrogram: "La STFT applique une FFT à fenêtre glissante — chaque colonne est une trame de 25ms. Les cellules lumineuses = forte fréquence à ce moment. F1 et F2 sont clairement visibles.",
      mel: "L'échelle Mel compresse les hautes fréquences (l'humain entend de manière logarithmique). 80 bins Mel remplacent des milliers de bins FFT — le format d'entrée standard pour les modèles de parole comme Whisper.",
    },
  },
  ar: {
    title: "خط أنابيب استخراج الميزات الصوتية",
    tabs: ["شكل الموجة", "مخطط الطيف", "مخطط الطيف Mel"] as readonly string[],
    timeAxis: "الزمن (عينات)",
    ampAxis: "السعة",
    stftXAxis: "الإطارات الزمنية",
    melXAxis: "الزمن (إطارات 10ms)",
    insights: {
      waveform: "الصوت الخام = قيم الضغط المُعيَّنة 16,000×/ثانية. يمزج هذا الإشارة 3 موجات جيبية — F1=منخفض (سعة 0.6)، F2=متوسط (0.4)، F3=مرتفع (0.2).",
      spectrogram: "تطبّق STFT FFT بنافذة منزلقة — كل عمود يمثل إطاراً واحداً بـ25ms. الخلايا المضيئة = تردد قوي في ذلك الوقت. كلا F1 وF2 مرئيان بوضوح.",
      mel: "يضغط مقياس Mel الترددات العالية (يسمع البشر بشكل لوغاريتمي). تحل 80 حزمة Mel محل الآلاف من حزم FFT — تنسيق الإدخال القياسي لنماذج الكلام مثل Whisper.",
    },
  },
} as const;

// ── Constants ─────────────────────────────────────────────────────────────────
const W = 520;
const H_WAVE = 200;
const H_SPEC = 260;

const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 36;

// ── Signal generation (deterministic) ────────────────────────────────────────
const N_SAMPLES = 64;
const SIGNAL: number[] = Array.from({ length: N_SAMPLES }, (_, i) => {
  const t = (i / (N_SAMPLES - 1)) * 4 * Math.PI;
  return 0.6 * Math.sin(1 * t) + 0.4 * Math.sin(3 * t) + 0.2 * Math.sin(7 * t);
});

// ── STFT simulation (8×8) ─────────────────────────────────────────────────────
const STFT_AMP = [0.6, 0.3, 0.15, 0.08, 0.04, 0.4, 0.2, 0.1];
const STFT_GRID: number[][] = Array.from({ length: 8 }, (_, f) =>
  Array.from({ length: 8 }, (_, t) =>
    STFT_AMP[f] * (1 + 0.3 * Math.sin(t * f * 0.8))
  )
);

// ── Mel simulation (8×8) ─────────────────────────────────────────────────────
const MEL_AMP = [0.8, 0.5, 0.35, 0.25, 0.18, 0.15, 0.10, 0.06];
const MEL_GRID: number[][] = Array.from({ length: 8 }, (_, f) =>
  Array.from({ length: 8 }, (_, t) =>
    MEL_AMP[f] * (1 + 0.25 * Math.sin(t * (f + 1) * 0.6))
  )
);

// ── Max values for normalisation ──────────────────────────────────────────────
function gridMax(grid: number[][]): number {
  return grid.reduce((m, row) => Math.max(m, ...row), 0);
}
const STFT_MAX = gridMax(STFT_GRID);
const MEL_MAX = gridMax(MEL_GRID);

// ── Freq / Mel axis labels ────────────────────────────────────────────────────
const FREQ_LABELS = ["0", "1k", "2k", "3k", "4k", "5k", "6k", "8k"];
const MEL_LABELS  = ["80", "200", "400", "800", "1.2k", "2k", "3.5k", "8k"];

type Tab = "waveform" | "spectrogram" | "mel";

const TAB_IDS: Tab[] = ["waveform", "spectrogram", "mel"];

// ── Waveform tab ──────────────────────────────────────────────────────────────
function WaveformTab({ accentColor, vt }: { accentColor: string; vt: ReturnType<typeof useVizTheme> }) {
  const L = useVizLocale(SP_LABELS);
  const plotW = W - PAD_L - PAD_R;
  const plotH = H_WAVE - PAD_T - PAD_B;
  const midY  = PAD_T + plotH / 2;

  const xScale = (i: number) => PAD_L + (i / (N_SAMPLES - 1)) * plotW;
  const yScale = (v: number) => midY - v * (plotH / 2) * 0.9;

  // Build path string
  const points = SIGNAL.map((v, i) => `${xScale(i)},${yScale(v)}`);

  const linePath = `M ${points.join(" L ")}`;
  const fillPath =
    `M ${xScale(0)},${midY} L ${points.join(" L ")} L ${xScale(N_SAMPLES - 1)},${midY} Z`;

  const xTicks = [0, 16, 32, 48, 64];
  const yTicks = [-1, 0, 1];

  // Mini legend sinusoids
  const miniSin = (freq: number, amp: number, startX: number, labelY: number) => {
    const pts = Array.from({ length: 20 }, (_, i) => {
      const t  = (i / 19) * Math.PI * 2;
      const sx = startX + i * (30 / 19);
      const sy = labelY - amp * 6 * Math.sin(freq * t);
      return `${sx},${sy}`;
    });
    return `M ${pts.join(" L ")}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H_WAVE}`} className="w-full">
      {/* Zero line */}
      <line x1={PAD_L} y1={midY} x2={W - PAD_R} y2={midY}
        stroke={vt.gridStrong} strokeWidth={1} strokeDasharray="3,3" />

      {/* Grid lines */}
      {yTicks.map(v => (
        <line key={v} x1={PAD_L} y1={yScale(v)} x2={W - PAD_R} y2={yScale(v)}
          stroke={vt.grid} strokeWidth={1} />
      ))}

      {/* Fill */}
      <path d={fillPath} fill={accentColor + "30"} />

      {/* Waveform with pathLength animation */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* X axis */}
      <line x1={PAD_L} y1={PAD_T + plotH} x2={W - PAD_R} y2={PAD_T + plotH}
        stroke={vt.axis} strokeWidth={1} />
      {xTicks.map(tick => (
        <g key={tick}>
          <line x1={xScale(tick)} y1={PAD_T + plotH} x2={xScale(tick)} y2={PAD_T + plotH + 4}
            stroke={vt.axis} strokeWidth={1} />
          <text x={xScale(tick)} y={PAD_T + plotH + 14} textAnchor="middle"
            fontSize={9} fill={vt.textMuted}>{tick}</text>
        </g>
      ))}
      <text x={PAD_L + plotW / 2} y={H_WAVE - 4} textAnchor="middle"
        fontSize={9} fill={vt.textMuted}>{L.timeAxis}</text>

      {/* Y axis */}
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH}
        stroke={vt.axis} strokeWidth={1} />
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PAD_L - 4} y1={yScale(v)} x2={PAD_L} y2={yScale(v)}
            stroke={vt.axis} strokeWidth={1} />
          <text x={PAD_L - 7} y={yScale(v) + 4} textAnchor="end"
            fontSize={9} fill={vt.textMuted}>{v > 0 ? `+${v}` : v}</text>
        </g>
      ))}
      <text x={13} y={midY} textAnchor="middle" fontSize={9} fill={vt.textMuted}
        transform={`rotate(-90,13,${midY})`}>{L.ampAxis}</text>

      {/* Legend */}
      {[
        { label: "f₁=low",  freq: 1, amp: 0.6, color: accentColor },
        { label: "f₂=mid",  freq: 3, amp: 0.4, color: "#f97316" },
        { label: "f₃=high", freq: 7, amp: 0.2, color: "#22c55e" },
      ].map(({ label, freq, amp, color }, i) => {
        const lx = PAD_L + 10 + i * 100;
        const ly = PAD_T + 18;
        return (
          <g key={label}>
            <path d={miniSin(freq, amp, lx, ly)} fill="none" stroke={color} strokeWidth={1.5} />
            <text x={lx + 32} y={ly + 4} fontSize={8} fill={vt.ink(color)}>{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Heatmap grid (shared by Spectrogram + Mel) ────────────────────────────────
interface HeatmapProps {
  grid: number[][];
  maxVal: number;
  accentColor: string;
  vt: ReturnType<typeof useVizTheme>;
  yLabels: string[];
  xAxisLabel: string;
  showMelOverlay?: boolean;
}

function HeatmapGrid({ grid, maxVal, accentColor, vt, yLabels, xAxisLabel, showMelOverlay }: HeatmapProps) {
  const rows = grid.length;    // 8
  const cols = grid[0].length; // 8

  const padL = 48, padR = 48, padT = 28, padB = 36;
  const plotW = W - padL - padR;
  const plotH = H_SPEC - padT - padB;
  const cellW = plotW / cols;
  const cellH = plotH / rows;

  return (
    <svg viewBox={`0 0 ${W} ${H_SPEC}`} className="w-full">
      {/* Cells */}
      {grid.map((row, f) => (
        <motion.g
          key={f}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: f * 0.06 }}
        >
          {row.map((val, t) => {
            const norm = Math.min(1, val / maxVal);
            const opacity = Math.pow(norm, 0.5);
            const cx = padL + t * cellW;
            const cy = padT + (rows - 1 - f) * cellH; // flip: low freq at bottom
            return (
              <rect
                key={t}
                x={cx}
                y={cy}
                width={cellW - 0.5}
                height={cellH - 0.5}
                fill={accentColor}
                fillOpacity={opacity}
                rx={1}
              />
            );
          })}
        </motion.g>
      ))}

      {/* Mel filterbank overlay (dashed boundary) */}
      {showMelOverlay && [1, 2, 4].map(bin => {
        const ly = padT + (rows - 1 - bin) * cellH + cellH;
        return (
          <line key={bin}
            x1={padL} y1={ly} x2={padL + plotW} y2={ly}
            stroke={accentColor} strokeWidth={1} strokeDasharray="4,3" strokeOpacity={0.6} />
        );
      })}

      {/* Border around grid */}
      <rect x={padL} y={padT} width={plotW} height={plotH}
        fill="none" stroke={vt.axis} strokeWidth={1} />

      {/* X axis labels */}
      {Array.from({ length: cols }, (_, t) => (
        <text key={t} x={padL + t * cellW + cellW / 2} y={padT + plotH + 14}
          textAnchor="middle" fontSize={8} fill={vt.textMuted}>{t}</text>
      ))}
      <text x={padL + plotW / 2} y={H_SPEC - 4} textAnchor="middle"
        fontSize={9} fill={vt.textMuted}>{xAxisLabel}</text>

      {/* Y axis labels */}
      {yLabels.map((label, f) => {
        const cy = padT + (rows - 1 - f) * cellH + cellH / 2 + 3;
        return (
          <text key={f} x={padL - 4} y={cy} textAnchor="end"
            fontSize={8} fill={vt.textMuted}>{label}</text>
        );
      })}

      {/* Colorbar */}
      <defs>
        <linearGradient id="colorbar-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stopColor={vt.bg} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
      </defs>
      <rect x={padL + plotW + 8} y={padT} width={12} height={plotH}
        fill="url(#colorbar-grad)" rx={3} />
      <text x={padL + plotW + 14} y={padT - 4} textAnchor="middle"
        fontSize={7} fill={vt.textFaint}>max</text>
      <text x={padL + plotW + 14} y={padT + plotH + 10} textAnchor="middle"
        fontSize={7} fill={vt.textFaint}>0</text>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SpectrogramViz({ accentColor = "#06b6d4" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(SP_LABELS);
  const [tab, setTab] = useState<Tab>("waveform");

  const stftMax = useMemo(() => STFT_MAX, []);
  const melMax  = useMemo(() => MEL_MAX,  []);

  return (
    <div className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {L.title}
        </span>
        <div className="flex gap-1">
          {TAB_IDS.map((id, ti) => (
            <button key={id} onClick={() => setTab(id)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: tab === id ? `${accentColor}22` : "transparent",
                color:            tab === id ? accentColor : vt.textMuted,
                border:           `1px solid ${tab === id ? accentColor + "55" : "var(--border)"}`,
              }}>
              {L.tabs[ti]}
            </button>
          ))}
        </div>
      </div>

      {/* Viz area */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>

          {tab === "waveform" && (
            <WaveformTab accentColor={accentColor} vt={vt} />
          )}

          {tab === "spectrogram" && (
            <HeatmapGrid
              grid={STFT_GRID}
              maxVal={stftMax}
              accentColor={accentColor}
              vt={vt}
              yLabels={FREQ_LABELS}
              xAxisLabel={L.stftXAxis}
            />
          )}

          {tab === "mel" && (
            <HeatmapGrid
              grid={MEL_GRID}
              maxVal={melMax}
              accentColor={accentColor}
              vt={vt}
              yLabels={MEL_LABELS}
              xAxisLabel={L.melXAxis}
              showMelOverlay
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Insight bar */}
      <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs" style={{ color: vt.textMuted }}>
          {L.insights[tab]}
        </p>
      </div>
    </div>
  );
}
