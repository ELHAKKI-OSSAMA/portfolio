"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const NN_LABELS = {
  en: {
    title: "Neural Network — Forward Pass",
    subtitle: "hover neurons to inspect",
    forwardBtn: "Forward Pass",
    activationLabel: "Activation:",
    layerNames: ["Input", "Hidden 1", "Hidden 2", "Hidden 3", "Output"],
  },
  fr: {
    title: "Réseau de Neurones — Propagation Avant",
    subtitle: "survoler les neurones pour inspecter",
    forwardBtn: "Propagation Avant",
    activationLabel: "Activation :",
    layerNames: ["Entrée", "Caché 1", "Caché 2", "Caché 3", "Sortie"],
  },
  ar: {
    title: "الشبكة العصبية — الانتشار الأمامي",
    subtitle: "مرّر على الخلايا العصبية للفحص",
    forwardBtn: "انتشار أمامي",
    activationLabel: "التنشيط:",
    layerNames: ["إدخال", "مخفي 1", "مخفي 2", "مخفي 3", "إخراج"],
  },
} as const;

const LAYERS = [3, 5, 4, 3, 1];
const W = 520, H = 320;

function sigmoid(z: number) { return 1 / (1 + Math.exp(-z)); }
function relu(z: number) { return Math.max(0, z); }

interface Neuron { x: number; y: number; layer: number; idx: number; activation: number; }
interface Connection { from: Neuron; to: Neuron; weight: number; }

function buildNetwork(activations: number[][]): { neurons: Neuron[]; connections: Connection[] } {
  const padX = 60, padY = 40;
  const layerWidth = (W - 2 * padX) / (LAYERS.length - 1);
  const neurons: Neuron[] = [];

  LAYERS.forEach((count, li) => {
    const spacing = (H - 2 * padY) / (count + 1);
    for (let ni = 0; ni < count; ni++) {
      neurons.push({
        x: padX + li * layerWidth,
        y: padY + spacing * (ni + 1),
        layer: li, idx: ni,
        activation: activations[li]?.[ni] ?? 0.5,
      });
    }
  });

  const connections: Connection[] = [];
  for (let li = 0; li < LAYERS.length - 1; li++) {
    const from = neurons.filter(n => n.layer === li);
    const to = neurons.filter(n => n.layer === li + 1);
    for (const f of from) {
      for (const t of to) {
        connections.push({ from: f, to: t, weight: (Math.sin(f.idx * 3.7 + t.idx * 2.1 + li) + 1) / 2 });
      }
    }
  }
  return { neurons, connections };
}

const LAYER_WEIGHTS = [
  Array.from({ length: 5 * 3 }, (_, i) => Math.sin(i * 1.7) * 0.8),
  Array.from({ length: 4 * 5 }, (_, i) => Math.cos(i * 2.1) * 0.7),
  Array.from({ length: 3 * 4 }, (_, i) => Math.sin(i * 1.3) * 0.9),
  Array.from({ length: 1 * 3 }, (_, i) => Math.cos(i * 0.9) * 0.6),
];

function forwardPass(input: number[]): number[][] {
  let current = input;
  const allActivations: number[][] = [current];
  for (let li = 0; li < LAYERS.length - 1; li++) {
    const nextCount = LAYERS[li + 1];
    const currentCount = LAYERS[li];
    const W = LAYER_WEIGHTS[li];
    const next: number[] = [];
    for (let j = 0; j < nextCount; j++) {
      let z = 0;
      for (let i = 0; i < currentCount; i++) z += current[i] * W[j * currentCount + i];
      next.push(li === LAYERS.length - 2 ? sigmoid(z) : relu(z + 0.3));
    }
    current = next;
    allActivations.push(current);
  }
  return allActivations;
}

