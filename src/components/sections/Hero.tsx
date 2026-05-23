"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { GithubIcon, LinkedInIcon, KaggleIcon } from "@/components/ui/SocialIcons";
import { GITHUB_URL, LINKEDIN_URL, KAGGLE_URL } from "@/lib/data";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-glow-pulse pointer-events-none"
        style={{ backgroundColor: "var(--primary)", opacity: 0.12 }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] animate-glow-pulse pointer-events-none"
        style={{ backgroundColor: "var(--secondary)", opacity: 0.08, animationDelay: "1.5s" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Available badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-8"
          style={{
            borderColor: "var(--secondary)",
            backgroundColor: "color-mix(in srgb, var(--secondary) 10%, transparent)",
            color: "var(--secondary)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--secondary)" }}
          />
          {t("available")}
        </div>

        {/* Greeting */}
        <p className="text-lg mb-3" style={{ color: "var(--text-secondary)" }}>
          {t("greeting")}
        </p>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
          <span className="gradient-text">{t("name")}</span>
        </h1>

        {/* Title */}
        <h2
          className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("title")}
        </h2>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href={`/${locale}/projects`}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all group"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {t("cta_primary")}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border font-medium transition-all"
            style={{
              borderColor: "var(--border-strong)",
              color: "var(--text-primary)",
            }}
          >
            {t("cta_secondary")}
          </Link>
        </div>

        {/* Social links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <GithubIcon size={18} />
            GitHub
          </a>
          <span style={{ color: "var(--border)" }}>•</span>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <LinkedInIcon size={18} />
            LinkedIn
          </a>
          <span style={{ color: "var(--border)" }}>•</span>
          <a
            href={KAGGLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <KaggleIcon size={18} />
            Kaggle
          </a>
          <span style={{ color: "var(--border)" }}>•</span>
          <a
            href="/cv/ossama_elhakki_resume_ai_engineer.pdf"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--text-secondary)" }}
            download
          >
            <Download size={18} />
            CV
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs animate-float"
        style={{ color: "var(--text-muted)" }}
      >
        <span>scroll</span>
        <div
          className="w-px h-12"
          style={{
            background: `linear-gradient(to bottom, var(--text-muted), transparent)`,
          }}
        />
      </div>
    </section>
  );
}
