"use client";

/**
 * ArchDiagram — topic-specific architecture visualizations.
 * NO switcher — each type renders only that topic's architecture.
 * Fully light/dark-mode aware using CSS custom properties.
 */

import { useVizTheme } from "@/hooks/useVizTheme";

export type ArchType =
  | "linear-regression"
  | "decision-tree"
  | "random-forest"
  | "gradient-boosting"
  | "xgboost"
  | "lightgbm"
  | "catboost"
  | "bagging"
  | "svm"
  | "knn"
  | "svr"
  | "mlp"
  | "cnn"
  | "resnet"
  | "vit"
  | "transformer"
  | "bert"
  | "rnn"
  | "lstm"
  | "gru"
  | "gan"
  | "vae"
  | "evaluation"
  | "bias-variance"
  | "multiclass";

// ── Shared primitives ─────────────────────────────────────────────────────────

interface VT {
  isDark: boolean;
  textMuted: string;
  text: string;
  axis: string;
  grid: string;
  border: string;
  surface: string;
}

const ARROW_DEFS = (id: string, color: string) => (
  <defs>
    <marker id={id} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 Z" fill={color} />
    </marker>
  </defs>
);

function Arrow({
  x1, y1, x2, y2, color, markerId,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; markerId: string;
}) {
  // Shorten the line so arrowhead sits nicely
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ex = x2 - (dx / len) * 7;
  const ey = y2 - (dy / len) * 7;
  return (
    <line x1={x1} y1={y1} x2={ex} y2={ey}
      stroke={color} strokeWidth={1.5}
      markerEnd={`url(#${markerId})`} />
  );
}

