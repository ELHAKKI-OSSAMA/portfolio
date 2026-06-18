"use client";
import { useVizTheme } from "@/hooks/useVizTheme";
import { ARROW_DEFS, Arrow, Box, textOn } from './primitives';
import type { VT } from './primitives';

function LinearRegressionArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 160;
  const features = ["x₁", "x₂", "x₃", "…", "xₙ"];
  const CY = H / 2;
  const FX = 30, FW = 38, FH = 28;
  const sumX = 200, sumR = 28;
  const outX = 370, outY = CY - 18, outW = 110, outH = 36;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nodeColor = accent;
  const nodeTxt = textOn(accent);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-lr", arrowColor)}

      {/* Feature boxes */}
      {features.map((f, i) => {
        const fy = CY + (i - (features.length - 1) / 2) * 34;
        return (
          <g key={f}>
            <Box x={FX} y={fy - FH / 2} w={FW} h={FH}
              label={f} bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={6} />
            {/* Weight label on arrow */}
            <Arrow x1={FX + FW} y1={fy} x2={sumX - sumR} y2={CY}
              color={arrowColor} markerId="arr-lr" />
            <text x={(FX + FW + sumX - sumR) / 2 - 8}
              y={fy + (CY - fy) / 2 - 4}
              fontSize={8} fill={vt.ink(accent)} fontFamily="monospace">
              w{i + 1}
            </text>
          </g>
        );
      })}

      {/* Summation circle */}
      <circle cx={sumX} cy={CY} r={sumR}
        fill={nodeColor} stroke={nodeColor} />
      <text x={sumX} y={CY - 5} textAnchor="middle" fontSize={13} fill={nodeTxt}>Σ</text>
      <text x={sumX} y={CY + 10} textAnchor="middle" fontSize={8} fill={nodeTxt}>+b</text>

      {/* Arrow to activation */}
      <Arrow x1={sumX + sumR} y1={CY} x2={outX - 8} y2={CY}
        color={arrowColor} markerId="arr-lr" />
      <text x={(sumX + sumR + outX) / 2} y={CY - 6}
        fontSize={8} fill={vt.textMuted}>ŷ = Σwᵢxᵢ+b</text>

      {/* Output */}
      <Box x={outX} y={outY} w={outW} h={outH}
        label="Output ŷ" sublabel="or σ(·) for logistic"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn(vt.isDark ? "#059669" : "#34d399")}
        rx={8} />

      {/* Bias annotation */}
      <text x={sumX} y={CY + sumR + 14} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        bias b added
      </text>
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        Linear: ŷ=Xᵀβ  MSE=‖y−ŷ‖²/n  ·  Logistic: P=σ(Xᵀβ)  BCE=−Σ[yᵢlogŷᵢ+(1−yᵢ)log(1−ŷᵢ)]
      </text>
    </svg>
  );
}

// 2. Decision Tree — binary tree structure

function SVMArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 210;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-svm", arrowColor)}

      {/* Feature space box */}
      <rect x={14} y={14} width={310} height={178} rx={10}
        fill={vt.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}
        stroke={vt.border} strokeWidth={1} />
      <text x={169} y={30} textAnchor="middle" fontSize={9} fill={vt.textMuted}>Training: margin maximization</text>

      {/* Class+ points (purple) */}
      {[[60,60],[50,90],[80,75],[65,110],[90,55]].map(([px,py],i) => (
        <circle key={`p${i}`} cx={px} cy={py} r={8}
          fill={vt.isDark ? "#4c1d95" : "#7c3aed"} opacity={0.85} />
      ))}
      <text x={68} y={130} fontSize={8} fill={vt.isDark ? "#7c3aed" : "#7c3aed"}>Class +1</text>

      {/* Class- points (red) */}
      {[[210,100],[230,130],[200,155],[255,115],[240,85]].map(([px,py],i) => (
        <circle key={`n${i}`} cx={px} cy={py} r={8}
          fill={vt.isDark ? "#7f1d1d" : "#dc2626"} opacity={0.85} />
      ))}
      <text x={220} y={172} fontSize={8} fill={vt.ink("#dc2626")}>Class −1</text>

      {/* Decision boundary — animates from initial to optimal */}
      <line x1={130} y1={30} x2={170} y2={185} stroke={accent} strokeWidth={2.5}>
        <animate attributeName="x1" values="80;100;115;125;130;130" dur="4s" repeatCount="indefinite" />
        <animate attributeName="x2" values="120;140;155;165;170;170" dur="4s" repeatCount="indefinite" />
      </line>
      {/* Margin boundaries (animated) */}
      <line x1={100} y1={30} x2={140} y2={185} stroke={accent} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5}>
        <animate attributeName="x1" values="50;70;85;95;100;100" dur="4s" repeatCount="indefinite" />
        <animate attributeName="x2" values="90;110;125;135;140;140" dur="4s" repeatCount="indefinite" />
      </line>
      <line x1={160} y1={30} x2={200} y2={185} stroke={accent} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5}>
        <animate attributeName="x1" values="110;130;145;155;160;160" dur="4s" repeatCount="indefinite" />
        <animate attributeName="x2" values="150;170;185;195;200;200" dur="4s" repeatCount="indefinite" />
      </line>

      {/* Margin bracket */}
      <Arrow x1={122} y1={108} x2={158} y2={118} color={accent} markerId="arr-svm" />
      <Arrow x1={158} y1={118} x2={122} y2={108} color={accent} markerId="arr-svm" />
      <text x={138} y={106} textAnchor="middle" fontSize={9} fill={vt.ink(accent)} fontWeight="bold">2/‖w‖</text>

      {/* Support vector rings — appear with animation */}
      {[[110,90],[150,140],[165,80]].map(([px,py],i) => (
        <circle key={`sv${i}`} cx={px} cy={py} r={13}
          fill="none" stroke={accent} strokeWidth={2} opacity={0.6}>
          <animate attributeName="r" values="0;6;10;13;13" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.3;0.5;0.6;0.6" dur="4s" repeatCount="indefinite" />
        </circle>
      ))}
      <text x={169} y={194} textAnchor="middle" fontSize={8} fill={vt.ink(accent)}>support vectors (circled)</text>

      {/* Optimization box */}
      <Box x={340} y={18} w={188} h={54}
        label="Primal Objective" sublabel="min ½‖w‖² + C Σ ξᵢ"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />
      <Box x={340} y={84} w={188} h={54}
        label="Kernel Trick" sublabel="K(xᵢ,xⱼ) = φ(xᵢ)ᵀφ(xⱼ)"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Box x={340} y={150} w={188} h={36}
        label="Decision: sign(wᵀx + b)"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      <text x={W/2} y={H - 3} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        SVM: max 2/‖w‖ s.t. yᵢ(wᵀxᵢ+b)≥1 — Dual: Σαᵢyᵢxᵢ=0, αᵢ≥0
      </text>
    </svg>
  );
}

// 6. KNN — nearest neighbor lookup

function KNNArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 160;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const steps = [
    { label: "New Point x*", sub: "query", bg: accent },
    { label: "Compute d(x*,xᵢ)", sub: "all training pts", bg: vt.isDark ? "#334155" : "#94a3b8" },
    { label: "Sort distances", sub: "ascending", bg: vt.isDark ? "#334155" : "#94a3b8" },
    { label: "Take k nearest", sub: "k=3,5,…", bg: vt.isDark ? "#7c3aed" : "#8b5cf6" },
    { label: "Majority vote", sub: "→ class label", bg: vt.isDark ? "#059669" : "#34d399" },
  ];
  const BW = 88, BH = 44, SY = (H - BH) / 2;
  const spacing = (W - steps.length * BW) / (steps.length + 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-knn", arrowColor)}
      {steps.map((s, i) => {
        const sx = spacing * (i + 1) + i * BW;
        return (
          <g key={s.label}>
            <Box x={sx} y={SY} w={BW} h={BH}
              label={s.label} sublabel={s.sub}
              bg={s.bg} textColor={typeof s.bg === "string" && s.bg.startsWith("#") && s.bg.length === 7 ? textOn(s.bg) : "#fff"}
              rx={8} />
            {i < steps.length - 1 && (
              <Arrow x1={sx + BW} y1={SY + BH/2}
                x2={spacing * (i + 2) + (i + 1) * BW} y2={SY + BH/2}
                color={arrowColor} markerId="arr-knn" />
            )}
          </g>
        );
      })}
      <text x={W/2} y={H - 8} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        KNN: no training phase — decision at inference using distance metric d(x,x') = ‖x-x'‖
      </text>
    </svg>
  );
}

// 7. SVR — epsilon-insensitive tube

function SVRArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 200;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-svr", arrowColor)}

      {/* Feature space */}
      <rect x={14} y={18} width={310} height={152} rx={10}
        fill={vt.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}
        stroke={vt.border} strokeWidth={1} />

      {/* Regression line */}
      <line x1={30} y1={140} x2={310} y2={46} stroke={accent} strokeWidth={2.5}>
        <animate attributeName="x1" values="30;50;30" dur="4s" repeatCount="indefinite" />
        <animate attributeName="y1" values="155;140;155" dur="4s" repeatCount="indefinite" />
      </line>
      {/* Tube boundaries */}
      <line x1={30} y1={120} x2={310} y2={26} stroke={accent} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.6} />
      <line x1={30} y1={160} x2={310} y2={66} stroke={accent} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.6} />
      {/* Tube fill */}
      <path d="M30,120 L310,26 L310,66 L30,160 Z" fill={accent} opacity={0.08} />

      {/* ε bracket */}
      <line x1={185} y1={72} x2={185} y2={84} stroke={accent} strokeWidth={1} />
      <line x1={185} y1={84} x2={185} y2={96} stroke={accent} strokeWidth={1} />
      <text x={196} y={90} fontSize={8} fill={vt.ink(accent)}>ε-tube</text>

      {/* Data points */}
      {[[50,125],[80,110],[120,100],[160,88],[200,76],[240,64],[280,52]].map(([px,py],i) => (
        <circle key={`in${i}`} cx={px} cy={py} r={5}
          fill={vt.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"} />
      ))}
      {/* Support vectors outside tube */}
      {[[100,152],[260,30]].map(([px,py],i) => (
        <g key={`sv${i}`}>
          <circle cx={px} cy={py} r={6} fill="#ff6b6b" />
          <circle cx={px} cy={py} r={12} fill="none" stroke="#ff6b6b" strokeWidth={1.5} opacity={0.5} />
        </g>
      ))}

      {/* Info boxes */}
      <Box x={334} y={18} w={192} h={50}
        label="ε-insensitive loss" sublabel="L(y,ŷ) = max(0, |y−ŷ|−ε)"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Box x={334} y={80} w={192} h={50}
        label="Primal objective" sublabel="min ½‖w‖² + C·Σ(ξᵢ+ξᵢ*)"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />
      <Box x={334} y={142} w={192} h={36}
        label="ŷ = wᵀφ(x) + b"
        bg={vt.isDark ? "#7f1d1d" : "#fee2e2"} textColor={vt.isDark ? "#fff" : "#7f1d1d"} rx={8} />

      <text x={W/2} y={H - 6} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        SVR: fit within ε-tube · Dual: ŷ=Σ(αᵢ−αᵢ*)K(xᵢ,x)+b · support vectors penalized by C
      </text>
    </svg>
  );
}

// 8. MLP — multi-layer perceptron

function MLPArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 225;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
  const layers = [
    { label: "Input",    n: 3, color: vt.isDark ? "#475569" : "#94a3b8",  x: 50  },
    { label: "Hidden₁",  n: 5, color: accent,                             x: 170 },
    { label: "Hidden₂",  n: 5, color: accent,                             x: 310 },
    { label: "Output",   n: 3, color: vt.isDark ? "#059669" : "#34d399",  x: 450 },
  ];
  const R = 13, CY = 88;
  const acts = ["", "ReLU", "ReLU", "Softmax"];

  return (
    <svg viewBox={`0 0 ${W} ${H + 10}`} className="w-full">
      {/* Connections */}
      {layers.slice(0, -1).map((lay, li) => {
        const nxtLay = layers[li + 1];
        return Array.from({ length: lay.n }, (_, i) => {
          const y1 = CY + (i - (lay.n-1)/2) * (R*2.5);
          return Array.from({ length: nxtLay.n }, (_, j) => {
            const y2 = CY + (j - (nxtLay.n-1)/2) * (R*2.5);
            return (
              <line key={`c-${li}-${i}-${j}`}
                x1={lay.x+R} y1={y1} x2={nxtLay.x-R} y2={y2}
                stroke={arrowColor} strokeWidth={0.8} />
            );
          });
        });
      })}

      {/* Nodes */}
      {layers.map((lay, li) =>
        Array.from({ length: lay.n }, (_, i) => {
          const cy = CY + (i - (lay.n-1)/2) * (R*2.5);
          return (
            <circle key={`n-${li}-${i}`} cx={lay.x} cy={cy} r={R}
              fill={lay.color} stroke={vt.isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)"}
              strokeWidth={1.5} />
          );
        })
      )}

      {/* Layer labels */}
      {layers.map((lay, li) => (
        <g key={`lbl-${li}`}>
          <text x={lay.x} y={H - 48} textAnchor="middle" fontSize={9} fill={vt.text} fontWeight="bold">
            {lay.label}
          </text>
          <text x={lay.x} y={H - 35} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
            {lay.n} units
          </text>
          {acts[li] && (
            <text x={lay.x} y={H - 22} textAnchor="middle" fontSize={8}
              fill={vt.ink(accent)} fontFamily="monospace">{acts[li]}</text>
          )}
        </g>
      ))}

      {/* Formula bar */}
      <rect x={16} y={H - 12} width={W - 32} height={20} rx={5} fill={vt.surface} />
      <text x={W/2} y={H + 2} textAnchor="middle" fontSize={8} fill={vt.text} fontFamily="monospace">
        h₁=ReLU(W₁x+b₁)  ·  h₂=ReLU(W₂h₁+b₂)  ·  ŷ=Softmax(W₃h₂+b₃)
      </text>
    </svg>
  );
}

// 9. CNN Architecture

export { LinearRegressionArch, SVMArch, KNNArch, SVRArch, MLPArch };
