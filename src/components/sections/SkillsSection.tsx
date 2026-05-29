"use client";

import { useTranslations } from "next-intl";
import { skillGroups } from "@/lib/data";

export default function SkillsSection() {
  const t = useTranslations("skills");

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: "color-mix(in srgb, var(--bg-card) 50%, transparent)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {t("title")}
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillGroups.map((group) => (
            <div
              key={group.key}
              className="p-5 rounded-2xl border transition-all group"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {t(group.key as keyof typeof t)}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs rounded-lg transition-colors"
                    style={{
                      backgroundColor: `${group.color}18`,
                      color: group.color,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
