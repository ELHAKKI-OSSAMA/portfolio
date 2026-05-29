"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const FE_LABELS = {
  en: {
    title: "Feature Engineering Pipeline",
    stageLabel: (i: number, total: number) => `Stage ${i}/${total}`,
    prev: "← Prev",
    next: "Next →",
    stages: ["Raw Data", "Imputation", "Encoding", "Scaling", "Selection"] as readonly string[],
    stageDesc: [
      "4 features · 4 samples · null values present",
      "Median imputation for age/income; mode for city; mean for score",
      "city → 2 binary columns (Lyon, Paris); drop original",
      "StandardScaler: zero mean, unit variance for numeric columns",
      "SelectFromModel: keep age, income, score (importance > 0.1)",
    ] as readonly string[],
  },
  fr: {
    title: "Pipeline d'Ingénierie des Caractéristiques",
    stageLabel: (i: number, total: number) => `Étape ${i}/${total}`,
    prev: "← Préc",
    next: "Suiv →",
    stages: ["Données Brutes", "Imputation", "Encodage", "Normalisation", "Sélection"] as readonly string[],
    stageDesc: [
      "4 caractéristiques · 4 échantillons · valeurs nulles présentes",
      "Imputation médiane pour age/income ; mode pour city ; moyenne pour score",
      "city → 2 colonnes binaires (Lyon, Paris) ; supprimer l'original",
      "StandardScaler : moyenne nulle, variance unitaire pour les colonnes numériques",
      "SelectFromModel : garder age, income, score (importance > 0,1)",
    ] as readonly string[],
  },
  ar: {
    title: "خط أنابيب هندسة الميزات",
    stageLabel: (i: number, total: number) => `مرحلة ${i}/${total}`,
    prev: "→ السابق",
    next: "التالي ←",
    stages: ["بيانات خام", "إسناد القيم", "ترميز", "تطبيع", "اختيار"] as readonly string[],
    stageDesc: [
      "4 ميزات · 4 عينات · قيم فارغة موجودة",
      "إسناد وسيط للعمر/الدخل؛ الأكثر تكراراً للمدينة؛ المتوسط للنتيجة",
      "city → عمودان ثنائيان (Lyon, Paris)؛ حذف الأصلي",
      "StandardScaler: متوسط صفري، تباين وحدوي للأعمدة الرقمية",
      "SelectFromModel: الاحتفاظ بالعمر والدخل والنتيجة (الأهمية > 0.1)",
    ] as readonly string[],
  },
} as const;

// Mock table state at each stage
const TABLES = [
  // Stage 0: Raw Data
  {
    cols: ["age","income","city","score"],
    rows: [
      ["25","50000","Paris","null"],
      ["null","72000","Lyon","82"],
      ["34","null","Paris","91"],
      ["45","63000","null","75"],
    ],
    highlight: [] as number[],
  },
  // Stage 1: Imputation
  {
    cols: ["age","income","city","score"],
    rows: [
      ["25","50000","Paris","83↑"],
      ["34↑","72000","Lyon","82"],
      ["34","65500↑","Paris","91"],
      ["45","63000","Paris↑","75"],
    ],
    highlight: [0,1,2,3],
  },
  // Stage 2: One-hot Encoding
  {
    cols: ["age","income","city_Lyon","city_Paris","score"],
    rows: [
      ["25","50000","0","1","83"],
      ["34","72000","1","0","82"],
      ["34","65500","0","1","91"],
      ["45","63000","0","1","75"],
    ],
    highlight: [2,3],
  },
  // Stage 3: StandardScaler
  {
    cols: ["age","income","city_Lyon","city_Paris","score"],
    rows: [
      ["-1.31","-1.30","0","1","-0.85"],
      ["-0.10"," 1.11","1","0","-1.19"],
      ["-0.10"," 0.10","0","1"," 1.26"],
      [" 1.52"," 0.09","0","1"," 0.78"],
    ],
    highlight: [0,1],
  },
  // Stage 4: Feature Selection (drop low-importance)
  {
    cols: ["age","income","score"],
    rows: [
      ["-1.31","-1.30","-0.85"],
      ["-0.10"," 1.11","-1.19"],
      ["-0.10"," 0.10"," 1.26"],
      [" 1.52"," 0.09"," 0.78"],
    ],
    highlight: [0,1,2],
  },
];

