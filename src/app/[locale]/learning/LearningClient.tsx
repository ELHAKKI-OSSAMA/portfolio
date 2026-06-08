"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, X, GraduationCap, Clock } from "lucide-react";
import { learningTopics, PHASES } from "@/lib/data";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import dynamic from "next/dynamic";
import {
  CAT_META, DIFF_COLOR, Category,
  ProgressRing, TopicCard, PhaseHeader,
} from "./LearningParts";

const PrerequisiteGraph = dynamic(
  () => import("@/components/learning/PrerequisiteGraph"),
  { ssr: false }
);

const SearchModal = dynamic(
  () => import("@/components/learning/SearchModal"),
  { ssr: false }
);

// ── Main component ────────────────────────────────────────────────────────────
export default function LearningClient() {
  const t = useTranslations("learning");
  const locale = useLocale();
  const { getStatus, completedCount } = useTopicProgress();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  const totalTopics = learningTopics.length;
  const overallPct  = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // ── Filter topics ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = activeCategory === "all"
      ? learningTopics
      : learningTopics.filter(tp => tp.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(tp =>
        tp.title.toLowerCase().includes(q) ||
        tp.description.toLowerCase().includes(q) ||
        tp.concepts.some(c => c.toLowerCase().includes(q)) ||
        tp.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, query]);

  // ── Group by phase (sorted by phase then order) ────────────────────────────
  const byPhase = useMemo(() => {
    const sorted = [...filtered].sort((a, b) =>
      a.phase !== b.phase ? a.phase - b.phase : a.order - b.order
    );
    const map = new Map<number, typeof sorted>();
    for (const tp of sorted) {
      if (!map.has(tp.phase)) map.set(tp.phase, []);
      map.get(tp.phase)!.push(tp);
    }
    return map;
  }, [filtered]);

  const isSearching = query.trim().length > 0 || activeCategory !== "all";

  return (
    <div className="min-h-screen pt-24 section-padding">
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6c63ff]/30 bg-[#6c63ff]/10 text-[#6c63ff] text-sm font-medium mb-6">
            <GraduationCap size={14} />
            Nobody → ML Engineer · {totalTopics} topics
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color:"var(--text-primary)" }}>
            {t("title")}
          </h1>
          <p className="max-w-2xl mx-auto mb-6 text-base" style={{ color:"var(--filter-btn-text, var(--text-secondary))" }}>
            {t("subtitle")}
          </p>

          {/* Overall progress */}
          {completedCount > 0 && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border"
              style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
              <ProgressRing pct={overallPct} color="#22c55e" />
              <div className="text-left">
                <div className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
                  {t("progress_summary", { completed: completedCount, total: totalTopics })}
                </div>
                <div className="text-xs" style={{ color:"var(--text-muted)" }}>
                  {t("progress_keep_going")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Phase roadmap (compact, always visible) ───────────────────────── */}
        <div className="hidden md:flex items-center justify-center gap-0 mb-10 overflow-x-auto pb-1">
          {PHASES.map((ph, i) => {
            const count    = learningTopics.filter(tp => tp.phase === ph.phase).length;
            const done     = learningTopics.filter(tp => tp.phase === ph.phase && getStatus(tp.id) === "completed").length;
            const isActive = activeCategory === "all"
              || learningTopics.some(tp => tp.phase === ph.phase && tp.category === activeCategory);
            return (
              <div key={ph.phase} className="flex items-center">
                <button
                  onClick={() => { setActiveCategory("all"); setQuery(""); }}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
                  style={{ opacity: isActive ? 1 : 0.35 }}
                  title={ph.description}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                    style={{ backgroundColor:`${ph.color}20`, border:`2px solid ${done === count && count > 0 ? ph.color : ph.color+"40"}` }}>
                    {done === count && count > 0 ? "✓" : ph.emoji}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: ph.color }}>
                    Ph.{ph.phase}
                  </span>
                  <span className="text-xs whitespace-nowrap" style={{ color:"var(--text-muted)" }}>
                    {done}/{count}
                  </span>
                </button>
                {i < PHASES.length - 1 && (
                  <div className="w-6 h-px mx-0.5" style={{ backgroundColor:"var(--border)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Search ────────────────────────────────────────────────────────── */}
        <div className="relative max-w-xl mx-auto mb-5">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color:"var(--text-muted)" }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full pl-11 pr-24 py-3 rounded-2xl border text-sm outline-none transition-all"
            style={{
              backgroundColor:"var(--bg-card)",
              borderColor: query ? "#6c63ff" : "var(--border)",
              color:"var(--text-primary)",
              boxShadow: query ? "0 0 0 3px #6c63ff18" : "none",
            }}
          />
          {query ? (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color:"var(--text-muted)" }}>
              <X size={14} />
            </button>
          ) : (
            <button onClick={openSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono"
              style={{ backgroundColor:"var(--bg-subtle)", color:"var(--text-muted)", border:"1px solid var(--border)" }}>
              ⌘K
            </button>
          )}
        </div>
        {query && (
          <p className="text-center text-sm mb-5" style={{ color:"var(--text-muted)" }}>
            <span>{filtered.length} </span>
            <span>{t("search_results_for")}</span>
            <span style={{ color:"#6c63ff" }}> &quot;{query}&quot;</span>
          </p>
        )}

        {/* ── Category filter chips ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 justify-center mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={activeCategory === "all"
              ? { backgroundColor:"var(--primary)", color:"#fff" }
              : { backgroundColor:"var(--filter-btn-bg)", border:"1px solid var(--filter-btn-border)", color:"var(--filter-btn-text, var(--text-secondary))" }}
          >
            {t("all")} ({totalTopics})
          </button>
          {Object.entries(CAT_META).map(([cat, meta]) => {
            const count = learningTopics.filter(tp => tp.category === cat).length;
            if (count === 0) return null;
            return (
              <button key={cat}
                onClick={() => setActiveCategory(cat as Category)}
                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={activeCategory === cat
                  ? { backgroundColor: meta.color, color:"#fff" }
                  : { backgroundColor:"var(--filter-btn-bg)", border:"1px solid var(--filter-btn-border)", color:"var(--filter-btn-text, var(--text-secondary))" }}
              >
                <span className="mr-1">{meta.emoji}</span>
                {locale === "fr" ? meta.labelFr : meta.labelEn}
                <span className="ml-1.5 opacity-60 text-xs">({count})</span>
              </button>
            );
          })}
        </div>

        {/* ── Topic grid — grouped by phase ─────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="mb-3" style={{ color:"var(--text-muted)" }}>No topics match &quot;{query}&quot;</p>
            <button onClick={() => { setQuery(""); setActiveCategory("all"); }}
              className="text-sm underline" style={{ color:"#6c63ff" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-14 mb-12">
            {Array.from(byPhase.entries()).map(([phaseNum, topics]) => {
              const phaseInfo = PHASES.find(p => p.phase === phaseNum);
              if (!phaseInfo) return null;

              return (
                <section key={phaseNum}>
                  <PhaseHeader
                    phaseNum={phaseNum}
                    emoji={phaseInfo.emoji}
                    title={phaseInfo.title}
                    titleFr={phaseInfo.titleFr}
                    description={phaseInfo.description}
                    color={phaseInfo.color}
                    topics={topics}
                    getStatus={getStatus}
                    locale={locale}
                  />

                  {/* ── Ordered steps connector (desktop) + cards ──────────── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {topics.map(topic => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        locale={locale}
                        getStatus={getStatus}
                      />
                    ))}
                  </div>

                  {/* ── Horizontal step progress (shown when not searching) ── */}
                  {!isSearching && (
                    <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                      {topics.map((tp, idx) => {
                        const st = getStatus(tp.id);
                        const phColor = phaseInfo.color;
                        return (
                          <div key={tp.id} className="flex items-center gap-2 shrink-0">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                              style={{
                                borderColor: st === "completed" ? "#22c55e" : st === "reading" ? "#f97316" : phColor + "50",
                                backgroundColor: st === "completed" ? "#22c55e20" : st === "reading" ? "#f9731620" : "transparent",
                                color: st === "completed" ? "#22c55e" : st === "reading" ? "#f97316" : "var(--text-muted)",
                              }}
                            >
                              {st === "completed" ? "✓" : idx + 1}
                            </div>
                            {idx < topics.length - 1 && (
                              <div className="w-8 h-px" style={{
                                backgroundColor: st === "completed" ? "#22c55e60" : phColor + "25",
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {/* ── Prerequisite Dependency Graph ─────────────────────────────────── */}
        {!query && (
          <div className="mb-12">
            <PrerequisiteGraph />
          </div>
        )}

        {/* ── Coming soon ────────────────────────────────────────────────────── */}
        <div className="text-center py-10 rounded-2xl border border-dashed mb-10"
          style={{ borderColor:"var(--border-strong)" }}>
          <div className="text-3xl mb-3">🚀</div>
          <p style={{ color:"var(--text-muted)" }}>{t("coming_soon")}</p>
          <p className="text-sm mt-1" style={{ color:"var(--filter-btn-text, var(--text-secondary))" }}>
            Diffusion Models · Graph Neural Networks · MLOps · LLM Fine-tuning · Causal ML
          </p>
        </div>

      </div>
    </div>
  );
}
