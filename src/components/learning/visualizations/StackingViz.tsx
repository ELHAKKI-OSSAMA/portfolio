"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const STACK_LABELS = {
  en: {
    title: "Stacked Generalization (Stacking)",
    prev: "← Prev",
    next: "Next →",
    phases: [
      {
        title: "Phase 1 — Train Base Models (K-Fold CV)",
        desc: "Each base model is trained K times on different folds. Predictions on held-out folds produce Out-Of-Fold (OOF) predictions — free of target leakage.",
      },
      {
        title: "Phase 2 — Collect OOF Predictions",
        desc: "OOF predictions from all base models form a new feature matrix. Each row: one sample. Each column: one model's OOF prediction.",
      },
      {
        title: "Phase 3 — Train Meta-Learner",
        desc: "A meta-learner (often Logistic Regression or Ridge) is trained on the OOF predictions. It learns how to combine base model outputs optimally.",
      },
      {
        title: "Phase 4 — Final Prediction",
        desc: "At inference: run all base models, collect predictions, feed into meta-learner → final output. Stacking beats any individual base model.",
      },
    ],
  },
  fr: {
    title: "Généralisation Empilée (Stacking)",
    prev: "← Préc",
    next: "Suiv →",
    phases: [
      {
        title: "Phase 1 — Entraîner les Modèles de Base (K-Fold CV)",
        desc: "Chaque modèle de base est entraîné K fois sur des plis différents. Les prédictions sur les plis tenus hors forment des prédictions hors-plis (OOF) — sans fuite de cibles.",
      },
      {
        title: "Phase 2 — Collecter les Prédictions OOF",
        desc: "Les prédictions OOF de tous les modèles forment une nouvelle matrice de caractéristiques. Chaque ligne : un échantillon. Chaque colonne : la prédiction OOF d'un modèle.",
      },
      {
        title: "Phase 3 — Entraîner le Méta-Apprenant",
        desc: "Un méta-apprenant (souvent Régression Logistique ou Ridge) est entraîné sur les prédictions OOF. Il apprend à combiner les sorties des modèles de base de manière optimale.",
      },
      {
        title: "Phase 4 — Prédiction Finale",
        desc: "À l'inférence : exécuter tous les modèles de base, collecter les prédictions, alimenter le méta-apprenant → sortie finale. Le stacking surpasse tout modèle de base individuel.",
      },
    ],
  },
  ar: {
    title: "التعميم المتراكم (Stacking)",
    prev: "→ السابق",
    next: "التالي ←",
    phases: [
      {
        title: "المرحلة 1 — تدريب النماذج الأساسية (K-Fold CV)",
        desc: "يُدرَّب كل نموذج أساسي K مرات على طيات مختلفة. تنتج التنبؤات على الطيات المحجوزة تنبؤات خارج الطية (OOF) — خالية من تسرب الهدف.",
      },
      {
        title: "المرحلة 2 — جمع تنبؤات OOF",
        desc: "تنبؤات OOF من جميع النماذج الأساسية تشكّل مصفوفة ميزات جديدة. كل صف: عينة واحدة. كل عمود: تنبؤ OOF لنموذج واحد.",
      },
      {
        title: "المرحلة 3 — تدريب الميتا-متعلم",
        desc: "يُدرَّب ميتا-متعلم (غالباً الانحدار اللوجستي أو Ridge) على تنبؤات OOF. يتعلم كيفية دمج مخرجات النماذج الأساسية بشكل مثالي.",
      },
      {
        title: "المرحلة 4 — التنبؤ النهائي",
        desc: "عند الاستدلال: تشغيل جميع النماذج الأساسية، جمع التنبؤات، تغذية الميتا-متعلم → المخرج النهائي. يتفوق Stacking على أي نموذج أساسي منفرد.",
      },
    ],
  },
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────
interface BaseModel {
  id: string;
  label: string;
  short: string;
  color: string;
  pred: number[];   // OOF predictions for 6 samples
}

