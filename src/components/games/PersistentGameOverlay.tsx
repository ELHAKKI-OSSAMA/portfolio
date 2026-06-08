"use client";

import { useGame } from "@/contexts/GameContext";
import { useLocale } from "next-intl";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

const GAME_META: Record<string, { title: string; titleFr: string; titleAr: string; icon: string; accent: string }> = {
  "flappy-bird":    { title: "Flappy Bird",       titleFr: "Oiseau Flappy",           titleAr: "الطائر الرفرف",   icon: "🐦", accent: "#00ff88" },
  "snake":          { title: "Snake",              titleFr: "Serpent",                 titleAr: "الثعبان",         icon: "🐍", accent: "#22d3aa" },
  "car-racing":     { title: "Car Racing",         titleFr: "Course Automobile",       titleAr: "سباق السيارات",   icon: "🏎️", accent: "#ffcc00" },
  "pong":           { title: "Pong",               titleFr: "Pong",                    titleAr: "بونج",            icon: "🏓", accent: "#4488ff" },
  "asteroid-dodge": { title: "Asteroid Dodge",     titleFr: "Évitement d'Astéroïdes",  titleAr: "تفادي الكويكبات", icon: "🚀", accent: "#9966cc" },
  "game-2048":      { title: "2048",               titleFr: "2048",                    titleAr: "2048",            icon: "🔢", accent: "#ffcc00" },
  "breakout":       { title: "Breakout",           titleFr: "Casse-Briques",           titleAr: "كسر الطوب",       icon: "🧱", accent: "#ff44cc" },
  "predator-prey":  { title: "Predator Prey",      titleFr: "Prédateur–Proie",         titleAr: "مفترس وفريسة",    icon: "🌿", accent: "#00ff88" },
  "lunar-lander":   { title: "Lunar Lander",       titleFr: "Atterrisseur Lunaire",    titleAr: "المركبة القمرية", icon: "🌙", accent: "#44ccff" },
  "maze-solver":    { title: "Maze Solver",        titleFr: "Résolveur de Labyrinthe", titleAr: "حل المتاهة",      icon: "🌀", accent: "#cc7722" },
};

export default function PersistentGameOverlay() {
  const { activeGameId, isOverlayVisible, hideOverlay, showOverlay } = useGame();
  const locale = useLocale();
  const [miniMode, setMiniMode] = useState(false);

  // Nothing to render until a game has been launched
  if (!activeGameId) return null;

  const meta   = GAME_META[activeGameId];
  const title  = locale === "fr" ? meta.titleFr : locale === "ar" ? meta.titleAr : meta.title;
  const accent = meta.accent;

  // ── Mini floating player (game navigated away but still running) ────────────
  if (!isOverlayVisible) {
    return (
      <button
        onClick={showOverlay}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono shadow-2xl transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: "#06060eee",
          border: `1px solid ${accent}50`,
          color: accent,
          backdropFilter: "blur(8px)",
        }}
      >
        <span>{meta.icon}</span>
        <span>{title}</span>
        <span className="opacity-50">▶</span>
      </button>
    );
  }

  // ── Full-screen overlay ─────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "#06060e" }}>

      {/* Top bar */}
      {!miniMode && (
        <div
          className="flex items-center gap-3 px-4 h-12 shrink-0 border-b"
          style={{ borderColor: accent + "20", backgroundColor: "#06060e" }}
        >
          {/* Back — hides overlay, game keeps running */}
          <button
            onClick={hideOverlay}
            className="flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-70"
            style={{ color: accent }}
          >
            <ArrowLeft size={13} />
            {locale === "fr" ? "RETOUR" : locale === "ar" ? "رجوع" : "BACK"}
          </button>

          <div className="h-3 w-px" style={{ backgroundColor: accent + "30" }} />

          <span>{meta.icon}</span>
          <span className="text-xs font-mono tracking-widest" style={{ color: accent }}>{title}</span>

          <span
            className="ml-2 text-xs px-2 py-0.5 rounded font-mono opacity-50"
            style={{ color: accent, border: `0.5px solid ${accent}30` }}
          >
            {locale === "fr" ? "jeu actif" : locale === "ar" ? "اللعبة نشطة" : "game running"}
          </span>

          <button
            onClick={() => setMiniMode(true)}
            className="ml-auto flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-70"
            style={{ color: accent + "80" }}
          >
            <Minimize2 size={12} />
            {locale === "fr" ? "MINI" : "MINI"}
          </button>
        </div>
      )}

      {/* Fullscreen exit from mini */}
      {miniMode && (
        <button
          onClick={() => setMiniMode(false)}
          className="fixed top-3 left-3 z-[60] flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded"
          style={{ backgroundColor: "#06060ecc", color: accent, border: `1px solid ${accent}30` }}
        >
          <Maximize2 size={11} /> {locale === "fr" ? "AGRANDIR" : locale === "ar" ? "تكبير" : "EXPAND"}
        </button>
      )}

      {/* The iframe — NEVER unmounts once a game is launched */}
      <iframe
        src={`/games/${activeGameId}/index.html`}
        title={title}
        className="flex-1 w-full border-0"
        style={{ display: "block" }}
        allow="fullscreen"
      />
    </div>
  );
}
