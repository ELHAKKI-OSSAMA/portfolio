"use client";

/**
 * ArchDiagram — thin router. Each arch group lives in arch/*.tsx.
 * Adding a new arch = create arch/myArch.tsx, export the function, add case here.
 */

import { useVizTheme }                                         from "@/hooks/useVizTheme";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";
import { useVizLocale } from "@/hooks/useVizLocale";
import { LinearRegressionArch, SVMArch, KNNArch, SVRArch, MLPArch } from "./arch/classicMLArch";
import { DecisionTreeArch, GradientBoostingArch, BaggingArch } from "./arch/treesClassicArch";
import { RandomForestArch, XGBoostArch, LightGBMArch, CatBoostArch } from "./arch/treesEnsembleArch";
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

const ARCH_DIAGRAM_LABELS = {
  en: {
    architectureChip: "Architecture",
    titles: {
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
    } as Record<ArchType, string>,
  },
  fr: {
    architectureChip: "Architecture",
    titles: {
      "linear-regression": "Architecture Régression Linéaire & Logistique",
      "decision-tree":     "Architecture Arbre de Décision",
      "random-forest":     "Architecture Forêt Aléatoire",
      "gradient-boosting": "Architecture Gradient Boosting",
      "xgboost":           "Architecture XGBoost",
      "lightgbm":          "LightGBM — Croissance feuille par feuille",
      "catboost":          "CatBoost — Boosting ordonné + arbres symétriques",
      "bagging":           "Architecture Bagging (agrégation bootstrap)",
      "svm":               "Géométrie des Machines à Vecteurs de Support",
      "knn":               "Algorithme K Plus Proches Voisins",
      "svr":               "Régression à Vecteurs de Support",
      "mlp":               "Architecture Perceptron Multicouche (MLP)",
      "cnn":               "Architecture Réseau Neuronal Convolutif",
      "resnet":            "ResNet — Connexions résiduelles",
      "vit":               "Transformeur de vision (ViT)",
      "transformer":       "Architecture Encodeur Transformer",
      "bert":              "BERT — Représentations encodeur bidirectionnel",
      "rnn":               "RNN — Réseau Neuronal Récurrent",
      "lstm":              "Architecture cellule LSTM",
      "gru":               "GRU — Unité récurrente à porte",
      "gan":               "Boucle d'entraînement GAN",
      "vae":               "Autoencodeur variationnel (VAE)",
      "evaluation":        "Pipeline d'évaluation de modèle",
      "bias-variance":     "Décomposition Biais–Variance",
      "multiclass":        "Stratégies de classification multiclasse",
    } as Record<ArchType, string>,
  },
  ar: {
    architectureChip: "البنية",
    titles: {
      "linear-regression": "بنية الانحدار الخطي واللوجستي",
      "decision-tree":     "بنية شجرة القرار",
      "random-forest":     "بنية الغابة العشوائية",
      "gradient-boosting": "بنية التعزيز التدريجي",
      "xgboost":           "بنية XGBoost",
      "lightgbm":          "LightGBM — نمو ورقة بورقة",
      "catboost":          "CatBoost — التعزيز المرتب + الأشجار المتماثلة",
      "bagging":           "بنية Bagging (التجميع بالتمهيد)",
      "svm":               "هندسة آلة متجهات الدعم",
      "knn":               "خوارزمية K من أقرب الجيران",
      "svr":               "انحدار متجهات الدعم",
      "mlp":               "بنية الشبكة الكاملة الاتصال (MLP)",
      "cnn":               "بنية الشبكة العصبية الالتفافية",
      "resnet":            "ResNet — الاتصالات المتبقية",
      "vit":               "محول الرؤية (ViT)",
      "transformer":       "بنية مشفر المحول",
      "bert":              "BERT — تمثيلات المشفر ثنائي الاتجاه",
      "rnn":               "RNN — الشبكة العصبية المتكررة",
      "lstm":              "بنية خلية LSTM",
      "gru":               "GRU — وحدة التكرار البوابية",
      "gan":               "حلقة تدريب GAN",
      "vae":               "المشفر الذاتي التنويعي (VAE)",
      "evaluation":        "خط أنابيب تقييم النموذج",
      "bias-variance":     "تحليل التحيز–التباين",
      "multiclass":        "استراتيجيات التصنيف متعدد الأصناف",
    } as Record<ArchType, string>,
  },
} as const;

export default function ArchDiagram({
  type,
  accentColor = "#6c63ff",
}: {
  type: ArchType;
  accentColor?: string;
}) {
  const vt = useVizTheme();
  const L = useVizLocale(ARCH_DIAGRAM_LABELS);
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
          style={{ color: accentColor }}>{L.architectureChip}</span>
        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
          {L.titles[type]}
        </span>
      </div>
      <div className="p-4 overflow-x-auto">
        {renderArch()}
      </div>
    </div>
  );
}
