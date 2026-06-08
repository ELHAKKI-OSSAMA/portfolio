import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { blogPosts, SITE_URL, getBlogBody, hasLocalizedBody } from "@/lib/data";
import { BlogPostingSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";
import { extractHeadings } from "@/lib/slug";
import { buildMetadata, pick } from "@/lib/seo";
import BlogArticle from "@/components/blog/BlogArticle";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import { ArrowLeft, ArrowRight, Clock, Tag, Calendar } from "lucide-react";

export async function generateStaticParams() {
  return blogPosts.flatMap((post) =>
    ["en", "fr", "ar"].map((locale) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  const title = locale === "fr" ? post.titleFr : locale === "ar" ? post.titleAr : post.title;
  const description =
    locale === "fr" ? post.excerptFr : locale === "ar" ? post.excerptAr : post.excerpt;

  return {
    ...buildMetadata({
      locale,
      path: `/blog/${slug}`,
      title,
      description,
      keywords: post.tags,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      tags: post.tags,
    }),
    authors: [{ name: "Ossama Elhakki", url: SITE_URL }],
  };
}

const TOC_LABEL: Record<string, string> = {
  en: "In this article",
  fr: "Dans cet article",
  ar: "في هذا المقال",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const isRtl = locale === "ar";
  const title = locale === "fr" ? post.titleFr : locale === "ar" ? post.titleAr : post.title;
  const excerpt =
    locale === "fr" ? post.excerptFr : locale === "ar" ? post.excerptAr : post.excerpt;

  const content = getBlogBody(slug, locale);
  const bodyRtl = isRtl && hasLocalizedBody(slug, locale);
  const headings = extractHeadings(content);

  const dateStr = new Date(post.date).toLocaleDateString(
    locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <>
      <ReadingProgress />
      <BlogPostingSchema
        title={title}
        description={excerpt}
        slug={post.slug}
        date={post.date}
        tags={post.tags}
        locale={locale}
      />
      <BreadcrumbSchema
        items={[
          { name: pick(locale, { en: "Home", fr: "Accueil", ar: "الرئيسية" }), url: `${SITE_URL}/${locale}` },
          { name: pick(locale, { en: "Blog", fr: "Blog", ar: "المدونة" }), url: `${SITE_URL}/${locale}/blog` },
          { name: title, url: `${SITE_URL}/${locale}/blog/${post.slug}` },
        ]}
      />

      <div className="section-padding">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-[var(--primary)]"
            style={{ color: "var(--text-muted)" }}
          >
            <BackIcon size={16} />
            {t("backToBlog")}
          </Link>

          {/* Header */}
          <header className="mb-10 max-w-3xl">
            <div
              dir={isRtl ? "rtl" : "ltr"}
              className="flex flex-wrap items-center gap-3 mb-5 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span
                className="px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: "var(--primary)20", color: "var(--primary)" }}
              >
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} /> {dateStr}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} /> {post.readTime} {t("read")}
              </span>
            </div>

            <h1
              dir={isRtl ? "rtl" : "ltr"}
              className="text-3xl md:text-[2.75rem] font-bold leading-[1.15] tracking-tight mb-5"
              style={{ color: "var(--text-primary)", textAlign: isRtl ? "right" : "left" }}
            >
              {title}
            </h1>

            <p
              dir={isRtl ? "rtl" : "ltr"}
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: "var(--text-secondary)", textAlign: isRtl ? "right" : "left" }}
            >
              {excerpt}
            </p>
          </header>

          <div className="border-b mb-10" style={{ borderColor: "var(--border)" }} />

          {/* Article + TOC */}
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
            <div className="min-w-0 max-w-2xl">
              <BlogArticle content={content} rtl={bodyRtl} />

              {/* Tags */}
              <div
                className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <Tag size={14} style={{ color: "var(--text-muted)" }} />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author */}
              <div
                className="mt-10 p-6 rounded-2xl border"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
                  >
                    O
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Ossama Elhakki
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {t("author_bio")}
                    </p>
                    <div className="flex gap-3 mt-2">
                      <Link href={`/${locale}/about`} className="text-xs hover:underline" style={{ color: "var(--primary)" }}>
                        {t("about_link")}
                      </Link>
                      <Link href={`/${locale}/contact`} className="text-xs hover:underline" style={{ color: "var(--primary)" }}>
                        {t("contact_link")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table of contents */}
            <aside className="hidden lg:block">
              <TableOfContents headings={headings} label={TOC_LABEL[locale] ?? TOC_LABEL.en} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
