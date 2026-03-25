# FluentGe Improvements Backlog

## UX Improvements 🎯

### Navigation & Flow
- [x] Better navbar — active state highlighting (desktop blue underline, mobile blue left border) ✅ Cron 4, Mar 11
- [ ] Breadcrumbs on deep pages
- [ ] "Back to..." buttons that make sense contextually
- [x] Smoother page transitions ✅ Cron 4, Mar 5 (screen fade-in animation)
- [x] Better 404 page ✅ Cron 4B, Mar 7 (branded page with bilingual text + navigation links)

### Flashcard UX
- [x] Swipe gestures on mobile ✅ Cron 4, Mar 2
- [x] Keyboard shortcuts (Space=flip/next, S=audio, 1=focus input) ✅ Cron 4B, Mar 1
- [x] Better progress bar during session ✅ Cron 4B, Mar 2
- [x] Card count "12/50" clearly visible ✅ Cron 4B, Mar 2
- [ ] Sound auto-play option
- [x] Confetti/celebration on milestones (every 10 cards, deck completion) ✅ Cron 4, Mar 2

### Grammar Section
- [x] Interactive exercises within lessons ✅ Cron 4B, Mar 5 (Duolingo-style 3D buttons, feedback bar, continue button)
- [ ] Progress indicator per lesson
- [x] "Mark as complete" functionality ✅ (already existed)
- [ ] Related vocabulary sidebar

### Homepage
- [ ] Better hero section — clear value proposition
- [ ] Social proof (user count, testimonials)
- [ ] Feature showcase with screenshots
- [ ] Clear CTA to start learning
- [ ] Show progress if logged in

### Premium Page
- [ ] Better pricing presentation
- [ ] Feature comparison (free vs premium)
- [ ] Testimonials
- [ ] FAQ section
- [ ] Clear payment flow

## Performance
- [ ] Lazy load heavy components
- [ ] Optimize images (WebP)
- [ ] Reduce flashcard JS bundle (6.4MB is huge)
- [ ] Cache API responses

## Accessibility
- [ ] Proper ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader friendly
- [ ] High contrast mode

## Mobile
- [ ] Test all pages on mobile
- [ ] Fix any overflow/layout issues
- [ ] Touch-friendly button sizes (min 44px)
- [ ] Bottom navigation for mobile?

## 🎯 CURRENT FOCUS (Mar 13+) — "Bug Fixes & Design Polish ONLY"
- **⚠️ NO NEW FEATURES per Tornike's order (Mar 12)**
- [x] Light mode audit — check all pages for contrast issues ✅ Cron 4, Mar 13
- [x] Mobile layout review — check for overflow/spacing issues ✅ Cron 4B, Mar 14 (all pages verified in light mode — no issues found)
- [x] Game overlay light mode fix — `!important` on text color overrides, button bg/border overrides for inline-styled elements ✅ Cron 4B, Mar 13
- [x] Button/text readability check across all pages ✅ Cron 4B, Mar 14 (all pages verified — text readable, buttons properly styled in both modes)
- [x] Console error cleanup ✅ Cron 4, Mar 13 (no errors found)

## ✅ COMPLETED — Mar 24 (Cron 4B, 5:30 PM)
- [x] **BUG: Firestore sync feedback loop** — onSnapshot→apply() modified localStorage, making hash differ on next save, causing writes every 60s even when idle. Fixed by updating `lastSavedHash` after both `apply()` and `loadCloud()`. Reduces Firestore writes from ~60/hr to near-zero when idle. ✅
- [x] **Deprecation: apple-mobile-web-app-capable** — Added `mobile-web-app-capable` meta tag alongside the Apple one ✅

## ✅ COMPLETED — Mar 24 (Cron 4, 7:00 AM)
- [x] **CRITICAL BUG: Firestore resource-exhausted error** — Both sync scripts (Layout.astro + flashcard firebase-sync.ts) were writing to Firestore every 30-60s even when data hadn't changed, causing "Write stream exhausted maximum allowed queued writes" errors. Added hash deduplication to skip unchanged saves. Also fixed beforeunload listener leak in website sync, increased onSnapshot loop guard to 5s. ✅

## ✅ COMPLETED — Mar 23 (Cron 4B, 5:30 PM)
- [x] **CRITICAL BUG: /pricing/ → /premium/ broken links** — 3 links on grammar pages (grammar listing + individual lesson) pointed to `/pricing/` which returned 404. Fixed to `/premium/`. ✅

