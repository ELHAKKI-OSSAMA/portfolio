"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Image, Tag, Clock, ChevronRight, Zap } from "lucide-react";
import { learningTopics } from "@/lib/data";

const categoryColors: Record<string, string> = {
  regression: "#6c63ff",
  classification: "#00d4aa",
  ensemble: "#f59e0b",
  evaluation: "#ff6b6b",
};

const categoryEmojis: Record<string, string> = {
  regression: "📈",
  classification: "🏷️",
  ensemble: "🌲",
  evaluation: "📊",
};

type Category = "all" | "regression" | "classification" | "ensemble" | "evaluation";

const filterKeys: Array<{ key: string; cat: Category }> = [
  { key: "all", cat: "all" },
  { key: "regression", cat: "regression" },
  { key: "classification", cat: "classification" },
  { key: "ensemble", cat: "ensemble" },
  { key: "evaluation", cat: "evaluation" },
];

const difficultyColors = { beginner: "#10b981", intermediate: "#f59e0b", advanced: "#ff6b6b" };

export default function LearningClient() {
  const t = useTranslations("learning");
  const locale = useLocale();
  const [active, setActive] = useState<Category>("all");

  const filtered =
    active === "all"
      ? learningTopics
      : learningTopics.filter((topic) => topic.category === active);

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6c63ff]/30 bg-[#6c63ff]/10 text-[#6c63ff] text-sm font-medium mb-6">
            <BookOpen size={14} />
            ML Visual Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {t("title")}
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 justify-center mb-10">
          {filterKeys.map((f) => (
            <button
              key={f.cat}
              onClick={() => setActive(f.cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                active === f.cat
                  ? { backgroundColor: "var(--primary)", color: "#ffffff" }
                  : {
                      backgroundColor: "var(--filter-btn-bg)",
                      border: "1px solid var(--filter-btn-border)",
                      color: "var(--text-secondary)",
                    }
              }
            >
              {f.cat !== "all" && (
                <span className="mr-1.5">{categoryEmojis[f.cat]}</span>
              )}
              {t(f.key as keyof typeof t)}
            </button>
          ))}
        </div>

        {/* Topic cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((topic) => (
            <div
              key={topic.id}
              className="group flex flex-col rounded-2xl overflow-hidden card-glow transition-all"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Top bar */}
              <div
                className="h-1"
                style={{ backgroundColor: categoryColors[topic.category] || "#6c63ff" }}
              />

              {/* Diagram preview placeholder */}
              <div
                className="mx-5 mt-5 rounded-xl h-40 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: `${categoryColors[topic.category] || "#6c63ff"}10` }}
              >
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="relative text-center">
                  <div className="text-4xl mb-2">{categoryEmojis[topic.category]}</div>
                  <div
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Image size={12} />
                    {topic.diagrams} diagram{topic.diagrams !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="flex-1 p-5">
                {/* Badges row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: `${categoryColors[topic.category]}20`,
                      color: categoryColors[topic.category],
                    }}
                  >
                    {topic.category}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: `${difficultyColors[topic.difficulty]}15`,
                      color: difficultyColors[topic.difficulty],
                    }}
                  >
                    {topic.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Clock size={10} />
                    {topic.estimatedTime}
                  </span>
                </div>

                <h3
                  className="font-semibold text-lg mb-2 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {topic.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  {topic.description}
                </p>

                {/* Concepts */}
                <div className="flex flex-wrap gap-1.5">
                  {topic.concepts.slice(0, 5).map((concept) => (
                    <span
                      key={concept}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs rounded"
                      style={{
                        backgroundColor: "var(--tag-bg)",
                        color: "var(--tag-color)",
                      }}
                    >
                      <Tag size={9} />
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card footer with link */}
              <div
                className="px-5 py-3 flex items-center justify-between border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Image size={11} />
                  {topic.diagrams} diagrams
                </div>
                <Link
                  href={`/${locale}/learning/${topic.id}`}
                  className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: categoryColors[topic.category] }}
                >
                  <Zap size={11} />
                  Deep Dive
                  <ChevronRight size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon banner */}
        <div
          className="text-center py-10 rounded-2xl border border-dashed"
          style={{ borderColor: "var(--border-strong)" }}
        >
          <div className="text-3xl mb-3">🚀</div>
          <p style={{ color: "var(--text-muted)" }}>{t("coming_soon")}</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Neural Networks • Transformers • Diffusion Models • RL
          </p>
        </div>
      </div>
    </div>
  );
}
