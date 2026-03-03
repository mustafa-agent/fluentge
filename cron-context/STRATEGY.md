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

## 🎯 Current Sprint (Mar 4 Night Cycle)

### Theme: "Sentence Exercises & Mobile Polish"

### CONTEXT: Previous Sprint Results
- ✅ Onboarding flow — 3-step modal, path selection, daily goal
- ✅ SM-2 spaced repetition — real algorithm with due dates, 4-button rating
- ✅ Content audit — 473 duplicates removed
- ✅ Homepage CTA — direct flow to Top 2000
- ✅ Review reminder banners
- ✅ Georgian text: last "სტრიკ" instances fixed → "სერია"

### Strategic State (Mar 4):
FluentGe is **feature-rich MVP** with onboarding, SM-2, gamification, 66 components, 127 decks, 65 grammar lessons, 30 games, 6 study modes. Cloud sync active via Firebase.

**The #1 gap vs Duolingo: SENTENCE-LEVEL EXERCISES.**
- We teach words in isolation. Duolingo teaches words IN CONTEXT.
- Sentence ordering ("put these words in order") = best exercise for grammar + vocab
- Listening comprehension ("hear English, pick Georgian") = key skill
- Fill-in-the-blank sentences = contextual vocabulary

**The #2 gap: MOBILE EXPERIENCE.**
- No bottom navigation bar on mobile — feels like a website, not an app
- Navigation requires hamburger menu → extra taps → friction
- PWA install prompt not prominent

### Sprint Goals (ordered by priority)

1. **🔴 Sentence Builder Exercise** — New exercise type:
   - Show Georgian sentence → user arranges English word tiles in correct order
   - Pull from existing deck example sentences (many cards have `example` field)
   - Start with Top 2000 deck's examples (most content)
   - Scoring: XP for correct, show correct answer on wrong
   - Accessible from deck study modes (7th mode: "წინადადება")
   - This is Duolingo's #1 exercise type

2. **🔴 Listening Exercise** — New exercise type:
   - Play English audio → show 4 Georgian options → pick correct one
   - Uses existing TTS audio files in `public/flashcards/audio/words/`
   - Accessible from deck study modes (8th mode: "მოსმენა")
   - Combines vocabulary + listening skill

3. **🟡 Mobile Bottom Navigation** — App-like mobile UX:
   - Fixed bottom bar on mobile: 🏠 Home, 📚 Words, 📖 Grammar, 🎮 Games, 👤 Profile
   - Only on mobile (<768px)
   - Active tab highlighted
   - Replace hamburger menu dependency for core navigation
   - Both in Astro pages (website) and React (flashcard app)

4. **🟡 PWA Install Banner** — Drive app installs:
   - Show "Add to Home Screen" banner for mobile users (not yet installed)
   - Explain benefits: "offline access, faster loading"
   - Dismissible, shows once per week
   - Uses `beforeinstallprompt` event

5. **🟢 Progress Chart on Dashboard** — Visual motivation:
   - Simple line/bar chart showing words learned per day (last 7 days)
   - Use lightweight canvas or CSS-only bars (no chart library)
   - Data from localStorage daily activity tracking

### For Each Cron Tonight:
- **Cron 1 (Strategy, 1:00AM):** ← THIS RUN. Sprint planning, specs, context file updates.
- **Cron 2 (Design, 3:00AM):** Design sentence builder UI (word tiles, drag/tap), listening exercise UI, mobile bottom nav.
- **Cron 3 (Features, 5:00AM):** Build SentenceBuilder.tsx + ListeningExercise.tsx components.
- **Cron 4 (Improvements, 7:00AM):** Mobile bottom nav + PWA install banner + progress chart.
- **Cron 5 (QA, 9:00AM):** Full QA. Test new exercises. Mobile screenshots. Deploy verification.

## Technical Specs

### Sentence Builder (Cron 3)
**Location:** New `SentenceBuilder.tsx` in flashcard-app/src/components/

```tsx
// SentenceBuilder.tsx
// 1. Filter deck cards that have non-empty `example` field
// 2. Split example English sentence into word tokens
// 3. Shuffle tokens, display as tappable tiles
// 4. User taps tiles in order to build sentence
// 5. Check against correct order
// 6. Show Georgian translation + audio on reveal
// Rating: +15 XP correct, show correct if wrong
// Visual: word tiles in a "bank" area, assembled sentence above
// Mode accessible from DeckSelect as mode "sentence"
```

**Data source:** Each card in deck JSONs has structure like:
```json
{ "english": "benefit", "georgian": "სარგებელი", "example": "Exercise has many benefits." }
```
Filter to cards where `example` exists and has 3+ words.

### Listening Exercise (Cron 3)
**Location:** New `ListeningExercise.tsx` in flashcard-app/src/components/

```tsx
// ListeningExercise.tsx
// 1. Pick a card from deck
// 2. Play English audio (using existing speakWord/audio files)
// 3. Show 4 Georgian options (1 correct + 3 random from same deck)
// 4. User picks answer
// 5. Green/red feedback, +10 XP correct
// Visual: big 🔊 button, 4 option cards below
// Mode accessible from DeckSelect as mode "listening"
```

### Mobile Bottom Nav (Cron 4)
**Website (Astro):** Add `<nav class="mobile-bottom-nav">` to Layout.astro, fixed bottom, 5 tabs.
**Flashcard App (React):** Add `<BottomNav />` component to App.tsx, links to flashcard sections + external pages.
CSS: `@media (max-width: 767px)` only. Add `pb-16` to body on mobile to prevent content overlap.

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Build script now auto-removes audio from dist (`npm run deploy`)
