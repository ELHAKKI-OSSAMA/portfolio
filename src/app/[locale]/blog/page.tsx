import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { blogPosts, SITE_URL } from "@/lib/data";
import { FAQSchema, BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";
import { buildMetadata, pick } from "@/lib/seo";
import HireCTA from "@/components/sections/HireCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/blog",
    title: pick(locale, {
      en: "Blog — AI, ML & Data Science Insights | Ossama Elhakki",
      fr: "Blog — Articles sur l'IA, le ML et la Data Science | Ossama Elhakki",
      ar: "المدونة — رؤى في الذكاء الاصطناعي والتعلم الآلي وعلم البيانات | أسامة الحقّي",
    }),
    description: pick(locale, {
      en: "Deep-dive articles on machine learning, computer vision, NLP, AI automation, and production ML systems by Ossama Elhakki.",
      fr: "Articles approfondis sur le machine learning, la vision par ordinateur, le NLP, l'automatisation IA et les systèmes ML en production par Ossama Elhakki.",
      ar: "مقالات متعمقة في تعلم الآلة ورؤية الحاسوب ومعالجة اللغات وأتمتة الذكاء الاصطناعي وأنظمة ML الإنتاجية بقلم أسامة الحقّي.",
    }),
    keywords: ["machine learning blog", "AI engineering articles", "MLOps", "deep learning tutorials", "Kaggle", "Ossama Elhakki"],
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const categories = ["all", ...Array.from(new Set(blogPosts.map((p) => p.category)))];
  const active = category && category !== "all" ? category : null;
  const filtered = active ? blogPosts.filter((p) => p.category === active) : blogPosts;
  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  const isRtl = locale === "ar";
  const allLabel = locale === "fr" ? "Tous" : locale === "ar" ? "الكل" : t("allArticles");
  const readLabel = t("read");
  const featuredLabel = t("featured_badge");

  const faqItems = [
    {
      question: "What topics does Ossama Elhakki write about?",
      answer: "Machine learning, deep learning, computer vision, NLP, AI automation with n8n, production MLOps, and Kaggle competition strategies.",
    },
    {
      question: "How often does Ossama publish new articles?",
      answer: "New technical articles are published regularly, covering hands-on ML projects, tutorial walkthroughs, and AI engineering insights.",
    },
  ];

  return (
    <>
      <FAQSchema items={faqItems} />
      <BreadcrumbSchema
        items={[
          { name: locale === "fr" ? "Accueil" : locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
          { name: t("title"), url: `${SITE_URL}/${locale}/blog` },
        ]}
      />
      <ItemListSchema
        name="Blog articles"
        items={blogPosts.slice(0, 25).map((p) => ({
          name: locale === "fr" ? p.titleFr : locale === "ar" ? p.titleAr : p.title,
          url: `${SITE_URL}/${locale}/blog/${p.slug}`,
        }))}
      />
      <div className="section-padding max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t("title")}</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Category filter tabs — plain links, no JS needed */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = cat === "all" ? !active : active === cat;
            const href = cat === "all" ? `/${locale}/blog` : `/${locale}/blog?category=${encodeURIComponent(cat)}`;
            const count = cat === "all" ? blogPosts.length : blogPosts.filter((p) => p.category === cat).length;
            return (
              <Link
                key={cat}
                href={href}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
                style={
                  isActive
                    ? { backgroundColor: "var(--primary)", color: "#fff", borderColor: "var(--primary)" }
                    : { backgroundColor: "var(--bg-card)", color: "var(--text-secondary)", borderColor: "var(--border)" }
                }
              >
                {cat === "all" ? allLabel : cat}
                <span className="ml-1.5 text-xs opacity-60">{count}</span>
              </Link>
            );
          })}
        </div>

        {/* Featured posts */}
        {featured.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              {t("featured")}
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {featured.map((post) => {
                const title   = locale === "fr" ? post.titleFr   : locale === "ar" ? post.titleAr   : post.title;
                const excerpt = locale === "fr" ? post.excerptFr : locale === "ar" ? post.excerptAr : post.excerpt;
                return (
                  <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="block group">
                    <article className="h-full rounded-2xl p-6 border card-glow transition-all flex flex-col"
                      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ backgroundColor: "var(--primary)20", color: "var(--primary)" }}>
                          {post.category}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ backgroundColor: "var(--secondary)20", color: "var(--secondary)" }}>
                          {featuredLabel}
                        </span>
                        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
                          {post.readTime} {readLabel}
                        </span>
                      </div>
                      <h2 dir={isRtl ? "rtl" : "ltr"} className="text-lg font-bold mb-2 leading-snug group-hover:text-[var(--primary)] transition-colors flex-1"
                        style={{ color: "var(--text-primary)", textAlign: isRtl ? "right" : "left" }}>{title}</h2>
                      <p dir={isRtl ? "rtl" : "ltr"} className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)", textAlign: isRtl ? "right" : "left" }}>{excerpt}</p>
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>{tag}</span>
                        ))}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* All posts */}
        {rest.length > 0 && (
          <section>
            {featured.length > 0 && (
              <h2 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>
                {locale === "fr" ? "Tous les Articles" : locale === "ar" ? "جميع المقالات" : "All Articles"}
              </h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post) => {
                const title   = locale === "fr" ? post.titleFr   : locale === "ar" ? post.titleAr   : post.title;
                const excerpt = locale === "fr" ? post.excerptFr : locale === "ar" ? post.excerptAr : post.excerpt;
                return (
                  <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="block group">
                    <article className="h-full rounded-2xl p-6 border card-glow transition-all flex flex-col"
                      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ backgroundColor: "var(--primary)20", color: "var(--primary)" }}>
                          {post.category}
                        </span>
                        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
                          {post.readTime} {readLabel}
                        </span>
                      </div>
                      <h2 dir={isRtl ? "rtl" : "ltr"} className="text-lg font-bold mb-2 leading-snug group-hover:text-[var(--primary)] transition-colors flex-1"
                        style={{ color: "var(--text-primary)", textAlign: isRtl ? "right" : "left" }}>{title}</h2>
                      <p dir={isRtl ? "rtl" : "ltr"} className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)", textAlign: isRtl ? "right" : "left" }}>{excerpt}</p>
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>{tag}</span>
                        ))}
                      </div>
                      <div className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(post.date).toLocaleDateString(
                          locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
            {locale === "fr" ? "Aucun article dans cette catégorie." : locale === "ar" ? "لا توجد مقالات في هذه الفئة." : "No articles in this category."}
          </div>
        )}

      </div>
      <HireCTA locale={locale} />
    </>
  );
}
