# FluentGe QA & Testing Log

## Last Full QA Run
- **Date:** 2026-03-02 (9:00 AM)
- **Status:** 🔴 CRITICAL BUG FOUND & FIXED
- **Issues Found:** 1 critical, 0 minor

## What Was Tested (Mar 2, Morning — 9:00 AM)

### HTTP Health Checks — ✅ All 200
- `/` — 200
- `/flashcards/` — 200
- `/grammar/` — 200
- `/podcast/` — 200
- `/games/` — 200

### TypeScript Check — ✅ Clean
- `npx tsc --noEmit` — no errors

### Flashcard App Build — ✅ Clean
- **Main bundle: 235.80 KB** (gzip 72 KB) — down from 6.5MB! Dynamic loading working!
- 100+ deck chunks (~60KB each), loaded on demand
- Built in 4.69s

### 🚨 CRITICAL BUG FOUND & FIXED: Flashcards Blank Page
- **Problem:** `/flashcards/` was completely blank (white page)
- **Root cause:** Cron 3's dynamic deck loading refactor changed all chunk hashes. The flashcard build ran, but the website deploy failed silently due to 20k file limit (16,207 audio files + new chunks = 28,686 files). The live site was serving old asset hashes that didn't match the new index.html.
- **Console errors:** `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"` — classic Cloudflare Pages 404 returning HTML.
- **Fix:** 
  1. Removed `dist/flashcards/audio/` (16k files) before deploy
  2. Added `rm -rf dist/flashcards/audio` to build script in package.json
  3. Added `npm run deploy` convenience script
  4. Redeployed successfully (12,479 files, under 20k limit)
- **Verified:** Flashcards page renders perfectly with all 73 decks, stats bar, features
- **Prevention:** Build script now auto-removes audio from dist. Future crons should use `npm run deploy` instead of manual build+deploy.

### Browser Screenshots — ✅ All Rendering
- **Homepage:** Social proof, testimonials, onboarding CTA, Word of Day — all clean
- **Flashcards:** 73 decks displayed, stats bar (XP/Level), difficult words banner, challenge friend section — all working
- **Games:** Stats bar (XP, Level, streak, games played), 30 game cards, free/premium labels — all correct
- No JS console errors on any page (only minor apple-mobile-web-app-capable deprecation warning)

### Tonight's Changes Verified (Crons 1-4, Mar 2)
- [x] **Dynamic Deck Loading (Cron 3):** 96% bundle reduction confirmed (6.5MB → 236KB). deck-index.ts, deck-loader.ts, useDecks.ts all in src/lib/. Content loaders use dynamic import(). In-memory cache working.
- [x] **Dashboard Game Stats (Cron 2):** 4 gradient stat cards, XP progress bar, "Go to Games" CTA — renders correctly
- [x] **Mobile Swipe Gestures (Cron 4):** useSwipe hook in source, swipe hint — code looks correct (can't test touch on desktop browser)
- [x] **Confetti Celebrations (Cron 4):** Confetti system in code — milestone at every 10 cards, deck completion
- [x] **Audio Autoplay Toggle (Cron 3):** 🔊/🔇 toggle, localStorage persistence, speakWord in SRSStudy
- [x] **Deploy fix:** Added audio cleanup to build script, deploy convenience script

## Known Issues (Non-Critical)
- 16k audio files in `public/flashcards/audio/words/` — should be moved to external CDN eventually
- `apple-mobile-web-app-capable` deprecation warning (minor)
- Mobile swipe gestures untested on actual mobile device

## Fixed Bugs ✅
- [x] **🚨 CRITICAL: Flashcards blank page** — deploy exceeded 20k file limit, fixed build script (Mar 2)
- [x] **Deploy script added** — `npm run deploy` now handles build + audio cleanup + wrangler deploy (Mar 2)
- [x] weather-climate.json had card with missing english/georgian fields (Feb 27)
- [x] Firebase authorized domains didn't include fluentge.pages.dev (Feb 27)
- [x] Homepage bloat — 472 lines of hardcoded words → extracted to JSON (Feb 28)
- [x] Dashboard `cards.length` → `wordCount` (Mar 2, Cron 2)

## Testing Method
1. HTTP status checks on all key routes
2. TypeScript compilation check
3. Flashcard app build verification
4. Browser screenshots of key pages
5. Console error check
6. Source code review of new features
7. Deploy verification
