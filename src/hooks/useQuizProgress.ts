"use client";
import { useState, useCallback } from "react";

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  completedAt: string;
}

const STORAGE_KEY = "ml-quiz-progress-v1";

function load(): Record<string, QuizResult> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function save(data: Record<string, QuizResult>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useQuizProgress() {
  const [results, setResults] = useState<Record<string, QuizResult>>(load);

  const saveQuizResult = useCallback((topicId: string, score: number, total: number) => {
    const result: QuizResult = {
      score,
      total,
      passed: score / total >= 0.6,
      completedAt: new Date().toISOString(),
    };
    setResults(prev => {
      const updated = { ...prev, [topicId]: result };
      save(updated);
      return updated;
    });
    return result;
  }, []);

  const getQuizResult = useCallback((topicId: string): QuizResult | null => {
    return results[topicId] ?? null;
  }, [results]);

  const hasPassedQuiz = useCallback((topicId: string): boolean => {
    return results[topicId]?.passed ?? false;
  }, [results]);

  return { saveQuizResult, getQuizResult, hasPassedQuiz, results };
}