function Box({
  x, y, w, h, label, sublabel, bg, textColor, rx = 8, dashed,
}: {
  x: number; y: number; w: number; h: number;
  label: string; sublabel?: string;
  bg: string; textColor: string;
  rx?: number; dashed?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill={bg} stroke={bg}
        strokeWidth={dashed ? 1.5 : 0}
        strokeDasharray={dashed ? "5,3" : undefined}
        opacity={dashed ? 0.7 : 1}
      />
      <text x={x + w / 2} y={y + h / 2 + (sublabel ? -5 : 5)}
        textAnchor="middle" fontSize={10} fontWeight="600" fill={textColor}>
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 9}
          textAnchor="middle" fontSize={8} fill={textColor} opacity={0.75}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

// Compute readable text color for a given background hex
function textOn(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? "#111" : "#fff";
}

// ── Architecture renders ──────────────────────────────────────────────────────

// 1. Linear Regression — feature vector → weighted sum → output
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
              fontSize={8} fill={accent} fontFamily="monospace">
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
function DecisionTreeArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 220;
  const NW = 108, NH = 34;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  const nodes = [
    { id: "root", x: W/2 - NW/2, y: 14, label: "Root: x₁ ≤ 4.5", sublabel: "Gini = 0.48", type: "split" },
    { id: "l1",   x: 80,         y: 84, label: "x₂ ≤ 6.0",        sublabel: "Gini = 0.31", type: "split" },
    { id: "r1",   x: W-80-NW,   y: 84, label: "x₃ ≤ 2.1",        sublabel: "Gini = 0.29", type: "split" },
    { id: "ll",   x: 20,         y: 158, label: "Leaf: Class A",  sublabel: "n=12, 91%", type: "leaf-a" },
    { id: "lr",   x: 148,        y: 158, label: "Leaf: Class B",  sublabel: "n=8, 75%", type: "leaf-b" },
    { id: "rl",   x: W-160-NW,  y: 158, label: "Leaf: Class A",  sublabel: "n=6, 83%", type: "leaf-a" },
    { id: "rr",   x: W-NW-20,   y: 158, label: "Leaf: Class B",  sublabel: "n=15, 93%", type: "leaf-b" },
  ];

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  function cx(n: typeof nodes[0]) { return n.x + NW / 2; }
  function cy(n: typeof nodes[0]) { return n.y + NH / 2; }

  const bg = (type: string) => {
    if (type === "split") return accent;
    if (type === "leaf-a") return vt.isDark ? "#4c1d95" : "#7c3aed";
    return vt.isDark ? "#7f1d1d" : "#dc2626";
  };

  const edges = [
    { from: "root", to: "l1", label: "≤" },
    { from: "root", to: "r1", label: ">" },
    { from: "l1",   to: "ll", label: "≤" },
    { from: "l1",   to: "lr", label: ">" },
    { from: "r1",   to: "rl", label: "≤" },
    { from: "r1",   to: "rr", label: ">" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-dt", arrowColor)}
      {edges.map(e => {
        const from = nodeMap[e.from];
        const to   = nodeMap[e.to];
        const mx = (cx(from) + cx(to)) / 2;
        const my = (cy(from) + cy(to)) / 2;
        return (
          <g key={`${e.from}-${e.to}`}>
            <Arrow x1={cx(from)} y1={from.y + NH} x2={cx(to)} y2={to.y}
              color={arrowColor} markerId="arr-dt" />
            <text x={mx + 6} y={my} fontSize={8} fill={vt.textMuted}>{e.label}</text>
          </g>
        );
      })}
      {nodes.map(n => (
        <Box key={n.id}
          x={n.x} y={n.y} w={NW} h={NH}
          label={n.label} sublabel={n.sublabel}
          bg={bg(n.type)} textColor={textOn(bg(n.type))} rx={n.type === "split" ? 8 : 6} />
      ))}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        Gini(t)=1−Σpₖ²  ·  H(t)=−Σpₖlog₂pₖ  ·  IG=H(parent)−Σ(nᵢ/n)H(childᵢ)  ·  prune by α
      </text>
    </svg>
  );
}

// 3. Gradient Boosting — sequential residual correction
function GradientBoostingArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 185;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const BW = 72, BH = 38, SY = 30, SH = 40;
  const trees = [
    { label: "h₁(x)", sublabel: "fit data", x: 60  },
    { label: "h₂(x)", sublabel: "fit r₁",   x: 190 },
    { label: "h₃(x)", sublabel: "fit r₂",   x: 320 },
    { label: "hₘ(x)", sublabel: "fit rₘ₋₁", x: 430 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-gb", arrowColor)}

      {/* Data source */}
      <Box x={8} y={SY} w={44} h={SH}
        label="Data" sublabel="(x,y)"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />
      <Arrow x1={52} y1={SY + SH/2} x2={58} y2={SY + SH/2} color={arrowColor} markerId="arr-gb" />

      {/* Trees */}
      {trees.map((t, i) => (
        <g key={t.label}>
          <Box x={t.x} y={SY} w={BW} h={BH}
            label={t.label} sublabel={t.sublabel}
            bg={accent} textColor={textOn(accent)} rx={8} />
          {/* Residual arrows down */}
          {i < trees.length - 1 && (
            <>
              <Arrow x1={t.x + BW/2} y1={SY + BH}
                x2={t.x + BW/2} y2={120}
                color={arrowColor} markerId="arr-gb" />
              <text x={t.x + BW/2 + 5} y={100} fontSize={8} fill="#ff6b6b">r{i+1}=y-F{i}</text>
            </>
          )}
          {/* Horizontal arrow to next tree */}
          {i < trees.length - 2 && (
            <Arrow x1={t.x + BW} y1={SY + BH/2}
              x2={trees[i+1].x} y2={SY + BH/2}
              color={arrowColor} markerId="arr-gb" />
          )}
          {i === 2 && (
            <text x={trees[i].x + BW + 12} y={SY + BH/2 + 4}
              fontSize={13} fill={vt.textMuted}>…</text>
          )}
        </g>
      ))}

      {/* Summation */}
      <rect x={60} y={118} width={370} height={34} rx={8}
        fill={vt.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
        stroke={vt.border} strokeWidth={1} />
      <text x={245} y={139} textAnchor="middle" fontSize={9} fill={vt.text} fontFamily="monospace">
        F(x) = h₁(x) + η·h₂(x) + η·h₃(x) + … + η·hₘ(x)
      </text>

      {/* Final output */}
      <Arrow x1={430} y1={118} x2={430} y2={90} color={arrowColor} markerId="arr-gb" />
      <Arrow x1={430} y1={152} x2={500} y2={152} color={arrowColor} markerId="arr-gb" />
      <Box x={502} y={133} w={32} h={32}
        label="ŷ" bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Gradient Boosting: Fₘ(x) = Fₘ₋₁(x) + η·hₘ(x)  where hₘ fits −∂L/∂Fₘ₋₁
      </text>
    </svg>
  );
}

// 4. Bagging — parallel bootstrap + vote
function BaggingArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 220;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const BW = 88, BH = 38;
  const models = [
    { label: "Model 1", sub: "Bootstrap₁ (sample w/ replace)", y: 24  },
    { label: "Model 2", sub: "Bootstrap₂ (sample w/ replace)", y: 82  },
    { label: "Model 3", sub: "Bootstrap₃ (sample w/ replace)", y: 140 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-bag", arrowColor)}

      {/* Dataset */}
      <Box x={6} y={82} w={72} h={38}
        label="Dataset" sublabel="N samples"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />

      {/* Bootstrap arrows + model boxes */}
      {models.map((m, i) => (
        <g key={m.label}>
          <Arrow x1={78} y1={101} x2={118} y2={m.y + BH/2} color={arrowColor} markerId="arr-bag" />
          <Box x={118} y={m.y} w={BW} h={BH}
            label={m.label} sublabel={m.sub}
            bg={accent} textColor={textOn(accent)} rx={8} />
          {/* Prediction arrows */}
          <Arrow x1={118 + BW} y1={m.y + BH/2} x2={328} y2={105}
            color={arrowColor} markerId="arr-bag" />
          <text x={244} y={m.y + BH/2 - 4} fontSize={8} fill={vt.textMuted}>
            pred{i+1}
          </text>
        </g>
      ))}

      {/* "..." for more models */}
      <text x={162} y={190} textAnchor="middle" fontSize={13} fill={vt.textMuted}>⋮</text>

      {/* Aggregator */}
      <Box x={328} y={74} w={102} h={58}
        label="Aggregate" sublabel="Avg(reg) / Vote(cls)"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />
      <Arrow x1={430} y1={103} x2={466} y2={103} color={arrowColor} markerId="arr-bag" />

      {/* Output */}
      <Box x={466} y={82} w={66} h={42}
        label="ŷ final" sublabel="low variance"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      <text x={W/2} y={H - 8} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Bagging: ŷ = (1/B)Σhᵢ(x)  ·  Var(ŷ) = σ²/B(1−ρ) → lower variance than single model
      </text>
    </svg>
  );
}

// 5. SVM — hyperplane geometry with training animation
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
      <text x={220} y={172} fontSize={8} fill="#dc2626">Class −1</text>

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
      <text x={138} y={106} textAnchor="middle" fontSize={9} fill={accent} fontWeight="bold">2/‖w‖</text>

      {/* Support vector rings — appear with animation */}
      {[[110,90],[150,140],[165,80]].map(([px,py],i) => (
        <circle key={`sv${i}`} cx={px} cy={py} r={13}
          fill="none" stroke={accent} strokeWidth={2} opacity={0.6}>
          <animate attributeName="r" values="0;6;10;13;13" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.3;0.5;0.6;0.6" dur="4s" repeatCount="indefinite" />
        </circle>
      ))}
      <text x={169} y={194} textAnchor="middle" fontSize={8} fill={accent}>support vectors (circled)</text>

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
      <text x={196} y={90} fontSize={8} fill={accent}>ε-tube</text>

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
              fill={accent} fontFamily="monospace">{acts[li]}</text>
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
function TransformerArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 380;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const BW = 170, CX = W / 2, BX = CX - BW / 2;
  const neutralBg = vt.isDark ? "#374151" : "#e2e8f0";
  const purple = vt.isDark ? "#7c3aed" : "#8b5cf6";
  const green  = vt.isDark ? "#059669" : "#34d399";

  // Bottom-to-top layout (higher y = visually lower):
  // y=330 → Token Embedding  (h=40, bottom=370)
  // y=270 → MHA              (h=40, bottom=310) — gap 20px above
  // y=222 → Add & Norm ①     (h=30, bottom=252) — gap 18px above
  // y=166 → FFN              (h=38, bottom=204) — gap 18px above
  // y=118 → Add & Norm ②     (h=30, bottom=148) — gap 18px above
  // y= 62 → Linear+Softmax   (h=38, bottom=100) — gap 18px above
  // y= 18 → Output box       (h=26, bottom= 44) — gap 18px above

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-tr", ac)}

      {/* ── Token Embedding (bottom) ── */}
      <Box x={BX} y={330} w={BW} h={40}
        label="Token Embedding" sublabel="xₜ + PE(pos)  →  d-dim vector"
        bg={neutralBg} textColor={vt.text} rx={8} />
      {/* Arrow from Token Embed top (330) to MHA bottom (310) */}
      <line x1={CX} y1={330} x2={CX} y2={312} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── Encoder block border ── */}
      <rect x={BX - 28} y={114} width={BW + 56} height={220} rx={10}
        fill={`${accent}07`} stroke={`${accent}30`} strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={BX + BW + 34} y={228} textAnchor="start" fontSize={13}
        fill={accent} fontWeight="bold">×N</text>

      {/* ── Multi-Head Attention ── */}
      <Box x={BX} y={270} w={BW} h={40}
        label="Multi-Head Self-Attention" sublabel="Attn(Q,K,V)=softmax(QKᵀ/√dₖ)V"
        bg={accent} textColor={textOn(accent)} rx={8} />
      {/* Arrow from MHA top (270) to Add&Norm1 bottom (252) */}
      <line x1={CX} y1={270} x2={CX} y2={254} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── Add & Norm 1 ── */}
      <Box x={BX} y={222} w={BW} h={30}
        label="Add & LayerNorm ①  (x + sublayer)" bg={neutralBg} textColor={vt.text} rx={6} />
      {/* Arrow from Add&Norm1 top (222) to FFN bottom (204) */}
      <line x1={CX} y1={222} x2={CX} y2={206} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── FFN ── */}
      <Box x={BX} y={166} w={BW} h={38}
        label="Feed-Forward Network" sublabel="FFN(x)=max(0,xW₁+b₁)W₂+b₂  d→4d→d"
        bg={purple} textColor="white" rx={8} />
      {/* Arrow from FFN top (166) to Add&Norm2 bottom (148) */}
      <line x1={CX} y1={166} x2={CX} y2={150} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── Add & Norm 2 ── */}
      <Box x={BX} y={118} w={BW} h={30}
        label="Add & LayerNorm ②  (x + sublayer)" bg={neutralBg} textColor={vt.text} rx={6} />
      {/* Arrow from Add&Norm2 top (118) to Linear+Softmax bottom (100) */}
      <line x1={CX} y1={118} x2={CX} y2={102} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── Output head ── */}
      <Box x={BX} y={62} w={BW} h={38}
        label="Linear + Softmax" sublabel="logits → P(vocab) or class probs"
        bg={green} textColor={textOn(green)} rx={8} />
      {/* Arrow from Linear+Softmax top (62) to Output box bottom (44) */}
      <line x1={CX} y1={62} x2={CX} y2={46} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />
      <Box x={BX} y={18} w={BW} h={26} label="Output: token probs / class"
        bg={neutralBg} textColor={vt.text} rx={6} />

      {/* ── Residual skip connections (left rail) ── */}
      {/* Skip around MHA: from Token Embed top (330) to Add&Norm1 bottom (252) */}
      <path d={`M ${BX - 8} 330 L ${BX - 22} 330 L ${BX - 22} 252 L ${BX - 8} 252`}
        fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,2" />
      {/* Skip around FFN: from Add&Norm1 top (222) to Add&Norm2 bottom (148) */}
      <path d={`M ${BX - 8} 222 L ${BX - 22} 222 L ${BX - 22} 148 L ${BX - 8} 148`}
        fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,2" />
      <text x={BX - 30} y={240} fontSize={8} fill="#f59e0b" fontWeight="bold"
        transform={`rotate(-90,${BX-30},240)`}>residual</text>

      {/* ── BERT annotation ── */}
      <rect x={W - 140} y={268} width={128} height={74} rx={8}
        fill={vt.isDark ? "#1e3a5f30" : "#dbeafe50"} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,2" />
      <text x={W - 76} y={284} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight="bold">BERT uses encoder</text>
      <text x={W - 76} y={298} textAnchor="middle" fontSize={8} fill="#3b82f6">bidirectional attention</text>
      <text x={W - 76} y={312} textAnchor="middle" fontSize={8} fill="#3b82f6">[CLS] cls token</text>
      <text x={W - 76} y={326} textAnchor="middle" fontSize={8} fill="#3b82f6">MLM + NSP pretrain</text>
      <text x={W - 76} y={340} textAnchor="middle" fontSize={8} fill="#3b82f6">fine-tune: add head</text>

      <text x={W/2} y={H - 6} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        Transformer: O(n²d) attention — Q=XWQ, K=XWK, V=XWV — fully parallelizable, no recurrence
      </text>
    </svg>
  );
}

