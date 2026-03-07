import { useState, useRef, useEffect, useCallback } from 'react';
import type { Deck } from '../lib/deck-loader';
import { addXP, updateStreak, addStudyTime } from '../lib/gamification';

interface Props {
  deck: Deck;
  onBack: () => void;
}

interface Round {
  english: string;
  georgian: string;
  pronunciation: string;
  audioUrl?: string;
}

type FeedbackState = 'idle' | 'listening' | 'processing' | 'result';

// Check if Web Speech API is available
const hasSpeechRecognition = typeof window !== 'undefined' && 
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export default function SpeakingPractice({ deck, onBack }: Props) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  const [userTranscript, setUserTranscript] = useState('');
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [xpEarned, setXpEarned] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const recognitionRef = useRef<any>(null);

  // Initialize rounds
  useEffect(() => {
    const shuffled = [...deck.cards]
      .filter(c => c.english && c.english.length > 2 && c.english.length < 25)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(c => ({
        english: c.english,
        georgian: c.georgian,
        pronunciation: c.pronunciation || '',
        audioUrl: `/flashcards/audio/words/${c.english.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}_en.mp3`
      }));
    setRounds(shuffled);
  }, [deck]);

  // Play reference audio
  const playReference = useCallback((word?: string) => {
    const round = rounds[currentRound];
    if (!round) return;
    
    const target = word || round.english;
    // Try audio file first, fallback to speechSynthesis
    const audio = new Audio(rounds[currentRound]?.audioUrl);
    audio.onerror = () => {
      // Fallback: use speechSynthesis
      const utter = new SpeechSynthesisUtterance(target);
      utter.lang = 'en-US';
      utter.rate = 0.85;
      speechSynthesis.speak(utter);
    };
    audio.play().catch(() => {
      const utter = new SpeechSynthesisUtterance(target);
      utter.lang = 'en-US';
      utter.rate = 0.85;
      speechSynthesis.speak(utter);
    });
  }, [rounds, currentRound]);

  // Start listening
  const startListening = useCallback(() => {
    if (!hasSpeechRecognition) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setFeedbackState('listening');
      setUserTranscript('');
    };

    recognition.onresult = (event: any) => {
      const results = event.results[0];
      let bestMatch = '';
      let bestScore = 0;
      const target = rounds[currentRound]?.english.toLowerCase() || '';

      // Check all alternatives for best match
      for (let i = 0; i < results.length; i++) {
        const transcript = results[i].transcript.toLowerCase().trim();
        const similarity = calculateSimilarity(transcript, target);
        if (similarity > bestScore) {
          bestScore = similarity;
          bestMatch = results[i].transcript;
        }
      }

      setUserTranscript(bestMatch || results[0].transcript);
      setMatchScore(bestScore);
      setFeedbackState('result');
      setTotalAttempts(prev => prev + 1);

      if (bestScore >= 0.7) {
        setScore(prev => prev + 1);
        const xp = bestScore >= 0.95 ? 15 : 10;
        addXP(xp);
        setXpEarned(prev => prev + xp);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setUserTranscript('ვერ გაიგონა... სცადე ხელახლა');
      } else if (event.error === 'not-allowed') {
        setUserTranscript('მიკროფონზე წვდომა აკრძალულია');
      } else {
        setUserTranscript('შეცდომა... სცადე ხელახლა');
      }
      setFeedbackState('result');
      setMatchScore(0);
    };

    recognition.onend = () => {
      if (feedbackState === 'listening') {
        setFeedbackState('result');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [rounds, currentRound, feedbackState]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setFeedbackState('processing');
  }, []);

  // Next round
  const nextRound = useCallback(() => {
    if (currentRound + 1 >= rounds.length) {
      // Finish
      updateStreak(true);
      const minutes = Math.round((Date.now() - startTime) / 60000);
      if (minutes > 0) addStudyTime(minutes);
      setShowResult(true);
    } else {
      setCurrentRound(prev => prev + 1);
      setFeedbackState('idle');
      setUserTranscript('');
      setMatchScore(0);
    }
  }, [currentRound, rounds.length, startTime]);

  // Try again
  const tryAgain = useCallback(() => {
    setFeedbackState('idle');
    setUserTranscript('');
    setMatchScore(0);
  }, []);

  // Skip word
  const handleSkip = useCallback(() => {
    setSkipped(prev => prev + 1);
    nextRound();
  }, [nextRound]);

  // Calculate string similarity (Levenshtein-based)
  function calculateSimilarity(a: string, b: string): number {
    a = a.toLowerCase().trim();
    b = b.toLowerCase().trim();
    if (a === b) return 1;
    
    const lenA = a.length;
    const lenB = b.length;
    if (lenA === 0 || lenB === 0) return 0;

    const matrix: number[][] = [];
    for (let i = 0; i <= lenA; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= lenB; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= lenA; i++) {
      for (let j = 1; j <= lenB; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    const distance = matrix[lenA][lenB];
    return 1 - distance / Math.max(lenA, lenB);
  }

  // Feedback color and label
  function getFeedback(score: number) {
    if (score >= 0.95) return { color: 'green', label: 'შესანიშნავი! 🎯', emoji: '🌟' };
    if (score >= 0.8) return { color: 'green', label: 'კარგია! 👍', emoji: '✅' };
    if (score >= 0.7) return { color: 'amber', label: 'ნორმალურია 👌', emoji: '🟡' };
    if (score >= 0.5) return { color: 'orange', label: 'კიდევ სცადე 💪', emoji: '🟠' };
    return { color: 'red', label: 'სცადე ხელახლა 🔄', emoji: '❌' };
  }

  if (rounds.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-[var(--color-text-muted)]">იტვირთება...</p>
      </div>
    );
  }

  // No Speech API support
  if (!hasSpeechRecognition) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">🎤</div>
        <h2 className="text-xl font-bold mb-3">გამოთქმის ვარჯიში</h2>
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-2xl p-5 mb-6">
          <p className="text-amber-300 font-medium mb-2">⚠️ შენი ბრაუზერი არ უჭერს მხარს ხმის ამოცნობას</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            გამოიყენე Chrome ან Edge ბრაუზერი მობილურზე ან კომპიუტერზე.
          </p>
        </div>
        <button onClick={onBack} className="sp-btn sp-btn-secondary">
          ← უკან
        </button>
      </div>
    );
  }

  // Result screen
  if (showResult) {
    const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👏' : '💪'}</div>
          <h2 className="text-2xl font-bold mb-2">გამოთქმის ვარჯიში დასრულდა!</h2>
          <p className="text-[var(--color-text-muted)]">{deck.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="sp-stat-card bg-gradient-to-br from-green-500/20 to-green-600/10">
            <div className="text-2xl font-bold text-green-400">{score}/{rounds.length}</div>
            <div className="text-xs text-[var(--color-text-muted)]">სწორი</div>
          </div>
          <div className="sp-stat-card bg-gradient-to-br from-sky-500/20 to-sky-600/10">
            <div className="text-2xl font-bold text-sky-400">{accuracy}%</div>
            <div className="text-xs text-[var(--color-text-muted)]">სიზუსტე</div>
          </div>
          <div className="sp-stat-card bg-gradient-to-br from-amber-500/20 to-amber-600/10">
            <div className="text-2xl font-bold text-amber-400">+{xpEarned}</div>
            <div className="text-xs text-[var(--color-text-muted)]">XP</div>
          </div>
          <div className="sp-stat-card bg-gradient-to-br from-purple-500/20 to-purple-600/10">
            <div className="text-2xl font-bold text-purple-400">{Math.round((Date.now() - startTime) / 1000)}წმ</div>
            <div className="text-xs text-[var(--color-text-muted)]">დრო</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onBack} className="sp-btn sp-btn-secondary flex-1">
            ← უკან
          </button>
          <button 
            onClick={() => {
              setCurrentRound(0);
              setScore(0);
              setTotalAttempts(0);
              setXpEarned(0);
              setSkipped(0);
              setShowResult(false);
              setFeedbackState('idle');
              setUserTranscript('');
              setMatchScore(0);
              // Re-shuffle
              const shuffled = [...deck.cards]
                .filter(c => c.english && c.english.length > 2 && c.english.length < 25)
                .sort(() => Math.random() - 0.5)
                .slice(0, 10)
                .map(c => ({
                  english: c.english,
                  georgian: c.georgian,
                  pronunciation: c.pronunciation || '',
                  audioUrl: `/flashcards/audio/words/${c.english.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}_en.mp3`
                }));
              setRounds(shuffled);
            }}
            className="sp-btn sp-btn-primary flex-1"
          >
            🔄 ხელახლა
          </button>
        </div>
      </div>
    );
  }

  const round = rounds[currentRound];
  const feedback = getFeedback(matchScore);
  const progressPct = ((currentRound) / rounds.length) * 100;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white text-lg">←</button>
        <div className="flex-1">
          <div className="sp-progress-bar">
            <div className="sp-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <span className="text-sm text-[var(--color-text-muted)] font-medium">{currentRound + 1}/{rounds.length}</span>
      </div>

      {/* Word Card */}
      <div className="sp-word-card mb-6">
        <div className="text-center mb-4">
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">თქვი ეს სიტყვა</div>
          <div className="text-3xl font-bold mb-2">{round.english}</div>
          {round.pronunciation && (
            <div className="text-sm text-[var(--color-text-muted)] mb-3">{round.pronunciation}</div>
          )}
          <div className="text-base text-sky-400">{round.georgian}</div>
        </div>

        {/* Listen button */}
        <button 
          onClick={() => playReference()}
          className="sp-listen-btn mx-auto"
        >
          <span className="text-2xl">🔊</span>
          <span className="text-sm font-medium">მოისმინე</span>
        </button>
      </div>

      {/* Microphone Area */}
      <div className="sp-mic-area mb-6">
        {feedbackState === 'idle' && (
          <button 
            onClick={startListening}
            className="sp-mic-btn sp-mic-btn-ready"
          >
            <span className="text-4xl">🎤</span>
          </button>
        )}

        {feedbackState === 'listening' && (
          <button 
            onClick={stopListening}
            className="sp-mic-btn sp-mic-btn-recording"
          >
            <span className="text-4xl">⏹️</span>
            <div className="sp-recording-pulse" />
          </button>
        )}

        {feedbackState === 'processing' && (
          <div className="sp-mic-btn sp-mic-btn-processing">
            <span className="text-4xl animate-spin">⏳</span>
          </div>
        )}

        {feedbackState === 'idle' && (
          <p className="text-sm text-[var(--color-text-muted)] mt-3 text-center">
            დააჭირე მიკროფონს და თქვი სიტყვა
          </p>
        )}
        {feedbackState === 'listening' && (
          <p className="text-sm text-green-400 mt-3 text-center animate-pulse">
            🎙️ ვუსმენ... თქვი სიტყვა
          </p>
        )}
      </div>

      {/* Result Feedback */}
      {feedbackState === 'result' && (
        <div className={`sp-feedback sp-feedback-${feedback.color} mb-6`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{feedback.emoji}</span>
            <div>
              <div className="font-bold text-lg">{feedback.label}</div>
              {matchScore > 0 && (
                <div className="text-sm opacity-80">სიზუსტე: {Math.round(matchScore * 100)}%</div>
              )}
            </div>
          </div>
          
          {userTranscript && (
            <div className="sp-transcript-compare">
              <div className="sp-transcript-row">
                <span className="sp-transcript-label">შენ თქვი:</span>
                <span className={`sp-transcript-text ${matchScore >= 0.7 ? 'text-green-400' : 'text-red-400'}`}>
                  "{userTranscript}"
                </span>
              </div>
              <div className="sp-transcript-row">
                <span className="sp-transcript-label">სწორი:</span>
                <span className="sp-transcript-text text-sky-400">"{round.english}"</span>
              </div>
            </div>
          )}

          {/* Score bar */}
          {matchScore > 0 && (
            <div className="sp-score-bar mt-3">
              <div 
                className={`sp-score-fill ${matchScore >= 0.7 ? 'bg-green-500' : matchScore >= 0.5 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${matchScore * 100}%` }}
              />
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {matchScore < 0.7 && (
              <button onClick={tryAgain} className="sp-btn sp-btn-secondary flex-1">
                🔄 ხელახლა
              </button>
            )}
            <button onClick={() => playReference()} className="sp-btn sp-btn-ghost">
              🔊
            </button>
            <button onClick={nextRound} className="sp-btn sp-btn-primary flex-1">
              {currentRound + 1 >= rounds.length ? '✅ დასრულება' : '→ შემდეგი'}
            </button>
          </div>
        </div>
      )}

      {/* Skip button (only when idle) */}
      {feedbackState === 'idle' && (
        <div className="text-center">
          <button onClick={handleSkip} className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">
            გამოტოვება →
          </button>
        </div>
      )}
    </div>
  );
}
