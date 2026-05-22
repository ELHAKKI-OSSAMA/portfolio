"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, RotateCcw, Play } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";

const W = 520, H = 300, PAD = 36;

const SEED = (i: number) => (Math.sin(i * 37.3 + 11.7) * 0.5 + 0.5);
const DATA: Array<{ x: number; y: number; label: 0 | 1 }> = [
  ...Array.from({ length: 18 }, (_, i) => ({
    x: Math.max(0.3, Math.min(9.7, 2 + SEED(i) * 3.5)),
    y: Math.max(0.3, Math.min(9.7, 6.5 + SEED(i + 100) * 3)),
    label: 0 as const,
  })),
  ...Array.from({ length: 18 }, (_, i) => ({
    x: Math.max(0.3, Math.min(9.7, 5.5 + SEED(i + 200) * 3.5)),
    y: Math.max(0.3, Math.min(9.7, 1 + SEED(i + 300) * 4)),
    label: 1 as const,
  })),
];

function gini(pts: typeof DATA) {
  if (!pts.length) return 0;
  const p = pts.filter(p => p.label === 1).length / pts.length;
  return 2 * p * (1 - p);
}

interface SplitRecord {
  axis: 0 | 1; threshold: number; depth: number;
  xMin: number; xMax: number; yMin: number; yMax: number;
  giniAfter: number; label: 0 | 1;
}

function buildSplits(
  pts: typeof DATA, xMin = 0, xMax = 10, yMin = 0, yMax = 10,
  depth = 0, maxDepth = 5
): SplitRecord[] {
  const local = pts.filter(p => p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax);
  const g = gini(local);
  const label: 0 | 1 = local.filter(p => p.label === 1).length >= local.length / 2 ? 1 : 0;

  if (depth >= maxDepth || g < 0.05 || local.length < 3) return [];

  let bestGain = -1, bestAxis: 0 | 1 = 0, bestT = 0;
  for (const axis of [0, 1] as const) {
    const vals = [...new Set(local.map(p => axis === 0 ? p.x : p.y))].sort((a, b) => a - b);
    for (let ti = 0; ti < vals.length - 1; ti++) {
      const t = (vals[ti] + vals[ti + 1]) / 2;
      const left = local.filter(p => (axis === 0 ? p.x : p.y) <= t);
      const right = local.filter(p => (axis === 0 ? p.x : p.y) > t);
      if (!left.length || !right.length) continue;
      const gain = g - (left.length / local.length) * gini(left) - (right.length / local.length) * gini(right);
      if (gain > bestGain) { bestGain = gain; bestAxis = axis; bestT = t; }
    }
  }
  if (bestGain <= 0) return [];

  const lLeft = local.filter(p => (bestAxis === 0 ? p.x : p.y) <= bestT);
  const lRight = local.filter(p => (bestAxis === 0 ? p.x : p.y) > bestT);
  const gAfter = (lLeft.length / local.length) * gini(lLeft) + (lRight.length / local.length) * gini(lRight);

  const thisRecord: SplitRecord = { axis: bestAxis, threshold: bestT, depth, xMin, xMax, yMin, yMax, giniAfter: gAfter, label };

  if (bestAxis === 0) {
    return [thisRecord,
      ...buildSplits(pts, xMin, bestT, yMin, yMax, depth + 1, maxDepth),
      ...buildSplits(pts, bestT, xMax, yMin, yMax, depth + 1, maxDepth)];
  } else {
    return [thisRecord,
      ...buildSplits(pts, xMin, xMax, yMin, bestT, depth + 1, maxDepth),
      ...buildSplits(pts, xMin, xMax, bestT, yMax, depth + 1, maxDepth)];
  }
}

