"use client";
import { ARROW_DEFS, Arrow, Box, textOn } from './primitives';
import type { VT } from './primitives';

// ── DecisionTreeArch, GradientBoostingArch, BaggingArch ──────────────────────

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
          {i < trees.length - 1 && (
            <>
              <Arrow x1={t.x + BW/2} y1={SY + BH}
                x2={t.x + BW/2} y2={120}
                color={arrowColor} markerId="arr-gb" />
              <text x={t.x + BW/2 + 5} y={100} fontSize={8} fill={vt.ink("#ff6b6b")}>r{i+1}=y-F{i}</text>
            </>
          )}
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
      <Arrow x1={466} y1={68} x2={466} y2={118} color={arrowColor} markerId="arr-gb" />
      <Arrow x1={430} y1={152} x2={500} y2={152} color={arrowColor} markerId="arr-gb" />
      <Box x={502} y={133} w={32} h={32}
        label="ŷ" bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        Gradient Boosting: Fₘ(x) = Fₘ₋₁(x) + η·hₘ(x)  where hₘ fits −∂L/∂Fₘ₋₁
      </text>
    </svg>
  );
}

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

export { DecisionTreeArch, GradientBoostingArch, BaggingArch };
