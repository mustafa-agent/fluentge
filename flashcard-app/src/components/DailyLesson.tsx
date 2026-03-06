import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadDeck, type Deck, type FlashCard } from '../lib/deck-loader';
import { deckIndex } from '../lib/deck-index';
import { getSRSStore, rateCard, saveSRSStore, type Rating } from '../lib/srs-engine';
import { playCorrect, playWrong } from '../lib/sounds';

// ── Types ────────────────────────────────────────────

type RoundType = 'vocab' | 'review' | 'sentence' | 'listening';

interface Round {
  type: RoundType;
  card: FlashCard;
}

interface Props {
  onBack: () => void;
}

// ── Helpers ──────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function awardXP(amount: number) {
  try {
    const current = parseInt(localStorage.getItem('totalXP') || '0');
    localStorage.setItem('totalXP', String(current + amount));
    // Track weekly XP
    const weekKey = getWeekKey();
    const weekXP = parseInt(localStorage.getItem(`fluentge-weekly-xp-${weekKey}`) || '0');
    localStorage.setItem(`fluentge-weekly-xp-${weekKey}`, String(weekXP + amount));
  } catch {}
}

function updateStreak() {
  try {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('lastPracticeDate');
    if (lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const streak = parseInt(localStorage.getItem('currentStreak') || '0');
    if (lastDate === yesterday || !lastDate) {
      localStorage.setItem('currentStreak', String(streak + 1));
    } else {
      localStorage.setItem('currentStreak', '1');
    }
    localStorage.setItem('lastPracticeDate', today);
  } catch {}
}

function trackStudyTime(seconds: number) {
  try {
    const today = new Date().toDateString();
    const key = 'todayStudyTime';
    const dateKey = 'todayStudyDate';
    const storedDate = localStorage.getItem(dateKey);
    const prev = storedDate === today ? parseInt(localStorage.getItem(key) || '0') : 0;
    localStorage.setItem(key, String(prev + Math.round(seconds / 60)));
    localStorage.setItem(dateKey, today);
  } catch {}
}

function getWeekKey(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return monday.toISOString().split('T')[0];
}

function speak(text: string, rate = 0.85) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

function playTap() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
}

// ── Daily Lesson Component ───────────────────────────

