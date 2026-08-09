"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizMode } from "@/types/word";

const QUIZ_SIZES = [10, 20, 50, 100] as const;

type QuizSetupProps = {
  wordCount: number;
};

export default function QuizSetup({ wordCount }: QuizSetupProps) {
  const router = useRouter();
  const [quizSize, setQuizSize] = useState<number>(10);
  const [quizMode, setQuizMode] = useState<QuizMode>("en-to-th");

  function handleStartQuiz() {
    router.push(`/quiz?size=${quizSize}&mode=${quizMode}`);
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-center text-sm font-medium text-slate-500">
        {wordCount.toLocaleString("en-US")} Words
      </p>

      <div className="mt-8">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-700">
          Quiz Mode
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setQuizMode("en-to-th")}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
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
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              quizMode === "th-to-en"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            Thai → English
          </button>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-700">
          Quiz Size
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUIZ_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setQuizSize(size)}
              className={`rounded-xl border px-4 py-3 text-base font-medium transition-colors ${
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
        className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Start Quiz
      </button>
    </div>
  );
}
