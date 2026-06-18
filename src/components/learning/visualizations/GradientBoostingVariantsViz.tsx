"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { useLocale } from "next-intl";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const GBV_LABELS = {
  en: {
    backBtn: "← Back",
    forwardBtn: "Forward →",
    roundCounter: (r: number, max: number) => `Round ${r}/${max}`,
    trueFn: "true fn",
    msePerRound: "MSE per round",
    initialPred: (name: string) => `${name}: initial prediction (flat zero)`,
    afterRounds: (name: string, r: number, lr: number) =>
      `${name}: after ${r} boosting round${r > 1 ? "s" : ""}  (η=${lr})`,
    detailsHeader: (name: string) => `${name} Details`,
    roundLeaves: (r: number) => `Round ${r} tree leaves:`,
    finalMse: "final MSE",
  },
  fr: {
    backBtn: "← Retour",
    forwardBtn: "Suivant →",
    roundCounter: (r: number, max: number) => `Tour ${r}/${max}`,
    trueFn: "vrai fn",
    msePerRound: "ECM par tour",
    initialPred: (name: string) => `${name} : prédiction initiale (zéro)`,
    afterRounds: (name: string, r: number, lr: number) =>
      `${name} : après ${r} tour${r > 1 ? "s" : ""} de boosting  (η=${lr})`,
    detailsHeader: (name: string) => `Détails ${name}`,
    roundLeaves: (r: number) => `Feuilles de l'arbre tour ${r} :`,
    finalMse: "ECM finale",
  },
  ar: {
    backBtn: "← رجوع",
    forwardBtn: "تقدم →",
    roundCounter: (r: number, max: number) => `جولة ${r}/${max}`,
    trueFn: "الدالة الحقيقية",
    msePerRound: "MSE لكل جولة",
    initialPred: (name: string) => `${name}: تنبؤ ابتدائي (صفر)`,
    afterRounds: (name: string, r: number, lr: number) =>
      `${name}: بعد ${r} جولة${r > 1 ? "" : ""} تعزيز  (η=${lr})`,
    detailsHeader: (name: string) => `تفاصيل ${name}`,
    roundLeaves: (r: number) => `أوراق شجرة الجولة ${r}:`,
    finalMse: "MSE النهائية",
  },
} as const;

type InfoCard = { title: string; lines: string[] };
type AlgoInfoData = Record<"xgboost" | "lightgbm" | "catboost", InfoCard[]>;

