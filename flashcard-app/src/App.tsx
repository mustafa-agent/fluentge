import { useState, useEffect, lazy, Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import DeckSelect from './components/DeckSelect';
import StatsBar from './components/StatsBar';
import OnboardingModal from './components/OnboardingModal';
import { type Deck, loadDeck, loadAllCards } from './lib/deck-loader';
import { deckIndex } from './lib/deck-index';
import { loadFromCloud, syncToCloud, syncNow } from './lib/firebase-sync';

// Error Boundary to catch lazy-load failures and runtime crashes
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FluentGe ErrorBoundary:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-text, #fff)' }}>
            რაღაც შეცდომა მოხდა
          </h2>
          <p style={{ color: 'var(--color-text-muted, #999)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            გვერდი ვერ ჩაიტვირთა. სცადე თავიდან.
          </p>
          <button
            onClick={() => {
              // Clear SW caches and reload
              if (typeof caches !== 'undefined') {
                caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).finally(() => location.reload());
              } else {
                location.reload();
              }
            }}
            style={{ padding: '0.75rem 2rem', borderRadius: '1rem', background: '#5B7F5E', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            🔄 თავიდან ცდა
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy-loaded heavy components
const StudyScreen = lazy(() => import('./components/StudyScreen'));
const SRSStudy = lazy(() => import('./components/SRSStudy'));
const QuizScreen = lazy(() => import('./components/QuizScreen'));
const TypingScreen = lazy(() => import('./components/TypingScreen'));
const DifficultWordsScreen = lazy(() => import('./components/DifficultWordsScreen'));
const WordSearch = lazy(() => import('./components/WordSearch'));
const ChallengeFriend = lazy(() => import('./components/ChallengeFriend'));
const SpacedRepetition = lazy(() => import('./components/SpacedRepetition'));
const SentenceBuilder = lazy(() => import('./components/SentenceBuilder'));
const ListeningExercise = lazy(() => import('./components/ListeningExercise'));
const FillBlankExercise = lazy(() => import('./components/FillBlankExercise'));
const ReadingComprehension = lazy(() => import('./components/ReadingComprehension'));
const DailyLesson = lazy(() => import('./components/DailyLesson'));
const UnitQuiz = lazy(() => import('./components/UnitQuiz'));
import LoadingSkeleton from './components/LoadingSkeleton';

type Screen = 'home' | 'study' | 'quiz' | 'typing' | 'sentence' | 'listening' | 'fillin' | 'reading' | 'challenge' | 'srs-dashboard' | 'difficult' | 'daily-lesson' | 'unit-quiz';
type StudyMode = 'classic' | 'srs' | 'reverse' | 'mixed';

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#challenge=')) return 'challenge';
    if (hash.startsWith('#unit-quiz/')) return 'unit-quiz';
    return 'home';
  });
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>('classic');
  const [showSearch, setShowSearch] = useState(false);
  const [quizAllCards, setQuizAllCards] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('fluentge-onboarded'));
  const [unitQuizId, setUnitQuizId] = useState<number>(1);

  // Deep-link: auto-open a deck from ?deck= query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const deckParam = params.get('deck');
    if (deckParam) {
      // Match by deck ID first, then by source file name
      const meta = deckIndex.find(d => d.id === deckParam) || deckIndex.find(d => d.sources.includes(deckParam));
      if (meta) {
        loadDeck(meta.id).then(deck => {
          if (deck) {
            setActiveDeck(deck);
            setStudyMode('classic');
            setScreen('study');
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    loadFromCloud().catch(() => {});
    const syncIv = setInterval(() => syncToCloud().catch(() => {}), 30000);
    const onBeforeUnload = () => syncToCloud().catch(() => {});
    window.addEventListener('beforeunload', onBeforeUnload);

    // Sync on visibility change (catches mobile tab switch / browser close)
    const onVisChange = () => {
      if (document.visibilityState === 'hidden') syncToCloud().catch(() => {});
      if (document.visibilityState === 'visible') loadFromCloud().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisChange);

    // Watch for login: when fluentge-user changes in storage, reload from cloud
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'fluentge-user' && e.newValue) loadFromCloud().catch(() => {});
    };
    window.addEventListener('storage', onStorage);

    // Also poll for login (same-tab storage changes don't fire StorageEvent)
    let lastUid = (() => { try { return JSON.parse(localStorage.getItem('fluentge-user') || 'null')?.uid; } catch { return null; } })();
    const loginPoll = setInterval(() => {
      try {
        const uid = JSON.parse(localStorage.getItem('fluentge-user') || 'null')?.uid;
        if (uid && uid !== lastUid) {
          lastUid = uid;
          loadFromCloud().catch(() => {});
        }
      } catch {}
    }, 2000);

    return () => {
      clearInterval(syncIv);
      clearInterval(loginPoll);
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('visibilitychange', onVisChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Parse unit-quiz ID from hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#unit-quiz/')) {
      const id = parseInt(hash.split('/')[1]) || 1;
      setUnitQuizId(id);
    }
  }, []);

  useEffect(() => {
    function onHash() {
      const hash = window.location.hash;
      if (hash.startsWith('#challenge=')) setScreen('challenge');
      if (hash.startsWith('#unit-quiz/')) {
        const id = parseInt(hash.split('/')[1]) || 1;
        setUnitQuizId(id);
        setScreen('unit-quiz');
      }
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

  function handleSelectDeck(deck: Deck, mode: 'study' | 'quiz' | 'typing' | 'srs' | 'reverse' | 'mixed' | 'sentence' | 'listening' | 'fillin' | 'reading' | 'daily' = 'study') {
    setActiveDeck(deck);
    if (mode === 'daily') {
      setScreen('daily-lesson');
      return;
    } else if (mode === 'quiz') {
      setScreen('quiz');
    } else if (mode === 'typing') {
      setScreen('typing');
    } else if (mode === 'sentence') {
      setScreen('sentence');
    } else if (mode === 'listening') {
      setScreen('listening');
    } else if (mode === 'fillin') {
      setScreen('fillin');
    } else if (mode === 'reading') {
      setScreen('reading');
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
    syncNow(); // Sync progress when leaving a study session
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

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] has-bottom-nav">
      {/* Onboarding Modal for new users */}
      {showOnboarding && <OnboardingModal onComplete={(path) => {
        setShowOnboarding(false);
        if (path === 'grammar') {
          window.location.href = '/grammar/';
        } else if (path === 'games') {
          window.location.href = '/games/';
        } else if (path === 'words') {
          // Auto-select Top 2000 deck
          const top2000Meta = deckIndex.find(d => d.id === 'top-2000');
          if (top2000Meta) {
            loadDeck(top2000Meta.id).then(deck => {
              if (deck) {
                setActiveDeck(deck);
                setStudyMode('srs');
                setScreen('study');
              }
            });
          }
        }
      }} />}
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
          <ErrorBoundary><StatsBar /></ErrorBoundary>

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
          <ErrorBoundary><DeckSelect onSelect={handleSelectDeck} /></ErrorBoundary>
        </>
      )}

      <ErrorBoundary><Suspense fallback={<LoadingSkeleton />}>
        <div key={screen + (activeDeck?.id || '')} className="screen-enter">
        {screen === 'study' && activeDeck && (
          studyMode === 'srs'
            ? <SRSStudy cards={activeDeck.cards} deckId={activeDeck.id} onBack={handleBack} />
            : <StudyScreen key={activeDeck.id + '-' + studyMode} deck={activeDeck} direction={studyMode === 'reverse' ? 'ka-en' : studyMode === 'mixed' ? 'mixed' : 'en-ka'} onBack={handleBack} />
        )}
        {screen === 'quiz' && activeDeck && <QuizScreen deck={activeDeck} allCards={quizAllCards.length > 0 ? quizAllCards : activeDeck.cards} onBack={handleBack} />}
        {screen === 'typing' && activeDeck && <TypingScreen deck={activeDeck} onBack={handleBack} />}
        {screen === 'daily-lesson' && <DailyLesson onBack={handleBack} />}
        {screen === 'unit-quiz' && <UnitQuiz unitId={unitQuizId} onBack={handleBack} />}
        {screen === 'sentence' && activeDeck && <SentenceBuilder deck={activeDeck} onBack={handleBack} />}
        {screen === 'listening' && activeDeck && <ListeningExercise deck={activeDeck} onBack={handleBack} />}
        {screen === 'fillin' && activeDeck && <FillBlankExercise deck={activeDeck} onBack={handleBack} />}
        {screen === 'reading' && activeDeck && <ReadingComprehension deck={activeDeck} onBack={handleBack} />}
        {screen === 'challenge' && <ChallengeFriend onBack={handleBack} />}
        {screen === 'difficult' && <DifficultWordsScreen onBack={handleBack} />}
        {showSearch && (
          <WordSearch
            onClose={() => setShowSearch(false)}
            onSelectDeck={(deck) => { setShowSearch(false); handleSelectDeck(deck); }}
          />
        )}
        {screen === 'srs-dashboard' && <SpacedRepetition onBack={handleBack} />}
        </div>
      </Suspense></ErrorBoundary>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          <a href="/" className={currentPath === '/' ? 'active' : ''}>
            <span className="nav-icon">🏠</span>
            <span>მთავარი</span>
          </a>
          <a href="/flashcards/" className="active">
            <span className="nav-icon">📚</span>
            <span>სიტყვები</span>
          </a>
          <a href="/grammar/">
            <span className="nav-icon">📖</span>
            <span>გრამატიკა</span>
          </a>
          <a href="/games/">
            <span className="nav-icon">🎮</span>
            <span>თამაშები</span>
          </a>
          <a href="/dashboard/">
            <span className="nav-icon">👤</span>
            <span>პროფილი</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
