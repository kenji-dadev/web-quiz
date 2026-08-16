import QuizPanel from "@/components/QuizPanel";
import FlashCardPanel from "@/components/FlashCardPanel";
import WelcomeHero from "@/components/WelcomeHero";
import Navbar from "@/components/Navbar";
import FooterQuote from "@/components/FooterQuote";
import wordsData from "@/data/words.json";
import type { Word } from "@/types/word";

export default function Home() {
  const words = wordsData as Word[];

  return (
    <div className="min-h-screen bg-dashboard">
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8">
        <Navbar />

        <main className="mt-6 space-y-6 sm:mt-8">
          <WelcomeHero />

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <QuizPanel wordCount={words.length} />
            <FlashCardPanel words={words} />
          </div>

          <FooterQuote />
        </main>
      </div>
    </div>
  );
}
