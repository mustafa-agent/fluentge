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

export const decks: Deck[] = [
  {
    id: 'top-5000',
    name: 'Top 5000 English Words',
    nameKa: 'ტოპ 5000 ინგლისური სიტყვა',
    icon: '⭐',
    cards: top5000WordsData as FlashCard[],
  },
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
    id: 'relationships-social',
    name: 'Relationships & Social',
    nameKa: 'ურთიერთობები და სოციალური',
    icon: '🤝',
    cards: relationshipsSocialData as FlashCard[],
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
  {
    id: 'adjectives-common',
    name: 'Common Adjectives',
    nameKa: 'ხშირი ზედსართავები',
    icon: '📝',
    cards: adjectivesCommonData as FlashCard[],
  },
  {
    id: 'car-driving',
    name: 'Cars & Driving',
    nameKa: 'მანქანა და მართვა',
    icon: '🚗',
    cards: carDrivingData as FlashCard[],
  },
  {
    id: 'prepositions-conjunctions',
    name: 'Prepositions & Conjunctions',
    nameKa: 'წინდებულები და კავშირები',
    icon: '🔗',
    cards: prepositionsData as FlashCard[],
  },
  {
    id: 'restaurant-cafe',
    name: 'Restaurant & Cafe',
    nameKa: 'რესტორანი და კაფე',
    icon: '🍽️',
    cards: restaurantData as FlashCard[],
  },
  {
    id: 'gym-fitness',
    name: 'Gym & Fitness',
    nameKa: 'სპორტდარბაზი და ფიტნესი',
    icon: '💪',
    cards: gymData as FlashCard[],
  },
  {
    id: 'hobbies-free-time',
    name: 'Hobbies & Free Time',
    nameKa: 'ჰობი და თავისუფალი დრო',
    icon: '🎨',
    cards: hobbiesData as FlashCard[],
  },
  {
    id: 'social-situations',
    name: 'Social Situations',
    nameKa: 'სოციალური სიტუაციები',
    icon: '🤝',
    cards: socialSituationsData as FlashCard[],
  },
  {
    id: 'hotel',
    name: 'Hotel & Accommodation',
    nameKa: 'სასტუმრო და საცხოვრებელი',
    icon: '🏨',
    cards: hotelData as FlashCard[],
  },
  {
    id: 'job-interview',
    name: 'Job Interview',
    nameKa: 'სამუშაო გასაუბრება',
    icon: '👔',
    cards: jobInterviewData as FlashCard[],
  },
  {
    id: 'doctor',
    name: 'Doctor & Medical',
    nameKa: 'ექიმი და სამედიცინო',
    icon: '🩺',
    cards: doctorMedicalData as FlashCard[],
  },
  {
    id: 'texting',
    name: 'Texting & Chat Slang',
    nameKa: 'მესიჯები და სლენგი',
    icon: '💬',
    cards: textingChatData as FlashCard[],
  },
  {
    id: 'social-life',
    name: 'Social Life',
    nameKa: 'სოციალური ცხოვრება',
    icon: '🎉',
    cards: socialLifeData as FlashCard[],
  },
  {
    id: 'mma-fighting',
    name: 'MMA & Fighting',
    nameKa: 'MMA და ბრძოლა',
    icon: '🥊',
    cards: mmaFightingData as FlashCard[],
  },
  {
    id: 'gaming-esports',
    name: 'Gaming & Esports',
    nameKa: 'გეიმინგი და ესპორტი',
    icon: '🎮',
    cards: gamingEsportsData as FlashCard[],
  },
  {
    id: 'university-college',
    name: 'University & College',
    nameKa: 'უნივერსიტეტი',
    icon: '🎓',
    cards: universityData as FlashCard[],
  },
  {
    id: 'apartment-rent',
    name: 'Apartment & Rent',
    nameKa: 'ბინა და ქირა',
    icon: '🏢',
    cards: apartmentRentData as FlashCard[],
  },
  {
    id: 'programming-coding',
    name: 'Programming & Coding',
    nameKa: 'პროგრამირება',
    icon: '💻',
    cards: programmingCodingData as FlashCard[],
  },
  {
    id: 'immigration-visa',
    name: 'Immigration & Visa',
    nameKa: 'იმიგრაცია და ვიზა',
    icon: '🛫',
    cards: immigrationVisaData as FlashCard[],
  },
  {
    id: 'youtube-content',
    name: 'YouTube & Content Creation',
    nameKa: 'YouTube და კონტენტი',
    icon: '🎥',
    cards: youtubeContentData as FlashCard[],
  },
  {
    id: 'nightlife-parties',
    name: 'Nightlife & Parties',
    nameKa: 'ღამის ცხოვრება',
    icon: '🎶',
    cards: nightlifePartiesData as FlashCard[],
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    nameKa: 'ფსიქიკური ჯანმრთელობა',
    icon: '🧠',
    cards: mentalHealthData as FlashCard[],
  },
  {
    id: 'freelancing-remote',
    name: 'Freelancing & Remote Work',
    nameKa: 'ფრილანსი და დისტანციური მუშაობა',
    icon: '💼',
    cards: freelancingRemoteData as FlashCard[],
  },
  {
    id: 'crypto-investing',
    name: 'Crypto & Investing',
    nameKa: 'კრიპტო და ინვესტიცია',
    icon: '📈',
    cards: cryptoInvestingData as FlashCard[],
  },
  {
    id: 'self-improvement',
    name: 'Self-Improvement',
    nameKa: 'თვითგანვითარება',
    icon: '🚀',
    cards: selfImprovementData as FlashCard[],
  },
  {
    id: 'geography-countries',
    name: 'Geography & Countries',
    nameKa: 'გეოგრაფია და ქვეყნები',
    icon: '🌍',
    cards: geographyCountriesData as FlashCard[],
  },
  {
    id: 'barbershop-grooming',
    name: 'Barbershop & Grooming',
    nameKa: 'სალონი და მოვლა',
    icon: '💈',
    cards: barbershopGroomingData as FlashCard[],
  },
  {
    id: 'driving-test',
    name: 'Driving & Road Rules',
    nameKa: 'მართვა და საგზაო წესები',
    icon: '🚗',
    cards: drivingTestData as FlashCard[],
  },
  {
    id: 'phone-apps',
    name: 'Phone & Apps',
    nameKa: 'ტელეფონი და აპები',
    icon: '📱',
    cards: phoneAppsData as FlashCard[],
  },
  {
    id: 'fast-food-snacks',
    name: 'Fast Food & Snacks',
    nameKa: 'ფასტფუდი და სნეკები',
    icon: '🍔',
    cards: fastFoodSnacksData as FlashCard[],
  },
  {
    id: 'phrasal-verbs',
    name: 'Phrasal Verbs',
    nameKa: 'ფრაზული ზმნები',
    icon: '🔗',
    cards: phrasalVerbsData as FlashCard[],
  },
  {
    id: 'academic-english',
    name: 'Academic English',
    nameKa: 'აკადემიური ინგლისური',
    icon: '🎓',
    cards: academicEnglishData as FlashCard[],
  },
  {
    id: 'motivation-success',
    name: 'Motivation & Success',
    nameKa: 'მოტივაცია და წარმატება',
    icon: '🚀',
    cards: motivationSuccessData as FlashCard[],
  },
  {
    id: 'beauty-cosmetics',
    name: 'Beauty & Cosmetics',
    nameKa: 'სილამაზე და კოსმეტიკა',
    icon: '💄',
    cards: beautyCosmeticsData as FlashCard[],
  },
  {
    id: 'public-transport',
    name: 'Public Transport',
    nameKa: 'საზოგადოებრივი ტრანსპორტი',
    icon: '🚌',
    cards: publicTransportData as FlashCard[],
  },
  {
    id: 'photography-camera',
    name: 'Photography & Camera',
    nameKa: 'ფოტოგრაფია და კამერა',
    icon: '📸',
    cards: photographyCameraData as FlashCard[],
  },
  {
    id: 'music-lyrics',
    name: 'Music & Lyrics',
    nameKa: 'მუსიკა და ტექსტები',
    icon: '🎤',
    cards: musicLyricsData as FlashCard[],
  },
  {
    id: 'pets-vet',
    name: 'Pets & Vet',
    nameKa: 'შინაური ცხოველები და ვეტერინარი',
    icon: '🐾',
    cards: petsVetData as FlashCard[],
  },
  {
    id: 'news-media',
    name: 'News & Media',
    nameKa: 'ახალი ამბები და მედია',
    icon: '📰',
    cards: newsMediaData as FlashCard[],
  },
  {
    id: 'street-urban',
    name: 'Street & Urban Life',
    nameKa: 'ქუჩა და ურბანული ცხოვრება',
    icon: '🏙️',
    cards: streetUrbanData as FlashCard[],
  },
  {
    id: 'email-formal',
    name: 'Email & Formal Writing',
    nameKa: 'ელფოსტა და ფორმალური წერა',
    icon: '📧',
    cards: emailFormalData as FlashCard[],
  },
  {
    id: 'opinions-debate',
    name: 'Opinions & Debate',
    nameKa: 'მოსაზრებები და დებატები',
    icon: '💬',
    cards: opinionsDebateData as FlashCard[],
  },
  {
    id: 'small-talk',
    name: 'Small Talk',
    nameKa: 'მსუბუქი საუბარი',
    icon: '🗣️',
    cards: smallTalkData as FlashCard[],
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    nameKa: 'მომხმარებელთა მომსახურება',
    icon: '🛎️',
    cards: customerServiceData as FlashCard[],
  },
  {
    id: 'everyday-problems',
    name: 'Everyday Problems',
    nameKa: 'ყოველდღიური პრობლემები',
    icon: '🔧',
    cards: everydayProblemsData as FlashCard[],
  },
  {
    id: 'supermarket-grocery',
    name: 'Supermarket & Grocery',
    nameKa: 'სუპერმარკეტი და სასურსათო',
    icon: '🛒',
    cards: supermarketGroceryData as FlashCard[],
  },
  {
    id: 'household-chores',
    name: 'Household Chores',
    nameKa: 'საყოფაცხოვრებო საქმეები',
    icon: '🧹',
    cards: householdChoresData as FlashCard[],
  },
  {
    id: 'office-workplace',
    name: 'Office & Workplace',
    nameKa: 'ოფისი და სამუშაო ადგილი',
    icon: '💼',
    cards: officeWorkplaceData as FlashCard[],
  },
  {
    id: 'taxi-rideshare',
    name: 'Taxi & Rideshare',
    nameKa: 'ტაქსი და თანამგზავრობა',
    icon: '🚕',
    cards: taxiRideshareData as FlashCard[],
  },
  {
    id: 'linking-words',
    name: 'Linking Words',
    nameKa: 'შემაერთებელი სიტყვები',
    icon: '🔗',
    cards: linkingWordsData as FlashCard[],
  },
  {
    id: 'ielts-toefl-vocab',
    name: 'IELTS & TOEFL Vocabulary',
    nameKa: 'IELTS და TOEFL ლექსიკა',
    icon: '🎓',
    cards: ieltsToeflData as FlashCard[],
  },
  {
    id: 'startup-business',
    name: 'Startup & Business',
    nameKa: 'სტარტაპი და ბიზნესი',
    icon: '🚀',
    cards: startupBusinessData as FlashCard[],
  },
  {
    id: 'real-estate-property',
    name: 'Real Estate & Property',
    nameKa: 'უძრავი ქონება',
    icon: '🏘️',
    cards: realEstatePropertyData as FlashCard[],
  },
  {
    id: 'work-abroad',
    name: 'Work Abroad',
    nameKa: 'საზღვარგარეთ მუშაობა',
    icon: '🌍',
    cards: workAbroadData as FlashCard[],
  },
  {
    id: 'english-for-gamers',
    name: 'English for Gamers',
    nameKa: 'გეიმერის ინგლისური',
    icon: '🎮',
    cards: englishForGamersData as FlashCard[],
  },
  {
    id: 'work-emails',
    name: 'Work Emails',
    nameKa: 'სამსახურის ელ-ფოსტა',
    icon: '✉️',
    cards: workEmailsData as FlashCard[],
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
