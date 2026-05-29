import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { blogPosts } from "@/lib/data";
import { FAQSchema } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Blog | AI, ML & Data Science Insights",
    description:
      "Deep-dive articles on machine learning, computer vision, NLP, AI automation, and production ML systems by Ossama Elhakki.",
    alternates: {
      canonical: `https://ismmax.com/${locale}/blog`,
      languages: {
        en: "https://ismmax.com/en/blog",
        fr: "https://ismmax.com/fr/blog",
        ar: "https://ismmax.com/ar/blog",
      },
    },
  };
}

function BlogCard({
  post,
  locale,
}: {
  post: (typeof blogPosts)[0];
  locale: string;
}) {
  const title = locale === "fr" ? post.titleFr : locale === "ar" ? post.titleAr : post.title;
  const excerpt =
    locale === "fr" ? post.excerptFr : locale === "ar" ? post.excerptAr : post.excerpt;

  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="block group">
      <article
        className="rounded-2xl p-6 border card-glow transition-all duration-300"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              backgroundColor: "var(--primary)20",
              color: "var(--primary)",
            }}
          >
            {post.category}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {post.readTime} read
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(post.date).toLocaleDateString(
              locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </span>
          {post.featured && (
            <span
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{
                backgroundColor: "var(--secondary)20",
                color: "var(--secondary)",
              }}
            >
              Featured
            </span>
          )}
        </div>

        <h2
          className="text-xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>

        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
          {excerpt}
        </p>

        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const featured = blogPosts.filter((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  const faqItems = [
    {
      question: "What topics does Ossama Elhakki write about?",
      answer:
        "Machine learning, deep learning, computer vision, NLP, AI automation with n8n, production MLOps, and Kaggle competition strategies.",
    },
    {
      question: "How often does Ossama publish new articles?",
      answer:
        "New technical articles are published regularly, covering hands-on ML projects, tutorial walkthroughs, and AI engineering insights.",
    },
  ];

  return (
    <>
      <FAQSchema items={faqItems} />
      <div className="section-padding max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t("title")}</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Featured posts */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              {t("featured")}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          </section>
        )}

        {/* All posts */}
        {rest.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              {t("allArticles")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
