"use client";
import { useVizTheme } from "@/hooks/useVizTheme";
import { ARROW_DEFS, Arrow, Box, textOn } from './primitives';
import type { VT } from './primitives';

function EvaluationArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 170;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-eval", arrowColor)}

      {/* Dataset split */}
      <Box x={10} y={60} w={80} h={50} label="Dataset" sublabel="N samples"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />
      <Arrow x1={90} y1={85} x2={120} y2={50} color={arrowColor} markerId="arr-eval" />
      <Arrow x1={90} y1={85} x2={120} y2={85} color={arrowColor} markerId="arr-eval" />
      <Arrow x1={90} y1={85} x2={120} y2={120} color={arrowColor} markerId="arr-eval" />

      {/* Splits */}
      {[
        { y: 32, label: "Train 70%", bg: accent },
        { y: 67, label: "Val 15%",   bg: vt.isDark ? "#7c3aed" : "#8b5cf6" },
        { y: 102, label: "Test 15%", bg: vt.isDark ? "#059669" : "#34d399" },
      ].map(s => (
        <g key={s.label}>
          <Box x={120} y={s.y} w={80} h={28} label={s.label}
            bg={s.bg} textColor={textOn(s.bg)} rx={6} />
          <Arrow x1={200} y1={s.y + 14} x2={238} y2={s.y + 14}
            color={arrowColor} markerId="arr-eval" />
        </g>
      ))}

      {/* Model training */}
      <Box x={238} y={52} w={100} h={44} label="Model Train" sublabel="loss minimization"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={338} y1={74} x2={376} y2={74} color={arrowColor} markerId="arr-eval" />

      {/* Evaluation */}
      <Box x={376} y={40} w={80} h={70} label="Evaluate" sublabel="Val + Test"
        bg={vt.isDark ? "#374151" : "#e2e8f0"} textColor={vt.text} rx={8} />
      <Arrow x1={456} y1={75} x2={488} y2={75} color={arrowColor} markerId="arr-eval" />

      {/* Metrics */}
      {[
        { y: 34,  label: "ROC-AUC" },
        { y: 58,  label: "F1 Score" },
        { y: 82,  label: "Precision" },
        { y: 106, label: "Recall" },
      ].map(m => (
        <g key={m.label}>
          <text x={492} y={m.y + 12} fontSize={9} fill={vt.ink(accent)} fontWeight="500">{m.label}</text>
        </g>
      ))}

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Evaluation: train on train set, tune on val, report once on test set
      </text>
    </svg>
  );
}

// 14. Bias-Variance spectrum

function BiasVarianceArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 180;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-bv", arrowColor)}

      {/* Zones */}
      <rect x={14} y={20} width={160} height={130} rx={8}
        fill={vt.isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.07)"}
        stroke="#ef4444" strokeWidth={1} strokeDasharray="5,3" />
      <text x={94} y={36} textAnchor="middle" fontSize={9} fill={vt.ink("#ef4444")} fontWeight="bold">
        Underfitting
      </text>
      <text x={94} y={50} textAnchor="middle" fontSize={8} fill={vt.ink("#ef4444")}>
        High Bias
      </text>

      <rect x={188} y={20} width={164} height={130} rx={8}
        fill={`${accent}10`} stroke={accent} strokeWidth={1} strokeDasharray="5,3" />
      <text x={270} y={36} textAnchor="middle" fontSize={9} fill={vt.ink(accent)} fontWeight="bold">
        Sweet Spot
      </text>
      <text x={270} y={50} textAnchor="middle" fontSize={8} fill={vt.ink(accent)}>
        Low Bias + Low Variance
      </text>

      <rect x={366} y={20} width={160} height={130} rx={8}
        fill={vt.isDark ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.07)"}
        stroke="#f59e0b" strokeWidth={1} strokeDasharray="5,3" />
      <text x={446} y={36} textAnchor="middle" fontSize={9} fill={vt.ink("#f59e0b")} fontWeight="bold">
        Overfitting
      </text>
      <text x={446} y={50} textAnchor="middle" fontSize={8} fill={vt.ink("#f59e0b")}>
        High Variance
      </text>

      {/* Models examples */}
      {[
        { x: 94,  label: "Linear",    sub: "degree 1" },
        { x: 270, label: "Polynomial", sub: "degree 4-6" },
        { x: 446, label: "Deep NN",   sub: "large, no reg" },
      ].map(m => (
        <g key={m.label}>
          <Box x={m.x - 44} y={64} w={88} h={44}
            label={m.label} sublabel={m.sub}
            bg={m.x === 270 ? accent : (m.x < 270 ? "#ef4444" : "#f59e0b")}
            textColor={textOn(m.x === 270 ? accent : "#ef4444")} rx={8} />
        </g>
      ))}

      {/* Error = Bias² + Variance + Noise */}
      <rect x={14} y={120} width={512} height={26} rx={6}
        fill={vt.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
        stroke={vt.border} strokeWidth={1} />
      <text x={270} y={136} textAnchor="middle" fontSize={9} fill={vt.text} fontFamily="monospace">
        Total Error = Bias² + Variance + Irreducible Noise
      </text>

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        Regularization (L1/L2, dropout, early stopping) moves left → sweet spot
      </text>
    </svg>
  );
}

// 15. Multiclass — two-row layout (OvA top, OvO bottom), all text inside boxes

function MulticlassArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 300;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const purple = vt.isDark ? "#7c3aed" : "#8b5cf6";
  const green  = vt.isDark ? "#059669" : "#34d399";
  const nb     = vt.isDark ? "#334155" : "#e2e8f0";

  // Common classifier box dimensions — narrower to give arrows room
  const BX = 10, BW = 182, BH = 32;

  // OvA row — boxes pushed down 16px so section title (y=22) sits above box 1 (y=38)
  const OVA_BG_Y = 8, OVA_H = 128;   // section: 8 → 136
  const ovaYs = [38, 70, 102];         // was [22,54,86]; box3 bottom=134 ✓

  // OvO row — same treatment; OVO_BG_Y pushed down to follow OVA bottom + gap
  const OVO_BG_Y = 144, OVO_H = 128;  // section: 144 → 272
  const ovoYs = [174, 206, 238];       // was [140,172,204]; title at 158, box1 at 174 ✓

  // Aggregation boxes — pushed right to make room for ~34px arrow gap
  const AGG_X = 226, AGG_W = 88, AGG_H = 56;
  // Output boxes
  const OUT_X = 330, OUT_W = 80;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-mc", ac)}

      {/* ── OvA section (top row) ── */}
      <rect x={4} y={OVA_BG_Y} width={198} height={OVA_H} rx={8}
        fill={`${accent}07`} stroke={`${accent}25`} strokeWidth={1} strokeDasharray="4,3" />
      <text x={103} y={OVA_BG_Y + 14} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.ink(accent)}>
        One-vs-All (OvA) — 3 classifiers
      </text>
      {["A","B","C"].map((c, i) => (
        <Box key={`ova-${c}`} x={BX} y={ovaYs[i]} w={BW} h={BH}
          label={`Class ${c}  vs  All Others`}
          sublabel={`→ P(y=${c} | x)`}
          bg={accent} textColor={textOn(accent)} rx={5} />
      ))}
      {/* Arrows from each OvA box to argmax */}
      {ovaYs.map((y, i) => (
        <Arrow key={`ova-arr-${i}`} x1={BX + BW} y1={y + BH/2}
          x2={AGG_X} y2={OVA_BG_Y + OVA_H/2}
          color={ac} markerId="arr-mc" />
      ))}
      <Box x={AGG_X} y={OVA_BG_Y + (OVA_H - AGG_H)/2} w={AGG_W} h={AGG_H}
        label="argmax" sublabel="→ class ĉ"
        bg={green} textColor={textOn(green)} rx={8} />
      <Arrow x1={AGG_X + AGG_W} y1={OVA_BG_Y + OVA_H/2}
        x2={OUT_X} y2={OVA_BG_Y + OVA_H/2}
        color={ac} markerId="arr-mc" />
      <Box x={OUT_X} y={OVA_BG_Y + (OVA_H - 36)/2} w={OUT_W} h={36}
        label="Class A|B|C" sublabel="max softmax"
        bg={nb} textColor={vt.text} rx={8} />

      {/* ── OvO section (bottom row) ── */}
      <rect x={4} y={OVO_BG_Y} width={198} height={OVO_H} rx={8}
        fill={`${purple}08`} stroke={`${purple}25`} strokeWidth={1} strokeDasharray="4,3" />
      <text x={103} y={OVO_BG_Y + 14} textAnchor="middle" fontSize={9} fontWeight="bold" fill={purple}>
        One-vs-One (OvO) — C(C−1)/2 = 3 classifiers
      </text>
      {[["A","B"],["A","C"],["B","C"]].map(([c1,c2], i) => (
        <Box key={`ovo-${c1}${c2}`} x={BX} y={ovoYs[i]} w={BW} h={BH}
          label={`Class ${c1}  vs  Class ${c2}`}
          sublabel="binary classifier → vote"
          bg={purple} textColor="white" rx={5} />
      ))}
      {ovoYs.map((y, i) => (
        <Arrow key={`ovo-arr-${i}`} x1={BX + BW} y1={y + BH/2}
          x2={AGG_X} y2={OVO_BG_Y + OVO_H/2}
          color={ac} markerId="arr-mc" />
      ))}
      <Box x={AGG_X} y={OVO_BG_Y + (OVO_H - AGG_H)/2} w={AGG_W} h={AGG_H}
        label="Majority Vote" sublabel="most votes wins"
        bg={green} textColor={textOn(green)} rx={8} />
      <Arrow x1={AGG_X + AGG_W} y1={OVO_BG_Y + OVO_H/2}
        x2={OUT_X} y2={OVO_BG_Y + OVO_H/2}
        color={ac} markerId="arr-mc" />
      <Box x={OUT_X} y={OVO_BG_Y + (OVO_H - 36)/2} w={OUT_W} h={36}
        label="Class A|B|C" sublabel="by vote count"
        bg={nb} textColor={vt.text} rx={8} />

      <text x={W/2} y={H - 6} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        OvA: C binary classifiers  ·  OvO: C(C−1)/2  ·  Softmax: direct multi-class output
      </text>
    </svg>
  );
}

// ══ NEW ARCHITECTURES ══════════════════════════════════════════════════════════

// 16. Random Forest — parallel trees with bootstrap + feature random

export { EvaluationArch, BiasVarianceArch, MulticlassArch };