// 11. LSTM cell — input at top, gates below, output at bottom (no overlap)
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
      <text x={87} y={TRACK_Y + 6} fontSize={15} fill="#ef4444" opacity={0.9}>×</text>
      <text x={208} y={TRACK_Y + 6} fontSize={15} fill="#f59e0b" opacity={0.9}>+</text>
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
function GANArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 190;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-gan", arrowColor)}

      {/* Generator path */}
      <Box x={10} y={40} w={74} h={36} label="Noise z" sublabel="z~N(0,I)"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />
      <Arrow x1={84} y1={58} x2={114} y2={58} color={arrowColor} markerId="arr-gan" />
      <Box x={114} y={28} w={108} h={60} label="Generator G(z)" sublabel="NN: z → x̂"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={222} y1={58} x2={258} y2={58} color={arrowColor} markerId="arr-gan" />
      <text x={240} y={50} textAnchor="middle" fontSize={8} fill={vt.textMuted}>Fake x̂</text>

      {/* Real data */}
      <Box x={10} y={120} w={74} h={36} label="Real Data" sublabel="from p_data"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#34d399")} rx={8} />
      <Arrow x1={84} y1={138} x2={258} y2={100} color={arrowColor} markerId="arr-gan" />
      <text x={172} y={122} textAnchor="middle" fontSize={8} fill={vt.textMuted}>Real x</text>

      {/* Discriminator */}
      <Box x={258} y={40} w={118} h={80} label="Discriminator D(x)" sublabel="NN: x → [0,1]"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />
      <Arrow x1={376} y1={80} x2={416} y2={80} color={arrowColor} markerId="arr-gan" />
      <Box x={416} y={60} w={90} h={40} label="Real/Fake?" sublabel="BCE loss"
        bg={vt.isDark ? "#374151" : "#e2e8f0"} textColor={vt.text} rx={8} />

      {/* Feedback: discriminator loss */}
      <path d="M 461 100 L 461 158 L 312 158 L 312 120"
        fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,3"
        markerEnd="url(#arr-gan)" />
      <text x={386} y={165} textAnchor="middle" fontSize={7} fill="#f59e0b">disc gradient ∇_D</text>

      {/* Generator loss feedback */}
      <path d="M 380 52 L 406 52 L 406 20 L 168 20 L 168 28"
        fill="none" stroke="#ff6b6b" strokeWidth={1.5} strokeDasharray="5,3"
        markerEnd="url(#arr-gan)" />
      <text x={284} y={17} textAnchor="middle" fontSize={7} fill="#ff6b6b">gen gradient ∇_G (fool D)</text>

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        GAN: min_G max_D E[log D(x)] + E[log(1−D(G(z)))]
      </text>
    </svg>
  );
}

