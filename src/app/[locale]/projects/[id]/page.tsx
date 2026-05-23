import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Database, TrendingUp, Layers, Target, Code2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { projects } from "@/lib/data";
import ProjectMarkdown from "@/components/ui/ProjectMarkdown";

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

  return {
    title: `${project.title} | Ossama Elhakki`,
    description: project.description,
    alternates: {
      canonical: `https://ismmax.com/${locale}/projects/${id}`,
    },
    openGraph: {
      title: `${project.title} | Ossama Elhakki`,
      description: project.description,
      type: "article",
    },
  };
}

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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  const accentColor = categoryColors[project.category[0]] || "#6c63ff";

  return (
    <div className="min-h-screen pt-24 pb-20 section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={15} />
          All Projects
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
                {categoryLabels[cat]}
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
                ⭐ Featured
              </span>
            )}
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {project.title}
          </h1>

          <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            {project.description}
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
                View on Kaggle
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
                View Code
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
                Dataset
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {project.dataset}
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
                Approach
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {project.approach}
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
              Tech Stack
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
            Keywords
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
              Deep Dive
            </div>
            <ProjectMarkdown content={project.longDescription} accentColor={accentColor} />
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-10 pt-6 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={14} />
            Back to Projects
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Hire Me
          </Link>
        </div>

      </div>
    </div>
  );
}
