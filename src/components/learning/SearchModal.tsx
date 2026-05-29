"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Fuse from "fuse.js";
import { learningTopics, LearningTopic } from "@/lib/data/learningTopics";

const CATEGORY_ACCENT: Record<string, string> = {
  foundations:    "#06b6d4",
  regression:     "#6c63ff",
  classification: "#ff6b6b",
  ensemble:       "#f97316",
  evaluation:     "#06b6d4",
  unsupervised:   "#8b5cf6",
  applied:        "#22c55e",
  deeplearning:   "#a78bfa",
  vision:         "#ec4899",
  nlp:            "#00d4aa",
  audio:          "#84cc16",
  generative:     "#f59e0b",
  rl:             "#f43f5e",
};

const fuse = new Fuse(learningTopics, {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "concepts", weight: 0.3 },
    { name: "description", weight: 0.2 },
  ],
  threshold: 0.35,
  includeScore: true,
});

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const t = useTranslations("learning");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const inputRef = useRef<HTMLInputElement>(null);

  const results: LearningTopic[] = useMemo(
    () => query.trim() ? fuse.search(query).map(r => r.item) : learningTopics.slice(0, 8),
    [query],
  );

  // Stable refs so the keydown handler doesn't need to re-register on every keystroke
  const resultsRef = useRef(results);
  const activeIndexRef = useRef(activeIndex);
  resultsRef.current = results;
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const navigate = useCallback((topic: LearningTopic) => {
    router.push(`/${locale}/learning/${topic.id}`);
    onClose();
  }, [router, locale, onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) return;
      const res = resultsRef.current;
      const idx = activeIndexRef.current;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, res.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && res[idx]) navigate(res[idx]);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, navigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
            onClick={onClose}
          />
          {/* modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>

            {/* search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <circle cx="6.5" cy="6.5" r="5" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <path d="M10 10L14 14" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t("search_placeholder")}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--text-primary)" }}
              />
              <kbd className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                esc
              </kbd>
            </div>

            {/* results */}
            <div className="max-h-80 overflow-y-auto py-1">
              {results.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: "var(--text-secondary)" }}>
                  No topics found
                </p>
              )}
              {results.map((topic, i) => {
                const accent = CATEGORY_ACCENT[topic.category] ?? "#6c63ff";
                const isActive = i === activeIndex;
                return (
                  <button key={topic.id}
                    className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                    style={{ backgroundColor: isActive ? "var(--bg-subtle)" : "transparent" }}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => navigate(topic)}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {locale === "fr" ? topic.titleFr : locale === "ar" ? topic.titleAr : topic.title}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                        {topic.concepts.slice(0, 4).join(" · ")}
                      </p>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
                      {topic.estimatedTime}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* footer hint */}
            <div className="px-4 py-2 border-t flex gap-4 text-xs" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              <span><kbd className="font-mono">↑↓</kbd> {t("search_navigate")}</span>
              <span><kbd className="font-mono">↵</kbd> {t("search_open")}</span>
              <span><kbd className="font-mono">esc</kbd> {t("search_close")}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
