"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { ExternalLink, TrendingUp, Filter, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { projects, type ProjectCategory } from "@/lib/data";

const categoryColors: Record<string, string> = {
  fraud: "#ff6b6b",
  cv: "#6c63ff",
  nlp: "#00d4aa",
  medical: "#f59e0b",
  timeseries: "#8b5cf6",
  genai: "#ec4899",
  agents: "#06b6d4",
  rl: "#10b981",
  backend: "#64748b",
};

const filters: Array<{ key: string; cat: ProjectCategory | "all" }> = [
  { key: "filter_all", cat: "all" },
  { key: "filter_fraud", cat: "fraud" },
  { key: "filter_cv", cat: "cv" },
  { key: "filter_nlp", cat: "nlp" },
  { key: "filter_medical", cat: "medical" },
  { key: "filter_timeseries", cat: "timeseries" },
  { key: "filter_genai", cat: "genai" },
  { key: "filter_agents", cat: "agents" },
  { key: "filter_rl", cat: "rl" },
  { key: "filter_backend", cat: "backend" },
];

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const tf = useTranslations("featured");
  const locale = useLocale();
  const [active, setActive] = useState<ProjectCategory | "all">("all");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.category.includes(active as ProjectCategory));

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {t("title")}
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter size={16} className="shrink-0" style={{ color: "var(--text-muted)" }} />
          {filters.map((f) => (
            <button
              key={f.cat}
              onClick={() => setActive(f.cat)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
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
              {t(f.key as keyof typeof t)}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}{" "}
          {active !== "all" ? `in ${active}` : "total"}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col rounded-2xl overflow-hidden transition-all card-glow"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Top accent */}
              <div
                className="h-0.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${categoryColors[project.category[0]] || "#6c63ff"}, transparent)`,
                }}
              />

              <div className="flex-1 p-5">
                {/* Categories */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.category.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: `${categoryColors[cat]}15`,
                        color: categoryColors[cat],
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                  {project.featured && (
                    <span
                      className="px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--primary) 20%, transparent)",
                        color: "var(--primary)",
                      }}
                    >
                      Featured
                    </span>
                  )}
                </div>

                <h3
                  className="font-semibold mb-2 group-hover:text-[#6c63ff] transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
                  {project.description}
                </p>

                {project.metrics && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <TrendingUp size={13} style={{ color: "var(--secondary)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--secondary)" }}>
                      {project.metrics}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded"
                      style={{
                        backgroundColor: "var(--tag-bg)",
                        color: "var(--tag-color)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div
                className="px-5 py-3 flex items-center gap-3"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <Link
                  href={`/${locale}/projects/${project.id}`}
                  className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--primary)" }}
                >
                  <ArrowRight size={12} />
                  Details
                </Link>
                {project.kaggleUrl && (
                  <a
                    href={project.kaggleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <ExternalLink size={12} />
                    {tf("view_project")}
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <GithubIcon size={12} />
                    {tf("view_code")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
