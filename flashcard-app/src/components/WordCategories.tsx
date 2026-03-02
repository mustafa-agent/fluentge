import { useState, useEffect } from 'react';
import type { FlashCard, Deck } from '../lib/deck-loader';
import { useAllDecks } from '../lib/useDecks';

interface CategoryRound {
  categories: string[];
  categoryLabels: string[];
  words: { word: string; correctCategory: number }[];
}

function generateRound(allDecks: Deck[]): CategoryRound {
  const validDecks = allDecks.filter(d => d.cards.length >= 4);
  const shuffled = [...validDecks].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 3);

  const categories = picked.map(d => d.id);
  const categoryLabels = picked.map(d => `${d.icon} ${d.nameKa}`);

  const words: { word: string; correctCategory: number }[] = [];
  picked.forEach((deck, idx) => {
    const cards = [...deck.cards].sort(() => Math.random() - 0.5).slice(0, 3);
    cards.forEach(c => words.push({ word: c.english, correctCategory: idx }));
  });

  // Shuffle all words
  words.sort(() => Math.random() - 0.5);

  return { categories, categoryLabels, words };
}

export default function WordCategories({ onBack }: { onBack: () => void }) {
  const { decks: allDecks, loading } = useAllDecks();
  const [round, setRound] = useState<CategoryRound | null>(null);

  useEffect(() => {
    if (allDecks.length > 0 && !round) {
      setRound(generateRound(allDecks));
    }
  }, [allDecks]);

  if (loading || !round) {
    return <div className="p-8 text-center"><div className="animate-pulse text-2xl">🗂️</div><p className="text-[var(--color-text-muted)] mt-2">იტვირთება...</p></div>;
  }

  const currentRound = round!;
  const [placements, setPlacements] = useState<Map<number, number>>(new Map()); // wordIdx -> categoryIdx
  const [currentWord, setCurrentWord] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  function handleCategoryClick(catIdx: number) {
    if (!round) return;
    if (showResults) return;

    const newPlacements = new Map(placements);
    newPlacements.set(currentWord, catIdx);
    setPlacements(newPlacements);

    if (currentWord < round.words.length - 1) {
      setCurrentWord(currentWord + 1);
    } else {
      // All words placed - calculate score
      let correct = 0;
      newPlacements.forEach((placedCat, wordIdx) => {
        if (placedCat === round.words[wordIdx].correctCategory) correct++;
      });
      setScore(correct);
      setTotalCorrect(prev => prev + correct);
      setTotalRounds(prev => prev + 1);
      setShowResults(true);
    }
  }

  function handleNextRound() {
    setRound(generateRound(allDecks));
    setPlacements(new Map());
    setCurrentWord(0);
    setShowResults(false);
    setScore(0);
  }

  const wordsInCategory = (catIdx: number) => {
    const result: { word: string; correct: boolean; wordIdx: number }[] = [];
    placements.forEach((placedCat, wordIdx) => {
      if (placedCat === catIdx) {
        result.push({
          word: round.words[wordIdx].word,
          correct: round.words[wordIdx].correctCategory === catIdx,
          wordIdx
        });
      }
    });
    return result;
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
        <h2 className="text-lg font-bold">🗂️ კატეგორიები</h2>
        <div className="text-sm text-[var(--color-text-muted)]">
          {totalRounds > 0 ? `${totalCorrect}/${totalRounds * 9}` : ''}
        </div>
      </div>

      <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">
        მოათავსე სიტყვა სწორ კატეგორიაში
      </p>

      {/* Current word */}
      {!showResults && (
        <div className="text-center mb-6">
          <div className="text-sm text-[var(--color-text-muted)] mb-1">
            {currentWord + 1} / {round.words.length}
          </div>
          <div className="inline-block bg-[var(--color-primary)] text-black font-bold text-xl px-6 py-3 rounded-xl">
            {round.words[currentWord].word}
          </div>
        </div>
      )}

      {showResults && (
        <div className="text-center mb-6">
          <div className="text-3xl font-bold mb-2">
            {score}/{round.words.length}
          </div>
          <div className="text-sm text-[var(--color-text-muted)]">
            {score === round.words.length ? '🎉 სრულყოფილი!' : score >= 6 ? '👏 კარგია!' : '💪 სცადე ხელახლა!'}
          </div>
        </div>
      )}

      {/* Category buckets */}
      <div className="space-y-3">
        {round.categoryLabels.map((label, catIdx) => {
          const placed = wordsInCategory(catIdx);
          return (
            <button
              key={catIdx}
              onClick={() => handleCategoryClick(catIdx)}
              disabled={showResults}
              className={`w-full text-left bg-[var(--color-bg-card)] rounded-xl p-4 transition-all ${
                !showResults ? 'hover:bg-[var(--color-bg-card-hover)] active:scale-[0.98] cursor-pointer' : ''
              }`}
            >
              <div className="font-semibold mb-2">{label}</div>
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {placed.map((p, i) => (
                  <span
                    key={i}
                    className={`text-sm px-2 py-1 rounded-lg ${
                      showResults
                        ? p.correct
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400 line-through'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {p.word}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {showResults && (
        <button
          onClick={handleNextRound}
          className="w-full mt-6 bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          შემდეგი რაუნდი →
        </button>
      )}
    </div>
  );
}
