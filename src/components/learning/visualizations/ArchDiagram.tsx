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
  | "bagging"
  | "svm"
  | "knn"
  | "svr"
  | "mlp"
  | "cnn"
  | "resnet"
  | "vit"
  | "transformer"
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
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Linear: ŷ=Xᵀβ   Logistic: P(y=1|x)=σ(Xᵀβ)
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
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Decision Tree: recursive binary partitioning minimizing Gini impurity
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
  const W = 540, H = 195;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const BW = 80, BH = 36;
  const models = [
    { label: "Model 1",   sub: "Bootstrap₁", y: 28  },
    { label: "Model 2",   sub: "Bootstrap₂", y: 80  },
    { label: "Model 3",   sub: "Bootstrap₃", y: 132 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-bag", arrowColor)}

      {/* Dataset */}
      <Box x={8} y={80} w={68} h={36}
        label="Dataset" sublabel="N samples"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />

      {/* Bootstrap arrows */}
      {models.map((m, i) => (
        <g key={m.label}>
          <Arrow x1={76} y1={98} x2={112} y2={m.y + BH/2} color={arrowColor} markerId="arr-bag" />
          {/* Bootstrap label */}
          <text x={94} y={m.y + BH/2 - 3} fontSize={7} fill={vt.textMuted}>{m.sub}</text>
          <Box x={112} y={m.y} w={BW} h={BH}
            label={m.label} sublabel="(tree/etc)"
            bg={accent} textColor={textOn(accent)} rx={8} />
          {/* Prediction arrows */}
          <Arrow x1={112 + BW} y1={m.y + BH/2} x2={324} y2={98}
            color={arrowColor} markerId="arr-bag" />
          <text x={240} y={m.y + BH/2 - 3} fontSize={8} fill={vt.textMuted}>
            pred{i+1}
          </text>
        </g>
      ))}

      {/* "..." for more models */}
      <text x={152} y={175} textAnchor="middle" fontSize={13} fill={vt.textMuted}>⋮</text>

      {/* Aggregator */}
      <Box x={324} y={70} w={96} h={52}
        label="Aggregate" sublabel="Avg / Vote"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />
      <Arrow x1={420} y1={96} x2={460} y2={96} color={arrowColor} markerId="arr-bag" />

      {/* Output */}
      <Box x={460} y={78} w={62} h={36}
        label="ŷ final" sublabel="low variance"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Bagging: train B models on bootstrap samples → average predictions → low variance
      </text>
    </svg>
  );
}

