import { useState, useEffect, useCallback } from 'react';
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

export default function SentenceBuilder({ deck, onBack }: Props) {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const TOTAL_QUESTIONS = Math.min(10, deck.cards.length);

  useEffect(() => {
    const shuffled = shuffleArray(deck.cards).slice(0, TOTAL_QUESTIONS);
    setCards(shuffled);
    setIndex(0);
    setScore(0);
    setTotal(0);
  }, [deck]);

  useEffect(() => {
    if (cards.length === 0) return;
    const card = cards[index];
    const words = card.example_en.split(/\s+/);
    setCorrectWords(words);
    setAvailableWords(shuffleArray(words));
    setSelectedWords([]);
    setChecked(false);
    setIsCorrect(false);
  }, [cards, index]);

  const handleSelectWord = useCallback((wordIndex: number) => {
    if (checked) return;
    setSelectedWords(prev => [...prev, wordIndex]);
  }, [checked]);

  const handleRemoveWord = useCallback((position: number) => {
    if (checked) return;
    setSelectedWords(prev => prev.filter((_, i) => i !== position));
  }, [checked]);

  const handleCheck = () => {
    const userSentence = selectedWords.map(i => availableWords[i]).join(' ');
    const correct = correctWords.join(' ');
    const result = userSentence === correct;
    setIsCorrect(result);
    setChecked(true);
    setTotal(prev => prev + 1);
    if (result) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (index + 1 < cards.length) {
      setIndex(prev => prev + 1);
    }
  };

  const finished = total >= TOTAL_QUESTIONS && checked;
  const card = cards[index];

  if (!card) return null;

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-lg mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">🏆 სესია დასრულდა!</h2>
        <div className="text-6xl mb-4">{pct >= 80 ? '🌟' : pct >= 50 ? '👍' : '💪'}</div>
        <p className="text-xl mb-2">{score} / {total} სწორი</p>
        <p className="text-lg text-gray-400 mb-6">{pct}% სიზუსტე</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="px-6 py-3 bg-gray-700 rounded-lg font-medium">
            ← უკან
          </button>
          <button onClick={() => { setCards(shuffleArray(deck.cards).slice(0, TOTAL_QUESTIONS)); setIndex(0); setScore(0); setTotal(0); }} className="px-6 py-3 bg-green-600 rounded-lg font-medium">
            🔄 თავიდან
          </button>
        </div>
      </div>
    );
  }

  const usedIndices = new Set(selectedWords);

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-gray-400 hover:text-white">← უკან</button>
        <span className="text-sm text-gray-400">{index + 1} / {TOTAL_QUESTIONS}</span>
        <span className="text-sm text-green-400">{score} ✓</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${((index + (checked ? 1 : 0)) / TOTAL_QUESTIONS) * 100}%` }} />
      </div>

      {/* Georgian hint */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4 text-center">
        <p className="text-sm text-gray-400 mb-1">🇬🇪 ქართულად:</p>
        <p className="text-lg font-medium">{card.example_ka}</p>
      </div>

      {/* Instruction */}
      <p className="text-center text-sm text-gray-400 mb-3">სიტყვები დაალაგე სწორი თანმიმდევრობით 👇</p>

      {/* Selected words (sentence building area) */}
      <div className="min-h-[60px] bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl p-3 mb-4 flex flex-wrap gap-2">
        {selectedWords.length === 0 && (
          <span className="text-gray-500 text-sm">დააჭირე სიტყვებს ქვემოთ...</span>
        )}
        {selectedWords.map((wordIdx, pos) => (
          <button
            key={pos}
            onClick={() => handleRemoveWord(pos)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              checked
                ? isCorrect
                  ? 'bg-green-600/30 border border-green-500 text-green-300'
                  : 'bg-red-600/30 border border-red-500 text-red-300'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {availableWords[wordIdx]}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {availableWords.map((word, i) => (
          <button
            key={i}
            onClick={() => handleSelectWord(i)}
            disabled={usedIndices.has(i) || checked}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              usedIndices.has(i)
                ? 'bg-gray-800 text-gray-600 cursor-default'
                : 'bg-gray-700 hover:bg-gray-600 text-white cursor-pointer'
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Correct answer if wrong */}
      {checked && !isCorrect && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-xl p-3 mb-4 text-center">
          <p className="text-sm text-yellow-400 mb-1">სწორი პასუხი:</p>
          <p className="text-white font-medium">{correctWords.join(' ')}</p>
        </div>
      )}

      {/* Check / Next button */}
      {!checked ? (
        <button
          onClick={handleCheck}
          disabled={selectedWords.length !== availableWords.length}
          className="w-full py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
        >
          შემოწმება ✓
        </button>
      ) : (
        <button onClick={handleNext} className="w-full py-3 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-700">
          შემდეგი →
        </button>
      )}
    </div>
  );
}
