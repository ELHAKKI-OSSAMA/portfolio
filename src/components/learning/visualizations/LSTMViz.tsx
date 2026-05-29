"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, RotateCcw } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const LSTM_LABELS = {
  en: {
    title: "LSTM Cell — Gate-by-Gate",
    subtitle: (step: number, total: number) => `token ${step}/${total} · Ct = f·Ct₋₁ + i·g̃`,
    next: "Next",
    cellLabel: "Cell state Cₜ (conveyor belt)",
    gateNames: ["Forget", "Input", "Cell", "Output"] as readonly string[],
    fHigh: "Keep most old memory", fMid: "Partial forget", fLow: "Forget old context",
    iHigh: "Write to memory", iMid: "Selective write", iLow: "Block new input",
  },
  fr: {
    title: "Cellule LSTM — Porte par Porte",
    subtitle: (step: number, total: number) => `token ${step}/${total} · Ct = f·Ct₋₁ + i·g̃`,
    next: "Suivant",
    cellLabel: "État de cellule Cₜ (tapis roulant)",
    gateNames: ["Oubli", "Entrée", "Cellule", "Sortie"] as readonly string[],
    fHigh: "Conserver la mémoire ancienne", fMid: "Oubli partiel", fLow: "Oublier le contexte",
    iHigh: "Écrire en mémoire", iMid: "Écriture sélective", iLow: "Bloquer la nouvelle entrée",
  },
  ar: {
    title: "خلية LSTM — بوابة تلو بوابة",
    subtitle: (step: number, total: number) => `رمز ${step}/${total} · Ct = f·Ct₋₁ + i·g̃`,
    next: "التالي",
    cellLabel: "حالة الخلية Cₜ (الحزام الناقل)",
    gateNames: ["نسيان", "مدخل", "خلية", "مخرج"] as readonly string[],
    fHigh: "الاحتفاظ بالذاكرة القديمة", fMid: "نسيان جزئي", fLow: "نسيان السياق القديم",
    iHigh: "الكتابة في الذاكرة", iMid: "كتابة انتقائية", iLow: "حجب المدخل الجديد",
  },
} as const;

// ── Gate functions ────────────────────────────────────────────────────────────
function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

// ── Tokens + simple trainable-style weights (fixed but meaningful) ────────────
const TOKENS = ["<s>", "The", "cat", "sat", "on", "mat", "</s>"];

// Token embedding: simple index encoding scaled
function embed(i: number) { return [(i - 3) * 0.3, Math.sin(i * 1.1) * 0.5]; }

// Fixed weights (pretend these were learned)
const Wf  = [[0.6, -0.3], [0.4, 0.5]];
const Wi  = [[0.5, 0.4],  [-0.2, 0.7]];
const Wg  = [[-0.3, 0.8], [0.7, -0.4]];
const Wo  = [[0.4, -0.5], [0.6, 0.3]];
const bf  = [0.1, -0.2];
const bi  = [0.0, 0.3];
const bg  = [0.2, -0.1];
const bo  = [-0.1, 0.4];

function dot2(W: number[][], x: number[], b: number[]) {
  return [
    W[0][0] * x[0] + W[0][1] * x[1] + b[0],
    W[1][0] * x[0] + W[1][1] * x[1] + b[1],
  ];
}

