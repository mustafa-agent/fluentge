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

## What FluentGe Has (Current State — Mar 5)
- 14 Astro pages + 28 blog posts
- 142 flashcard deck JSON files with audio (EN + KA)
- **70 React components** (30+ games + 9 study modes + UI)
- 65 grammar lessons (A1-C1) with interactive exercises + sound feedback
- 8 free grammar lessons (full A1) ✅
- Podcast section with audio
- Dashboard with progress tracking + "continue where you left off"
- Firebase auth (Google SSO + email)
- Light/dark mode (audited ✅)
- PWA support (manifest + service worker + install banner)
- Premium/free tier system
- Phrases page (1,695 phrases, 40 categories)
- **9 study modes:** EN→KA, KA→EN, Mixed, SRS, Quiz, Typing, Sentence Builder, Listening, Fill-in-Blank ✅
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
- **Bundle size: 258KB** (96% reduction from 6.5MB via dynamic loading) ✅

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
│   ├── src/components/ # 70 components
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

## 🎯 Current Sprint (Mar 5 Day Cycle)

### Theme: "Guided Learning & Content Depth"

### CONTEXT: Previous Sprint Results (Mar 5 Night — "Platform Unity & Persistence")
- ✅ Grammar XP Bridge — gamification-bridge.js, +10 XP per correct, streak/study time tracking
- ✅ Cloud Sync (Firestore) — full gamification data synced, smart merge, offline-first
- ✅ Homepage Personalization — returning users see stats + Daily Lesson CTA
- ✅ Cross-Page SRS Reminders — amber banner on all non-flashcard pages
- ✅ Reading Comprehension — 10th study mode, passages + questions + Georgian toggle

### Strategic State (Mar 5, 11:30 AM):
FluentGe has **70+ React components, 10 study modes, Daily Lesson, Weekly Leaderboard, SM-2 SRS, onboarding, PWA, mobile bottom nav, full unified gamification, cloud sync, personalized homepage**. 260KB main bundle. Platform is UNIFIED — grammar and flashcards share same XP/streak system. Progress persists in Firestore.

**We've built the engine. Now we need to guide users through it.**

The platform is feature-rich but the USER JOURNEY is still "here's a bunch of tools, figure it out." Duolingo's magic is that users never have to THINK about what to do next — the app decides. FluentGe needs that same guided experience.

**The #1 gap: NO LEVEL ASSESSMENT.**
- New users start at zero with no idea of their level
- A 15-question placement test → auto-assigns A1/A2/B1/B2
- Personalizes entire experience: recommended decks, grammar level, difficulty
- Every serious language app has this (Duolingo, Lingwing, Memrise)

**The #2 gap: PODCAST SECTION IS UNDERDEVELOPED.**
- Only short 2-min dialogues with basic player
- No transcript highlighting, no speed control, no comprehension questions
- Podcasts are a PILLAR but feel like an afterthought
- Users should be able to listen, read along, answer questions, learn vocab

**The #3 gap: NO STRUCTURED CURRICULUM.**
- Learning Path exists (10-step roadmap) but it's a flat list
- Need proper course UNITS that bundle: vocab deck + grammar lesson + podcast + quiz
- Unit 1: Basics (greetings + to-be + airport podcast)
- Unit 2: Daily Life (food + present simple + restaurant podcast)
- This is how Duolingo organizes content — units with multiple lesson types

**The #4 gap: GRAMMAR EXERCISES ARE STILL PASSIVE.**
- Grammar pages have basic check exercises but they're simple show/hide
- Need interactive quiz-style exercises: multiple choice, fill-in, sentence reorder
- With XP bridge now working, better exercises = more engagement + XP

### Sprint Goals (ordered by priority)

1. **🔴 Placement Test** — Assess user level in 2 minutes:
   - 15 multiple-choice questions, progressive difficulty (A1→B2)
   - Question types: vocab meaning, grammar fill-in, sentence completion
   - Auto-scoring: <5 correct = A1, 5-8 = A2, 9-12 = B1, 13-15 = B2
   - Saves level to localStorage + Firestore
   - Shown after onboarding OR accessible from profile
   - Result personalizes: recommended decks, grammar starting point, daily lesson difficulty
   - **File:** `PlacementTest.tsx` in flashcard-app

2. **🔴 Podcast Player Upgrade** — Make podcasts a real learning tool:
   - Transcript with word-by-word highlighting synced to audio
   - Speed control (0.5x, 0.75x, 1x, 1.25x)
   - Comprehension quiz after each episode (3-5 questions)
   - Vocabulary list with audio for each episode's key words
   - +20 XP for completing an episode + quiz
   - Georgian/English transcript toggle
   - **File:** Upgrade `podcast.astro` + new `podcast-player.js`

