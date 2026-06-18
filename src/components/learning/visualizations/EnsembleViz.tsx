"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const ENS_LABELS = {
  en: {
    title: "Ensemble — Variance Reduction",
    subtitle: "toggle individual models to see effect on ensemble",
    ensembleBtn: "Ensemble",
    trueFunc: "True function",
    ensembleMean: "Ensemble mean",
    modelLabel: (i: number) => `Model ${i}`,
    ensembleMSE: "Ensemble MSE:",
  },
  fr: {
    title: "Ensemble — Réduction de Variance",
    subtitle: "activer/désactiver les modèles individuels pour voir l'effet sur l'ensemble",
    ensembleBtn: "Ensemble",
    trueFunc: "Fonction vraie",
    ensembleMean: "Moyenne de l'ensemble",
    modelLabel: (i: number) => `Modèle ${i}`,
    ensembleMSE: "MSE de l'ensemble :",
  },
  ar: {
    title: "المجموعة — تقليل التباين",
    subtitle: "تبديل النماذج الفردية لرؤية تأثيرها على المجموعة",
    ensembleBtn: "المجموعة",
    trueFunc: "الدالة الحقيقية",
    ensembleMean: "متوسط المجموعة",
    modelLabel: (i: number) => `نموذج ${i}`,
    ensembleMSE: "MSE المجموعة:",
  },
} as const;

const W = 520, H = 270, PAD = 40;
const N_MODELS = 5;
const trueFunc = (x: number) => 2 * Math.sin(x * 0.7) + 0.3 * x;

// Each model slightly overfits differently
const MODEL_OFFSETS = [
  { bias: 0.3, noise: 0.6, freq: 1.1 },
  { bias: -0.4, noise: 0.5, freq: 0.9 },
  { bias: 0.1, noise: 0.8, freq: 1.3 },
  { bias: -0.2, noise: 0.7, freq: 0.8 },
  { bias: 0.5, noise: 0.4, freq: 1.05 },
];

const MODEL_COLORS = ["#6c63ff", "#00d4aa", "#f59e0b", "#ff6b6b", "#06b6d4"];

const xs = Array.from({ length: 80 }, (_, i) => (i / 79) * 10);

function modelPred(x: number, offset: typeof MODEL_OFFSETS[0], seed: number) {
  return trueFunc(x) * offset.freq + offset.bias + Math.sin(x * 3.1 + seed) * offset.noise;
}

const toSVGX = (x: number) => PAD + (x / 10) * (W - 2 * PAD);
const toSVGY = (y: number, yMin: number, yMax: number) =>
  H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD);

// Scatter data
const SCATTER_X = Array.from({ length: 15 }, (_, i) => 0.5 + i * 0.65);
const SCATTER_Y = SCATTER_X.map((x, i) => trueFunc(x) + (Math.sin(i * 5.7) * 0.8));