// ── Data ─────────────────────────────────────────────────────────────────────
const BASE_MODELS: BaseModel[] = [
  {
    id: "dt",  label: "Decision Tree", short: "DT",
    color: "#6c63ff",
    pred: [0.82, 0.21, 0.91, 0.38, 0.76, 0.15],
  },
  {
    id: "svm", label: "SVM",           short: "SVM",
    color: "#10b981",
    pred: [0.79, 0.29, 0.88, 0.44, 0.71, 0.22],
  },
  {
    id: "knn", label: "KNN",           short: "KNN",
    color: "#f59e0b",
    pred: [0.75, 0.18, 0.93, 0.51, 0.68, 0.19],
  },
];

const TRUTH = [1, 0, 1, 0, 1, 0];   // true labels (for demo)
const SAMPLES = ["s₁","s₂","s₃","s₄","s₅","s₆"];

// Simple logistic-like meta prediction: average > 0.55
function metaPred(idx: number) {
  const avg = BASE_MODELS.reduce((s, m) => s + m.pred[idx], 0) / BASE_MODELS.length;
  return Math.min(0.99, Math.max(0.01, avg + (idx % 3 === 1 ? -0.12 : 0.04)));
}
const META_PRED = SAMPLES.map((_, i) => metaPred(i));

// ── Phase IDs (for key only) ──────────────────────────────────────────────────
const PHASE_IDS = ["train", "oof", "meta", "predict"];

export default function StackingViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const [phase, setPhase] = useState(0);
  const vt = useVizTheme();
  const L = useVizLocale(STACK_LABELS);
  const PHASES = PHASE_IDS.map((id, i) => ({ id, ...L.phases[i] }));
  const cur = PHASES[phase];

  const cardBg  = "var(--bg-card)";
  const border  = "var(--border)";
  const textP   = "var(--text-primary)";
  const textM   = "var(--text-muted)";

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: cardBg, borderColor: border }}>

      {/* Header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: border }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm font-semibold" style={{ color: textP }}>
            {L.title}
          </span>
          <div className="flex gap-1">
            {PHASES.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setPhase(i)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: i === phase ? `${accentColor}20` : "transparent",
                  color: i === phase ? accentColor : textM,
                  border: `1px solid ${i === phase ? accentColor + "50" : border}`,
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cur.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="px-5 py-2.5 border-b"
          style={{ borderColor: border }}
        >
          <p className="text-xs font-semibold mb-0.5" style={{ color: accentColor }}>{cur.title}</p>
          <p className="text-xs leading-relaxed" style={{ color: textM }}>{cur.desc}</p>
        </motion.div>
      </AnimatePresence>

      {/* Main diagram */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {phase === 0 && <Phase1 key="p1" accent={accentColor} vt={vt} />}
          {phase === 1 && <Phase2 key="p2" accent={accentColor} vt={vt} />}
          {phase === 2 && <Phase3 key="p3" accent={accentColor} vt={vt} />}
          {phase === 3 && <Phase4 key="p4" accent={accentColor} vt={vt} />}
        </AnimatePresence>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: border }}>
        <button
          onClick={() => setPhase(p => Math.max(0, p - 1))}
          disabled={phase === 0}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
          }}
        >
          {L.prev}
        </button>
        <div className="flex gap-1.5">
          {PHASES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === phase ? 20 : 6,
                height: 6,
                backgroundColor: i === phase ? accentColor : vt.isDark ? "#475569" : "#cbd5e1",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setPhase(p => Math.min(PHASES.length - 1, p + 1))}
          disabled={phase === PHASES.length - 1}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
          }}
        >
          {L.next}
        </button>
      </div>
    </div>
  );
}

