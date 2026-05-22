// ─── Full Pedagogical Content for Learning Topics ─────────────────────────────
// Structured following the scientific pedagogy: Motivation → Intuition → Math → Algorithm → Code → Pitfalls

export type SectionType =
  | "motivation"
  | "intuition"
  | "math"
  | "algorithm"
  | "code"
  | "insight"
  | "pitfall"
  | "comparison"
  | "deepdive";

export interface ContentSection {
  type: SectionType;
  heading: string;
  text?: string;
  formula?: string;          // LaTeX string for KaTeX
  formulaLabel?: string;
  steps?: string[];
  code?: string;
  language?: string;
  callout?: string;
}

export interface KeyFormula {
  name: string;
  latex: string;
  meaning: string;
}

export interface TopicContent {
  id: string;
  tagline: string;
  accentColor: string;
  visualization: string;
  keyFormulas: KeyFormula[];
  sections: ContentSection[];
}

export const topicContents: Record<string, TopicContent> = {

  // ─────────────────────────────────────────────────────────────
  // 1. LINEAR & LOGISTIC REGRESSION
  // ─────────────────────────────────────────────────────────────
  "linear-regression": {
    id: "linear-regression",
    tagline: "Finding the single best line through a cloud of noisy reality",
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

# Closed-form (Normal Equation):
beta_ols = np.linalg.solve(X.T @ X, X.T @ y)
# Ridge (L2 regularization):
beta_ridge = np.linalg.solve(X.T @ X + lam*np.eye(p), X.T @ y)`,
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
    accentColor: "#00d4aa",
    visualization: "decision-tree",
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
from sklearn.model_selection import cross_val_score
import shap

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
importances.nlargest(20).plot(kind='barh')

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
    accentColor: "#f59e0b",
    visualization: "gradient-boosting",
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
  "neural-networks": {
    id: "neural-networks",
    tagline: "Universal approximators built from threshold logic, optimized by calculus",
    accentColor: "#ec4899",
    visualization: "backprop",
    keyFormulas: [
      { name: "Forward Pass", latex: "\\mathbf{z}^{[l]} = \\mathbf{W}^{[l]}\\mathbf{a}^{[l-1]} + \\mathbf{b}^{[l]}", meaning: "Linear transformation at layer l" },
      { name: "Activation", latex: "\\mathbf{a}^{[l]} = g^{[l]}(\\mathbf{z}^{[l]})", meaning: "Non-linear activation applied element-wise" },
      { name: "Backprop Delta", latex: "\\delta^{[l]} = ((\\mathbf{W}^{[l+1]})^\\top \\delta^{[l+1]}) \\odot g'^{[l]}(\\mathbf{z}^{[l]})", meaning: "Error signal propagated backwards through layer l" },
      { name: "Weight Gradient", latex: "\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}^{[l]}} = \\delta^{[l]} (\\mathbf{a}^{[l-1]})^\\top", meaning: "Gradient of loss w.r.t. weights at layer l" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "The Universal Approximation Theorem",
        text: "Cybenko (1989) proved that a single hidden layer with enough neurons can approximate any continuous function to arbitrary precision. But 'enough' can mean billions of neurons for complex functions. Deep networks (many layers, fewer neurons per layer) achieve the same approximation with exponentially fewer parameters — they learn hierarchical representations. This is why depth matters.",
        callout: "A deep network with L layers and n neurons per layer can represent functions that require O(2ⁿ) neurons in a single-layer network. Depth is compression.",
      },
      {
        type: "intuition",
        heading: "What Neurons Actually Compute",
        text: "Each neuron computes a weighted sum of its inputs (a hyperplane), then applies a non-linearity. A single neuron with sigmoid creates a smooth decision boundary that separates space into two regions. Multiple neurons in a layer create multiple hyperplanes. Deep layers compose these hyperplanes, creating increasingly complex decision boundaries — curves, then curves of curves, then manifolds.",
      },
      {
        type: "math",
        heading: "Backpropagation: The Chain Rule at Scale",
        text: "Training requires computing ∂L/∂W for every weight. Direct computation is infeasible — a network with 100M parameters would need 100M separate forward passes. Backpropagation exploits the chain rule to compute all gradients in a single backward pass, the same cost as one forward pass. This is the algorithm that made deep learning possible.",
        formula: "\\frac{\\partial \\mathcal{L}}{\\partial w_{ij}^{[l]}} = \\frac{\\partial \\mathcal{L}}{\\partial z_i^{[l]}} \\cdot \\frac{\\partial z_i^{[l]}}{\\partial w_{ij}^{[l]}} = \\delta_i^{[l]} \\cdot a_j^{[l-1]}",
        formulaLabel: "Chain rule applied to a single weight",
      },
      {
        type: "deepdive",
        heading: "The Vanishing Gradient Problem",
        text: "During backpropagation, gradients are multiplied at each layer: δ[l] = W[l+1]ᵀ · δ[l+1] ⊙ σ'(z[l]). For sigmoid, σ'(z) ≤ 0.25 everywhere. After 10 layers, the gradient is multiplied by 0.25¹⁰ ≈ 0.000001. The gradient essentially vanishes — early layers stop learning. ReLU fixes this: its derivative is 1 for z > 0, so gradients don't shrink as they propagate.",
        formula: "\\text{ReLU}(z) = \\max(0, z), \\quad \\text{ReLU}'(z) = \\begin{cases} 1 & z > 0 \\\\ 0 & z \\leq 0 \\end{cases}",
        formulaLabel: "ReLU and its derivative (solves vanishing gradient)",
      },
      {
        type: "algorithm",
        heading: "Mini-Batch SGD Training Loop",
        steps: [
          "Initialize weights: He init for ReLU (W ~ N(0, √(2/fan_in)))",
          "For each epoch, shuffle training data",
          "For each mini-batch of size B:",
          "  Forward pass: compute activations a[1]...a[L] and loss L",
          "  Backward pass: compute δ[L] then propagate backwards",
          "  Update: W[l] ← W[l] - α · ∂L/∂W[l]",
          "  Update: b[l] ← b[l] - α · ∂L/∂b[l]",
          "Apply learning rate scheduler (CosineAnnealing, ReduceLROnPlateau)",
        ],
      },
      {
        type: "code",
        heading: "PyTorch: Building and Training",
        code: `import torch
import torch.nn as nn
import torch.optim as optim

class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dims, output_dim, dropout=0.3):
        super().__init__()
        layers = []
        dims = [input_dim] + hidden_dims
        for i in range(len(hidden_dims)):
            layers += [
                nn.Linear(dims[i], dims[i+1]),
                nn.BatchNorm1d(dims[i+1]),
                nn.ReLU(),
                nn.Dropout(dropout)
            ]
        layers.append(nn.Linear(hidden_dims[-1], output_dim))
        self.net = nn.Sequential(*layers)

    def forward(self, x):
        return self.net(x)

model = MLP(input_dim=128, hidden_dims=[256, 128, 64], output_dim=1)
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)