// Collect final leaf regions for given revealed splits
function collectRegions(splits: SplitRecord[], revealed: number) {
  const revSplits = splits.slice(0, revealed);
  const regions: Array<{ xMin: number; xMax: number; yMin: number; yMax: number; label: 0 | 1 }> = [];

  function recurse(xMin: number, xMax: number, yMin: number, yMax: number) {
    const split = revSplits.find(s =>
      s.xMin === xMin && s.xMax === xMax && s.yMin === yMin && s.yMax === yMax
    );
    if (!split) {
      const pts = DATA.filter(p => p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax);
      const label: 0 | 1 = pts.filter(p => p.label === 1).length >= pts.length / 2 ? 1 : 0;
      regions.push({ xMin, xMax, yMin, yMax, label });
      return;
    }
    if (split.axis === 0) {
      recurse(xMin, split.threshold, yMin, yMax);
      recurse(split.threshold, xMax, yMin, yMax);
    } else {
      recurse(xMin, xMax, yMin, split.threshold);
      recurse(xMin, xMax, split.threshold, yMax);
    }
  }
  recurse(0, 10, 0, 10);
  return regions;
}

const toSVGX = (x: number) => PAD + (x / 10) * (W - 2 * PAD);
const toSVGY = (y: number) => H - PAD - (y / 10) * (H - 2 * PAD);

