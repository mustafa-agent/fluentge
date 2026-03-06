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

## 🎯 Current Sprint (Mar 6 Night Cycle)

### Theme: "Unit Quizzes, Grammar Review & Conversion"

### CONTEXT: Previous Sprint Results (Mar 6 Day — "Content Quality & User Journey Polish")
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

### Sprint Goals (ordered by priority)

1. **🔴 Unit-Specific Quizzes** — Real tests for each course unit:
   - Each unit quiz tests vocabulary from that unit's decks + grammar from that unit's lesson
   - 10-question mixed format: 5 vocab (EN→KA multiple choice) + 3 grammar (fill-in/choose) + 2 listening
   - Pull actual cards from the unit's specific decks (greetings for Unit 1, food for Unit 2, etc.)
   - Score screen with unit completion badge, XP award (+50 for passing)
   - Update course unit completion tracking when quiz is passed (≥70%)
   - **Files:** New `UnitQuiz.tsx` component, `courses.astro` (update quiz links)

2. **🔴 Grammar Review System** — Spaced review of completed grammar:
   - Track which grammar lessons are completed (already in localStorage via gamification bridge)
   - "Grammar Review" button on grammar page — picks 1-3 completed lessons, shows their exercises
   - SRS-like spacing: recently completed lessons reviewed more often, older ones less
   - Awards XP for review (+10 per correct)
   - **Files:** `grammar/[slug].astro` (review mode), or new section on `/grammar/`

3. **🟡 Podcast Vocabulary Lists** — Key words per episode:
   - Add `vocabulary: [{word, georgian, pronunciation}]` data to each podcast episode
   - Display vocabulary section below transcript (before quiz)
   - Clickable words play pronunciation via speechSynthesis
   - 5-8 words per episode, selected from transcript content
   - **File:** `podcast.astro`

4. **🟡 Premium Payment Integration** — Make the buy button work:
   - Add Stripe Checkout or PayPal button to premium page
   - Simple flow: click "Buy" → redirect to payment → return to /premium/ with success
   - Store premium status in Firebase user profile
   - Check premium status on page load, unlock premium decks/features
   - **File:** `premium.astro`, Firebase auth

5. **🟢 Profile Page Enhancement** — Deeper progress stats:
   - Total words mastered (from SRS data)
   - Grammar lessons completed count
   - Total study time (from dailyHistory)
   - Achievement count
   - Join date (from Firebase or first activity)
   - Study calendar heatmap (GitHub-style green squares)
   - **File:** `profile.astro`

### For Each Cron Tonight:
- **Cron 1 (Strategy, 11:30AM):** ← THIS RUN. Sprint planning, specs, context updates.
- **Cron 2 (Design, 3:00AM):** Design UnitQuiz UI, grammar review section UI, podcast vocabulary UI, profile enhancements.
- **Cron 3 (Features, 5:00AM):** Build UnitQuiz.tsx + grammar review system + podcast vocabulary data.
- **Cron 4 (Improvements, 7:00AM):** Profile page enhancement + premium page prep + polish.
- **Cron 5 (QA, 9:00AM):** Full QA — test unit quizzes, grammar review, all pages.

## Technical Specs

### Unit Quiz (Cron 2+3)
```
// UnitQuiz.tsx — new React component
// Props: unitId (1-6), onComplete callback
//
// Data structure per unit (in courses.astro or passed as props):
// Unit 1: decks=['greetings', 'numbers'], grammar='to-be'
// Unit 2: decks=['food', 'emotions'], grammar='present-simple'
// Unit 3: decks=['travel', 'shopping'], grammar='prepositions-of-place'
// Unit 4: decks=['business', 'technology'], grammar='past-simple'
// Unit 5: decks=['health', 'education'], grammar='present-perfect'
// Unit 6: decks=['idioms', 'academic'], grammar='conditionals'
//
// Quiz format: 10 questions
//   Q1-5: Vocab — show English word, pick correct Georgian from 4 options
//          (load cards from unit's decks, pick 5 random, generate 3 wrong options from other cards)
//   Q6-8: Grammar — fill-in-blank or multiple choice based on unit's grammar topic
//          (hardcoded per unit, 3-5 questions pool, pick 3 random)
//   Q9-10: Listening — hear English word, pick correct Georgian
//          (use speechSynthesis, same as ListeningExercise pattern)
//
// Scoring: ≥7/10 = pass → unit marked complete, +50 XP, badge
//          <7/10 = "try again" with review suggestions
//
// Integration with courses.astro:
//   - Quiz link changes from /games/ to launching UnitQuiz in flashcard app
//   - URL pattern: /flashcards/#unit-quiz/1 (unit number)
//   - App.tsx: new screen 'unit-quiz' that renders UnitQuiz
```

### Grammar Review (Cron 3)
```
// On /grammar/ page, add "გრამატიკის გამეორება" section at top
// Reads localStorage 'fluentge-grammar-completed' array
// If user has completed ≥3 lessons, show review CTA
// Click → opens a completed lesson's exercises in "review mode"
// Review mode: same exercises but shuffled, different feedback text
// Awards +10 XP per correct (same as regular, via gamification bridge)
// Tracks review date per lesson in localStorage
```

### Podcast Vocabulary (Cron 3)
```
// Each episode gets vocabulary: [{word: "airport", georgian: "აეროპორტი", pronunciation: "ˈeərpɔːrt"}]
// Display: colored word pills below transcript, above quiz
// Click word → speechSynthesis speaks it
// 5-8 words per episode
```

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Build script now auto-removes audio from dist (`npm run deploy`)
- ⚠️ Deploy: uses `uuidgen` for index.html cache busting (permanent fix)
