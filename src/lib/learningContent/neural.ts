import type { TopicContent } from './types';

export const neuralContent: Record<string, TopicContent> = {
  "neural-networks": {
    id: "neural-networks",
    tagline: "Universal approximators built from threshold logic, optimized by calculus",
    taglineFr: "Des approximateurs universels construits sur la logique à seuil, optimisés par le calcul",
    taglineAr: "مقربات عالمية مبنية على منطق العتبة، محسّنة بالحساب التفاضلي",
    accentColor: "#ec4899",
    visualization: "neural-network-backprop",
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
from torch.utils.data import TensorDataset, DataLoader

# ── Sample dataloader ──────────────────────────────────────────────────
X_data = torch.randn(1000, 128)
y_data = torch.randint(0, 2, (1000,)).float()
dataloader = DataLoader(TensorDataset(X_data, y_data), batch_size=64, shuffle=True)

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
  "cnn-architectures": {
    id: "cnn-architectures",
    tagline: "Local pattern detectors that see edges, then textures, then faces — by stacking filters",
    taglineFr: "Détecteurs de motifs locaux qui voient les contours, puis les textures, puis les visages — en empilant des filtres",
    taglineAr: "كاشفات الأنماط المحلية التي ترى الحواف ثم الملمس ثم الوجوه — بتراكم المرشحات",
    accentColor: "#8b5cf6",
    visualization: "convolution-resnet-vit",
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
import torch.optim as optim

# ── Config ─────────────────────────────────────────────────────────────
num_classes = 10   # e.g. 10-class image dataset

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
  "rnn-lstm-gru": {
    id: "rnn-lstm-gru",
    tagline: "Teaching networks to remember — from catastrophic forgetting to selective gated memory",
    taglineFr: "Apprendre aux réseaux à se souvenir — de l'oubli catastrophique à la mémoire sélective à portes",
    taglineAr: "تعليم الشبكات التذكر — من النسيان الكارثي إلى الذاكرة البوابية الانتقائية",
    accentColor: "#8b5cf6",
    visualization: "rnn-lstm",
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
from torch.utils.data import TensorDataset, DataLoader

# ── Sample sequential dataloader ───────────────────────────────────────
# Shape: (n_samples, seq_len, features) → predict next value
X_seq = torch.randn(500, 20, 10)          # 500 samples, seq_len=20, 10 features
y_seq = torch.randn(500)                   # 500 scalar targets
dataloader = DataLoader(TensorDataset(X_seq, y_seq), batch_size=32, shuffle=True)

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
};
