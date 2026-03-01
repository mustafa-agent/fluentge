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

## 🎯 Current Sprint (Mar 2 Night Cycle)

### Theme: "Dashboard Game Stats & Dynamic Loading"

### CONTEXT: Tornike's Mar 1 priorities status:
1. ✅ **Games XP/Level System** — DONE. All 30 games award XP, stats bar, level-ups, floating animations.
2. ⚠️ **Dashboard Game Results** — NOT DONE YET. Dashboard still doesn't show game stats. This is TONIGHT'S #1 PRIORITY.

### Strategic State:
FluentGe is feature-rich (6 study modes, 142 decks, 65 grammar lessons, 30 games, XP/streaks/achievements). The two critical problems now:
- **Dashboard doesn't show game progress** — Tornike asked for this explicitly. Games track XP/gamesPlayed/todayGames in localStorage but dashboard ignores it.
- **6.5MB main bundle** — 104 static JSON imports in cards.ts bundle ALL deck data upfront. Georgian mobile users wait 10-15s. Dynamic deck loading would cut main bundle to ~500KB.

### Sprint Goals (ordered by priority)

1. **🔴 Dashboard Game Stats Section** — Show: games played today/total, XP from games, level, recent game activity, favorite games. Make it prominent on dashboard. Use localStorage keys: `gamesPlayed`, `todayGames`, `totalXP`. Add game-specific stats cards with icons. THIS COMPLETES TORNIKE'S REQUEST.

2. **🔴 Dynamic Deck Loading** — Refactor cards.ts to lazy-load deck JSON files. Instead of 104 static imports, use dynamic `import()` to load deck data only when user opens that deck. This is THE fix for the 6.5MB bundle. Target: main bundle <1MB. Keep a lightweight deck index (id, name, nameKa, icon, cardCount) for the listing page.

3. **🟡 Audio Autoplay Toggle** — Settings toggle to auto-play English pronunciation when flashcard appears. Simple but highly requested UX improvement. Carried over 3 sprints.

4. **🟡 Swipe Gestures on Mobile** — Mobile flashcard users should swipe left/right for wrong/correct. Natural touch interaction. Increases mobile engagement.

5. **🟢 Better Onboarding Flow** — First-time user detection → guided tour highlighting key features (flashcards, grammar, games). Reduces confusion, increases activation rate.

### For Each Cron Tonight:
- **Cron 1 (Strategy, 1AM):** Review state, set sprint priorities, write specs for dashboard game stats and dynamic deck loading. Update all context files.
- **Cron 2 (Design, 3AM):** Design dashboard game stats cards (layout, colors, animations). Design loading states for dynamic deck loading. Prepare CSS.
- **Cron 3 (Features, 5AM):** Build dynamic deck loading in cards.ts. Refactor from 104 static imports to dynamic import(). Build deck index. Build & deploy.
- **Cron 4 (Improvements, 7AM):** Build dashboard game stats section. Show games played, XP earned, level, recent activity. Also add audio autoplay toggle if time allows.
- **Cron 5 (QA, 9AM):** Test dynamic deck loading (all decks load correctly on demand). Test dashboard game stats. Full regression on all pages.

## Technical Specs

### Dynamic Deck Loading (Cron 3)
**Problem:** cards.ts has 104 `import X from '../../content/Y.json'` statements. Vite bundles ALL JSON into the main chunk = 6.5MB.

**Solution:**
1. Create `deck-index.ts` — lightweight array of deck metadata (id, name, nameKa, icon, image, cardCount, level, category). NO card data. ~5KB.
2. Refactor cards.ts — replace static imports with a `loadDeck(id: string)` async function that uses `import()` to dynamically load the JSON file.
3. Vite will automatically code-split each JSON into its own chunk, loaded on demand.
4. DeckSelect screen uses deck-index for the listing (instant load).
5. StudyScreen/QuizScreen/TypingScreen call `loadDeck(id)` when user picks a deck.
6. Cache loaded decks in memory (Map) so reopening is instant.

**Key pattern:**
```typescript
// deck-index.ts
export const deckIndex: DeckMeta[] = [
  { id: 'greetings-basics', name: 'Greetings', nameKa: 'მისალმებები', icon: '👋', cardCount: 30, level: 'A1' },
  // ... 100+ entries, NO card arrays
];

// cards.ts
const deckCache = new Map<string, Deck>();
const deckLoaders: Record<string, () => Promise<any>> = {
  'greetings-basics': () => import('../../content/greetings-basics.json'),
  // ... generated for all decks
};

export async function loadDeck(id: string): Promise<Deck> {
  if (deckCache.has(id)) return deckCache.get(id)!;
  const data = await deckLoaders[id]();
  const deck = processDeckData(id, data.default);
  deckCache.set(id, deck);
  return deck;
}
```

**Expected result:** Main bundle drops from 6.5MB to ~500KB-1MB. Each deck loads ~20-80KB on demand.

### Dashboard Game Stats (Cron 4)
**localStorage keys to read:**
- `gamesPlayed` — total games completed (number)
- `todayGames` — `{ count: N, xp: N, date: "YYYY-MM-DD" }` 
- `totalXP` — total XP across all activities
- `currentStreak` — current day streak

**Dashboard section should show:**
- 🎮 Games Played (today / total)
- ⭐ Game XP Earned (today / total — derive from todayGames.xp)
- 📊 Level + XP progress bar to next level
- 🔥 Game Streak
- Recent activity summary

Place this section prominently on the dashboard, between "My Stats" and the learning path.

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Remove `dist/flashcards/audio/words/` before deploying (16k files hit 20k limit)
