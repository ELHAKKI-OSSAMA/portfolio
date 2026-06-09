"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Check, Star, MessageCircle, Cpu, Rocket } from "lucide-react";
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

                  {/* Price removed — quoted per project after scoping */}

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

        {/* How it works */}
        {(() => {
          const steps = locale === "fr"
            ? [
                { icon: MessageCircle, color: "#6c63ff", n: "01", title: "Discutons", desc: "Envoyez-moi un message décrivant votre projet. Je réponds sous 24h avec des questions ciblées." },
                { icon: Cpu,           color: "#00d4aa", n: "02", title: "Conception", desc: "Je propose un plan détaillé : architecture, livrables, timeline et prix exact avant de commencer." },
                { icon: Rocket,        color: "#ff6b6b", n: "03", title: "Livraison",  desc: "Code propre, documentation complète, déploiement ou handoff — vous êtes opérationnel." },
              ]
            : locale === "ar"
            ? [
                { icon: MessageCircle, color: "#6c63ff", n: "01", title: "تواصل",    desc: "أرسل لي رسالة تصف مشروعك. سأرد خلال 24 ساعة بأسئلة دقيقة." },
                { icon: Cpu,           color: "#00d4aa", n: "02", title: "التخطيط",   desc: "أقدم خطة تفصيلية: الهندسة، المخرجات، الجدول الزمني والسعر الدقيق." },
                { icon: Rocket,        color: "#ff6b6b", n: "03", title: "التسليم",   desc: "كود نظيف، توثيق كامل، نشر أو تسليم — أنت جاهز للعمل." },
              ]
            : [
                { icon: MessageCircle, color: "#6c63ff", n: "01", title: "Let's Talk",  desc: "Send me a message describing your project. I reply within 24h with targeted questions to scope it precisely." },
                { icon: Cpu,           color: "#00d4aa", n: "02", title: "We Design",   desc: "I propose a detailed plan: architecture, deliverables, timeline and exact price — before writing a line of code." },
                { icon: Rocket,        color: "#ff6b6b", n: "03", title: "You Launch",  desc: "Clean code, full documentation, deployment or handoff — you're live and operational." },
              ];
          const heading = locale === "fr" ? "Comment ça marche" : locale === "ar" ? "كيف يعمل" : "How it works";
          return (
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>{heading}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {steps.map((s, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border"
                    style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${s.color}20` }}>
                      <s.icon size={24} style={{ color: s.color }} />
                    </div>
                    <span className="text-xs font-bold mb-1" style={{ color: s.color }}>{s.n}</span>
                    <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Available for + CTA */}
        <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {locale === "fr" ? "Disponible pour" : locale === "ar" ? "متاح لـ" : "Available for"}
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            {locale === "fr" ? "Ouvert aux opportunités mondiales et locales" : locale === "ar" ? "متاح للفرص المحلية والعالمية" : "Open to worldwide and local opportunities"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
            {availableFor.map((item, i) => (
              <div key={i} className="p-3 rounded-xl text-sm"
                style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                {locale === "fr" ? item.fr : locale === "ar" ? item.ar : item.en}
              </div>
            ))}
          </div>
          <Link href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all"
            style={{ backgroundColor: "var(--primary)" }}>
            <MessageCircle size={16} />
            {t("contact_me")}
          </Link>
        </div>
      </div>
    </div>
  );
}
