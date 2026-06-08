import { getFaq } from "@/lib/data";

const HEADING: Record<string, string> = {
  en: "Frequently Asked Questions",
  fr: "Questions fréquentes",
  ar: "الأسئلة الشائعة",
};

/** Visible, accessible FAQ (server-rendered, no JS) — pairs with FAQPage JSON-LD. */
export default function FAQSection({ locale }: { locale: string }) {
  const items = getFaq(locale);
  const isRtl = locale === "ar";

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center mb-10"
          style={{ color: "var(--text-primary)" }}
        >
          {HEADING[locale] ?? HEADING.en}
        </h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border p-5"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              {...(i === 0 ? { open: true } : {})}
            >
              <summary
                dir={isRtl ? "rtl" : "ltr"}
                className="cursor-pointer list-none font-semibold flex items-center justify-between gap-3"
                style={{ color: "var(--text-primary)", textAlign: isRtl ? "right" : "left" }}
              >
                <span>{item.question}</span>
                <span
                  className="transition-transform group-open:rotate-45 text-xl leading-none shrink-0"
                  style={{ color: "var(--primary)" }}
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p
                dir={isRtl ? "rtl" : "ltr"}
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)", textAlign: isRtl ? "right" : "left" }}
              >
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
