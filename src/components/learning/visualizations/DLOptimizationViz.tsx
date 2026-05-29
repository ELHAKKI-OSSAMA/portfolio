"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";

const DLO_LABELS = {
  en: {
    tabs: ["LR Schedules", "Optimizer Loss", "Batch Norm"] as readonly string[],
    epochLabel: "Epoch",
    stepsLabel: "Steps",
    lossLabel: "Loss",
    lrDesc: "How learning rate changes over training — warmup prevents large early steps; cosine annealing finds a sharp final minimum.",
    scheduleLabels: ["Constant", "Step Decay", "Cosine Anneal", "Warmup + Cosine"] as readonly string[],
    optimDesc: "Training loss over 100 steps. Adam & AdamW converge fastest; SGD with momentum is slower but generalizes well for fine-tuning CNNs.",
    adamwNote: "AdamW = Adam + decoupled weight decay. Recommended default for most deep learning tasks.",
    bnDesc: (depth: number) => `Activation distributions at layer depth ${depth} — without BN, distributions drift (covariate shift); with BN they stay centered.`,
    layer1: "Layer 1",
    layer5: "Layer 5",
    withoutBN: "Without BN",
    withBN: "With BN",
    bnNote: "Internal covariate shift: without BatchNorm, layer activations drift as weights update — forcing later layers to constantly readjust.",
  },
  fr: {
    tabs: ["Plannings du LR", "Perte Optimiseur", "Norm. par Lots"] as readonly string[],
    epochLabel: "Époque",
    stepsLabel: "Étapes",
    lossLabel: "Perte",
    lrDesc: "Comment le taux d'apprentissage évolue durant l'entraînement — le préchauffage évite les grandes étapes initiales ; le recuit cosinus trouve un minimum final précis.",
    scheduleLabels: ["Constant", "Décroissance par paliers", "Recuit Cosinus", "Préchauffage + Cosinus"] as readonly string[],
    optimDesc: "Perte d'entraînement sur 100 étapes. Adam & AdamW convergent le plus vite ; SGD avec momentum est plus lent mais généralise bien pour le réglage fin des CNN.",
    adamwNote: "AdamW = Adam + décroissance de poids découplée. Par défaut recommandé pour la plupart des tâches d'apprentissage profond.",
    bnDesc: (depth: number) => `Distributions d'activations à la profondeur de couche ${depth} — sans BN, les distributions dérivent (décalage de covariance) ; avec BN elles restent centrées.`,
    layer1: "Couche 1",
    layer5: "Couche 5",
    withoutBN: "Sans BN",
    withBN: "Avec BN",
    bnNote: "Décalage de covariance interne : sans BatchNorm, les activations des couches dérivent à mesure que les poids se mettent à jour — forçant les couches suivantes à se réajuster constamment.",
  },
  ar: {
    tabs: ["جداول LR", "خسارة المُحسِّن", "التطبيع الدفعي"] as readonly string[],
    epochLabel: "حقبة",
    stepsLabel: "خطوات",
    lossLabel: "الخسارة",
    lrDesc: "كيف يتغير معدل التعلم أثناء التدريب — الإحماء يمنع الخطوات الأولى الكبيرة؛ التلطيف بالجيب التمام يجد حداً أدنى نهائياً حاداً.",
    scheduleLabels: ["ثابت", "تراجع تدريجي", "تلطيف جيبي", "إحماء + جيبي"] as readonly string[],
    optimDesc: "خسارة التدريب على 100 خطوة. Adam وAdamW يتقاربان بأسرع وتيرة؛ SGD مع الزخم أبطأ لكنه يُعمِّم بشكل جيد لضبط CNN.",
    adamwNote: "AdamW = Adam + تراجع وزن منفصل. الافتراضي الموصى به لمعظم مهام التعلم العميق.",
    bnDesc: (depth: number) => `توزيعات التنشيط عند عمق الطبقة ${depth} — بدون BN تنجرف التوزيعات (تحول التغاير)؛ مع BN تبقى مركزة.`,
    layer1: "طبقة 1",
    layer5: "طبقة 5",
    withoutBN: "بدون BN",
    withBN: "مع BN",
    bnNote: "تحول التغاير الداخلي: بدون BatchNorm، تنجرف تنشيطات الطبقة مع تحديث الأوزان — مما يجبر الطبقات اللاحقة على إعادة الضبط باستمرار.",
  },
} as const;

const W = 520;
const H = 220;
const PAD = { t: 20, r: 20, b: 40, l: 56 };
const IW = W - PAD.l - PAD.r;
const IH = H - PAD.t - PAD.b;

const TABS_EN = ["LR Schedules", "Optimizer Loss", "Batch Norm"] as const;
type Tab = (typeof TABS_EN)[number];

// ── LR schedule helpers ───────────────────────────────────────────────────────
const N = 100;
const LR_MAX = 0.01;

