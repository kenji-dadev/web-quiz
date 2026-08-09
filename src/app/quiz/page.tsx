"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import wordsData from "@/data/words.json";
import QuizCard from "@/components/QuizCard";
import QuizResult from "@/components/QuizResult";
import { calculateScore, checkAnswer, generateQuiz } from "@/lib/quiz";
import type { QuizMode, QuizQuestion, Word, WrongAnswer } from "@/types/word";

const VALID_MODES: QuizMode[] = ["en-to-th", "th-to-en"];

function parseQuizSize(value: string | null): number {
  const size = Number(value);
  if (!Number.isFinite(size) || size <= 0) {
    return 10;
  }

  return size;
}

function parseQuizMode(value: string | null): QuizMode {
  if (value && VALID_MODES.includes(value as QuizMode)) {
    return value as QuizMode;
  }

  return "en-to-th";
}

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const words = wordsData as Word[];

  const requestedSize = parseQuizSize(searchParams.get("size"));
  const quizMode = parseQuizMode(searchParams.get("mode"));
  const [retryCount, setRetryCount] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(
    null
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    setQuizQuestions(generateQuiz(words, requestedSize, quizMode));
  }, [words, requestedSize, quizMode, retryCount]);

  if (quizQuestions === null) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
        <p className="text-lg font-medium text-slate-600">Preparing quiz...</p>
      </div>
    );
  }

  const totalQuestions = quizQuestions.length;
  const activeQuestion = quizQuestions[currentQuestion];
  const answeredCount = showResult ? currentQuestion + 1 : currentQuestion;

  function handleSelectAnswer(answer: string) {
    if (showResult || !activeQuestion) {
      return;
    }

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = checkAnswer(answer, activeQuestion.correctAnswer);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      return;
    }

    setWrongAnswers((prev) => [
      ...prev,
      {
        word: activeQuestion.word.word,
        meaning: activeQuestion.word.meaning,
      },
    ]);
  }

  function handleNextQuestion() {
    if (currentQuestion >= totalQuestions - 1) {
      setQuizFinished(true);
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  }

  function handleTryAgain() {
    setRetryCount((prev) => prev + 1);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setWrongAnswers([]);
    setQuizFinished(false);
  }

  if (totalQuestions === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">No words available</h1>
          <p className="mt-3 text-slate-600">
            Add vocabulary to{" "}
            <code className="text-sm">src/data/words.json</code> to start a quiz.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
        <QuizResult
          score={calculateScore(totalQuestions, wrongAnswers.length)}
          totalQuestions={totalQuestions}
          wrongAnswers={wrongAnswers}
          onTryAgain={handleTryAgain}
        />
      </div>
    );
  }

  if (!activeQuestion) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <QuizCard
        question={activeQuestion}
        currentIndex={currentQuestion}
        totalQuestions={totalQuestions}
        score={score}
        answeredCount={answeredCount}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        onSelectAnswer={handleSelectAnswer}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={currentQuestion === totalQuestions - 1}
      />
    </div>
  );
}
