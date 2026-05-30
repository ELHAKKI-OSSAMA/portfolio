import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GameProvider } from "@/contexts/GameContext";
import PersistentGameOverlay from "@/components/games/PersistentGameOverlay";
import { PersonSchema, WebsiteSchema } from "@/components/seo/JsonLd";
import "../globals.css";

// ── Fonts loaded at build-time (no external request, no render-blocking) ──
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ismmax.com"),
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
  authors: [{ name: "Ossama Elhakki", url: "https://ismmax.com" }],
  creator: "Ossama Elhakki",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ismmax.com",
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
    canonical: "https://ismmax.com/en",
    languages: {
      en: "https://ismmax.com/en",
      fr: "https://ismmax.com/fr",
      ar: "https://ismmax.com/ar",
    },
  },
  verification: {
    google: "your-google-verification-code",
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

  // Enable static rendering — must be called before any next-intl API
  setRequestLocale(locale);

  const messages = await getMessages();
  const isRtl = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`h-full ${inter.variable} ${cairo.variable}`}
    >
      <head>
        <link rel="alternate" type="application/rss+xml" title="Ossama Elhakki Blog" href="/feed.xml" />
        <PersonSchema />
        <WebsiteSchema />
      </head>
      <body className="min-h-screen flex flex-col antialiased" style={{ backgroundColor: "var(--bg-main)", color: "var(--text-primary)" }}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <GameProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <PersistentGameOverlay />
            </GameProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
