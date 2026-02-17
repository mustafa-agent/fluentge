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
import familyData from '../../content/family-people.json';
import foodData from '../../content/food-drink.json';
import homeData from '../../content/home-housing.json';
import travelData from '../../content/travel-transport.json';
import healthData from '../../content/health-body.json';
import shoppingData from '../../content/shopping-money.json';
import workData from '../../content/work-business.json';
import technologyData from '../../content/technology.json';
import natureData from '../../content/nature-weather.json';
import emotionsData from '../../content/emotions-personality.json';
import educationData from '../../content/education.json';
import entertainmentData from '../../content/entertainment.json';
import idiomsData from '../../content/idioms-phrases.json';

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
  {
    id: 'family',
    name: 'Family & People',
    nameKa: 'ოჯახი და ხალხი',
    icon: '👨‍👩‍👧‍👦',
    cards: familyData as FlashCard[],
  },
  {
    id: 'food',
    name: 'Food & Drink',
    nameKa: 'საკვები და სასმელი',
    icon: '🍕',
    cards: foodData as FlashCard[],
  },
  {
    id: 'home',
    name: 'Home & Housing',
    nameKa: 'სახლი და საცხოვრებელი',
    icon: '🏠',
    cards: homeData as FlashCard[],
  },
  {
    id: 'travel',
    name: 'Travel & Transport',
    nameKa: 'მოგზაურობა და ტრანსპორტი',
    icon: '✈️',
    cards: travelData as FlashCard[],
  },
  {
    id: 'work',
    name: 'Work & Business',
    nameKa: 'სამუშაო და ბიზნესი',
    icon: '💼',
    cards: workData as FlashCard[],
  },
  {
    id: 'shopping',
    name: 'Shopping & Money',
    nameKa: 'შოპინგი და ფული',
    icon: '🛒',
    cards: shoppingData as FlashCard[],
  },
  {
    id: 'health',
    name: 'Health & Body',
    nameKa: 'ჯანმრთელობა და სხეული',
    icon: '🏥',
    cards: healthData as FlashCard[],
  },
  {
    id: 'technology',
    name: 'Technology',
    nameKa: 'ტექნოლოგია',
    icon: '💻',
    cards: technologyData as FlashCard[],
  },
  {
    id: 'nature',
    name: 'Nature & Weather',
    nameKa: 'ბუნება და ამინდი',
    icon: '🌿',
    cards: natureData as FlashCard[],
  },
  {
    id: 'emotions',
    name: 'Emotions & Personality',
    nameKa: 'ემოციები და პიროვნება',
    icon: '😊',
    cards: emotionsData as FlashCard[],
  },
  {
    id: 'education',
    name: 'Education',
    nameKa: 'განათლება',
    icon: '📚',
    cards: educationData as FlashCard[],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    nameKa: 'გართობა',
    icon: '🎬',
    cards: entertainmentData as FlashCard[],
  },
  {
    id: 'idioms',
    name: 'Idioms & Phrases',
    nameKa: 'იდიომები და ფრაზები',
    icon: '💬',
    cards: idiomsData as FlashCard[],
  },
];

export function getCardId(card: FlashCard): string {
  return `${card.category}_${card.english.toLowerCase().replace(/\s+/g, '_')}`;
}
