# FluentGe — Roadmap Status

## Phase 1: Foundation ✅ (Completed Feb 17, 2026)

### Completed:
- [x] **Astro website** built at `website/` with Tailwind CSS v4
  - Homepage: Hero section, feature highlights (flashcards, grammar coming soon, podcast coming soon), "Why FluentGe" section, CTA, footer
  - About page
  - Navigation: მთავარი, ბარათები, გრამატიკა (coming soon), ჩვენ შესახებ
  - Georgian UI text throughout, Inter font, dark theme with #22c55e green primary
  - Mobile-first responsive design
- [x] **Flashcard React app** built at `flashcard-app/` (Vite + React + TypeScript + Tailwind)
  - SM-2 spaced repetition algorithm implemented
  - Study screen: shows English word + pronunciation, tap to reveal Georgian translation + example sentences
  - Deck selection screen with progress bars per category
  - Stats bar: words learned, streak, accuracy (localStorage)
  - 3-button rating: არ ვიცი / ძნელია / ვიცი!
  - Session complete screen with accuracy report
  - Builds to `website/public/flashcards/` — embedded at /flashcards/
- [x] **50 flashcard words** generated (JSON):
  - `content/word-lists/greetings-basics.json` — 25 words (Greetings & Basics, A1)
  - `content/word-lists/numbers-time.json` — 25 words (Numbers & Time, A1)
  - Georgian translations, pronunciations, example sentences in both languages
- [x] Both `npm run build` succeed (website + flashcard-app)
- [x] Git committed

### Not yet done (Phase 1 remaining):
- [ ] Choose name and register .ge domain
- [x] Deploy to surge.sh — **LIVE at https://fluentge.surge.sh** ✅ (Feb 18)
- [ ] Deploy to Cloudflare Pages (needs API token auth)
- [ ] Firebase setup (auth + database)
- [x] PWA setup ✅ (Feb 18) — manifest, service worker, icons, apple-mobile-web-app tags
- [x] Generate 591 words across 9 categories ✅ (exceeds 200 target!)
- [x] Wire all 9 decks into flashcard app ✅ (Feb 18) — was only 2 decks before
- [x] Added Politics & Society deck (50 B2 words) ✅ (Feb 18) — now 1010+ words across 16 decks!
- [x] **1000+ word milestone reached!** 🎉

## Phase 2: Grammar — Not started
## Phase 3: Growth — Not started
## Phase 4: Podcast & Premium — Not started
