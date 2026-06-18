"use client";
import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { accentInk } from "@/lib/a11yColor";

export interface VizTheme {
  isDark: boolean;
  bg: string;
  text: string;
  textMuted: string;
  textFaint: string;
  /** A vivid accent hue as readable label text: unchanged in dark mode, AA-darkened in light mode. */
  ink: (color: string) => string;
  grid: string;
  gridStrong: string;
  axis: string;
  border: string;
  surface: string;
  surfaceStrong: string;
  pointFill: string;
  codeBg: string;
  codeText: string;
  copyColor: string;
  codeBorder: string;
  codeHeaderBorder: string;
}

export function useVizTheme(): VizTheme {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Memoize so visualization components don't receive a new object reference
  // on every parent re-render — only recalculate when isDark actually changes.
  return useMemo(() => ({
    isDark,
    ink:               (color: string) => (isDark ? color : accentInk(color)),
    bg:                isDark ? "#0d0d1f"               : "#f7f7ff",
    text:              isDark ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.75)",
    // 0.42 only reached ~3:1 on white; 0.56 clears AA for small label text.
    textMuted:         isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.56)",
    textFaint:         isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)",
    grid:              isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)",
    gridStrong:        isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)",
    axis:              isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.28)",
    border:            isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
    surface:           isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    surfaceStrong:     isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
    pointFill:         isDark ? "#ffffff"               : "#1a1a3e",
    codeBg:            isDark ? "#0d1117"               : "#f6f8fa",
    codeText:          isDark ? "#e6edf3"               : "#24292f",
    copyColor:         isDark ? "rgba(255,255,255,0.40)": "rgba(0,0,0,0.45)",
    codeBorder:        isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
    codeHeaderBorder:  isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
  }), [isDark]);
}
