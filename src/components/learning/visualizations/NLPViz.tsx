"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const NLP_LABELS = {
  en: {
    title: "NLP Pipeline",
    stages: ["Raw text", "Tokenize", "Vocabulary", "TF-IDF", "Classify"],
    prev: "← Prev",
    next: "Next →",
    docLabels: ["Doc 1", "Doc 2", "Doc 3"],
    tokenizeDesc: "Lowercasing + whitespace split:",
    tokenizeFooter: (n: number) => `${n} tokens · (stop-word removal, stemming would reduce this further)`,
    vocabDesc: (n: number) => `Global vocabulary (${n} unique terms across all docs):`,
    vocabFooter: (doc: string) => `Highlighted = appears in ${doc}`,
    tfidfDesc: (doc: string) => `TF-IDF weights for ${doc} — higher = more distinctive:`,
    classifyDesc: "TF-IDF vector → classifier (Multinomial NB / Logistic Regression) → predicted label:",
    classLabels: ["Animals", "Animals", "Tech"],
  },
  fr: {
    title: "Pipeline NLP",
    stages: ["Texte brut", "Tokenisation", "Vocabulaire", "TF-IDF", "Classification"],
    prev: "← Préc",
    next: "Suiv →",
    docLabels: ["Doc 1", "Doc 2", "Doc 3"],
    tokenizeDesc: "Mise en minuscules + découpage par espaces :",
    tokenizeFooter: (n: number) => `${n} tokens · (la suppression des mots vides et la racinisation réduiraient davantage)`,
    vocabDesc: (n: number) => `Vocabulaire global (${n} termes uniques dans tous les docs) :`,
    vocabFooter: (doc: string) => `Surligné = apparaît dans ${doc}`,
    tfidfDesc: (doc: string) => `Poids TF-IDF pour ${doc} — plus élevé = plus distinctif :`,
    classifyDesc: "Vecteur TF-IDF → classificateur (NB Multinomial / Régression Logistique) → étiquette prédite :",
    classLabels: ["Animaux", "Animaux", "Tech"],
  },
  ar: {
    title: "خط أنابيب NLP",
    stages: ["نص خام", "ترميز", "مفردات", "TF-IDF", "تصنيف"],
    prev: "→ السابق",
    next: "التالي ←",
    docLabels: ["وثيقة 1", "وثيقة 2", "وثيقة 3"],
    tokenizeDesc: "تصغير + تقسيم بالمسافات:",
    tokenizeFooter: (n: number) => `${n} رموز · (إزالة الكلمات الشائعة والجذع تُقلّلها أكثر)`,
    vocabDesc: (n: number) => `المفردات الكلية (${n} مصطلح فريد عبر جميع الوثائق):`,
    vocabFooter: (doc: string) => `مُميَّز = يظهر في ${doc}`,
    tfidfDesc: (doc: string) => `أوزان TF-IDF لـ ${doc} — أعلى = أكثر تمييزاً:`,
    classifyDesc: "متجه TF-IDF → مُصنِّف (NB متعدد الحدود / الانحدار اللوجستي) → التسمية المتوقعة:",
    classLabels: ["حيوانات", "حيوانات", "تقنية"],
  },
};

const DOCS = [
  "the cat sat on the mat",
  "the dog ran in the park",
  "machine learning is fun",
];
const DOC_COLORS = ["#6c63ff", "#f97316", "#22c55e"];

// Vocabulary (sorted unique tokens, stop words kept for demo)
const VOCAB = ["cat","dog","fun","is","learning","machine","mat","on","park","ran","sat","the"];

