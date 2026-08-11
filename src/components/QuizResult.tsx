import Link from "next/link";
import type { WrongAnswer } from "@/types/word";

type QuizResultProps = {
  score: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
  onTryAgain: () => void;
};

export default function QuizResult({
  score,
  totalQuestions,
  wrongAnswers,
  onTryAgain,
}: QuizResultProps) {
  const wrongCount = totalQuestions - score;
  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:max-w-2xl sm:p-6 md:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Quiz Complete!
        </h2>
        <p className="mt-3 text-4xl font-bold text-blue-600 sm:mt-4 sm:text-5xl">
          {score} / {totalQuestions}
        </p>
        <p className="mt-2 text-xl font-semibold text-slate-700 sm:text-2xl">
          {percentage}%
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-slate-600 sm:mt-6 sm:gap-8 sm:text-base">
          <span>
            Correct: <strong className="text-green-600">{score}</strong>
          </span>
          <span>
            Wrong: <strong className="text-red-600">{wrongCount}</strong>
          </span>
        </div>
      </div>

      {wrongAnswers.length > 0 && (
        <div className="mt-6 max-h-[40vh] overflow-y-auto rounded-xl bg-slate-50 p-4 sm:mt-8 sm:max-h-[50vh] sm:p-6">
          <h3 className="mb-3 text-base font-semibold text-slate-900 sm:mb-4 sm:text-lg">
            Words to Review
          </h3>
          <ul className="space-y-2">
            {wrongAnswers.map((item) => (
              <li
                key={item.word}
                className="wrap-break-word text-sm text-slate-700 sm:text-base"
              >
                <span className="font-medium text-slate-900">{item.word}</span>
                {item.pos ? (
                  <span className="ml-1 text-[11px] font-semibold text-slate-500 sm:ml-2 sm:text-xs">
                    ({item.pos})
                  </span>
                ) : null}
                <span className="text-slate-500"> → </span>
                {item.meaning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2">
        <button
          type="button"
          onClick={onTryAgain}
          className="min-h-12 rounded-xl bg-blue-600 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:px-6 sm:py-4 sm:text-lg"
        >
          {wrongAnswers.length > 0
            ? "Retry with review words"
            : "Try Again"}
        </button>
        <Link
          href="/"
          className="flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-4 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:px-6 sm:py-4 sm:text-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
