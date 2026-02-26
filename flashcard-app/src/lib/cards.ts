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

// Helper: merge multiple card arrays, deduplicate by english word, cap at 50
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
import relationshipsSocialData from '../../content/relationships-social.json';
import adjectivesCommonData from '../../content/adjectives-common.json';
import carDrivingData from '../../content/car-driving.json';
import prepositionsData from '../../content/prepositions-conjunctions.json';
import restaurantData from '../../content/restaurant-cafe.json';
import gymData from '../../content/gym-fitness.json';
import hobbiesData from '../../content/hobbies-free-time.json';
import socialSituationsData from '../../content/social-situations.json';
import hotelData from '../../content/hotel-accommodation.json';
import jobInterviewData from '../../content/job-interview.json';
import doctorMedicalData from '../../content/doctor-medical.json';
import textingChatData from '../../content/texting-chat.json';
import socialLifeData from '../../content/social-life.json';
import mmaFightingData from '../../content/mma-fighting.json';
import gamingEsportsData from '../../content/gaming-esports.json';
import universityData from '../../content/university-college.json';
import apartmentRentData from '../../content/apartment-rent.json';
import programmingCodingData from '../../content/programming-coding.json';
import immigrationVisaData from '../../content/immigration-visa.json';
import youtubeContentData from '../../content/youtube-content.json';
import nightlifePartiesData from '../../content/nightlife-parties.json';
import mentalHealthData from '../../content/mental-health.json';
import freelancingRemoteData from '../../content/freelancing-remote.json';
import cryptoInvestingData from '../../content/crypto-investing.json';
import selfImprovementData from '../../content/self-improvement.json';
import geographyCountriesData from '../../content/geography-countries.json';
import barbershopGroomingData from '../../content/barbershop-grooming.json';
import drivingTestData from '../../content/driving-test.json';
import phoneAppsData from '../../content/phone-apps.json';
import fastFoodSnacksData from '../../content/fast-food-snacks.json';
import phrasalVerbsData from '../../content/phrasal-verbs.json';
import academicEnglishData from '../../content/academic-english.json';
import motivationSuccessData from '../../content/motivation-success.json';
import beautyCosmeticsData from '../../content/beauty-cosmetics.json';
import publicTransportData from '../../content/public-transport.json';
import photographyCameraData from '../../content/photography-camera.json';
import musicLyricsData from '../../content/music-lyrics.json';
import petsVetData from '../../content/pets-vet.json';
import newsMediaData from '../../content/news-media.json';
import streetUrbanData from '../../content/street-urban.json';
import emailFormalData from '../../content/email-formal-writing.json';
import opinionsDebateData from '../../content/opinions-debate.json';
import smallTalkData from '../../content/small-talk.json';
import customerServiceData from '../../content/customer-service.json';
import everydayProblemsData from '../../content/everyday-problems.json';
import supermarketGroceryData from '../../content/supermarket-grocery.json';
import householdChoresData from '../../content/household-chores.json';
import officeWorkplaceData from '../../content/office-workplace.json';
import taxiRideshareData from '../../content/taxi-rideshare.json';
import linkingWordsData from '../../content/linking-words.json';
import ieltsToeflData from '../../content/ielts-toefl-vocab.json';
import startupBusinessData from '../../content/startup-business.json';
import realEstatePropertyData from '../../content/real-estate-property.json';
import workAbroadData from '../../content/work-abroad.json';
import englishForGamersData from '../../content/english-for-gamers.json';
import workEmailsData from '../../content/work-emails.json';
import top5000WordsData from '../../content/top-5000-words.json';
import historyWarData from '../../content/history-war.json';
import moviesCinemaData from '../../content/movies-cinema.json';
import musicGenresData from '../../content/music-genres.json';
import psychologyMindData from '../../content/psychology-mind.json';
import journalismNewsData from '../../content/journalism-news.json';
import sportsExtremeData from '../../content/sports-extreme.json';
import oceanMarineData from '../../content/ocean-marine.json';
import weatherClimateData from '../../content/weather-climate.json';
import campingOutdoorData from '../../content/camping-outdoor.json';
import friendshipSocialData from '../../content/friendship-social.json';

