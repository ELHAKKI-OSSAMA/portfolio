import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data";

const SITE_URL = "https://ismmax.com";
const locales = ["en", "fr", "ar"];

const pages = ["", "/projects", "/services", "/learning", "/about", "/contact", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "weekly" : "monthly",
      priority: page === "" ? 1.0 : 0.8,
    }))
  );

  const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...blogEntries];
}
