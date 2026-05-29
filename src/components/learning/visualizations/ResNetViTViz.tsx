"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";
import ResNetTab from './resnetVit/ResNetTab';
import ViTTab from './resnetVit/ViTTab';

const RVV_LABELS = {
  en: {
    tabResNet: "ResNet Block",
    tabViT: "ViT Patches",
    stepOf: (i: number, total: number, name: string) => `Step ${i}/${total}: ${name}`,
    back: "← Back",
    forward: "Forward →",
    resnetSteps: ["Input FM", "Conv 3×3", "BN + ReLU", "Conv 3×3 + BN", "F(x) + x → ReLU", "Output FM"] as readonly string[],
    vitSteps: ["Image input", "Extract patches", "Project patches", "Add [CLS] + pos", "Transformer ×L", "MLP head → class"] as readonly string[],
    statArchitecture: "Architecture",
    statSkipPath: "Skip path",
    statResidual: "Residual",
    statActive: "Active",
    statWaiting: "Waiting",
    statFx: "F(x) + x",
    statPatches: "16 (2×2)",
    statTokens17: "17 (CLS+16)",
    statTokens16: "16",
  },
  fr: {
    tabResNet: "Bloc ResNet",
    tabViT: "Patches ViT",
    stepOf: (i: number, total: number, name: string) => `Étape ${i}/${total} : ${name}`,
    back: "← Retour",
    forward: "Suivant →",
    resnetSteps: ["FM d'entrée", "Conv 3×3", "BN + ReLU", "Conv 3×3 + BN", "F(x) + x → ReLU", "FM de sortie"] as readonly string[],
    vitSteps: ["Image d'entrée", "Extraire patches", "Projeter patches", "Ajouter [CLS] + pos", "Transformer ×L", "Tête MLP → classe"] as readonly string[],
    statArchitecture: "Architecture",
    statSkipPath: "Connexion résiduelle",
    statResidual: "Résidu",
    statActive: "Active",
    statWaiting: "En attente",
    statFx: "F(x) + x",
    statPatches: "16 (2×2)",
    statTokens17: "17 (CLS+16)",
    statTokens16: "16",
  },
  ar: {
    tabResNet: "كتلة ResNet",
    tabViT: "رقع ViT",
    stepOf: (i: number, total: number, name: string) => `خطوة ${i}/${total}: ${name}`,
    back: "→ رجوع",
    forward: "التالي ←",
    resnetSteps: ["FM مدخل", "Conv 3×3", "BN + ReLU", "Conv 3×3 + BN", "F(x) + x → ReLU", "FM مخرج"] as readonly string[],
    vitSteps: ["صورة مدخل", "استخراج رقع", "إسقاط رقع", "إضافة [CLS] + موضع", "Transformer ×L", "رأس MLP → صنف"] as readonly string[],
    statArchitecture: "البنية",
    statSkipPath: "مسار التخطي",
    statResidual: "البقايا",
    statActive: "نشط",
    statWaiting: "انتظار",
    statFx: "F(x) + x",
    statPatches: "16 (2×2)",
    statTokens17: "17 (CLS+16)",
    statTokens16: "16",
  },
} as const;

export default function ResNetViTViz({ accentColor = "#f97316" }: { accentColor?: string }) {
  const [tab, setTab] = useState<"resnet" | "vit">("resnet");
  const [step, setStep] = useState(0);
  const vt = useVizTheme();
  const L = useVizLocale(RVV_LABELS);

  const maxSteps  = tab === "resnet" ? L.resnetSteps.length : L.vitSteps.length;
  const stepLabels = tab === "resnet" ? L.resnetSteps : L.vitSteps;

  function handleTabChange(newTab: "resnet" | "vit") {
    setTab(newTab);
    setStep(0);
  }

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          {(["resnet", "vit"] as const).map(t => (
            <button key={t} onClick={() => handleTabChange(t)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: tab === t ? `${accentColor}25` : "transparent",
                color: tab === t ? accentColor : "var(--text-muted)",
                border: `1px solid ${tab === t ? accentColor + "50" : "var(--border)"}`,
              }}>
              {t === "resnet" ? L.tabResNet : L.tabViT}
            </button>
          ))}
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {L.stepOf(step + 1, maxSteps, stepLabels[step])}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button disabled={step === 0} onClick={() => setStep(s => s - 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: step > 0 ? `${accentColor}25` : "var(--bg-card)",
              color: step > 0 ? accentColor : "var(--text-muted)",
              border: `1px solid ${step > 0 ? accentColor + "50" : "var(--border)"}`,
            }}>
            {L.back}
          </button>
          <button disabled={step >= maxSteps - 1} onClick={() => setStep(s => Math.min(maxSteps - 1, s + 1))}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: step < maxSteps - 1 ? `${accentColor}25` : "var(--bg-card)",
              color: step < maxSteps - 1 ? accentColor : "var(--text-muted)",
              border: `1px solid ${step < maxSteps - 1 ? accentColor + "50" : "var(--border)"}`,
            }}>
            {L.forward}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "resnet" ? (
          <motion.div key="resnet" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            <ResNetTab step={step} accentColor={accentColor} vt={vt} />
          </motion.div>
        ) : (
          <motion.div key="vit" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <ViTTab step={step} accentColor={accentColor} vt={vt} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 py-2 border-t" style={{ borderColor: "var(--border)" }}>
        {stepLabels.map((label, i) => (
          <button key={i} onClick={() => setStep(i)} title={label}
            className="rounded-full transition-all"
            style={{
              width: i === step ? 20 : 8, height: 8,
              backgroundColor: i === step ? accentColor : i < step ? accentColor + "60" : "var(--border)",
            }}
          />
        ))}
      </div>

      {/* Stats footer */}
      {(() => {
        const statItems = tab === "resnet" ? [
          { label: L.statArchitecture, value: L.tabResNet, color: accentColor },
          { label: L.statSkipPath,     value: step >= 4 ? L.statActive : L.statWaiting, color: step >= 4 ? "#f59e0b" : "var(--text-muted)" as string },
          { label: L.statResidual,     value: L.statFx, color: "#22c55e" },
        ] : [
          { label: L.statArchitecture, value: "ViT",                                     color: accentColor },
          { label: L.statSkipPath,     value: L.statPatches,                             color: "#6c63ff" },
          { label: L.statResidual,     value: step >= 3 ? L.statTokens17 : L.statTokens16, color: "#22c55e" },
        ];
        return (
          <div className="grid grid-cols-3 border-t text-center" style={{ borderColor: "var(--border)" }}>
            {statItems.map(({ label, value, color }) => (
              <div key={label} className="py-3">
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
                <div className="text-sm font-bold font-mono" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        );
      })()}
    </VizCard>
  );
}
