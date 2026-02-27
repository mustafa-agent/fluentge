# FluentGe QA & Testing Log

## Testing Checklist

### Critical Pages
- [ ] / (homepage) — loads, links work, looks good
- [ ] /flashcards/ — loads, decks show, cards flip, audio plays
- [ ] /grammar — lesson list loads, individual lessons render
- [ ] /podcast — page loads, audio plays
- [ ] /games — page loads, games launch and work
- [ ] /dashboard — loads, shows progress
- [ ] /login — Google SSO works, email login works
- [ ] /register — registration flow works
- [ ] /premium — page loads, payment flow clear
- [ ] /about — loads correctly

### Flashcard App
- [ ] All 127 decks load without errors
- [ ] Card flip animation works
- [ ] Audio plays for both EN and KA
- [ ] Progress saves to localStorage
- [ ] SRS mode works
- [ ] Quiz mode works
- [ ] Challenge friend feature works
- [ ] Free/premium deck gating works

### Cross-Browser/Mode
- [ ] Dark mode — all text visible
- [ ] Light mode — all text visible
- [ ] Mobile layout — no overflow, readable
- [ ] Desktop layout — proper spacing

### Known Bugs
(Crons log bugs here)

### Fixed Bugs ✅
- [x] weather-climate.json had card with missing english/georgian fields (Feb 27)
- [x] Firebase authorized domains didn't include fluentge.pages.dev (Feb 27)

## Last Full QA Run
- **Date:** Never (first run pending)
- **Status:** —
- **Issues Found:** —

## Testing Method
1. Build the site locally
2. Check each page loads without console errors
3. Test interactive features (cards, games, auth)
4. Verify light/dark mode
5. Check mobile responsiveness
6. Log any issues found
7. Fix critical issues immediately
8. Deploy if fixes were made
