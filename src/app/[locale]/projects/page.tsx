"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, TrendingUp, Filter, ArrowRight, ArrowLeft, Search, X } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { projects, type ProjectCategory } from "@/lib/data";
import { projectImages } from "@/lib/data/projects/images";
import HireCTA from "@/components/sections/HireCTA";
import { accentInk } from "@/lib/a11yColor";
import { projectCategoryColors as categoryColors } from "@/lib/data";

const filters: Array<{ key: string; cat: ProjectCategory | "all" }> = [
  { key: "filter_all",        cat: "all"        },
  { key: "filter_fraud",      cat: "fraud"      },
  { key: "filter_cv",         cat: "cv"         },
  { key: "filter_nlp",        cat: "nlp"        },
  { key: "filter_medical",    cat: "medical"    },
  { key: "filter_timeseries", cat: "timeseries" },
  { key: "filter_genai",      cat: "genai"      },
  { key: "filter_agents",     cat: "agents"     },
  { key: "filter_rl",         cat: "rl"         },
  { key: "filter_backend",    cat: "backend"    },
  { key: "filter_deployment", cat: "deployment" },
];

function matchesSearch(project: typeof projects[0], query: string) {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    project.title.toLowerCase().includes(q) ||
    (project.titleFr ?? "").toLowerCase().includes(q) ||
    (project.titleAr ?? "").includes(query) ||           // Arabic: don't lowercase
    project.description.toLowerCase().includes(q) ||
    (project.descriptionFr ?? "").toLowerCase().includes(q) ||
    (project.descriptionAr ?? "").includes(query) ||
    project.tags.some((t) => t.toLowerCase().includes(q)) ||
    project.category.some((c) => c.toLowerCase().includes(q))
  );
}

function loc<T extends string | undefined>(locale: string, en: T, fr: T, ar: T): T {
  if (locale === "fr" && fr) return fr;
  if (locale === "ar" && ar) return ar;
  return en;
}

export default function ProjectsPage() {
  const t  = useTranslations("projects");
  const tf = useTranslations("featured");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [active, setActive] = useState<ProjectCategory | "all">("all");
  const [search, setSearch]   = useState("");

  const filtered = projects.filter((p) => {
    const catMatch = active === "all" || p.category.includes(active as ProjectCategory);
    return catMatch && matchesSearch(p, search);
  });

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

        {/* Search — uses logical CSS so icon/button flip in RTL automatically */}
        <div className="relative mb-6 max-w-xl">
          <Search
            size={15}
            className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-9 pe-9 py-2.5 rounded-xl text-sm border outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute end-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Clear search"
            >
              <X size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
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
                      color: "var(--filter-btn-text, var(--text-secondary))",
                    }
              }
            >
              {t(f.key as keyof typeof t)}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          {search
            ? t("count_search", { count: filtered.length, plural: filtered.length !== 1 ? "s" : "", query: search })
            : active !== "all"
            ? t("count_in", { count: filtered.length, plural: filtered.length !== 1 ? "s" : "", cat: active })
            : t("count_total", { count: filtered.length, plural: filtered.length !== 1 ? "s" : "" })}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
            <p className="text-lg mb-2">{t("no_results")}</p>
            <button onClick={() => { setSearch(""); setActive("all"); }} className="text-sm underline">
              {t("clear_filters")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => {
              const accentColor = categoryColors[project.category[0]] || "#6c63ff";
              const previewImg  = projectImages[project.id]?.[0]?.src;
              const title       = loc(locale, project.title,       project.titleFr,       project.titleAr);
              const description = loc(locale, project.description, project.descriptionFr, project.descriptionAr);

              return (
                <div
                  key={project.id}
                  className="group flex flex-col rounded-2xl overflow-hidden transition-all card-glow"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  {/* Preview image or accent line */}
                  {previewImg ? (
                    <div className="relative h-36 overflow-hidden" style={{ backgroundColor: "var(--bg-main)" }}>
                      <Image
                        src={previewImg}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover opacity-75 transition-opacity group-hover:opacity-90"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(to bottom, transparent 40%, var(--bg-card) 100%)" }}
                      />
                      {project.featured && (
                        <span
                          className="absolute top-2 end-2 px-2 py-0.5 rounded-md text-[10px] font-semibold"
                          style={{ backgroundColor: "color-mix(in srgb, var(--primary) 20%, transparent)", color: "var(--primary)" }}
                        >
                          {t("featured_badge")}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      className="h-0.5 w-full"
                      style={{ background: `linear-gradient(${isRtl ? "to left" : "to right"}, ${accentColor}, transparent)` }}
                    />
                  )}

                  <div className="flex-1 p-5">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.category.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 rounded-md text-xs font-medium acc-ink"
                          style={{ backgroundColor: `${categoryColors[cat]}15`, ["--acc" as string]: categoryColors[cat], ["--acc-ink" as string]: accentInk(categoryColors[cat]) }}
                        >
                          {t(`cat_${cat}` as Parameters<typeof t>[0])}
                        </span>
                      ))}
                      {!previewImg && project.featured && (
                        <span
                          className="px-2 py-0.5 rounded-md text-xs font-medium"
                          style={{ backgroundColor: "color-mix(in srgb, var(--primary) 20%, transparent)", color: "var(--primary)" }}
                        >
                          {t("featured_badge")}
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-semibold mb-2 group-hover:text-[#6c63ff] transition-colors"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
                      {description}
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
                          style={{ backgroundColor: "var(--tag-bg)", color: "var(--tag-color)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="px-5 py-3 flex items-center gap-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <Link
                      href={`/${locale}/projects/${project.id}`}
                      className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                      style={{ color: "var(--primary)" }}
                    >
                      {isRtl ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                      {t("details")}
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
                    {projectImages[project.id] && (
                      <span className="ms-auto text-[10px]" style={{ color: "var(--text-faint, var(--text-muted))" }}>
                        {projectImages[project.id].length} {t("charts")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <HireCTA locale={locale} />
    </div>
  );
}
