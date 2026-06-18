import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BarChart2, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { learningTopics, learningCategoryColors as categoryColors } from "@/lib/data";
import { topicContents } from "@/lib/learningContent";
import TopicDetailClient from "./TopicDetailClient";
import { buildMetadata } from "@/lib/seo";
import { LearningResourceSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";
import HireCTA from "@/components/sections/HireCTA";
import { SITE_URL } from "@/lib/data";

export async function generateStaticParams() {
  return learningTopics.map(t => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const topic = learningTopics.find(t => t.id === id);
  if (!topic) return { title: "Not Found" };
  const content = topicContents[id];

  return buildMetadata({
    locale,
    path: `/learning/${id}`,
    title: `${topic.title} | ML Learning Hub`,
    description:
      content?.tagline ??
      `${topic.description} — ${topic.diagrams} diagrams, math derivations, and runnable Python examples.`,
    keywords: topic.concepts,
    type: "article",
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "learning" });
  const topic = learningTopics.find(t => t.id === id);
  if (!topic) notFound();

  const content = topicContents[id];
  const color = content?.accentColor || categoryColors[topic.category] || "#6c63ff";
  const topics = learningTopics;
  const currentIdx = topics.findIndex(tp => tp.id === id);
  const prevTopic = currentIdx > 0 ? topics[currentIdx - 1] : null;
  const nextTopic = currentIdx < topics.length - 1 ? topics[currentIdx + 1] : null;

  // Locale-aware helpers
  const topicTitle = (tp: typeof topic) =>
    locale === "fr" && tp.titleFr ? tp.titleFr
    : locale === "ar" && tp.titleAr ? tp.titleAr
    : tp.title;

  const topicDesc = (tp: typeof topic) =>
    locale === "fr" && tp.descriptionFr ? tp.descriptionFr
    : locale === "ar" && tp.descriptionAr ? tp.descriptionAr
    : tp.description;

  // RTL: flip directional arrows in Arabic
  const isRtl = locale === "ar";
  const BackIcon    = isRtl ? ChevronRight : ArrowLeft;
  const PrevIcon    = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon    = isRtl ? ChevronLeft  : ChevronRight;
  const prereqArrow = isRtl ? "←" : "→";

  const difficultyColors = {
    beginner: "#10b981",
    intermediate: "#f59e0b",
    advanced: "#ff6b6b",
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <LearningResourceSchema
        name={topicTitle(topic)}
        description={topicDesc(topic)}
        url={`${SITE_URL}/${locale}/learning/${id}`}
      />
      <BreadcrumbSchema
        items={[
          { name: locale === "fr" ? "Accueil" : locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
          { name: t("title"), url: `${SITE_URL}/${locale}/learning` },
          { name: topicTitle(topic), url: `${SITE_URL}/${locale}/learning/${id}` },
        ]}
      />
      {/* Hero */}
      <div
        className="relative overflow-hidden mb-0"
        style={{
          background: `linear-gradient(135deg, ${color}18 0%, transparent 60%)`,
          borderBottom: `1px solid ${color}20`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href={`/${locale}/learning`}
            className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            <BackIcon size={14} />
            ML Learning Hub
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {/* Category translated via learning namespace key */}
              {t(topic.category as Parameters<typeof t>[0])}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${difficultyColors[topic.difficulty]}15`,
                color: difficultyColors[topic.difficulty],
              }}
            >
              {t(`difficulty_${topic.difficulty}` as Parameters<typeof t>[0])}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {topicTitle(topic)}
          </h1>

          {content && (
            <p
              className="text-lg sm:text-xl italic mb-6 max-w-3xl"
              style={{ color, opacity: 0.9 }}
            >
              &ldquo;{
                locale === "fr" && content.taglineFr ? content.taglineFr
                : locale === "ar" && content.taglineAr ? content.taglineAr
                : content.tagline
              }&rdquo;
            </p>
          )}

          <p className="max-w-3xl mb-6" style={{ color: "var(--text-secondary)" }}>
            {topicDesc(topic)}
          </p>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
              <Clock size={14} />
              {topic.estimatedTime}
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
              <BookOpen size={14} />
              {topic.diagrams} {t("diagrams_count" as Parameters<typeof t>[0])}
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
              <BarChart2 size={14} />
              {topic.concepts.length} {t("concepts_covered" as Parameters<typeof t>[0])}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div
              className="sticky top-28 rounded-2xl border p-5 space-y-5"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {/* Prerequisites */}
              {topic.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                    {t("prerequisites")}
                  </h3>
                  <div className="space-y-1">
                    {topic.prerequisites.map(p => (
                      <div key={p} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span style={{ color }}>{prereqArrow}</span>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concepts */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                  {t("concepts_covered")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {topic.concepts.map(c => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ backgroundColor: `${color}12`, color, border: `1px solid ${color}25` }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nav */}
              <div className="pt-2 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
                {prevTopic && (
                  <Link
                    href={`/${locale}/learning/${prevTopic.id}`}
                    className="flex items-center gap-2 text-xs transition-opacity hover:opacity-70 w-full"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <PrevIcon size={12} />
                    <span className="truncate">{t("previous")}: {topicTitle(prevTopic)}</span>
                  </Link>
                )}
                {nextTopic && (
                  <Link
                    href={`/${locale}/learning/${nextTopic.id}`}
                    className="flex items-center gap-2 text-xs transition-opacity hover:opacity-70 w-full"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <NextIcon size={12} />
                    <span className="truncate">{t("next")}: {topicTitle(nextTopic)}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <TopicDetailClient
              topicId={id}
              accentColor={color}
              visualization={content?.visualization || "generic"}
            />
          </div>
        </div>

        {/* Bottom navigation */}
        <div
          className="mt-16 pt-8 border-t flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          {prevTopic ? (
            <Link
              href={`/${locale}/learning/${prevTopic.id}`}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all group"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}
            >
              <PrevIcon size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t("previous")}</div>
                <div style={{ color: "var(--text-primary)" }}>{topicTitle(prevTopic)}</div>
              </div>
            </Link>
          ) : <div />}
          {nextTopic && (
            <Link
              href={`/${locale}/learning/${nextTopic.id}`}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all group"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}
            >
              <div className={isRtl ? "text-left" : "text-right"}>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t("next")}</div>
                <div style={{ color: "var(--text-primary)" }}>{topicTitle(nextTopic)}</div>
              </div>
              <NextIcon size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
      <HireCTA locale={locale} />
    </div>
  );
}
