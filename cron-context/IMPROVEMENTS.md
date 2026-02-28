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
- [ ] Keyboard shortcuts (space to flip, 1/2/3 for rating)
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

## 🎯 THIS SPRINT (Feb 28 night) — "Retention & Habit Formation"
- [ ] **Light mode audit on ALL pages** (grammar, games, podcast, phrases, premium, about) ← Cron 2
- [ ] **Design streak/XP visual components** (🔥 badge, XP counter, progress bar) ← Cron 2
- [x] **Navbar streak + XP display** ← Cron 4 ✅
- [x] **Learning path roadmap on dashboard** ← Cron 4 ✅

## Recently Improved ✅
- [x] Navbar streak 🔥 + XP ⭐ badges — shows in desktop & mobile nav when user has progress (Cron 4B, Feb 28)
- [x] Learning path roadmap — 10-step beginner path on Dashboard with completion tracking (Cron 4B, Feb 28)
- [x] Dashboard "continue where you left off" — smart card with personalized suggestions based on progress (Cron 4, Feb 28)
- [x] Grammar → Flashcard interconnection — related decks shown after each grammar lesson + prev/next navigation (Cron 4, Feb 28)

## In Progress 🔄
- Light mode audit (carried over from last sprint)
- Streak/XP visual design

## Notes
- Each improvement cron picks 2 items
- Focus on things that make the biggest difference to user experience
- Always test in both light and dark mode after changes
