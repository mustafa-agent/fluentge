import { syncNow } from './firebase-sync';

// Gamification utilities for FluentGe V2

export interface UserStats {
  totalXP: number;
  currentStreak: number;
  lastPracticeDate: string;
  dailyGoalMinutes: number;
  todayStudyTime: number;
  level: number;
}

export interface SessionSummary {
  cardsReviewed: number;
  correctAnswers: number;
  accuracy: number;
  xpEarned: number;
  currentStreak: number;
  dailyGoalProgress: number;
}

// XP System
export const XP_REWARDS = {
  REVIEW_CARD: 10,
  CORRECT_ANSWER: 5,
  DAILY_GOAL_MET: 50,
  STREAK_7_DAYS: 100,
  LEVEL_UP: 25,
} as const;

// Level calculation: Level = floor(totalXP / 200) + 1
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 200) + 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * 200;
}

export function getXPProgress(totalXP: number): { current: number; needed: number; progress: number } {
  const level = calculateLevel(totalXP);
  const xpForCurrentLevel = (level - 1) * 200;
  const xpForNextLevel = level * 200;
  const currentXP = totalXP - xpForCurrentLevel;
  const neededXP = xpForNextLevel - xpForCurrentLevel;
  const progress = (currentXP / neededXP) * 100;
  
  return {
    current: currentXP,
    needed: neededXP,
    progress
  };
}

// Streak System
export function calculateStreak(lastPracticeDate: string): number {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  const lastDate = new Date(lastPracticeDate).toDateString();
  
  if (lastDate === today || lastDate === yesterday) {
    // Continue streak - will be incremented when user practices today
    return getCurrentStreak();
  } else {
    // Streak broken
    return 0;
  }
}

export function updateStreak(practiced: boolean): number {
  const today = new Date().toDateString();
  const lastPracticeDate = localStorage.getItem('lastPracticeDate');
  const currentStreak = getCurrentStreak();
  
  if (!practiced) return currentStreak;
  
  if (lastPracticeDate === today) {
    // Already practiced today, no change
    return currentStreak;
  }
  
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  if (lastPracticeDate === yesterday || !lastPracticeDate) {
    const newStreak = currentStreak + 1;
    localStorage.setItem('currentStreak', newStreak.toString());
    localStorage.setItem('lastPracticeDate', today);
    syncNow();
    return newStreak;
  } else {
    localStorage.setItem('currentStreak', '1');
    localStorage.setItem('lastPracticeDate', today);
    syncNow();
    return 1;
  }
}

export function getCurrentStreak(): number {
  return parseInt(localStorage.getItem('currentStreak') || '0', 10);
}

// Daily Goal System (legacy time-based — kept for backward compat)
export function getDailyGoal(): number {
  return getDailyCardGoal();
}

export function setDailyGoal(cards: number): void {
  setDailyCardGoal(cards);
}

export function getTodayStudyTime(): number {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('dailyStudyTime');
  
  if (!stored) return 0;
  
  try {
    const data = JSON.parse(stored);
    return data.date === today ? data.minutes : 0;
  } catch {
    return 0;
  }
}

export function addStudyTime(minutes: number): number {
  const today = new Date().toDateString();
  const currentTime = getTodayStudyTime();
  const newTime = currentTime + minutes;
  
  localStorage.setItem('dailyStudyTime', JSON.stringify({
    date: today,
    minutes: newTime
  }));
  
  // Sync to daily history
  recordDailyActivity(0, 0);
  
  return newTime;
}

export function isDailyGoalMet(): boolean {
  return getTodayCardsReviewed() >= getDailyCardGoal();
}

// Card-based Daily Goal System
const DAILY_CARDS_KEY = 'dailyCardsReviewed';
const DAILY_CARD_GOAL_KEY = 'dailyCardGoal';

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDailyCardGoal(): number {
  return parseInt(localStorage.getItem(DAILY_CARD_GOAL_KEY) || '50', 10);
}

export function setDailyCardGoal(cards: number): void {
  localStorage.setItem(DAILY_CARD_GOAL_KEY, cards.toString());
  syncNow();
}

