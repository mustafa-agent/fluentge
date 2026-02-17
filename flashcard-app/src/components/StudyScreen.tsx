import { useState, useMemo } from 'react';
import { Deck, FlashCard, getCardId } from '../lib/cards';
import { sm2 } from '../lib/sm2';
import { getCardProgress, saveCardProgress, updateStats, incrementWordsLearned } from '../lib/storage';

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

  const studyCards = useMemo(() => {
    const now = Date.now();
    const due = deck.cards.filter(c => {
      const p = getCardProgress(getCardId(c));
      return p.nextReview <= now || p.repetitions === 0;
    });
    // If no due cards, show all
    return due.length > 0 ? due.slice(0, 10) : deck.cards.slice(0, 10);
  }, [deck]);

  const card: FlashCard | undefined = studyCards[currentIndex];

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

    if (currentIndex + 1 >= studyCards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex(i => i + 1);
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
        className="bg-[var(--color-bg-card)] rounded-3xl p-8 min-h-[320px] flex flex-col items-center justify-center cursor-pointer select-none transition-all hover:bg-[var(--color-bg-card-hover)]"
      >
        <div className="text-3xl font-bold mb-2">{card.english}</div>
        <div className="text-sm text-[var(--color-text-muted)] mb-4">{card.pronunciation}</div>

        {!flipped && (
          <div className="text-[var(--color-text-muted)] text-sm mt-8 animate-pulse">
            შეეხე თარგმანის სანახავად 👆
          </div>
        )}

        {flipped && (
          <div className="mt-4 text-center animate-[fadeIn_0.3s_ease-in]">
            <div className="text-2xl font-bold text-[var(--color-primary)] mb-3">{card.georgian}</div>
            <div className="text-sm text-[var(--color-text-muted)] mb-1">📖 {card.example_en}</div>
            <div className="text-sm text-[var(--color-text-muted)]">📖 {card.example_ka}</div>
          </div>
        )}
      </div>

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
