"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const RF_LABELS = {
  en: {
    title: "Random Forest",
    stepOf: (step: number, label: string) => `Step ${step}/4 — ${label}`,
    stepLabels: ["Dataset", "Bootstrap + Features", "Tree Boundaries", "Ensemble Vote"] as readonly string[],
    treeLabels: ["Tree 1: uses x₁, x₂", "Tree 2: uses x₁ randomly", "Tree 3: uses x₂, x₁"] as readonly string[],
    prev: "← Prev",
    next: "Next →",
    classALegend: "● Class A (n=10)",
    classBLegend: "● Class B (n=10)",
    withReplacement: (n: number) => `n=${n} (w/ replacement)`,
    step3Hint: "drag ✦ · RF reduces variance — individual trees may err, ensemble corrects",
    rfBadge: (cls: string) => `RF: ${cls}`,
    classA: "Class A",
    classB: "Class B",
    statStep: "Step",
    statTree1: "Tree 1",
    statTree2: "Tree 2",
    statEnsemble: "Ensemble",
    statTree3: "Tree 3",
  },
  fr: {
    title: "Forêt Aléatoire",
    stepOf: (step: number, label: string) => `Étape ${step}/4 — ${label}`,
    stepLabels: ["Données", "Bootstrap + Caractéristiques", "Frontières des arbres", "Vote d'ensemble"] as readonly string[],
    treeLabels: ["Arbre 1 : utilise x₁, x₂", "Arbre 2 : utilise x₁ aléat.", "Arbre 3 : utilise x₂, x₁"] as readonly string[],
    prev: "← Préc.",
    next: "Suiv. →",
    classALegend: "● Classe A (n=10)",
    classBLegend: "● Classe B (n=10)",
    withReplacement: (n: number) => `n=${n} (avec remise)`,
    step3Hint: "glisser ✦ · la FA réduit la variance — des arbres individuels peuvent errer, l'ensemble corrige",
    rfBadge: (cls: string) => `FA: ${cls}`,
    classA: "Classe A",
    classB: "Classe B",
    statStep: "Étape",
    statTree1: "Arbre 1",
    statTree2: "Arbre 2",
    statEnsemble: "Ensemble",
    statTree3: "Arbre 3",
  },
  ar: {
    title: "الغابة العشوائية",
    stepOf: (step: number, label: string) => `خطوة ${step}/4 — ${label}`,
    stepLabels: ["البيانات", "Bootstrap + الميزات", "حدود الأشجار", "تصويت المجموعة"] as readonly string[],
    treeLabels: ["شجرة 1: تستخدم x₁, x₂", "شجرة 2: تستخدم x₁ عشوائياً", "شجرة 3: تستخدم x₂, x₁"] as readonly string[],
    prev: "→ السابق",
    next: "التالي ←",
    classALegend: "● الصنف A (n=10)",
    classBLegend: "● الصنف B (n=10)",
    withReplacement: (n: number) => `n=${n} (مع الإرجاع)`,
    step3Hint: "اسحب ✦ · الغابة تقلل التباين — الأشجار الفردية قد تخطئ، والمجموعة تصحح",
    rfBadge: (cls: string) => `غ.ع.: ${cls}`,
    classA: "الصنف A",
    classB: "الصنف B",
    statStep: "الخطوة",
    statTree1: "شجرة 1",
    statTree2: "شجرة 2",
    statEnsemble: "المجموعة",
    statTree3: "شجرة 3",
  },
} as const;

const W = 520, H = 300, PAD = 36;

const CLASS_A = "#6c63ff";
const CLASS_B = "#ff6b6b";
const MODEL_COLORS = ["#6c63ff", "#f97316", "#22c55e"];