const GBV_INFO: Record<"en" | "fr" | "ar", AlgoInfoData> = {
  en: {
    xgboost: [
      { title: "Newton Step (2nd order)", lines: ["gᵢ = ∂L/∂F   (gradient)", "hᵢ = ∂²L/∂F²  (hessian)", "leaf val = −Σgᵢ / (Σhᵢ + λ)"] },
      { title: "Regularized gain", lines: ["Gain = ½[GL²/(HL+λ) + GR²/(HR+λ)", "     − (GL+GR)²/(HL+HR+λ)] − γ", "γ=complexity penalty · λ=L2 reg"] },
      { title: "Optimizations", lines: ["• Column (feature) subsampling", "• Row (sample) subsampling", "• Histogram approximation"] },
    ],
    lightgbm: [
      { title: "Leaf-wise (best-first) growth", lines: ["Pick leaf with highest gain", "Split only that leaf (not all)", "→ deeper, unbalanced trees"] },
      { title: "GOSS — Gradient-based Sampling", lines: ["Keep all large-gradient samples", "Randomly drop small-gradient", "Compensate with weight factor"] },
      { title: "EFB — Exclusive Feature Bundling", lines: ["Bundle mutually exclusive features", "Reduces #features → faster splits", "10–100× faster than XGBoost"] },
    ],
    catboost: [
      { title: "Ordered Boosting", lines: ["Use permuted dataset at each step", "hₜ trained on Dₜ (avoids leakage)", "→ prevents target statistics leak"] },
      { title: "Ordered Target Statistics", lines: ["TS(xᵢ) = Σy[xⱼ=xᵢ, j<i] / count", "Categorical → numeric encoding", "No holdout set needed"] },
      { title: "Symmetric (Oblivious) Trees", lines: ["Same split condition at each level", "Fast prediction (table lookup)", "Implicit regularization"] },
    ],
  },
  fr: {
    xgboost: [
      { title: "Étape Newton (2ème ordre)", lines: ["gᵢ = ∂L/∂F   (gradient)", "hᵢ = ∂²L/∂F²  (hessien)", "val. feuille = −Σgᵢ / (Σhᵢ + λ)"] },
      { title: "Gain régularisé", lines: ["Gain = ½[GL²/(HL+λ) + GR²/(HR+λ)", "     − (GL+GR)²/(HL+HR+λ)] − γ", "γ=pénalité complexité · λ=rég. L2"] },
      { title: "Optimisations", lines: ["• Sous-échantillonnage colonnes", "• Sous-échantillonnage lignes", "• Approximation par histogramme"] },
    ],
    lightgbm: [
      { title: "Croissance par feuille (meilleure d'abord)", lines: ["Choisir la feuille au gain le plus élevé", "Diviser seulement cette feuille", "→ arbres plus profonds, déséquilibrés"] },
      { title: "GOSS — Échantillonnage par gradient", lines: ["Conserver grands gradients", "Supprimer aléatoirement petits gradients", "Compenser avec facteur de poids"] },
      { title: "EFB — Regroupement de caractéristiques", lines: ["Regrouper les caractéristiques exclusives", "Réduit #caractéristiques → plus rapide", "10–100× plus rapide que XGBoost"] },
    ],
    catboost: [
      { title: "Boosting Ordonné", lines: ["Utiliser données permutées à chaque étape", "hₜ entraîné sur Dₜ (évite la fuite)", "→ prévient la fuite statistiques cibles"] },
      { title: "Statistiques de Cibles Ordonnées", lines: ["TS(xᵢ) = Σy[xⱼ=xᵢ, j<i] / count", "Catégoriel → encodage numérique", "Pas besoin d'ensemble de test séparé"] },
      { title: "Arbres Symétriques (Oublieux)", lines: ["Même condition de division par niveau", "Prédiction rapide (recherche en table)", "Régularisation implicite"] },
    ],
  },
  ar: {
    xgboost: [
      { title: "خطوة نيوتن (الرتبة الثانية)", lines: ["gᵢ = ∂L/∂F   (التدرج)", "hᵢ = ∂²L/∂F²  (الهيسيان)", "قيمة الورقة = −Σgᵢ / (Σhᵢ + λ)"] },
      { title: "مكسب منظَّم", lines: ["Gain = ½[GL²/(HL+λ) + GR²/(HR+λ)", "     − (GL+GR)²/(HL+HR+λ)] − γ", "γ=عقوبة التعقيد · λ=تنظيم L2"] },
      { title: "تحسينات", lines: ["• أخذ عينات الأعمدة (الميزات)", "• أخذ عينات الصفوف (العينات)", "• تقريب الرسم البياني"] },
    ],
    lightgbm: [
      { title: "نمو بالورقة (الأفضل أولاً)", lines: ["اختيار الورقة ذات أعلى مكسب", "تقسيم تلك الورقة فقط", "→ أشجار أعمق وغير متوازنة"] },
      { title: "GOSS — أخذ عينات بالتدرج", lines: ["الإبقاء على عينات التدرج الكبير", "حذف عشوائي لعينات التدرج الصغير", "التعويض بعامل ترجيح"] },
      { title: "EFB — تجميع الميزات الحصرية", lines: ["تجميع الميزات المتبادلة الحصرية", "تقليل #الميزات → تقسيمات أسرع", "أسرع بـ10–100× من XGBoost"] },
    ],
    catboost: [
      { title: "تعزيز مرتَّب", lines: ["استخدام بيانات مبدَّلة في كل خطوة", "hₜ مدرَّب على Dₜ (تجنب التسرب)", "→ يمنع تسرب إحصاءات الهدف"] },
      { title: "إحصاءات الهدف المرتَّبة", lines: ["TS(xᵢ) = Σy[xⱼ=xᵢ, j<i] / count", "فئوي → ترميز رقمي", "لا حاجة لمجموعة حجب منفصلة"] },
      { title: "أشجار متماثلة (غافلة)", lines: ["نفس شرط التقسيم في كل مستوى", "تنبؤ سريع (بحث في جدول)", "تنظيم ضمني"] },
    ],
  },
};

// ── Shared 1-D regression dataset ────────────────────────────────────────────
const N = 18;
function seed(i: number) { return Math.abs(Math.sin(i * 53.3 + 2.7)); }

const DATA = Array.from({ length: N }, (_, i) => {
  const x = i / (N - 1);
  const y = Math.sin(2 * Math.PI * x) * 0.8 + (seed(i) - 0.5) * 0.4;
  return { x, y };
});

