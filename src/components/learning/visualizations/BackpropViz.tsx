"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const BP_LABELS = {
  en: {
    title: "Backpropagation — Gradient Flow",
    phaseReady: "ready",
    phaseForward: "→ forward pass",
    phaseBack: "← gradient flowing back",
    trainStep: "Train Step",
    layerNames: ["Input", "Hidden 1", "Hidden 2", "Output"] as readonly string[],
    epochLabel: "Epoch",
    lossLabel: "Loss",
    lossCurve: "Loss curve",
    gradLegend: "small → large gradient",
  },
  fr: {
    title: "Rétropropagation — Flux du Gradient",
    phaseReady: "prêt",
    phaseForward: "→ passe avant",
    phaseBack: "← gradient en retour",
    trainStep: "Étape d'entraînement",
    layerNames: ["Entrée", "Caché 1", "Caché 2", "Sortie"] as readonly string[],
    epochLabel: "Époque",
    lossLabel: "Perte",
    lossCurve: "Courbe de perte",
    gradLegend: "petit → grand gradient",
  },
  ar: {
    title: "الانتشار الخلفي — تدفق التدرج",
    phaseReady: "جاهز",
    phaseForward: "→ مرور للأمام",
    phaseBack: "← التدرج يعود للخلف",
    trainStep: "خطوة تدريب",
    layerNames: ["مدخل", "مخفي 1", "مخفي 2", "مخرج"] as readonly string[],
    epochLabel: "حقبة",
    lossLabel: "الخسارة",
    lossCurve: "منحنى الخسارة",
    gradLegend: "صغير → تدرج كبير",
  },
} as const;

// Small network: 2 → 3 → 2 → 1
const ARCH = [2, 3, 2, 1];
const W = 520, H = 300;
const PAD_X = 70, PAD_Y = 50;

function sigmoid(z: number) { return 1 / (1 + Math.exp(-z)); }
function sigmoidPrime(z: number) { const s = sigmoid(z); return s * (1 - s); }

type Phase = "idle" | "forward" | "backward";

function initWeights(): number[][][] {
  // weights[layer][to][from]
  return ARCH.slice(1).map((toCount, li) => {
    const fromCount = ARCH[li];
    return Array.from({ length: toCount }, (_, j) =>
      Array.from({ length: fromCount }, (_, i) => Math.sin(li * 7 + j * 3.7 + i * 1.9) * 0.6)
    );
  });
}

