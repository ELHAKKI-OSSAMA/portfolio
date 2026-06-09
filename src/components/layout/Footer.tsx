"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Mail, MapPin, Phone, ExternalLink, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedInIcon, KaggleIcon } from "@/components/ui/SocialIcons";
import { GITHUB_URL, LINKEDIN_URL, KAGGLE_URL, EMAIL, PHONE } from "@/lib/data";

const skills = ["Python", "PyTorch", "LightGBM", "YOLOv8", "n8n", "FastAPI", "Next.js", "Docker", "Stable Diffusion", "RAG"];

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  const navPages = [
    { slug: "projects",  label: t("nav.projects")  },
    { slug: "services",  label: t("nav.services")  },
    { slug: "learning",  label: t("nav.learning")  },
    { slug: "games",     label: t("nav.games")     },
    { slug: "blog",      label: t("nav.blog")      },
    { slug: "about",     label: t("nav.about")     },
    { slug: "contact",   label: t("nav.contact")   },
  ];

  const socials = [
    { icon: GithubIcon,   href: GITHUB_URL,  label: "GitHub",   sub: "ELHAKKI-OSSAMA" },
    { icon: LinkedInIcon, href: LINKEDIN_URL, label: "LinkedIn", sub: "Ossama Elhakki"  },
    { icon: KaggleIcon,   href: KAGGLE_URL,   label: "Kaggle",   sub: "ossamaelhakk"   },
  ];

  const availLabel  = locale === "fr" ? "Disponible" : locale === "ar" ? "متاح الآن" : "Available";
  const statusLabel = locale === "fr" ? "Ouvert aux offres freelance & temps plein"
                    : locale === "ar" ? "مفتوح للعمل الحر والتوظيف الكامل"
                    : "Open to freelance & full-time opportunities";

  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
    >
      {/* Availability banner */}
      <div className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--secondary) 8%, transparent)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--secondary)" }} />
            <span className="font-semibold" style={{ color: "var(--secondary)" }}>{availLabel}</span>
            <span style={{ color: "var(--text-secondary)" }}>—</span>
            <span style={{ color: "var(--text-secondary)" }}>{statusLabel}</span>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{ backgroundColor: "var(--secondary)", color: "#050816" }}
          >
            <MessageCircle size={12} />
            {t("nav.hire")}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand + bio */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-xl font-bold gradient-text mb-3">ossamaelhakki.com</div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              {t("footer.brand_desc")}
            </p>
            <div className="flex items-center gap-1.5 text-sm mb-2" style={{ color: "var(--text-muted)" }}>
              <MapPin size={13} />
              {locale === "ar" ? "الدار البيضاء، المغرب 🇲🇦" : locale === "fr" ? "Casablanca, Maroc 🇲🇦" : "Casablanca, Morocco 🇲🇦"}
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
              <Phone size={13} />
              <a href={`tel:${PHONE}`} className="hover:text-[var(--primary)] transition-colors"><bdi dir="ltr">{PHONE}</bdi></a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>
              {t("footer.navigation")}
            </h3>
            <div className="space-y-2.5">
              {navPages.map(({ slug, label }) => (
                <Link
                  key={slug}
                  href={`/${locale}/${slug}`}
                  className="flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--primary)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>
              {t("footer.connect")}
            </h3>
            <div className="space-y-3 mb-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm transition-colors hover:text-[var(--primary)] group"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <s.icon size={15} />
                  <span>{s.label}</span>
                  <span className="text-xs opacity-50">{s.sub}</span>
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity ms-auto" />
                </a>
              ))}
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2.5 text-sm transition-colors hover:text-[var(--primary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <Mail size={15} />
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>
              {locale === "ar" ? "التقنيات" : locale === "fr" ? "Technologies" : "Tech Stack"}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>© {year} Ossama Elhakki. {t("footer.rights")}</span>
            <span className="hidden sm:block opacity-30">·</span>
            <span className="opacity-50">{t("footer.built")}</span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <Link href={`/${locale}/projects`} className="hover:text-[var(--primary)] transition-colors">
              {locale === "ar" ? "المشاريع" : locale === "fr" ? "Projets" : "Projects"}
            </Link>
            <Link href={`/${locale}/blog`} className="hover:text-[var(--primary)] transition-colors">
              {locale === "ar" ? "المدونة" : locale === "fr" ? "Blog" : "Blog"}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-[var(--primary)] transition-colors">
              {locale === "ar" ? "تواصل" : locale === "fr" ? "Contact" : "Contact"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
