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
    <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Quiz Complete!</h2>
        <p className="mt-4 text-5xl font-bold text-blue-600">
          {score} / {totalQuestions}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-700">
          {percentage}%
        </p>

        <div className="mt-6 flex justify-center gap-8 text-base text-slate-600">
          <span>
            Correct: <strong className="text-green-600">{score}</strong>
          </span>
          <span>
            Wrong: <strong className="text-red-600">{wrongCount}</strong>
          </span>
        </div>
      </div>

      {wrongAnswers.length > 0 && (
        <div className="mt-8 rounded-xl bg-slate-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Words to Review
          </h3>
          <ul className="space-y-2">
            {wrongAnswers.map((item) => (
              <li
                key={item.word}
                className="text-base text-slate-700"
              >
                <span className="font-medium text-slate-900">{item.word}</span>
                {item.pos ? (
                  <span className="ml-2 text-xs font-semibold text-slate-500">
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

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onTryAgain}
          className="rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center justify-center rounded-xl border border-slate-300 px-6 py-4 text-lg font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
