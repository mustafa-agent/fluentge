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

## What FluentGe Has (Current State — Mar 1)
- 14 Astro pages + 28 blog posts
- 142 flashcard deck JSON files with audio (EN + KA)
- 64 React components (13 games + study modes + UI)
- 65 grammar lessons (A1-C1) with interactive exercises + sound feedback
- 8 free grammar lessons (full A1) ✅
- Podcast section with audio
- Dashboard with progress tracking + "continue where you left off"
- Firebase auth (Google SSO + email)
- Light/dark mode (audited ✅)
- PWA support
- Premium/free tier system
- Phrases page (1,695 phrases, 40 categories)
- **6 study modes:** EN→KA, KA→EN, Mixed, Free, Quiz (multiple choice), Typing ✅
- **Difficult Words** — tracks errors, focused review mode ✅
- **Word Search** — search across all 142 decks ✅
- Session summary after flashcard practice ✅
- Onboarding CTA on homepage ✅
- Grammar ↔ Flashcard interconnection ✅
- **Streak system** 🔥 with fire animation ✅
- **XP system** ⭐ with levels + floating animations ✅
- **Daily goal** progress tracking ✅
- **Learning path** (10-step beginner roadmap) ✅
- **Navbar gamification** (streak + XP badges) ✅
- **Achievements** — 10 milestone badges ✅
- ⚠️ **Bundle size: 6.6MB** (single chunk, no code splitting)

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
│   ├── src/components/ # 61 components
│   ├── src/lib/       # cards.ts, firebase, storage
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

## 🎯 Current Sprint (Mar 4 Day Cycle)

### Theme: "Daily Lessons & Social Motivation"

### CONTEXT: Previous Sprint Results (Mar 4 Night)
- ✅ Sentence Builder — word tile ordering exercise, Duolingo-style
- ✅ Listening Exercise — hear English, pick Georgian from 4 options
- ✅ Mobile Bottom Navigation — frosted glass 5-tab bar on mobile
- ✅ PWA Install Banner — manifest + service worker + install prompt
- ✅ 7-Day Activity Chart — dual bar chart on dashboard
- ✅ Vocabulary Size Tracker — SVG progress ring on dashboard
- ✅ Recommended For You — smart 3-card recommendation section

### Strategic State (Mar 4, midday):
FluentGe is **feature-rich with 8 study modes** including sentence builder + listening. 67 components, 127 decks, 65 grammar lessons, 30 games. Mobile bottom nav, PWA, SM-2 SRS, onboarding, gamification (XP/streaks/achievements). 236KB main bundle. All 26,595 cards have example sentences.

**The #1 gap vs Duolingo: NO DAILY LESSON.**
- Duolingo's magic: open app → one button "Start" → app decides what you learn
- FluentGe: open app → wall of decks → user must choose → friction → dropout
- A "Daily Lesson" that auto-generates a mixed 5-min session (new words + SRS reviews + sentence exercises + listening) would be THE highest-impact feature for retention
- This is what separates a "tool" from an "app"

**The #2 gap: NO SOCIAL MOTIVATION.**
- Duolingo leaderboards drive 30%+ of engagement
- Even a localStorage-based leaderboard with simulated users would add competitive motivation
- Weekly XP leaderboard is simple to implement

**The #3 gap: CLOUDFLARE DEPLOY RELIABILITY.**
- Stale hash bug has occurred 3 times. Timestamp fix isn't bulletproof.
- Need UUID-based cache busting for permanent fix.

### Sprint Goals (ordered by priority)