function computeLSTM(tokens: string[]) {
  const steps: Array<{
    token: string;
    f: number; i: number; g: number; o: number;
    c: number; h: number;
    cVec: [number, number]; hVec: [number, number];
    fDesc: string; iDesc: string; gDesc: string; oDesc: string;
  }> = [];

  let cVec: [number, number] = [0, 0];
  let hVec: [number, number] = [0, 0];

  for (let t = 0; t < tokens.length; t++) {
    const xVec = embed(t);
    const inp = [xVec[0] + hVec[0], xVec[1] + hVec[1]]; // concat simplified

    const fRaw = dot2(Wf, inp, bf);
    const iRaw = dot2(Wi, inp, bi);
    const gRaw = dot2(Wg, inp, bg);
    const oRaw = dot2(Wo, inp, bo);

    const fGate  = [sigmoid(fRaw[0]), sigmoid(fRaw[1])];
    const iGate  = [sigmoid(iRaw[0]), sigmoid(iRaw[1])];
    const gGate  = [Math.tanh(gRaw[0]), Math.tanh(gRaw[1])];
    const oGate  = [sigmoid(oRaw[0]), sigmoid(oRaw[1])];

    const newC: [number, number] = [
      fGate[0] * cVec[0] + iGate[0] * gGate[0],
      fGate[1] * cVec[1] + iGate[1] * gGate[1],
    ];
    const newH: [number, number] = [
      oGate[0] * Math.tanh(newC[0]),
      oGate[1] * Math.tanh(newC[1]),
    ];

    // Scalar summaries for display
    const f = (fGate[0] + fGate[1]) / 2;
    const i_ = (iGate[0] + iGate[1]) / 2;
    const g = (Math.abs(gGate[0]) + Math.abs(gGate[1])) / 2;
    const o = (oGate[0] + oGate[1]) / 2;
    const c = Math.tanh((newC[0] + newC[1]) / 2);
    const h = (newH[0] + newH[1]) / 2;

    cVec = newC; hVec = newH;

    steps.push({
      token: tokens[t], f, i: i_, g, o, c, h, cVec, hVec,
      fDesc: f > 0.6 ? "Keep most old memory" : f > 0.35 ? "Partial forget" : "Forget old context",
      iDesc: i_ > 0.6 ? "Write to memory" : i_ > 0.35 ? "Selective write" : "Block new input",
      gDesc: g > 0.6 ? "Strong signal" : g > 0.35 ? "Moderate signal" : "Weak signal",
      oDesc: o > 0.6 ? "Expose hidden" : o > 0.35 ? "Partial output" : "Gate output",
    });
  }
  return steps;
}

const ALL_STEPS = computeLSTM(TOKENS);

// ── Visual constants ──────────────────────────────────────────────────────────
const W = 520, H = 300, PAD = 20;
const TRACK_Y = 54;      // conveyor belt
const GATE_Y = 110;      // gate row start
const GATE_W = 96, GATE_H = 56;
const GATE_XS = [54, 166, 278, 390]; // x-centers for f, i, g, o gates

