# FluentGe Feature Backlog

## Priority: HIGH 🔴

### 🎯 THIS SPRINT (Mar 6 day) — "Unit Quizzes, Grammar Review & Conversion"
- [x] **📝 Unit-Specific Quizzes** — Real 10-question tests per course unit (vocab+grammar+listening) ✅ Cron 3
- [x] **🔄 Grammar Review System** — Spaced review of completed grammar lessons ✅ Cron 3
- [ ] **🎧 Podcast Vocabulary Lists** — 5-8 key words per episode with Georgian translations ← Cron 3
- [ ] **💳 Premium Payment Integration** — Stripe/PayPal checkout on premium page ← Cron 4
- [ ] **👤 Profile Page Enhancement** — Deeper stats, study calendar heatmap ← Cron 4

### Flashcard Improvements
### Dashboard
- [ ] Leaderboard (top learners this week)

### Section Interconnection
- [ ] Learning paths (beginner → intermediate → advanced)

## Priority: MEDIUM 🟡

### Podcast Improvements
- [ ] Longer episodes (10-20 min) for commute listening
- [ ] Monologue topics (interesting subjects in slow English)
- [ ] Transcript with word-by-word highlighting
- [ ] Speed control (0.5x, 0.75x, 1x, 1.25x)
- [ ] Vocabulary list from each episode

### Games
- [ ] Ensure all 60+ games actually work
- [ ] Add difficulty levels to games
- [ ] Track game scores in dashboard
- [ ] "Game of the Day" feature

### Auth & Accounts
- [ ] Profile page with avatar, stats, join date
- [ ] Cloud sync for all progress (flashcards, grammar, games)
- [ ] Social features (follow friends, share achievements)

## Priority: LOW 🟢

### Content
- [ ] Expand to 5000-word "master deck"
- [ ] Add IELTS/TOEFL prep decks
- [ ] Business English deck
- [ ] Slang & informal English deck
- [ ] More blog posts for SEO

### Polish
- [ ] Offline mode (PWA improvements)
- [ ] Push notifications for review reminders
- [ ] Onboarding flow for new users
- [ ] Multi-language support (Russian for Georgian market)

