"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  mounted: false,
});

function readThemeFromDom(): Theme {
  if (typeof window === "undefined") return "dark";
  return (document.documentElement.getAttribute("data-theme") as Theme) ?? "dark";
}

export function ThemeProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [theme, setTheme] = useState<Theme>(readThemeFromDom);
  const [mounted, setMounted] = useState(false);

  // Sync lang/dir on every locale change and persist locale cookie for server-side dir
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, [locale]);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const osPrefers: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const next: Theme = stored ?? osPrefers;

    if (next !== theme) {
      setTheme(next);
      document.documentElement.setAttribute("data-theme", next);
    }
    document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`;
    if (!stored) localStorage.setItem("theme", next);
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
