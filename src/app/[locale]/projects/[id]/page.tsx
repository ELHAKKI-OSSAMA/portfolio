import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, ExternalLink, Database, TrendingUp, Layers, Target, Code2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { projects, SITE_URL, projectCategoryColors as categoryColors } from "@/lib/data";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { projectImages } from "@/lib/data/projects/images";
import ProjectMarkdown from "@/components/ui/ProjectMarkdown";
import ProjectImageGallery from "@/components/ui/ProjectImageGallery";
import { buildMetadata } from "@/lib/seo";
import RelatedLinks from "@/components/seo/RelatedLinks";

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return { title: "Project Not Found" };

  const title = locale === "fr" ? (project.titleFr ?? project.title) : locale === "ar" ? (project.titleAr ?? project.title) : project.title;
  const description = locale === "fr" ? (project.descriptionFr ?? project.description) : locale === "ar" ? (project.descriptionAr ?? project.description) : project.description;

  return buildMetadata({
    locale,
    path: `/projects/${id}`,
    title: `${title} | Ossama Elhakki`,
    description,
    type: "article",
    keywords: [...(project.tags ?? []), ...(project.techStack ?? [])].slice(0, 12),
  });
}


export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "projects" });
  const isRtl = locale === "ar";
  const accentColor = categoryColors[project.category[0]] || "#6c63ff";

  const title = locale === "fr" ? (project.titleFr ?? project.title) : locale === "ar" ? (project.titleAr ?? project.title) : project.title;
  const longDescription = locale === "fr" ? (project.longDescriptionFr ?? project.longDescription) : locale === "ar" ? (project.longDescriptionAr ?? project.longDescription) : project.longDescription;
  const description = locale === "fr" ? (project.descriptionFr ?? project.description) : locale === "ar" ? (project.descriptionAr ?? project.description) : project.description;
  const dataset = locale === "fr" ? (project.datasetFr ?? project.dataset) : locale === "ar" ? (project.datasetAr ?? project.dataset) : project.dataset;
  const approach = locale === "fr" ? (project.approachFr ?? project.approach) : locale === "ar" ? (project.approachAr ?? project.approach) : project.approach;

  // Related projects: most shared categories first. Internal links in the SSR
  // HTML help Google crawl and index deeper project pages.
  const related = projects
    .filter((p) => p.id !== id)
    .map((p) => ({ p, score: p.category.filter((c) => project.category.includes(c)).length }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => ({
      title: locale === "fr" ? (r.p.titleFr ?? r.p.title) : locale === "ar" ? (r.p.titleAr ?? r.p.title) : r.p.title,
      href: `/${locale}/projects/${r.p.id}`,
      subtitle: locale === "fr" ? (r.p.descriptionFr ?? r.p.description) : locale === "ar" ? (r.p.descriptionAr ?? r.p.description) : r.p.description,
    }));
  const relatedHeading =
    locale === "fr" ? "Projets similaires" : locale === "ar" ? "مشاريع ذات صلة" : "Related projects";

  return (
    <div className="min-h-screen pt-24 pb-20 section-padding">
      <BreadcrumbSchema
        items={[
          { name: locale === "fr" ? "Accueil" : locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
          { name: t("back_all"), url: `${SITE_URL}/${locale}/projects` },
          { name: title, url: `${SITE_URL}/${locale}/projects/${id}` },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}
        >
          {isRtl ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
          {t("back_all")}
        </Link>

        {/* Header */}
        <div
          className="rounded-2xl p-8 mb-8 border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            borderTop: `3px solid ${accentColor}`,
          }}
        >
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.category.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: `${categoryColors[cat]}20`,
                  color: categoryColors[cat],
                }}
              >
                {t(`cat_${cat}` as Parameters<typeof t>[0])}
              </span>
            ))}
            {project.featured && (
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--primary) 20%, transparent)",
                  color: "var(--primary)",
                }}
              >
                {t("featured_badge")}
              </span>
            )}
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h1>

          <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.kaggleUrl && (
              <a
                href={project.kaggleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                <ExternalLink size={14} />
                {t("view_kaggle")}
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              >
                <GithubIcon size={14} />
                {t("view_code")}
              </a>
            )}
          </div>
        </div>

        {/* Metrics grid */}
        {(project.results || project.dataset || project.metrics) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {project.results?.map((r) => (
              <div
                key={r.label}
                className="p-4 rounded-xl border text-center"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: accentColor }}
                >
                  {r.value}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Two-col info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Dataset */}
          {project.dataset && (
            <div
              className="p-5 rounded-xl border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div
                className="flex items-center gap-2 text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                <Database size={15} style={{ color: accentColor }} />
                {t("dataset")}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {dataset}
              </p>
            </div>
          )}

          {/* Approach */}
          {project.approach && (
            <div
              className="p-5 rounded-xl border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div
                className="flex items-center gap-2 text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                <Target size={15} style={{ color: accentColor }} />
                {t("approach")}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {approach}
              </p>
            </div>
          )}
        </div>

        {/* Tech stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div
            className="p-5 rounded-xl border mb-8"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div
              className="flex items-center gap-2 text-sm font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              <Code2 size={15} style={{ color: accentColor }} />
              {t("tech_stack")}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div
          className="p-5 rounded-xl border mb-8"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center gap-2 text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            <Layers size={15} style={{ color: "var(--text-muted)" }} />
            {t("keywords")}
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded text-xs"
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

        {/* Visualizations gallery */}
        {projectImages[project.id] && (
          <ProjectImageGallery
            images={projectImages[project.id]}
            projectTitle={project.title}
            accentColor={accentColor}
            visualizationsLabel={t("visualizations")}
            chartsLabel={t("charts")}
            moreChartsLabel={t("more_charts")}
          />
        )}

        {/* Long description / analysis */}
        {project.longDescription && (
          <div
            className="p-6 sm:p-8 rounded-2xl border"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div
              className="flex items-center gap-2 text-lg font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              <TrendingUp size={18} style={{ color: accentColor }} />
              {t("deep_dive")}
            </div>
            <ProjectMarkdown content={longDescription!} accentColor={accentColor} locale={locale} />
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-10 pt-6 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            {t("back")}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {t("hire_me")}
          </Link>
        </div>

      </div>
      <RelatedLinks heading={relatedHeading} items={related} />
    </div>
  );
}
