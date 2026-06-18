import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { gameDocs, getGameDoc, SITE_URL } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { pick } from "@/lib/seo";
import BlogArticle from "@/components/blog/BlogArticle";
import HireCTA from "@/components/sections/HireCTA";
import { BreadcrumbSchema, LearningResourceSchema } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return gameDocs.flatMap((g) =>
    ["en", "fr", "ar"].map((locale) => ({ locale, id: g.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const doc = getGameDoc(id);
  if (!doc) return { title: "Not Found" };
  // Index a non-English game doc only when its body is genuinely translated.
  const hasBody = (l: string) => !!doc.body[l as "en"] && doc.body[l as "en"] !== doc.body.en;
  const availableLocales = ["en", ...(["fr", "ar"] as const).filter(hasBody)];
  return buildMetadata({
    locale,
    path: `/games/${id}`,
    type: "article",
    title: `${doc.title[locale as "en"] ?? doc.title.en}`,
    description: doc.summary[locale as "en"] ?? doc.summary.en,
    keywords: [doc.algo, "AI game", "reinforcement learning", "neuroevolution", doc.id, "Ossama Elhakki"],
    indexable: locale === "en" || hasBody(locale),
    availableLocales,
  });
}

const PLAY = { en: "Play the game", fr: "Jouer au jeu", ar: "العب اللعبة" };
const BACK = { en: "All AI games", fr: "Tous les jeux IA", ar: "كل ألعاب الذكاء الاصطناعي" };

export default async function GameDocPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const doc = getGameDoc(id);
  if (!doc) notFound();

  const isRtl = locale === "ar";
  const title = doc.title[locale as "en"] ?? doc.title.en;
  const summary = doc.summary[locale as "en"] ?? doc.summary.en;
  const body = doc.body[locale as "en"] ?? doc.body.en;
  const url = `${SITE_URL}/${locale}/games/${id}`;
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  // SoftwareApplication (game) structured data.
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: title,
    description: summary,
    url,
    applicationCategory: "Game",
    operatingSystem: "Web browser",
    inLanguage: locale,
    isAccessibleForFree: true,
    author: { "@id": `${SITE_URL}/#person` },
    keywords: doc.algo,
  };

  return (
    <div className="min-h-screen pt-24 pb-20 section-padding">
      <BreadcrumbSchema
        items={[
          { name: pick(locale, { en: "Home", fr: "Accueil", ar: "الرئيسية" }), url: `${SITE_URL}/${locale}` },
          { name: pick(locale, { en: "AI Games", fr: "Jeux IA", ar: "ألعاب الذكاء الاصطناعي" }), url: `${SITE_URL}/${locale}/games` },
          { name: title, url },
        ]}
      />
      <LearningResourceSchema name={title} description={summary} url={url} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/games`}
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-[var(--primary)]"
          style={{ color: "var(--text-muted)" }}
        >
          <BackIcon size={16} />
          {BACK[locale as "en"] ?? BACK.en}
        </Link>

        <header className="mb-8" dir={isRtl ? "rtl" : "ltr"} style={{ textAlign: isRtl ? "right" : "left" }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: doc.accent + "18", border: `1px solid ${doc.accent}30` }}
            >
              {doc.icon}
            </div>
            <span
              className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md"
              style={{ backgroundColor: doc.accent + "15", color: doc.accent, border: `0.5px solid ${doc.accent}30` }}
            >
              {doc.algo}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3" style={{ color: "var(--text-primary)" }}>
            {title}
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {summary}
          </p>

          <a
            href={`/games/${id}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: doc.accent, color: "#0d0d1f" }}
          >
            <Play size={16} />
            {PLAY[locale as "en"] ?? PLAY.en}
          </a>
        </header>

        <div className="border-b mb-8" style={{ borderColor: "var(--border)" }} />

        <BlogArticle content={body} rtl={isRtl} />
      </div>

      <HireCTA locale={locale} />
    </div>
  );
}
