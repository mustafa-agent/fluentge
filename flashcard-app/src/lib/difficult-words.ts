// Difficult Words Tracker — tracks words users get wrong across all modes

const DIFFICULT_KEY = 'fluentge_difficult_words';

export interface DifficultWord {
  english: string;
  georgian: string;
  pronunciation?: string;
  category: string;
  wrongCount: number;
  rightCount: number;
  lastWrong: number; // timestamp
  lastRight: number; // timestamp
}

export function getDifficultWords(): DifficultWord[] {
  try {
    return JSON.parse(localStorage.getItem(DIFFICULT_KEY) || '[]');
  } catch { return []; }
}

function saveDifficultWords(words: DifficultWord[]) {
  localStorage.setItem(DIFFICULT_KEY, JSON.stringify(words));
}

/**
 * Record a wrong answer for a word.
 */
export function recordWrong(english: string, georgian: string, category: string, pronunciation?: string) {
  const words = getDifficultWords();
  const existing = words.find(w => w.english.toLowerCase() === english.toLowerCase());
  
  if (existing) {
    existing.wrongCount++;
    existing.lastWrong = Date.now();
  } else {
    words.push({
      english,
      georgian,
      pronunciation,
      category,
      wrongCount: 1,
      rightCount: 0,
      lastWrong: Date.now(),
      lastRight: 0,
    });
  }
  
  saveDifficultWords(words);
}

/**
 * Record a correct answer. If the user gets it right enough times, remove from difficult list.
 */
export function recordRight(english: string) {
  const words = getDifficultWords();
  const existing = words.find(w => w.english.toLowerCase() === english.toLowerCase());
  
  if (existing) {
    existing.rightCount++;
    existing.lastRight = Date.now();
    
    // If user got it right 3+ more times than wrong, consider it learned
    if (existing.rightCount >= existing.wrongCount + 3) {
      const idx = words.indexOf(existing);
      words.splice(idx, 1);
    }
  }
  
  saveDifficultWords(words);
}

/**
 * Get top N most difficult words, sorted by wrong count (descending).
 */
export function getTopDifficult(n: number = 20): DifficultWord[] {
  const words = getDifficultWords();
  return words
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, n);
}

/**
 * Get total count of difficult words.
 */
export function getDifficultCount(): number {
  return getDifficultWords().length;
}

/**
 * Clear all difficult words (reset).
 */
export function clearDifficultWords() {
  localStorage.removeItem(DIFFICULT_KEY);
}
