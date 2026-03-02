/**
 * Dynamic deck loader — loads JSON card data on demand instead of bundling all 6.5MB upfront.
 * Each deck JSON becomes its own chunk, loaded only when the user opens that deck.
 */

import { deckIndex, type DeckMeta } from './deck-index';

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
  image: string;
  cards: FlashCard[];
}

// --- Dynamic import map: Vite code-splits each JSON into its own chunk ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const contentLoaders: Record<string, () => Promise<any>> = {
  'top-2000-words': () => import('../../content/top-2000-words.json'),
  'greetings-basics': () => import('../../content/greetings-basics.json'),
  'numbers-time': () => import('../../content/numbers-time.json'),
  'family-people': () => import('../../content/family-people.json'),
  'food-drink': () => import('../../content/food-drink.json'),
  'home-housing': () => import('../../content/home-housing.json'),
  'travel-transport': () => import('../../content/travel-transport.json'),
  'work-business': () => import('../../content/work-business.json'),
  'shopping-money': () => import('../../content/shopping-money.json'),
  'health-body': () => import('../../content/health-body.json'),
  'technology': () => import('../../content/technology.json'),
  'nature-weather': () => import('../../content/nature-weather.json'),
  'emotions-personality': () => import('../../content/emotions-personality.json'),
  'education': () => import('../../content/education.json'),
  'entertainment': () => import('../../content/entertainment.json'),
  'politics-society': () => import('../../content/politics-society.json'),
  'sports-fitness': () => import('../../content/sports-fitness.json'),
  'music-art': () => import('../../content/music-art.json'),
  'animals': () => import('../../content/animals.json'),
  'colors-shapes': () => import('../../content/colors-shapes.json'),
  'body-parts': () => import('../../content/body-parts.json'),
  'jobs-professions': () => import('../../content/jobs-professions.json'),
  'social-media': () => import('../../content/social-media.json'),
  'clothing-fashion': () => import('../../content/clothing-fashion.json'),
  'cooking-kitchen': () => import('../../content/cooking-kitchen.json'),
  'law-crime': () => import('../../content/law-crime.json'),
  'relationships-dating': () => import('../../content/relationships-dating.json'),
  'environment-ecology': () => import('../../content/environment-ecology.json'),
  'airport-flying': () => import('../../content/airport-flying.json'),
  'computers-programming': () => import('../../content/computers-programming.json'),
  'movies-tv': () => import('../../content/movies-tv.json'),
  'holidays-celebrations': () => import('../../content/holidays-celebrations.json'),
  'bathroom-hygiene': () => import('../../content/bathroom-hygiene.json'),
  'gardening-plants': () => import('../../content/gardening-plants.json'),
  'banking-finance': () => import('../../content/banking-finance.json'),
  'daily-routines': () => import('../../content/daily-routines.json'),
  'directions-places': () => import('../../content/directions-places.json'),
  'verbs-common': () => import('../../content/verbs-common.json'),
  'science-math': () => import('../../content/science-math.json'),
  'religion-culture': () => import('../../content/religion-culture.json'),
  'emergency-safety': () => import('../../content/emergency-safety.json'),
  'slang-informal': () => import('../../content/slang-informal.json'),
  'relationships-social': () => import('../../content/relationships-social.json'),
  'adjectives-common': () => import('../../content/adjectives-common.json'),
  'car-driving': () => import('../../content/car-driving.json'),
  'prepositions-conjunctions': () => import('../../content/prepositions-conjunctions.json'),
  'restaurant-cafe': () => import('../../content/restaurant-cafe.json'),
  'gym-fitness': () => import('../../content/gym-fitness.json'),
  'hobbies-free-time': () => import('../../content/hobbies-free-time.json'),
  'social-situations': () => import('../../content/social-situations.json'),
  'hotel-accommodation': () => import('../../content/hotel-accommodation.json'),
  'job-interview': () => import('../../content/job-interview.json'),
  'doctor-medical': () => import('../../content/doctor-medical.json'),
  'texting-chat': () => import('../../content/texting-chat.json'),
  'social-life': () => import('../../content/social-life.json'),
  'mma-fighting': () => import('../../content/mma-fighting.json'),
  'gaming-esports': () => import('../../content/gaming-esports.json'),
  'university-college': () => import('../../content/university-college.json'),
  'apartment-rent': () => import('../../content/apartment-rent.json'),
  'programming-coding': () => import('../../content/programming-coding.json'),
  'immigration-visa': () => import('../../content/immigration-visa.json'),
  'youtube-content': () => import('../../content/youtube-content.json'),
  'nightlife-parties': () => import('../../content/nightlife-parties.json'),
  'mental-health': () => import('../../content/mental-health.json'),
  'freelancing-remote': () => import('../../content/freelancing-remote.json'),
  'crypto-investing': () => import('../../content/crypto-investing.json'),
  'self-improvement': () => import('../../content/self-improvement.json'),
  'geography-countries': () => import('../../content/geography-countries.json'),
  'barbershop-grooming': () => import('../../content/barbershop-grooming.json'),
  'driving-test': () => import('../../content/driving-test.json'),
  'phone-apps': () => import('../../content/phone-apps.json'),
  'fast-food-snacks': () => import('../../content/fast-food-snacks.json'),
  'academic-english': () => import('../../content/academic-english.json'),
  'motivation-success': () => import('../../content/motivation-success.json'),
  'beauty-cosmetics': () => import('../../content/beauty-cosmetics.json'),
  'public-transport': () => import('../../content/public-transport.json'),
  'photography-camera': () => import('../../content/photography-camera.json'),
  'music-lyrics': () => import('../../content/music-lyrics.json'),
  'pets-vet': () => import('../../content/pets-vet.json'),
  'news-media': () => import('../../content/news-media.json'),
  'street-urban': () => import('../../content/street-urban.json'),
  'email-formal-writing': () => import('../../content/email-formal-writing.json'),
  'customer-service': () => import('../../content/customer-service.json'),
  'supermarket-grocery': () => import('../../content/supermarket-grocery.json'),
  'household-chores': () => import('../../content/household-chores.json'),
  'office-workplace': () => import('../../content/office-workplace.json'),
  'taxi-rideshare': () => import('../../content/taxi-rideshare.json'),
  'linking-words': () => import('../../content/linking-words.json'),
  'ielts-toefl-vocab': () => import('../../content/ielts-toefl-vocab.json'),
  'startup-business': () => import('../../content/startup-business.json'),
  'real-estate-property': () => import('../../content/real-estate-property.json'),
  'work-abroad': () => import('../../content/work-abroad.json'),
  'english-for-gamers': () => import('../../content/english-for-gamers.json'),
  'work-emails': () => import('../../content/work-emails.json'),
  'history-war': () => import('../../content/history-war.json'),
  'movies-cinema': () => import('../../content/movies-cinema.json'),
  'music-genres': () => import('../../content/music-genres.json'),
  'psychology-mind': () => import('../../content/psychology-mind.json'),
  'journalism-news': () => import('../../content/journalism-news.json'),
  'sports-extreme': () => import('../../content/sports-extreme.json'),
  'ocean-marine': () => import('../../content/ocean-marine.json'),
  'weather-climate': () => import('../../content/weather-climate.json'),
  'camping-outdoor': () => import('../../content/camping-outdoor.json'),
  'friendship-social': () => import('../../content/friendship-social.json'),
};

