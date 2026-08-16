"use client";

import { useState, type ReactNode } from "react";
import { SpeakerIcon, StarIcon } from "@/components/illustrations";
import { useSpeak } from "@/hooks/useSpeak";
import { isWordSaved, toggleSavedWord } from "@/lib/savedWords";
import type { Word } from "@/types/word";

function formatPos(pos: string): string {
  const short = pos.split("/")[0].trim();
  const lower = short.toLowerCase();
  if (lower.startsWith("verb")) return "v.";
  if (lower.startsWith("noun")) return "n.";
  if (lower.startsWith("adj")) return "adj.";
  if (lower.startsWith("adv")) return "adv.";
  return lower.slice(0, 4) + ".";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getWordForms(base: string): string[] {
  const w = base.toLowerCase();
  const forms = new Set<string>([w]);

  forms.add(`${w}s`);
  forms.add(`${w}es`);

  if (w.endsWith("y") && w.length > 2 && !/[aeiou]y$/i.test(w)) {
    forms.add(`${w.slice(0, -1)}ies`);
  }

  if (w.endsWith("e")) {
    forms.add(`${w}d`);
    forms.add(`${w.slice(0, -1)}ing`);
  } else {
    forms.add(`${w}ed`);
    forms.add(`${w}ing`);
    forms.add(`${w}d`);
  }

  return [...forms].sort((a, b) => b.length - a.length);
}

function containsWordForm(text: string, word: string): boolean {
  const pattern = new RegExp(
    `\\b(${getWordForms(word).map(escapeRegExp).join("|")})\\b`,
    "i"
  );
  return pattern.test(text);
}

function getPastForm(word: string): string {
  const w = word.toLowerCase();
  if (w.endsWith("e")) return `${w}d`;
  if (w.endsWith("y") && !/[aeiou]y$/i.test(w)) return `${w.slice(0, -1)}ied`;
  return `${w}ed`;
}

function cleanDefinition(definition?: string): string {
  if (!definition) return "";
  const cleaned = definition
    .replace(/^\([^)]*\)\s*/g, "")
    .replace(/^To /, "to ")
    .trim();
  if (cleaned.length > 120) {
    return `${cleaned.slice(0, 117)}...`;
  }
  return cleaned;
}

function buildExample(word: Word): string {
  const cleaned = cleanDefinition(word.definition);
  if (cleaned && containsWordForm(cleaned, word.word)) {
    return cleaned;
  }

  const base = word.word.toLowerCase();
  const pos = word.pos.toLowerCase();

  if (pos.includes("verb")) {
    return `The storm ${getPastForm(base)} the roof of our house.`;
  }
  if (pos.includes("noun")) {
    return `Everyone noticed the ${base} right away.`;
  }
  if (pos.includes("adj")) {
    return `It was a very ${base} experience for the whole team.`;
  }
  return `We often use "${base}" in everyday conversation.`;
}

function highlightWord(text: string, word: string): ReactNode {
  const pattern = new RegExp(
    `\\b(${getWordForms(word).map(escapeRegExp).join("|")})\\b`,
    "gi"
  );

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <strong
        key={match.index}
        className="font-bold text-blue-900"
      >
        {match[0]}
      </strong>
    );

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

type FlashCardProps = {
  word: Word;
  onPrev?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
  onSavedChange?: () => void;
};

export default function FlashCard({
  word,
  onPrev,
  onNext,
  showNavigation = true,
  onSavedChange,
}: FlashCardProps) {
  const { speak, isSupported, speakingText } = useSpeak();
  const [saved, setSaved] = useState(() => isWordSaved(word.word));

  const example = buildExample(word);
  const posShort = formatPos(word.pos);

  function handleToggleSaved() {
    const isNowSaved = toggleSavedWord(word.word);
    setSaved(isNowSaved);
    onSavedChange?.();
  }

  return (
    <div className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <button
        type="button"
        onClick={handleToggleSaved}
        aria-label={saved ? "Remove from saved" : "Save word"}
        className="absolute right-4 top-4 transition-transform hover:scale-110 active:scale-95"
      >
        <StarIcon filled={saved} />
      </button>

      <div>
        <h3 className="pr-8 text-2xl font-extrabold text-blue-900 sm:text-3xl">
          {word.word}
        </h3>
        <p className="mt-1 text-sm font-medium text-fuchsia-600">
          {posShort} {word.word.toLowerCase()}
        </p>
      </div>

      <p className="mt-4 text-lg font-semibold text-slate-800 sm:text-xl">
        {word.meaning}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
        {highlightWord(example, word.word)}
      </p>

      <div className="mt-5 flex items-center justify-between">
        {isSupported ? (
          <button
            type="button"
            onClick={() => speak(word.word, "en-US")}
            aria-label={`Listen to ${word.word}`}
            className={`rounded-full p-2 text-slate-400 transition-all hover:bg-violet-50 hover:text-violet-600 active:scale-90 ${
              speakingText === word.word ? "animate-pulse bg-violet-50 text-violet-600" : ""
            }`}
          >
            <SpeakerIcon />
          </button>
        ) : (
          <span />
        )}

        {showNavigation ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={!onPrev}
              aria-label="Previous card"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              ←
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!onNext}
              aria-label="Next card"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-white shadow-sm shadow-violet-200 transition-colors hover:bg-violet-600 disabled:opacity-40"
            >
              →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
