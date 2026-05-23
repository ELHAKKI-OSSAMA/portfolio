"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";

// ── Deterministic pseudo-random values for feature maps ──────────────────────
function seed(i: number, j: number) {
  return (Math.sin(i * 31.7 + j * 17.3 + 5.1) * 0.5 + 0.5);
}

// 6×6 input feature map
const INPUT_FM: number[][] = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) => seed(r, c))
);

// After conv + BN + ReLU + Conv + BN (simulated)
const AFTER_CONV1: number[][] = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) => Math.max(0, seed(r + 1, c + 2) * 0.8 + 0.1))
);
const AFTER_CONV2: number[][] = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) => seed(r + 3, c + 5) * 0.85)
);
const OUTPUT_FM: number[][] = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) => Math.min(1, INPUT_FM[r][c] * 0.4 + AFTER_CONV2[r][c] * 0.6 + 0.05))
);

function heatColor(v: number, isDark: boolean) {
  const r = Math.round(50 + v * 180);
  const g = Math.round(20 + v * 100);
  const b = Math.round(220 - v * 140);
  return `rgb(${r},${g},${b})`;
}

// 8×8 ViT image — gradient/pattern
const VIT_IMAGE: number[][] = Array.from({ length: 8 }, (_, r) =>
  Array.from({ length: 8 }, (_, c) => {
    const base = (r + c) / 14;
    const spot = Math.exp(-((r - 3) ** 2 + (c - 3) ** 2) / 4) * 0.5;
    return Math.min(1, base + spot);
  })
);

const PATCH_COLORS = [
  "#6c63ff", "#f97316", "#22c55e", "#06b6d4",
  "#ec4899", "#f59e0b", "#8b5cf6", "#ef4444",
  "#10b981", "#3b82f6", "#d97706", "#7c3aed",
  "#be185d", "#065f46", "#1e3a5f", "#4c1d95",
];

const RESNET_STEPS = ["Input FM", "Conv 3×3", "BN + ReLU", "Conv 3×3 + BN", "F(x) + x → ReLU", "Output FM"];
const VIT_STEPS = ["Image input", "Extract patches", "Project patches", "Add [CLS] + pos", "Transformer ×L", "MLP head → class"];

// ── Block helpers ─────────────────────────────────────────────────────────────
const BLOCK_W = 72, BLOCK_H = 32;

function Block({ x, y, label, color, active, vt }: {
  x: number; y: number; label: string; color: string; active: boolean;
  vt: ReturnType<typeof import("@/hooks/useVizTheme").useVizTheme>;
}) {
  return (
    <motion.g
      animate={{ opacity: active ? 1 : 0.35 }}
      transition={{ duration: 0.3 }}
    >
      <rect x={x} y={y} width={BLOCK_W} height={BLOCK_H} rx={5}
        fill={active ? color + "25" : "transparent"}
        stroke={active ? color : vt.border}
        strokeWidth={active ? 2 : 1}
      />
      <text x={x + BLOCK_W / 2} y={y + BLOCK_H / 2 + 4} textAnchor="middle"
        fontSize={9} fill={active ? color : vt.textMuted} fontWeight={active ? "bold" : "normal"}>
        {label}
      </text>
    </motion.g>
  );
}

function Arrow({ x1, y1, x2, y2, color, dashed = false }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len, ny = dy / len;
  const ex = x2 - nx * 6, ey = y2 - ny * 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? "5,4" : undefined} />
      <polygon points={`${x2},${y2} ${ex - ny * 4},${ey + nx * 4} ${ex + ny * 4},${ey - nx * 4}`}
        fill={color} />
    </g>
  );
}

function FeatureMap({ data, x, y, cellSize, vt, highlight = false, highlightColor = "#6c63ff" }: {
  data: number[][]; x: number; y: number; cellSize: number;
  vt: ReturnType<typeof import("@/hooks/useVizTheme").useVizTheme>;
  highlight?: boolean; highlightColor?: string;
}) {
  return (
    <g>
      {data.map((row, r) => row.map((v, c) => (
        <rect
          key={`${r}-${c}`}
          x={x + c * cellSize}
          y={y + r * cellSize}
          width={cellSize - 1}
          height={cellSize - 1}
          rx={1}
          fill={heatColor(v, vt.isDark)}
          opacity={0.85}
        />
      )))}
      {highlight && (
        <rect
          x={x - 1} y={y - 1}
          width={data[0].length * cellSize + 1}
          height={data.length * cellSize + 1}
          rx={3}
          fill="none"
          stroke={highlightColor}
          strokeWidth={2}
        />
      )}
    </g>
  );
}

