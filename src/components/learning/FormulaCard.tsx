"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { motion } from "framer-motion";
import type { KeyFormula } from "@/lib/learningContent";

interface Props {
  formulas: KeyFormula[];
  accentColor?: string;
}

function InlineFormula({ latex }: { latex: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          throwOnError: false,
          displayMode: false,
          trust: true,
        });
      } catch {
        if (ref.current) ref.current.textContent = latex;
      }
    }
  }, [latex]);
  // dir="ltr" forces KaTeX to always render left-to-right in Arabic locale
  return <div ref={ref} className="overflow-x-auto" dir="ltr" />;
}

export default function FormulaCard({ formulas, accentColor = "#6c63ff" }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
      {formulas.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            borderTop: `2px solid ${accentColor}`,
          }}
        >
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: accentColor }}
          >
            {f.name}
          </p>
          <div
            className="py-2 px-3 rounded-lg mb-2 overflow-x-auto"
            style={{ backgroundColor: `${accentColor}08` }}
          >
            <InlineFormula latex={f.latex} />
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {f.meaning}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
