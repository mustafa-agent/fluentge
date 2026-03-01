# FluentGe Improvements Backlog

## UX Improvements 🎯

### Navigation & Flow
- [ ] Better navbar — clear sections, active state, mobile hamburger
- [ ] Breadcrumbs on deep pages
- [ ] "Back to..." buttons that make sense contextually
- [ ] Smoother page transitions
- [ ] Better 404 page

### Flashcard UX
- [ ] Swipe gestures on mobile
- [x] Keyboard shortcuts (Space=flip/next, S=audio, 1=focus input) ✅ Cron 4B, Mar 1
- [ ] Better progress bar during session
- [ ] Card count "12/50" clearly visible
- [ ] Sound auto-play option
- [ ] Confetti/celebration on milestones (every 10 cards, deck completion)

### Grammar Section
- [ ] Interactive exercises within lessons (not just reading)
- [ ] Progress indicator per lesson
- [ ] "Mark as complete" functionality
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

## 🎯 THIS SPRINT (Mar 2 night) — "Dashboard Game Stats & Dynamic Loading"
- [ ] **Dashboard game stats section** — games played, XP, level, recent activity ← Cron 4
- [ ] **Dynamic deck loading UX** — loading spinner per deck, smooth transition ← Cron 3/4
- [ ] **Audio autoplay toggle** — settings UI + persistence ← Cron 4
- [ ] **Mobile swipe gestures** — swipe left/right on flashcards ← Cron 4

## Recently Improved ✅
- [x] Free grammar expanded 3→8 A1 lessons (present-simple, present-continuous, subject-pronouns, possessive-adjectives, prepositions-of-place) (Cron 4, Mar 1)
- [x] Achievements system — 10 badges on dashboard with earned/locked states, gradient icons, progress counter (Cron 4, Mar 1)
- [x] Navbar streak 🔥 + XP ⭐ badges — shows in desktop & mobile nav when user has progress (Cron 4B, Feb 28)
- [x] Learning path roadmap — 10-step beginner path on Dashboard with completion tracking (Cron 4B, Feb 28)
- [x] Dashboard "continue where you left off" — smart card with personalized suggestions based on progress (Cron 4, Feb 28)
- [x] Grammar → Flashcard interconnection — related decks shown after each grammar lesson + prev/next navigation (Cron 4, Feb 28)

## In Progress 🔄
- Dashboard game stats (Sprint Mar 2 night)
- Dynamic deck loading (Sprint Mar 2 night)

## Previously Completed ✅ (Feb 28)
- ✅ Light mode audit — all pages verified
- ✅ Streak/XP/Daily Goal CSS and visual design
- ✅ Navbar streak + XP display
- ✅ Learning path roadmap on dashboard

## Notes
- Each improvement cron picks 2 items
- Focus on things that make the biggest difference to user experience
- Always test in both light and dark mode after changes
