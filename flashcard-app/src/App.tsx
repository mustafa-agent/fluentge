import { useState, useEffect } from 'react';
import DeckSelect from './components/DeckSelect';
import StudyScreen from './components/StudyScreen';
import QuizScreen from './components/QuizScreen';
import StatsBar from './components/StatsBar';
import ChallengeFriend from './components/ChallengeFriend';
import { Deck, decks } from './lib/cards';

type Screen = 'home' | 'study' | 'quiz' | 'challenge';

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    if (window.location.hash.startsWith('#challenge=')) return 'challenge';
    return 'home';
  });
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);

  useEffect(() => {
    function onHash() {
      if (window.location.hash.startsWith('#challenge=')) setScreen('challenge');
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function handleSelectDeck(deck: Deck, mode: 'study' | 'quiz' = 'study') {
    setActiveDeck(deck);
    setScreen(mode);
  }

  function handleBack() {
    setScreen('home');
    setActiveDeck(null);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Header */}
      <header className="px-4 py-4 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-6">
          <h1 className="text-xl font-bold flex-shrink-0">
            <span className="text-[var(--color-primary)]">Fluent</span>Ge
            <span className="text-sm ml-2">📝</span>
          </h1>
          {screen === 'home' && (
            <a href="/" className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">
              მთავარი
            </a>
          )}
        </div>
      </header>

      {screen === 'home' && (
        <>
          <StatsBar />

          {/* Challenge Friend Banner */}
          <div className="px-4 pt-4 max-w-lg mx-auto">
            <button
              onClick={() => setScreen('challenge')}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600/30 to-orange-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚔️</span>
                <div>
                  <div className="font-bold text-lg">გამოუწვიე მეგობარი!</div>
                  <div className="text-sm text-[var(--color-text-muted)]">ინგლისურის ქვიზი — ვინ იცის უკეთ? 🔥</div>
                </div>
                <span className="ml-auto text-[var(--color-text-muted)] group-hover:text-white transition-colors">→</span>
              </div>
            </button>
          </div>

          {/* Flashcard Decks */}
          <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">📝 ფლეშქარდები</h3>
          </div>
          <DeckSelect onSelect={handleSelectDeck} />
        </>
      )}

      {screen === 'study' && activeDeck && <StudyScreen deck={activeDeck} onBack={handleBack} />}
      {screen === 'quiz' && activeDeck && <QuizScreen deck={activeDeck} allCards={decks.flatMap(d => d.cards)} onBack={handleBack} />}
      {screen === 'challenge' && <ChallengeFriend onBack={handleBack} />}
    </div>
  );
}
