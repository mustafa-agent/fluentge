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

### Theme: "Polish, TTS & Launch Readiness"

### CONTEXT: Previous Sprint Results (Mar 7 Night — "Tornike's 8 Priorities")
All 8 of Tornike's Mar 6 priorities addressed:
1. ✅ Daily Goal → Card-Based — "~5 წთ" replaced with "10 ბარათი"
2. 🟡 TTS Voice Audit — **PARTIALLY DONE.** Audio files are 48kbps/24kHz MP3s (low quality). 16,207 files in `/audio/words/`. Components use mp3 first, fall back to browser speechSynthesis. **Need to assess if quality is "robotic" or acceptable.** Regenerating 16k files is a major effort — only do if clearly bad.
3. ✅ Deep Links — courses.astro + podcast.astro both link to `/flashcards/?deck=X`
4. ✅ Remove Mark-as-Done — All manual marking removed from grammar + phrases + dashboard
5. ✅ New Dashboard Tracking — 4 auto-tracked stat cards (grammar, cards, time, podcasts)
6. ✅ Grammar Lock/Unlock — Sequential progression with ≥70% test pass gate
7. ✅ Games Page Redesign — Game of the Day, 3 categories, record badges
8. ✅ Full Site Audit — QA passed, 0 issues, all 112 pages building clean

### Strategic State (Mar 7, 11:30 AM):
FluentGe has **72 React components, 10 study modes, 14 pages, 112 total pages, placement test, level personalization, course units with real quizzes, podcast quizzes + vocab + deep links, grammar sequential lock/unlock with test gates, cloud sync, full gamification (XP + streaks + achievements + leaderboard), PWA, games redesigned, 266KB bundle**.

**The platform is LAUNCH-READY.** All Tornike priorities done. All structural gaps filled. The product is more feature-rich than Lingwing.com and competitive with Duolingo for the Georgian market.

**What's left before launch:**

**Gap #1: TTS Voice Quality — Unknown.**
16,207 audio files at 48kbps/24kHz. Could be fine or could sound robotic. Need someone to actually LISTEN. This was Tornike's #2 priority. We should ask Tornike to listen to a few flashcards and tell us if the voices are OK. If not, we need a TTS regeneration plan (ElevenLabs or Google Cloud TTS).

**Gap #2: No real payment.**
Premium modal exists but just shows "coming soon" toast. Can't make money yet. Need Stripe or BOG/TBC integration. But this may not be critical for launch — can launch free-tier first and add payment later.

**Gap #3: Deep link verification untested.**
Links exist in code but haven't been browser-tested end-to-end. A user clicking "Numbers" in courses should land on the numbers deck in flashcards. Need to verify the `?deck=` parameter actually works in the deployed app.

**Gap #4: Mobile UX untested on real devices.**
Everything tested via desktop browser. Need real mobile testing (Tornike's phone).

**Gap #5: No marketing assets.**
No screenshots, no app store listing, no social media presence for FluentGe. Before launch, need at least a few promotional images and a sharing strategy.

### Sprint Goals (Mar 7 Night)

1. **🔴 TTS Assessment** (Cron 3)
   - Play sample audio files programmatically, assess quality
   - If clearly robotic: plan regeneration with better TTS
   - If acceptable: mark as done, move on

2. **🔴 End-to-End Deep Link Testing** (Cron 2 + 5)
   - Browser-test every course → flashcard link
   - Browser-test podcast → flashcard links
   - Fix any broken links

3. **🟡 Mobile Responsiveness Audit** (Cron 2)
   - Check all pages at mobile viewport (375px, 414px)
   - Fix any overflow, touch target, or layout issues

4. **🟡 Performance Optimization** (Cron 4)
   - Lighthouse audit on key pages
   - Fix any critical performance issues
   - Ensure fast load on Georgian mobile networks

5. **🟢 Marketing Assets Prep** (Cron 4)
   - Create 3-5 screenshots for social media
   - Write short Georgian description for sharing

### For Each Cron Tonight:
- **Cron 1 (Strategy, 1:00AM):** Sprint planning, competitive review, launch checklist.
- **Cron 2 (Design, 3:00AM):** Mobile responsiveness audit, deep link testing, any visual fixes.
- **Cron 3 (Features, 5:00AM):** TTS quality assessment, any feature gaps found.
- **Cron 4 (Improvements, 7:00AM):** Performance audit, marketing prep, polish.
- **Cron 5 (QA, 9:00AM):** Full end-to-end testing of all user flows.

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
