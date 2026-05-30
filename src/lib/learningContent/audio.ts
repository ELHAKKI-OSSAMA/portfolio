import type { TopicContent } from './types';

export const audioContent: Record<string, TopicContent> = {

  "audio-ml": {
    id: "audio-ml",
    tagline: "From raw waveforms to MFCC features — how machines listen and understand speech",
    taglineFr: "Des formes d'onde brutes aux caractéristiques MFCC — comment les machines écoutent et comprennent la parole",
    taglineAr: "من الموجات الخام إلى ميزات MFCC — كيف تستمع الآلات وتفهم الكلام",
    accentColor: "#84cc16",
    visualization: "spectrogram",
    keyFormulas: [
      { name: "Short-Time Fourier Transform", latex: "X(\\tau, f) = \\int_{-\\infty}^{\\infty} x(t)\\,w(t-\\tau)\\,e^{-j2\\pi ft}\\,dt", meaning: "Compute frequency content within a sliding window — produces the spectrogram" },
      { name: "Mel Scale", latex: "m = 2595 \\cdot \\log_{10}\\!\\left(1 + \\frac{f}{700}\\right)", meaning: "Maps linear frequency to perceptual scale — humans hear pitch logarithmically, especially at high frequencies" },
      { name: "MFCC", latex: "c_n = \\sum_{m=1}^M \\log S_m \\cdot \\cos\\!\\left(n\\left(m-\\tfrac{1}{2}\\right)\\frac{\\pi}{M}\\right)", meaning: "Discrete Cosine Transform of log Mel filterbank energies — compact, decorrelated audio features" },
      { name: "CTC Loss", latex: "L = -\\log P(y | x) = -\\log \\sum_{\\pi \\in \\mathcal{B}^{-1}(y)} P(\\pi | x)", meaning: "Connectionist Temporal Classification — allows alignment-free training between input frames and output tokens" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Why Audio ML Is Harder Than Image ML",
        text: "Audio presents unique challenges that images don't: (1) Temporal structure — meaning depends on order and timing, not just content (speech is a sequence). (2) Variable length — an utterance can be 0.1s or 60s; images can be padded/resized cleanly, audio padding changes perceived silence. (3) Non-stationarity — statistical properties change over time (pitch, speed, accent). (4) Irrelevant variation — same content spoken faster, louder, with different accent, different microphone, background noise — all should produce the same output. (5) No direct spatial structure — unlike images where CNNs exploit local pixel correlations, raw audio samples are 1D time series at 16,000–44,100 Hz. The spectrogram transformation converts audio into a 2D image-like representation that CNNs can process.",
        callout: "Siri, Google Assistant, Alexa, and Whisper all convert speech to spectrograms (or learned mel filterbanks) before applying neural networks — raw waveforms are almost never fed directly.",
      },
      {
        type: "intuition",
        heading: "The Audio Processing Pipeline",
        text: "**Raw waveform:** x(t) — a 1D time series of air pressure values sampled at 16kHz (16,000 samples/second for speech). **Spectrogram:** Apply Short-Time Fourier Transform (STFT) with a sliding window (~25ms, stride ~10ms) → matrix of frequency content over time. Y-axis = frequency (0–8kHz), X-axis = time. Bright regions = frequencies present at that time. **Mel spectrogram:** Apply triangular filterbank (Mel scale) to collapse frequency axis to 80–128 Mel bins — matches human auditory perception. **MFCC:** Apply log + Discrete Cosine Transform (DCT) to decorrelate filterbank energies → 13–40 compact coefficients per frame. MFCCs were the gold standard for decades; modern deep learning often skips them and uses log-mel spectrograms directly as CNN input.",
        callout: "A 1-second clip at 16kHz = 16,000 raw samples. After STFT with 25ms windows/10ms stride = ~100 frames × 80 Mel bins = 8,000 values. 50% compression while retaining all perceptual content.",
      },
      {
        type: "algorithm",
        heading: "Speech Recognition Pipeline (Whisper-style)",
        steps: [
          "Preprocess: resample to 16kHz, normalize amplitude, pad/trim to fixed length.",
          "Log-Mel spectrogram: apply STFT (window=25ms, hop=10ms, n_fft=400), apply 80 Mel filterbanks, take log.",
          "Encoder: 2D CNN strided conv → Transformer encoder with absolute positional embeddings — encodes audio context.",
          "Decoder: autoregressive Transformer decoder conditioned on encoder output. Trained with teacher forcing on transcripts.",
          "CTC or cross-entropy loss between predicted token sequence and ground-truth transcript.",
          "Inference: beam search (width 5) decodes the most likely token sequence. Optional language model rescoring.",
          "Post-processing: apply punctuation restoration, inverse text normalization (convert '3 dollars' → '$3').",
        ],
      },
      {
        type: "code",
        heading: "Audio Features with librosa + OpenAI Whisper",
        language: "python",
        code: `import librosa
import numpy as np
import matplotlib.pyplot as plt

# ── 1. Load audio ─────────────────────────────────────────────────────────────
y, sr = librosa.load("speech.wav", sr=16000)   # resample to 16kHz
print(f"Duration: {len(y)/sr:.2f}s, Sample rate: {sr}Hz")

# ── 2. Waveform to spectrogram ────────────────────────────────────────────────
D = librosa.stft(y, n_fft=400, hop_length=160, win_length=400)
spectrogram = np.abs(D)**2               # power spectrogram (magnitude²)
S_db = librosa.power_to_db(spectrogram, ref=np.max)  # decibel scale

# ── 3. Mel spectrogram ────────────────────────────────────────────────────────
S_mel = librosa.feature.melspectrogram(
    y=y, sr=sr,
    n_fft=400,
    hop_length=160,        # 10ms stride at 16kHz
    win_length=400,        # 25ms window at 16kHz
    n_mels=80,             # 80 Mel bins (Whisper standard)
    fmin=50, fmax=8000,    # filter between 50Hz and 8kHz
)
log_mel = librosa.power_to_db(S_mel, ref=np.max)
print(f"Log-mel shape: {log_mel.shape}")   # (80, T)

# ── 4. MFCC ──────────────────────────────────────────────────────────────────
mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_mels=80)
mfcc_delta  = librosa.feature.delta(mfcc)    # velocity: change over time
mfcc_delta2 = librosa.feature.delta(mfcc, order=2)  # acceleration

features = np.vstack([mfcc, mfcc_delta, mfcc_delta2])  # 39-dim feature vector
print(f"MFCC + deltas shape: {features.shape}")  # (39, T)

# ── 5. Audio classification with CNN ─────────────────────────────────────────
import torch, torch.nn as nn

class AudioCNN(nn.Module):
    def __init__(self, n_classes: int):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1), nn.ReLU(),
            nn.AdaptiveAvgPool2d((4, 4)),    # global average pool to fixed size
        )
        self.fc = nn.Sequential(
            nn.Linear(128*4*4, 256), nn.ReLU(), nn.Dropout(0.4),
            nn.Linear(256, n_classes),
        )
    def forward(self, x):
        # x: (B, 1, n_mels, T) — log-mel as single-channel "image"
        return self.fc(self.conv(x).flatten(1))

model = AudioCNN(n_classes=10)   # e.g., UrbanSound8K: 10 sound classes
x = torch.randn(8, 1, 80, 128)  # batch of 8 audio clips, 80 mels, 128 frames
print(model(x).shape)            # (8, 10)

# ── 6. OpenAI Whisper (speech-to-text) ───────────────────────────────────────
# pip install openai-whisper
import whisper
model_w = whisper.load_model("base")          # 74M params
result  = model_w.transcribe("speech.wav")
print(result["text"])                          # full transcript
print(result["language"])                      # detected language

# Timestamps for each word
result_ts = model_w.transcribe("speech.wav", word_timestamps=True)
for seg in result_ts["segments"]:
    print(f"[{seg['start']:.2f}s → {seg['end']:.2f}s] {seg['text']}")`,
      },
      {
        type: "pitfall",
        heading: "Data Augmentation Is Critical for Audio",
        text: "Audio models overfit easily because a single speaker can sound completely different across recording conditions. Key augmentations: (1) **SpecAugment** (Google, 2019) — randomly mask frequency bands (frequency masking) and time steps (time masking) in the log-mel spectrogram. Simple yet extremely effective — used in Whisper. (2) **Time stretching** — change tempo without changing pitch (librosa.effects.time_stretch). (3) **Pitch shifting** — change pitch without changing tempo. (4) **Background noise mixing** — add babble noise, music, traffic at various SNR levels. (5) **Room impulse response (RIR) convolution** — simulate different acoustic environments. Without augmentation, a model trained on studio-quality speech fails completely on phone calls or outdoor recordings.",
        callout: "SpecAugment alone improved LAS (Listen, Attend and Spell) model WER by 13.9% relative on LibriSpeech — arguably the best single augmentation technique in ASR history.",
      },
    ],
  },

};
