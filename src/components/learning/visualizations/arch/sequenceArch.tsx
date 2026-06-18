"use client";
import { useVizTheme } from "@/hooks/useVizTheme";
import { ARROW_DEFS, Arrow, Box, textOn } from './primitives';
import type { VT } from './primitives';

function RNNArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 200;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const tokens = ["x₁", "x₂", "x₃", "x₄"];
  const NW = 54, NH = 38, CY = 90;
  const startX = 52;
  // spacing = (W − startX − endPad − n*NW) / (n−1), endPad≈28 for "→…" text
  const spacing = (W - startX - 28 - tokens.length * NW) / (tokens.length - 1);
  // Cell 4 right edge: 52 + 3*(54+spacing) + 54 ≈ 510 ≤ 540 ✓

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-rnn", ac)}
      {/* Initial hidden state */}
      <Box x={6} y={CY - NH / 2} w={38} h={NH} label="h₀" sublabel="zeros"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={6} />
      <Arrow x1={44} y1={CY} x2={startX} y2={CY} color={ac} markerId="arr-rnn" />

      {tokens.map((tok, i) => {
        const cx = startX + i * (NW + spacing) + NW / 2;
        return (
          <g key={tok}>
            {/* Hidden cell */}
            <Box x={cx - NW / 2} y={CY - NH / 2} w={NW} h={NH}
              label={`hₜ`} sublabel={tok}
              bg={accent} textColor={textOn(accent)} rx={8} />
            {/* Input arrow (from below) */}
            <Arrow x1={cx} y1={CY + NH / 2 + 24} x2={cx} y2={CY + NH / 2}
              color={ac} markerId="arr-rnn" />
            <text x={cx} y={CY + NH / 2 + 36} textAnchor="middle" fontSize={9}
              fill={vt.textMuted} fontStyle="italic">{tok}</text>
            {/* Output arrow (above) */}
            <Arrow x1={cx} y1={CY - NH / 2} x2={cx} y2={CY - NH / 2 - 18}
              color={ac} markerId="arr-rnn" />
            <text x={cx} y={CY - NH / 2 - 22} textAnchor="middle" fontSize={9}
              fill={vt.textMuted}>y{i + 1}</text>
            {/* Recurrence arrow */}
            {i < tokens.length - 1 && (
              <Arrow x1={cx + NW / 2} y1={CY}
                x2={cx + NW / 2 + spacing} y2={CY}
                color={accent} markerId="arr-rnn" />
            )}
          </g>
        );
      })}
      {/* Final hidden */}
      <text x={W - 20} y={CY + 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>→…</text>

      {/* Formula bar */}
      <rect x={14} y={H - 38} width={W - 28} height={30} rx={6} fill={vt.surface} />
      <text x={W / 2} y={H - 24} textAnchor="middle" fontSize={8.5} fill={vt.text}
        fontFamily="monospace">
        hₜ = tanh(Wₓ·xₜ + Wₕ·hₜ₋₁ + b)    yₜ = Wᵧ·hₜ + bᵧ
      </text>
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}
        fontFamily="monospace">
        Wₓ:[d×h]  Wₕ:[h×h]  Wᵧ:[h×o]  h₀=0  ·  shared weights all timesteps
      </text>
    </svg>
  );
}

// 20. GRU cell

function LSTMArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 222;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const GATE_W = 82, GATE_H = 44;
  const INPUT_Y = 6,  INPUT_H = 26;   // shared input row at top
  const TRACK_Y = 50;                  // cell track center (rect: y=38..62)
  const GATE_Y  = 80;                  // gate boxes top

  const gates = [
    { label: "Forget fₜ",  eq: "σ(Wf·[h,x]+bf)", color: "#ef4444", x: 70  },
    { label: "Input iₜ",   eq: "σ(Wi·[h,x]+bi)", color: "#f59e0b", x: 190 },
    { label: "Cell g̃ₜ",    eq: "tanh(Wg·[h,x])", color: accent,    x: 310 },
    { label: "Output oₜ",  eq: "σ(Wo·[h,x]+bo)", color: "#a855f7", x: 430 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-lstm", arrowColor)}

      {/* ── Shared input row at TOP ── */}
      <rect x={16} y={INPUT_Y} width={W - 32} height={INPUT_H} rx={8}
        fill={vt.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}
        stroke={vt.border} strokeWidth={1} />
      <text x={W/2} y={INPUT_Y + 17} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Shared input: [hₜ₋₁, xₜ]  →  fed to all 4 gates simultaneously
      </text>

      {/* ── Cell state highway (middle track) ── */}
      <rect x={20} y={TRACK_Y - 12} width={W - 40} height={24} rx={12}
        fill={vt.isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}
        stroke={vt.border} strokeWidth={1.5} />
      <text x={24} y={TRACK_Y + 5} fontSize={9} fill={vt.textMuted} fontWeight="bold">Cₜ₋₁</text>
      <text x={87} y={TRACK_Y + 6} fontSize={15} fill={vt.ink("#ef4444")} opacity={0.9}>×</text>
      <text x={208} y={TRACK_Y + 6} fontSize={15} fill={vt.ink("#f59e0b")} opacity={0.9}>+</text>
      <text x={W - 46} y={TRACK_Y + 5} fontSize={9} fill={vt.textMuted} fontWeight="bold">Cₜ</text>

      {/* ── Gate boxes ── */}
      {gates.map(g => (
        <g key={g.label}>
          <rect x={g.x - GATE_W/2} y={GATE_Y} width={GATE_W} height={GATE_H} rx={8}
            fill={`${g.color}1c`} stroke={g.color} strokeWidth={1.5} />
          <text x={g.x} y={GATE_Y + 16} textAnchor="middle" fontSize={9}
            fontWeight="bold" fill={g.color}>{g.label}</text>
          <text x={g.x} y={GATE_Y + 32} textAnchor="middle" fontSize={7.5}
            fill={g.color} fontFamily="monospace">
            {g.eq.length > 18 ? g.eq.slice(0, 17) + "…" : g.eq}
          </text>
          {/* Arrow: input row (bottom=32) → gate top (GATE_Y=80) — 48px DOWN */}
          <Arrow x1={g.x} y1={INPUT_Y + INPUT_H} x2={g.x} y2={GATE_Y}
            color={arrowColor} markerId="arr-lstm" />
          {/* Arrow: gate top (GATE_Y=80) → track bottom (62) — 18px UP */}
          <Arrow x1={g.x} y1={GATE_Y} x2={g.x} y2={TRACK_Y + 12}
            color={g.color} markerId="arr-lstm" />
        </g>
      ))}

      {/* ── Output box (below gates, no overlap) ── */}
      <Box x={366} y={138} w={158} h={32}
        label="hₜ = oₜ · tanh(Cₜ)"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />
      {/* Arrow: output gate (bottom=124) → output box (top=138) */}
      <Arrow x1={430} y1={GATE_Y + GATE_H} x2={430} y2={138}
        color="#a855f7" markerId="arr-lstm" />

      {/* ── Footer formula ── */}
      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        LSTM: Cₜ = fₜ⊙Cₜ₋₁ + iₜ⊙g̃ₜ  ·  hₜ = oₜ⊙tanh(Cₜ)  ·  fₜ,iₜ,oₜ∈(0,1)  g̃ₜ∈(−1,1)
      </text>
    </svg>
  );
}

// 12. GAN loop

function GRUArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 220;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const GATE_W = 116, GATE_H = 44, GATE_Y = 90;

  const gates = [
    { label: "Reset Gate rₜ",  eq: "σ(Wr·[hₜ₋₁,xₜ])", color: "#ef4444", x: 80  },
    { label: "Update Gate zₜ", eq: "σ(Wz·[hₜ₋₁,xₜ])", color: "#f59e0b", x: 230 },
    { label: "Candidate h̃ₜ",  eq: "tanh(Wh·[rₜ·h,xₜ])", color: accent,  x: 390 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-gru", ac)}

      {/* Shared input row */}
      <rect x={16} y={158} width={W - 32} height={26} rx={8}
        fill={vt.surface} stroke={vt.border} strokeWidth={1} />
      <text x={W / 2} y={175} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Shared input: [hₜ₋₁, xₜ]  →  fed to all 3 gates
      </text>

      {/* Gate boxes */}
      {gates.map(g => (
        <g key={g.label}>
          <rect x={g.x - GATE_W / 2} y={GATE_Y} width={GATE_W} height={GATE_H} rx={8}
            fill={`${g.color}18`} stroke={g.color} strokeWidth={1.5} />
          <text x={g.x} y={GATE_Y + 16} textAnchor="middle" fontSize={9}
            fontWeight="bold" fill={g.color}>{g.label}</text>
          <text x={g.x} y={GATE_Y + 32} textAnchor="middle" fontSize={7.5}
            fill={g.color} fontFamily="monospace">{g.eq}</text>
          <Arrow x1={g.x} y1={158} x2={g.x} y2={GATE_Y + GATE_H}
            color={ac} markerId="arr-gru" />
        </g>
      ))}

      {/* Output equation */}
      <rect x={16} y={36} width={W - 32} height={38} rx={8}
        fill={`${accent}12`} stroke={`${accent}35`} strokeWidth={1.5} />
      <text x={W / 2} y={53} textAnchor="middle" fontSize={10} fill={vt.ink(accent)} fontWeight="bold">
        hₜ = (1 − zₜ) · hₜ₋₁ + zₜ · h̃ₜ
      </text>
      <text x={W / 2} y={68} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        update gate blends old memory (1−zₜ) with new candidate (zₜ)
      </text>

      {/* Arrows from gates to output */}
      {gates.map(g => (
        <Arrow key={`go-${g.label}`} x1={g.x} y1={GATE_Y} x2={g.x} y2={74}
          color={g.color} markerId="arr-gru" />
      ))}

      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        GRU: 2 gates (vs LSTM 4) · no separate cell state · faster · comparable performance
      </text>
    </svg>
  );
}

// 21. ResNet — skip connections (fixed arc arrow)

export { RNNArch, LSTMArch, GRUArch };
