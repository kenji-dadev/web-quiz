type QuizProgressProps = {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  answeredCount: number;
};

export default function QuizProgress({
  currentQuestion,
  totalQuestions,
  score,
  answeredCount,
}: QuizProgressProps) {
  const progress =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="mb-4 space-y-3 sm:mb-6 sm:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs font-medium text-slate-600 sm:text-sm">
        <span>
          Question {currentQuestion} / {totalQuestions}
        </span>
        <span>
          Score: {score} / {answeredCount || 0}
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 sm:h-3">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-right text-xs font-medium text-slate-500 sm:text-sm">
        {progress}%
      </p>
    </div>
  );
}
