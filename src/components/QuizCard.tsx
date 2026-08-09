"use client";

import type { QuizQuestion } from "@/types/word";
import { getCorrectAnswerLabel, getQuestionText } from "@/lib/quiz";
import QuizOption from "./QuizOption";
import QuizProgress from "./QuizProgress";

type QuizCardProps = {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  answeredCount: number;
  selectedAnswer: string | null;
  showResult: boolean;
  onSelectAnswer: (answer: string) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
};

const LETTERS = ["A", "B", "C", "D"];

export default function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  score,
  answeredCount,
  selectedAnswer,
  showResult,
  onSelectAnswer,
  onNextQuestion,
  isLastQuestion,
}: QuizCardProps) {
  const isCorrect =
    showResult &&
    selectedAnswer !== null &&
    selectedAnswer === question.correctAnswer;

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <QuizProgress
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
        score={score}
        answeredCount={answeredCount}
      />

      <h2 className="mb-8 text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
        {getQuestionText(question)}
      </h2>

      <div className="space-y-3">
        {question.choices.map((choice, index) => {
          const selected = selectedAnswer === choice;
          const choiceIsCorrect = showResult && choice === question.correctAnswer;
          const choiceIsIncorrect =
            showResult && selected && choice !== question.correctAnswer;

          return (
            <QuizOption
              key={`${choice}-${index}`}
              label={choice}
              letter={LETTERS[index] ?? String(index + 1)}
              selected={selected}
              isCorrect={choiceIsCorrect}
              isIncorrect={choiceIsIncorrect}
              showResult={showResult}
              disabled={showResult}
              onSelect={() => onSelectAnswer(choice)}
            />
          );
        })}
      </div>

      {showResult && (
        <div className="mt-8 space-y-4">
          {isCorrect ? (
            <p className="text-lg font-semibold text-green-600">✓ Correct!</p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-red-600">✗ Incorrect</p>
              <p className="text-base text-slate-700">
                Correct answer:{" "}
                <span className="font-semibold text-slate-900">
                  {getCorrectAnswerLabel(question)}
                </span>
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onNextQuestion}
            className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {isLastQuestion ? "See Results" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}