1. **🔴 Daily Lesson / Mixed Practice** — Auto-generated daily session:
   - One "დღის გაკვეთილი" (Daily Lesson) button on homepage + flashcard home
   - Generates a 10-round mixed session: 3 new vocab (flashcard), 3 SRS reviews, 2 sentence builders, 2 listening exercises
   - Uses Top 2000 deck by default (or user's active deck)
   - Session tracks correct/wrong, awards XP, updates streak
   - Shows session summary at end (reuse existing summary component)
   - New component: `DailyLesson.tsx`
   - This should be the FIRST thing users see and tap

2. **🔴 Weekly Leaderboard** — Social motivation engine:
   - Show top 10 "learners this week" on dashboard
   - Mix real user data (from localStorage) with 8-9 simulated Georgian names
   - Simulated users have realistic XP (randomized weekly)
   - Current user always appears, highlighted
   - Updates weekly (reset every Monday)
   - Feels real even with 1 user — creates competitive drive

3. **🟡 Cloudflare Deploy Fix** — UUID cache busting:
   - Replace timestamp with `crypto.randomUUID()` in deploy script
   - Add Cloudflare cache purge API call after deploy
   - Test with rapid successive deploys

4. **🟡 Fill-in-the-Blank Exercise** — Context-based vocab:
   - Show English sentence with one word blanked → user picks from 4 options
   - Uses `example_en` sentences from cards
   - 9th study mode: "შეავსე" (Fill in)
   - Easier than sentence builder, good for beginners

5. **🟢 Grammar-Flashcard XP Bridge** — Unify gamification:
   - Grammar exercises (Astro pages) should award XP to same localStorage
   - Grammar completion should update streak
   - This makes the entire platform feel unified

### For Each Cron Today:
- **Cron 1 (Strategy, 11:30AM):** ← THIS RUN. Sprint planning, specs, context file updates.
- **Cron 2 (Design, 3:00PM):** Design Daily Lesson flow (session screen, round types, transitions). Leaderboard UI.
- **Cron 3 (Features, 5:00PM):** Build DailyLesson.tsx + Leaderboard.tsx components.
- **Cron 4 (Improvements, 7:00PM):** Fill-in-blank exercise + Grammar XP bridge + deploy fix.
- **Cron 5 (QA, 9:00PM):** Full QA. Test daily lesson end-to-end. Deploy verification.

## Technical Specs

### Daily Lesson (Cron 3)
**Location:** New `DailyLesson.tsx` in flashcard-app/src/components/

```tsx
// DailyLesson.tsx — Mixed practice session generator
// 
// Session structure (10 rounds):
// Rounds 1-3: New vocabulary (flashcard with flip + rate)
//   - Pick 3 cards user hasn't seen (no SRS data) from active deck
//   - Show english ↔ georgian flashcard, user rates (know/don't know)
// Rounds 4-6: SRS Review (if due cards exist, else more new vocab)
//   - Pull 3 due cards from srs-engine.ts
//   - SM-2 rating buttons (Again/Hard/Good/Easy)
// Rounds 7-8: Sentence Builder
//   - Pick 2 cards with good example_en sentences (5+ words)
//   - Reuse SentenceBuilder logic (word tile ordering)
// Rounds 9-10: Listening
//   - Pick 2 cards, play audio, 4 Georgian options
//   - Reuse ListeningExercise logic
//
// UI: Progress bar at top (1/10), round type indicator icon
// Between rounds: smooth transition (slide left)
// End: Session summary with total XP, accuracy, time
// XP: +10 per correct vocab, +15 sentence, +10 listening
//
// Entry points:
// 1. Big CTA on DeckSelect (above everything else)
// 2. Homepage hero section
// 3. Dashboard "recommended" section
```

### Weekly Leaderboard (Cron 3)
**Location:** New `Leaderboard.tsx` in flashcard-app/src/components/

```tsx
// Leaderboard.tsx — Weekly XP ranking
//
// Data structure in localStorage:
// 'fluentge-leaderboard': { weekStart: 'YYYY-MM-DD', users: [...] }
//
// On first load each week (or if weekStart is old):
// 1. Generate 9 simulated users with Georgian names
//    Names: ნიკა, მარიამი, გიორგი, ანა, დავითი, თამარი, ლუკა, ნინო, ალექსი
//    XP: random 50-500, distributed realistically
// 2. Add current user (name from Firebase or "შენ") with actual weekly XP
// 3. Sort by XP descending
// 4. Store in localStorage
//
// On subsequent loads same week:
// 1. Update current user's XP from actual data
// 2. Re-sort
// 3. Simulated users gain 5-20 XP per day (checked daily)
//
// UI: Ranked list, top 3 get 🥇🥈🥉, current user highlighted
// Placed on Dashboard below activity chart
```

### Fill-in-the-Blank (Cron 4)
**Location:** New `FillBlankExercise.tsx` in flashcard-app/src/components/
(Note: existing FillBlank.tsx is a game — this is a study mode)

```tsx
// FillBlankExercise.tsx — Contextual vocabulary exercise
// 1. Pick card with example_en sentence
// 2. Blank out the target word (card.english) from the sentence
// 3. Show sentence with "___" + 4 options (correct + 3 random from deck)
// 4. Show Georgian translation as hint
// 5. +10 XP correct, show full sentence on reveal
// Mode: 'fillin' in DeckSelect
```

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Build script now auto-removes audio from dist (`npm run deploy`)
- ⚠️ Deploy: use `crypto.randomUUID()` instead of timestamp for index.html cache busting
