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

## 🎯 Current Sprint (Mar 5 Night Cycle)

### Theme: "Platform Unity & Persistence"

### CONTEXT: Previous Sprint Results (Mar 4)
- ✅ Daily Lesson — 10-round mixed practice (vocab + SRS + sentence + listening)
- ✅ Weekly Leaderboard — simulated Georgian users + real XP ranking
- ✅ Fill-in-the-Blank — 9th study mode, contextual vocabulary
- ✅ UUID Deploy Fix — permanent Cloudflare cache busting with uuidgen
- ❌ Grammar XP Bridge — NOT completed (carried over)

### Strategic State (Mar 5, 1:00 AM):
FluentGe has **70 React components, 9 study modes, Daily Lesson, Weekly Leaderboard, SM-2 SRS, onboarding, PWA, mobile bottom nav, full gamification**. 258KB main bundle. We comprehensively beat Lingwing.com on features and are competitive with Duolingo in breadth.

**The #1 gap: PLATFORM FEELS SPLIT.**
- Flashcard app = fully gamified (XP, streaks, levels, achievements, leaderboard)
- Grammar = static Astro pages with NO XP, NO streak updates, NO progression
- Users do grammar and get NOTHING. No reward. No motivation to continue.
- Fix: Grammar XP Bridge — make grammar exercises award XP + update streak

**The #2 gap: ALL PROGRESS IN localStorage = FRAGILE.**
- One browser clear / device switch = ALL progress GONE forever
- Firebase auth already works — Firestore sync is the natural next step
- Users who lose weeks of progress never come back
- This is the single biggest retention risk

**The #3 gap: HOMEPAGE NOT PERSONALIZED FOR RETURNING USERS.**
- New and returning users see identical generic hero
- Should show: "Welcome back! Continue daily lesson" + stats + SRS due count
- Duolingo's homepage IS the daily lesson for returning users

**The #4 gap: SRS REMINDERS ONLY ON /flashcards/.**
- Due card banners don't appear on homepage, grammar, or games pages
- Should pull users back to reviews from ANYWHERE on the site

### Sprint Goals (ordered by priority)

1. **🔴 Grammar XP Bridge** — Unify platform gamification (CARRIED OVER × 2):
   - Grammar exercises (Astro pages) award XP to same localStorage keys
   - Grammar completion updates streak + daily goal study time
   - Show floating "+10 XP" on correct answer
   - Mark lessons completed, show on Dashboard
   - Extract gamification functions to standalone `public/js/gamification-bridge.js`
   - This file reads/writes SAME localStorage keys as React app

2. **🔴 Cloud Sync (Firestore)** — Persist user progress forever:
   - New `sync.ts` module in flashcard-app/src/lib/
   - Save progress to Firestore: `users/{uid}/data`
   - Debounced writes (every 30s or on page unload)
   - Load + merge on login (keep newer timestamps)
   - Keys: fluentge_progress, fluentge-srs-*, totalXP, currentStreak, etc.
   - Offline-first: localStorage = source of truth, Firestore = backup