export const decks: Deck[] = [
  {
    id: 'top-5000',
    name: 'Top 5000 English Words',
    nameKa: 'ტოპ 5000 ინგლისური სიტყვა',
    icon: '⭐',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80',
    cards: top5000WordsData as FlashCard[],
  },
  {
    id: 'greetings',
    name: 'Greetings & Basics',
    nameKa: 'მისალმებები და საფუძვლები',
    icon: '👋',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    cards: greetingsData as FlashCard[],
  },
  {
    id: 'numbers',
    name: 'Numbers & Time',
    nameKa: 'რიცხვები და დრო',
    icon: '🔢',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    cards: numbersData as FlashCard[],
  },
  {
    id: 'family',
    name: 'Family & People',
    nameKa: 'ოჯახი და ხალხი',
    icon: '👨‍👩‍👧‍👦',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80',
    cards: familyData as FlashCard[],
  },
  // MERGED: Food & Drink + Cooking & Kitchen + Restaurant & Cafe + Fast Food & Snacks
  {
    id: 'food',
    name: 'Food & Cooking',
    nameKa: 'საკვები და კულინარია',
    icon: '🍳',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    cards: mergeCards(foodData as FlashCard[], cookingData as FlashCard[], restaurantData as FlashCard[], fastFoodSnacksData as FlashCard[]),
  },
  {
    id: 'home',
    name: 'Home & Housing',
    nameKa: 'სახლი და საცხოვრებელი',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80',
    cards: homeData as FlashCard[],
  },
  // MERGED: Travel & Transport + Hotel & Accommodation + Airport & Flying
  {
    id: 'travel',
    name: 'Travel',
    nameKa: 'მოგზაურობა',
    icon: '✈️',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
    cards: mergeCards(travelData as FlashCard[], hotelData as FlashCard[], airportData as FlashCard[]),
  },
  // MERGED: Work & Business + Startup & Business + Freelancing & Remote Work + Work Abroad + Office & Workplace
  {
    id: 'work',
    name: 'Work & Business',
    nameKa: 'სამუშაო და ბიზნესი',
    icon: '💼',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&q=80',
    cards: mergeCards(workData as FlashCard[], startupBusinessData as FlashCard[], freelancingRemoteData as FlashCard[], workAbroadData as FlashCard[], officeWorkplaceData as FlashCard[]),
  },
  // MERGED: Shopping & Money + Supermarket & Grocery
  {
    id: 'shopping',
    name: 'Shopping & Grocery',
    nameKa: 'შოპინგი და სასურსათო',
    icon: '🛒',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80',
    cards: mergeCards(shoppingData as FlashCard[], supermarketGroceryData as FlashCard[]),
  },
  {
    id: 'health',
    name: 'Health & Body',
    nameKa: 'ჯანმრთელობა და სხეული',
    icon: '🏥',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    cards: healthData as FlashCard[],
  },
  {
    id: 'technology',
    name: 'Technology',
    nameKa: 'ტექნოლოგია',
    icon: '💻',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    cards: technologyData as FlashCard[],
  },
  // MERGED: Nature & Weather + Weather & Climate
  {
    id: 'nature',
    name: 'Nature & Weather',
    nameKa: 'ბუნება და ამინდი',
    icon: '🌿',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80',
    cards: mergeCards(natureData as FlashCard[], weatherClimateData as FlashCard[]),
  },
  {
    id: 'emotions',
    name: 'Emotions & Personality',
    nameKa: 'ემოციები და პიროვნება',
    icon: '😊',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80',
    cards: emotionsData as FlashCard[],
  },
  {
    id: 'education',
    name: 'Education',
    nameKa: 'განათლება',
    icon: '📚',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
    cards: educationData as FlashCard[],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    nameKa: 'გართობა',
    icon: '🎭',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    cards: entertainmentData as FlashCard[],
  },
  {
    id: 'idioms',
    name: 'Idioms & Phrases',
    nameKa: 'იდიომები და ფრაზები',
    icon: '📖',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
    cards: idiomsData as FlashCard[],
  },
  {
    id: 'politics',
    name: 'Politics & Society',
    nameKa: 'პოლიტიკა და საზოგადოება',
    icon: '🏛️',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80',
    cards: politicsData as FlashCard[],
  },
  // MERGED: Daily Conversations + Small Talk
  {
    id: 'conversations',
    name: 'Daily Conversations',
    nameKa: 'ყოველდღიური საუბრები',
    icon: '🗣️',
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400&q=80',
    cards: mergeCards(conversationsData as FlashCard[], smallTalkData as FlashCard[]),
  },
  // MERGED: Sports & Fitness + Gym & Fitness + MMA & Fighting + Extreme Sports & Adventure
  {
    id: 'sports',
    name: 'Sports & Fitness',
    nameKa: 'სპორტი და ფიტნესი',
    icon: '⚽',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
    cards: mergeCards(sportsData as FlashCard[], gymData as FlashCard[], mmaFightingData as FlashCard[], sportsExtremeData as FlashCard[]),
  },
  // MERGED: Music & Art + Music & Lyrics + Music & Genres
  {
    id: 'music',
    name: 'Music',
    nameKa: 'მუსიკა',
    icon: '🎵',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80',
    cards: mergeCards(musicData as FlashCard[], musicLyricsData as FlashCard[], musicGenresData as FlashCard[]),
  },
  {
    id: 'animals',
    name: 'Animals',
    nameKa: 'ცხოველები',
    icon: '🐾',
    image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&q=80',
    cards: animalsData as FlashCard[],
  },
  {
    id: 'colors',
    name: 'Colors & Shapes',
    nameKa: 'ფერები და ფიგურები',
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=400&q=80',
    cards: colorsData as FlashCard[],
  },
  {
    id: 'bodyparts',
    name: 'Body Parts',
    nameKa: 'სხეულის ნაწილები',
    icon: '🦴',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
    cards: bodyPartsData as FlashCard[],
  },
  {
    id: 'jobs',
    name: 'Jobs & Professions',
    nameKa: 'პროფესიები',
    icon: '👨‍⚕️',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80',
    cards: jobsData as FlashCard[],
  },
  {
    id: 'socialmedia',
    name: 'Social Media & Internet',
    nameKa: 'სოციალური მედია',
    icon: '📱',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',
    cards: socialMediaData as FlashCard[],
  },
  {
    id: 'clothing',
    name: 'Clothing & Fashion',
    nameKa: 'ტანსაცმელი და მოდა',
    icon: '👗',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
    cards: clothingData as FlashCard[],
  },
  {
    id: 'law',
    name: 'Law & Crime',
    nameKa: 'კანონი და დანაშაული',
    icon: '⚖️',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    cards: lawData as FlashCard[],
  },
  // MERGED: Relationships & Dating + Relationships & Social + Social Life + Social Situations + Friendship & Social Life
  {
    id: 'relationships-social',
    name: 'Relationships & Social',
    nameKa: 'ურთიერთობები და სოციალური',
    icon: '🤝',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80',
    cards: mergeCards(relationshipsData as FlashCard[], relationshipsSocialData as FlashCard[], socialLifeData as FlashCard[], socialSituationsData as FlashCard[], friendshipSocialData as FlashCard[]),
  },
  {
    id: 'environment',
    name: 'Environment & Ecology',
    nameKa: 'გარემო და ეკოლოგია',
    icon: '🌍',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
    cards: environmentData as FlashCard[],
  },
  // MERGED: Computers & Programming + Programming & Coding
  {
    id: 'computers',
    name: 'Programming & Tech',
    nameKa: 'პროგრამირება და ტექნოლოგია',
    icon: '👨‍💻',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
    cards: mergeCards(computersData as FlashCard[], programmingCodingData as FlashCard[]),
  },
  // MERGED: Movies & TV + Movies & Cinema
  {
    id: 'movies',
    name: 'Movies & TV',
    nameKa: 'ფილმები და სერიალები',
    icon: '🎬',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
    cards: mergeCards(moviesData as FlashCard[], moviesCinemaData as FlashCard[]),
  },
  {
    id: 'holidays',
    name: 'Holidays & Celebrations',
    nameKa: 'დღესასწაულები',
    icon: '🎉',
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&q=80',
    cards: holidaysData as FlashCard[],
  },
  {
    id: 'hygiene',
    name: 'Bathroom & Hygiene',
    nameKa: 'ჰიგიენა და მოვლა',
    icon: '🧼',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
    cards: hygieneData as FlashCard[],
  },
  {
    id: 'dailyroutines',
    name: 'Daily Routines',
    nameKa: 'ყოველდღიური რუტინა',
    icon: '🌅',
    image: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=400&q=80',
    cards: dailyRoutinesData as FlashCard[],
  },
  {
    id: 'directions',
    name: 'Directions & Places',
    nameKa: 'მიმართულებები და ადგილები',
    icon: '🧭',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80',
    cards: directionsData as FlashCard[],
  },
  {
    id: 'verbs',
    name: 'Common Verbs',
    nameKa: 'ხშირი ზმნები',
    icon: '🏃',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
    cards: verbsData as FlashCard[],
  },
  {
    id: 'science',
    name: 'Science & Math',
    nameKa: 'მეცნიერება და მათემატიკა',
    icon: '🔬',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80',
    cards: scienceData as FlashCard[],
  },
  {
    id: 'religion',
    name: 'Religion & Culture',
    nameKa: 'რელიგია და კულტურა',
    icon: '⛪',
    image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=400&q=80',
    cards: religionData as FlashCard[],
  },
  {
    id: 'gardening',
    name: 'Gardening & Plants',
    nameKa: 'მებაღეობა და მცენარეები',
    icon: '🌱',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
    cards: gardeningData as FlashCard[],
  },
  // MERGED: Banking & Finance + Crypto & Investing
  {
    id: 'finance',
    name: 'Finance & Investing',
    nameKa: 'ფინანსები და ინვესტიცია',
    icon: '💰',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80',
    cards: mergeCards(bankingData as FlashCard[], cryptoInvestingData as FlashCard[]),
  },
  {
    id: 'emergency',
    name: 'Emergency & Safety',
    nameKa: 'გადაუდებელი და უსაფრთხოება',
    icon: '🚨',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80',
    cards: emergencyData as FlashCard[],
  },
  // MERGED: Slang & Informal + Texting & Chat Slang
  {
    id: 'slang',
    name: 'Slang & Internet',
    nameKa: 'სლენგი და ინტერნეტი',
    icon: '🤙',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80',
    cards: mergeCards(slangData as FlashCard[], textingChatData as FlashCard[]),
  },
  {
    id: 'adjectives-common',
    name: 'Common Adjectives',
    nameKa: 'ხშირი ზედსართავები',
    icon: '📝',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80',
    cards: adjectivesCommonData as FlashCard[],
  },
  // MERGED: Cars & Driving + Driving & Road Rules
  {
    id: 'car-driving',
    name: 'Cars & Driving',
    nameKa: 'მანქანა და მართვა',
    icon: '🚗',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80',
    cards: mergeCards(carDrivingData as FlashCard[], drivingTestData as FlashCard[]),
  },
  {
    id: 'prepositions-conjunctions',
    name: 'Prepositions & Conjunctions',
    nameKa: 'წინდებულები და კავშირები',
    icon: '🔗',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
    cards: prepositionsData as FlashCard[],
  },
  {
    id: 'hobbies-free-time',
    name: 'Hobbies & Free Time',
    nameKa: 'ჰობი და თავისუფალი დრო',
    icon: '🎯',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
    cards: hobbiesData as FlashCard[],
  },
  {
    id: 'job-interview',
    name: 'Job Interview',
    nameKa: 'სამუშაო გასაუბრება',
    icon: '👔',
    image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=400&q=80',
    cards: jobInterviewData as FlashCard[],
  },
  {
    id: 'doctor',
    name: 'Doctor & Medical',
    nameKa: 'ექიმი და სამედიცინო',
    icon: '🩺',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80',
    cards: doctorMedicalData as FlashCard[],
  },
  // MERGED: Gaming & Esports + English for Gamers
  {
    id: 'gaming',
    name: 'Gaming',
    nameKa: 'გეიმინგი',
    icon: '🎮',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
    cards: mergeCards(gamingEsportsData as FlashCard[], englishForGamersData as FlashCard[]),
  },
  {
    id: 'university-college',
    name: 'University & College',
    nameKa: 'უნივერსიტეტი',
    icon: '🎓',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80',
    cards: universityData as FlashCard[],
  },
  {
    id: 'apartment-rent',
    name: 'Apartment & Rent',
    nameKa: 'ბინა და ქირა',
    icon: '🏢',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
    cards: apartmentRentData as FlashCard[],
  },
  {
    id: 'immigration-visa',
    name: 'Immigration & Visa',
    nameKa: 'იმიგრაცია და ვიზა',
    icon: '🛫',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80',
    cards: immigrationVisaData as FlashCard[],
  },
  {
    id: 'youtube-content',
    name: 'YouTube & Content Creation',
    nameKa: 'YouTube და კონტენტი',
    icon: '🎥',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80',
    cards: youtubeContentData as FlashCard[],
  },
  {
    id: 'nightlife-parties',
    name: 'Nightlife & Parties',
    nameKa: 'ღამის ცხოვრება',
    icon: '🌙',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    cards: nightlifePartiesData as FlashCard[],
  },
  // MERGED: Mental Health + Psychology & Mind
  {
    id: 'mental-health',
    name: 'Mental Health',
    nameKa: 'ფსიქიკური ჯანმრთელობა',
    icon: '🧠',
    image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=400&q=80',
    cards: mergeCards(mentalHealthData as FlashCard[], psychologyMindData as FlashCard[]),
  },
  // MERGED: Self-Improvement + Motivation & Success
  {
    id: 'self-improvement',
    name: 'Self-Improvement',
    nameKa: 'თვითგანვითარება',
    icon: '🚀',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80',
    cards: mergeCards(selfImprovementData as FlashCard[], motivationSuccessData as FlashCard[]),
  },
  {
    id: 'geography-countries',
    name: 'Geography & Countries',
    nameKa: 'გეოგრაფია და ქვეყნები',
    icon: '🗺️',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=80',
    cards: geographyCountriesData as FlashCard[],
  },
  {
    id: 'barbershop-grooming',
    name: 'Barbershop & Grooming',
    nameKa: 'სალონი და მოვლა',
    icon: '💈',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
    cards: barbershopGroomingData as FlashCard[],
  },
  {
    id: 'phone-apps',
    name: 'Phone & Apps',
    nameKa: 'ტელეფონი და აპები',
    icon: '📲',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',
    cards: phoneAppsData as FlashCard[],
  },
  {
    id: 'phrasal-verbs',
    name: 'Phrasal Verbs',
    nameKa: 'ფრაზული ზმნები',
    icon: '🔄',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80',
    cards: phrasalVerbsData as FlashCard[],
  },
  // MERGED: Academic English + IELTS & TOEFL Vocabulary
  {
    id: 'academic-english',
    name: 'Academic English',
    nameKa: 'აკადემიური ინგლისური',
    icon: '🏆',
    image: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?w=400&q=80',
    cards: mergeCards(academicEnglishData as FlashCard[], ieltsToeflData as FlashCard[]),
  },
  {
    id: 'beauty-cosmetics',
    name: 'Beauty & Cosmetics',
    nameKa: 'სილამაზე და კოსმეტიკა',
    icon: '💄',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    cards: beautyCosmeticsData as FlashCard[],
  },
  {
    id: 'public-transport',
    name: 'Public Transport',
    nameKa: 'საზოგადოებრივი ტრანსპორტი',
    icon: '🚌',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
    cards: publicTransportData as FlashCard[],
  },
  {
    id: 'photography-camera',
    name: 'Photography & Camera',
    nameKa: 'ფოტოგრაფია და კამერა',
    icon: '📸',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80',
    cards: photographyCameraData as FlashCard[],
  },
  {
    id: 'pets-vet',
    name: 'Pets & Vet',
    nameKa: 'შინაური ცხოველები და ვეტერინარი',
    icon: '🐕',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
    cards: petsVetData as FlashCard[],
  },
  // MERGED: News & Media + Journalism & News
  {
    id: 'news-media',
    name: 'News & Media',
    nameKa: 'ახალი ამბები და მედია',
    icon: '📰',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&q=80',
    cards: mergeCards(newsMediaData as FlashCard[], journalismNewsData as FlashCard[]),
  },
  {
    id: 'street-urban',
    name: 'Street & Urban Life',
    nameKa: 'ქუჩა და ურბანული ცხოვრება',
    icon: '🏙️',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
    cards: streetUrbanData as FlashCard[],
  },
  // MERGED: Email & Formal Writing + Work Emails
  {
    id: 'email-writing',
    name: 'Email & Writing',
    nameKa: 'ელფოსტა და წერა',
    icon: '📧',
    image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&q=80',
    cards: mergeCards(emailFormalData as FlashCard[], workEmailsData as FlashCard[]),
  },
  {
    id: 'opinions-debate',
    name: 'Opinions & Debate',
    nameKa: 'მოსაზრებები და დებატები',
    icon: '💭',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80',
    cards: opinionsDebateData as FlashCard[],
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    nameKa: 'მომხმარებელთა მომსახურება',
    icon: '🛎️',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
    cards: customerServiceData as FlashCard[],
  },
  {
    id: 'everyday-problems',
    name: 'Everyday Problems',
    nameKa: 'ყოველდღიური პრობლემები',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80',
    cards: everydayProblemsData as FlashCard[],
  },
  {
    id: 'household-chores',
    name: 'Household Chores',
    nameKa: 'საყოფაცხოვრებო საქმეები',
    icon: '🧹',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
    cards: householdChoresData as FlashCard[],
  },
  {
    id: 'taxi-rideshare',
    name: 'Taxi & Rideshare',
    nameKa: 'ტაქსი და თანამგზავრობა',
    icon: '🚕',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80',
    cards: taxiRideshareData as FlashCard[],
  },
  {
    id: 'linking-words',
    name: 'Linking Words',
    nameKa: 'შემაერთებელი სიტყვები',
    icon: '➡️',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80',
    cards: linkingWordsData as FlashCard[],
  },
  {
    id: 'real-estate-property',
    name: 'Real Estate & Property',
    nameKa: 'უძრავი ქონება',
    icon: '🏘️',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
    cards: realEstatePropertyData as FlashCard[],
  },
  {
    id: 'history-war',
    name: 'History & War',
    nameKa: 'ისტორია და ომი',
    icon: '⚔️',
    image: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&q=80',
    cards: historyWarData as FlashCard[],
  },
  {
    id: 'ocean-marine',
    name: 'Ocean & Marine Life',
    nameKa: 'ოკეანე და ზღვის ცხოვრება',
    icon: '🌊',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
    cards: oceanMarineData as FlashCard[],
  },
  {
    id: 'camping-outdoor',
    name: 'Camping & Outdoors',
    nameKa: 'კემპინგი და ბუნება',
    icon: '⛺',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80',
    cards: campingOutdoorData as FlashCard[],
  },
];

// Free tier: only these decks are accessible without premium
export const FREE_DECK_IDS = ['greetings', 'numbers', 'food'];

export function isDeckFree(deckId: string): boolean {
  return FREE_DECK_IDS.includes(deckId);
}

export function getCardId(card: FlashCard, direction?: 'enka' | 'kaen' | 'mixed'): string {
  const base = `${card.category}_${card.english.toLowerCase().replace(/\s+/g, '_')}`;
  return direction ? `${base}_${direction}` : base;
}
