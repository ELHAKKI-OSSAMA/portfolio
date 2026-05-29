"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Props {
  formula: string;
  label?: string;
  display?: boolean;
  accentColor?: string;
}

export default function MathBlock({ formula, label, display = true, accentColor = "#6c63ff" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(formula, ref.current, {
          throwOnError: false,
          displayMode: display,
          trust: true,
        });
      } catch {
        if (ref.current) ref.current.textContent = formula;
      }
    }
  }, [formula, display]);

  if (!display) {
    return <span ref={ref as React.RefObject<HTMLSpanElement>} className="katex-inline" />;
  }

  return (
    <div
      className="my-6 rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${accentColor}25` }}
    >
      {/* dir="ltr" forces KaTeX to always render left-to-right in Arabic locale */}
      <div
        className="px-6 py-5 overflow-x-auto"
        style={{ backgroundColor: `${accentColor}08` }}
        dir="ltr"
      >
        <div ref={ref} className="flex justify-center" />
      </div>
      {label && (
        <div
          className="px-6 py-2.5 text-xs text-center border-t"
          style={{
            borderColor: `${accentColor}20`,
            backgroundColor: `${accentColor}05`,
            color: "var(--text-muted)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
