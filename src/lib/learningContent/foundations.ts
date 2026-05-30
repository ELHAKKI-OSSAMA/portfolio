import type { TopicContent } from './types';

export const foundationsContent: Record<string, TopicContent> = {

  "python-ml-stack": {
    id: "python-ml-stack",
    tagline: "Your data science toolkit — NumPy, Pandas, Matplotlib and the Jupyter workflow",
    taglineFr: "Votre boîte à outils data science — NumPy, Pandas, Matplotlib et le flux de travail Jupyter",
    taglineAr: "مجموعة أدوات علوم البيانات — NumPy وPandas وMatplotlib وسير عمل Jupyter",
    accentColor: "#06b6d4",
    visualization: "numpy",
    keyFormulas: [
      { name: "Vectorized Mean", latex: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i", meaning: "np.mean(X) — NumPy computes this in C, orders of magnitude faster than a Python loop" },
      { name: "Broadcasting", latex: "(m \\times n) + (1 \\times n) \\rightarrow (m \\times n)", meaning: "NumPy stretches the smaller array along the missing dimension — avoids explicit loops" },
      { name: "Pearson Correlation", latex: "r = \\frac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum(x_i-\\bar{x})^2\\sum(y_i-\\bar{y})^2}}", meaning: "np.corrcoef(X,Y) — measures linear dependence between two features" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why This Stack Before Anything Else",
        text: "Every ML framework — scikit-learn, PyTorch, TensorFlow, JAX — sits on top of NumPy arrays. Understanding how arrays work in memory (contiguous C-order layout, dtype, strides) is the difference between writing O(n²) Python loops and vectorized O(n) NumPy operations that run at C speed. Pandas gives you labeled DataFrames for real-world messy data, and Matplotlib/Seaborn let you see what's happening before you model it. The entire ML ecosystem speaks NumPy — mastering it is mastering the lingua franca.",
        callout: "A Python for-loop over 10M numbers takes ~4 seconds. np.sum() takes ~8ms — 500× faster. This matters when you're computing gradients over a neural network.",
      },
      {
        type: "algorithm",
        heading: "NumPy Essentials — What You Actually Need",
        steps: [
          "Array creation: np.array(), np.zeros(), np.ones(), np.linspace(), np.arange(), np.random.randn()",
          "Shape manipulation: .reshape(), .T (transpose), np.concatenate(), np.stack(), np.squeeze()",
          "Vectorized math: +, -, *, / broadcast element-wise; np.dot() / @ for matrix multiplication",
          "Indexing: arr[2:5], arr[arr > 0] (boolean mask), arr[:, 0] (column slice)",
          "Aggregations: .sum(), .mean(), .std(), .max(), .argmax() — all accept axis= parameter",
          "Broadcasting rule: align shapes from the right, dimensions must match or be 1",
        ],
      },
      {
        type: "code",
        heading: "NumPy, Pandas & Matplotlib — Full Workflow",
        language: "python",
        code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# ── NumPy: arrays, broadcasting, vectorized ops ───────────────────────────────
X = np.random.randn(1000, 5)          # 1000 samples, 5 features
y = 2*X[:,0] - X[:,1] + 0.5*np.random.randn(1000)

print(X.shape, X.dtype)               # (1000, 5) float64
print(X.mean(axis=0).round(3))        # per-feature means ≈ 0
print(X.std(axis=0).round(3))         # per-feature stds ≈ 1

# Broadcasting: subtract mean and divide by std (manual StandardScaler)
X_scaled = (X - X.mean(axis=0)) / X.std(axis=0)

# Matrix multiply: X @ W where W is 5×2
W = np.random.randn(5, 2)
Z = X_scaled @ W                       # shape (1000, 2)

# Boolean indexing
high_income = X[X[:,0] > 1.0]         # rows where feature 0 > 1σ
print(f"High income rows: {len(high_income)}")

# ── Pandas: DataFrames, EDA ───────────────────────────────────────────────────
df = pd.DataFrame(X, columns=[f"feat_{i}" for i in range(5)])
df["target"] = y

# Quick EDA
print(df.describe().round(2))          # count, mean, std, quartiles
print(df.isnull().sum())               # check for missing values
print(df.dtypes)

# Groupby example
df["group"] = np.where(df["feat_0"] > 0, "high", "low")
print(df.groupby("group")["target"].agg(["mean","std"]).round(3))

# Correlations
corr = df.drop(columns="group").corr()
print(corr["target"].sort_values(ascending=False).round(3))

# ── Matplotlib / Seaborn: visualization ──────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 1. Distribution plot
axes[0].hist(df["target"], bins=50, color="#6c63ff", alpha=0.8, edgecolor="white")
axes[0].set_title("Target distribution")
axes[0].set_xlabel("y")

# 2. Scatter + regression line
axes[1].scatter(df["feat_0"], df["target"], alpha=0.3, s=10, color="#06b6d4")
m, b = np.polyfit(df["feat_0"], df["target"], 1)
x_line = np.linspace(-3, 3, 100)
axes[1].plot(x_line, m*x_line + b, color="#ff6b6b", lw=2, label=f"slope={m:.2f}")
axes[1].set_title("Feature 0 vs Target")
axes[1].legend()

# 3. Correlation heatmap
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm",
            center=0, ax=axes[2], cbar=False)
axes[2].set_title("Correlation matrix")

plt.tight_layout()
plt.show()

# ── Jupyter tips ──────────────────────────────────────────────────────────────
# %timeit np.dot(X, W)       # benchmark any cell
# %matplotlib inline          # show plots in notebook
# df.head()                   # preview first 5 rows
# df.info()                   # dtypes + non-null counts
# pd.set_option('display.max_columns', None)  # show all columns`,
      },
      {
        type: "pitfall",
        heading: "The Most Common NumPy Bugs",
        text: "1) Shape mismatch: (100,) ≠ (100,1). Always check .shape before matrix ops. Use .reshape(-1,1) to add a dimension. 2) Integer division: np.array([3])/2 gives 1.5 in Python 3 but watch out with dtype=int arrays. 3) Copying vs views: arr[0:5] returns a VIEW — modifying it modifies the original. Use .copy() to be safe. 4) In-place vs out-of-place: X *= 2 modifies X in-place; Y = X * 2 creates a new array. 5) NaN propagation: np.mean([1,2,np.nan]) = NaN. Use np.nanmean() for NaN-safe aggregations.",
        callout: "np.shares_memory(a, b) tells you if two arrays share underlying data — crucial to know when you're 'copying' slices.",
      },
    ],
  },

  "linear-algebra": {
    id: "linear-algebra",
    tagline: "The geometry behind every model — dot products, matrix transforms, and eigendecomposition",
    taglineFr: "La géométrie derrière chaque modèle — produits scalaires, transformations matricielles et décomposition propre",
    taglineAr: "الهندسة وراء كل نموذج — الضرب النقطي وتحويلات المصفوفات والتحليل الطيفي",
    accentColor: "#06b6d4",
    visualization: "linear-algebra",
    keyFormulas: [
      { name: "Dot Product", latex: "\\mathbf{a} \\cdot \\mathbf{b} = \\sum_i a_i b_i = \\|\\mathbf{a}\\|\\|\\mathbf{b}\\|\\cos\\theta", meaning: "Measures how aligned two vectors are — zero means orthogonal, maximum when parallel" },
      { name: "Matrix Multiply", latex: "(AB)_{ij} = \\sum_k A_{ik}B_{kj}", meaning: "Composition of two linear transformations — apply B first, then A" },
      { name: "Eigendecomposition", latex: "A\\mathbf{v} = \\lambda\\mathbf{v} \\Rightarrow A = Q\\Lambda Q^{-1}", meaning: "Eigenvectors v stay on their span under transformation A; λ is the scaling factor" },
      { name: "SVD", latex: "A = U\\Sigma V^T", meaning: "Any matrix decomposes into rotation × scale × rotation — used in PCA, LSA, recommender systems" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Linear Algebra IS Machine Learning",
        text: "A neural network layer is y = Wx + b — a matrix multiplication. Gradient descent requires computing the gradient, which is a Jacobian matrix. PCA finds the principal eigenvectors of the covariance matrix. SVMs maximize a dot-product-based margin. Attention in Transformers is Q·Kᵀ·V — three matrix multiplications. Every forward pass, every backpropagation, every optimization step is linear algebra. Understanding the geometric intuition — what matrices DO to vectors in space — is what separates engineers who debug by understanding from engineers who debug by trial and error.",
        callout: "The dot product a·b = ‖a‖‖b‖cos(θ) is the foundation of cosine similarity (used in NLP), the kernel trick (SVMs), and attention mechanisms (Transformers).",
      },
      {
        type: "intuition",
        heading: "Matrices as Space Transformers",
        text: "Every m×n matrix A represents a linear transformation from ℝⁿ to ℝᵐ. Multiplying a vector v by A stretches, rotates, reflects, or projects it. The key insight: a matrix completely describes what happens to EVERY vector in the space — you only need to know what it does to the basis vectors (the columns of A, when A acts on the standard basis). The determinant tells you the volume scaling factor: |det(A)| = 2 means every region doubles in area. det = 0 means the matrix collapses space onto a lower dimension (rank-deficient, non-invertible).",
        callout: "Visualize any 2×2 matrix by watching where the unit square [0,1]×[0,1] gets sent. The four corners go to (0,0), the first column, the second column, and their sum.",
      },
      {
        type: "algorithm",
        heading: "Eigendecomposition Step by Step",
        steps: [
          "Find eigenvalues: solve det(A - λI) = 0 (characteristic polynomial). For 2×2: λ = (tr(A) ± √(tr²-4det)) / 2.",
          "For each eigenvalue λᵢ: solve (A - λᵢI)v = 0 to find the eigenvector vᵢ. Normalize: ‖vᵢ‖ = 1.",
          "Stack eigenvectors as columns of Q: A = QΛQ⁻¹ where Λ = diag(λ₁, λ₂, …)",
          "For symmetric matrices (covariance matrices): Q is orthogonal (Q⁻¹ = Qᵀ), eigenvalues are real.",
          "Aⁿ = QΛⁿQ⁻¹ — large eigenvalues dominate repeated application (e.g., power iteration).",
          "PCA: compute covariance C = XᵀX/n, eigendecompose, take top-k eigenvectors as projection matrix.",
        ],
      },
      {
        type: "code",
        heading: "Linear Algebra with NumPy",
        language: "python",
        code: `import numpy as np

# ── Vectors and dot products ──────────────────────────────────────────────────
a = np.array([3., 4.])
b = np.array([1., 0.])

print(f"a·b = {np.dot(a, b):.2f}")             # 3.0
print(f"‖a‖ = {np.linalg.norm(a):.2f}")        # 5.0
print(f"cos(θ) = {np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b)):.3f}")  # 0.6

# Cosine similarity (NLP/recommendation)
def cosine_sim(u, v):
    return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))

# ── Matrix operations ─────────────────────────────────────────────────────────
A = np.array([[2., 1.],
              [0., 3.]])

B = np.array([[1., 0.],
              [2., 1.]])

print("A @ B =")
print(A @ B)                     # matrix multiply (composition)
print(f"det(A) = {np.linalg.det(A):.2f}")   # 6.0 — volume scaling
print(f"rank(A) = {np.linalg.matrix_rank(A)}")   # 2 — full rank

A_inv = np.linalg.inv(A)
print("A @ A_inv ≈ I:", np.allclose(A @ A_inv, np.eye(2)))

# ── Eigendecomposition ────────────────────────────────────────────────────────
eigenvalues, eigenvectors = np.linalg.eig(A)
print(f"Eigenvalues: {eigenvalues}")          # [2. 3.]
print(f"Eigenvectors (columns):\\n{eigenvectors.round(3)}")

# Verify: A @ v = λ * v
for i in range(len(eigenvalues)):
    v = eigenvectors[:, i]
    lam = eigenvalues[i]
    print(f"λ{i+1}={lam:.2f}, A@v = {A@v.round(3)}, λ*v = {(lam*v).round(3)}")

# Reconstruct A from eigendecomposition
Q = eigenvectors
Lambda = np.diag(eigenvalues)
A_reconstructed = Q @ Lambda @ np.linalg.inv(Q)
print("Reconstruction error:", np.linalg.norm(A - A_reconstructed))

# ── SVD ───────────────────────────────────────────────────────────────────────
M = np.random.randn(4, 3)               # 4×3 rectangular matrix
U, S, Vt = np.linalg.svd(M, full_matrices=False)
print(f"U: {U.shape}, S: {S.shape}, Vt: {Vt.shape}")

# Low-rank approximation (keep top-k singular values)
k = 2
M_approx = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
print(f"Rank-{k} approx error: {np.linalg.norm(M - M_approx):.4f}")

# ── PCA from scratch ─────────────────────────────────────────────────────────
X = np.random.randn(200, 5)
X -= X.mean(axis=0)                     # center
C = (X.T @ X) / (len(X) - 1)           # covariance matrix
eigenvalues, eigenvectors = np.linalg.eigh(C)   # eigh for symmetric matrices
idx = np.argsort(eigenvalues)[::-1]     # sort descending
PC = eigenvectors[:, idx[:2]]           # top-2 principal components
X_proj = X @ PC                         # project to 2D
print(f"Explained variance: {eigenvalues[idx[:2]] / eigenvalues.sum() * 100}")`,
      },
      {
        type: "pitfall",
        heading: "Numerical Stability and Ill-Conditioning",
        text: "The condition number of a matrix κ(A) = σ_max/σ_min (ratio of largest to smallest singular value) measures how sensitive solutions are to perturbations. High condition number → ill-conditioned → numerical errors amplify. Gradient descent converges slowly on ill-conditioned loss landscapes (elongated bowl) — this is why feature scaling matters and why Adam adapts learning rates per-parameter. Never invert a matrix directly with np.linalg.inv(A) if you're solving Ax=b — use np.linalg.solve(A,b) which is faster and more stable (uses LU factorization).",
        callout: "np.linalg.cond(A) tells you the condition number. κ > 10⁶ means you're in trouble — solutions to linear systems will have ~6 fewer significant digits than you expect.",
      },
    ],
  },

  "calculus-optimization": {
    id: "calculus-optimization",
    tagline: "From derivatives to gradient descent — the engine that trains every neural network",
    taglineFr: "Des dérivées à la descente de gradient — le moteur qui entraîne chaque réseau de neurones",
    taglineAr: "من المشتقات إلى الانحدار التدريجي — المحرك الذي يدرّب كل شبكة عصبية",
    accentColor: "#06b6d4",
    visualization: "gradient-descent",
    keyFormulas: [
      { name: "Gradient", latex: "\\nabla f(\\mathbf{x}) = \\left[\\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\ldots, \\frac{\\partial f}{\\partial x_n}\\right]^T", meaning: "Vector of partial derivatives — points in the direction of steepest ascent" },
      { name: "Chain Rule", latex: "\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)", meaning: "The backbone of backpropagation — compose derivatives through layers" },
      { name: "Gradient Descent", latex: "\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta L(\\theta_t)", meaning: "Iteratively move opposite to the gradient to minimize loss L" },
      { name: "Adam Update", latex: "\\theta_t = \\theta_{t-1} - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon}\\hat{m}_t", meaning: "Gradient descent with adaptive per-parameter learning rates (bias-corrected 1st & 2nd moments)" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Optimization Is What Makes Models Learn",
        text: "Training a machine learning model is an optimization problem: find the parameters θ that minimize the loss function L(θ). Gradient descent is the workhorse algorithm that solves this for problems with millions of parameters where closed-form solutions don't exist. The chain rule makes it possible to compute gradients through arbitrarily deep compositions of functions — that's backpropagation. Without calculus, there is no learning: every weight update in every neural network, every boosted tree fitted to residuals, every SVM soft-margin solution — all of it is optimization.",
        callout: "A GPT model has ~175 billion parameters. Gradient descent updates ALL of them simultaneously in a single backward pass thanks to the chain rule.",
      },
      {
        type: "intuition",
        heading: "The Gradient as a Direction in Parameter Space",
        text: "Imagine the loss function as a hilly landscape and your parameters as your position. The gradient ∇L(θ) is an arrow pointing uphill. Moving in the OPPOSITE direction (−η∇L) goes downhill — toward lower loss. The learning rate η controls step size: too large and you bounce around (diverge), too small and training takes forever. The classic problem: an elongated bowl (ill-conditioned loss surface) makes vanilla gradient descent zigzag across the valley instead of going straight to the minimum. Adam fixes this by maintaining a separate learning rate for each parameter based on its gradient history.",
        callout: "Intuition for the chain rule: if temperature change affects pressure, and pressure affects volume, how does temperature affect volume? Multiply the individual sensitivities.",
      },
      {
        type: "algorithm",
        heading: "Adam Optimizer — Step by Step",
        steps: [
          "Initialize: θ, m₀=0 (1st moment), v₀=0 (2nd moment), t=0, β₁=0.9, β₂=0.999, ε=1e-8",
          "Compute gradient: g_t = ∇_θ L(θ_{t-1})",
          "Update biased 1st moment (momentum): m_t = β₁·m_{t-1} + (1-β₁)·g_t",
          "Update biased 2nd moment (adaptive scale): v_t = β₂·v_{t-1} + (1-β₂)·g_t²",
          "Bias correction: m̂_t = m_t/(1-β₁ᵗ), v̂_t = v_t/(1-β₂ᵗ)",
          "Parameter update: θ_t = θ_{t-1} - η·m̂_t / (√v̂_t + ε)",
          "Intuition: m̂_t is a running average of gradients (momentum). √v̂_t normalizes by gradient magnitude — features with large gradients get smaller learning rates.",
        ],
      },
      {
        type: "code",
        heading: "Gradient Descent from Scratch",
        language: "python",
        code: `import numpy as np
import matplotlib.pyplot as plt

# ── Numerical derivatives (educational) ──────────────────────────────────────
def numerical_grad(f, x, h=1e-5):
    """Central difference approximation: (f(x+h) - f(x-h)) / 2h"""
    grad = np.zeros_like(x, dtype=float)
    for i in range(len(x)):
        x_plus  = x.copy(); x_plus[i]  += h
        x_minus = x.copy(); x_minus[i] -= h
        grad[i] = (f(x_plus) - f(x_minus)) / (2 * h)
    return grad

# ── 1. Gradient Descent on simple quadratic ───────────────────────────────────
def loss(theta):
    return (theta[0] - 3)**2 + (theta[1] + 1)**2  # minimum at (3,-1)

def grad_loss(theta):
    return np.array([2*(theta[0]-3), 2*(theta[1]+1)])

theta = np.array([0., 0.])
lr = 0.1
history = [theta.copy()]

for step in range(50):
    g = grad_loss(theta)
    theta -= lr * g
    history.append(theta.copy())
    if np.linalg.norm(g) < 1e-6:
        print(f"Converged at step {step}")
        break

print(f"Final θ: {theta.round(4)}")  # ≈ [3, -1]

# ── 2. Adam optimizer ────────────────────────────────────────────────────────
def adam(grad_fn, theta_init, lr=0.01, n_steps=100, b1=0.9, b2=0.999, eps=1e-8):
    theta = theta_init.copy().astype(float)
    m, v = np.zeros_like(theta), np.zeros_like(theta)
    history = [theta.copy()]
    for t in range(1, n_steps+1):
        g = grad_fn(theta)
        m = b1*m + (1-b1)*g
        v = b2*v + (1-b2)*g**2
        m_hat = m / (1 - b1**t)
        v_hat = v / (1 - b2**t)
        theta -= lr * m_hat / (np.sqrt(v_hat) + eps)
        history.append(theta.copy())
    return theta, history

theta_adam, hist_adam = adam(grad_loss, np.array([0., 0.]), lr=0.1)
print(f"Adam θ: {theta_adam.round(4)}")

# ── 3. Chain rule in action (manual backprop) ─────────────────────────────────
# f(x) = (2x + 1)^2. df/dx = 2 * (2x+1) * 2 = 4*(2x+1)
x = 3.0
# Forward pass
u = 2*x + 1    # u = 7
f = u**2       # f = 49

# Backward pass (chain rule)
df_du = 2*u    # = 14
du_dx = 2      # constant
df_dx = df_du * du_dx   # = 28
print(f"df/dx at x=3: {df_dx}")  # analytical: 4*(2*3+1) = 28 ✓

# ── 4. Learning rate sensitivity ─────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(12,3))
for ax, lr_val in zip(axes, [0.01, 0.1, 0.9]):
    theta = np.array([0.])
    losses = []
    for _ in range(100):
        g = 2*(theta[0] - 5)
        theta[0] -= lr_val * g
        losses.append((theta[0]-5)**2)
    ax.semilogy(losses)
    ax.set_title(f"lr = {lr_val}")
    ax.set_xlabel("Steps")
    ax.set_ylabel("Loss")
plt.tight_layout()
plt.show()  # lr=0.01: slow, lr=0.1: perfect, lr=0.9: oscillates`,
      },
      {
        type: "pitfall",
        heading: "Local Minima vs Saddle Points — What Actually Slows Training",
        text: "In high-dimensional loss landscapes (modern neural networks have millions of parameters), true local minima are rare — most 'stuck' points are saddle points where the gradient is zero but the point is a minimum in some directions and a maximum in others. Gradient descent with noise (SGD) escapes saddle points naturally. The bigger practical problems are: (1) Exploding gradients in deep networks — use gradient clipping. (2) Vanishing gradients in RNNs — use LSTM/GRU. (3) Poor conditioning — use batch normalization or weight initialization (He init for ReLU, Xavier for tanh/sigmoid).",
        callout: "For convex problems (linear regression, logistic regression, SVMs), gradient descent is guaranteed to find the global minimum. For neural networks, it finds a 'good enough' basin.",
      },
    ],
  },

  "probability-statistics": {
    id: "probability-statistics",
    tagline: "The language of uncertainty — probability distributions, MLE, and Bayesian reasoning",
    taglineFr: "Le langage de l'incertitude — distributions de probabilité, MLE et raisonnement bayésien",
    taglineAr: "لغة عدم اليقين — توزيعات الاحتمالية والتقدير الأعظمي والاستدلال البايزي",
    accentColor: "#06b6d4",
    visualization: "probability",
    keyFormulas: [
      { name: "Bayes' Theorem", latex: "P(H|E) = \\frac{P(E|H)\\,P(H)}{P(E)}", meaning: "Update prior belief P(H) with evidence E to get posterior P(H|E)" },
      { name: "MLE", latex: "\\hat{\\theta}_{\\text{MLE}} = \\arg\\max_\\theta \\prod_{i=1}^n p(x_i|\\theta)", meaning: "Find parameters that make observed data most probable — equivalent to minimizing NLL" },
      { name: "Normal PDF", latex: "p(x|\\mu,\\sigma) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}", meaning: "Bell curve — fully specified by mean μ and standard deviation σ" },
      { name: "Central Limit Theorem", latex: "\\bar{X}_n \\xrightarrow{d} \\mathcal{N}\\!\\left(\\mu,\\,\\frac{\\sigma^2}{n}\\right)", meaning: "Sum of n i.i.d. random variables approaches Normal as n→∞ — why the Normal distribution is everywhere" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Uncertainty Is Everywhere in ML",
        text: "Machine learning is fundamentally about making predictions under uncertainty. Classification outputs probabilities (not just labels). Bayesian models maintain full distributions over parameters. Gaussian Processes give confidence intervals. A/B tests use hypothesis testing. Neural network dropout can be interpreted as approximate Bayesian inference. Without probability theory, you can't reason about: whether a model is confidently wrong, whether your train/test split gives a reliable estimate, or whether two models are actually different. Statistics provides the tools to answer all of these.",
        callout: "Log loss (cross-entropy) IS the negative log-likelihood of a Bernoulli distribution. Minimizing cross-entropy IS doing maximum likelihood estimation. They're the same thing.",
      },
      {
        type: "intuition",
        heading: "Distributions — The Most Important Ones",
        text: "**Normal (Gaussian):** Bell-shaped, symmetric. Ubiquitous by the CLT. Parameterized by μ (location) and σ (spread). 68-95-99.7% of data within ±1σ, ±2σ, ±3σ. **Binomial:** Number of successes in n binary trials with probability p. Mean = np, variance = np(1-p). **Poisson:** Number of events in a fixed time/space interval. λ controls both mean and variance. **Bernoulli:** Single binary trial. **Exponential:** Time between events. **Student-t:** Like Normal but heavier tails — used for small sample hypothesis tests. Understanding which distribution to use for your problem is a core skill.",
        callout: "If X₁, X₂, …, Xₙ are i.i.d. with mean μ and finite variance σ², then √n(X̄-μ)/σ → N(0,1). This is why almost everything in statistics is Gaussian after you average enough samples.",
      },
      {
        type: "algorithm",
        heading: "Maximum Likelihood Estimation (MLE)",
        steps: [
          "Choose a probability model p(x|θ) for your data (e.g., Normal, Binomial).",
          "Write the likelihood: L(θ) = ∏ᵢ p(xᵢ|θ) — probability of observed data under θ.",
          "Take log: ℓ(θ) = Σᵢ log p(xᵢ|θ) — log-likelihood is easier to optimize (sum vs product).",
          "Take derivative ∂ℓ/∂θ, set to zero, solve for θ̂_MLE.",
          "For Normal: θ̂_MLE = (μ̂=x̄, σ̂²=Σ(xᵢ-x̄)²/n) — sample mean and biased variance.",
          "For logistic regression: no closed form → use gradient descent on the log-loss = -ℓ(θ).",
        ],
      },
      {
        type: "code",
        heading: "Probability with SciPy & NumPy",
        language: "python",
        code: `import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

# ── Normal distribution ───────────────────────────────────────────────────────
mu, sigma = 170, 10          # heights in cm
dist = stats.norm(mu, sigma)

x = np.linspace(135, 205, 500)
pdf = dist.pdf(x)

# Probabilities
p_tall = 1 - dist.cdf(190)           # P(X > 190)
p_range = dist.cdf(180) - dist.cdf(160)  # P(160 < X < 180)
print(f"P(height > 190cm) = {p_tall:.4f}")
print(f"P(160 < height < 180) = {p_range:.4f}")

# 68-95-99.7 rule
for k in [1, 2, 3]:
    p = dist.cdf(mu + k*sigma) - dist.cdf(mu - k*sigma)
    print(f"P(μ ± {k}σ) = {p:.4f}")  # ≈ 0.68, 0.95, 0.997

# ── MLE — fitting a Normal distribution ──────────────────────────────────────
data = np.random.normal(170, 10, size=100)
mu_mle, sigma_mle = data.mean(), data.std()
print(f"\\nMLE fit: μ̂={mu_mle:.2f}, σ̂={sigma_mle:.2f}")

# SciPy MLE (same result, handles any distribution)
mu_fit, sigma_fit = stats.norm.fit(data)
print(f"scipy fit: μ={mu_fit:.2f}, σ={sigma_fit:.2f}")

# ── Bayes' theorem ────────────────────────────────────────────────────────────
# Disease testing: prevalence 1%, test sensitivity 99%, specificity 95%
p_disease = 0.01
p_pos_given_disease = 0.99     # sensitivity
p_neg_given_healthy = 0.95    # specificity → P(pos|healthy) = 0.05

p_healthy = 1 - p_disease
p_pos_given_healthy = 1 - p_neg_given_healthy

# P(positive) = P(pos|disease)*P(disease) + P(pos|healthy)*P(healthy)
p_pos = p_pos_given_disease * p_disease + p_pos_given_healthy * p_healthy

# Bayes: P(disease | positive test)
p_disease_given_pos = (p_pos_given_disease * p_disease) / p_pos
print(f"\\nP(disease | positive test) = {p_disease_given_pos:.4f}")  # ~16.4%!
# Counterintuitive: despite 99% accurate test, only 16% chance with +ve result
# due to low base rate (prior) — base rate fallacy

# ── Hypothesis testing ────────────────────────────────────────────────────────
# Are two group means different?
group_a = np.random.normal(5.0, 1.5, 50)
group_b = np.random.normal(5.5, 1.5, 50)

t_stat, p_value = stats.ttest_ind(group_a, group_b)
print(f"\\nt-test: t={t_stat:.3f}, p={p_value:.4f}")
print("Significant at α=0.05:", p_value < 0.05)

# Bootstrap confidence interval for mean (distribution-free)
np.random.seed(42)
boot_means = [np.random.choice(group_a, size=len(group_a), replace=True).mean()
              for _ in range(10000)]
ci_low, ci_high = np.percentile(boot_means, [2.5, 97.5])
print(f"95% CI for group A mean: [{ci_low:.3f}, {ci_high:.3f}]")`,
      },
      {
        type: "pitfall",
        heading: "p-values Are Not What You Think",
        text: "A p-value < 0.05 does NOT mean 'there is a 95% chance the effect is real.' It means: 'if the null hypothesis were true, we would see data this extreme less than 5% of the time.' This subtle difference causes widespread misuse. ML-specific pitfalls: (1) Multiple comparisons: if you test 20 hyperparameter configurations and report the best, you've implicitly run 20 hypothesis tests — correct with Bonferroni or use proper validation. (2) Confusing statistical significance with practical significance — with 100k samples, a trivially small effect can be highly significant. (3) Data dredging: running many splits until you find one where your model 'significantly beats' a baseline.",
        callout: "Effect size (Cohen's d = (μ₁-μ₂)/σ) tells you if a difference matters practically. A p=0.0001 with d=0.02 is statistically significant but practically meaningless.",
      },
    ],
  },

  "information-theory": {
    id: "information-theory",
    tagline: "Entropy, cross-entropy, KL divergence — the math behind why loss functions work",
    taglineFr: "Entropie, entropie croisée, divergence KL — les maths derrière le fonctionnement des fonctions de coût",
    taglineAr: "الإنتروبيا والإنتروبيا المتقاطعة وتباعد KL — الرياضيات وراء سبب عمل دوال الخسارة",
    accentColor: "#06b6d4",
    visualization: "entropy",
    keyFormulas: [
      { name: "Entropy", latex: "H(X) = -\\sum_{x} p(x)\\log_2 p(x)", meaning: "Average 'surprise' in bits — maximum when all outcomes equally likely, zero when deterministic" },
      { name: "Cross-Entropy Loss", latex: "H(p,q) = -\\sum_x p(x)\\log q(x)", meaning: "Expected bits needed to encode samples from p using code designed for q — the classification loss" },
      { name: "KL Divergence", latex: "D_{\\text{KL}}(p\\|q) = \\sum_x p(x)\\log\\frac{p(x)}{q(x)}", meaning: "Extra bits needed to encode p with a code optimized for q. Always ≥ 0, equals 0 iff p=q" },
      { name: "Mutual Information", latex: "I(X;Y) = H(X) - H(X|Y) = D_{\\text{KL}}(p(x,y)\\|p(x)p(y))", meaning: "How much knowing Y reduces uncertainty about X — used in feature selection and representation learning" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Information Theory Underpins ML Loss Functions",
        text: "When you train a classifier with cross-entropy loss, you're minimizing the number of 'bits' needed to communicate ground-truth labels using the model's predicted distribution. When a VAE minimizes the ELBO, the regularization term is a KL divergence between the learned latent distribution and a prior. When you measure a decision tree split with information gain, you're computing the reduction in entropy. The connection to information theory is not an accident — it provides a principled, unified framework for understanding why these seemingly ad-hoc choices of loss functions are actually optimal for their respective goals.",
        callout: "Cross-entropy H(p,q) = Entropy H(p) + KL(p‖q). Since H(p) is fixed given the data, minimizing cross-entropy IS minimizing KL divergence from model q to truth p.",
      },
      {
        type: "intuition",
        heading: "Entropy: Measuring Surprise",
        text: "Think of entropy as the average surprise in a probability distribution. A fair coin (50/50) has entropy H = 1 bit — you gain exactly 1 bit of information on each flip. A biased coin (99/1) has near-zero entropy — you're rarely surprised. A uniform distribution over 256 outcomes has entropy H = 8 bits — you need 8 bits to describe each outcome. ML application: a well-calibrated model's predictions on a class boundary have high entropy (uncertain), and its predictions on clear examples have near-zero entropy (confident). Entropy-regularized RL (Soft Actor-Critic) maximizes expected reward PLUS entropy to encourage exploration.",
        callout: "Maximum entropy principle: given constraints, choose the distribution that maximizes entropy. This gives the Normal distribution for mean+variance constraints — it's the least informative/assumptive choice.",
      },
      {
        type: "code",
        heading: "Entropy, Cross-Entropy & KL Divergence in Practice",
        language: "python",
        code: `import numpy as np
from scipy.special import xlogy    # handles 0 * log(0) = 0 safely
from scipy.stats import entropy as scipy_entropy
import matplotlib.pyplot as plt

def entropy(p: np.ndarray, base: float = 2) -> float:
    """Shannon entropy H(p) in bits (base=2) or nats (base=e)"""
    p = np.asarray(p, dtype=float)
    p = p[p > 0]                  # 0 * log(0) = 0 by convention
    return -np.sum(p * np.log(p) / np.log(base))

def cross_entropy(p: np.ndarray, q: np.ndarray, eps: float = 1e-12) -> float:
    """H(p, q) = -sum p * log(q)"""
    p, q = np.asarray(p, dtype=float), np.asarray(q, dtype=float)
    return -np.sum(p * np.log(q + eps))

def kl_divergence(p: np.ndarray, q: np.ndarray, eps: float = 1e-12) -> float:
    """KL(p||q) — NOT symmetric"""
    p, q = np.asarray(p, dtype=float), np.asarray(q, dtype=float)
    mask = p > 0
    return np.sum(p[mask] * np.log((p[mask] + eps) / (q[mask] + eps)))

# ── 1. Entropy of various distributions ──────────────────────────────────────
print("Entropy examples (bits):")
print(f"  Fair coin [0.5, 0.5]:        {entropy([0.5, 0.5]):.4f}")  # 1.0 bit
print(f"  Biased coin [0.99, 0.01]:    {entropy([0.99, 0.01]):.4f}")  # ≈ 0.08 bits
print(f"  Uniform 8 classes:           {entropy([1/8]*8):.4f}")  # 3.0 bits
print(f"  Certain [1.0, 0.0]:          {entropy([1.0, 0.0]):.4f}")  # 0.0 bits

# ── 2. Cross-entropy loss (classification) ────────────────────────────────────
# Ground truth (one-hot): cat
p_true = np.array([1., 0., 0.])       # cat
# Model predictions:
q_good = np.array([0.8, 0.1, 0.1])   # confident & correct
q_bad  = np.array([0.1, 0.8, 0.1])   # confident & wrong
q_uncertain = np.array([0.4, 0.3, 0.3])  # uncertain & correct lean

print("\\nCross-entropy losses:")
print(f"  Good prediction:    {cross_entropy(p_true, q_good):.4f}")   # low
print(f"  Bad prediction:     {cross_entropy(p_true, q_bad):.4f}")    # high
print(f"  Uncertain but ok:   {cross_entropy(p_true, q_uncertain):.4f}")

# H(p,q) = H(p) + KL(p||q). Since H(p)=0 for one-hot: CE = KL(p||q)
print(f"  KL(p_true||q_good) = {kl_divergence(p_true, q_good):.4f}")

# ── 3. KL divergence: asymmetry ───────────────────────────────────────────────
p = np.array([0.6, 0.3, 0.1])
q = np.array([0.3, 0.5, 0.2])
print(f"\\nKL(p||q) = {kl_divergence(p,q):.4f}")
print(f"KL(q||p) = {kl_divergence(q,p):.4f}")  # different — not a distance

# ── 4. Information gain in decision trees ─────────────────────────────────────
def information_gain(parent, left, right):
    n = len(parent)
    n_l, n_r = len(left), len(right)
    h_p = scipy_entropy(np.bincount(parent) / n, base=2)
    h_l = scipy_entropy(np.bincount(left)   / n_l, base=2) if n_l > 0 else 0
    h_r = scipy_entropy(np.bincount(right)  / n_r, base=2) if n_r > 0 else 0
    return h_p - (n_l/n * h_l + n_r/n * h_r)

# 10 samples: 6 class-0, 4 class-1. Split: left=[0,0,0,0,1], right=[0,0,1,1,1]
parent = np.array([0,0,0,0,0,0,1,1,1,1])
left   = np.array([0,0,0,0,1])
right  = np.array([0,0,1,1,1])
print(f"\\nInformation gain: {information_gain(parent, left, right):.4f} bits")`,
      },
      {
        type: "insight",
        heading: "KL Divergence in Modern ML",
        text: "KL divergence appears everywhere in modern ML: (1) VAE loss = reconstruction loss + KL(q(z|x) ‖ p(z)) — the KL term regularizes the latent space toward the prior. (2) Policy gradient RL — TRPO/PPO constrain the KL between old and new policy to avoid catastrophic updates. (3) Knowledge distillation — train student network to minimize KL between its outputs and the teacher's soft predictions. (4) RLHF (ChatGPT-style training) — KL penalty prevents the fine-tuned model from diverging too far from the base model during reward optimization. The asymmetry of KL matters: KL(p‖q) penalizes q assigning zero probability where p has mass (mode-covering), KL(q‖p) penalizes q having mass where p is zero (mode-seeking).",
        callout: "Forward KL (mode-covering) vs reverse KL (mode-seeking) is a fundamental design choice in generative models — VAEs use forward KL, GANs implicitly use reverse.",
      },
    ],
  },

};