// TF-IDF values (pre-computed for illustration)
const TFIDF: number[][] = [
  // cat   dog   fun   is    learning machine mat   on    park  ran   sat   the
  [0.46, 0.00, 0.00, 0.00, 0.00,   0.00,   0.46, 0.30, 0.00, 0.00, 0.46, 0.00],
  [0.00, 0.46, 0.00, 0.00, 0.00,   0.00,   0.00, 0.00, 0.46, 0.46, 0.00, 0.00],
  [0.00, 0.00, 0.51, 0.51, 0.51,   0.51,   0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
];


export default function NLPViz({ accentColor = "#06b6d4" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(NLP_LABELS);
  const [stage, setStage] = useState(0);
  const [activeDoc, setActiveDoc] = useState(0);

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {L.title} — {L.stages[stage]}
        </span>
        <div className="flex gap-2">
          {L.docLabels.map((l, i) => (
            <button key={i} onClick={() => setActiveDoc(i)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: activeDoc===i ? `${DOC_COLORS[i]}22` : "transparent",
                color: activeDoc===i ? DOC_COLORS[i] : vt.textMuted,
                border:`1px solid ${activeDoc===i ? DOC_COLORS[i]+"55" : "var(--border)"}`,
              }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* pipeline progress */}
      <div className="flex px-5 pt-4 pb-2 gap-1">
        {L.stages.map((s, i) => (
          <button key={s} onClick={() => setStage(i)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: i <= stage ? `${accentColor}22` : vt.surface,
              color: i <= stage ? accentColor : vt.textMuted,
              border:`1px solid ${i === stage ? accentColor+"55" : i < stage ? accentColor+"30" : "var(--border)"}`,
            }}>
            {i < stage ? "✓ " : ""}{s}
          </button>
        ))}
      </div>

      {/* stage content */}
      <div className="px-5 pb-4 min-h-[160px]">
        <AnimatePresence mode="wait">
          <motion.div key={`${stage}-${activeDoc}`}
            initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            transition={{ duration:0.2 }}>

            {/* Stage 0: Raw text */}
            {stage === 0 && (
              <div className="mt-3 space-y-2">
                {DOCS.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs font-semibold mt-0.5 min-w-[40px]" style={{ color:DOC_COLORS[i] }}>{L.docLabels[i]}:</span>
                    <span className="text-sm font-mono p-2 rounded-lg flex-1"
                      style={{ backgroundColor:vt.surface, color: i===activeDoc ? "var(--text-primary)" : vt.textMuted, border:`1px solid ${i===activeDoc ? DOC_COLORS[i]+"40" : "transparent"}` }}>
                      &quot;{d}&quot;
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Stage 1: Tokenize */}
            {stage === 1 && (
              <div className="mt-3">
                <div className="text-xs mb-2" style={{ color:vt.textMuted }}>{L.tokenizeDesc}</div>
                <div className="flex flex-wrap gap-1.5">
                  {DOCS[activeDoc].split(" ").map((tok, i) => (
                    <motion.span key={i}
                      initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                      transition={{ delay: i * 0.06 }}
                      className="px-2 py-1 rounded text-xs font-mono font-semibold"
                      style={{ backgroundColor:`${DOC_COLORS[activeDoc]}22`, color:DOC_COLORS[activeDoc], border:`1px solid ${DOC_COLORS[activeDoc]}40` }}>
                      {tok}
                    </motion.span>
                  ))}
                </div>
                <div className="mt-2 text-xs" style={{ color:vt.textMuted }}>
                  {L.tokenizeFooter(DOCS[activeDoc].split(" ").length)}
                </div>
              </div>
            )}

            {/* Stage 2: Vocabulary */}
            {stage === 2 && (
              <div className="mt-3">
                <div className="text-xs mb-2" style={{ color:vt.textMuted }}>
                  {L.vocabDesc(VOCAB.length)}
                </div>
                <div className="flex flex-wrap gap-1">
                  {VOCAB.map((w, i) => {
                    const inDoc = DOCS[activeDoc].split(" ").includes(w);
                    return (
                      <span key={i}
                        className="px-2 py-0.5 rounded text-xs font-mono"
                        style={{
                          backgroundColor: inDoc ? `${DOC_COLORS[activeDoc]}22` : vt.surface,
                          color: inDoc ? DOC_COLORS[activeDoc] : vt.textFaint,
                          border:`1px solid ${inDoc ? DOC_COLORS[activeDoc]+"40" : "transparent"}`,
                          fontWeight: inDoc ? 700 : 400,
                        }}>
                        {w}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs" style={{ color:vt.textMuted }}>
                  {L.vocabFooter(L.docLabels[activeDoc])}
                </div>
              </div>
            )}

            {/* Stage 3: TF-IDF */}
            {stage === 3 && (
              <div className="mt-3">
                <div className="text-xs mb-2" style={{ color:vt.textMuted }}>
                  {L.tfidfDesc(L.docLabels[activeDoc])}
                </div>
                <div className="space-y-1">
                  {VOCAB.map((w, j) => {
                    const val = TFIDF[activeDoc][j];
                    if (val < 0.01) return null;
                    return (
                      <div key={j} className="flex items-center gap-2">
                        <span className="text-xs font-mono w-20 text-right" style={{ color:vt.textMuted }}>{w}</span>
                        <div className="flex-1 h-4 rounded" style={{ backgroundColor:vt.surface }}>
                          <motion.div className="h-4 rounded flex items-center px-2"
                            style={{ backgroundColor:`${DOC_COLORS[activeDoc]}99` }}
                            initial={{ width:0 }} animate={{ width:`${val * 200}%` }}
                            transition={{ duration:0.5, delay: j*0.05 }}>
                          </motion.div>
                        </div>
                        <span className="text-xs font-mono w-10" style={{ color:DOC_COLORS[activeDoc] }}>{val.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stage 4: Classify */}
            {stage === 4 && (
              <div className="mt-3 space-y-3">
                <div className="text-xs" style={{ color:vt.textMuted }}>
                  {L.classifyDesc}
                </div>
                {DOCS.map((d, i) => {
                  const label = L.classLabels[i];
                  const confidence = i === 2 ? 0.94 : i === 0 ? 0.88 : 0.79;
                  return (
                    <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay: i*0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ backgroundColor: i===activeDoc ? `${DOC_COLORS[i]}10` : "transparent", border:`1px solid ${i===activeDoc ? DOC_COLORS[i]+"30" : "transparent"}` }}>
                      <span className="text-xs font-semibold w-12" style={{ color:DOC_COLORS[i] }}>{L.docLabels[i]}</span>
                      <span className="text-xs font-mono flex-1" style={{ color:vt.textMuted }}>&quot;{d.slice(0,30)}…&quot;</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{ backgroundColor:`${DOC_COLORS[i]}22`, color:DOC_COLORS[i] }}>
                        {label}
                      </span>
                      <span className="text-xs font-mono" style={{ color:"#22c55e" }}>{(confidence*100).toFixed(0)}%</span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor:"var(--border)" }}>
        <button onClick={() => setStage(s => Math.max(0, s-1))} disabled={stage===0}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor:stage>0?`${accentColor}22`:"var(--bg-card)", color:stage>0?accentColor:vt.textMuted, border:`1px solid ${stage>0?accentColor+"50":"var(--border)"}` }}>
          {L.prev}
        </button>
        <div className="flex gap-0.5">
          {L.stages.map((_, i) => (
            <div key={i} className="w-6 h-1 rounded-full transition-colors duration-200"
              style={{ backgroundColor: i <= stage ? accentColor : vt.surface }} />
          ))}
        </div>
        <button onClick={() => setStage(s => Math.min(L.stages.length-1, s+1))} disabled={stage===L.stages.length-1}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor:stage<L.stages.length-1?`${accentColor}22`:"var(--bg-card)", color:stage<L.stages.length-1?accentColor:vt.textMuted, border:`1px solid ${stage<L.stages.length-1?accentColor+"50":"var(--border)"}` }}>
          {L.next}
        </button>
      </div>
    </div>
  );
}
