"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight, TrendingUp, ChevronRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { projects } from "@/lib/data";
import { projectImages } from "@/lib/data/projects/images";

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
  deployment: "#f97316",
};

const categoryLabels: Record<string, string> = {
  fraud: "Fraud Detection",
  cv: "Computer Vision",
  nlp: "NLP",
  medical: "Medical AI",
  timeseries: "Time Series",
  genai: "Generative AI",
  agents: "AI Agents",
  rl: "Reinforcement Learning",
  backend: "Backend",
  deployment: "Deployment",
};

export default function FeaturedProjects() {
  const t = useTranslations("featured");
  const locale = useLocale();
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  const getTitle = (p: typeof projects[0]) =>
    locale === "fr" ? (p.titleFr ?? p.title) : locale === "ar" ? (p.titleAr ?? p.title) : p.title;
  const getDesc = (p: typeof projects[0]) =>
    locale === "fr" ? (p.descriptionFr ?? p.description) : locale === "ar" ? (p.descriptionAr ?? p.description) : p.description;

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {t("title")}
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featured.map((project) => {
            const accentColor = categoryColors[project.category[0]] || "#6c63ff";
            const previewImg = projectImages[project.id]?.[0]?.src;
            return (
            <div
              key={project.id}
              className="group relative flex flex-col rounded-2xl overflow-hidden border card-glow"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              {previewImg ? (
                <div className="relative h-40 overflow-hidden" style={{ backgroundColor: "var(--bg-main)" }}>
                  <Image
                    src={previewImg}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-70 transition-opacity group-hover:opacity-85"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, transparent 30%, var(--bg-card) 100%)" }}
                  />
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
                  />
                </div>
              ) : (
                <div
                  className="h-1 w-full"
                  style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
                />
              )}

              <div className="flex-1 p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.category.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: `${categoryColors[cat]}20`,
                        color: categoryColors[cat],
                      }}
                    >
                      {categoryLabels[cat]}
                    </span>
                  ))}
                </div>

                <h3
                  className="font-semibold text-lg mb-2 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {getTitle(project)}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  {getDesc(project)}
                </p>

                {project.metrics && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <TrendingUp size={14} style={{ color: "var(--secondary)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--secondary)" }}>
                      {project.metrics}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="px-6 py-4 border-t flex items-center gap-3"
                style={{ borderColor: "var(--border)" }}
              >
                <Link
                  href={`/${locale}/projects/${project.id}`}
                  className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--primary)" }}
                >
                  <ChevronRight size={12} />
                  {t("details")}
                </Link>
                {project.kaggleUrl && (
                  <a
                    href={project.kaggleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <ExternalLink size={13} />
                    {t("view_project")}
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <GithubIcon size={13} />
                    {t("view_code")}
                  </a>
                )}
              </div>
            </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-medium transition-all group"
            style={{
              borderColor: "var(--border-strong)",
              color: "var(--text-primary)",
            }}
          >
            {t("view_all")}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
