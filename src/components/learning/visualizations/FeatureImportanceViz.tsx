"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const FI_LABELS = {
  en: {
    title: "Feature Importance",
    permLabel: "Permutation (model-agnostic)",
    impLabel: "Impurity (tree-based)",
    permBtn: "Permutation",
    impBtn: "Impurity",
    noiseTag: "← noise",
    axisLabel: "Importance score",
    insightPerm: "Permutation importance measures accuracy drop when a feature is randomly shuffled. Model-agnostic — works with any estimator. Low scores for random_noise confirm the method is honest.",
    insightImp: "Impurity (Gini/entropy) importance from tree splits. Fast but biased toward high-cardinality features like zip_code. Permutation importance is more reliable for real feature selection.",
  },
  fr: {
    title: "Importance des Caractéristiques",
    permLabel: "Permutation (agnostique au modèle)",
    impLabel: "Impureté (basée sur les arbres)",
    permBtn: "Permutation",
    impBtn: "Impureté",
    noiseTag: "← bruit",
    axisLabel: "Score d'importance",
    insightPerm: "L'importance par permutation mesure la chute de précision lorsqu'une caractéristique est mélangée aléatoirement. Agnostique au modèle — fonctionne avec n'importe quel estimateur. Les faibles scores pour random_noise confirment l'honnêteté de la méthode.",
    insightImp: "L'importance par impureté (Gini/entropie) provient des découpages d'arbres. Rapide mais biaisée vers les caractéristiques à haute cardinalité comme zip_code. L'importance par permutation est plus fiable pour la sélection réelle de caractéristiques.",
  },
  ar: {
    title: "أهمية الميزات",
    permLabel: "التبديل (مستقل عن النموذج)",
    impLabel: "الشوائب (قائم على الأشجار)",
    permBtn: "تبديل",
    impBtn: "شوائب",
    noiseTag: "← ضوضاء",
    axisLabel: "درجة الأهمية",
    insightPerm: "تقيس أهمية التبديل انخفاض الدقة عند خلط ميزة عشوائياً. مستقلة عن النموذج — تعمل مع أي مُقدِّر. الدرجات المنخفضة لـ random_noise تؤكد أمانة الطريقة.",
    insightImp: "أهمية الشوائب (جيني/الإنتروبيا) من تقسيمات الأشجار. سريعة لكن منحازة نحو الميزات عالية التقسيم مثل zip_code. أهمية التبديل أكثر موثوقية لاختيار الميزات الفعلي.",
  },
} as const;

const W = 520, H = 220;
const PAD = { l:130, r:20, t:16, b:32 };
const PW = W - PAD.l - PAD.r, PH = H - PAD.t - PAD.b;

// Simulated feature importances (Random Forest on a tabular dataset)
const FEATURES = [
  { name:"income",        imp:0.28, permImp:0.25, impurity:0.31 },
  { name:"age",           imp:0.22, permImp:0.20, impurity:0.24 },
  { name:"credit_score",  imp:0.18, permImp:0.17, impurity:0.19 },
  { name:"loan_amount",   imp:0.12, permImp:0.14, impurity:0.10 },
  { name:"employment_yrs",imp:0.09, permImp:0.08, impurity:0.09 },
  { name:"num_accounts",  imp:0.06, permImp:0.07, impurity:0.05 },
  { name:"random_noise",  imp:0.03, permImp:0.01, impurity:0.01 },
  { name:"zip_code",      imp:0.02, permImp:0.00, impurity:0.01 },
];

type Method = "permutation" | "impurity";

const METHOD_COLOR: Record<Method, string> = {
  permutation: "#6c63ff",
  impurity:    "#f97316",
};

