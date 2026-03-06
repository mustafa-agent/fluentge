# FluentGe Strategy — Master Plan

## Vision
FluentGe is THE English learning platform for Georgians. Professional quality that would have cost millions to build. Fun, engaging, effective. The kind of site that makes users feel like they're playing a game while actually learning English fast.

## Revenue Model
- **Free tier:** Limited decks, basic grammar, 3 games, sample podcasts
- **Premium:** Full access to all decks, games, podcasts, advanced features — subscription model

## Core Pillars
1. **Flashcards** — Spaced repetition vocabulary builder (Anki/Memrise quality)
2. **Grammar** — Interactive lessons with exercises
3. **Podcasts** — Comprehensible input, slow clear English, interesting topics
4. **Games** — Gamified learning (60+ games)
5. **Dashboard** — Progress tracking, XP, streaks, leaderboards

## Competitive Landscape
- **Duolingo:** Gamification king, bite-sized lessons, streaks
- **Memrise:** Great spaced repetition, real-world video clips
- **Lingwing.com:** Our closest competitor for Georgian market — playful tone, practice-focused, no grammar drilling
- **Anki:** Best spaced repetition algorithm

## What FluentGe Has (Current State — Mar 6)
- 14 Astro pages + 28 blog posts
- 142 flashcard deck JSON files with audio (EN + KA)
- **71 React components** (30+ games + 10 study modes + UI)
- 65 grammar lessons (A1-C1) with Duolingo-style interactive exercises + sound feedback
- 8 free grammar lessons (full A1) ✅
- Podcast section with custom player (speed control, transcript, language toggle)
- Dashboard with progress tracking + "continue where you left off"
- Firebase auth (Google SSO + email)
- Light/dark mode (audited ✅)
- PWA support (manifest + service worker + install banner)
- Premium/free tier system
- Phrases page (1,695 phrases, 40 categories)
- **10 study modes:** EN→KA, KA→EN, Mixed, SRS, Quiz, Typing, Sentence Builder, Listening, Fill-in-Blank, Reading Comprehension ✅
- **Daily Lesson** — auto-generated 10-round mixed practice ✅
- **Weekly Leaderboard** — simulated + real users ✅
- **Difficult Words** — tracks errors, focused review mode ✅
- **Word Search** — search across all 142 decks ✅
- Session summary after flashcard practice ✅
- Onboarding modal (3-step flow) ✅
- Grammar ↔ Flashcard interconnection ✅
- **Streak system** 🔥 with fire animation ✅
- **XP system** ⭐ with levels + floating animations ✅
- **Daily goal** progress tracking ✅
- **Learning path** (10-step beginner roadmap) ✅
- **Navbar gamification** (streak + XP badges) ✅
- **Achievements** — 10 milestone badges ✅
- **Mobile bottom navigation** — frosted glass 5-tab bar ✅
- **SM-2 spaced repetition** — real algorithm with intervals ✅
- **Vocabulary Size Tracker** — SVG progress ring ✅
- **Recommended For You** — smart dashboard cards ✅
- **7-Day Activity Chart** — dual bar chart ✅
- **Placement Test** — 15-question A1→C1 level assessment ✅
- **Course Units** — 6 structured units with completion tracking ✅
- **Podcast Player** — custom controls, speed, transcript, language toggle ✅
- **Grammar XP Bridge** — unified XP across platform ✅
- **Cloud Sync** — Firestore gamification data ✅
- **Progress Chart** — SVG line chart (7/14/30 day) ✅
- **Bundle size: 260KB** (96% reduction from 6.5MB via dynamic loading) ✅

## Architecture
- **Website:** Astro (SSG) at `/` — landing, grammar, podcasts, dashboard, blog
- **Flashcard App:** React (Vite) at `/flashcards/` — standalone SPA
- **Auth:** Firebase (Google SSO + email/password)
- **Hosting:** Cloudflare Pages (fluentge.pages.dev)
- **Repo:** github.com/mustafa-agent/fluentge

## File Structure
```
english-app/
├── website/           # Astro site
│   ├── src/pages/     # All pages
│   ├── src/layouts/   # Layout.astro
│   ├── src/styles/    # global.css
│   └── public/        # Static assets (audio, icons)
├── flashcard-app/     # React Vite app
│   ├── src/components/ # 71 components
│   ├── src/lib/       # cards.ts, firebase, srs-engine, gamification, storage
│   └── content/       # 142 JSON deck files
└── cron-context/      # This directory — cron coordination files
```

## Deploy Commands
```bash
# Build flashcard app (outputs to website/public/flashcards/)
cd flashcard-app && npm run build

# Build website
cd website && npm run build

# Deploy to Cloudflare
CLOUDFLARE_API_TOKEN="..." npx wrangler pages deploy dist/ --project-name=fluentge --commit-dirty=true
```

## Design Direction
See DESIGN.md for current design rules and standards.

