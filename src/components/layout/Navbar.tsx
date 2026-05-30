"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/projects`, label: t("projects") },
    { href: `/${locale}/services`, label: t("services") },
    { href: `/${locale}/learning`, label: t("learning") },
    { href: `/${locale}/games`, label: t("games") },
    { href: `/${locale}/blog`, label: t("blog") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md border-b shadow-lg"
          : "bg-transparent"
      }`}
      style={
        isScrolled
          ? {
              backgroundColor: "var(--nav-bg)",
              borderColor: "var(--border)",
            }
          : undefined
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
          >
            Ossama.dev
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[var(--primary)] bg-[var(--primary)]/10"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all hover:bg-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <LanguageSwitcher />
            <Link
              href={`/${locale}/contact`}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {t("hire")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all text-[var(--text-secondary)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="md:hidden border-b"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-sm transition-all"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href={`/${locale}/contact`}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: "var(--primary)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("hire")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
