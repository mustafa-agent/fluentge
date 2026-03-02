// Lightweight deck metadata — NO card data imported
// This file is ~5KB vs the 6.5MB of loading all JSON files

export interface DeckMeta {
  id: string;
  name: string;
  nameKa: string;
  icon: string;
  image: string;
  cardCount: number;
  /** IDs of content JSON files that make up this deck */
  sources: string[];
  /** If true, cards are merged and capped at 50 */
  merged?: boolean;
}

export const deckIndex: DeckMeta[] = [
  { id: 'top-2000', name: 'Top 2000 English Words', nameKa: 'ტოპ 2000 ინგლისური სიტყვა', icon: '⭐', image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80', cardCount: 2000, sources: ['top-2000-words'] },
  { id: 'greetings', name: 'Greetings & Basics', nameKa: 'მისალმებები და საფუძვლები', icon: '👋', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80', cardCount: 200, sources: ['greetings-basics'] },
  { id: 'numbers', name: 'Numbers & Time', nameKa: 'რიცხვები და დრო', icon: '🔢', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80', cardCount: 200, sources: ['numbers-time'] },
  { id: 'family', name: 'Family & People', nameKa: 'ოჯახი და ხალხი', icon: '👨‍👩‍👧‍👦', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80', cardCount: 200, sources: ['family-people'] },
  { id: 'food', name: 'Food & Cooking', nameKa: 'საკვები და კულინარია', icon: '🍳', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', cardCount: 50, sources: ['food-drink', 'cooking-kitchen', 'restaurant-cafe', 'fast-food-snacks'], merged: true },
  { id: 'home', name: 'Home & Housing', nameKa: 'სახლი და საცხოვრებელი', icon: '🏠', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80', cardCount: 200, sources: ['home-housing'] },
  { id: 'travel', name: 'Travel', nameKa: 'მოგზაურობა', icon: '✈️', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80', cardCount: 50, sources: ['travel-transport', 'hotel-accommodation', 'airport-flying'], merged: true },
  { id: 'work', name: 'Work & Business', nameKa: 'სამუშაო და ბიზნესი', icon: '💼', image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&q=80', cardCount: 50, sources: ['work-business', 'startup-business', 'freelancing-remote', 'work-abroad', 'office-workplace'], merged: true },
  { id: 'shopping', name: 'Shopping & Grocery', nameKa: 'შოპინგი და სასურსათო', icon: '🛒', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80', cardCount: 50, sources: ['shopping-money', 'supermarket-grocery'], merged: true },
  { id: 'health', name: 'Health & Body', nameKa: 'ჯანმრთელობა და სხეული', icon: '🏥', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', cardCount: 200, sources: ['health-body'] },
  { id: 'technology', name: 'Technology', nameKa: 'ტექნოლოგია', icon: '💻', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', cardCount: 200, sources: ['technology'] },
  { id: 'nature', name: 'Nature & Weather', nameKa: 'ბუნება და ამინდი', icon: '🌿', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', cardCount: 50, sources: ['nature-weather', 'weather-climate'], merged: true },
  { id: 'emotions', name: 'Emotions & Personality', nameKa: 'ემოციები და პიროვნება', icon: '😊', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80', cardCount: 200, sources: ['emotions-personality'] },
  { id: 'education', name: 'Education', nameKa: 'განათლება', icon: '📚', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80', cardCount: 200, sources: ['education'] },
  { id: 'entertainment', name: 'Entertainment', nameKa: 'გართობა', icon: '🎭', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80', cardCount: 200, sources: ['entertainment'] },
  { id: 'politics', name: 'Politics & Society', nameKa: 'პოლიტიკა და საზოგადოება', icon: '🏛️', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80', cardCount: 200, sources: ['politics-society'] },
  { id: 'sports', name: 'Sports & Fitness', nameKa: 'სპორტი და ფიტნესი', icon: '⚽', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', cardCount: 50, sources: ['sports-fitness', 'gym-fitness', 'mma-fighting', 'sports-extreme'], merged: true },
  { id: 'music', name: 'Music', nameKa: 'მუსიკა', icon: '🎵', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80', cardCount: 50, sources: ['music-art', 'music-lyrics', 'music-genres'], merged: true },
  { id: 'animals', name: 'Animals', nameKa: 'ცხოველები', icon: '🐾', image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&q=80', cardCount: 200, sources: ['animals'] },
  { id: 'colors', name: 'Colors & Shapes', nameKa: 'ფერები და ფიგურები', icon: '🎨', image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=400&q=80', cardCount: 200, sources: ['colors-shapes'] },
  { id: 'bodyparts', name: 'Body Parts', nameKa: 'სხეულის ნაწილები', icon: '🦴', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', cardCount: 200, sources: ['body-parts'] },
  { id: 'jobs', name: 'Jobs & Professions', nameKa: 'პროფესიები', icon: '👨‍⚕️', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80', cardCount: 200, sources: ['jobs-professions'] },
  { id: 'socialmedia', name: 'Social Media & Internet', nameKa: 'სოციალური მედია', icon: '📱', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80', cardCount: 200, sources: ['social-media'] },
  { id: 'clothing', name: 'Clothing & Fashion', nameKa: 'ტანსაცმელი და მოდა', icon: '👗', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', cardCount: 200, sources: ['clothing-fashion'] },
  { id: 'law', name: 'Law & Crime', nameKa: 'კანონი და დანაშაული', icon: '⚖️', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80', cardCount: 200, sources: ['law-crime'] },
  { id: 'relationships-social', name: 'Relationships & Social', nameKa: 'ურთიერთობები და სოციალური', icon: '🤝', image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80', cardCount: 50, sources: ['relationships-dating', 'relationships-social', 'social-life', 'social-situations', 'friendship-social'], merged: true },
  { id: 'environment', name: 'Environment & Ecology', nameKa: 'გარემო და ეკოლოგია', icon: '🌍', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', cardCount: 200, sources: ['environment-ecology'] },
  { id: 'computers', name: 'Programming & Tech', nameKa: 'პროგრამირება და ტექნოლოგია', icon: '👨‍💻', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80', cardCount: 50, sources: ['computers-programming', 'programming-coding'], merged: true },
  { id: 'movies', name: 'Movies & TV', nameKa: 'ფილმები და სერიალები', icon: '🎬', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80', cardCount: 50, sources: ['movies-tv', 'movies-cinema'], merged: true },
  { id: 'holidays', name: 'Holidays & Celebrations', nameKa: 'დღესასწაულები', icon: '🎉', image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&q=80', cardCount: 200, sources: ['holidays-celebrations'] },
  { id: 'hygiene', name: 'Bathroom & Hygiene', nameKa: 'ჰიგიენა და მოვლა', icon: '🧼', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80', cardCount: 200, sources: ['bathroom-hygiene'] },
  { id: 'dailyroutines', name: 'Daily Routines', nameKa: 'ყოველდღიური რუტინა', icon: '🌅', image: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=400&q=80', cardCount: 200, sources: ['daily-routines'] },
  { id: 'directions', name: 'Directions & Places', nameKa: 'მიმართულებები და ადგილები', icon: '🧭', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80', cardCount: 200, sources: ['directions-places'] },
  { id: 'verbs', name: 'Common Verbs', nameKa: 'ხშირი ზმნები', icon: '🏃', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80', cardCount: 200, sources: ['verbs-common'] },
  { id: 'science', name: 'Science & Math', nameKa: 'მეცნიერება და მათემატიკა', icon: '🔬', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80', cardCount: 200, sources: ['science-math'] },
  { id: 'religion', name: 'Religion & Culture', nameKa: 'რელიგია და კულტურა', icon: '⛪', image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=400&q=80', cardCount: 200, sources: ['religion-culture'] },
  { id: 'gardening', name: 'Gardening & Plants', nameKa: 'მებაღეობა და მცენარეები', icon: '🌱', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', cardCount: 200, sources: ['gardening-plants'] },
  { id: 'finance', name: 'Finance & Investing', nameKa: 'ფინანსები და ინვესტიცია', icon: '💰', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80', cardCount: 50, sources: ['banking-finance', 'crypto-investing'], merged: true },
  { id: 'emergency', name: 'Emergency & Safety', nameKa: 'გადაუდებელი და უსაფრთხოება', icon: '🚨', image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80', cardCount: 200, sources: ['emergency-safety'] },
  { id: 'slang', name: 'Slang & Internet', nameKa: 'სლენგი და ინტერნეტი', icon: '🤙', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80', cardCount: 50, sources: ['slang-informal', 'texting-chat'], merged: true },
  { id: 'adjectives-common', name: 'Common Adjectives', nameKa: 'ხშირი ზედსართავები', icon: '📝', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80', cardCount: 200, sources: ['adjectives-common'] },
  { id: 'car-driving', name: 'Cars & Driving', nameKa: 'მანქანა და მართვა', icon: '🚗', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80', cardCount: 50, sources: ['car-driving', 'driving-test'], merged: true },
  { id: 'prepositions-conjunctions', name: 'Prepositions & Conjunctions', nameKa: 'წინდებულები და კავშირები', icon: '🔗', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80', cardCount: 200, sources: ['prepositions-conjunctions'] },
  { id: 'hobbies-free-time', name: 'Hobbies & Free Time', nameKa: 'ჰობი და თავისუფალი დრო', icon: '🎯', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80', cardCount: 200, sources: ['hobbies-free-time'] },
  { id: 'job-interview', name: 'Job Interview', nameKa: 'სამუშაო გასაუბრება', icon: '👔', image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=400&q=80', cardCount: 200, sources: ['job-interview'] },
  { id: 'doctor', name: 'Doctor & Medical', nameKa: 'ექიმი და სამედიცინო', icon: '🩺', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80', cardCount: 200, sources: ['doctor-medical'] },
  { id: 'gaming', name: 'Gaming', nameKa: 'გეიმინგი', icon: '🎮', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', cardCount: 50, sources: ['gaming-esports', 'english-for-gamers'], merged: true },
  { id: 'university-college', name: 'University & College', nameKa: 'უნივერსიტეტი', icon: '🎓', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80', cardCount: 200, sources: ['university-college'] },
  { id: 'apartment-rent', name: 'Apartment & Rent', nameKa: 'ბინა და ქირა', icon: '🏢', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80', cardCount: 200, sources: ['apartment-rent'] },
  { id: 'immigration-visa', name: 'Immigration & Visa', nameKa: 'იმიგრაცია და ვიზა', icon: '🛫', image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80', cardCount: 200, sources: ['immigration-visa'] },
  { id: 'youtube-content', name: 'YouTube & Content Creation', nameKa: 'YouTube და კონტენტი', icon: '🎥', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80', cardCount: 200, sources: ['youtube-content'] },
  { id: 'nightlife-parties', name: 'Nightlife & Parties', nameKa: 'ღამის ცხოვრება', icon: '🌙', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', cardCount: 200, sources: ['nightlife-parties'] },
  { id: 'mental-health', name: 'Mental Health', nameKa: 'ფსიქიკური ჯანმრთელობა', icon: '🧠', image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=400&q=80', cardCount: 50, sources: ['mental-health', 'psychology-mind'], merged: true },
  { id: 'self-improvement', name: 'Self-Improvement', nameKa: 'თვითგანვითარება', icon: '🚀', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80', cardCount: 50, sources: ['self-improvement', 'motivation-success'], merged: true },
  { id: 'geography-countries', name: 'Geography & Countries', nameKa: 'გეოგრაფია და ქვეყნები', icon: '🗺️', image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=80', cardCount: 200, sources: ['geography-countries'] },
  { id: 'barbershop-grooming', name: 'Barbershop & Grooming', nameKa: 'სალონი და მოვლა', icon: '💈', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80', cardCount: 200, sources: ['barbershop-grooming'] },
  { id: 'phone-apps', name: 'Phone & Apps', nameKa: 'ტელეფონი და აპები', icon: '📲', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80', cardCount: 200, sources: ['phone-apps'] },
  { id: 'academic-english', name: 'Academic English', nameKa: 'აკადემიური ინგლისური', icon: '🏆', image: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?w=400&q=80', cardCount: 50, sources: ['academic-english', 'ielts-toefl-vocab'], merged: true },
  { id: 'beauty-cosmetics', name: 'Beauty & Cosmetics', nameKa: 'სილამაზე და კოსმეტიკა', icon: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', cardCount: 200, sources: ['beauty-cosmetics'] },
  { id: 'public-transport', name: 'Public Transport', nameKa: 'საზოგადოებრივი ტრანსპორტი', icon: '🚌', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80', cardCount: 200, sources: ['public-transport'] },
  { id: 'photography-camera', name: 'Photography & Camera', nameKa: 'ფოტოგრაფია და კამერა', icon: '📸', image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80', cardCount: 200, sources: ['photography-camera'] },
  { id: 'pets-vet', name: 'Pets & Vet', nameKa: 'შინაური ცხოველები და ვეტერინარი', icon: '🐕', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80', cardCount: 200, sources: ['pets-vet'] },
  { id: 'news-media', name: 'News & Media', nameKa: 'ახალი ამბები და მედია', icon: '📰', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&q=80', cardCount: 50, sources: ['news-media', 'journalism-news'], merged: true },
  { id: 'street-urban', name: 'Street & Urban Life', nameKa: 'ქუჩა და ურბანული ცხოვრება', icon: '🏙️', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80', cardCount: 200, sources: ['street-urban'] },
  { id: 'email-writing', name: 'Email & Writing', nameKa: 'ელფოსტა და წერა', icon: '📧', image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&q=80', cardCount: 50, sources: ['email-formal-writing', 'work-emails'], merged: true },
  { id: 'customer-service', name: 'Customer Service', nameKa: 'მომხმარებელთა მომსახურება', icon: '🛎️', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', cardCount: 200, sources: ['customer-service'] },
  { id: 'household-chores', name: 'Household Chores', nameKa: 'საყოფაცხოვრებო საქმეები', icon: '🧹', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', cardCount: 200, sources: ['household-chores'] },
  { id: 'taxi-rideshare', name: 'Taxi & Rideshare', nameKa: 'ტაქსი და თანამგზავრობა', icon: '🚕', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80', cardCount: 200, sources: ['taxi-rideshare'] },
  { id: 'linking-words', name: 'Linking Words', nameKa: 'შემაერთებელი სიტყვები', icon: '➡️', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80', cardCount: 200, sources: ['linking-words'] },
  { id: 'real-estate-property', name: 'Real Estate & Property', nameKa: 'უძრავი ქონება', icon: '🏘️', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80', cardCount: 200, sources: ['real-estate-property'] },
  { id: 'history-war', name: 'History & War', nameKa: 'ისტორია და ომი', icon: '⚔️', image: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&q=80', cardCount: 200, sources: ['history-war'] },
  { id: 'ocean-marine', name: 'Ocean & Marine Life', nameKa: 'ოკეანე და ზღვის ცხოვრება', icon: '🌊', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80', cardCount: 200, sources: ['ocean-marine'] },
  { id: 'camping-outdoor', name: 'Camping & Outdoors', nameKa: 'კემპინგი და ბუნება', icon: '⛺', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80', cardCount: 200, sources: ['camping-outdoor'] },
];

// Free tier: only these decks are accessible without premium
export const FREE_DECK_IDS = ['greetings', 'numbers', 'food', 'top-2000'];

export function isDeckFree(deckId: string): boolean {
  return FREE_DECK_IDS.includes(deckId);
}
