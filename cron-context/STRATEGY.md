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

## What FluentGe Has (Current State — Feb 28)
- 14 Astro pages + 28 blog posts
- 142 flashcard deck JSON files with audio (EN + KA)
- 61 game/flashcard components
- Grammar lessons (A1 free: to-be, articles, plural-nouns; rest premium-gated)
- Podcast section with audio
- Dashboard with progress tracking
- Firebase auth (Google SSO + email)
- Light/dark mode
- PWA support
- Premium/free tier system
- Phrases page (1,695 phrases, 40 categories)

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

## 🎯 Current Sprint (Feb 28 Night Cycle)

### Theme: "First Impressions & Core Loop"
A new user should: Land → Understand value → Start learning → Feel progress → Come back.

### Sprint Goals (ordered by priority)

1. **🔴 Onboarding Flow** — When a new user visits, guide them to START learning immediately. Currently there's no "where do I begin?" path. Add a clear learning path suggestion or placement test.

2. **🔴 Flashcard Session Summary** — After a practice session, show words learned, accuracy, time. This is the core dopamine loop (Duolingo does this perfectly).

3. **🔴 Homepage "Word of the Day" fix** — Currently hardcoded 75+ words in index.astro (472 lines!). Extract to a JSON file, pick truly random daily word. Keep homepage clean.

4. **🟡 Dashboard Motivation** — Add streak counter, XP earned today, and "continue where you left off" to dashboard. Even if basic, it creates return visits.

5. **🟡 Section Interconnection** — After grammar lesson, suggest flashcard deck. After flashcard session, suggest a game. This keeps users in the learning loop.

6. **🟢 Design Consistency Audit** — Ensure all pages look cohesive in both light/dark mode.

### For Each Cron Tonight:
- **Cron 2 (Design, 3AM):** Focus on homepage cleanup, "word of day" extraction, light/dark mode audit
- **Cron 3 (Features, 5AM):** Build flashcard session summary + basic onboarding CTA
- **Cron 4 (Improvements, 7AM):** Section interconnection + dashboard motivation
- **Cron 5 (QA, 9AM):** Full test of all pages, verify builds, check mobile

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
