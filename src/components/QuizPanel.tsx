"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudMascot, QuizMarkIcon } from "@/components/illustrations";
import { getReviewWords } from "@/lib/reviewWords";
import type { QuizMode } from "@/types/word";

const QUIZ_SIZES = [10, 20, 50, 100] as const;

type QuizPanelProps = {
  wordCount: number;
};

export default function QuizPanel({ wordCount }: QuizPanelProps) {
  const router = useRouter();
  const [quizSize, setQuizSize] = useState<number>(10);
  const [quizMode, setQuizMode] = useState<QuizMode>("en-to-th");
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    setReviewCount(getReviewWords().length);
  }, []);

  function handleStartQuiz() {
    router.push(`/quiz?size=${quizSize}&mode=${quizMode}`);
  }

  const progressPercent =
    reviewCount > 0 ? Math.min((reviewCount / quizSize) * 100, 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_12px_40px_-12px_rgba(59,130,246,0.18)] ring-1 ring-blue-100/80 sm:p-6 md:p-7">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40" />

      <span className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-sky-100 to-amber-50 px-3 py-1 text-xs font-semibold text-blue-600 sm:right-5 sm:top-5">
        ✨ Challenge yourself!
      </span>

      <div className="relative z-10 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 shadow-md shadow-blue-200">
          <QuizMarkIcon />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">Quiz</h2>
          <p className="text-sm text-slate-500">Test your vocabulary skills</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3">
        <select
          value={quizSize}
          onChange={(e) => setQuizSize(Number(e.target.value))}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          aria-label="Number of questions"
        >
          {QUIZ_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} Questions
            </option>
          ))}
        </select>

        <select
          value={quizMode}
          onChange={(e) => setQuizMode(e.target.value as QuizMode)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          aria-label="Quiz direction"
        >
          <option value="en-to-th">EN → TH</option>
          <option value="th-to-en">TH → EN</option>
        </select>

        <button
          type="button"
          onClick={handleStartQuiz}
          className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-600 active:scale-[0.98]"
        >
          Start Quiz →
        </button>
      </div>

      <div className="relative z-10 mt-5 pr-24 sm:pr-28">
        <div className="rounded-2xl border border-blue-100/80 bg-white/90 p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">Your Progress</span>
            <span className="font-bold text-blue-600">
              {reviewCount} / {quizSize}
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {reviewCount > 0 ? (
            <p className="mt-2 text-xs text-slate-500">
              {reviewCount.toLocaleString("en-US")} words to review from past quizzes
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              {wordCount.toLocaleString("en-US")} words available
            </p>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-1 -right-1 z-10 sm:bottom-1 sm:right-2">
        <CloudMascot />
      </div>
    </div>
  );
}
