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
  const fmCellSize = 15;
  const fmSize = 6 * fmCellSize;

  // Layout: FM at left (x=28), blocks in middle, FM at right
  const fmX = 28, fmY = (H - fmSize) / 2 - 10;
  const blockStartX = 130, blockY = H / 2 - BLOCK_H / 2 - 14;
  const bSpacing = 84;

  // Block positions
  const blocks = [
    { label: "Conv 3×3", x: blockStartX },
    { label: "BN + ReLU", x: blockStartX + bSpacing },
    { label: "Conv 3×3", x: blockStartX + bSpacing * 2 },
    { label: "BN", x: blockStartX + bSpacing * 3 },
  ];

  const plusX = blockStartX + bSpacing * 4 - 10;
  const plusY = blockY + BLOCK_H / 2;
  const reluX = plusX + 40;
  const outFmX = reluX + 55;

  const skipActive = step >= 4;
  const outActive = step >= 5;

  // Which FM to show on left / right
  const leftData = step === 0 ? INPUT_FM : step <= 2 ? AFTER_CONV1 : AFTER_CONV2;
  const rightData = OUTPUT_FM;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Input feature map */}
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

      {/* Arrow: input → first conv */}
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
              x1={b.x + BLOCK_W} y1={blockY + BLOCK_H / 2}
              x2={b.x + bSpacing} y2={blockY + BLOCK_H / 2}
              color={step >= i + 2 ? vt.axis : vt.border}
            />
          )}
        </g>
      ))}

      {/* Arrow: last block → + node */}
      <Arrow
        x1={blockStartX + bSpacing * 3 + BLOCK_W} y1={blockY + BLOCK_H / 2}
        x2={plusX - 4} y2={plusY}
        color={step >= 5 ? vt.axis : vt.border}
      />

      {/* Skip connection (dashed arc over blocks) */}
      <motion.path
        d={`M ${fmX + fmSize + 4},${fmY + fmSize / 2 - 10} C ${blockStartX + bSpacing},${blockY - 42} ${plusX - 20},${blockY - 42} ${plusX - 2},${plusY - 4}`}
        fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,4"
        animate={{ opacity: skipActive ? 1 : 0.25 }}
        transition={{ duration: 0.4 }}
      />
      <text x={blockStartX + bSpacing * 1.5 + BLOCK_W / 2} y={blockY - 46}
        textAnchor="middle" fontSize={8} fill="#f59e0b" opacity={skipActive ? 0.9 : 0.3}>
        skip: x
      </text>

      {/* + node */}
      <motion.circle cx={plusX} cy={plusY} r={12}
        fill={step >= 5 ? accentColor + "30" : "transparent"}
        stroke={step >= 5 ? accentColor : vt.border}
        strokeWidth={1.5}
        animate={{ opacity: step >= 5 ? 1 : 0.35 }}
      />
      <text x={plusX} y={plusY + 5} textAnchor="middle" fontSize={14} fill={step >= 5 ? accentColor : vt.textFaint}>+</text>

      {/* ReLU */}
      <Arrow x1={plusX + 13} y1={plusY} x2={reluX - 4} y2={blockY + BLOCK_H / 2} color={step >= 5 ? vt.axis : vt.border} />
      <Block x={reluX} y={blockY} label="ReLU" color="#22c55e" active={outActive} vt={vt} />

      {/* Output FM */}
      <Arrow x1={reluX + BLOCK_W + 4} y1={blockY + BLOCK_H / 2} x2={outFmX - 4} y2={fmY + fmSize / 2} color={outActive ? vt.axis : vt.border} />
      <motion.g animate={{ opacity: outActive ? 1 : 0.25 }} transition={{ duration: 0.4 }}>
        <text x={outFmX + fmSize / 2} y={fmY - 8} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
          Output
        </text>
        <FeatureMap data={rightData} x={outFmX} y={fmY} cellSize={fmCellSize} vt={vt}
          highlight={outActive} highlightColor="#22c55e" />
      </motion.g>

      {/* Formula */}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        F(x) + x = output (residual mapping) — gradients flow through skip path unchanged
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
  const imgCellSize = 16;
  const imgSize = 8 * imgCellSize;
  const imgX = 12, imgY = (H - imgSize) / 2 - 10;

  // Patches are 2×2, so 16 patches total
  const numPatches = 16;
  const activePatch = step === 1 ? Math.min(numPatches - 1, 0) : -1;

  // Patch colors (for step 2 tokens)
  const patchTokenY = 30;
  const patchTokenX = 150;
  const tokenW = 16, tokenGap = 18;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Image */}
      <text x={imgX + imgSize / 2} y={imgY - 8} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        8×8 image
      </text>
      {VIT_IMAGE.map((row, r) => row.map((v, c) => {
        const patchR = Math.floor(r / 2), patchC = Math.floor(c / 2);
        const patchIdx = patchR * 4 + patchC;
        const highlight = step === 1 && patchIdx === 0;
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

      {/* Patch grid lines */}
      {step >= 1 && [0, 2, 4, 6, 8].map(i => (
        <g key={i}>
          <line x1={imgX + i * imgCellSize} y1={imgY} x2={imgX + i * imgCellSize} y2={imgY + imgSize}
            stroke={accentColor} strokeWidth={1} opacity={0.7} />
          <line x1={imgX} y1={imgY + i * imgCellSize} x2={imgX + imgSize} y2={imgY + i * imgCellSize}
            stroke={accentColor} strokeWidth={1} opacity={0.7} />
        </g>
      ))}

      {/* Step 1: highlight patch */}
      {step === 1 && (
        <motion.rect
          x={imgX} y={imgY}
          width={imgCellSize * 2} height={imgCellSize * 2}
          rx={2} fill="none" stroke={accentColor} strokeWidth={2.5}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        />
      )}

      {/* Arrow: image → tokens */}
      {step >= 2 && (
        <Arrow x1={imgX + imgSize + 6} y1={imgY + imgSize / 2}
          x2={patchTokenX - 6} y2={H / 2}
          color={vt.axis} />
      )}

      {/* Patch tokens (embedding bars) — step 2+ */}
      {step >= 2 && (
        <g>
          <text x={patchTokenX + (numPatches * tokenGap) / 2} y={patchTokenY - 10}
            textAnchor="middle" fontSize={9} fill={vt.textMuted}>
            patch embeddings (D=8)
          </text>
          {/* [CLS] token */}
          {step >= 3 && (
            <g>
              <rect x={patchTokenX - tokenGap - tokenW} y={patchTokenY} width={tokenW} height={80}
                rx={3} fill={accentColor + "30"} stroke={accentColor} strokeWidth={1.5} />
              <text x={patchTokenX - tokenGap - tokenW / 2} y={patchTokenY - 4}
                textAnchor="middle" fontSize={7} fill={accentColor} fontWeight="bold">[CLS]</text>
              {Array.from({ length: 8 }, (_, d) => (
                <rect key={d}
                  x={patchTokenX - tokenGap - tokenW + 2}
                  y={patchTokenY + d * 10}
                  width={tokenW - 4} height={8}
                  rx={1} fill={accentColor} opacity={0.3 + seed(0, d) * 0.6}
                />
              ))}
            </g>
          )}
          {/* 16 patch tokens */}
          {Array.from({ length: Math.min(numPatches, 8) }, (_, pi) => (
            <g key={pi}>
              <rect
                x={patchTokenX + pi * tokenGap} y={patchTokenY}
                width={tokenW} height={80}
                rx={3}
                fill={PATCH_COLORS[pi] + "20"}
                stroke={PATCH_COLORS[pi]}
                strokeWidth={1}
              />
              {Array.from({ length: 8 }, (_, d) => (
                <rect key={d}
                  x={patchTokenX + pi * tokenGap + 2}
                  y={patchTokenY + d * 10}
                  width={tokenW - 4} height={8}
                  rx={1} fill={PATCH_COLORS[pi]} opacity={0.2 + seed(pi, d) * 0.6}
                />
              ))}
            </g>
          ))}
          <text x={patchTokenX + 8 * tokenGap + tokenW / 2} y={patchTokenY + 40}
            fontSize={10} fill={vt.textMuted} dominantBaseline="middle">…</text>
        </g>
      )}

      {/* Arrow → Transformer block */}
      {step >= 4 && (
        <>
          <Arrow
            x1={patchTokenX + 8 * tokenGap + tokenW + 16}
            y1={patchTokenY + 40}
            x2={370}
            y2={H / 2 - 18}
            color={vt.axis}
          />
          <Block x={370} y={H / 2 - 34} label="Transformer ×L" color={accentColor} active vt={vt} />
        </>
      )}

      {/* Arrow → MLP head */}
      {step >= 5 && (
        <>
          <Arrow x1={370 + BLOCK_W} y1={H / 2 - 18} x2={456} y2={H / 2 - 18} color={vt.axis} />
          <Block x={456} y={H / 2 - 34} label="Class" color="#22c55e" active vt={vt} />
          <text x={456 + BLOCK_W / 2} y={H / 2 + 16} textAnchor="middle" fontSize={9} fill="#22c55e">
            🐱 cat
          </text>
        </>
      )}

      {/* Formula */}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        z = [x_cls; x_p1 E; x_p2 E; … + E_pos] → Transformer
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
