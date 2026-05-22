"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";

// ── Shared helpers ────────────────────────────────────────────────────────────
interface BoxProps {
  x: number; y: number; w: number; h: number;
  label: string; sublabel?: string;
  fill: string; stroke?: string;
  rx?: number;
}

function Box({ x, y, w, h, label, sublabel, fill, stroke, rx = 8 }: BoxProps) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke ?? fill} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + (sublabel ? -5 : 4)} textAnchor="middle"
        fontSize={10} fontWeight="bold" fill="white">
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle"
          fontSize={8} fill="rgba(255,255,255,0.7)">
          {sublabel}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} markerEnd="url(#arrowhead)" />
    </g>
  );
}

const ARROW_DEFS = (color: string) => (
  <defs>
    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 Z" fill={color} />
    </marker>
  </defs>
);

// ── Model architecture types ──────────────────────────────────────────────────
export type ArchType = "cnn" | "transformer" | "lstm" | "gan" | "mlp" | "decision-tree" | "svm";

const ARCH_LABELS: Record<ArchType, string> = {
  cnn: "CNN Architecture",
  transformer: "Transformer Encoder",
  lstm: "LSTM Cell",
  gan: "GAN Training Loop",
  mlp: "Multi-Layer Perceptron",
  "decision-tree": "Decision Tree",
  svm: "SVM Geometry",
};

// ── Individual architecture diagrams ─────────────────────────────────────────