// 5. SVM — hyperplane geometry
function SVMArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 200;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-svm", arrowColor)}

      {/* Feature space box */}
      <rect x={14} y={14} width={310} height={170} rx={10}
        fill={vt.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}
        stroke={vt.border} strokeWidth={1} />
      <text x={169} y={30} textAnchor="middle" fontSize={9} fill={vt.textMuted}>Feature Space</text>

      {/* Class+ points */}
      {[[60,60],[50,90],[80,75],[65,110],[90,55]].map(([px,py],i) => (
        <circle key={`p${i}`} cx={px} cy={py} r={8}
          fill={vt.isDark ? "#4c1d95" : "#7c3aed"} opacity={0.85} />
      ))}

      {/* Class- points */}
      {[[210,100],[230,130],[200,155],[255,115],[240,85]].map(([px,py],i) => (
        <circle key={`n${i}`} cx={px} cy={py} r={8}
          fill={vt.isDark ? "#7f1d1d" : "#dc2626"} opacity={0.85} />
      ))}

      {/* Decision boundary */}
      <line x1={130} y1={30} x2={170} y2={180} stroke={accent} strokeWidth={2.5} />
      {/* Margin boundaries */}
      <line x1={100} y1={30} x2={140} y2={180} stroke={accent} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5} />
      <line x1={160} y1={30} x2={200} y2={180} stroke={accent} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5} />

      {/* Margin bracket */}
      <Arrow x1={122} y1={105} x2={158} y2={115} color={accent} markerId="arr-svm" />
      <Arrow x1={158} y1={115} x2={122} y2={105} color={accent} markerId="arr-svm" />
      <text x={138} y={103} textAnchor="middle" fontSize={9} fill={accent} fontWeight="bold">2/‖w‖</text>

      {/* Support vector rings */}
      {[[110,90],[150,140],[165,80]].map(([px,py],i) => (
        <circle key={`sv${i}`} cx={px} cy={py} r={13}
          fill="none" stroke={accent} strokeWidth={2} opacity={0.6} />
      ))}
      <text x={169} y={184} textAnchor="middle" fontSize={8} fill={accent}>support vectors</text>

      {/* Optimization box */}
      <Box x={340} y={18} w={188} h={60}
        label="Primal Objective" sublabel="min ½‖w‖² + C Σ ξᵢ"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />
      <Box x={340} y={90} w={188} h={50}
        label="Kernel Trick" sublabel="K(xᵢ,xⱼ) = φ(xᵢ)ᵀφ(xⱼ)"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Box x={340} y={152} w={188} h={38}
        label="Decision: sign(wᵀx + b)"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      <text x={W/2} y={H - 2} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        SVM: maximize margin 2/‖w‖ — only support vectors define the boundary
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
  const W = 540, H = 175;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-svr", arrowColor)}

      {/* Feature space */}
      <rect x={14} y={18} width={310} height={140} rx={10}
        fill={vt.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}
        stroke={vt.border} strokeWidth={1} />

      {/* Regression line */}
      <line x1={30} y1={130} x2={310} y2={40} stroke={accent} strokeWidth={2.5} />
      {/* Tube boundaries */}
      <line x1={30} y1={110} x2={310} y2={20} stroke={accent} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.6} />
      <line x1={30} y1={150} x2={310} y2={60} stroke={accent} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.6} />
      {/* Tube fill */}
      <path d="M30,110 L310,20 L310,60 L30,150 Z" fill={accent} opacity={0.08} />

      {/* ε bracket */}
      <line x1={185} y1={66} x2={185} y2={80} stroke={accent} strokeWidth={1} />
      <line x1={185} y1={80} x2={185} y2={94} stroke={accent} strokeWidth={1} />
      <text x={196} y={83} fontSize={8} fill={accent}>ε-tube</text>

      {/* Data points */}
      {[[50,115],[80,100],[120,90],[160,78],[200,68],[240,58],[280,45]].map(([px,py],i) => (
        <circle key={`in${i}`} cx={px} cy={py} r={5}
          fill={vt.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"} />
      ))}
      {/* Support vectors outside tube */}
      {[[100,140],[260,22]].map(([px,py],i) => (
        <g key={`sv${i}`}>
          <circle cx={px} cy={py} r={6} fill="#ff6b6b" />
          <circle cx={px} cy={py} r={12} fill="none" stroke="#ff6b6b" strokeWidth={1.5} opacity={0.5} />
        </g>
      ))}

      {/* Info boxes */}
      <Box x={334} y={18} w={192} h={46}
        label="ε-insensitive loss" sublabel="L(y,ŷ) = max(0, |y−ŷ|−ε)"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Box x={334} y={76} w={192} h={46}
        label="Regularization" sublabel="min ½‖w‖² + C·Σξᵢ"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />
      <Box x={334} y={134} w={192} h={36}
        label="Support vectors drive fit"
        bg={vt.isDark ? "#7f1d1d" : "#fee2e2"} textColor={vt.isDark ? "#fff" : "#7f1d1d"} rx={8} />

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        SVR: fit within ε-tube · points outside (support vectors) penalized by C
      </text>
    </svg>
  );
}

