"use client";

import Link from "next/link";
import { useGame } from "@/contexts/GameContext";
import { accentInk } from "@/lib/a11yColor";

interface GameCardProps {
  id: string;
  num: string;
  icon: string;
  title: string;
  desc: string;
  tags: string[];
  accent: string;
  playLabel: string;
  docHref?: string;
  docLabel?: string;
}

export default function GameCard({ id, num, icon, title, desc, tags, accent, playLabel, docHref, docLabel }: GameCardProps) {
  const { launchGame } = useGame();
  // vivid accent in dark mode, AA-darkened ink in light mode (see .acc-ink)
  const accVars = { ["--acc" as string]: accent, ["--acc-ink" as string]: accentInk(accent) };

  return (
    <div className="flex flex-col">
    <button
      onClick={() => launchGame(id)}
      className="group flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden text-start"
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
      <span className="absolute top-3 end-3 text-xs font-mono opacity-30 acc-ink" style={accVars}>
        {num}
      </span>

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: accent + "18", border: `1px solid ${accent}30` }}
      >
        {icon}
      </div>

      <div className="font-bold text-sm tracking-wide acc-ink" style={accVars}>
        {title}
      </div>

      <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>
        {desc}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-md font-mono acc-ink"
            style={{ backgroundColor: accent + "12", border: `0.5px solid ${accent}25`, ...accVars }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="text-xs font-mono tracking-widest px-3 py-1.5 rounded-lg w-fit transition-all acc-ink"
        style={{ backgroundColor: accent + "10", border: `0.5px solid ${accent}30`, ...accVars }}
      >
        {playLabel}
      </div>
    </button>
    {docHref && (
      <Link
        href={docHref}
        className="mt-2 text-xs font-medium px-1 transition-opacity hover:opacity-70"
        style={{ color: "var(--text-muted)" }}
      >
        {docLabel} →
      </Link>
    )}
    </div>
  );
}