const DATA: Array<{ x: number; y: number; label: 0 | 1 }> = [
  { x: 1.2, y: 8.5, label: 0 },
  { x: 2.0, y: 7.8, label: 0 },
  { x: 0.9, y: 6.5, label: 0 },
  { x: 3.1, y: 8.8, label: 0 },
  { x: 1.7, y: 5.9, label: 0 },
  { x: 4.0, y: 9.1, label: 0 },
  { x: 2.6, y: 7.0, label: 0 },
  { x: 0.8, y: 5.2, label: 0 },
  { x: 3.8, y: 6.3, label: 0 },
  { x: 1.4, y: 4.8, label: 0 },
  { x: 8.5, y: 1.3, label: 1 },
  { x: 9.0, y: 2.7, label: 1 },
  { x: 7.2, y: 0.8, label: 1 },
  { x: 8.1, y: 3.9, label: 1 },
  { x: 6.4, y: 1.6, label: 1 },
  { x: 9.2, y: 4.2, label: 1 },
  { x: 7.0, y: 2.9, label: 1 },
  { x: 5.9, y: 0.7, label: 1 },
  { x: 6.2, y: 3.7, label: 1 },
  { x: 5.1, y: 1.4, label: 1 },
];

const BOOTS = [
  [0,1,2,3,3,5,6,7,8,9,10,11,12,13,14,15,16,17,17,18],
  [0,1,2,3,4,5,6,7,8,9,9,10,11,12,13,14,15,16,17,19],
  [0,1,2,3,4,5,6,7,8,8,9,10,11,12,13,14,15,17,18,19],
];

const toSVGX = (x: number) => PAD + (x / 10) * (W - 2 * PAD);
const toSVGY = (y: number) => H - PAD - (y / 10) * (H - 2 * PAD);
const fromSVGX = (px: number) => (px - PAD) / (W - 2 * PAD) * 10;
const fromSVGY = (py: number) => (1 - (py - PAD) / (H - 2 * PAD)) * 10;

function predictTree(treeIdx: number, x: number, y: number): 0 | 1 {
  if (treeIdx === 0) {
    if (x < 5.2) return 0;
    return y > 5.5 ? 0 : 1;
  }
  if (treeIdx === 1) {
    return x < 4.8 ? 0 : 1;
  }
  if (y > 5.0) {
    return x < 5.5 ? 0 : 1;
  }
  return 1;
}

function ensemblePredict(x: number, y: number): 0 | 1 {
  const votes = [0, 1, 2].map(i => predictTree(i, x, y));
  const sumA = votes.filter(v => v === 0).length;
  return sumA >= 2 ? 0 : 1;
}