// ── ResNet Tab ────────────────────────────────────────────────────────────────
function ResNetTab({ step, accentColor, vt }: {
  step: number;
  accentColor: string;
  vt: ReturnType<typeof import("@/hooks/useVizTheme").useVizTheme>;
}) {
  const W = 520, H = 240;
  const fmCellSize = 9;
  const fmSize = 6 * fmCellSize; // 54px — fits within W=520

  // Tighter layout so output FM fits within W=520
  const fmX = 8, fmY = (H - fmSize) / 2 - 8; // fmY≈79
  const blockStartX = 90;
  const bSpacing = 70;
  const BW_BLOCK = 62; // local block width override

  // Block positions
  const blocks = [
    { label: "Conv 3×3", x: blockStartX },
    { label: "BN + ReLU", x: blockStartX + bSpacing },
    { label: "Conv 3×3", x: blockStartX + bSpacing * 2 },
    { label: "BN",       x: blockStartX + bSpacing * 3 },
  ];

  // blockStartX + 4*bSpacing - 6 = 90+280-6 = 364
  const plusX = blockStartX + bSpacing * 4 - 6;   // 364
  const plusY = H / 2 - BLOCK_H / 2 - 14 + BLOCK_H / 2; // same as blockY + BLOCK_H/2
  const blockY = H / 2 - BLOCK_H / 2 - 14;
  const reluX = plusX + 32;   // 396
  const outFmX = reluX + BW_BLOCK + 4; // 462 — fits in 520 ✓

  const skipActive = step >= 4;
  const outActive = step >= 5;

  const rightData = OUTPUT_FM;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Input feature map label */}
      <text x={fmX + fmSize / 2} y={fmY - 8} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Input x
      </text>
      <FeatureMap
        data={step >= 1 && step <= 3 ? AFTER_CONV1 : INPUT_FM}
        x={fmX} y={fmY} cellSize={fmCellSize}
        vt={vt}
        highlight={step === 0}
        highlightColor={accentColor}
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
        animate={{ opacity: skipActive ? 1 : 0.55 }}
        transition={{ duration: 0.4 }}
      />
      <motion.text x={blockStartX + bSpacing * 1.8} y={blockY - 42}
        textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight="bold"
        animate={{ opacity: skipActive ? 1 : 0.6 }}
        transition={{ duration: 0.4 }}>
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
        <FeatureMap data={rightData} x={outFmX} y={fmY} cellSize={fmCellSize} vt={vt}
          highlight={outActive} highlightColor="#22c55e" />
      </motion.g>

      {/* Formula */}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        F(x) + x  →  gradients flow through skip path unchanged  →  train 100s of layers
      </text>
    </svg>
  );
}

