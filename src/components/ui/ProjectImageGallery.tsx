"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, Images } from "lucide-react";
import type { ProjectImage } from "@/lib/data/projects/images";

interface Props {
  images: ProjectImage[];
  projectTitle: string;
  accentColor: string;
  visualizationsLabel?: string;
  chartsLabel?: string;
  moreChartsLabel?: string;
}

const MAX_VISIBLE = 5;

export default function ProjectImageGallery({
  images,
  projectTitle,
  accentColor,
  visualizationsLabel = "Visualizations",
  chartsLabel = "charts",
  moreChartsLabel = "more charts",
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const prev = useCallback(() =>
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next = useCallback(() =>
    setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i)), [images.length]);
  const close = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next, close]);

  if (!images || images.length === 0) return null;

  const overflow = images.length > MAX_VISIBLE ? images.length - (MAX_VISIBLE - 1) : 0;
  const visibleImages = overflow > 0 ? images.slice(0, MAX_VISIBLE - 1) : images;

  return (
    <div
      className="p-5 sm:p-6 rounded-2xl border mb-8"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        <Images size={15} style={{ color: accentColor }} />
        {visualizationsLabel}
        <span
          className="ml-auto text-xs font-normal px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {images.length} {chartsLabel}
        </span>
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {visibleImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="group relative overflow-hidden rounded-xl border flex flex-col transition-all hover:scale-[1.02] focus-visible:outline-none"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-main)" }}
            aria-label={`View: ${img.caption}`}
          >
            <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
              <Image
                src={img.src}
                alt={img.caption}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-opacity group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-full p-1.5" style={{ backgroundColor: `${accentColor}cc` }}>
                  <ZoomIn size={14} className="text-white" />
                </div>
              </div>
            </div>
            <p
              className="text-[10px] leading-snug px-2 py-1.5 text-left line-clamp-2"
              style={{ color: "var(--text-muted)" }}
            >
              {img.caption}
            </p>
          </button>
        ))}

        {/* Overflow tile */}
        {overflow > 0 && (
          <button
            onClick={() => setLightboxIndex(MAX_VISIBLE - 1)}
            className="relative overflow-hidden rounded-xl border flex items-center justify-center transition-all hover:scale-[1.02]"
            style={{
              aspectRatio: "16/10",
              borderColor: "var(--border)",
              backgroundColor: `${accentColor}12`,
            }}
            aria-label={`View all ${images.length} ${chartsLabel}`}
          >
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: accentColor }}>+{overflow}</p>
              <p className="text-xs mt-0.5" style={{ color: accentColor }}>{moreChartsLabel}</p>
            </div>
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.93)" }}
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all z-10"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={lightboxIndex === 0}
            className="absolute left-3 sm:left-5 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image + caption */}
          <div
            className="relative mx-16 sm:mx-24 max-w-4xl w-full flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].caption}
              width={1280}
              height={800}
              className="w-full h-auto rounded-xl"
              style={{ maxHeight: "72vh", objectFit: "contain" }}
              priority
            />
            {images[lightboxIndex].caption && (
              <p
                className="text-sm text-center px-4 py-2 rounded-lg max-w-2xl"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              >
                {images[lightboxIndex].caption}
              </p>
            )}
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={lightboxIndex === images.length - 1}
            className="absolute right-3 sm:right-5 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 z-10"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 overflow-x-auto max-w-xs sm:max-w-lg px-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className="shrink-0 rounded overflow-hidden transition-all"
                style={{
                  width: 44,
                  height: 30,
                  outline: i === lightboxIndex ? `2px solid ${accentColor}` : "2px solid transparent",
                  opacity: i === lightboxIndex ? 1 : 0.45,
                }}
                title={img.caption}
              >
                <Image src={img.src} alt="" width={44} height={30} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
