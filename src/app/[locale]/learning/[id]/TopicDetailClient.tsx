"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { topicContents } from "@/lib/learningContent";
import MathBlock from "@/components/learning/MathBlock";
import CodeBlock from "@/components/learning/CodeBlock";
import InsightBox from "@/components/learning/InsightBox";
import AlgorithmSteps from "@/components/learning/AlgorithmSteps";
import FormulaCard from "@/components/learning/FormulaCard";
import dynamic from "next/dynamic";
import type { ArchType } from "@/components/learning/visualizations/ArchDiagram";

// ── Lazy-loaded interactive visualizations ────────────────────────────────────
const LinearRegressionViz = dynamic(
  () => import("@/components/learning/visualizations/LinearRegressionViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const GradientBoostingViz = dynamic(
  () => import("@/components/learning/visualizations/GradientBoostingViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const NeuralNetworkViz = dynamic(
  () => import("@/components/learning/visualizations/NeuralNetworkViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const AttentionViz = dynamic(
  () => import("@/components/learning/visualizations/AttentionViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const ROCCurveViz = dynamic(
  () => import("@/components/learning/visualizations/ROCCurveViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const BiasVarianceViz = dynamic(
  () => import("@/components/learning/visualizations/BiasVarianceViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const SVMViz = dynamic(
  () => import("@/components/learning/visualizations/SVMViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const DecisionTreeViz = dynamic(
  () => import("@/components/learning/visualizations/DecisionTreeViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const BackpropViz = dynamic(
  () => import("@/components/learning/visualizations/BackpropViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const ConvolutionViz = dynamic(
  () => import("@/components/learning/visualizations/ConvolutionViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const LSTMViz = dynamic(
  () => import("@/components/learning/visualizations/LSTMViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const GANViz = dynamic(
  () => import("@/components/learning/visualizations/GANViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const EnsembleViz = dynamic(
  () => import("@/components/learning/visualizations/EnsembleViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const MulticlassViz = dynamic(
  () => import("@/components/learning/visualizations/MulticlassViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const KNNViz = dynamic(
  () => import("@/components/learning/visualizations/KNNViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const SVRViz = dynamic(
  () => import("@/components/learning/visualizations/SVRViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const BaggingViz = dynamic(
  () => import("@/components/learning/visualizations/BaggingViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const RandomForestViz = dynamic(
  () => import("@/components/learning/visualizations/RandomForestViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const GradientBoostingVariantsViz = dynamic(
  () => import("@/components/learning/visualizations/GradientBoostingVariantsViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const RNNViz = dynamic(
  () => import("@/components/learning/visualizations/RNNViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const ResNetViTViz = dynamic(
  () => import("@/components/learning/visualizations/ResNetViTViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const VAEViz = dynamic(
  () => import("@/components/learning/visualizations/VAEViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);

// ── Architecture diagrams (topic-specific, no switcher) ───────────────────────
const ArchDiagram = dynamic(
  () => import("@/components/learning/visualizations/ArchDiagram"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);

// ── Placeholder ───────────────────────────────────────────────────────────────
function VizPlaceholder() {
  return (
    <div
      className="h-56 rounded-2xl border flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="text-sm animate-pulse" style={{ color: "var(--text-muted)" }}>
        Loading visualization…
      </div>
    </div>
  );
}

// ── Interactive simulation selector ──────────────────────────────────────────
function VisualizationSelector({ type, accentColor }: { type: string; accentColor: string }) {
  switch (type) {
    case "linear-regression":  return <LinearRegressionViz accentColor={accentColor} />;
    case "gradient-boosting":  return <GradientBoostingViz accentColor={accentColor} />;
    case "gradient-boosting-all":
      return (
        <div className="space-y-6">
          <GradientBoostingViz accentColor={accentColor} />
          <GradientBoostingVariantsViz accentColor={accentColor} />
        </div>
      );
    case "neural-network":     return <NeuralNetworkViz accentColor={accentColor} />;
    case "attention":          return <AttentionViz accentColor={accentColor} />;
    case "roc-curve":          return <ROCCurveViz accentColor={accentColor} />;
    case "bias-variance":      return <BiasVarianceViz accentColor={accentColor} />;
    case "svm":                return <SVMViz accentColor={accentColor} />;
    case "knn":                return <KNNViz accentColor={accentColor} />;
    case "svr":                return <SVRViz accentColor={accentColor} />;
    case "svm-knn-svr":
      return (
        <div className="space-y-6">
          <SVMViz accentColor={accentColor} />
          <SVRViz accentColor="#f97316" />
          <KNNViz accentColor="#00d4aa" />
        </div>
      );
    case "decision-tree":      return <DecisionTreeViz accentColor={accentColor} />;
    case "backprop":           return <BackpropViz accentColor={accentColor} />;
    case "convolution":        return <ConvolutionViz accentColor={accentColor} />;
    case "lstm":               return <LSTMViz accentColor={accentColor} />;
    case "gan":                return <GANViz accentColor={accentColor} />;
    case "bagging":            return <BaggingViz accentColor={accentColor} />;
    case "ensemble":           return <EnsembleViz accentColor={accentColor} />;
    case "multiclass":         return <MulticlassViz accentColor={accentColor} />;
    case "decision-tree-rf":
      return (
        <div className="space-y-6">
          <DecisionTreeViz accentColor={accentColor} />
          <RandomForestViz accentColor={accentColor} />
        </div>
      );
    case "rnn-lstm":
      return (
        <div className="space-y-6">
          <RNNViz accentColor={accentColor} />
          <LSTMViz accentColor={accentColor} />
        </div>
      );
    case "gan-vae":
      return (
        <div className="space-y-6">
          <GANViz accentColor={accentColor} />
          <VAEViz accentColor={accentColor} />
        </div>
      );
    case "convolution-resnet-vit":
      return (
        <div className="space-y-6">
          <ConvolutionViz accentColor={accentColor} />
          <ResNetViTViz accentColor={accentColor} />
        </div>
      );
    default:                   return null;
  }
}

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
  "svm-knn-svr":         ["svm", "knn", "svr"],
  "decision-tree-rf":    ["decision-tree", "random-forest"],
  "gradient-boosting":   ["gradient-boosting", "xgboost", "lightgbm", "catboost"],
  "rnn-lstm-gru":        ["rnn", "lstm", "gru"],
  "generative-models":   ["gan", "vae"],
  "cnn-architectures":   ["cnn", "resnet", "vit"],
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
  const content = topicContents[topicId];

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

      {/* ── Key Formulas ─────────────────────────────────────────────── */}
      {content.keyFormulas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}>
            <span style={{ color: accentColor }}>∑</span>
            {t("key_formulas")}
          </h2>
          <FormulaCard formulas={content.keyFormulas} accentColor={accentColor} />
        </motion.div>
      )}

      {/* ── Interactive Simulation ────────────────────────────────────── */}
      {visualization !== "generic" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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
            Model Architecture
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
      {content.sections.map((section, i) => (
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
              {section.heading}
            </h2>
            <div
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
            >
              {section.type}
            </div>
          </div>

          {section.text && (
            <p className="leading-relaxed mb-4 text-base"
              style={{ color: "var(--text-secondary)" }}>
              {section.text}
            </p>
          )}

          {section.callout && (
            <InsightBox variant="insight" accentColor={accentColor}>
              {section.callout}
            </InsightBox>
          )}

          {section.formula && (
            <MathBlock
              formula={section.formula}
              label={section.formulaLabel}
              accentColor={accentColor}
            />
          )}

          {section.steps && section.steps.length > 0 && (
            <AlgorithmSteps steps={section.steps} accentColor={accentColor} />
          )}

          {section.code && (
            <CodeBlock
              code={section.code}
              language={section.language || "python"}
              accentColor={accentColor}
            />
          )}

          {i < content.sections.length - 1 && (
            <div className="mt-8 border-t" style={{ borderColor: "var(--border)" }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}
