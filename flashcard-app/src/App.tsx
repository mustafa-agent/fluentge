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
import SongLyrics from './components/SongLyrics';
import WordBingo from './components/WordBingo';
import EmojiQuiz from './components/EmojiQuiz';
import WordPairs from './components/WordPairs';
import IrregularVerbs from './components/IrregularVerbs';
import PictureDescribe from './components/PictureDescribe';
import PhrasalVerbs from './components/PhrasalVerbs';
import CommonMistakes from './components/CommonMistakes';
import MovieQuotes from './components/MovieQuotes';
import TravelPhrases from './components/TravelPhrases';
import { Deck, decks } from './lib/cards';

type Screen = 'home' | 'study' | 'quiz' | 'spelling' | 'sentences' | 'match' | 'speed' | 'scramble' | 'fillblank' | 'achievements' | 'progress' | 'reverse' | 'conversation' | 'reading' | 'grammar' | 'hangman' | 'listening' | 'categories' | 'twisters' | 'idioms' | 'crossword' | 'snake' | 'storybuilder' | 'truefalse' | 'pronunciation' | 'songlyrics' | 'bingo' | 'emojiquiz' | 'wordpairs' | 'irregularverbs' | 'picturedescribe' | 'phrasalverbs' | 'commonmistakes' | 'moviequotes' | 'travelphrases';
type Tab = 'flashcards' | 'games';

const allCards = decks.flatMap(d => d.cards);

