"use client";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import {
  Arrow, Block,
  BLOCK_H, BLOCK_W, PATCH_COLORS,
  VIT_IMAGE, seed,
  type VT,
} from './helpers';

const VIT_LABELS = {
  en: {
    imageLabel: "8×8 image",
    patchEmbeddings: "patch embeddings",
    patchTokens: "16 patch tokens",
    posEncoding: "+ E_pos added to each token",
    classLabel: "🐱 cat",
    formula: "z = [x_cls; x_p1·E; … + E_pos] → Transformer L layers → MLP head → class",
  },
  fr: {
    imageLabel: "image 8×8",
    patchEmbeddings: "embeddings de patches",
    patchTokens: "16 tokens de patches",
    posEncoding: "+ E_pos ajouté à chaque token",
    classLabel: "🐱 chat",
    formula: "z = [x_cls; x_p1·E; … + E_pos] → Transformer L couches → tête MLP → classe",
  },
  ar: {
    imageLabel: "صورة 8×8",
    patchEmbeddings: "تضمينات الرقع",
    patchTokens: "16 رمز رقعة",
    posEncoding: "+ E_pos يُضاف لكل رمز",
    classLabel: "🐱 قطة",
    formula: "z = [x_cls; x_p1·E; … + E_pos] → Transformer L طبقات → رأس MLP → صنف",
  },
} as const;

export default function ViTTab({ step, accentColor, vt }: {
  step: number; accentColor: string; vt: VT;
}) {
  const locale = useLocale();
  const L = VIT_LABELS[(locale as keyof typeof VIT_LABELS) in VIT_LABELS ? (locale as keyof typeof VIT_LABELS) : "en"];
  const W = 520, H = 240;
  const imgCellSize = 10;
  const imgSize = 8 * imgCellSize; // 80
  const imgX = 8;
  const imgY = Math.round((H - imgSize) / 2) - 10; // 70

  const numPatches = 16;
  const tokenW = 13, tokenGap = 14, tokenH = 40;
  const patchTokenX = 120;
  const patchTokenY = Math.round(H / 2 - tokenH - 3);
  const tokenAreaRight = patchTokenX + 7 * tokenGap + tokenW;
  const clsX = tokenAreaRight + tokenGap;

  const transX = 286;
  const transY = Math.round(H / 2 - BLOCK_H / 2);
  const mlpX = 380;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* ── Image ── */}
      <text x={imgX + imgSize / 2} y={imgY - 8} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        {L.imageLabel}
      </text>
      {VIT_IMAGE.map((row, r) => row.map((v, c) => {
        const patchR = Math.floor(r / 2), patchC = Math.floor(c / 2);
        const patchIdx = patchR * 4 + patchC;
        return (
          <motion.rect
            key={`img-${r}-${c}`}
            x={imgX + c * imgCellSize} y={imgY + r * imgCellSize}
            width={imgCellSize - 1} height={imgCellSize - 1}
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
          <line x1={imgX + i * imgCellSize} y1={imgY} x2={imgX + i * imgCellSize} y2={imgY + imgSize}
            stroke={accentColor} strokeWidth={1} opacity={0.7} />
          <line x1={imgX} y1={imgY + i * imgCellSize} x2={imgX + imgSize} y2={imgY + i * imgCellSize}
            stroke={accentColor} strokeWidth={1} opacity={0.7} />
        </g>
      ))}

      {/* Highlight first 2×2 patch — step 1 */}
      {step === 1 && (
        <motion.rect
          x={imgX} y={imgY} width={imgCellSize * 2} height={imgCellSize * 2}
          rx={2} fill="none" stroke={accentColor} strokeWidth={2.5}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        />
      )}

      {/* Arrow: image → tokens */}
      {step >= 2 && (
        <Arrow x1={imgX + imgSize + 6} y1={imgY + imgSize / 2}
          x2={patchTokenX - 6} y2={H / 2} color={vt.axis} />
      )}

      {/* Patch embedding tokens — step 2+ */}
      {step >= 2 && (
        <g>
          <text x={patchTokenX + (7 * tokenGap + tokenW) / 2} y={patchTokenY - 8}
            textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
            {L.patchEmbeddings}
          </text>
          {Array.from({ length: numPatches }, (_, pi) => {
            const row = Math.floor(pi / 8);
            const col = pi % 8;
            const px = patchTokenX + col * tokenGap;
            const py = patchTokenY + row * (tokenH + 6);
            return (
              <g key={pi}>
                <rect x={px} y={py} width={tokenW} height={tokenH} rx={2}
                  fill={PATCH_COLORS[pi] + "20"} stroke={PATCH_COLORS[pi]} strokeWidth={1} />
                {Array.from({ length: 4 }, (_, d) => (
                  <rect key={d} x={px + 1} y={py + 2 + d * 9}
                    width={tokenW - 2} height={7} rx={1}
                    fill={PATCH_COLORS[pi]} opacity={0.2 + seed(pi, d) * 0.6} />
                ))}
              </g>
            );
          })}
          <text x={patchTokenX + (7 * tokenGap + tokenW) / 2}
            y={patchTokenY + 2 * tokenH + 6 + 13}
            textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
            {L.patchTokens}
          </text>
        </g>
      )}

      {/* [CLS] token — step 3+ */}
      {step >= 3 && (
        <g>
          <text x={clsX + tokenW / 2} y={patchTokenY - 8}
            textAnchor="middle" fontSize={7} fill={vt.ink(accentColor)} fontWeight="bold">
            [CLS]
          </text>
          <rect x={clsX} y={patchTokenY} width={tokenW} height={2 * tokenH + 6} rx={3}
            fill={accentColor + "30"} stroke={accentColor} strokeWidth={1.5} />
          {Array.from({ length: 6 }, (_, d) => (
            <rect key={d} x={clsX + 1} y={patchTokenY + 4 + d * 13}
              width={tokenW - 2} height={9} rx={1}
              fill={accentColor} opacity={0.3 + seed(0, d) * 0.5} />
          ))}
          <text x={patchTokenX + (clsX + tokenW - patchTokenX) / 2}
            y={patchTokenY + 2 * tokenH + 6 + 26}
            textAnchor="middle" fontSize={7} fill={vt.ink(accentColor)} opacity={0.85}>
            {L.posEncoding}
          </text>
        </g>
      )}

      {/* Arrow: tokens → Transformer */}
      {step >= 4 && (
        <>
          <Arrow x1={clsX + tokenW + 6} y1={H / 2} x2={transX - 4} y2={transY + BLOCK_H / 2} color={vt.axis} />
          <Block x={transX} y={transY} label="Transformer ×L" color={accentColor} active vt={vt} />
        </>
      )}

      {/* Arrow: Transformer → MLP */}
      {step >= 5 && (
        <>
          <Arrow x1={transX + BLOCK_W + 4} y1={transY + BLOCK_H / 2}
            x2={mlpX - 4} y2={transY + BLOCK_H / 2} color={vt.axis} />
          <Block x={mlpX} y={transY} label="MLP→cls" color="#22c55e" active vt={vt} />
          <text x={mlpX + BLOCK_W / 2} y={transY + BLOCK_H + 16}
            textAnchor="middle" fontSize={9} fill="#22c55e">
            {L.classLabel}
          </text>
        </>
      )}

      {/* Formula */}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        {L.formula}
      </text>
    </svg>
  );
}
