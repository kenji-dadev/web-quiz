import Image from "next/image";
import QuizSetup from "@/components/QuizSetup";
import wordsData from "@/data/words.json";
import type { Word } from "@/types/word";

export default function Home() {
  const words = wordsData as Word[];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-12">
      <main className="flex w-full max-w-2xl flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            English Vocabulary Quiz
          </h1>
          <p className="mt-4 text-lg text-slate-600 sm:text-xl">
            Practice English vocabulary
            <br />
            with simple quizzes.
          </p>
        </div>

        <QuizSetup wordCount={words.length} />
      </main>
    </div>
  );
}
