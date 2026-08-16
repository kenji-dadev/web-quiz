const STORAGE_KEY = "web-quiz-studied-words";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStudiedWords(): string[] {
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

export function markWordStudied(word: string): void {
  const studied = new Set(getStudiedWords());
  studied.add(word);

  if (canUseStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...studied]));
    } catch {
      // Ignore storage failures.
    }
  }
}
