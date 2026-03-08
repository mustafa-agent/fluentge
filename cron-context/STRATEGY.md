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

## 🎯 Current Sprint (Mar 8 Day Cycle)

### Theme: "Launch Readiness & User Acquisition Prep"

### CONTEXT: Previous Sprint Results (Mar 8 Night — "Tornike's Bug Fixes & Launch Polish")
- ✅ ALL 10 bugs from Tornike's audit FIXED
- ✅ Word count unified across 4 locations (Bug #4)
- ✅ Dashboard grammar count merges both keys (Bug #6)
- ✅ Podcast premium display fixed with fallback (Bug #5)
- ✅ Nav premium button timing fixed (Bug #7)
- ✅ Light mode contrast improved (Bug #8)
- ✅ Grammar lock: 4 distinct visual states (Bug #9)
- ✅ 15 Georgian translation fixes applied (Bug #10)
- ✅ Podcast collapsible episodes for performance
- ✅ Async font loading, dns-prefetch
- ✅ QA: 0 issues, all pages 200, clean TypeScript, 267KB bundle

### Strategic State (Mar 8, 11:30 AM):
FluentGe has **72+ React components, 11 study modes, 113 pages, 267KB bundle**. ALL bugs fixed. Platform is **STABLE, POLISHED, and LAUNCH-READY.**

**Now the question: What maximizes impact before Tornike returns?**

### Strategic Assessment:
The platform is technically superior to Lingwing.com (our main competitor). We have:
- More study modes (11 vs ~3)
- Better gamification (XP, streaks, achievements, leaderboard)
- Better SRS (SM-2 algorithm vs basic flashcards)
- Better content (142 decks, 65 grammar lessons, 35 podcasts, 30 games)
- Better design (dark/light mode, mobile responsive, PWA)

**But we have ZERO users.** The product doesn't matter if nobody knows about it.

### Remaining Gaps (prioritized by business impact):
1. **🔴 No marketing presence** — No social media, no SEO content, no Georgian language forums. We built a Ferrari but it's in the garage.
2. **🔴 No real payment** — Premium modal is UI-only. Can't make money until Stripe/BOG is integrated. But this needs Tornike's bank details.
3. **🟡 HEARTBEAT.md is stale** — Still references bugs that are all fixed. Needs update.
4. **🟡 Homepage SEO** — Meta descriptions could be better for Georgian search queries.
5. **🟢 Content depth** — Could always add more decks, grammar lessons, podcast episodes.

### Sprint Goals (Mar 8 Day)

1. **Update HEARTBEAT.md** — Remove fixed bugs, set new focus
2. **SEO & Meta optimization** — Improve Georgian-language meta tags for organic search
3. **Content quality pass** — Review a few pages for any remaining rough edges
4. **Prepare marketing brief** — What Tornike needs to do to launch (social media, Georgian forums, etc.)

### For Each Cron Today:
- **Cron 1 (Strategy, 11:30AM):** Sprint planning, HEARTBEAT update, marketing strategy. ← YOU ARE HERE
- **Cron 2 (Design, 1:30PM):** Final visual polish pass, screenshot all pages for marketing assets.
- **Cron 3 (Features, 3:30PM):** Content review, any remaining small improvements.
- **Cron 4 (Improvements, 5:30PM):** SEO meta optimization, performance verification.
- **Cron 5 (QA, 7:30PM):** Final comprehensive QA + launch readiness checklist.

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
