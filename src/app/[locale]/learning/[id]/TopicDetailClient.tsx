"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { topicContents } from "@/lib/learningContent";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import CodeBlock from "@/components/learning/CodeBlock";
import InsightBox from "@/components/learning/InsightBox";
import AlgorithmSteps from "@/components/learning/AlgorithmSteps";
import FormulaCard from "@/components/learning/FormulaCard";
import dynamic from "next/dynamic";
import type { ArchType } from "@/components/learning/visualizations/ArchDiagram";
import { quizData } from "@/lib/quizData";
import { getSectionI18n, getKeyFormulaI18n } from "@/lib/learningContent/i18n";
import { getTopicVideos } from "@/lib/learningContent/manim-videos";
import { VizPlaceholder, VisualizationSelector } from "./VizSelector";

// KaTeX is ~280 KB and MathBlock renders formulas client-side in a useEffect
// (never in the SSR HTML), so lazy-loading it splits KaTeX into its own chunk
// and keeps it out of the initial bundle — lowering TBT/bootup on topic pages.
const MathBlock = dynamic(() => import("@/components/learning/MathBlock"), {
  ssr: false,
  loading: () => <div aria-hidden style={{ minHeight: 44 }} />,
});

const ManimVideoPanel = dynamic(() => import("@/components/learning/ManimVideoPanel"), { ssr: false });
const QuizBlock = dynamic(() => import("@/components/learning/QuizBlock"), { ssr: false });
const NextTopicsPanel = dynamic(() => import("@/components/learning/NextTopicsPanel"), { ssr: false });

