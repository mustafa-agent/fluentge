# FluentGe Design Reference — Stolen from the Best

## Reference Projects (cloned in `references/`)
1. **Lingo** (`references/lingo/`) — Duolingo clone, 480⭐, Next.js+Tailwind
   - Live: lingo-clone.vercel.app
2. **React-Duolingo** (`references/react-duolingo/`) — 447⭐, React+Tailwind
   - Live: react-duolingo.vercel.app
3. **KanaDojo** (kanadojo.com) — Beautiful minimalist learning platform

## THE DUOLINGO BUTTON SECRET 🔑

The #1 thing that makes Duolingo look fun is their **3D buttons with bottom borders**.
From `references/lingo/components/ui/button.tsx`:

```css
/* The magic formula: border-b-4 + active:border-b-0/2 = 3D press effect */

/* Primary (blue) */
bg-sky-400 border-sky-500 border-b-4 active:border-b-0

/* Secondary (green — for correct/success) */
bg-green-500 border-green-600 border-b-4 active:border-b-0

/* Danger (red — for wrong/errors) */
bg-rose-500 border-rose-600 border-b-4 active:border-b-0

/* Super (purple — for premium/special) */
bg-indigo-500 border-indigo-600 border-b-4 active:border-b-0

/* Locked/disabled (gray) */
bg-neutral-200 border-neutral-400 border-b-4 active:border-b-0

/* Default (white with subtle border) */
bg-white border-slate-200 border-2 border-b-4 active:border-b-2

/* ALL buttons share: */
rounded-xl font-bold uppercase tracking-wide
```

