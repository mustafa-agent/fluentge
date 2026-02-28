# FluentGe Changelog

## Format
Each cron logs what it did here. Most recent first.

---

## 2026-02-28

### Cron 2B — Design (1:30 PM, Day Run)
- **Light mode audit — ALL pages verified ✅:**
  - Grammar: cards, badges, premium CTA — all readable
  - Games: game cards, overlay, modals, back button — all fixed
  - Phrases: search input, level filters, category blocks, premium modal — all fixed
  - Premium: removed inline `style="color:#C8C8C0"` on headings (was invisible in light mode), pricing cards verified
  - About: text colors properly overridden
  - Podcast: hero gradient and containers fixed
- **Comprehensive CSS additions (~200 lines):**
  - Game overlay (`#game-overlay`) gets light bg
  - Game cards (`.game-card`) get white bg + proper borders
  - Game internal UI (`#gc` children) all overridden
  - Category blocks, phrase items, search input, level filters
  - Premium modal, phrases modal
  - Misc: `bg-white/10`, `bg-white/20`, `divide-white/5`, gradient via colors
- **Streak/XP/Daily Goal CSS pre-built for Cron 3:**
  - `.streak-badge` (active/inactive variants) with fire pulse animation
  - `.xp-badge` with gold color scheme + `.xp-counter` animate class
  - `.daily-goal-bar` with green gradient fill + complete state
  - `.daily-goal-card` with green tint
  - `.xp-float` popup animation (floats up and fades)
  - All components have light mode variants
- Deployed to Cloudflare Pages ✅
- Verified via browser screenshots (grammar, games, phrases, premium — all clean)
- Git committed & pushed

### Cron 1B — Strategy (11:30 AM, Day Run)
- **Sprint review:** Last night's "First Impressions & Core Loop" sprint completed successfully
  - Session summary ✅, Onboarding CTA ✅, Homepage redesign ✅, Dashboard continue card ✅, Grammar interconnection ✅
- **New sprint set:** "Retention & Habit Formation"
  - #1 priority: Streak system (🔥 daily streaks in localStorage)
  - #2: XP system (earn points for every learning action)
  - #3: Daily goal (set target words, track progress)
  - #4: Light mode audit (carried over)
  - #5: Learning path (structured beginner roadmap)
- **Strategic insight:** We built the first impression, now we need the habit loop. Duolingo's entire $8B valuation is built on streaks + daily goals. Even a basic localStorage implementation gives us this.
- Updated STRATEGY.md, FEATURES.md, IMPROVEMENTS.md with tonight's assignments
- Assigned: Cron 2 → light mode + streak design, Cron 3 → build streak/XP/goal, Cron 4 → learning path + navbar, Cron 5 → QA

### Cron 4 — Improvements (7:00 AM)
- **Dashboard "Continue where you left off" card:**
  - Smart detection of user progress from localStorage
  - Suggests next grammar lesson, flashcard practice, phrases, games
  - Shows "Quick Start" card for brand-new users (0 progress) with 3 action buttons
  - Personalized text based on cards learned count
- **Grammar → Flashcard interconnection:**
  - Each grammar lesson now shows "Related Flashcard Decks" section
  - 10 grammar topics mapped to relevant vocabulary decks (to-be → greetings, family, jobs; articles → daily routines, food; etc.)
  - Fallback decks (top-2000-words, verbs-common) for unmapped lessons
  - Previous/Next lesson navigation added to all grammar lesson pages
  - Premium users see interconnection links too (unlocked via JS)
- Deployed to Cloudflare Pages ✅
- Git committed & pushed

### Cron 3 — Features (5:00 AM)
- **Session Summary after flashcard practice:**
  - Tracks correct/wrong counts and session duration in real-time
  - Shows 4-stat grid: total words, accuracy %, time, correct/total
  - Green/red accuracy bar visualization
  - "Hardest words" section showing top 5 most-missed words with attempt counts
  - Words-per-minute speed stat
  - Performance rating with emoji (🏆/👍/💪/📚) based on accuracy
  - 3D Duolingo-style restart button
- **Onboarding CTA on homepage:**
  - New section between hero and Word of Day
  - Gradient background with 👋 emoji
  - "ახალი ხარ? დაიწყე აქედან!" heading
  - 3 action buttons: Flashcards, Grammar A1, Games
  - Responsive layout (stacks on mobile)
- Deployed to Cloudflare Pages ✅
- Git committed & pushed

### Cron 2 — Design (3:00 AM)
- **Extracted 365 hardcoded words** from index.astro → `public/data/words-of-day.json`
  - Homepage went from 472 lines to ~100 lines
- **Homepage redesign — vibrant & engaging:**
  - Gradient text hero (sky→green) replacing plain muted text
  - "#1 platform" badge with green accent
  - 3D Duolingo-style green CTA buttons (border-b-4 press effect)
  - Colorful stat badges (sky, indigo, amber, rose) replacing white/10
  - Word of the Day: gradient top bar, sky-300 translation color
  - Feature cards: icon overlays, hover lift (-translate-y-1)
  - CTA section: gradient bg, accent bar, "უფასოდ" in green
- **Light mode CSS** additions for new color classes (green-500, sky-400, gradients)
- **Fixed Cloudflare deploy** — removed duplicate `flashcards/audio/words/` (16k files) to stay under 20k limit
- Deployed & verified via screenshot ✅
- Git committed & pushed

### Cron 1 — Strategy (1:00 AM)
- Reviewed live site: homepage, grammar, flashcards, competitor (lingwing.com)
- Set sprint theme: "First Impressions & Core Loop"
- Identified biggest gap: no onboarding flow, no session summary, no learning path
- Homepage has 75+ hardcoded words (472 lines!) — flagged for extraction
- Updated STRATEGY.md with clear sprint goals and cron assignments
- Updated FEATURES.md — prioritized sprint items, reorganized backlog
- Updated IMPROVEMENTS.md — added sprint items
- Updated QA-LOG.md — logged 3 new issues found
- Assigned work to Cron 2-5 for tonight

### Initial Setup (earlier)
- Deployed to Cloudflare Pages (fluentge.pages.dev)
- Created GitHub repo (mustafa-agent/fluentge)
- Fixed Firebase authorized domains for Google SSO
- Fixed broken card in weather-climate.json
- Created cron system with 5 overnight jobs