function gateColor(v: number, type: "gate" | "cell") {
  if (type === "cell") return v > 0 ? "#00d4aa" : "#ff6b6b";
  if (v > 0.65) return "#00d4aa";
  if (v > 0.35) return "#f59e0b";
  return "#ff6b6b";
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LSTMViz({ accentColor = "#a855f7" }: { accentColor?: string }) {
  const [step, setStep] = useState(0);
  const vt = useVizTheme();
  const L = useVizLocale(LSTM_LABELS);
  const cur = ALL_STEPS[step];
  const prev = step > 0 ? ALL_STEPS[step - 1] : null;

  // Locale-aware gate descriptions
  const fDescL = cur.f > 0.6 ? L.fHigh : cur.f > 0.35 ? L.fMid : L.fLow;
  const iDescL = cur.i > 0.6 ? L.iHigh : cur.i > 0.35 ? L.iMid : L.iLow;

  const fColor = gateColor(cur.f, "gate");
  const iColor = gateColor(cur.i, "gate");
  const gColor = gateColor(cur.g, "gate");
  const oColor = gateColor(cur.o, "gate");
  const cColor = gateColor(cur.c, "cell");

  // Cell state history for sparkline
  const cHistory = useMemo(
    () => ALL_STEPS.slice(0, step + 1).map(s => s.c),
    [step]
  );

  const gates = [
    { key: "f", label: "f", name: L.gateNames[0], eq: "σ(Wf·[h,x]+bf)", value: cur.f, desc: cur.fDesc, color: fColor },
    { key: "i", label: "i", name: L.gateNames[1], eq: "σ(Wi·[h,x]+bi)", value: cur.i, desc: cur.iDesc, color: iColor },
    { key: "g", label: "g̃", name: L.gateNames[2], eq: "tanh(Wg·[h,x]+bg)", value: cur.g, desc: cur.gDesc, color: gColor },
    { key: "o", label: "o", name: L.gateNames[3], eq: "σ(Wo·[h,x]+bo)", value: cur.o, desc: cur.oDesc, color: oColor },
  ];

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {L.subtitle(step + 1, TOKENS.length)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(s => Math.min(TOKENS.length - 1, s + 1))}
            disabled={step >= TOKENS.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: `${accentColor}25`,
              color: accentColor,
              border: `1px solid ${accentColor}50`,
              opacity: step >= TOKENS.length - 1 ? 0.4 : 1,
            }}
          >
            <ChevronRight size={12} />
            {L.next}
          </button>
          <button onClick={() => setStep(0)} className="p-1.5 rounded-lg"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <marker id="arr-lstm-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 Z" fill={vt.axis} />
          </marker>
        </defs>

        {/* ── CONVEYOR BELT: cell state ── */}
        {/* Background rail */}
        <rect x={PAD} y={TRACK_Y - 10} width={W - 2 * PAD} height={20} rx={10}
          fill={vt.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}
          stroke={vt.border} strokeWidth={1} />

        {/* Cell state dots per step */}
        {ALL_STEPS.map((s, ti) => {
          const cx = PAD + 20 + ti * ((W - 2 * PAD - 40) / (TOKENS.length - 1));
          const r = 7 + Math.abs(s.c) * 5;
          const col = gateColor(s.c, "cell");
          const isActive = ti <= step;
          return (
            <g key={ti}>
              <motion.circle cx={cx} cy={TRACK_Y} r={isActive ? r : 5}
                fill={isActive ? col : vt.surface}
                stroke={ti === step ? col : vt.border}
                strokeWidth={ti === step ? 2.5 : 1}
                opacity={isActive ? 1 : 0.35}
                animate={{ r: isActive ? r : 5 }}
                transition={{ duration: 0.4 }}
              />
              {isActive && (
                <text x={cx} y={TRACK_Y + 4} textAnchor="middle"
                  fontSize={7} fill={vt.isDark ? "#fff" : "#000"}
                  fontFamily="monospace">
                  {s.c.toFixed(2)}
                </text>
              )}
            </g>
          );
        })}

        {/* Cell state label */}
        <text x={PAD + 2} y={TRACK_Y - 16} fontSize={9} fill={vt.textMuted}>
          {L.cellLabel}
        </text>
        <text x={W - PAD - 2} y={TRACK_Y - 16} textAnchor="end" fontSize={9} fill={cColor} fontFamily="monospace">
          Cₜ = {cur.c.toFixed(3)}
        </text>

        {/* Arrow from last cell to output */}
        <line x1={W - PAD - 10} y1={TRACK_Y} x2={W - PAD - 2} y2={TRACK_Y}
          stroke={vt.axis} strokeWidth={1} markerEnd="url(#arr-lstm-arrow)" />

        {/* ── TOKEN RIBBON ── */}
        {TOKENS.map((tok, ti) => {
          const cx = PAD + 20 + ti * ((W - 2 * PAD - 40) / (TOKENS.length - 1));
          const isActive = ti === step;
          const isPast   = ti < step;
          return (
            <g key={`tok-${ti}`}>
              <rect x={cx - 18} y={TRACK_Y + 18} width={36} height={16} rx={4}
                fill={isActive ? `${accentColor}25` : isPast ? vt.surface : "transparent"}
                stroke={isActive ? accentColor : vt.border}
                strokeWidth={isActive ? 1.5 : 0.5}
              />
              <text x={cx} y={TRACK_Y + 30} textAnchor="middle"
                fontSize={isActive ? 9 : 8}
                fill={isActive ? accentColor : vt.textMuted}
                fontWeight={isActive ? "bold" : "normal"}>
                {tok}
              </text>
            </g>
          );
        })}

        {/* ── GATE BOXES ── */}
        {gates.map((gate, gi) => {
          const gx = GATE_XS[gi];
          const gy = GATE_Y;
          const col = gate.color;
          return (
            <g key={gate.key}>
              {/* Box */}
              <rect x={gx - GATE_W / 2} y={gy} width={GATE_W} height={GATE_H} rx={8}
                fill={`${col}12`} stroke={`${col}55`} strokeWidth={1.5} />

              {/* Gate label circle */}
              <circle cx={gx} cy={gy + 14} r={9} fill={col} opacity={0.9} />
              <text x={gx} y={gy + 18} textAnchor="middle" fontSize={9}
                fill="white" fontWeight="bold">{gate.label}</text>

              {/* Gate name */}
              <text x={gx} y={gy + 30} textAnchor="middle" fontSize={8.5}
                fill={vt.textMuted}>{gate.name}</text>

              {/* Value bar */}
              <rect x={gx - 30} y={gy + 36} width={60} height={7} rx={3.5}
                fill={vt.surface} />
              <motion.rect
                x={gx - 30} y={gy + 36}
                width={60 * Math.abs(gate.value)} height={7} rx={3.5}
                fill={col}
                animate={{ width: 60 * Math.abs(gate.value) }}
                transition={{ duration: 0.45 }}
              />

              {/* Value text */}
              <AnimatePresence mode="wait">
                <motion.text key={`${gate.key}-${step}`}
                  x={gx} y={gy + GATE_H + 1} textAnchor="middle"
                  fontSize={8} fill={col} fontFamily="monospace"
                  initial={{ opacity: 0, y: gy + GATE_H + 5 }}
                  animate={{ opacity: 1, y: gy + GATE_H + 1 }}
                  exit={{ opacity: 0 }}
                >
                  {gate.value.toFixed(3)}
                </motion.text>
              </AnimatePresence>
            </g>
          );
        })}

        {/* ── LSTM equation flow arrows ── */}
        {/* f → cell state (forget old) */}
        <line x1={GATE_XS[0]} y1={GATE_Y} x2={GATE_XS[0]} y2={TRACK_Y + 10}
          stroke={fColor} strokeWidth={1.5} strokeDasharray="3,2" opacity={0.6} />

        {/* i×g → add to cell state */}
        <line x1={(GATE_XS[1] + GATE_XS[2]) / 2} y1={GATE_Y}
          x2={(GATE_XS[1] + GATE_XS[2]) / 2} y2={TRACK_Y + 10}
          stroke={iColor} strokeWidth={1.5} strokeDasharray="3,2" opacity={0.6} />

        {/* o → hidden state output */}
        <line x1={GATE_XS[3]} y1={GATE_Y} x2={GATE_XS[3]} y2={TRACK_Y + 10}
          stroke={oColor} strokeWidth={1.5} strokeDasharray="3,2" opacity={0.6} />

        {/* ── Hidden state output panel ── */}
        <rect x={PAD} y={GATE_Y + GATE_H + 18} width={W - 2 * PAD} height={36} rx={8}
          fill={vt.isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"}
          stroke={vt.border} strokeWidth={1} />

        <text x={PAD + 12} y={GATE_Y + GATE_H + 32} fontSize={8.5} fill={vt.textMuted}>
          hₜ = o · tanh(Cₜ)
        </text>
        <AnimatePresence mode="wait">
          <motion.text key={`h-${step}`}
            x={PAD + 140} y={GATE_Y + GATE_H + 32}
            fontSize={9} fill={oColor} fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            = {cur.h.toFixed(4)}
          </motion.text>
        </AnimatePresence>

        <text x={W - PAD - 12} y={GATE_Y + GATE_H + 32} textAnchor="end" fontSize={8.5} fill={vt.textMuted}>
          Cₜ₋₁ = {(prev?.c ?? 0).toFixed(3)}   →   Cₜ = {cur.c.toFixed(3)}
        </text>

        {/* Step indicator */}
        <text x={W / 2} y={GATE_Y + GATE_H + 46} textAnchor="middle"
          fontSize={8} fill={vt.textMuted}>
          {fDescL} · {iDescL}
        </text>
      </svg>

      {/* Gate equations footer */}
      <div className="grid grid-cols-4 border-t text-center" style={{ borderColor: "var(--border)" }}>
        {gates.map(g => (
          <div key={g.key} className="py-2.5 px-1">
            <div className="text-xs font-mono" style={{ color: g.color }}>{g.eq}</div>
            <div className="text-sm font-bold font-mono mt-0.5" style={{ color: g.color }}>
              {g.value.toFixed(3)}
            </div>
          </div>
        ))}
      </div>
    </VizCard>
  );
}
