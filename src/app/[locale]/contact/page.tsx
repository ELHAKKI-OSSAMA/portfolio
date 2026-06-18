"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Mail, Send, CheckCircle, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedInIcon, KaggleIcon } from "@/components/ui/SocialIcons";
import { GITHUB_URL, LINKEDIN_URL, KAGGLE_URL, EMAIL, PHONE } from "@/lib/data";

const WA_URL = `https://wa.me/${PHONE.replace(/\s+/g, "")}`;

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [msgLen, setMsgLen] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const errorLabel = locale === "fr"
    ? "Échec de l'envoi. Réessayez ou écrivez-moi directement par e-mail."
    : locale === "ar"
    ? "فشل الإرسال. حاول مجدداً أو راسلني مباشرة عبر البريد."
    : "Couldn't send. Please try again or email me directly.";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      company: fd.get("company"), // honeypot
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError(errorLabel);
    } finally {
      setSending(false);
    }
  };

  const availableFor = [t("avail1"), t("avail2"), t("avail3"), t("avail4"), t("avail5")];

  const contacts = [
    { icon: Mail,  href: `mailto:${EMAIL}`, label: "Email",              value: EMAIL, color: "#6c63ff" },
    { icon: Phone, href: `tel:${PHONE}`,    label: t("phone_whatsapp"),  value: PHONE, color: "#00d4aa" },
  ];

  const socials = [
    { icon: GithubIcon,   href: GITHUB_URL,   label: "GitHub",   value: "ELHAKKI-OSSAMA" },
    { icon: LinkedInIcon, href: LINKEDIN_URL,  label: "LinkedIn", value: "Ossama Elhakki"  },
    { icon: KaggleIcon,   href: KAGGLE_URL,    label: "Kaggle",   value: "ossamaelhakk"   },
  ];

  const inputCls = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--primary)]";
  const inputStyle = { backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" };

  const responseLabel = locale === "fr" ? "Réponse sous 24h" : locale === "ar" ? "رد خلال 24 ساعة" : "Responds within 24h";
  const waLabel = locale === "fr" ? "WhatsApp Direct" : locale === "ar" ? "واتساب مباشر" : "WhatsApp Direct";

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {t("title")}
          </h1>
          <p className="max-w-xl mx-auto mb-4" style={{ color: "var(--text-secondary)" }}>
            {t("subtitle")}
          </p>
          {/* Response time badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "color-mix(in srgb, var(--secondary) 15%, transparent)", color: "var(--secondary)" }}>
            <Clock size={11} />
            {responseLabel}
          </div>
        </div>

        {/* WhatsApp quick CTA */}
        <div className="mb-8">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl font-medium text-sm transition-all border"
            style={{ backgroundColor: "#25d36620", borderColor: "#25d366", color: "#25d366" }}
          >
            <MessageCircle size={18} />
            {waLabel} — <bdi dir="ltr">{PHONE}</bdi>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-2 space-y-4">

            {/* Direct contacts + socials */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>{t("or")}</h3>
              <div className="space-y-3">
                {contacts.map((c) => (
                  <a key={c.label} href={c.href}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[var(--bg-elevated)]"
                    style={{ color: "var(--text-secondary)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}20` }}>
                      <c.icon size={15} style={{ color: c.color }} />
                    </div>
                    <div>
                      <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{c.label}</div>
                      <div className="text-sm font-medium"><bdi dir="ltr">{c.value}</bdi></div>
                    </div>
                  </a>
                ))}

                <div className="border-t my-3" style={{ borderColor: "var(--border)" }} />

                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[var(--bg-elevated)]"
                    style={{ color: "var(--text-secondary)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)", color: "var(--primary)" }}>
                      <s.icon size={15} />
                    </div>
                    <div>
                      <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                      <div className="text-sm font-medium">{s.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Location + timezone */}
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 text-sm mb-1 font-medium" style={{ color: "var(--text-secondary)" }}>
                <MapPin size={13} style={{ color: "var(--primary)" }} />
                {t("location")}
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t("timezone")}</p>
            </div>

            {/* Available for */}
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold mb-3 text-sm" style={{ color: "var(--text-primary)" }}>{t("available_for")}</h3>
              <ul className="space-y-2">
                {availableFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--secondary)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl p-6 sm:p-8 border h-full" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: "color-mix(in srgb, var(--secondary) 20%, transparent)" }}>
                    <CheckCircle size={32} style={{ color: "var(--secondary)" }} />
                  </div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>{t("success_title")}</h3>
                  <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>{t("success")}</p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  toolname="send_contact_message"
                  tooldescription="Send a message to Ossama Elhakki (AI Engineer). Use this to get in touch about job offers, freelance ML projects, or consulting."
                >
                  {/* Honeypot — hidden from humans, bots fill it */}
                  <input
                    type="text" name="company" tabIndex={-1} autoComplete="off"
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{t("name")}</label>
                      <input type="text" name="name" required maxLength={200} className={inputCls} style={inputStyle} placeholder={t("name")} toolparamdescription="The sender's full name." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{t("email")}</label>
                      <input type="email" name="email" required className={inputCls} style={inputStyle} placeholder={t("email")} toolparamdescription="The sender's email address for the reply." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{t("subject")}</label>
                    <input type="text" name="subject" required maxLength={300} className={inputCls} style={inputStyle} placeholder={t("subject")} toolparamdescription="Short subject line for the message." />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{t("message")}</label>
                      <span className="text-xs" style={{ color: msgLen > 20 ? "var(--secondary)" : "var(--text-muted)" }}>{msgLen} {locale === "fr" ? "caractères" : locale === "ar" ? "حرف" : "chars"}</span>
                    </div>
                    <textarea
                      required rows={6} name="message" maxLength={5000}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none focus:border-[var(--primary)]"
                      style={inputStyle}
                      placeholder={t("message")}
                      onChange={(e) => setMsgLen(e.target.value.length)}
                      toolparamdescription="The full message body describing the request or opportunity."
                    />
                  </div>

                  {error && (
                    <p className="text-sm" style={{ color: "#ef4444" }} role="alert">{error}</p>
                  )}

                  <button
                    type="submit" disabled={sending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium disabled:opacity-60 transition-all"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {sending ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("sending")}</>
                    ) : (
                      <><Send size={15} />{t("send")}</>
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
