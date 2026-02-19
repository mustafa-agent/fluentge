# FluentGe — Roadmap Status

## Phase 1: Foundation ✅ (Completed Feb 17, 2026)

### Completed:
- [x] **Astro website** built at `website/` with Tailwind CSS v4
  - Homepage: Hero section, feature highlights (flashcards, grammar coming soon, podcast coming soon), "Why FluentGe" section, CTA, footer
  - About page
  - Navigation: მთავარი, ბარათები, გრამატიკა (coming soon), ჩვენ შესახებ
  - Georgian UI text throughout, Inter font, dark theme with #22c55e green primary
  - Mobile-first responsive design
- [x] **Flashcard React app** built at `flashcard-app/` (Vite + React + TypeScript + Tailwind)
  - SM-2 spaced repetition algorithm implemented
  - Study screen: shows English word + pronunciation, tap to reveal Georgian translation + example sentences
  - Deck selection screen with progress bars per category
  - Stats bar: words learned, streak, accuracy (localStorage)
  - 3-button rating: არ ვიცი / ძნელია / ვიცი!
  - Session complete screen with accuracy report
  - Builds to `website/public/flashcards/` — embedded at /flashcards/
- [x] **50 flashcard words** generated (JSON):
  - `content/word-lists/greetings-basics.json` — 25 words (Greetings & Basics, A1)
  - `content/word-lists/numbers-time.json` — 25 words (Numbers & Time, A1)
  - Georgian translations, pronunciations, example sentences in both languages
- [x] Both `npm run build` succeed (website + flashcard-app)
- [x] Git committed

### Not yet done (Phase 1 remaining):
- [ ] Choose name and register .ge domain
- [x] Deploy to surge.sh — **LIVE at https://fluentge.surge.sh** ✅ (Feb 18)
- [ ] Deploy to Cloudflare Pages (needs API token auth)
- [ ] Firebase setup (auth + database)
- [x] PWA setup ✅ (Feb 18) — manifest, service worker, icons, apple-mobile-web-app tags
- [x] Generate 591 words across 9 categories ✅ (exceeds 200 target!)
- [x] Wire all 9 decks into flashcard app ✅ (Feb 18) — was only 2 decks before
- [x] Added Politics & Society deck (50 B2 words) ✅ (Feb 18)
- [x] **1000+ word milestone reached!** 🎉
- [x] Added Sports & Fitness deck (50 words) ✅ (Feb 18)
- [x] Added Sentence Builder mode (4th study mode) ✅ (Feb 18)
- [x] **BIG EXPANSION (Feb 18 noon):**
  - [x] 41 flashcard decks in app (was 35) — added Daily Routines, Directions & Places, Common Verbs, Science & Math, Religion & Culture, Gardening & Plants
  - [x] 31 word-list JSON files in content/word-lists/ (1780+ words total)
  - [x] **21 podcast episodes generated!** (was 6) — Episodes 1-21 all have MP3 files
  - [x] Podcast topics: Airport, Restaurant, Job Interview, Hotel, Shopping, Doctor, Making Friends, Directions, Phone, Bank, Apartment, Gym, Emergency, Supermarket, Plans, School, Cooking, Mechanic, Birthday, Travel
  - [x] App rebuilt and deploying to surge.sh

### 4:00 PM Session — 4 New Fun Features!
- [x] 🃏 **Word Match Memory Game** — flip cards to match English ↔ Georgian pairs (3×4 grid, flip animations, move/time tracking)
- [x] 📅 **Daily Word Widget** — deterministic word-of-day on home screen, tap to reveal, streak tracking
- [x] ⚡ **Speed Round** — 60-second timed quiz, pick correct Georgian translation, score tracker
- [x] 🔀 **Word Scramble** — unscramble jumbled letters to spell the English word, Georgian hint shown
- [x] All 4 features built, integrated, and deployed to fluentge.surge.sh ✅
- **App now has 8 learning modes** (was 4): Flashcards, Quiz, Spelling, Sentence Builder, Match Game, Speed Round, Word Scramble + Daily Word

### 8:00 PM Session — 3 New Learning Features!
- [x] 🔄 **Reverse Mode** — See Georgian word, type the English translation (opposite of Spelling mode)
- [x] 💬 **Conversation Practice** — 6 interactive dialogue scenarios (Restaurant, Airport, Hotel, Shopping, Doctor, Job Interview) with Georgian translations
- [x] 📖 **Reading Comprehension** — 8 short English stories with Georgian glossary and comprehension questions (daily life, travel, work, food, sports, tech, nature, friendship)
- [x] All 3 features built, integrated into App.tsx & DeckSelect.tsx, deployed
- **App now has 14 learning modes!** Flashcards, Quiz, Spelling, Sentence Builder, Match, Speed, Scramble, Fill Blank, Achievements, Progress, Reverse, Conversation, Reading + Daily Word

### 10:00 PM Session — Grammar Exercises!
- [x] 🏋️ **Grammar Exercises** — 10 interactive lessons with theory (EN+KA) and 50 quiz questions
  - Articles (A/An/The), To Be (Am/Is/Are), Simple Present, Simple Past
  - Personal Pronouns, Comparatives & Superlatives, Prepositions (In/On/At)
  - Present Continuous, Can & Could, Future (Will & Going to)
  - Each lesson: read theory → answer 5 questions → get score
- [x] Built, integrated, committed to git
- [ ] Surge deploy timing out with podcasts (11.8 MB) — deploying without MP3s for now (2MB)
- **App now has 15 learning modes!**

