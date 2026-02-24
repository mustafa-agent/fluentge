// Temporary stub for Firebase service while Firebase installs
import { CardProgress, createNewCard } from './spaced-repetition';
import { FlashCard, getCardId } from './cards';

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
  console.log('Stub: addDeckToUser', userId, deckId);
  throw new Error('Firebase not yet installed - please complete Firebase setup');
}

export async function getUserDecks(userId: string): Promise<DeckProgress[]> {
  console.log('Stub: getUserDecks', userId);
  return [];
}

export async function getDeckCardProgress(userId: string, deckId: string): Promise<CardProgress[]> {
  console.log('Stub: getDeckCardProgress', userId, deckId);
  return [];
}

export async function updateCardProgress(userId: string, cardProgress: CardProgress): Promise<void> {
  console.log('Stub: updateCardProgress', userId, cardProgress.cardId);
}

export async function updateDeckProgress(userId: string, deckId: string, cards: CardProgress[]): Promise<void> {
  console.log('Stub: updateDeckProgress', userId, deckId);
}

export async function getAllCardProgress(userId: string): Promise<CardProgress[]> {
  console.log('Stub: getAllCardProgress', userId);
  return [];
}

export async function hasUserDeck(userId: string, deckId: string): Promise<boolean> {
  console.log('Stub: hasUserDeck', userId, deckId);
  return false;
}

export async function removeDeckFromUser(userId: string, deckId: string): Promise<void> {
  console.log('Stub: removeDeckFromUser', userId, deckId);
}

export async function getDueCards(userId: string): Promise<CardProgress[]> {
  console.log('Stub: getDueCards', userId);
  return [];
}

export async function updateUserXP(userId: string, xpGained: number): Promise<void> {
  console.log('Stub: updateUserXP', userId, xpGained);
}