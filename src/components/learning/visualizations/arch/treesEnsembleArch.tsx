"use client";
import { ARROW_DEFS, Arrow, Box, textOn } from './primitives';
import type { VT } from './primitives';

// ── RandomForestArch, XGBoostArch, LightGBMArch, CatBoostArch ────────────────

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
      <text x={140} y={12} textAnchor="middle" fontSize={9} fill={vt.ink(accent)} fontWeight="bold">
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

      <text x={LCX + LW / 2} y={218} textAnchor="middle" fontSize={8} fill={vt.ink("#f59e0b")}>
        ↺  repeat t = 1…T  →  final prediction: sum of all trees
      </text>

      {/* ── Right: 3 innovation cards ── */}

      {/* Card 1 — Newton Step */}
      <rect x={228} y={8} width={306} height={66} rx={8}
        fill={`${accent}12`} stroke={`${accent}40`} strokeWidth={1.5} />
      <text x={240} y={24} fontSize={9} fontWeight="bold" fill={vt.ink(accent)}>⚡ Newton Step (2nd-order)</text>
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

function LightGBMArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 252;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  const NW = 40, NH = 20;

  const lv = [
    { cx: 130, y: 28 },
    { cx:  88, y: 60 }, { cx: 172, y: 60 },
    { cx:  62, y: 94 }, { cx: 110, y: 94 }, { cx: 152, y: 94 }, { cx: 198, y: 94 },
  ];
  const lvEdges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

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

      <text x={130} y={13} textAnchor="middle" fontSize={9} fill={vt.textMuted} fontWeight="bold">
        Level-wise (XGBoost style)
      </text>
      <text x={400} y={13} textAnchor="middle" fontSize={9} fill={vt.ink(accent)} fontWeight="bold">
        Leaf-wise (LightGBM) ← faster
      </text>

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

      <line x1={272} y1={6} x2={272} y2={135} stroke={vt.border} strokeWidth={1} strokeDasharray="3,3" />

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
      <text x={lf[1].cx} y={lf[1].y - 7} textAnchor="middle" fontSize={7} fill={vt.ink(accent)}>↓ max gain</text>
      <text x={400} y={118} textAnchor="middle" fontSize={7.5} fill={vt.ink(accent)}>
        Always split leaf with highest gain
      </text>
      <text x={400} y={129} textAnchor="middle" fontSize={7} fill={vt.ink(accent)}>
        → deeper, asymmetric, better accuracy
      </text>

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
      <text x={442} y={157} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.ink(accent)}>Histogram Binning</text>
      <text x={442} y={170} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>continuous → k discrete bins</text>
      <text x={442} y={183} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>O(n) → O(kd) split finding</text>
      <text x={442} y={196} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>subtraction trick from parent</text>
      <text x={442} y={207} textAnchor="middle" fontSize={7} fill={vt.ink(accent)}>→ 10–100× faster than exact</text>

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        LightGBM: leaf-wise growth + GOSS + EFB + histogram → faster, lower memory than XGBoost
      </text>
    </svg>
  );
}

function CatBoostArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 292;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  const green = vt.isDark ? "#059669" : "#34d399";
  const NW = 38, NH = 18;

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
      <rect x={6} y={8} width={252} height={124} rx={8}
        fill={`${accent}10`} stroke={`${accent}35`} strokeWidth={1.5} />
      <text x={132} y={24} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.ink(accent)}>
        ① Ordered Target Statistics
      </text>
      <text x={132} y={37} textAnchor="middle" fontSize={7.5} fill={vt.text}>
        Encode categoricals without target leakage
      </text>

      <rect x={16} y={42} width={232} height={36} rx={5}
        fill={vt.isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"} />
      <text x={132} y={55} textAnchor="middle" fontSize={7.5} fill={vt.text} fontFamily="monospace">
        TS(xᵢ) = Σ&#123;y_j: x_j=xᵢ, j&lt;i&#125; + a·prior
      </text>
      <text x={132} y={70} textAnchor="middle" fontSize={7} fill={vt.textMuted} fontFamily="monospace">
        count(x_j=xᵢ, j&lt;i) + a
      </text>

      <text x={16} y={92} fontSize={7.5} fill={vt.textMuted}>
        • Sample i uses ONLY targets from samples 1..i−1
      </text>
      <text x={16} y={104} fontSize={7.5} fill={vt.textMuted}>
        • Different ordering per boosting round
      </text>
      <text x={16} y={116} fontSize={7.5} fill={vt.textMuted}>
        • No manual one-hot / label encoding needed
      </text>
      <text x={16} y={128} fontSize={7.5} fill={vt.ink(accent)} fontWeight="bold">
        → prevents overfitting on high-cardinality cats
      </text>

      {/* ── Right: Symmetric (Oblivious) Tree ── */}
      <text x={400} y={16} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.text}>
        ② Symmetric (Oblivious) Tree
      </text>
      <text x={400} y={28} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
        same split condition at every node of the same level
      </text>

      <rect x={root.cx - NW / 2} y={root.y} width={NW} height={NH} rx={4} fill={accent} />
      <text x={root.cx} y={root.y + 12} textAnchor="middle" fontSize={7} fill={textOn(accent)} fontWeight="bold">x₁≤t₁</text>

      {l1.map((n, i) => (
        <g key={`cl1-${i}`}>
          <line x1={root.cx} y1={root.y + NH} x2={n.cx} y2={n.y} stroke={ac} strokeWidth={1} />
          <rect x={n.cx - NW / 2} y={n.y} width={NW} height={NH} rx={4} fill={accent} />
          <text x={n.cx} y={n.y + 12} textAnchor="middle" fontSize={7} fill={textOn(accent)} fontWeight="bold">x₂≤t₂</text>
        </g>
      ))}
      <line x1={368 + NW / 2} y1={109} x2={432 - NW / 2} y2={109}
        stroke="#f59e0b" strokeWidth={1} strokeDasharray="3,2" />
      <text x={400} y={107} textAnchor="middle" fontSize={6.5} fill={vt.ink("#f59e0b")}>same!</text>

      {l2.map((n, i) => (
        <g key={`cl2-${i}`}>
          <line x1={l1[Math.floor(i / 2)].cx} y1={l1[Math.floor(i / 2)].y + NH}
            x2={n.cx} y2={n.y} stroke={ac} strokeWidth={1} />
          <rect x={n.cx - NW / 2} y={n.y} width={NW} height={NH} rx={4} fill={green} />
          <text x={n.cx} y={n.y + 12} textAnchor="middle" fontSize={7} fill={textOn(green)}>w{i + 1}</text>
        </g>
      ))}
      <text x={400} y={154} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
        → O(depth) prediction · regularization effect
      </text>

      {/* ── Bottom cards ── */}
      <rect x={6} y={170} width={162} height={70} rx={6} fill={nb} stroke={vt.border} strokeWidth={1} />
      <text x={87} y={187} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={vt.text}>③ Ordered Boosting</text>
      <text x={87} y={201} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Train hₜ on random permutation</text>
      <text x={87} y={214} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>→ prevents target leakage</text>
      <text x={87} y={227} textAnchor="middle" fontSize={7} fill={vt.textMuted}>in boosting residuals</text>

      <rect x={178} y={170} width={162} height={70} rx={6} fill={nb} stroke={vt.border} strokeWidth={1} />
      <text x={259} y={187} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={vt.text}>GPU Training</text>
      <text x={259} y={201} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Native GPU support</text>
      <text x={259} y={214} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Symmetric trees enable</text>
      <text x={259} y={227} textAnchor="middle" fontSize={7} fill={vt.textMuted}>efficient GPU computation</text>

      <rect x={350} y={170} width={184} height={70} rx={6}
        fill={`${accent}12`} stroke={`${accent}35`} strokeWidth={1.5} />
      <text x={442} y={187} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={vt.ink(accent)}>Out-of-the-box</text>
      <text x={442} y={201} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>No manual cat encoding</text>
      <text x={442} y={214} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Great defaults, minimal tuning</text>
      <text x={442} y={227} textAnchor="middle" fontSize={7} fill={vt.ink(accent)}>Best for categorical-heavy data</text>

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        CatBoost: ordered TS + symmetric trees + ordered boosting → top tabular performance out-of-box
      </text>
    </svg>
  );
}

export { RandomForestArch, XGBoostArch, LightGBMArch, CatBoostArch };
