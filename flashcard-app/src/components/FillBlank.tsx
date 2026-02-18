import { useState, useMemo } from 'react';
import { FlashCard } from '../lib/cards';
import { updateStats } from '../lib/storage';
import { playCorrect, playWrong } from '../lib/sounds';

interface Props {
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

function makeBlankSentence(card: FlashCard): { sentence: string; word: string } | null {
  const ex = card.example_en;
  if (!ex) return null;
  const word = card.english;
  const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  if (!regex.test(ex)) return null;
  const sentence = ex.replace(regex, '___');
  return { sentence, word };
}

export default function FillBlank({ allCards, onBack }: Props) {
  const questions = useMemo(() => {
    const valid = allCards
      .map(card => {
        const blank = makeBlankSentence(card);
        if (!blank) return null;
        const others = allCards.filter(c => c.english !== card.english);
        const wrongs = shuffle(others).slice(0, 3);
        const options = shuffle([
          { text: card.english, hint: card.georgian, correct: true },
          ...wrongs.map(w => ({ text: w.english, hint: w.georgian, correct: false })),
        ]);
        return { card, sentence: blank.sentence, options };
      })
      .filter(Boolean) as { card: FlashCard; sentence: string; options: { text: string; hint: string; correct: boolean }[] }[];
    return shuffle(valid).slice(0, 10);
  }, [allCards]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[current];

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = q.options[idx].correct;
    if (isCorrect) {
      setCorrect(c => c + 1);
      playCorrect();
    } else {
      playWrong();
    }
    updateStats(isCorrect);

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 1500);
  }

  if (questions.length === 0) {
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="text-4xl mb-4">😅</div>
        <p className="text-[var(--color-text-muted)] mb-6">საკმარისი კითხვები ვერ მოიძებნა</p>
        <button onClick={onBack} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          უკან დაბრუნება
        </button>
      </div>
    );
  }

  if (done) {
    const accuracy = Math.round((correct / questions.length) * 100);
    const emoji = accuracy >= 80 ? '🏆' : accuracy >= 50 ? '👍' : '💪';
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-2xl font-bold mb-2">შეავსე გამოტოვებული დასრულდა!</h2>
        <p className="text-[var(--color-text-muted)] mb-2">
          {correct}/{questions.length} სწორი · {accuracy}% სიზუსტე
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          {accuracy >= 80 ? 'შესანიშნავი! 🎉' : accuracy >= 50 ? 'კარგი შედეგია!' : 'გაიმეორე და გაუმჯობესდი!'}
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
        <p className="text-sm text-[var(--color-text-muted)] mb-3">შეავსე გამოტოვებული სიტყვა:</p>
        <div className="text-xl font-semibold leading-relaxed bg-[var(--color-bg-card)] rounded-xl p-4">
          {q.sentence}
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-muted)] mb-3 text-center">აირჩიე სწორი სიტყვა:</p>

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
              className={`${bg} border border-transparent rounded-xl py-3 px-5 text-left transition-all ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-lg font-medium">{opt.text}</span>
              <span className="text-sm text-[var(--color-text-muted)] ml-2">({opt.hint})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
