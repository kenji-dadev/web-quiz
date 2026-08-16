"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import wordsData from "@/data/words.json";
import FlashCard from "@/components/FlashCard";
import FooterQuote from "@/components/FooterQuote";
import Navbar from "@/components/Navbar";
import { CardsIcon } from "@/components/illustrations";
import { getSavedWords } from "@/lib/savedWords";
import { getStudiedWords, markWordStudied } from "@/lib/studiedWords";
import { addPoints } from "@/lib/userStats";
import type { Word } from "@/types/word";

type FilterTab = "all" | "saved" | "new";

const words = wordsData as Word[];

export default function FlashCardsPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [studiedWords, setStudiedWords] = useState<string[]>([]);

  useEffect(() => {
    setSavedWords(getSavedWords());
    setStudiedWords(getStudiedWords());
  }, []);

  const counts = useMemo(() => {
    const savedSet = new Set(savedWords);
    const studiedSet = new Set(studiedWords);
    return {
      all: words.length,
      saved: words.filter((w) => savedSet.has(w.word)).length,
      new: words.filter((w) => !studiedSet.has(w.word)).length,
    };
  }, [savedWords, studiedWords]);

  const filteredWords = useMemo(() => {
    const savedSet = new Set(savedWords);
    const studiedSet = new Set(studiedWords);

    switch (filter) {
      case "saved":
        return words.filter((w) => savedSet.has(w.word));
      case "new":
        return words.filter((w) => !studiedSet.has(w.word));
      default:
        return words;
    }
  }, [filter, savedWords, studiedWords]);

  const safeIndex =
    filteredWords.length > 0 ? currentIndex % filteredWords.length : 0;
  const currentWord = filteredWords[safeIndex];

  const handleFilterChange = useCallback((tab: FilterTab) => {
    setFilter(tab);
    setCurrentIndex(0);
  }, []);

  function handlePrev() {
    if (filteredWords.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + filteredWords.length) % filteredWords.length
    );
  }

  function handleNext() {
    if (filteredWords.length === 0) return;
    if (currentWord) {
      markWordStudied(currentWord.word);
      addPoints(5);
      setStudiedWords(getStudiedWords());
    }
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  }

  function handleSavedChange() {
    setSavedWords(getSavedWords());
  }

  const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: "all", label: `All (${counts.all})` },
    { id: "saved", label: `Saved (${counts.saved})` },
    { id: "new", label: `New (${counts.new})` },
  ];

  return (
    <div className="min-h-screen bg-dashboard">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <Navbar />

        <main className="mt-6 space-y-6 sm:mt-8">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_-12px_rgba(124,58,237,0.18)] ring-1 ring-violet-100/80 sm:p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500 shadow-md shadow-violet-200">
                <CardsIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  Flash Cards
                </h1>
                <p className="text-sm text-slate-500">Review and memorize words</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleFilterChange(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    filter === tab.id
                      ? "bg-violet-500 text-white shadow-sm shadow-violet-200"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-violet-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {currentWord ? (
                <>
                  <p className="mb-3 text-center text-sm text-slate-500">
                    Card {safeIndex + 1} of {filteredWords.length}
                  </p>
                  <FlashCard
                    key={currentWord.word}
                    word={currentWord}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onSavedChange={handleSavedChange}
                  />
                  <div className="mt-4 flex justify-center gap-1.5">
                    {Array.from({ length: Math.min(7, filteredWords.length) }).map(
                      (_, i) => {
                        const dotIndex =
                          safeIndex % Math.min(7, filteredWords.length);
                        return (
                          <span
                            key={i}
                            className={`h-2 w-2 rounded-full transition-colors ${
                              i === dotIndex ? "bg-violet-600" : "bg-violet-200"
                            }`}
                          />
                        );
                      }
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                  <p className="text-slate-500">No words in this filter.</p>
                </div>
              )}
            </div>
          </div>

          <FooterQuote />
        </main>
      </div>
    </div>
  );
}