# Training step
for x_batch, y_batch in dataloader:
    optimizer.zero_grad()
    logits = model(x_batch).squeeze()
    loss = nn.BCEWithLogitsLoss()(logits, y_batch.float())
    loss.backward()
    nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
    scheduler.step()`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "Critical Pitfalls",
        steps: [
          "Dead ReLU neurons: if a neuron's weights push z < 0 for all inputs, it never activates. Use LeakyReLU or proper He initialization.",
          "Exploding gradients: clip_grad_norm_(model.parameters(), 1.0) should always be in your training loop.",
          "No BatchNorm: covariate shift makes deep networks unstable. Always BatchNorm between linear and activation layers.",
          "Learning rate: too high → loss diverges; too low → training takes 100x longer. Use lr_find or start at 1e-3 with AdamW.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. TRANSFORMERS & SELF-ATTENTION
  // ─────────────────────────────────────────────────────────────
  "transformers-attention": {
    id: "transformers-attention",
    tagline: "Every word speaks directly to every other word — attending to the whole sentence at once",
    accentColor: "#06b6d4",
    visualization: "attention",
    keyFormulas: [
      { name: "Scaled Dot-Product", latex: "\\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V", meaning: "Core attention: how much each query attends to each key" },
      { name: "Multi-Head", latex: "\\text{MH}(Q,K,V) = \\text{Concat}(\\text{head}_1,\\ldots,\\text{head}_h)\\mathbf{W}^O", meaning: "H parallel attention functions joined and projected" },
      { name: "Positional Encoding", latex: "PE_{(pos,2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d}}\\right)", meaning: "Injects token position info (no recurrence)" },
      { name: "FFN Sublayer", latex: "\\text{FFN}(x) = \\text{ReLU}(x\\mathbf{W}_1 + b_1)\\mathbf{W}_2 + b_2", meaning: "Position-wise feed-forward after each attention block" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "The Problem with RNNs That Transformers Solved",
        text: "RNNs process sequences token by token — to understand the relationship between word 1 and word 500, information must flow through 499 intermediate states, each potentially corrupting or forgetting it (vanishing gradient). Transformers solve this by allowing any position to directly attend to any other position in a single step. This direct path, combined with parallel computation, is why Transformers replaced RNNs for almost everything.",
      },
      {
        type: "intuition",
        heading: "Attention as a Soft Database Query",
        text: "Think of attention as a differentiable key-value store. You have a Query (what you're looking for), Keys (descriptors of each memory), and Values (the actual content). Attention computes similarity between Query and all Keys, runs softmax to get a probability distribution, then returns a weighted sum of Values. The word 'bank' in 'river bank' will attend heavily to 'river' (high Q·K similarity) and retrieve its financial meaning — context-dependent representation.",
        callout: "The √d_k scaling prevents dot products from growing large (which would make softmax extremely peaked, killing gradient flow through the distribution).",
      },
      {
        type: "math",
        heading: "Multi-Head Attention: Why Multiple Heads?",
        text: "A single attention head can only attend based on one 'criterion' (e.g., syntactic subject-verb agreement). Multiple heads learn different attention patterns simultaneously: head 1 might track syntax, head 2 semantics, head 3 coreference. Each head projects Q, K, V to a lower-dimensional subspace, computes attention there, then all heads are concatenated and projected back.",
        formula: "\\text{head}_i = \\text{Attention}(Q\\mathbf{W}_i^Q,\\; K\\mathbf{W}_i^K,\\; V\\mathbf{W}_i^V)",
        formulaLabel: "Each head uses its own learned projection matrices",
      },
      {
        type: "deepdive",
        heading: "BERT vs GPT: Encoder vs Decoder",
        text: "BERT uses bidirectional attention — each token attends to all other tokens (past and future). This is great for understanding (classification, NER, QA) but can't generate text left-to-right. GPT uses masked (causal) attention — each token only attends to previous tokens. This enables autoregressive text generation. The mask is a lower-triangular matrix of -inf values added before softmax, zeroing out future attention.",
        formula: "\\text{Mask}_{ij} = \\begin{cases} 0 & i \\geq j \\\\ -\\infty & i < j \\end{cases}",
        formulaLabel: "Causal mask (prevents attending to future tokens)",
      },
      {
        type: "algorithm",
        heading: "Transformer Encoder Block",
        steps: [
          "Input embeddings E = token_embed + positional_encoding",
          "Multi-Head Self-Attention: Q=EW_Q, K=EW_K, V=EW_V",
          "Attention(Q,K,V) = softmax(QKᵀ/√d_k)V",
          "Add & Norm: x₁ = LayerNorm(E + Attention(E))",
          "Feed-Forward: FFN(x₁) = ReLU(x₁W₁ + b₁)W₂ + b₂",
          "Add & Norm: x₂ = LayerNorm(x₁ + FFN(x₁))",
          "Repeat for L layers",
        ],
      },
      {
        type: "code",
        heading: "Scaled Dot-Product Attention from Scratch",
        code: `import torch
