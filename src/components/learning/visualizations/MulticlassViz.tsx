"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const MC_LABELS = {
  en: {
    title: "Multiclass — OvA vs OvO Strategies",
    ovaSubtitle: "3 binary classifiers (each class vs rest)",
    ovoSubtitle: "3 pairwise classifiers (C(3,2) = 3 pairs)",
    classNames: ["Class A", "Class B", "Class C"] as readonly string[],
    vsRest: "vs Rest",
    ovaInfo: "3 classifiers",
    ovoInfo: "3 pairwise",
    hoverHint: "hover to highlight",
  },
  fr: {
    title: "Multiclasse — Stratégies OvA vs OvO",
    ovaSubtitle: "3 classifieurs binaires (chaque classe contre le reste)",
    ovoSubtitle: "3 classifieurs par paires (C(3,2) = 3 paires)",
    classNames: ["Classe A", "Classe B", "Classe C"] as readonly string[],
    vsRest: "vs Reste",
    ovaInfo: "3 classifieurs",
    ovoInfo: "3 paires",
    hoverHint: "survoler pour mettre en évidence",
  },
  ar: {
    title: "متعدد الأصناف — استراتيجيات OvA مقابل OvO",
    ovaSubtitle: "3 مصنّفات ثنائية (كل صنف ضد الباقي)",
    ovoSubtitle: "3 مصنّفات زوجية (C(3,2) = 3 أزواج)",
    classNames: ["صنف A", "صنف B", "صنف C"] as readonly string[],
    vsRest: "ضد الباقي",
    ovaInfo: "3 مصنّفات",
    ovoInfo: "3 أزواج",
    hoverHint: "مرر الماوس للإبراز",
  },
} as const;

const W = 520, H = 300, PAD = 36;

type Strategy = "ova" | "ovo";

const CLASS_COLORS = ["#6c63ff", "#00d4aa", "#ff6b6b"];

// Three Gaussian clusters
const CLUSTERS = [
  { cx: 2.5, cy: 7.5, color: CLASS_COLORS[0], label: 0 },
  { cx: 7.5, cy: 7.0, color: CLASS_COLORS[1], label: 1 },
  { cx: 5.0, cy: 2.5, color: CLASS_COLORS[2], label: 2 },
];

const SEED = (i: number) => (Math.sin(i * 17.3 + 5.1) * 0.5 + 0.5);

const DATA = CLUSTERS.flatMap((cl, ci) =>
  Array.from({ length: 12 }, (_, i) => ({
    x: cl.cx + (SEED(ci * 100 + i) - 0.5) * 3,
    y: cl.cy + (SEED(ci * 100 + i + 50) - 0.5) * 3,
    label: cl.label,
    color: cl.color,
  }))
).map(p => ({
  ...p,
  x: Math.max(0.2, Math.min(9.8, p.x)),
  y: Math.max(0.2, Math.min(9.8, p.y)),
}));

// OvA: linear boundary for each class vs rest (simplified)
function ovaLine(classIdx: number): { x1: number; y1: number; x2: number; y2: number } {
  const cl = CLUSTERS[classIdx];
  const others = CLUSTERS.filter((_, i) => i !== classIdx);
  const otherMx = others.reduce((s, c) => s + c.cx, 0) / others.length;
  const otherMy = others.reduce((s, c) => s + c.cy, 0) / others.length;

  // Boundary is perpendicular bisector of center and other cluster mean
  const mx = (cl.cx + otherMx) / 2;
  const my = (cl.cy + otherMy) / 2;
  const dx = cl.cx - otherMx;
  const dy = cl.cy - otherMy;
  // Normal direction: (dy, -dx)
  const len = 6;
  return {
    x1: mx + (dy / Math.sqrt(dx * dx + dy * dy)) * len,
    y1: my - (dx / Math.sqrt(dx * dx + dy * dy)) * len,
    x2: mx - (dy / Math.sqrt(dx * dx + dy * dy)) * len,
    y2: my + (dx / Math.sqrt(dx * dx + dy * dy)) * len,
  };
}

// OvO: boundary between pair of classes
function ovoPairs(): Array<{ a: number; b: number; line: { x1: number; y1: number; x2: number; y2: number } }> {
  const pairs: Array<{ a: number; b: number; line: ReturnType<typeof ovaLine> }> = [];
  for (let a = 0; a < 3; a++) {
    for (let b = a + 1; b < 3; b++) {
      const ca = CLUSTERS[a], cb = CLUSTERS[b];
      const mx = (ca.cx + cb.cx) / 2;
      const my = (ca.cy + cb.cy) / 2;
      const dx = ca.cx - cb.cx;
      const dy = ca.cy - cb.cy;
      const len = 5;
      const norm = Math.sqrt(dx * dx + dy * dy) || 1;
      pairs.push({
        a, b,
        line: {
          x1: mx + (dy / norm) * len,
          y1: my - (dx / norm) * len,
          x2: mx - (dy / norm) * len,
          y2: my + (dx / norm) * len,
        },
      });
    }
  }
  return pairs;
}

const toSVGX = (x: number) => PAD + (x / 10) * (W - 2 * PAD);
const toSVGY = (y: number) => H - PAD - (y / 10) * (H - 2 * PAD);

