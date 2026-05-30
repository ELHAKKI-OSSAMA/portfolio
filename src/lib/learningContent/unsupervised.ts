import type { TopicContent } from './types';

export const unsupervisedContent: Record<string, TopicContent> = {

  "clustering": {
    id: "clustering",
    tagline: "Finding hidden groups in unlabeled data — no teacher required",
    taglineFr: "Trouver des groupes cachés dans des données non étiquetées — aucun enseignant requis",
    taglineAr: "إيجاد مجموعات خفية في البيانات غير الموسومة — لا معلم مطلوب",
    accentColor: "#6c63ff",
    visualization: "clustering",
    keyFormulas: [
      { name: "K-Means Objective", latex: "J = \\sum_{k=1}^{K}\\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|^2", meaning: "Minimize total within-cluster sum of squared distances to centroids" },
      { name: "DBSCAN Core Point", latex: "|N_\\varepsilon(x)| \\geq \\text{MinPts}", meaning: "A point is core if it has ≥ MinPts neighbours within radius ε" },
      { name: "Silhouette Score", latex: "s = \\frac{b - a}{\\max(a,b)}", meaning: "a = intra-cluster dist, b = nearest-cluster dist — ranges [-1, 1]" },
      { name: "Inertia", latex: "\\text{Inertia} = \\sum_{i=1}^{n} \\min_{\\mu_j \\in C} \\|x_i - \\mu_j\\|^2", meaning: "Sum of squared distances from each point to its nearest centroid" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Cluster Unlabeled Data?",
        text: "Most real-world data arrives without labels — customer transactions, genomic sequences, news articles, sensor readings. Clustering lets you discover natural structure that no human has annotated. Spotify segments listeners to build Discover Weekly. Insurance companies cluster claims to detect fraud rings. Biologists cluster gene expression profiles to find disease subtypes. The goal is always the same: find groups where members are more similar to each other than to members of other groups.",
        callout: "K-Means was published in 1967 and is still one of the most-used algorithms in production ML systems. Its simplicity is its strength.",
      },
      {
        type: "intuition",
        heading: "K-Means: The Iterative Negotiation",
        text: "Imagine dropping K flags randomly on a map. Every person on the map walks to their nearest flag. Each flag then moves to the average position of everyone who walked to it. Repeat until nobody changes their flag. This Lloyd's algorithm converges to a local minimum — it's not guaranteed to find the global optimum, which is why K-Means++ initialization (spreading initial centroids far apart) dramatically improves results in practice.",
        callout: "K-Means always converges but may converge to a poor local minimum. Always run with multiple random initializations (n_init=10 in scikit-learn) and keep the best.",
      },
      {
        type: "math",
        heading: "The K-Means Objective",
        text: "K-Means minimizes the sum of squared Euclidean distances from each point to its assigned centroid. The E-step assigns each point to its nearest centroid; the M-step moves each centroid to the mean of its assigned points. Each step monotonically decreases the objective, guaranteeing convergence.",
        formula: "J = \\sum_{k=1}^{K}\\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|^2",
        formulaLabel: "Within-cluster Sum of Squares (WCSS)",
      },
      {
        type: "deepdive",
        heading: "Choosing K: The Elbow Method & Silhouette",
        text: "K is a hyperparameter — you must choose it. The Elbow Method plots inertia vs K: inertia always decreases, but the rate of decrease elbows at the 'right' K. More rigorously, the Silhouette Score measures how well each point fits its own cluster vs the next nearest cluster. s=1 means perfect separation, s=0 means overlapping clusters, s<0 means the point is in the wrong cluster. Average silhouette over all points gives a scalar quality metric.",
        steps: [
          "Try K = 2 to 10, plot inertia — look for the 'elbow'",
          "Compute silhouette score for each K — peak = best K",
          "Use Gap Statistic (compare to random data) for rigorously selecting K",
          "Domain knowledge often overrides: if you know there are 5 customer segments, use K=5",
        ],
      },
      {
        type: "comparison",
        heading: "K-Means vs DBSCAN vs Hierarchical",
        text: "K-Means assumes spherical, equal-size clusters and requires K upfront. It fails badly on crescent-shaped or varying-density data. DBSCAN (Density-Based Spatial Clustering of Applications with Noise) finds arbitrarily-shaped clusters and automatically identifies outliers — points that are not in any cluster. It requires only ε (neighborhood radius) and MinPts (minimum points to form a core). Hierarchical clustering builds a dendrogram — a tree of merges — that you cut at any level to get K clusters, giving you the full cluster structure in one pass.",
        callout: "Use DBSCAN when you expect noise/outliers or non-spherical clusters. Use K-Means when clusters are roughly spherical and you know K. Use Hierarchical when you want to explore multiple granularities simultaneously.",
      },
      {
        type: "algorithm",
        heading: "DBSCAN Step-by-Step",
        steps: [
          "For each unvisited point p, find all points within radius ε (ε-neighborhood)",
          "If |N_ε(p)| ≥ MinPts → p is a core point; start a new cluster",
          "Expand cluster: add all density-reachable points (core point neighbors of core points)",
          "If |N_ε(p)| < MinPts and p is reachable from a core → p is a border point",
          "If p is not reachable from any core → p is noise (outlier, labeled -1)",
          "Repeat until all points visited — O(n log n) with spatial index",
        ],
      },
      {
        type: "code",
        heading: "scikit-learn Implementation",
        code: `from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs
import numpy as np

# ── Sample data ────────────────────────────────────────────────────────
X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=42)

# ── K-Means with K selection via silhouette ────────────────────────
X_scaled = StandardScaler().fit_transform(X)

best_k, best_score = 2, -1
for k in range(2, 11):
    km = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=42)
    labels = km.fit_predict(X_scaled)
    score = silhouette_score(X_scaled, labels)
    if score > best_score:
        best_k, best_score = k, score

km_final = KMeans(n_clusters=best_k, init='k-means++', n_init=10, random_state=42)
labels_km = km_final.fit_predict(X_scaled)
print(f"K={best_k}, silhouette={best_score:.3f}, inertia={km_final.inertia_:.1f}")

# ── DBSCAN — auto-detects clusters and outliers ────────────────────
db = DBSCAN(eps=0.5, min_samples=5)
labels_db = db.fit_predict(X_scaled)
n_clusters = len(set(labels_db)) - (1 if -1 in labels_db else 0)
n_noise    = list(labels_db).count(-1)
print(f"DBSCAN: {n_clusters} clusters, {n_noise} noise points")

# ── Agglomerative — no K needed upfront (use dendrogram) ──────────
from scipy.cluster.hierarchy import dendrogram, linkage
Z = linkage(X_scaled, method='ward')
# Cut at K=3
agg = AgglomerativeClustering(n_clusters=3, linkage='ward')
labels_agg = agg.fit_predict(X_scaled)`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "Common Clustering Pitfalls",
        text: "Clustering without scaling is the #1 mistake: features with large scales dominate the distance metric, making K-Means find clusters based on the highest-magnitude feature regardless of others. Always scale before clustering. Second pitfall: treating cluster labels as ground truth — clusters are hypotheses, not facts. Validate with domain experts and external metrics (if labels exist, use Adjusted Rand Index). Third: assuming clusters are meaningful — always sanity-check by looking at cluster profiles.",
        callout: "Cluster labels are arbitrary integers that change between runs. Never hardcode 'cluster 0 = high-value customers' — always characterize clusters by their feature distributions.",
      },
    ],
  },

  "pca": {
    id: "pca",
    tagline: "Finding the directions of maximum variance — compressing information without losing it",
    taglineFr: "Trouver les directions de variance maximale — compresser l'information sans la perdre",
    taglineAr: "إيجاد اتجاهات التباين الأقصى — ضغط المعلومات دون فقدانها",
    accentColor: "#8b5cf6",
    visualization: "pca",
    keyFormulas: [
      { name: "Covariance Eigen-decomp", latex: "\\Sigma = V \\Lambda V^\\top", meaning: "Covariance matrix decomposes into eigenvectors V and eigenvalues Λ" },
      { name: "Projection", latex: "z = V_k^\\top (x - \\bar{x})", meaning: "Project centered data onto top-k eigenvectors to get k-dim representation" },
      { name: "Variance Explained", latex: "\\text{VE}_k = \\frac{\\lambda_k}{\\sum_j \\lambda_j}", meaning: "Fraction of total variance captured by principal component k" },
      { name: "Reconstruction", latex: "\\hat{x} = \\bar{x} + V_k z", meaning: "Reconstruct approximate x from low-dim code z — measures information loss" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "The Curse of Dimensionality",
        text: "With 1000 features, every pair of points is almost equidistant (the 'concentration of measure' phenomenon). Distance-based algorithms break down. Visualizing high-dimensional data is impossible. Training takes forever and models overfit. PCA solves this by finding a low-dimensional subspace that captures most of the variance — removing noise, decorrelating features, and enabling visualization. A 10,000-pixel image can often be compressed to 50 PCA components with less than 5% reconstruction error.",
        callout: "The famous 'face space' result: human face images live in a ~50-dimensional subspace within a 50,000-pixel space. PCA finds this subspace.",
      },
      {
        type: "intuition",
        heading: "The Geometrical View",
        text: "Imagine a cloud of points that looks like a stretched ellipse. PCA finds the longest axis of the ellipse (PC1 — maximum variance direction), then the next longest perpendicular axis (PC2), and so on. By projecting onto the first few principal components, you keep the most 'spread out' dimensions and discard the tightly bunched ones (which are typically noise). The principal components are the eigenvectors of the data covariance matrix, ordered by their eigenvalues (= variance along each direction).",
      },
      {
        type: "math",
        heading: "Eigendecomposition of the Covariance Matrix",
        text: "Center the data: X̃ = X - μ. Compute the p×p covariance matrix Σ = (1/n)X̃ᵀX̃. Eigendecompose: Σ = VΛVᵀ where V is orthonormal (Vᵀ=V⁻¹) and Λ is diagonal with eigenvalues λ₁≥λ₂≥…≥λₚ. The first eigenvector v₁ is the direction of maximum variance. In practice scikit-learn uses SVD on X̃ directly (more numerically stable than computing Σ explicitly).",
        formula: "\\Sigma \\mathbf{v}_k = \\lambda_k \\mathbf{v}_k",
        formulaLabel: "Eigenvector equation — vₖ is a principal component",
      },
      {
        type: "deepdive",
        heading: "Choosing the Number of Components",
        text: "Plot the cumulative explained variance ratio. The curve rises steeply at first, then flattens. Choose k where you reach 90–95% cumulative variance — this is the 'elbow'. Alternatively, use PCA as preprocessing for a downstream model: tune k as a hyperparameter with cross-validation. For visualization, always use k=2 or k=3 regardless of explained variance.",
        steps: [
          "Compute explained_variance_ratio_ for each component",
          "Plot cumulative sum — find k where cumsum ≥ 0.95",
          "For whitening (decorrelation + unit variance): set whiten=True",
          "For large datasets: use IncrementalPCA (mini-batch) or TruncatedSVD (sparse)",
          "Never apply PCA before train/test split — fit only on training data, transform both",
        ],
      },
      {
        type: "algorithm",
        heading: "PCA Algorithm",
        steps: [
          "Center data: X̃ = X - mean(X, axis=0)",
          "Compute SVD: X̃ = UΣVᵀ (equivalently: eigendecompose X̃ᵀX̃)",
          "Sort eigenvectors by eigenvalues descending",
          "Select top-k eigenvectors: V_k = V[:, :k]",
          "Project: Z = X̃ @ V_k  →  k-dimensional representation",
          "Reconstruct: X̂ = Z @ V_k.T + mean  →  measure reconstruction error",
        ],
      },
      {
        type: "code",
        heading: "scikit-learn PCA",
        code: `from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
import numpy as np
import matplotlib.pyplot as plt

# ── Sample data ────────────────────────────────────────────────────────
X_raw, y = make_classification(n_samples=400, n_features=20,
                                n_informative=8, random_state=42)
X_train, X_test, _, _ = train_test_split(X_raw, y, test_size=0.2, random_state=42)

# ── Fit PCA ────────────────────────────────────────────────────────
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

# Fit full PCA first to inspect variance
pca_full = PCA().fit(X_scaled)
cumvar = np.cumsum(pca_full.explained_variance_ratio_)
k = np.argmax(cumvar >= 0.95) + 1
print(f"{k} components explain ≥95% variance")

# Final PCA with chosen k
pca = PCA(n_components=k, random_state=42)
X_pca = pca.fit_transform(X_scaled)          # fit on train only
X_test_pca = pca.transform(scaler.transform(X_test))

# ── Reconstruction error ───────────────────────────────────────────
X_reconstructed = pca.inverse_transform(X_pca)
recon_err = np.mean((X_scaled - X_reconstructed)**2)
print(f"Reconstruction MSE: {recon_err:.4f}")

# ── 2D visualisation ───────────────────────────────────────────────
pca2 = PCA(n_components=2)
X_2d = pca2.fit_transform(X_scaled)
plt.scatter(X_2d[:,0], X_2d[:,1], c=y, cmap='viridis', alpha=0.7)
plt.xlabel(f"PC1 ({pca2.explained_variance_ratio_[0]:.1%})")
plt.ylabel(f"PC2 ({pca2.explained_variance_ratio_[1]:.1%})")`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "PCA Pitfalls",
        text: "PCA is a linear method — it cannot capture non-linear manifolds. Use t-SNE or UMAP for non-linear dimensionality reduction when visualizing complex structures. Also: PCA maximizes variance, not discrimination — for classification, Linear Discriminant Analysis (LDA) often gives better separation because it maximizes between-class vs within-class variance. Finally: principal components are often uninterpretable. If you need interpretable features, prefer Sparse PCA or feature selection instead.",
        callout: "Never fit PCA on the full dataset — fit on training data only and apply the same transformation to test data. Fitting on the full dataset leaks test statistics into training.",
      },
    ],
  },

  "anomaly": {
    id: "anomaly",
    tagline: "Finding the one-in-a-thousand data point that doesn't belong",
    taglineFr: "Trouver le point de données sur mille qui n'a pas sa place",
    taglineAr: "إيجاد نقطة البيانات الواحدة في الألف التي لا تنتمي",
    accentColor: "#ef4444",
    visualization: "anomaly",
    keyFormulas: [
      { name: "Z-Score", latex: "z_i = \\frac{x_i - \\mu}{\\sigma}", meaning: "Standard deviations from the mean — |z| > 3 is conventionally anomalous" },
      { name: "IQR Fence", latex: "[Q_1 - 1.5 \\cdot IQR,\\; Q_3 + 1.5 \\cdot IQR]", meaning: "Tukey fences — points outside this interval are outliers (IQR = Q3-Q1)" },
      { name: "Isolation Score", latex: "s(x,n) = 2^{-\\frac{E[h(x)]}{c(n)}}", meaning: "Isolation Forest: anomalies have shorter average path lengths h(x)" },
      { name: "LOF Score", latex: "\\text{LOF}_k(x) = \\frac{\\overline{\\text{lrd}_k(N_k(x))}}{\\text{lrd}_k(x)}", meaning: "Local Outlier Factor: ratio of local density to neighbours' density" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Anomaly Detection Matters",
        text: "Credit card fraud costs $32 billion annually. Network intrusion attacks cause trillions in damage. Industrial equipment failures cost $50 billion per year. Anomaly detection is the critical first line of defense in all these systems. The core challenge: you rarely have labeled examples of anomalies (they're rare by definition), so most anomaly detection is unsupervised — you only learn what 'normal' looks like, then flag deviations.",
        callout: "In medical diagnosis, a false negative (missing cancer) is catastrophic; in fraud detection, false positives (blocking real customers) destroy revenue. Choosing the right threshold is a business decision.",
      },
      {
        type: "intuition",
        heading: "The Statistical Viewpoint",
        text: "The simplest intuition: normal data concentrates in high-density regions. Anomalies live in low-density regions. Z-Score flags points more than k standard deviations from the mean — but assumes Gaussian distributions. IQR fences are non-parametric: they flag points outside 1.5×IQR from the quartiles, making them robust to non-Gaussian data. Both are univariate — they check each feature independently and miss multivariate anomalies (a temperature of 20°C is normal; a pressure of 5 bar is normal; but temperature=20 AND pressure=5 together may be anomalous).",
      },
      {
        type: "comparison",
        heading: "Statistical vs Algorithmic Methods",
        text: "Z-Score and IQR are fast and interpretable but assume features are independent and Gaussian. Isolation Forest builds random trees and measures how quickly each point can be isolated — anomalies isolate fast because they're in sparse regions. Local Outlier Factor (LOF) compares each point's local density to its neighbors' density: if your neighbors are much denser than you, you're an outlier. One-Class SVM finds the minimal hypersphere enclosing normal points. Autoencoder anomaly detection trains a neural network to reconstruct normal data — high reconstruction error signals anomaly.",
        callout: "Isolation Forest scales to millions of points and handles high-dimensional data well. LOF is better for clustered data with varying densities. Autoencoders excel at anomaly detection in images and time series.",
      },
      {
        type: "algorithm",
        heading: "Isolation Forest Algorithm",
        steps: [
          "Build an ensemble of isolation trees (random binary trees)",
          "For each tree: randomly select a feature, then a random split value",
          "Recurse until each point is isolated (alone in a leaf)",
          "Anomaly score = average path length across all trees",
          "Short path → point isolated quickly → anomaly",
          "Normal points need more splits → longer average path",
        ],
      },
      {
        type: "code",
        heading: "scikit-learn Anomaly Detection",
        code: `from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification
import numpy as np

# ── Sample data (5% anomalies) ─────────────────────────────────────────
X_normal, _ = make_classification(n_samples=475, n_features=10, random_state=42)
X_anom  = np.random.randn(25, 10) * 4    # 25 clear outliers
X = np.vstack([X_normal, X_anom])
y_true = np.array([0]*475 + [1]*25)       # 0=normal, 1=anomaly

X_scaled = StandardScaler().fit_transform(X)

# ── Isolation Forest ───────────────────────────────────────────────
iso = IsolationForest(
    n_estimators=200,
    contamination=0.05,   # expected fraction of outliers
    random_state=42
)
labels_iso = iso.fit_predict(X_scaled)  # 1=inlier, -1=outlier
scores_iso = iso.score_samples(X_scaled)  # lower = more anomalous

# ── Local Outlier Factor ────────────────────────────────────────────
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)
labels_lof = lof.fit_predict(X_scaled)

# ── Z-Score (univariate, per-feature) ──────────────────────────────
from scipy import stats
z_scores = np.abs(stats.zscore(X))
outlier_mask = (z_scores > 3).any(axis=1)

# ── Evaluate with known labels ─────────────────────────────────────
from sklearn.metrics import roc_auc_score, average_precision_score
# Convert: 1=inlier → 0=normal,  -1=outlier → 1=anomaly
y_pred = (labels_iso == -1).astype(int)
print(f"AUC-ROC: {roc_auc_score(y_true, -scores_iso):.3f}")
print(f"AP:      {average_precision_score(y_true, -scores_iso):.3f}")`,
        language: "python",
      },
      {
        type: "pitfall",
        heading: "Anomaly Detection Pitfalls",
        text: "The contamination parameter in Isolation Forest and LOF directly controls the decision threshold. If you set contamination=0.05 but your actual anomaly rate is 0.1%, you'll mislabel many normal points as anomalies. Always calibrate this with domain knowledge or holdout labeled data. Second pitfall: high dimensionality breaks Z-Score and distance-based methods (curse of dimensionality). Apply PCA first when features > 20. Third: concept drift — 'normal' changes over time. Retrain or use online anomaly detection for streaming data.",
        callout: "Never evaluate anomaly detection with accuracy — class imbalance makes it meaningless. Use Precision@k, AUC-PR (area under precision-recall curve), or F1 at the chosen threshold.",
      },
    ],
  },

};
