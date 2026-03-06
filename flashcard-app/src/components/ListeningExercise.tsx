import { useState, useEffect, useMemo, useCallback } from 'react';
import { Deck, FlashCard } from '../lib/cards';
import { playCorrect, playWrong } from '../lib/sounds';
import { addCardReview } from '../lib/gamification';

function awardXP(amount: number) {
  try {
    const current = parseInt(localStorage.getItem('totalXP') || '0');
    localStorage.setItem('totalXP', String(current + amount));
  } catch {}
}

function speak(text: string, rate = 0.85) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  deck: Deck;
  onBack: () => void;
}

interface Question {
  card: FlashCard;
  options: { text: string; correct: boolean }[];
}

export default function ListeningExercise({ deck, onBack }: Props) {
  const TOTAL = Math.min(10, deck.cards.length);

  const questions: Question[] = useMemo(() => {
    const picked = shuffleArray(deck.cards).slice(0, TOTAL);
    return picked.map(card => {
      const others = deck.cards.filter(c => c.english !== card.english);
      const wrongs = shuffleArray(others).slice(0, 3);
      const options = shuffleArray([
        { text: card.georgian, correct: true },
        ...wrongs.map(w => ({ text: w.georgian, correct: false }))
      ]);
      return { card, options };
    });
  }, [deck]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXpFloat, setShowXpFloat] = useState(false);
  const [played, setPlayed] = useState(false);

  const question = questions[index];
  const finished = index >= TOTAL;
  const progress = ((index + (isCorrect !== null ? 1 : 0)) / TOTAL) * 100;

  // Auto-play audio on new question
  useEffect(() => {
    if (!finished && question) {
      setPlayed(false);
      const t = setTimeout(() => {
        speak(question.card.english);
        setPlayed(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [index, finished]);

  const handlePlay = useCallback(() => {
    if (question) {
      speak(question.card.english);
      setPlayed(true);
    }
  }, [question]);

  const handlePlaySlow = useCallback(() => {
    if (question) speak(question.card.english, 0.5);
  }, [question]);

  const handleSelect = (optIndex: number) => {
    if (selected !== null) return;
    setSelected(optIndex);
    const correct = question.options[optIndex].correct;
    setIsCorrect(correct);
    addCardReview();
    if (correct) {
      setScore(prev => prev + 1);
      awardXP(10);
      setXpEarned(prev => prev + 10);
      setShowXpFloat(true);
      setTimeout(() => setShowXpFloat(false), 1200);
      playCorrect();
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    setIndex(prev => prev + 1);
    setSelected(null);
    setIsCorrect(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setXpEarned(0);
  };

  if (finished) {
    const pct = Math.round((score / TOTAL) * 100);
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="result-pop">
          <div className="text-6xl mb-3">{pct >= 80 ? '🎧' : pct >= 50 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-extrabold mb-2">მოსმენა დასრულდა!</h2>
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

  if (!question) return null;

  return (
    <div className="max-w-lg mx-auto p-4 relative">
      {/* XP Float */}
      {showXpFloat && (
        <div className="absolute top-2 left-1/2 text-yellow-400 font-bold text-lg pointer-events-none z-50" style={{ animation: 'xpFloat 1.2s ease-out forwards' }}>
          +10 XP ⭐
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors font-medium">← უკან</button>
        <span className="text-xs font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">🎧 მოსმენა</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-green-400">{score} ✓</span>
          <span className="text-sm text-[var(--color-text-muted)]">{index + 1}/{TOTAL}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-track mb-5">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Audio player area */}
      <div className="le-audio-card">
        <button onClick={handlePlay} className="le-play-btn">
          <span className="text-4xl">🔊</span>
        </button>
        <p className="text-sm text-[var(--color-text-muted)] mt-3">მოისმინე და აირჩიე სწორი თარგმანი</p>
        <button onClick={handlePlaySlow} className="le-slow-btn">
          🐢 ნელა
        </button>
      </div>

      {/* Word shown after answer */}
      {selected !== null && (
        <div className="text-center mb-3 text-lg font-bold text-sky-400 animate-pulse">
          "{question.card.english}" = {question.card.georgian}
        </div>
      )}

      {/* 4 Georgian option cards */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {question.options.map((opt, i) => {
          let cls = 'le-option';
          if (selected !== null) {
            if (opt.correct) cls += ' correct';
            else if (i === selected && !opt.correct) cls += ' wrong';
            else cls += ' dimmed';
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} className={cls} disabled={selected !== null}>
              <span className="le-option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="flex-1 text-left">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom feedback bar */}
      {selected !== null && (
        <div className={`quiz-feedback ${isCorrect ? 'correct-bar' : 'wrong-bar'}`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
            <span className="font-bold">{isCorrect ? 'სწორია!' : 'არასწორია'}</span>
          </div>
          <button onClick={handleNext} className="px-5 py-2 bg-white/20 rounded-xl font-bold hover:bg-white/30 transition-colors border-b-2 border-white/20 active:border-b-0">
            შემდეგი →
          </button>
        </div>
      )}
    </div>
  );
}