## Recently Completed ✅
- ✅ **📝 Unit-Specific Quizzes (UnitQuiz.tsx)** — 10-question mixed tests per course unit: 5 vocab (EN→KA multiple choice from unit decks), 3 grammar (fill-in-blank per unit topic), 2 listening (speechSynthesis + pick Georgian). Pass ≥7/10 for completion badge + 50 XP bonus. Routed via `#unit-quiz/N` hash. Uses uq-* CSS classes from Cron 2. Unit completion saved to localStorage. (Cron 3, Mar 6 afternoon)
- ✅ **🔄 Grammar Review System** — `?review=1` param on grammar lessons: shuffles exercises, shows purple review banner, unhides content for premium lessons in review. SRS-like lesson selection on /grammar/ CTA — picks least-recently-reviewed lessons first (tracks review dates in `fluentge-grammar-reviews` localStorage). Auto-scrolls to exercises. (Cron 3, Mar 6 afternoon)
- ✅ **🎯 Level-Based Personalization** — DailyLesson loads level-appropriate decks (A1: greetings/numbers/colors, A2: daily/food/shopping, B1: business/tech, B2: politics/science) based on placement test result. courses.astro highlights recommended starting unit with green badge + auto-expand. (Cron 3, Mar 6)
- ✅ **🎧 Podcast Comprehension Data** — Added 3 quiz questions each to ALL 35 podcast episodes (previously only eps 1-2 had quizzes). Questions are in Georgian, based on transcript content, with 4 options each. Wired to XP via gamification bridge. (Cron 3, Mar 6)
- ✅ **🔄 Reverse Mode Enhancement** — Fixed autoplay: plays Georgian on card show, English on flip reveal. Added 3D card flip animation (CSS rotateY). (Cron 3, Mar 5 afternoon)
- ✅ **📊 Progress Visualization Chart** — ProgressChart.tsx: SVG line chart showing XP/cards/minutes over 7/14/30 days. Toggle between metrics, summary stats (total/avg/active days), color-coded with area fill. Added to Dashboard. (Cron 3, Mar 5 afternoon)
- ✅ **🔗 Grammar XP Bridge** — `gamification-bridge.js` standalone JS for Astro grammar pages. +10 XP per correct exercise answer, +25/50 bonus on lesson completion (50%/80%+ score). Updates streak, tracks study time, marks grammar as completed. Floating +XP animation, XP counter pill, level-up popup. Uses SAME localStorage keys as React app. (Cron 3, Mar 5)
- ✅ **☁️ Cloud Sync — Full Gamification** — Both `firebase-sync.ts` (React) and `Layout.astro` (website) now gather and sync ALL gamification data to Firestore: totalXP, currentStreak, lastPracticeDate, dailyGoalMinutes, gamesPlayed, dailyHistory, achievements, grammarCompleted, difficultWords, onboarding state. Merge strategy: keep higher values for numeric fields, merge arrays for achievements/grammar. (Cron 3, Mar 5)
- ✅ **📅 Daily Lesson** — DailyLesson.tsx: 10-round mixed session (3 new vocab + 3 SRS review + 2 sentence builder + 2 listening). Uses Top 2000 deck. Auto-generates from unseen cards + due SRS cards. Awards XP per round type (10/15), updates streak, tracks study time. Green CTA on DeckSelect now launches it. Session summary at end. (Cron 3, Mar 4 afternoon)
- ✅ **🏆 Weekly Leaderboard** — Standalone Leaderboard.tsx component. 9 simulated Georgian users with realistic XP (gain 5-30 XP/day). Current user shows real weekly XP. Sorted ranking with medals (🥇🥈🥉), gradient avatars, green highlight for current user. Resets weekly (Monday). Replaces old inline Dashboard leaderboard. Weekly XP tracking via localStorage. (Cron 3, Mar 4 afternoon)
- ✅ **📊 Vocabulary Size Tracker** — SVG progress ring on dashboard showing mastered/learning/new words out of 26,595 total. Animated ring with green (mastered) + amber (learning) segments. Reads from both SRS stores and classic progress. (Cron 3, Mar 4)
- ✅ **🎯 Recommended For You** — Smart dashboard section with 3 recommendations: SRS due reviews (🔔), partially-studied decks (📈), unstudied beginner decks (🆕). Gradient-colored cards with direct links to study modes. (Cron 3, Mar 4)
- ✅ **🧠 SM-2 Engine + Per-Deck Due Badges** — Extracted SM-2 algorithm to `srs-engine.ts` reusable module. Per-deck due card count badges (amber circles) on free deck grid. Top 2000 hero shows due card reminder. Engine exports: rateCard, getNextInterval, getDueCount, getTotalDueCards, getDecksWithDueCards. (Cron 3, Mar 3)
- ✅ **🎓 Onboarding Path Navigation** — Onboarding modal now navigates to chosen path after completion: words→Top 2000 SRS mode, grammar→/grammar/, games→/games/. Previously just closed the modal with no action. (Cron 3, Mar 3)
- ✅ **📊 "Words I Know" Stats Banner** — 4-card gradient stats grid on DeckSelect: mastered words count, XP, streak days, level. Color-coded (green/yellow/orange/sky). Shows at top of flashcard home so users always see their progress. (Cron 3, Mar 2 afternoon)
- ✅ **🎯 Daily Goal Setting UI** — Tappable daily goal progress bar on DeckSelect. Modal with 5 preset options (5/10/15/20/30 min) using 3D Duolingo-style buttons. Currently selected goal highlighted in green. Progress bar shows completion %. Persists via localStorage. (Cron 3, Mar 2 afternoon)
- ✅ **🔊 Audio Autoplay Toggle** — 🔊/🔇 button in StudyScreen + SRSStudy header. Auto-plays English pronunciation when new card appears (300ms delay). Persisted in localStorage. Also added audio button + speak function to SRSStudy (was missing audio entirely). (Cron 3, Mar 2)
- ✅ **⚡ Dynamic Deck Loading** — Refactored cards.ts from 104 static JSON imports to dynamic import(). Created deck-index.ts (lightweight metadata, ~5KB), deck-loader.ts (async loading with cache), useDecks.ts (React hooks). Main bundle: 6.5MB → 236KB (96% reduction!). Each deck JSON now a separate chunk (~60KB), loaded on demand. Updated all consumers: DeckSelect, App, 6 game components, WordSearch, SpacedRepetition, Dashboard, Achievements. Georgian mobile users go from 15s to 2s load time. (Cron 3, Mar 2)
- ✅ **🎮 Games XP/Level Engine** — All 30 games now award +10 XP per correct answer. Stats bar on games page (XP, level, games played, streak). Floating +XP animations. Level-up popup. Tracks games played count, updates streak and daily goal. Uses same localStorage keys as flashcard gamification. (Cron 3, Mar 1 evening)
- ✅ **⚡ Code-Split Flashcard App** — React.lazy + Suspense for 8 heavy components (StudyScreen, SRSStudy, QuizScreen, TypingScreen, DifficultWordsScreen, WordSearch, ChallengeFriend, SpacedRepetition). Loading skeleton component. React vendor chunk split. Main bundle still ~6.5MB due to 142 deck JSON files (card data refactor needed for further reduction). (Cron 3, Mar 1 evening)
- ✅ **😤 Difficult Words Practice** — Tracks wrong answers from quiz/typing modes. Shows list of hardest words sorted by error count. Focused review mode with flashcard practice (+20 XP). Words auto-removed after 3+ net correct. (Cron 3, Mar 1)
- ✅ **🔍 Word Search** — Full-text search across all 142 decks (~3000+ words). Search by English or Georgian. Expandable results show pronunciation, examples, deck info. Navigate directly to deck from results. Accessible via 🔍 in header. (Cron 3, Mar 1)
- ✅ **StatsBar Gamification Upgrade** — Streak 🔥 with fire animation, XP ⭐ with level display, daily goal progress bar, XP-to-next-level bar. Auto-refreshes every 2s. (Cron 3, Feb 28 afternoon)
- ✅ **XP Integration in StudyScreen & SRSStudy** — All study modes now award XP (+10 base, +5 for correct). Floating +XP animation. Session summary shows total XP earned. Streak updated on practice. Study time tracked for daily goal. (Cron 3, Feb 28 afternoon)
- ✅ **Session summary after flashcard practice** — Rich summary with accuracy %, time elapsed, correct/wrong bar, hardest words list, speed stat (Cron 3, Feb 28)
- ✅ **Onboarding CTA on homepage** — "New here?" section with links to flashcards, grammar A1, games (Cron 3, Feb 28)