---

## 🎯 Current Sprint (Mar 7 Night Cycle)

### Theme: "Tornike's 8 Priorities — User-Requested Fixes"

### ⚠️ CRITICAL CONTEXT
Tornike gave 8 explicit priorities on Mar 6. The previous sprint (Mar 6 day) worked on unit quizzes/grammar review instead. **These are the BOSS's direct requests — they override our strategic backlog.** MEMORY.md lesson #0: "Write tasks down IMMEDIATELY."

### CONTEXT: Previous Sprint Results (Mar 6 Day — "Unit Quizzes, Grammar Review & Conversion")
- ✅ Level-Based Personalization — DailyLesson, DeckSelect, Dashboard, courses.astro all read placement level
- ✅ Podcast Comprehension Data — 105 quiz questions across all 35 episodes
- ✅ Homepage → Placement Flow — New user CTA → placement test, personalized result CTAs
- ✅ SEO Fixes — All URLs corrected from surge.sh → pages.dev, sitemap/robots.txt fixed
- ✅ Game Verification — All 30 games reviewed, no bugs

### Strategic State (Mar 6, 11:30 AM):
FluentGe has **71 React components, 10 study modes, 14 pages, 112 total pages, placement test, level personalization, course units, podcast quizzes, cloud sync, full gamification, PWA, 263KB bundle**.

**The platform is MATURE. Every Tornike priority from Mar 2 is DONE.** We beat Lingwing.com on features. The engine works. Now we need to fill the remaining STRUCTURAL GAPS that separate us from a truly professional learning app.

**Gap #1: Course Unit Quizzes are fake.**
Course units have a "ერთეულის ტესტი" (unit quiz) link that goes to generic /games/. This is a broken promise. Users complete a unit's vocab + grammar + podcast and then the "test" just dumps them at a random games page. We need REAL unit quizzes that test the specific vocabulary and grammar from that unit. This is the #1 disconnect in the guided learning path.

**Gap #2: Grammar is one-and-done.**
Users complete a grammar lesson, get XP, and never review it. There's no spaced review for grammar concepts. Duolingo brings back old lessons periodically. We should add a "Grammar Review" feature — randomly resurface completed grammar exercises for review, with SRS-like spacing.

**Gap #3: Premium conversion flow is weak.**
Premium page exists with pricing and FAQs, but there's no actual payment integration. The "buy" buttons don't work. Before we can make money, we need at least a Stripe checkout or a simple PayPal button. This is the revenue bottleneck.

**Gap #4: No vocabulary per podcast episode.**
Podcast quizzes are done (105 questions), but there's no vocabulary list per episode. Each episode should highlight 5-8 key words with Georgian translations. This turns podcasts from passive listening into active vocabulary acquisition.

**Gap #5: Profile page is shallow.**
Profile exists but doesn't show much useful data. Should show: total words learned, grammar lessons completed, podcast episodes listened, games played, total study time, join date. Make users feel proud of their progress.

### Tornike's 8 Priorities (Mar 6) — STATUS:

1. **🔴 Daily Goal → Card-Based (not time-based)**
   - STATUS: ✅ ALREADY DONE in gamification.ts! Goal is already card-based (default 50 cards)
   - But DeckSelect still shows "~5 წთ" on DailyLesson CTA — needs cleanup
   - Daily goal modal shows card presets (10/25/50/75/100) — needs verification
   - Persistence works via localStorage — resets by date key, cumulative across sessions
   - **Fix needed:** Remove any remaining "წთ" (minutes) references, verify card tracking

2. **🔴 Replace ALL Old Robotic TTS Voices**
   - Current: speechSynthesis API (browser built-in) for listening exercises + podcast vocab
   - The audio files in `/flashcards/audio/words/` are pre-generated — need to check quality
   - All 142 decks have audio files — these are the main TTS used
   - **Action:** Audit all audio sources. If using old voices, regenerate with better TTS

3. **🔴 Fix Deep Links: Courses → Specific Flashcard Decks**
   - STATUS: ✅ courses.astro already deep-links to `/flashcards/?deck=greetings` etc.
   - App.tsx has `?deck=` handler that auto-opens the deck
   - Grammar pages already deep-link correctly (`/flashcards/?deck=${d.deck}`)
   - Podcast page has NO flashcard links at all — needs adding
   - **Fix needed:** Verify all course links work, add flashcard links to podcast page

4. **🟡 Remove "Mark as Done" System**
   - Grammar `[slug].astro` has "მონიშნე ნასწავლად" button (line 250)
   - Phrases page has mark-phrase-btn buttons
   - Dashboard may show completed counters
   - **Action:** Remove mark-as-done buttons, remove related counters from dashboard

