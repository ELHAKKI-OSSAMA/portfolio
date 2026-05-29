"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const CL_LABELS = {
  en: {
    title: "Clustering",
    kmeans: "K-Means",
    dbscan: "DBSCAN",
    core: "Core (≥MinPts)",
    border: "Border",
    noise: "Noise",
    hoverHint: "Hover to see ε-ball",
    statK: "K (clusters)",
    statPoints: "Points",
    statStep: "Step",
    statEps: "ε (radius)",
    statMinPts: "MinPts",
    statClusters: "Clusters found",
  },
  fr: {
    title: "Regroupement",
    kmeans: "K-Moyennes",
    dbscan: "DBSCAN",
    core: "Cœur (≥MinPts)",
    border: "Bord",
    noise: "Bruit",
    hoverHint: "Survoler pour voir la ε-boule",
    statK: "K (groupes)",
    statPoints: "Points",
    statStep: "Étape",
    statEps: "ε (rayon)",
    statMinPts: "MinPts",
    statClusters: "Groupes trouvés",
  },
  ar: {
    title: "التجميع",
    kmeans: "K-Means",
    dbscan: "DBSCAN",
    core: "نواة (≥MinPts)",
    border: "حافة",
    noise: "ضوضاء",
    hoverHint: "مرّر للرؤية ε-ball",
    statK: "K (مجموعات)",
    statPoints: "نقاط",
    statStep: "خطوة",
    statEps: "ε (نصف القطر)",
    statMinPts: "MinPts",
    statClusters: "مجموعات مُكتشفة",
  },
} as const;

const W = 520, H = 240;

// ── Pre-placed points in 3 natural clusters ───────────────────────────────────
const POINTS = [
  // Cluster A (top-left)
  {x:90,y:60},{x:110,y:75},{x:80,y:85},{x:105,y:50},{x:125,y:70},{x:95,y:95},{x:70,y:65},
  // Cluster B (bottom-center)
  {x:230,y:165},{x:255,y:180},{x:245,y:155},{x:270,y:170},{x:235,y:190},{x:260,y:145},{x:280,y:185},
  // Cluster C (right)
  {x:390,y:80},{x:415,y:65},{x:400,y:100},{x:430,y:85},{x:375,y:70},{x:420,y:105},{x:445,y:75},
];

const CLUSTER_COLORS = ["#6c63ff","#f97316","#22c55e","#06b6d4","#ec4899"];

// Deterministic k-means with fixed initial centroids spread across canvas
function computeKMeansSteps(k: number) {
  // Place initial centroids spread horizontally
  const initCentroids = Array.from({ length: k }, (_, i) => ({
    x: 70 + (i * (420 / Math.max(k - 1, 1))),
    y: 120 + (i % 2 === 0 ? -20 : 20),
  }));

  const steps = [{ centroids: initCentroids.map(c => ({ ...c })), labels: Array(POINTS.length).fill(-1) }];

  let centroids = initCentroids.map(c => ({ ...c }));
  for (let iter = 0; iter < 8; iter++) {
    // Assign
    const labels = POINTS.map(p => {
      let best = 0, bestD = Infinity;
      centroids.forEach((c, ci) => { const d = dist(p, c); if (d < bestD) { bestD = d; best = ci; } });
      return best;
    });
    steps.push({ centroids: centroids.map(c => ({ ...c })), labels });

    // Update centroids
    const newCentroids = centroids.map((_, ci) => {
      const pts = POINTS.filter((_, pi) => labels[pi] === ci);
      if (!pts.length) return centroids[ci];
      return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
    });

    const converged = newCentroids.every((c, ci) => dist(c, centroids[ci]) < 0.5);
    centroids = newCentroids;
    steps.push({ centroids: centroids.map(c => ({ ...c })), labels });

    if (converged) break;
  }
  return steps;
}

function dist(a:{x:number,y:number}, b:{x:number,y:number}) {
  return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);
}