function cosine(t: number): number {
  return 1e-5 + 0.5 * (LR_MAX - 1e-5) * (1 + Math.cos(Math.PI * t / N));
}
function stepDecay(t: number): number {
  if (t < 30) return LR_MAX;
  if (t < 60) return LR_MAX * 0.1;
  if (t < 90) return LR_MAX * 0.01;
  return LR_MAX * 0.001;
}
function warmupCosine(t: number): number {
  const WARM = 10;
  if (t < WARM) return LR_MAX * (t / WARM);
  return 1e-5 + 0.5 * (LR_MAX - 1e-5) * (1 + Math.cos(Math.PI * (t - WARM) / (N - WARM)));
}

const SCHEDULES = [
  { label: "Constant", color: "#94a3b8", fn: () => LR_MAX },
  { label: "Step Decay", color: "#f59e0b", fn: stepDecay },
  { label: "Cosine Anneal", color: "#06b6d4", fn: cosine },
  { label: "Warmup + Cosine", color: "#a78bfa", fn: warmupCosine },
];

// ── Optimizer loss curves (deterministic pseudo-random) ───────────────────────
function makeLoss(seed: number, decay: number, noiseAmp: number, offset = 0): number[] {
  const out: number[] = [];
  let v = 2.4 + offset;
  for (let i = 0; i < N; i++) {
    const noise = Math.sin(i * seed * 7.3 + seed) * noiseAmp;
    v = Math.max(v * (1 - decay) + noise, 0.04);
    out.push(v);
  }
  return out;
}
const OPTIMS = [
  { label: "SGD", color: "#f43f5e", loss: makeLoss(1.1, 0.006, 0.12, 0.6) },
  { label: "SGD+Momentum", color: "#f59e0b", loss: makeLoss(2.3, 0.015, 0.07, 0.3) },
  { label: "Adam", color: "#22c55e", loss: makeLoss(3.7, 0.028, 0.04) },
  { label: "AdamW", color: "#a78bfa", loss: makeLoss(4.1, 0.030, 0.035, 0.05) },
];

// ── Batch Norm activation histograms (20 bins, 0→1 normalised counts) ─────────
const BINS = 20;
function makeDist(mu: number, sigma: number, skew = 0): number[] {
  return Array.from({ length: BINS }, (_, i) => {
    const x = -3 + (i / (BINS - 1)) * 6;
    const z = (x - mu) / sigma;
    return Math.max(0, Math.exp(-0.5 * z * z) * (1 + skew * z * 0.3));
  });
}