// ── Phase 1: Train base models with K-fold ────────────────────────────────────
function Phase1({ accent, vt }: { accent: string; vt: ReturnType<typeof useVizTheme> }) {
  const K = 3;
  const foldColors = ["#ef4444", "#f59e0b", "#10b981"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <svg viewBox="0 0 520 220" className="w-full">
        {/* Training data: K folds */}
        <text x={10} y={14} fontSize={9} fill={vt.textMuted} fontWeight="bold">Training Data (K=3 folds)</text>
        {Array.from({ length: K }, (_, fi) => (
          <g key={fi}>
            <rect x={10} y={22 + fi * 28} width={360} height={20} rx={4}
              fill={vt.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}
              stroke={vt.border} strokeWidth={1} />
            {/* Fold segments */}
            {Array.from({ length: K }, (_, si) => (
              <rect key={si} x={10 + si * 120} y={22 + fi * 28} width={120} height={20} rx={si === fi ? 4 : 0}
                fill={si === fi ? foldColors[fi] : "transparent"}
                opacity={0.35} />
            ))}
            <text x={20} y={36 + fi * 28} fontSize={7.5} fill={vt.textMuted}>
              Fold {fi + 1}
            </text>
            {/* Validation marker */}
            <rect x={10 + fi * 120} y={22 + fi * 28} width={120} height={20}
              fill={foldColors[fi]} opacity={0.5} rx={3} />
            <text x={10 + fi * 120 + 60} y={36 + fi * 28} textAnchor="middle"
              fontSize={7.5} fill="#fff" fontWeight="bold">val</text>
          </g>
        ))}

        {/* Base model boxes */}
        <text x={10} y={110} fontSize={9} fill={vt.textMuted} fontWeight="bold">Base Models (Level 0)</text>
        {BASE_MODELS.map((m, i) => (
          <motion.g key={m.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}>
            <rect x={10 + i * 128} y={118} width={118} height={40} rx={8}
              fill={`${m.color}20`} stroke={m.color} strokeWidth={1.5} />
            <text x={69 + i * 128} y={134} textAnchor="middle" fontSize={9} fontWeight="bold" fill={m.color}>
              {m.label}
            </text>
            <text x={69 + i * 128} y={148} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
              trained 3× (one per fold)
            </text>
          </motion.g>
        ))}

        {/* Arrows */}
        {BASE_MODELS.map((m, i) => (
          <line key={`a-${i}`}
            x1={69 + i * 128} y1={90} x2={69 + i * 128} y2={116}
            stroke={m.color} strokeWidth={1.5} strokeDasharray="3,2" />
        ))}

        {/* OOF arrow */}
        <text x={10} y={175} fontSize={8.5} fill={vt.ink(accent)} fontWeight="bold">→ Produces OOF predictions (no leakage!)</text>
        <text x={10} y={188} fontSize={7.5} fill={vt.textMuted}>Each sample is predicted exactly once — when its fold is the validation fold.</text>
        <text x={10} y={200} fontSize={7.5} fill={vt.textMuted}>This is the key trick: base models never see the target of the sample they predict.</text>
      </svg>
    </motion.div>
  );
}