### 12:00 AM Session (Feb 19) — 2 New Fun Features!
- [x] 🎯 **Hangman Game** — Classic word guessing with SVG hangman, keyboard/tap input, Georgian hints, score tracking
- [x] 🎧 **Listening Practice** — Browser TTS speaks English words, user types what they hear, Georgian hints, 20-word sessions
- [x] Deployed to fluentge.surge.sh ✅ (without podcast MP3s)
- [x] Git committed
- **App now has 17 learning modes!**

### 2:00 AM Session (Feb 19) — 2 More Features!
- [x] 🗂️ **Word Categories** — Sort 9 words into 3 random category buckets, score tracking, multiple rounds
- [x] 👅 **Tongue Twisters** — 12 English tongue twisters with Georgian translations, TTS at 3 speeds (slow/normal/fast), pronunciation tips per twister
- [x] Deployed to fluentge.surge.sh ✅ (without podcast MP3s)
- [x] Git committed
- **App now has 19 learning modes!**

### 4:00 AM Session (Feb 19) — 2 More Features!
- [x] 🗣️ **Idioms & Phrases** — 24 common English idioms with Georgian translations, examples, browse mode + 10-question quiz mode
- [x] 🧩 **Mini Crossword** — Auto-generated crossword puzzles from vocabulary words, Georgian clues, reveal button, numbered cells
- [x] Deployed to fluentge.surge.sh ✅
- **App now has 21 learning modes!**

### 6:00 AM Session (Feb 19) — 2 More Features!
- [x] 🐍 **Word Snake** — Word search grid game: find 6 hidden vocabulary words by connecting adjacent cells, Georgian hints shown, 8×8 grid
- [x] 📝 **Story Builder** — Mad Libs-style vocabulary practice: 5 story templates, fill in blanks by word type (noun/verb/adj), see your funny story at the end
- [x] Deployed to fluentge.surge.sh ✅
- [x] Git committed
- **App now has 23 learning modes!**

### 8:00 AM Session (Feb 19) — 2 More Features!
- [x] ✅ **True or False** — 20 English grammar/vocabulary statements, answer true or false, Georgian explanations, score tracking, 10 random per session
- [x] 🔊 **Pronunciation Guide** — 4 sections (vowels, consonants, word stress, silent letters), 20 sound entries, TTS playback for examples, Georgian tips for each sound
- [x] Deployed to fluentge.surge.sh ✅
- [x] Git committed
- **App now has 25 learning modes!**

### 10:00 AM Session (Feb 19) — 2 More Features!
- [x] 🎵 **Song Lyrics** — Fill-in-the-blank with famous song lyrics (6 songs: Imagine, Let It Be, Happy, Shape of You, Yesterday, Count On Me), Georgian translations, multiple choice gaps
- [x] 🎲 **Word Bingo** — 4×4 bingo grid with vocabulary words, hear Georgian → find English, row/column/diagonal wins
- [x] Deployed to fluentge.surge.sh ✅ (without podcast MP3s)
- [x] Git committed
- **App now has 27 learning modes!**

### 2:00 PM Session (Feb 19) — 2 More Features!
- [x] 🔀 **Irregular Verbs** — 30 common irregular verbs (go→went→gone), learn mode with reveal + quiz mode (type past/participle/base), Georgian translations, example sentences
- [x] 🖼️ **Picture Describe** — 8 emoji scenes (beach, cooking, school, rainy day, gym, shopping, birthday, road trip), write 3-5 sentences describing the scene, keyword matching, sample answers with Georgian translations
- [x] Deployed to fluentge.surge.sh ✅
- [x] Git committed
- **App now has 31 learning modes!**

### 4:00 PM Session (Feb 19) — 2 More Features!
- [x] 🔗 **Phrasal Verbs** — 24 essential phrasal verbs (give up, look after, turn on, etc.), learn mode with reveal + quiz mode (match meaning to verb), Georgian translations + examples
- [x] ⚠️ **Common Mistakes** — 20 mistakes English learners make (I am agree → I agree, I have 20 years → I am 20), learn with wrong/correct/rule + quiz mode, Georgian explanations
- [x] Built, integrated, git committed
- [x] Surge deploy hanging (auth issue) — built files ready in dist/
- **App now has 33 learning modes!**

### 6:00 PM Session (Feb 19) — 2 More Features!
- [x] 🎬 **Movie Quotes** — 12 famous movie quotes (Godfather, Forrest Gump, Lion King, Titanic, Star Wars, etc.), browse mode + fill-the-blank quiz, Georgian translations + vocabulary trivia
- [x] 🗺️ **Travel Phrases** — 48 essential travel phrases across 8 situations (Airport, Hotel, Restaurant, Transport, Shopping, Emergency, Meeting People, Directions), TTS playback, Georgian pronunciation guide, quiz mode
- [x] Deployed to fluentge.surge.sh ✅
- [x] Git committed
- **App now has 35 learning modes!**

### 8:00 PM Session (Feb 19) — 2 New Features!
- [x] 🎯 **Daily Challenge** — 7 mixed daily tasks (translate, spell, unscramble, true/false, fill blank), new puzzle every day, streak tracking with localStorage
- [x] 🔗 **Word Connections** — NYT Connections-style game: 16 words in a 4×4 grid, find 4 groups of 4 related words, 6 puzzles with daily rotation, shake animation on wrong guess, 4 mistakes max
- [x] Both featured prominently on home screen with gradient cards
- [x] Deployed to fluentge.surge.sh ✅ (without podcast MP3s)
- [x] Git committed
- **App now has 37 learning modes!**

## Phase 2: Grammar — Not started
## Phase 3: Growth — Not started
## Phase 4: Podcast & Premium — Podcasts done (21 episodes), premium features not started
