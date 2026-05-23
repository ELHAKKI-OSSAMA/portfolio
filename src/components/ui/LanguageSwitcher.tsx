"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "fr", label: "FR", flag: "🇫🇷", name: "Français" },
  { code: "ar", label: "AR", flag: "🇲🇦", name: "العربية" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) || languages[0];

  const switchLocale = (code: string) => {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/") || "/");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        <span>{current.flag}</span>
        <span className="font-medium">{current.label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-2 right-0 rounded-xl overflow-hidden shadow-xl z-50 min-w-[150px] border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors"
              style={{
                color: lang.code === locale ? "var(--primary)" : "var(--text-secondary)",
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.code === locale && (
                <span
                  className="ml-auto text-xs"
                  style={{ color: "var(--primary)" }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