// 8. MLP — multi-layer perceptron
function MLPArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 200;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
  const layers = [
    { label: "Input",    n: 3, color: vt.isDark ? "#475569" : "#94a3b8",  x: 50  },
    { label: "Hidden₁",  n: 5, color: accent,                             x: 170 },
    { label: "Hidden₂",  n: 5, color: accent,                             x: 310 },
    { label: "Output",   n: 3, color: vt.isDark ? "#059669" : "#34d399",  x: 450 },
  ];
  const R = 13, CY = 90;
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
          <text x={lay.x} y={H - 28} textAnchor="middle" fontSize={9} fill={vt.text} fontWeight="bold">
            {lay.label}
          </text>
          <text x={lay.x} y={H - 15} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
            {lay.n} units
          </text>
          {acts[li] && (
            <text x={lay.x} y={H - 2} textAnchor="middle" fontSize={8}
              fill={accent} fontFamily="monospace">{acts[li]}</text>
          )}
        </g>
      ))}
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
        <g key={b.label}>
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
        CNN: local feature extraction → spatial pooling → classification
      </text>
    </svg>
  );
}

// 10. Transformer Encoder
function TransformerArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 290;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const BW = 160, CX = W / 2, BX = CX - BW / 2, BH = 36;
  const neutralBg = vt.isDark ? "#374151" : "#e2e8f0";
  const neutralTxt = vt.text;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-tr", arrowColor)}

      {/* Input embedding */}
      <Box x={BX} y={250} w={BW} h={BH}
        label="Token Embedding" sublabel="+ Positional Encoding"
        bg={neutralBg} textColor={neutralTxt} rx={8} />
      <Arrow x1={CX} y1={250} x2={CX} y2={236} color={arrowColor} markerId="arr-tr" />

      {/* Encoder block border */}
      <rect x={BX - 22} y={98} width={BW + 44} height={136} rx={10}
        fill={`${accent}08`} stroke={`${accent}35`} strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={BX + BW + 28} y={168} textAnchor="start" fontSize={10}
        fill={accent} fontWeight="bold">×N</text>

      {/* Add & Norm 2 */}
      <Box x={BX} y={100} w={BW} h={30}
        label="Add & LayerNorm" bg={neutralBg} textColor={neutralTxt} rx={6} />
      <Arrow x1={CX} y1={100} x2={CX} y2={90} color={arrowColor} markerId="arr-tr" />

      {/* FFN */}
      <Box x={BX} y={136} w={BW} h={BH}
        label="Feed-Forward" sublabel="2×Linear + ReLU"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />
      <Arrow x1={CX} y1={136} x2={CX} y2={130} color={arrowColor} markerId="arr-tr" />

      {/* Add & Norm 1 */}
      <Box x={BX} y={178} w={BW} h={30}
        label="Add & LayerNorm" bg={neutralBg} textColor={neutralTxt} rx={6} />
      <Arrow x1={CX} y1={178} x2={CX} y2={172} color={arrowColor} markerId="arr-tr" />

      {/* Multi-Head Attention */}
      <Box x={BX} y={214} w={BW} h={BH}
        label="Multi-Head Attention" sublabel="Q, K, V projections"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={CX} y1={214} x2={CX} y2={208} color={arrowColor} markerId="arr-tr" />

      {/* Output */}
      <Arrow x1={CX} y1={98} x2={CX} y2={84} color={arrowColor} markerId="arr-tr" />
      <Box x={BX} y={52} w={BW} h={30}
        label="Linear + Softmax" bg={vt.isDark ? "#059669" : "#34d399"}
        textColor={textOn("#34d399")} rx={8} />

      {/* Residual connections */}
      {[[218, 176], [174, 130]].map(([y1, y2], i) => (
        <path key={i}
          d={`M ${BX - 10} ${y1} L ${BX - 22} ${y1} L ${BX - 22} ${y2} L ${BX - 10} ${y2}`}
          fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,2" />
      ))}
      <text x={BX - 28} y={168} fontSize={8} fill="#f59e0b"
        transform={`rotate(-90,${BX-28},168)`}>skip</text>

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        Transformer Encoder: attention is O(n²) but parallelizable — no recurrence
      </text>
    </svg>
  );
}

