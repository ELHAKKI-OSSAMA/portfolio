"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const BAG_LABELS = {
  en: {
    title: "Bagging — Bootstrap Aggregating",
    steps: ["Dataset", "Bootstrap", "Boundaries", "Ensemble"] as readonly string[],
    stepDescs: [
      "Training data: 18 points, 2 classes. Each model will be trained on a random bootstrap sample drawn with replacement.",
      "Bootstrap sampling: draw N=18 points with replacement. Some appear multiple times (×N shown), some are absent — each model sees a different version of reality.",
      "Each model learns a slightly different decision boundary from its bootstrap data. Notice the 3 dashed lines don't perfectly agree.",
      "Drag ✦ to test any point. Each model votes independently — majority vote is the ensemble prediction. Individual errors cancel out!",
    ] as readonly string[],
    svgTitles: [
      "Original Dataset — N = 18",
      "3 Bootstrap Samples (drawn with replacement)",
      "Each Model Learns a Different Decision Boundary",
      "Ensemble Voting — Drag ✦ to Test Any Point",
    ] as readonly string[],
    classA: "Class A (0)",
    classB: "Class B (1)",
    classAShort: "A",
    classBShort: "B",
    ensemblePred: (cls: string, votes: number) => `Ensemble: Class ${cls} (${votes}/3)`,
    prev: "← Previous",
    next: "Next →",
    stepOf: (i: number, total: number) => `Step ${i} / ${total}`,
  },
  fr: {
    title: "Bagging — Agrégation Bootstrap",
    steps: ["Données", "Bootstrap", "Frontières", "Ensemble"] as readonly string[],
    stepDescs: [
      "Données d'entraînement : 18 points, 2 classes. Chaque modèle sera entraîné sur un échantillon bootstrap aléatoire tiré avec remplacement.",
      "Échantillonnage bootstrap : tirer N=18 points avec remplacement. Certains apparaissent plusieurs fois (×N affiché), d'autres sont absents — chaque modèle voit une version différente de la réalité.",
      "Chaque modèle apprend une frontière de décision légèrement différente à partir de ses données bootstrap. Les 3 lignes pointillées ne s'accordent pas parfaitement.",
      "Faites glisser ✦ pour tester n'importe quel point. Chaque modèle vote indépendamment — vote majoritaire = prédiction d'ensemble. Les erreurs individuelles s'annulent !",
    ] as readonly string[],
    svgTitles: [
      "Jeu de données original — N = 18",
      "3 Échantillons Bootstrap (avec remplacement)",
      "Chaque Modèle Apprend une Frontière Différente",
      "Vote d'Ensemble — Glisser ✦ pour Tester",
    ] as readonly string[],
    classA: "Classe A (0)",
    classB: "Classe B (1)",
    classAShort: "A",
    classBShort: "B",
    ensemblePred: (cls: string, votes: number) => `Ensemble : Classe ${cls} (${votes}/3)`,
    prev: "← Précédent",
    next: "Suivant →",
    stepOf: (i: number, total: number) => `Étape ${i} / ${total}`,
  },
  ar: {
    title: "Bagging — التجميع التمهيدي",
    steps: ["بيانات", "Bootstrap", "حدود", "مجموعة"] as readonly string[],
    stepDescs: [
      "بيانات التدريب: 18 نقطة، صنفان. سيتم تدريب كل نموذج على عينة bootstrap عشوائية مع الاستبدال.",
      "أخذ عينة bootstrap: سحب N=18 نقطة مع الاستبدال. تظهر بعضها عدة مرات (×N مُعروض)، وبعضها غائب — يرى كل نموذج نسخة مختلفة من الواقع.",
      "يتعلم كل نموذج حدود قرار مختلفة قليلاً من بيانات bootstrap. لاحظ أن الخطوط المتقطعة الثلاثة لا تتفق تماماً.",
      "اسحب ✦ لاختبار أي نقطة. يصوت كل نموذج بشكل مستقل — الأغلبية = توقع المجموعة. تُلغى الأخطاء الفردية!",
    ] as readonly string[],
    svgTitles: [
      "مجموعة البيانات الأصلية — N = 18",
      "3 عينات Bootstrap (مع الاستبدال)",
      "كل نموذج يتعلم حدود قرار مختلفة",
      "تصويت المجموعة — اسحب ✦ لاختبار أي نقطة",
    ] as readonly string[],
    classA: "صنف A (0)",
    classB: "صنف B (1)",
    classAShort: "A",
    classBShort: "B",
    ensemblePred: (cls: string, votes: number) => `المجموعة: صنف ${cls} (${votes}/3)`,
    prev: "→ السابق",
    next: "التالي ←",
    stepOf: (i: number, total: number) => `خطوة ${i} / ${total}`,
  },
} as const;