// 13. Model Evaluation pipeline
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
          <text x={492} y={m.y + 12} fontSize={9} fill={accent} fontWeight="500">{m.label}</text>
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
      <text x={94} y={36} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight="bold">
        Underfitting
      </text>
      <text x={94} y={50} textAnchor="middle" fontSize={8} fill="#ef4444">
        High Bias
      </text>

      <rect x={188} y={20} width={164} height={130} rx={8}
        fill={`${accent}10`} stroke={accent} strokeWidth={1} strokeDasharray="5,3" />
      <text x={270} y={36} textAnchor="middle" fontSize={9} fill={accent} fontWeight="bold">
        Sweet Spot
      </text>
      <text x={270} y={50} textAnchor="middle" fontSize={8} fill={accent}>
        Low Bias + Low Variance
      </text>

      <rect x={366} y={20} width={160} height={130} rx={8}
        fill={vt.isDark ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.07)"}
        stroke="#f59e0b" strokeWidth={1} strokeDasharray="5,3" />
      <text x={446} y={36} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight="bold">
        Overfitting
      </text>
      <text x={446} y={50} textAnchor="middle" fontSize={8} fill="#f59e0b">
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
  const W = 540, H = 250;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const purple = vt.isDark ? "#7c3aed" : "#8b5cf6";
  const green  = vt.isDark ? "#059669" : "#34d399";
  const nb     = vt.isDark ? "#334155" : "#e2e8f0";

  // Common classifier box dimensions (wide enough for all labels)
  const BX = 14, BW = 230, BH = 24;

  // OvA row: y range 8..118 (h=110)
  const OVA_BG_Y = 8, OVA_H = 110;
  const ovaYs = [26, 54, 82];

  // OvO row: y range 126..236 (h=110)
  const OVO_BG_Y = 126, OVO_H = 110;
  const ovoYs = [144, 172, 200];

  // Aggregation boxes on the right
  const AGG_X = 258, AGG_W = 92, AGG_H = 52;
  // Output boxes
  const OUT_X = 360, OUT_W = 76;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-mc", ac)}

      {/* ── OvA section (top row) ── */}
      <rect x={6} y={OVA_BG_Y} width={246} height={OVA_H} rx={8}
        fill={`${accent}07`} stroke={`${accent}25`} strokeWidth={1} strokeDasharray="4,3" />
      <text x={129} y={OVA_BG_Y + 14} textAnchor="middle" fontSize={9} fontWeight="bold" fill={accent}>
        One-vs-All (OvA) — 3 classifiers
      </text>
      {["A","B","C"].map((c, i) => (
        <Box key={`ova-${c}`} x={BX} y={ovaYs[i]} w={BW} h={BH}
          label={`Class ${c}  vs  All Others  →  P(y=${c}|x)`}
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
      <rect x={6} y={OVO_BG_Y} width={246} height={OVO_H} rx={8}
        fill={`${purple}08`} stroke={`${purple}25`} strokeWidth={1} strokeDasharray="4,3" />
      <text x={129} y={OVO_BG_Y + 14} textAnchor="middle" fontSize={9} fontWeight="bold" fill={purple}>
        One-vs-One (OvO) — C(C−1)/2 = 3 classifiers
      </text>
      {[["A","B"],["A","C"],["B","C"]].map(([c1,c2], i) => (
        <Box key={`ovo-${c1}${c2}`} x={BX} y={ovoYs[i]} w={BW} h={BH}
          label={`${c1}  vs  ${c2}  →  binary decision`}
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
function RandomForestArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 210;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const trees = [
    { label: "Tree 1", sub: "B₁ + feat⊂F", y: 24  },
    { label: "Tree 2", sub: "B₂ + feat⊂F", y: 86  },
    { label: "Tree 3", sub: "B₃ + feat⊂F", y: 148 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-rf", ac)}
      {/* Dataset */}
      <Box x={8} y={84} w={72} h={42} label="Dataset" sublabel="N samples"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />
      {/* Feature random label */}
      <text x={140} y={12} textAnchor="middle" fontSize={9} fill={accent} fontWeight="bold">
        Random Feature Subset at each split: √p features
      </text>
      {trees.map((t) => (
        <g key={t.label}>
          <Arrow x1={80} y1={105} x2={106} y2={t.y + 21} color={ac} markerId="arr-rf" />
          <Box x={106} y={t.y} w={92} h={42}
            label={t.label} sublabel={t.sub}
            bg={accent} textColor={textOn(accent)} rx={8} />
          <Arrow x1={198} y1={t.y + 21} x2={318} y2={105} color={ac} markerId="arr-rf" />
        </g>
      ))}
      <text x={154} y={195} textAnchor="middle" fontSize={8} fill={vt.textMuted}>⋮</text>
      <Box x={318} y={76} w={102} h={58}
        label="Aggregate" sublabel="Majority vote (class) / Average (reg)"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />
      <Arrow x1={420} y1={105} x2={464} y2={105} color={ac} markerId="arr-rf" />
      <Box x={464} y={86} w={64} h={38}
        label="ŷ final" sublabel="low var"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />
      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        RF = Bagging + random feature splits → decorrelated trees → lower variance than single tree
      </text>
    </svg>
  );
}

// 17. XGBoost — Newton boosting, regularized objective, histogram splits
function XGBoostArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 258;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  const green = vt.isDark ? "#059669" : "#34d399";
  const LCX = 6, LW = 214;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-xgb", ac)}

      {/* ── Left: 4-step boosting loop ── */}
      <text x={LCX + LW / 2} y={10} textAnchor="middle" fontSize={8.5} fill={vt.textMuted} fontWeight="bold">
        BOOSTING LOOP (T rounds)
      </text>

      <Box x={LCX} y={16} w={LW} h={36} label="① Initialize"
        sublabel="F₀(x) = mean(y)" bg={nb} textColor={vt.text} rx={8} />
      <Arrow x1={LCX + LW / 2} y1={52} x2={LCX + LW / 2} y2={64} color={ac} markerId="arr-xgb" />

      <Box x={LCX} y={64} w={LW} h={40} label="② Compute gᵢ and hᵢ"
        sublabel="1st + 2nd order derivatives of loss"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={LCX + LW / 2} y1={104} x2={LCX + LW / 2} y2={116} color={ac} markerId="arr-xgb" />

      <Box x={LCX} y={116} w={LW} h={40} label="③ Build Regularized Tree hₜ"
        sublabel="split by max Gain · prune weak branches"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={LCX + LW / 2} y1={156} x2={LCX + LW / 2} y2={168} color={ac} markerId="arr-xgb" />

      <Box x={LCX} y={168} w={LW} h={36} label="④ Update Predictions"
        sublabel="Fₜ(x) = Fₜ₋₁(x) + η · hₜ(x)"
        bg={green} textColor={textOn(green)} rx={8} />

      <text x={LCX + LW / 2} y={218} textAnchor="middle" fontSize={8} fill="#f59e0b">
        ↺  repeat t = 1…T  →  final prediction: sum of all trees
      </text>

      {/* ── Right: 3 innovation cards ── */}

      {/* Card 1 — Newton Step */}
      <rect x={228} y={8} width={306} height={66} rx={8}
        fill={`${accent}12`} stroke={`${accent}40`} strokeWidth={1.5} />
      <text x={240} y={24} fontSize={9} fontWeight="bold" fill={accent}>⚡ Newton Step (2nd-order)</text>
      <text x={240} y={39} fontSize={8} fill={vt.text} fontFamily="monospace">wⱼ* = −Gⱼ / (Hⱼ + λ)   ← exact optimal leaf weight</text>
      <text x={240} y={53} fontSize={7.5} fill={vt.textMuted}>Uses hessian (curvature) → better step size than gradient alone</text>
      <text x={240} y={66} fontSize={7.5} fill={vt.textMuted}>Gⱼ = Σᵢ∈ⱼ gᵢ  ·  Hⱼ = Σᵢ∈ⱼ hᵢ  (sums over samples in leaf j)</text>

      {/* Card 2 — Regularized Objective */}
      <rect x={228} y={82} width={306} height={66} rx={8}
        fill={vt.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"}
        stroke={vt.border} strokeWidth={1} />
      <text x={240} y={98} fontSize={9} fontWeight="bold" fill={vt.text}>📐 Regularized Objective</text>
      <text x={240} y={113} fontSize={7.5} fill={vt.text} fontFamily="monospace">Obj = Σ[gᵢwⱼ + ½hᵢwⱼ²] + γT + ½λΣwⱼ²</text>
      <text x={240} y={127} fontSize={7.5} fill={vt.textMuted}>γ = leaf count penalty  ·  λ = L2 regularization on weights</text>
      <text x={240} y={140} fontSize={7.5} fill={vt.textMuted}>Gain = ½[GL²/(HL+λ) + GR²/(HR+λ) − G²/(H+λ)] − γ</text>

      {/* Card 3 — Speed & Generalization */}
      <rect x={228} y={156} width={306} height={80} rx={8}
        fill={vt.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"}
        stroke={vt.border} strokeWidth={1} />
      <text x={240} y={172} fontSize={9} fontWeight="bold" fill={vt.text}>🚀 Speed & Generalization</text>
      <text x={240} y={187} fontSize={7.5} fill={vt.textMuted}>• Histogram binning → O(kd) split finding (10× faster)</text>
      <text x={240} y={200} fontSize={7.5} fill={vt.textMuted}>• colsample_bytree / subsample → randomness like RF</text>
      <text x={240} y={213} fontSize={7.5} fill={vt.textMuted}>• alpha (L1) + lambda (L2) → built-in regularization</text>
      <text x={240} y={226} fontSize={7.5} fill={vt.textMuted}>• Learns best direction for missing values natively</text>

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        XGBoost: parallel Newton boosting · regularized trees · histogram splits · handles missing values
      </text>
    </svg>
  );
}

// 18. LightGBM — leaf-wise growth vs level-wise + key innovations
function LightGBMArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 252;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  const NW = 40, NH = 20;

  // Level-wise nodes (centered at cx=130)
  const lv = [
    { cx: 130, y: 28 },
    { cx:  88, y: 60 }, { cx: 172, y: 60 },
    { cx:  62, y: 94 }, { cx: 110, y: 94 }, { cx: 152, y: 94 }, { cx: 198, y: 94 },
  ];
  const lvEdges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

  // Leaf-wise nodes (centered at cx=400)
  // Root → left (best, gets split) + right (stays leaf)
  // Left → left-left + left-right (both new leaves)
  const lf = [
    { cx: 400, y: 28, best: false },
    { cx: 360, y: 60, best: true  },
    { cx: 442, y: 60, best: false },
    { cx: 334, y: 94, best: false },
    { cx: 382, y: 94, best: false },
  ];
  const lfEdges = [[0,1],[0,2],[1,3],[1,4]];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-lgb", ac)}

      {/* ── Section labels ── */}
      <text x={130} y={13} textAnchor="middle" fontSize={9} fill={vt.textMuted} fontWeight="bold">
        Level-wise (XGBoost style)
      </text>
      <text x={400} y={13} textAnchor="middle" fontSize={9} fill={accent} fontWeight="bold">
        Leaf-wise (LightGBM) ← faster
      </text>

      {/* Level-wise tree */}
      {lvEdges.map(([p, c], i) => (
        <line key={`lve-${i}`}
          x1={lv[p].cx} y1={lv[p].y + NH} x2={lv[c].cx} y2={lv[c].y}
          stroke={ac} strokeWidth={1} />
      ))}
      {lv.map((n, i) => (
        <g key={`lvn-${i}`}>
          <rect x={n.cx - NW / 2} y={n.y} width={NW} height={NH} rx={4}
            fill={nb} stroke={vt.border} strokeWidth={1} />
          <text x={n.cx} y={n.y + 13} textAnchor="middle" fontSize={7.5} fill={vt.text}>
            {i === 0 ? "Root" : i <= 2 ? "L1" : "L2"}
          </text>
        </g>
      ))}
      <text x={130} y={118} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
        All nodes at same depth split
      </text>
      <text x={130} y={129} textAnchor="middle" fontSize={7} fill={vt.textMuted}>
        → balanced but slower
      </text>

      {/* Divider */}
      <line x1={272} y1={6} x2={272} y2={135} stroke={vt.border} strokeWidth={1} strokeDasharray="3,3" />

      {/* Leaf-wise tree */}
      {lfEdges.map(([p, c], i) => (
        <line key={`lfe-${i}`}
          x1={lf[p].cx} y1={lf[p].y + NH} x2={lf[c].cx} y2={lf[c].y}
          stroke={lf[c].best ? accent : ac}
          strokeWidth={lf[c].best ? 2 : 1} />
      ))}
      {lf.map((n, i) => (
        <g key={`lfn-${i}`}>
          <rect x={n.cx - NW / 2} y={n.y} width={NW} height={NH} rx={4}
            fill={n.best ? accent : nb}
            stroke={n.best ? accent : vt.border}
            strokeWidth={n.best ? 2 : 1} />
          <text x={n.cx} y={n.y + 13} textAnchor="middle" fontSize={7.5}
            fill={n.best ? textOn(accent) : vt.text} fontWeight={n.best ? "bold" : "normal"}>
            {i === 0 ? "Root" : i === 1 ? "Best!" : i === 2 ? "Leaf" : "Leaf"}
          </text>
        </g>
      ))}
      <text x={lf[1].cx + NW / 2 + 6} y={lf[1].y + 13} fontSize={7.5} fill={accent}>← max gain</text>
      <text x={400} y={118} textAnchor="middle" fontSize={7.5} fill={accent}>
        Always split leaf with highest gain
      </text>
      <text x={400} y={129} textAnchor="middle" fontSize={7} fill={accent}>
        → deeper, asymmetric, better accuracy
      </text>

      {/* ── Bottom: 3 innovation cards ── */}
      {/* GOSS */}
      <rect x={6} y={140} width={164} height={72} rx={8} fill={nb} stroke={vt.border} strokeWidth={1} />
      <text x={88} y={157} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.text}>GOSS</text>
      <text x={88} y={170} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Gradient One-Side Sampling</text>
      <text x={88} y={183} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>keep large-grad + random</text>
      <text x={88} y={196} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>small-grad samples</text>
      <text x={88} y={207} textAnchor="middle" fontSize={7} fill={vt.textMuted}>→ fewer samples, more signal</text>

      {/* EFB */}
      <rect x={178} y={140} width={164} height={72} rx={8} fill={nb} stroke={vt.border} strokeWidth={1} />
      <text x={260} y={157} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.text}>EFB</text>
      <text x={260} y={170} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Exclusive Feature Bundling</text>
      <text x={260} y={183} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>bundle mutually exclusive</text>
      <text x={260} y={196} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>sparse features together</text>
      <text x={260} y={207} textAnchor="middle" fontSize={7} fill={vt.textMuted}>→ fewer features to split on</text>

      {/* Histogram */}
      <rect x={350} y={140} width={184} height={72} rx={8}
        fill={`${accent}12`} stroke={`${accent}35`} strokeWidth={1.5} />
      <text x={442} y={157} textAnchor="middle" fontSize={9} fontWeight="bold" fill={accent}>Histogram Binning</text>
      <text x={442} y={170} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>continuous → k discrete bins</text>
      <text x={442} y={183} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>O(n) → O(kd) split finding</text>
      <text x={442} y={196} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>subtraction trick from parent</text>
      <text x={442} y={207} textAnchor="middle" fontSize={7} fill={accent}>→ 10–100× faster than exact</text>

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        LightGBM: leaf-wise growth + GOSS + EFB + histogram → faster, lower memory than XGBoost
      </text>
    </svg>
  );
}

// 19. RNN — unrolled recurrent cell (fixed overflow: NW=54, startX=52)
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
      <text x={W / 2} y={53} textAnchor="middle" fontSize={10} fill={accent} fontWeight="bold">
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
      <text x={205} y={BY - 22} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight="bold">
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
      <text x={32} y={82} textAnchor="middle" fontSize={8} fill={accent} fontWeight="bold">Image</text>
      <text x={32} y={95} textAnchor="middle" fontSize={7} fill={accent}>H×W×C</text>
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
function VAEArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 200;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-vae", ac)}

      {/* Input */}
      <Box x={6} y={76} w={58} h={44} label="Input x" sublabel="data"
        bg={nb} textColor={vt.text} rx={8} />
      <Arrow x1={64} y1={98} x2={84} y2={98} color={ac} markerId="arr-vae" />

      {/* Encoder */}
      <Box x={84} y={60} w={88} h={76} label="Encoder" sublabel="q_φ(z|x)"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={172} y1={78} x2={194} y2={74} color={ac} markerId="arr-vae" />
      <Arrow x1={172} y1={118} x2={194} y2={122} color={ac} markerId="arr-vae" />

      {/* μ and σ */}
      <Box x={194} y={56} w={58} h={30} label="μ(x)" sublabel="mean"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={6} />
      <Box x={194} y={100} w={58} h={30} label="σ(x)" sublabel="std dev"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={6} />
      <Arrow x1={252} y1={71} x2={274} y2={90} color={ac} markerId="arr-vae" />
      <Arrow x1={252} y1={115} x2={274} y2={106} color={ac} markerId="arr-vae" />

      {/* Reparameterization */}
      <Box x={274} y={72} w={76} h={52}
        label="z = μ+ε·σ" sublabel="ε~N(0,I) reparam"
        bg={vt.isDark ? "#0891b2" : "#22d3ee"} textColor={textOn("#22d3ee")} rx={8} />
      <Arrow x1={350} y1={98} x2={372} y2={98} color={ac} markerId="arr-vae" />

      {/* Decoder */}
      <Box x={372} y={60} w={88} h={76} label="Decoder" sublabel="p_θ(x|z)"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={460} y1={98} x2={478} y2={98} color={ac} markerId="arr-vae" />

      {/* Reconstruction */}
      <Box x={478} y={76} w={54} h={44} label="x̂" sublabel="recon"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      {/* Loss */}
      <rect x={60} y={150} width={W - 80} height={30} rx={6}
        fill={vt.surface} stroke={vt.border} strokeWidth={1} />
      <text x={W / 2} y={163} textAnchor="middle" fontSize={9} fill={vt.text} fontFamily="monospace">
        L = E[log p(x|z)] − KL[q(z|x) ‖ p(z)]
      </text>
      <text x={W / 2} y={177} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        reconstruction loss − KL regularization (forces z → N(0,I))
      </text>
      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        VAE learns a smooth, continuous latent space — enables interpolation and generation
      </text>
    </svg>
  );
}

