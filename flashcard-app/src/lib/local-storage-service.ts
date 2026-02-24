// Local storage service for guest users (no Firebase needed)
import { CardProgress, createNewCard } from './spaced-repetition';
import { FlashCard, getCardId, FREE_DECK_IDS } from './cards';

const GUEST_DECKS_KEY = 'fluentge_guest_decks';
const GUEST_PROGRESS_KEY = 'fluentge_guest_progress';

export interface GuestDeckProgress {
  deckId: string;
  addedAt: string;
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  masteredCards: number;
  lastStudied?: string;
}

/**
 * Get guest user's active decks from localStorage
 */
export function getGuestDecks(): GuestDeckProgress[] {
  try {
    const stored = localStorage.getItem(GUEST_DECKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a deck for guest user
 */
export function addGuestDeck(deckId: string, cards: FlashCard[]): void {
  // Only allow free decks for guests
  if (!FREE_DECK_IDS.includes(deckId)) {
    throw new Error('Premium deck not available for guest users');
  }

  const existingDecks = getGuestDecks();
  
  // Check if deck already added
  if (existingDecks.some(d => d.deckId === deckId)) {
    return; // Already added
  }

  const newDeck: GuestDeckProgress = {
    deckId,
    addedAt: new Date().toISOString(),
    totalCards: cards.length,
    newCards: cards.length,
    learningCards: 0,
    reviewCards: 0,
    masteredCards: 0,
  };

  existingDecks.push(newDeck);
  localStorage.setItem(GUEST_DECKS_KEY, JSON.stringify(existingDecks));

  // Initialize card progress
  const existingProgress = getGuestCardProgress();
  cards.forEach(card => {
    const cardId = getCardId(card);
    if (!existingProgress[cardId]) {
      const cardProgress = createNewCard(cardId, deckId);
      existingProgress[cardId] = {
        ...cardProgress,
        nextReview: cardProgress.nextReview.toISOString(),
        lastReviewed: cardProgress.lastReviewed.toISOString(),
        createdAt: cardProgress.createdAt.toISOString(),
      };
    }
  });

  localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(existingProgress));
}

/**
 * Check if guest has a deck
 */
export function hasGuestDeck(deckId: string): boolean {
  const decks = getGuestDecks();
  return decks.some(d => d.deckId === deckId);
}

/**
 * Get card progress for guest user
 */
export function getGuestCardProgress(): Record<string, any> {
  try {
    const stored = localStorage.getItem(GUEST_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Get card progress for specific deck
 */
export function getGuestDeckCardProgress(deckId: string): CardProgress[] {
  const allProgress = getGuestCardProgress();
  
  return Object.values(allProgress)
    .filter((p: any) => p.deckId === deckId)
    .map((p: any) => ({
      ...p,
      nextReview: new Date(p.nextReview),
      lastReviewed: new Date(p.lastReviewed),
      createdAt: new Date(p.createdAt),
    })) as CardProgress[];
}

/**
 * Update card progress for guest user
 */
export function updateGuestCardProgress(cardProgress: CardProgress): void {
  const allProgress = getGuestCardProgress();
  
  allProgress[cardProgress.cardId] = {
    ...cardProgress,
    nextReview: cardProgress.nextReview.toISOString(),
    lastReviewed: cardProgress.lastReviewed.toISOString(),
    createdAt: cardProgress.createdAt.toISOString(),
  };

  localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(allProgress));
}

/**
 * Update deck progress statistics for guest user
 */
export function updateGuestDeckProgress(deckId: string, cards: CardProgress[]): void {
  const existingDecks = getGuestDecks();
  const deckIndex = existingDecks.findIndex(d => d.deckId === deckId);
  
  if (deckIndex >= 0) {
    existingDecks[deckIndex] = {
      ...existingDecks[deckIndex],
      totalCards: cards.length,
      newCards: cards.filter(c => c.state === 'new').length,
      learningCards: cards.filter(c => c.state === 'learning').length,
      reviewCards: cards.filter(c => c.state === 'review').length,
      masteredCards: cards.filter(c => c.state === 'mastered').length,
      lastStudied: new Date().toISOString(),
    };

    localStorage.setItem(GUEST_DECKS_KEY, JSON.stringify(existingDecks));
  }
}

/**
 * Get cards due for review for guest user
 */
export function getGuestDueCards(): CardProgress[] {
  const allProgress = getGuestCardProgress();
  const now = new Date();
  
  return Object.values(allProgress)
    .map((p: any) => ({
      ...p,
      nextReview: new Date(p.nextReview),
      lastReviewed: new Date(p.lastReviewed),
      createdAt: new Date(p.createdAt),
    }))
    .filter(card => card.nextReview <= now)
    .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime()) as CardProgress[];
}

/**
 * Clear all guest data (for testing or reset)
 */
export function clearGuestData(): void {
  localStorage.removeItem(GUEST_DECKS_KEY);
  localStorage.removeItem(GUEST_PROGRESS_KEY);
}

/**
 * Get guest statistics
 */
export function getGuestStats(): {
  totalDecks: number;
  totalCards: number;
  masteredCards: number;
  dueCards: number;
} {
  const decks = getGuestDecks();
  const dueCards = getGuestDueCards();
  
  return {
    totalDecks: decks.length,
    totalCards: decks.reduce((sum, d) => sum + d.totalCards, 0),
    masteredCards: decks.reduce((sum, d) => sum + d.masteredCards, 0),
    dueCards: dueCards.length,
  };
}