import { useState, useEffect, useCallback } from 'react';
import { Deck, FlashCard } from '../lib/cards';
import { playCorrect, playWrong } from '../lib/sounds';

function playTap() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
}

function awardXP(amount: number) {
  try {
    const current = parseInt(localStorage.getItem('totalXP') || '0');
    localStorage.setItem('totalXP', String(current + amount));
  } catch {}
}

interface Props {
  deck: Deck;
  onBack: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SentenceBuilder({ deck, onBack }: Props) {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXpFloat, setShowXpFloat] = useState(false);

  // Filter cards that have example sentences with 3+ words
  const validCards = deck.cards.filter(c => c.example_en && c.example_en.split(/\s+/).length >= 3);
  const TOTAL_QUESTIONS = Math.min(10, validCards.length);

  useEffect(() => {
    const shuffled = shuffleArray(validCards).slice(0, TOTAL_QUESTIONS);
    setCards(shuffled);
    setIndex(0);
    setScore(0);
    setTotal(0);
    setXpEarned(0);
  }, [deck]);

  useEffect(() => {
    if (cards.length === 0) return;
    const card = cards[index];
    if (!card) return;
    const words = card.example_en.split(/\s+/);
    setCorrectWords(words);
    setAvailableWords(shuffleArray(words));
    setSelectedWords([]);
    setChecked(false);
    setIsCorrect(false);
  }, [cards, index]);

  const handleSelectWord = useCallback((wordIndex: number) => {
    if (checked) return;
    playTap();
    setSelectedWords(prev => [...prev, wordIndex]);
  }, [checked]);

  const handleRemoveWord = useCallback((position: number) => {
    if (checked) return;
    setSelectedWords(prev => prev.filter((_, i) => i !== position));
  }, [checked]);

  const handleCheck = () => {
    const userSentence = selectedWords.map(i => availableWords[i]).join(' ');
    const correct = correctWords.join(' ');
    const result = userSentence === correct;
    setIsCorrect(result);
    setChecked(true);
    setTotal(prev => prev + 1);
    if (result) {
      setScore(prev => prev + 1);
      awardXP(15);
      setXpEarned(prev => prev + 15);
      setShowXpFloat(true);
      setTimeout(() => setShowXpFloat(false), 1200);
      playCorrect();
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (index + 1 < cards.length) {
      setIndex(prev => prev + 1);
    }
  };

  const restart = () => {
    setCards(shuffleArray(validCards).slice(0, TOTAL_QUESTIONS));
    setIndex(0);
    setScore(0);
    setTotal(0);
    setXpEarned(0);
  };

  if (validCards.length < 3) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-xl font-bold mb-2">არ არის საკმარისი წინადადებები</h2>
        <p className="text-[var(--color-text-muted)] mb-6">ამ დეკში არ არის საკმარისი მაგალითი წინადადებები.</p>
        <button onClick={onBack} className="sb-btn-back">← უკან</button>
      </div>
    );
  }

  const finished = total >= TOTAL_QUESTIONS && checked;
  const card = cards[index];
  if (!card) return null;

  const progress = ((index + (checked ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="result-pop">
          <div className="text-6xl mb-3">{pct >= 80 ? '🌟' : pct >= 50 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-extrabold mb-2">სესია დასრულდა!</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="sb-stat-card">
            <div className="text-2xl font-bold text-green-400">{score}</div>
            <div className="text-xs text-[var(--color-text-muted)]">სწორი</div>
          </div>
          <div className="sb-stat-card">
            <div className="text-2xl font-bold text-[var(--color-text)]">{pct}%</div>
            <div className="text-xs text-[var(--color-text-muted)]">სიზუსტე</div>
          </div>
          <div className="sb-stat-card">
            <div className="text-2xl font-bold text-yellow-400">+{xpEarned}</div>
            <div className="text-xs text-[var(--color-text-muted)]">XP</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="sb-btn-back">← უკან</button>
          <button onClick={restart} className="sb-btn-primary">🔄 თავიდან</button>
        </div>
      </div>
    );
  }

  const usedIndices = new Set(selectedWords);

  return (
    <div className="max-w-lg mx-auto p-4 relative">
      {/* XP Float */}
      {showXpFloat && (
        <div className="absolute top-2 left-1/2 text-yellow-400 font-bold text-lg pointer-events-none z-50" style={{ animation: 'xpFloat 1.2s ease-out forwards' }}>
          +15 XP ⭐
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors font-medium">← უკან</button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full">📝 წინადადება</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-green-400">{score} ✓</span>
          <span className="text-sm text-[var(--color-text-muted)]">{index + 1}/{TOTAL_QUESTIONS}</span>
        </div>
      </div>

      {/* Progress bar — chunky Duolingo style */}
      <div className="quiz-progress-track mb-5">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Georgian prompt card */}
      <div className="sb-prompt-card">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🇬🇪</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">თარგმნე ინგლისურად</span>
        </div>
        <p className="text-xl font-bold leading-relaxed">{card.example_ka}</p>
        {card.georgian && (
          <p className="text-sm text-[var(--color-text-muted)] mt-1">💡 {card.english} = {card.georgian}</p>
        )}
      </div>

      {/* Sentence building area */}
      <div className={`sb-drop-zone ${checked ? (isCorrect ? 'correct' : 'wrong') : selectedWords.length > 0 ? 'active' : ''}`}>
        {selectedWords.length === 0 ? (
          <span className="text-[var(--color-text-muted)] text-sm">დააჭირე სიტყვებს ქვემოთ...</span>
        ) : (
          selectedWords.map((wordIdx, pos) => (
            <button
              key={pos}
              onClick={() => handleRemoveWord(pos)}
              className={`sb-word-tile placed ${checked ? (isCorrect ? 'correct' : 'wrong') : ''}`}
            >
              {availableWords[wordIdx]}
            </button>
          ))
        )}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {availableWords.map((word, i) => (
          <button
            key={i}
            onClick={() => handleSelectWord(i)}
            disabled={usedIndices.has(i) || checked}
            className={`sb-word-tile ${usedIndices.has(i) ? 'used' : 'available'}`}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Correct answer reveal */}
      {checked && !isCorrect && (
        <div className="sb-correct-reveal">
          <p className="text-sm font-bold text-yellow-400 mb-1">სწორი პასუხი:</p>
          <p className="font-semibold text-[var(--color-text)]">{correctWords.join(' ')}</p>
        </div>
      )}

      {/* Bottom feedback bar — Duolingo-style */}
      {checked && (
        <div className={`quiz-feedback ${isCorrect ? 'correct-bar' : 'wrong-bar'}`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
            <span className="font-bold">{isCorrect ? 'სწორია!' : 'არასწორია'}</span>
          </div>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-white/20 rounded-xl font-bold hover:bg-white/30 transition-colors border-b-2 border-white/20 active:border-b-0"
          >
            შემდეგი →
          </button>
        </div>
      )}

      {/* Check button — only when not checked */}
      {!checked && (
        <button
          onClick={handleCheck}
          disabled={selectedWords.length !== availableWords.length}
          className="sb-btn-check"
        >
          შემოწმება ✓
        </button>
      )}
    </div>
  );
}