// 24. CatBoost — ordered TS + symmetric trees + ordered boosting
function CatBoostArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 280;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  const green = vt.isDark ? "#059669" : "#34d399";
  const NW = 38, NH = 18;

  // Symmetric tree layout (right side, centered at cx=400)
  const root = { cx: 400, y: 72 };
  const l1 = [{ cx: 368, y: 100 }, { cx: 432, y: 100 }];
  const l2 = [
    { cx: 348, y: 130 }, { cx: 384, y: 130 },
    { cx: 416, y: 130 }, { cx: 452, y: 130 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-cat", ac)}

      {/* ── Left: Ordered Target Statistics ── */}
      <rect x={6} y={8} width={252} height={116} rx={8}
        fill={`${accent}10`} stroke={`${accent}35`} strokeWidth={1.5} />
      <text x={132} y={24} textAnchor="middle" fontSize={9} fontWeight="bold" fill={accent}>
        ① Ordered Target Statistics
      </text>
      <text x={132} y={37} textAnchor="middle" fontSize={7.5} fill={vt.text}>
        Encode categoricals without target leakage
      </text>

      {/* Formula box */}
      <rect x={16} y={42} width={232} height={28} rx={5}
        fill={vt.isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"} />
      <text x={132} y={54} textAnchor="middle" fontSize={7.5} fill={vt.text} fontFamily="monospace">
        TS(xᵢ) = Σ&#123;yⱼ: xⱼ=xᵢ, j&lt;i&#125; + a·prior
      </text>
      <text x={132} y={65} textAnchor="middle" fontSize={7} fill={vt.textMuted} fontFamily="monospace">
        count(xⱼ=xᵢ, j&lt;i) + a
      </text>

      <text x={16} y={84} fontSize={7.5} fill={vt.textMuted}>
        • Sample i uses ONLY targets from samples 1..i−1
      </text>
      <text x={16} y={96} fontSize={7.5} fill={vt.textMuted}>
        • Different ordering per boosting round
      </text>
      <text x={16} y={108} fontSize={7.5} fill={vt.textMuted}>
        • No manual one-hot / label encoding needed
      </text>
      <text x={16} y={120} fontSize={7.5} fill={accent} fontWeight="bold">
        → prevents overfitting on high-cardinality cats
      </text>

      {/* ── Right: Symmetric (Oblivious) Tree ── */}
      <text x={400} y={16} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.text}>
        ② Symmetric (Oblivious) Tree
      </text>
      <text x={400} y={28} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
        same split condition at every node of the same level
      </text>

      {/* Root */}
      <rect x={root.cx - NW / 2} y={root.y} width={NW} height={NH} rx={4} fill={accent} />
      <text x={root.cx} y={root.y + 12} textAnchor="middle" fontSize={7} fill={textOn(accent)} fontWeight="bold">x₁≤t₁</text>

      {/* Level 1 — same condition */}
      {l1.map((n, i) => (
        <g key={`cl1-${i}`}>
          <line x1={root.cx} y1={root.y + NH} x2={n.cx} y2={n.y} stroke={ac} strokeWidth={1} />
          <rect x={n.cx - NW / 2} y={n.y} width={NW} height={NH} rx={4} fill={accent} />
          <text x={n.cx} y={n.y + 12} textAnchor="middle" fontSize={7} fill={textOn(accent)} fontWeight="bold">x₂≤t₂</text>
        </g>
      ))}
      {/* "same!" annotation between L1 nodes */}
      <line x1={368 + NW / 2} y1={109} x2={432 - NW / 2} y2={109}
        stroke="#f59e0b" strokeWidth={1} strokeDasharray="3,2" />
      <text x={400} y={107} textAnchor="middle" fontSize={6.5} fill="#f59e0b">same!</text>

      {/* Level 2 — leaves */}
      {l2.map((n, i) => (
        <g key={`cl2-${i}`}>
          <line x1={l1[Math.floor(i / 2)].cx} y1={l1[Math.floor(i / 2)].y + NH}
            x2={n.cx} y2={n.y} stroke={ac} strokeWidth={1} />
          <rect x={n.cx - NW / 2} y={n.y} width={NW} height={NH} rx={4} fill={green} />
          <text x={n.cx} y={n.y + 12} textAnchor="middle" fontSize={7} fill={textOn(green)}>w{i + 1}</text>
        </g>
      ))}
      {/* l2 bottom = y=130+NH=148 → cards start at y=162 (14px clearance) */}
      <text x={400} y={154} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
        → O(depth) prediction · regularization effect
      </text>

      {/* ── Bottom: 3 feature cards (shifted to y=162 to clear l2 nodes at y=148) ── */}
      <rect x={6} y={162} width={162} height={70} rx={6} fill={nb} stroke={vt.border} strokeWidth={1} />
      <text x={87} y={179} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={vt.text}>③ Ordered Boosting</text>
      <text x={87} y={193} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Train hₜ on random permutation</text>
      <text x={87} y={206} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>→ prevents target leakage</text>
      <text x={87} y={219} textAnchor="middle" fontSize={7} fill={vt.textMuted}>in boosting residuals</text>

      <rect x={178} y={162} width={162} height={70} rx={6} fill={nb} stroke={vt.border} strokeWidth={1} />
      <text x={259} y={179} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={vt.text}>GPU Training</text>
      <text x={259} y={193} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Native GPU support</text>
      <text x={259} y={206} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Symmetric trees enable</text>
      <text x={259} y={219} textAnchor="middle" fontSize={7} fill={vt.textMuted}>efficient GPU computation</text>

      <rect x={350} y={162} width={184} height={70} rx={6}
        fill={`${accent}12`} stroke={`${accent}35`} strokeWidth={1.5} />
      <text x={442} y={179} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={accent}>Out-of-the-box</text>
      <text x={442} y={193} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>No manual cat encoding</text>
      <text x={442} y={206} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Great defaults, minimal tuning</text>
      <text x={442} y={219} textAnchor="middle" fontSize={7} fill={accent}>Best for categorical-heavy data</text>

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        CatBoost: ordered TS + symmetric trees + ordered boosting → top tabular performance out-of-box
      </text>
    </svg>
  );
}

