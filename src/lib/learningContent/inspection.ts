import type { TopicContent } from './types';

export const inspectionContent: Record<string, TopicContent> = {

  "feature-importance": {
    id: "feature-importance",
    tagline: "Know which features your model actually relies on — then trust it more (or less)",
    taglineFr: "Savoir sur quelles caractéristiques votre modèle s'appuie réellement — puis lui faire plus (ou moins) confiance",
    taglineAr: "اعرف الميزات التي يعتمد عليها نموذجك فعلاً — ثم ثق به أكثر (أو أقل)",
    accentColor: "#6c63ff",
    visualization: "feature-importance",
    keyFormulas: [
      {
        name: "Permutation Importance",
        latex: "\\text{PI}_j = \\bar{L}(f, X^{\\pi_j}, y) - \\bar{L}(f, X, y)",
        meaning: "Accuracy drop when feature j is randomly shuffled — model-agnostic, works post-training",
      },
      {
        name: "Gini Impurity Importance",
        latex: "\\text{FI}_j = \\sum_{t: \\text{split on } j} p_t \\cdot \\Delta \\text{Gini}_t",
        meaning: "Weighted impurity decrease across all splits on feature j — fast but biased toward cardinality",
      },
      {
        name: "SHAP (kernel)",
        latex: "\\phi_j = \\sum_{S \\subseteq F \\setminus \\{j\\}} \\frac{|S|!(|F|-|S|-1)!}{|F|!} [f_{S \\cup j}(x) - f_S(x)]",
        meaning: "Shapley value: each feature's average marginal contribution over all feature coalitions",
      },
      {
        name: "Drop-Column Importance",
        latex: "\\text{DCI}_j = \\text{score}(\\text{full model}) - \\text{score}(\\text{model without } j)",
        meaning: "Gold standard but expensive — retrain once per feature",
      },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Feature Importance Is Non-Negotiable",
        text: "Machine learning models are often black boxes — they produce outputs but hide their reasoning. Feature importance methods peel back that opacity. They answer: which inputs does the model lean on most? This matters for three reasons: (1) Debugging: if your model leans heavily on 'random_noise', you have a data leakage problem. (2) Trust: regulators, doctors, and loan officers must understand model decisions — GDPR Article 22 mandates explainability for automated decisions. (3) Feature selection: importance scores guide dimensionality reduction. Dropping truly unimportant features reduces inference cost and prevents overfitting to noise.",
        callout: "A credit scoring model relying heavily on zip_code might be fair on training data but proxy for race — importance analysis surfaces this before deployment.",
      },
      {
        type: "intuition",
        heading: "Two Philosophies: What Does 'Important' Mean?",
        text: "There are fundamentally two schools: (A) Structural importance asks 'how much did this feature help build the model?' — tree-based impurity importance is the canonical example, computed from split statistics during training. It's fast (no extra computation) but has a known bias: it inflates importance for high-cardinality continuous features like zip_code because there are more possible splits. (B) Functional importance asks 'how much does the model's predictions degrade if I break this feature?' — permutation importance shuffles each feature independently and measures the accuracy drop. It's model-agnostic, works with any estimator, and correctly assigns near-zero importance to random_noise features. The two approaches often disagree — and that disagreement is informative.",
        callout: "If impurity importance says zip_code is important but permutation importance says near-zero, the model learned spurious correlations from cardinality rather than signal.",
      },
      {
        type: "algorithm",
        heading: "Permutation Importance: Step by Step",
        steps: [
          "Train your model on (X_train, y_train). Compute baseline metric (e.g., accuracy) on X_val.",
          "For feature j in {1, …, p}: shuffle column j in X_val (replace with random permutation), compute metric on shuffled data, restore column j.",
          "Importance of j = baseline metric − shuffled metric. High drop = important feature.",
          "Repeat K times (default K=5 in sklearn) and average to reduce variance from random shuffles.",
          "Sort features by importance score. Features with negative scores (model improves when shuffled) indicate harmful or leaky features.",
        ],
      },
      {
        type: "code",
        heading: "Feature Importance: Permutation & Impurity",
        language: "python",
        code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

# ── Synthetic tabular dataset ──────────────────────────────────────────────────
np.random.seed(42)
n = 1000
X = pd.DataFrame({
    "income":         np.random.normal(50, 15, n),
    "age":            np.random.randint(18, 70, n),
    "credit_score":   np.random.normal(650, 80, n),
    "loan_amount":    np.random.normal(20, 8, n),
    "employment_yrs": np.random.exponential(5, n),
    "num_accounts":   np.random.poisson(3, n),
    "random_noise":   np.random.randn(n),           # truly useless
    "zip_code":       np.random.randint(0, 10000, n), # high-cardinality noise
})
y = (
    0.4 * (X["income"] > 55)
    + 0.3 * (X["credit_score"] > 660)
    + 0.2 * (X["age"] > 35)
    + 0.1 * np.random.rand(n)
) > 0.5

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# ── 1. Train Random Forest ─────────────────────────────────────────────────────
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# ── 2. Impurity (Gini) importance — fast, built-in ────────────────────────────
impurity_imp = pd.Series(rf.feature_importances_, index=X.columns)
print("Impurity importance:")
print(impurity_imp.sort_values(ascending=False).round(3))
# WARNING: zip_code (high cardinality) may appear inflated here

# ── 3. Permutation importance — model-agnostic, honest ───────────────────────
perm = permutation_importance(
    rf, X_val, y_val,
    n_repeats=10,          # shuffle 10 times, take mean ± std
    scoring="accuracy",
    random_state=42,
    n_jobs=-1
)
perm_imp = pd.DataFrame({
    "mean": perm.importances_mean,
    "std":  perm.importances_std,
}, index=X.columns).sort_values("mean", ascending=False)

print("\\nPermutation importance:")
print(perm_imp.round(3))
# random_noise and zip_code will be near zero or negative

# ── 4. Compare the two methods ────────────────────────────────────────────────
comparison = pd.DataFrame({
    "impurity": impurity_imp,
    "permutation": perm.importances_mean,
}).sort_values("permutation", ascending=False)
print("\\nComparison (sorted by permutation):")
print(comparison.round(3))

# ── 5. Feature selection using permutation importance ────────────────────────
selected = perm_imp[perm_imp["mean"] > 0.01].index.tolist()
print(f"\\nSelected features ({len(selected)}): {selected}")`,
      },
      {
        type: "math",
        heading: "SHAP: Unified Feature Attribution",
        formula: `\\text{SHAP guarantees: } \\sum_{j=1}^p \\phi_j = f(x) - \\mathbb{E}[f(X)]
\\\\[8pt]
\\text{TreeSHAP complexity: } O(TLD^2) \\text{ vs } O(2^p) \\text{ for naive}`,
        text: "SHAP (SHapley Additive exPlanations) unifies LIME, feature importance, and attention mechanisms under a single axiomatic framework. Every prediction is decomposed into a sum of per-feature contributions (ϕ_j) plus a base value. Unlike permutation importance (global), SHAP is local — it explains individual predictions. TreeSHAP computes exact Shapley values for tree ensembles in polynomial time using a path-based algorithm, making it practical for production Random Forests and XGBoost models.",
      },
      {
        type: "pitfall",
        heading: "Correlated Features Split Importance Unfairly",
        text: "When two features are highly correlated (e.g., income and credit_score), permutation importance underestimates both. Shuffling income still leaves credit_score intact, so the model recovers most of the signal. The true joint importance is shared between them, but each individual importance looks small. Solution: use drop-column importance or SHAP with correlation-aware grouping. Also be aware that permutation importance is validation-set dependent — importance scores change if you use different splits.",
        callout: "Never interpret near-zero permutation importance as 'useless' for correlated features without checking pairwise correlations first.",
      },
    ],
  },

  "partial-dependence": {
    id: "partial-dependence",
    tagline: "See exactly how a model's prediction changes as you vary one feature — marginalizing everything else",
    taglineFr: "Voir exactement comment la prédiction d'un modèle change quand on fait varier une caractéristique — en marginalisant tout le reste",
    taglineAr: "انظر بدقة كيف تتغير تنبؤات النموذج عند تغيير ميزة واحدة — مع تهميش كل شيء آخر",
    accentColor: "#8b5cf6",
    visualization: "partial-dependence",
    keyFormulas: [
      {
        name: "Partial Dependence Function",
        latex: "\\hat{f}_{x_S}(x_S) = \\mathbb{E}_{x_C}[f(x_S, x_C)] = \\int f(x_S, x_C)\\, p(x_C)\\, dx_C",
        meaning: "Average model output over all values of complement features — marginalizes out interactions",
      },
      {
        name: "ICE Curve (individual)",
        latex: "\\text{ICE}_i(x_j) = f(x_j,\\, x_{-j}^{(i)})",
        meaning: "Prediction for sample i as feature j varies — keeps all other features at their actual values",
      },
      {
        name: "c-ICE (centered)",
        latex: "\\text{cICE}_i(x_j) = \\text{ICE}_i(x_j) - \\text{ICE}_i(x_j^{(0)})",
        meaning: "ICE curve anchored at reference point x_j0 — removes intercept differences, highlights interaction shape",
      },
      {
        name: "PDP–ICE Relation",
        latex: "\\hat{f}_{x_j}(x_j) = \\frac{1}{n} \\sum_{i=1}^n \\text{ICE}_i(x_j)",
        meaning: "PDP is exactly the pointwise mean of all ICE curves",
      },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Beyond 'Which Features Matter' — How Do They Matter?",
        text: "Feature importance tells you that income is the most predictive feature, but it says nothing about the shape of that relationship. Does prediction increase linearly with income? Does it plateau above €80k? Is there a threshold effect at €40k? Partial Dependence Plots (PDPs) answer these questions visually. They're the 'effect plot' counterpart to importance scores. Together they form a complete picture: importance tells you the magnitude, PDPs tell you the direction and shape. Used together with ICE curves, they also reveal whether the average PDP is a reliable summary or a misleading average of heterogeneous effects.",
        callout: "A PDP showing a flat relationship for a high-importance feature is a red flag — it often means the marginalisation hides interaction effects visible only in ICE curves.",
      },
      {
        type: "intuition",
        heading: "The Monte Carlo Interpretation",
        text: "PDP estimation works by a Monte Carlo simulation: for a given value x_j = v, replace the j-th column of your entire dataset with v, run all n samples through the model, and average the predictions. Do this for each v on a grid. The result is the model's average response curve. The key assumption is feature independence — the marginalisation pretends x_j can take value v while all other features retain their original joint distribution. When features are correlated (e.g., income and age), this creates extrapolation into implausible regions (e.g., age=20 with income=200k). Accumulated Local Effects (ALE plots) fix this by conditioning on the actual data distribution.",
        callout: "ICE curves are the individual-level equivalent: instead of averaging, plot each sample's curve separately. If ICE curves fan out or cross, the PDP average is misleading — there are interaction effects.",
      },
      {
        type: "algorithm",
        heading: "Computing PDP + ICE: Step by Step",
        steps: [
          "Choose feature j and a grid of values G = {v_1, v_2, …, v_k} (default: 100 points between 5th–95th percentile).",
          "For each grid value v ∈ G: set X_j = v for all n training samples (create n copies), compute f(X_j=v, X_{-j}) for all n samples, record mean as PDP(v) and all n values as ICE curves.",
          "Plot PDP(v) as the average line. Plot each ICE curve as a faint line in the same colour.",
          "Optionally center ICE curves (c-ICE): subtract each curve's value at v_min so all curves start at 0 — removes intercept noise.",
          "For 2D PDPs (interaction plots): fix two features j1, j2 on a grid, marginalize over all others — produces a heatmap showing the joint effect.",
        ],
      },
      {
        type: "code",
        heading: "PDP + ICE with scikit-learn Inspection API",
        language: "python",
        code: `from sklearn.ensemble import GradientBoostingClassifier
from sklearn.inspection import PartialDependenceDisplay
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# ── Dataset ───────────────────────────────────────────────────────────────────
np.random.seed(0)
n = 2000
X = pd.DataFrame({
    "income":       np.random.normal(50, 15, n).clip(15, 120),
    "age":          np.random.randint(18, 70, n).astype(float),
    "credit_score": np.random.normal(650, 80, n).clip(300, 850),
})
y = (0.5*(X["income"]>55) + 0.3*(X["credit_score"]>660) + 0.2*(X["age"]>40)) > 0.5

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# ── Train model ───────────────────────────────────────────────────────────────
clf = GradientBoostingClassifier(n_estimators=200, max_depth=4, random_state=42)
clf.fit(X_train, y_train)

# ── 1. Standard PDP for 3 features ────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
PartialDependenceDisplay.from_estimator(
    clf, X_train,
    features=["income", "age", "credit_score"],   # feature names or indices
    kind="average",           # "average" = PDP only
    grid_resolution=50,       # number of grid points
    ax=axes,
)
plt.suptitle("Partial Dependence Plots (PDP)")
plt.tight_layout()
plt.show()

# ── 2. PDP + ICE overlay ─────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
PartialDependenceDisplay.from_estimator(
    clf, X_train,
    features=["income", "age", "credit_score"],
    kind="both",              # "both" = PDP (bold) + ICE (faint)
    subsample=100,            # sample 100 ICE curves for readability
    alpha=0.3,                # ICE line transparency
    ax=axes,
)
plt.suptitle("PDP + ICE Curves — divergence reveals interactions")
plt.tight_layout()
plt.show()

# ── 3. Centered ICE (c-ICE) — removes intercept bias ─────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
PartialDependenceDisplay.from_estimator(
    clf, X_train,
    features=["income", "age", "credit_score"],
    kind="individual",        # ICE only
    centered=True,            # anchor each curve at its leftmost value
    subsample=150,
    alpha=0.2,
    ax=axes,
)
plt.suptitle("Centered ICE (c-ICE) — interaction shapes visible")
plt.tight_layout()
plt.show()

# ── 4. 2D interaction PDP (heatmap) ──────────────────────────────────────────
fig, ax = plt.subplots(figsize=(6, 5))
PartialDependenceDisplay.from_estimator(
    clf, X_train,
    features=[("income", "credit_score")],  # tuple = 2D PDP
    ax=ax,
)
plt.title("2D PDP: income × credit_score interaction")
plt.tight_layout()
plt.show()

# ── 5. Manual PDP computation (educational) ──────────────────────────────────
grid = np.linspace(X_train["income"].quantile(0.05),
                   X_train["income"].quantile(0.95), 50)
pdp_vals = []
for v in grid:
    X_mod = X_train.copy()
    X_mod["income"] = v
    pdp_vals.append(clf.predict_proba(X_mod)[:, 1].mean())

plt.figure(figsize=(6, 3))
plt.plot(grid, pdp_vals, lw=2, color="#8b5cf6")
plt.xlabel("income")
plt.ylabel("Avg predicted P(default=1)")
plt.title("Manual PDP — income effect")
plt.tight_layout()
plt.show()`,
      },
      {
        type: "math",
        heading: "ALE Plots: Fixing PDP's Extrapolation Problem",
        formula: `\\hat{f}^{\\text{ALE}}_j(x_j) = \\int_{z_{0,j}}^{x_j} \\mathbb{E}\\!\\left[\\frac{\\partial f(x)}{\\partial x_j} \\,\\Big|\\, x_j = z\\right] dz`,
        text: "Accumulated Local Effects (ALE) plots condition on the neighbourhood of x_j = v rather than marginalising over the full dataset. This respects the actual data distribution and avoids extrapolation into impossible regions (e.g., 20-year-olds with €150k income). The derivative-based formulation computes the local effect of moving x_j by a small amount, then integrates those local effects — resulting in a distribution-faithful version of PDP. For uncorrelated features, PDP and ALE produce near-identical plots. For correlated features, ALE is strictly more trustworthy.",
      },
      {
        type: "pitfall",
        heading: "When PDP Lies: The Heterogeneous Effect Problem",
        text: "A PDP can show a perfectly flat line for income while individual ICE curves vary from strongly positive to strongly negative — if opposite-sign effects cancel in the average. This happens when there are strong interaction effects (e.g., income matters a lot for young borrowers but not for older ones). Always check ICE curves alongside PDPs. Additionally, PDPs are computationally expensive for large datasets: n × k model evaluations for each feature (n=dataset size, k=grid points). Use subsample=200 to limit ICE curve computation. Finally, PDPs have no confidence intervals by default — use bootstrapped PDPs or Gaussian process regression to get uncertainty bands.",
        callout: "If the PDP shows a flat line but permutation importance says the feature is critical, check ICE curves — you likely have a masked interaction effect.",
      },
    ],
  },
};
