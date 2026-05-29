"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTopicVideos, AUDIENCE_CONFIG } from "@/lib/learningContent/manim-videos";
import type { ManimVideoMeta, Audience } from "@/lib/learningContent/manim-videos";

// ─────────────────────────────────────────────────────────────────────────────
// ManimVideoPanel — horizontal scrollable gallery of animated video cards
// Shown on every topic page that has registered Manim video metadata.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  topicId: string;
  accentColor: string;
}

// ── Single video card ─────────────────────────────────────────────────────────
function VideoCard({
  video,
  isActive,
  onClick,
  accentColor,
}: {
  video: ManimVideoMeta;
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
}) {
  const aud = AUDIENCE_CONFIG[video.audience];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex-shrink-0 w-60 text-left rounded-2xl border p-4 cursor-pointer transition-all"
      style={{
        backgroundColor: isActive ? `${accentColor}10` : "var(--bg-card)",
        borderColor:     isActive ? `${accentColor}60` : "var(--border)",
        boxShadow:       isActive ? `0 0 0 2px ${accentColor}30` : "none",
      }}
    >
      {/* Audience badge */}
      <div
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-3"
        style={{ backgroundColor: `${aud.color}18`, color: aud.color }}
      >
        {aud.emoji} {aud.label}
      </div>

      {/* Title */}
      <p className="text-sm font-semibold leading-snug mb-2 line-clamp-2"
        style={{ color: "var(--text-primary)" }}>
        {video.title}
      </p>

      {/* Description */}
      <p className="text-xs leading-relaxed line-clamp-3 mb-3"
        style={{ color: "var(--text-muted)" }}>
        {video.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {video.duration}
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: isActive ? accentColor : "var(--text-muted)" }}
        >
          {isActive ? "▶ playing" : "▷ watch"}
        </span>
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="active-card-border"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `2px solid ${accentColor}50` }}
        />
      )}
    </motion.button>
  );
}

// ── Video player area ─────────────────────────────────────────────────────────
function VideoPlayer({
  video,
  accentColor,
}: {
  video: ManimVideoMeta;
  accentColor: string;
}) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={video.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl overflow-hidden border"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
      >
        {/* Video element */}
        <div
          className="relative w-full bg-black"
          style={{ aspectRatio: "16/9" }}
        >
          <video
            key={video.src}
            src={video.src}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
            style={{ display: "block" }}
            onLoadedMetadata={() => setVideoLoaded(true)}
            onError={(e) => {
              (e.currentTarget as HTMLVideoElement).style.display = "none";
            }}
          />

          {/* Placeholder overlay — hidden once the video loads */}
          {!videoLoaded && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${accentColor}20`, border: `2px dashed ${accentColor}60` }}
              >
                🎬
              </div>
            </div>
          )}
        </div>

        {/* Info bar */}
        <div className="px-4 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {video.title}
            </p>
            <AudienceBadge audience={video.audience} />
            <span className="text-xs font-mono ml-auto" style={{ color: "var(--text-muted)" }}>
              {video.duration}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Audience badge ────────────────────────────────────────────────────────────
function AudienceBadge({ audience }: { audience: Audience }) {
  const cfg = AUDIENCE_CONFIG[audience];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
    >
      {cfg.emoji} {cfg.label}
    </span>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────────
const ALL_AUDIENCES: (Audience | "all")[] = ["all", "beginner", "intermediate", "advanced"];

function FilterBar({
  selected,
  onChange,
  accentColor,
  counts,
}: {
  selected: Audience | "all";
  onChange: (a: Audience | "all") => void;
  accentColor: string;
  counts: Record<Audience | "all", number>;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ALL_AUDIENCES.map((aud) => {
        const active = selected === aud;
        const cfg    = aud === "all" ? null : AUDIENCE_CONFIG[aud];
        const col    = cfg?.color ?? accentColor;
        return (
          <button
            key={aud}
            onClick={() => onChange(aud)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: active ? `${col}20` : "var(--bg-card)",
              color:           active ? col : "var(--text-muted)",
              border:          `1px solid ${active ? col + "50" : "var(--border)"}`,
            }}
          >
            {aud === "all" ? "All" : (cfg?.emoji + " " + cfg?.label)} ({counts[aud]})
          </button>
        );
      })}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function ManimVideoPanel({ topicId, accentColor }: Props) {
  const videos = getTopicVideos(topicId);
  const [activeId, setActiveId]           = useState<string>(videos[0]?.id ?? "");
  const [audienceFilter, setAudienceFilter] = useState<Audience | "all">("all");

  if (videos.length === 0) return null;

  // Counts for filter badges
  const counts = ALL_AUDIENCES.reduce((acc, aud) => {
    acc[aud] = aud === "all"
      ? videos.length
      : videos.filter((v) => v.audience === aud).length;
    return acc;
  }, {} as Record<Audience | "all", number>);

  const filtered  = audienceFilter === "all"
    ? videos
    : videos.filter((v) => v.audience === audienceFilter);

  const activeVideo = videos.find((v) => v.id === activeId) ?? videos[0];

  // If filtered list doesn't include activeId, reset
  const displayList = filtered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            🎥
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Manim Animations
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {videos.length} animated video{videos.length !== 1 ? "s" : ""} · render locally with Manim Community
            </p>
          </div>
        </div>

        <FilterBar
          selected={audienceFilter}
          onChange={setAudienceFilter}
          accentColor={accentColor}
          counts={counts}
        />
      </div>

      {/* ── Horizontal card scroll ──────────────────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
        {displayList.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isActive={video.id === activeId}
            onClick={() => setActiveId(video.id)}
            accentColor={accentColor}
          />
        ))}
      </div>

      {/* ── Player ──────────────────────────────────────────────────────────── */}
      {activeVideo && (
        <VideoPlayer video={activeVideo} accentColor={accentColor} />
      )}

    </motion.div>
  );
}
