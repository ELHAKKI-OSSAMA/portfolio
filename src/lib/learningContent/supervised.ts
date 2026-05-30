import type { TopicContent } from './types';

export const supervisedContent: Record<string, TopicContent> = {
  "linear-regression": {
    id: "linear-regression",
    tagline: "Finding the single best line through a cloud of noisy reality",
    taglineFr: "Trouver la droite optimale dans un nuage de points bruités",
    taglineAr: "إيجاد أفضل خط في سحابة من البيانات المتشعثة",
    accentColor: "#6c63ff",
    visualization: "linear-regression",
    keyFormulas: [
      { name: "OLS Solution", latex: "\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^\\top \\mathbf{X})^{-1} \\mathbf{X}^\\top \\mathbf{y}", meaning: "Closed-form solution minimizing squared residuals" },
      { name: "MSE Loss", latex: "\\mathcal{L} = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2", meaning: "Mean squared error — the objective being minimized" },
      { name: "Gradient Update", latex: "\\theta := \\theta - \\alpha \\nabla_{\\theta}\\mathcal{L}", meaning: "Gradient descent weight update rule" },
      { name: "Sigmoid", latex: "\\sigma(z) = \\frac{1}{1+e^{-z}}", meaning: "Squashes any real number to (0, 1) for probability" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Does This Matter?",
        text: "Regression is the foundation of every prediction system. Your credit score, weather forecast, house price estimate, recommendation engine — all start here. Before neural networks, before ensembles, there was the line. Understanding regression deeply means understanding what 'learning' actually means mathematically.",
        callout: "Linear regression won a Nobel Prize (economics, 1978). It predates computers by 200 years — Gauss used it to predict planetary orbits.",
      },
      {
        type: "intuition",
        heading: "The Geometric Intuition",
        text: "Imagine throwing darts at a wall. Each dart lands at a (x, y) position. You want to find the line that passes as close as possible to all darts simultaneously. 'Closest' means minimizing the vertical distances (residuals) from each dart to your line. The squared residuals turn this into a smooth bowl-shaped landscape — and the bottom of the bowl is the OLS solution.",
      },
      {
        type: "math",
        heading: "The Mathematics of Least Squares",
        text: "We model the relationship as ŷ = Xβ + ε where ε ~ N(0, σ²). Minimizing the sum of squared residuals has a beautiful closed-form solution called the Normal Equation. This works because the loss surface is a paraboloid — a perfect bowl with exactly one minimum.",
        formula: "\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^\\top \\mathbf{X})^{-1} \\mathbf{X}^\\top \\mathbf{y}",
        formulaLabel: "Normal Equation (OLS)",
      },
      {
        type: "deepdive",
        heading: "Why Maximize Likelihood = Minimize Squared Errors",
        text: "This connection is profound. If we assume Gaussian noise ε ~ N(0, σ²), then the likelihood of observing y given x is proportional to exp(-(y - Xβ)²/2σ²). Taking the log and negating gives us exactly the sum of squared residuals. OLS and MLE are the same thing under Gaussian noise. This means linear regression has a probabilistic interpretation as Bayesian inference with a uniform prior.",
        callout: "The Gaussian assumption is why outliers hurt so badly — squared errors punish large residuals quadratically. Use Huber loss for robustness.",
      },
      {
        type: "algorithm",
        heading: "Gradient Descent: Learning Step by Step",
        text: "When X^TX is not invertible (multicollinearity) or the dataset is too large for the Normal Equation, we use gradient descent. Start anywhere on the loss surface, measure the slope, take a small step downhill. Repeat until convergence.",
        steps: [
          "Initialize weights β = 0 (or random small values)",
          "Compute prediction: ŷ = Xβ",
          "Compute residuals: ε = y - ŷ",
          "Compute gradient: ∇L = -(2/n) Xᵀε",
          "Update: β ← β - α · ∇L",
          "Repeat until ||∇L|| < tolerance",
        ],
      },
      {
        type: "math",
        heading: "Logistic Regression: The Binary Jump",
        text: "For binary outcomes we need outputs in (0,1). We pass the linear combination through the sigmoid function σ(z) = 1/(1+e⁻ᶻ), which maps ℝ → (0,1). The loss function switches from MSE to Binary Cross-Entropy (log loss).",
        formula: "\\mathcal{L}_{BCE} = -\\frac{1}{n}\\sum_{i=1}^{n}\\left[y_i \\log(\\hat{p}_i) + (1-y_i)\\log(1-\\hat{p}_i)\\right]",
        formulaLabel: "Binary Cross-Entropy Loss",
      },
      {
        type: "code",
        heading: "From Scratch in NumPy",
        text: "The full gradient descent implementation in 12 lines:",
        code: `import numpy as np
from sklearn.datasets import make_regression

# ── Sample data ────────────────────────────────────────────────────────
X_raw, y = make_regression(n_samples=200, n_features=5, noise=10, random_state=42)
X = np.c_[np.ones(len(X_raw)), X_raw]   # prepend bias column
lam = 0.1                                 # Ridge regularisation strength

class LinearRegression:
    def __init__(self, lr=0.01, n_iter=1000):
        self.lr, self.n_iter = lr, n_iter

    def fit(self, X, y):
        n, p = X.shape
        self.beta = np.zeros(p)
        for _ in range(self.n_iter):
            y_hat = X @ self.beta
            residuals = y - y_hat
            grad = -(2/n) * X.T @ residuals
            self.beta -= self.lr * grad
        return self

    def predict(self, X):
        return X @ self.beta

# Demo
model = LinearRegression(lr=0.01, n_iter=1000).fit(X, y)
print("GD beta:", model.beta[:3].round(2))

# Closed-form (Normal Equation):
beta_ols = np.linalg.solve(X.T @ X, X.T @ y)
# Ridge (L2 regularization):
p = X.shape[1]
beta_ridge = np.linalg.solve(X.T @ X + lam * np.eye(p), X.T @ y)
print("OLS beta:  ", beta_ols[:3].round(2))
print("Ridge beta:", beta_ridge[:3].round(2))`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "Critical Pitfalls",
        text: "Four mistakes that kill regression models in production:",
        steps: [
          "Multicollinearity — Correlated features make (XᵀX) near-singular. VIF > 10 is a red flag. Fix: Ridge regularization or PCA.",
          "Unscaled features — Gradient descent converges 100x slower if features have different scales. Always StandardScaler first.",
          "Heteroscedasticity — Non-constant residual variance violates OLS assumptions. Visualize residuals vs fitted values.",
          "Extrapolation — Linear models are dangerously confident outside training range. Never extrapolate without domain knowledge.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. DECISION TREES & RANDOM FOREST
  // ─────────────────────────────────────────────────────────────
  "decision-tree-rf": {
    id: "decision-tree-rf",
    tagline: "Recursive 20 questions: splitting reality into ever-purer regions",
    taglineFr: "20 questions récursives : diviser la réalité en régions toujours plus pures",
    taglineAr: "20 سؤالاً تكرارياً: تقسيم الواقع إلى مناطق أكثر نقاءً",
    accentColor: "#00d4aa",
    visualization: "decision-tree-rf",
    keyFormulas: [
      { name: "Gini Impurity", latex: "G(t) = 1 - \\sum_{k=1}^{K} p_k^2", meaning: "Probability of misclassifying a random sample. Zero = perfect purity." },
      { name: "Information Gain", latex: "IG = H(\\text{parent}) - \\sum_{j} \\frac{n_j}{n} H(\\text{child}_j)", meaning: "Entropy reduction achieved by a split" },
      { name: "Entropy", latex: "H(t) = -\\sum_{k=1}^{K} p_k \\log_2 p_k", meaning: "Measure of disorder / unpredictability in a node" },
      { name: "OOB Error", latex: "\\text{OOB} = \\frac{1}{n}\\sum_{i=1}^{n} \\mathbf{1}[y_i \\neq \\hat{y}_i^{\\text{OOB}}]", meaning: "Free validation estimate from samples not in each bootstrap" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "The Simplest Powerful Model",
        text: "Decision trees mimic human reasoning: 'If age > 40 AND smoker AND cholesterol > 200 → high risk'. They're interpretable, require no feature scaling, handle mixed types, and capture non-linear relationships. Alone, they overfit badly — but as the building block for Random Forest, XGBoost, and LightGBM, they're the most important model structure in tabular ML.",
      },
      {
        type: "intuition",
        heading: "Recursive Binary Partitioning",
        text: "A decision tree partitions the feature space into rectangular regions. At each step, it asks: 'Which single feature threshold best separates the classes?' It measures 'best' using impurity (Gini or entropy). The process recurses on each sub-region until a stopping criterion (max_depth, min_samples_leaf) is reached.",
        callout: "A depth-20 decision tree with binary splits can represent 2²⁰ ≈ 1 million different regions. That's why they overfit so catastrophically on raw data.",
      },
      {
        type: "math",
        heading: "Gini vs. Entropy: The Split Criteria",
        text: "Both measure impurity — lower is better. Gini is faster to compute (no log). Entropy is slightly more sensitive to class probabilities near 0.5. In practice, they produce nearly identical trees. For a node with classes [positive, negative] in proportions [p, 1-p]:",
        formula: "G = 1 - p^2 - (1-p)^2 = 2p(1-p)",
        formulaLabel: "Gini for binary classification",
      },
      {
        type: "deepdive",
        heading: "Why Random Forest Works: Bias-Variance Decomposition",
        text: "A single deep tree has low bias but catastrophically high variance — it memorizes training noise. Random Forest exploits two tricks: (1) Bootstrap sampling grows each tree on a different random subset of data. (2) Random feature subsets (√p features per split) decorrelate the trees. Averaging decorrelated high-variance estimators reduces variance without increasing bias. Mathematically: Var(mean of n correlated trees) = ρσ² + (1-ρ)σ²/n. Reducing correlation ρ is the entire game.",
        callout: "The 'random' in Random Forest refers to random feature selection at each split, not just bootstrap. This is Breiman's key insight from 2001.",
      },
      {
        type: "algorithm",
        heading: "Random Forest Training Algorithm",
        steps: [
          "For t = 1 to T (number of trees):",
          "  Bootstrap sample Dₜ from training data (n samples with replacement)",
          "  Grow decision tree hₜ on Dₜ:",
          "    At each node, randomly select m = √p features",
          "    Find best split among those m features (lowest Gini/entropy)",
          "    Expand until max_depth or min_samples_leaf is reached",
          "Final prediction: majority vote (classification) or mean (regression)",
          "OOB estimate: for each sample, predict using only trees that didn't see it",
        ],
      },
      {
        type: "code",
        heading: "Production Pattern",
        code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.datasets import make_classification
import pandas as pd
import shap

# ── Sample data ────────────────────────────────────────────────────────
X_raw, y = make_classification(n_samples=500, n_features=10,
                                n_informative=5, random_state=42)
feature_names = [f"feature_{i}" for i in range(X_raw.shape[1])]
X_train, X_test, y_train, y_test = train_test_split(
    X_raw, y, test_size=0.2, random_state=42)

# Train
rf = RandomForestClassifier(
    n_estimators=500,
    max_features='sqrt',        # Random feature subsets
    max_depth=None,             # Fully grown (pruned by min_samples_leaf)
    min_samples_leaf=1,
    oob_score=True,             # Free validation estimate
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)
print(f"OOB Score: {rf.oob_score_:.4f}")

# Feature importance (Mean Decrease in Impurity)
importances = pd.Series(rf.feature_importances_, index=feature_names)
importances.nlargest(20).sort_values().plot(kind='barh')

# SHAP for correct feature importance
explainer = shap.TreeExplainer(rf)
shap_values = explainer.shap_values(X_test)`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "Random Forest Pitfalls",
        steps: [
          "MDI feature importance is biased toward high-cardinality features. Use permutation importance or SHAP instead.",
          "Memory: 500 deep trees can use 2–10GB RAM. Set max_depth=15–20 in production.",
          "Slow inference: predicting through 500 trees serially is slow. Consider n_estimators=100 for serving.",
          "Class imbalance: use class_weight='balanced' or stratified bootstrap.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. GRADIENT BOOSTING
  // ─────────────────────────────────────────────────────────────
  "gradient-boosting": {
    id: "gradient-boosting",
    tagline: "Many small corrections beat one big guess — sequentially chasing the residuals",
    taglineFr: "De petites corrections cumulées valent mieux qu'une grande supposition — poursuivre les résidus séquentiellement",
    taglineAr: "تصحيحات صغيرة متتالية تتفوق على تخمين واحد كبير — ملاحقة البواقي بالتسلسل",
    accentColor: "#f59e0b",
    visualization: "gradient-boosting-all",
    keyFormulas: [
      { name: "Boosting Ensemble", latex: "F_M(x) = \\sum_{m=0}^{M} \\gamma_m h_m(x)", meaning: "Final prediction = sum of M weak learners, each weighted by γ" },
      { name: "Pseudo-Residuals", latex: "r_{im} = -\\left[\\frac{\\partial \\mathcal{L}(y_i, F(x_i))}{\\partial F(x_i)}\\right]_{F=F_{m-1}}", meaning: "Negative gradient of loss — what the next tree should learn" },
      { name: "XGBoost Tree Score", latex: "\\text{Score} = \\frac{(\\sum G_i)^2}{\\sum H_i + \\lambda} - \\alpha T", meaning: "Gain from a split (G=first derivative sum, H=second derivative sum)" },
      { name: "Split Gain", latex: "\\text{Gain} = \\frac{G_L^2}{H_L+\\lambda} + \\frac{G_R^2}{H_R+\\lambda} - \\frac{(G_L+G_R)^2}{H_L+H_R+\\lambda}", meaning: "Improvement in objective from splitting a leaf into two" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Gradient Boosting Dominates Tabular Data",
        text: "Since 2014, gradient boosting methods (XGBoost, LightGBM, CatBoost) have won the majority of Kaggle competitions on structured data. They're the single best algorithm for tabular ML because: they handle mixed feature types natively, don't require scaling, capture complex non-linear interactions, and come with built-in regularization. Understanding how they work unlocks the most powerful tool in the data scientist's arsenal.",
      },
      {
        type: "intuition",
        heading: "The Core Idea: Fit the Mistakes",
        text: "Suppose your current model predicts house prices and it's wrong by $50k on house A. Instead of retraining from scratch, train a new small tree to predict exactly that $50k error. Add it to your model. Now you're off by less. Repeat. Each new tree targets the residual errors of all previous trees combined. This is gradient boosting — gradient descent in function space.",
        callout: "The 'gradient' in gradient boosting refers to functional gradient descent, not parameter gradient descent. We're optimizing in the space of functions, not weights.",
      },
      {
        type: "math",
        heading: "Gradient Boosting as Gradient Descent in Function Space",
        text: "At step m, we fit a tree hₘ to the negative gradient of the loss with respect to the current prediction F_{m-1}(x). For MSE loss L = ½(y - F(x))², the negative gradient is exactly the residual r = y - F(x). For other losses (log loss, MAE), we get different 'pseudo-residuals' — hence the generality of the framework.",
        formula: "F_m(x) = F_{m-1}(x) + \\nu \\cdot \\gamma_m h_m(x)",
        formulaLabel: "Update rule (ν = shrinkage/learning rate)",
      },
      {
        type: "deepdive",
        heading: "XGBoost: Second-Order Optimization",
        text: "Friedman's original GBM only uses first-order gradients (residuals). XGBoost uses both first (G) and second (H) order Taylor expansion of the loss, giving it better curvature information — like Newton's method vs. gradient descent. The tree score uses H as a natural adaptive learning rate: features/splits where the loss has high curvature (H large) get smaller effective steps.",
        formula: "\\tilde{\\mathcal{L}} = \\sum_i [g_i f_t(x_i) + \\frac{1}{2}h_i f_t^2(x_i)] + \\Omega(f_t)",
        formulaLabel: "XGBoost regularized objective (Taylor expanded)",
      },
      {
        type: "comparison",
        heading: "XGBoost vs LightGBM vs CatBoost",
        text: "Three major frameworks, each with distinct architectural innovations:",
        steps: [
          "XGBoost: Level-wise tree growth + second-order optimization. Slower but mature. Best for small-medium datasets.",
          "LightGBM: Leaf-wise growth (best leaf first) + Histogram binning (continuous → discrete bins). 10–20x faster training. Best for large datasets.",
          "CatBoost: Ordered boosting prevents target leakage. Native categorical handling (no encoding needed). Best when you have many categorical features.",
          "Rule of thumb: Start with LightGBM. Use CatBoost with heavy categoricals. Use XGBoost for small datasets where speed doesn't matter.",
        ],
      },
      {
        type: "algorithm",
        heading: "LightGBM Leaf-Wise Growth",
        steps: [
          "Initialize F₀(x) = log(p/(1-p)) for binary classification",
          "For m = 1 to M:",
          "  Compute pseudo-residuals rᵢ = -∂L/∂F(xᵢ)|_{F=F_{m-1}}",
          "  Find best leaf to split (globally, not level-by-level)",
          "  Compute leaf values: γⱼ = ΣᵢGᵢ / (ΣᵢHᵢ + λ)",
          "  Update: F_m(x) = F_{m-1}(x) + ν · γ_{leaf(x)}",
          "  Add early stopping if validation loss stops improving",
        ],
      },
      {
        type: "code",
        heading: "Production LightGBM with Optuna",
        code: `import lightgbm as lgb
import optuna
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# ── Sample data ────────────────────────────────────────────────────────
X, y = make_classification(n_samples=1000, n_features=20,
                            n_informative=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
dtrain = lgb.Dataset(X_train, label=y_train)

def objective(trial):
    params = {
        'objective': 'binary',
        'metric': 'auc',
        'learning_rate': trial.suggest_float('lr', 0.01, 0.3, log=True),
        'num_leaves': trial.suggest_int('num_leaves', 20, 300),
        'max_depth': trial.suggest_int('max_depth', 3, 12),
        'min_data_in_leaf': trial.suggest_int('min_child', 10, 100),
        'feature_fraction': trial.suggest_float('feat_frac', 0.4, 1.0),
        'bagging_fraction': trial.suggest_float('bag_frac', 0.4, 1.0),
        'lambda_l1': trial.suggest_float('l1', 1e-8, 10.0, log=True),
        'lambda_l2': trial.suggest_float('l2', 1e-8, 10.0, log=True),
        'verbose': -1,
    }
    cv_result = lgb.cv(
        params, dtrain, nfold=5,
        num_boost_round=500,
        early_stopping_rounds=50,
        stratified=True
    )
    return max(cv_result['valid auc-mean'])

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100)`,
        language: "python",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. NEURAL NETWORKS
  // ─────────────────────────────────────────────────────────────
  "svm-knn-svr": {
    id: "svm-knn-svr",
    tagline: "Maximum margin is the answer — the wider the street, the more confident the classifier",
    taglineFr: "La marge maximale est la réponse — plus la rue est large, plus le classifieur est confiant",
    taglineAr: "الهامش الأقصى هو الجواب — كلما اتسع الشارع، زادت ثقة المصنّف",
    accentColor: "#f97316",
    visualization: "svm-knn-svr",
    keyFormulas: [
      { name: "SVM Objective", latex: "\\min_{\\mathbf{w},b} \\frac{1}{2}\\|\\mathbf{w}\\|^2 \\quad \\text{s.t.} \\quad y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b) \\geq 1", meaning: "Maximize margin 2/||w|| subject to correct classification" },
      { name: "Dual (Kernel)", latex: "\\max_{\\alpha} \\sum_i \\alpha_i - \\frac{1}{2}\\sum_{i,j}\\alpha_i\\alpha_j y_i y_j K(x_i, x_j)", meaning: "Kernel trick: replace x·x with K(x,x) for non-linear boundaries" },
      { name: "RBF Kernel", latex: "K(\\mathbf{x},\\mathbf{x}') = \\exp\\!\\left(-\\gamma\\|\\mathbf{x}-\\mathbf{x}'\\|^2\\right)", meaning: "Radial Basis Function — infinite-dimensional Gaussian feature map" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "The Key Idea: Maximum Margin",
        text: "Consider binary classification with a separating hyperplane. Infinite hyperplanes can separate the classes — but which one generalizes best? SVMs answer: the one with maximum margin — the largest possible 'street' between the two classes. Points on the margin boundary are support vectors. Only these points determine the boundary; the rest can be removed without changing it.",
      },
      {
        type: "intuition",
        heading: "The Kernel Trick: Infinite Dimensions for Free",
        text: "Many datasets are not linearly separable in their original space. The kernel trick implicitly maps data to a higher-dimensional space where it IS linearly separable — without ever computing the mapping explicitly. K(x,x') = φ(x)·φ(x') computes the dot product in the high-dimensional space directly. The RBF kernel maps to an infinite-dimensional Hilbert space, making SVMs incredibly powerful.",
        callout: "SVMs are the only algorithm that can provably work in infinite-dimensional feature spaces (RKHS). No other algorithm has this property.",
      },
      {
        type: "math",
        heading: "Soft Margin: Handling Noise with Slack",
        text: "For noisy data, the hard-margin SVM (requiring perfect separation) won't work. The soft-margin SVM introduces slack variables ξᵢ ≥ 0 allowing some misclassification, penalized by hyperparameter C. Large C = narrow margin, low tolerance for errors (may overfit). Small C = wide margin, high tolerance (may underfit).",
        formula: "\\min_{w,b,\\xi} \\frac{1}{2}\\|w\\|^2 + C\\sum_i \\xi_i, \\quad y_i(w^\\top x_i + b) \\geq 1 - \\xi_i",
        formulaLabel: "Soft-margin SVM primal objective",
      },
      {
        type: "code",
        heading: "SVM in Production",
        code: `from sklearn.svm import SVC, SVR
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.datasets import make_classification

# ── Sample data ────────────────────────────────────────────────────────
X, y = make_classification(n_samples=300, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# CRITICAL: SVM requires feature scaling
svm_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', SVC(kernel='rbf', probability=True))
])

# Tune C and gamma
param_grid = {
    'svm__C': [0.01, 0.1, 1, 10, 100],
    'svm__gamma': ['scale', 'auto', 0.001, 0.01, 0.1]
}
grid_search = GridSearchCV(
    svm_pipeline, param_grid,
    cv=5, scoring='roc_auc', n_jobs=-1
)
grid_search.fit(X_train, y_train)
print(f"Best AUC: {grid_search.best_score_:.4f}")
print(f"Best params: {grid_search.best_params_}")

# SVR for regression
svr = Pipeline([
    ('scaler', StandardScaler()),
    ('svr', SVR(kernel='rbf', C=100, epsilon=0.1))
])`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "SVM Pitfalls",
        steps: [
          "No scaling = garbage results. SVM is the most scaling-sensitive algorithm. StandardScaler is not optional.",
          "Slow on large data: SVM is O(n²) to O(n³) in training. Use SGDClassifier (hinge loss) for n > 50K.",
          "C tuning: too large C = overfitting; too small = underfitting. Always cross-validate over log-scale grid.",
          "KNN curse of dimensionality: distance metrics become meaningless in high dimensions. Use PCA first, or switch to ball-tree/KD-tree with k=√n.",
        ],
      },
    ],
  },
};