## ✅ COMPLETED — Mar 23 (Cron 4, 7:00 AM)
- [x] **Blog prose light mode** — All 27 blog posts use `prose-invert` which had white text/links in light mode. Added CSS variable overrides for body, headings, links, bold, quotes, code, borders. Tip boxes also get light bg. ✅
- [x] **Dashboard leaderboard light mode** — Non-top-3 avatar gradient backgrounds (`#3a3a3e`→`#2a2a2e`) now get light gray in light mode ✅
- [x] **Dashboard reset modal light mode** — Modal container gets white bg and proper borders in light mode ✅
- [x] **Blog date text** — `#4A4A45` text color gets proper muted color in light mode ✅

## ✅ COMPLETED — Mar 22 (Cron 4, 7:00 AM)
- [x] **Dashboard light mode** — All hardcoded dark colors (#242426, #1C1C1E, #2E2E30, #C8C8C0, #6B6B65, #A0A09A) overridden via CSS utility class selectors ✅
- [x] **Games light mode (inline styles)** — Game buttons (#2A2A2E bg), text (#F5F5F0, #A0A09A, #C8C8C0), XP display, back button, memory cards all get light overrides via `[style*=]` attribute selectors with `!important` ✅

## ✅ COMPLETED — Mar 21 (Cron 4, 7:00 AM)
- [x] **Footer light mode** — Footer link hovers use proper dark color instead of white, footer borders properly themed ✅
- [x] **Daily challenge results light mode** — Results buttons (retry + practice) properly styled in light mode ✅
- [x] **Profile heatmap legend** — "No activity" legend cell properly overridden for light mode ✅
- [x] **Decorative background blobs** — Hidden in light mode (dark-mode gradients invisible on light bg) ✅
- [x] **Daily feedback card** — Properly themed with white bg and border in light mode ✅

## ✅ COMPLETED — Mar 19 (Cron 4, 7:00 AM)
- [x] **Phrases page light mode** — Full light mode overrides: category cards, search input, level filter buttons, phrase items, premium modal all properly themed ✅
- [x] **Premium page light mode** — Pricing cards, comparison table, FAQ items get white backgrounds and proper borders in light mode ✅
- [x] **Global muted text overrides** — `#C8C8C0`, `#8B8B85`, `#5B5B55`, `#a0a0aa` all get darker readable colors in light mode ✅
- [x] **Hero overlay light mode** — Added `hero-overlay-dark` class to games, phrases, podcast, and index hero sections for proper light gradient ✅
- [x] **About page hero light mode** — Hero overlay and text properly themed for light mode ✅

## ✅ COMPLETED — Mar 15 (Cron 4B, 5:30 PM)
- [x] **CRITICAL: Entire site CSS broken on live deployment** — CDN was serving stale HTML references pointing to `about.BWfgMbL6.css` (old hash) which returned 404/HTML. Redeployed to fix. All pages (dashboard, grammar, etc.) were completely unstyled. ✅

## ✅ COMPLETED — Mar 15 (Cron 4, 7:00 AM)
- [x] **Grammar cards light mode fix** — Cards had dark gradient backgrounds (rgb(36,36,38)) in light mode because JS set inline `background` styles before theme class was applied. Refactored to use CSS classes (`grammar-state-completed`, `grammar-state-current`) with proper light/dark mode overrides via `!important`. ✅

## ✅ COMPLETED — Mar 14 (Cron 4, 7:00 AM)
- [x] **Daily challenge light mode** — Quiz option buttons, stat cards, feedback messages, results card, progress bar all properly themed for light mode ✅
- [x] **Login page light mode inputs** — Input fields get light background, proper placeholder colors, focus border color, tab switcher styled ✅
- [x] **Register page light mode** — Form inputs, placeholder text, submit button all get proper light theme ✅

## ✅ COMPLETED — Mar 13 (Cron 4, 7:00 AM)
- [x] **CRITICAL BUG FIX: Podcast page completely empty** — Premium CTA hide script was hiding entire episode section (`a.closest('section').style.display='none'`) instead of just the CTA div. Fixed to target `.mt-12` wrapper only. ✅
- [x] Games page light mode polish — added global CSS for game card backgrounds, borders, text colors, gradient overlays, stats bar, and game-of-day card in light mode ✅

### ✅ COMPLETED — Mar 11-12 Sprint (Conversion & Retention)
- [x] Homepage counter bar + "How It Works" ✅ Cron 2B, Mar 11
- [x] Premium trust badges + FAQ ✅ Cron 2B+4B, Mar 11
- [x] Game high scores ✅ Cron 4B, Mar 11
- [x] Active navbar states ✅ Cron 4, Mar 11
- [x] Learning Paths page ✅ Cron 3, Mar 12
- [x] Weekly Leaderboard ✅ Cron 3, Mar 12
- [x] Login visual upgrade ✅ Cron 2, Mar 12
- [x] Global entrance animations ✅ Cron 2, Mar 12
- [x] Grammar level progress bars ✅ Cron 4, Mar 12
- [x] Homepage returning user CTAs ✅ Cron 4, Mar 12

### ✅ COMPLETED — Mar 8 (Launch Readiness)
- [x] Light Mode Contrast ✅
- [x] Grammar Lock 4 states ✅
- [x] Collapsible episodes + async fonts ✅
- [x] All bugs fixed ✅
- [x] SEO meta tags for all pages ✅
- [x] About page redesign ✅

## ✅ COMPLETED — Tornike's 8 Priorities (Mar 7)
- ✅ Daily Goal → Card-Based (removed "წთ", card presets verified)
- ✅ Deep Links added (courses + podcast → flashcards)
- ✅ Mark-as-Done removed (grammar + phrases + dashboard)
- ✅ Dashboard auto-tracking (4 gradient stat cards)
- ✅ Grammar Sequential Lock (3 states + ≥70% pass gate)
- ✅ Games Page Redesign (spotlight + categories + records)
- ✅ Full Site Audit (0 bugs found)

## Recently Improved ✅
- [x] Free grammar expanded 3→8 A1 lessons (present-simple, present-continuous, subject-pronouns, possessive-adjectives, prepositions-of-place) (Cron 4, Mar 1)
- [x] Achievements system — 10 badges on dashboard with earned/locked states, gradient icons, progress counter (Cron 4, Mar 1)
- [x] Navbar streak 🔥 + XP ⭐ badges — shows in desktop & mobile nav when user has progress (Cron 4B, Feb 28)
- [x] Learning path roadmap — 10-step beginner path on Dashboard with completion tracking (Cron 4B, Feb 28)
- [x] Dashboard "continue where you left off" — smart card with personalized suggestions based on progress (Cron 4, Feb 28)
- [x] Grammar → Flashcard interconnection — related decks shown after each grammar lesson + prev/next navigation (Cron 4, Feb 28)

## In Progress 🔄
(none)

## ✅ COMPLETED — Mar 12 (Cron 4, 7:00 AM)
- [x] Homepage returning user CTAs — Daily Lesson + SRS Review buttons (was empty after removals) ✅
- [x] Grammar level progress bars — per-level completion counter + animated progress bar, light mode ✅

## Completed This Sprint ✅ (Mar 6 night)
- Placement→Personalized flow ✅ Cron 4 (level-specific gradient CTA, updated href)
- SEO sitemap/robots.txt domain fix ✅ Cron 2+4 (surge.sh→pages.dev, missing pages)
- Game verification ✅ Cron 4 (30/30 games reviewed, all working)
- Level personalization across DailyLesson/DeckSelect/Dashboard/Courses ✅ Cron 3
- Podcast quiz data (105 questions, 35 episodes) ✅ Cron 3
- Homepage CTA redesign ✅ Cron 2
- SEO canonical/OG URL fix ✅ Cron 2

## Completed Last Sprint ✅ (Mar 5 day)
- Grammar exercises Duolingo-style upgrade ✅ Cron 4B, Mar 5 (3D buttons, feedback bar, continue button, streak, stat cards)
- Course units completion tracking ✅ Cron 4B, Mar 5 (localStorage progress, per-unit %, green checkmarks, light mode)

## Completed Last Sprint ✅ (Mar 2 — "Top 2000 Spotlight & Polish")
- Top 2000 hero card ✅ Cron 2B, Mar 2
- Georgian translation audit ✅ Cron 4B, Mar 2
- Better progress bar + card count ✅ Cron 4B, Mar 2
- 3D buttons on grammar/games ✅ Cron 2B, Mar 2
- Stats banner + daily goal UI ✅ Cron 3B, Mar 2

## Previously Completed ✅ (Feb 28)
- ✅ Light mode audit — all pages verified
- ✅ Streak/XP/Daily Goal CSS and visual design
- ✅ Navbar streak + XP display
- ✅ Learning path roadmap on dashboard

## Notes
- Each improvement cron picks 2 items
- Focus on things that make the biggest difference to user experience
- Always test in both light and dark mode after changes
