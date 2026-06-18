"use client";
import { useVizTheme } from "@/hooks/useVizTheme";
import { ARROW_DEFS, Arrow, Box, textOn } from './primitives';
import type { VT } from './primitives';

function CNNArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 145;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const BH = 52;
  const blocks = [
    { label: "Input",      sub: "H×W×C",    bg: vt.isDark ? "#475569" : "#94a3b8", w: 70  },
    { label: "Conv+ReLU",  sub: "k×k filters", bg: accent,                          w: 88  },
    { label: "MaxPool",    sub: "↓ 2×2",    bg: vt.isDark ? "#0891b2" : "#22d3ee", w: 76  },
    { label: "Conv+ReLU",  sub: "deeper",   bg: accent,                             w: 88  },
    { label: "FC+Dropout", sub: "flatten",  bg: vt.isDark ? "#7c3aed" : "#8b5cf6", w: 84  },
    { label: "Softmax",    sub: "classes",  bg: vt.isDark ? "#059669" : "#34d399", w: 72  },
  ];

  let cx = 8;
  const positioned = blocks.map(b => { const x = cx; cx += b.w + 10; return { ...b, x }; });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-cnn", arrowColor)}
      {positioned.map((b, i) => (
        <g key={i}>
          <Box x={b.x} y={(H - BH - 30) / 2} w={b.w} h={BH}
            label={b.label} sublabel={b.sub}
            bg={b.bg} textColor={textOn(b.bg)} rx={8} />
          {i < positioned.length - 1 && (
            <Arrow
              x1={b.x + b.w} y1={(H - 30) / 2}
              x2={positioned[i+1].x} y2={(H - 30) / 2}
              color={arrowColor} markerId="arr-cnn" />
          )}
        </g>
      ))}
      {/* Feature map size annotations */}
      {["32²×3","30²×32","15²×32","13²×64","1024","10"].map((lbl, i) => (
        <text key={i} x={positioned[i].x + positioned[i].w/2}
          y={H - 14} textAnchor="middle" fontSize={7.5}
          fill={vt.textMuted} fontFamily="monospace">{lbl}</text>
      ))}
      <text x={W/2} y={H - 2} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        Conv:(X*W)[i,j]=Σₘₙ X[i+m,j+n]·W[m,n]+b  ·  params=k²·Cᵢₙ·Cₒᵤₜ  ·  pool↓ spatial 2×
      </text>
    </svg>
  );
}

// 10. Transformer Encoder — redesigned with proper vertical spacing

function ResNetArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 210;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  const BH = 36, BY = 66;

  const blocks = [
    { label: "Conv 3×3", sub: "BN + ReLU", x: 82,  bg: accent },
    { label: "Conv 3×3", sub: "BN",         x: 200, bg: accent },
    { label: "+",         sub: "merge",     x: 320, bg: vt.isDark ? "#059669" : "#34d399", w: 36 },
    { label: "ReLU",      sub: "output",   x: 390, bg: vt.isDark ? "#7c3aed" : "#8b5cf6" },
  ];

  // + box center: x=320, w=36 → cx=338, top=BY=66
  const plusCX = 338;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-res", ac)}

      {/* Input */}
      <Box x={8} y={BY} w={64} h={BH} label="x" sublabel="feature map"
        bg={nb} textColor={vt.text} rx={8} />
      <Arrow x1={72} y1={BY + BH/2} x2={82} y2={BY + BH/2} color={ac} markerId="arr-res" />

      {/* Main path */}
      {blocks.map((b, i) => {
        const bw = b.w ?? 92;
        const nx = i < blocks.length - 1 ? blocks[i + 1].x : b.x + bw + 10;
        return (
          <g key={i}>
            <Box x={b.x} y={BY} w={bw} h={BH}
              label={b.label} sublabel={b.sub}
              bg={b.bg} textColor={textOn(b.bg)} rx={8} />
            {i < blocks.length - 1 && (
              <Arrow x1={b.x + bw} y1={BY + BH/2} x2={nx} y2={BY + BH/2}
                color={ac} markerId="arr-res" />
            )}
          </g>
        );
      })}
      <Arrow x1={426} y1={BY + BH/2} x2={468} y2={BY + BH/2} color={ac} markerId="arr-res" />
      <Box x={468} y={BY} w={62} h={BH} label="F(x)+x" sublabel="output"
        bg={nb} textColor={vt.text} rx={8} />

      {/* Skip connection arc — endpoint at + box top center (cx=338, y=BY) */}
      <path d={`M 72 ${BY + BH/2 - 4} C 72 ${BY - 38}, ${plusCX} ${BY - 38}, ${plusCX} ${BY}`}
        fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,3"
        markerEnd="url(#arr-res)" />
      <rect x={118} y={BY - 35} width={174} height={16} rx={3}
        fill={vt.isDark ? "#1a1a30" : "#f7f7ff"} opacity={0.88} />
      <text x={205} y={BY - 22} textAnchor="middle" fontSize={9} fill={vt.ink("#f59e0b")} fontWeight="bold">
        Identity shortcut: x
      </text>

      {/* ResNet depth variants */}
      {[
        { label: "ResNet-18",  sub: "18 layers", x: 8,   bg: nb },
        { label: "ResNet-50",  sub: "bottleneck", x: 146, bg: accent },
        { label: "ResNet-152", sub: "deep",       x: 284, bg: accent },
        { label: "ResNeXt",    sub: "+ grouped",  x: 422, bg: nb },
      ].map(v => (
        <Box key={v.label} x={v.x} y={148} w={110} h={32}
          label={v.label} sublabel={v.sub}
          bg={v.bg} textColor={textOn(v.bg)} rx={6} />
      ))}

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        ResNet: F(x)+x — ∂L/∂x = ∂L/∂y·(1 + ∂F/∂x) — gradient always ≥1 → no vanishing
      </text>
    </svg>
  );
}