export default function BackpropViz({ accentColor = "#ec4899" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(BP_LABELS);
  const [weights, setWeights] = useState(initWeights);
  const [activations, setActivations] = useState<number[][]>(() => ARCH.map(c => Array(c).fill(0)));
  const [gradients, setGradients] = useState<number[][][]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState<number[]>([]);

  const input = [0.8, 0.2];
  const target = [0.9];

  const layerWidth = (W - 2 * PAD_X) / (ARCH.length - 1);

  const getNeuronPos = (layer: number, idx: number) => {
    const count = ARCH[layer];
    const spacing = (H - 2 * PAD_Y) / (count + 1);
    return { x: PAD_X + layer * layerWidth, y: PAD_Y + spacing * (idx + 1) };
  };

  const runForwardBackward = useCallback(() => {
    if (phase !== "idle") return;

    // Forward pass
    const zs: number[][] = [];
    const acts: number[][] = [input];
    let current = input;
    for (let li = 0; li < weights.length; li++) {
      const zLayer: number[] = [];
      const aLayer: number[] = [];
      for (let j = 0; j < ARCH[li + 1]; j++) {
        const z = weights[li][j].reduce((s, w, i) => s + w * current[i], 0);
        zs.push(zLayer);
        zLayer.push(z);
        aLayer.push(sigmoid(z));
      }
      zs[li] = zLayer;
      current = aLayer;
      acts.push(aLayer);
    }

    const output = acts[acts.length - 1];
    const currentLoss = target.reduce((s, t, i) => s + (output[i] - t) ** 2, 0) / 2;

    // Backward pass — compute deltas
    const grads: number[][][] = weights.map(l => l.map(row => row.map(() => 0)));
    let delta = output.map((o, i) => (o - target[i]) * sigmoidPrime(zs[zs.length - 1][i]));

    for (let li = weights.length - 1; li >= 0; li--) {
      // weight gradients
      for (let j = 0; j < ARCH[li + 1]; j++) {
        for (let i = 0; i < ARCH[li]; i++) {
          grads[li][j][i] = delta[j] * acts[li][i];
        }
      }
      if (li > 0) {
        const newDelta = Array(ARCH[li]).fill(0);
        for (let i = 0; i < ARCH[li]; i++) {
          for (let j = 0; j < ARCH[li + 1]; j++) {
            newDelta[i] += delta[j] * weights[li][j][i];
          }
          newDelta[i] *= sigmoidPrime(zs[li - 1]?.[i] ?? 0);
        }
        delta = newDelta;
      }
    }

    setActivations(acts);
    setGradients(grads);
    setPhase("forward");
    setLoss(prev => [...prev.slice(-19), currentLoss]);

    setTimeout(() => {
      setPhase("backward");
      setTimeout(() => {
        // Update weights
        const lr = 0.5;
        setWeights(prev => prev.map((layer, li) =>
          layer.map((row, j) => row.map((w, i) => w - lr * grads[li][j][i]))
        ));
        setEpoch(e => e + 1);
        setPhase("idle");
      }, 1200);
    }, 900);
  }, [phase, weights, input, target]);

  const reset = () => {
    setWeights(initWeights());
    setActivations(ARCH.map(c => Array(c).fill(0)));
    setGradients([]);
    setPhase("idle");
    setEpoch(0);
    setLoss([]);
  };

  // Gradient magnitude → color (red = large, cool = small)
  const gradColor = (g: number) => {
    const mag = Math.min(1, Math.abs(g) * 4);
    if (phase !== "backward") return vt.surface;
    const r = Math.round(255 * mag);
    const b = Math.round(255 * (1 - mag));
    return `rgba(${r},50,${b},${0.3 + mag * 0.7})`;
  };

  return (
    <VizCard>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {phase === "idle" ? L.phaseReady : phase === "forward" ? L.phaseForward : L.phaseBack}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runForwardBackward}
            disabled={phase !== "idle"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: `${accentColor}25`,
              color: accentColor,
              border: `1px solid ${accentColor}50`,
              opacity: phase !== "idle" ? 0.5 : 1,
            }}
          >
            <ChevronRight size={11} />
            {L.trainStep}
          </button>
          <button onClick={reset} className="p-1.5 rounded-lg"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Connections with gradient coloring */}
        {ARCH.slice(1).map((toCount, li) =>
          Array.from({ length: ARCH[li] }, (_, fromIdx) =>
            Array.from({ length: toCount }, (_, toIdx) => {
              const from = getNeuronPos(li, fromIdx);
              const to = getNeuronPos(li + 1, toIdx);
              const grad = gradients[li]?.[toIdx]?.[fromIdx] ?? 0;
              const isActive = phase === "forward" && activations[li + 1]?.length > 0;
              return (
                <motion.line
                  key={`${li}-${fromIdx}-${toIdx}`}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={phase === "backward" ? gradColor(grad) : isActive ? accentColor : vt.surface}
                  strokeWidth={phase === "backward" ? 2 + Math.min(2, Math.abs(grad) * 6) : isActive ? 1.5 : 0.8}
                  opacity={isActive || phase === "backward" ? 0.85 : 0.4}
                  animate={{ stroke: phase === "backward" ? gradColor(grad) : isActive ? accentColor : vt.surface }}
                  transition={{ duration: 0.3 }}
                />
              );
            })
          )
        )}

        {/* Layer labels */}
        {L.layerNames.map((name, li) => {
          const pos = getNeuronPos(li, 0);
          return (
            <text key={li} x={pos.x} y={H - 10} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
              {name}
            </text>
          );
        })}

        {/* Neurons */}
        {ARCH.map((count, li) =>
          Array.from({ length: count }, (_, ni) => {
            const { x, y } = getNeuronPos(li, ni);
            const act = activations[li]?.[ni] ?? 0;
            const isActive = phase !== "idle" && activations[li]?.length > 0;
            const fwdActive = phase === "forward" && isActive;
            return (
              <g key={`${li}-${ni}`}>
                {fwdActive && (
                  <motion.circle cx={x} cy={y} r={20}
                    fill={accentColor} opacity={0.08}
                    initial={{ r: 12 }} animate={{ r: 20 }} transition={{ duration: 0.4 }} />
                )}
                <motion.circle
                  cx={x} cy={y} r={12}
                  fill={isActive ? `rgba(${Math.round(108 + act * 80)},${Math.round(99 + act * 60)},${Math.round(255 - act * 60)},1)` : vt.surfaceStrong}
                  stroke={isActive ? accentColor : vt.border}
                  strokeWidth={isActive ? 2 : 1}
                  animate={{ fill: isActive ? `rgba(${Math.round(108 + act * 80)},${Math.round(99 + act * 60)},${Math.round(255 - act * 60)},1)` : vt.surfaceStrong }}
                  transition={{ duration: 0.25 }}
                />
                {isActive && (
                  <text x={x} y={y + 4} textAnchor="middle" fontSize={8}
                    fill={vt.isDark ? "white" : "#111"} fontFamily="monospace">
                    {act.toFixed(2)}
                  </text>
                )}
              </g>
            );
          })
        )}

        {/* Backward gradient arrows */}
        {phase === "backward" && ARCH.slice(1).map((_, li) => {
          const realLi = ARCH.length - 2 - li;
          const from = getNeuronPos(realLi + 1, 0);
          const to = getNeuronPos(realLi, 0);
          return (
            <motion.path
              key={`arrow-${realLi}`}
              d={`M${from.x},${from.y - 25} L${to.x},${to.y - 25}`}
              fill="none"
              stroke={accentColor}
              strokeWidth={2}
              strokeDasharray="4,3"
              markerEnd="url(#arrowBack)"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 0.7, pathLength: 1 }}
              transition={{ duration: 0.5, delay: li * 0.15 }}
            />
          );
        })}

        <defs>
          <marker id="arrowBack" viewBox="0 0 10 10" refX="5" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={accentColor} opacity={0.7} />
          </marker>
        </defs>
      </svg>

      <div className="px-5 py-3 border-t flex items-center gap-6" style={{ borderColor: "var(--border)" }}>
        <div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>{L.epochLabel}</div>
          <div className="text-sm font-bold font-mono" style={{ color: accentColor }}>{epoch}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>{L.lossLabel}</div>
          <div className="text-sm font-bold font-mono" style={{ color: accentColor }}>
            {loss.length > 0 ? loss[loss.length - 1].toFixed(4) : "—"}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{L.lossCurve}</div>
          <svg viewBox="0 0 200 30" className="w-full h-6">
            {loss.length > 1 && (
              <polyline
                points={loss.map((l, i) => `${(i / (loss.length - 1)) * 200},${30 - Math.min(30, l * 60)}`).join(" ")}
                fill="none" stroke={accentColor} strokeWidth={1.5}
              />
            )}
          </svg>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to right, #3232ff, #ff3232)" }} />
          {L.gradLegend}
        </div>
      </div>
    </VizCard>
  );
}