const gameButtons: { screen: Screen; emoji: string; label: string }[] = [
  { screen: 'fillblank', emoji: '📝', label: 'შეავსე გამოტოვებული' },
  { screen: 'conversation', emoji: '💬', label: 'საუბარი' },
  { screen: 'reading', emoji: '📖', label: 'კითხვა' },
  { screen: 'grammar', emoji: '🏋️', label: 'გრამატიკა' },
  { screen: 'hangman', emoji: '🎯', label: 'ჰენგმენი' },
  { screen: 'listening', emoji: '🎧', label: 'მოსმენა' },
  { screen: 'achievements', emoji: '🏆', label: 'მიღწევები' },
  { screen: 'progress', emoji: '📊', label: 'პროგრესი' },
  { screen: 'categories', emoji: '🗂️', label: 'კატეგორიები' },
  { screen: 'twisters', emoji: '👅', label: 'ენის გასატეხი' },
  { screen: 'idioms', emoji: '🗣️', label: 'იდიომები' },
  { screen: 'crossword', emoji: '🧩', label: 'კროსვორდი' },
  { screen: 'snake', emoji: '🐍', label: 'სიტყვის გველი' },
  { screen: 'storybuilder', emoji: '📝', label: 'ამბის შემქმნელი' },
  { screen: 'truefalse', emoji: '✅', label: 'სიმართლე/ტყუილი' },
  { screen: 'pronunciation', emoji: '🔊', label: 'წარმოთქმა' },
  { screen: 'songlyrics', emoji: '🎵', label: 'სიმღერები' },
  { screen: 'bingo', emoji: '🎲', label: 'ბინგო' },
  { screen: 'emojiquiz', emoji: '🎭', label: 'ემოჯი ქვიზი' },
  { screen: 'wordpairs', emoji: '🔗', label: 'წყვილები' },
  { screen: 'irregularverbs', emoji: '🔀', label: 'არაწესიერი ზმნები' },
  { screen: 'picturedescribe', emoji: '🖼️', label: 'სურათის აღწერა' },
  { screen: 'phrasalverbs', emoji: '🔗', label: 'ფრაზული ზმნები' },
  { screen: 'commonmistakes', emoji: '⚠️', label: 'ხშირი შეცდომები' },
  { screen: 'moviequotes', emoji: '🎬', label: 'ფილმის ციტატები' },
  { screen: 'travelphrases', emoji: '🗺️', label: 'მოგზაურობა' },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('flashcards');

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

          {/* Tab switcher */}
          <div className="px-4 pt-3 max-w-lg mx-auto">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'flashcards' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)]'}`}
              >
                🃏 ფლეშქარდები
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'games' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)]'}`}
              >
                🎮 თამაშები
              </button>
            </div>
          </div>

          {activeTab === 'flashcards' && (
            <DeckSelect onSelect={handleSelectDeck} />
          )}

          {activeTab === 'games' && (
            <div className="px-4 pb-4 max-w-lg mx-auto">
              {Array.from({ length: Math.ceil(gameButtons.length / 4) }, (_, rowIdx) => (
                <div key={rowIdx} className={`grid grid-cols-4 gap-3 ${rowIdx > 0 ? 'mt-3' : ''}`}>
                  {gameButtons.slice(rowIdx * 4, rowIdx * 4 + 4).map((btn) => (
                    <button
                      key={btn.screen}
                      onClick={() => setScreen(btn.screen)}
                      className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
                    >
                      <div className="text-2xl mb-1">{btn.emoji}</div>
                      <div className="text-xs">{btn.label}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {screen === 'study' && activeDeck && <StudyScreen deck={activeDeck} onBack={handleBack} />}
      {screen === 'quiz' && activeDeck && <QuizScreen deck={activeDeck} allCards={allCards} onBack={handleBack} />}
      {screen === 'spelling' && activeDeck && <SpellingScreen deck={activeDeck} onBack={handleBack} />}
      {screen === 'sentences' && activeDeck && <SentenceBuilder deck={activeDeck} onBack={handleBack} />}
      {screen === 'match' && activeDeck && <MatchGame deck={activeDeck} onBack={handleBack} />}
      {screen === 'speed' && activeDeck && <SpeedRound deck={activeDeck} onBack={handleBack} />}
      {screen === 'scramble' && activeDeck && <WordScramble deck={activeDeck} onBack={handleBack} />}
      {screen === 'fillblank' && <FillBlank allCards={allCards} onBack={handleBack} />}
      {screen === 'achievements' && <Achievements onBack={handleBack} />}
      {screen === 'progress' && <ProgressDashboard onBack={handleBack} />}
      {screen === 'reverse' && activeDeck && <ReverseMode deck={activeDeck} onBack={handleBack} />}
      {screen === 'conversation' && <ConversationPractice onBack={handleBack} />}
      {screen === 'reading' && <ReadingComprehension onBack={handleBack} />}
      {screen === 'grammar' && <GrammarExercises onBack={handleBack} />}
      {screen === 'hangman' && <HangmanGame onBack={handleBack} />}
      {screen === 'listening' && <ListeningPractice onBack={handleBack} />}
      {screen === 'categories' && <WordCategories onBack={handleBack} />}
      {screen === 'twisters' && <TongueTwisters onBack={handleBack} />}
      {screen === 'idioms' && <IdiomsPhrases onBack={handleBack} />}
      {screen === 'crossword' && <MiniCrossword onBack={handleBack} />}
      {screen === 'snake' && <WordSnake onBack={handleBack} />}
      {screen === 'storybuilder' && <StoryBuilder onBack={handleBack} />}
      {screen === 'truefalse' && <TrueOrFalse onBack={handleBack} />}
      {screen === 'pronunciation' && <PronunciationGuide onBack={handleBack} />}
      {screen === 'songlyrics' && <SongLyrics onBack={handleBack} />}
      {screen === 'bingo' && <WordBingo onBack={handleBack} />}
      {screen === 'emojiquiz' && <EmojiQuiz onBack={handleBack} />}
      {screen === 'wordpairs' && <WordPairs onBack={handleBack} />}
      {screen === 'irregularverbs' && <IrregularVerbs onBack={handleBack} />}
      {screen === 'picturedescribe' && <PictureDescribe onBack={handleBack} />}
      {screen === 'phrasalverbs' && <PhrasalVerbs onBack={handleBack} />}
      {screen === 'commonmistakes' && <CommonMistakes onBack={handleBack} />}
      {screen === 'moviequotes' && <MovieQuotes onBack={handleBack} />}
      {screen === 'travelphrases' && <TravelPhrases onBack={handleBack} />}
    </div>
  );
}
