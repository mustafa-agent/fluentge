import { useState, useEffect, useRef, useCallback } from 'react';
import { type Deck, type FlashCard, loadDeck } from './lib/deck-loader';
import { deckIndex, type DeckMeta } from './lib/deck-index';
import { loadFromCloud, syncToCloud, syncNow, isLoggedIn, startRealtimeSync, stopRealtimeSync, setOnSyncCallback } from './lib/firebase-sync';
import { addXP, recordDailyActivity } from './lib/gamification';

/* ═══════════════════════════════════════════════════════════ */
/*                     CLICK SOUND                             */
/* ═══════════════════════════════════════════════════════════ */

let _audioCtx: AudioContext | null = null;
function playClick() {
  try {
    if (!_audioCtx) _audioCtx = new AudioContext();
    const ctx = _audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  } catch {}
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SRS ENGINE                              */
/* ═══════════════════════════════════════════════════════════ */

interface CardSRS {
  interval: number;       // days until next review
  easeFactor: number;     // multiplier (starts 2.5)
  nextReview: number;     // timestamp
  lastReview: number;     // timestamp
  repetitions: number;    // how many times reviewed
  type: 'new' | 'learning' | 'review';
}

function initSRS(): CardSRS {
  return { interval: 0, easeFactor: 2.5, nextReview: 0, lastReview: 0, repetitions: 0, type: 'new' };
}

function gradeSRS(card: CardSRS, grade: 'again' | 'hard' | 'good' | 'easy'): CardSRS {
  const now = Date.now();
  let { interval, easeFactor, repetitions } = card;

  if (grade === 'again') {
    // 1 minute
    repetitions = 0;
    interval = 0;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    return { interval, easeFactor, nextReview: now + 1 * 60 * 1000, lastReview: now, repetitions, type: 'learning' };
  }

  if (grade === 'hard') {
    // First time: 10 minutes, then grows ×1.5
    if (repetitions === 0) {
      repetitions++;
      interval = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      return { interval, easeFactor, nextReview: now + 10 * 60 * 1000, lastReview: now, repetitions, type: 'learning' };
    }
    repetitions++;
    interval = Math.max(1, Math.round(interval * 1.5));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    return { interval, easeFactor, nextReview: now + interval * 24 * 60 * 60 * 1000, lastReview: now, repetitions, type: 'review' };
  }

  repetitions++;

  if (grade === 'good') {
    if (repetitions <= 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(interval * easeFactor);
  } else if (grade === 'easy') {
    if (repetitions <= 1) interval = 3;
    else interval = Math.round(interval * easeFactor * 1.3);
    easeFactor = Math.max(1.3, easeFactor + 0.15);
  }

  return {
    interval,
    easeFactor,
    nextReview: now + interval * 24 * 60 * 60 * 1000,
    lastReview: now,
    repetitions,
    type: 'review',
  };
}

// Get human-readable interval for button hints
function getIntervalHint(card: CardSRS | undefined, grade: 'again' | 'hard' | 'good' | 'easy'): string {
  const c = card || initSRS();
  const result = gradeSRS({ ...c }, grade);
  if (grade === 'again') return '1 წთ';
  if (result.interval === 0) return '10 წთ';
  if (result.interval === 1) return '1 დღე';
  if (result.interval < 30) return `${result.interval} დღე`;
  if (result.interval < 365) return `${Math.round(result.interval / 30)} თვე`;
  return `${Math.round(result.interval / 365)} წელი`;
}

/* ═══════════════════════════════════════════════════════════ */
/*                     STORAGE                                 */
/* ═══════════════════════════════════════════════════════════ */

const SRS_KEY = 'fluentge_srs_v2';
const STUDY_DECKS_KEY = 'fluentge_study_decks';
const DAILY_LIMIT_KEY = 'fluentge_daily_limit';
const DAILY_NEW_KEY = 'fluentge_daily_new'; // tracks new cards shown today per deck

interface StudyDeckEntry {
  deckId: string;
  mode: 'ka-en' | 'en-ka' | 'mixed';
  studyStyle: 'anki' | 'free';
  addedAt: number;
}

function loadAllSRS(): Record<string, CardSRS> {
  try { return JSON.parse(localStorage.getItem(SRS_KEY) || '{}'); } catch { return {}; }
}

function saveSRS(cardId: string, srs: CardSRS) {
  const all = loadAllSRS();
  all[cardId] = srs;
  localStorage.setItem(SRS_KEY, JSON.stringify(all));
}

function getCardKey(card: FlashCard, mode: string): string {
  return `${card.english.toLowerCase().replace(/\s+/g, '_')}_${mode}`;
}

function loadStudyDecks(): StudyDeckEntry[] {
  try { return JSON.parse(localStorage.getItem(STUDY_DECKS_KEY) || '[]'); } catch { return []; }
}

function saveStudyDecks(decks: StudyDeckEntry[]) {
  localStorage.setItem(STUDY_DECKS_KEY, JSON.stringify(decks));
  localStorage.setItem('fluentge_study_decks_ts', Date.now().toString());
}

function getDailyLimit(): number {
  try { return parseInt(localStorage.getItem(DAILY_LIMIT_KEY) || '20'); } catch { return 20; }
}

function setDailyLimit(n: number) {
  localStorage.setItem(DAILY_LIMIT_KEY, String(n));
  localStorage.setItem('fluentge_daily_limit_ts', String(Date.now()));
}

// Get today's "study day" — resets at 10:00 AM local time
function getStudyDay(): string {
  const now = new Date();
  const resetHour = 10; // 10:00 AM
  if (now.getHours() < resetHour) {
    // Before 10 AM = still yesterday's study day
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }
  return now.toISOString().split('T')[0];
}

// Get milliseconds until next 10:00 AM reset
function getMsUntilReset(): number {
  const now = new Date();
  const resetHour = 10;
  const nextReset = new Date(now);
  if (now.getHours() >= resetHour) {
    nextReset.setDate(nextReset.getDate() + 1);
  }
  nextReset.setHours(resetHour, 0, 0, 0);
  return nextReset.getTime() - now.getTime();
}

// Track how many new cards shown today per deck+mode
function getDailyNewCount(deckId: string, mode: string): number {
  try {
    const data = JSON.parse(localStorage.getItem(DAILY_NEW_KEY) || '{}');
    const today = getStudyDay();
    return data[`${deckId}_${mode}_${today}`] || 0;
  } catch { return 0; }
}

function addDailyNewCount(deckId: string, mode: string, count: number) {
  try {
    const data = JSON.parse(localStorage.getItem(DAILY_NEW_KEY) || '{}');
    const today = getStudyDay();
    const key = `${deckId}_${mode}_${today}`;
    data[key] = (data[key] || 0) + count;
    // Clean old days
    for (const k of Object.keys(data)) {
      if (!k.endsWith(today)) delete data[k];
    }
    localStorage.setItem(DAILY_NEW_KEY, JSON.stringify(data));
  } catch {}
}

// Free mode progress functions
function getFreeProgress(deckId: string, mode: string): string[] {
  try {
    const key = `fluentge_free_progress_${deckId}_${mode}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function saveFreeProgress(deckId: string, mode: string, completedCards: string[]) {
  const key = `fluentge_free_progress_${deckId}_${mode}`;
  localStorage.setItem(key, JSON.stringify(completedCards));
  localStorage.setItem('fluentge_free_progress_ts', String(Date.now()));
}

/* ═══════════════════════════════════════════════════════════ */
/*                     AUDIO                                   */
/* ═══════════════════════════════════════════════════════════ */

let currentAudio: HTMLAudioElement | null = null;

function speak(text: string, lang: string = 'en-US') {
  // Stop any playing audio
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }

  // Try Google Translate TTS first (much better quality)
  const tl = lang.startsWith('ka') ? 'ka' : 'en';
  const encoded = encodeURIComponent(text.slice(0, 200));
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${tl}&client=tw-ob`;
  const audio = new Audio(url);
  currentAudio = audio;
  audio.play().catch(() => {
    // Fallback to browser TTS
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && !v.localService)
      || voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  });
}

/* ═══════════════════════════════════════════════════════════ */
/*                     TYPES                                   */
/* ═══════════════════════════════════════════════════════════ */

type Mode = 'ka-en' | 'en-ka' | 'mixed';
type Screen = 'study-page' | 'categories' | 'session' | 'complete';

const MODE_LABELS: Record<Mode, string> = { 'ka-en': '🇬🇪→🇬🇧', 'en-ka': '🇬🇧→🇬🇪', 'mixed': '🔀 შერეული' };
const STYLE_LABELS: Record<'anki' | 'free', string> = { 
  'anki': 'ანკი რეჟიმი', 
  'free': 'თავისუფალი რეჟიმი' 
};

/* ═══════════════════════════════════════════════════════════ */
/*                     MAIN APP                                */
/* ═══════════════════════════════════════════════════════════ */

export default function App() {
  const [screen, setScreen] = useState<Screen>('study-page');
  const [studyDecks, setStudyDecks] = useState<StudyDeckEntry[]>(loadStudyDecks());
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dailyLimit, setDailyLimitState] = useState(getDailyLimit());

  // Style selection state
  const [showStyleModal, setShowStyleModal] = useState<{ meta: DeckMeta; mode: Mode } | null>(null);
  const [showModeHelp, setShowModeHelp] = useState(false);

  // Session state
  const [sessionDeckId, setSessionDeckId] = useState('');
  const [sessionMode, setSessionMode] = useState<Mode>('mixed');
  const [sessionStyle, setSessionStyle] = useState<'anki' | 'free'>('anki');
  const [queue, setQueue] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [xpPopup, setXpPopup] = useState<number | null>(null);
  const [guess, setGuess] = useState('');
  const [typedCorrect, setTypedCorrect] = useState<boolean | null>(null); // null = not submitted yet
  const inputRef = useRef<HTMLInputElement>(null);
  const [sessionStats, setSessionStats] = useState({ total: 0, again: 0, hard: 0, good: 0, easy: 0 });
  const [newInSession, setNewInSession] = useState(0);
  const [reviewInSession, setReviewInSession] = useState(0);
  
  // Free mode state
  const [freeQueue, setFreeQueue] = useState<FlashCard[]>([]);
  const [freeCompleted, setFreeCompleted] = useState<string[]>([]);

  // Deck counts cache (for study page)
  const COMPLETION_THRESHOLD = 14; // days — category complete when all cards have interval >= this
  const [deckCounts, setDeckCounts] = useState<Record<string, { newCards: number; reviewCards: number; nextReviewAt: number | null; completed: boolean; progress: number }>>({});
  const [now, setNow] = useState(Date.now());

  // Tick every second for countdown + auto-refresh counts when cards become due
  useEffect(() => {
    const iv = setInterval(() => {
      const n = Date.now();
      setNow(n);
      // Check if any deck's nextReviewAt just passed — refresh counts
      for (const key of Object.keys(deckCounts)) {
        const c = deckCounts[key];
        if (c.nextReviewAt && c.nextReviewAt <= n && c.newCards === 0 && c.reviewCards === 0) {
          refreshCounts();
          break;
        }
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [deckCounts]);

  // Firebase sync on load + real-time listener
  useEffect(() => {
    // Handle XP reset from dashboard
    const params = new URLSearchParams(window.location.search);
    if (params.get('resetxp') === '1') {
      localStorage.setItem('totalXP', '0');
      localStorage.setItem('currentStreak', '0');
      localStorage.removeItem('lastPracticeDate');
      localStorage.removeItem('fluentge-daily-history');
      syncToCloud().then(() => {
        window.history.replaceState({}, '', window.location.pathname);
        window.location.href = '/dashboard/';
      }).catch(() => {
        window.location.href = '/dashboard/';
      });
      return;
    }

    // Set callback for real-time updates from other devices
    setOnSyncCallback(() => {
      setStudyDecks(loadStudyDecks());
      setDailyLimitState(getDailyLimit());
      refreshCounts();
    });
    
    loadFromCloud().then(() => {
      setStudyDecks(loadStudyDecks());
      // Start real-time listener after initial load
      startRealtimeSync().catch(() => {});
    }).catch(() => {});
    const syncIv = setInterval(() => syncToCloud().catch(() => {}), 30000);
    const onUnload = () => syncToCloud().catch(() => {});
    window.addEventListener('beforeunload', onUnload);
    const onVis = () => {
      if (document.visibilityState === 'hidden') syncToCloud().catch(() => {});
      if (document.visibilityState === 'visible') {
        loadFromCloud().then(() => setStudyDecks(loadStudyDecks())).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(syncIv); window.removeEventListener('beforeunload', onUnload); document.removeEventListener('visibilitychange', onVis); stopRealtimeSync(); };
  }, []);

  // Refresh counts
  useEffect(() => {
    refreshCounts();
  }, [studyDecks]);

  async function refreshCounts() {
    const allSRS = loadAllSRS();
    const currentTime = Date.now();
    const limit = getDailyLimit();
    const counts: Record<string, { newCards: number; reviewCards: number; nextReviewAt: number | null; completed: boolean; progress: number }> = {};

    for (const entry of studyDecks) {
      const deck = await loadDeck(entry.deckId);
      if (!deck) continue;
      const mKey = entry.mode === 'mixed' ? 'mixed' : entry.mode === 'ka-en' ? 'kaen' : 'enka';
      const style = entry.studyStyle || 'anki'; // Backward compatibility
      let newCards = 0, reviewCards = 0;
      let nextReviewAt: number | null = null;
      let masteredCount = 0;
      const dailyUsed = getDailyNewCount(entry.deckId, mKey);
      const totalCards = deck.cards.length;

      if (style === 'free') {
        // Free mode: get completed cards count
        const completed = getFreeProgress(entry.deckId, mKey);
        masteredCount = completed.length;
        newCards = 0;
        reviewCards = totalCards - completed.length;
      } else {
        // Anki mode: existing logic
        for (const card of deck.cards) {
          const key = getCardKey(card, mKey);
          const srs = allSRS[key];
          if (!srs) {
            newCards++;
          } else if (srs.nextReview <= currentTime) {
            reviewCards++;
            if (srs.interval >= COMPLETION_THRESHOLD) masteredCount++;
          } else {
            if (srs.interval >= COMPLETION_THRESHOLD) masteredCount++;
            if (nextReviewAt === null || srs.nextReview < nextReviewAt) {
              nextReviewAt = srs.nextReview;
            }
          }
        }
        newCards = Math.max(0, Math.min(newCards, limit - dailyUsed));
      }

      const completed = totalCards > 0 && (style === 'free' ? masteredCount === totalCards : (newCards === 0 && masteredCount === totalCards));
      const progress = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

      counts[`${entry.deckId}_${entry.mode}_${style}`] = { newCards, reviewCards, nextReviewAt, completed, progress };
    }
    setDeckCounts(counts);
  }

  /* ─── Add deck to study page ─── */
  function addStudyDeck(deckId: string, mode: Mode, studyStyle: 'anki' | 'free' = 'anki') {
    const exists = studyDecks.some(d => d.deckId === deckId && d.mode === mode && d.studyStyle === studyStyle);
    if (exists) {
      setScreen('study-page');
      return;
    }
    // Clear any old progress when adding fresh
    const mKey = mode === 'mixed' ? 'mixed' : mode === 'ka-en' ? 'kaen' : 'enka';
    if (studyStyle === 'free') {
      localStorage.setItem(`fluentge_free_progress_${deckId}_${mKey}`, '[]');
      localStorage.setItem('fluentge_free_progress_ts', String(Date.now()));
    }
    const newDecks = [...studyDecks, { deckId, mode, studyStyle, addedAt: Date.now() }];
    setStudyDecks(newDecks);
    saveStudyDecks(newDecks);
    syncNow();
    setScreen('study-page');
  }

  const [confirmDelete, setConfirmDelete] = useState<{ deckId: string; mode: Mode; studyStyle: 'anki' | 'free' } | null>(null);

  function removeStudyDeck(deckId: string, mode: Mode, studyStyle: 'anki' | 'free') {
    const mKey = mode === 'mixed' ? 'mixed' : mode === 'ka-en' ? 'kaen' : 'enka';
    
    // 1. Remove from UI immediately
    const newDecks = studyDecks.filter(d => !(d.deckId === deckId && d.mode === mode));
    setStudyDecks(newDecks);
    saveStudyDecks(newDecks);
    setConfirmDelete(null);
    
    // 2. Clear ALL progress for this deck (both free and SRS)
    localStorage.setItem(`fluentge_free_progress_${deckId}_${mKey}`, '[]');
    localStorage.setItem('fluentge_free_progress_ts', String(Date.now()));
    
    // SRS cleanup async (doesn't block UI)
    loadDeck(deckId).then(deck => {
      if (deck) {
        const allSRS = loadAllSRS();
        for (const card of deck.cards) {
          delete allSRS[getCardKey(card, mKey)];
        }
        localStorage.setItem(SRS_KEY, JSON.stringify(allSRS));
      }
      // Force sync immediately so cloud also gets cleared progress
      syncToCloud().catch(() => {});
      refreshCounts();
    }).catch(() => {
      syncToCloud().catch(() => {});
      refreshCounts();
    });
  }

  /* ─── Start session ─── */
  async function startSession(entry: StudyDeckEntry, sessionType: 'new' | 'review') {
    setLoading(true);
    const deck = await loadDeck(entry.deckId);
    if (!deck) { setLoading(false); return; }

    const mKey = entry.mode === 'mixed' ? 'mixed' : entry.mode === 'ka-en' ? 'kaen' : 'enka';
    const style = entry.studyStyle || 'anki';

    setSessionDeckId(entry.deckId);
    setSessionMode(entry.mode);
    setSessionStyle(style);

    if (style === 'free') {
      // Free mode: load all remaining cards
      const completedCards = getFreeProgress(entry.deckId, mKey);
      const remaining = deck.cards.filter(card => !completedCards.includes(getCardKey(card, mKey)));
      
      // Shuffle remaining cards so order is different each session
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      
      setFreeCompleted(completedCards);
      setFreeQueue(remaining);
      
      if (remaining.length === 0) {
        setQueue([]);
        setScreen('complete');
      } else {
        setQueue(remaining);
        setCurrentIndex(0);
        setFlipped(false);
        setGuess('');
        setTypedCorrect(null);
        setSessionStats({ total: 0, again: 0, hard: 0, good: 0, easy: 0 });
        setScreen('session');
      }
    } else {
      // Anki mode: existing logic
      const allSRS = loadAllSRS();
      const currentTime = Date.now();
      const limit = getDailyLimit();
      const dailyUsed = getDailyNewCount(entry.deckId, mKey);

      const dueCards: FlashCard[] = [];
      const newCards: FlashCard[] = [];

      for (const card of deck.cards) {
        const key = getCardKey(card, mKey);
        const srs = allSRS[key];
        if (!srs) {
          newCards.push(card);
        } else if (srs.nextReview <= currentTime) {
          dueCards.push(card);
        }
      }

      // Sort due by most overdue
      dueCards.sort((a, b) => {
        const sa = allSRS[getCardKey(a, mKey)]?.nextReview || 0;
        const sb = allSRS[getCardKey(b, mKey)]?.nextReview || 0;
        return sa - sb;
      });

      let combined: FlashCard[] = [];

      if (sessionType === 'new') {
        const availableNew = Math.max(0, limit - dailyUsed);
        const newSlice = newCards.slice(0, availableNew);
        combined = newSlice;
        setNewInSession(newSlice.length);
        setReviewInSession(0);
        // Don't count new cards as used here — count them one by one when graded
      } else {
        combined = dueCards;
        setNewInSession(0);
        setReviewInSession(dueCards.length);
      }

      // Shuffle
      for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
      }

      if (combined.length === 0) {
        setQueue([]);
        setScreen('complete');
      } else {
        setQueue(combined);
        setCurrentIndex(0);
        setFlipped(false);
        setGuess('');
        setTypedCorrect(null);
        setSessionStats({ total: 0, again: 0, hard: 0, good: 0, easy: 0 });
        setScreen('session');
      }
    }
    setLoading(false);
  }

  /* ─── Current card logic ─── */
  const currentCard = queue[currentIndex] || null;
  const modeKey = sessionMode === 'mixed' ? 'mixed' : sessionMode === 'ka-en' ? 'kaen' : 'enka';

  const [mixedDir, setMixedDir] = useState<'ka-en' | 'en-ka'>('ka-en');
  useEffect(() => {
    if (sessionMode === 'mixed') setMixedDir(Math.random() < 0.5 ? 'ka-en' : 'en-ka');
  }, [currentIndex, sessionMode]);

  const effectiveDir = sessionMode === 'mixed' ? mixedDir : sessionMode;
  const question = currentCard ? (effectiveDir === 'ka-en' ? currentCard.georgian : currentCard.english) : '';
  const answer = currentCard ? (effectiveDir === 'ka-en' ? currentCard.english : currentCard.georgian) : '';

  function normalizeAnswer(s: string): string {
    return s.trim().toLowerCase().replace(/[.,!?;:'"()]/g, '');
  }

  function handleSubmitGuess() {
    if (!currentCard || !guess.trim()) return;
    const userAnswer = normalizeAnswer(guess);
    const correctAnswers = answer.split(/[;/,]/).map(s => normalizeAnswer(s));
    const isCorrect = correctAnswers.some(ans => ans === userAnswer || (ans.length > 3 && userAnswer.includes(ans)) || (userAnswer.length > 3 && ans.includes(userAnswer)));

    setTypedCorrect(isCorrect);
    setFlipped(true);

    if (isCorrect) {
      // Auto-grade as easy after a short delay
      setTimeout(() => handleGrade('easy'), 1200);
    }
  }

  function handleShowAnswer() {
    setFlipped(true);
    setTypedCorrect(false); // Treated as skipped/wrong
  }

  function handleGrade(grade: 'again' | 'hard' | 'good' | 'easy') {
    if (!currentCard) return;
    const key = getCardKey(currentCard, modeKey);

    if (sessionStyle === 'free') {
      // Free mode grading
      if (grade === 'good' || grade === 'easy') {
        // Correct - mark as completed + award XP
        addXP(2);
        setXpPopup(2); setTimeout(() => setXpPopup(null), 1200);
        const newCompleted = [...freeCompleted, key];
        setFreeCompleted(newCompleted);
        saveFreeProgress(sessionDeckId, modeKey, newCompleted);
        
        // Remove from queue
        const newQueue = queue.filter((_, i) => i !== currentIndex);
        setQueue(newQueue);
        
        if (newQueue.length === 0) {
          // All done!
          setScreen('complete');
          refreshCounts();
          return;
        }
        
        // Stay at same index if not last card, otherwise go to previous
        if (currentIndex >= newQueue.length) {
          setCurrentIndex(Math.max(0, newQueue.length - 1));
        }
      } else {
        // Wrong - move to end of queue
        const newQueue = [...queue];
        const wrongCard = newQueue.splice(currentIndex, 1)[0];
        newQueue.push(wrongCard);
        setQueue(newQueue);
        
        // Stay at same index if not last card, otherwise go to previous
        if (currentIndex >= newQueue.length) {
          setCurrentIndex(Math.max(0, newQueue.length - 1));
        }
      }
      
      setSessionStats(prev => ({
        total: prev.total + 1,
        again: prev.again + (grade === 'again' ? 1 : 0),
        hard: prev.hard + (grade === 'hard' ? 1 : 0),
        good: prev.good + (grade === 'good' ? 1 : 0),
        easy: prev.easy + (grade === 'easy' ? 1 : 0),
      }));
      
      setFlipped(false);
      setGuess('');
      setTypedCorrect(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Anki mode grading
      const allSRS = loadAllSRS();
      const current = allSRS[key] || initSRS();
      const updated = gradeSRS(current, grade);
      saveSRS(key, updated);
      syncNow();

      // Award XP: კარგი = +1, ადვილი = +2, others = 0
      if (grade === 'good') { addXP(1); setXpPopup(1); setTimeout(() => setXpPopup(null), 1200); }
      else if (grade === 'easy') { addXP(2); setXpPopup(2); setTimeout(() => setXpPopup(null), 1200); }

      // Count new card as used only when actually graded (not when session starts)
      if (current.repetitions === 0 && current.type === 'new') {
        addDailyNewCount(sessionDeckId, modeKey, 1);
      }

      // Track learned words
      if (grade !== 'again' && current.repetitions === 0) {
        try {
          const known: Array<{word: string, georgian: string}> = JSON.parse(localStorage.getItem('knownCards') || '[]');
          if (!known.some(k => k.word === currentCard.english)) {
            known.push({ word: currentCard.english, georgian: currentCard.georgian });
            localStorage.setItem('knownCards', JSON.stringify(known));
          }
        } catch {}
      }

      setSessionStats(prev => ({
        total: prev.total + 1,
        again: prev.again + (grade === 'again' ? 1 : 0),
        hard: prev.hard + (grade === 'hard' ? 1 : 0),
        good: prev.good + (grade === 'good' ? 1 : 0),
        easy: prev.easy + (grade === 'easy' ? 1 : 0),
      }));

      if (currentIndex + 1 < queue.length) {
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
        setGuess('');
        setTypedCorrect(null);
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        setScreen('complete');
        refreshCounts();
      }
    }
  }

  /* ─── Keyboard shortcuts ─── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (screen !== 'session') return;
      // Don't intercept when typing in input
      if (document.activeElement === inputRef.current) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) handleShowAnswer();
      }
      if (flipped && sessionStyle === 'anki') {
        if (e.key === '1') handleGrade('again');
        if (e.key === '2') handleGrade('hard');
        if (e.key === '3') handleGrade('good');
        if (e.key === '4') handleGrade('easy');
      }
      if (flipped && typedCorrect === false && sessionStyle === 'free') {
        if (e.key === '1') handleGrade('again');
        if (e.key === '2') handleGrade('good');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, flipped, currentIndex, queue, typedCorrect]);

  const progress = queue.length > 0 ? ((currentIndex + (flipped ? 0.5 : 0)) / queue.length) * 100 : 0;

  // Get current card's SRS for interval hints
  const currentSRS = currentCard ? loadAllSRS()[getCardKey(currentCard, modeKey)] : undefined;

  /* ═══════════════════════════════════════════════════════════ */
  /*                     RENDER                                  */
  /* ═══════════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen text-[var(--color-text)] has-bottom-nav fc-app-bg">
      {/* Header */}
      <header className="px-4 py-3 fc-header-gradient">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {screen === 'study-page' ? (
            <h1 className="text-xl fc-heading">
              <span className="text-[var(--color-primary)]">Fluent</span>Ge <span className="text-sm">📝</span>
            </h1>
          ) : (
            <button onClick={() => { playClick(); setScreen('study-page'); refreshCounts(); }} className="text-[var(--color-text-muted)] hover:text-white transition text-sm">
              ← უკან
            </button>
          )}
          {screen === 'session' && currentCard && (
            <button
              onClick={() => speak(effectiveDir === 'ka-en' ? currentCard.georgian : currentCard.english, effectiveDir === 'ka-en' ? 'ka-GE' : 'en-US')}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition text-lg"
            >🔊</button>
          )}
          {screen === 'study-page' && (
            <a href="/" className="text-sm text-[var(--color-text-muted)] hover:text-white transition">მთავარი</a>
          )}
        </div>
      </header>

      {/* ═══ STUDY PAGE ═══ */}
      {screen === 'study-page' && (
        <div className="max-w-lg mx-auto px-4 py-4 pb-28">
          {/* Login banner if not signed in */}
          {!isLoggedIn() && (
            <a href="/login/" className="flex items-center gap-2 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300 hover:bg-amber-500/15 transition">
              <span>⚠️</span>
              <span>შედი ანგარიშზე რომ პროგრესი შეინახო</span>
              <span className="ml-auto">→</span>
            </a>
          )}

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl fc-heading">📖 სასწავლო ბარათები</h2>
            <button
              onClick={() => setShowModeHelp(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-blue-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition"
            >
              ❓ რეჟიმები
            </button>
          </div>

          {/* Daily limit setting */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-sm text-[var(--color-text-muted)]">დღიური ლიმიტი:</span>
            <select
              value={dailyLimit}
              onChange={e => { const v = parseInt(e.target.value); setDailyLimitState(v); setDailyLimit(v); refreshCounts(); syncNow(); }}
              className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-sm text-[var(--color-text)] focus:outline-none"
            >
              {[5, 10, 15, 20, 30, 50].map(n => (
                <option key={n} value={n}>{n} ახალი / დღეში</option>
              ))}
            </select>
          </div>

          {/* Added study decks */}
          {studyDecks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-[var(--color-text-muted)] mb-4">ჯერ კატეგორია არ დაგიმატებია</p>
              <button
                onClick={() => setScreen('categories')}
                className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-white font-bold hover:brightness-110 transition"
              >
                + კატეგორიის დამატება
              </button>
            </div>
          ) : (
            <div className="space-y-3 mb-5">
              {studyDecks.map(entry => {
                const meta = deckIndex.find(d => d.id === entry.deckId);
                if (!meta) return null;
                const style = entry.studyStyle || 'anki'; // Backward compatibility
                const counts = deckCounts[`${entry.deckId}_${entry.mode}_${style}`] || { newCards: 0, reviewCards: 0, completed: false, progress: 0 };

                return (
                  <div key={`${entry.deckId}_${entry.mode}_${style}`} className={`fc-deck-card border p-4 transition fc-fadeInUp ${
                    counts.completed
                      ? 'border-emerald-500/30'
                      : 'border-white/10'
                  }`} style={{ animationDelay: `${studyDecks.indexOf(entry) * 80}ms` }}>
                    {meta.image && <div className="fc-deck-card-bg" style={{ backgroundImage: `url(${meta.image})` }} />}
                    <div className="fc-deck-card-content">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{meta.icon}</span>
                        <div>
                          <div className="fc-semibold text-sm text-white">{meta.nameKa}</div>
                          <div className="text-xs text-white/70">
                            {MODE_LABELS[entry.mode]} · {STYLE_LABELS[style]} · {meta.cardCount} ბარათი
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setConfirmDelete({ deckId: entry.deckId, mode: entry.mode, studyStyle: style })}
                        className="text-xs text-rose-400/60 hover:text-rose-400 transition px-2 py-1"
                      >✕</button>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-2.5 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${counts.completed ? 'bg-emerald-400' : 'fc-progress-bar'}`}
                          style={{ width: `${counts.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/80 tabular-nums fc-semibold">
                        {style === 'free' 
                          ? `გავლილი ${Math.round(meta.cardCount * counts.progress / 100)} / ${meta.cardCount}`
                          : `${counts.progress}%`
                        }
                      </span>
                    </div>

                    {/* Completion banner */}
                    {counts.completed && (
                      <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 mb-3 text-center">
                        <div className="text-lg">🏆</div>
                        <div className="text-sm font-bold text-emerald-400">კატეგორია დასრულებულია!</div>
                        <div className="text-[10px] text-emerald-400/70">ყველა სიტყვა შესწავლილია</div>
                      </div>
                    )}

                    {style === 'free' ? (
                      /* Free Mode - Single Button */
                      <button
                        onClick={() => { if (counts.reviewCards > 0) { playClick(); startSession(entry, 'review'); } }}
                        disabled={counts.reviewCards === 0}
                        className={`w-full rounded-xl p-4 text-center transition-all ${
                          counts.reviewCards > 0
                            ? 'bg-gradient-to-br from-purple-500/80 to-blue-500/80 border-2 border-purple-400/50 hover:from-purple-500 hover:to-blue-500 cursor-pointer fc-btn-3d'
                            : 'bg-white/5 border border-white/10 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-lg">📋</div>
                        <div className={`text-lg font-bold ${counts.reviewCards > 0 ? 'text-white' : 'text-white/70'}`}>
                          {counts.reviewCards > 0 ? 'გაგრძელება' : 'დასრულებულია'}
                        </div>
                        <div className={`text-sm mt-1 ${counts.reviewCards > 0 ? 'text-purple-200' : 'text-white/70'}`}>
                          {counts.reviewCards > 0 ? `${counts.reviewCards} სიტყვა დარჩა` : 'ყველა სიტყვა შესწავლილია'}
                        </div>
                      </button>
                    ) : (
                      /* Anki Mode - Two Buttons */
                      <div className="grid grid-cols-2 gap-2">
                        {/* New Cards Button */}
                        <button
                          onClick={() => { if (counts.newCards > 0) { playClick(); startSession(entry, 'new'); } }}
                          disabled={counts.newCards === 0}
                          className={`rounded-xl p-4 text-center transition-all ${
                            counts.newCards > 0
                              ? 'bg-sky-500/30 border-2 border-sky-400/50 hover:bg-sky-500/40 cursor-pointer fc-btn-3d'
                              : 'bg-white/5 border border-white/10 cursor-not-allowed'
                          }`}
                        >
                          <div className={`text-3xl font-bold ${counts.newCards > 0 ? 'text-sky-300' : 'text-white/70'}`}>{counts.newCards}</div>
                          <div className={`text-sm mt-1 font-semibold ${counts.newCards > 0 ? 'text-sky-200' : 'text-white/70'}`}>ახალი</div>
                          {counts.newCards === 0 && (
                            <div className="text-[9px] text-amber-400/70 mt-1">
                              ⏰ <ResetCountdown now={now} />
                            </div>
                          )}
                        </button>

                        {/* Review Cards Button */}
                        <button
                          onClick={() => { if (counts.reviewCards > 0) { playClick(); startSession(entry, 'review'); } }}
                          disabled={counts.reviewCards === 0}
                          className={`rounded-xl p-4 text-center transition-all ${
                            counts.reviewCards > 0
                              ? 'bg-emerald-500 border-2 border-emerald-400 hover:bg-emerald-400 cursor-pointer fc-btn-3d'
                              : 'bg-white/5 border border-white/10 cursor-not-allowed'
                          }`}
                        >
                          <div className={`text-3xl font-bold ${counts.reviewCards > 0 ? 'text-white' : 'text-white/70'}`}>{counts.reviewCards}</div>
                          <div className={`text-sm mt-1 font-semibold ${counts.reviewCards > 0 ? 'text-white' : 'text-white/70'}`}>გადასახედი</div>
                          {counts.reviewCards === 0 && counts.nextReviewAt && counts.nextReviewAt > now && (
                            <div className="text-[9px] text-amber-400/70 mt-1">
                              ⏰ <Countdown target={counts.nextReviewAt} now={now} onDone={refreshCounts} />
                            </div>
                          )}
                        </button>
                      </div>
                    )}
                    </div>{/* end fc-deck-card-content */}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add category button */}
          {studyDecks.length > 0 && (
            <button
              onClick={() => setScreen('categories')}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-white/15 text-[var(--color-text-muted)] hover:border-white/30 hover:text-white transition font-semibold"
            >
              + კატეგორიის დამატება
            </button>
          )}
        </div>
      )}

      {/* ═══ CATEGORIES SCREEN ═══ */}
      {screen === 'categories' && (
        <div className="max-w-lg mx-auto px-4 py-4 pb-28">
          <h2 className="text-lg fc-heading mb-3">აირჩიე კატეგორია</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 მოძებნე..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]/50 transition mb-4"
          />

          {/* Top 2000 — Featured Card */}
          {(() => {
            const top2000 = deckIndex.find(d => d.id === 'top-2000');
            const showFeatured = !searchQuery || (top2000 && (top2000.nameKa.toLowerCase().includes(searchQuery.toLowerCase()) || top2000.name.toLowerCase().includes(searchQuery.toLowerCase())));
            if (!top2000 || !showFeatured) return null;
            return (
              <div className="mb-5 fc-fadeInUp">
                <CategoryCard
                  meta={top2000}
                  isAdded={(mode: Mode) => studyDecks.some(d => d.deckId === top2000.id && d.mode === mode)}
                  onSelect={(m, mode) => setShowStyleModal({ meta: m, mode })}
                  featured
                />
              </div>
            );
          })()}

          <div className="grid grid-cols-2 gap-2.5">
            {(searchQuery
              ? deckIndex.filter(d => d.id !== 'top-2000' && (d.nameKa.toLowerCase().includes(searchQuery.toLowerCase()) || d.name.toLowerCase().includes(searchQuery.toLowerCase())))
              : deckIndex.filter(d => d.id !== 'top-2000')
            ).map(meta => (
              <CategoryCard
                key={meta.id}
                meta={meta}
                isAdded={(mode: Mode) => studyDecks.some(d => d.deckId === meta.id && d.mode === mode)}
                onSelect={(m, mode) => setShowStyleModal({ meta: m, mode })}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══ LOADING ═══ */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-bounce">📚</div>
            <p className="text-white">იტვირთება...</p>
          </div>
        </div>
      )}

      {/* ═══ STUDY SESSION ═══ */}
      {screen === 'session' && currentCard && !loading && (
        <div className="max-w-lg mx-auto px-4 py-4 pb-28 fc-session-bg relative z-10">
          {/* XP popup */}
          {xpPopup !== null && (
            <div className="fixed top-20 left-1/2 z-50 pointer-events-none" style={{ animation: 'xpFloat 1.2s ease-out forwards' }}>
              <span className="text-2xl font-bold text-yellow-400 drop-shadow-lg">+{xpPopup} XP ⚡</span>
            </div>
          )}
          {/* Info */}
          <div className="flex items-center justify-between mb-2 text-xs text-[var(--color-text-muted)]">
            <span>
              {sessionStyle === 'free' 
                ? `📋 ${STYLE_LABELS[sessionStyle]} | დარჩა: ${queue.length}`
                : `📋 ახალი: ${newInSession} | გადასახედი: ${reviewInSession}`
              }
            </span>
            {sessionStyle !== 'free' && <span>{currentIndex + 1} / {queue.length}</span>}
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Direction */}
          <div className="text-center mb-3">
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--color-text-muted)]">
              {effectiveDir === 'ka-en' ? '🇬🇪 → 🇬🇧' : '🇬🇧 → 🇬🇪'}
            </span>
          </div>

          {/* Flashcard */}
          <div
            onClick={() => { if (!flipped) { playClick(); handleShowAnswer(); } }}
            className={`relative rounded-3xl min-h-[300px] flex flex-col items-center justify-center p-8 cursor-pointer select-none fc-flashcard-3d ${flipped ? 'fc-flashcard-flipped' : ''}`}
            style={{
              background: flipped
                ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))'
                : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div className="text-3xl font-bold text-center mb-2 leading-relaxed">{question}</div>

            {effectiveDir === 'en-ka' && currentCard.pronunciation && !flipped && (
              <div className="text-sm text-[var(--color-text-muted)]">{currentCard.pronunciation}</div>
            )}

            {!flipped && sessionStyle === 'free' && (
              <div className="mt-6 text-sm text-[var(--color-text-muted)] animate-pulse">
                ჩაწერე პასუხი ქვემოთ ✍️
              </div>
            )}
            {!flipped && sessionStyle === 'anki' && (
              <div className="mt-6 text-sm text-[var(--color-text-muted)] animate-pulse">
                შეეხე ბარათს შემოსატრიალებლად 👆
              </div>
            )}

            {flipped && (
              <div className="mt-4 pt-4 border-t border-white/10 w-full text-center animate-[fadeIn_0.3s_ease-in]">
                <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">{answer}</div>
                {effectiveDir === 'ka-en' && currentCard.pronunciation && (
                  <div className="text-sm text-[var(--color-text-muted)] mb-2">{currentCard.pronunciation}</div>
                )}
                {currentCard.example_en && (
                  <div className="mt-3 space-y-1">
                    <div className="text-sm text-[var(--color-text-muted)] flex items-center justify-center gap-2">
                      <span>📖 {currentCard.example_en}</span>
                      <button onClick={e => { e.stopPropagation(); speak(currentCard.example_en); }} className="hover:scale-110 transition-transform">🔊</button>
                    </div>
                    <div className="text-sm text-[var(--color-text-muted)]">📖 {currentCard.example_ka}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Typing input — FREE MODE ONLY */}
          {!flipped && sessionStyle === 'free' && (
            <div className="mt-5">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={guess}
                  onChange={e => setGuess(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmitGuess()}
                  placeholder={effectiveDir === 'ka-en' ? 'ჩაწერე ინგლისურად...' : 'ჩაწერე ქართულად...'}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]/50 transition text-base"
                  autoFocus
                />
                <button
                  onClick={() => { playClick(); handleSubmitGuess(); }}
                  disabled={!guess.trim()}
                  className="px-5 py-3 rounded-xl bg-[var(--color-primary)] hover:brightness-110 text-white font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ✓
                </button>
              </div>
              <button
                onClick={handleShowAnswer}
                className="w-full mt-2 py-2 text-sm text-[var(--color-text-muted)] hover:text-white transition"
              >
                არ ვიცი — პასუხის ჩვენება
              </button>
            </div>
          )}

          {/* Flip button — ANKI MODE ONLY */}
          {!flipped && sessionStyle === 'anki' && (
            <div className="mt-5">
              <button
                onClick={() => { playClick(); handleShowAnswer(); }}
                className="w-full py-4 rounded-2xl bg-gradient-to-b from-indigo-500/80 to-indigo-600/80 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold transition-all border border-indigo-400/20 text-lg"
              >
                🔄 შემოატრიალე
              </button>
            </div>
          )}

          {/* Free mode: Correct — auto-graded */}
          {flipped && typedCorrect === true && sessionStyle === 'free' && (
            <div className="mt-5 text-center">
              <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4">
                <div className="text-2xl mb-1">✅</div>
                <div className="font-bold text-emerald-400">სწორია!</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">გავლილია</div>
              </div>
            </div>
          )}

          {/* Anki Mode — 4 grade buttons after flip */}
          {flipped && sessionStyle === 'anki' && (
            <div className="mt-5">
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => { playClick(); handleGrade('again'); }}
                  className="py-3 rounded-2xl bg-gradient-to-b from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white font-bold transition-all border border-red-400/20 fc-grade-btn"
                >
                  <div className="text-base">🔄</div>
                  <div className="text-xs">ისევ</div>
                  <div className="text-[9px] opacity-60">{getIntervalHint(currentSRS, 'again')}</div>
                </button>
                <button
                  onClick={() => { playClick(); handleGrade('hard'); }}
                  className="py-3 rounded-2xl bg-gradient-to-b from-orange-500/80 to-orange-600/80 hover:from-orange-500 hover:to-orange-600 text-white font-bold transition-all border border-orange-400/20 fc-grade-btn"
                >
                  <div className="text-base">😓</div>
                  <div className="text-xs">რთული</div>
                  <div className="text-[9px] opacity-60">{getIntervalHint(currentSRS, 'hard')}</div>
                </button>
                <button
                  onClick={() => { playClick(); handleGrade('good'); }}
                  className="py-3 rounded-2xl bg-gradient-to-b from-sky-500/80 to-sky-600/80 hover:from-sky-500 hover:to-sky-600 text-white font-bold transition-all border border-sky-400/20 fc-grade-btn"
                >
                  <div className="text-base">👍</div>
                  <div className="text-xs">კარგი</div>
                  <div className="text-[9px] opacity-60">{getIntervalHint(currentSRS, 'good')}</div>
                </button>
                <button
                  onClick={() => { playClick(); handleGrade('easy'); }}
                  className="py-3 rounded-2xl bg-gradient-to-b from-emerald-500/80 to-emerald-600/80 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold transition-all border border-emerald-400/20 fc-grade-btn"
                >
                  <div className="text-base">⚡</div>
                  <div className="text-xs">ადვილი</div>
                  <div className="text-[9px] opacity-60">{getIntervalHint(currentSRS, 'easy')}</div>
                </button>
              </div>
            </div>
          )}

          {/* Free mode: Wrong — show 2 buttons */}
          {flipped && typedCorrect === false && sessionStyle === 'free' && (
            <div className="mt-5">
              {guess.trim() && (
                <div className="text-center text-sm text-rose-400 mb-3">
                  ❌ შენი პასუხი: <span className="font-semibold">{guess}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { playClick(); handleGrade('again'); }}
                  className="py-4 rounded-2xl bg-gradient-to-b from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white font-bold transition-all border border-red-400/20 fc-grade-btn"
                >
                  <div className="text-lg">❌</div>
                  <div className="text-sm">არ ვიცი</div>
                  <div className="text-xs opacity-60 mt-1">ბოლოში წავა</div>
                </button>
                <button
                  onClick={() => { playClick(); handleGrade('good'); }}
                  className="py-4 rounded-2xl bg-gradient-to-b from-emerald-500/80 to-emerald-600/80 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold transition-all border border-emerald-400/20 fc-grade-btn"
                >
                  <div className="text-lg">✅</div>
                  <div className="text-sm">ვიცი</div>
                  <div className="text-xs opacity-60 mt-1">გავლილია</div>
                </button>
              </div>
            </div>
          )}

          {/* Keyboard hints */}
          <div className="hidden sm:block text-center text-xs text-[var(--color-text-muted)] mt-3 opacity-50">
            {flipped && sessionStyle === 'anki' ? '⌨️ 1=ისევ · 2=რთული · 3=კარგი · 4=ადვილი' : flipped && typedCorrect === false ? '⌨️ 1=არ ვიცი · 2=ვიცი' : !flipped && sessionStyle === 'free' ? '⌨️ Enter = შემოწმება' : !flipped ? '⌨️ Space = შემოატრიალე' : ''}
          </div>
        </div>
      )}

      {/* ═══ COMPLETE ═══ */}
      {screen === 'complete' && (
        <div className="max-w-lg mx-auto px-4 py-8 pb-28 fc-scaleIn">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl fc-heading mb-2">სესია დასრულდა!</h2>
            {sessionStats.total > 0 ? (
              <p className="text-[var(--color-text-muted)]">{sessionStats.total} ბარათი გადახედილია</p>
            ) : (
              <p className="text-[var(--color-text-muted)]">მეტი ბარათი გამოჩნდება როცა გადახედვის დრო მოვა</p>
            )}
          </div>

          {sessionStats.total > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-center">
                <div className="text-xl font-bold text-red-400">{sessionStats.again}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">🔄 ისევ</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-2.5 text-center">
                <div className="text-xl font-bold text-orange-400">{sessionStats.hard}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">😓 რთული</div>
              </div>
              <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-2.5 text-center">
                <div className="text-xl font-bold text-sky-400">{sessionStats.good}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">👍 კარგი</div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-center">
                <div className="text-xl font-bold text-emerald-400">{sessionStats.easy}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">😎 ადვილი</div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setScreen('study-page'); refreshCounts(); }}
              className="w-full py-3 rounded-2xl bg-[var(--color-primary)] hover:brightness-110 text-white font-bold transition-all"
            >
              📖 სასწავლო გვერდზე დაბრუნება
            </button>
          </div>
        </div>
      )}

      {/* Style Selection Modal */}
      {showStyleModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999]" onClick={() => setShowStyleModal(null)}>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-bg)] border border-white/10 rounded-2xl p-6 max-w-sm w-[calc(100%-2rem)] shadow-2xl z-[10000]" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-bold text-lg mb-2">სასწავლო რეჟიმი</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                აირჩიე სასწავლო სტილი <strong>{showStyleModal.meta.nameKa}</strong> კატეგორიისთვის
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  playClick();
                  addStudyDeck(showStyleModal.meta.id, showStyleModal.mode, 'anki');
                  setShowStyleModal(null);
                }}
                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🔄</div>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-400">ანკი რეჟიმი</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">
                      ინტერვალური გამეორება - სიტყვები ბრუნდება ოპტიმალურ დროს
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  playClick();
                  addStudyDeck(showStyleModal.meta.id, showStyleModal.mode, 'free');
                  setShowStyleModal(null);
                }}
                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:bg-purple-500/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📋</div>
                  <div className="flex-1">
                    <div className="font-semibold text-purple-400">თავისუფალი რეჟიმი</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">
                      გაიარე ყველა სიტყვა - სწორი = გავლილი, არასწორი = ბოლოში
                    </div>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setShowModeHelp(true)}
                className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-blue-400 transition"
              >
                <span>❓</span> როგორ მუშაობს?
              </button>
              <button
                onClick={() => setShowStyleModal(null)}
                className="text-sm text-[var(--color-text-muted)] hover:text-white transition"
              >
                გაუქმება
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Help Modal */}
      {showModeHelp && (
        <div className="fixed inset-0 bg-black/70 z-[10001]" onClick={() => setShowModeHelp(false)}>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-bg)] border border-white/10 rounded-2xl p-6 max-w-md w-[calc(100%-2rem)] shadow-2xl z-[10002] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-center mb-5">📖 რეჟიმების ახსნა</h3>
            
            <div className="mb-5 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔄</span>
                <span className="font-bold text-blue-400">ანკი რეჟიმი</span>
              </div>
              <div className="text-sm text-[var(--color-text-muted)] space-y-2">
                <p>სიტყვები ბრუნდება <strong>ოპტიმალურ დროს</strong> — ჯერ ხშირად, მერე უფრო იშვიათად.</p>
                <p>ბარათის შემოტრიალების შემდეგ <strong>4 ღილაკი</strong> გაქვს:</p>
                <p>🔄 <strong>ისევ</strong> — სიტყვა 1 წუთში დაბრუნდება</p>
                <p>😓 <strong>რთული</strong> — სიტყვა 10 წუთში დაბრუნდება</p>
                <p>👍 <strong>კარგი</strong> — სიტყვა მოგვიანებით დაბრუნდება (1 დღე, 3 დღე...)</p>
                <p>⚡ <strong>ადვილი</strong> — სიტყვა გრძელ ინტერვალში გადადის</p>
                <p className="mt-2">✅ <strong>დღიური ლიმიტი</strong> აკონტროლებს რამდენ ახალ სიტყვას ნახავ დღეში.</p>
              </div>
            </div>
            
            <div className="mb-5 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📋</span>
                <span className="font-bold text-purple-400">თავისუფალი რეჟიმი</span>
              </div>
              <div className="text-sm text-[var(--color-text-muted)] space-y-2">
                <p>ყველა სიტყვა ერთად იტვირთება, <strong>ლიმიტის გარეშე</strong>.</p>
                <p>პასუხის შემდეგ <strong>2 ღილაკი</strong> გაქვს:</p>
                <p>✅ <strong>ვიცი</strong> — სიტყვა სიიდან წაიშლება (გავლილია)</p>
                <p>❌ <strong>არ ვიცი</strong> — სიტყვა სიის ბოლოში წავა, ისევ გამოჩნდება</p>
                <p className="mt-2">🎯 <strong>მიზანი:</strong> გაიარე ყველა სიტყვა სანამ სია ცარიელი არ გახდება.</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowModeHelp(false)}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium transition"
            >
              გასაგებია ✅
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (() => {
        const meta = deckIndex.find(d => d.id === confirmDelete.deckId);
        return (
          <div className="fixed inset-0 bg-black/60 z-[9999]" onClick={() => setConfirmDelete(null)}>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-bg)] border border-white/10 rounded-2xl p-5 max-w-sm w-[calc(100%-2rem)] shadow-2xl z-[10000]" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="font-bold text-lg mb-1">კატეგორიის წაშლა</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  ნამდვილად გსურს <strong>{meta?.nameKa}</strong> ({MODE_LABELS[confirmDelete.mode]}, {STYLE_LABELS[confirmDelete.studyStyle]}) წაშლა?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 border border-white/10 text-[var(--color-text)] font-semibold hover:bg-white/15 transition"
                >
                  გაუქმება
                </button>
                <button
                  onClick={() => removeStudyDeck(confirmDelete.deckId, confirmDelete.mode, confirmDelete.studyStyle)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition"
                >
                  წაშლა
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bottom Nav */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          <a href="/"><span className="nav-icon">🏠</span><span>მთავარი</span></a>
          <a href="/flashcards/" className="active"><span className="nav-icon">📚</span><span>სიტყვები</span></a>
          <a href="/grammar/"><span className="nav-icon">📖</span><span>გრამატიკა</span></a>
          <a href="/games/"><span className="nav-icon">🎮</span><span>თამაშები</span></a>
          <a href="/dashboard/"><span className="nav-icon">👤</span><span>პროფილი</span></a>
        </div>
      </nav>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*              CATEGORY CARD COMPONENT                        */
/* ═══════════════════════════════════════════════════════════ */

function CategoryCard({ meta, isAdded, onSelect, featured }: {
  meta: DeckMeta;
  isAdded: (mode: Mode) => boolean;
  onSelect: (meta: DeckMeta, mode: Mode) => void;
  featured?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative fc-fadeInUp">
      <button
        onClick={() => { playClick(); setExpanded(!expanded); }}
        className={`w-full text-left transition-all border fc-cat-card ${
          featured
            ? 'rounded-3xl p-5 border-amber-400/40 shadow-xl ring-1 ring-amber-400/20'
            : `rounded-2xl p-3.5 ${expanded ? 'border-[var(--color-primary)]/30 shadow-lg' : 'border-white/5 shadow-sm'}`
        }`}
        style={featured ? { minHeight: '120px' } : undefined}
      >
        {meta.image && <div className={featured ? 'fc-cat-card-bg' : 'fc-cat-card-bg'} style={{ backgroundImage: `url(${meta.image})` }} />}
        {featured && (
          <div className="absolute top-3 right-3 z-10 bg-amber-400 text-black text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
            ⭐ რეკომენდებული
          </div>
        )}
        <div className="relative z-10 flex items-center gap-3">
          <span className={featured ? 'text-4xl' : 'text-2xl'}>{meta.icon}</span>
          <div className="flex-1 min-w-0">
            <div className={`fc-semibold truncate text-white ${featured ? 'text-lg' : 'text-sm'}`}>{meta.nameKa}</div>
            <div className={`text-white/70 ${featured ? 'text-sm mt-1' : 'text-xs'}`}>{meta.cardCount} ბარათი</div>
            {featured && <div className="text-xs text-amber-300/80 mt-1">ყველაზე ხშირი სიტყვები ინგლისურ ენაში</div>}
          </div>
          <span className={`text-xs text-white/60 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </button>

      {expanded && (
        <div className="mt-1.5 rounded-xl bg-[var(--color-bg)] border border-white/10 p-2 shadow-xl fc-slideDown space-y-1.5 z-10 relative">
          {([['ka-en', '🇬🇪→🇬🇧', 'ქართული → ინგლისური'], ['en-ka', '🇬🇧→🇬🇪', 'ინგლისური → ქართული'], ['mixed', '🔀', 'შერეული']] as [Mode, string, string][]).map(([m, icon, label]) => {
            const added = isAdded(m);
            const modeClass = m === 'ka-en' ? 'fc-mode-kaen' : m === 'en-ka' ? 'fc-mode-enka' : 'fc-mode-mixed';
            return (
              <button
                key={m}
                onClick={() => { playClick(); setExpanded(false); onSelect(meta, m); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-sm flex items-center gap-2 border ${
                  added ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : `${modeClass}`
                }`}
              >
                <span>{icon}</span>
                <span className="flex-1">{label}</span>
                {added && <span className="text-xs">✅</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*              COUNTDOWN COMPONENT                            */
/* ═══════════════════════════════════════════════════════════ */

function ResetCountdown({ now }: { now: number }) {
  const ms = getMsUntilReset();
  const target = now + ms;
  const diff = Math.max(0, target - now);

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  return <span>{hours} სთ {minutes} წთ</span>;
}

function Countdown({ target, now, onDone }: { target: number; now: number; onDone: () => void }) {
  const diff = Math.max(0, target - now);

  useEffect(() => {
    if (diff <= 0) onDone();
  }, [diff <= 0]);

  if (diff <= 0) return <span>მზადაა! 🎉</span>;

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (hours > 0) {
    return <span>{hours} სთ {minutes.toString().padStart(2, '0')} წთ</span>;
  }
  return <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>;
}
