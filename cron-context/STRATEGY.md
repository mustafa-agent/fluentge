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

### Theme: "Content Quality & User Journey Polish"

### CONTEXT: Previous Sprint Results (Mar 5 — "Guided Learning & Content Depth")
- ✅ Placement Test — 15 questions A1→C1, saves level, recommendations
- ✅ Podcast Player Upgrade — custom player, speed control, transcript, language toggle
- ✅ Course Units — 6 units with completion tracking, expandable lessons
- ✅ Interactive Grammar Exercises — Duolingo-style 3D buttons, feedback bar, result screen
- ✅ Reverse Mode Enhancement — 3D flip animation, correct autoplay
- ✅ Progress Chart — SVG line chart on dashboard

### Strategic State (Mar 6, 1:00 AM):
FluentGe has **71 React components, 10 study modes, 14 pages, placement test, course units, enhanced podcast player, cloud sync, full gamification, PWA, 260KB bundle**. 

**We've built the features AND the guided journey. Now we need to DEEPEN and POLISH.**

The platform is wide but some areas are shallow. The course units link to pages but there's no actual UNIT QUIZ that tests cross-skill knowledge. The podcast episodes have a player but the comprehension quiz data isn't populated. The placement test works but doesn't actually personalize the experience yet (no deck filtering by level). 

**The #1 priority: CONNECT THE DOTS.**
- Placement test saves a level but nothing changes based on it
- Course unit "quiz" links go to generic /games/ — need actual unit-specific quizzes
- Podcast comprehension quizzes need real question data per episode
- Recommended decks should filter by user's assessed level

**The #2 priority: CONTENT DEPTH FOR PODCASTS.**
- Podcast player is beautiful but episodes are short basic dialogues
- Need real comprehension questions per episode
- Need vocabulary highlights per episode
- This turns podcasts from a nice-to-have into a real learning pillar

**The #3 priority: HOMEPAGE & CONVERSION OPTIMIZATION.**
- Homepage is decent but doesn't convert well
- Need clear "Start Learning" flow that goes: Homepage → Placement Test → Personalized Dashboard
- Premium page needs social proof tied to real usage stats
- Better mobile experience on landing page

**The #4 priority: SEO & DISCOVERABILITY.**
- 28 blog posts exist but are they optimized?
- Need Georgian-language SEO targeting ("ინგლისური ონლაინ", "ინგლისურის სწავლა")
- Meta tags, Open Graph, structured data
- Blog should drive organic traffic

**The #5 priority: BUG HUNTING & EDGE CASES.**
- 71 components = lots of places for edge cases
- Are all 30+ games actually working?
- What happens with empty decks? Decks with <5 cards?
- Error states for Firebase auth failures?

### Sprint Goals (ordered by priority)

1. **🔴 Level-Based Personalization** — Make placement test results MATTER:
   - Filter recommended decks by assessed level
   - Course units: highlight user's suggested starting unit
   - Dashboard greeting adapts to level ("beginner" vs "intermediate")
   - Daily Lesson difficulty matches level (easier words for A1, harder for B2)
   - Grammar page: highlight recommended starting lesson
   - **Files:** Multiple — DeckSelect, Dashboard, DailyLesson, courses.astro

2. **🔴 Podcast Comprehension Data** — Make podcast quizzes real:
   - Add 3-5 comprehension questions per episode (in podcast.astro data)
   - Add vocabulary list per episode (key words with Georgian translations)
   - Add timestamps to transcript lines for real sync
   - Wire quiz completion to XP system via gamification bridge
   - **File:** `website/src/pages/podcast.astro`

3. **🟡 Homepage → Placement Flow** — Optimize new user journey:
   - Main CTA "დაიწყე სწავლა" → goes to /placement/ for new users
   - After placement → redirect to /flashcards/ with personalized recommendations
   - Returning users CTA → Daily Lesson or due reviews
   - Add "already know your level?" skip option
   - **File:** `website/src/pages/index.astro`, `website/src/pages/placement.astro`

4. **🟡 SEO Optimization** — Drive organic Georgian traffic:
   - Audit all page meta tags and Open Graph data
   - Add structured data (EducationalOrganization, Course)
   - Optimize blog post titles/descriptions for Georgian search terms
   - Add sitemap.xml if missing
   - Verify robots.txt
   - **File:** Layout.astro, blog posts

5. **🟢 Game Verification** — Ensure all games work:
   - Test each of the 30+ game components for basic functionality
   - Check for crash scenarios (empty data, missing cards)
   - Fix any broken games
   - **File:** Various game components

### For Each Cron Tonight:
- **Cron 1 (Strategy, 1:00AM):** ← THIS RUN. Sprint planning, strategic specs, context updates.
- **Cron 2 (Design, 3:00AM):** Design level-personalization UI changes. Podcast quiz UI. Homepage CTA flow. SEO meta tags.
- **Cron 3 (Features, 5:00AM):** Build level-based personalization across all components. Podcast comprehension data + quiz wiring.
- **Cron 4 (Improvements, 7:00AM):** Homepage→Placement flow. SEO audit & fixes. Game verification.
- **Cron 5 (QA, 9:00AM):** Full QA. Test placement→personalization flow. Podcast quizzes. All games.

## Technical Specs

### Level-Based Personalization (Cron 3)
```
// Read level from localStorage: 'fluentge-level' (set by placement test)
// Possible values: 'A1', 'A2', 'B1', 'B2', null (not assessed)
//
// DeckSelect.tsx changes:
//   - If level exists, show "Recommended for your level" section above all decks
//   - A1: greetings, numbers, colors, family, food, animals
//   - A2: daily-life, shopping, travel, emotions, weather
//   - B1: business, technology, health, education, culture
//   - B2: academic, idioms, advanced-grammar, abstract-concepts
//   - "Change level" link → /placement/
//
// DailyLesson.tsx changes:
//   - A1/A2: use simpler decks (greetings, food, family, numbers)
//   - B1/B2: use harder decks (business, academic, idioms)
//   - Currently uses only top-2000 — expand deck selection by level
//
// Dashboard greeting:
//   - "დონე: A1 — დამწყები" / "დონე: B2 — მაღალი" etc.
//   - Shows in stats area
//
// courses.astro:
//   - Highlight suggested starting unit based on level
//   - A1 → Unit 1, A2 → Unit 2, B1 → Unit 3-4, B2 → Unit 5-6
```

### Podcast Comprehension Data (Cron 3)
```
// Each episode in podcast.astro needs:
// 1. quiz: array of {question, options: [4], correct: 0-3, explanation}
// 2. vocabulary: array of {word, georgian, pronunciation}
// 3. transcript timestamps: each line gets {start, end} in seconds
//
// Quiz completion: call FluentGe.addXP(20) via gamification bridge
// Show quiz after user reaches end of episode or clicks "Quiz" button
// Vocabulary section below transcript — clickable words play audio
```

### SEO (Cron 4)
```
// Layout.astro:
//   - Ensure og:title, og:description, og:image on every page
//   - Add EducationalOrganization structured data
//   - Georgian hreflang tag
//
// Target keywords:
//   - "ინგლისურის სწავლა" (learn English)
//   - "ინგლისური ონლაინ" (English online)
//   - "ინგლისური ქართულად" (English in Georgian)
//   - "უფასოდ ინგლისური" (free English)
//   - "ფლეშბარათები" (flashcards)
```

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Build script now auto-removes audio from dist (`npm run deploy`)
- ⚠️ Deploy: uses `uuidgen` for index.html cache busting (permanent fix)
