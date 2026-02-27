import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Deck, FlashCard, getCardId } from '../lib/cards';
import { sm2 } from '../lib/sm2';
import { getCardProgress, saveCardProgress, updateStats, incrementWordsLearned } from '../lib/storage';
import { playCorrect, playWrong } from '../lib/sounds';

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

export default function StudyScreen({ deck, direction = 'en-ka', onBack }: Props) {
  const storageSuffix: StorageSuffix = direction === 'mixed' ? 'mixed' : dirToSuffix(direction);
  
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
    if (isCorrect) playCorrect(); else playWrong();

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
    
    setFlipped(false);
    setGuess('');
    setGuessResult(null);

    setQueue(prev => {
      const rest = prev.slice(1);
      if (wasCorrect) {
        // Card removed — guessed correctly
        if (rest.length === 0) {
          // All done!
          clearSessionProgress(deck.id, storageSuffix);
          setSessionDone(true);
          return [];
        }
        return rest;
      } else {
        // Wrong — move to bottom
        if (rest.length === 0) {
          // Only this card left, keep it
          return [prev[0]];
        }
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
        // Tapped without guessing = wrong
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

  if (sessionDone) {
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">ყველა სიტყვა გამოიცანი!</h2>
        <p className="text-[var(--color-text-muted)] mb-2">
          {totalCards} სიტყვა ისწავლე ამ კატეგორიაში
        </p>
        <p className="text-[var(--color-text-muted)] mb-6 text-sm">
          🏆 შესანიშნავი შედეგი!
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={restartSession} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            თავიდან დაწყება 🔄
          </button>
          <button onClick={onBack} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text)] font-semibold px-6 py-3 rounded-xl transition-colors">
            უკან დაბრუნება
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
