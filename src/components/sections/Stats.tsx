"use client";

import { useTranslations } from "next-intl";
import { BrainCircuit, BookOpen, Bot, Layers } from "lucide-react";

const stats = [
  { key: "projects", value: "35+", icon: BrainCircuit, color: "#6c63ff" },
  { key: "notebooks", value: "35+", icon: BookOpen, color: "#00d4aa" },
  { key: "workflows", value: "8", icon: Bot, color: "#ff6b6b" },
  { key: "domains", value: "10+", icon: Layers, color: "#f59e0b" },
];

export default function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="py-16 border-y" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="flex flex-col items-center text-center p-6 rounded-2xl border transition-all group card-glow"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {t(stat.key as "projects" | "notebooks" | "workflows" | "domains")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
