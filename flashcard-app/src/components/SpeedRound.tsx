import { useState, useEffect, useCallback, useRef } from 'react';
import { Deck, FlashCard } from '../lib/cards';

interface Props {
  deck: Deck;
  onBack: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL_TIME = 60; // seconds

export default function SpeedRound({ deck, onBack }: Props) {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize
  useEffect(() => {
    const shuffled = shuffleArray(deck.cards);
    // Repeat cards if deck is small, so we never run out
    const repeated = [...shuffled, ...shuffleArray(deck.cards), ...shuffleArray(deck.cards)];
    setCards(repeated);
  }, [deck]);

  // Generate options for current card
  useEffect(() => {
    if (cards.length === 0 || currentIndex >= cards.length) return;
    const card = cards[currentIndex];
    const wrongOptions = deck.cards
      .filter(c => c.georgian !== card.georgian)
      .map(c => c.georgian);
    const shuffledWrong = shuffleArray(wrongOptions).slice(0, 3);
    const allOptions = shuffleArray([card.georgian, ...shuffledWrong]);
    setOptions(allOptions);
  }, [currentIndex, cards, deck]);

  // Timer
  useEffect(() => {
    if (!started || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, gameOver]);

  const handleAnswer = useCallback((answer: string) => {
    if (gameOver || cards.length === 0) return;
    const card = cards[currentIndex];
    if (answer === card.georgian) {
      setCorrect(prev => prev + 1);
      setFlash('correct');
    } else {
      setWrong(prev => prev + 1);
      setFlash('wrong');
    }
    setTimeout(() => setFlash(null), 200);
    setCurrentIndex(prev => prev + 1);
  }, [gameOver, cards, currentIndex]);

  if (!started) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-6 block">← უკან</button>
        <div className="text-6xl mb-4">⚡</div>
        <h2 className="text-2xl font-bold mb-2">სპიდ რაუნდი</h2>
        <p className="text-[var(--color-text-muted)] mb-2">{deck.icon} {deck.nameKa}</p>
        <p className="text-[var(--color-text-muted)] mb-8">
          რამდენ სიტყვას გამოიცნობ 60 წამში?<br/>
          აირჩიე სწორი ქართული თარგმანი!
        </p>
        <button
          onClick={() => setStarted(true)}
          className="bg-[var(--color-primary)] text-black font-bold py-4 px-12 rounded-2xl text-xl hover:opacity-90 transition-opacity"
        >
          🚀 დაწყება!
        </button>
      </div>
    );
  }

  if (gameOver) {
    const total = correct + wrong;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold mb-6">დრო ამოიწურა!</h2>
        <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-6 space-y-4">
          <div className="text-5xl font-bold text-[var(--color-primary)]">{correct}</div>
          <div className="text-[var(--color-text-muted)]">სწორი პასუხი</div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <div className="text-2xl font-bold text-red-400">{wrong}</div>
              <div className="text-xs text-[var(--color-text-muted)]">არასწორი</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-xs text-[var(--color-text-muted)]">სულ</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{accuracy}%</div>
              <div className="text-xs text-[var(--color-text-muted)]">სიზუსტე</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setCorrect(0);
              setWrong(0);
              setTimeLeft(TOTAL_TIME);
              setCurrentIndex(0);
              setGameOver(false);
              setCards(shuffleArray([...deck.cards, ...shuffleArray(deck.cards), ...shuffleArray(deck.cards)]));
              setStarted(true);
            }}
            className="flex-1 bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl"
          >
            🔄 თავიდან
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-[var(--color-bg-card)] font-bold py-3 rounded-xl"
          >
            ← უკან
          </button>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];
  const timerPct = (timeLeft / TOTAL_TIME) * 100;
  const timerColor = timeLeft > 20 ? 'bg-[var(--color-primary)]' : timeLeft > 10 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className={`px-4 py-6 max-w-lg mx-auto transition-colors duration-200 ${
      flash === 'correct' ? 'bg-green-900/30' : flash === 'wrong' ? 'bg-red-900/30' : ''
    }`}>
      {/* Timer bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-[var(--color-text-muted)]">⏱️ {timeLeft}წ</span>
          <span className="text-sm font-bold text-[var(--color-primary)]">✅ {correct}</span>
        </div>
        <div className="h-2 bg-[var(--color-bg-card)] rounded-full overflow-hidden">
          <div
            className={`h-full ${timerColor} rounded-full transition-all duration-1000`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      </div>

      {/* Word */}
      {card && (
        <>
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-8 mb-6 text-center">
            <div className="text-4xl font-bold mb-2">{card.english}</div>
            <div className="text-sm text-[var(--color-text-muted)]">{card.pronunciation}</div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, i) => (
              <button
                key={`${currentIndex}-${i}`}
                onClick={() => handleAnswer(opt)}
                className="bg-[var(--color-bg-card)] hover:bg-white/10 font-medium py-4 px-4 rounded-xl text-center transition-colors active:scale-95 transform"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