// 11. LSTM cell
function LSTMArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 210;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const GATE_W = 82, GATE_H = 42;
  const TRACK_Y = 50;
  const GATE_Y = 100;

  const gates = [
    { label: "Forget fₜ",  eq: "σ(Wf·[h,x]+bf)", color: "#ef4444", x: 70  },
    { label: "Input iₜ",   eq: "σ(Wi·[h,x]+bi)", color: "#f59e0b", x: 190 },
    { label: "Cell g̃ₜ",    eq: "tanh(Wg·[h,x])", color: accent,    x: 310 },
    { label: "Output oₜ",  eq: "σ(Wo·[h,x]+bo)", color: "#a855f7", x: 430 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-lstm", arrowColor)}

      {/* Cell state track */}
      <rect x={20} y={TRACK_Y - 12} width={W - 40} height={24} rx={12}
        fill={vt.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
        stroke={vt.border} strokeWidth={1.5} />
      <text x={22} y={TRACK_Y + 4} fontSize={9} fill={vt.textMuted} fontWeight="bold">Cₜ₋₁</text>
      <text x={85} y={TRACK_Y + 4} fontSize={14} fill="#ef4444" opacity={0.9}>×</text>
      <text x={208} y={TRACK_Y + 4} fontSize={14} fill="#f59e0b" opacity={0.9}>+</text>
      <text x={W - 44} y={TRACK_Y + 4} fontSize={9} fill={vt.textMuted} fontWeight="bold">Cₜ</text>

      {/* Gate boxes */}
      {gates.map(g => (
        <g key={g.label}>
          <rect x={g.x - GATE_W/2} y={GATE_Y} width={GATE_W} height={GATE_H} rx={8}
            fill={`${g.color}1c`} stroke={g.color} strokeWidth={1.5} />
          <text x={g.x} y={GATE_Y + 15} textAnchor="middle" fontSize={9}
            fontWeight="bold" fill={g.color}>{g.label}</text>
          <text x={g.x} y={GATE_Y + 30} textAnchor="middle" fontSize={7}
            fill={g.color} fontFamily="monospace">
            {g.eq.length > 18 ? g.eq.slice(0, 17) + "…" : g.eq}
          </text>
          {/* Arrow from gate to cell track */}
          <Arrow x1={g.x} y1={GATE_Y} x2={g.x} y2={TRACK_Y + 12}
            color={g.color} markerId="arr-lstm" />
        </g>
      ))}

      {/* Hidden state + input row */}
      <rect x={16} y={156} width={W - 32} height={26} rx={8}
        fill={vt.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}
        stroke={vt.border} strokeWidth={1} />
      <text x={W/2} y={173} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Shared input: [hₜ₋₁, xₜ]   →   fed to all 4 gates
      </text>
      {gates.map(g => (
        <Arrow key={`inp-${g.label}`} x1={g.x} y1={156}
          x2={g.x} y2={GATE_Y + GATE_H}
          color={arrowColor} markerId="arr-lstm" />
      ))}

      {/* Output */}
      <Box x={380} y={155} w={130} h={30}
        label="hₜ = oₜ · tanh(Cₜ)"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        LSTM: cell state Cₜ = fₜ·Cₜ₋₁ + iₜ·g̃ₜ   hₜ = oₜ·tanh(Cₜ)
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

// 15. Multiclass (OvA / OvO) — fixed text layout
function MulticlassArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 210;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-mc", arrowColor)}

      {/* Input */}
      <Box x={8} y={82} w={64} h={40} label="Input x" sublabel="features"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />

      {/* ── OvA section ─────────── */}
      <rect x={76} y={14} width={170} height={170} rx={8}
        fill={`${accent}06`} stroke={`${accent}20`} strokeWidth={1} strokeDasharray="4,3" />
      <text x={161} y={30} textAnchor="middle" fontSize={9} fill={accent} fontWeight="bold">
        One-vs-All (OvA)
      </text>
      {["A","B","C"].map((c, i) => {
        const y = 38 + i * 46;
        return (
          <g key={`ova-${c}`}>
            <Arrow x1={72} y1={102} x2={86} y2={y + 17} color={arrowColor} markerId="arr-mc" />
            <Box x={86} y={y} w={96} h={34}
              label={`Class ${c} vs Rest`}
              bg={accent} textColor={textOn(accent)} rx={6} />
            <text x={192} y={y + 22} fontSize={8} fill={vt.textMuted}>P(y={c}|x)</text>
          </g>
        );
      })}
      <Arrow x1={202} y1={102} x2={250} y2={102} color={arrowColor} markerId="arr-mc" />
      <Box x={250} y={82} w={80} h={40} label="argmax" sublabel="→ class label"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#34d399")} rx={8} />

      {/* ── OvO section ─────────── */}
      <rect x={290} y={14} width={170} height={170} rx={8}
        fill={`${vt.isDark ? "#7c3aed" : "#8b5cf6"}08`}
        stroke={`${vt.isDark ? "#7c3aed" : "#8b5cf6"}25`} strokeWidth={1} strokeDasharray="4,3" />
      <text x={375} y={30} textAnchor="middle" fontSize={9}
        fill={vt.isDark ? "#7c3aed" : "#8b5cf6"} fontWeight="bold">
        One-vs-One (OvO)
      </text>
      {[["A","B"],["A","C"],["B","C"]].map(([c1,c2], i) => {
        const y = 38 + i * 46;
        return (
          <g key={`ovo-${c1}${c2}`}>
            <Box x={296} y={y} w={86} h={34}
              label={`${c1}  vs  ${c2}`}
              bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={6} />
            <Arrow x1={382} y1={y + 17} x2={416} y2={102} color={arrowColor} markerId="arr-mc" />
          </g>
        );
      })}
      <Box x={416} y={82} w={84} h={40} label="Majority" sublabel={`Vote (3 cls)`}
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#34d399")} rx={8} />

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        OvA: C binary classifiers · OvO: C(C-1)/2 classifiers · Softmax: direct C-class output
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

// 17. XGBoost — gradient + hessian + regularized objective
function XGBoostArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 185;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-xgb", ac)}
      <Box x={6} y={68} w={66} h={44} label="Data" sublabel="(x, y)"
        bg={nb} textColor={vt.text} rx={8} />
      <Arrow x1={72} y1={90} x2={96} y2={90} color={ac} markerId="arr-xgb" />
      <Box x={96} y={56} w={110} h={68}
        label="Gradient & Hessian" sublabel="gᵢ=∂L/∂F · hᵢ=∂²L/∂F²"
        bg={nb} textColor={vt.text} rx={8} />
      <Arrow x1={206} y1={90} x2={226} y2={90} color={ac} markerId="arr-xgb" />
      <Box x={226} y={44} w={118} h={92}
        label="Reg. Objective" sublabel={"Σ[gᵢfₜ+½hᵢfₜ²]+γT+½λ‖w‖²"}
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={344} y1={90} x2={366} y2={90} color={ac} markerId="arr-xgb" />
      <Box x={366} y={56} w={80} h={68}
        label="Histogram Split" sublabel="bin features for speed"
        bg={nb} textColor={vt.text} rx={8} />
      <Arrow x1={446} y1={90} x2={470} y2={90} color={ac} markerId="arr-xgb" />
      <Box x={470} y={72} w={60} h={36}
        label="Tree hₜ" sublabel="→ F+=η·h"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />
      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        XGBoost: Newton boosting with exact gradient + hessian · L1/L2 regularization · column subsampling
      </text>
    </svg>
  );
}

// 18. LightGBM — leaf-wise growth vs level-wise
function LightGBMArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 200;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-lgb", ac)}
      {/* Level-wise */}
      <text x={130} y={18} textAnchor="middle" fontSize={9} fill={vt.textMuted} fontWeight="bold">
        Level-wise (XGBoost)
      </text>
      {/* root → 2 children → 4 grandchildren */}
      <rect x={110} y={24} width={40} height={22} rx={4} fill={nb} stroke={vt.border} strokeWidth={1} />
      <text x={130} y={39} textAnchor="middle" fontSize={9} fill={vt.text}>Root</text>
      {[60, 160].map((cx2, i) => (
        <g key={i}>
          <line x1={130} y1={46} x2={cx2} y2={62} stroke={ac} strokeWidth={1} />
          <rect x={cx2 - 24} y={62} width={48} height={20} rx={4}
            fill={nb} stroke={vt.border} strokeWidth={1} />
          <text x={cx2} y={76} textAnchor="middle" fontSize={8} fill={vt.text}>Level 1</text>
          {[cx2 - 16, cx2 + 16].map((cx3, j) => (
            <g key={j}>
              <line x1={cx2} y1={82} x2={cx3} y2={98} stroke={ac} strokeWidth={1} />
              <rect x={cx3 - 14} y={98} width={28} height={18} rx={3}
                fill={nb} stroke={vt.border} strokeWidth={1} />
              <text x={cx3} y={111} textAnchor="middle" fontSize={7} fill={vt.text}>L2</text>
            </g>
          ))}
        </g>
      ))}

      {/* LightGBM leaf-wise */}
      <text x={400} y={18} textAnchor="middle" fontSize={9} fill={accent} fontWeight="bold">
        Leaf-wise (LightGBM)
      </text>
      <rect x={380} y={24} width={40} height={22} rx={4}
        fill={accent + "30"} stroke={accent} strokeWidth={1.5} />
      <text x={400} y={39} textAnchor="middle" fontSize={9} fill={accent} fontWeight="bold">Root</text>
      {/* Best-gain leaf split */}
      <line x1={400} y1={46} x2={365} y2={62} stroke={accent} strokeWidth={1.5} />
      <rect x={341} y={62} width={48} height={20} rx={4}
        fill={accent + "30"} stroke={accent} strokeWidth={1.5} />
      <text x={365} y={76} textAnchor="middle" fontSize={8} fill={accent} fontWeight="bold">Best</text>
      <line x1={400} y1={46} x2={435} y2={62} stroke={ac} strokeWidth={1} />
      <rect x={411} y={62} width={48} height={20} rx={4}
        fill={nb} stroke={vt.border} strokeWidth={1} />
      <text x={435} y={76} textAnchor="middle" fontSize={8} fill={vt.text}>other</text>
      {/* Best leaf splits again */}
      <line x1={365} y1={82} x2={350} y2={98} stroke={accent} strokeWidth={1.5} />
      <rect x={326} y={98} width={48} height={20} rx={4}
        fill={accent + "30"} stroke={accent} strokeWidth={1.5} />
      <text x={350} y={112} textAnchor="middle" fontSize={8} fill={accent} fontWeight="bold">Best²</text>
      <line x1={365} y1={82} x2={380} y2={98} stroke={ac} strokeWidth={1} />
      <rect x={356} y={98} width={48} height={20} rx={4}
        fill={nb} stroke={vt.border} strokeWidth={1} />
      <text x={380} y={112} textAnchor="middle" fontSize={8} fill={vt.text}>other</text>

      {/* Features */}
      <Box x={60} y={140} w={150} h={36} label="GOSS: keep large-gradient samples"
        bg={nb} textColor={vt.text} rx={6} />
      <Box x={220} y={140} w={140} h={36} label="EFB: bundle sparse features"
        bg={accent} textColor={textOn(accent)} rx={6} />
      <Box x={370} y={140} w={112} h={36} label="Histogram binning"
        bg={nb} textColor={vt.text} rx={6} />

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        LightGBM: leaf-wise growth + GOSS + EFB → faster training, comparable accuracy to XGBoost
      </text>
    </svg>
  );
}

