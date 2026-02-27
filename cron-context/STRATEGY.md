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
- **Lingwing.com:** Our closest competitor for Georgian market — study their UX
- **Anki:** Best spaced repetition algorithm

## What FluentGe Has (Current State)
- 45 Astro pages, 27 blog posts
- 127 flashcard decks with audio (EN + KA)
- 60+ game components
- Grammar lessons system
- Podcast section with audio
- Dashboard with progress tracking
- Firebase auth (Google SSO + email)
- Light/dark mode
- PWA support
- Premium/free tier system

## Key Priorities (Ordered)
1. Everything must WORK — no broken pages, no crashes
2. Design must be consistent and professional across ALL pages
3. Flashcard experience must rival Memrise/Anki
4. Dashboard must motivate users (XP, streaks, achievements)
5. Sections must interconnect (grammar lesson → practice flashcards → quiz)
6. Podcasts must be genuinely useful for learning
7. Games must be fun AND educational

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
│   ├── src/components/ # 60+ components
│   ├── src/lib/       # cards.ts, firebase, storage
│   └── content/       # 127 JSON deck files
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

## Current Sprint Goals
(Updated by Cron 1 — Strategy)
- [ ] Ensure all pages work without errors
- [ ] Standardize design across site
- [ ] Improve flashcard UX to Memrise level
- [ ] Make dashboard motivating and useful
- [ ] Connect sections (grammar → flashcards → games)

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
