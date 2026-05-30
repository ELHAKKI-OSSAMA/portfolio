"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { getTopicVideos, AUDIENCE_CONFIG } from "@/lib/learningContent/manim-videos";
import type { ManimVideoMeta, Audience } from "@/lib/learningContent/manim-videos";
import { manimI18n } from "@/lib/learningContent/manim-i18n";

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
  tPlaying,
  tWatch,
  audienceLabel,
  localTitle,
  localDescription,
}: {
  video: ManimVideoMeta;
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
  tPlaying: string;
  tWatch: string;
  audienceLabel: (a: Audience) => string;
  localTitle: string;
  localDescription: string;
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
        {aud.emoji} {audienceLabel(video.audience)}
      </div>

      {/* Title */}
      <p className="text-sm font-semibold leading-snug mb-2 line-clamp-2"
        style={{ color: "var(--text-primary)" }}>
        {localTitle}
      </p>

      {/* Description */}
      <p className="text-xs leading-relaxed line-clamp-3 mb-3"
        style={{ color: "var(--text-muted)" }}>
        {localDescription}
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
          {isActive ? `▶ ${tPlaying}` : `▷ ${tWatch}`}
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
  audienceLabel,
  localTitle,
  localDescription,
  videoSrc,
}: {
  video: ManimVideoMeta;
  accentColor: string;
  audienceLabel: (a: Audience) => string;
  localTitle: string;
  localDescription: string;
  videoSrc: string;
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
            key={videoSrc}
            src={videoSrc}
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
              {localTitle}
            </p>
            <AudienceBadge audience={video.audience} label={audienceLabel(video.audience)} />
            <span className="text-xs font-mono ml-auto" style={{ color: "var(--text-muted)" }}>
              {video.duration}
            </span>
          </div>
          {localDescription !== video.description && (
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {localDescription}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Audience badge ────────────────────────────────────────────────────────────
function AudienceBadge({ audience, label }: { audience: Audience; label: string }) {
  const cfg = AUDIENCE_CONFIG[audience];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
    >
      {cfg.emoji} {label}
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
  tAll,
  audienceLabel,
}: {
  selected: Audience | "all";
  onChange: (a: Audience | "all") => void;
  accentColor: string;
  counts: Record<Audience | "all", number>;
  tAll: string;
  audienceLabel: (a: Audience) => string;
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
            {aud === "all" ? tAll : (cfg?.emoji + " " + audienceLabel(aud))} ({counts[aud]})
          </button>
        );
      })}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function ManimVideoPanel({ topicId, accentColor }: Props) {
  const t      = useTranslations("learning");
  const locale = useLocale();

  const videos = getTopicVideos(topicId);
  const [activeId, setActiveId]           = useState<string>(videos[0]?.id ?? "");
  const [audienceFilter, setAudienceFilter] = useState<Audience | "all">("all");

  // Reset selection when topicId changes
  useEffect(() => {
    setActiveId(videos[0]?.id ?? "");
    setAudienceFilter("all");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  if (videos.length === 0) return null;

  // Locale-aware audience label using existing difficulty_* i18n keys
  const audienceLabel = (a: Audience): string =>
    t(`difficulty_${a}` as Parameters<typeof t>[0]);

  // Build subtitle: "{n} animated video(s) · ..."
  const plural = videos.length !== 1 ? t("manim_subtitle_plural" as Parameters<typeof t>[0]) : "";
  const subtitle = `${videos.length} ${t("manim_subtitle_prefix" as Parameters<typeof t>[0])}${plural} ${t("manim_subtitle_suffix" as Parameters<typeof t>[0])}`;

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
  const displayList = filtered;

  const tPlaying = t("manim_playing" as Parameters<typeof t>[0]);
  const tWatch   = t("manim_watch"   as Parameters<typeof t>[0]);
  const tAll     = t("manim_filter_all" as Parameters<typeof t>[0]);

  const localTitle = (video: ManimVideoMeta): string => {
    if (locale === "fr") return manimI18n[video.id]?.titleFr ?? video.title;
    if (locale === "ar") return manimI18n[video.id]?.titleAr ?? video.title;
    return video.title;
  };
  const localDescription = (video: ManimVideoMeta): string => {
    if (locale === "fr") return manimI18n[video.id]?.descriptionFr ?? video.description;
    if (locale === "ar") return manimI18n[video.id]?.descriptionAr ?? video.description;
    return video.description;
  };

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
              {t("manim_title" as Parameters<typeof t>[0])}
            </h2>
            <p className="text-xs" dir="ltr" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          </div>
        </div>

        <FilterBar
          selected={audienceFilter}
          onChange={setAudienceFilter}
          accentColor={accentColor}
          counts={counts}
          tAll={tAll}
          audienceLabel={audienceLabel}
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
            tPlaying={tPlaying}
            tWatch={tWatch}
            audienceLabel={audienceLabel}
            localTitle={localTitle(video)}
            localDescription={localDescription(video)}
          />
        ))}
      </div>

      {/* ── Player ──────────────────────────────────────────────────────────── */}
      {activeVideo && (
        <VideoPlayer
          video={activeVideo}
          accentColor={accentColor}
          audienceLabel={audienceLabel}
          localTitle={localTitle(activeVideo)}
          localDescription={localDescription(activeVideo)}
          videoSrc={locale === "fr" && activeVideo.srcFr ? activeVideo.srcFr : activeVideo.src}
        />
      )}

    </motion.div>
  );
}