import torch.nn.functional as F
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V: (batch, heads, seq_len, d_k)
    """
    d_k = Q.shape[-1]
    # Attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    # Causal mask (GPT-style)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    # Softmax over key dimension
    attn_weights = F.softmax(scores, dim=-1)
    # Weighted sum of values
    return torch.matmul(attn_weights, V), attn_weights

class MultiHeadAttention(torch.nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.d_k = d_model // n_heads
        self.n_heads = n_heads
        self.W_q = torch.nn.Linear(d_model, d_model)
        self.W_k = torch.nn.Linear(d_model, d_model)
        self.W_v = torch.nn.Linear(d_model, d_model)
        self.W_o = torch.nn.Linear(d_model, d_model)

    def forward(self, Q, K, V, mask=None):
        B, T, D = Q.shape
        # Project + split into heads
        Q = self.W_q(Q).view(B, T, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(K).view(B, T, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(V).view(B, T, self.n_heads, self.d_k).transpose(1, 2)
        x, weights = scaled_dot_product_attention(Q, K, V, mask)
        # Concat heads + project
        x = x.transpose(1, 2).contiguous().view(B, T, D)
        return self.W_o(x), weights`,
        language: "python",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. CNN ARCHITECTURES
  // ─────────────────────────────────────────────────────────────
  "cnn-architectures": {
    id: "cnn-architectures",
    tagline: "Local pattern detectors that see edges, then textures, then faces — by stacking filters",
    accentColor: "#8b5cf6",
    visualization: "convolution",
    keyFormulas: [
      { name: "Convolution", latex: "(I * K)[i,j] = \\sum_{m}\\sum_{n} I[i+m,j+n] \\cdot K[m,n]", meaning: "Slide a kernel K over input I, computing dot products" },
      { name: "Output Size", latex: "H_{out} = \\left\\lfloor \\frac{H_{in} - k + 2p}{s} \\right\\rfloor + 1", meaning: "H=height, k=kernel size, p=padding, s=stride" },
      { name: "ResNet Skip", latex: "\\mathbf{a}^{[l+2]} = g(\\mathbf{z}^{[l+2]} + \\mathbf{a}^{[l]})", meaning: "Residual connection: add input directly to output" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Spatial Structure Matters",
        text: "Flattening a 224×224 image into a vector loses all spatial relationships — pixel (0,0) has no special relationship to (0,1) in a dense network. CNNs exploit translation invariance: the filter that detects a horizontal edge works the same whether the edge is at the top or bottom of the image. This weight sharing drastically reduces parameters and gives CNNs their inductive bias for vision.",
      },
      {
        type: "intuition",
        heading: "Feature Hierarchy: From Edges to Objects",
        text: "Layer 1 detectors: oriented edges and color blobs (Gabor-like filters). Layer 2: textures built from edge combinations. Layer 3: object parts (wheels, eyes, windows). Final layers: complete objects. This hierarchy was visualized by Zeiler & Fergus (2013) using DeconvNets — you can literally see what each layer 'sees'.",
        callout: "In a 3-layer deep CNN, each output neuron has a receptive field of (k-1)·3+1 pixels — e.g., three 3×3 layers give a 7×7 effective receptive field, same as one 7×7 but with fewer parameters and more non-linearities.",
      },
      {
        type: "math",
        heading: "The Convolution Operation",
        text: "A 2D convolution slides a K×K kernel across the input, computing a dot product at every position. With C_in input channels and C_out output channels, we have C_in × C_out × K² parameters — vastly fewer than a fully connected layer (H·W·C_in × H·W·C_out parameters).",
        formula: "F_{out} = K * F_{in}, \\quad \\text{params} = C_{out} \\times C_{in} \\times k^2",
        formulaLabel: "Convolution output and parameter count",
      },
      {
        type: "deepdive",
        heading: "ResNet: Solving the Degradation Problem",
        text: "Adding more layers to a plain CNN should never hurt (identity mapping). Yet in practice, very deep plain networks trained worse. He et al. (2015) found the culprit: optimization difficulty, not overfitting. Skip connections allow the network to learn residuals F(x) = H(x) - x instead of H(x) directly. If the identity is the optimal mapping, the network just pushes F(x) → 0. This makes 100+ layer training tractable.",
        formula: "\\mathbf{y} = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + \\mathbf{x}",
        formulaLabel: "Residual block: output = learned residual + identity shortcut",
      },
      {
        type: "algorithm",
        heading: "Modern Training Recipe (ResNet / EfficientNet)",
        steps: [
          "Augmentation: RandomHorizontalFlip, RandomCrop, ColorJitter, MixUp/CutMix",
          "Architecture: use pretrained weights (ImageNet) — always better than random init",
          "Unfreeze schedule: freeze backbone, train head for 5 epochs, then unfreeze all",
          "Learning rate: layer-wise LR decay (deeper layers = smaller LR × 0.1 per block)",
          "Regularization: Dropout before final FC, weight decay 1e-4, label smoothing 0.1",
          "Optimizer: AdamW + CosineAnnealing with warmup",
        ],
      },
      {
        type: "code",
        heading: "Fine-tuning EfficientNet for Custom Classification",
        code: `import timm
import torch.nn as nn

# Load pretrained EfficientNet-B4
model = timm.create_model(
    'efficientnet_b4',
    pretrained=True,
    num_classes=0         # Remove classifier head
)

# Freeze backbone initially
for param in model.parameters():
    param.requires_grad = False

# Custom head
classifier = nn.Sequential(
    nn.AdaptiveAvgPool2d(1),
    nn.Flatten(),
    nn.BatchNorm1d(model.num_features),
    nn.Dropout(0.4),
    nn.Linear(model.num_features, num_classes)
)

# Stage 1: train head only (high LR)
optimizer = optim.AdamW(classifier.parameters(), lr=1e-3)
# ... train for 5 epochs

# Stage 2: unfreeze + fine-tune all (low LR)
for param in model.parameters():
    param.requires_grad = True
optimizer = optim.AdamW([
    {'params': model.parameters(), 'lr': 1e-5},
    {'params': classifier.parameters(), 'lr': 1e-4}
])`,
        language: "python",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. MODEL EVALUATION
  // ─────────────────────────────────────────────────────────────
  "model-evaluation": {
    id: "model-evaluation",
    tagline: "Accuracy is a lie — learning to choose the right metric for the real problem",
    accentColor: "#ff6b6b",
    visualization: "roc-curve",
    keyFormulas: [
      { name: "F1 Score", latex: "F_1 = \\frac{2 \\cdot \\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}} = \\frac{2\\,TP}{2\\,TP + FP + FN}", meaning: "Harmonic mean of precision and recall" },
      { name: "AUC-ROC", latex: "\\text{AUC} = \\int_0^1 \\text{TPR}(\\text{FPR}) \\, d(\\text{FPR})", meaning: "Probability that a random positive ranks higher than a random negative" },
      { name: "MCC", latex: "\\text{MCC} = \\frac{TP \\cdot TN - FP \\cdot FN}{\\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}", meaning: "Matthews Correlation Coefficient — best single metric for imbalance" },
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
    classification_report, roc_auc_score,
    average_precision_score, matthews_corrcoef,
    confusion_matrix
)
from sklearn.model_selection import StratifiedKFold
import numpy as np

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
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 8. BIAS-VARIANCE TRADEOFF
  // ─────────────────────────────────────────────────────────────
  "error-analysis": {
    id: "error-analysis",
    tagline: "Every model error is either a wrong assumption or sensitivity to noise — diagnosing which changes everything",
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
        code: `from sklearn.model_selection import learning_curve
import matplotlib.pyplot as plt
import numpy as np

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

  // ─────────────────────────────────────────────────────────────
  // 9. SVM, SVR & KNN
  // ─────────────────────────────────────────────────────────────
  "svm-knn-svr": {
    id: "svm-knn-svr",
    tagline: "Maximum margin is the answer — the wider the street, the more confident the classifier",
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
from sklearn.model_selection import GridSearchCV

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

  // ─────────────────────────────────────────────────────────────
  // 10. RNN, LSTM, GRU
  // ─────────────────────────────────────────────────────────────
  "rnn-lstm-gru": {
    id: "rnn-lstm-gru",
    tagline: "Teaching networks to remember — from catastrophic forgetting to selective gated memory",
    accentColor: "#8b5cf6",
    visualization: "lstm",
    keyFormulas: [
      { name: "RNN Hidden State", latex: "h_t = \\tanh(W_h h_{t-1} + W_x x_t + b)", meaning: "Hidden state mixes previous memory with current input" },
      { name: "LSTM Cell State", latex: "c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t", meaning: "Cell state updated by forget gate and input gate" },
      { name: "LSTM Hidden", latex: "h_t = o_t \\odot \\tanh(c_t)", meaning: "Output gate controls what to expose from cell state" },
      { name: "GRU Update", latex: "h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t", meaning: "Single update gate interpolates old and new hidden state" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Sequences Are Hard",
        text: "Language, time series, audio, DNA — these all have temporal dependencies. 'He said he would come' — 'he' and 'would' are 5 words apart but tightly linked. A feedforward network processes each timestep independently. RNNs share parameters across time and maintain a hidden state that summarizes past inputs — enabling unbounded context. The challenge: making that memory selective and long-range.",
      },
      {
        type: "intuition",
        heading: "The Vanishing Gradient Over Time",
        text: "In BPTT (Backpropagation Through Time), gradients are multiplied by the weight matrix W at each timestep. If the largest eigenvalue of W is < 1, gradients vanish exponentially. If > 1, they explode. For a sequence of 100 timesteps, a gradient from timestep 1 is multiplied by W¹⁰⁰. Standard initialization makes this almost always vanish. LSTMs solve this with the cell state — a 'highway' that carries information with only additive (not multiplicative) updates.",
        callout: "LSTM gradients flow through c_t = f_t ⊙ c_{t-1} + i_t ⊙ c̃_t. The forget gate f_t keeps c-gradients from vanishing — they're gated additions, not matrix multiplications.",
      },
      {
        type: "math",
        heading: "LSTM Gate Equations",
        text: "Four gate computations determine what to forget, learn, and output at each step. All gates use sigmoid (output 0-1 = 'how much of this to let through'). The candidate cell state uses tanh (output -1 to 1 = actual content).",
        formula: "\\begin{aligned} f_t &= \\sigma(W_f[h_{t-1},x_t]+b_f) \\\\ i_t &= \\sigma(W_i[h_{t-1},x_t]+b_i) \\\\ \\tilde{c}_t &= \\tanh(W_c[h_{t-1},x_t]+b_c) \\\\ o_t &= \\sigma(W_o[h_{t-1},x_t]+b_o) \\end{aligned}",
        formulaLabel: "LSTM: Forget (f), Input (i), Cell candidate (c̃), Output (o) gates",
      },
      {
        type: "code",
        heading: "LSTM for Time Series Forecasting",
        code: `import torch
import torch.nn as nn

class LSTMForecaster(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_layers, output_dim, dropout=0.2):
        super().__init__()
        self.lstm = nn.LSTM(
            input_dim, hidden_dim, num_layers,
            batch_first=True, dropout=dropout,
            bidirectional=False
        )
        self.fc = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, h0=None, c0=None):
        # x: (batch, seq_len, features)
        out, (hn, cn) = self.lstm(x, (h0, c0) if h0 is not None else None)
        # Use last timestep's output
        return self.fc(self.dropout(out[:, -1, :]))

# Training with teacher forcing + scheduled sampling
model = LSTMForecaster(input_dim=10, hidden_dim=128, num_layers=2, output_dim=1)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

# Gradient clipping is ESSENTIAL for RNN training
for x, y in dataloader:
    pred = model(x)
    loss = nn.MSELoss()(pred.squeeze(), y)
    optimizer.zero_grad()
    loss.backward()
    nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    optimizer.step()`,
        language: "python",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 11. GENERATIVE MODELS: VAE & GAN
  // ─────────────────────────────────────────────────────────────
  "generative-models": {
    id: "generative-models",
    tagline: "Learning the shape of data — then sampling new reality from the learned distribution",
    accentColor: "#ec4899",
    visualization: "gan",
    keyFormulas: [
      { name: "ELBO (VAE)", latex: "\\mathcal{L} = \\mathbb{E}_{q}[\\log p(x|z)] - D_{KL}(q(z|x) \\| p(z))", meaning: "Reconstruction term − KL divergence (regularizes latent space)" },
      { name: "Reparameterization", latex: "z = \\mu + \\sigma \\odot \\varepsilon, \\quad \\varepsilon \\sim \\mathcal{N}(0,I)", meaning: "Allows gradients to flow through the sampling operation" },
      { name: "GAN Objective", latex: "\\min_G \\max_D \\; \\mathbb{E}[\\log D(x)] + \\mathbb{E}[\\log(1-D(G(z)))]", meaning: "Generator fools Discriminator; Discriminator detects fakes" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "From Discrimination to Generation",
        text: "All previous models are discriminative: P(y|x) — given input, predict output. Generative models learn P(x) — the full distribution of the data. Once you've learned the distribution, you can sample new data points, interpolate between examples, detect anomalies (low-probability points), and do conditional generation. This is how Stable Diffusion, GPT, and DALL-E work at their core.",
      },
      {
        type: "intuition",
        heading: "VAE: The Probabilistic Compression",
        text: "Autoencoders compress data to a latent code then reconstruct. But the latent space is disconnected — similar images aren't near each other, so you can't sample new points meaningfully. VAEs fix this by encoding distributions (μ, σ) instead of points, and penalizing deviation from N(0,I) via KL divergence. This forces a smooth, continuous latent space where interpolation and sampling make semantic sense.",
        callout: "The reparameterization trick z = μ + σ⊙ε is the key insight that makes VAE training possible. Without it, sampling is a non-differentiable operation — no gradients can flow.",
      },
      {
        type: "math",
        heading: "The ELBO: Evidence Lower Bound",
        text: "We want to maximize log p(x) — the likelihood of our data under the model. This is intractable directly (requires integrating over all z). Instead, we maximize the ELBO: reconstruction quality (how well we decode) minus KL divergence from prior (how much the encoder deviates from standard Gaussian). β-VAE adds a weight β to the KL term for disentangled representations.",
        formula: "\\log p(x) \\geq \\underbrace{\\mathbb{E}_{q_\\phi(z|x)}[\\log p_\\theta(x|z)]}_{\\text{reconstruction}} - \\underbrace{D_{KL}(q_\\phi(z|x) \\| p(z))}_{\\text{regularization}}",
        formulaLabel: "ELBO — the objective being maximized in VAE training",
      },
      {
        type: "deepdive",
        heading: "GAN Training: The Adversarial Game",
        text: "Generator G takes noise z ~ N(0,I) and produces fake samples G(z). Discriminator D tries to distinguish real samples from fakes (output probability of being real). They play a minimax game: D maximizes log D(real) + log(1 - D(G(z))); G minimizes log(1 - D(G(z))) [equivalent to maximizing log D(G(z))]. At Nash equilibrium, G produces samples indistinguishable from real data.",
        callout: "Mode collapse: the generator finds a single (or few) point(s) that always fool the discriminator. Fix: Wasserstein GAN (WGAN-GP) with gradient penalty, spectral normalization, or minibatch discrimination.",
      },
      {
        type: "code",
        heading: "DCGAN Implementation",
        code: `import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, latent_dim=100, img_channels=3):
        super().__init__()
        self.net = nn.Sequential(
            # Project and reshape noise
            nn.Linear(latent_dim, 512 * 4 * 4),
            nn.Unflatten(1, (512, 4, 4)),
            # Upsample blocks
            *self._block(512, 256), *self._block(256, 128),
            *self._block(128, 64),  *self._block(64, 32),
            nn.ConvTranspose2d(32, img_channels, 4, 2, 1),
            nn.Tanh()
        )
    def _block(self, in_c, out_c):
        return [nn.ConvTranspose2d(in_c, out_c, 4, 2, 1, bias=False),
                nn.BatchNorm2d(out_c), nn.ReLU(True)]
    def forward(self, z): return self.net(z)

# WGAN-GP training (more stable than vanilla GAN)
def gradient_penalty(D, real, fake, device):
    alpha = torch.rand(real.size(0), 1, 1, 1).to(device)
    interpolated = alpha * real + (1 - alpha) * fake
    interpolated.requires_grad_(True)
    d_interp = D(interpolated)
    gradients = torch.autograd.grad(d_interp, interpolated,
                grad_outputs=torch.ones_like(d_interp),
                create_graph=True)[0]
    return ((gradients.norm(2, dim=1) - 1) ** 2).mean()`,
        language: "python",
      },
    ],
  },

  // Remaining topics (bagging-stacking, ova-ovo) use neural-network viz as fallback
  "bagging-stacking": {
    id: "bagging-stacking",
    tagline: "The wisdom of diverse crowds — combining imperfect models into something stronger than any individual",
    accentColor: "#06b6d4",
    visualization: "bagging",
    keyFormulas: [
      { name: "Bias-Variance of Ensemble", latex: "\\text{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1-\\rho}{n}\\sigma^2", meaning: "Ensemble variance: reducing correlation ρ is the key gain" },
      { name: "AdaBoost Weight", latex: "\\alpha_t = \\frac{1}{2}\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}", meaning: "Higher weight for more accurate weak learners" },
      { name: "Stacking Meta-Input", latex: "\\tilde{X}_i = [h_1(x_i),\\; h_2(x_i),\\; \\ldots,\\; h_K(x_i)]", meaning: "Out-of-fold predictions from base models feed the meta-learner" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Ensembles Win Kaggle",
        text: "The top solution of nearly every Kaggle competition uses ensembling. Individual models have irreducible errors — some samples are hard for tree-based models, others for neural networks. By combining predictions from diverse models, errors cancel out. The result consistently beats any single model — often by 1-3% AUC, which is enormous in competition settings.",
      },
      {
        type: "intuition",
        heading: "The Three Ensemble Paradigms",
        text: "Bagging (Bootstrap AGGregating): train K models on K random subsets of data → average/vote. Reduces variance. Random Forest is bagging. Boosting: train K models sequentially, each fixing the errors of the previous → weighted combination. Reduces bias. XGBoost is boosting. Stacking: train K diverse base models, use their predictions as features for a meta-learner that learns the optimal combination.",
        callout: "Key insight: ensembles work because models are diverse. A bagging ensemble of identical models has exactly the same performance as one model. Diversity = decorrelation = variance reduction.",
      },
      {
        type: "algorithm",
        heading: "Stacking with Out-of-Fold Predictions",
        steps: [
          "Define K diverse base models (LightGBM, XGBoost, CatBoost, Neural Net, etc.)",
          "For each base model, run 5-fold cross-validation",
          "Collect out-of-fold (OOF) predictions — forms a column in meta-features matrix",
          "Stack K columns to form meta-features matrix Ñ ∈ ℝ^{n×K}",
          "Train meta-learner (Logistic Regression or LightGBM) on Ñ with target y",
          "For test: average base model predictions across folds, feed to meta-learner",
        ],
      },
      {
        type: "code",
        heading: "Production Stacking Implementation",
        code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score

def stack_oof(models, X_train, y_train, X_test, n_folds=5):
    """Returns OOF predictions + test predictions for all models."""
    skf = StratifiedKFold(n_splits=n_folds, shuffle=True, random_state=42)
    oof_preds = np.zeros((len(X_train), len(models)))
    test_preds = np.zeros((len(X_test), len(models)))

    for m_idx, model in enumerate(models):
        fold_test_preds = np.zeros((len(X_test), n_folds))
        for f_idx, (tr, val) in enumerate(skf.split(X_train, y_train)):
            model.fit(X_train[tr], y_train[tr])
            oof_preds[val, m_idx] = model.predict_proba(X_train[val])[:,1]
            fold_test_preds[:, f_idx] = model.predict_proba(X_test)[:,1]
        test_preds[:, m_idx] = fold_test_preds.mean(axis=1)
        print(f"Model {m_idx} OOF AUC: {roc_auc_score(y_train, oof_preds[:,m_idx]):.4f}")

    # Meta-learner on OOF predictions
    meta = LogisticRegression(C=0.1)
    meta.fit(oof_preds, y_train)
    final_preds = meta.predict_proba(test_preds)[:,1]
    return final_preds, meta.coef_`,
        language: "python",
      },
    ],
  },

  "ova-ovo": {
    id: "ova-ovo",
    tagline: "Extending binary classifiers to multi-class — tournament brackets for algorithms",
    accentColor: "#64748b",
    visualization: "multiclass",
    keyFormulas: [
      { name: "OvA Classifiers", latex: "K \\text{ classifiers}, \\hat{y} = \\arg\\max_k f_k(x)", meaning: "K binary classifiers, one per class vs. all others" },
      { name: "OvO Classifiers", latex: "\\binom{K}{2} = \\frac{K(K-1)}{2} \\text{ classifiers}", meaning: "One binary classifier per pair of classes" },
      { name: "Softmax", latex: "P(y=k|x) = \\frac{e^{z_k}}{\\sum_{j=1}^{K}e^{z_j}}", meaning: "Normalizes K logits to a probability distribution" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "The Multi-Class Problem",
        text: "Many real problems have more than 2 classes: digit recognition (10 classes), species classification (100s), product categorization (1000s). Some algorithms (logistic regression, SVMs) are inherently binary. Two strategies extend them: OvA trains K classifiers, each separating class k from all others. OvO trains K(K-1)/2 classifiers for every pair. Neural networks with Softmax solve multi-class natively.",
      },
      {
        type: "comparison",
        heading: "OvA vs OvO vs Softmax",
        steps: [
          "OvA: K classifiers, each uses all data. Fast training. Imbalanced (1 positive vs K-1 negatives). Good for large K.",
          "OvO: K(K-1)/2 classifiers, each uses only 2 classes. Balanced but slow for large K (100 classes = 4950 classifiers).",
          "Softmax (multinomial LR): single model, K outputs, trained with cross-entropy. Most efficient. Native to neural nets.",
          "SVM convention: OvO is default in sklearn (historically performs slightly better). For neural nets, always Softmax.",
        ],
      },
      {
        type: "code",
        heading: "Softmax Multi-class Classification",
        code: `import torch
import torch.nn as nn

# Softmax + Cross-Entropy (combined for numerical stability)
criterion = nn.CrossEntropyLoss(
    weight=class_weights,    # For imbalanced classes
    label_smoothing=0.1       # Prevents overconfident predictions
)

# Model outputs raw logits (no softmax in forward pass)
logits = model(x)            # Shape: (batch, K)
loss = criterion(logits, y)  # y contains class indices

# Predictions
probs = torch.softmax(logits, dim=-1)
preds = probs.argmax(dim=-1)

# Sklearn: OvR (OvA) strategy
from sklearn.multiclass import OneVsRestClassifier, OneVsOneClassifier
from sklearn.svm import SVC

ovr = OneVsRestClassifier(SVC(kernel='rbf', probability=True))
ovo = OneVsOneClassifier(SVC(kernel='rbf'))`,
        language: "python",
      },
    ],
  },
};
