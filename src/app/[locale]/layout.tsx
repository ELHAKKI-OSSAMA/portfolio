import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GameProvider } from "@/contexts/GameContext";
import PersistentGameOverlay from "@/components/games/PersistentGameOverlay";
import { PersonSchema, WebsiteSchema, OrganizationSchema } from "@/components/seo/JsonLd";
import Analytics from "@/components/analytics/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://ossamaelhakki.com"),
  title: {
    default: "Ossama Elhakki | AI Engineer & ML Systems Builder",
    template: "%s | Ossama Elhakki",
  },
  description:
    "AI Engineer specializing in ML, computer vision, NLP, and AI automation. 35+ projects. Based in Morocco. Available worldwide for remote positions.",
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "Computer Vision",
    "NLP",
    "Deep Learning",
    "MLOps",
    "Stable Diffusion",
    "n8n",
    "Morocco",
    "Freelance ML",
    "Ossama Elhakki",
    "أسامة الحقّي",
  ],
  authors: [{ name: "Ossama Elhakki", url: "https://ossamaelhakki.com" }],
  creator: "Ossama Elhakki",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ossamaelhakki.com",
    siteName: "Ossama Elhakki | AI Engineer",
    title: "Ossama Elhakki | AI Engineer & ML Systems Builder",
    description:
      "AI Engineer with 35+ ML projects across fraud detection, medical imaging, NLP, and generative AI. Available worldwide.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Ossama Elhakki - AI Engineer & ML Systems Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ossama Elhakki | AI Engineer",
    description: "AI Engineer specializing in ML, CV, NLP, and AI automation. Based in Morocco.",
    images: ["/api/og"],
  },
  alternates: {
    canonical: "https://ossamaelhakki.com/en",
    languages: {
      en: "https://ossamaelhakki.com/en",
      fr: "https://ossamaelhakki.com/fr",
      ar: "https://ossamaelhakki.com/ar",
    },
  },
  verification: {
    // Set GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION in your env (.env / Vercel).
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "fr" | "ar")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <>
      <link rel="alternate" type="application/rss+xml" title="Ossama Elhakki Blog" href="/feed.xml" />
      <PersonSchema />
      <WebsiteSchema />
      <OrganizationSchema />
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider locale={locale}>
          <GameProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <PersistentGameOverlay />
          </GameProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
      <Analytics />
    </>
  );
}
