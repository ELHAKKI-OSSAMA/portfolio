import type { TopicContent } from './types';

export const deeplearningContent: Record<string, TopicContent> = {

  "dl-optimization": {
    id: "dl-optimization",
    tagline: "From SGD to Adam — the tricks that make deep networks actually train",
    taglineFr: "De SGD à Adam — les astuces qui permettent aux réseaux profonds de vraiment s'entraîner",
    taglineAr: "من SGD إلى Adam — الحيل التي تجعل الشبكات العميقة تتدرب فعلاً",
    accentColor: "#a78bfa",
    visualization: "dl-optimization",
    keyFormulas: [
      { name: "SGD + Momentum", latex: "v_t = \\mu v_{t-1} - \\eta g_t \\qquad \\theta_t = \\theta_{t-1} + v_t", meaning: "Accumulate velocity in gradient direction — escapes shallow minima and damps oscillation in narrow valleys" },
      { name: "Adam", latex: "\\theta_t = \\theta_{t-1} - \\frac{\\eta}{\\sqrt{\\hat{v}_t}+\\varepsilon}\\hat{m}_t", meaning: "Per-parameter adaptive learning rate: m̂_t = bias-corrected gradient mean, v̂_t = gradient variance" },
      { name: "Batch Normalization", latex: "\\hat{x} = \\frac{x - \\mu_B}{\\sqrt{\\sigma_B^2+\\varepsilon}} \\qquad y = \\gamma\\hat{x} + \\beta", meaning: "Normalize activations per mini-batch; learnable γ,β restore representational power" },
      { name: "Cosine LR Schedule", latex: "\\eta_t = \\eta_{\\min} + \\frac{1}{2}(\\eta_{\\max}-\\eta_{\\min})\\left(1+\\cos\\frac{t\\pi}{T}\\right)", meaning: "Smoothly anneal learning rate from ηmax to ηmin over T steps — better than step decay" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "A Good Model with Bad Optimization Is Worthless",
        text: "The same network architecture trained with vanilla SGD, good initialization, and proper scheduling can outperform a larger network trained carelessly. Optimization tricks are what separate 'works in the paper' from 'works on your GPU in production.' The history: early DNNs failed because of vanishing gradients + poor initialization. The 2012 ImageNet breakthrough (AlexNet) used ReLU activations + dropout + weight decay. ResNets (2015) added skip connections to solve gradient flow at depth 100+. Modern transformers train stably at depth 1000+ with careful normalization, learning rate warmup, and gradient clipping. Each trick solved a concrete failure mode.",
        callout: "Learning rate is the most important hyperparameter. A 10× wrong learning rate often makes the difference between a model that trains and one that diverges — before you even try anything else.",
      },
      {
        type: "intuition",
        heading: "Why Each Trick Exists",
        text: "**Momentum (μ=0.9):** Gradient descent on an elongated loss bowl zigzags across the narrow dimension. Momentum damps these oscillations by averaging gradients over time — effectively turning a slow zig-zag into a smooth curve toward the minimum. **Adam:** Different parameters have very different gradient magnitudes. The first gradient update on rare words in an embedding layer is huge; on common words it's tiny. Adam normalises each parameter by its historical gradient magnitude — rare features get larger effective learning rates. **Batch normalization:** Internal covariate shift — the distribution of activations changes every weight update, forcing subsequent layers to constantly readjust. BatchNorm re-centres activations each layer, stabilising training and enabling 10× higher learning rates. **Dropout (p=0.5):** Randomly zeroes half the activations during training — forces the network to learn redundant representations, prevents co-adaptation of neurons — a powerful regularizer.",
        callout: "Batch size and learning rate are coupled: doubling batch size has similar effect to halving learning rate. The linear scaling rule (Goyal et al. 2017): scale lr proportionally with batch size, add 5-epoch warmup.",
      },
      {
        type: "algorithm",
        heading: "Modern Deep Learning Training Recipe",
        steps: [
          "Initialize weights: He init for ReLU layers (σ=√(2/fan_in)), Xavier for tanh/sigmoid (σ=√(2/(fan_in+fan_out))).",
          "Choose optimizer: Adam (β₁=0.9, β₂=0.999, ε=1e-8, lr=3e-4) for most tasks. SGD+momentum for ImageNet fine-tuning.",
          "Add learning rate warmup: linearly ramp from 0 to target lr over 5% of total steps — prevents large gradient steps before model settles.",
          "Cosine annealing (or ReduceLROnPlateau): decay lr smoothly to 1e-6 over training. OneCycleLR is a strong alternative.",
          "Gradient clipping (max_norm=1.0): cap gradient norm before update — essential for RNNs, Transformers. torch.nn.utils.clip_grad_norm_().",
          "Regularization: Weight decay (L2, λ=1e-4 to 1e-2) in the optimizer. Dropout (p=0.1–0.5). Label smoothing (ε=0.1) for classification.",
          "Mixed precision (torch.cuda.amp): use float16 for forward pass, float32 for loss — 2× speed, 2× memory efficiency on modern GPUs.",
        ],
      },
      {
        type: "code",
        heading: "Modern PyTorch Training Loop",
        language: "python",
        code: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.cuda.amp import GradScaler, autocast
from torch.utils.data import TensorDataset, DataLoader

# ── Minimal model + dataloader for the demo ────────────────────────────
class MyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(16, 64), nn.ReLU(), nn.Linear(64, 10))
    def forward(self, x): return self.net(x)

X_data = torch.randn(512, 16)
y_data = torch.randint(0, 10, (512,))
train_loader = DataLoader(TensorDataset(X_data, y_data), batch_size=32, shuffle=True)

def train_one_epoch(model, loader, optimizer, scaler, scheduler, device, clip_norm=1.0):
    model.train()
    total_loss = 0.0
    for batch_idx, (X, y) in enumerate(loader):
        X, y = X.to(device), y.to(device)
        optimizer.zero_grad(set_to_none=True)   # faster than zero_grad()

        # ── Mixed precision forward pass ──────────────────────────────────────
        with autocast():
            logits = model(X)
            loss   = nn.functional.cross_entropy(logits, y, label_smoothing=0.1)

        # ── Scaled backward + gradient clipping ──────────────────────────────
        scaler.scale(loss).backward()
        scaler.unscale_(optimizer)
        torch.nn.utils.clip_grad_norm_(model.parameters(), clip_norm)
        scaler.step(optimizer)
        scaler.update()
        scheduler.step()                         # step per batch for OneCycleLR

        total_loss += loss.item()

    return total_loss / len(loader)

# ── Setup ─────────────────────────────────────────────────────────────────────
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model  = MyModel().to(device)

# AdamW (Adam with decoupled weight decay — better than Adam+L2)
optimizer = optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-2)

# OneCycle LR: warmup + cosine anneal in one schedule
scheduler = optim.lr_scheduler.OneCycleLR(
    optimizer,
    max_lr=3e-4,
    total_steps=100 * len(train_loader),    # epochs × steps_per_epoch
    pct_start=0.05,                          # 5% warmup
    anneal_strategy="cos",
)

scaler = GradScaler()                        # for mixed precision

# ── Optimizer comparison ──────────────────────────────────────────────────────
import torch.optim as optim

# SGD + Momentum (strong for fine-tuning pretrained CNNs)
sgd = optim.SGD(model.parameters(), lr=0.01, momentum=0.9, weight_decay=1e-4, nesterov=True)

# Adam (default for most deep learning tasks)
adam = optim.Adam(model.parameters(), lr=3e-4, betas=(0.9, 0.999))

# AdamW (Adam with properly decoupled weight decay — recommended by modern best practices)
adamw = optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)

# ── Batch Normalization example ───────────────────────────────────────────────
class ConvBlock(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.block = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch),   # bias=False because BN has its own β
            nn.ReLU(inplace=True),
        )
    def forward(self, x): return self.block(x)

