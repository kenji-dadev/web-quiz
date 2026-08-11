"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReviewWords } from "@/lib/reviewWords";
import type { QuizMode } from "@/types/word";

const QUIZ_SIZES = [10, 20, 50, 100] as const;

type QuizSetupProps = {
  wordCount: number;
};

export default function QuizSetup({ wordCount }: QuizSetupProps) {
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

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
      <p className="text-center text-xs font-medium text-slate-500 sm:text-sm">
        {wordCount.toLocaleString("en-US")} Words
      </p>
      {reviewCount > 0 ? (
        <p className="mt-2 px-1 text-center text-xs text-amber-700 sm:text-sm">
          {reviewCount.toLocaleString("en-US")} words to review will be included
        </p>
      ) : null}

      <div className="mt-6 sm:mt-8">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-700 sm:text-sm">
          Quiz Mode
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setQuizMode("en-to-th")}
            className={`min-h-11 rounded-xl border px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
              quizMode === "en-to-th"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            English → Thai
          </button>
          <button
            type="button"
            onClick={() => setQuizMode("th-to-en")}
            className={`min-h-11 rounded-xl border px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
              quizMode === "th-to-en"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            Thai → English
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-700 sm:text-sm">
          Quiz Size
        </p>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {QUIZ_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setQuizSize(size)}
              className={`min-h-11 rounded-xl border px-2 py-3 text-sm font-medium transition-colors sm:px-4 sm:text-base ${
                quizSize === size
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleStartQuiz}
        className="mt-6 min-h-12 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:mt-8 sm:px-6 sm:py-4 sm:text-lg"
      >
        Start Quiz
      </button>
    </div>
  );
}
