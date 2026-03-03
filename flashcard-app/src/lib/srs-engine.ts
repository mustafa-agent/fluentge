/**
 * SM-2 Spaced Repetition Engine
 * Extracted from SRSStudy.tsx for reuse across the app.
 */

export interface CardSRS {
  interval: number;      // days
  easeFactor: number;    // 1.3 - 3.0
  nextReview: number;    // timestamp (ms)
  repetitions: number;   // successful reviews in a row
  lastSeen: number;      // timestamp (ms)
}

export interface SRSStore {
  [word: string]: CardSRS;
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';

const SRS_KEY_PREFIX = 'fluentge-srs-';
const DAY = 86400000;

// ── Storage ──────────────────────────────────────────

export function getSRSStore(deckId: string): SRSStore {
  try {
    return JSON.parse(localStorage.getItem(SRS_KEY_PREFIX + deckId) || '{}');
  } catch { return {}; }
}

export function saveSRSStore(deckId: string, store: SRSStore) {
  localStorage.setItem(SRS_KEY_PREFIX + deckId, JSON.stringify(store));
}

// ── SM-2 Algorithm ───────────────────────────────────

const DEFAULT_CARD: CardSRS = {
  interval: 0,
  easeFactor: 2.5,
  nextReview: 0,
  repetitions: 0,
  lastSeen: 0,
};

export function rateCard(store: SRSStore, word: string, rating: Rating): SRSStore {
  const data = { ...(store[word] || DEFAULT_CARD) };
  const now = Date.now();

  switch (rating) {
    case 'easy':
      data.repetitions++;
      if (data.repetitions === 1) data.interval = 3;
      else data.interval = Math.round(data.interval * data.easeFactor * 1.3);
      data.easeFactor = Math.min(3.0, data.easeFactor + 0.15);
      data.nextReview = now + data.interval * DAY;
      break;
    case 'good':
      data.repetitions++;
      if (data.repetitions === 1) data.interval = 1;
      else if (data.repetitions === 2) data.interval = 3;
      else data.interval = Math.round(data.interval * data.easeFactor);
      data.easeFactor = Math.min(3.0, data.easeFactor + 0.1);
      data.nextReview = now + data.interval * DAY;
      break;
    case 'hard':
      data.interval = Math.max(1, Math.round(data.interval * 0.5));
      data.easeFactor = Math.max(1.3, data.easeFactor - 0.15);
      data.nextReview = now + data.interval * DAY;
      break;
    case 'again':
      data.repetitions = 0;
      data.interval = 0;
      data.easeFactor = Math.max(1.3, data.easeFactor - 0.2);
      data.nextReview = now + 60000; // 1 minute
      break;
  }

  data.lastSeen = now;
  return { ...store, [word]: data };
}

// ── Interval Preview (for button labels) ─────────────

export function getNextInterval(data: CardSRS | undefined, rating: Rating): string {
  const d = data || DEFAULT_CARD;
  switch (rating) {
    case 'again': return '1წთ';
    case 'hard': {
      const days = Math.max(1, Math.round((d.interval || 1) * 0.5));
      return days === 1 ? '1დ' : `${days}დ`;
    }
    case 'good': {
      const r = d.repetitions || 0;
      if (r <= 0) return '1დ';
      if (r === 1) return '3დ';
      return `${Math.round((d.interval || 1) * d.easeFactor)}დ`;
    }
    case 'easy': {
      const r = d.repetitions || 0;
      if (r <= 0) return '3დ';
      return `${Math.round((d.interval || 1) * d.easeFactor * 1.3)}დ`;
    }
  }
}

// ── Query helpers ────────────────────────────────────

export function getDueCount(deckId: string): number {
  const store = getSRSStore(deckId);
  const now = Date.now();
  return Object.values(store).filter(
    d => d.nextReview <= now && d.repetitions > 0
  ).length;
}

export function getLearnedCount(store: SRSStore): number {
  return Object.values(store).filter(d => d.repetitions >= 2).length;
}

export function getTotalDueCards(): number {
  let due = 0;
  const now = Date.now();
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (!key.startsWith(SRS_KEY_PREFIX)) continue;
    try {
      const store: SRSStore = JSON.parse(localStorage.getItem(key) || '{}');
      for (const data of Object.values(store)) {
        if (data.nextReview && data.nextReview <= now && data.repetitions > 0) due++;
      }
    } catch {}
  }
  return due;
}

/** Returns deck IDs that have due cards, sorted by due count (descending) */
export function getDecksWithDueCards(): Array<{ deckId: string; dueCount: number }> {
  const results: Array<{ deckId: string; dueCount: number }> = [];
  const now = Date.now();
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (!key.startsWith(SRS_KEY_PREFIX)) continue;
    const deckId = key.slice(SRS_KEY_PREFIX.length);
    try {
      const store: SRSStore = JSON.parse(localStorage.getItem(key) || '{}');
      let due = 0;
      for (const data of Object.values(store)) {
        if (data.nextReview && data.nextReview <= now && data.repetitions > 0) due++;
      }
      if (due > 0) results.push({ deckId, dueCount: due });
    } catch {}
  }
  return results.sort((a, b) => b.dueCount - a.dueCount);
}