const W = 540, H = 280, PAD = 30;

const toSX = (x: number) => PAD + x * (W - 2 * PAD);
const toSY = (y: number) => H - PAD - y * (H - 2 * PAD);
const fromSX = (px: number) => (px - PAD) / (W - 2 * PAD);
const fromSY = (py: number) => 1 - (py - PAD) / (H - 2 * PAD);

// 18 training points — class 0 upper-left, class 1 lower-right, some overlap
const DATA = [
  { id: 0,  x: 0.12, y: 0.82, label: 0 as const },
  { id: 1,  x: 0.22, y: 0.68, label: 0 as const },
  { id: 2,  x: 0.08, y: 0.55, label: 0 as const },
  { id: 3,  x: 0.32, y: 0.76, label: 0 as const },
  { id: 4,  x: 0.18, y: 0.45, label: 0 as const },
  { id: 5,  x: 0.38, y: 0.88, label: 0 as const },
  { id: 6,  x: 0.28, y: 0.58, label: 0 as const },
  { id: 7,  x: 0.14, y: 0.32, label: 0 as const },
  { id: 8,  x: 0.42, y: 0.64, label: 0 as const },
  { id: 9,  x: 0.75, y: 0.22, label: 1 as const },
  { id: 10, x: 0.85, y: 0.38, label: 1 as const },
  { id: 11, x: 0.68, y: 0.12, label: 1 as const },
  { id: 12, x: 0.88, y: 0.52, label: 1 as const },
  { id: 13, x: 0.58, y: 0.28, label: 1 as const },
  { id: 14, x: 0.82, y: 0.72, label: 1 as const },
  { id: 15, x: 0.65, y: 0.48, label: 1 as const },
  { id: 16, x: 0.52, y: 0.18, label: 1 as const },
  { id: 17, x: 0.78, y: 0.60, label: 1 as const },
];

// Bootstrap samples — indices (with replacement, intentional duplicates)
const BOOTS: number[][] = [
  [0, 1, 2, 3, 3, 4, 5, 5, 6, 9, 10, 11, 12, 13, 14, 15, 15, 16],
  [0, 1, 1, 3, 4, 5, 6, 7, 8, 9, 10, 10, 12, 13, 14, 16, 17, 17],
  [0, 2, 3, 4, 5, 6, 7, 8, 8, 9, 11, 12, 13, 14, 15, 16, 17, 17],
];

// Linear decision boundaries: class 1 if (x - y > threshold)
// Slightly different thresholds simulate different models from different bootstrap data
const THRESHOLDS = [0.22, 0.15, 0.28];
const MODEL_COLORS = ["#6c63ff", "#f97316", "#22c55e"];
const MODEL_NAMES  = ["Model 1", "Model 2", "Model 3"];

function classify(x: number, y: number, modelIdx: number): 0 | 1 {
  return x - y > THRESHOLDS[modelIdx] ? 1 : 0;
}


