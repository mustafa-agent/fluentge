import { CardProgress, initCardProgress } from './sm2';

const PROGRESS_KEY = 'fluentge_progress';
const STATS_KEY = 'fluentge_stats';

export interface UserStats {
  wordsLearned: number;
  totalReviews: number;
  correctReviews: number;
  streak: number;
  lastStudyDate: string;
}

function getDefaultStats(): UserStats {
  return { wordsLearned: 0, totalReviews: 0, correctReviews: 0, streak: 0, lastStudyDate: '' };
}

export function getAllProgress(): Record<string, CardProgress> {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch { return {}; }
}

export function getCardProgress(cardId: string): CardProgress {
  const all = getAllProgress();
  return all[cardId] || initCardProgress(cardId);
}

export function saveCardProgress(progress: CardProgress) {
  const all = getAllProgress();
  all[progress.cardId] = progress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

export function getStats(): UserStats {
  try {
    return { ...getDefaultStats(), ...JSON.parse(localStorage.getItem(STATS_KEY) || '{}') };
  } catch { return getDefaultStats(); }
}

export function updateStats(correct: boolean) {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  
  stats.totalReviews++;
  if (correct) {
    stats.correctReviews++;
  }
  
  if (stats.lastStudyDate === today) {
    // same day
  } else if (stats.lastStudyDate === getYesterday()) {
    stats.streak++;
  } else if (stats.lastStudyDate !== today) {
    stats.streak = 1;
  }
  stats.lastStudyDate = today;
  
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}

export function incrementWordsLearned() {
  const stats = getStats();
  stats.wordsLearned++;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getLocalStorageValue(key: string, defaultValue: string): string {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch {
    return defaultValue;
  }
}
