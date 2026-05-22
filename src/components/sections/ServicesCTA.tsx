import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, Bot, BrainCircuit, Workflow } from "lucide-react";

const serviceHighlights = [
  { icon: Bot, color: "#6c63ff", titleKey: "s1_title", descKey: "s1_desc" },
  { icon: BrainCircuit, color: "#00d4aa", titleKey: "s2_title", descKey: "s2_desc" },
  { icon: Workflow, color: "#ff6b6b", titleKey: "s3_title", descKey: "s3_desc" },
];

export default function ServicesCTA() {
  const t = useTranslations("services");
  const locale = useLocale();

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {t("title")}
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {serviceHighlights.map((s) => (
            <div
              key={s.titleKey}
              className="p-6 rounded-2xl border transition-all group card-glow"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${s.color}20` }}
              >
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
                {t(s.titleKey as keyof typeof t)}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {t(s.descKey as keyof typeof t)}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all group"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {t("get_started")}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
