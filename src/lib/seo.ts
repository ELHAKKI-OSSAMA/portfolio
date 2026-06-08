import type { Metadata } from "next";
import { SITE_URL } from "@/lib/data";

export const LOCALES = ["en", "fr", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_MA",
};

const OG_SUBTITLE: Record<Locale, string> = {
  en: "AI Engineer & Data Scientist · Morocco",
  fr: "Ingénieur IA & Data Scientist · Maroc",
  ar: "مهندس ذكاء اصطناعي وعالم بيانات · المغرب",
};

/** Build a dynamic, localized Open Graph image URL for a page. */
function ogImageUrl(title: string, subtitle: string): string {
  const t = title.replace(/\s*\|\s*Ossama Elhakki.*$/i, "").slice(0, 110);
  return `${SITE_URL}/api/og?title=${encodeURIComponent(t)}&subtitle=${encodeURIComponent(subtitle)}`;
}

/** Pick a localized string from an {en,fr,ar} map, falling back to English. */
export function pick<T>(locale: string, map: { en: T; fr: T; ar: T }): T {
  return locale === "fr" ? map.fr : locale === "ar" ? map.ar : map.en;
}

interface BuildArgs {
  locale: string;
  /** Locale-agnostic path beginning with "/" ("" for home). */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

/**
 * Canonical + hreflang (incl. x-default) + Open Graph + Twitter metadata,
 * consistent across every page and locale.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  type = "website",
  image,
  publishedTime,
  modifiedTime,
  tags,
}: BuildArgs): Metadata {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${path}`;
  languages["x-default"] = `${SITE_URL}/en${path}`;

  const url = `${SITE_URL}/${locale}${path}`;
  const ogLocale = OG_LOCALE[(locale as Locale)] ?? "en_US";
  const subtitle = OG_SUBTITLE[(locale as Locale)] ?? OG_SUBTITLE.en;
  const resolvedImage = image ?? ogImageUrl(title, subtitle);
  const absImage = resolvedImage.startsWith("http") ? resolvedImage : `${SITE_URL}${resolvedImage}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url, languages },
    openGraph: {
      type: type === "profile" ? "profile" : type,
      title,
      description,
      url,
      siteName: "Ossama Elhakki — AI Engineer",
      locale: ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: absImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(tags ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: absImage, alt: title }],
      ...(process.env.NEXT_PUBLIC_TWITTER_HANDLE
        ? {
            site: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
            creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
          }
        : {}),
    },
  };
}
