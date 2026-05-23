import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { services } from "@/lib/data";

const serviceColors = ["#6c63ff", "#00d4aa", "#ff6b6b"];
const serviceIcons = ["🤖", "🧠", "⚡"];

export default function ServicesPage() {
  const t = useTranslations("services");
  const locale = useLocale();

  const availableFor = [
    { en: "Full-time remote positions", fr: "Postes à distance", ar: "وظائف عن بُعد" },
    { en: "Freelance ML projects", fr: "Projets ML freelance", ar: "مشاريع حرة" },
    { en: "Consulting & audits", fr: "Conseil & audits", ar: "الاستشارات" },
    { en: "AI workshops (FR/AR)", fr: "Ateliers IA (FR/AR)", ar: "ورش عمل الذكاء الاصطناعي" },
  ];

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {t("title")}
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {services.map((service, i) => {
            const allFeatureKeys = [
              "s1_f1","s1_f2","s1_f3","s1_f4",
              "s2_f1","s2_f2","s2_f3","s2_f4","s2_f5",
              "s3_f1","s3_f2","s3_f3","s3_f4","s3_f5","s3_f6",
            ];

            return (
              <div
                key={service.id}
                className={`relative flex flex-col rounded-2xl overflow-hidden transition-all ${
                  service.popular
                    ? "gradient-border scale-105 shadow-[0_0_40px_rgba(0,212,170,0.2)]"
                    : "card-glow"
                }`}
                style={
                  service.popular
                    ? undefined
                    : {
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border)",
                      }
                }
              >
                {service.popular && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium">
                    <Star size={11} fill="currentColor" />
                    {t("most_popular")}
                  </div>
                )}

                <div
                  className="p-6"
                  style={service.popular ? { backgroundColor: "var(--bg-card)" } : undefined}
                >
                  <div className="text-3xl mb-4">{serviceIcons[i]}</div>
                  <div className="text-sm font-medium mb-1" style={{ color: serviceColors[i] }}>
                    {t(service.tier as keyof typeof t)}
                  </div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    {t(service.titleKey as keyof typeof t)}
                  </h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                    {t(service.descKey as keyof typeof t)}
                  </p>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>$</span>
                    <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                      {service.price}
                    </span>
                    <span className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                      {t(service.priceType as keyof typeof t)}
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/${locale}/contact`}
                    className="block text-center px-4 py-3 rounded-xl font-medium text-sm transition-all mb-6"
                    style={
                      service.popular
                        ? { backgroundColor: "#00d4aa", color: "#050816" }
                        : {
                            border: "1px solid var(--border-strong)",
                            color: "var(--text-primary)",
                          }
                    }
                  >
                    {t(service.popular ? "get_started" : "contact_me")}
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3">
                    {service.features.map((fKey) => (
                      <li
                        key={fKey}
                        className="flex items-center gap-2.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Check size={14} className="shrink-0" style={{ color: "var(--secondary)" }} />
                        {allFeatureKeys.includes(fKey) ? t(fKey as keyof typeof t) : fKey}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Available for section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>
            {t("contact_me")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {availableFor.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl text-sm text-center"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                {locale === "fr" ? item.fr : locale === "ar" ? item.ar : item.en}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