// ── ViT Tab ───────────────────────────────────────────────────────────────────
function ViTTab({ step, accentColor, vt }: {
  step: number;
  accentColor: string;
  vt: ReturnType<typeof import("@/hooks/useVizTheme").useVizTheme>;
}) {
  const W = 520, H = 240;
  // Compact image: 8×8 cells × 10px = 80×80px → leaves room for token columns
  const imgCellSize = 10;
  const imgSize = 8 * imgCellSize; // 80
  const imgX = 8;
  const imgY = Math.round((H - imgSize) / 2) - 10; // 70

  // 16 patches (2×2 pixels each in 8×8 image)
  const numPatches = 16;

  // 2-row layout: 8 patches per row
  // tokenW=13, tokenGap=14 → row width = 8×13 + 7×14 = 104+98 = 202
  // Fits: patchTokenX=120 → right edge = 120+202-13 = 309... wait
  // patchTokenX + 7*tokenGap + tokenW = 120 + 98 + 13 = 231
  const tokenW = 13, tokenGap = 14, tokenH = 40;
  const patchTokenX = 120;
  // token area center y = H/2=120 → patchTokenY = H/2 - tokenH - 3 = 77
  const patchTokenY = Math.round(H / 2 - tokenH - 3); // 77
  // Right edge of 8-wide row: patchTokenX + 7*tokenGap + tokenW = 231
  const tokenAreaRight = patchTokenX + 7 * tokenGap + tokenW; // 231
  // [CLS] token placed after patch tokens (step 3+)
  const clsX = tokenAreaRight + tokenGap; // 245

  // Transformer and MLP block positions
  const transX = 286; // = clsX+tokenW+6 (arrow) + 12 (gap)
  const transY = Math.round(H / 2 - BLOCK_H / 2); // 104
  const mlpX = 380;   // = transX+BLOCK_W+22 (arrow+gap)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* ── Image ── */}
      <text x={imgX + imgSize / 2} y={imgY - 8} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        8×8 image
      </text>
      {VIT_IMAGE.map((row, r) => row.map((v, c) => {
        const patchR = Math.floor(r / 2), patchC = Math.floor(c / 2);
        const patchIdx = patchR * 4 + patchC;
        return (
          <motion.rect
            key={`img-${r}-${c}`}
            x={imgX + c * imgCellSize}
            y={imgY + r * imgCellSize}
            width={imgCellSize - 1}
            height={imgCellSize - 1}
            rx={1}
            fill={`hsl(${200 + v * 60},70%,${40 + v * 30}%)`}
            animate={{ opacity: step === 1 && patchIdx > 0 ? 0.4 : 1 }}
            transition={{ duration: 0.3 }}
          />
        );
      }))}

      {/* Patch grid lines — step 1+ */}
      {step >= 1 && [0, 2, 4, 6, 8].map(i => (
        <g key={i}>
          <line x1={imgX + i * imgCellSize} y1={imgY}
                x2={imgX + i * imgCellSize} y2={imgY + imgSize}
            stroke={accentColor} strokeWidth={1} opacity={0.7} />
          <line x1={imgX} y1={imgY + i * imgCellSize}
                x2={imgX + imgSize} y2={imgY + i * imgCellSize}
            stroke={accentColor} strokeWidth={1} opacity={0.7} />
        </g>
      ))}

      {/* Highlight first 2×2 patch — step 1 */}
      {step === 1 && (
        <motion.rect
          x={imgX} y={imgY}
          width={imgCellSize * 2} height={imgCellSize * 2}
          rx={2} fill="none" stroke={accentColor} strokeWidth={2.5}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        />
      )}

      {/* ── Arrow: image → tokens ── */}
      {step >= 2 && (
        <Arrow
          x1={imgX + imgSize + 6} y1={imgY + imgSize / 2}
          x2={patchTokenX - 6} y2={H / 2}
          color={vt.axis}
        />
      )}

      {/* ── Patch embedding tokens — step 2+ ── */}
      {step >= 2 && (
        <g>
          {/* Label above patch area */}
          <text
            x={patchTokenX + (7 * tokenGap + tokenW) / 2}
            y={patchTokenY - 8}
            textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
            patch embeddings
          </text>

          {/* 16 tokens in 2 rows of 8 */}
          {Array.from({ length: numPatches }, (_, pi) => {
            const row = Math.floor(pi / 8);
            const col = pi % 8;
            const px = patchTokenX + col * tokenGap;
            const py = patchTokenY + row * (tokenH + 6);
            return (
              <g key={pi}>
                <rect
                  x={px} y={py} width={tokenW} height={tokenH}
                  rx={2}
                  fill={PATCH_COLORS[pi] + "20"}
                  stroke={PATCH_COLORS[pi]}
                  strokeWidth={1}
                />
                {/* 4 embedding-dimension slices */}
                {Array.from({ length: 4 }, (_, d) => (
                  <rect key={d}
                    x={px + 1}
                    y={py + 2 + d * 9}
                    width={tokenW - 2} height={7}
                    rx={1}
                    fill={PATCH_COLORS[pi]}
                    opacity={0.2 + seed(pi, d) * 0.6}
                  />
                ))}
              </g>
            );
          })}

          {/* Label below patch area */}
          <text
            x={patchTokenX + (7 * tokenGap + tokenW) / 2}
            y={patchTokenY + 2 * tokenH + 6 + 13}
            textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
            16 patch tokens
          </text>
        </g>
      )}

      {/* ── [CLS] token — step 3+ ── */}
      {step >= 3 && (
        <g>
          <text x={clsX + tokenW / 2} y={patchTokenY - 8}
            textAnchor="middle" fontSize={7} fill={accentColor} fontWeight="bold">
            [CLS]
          </text>
          {/* Tall bar spanning both rows */}
          <rect
            x={clsX} y={patchTokenY}
            width={tokenW} height={2 * tokenH + 6}
            rx={3}
            fill={accentColor + "30"}
            stroke={accentColor}
            strokeWidth={1.5}
          />
          {Array.from({ length: 6 }, (_, d) => (
            <rect key={d}
              x={clsX + 1}
              y={patchTokenY + 4 + d * 13}
              width={tokenW - 2} height={9}
              rx={1}
              fill={accentColor}
              opacity={0.3 + seed(0, d) * 0.5}
            />
          ))}
          {/* Positional embedding note */}
          <text
            x={patchTokenX + (clsX + tokenW - patchTokenX) / 2}
            y={patchTokenY + 2 * tokenH + 6 + 26}
            textAnchor="middle" fontSize={7} fill={accentColor} opacity={0.85}>
            + E_pos added to each token
          </text>
        </g>
      )}

      {/* ── Arrow: tokens → Transformer ── */}
      {step >= 4 && (
        <>
          <Arrow
            x1={clsX + tokenW + 6}
            y1={H / 2}
            x2={transX - 4}
            y2={transY + BLOCK_H / 2}
            color={vt.axis}
          />
          <Block x={transX} y={transY} label="Transformer ×L" color={accentColor} active vt={vt} />
        </>
      )}

      {/* ── Arrow: Transformer → MLP ── */}
      {step >= 5 && (
        <>
          <Arrow
            x1={transX + BLOCK_W + 4}
            y1={transY + BLOCK_H / 2}
            x2={mlpX - 4}
            y2={transY + BLOCK_H / 2}
            color={vt.axis}
          />
          <Block x={mlpX} y={transY} label="MLP→cls" color="#22c55e" active vt={vt} />
          <text x={mlpX + BLOCK_W / 2} y={transY + BLOCK_H + 16}
            textAnchor="middle" fontSize={9} fill="#22c55e">
            🐱 cat
          </text>
        </>
      )}

      {/* Formula */}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        z = [x_cls; x_p1·E; … + E_pos] → Transformer L layers → MLP head → class
      </text>
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ResNetViTViz({ accentColor = "#f97316" }: { accentColor?: string }) {
  const [tab, setTab] = useState<"resnet" | "vit">("resnet");
  const [step, setStep] = useState(0);
  const vt = useVizTheme();

  const maxSteps = tab === "resnet" ? RESNET_STEPS.length : VIT_STEPS.length;
  const stepLabels = tab === "resnet" ? RESNET_STEPS : VIT_STEPS;

  function handleTabChange(newTab: "resnet" | "vit") {
    setTab(newTab);
    setStep(0);
  }

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          {(["resnet", "vit"] as const).map(t => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: tab === t ? `${accentColor}25` : "transparent",
                color: tab === t ? accentColor : "var(--text-muted)",
                border: `1px solid ${tab === t ? accentColor + "50" : "var(--border)"}`,
              }}
            >
              {t === "resnet" ? "ResNet Block" : "ViT Patches"}
            </button>
          ))}
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Step {step + 1}/{maxSteps}: {stepLabels[step]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: step > 0 ? `${accentColor}25` : "var(--bg-card)",
              color: step > 0 ? accentColor : "var(--text-muted)",
              border: `1px solid ${step > 0 ? accentColor + "50" : "var(--border)"}`,
            }}
          >
            ← Back
          </button>
          <button
            disabled={step >= maxSteps - 1}
            onClick={() => setStep(s => Math.min(maxSteps - 1, s + 1))}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: step < maxSteps - 1 ? `${accentColor}25` : "var(--bg-card)",
              color: step < maxSteps - 1 ? accentColor : "var(--text-muted)",
              border: `1px solid ${step < maxSteps - 1 ? accentColor + "50" : "var(--border)"}`,
            }}
          >
            Forward →
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "resnet" ? (
          <motion.div key="resnet" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            <ResNetTab step={step} accentColor={accentColor} vt={vt} />
          </motion.div>
        ) : (
          <motion.div key="vit" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <ViTTab step={step} accentColor={accentColor} vt={vt} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 py-2 border-t" style={{ borderColor: "var(--border)" }}>
        {stepLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            title={label}
            className="rounded-full transition-all"
            style={{
              width: i === step ? 20 : 8,
              height: 8,
              backgroundColor: i === step ? accentColor : i < step ? accentColor + "60" : "var(--border)",
            }}
          />
        ))}
      </div>

      {/* Stats footer */}
      {(() => {
        const statItems = tab === "resnet" ? [
          { label: "Architecture", value: "ResNet Block", color: accentColor },
          { label: "Skip path", value: step >= 4 ? "Active" : "Waiting", color: step >= 4 ? "#f59e0b" : "var(--text-muted)" as string },
          { label: "Residual", value: "F(x) + x", color: "#22c55e" },
        ] : [
          { label: "Architecture", value: "ViT", color: accentColor },
          { label: "Patches", value: "16 (2×2)", color: "#6c63ff" },
          { label: "Tokens", value: step >= 3 ? "17 (CLS+16)" : "16", color: "#22c55e" },
        ];
        return (
          <div className="grid grid-cols-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
            {statItems.map(({ label, value, color }) => (
              <div key={label} className="py-3">
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
                <div className="text-sm font-bold font-mono" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