3. **🟡 Course Units** — Structured learning paths:
   - 6 units: Basics, Daily Life, Travel, Work, Social, Advanced
   - Each unit = 3-5 lessons, each lesson = vocab deck + grammar + practice
   - Progress bar per unit, unlock next unit at 80% completion
   - Unit overview page showing all lessons with completion status
   - **File:** New `website/src/pages/courses.astro` + `course-data.json`

4. **🟡 Interactive Grammar Exercises** — Upgrade from passive to active:
   - Replace show/hide exercises with quiz-style interactive ones
   - Types: multiple choice, fill-in-blank, sentence reorder, error correction
   - Timer optional, immediate feedback, +10 XP per correct
   - Grammar XP bridge already handles XP — just need better exercise UI
   - **File:** New `public/js/grammar-exercises.js`

5. **🟢 Practice Stats Email/Notification** — Weekly progress summary:
   - PWA notification when SRS cards are due (if permission granted)
   - Weekly stats summary on dashboard: words learned, time spent, streak
   - Motivational message based on progress

### For Each Cron Today:
- **Cron 1 (Strategy, 11:30AM):** ← THIS RUN. Sprint planning, specs, context file updates.
- **Cron 2 (Design, 1:30PM):** Design placement test UI (question cards, progress, result screen). Podcast player redesign (transcript highlighting, controls). Course units page layout.
- **Cron 3 (Features, 3:30PM):** Build Placement Test (PlacementTest.tsx) + Podcast Player upgrade (podcast-player.js).
- **Cron 4 (Improvements, 5:30PM):** Course Units page + Interactive Grammar Exercises + weekly stats.
- **Cron 5 (QA, 7:30PM):** Full QA. Test placement test, podcast player, courses page.

## Technical Specs

### Placement Test (Cron 3)
**File:** `flashcard-app/src/components/PlacementTest.tsx`

```tsx
// PlacementTest.tsx — 15-question level assessment
//
// Question bank: 15 questions, 4 per level (A1, A2, B1, B2) — last 3 are B2
// Question types:
//   - vocab: "What does 'X' mean?" → 4 Georgian options
//   - grammar: "She ___ to school every day." → goes/go/going/gone
//   - sentence: "Which sentence is correct?" → 4 options
//
// Flow:
//   1. Welcome screen: "Let's find your level! 15 questions, ~2 minutes"
//   2. Question cards with A/B/C/D options (reuse quiz-option CSS)
//   3. Progress bar (chunky, like study mode)
//   4. No immediate feedback (assessment, not practice)
//   5. Result: level badge (A1/A2/B1/B2) + description + personalized recommendations
//   6. Save: localStorage 'fluentge-level' + Firestore sync
//
// Integration:
//   - OnboardingModal step 2 can offer "Take placement test" option
//   - Profile page shows current level with "Retake test" button
//   - Dashboard recommendations use level for deck suggestions
//
// Screen type: 'placement-test' in App.tsx
```

### Podcast Player Upgrade (Cron 3)
**File:** `website/public/js/podcast-player.js`

```js
// podcast-player.js — Enhanced podcast experience
//
// Features:
//   1. Audio player with custom controls (play/pause, seek bar, time display)
//   2. Speed control: 0.5x, 0.75x, 1.0x, 1.25x buttons
//   3. Transcript display: each line is a <p> with data-start/data-end timestamps
//   4. Auto-scroll + highlight current line during playback
//   5. Click any transcript line to jump to that point
//   6. Georgian/English toggle for transcript
//   7. Vocabulary section: episode words with 🔊 audio buttons
//
// Quiz (after episode):
//   - 3-5 comprehension questions per episode
//   - Multiple choice, based on transcript content
//   - +20 XP via FluentGe.addXP() (gamification-bridge.js)
//
// Data: episode objects in podcast.astro already have transcript arrays
// Need to add: timestamps to transcript entries, quiz questions per episode
```

### Course Units (Cron 4)
**File:** `website/src/pages/courses.astro` + `website/public/data/course-units.json`

```json
// course-units.json structure:
[
  {
    "id": "basics",
    "title": "საფუძვლები",
    "titleEn": "Basics",
    "icon": "🌱",
    "lessons": [
      {
        "type": "vocab",
        "deckId": "greetings-introductions",
        "title": "მისალმებები"
      },
      {
        "type": "grammar",
        "slug": "to-be",
        "title": "ზმნა To Be"
      },
      {
        "type": "podcast",
        "episodeId": 1,
        "title": "აეროპორტში"
      },
      {
        "type": "quiz",
        "title": "ტესტი: საფუძვლები"
      }
    ]
  }
  // ... 5 more units
]
```

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Build script now auto-removes audio from dist (`npm run deploy`)
- ⚠️ Deploy: uses `uuidgen` for index.html cache busting (permanent fix)