// ── Simple gradient boosting simulation ──────────────────────────────────────
// Segment-based tree (4 leaves) with given learning rate
function boostRound(
  data: typeof DATA,
  prevPred: number[],
  leafCount: number,
  lr: number
): { newPred: number[]; tree: { lo: number; hi: number; val: number }[] } {
  const residuals = data.map((d, i) => d.y - prevPred[i]);
  const seg = (x: number) => Math.min(leafCount - 1, Math.floor(x * leafCount));
  const leafMeans = Array.from({ length: leafCount }, (_, l) => {
    const pts = data.filter((d) => seg(d.x) === l);
    const resInLeaf = pts.map((d) => residuals[data.indexOf(d)]);
    return resInLeaf.length ? resInLeaf.reduce((a, b) => a + b, 0) / resInLeaf.length : 0;
  });
  const newPred = data.map((d, i) => prevPred[i] + lr * leafMeans[seg(d.x)]);
  const tree = Array.from({ length: leafCount }, (_, l) => ({
    lo: l / leafCount,
    hi: (l + 1) / leafCount,
    val: leafMeans[l],
  }));
  return { newPred, tree };
}

// ── Pre-compute 5 rounds for each algorithm ──────────────────────────────────
type AlgoKey = "xgboost" | "lightgbm" | "catboost";

const ALGOS: Record<AlgoKey, { lr: number; leaves: number; color: string; name: string }> = {
  xgboost: { lr: 0.3,  leaves: 4, color: "#f97316", name: "XGBoost" },
  lightgbm: { lr: 0.4, leaves: 6, color: "#06b6d4", name: "LightGBM" },
  catboost: { lr: 0.2, leaves: 4, color: "#a855f7", name: "CatBoost" },
};

const MAX_ROUNDS = 5;

function simulate(lr: number, leaves: number) {
  let pred = DATA.map(() => 0);
  const rounds: { pred: number[]; tree: { lo: number; hi: number; val: number }[] }[] = [];
  rounds.push({ pred: [...pred], tree: [] });
  for (let r = 0; r < MAX_ROUNDS; r++) {
    const { newPred, tree } = boostRound(DATA, pred, leaves, lr);
    pred = newPred;
    rounds.push({ pred: [...pred], tree });
  }
  return rounds;
}

const ROUNDS: Record<AlgoKey, ReturnType<typeof simulate>> = {
  xgboost:  simulate(ALGOS.xgboost.lr,  ALGOS.xgboost.leaves),
  lightgbm: simulate(ALGOS.lightgbm.lr, ALGOS.lightgbm.leaves),
  catboost: simulate(ALGOS.catboost.lr, ALGOS.catboost.leaves),
};

// ── SVG helpers ───────────────────────────────────────────────────────────────
const PL = 36, PR = 12, PT = 18, PB = 28;
const PW = 360, PH = 200;
const VW = PL + PW + PR; // 408
const VH = PT + PH + PB; // 246

function px(x: number) { return PL + x * PW; }
function py(y: number) { return PT + PH / 2 - y * (PH / 2.2); }

// True sine curve for reference
const SINE_PTS = Array.from({ length: 80 }, (_, i) => {
  const x = i / 79;
  return { x, y: Math.sin(2 * Math.PI * x) * 0.8 };
});

