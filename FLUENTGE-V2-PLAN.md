# FluentGe V2 - Complete Rebuild Plan

## Vision
Transform FluentGe from a simple flashcard app into a full Duolingo/Anki-style English learning platform for Georgians. Gamified, engaging, with spaced repetition and progress tracking.

---

## PHASE 1: Core Spaced Repetition System (Foundation)
**Priority: HIGHEST — Everything depends on this**

### 1.1 User Accounts (Firebase Auth)
- Email/password registration + Google sign-in
- User profile (name, avatar, join date)
- Store user data in Firestore

### 1.2 Spaced Repetition Algorithm (SM-2)
- Implement SM-2 algorithm (same as Anki)
- Card states: New → Learning → Review → Mastered
- Based on answer quality, schedule next review:
  - Easy: show in 4d → 10d → 30d → 90d
  - Good: show in 1d → 3d → 7d → 15d → 30d
  - Hard: show again in 10min → 1d → 3d
  - Again: show immediately, then in 10min
- Store per-card review data in Firestore:
  - ease factor, interval, next review date, review count

### 1.3 Deck Management
- "Add to My Decks" button on each deck
- User's dashboard shows their active decks
- Each deck shows: cards due for review, new cards available
- Daily new card limit (e.g., 20 new cards/day, configurable)

### 1.4 Review Session
- Show cards due for review first (sorted by overdue)
- Then show new cards if user wants
- After flip, user rates: Again / Hard / Good / Easy
- Cards scheduled automatically based on rating

### 1.5 Free/Premium Model
- 3 free decks (Greetings, Numbers, Food) — already set
- Premium: all 99 decks + Top 5000 deck
- Subscription: 9.99 GEL/month (keep current pricing)
- Free users can try review system with free decks

---

## PHASE 2: Card Enhancements
**Make cards more engaging and useful**

### 2.1 Card Direction Toggle
- Default: English → Georgian (recognition)
- Reverse: Georgian → English (production/recall)
- User can choose per-session or in settings
- In reverse mode: show Georgian, user says English out loud
- On flip: show English answer + auto-play audio pronunciation

### 2.2 Text Input Mode
- Optional typing mode instead of self-rating
- Show Georgian word → user types English
- Auto-check: correct = green confetti, wrong = red + show correct answer
- Partial credit for close answers (typo tolerance)
- Counts as review for spaced repetition

### 2.3 AI-Generated Images on Cards
- Generate association images for each word using AI
- Show image on BOTH sides of card (helps visual memory)
- Start with top 500 most common words
- Use free AI image generation or pre-generate batch
- Store in /public/images/cards/

### 2.4 Audio on All Cards
- Auto-play English pronunciation when card flips to English side
- Use Web Speech API (free) or edge-tts (better quality)
- Pre-generate MP3s for all 5000 words

---

## PHASE 3: Gamification (Duolingo Style)
**Make learning addictive**

### 3.1 XP System
- Earn XP for every card reviewed
- Bonus XP for correct answers, streaks, completing decks
- XP rewards:
  - Review card: +10 XP
  - Correct answer: +5 bonus
  - Daily goal met: +50 XP
  - 7-day streak: +100 XP

### 3.2 Levels & Progress
- Level up every X XP (increasing thresholds)
- Visual level badge on profile
- Progress bars everywhere (deck progress, daily progress, overall)

### 3.3 Streaks & Goals
- Daily practice streak counter (like Duolingo)
- User sets daily goal: 5min / 10min / 15min / 20min
- Streak freeze option (miss 1 day without losing streak)
- Visual streak calendar

### 3.4 Confetti & Animations
- Confetti burst on correct answer
- Level-up animation
- Streak milestone celebrations
- Sound effects (optional, toggleable)

### 3.5 Leaderboard
- Weekly leaderboard: most XP earned this week
- All-time leaderboard
- Show username + level + XP
- Top 3 get special badges

---

## PHASE 4: Dashboard & Progress
**User's home base**

### 4.1 User Dashboard
- Words learned total (tracked by spaced repetition)
- Cards due today
- Current streak
- XP / Level
- Active decks with progress
- Recent activity graph (reviews per day)
- "Start Review" button (all due cards across decks)

### 4.2 Vocabulary Tracker
- Total words known (mastered cards)
- Words by level: A1, A2, B1, B2, C1
- Progress toward "5000 words" goal
- Visual word cloud or grid

---

## PHASE 5: Content Expansion

### 5.1 Top 5000 English Words Deck
- Most commonly used 5000 English words
- Organized by frequency (most common first)
- Georgian translations + pronunciation
- Levels: 1-1000 (A1), 1001-2000 (A2), 2001-3500 (B1), 3501-5000 (B2+)

### 5.2 Long-Form Podcasts
- 10-20 minute episodes (good for bus/train commute)
- Mix of dialogues AND monologues
- Topics: interesting subjects (science, history, culture, business, etc.)
- Super clear articulation, slow speed
- With transcript + vocabulary list per episode

### 5.3 Light/Dark Mode
- Toggle in navbar/settings
- Dark mode (current) as default
- Light mode for those who prefer it
- Save preference in localStorage / user profile

---

## PHASE 6: Top 5000 Words Deck (Big Content)
- Generate/curate top 5000 English words with Georgian translations
- Add pronunciation, example sentences
- Organize by frequency bands
- This becomes the MAIN premium feature

---

## Technical Stack
- **Auth:** Firebase Authentication (email + Google)
- **Database:** Firestore (user data, card progress, XP, streaks)
- **Frontend:** React (existing) + new components
- **Audio:** Web Speech API + pre-generated MP3s
- **Images:** AI-generated (batch) stored as static files
- **Hosting:** Surge.sh (current) → may need Cloudflare Pages for scale

---

## Implementation Order
1. PHASE 1 (Spaced Repetition + Auth + Deck Management) — **WEEK 1-2**
2. PHASE 3.4 (Confetti/animations — quick win) — **WEEK 1**
3. PHASE 2.1-2.2 (Card direction + typing) — **WEEK 2**
4. PHASE 4 (Dashboard) — **WEEK 2-3**
5. PHASE 3 (Full gamification) — **WEEK 3**
6. PHASE 5.3 (Light/dark mode) — **WEEK 3**
7. PHASE 5.1 (5000 words deck) — **WEEK 3-4**
8. PHASE 2.3 (AI images) — **WEEK 4+**
9. PHASE 5.2 (Long podcasts) — **ONGOING**

---

## Revenue Model
- Free: 3 decks, spaced repetition, basic gamification
- Premium (9.99 GEL/month): All decks, Top 5000, leaderboard, advanced stats
- Users can TRY the full experience with free decks before paying