function CNNArch({ accentColor, vt }: { accentColor: string; vt: ReturnType<typeof useVizTheme> }) {
  const blocks = [
    { label: "Input",    sublabel: "H×W×C",    fill: "#475569", x: 20 },
    { label: "Conv+ReLU", sublabel: "filters",  fill: accentColor, x: 108 },
    { label: "MaxPool",  sublabel: "↓2×",       fill: "#0891b2", x: 202 },
    { label: "Conv+ReLU", sublabel: "deeper",   fill: accentColor, x: 296 },
    { label: "Flatten",  sublabel: "1D vec",    fill: "#7c3aed", x: 390 },
    { label: "FC+Softmax", sublabel: "classes", fill: "#059669", x: 474 },
  ];
  const W_ = 574, H_ = 120, BY = 30, BH = 50, BW = 78;

  return (
    <svg viewBox={`0 0 ${W_} ${H_}`} className="w-full">
      {ARROW_DEFS(vt.axis)}
      {blocks.map((b, i) => (
        <g key={i}>
          <Box x={b.x} y={BY} w={BW} h={BH} label={b.label} sublabel={b.sublabel} fill={b.fill} rx={8} />
          {i < blocks.length - 1 && (
            <Arrow x1={b.x + BW} y1={BY + BH / 2} x2={b.x + BW + 8} y2={BY + BH / 2} color={vt.axis} />
          )}
        </g>
      ))}
      {/* Feature map size annotations */}
      {[
        { x: 20 + BW / 2, label: "32×32×3" },
        { x: 108 + BW / 2, label: "30×30×32" },
        { x: 202 + BW / 2, label: "15×15×32" },
        { x: 296 + BW / 2, label: "13×13×64" },
        { x: 390 + BW / 2, label: "10816" },
        { x: 474 + BW / 2, label: "10" },
      ].map((a, i) => (
        <text key={i} x={a.x} y={BY + BH + 18} textAnchor="middle" fontSize={8}
          fill={vt.textMuted} fontFamily="monospace">{a.label}</text>
      ))}
      {/* Label */}
      <text x={W_ / 2} y={H_ - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Convolutional Neural Network — spatial feature extraction pipeline
      </text>
    </svg>
  );
}

function TransformerArch({ accentColor, vt }: { accentColor: string; vt: ReturnType<typeof useVizTheme> }) {
  const W_ = 520, H_ = 280;
  const BW = 150, BH = 38, CX = W_ / 2, BX = CX - BW / 2;

  return (
    <svg viewBox={`0 0 ${W_} ${H_}`} className="w-full">
      {ARROW_DEFS(accentColor)}
      {/* Bottom-up stack */}
      {/* Input Embeddings */}
      <Box x={BX} y={240} w={BW} h={BH} label="Input Embedding" sublabel="+Positional" fill="#475569" />
      <Arrow x1={CX} y1={240} x2={CX} y2={230} color={vt.axis} />

      {/* Encoder block (repeated N×) */}
      <rect x={BX - 16} y={94} width={BW + 32} height={134} rx={10}
        fill={`${accentColor}08`} stroke={`${accentColor}35`} strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={BX + BW + 20} y={162} textAnchor="start" fontSize={8} fill={accentColor}>
        ×N
      </text>

      {/* Add & Norm 2 */}
      <Box x={BX} y={96} w={BW} h={32} label="Add & Norm" fill="#374151" rx={6} />
      <Arrow x1={CX} y1={96} x2={CX} y2={86} color={vt.axis} />

      {/* Feed-Forward */}
      <Box x={BX} y={136} w={BW} h={BH} label="Feed-Forward" sublabel="2-layer MLP" fill="#7c3aed" />
      <Arrow x1={CX} y1={136} x2={CX} y2={130} color={vt.axis} />

      {/* Add & Norm 1 */}
      <Box x={BX} y={178} w={BW} h={32} label="Add & Norm" fill="#374151" rx={6} />
      <Arrow x1={CX} y1={178} x2={CX} y2={172} color={vt.axis} />

      {/* Multi-Head Attention */}
      <Box x={BX} y={220} w={BW} h={BH} label="Multi-Head Attention" sublabel="Q, K, V" fill={accentColor} />
      <Arrow x1={CX} y1={220} x2={CX} y2={214} color={vt.axis} />

      {/* Output */}
      <Arrow x1={CX} y1={94} x2={CX} y2={84} color={vt.axis} />
      <Box x={BX} y={50} w={BW} h={32} label="Output / Softmax" fill="#059669" rx={6} />

      {/* Skip connections */}
      {[
        { y1: 229, y2: 176 },
        { y1: 175, y2: 126 },
      ].map(({ y1, y2 }, i) => (
        <path key={i}
          d={`M ${BX - 8} ${y1} L ${BX - 22} ${y1} L ${BX - 22} ${y2} L ${BX - 8} ${y2}`}
          fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,2" />
      ))}
      <text x={BX - 30} y={175} fontSize={8} fill="#f59e0b" transform={`rotate(-90,${BX-30},175)`}>
        residual
      </text>

      <text x={W_ / 2} y={H_ - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Transformer Encoder Block — Nx layers with attention + FFN
      </text>
    </svg>
  );
}

function LSTMArch({ accentColor, vt }: { accentColor: string; vt: ReturnType<typeof useVizTheme> }) {
  const W_ = 520, H_ = 220;
  // Cell state conveyor at top, gates below
  const GATE_W = 70, GATE_H = 40;
  const CY = 90; // gate y

  const gates = [
    { label: "Forget", eq: "σ(Wf·[h,x]+b)", color: "#ff6b6b", x: 60 },
    { label: "Input",  eq: "σ(Wi·[h,x]+b)", color: "#f59e0b", x: 160 },
    { label: "Cell",   eq: "tanh(Wg·[h,x]+b)", color: accentColor, x: 260 },
    { label: "Output", eq: "σ(Wo·[h,x]+b)", color: "#a855f7", x: 380 },
  ];

  return (
    <svg viewBox={`0 0 ${W_} ${H_}`} className="w-full">
      {ARROW_DEFS(vt.axis)}

      {/* Cell state track */}
      <rect x={20} y={32} width={W_ - 40} height={22} rx={11}
        fill={vt.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
        stroke={vt.border} strokeWidth={1.5} />
      <text x={10} y={46} fontSize={8} fill={vt.textMuted}>Cₜ₋₁</text>
      {/* Operations on cell state */}
      <text x={90} y={47} textAnchor="middle" fontSize={16} fill="#ff6b6b" opacity={0.8}>×</text>
      <text x={200} y={47} textAnchor="middle" fontSize={16} fill="#f59e0b" opacity={0.8}>+</text>
      <text x={W_ - 50} y={46} fontSize={8} fill={vt.textMuted}>Cₜ</text>

      {/* Arrows from gates to cell track */}
      {[
        { x: 90, color: "#ff6b6b" },
        { x: 200, color: "#f59e0b" },
      ].map(({ x, color }, i) => (
        <Arrow key={i} x1={x} y1={CY} x2={x} y2={54} color={color} />
      ))}

      {/* Output gate → Ht */}
      <Arrow x1={415} y1={CY} x2={415} y2={160} color="#a855f7" />

      {/* Gates */}
      {gates.map(g => (
        <g key={g.label}>
          <rect x={g.x - GATE_W / 2} y={CY} width={GATE_W} height={GATE_H} rx={8}
            fill={`${g.color}20`} stroke={g.color} strokeWidth={1.5} />
          <text x={g.x} y={CY + 14} textAnchor="middle" fontSize={9} fontWeight="bold" fill={g.color}>
            {g.label}
          </text>
          <text x={g.x} y={CY + 28} textAnchor="middle" fontSize={7} fill={g.color} fontFamily="monospace">
            {g.eq.length > 16 ? g.eq.slice(0, 16) + "…" : g.eq}
          </text>
        </g>
      ))}

      {/* Input [h,x] */}
      <rect x={10} y={148} width={480} height={26} rx={8}
        fill={vt.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}
        stroke={vt.border} strokeWidth={1} />
      <text x={30} y={164} fontSize={9} fill={vt.textMuted}>Input: [hₜ₋₁, xₜ]</text>
      <text x={250} y={164} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        ← concatenated hidden state + current input →
      </text>

      {/* Hidden state output */}
      <Box x={350} y={160} w={80} h={24} label="hₜ output" fill="#a855f7" rx={6} />

      {/* Input arrows up to gates */}
      {gates.map(g => (
        <Arrow key={g.label} x1={g.x} y1={148} x2={g.x} y2={CY + GATE_H} color={vt.axis} />
      ))}

      <text x={W_ / 2} y={H_ - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        LSTM Cell: Cₜ = fₜ·Cₜ₋₁ + iₜ·g̃ₜ   hₜ = oₜ·tanh(Cₜ)
      </text>
    </svg>
  );
}

function GANArch({ accentColor, vt }: { accentColor: string; vt: ReturnType<typeof useVizTheme> }) {
  const W_ = 520, H_ = 180;

  return (
    <svg viewBox={`0 0 ${W_} ${H_}`} className="w-full">
      {ARROW_DEFS(vt.axis)}

      {/* Generator path */}
      <Box x={10} y={40} w={70} h={40} label="Noise z" sublabel="p(z)" fill="#475569" />
      <Arrow x1={80} y1={60} x2={110} y2={60} color={vt.axis} />
      <Box x={110} y={30} w={100} h={60} label="Generator" sublabel="G(z)" fill={accentColor} />
      <Arrow x1={210} y1={60} x2={250} y2={60} color={vt.axis} />
      <text x={228} y={55} textAnchor="middle" fontSize={8} fill={vt.textMuted}>Fake</text>

      {/* Real data */}
      <Box x={10} y={110} w={70} h={40} label="Real Data" sublabel="p_data(x)" fill="#059669" />
      <Arrow x1={80} y1={130} x2={250} y2={100} color={vt.axis} />
      <text x={170} y={115} textAnchor="middle" fontSize={8} fill={vt.textMuted}>Real</text>

      {/* Discriminator */}
      <Box x={250} y={45} w={110} h={70} label="Discriminator" sublabel="D(x) → [0,1]" fill="#7c3aed" />

      {/* Output */}
      <Arrow x1={360} y1={80} x2={400} y2={80} color={vt.axis} />
      <Box x={400} y={58} w={80} h={44} label="Real/Fake?" sublabel="0 or 1" fill="#374151" />

      {/* Feedback arrows */}
      {/* Discriminator loss → back to D */}
      <path d="M 450 102 L 450 148 L 305 148 L 305 115" fill="none"
        stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,3" markerEnd="url(#arrowhead)" />
      <text x={360} y={163} textAnchor="middle" fontSize={8} fill="#f59e0b">Disc loss ∇</text>

      {/* Generator loss → back to G */}
      <path d="M 360 60 L 380 60 L 380 20 L 160 20 L 160 30" fill="none"
        stroke="#ff6b6b" strokeWidth={1.5} strokeDasharray="5,3" markerEnd="url(#arrowhead)" />
      <text x={270} y={16} textAnchor="middle" fontSize={8} fill="#ff6b6b">Gen loss ∇ (fool D)</text>

      <text x={W_ / 2} y={H_ - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        GAN min-max game: min_G max_D V(D,G)
      </text>
    </svg>
  );
}

function MLPArch({ accentColor, vt }: { accentColor: string; vt: ReturnType<typeof useVizTheme> }) {
  const W_ = 520, H_ = 200;
  const layers = [
    { label: "Input",   n: 3, x: 40,  color: "#475569" },
    { label: "Hidden₁", n: 4, x: 150, color: accentColor },
    { label: "Hidden₂", n: 4, x: 270, color: accentColor },
    { label: "Output",  n: 2, x: 400, color: "#059669" },
  ];
  const R = 14, CY = 100;

  return (
    <svg viewBox={`0 0 ${W_} ${H_}`} className="w-full">
      {/* Connection lines (draw first so nodes appear on top) */}
      {layers.slice(0, -1).map((lay, li) => {
        const nextLay = layers[li + 1];
        return lay.label !== "" && Array.from({ length: lay.n }, (_, i) => {
          const y1 = CY + (i - (lay.n - 1) / 2) * (R * 2.4);
          return Array.from({ length: nextLay.n }, (_, j) => {
            const y2 = CY + (j - (nextLay.n - 1) / 2) * (R * 2.4);
            return (
              <line key={`${li}-${i}-${j}`}
                x1={lay.x + R} y1={y1}
                x2={nextLay.x - R} y2={y2}
                stroke={vt.grid} strokeWidth={0.8} opacity={0.6}
              />
            );
          });
        });
      })}

      {/* Nodes */}
      {layers.map(lay =>
        Array.from({ length: lay.n }, (_, i) => {
          const cy = CY + (i - (lay.n - 1) / 2) * (R * 2.4);
          return (
            <g key={`${lay.label}-${i}`}>
              <circle cx={lay.x} cy={cy} r={R}
                fill={lay.color} stroke={vt.isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)"}
                strokeWidth={1.5} />
              {lay.n <= 3 && (
                <text x={lay.x} y={cy + 4} textAnchor="middle" fontSize={8} fill="white">
                  {i + 1}
                </text>
              )}
            </g>
          );
        })
      )}

      {/* Layer labels */}
      {layers.map(lay => (
        <g key={lay.label}>
          <text x={lay.x} y={H_ - 20} textAnchor="middle" fontSize={9} fill={lay.color} fontWeight="bold">
            {lay.label}
          </text>
          <text x={lay.x} y={H_ - 8} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
            {lay.n} units
          </text>
        </g>
      ))}

      {/* Activation labels */}
      {[150, 270].map(x => (
        <text key={x} x={x} y={CY + 60} textAnchor="middle" fontSize={8}
          fill={accentColor} fontFamily="monospace" opacity={0.8}>
          ReLU
        </text>
      ))}
      <text x={400} y={CY + 52} textAnchor="middle" fontSize={8}
        fill="#059669" fontFamily="monospace" opacity={0.8}>
        Softmax
      </text>

      <text x={W_ / 2} y={H_ - 42} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Multi-Layer Perceptron — fully-connected layers with non-linear activations
      </text>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const ARCH_OPTIONS: ArchType[] = ["cnn", "transformer", "lstm", "gan", "mlp"];

export default function ModelArchViz({ accentColor = "#6c63ff", defaultType = "mlp" }: {
  accentColor?: string;
  defaultType?: ArchType;
}) {
  const [archType, setArchType] = useState<ArchType>(defaultType);
  const vt = useVizTheme();

  const renderArch = () => {
    switch (archType) {
      case "cnn":         return <CNNArch accentColor={accentColor} vt={vt} />;
      case "transformer": return <TransformerArch accentColor={accentColor} vt={vt} />;
      case "lstm":        return <LSTMArch accentColor={accentColor} vt={vt} />;
      case "gan":         return <GANArch accentColor={accentColor} vt={vt} />;
      case "mlp":         return <MLPArch accentColor={accentColor} vt={vt} />;
      default:            return <MLPArch accentColor={accentColor} vt={vt} />;
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {ARCH_LABELS[archType]}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {ARCH_OPTIONS.map(opt => (
            <button key={opt} onClick={() => setArchType(opt)}
              className="px-2 py-0.5 rounded-md text-xs font-medium transition-all"
              style={{
                backgroundColor: archType === opt ? `${accentColor}25` : "var(--bg-card)",
                color: archType === opt ? accentColor : "var(--text-muted)",
                border: `1px solid ${archType === opt ? accentColor + "50" : "var(--border)"}`,
              }}>
              {opt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <motion.div
          key={archType}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderArch()}
        </motion.div>
      </div>

      {/* Architecture key */}
      <div className="px-5 pb-3 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-wrap gap-3 mt-2">
          {archType === "cnn" && [
            { c: accentColor,  l: "Conv + ReLU" },
            { c: "#0891b2",    l: "Pooling" },
            { c: "#7c3aed",    l: "Flatten" },
            { c: "#059669",    l: "FC + Softmax" },
          ].map(({ c, l }) => (
            <span key={l} className="flex items-center gap-1 text-xs" style={{ color: vt.textMuted }}>
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              {l}
            </span>
          ))}
          {archType === "transformer" && [
            { c: accentColor,  l: "Multi-Head Attention" },
            { c: "#7c3aed",    l: "Feed-Forward" },
            { c: "#f59e0b",    l: "Residual connections" },
          ].map(({ c, l }) => (
            <span key={l} className="flex items-center gap-1 text-xs" style={{ color: vt.textMuted }}>
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              {l}
            </span>
          ))}
          {archType === "lstm" && [
            { c: "#ff6b6b", l: "Forget gate" },
            { c: "#f59e0b", l: "Input gate" },
            { c: accentColor, l: "Cell gate" },
            { c: "#a855f7", l: "Output gate" },
          ].map(({ c, l }) => (
            <span key={l} className="flex items-center gap-1 text-xs" style={{ color: vt.textMuted }}>
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
