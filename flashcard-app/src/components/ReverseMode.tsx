import { useState, useEffect, useRef } from 'react';
import { Deck, FlashCard } from '../lib/cards';
import { playCorrect, playWrong } from '../lib/sounds';

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

export default function ReverseMode({ deck, onBack }: Props) {
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

  if (finished) {
    const pct = Math.round((score / cards.length) * 100);
    return (
      <div className="px-4 py-8 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2">სესია დასრულდა!</h2>
        <p className="text-[var(--color-text-muted)] mb-4">
          {score}/{cards.length} სწორი ({pct}%)
        </p>
        <div className="w-full h-3 bg-[var(--color-bg-card)] rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setIndex(0); setScore(0); setFinished(false); setInput(''); setResult(null); setCards(shuffleArray(deck.cards).slice(0, 10)); }} className="bg-[var(--color-primary)] text-black font-bold py-3 px-6 rounded-xl">🔁 თავიდან</button>
          <button onClick={onBack} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] py-3 px-6 rounded-xl">← უკან</button>
        </div>
      </div>
    );
  }

  const card = cards[index];
  const total = cards.length;
  const progress = (index / total) * 100;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (result) return;
    const isCorrect = input.trim().toLowerCase() === card.english.toLowerCase();
    setResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) { setScore(s => s + 1); playCorrect(); } else { playWrong(); }
  }

  function handleNext() {
    if (index + 1 >= total) { setFinished(true); return; }
    setIndex(i => i + 1);
    setInput('');
    setResult(null);
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">{index + 1}/{total}</span>
        <span className="text-sm font-bold text-[var(--color-primary)]">✅ {score}</span>
      </div>
      <div className="h-2 bg-[var(--color-bg-card)] rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 text-center mb-6">
        <div className="text-sm text-[var(--color-text-muted)] mb-2">🇬🇪 ქართული სიტყვა:</div>
        <div className="text-3xl font-bold mb-2">{card.georgian}</div>
        <div className="text-[var(--color-text-muted)] text-sm">გამოთქმა: {card.pronunciation}</div>
        {card.example_ka && <div className="text-xs text-[var(--color-text-muted)] mt-2 italic">"{card.example_ka}"</div>}
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="text-sm text-[var(--color-text-muted)] mb-2 text-center">🇬🇧 ჩაწერე ინგლისურად:</div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={!!result}
          autoComplete="off"
          className={`w-full text-center text-xl py-3 px-4 rounded-xl bg-[var(--color-bg)] border-2 outline-none transition-colors ${
            result === 'correct' ? 'border-green-500 text-green-400' :
            result === 'wrong' ? 'border-red-500 text-red-400' :
            'border-white/10 focus:border-[var(--color-primary)]'
          }`}
          placeholder="English word..."
        />
        {!result && (
          <button type="submit" className="w-full mt-3 bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl">შემოწმება</button>
        )}
      </form>

      {result && (
        <div className={`text-center mb-4 p-4 rounded-xl ${result === 'correct' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {result === 'correct' ? '✅ სწორია!' : `❌ პასუხი: ${card.english}`}
        </div>
      )}

      {result && (
        <button onClick={handleNext} className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] py-3 rounded-xl font-medium transition-colors">
          {index + 1 >= total ? '🏁 დასრულება' : '→ შემდეგი'}
        </button>
      )}
    </div>
  );
}
