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

## 🎯 THIS SPRINT (Feb 28 night)
- [ ] Homepage index.astro cleanup — extract word list, reduce from 472 lines ← Cron 2
- [ ] Light/dark mode audit on all pages ← Cron 2
- [ ] Dashboard: "continue where you left off" card ← Cron 4
- [ ] Grammar → flashcards interconnection links ← Cron 4

## Recently Improved ✅
(Crons update this section)

## In Progress 🔄
(Crons update this section)

## Notes
- Each improvement cron picks 2 items
- Focus on things that make the biggest difference to user experience
- Always test in both light and dark mode after changes
