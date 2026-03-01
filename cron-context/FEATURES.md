# FluentGe Feature Backlog

## Priority: HIGH 🔴

### 🎯 THIS SPRINT (Mar 1 night) — "Active Learning & Depth"
- [ ] **❓ Quiz Mode** — Multiple-choice quiz for flashcard decks (pick correct translation from 4 options) ← Cron 3
- [ ] **⌨️ Typing Mode** — Type the English translation, check answer. Hard mode = deep learning. +25 XP ← Cron 3
- [ ] **🔓 Expand Free Grammar** — 3→8 free lessons (full A1 unlocked) ← Cron 4
- [ ] **🏆 Achievements System** — Milestone badges on dashboard ← Cron 4
- [ ] **🔊 Audio Autoplay** — Option to auto-play pronunciation on card appear ← Cron 4

### Flashcard Improvements
- [ ] True Anki-style spaced repetition with intervals (1d → 3d → 7d → 15d → 30d)
- [ ] "Words I Know" counter — show total mastered vocabulary
- [ ] Reverse mode: Georgian first → user says English → flip to reveal + auto-play audio
- [ ] Written input mode: type the answer instead of self-grading
- [ ] Better card flip animation

### Dashboard
- [ ] XP system — earn XP for every activity
- [ ] Achievements/badges system
- [ ] Overall vocabulary size tracker
- [ ] Leaderboard (top learners this week)
- [ ] Daily goal setting (e.g., "Learn 20 words today")
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
- ✅ **😤 Difficult Words Practice** — Tracks wrong answers from quiz/typing modes. Shows list of hardest words sorted by error count. Focused review mode with flashcard practice (+20 XP). Words auto-removed after 3+ net correct. (Cron 3, Mar 1)
- ✅ **🔍 Word Search** — Full-text search across all 142 decks (~3000+ words). Search by English or Georgian. Expandable results show pronunciation, examples, deck info. Navigate directly to deck from results. Accessible via 🔍 in header. (Cron 3, Mar 1)
- ✅ **StatsBar Gamification Upgrade** — Streak 🔥 with fire animation, XP ⭐ with level display, daily goal progress bar, XP-to-next-level bar. Auto-refreshes every 2s. (Cron 3, Feb 28 afternoon)
- ✅ **XP Integration in StudyScreen & SRSStudy** — All study modes now award XP (+10 base, +5 for correct). Floating +XP animation. Session summary shows total XP earned. Streak updated on practice. Study time tracked for daily goal. (Cron 3, Feb 28 afternoon)
- ✅ **Session summary after flashcard practice** — Rich summary with accuracy %, time elapsed, correct/wrong bar, hardest words list, speed stat (Cron 3, Feb 28)
- ✅ **Onboarding CTA on homepage** — "New here?" section with links to flashcards, grammar A1, games (Cron 3, Feb 28)

## In Progress 🔄
- Quiz Mode + Typing Mode (Sprint Mar 1 night) — ✅ Built by Cron 2+3
- Achievements system (Sprint Mar 1 night)
- ✅ Difficult Words Practice — track wrong answers, focused review mode (Cron 3, Mar 1)
- ✅ Word Search — search across all decks (Cron 3, Mar 1)

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
