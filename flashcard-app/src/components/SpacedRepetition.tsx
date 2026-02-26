import { useState, useEffect, useMemo, useCallback } from 'react';
import { decks, type Deck, type FlashCard } from '../lib/cards';

/* ───── SM-2 types & helpers ───── */
interface CardSRS {
  cardId: string;
  ef: number;
  interval: number;
  nextReview: number; // epoch ms
  repetitions: number;
}

interface SRSState {
  cards: Record<string, CardSRS>;
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
}

const SRS_KEY = 'srs-data';
const DAY = 86_400_000;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadSRS(): SRSState {
  try {
    const raw = localStorage.getItem(SRS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { cards: {}, streak: 0, lastStudyDate: '' };
}

function saveSRS(state: SRSState) {
  localStorage.setItem(SRS_KEY, JSON.stringify(state));
}

function cardKey(deckId: string, english: string) {
  return `${deckId}::${english.toLowerCase().trim()}`;
}

function sm2(prev: CardSRS, q: number): CardSRS {
  let { ef, interval, repetitions } = prev;
  // Update EF
  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  if (q >= 3) {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * ef);
  } else {
    repetitions = 0;
    interval = 1;
  }

  return {
    ...prev,
    ef,
    interval,
    repetitions,
    nextReview: Date.now() + interval * DAY,
  };
}

/* ───── Component ───── */
type View = 'dashboard' | 'study';

export default function SpacedRepetition({ onBack }: { onBack: () => void }) {
  const [srs, setSrs] = useState<SRSState>(loadSRS);
  const [view, setView] = useState<View>('dashboard');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [queue, setQueue] = useState<FlashCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0);

  // Persist
  useEffect(() => { saveSRS(srs); }, [srs]);

  /* ─── Stats ─── */
  const stats = useMemo(() => {
    const now = Date.now();
    let dueToday = 0, mastered = 0, learning = 0, totalLearned = 0;
    let nextReviewTime = Infinity;

    for (const c of Object.values(srs.cards)) {
      totalLearned++;
      if (c.interval > 21) mastered++;
      else learning++;
      if (c.nextReview <= now) dueToday++;
      if (c.nextReview > now && c.nextReview < nextReviewTime) nextReviewTime = c.nextReview;
    }

    // Count new cards across all decks
    let totalCards = 0;
    for (const d of decks) totalCards += d.cards.length;
    const newCards = totalCards - totalLearned;

    return { dueToday, mastered, learning, newCards, totalLearned, streak: srs.streak, nextReviewTime: nextReviewTime === Infinity ? null : nextReviewTime };
  }, [srs]);

  /* ─── Deck due counts ─── */
  const deckDueCounts = useMemo(() => {
    const now = Date.now();
    const counts: Record<string, { due: number; newCount: number }> = {};
    for (const d of decks) {
      let due = 0, learned = 0;
      for (const card of d.cards) {
        const key = cardKey(d.id, card.english);
        const c = srs.cards[key];
        if (c) {
          learned++;
          if (c.nextReview <= now) due++;
        }
      }
      counts[d.id] = { due, newCount: d.cards.length - learned };
    }
    return counts;
  }, [srs]);

  /* ─── Start study ─── */
  const startStudy = useCallback((deck: Deck) => {
    const now = Date.now();
    const dueCards: FlashCard[] = [];
    const newCards: FlashCard[] = [];

    for (const card of deck.cards) {
      const key = cardKey(deck.id, card.english);
      const c = srs.cards[key];
      if (c) {
        if (c.nextReview <= now) dueCards.push(card);
      } else {
        newCards.push(card);
      }
    }

    // Shuffle due cards, take up to 20, add up to 5 new
    const shuffled = [...dueCards].sort(() => Math.random() - 0.5).slice(0, 20);
    const newSlice = newCards.slice(0, Math.max(0, 20 - shuffled.length)).slice(0, 5);
    const q = [...shuffled, ...newSlice];

    if (q.length === 0) {
      // Nothing to study
      return;
    }

    setSelectedDeck(deck);
    setQueue(q);
    setCurrentIdx(0);
    setFlipped(false);
    setSessionDone(false);
    setSessionReviewed(0);
    setView('study');
  }, [srs]);

  /* ─── Rate card ─── */
  const rateCard = useCallback((q: number) => {
    if (!selectedDeck || currentIdx >= queue.length) return;
    const card = queue[currentIdx];
    const key = cardKey(selectedDeck.id, card.english);

    setSrs(prev => {
      const existing = prev.cards[key] || { cardId: key, ef: 2.5, interval: 0, nextReview: 0, repetitions: 0 };
      const updated = sm2(existing, q);

      // Streak logic
      const todayStr = today();
      let streak = prev.streak;
      if (prev.lastStudyDate !== todayStr) {
        const yesterday = new Date(Date.now() - DAY).toISOString().slice(0, 10);
        streak = prev.lastStudyDate === yesterday ? streak + 1 : 1;
      }

      return {
        ...prev,
        cards: { ...prev.cards, [key]: updated },
        streak,
        lastStudyDate: todayStr,
      };
    });

    setSessionReviewed(r => r + 1);

    // Next card
    if (currentIdx + 1 >= queue.length) {
      setSessionDone(true);
    } else {
      setCurrentIdx(i => i + 1);
      setFlipped(false);
    }
  }, [selectedDeck, currentIdx, queue]);

  /* ─── Format time until ─── */
  function formatTimeUntil(ts: number | null) {
    if (!ts) return '—';
    const diff = ts - Date.now();
    if (diff <= 0) return 'ახლა';
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} დღე`;
    if (hours > 0) return `${hours} საათი`;
    return `${Math.floor(diff / 60_000)} წუთი`;
  }

  /* ═══════ DASHBOARD ═══════ */
  if (view === 'dashboard') {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-white transition-colors mb-6">
          <span>←</span> <span>მთავარი</span>
        </button>

        <h2 className="text-2xl font-bold mb-6">🧠 ინტერვალური გამეორება</h2>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[var(--color-bg-card)] border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">{stats.dueToday}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">დღეს გასამეორებელი</div>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{stats.mastered}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">ათვისებული</div>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.learning}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">სწავლაში</div>
          </div>
          <div className="bg-[var(--color-bg-card)] border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.newCards}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">ახალი</div>
          </div>
        </div>

        {/* Streak & next review */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 bg-[var(--color-bg-card)] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="font-bold text-lg">{stats.streak} დღე</div>
              <div className="text-xs text-[var(--color-text-muted)]">სტრიქი</div>
            </div>
          </div>
          <div className="flex-1 bg-[var(--color-bg-card)] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <div className="font-bold text-lg">{formatTimeUntil(stats.nextReviewTime)}</div>
              <div className="text-xs text-[var(--color-text-muted)]">შემდეგი გამეორება</div>
            </div>
          </div>
        </div>

        {/* Deck list */}
        <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">აირჩიე დეკი</h3>
        <div className="space-y-2">
          {decks.map(deck => {
            const dc = deckDueCounts[deck.id] || { due: 0, newCount: 0 };
            const hasDue = dc.due > 0 || dc.newCount > 0;
            return (
              <button
                key={deck.id}
                onClick={() => startStudy(deck)}
                disabled={!hasDue}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  hasDue
                    ? 'bg-[var(--color-bg-card)] border-white/10 hover:border-[var(--color-primary)] hover:bg-white/5'
                    : 'bg-[var(--color-bg-card)] border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl">{deck.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{deck.nameKa}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{deck.cards.length} ბარათი</div>
                </div>
                <div className="flex gap-2 text-xs flex-shrink-0">
                  {dc.due > 0 && <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">{dc.due} გამეორება</span>}
                  {dc.newCount > 0 && <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{dc.newCount} ახალი</span>}
                  {!hasDue && <span className="text-green-400">✓ დასრულებული</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ═══════ SESSION DONE ═══════ */
  if (sessionDone) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">სესია დასრულდა!</h2>
        <p className="text-[var(--color-text-muted)] mb-6">გამეორებულია {sessionReviewed} ბარათი</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setView('dashboard'); setSessionDone(false); }}
            className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            დაბრუნება
          </button>
        </div>
      </div>
    );
  }

  /* ═══════ STUDY VIEW ═══════ */
  const card = queue[currentIdx];
  if (!card) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { setView('dashboard'); }}
          className="text-[var(--color-text-muted)] hover:text-white transition-colors"
        >
          ← უკან
        </button>
        <div className="text-sm text-[var(--color-text-muted)]">
          {currentIdx + 1} / {queue.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx) / queue.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        onClick={() => !flipped && setFlipped(true)}
        className="bg-[var(--color-bg-card)] border border-white/10 rounded-3xl p-8 min-h-[280px] flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-all mb-8"
      >
        {!flipped ? (
          <>
            <div className="text-3xl font-bold mb-3">{card.english}</div>
            {card.pronunciation && (
              <div className="text-sm text-[var(--color-text-muted)] mb-4">{card.pronunciation}</div>
            )}
            <div className="text-sm text-[var(--color-text-muted)] animate-pulse">შეეხე გადასაბრუნებლად</div>
          </>
        ) : (
          <>
            <div className="text-lg text-[var(--color-text-muted)] mb-2">{card.english}</div>
            <div className="text-3xl font-bold mb-4">{card.georgian}</div>
            {card.example_en && (
              <div className="text-sm text-[var(--color-text-muted)] text-center mt-2 space-y-1">
                <div>"{card.example_en}"</div>
                <div className="text-xs">"{card.example_ka}"</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div className="flex gap-3">
          <button
            onClick={() => rateCard(1)}
            className="flex-1 py-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-lg hover:bg-red-500/30 transition-all active:scale-95"
          >
            ძნელი
          </button>
          <button
            onClick={() => rateCard(3)}
            className="flex-1 py-4 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold text-lg hover:bg-yellow-500/30 transition-all active:scale-95"
          >
            კარგი
          </button>
          <button
            onClick={() => rateCard(5)}
            className="flex-1 py-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-lg hover:bg-green-500/30 transition-all active:scale-95"
          >
            ადვილი
          </button>
        </div>
      )}
    </div>
  );
}
