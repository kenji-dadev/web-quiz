"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FlashCard from "@/components/FlashCard";
import { CardsIcon } from "@/components/illustrations";
import { getSavedWords } from "@/lib/savedWords";
import { getStudiedWords, markWordStudied } from "@/lib/studiedWords";
import { addPoints } from "@/lib/userStats";
import type { Word } from "@/types/word";

type FilterTab = "all" | "saved" | "new";

type FlashCardPanelProps = {
  words: Word[];
};

export default function FlashCardPanel({ words }: FlashCardPanelProps) {
  const router = useRouter();
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
    const newCount = words.filter((w) => !studiedSet.has(w.word)).length;
    return {
      all: words.length,
      saved: words.filter((w) => savedSet.has(w.word)).length,
      new: newCount,
    };
  }, [words, savedWords, studiedWords]);

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
  }, [words, filter, savedWords, studiedWords]);

  const safeIndex = filteredWords.length > 0 ? currentIndex % filteredWords.length : 0;
  const currentWord = filteredWords[safeIndex];

  const handleFilterChange = useCallback((tab: FilterTab) => {
    setFilter(tab);
    setCurrentIndex(0);
  }, []);

  function handlePrev() {
    if (filteredWords.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
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
    <div className="relative overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_12px_40px_-12px_rgba(124,58,237,0.18)] ring-1 ring-violet-100/80 sm:p-6 md:p-7">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/30" />

      <span className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-50 px-3 py-1 text-xs font-semibold text-violet-600 sm:right-5 sm:top-5">
        🌱 Grow your memory!
      </span>

      <div className="relative z-10 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500 shadow-md shadow-violet-200">
          <CardsIcon />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">
            Flash Cards
          </h2>
          <p className="text-sm text-slate-500">Review and memorize words</p>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2">
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

        <button
          type="button"
          onClick={() => router.push("/flashcards")}
          className="ml-auto rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition-colors hover:bg-violet-600 active:scale-[0.98]"
        >
          Study Now →
        </button>
      </div>

      <div className="relative z-10 mt-5">
        {currentWord ? (
          <>
            <FlashCard
              key={currentWord.word}
              word={currentWord}
              onPrev={handlePrev}
              onNext={handleNext}
              onSavedChange={handleSavedChange}
            />
            <div className="mt-4 flex justify-center gap-1.5">
              {filteredWords.slice(0, Math.min(5, filteredWords.length)).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === safeIndex % Math.min(5, filteredWords.length)
                      ? "w-4 bg-violet-500"
                      : "w-2 bg-violet-200"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
            <p className="text-slate-500">No words in this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
