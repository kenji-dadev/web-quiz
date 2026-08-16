const STORAGE_KEY = "web-quiz-saved-words";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSavedWords(): string[] {
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

export function isWordSaved(word: string): boolean {
  return getSavedWords().includes(word);
}

export function toggleSavedWord(word: string): boolean {
  const saved = new Set(getSavedWords());
  const isNowSaved = !saved.has(word);

  if (isNowSaved) {
    saved.add(word);
  } else {
    saved.delete(word);
  }

  const next = [...saved];

  if (canUseStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures.
    }
  }

  return isNowSaved;
}
