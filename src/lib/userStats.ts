const STORAGE_KEY = "web-quiz-user-stats";

type UserStats = {
  points: number;
  streak: number;
  lastActiveDate: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayString(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function defaultStats(): UserStats {
  return { points: 0, streak: 0, lastActiveDate: "" };
}

export function getUserStats(): UserStats {
  if (!canUseStorage()) {
    return defaultStats();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultStats();
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaultStats();
    }

    const stats = parsed as Partial<UserStats>;
    return {
      points: typeof stats.points === "number" ? stats.points : 0,
      streak: typeof stats.streak === "number" ? stats.streak : 0,
      lastActiveDate:
        typeof stats.lastActiveDate === "string" ? stats.lastActiveDate : "",
    };
  } catch {
    return defaultStats();
  }
}

function saveStats(stats: UserStats): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage failures.
  }
}

export function recordActivity(): UserStats {
  const today = getTodayString();
  const stats = getUserStats();

  if (stats.lastActiveDate === today) {
    return stats;
  }

  const yesterday = getYesterdayString();
  const nextStreak =
    stats.lastActiveDate === yesterday ? stats.streak + 1 : stats.lastActiveDate ? 1 : 1;

  const next: UserStats = {
    points: stats.points,
    streak: nextStreak,
    lastActiveDate: today,
  };

  saveStats(next);
  return next;
}

export function addPoints(amount: number): UserStats {
  const stats = recordActivity();
  const next: UserStats = {
    ...stats,
    points: stats.points + amount,
  };
  saveStats(next);
  return next;
}
