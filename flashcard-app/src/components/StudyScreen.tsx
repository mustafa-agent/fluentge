import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Deck, FlashCard, getCardId } from '../lib/cards';
import { sm2 } from '../lib/sm2';
import { getCardProgress, saveCardProgress, updateStats, incrementWordsLearned } from '../lib/storage';
import { playCorrect, playWrong } from '../lib/sounds';
import { addXP, addStudyTime, updateStreak, XP_REWARDS } from '../lib/gamification';

function sanitizeForAudio(word: string): string {
  return word.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

let currentAudio: HTMLAudioElement | null = null;

function speak(text: string, lang: string = 'en-US') {
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  
  // Try pre-generated MP3 first
  const suffix = lang.startsWith('ka') ? 'ka' : 'en';
  const filename = sanitizeForAudio(text);
  if (filename) {
    const audioPath = `/flashcards/audio/words/${filename}_${suffix}.mp3`;
    const audio = new Audio(audioPath);
    currentAudio = audio;
    audio.play().catch(() => {
      // Fallback to browser TTS if MP3 not found
      fallbackSpeak(text, lang);
    });
    return;
  }
  fallbackSpeak(text, lang);
}

function fallbackSpeak(text: string, lang: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.9;
  u.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => 
    v.lang.startsWith(lang.split('-')[0]) && (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Premium') || v.name.includes('Google'))
  ) || voices.find(v => v.lang.startsWith(lang.split('-')[0]) && !v.localService)
    || voices.find(v => v.lang.startsWith(lang.split('-')[0]));
  if (preferred) u.voice = preferred;
  window.speechSynthesis.speak(u);
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[.,!?;:'"()]/g, '');
}

type Direction = 'en-ka' | 'ka-en' | 'mixed';
type DirSuffix = 'enka' | 'kaen';
type StorageSuffix = 'enka' | 'kaen' | 'mixed';

function dirToSuffix(dir: 'en-ka' | 'ka-en'): DirSuffix {
  return dir === 'en-ka' ? 'enka' : 'kaen';
}

// Session progress persistence
function getSessionKey(deckId: string, suffix: StorageSuffix) {
  return `fluentge-session-${deckId}-${suffix}`;
}

function loadSessionProgress(deckId: string, suffix: StorageSuffix): string[] | null {
  try {
    const data = localStorage.getItem(getSessionKey(deckId, suffix));
    if (!data) return null;
    return JSON.parse(data);
  } catch { return null; }
}

function saveSessionProgress(deckId: string, suffix: StorageSuffix, remainingCardIds: string[]) {
  localStorage.setItem(getSessionKey(deckId, suffix), JSON.stringify(remainingCardIds));
}

function clearSessionProgress(deckId: string, suffix: StorageSuffix) {
  localStorage.removeItem(getSessionKey(deckId, suffix));
}

interface Props {
  deck: Deck;
  direction?: Direction;
  onBack: () => void;
}

function showFloatingXP(amount: number) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = `+${amount} XP`;
  el.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);font-weight:bold;font-size:1.25rem;color:#facc15;z-index:9999;pointer-events:none;animation:xpFloat 1.2s ease-out forwards;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

export default function StudyScreen({ deck, direction = 'en-ka', onBack }: Props) {
  const storageSuffix: StorageSuffix = direction === 'mixed' ? 'mixed' : dirToSuffix(direction);
  
  // Session tracking
  const sessionStartTime = useRef(Date.now());
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hardestWords, setHardestWords] = useState<Array<{en: string, ka: string, attempts: number}>>([]);
  const wrongCountMap = useRef<Map<string, number>>(new Map());
  
  // Queue of card indices remaining
  const [queue, setQueue] = useState<FlashCard[]>(() => {
    // Try to restore saved session
    const saved = loadSessionProgress(deck.id, storageSuffix);
    if (saved && saved.length > 0) {
      // Restore cards in saved order
      const cardMap = new Map(deck.cards.map(c => [c.english, c]));
      const restored = saved.map(id => cardMap.get(id)).filter(Boolean) as FlashCard[];
      if (restored.length > 0) return restored;
    }
    // Fresh session: all cards shuffled
    return [...deck.cards].sort(() => Math.random() - 0.5);
  });

  const totalCards = deck.cards.length;
  const remaining = queue.length;
  const guessedCount = totalCards - remaining;

  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [guess, setGuess] = useState('');
  const [guessResult, setGuessResult] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Direction for mixed mode
  const [currentMixedDir, setCurrentMixedDir] = useState<'en-ka' | 'ka-en'>(() =>
    Math.random() < 0.5 ? 'en-ka' : 'ka-en'
  );

  const currentDir = direction === 'mixed' ? currentMixedDir : direction;
  const isReverse = currentDir === 'ka-en';

  const card = queue[0] || null;
  const questionText = isReverse ? card?.georgian : card?.english;
  const answerText = isReverse ? card?.english : card?.georgian;
  const placeholderText = isReverse ? 'ჩაწერე ინგლისური თარგმანი...' : 'ჩაწერე ქართული თარგმანი...';

  // Save progress whenever queue changes
  useEffect(() => {
    if (queue.length > 0) {
      saveSessionProgress(deck.id, storageSuffix, queue.map(c => c.english));
    }
  }, [queue, deck.id, storageSuffix]);

  function handleGuess() {
    if (!card || !guess.trim() || !answerText) return;
    const possibleAnswers = answerText.split(/[;/]/).map(s => normalize(s));
    const userAnswer = normalize(guess);
    const isCorrect = possibleAnswers.some(ans => ans === userAnswer || userAnswer.includes(ans) || ans.includes(userAnswer));
    setGuessResult(isCorrect ? 'correct' : 'wrong');
    setFlipped(true);
    if (isCorrect) {
      playCorrect();
      // Award XP for correct answer
      const xpResult = addXP(XP_REWARDS.REVIEW_CARD + XP_REWARDS.CORRECT_ANSWER);
      // Show floating XP
      showFloatingXP(XP_REWARDS.REVIEW_CARD + XP_REWARDS.CORRECT_ANSWER);
    } else {
      playWrong();
      // Still award base XP for attempting
      addXP(XP_REWARDS.REVIEW_CARD);
    }

    // SRS update
    const quality = isCorrect ? 5 : 1;
    const id = getCardId(card, storageSuffix);
    const progress = getCardProgress(id);
    const updated = sm2(progress, quality);
    saveCardProgress(updated);
    updateStats(isCorrect);
    if (isCorrect && progress.repetitions === 0) {
      incrementWordsLearned();
    }
    // Add to known cards
    if (isCorrect) {
      try {
        const known: Array<{word: string, georgian: string}> = JSON.parse(localStorage.getItem('knownCards') || '[]');
        if (!known.some(k => k.word === card.english)) {
          known.push({ word: card.english, georgian: card.georgian });
          localStorage.setItem('knownCards', JSON.stringify(known));
        }
      } catch { /* ignore */ }
    }
  }

  function handleNext() {
    if (!card) return;
    const wasCorrect = guessResult === 'correct';
    
    // Track stats
    if (wasCorrect) {
      setCorrectCount(c => c + 1);
    } else {
      setWrongCount(c => c + 1);
      const key = card.english;
      wrongCountMap.current.set(key, (wrongCountMap.current.get(key) || 0) + 1);
    }
    
    setFlipped(false);
    setGuess('');
    setGuessResult(null);

    setQueue(prev => {
      const rest = prev.slice(1);
      if (wasCorrect) {
        if (rest.length === 0) {
          clearSessionProgress(deck.id, storageSuffix);
          // Build hardest words list
          const sorted = [...wrongCountMap.current.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([en, attempts]) => {
              const c = deck.cards.find(c => c.english === en);
              return { en, ka: c?.georgian || '', attempts };
            });
          setHardestWords(sorted);
          setSessionDone(true);
          return [];
        }
        return rest;
      } else {
        if (rest.length === 0) return [prev[0]];
        return [...rest, prev[0]];
      }
    });

    // New random direction for mixed mode
    if (direction === 'mixed') {
      setCurrentMixedDir(Math.random() < 0.5 ? 'en-ka' : 'ka-en');
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleCardTap() {
    if (!flipped && card) {
      setFlipped(true);
      if (!guess.trim() && !guessResult) {
        // Tapped without guessing = skipped (counted as wrong)
        const id = getCardId(card, storageSuffix);
        const progress = getCardProgress(id);
        const updated = sm2(progress, 1);
        saveCardProgress(updated);
        updateStats(false);
        setGuessResult('wrong');
        playWrong();
      }
    }
  }

  function restartSession() {
    clearSessionProgress(deck.id, storageSuffix);
    setQueue([...deck.cards].sort(() => Math.random() - 0.5));
    setFlipped(false);
    setSessionDone(false);
    setGuess('');
    setGuessResult(null);
  }

  // Update streak & study time on session done
  const sessionEndHandled = useRef(false);
  useEffect(() => {
    if (sessionDone && !sessionEndHandled.current) {
      sessionEndHandled.current = true;
      // Update streak
      updateStreak(true);
      // Track study time
      const elapsedMin = (Date.now() - sessionStartTime.current) / 60000;
      addStudyTime(Math.max(1, Math.round(elapsedMin)));
    }
  }, [sessionDone]);

  if (sessionDone) {
    const elapsedMs = Date.now() - sessionStartTime.current;
    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    const totalAttempts = correctCount + wrongCount;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
    const isPerfect = wrongCount === 0;
    const wordsPerMin = minutes > 0 ? Math.round(totalCards / minutes) : totalCards;
    const sessionXP = correctCount * (XP_REWARDS.REVIEW_CARD + XP_REWARDS.CORRECT_ANSWER) + wrongCount * XP_REWARDS.REVIEW_CARD;

    // Performance rating
    let emoji = '🎉';
    let ratingText = 'შესანიშნავი!';
    let ratingColor = 'text-green-400';
    if (accuracy >= 90) { emoji = '🏆'; ratingText = 'შესანიშნავი!'; ratingColor = 'text-green-400'; }
    else if (accuracy >= 70) { emoji = '👍'; ratingText = 'კარგი შედეგი!'; ratingColor = 'text-yellow-400'; }
    else if (accuracy >= 50) { emoji = '💪'; ratingText = 'გააგრძელე ვარჯიში!'; ratingColor = 'text-orange-400'; }
    else { emoji = '📚'; ratingText = 'მეტი ვარჯიში სჭირდება'; ratingColor = 'text-red-400'; }

    return (
      <div className="px-4 py-8 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{emoji}</div>
          <h2 className="text-2xl font-bold mb-1">სესია დასრულდა!</h2>
          <p className={`text-lg font-semibold ${ratingColor}`}>{ratingText}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 text-center border border-white/5">
            <div className="text-3xl font-bold text-[var(--color-text)]">{totalCards}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">📝 სიტყვა</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 text-center border border-white/5">
            <div className={`text-3xl font-bold ${accuracy >= 70 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{accuracy}%</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">🎯 სიზუსტე</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 text-center border border-white/5">
            <div className="text-3xl font-bold text-[var(--color-text)]">{minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}წმ`}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">⏱️ დრო</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 text-center border border-white/5">
            <div className="text-3xl font-bold text-[var(--color-text)]">{isPerfect ? '🔥' : `${correctCount}/${totalAttempts}`}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">{isPerfect ? 'პერფექტული!' : '✅ სწორი / სულ'}</div>
          </div>
        </div>

        {/* Accuracy Bar */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 mb-6 border border-white/5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-400">✅ სწორი: {correctCount}</span>
            <span className="text-red-400">❌ არასწორი: {wrongCount}</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
            {correctCount > 0 && (
              <div className="h-full bg-green-400 rounded-l-full transition-all" style={{ width: `${(correctCount / totalAttempts) * 100}%` }} />
            )}
            {wrongCount > 0 && (
              <div className="h-full bg-red-400 rounded-r-full transition-all" style={{ width: `${(wrongCount / totalAttempts) * 100}%` }} />
            )}
          </div>
        </div>

        {/* Hardest Words */}
        {hardestWords.length > 0 && (
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 mb-6 border border-white/5">
            <h3 className="font-semibold text-sm mb-3 text-[var(--color-text-muted)]">🔴 ყველაზე რთული სიტყვები</h3>
            <div className="space-y-2">
              {hardestWords.map(w => (
                <div key={w.en} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{w.en}</span>
                    <span className="text-[var(--color-text-muted)] ml-2">— {w.ka}</span>
                  </div>
                  <span className="text-red-400 text-xs">{w.attempts}x არასწორი</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* XP Earned */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">+{sessionXP} XP</div>
          <div className="text-sm text-[var(--color-text-muted)]">⭐ მიღებული ქულები ამ სესიაში</div>
        </div>

        {/* Speed stat */}
        {minutes > 0 && (
          <div className="text-center text-sm text-[var(--color-text-muted)] mb-6">
            ⚡ სიჩქარე: ~{wordsPerMin} სიტყვა/წუთში
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button onClick={restartSession} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors border-b-4 border-green-700 active:border-b-0 active:mt-1">
            თავიდან დაწყება 🔄
          </button>
          <button onClick={onBack} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text)] font-semibold px-6 py-3 rounded-xl transition-colors border border-white/5">
            სხვა კატეგორია 📝
          </button>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <p>ბარათები არ მოიძებნა</p>
        <button onClick={onBack} className="mt-4 text-[var(--color-primary)]">← უკან</button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
          ← უკან
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">
            {isReverse ? 'KA → EN' : 'EN → KA'}
          </span>
        </div>
      </div>

      {/* Progress info */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--color-text-muted)]">
          ✅ {guessedCount} გამოცნობილი
        </span>
        <span className="text-sm font-semibold text-[var(--color-primary)]">
          📦 {remaining} დარჩენილი
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[var(--color-bg-card)] rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
          style={{ width: `${(guessedCount / totalCards) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        onClick={handleCardTap}
        className="bg-[var(--color-bg-card)] rounded-3xl p-8 min-h-[280px] flex flex-col items-center justify-center cursor-pointer select-none transition-all hover:bg-[var(--color-bg-card-hover)]"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl font-bold">{questionText}</div>
          {!isReverse && (
            <button
              onClick={(e) => { e.stopPropagation(); speak(card.english); }}
              className="text-2xl hover:scale-110 transition-transform active:scale-95"
              title="მოისმინე გამოთქმა"
            >🔊</button>
          )}
        </div>
        {!isReverse && <div className="text-sm text-[var(--color-text-muted)] mb-4">{card.pronunciation}</div>}
        {isReverse && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-[var(--color-text-muted)]">თარგმნე ინგლისურად</span>
            <button
              onClick={(e) => { e.stopPropagation(); speak(card.georgian, 'ka-GE'); }}
              className="text-base hover:scale-110 transition-transform active:scale-95"
              title="მოისმინე ქართულად"
            >🔊</button>
          </div>
        )}

        {!flipped && !guessResult && (
          <div className="text-[var(--color-text-muted)] text-sm mt-6 animate-pulse">
            ჩაწერე თარგმანი ქვემოთ ან შეეხე ბარათს 👇
          </div>
        )}

        {flipped && (
          <div className="mt-4 text-center animate-[fadeIn_0.3s_ease-in]">
            {guessResult && (
              <div className={`text-lg font-bold mb-2 ${guessResult === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {guessResult === 'correct' ? '✅ სწორია!' : '❌ არასწორია'}
              </div>
            )}
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="text-2xl font-bold text-[var(--color-primary)]">{answerText}</div>
              {!isReverse && (
                <button
                  onClick={(e) => { e.stopPropagation(); speak(card.georgian, 'ka-GE'); }}
                  className="text-base hover:scale-110 transition-transform"
                  title="მოისმინე ქართულად"
                >🔊</button>
              )}
            </div>
            {isReverse && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm text-[var(--color-text-muted)]">{card.pronunciation}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(card.english); }}
                  className="text-base hover:scale-110 transition-transform"
                >🔊</button>
              </div>
            )}
            {guessResult === 'wrong' && guess.trim() && (
              <div className="text-sm text-red-400/70 mb-2">შენი პასუხი: {guess}</div>
            )}
            <div className="text-sm text-[var(--color-text-muted)] mb-1 flex items-center gap-2">
              <span>📖 {card.example_en}</span>
              <button
                onClick={(e) => { e.stopPropagation(); speak(card.example_en); }}
                className="text-base hover:scale-110 transition-transform shrink-0"
              >🔊</button>
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">📖 {card.example_ka}</div>
          </div>
        )}
      </div>

      {/* Guess input */}
      {!flipped && (
        <div className="mt-4 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
            placeholder={placeholderText}
            className="flex-1 bg-[var(--color-bg-card)] border border-white/10 rounded-xl px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
          <button
            onClick={handleGuess}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            შემოწმება
          </button>
        </div>
      )}

      {/* Next button */}
      {flipped && (
        <div className="mt-6">
          <button
            onClick={handleNext}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {guessResult === 'correct' ? 'შემდეგი →' : 'შემდეგი (სიტყვა ბოლოში გადავა) →'}
          </button>
        </div>
      )}
    </div>
  );
}
