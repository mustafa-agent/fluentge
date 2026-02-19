import { useState } from 'react';
import DeckSelect from './components/DeckSelect';
import StudyScreen from './components/StudyScreen';
import QuizScreen from './components/QuizScreen';
import SpellingScreen from './components/SpellingScreen';
import SentenceBuilder from './components/SentenceBuilder';
import MatchGame from './components/MatchGame';
import SpeedRound from './components/SpeedRound';
import WordScramble from './components/WordScramble';
import StatsBar from './components/StatsBar';
import DailyWord from './components/DailyWord';
import FillBlank from './components/FillBlank';
import Achievements from './components/Achievements';
import ProgressDashboard from './components/ProgressDashboard';
import ReverseMode from './components/ReverseMode';
import ConversationPractice from './components/ConversationPractice';
import ReadingComprehension from './components/ReadingComprehension';
import GrammarExercises from './components/GrammarExercises';
import HangmanGame from './components/HangmanGame';
import ListeningPractice from './components/ListeningPractice';
import WordCategories from './components/WordCategories';
import TongueTwisters from './components/TongueTwisters';
import IdiomsPhrases from './components/IdiomsPhrases';
import MiniCrossword from './components/MiniCrossword';
import WordSnake from './components/WordSnake';
import StoryBuilder from './components/StoryBuilder';
import TrueOrFalse from './components/TrueOrFalse';
import PronunciationGuide from './components/PronunciationGuide';
import { Deck, decks } from './lib/cards';

type Screen = 'home' | 'study' | 'quiz' | 'spelling' | 'sentences' | 'match' | 'speed' | 'scramble' | 'fillblank' | 'achievements' | 'progress' | 'reverse' | 'conversation' | 'reading' | 'grammar' | 'hangman' | 'listening' | 'categories' | 'twisters' | 'idioms' | 'crossword' | 'snake' | 'storybuilder' | 'truefalse' | 'pronunciation';

// Gather all cards for quiz wrong-answer pool
const allCards = decks.flatMap(d => d.cards);

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);

  function handleSelectDeck(deck: Deck, mode: 'study' | 'quiz' | 'spelling' | 'sentences' | 'match' | 'speed' | 'scramble' | 'reverse' = 'study') {
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
          <DailyWord />
          {/* Quick access buttons */}
          <div className="px-4 py-3 max-w-lg mx-auto">
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setScreen('fillblank')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">📝</div>
                <div className="text-xs">შეავსე გამოტოვებული</div>
              </button>
              <button
                onClick={() => setScreen('conversation')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">💬</div>
                <div className="text-xs">საუბარი</div>
              </button>
              <button
                onClick={() => setScreen('reading')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">📖</div>
                <div className="text-xs">კითხვა</div>
              </button>
              <button
                onClick={() => setScreen('grammar')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">🏋️</div>
                <div className="text-xs">გრამატიკა</div>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              <button
                onClick={() => setScreen('hangman')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-xs">ჰენგმენი</div>
              </button>
              <button
                onClick={() => setScreen('listening')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">🎧</div>
                <div className="text-xs">მოსმენა</div>
              </button>
              <button
                onClick={() => setScreen('achievements')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xs">მიღწევები</div>
              </button>
              <button
                onClick={() => setScreen('progress')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">📊</div>
                <div className="text-xs">პროგრესი</div>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              <button
                onClick={() => setScreen('categories')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">🗂️</div>
                <div className="text-xs">კატეგორიები</div>
              </button>
              <button
                onClick={() => setScreen('twisters')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">👅</div>
                <div className="text-xs">ენის გასატეხი</div>
              </button>
              <button
                onClick={() => setScreen('idioms')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">🗣️</div>
                <div className="text-xs">იდიომები</div>
              </button>
              <button
                onClick={() => setScreen('crossword')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">🧩</div>
                <div className="text-xs">კროსვორდი</div>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              <button
                onClick={() => setScreen('snake')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">🐍</div>
                <div className="text-xs">სიტყვის გველი</div>
              </button>
              <button
                onClick={() => setScreen('storybuilder')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">📝</div>
                <div className="text-xs">ამბის შემქმნელი</div>
              </button>
              <button
                onClick={() => setScreen('truefalse')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">✅</div>
                <div className="text-xs">სიმართლე/ტყუილი</div>
              </button>
              <button
                onClick={() => setScreen('pronunciation')}
                className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
              >
                <div className="text-2xl mb-1">🔊</div>
                <div className="text-xs">წარმოთქმა</div>
              </button>
            </div>
          </div>
          <DeckSelect onSelect={handleSelectDeck} />
        </>
      )}

      {screen === 'study' && activeDeck && (
        <StudyScreen deck={activeDeck} onBack={handleBack} />
      )}

      {screen === 'quiz' && activeDeck && (
        <QuizScreen deck={activeDeck} allCards={allCards} onBack={handleBack} />
      )}

      {screen === 'spelling' && activeDeck && (
        <SpellingScreen deck={activeDeck} onBack={handleBack} />
      )}

      {screen === 'sentences' && activeDeck && (
        <SentenceBuilder deck={activeDeck} onBack={handleBack} />
      )}

      {screen === 'match' && activeDeck && (
        <MatchGame deck={activeDeck} onBack={handleBack} />
      )}

      {screen === 'speed' && activeDeck && (
        <SpeedRound deck={activeDeck} onBack={handleBack} />
      )}

      {screen === 'scramble' && activeDeck && (
        <WordScramble deck={activeDeck} onBack={handleBack} />
      )}

      {screen === 'fillblank' && (
        <FillBlank allCards={allCards} onBack={handleBack} />
      )}

      {screen === 'achievements' && (
        <Achievements onBack={handleBack} />
      )}

      {screen === 'progress' && (
        <ProgressDashboard onBack={handleBack} />
      )}

      {screen === 'reverse' && activeDeck && (
        <ReverseMode deck={activeDeck} onBack={handleBack} />
      )}

      {screen === 'conversation' && (
        <ConversationPractice onBack={handleBack} />
      )}

      {screen === 'reading' && (
        <ReadingComprehension onBack={handleBack} />
      )}

      {screen === 'grammar' && (
        <GrammarExercises onBack={handleBack} />
      )}

      {screen === 'hangman' && (
        <HangmanGame onBack={handleBack} />
      )}

      {screen === 'listening' && (
        <ListeningPractice onBack={handleBack} />
      )}

      {screen === 'categories' && (
        <WordCategories onBack={handleBack} />
      )}

      {screen === 'twisters' && (
        <TongueTwisters onBack={handleBack} />
      )}

      {screen === 'idioms' && (
        <IdiomsPhrases onBack={handleBack} />
      )}

      {screen === 'crossword' && (
        <MiniCrossword onBack={handleBack} />
      )}

      {screen === 'snake' && (
        <WordSnake onBack={handleBack} />
      )}

      {screen === 'storybuilder' && (
        <StoryBuilder onBack={handleBack} />
      )}

      {screen === 'truefalse' && (
        <TrueOrFalse onBack={handleBack} />
      )}

      {screen === 'pronunciation' && (
        <PronunciationGuide onBack={handleBack} />
      )}
    </div>
  );
}
