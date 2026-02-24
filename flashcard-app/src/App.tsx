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
import DailyChallenge from './components/DailyChallenge';
import WordConnections from './components/WordConnections';
import WordLadder from './components/WordLadder';
import SpellingBee from './components/SpellingBee';
import WordleGame from './components/WordleGame';
import SynonymAntonym from './components/SynonymAntonym';
import Dictation from './components/Dictation';
import Proverbs from './components/Proverbs';
import TimePractice from './components/TimePractice';
import NumberWriting from './components/NumberWriting';
import ConfusingWords from './components/ConfusingWords';
import AlphabetSounds from './components/AlphabetSounds';
import SentenceCorrection from './components/SentenceCorrection';
import Phrasebook from './components/Phrasebook';
import { Deck, decks } from './lib/cards';

type Screen = 'home' | 'study' | 'quiz' | 'spelling' | 'sentences' | 'match' | 'speed' | 'scramble' | 'fillblank' | 'achievements' | 'progress' | 'reverse' | 'conversation' | 'reading' | 'grammar' | 'hangman' | 'listening' | 'categories' | 'twisters' | 'idioms' | 'crossword' | 'snake' | 'storybuilder' | 'truefalse' | 'pronunciation' | 'songlyrics' | 'bingo' | 'emojiquiz' | 'wordpairs' | 'irregularverbs' | 'picturedescribe' | 'phrasalverbs' | 'commonmistakes' | 'moviequotes' | 'travelphrases' | 'dailychallenge' | 'connections' | 'wordladder' | 'spellingbee' | 'wordle' | 'synonymantonym' | 'dictation' | 'proverbs' | 'timepractice' | 'numberwriting' | 'confusingwords' | 'alphabetsounds' | 'sentencecorrection' | 'phrasebook';
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
          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1400&q=80" alt="" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/80 to-[var(--color-bg)]"></div>
            </div>
            <div className="relative text-center pt-20 pb-16 sm:pt-24 sm:pb-20 px-4">
              <h2 style={{fontFamily: "'Playfair Display', serif"}} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">ფლეშქარდები</h2>
              <p className="text-base sm:text-lg text-[#A0A09A]">ისწავლე ახალი სიტყვები ყოველდღე</p>
            </div>
          </div>
          <StatsBar />
          <DailyWord />

          {/* Flashcard Decks */}
          <div className="px-4 pt-6 pb-2 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">📝 ფლეშქარდები</h3>
          </div>
          <DeckSelect onSelect={handleSelectDeck} />
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
      {screen === 'dailychallenge' && <DailyChallenge onBack={handleBack} />}
      {screen === 'connections' && <WordConnections onBack={handleBack} />}
      {screen === 'wordladder' && <WordLadder onBack={handleBack} />}
      {screen === 'spellingbee' && <SpellingBee onBack={handleBack} />}
      {screen === 'wordle' && <WordleGame onBack={handleBack} />}
      {screen === 'synonymantonym' && <SynonymAntonym onBack={handleBack} />}
      {screen === 'dictation' && <Dictation onBack={handleBack} />}
      {screen === 'proverbs' && <Proverbs onBack={handleBack} />}
      {screen === 'timepractice' && <TimePractice onBack={handleBack} />}
      {screen === 'numberwriting' && <NumberWriting onBack={handleBack} />}
      {screen === 'confusingwords' && <ConfusingWords onBack={handleBack} />}
      {screen === 'alphabetsounds' && <AlphabetSounds onBack={handleBack} />}
      {screen === 'sentencecorrection' && <SentenceCorrection onBack={handleBack} />}
      {screen === 'phrasebook' && <Phrasebook onBack={handleBack} />}
    </div>
  );
}
