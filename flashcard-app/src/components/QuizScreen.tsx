import { useState, useMemo } from 'react';
import { Deck, FlashCard, getCardId } from '../lib/cards';
import { updateStats, incrementWordsLearned } from '../lib/storage';

interface Props {
  deck: Deck;
  allCards: FlashCard[];
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

export default function QuizScreen({ deck, allCards, onBack }: Props) {
  const questions = useMemo(() => {
    const shuffled = shuffle(deck.cards).slice(0, 10);
    return shuffled.map(card => {
      // Pick 3 wrong answers from other cards
      const others = allCards.filter(c => c.english !== card.english);
      const wrongs = shuffle(others).slice(0, 3);
      const options = shuffle([
        { text: card.georgian, correct: true },
        ...wrongs.map(w => ({ text: w.georgian, correct: false }))
      ]);
      return { card, options };
    });
  }, [deck, allCards]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[current];

  function handleSelect(idx: number) {
    if (selected !== null) return; // already answered
    setSelected(idx);
    const isCorrect = q.options[idx].correct;
    if (isCorrect) setCorrect(c => c + 1);
    updateStats(isCorrect);

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 1200);
  }

  if (done) {
    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const emoji = accuracy >= 80 ? '🏆' : accuracy >= 50 ? '👍' : '💪';
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-2xl font-bold mb-2">ქვიზი დასრულდა!</h2>
        <p className="text-[var(--color-text-muted)] mb-2">
          {correct}/{questions.length} სწორი · {accuracy}% სიზუსტე
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          {accuracy >= 80 ? 'შესანიშნავი! 🎉' : accuracy >= 50 ? 'კარგი შედეგია! გააგრძელე!' : 'გაიმეორე და გაუმჯობესდი!'}
        </p>
        <button onClick={onBack} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          უკან დაბრუნება
        </button>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
          ← უკან
        </button>
        <span className="text-sm text-[var(--color-text-muted)]">
          {current + 1}/{questions.length}
        </span>
      </div>

      <div className="h-1.5 bg-[var(--color-bg-card)] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
          style={{ width: `${(current / questions.length) * 100}%` }}
        />
      </div>

      <div className="text-center mb-8">
        <p className="text-sm text-[var(--color-text-muted)] mb-2">რას ნიშნავს:</p>
        <div className="flex items-center justify-center gap-3">
          <div className="text-3xl font-bold">{q.card.english}</div>
          <button
            onClick={() => speak(q.card.english)}
            className="text-2xl hover:scale-110 transition-transform"
          >🔊</button>
        </div>
        <div className="text-sm text-[var(--color-text-muted)] mt-1">{q.card.pronunciation}</div>
      </div>

      <div className="grid gap-3">
        {q.options.map((opt, idx) => {
          let bg = 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)]';
          if (selected !== null) {
            if (opt.correct) bg = 'bg-green-500/20 border-green-500';
            else if (idx === selected && !opt.correct) bg = 'bg-red-500/20 border-red-500';
            else bg = 'bg-[var(--color-bg-card)] opacity-50';
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`${bg} border border-transparent rounded-xl py-4 px-6 text-left text-lg transition-all ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