export default function RandomForestViz({ accentColor = "#00d4aa" }: { accentColor?: string }) {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState({ x: 5.5, y: 5.5 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const vt = useVizTheme();
  const L = useVizLocale(RF_LABELS);

  const getSVGPos = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    return {
      x: Math.max(0.2, Math.min(9.8, fromSVGX((e.clientX - rect.left) * (W / rect.width)))),
      y: Math.max(0.2, Math.min(9.8, fromSVGY((e.clientY - rect.top) * (H / rect.height)))),
    };
  }, []);

  const treePreds = [0, 1, 2].map(i => predictTree(i, query.x, query.y));
  const ensemblePred = ensemblePredict(query.x, query.y);
  const votesA = treePreds.filter(v => v === 0).length;
  const votesB = treePreds.filter(v => v === 1).length;

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{L.title}</span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {L.stepOf(step + 1, L.stepLabels[step])}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: step > 0 ? `${accentColor}25` : "var(--bg-card)",
              color: step > 0 ? accentColor : "var(--text-muted)",
              border: `1px solid ${step > 0 ? accentColor + "50" : "var(--border)"}`,
            }}
          >
            {L.prev}
          </button>
          <button
            disabled={step === 3}
            onClick={() => setStep(s => s + 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: step < 3 ? `${accentColor}25` : "var(--bg-card)",
              color: step < 3 ? accentColor : "var(--text-muted)",
              border: `1px solid ${step < 3 ? accentColor + "50" : "var(--border)"}`,
            }}
          >
            {L.next}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 0: Dataset ── */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              {[2, 4, 6, 8].map(v => (
                <g key={v}>
                  <line x1={toSVGX(v)} y1={PAD} x2={toSVGX(v)} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />
                  <line x1={PAD} y1={toSVGY(v)} x2={W - PAD} y2={toSVGY(v)} stroke={vt.grid} strokeWidth={1} />
                  <text x={toSVGX(v)} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{v}</text>
                  <text x={PAD - 6} y={toSVGY(v) + 4} textAnchor="end" fontSize={9} fill={vt.textMuted}>{v}</text>
                </g>
              ))}
              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
              <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
              {DATA.map((pt, i) => (
                <motion.circle
                  key={i}
                  cx={toSVGX(pt.x)}
                  cy={toSVGY(pt.y)}
                  r={6}
                  fill={pt.label === 0 ? CLASS_A : CLASS_B}
                  stroke={vt.isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)"}
                  strokeWidth={1.5}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                />
              ))}
              <text x={PAD + 8} y={PAD + 16} fontSize={10} fill={CLASS_A}>{L.classALegend}</text>
              <text x={PAD + 8} y={PAD + 30} fontSize={10} fill={CLASS_B}>{L.classBLegend}</text>
            </svg>
          </motion.div>
        )}

        {/* ── Step 1: Bootstrap + Features ── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-3 gap-1 px-3 pb-3 pt-2">
              {BOOTS.map((bootIndices, treeIdx) => {
                const bootData = bootIndices.map(bi => DATA[bi]);
                const miniW = 155, miniH = 130, miniPad = 16;
                const toMX = (x: number) => miniPad + (x / 10) * (miniW - 2 * miniPad);
                const toMY = (y: number) => miniH - miniPad - (y / 10) * (miniH - 2 * miniPad);
                return (
                  <motion.div
                    key={treeIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: treeIdx * 0.15 }}
                    className="rounded-xl border overflow-hidden"
                    style={{ borderColor: MODEL_COLORS[treeIdx] + "60", backgroundColor: MODEL_COLORS[treeIdx] + "0a" }}
                  >
                    <div className="px-2 py-1 text-center" style={{ backgroundColor: MODEL_COLORS[treeIdx] + "20" }}>
                      <span className="text-xs font-bold" style={{ color: MODEL_COLORS[treeIdx] }}>{L.treeLabels[treeIdx]}</span>
                    </div>
                    <svg viewBox={`0 0 ${miniW} ${miniH}`} className="w-full">
                      {[2, 5, 8].map(v => (
                        <g key={v}>
                          <line x1={toMX(v)} y1={miniPad} x2={toMX(v)} y2={miniH - miniPad} stroke={vt.grid} strokeWidth={0.8} />
                          <line x1={miniPad} y1={toMY(v)} x2={miniW - miniPad} y2={toMY(v)} stroke={vt.grid} strokeWidth={0.8} />
                        </g>
                      ))}
                      <line x1={miniPad} y1={miniH - miniPad} x2={miniW - miniPad} y2={miniH - miniPad} stroke={vt.axis} strokeWidth={1} />
                      <line x1={miniPad} y1={miniPad} x2={miniPad} y2={miniH - miniPad} stroke={vt.axis} strokeWidth={1} />
                      {bootData.map((pt, i) => (
                        <motion.circle
                          key={i}
                          cx={toMX(pt.x)}
                          cy={toMY(pt.y)}
                          r={3.5}
                          fill={pt.label === 0 ? CLASS_A : CLASS_B}
                          opacity={0.85}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 0.85, scale: 1 }}
                          transition={{ delay: i * 0.025 + treeIdx * 0.15 }}
                        />
                      ))}
                    </svg>
                    <div className="text-center pb-1">
                      <span className="text-xs" style={{ color: vt.textMuted }}>{L.withReplacement(bootData.length)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Tree Boundaries ── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              {[2, 4, 6, 8].map(v => (
                <g key={v}>
                  <line x1={toSVGX(v)} y1={PAD} x2={toSVGX(v)} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />
                  <line x1={PAD} y1={toSVGY(v)} x2={W - PAD} y2={toSVGY(v)} stroke={vt.grid} strokeWidth={1} />
                  <text x={toSVGX(v)} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{v}</text>
                  <text x={PAD - 6} y={toSVGY(v) + 4} textAnchor="end" fontSize={9} fill={vt.textMuted}>{v}</text>
                </g>
              ))}
              {/* Tree 1 boundaries */}
              <motion.line
                x1={toSVGX(5.2)} y1={PAD} x2={toSVGX(5.2)} y2={H - PAD}
                stroke={MODEL_COLORS[0]} strokeWidth={2} strokeDasharray="6,4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              />
              <motion.line
                x1={toSVGX(5.2)} y1={toSVGY(5.5)} x2={W - PAD} y2={toSVGY(5.5)}
                stroke={MODEL_COLORS[0]} strokeWidth={2} strokeDasharray="6,4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              />
              <text x={toSVGX(5.2) + 4} y={PAD + 12} fontSize={9} fill={MODEL_COLORS[0]}>T1: x=5.2</text>

              {/* Tree 2 boundary */}
              <motion.line
                x1={toSVGX(4.8)} y1={PAD} x2={toSVGX(4.8)} y2={H - PAD}
                stroke={MODEL_COLORS[1]} strokeWidth={2} strokeDasharray="6,4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              />
              <text x={toSVGX(4.8) - 34} y={PAD + 24} fontSize={9} fill={MODEL_COLORS[1]}>T2: x=4.8</text>

              {/* Tree 3 boundaries */}
              <motion.line
                x1={PAD} y1={toSVGY(5.0)} x2={W - PAD} y2={toSVGY(5.0)}
                stroke={MODEL_COLORS[2]} strokeWidth={2} strokeDasharray="6,4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              />
              <motion.line
                x1={toSVGX(5.5)} y1={PAD} x2={toSVGX(5.5)} y2={toSVGY(5.0)}
                stroke={MODEL_COLORS[2]} strokeWidth={2} strokeDasharray="6,4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              />
              <text x={PAD + 4} y={toSVGY(5.0) - 4} fontSize={9} fill={MODEL_COLORS[2]}>T3: y=5.0</text>

              {DATA.map((pt, i) => (
                <circle
                  key={i}
                  cx={toSVGX(pt.x)}
                  cy={toSVGY(pt.y)}
                  r={5}
                  fill={pt.label === 0 ? CLASS_A : CLASS_B}
                  stroke={vt.isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)"}
                  strokeWidth={1.5}
                />
              ))}
              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
              <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
            </svg>
          </motion.div>
        )}

        {/* ── Step 3: Vote ── */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              style={{ cursor: dragging ? "grabbing" : "default" }}
              onMouseMove={e => { if (dragging) setQuery(getSVGPos(e)); }}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
            >
              {/* Background decision regions */}
              {Array.from({ length: 12 }, (_, ri) =>
                Array.from({ length: 14 }, (_, ci) => {
                  const cx = (ci + 0.5) / 14 * 10;
                  const cy = (ri + 0.5) / 12 * 10;
                  const pred = ensemblePredict(cx, cy);
                  return (
                    <rect
                      key={`${ri}-${ci}`}
                      x={toSVGX(cx) - (W - 2 * PAD) / 28}
                      y={toSVGY(cy) - (H - 2 * PAD) / 24}
                      width={(W - 2 * PAD) / 14}
                      height={(H - 2 * PAD) / 12}
                      fill={pred === 0 ? CLASS_A : CLASS_B}
                      opacity={0.08}
                    />
                  );
                })
              )}

              {[2, 4, 6, 8].map(v => (
                <g key={v}>
                  <line x1={toSVGX(v)} y1={PAD} x2={toSVGX(v)} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />
                  <line x1={PAD} y1={toSVGY(v)} x2={W - PAD} y2={toSVGY(v)} stroke={vt.grid} strokeWidth={1} />
                  <text x={toSVGX(v)} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{v}</text>
                  <text x={PAD - 6} y={toSVGY(v) + 4} textAnchor="end" fontSize={9} fill={vt.textMuted}>{v}</text>
                </g>
              ))}

              {DATA.map((pt, i) => (
                <circle
                  key={i}
                  cx={toSVGX(pt.x)}
                  cy={toSVGY(pt.y)}
                  r={5}
                  fill={pt.label === 0 ? CLASS_A : CLASS_B}
                  stroke={vt.isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)"}
                  strokeWidth={1.5}
                />
              ))}

              {/* Tree vote lines to query */}
              {treePreds.map((pred, treeIdx) => (
                <motion.line
                  key={treeIdx}
                  x1={toSVGX(query.x)}
                  y1={toSVGY(query.y)}
                  x2={toSVGX(query.x) + (treeIdx - 1) * 50}
                  y2={toSVGY(query.y) - 60}
                  stroke={MODEL_COLORS[treeIdx]}
                  strokeWidth={1.5}
                  strokeDasharray="4,3"
                  opacity={0.7}
                  animate={{ x1: toSVGX(query.x), y1: toSVGY(query.y) }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                />
              ))}

              {/* Tree vote labels */}
              {treePreds.map((pred, treeIdx) => (
                <motion.g
                  key={`label-${treeIdx}`}
                  animate={{
                    transform: `translate(${toSVGX(query.x) + (treeIdx - 1) * 50 - 18},${toSVGY(query.y) - 80})`,
                  }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                >
                  <rect width={36} height={16} rx={4} fill={MODEL_COLORS[treeIdx]} opacity={0.9} />
                  <text x={18} y={11} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">
                    T{treeIdx + 1}:{pred === 0 ? "A" : "B"}
                  </text>
                </motion.g>
              ))}

              {/* Query point */}
              <g onMouseDown={() => setDragging(true)} style={{ cursor: "grab" }}>
                <motion.circle
                  cx={toSVGX(query.x)}
                  cy={toSVGY(query.y)}
                  r={18}
                  fill="transparent"
                  animate={{ cx: toSVGX(query.x), cy: toSVGY(query.y) }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
                <motion.text
                  x={toSVGX(query.x)}
                  y={toSVGY(query.y) + 5}
                  textAnchor="middle"
                  fontSize={16}
                  fill={accentColor}
                  animate={{ x: toSVGX(query.x), y: toSVGY(query.y) + 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  ✦
                </motion.text>
              </g>

              {/* Ensemble prediction badge */}
              <AnimatePresence mode="wait">
                <motion.g
                  key={ensemblePred}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <rect
                    x={toSVGX(query.x) + 14}
                    y={toSVGY(query.y) - 26}
                    width={70}
                    height={20}
                    rx={5}
                    fill={ensemblePred === 0 ? CLASS_A : CLASS_B}
                    opacity={0.9}
                  />
                  <text
                    x={toSVGX(query.x) + 49}
                    y={toSVGY(query.y) - 12}
                    textAnchor="middle"
                    fontSize={9}
                    fill="white"
                    fontWeight="bold"
                  >
                    {L.rfBadge(ensemblePred === 0 ? L.classA : L.classB)}
                  </text>
                </motion.g>
              </AnimatePresence>

              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
              <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />

              {/* Info label */}
              <text x={W / 2} y={H - PAD + 14} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
                {L.step3Hint}
              </text>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer stats */}
      <StatGrid py="py-3" items={[
          { label: L.statStep, value: `${step + 1}/4`, color: accentColor },
          { label: L.statTree1, value: step >= 3 ? (treePreds[0] === 0 ? "A" : "B") : "—", color: MODEL_COLORS[0] },
          { label: L.statTree2, value: step >= 3 ? (treePreds[1] === 0 ? "A" : "B") : "—", color: MODEL_COLORS[1] },
          { label: step >= 3 ? L.statEnsemble : L.statTree3, value: step >= 3 ? `${ensemblePred === 0 ? "A" : "B"} (${votesA}v${votesB})` : "—", color: step >= 3 ? (ensemblePred === 0 ? CLASS_A : CLASS_B) : MODEL_COLORS[2] },
      ]} />
    </VizCard>
  );
}
