"use client";

import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Maximize2 } from "lucide-react";
import { useState } from "react";

const GAME_META: Record<string, {
  title: string; titleFr: string; titleAr: string;
  icon: string; accent: string;
}> = {
  "flappy-bird":    { title: "Flappy Bird",          titleFr: "Oiseau Flappy",              titleAr: "الطائر الرفرف",         icon: "🐦", accent: "#00ff88" },
  "snake":          { title: "Snake",                 titleFr: "Serpent",                    titleAr: "الثعبان",               icon: "🐍", accent: "#4488ff" },
  "car-racing":     { title: "Car Racing",            titleFr: "Course Automobile",          titleAr: "سباق السيارات",         icon: "🏎️", accent: "#ffcc00" },
  "pong":           { title: "Pong",                  titleFr: "Pong",                       titleAr: "بونج",                  icon: "🏓", accent: "#4488ff" },
  "asteroid-dodge": { title: "Asteroid Dodge",        titleFr: "Évitement d'Astéroïdes",     titleAr: "تفادي الكويكبات",       icon: "🚀", accent: "#9966cc" },
  "game-2048":      { title: "2048",                  titleFr: "2048",                       titleAr: "2048",                  icon: "🔢", accent: "#ffcc00" },
  "breakout":       { title: "Breakout",              titleFr: "Casse-Briques",              titleAr: "كسر الطوب",             icon: "🧱", accent: "#ff44cc" },
  "predator-prey":  { title: "Predator Prey",         titleFr: "Prédateur–Proie",            titleAr: "مفترس وفريسة",          icon: "🌿", accent: "#00ff88" },
  "lunar-lander":   { title: "Lunar Lander",          titleFr: "Atterrisseur Lunaire",       titleAr: "المركبة القمرية",       icon: "🌙", accent: "#44ccff" },
  "maze-solver":    { title: "Maze Solver",           titleFr: "Résolveur de Labyrinthe",    titleAr: "حل المتاهة",            icon: "🌀", accent: "#cc7722" },
};

export default function GamePage() {
  const params  = useParams();
  const router  = useRouter();
  const locale  = useLocale();
  const id      = params?.id as string;
  const meta    = GAME_META[id];
  const [full, setFull] = useState(false);

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--text-muted)" }}>Game not found.</p>
      </div>
    );
  }

  const title = locale === "fr" ? meta.titleFr : locale === "ar" ? meta.titleAr : meta.title;
  const gameSrc = `/games/${id}/index.html`;

  return (
    // Fixed overlay covers the full viewport — hides portfolio Navbar/Footer behind it
    <div className="fixed inset-0 flex flex-col z-50" style={{ backgroundColor: "#06060e" }}>

      {/* ── Top bar ── */}
      {!full && (
        <div
          className="flex items-center gap-3 px-4 h-12 shrink-0 border-b"
          style={{ borderColor: meta.accent + "20", backgroundColor: "#06060e" }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-70"
            style={{ color: meta.accent }}
          >
            <ArrowLeft size={13} />
            {locale === "fr" ? "RETOUR" : locale === "ar" ? "رجوع" : "BACK"}
          </button>

          <div className="h-3 w-px" style={{ backgroundColor: meta.accent + "30" }} />

          <div className="flex items-center gap-2">
            <span>{meta.icon}</span>
            <span className="text-xs font-mono tracking-widest" style={{ color: meta.accent }}>
              {title}
            </span>
          </div>

          <button
            onClick={() => setFull(true)}
            className="ml-auto flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-70"
            style={{ color: meta.accent + "80" }}
          >
            <Maximize2 size={12} />
            {locale === "fr" ? "PLEIN ÉCRAN" : locale === "ar" ? "ملء الشاشة" : "FULLSCREEN"}
          </button>
        </div>
      )}

      {/* ── Fullscreen exit ── */}
      {full && (
        <button
          onClick={() => setFull(false)}
          className="fixed top-3 left-3 z-50 flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded"
          style={{ backgroundColor: "#06060ecc", color: meta.accent, border: `1px solid ${meta.accent}30` }}
        >
          <ArrowLeft size={11} /> EXIT
        </button>
      )}

      {/* ── iframe ── */}
      <iframe
        src={gameSrc}
        title={title}
        className="flex-1 w-full border-0"
        style={{ display: "block" }}
        allow="fullscreen"
      />
    </div>
  );
}
