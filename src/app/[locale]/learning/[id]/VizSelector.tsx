"use client";

import dynamic from "next/dynamic";

// ── Placeholder shown while any viz chunk loads ───────────────────────────────
export function VizPlaceholder() {
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
const StackingViz = dynamic(
  () => import("@/components/learning/visualizations/StackingViz"),
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
const ClusteringViz = dynamic(
  () => import("@/components/learning/visualizations/ClusteringViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const PCAViz = dynamic(
  () => import("@/components/learning/visualizations/PCAViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const AnomalyViz = dynamic(
  () => import("@/components/learning/visualizations/AnomalyViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const FeatureEngineeringViz = dynamic(
  () => import("@/components/learning/visualizations/FeatureEngineeringViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const HyperparameterViz = dynamic(
  () => import("@/components/learning/visualizations/HyperparameterViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const NaiveBayesViz = dynamic(
  () => import("@/components/learning/visualizations/NaiveBayesViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const TimeSeriesViz = dynamic(
  () => import("@/components/learning/visualizations/TimeSeriesViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const NLPViz = dynamic(
  () => import("@/components/learning/visualizations/NLPViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const FeatureImportanceViz = dynamic(
  () => import("@/components/learning/visualizations/FeatureImportanceViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const PartialDependenceViz = dynamic(
  () => import("@/components/learning/visualizations/PartialDependenceViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
// ── Foundations ──────────────────────────────────────────────────────────────
const LinearAlgebraViz = dynamic(
  () => import("@/components/learning/visualizations/LinearAlgebraViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const GradientDescentViz = dynamic(
  () => import("@/components/learning/visualizations/GradientDescentViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const ProbabilityViz = dynamic(
  () => import("@/components/learning/visualizations/ProbabilityViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
// ── Vision ────────────────────────────────────────────────────────────────────
const ObjectDetectionViz = dynamic(
  () => import("@/components/learning/visualizations/ObjectDetectionViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
// ── DL Optimization ──────────────────────────────────────────────────────────
const DLOptimizationViz = dynamic(
  () => import("@/components/learning/visualizations/DLOptimizationViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
// ── Confusion Matrix ──────────────────────────────────────────────────────────
const ConfusionMatrixViz = dynamic(
  () => import("@/components/learning/visualizations/ConfusionMatrixViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
// ── RL ────────────────────────────────────────────────────────────────────────
const QLearningViz = dynamic(
  () => import("@/components/learning/visualizations/QLearningViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
// ── Foundations extras ────────────────────────────────────────────────────────
const NumpyViz = dynamic(
  () => import("@/components/learning/visualizations/NumpyViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
const EntropyViz = dynamic(
  () => import("@/components/learning/visualizations/EntropyViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
// ── Audio ─────────────────────────────────────────────────────────────────────
const SpectrogramViz = dynamic(
  () => import("@/components/learning/visualizations/SpectrogramViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);
// ── Vision extras ─────────────────────────────────────────────────────────────
const SegmentationViz = dynamic(
  () => import("@/components/learning/visualizations/SegmentationViz"),
  { ssr: false, loading: () => <VizPlaceholder /> }
);

// ── Interactive simulation selector ──────────────────────────────────────────
export function VisualizationSelector({ type, accentColor }: { type: string; accentColor: string }) {
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
    case "evaluation-suite":
      return (
        <div className="space-y-6">
          <ConfusionMatrixViz accentColor={accentColor} />
          <ROCCurveViz accentColor={accentColor} />
        </div>
      );
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
    case "neural-network-backprop":
      return (
        <div className="space-y-6">
          <NeuralNetworkViz accentColor={accentColor} />
          <BackpropViz accentColor={accentColor} />
        </div>
      );
    case "backprop":           return <BackpropViz accentColor={accentColor} />;
    case "convolution":        return <ConvolutionViz accentColor={accentColor} />;
    case "lstm":               return <LSTMViz accentColor={accentColor} />;
    case "gan":                return <GANViz accentColor={accentColor} />;
    case "bagging":            return <BaggingViz accentColor={accentColor} />;
    case "bagging-stacking":
      return (
        <div className="space-y-6">
          <BaggingViz accentColor={accentColor} />
          <StackingViz accentColor={accentColor} />
        </div>
      );
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
    // ── Unsupervised learning ──────────────────────────────────────────────
    case "clustering":           return <ClusteringViz accentColor={accentColor} />;
    case "pca":                  return <PCAViz accentColor={accentColor} />;
    case "anomaly":              return <AnomalyViz accentColor={accentColor} />;
    // ── Applied ML ────────────────────────────────────────────────────────
    case "feature-engineering":  return <FeatureEngineeringViz accentColor={accentColor} />;
    case "hyperparameter-tuning":return <HyperparameterViz accentColor={accentColor} />;
    case "naive-bayes":          return <NaiveBayesViz accentColor={accentColor} />;
    case "time-series":          return <TimeSeriesViz accentColor={accentColor} />;
    case "nlp-text":             return <NLPViz accentColor={accentColor} />;
    // ── XAI / Model Inspection ─────────────────────────────────────────────
    case "feature-importance":   return <FeatureImportanceViz accentColor={accentColor} />;
    case "partial-dependence":   return <PartialDependenceViz accentColor={accentColor} />;
    // ── Foundations ───────────────────────────────────────────────────────
    case "linear-algebra":       return <LinearAlgebraViz accentColor={accentColor} />;
    case "gradient-descent":     return <GradientDescentViz accentColor={accentColor} />;
    case "dl-optimization":      return <DLOptimizationViz accentColor={accentColor} />;
    case "probability":          return <ProbabilityViz accentColor={accentColor} />;
    // ── Vision ────────────────────────────────────────────────────────────
    case "object-detection":     return <ObjectDetectionViz accentColor={accentColor} />;
    // ── RL ────────────────────────────────────────────────────────────────
    case "q-learning":           return <QLearningViz accentColor={accentColor} />;
    // ── Foundations extras ────────────────────────────────────────────────
    case "numpy":                return <NumpyViz accentColor={accentColor} />;
    case "entropy":              return <EntropyViz accentColor={accentColor} />;
    // ── Audio ─────────────────────────────────────────────────────────────
    case "spectrogram":          return <SpectrogramViz accentColor={accentColor} />;
    // ── Vision extras ─────────────────────────────────────────────────────
    case "segmentation":         return <SegmentationViz accentColor={accentColor} />;
    default:                     return null;
  }
}
