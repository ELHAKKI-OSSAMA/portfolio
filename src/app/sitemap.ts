import { MetadataRoute } from "next";
import { blogPosts, projects, learningTopics, SITE_URL } from "@/lib/data";

const locales = ["en", "fr", "ar"] as const;

/** Build hreflang alternates (incl. x-default) for a locale-agnostic path. */
function alternatesFor(path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${path}`;
  languages["x-default"] = `${SITE_URL}/en${path}`;
  return { languages };
}

type Entry = MetadataRoute.Sitemap[number];

function entriesFor(
  path: string,
  opts: { changeFrequency?: Entry["changeFrequency"]; priority?: number; lastModified?: Date } = {}
): MetadataRoute.Sitemap {
  const { changeFrequency = "monthly", priority = 0.8, lastModified = new Date() } = opts;
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: alternatesFor(path),
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/learning", priority: 0.8, changeFrequency: "weekly" },
    { path: "/games", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  ];

  const staticEntries = staticPages.flatMap((p) =>
    entriesFor(p.path, { priority: p.priority, changeFrequency: p.changeFrequency })
  );

  const blogEntries = blogPosts.flatMap((post) =>
    entriesFor(`/blog/${post.slug}`, {
      priority: post.featured ? 0.8 : 0.7,
      lastModified: new Date(post.date),
    })
  );

  const projectEntries = projects.flatMap((p) =>
    entriesFor(`/projects/${p.id}`, { priority: 0.7 })
  );

  const learningEntries = learningTopics.flatMap((t) =>
    entriesFor(`/learning/${t.id}`, { priority: 0.6 })
  );

  return [...staticEntries, ...blogEntries, ...projectEntries, ...learningEntries];
}
