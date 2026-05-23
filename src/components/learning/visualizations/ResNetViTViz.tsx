"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import ResNetTab from './resnetVit/ResNetTab';
import ViTTab from './resnetVit/ViTTab';
import { RESNET_STEPS, VIT_STEPS } from './resnetVit/helpers';

export default function ResNetViTViz({ accentColor = "#f97316" }: { accentColor?: string }) {
  const [tab, setTab] = useState<"resnet" | "vit">("resnet");
  const [step, setStep] = useState(0);
  const vt = useVizTheme();

  const maxSteps  = tab === "resnet" ? RESNET_STEPS.length : VIT_STEPS.length;
  const stepLabels = tab === "resnet" ? RESNET_STEPS : VIT_STEPS;

  function handleTabChange(newTab: "resnet" | "vit") {
    setTab(newTab);
    setStep(0);
  }

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
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
              {t === "resnet" ? "ResNet Block" : "ViT Patches"}
            </button>
          ))}
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Step {step + 1}/{maxSteps}: {stepLabels[step]}
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
            ← Back
          </button>
          <button disabled={step >= maxSteps - 1} onClick={() => setStep(s => Math.min(maxSteps - 1, s + 1))}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: step < maxSteps - 1 ? `${accentColor}25` : "var(--bg-card)",
              color: step < maxSteps - 1 ? accentColor : "var(--text-muted)",
              border: `1px solid ${step < maxSteps - 1 ? accentColor + "50" : "var(--border)"}`,
            }}>
            Forward →
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
          { label: "Architecture", value: "ResNet Block", color: accentColor },
          { label: "Skip path",    value: step >= 4 ? "Active" : "Waiting", color: step >= 4 ? "#f59e0b" : "var(--text-muted)" as string },
          { label: "Residual",     value: "F(x) + x", color: "#22c55e" },
        ] : [
          { label: "Architecture", value: "ViT",                              color: accentColor },
          { label: "Patches",      value: "16 (2×2)",                         color: "#6c63ff" },
          { label: "Tokens",       value: step >= 3 ? "17 (CLS+16)" : "16",   color: "#22c55e" },
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
    </div>
  );
}
