export interface FlashCard {
  english: string;
  georgian: string;
  pronunciation: string;
  example_en: string;
  example_ka: string;
  category: string;
  level: string;
}

export interface Deck {
  id: string;
  name: string;
  nameKa: string;
  icon: string;
  cards: FlashCard[];
}

import greetingsData from '../../content/greetings-basics.json';
import numbersData from '../../content/numbers-time.json';

export const decks: Deck[] = [
  {
    id: 'greetings',
    name: 'Greetings & Basics',
    nameKa: 'მისალმებები და საფუძვლები',
    icon: '👋',
    cards: greetingsData as FlashCard[],
  },
  {
    id: 'numbers',
    name: 'Numbers & Time',
    nameKa: 'რიცხვები და დრო',
    icon: '🔢',
    cards: numbersData as FlashCard[],
  },
];

export function getCardId(card: FlashCard): string {
  return `${card.category}_${card.english.toLowerCase().replace(/\s+/g, '_')}`;
}
