import { useState, useRef } from 'react';
import { decks } from '../lib/cards';

interface Props {
  onBack: () => void;
}

const allWords = decks.flatMap(d => d.cards).filter(c => c.english.length >= 2 && !c.english.includes(' '));

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ListeningPractice({ onBack }: Props) {
  const [words] = useState(() => shuffle(allWords).slice(0, 20));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = words[index];

  function speak(text: string, rate = 0.8) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = rate;
      window.speechSynthesis.speak(u);
    }
  }

  function handlePlay() {
    if (current) speak(current.english);
  }

  function handlePlaySlow() {
    if (current) speak(current.english, 0.5);
  }

  function handleCheck() {
    if (!current) return;
    const correct = input.trim().toLowerCase() === current.english.toLowerCase();
    setResult(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
  }

  function handleNext() {
    if (index + 1 >= words.length) {
      setDone(true);
      return;
    }
    setIndex(i => i + 1);
    setInput('');
    setResult(null);
    setTimeout(() => {
      inputRef.current?.focus();
      speak(words[index + 1].english);
    }, 300);
  }

  function handleRestart() {
    setIndex(0);
    setInput('');
    setResult(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((score / words.length) * 100);
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <button onClick={onBack} className="text-[var(--color-primary)] mb-4 block">← უკან</button>
        <div className="text-4xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2">დასრულდა!</h2>
        <div className="text-xl mb-2">{score}/{words.length} ({pct}%)</div>
        <button onClick={handleRestart} className="mt-4 px-6 py-3 bg-[var(--color-primary)] text-black rounded-full font-bold">
          თავიდან →
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-primary)]">← უკან</button>
        <h2 className="text-xl font-bold">🎧 მოსმენა</h2>
        <div className="text-sm text-[var(--color-text-muted)]">{index + 1}/{words.length}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
        <div className="bg-[var(--color-primary)] h-1.5 rounded-full transition-all" style={{ width: `${((index + 1) / words.length) * 100}%` }} />
      </div>

      {/* Hint */}
      <div className="text-center mb-4">
        <span className="text-sm text-[var(--color-text-muted)]">მინიშნება: </span>
        <span className="font-medium text-[var(--color-primary)]">{current.georgian}</span>
      </div>

      {/* Play buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={handlePlay} className="w-20 h-20 rounded-full bg-[var(--color-primary)] text-black text-3xl flex items-center justify-center active:scale-95 transition-transform">
          🔊
        </button>
        <button onClick={handlePlaySlow} className="w-16 h-16 rounded-full bg-[var(--color-bg-card)] text-xl flex items-center justify-center active:scale-95 transition-transform self-end">
          🐢
        </button>
      </div>

      <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">მოისმინე და ჩაწერე რა გაიგე</p>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') result ? handleNext() : handleCheck(); }}
          placeholder="ჩაწერე ინგლისურად..."
          disabled={result !== null}
          className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 focus:border-[var(--color-primary)] outline-none text-lg"
          autoFocus
        />
        {result === null ? (
          <button onClick={handleCheck} disabled={!input.trim()} className="px-4 py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold disabled:opacity-50">
            ✓
          </button>
        ) : (
          <button onClick={handleNext} className="px-4 py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold">
            →
          </button>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-xl text-center ${result === 'correct' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
          <div className="text-2xl mb-1">{result === 'correct' ? '✅ სწორია!' : '❌ არასწორია!'}</div>
          {result === 'wrong' && (
            <div className="text-lg font-bold mt-1">{current.english}</div>
          )}
        </div>
      )}

      <div className="text-center mt-4 text-sm text-[var(--color-text-muted)]">
        ქულა: {score}/{index + (result ? 1 : 0)}
      </div>
    </div>
  );
}
