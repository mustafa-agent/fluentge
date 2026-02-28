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
- 61 game/flashcard components
- 65 grammar lessons (A1-C1) with interactive exercises + sound feedback
- Podcast section with audio
- Dashboard with progress tracking + "continue where you left off"
- Firebase auth (Google SSO + email)
- Light/dark mode (audited ✅)
- PWA support
- Premium/free tier system
- Phrases page (1,695 phrases, 40 categories)
- Session summary after flashcard practice ✅
- Onboarding CTA on homepage ✅
- Grammar ↔ Flashcard interconnection ✅
- **Streak system** 🔥 with fire animation ✅
- **XP system** ⭐ with levels + floating animations ✅
- **Daily goal** progress tracking ✅
- **Learning path** (10-step beginner roadmap) ✅
- **Navbar gamification** (streak + XP badges) ✅

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

## 🎯 Current Sprint (Mar 1 Night Cycle)

### Theme: "Active Learning & Depth"
We built habit loops (streak/XP/goals). Now we make the learning itself deeper and more interactive. Passive flashcard flipping isn't enough — users need active recall, typing, quizzes.

### Strategic Rationale
- **Problem:** Flashcards are flip-only (passive). Users see the answer, self-grade. No active recall.
- **Insight:** Duolingo's entire learning model is active: type the answer, pick from options, arrange words. This is what makes learning stick.
- **Goal:** Add multiple study modes to flashcards + make the free tier more generous to hook users.

### Sprint Goals (ordered by priority)

1. **🔴 Quiz Mode for Flashcards** — Multiple-choice quiz: show English word, pick correct Georgian from 4 options (or vice versa). This is the single biggest engagement upgrade. Users currently just flip cards. Quiz mode = active recall = better learning = more engagement. Build as a new study mode selectable from deck screen.

2. **🔴 Typing Mode for Flashcards** — Show Georgian word, user types the English translation. Check answer (case-insensitive, trim whitespace). Show correct/wrong with the right answer. This is hard mode = deepest learning. Award more XP (+25 per correct).

3. **🔴 Expand Free Grammar** — Currently only 3 free lessons (to-be, articles, plural-nouns). Too little. Users hit paywall before getting hooked. Expand to 8 free lessons: add present-simple, present-continuous, subject-pronouns, possessive-adjectives, prepositions-of-place. This gives users a full A1 experience before asking them to pay.

4. **🟡 Achievements System** — Badges for milestones: "First Steps" (complete 1 deck), "Word Collector" (learn 100 words), "Week Warrior" (7-day streak), "Grammar Guru" (complete 5 grammar lessons), "Quiz Master" (100% on a quiz). Show on dashboard. Visual rewards beyond XP.

5. **🟡 Pronunciation Audio Autoplay** — Option to auto-play English audio when card appears (before flip). Users hear the word as they see it. Toggle in settings. Currently audio exists but requires manual tap.

6. **🟢 Performance** — The flashcard app bundle is ~6.4MB. Lazy load game components. Code-split deck content. Even basic improvements help mobile users in Georgia.

### For Each Cron Tonight:
- **Cron 2 (Design, 3AM):** Design quiz mode UI (multiple choice cards, correct/wrong states, results screen). Design typing mode input UI. Design achievement badges (icons, colors, unlock animations). Prepare CSS.
- **Cron 3 (Features, 5AM):** Build Quiz Mode + Typing Mode as new study options in the flashcard app. Add mode selector to deck screen. Integrate XP awards.
- **Cron 4 (Improvements, 7AM):** Expand free grammar to 8 lessons. Build Achievements system. Audio autoplay toggle.
- **Cron 5 (QA, 9AM):** Full test of quiz/typing modes, verify achievements, test free grammar expansion, mobile test, build/deploy verification.

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Remove `dist/flashcards/audio/words/` before deploying (16k files hit 20k limit)