export default function DecisionTreeViz({ accentColor = "#00d4aa" }: { accentColor?: string }) {
  const [revealed, setRevealed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredSplit, setHoveredSplit] = useState<number | null>(null);
  const vt = useVizTheme();

  const allSplits = useMemo(() => buildSplits(DATA, 0, 10, 0, 10, 0, 5), []);
  const regions = useMemo(() => collectRegions(allSplits, revealed), [allSplits, revealed]);
  const currentSplit = allSplits[revealed - 1] ?? null;

  const accuracy = useMemo(() => {
    let correct = 0;
    for (const pt of DATA) {
      const reg = regions.find(r => pt.x >= r.xMin && pt.x <= r.xMax && pt.y >= r.yMin && pt.y <= r.yMax);
      if (reg?.label === pt.label) correct++;
    }
    return DATA.length ? correct / DATA.length : 0;
  }, [regions]);

  // Auto-play
  useState(() => {
    if (!isPlaying) return;
  });
  useMemo(() => {
    if (!isPlaying) return;
    if (revealed < allSplits.length) {
      const t = setTimeout(() => setRevealed(r => r + 1), 700);
      return () => clearTimeout(t);
    } else {
      setIsPlaying(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, revealed]);

  const handlePlay = () => {
    if (revealed >= allSplits.length) { setRevealed(0); setTimeout(() => setIsPlaying(true), 50); }
    else setIsPlaying(p => !p);
  };

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Decision Tree — Recursive Partitioning
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {revealed} splits · Gini {currentSplit ? currentSplit.giniAfter.toFixed(3) : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ backgroundColor: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}50` }}>
            {isPlaying ? "⏸ Pause" : revealed >= allSplits.length ? "↺ Replay" : <><Play size={11} /> Grow Tree</>}
          </button>
          <button onClick={() => setRevealed(r => Math.min(allSplits.length, r + 1))}
            disabled={revealed >= allSplits.length}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)", opacity: revealed >= allSplits.length ? 0.4 : 1 }}>
            <ChevronRight size={12} /> Step
          </button>
          <button onClick={() => { setRevealed(0); setIsPlaying(false); }} className="p-1.5 rounded-lg"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Leaf regions */}
        {regions.map((r, i) => {
          const x = toSVGX(r.xMin), y = toSVGY(r.yMax);
          const w = toSVGX(r.xMax) - x, h = toSVGY(r.yMin) - y;
          return (
            <rect key={i} x={x} y={y} width={w} height={h}
              fill={r.label === 0 ? "#6c63ff" : "#ff6b6b"}
              opacity={0.10}
            />
          );
        })}

        {/* All revealed split lines */}
        {allSplits.slice(0, revealed).map((s, i) => {
          const isLast = i === revealed - 1;
          const color = isLast ? accentColor : vt.axis;
          if (s.axis === 0) {
            const x = toSVGX(s.threshold);
            return (
              <motion.line key={i} x1={x} y1={toSVGY(s.yMax)} x2={x} y2={toSVGY(s.yMin)}
                stroke={color} strokeWidth={isLast ? 2.5 : 1.5}
                opacity={isLast ? 1 : 0.6}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredSplit(i)}
                onMouseLeave={() => setHoveredSplit(null)}
              />
            );
          } else {
            const y = toSVGY(s.threshold);
            return (
              <motion.line key={i} x1={toSVGX(s.xMin)} y1={y} x2={toSVGX(s.xMax)} y2={y}
                stroke={color} strokeWidth={isLast ? 2.5 : 1.5}
                opacity={isLast ? 1 : 0.6}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredSplit(i)}
                onMouseLeave={() => setHoveredSplit(null)}
              />
            );
          }
        })}

        {/* Split annotation for latest split */}
        {currentSplit && (() => {
          const s = currentSplit;
          const label = s.axis === 0 ? `x ≤ ${s.threshold.toFixed(1)}` : `y ≤ ${s.threshold.toFixed(1)}`;
          const tx = s.axis === 0 ? toSVGX(s.threshold) + 6 : toSVGX((s.xMin + s.xMax) / 2);
          const ty = s.axis === 0 ? toSVGY((s.yMin + s.yMax) / 2) : toSVGY(s.threshold) - 5;
          return (
            <AnimatePresence>
              <motion.g key={revealed} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <rect x={tx - 2} y={ty - 12} width={label.length * 5.8 + 4} height={15} rx={4}
                  fill={`${accentColor}20`} stroke={accentColor} strokeWidth={1} />
                <text x={tx + 1} y={ty} fontSize={9} fill={accentColor} fontFamily="monospace">{label}</text>
              </motion.g>
            </AnimatePresence>
          );
        })()}

        {/* Gini badge */}
        {hoveredSplit !== null && (() => {
          const s = allSplits[hoveredSplit];
          const cx = toSVGX((s.xMin + s.xMax) / 2);
          const cy = toSVGY((s.yMin + s.yMax) / 2);
          return (
            <g>
              <rect x={cx - 38} y={cy - 14} width={76} height={22} rx={5}
                fill={vt.isDark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.95)"} stroke={vt.border} strokeWidth={1} />
              <text x={cx} y={cy} textAnchor="middle" fontSize={9} fill={accentColor} fontFamily="monospace">
                Gini↓ {s.giniAfter.toFixed(3)}  depth {s.depth}
              </text>
            </g>
          );
        })()}

        {/* Axis labels */}
        {[2, 4, 6, 8].map(v => (
          <g key={v}>
            <text x={toSVGX(v)} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{v}</text>
            <text x={PAD - 6} y={toSVGY(v) + 4} textAnchor="end" fontSize={9} fill={vt.textMuted}>{v}</text>
          </g>
        ))}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />

        {/* Data points */}
        {DATA.map((pt, i) => (
          <motion.circle key={i} cx={toSVGX(pt.x)} cy={toSVGY(pt.y)} r={5}
            fill={pt.label === 0 ? "#6c63ff" : "#ff6b6b"}
            stroke={vt.isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)"} strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.008 }} />
        ))}
      </svg>

      {/* Progress bar + stats */}
      <div className="px-5 pb-1 pt-2">
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: vt.surface }}>
          <motion.div className="h-full rounded-full" style={{ backgroundColor: accentColor }}
            animate={{ width: `${(revealed / Math.max(1, allSplits.length)) * 100}%` }}
            transition={{ duration: 0.3 }} />
        </div>
      </div>
      <div className="grid grid-cols-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "Splits", value: `${revealed}/${allSplits.length}` },
          { label: "Depth", value: currentSplit ? (currentSplit.depth + 1).toString() : "0" },
          { label: "Accuracy", value: `${(accuracy * 100).toFixed(1)}%` },
        ].map(({ label, value }) => (
          <div key={label} className="py-3">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
            <div className="text-sm font-bold font-mono" style={{ color: accentColor }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