export default function MulticlassViz({ accentColor = "#f59e0b" }: { accentColor?: string }) {
  const [strategy, setStrategy] = useState<Strategy>("ova");
  const [activeClassifier, setActiveClassifier] = useState<number | null>(null);
  const vt = useVizTheme();
  const L = useVizLocale(MC_LABELS);
  const CLASS_NAMES = L.classNames;

  const ovaLines = useMemo(() => [0, 1, 2].map(i => ({ idx: i, ...ovaLine(i) })), []);
  const ovoPairsList = useMemo(() => ovoPairs(), []);

  const boundaries = strategy === "ova" ? ovaLines : ovoPairsList;

  return (
    <VizCard>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {strategy === "ova" ? L.ovaSubtitle : L.ovoSubtitle}
          </span>
        </div>
        <div className="flex gap-2">
          {(["ova", "ovo"] as const).map(s => (
            <button key={s} onClick={() => { setStrategy(s); setActiveClassifier(null); }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all uppercase"
              style={{
                backgroundColor: strategy === s ? `${accentColor}25` : "var(--bg-card)",
                color: strategy === s ? accentColor : "var(--text-muted)",
                border: `1px solid ${strategy === s ? accentColor + "50" : "var(--border)"}`,
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid */}
        {[2, 4, 6, 8].map(v => (
          <g key={v}>
            <line x1={toSVGX(v)} y1={PAD} x2={toSVGX(v)} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />
            <line x1={PAD} y1={toSVGY(v)} x2={W - PAD} y2={toSVGY(v)} stroke={vt.grid} strokeWidth={1} />
            <text x={toSVGX(v)} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{v}</text>
            <text x={PAD - 6} y={toSVGY(v) + 4} textAnchor="end" fontSize={9} fill={vt.textMuted}>{v}</text>
          </g>
        ))}

        {/* Cluster labels */}
        {CLUSTERS.map((cl, i) => (
          <g key={i}>
            <circle cx={toSVGX(cl.cx)} cy={toSVGY(cl.cy)} r={32}
              fill={cl.color} opacity={0.06} />
            <text x={toSVGX(cl.cx)} y={toSVGY(cl.cy) - 36}
              textAnchor="middle" fontSize={10} fill={cl.color} fontWeight="bold">
              {CLASS_NAMES[i]}
            </text>
          </g>
        ))}

        {/* Decision boundaries */}
        {strategy === "ova"
          ? ovaLines.map((line, i) => {
              const color = CLASS_COLORS[line.idx];
              const isActive = activeClassifier === i || activeClassifier === null;
              return (
                <motion.line
                  key={`ova-${i}`}
                  x1={toSVGX(line.x1)} y1={toSVGY(line.y1)}
                  x2={toSVGX(line.x2)} y2={toSVGY(line.y2)}
                  stroke={color}
                  strokeWidth={isActive ? 2.5 : 1}
                  strokeDasharray={isActive ? "none" : "4,4"}
                  opacity={isActive ? 0.85 : 0.3}
                  animate={{ opacity: isActive ? 0.85 : 0.3 }}
                  transition={{ duration: 0.25 }}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setActiveClassifier(i)}
                  onMouseLeave={() => setActiveClassifier(null)}
                />
              );
            })
          : ovoPairsList.map((pair, i) => {
              const colorA = CLASS_COLORS[pair.a];
              const colorB = CLASS_COLORS[pair.b];
              const isActive = activeClassifier === i || activeClassifier === null;
              return (
                <motion.line
                  key={`ovo-${i}`}
                  x1={toSVGX(pair.line.x1)} y1={toSVGY(pair.line.y1)}
                  x2={toSVGX(pair.line.x2)} y2={toSVGY(pair.line.y2)}
                  stroke={colorA}
                  strokeWidth={isActive ? 2.5 : 1}
                  opacity={isActive ? 0.85 : 0.3}
                  animate={{ opacity: isActive ? 0.85 : 0.3 }}
                  transition={{ duration: 0.25 }}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setActiveClassifier(i)}
                  onMouseLeave={() => setActiveClassifier(null)}
                />
              );
            })
        }

        {/* Data points */}
        {DATA.map((pt, i) => (
          <motion.circle
            key={i}
            cx={toSVGX(pt.x)} cy={toSVGY(pt.y)} r={6}
            fill={pt.color}
            stroke={vt.isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.8)"}
            strokeWidth={1.5}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.008 }}
          />
        ))}

        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
      </svg>

      {/* Classifier info */}
      <div className="px-5 py-3 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--border)" }}>
        {strategy === "ova"
          ? CLASS_NAMES.map((name, i) => (
              <button key={i}
                onMouseEnter={() => setActiveClassifier(i)}
                onMouseLeave={() => setActiveClassifier(null)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: `${CLASS_COLORS[i]}18`,
                  color: CLASS_COLORS[i],
                  border: `1px solid ${CLASS_COLORS[i]}40`,
                }}>
                {name} {L.vsRest}
              </button>
            ))
          : ovoPairsList.map((pair, i) => (
              <button key={i}
                onMouseEnter={() => setActiveClassifier(i)}
                onMouseLeave={() => setActiveClassifier(null)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: `${CLASS_COLORS[pair.a]}15`,
                  color: CLASS_COLORS[pair.a],
                  border: `1px solid ${CLASS_COLORS[pair.a]}40`,
                }}>
                {CLASS_NAMES[pair.a]} vs {CLASS_NAMES[pair.b]}
              </button>
            ))
        }
        <div className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {strategy === "ova" ? L.ovaInfo : L.ovoInfo} · {L.hoverHint}
        </div>
      </div>
    </VizCard>
  );
}
