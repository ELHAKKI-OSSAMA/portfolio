"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Clock, Tag, Zap, ChevronRight, CheckCircle2, Circle, BookMarked } from "lucide-react";
import type { LearningTopic } from "@/lib/data";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { accentInk } from "@/lib/a11yColor";
import { learningCategoryColors as C } from "@/lib/data";

// ── Category config ──────────────────────────────────────────────────────────
export const CAT_META: Record<string, { color: string; emoji: string; labelEn: string; labelFr: string; labelAr: string }> = {
  foundations:    { color:C.foundations,    emoji:"📐", labelEn:"Foundations",     labelFr:"Fondations",                      labelAr:"الأسس" },
  regression:     { color:C.regression,     emoji:"📈", labelEn:"Regression",      labelFr:"Régression",                      labelAr:"الانحدار" },
  classification: { color:C.classification, emoji:"🏷️", labelEn:"Classification",  labelFr:"Classification",                  labelAr:"التصنيف" },
  ensemble:       { color:C.ensemble,       emoji:"🌲", labelEn:"Ensembles",        labelFr:"Ensembles",                       labelAr:"المجموعة" },
  evaluation:     { color:C.evaluation,     emoji:"📊", labelEn:"Evaluation",       labelFr:"Évaluation",                      labelAr:"التقييم" },
  unsupervised:   { color:C.unsupervised,   emoji:"🔮", labelEn:"Unsupervised",     labelFr:"Non supervisé",                   labelAr:"غير مُشرف" },
  applied:        { color:C.applied,        emoji:"⚙️", labelEn:"Applied ML",       labelFr:"ML Appliqué",                     labelAr:"تطبيقي" },
  deeplearning:   { color:C.deeplearning,   emoji:"🧠", labelEn:"Deep Learning",    labelFr:"Apprentissage Profond",           labelAr:"التعلم العميق" },
  vision:         { color:C.vision,         emoji:"👁️", labelEn:"Computer Vision",  labelFr:"Vision par Ordinateur",           labelAr:"رؤية الحاسوب" },
  audio:          { color:C.audio,          emoji:"🎵", labelEn:"Audio & Speech",   labelFr:"Audio & Parole",                  labelAr:"الصوت" },
  rl:             { color:C.rl,             emoji:"🎮", labelEn:"Reinforcement RL", labelFr:"Apprentissage par Renforcement",  labelAr:"التعلم التعزيزي" },
};

export const DIFF_COLOR = { beginner:"#10b981", intermediate:"#f59e0b", advanced:"#ff6b6b" };

export type Category = "all" | keyof typeof CAT_META;

// ── Small helpers ─────────────────────────────────────────────────────────────
export function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 size={15} className="shrink-0" style={{ color:"#22c55e" }} />;
  if (status === "reading")   return <BookMarked   size={15} className="shrink-0" style={{ color:"#f97316" }} />;
  return <Circle size={15} className="shrink-0" style={{ color:"var(--text-muted)", opacity:0.35 }} />;
}

export function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 18, cx = 20, cy = 20;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={40} height={40} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy+4} textAnchor="middle" fontSize={9} fontWeight="bold" fill={color}>{pct}%</text>
    </svg>
  );
}

export function PhaseBar({ done, total, color }: { done: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor:"var(--border)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width:`${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs tabular-nums shrink-0" style={{ color:"var(--text-muted)" }}>
        {done}/{total}
      </span>
    </div>
  );
}

