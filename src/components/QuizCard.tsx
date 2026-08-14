"use client";

import type { QuizQuestion } from "@/types/word";
import { getCorrectAnswerLabel, getQuestionText } from "@/lib/quiz";
import { useSpeak } from "@/hooks/useSpeak";
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
  const { speak, isSupported, speakingText } = useSpeak();

  const isCorrect =
    showResult &&
    selectedAnswer !== null &&
    selectedAnswer === question.correctAnswer;

  const questionText = getQuestionText(question);
  const questionLang = question.mode === "en-to-th" ? "en-US" : "th-TH";
  const choiceLang = question.mode === "en-to-th" ? "th-TH" : "en-US";

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:max-w-2xl sm:p-6 md:p-8">
      <QuizProgress
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
        score={score}
        answeredCount={answeredCount}
      />

      <div className="mb-5 sm:mb-8">
        <div className="flex items-start justify-between gap-3">
          <h2 className="wrap-break-word text-xl font-semibold leading-snug text-slate-900 sm:text-2xl md:text-3xl">
            {questionText}
          </h2>

          {isSupported && questionText ? (
            <button
              type="button"
              onClick={() => speak(questionText, questionLang)}
              aria-label={`Listen to ${questionText}`}
              className={`shrink-0 rounded-full p-2 text-xl transition-all hover:bg-slate-100 active:scale-90 ${
                speakingText === questionText ? "animate-pulse bg-blue-50" : ""
              }`}
            >
              🔊
            </button>
          ) : null}
        </div>

        {question.word.pos ? (
          <span className="mt-2 inline-flex max-w-full rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-600 sm:mt-3 sm:px-3 sm:text-xs">
            {question.word.pos}
          </span>
        ) : null}
        {question.word.definition ? (
          <p className="ml-2 mt-2 text-xs font-bold text-slate-700 sm:text-base">
            EX: {question.word.definition}
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5 sm:space-y-3">
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
        <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
          {isCorrect ? (
            <p className="text-base font-semibold text-green-600 sm:text-lg">
              ✓ Correct!
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-base font-semibold text-red-600 sm:text-lg">
                ✗ Incorrect
              </p>
              <p className="wrap-break-word text-sm text-slate-700 sm:text-base">
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
            className="min-h-12 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:px-6 sm:py-4 sm:text-lg"
          >
            {isLastQuestion ? "See Results" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}