## Previously Completed ✅ (Mar 5 Night — "Platform Unity & Persistence")
- ✅ **🔗 Grammar XP Bridge** — gamification-bridge.js, unified XP across platform
- ✅ **☁️ Cloud Sync (Firestore)** — full gamification data synced
- ✅ **🏠 Homepage Personalization** — returning users see stats + Daily Lesson CTA
- ✅ **🔔 Cross-Page SRS Reminders** — amber banner on all pages
- ✅ **📖 Reading Comprehension** — 10th study mode

## Previously Completed ✅ (Mar 5 Day — "Guided Learning & Content Depth")
- ✅ **📝 Placement Test** — 15-question A1→C1 assessment, saves level
- ✅ **🎧 Podcast Player Upgrade** — Custom player, speed control, transcript, language toggle
- ✅ **📚 Course Units** — 6 structured units with completion tracking
- ✅ **📝 Interactive Grammar Exercises** — Duolingo-style 3D buttons, feedback bar
- ✅ **🔄 Reverse Mode Enhancement** — 3D flip, correct autoplay
- ✅ **📊 Progress Chart** — SVG line chart on dashboard

### Backlog — HIGH
- [ ] **Speaking practice** — Record and compare pronunciation (Web Speech API)
- [ ] **Writing exercises** — Free-form writing prompts with AI feedback
- [ ] **Longer podcast episodes** — 10-20 min episodes for commute listening
- [ ] **Notification system** — Push notifications for SRS reviews and streaks

## In Progress 🔄
(none)

## Previously Completed ✅ (Feb 28 Night Sprint)
- ✅ Streak System — daily streaks in localStorage, shown on dashboard + navbar
- ✅ XP System — earn XP for all activities, levels, floating animations
- ✅ Daily Goal — progress tracking with visual bar
- ✅ Learning Path — 10-step beginner roadmap on dashboard
- ✅ Navbar gamification — streak 🔥 + XP ⭐ badges

## Notes
- Each feature cron picks 2 items from HIGH priority
- Mark items as 🔄 when started, ✅ when done
- Add new ideas as they come up