// --- In-memory cache ---
const deckCache = new Map<string, Deck>();
const contentCache = new Map<string, FlashCard[]>();

/** Merge multiple card arrays, deduplicate by english word, cap at 50 */
function mergeCards(...sources: FlashCard[][]): FlashCard[] {
  const seen = new Set<string>();
  const result: FlashCard[] = [];
  for (const src of sources) {
    for (const card of src) {
      const key = card.english.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(card);
      }
    }
  }
  return result.slice(0, 50);
}

/** Load a single content file by source id */
async function loadContent(sourceId: string): Promise<FlashCard[]> {
  if (contentCache.has(sourceId)) return contentCache.get(sourceId)!;
  const loader = contentLoaders[sourceId];
  if (!loader) {
    console.warn(`No loader for content: ${sourceId}`);
    return [];
  }
  const module = await loader();
  const cards = (module.default || module) as FlashCard[];
  contentCache.set(sourceId, cards);
  return cards;
}

/** Load a deck by id — returns cached if available */
export async function loadDeck(deckId: string): Promise<Deck | null> {
  if (deckCache.has(deckId)) return deckCache.get(deckId)!;
  
  const meta = deckIndex.find(d => d.id === deckId);
  if (!meta) return null;
  
  // Load all source content in parallel
  const sources = await Promise.all(meta.sources.map(s => loadContent(s)));
  
  const cards = meta.merged ? mergeCards(...sources) : sources[0] || [];
  
  const deck: Deck = {
    id: meta.id,
    name: meta.name,
    nameKa: meta.nameKa,
    icon: meta.icon,
    image: meta.image,
    cards,
  };
  
  deckCache.set(deckId, deck);
  return deck;
}

/** Load ALL decks — used by games/search that need all cards */
export async function loadAllDecks(): Promise<Deck[]> {
  const results = await Promise.all(deckIndex.map(m => loadDeck(m.id)));
  return results.filter((d): d is Deck => d !== null);
}

/** Load all cards flattened — convenience for games */
export async function loadAllCards(): Promise<FlashCard[]> {
  const decks = await loadAllDecks();
  return decks.flatMap(d => d.cards);
}

/** Get card ID for storage keys */
export function getCardId(card: FlashCard, direction?: 'enka' | 'kaen' | 'mixed'): string {
  const base = `${card.category}_${card.english.toLowerCase().replace(/\s+/g, '_')}`;
  return direction ? `${base}_${direction}` : base;
}