export default function NeuralNetworkViz({ accentColor = "#ec4899" }: { accentColor?: string }) {
  const [activations, setActivations] = useState<number[][]>(() => LAYERS.map(c => Array(c).fill(0.5)));
  const [activeLayer, setActiveLayer] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNeuron, setHoveredNeuron] = useState<string | null>(null);
  const vt = useVizTheme();
  const L = useVizLocale(NN_LABELS);

  const runForward = useCallback(() => {
    if (isPlaying) return;
    const input = [0.8, 0.3, 0.6];
    const acts = forwardPass(input);
    setActivations(acts);
    setActiveLayer(-1);
    let layer = 0;
    const tick = () => {
      setActiveLayer(layer);
      layer++;
      if (layer <= LAYERS.length) setTimeout(tick, 350);
      else setIsPlaying(false);
    };
    setIsPlaying(true);
    setTimeout(tick, 100);
  }, [isPlaying]);

  const { neurons, connections } = buildNetwork(activations);

  const getColor = (act: number) => {
    const r = Math.round(108 + (act - 0.5) * 100);
    const g = Math.round(99 + (act - 0.5) * 80);
    const b = Math.round(255 - act * 80);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <VizCard>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            3 → 5 → 4 → 3 → 1 · {L.subtitle}
          </span>
        </div>
        <button
          onClick={runForward}
          disabled={isPlaying}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            backgroundColor: `${accentColor}25`,
            color: accentColor,
            border: `1px solid ${accentColor}50`,
            opacity: isPlaying ? 0.5 : 1,
          }}
        >
          <Play size={11} />
          {L.forwardBtn}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Connections */}
        {connections.map((conn, i) => {
          const isActive = activeLayer >= 0 && conn.from.layer < activeLayer && conn.to.layer <= activeLayer;
          return (
            <motion.line
              key={i}
              x1={conn.from.x} y1={conn.from.y}
              x2={conn.to.x} y2={conn.to.y}
              stroke={isActive ? accentColor : vt.surface}
              strokeWidth={isActive ? 1.5 : 0.8}
              opacity={isActive ? conn.weight * 0.8 + 0.2 : 0.5}
              animate={{
                stroke: isActive ? accentColor : vt.surface,
                opacity: isActive ? conn.weight * 0.8 + 0.2 : 0.5,
              }}
              transition={{ duration: 0.2 }}
            />
          );
        })}

        {/* Layer labels */}
        {L.layerNames.map((name, li) => {
          const n = neurons.find(n => n.layer === li);
          if (!n) return null;
          return (
            <text key={li} x={n.x} y={H - 10} textAnchor="middle" fontSize={9}
              fill={activeLayer === li ? accentColor : vt.textMuted}>
              {name}
            </text>
          );
        })}

        {/* Neurons */}
        {neurons.map(neuron => {
          const key = `${neuron.layer}-${neuron.idx}`;
          const isActive = activeLayer >= neuron.layer;
          const isHovered = hoveredNeuron === key;
          return (
            <g key={key} onMouseEnter={() => setHoveredNeuron(key)} onMouseLeave={() => setHoveredNeuron(null)}>
              {isActive && (
                <motion.circle cx={neuron.x} cy={neuron.y} r={18}
                  fill={accentColor} opacity={0.08}
                  initial={{ r: 10, opacity: 0 }}
                  animate={{ r: 18, opacity: 0.08 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <motion.circle
                cx={neuron.x} cy={neuron.y} r={isHovered ? 12 : 10}
                fill={isActive ? getColor(neuron.activation) : vt.surfaceStrong}
                stroke={isActive ? accentColor : vt.border}
                strokeWidth={isActive ? 2 : 1}
                animate={{
                  fill: isActive ? getColor(neuron.activation) : vt.surfaceStrong,
                  r: isHovered ? 12 : 10,
                }}
                transition={{ duration: 0.25 }}
              />
              {isHovered && isActive && (
                <g>
                  <rect x={neuron.x - 18} y={neuron.y - 28} width={36} height={16}
                    rx={4} fill={vt.isDark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.95)"}
                    stroke={vt.border} strokeWidth={1}
                  />
                  <text x={neuron.x} y={neuron.y - 16} textAnchor="middle" fontSize={9}
                    fill={vt.ink(accentColor)} fontFamily="monospace">
                    {neuron.activation.toFixed(2)}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Signal pulse */}
        {isPlaying && activeLayer > 0 && activeLayer <= LAYERS.length && (
          <motion.circle r={5} fill={accentColor} opacity={0.8}
            initial={{ cx: 60, cy: H / 2, opacity: 0.8, r: 5 }}
            animate={{ cx: 60 + activeLayer * ((W - 120) / (LAYERS.length - 1)), opacity: 0, r: 15 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </svg>

      <div className="px-5 py-3 flex items-center gap-4 border-t" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{L.activationLabel}</span>
        <div className="flex items-center gap-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
            <div key={v} className="w-6 h-4 rounded"
              style={{ backgroundColor: `rgb(${Math.round(108 + (v - 0.5) * 100)},${Math.round(99 + (v - 0.5) * 80)},${Math.round(255 - v * 80)})` }} />
          ))}
          <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>0 → 1</span>
        </div>
      </div>
    </VizCard>
  );
}
