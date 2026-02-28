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
- Dashboard with progress tracking + "continue where you left off"
- Firebase auth (Google SSO + email)
- Light/dark mode
- PWA support
- Premium/free tier system
- Phrases page (1,695 phrases, 40 categories)
- Session summary after flashcard practice ✅
- Onboarding CTA on homepage ✅
- Grammar ↔ Flashcard interconnection ✅

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

### Theme: "Retention & Habit Formation"
Last sprint built first impressions. Now we build the habit loop: come back → learn → feel progress → earn rewards → come back again.

### Sprint Goals (ordered by priority)

1. **🔴 Streak System** — Track daily learning streaks in localStorage. Show streak count on dashboard + navbar. This is THE #1 retention lever. Duolingo proved streaks = retention. Show 🔥 streak badge. Streak breaks after 24h of no activity. Even a simple implementation is huge.

2. **🔴 XP System** — Earn XP for every action: complete a flashcard session (+20 XP), finish grammar lesson (+50 XP), play a game (+15 XP), learn phrases (+10 XP). Show daily XP on dashboard. This gives every action a tangible reward. Store in localStorage.

3. **🔴 Daily Goal** — Let users set a daily target (10, 20, or 50 words). Show progress bar toward daily goal on dashboard. Simple but powerful — "I'm 15/20 today, let me do 5 more."

4. **🟡 Light Mode Audit** — Carried over from last sprint. Check ALL pages (grammar, games, podcast, phrases, premium, about) in light mode. Fix any unreadable text or invisible elements.

5. **🟡 Learning Path** — Add a structured beginner path: "Week 1: Greetings + To Be → Week 2: Family + Articles → Week 3: Food + Plural Nouns". Show on dashboard as a roadmap. Guides new users instead of letting them wander.

6. **🟢 Performance** — The flashcard app bundle is 6.4MB. Investigate lazy loading, code splitting. Even basic improvements help mobile users in Georgia (slow connections).

### For Each Cron Tonight:
- **Cron 2 (Design, 3AM):** Light mode audit on ALL pages. Fix issues. Also: design the streak/XP visual components (🔥 badge, XP counter, daily goal progress bar) so they're ready for Cron 3.
- **Cron 3 (Features, 5AM):** Build streak system + XP system + daily goal. These are the core retention features. Implement in both flashcard app (React) and website pages (Astro). Store in localStorage.
- **Cron 4 (Improvements, 7AM):** Learning path on dashboard. Show streak + XP in navbar. Polish the habit loop.
- **Cron 5 (QA, 9AM):** Full test of all pages, verify streak/XP work, check mobile, light mode, verify builds.

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Remove `dist/flashcards/audio/words/` before deploying (16k files hit 20k limit)