function computeDBSCAN(points: typeof POINTS, eps: number, minPts: number) {
  const neighbors = points.map((p,i) =>
    points.map((_,j)=>j).filter(j => j!==i && dist(p,points[j]) <= eps)
  );
  const core = points.map((_,i) => neighbors[i].length >= minPts);
  // simple cluster labeling
  const labels: number[] = Array(points.length).fill(-1);
  let cid = 0;
  const visited = new Set<number>();
  for (let i = 0; i < points.length; i++) {
    if (visited.has(i) || !core[i]) continue;
    visited.add(i);
    labels[i] = cid;
    const queue = [...neighbors[i]];
    while (queue.length) {
      const j = queue.shift()!;
      if (!visited.has(j)) { visited.add(j); labels[j] = cid; if (core[j]) queue.push(...neighbors[j]); }
      else if (labels[j] === -1) labels[j] = cid;
    }
    cid++;
  }
  return { labels, core, neighbors, nClusters: cid };
}

export default function ClusteringViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(CL_LABELS);
  const [tab, setTab] = useState<"kmeans"|"dbscan">("kmeans");
  const [step, setStep] = useState(0);
  const [hovPt, setHovPt] = useState<number|null>(null);
  const [k, setK] = useState(3);
  const [eps, setEps] = useState(62);
  const [minPts] = useState(2);

  const kmeansSteps = useMemo(() => computeKMeansSteps(k), [k]);
  const clampedStep = Math.min(step, kmeansSteps.length - 1);
  const kStep = kmeansSteps[clampedStep];

  const dbscan = useMemo(() => computeDBSCAN(POINTS, eps, minPts), [eps, minPts]);

  const dbColors = ["#6c63ff","#f97316","#22c55e","#06b6d4"];

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {L.title} — {tab === "kmeans" ? L.kmeans : L.dbscan}
        </span>
        <div className="flex gap-1">
          {(["kmeans","dbscan"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setStep(0); }}
              className="px-3 py-1 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: tab===t ? `${accentColor}22` : "transparent",
                color: tab===t ? accentColor : vt.textMuted,
                border:`1px solid ${tab===t ? accentColor+"55":"var(--border)"}`,
              }}>
              {t === "kmeans" ? L.kmeans : L.dbscan}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>

          {/* SVG canvas */}
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {/* K-Means */}
            {tab === "kmeans" && (
              <g>
                {/* Points */}
                {POINTS.map((p, i) => {
                  const label = kStep.labels[i];
                  const col = label >= 0 ? CLUSTER_COLORS[label] : (vt.isDark ? "#778899" : "#aaaaaa");
                  return (
                    <motion.g key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.02 }}>
                      <circle cx={p.x} cy={p.y} r={6} fill={col + (label>=0?"bb":"88")} stroke={col} strokeWidth={1.5} />
                    </motion.g>
                  );
                })}
                {/* Centroids — motion.g owns position via translate; children use relative coords */}
                {kStep.centroids.map((c, ci) => (
                  <motion.g key={ci} animate={{ x: c.x, y: c.y }} initial={false}
                    transition={{ type:"spring", stiffness:180, damping:20 }}>
                    <rect x={-7} y={-7} width={14} height={14} rx={2}
                      fill={CLUSTER_COLORS[ci]} stroke="white" strokeWidth={2}
                      transform="rotate(45,0,0)" />
                    <text x={0} y={3.5} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">
                      {ci+1}
                    </text>
                  </motion.g>
                ))}
              </g>
            )}

            {/* DBSCAN */}
            {tab === "dbscan" && (
              <g>
                {/* ε-neighborhood circle on hover */}
                {hovPt !== null && (
                  <circle cx={POINTS[hovPt].x} cy={POINTS[hovPt].y} r={eps}
                    fill={accentColor+"15"} stroke={accentColor+"60"} strokeWidth={1} strokeDasharray="4,3" />
                )}
                {/* neighbor lines on hover */}
                {hovPt !== null && dbscan.neighbors[hovPt].map(j => (
                  <line key={j}
                    x1={POINTS[hovPt!].x} y1={POINTS[hovPt!].y}
                    x2={POINTS[j].x} y2={POINTS[j].y}
                    stroke={accentColor+"60"} strokeWidth={1} />
                ))}
                {/* Points */}
                {POINTS.map((p, i) => {
                  const label = dbscan.labels[i];
                  const isCore = dbscan.core[i];
                  const isNoise = label === -1;
                  const col = isNoise ? (vt.isDark ? "#778899" : "#aaaaaa") : dbColors[label % dbColors.length];
                  return (
                    <g key={i} onMouseEnter={() => setHovPt(i)} onMouseLeave={() => setHovPt(null)}
                      style={{ cursor:"pointer" }}>
                      <circle cx={p.x} cy={p.y} r={isCore ? 7 : 5}
                        fill={col+(isNoise?"44":"99")} stroke={col} strokeWidth={isCore?2:1}
                        strokeDasharray={isNoise ? "3,2" : "none"} />
                      {isCore && <circle cx={p.x} cy={p.y} r={10} fill="none" stroke={col+"40"} strokeWidth={1} />}
                    </g>
                  );
                })}
              </g>
            )}
          </svg>

          {/* K-Means step controls */}
          {tab === "kmeans" && (
            <div className="px-5 pb-3">
              <div className="flex gap-1 mb-2">
                {kmeansSteps.map((_, i) => (
                  <button key={i} onClick={() => setStep(i)}
                    className="flex-1 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: clampedStep===i ? `${accentColor}22` : i<clampedStep ? `${accentColor}10` : vt.surface,
                      color: clampedStep===i ? accentColor : i<clampedStep ? accentColor+"aa" : vt.textFaint,
                      border:`1px solid ${clampedStep===i ? accentColor+"55":"var(--border)"}`,
                    }}>
                    {i < clampedStep ? "✓" : i+1}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-semibold" style={{ color:vt.textMuted }}>K =</span>
                <input type="range" min={2} max={5} step={1} value={k}
                  onChange={e => { setK(parseInt(e.target.value)); setStep(0); }}
                  className="flex-1" style={{ accentColor }} />
                <span className="text-xs font-mono w-4" style={{ color:accentColor }}>{k}</span>
              </div>
            </div>
          )}

          {/* DBSCAN legend + sliders */}
          {tab === "dbscan" && (
            <div className="px-5 pb-3 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold w-16" style={{ color:vt.textMuted }}>ε radius</span>
                <input type="range" min={30} max={110} step={5} value={eps}
                  onChange={e => setEps(parseInt(e.target.value))}
                  className="flex-1" style={{ accentColor }} />
                <span className="text-xs font-mono w-10 text-right" style={{ color:accentColor }}>{eps}px</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                {[
                  { label: L.core,   shape:"●", col:accentColor },
                  { label: L.border, shape:"○", col:vt.textMuted },
                  { label: L.noise,  shape:"✕", col:vt.textFaint },
                ].map(it => (
                  <span key={it.label} className="flex items-center gap-1" style={{ color:vt.textMuted }}>
                    <span style={{ color:it.col, fontWeight:700 }}>{it.shape}</span>{it.label}
                  </span>
                ))}
                <span className="ml-auto" style={{ color:vt.textFaint }}>{L.hoverHint}</span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Stats bar */}
      <div className="grid grid-cols-3 border-t text-center" style={{ borderColor:"var(--border)" }}>
        {(tab === "kmeans" ? [
          { label: L.statK,       val:`${k}`,                             col:accentColor },
          { label: L.statPoints,  val:`${POINTS.length}`,                 col:"var(--text-primary)" },
          { label: L.statStep,    val:`${clampedStep+1}/${kmeansSteps.length}`, col:"#22c55e" },
        ] : [
          { label: L.statEps,      val:`${eps}px`,           col:accentColor },
          { label: L.statMinPts,   val:`${minPts}`,           col:"var(--text-primary)" },
          { label: L.statClusters, val:`${dbscan.nClusters}`, col:"#22c55e" },
        ]).map(({ label, val, col }) => (
          <div key={label} className="py-3">
            <div className="text-xs" style={{ color:vt.textMuted }}>{label}</div>
            <div className="text-sm font-bold font-mono" style={{ color:col }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
