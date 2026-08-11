type QuizOptionProps = {
  label: string;
  letter: string;
  selected: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  showResult: boolean;
  disabled: boolean;
  onSelect: () => void;
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
}: QuizOptionProps) {
  let className =
    "flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-base transition-colors sm:min-h-14 sm:gap-4 sm:px-5 sm:py-4 sm:text-lg ";

  if (showResult && isCorrect) {
    className += "border-green-500 bg-green-50 text-green-800";
  } else if (showResult && isIncorrect) {
    className += "border-red-500 bg-red-50 text-red-800";
  } else if (selected) {
    className += "border-blue-600 bg-blue-50 text-blue-800";
  } else {
    className +=
      "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50";
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`${className} disabled:cursor-not-allowed`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm">
        {letter}
      </span>
      <span className="min-w-0 flex-1 wrap-break-word">{label}</span>
    </button>
  );
}
