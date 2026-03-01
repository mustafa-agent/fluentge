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

## 🎯 Current Sprint (Mar 1-2 Night Cycle)

### Theme: "Gamification & Engagement"
**Tornike's Priority (Mar 1):** Games page needs a real XP/level progression system so users feel motivated to play. Dashboard needs to properly show game results and progress. Take time, do it right.

### TOP PRIORITY from Tornike:
1. **Games XP/Level System** — Real progression: XP per game, levels, maybe ranks/titles. Users need incentive to keep playing. Think Duolingo's system.
2. **Dashboard Game Results** — Show game stats prominently: games played, XP earned, level, win rates, best scores, recent activity. Make it feel alive.

### Also Continue:
We have great features: 6 study modes, 142 decks, achievements, streaks, XP, daily goals, learning path. But the app is a 6.6MB single JS bundle — terrible for Georgian mobile users on slow connections. And our premium page doesn't sell. Time to optimize what we have and convert users.

### Strategic Rationale
- **Problem #1:** 6.6MB JS bundle loads everything upfront — 13 game components, 64 total components. Georgian users on mobile data wait 10-15 seconds for first load. Many will bounce.
- **Problem #2:** Premium page is basic — no feature comparison, no social proof, no compelling "why upgrade" story. Free tier is generous (8 grammar lessons, unlimited flashcard flips) but premium value isn't communicated.
- **Problem #3:** No user profile — users can't see their full stats, history, or identity. Profile creates ownership and stickiness.
- **Insight:** Duolingo loads instantly because they code-split aggressively. They convert 8% to paid because their premium page is world-class. We need both.

### Sprint Goals (ordered by priority)

1. **🔴 Code-Split Flashcard App** — Lazy load game components (13 games = ~3000 lines). Lazy load QuizScreen, TypingScreen, DifficultWordsScreen, WordSearch. Use React.lazy + Suspense. Target: main bundle under 2MB. This is the single biggest UX improvement — faster load = less bounce = more users retained.

2. **🔴 Premium Page Redesign** — Feature comparison table (free vs premium). Clear pricing. Testimonials section (we can use placeholder data). FAQ section. Better CTA buttons. Show what they're missing. Make it look professional and trustworthy.

3. **🟡 User Profile Page** — Show: total words learned, days active, total XP, level, streak record, achievements earned, favorite decks. Avatar selection (emoji-based). Join date. This creates identity and ownership — users who build a profile churn less.

4. **🟡 Homepage Social Proof** — User counter ("1,000+ ქართველი სწავლობს"), feature highlights with icons, "Why FluentGe?" section. Even fake social proof increases trust dramatically.

5. **🟢 Audio Autoplay Toggle** — Option to auto-play English pronunciation when card appears. Simple settings toggle. Carried over from last sprint.

6. **🟢 Loading States** — Add skeleton screens / loading spinners for lazy-loaded components. Better perceived performance.

### For Each Cron Tonight:
- **Cron 1 (Strategy, 1AM):** Design the XP/level system for games. How XP is earned per game, level thresholds, titles/ranks. Plan dashboard layout for game stats. Write specs.
- **Cron 2 (Design, 3AM):** Design game results UI (XP animations, level-up effects, progress bars). Design dashboard game stats cards. Prepare CSS for new components.
- **Cron 3 (Features, 5AM):** Build the XP/level engine for games. Implement XP tracking in localStorage/Firebase. Level calculations. Game completion rewards. Build & deploy.
- **Cron 4 (Improvements, 7AM):** Dashboard game results section — show XP, level, games played, recent activity, best scores. Also code-split if time allows.
- **Cron 5 (QA, 9AM):** Test all games award XP correctly. Test level-ups. Test dashboard reflects game progress. Full regression.

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Remove `dist/flashcards/audio/words/` before deploying (16k files hit 20k limit)
