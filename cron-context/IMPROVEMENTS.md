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

## 🎯 THIS SPRINT (Mar 1 night) — "Active Learning & Depth"
- [ ] **Design quiz mode UI** (multiple choice cards, correct/wrong states, results) ← Cron 2
- [ ] **Design typing mode UI** (input field, validation feedback) ← Cron 2
- [ ] **Design achievement badges** (icons, colors, unlock animations) ← Cron 2
- [ ] **Expand free grammar** (3→8 free A1 lessons) ← Cron 4
- [ ] **Achievements system on dashboard** ← Cron 4

## Recently Improved ✅
- [x] Navbar streak 🔥 + XP ⭐ badges — shows in desktop & mobile nav when user has progress (Cron 4B, Feb 28)
- [x] Learning path roadmap — 10-step beginner path on Dashboard with completion tracking (Cron 4B, Feb 28)
- [x] Dashboard "continue where you left off" — smart card with personalized suggestions based on progress (Cron 4, Feb 28)
- [x] Grammar → Flashcard interconnection — related decks shown after each grammar lesson + prev/next navigation (Cron 4, Feb 28)

## In Progress 🔄
- Quiz/Typing mode design (Sprint Mar 1 night)
- Achievements design (Sprint Mar 1 night)

## Previously Completed ✅ (Feb 28)
- ✅ Light mode audit — all pages verified
- ✅ Streak/XP/Daily Goal CSS and visual design
- ✅ Navbar streak + XP display
- ✅ Learning path roadmap on dashboard

## Notes
- Each improvement cron picks 2 items
- Focus on things that make the biggest difference to user experience
- Always test in both light and dark mode after changes
