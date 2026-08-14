"use client";

type QuizOptionProps = {
  label: string;
  letter: string;
  selected: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  showResult: boolean;
  disabled: boolean;
  onSelect: () => void;
  onSpeak?: () => void;
  isSpeaking?: boolean;
};

export default function QuizOption({
  label,
  letter,
  selected,
  isCorrect,
  isIncorrect,
  showResult,
  disabled,
  onSelect,
  onSpeak,
  isSpeaking,
}: QuizOptionProps) {
  const baseClasses =
    "min-h-12 w-full flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-base font-medium transition-colors sm:min-h-14 sm:gap-4 sm:px-5 sm:py-4 sm:text-lg";

  const stateClasses = isCorrect
    ? "border-green-500 bg-green-50 text-green-800"
    : isIncorrect
      ? "border-red-500 bg-red-50 text-red-800"
      : selected
        ? "border-blue-600 bg-blue-50 text-blue-800"
        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses} ${
          disabled ? "cursor-default" : "cursor-pointer"
        } disabled:cursor-not-allowed`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm">
          {letter}
        </span>
        <span className="min-w-0 flex-1 wrap-break-word">{label}</span>
        {showResult && isCorrect ? <span>✓</span> : null}
        {showResult && isIncorrect ? <span>✗</span> : null}
      </button>

      {onSpeak ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSpeak();
          }}
          aria-label={`Listen to ${label}`}
          className={`shrink-0 rounded-full p-2 text-lg transition-all hover:bg-slate-100 active:scale-90 ${
            isSpeaking ? "animate-pulse bg-blue-50" : ""
          }`}
        >
          🔊
        </button>
      ) : null}
    </div>
  );
}
