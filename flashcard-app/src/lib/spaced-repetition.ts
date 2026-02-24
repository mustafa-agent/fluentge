// SM-2 Algorithm Implementation for Spaced Repetition
// Based on the original SuperMemo SM-2 algorithm

export type CardState = 'new' | 'learning' | 'review' | 'mastered';
export type Rating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export interface CardProgress {
  cardId: string;
  deckId: string;
  state: CardState;
  ease: number; // Ease factor (default 2.5)
  interval: number; // Days until next review
  nextReview: Date;
  reviewCount: number;
  lastReviewed: Date;
  createdAt: Date;
}

// Default values for new cards
const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;
const MAX_EASE = 5.0;

// Initial intervals in minutes for learning cards
const LEARNING_INTERVALS = [1, 10]; // 1 min, then 10 min
// If they get it right twice in learning, move to review with 1 day interval

/**
 * Creates a new card progress entry
 */
export function createNewCard(cardId: string, deckId: string): CardProgress {
  return {
    cardId,
    deckId,
    state: 'new',
    ease: DEFAULT_EASE,
    interval: 0,
    nextReview: new Date(), // Available immediately
    reviewCount: 0,
    lastReviewed: new Date(),
    createdAt: new Date(),
  };
}

/**
 * Process a card review and update its progress using SM-2 algorithm
 */
export function processCardReview(
  card: CardProgress,
  rating: Rating
): CardProgress {
  const now = new Date();
  const updated: CardProgress = {
    ...card,
    lastReviewed: now,
    reviewCount: card.reviewCount + 1,
  };

  // Handle based on current state
  switch (card.state) {
    case 'new':
      return processNewCard(updated, rating);
    case 'learning':
      return processLearningCard(updated, rating);
    case 'review':
      return processReviewCard(updated, rating);
    case 'mastered':
      return processMasteredCard(updated, rating);
    default:
      return updated;
  }
}

/**
 * Process a new card review
 */
function processNewCard(card: CardProgress, rating: Rating): CardProgress {
  if (rating === 1) {
    // Again - stay as new, review in 1 minute
    return {
      ...card,
      state: 'learning',
      interval: 1, // 1 minute
      nextReview: addMinutes(new Date(), 1),
    };
  } else {
    // Any other rating moves to learning
    return {
      ...card,
      state: 'learning',
      interval: 1,
      nextReview: addMinutes(new Date(), 1),
    };
  }
}

/**
 * Process a learning card review
 */
function processLearningCard(card: CardProgress, rating: Rating): CardProgress {
  if (rating === 1) {
    // Again - restart learning from beginning
    return {
      ...card,
      state: 'learning',
      interval: 1,
      nextReview: addMinutes(new Date(), 1),
    };
  } else if (rating >= 2) {
    // Check if this is first or second learning step
    const currentStep = card.interval === 1 ? 0 : 1;
    
    if (currentStep === 0) {
      // Move to second learning step (10 minutes)
      return {
        ...card,
        state: 'learning',
        interval: 10,
        nextReview: addMinutes(new Date(), 10),
      };
    } else {
      // Graduate to review with 1 day interval
      return {
        ...card,
        state: 'review',
        interval: 1,
        nextReview: addDays(new Date(), 1),
        ease: adjustEase(card.ease, rating),
      };
    }
  }

  return card;
}

/**
 * Process a review card using SM-2 algorithm
 */
function processReviewCard(card: CardProgress, rating: Rating): CardProgress {
  if (rating === 1) {
    // Again - back to learning
    return {
      ...card,
      state: 'learning',
      interval: 1,
      nextReview: addMinutes(new Date(), 1),
      ease: adjustEase(card.ease, rating),
    };
  }

  // Calculate new interval based on SM-2
  const newEase = adjustEase(card.ease, rating);
  let newInterval: number;

  if (card.reviewCount === 1) {
    // Second review
    newInterval = rating === 2 ? 1 : 6; // Hard = 1 day, Good/Easy = 6 days
  } else {
    // Subsequent reviews
    newInterval = Math.round(card.interval * newEase);
  }

  // Apply rating-specific modifiers
  if (rating === 2) {
    // Hard - reduce interval by 20%
    newInterval = Math.max(1, Math.round(newInterval * 0.8));
  } else if (rating === 4) {
    // Easy - increase interval by 30%
    newInterval = Math.round(newInterval * 1.3);
  }

  // Move to mastered if interval is over 21 days and rating is Good/Easy
  const newState: CardState = 
    newInterval > 21 && rating >= 3 ? 'mastered' : 'review';

  return {
    ...card,
    state: newState,
    ease: newEase,
    interval: newInterval,
    nextReview: addDays(new Date(), newInterval),
  };
}