export default function EnsembleViz({ accentColor = "#f59e0b" }: { accentColor?: string }) {
  const [activeModels, setActiveModels] = useState<boolean[]>(Array(N_MODELS).fill(true));
  const [showEnsemble, setShowEnsemble] = useState(true);
  const vt = useVizTheme();
  const L = useVizLocale(ENS_LABELS);

  const allPreds = useMemo(() =>
    MODEL_OFFSETS.map((off, mi) => xs.map(x => modelPred(x, off, mi * 1.3))),
    []
  );

  const ensemblePreds = useMemo(() =>
    xs.map((_, xi) => {
      const active = allPreds.filter((_, mi) => activeModels[mi]);
      if (active.length === 0) return 0;
      return active.reduce((s, m) => s + m[xi], 0) / active.length;
    }),
    [allPreds, activeModels]
  );

  const allY = [...allPreds.flat(), ...ensemblePreds, ...SCATTER_Y, ...xs.map(x => trueFunc(x))];
  const yMin = Math.min(...allY) - 0.5;
  const yMax = Math.max(...allY) + 0.5;

  const pathStr = (preds: number[]) =>
    xs.map((x, i) => `${i === 0 ? "M" : "L"}${toSVGX(x)},${toSVGY(preds[i], yMin, yMax)}`).join(" ");

  const msePerModel = MODEL_OFFSETS.map((off, mi) => {
    const preds = xs.map(x => modelPred(x, off, mi * 1.3));
    return preds.reduce((s, p, xi) => s + (p - trueFunc(xs[xi])) ** 2, 0) / xs.length;
  });
  const ensembleMSE = ensemblePreds.reduce((s, p, xi) => s + (p - trueFunc(xs[xi])) ** 2, 0) / xs.length;

  const toggleModel = (i: number) => {
    setActiveModels(prev => prev.map((v, j) => j === i ? !v : v));
  };

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
        <button
          onClick={() => setShowEnsemble(s => !s)}
          className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: showEnsemble ? `${accentColor}25` : "var(--bg-card)",
            color: showEnsemble ? accentColor : "var(--text-muted)",
            border: `1px solid ${showEnsemble ? accentColor + "50" : "var(--border)"}`,
          }}
        >
          {L.ensembleBtn}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[2, 4, 6, 8].map(v => (
          <line key={v} x1={toSVGX(v)} y1={PAD} x2={toSVGX(v)} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />
        ))}

        {/* True function */}
        <path
          d={pathStr(xs.map(x => trueFunc(x)))}
          fill="none" stroke={vt.gridStrong} strokeWidth={2} strokeDasharray="6,4"
        />

        {/* Individual model predictions */}
        {allPreds.map((preds, mi) => (
          <motion.path
            key={mi}
            d={pathStr(preds)}
            fill="none"
            stroke={MODEL_COLORS[mi]}
            strokeWidth={1.5}
            opacity={activeModels[mi] ? 0.55 : 0.10}
            animate={{ opacity: activeModels[mi] ? 0.55 : 0.10 }}
            transition={{ duration: 0.25 }}
          />
        ))}

        {/* Ensemble prediction */}
        {showEnsemble && (
          <motion.path
            d={pathStr(ensemblePreds)}
            fill="none"
            stroke={accentColor}
            strokeWidth={3}
            opacity={0.9}
            animate={{ d: pathStr(ensemblePreds) }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* Scatter data */}
        {SCATTER_X.map((x, i) => (
          <circle key={i}
            cx={toSVGX(x)} cy={toSVGY(SCATTER_Y[i], yMin, yMax)}
            r={4.5}
            fill={vt.pointFill}
            stroke={vt.axis} strokeWidth={1.5}
            opacity={0.8}
          />
        ))}

        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />

        {/* Legend */}
        <line x1={PAD + 4} y1={PAD + 12} x2={PAD + 22} y2={PAD + 12} stroke={vt.gridStrong} strokeWidth={2} strokeDasharray="6,4" />
        <text x={PAD + 26} y={PAD + 16} fontSize={9} fill={vt.textMuted}>{L.trueFunc}</text>
        <line x1={PAD + 4} y1={PAD + 26} x2={PAD + 22} y2={PAD + 26} stroke={accentColor} strokeWidth={3} />
        <text x={PAD + 26} y={PAD + 30} fontSize={9} fill={vt.ink(accentColor)}>{L.ensembleMean}</text>
      </svg>

      {/* Model toggles */}
      <div className="px-5 py-3 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--border)" }}>
        {MODEL_COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => toggleModel(i)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: activeModels[i] ? `${color}20` : "var(--bg-card)",
              color: activeModels[i] ? color : "var(--text-muted)",
              border: `1px solid ${activeModels[i] ? color + "50" : "var(--border)"}`,
              opacity: activeModels[i] ? 1 : 0.5,
            }}
          >
            {L.modelLabel(i + 1)}
            <span className="font-mono text-xs opacity-70">MSE={msePerModel[i].toFixed(2)}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{L.ensembleMSE}</span>
          <span className="text-sm font-bold font-mono" style={{ color: accentColor }}>
            {ensembleMSE.toFixed(3)}
          </span>
        </div>
      </div>
    </VizCard>
  );
}
