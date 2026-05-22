"use client";

import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, Info, Zap } from "lucide-react";

type Variant = "insight" | "warning" | "info" | "key";

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  accentColor?: string;
}

const config: Record<Variant, { icon: React.ElementType; bg: string; border: string; iconColor: string }> = {
  insight: { icon: Lightbulb, bg: "#f59e0b", border: "#f59e0b", iconColor: "#f59e0b" },
  warning: { icon: AlertTriangle, bg: "#ff6b6b", border: "#ff6b6b", iconColor: "#ff6b6b" },
  info:    { icon: Info, bg: "#06b6d4", border: "#06b6d4", iconColor: "#06b6d4" },
  key:     { icon: Zap, bg: "#6c63ff", border: "#6c63ff", iconColor: "#6c63ff" },
};

export default function InsightBox({ children, variant = "insight", accentColor }: Props) {
  const c = config[variant];
  const color = accentColor || c.iconColor;
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="my-6 flex gap-4 p-4 rounded-2xl"
      style={{
        backgroundColor: `${color}10`,
        border: `1px solid ${color}30`,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {children}
      </p>
    </motion.div>
  );
}
