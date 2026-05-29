"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ml-topic-progress-v1";

export type TopicStatus = "unread" | "reading" | "completed";
export type ProgressMap = Record<string, TopicStatus>;

export function useTopicProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  // Hydrate from localStorage on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved) as ProgressMap);
    } catch {
      // localStorage not available (SSR / privacy mode)
    }
  }, []);

  const persist = useCallback((next: ProgressMap) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const setStatus = useCallback(
    (id: string, status: TopicStatus) => {
      setProgress((prev) => {
        const next = { ...prev, [id]: status };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  /** Mark as reading only if not already started */
  const markReading = useCallback(
    (id: string) => {
      setProgress((prev) => {
        if (prev[id]) return prev;
        const next = { ...prev, [id]: "reading" as TopicStatus };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const markComplete = useCallback((id: string) => setStatus(id, "completed"), [setStatus]);
  const markUnread   = useCallback((id: string) => setStatus(id, "unread"),    [setStatus]);

  const getStatus = useCallback(
    (id: string): TopicStatus => progress[id] ?? "unread",
    [progress]
  );

  const completedCount = Object.values(progress).filter((s) => s === "completed").length;
  const readingCount   = Object.values(progress).filter((s) => s === "reading").length;

  const resetAll = useCallback(() => {
    setProgress({});
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return {
    progress,
    getStatus,
    markComplete,
    markReading,
    markUnread,
    resetAll,
    completedCount,
    readingCount,
  };
}
