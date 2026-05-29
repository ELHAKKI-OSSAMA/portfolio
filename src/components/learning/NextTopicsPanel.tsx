"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { learningTopics, LearningTopic } from "@/lib/data/learningTopics";
import { useTopicProgress } from "@/hooks/useTopicProgress";

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

function accentFor(topic: LearningTopic) {
  return CATEGORY_ACCENT[topic.category] ?? "#6c63ff";
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     "#22c55e",
  intermediate: "#f97316",
  advanced:     "#f43f5e",
};

export default function NextTopicsPanel() {
  const t = useTranslations("learning");
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const currentId = params?.id as string;
  const { getStatus } = useTopicProgress();

  const completedIds = useMemo(
    () => new Set(learningTopics.filter(t => getStatus(t.id) === "completed").map(t => t.id)),
    [getStatus, currentId],
  );

  const suggestions = useMemo(() => {
    return learningTopics
      .filter(t => {
        if (t.id === currentId) return false;
        if (completedIds.has(t.id)) return false;
        // All prerequisites satisfied
        const prereqsMet = t.prerequisites.every(prereqTitle => {
          const prereqTopic = learningTopics.find(x =>
            x.title.toLowerCase().includes(prereqTitle.toLowerCase()) ||
            prereqTitle.toLowerCase().includes(x.title.toLowerCase().split(":")[0])
          );
          return prereqTopic ? completedIds.has(prereqTopic.id) : false;
        });
        return prereqsMet;
      })
      .sort((a, b) => {
        // prefer same phase or next phase; then by order
        const aPhase = a.phase, bPhase = b.phase;
        if (aPhase !== bPhase) return aPhase - bPhase;
        return a.order - b.order;
      })
      .slice(0, 3);
  }, [completedIds, currentId]);

  if (!suggestions.length) return null;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {t("what_to_study_next")}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {suggestions.map((topic, i) => {
          const accent = accentFor(topic);
          return (
            <motion.div key={topic.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}>
              <Link href={`/${locale}/learning/${topic.id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-subtle)" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {locale === "fr" ? topic.titleFr : locale === "ar" ? topic.titleAr : topic.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {topic.estimatedTime}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: `${DIFFICULTY_COLOR[topic.difficulty]}22`,
                    color: DIFFICULTY_COLOR[topic.difficulty],
                  }}>
                  {t(`difficulty_${topic.difficulty}`)}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
