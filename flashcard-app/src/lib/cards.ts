/**
 * cards.ts — Backward-compatible re-export layer
 * 
 * Previously: 104 static JSON imports = 6.5MB bundle
 * Now: Re-exports from deck-index (metadata) + deck-loader (async loading)
 * 
 * The `decks` array is populated asynchronously. Components that need
 * immediate access should use deckIndex from deck-index.ts instead.
 */

// Re-export types and utilities
export type { FlashCard, Deck } from './deck-loader';
export { getCardId, loadDeck, loadAllDecks, loadAllCards } from './deck-loader';
export { deckIndex, FREE_DECK_IDS, isDeckFree } from './deck-index';
export type { DeckMeta } from './deck-index';

import type { Deck } from './deck-loader';
import { loadAllDecks } from './deck-loader';

/**
 * Mutable decks array — starts empty, populated after loadDecksAsync().
 * Components using this at module level (games) should call ensureDecksLoaded() first.
 */
export let decks: Deck[] = [];

let _loadPromise: Promise<Deck[]> | null = null;

/** Ensure all decks are loaded. Safe to call multiple times. */
export function ensureDecksLoaded(): Promise<Deck[]> {
  if (decks.length > 0) return Promise.resolve(decks);
  if (!_loadPromise) {
    _loadPromise = loadAllDecks().then(loaded => {
      decks = loaded;
      return loaded;
    });
  }
  return _loadPromise;
}
