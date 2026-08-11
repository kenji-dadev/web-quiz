import QuizSetup from "@/components/QuizSetup";
import wordsData from "@/data/words.json";
import type { Word } from "@/types/word";

export default function Home() {
  const words = wordsData as Word[];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-3 py-6 sm:px-6 sm:py-10 md:px-8 md:py-12">
      <main className="flex w-full max-w-lg flex-col items-center md:max-w-xl lg:max-w-2xl">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            English Vocabulary Quiz
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg md:text-xl">
            Practice English vocabulary
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            with simple quizzes.
          </p>
        </div>

        <QuizSetup wordCount={words.length} />
      </main>
    </div>
  );
}
