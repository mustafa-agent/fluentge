// Firebase service with guest mode fallbacks
import { CardProgress, createNewCard } from './spaced-repetition';
import { FlashCard, getCardId } from './cards';
import {
  addGuestDeck,
  getGuestDecks,
  getGuestDeckCardProgress,
  updateGuestCardProgress,
  updateGuestDeckProgress,
  hasGuestDeck,
  getGuestDueCards,
  GuestDeckProgress
} from './local-storage-service';

export interface DeckProgress {
  deckId: string;
  addedAt: Date;
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  masteredCards: number;
  lastStudied?: Date;
}

// All functions are stubbed for now - will be replaced when Firebase is installed

export async function addDeckToUser(userId: string, deckId: string, cards: FlashCard[]): Promise<void> {
  if (userId === 'guest') {
    // Guest mode - use localStorage
    addGuestDeck(deckId, cards);
    return;
  }
  
  console.log('Stub: addDeckToUser', userId, deckId);
  throw new Error('Firebase not yet installed - please complete Firebase setup');
}

export async function getUserDecks(userId: string): Promise<DeckProgress[]> {
  if (userId === 'guest') {
    // Guest mode - use localStorage
    const guestDecks = getGuestDecks();
    return guestDecks.map(d => ({
      ...d,
      addedAt: new Date(d.addedAt),
      lastStudied: d.lastStudied ? new Date(d.lastStudied) : undefined,
    }));
  }
  
  console.log('Stub: getUserDecks', userId);
  return [];
}

export async function getDeckCardProgress(userId: string, deckId: string): Promise<CardProgress[]> {
  if (userId === 'guest') {
    // Guest mode - use localStorage
    return getGuestDeckCardProgress(deckId);
  }
  
  console.log('Stub: getDeckCardProgress', userId, deckId);
  return [];
}

export async function updateCardProgress(userId: string, cardProgress: CardProgress): Promise<void> {
  if (userId === 'guest') {
    // Guest mode - use localStorage
    updateGuestCardProgress(cardProgress);
    return;
  }
  
  console.log('Stub: updateCardProgress', userId, cardProgress.cardId);
}

export async function updateDeckProgress(userId: string, deckId: string, cards: CardProgress[]): Promise<void> {
  if (userId === 'guest') {
    // Guest mode - use localStorage
    updateGuestDeckProgress(deckId, cards);
    return;
  }
  
  console.log('Stub: updateDeckProgress', userId, deckId);
}

export async function getAllCardProgress(userId: string): Promise<CardProgress[]> {
  if (userId === 'guest') {
    // Guest mode - get all from localStorage
    const allDecks = getGuestDecks();
    const allProgress: CardProgress[] = [];
    
    for (const deck of allDecks) {
      const deckProgress = getGuestDeckCardProgress(deck.deckId);
      allProgress.push(...deckProgress);
    }
    
    return allProgress;
  }
  
  console.log('Stub: getAllCardProgress', userId);
  return [];
}

export async function hasUserDeck(userId: string, deckId: string): Promise<boolean> {
  if (userId === 'guest') {
    // Guest mode - check localStorage
    return hasGuestDeck(deckId);
  }
  
  console.log('Stub: hasUserDeck', userId, deckId);
  return false;
}

export async function removeDeckFromUser(userId: string, deckId: string): Promise<void> {
  if (userId === 'guest') {
    // Guest mode - remove from localStorage (implementation not needed for Phase 1)
    return;
  }
  
  console.log('Stub: removeDeckFromUser', userId, deckId);
}

export async function getDueCards(userId: string): Promise<CardProgress[]> {
  if (userId === 'guest') {
    // Guest mode - use localStorage
    return getGuestDueCards();
  }
  
  console.log('Stub: getDueCards', userId);
  return [];
}

export async function updateUserXP(userId: string, xpGained: number): Promise<void> {
  if (userId === 'guest') {
    // Guest mode - XP not saved for guests
    return;
  }
  
  console.log('Stub: updateUserXP', userId, xpGained);
}