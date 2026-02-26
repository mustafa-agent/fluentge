import { useState, useMemo, useRef } from 'react';
import { Deck, FlashCard, getCardId } from '../lib/cards';
import { sm2 } from '../lib/sm2';
import { getCardProgress, saveCardProgress, updateStats, incrementWordsLearned } from '../lib/storage';
import { playCorrect, playWrong } from '../lib/sounds';

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[.,!?;:'"()]/g, '');
}

type Direction = 'en-ka' | 'ka-en' | 'mixed';
type DirSuffix = 'enka' | 'kaen';

function dirToSuffix(dir: 'en-ka' | 'ka-en'): DirSuffix {
  return dir === 'en-ka' ? 'enka' : 'kaen';
}

type StorageSuffix = 'enka' | 'kaen' | 'mixed';

interface Props {
  deck: Deck;
  direction?: Direction;
  onBack: () => void;
  onNextDeck?: () => void;
  nextDeckName?: string;
}

export default function StudyScreen({ deck, direction = 'en-ka', onBack, onNextDeck, nextDeckName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [guess, setGuess] = useState('');
  const [guessResult, setGuessResult] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // For mixed mode, pre-generate random directions per card
  const cardDirections = useMemo(() => {
    return Array.from({ length: 20 }, () => Math.random() < 0.5 ? 'en-ka' as const : 'ka-en' as const);
  }, []);

  // Determine the actual direction for each card index
  function getDirForIndex(idx: number): 'en-ka' | 'ka-en' {
    if (direction === 'mixed') return cardDirections[idx] || 'en-ka';
    return direction;
  }

  // Storage suffix: enka, kaen, or mixed
  const storageSuffix: StorageSuffix = direction === 'mixed' ? 'mixed' : dirToSuffix(direction);

  const studyCards = useMemo(() => {
    const now = Date.now();
    const due = deck.cards.filter(c => {
      const p = getCardProgress(getCardId(c, storageSuffix));
      return p.nextReview <= now || p.repetitions === 0;
    });
    return due.length > 0 ? due.slice(0, 10) : deck.cards.slice(0, 10);
  }, [deck, storageSuffix]);

  const card: FlashCard | undefined = studyCards[currentIndex];
  const currentDir = getDirForIndex(currentIndex);
  const isReverse = currentDir === 'ka-en';

  const questionText = isReverse ? card?.georgian : card?.english;
  const answerText = isReverse ? card?.english : card?.georgian;
  const placeholderText = isReverse ? 'ჩაწერე ინგლისური თარგმანი...' : 'ჩაწერე ქართული თარგმანი...';

  function handleGuess() {
    if (!card || !guess.trim() || !answerText) return;
    const possibleAnswers = answerText.split(/[;/]/).map(s => normalize(s));
    const userAnswer = normalize(guess);
    const isCorrect = possibleAnswers.some(ans => ans === userAnswer || userAnswer.includes(ans) || ans.includes(userAnswer));
    setGuessResult(isCorrect ? 'correct' : 'wrong');
    setFlipped(true);
    if (isCorrect) playCorrect(); else playWrong();
    
    const quality = isCorrect ? 5 : 1;
    const id = getCardId(card, storageSuffix);
    const progress = getCardProgress(id);
    const updated = sm2(progress, quality);
    saveCardProgress(updated);
    updateStats(isCorrect);
    if (isCorrect && progress.repetitions === 0) {
      incrementWordsLearned();
    }
    if (isCorrect) {
      try {
        const known: Array<{word: string, georgian: string}> = JSON.parse(localStorage.getItem('knownCards') || '[]');
        if (!known.some(k => k.word === card.english)) {
          known.push({ word: card.english, georgian: card.georgian });
          localStorage.setItem('knownCards', JSON.stringify(known));
        }
      } catch { /* ignore */ }
    }
    setCorrect(c => c + (isCorrect ? 1 : 0));
    setTotal(t => t + 1);
  }

  function handleNext() {
    setFlipped(false);
    setGuess('');
    setGuessResult(null);

    if (currentIndex + 1 >= studyCards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex(i => i + 1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function restartSession() {
    setCurrentIndex(0);
    setFlipped(false);
    setSessionDone(false);
    setCorrect(0);
    setTotal(0);
    setGuess('');
    setGuessResult(null);
  }

  if (sessionDone) {
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">სესია დასრულდა!</h2>
        <p className="text-[var(--color-text-muted)] mb-6">
          {correct}/{total} სწორი · {accuracy}% სიზუსტე
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={restartSession} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            შემდეგი სესია →
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
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
          ← უკან
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">
            {isReverse ? 'KA → EN' : 'EN → KA'}
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            {currentIndex + 1}/{studyCards.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[var(--color-bg-card)] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / studyCards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        onClick={() => { 
          if (!flipped) { 
            setFlipped(true); 
            if (!guess.trim() && !guessResult) {
              const id = getCardId(card, storageSuffix);
              const progress = getCardProgress(id);
              const updated = sm2(progress, 1);
              saveCardProgress(updated);
              updateStats(false);
              setTotal(t => t + 1);
            }
          } 
        }}
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
        {isReverse && <div className="text-sm text-[var(--color-text-muted)] mb-4">თარგმნე ინგლისურად</div>}

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
            <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">{answerText}</div>
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
            შემდეგი →
          </button>
        </div>
      )}
    </div>
  );
}
