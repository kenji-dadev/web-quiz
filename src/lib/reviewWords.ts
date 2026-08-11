const STORAGE_KEY = "web-quiz-review-words";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getReviewWords(): string[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return [
      ...new Set(
        parsed.filter((item): item is string => typeof item === "string" && item.length > 0)
      ),
    ];
  } catch {
    return [];
  }
}

export function updateReviewWords({
  quizWords,
  wrongWords,
}: {
  quizWords: string[];
  wrongWords: string[];
}): string[] {
  const existing = new Set(getReviewWords());
  const wrongSet = new Set(wrongWords);

  for (const word of quizWords) {
    if (wrongSet.has(word)) {
      existing.add(word);
    } else {
      existing.delete(word);
    }
  }

  const next = [...existing];

  if (canUseStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota / private-mode failures; in-memory result still returned.
    }
  }

  return next;
}
