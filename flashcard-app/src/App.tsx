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
              <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1E]/80 to-[#1C1C1E]"></div>
            </div>
            <div className="relative text-center pt-20 pb-16 sm:pt-24 sm:pb-20 px-4">
              <h2 style={{fontFamily: "'Playfair Display', serif"}} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">ფლეშქარდები</h2>
              <p className="text-base sm:text-lg text-[#A0A09A]">ისწავლე ახალი სიტყვები ყოველდღე</p>
            </div>
          </div>
          <StatsBar />
          <DailyWord />

          {/* Phrasebook - Featured */}
          <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
            <button onClick={() => setScreen('phrasebook')} className="w-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-5 text-left hover:border-emerald-500/50 transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📖</div>
                <div className="flex-1">
                  <div className="font-bold text-lg">ფრაზარიუმი</div>
                  <div className="text-sm text-[var(--color-text-muted)]">1,700+ ფრაზა აუდიოთი</div>
                  <div className="text-xs text-emerald-400 mt-1">40 კატეგორია • A1→C1 • 🔊 აუდიო</div>
                </div>
                <div className="text-2xl">→</div>
              </div>
            </button>
          </div>

          {/* Featured: Daily Games */}
          <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">🎯 ყოველდღიური</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setScreen('dailychallenge')} className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 rounded-2xl p-4 text-left hover:border-amber-500/40 transition-colors">
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-bold text-sm">დღის გამოწვევა</div>
                <div className="text-xs text-[var(--color-text-muted)]">Daily Challenge</div>
              </button>
              <button onClick={() => setScreen('wordle')} className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/20 rounded-2xl p-4 text-left hover:border-emerald-500/40 transition-colors">
                <div className="text-2xl mb-1">🟩</div>
                <div className="font-bold text-sm">Wordle</div>
                <div className="text-xs text-[var(--color-text-muted)]">გამოიცანი სიტყვა</div>
              </button>
            </div>
          </div>

          {/* Word Games */}
          <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">🎮 სიტყვების თამაშები</h3>
            <div className="grid grid-cols-3 gap-2">
              {([
                { s: 'connections', icon: '🔗', ka: 'კავშირები', en: 'Connections' },
                { s: 'wordladder', icon: '🪜', ka: 'კიბე', en: 'Word Ladder' },
                { s: 'spellingbee', icon: '🐝', ka: 'სპელინგ ბი', en: 'Spelling Bee' },
                { s: 'hangman', icon: '🎯', ka: 'ჩამოკიდებული', en: 'Hangman' },
                { s: 'crossword', icon: '🧩', ka: 'კროსვორდი', en: 'Crossword' },
                { s: 'snake', icon: '🐍', ka: 'გველი', en: 'Word Snake' },
                { s: 'bingo', icon: '🎲', ka: 'ბინგო', en: 'Word Bingo' },
                { s: 'emojiquiz', icon: '😀', ka: 'ემოჯი ქვიზი', en: 'Emoji Quiz' },
                { s: 'storybuilder', icon: '📝', ka: 'ამბავი', en: 'Story Builder' },
              ] as const).map(item => (
                <button key={item.s} onClick={() => setScreen(item.s as Screen)} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors border border-white/5 hover:border-white/10">
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <span className="text-[11px] font-medium block leading-tight">{item.ka}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Learning & Practice */}
          <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">📚 სწავლა და პრაქტიკა</h3>
            <div className="grid grid-cols-3 gap-2">
              {([
                { s: 'grammar', icon: '🏋️', ka: 'გრამატიკა', en: 'Grammar' },
                { s: 'conversation', icon: '💬', ka: 'საუბარი', en: 'Conversation' },
                { s: 'reading', icon: '📖', ka: 'კითხვა', en: 'Reading' },
                { s: 'listening', icon: '🎧', ka: 'მოსმენა', en: 'Listening' },
                { s: 'dictation', icon: '🎤', ka: 'დიქტანტი', en: 'Dictation' },
                { s: 'pronunciation', icon: '🔊', ka: 'გამოთქმა', en: 'Pronunciation' },
                { s: 'fillblank', icon: '📝', ka: 'შეავსე', en: 'Fill Blank' },
                { s: 'truefalse', icon: '✅', ka: 'მართალი?', en: 'True or False' },
                { s: 'timepractice', icon: '🕐', ka: 'საათი', en: 'Time' },
                { s: 'numberwriting', icon: '🔢', ka: 'რიცხვები', en: 'Numbers' },
                { s: 'categories', icon: '🗂️', ka: 'კატეგორიები', en: 'Categories' },
                { s: 'alphabetsounds', icon: '🔤', ka: 'ანბანი', en: 'Alphabet' },
                { s: 'sentencecorrection', icon: '✏️', ka: 'წინადადების გასწორება', en: 'Fix Sentences' },
              ] as const).map(item => (
                <button key={item.s} onClick={() => setScreen(item.s as Screen)} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors border border-white/5 hover:border-white/10">
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <span className="text-[11px] font-medium block leading-tight">{item.ka}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vocabulary */}
          <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">📖 ლექსიკა</h3>
            <div className="grid grid-cols-3 gap-2">
              {([
                { s: 'irregularverbs', icon: '🔀', ka: 'ზმნები', en: 'Irregular Verbs' },
                { s: 'phrasalverbs', icon: '🔗', ka: 'ფრაზები', en: 'Phrasal Verbs' },
                { s: 'idioms', icon: '🗣️', ka: 'იდიომები', en: 'Idioms' },
                { s: 'synonymantonym', icon: '🔄', ka: 'სინონიმები', en: 'Synonyms' },
                { s: 'commonmistakes', icon: '⚠️', ka: 'შეცდომები', en: 'Common Mistakes' },
                { s: 'wordpairs', icon: '🔗', ka: 'წყვილები', en: 'Word Pairs' },
                { s: 'proverbs', icon: '📜', ka: 'ანდაზები', en: 'Proverbs' },
                { s: 'twisters', icon: '👅', ka: 'სკოროგოვორკა', en: 'Tongue Twisters' },
                { s: 'travelphrases', icon: '🗺️', ka: 'მოგზაურობა', en: 'Travel Phrases' },
                { s: 'confusingwords', icon: '🔀', ka: 'მსგავსი', en: 'Confusing Words' },
              ] as const).map(item => (
                <button key={item.s} onClick={() => setScreen(item.s as Screen)} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors border border-white/5 hover:border-white/10">
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <span className="text-[11px] font-medium block leading-tight">{item.ka}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fun & Culture */}
          <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">🎬 გართობა</h3>
            <div className="grid grid-cols-3 gap-2">
              {([
                { s: 'moviequotes', icon: '🎬', ka: 'ფილმები', en: 'Movie Quotes' },
                { s: 'songlyrics', icon: '🎵', ka: 'სიმღერები', en: 'Song Lyrics' },
                { s: 'picturedescribe', icon: '🖼️', ka: 'აღწერა', en: 'Describe' },
              ] as const).map(item => (
                <button key={item.s} onClick={() => setScreen(item.s as Screen)} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors border border-white/5 hover:border-white/10">
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <span className="text-[11px] font-medium block leading-tight">{item.ka}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setScreen('achievements')} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-4 text-center transition-colors border border-white/5 hover:border-white/10">
                <span className="text-2xl block mb-1">🏆</span>
                <span className="text-sm font-medium">მიღწევები</span>
              </button>
              <button onClick={() => setScreen('progress')} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-4 text-center transition-colors border border-white/5 hover:border-white/10">
                <span className="text-2xl block mb-1">📊</span>
                <span className="text-sm font-medium">პროგრესი</span>
              </button>
            </div>
          </div>

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