export function getTodayCardsReviewed(): number {
  try {
    const data = JSON.parse(localStorage.getItem(DAILY_CARDS_KEY) || '{}');
    return data[getTodayKey()] || 0;
  } catch {
    return 0;
  }
}

export function addCardReview(count: number = 1): number {
  const key = getTodayKey();
  let data: Record<string, number> = {};
  try {
    data = JSON.parse(localStorage.getItem(DAILY_CARDS_KEY) || '{}');
  } catch { data = {}; }
  
  data[key] = (data[key] || 0) + count;
  
  // Clean entries older than 30 days
  const keys = Object.keys(data);
  if (keys.length > 35) {
    keys.sort();
    for (let i = 0; i < keys.length - 30; i++) delete data[keys[i]];
  }
  
  localStorage.setItem(DAILY_CARDS_KEY, JSON.stringify(data));
  
  // Sync to daily history
  recordDailyActivity(0, 0);
  syncNow();
  
  return data[key];
}

export function getDailyCardsData(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(DAILY_CARDS_KEY) || '{}');
  } catch {
    return {};
  }
}

// XP Management
export function getTotalXP(): number {
  return parseInt(localStorage.getItem('totalXP') || '0', 10);
}

export function addXP(amount: number): { newTotal: number; levelUp: boolean; newLevel: number } {
  const currentXP = getTotalXP();
  const currentLevel = calculateLevel(currentXP);
  const newTotal = currentXP + amount;
  const newLevel = calculateLevel(newTotal);
  
  localStorage.setItem('totalXP', newTotal.toString());
  
  // Auto-track daily activity (XP only; cards tracked separately)
  recordDailyActivity(amount, 0);
  syncNow();
  
  return {
    newTotal,
    levelUp: newLevel > currentLevel,
    newLevel
  };
}

// Get user stats
export function getUserStats(): UserStats {
  const totalXP = getTotalXP();
  
  return {
    totalXP,
    currentStreak: getCurrentStreak(),
    lastPracticeDate: localStorage.getItem('lastPracticeDate') || '',
    dailyGoalMinutes: getDailyGoal(),
    todayStudyTime: getTodayStudyTime(),
    level: calculateLevel(totalXP)
  };
}

// Daily Activity History (for 7-day chart)
export interface DailyActivity {
  date: string; // toDateString()
  xp: number;
  minutes: number;
  cards: number;
}

export function getDailyHistory(days: number = 7): DailyActivity[] {
  const stored = localStorage.getItem('fluentge-daily-history');
  let history: Record<string, DailyActivity> = {};
  try { history = stored ? JSON.parse(stored) : {}; } catch { history = {}; }
  
  const result: DailyActivity[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    result.push(history[key] || { date: key, xp: 0, minutes: 0, cards: 0 });
  }
  return result;
}

export function recordDailyActivity(xpEarned: number, cardsReviewed: number): void {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('fluentge-daily-history');
  let history: Record<string, DailyActivity> = {};
  try { history = stored ? JSON.parse(stored) : {}; } catch { history = {}; }
  
  const entry = history[today] || { date: today, xp: 0, minutes: 0, cards: 0 };
  entry.xp += xpEarned;
  entry.cards += cardsReviewed;
  entry.minutes = getTodayStudyTime();
  history[today] = entry;
  
  // Keep only last 30 days
  const keys = Object.keys(history);
  if (keys.length > 30) {
    keys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    for (let i = 0; i < keys.length - 30; i++) delete history[keys[i]];
  }
  
  localStorage.setItem('fluentge-daily-history', JSON.stringify(history));
}

// Levenshtein distance for typo tolerance
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[len2][len1];
}

// Check if answer is correct with typo tolerance
export function isAnswerCorrect(userAnswer: string, correctAnswer: string, tolerance = 2): boolean {
  const cleanUser = userAnswer.toLowerCase().trim();
  const cleanCorrect = correctAnswer.toLowerCase().trim();
  
  if (cleanUser === cleanCorrect) return true;
  
  const distance = levenshteinDistance(cleanUser, cleanCorrect);
  return distance <= tolerance;
}