// ── Architecture diagrams (topic-specific, no switcher) ───────────────────────
const ArchDiagram = dynamic(
  () => import("@/components/learning/visualizations/ArchDiagram"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);

// ── Architecture maps ─────────────────────────────────────────────────────────
// Single architecture per topic
const ARCH_MAP: Partial<Record<string, ArchType>> = {
  "linear-regression": "linear-regression",
  "neural-networks":   "mlp",
  "model-evaluation":  "evaluation",
  "error-analysis":    "bias-variance",
  "bagging-stacking":  "bagging",
  "ova-ovo":           "multiclass",
};

// Topics with multiple architectures shown stacked
const MULTI_ARCH_MAP: Partial<Record<string, ArchType[]>> = {
  "svm-knn-svr":            ["svm", "knn", "svr"],
  "decision-tree-rf":       ["decision-tree", "random-forest"],
  "gradient-boosting":      ["gradient-boosting", "xgboost", "lightgbm", "catboost"],
  "rnn-lstm-gru":           ["rnn", "lstm", "gru"],
  "generative-models":      ["gan", "vae"],
  "cnn-architectures":      ["cnn", "resnet", "vit"],
  "transformers-attention": ["transformer", "bert"],
};

// ── Section icons & animations ────────────────────────────────────────────────
const sectionIcons: Record<string, string> = {
  motivation: "🎯",
  intuition:  "💡",
  math:       "∑",
  algorithm:  "⚙️",
  code:       "</>",
  insight:    "🔭",
  pitfall:    "⚠️",
  comparison: "⚖️",
  deepdive:   "🔬",
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

// ── Props & component ─────────────────────────────────────────────────────────
interface Props {
  topicId: string;
  accentColor: string;
  visualization: string;
}

export default function TopicDetailClient({ topicId, accentColor, visualization }: Props) {
  const t = useTranslations("learning");
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const content = topicContents[topicId];
  const { getStatus, markReading, markComplete, markUnread } = useTopicProgress();
  const status = getStatus(topicId);

  // Mark as "reading" the first time the user opens the topic
  useEffect(() => { markReading(topicId); }, [topicId, markReading]);

  if (!content) {
    return (
      <div className="py-12 text-center" style={{ color: "var(--text-muted)" }}>
        <p className="text-4xl mb-4">🚧</p>
        <p className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          {t("content_coming_soon")}
        </p>
        <p>{t("content_soon_desc")}</p>
      </div>
    );
  }

  const archType  = ARCH_MAP[topicId];
  const multiArch = MULTI_ARCH_MAP[topicId];
  const hasArch   = Boolean(archType || multiArch);

  return (
    <div className="space-y-2">

      {/* ── Manim Video Gallery ──────────────────────────────────────────── */}
      {getTopicVideos(topicId).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="my-8"
        >
          <ManimVideoPanel topicId={topicId} accentColor={accentColor} />
        </motion.div>
      )}

      {/* ── Key Formulas ─────────────────────────────────────────────── */}
      {content.keyFormulas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}>
            <span style={{ color: accentColor }}>∑</span>
            {t("key_formulas")}
          </h2>
          <FormulaCard
            formulas={content.keyFormulas.map((f, fi) => {
              const kfi = getKeyFormulaI18n(topicId, fi);
              return {
                ...f,
                name:    locale === "fr" ? (kfi?.nameFr    ?? f.name)    : locale === "ar" ? (kfi?.nameAr    ?? f.name)    : f.name,
                meaning: locale === "fr" ? (kfi?.meaningFr ?? f.meaning) : locale === "ar" ? (kfi?.meaningAr ?? f.meaning) : f.meaning,
              };
            })}
            accentColor={accentColor}
          />
        </motion.div>
      )}

      {/* ── Interactive Simulation ────────────────────────────────────── */}
      {visualization !== "generic" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="my-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}>
            <span style={{ color: accentColor }}>▶</span>
            {t("interactive_simulation")}
          </h2>
          <VisualizationSelector type={visualization} accentColor={accentColor} />
        </motion.div>
      )}

      {/* ── Architecture Diagram ──────────────────────────────────────── */}
      {hasArch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="my-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}>
            <span style={{ color: accentColor }}>⬡</span>
            {t("model_architecture")}
          </h2>

          {/* Multiple architectures (e.g. SVM + KNN + SVR) */}
          {multiArch && (
            <div className="space-y-4">
              {multiArch.map(atype => (
                <ArchDiagram key={atype} type={atype} accentColor={accentColor} />
              ))}
            </div>
          )}

          {/* Single architecture */}
          {archType && !multiArch && (
            <ArchDiagram type={archType} accentColor={accentColor} />
          )}
        </motion.div>
      )}

      {/* ── Content Sections ──────────────────────────────────────────── */}
      {content.sections.map((section, i) => {
        const tr = getSectionI18n(topicId, i);
        const heading  = locale === "fr" ? (tr?.headingFr  ?? section.heading)
                       : locale === "ar" ? (tr?.headingAr  ?? section.heading)
                       : section.heading;
        const text     = locale === "fr" ? (tr?.textFr     ?? section.text)
                       : locale === "ar" ? (tr?.textAr     ?? section.text)
                       : section.text;
        const callout  = locale === "fr" ? (tr?.calloutFr  ?? section.callout)
                       : locale === "ar" ? (tr?.calloutAr  ?? section.callout)
                       : section.callout;
        const steps    = locale === "fr" ? (tr?.stepsFr          ?? section.steps)
                       : locale === "ar" ? (tr?.stepsAr          ?? section.steps)
                       : section.steps;
        const formulaLabel = locale === "fr" ? (tr?.formulaLabelFr ?? section.formulaLabel)
                           : locale === "ar" ? (tr?.formulaLabelAr ?? section.formulaLabel)
                           : section.formulaLabel;
        // Code: French uses translated version if available; Arabic keeps English
        const code = locale === "fr" ? (tr?.codeFr ?? section.code) : section.code;
        return (
          <motion.div
            key={i}
            custom={i}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-10"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                {sectionIcons[section.type] || "●"}
              </div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                {heading}
              </h2>
              <div
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
              >
                {section.type}
              </div>
            </div>

            {text && (
              <p className="leading-relaxed mb-4 text-base"
                style={{ color: "var(--text-secondary)" }}>
                {text}
              </p>
            )}

            {callout && (
              <InsightBox variant="insight" accentColor={accentColor}>
                {callout}
              </InsightBox>
            )}

            {section.formula && (
              <MathBlock
                formula={section.formula}
                label={formulaLabel}
                accentColor={accentColor}
              />
            )}

            {steps && steps.length > 0 && (
              <AlgorithmSteps steps={steps} accentColor={accentColor} />
            )}

            {code && (
              <CodeBlock
                code={code}
                language={section.language || "python"}
                accentColor={accentColor}
              />
            )}

            {i < content.sections.length - 1 && (
              <div className="mt-8 border-t" style={{ borderColor: "var(--border)" }} />
            )}
          </motion.div>
        );
      })}

      {/* ── Knowledge Check ───────────────────────────────────────────── */}
      {quizData[topicId] && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-12"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <span style={{ color: accentColor }}>?</span>
            {t("knowledge_check")}
          </h2>
          <QuizBlock topicId={topicId} accentColor={accentColor} onPassed={() => markComplete(topicId)} />
        </motion.div>
      )}

      {/* ── Mark as complete ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-8 pt-8 border-t flex flex-col items-center gap-3"
        style={{ borderColor: "var(--border)" }}
      >
        {status === "completed" ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">🎉</div>
            <span className="text-sm font-semibold" style={{ color: "#22c55e" }}>
              {t("topic_completed")}
            </span>
            <button
              onClick={() => markUnread(topicId)}
              className="text-xs underline"
              style={{ color: "var(--text-muted)" }}
            >
              {t("mark_unread")}
            </button>
          </div>
        ) : (
          <button
            onClick={() => markComplete(topicId)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: `${accentColor}22`,
              color: accentColor,
              border: `1.5px solid ${accentColor}50`,
            }}
          >
            <span className="text-base">✓</span>
            {t("mark_complete")}
          </button>
        )}
        <p className="text-xs text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
          {t("progress_note")}
        </p>
      </motion.div>

      {/* ── What to study next ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-6"
      >
        <NextTopicsPanel />
      </motion.div>

    </div>
  );
}