// ── Chart helpers ─────────────────────────────────────────────────────────────
function toX(i: number): number { return PAD.l + (i / (N - 1)) * IW; }
function toY(v: number, min: number, max: number): number {
  return PAD.t + IH - ((v - min) / (max - min)) * IH;
}
function polyline(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function DLOptimizationViz({ accentColor = "#a78bfa" }: { accentColor?: string }) {
  const [tab, setTab] = useState<Tab>("LR Schedules");
  const [depth, setDepth] = useState(1); // 1-5 layers deep (for BatchNorm demo)
  const vt = useVizTheme();
  const L = useVizLocale(DLO_LABELS);

  // ── LR schedule paths ───────────────────────────────────────────────────────
  const lrPaths = useMemo(() => {
    return SCHEDULES.map(s => {
      const vals = Array.from({ length: N }, (_, i) => s.fn(i));
      const pts: [number, number][] = vals.map((v, i) => [
        toX(i), toY(v, 0, LR_MAX * 1.05),
      ]);
      return { ...s, pts };
    });
  }, []);

  // ── Optimizer loss paths ────────────────────────────────────────────────────
  const optimPaths = useMemo(() => {
    const allVals = OPTIMS.flatMap(o => o.loss);
    const min = Math.min(...allVals);
    const max = Math.max(...allVals);
    return OPTIMS.map(o => {
      const pts: [number, number][] = o.loss.map((v, i) => [toX(i), toY(v, min, max)]);
      return { ...o, pts, min, max };
    });
  }, []);

  // ── Batch-norm histograms ───────────────────────────────────────────────────
  const bnData = useMemo(() => {
    const drift = (depth - 1) * 0.6;
    const spread = 1 + (depth - 1) * 0.45;
    const withoutBN = makeDist(drift, spread, (depth - 1) * 0.3);
    const withBN = makeDist(0, 0.85, 0);
    const maxVal = Math.max(...withoutBN, ...withBN);
    return { withoutBN, withBN, maxVal };
  }, [depth]);

  const barW = IW / BINS - 1;

  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ backgroundColor: vt.surface, borderColor: vt.border }}
    >
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS_EN.map((t, ti) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              tab === t
                ? { backgroundColor: accentColor, color: "#fff" }
                : { backgroundColor: `${accentColor}15`, color: vt.textMuted }
            }
          >
            {L.tabs[ti]}
          </button>
        ))}
      </div>

      {/* ── LR SCHEDULES ──────────────────────────────────────────────────────── */}
      {tab === "LR Schedules" && (
        <div>
          <p className="text-xs mb-3" style={{ color: vt.textMuted }}>
            {L.lrDesc}
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map(frac => {
              const y = PAD.t + frac * IH;
              const val = LR_MAX * (1 - frac);
              return (
                <g key={frac}>
                  <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke={vt.grid} strokeWidth={1} />
                  <text x={PAD.l - 4} y={y + 4} textAnchor="end" fontSize={9} fill={vt.textFaint}>
                    {val.toExponential(0)}
                  </text>
                </g>
              );
            })}
            {[0, 25, 50, 75, 100].map(ep => (
              <text key={ep} x={toX(ep)} y={H - 8} textAnchor="middle" fontSize={9} fill={vt.textFaint}>{ep}</text>
            ))}
            <text x={PAD.l + IW / 2} y={H - 1} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{L.epochLabel}</text>
            {/* Lines */}
            {lrPaths.map(s => (
              <motion.polyline
                key={s.label}
                points={polyline(s.pts)}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
              />
            ))}
          </svg>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-2">
            {SCHEDULES.map((s, si) => (
              <div key={s.label} className="flex items-center gap-1.5 text-xs" style={{ color: vt.textMuted }}>
                <span className="w-5 h-0.5 inline-block rounded" style={{ backgroundColor: s.color }} />
                {L.scheduleLabels[si]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── OPTIMIZER LOSS ────────────────────────────────────────────────────── */}
      {tab === "Optimizer Loss" && (
        <div>
          <p className="text-xs mb-3" style={{ color: vt.textMuted }}>
            {L.optimDesc}
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {[0, 0.25, 0.5, 0.75, 1].map(frac => {
              const y = PAD.t + frac * IH;
              return (
                <line key={frac} x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke={vt.grid} strokeWidth={1} />
              );
            })}
            {[0, 25, 50, 75, 100].map(ep => (
              <text key={ep} x={toX(ep)} y={H - 8} textAnchor="middle" fontSize={9} fill={vt.textFaint}>{ep}</text>
            ))}
            <text x={PAD.l + IW / 2} y={H - 1} textAnchor="middle" fontSize={9} fill={vt.textMuted}>{L.stepsLabel}</text>
            <text x={10} y={PAD.t + IH / 2} textAnchor="middle" fontSize={9} fill={vt.textMuted}
              transform={`rotate(-90, 10, ${PAD.t + IH / 2})`}>{L.lossLabel}</text>
            {optimPaths.map(o => (
              <motion.polyline
                key={o.label}
                points={polyline(o.pts)}
                fill="none"
                stroke={o.color}
                strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
              />
            ))}
          </svg>
          <div className="flex flex-wrap gap-3 mt-2">
            {OPTIMS.map(o => (
              <div key={o.label} className="flex items-center gap-1.5 text-xs" style={{ color: vt.textMuted }}>
                <span className="w-5 h-0.5 inline-block rounded" style={{ backgroundColor: o.color }} />
                {o.label}
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs p-2 rounded-lg" style={{ backgroundColor: `${accentColor}12`, color: accentColor }}>
            {L.adamwNote}
          </div>
        </div>
      )}

      {/* ── BATCH NORM ────────────────────────────────────────────────────────── */}
      {tab === "Batch Norm" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs" style={{ color: vt.textMuted }}>
              {L.bnDesc(depth)}
            </p>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs" style={{ color: vt.textFaint }}>{L.layer1}</span>
            <input
              type="range" min={1} max={5} value={depth}
              onChange={e => setDepth(Number(e.target.value))}
              className="flex-1 h-1 accent-current"
              style={{ accentColor }}
            />
            <span className="text-xs" style={{ color: vt.textFaint }}>{L.layer5}</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {/* Two histogram panels side by side */}
            {([L.withoutBN, L.withBN] as const).map((label, panelIdx) => {
              const data = panelIdx === 0 ? bnData.withoutBN : bnData.withBN;
              const xOff = panelIdx === 0 ? 30 : W / 2 + 10;
              const pw = W / 2 - 40;
              const bw = pw / BINS - 1;
              const col = panelIdx === 0 ? "#f43f5e" : "#22c55e";
              return (
                <g key={label}>
                  <text x={xOff + pw / 2} y={PAD.t - 4} textAnchor="middle" fontSize={10} fill={vt.textMuted}>{label}</text>
                  {data.map((v, bi) => {
                    const bx = xOff + (bi / BINS) * pw;
                    const bh = (v / bnData.maxVal) * IH;
                    return (
                      <motion.rect
                        key={bi}
                        x={bx}
                        y={PAD.t + IH - bh}
                        width={bw}
                        height={bh}
                        rx={1}
                        fill={`${col}90`}
                        stroke={col}
                        strokeWidth={0.5}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        style={{ transformOrigin: `${bx}px ${PAD.t + IH}px` }}
                        transition={{ duration: 0.5, delay: bi * 0.02 }}
                      />
                    );
                  })}
                  <line x1={xOff} x2={xOff + pw} y1={PAD.t + IH} y2={PAD.t + IH} stroke={vt.axis} strokeWidth={1} />
                </g>
              );
            })}
          </svg>
          <div className="mt-2 text-xs p-2 rounded-lg" style={{ backgroundColor: `${accentColor}12`, color: accentColor }}>
            {L.bnNote}
          </div>
        </div>
      )}
    </div>
  );
}
