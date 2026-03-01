import { useState, useMemo, useRef, useEffect } from 'react';
import { Deck, FlashCard } from '../lib/cards';
import { updateStats, incrementWordsLearned } from '../lib/storage';
import { playCorrect, playWrong } from '../lib/sounds';
import { checkAchievements } from './Achievements';
import { recordWrong, recordRight } from '../lib/difficult-words';
import ShareResult from './ShareResult';

interface Props {
  deck: Deck;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function awardXP(amount: number) {
  try {
    const current = parseInt(localStorage.getItem('totalXP') || '0');
    localStorage.setItem('totalXP', String(current + amount));
  } catch {}
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[.,!?;:'"]/g, '');
}

export default function TypingScreen({ deck, onBack }: Props) {
  const cards = useMemo(() => shuffle(deck.cards).slice(0, 10), [deck]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const card = cards[current];

  useEffect(() => {
    if (!submitted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [current, submitted]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitted || !input.trim()) return;

    setSubmitted(true);
    const wasCorrect = normalize(input) === normalize(card.english);
    setIsCorrect(wasCorrect);

    if (wasCorrect) {
      setCorrect(c => c + 1);
      setStreak(s => {
        const ns = s + 1;
        if (ns > bestStreak) setBestStreak(ns);
        return ns;
      });
      const xp = 25; // Typing = harder = more XP
      setXpEarned(e => e + xp);
      awardXP(xp);
      playCorrect();
      incrementWordsLearned();
      recordRight(card.english);
    } else {
      setStreak(0);
      playWrong();
      recordWrong(card.english, card.georgian, card.category || 'typing', card.pronunciation);
    }
    updateStats(wasCorrect);
  }

  function handleContinue() {
    if (current + 1 >= cards.length) {
      setDone(true);
      checkAchievements();
    } else {
      setCurrent(c => c + 1);
      setInput('');
      setSubmitted(false);
      setIsCorrect(null);
    }
  }

  // Result screen
  if (done) {
    const accuracy = cards.length > 0 ? Math.round((correct / cards.length) * 100) : 0;
    const emoji = accuracy === 100 ? '🏆' : accuracy >= 80 ? '🎉' : accuracy >= 50 ? '✍️' : '💪';

    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="result-pop">
          <div className="text-7xl mb-4">{emoji}</div>
          <h2 className="text-3xl font-extrabold mb-2">წერა დასრულდა!</h2>
          <p className="text-lg text-[var(--color-text-muted)] mb-1">
            {accuracy === 100 ? 'სრულყოფილი! 💯' : accuracy >= 80 ? 'შესანიშნავი!' : accuracy >= 50 ? 'კარგი შედეგია!' : 'გაიმეორე!'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 my-8">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-b-4 border-green-500/30">
            <div className="text-2xl font-extrabold text-green-400">{correct}/{cards.length}</div>
            <div className="text-xs text-[var(--color-text-muted)]">სწორი</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-b-4 border-sky-500/30">
            <div className="text-2xl font-extrabold text-sky-400">{accuracy}%</div>
            <div className="text-xs text-[var(--color-text-muted)]">სიზუსტე</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-b-4 border-amber-500/30">
            <div className="text-2xl font-extrabold text-amber-400">+{xpEarned}</div>
            <div className="text-xs text-[var(--color-text-muted)]">XP</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-b-4 border-orange-500/30">
            <div className="text-2xl font-extrabold text-orange-400">🔥 {bestStreak}</div>
            <div className="text-xs text-[var(--color-text-muted)]">საუკეთესო სტრიქი</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="quiz-option px-6 py-3 text-base">
            უკან
          </button>
          <button
            onClick={() => { setCurrent(0); setInput(''); setSubmitted(false); setIsCorrect(null); setCorrect(0); setStreak(0); setBestStreak(0); setDone(false); setXpEarned(0); }}
            className="bg-indigo-500 border-indigo-600 border-2 border-b-4 active:border-b-2 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            თავიდან ✍️
          </button>
        </div>
        <ShareResult score={correct} total={cards.length} label="წერა" />
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-xl">
          ✕
        </button>
        <div className="flex-1 quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${((current + (submitted ? 1 : 0)) / cards.length) * 100}%` }} />
        </div>
        {streak >= 2 && (
          <span className="text-sm font-bold text-amber-400">🔥 {streak}</span>
        )}
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">დაწერე ინგლისურად</p>
          <div className="text-4xl font-extrabold mb-2">{card.georgian}</div>
          {card.pronunciation && (
            <div className="text-sm text-[var(--color-text-muted)] italic">{card.pronunciation}</div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="ჩაწერე ინგლისური სიტყვა..."
            className={`typing-input ${submitted ? (isCorrect ? 'correct-input' : 'wrong-input') : ''}`}
            disabled={submitted}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {!submitted && (
            <button
              type="submit"
              disabled={!input.trim()}
              className={`w-full font-bold py-3.5 rounded-xl border-2 border-b-4 transition-all uppercase tracking-wide ${
                input.trim()
                  ? 'bg-sky-400 border-sky-500 text-white active:border-b-2'
                  : 'bg-[var(--color-bg-card)] border-[var(--color-bg-card-hover)] text-[var(--color-text-muted)]'
              }`}
            >
              შეამოწმე
            </button>
          )}
        </form>

        {/* Correct answer reveal */}
        {submitted && !isCorrect && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-[var(--color-text-muted)] mb-1">სწორი პასუხი:</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-400">{card.english}</span>
              <button onClick={() => speak(card.english)} className="text-lg hover:scale-110 transition-transform">🔊</button>
            </div>
          </div>
        )}
        {submitted && isCorrect && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
            <span className="text-xl font-bold text-green-400">✅ სწორია! +25 XP</span>
          </div>
        )}
      </div>

      {/* Bottom feedback bar */}
      {submitted && (
        <div className={`quiz-feedback ${isCorrect ? 'correct-bar' : 'wrong-bar'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
            <span className="font-bold">{isCorrect ? 'შესანიშნავი!' : 'არასწორია'}</span>
          </div>
          <button
            onClick={handleContinue}
            className="bg-white/20 hover:bg-white/30 font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            გაგრძელება
          </button>
        </div>
      )}
    </div>
  );
}