export default function BaggingViz({ accentColor = "#06b6d4" }: { accentColor?: string }) {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState({ x: 0.5, y: 0.5 });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const vt = useVizTheme();
  const L = useVizLocale(BAG_LABELS);
  const STEPS = L.steps;
  const STEP_DESCS = L.stepDescs;

  const getSVGPos = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    return {
      x: Math.max(0.05, Math.min(0.93, fromSX((e.clientX - rect.left) * (W / rect.width)))),
      y: Math.max(0.05, Math.min(0.93, fromSY((e.clientY - rect.top) * (H / rect.height)))),
    };
  }, []);

  const votes = THRESHOLDS.map((_, i) => classify(query.x, query.y, i));
  const voteA = votes.filter(v => v === 0).length;
  const voteB = votes.filter(v => v === 1).length;
  const ensemblePred: 0 | 1 = voteB > voteA ? 1 : 0;

  const qx = toSX(query.x);
  const qy = toSY(query.y);

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {STEPS[step]}
          </span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((label, i) => (
            <button key={i} onClick={() => setStep(i)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
              style={{
                backgroundColor: step === i ? `${accentColor}25` : "transparent",
                color: step === i ? accentColor : "var(--text-muted)",
                border: `1px solid ${step === i ? accentColor + "55" : "var(--border)"}`,
              }}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ cursor: step === 3 ? (dragging ? "grabbing" : "crosshair") : "default" }}
        onMouseMove={e => { if (dragging && step === 3) setQuery(getSVGPos(e)); }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Original dataset ─────────────────────────────── */}
          {step === 0 && (
            <motion.g key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={W / 2} y={20} textAnchor="middle" fontSize={11}
                fill={vt.text} fontWeight="bold">
                {L.svgTitles[0]}
              </text>
              {DATA.map(pt => (
                <motion.circle key={pt.id}
                  cx={toSX(pt.x)} cy={toSY(pt.y)} r={7}
                  fill={pt.label === 0 ? "#6c63ff" : "#ff6b6b"}
                  stroke={vt.isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)"}
                  strokeWidth={1.5}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: pt.id * 0.04, type: "spring", stiffness: 260 }}
                />
              ))}
              {/* Legend */}
              <circle cx={PAD + 8} cy={H - 12} r={5} fill="#6c63ff" />
              <text x={PAD + 18} y={H - 8} fontSize={9} fill={vt.textMuted}>{L.classA}</text>
              <circle cx={PAD + 85} cy={H - 12} r={5} fill="#ff6b6b" />
              <text x={PAD + 95} y={H - 8} fontSize={9} fill={vt.textMuted}>{L.classB}</text>
            </motion.g>
          )}

          {/* ── STEP 1: Bootstrap samples ────────────────────────────── */}
          {step === 1 && (
            <motion.g key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={W / 2} y={18} textAnchor="middle" fontSize={11}
                fill={vt.text} fontWeight="bold">
                {L.svgTitles[1]}
              </text>
              {BOOTS.map((bs, bi) => {
                const PW = (W - 2 * PAD - 16) / 3;
                const PX = PAD + bi * (PW + 8);
                const PY = 26;
                const PH = H - PY - 14;
                // Count duplicates
                const counts: Record<number, number> = {};
                bs.forEach(idx => { counts[idx] = (counts[idx] || 0) + 1; });

                return (
                  <g key={`boot-${bi}`}>
                    <rect x={PX} y={PY} width={PW} height={PH} rx={8}
                      fill={MODEL_COLORS[bi] + "10"}
                      stroke={MODEL_COLORS[bi]} strokeWidth={1.5} strokeDasharray="5,3" />
                    <text x={PX + PW / 2} y={PY + 14} textAnchor="middle"
                      fontSize={9} fill={MODEL_COLORS[bi]} fontWeight="bold">
                      {MODEL_NAMES[bi]}
                    </text>
                    {Object.entries(counts).map(([idxStr, cnt]) => {
                      const idx = Number(idxStr);
                      const pt = DATA[idx];
                      const sx = PX + pt.x * PW * 0.86 + PW * 0.07;
                      const sy = PY + (1 - pt.y) * PH * 0.82 + PH * 0.13;
                      return (
                        <g key={`b${bi}-${idx}`}>
                          <motion.circle cx={sx} cy={sy} r={cnt > 1 ? 9 : 6}
                            fill={pt.label === 0 ? "#6c63ff" : "#ff6b6b"}
                            stroke={cnt > 1 ? MODEL_COLORS[bi] : "transparent"}
                            strokeWidth={cnt > 1 ? 2.5 : 0}
                            opacity={0.85}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.025 + bi * 0.12, type: "spring", stiffness: 280 }}
                          />
                          {cnt > 1 && (
                            <text x={sx} y={sy + 4} textAnchor="middle"
                              fontSize={7} fill="white" fontWeight="bold">
                              ×{cnt}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </motion.g>
          )}

          {/* ── STEP 2: Decision boundaries ──────────────────────────── */}
          {step === 2 && (
            <motion.g key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={W / 2} y={18} textAnchor="middle" fontSize={11}
                fill={vt.text} fontWeight="bold">
                {L.svgTitles[2]}
              </text>
              {/* Decision boundaries: y = x - threshold */}
              {THRESHOLDS.map((t, bi) => {
                // Line from (t, 0) to (1, 1-t) when t<1, or (0, -t) clipped
                const x1 = Math.max(0, t), y1 = 0;
                const x2 = 1, y2 = 1 - t;
                return (
                  <motion.line key={`b-${bi}`}
                    x1={toSX(x1)} y1={toSY(y1)}
                    x2={toSX(x2)} y2={toSY(y2)}
                    stroke={MODEL_COLORS[bi]} strokeWidth={2}
                    strokeDasharray="8,5" opacity={0.85}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ delay: bi * 0.2, duration: 0.6 }}
                  />
                );
              })}
              {/* Labels for boundaries — stacked top-left to avoid overlap */}
              {THRESHOLDS.map((t, bi) => (
                <g key={`bl-${bi}`}>
                  <line x1={PAD + 2} y1={24 + bi * 16 - 4}
                    x2={PAD + 18} y2={24 + bi * 16 - 4}
                    stroke={MODEL_COLORS[bi]} strokeWidth={2} strokeDasharray="6,3" />
                  <text
                    x={PAD + 22}
                    y={24 + bi * 16}
                    fontSize={9} fill={MODEL_COLORS[bi]} fontWeight="bold">
                    {MODEL_NAMES[bi]}: x−y={t}
                  </text>
                </g>
              ))}
              {/* Data points */}
              {DATA.map(pt => (
                <circle key={pt.id}
                  cx={toSX(pt.x)} cy={toSY(pt.y)} r={6}
                  fill={pt.label === 0 ? "#6c63ff" : "#ff6b6b"}
                  stroke={vt.isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)"}
                  strokeWidth={1.5} opacity={0.75}
                />
              ))}
            </motion.g>
          )}

          {/* ── STEP 3: Ensemble vote ─────────────────────────────────── */}
          {step === 3 && (
            <motion.g key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={W / 2} y={18} textAnchor="middle" fontSize={11}
                fill={vt.text} fontWeight="bold">
                {L.svgTitles[3]}
              </text>

              {/* Background region coloring (ensemble) */}
              {Array.from({ length: 10 }, (_, row) =>
                Array.from({ length: 14 }, (_, col) => {
                  const cx2 = (col + 0.5) / 14;
                  const cy2 = (row + 0.5) / 10;
                  const vs = THRESHOLDS.map((_, i) => classify(cx2, cy2, i));
                  const pred = vs.filter(v => v === 1).length > 1 ? 1 : 0;
                  return (
                    <rect key={`bg-${row}-${col}`}
                      x={toSX(col / 14)} y={toSY((row + 1) / 10)}
                      width={(W - 2 * PAD) / 14}
                      height={(H - 2 * PAD) / 10}
                      fill={pred === 0 ? "#6c63ff" : "#ff6b6b"}
                      opacity={0.06}
                    />
                  );
                })
              )}

              {/* Decision boundaries — all 3, faint */}
              {THRESHOLDS.map((t, bi) => (
                <line key={`bl-${bi}`}
                  x1={toSX(Math.max(0, t))} y1={toSY(0)}
                  x2={toSX(1)} y2={toSY(1 - t)}
                  stroke={MODEL_COLORS[bi]} strokeWidth={1.5}
                  strokeDasharray="6,4" opacity={0.45}
                />
              ))}

              {/* Data points */}
              {DATA.map(pt => (
                <circle key={pt.id}
                  cx={toSX(pt.x)} cy={toSY(pt.y)} r={5}
                  fill={pt.label === 0 ? "#6c63ff" : "#ff6b6b"}
                  stroke={vt.isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)"}
                  strokeWidth={1} opacity={0.55}
                />
              ))}

              {/* Lines from query to vote labels */}
              {[0.16, 0.5, 0.84].map((fx, bi) => (
                <line key={`vl-${bi}`}
                  x1={qx} y1={qy}
                  x2={toSX(fx)} y2={H - 46}
                  stroke={MODEL_COLORS[bi]} strokeWidth={1}
                  strokeDasharray="3,3" opacity={0.4}
                />
              ))}

              {/* Vote badges */}
              {[0.16, 0.5, 0.84].map((fx, bi) => {
                const pred = votes[bi];
                const bx = toSX(fx) - 44;
                const by = H - 46;
                return (
                  <g key={`vb-${bi}`}>
                    <rect x={bx} y={by} width={88} height={32} rx={6}
                      fill={MODEL_COLORS[bi] + "18"} stroke={MODEL_COLORS[bi]} strokeWidth={1.2} />
                    <text x={bx + 44} y={by + 13} textAnchor="middle"
                      fontSize={8} fill={MODEL_COLORS[bi]} fontWeight="bold">
                      {MODEL_NAMES[bi]}
                    </text>
                    <text x={bx + 44} y={by + 26} textAnchor="middle"
                      fontSize={9.5} fill={pred === 0 ? "#6c63ff" : "#ff6b6b"} fontWeight="bold">
                      {pred === 0 ? L.classAShort : L.classBShort}
                    </text>
                  </g>
                );
              })}

              {/* Query point */}
              <g
                onMouseDown={e => { e.preventDefault(); setDragging(true); }}
                style={{ cursor: "grab" }}
              >
                <circle cx={qx} cy={qy} r={22} fill="transparent" />
                <motion.text
                  textAnchor="middle" fontSize={17} fill={accentColor}
                  animate={{ x: qx, y: qy + 6 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  ✦
                </motion.text>

                {/* Prediction badge above query */}
                <AnimatePresence mode="wait">
                  <motion.g key={ensemblePred}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}>
                    <rect x={qx + 12} y={qy - 30} width={80} height={22} rx={5}
                      fill={ensemblePred === 0 ? "#6c63ff" : "#ff6b6b"} opacity={0.9} />
                    <text x={qx + 52} y={qy - 15} textAnchor="middle"
                      fontSize={9} fill="white" fontWeight="bold">
                      {L.ensemblePred(ensemblePred === 0 ? L.classAShort : L.classBShort, Math.max(voteA, voteB))}
                    </text>
                  </motion.g>
                </AnimatePresence>
              </g>
            </motion.g>
          )}

        </AnimatePresence>
      </svg>

      {/* Footer: description + navigation */}
      <div className="border-t px-5 pt-3 pb-4 space-y-2" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {STEP_DESCS[step]}
        </p>
        <div className="flex items-center justify-between">
          <button
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {L.prev}
          </button>

          {step === 3 && (
            <div className="flex gap-3 text-xs font-mono">
              {THRESHOLDS.map((_, bi) => (
                <span key={bi} style={{ color: MODEL_COLORS[bi] }}>
                  M{bi + 1}={votes[bi] === 0 ? "A" : "B"}
                </span>
              ))}
              <span className="font-bold" style={{ color: ensemblePred === 0 ? "#6c63ff" : "#ff6b6b" }}>
                → {ensemblePred === 0 ? L.classA : L.classB}
              </span>
            </div>
          )}
          {step !== 3 && (
            <span className="text-xs font-semibold" style={{ color: accentColor }}>
              {L.stepOf(step + 1, STEPS.length)}
            </span>
          )}

          <button
            disabled={step === STEPS.length - 1}
            onClick={() => setStep(s => s + 1)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {L.next}
          </button>
        </div>
      </div>
    </VizCard>
  );
}
