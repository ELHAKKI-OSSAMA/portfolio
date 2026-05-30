import type { TopicContent } from './types';

export const evaluationContent: Record<string, TopicContent> = {
  "model-evaluation": {
    id: "model-evaluation",
    tagline: "Accuracy is a lie — learning to choose the right metric for the real problem",
    taglineFr: "La précision est un mensonge — apprendre à choisir la bonne métrique pour le vrai problème",
    taglineAr: "الدقة كذبة — تعلّم اختيار المقياس الصحيح للمشكلة الحقيقية",
    accentColor: "#ff6b6b",
    visualization: "evaluation-suite",
    keyFormulas: [
      { name: "F1 Score", latex: "F_1 = \\frac{2 \\cdot \\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}} = \\frac{2\\,TP}{2\\,TP + FP + FN}", meaning: "Harmonic mean of precision and recall" },
      { name: "AUC-ROC", latex: "\\text{AUC} = \\int_0^1 \\text{TPR}(\\text{FPR}) \\, d(\\text{FPR})", meaning: "Probability that a random positive ranks higher than a random negative" },
      { name: "MCC", latex: "\\text{MCC} = \\frac{TP \\cdot TN - FP \\cdot FN}{\\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}", meaning: "Matthews Correlation Coefficient — best single metric for imbalance" },
      { name: "RMSE", latex: "\\text{RMSE} = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2}", meaning: "Root Mean Squared Error — penalizes large errors, same units as target" },
      { name: "R² Score", latex: "R^2 = 1 - \\frac{\\sum(y_i - \\hat{y}_i)^2}{\\sum(y_i - \\bar{y})^2}", meaning: "Fraction of variance explained; 1=perfect, 0=predict mean, <0=worse than mean" },
      { name: "MAE", latex: "\\text{MAE} = \\frac{1}{n}\\sum_{i=1}^{n}|y_i - \\hat{y}_i|", meaning: "Mean Absolute Error — robust to outliers, interpretable in target units" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "When Accuracy Kills",
        text: "Imagine predicting cancer (0.1% prevalence). A model that predicts 'no cancer' for everyone achieves 99.9% accuracy — and kills patients. In fraud detection (0.5% fraud rate), high accuracy is meaningless. The choice of metric is a business decision, not a technical one. Getting it wrong can mean deploying a model that optimizes for the wrong thing entirely.",
        callout: "In 2021, Amazon's hiring algorithm was 98.4% accurate at filtering resumes — but systematically discriminated against women because accuracy was the optimized metric.",
      },
      {
        type: "intuition",
        heading: "The Confusion Matrix as a Complete Picture",
        text: "Every prediction falls into four categories: True Positive (correctly predicted positive), False Positive (predicted positive, actually negative), True Negative (correctly predicted negative), False Negative (predicted negative, actually positive). From these four numbers, every classification metric derives. FP = Type I error (false alarm). FN = Type II error (miss). Which matters more depends entirely on the application.",
      },
      {
        type: "math",
        heading: "ROC Curve: Threshold-Independent Evaluation",
        text: "A classifier produces a score, not just a binary prediction. The threshold we apply to convert score → label is a design choice. The ROC curve shows all possible tradeoffs by sweeping the threshold from 0 to 1: plotting TPR (recall) vs FPR (1-specificity). AUC = 0.5 means random guessing, AUC = 1.0 is perfect. AUC has a beautiful probabilistic interpretation: P(score(positive) > score(negative)).",
        formula: "\\text{TPR} = \\frac{TP}{TP+FN}, \\quad \\text{FPR} = \\frac{FP}{FP+TN}",
        formulaLabel: "True and False Positive Rates",
      },
      {
        type: "deepdive",
        heading: "Stratified K-Fold: The Right Way to Validate",
        text: "Hold-out validation wastes data and has high variance. K-Fold cross-validation uses all data for both training and validation. Stratified K-Fold ensures each fold has the same class distribution as the full dataset — critical for imbalanced problems. TimeSeriesSplit prevents data leakage: future data never informs past predictions, respecting temporal ordering.",
        steps: [
          "StratifiedKFold: maintains class proportions in each fold",
          "TimeSeriesSplit: all training data comes before validation data in time",
          "GroupKFold: ensures all samples from the same group (patient, user) are in the same fold",
          "RepeatedStratifiedKFold: repeat K-Fold N times with different random seeds → lower variance estimate",
        ],
      },
      {
        type: "code",
        heading: "Complete Evaluation Pipeline",
        code: `from sklearn.metrics import (
    classification_report, roc_auc_score, f1_score,
    average_precision_score, matthews_corrcoef,
    confusion_matrix
)
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.datasets import make_classification
from sklearn.ensemble import GradientBoostingClassifier
import numpy as np

# ── Sample data + model ────────────────────────────────────────────────
X, y = make_classification(n_samples=1000, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
model = GradientBoostingClassifier(n_estimators=100, random_state=42)

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
oof_probs = np.zeros(len(y_train))

for fold, (tr_idx, val_idx) in enumerate(skf.split(X_train, y_train)):
    model.fit(X_train[tr_idx], y_train[tr_idx])
    oof_probs[val_idx] = model.predict_proba(X_train[val_idx])[:, 1]
    print(f"Fold {fold+1} AUC: {roc_auc_score(y_train[val_idx], oof_probs[val_idx]):.4f}")

# Full OOF evaluation
print(f"\\nOOF AUC: {roc_auc_score(y_train, oof_probs):.4f}")
print(f"OOF AUC-PR: {average_precision_score(y_train, oof_probs):.4f}")
print(f"MCC: {matthews_corrcoef(y_train, oof_probs > 0.5):.4f}")

# Optimal threshold by F1
thresholds = np.linspace(0.01, 0.99, 200)
f1s = [f1_score(y_train, oof_probs > t) for t in thresholds]
best_threshold = thresholds[np.argmax(f1s)]
print(f"Optimal threshold: {best_threshold:.3f}, F1: {max(f1s):.4f}")`,
        language: "python",
      },
      {
        type: "comparison",
        heading: "Regression Metrics: When MSE Isn't Enough",
        text: "Classification has accuracy, F1, AUC. Regression has a whole family of metrics — each sensitive to different types of errors. Choosing the wrong one can hide catastrophic failures in your model.",
        steps: [
          "MAE (Mean Absolute Error): Σ|yᵢ−ŷᵢ|/n — robust to outliers, same units as target, intuitive. Lower is better.",
          "MSE (Mean Squared Error): Σ(yᵢ−ŷᵢ)²/n — penalizes large errors heavily. Differentiable everywhere. Lower is better.",
          "RMSE: √MSE — same units as target, penalizes large errors. The most common regression metric in Kaggle.",
          "R² (coefficient of determination): 1 − MSE/Var(y) — fraction of variance explained. 1=perfect, 0=predicts mean, <0=worse than mean.",
          "MAPE: Σ|yᵢ−ŷᵢ|/yᵢ/n — percentage error. Intuitive for business. Undefined when yᵢ=0, biased toward small values.",
          "RMSLE (log-scale RMSE): √Σ(log(ŷ+1)−log(y+1))²/n — robust to outliers, penalizes under-predictions. Used for count data.",
          "Huber Loss: quadratic for small errors, linear for large — best of MAE+MSE, robust to outliers AND differentiable.",
        ],
      },
      {
        type: "comparison",
        heading: "Ranking & Calibration Metrics",
        text: "Beyond point prediction accuracy, models must sometimes rank correctly (recommendation, search) or produce well-calibrated probabilities (medical risk, finance).",
        steps: [
          "Spearman ρ: rank correlation between predicted and actual — measures monotone relationship, not magnitude.",
          "NDCG (Normalized Discounted Cumulative Gain): graded relevance, position-discounted. Used in search/recommendation.",
          "Calibration (ECE): Expected Calibration Error — do confidence=80% predictions come true 80% of the time?",
          "Brier Score: MSE on probabilities for binary classification — lower is better. Good for probabilistic forecasts.",
          "Log-Loss (Cross-Entropy): −Σyᵢ·log(pᵢ)+(1−yᵢ)·log(1−pᵢ) — penalizes confident wrong predictions heavily.",
        ],
      },
      {
        type: "insight",
        heading: "Metric Choice is a Business Decision",
        callout: "Rule: choose the metric that matches the cost of errors in your application. RMSE for house prices (large errors matter more). MAE for delivery time (outlier days don't change business behavior). MAPE when relative error matters. R² to explain variance explained to stakeholders. AUC when class balance changes. F1 when both FP and FN have costs. MCC for the most balanced single metric on imbalanced data.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 8. BIAS-VARIANCE TRADEOFF
  // ─────────────────────────────────────────────────────────────
  "error-analysis": {
    id: "error-analysis",
    tagline: "Every model error is either a wrong assumption or sensitivity to noise — diagnosing which changes everything",
    taglineFr: "Chaque erreur de modèle est soit une mauvaise hypothèse soit une sensibilité au bruit — diagnostiquer laquelle change tout",
    taglineAr: "كل خطأ في النموذج إما افتراض خاطئ أو حساسية للضوضاء — تشخيص أيهما يغير كل شيء",
    accentColor: "#10b981",
    visualization: "bias-variance",
    keyFormulas: [
      { name: "Error Decomposition", latex: "\\mathbb{E}[(y - \\hat{f})^2] = \\underbrace{\\text{Bias}^2[\\hat{f}]}_{\\text{wrong assumption}} + \\underbrace{\\text{Var}[\\hat{f}]}_{\\text{noise sensitivity}} + \\underbrace{\\sigma^2}_{\\text{irreducible}}", meaning: "Total expected error cannot go below irreducible noise" },
      { name: "Bias", latex: "\\text{Bias}[\\hat{f}(x)] = \\mathbb{E}[\\hat{f}(x)] - f(x)", meaning: "How far the average prediction is from the truth" },
      { name: "Variance", latex: "\\text{Var}[\\hat{f}(x)] = \\mathbb{E}[\\hat{f}(x)^2] - \\mathbb{E}[\\hat{f}(x)]^2", meaning: "How much predictions fluctuate across different training sets" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Diagnosing What's Wrong with Your Model",
        text: "When a model performs poorly, there are only two fundamental causes: it's making wrong structural assumptions (bias/underfitting) or it's too sensitive to the specific training data (variance/overfitting). These have opposite fixes — more data helps variance but not bias; more capacity helps bias but not variance. Diagnosing which problem you have before applying fixes is the most important skill in applied ML.",
      },
      {
        type: "intuition",
        heading: "The Dartboard Analogy",
        text: "Imagine throwing 100 darts at a target (true function). High bias = darts cluster far from the bullseye (wrong model). High variance = darts scatter widely (inconsistent predictions). Low bias + low variance = darts cluster tight on the bullseye. A polynomial of degree 1 has high bias (can't fit non-linear data). A polynomial of degree 20 has high variance (fits training noise). Degree 3-5 might be the sweet spot.",
        callout: "Irreducible error (σ²) is the noise inherent in the data — measurement error, unobserved variables. No model can beat it. Knowing σ² sets the performance ceiling.",
      },
      {
        type: "math",
        heading: "The Mathematical Decomposition",
        text: "Expected test error for any estimator decomposes into three additive terms. The irreducible error σ² is a property of the data generating process, not the model. The tradeoff: as model complexity increases, bias decreases but variance increases. The optimal complexity minimizes their sum. Regularization (L1/L2) explicitly adds a bias term to reduce variance.",
        formula: "\\text{MSE} = \\text{Bias}^2 + \\text{Variance} + \\sigma^2",
        formulaLabel: "Bias-Variance-Noise decomposition",
      },
      {
        type: "deepdive",
        heading: "Learning Curves: Reading the Diagnosis",
        text: "Plot training error and validation error vs. training set size. High bias signature: both curves plateau at high error — adding more data won't help; use a more complex model. High variance signature: large gap between train error (low) and val error (high) — adding more data will help (curves converge); also try dropout/regularization. Both curves nearly touching at acceptable error = good generalization.",
      },
      {
        type: "algorithm",
        heading: "Systematic Error Analysis Protocol",
        steps: [
          "Establish baseline: naive model (majority class, mean prediction) sets the floor",
          "Human-level performance: upper bound on achievable accuracy (irreducible noise floor)",
          "Avoidable bias = train_error - human_error: fix with larger model, more features",
          "Variance = val_error - train_error: fix with more data, dropout, regularization",
          "Data mismatch = val_distribution ≠ train_distribution: fix with domain adaptation",
          "Error analysis: hand-inspect 100 val errors, tag by category → fix the biggest category",
        ],
      },
      {
        type: "code",
        heading: "Learning Curve Diagnostic",
        code: `from sklearn.model_selection import learning_curve, train_test_split
from sklearn.datasets import make_classification
from sklearn.ensemble import GradientBoostingClassifier
import matplotlib.pyplot as plt
import numpy as np

# ── Sample data + model ────────────────────────────────────────────────
X, y = make_classification(n_samples=800, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
model = GradientBoostingClassifier(n_estimators=100, random_state=42)

train_sizes, train_scores, val_scores = learning_curve(
    estimator=model,
    X=X_train, y=y_train,
    train_sizes=np.linspace(0.1, 1.0, 10),
    cv=5, scoring='roc_auc',
    n_jobs=-1, shuffle=True
)

train_mean = train_scores.mean(axis=1)
train_std = train_scores.std(axis=1)
val_mean = val_scores.mean(axis=1)
val_std = val_scores.std(axis=1)

# Diagnosis:
gap = train_mean[-1] - val_mean[-1]
level = val_mean[-1]

if level < 0.7:
    print("HIGH BIAS: increase model complexity or add features")
elif gap > 0.1:
    print("HIGH VARIANCE: add more data, regularization, or reduce complexity")
else:
    print("Good generalization — optimize hyperparameters")`,
        language: "python",
      },
    ],
  },
};
