import { getTranslations } from "next-intl/server";
import { BrainCircuit, BookOpen, Gamepad2, Layers, GraduationCap } from "lucide-react";

// `color` drives the decorative icon + tinted tile (vivid in every theme).
// `ink` is a theme-aware CSS var used for the number text so it clears WCAG AA
// contrast on the light (white) card surface while staying vivid in dark mode.
const stats = [
  { key: "projects",  value: "42+", icon: BrainCircuit,  color: "#6c63ff", ink: "var(--stat-violet)" },
  { key: "notebooks", value: "40+", icon: BookOpen,       color: "#00d4aa", ink: "var(--stat-teal)" },
  { key: "learning",  value: "34",  icon: GraduationCap,  color: "#f59e0b", ink: "var(--stat-amber)" },
  { key: "games",     value: "10",  icon: Gamepad2,       color: "#ff6b6b", ink: "var(--stat-red)" },
  { key: "domains",   value: "10+", icon: Layers,         color: "#8b5cf6", ink: "var(--stat-purple)" },
];

export default async function Stats() {
  const t = await getTranslations("stats");

  return (
    <section className="py-14 border-y" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="flex flex-col items-center text-center p-5 rounded-2xl border card-glow"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: stat.ink }}>
                {stat.value}
              </div>
              <div className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
                {t(stat.key as "projects" | "notebooks" | "learning" | "games" | "domains")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
