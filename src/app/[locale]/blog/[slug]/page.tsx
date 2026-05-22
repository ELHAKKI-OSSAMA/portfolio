import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, SITE_URL } from "@/lib/data";
import { BlogPostingSchema } from "@/components/seo/JsonLd";
import { ArrowLeft, Clock, Tag } from "lucide-react";

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
    title,
    description,
    keywords: post.tags,
    authors: [{ name: "Ossama Elhakki", url: SITE_URL }],
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/${locale}/blog/${slug}`,
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
      languages: {
        en: `${SITE_URL}/en/blog/${slug}`,
        fr: `${SITE_URL}/fr/blog/${slug}`,
        ar: `${SITE_URL}/ar/blog/${slug}`,
      },
    },
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-2xl font-bold mt-10 mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="text-xl font-semibold mt-8 mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("```")) {
      const lang = line.replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={i}
          className="rounded-xl p-4 overflow-x-auto my-6 text-sm font-mono"
          style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (line.startsWith("| ")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0]
        .split("|")
        .filter(Boolean)
        .map((h) => h.trim());
      const rows = tableLines
        .slice(2)
        .map((row) => row.split("|").filter(Boolean).map((c) => c.trim()));
      elements.push(
        <div key={i} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {headers.map((h, hi) => (
                  <th
                    key={hi}
                    className="px-4 py-2 text-left font-semibold border-b"
                    style={{
                      color: "var(--text-primary)",
                      borderColor: "var(--border)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-2 border-b"
                      style={{
                        color: "var(--text-secondary)",
                        borderColor: "var(--border)",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: cell.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1 my-4 pl-4">
          {items.map((item, ii) => (
            <li
              key={ii}
              className="text-base leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
              dangerouslySetInnerHTML={{
                __html: item
                  .replace(/\*\*(.*?)\*\*/g, "<strong style='color:var(--text-primary)'>$1</strong>")
                  .replace(/`(.*?)`/g, "<code style='background:var(--bg-elevated);padding:2px 6px;border-radius:4px;font-size:0.85em'>$1</code>")
                  .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' style='color:var(--primary)' target='_blank' rel='noopener'>$1</a>"),
              }}
            />
          ))}
        </ul>
      );
      continue;
    } else if (line.startsWith("1. ")) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1 my-4 pl-4">
          {items.map((item, ii) => (
            <li
              key={ii}
              className="text-base leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
              dangerouslySetInnerHTML={{
                __html: item
                  .replace(/\*\*(.*?)\*\*/g, "<strong style='color:var(--text-primary)'>$1</strong>")
                  .replace(/`(.*?)`/g, "<code style='background:var(--bg-elevated);padding:2px 6px;border-radius:4px;font-size:0.85em'>$1</code>")
                  .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' style='color:var(--primary)' target='_blank' rel='noopener'>$1</a>"),
              }}
            />
          ))}
        </ol>
      );
      continue;
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p
          key={i}
          className="text-base leading-relaxed my-2"
          style={{ color: "var(--text-secondary)" }}
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, "<strong style='color:var(--text-primary)'>$1</strong>")
              .replace(/`(.*?)`/g, "<code style='background:var(--bg-elevated);padding:2px 6px;border-radius:4px;font-size:0.85em'>$1</code>")
              .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' style='color:var(--primary)' target='_blank' rel='noopener'>$1</a>"),
          }}
        />
      );
    }
    i++;
  }

  return elements;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const title = locale === "fr" ? post.titleFr : locale === "ar" ? post.titleAr : post.title;
  const excerpt =
    locale === "fr" ? post.excerptFr : locale === "ar" ? post.excerptAr : post.excerpt;

  return (
    <>
      <BlogPostingSchema
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        date={post.date}
        tags={post.tags}
      />
      <div className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back button */}
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-[var(--primary)]"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          {/* Article header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: "var(--primary)20",
                  color: "var(--primary)",
                }}
              >
                {post.category}
              </span>
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <Clock size={12} />
                {post.readTime} read
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(post.date).toLocaleDateString(
                  locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold leading-tight mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h1>

            <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {excerpt}
            </p>
          </header>

          {/* Divider */}
          <div className="border-b mb-10" style={{ borderColor: "var(--border)" }} />

          {/* Article content */}
          <article className="prose-custom">{renderMarkdown(post.content)}</article>

          {/* Tags */}
          <div
            className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <Tag size={14} style={{ color: "var(--text-muted)" }} />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author card */}
          <div
            className="mt-10 p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
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
                  AI Engineer & ML Systems Builder — Morocco
                </p>
                <div className="flex gap-3 mt-2">
                  <Link
                    href={`/${locale}/about`}
                    className="text-xs hover:underline"
                    style={{ color: "var(--primary)" }}
                  >
                    About me →
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="text-xs hover:underline"
                    style={{ color: "var(--primary)" }}
                  >
                    Contact →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
