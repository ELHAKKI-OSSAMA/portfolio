"use client";

import Link from "next/link";

interface GameCardProps {
  id: string;
  num: string;
  icon: string;
  title: string;
  desc: string;
  tags: string[];
  accent: string;
  locale: string;
  playLabel: string;
}

export default function GameCard({ id, num, icon, title, desc, tags, accent, locale, playLabel }: GameCardProps) {
  return (
    <Link
      href={`/${locale}/games/${id}`}
      className="group flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = accent + "60";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${accent}18`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <span className="absolute top-3 right-3 text-xs font-mono opacity-30" style={{ color: accent }}>
        {num}
      </span>

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: accent + "18", border: `1px solid ${accent}30` }}
      >
        {icon}
      </div>

      <div className="font-bold text-sm tracking-wide" style={{ color: accent }}>
        {title}
      </div>

      <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>
        {desc}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-md font-mono"
            style={{ backgroundColor: accent + "12", color: accent + "cc", border: `0.5px solid ${accent}25` }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="text-xs font-mono tracking-widest px-3 py-1.5 rounded-lg w-fit transition-all"
        style={{ backgroundColor: accent + "10", color: accent, border: `0.5px solid ${accent}30` }}
      >
        {playLabel}
      </div>
    </Link>
  );
}
