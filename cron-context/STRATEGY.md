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
- **12 study modes:** EN→KA, KA→EN, Mixed, SRS, Quiz, Typing, Sentence Builder, Listening, Fill-in-Blank, Reading Comprehension, Speaking, Writing ✅
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

## 🎯 Current Sprint (Mar 11 Night Cycle)

### Theme: "Polish & Grow" — Tornike said KEEP WORKING!

### Strategic State (Mar 11):
FluentGe has **72+ React components, 11 study modes, 113 pages, 267KB bundle**. Platform is stable. Now IMPROVE it while we wait for payment/domain decisions.

**✅ STABILITY HOLD ENDED. Tornike said "Keep working." Build, improve, polish!**

### Still Needs Tornike (but don't block on it):
1. **💳 Payment integration** — Need his bank details
2. **🌐 Domain** — fluentge.ge or fluentge.com
3. **🚀 Launch strategy** — Soft launch plan ready

### Sprint Priorities:
1. **Better homepage** — hero section, social proof, clear CTA
2. **Premium page polish** — pricing presentation, FAQ, comparison
3. **Profile page** — user stats, avatar, settings
4. **Writing exercises** — new study mode
5. **Game improvements** — difficulty levels, score tracking
6. **Content expansion** — more decks, IELTS prep

### For Each Cron Tonight:
- **Cron 1 (Strategy, 1:00AM):** Sprint planning, competitive analysis
- **Cron 2 (Design, 3:00AM):** Homepage hero redesign, premium page polish
- **Cron 3 (Features, 5:00AM):** Build 2 new features from backlog
- **Cron 4 (Improvements, 7:00AM):** Pick 2 UX improvements
- **Cron 5 (QA, 9:00AM):** Test everything, fix any bugs

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