// ── Phase 2: OOF feature matrix ───────────────────────────────────────────────
function Phase2({ accent, vt }: { accent: string; vt: ReturnType<typeof useVizTheme> }) {
  const CW = 68, CH = 22, startX = 100, startY = 30;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <svg viewBox="0 0 520 220" className="w-full">
        {/* Column headers (model names) */}
        {BASE_MODELS.map((m, j) => (
          <text key={m.id}
            x={startX + j * CW + CW / 2} y={startY - 8}
            textAnchor="middle" fontSize={9} fontWeight="bold" fill={m.color}>
            {m.short}
          </text>
        ))}
        <text x={startX + 3 * CW + 30} y={startY - 8} textAnchor="middle" fontSize={8} fill={vt.textMuted}>True y</text>

        {/* Row headers (samples) and cells */}
        {SAMPLES.map((s, i) => (
          <g key={s}>
            <text x={startX - 8} y={startY + i * CH + CH / 2 + 4}
              textAnchor="end" fontSize={8.5} fill={vt.textMuted}>{s}</text>
            {BASE_MODELS.map((m, j) => (
              <motion.g key={m.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i * 3 + j) * 0.04 }}>
                <rect x={startX + j * CW} y={startY + i * CH} width={CW - 2} height={CH - 2} rx={3}
                  fill={`${m.color}18`} stroke={`${m.color}40`} strokeWidth={1} />
                <text x={startX + j * CW + CW / 2 - 1} y={startY + i * CH + CH / 2 + 4}
                  textAnchor="middle" fontSize={8} fill={m.color} fontFamily="monospace">
                  {m.pred[i].toFixed(2)}
                </text>
              </motion.g>
            ))}
            {/* True label */}
            <rect x={startX + 3 * CW + 8} y={startY + i * CH} width={40} height={CH - 2} rx={3}
              fill={TRUTH[i] ? "#10b98120" : "#ef444420"}
              stroke={TRUTH[i] ? "#10b98150" : "#ef444450"} strokeWidth={1} />
            <text x={startX + 3 * CW + 28} y={startY + i * CH + CH / 2 + 4}
              textAnchor="middle" fontSize={8} fill={TRUTH[i] ? "#10b981" : "#ef4444"} fontWeight="bold">
              {TRUTH[i]}
            </text>
          </g>
        ))}

        {/* Bottom label */}
        <text x={startX + 1.5 * CW} y={startY + SAMPLES.length * CH + 16}
          textAnchor="middle" fontSize={8} fill={vt.ink(accent)} fontWeight="bold">
          New feature matrix X_meta
        </text>
        <text x={260} y={startY + SAMPLES.length * CH + 32}
          textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
          Shape: (N_train × n_models) — becomes the training set for the meta-learner
        </text>
        <text x={260} y={startY + SAMPLES.length * CH + 46}
          textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
          Using OOF predictions prevents target leakage that plain predict() would cause.
        </text>
      </svg>
    </motion.div>
  );
}

// ── Phase 3: Meta-learner training ────────────────────────────────────────────
function Phase3({ accent, vt }: { accent: string; vt: ReturnType<typeof useVizTheme> }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <svg viewBox="0 0 520 220" className="w-full">
        {/* Input: OOF matrix */}
        <rect x={6} y={40} width={120} height={100} rx={8}
          fill={vt.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"}
          stroke={vt.border} strokeWidth={1} />
        <text x={66} y={58} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={vt.textMuted}>X_meta</text>
        <text x={66} y={72} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>(OOF predictions)</text>
        {BASE_MODELS.map((m, i) => (
          <g key={m.id}>
            <rect x={16} y={80 + i * 20} width={100} height={14} rx={3}
              fill={`${m.color}18`} stroke={`${m.color}40`} strokeWidth={1} />
            <text x={66} y={90 + i * 20} textAnchor="middle" fontSize={7} fill={m.color}>
              {m.label} OOF
            </text>
          </g>
        ))}

        {/* Arrow */}
        <line x1={126} y1={90} x2={180} y2={90} stroke={vt.axis} strokeWidth={1.5}
          markerEnd="url(#arr-meta)" />
        <defs>
          <marker id="arr-meta" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 Z" fill={vt.axis} />
          </marker>
        </defs>

        {/* Meta-learner box */}
        <rect x={180} y={50} width={160} height={80} rx={10}
          fill={`${accent}15`} stroke={`${accent}50`} strokeWidth={2} />
        <text x={260} y={76} textAnchor="middle" fontSize={10} fontWeight="bold" fill={vt.ink(accent)}>
          Meta-Learner
        </text>
        <text x={260} y={92} textAnchor="middle" fontSize={8} fill={vt.textMuted}>(Level 1)</text>
        <text x={260} y={108} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Logistic Regression</text>
        <text x={260} y={120} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>Ridge · XGBoost · etc.</text>

        {/* Output */}
        <line x1={340} y1={90} x2={392} y2={90} stroke={vt.axis} strokeWidth={1.5}
          markerEnd="url(#arr-meta)" />
        <rect x={392} y={60} width={118} height={60} rx={8}
          fill={vt.isDark ? "#05966920" : "#d1fae520"}
          stroke="#10b981" strokeWidth={1.5} />
        <text x={451} y={82} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.ink("#10b981")}>Final ŷ</text>
        <text x={451} y={96} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>combines all</text>
        <text x={451} y={108} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>base outputs</text>

        {/* Key insight */}
        <rect x={6} y={156} width={508} height={52} rx={8}
          fill={vt.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"}
          stroke={vt.border} strokeWidth={1} />
        <text x={260} y={172} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={vt.ink(accent)}>
          Why does stacking work?
        </text>
        <text x={260} y={186} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
          The meta-learner discovers which base models are most reliable for which part of input space.
        </text>
        <text x={260} y={199} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
          Unlike simple averaging, it learns adaptive, weighted combinations → lower generalization error.
        </text>
      </svg>
    </motion.div>
  );
}