3. **🟡 Homepage Personalization** — Different UX for returning users:
   - Logged in + has progress → personalized greeting + Daily Lesson CTA + stats
   - SRS due cards → amber reminder banner
   - "Continue where you left off" replaces generic hero
   - New users → keep current hero (it's good)

4. **🟡 Cross-Page SRS Reminders** — Pull users to reviews from anywhere:
   - Small amber banner on ALL pages (homepage, grammar, games) when SRS cards due
   - Shows count + direct link to SRS mode
   - Non-intrusive but visible

5. **🟢 Reading Comprehension Mode** — 10th study mode:
   - Short English paragraphs using deck vocabulary
   - Comprehension questions with multiple choice
   - +15 XP per correct
   - Deeper learning than single-word exercises

### For Each Cron Tonight:
- **Cron 1 (Strategy, 1:00AM):** ← THIS RUN. Sprint planning, specs, context file updates.
- **Cron 2 (Design, 3:00AM):** Design personalized homepage states. Grammar XP feedback animations. Sync loading/saving UI states. Cross-page SRS banner.
- **Cron 3 (Features, 5:00AM):** Build Grammar XP Bridge (gamification-bridge.js) + Cloud Sync (sync.ts + Firestore).
- **Cron 4 (Improvements, 7:00AM):** Homepage personalization + Cross-page SRS banners + Reading Comprehension mode.
- **Cron 5 (QA, 9:00AM):** Full QA. Test grammar XP, cloud sync, personalized homepage.

## Technical Specs

### Grammar XP Bridge (Cron 3)
**Approach:** Grammar pages are Astro (server-rendered). They need client-side JS to interact with localStorage gamification.

**File:** `website/public/js/gamification-bridge.js` — standalone, no bundler needed

```js
// gamification-bridge.js — Lightweight gamification for non-React pages
// 
// Functions (mirror flashcard-app gamification.ts logic):
//   addXP(amount) — adds XP, checks level-up, records daily history
//   updateStreak() — updates streak if not already today
//   addStudyTime(minutes) — adds to daily goal progress
//   markGrammarComplete(slug) — stores in 'fluentge-grammar-completed'
//   showXPFloat(element, amount) — creates floating +XP animation
//   getStats() — returns { totalXP, currentStreak, level, dailyMinutes }
//
// Reads/writes SAME localStorage keys as React app:
//   totalXP, currentStreak, streakLastDate, dailyStudyTime, etc.
//
// Usage in grammar [slug].astro:
//   <script src="/js/gamification-bridge.js"></script>
//   <script>
//     document.querySelectorAll('.exercise-check').forEach(btn => {
//       btn.addEventListener('click', () => {
//         if (isCorrect) { FluentGe.addXP(10); FluentGe.showXPFloat(btn, 10); }
//       });
//     });
//     // On lesson complete:
//     FluentGe.markGrammarComplete('present-simple');
//     FluentGe.addXP(50); // bonus
//   </script>
```

### Cloud Sync — Firestore (Cron 3)
**Location:** New `sync.ts` in flashcard-app/src/lib/

```ts
// sync.ts — Firestore progress sync
//
// SAVE (debounced, every 30s + on beforeunload):
//   1. Collect all fluentge-* localStorage keys
//   2. Write to Firestore: users/{uid}/data { ...allKeys, lastSync: timestamp }
//   3. Use setDoc with merge:true to avoid overwriting
//
// LOAD (on Firebase auth state change — login detected):
//   1. Fetch users/{uid}/data from Firestore
//   2. For each key: compare timestamps, keep newer
//   3. Write merged result back to localStorage
//   4. Show "✅ სინქრონიზაცია დასრულდა" toast
//
// KEYS TO SYNC:
//   fluentge_progress, fluentge-srs-*, totalXP, currentStreak, 
//   streakLastDate, dailyGoal, dailyStudyTime, gamesPlayed,
//   fluentge-grammar-completed, fluentge-achievements,
//   fluentge-leaderboard, fluentge-weekly-xp-*
//
// Firebase config already in firebase.ts — add Firestore import:
//   import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
```

### Homepage Personalization (Cron 4)
**Location:** Modify `website/src/pages/index.astro`

```html
<!-- Add client-side script at bottom of page -->
<script>
  // Check if user has progress
  const xp = parseInt(localStorage.getItem('totalXP') || '0');
  const streak = parseInt(localStorage.getItem('currentStreak') || '0');
  if (xp > 0) {
    // Hide generic hero, show personalized section
    document.getElementById('hero-new').style.display = 'none';
    document.getElementById('hero-returning').style.display = 'block';
    // Populate stats
    document.getElementById('user-xp').textContent = xp;
    document.getElementById('user-streak').textContent = streak;
  }
  // Check SRS due cards
  // Show reminder banner if any
</script>
```

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Build script now auto-removes audio from dist (`npm run deploy`)
- ⚠️ Deploy: uses `uuidgen` for index.html cache busting (permanent fix)