/**
 * Process a mastered card review
 */
function processMasteredCard(card: CardProgress, rating: Rating): CardProgress {
  if (rating === 1) {
    // Again - back to learning
    return {
      ...card,
      state: 'learning',
      interval: 1,
      nextReview: addMinutes(new Date(), 1),
      ease: adjustEase(card.ease, rating),
    };
  } else if (rating === 2) {
    // Hard - back to review with reduced interval
    const newInterval = Math.max(1, Math.round(card.interval * 0.6));
    return {
      ...card,
      state: 'review',
      interval: newInterval,
      nextReview: addDays(new Date(), newInterval),
      ease: adjustEase(card.ease, rating),
    };
  }

  // Good/Easy - stay mastered with increased interval
  const newEase = adjustEase(card.ease, rating);
  const newInterval = Math.round(card.interval * newEase);

  return {
    ...card,
    state: 'mastered',
    ease: newEase,
    interval: newInterval,
    nextReview: addDays(new Date(), newInterval),
  };
}

/**
 * Adjust ease factor based on rating (SM-2 algorithm)
 */
function adjustEase(currentEase: number, rating: Rating): number {
  let newEase = currentEase;

  switch (rating) {
    case 1: // Again
      newEase -= 0.2;
      break;
    case 2: // Hard
      newEase -= 0.15;
      break;
    case 3: // Good
      // No change
      break;
    case 4: // Easy
      newEase += 0.15;
      break;
  }

  // Keep ease within bounds
  return Math.max(MIN_EASE, Math.min(MAX_EASE, newEase));
}

/**
 * Check if a card is due for review
 */
export function isCardDue(card: CardProgress): boolean {
  return new Date() >= card.nextReview;
}

/**
 * Get cards that are due for review
 */
export function getDueCards(cards: CardProgress[]): CardProgress[] {
  return cards.filter(isCardDue).sort((a, b) => {
    // Sort by next review date (most overdue first)
    return a.nextReview.getTime() - b.nextReview.getTime();
  });
}

/**
 * Get new cards that haven't been studied yet
 */
export function getNewCards(cards: CardProgress[]): CardProgress[] {
  return cards.filter(card => card.state === 'new');
}

/**
 * Get cards currently in learning phase
 */
export function getLearningCards(cards: CardProgress[]): CardProgress[] {
  return cards.filter(card => card.state === 'learning');
}

/**
 * Utility function to add minutes to a date
 */
function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

/**
 * Utility function to add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get next review time as human-readable string
 */
export function getNextReviewText(card: CardProgress): string {
  const now = new Date();
  const diff = card.nextReview.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'ახლა';
  }
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return `${days} დღეში`;
  } else if (hours > 0) {
    return `${hours} საათში`;
  } else {
    return `${minutes} წუთში`;
  }
}

/**
 * Calculate study statistics
 */
export function getStudyStats(cards: CardProgress[]): {
  total: number;
  new: number;
  learning: number;
  review: number;
  mastered: number;
  due: number;
} {
  const stats = {
    total: cards.length,
    new: 0,
    learning: 0,
    review: 0,
    mastered: 0,
    due: 0,
  };
  
  cards.forEach(card => {
    stats[card.state]++;
    if (isCardDue(card)) {
      stats.due++;
    }
  });
  
  return stats;
}

/**
 * Get card progress from localStorage
 */
export function getCardProgress(cardId: string, deckId: string): CardProgress | null {
  try {
    const key = `card_progress_${deckId}_${cardId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    return {
      ...data,
      nextReview: new Date(data.nextReview),
      lastReviewed: new Date(data.lastReviewed),
      createdAt: new Date(data.createdAt),
    };
  } catch {
    return null;
  }
}

/**
 * Save card progress to localStorage
 */
export function saveCardProgress(progress: CardProgress): void {
  try {
    const key = `card_progress_${progress.deckId}_${progress.cardId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save card progress:', error);
  }
}

/**
 * Get all cards in a specific state for a deck
 */
export function getCardsInState(deckId: string, state: CardState): CardProgress[] {
  try {
    const cards: CardProgress[] = [];
    
    // Iterate through all localStorage keys to find card progress for this deck
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`card_progress_${deckId}_`)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.state === state) {
            cards.push({
              ...data,
              nextReview: new Date(data.nextReview),
              lastReviewed: new Date(data.lastReviewed),
              createdAt: new Date(data.createdAt),
            });
          }
        }
      }
    }
    
    return cards;
  } catch {
    return [];
  }
}