function pathD(pts: { x: number; y: number }[]) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`).join(" ");
}

function predPathD(pred: number[]) {
  return DATA.map((d, i) => `${i === 0 ? "M" : "L"}${px(d.x).toFixed(1)},${py(pred[i]).toFixed(1)}`).join(" ");
}

function mse(pred: number[]) {
  return DATA.reduce((s, d, i) => s + (d.y - pred[i]) ** 2, 0) / DATA.length;
}

// ── Panel components ──────────────────────────────────────────────────────────
function AlgoInfoPanel({
  algo, round, vt, labels,
}: {
  algo: AlgoKey;
  round: number;
  vt: ReturnType<typeof import("@/hooks/useVizTheme").useVizTheme>;
  labels: typeof GBV_LABELS[keyof typeof GBV_LABELS];
}) {
  const locale = useLocale();
  const localeKey = (locale as keyof typeof GBV_INFO) in GBV_INFO ? (locale as keyof typeof GBV_INFO) : "en";
  const INFO = GBV_INFO[localeKey];

  const cfg = ALGOS[algo];
  const rounds = ROUNDS[algo];
  const currentMSE = mse(rounds[round].pred);
  const prevMSE    = round > 0 ? mse(rounds[round - 1].pred) : currentMSE;
  const reduction  = round > 0 ? ((prevMSE - currentMSE) / prevMSE * 100) : 0;
  const nb = vt.isDark ? "#334155" : "#e2e8f0";

  const panel = round === 0
    ? INFO[algo][0]
    : round <= 2
    ? INFO[algo][1]
    : INFO[algo][2];

  return (
    <div className="flex flex-col gap-2">
      {/* MSE badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ backgroundColor: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>MSE</span>
        <span className="text-sm font-bold font-mono" style={{ color: cfg.color }}>
          {currentMSE.toFixed(4)}
        </span>
        {round > 0 && (
          <span className="text-xs font-mono" style={{ color: "#22c55e" }}>
            ↓ {reduction.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Tree leaf values for current round */}
      {round > 0 && (
        <div className="px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: nb }}>
          <div className="font-semibold mb-1" style={{ color: cfg.color }}>
            {labels.roundLeaves(round)}
          </div>
          <div className="font-mono grid grid-cols-2 gap-1" style={{ color: "var(--text-secondary)" }}>
            {rounds[round].tree.slice(0, 6).map((leaf, i) => (
              <span key={i} className="px-1 py-0.5 rounded text-[9px] truncate block" style={{ backgroundColor: `${cfg.color}15` }}>
                [{leaf.lo.toFixed(2)},{leaf.hi.toFixed(2)}]:{leaf.val > 0 ? "+" : ""}{leaf.val.toFixed(2)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm-specific info */}
      <AnimatePresence mode="wait">
        <motion.div key={`${algo}-${Math.min(2, round === 0 ? 0 : round <= 2 ? 1 : 2)}`}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="px-3 py-2 rounded-xl text-xs"
          style={{ backgroundColor: `${cfg.color}10`, border: `1px solid ${cfg.color}20` }}>
          <div className="font-bold mb-1" style={{ color: cfg.color }}>{panel.title}</div>
          {panel.lines.map((l, i) => (
            <div key={i} className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{l}</div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GradientBoostingVariantsViz({
  accentColor = "#f97316",
}: {
  accentColor?: string;
}) {
  const [algo, setAlgo]   = useState<AlgoKey>("xgboost");
  const [round, setRound] = useState(0);
  const vt = useVizTheme();
  const L = useVizLocale(GBV_LABELS);

  const cfg    = ALGOS[algo];
  const rounds = ROUNDS[algo];
  const pred   = rounds[round].pred;
  const color  = cfg.color;

  function handleAlgoChange(a: AlgoKey) {
    setAlgo(a);
    setRound(0);
  }

  // Loss history for mini sparkline
  const lossHistory = useMemo(() =>
    rounds.map((r) => mse(r.pred)),
  [rounds]);
  const maxLoss = Math.max(...lossHistory) * 1.05;

  return (
    <div className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          {(["xgboost", "lightgbm", "catboost"] as AlgoKey[]).map(a => (
            <button key={a} onClick={() => handleAlgoChange(a)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: algo === a ? `${ALGOS[a].color}22` : "transparent",
                color: algo === a ? ALGOS[a].color : "var(--text-muted)",
                border: `1px solid ${algo === a ? ALGOS[a].color + "50" : "var(--border)"}`,
              }}>
              {ALGOS[a].name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button disabled={round === 0} onClick={() => setRound(r => r - 1)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: round > 0 ? `${color}22` : "transparent",
              color: round > 0 ? color : "var(--text-muted)",
              border: `1px solid ${round > 0 ? color + "50" : "var(--border)"}`,
              opacity: round === 0 ? 0.5 : 1,
            }}>
            {L.backBtn}
          </button>
          <span className="text-xs font-mono px-2" style={{ color }}>
            {L.roundCounter(round, MAX_ROUNDS)}
          </span>
          <button disabled={round >= MAX_ROUNDS} onClick={() => setRound(r => Math.min(MAX_ROUNDS, r + 1))}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: round < MAX_ROUNDS ? `${color}22` : "transparent",
              color: round < MAX_ROUNDS ? color : "var(--text-muted)",
              border: `1px solid ${round < MAX_ROUNDS ? color + "50" : "var(--border)"}`,
              opacity: round >= MAX_ROUNDS ? 0.5 : 1,
            }}>
            {L.forwardBtn}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* SVG plot */}
        <div className="flex-1 p-3">
          <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full">
            {/* Grid */}
            {[-0.8, -0.4, 0, 0.4, 0.8].map(v => (
              <g key={v}>
                <line x1={PL} y1={py(v)} x2={PL + PW} y2={py(v)}
                  stroke={vt.grid} strokeWidth={1} />
                <text x={PL - 4} y={py(v) + 4} textAnchor="end" fontSize={8} fill={vt.textMuted}>
                  {v}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line x1={PL} y1={PT} x2={PL} y2={PT + PH} stroke={vt.axis} strokeWidth={1.5} />
            <line x1={PL} y1={PT + PH} x2={PL + PW} y2={PT + PH} stroke={vt.axis} strokeWidth={1.5} />

            {/* True sine curve (ghost) */}
            <path d={pathD(SINE_PTS)} fill="none" stroke="#e94560"
              strokeWidth={1.5} strokeDasharray="7,4" opacity={0.6} />
            <text x={PL + PW - 4} y={py(0.82)} textAnchor="end" fontSize={8} fill={vt.ink("#e94560")}>{L.trueFn}</text>

            {/* Residuals (before round) */}
            {round > 0 && DATA.map((d, i) => {
              const prevPred = rounds[round - 1].pred[i];
              return (
                <line key={i}
                  x1={px(d.x)} y1={py(d.y)}
                  x2={px(d.x)} y2={py(prevPred)}
                  stroke="#f59e0b" strokeWidth={1} opacity={0.5} strokeDasharray="2,2"
                />
              );
            })}

            {/* Current prediction curve */}
            <AnimatePresence mode="wait">
              <motion.path
                key={`${algo}-${round}`}
                d={predPathD(pred)}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            {/* Data points */}
            {DATA.map((d, i) => (
              <circle key={i}
                cx={px(d.x)} cy={py(d.y)} r={4}
                fill={vt.isDark ? "#94a3b8" : "#64748b"}
                stroke={vt.isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.8)"}
                strokeWidth={1.5}
              />
            ))}

            {/* Leaf split lines on x-axis */}
            {round > 0 && rounds[round].tree.map((leaf, i) => (
              <line key={i}
                x1={px(leaf.lo)} y1={PT + PH}
                x2={px(leaf.lo)} y2={PT + PH + 5}
                stroke={color} strokeWidth={1.5} opacity={0.6}
              />
            ))}

            {/* Loss sparkline (mini) */}
            {(() => {
              const SW = 80, SH = 28, SX = PL + 8, SY = PT + 6;
              return (
                <g>
                  <rect x={SX - 2} y={SY - 2} width={SW + 4} height={SH + 4} rx={4}
                    fill={vt.isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)"} />
                  <text x={SX + SW/2} y={SY - 5} textAnchor="middle" fontSize={7} fill={vt.textMuted}>
                    {L.msePerRound}
                  </text>
                  {lossHistory.map((v, i) => {
                    const bx = SX + (i / MAX_ROUNDS) * SW;
                    const bh = (v / maxLoss) * SH;
                    return (
                      <rect key={i} x={bx} y={SY + SH - bh} width={SW / (MAX_ROUNDS + 1) - 1} height={bh}
                        rx={1} fill={i <= round ? color : vt.grid} opacity={i <= round ? 0.85 : 0.3} />
                    );
                  })}
                </g>
              );
            })()}

            {/* Labels */}
            <text x={PL + PW / 2} y={VH - 4} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
              {round === 0 ? L.initialPred(cfg.name) : L.afterRounds(cfg.name, round, cfg.lr)}
            </text>
          </svg>
        </div>

        {/* Info panel */}
        <div className="w-full md:w-64 p-3 border-t md:border-t-0 md:border-l"
          style={{ borderColor: "var(--border)" }}>
          <div className="text-xs font-bold mb-2" style={{ color }}>
            {L.detailsHeader(cfg.name)}
          </div>
          <AlgoInfoPanel algo={algo} round={round} vt={vt} labels={L} />
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 py-2 border-t"
        style={{ borderColor: "var(--border)" }}>
        {Array.from({ length: MAX_ROUNDS + 1 }, (_, i) => (
          <button key={i} onClick={() => setRound(i)} title={L.roundCounter(i, MAX_ROUNDS)}
            className="rounded-full transition-all"
            style={{
              width: i === round ? 20 : 8, height: 8,
              backgroundColor: i === round ? color : i < round ? color + "60" : "var(--border)",
            }} />
        ))}
      </div>

      {/* Footer stats */}
      <div className="grid grid-cols-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
        {(["xgboost", "lightgbm", "catboost"] as AlgoKey[]).map(a => {
          const finalMSE = mse(ROUNDS[a][MAX_ROUNDS].pred);
          return (
            <div key={a} className="py-2.5">
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{ALGOS[a].name}</div>
              <div className="text-sm font-bold font-mono" style={{ color: ALGOS[a].color }}>
                {finalMSE.toFixed(4)}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{L.finalMse}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
