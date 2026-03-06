import { useState, useMemo, useCallback } from 'react';
import { Deck, FlashCard } from '../lib/cards';
import { playCorrect, playWrong } from '../lib/sounds';
import { addCardReview } from '../lib/gamification';

function awardXP(amount: number) {
  try {
    const current = parseInt(localStorage.getItem('totalXP') || '0');
    localStorage.setItem('totalXP', String(current + amount));
  } catch {}
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  deck: Deck;
  onBack: () => void;
}

interface Question {
  card: FlashCard;
  sentence: string;       // English sentence with blank
  answer: string;         // The word that fills the blank
  hint: string;           // Georgian translation
  options: string[];      // 4 options including correct
}

function buildQuestions(deck: Deck): Question[] {
  // Filter cards that have example sentences containing the English word
  const eligible = deck.cards.filter(c => {
    if (!c.example_en || !c.english) return false;
    const word = c.english.toLowerCase();
    return c.example_en.toLowerCase().includes(word);
  });

  if (eligible.length < 4) return [];

  const picked = shuffleArray(eligible).slice(0, Math.min(10, eligible.length));

  return picked.map(card => {
    const word = card.english;
    // Replace the word in the sentence with a blank (case-insensitive)
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const sentence = card.example_en!.replace(regex, '___');

    // Get 3 wrong options from other cards
    const others = eligible.filter(c => c.english !== card.english);
    const wrongs = shuffleArray(others).slice(0, 3).map(c => c.english);
    const options = shuffleArray([word, ...wrongs]);

    return {
      card,
      sentence,
      answer: word,
      hint: card.georgian,
      options,
    };
  });
}

export default function FillBlankExercise({ deck, onBack }: Props) {
  const questions = useMemo(() => buildQuestions(deck), [deck]);
  const TOTAL = questions.length;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const q = questions[current];

  const handleSelect = useCallback((option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    addCardReview();

    const isCorrect = option.toLowerCase() === q.answer.toLowerCase();
    if (isCorrect) {
      playCorrect();
      setCorrect(c => c + 1);
      awardXP(10);
      setXpEarned(x => x + 10);
    } else {
      playWrong();
    }
  }, [answered, q]);

  const handleNext = useCallback(() => {
    if (current + 1 >= TOTAL) {
      setShowResult(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [current, TOTAL]);

  // Not enough cards with example sentences
  if (TOTAL < 4) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-xl font-bold mb-2">არ არის საკმარისი წინადადებები</h2>
        <p className="text-[var(--color-text-muted)] mb-6">ამ კატეგორიაში არ არის საკმარისი მაგალითი ამ რეჟიმისთვის.</p>
        <button onClick={onBack} className="px-6 py-3 bg-sky-500 text-white rounded-xl font-bold border-b-4 border-sky-700 active:border-b-2 active:mt-[2px]">
          ← უკან
        </button>
      </div>
    );
  }

  // Result screen
  if (showResult) {
    const accuracy = Math.round((correct / TOTAL) * 100);
    const emoji = accuracy >= 90 ? '🏆' : accuracy >= 70 ? '👍' : accuracy >= 50 ? '💪' : '📚';
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 result-pop">{emoji}</div>
          <h2 className="text-2xl font-bold mb-1">შევსება დასრულდა!</h2>
          <p className="text-[var(--color-text-muted)]">{deck.name}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center border-b-4 border-green-500/30">
            <div className="text-2xl font-bold text-green-400">{correct}/{TOTAL}</div>
            <div className="text-xs text-[var(--color-text-muted)]">სწორი</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center border-b-4 border-sky-500/30">
            <div className="text-2xl font-bold text-sky-400">{accuracy}%</div>
            <div className="text-xs text-[var(--color-text-muted)]">სიზუსტე</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center border-b-4 border-yellow-500/30">
            <div className="text-2xl font-bold text-yellow-400">+{xpEarned}</div>
            <div className="text-xs text-[var(--color-text-muted)]">XP</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl font-bold bg-[var(--color-bg-card)] border border-white/10 active:scale-95 transition-transform">
            ← უკან
          </button>
          <button onClick={() => { setCurrent(0); setCorrect(0); setSelected(null); setAnswered(false); setShowResult(false); setXpEarned(0); }}
            className="flex-1 py-3 rounded-xl font-bold bg-green-500 text-white border-b-4 border-green-700 active:border-b-2 active:mt-[2px]">
            🔄 თავიდან
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white text-lg">←</button>
        <div className="flex-1">
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${((current + 1) / TOTAL) * 100}%` }} />
          </div>
        </div>
        <span className="text-sm font-mono text-[var(--color-text-muted)]">{current + 1}/{TOTAL}</span>
      </div>

      {/* Mode label */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
          📝 შეავსე გამოტოვებული
        </span>
      </div>

      {/* Sentence with blank */}
      <div className="fib-sentence bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4 text-center border border-white/5">
        <p className="text-xl leading-relaxed font-medium">
          {q.sentence.split('___').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className={`fib-blank ${answered ? (selected?.toLowerCase() === q.answer.toLowerCase() ? 'correct' : 'wrong') : ''}`}>
                  {answered ? q.answer : '______'}
                </span>
              )}
            </span>
          ))}
        </p>
        {/* Georgian hint */}
        <p className="fib-hint mt-3 text-sm">💡 {q.hint}</p>
      </div>

      {/* Options */}
      <div className="fib-options grid grid-cols-2 gap-3 mb-4">
        {q.options.map((opt, i) => {
          const isCorrectOpt = opt.toLowerCase() === q.answer.toLowerCase();
          const isSelected = selected === opt;
          let cls = 'fib-option quiz-option';
          if (answered) {
            if (isCorrectOpt) cls += ' correct';
            else if (isSelected && !isCorrectOpt) cls += ' wrong';
            else cls += ' dimmed';
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(opt)} disabled={answered}>
              <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="font-medium">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback bar */}
      {answered && (
        <div className={`quiz-feedback ${selected?.toLowerCase() === q.answer.toLowerCase() ? 'correct' : 'wrong'}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold">
                {selected?.toLowerCase() === q.answer.toLowerCase() ? '✅ სწორია!' : `❌ სწორი: ${q.answer}`}
              </span>
            </div>
            <button onClick={handleNext} className="px-5 py-2 bg-white/20 rounded-xl font-bold text-sm active:scale-95 transition-transform">
              {current + 1 >= TOTAL ? 'შედეგები →' : 'შემდეგი →'}
            </button>
          </div>
        </div>
      )}

      {/* XP float */}
      {answered && selected?.toLowerCase() === q.answer.toLowerCase() && (
        <div className="xp-float" style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)' }}>+10 XP</div>
      )}
    </div>
  );
}
