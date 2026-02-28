# FluentGe Design System

## Inspiration
- **Lingwing.com** — Direct competitor, study their Georgian language UX
- **Duolingo** — Fun, colorful, gamified, accessible
- **Memrise** — Clean cards, great review experience
- **Notion** — Clean, readable, well-spaced

## Color Palette

### Dark Mode (Default)
- **Background:** #1C1C1E
- **Card Background:** #242426
- **Card Hover:** #2E2E30
- **Text Primary:** #F5F5F0
- **Text Muted:** #6B6B65
- **Primary Accent:** #C8C8C0 (currently muted — NEEDS to be more vibrant)
- **Success:** green-400
- **Warning:** yellow-400
- **Error:** red-400

### Light Mode
- **Background:** #F0F2F5
- **Card Background:** #FFFFFF
- **Card Hover:** #F0F0F0
- **Text Primary:** #1A1A2E
- **Text Muted:** #6B7280
- **Primary Accent:** #4A4A44

## Known Issues
- Light mode text visibility may be poor in some areas
- Color scheme feels muted/bland — needs more life
- Inconsistent styling between Astro pages and React flashcard app
- Some pages use hardcoded colors instead of CSS variables

## Design Rules
1. ALL text must be readable in BOTH light and dark mode
2. Use CSS variables exclusively — never hardcode colors
3. Cards should have subtle hover effects
4. Buttons should have clear affordance (look clickable)
5. Active/selected states must be visually distinct
6. Spacing should be generous — don't crowd elements
7. Use strategic color to highlight progress, achievements, correct/wrong answers
8. Icons/emoji should complement, not replace labels
9. Transitions should be smooth (200-300ms)
10. Mobile-first responsive design

## Typography
- **Headings:** Playfair Display (serif) — elegant, premium feel
- **Body:** Inter — clean, readable
- **Font sizes:** Use Tailwind scale consistently

## Component Patterns
- **Cards:** rounded-2xl, border border-white/5 (dark) or shadow (light)
- **Buttons:** rounded-xl, clear primary/secondary/ghost variants
- **Progress bars:** rounded-full, gradient fills
- **Badges:** rounded-full, small, colorful

## TODO (Design Cron)
- [x] Extract hardcoded words from homepage to JSON (365 words → words-of-day.json)
- [x] Homepage vibrant redesign (gradient text, 3D buttons, colorful badges)
- [x] Add light mode CSS for new color classes
- [ ] Audit ALL other pages for light mode visibility (grammar, games, podcast, phrases, premium, about)
- [ ] Replace flat buttons with 3D buttons on other pages (grammar, games)
- [ ] Ensure flashcard app matches website design
- [ ] Add micro-animations for engagement
- [ ] Standardize card/button components across all pages
- [ ] Dark mode: consider richer navy bg instead of flat #1C1C1E

## Deploy Note
⚠️ Must remove `dist/flashcards/audio/words/` before deploying (16k duplicate files hit 20k limit).
Add to build script or do manually after build.
