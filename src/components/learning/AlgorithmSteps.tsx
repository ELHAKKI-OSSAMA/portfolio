"use client";

import { motion } from "framer-motion";

interface Props {
  steps: string[];
  accentColor?: string;
}

export default function AlgorithmSteps({ steps, accentColor = "#6c63ff" }: Props) {
  return (
    <div className="my-6 space-y-2">
      {steps.map((step, i) => {
        const isIndented = step.startsWith("  ");
        const text = step.trim();
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`flex items-start gap-3 ${isIndented ? "ml-8" : ""}`}
          >
            <div
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
              style={{
                backgroundColor: isIndented ? `${accentColor}60` : accentColor,
                fontSize: "10px",
              }}
            >
              {isIndented ? "→" : i + 1}
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: isIndented ? "var(--text-muted)" : "var(--text-secondary)",
                fontFamily: text.includes("←") || text.includes("∈") || text.includes("∑") ? "monospace" : "inherit",
              }}
            >
              {text}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
