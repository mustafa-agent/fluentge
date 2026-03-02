import { useState, useEffect } from 'react';
import type { Deck, FlashCard } from './deck-loader';
import { loadAllDecks, loadAllCards } from './deck-loader';

/** Cache so multiple components don't re-load */
let cachedDecks: Deck[] | null = null;
let cachedCards: FlashCard[] | null = null;
let loadingPromise: Promise<void> | null = null;

function ensureLoaded(): Promise<void> {
  if (cachedDecks) return Promise.resolve();
  if (!loadingPromise) {
    loadingPromise = loadAllDecks().then(decks => {
      cachedDecks = decks;
      cachedCards = decks.flatMap(d => d.cards);
    });
  }
  return loadingPromise;
}

/** Hook: returns all decks (lazy-loaded, cached) */
export function useAllDecks(): { decks: Deck[]; loading: boolean } {
  const [loading, setLoading] = useState(!cachedDecks);
  const [decks, setDecks] = useState<Deck[]>(cachedDecks || []);
  
  useEffect(() => {
    if (cachedDecks) { setDecks(cachedDecks); setLoading(false); return; }
    ensureLoaded().then(() => {
      setDecks(cachedDecks!);
      setLoading(false);
    });
  }, []);
  
  return { decks, loading };
}

/** Hook: returns all cards flattened (lazy-loaded, cached) */
export function useAllCards(): { cards: FlashCard[]; loading: boolean } {
  const [loading, setLoading] = useState(!cachedCards);
  const [cards, setCards] = useState<FlashCard[]>(cachedCards || []);
  
  useEffect(() => {
    if (cachedCards) { setCards(cachedCards); setLoading(false); return; }
    ensureLoaded().then(() => {
      setCards(cachedCards!);
      setLoading(false);
    });
  }, []);
  
  return { cards, loading };
}