# ── Layer Normalization (Transformers prefer LayerNorm) ───────────────────────
class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.attn    = nn.MultiheadAttention(d_model, n_heads, batch_first=True)
        self.ff      = nn.Sequential(nn.Linear(d_model, d_model*4), nn.GELU(), nn.Linear(d_model*4, d_model))
        self.norm1   = nn.LayerNorm(d_model)    # pre-norm (more stable than post-norm)
        self.norm2   = nn.LayerNorm(d_model)
        self.drop    = nn.Dropout(0.1)
    def forward(self, x):
        # Pre-norm architecture (used in GPT-2+, better gradient flow)
        x = x + self.drop(self.attn(self.norm1(x), self.norm1(x), self.norm1(x))[0])
        x = x + self.drop(self.ff(self.norm2(x)))
        return x

# ── Learning rate finder ──────────────────────────────────────────────────────
# pip install torch-lr-finder
from torch_lr_finder import LRFinder
finder = LRFinder(model, optimizer, nn.CrossEntropyLoss(), device=device)
finder.range_test(train_loader, end_lr=10, num_iter=100)
finder.plot()   # look for the steepest descent — that's your max_lr`,
      },
      {
        type: "pitfall",
        heading: "BatchNorm's Hidden Failure Modes",
        text: "BatchNorm is powerful but has several subtle failure modes: (1) **Small batch sizes:** BatchNorm computes statistics over the batch — with batch_size < 8, estimates are too noisy. Use GroupNorm (group_size=32) or LayerNorm instead. (2) **model.eval() is critical:** In eval mode, BatchNorm uses running statistics computed during training. Forgetting to call model.eval() before inference causes wildly different predictions because the batch statistics from a single test sample are wrong. (3) **Fine-tuning on different distributions:** If fine-tuning a pretrained model, the running mean/var may not match your data. Consider setting track_running_stats=False or using a small learning rate for BN layers. (4) **RNNs:** BatchNorm doesn't work with variable-length sequences — use LayerNorm instead.",
        callout: "The second most common PyTorch bug (after wrong tensor dimensions) is forgetting model.eval() — BatchNorm and Dropout behave differently in train vs eval mode.",
      },
    ],
  },

};
