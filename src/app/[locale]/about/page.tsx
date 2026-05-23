import type { Metadata } from "next";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Download, MapPin, Globe, Cpu, ArrowRight, Award, Briefcase, GraduationCap } from "lucide-react";
import { GithubIcon, LinkedInIcon, KaggleIcon } from "@/components/ui/SocialIcons";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  KAGGLE_URL,
  PERSON,
  experience,
  education,
  certifications,
} from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "About Ossama Elhakki | AI Engineer Morocco",
    description:
      "Learn about Ossama Elhakki — AI Engineer with Master's in Distributed Systems & AI from ENSET Morocco. 36+ ML projects, expertise in computer vision, NLP, and AI automation.",
    alternates: {
      canonical: `https://ismmax.com/${locale}/about`,
      languages: {
        en: "https://ismmax.com/en/about",
        fr: "https://ismmax.com/fr/about",
        ar: "https://ismmax.com/ar/about",
      },
    },
    openGraph: {
      title: "About Ossama Elhakki | AI Engineer",
      description: "AI Engineer from Morocco with Master's in AI, 36+ Kaggle projects, production ML experience.",
      type: "profile",
      url: `https://ismmax.com/${locale}/about`,
    },
  };
}

const langs = [
  { name: "Arabic", native: "العربية", level: "Native", flag: "🇲🇦" },
  { name: "French", native: "Français", level: "Fluent", flag: "🇫🇷" },
  { name: "English", native: "English", level: "Professional", flag: "🇬🇧" },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const description =
    locale === "fr"
      ? PERSON.descriptionFr
      : locale === "ar"
      ? PERSON.descriptionAr
      : PERSON.description;

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {t("title")}
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Profile card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left: avatar + info */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl p-6 text-center border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl font-bold text-white mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
              >
                OE
              </div>
              <h2 className="font-bold text-xl mb-1" style={{ color: "var(--text-primary)" }}>
                {PERSON.name}
              </h2>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--primary)" }}>
                {locale === "ar" ? PERSON.titleAr : locale === "fr" ? PERSON.titleFr : PERSON.title}
              </p>
              <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                {PERSON.nameAr}
              </p>

              <div
                className="flex items-center justify-center gap-1.5 text-sm mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                <MapPin size={13} />
                Morocco 🇲🇦
              </div>

              {/* Languages */}
              <div className="border-t pt-4 mb-4" style={{ borderColor: "var(--border)" }}>
                <div
                  className="flex items-center justify-center gap-1.5 text-xs mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Globe size={13} />
                  Languages
                </div>
                {langs.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center justify-between text-sm py-1.5"
                  >
                    <span style={{ color: "var(--text-secondary)" }}>
                      {l.flag} {l.name}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {l.level}
                    </span>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="flex gap-2">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs transition-all"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <GithubIcon size={13} />
                  GitHub
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs transition-all"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <LinkedInIcon size={13} />
                  LinkedIn
                </a>
                <a
                  href={KAGGLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs transition-all"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <KaggleIcon size={13} />
                  Kaggle
                </a>
              </div>
            </div>
          </div>

          {/* Right: bio */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div
              className="inline-flex items-center gap-2 mb-4 text-sm"
              style={{ color: "var(--primary)" }}
            >
              <Cpu size={16} />
              AI Engineer & Data Scientist
            </div>
            <p className="leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              {description}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href="/cv/ossama_elhakki_resume_ai_engineer.pdf"
                download
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <Download size={15} />
                {t("download_cv")}
              </a>
              <Link
                href={`/${locale}/contact`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
              >
                <ArrowRight size={15} />
                Hire Me
              </Link>
            </div>
          </div>
        </div>

        {/* Experience */}
        <section className="mb-14">
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <Briefcase size={22} style={{ color: "var(--primary)" }} />
            {t("experience")}
          </h2>
          {experience.map((exp) => (
            <div
              key={exp.id}
              className="p-6 rounded-2xl border mb-4"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                    {locale === "ar" ? exp.roleAr : locale === "fr" ? exp.roleFr : exp.role}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>
                    {exp.company} · {exp.location}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--primary)20",
                    color: "var(--primary)",
                  }}
                >
                  {exp.period}
                </span>
              </div>
              <ul className="space-y-1.5">
                {(locale === "fr" ? exp.achievementsFr : exp.achievements).map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span style={{ color: "var(--secondary)" }} className="mt-1 flex-shrink-0">
                      ▸
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-14">
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <GraduationCap size={22} style={{ color: "var(--secondary)" }} />
            {t("education")}
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-5 rounded-2xl border"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {locale === "ar"
                        ? edu.degreeAr
                        : locale === "fr"
                        ? edu.degreeFr
                        : edu.degree}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {edu.institution} · {edu.location}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {edu.grade}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: "var(--secondary)15",
                      color: "var(--secondary)",
                    }}
                  >
                    {edu.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section>
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <Award size={22} style={{ color: "#f59e0b" }} />
            Certifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-xl border"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                  {locale === "ar" ? cert.nameAr : locale === "fr" ? cert.nameFr : cert.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--primary)" }}>
                  {cert.issuer}
                </p>
                {cert.desc && (
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {cert.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
