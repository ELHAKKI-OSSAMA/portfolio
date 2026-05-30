import type { TopicContent } from './types';

export const advancedContent: Record<string, TopicContent> = {
  "transformers-attention": {
    id: "transformers-attention",
    tagline: "Every word speaks directly to every other word — attending to the whole sentence at once",
    taglineFr: "Chaque mot s'adresse directement à chaque autre mot — attention portée à toute la phrase à la fois",
    taglineAr: "كل كلمة تتحدث مباشرة إلى كل كلمة أخرى — الاهتمام بالجملة بأكملها دفعةً واحدة",
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
  "generative-models": {
    id: "generative-models",
    tagline: "Learning the shape of data — then sampling new reality from the learned distribution",
    taglineFr: "Apprendre la forme des données — puis échantillonner une nouvelle réalité à partir de la distribution apprise",
    taglineAr: "تعلّم شكل البيانات — ثم أخذ عينات من واقع جديد من التوزيع المتعلَّم",
    accentColor: "#ec4899",
    visualization: "gan-vae",
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
    taglineFr: "La sagesse des foules diverses — combiner des modèles imparfaits en quelque chose de plus fort qu'aucun individu",
    taglineAr: "حكمة الحشود المتنوعة — دمج نماذج غير مثالية في شيء أقوى من أي نموذج منفرد",
    accentColor: "#06b6d4",
    visualization: "bagging-stacking",
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
    taglineFr: "Étendre les classifieurs binaires au multi-classes — tableaux de tournoi pour les algorithmes",
    taglineAr: "توسيع المصنّفات الثنائية إلى متعددة الفئات — أقواس بطولة للخوارزميات",
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
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.multiclass import OneVsRestClassifier, OneVsOneClassifier
from sklearn.svm import SVC

# ── Sample data ────────────────────────────────────────────────────────
X_np, y_np = make_classification(n_samples=300, n_features=8,
                                  n_classes=3, n_informative=6, random_state=42)
X_train_np, X_test_np, y_train_np, _ = train_test_split(
    X_np, y_np, test_size=0.2, random_state=42)

# ── PyTorch multiclass setup ───────────────────────────────────────────
K = 3                                       # number of classes
batch = 16

# Tiny 2-layer net for the demo
class SimpleNet(nn.Module):
    def __init__(self): super().__init__(); self.fc = nn.Linear(8, K)
    def forward(self, x): return self.fc(x)

model = SimpleNet()
x = torch.randn(batch, 8)                   # one mini-batch
y = torch.randint(0, K, (batch,))           # class indices

# Class weights (handle imbalance)
class_weights = torch.tensor([1.0, 2.0, 1.5])   # weight rarer classes higher

# Softmax + Cross-Entropy (combined for numerical stability)
criterion = nn.CrossEntropyLoss(
    weight=class_weights,    # For imbalanced classes
    label_smoothing=0.1      # Prevents overconfident predictions
)

# Model outputs raw logits (no softmax in forward pass)
logits = model(x)            # Shape: (batch, K)
loss = criterion(logits, y)  # y contains class indices
print(f"Multiclass CE loss: {loss.item():.4f}")

# Predictions
probs = torch.softmax(logits, dim=-1)
preds = probs.argmax(dim=-1)

# Sklearn: OvR (OvA) strategy
ovr = OneVsRestClassifier(SVC(kernel='rbf', probability=True))
ovo = OneVsOneClassifier(SVC(kernel='rbf'))
ovr.fit(X_train_np, y_train_np)
print(f"OvR accuracy: {ovr.score(X_test_np, _):.3f}")`,
        language: "python",
      },
    ],
  },
};
