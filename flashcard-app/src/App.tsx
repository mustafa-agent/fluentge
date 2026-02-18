import { useState } from 'react';
import DeckSelect from './components/DeckSelect';
import StudyScreen from './components/StudyScreen';
import QuizScreen from './components/QuizScreen';
import StatsBar from './components/StatsBar';
import { Deck, decks } from './lib/cards';

type Screen = 'home' | 'study' | 'quiz';

// Gather all cards for quiz wrong-answer pool
const allCards = decks.flatMap(d => d.cards);

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);

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
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">
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
          <DeckSelect onSelect={handleSelectDeck} />
        </>
      )}

      {screen === 'study' && activeDeck && (
        <StudyScreen deck={activeDeck} onBack={handleBack} />
      )}

      {screen === 'quiz' && activeDeck && (
        <QuizScreen deck={activeDeck} allCards={allCards} onBack={handleBack} />
      )}
    </div>
  );
}