export default function DailyLesson({ onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [allCards, setAllCards] = useState<FlashCard[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [startTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const [slideDir, setSlideDir] = useState<'in' | 'out' | ''>('');

  // Vocab state
  const [flipped, setFlipped] = useState(false);

  // Quiz state (for review, listening)
  const [options, setOptions] = useState<{ text: string; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  // Sentence state
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [correctSentence, setCorrectSentence] = useState<string[]>([]);
  const [sentenceChecked, setSentenceChecked] = useState(false);
  const [sentenceCorrect, setSentenceCorrect] = useState(false);

  // Load deck and generate rounds
  useEffect(() => {
    generateSession();
  }, []);

  // Level-appropriate deck sources for each CEFR level
  const LEVEL_DECKS: Record<string, string[]> = {
    'A1': ['greetings-basics', 'numbers-time', 'colors-shapes', 'family-people', 'animals', 'body-parts'],
    'A2': ['daily-routines', 'food-drink', 'shopping-money', 'travel-transport', 'emotions-personality', 'clothing-fashion'],
    'B1': ['work-business', 'technology', 'health-body', 'education', 'entertainment', 'nature-weather'],
    'B2': ['politics-society', 'science-math', 'law-crime', 'environment-ecology', 'finance-banking', 'slang-informal'],
  };

  async function generateSession() {
    setLoading(true);

    // Determine user level and pick appropriate decks
    const userLevel = localStorage.getItem('fluentge-placement-level') || '';
    const levelSources = LEVEL_DECKS[userLevel];

    // Load cards from level-appropriate decks + always include top-2000
    let allLoadedCards: FlashCard[] = [];
    let primaryDeckId = 'top-2000-words';

    if (levelSources && levelSources.length > 0) {
      // Pick 2 random level-appropriate decks to mix in
      const picked = shuffleArray(levelSources).slice(0, 2);
      const deckPromises = picked.map(s => loadDeck(s));
      const decks = await Promise.all(deckPromises);
      for (const d of decks) {
        if (d) allLoadedCards.push(...d.cards);
      }
      // Also load top-2000 for SRS reviews
      const top2000 = await loadDeck('top-2000-words');
      if (top2000) allLoadedCards.push(...top2000.cards);
      primaryDeckId = picked[0] || 'top-2000-words';
    } else {
      // No level set — use top-2000 only (default behavior)
      const deck = await loadDeck('top-2000-words');
      if (!deck) { setLoading(false); return; }
      allLoadedCards = deck.cards;
    }

    if (allLoadedCards.length === 0) { setLoading(false); return; }

    // Deduplicate by english word
    const seen = new Set<string>();
    const cards = allLoadedCards.filter(c => {
      const key = c.english.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setAllCards(cards);
    const srsStore = getSRSStore('top-2000-words');
    const now = Date.now();

    // Split cards into new (unseen) and due (SRS review)
    const newCards: FlashCard[] = [];
    const dueCards: FlashCard[] = [];
    for (const c of cards) {
      const key = c.english.toLowerCase();
      const srs = srsStore[key];
      if (!srs || srs.repetitions === 0) {
        newCards.push(c);
      } else if (srs.nextReview <= now) {
        dueCards.push(c);
      }
    }

    const shuffledNew = shuffleArray(newCards);
    const shuffledDue = shuffleArray(dueCards);

    // Build 10 rounds: 3 vocab, 3 review (or vocab if no due), 2 sentence, 2 listening
    const sessionCards: Round[] = [];

    // Rounds 1-3: New vocab (prefer level-appropriate cards)
    for (let i = 0; i < 3; i++) {
      const card = shuffledNew[i] || shuffleArray(cards)[i];
      if (card) sessionCards.push({ type: 'vocab', card });
    }

    // Rounds 4-6: SRS review or more new vocab
    for (let i = 0; i < 3; i++) {
      const card = shuffledDue[i] || shuffledNew[3 + i] || shuffleArray(cards)[3 + i];
      if (card) sessionCards.push({ type: dueCards.length > i ? 'review' : 'vocab', card });
    }

    // Rounds 7-8: Sentence builder (need cards with 3+ word examples)
    const sentenceCards = shuffleArray(cards.filter(c => c.example_en && c.example_en.split(' ').length >= 4));
    for (let i = 0; i < 2; i++) {
      const card = sentenceCards[i];
      if (card) sessionCards.push({ type: 'sentence', card });
    }

    // Rounds 9-10: Listening
    const listeningCards = shuffleArray(cards).filter(c => !sessionCards.some(r => r.card.english === c.english));
    for (let i = 0; i < 2; i++) {
      const card = listeningCards[i] || shuffleArray(cards)[8 + i];
      if (card) sessionCards.push({ type: 'listening', card });
    }

    setRounds(sessionCards.slice(0, 10));
    setLoading(false);
  }

  // Setup round when currentRound changes
  useEffect(() => {
    if (rounds.length === 0 || currentRound >= rounds.length) return;
    const round = rounds[currentRound];
    setFlipped(false);
    setSelected(null);
    setAnswered(false);
    setSentenceChecked(false);
    setSentenceCorrect(false);
    setSelectedWords([]);

    if (round.type === 'review' || round.type === 'listening') {
      // Generate 4 options
      const others = allCards.filter(c => c.english !== round.card.english);
      const wrongs = shuffleArray(others).slice(0, 3);
      const opts = shuffleArray([
        { text: round.card.georgian, correct: true },
        ...wrongs.map(w => ({ text: w.georgian, correct: false }))
      ]);
      setOptions(opts);
      if (round.type === 'listening') {
        setTimeout(() => speak(round.card.english), 300);
      }
    }

    if (round.type === 'sentence') {
      const words = round.card.example_en.split(/\s+/);
      setCorrectSentence(words);
      setSentenceWords(shuffleArray(words));
    }
  }, [currentRound, rounds, allCards]);

  // Slide animation
  function nextRound() {
    setSlideDir('out');
    setTimeout(() => {
      if (currentRound + 1 >= rounds.length) {
        // Finish
        const elapsed = (Date.now() - startTime) / 1000;
        trackStudyTime(elapsed);
        updateStreak();
        // Record daily lesson completion
        localStorage.setItem('fluentge-daily-lesson-date', new Date().toDateString());
        setFinished(true);
      } else {
        setCurrentRound(prev => prev + 1);
      }
      setSlideDir('in');
      setTimeout(() => setSlideDir(''), 300);
    }, 200);
  }

  // ── Vocab Round ────────────────────────────────────
  function renderVocab(round: Round) {
    const card = round.card;
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div
          onClick={() => { setFlipped(!flipped); playTap(); }}
          className="w-full max-w-sm bg-[var(--color-bg-card)] rounded-2xl border-2 border-white/10 border-b-4 border-b-white/15 p-8 text-center cursor-pointer hover:scale-[1.02] transition-all min-h-[200px] flex flex-col items-center justify-center"
        >
          {!flipped ? (
            <>
              <p className="text-3xl font-bold mb-2">{card.english}</p>
              <p className="text-sm text-[var(--color-text-muted)]">შეეხე გადასაბრუნებლად</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold mb-1">{card.georgian}</p>
              <p className="text-lg text-[var(--color-text-muted)] mb-1">{card.pronunciation}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-2 italic">"{card.example_en}"</p>
            </>
          )}
        </div>
        {flipped && (
          <div className="flex gap-3 mt-6">
            <button onClick={() => { handleVocabRate('again'); }} className="px-5 py-3 rounded-xl bg-red-500/20 text-red-400 font-bold border-b-4 border-red-500/30 active:border-b-2 active:mt-[2px]">
              ❌ არ ვიცი
            </button>
            <button onClick={() => { handleVocabRate('good'); }} className="px-5 py-3 rounded-xl bg-green-500/20 text-green-400 font-bold border-b-4 border-green-500/30 active:border-b-2 active:mt-[2px]">
              ✅ ვიცი
            </button>
          </div>
        )}
      </div>
    );
  }

  function handleVocabRate(rating: Rating) {
    const round = rounds[currentRound];
    const deckId = 'top-2000-words';
    const store = getSRSStore(deckId);
    const key = round.card.english.toLowerCase();
    const updated = rateCard(store, key, rating);
    saveSRSStore(deckId, updated);
    const xp = rating === 'again' ? 5 : 10;
    awardXP(xp);
    setTotalXP(prev => prev + xp);
    if (rating !== 'again') setScore(prev => prev + 1);
    playTap();
    nextRound();
  }

  // ── Review / Listening Round (Quiz) ────────────────
  function renderQuiz(round: Round) {
    const isListening = round.type === 'listening';
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        {isListening ? (
          <div className="text-center mb-6">
            <button onClick={() => speak(round.card.english)} className="text-6xl mb-3 hover:scale-110 transition-transform">
              🔊
            </button>
            <p className="text-sm text-[var(--color-text-muted)]">მოისმინე და აირჩიე სწორი თარგმანი</p>
          </div>
        ) : (
          <div className="text-center mb-6">
            <p className="text-3xl font-bold mb-2">{round.card.english}</p>
            <p className="text-sm text-[var(--color-text-muted)]">აირჩიე ქართული თარგმანი</p>
          </div>
        )}
        <div className="w-full max-w-sm space-y-3">
          {options.map((opt, i) => {
            let cls = 'w-full p-4 rounded-xl text-left font-medium border-2 border-b-4 transition-all ';
            if (!answered) {
              cls += 'border-white/10 border-b-white/15 bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] active:border-b-2 active:mt-[2px]';
            } else if (opt.correct) {
              cls += 'border-green-500/50 border-b-green-500/60 bg-green-500/20 text-green-400';
            } else if (i === selected && !opt.correct) {
              cls += 'border-red-500/50 border-b-red-500/60 bg-red-500/20 text-red-400';
            } else {
              cls += 'border-white/5 bg-[var(--color-bg-card)] opacity-50';
            }
            return (
              <button
                key={i}
                onClick={() => handleQuizSelect(i, opt.correct)}
                disabled={answered}
                className={cls}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
        {answered && (
          <button onClick={nextRound} className="mt-6 px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold border-b-4 border-white/20 active:border-b-2 active:mt-[2px] hover:scale-[1.02] transition-all">
            შემდეგი →
          </button>
        )}
      </div>
    );
  }

  function handleQuizSelect(idx: number, correct: boolean) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const xp = correct ? 10 : 0;
    if (correct) { playCorrect(); setScore(prev => prev + 1); }
    else playWrong();
    awardXP(xp);
    setTotalXP(prev => prev + xp);
  }

  // ── Sentence Builder Round ─────────────────────────
  function renderSentence(round: Round) {
    const builtSentence = selectedWords.map(i => sentenceWords[i]);
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="text-center mb-4">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">დაალაგე სიტყვები სწორი თანმიმდევრობით</p>
          <p className="text-lg text-purple-400 font-medium">{round.card.example_ka}</p>
        </div>

        {/* Built sentence area */}
        <div className="w-full max-w-sm min-h-[60px] bg-[var(--color-bg-card)] rounded-xl border-2 border-white/10 p-3 mb-4 flex flex-wrap gap-2">
          {builtSentence.length === 0 && (
            <span className="text-[var(--color-text-muted)] text-sm">შეეხე სიტყვებს...</span>
          )}
          {builtSentence.map((w, i) => (
            <button
              key={i}
              onClick={() => {
                if (sentenceChecked) return;
                setSelectedWords(prev => prev.filter((_, idx) => idx !== i));
                playTap();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium text-sm border-b-2 ${
                sentenceChecked
                  ? sentenceCorrect
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                  : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Available words */}
        <div className="w-full max-w-sm flex flex-wrap gap-2 justify-center mb-6">
          {sentenceWords.map((word, i) => {
            const used = selectedWords.includes(i);
            return (
              <button
                key={i}
                onClick={() => {
                  if (used || sentenceChecked) return;
                  setSelectedWords(prev => [...prev, i]);
                  playTap();
                }}
                disabled={used || sentenceChecked}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm border-2 border-b-4 transition-all ${
                  used
                    ? 'opacity-30 border-white/5 bg-[var(--color-bg)]'
                    : 'border-white/10 border-b-white/15 bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] active:border-b-2 active:mt-[2px]'
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>

        {/* Check / Next */}
        {!sentenceChecked && selectedWords.length === sentenceWords.length && (
          <button onClick={checkSentence} className="px-8 py-3 rounded-xl bg-sky-500 text-white font-bold border-b-4 border-sky-600 active:border-b-2 active:mt-[2px]">
            შეამოწმე
          </button>
        )}
        {sentenceChecked && (
          <div className="text-center">
            {!sentenceCorrect && (
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                სწორი: <span className="text-green-400">{correctSentence.join(' ')}</span>
              </p>
            )}
            <button onClick={nextRound} className="px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold border-b-4 border-white/20 active:border-b-2 active:mt-[2px]">
              შემდეგი →
            </button>
          </div>
        )}
      </div>
    );
  }

  function checkSentence() {
    const built = selectedWords.map(i => sentenceWords[i]).join(' ');
    const correct = correctSentence.join(' ');
    const isCorrect = built.toLowerCase() === correct.toLowerCase();
    setSentenceChecked(true);
    setSentenceCorrect(isCorrect);
    const xp = isCorrect ? 15 : 5;
    awardXP(xp);
    setTotalXP(prev => prev + xp);
    if (isCorrect) { playCorrect(); setScore(prev => prev + 1); }
    else playWrong();
  }

  // ── Summary Screen ─────────────────────────────────
  function renderSummary() {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const accuracy = rounds.length > 0 ? Math.round((score / rounds.length) * 100) : 0;

    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">დღის გაკვეთილი დასრულდა!</h2>
        <p className="text-[var(--color-text-muted)] mb-6">კარგი სამუშაო!</p>

        <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center border border-white/5">
            <p className="text-3xl font-bold text-green-400">{score}/{rounds.length}</p>
            <p className="text-xs text-[var(--color-text-muted)]">სწორი</p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center border border-white/5">
            <p className="text-3xl font-bold text-sky-400">{accuracy}%</p>
            <p className="text-xs text-[var(--color-text-muted)]">სიზუსტე</p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center border border-white/5">
            <p className="text-3xl font-bold text-yellow-400">+{totalXP}</p>
            <p className="text-xs text-[var(--color-text-muted)]">XP</p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center border border-white/5">
            <p className="text-3xl font-bold text-purple-400">{mins}:{secs.toString().padStart(2, '0')}</p>
            <p className="text-xs text-[var(--color-text-muted)]">დრო</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg border-b-4 border-green-700 active:border-b-2 active:mt-[2px] hover:scale-[1.02] transition-all"
        >
          დასრულება ✅
        </button>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-5xl animate-bounce mb-4">🎯</div>
        <p className="text-[var(--color-text-muted)]">გაკვეთილი მზადდება...</p>
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-xl mb-4">😔 ვერ მოხერხდა გაკვეთილის შექმნა</p>
        <button onClick={onBack} className="px-6 py-3 rounded-xl bg-[var(--color-bg-card)] font-bold">
          უკან
        </button>
      </div>
    );
  }

  if (finished) return renderSummary();

  const round = rounds[currentRound];
  const roundIcons: Record<RoundType, { icon: string; label: string; color: string }> = {
    vocab: { icon: '📝', label: 'ახალი სიტყვა', color: 'text-sky-400' },
    review: { icon: '🔄', label: 'გადახედვა', color: 'text-purple-400' },
    sentence: { icon: '🔤', label: 'წინადადება', color: 'text-amber-400' },
    listening: { icon: '🎧', label: 'მოსმენა', color: 'text-pink-400' },
  };
  const ri = roundIcons[round.type];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm">
              ✕ გასვლა
            </button>
            <div className="dl-round-indicator flex items-center gap-2">
              <span className={`dl-round-icon ${ri.color}`}>{ri.icon}</span>
              <span className={`text-sm font-medium ${ri.color}`}>{ri.label}</span>
            </div>
            <span className="text-sm text-[var(--color-text-muted)]">{currentRound + 1}/{rounds.length}</span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-[var(--color-bg-card)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentRound + 1) / rounds.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Round content */}
      <div className={`flex-1 flex flex-col max-w-lg mx-auto w-full py-6 ${slideDir === 'in' ? 'dl-slide-in' : ''}`}>
        {(round.type === 'vocab') && renderVocab(round)}
        {(round.type === 'review' || round.type === 'listening') && renderQuiz(round)}
        {(round.type === 'sentence') && renderSentence(round)}
      </div>

      {/* XP counter */}
      {totalXP > 0 && (
        <div className="fixed bottom-20 right-4 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full text-sm font-bold animate-pulse">
          +{totalXP} XP
        </div>
      )}
    </div>
  );
}