// 19. RNN — unrolled recurrent cell
function RNNArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 185;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const tokens = ["x₁", "x₂", "x₃", "x₄"];
  const NW = 64, NH = 38, CY = 90;
  const spacing = (W - 48 - tokens.length * NW) / (tokens.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-rnn", ac)}
      {/* Initial hidden state */}
      <Box x={6} y={CY - NH / 2} w={38} h={NH} label="h₀" sublabel="zeros"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={6} />
      <Arrow x1={44} y1={CY} x2={60} y2={CY} color={ac} markerId="arr-rnn" />

      {tokens.map((tok, i) => {
        const cx = 60 + i * (NW + spacing) + NW / 2;
        return (
          <g key={tok}>
            {/* Hidden cell */}
            <Box x={cx - NW / 2} y={CY - NH / 2} w={NW} h={NH}
              label={`h${i + 1}`} sublabel={tok}
              bg={accent} textColor={textOn(accent)} rx={8} />
            {/* Input arrow (from below) */}
            <Arrow x1={cx} y1={CY + NH / 2 + 28} x2={cx} y2={CY + NH / 2}
              color={ac} markerId="arr-rnn" />
            <text x={cx} y={CY + NH / 2 + 42} textAnchor="middle" fontSize={9}
              fill={vt.textMuted} fontStyle="italic">{tok}</text>
            {/* Output arrow (above) */}
            <Arrow x1={cx} y1={CY - NH / 2} x2={cx} y2={CY - NH / 2 - 22}
              color={ac} markerId="arr-rnn" />
            <text x={cx} y={CY - NH / 2 - 28} textAnchor="middle" fontSize={9}
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
      <text x={W - 24} y={CY + 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>→ …</text>

      {/* Formula */}
      <rect x={20} y={H - 28} width={W - 40} height={20} rx={6}
        fill={vt.surface} />
      <text x={W / 2} y={H - 14} textAnchor="middle" fontSize={9} fill={vt.text}
        fontFamily="monospace">
        hₜ = tanh(Wₓ·xₜ + Wₕ·hₜ₋₁ + b)    yₜ = Wᵧ·hₜ
      </text>
      <text x={W / 2} y={H - 2} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        RNN: shared weights across all timesteps — vanishing gradient problem at long sequences
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

// 21. ResNet — skip connections
function ResNetArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 200;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  const BH = 36, BY = 60;

  const blocks = [
    { label: "Conv 3×3", sub: "BN + ReLU", x: 82,  bg: accent },
    { label: "Conv 3×3", sub: "BN",         x: 200, bg: accent },
    { label: "+",         sub: "merge",     x: 320, bg: vt.isDark ? "#059669" : "#34d399", w: 36 },
    { label: "ReLU",      sub: "output",   x: 390, bg: vt.isDark ? "#7c3aed" : "#8b5cf6" },
  ];

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

      {/* Skip connection arc */}
      <path d={`M 72 ${BY + BH/2 - 4} C 72 ${BY - 30}, 316 ${BY - 30}, 316 ${BY + BH/2 - 4}`}
        fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,3" />
      <text x={194} y={BY - 14} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight="bold">
        Identity shortcut: x
      </text>
      <Arrow x1={316} y1={BY - 4} x2={320} y2={BY} color="#f59e0b" markerId="arr-res" />

      {/* ResNet depth variants */}
      {[
        { label: "ResNet-18",  sub: "18 layers", x: 50,  bg: nb },
        { label: "ResNet-50",  sub: "bottleneck", x: 186, bg: accent },
        { label: "ResNet-152", sub: "deep",       x: 322, bg: accent },
        { label: "ResNeXt",    sub: "+ grouped",  x: 446, bg: nb },
      ].map(v => (
        <Box key={v.label} x={v.x} y={140} w={110} h={32}
          label={v.label} sublabel={v.sub}
          bg={v.bg} textColor={textOn(v.bg)} rx={6} />
      ))}

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        ResNet: F(x)+x — skip connections solve vanishing gradients, enable training 100s of layers
      </text>
    </svg>
  );
}

// 22. ViT — Vision Transformer
function ViTArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 190;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-vit", ac)}

      {/* Image → patches */}
      <rect x={8} y={60} width={48} height={48} rx={4}
        fill={accent + "25"} stroke={accent} strokeWidth={1.5} />
      <text x={32} y={82} textAnchor="middle" fontSize={8} fill={accent} fontWeight="bold">Image</text>
      <text x={32} y={95} textAnchor="middle" fontSize={7} fill={accent}>H×W×C</text>
      {/* Patch grid lines */}
      {[16,32].map(o => (
        <g key={o}>
          <line x1={8} y1={60 + o} x2={56} y2={60 + o} stroke={accent} strokeWidth={0.5} opacity={0.5} />
          <line x1={8 + o} y1={60} x2={8 + o} y2={108} stroke={accent} strokeWidth={0.5} opacity={0.5} />
        </g>
      ))}

      <Arrow x1={56} y1={84} x2={76} y2={84} color={ac} markerId="arr-vit" />
      <Box x={76} y={64} w={84} h={40} label="Flatten Patches" sublabel="N×(P²·C)"
        bg={nb} textColor={vt.text} rx={8} />
      <Arrow x1={160} y1={84} x2={178} y2={84} color={ac} markerId="arr-vit" />
      <Box x={178} y={64} w={76} h={40} label="Linear Embed" sublabel="Proj to D"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={254} y1={84} x2={272} y2={84} color={ac} markerId="arr-vit" />

      {/* [CLS] + Pos embed */}
      <Box x={272} y={50} w={78} h={68}
        label="[CLS] + Pos" sublabel="E_pos added to each token"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />
      <Arrow x1={350} y1={84} x2={368} y2={84} color={ac} markerId="arr-vit" />

      {/* Transformer encoder */}
      <Box x={368} y={44} w={80} h={80}
        label="Transformer" sublabel={"Encoder × L\nMHSA + FFN"}
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={448} y1={84} x2={464} y2={84} color={ac} markerId="arr-vit" />

      {/* Classification head */}
      <Box x={464} y={60} w={66} h={48}
        label="[CLS]" sublabel="MLP → class"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      {/* Patch size notes */}
      <text x={W/2} y={148} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Patch size 16×16: 224×224 image → 196 patches + 1 [CLS] = 197 tokens
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
    "bagging":            "Bagging (Bootstrap Aggregating) Architecture",
    "svm":                "Support Vector Machine Geometry",
    "knn":                "K-Nearest Neighbors Algorithm",
    "svr":                "Support Vector Regression",
    "mlp":                "Multi-Layer Perceptron (MLP) Architecture",
    "cnn":                "Convolutional Neural Network Architecture",
    "resnet":             "ResNet — Residual Connections",
    "vit":                "Vision Transformer (ViT)",
    "transformer":        "Transformer Encoder Architecture",
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
      case "bagging":            return <BaggingArch {...props} />;
      case "svm":                return <SVMArch {...props} />;
      case "knn":                return <KNNArch {...props} />;
      case "svr":                return <SVRArch {...props} />;
      case "mlp":                return <MLPArch {...props} />;
      case "cnn":                return <CNNArch {...props} />;
      case "resnet":             return <ResNetArch {...props} />;
      case "vit":                return <ViTArch {...props} />;
      case "transformer":        return <TransformerArch {...props} />;
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
