"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const KNN_LABELS = {
  en: {
    title: "K-Nearest Neighbors",
    subtitle: "drag the ✦ query point · adjust k",
    classA: "Class A",
    classB: "Class B",
    predBadge: (cls: string, votes: number, k: number) => `${cls} (${votes}/${k})`,
    statsK: "k",
    statsVotesA: "Votes A",
    statsVotesB: "Votes B",
    statsPredict: "Predict",
  },
  fr: {
    title: "K Plus Proches Voisins",
    subtitle: "glisser le point ✦ · ajuster k",
    classA: "Classe A",
    classB: "Classe B",
    predBadge: (cls: string, votes: number, k: number) => `${cls} (${votes}/${k})`,
    statsK: "k",
    statsVotesA: "Votes A",
    statsVotesB: "Votes B",
    statsPredict: "Prédiction",
  },
  ar: {
    title: "K من أقرب الجيران",
    subtitle: "اسحب نقطة الاستعلام ✦ · اضبط k",
    classA: "الصنف A",
    classB: "الصنف B",
    predBadge: (cls: string, votes: number, k: number) => `${cls} (${votes}/${k})`,
    statsK: "k",
    statsVotesA: "أصوات A",
    statsVotesB: "أصوات B",
    statsPredict: "التنبؤ",
  },
} as const;

const W = 520, H = 320, PAD = 36;

// Training data — two well-separated classes spread across the space
// Class A (purple): top-left cluster centered ~(2.5, 7.5) with spread
// Class B (red): bottom-right cluster centered ~(7.5, 2.5) with spread
// Some overlap near the middle to make KNN interesting
const SEED = (i: number) => (Math.sin(i * 37.3 + 5.1) * 0.5 + 0.5);
const SEED2 = (i: number) => (Math.sin(i * 19.7 + 2.3) * 0.5 + 0.5);

const TRAIN: Array<{ x: number; y: number; label: 0 | 1 }> = [
  // Class A: top-left region (x: 0.8-5.5, y: 5.0-9.5) — spread & diverse
  { x: 1.2, y: 8.8, label: 0 },
  { x: 2.1, y: 9.1, label: 0 },
  { x: 0.9, y: 7.2, label: 0 },
  { x: 3.4, y: 8.4, label: 0 },
  { x: 1.8, y: 6.5, label: 0 },
  { x: 4.2, y: 9.3, label: 0 },
  { x: 2.8, y: 7.0, label: 0 },
  { x: 0.7, y: 5.8, label: 0 },
  { x: 3.9, y: 6.2, label: 0 },
  { x: 1.5, y: 5.2, label: 0 },
  { x: 5.1, y: 8.0, label: 0 },
  { x: 4.7, y: 6.9, label: 0 },
  // Near-boundary (interesting for KNN)
  { x: 4.5, y: 5.5, label: 0 },
  { x: 3.2, y: 5.8, label: 0 },
  { x: 5.3, y: 5.2, label: 0 },

  // Class B: bottom-right region (x: 4.5-9.5, y: 0.8-5.0) — spread & diverse
  { x: 8.8, y: 1.2, label: 1 },
  { x: 9.1, y: 2.5, label: 1 },
  { x: 7.3, y: 0.9, label: 1 },
  { x: 8.2, y: 3.8, label: 1 },
  { x: 6.5, y: 1.7, label: 1 },
  { x: 9.3, y: 4.1, label: 1 },
  { x: 7.1, y: 3.0, label: 1 },
  { x: 5.9, y: 0.7, label: 1 },
  { x: 6.3, y: 3.8, label: 1 },
  { x: 5.2, y: 1.5, label: 1 },
  { x: 8.0, y: 4.9, label: 1 },
  { x: 6.9, y: 4.6, label: 1 },
  // Near-boundary
  { x: 5.5, y: 4.5, label: 1 },
  { x: 5.8, y: 3.2, label: 1 },
  { x: 4.8, y: 5.3, label: 1 },
];

