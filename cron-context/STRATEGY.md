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

## 🎯 Current Sprint (Mar 2 Day Cycle)

### Theme: "Top 2000 Spotlight & Polish"

### CONTEXT: Tornike's priorities (Mar 2) — status:
1. ⚠️ **Top 2000 Words — special category** — NOT DONE. Must look special, distinct from other decks.
2. ⚠️ **Design improvements** — Ongoing. Keep polishing.
3. ⚠️ **Georgian translation review** — NOT DONE. Check ALL Georgian text for accuracy.
4. ⚠️ **Bug hunting** — Test everything, find and fix.
5. ✅ **Games XP/Level system** — DONE
6. ✅ **Dashboard game results** — DONE
7. ✅ **Dark mode contrast fix** — DONE

### Strategic State:
FluentGe is feature-rich and performant (236KB main bundle!). All major features work. The remaining work is Tornike's explicit requests: making Top 2000 special, Georgian quality, and polish.

**Competitive position:** We now have MORE features than Lingwing.com (6 study modes, 30 games, XP/streaks, achievements, 73 decks, 65 grammar lessons). Our bundle is fast (236KB). The gap is now content quality and polish — not features.

### Sprint Goals (ordered by priority)

1. **🔴 Top 2000 Words — Special Treatment** — This is Tornike's #1 ask. The Top 2000 deck has 2000 words and should be THE flagship deck. Currently it's just another card in a 3-column grid. Make it:
   - A full-width hero card at the TOP of the deck list (before the grid)
   - Gradient background (gold/amber), large icon, progress bar
   - Show word count prominently ("2,000 სიტყვა")
   - "ყველაზე მნიშვნელოვანი სიტყვები" (most important words) tagline
   - Separate visual section — users should see this FIRST
   - Make it free (move to FREE_DECK_IDS) — this is the hook that keeps users

2. **🔴 Georgian Translation Review** — Audit ALL user-facing Georgian text:
   - Flashcard UI strings (buttons, labels, tooltips)
   - Grammar page titles and descriptions
   - Games page text
   - Dashboard, homepage, navbar
   - Check for Google Translate artifacts, awkward phrasing
   - Fix to natural Georgian

3. **🟡 Design Polish** — Consistent styling across all pages:
   - 3D buttons on grammar and games pages (currently only homepage/premium have them)
   - Consistent card styling
   - Better loading states
   - Smooth transitions everywhere

4. **🟡 Onboarding Flow** — First-time user guided experience:
   - Detect new user (no localStorage data)
   - Show welcome screen with 3 paths: "Learn Words" → Top 2000, "Learn Grammar" → A1, "Play Games"
   - Tooltip highlights on first visit

5. **🟢 True Spaced Repetition** — Anki-style intervals (1d → 3d → 7d → 15d → 30d) instead of simple flip-and-rate.

### For Each Cron Today:
- **Cron 1 (Strategy, 11:30AM):** ← THIS RUN. Review state, set priorities, write specs. Update all context files.
- **Cron 2 (Design, 3PM):** Design the Top 2000 hero card. Design improvements for grammar/games pages. Prepare CSS.
- **Cron 3 (Features, 5PM):** Build Top 2000 special section in DeckSelect. Make it free. Build hero card component.
- **Cron 4 (Improvements, 7PM):** Georgian translation audit. Fix all UI strings. Polish design across pages.
- **Cron 5 (QA, 9PM):** Full QA. Test Top 2000 hero card. Verify Georgian text quality. Screenshot all pages.

## Technical Specs

### Top 2000 Special Hero Card (Cron 3)
**Current state:** Top 2000 is deck id `top-2000` in deck-index.ts with 2000 cards, sources: `['top-2000-words']`. It appears in the premium grid like any other deck.

**Changes needed:**
1. Add `top-2000` to `FREE_DECK_IDS` in deck-index.ts — this deck should be free (it's the best hook)
2. In DeckSelect.tsx, render Top 2000 as a special hero card BEFORE the grid:
   ```tsx
   // Before the free decks grid
   const top2000 = deckIndex.find(d => d.id === 'top-2000');
   
   {top2000 && (
     <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 p-6 cursor-pointer hover:scale-[1.01] transition-all"
       onClick={() => setSelectedMeta(top2000)}>
       <div className="flex items-center gap-4">
         <span className="text-5xl">⭐</span>
         <div>
           <h2 className="text-xl font-bold">ტოპ 2000 სიტყვა</h2>
           <p className="text-amber-400/80 text-sm">ყველაზე მნიშვნელოვანი ინგლისური სიტყვები</p>
           <p className="text-[var(--color-text-muted)] text-xs mt-1">2,000 ბარათი · ისწავლე ყველა და ინგლისური გეცოდინება!</p>
         </div>
       </div>
       {/* Progress bar */}
     </div>
   )}
   ```
3. Remove `top-2000` from the regular grid (filter it out from freeDecks/premiumDecks)

### Georgian Translation Audit (Cron 4)
**Files to check:**
- `flashcard-app/src/components/*.tsx` — all UI strings
- `website/src/pages/*.astro` — all page text
- `website/src/components/*.astro` — component text
- Games page inline text
- Dashboard labels
- Homepage sections

**Common issues to look for:**
- "სწავლა" vs "ისწავლე" (infinitive vs imperative — use imperative for buttons)
- Awkward word order
- Missing Georgian characters
- Mixed English/Georgian unnecessarily

## Notes for Crons
- Always build AND deploy after changes
- Always test that changes don't break existing features
- Commit to git after successful deploy
- Update this file and other context files as needed
- ⚠️ Build script now auto-removes audio from dist (`npm run deploy`)