// ── Topic card ────────────────────────────────────────────────────────────────
export function TopicCard({
  topic, locale, getStatus,
}: { topic: LearningTopic; locale: string; getStatus: (id: string) => string }) {
  const t      = useTranslations("learning");
  const meta   = CAT_META[topic.category] || CAT_META.regression;
  const status = getStatus(topic.id);

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden card-glow transition-all duration-200 hover:translate-y-[-2px]"
      style={{
        backgroundColor: "var(--bg-card)",
        border: `1px solid ${status === "completed" ? "#22c55e40" : "var(--border)"}`,
        boxShadow: status === "completed" ? "0 0 0 1px #22c55e20" : "none",
      }}
    >
      {/* Phase-step + accent bar */}
      <div className="h-1" style={{ backgroundColor: meta.color }} />

      {/* Hero */}
      <div
        className="mx-4 mt-4 rounded-xl h-28 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: `${meta.color}0d` }}
      >
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Step badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold acc-ink"
          style={{ backgroundColor:`${meta.color}25`, ["--acc" as string]: meta.color, ["--acc-ink" as string]: accentInk(meta.color) }}>
          {topic.phase}.{topic.order}
        </div>

        <div className="relative text-center">
          <div className="text-3xl mb-1">{meta.emoji}</div>
          <div className="text-xs" style={{ color:"var(--text-muted)" }}>
            {topic.diagrams} diagrams · {topic.estimatedTime}
          </div>
        </div>

        {/* Status icon */}
        <div className="absolute top-2 right-2">
          <StatusIcon status={status} />
        </div>
      </div>

      <div className="flex-1 px-4 pt-3 pb-0">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md text-xs font-medium acc-ink"
            style={{ backgroundColor:`${meta.color}18`, ["--acc" as string]: meta.color, ["--acc-ink" as string]: accentInk(meta.color) }}>
            {locale === "fr" ? meta.labelFr : locale === "ar" ? meta.labelAr : meta.labelEn}
          </span>
          <span className="px-2 py-0.5 rounded-md text-xs font-medium acc-ink"
            style={{ backgroundColor:`${DIFF_COLOR[topic.difficulty]}15`, ["--acc" as string]: DIFF_COLOR[topic.difficulty], ["--acc-ink" as string]: accentInk(DIFF_COLOR[topic.difficulty]) }}>
            {t(`difficulty_${topic.difficulty}`)}
          </span>
          <span className="flex items-center gap-1 text-xs ml-auto" style={{ color:"var(--text-muted)" }}>
            <Clock size={10} />{topic.estimatedTime}
          </span>
        </div>

        <h3 className="font-semibold text-base leading-snug mb-1.5" style={{ color:"var(--text-primary)" }}>
          {locale === "fr" && topic.titleFr ? topic.titleFr
            : locale === "ar" && topic.titleAr ? topic.titleAr
            : topic.title}
        </h3>
        <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color:"var(--text-muted)" }}>
          {locale === "fr" && topic.descriptionFr ? topic.descriptionFr
            : locale === "ar" && topic.descriptionAr ? topic.descriptionAr
            : topic.description}
        </p>

        {/* Concepts */}
        <div className="flex flex-wrap gap-1 mb-3">
          {topic.concepts.slice(0, 4).map(c => (
            <span key={c} className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded"
              style={{ backgroundColor:"var(--tag-bg)", color:"var(--tag-color)" }}>
              <Tag size={8} />{c}
            </span>
          ))}
          {topic.concepts.length > 4 && (
            <span className="text-xs" style={{ color:"var(--text-muted)" }}>+{topic.concepts.length - 4}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 flex items-center justify-between border-t"
        style={{ borderColor:"var(--border)" }}>
        <div className="text-xs" style={{ color:"var(--text-muted)" }}>
          {status === "completed" ? <span style={{ color:"#22c55e" }}>✓ Completed</span>
            : status === "reading" ? <span style={{ color:"#f97316" }}>● In progress</span>
            : <span>{topic.prerequisites.length > 0 ? `${topic.prerequisites.length} prereq${topic.prerequisites.length > 1 ? "s" : ""}` : "No prereqs"}</span>}
        </div>
        <Link
          href={`/${locale}/learning/${topic.id}`}
          className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: meta.color }}
        >
          <Zap size={10} />
          {t("deep_dive")}
          <ChevronRight size={10} />
        </Link>
      </div>
    </div>
  );
}

// ── Phase section header ──────────────────────────────────────────────────────
export function PhaseHeader({
  phaseNum, emoji, title, titleFr, description, color, topics, getStatus, locale,
}: {
  phaseNum: number; emoji: string; title: string; titleFr: string;
  description: string; color: string; topics: LearningTopic[];
  getStatus: (id: string) => string; locale: string;
}) {
  const totalMin = topics.reduce((acc, t) => {
    const m = parseInt(t.estimatedTime);
    return acc + (isNaN(m) ? 0 : m);
  }, 0);
  const completedInPhase = topics.filter(t => getStatus(t.id) === "completed").length;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-2">
        {/* Phase pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor:`${color}18`, border:`1px solid ${color}30` }}>
          <span className="text-base leading-none">{emoji}</span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
            Phase {phaseNum}
          </span>
        </div>

        {/* Divider line */}
        <div className="flex-1 h-px" style={{ backgroundColor:`${color}25` }} />

        {/* Total time */}
        <div className="flex items-center gap-1 text-xs shrink-0" style={{ color:"var(--text-muted)" }}>
          <Clock size={11} />
          {totalMin >= 60 ? `${Math.floor(totalMin/60)}h ${totalMin%60}min` : `${totalMin} min`}
          <span className="mx-1 opacity-30">·</span>
          {topics.length} topic{topics.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color:"var(--text-primary)" }}>
            {locale === "fr" ? titleFr : title}
          </h2>
          <p className="text-sm mt-0.5" style={{ color:"var(--text-muted)" }}>{description}</p>
        </div>
        <div className="shrink-0 w-36">
          <PhaseBar done={completedInPhase} total={topics.length} color={color} />
        </div>
      </div>
    </div>
  );
}
