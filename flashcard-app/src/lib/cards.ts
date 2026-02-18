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
import politicsData from '../../content/politics-society.json';
import conversationsData from '../../content/daily-conversations.json';
import sportsData from '../../content/sports-fitness.json';
import musicData from '../../content/music-art.json';
import animalsData from '../../content/animals.json';
import colorsData from '../../content/colors-shapes.json';
import bodyPartsData from '../../content/body-parts.json';
import weatherSeasonsData from '../../content/weather-seasons.json';
import jobsData from '../../content/jobs-professions.json';
import socialMediaData from '../../content/social-media.json';
import clothingData from '../../content/clothing-fashion.json';
import cookingData from '../../content/cooking-kitchen.json';
import lawData from '../../content/law-crime.json';
import relationshipsData from '../../content/relationships-dating.json';
import environmentData from '../../content/environment-ecology.json';
import airportData from '../../content/airport-flying.json';
import computersData from '../../content/computers-programming.json';
import moviesData from '../../content/movies-tv.json';
import holidaysData from '../../content/holidays-celebrations.json';
import hygieneData from '../../content/bathroom-hygiene.json';
import gardeningData from '../../content/gardening-plants.json';
import bankingData from '../../content/banking-finance.json';
import dailyRoutinesData from '../../content/daily-routines.json';
import directionsData from '../../content/directions-places.json';
import verbsData from '../../content/verbs-common.json';
import scienceData from '../../content/science-math.json';
import religionData from '../../content/religion-culture.json';
import emergencyData from '../../content/emergency-safety.json';
import slangData from '../../content/slang-informal.json';
import animalsPetsData from '../../content/animals-pets.json';
import clothesFashionData from '../../content/clothes-fashion.json';
import jobsCareersData from '../../content/jobs-careers.json';
import musicArtsData from '../../content/music-arts.json';
import relationshipsSocialData from '../../content/relationships-social.json';
import seasonsHolidaysData from '../../content/seasons-holidays.json';
import sportsGamesData from '../../content/sports-games.json';

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
  {
    id: 'politics',
    name: 'Politics & Society',
    nameKa: 'პოლიტიკა და საზოგადოება',
    icon: '🏛️',
    cards: politicsData as FlashCard[],
  },
  {
    id: 'conversations',
    name: 'Daily Conversations',
    nameKa: 'ყოველდღიური საუბრები',
    icon: '🗣️',
    cards: conversationsData as FlashCard[],
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    nameKa: 'სპორტი და ფიტნესი',
    icon: '⚽',
    cards: sportsData as FlashCard[],
  },
  {
    id: 'music',
    name: 'Music & Art',
    nameKa: 'მუსიკა და ხელოვნება',
    icon: '🎵',
    cards: musicData as FlashCard[],
  },
  {
    id: 'animals',
    name: 'Animals',
    nameKa: 'ცხოველები',
    icon: '🐾',
    cards: animalsData as FlashCard[],
  },
  {
    id: 'colors',
    name: 'Colors & Shapes',
    nameKa: 'ფერები და ფიგურები',
    icon: '🎨',
    cards: colorsData as FlashCard[],
  },
  {
    id: 'bodyparts',
    name: 'Body Parts',
    nameKa: 'სხეულის ნაწილები',
    icon: '🦴',
    cards: bodyPartsData as FlashCard[],
  },
  {
    id: 'weatherseasons',
    name: 'Weather & Seasons',
    nameKa: 'ამინდი და სეზონები',
    icon: '🌦️',
    cards: weatherSeasonsData as FlashCard[],
  },
  {
    id: 'jobs',
    name: 'Jobs & Professions',
    nameKa: 'პროფესიები',
    icon: '👨‍⚕️',
    cards: jobsData as FlashCard[],
  },
  {
    id: 'socialmedia',
    name: 'Social Media & Internet',
    nameKa: 'სოციალური მედია',
    icon: '📱',
    cards: socialMediaData as FlashCard[],
  },
  {
    id: 'clothing',
    name: 'Clothing & Fashion',
    nameKa: 'ტანსაცმელი და მოდა',
    icon: '👗',
    cards: clothingData as FlashCard[],
  },
  {
    id: 'cooking',
    name: 'Cooking & Kitchen',
    nameKa: 'სამზარეულო და კულინარია',
    icon: '🍳',
    cards: cookingData as FlashCard[],
  },
  {
    id: 'law',
    name: 'Law & Crime',
    nameKa: 'კანონი და დანაშაული',
    icon: '⚖️',
    cards: lawData as FlashCard[],
  },
  {
    id: 'relationships',
    name: 'Relationships & Dating',
    nameKa: 'ურთიერთობები',
    icon: '❤️',
    cards: relationshipsData as FlashCard[],
  },
  {
    id: 'environment',
    name: 'Environment & Ecology',
    nameKa: 'გარემო და ეკოლოგია',
    icon: '🌍',
    cards: environmentData as FlashCard[],
  },
  {
    id: 'airport',
    name: 'Airport & Flying',
    nameKa: 'აეროპორტი და ფრენა',
    icon: '✈️',
    cards: airportData as FlashCard[],
  },
  {
    id: 'computers',
    name: 'Computers & Programming',
    nameKa: 'კომპიუტერები და პროგრამირება',
    icon: '💻',
    cards: computersData as FlashCard[],
  },
  {
    id: 'movies',
    name: 'Movies & TV',
    nameKa: 'ფილმები და სერიალები',
    icon: '🎬',
    cards: moviesData as FlashCard[],
  },
  {
    id: 'holidays',
    name: 'Holidays & Celebrations',
    nameKa: 'დღესასწაულები',
    icon: '🎉',
    cards: holidaysData as FlashCard[],
  },
  {
    id: 'hygiene',
    name: 'Bathroom & Hygiene',
    nameKa: 'ჰიგიენა და მოვლა',
    icon: '🧼',
    cards: hygieneData as FlashCard[],
  },
  {
    id: 'dailyroutines',
    name: 'Daily Routines',
    nameKa: 'ყოველდღიური რუტინა',
    icon: '🌅',
    cards: dailyRoutinesData as FlashCard[],
  },
  {
    id: 'directions',
    name: 'Directions & Places',
    nameKa: 'მიმართულებები და ადგილები',
    icon: '🗺️',
    cards: directionsData as FlashCard[],
  },
  {
    id: 'verbs',
    name: 'Common Verbs',
    nameKa: 'ხშირი ზმნები',
    icon: '🏃',
    cards: verbsData as FlashCard[],
  },
  {
    id: 'science',
    name: 'Science & Math',
    nameKa: 'მეცნიერება და მათემატიკა',
    icon: '🔬',
    cards: scienceData as FlashCard[],
  },
  {
    id: 'religion',
    name: 'Religion & Culture',
    nameKa: 'რელიგია და კულტურა',
    icon: '⛪',
    cards: religionData as FlashCard[],
  },
  {
    id: 'gardening',
    name: 'Gardening & Plants',
    nameKa: 'მებაღეობა და მცენარეები',
    icon: '🌱',
    cards: gardeningData as FlashCard[],
  },
  {
    id: 'banking',
    name: 'Banking & Finance',
    nameKa: 'საბანკო და ფინანსები',
    icon: '🏦',
    cards: bankingData as FlashCard[],
  },
  {
    id: 'animals-pets',
    name: 'Animals & Pets',
    nameKa: 'ცხოველები და შინაურები',
    icon: '🐕',
    cards: animalsPetsData as FlashCard[],
  },
  {
    id: 'clothes-fashion',
    name: 'Clothes & Fashion',
    nameKa: 'ტანსაცმელი და მოდა',
    icon: '👔',
    cards: clothesFashionData as FlashCard[],
  },
  {
    id: 'jobs-careers',
    name: 'Jobs & Careers',
    nameKa: 'პროფესიები და კარიერა',
    icon: '👨‍💼',
    cards: jobsCareersData as FlashCard[],
  },
  {
    id: 'music-arts',
    name: 'Music & Arts',
    nameKa: 'მუსიკა და ხელოვნება',
    icon: '🎭',
    cards: musicArtsData as FlashCard[],
  },
  {
    id: 'relationships-social',
    name: 'Relationships & Social',
    nameKa: 'ურთიერთობები და სოციალური',
    icon: '🤝',
    cards: relationshipsSocialData as FlashCard[],
  },
  {
    id: 'seasons-holidays',
    name: 'Seasons & Holidays',
    nameKa: 'სეზონები და დღესასწაულები',
    icon: '🎄',
    cards: seasonsHolidaysData as FlashCard[],
  },
  {
    id: 'sports-games',
    name: 'Sports & Games',
    nameKa: 'სპორტი და თამაშები',
    icon: '🏆',
    cards: sportsGamesData as FlashCard[],
  },
  {
    id: 'emergency',
    name: 'Emergency & Safety',
    nameKa: 'გადაუდებელი და უსაფრთხოება',
    icon: '🚨',
    cards: emergencyData as FlashCard[],
  },
  {
    id: 'slang',
    name: 'Slang & Informal',
    nameKa: 'სლენგი და არაფორმალური',
    icon: '🤙',
    cards: slangData as FlashCard[],
  },
];

// Free tier: only these decks are accessible without premium
export const FREE_DECK_IDS = ['greetings', 'numbers', 'food'];

export function isDeckFree(deckId: string): boolean {
  return FREE_DECK_IDS.includes(deckId);
}

export function getCardId(card: FlashCard): string {
  return `${card.category}_${card.english.toLowerCase().replace(/\s+/g, '_')}`;
}