const SKLEARN_CODE = [
  "# Raw input\nX = pd.read_csv('data.csv')",
  "from sklearn.impute import SimpleImputer\nimp = SimpleImputer(strategy='median')\nX_imp = imp.fit_transform(X)",
  "from sklearn.preprocessing import OneHotEncoder\nenc = OneHotEncoder(sparse_output=False)\nX_enc = enc.fit_transform(X[['city']])",
  "from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X_num)",
  "from sklearn.feature_selection import SelectFromModel\nsfm = SelectFromModel(RandomForestClassifier())\nX_sel = sfm.fit_transform(X_scaled, y)",
];

const STAGE_COLORS = ["#94a3b8","#f97316","#6c63ff","#06b6d4","#22c55e"];

export default function FeatureEngineeringViz({ accentColor = "#22c55e" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(FE_LABELS);
  const [stage, setStage] = useState(0);

  const table = TABLES[stage];
  const stageCol = STAGE_COLORS[stage];

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {L.title} — {L.stages[stage]}
        </span>
        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor:`${stageCol}22`, color:stageCol }}>
          {L.stageLabel(stage+1, L.stages.length)}
        </span>
      </div>

      {/* stage tabs */}
      <div className="flex gap-1 px-5 pt-3 pb-2">
        {L.stages.map((s, i) => (
          <button key={s} onClick={() => setStage(i)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: i <= stage ? `${STAGE_COLORS[i]}22` : vt.surface,
              color: i <= stage ? STAGE_COLORS[i] : vt.textFaint,
              border:`1px solid ${i === stage ? STAGE_COLORS[i]+"55" : i < stage ? STAGE_COLORS[i]+"30" : "var(--border)"}`,
            }}>
            {i < stage ? "✓ " : ""}{s}
          </button>
        ))}
      </div>

      {/* table + code */}
      <div className="px-5 pb-3">
        <AnimatePresence mode="wait">
          <motion.div key={stage}
            initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            transition={{ duration:0.2 }}>

            {/* description */}
            <div className="text-xs mb-2 px-1" style={{ color:vt.textMuted }}>
              {L.stageDesc[stage]}
            </div>

            {/* data table */}
            <div className="overflow-auto rounded-lg border mb-3" style={{ borderColor:"var(--border)" }}>
              <table className="text-xs font-mono w-full">
                <thead>
                  <tr style={{ backgroundColor:vt.surface }}>
                    <th className="px-2 py-1 text-left" style={{ color:vt.textFaint }}>#</th>
                    {table.cols.map((c, ci) => (
                      <th key={ci} className="px-3 py-1 text-left font-semibold"
                        style={{ color: table.highlight.includes(ci) ? stageCol : "var(--text-primary)" }}>
                        {c}
                        {table.highlight.includes(ci) && <span className="ml-1 text-xs">↑</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, ri) => (
                    <tr key={ri} style={{ borderTop:`1px solid var(--border)` }}>
                      <td className="px-2 py-1" style={{ color:vt.textFaint }}>{ri}</td>
                      {row.map((cell, ci) => {
                        const isChanged = table.highlight.includes(ci);
                        const isNull = cell === "null";
                        return (
                          <td key={ci} className="px-3 py-1"
                            style={{
                              color: isNull ? "#ef444490" : isChanged ? stageCol : "var(--text-primary)",
                              fontStyle: isNull ? "italic" : "normal",
                              backgroundColor: isChanged && !isNull ? `${stageCol}10` : "transparent",
                            }}>
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* sklearn code snippet */}
            <div className="rounded-lg p-3 text-xs font-mono whitespace-pre-wrap"
              style={{ backgroundColor:vt.surface, color:vt.textMuted, border:`1px solid var(--border)` }}>
              <span style={{ color:stageCol }}>{SKLEARN_CODE[stage]}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor:"var(--border)" }}>
        <button onClick={() => setStage(s => Math.max(0, s-1))} disabled={stage===0}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor:stage>0?`${accentColor}22`:"var(--bg-card)", color:stage>0?accentColor:vt.textMuted, border:`1px solid ${stage>0?accentColor+"50":"var(--border)"}` }}>
          {L.prev}
        </button>
        <div className="flex gap-0.5">
          {L.stages.map((_, i) => (
            <div key={i} className="w-6 h-1 rounded-full transition-colors duration-200"
              style={{ backgroundColor: i <= stage ? STAGE_COLORS[i] : vt.surface }} />
          ))}
        </div>
        <button onClick={() => setStage(s => Math.min(L.stages.length-1, s+1))} disabled={stage===L.stages.length-1}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ backgroundColor:stage<L.stages.length-1?`${accentColor}22`:"var(--bg-card)", color:stage<L.stages.length-1?accentColor:vt.textMuted, border:`1px solid ${stage<L.stages.length-1?accentColor+"50":"var(--border)"}` }}>
          {L.next}
        </button>
      </div>
    </div>
  );
}
