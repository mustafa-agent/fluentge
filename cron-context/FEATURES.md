# FluentGe Feature Backlog

## Priority: HIGH 🔴

### 🎯 THIS SPRINT (Mar 4 night) — "Sentence Exercises & Mobile Polish"
- [x] **📝 Sentence Builder** — Arrange English word tiles to form sentences from Georgian prompt ✅ Cron 2
- [x] **🎧 Listening Exercise** — Hear English audio, pick correct Georgian translation ✅ Cron 2
- [ ] **📱 Mobile Bottom Navigation** — Fixed bottom bar with 5 tabs on mobile ← Cron 4
- [ ] **📲 PWA Install Banner** — Prompt mobile users to add to home screen ← Cron 4
- [ ] **📈 Progress Chart** — 7-day words-learned chart on dashboard ← Cron 4

### Flashcard Improvements
- [ ] Reverse mode: Georgian first → user says English → flip to reveal + auto-play audio
- [ ] Better card flip animation

### Dashboard
- [ ] Overall vocabulary size tracker
- [ ] Leaderboard (top learners this week)
- [ ] Progress visualization — chart of words learned over time

### Section Interconnection
- [ ] "Recommended for you" section on dashboard
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

## In Progress 🔄
- 🔄 **📊 Vocabulary Size Tracker** — Dashboard total words mastered/learning/seen counts (Cron 3, Mar 4)
- 🔄 **🎯 Recommended For You** — Smart study suggestions on dashboard (Cron 3, Mar 4)

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