export default function FeatureImportanceViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(FI_LABELS);
  const [method, setMethod] = useState<Method>("permutation");
  const [hovIdx, setHovIdx] = useState<number | null>(null);

  const sorted = useMemo(() =>
    [...FEATURES].sort((a, b) => (b[method === "permutation" ? "permImp" : "impurity"]) - (a[method === "permutation" ? "permImp" : "impurity"])),
  [method]);

  const key   = method === "permutation" ? "permImp" : "impurity";
  const color = METHOD_COLOR[method];
  const maxV  = sorted[0][key];

  const rowH = PH / sorted.length;

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {L.title} — {method === "permutation" ? L.permLabel : L.impLabel}
        </span>
        <div className="flex gap-1">
          {(["permutation","impurity"] as Method[]).map(m => (
            <button key={m} onClick={() => setMethod(m)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{ backgroundColor:method===m?`${METHOD_COLOR[m]}22`:"transparent", color:method===m?METHOD_COLOR[m]:vt.textMuted, border:`1px solid ${method===m?METHOD_COLOR[m]+"55":"var(--border)"}` }}>
              {m === "permutation" ? L.permBtn : L.impBtn}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* x grid */}
        {[0.25,0.5,0.75,1].map(f => {
          const x = PAD.l + f * PW;
          return <line key={f} x1={x} y1={PAD.t} x2={x} y2={PAD.t+PH} stroke={vt.grid} strokeWidth={1} />;
        })}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t+PH} stroke={vt.axis} strokeWidth={1} />

        {/* bars */}
        <AnimatePresence mode="wait">
          {sorted.map((feat, i) => {
            const barW = (feat[key] / maxV) * PW;
            const y    = PAD.t + i * rowH;
            const isHov = hovIdx === i;
            const isNoise = feat.name === "random_noise" || feat.name === "zip_code";
            const barColor = isNoise ? "#94a3b8" : color;
            return (
              <g key={`${feat.name}-${method}`}
                onMouseEnter={() => setHovIdx(i)}
                onMouseLeave={() => setHovIdx(null)}>
                {/* Feature label */}
                <text x={PAD.l - 8} y={y + rowH*0.62} textAnchor="end" fontSize={9}
                  fontWeight={isHov ? "700" : "400"}
                  fill={isNoise ? vt.textFaint : (isHov ? "var(--text-primary)" : vt.textMuted)}>
                  {feat.name}
                </text>
                {/* Bar */}
                <motion.g
                  key={`${feat.name}-${method}`}
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  transition={{ delay: i * 0.04 }}>
                  <rect
                    x={PAD.l}
                    y={y + rowH*0.1}
                    width={barW}
                    height={rowH * 0.8}
                    rx={3}
                    fill={barColor + (isHov ? "ee" : "99")}
                  />
                  {/* Value label */}
                  {barW > 30 && (
                    <text x={PAD.l + barW - 4} y={y + rowH*0.67}
                      textAnchor="end" fontSize={8}
                      fill={vt.isDark ? "white" : "rgba(0,0,0,0.75)"} fontWeight="bold">
                      {feat[key].toFixed(2)}
                    </text>
                  )}
                </motion.g>
                {/* Noise indicator */}
                {isNoise && (
                  <text x={PAD.l + barW + 4} y={y + rowH*0.67} fontSize={8} fill={vt.ink("#94a3b8")}>
                    {L.noiseTag}
                  </text>
                )}
              </g>
            );
          })}
        </AnimatePresence>

        {/* x-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <text key={f}
            x={PAD.l + f * PW} y={PAD.t + PH + 14}
            textAnchor="middle" fontSize={8} fill={vt.textMuted}>
            {(f * maxV).toFixed(2)}
          </text>
        ))}
        <text x={PAD.l + PW/2} y={H-4} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
          {L.axisLabel}
        </text>
      </svg>

      {/* insight */}
      <div className="px-5 py-3 border-t" style={{ borderColor:"var(--border)" }}>
        <p className="text-xs" style={{ color:vt.textMuted }}>
          {method === "permutation" ? L.insightPerm : L.insightImp}
        </p>
      </div>
    </div>
  );
}
