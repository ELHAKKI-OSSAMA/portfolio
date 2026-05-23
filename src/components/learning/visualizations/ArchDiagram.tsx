"use client";

/**
 * ArchDiagram — thin router. Each arch group lives in arch/*.tsx.
 * Adding a new arch = create arch/myArch.tsx, export the function, add case here.
 */

import { useVizTheme }                                         from "@/hooks/useVizTheme";
import { LinearRegressionArch, SVMArch, KNNArch, SVRArch, MLPArch } from "./arch/classicMLArch";
import { DecisionTreeArch, GradientBoostingArch, BaggingArch,
         RandomForestArch, XGBoostArch, LightGBMArch, CatBoostArch } from "./arch/treesArch";
import { RNNArch, LSTMArch, GRUArch }                         from "./arch/sequenceArch";
import { CNNArch, ResNetArch, ViTArch }                       from "./arch/visionArch";
import { TransformerArch, BERTArch }                          from "./arch/transformerArch";
import { GANArch, VAEArch }                                   from "./arch/generativeArch";
import { EvaluationArch, BiasVarianceArch, MulticlassArch }   from "./arch/evaluationArch";

export type ArchType =
  | "linear-regression" | "decision-tree" | "random-forest"
  | "gradient-boosting" | "xgboost" | "lightgbm" | "catboost" | "bagging"
  | "svm" | "knn" | "svr" | "mlp"
  | "cnn" | "resnet" | "vit"
  | "transformer" | "bert"
  | "rnn" | "lstm" | "gru"
  | "gan" | "vae"
  | "evaluation" | "bias-variance" | "multiclass";

const LABELS: Record<ArchType, string> = {
  "linear-regression": "Linear & Logistic Regression Architecture",
  "decision-tree":     "Decision Tree Architecture",
  "random-forest":     "Random Forest Architecture",
  "gradient-boosting": "Gradient Boosting Architecture",
  "xgboost":           "XGBoost Architecture",
  "lightgbm":          "LightGBM — Leaf-wise Growth",
  "catboost":          "CatBoost — Ordered Boosting + Symmetric Trees",
  "bagging":           "Bagging (Bootstrap Aggregating) Architecture",
  "svm":               "Support Vector Machine Geometry",
  "knn":               "K-Nearest Neighbors Algorithm",
  "svr":               "Support Vector Regression",
  "mlp":               "Multi-Layer Perceptron (MLP) Architecture",
  "cnn":               "Convolutional Neural Network Architecture",
  "resnet":            "ResNet — Residual Connections",
  "vit":               "Vision Transformer (ViT)",
  "transformer":       "Transformer Encoder Architecture",
  "bert":              "BERT — Bidirectional Encoder Representations",
  "rnn":               "RNN — Recurrent Neural Network",
  "lstm":              "LSTM Cell Architecture",
  "gru":               "GRU — Gated Recurrent Unit",
  "gan":               "GAN Training Loop",
  "vae":               "Variational Autoencoder (VAE)",
  "evaluation":        "Model Evaluation Pipeline",
  "bias-variance":     "Bias–Variance Decomposition",
  "multiclass":        "Multi-Class Classification Strategies",
};

export default function ArchDiagram({
  type,
  accentColor = "#6c63ff",
}: {
  type: ArchType;
  accentColor?: string;
}) {
  const vt = useVizTheme();
  const props = { accent: accentColor, vt };

  const renderArch = () => {
    switch (type) {
      case "linear-regression":  return <LinearRegressionArch  {...props} />;
      case "decision-tree":      return <DecisionTreeArch       {...props} />;
      case "random-forest":      return <RandomForestArch       {...props} />;
      case "gradient-boosting":  return <GradientBoostingArch   {...props} />;
      case "xgboost":            return <XGBoostArch            {...props} />;
      case "lightgbm":           return <LightGBMArch           {...props} />;
      case "catboost":           return <CatBoostArch           {...props} />;
      case "bagging":            return <BaggingArch            {...props} />;
      case "svm":                return <SVMArch                {...props} />;
      case "knn":                return <KNNArch                {...props} />;
      case "svr":                return <SVRArch                {...props} />;
      case "mlp":                return <MLPArch                {...props} />;
      case "cnn":                return <CNNArch                {...props} />;
      case "resnet":             return <ResNetArch             {...props} />;
      case "vit":                return <ViTArch                {...props} />;
      case "transformer":        return <TransformerArch        {...props} />;
      case "bert":               return <BERTArch               {...props} />;
      case "rnn":                return <RNNArch                {...props} />;
      case "lstm":               return <LSTMArch               {...props} />;
      case "gru":                return <GRUArch                {...props} />;
      case "gan":                return <GANArch                {...props} />;
      case "vae":                return <VAEArch                {...props} />;
      case "evaluation":         return <EvaluationArch         {...props} />;
      case "bias-variance":      return <BiasVarianceArch       {...props} />;
      case "multiclass":         return <MulticlassArch         {...props} />;
      default:                   return <MLPArch                {...props} />;
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="px-5 py-2.5 border-b flex items-center gap-2"
        style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-bold tracking-wide uppercase"
          style={{ color: accentColor }}>Architecture</span>
        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
          {LABELS[type]}
        </span>
      </div>
      <div className="p-4 overflow-x-auto">
        {renderArch()}
      </div>
    </div>
  );
}
