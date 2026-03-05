# FluentGe Improvements Backlog

## UX Improvements 🎯

### Navigation & Flow
- [ ] Better navbar — clear sections, active state, mobile hamburger
- [ ] Breadcrumbs on deep pages
- [ ] "Back to..." buttons that make sense contextually
- [x] Smoother page transitions ✅ Cron 4, Mar 5 (screen fade-in animation)
- [ ] Better 404 page

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

## 🎯 THIS SPRINT (Mar 6 night) — "Content Quality & User Journey Polish"
- [ ] **🎯 Level personalization** — Placement results affect all recommendations ← Cron 3
- [ ] **🎧 Podcast quiz data** — Real comprehension questions per episode ← Cron 3
- [ ] **🏠 Homepage→Placement flow** — Optimize new user journey ← Cron 4
- [ ] **🔍 SEO audit** — Meta tags, structured data, Georgian keywords ← Cron 4
- [ ] **🎮 Game verification** — Test all 30+ games ← Cron 4

## Recently Improved ✅
- [x] Free grammar expanded 3→8 A1 lessons (present-simple, present-continuous, subject-pronouns, possessive-adjectives, prepositions-of-place) (Cron 4, Mar 1)
- [x] Achievements system — 10 badges on dashboard with earned/locked states, gradient icons, progress counter (Cron 4, Mar 1)
- [x] Navbar streak 🔥 + XP ⭐ badges — shows in desktop & mobile nav when user has progress (Cron 4B, Feb 28)
- [x] Learning path roadmap — 10-step beginner path on Dashboard with completion tracking (Cron 4B, Feb 28)
- [x] Dashboard "continue where you left off" — smart card with personalized suggestions based on progress (Cron 4, Feb 28)
- [x] Grammar → Flashcard interconnection — related decks shown after each grammar lesson + prev/next navigation (Cron 4, Feb 28)

## In Progress 🔄
(none)

## Completed This Sprint ✅ (Mar 5 day)
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