## LESSON BUTTON PATH (The Snake Pattern)
From `references/lingo/app/(main)/learn/lesson-button.tsx`:
- Circular progress bars around lesson icons
- Buttons arranged in a snake/zigzag path (like Duolingo's learning path)
- Bouncing "Start" tooltip on current lesson
- Icons: Star (upcoming), Check (completed), Crown (final)
- 70x70px round buttons with `border-b-8` for extra chunky 3D effect

## COLOR SYSTEM — What Duolingo Actually Uses

### Functional Colors (from Lingo reference)
| Purpose | Color | Tailwind |
|---------|-------|----------|
| Primary action | Sky blue | `sky-400` / `sky-500` |
| Success/correct | Green | `green-500` / `green-600` |
| Error/wrong | Rose | `rose-500` / `rose-600` |
| Premium/special | Indigo | `indigo-500` / `indigo-600` |
| Warning | Amber | `amber-400` / `amber-500` |
| Locked/disabled | Neutral gray | `neutral-200` / `neutral-400` |
| XP/rewards | Gold/yellow | `yellow-400` / `yellow-500` |

### Background (from Lingo)
- Light mode: Pure white `bg-white` with subtle gray cards
- Dark mode: Deep navy `hsl(222.2, 84%, 4.9%)` — NOT pure black!

### Key Insight
Duolingo is BRIGHT and COLORFUL on a white/clean background. The colors POP because the base is neutral. FluentGe's current dark theme (#1C1C1E) is too flat — needs either:
1. A richer dark blue (like Lingo's dark mode), OR
2. Colorful accent elements that pop against the dark

## PROGRESS BAR PATTERN
From react-duolingo lesson page:
- Top bar: thin green progress bar showing lesson completion
- Hearts system: visual hearts that deplete on wrong answers
- XP counter with animation

## QUIZ/CHALLENGE UI PATTERN
From react-duolingo `src/pages/lesson.tsx`:
- "SELECT_1_OF_3": Show question, 3 visual answer cards, tap to select
- "WRITE_IN_ENGLISH": Word tiles to arrange into a sentence
- Green bottom bar for correct ("Correct!") with continue button
- Red bottom bar for wrong ("Correct answer: ...") with continue button
- Sounds: correct.mp3, wrong.mp3

## SIDEBAR PATTERN (Lingo)
- Left sidebar (256px fixed): Learn, Leaderboard, Quests, Shop
- Right sidebar: User progress (XP, streak, hearts, leaderboard preview)
- Mobile: hamburger menu or bottom tab bar

## GAMIFICATION ELEMENTS TO IMPLEMENT
1. **XP System** — Earn XP for every card reviewed, quiz completed, lesson done
2. **Streaks** — Days in a row practicing (with 🔥 icon)
3. **Hearts** — Limited attempts (encourages premium)
4. **Leaderboard** — Weekly rankings
5. **Quests** — "Review 20 cards today" type challenges
6. **Achievements** — Badges for milestones
7. **Confetti** — On lesson completion, milestone reached
8. **Sound effects** — Correct/wrong answer sounds

## ANIMATION PATTERNS
- Bouncing tooltip ("Start here!")
- Confetti on completion (canvas-confetti library already in flashcard app!)
- Progress bar fills smoothly
- Cards slide/flip with spring animation
- XP counter animates up (+10 XP)
- Hearts shake when lost

## TYPOGRAPHY
Both references use:
- `font-bold` / `font-extrabold` for headings
- `uppercase tracking-wide` for button text
- Clean sans-serif (Inter or system font)
- Large, readable text sizes

## CONCRETE TODO FOR DESIGN CRON

### Phase 1: Foundation
1. Replace flat buttons with 3D Duolingo-style buttons site-wide
2. Update color palette — add vibrant functional colors (green, blue, rose, amber)
3. Fix dark mode — make it rich navy, not flat dark gray
4. Fix light mode — clean white with proper contrast

### Phase 2: Components
5. Create progress bar component (thin, colorful, animated)
6. Create XP badge component
7. Create streak counter component
8. Create achievement badge component

### Phase 3: Pages
9. Redesign flashcard deck select with lesson-path style
10. Add sidebar layout for dashboard
11. Redesign quiz result screens (green/red bottom bars)
12. Make homepage engaging with clear CTA

### Phase 4: Delight
13. Add confetti celebrations
14. Add micro-animations
15. Add sound effects for correct/wrong
16. Polish transitions throughout

---

## LANDING PAGE / SALES PAGE DESIGN 🏠

### Reference: `references/saas-landing/` (SaaS Landing Template)

FluentGe needs TWO design modes:
1. **Sales pages** (homepage, premium, about) — convince visitors to sign up
2. **App pages** (flashcards, grammar, dashboard, games) — gamified learning UI

### Homepage Must-Haves (from SaaS template patterns):
- **Hero section:** Big bold headline, clear value proposition, CTA button
  - "ისწავლე ინგლისური სახალისოდ და უფასოდ" (Learn English the fun and free way)
  - Animated entrance (fade up with spring)
  - Gradient text for headline: `bg-linear-to-b from-sky-800 to-foreground bg-clip-text text-transparent`
- **Social proof:** "5,000+ Georgian learners" (even if aspirational)
- **Feature showcase:** 3-4 cards showing Flashcards, Grammar, Podcasts, Games
- **Pricing section:** Free vs Premium comparison (from `references/saas-landing/components/pricing.tsx`)
  - "Most Popular" badge on premium plan
  - CheckIcon ✓ for features, scaled up for popular plan
- **Testimonials:** Even placeholder ones help
- **CTA repeat:** Bottom of page, another sign-up push

### Navbar Pattern:
- Logo left, navigation center, Login/Sign Up right
- Sticky/fixed on scroll
- Mobile: hamburger menu
- Clean, not cluttered

### Premium Page:
- Pricing cards (Free vs Premium vs ?)
- Feature comparison table
- FAQ section
- "Start Free Trial" CTA

### Key CSS Patterns for Sales Pages:
```css
/* Gradient text headings */
bg-linear-to-b from-sky-800 dark:from-sky-100 to-foreground bg-clip-text text-transparent

/* Glow/blur decorative elements */
w-12 h-[600px] bg-light blur-[70px] rounded-3xl rotate-35

/* Entrance animations (framer-motion style, achievable with CSS) */
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Most Popular pricing badge */
absolute -top-4 left-1/2 -translate-x-1/2 bg-card border-2 border-primary px-4 py-1 rounded-full

/* Cards that scale on hover */
hover:scale-105 transition-transform
```

## BROWSER SCREENSHOTS 📸

Design and QA crons can use the browser tool to visually verify their work:
```
browser action=open targetUrl="https://fluentge.pages.dev/"
browser action=screenshot  (captures current page)
browser action=snapshot     (gets page structure)
```
Use profile="chrome" when the Chrome extension relay is active.
Always screenshot AFTER deploying to verify changes look right.
Screenshot both the page in its current state AND after toggling light/dark mode if possible.
