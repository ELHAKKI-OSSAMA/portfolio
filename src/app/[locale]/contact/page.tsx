"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Mail, Send, CheckCircle, Phone, MapPin } from "lucide-react";
import { GithubIcon, LinkedInIcon, KaggleIcon } from "@/components/ui/SocialIcons";
import { GITHUB_URL, LINKEDIN_URL, KAGGLE_URL, EMAIL, PHONE } from "@/lib/data";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
  };

  const availableFor = [
    "Full-time remote (AI Engineer / ML Engineer)",
    "Freelance ML projects",
    "AI agent & automation development",
    "Consulting & AI workshops",
    "Computer vision & NLP contracts",
  ];

  const contacts = [
    { icon: Mail, href: `mailto:${EMAIL}`, label: "Email", value: EMAIL, color: "#6c63ff" },
    {
      icon: Phone,
      href: `tel:${PHONE}`,
      label: "Phone / WhatsApp",
      value: PHONE,
      color: "#00d4aa",
    },
  ];

  const socials = [
    { icon: GithubIcon, href: GITHUB_URL, label: "GitHub", value: "ELHAKKI-OSSAMA" },
    { icon: LinkedInIcon, href: LINKEDIN_URL, label: "LinkedIn", value: "Ossama Elhakki" },
    { icon: KaggleIcon, href: KAGGLE_URL, label: "Kaggle", value: "ossamaelhakk" },
  ];

  const inputStyle = {
    backgroundColor: "var(--bg-elevated)",
    borderColor: "var(--border)",
    color: "var(--text-primary)",
  };

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {t("title")}
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Direct contacts */}
            <div
              className="rounded-2xl p-6 border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <h3 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>
                {t("or")}
              </h3>
              <div className="space-y-4">
                {contacts.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="flex items-center gap-3 transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${c.color}20` }}
                    >
                      <c.icon size={16} style={{ color: c.color }} />
                    </div>
                    <div>
                      <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
                        {c.label}
                      </div>
                      <div className="text-sm">{c.value}</div>
                    </div>
                  </a>
                ))}
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)",
                        color: "var(--primary)",
                      }}
                    >
                      <s.icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
                        {s.label}
                      </div>
                      <div className="text-sm">{s.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Location */}
            <div
              className="rounded-2xl p-5 border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div
                className="flex items-center gap-2 text-sm mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                <MapPin size={14} style={{ color: "var(--primary)" }} />
                Casablanca, Morocco 🇲🇦
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Open to remote worldwide · UTC+1
              </p>
            </div>

            {/* Available for */}
            <div
              className="rounded-2xl p-6 border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <h3 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>
                {t("available_for")}
              </h3>
              <ul className="space-y-2.5">
                {availableFor.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: "var(--secondary)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-6 sm:p-8 border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle size={48} className="mb-4" style={{ color: "var(--secondary)" }} />
                  <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
                    Message Sent!
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {t("success")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {t("name")}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--primary)]"
                        style={inputStyle}
                        placeholder={t("name")}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {t("email")}
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--primary)]"
                        style={inputStyle}
                        placeholder={t("email")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      {t("subject")}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
                      style={inputStyle}
                      placeholder={t("subject")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      {t("message")}
                    </label>
                    <textarea
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none"
                      style={inputStyle}
                      placeholder={t("message")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium disabled:opacity-60 transition-all"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        {t("send")}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
