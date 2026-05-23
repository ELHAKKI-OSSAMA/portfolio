import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedInIcon, KaggleIcon } from "@/components/ui/SocialIcons";
import { GITHUB_URL, LINKEDIN_URL, KAGGLE_URL, EMAIL } from "@/lib/data";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer
      className="border-t backdrop-blur-sm"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "color-mix(in srgb, var(--bg-card) 50%, transparent)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-bold gradient-text mb-3">Ossama.dev</div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {t("footer.brand_desc")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>
              {t("footer.navigation")}
            </h3>
            <div className="space-y-2">
              {[
                ["projects", t("nav.projects")],
                ["services", t("nav.services")],
                ["learning", t("nav.learning")],
                ["blog", t("nav.blog")],
                ["about", t("nav.about")],
                ["contact", t("nav.contact")],
              ].map(([slug, label]) => (
                <Link
                  key={slug}
                  href={`/${locale}/${slug}`}
                  className="block text-sm transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>
              {t("footer.connect")}
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <GithubIcon size={16} />
                GitHub
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <LinkedInIcon size={16} />
                LinkedIn
              </a>
              <a
                href={KAGGLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <KaggleIcon size={16} />
                Kaggle
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <Mail size={16} />
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-2"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Ossama Elhakki. {t("footer.rights")}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("footer.built")}
          </p>
        </div>
      </div>
    </footer>
  );
}
