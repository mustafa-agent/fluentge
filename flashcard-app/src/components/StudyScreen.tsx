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

interface Props {
  deck: Deck;
  onBack: () => void;
}

export default function StudyScreen({ deck, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [guess, setGuess] = useState('');
  const [guessResult, setGuessResult] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const studyCards = useMemo(() => {
    const now = Date.now();
    const due = deck.cards.filter(c => {
      const p = getCardProgress(getCardId(c));
      return p.nextReview <= now || p.repetitions === 0;
    });
    return due.length > 0 ? due.slice(0, 10) : deck.cards.slice(0, 10);
  }, [deck]);

  const card: FlashCard | undefined = studyCards[currentIndex];

  function handleGuess() {
    if (!card || !guess.trim()) return;
    const isCorrect = normalize(guess) === normalize(card.georgian);
    setGuessResult(isCorrect ? 'correct' : 'wrong');
    setFlipped(true);
    if (isCorrect) playCorrect(); else playWrong();
  }

  function handleRate(quality: number) {
    if (!card) return;
    const id = getCardId(card);
    const progress = getCardProgress(id);
    const isCorrect = quality >= 3;
    const updated = sm2(progress, quality);
    saveCardProgress(updated);
    updateStats(isCorrect);
    if (isCorrect && progress.repetitions === 0) {
      incrementWordsLearned();
    }
    setCorrect(c => c + (isCorrect ? 1 : 0));
    setTotal(t => t + 1);
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

  if (sessionDone) {
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">სესია დასრულდა!</h2>
        <p className="text-[var(--color-text-muted)] mb-6">
          {correct}/{total} სწორი · {accuracy}% სიზუსტე
        </p>
        <button onClick={onBack} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          უკან დაბრუნება
        </button>
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
        <span className="text-sm text-[var(--color-text-muted)]">
          {currentIndex + 1}/{studyCards.length}
        </span>
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
        onClick={() => !flipped && setFlipped(true)}
        className="bg-[var(--color-bg-card)] rounded-3xl p-8 min-h-[280px] flex flex-col items-center justify-center cursor-pointer select-none transition-all hover:bg-[var(--color-bg-card-hover)]"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl font-bold">{card.english}</div>
          <button
            onClick={(e) => { e.stopPropagation(); speak(card.english); }}
            className="text-2xl hover:scale-110 transition-transform active:scale-95"
            title="მოისმინე გამოთქმა"
          >🔊</button>
        </div>
        <div className="text-sm text-[var(--color-text-muted)] mb-4">{card.pronunciation}</div>

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
            <div className="text-2xl font-bold text-[var(--color-primary)] mb-3">{card.georgian}</div>
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
            placeholder="ჩაწერე ქართული თარგმანი..."
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

      {/* Rating buttons */}
      {flipped && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            onClick={() => handleRate(1)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 rounded-xl transition-colors"
          >
            😕 არ ვიცი
          </button>
          <button
            onClick={() => handleRate(3)}
            className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-semibold py-3 rounded-xl transition-colors"
          >
            🤔 ძნელია
          </button>
          <button
            onClick={() => handleRate(5)}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold py-3 rounded-xl transition-colors"
          >
            😄 ვიცი!
          </button>
        </div>
      )}
    </div>
  );
}
