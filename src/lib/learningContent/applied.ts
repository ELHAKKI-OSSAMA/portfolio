import type { TopicContent } from './types';

export const appliedContent: Record<string, TopicContent> = {

  "feature-engineering": {
    id: "feature-engineering",
    tagline: "Garbage in, garbage out — the art of turning raw data into model-ready signals",
    taglineFr: "Ordures à l'entrée, ordures à la sortie — l'art de transformer les données brutes en signaux prêts pour le modèle",
    taglineAr: "قمامة داخل، قمامة خارج — فن تحويل البيانات الخام إلى إشارات جاهزة للنموذج",
    accentColor: "#22c55e",
    visualization: "feature-engineering",
    keyFormulas: [
      { name: "StandardScaler", latex: "x' = \\frac{x - \\mu}{\\sigma}", meaning: "Zero mean, unit variance — sensitive to outliers" },
      { name: "MinMaxScaler", latex: "x' = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}", meaning: "Scales to [0,1] — preserves sparsity, sensitive to outliers" },
      { name: "RobustScaler", latex: "x' = \\frac{x - Q_2}{Q_3 - Q_1}", meaning: "Scales using median and IQR — robust to outliers" },
      { name: "Log Transform", latex: "x' = \\log(1 + x)", meaning: "Compresses skewed distributions — useful for income, population counts" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Feature Engineering Wins Competitions",
        text: "Andrew Ng famously said 'Coming up with features is difficult, time-consuming, requires expert knowledge. Applied machine learning is basically feature engineering.' In Kaggle competitions, top-ranked solutions consistently have better feature engineering than better model architectures. A linear model with brilliant features beats a deep network with raw features in most tabular data problems. Features encode human knowledge about the problem domain — they're the bridge between raw measurement and mathematical structure a model can exploit.",
        callout: "In the Netflix Prize ($1M), the winning team's features included complex temporal patterns, implicit user feedback signals, and movie metadata interactions — not model sophistication.",
      },
      {
        type: "intuition",
        heading: "The Pipeline Mindset",
        text: "Think of feature engineering as a sequence of transformations: Raw Data → Imputation (fill missing values) → Encoding (convert categoricals to numbers) → Scaling (put features on comparable scales) → Selection (drop noisy/redundant features). Each step must be fit on training data only and applied consistently to test data — use scikit-learn Pipelines to guarantee this. A Pipeline is also serializable, so your preprocessing is always bundled with your model for deployment.",
        callout: "Data leakage is the most dangerous bug in ML: if your test data influences any preprocessing step, your evaluation is optimistic garbage. Pipelines prevent this by design.",
      },
      {
        type: "algorithm",
        heading: "The 5-Stage Pipeline",
        steps: [
          "Imputation: SimpleImputer (mean/median/mode/constant) or IterativeImputer (MICE multivariate)",
          "Encoding: OrdinalEncoder for ordered categories, OneHotEncoder for nominal (use drop='first' to avoid dummy trap)",
          "Scaling: StandardScaler for Gaussian-ish data, RobustScaler when outliers exist, MinMaxScaler for bounded inputs",
          "Feature creation: PolynomialFeatures (x², x·y interactions), date decomposition (day/month/weekday), domain transforms (log, sqrt)",
          "Selection: VarianceThreshold, SelectKBest (mutual info / chi²), SelectFromModel (tree importances), RFECV",
        ],
      },
      {
        type: "deepdive",
        heading: "Categorical Encoding Strategies",
        text: "One-Hot Encoding creates a binary column per category — perfect for unordered categories with few values. With high-cardinality categoricals (cities, zip codes, product IDs), OHE explodes dimensionality. Use Target Encoding instead: replace each category with the mean target value of that category. But target encoding leaks if not done with cross-validation folds. CatBoost's ordered target encoding solves this by using only past samples. For ordinal features (Low/Medium/High), always use OrdinalEncoder with explicit category order.",
        callout: "High cardinality + OHE = disaster. 10,000 zip codes → 10,000 columns, most nearly empty. Use target encoding, embedding layers, or feature hashing instead.",
      },
      {
        type: "math",
        heading: "Scaling Choices and Their Effects",
        text: "StandardScaler: assumes Gaussian distribution, makes mean=0 and std=1. Required for SVMs, regularized linear models (Lasso/Ridge), PCA, KNN, neural networks. Not needed for tree-based models (Random Forest, XGBoost — trees only use feature order, not magnitude). MinMaxScaler: needed when algorithm requires bounded inputs (sigmoid activation, [0,1] features for neural networks). RobustScaler: use when outliers are present — scales using median and IQR, making it robust to extreme values.",
        formula: "x' = \\frac{x - Q_{0.5}}{Q_{0.75} - Q_{0.25}}",
        formulaLabel: "RobustScaler — median centering with IQR scaling",
      },
      {
        type: "code",
        heading: "sklearn Pipeline — Full Example",
        code: `from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import (StandardScaler, OneHotEncoder,
                                   RobustScaler, PolynomialFeatures)
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import SelectFromModel
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score, train_test_split
import pandas as pd
import numpy as np

# ── Sample DataFrame ───────────────────────────────────────────────────
np.random.seed(42)
n = 300
df = pd.DataFrame({
    'age':        np.random.randint(18, 70, n).astype(float),
    'income':     np.random.exponential(40000, n),
    'score':      np.random.uniform(300, 850, n),
    'city':       np.random.choice(['Paris', 'Lyon', 'Toulouse'], n),
    'occupation': np.random.choice(['engineer', 'teacher', 'doctor'], n),
    'target':     np.random.randint(0, 2, n),
})
# Add some missing values
df.loc[np.random.choice(n, 20, replace=False), 'age'] = np.nan
df.loc[np.random.choice(n, 15, replace=False), 'city'] = np.nan

X_train = df.drop('target', axis=1)
y_train = df['target']

# ── Define column groups ───────────────────────────────────────────
num_features = ['age', 'income', 'score']
cat_features = ['city', 'occupation']

# ── Preprocessing for numeric columns ─────────────────────────────
numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', RobustScaler()),
])

# ── Preprocessing for categorical columns ─────────────────────────
categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', drop='first')),
])

# ── Combine with ColumnTransformer ─────────────────────────────────
preprocessor = ColumnTransformer([
    ('num', numeric_transformer, num_features),
    ('cat', categorical_transformer, cat_features),
])

# ── Full pipeline: preprocess → feature select → model ────────────
pipe = Pipeline([
    ('prep', preprocessor),
    ('poly', PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)),
    ('select', SelectFromModel(RandomForestClassifier(n_estimators=50), threshold='median')),
    ('clf', GradientBoostingClassifier(n_estimators=200, learning_rate=0.05)),
])

# Train / evaluate — preprocessing is always fitted on train only
pipe.fit(X_train, y_train)
scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring='roc_auc')
print(f"CV AUC: {scores.mean():.3f} ± {scores.std():.3f}")`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "Preprocessing Pitfalls",
        text: "Fitting scalers on the full dataset (before splitting) is data leakage — test statistics contaminate training. Always fit inside a Pipeline or on X_train only. Second: OneHotEncoder on test data may see unseen categories → use handle_unknown='ignore'. Third: imputing with mean before splitting leaks test mean into training. Fourth: polynomial features explode memory — 100 features × degree=2 → 5,050 columns. Use interaction_only=True and feature selection downstream. Fifth: target encoding without cross-validation leaks target information.",
        callout: "The Pipeline object in scikit-learn is not just convenient — it is required for correct cross-validation. Any preprocessing that 'learns' from data (scalers, encoders, imputers) must be inside the pipeline.",
      },
    ],
  },

  "hyperparameter-tuning": {
    id: "hyperparameter-tuning",
    tagline: "Automating the art of finding the right knobs to turn",
    taglineFr: "Automatiser l'art de trouver les bons réglages à ajuster",
    taglineAr: "أتمتة فن إيجاد المعاملات الصحيحة للضبط",
    accentColor: "#f97316",
    visualization: "hyperparameter-tuning",
    keyFormulas: [
      { name: "Grid Search", latex: "\\theta^* = \\arg\\max_{\\theta \\in \\Theta} \\overline{\\text{CV}}(\\theta)", meaning: "Exhaustive search over all combinations in the predefined grid" },
      { name: "Successive Halving", latex: "n_k = n_0 \\cdot \\eta^{-k}", meaning: "Progressively eliminate poor candidates, allocating more resources to promising ones" },
      { name: "Expected Improvement", latex: "\\text{EI}(\\theta) = \\mathbb{E}[\\max(f^* - f(\\theta),\\, 0)]", meaning: "Bayesian Optimisation acquisition function — trades exploration vs exploitation" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Hyperparameters Matter",
        text: "A random forest with max_depth=5 might score 0.72 AUC. The same algorithm with max_depth=12, min_samples_leaf=3, max_features='sqrt' scores 0.89 AUC. That 17-point gap is pure hyperparameter tuning — the algorithm didn't change, the data didn't change. Hyperparameters are parameters that are not learned from data; they control the learning process itself. Choosing them well is often the difference between a mediocre model and a production-ready one.",
        callout: "The learning rate is the single most important hyperparameter in most gradient-based models. Too high = divergence. Too low = slow convergence or local minima. Always tune it first.",
      },
      {
        type: "comparison",
        heading: "Grid vs Random vs Bayesian",
        text: "Grid Search evaluates every combination in the Cartesian product of parameter values — correct but exponentially expensive (10 params × 5 values each = 5¹⁰ ≈ 10M evaluations). Random Search samples n_iter random combinations — surprisingly effective because most hyperparameter spaces have only a few dimensions that truly matter; random sampling covers them better than grids. Bayesian Optimization maintains a probabilistic model of the objective surface (Gaussian Process or Tree Parzen Estimator) and sequentially suggests configurations that maximize expected improvement — it learns from previous evaluations and focuses on promising regions.",
        callout: "Random Search with n_iter=60 typically outperforms Grid Search with 5× more evaluations. Bayesian Optimization outperforms both when evaluations are expensive (e.g., training a large neural net).",
      },
      {
        type: "algorithm",
        heading: "Bayesian Optimisation Loop",
        steps: [
          "Fit a surrogate model (Gaussian Process) to previous (θ, score) observations",
          "Use acquisition function (Expected Improvement, UCB) to select next θ",
          "EI: explore where uncertainty is high OR where expected gain is high",
          "Evaluate the actual objective: train model with θ, compute CV score",
          "Add new observation to dataset, refit surrogate",
          "Repeat until budget exhausted — return best θ found",
        ],
      },
      {
        type: "deepdive",
        heading: "Halving Search: Speed Without Sacrifice",
        text: "HalvingGridSearchCV and HalvingRandomSearchCV implement successive halving: start with all candidates but minimal resources (few training samples or estimators), keep the top η fraction, double the resources, repeat. A grid of 1024 candidates with 4 halving rounds needs only 1024×1 + 512×2 + 256×4 + 128×8 = 4096 total evaluations, vs 1024×all for standard GridSearchCV. This gives a 10–100× speedup for large grids with negligible quality loss.",
        callout: "For neural networks, use Keras Tuner or Optuna rather than sklearn's search — they support asynchronous parallel trials, early stopping integration, and neural-specific search spaces.",
      },
      {
        type: "code",
        heading: "All Three Methods in scikit-learn",
        code: `from sklearn.model_selection import (GridSearchCV, RandomizedSearchCV,
                                       cross_val_score, train_test_split)
from sklearn.experimental import enable_halving_search_cv  # noqa
from sklearn.model_selection import HalvingRandomSearchCV
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import make_classification
from scipy.stats import uniform, randint
import optuna  # for Bayesian

# ── Sample data ────────────────────────────────────────────────────────
X, y = make_classification(n_samples=600, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# ── Parameter space ────────────────────────────────────────────────
param_grid = {
    'n_estimators':     [100, 200, 400],
    'max_depth':        [3, 5, 7, 9],
    'learning_rate':    [0.01, 0.05, 0.1, 0.2],
    'subsample':        [0.7, 0.8, 1.0],
    'min_samples_leaf': [1, 3, 5],
}

# ── 1. Grid Search (exhaustive, expensive) ─────────────────────────
gs = GridSearchCV(GradientBoostingClassifier(), param_grid,
                  cv=5, scoring='roc_auc', n_jobs=-1)
gs.fit(X_train, y_train)
print(f"Grid best: {gs.best_score_:.4f}  {gs.best_params_}")

# ── 2. Random Search (fast, almost-as-good) ────────────────────────
param_dist = {
    'n_estimators':     randint(50, 500),
    'max_depth':        randint(2, 12),
    'learning_rate':    uniform(0.005, 0.3),
    'subsample':        uniform(0.6, 0.4),
}
rs = RandomizedSearchCV(GradientBoostingClassifier(), param_dist,
                        n_iter=60, cv=5, scoring='roc_auc',
                        n_jobs=-1, random_state=42)
rs.fit(X_train, y_train)
print(f"Random best: {rs.best_score_:.4f}  {rs.best_params_}")

# ── 3. Optuna (Bayesian, best quality) ─────────────────────────────
def objective(trial):
    params = {
        'n_estimators':   trial.suggest_int('n_estimators', 50, 500),
        'max_depth':      trial.suggest_int('max_depth', 2, 12),
        'learning_rate':  trial.suggest_float('learning_rate', 1e-3, 0.3, log=True),
        'subsample':      trial.suggest_float('subsample', 0.5, 1.0),
    }
    model = GradientBoostingClassifier(**params)
    return cross_val_score(model, X_train, y_train, cv=3, scoring='roc_auc').mean()

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100, n_jobs=4)
print(f"Optuna best: {study.best_value:.4f}  {study.best_params}")`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "Hyperparameter Tuning Pitfalls",
        text: "Tuning on the test set inflates performance estimates — always tune using only cross-validation on training data. Second: nested cross-validation is needed for unbiased estimation when both model selection and hyperparameter tuning are applied — the outer loop estimates generalization error, the inner loop selects hyperparameters. Third: the 'winner's curse' — with 1000 random configurations, the best one will be optimistic by random chance. Use a holdout set to verify the best configuration. Fourth: don't tune everything simultaneously — fix learning rate first, then regularization, then architecture.",
        callout: "Overfitting to the validation set is real. With enough hyperparameter trials, you will find a configuration that accidentally scores well on your CV folds but generalizes poorly. Always do a final evaluation on a truly held-out test set.",
      },
    ],
  },

  "naive-bayes": {
    id: "naive-bayes",
    tagline: "Bayes' theorem + one bold assumption = a surprisingly powerful classifier",
    taglineFr: "Théorème de Bayes + une hypothèse audacieuse = un classifieur étonnamment puissant",
    taglineAr: "نظرية بايز + افتراض جريء واحد = مصنّف قوي بشكل مدهش",
    accentColor: "#8b5cf6",
    visualization: "naive-bayes",
    keyFormulas: [
      { name: "Bayes' Theorem", latex: "P(C|x) = \\frac{P(x|C)\\, P(C)}{P(x)}", meaning: "Posterior = Likelihood × Prior / Evidence" },
      { name: "Naïve Assumption", latex: "P(x|C) = \\prod_{j=1}^{p} P(x_j|C)", meaning: "Features are conditionally independent given the class — the 'naïve' part" },
      { name: "MAP Decision", latex: "\\hat{y} = \\arg\\max_C P(C) \\prod_{j=1}^{p} P(x_j|C)", meaning: "Maximum a posteriori — drop P(x) since it's the same for all classes" },
      { name: "Gaussian Likelihood", latex: "P(x_j|C) = \\frac{1}{\\sigma_{jC}\\sqrt{2\\pi}}\\exp\\!\\left(-\\frac{(x_j-\\mu_{jC})^2}{2\\sigma_{jC}^2}\\right)", meaning: "Gaussian NB assumes each feature is normally distributed within each class" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Learn Naïve Bayes?",
        text: "Naïve Bayes classifies spam emails better than many complex models, runs in microseconds, requires almost no training data, handles missing features gracefully, and produces calibrated probabilities. Gmail's original spam filter was Naïve Bayes. It's the go-to baseline for text classification problems. Understanding it gives you deep intuition about probabilistic classifiers, the bias-variance tradeoff, and why a 'wrong' assumption (conditional independence) can still produce useful models in practice.",
        callout: "Despite its 'naïve' independence assumption being almost always wrong in practice, Naïve Bayes consistently achieves near-optimal classification accuracy in text and document classification tasks.",
      },
      {
        type: "intuition",
        heading: "The Probabilistic Intuition",
        text: "Suppose you want to classify an email as Spam or Ham. You've seen 1000 emails. 300 were spam. The word 'Viagra' appears in 250 of the 300 spam emails and only 1 of the 700 ham emails. The word 'meeting' appears in 5 spam and 400 ham emails. For a new email containing both words, Naïve Bayes multiplies: P(spam) × P(Viagra|spam) × P(meeting|spam). This product is the unnormalized posterior — compare it against P(ham) × P(Viagra|ham) × P(meeting|ham). The larger wins. The 'naïve' assumption makes this multiplication valid.",
      },
      {
        type: "math",
        heading: "Derivation of the Decision Rule",
        text: "By Bayes' theorem: P(C|x) ∝ P(x|C)P(C). The naïve assumption factorizes P(x|C) = ∏ P(xⱼ|C). Since P(x) is constant across classes, we only need the numerator. Taking logs (for numerical stability — products of small probabilities underflow): log P(C|x) = log P(C) + Σⱼ log P(xⱼ|C). For Gaussian NB, P(xⱼ|C) is a Gaussian with mean and variance estimated per feature per class. For Multinomial NB (text), P(xⱼ|C) is the smoothed word frequency in class C.",
        formula: "\\hat{y} = \\arg\\max_C \\left[ \\log P(C) + \\sum_{j=1}^{p} \\log P(x_j | C) \\right]",
        formulaLabel: "Log-space MAP decision rule",
      },
      {
        type: "deepdive",
        heading: "Laplace Smoothing: Avoiding Zero Probabilities",
        text: "If a word never appears in spam training emails, P(word|spam)=0 and the entire product becomes 0 — one unseen word makes the classifier completely ignore all other evidence. Laplace smoothing adds α (usually 1) to all word counts: P(xⱼ|C) = (count(xⱼ,C) + α) / (count(C) + α × |V|) where |V| is vocabulary size. This ensures no probability is ever exactly 0. Larger α = more smoothing = closer to uniform distribution (stronger prior).",
        callout: "Laplace smoothing is a form of L1 regularization in the probability simplex. It prevents overfitting to rare words and is crucial for Multinomial NB on text data.",
      },
      {
        type: "comparison",
        heading: "Which Naïve Bayes Variant to Use?",
        text: "GaussianNB: continuous features assumed Gaussian per class. Good for sensor data, medical measurements. MultinomialNB: integer count features (word counts, TF-IDF ×N). Standard for document classification. BernoulliNB: binary features (word presence/absence). Good for short texts where rare words matter. ComplementNB: addresses MultinomialNB's bias on imbalanced data by modeling the complement of each class — often the best for text classification.",
        steps: [
          "Continuous features → GaussianNB",
          "Word count / TF-IDF features → MultinomialNB (requires non-negative)",
          "Binary features (word present/absent) → BernoulliNB",
          "Imbalanced text classification → ComplementNB",
          "Mixed types → use ColumnTransformer + different NB per column type",
        ],
      },
      {
        type: "code",
        heading: "Text Classification with Naïve Bayes",
        code: `from sklearn.naive_bayes import MultinomialNB, ComplementNB, GaussianNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.calibration import CalibratedClassifierCV
from sklearn.preprocessing import LabelEncoder

# ── Sample text data ───────────────────────────────────────────────────
X_text = [
    "buy cheap pills now", "get rich quick scheme", "free money click here",
    "meeting at 3pm tomorrow", "quarterly report attached", "team lunch Friday",
    "win a prize enter now", "limited offer act fast", "investment opportunity",
    "project deadline next week", "budget review scheduled", "please review document",
] * 20   # 240 samples
y_raw = ([1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0] * 20)  # 1=spam, 0=ham
import numpy as np
y = np.array(y_raw)
X_train, X_test, y_train, y_test = train_test_split(
    X_text, y, test_size=0.2, random_state=42)

# ── Text classification (spam detection) ──────────────────────────
pipe = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1,2),       # unigrams + bigrams
        max_features=50_000,
        sublinear_tf=True,       # log(1+tf)
        min_df=3,
    )),
    ('clf', ComplementNB(alpha=0.1)),  # best for text
])

scores = cross_val_score(pipe, X_text, y, cv=5, scoring='f1_macro')
print(f"F1: {scores.mean():.3f} ± {scores.std():.3f}")

# ── Calibrated probabilities ───────────────────────────────────────
# NB probabilities are often poorly calibrated (overconfident)
# Use isotonic regression calibration for better probability estimates
pipe_cal = CalibratedClassifierCV(pipe, cv=5, method='isotonic')
pipe_cal.fit(X_train, y_train)
probs = pipe_cal.predict_proba(X_test)

# ── Continuous features: GaussianNB ────────────────────────────────
from sklearn.preprocessing import StandardScaler
gnb = Pipeline([
    ('scaler', StandardScaler()),
    ('clf', GaussianNB(var_smoothing=1e-9)),
])
gnb.fit(X_train, y_train)
print(f"GaussianNB accuracy: {gnb.score(X_test, y_test):.3f}")

# ── Inspect learned parameters ─────────────────────────────────────
nb = gnb.named_steps['clf']
print("Class priors:", nb.class_prior_)
print("Feature means per class:", nb.theta_)   # shape (n_classes, n_features)`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "Naïve Bayes Pitfalls",
        text: "The independence assumption means correlated features are double-counted. If 'Viagra' and 'pill' always co-occur in spam, their combined evidence is counted twice, leading to overconfident posteriors. This is why NB probabilities are usually poorly calibrated even when classifications are correct — always use CalibratedClassifierCV for probability outputs. Also: MultinomialNB requires non-negative features (can't use raw TF-IDF with negative values from e.g., cosine-centered representations).",
        callout: "Naïve Bayes is an excellent baseline and often hard to beat on small text datasets. If it scores 85% and your complex model scores 87%, ask: is the 2% gain worth 10× the complexity and training time?",
      },
    ],
  },

  "time-series": {
    id: "time-series",
    tagline: "When the order of observations matters — learning from the past to predict the future",
    taglineFr: "Quand l'ordre des observations compte — apprendre du passé pour prédire l'avenir",
    taglineAr: "عندما يهم ترتيب الملاحظات — التعلم من الماضي للتنبؤ بالمستقبل",
    accentColor: "#06b6d4",
    visualization: "time-series",
    keyFormulas: [
      { name: "Decomposition", latex: "y_t = T_t + S_t + R_t", meaning: "Additive: trend + seasonal + residual. Multiplicative: T × S × R when amplitudes scale with trend." },
      { name: "AR(p) Model", latex: "y_t = c + \\sum_{i=1}^{p} \\phi_i y_{t-i} + \\varepsilon_t", meaning: "Autoregression: current value is a linear combination of p past values" },
      { name: "ACF", latex: "\\rho_k = \\frac{\\text{Cov}(y_t, y_{t-k})}{\\text{Var}(y_t)}", meaning: "Autocorrelation Function — how correlated is the series with its k-step lag?" },
      { name: "MAPE", latex: "\\text{MAPE} = \\frac{100}{n}\\sum_{t=1}^{n}\\left|\\frac{y_t - \\hat{y}_t}{y_t}\\right|", meaning: "Mean Absolute Percentage Error — scale-free forecasting metric" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Time Series Are Everywhere",
        text: "Stock prices, electricity demand, server CPU load, website traffic, COVID cases, weather, sales — all are time series. The fundamental difference from standard ML: observations are ordered and correlated. Using tomorrow's data to predict yesterday violates causality. Using a standard train/test split (random shuffle) contaminates your evaluation because test data appears in the training period. Time series require temporal cross-validation and temporal feature engineering.",
        callout: "Prophet (Meta) and ARIMA are industry standards for forecasting. But gradient boosting with careful lag features and TimeSeriesSplit cross-validation often beats both on tabular time series.",
      },
      {
        type: "intuition",
        heading: "Decomposition: Separating Signal from Noise",
        text: "Most real-world time series have three components: Trend (the long-run direction — sales increasing over years), Seasonality (repeating patterns — higher sales in December, lower in January), and Residuals (random noise after trend and seasonality are removed). Additive decomposition works when seasonal amplitude is constant; multiplicative when it grows with the trend. STL (Seasonal-Trend decomposition using LOESS) is the modern robust approach — handles multiple seasonality periods and outliers.",
      },
      {
        type: "deepdive",
        heading: "Creating Features from Time",
        text: "Time series can be treated as supervised ML by creating lag features and rolling statistics. Lag features: y_{t-1}, y_{t-2}, ..., y_{t-p} capture autocorrelation. Rolling statistics: rolling_mean(window=7), rolling_std, rolling_max capture recent trend and volatility. Calendar features: hour_of_day, day_of_week, month, is_holiday capture seasonality. Fourier features: sin(2πt/period), cos(2πt/period) encode smooth seasonal patterns. Once these features are created, any ML model (XGBoost, LightGBM) can be applied.",
        steps: [
          "Create lag features: df['lag_1'] = df['y'].shift(1)",
          "Rolling statistics: df['roll_mean_7'] = df['y'].rolling(7).mean()",
          "Calendar features: df['dayofweek'] = df.index.dayofweek",
          "Fourier seasonality: sin/cos pairs for each seasonal period",
          "Always use TimeSeriesSplit — never shuffle time series for CV",
          "Gap between train/validation: add gap= to avoid leakage from autocorrelation",
        ],
      },
      {
        type: "algorithm",
        heading: "TimeSeriesSplit: Correct Cross-Validation",
        steps: [
          "Fold 1: Train=[t₁…t₃₀₀], Val=[t₃₀₁…t₄₀₀]",
          "Fold 2: Train=[t₁…t₄₀₀], Val=[t₄₀₁…t₅₀₀]",
          "Fold 3: Train=[t₁…t₅₀₀], Val=[t₅₀₁…t₆₀₀]",
          "Training window always ends before validation — no future leakage",
          "Option: gap=k between train end and val start (avoids autocorrelation leakage)",
          "Option: max_train_size=N for rolling window (only last N points in train)",
        ],
      },
      {
        type: "code",
        heading: "Forecasting with sklearn + LightGBM",
        code: `import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── Sample daily time-series DataFrame ────────────────────────────────
dates = pd.date_range('2022-01-01', periods=365, freq='D')
np.random.seed(42)
trend = np.linspace(100, 200, 365)
seasonal = 20 * np.sin(2 * np.pi * np.arange(365) / 7)  # weekly pattern
noise = np.random.randn(365) * 5
df = pd.DataFrame({'sales': trend + seasonal + noise}, index=dates)

def create_features(df, target_col, lags, rolling_windows):
    """Create lag and rolling features for supervised time series forecasting."""
    df = df.copy()
    for lag in lags:
        df[f'lag_{lag}'] = df[target_col].shift(lag)
    for w in rolling_windows:
        df[f'roll_mean_{w}'] = df[target_col].shift(1).rolling(w).mean()
        df[f'roll_std_{w}']  = df[target_col].shift(1).rolling(w).std()
    # Calendar features
    df['dayofweek']  = df.index.dayofweek
    df['month']      = df.index.month
    df['is_weekend'] = df['dayofweek'] >= 5
    # Fourier seasonality (weekly=7, yearly=365)
    for k in range(1, 3):
        df[f'sin_week_{k}'] = np.sin(2*np.pi*k * df.index.dayofyear / 7)
        df[f'cos_week_{k}'] = np.cos(2*np.pi*k * df.index.dayofyear / 7)
    return df.dropna()

df_feat = create_features(df, 'sales', lags=[1,2,3,7,14,28], rolling_windows=[7,14,28])
X = df_feat.drop('sales', axis=1)
y = df_feat['sales']

# ── TimeSeriesSplit cross-validation ──────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, gap=7)  # 7-day gap prevents autocorrelation leakage
maes = []

for train_idx, val_idx in tscv.split(X):
    X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
    y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]

    model = lgb.LGBMRegressor(n_estimators=500, learning_rate=0.05,
                               num_leaves=31, min_child_samples=20)
    model.fit(X_tr, y_tr,
              eval_set=[(X_val, y_val)],
              callbacks=[lgb.early_stopping(50, verbose=False)])
    maes.append(mean_absolute_error(y_val, model.predict(X_val)))

print(f"CV MAE: {np.mean(maes):.2f} ± {np.std(maes):.2f}")`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "Time Series Pitfalls",
        text: "Using random train/test split on time series data is the #1 mistake — your model trains on future data, resulting in wildly optimistic evaluation. Always use TimeSeriesSplit or a single temporal split where train comes before test. Second: not adding a gap between train and validation windows — autocorrelation means the last training point and first validation point are highly correlated, making validation look easy. Third: feature leakage — using a rolling mean of y itself without proper shifting means future values contaminate current features. Always shift(1) before rolling.",
        callout: "For production forecasting, retrain your model as new data arrives (online learning or periodic retraining). Models that were accurate 6 months ago may have drifted as the distribution of the time series changes.",
      },
    ],
  },

  "nlp-text": {
    id: "nlp-text",
    tagline: "Teaching machines to read — from bag-of-words to transformers",
    taglineFr: "Apprendre aux machines à lire — du sac de mots aux transformers",
    taglineAr: "تعليم الآلات القراءة — من حقيبة الكلمات إلى المحولات",
    accentColor: "#06b6d4",
    visualization: "nlp-text",
    keyFormulas: [
      { name: "TF-IDF", latex: "\\text{tfidf}(t,d) = \\underbrace{\\frac{f_{t,d}}{|d|}}_{\\text{TF}} \\cdot \\underbrace{\\log\\frac{N}{df_t}}_{\\text{IDF}}", meaning: "Term frequency × inverse document frequency — high when word is frequent in doc but rare globally" },
      { name: "Cosine Similarity", latex: "\\text{sim}(u,v) = \\frac{u \\cdot v}{\\|u\\|\\,\\|v\\|}", meaning: "Document similarity measure independent of document length" },
      { name: "Perplexity", latex: "PP(W) = P(w_1 w_2 \\ldots w_N)^{-1/N}", meaning: "Language model quality — lower perplexity = better next-word prediction" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "The NLP Revolution",
        text: "In 2017, GPT-3 didn't exist. In 2023, LLMs write code, pass medical exams, and summarize legal documents. The foundation of all NLP — from bag-of-words spam filters to transformer-based LLMs — is the same: represent text numerically so models can process it. Understanding the classic NLP pipeline (tokenize → vectorize → model → evaluate) gives you the mental model to understand why modern transformers work and where they differ.",
        callout: "The GPT-4 technical report shows that the model trained on 100× more text than GPT-3 still benefits from classic NLP preprocessing (tokenization, deduplication, data quality filtering). Fundamentals matter at scale.",
      },
      {
        type: "intuition",
        heading: "The NLP Pipeline: 5 Stages",
        text: "Raw text is just Unicode bytes — meaningless to a model. The NLP pipeline converts it to numbers: Tokenization (split text into tokens — words, subwords, or characters), Vocabulary building (assign an integer ID to each unique token), Vectorization (convert token IDs to dense numeric representations — one-hot, TF-IDF, or word embeddings), Model training (classify, cluster, generate, or retrieve), Evaluation (accuracy, F1, BLEU, perplexity depending on task).",
      },
      {
        type: "math",
        heading: "TF-IDF: The Classic Vectorizer",
        text: "Term Frequency (TF): how often does word t appear in document d? Document Frequency (DF): how many documents contain t? Inverse Document Frequency (IDF): log(N/DFt) — words that appear in every document (the, is, of) get near-zero IDF, making them irrelevant. Words that are specific to a few documents get high IDF. TF-IDF = TF × IDF. The result is a sparse matrix of shape (n_docs × vocab_size) where each entry reflects how characteristic that word is for that document.",
        formula: "\\text{tfidf}(t,d) = \\frac{f_{t,d}}{|d|} \\cdot \\log\\frac{N}{df_t + 1}",
        formulaLabel: "Smooth IDF (+1 prevents division by zero)",
      },
      {
        type: "deepdive",
        heading: "From Bag-of-Words to Word Embeddings",
        text: "TF-IDF treats each word as independent — 'bank' and 'financial institution' are completely unrelated. Word embeddings (Word2Vec, GloVe, FastText) learn dense vector representations where similar words are nearby in vector space: king - man + woman ≈ queen. These 300-dimensional vectors capture semantic relationships that TF-IDF cannot. Modern sentence transformers (SBERT, all-MiniLM-L6-v2) produce fixed-length vectors for entire sentences, enabling semantic search, clustering, and zero-shot classification.",
        callout: "For production text classification in 2025: start with TF-IDF + LogisticRegression as baseline, then try sentence-transformers embeddings + classifier, then fine-tune a pre-trained BERT/DistilBERT if quality is still insufficient.",
      },
      {
        type: "algorithm",
        heading: "Text Classification Pipeline",
        steps: [
          "Lowercasing, punctuation removal, optional stopword removal",
          "Tokenization: word_tokenize or subword (BPE/WordPiece for transformers)",
          "Vectorization: CountVectorizer → TfidfVectorizer → word2vec → BERT embeddings",
          "Model: MultinomialNB (fast baseline), LogisticRegression (strong linear), SVM, fine-tuned BERT",
          "Evaluation: macro-F1 for balanced classes, weighted-F1 for imbalanced, AUC-ROC",
          "Error analysis: inspect misclassified samples → improve features or labeling",
        ],
      },
      {
        type: "code",
        heading: "Complete NLP Classification Pipeline",
        code: `from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import ComplementNB
from sklearn.svm import LinearSVC
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import classification_report
import numpy as np

# ── Sample text data ───────────────────────────────────────────────────
corpus = [
    "machine learning algorithms data science python",
    "neural network deep learning pytorch tensorflow",
    "natural language processing text classification bert",
    "computer vision image recognition convolutional",
    "reinforcement learning reward policy agent",
    "data preprocessing feature engineering pipeline",
] * 40   # 240 samples, 6 classes
labels = list(range(6)) * 40
X_text = corpus
y = np.array(labels)
X_train, X_test, y_train, y_test = train_test_split(
    X_text, y, test_size=0.2, stratify=y, random_state=42)
# indices for sentence-transformer section
train_idx = np.arange(len(X_train))
test_idx  = np.arange(len(X_test))

# ── Baseline: TF-IDF + Logistic Regression ────────────────────────
pipe_lr = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1,2),
        max_features=100_000,
        sublinear_tf=True,          # log(1+tf) dampens high frequencies
        strip_accents='unicode',
        analyzer='word',
        token_pattern=r'\\w{2,}',  # ignore single-char tokens
        min_df=2,                   # ignore very rare words
    )),
    ('clf', LogisticRegression(C=1.0, max_iter=1000, class_weight='balanced')),
])

# ── Alternative: TF-IDF + LinearSVC (fast, great for text) ────────
pipe_svm = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=100_000, sublinear_tf=True)),
    ('clf', LinearSVC(C=0.5, class_weight='balanced', max_iter=2000)),
])

# ── Evaluate both with cross-validation ───────────────────────────
for name, pipe in [('LR', pipe_lr), ('SVM', pipe_svm)]:
    scores = cross_val_score(pipe, X_text, y, cv=5, scoring='f1_macro', n_jobs=-1)
    print(f"{name}: macro-F1 = {scores.mean():.3f} ± {scores.std():.3f}")

# ── Modern approach: sentence embeddings ──────────────────────────
# pip install sentence-transformers
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression

encoder = SentenceTransformer('all-MiniLM-L6-v2')
X_emb = encoder.encode(X_text, batch_size=256, show_progress_bar=True)
clf = LogisticRegression(max_iter=1000).fit(X_emb[train_idx], y[train_idx])
print(f"Sentence-BERT accuracy: {clf.score(X_emb[test_idx], y[test_idx]):.3f}")`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "NLP Pipeline Pitfalls",
        text: "Fitting TfidfVectorizer on the full dataset (before splitting) leaks test vocabulary into training — the IDF values are computed with test document frequencies. Always fit inside a Pipeline applied to training data only. Second: using max_features without min_df — very rare words (appearing in 1-2 documents) are noisy but included. Set min_df=2 or min_df=0.001. Third: ignoring class imbalance — a 95% majority class makes accuracy useless; use macro-F1 and class_weight='balanced'. Fourth: not stemming/lemmatizing for small datasets — 'run', 'running', 'ran' should map to the same feature.",
        callout: "For non-English text, use language-specific tokenizers and pre-trained multilingual models (mBERT, XLM-RoBERTa) rather than English-centric pipelines. Many NLP libraries default to English-only behavior silently.",
      },
    ],
  },

};