5. **🟡 Build NEW Dashboard Tracking System**
   - Replace manual "mark as done" with automatic progress tracking
   - Track: cards reviewed (already have this), grammar exercises completed (have via gamification bridge), podcasts listened (need to track), games played (have this)
   - Dashboard should show REAL engagement metrics, not manual checkboxes
   - **Action:** Redesign dashboard stats section with automatic tracking

6. **🟡 Grammar Page: Lock/Unlock System**
   - Currently all lessons accessible (premium ones locked by tier, not by progress)
   - Need: sequential unlocking — must complete lesson N before accessing N+1
   - Need: test at end of each lesson (grammar exercises already exist!)
   - Passing test = lesson "learned" + next lesson unlocked
   - **Action:** Add lock logic to grammar.astro, require exercise completion for unlock

7. **🟢 Redesign Games Page**
   - Current: grid of 30 game cards with basic styling
   - Needs: polished, professional design
   - **Action:** Redesign games.astro with better layout, categories, visual appeal

8. **🟢 Full Site Audit**
   - Check every page for bugs, visual issues, broken links
   - **Action:** QA cron handles this

### Sprint Goals (ordered by priority — Tornike's requests FIRST)

1. **🔴 #1+#3: Daily Goal Cleanup + Deep Link Verification** (Cron 2)
   - Remove "~5 წთ" from DailyLesson CTA, verify card-based goal works
   - Test all course → flashcard deep links
   - Add flashcard links to podcast episodes

2. **🔴 #2: TTS Voice Audit** (Cron 3)
   - Check audio file quality in flashcard decks
   - Identify robotic voices, plan replacement

3. **🔴 #4+#5: Remove Mark-as-Done + New Dashboard Tracking** (Cron 3)
   - Remove all "mark as done" buttons from grammar and phrases
   - Remove related dashboard counters
   - Build new automatic progress tracking on dashboard

4. **🟡 #6: Grammar Lock/Unlock System** (Cron 4)
   - Sequential lesson unlocking on grammar.astro
   - Exercise completion = lesson passed → auto-unlocks next
   - Visual locked/unlocked states

5. **🟡 #7: Games Page Redesign** (Cron 4)
   - Better layout, categories, polish

### For Each Cron Tonight:
- **Cron 1 (Strategy, 1:00AM):** ← THIS RUN. Sprint planning around Tornike's 8 priorities.
- **Cron 2 (Design, 3:00AM):** Daily goal cleanup, deep link fixes, games page redesign CSS, grammar lock UI.
- **Cron 3 (Features, 5:00AM):** Remove mark-as-done, build new dashboard tracking, TTS audit, podcast flashcard links.
- **Cron 4 (Improvements, 7:00AM):** Grammar lock/unlock system, games page redesign implementation.
- **Cron 5 (QA, 9:00AM):** Full site audit (Tornike's #8) — every page, every link, every component.

## Technical Specs

### Remove Mark-as-Done (Cron 3)
```
// 1. grammar/[slug].astro line ~250: Remove "მონიშნე ნასწავლად" button + its JS
// 2. phrases.astro: Remove mark-phrase-btn buttons
// 3. Dashboard: Remove any "Phrases/Grammar/Podcasts/Flashcards completed" counters
//    that relied on manual marking
// 4. Clean up localStorage keys related to manual marking
```

### New Dashboard Tracking (Cron 3)
```
// Replace manual counters with AUTOMATIC stats:
// - Cards reviewed today / this week (from dailyCardsReviewed)
// - Grammar lessons completed (from fluentge-grammar-completed)
// - Games played (from gamesPlayed in gamification)
// - Study time today (from daily history)
// - Streak + XP (already shown)
// These all already exist in localStorage — just need to display them
// properly on Dashboard.tsx instead of manual "mark as done" counts
```

### Grammar Lock/Unlock (Cron 4)
```
// grammar.astro: 
// - Define lesson ORDER (A1 lessons first, then A2, etc.)
// - Check localStorage 'fluentge-grammar-completed' array
// - Lesson N is unlocked only if lesson N-1 is in completed array
// - First lesson always unlocked
// - Locked lessons: gray out, show 🔒 icon, click shows "complete previous lesson first"
// - Completed lessons: show ✅ green badge
// - Current lesson (first unlocked incomplete): show "▶ start" badge
//
// grammar/[slug].astro:
// - Exercise completion (80%+ score) → auto-marks lesson as completed
// - This ALREADY happens via gamification-bridge.js markGrammarComplete()
// - Just need to verify the threshold and ensure it writes to the array
```

### Games Page Redesign (Cron 4)
```
// games.astro:
// - Group games into categories (Vocabulary, Grammar, Listening, Fun)
// - Card redesign: bigger icons, better colors, difficulty badges
// - "Game of the Day" spotlight at top
// - Stats row (games played, total score, streak)
// - Search/filter functionality
```

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Build script now auto-removes audio from dist (`npm run deploy`)
- ⚠️ Deploy: uses `uuidgen` for index.html cache busting (permanent fix)
