import { useState, useEffect, lazy, Suspense } from 'react';
import DeckSelect from './components/DeckSelect';
import StatsBar from './components/StatsBar';
import OnboardingModal from './components/OnboardingModal';
import { type Deck, loadDeck, loadAllCards } from './lib/deck-loader';
import { deckIndex } from './lib/deck-index';
import { loadFromCloud, syncToCloud } from './lib/firebase-sync';

// Lazy-loaded heavy components
const StudyScreen = lazy(() => import('./components/StudyScreen'));
const SRSStudy = lazy(() => import('./components/SRSStudy'));
const QuizScreen = lazy(() => import('./components/QuizScreen'));
const TypingScreen = lazy(() => import('./components/TypingScreen'));
const DifficultWordsScreen = lazy(() => import('./components/DifficultWordsScreen'));
const WordSearch = lazy(() => import('./components/WordSearch'));
const ChallengeFriend = lazy(() => import('./components/ChallengeFriend'));
const SpacedRepetition = lazy(() => import('./components/SpacedRepetition'));
import LoadingSkeleton from './components/LoadingSkeleton';

type Screen = 'home' | 'study' | 'quiz' | 'typing' | 'challenge' | 'srs-dashboard' | 'difficult';
type StudyMode = 'classic' | 'srs' | 'reverse' | 'mixed';

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    if (window.location.hash.startsWith('#challenge=')) return 'challenge';
    return 'home';
  });
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>('classic');
  const [showSearch, setShowSearch] = useState(false);
  const [quizAllCards, setQuizAllCards] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('fluentge-onboarded'));

  useEffect(() => {
    loadFromCloud().catch(() => {});
    const syncIv = setInterval(() => syncToCloud().catch(() => {}), 30000);
    window.addEventListener('beforeunload', () => syncToCloud().catch(() => {}));
    return () => clearInterval(syncIv);
  }, []);

  useEffect(() => {
    function onHash() {
      if (window.location.hash.startsWith('#challenge=')) setScreen('challenge');
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Preload all cards when quiz mode is entered
  useEffect(() => {
    if (screen === 'quiz' && quizAllCards.length === 0) {
      loadAllCards().then(setQuizAllCards);
    }
  }, [screen]);

  function handleSelectDeck(deck: Deck, mode: 'study' | 'quiz' | 'typing' | 'srs' | 'reverse' | 'mixed' = 'study') {
    setActiveDeck(deck);
    if (mode === 'quiz') {
      setScreen('quiz');
    } else if (mode === 'typing') {
      setScreen('typing');
    } else if (mode === 'srs') {
      setStudyMode('srs');
      setScreen('study');
    } else if (mode === 'reverse') {
      setStudyMode('reverse');
      setScreen('study');
    } else if (mode === 'mixed') {
      setStudyMode('mixed');
      setScreen('study');
    } else {
      setStudyMode('classic');
      setScreen('study');
    }
  }

  function handleBack() {
    setScreen('home');
    setActiveDeck(null);
    setStudyMode('classic');
  }

  function handleNextDeck() {
    if (!activeDeck) return;
    const idx = deckIndex.findIndex(d => d.id === activeDeck.id);
    if (idx === -1 || idx + 1 >= deckIndex.length) return;
    const nextMeta = deckIndex[idx + 1];
    loadDeck(nextMeta.id).then(deck => {
      if (deck) {
        setActiveDeck(deck);
        setScreen('study');
      }
    });
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Onboarding Modal for new users */}
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}
      {/* Header */}
      <header className="px-4 py-4 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-6">
          <h1 className="text-xl font-bold flex-shrink-0">
            <span className="text-[var(--color-primary)]">Fluent</span>Ge
            <span className="text-sm ml-2">📝</span>
          </h1>
          <div className="flex items-center gap-3">
            {screen === 'home' && (
              <button
                onClick={() => setShowSearch(true)}
                className="text-[var(--color-text-muted)] hover:text-white transition-colors text-lg"
                title="ძიება"
              >🔍</button>
            )}
            {screen === 'home' && (
              <a href="/" className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">
                მთავარი
              </a>
            )}
          </div>
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

          {/* Difficult Words Banner */}
          <div className="px-4 pt-3 max-w-lg mx-auto">
            <button
              onClick={() => setScreen('difficult')}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-red-600/30 to-amber-500/30 border border-red-500/30 hover:border-red-500/50 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">😤</span>
                <div>
                  <div className="font-bold text-lg">რთული სიტყვები</div>
                  <div className="text-sm text-[var(--color-text-muted)]">იმუშავე შენს სუსტ მხარეებზე · +20 XP</div>
                </div>
                <span className="ml-auto text-[var(--color-text-muted)] group-hover:text-white transition-colors">→</span>
              </div>
            </button>
          </div>

          {/* How it works */}
          <div className="px-4 pt-6 max-w-lg mx-auto">
            <details className="bg-[var(--color-bg-card)] border border-white/5 rounded-2xl overflow-hidden mb-4">
              <summary className="px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-3">
                <span className="text-xl">❓</span>
                <span className="font-semibold text-sm">როგორ მუშაობს ფლეშქარდები?</span>
              </summary>
              <div className="px-5 pb-5 pt-2 text-sm text-[var(--color-text-muted)] space-y-4">
                <div>
                  <h4 className="font-bold text-[var(--color-text)] mb-1">📝 კლასიკური რეჟიმი</h4>
                  <p>გადაატრიალე ბარათები და ისწავლე სიტყვები. ნახე ინგლისური სიტყვა, გადააბრუნე ქართული თარგმანისთვის.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)] mb-1">🃏 თავისუფალი ბარათები (ინტერვალური გამეორება)</h4>
                  <p>ყველაზე ეფექტური მეთოდი სიტყვების დასამახსოვრებლად! ალგორითმი ავტომატურად არეგულირებს რამდენად ხშირად ნახავ თითოეულ სიტყვას:</p>
                  <ul className="list-none space-y-1.5 mt-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 flex-shrink-0">✅ ვიცი</span>
                      <span>— სიტყვა უფრო იშვიათად გამოჩნდება (1 დღე → 3 დღე → 7 დღე...)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 flex-shrink-0">🤔 რთულია</span>
                      <span>— სიტყვა უფრო ხშირად გამოჩნდება</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">❌ არ ვიცი</span>
                      <span>— სიტყვა ხელახლა გამოჩნდება იმავე სესიაში</span>
                    </li>
                  </ul>
                  <p className="mt-2">რაც უფრო მეტს ივარჯიშებ, მით უფრო ზუსტად მოერგება შენს დონეს!</p>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)] mb-1">⚡ ქვიზი</h4>
                  <p>შეამოწმე რამდენად კარგად იცი სიტყვები. 4 პასუხიდან აირჩიე სწორი!</p>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)] mb-1">✍️ წერა</h4>
                  <p>ყველაზე რთული რეჟიმი! ნახე ქართული სიტყვა და ჩაწერე ინგლისური თარგმანი. +25 XP ყოველ სწორ პასუხზე!</p>
                </div>
              </div>
            </details>
          </div>

          {/* Flashcard Decks */}
          <div className="px-4 pb-2 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">📝 ფლეშქარდები</h3>
          </div>
          <DeckSelect onSelect={handleSelectDeck} />
        </>
      )}

      <Suspense fallback={<LoadingSkeleton />}>
        {screen === 'study' && activeDeck && (
          studyMode === 'srs'
            ? <SRSStudy cards={activeDeck.cards} deckId={activeDeck.id} onBack={handleBack} />
            : <StudyScreen key={activeDeck.id + '-' + studyMode} deck={activeDeck} direction={studyMode === 'reverse' ? 'ka-en' : studyMode === 'mixed' ? 'mixed' : 'en-ka'} onBack={handleBack} />
        )}
        {screen === 'quiz' && activeDeck && <QuizScreen deck={activeDeck} allCards={quizAllCards.length > 0 ? quizAllCards : activeDeck.cards} onBack={handleBack} />}
        {screen === 'typing' && activeDeck && <TypingScreen deck={activeDeck} onBack={handleBack} />}
        {screen === 'challenge' && <ChallengeFriend onBack={handleBack} />}
        {screen === 'difficult' && <DifficultWordsScreen onBack={handleBack} />}
        {showSearch && (
          <WordSearch
            onClose={() => setShowSearch(false)}
            onSelectDeck={(deck) => { setShowSearch(false); handleSelectDeck(deck); }}
          />
        )}
        {screen === 'srs-dashboard' && <SpacedRepetition onBack={handleBack} />}
      </Suspense>
    </div>
  );
}