// 25. BERT — bidirectional encoder
function BERTArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 280;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  const green = vt.isDark ? "#059669" : "#34d399";
  const purple = vt.isDark ? "#7c3aed" : "#8b5cf6";
  const blue = "#3b82f6";

  const tokens = ["[CLS]", "The", "cat", "[MASK]", "[SEP]"];
  const CELL_W = 72, CELL_H = 28, TOK_Y = 196;
  const totalW = tokens.length * CELL_W;
  const startX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-bert", ac)}

      {/* ── Title ── */}
      <text x={W/2} y={16} textAnchor="middle" fontSize={10} fill={accent} fontWeight="bold">
        BERT: Bidirectional Encoder Representations from Transformers
      </text>

      {/* ── Pre-training task cards (top row) ── */}
      <rect x={6} y={24} width={160} height={36} rx={6}
        fill={vt.isDark ? "#7f1d1d30" : "#fee2e220"} stroke="#ef4444" strokeWidth={1} />
      <text x={86} y={39} textAnchor="middle" fontSize={8.5} fill="#ef4444" fontWeight="bold">MLM: Masked LM</text>
      <text x={86} y={52} textAnchor="middle" fontSize={7.5} fill="#ef4444">predict [MASK] → rich token ctx</text>

      <rect x={W - 166} y={24} width={160} height={36} rx={6}
        fill={`${purple}20`} stroke={purple} strokeWidth={1} />
      <text x={W - 86} y={39} textAnchor="middle" fontSize={8.5} fill={purple} fontWeight="bold">NSP: Next Sentence</text>
      <text x={W - 86} y={52} textAnchor="middle" fontSize={7.5} fill={purple}>Is B the next sentence?</text>

      {/* ── Fine-tune note (centered between cards, no overlap) ── */}
      <text x={W/2} y={40} textAnchor="middle" fontSize={8.5} fill={accent} fontWeight="bold">
        Fine-tune: add task head on [CLS] output
      </text>

      {/* ── Transformer encoder block ── */}
      <rect x={startX - 10} y={72} width={totalW + 20} height={54} rx={8}
        fill={`${accent}10`} stroke={`${accent}35`} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={W/2} y={92} textAnchor="middle" fontSize={9} fill={accent} fontWeight="bold">
        Transformer Encoder × 12 layers (BERT-base)   |   × 24 (BERT-large)
      </text>
      <text x={W/2} y={107} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        MH-Self-Attention (12 heads, d=768) → Add&amp;Norm → FFN(768→3072→768) → Add&amp;Norm
      </text>
      <text x={W/2} y={119} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
        All tokens attend to ALL tokens simultaneously — no left-to-right mask (unlike GPT)
      </text>

      {/* ── Token embedding → encoder arrows ── */}
      {tokens.map((tok, i) => {
        const x = startX + i * CELL_W;
        return (
          <line key={`arr-${tok}`} x1={x + CELL_W/2} y1={TOK_Y} x2={x + CELL_W/2} y2={126}
            stroke={ac} strokeWidth={1} markerEnd="url(#arr-bert)" />
        );
      })}

      {/* ── Input tokens ── */}
      {tokens.map((tok, i) => {
        const x = startX + i * CELL_W;
        const isCLS  = tok === "[CLS]";
        const isMASK = tok === "[MASK]";
        const isSEP  = tok === "[SEP]";
        const bg = isCLS ? accent : isMASK ? "#ef4444" : isSEP ? purple : nb;
        const tc = isCLS || isMASK || isSEP ? textOn(bg) : vt.text;
        return (
          <g key={tok}>
            <rect x={x + 2} y={TOK_Y} width={CELL_W - 4} height={CELL_H} rx={5}
              fill={bg} stroke={isMASK ? "#ef4444" : "transparent"} strokeWidth={1.5} />
            <text x={x + CELL_W/2} y={TOK_Y + CELL_H/2 + 4}
              textAnchor="middle" fontSize={9} fontWeight="bold" fill={tc}>{tok}</text>
          </g>
        );
      })}

      {/* ── Bidirectional arrows between tokens ── */}
      {tokens.slice(0, -1).map((_, i) => {
        const x1 = startX + i * CELL_W + CELL_W - 4;
        const x2 = startX + (i+1) * CELL_W + 4;
        const my = TOK_Y + CELL_H + 10;
        return (
          <line key={i} x1={x1} y1={my} x2={x2} y2={my} stroke={blue} strokeWidth={1}
            markerEnd={`url(#arr-bert)`} markerStart={`url(#arr-bert)`} opacity={0.6} />
        );
      })}
      <text x={W/2} y={TOK_Y + CELL_H + 24} textAnchor="middle" fontSize={8} fill={blue}>
        ← bidirectional: every token sees every other token simultaneously →
      </text>

      {/* ── Token type labels ── */}
      <text x={startX + CELL_W/2} y={TOK_Y - 4} textAnchor="middle" fontSize={7} fill={accent}>[CLS] cls</text>
      <text x={startX + 3*CELL_W + CELL_W/2} y={TOK_Y - 4} textAnchor="middle" fontSize={7} fill="#ef4444">[MASK] ?</text>

      {/* ── Embedding types legend ── */}
      <text x={8} y={H - 18} fontSize={8} fill={vt.textMuted}>Token Emb + Segment Emb + Position Emb → input to encoder</text>
      <text x={W/2} y={H - 6} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        Pre-train (MLM+NSP) → fine-tune: add [CLS] head for classification, NER, QA…
      </text>
    </svg>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ArchDiagram({
  type,
  accentColor = "#6c63ff",
}: {
  type: ArchType;
  accentColor?: string;
}) {
  const vt = useVizTheme();

  const LABELS: Record<ArchType, string> = {
    "linear-regression":  "Linear & Logistic Regression Architecture",
    "decision-tree":      "Decision Tree Architecture",
    "random-forest":      "Random Forest Architecture",
    "gradient-boosting":  "Gradient Boosting Architecture",
    "xgboost":            "XGBoost Architecture",
    "lightgbm":           "LightGBM — Leaf-wise Growth",
    "catboost":           "CatBoost — Ordered Boosting + Symmetric Trees",
    "bagging":            "Bagging (Bootstrap Aggregating) Architecture",
    "svm":                "Support Vector Machine Geometry",
    "knn":                "K-Nearest Neighbors Algorithm",
    "svr":                "Support Vector Regression",
    "mlp":                "Multi-Layer Perceptron (MLP) Architecture",
    "cnn":                "Convolutional Neural Network Architecture",
    "resnet":             "ResNet — Residual Connections",
    "vit":                "Vision Transformer (ViT)",
    "transformer":        "Transformer Encoder Architecture",
    "bert":               "BERT — Bidirectional Encoder Representations",
    "rnn":                "RNN — Recurrent Neural Network",
    "lstm":               "LSTM Cell Architecture",
    "gru":                "GRU — Gated Recurrent Unit",
    "gan":                "GAN Training Loop",
    "vae":                "Variational Autoencoder (VAE)",
    "evaluation":         "Model Evaluation Pipeline",
    "bias-variance":      "Bias–Variance Decomposition",
    "multiclass":         "Multi-Class Classification Strategies",
  };

  const renderArch = () => {
    const props = { accent: accentColor, vt };
    switch (type) {
      case "linear-regression":  return <LinearRegressionArch {...props} />;
      case "decision-tree":      return <DecisionTreeArch {...props} />;
      case "random-forest":      return <RandomForestArch {...props} />;
      case "gradient-boosting":  return <GradientBoostingArch {...props} />;
      case "xgboost":            return <XGBoostArch {...props} />;
      case "lightgbm":           return <LightGBMArch {...props} />;
      case "catboost":           return <CatBoostArch {...props} />;
      case "bagging":            return <BaggingArch {...props} />;
      case "svm":                return <SVMArch {...props} />;
      case "knn":                return <KNNArch {...props} />;
      case "svr":                return <SVRArch {...props} />;
      case "mlp":                return <MLPArch {...props} />;
      case "cnn":                return <CNNArch {...props} />;
      case "resnet":             return <ResNetArch {...props} />;
      case "vit":                return <ViTArch {...props} />;
      case "transformer":        return <TransformerArch {...props} />;
      case "bert":               return <BERTArch {...props} />;
      case "rnn":                return <RNNArch {...props} />;
      case "lstm":               return <LSTMArch {...props} />;
      case "gru":                return <GRUArch {...props} />;
      case "gan":                return <GANArch {...props} />;
      case "vae":                return <VAEArch {...props} />;
      case "evaluation":         return <EvaluationArch {...props} />;
      case "bias-variance":      return <BiasVarianceArch {...props} />;
      case "multiclass":         return <MulticlassArch {...props} />;
      default:                   return <MLPArch {...props} />;
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="px-5 py-2.5 border-b flex items-center gap-2"
        style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-bold tracking-wide uppercase"
          style={{ color: accentColor }}>Architecture</span>
        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
          {LABELS[type]}
        </span>
      </div>
      <div className="p-4 overflow-x-auto">
        {renderArch()}
      </div>
    </div>
  );
}
