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
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between text-sm font-medium text-slate-600">
        <span>
          Question {currentQuestion} / {totalQuestions}
        </span>
        <span>
          Score: {score} / {answeredCount || 0}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-right text-sm font-medium text-slate-500">{progress}%</p>
    </div>
  );
}
