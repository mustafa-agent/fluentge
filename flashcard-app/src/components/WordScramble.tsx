import { useState, useEffect } from 'react';
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

function scrambleWord(word: string): string[] {
  const letters = word.split('');
  let scrambled = shuffleArray(letters);
  // Make sure it's actually scrambled
  let attempts = 0;
  while (scrambled.join('') === word && attempts < 10) {
    scrambled = shuffleArray(letters);
    attempts++;
  }
  return scrambled;
}

const ROUND_SIZE = 10;

export default function WordScramble({ deck, onBack }: Props) {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]); // indices into scrambled
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const shuffled = shuffleArray(deck.cards)
      .filter(c => c.english.length >= 3 && c.english.length <= 12 && !c.english.includes(' '))
      .slice(0, ROUND_SIZE);
    if (shuffled.length === 0) {
      // fallback: use all cards
      setCards(shuffleArray(deck.cards).slice(0, ROUND_SIZE));
    } else {
      setCards(shuffled);
    }
  }, [deck]);

  useEffect(() => {
    if (cards.length === 0 || currentIndex >= cards.length) return;
    const word = cards[currentIndex].english.toLowerCase();
    setScrambled(scrambleWord(word));
    setSelected([]);
    setShowResult(null);
  }, [currentIndex, cards]);

  const currentWord = cards[currentIndex]?.english.toLowerCase() || '';
  const builtWord = selected.map(i => scrambled[i]).join('');

  useEffect(() => {
    if (builtWord.length === currentWord.length && builtWord.length > 0) {
      if (builtWord === currentWord) {
        setShowResult('correct');
        setCorrect(prev => prev + 1);
        setTimeout(() => {
          if (currentIndex + 1 >= cards.length) {
            setDone(true);
          } else {
            setCurrentIndex(prev => prev + 1);
          }
        }, 800);
      } else {
        setShowResult('wrong');
        setWrong(prev => prev + 1);
        setTimeout(() => {
          setSelected([]);
          setShowResult(null);
        }, 800);
      }
    }
  }, [builtWord, currentWord, currentIndex, cards.length]);

  function handleLetterTap(index: number) {
    if (selected.includes(index) || showResult) return;
    setSelected(prev => [...prev, index]);
  }

  function handleUndo() {
    if (showResult) return;
    setSelected(prev => prev.slice(0, -1));
  }

  if (cards.length === 0) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-6 block">← უკან</button>
        <p>არ არის საკმარისი სიტყვები ამ კატეგორიაში</p>
      </div>
    );
  }

  if (done) {
    const total = correct + wrong;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-6">მშვენიერია!</h2>
        <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-6">
          <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">{correct}/{cards.length}</div>
          <div className="text-[var(--color-text-muted)]">სწორი პასუხი</div>
          <div className="text-amber-400 text-lg mt-2">{accuracy}% სიზუსტე</div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setCards(shuffleArray(deck.cards).filter(c => c.english.length >= 3 && c.english.length <= 12 && !c.english.includes(' ')).slice(0, ROUND_SIZE));
              setCurrentIndex(0);
              setCorrect(0);
              setWrong(0);
              setDone(false);
            }}
            className="flex-1 bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl"
          >
            🔄 თავიდან
          </button>
          <button onClick={onBack} className="flex-1 bg-[var(--color-bg-card)] font-bold py-3 rounded-xl">
            ← უკან
          </button>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)]">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">
          {currentIndex + 1}/{cards.length}
        </span>
        <span className="text-sm font-bold text-[var(--color-primary)]">✅ {correct}</span>
      </div>

      {/* Hint: Georgian translation */}
      <div className="text-center mb-4">
        <div className="text-lg text-[var(--color-text-muted)]">🇬🇪 {card.georgian}</div>
        <div className="text-sm text-[var(--color-text-muted)] mt-1">გაშიფრე ინგლისური სიტყვა!</div>
      </div>

      {/* Built word display */}
      <div className={`bg-[var(--color-bg-card)] rounded-2xl p-6 mb-6 text-center min-h-[80px] flex items-center justify-center transition-colors ${
        showResult === 'correct' ? 'border-2 border-green-500' : showResult === 'wrong' ? 'border-2 border-red-500' : 'border-2 border-transparent'
      }`}>
        <div className="flex gap-1 justify-center">
          {currentWord.split('').map((_, i) => (
            <div
              key={i}
              className={`w-10 h-12 rounded-lg flex items-center justify-center text-2xl font-bold ${
                i < selected.length
                  ? showResult === 'correct'
                    ? 'bg-green-500/30 text-green-400'
                    : showResult === 'wrong'
                    ? 'bg-red-500/30 text-red-400'
                    : 'bg-white/10'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {i < selected.length ? scrambled[selected[i]] : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Scrambled letters */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {scrambled.map((letter, i) => (
          <button
            key={i}
            onClick={() => handleLetterTap(i)}
            disabled={selected.includes(i)}
            className={`w-12 h-12 rounded-xl text-xl font-bold transition-all ${
              selected.includes(i)
                ? 'bg-white/5 text-white/20 scale-90'
                : 'bg-[var(--color-bg-card)] hover:bg-white/10 active:scale-90'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Undo button */}
      {selected.length > 0 && !showResult && (
        <div className="text-center">
          <button
            onClick={handleUndo}
            className="text-[var(--color-text-muted)] hover:text-white text-sm py-2 px-4"
          >
            ↩️ წაშლა
          </button>
        </div>
      )}
    </div>
  );
}
