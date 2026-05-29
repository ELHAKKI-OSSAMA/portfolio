"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { quizData as quizBank, QuizQuestion } from "@/lib/quizData";
import { getQuizI18n } from "@/lib/quizI18n";
import { useQuizProgress } from "@/hooks/useQuizProgress";

interface Props {
  topicId: string;
  accentColor?: string;
  onPassed?: () => void;
}

export default function QuizBlock({ topicId, accentColor = "#6c63ff", onPassed }: Props) {
  const t = useTranslations("learning");
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const questions: QuizQuestion[] = quizBank[topicId] ?? [];
  const { saveQuizResult, getQuizResult } = useQuizProgress();
  const prevResult = getQuizResult(topicId);

  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [finalResult, setFinalResult] = useState(prevResult);

  if (!questions.length) return null;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[qIndex].correct;
    const next = [...answers, correct];
    setAnswers(next);
    if (qIndex === questions.length - 1) {
      const score = next.filter(Boolean).length;
      const result = saveQuizResult(topicId, score, questions.length);
      setFinalResult(result);
      if (result.passed) onPassed?.();
      setTimeout(() => setDone(true), 900);
    }
  }

  function handleNext() {
    setQIndex(q => q + 1);
    setSelected(null);
    setAnswered(false);
  }

  function handleRetry() {
    setStarted(false);
    setQIndex(0);
    setSelected(null);
    setAnswered(false);
    setAnswers([]);
    setDone(false);
    setFinalResult(getQuizResult(topicId));
  }

  // Arabic option labels: أ ب ج د  (alef, ba, jim, dal)
  const ARABIC_LABELS = ["أ", "ب", "ج", "د", "هـ"];
  const optionLabel = (i: number) =>
    locale === "ar" ? (ARABIC_LABELS[i] ?? (i + 1).toString()) : String.fromCharCode(65 + i);

  const q  = questions[qIndex];
  const tr = getQuizI18n(topicId, qIndex);
  const qText    = locale === "fr" ? (tr?.questionFr    ?? q.question)    : locale === "ar" ? (tr?.questionAr    ?? q.question)    : q.question;
  const qOptions = locale === "fr" ? (tr?.optionsFr     ?? q.options)     : locale === "ar" ? (tr?.optionsAr     ?? q.options)     : q.options;
  const qExpl    = locale === "fr" ? (tr?.explanationFr ?? q.explanation) : locale === "ar" ? (tr?.explanationAr ?? q.explanation) : q.explanation;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {t("knowledge_check")}
        </span>
        {finalResult && (
          <span className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: finalResult.passed ? "#22c55e22" : "#f9731622",
              color: finalResult.passed ? "#22c55e" : "#f97316",
            }}>
            {finalResult.passed
              ? `${t("completed_badge")} ${finalResult.score}/${finalResult.total}`
              : `${finalResult.score}/${finalResult.total} — ${t("retry")}`}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="px-5 py-6 flex flex-col items-center gap-4">
            <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
              {questions.length} {t("quiz_intro")} {Math.ceil(questions.length * 0.6)}/{questions.length}
            </p>
            <button onClick={() => setStarted(true)}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: accentColor, color: "#fff" }}>
              {prevResult ? t("retake_quiz") : t("start_quiz")}
            </button>
          </motion.div>
        ) : done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="px-5 py-6 flex flex-col items-center gap-3">
            <div className="text-3xl font-black font-mono" style={{ color: finalResult?.passed ? "#22c55e" : "#f97316" }}>
              {finalResult?.score}/{finalResult?.total}
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {finalResult?.passed ? t("quiz_passed") : t("quiz_failed")}
            </p>
            <button onClick={handleRetry}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-80 transition-opacity"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              {t("retry")}
            </button>
          </motion.div>
        ) : (
          <motion.div key={qIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="px-5 py-4 flex flex-col gap-3">
            {/* progress */}
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: i < answers.length
                      ? answers[i] ? "#22c55e" : "#f97316"
                      : i === qIndex
                        ? `${accentColor}44`
                        : "var(--border)",
                  }} />
              ))}
            </div>

            {/* question */}
            <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {qText}
            </p>

            {/* options */}
            <div className="flex flex-col gap-2">
              {qOptions.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isSelected = i === selected;
                let bg = "var(--bg-subtle)";
                let border = "var(--border)";
                let textCol = "var(--text-secondary)";

                if (answered) {
                  if (isCorrect) { bg = "#22c55e22"; border = "#22c55e"; textCol = "#22c55e"; }
                  else if (isSelected && !isCorrect) { bg = "#f9731622"; border = "#f97316"; textCol = "#f97316"; }
                } else if (isSelected) {
                  bg = `${accentColor}22`; border = accentColor; textCol = accentColor;
                }

                return (
                  <motion.button key={i} onClick={() => handleSelect(i)}
                    whileHover={!answered ? { scale: 1.01 } : undefined}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border transition-all"
                    style={{
                      backgroundColor: bg, borderColor: border, color: textCol,
                      textAlign: locale === "ar" ? "right" : "left",
                    }}>
                    <span className={`font-semibold ${locale === "ar" ? "ml-2" : "mr-2"}`}>
                      {optionLabel(i)}.
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* explanation */}
            <AnimatePresence>
              {answered && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl px-4 py-3 text-xs leading-relaxed"
                  style={{
                    backgroundColor: selected === q.correct ? "#22c55e11" : "#f9731611",
                    color: "var(--text-secondary)",
                    // Border on the inline-start side (right in RTL, left in LTR)
                    ...(locale === "ar"
                      ? { borderRight: `3px solid ${selected === q.correct ? "#22c55e" : "#f97316"}` }
                      : { borderLeft:  `3px solid ${selected === q.correct ? "#22c55e" : "#f97316"}` }),
                  }}>
                  {qExpl}
                </motion.div>
              )}
            </AnimatePresence>

            {answered && qIndex < questions.length - 1 && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={handleNext}
                className="self-end px-4 py-1.5 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: accentColor, color: "#fff" }}>
                {locale === "ar" ? `← ${t("next")}` : `${t("next")} →`}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
