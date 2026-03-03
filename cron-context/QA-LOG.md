# FluentGe QA & Testing Log

## Last Full QA Run
- **Date:** 2026-03-03 (9:00 AM)
- **Status:** 🔴 CRITICAL BUG FOUND & FIXED (again!)
- **Issues Found:** 1 critical, 0 minor

## What Was Tested (Mar 3, Morning — 9:00 AM)

### HTTP Health Checks — ✅ All 200
- `/` — 200
- `/flashcards/` — 200
- `/grammar/` — 200
- `/podcast/` — 200
- `/games/` — 200

### TypeScript Check — ✅ Clean
- `npx tsc --noEmit` — no errors

### Flashcard App Build — ✅ Clean
- **Main bundle: 252.00 KB** (gzip 75.7 KB)
- **Top-2000 chunk: 469.25 KB** (1870 cards, expected)
- Built in 4.83s

### 🚨 CRITICAL BUG FOUND & FIXED: Flashcards Blank Page (AGAIN!)
- **Problem:** `/flashcards/` was completely blank (white page) — SAME issue as yesterday
- **Root cause:** Cloudflare Pages content-hash deduplication. When crons rebuild the flashcard app, new chunk hashes are generated. The website build copies them to `dist/`. But Cloudflare compares file content hashes — if index.html's content-hash matches a previous deployment's version (even with different asset refs), Cloudflare reports "0 files uploaded" and serves the OLD index.html from a previous deployment. The old index.html references stale asset hashes (`index-Dt20JgZK.js`) while the actual deployed assets have new hashes (`index-DwWNHwPd.js`).
- **Console errors:** `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"` — Cloudflare Pages 404 returning HTML fallback.
- **Fix:**
  1. Added timestamp comment to deploy script: `echo "<!-- deploy $(date +%s) -->" >> dist/flashcards/index.html`
  2. This ensures index.html content-hash is ALWAYS unique per deploy
  3. Forces Cloudflare to re-upload index.html every time
  4. Redeployed successfully — flashcards page renders perfectly
- **Prevention:** Deploy script in `website/package.json` now auto-appends unique timestamp. This is a permanent fix — the stale hash issue cannot recur.

### Browser Screenshots — ✅ All Rendering
- **Homepage:** Top 2000 hero CTA (amber gradient), social proof, testimonials, Word of Day — all clean
- **Flashcards:** Onboarding modal shows for new users (3-step flow), 73 decks behind modal, Top 2000 hero card — all working
- **Games:** Stats bar (XP, Level, streak, games played), 30 game cards, free/premium labels — all correct
- **Grammar:** All levels (A1-C1), 65 lessons, 3D buttons, premium CTA — all rendering

### Tonight's Changes Verified (Crons 1-4, Mar 3)
- [x] **Onboarding Modal (Cron 2):** 3-step flow (Welcome → Path → Daily Goal), 3D buttons, progress dots, localStorage persistence — renders correctly, code clean
- [x] **SM-2 4-Button Review (Cron 2):** Again/Hard/Good/Easy with interval previews — code correct
- [x] **Review Reminder Banner (Cron 2):** Amber gradient banner for due SRS cards — code correct
- [x] **SM-2 Engine Extraction (Cron 3):** srs-engine.ts with full SM-2 algorithm — clean, well-structured, proper error handling
- [x] **Onboarding Path Navigation (Cron 3):** Routes to correct pages based on selection — code correct
- [x] **Per-Deck Due Badges (Cron 3):** Amber circle badges on deck cards — code correct
- [x] **Content Audit (Cron 4):** 473 duplicate cards removed across 60 decks — verified deck-index.ts cardCount updated
- [x] **Homepage CTA (Cron 4):** Top 2000 hero CTA with amber gradient, direct link to SRS mode — renders correctly
- [x] **Deploy fix:** Timestamp in index.html prevents Cloudflare stale hash issue

### Code Review — No Issues Found
- **OnboardingModal.tsx (183 lines):** Clean React, proper state management, accessible buttons, localStorage correctly used
- **srs-engine.ts (154 lines):** Clean SM-2 implementation, proper defaults, error handling with try/catch, well-typed interfaces

## Known Issues (Non-Critical)
- 16k audio files in `public/flashcards/audio/words/` — should be moved to external CDN eventually
- `apple-mobile-web-app-capable` deprecation warning (minor)
- Mobile swipe gestures untested on actual mobile device
- Onboarding modal untested on mobile screen sizes (CSS may need adjustment)

## Fixed Bugs ✅
- [x] **🚨 CRITICAL: Flashcards blank page (Cloudflare stale hash)** — added timestamp to deploy script, permanent fix (Mar 3)
- [x] **🚨 CRITICAL: Flashcards blank page** — deploy exceeded 20k file limit, fixed build script (Mar 2)
- [x] **Deploy script added** — `npm run deploy` now handles build + audio cleanup + timestamp + wrangler deploy (Mar 2-3)
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
