import { useState, useEffect, useRef } from 'react';
import { Deck, FlashCard } from '../lib/cards';

interface Props {
  deck: Deck;
  onBack: () => void;
}

function speak(text: string) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.85;
    speechSynthesis.speak(u);
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SpellingScreen({ deck, onBack }: Props) {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCards(shuffleArray(deck.cards).slice(0, 10));
  }, [deck]);

  useEffect(() => {
    if (cards.length > 0 && index < cards.length && !result) {
      inputRef.current?.focus();
    }
  }, [index, cards, result]);

  if (cards.length === 0) return null;

  const card = cards[index];
  const total = cards.length;
  const progress = ((index) / total) * 100;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (result) return;

    const correct = input.trim().toLowerCase() === card.english.toLowerCase();
    setResult(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    speak(card.english);
  }

  function handleNext() {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex(i => i + 1);
      setInput('');
      setResult(null);
    }
  }

  function handleRestart() {
    setCards(shuffleArray(deck.cards).slice(0, 10));
    setIndex(0);
    setInput('');
    setResult(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2">მართლწერის ტესტი დასრულდა!</h2>
        <p className="text-lg text-[var(--color-text-muted)] mb-4">
          {score}/{total} სწორი ({pct}%)
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleRestart} className="px-6 py-3 bg-[var(--color-primary)] text-black font-bold rounded-xl">
            🔄 თავიდან
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-white/10 rounded-xl">
            ← უკან
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">
          ← უკან
        </button>
        <span className="text-sm text-[var(--color-text-muted)]">
          {index + 1}/{total} • {score} ✓
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/10 rounded-full mb-6">
        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Card */}
      <div className="bg-white/5 rounded-2xl p-6 text-center mb-6">
        <p className="text-sm text-[var(--color-text-muted)] mb-2">ქართულად:</p>
        <p className="text-3xl font-bold mb-3">{card.georgian}</p>
        <button
          onClick={() => speak(card.english)}
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          🔊 მოისმინე
        </button>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="block text-sm text-[var(--color-text-muted)] mb-2">
          ✍️ დაწერე ინგლისურად:
        </label>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={!!result}
          autoComplete="off"
          autoCapitalize="off"
          className={`w-full px-4 py-3 rounded-xl text-lg bg-white/10 border-2 outline-none transition-colors ${
            result === 'correct' ? 'border-green-500' :
            result === 'wrong' ? 'border-red-500' :
            'border-white/20 focus:border-[var(--color-primary)]'
          }`}
          placeholder="type here..."
        />
        {!result && (
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full mt-3 px-6 py-3 bg-[var(--color-primary)] text-black font-bold rounded-xl disabled:opacity-40"
          >
            შეამოწმე ✓
          </button>
        )}
      </form>

      {/* Result */}
      {result && (
        <div className={`rounded-xl p-4 mb-4 ${result === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {result === 'correct' ? (
            <p className="text-green-400 font-bold">✅ სწორია! — {card.english}</p>
          ) : (
            <div>
              <p className="text-red-400 font-bold mb-1">❌ არასწორია</p>
              <p className="text-sm">
                სწორი პასუხი: <span className="text-white font-bold">{card.english}</span>
              </p>
            </div>
          )}
          <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">
            {card.example_en}
          </p>
          <button
            onClick={handleNext}
            className="w-full mt-3 px-6 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20"
          >
            შემდეგი →
          </button>
        </div>
      )}
    </div>
  );
}