// 22. ViT — Vision Transformer (fixed text overflow in sublabels)

function ViTArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 200;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-vit", ac)}

      {/* Image → patches */}
      <rect x={8} y={62} width={48} height={48} rx={4}
        fill={accent + "25"} stroke={accent} strokeWidth={1.5} />
      <text x={32} y={82} textAnchor="middle" fontSize={8} fill={vt.ink(accent)} fontWeight="bold">Image</text>
      <text x={32} y={95} textAnchor="middle" fontSize={7} fill={vt.ink(accent)}>H×W×C</text>
      {/* Patch grid lines */}
      {[16,32].map(o => (
        <g key={o}>
          <line x1={8} y1={62 + o} x2={56} y2={62 + o} stroke={accent} strokeWidth={0.5} opacity={0.5} />
          <line x1={8 + o} y1={62} x2={8 + o} y2={110} stroke={accent} strokeWidth={0.5} opacity={0.5} />
        </g>
      ))}

      <Arrow x1={56} y1={86} x2={76} y2={86} color={ac} markerId="arr-vit" />
      <Box x={76} y={66} w={84} h={40} label="Flatten Patches" sublabel="N×(P²·C)"
        bg={nb} textColor={vt.text} rx={8} />
      <Arrow x1={160} y1={86} x2={178} y2={86} color={ac} markerId="arr-vit" />
      <Box x={178} y={66} w={78} h={40} label="Linear Embed" sublabel="xₚ·E → D-dim"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={256} y1={86} x2={274} y2={86} color={ac} markerId="arr-vit" />

      {/* [CLS] + Pos embed — shorter sublabel to avoid overflow */}
      <Box x={274} y={52} w={82} h={68}
        label="[CLS] + Pos" sublabel="E_pos per token"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />
      <Arrow x1={356} y1={86} x2={374} y2={86} color={ac} markerId="arr-vit" />

      {/* Transformer encoder — fixed sublabel (no \n, shorter text) */}
      <Box x={374} y={46} w={82} h={80}
        label="Transformer" sublabel="MHSA+FFN × L"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={456} y1={86} x2={470} y2={86} color={ac} markerId="arr-vit" />

      {/* Classification head */}
      <Box x={470} y={62} w={62} h={48}
        label="[CLS]" sublabel="MLP→cls"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      {/* Patch size notes */}
      <text x={W/2} y={152} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Patch P=16: 224×224 → 196 patches + 1 [CLS] = 197 tokens  ·  zₙ = [x_cls; xₚ₁E; …] + E_pos
      </text>
      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        ViT: no convolutions — pure self-attention over image patches (ViT-B/16, ViT-L/32…)
      </text>
    </svg>
  );
}

// 23. VAE — Variational Autoencoder

export { CNNArch, ResNetArch, ViTArch };
