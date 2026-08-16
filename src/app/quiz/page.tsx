"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import wordsData from "@/data/words.json";
import QuizCard from "@/components/QuizCard";
import QuizResult from "@/components/QuizResult";
import Navbar from "@/components/Navbar";
import FooterQuote from "@/components/FooterQuote";
import { calculateScore, checkAnswer, generateQuiz } from "@/lib/quiz";
import { getReviewWords, updateReviewWords } from "@/lib/reviewWords";
import { addPoints } from "@/lib/userStats";
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
    setQuizQuestions(
      generateQuiz(words, requestedSize, quizMode, getReviewWords())
    );
  }, [words, requestedSize, quizMode, retryCount]);

  if (quizQuestions === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dashboard px-3 py-6">
        <p className="text-base font-medium text-slate-600 sm:text-lg">
          Preparing quiz...
        </p>
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
      addPoints(10);
      return;
    }

    setWrongAnswers((prev) => [
      ...prev,
      {
        word: activeQuestion.word.word,
        pos: activeQuestion.word.pos,
        meaning: activeQuestion.word.meaning,
      },
    ]);
  }

  function handleNextQuestion() {
    if (currentQuestion >= totalQuestions - 1) {
      if (quizQuestions) {
        updateReviewWords({
          quizWords: quizQuestions.map((question) => question.word.word),
          wrongWords: wrongAnswers.map((item) => item.word),
        });
      }
      addPoints(20);
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

  const pageWrapper = (content: ReactNode) => (
    <div className="min-h-screen bg-dashboard">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Navbar />
        <main className="mt-6 space-y-6 sm:mt-8">
          {content}
          <FooterQuote />
        </main>
      </div>
    </div>
  );

  if (totalQuestions === 0) {
    return pageWrapper(
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          No words available
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Add vocabulary to{" "}
          <code className="text-sm">src/data/words.json</code> to start a quiz.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-6 min-h-11 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (quizFinished) {
    return pageWrapper(
      <QuizResult
        score={calculateScore(totalQuestions, wrongAnswers.length)}
        totalQuestions={totalQuestions}
        wrongAnswers={wrongAnswers}
        onTryAgain={handleTryAgain}
      />
    );
  }

  if (!activeQuestion) {
    return null;
  }

  return pageWrapper(
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
  );
}
