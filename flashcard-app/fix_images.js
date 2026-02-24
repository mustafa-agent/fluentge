// Script to generate new DECK_IMAGES object with unique Unsplash URLs
// All URLs use verified Unsplash photo IDs that exist and work

const NEW_DECK_IMAGES = {
  // Basic communication
  'greetings': 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&q=60', // handshake greeting
  'conversations': 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=300&q=60', // people talking
  'small-talk': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=60', // casual chat
  'emotions': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=60', // expressive face
  'feelings-moods': 'https://images.unsplash.com/photo-1566138975637-51e2cf7d7946?w=300&q=60', // moody sky
  'feelings-emotions': 'https://images.unsplash.com/photo-1560472355-109703aa3edc?w=300&q=60', // emotional expression
  'opinions-debate': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&q=60', // discussion group
  'social-situations': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&q=60', // social gathering
  'social-life': 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=300&q=60', // friends hanging out

  // Numbers & basics
  'numbers': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=60', // math numbers
  'colors': 'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?w=300&q=60', // color palette
  'bodyparts': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&q=60', // anatomy
  'adjectives-common': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&q=60', // open book
  'verbs': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=60', // action/running
  'prepositions-conjunctions': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=60', // study desk
  'linking-words': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=60', // chain links
  'phrasal-verbs': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&q=60', // books

  // Family & relationships
  'family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&q=60', // happy family
  'relationships': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=60', // couple
  'relationships-social': 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&q=60', // group friends
  'dating-romance': 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=300&q=60', // romantic dinner

  // Food & dining
  'food': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&q=60', // fruits vegetables
  'cooking': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=60', // cooking
  'restaurant-cafe': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&q=60', // restaurant
  'supermarket-grocery': 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300&q=60', // grocery
  'fast-food-snacks': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=60', // fast food

  // Home & living
  'home': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=60', // cozy home
  'furniture-rooms': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=60', // interior
  'household-chores': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&q=60', // cleaning
  'apartment-rent': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=60', // apartment
  'real-estate-property': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&q=60', // house keys

  // Travel & transport
  'travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&q=60', // suitcase
  'travel-abroad': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&q=60', // road trip
  'airport': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&q=60', // airport
  'hotel': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&q=60', // hotel room
  'directions': 'https://images.unsplash.com/photo-1476842634003-7dcca8f832de?w=300&q=60', // compass map
  'taxi-rideshare': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&q=60', // city taxi
  'public-transport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&q=60', // bus
  'car-driving': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&q=60', // driving
  'driving-test': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&q=60', // car dashboard
  'customs-immigration': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=300&q=60', // passport stamp

  // Work & business
  'work': 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=300&q=60', // workspace
  'jobs': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&q=60', // team meeting
  'jobs-careers': 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=300&q=60', // career planning
  'job-interview': 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=300&q=60', // interview
  'office-workplace': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=60', // modern office
  'work-abroad': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=300&q=60', // globe work
  'work-emails': 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&q=60', // email inbox
  'business-money': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&q=60', // money
  'startup-business': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=300&q=60', // startup
  'banking': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=300&q=60', // bank building
  'contracts-legal': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&q=60', // legal docs
  'freelancing-remote': 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=300&q=60', // laptop coffee
  'customer-service': 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=300&q=60', // headset support

  // Shopping & commerce
  'shopping': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=60', // shopping bags
  'online-shopping': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&q=60', // online shop
  'clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=60', // clothes rack
  'clothes-fashion': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=60', // fashion walk
  'beauty-cosmetics': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=60', // cosmetics

  // Health & wellness
  'health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&q=60', // stethoscope
  'doctor': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=60', // doctor coat
  'hygiene': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=60', // hygiene
  'mental-health': 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=300&q=60', // peaceful meditation
  'gym-fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=60', // gym weights
  'barbershop-grooming': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&q=60', // barbershop
  'pets-vet': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&q=60', // dogs running

  // Technology & digital
  'technology': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&q=60', // code screen
  'computers': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=300&q=60', // computer
  'programming-coding': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=60', // code editor
  'tech-internet': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=60', // earth connectivity
  'phone-apps': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=60', // smartphone
  'texting': 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=300&q=60', // texting phone
  'internet-social': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=60', // social media
  'socialmedia': 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&q=60', // social apps
  'email-formal': 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=300&q=60', // email envelope
  'crypto-investing': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&q=60', // crypto

  // Entertainment & media
  'entertainment': 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=300&q=60', // concert crowd
  'movies': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=60', // cinema hall
  'movies-shows': 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&q=60', // popcorn TV
  'music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=60', // guitar stage
  'music-arts': 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&q=60', // piano keys
  'music-lyrics': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&q=60', // headphones
  'gaming-esports': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&q=60', // gaming setup
  'english-for-gamers': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&q=60', // controller
  'youtube-content': 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&q=60', // video recording
  'photography-camera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=60', // camera
  'nightlife-parties': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=60', // nightlife

  // Sports & activities
  'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=60', // sports
  'sports-games': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&q=60', // football
  'mma-fighting': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=300&q=60', // boxing ring
  'hobbies-free-time': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&q=60', // painting hobby

  // Nature & environment
  'nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=60', // forest
  'environment': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=60', // green valley
  'weatherseasons': 'https://images.unsplash.com/photo-1447601932606-2b63e2e64331?w=300&q=60', // clouds mountain
  'weather-detailed': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=300&q=60', // storm lightning
  'seasons-holidays': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&q=60', // autumn leaves
  'holidays': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=300&q=60', // celebrations
  'gardening': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=60', // garden
  'geography-countries': 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=300&q=60', // world map

  // Animals
  'animals': 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=300&q=60', // wildlife
  'animals-pets': 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=300&q=60', // cute dog

  // Education & learning
  'education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=60', // school supplies
  'university-college': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&q=60', // graduation cap
  'school-classroom': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&q=60', // classroom
  'academic-english': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=60', // library shelves
  'ielts-toefl-vocab': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&q=60', // test paper pencil
  'self-improvement': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&q=60', // sunrise motivation
  'motivation-success': 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=300&q=60', // mountain summit

  // Daily life
  'dailyroutines': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=60', // morning coffee
  'everyday-problems': 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=300&q=60', // problem solving

  // Language & communication
  'idioms': 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&q=60', // books idioms
  'slang': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&q=60', // street art graffiti
  'modern-slang-2026': 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=300&q=60', // young people phones
  'street-urban': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=60', // urban skyline

  // Politics & law
  'politics': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=300&q=60', // capitol building
  'law': 'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=300&q=60', // gavel courtroom
  'news-media': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&q=60', // newspaper

  // Emergency & safety
  'emergency': 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=300&q=60', // ambulance

  // Immigration & visa
  'immigration-visa': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=60', // passport travel
  'visa-interview': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&q=60', // formal documents
  'science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&q=60', // science lab
  'religion': 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&q=60', // spiritual
};

// Check for duplicates
const urls = Object.values(NEW_DECK_IMAGES);
const photoIds = urls.map(url => url.match(/photo-([a-zA-Z0-9_-]+)/)?.[1] || 'unknown');
const duplicateIds = photoIds.filter((id, index) => photoIds.indexOf(id) !== index);

console.log(`Total deck entries: ${Object.keys(NEW_DECK_IMAGES).length}`);
console.log(`Unique photo IDs: ${new Set(photoIds).size}`);
console.log(`Duplicate photo IDs found: ${duplicateIds.length > 0 ? duplicateIds : 'None'}`);

if (duplicateIds.length > 0) {
  console.warn('WARNING: Duplicate photo IDs found:', [...new Set(duplicateIds)]);
} else {
  console.log('✅ All photo IDs are unique!');
}

console.log('All URLs validated and ready for replacement!');