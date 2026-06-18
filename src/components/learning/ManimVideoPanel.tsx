"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { getTopicVideos, AUDIENCE_CONFIG } from "@/lib/learningContent/manim-videos";
import type { ManimVideoMeta, Audience } from "@/lib/learningContent/manim-videos";
import { manimI18n } from "@/lib/learningContent/manim-i18n";

interface Props {
  topicId: string;
  accentColor: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

// ── Watched progress bar ───────────────────────────────────────────────────────
function WatchedBar({ watched, total, accentColor }: { watched: number; total: number; accentColor: string }) {
  const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-xs font-mono flex-shrink-0" style={{ color: "var(--text-muted)" }}>
        {watched}/{total}
      </span>
    </div>
  );
}

// ── Single video card ──────────────────────────────────────────────────────────
function VideoCard({
  video, isActive, isWatched, onClick,
  accentColor, tPlaying, tWatch, audienceLabel, localTitle, localDescription,
}: {
  video: ManimVideoMeta;
  isActive: boolean;
  isWatched: boolean;
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
      className="relative flex-shrink-0 w-56 sm:w-60 text-left rounded-2xl border p-4 cursor-pointer transition-all"
      style={{
        backgroundColor: isActive ? `${accentColor}10` : "var(--bg-card)",
        borderColor:     isActive ? `${accentColor}60` : "var(--border)",
        boxShadow:       isActive ? `0 0 0 2px ${accentColor}30` : "none",
      }}
    >
      {/* Watched checkmark */}
      {isWatched && !isActive && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
        >
          ✓
        </div>
      )}

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
        <span className="text-xs font-medium" style={{ color: isActive ? accentColor : "var(--text-muted)" }}>
          {isActive ? `▶ ${tPlaying}` : `▷ ${tWatch}`}
        </span>
      </div>

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

// ── Video player ───────────────────────────────────────────────────────────────
function VideoPlayer({
  video, accentColor, audienceLabel,
  localTitle, localDescription, videoSrc, ytId, onWatched,
}: {
  video: ManimVideoMeta;
  accentColor: string;
  audienceLabel: (a: Audience) => string;
  localTitle: string;
  localDescription: string;
  videoSrc: string;
  ytId?: string;
  onWatched: () => void;
}) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [speed, setSpeed]             = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => { setSpeed(1); setVideoLoaded(false); }, [videoSrc, ytId]);

  // YouTube embed URL — privacy-enhanced (youtube-nocookie) so the iframe sets
  // no tracking cookies until playback; rel=0 hides related, modestbranding=1 minimal logo
  const ytSrc = ytId
    ? `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&color=white`
    : null;

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
        {/* Video — YouTube iframe or native <video> */}
        <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
          {ytSrc ? (
            <iframe
              key={ytSrc}
              src={ytSrc}
              title={localTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: "none" }}
              onLoad={() => { setVideoLoaded(true); onWatched(); }}
            />
          ) : (
            <>
              <video
                ref={videoRef}
                key={videoSrc}
                src={videoSrc}
                controls
                playsInline
                preload="auto"
                className="w-full h-full object-contain"
                style={{ display: "block" }}
                onLoadedMetadata={() => setVideoLoaded(true)}
                onPlay={onWatched}
                onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = "none"; }}
              />
              {/* Placeholder shown while local video loads */}
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${accentColor}20`, border: `2px dashed ${accentColor}60` }}
                  >
                    🎬
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Info bar */}
        <div className="px-4 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {localTitle}
            </p>
            <AudienceBadge audience={video.audience} label={audienceLabel(video.audience)} />
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              {video.duration}
            </span>
            {/* Speed controls — only shown for local <video>, YouTube has its own */}
            {!ytId && (
              <div className="ml-auto flex gap-1">
                {SPEEDS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className="px-1.5 py-0.5 rounded text-xs font-mono font-bold transition-all"
                    style={{
                      backgroundColor: speed === s ? accentColor : "var(--bg-card)",
                      color: speed === s ? "#fff" : "var(--text-muted)",
                      border: `1px solid ${speed === s ? accentColor + "60" : "var(--border)"}`,
                    }}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            )}
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

// ── Audience badge ─────────────────────────────────────────────────────────────
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

// ── Filter bar ─────────────────────────────────────────────────────────────────
const ALL_AUDIENCES: (Audience | "all")[] = ["all", "beginner", "intermediate", "advanced"];

function FilterBar({
  selected, onChange, accentColor, counts, tAll, audienceLabel,
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

// ── Main panel ─────────────────────────────────────────────────────────────────
export default function ManimVideoPanel({ topicId, accentColor }: Props) {
  const t      = useTranslations("learning");
  const locale = useLocale();

  const videos = getTopicVideos(topicId);
  const [activeId, setActiveId]             = useState<string>(videos[0]?.id ?? "");
  const [audienceFilter, setAudienceFilter] = useState<Audience | "all">("all");

  // ── Watched tracking ────────────────────────────────────────────────────────
  const [watchedIds, setWatchedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`manim_watched_${topicId}`);
      return new Set<string>(saved ? JSON.parse(saved) : []);
    } catch { return new Set<string>(); }
  });

  const markWatched = useCallback((id: string) => {
    setWatchedIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem(`manim_watched_${topicId}`, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, [topicId]);

  // Reset on topic change
  useEffect(() => {
    setActiveId(videos[0]?.id ?? "");
    setAudienceFilter("all");
    try {
      const saved = localStorage.getItem(`manim_watched_${topicId}`);
      setWatchedIds(new Set<string>(saved ? JSON.parse(saved) : []));
    } catch { setWatchedIds(new Set<string>()); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  const filtered = audienceFilter === "all"
    ? videos
    : videos.filter(v => v.audience === audienceFilter);

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const idx = filtered.findIndex(v => v.id === activeId);
      if (e.key === "ArrowRight" && idx < filtered.length - 1) setActiveId(filtered[idx + 1].id);
      if (e.key === "ArrowLeft"  && idx > 0)                   setActiveId(filtered[idx - 1].id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeId, filtered]);

  if (videos.length === 0) return null;

  const audienceLabel = (a: Audience): string =>
    t(`difficulty_${a}` as Parameters<typeof t>[0]);

  const plural   = videos.length !== 1 ? t("manim_subtitle_plural" as Parameters<typeof t>[0]) : "";
  const subtitle = `${videos.length} ${t("manim_subtitle_prefix" as Parameters<typeof t>[0])}${plural} ${t("manim_subtitle_suffix" as Parameters<typeof t>[0])}`;

  const counts = ALL_AUDIENCES.reduce((acc, aud) => {
    acc[aud] = aud === "all" ? videos.length : videos.filter(v => v.audience === aud).length;
    return acc;
  }, {} as Record<Audience | "all", number>);

  const activeVideo    = videos.find(v => v.id === activeId) ?? videos[0];
  const tPlaying       = t("manim_playing"    as Parameters<typeof t>[0]);
  const tWatch         = t("manim_watch"      as Parameters<typeof t>[0]);
  const tAll           = t("manim_filter_all" as Parameters<typeof t>[0]);
  const watchedCount   = videos.filter(v => watchedIds.has(v.id)).length;

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
      className="space-y-4"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            🎥
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {t("manim_title" as Parameters<typeof t>[0])}
            </h2>
            <p className="text-xs" dir="ltr" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </p>
            {videos.length > 1 && (
              <div className="mt-1.5 max-w-[180px]">
                <WatchedBar watched={watchedCount} total={videos.length} accentColor={accentColor} />
              </div>
            )}
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
      <div className="relative">
        <div
          className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {filtered.map((video) => (
            <div key={video.id} className="snap-start flex-shrink-0">
              <VideoCard
                video={video}
                isActive={video.id === activeId}
                isWatched={watchedIds.has(video.id)}
                onClick={() => setActiveId(video.id)}
                accentColor={accentColor}
                tPlaying={tPlaying}
                tWatch={tWatch}
                audienceLabel={audienceLabel}
                localTitle={localTitle(video)}
                localDescription={localDescription(video)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard hint — desktop only */}
      {filtered.length > 1 && (
        <p className="hidden sm:block text-xs text-center" style={{ color: "var(--text-faint, var(--text-muted))" }}>
          ← → {locale === "ar" ? "للتنقل بين الفيديوهات" : locale === "fr" ? "pour naviguer entre les vidéos" : "to switch videos"}
        </p>
      )}

      {/* ── Player ──────────────────────────────────────────────────────────── */}
      {activeVideo && (
        <VideoPlayer
          video={activeVideo}
          accentColor={accentColor}
          audienceLabel={audienceLabel}
          localTitle={localTitle(activeVideo)}
          localDescription={localDescription(activeVideo)}
          videoSrc={locale === "fr" && activeVideo.srcFr ? activeVideo.srcFr : activeVideo.src}
          ytId={locale === "fr" ? (activeVideo.ytIdFr ?? activeVideo.ytId) : activeVideo.ytId}
          onWatched={() => markWatched(activeVideo.id)}
        />
      )}
    </motion.div>
  );
}
