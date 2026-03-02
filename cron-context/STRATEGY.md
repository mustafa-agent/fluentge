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

## 🎯 Current Sprint (Mar 3 Night Cycle)

### Theme: "Onboarding & Retention Engine"

### CONTEXT: ALL Tornike's Mar 2 priorities are DONE ✅
1. ✅ **Top 2000 Words — special category** — Hero card, free, visually distinct
2. ✅ **Design improvements** — 3D buttons, consistent styling, premium page redesign
3. ✅ **Georgian translation review** — Full audit completed, natural Georgian
4. ✅ **Bug hunting** — Critical blank page bug found & fixed, deploy script hardened
5. ✅ **Games XP/Level system** — All 30 games award XP, stats bar, level-up popup
6. ✅ **Dashboard game results** — 4 gradient stat cards, XP progress bar
7. ✅ **Dark mode contrast fix** — Full light/dark mode audit

### Strategic State (Mar 3):
FluentGe is **feature-complete for MVP**. 65 components, 73 decks, 65 grammar lessons, 30 games, 6 study modes, XP/streaks/achievements, 236KB bundle. We beat Lingwing.com on features.

**The gaps are now USER JOURNEY gaps:**
- A new user lands → sees deck list → no guidance → bounces
- A returning user has no reason to come back daily (no smart review scheduling)
- Card content quality unchecked — 5000+ cards, are translations correct?

**What Duolingo does that we don't:**
1. **30-second onboarding** — pick level, set goal, start lesson immediately
2. **Smart review** — SM-2 algorithm schedules reviews at optimal intervals
3. **Sentence exercises** — not just vocabulary, but sentence construction
4. **Push to return** — streak freeze, notifications, friend challenges

### Sprint Goals (ordered by priority)

1. **🔴 Onboarding Flow** — New user experience in <30 seconds:
   - Detect first visit (no localStorage data)
   - Welcome modal: "გამარჯობა! 👋 როგორ გინდა დაიწყო?"
   - 3 paths: "📚 ისწავლე სიტყვები" → Top 2000, "📖 გრამატიკა A1" → grammar, "🎮 თამაშები" → games
   - Set daily goal during onboarding (5/10/15 min)
   - Skip option for returning users
   - Store `onboarded: true` in localStorage

2. **🔴 True Spaced Repetition (SM-2)** — Replace basic flip-and-rate with real algorithm:
   - Track per-card: interval, ease factor, next review date
   - Rating: Again (0) / Hard (3) / Good (4) / Easy (5)
   - Intervals: 1min → 10min → 1d → 3d → 7d → 15d → 30d+
   - "Due cards" count shown on deck cards and dashboard
   - Daily review queue: cards due today shown first
   - This makes FluentGe ACTUALLY effective at teaching vocabulary

3. **🟡 Content Quality Audit** — Verify card data integrity:
   - Script to check all 142 JSON files for: missing fields, empty strings, duplicate cards
   - Sample check of Georgian translations for accuracy
   - Flag any cards with placeholder or low-quality translations
   - Report findings for manual review

4. **🟡 Homepage → Flashcard Flow** — Reduce friction:
   - Homepage "დაიწყე სწავლა" button → goes directly to Top 2000 (not generic /flashcards/)
   - Add "Continue Learning" banner on homepage for returning users
   - Clearer value proposition on homepage

5. **🟢 Review Reminders** — localStorage-based notification banner:
   - "You have 15 cards due for review!" banner on flashcard home
   - "Your streak is at risk! 🔥" if no activity today
   - These banners drive daily return visits

### For Each Cron Tonight:
- **Cron 1 (Strategy, 1:00AM):** ← THIS RUN. Set sprint, write specs, update context files.
- **Cron 2 (Design, 3:00AM):** Design onboarding modal + review due cards UI. Prepare CSS/animations.
- **Cron 3 (Features, 5:00AM):** Build onboarding flow + SM-2 spaced repetition engine.
- **Cron 4 (Improvements, 7:00AM):** Content quality audit script + homepage flow improvements + review reminders.
- **Cron 5 (QA, 9:00AM):** Full QA. Test onboarding for new users. Test SM-2 intervals. Screenshot everything.

## Technical Specs

### Onboarding Flow (Cron 3)
**Location:** New component `Onboarding.tsx` in flashcard-app, rendered in DeckSelect when `!localStorage.getItem('fluentge-onboarded')`.

```tsx
// Onboarding.tsx — Full-screen modal overlay
// Step 1: Welcome ("გამარჯობა! 👋")
// Step 2: Choose path (3 big cards: Words / Grammar / Games)
// Step 3: Set daily goal (3 options: 5წთ/10წთ/15წთ)
// Step 4: Start! → navigates to chosen section
// On complete: localStorage.setItem('fluentge-onboarded', 'true')
```

**Design:** Full-screen overlay with dark backdrop, centered card, smooth step transitions. Use existing 3D button style. Georgian text only.

### SM-2 Spaced Repetition (Cron 3)
**Location:** New `src/lib/srs-engine.ts`

```typescript
interface CardSRS {
  interval: number;      // days
  ease: number;          // 2.5 default
  repetitions: number;
  nextReview: number;    // timestamp
  lastReview: number;    // timestamp
}

// SM-2 algorithm
function reviewCard(card: CardSRS, rating: 0|1|2|3|4|5): CardSRS {
  if (rating < 3) {
    // Failed — reset
    return { ...card, repetitions: 0, interval: 1, nextReview: now + 1min };
  }
  // Success — increase interval
  const newEase = Math.max(1.3, card.ease + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));
  const newInterval = card.repetitions === 0 ? 1 
    : card.repetitions === 1 ? 6 
    : Math.round(card.interval * newEase);
  return { interval: newInterval, ease: newEase, repetitions: card.repetitions + 1, nextReview: now + newInterval * DAY };
}

// getDueCards(deckId) — returns cards where nextReview <= now
// Storage: localStorage key `srs_${deckId}_${cardId}`
```

**UI changes:**
- SRSStudy.tsx: Replace simple "know/don't know" with 4 SM-2 buttons (Again/Hard/Good/Easy)
- DeckSelect: Show "📋 X ბარათი გადასახედია" badge on decks with due cards
- Dashboard: "Due for Review" section

### Content Quality Audit (Cron 4)
**Script:** `scripts/audit-cards.js` — Node script that:
1. Reads all 142 JSON files in `flashcard-app/content/`
2. Checks each card for: `english`, `georgian`, `pronunciation` fields present and non-empty
3. Flags duplicates (same english word in same deck)
4. Checks Georgian text for obvious issues (Latin characters mixed in, etc.)
5. Outputs report to `cron-context/CONTENT-AUDIT.md`

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Build script now auto-removes audio from dist (`npm run deploy`)