// ── Phase 4: Full inference pipeline ─────────────────────────────────────────
function Phase4({ accent, vt }: { accent: string; vt: ReturnType<typeof useVizTheme> }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <svg viewBox="0 0 520 260" className="w-full">
        {/* New sample */}
        <rect x={6} y={80} width={64} height={40} rx={8}
          fill={vt.isDark ? "#334155" : "#e2e8f0"} stroke={vt.border} strokeWidth={1} />
        <text x={38} y={96} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={vt.text}>New</text>
        <text x={38} y={110} textAnchor="middle" fontSize={8} fill={vt.textMuted}>sample x</text>
        <defs>
          <marker id="arr-p4" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 Z" fill={vt.axis} />
          </marker>
        </defs>

        {/* Fan out to base models — tighter spacing (48px) to avoid stats box overlap */}
        {BASE_MODELS.map((m, i) => {
          const cy = 44 + i * 48;
          return (
            <motion.g key={m.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              <line x1={70} y1={100} x2={134} y2={cy + 16}
                stroke={m.color} strokeWidth={1.5} markerEnd="url(#arr-p4)" />
              <rect x={134} y={cy} width={108} height={32} rx={7}
                fill={`${m.color}18`} stroke={m.color} strokeWidth={1.5} />
              <text x={188} y={cy + 14} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={m.color}>
                {m.label}
              </text>
              <text x={188} y={cy + 26} textAnchor="middle" fontSize={7.5} fill={m.color}>
                → {META_PRED[i % 6].toFixed(2)}
              </text>
              <line x1={242} y1={cy + 16} x2={308} y2={100}
                stroke={m.color} strokeWidth={1.5} markerEnd="url(#arr-p4)" />
            </motion.g>
          );
        })}

        {/* Meta-learner */}
        <rect x={308} y={68} width={114} height={64} rx={10}
          fill={`${accent}18`} stroke={accent} strokeWidth={2} />
        <text x={365} y={88} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.ink(accent)}>Meta-</text>
        <text x={365} y={101} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.ink(accent)}>Learner</text>
        <text x={365} y={115} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>combines outputs</text>
        <line x1={422} y1={100} x2={450} y2={100}
          stroke={accent} strokeWidth={1.5} markerEnd="url(#arr-p4)" />

        {/* Final output */}
        <rect x={450} y={74} width={64} height={52} rx={8}
          fill={vt.isDark ? "#05966920" : "#d1fae520"} stroke="#10b981" strokeWidth={2} />
        <text x={482} y={95} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.ink("#10b981")}>ŷ</text>
        <text x={482} y={109} textAnchor="middle" fontSize={7.5} fill={vt.ink("#10b981")}>final</text>

        {/* Stats comparison — pushed below the model fan (bottom of model 3 = 44+2*48+32=172) */}
        <rect x={6} y={188} width={508} height={60} rx={8}
          fill={vt.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"}
          stroke={vt.border} strokeWidth={1} />
        <text x={260} y={205} textAnchor="middle" fontSize={9} fontWeight="bold" fill={vt.ink(accent)}>
          Stacking vs Individual Models
        </text>
        <text x={260} y={220} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
          Stacking consistently outperforms the best single base model — meta-learner exploits complementary strengths.
        </text>
        <text x={260} y={235} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
          Rule of thumb: use diverse base models (tree + linear + kernel) for maximum benefit.
        </text>
      </svg>
    </motion.div>
  );
}