const toSVGX = (x: number) => PAD + (x / 10) * (W - 2 * PAD);
const toSVGY = (y: number) => H - PAD - (y / 10) * (H - 2 * PAD);
const fromSVGX = (px: number) => (px - PAD) / (W - 2 * PAD) * 10;
const fromSVGY = (py: number) => (1 - (py - PAD) / (H - 2 * PAD)) * 10;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const K_OPTIONS = [1, 3, 5, 7, 9];

export default function KNNViz({ accentColor = "#00d4aa" }: { accentColor?: string }) {
  const [query, setQuery] = useState({ x: 5, y: 5 });
  const [k, setK] = useState(3);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const vt = useVizTheme();
  const L = useVizLocale(KNN_LABELS);

  const neighbors = useMemo(() => {
    return [...TRAIN]
      .map(pt => ({ ...pt, d: dist(pt, query) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
  }, [query, k]);

  const kthDist = neighbors[k - 1]?.d ?? 0;

  const votes = useMemo(() => {
    const v0 = neighbors.filter(n => n.label === 0).length;
    const v1 = neighbors.filter(n => n.label === 1).length;
    return { 0: v0, 1: v1 };
  }, [neighbors]);

  const prediction: 0 | 1 = votes[1] > votes[0] ? 1 : 0;

  const getSVGPos = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    return {
      x: Math.max(0.2, Math.min(9.8, fromSVGX((e.clientX - rect.left) * (W / rect.width)))),
      y: Math.max(0.2, Math.min(9.8, fromSVGY((e.clientY - rect.top) * (H / rect.height)))),
    };
  }, []);

  return (
    <VizCard>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{L.title}</span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>{L.subtitle}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>k =</span>
          {K_OPTIONS.map(kv => (
            <button key={kv} onClick={() => setK(kv)}
              className="w-8 h-7 rounded-lg text-xs font-bold transition-all"
              style={{
                backgroundColor: k === kv ? `${accentColor}30` : "var(--bg-card)",
                color: k === kv ? accentColor : "var(--text-muted)",
                border: `1px solid ${k === kv ? accentColor + "60" : "var(--border)"}`,
              }}>
              {kv}
            </button>
          ))}
        </div>
      </div>

      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ cursor: dragging ? "grabbing" : "default" }}
        onMouseMove={e => { if (dragging) setQuery(getSVGPos(e)); }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}>

        {/* Grid */}
        {[2, 4, 6, 8].map(v => (
          <g key={v}>
            <line x1={toSVGX(v)} y1={PAD} x2={toSVGX(v)} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />
            <line x1={PAD} y1={toSVGY(v)} x2={W - PAD} y2={toSVGY(v)} stroke={vt.grid} strokeWidth={1} />
            <text x={toSVGX(v)} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{v}</text>
            <text x={PAD - 6} y={toSVGY(v) + 4} textAnchor="end" fontSize={9} fill={vt.textMuted}>{v}</text>
          </g>
        ))}

        {/* Decision boundary preview — color background by prediction */}
        {/* Simple raster-like coloring with coarse grid */}
        {Array.from({ length: 12 }, (_, ri) =>
          Array.from({ length: 14 }, (_, ci) => {
            const cx = (ci + 0.5) / 14 * 10, cy = (ri + 0.5) / 12 * 10;
            const pts = [...TRAIN].map(p => ({ ...p, d: dist(p, { x: cx, y: cy }) })).sort((a, b) => a.d - b.d).slice(0, k);
            const v1 = pts.filter(p => p.label === 1).length;
            const label = v1 > k / 2 ? 1 : 0;
            return (
              <rect key={`${ri}-${ci}`}
                x={toSVGX(cx) - (W - 2 * PAD) / 28} y={toSVGY(cy) - (H - 2 * PAD) / 24}
                width={(W - 2 * PAD) / 14} height={(H - 2 * PAD) / 12}
                fill={label === 0 ? "#6c63ff" : "#ff6b6b"} opacity={0.07}
              />
            );
          })
        )}

        {/* kth-distance circle */}
        <motion.circle
          cx={toSVGX(query.x)} cy={toSVGY(query.y)}
          r={(kthDist / 10) * (W - 2 * PAD)}
          fill={accentColor} opacity={0.08}
          stroke={accentColor} strokeWidth={1.5} strokeDasharray="5,4"
          animate={{ cx: toSVGX(query.x), cy: toSVGY(query.y), r: (kthDist / 10) * (W - 2 * PAD) }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />

        {/* Lines to neighbors */}
        {neighbors.map((n, i) => (
          <motion.line key={i}
            x1={toSVGX(query.x)} y1={toSVGY(query.y)}
            x2={toSVGX(n.x)} y2={toSVGY(n.y)}
            stroke={n.label === 0 ? "#6c63ff" : "#ff6b6b"}
            strokeWidth={1.5} opacity={0.6} strokeDasharray="3,3"
            animate={{ x1: toSVGX(query.x), y1: toSVGY(query.y) }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        ))}

        {/* Training points */}
        {TRAIN.map((pt, i) => {
          const isNeighbor = neighbors.some(n => n === pt);
          return (
            <g key={i}>
              {isNeighbor && (
                <motion.circle cx={toSVGX(pt.x)} cy={toSVGY(pt.y)} r={14}
                  fill={pt.label === 0 ? "#6c63ff" : "#ff6b6b"}
                  opacity={0.2}
                  animate={{ r: 14 }} />
              )}
              <circle cx={toSVGX(pt.x)} cy={toSVGY(pt.y)} r={isNeighbor ? 7 : 5}
                fill={pt.label === 0 ? "#6c63ff" : "#ff6b6b"}
                stroke={vt.isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.8)"} strokeWidth={1.5} />
              {isNeighbor && (
                <text x={toSVGX(pt.x)} y={toSVGY(pt.y) - 12} textAnchor="middle" fontSize={8}
                  fill={pt.label === 0 ? "#6c63ff" : "#ff6b6b"} fontFamily="monospace">
                  {dist(pt, query).toFixed(1)}
                </text>
              )}
            </g>
          );
        })}

        {/* Query point */}
        <g onMouseDown={() => setDragging(true)} style={{ cursor: "grab" }}>
          <motion.circle cx={toSVGX(query.x)} cy={toSVGY(query.y)} r={22}
            fill="transparent"
            animate={{ cx: toSVGX(query.x), cy: toSVGY(query.y) }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }} />
          <motion.text x={toSVGX(query.x)} y={toSVGY(query.y) + 5}
            textAnchor="middle" fontSize={16} fill={accentColor}
            animate={{ x: toSVGX(query.x), y: toSVGY(query.y) + 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            ✦
          </motion.text>
        </g>

        {/* Prediction badge near query */}
        <AnimatePresence mode="wait">
          <motion.g key={prediction}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}>
            <rect x={toSVGX(query.x) + 14} y={toSVGY(query.y) - 24} width={62} height={20} rx={5}
              fill={prediction === 0 ? "#6c63ff" : "#ff6b6b"} opacity={0.9} />
            <text x={toSVGX(query.x) + 45} y={toSVGY(query.y) - 10}
              textAnchor="middle" fontSize={9} fill="white" fontWeight="bold">
              {L.predBadge(prediction === 0 ? L.classA : L.classB, votes[prediction], k)}
            </text>
          </motion.g>
        </AnimatePresence>

        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
      </svg>

      <StatGrid py="py-3" items={[
          { label: L.statsK, value: k.toString(), color: accentColor },
          { label: L.statsVotesA, value: votes[0].toString(), color: "#6c63ff" },
          { label: L.statsVotesB, value: votes[1].toString(), color: "#ff6b6b" },
          { label: L.statsPredict, value: prediction === 0 ? L.classA : L.classB, color: prediction === 0 ? "#6c63ff" : "#ff6b6b" },
      ]} />
    </VizCard>
  );
}
