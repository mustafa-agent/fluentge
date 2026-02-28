# FluentGe Changelog

## Format
Each cron logs what it did here. Most recent first.

---

## 2026-02-28

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
