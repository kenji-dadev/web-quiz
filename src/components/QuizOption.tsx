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
    "flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left text-lg transition-colors ";

  if (showResult && isCorrect) {
    className += "border-green-500 bg-green-50 text-green-800";
  } else if (showResult && isIncorrect) {
    className += "border-red-500 bg-red-50 text-red-800";
  } else if (selected) {
    className += "border-blue-600 bg-blue-50 text-blue-800";
  } else {
    className += "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50";
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`${className} disabled:cursor-not-allowed`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current text-sm font-semibold">
        {letter}
      </span>
      <span>{label}</span>
    </button>
  );
}
