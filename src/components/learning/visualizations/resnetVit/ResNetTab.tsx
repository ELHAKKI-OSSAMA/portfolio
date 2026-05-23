"use client";
import { motion } from "framer-motion";
import {
  Arrow, Block, FeatureMap,
  BLOCK_H, BLOCK_W, PATCH_COLORS,
  INPUT_FM, AFTER_CONV1, OUTPUT_FM,
  type VT,
} from './helpers';

export default function ResNetTab({ step, accentColor, vt }: {
  step: number; accentColor: string; vt: VT;
}) {
  const W = 520, H = 240;
  const fmCellSize = 9;
  const fmSize = 6 * fmCellSize; // 54px

  const fmX = 8, fmY = (H - fmSize) / 2 - 8; // fmY≈79
  const blockStartX = 90;
  const bSpacing = 70;
  const BW_BLOCK = 62;

  const blocks = [
    { label: "Conv 3×3", x: blockStartX },
    { label: "BN + ReLU", x: blockStartX + bSpacing },
    { label: "Conv 3×3",  x: blockStartX + bSpacing * 2 },
    { label: "BN",        x: blockStartX + bSpacing * 3 },
  ];

  const plusX  = blockStartX + bSpacing * 4 - 6;
  const plusY  = H / 2 - BLOCK_H / 2 - 14 + BLOCK_H / 2;
  const blockY = H / 2 - BLOCK_H / 2 - 14;
  const reluX  = plusX + 32;
  const outFmX = reluX + BW_BLOCK + 4;

  const skipActive = step >= 4;
  const outActive  = step >= 5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Input feature map label */}
      <text x={fmX + fmSize / 2} y={fmY - 8} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Input x
      </text>
      <FeatureMap
        data={step >= 1 && step <= 3 ? AFTER_CONV1 : INPUT_FM}
        x={fmX} y={fmY} cellSize={fmCellSize} vt={vt}
        highlight={step === 0} highlightColor={accentColor}
      />

      {/* Arrow: input FM → first conv */}
      <Arrow x1={fmX + fmSize + 4} y1={fmY + fmSize / 2}
        x2={blockStartX - 4} y2={blockY + BLOCK_H / 2}
        color={vt.axis} />

      {/* Conv blocks */}
      {blocks.map((b, i) => (
        <g key={i}>
          <Block x={b.x} y={blockY} label={b.label} color={PATCH_COLORS[i]}
            active={step >= i + 1} vt={vt} />
          {i < blocks.length - 1 && (
            <Arrow
              x1={b.x + BW_BLOCK} y1={blockY + BLOCK_H / 2}
              x2={b.x + bSpacing}  y2={blockY + BLOCK_H / 2}
              color={step >= i + 2 ? vt.axis : vt.border}
            />
          )}
        </g>
      ))}

      {/* Arrow: last block → + node */}
      <Arrow
        x1={blockStartX + bSpacing * 3 + BW_BLOCK} y1={blockY + BLOCK_H / 2}
        x2={plusX - 10} y2={plusY}
        color={step >= 5 ? vt.axis : vt.border}
      />

      {/* Skip connection (dashed arc over blocks) */}
      <motion.path
        d={`M ${fmX + fmSize + 4},${fmY + fmSize / 2 - 8} C ${blockStartX + bSpacing},${blockY - 38} ${plusX - 16},${blockY - 38} ${plusX - 8},${plusY - 10}`}
        fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,4"
        animate={{ opacity: skipActive ? 1 : 0.55 }} transition={{ duration: 0.4 }}
      />
      <motion.text x={blockStartX + bSpacing * 1.8} y={blockY - 42}
        textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight="bold"
        animate={{ opacity: skipActive ? 1 : 0.6 }} transition={{ duration: 0.4 }}>
        {skipActive ? "Residual F(x)+x" : "Skip path: x"}
      </motion.text>

      {/* + node */}
      <motion.circle cx={plusX} cy={plusY} r={11}
        fill={step >= 5 ? accentColor + "30" : "transparent"}
        stroke={step >= 5 ? accentColor : vt.border}
        strokeWidth={1.5}
        animate={{ opacity: step >= 5 ? 1 : 0.35 }}
      />
      <text x={plusX} y={plusY + 5} textAnchor="middle" fontSize={14} fill={step >= 5 ? accentColor : vt.textFaint}>+</text>

      {/* Arrow: + → ReLU */}
      <Arrow x1={plusX + 12} y1={plusY} x2={reluX - 4} y2={blockY + BLOCK_H / 2} color={step >= 5 ? vt.axis : vt.border} />
      <Block x={reluX} y={blockY} label="ReLU" color="#22c55e" active={outActive} vt={vt} />

      {/* Arrow: ReLU → output FM */}
      <Arrow x1={reluX + BW_BLOCK + 4} y1={blockY + BLOCK_H / 2} x2={outFmX - 4} y2={fmY + fmSize / 2} color={outActive ? vt.axis : vt.border} />
      <motion.g animate={{ opacity: outActive ? 1 : 0.25 }} transition={{ duration: 0.4 }}>
        <text x={outFmX + fmSize / 2} y={fmY - 8} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
          F(x)+x
        </text>
        <FeatureMap data={OUTPUT_FM} x={outFmX} y={fmY} cellSize={fmCellSize} vt={vt}
          highlight={outActive} highlightColor="#22c55e" />
      </motion.g>

      {/* Formula */}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        F(x) + x  →  gradients flow through skip path unchanged  →  train 100s of layers
      </text>
    </svg>
  );
}
