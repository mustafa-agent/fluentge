import { useState, useMemo, useEffect } from 'react';
import { Deck, FlashCard, getCardId } from '../lib/cards';
import { updateStats, incrementWordsLearned } from '../lib/storage';
import { playCorrect, playWrong } from '../lib/sounds';
import { checkAchievements } from './Achievements';
import { recordWrong, recordRight } from '../lib/difficult-words';
import ShareResult from './ShareResult';

interface Props {
  deck: Deck;
  allCards: FlashCard[];
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function awardXP(amount: number) {
  try {
    const current = parseInt(localStorage.getItem('totalXP') || '0');
    localStorage.setItem('totalXP', String(current + amount));
  } catch {}
}

export default function QuizScreen({ deck, allCards, onBack }: Props) {
  const questions = useMemo(() => {
    const shuffled = shuffle(deck.cards).slice(0, 10);
    return shuffled.map(card => {
      const others = allCards.filter(c => c.english !== card.english);
      const wrongs = shuffle(others).slice(0, 3);
      const options = shuffle([
        { text: card.georgian, correct: true },
        ...wrongs.map(w => ({ text: w.georgian, correct: false }))
      ]);
      return { card, options };
    });
  }, [deck, allCards]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const q = questions[current];

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const wasCorrect = q.options[idx].correct;
    setIsCorrect(wasCorrect);
    setShowFeedback(true);

    if (wasCorrect) {
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
      const xp = 15;
      setXpEarned(e => e + xp);
      awardXP(xp);
      playCorrect();
      incrementWordsLearned();
      recordRight(q.card.english);
    } else {
      setStreak(0);
      playWrong();
      recordWrong(q.card.english, q.card.georgian, q.card.category || 'quiz', q.card.pronunciation);
    }
    updateStats(wasCorrect);
  }

  function handleContinue() {
    setShowFeedback(false);
    if (current + 1 >= questions.length) {
      // Check for perfect quiz achievement
      if (correct + (isCorrect ? 0 : 0) === questions.length || (current + 1 === questions.length && correct === questions.length)) {
        try { localStorage.setItem('fluentge_perfect_quiz', 'true'); } catch {}
      }
      setDone(true);
      checkAchievements();
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setIsCorrect(null);
    }
  }

  // Result screen
  if (done) {
    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const emoji = accuracy === 100 ? '🏆' : accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪';
    const message = accuracy === 100 ? 'სრულყოფილი! 💯' : accuracy >= 80 ? 'შესანიშნავი! 🌟' : accuracy >= 50 ? 'კარგი შედეგია!' : 'გაიმეორე და გაუმჯობესდი!';

    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="result-pop">
          <div className="text-7xl mb-4">{emoji}</div>
          <h2 className="text-3xl font-extrabold mb-2">ქვიზი დასრულდა!</h2>
          <p className="text-lg text-[var(--color-text-muted)] mb-1">{message}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 my-8">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-b-4 border-green-500/30">
            <div className="text-2xl font-extrabold text-green-400">{correct}</div>
            <div className="text-xs text-[var(--color-text-muted)]">სწორი</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-b-4 border-sky-500/30">
            <div className="text-2xl font-extrabold text-sky-400">{accuracy}%</div>
            <div className="text-xs text-[var(--color-text-muted)]">სიზუსტე</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-b-4 border-amber-500/30">
            <div className="text-2xl font-extrabold text-amber-400">+{xpEarned}</div>
            <div className="text-xs text-[var(--color-text-muted)]">XP</div>
          </div>
        </div>

        {/* Accuracy bar */}
        <div className="max-w-xs mx-auto mb-8">
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${accuracy}%` }} />
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="quiz-option px-6 py-3 text-base"
          >
            უკან დაბრუნება
          </button>
          <button
            onClick={() => { setCurrent(0); setSelected(null); setIsCorrect(null); setCorrect(0); setStreak(0); setDone(false); setXpEarned(0); setShowFeedback(false); }}
            className="bg-green-500 border-green-600 border-2 border-b-4 active:border-b-2 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            თავიდან ⚡
          </button>
        </div>
        <ShareResult score={correct} total={questions.length} label="ქვიზი" />
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-xl">
          ✕
        </button>
        <div className="flex-1 quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${((current + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        {streak >= 2 && (
          <span className="text-sm font-bold text-amber-400">🔥 {streak}</span>
        )}
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">რას ნიშნავს?</p>
          <div className="flex items-center justify-center gap-3">
            <div className="text-3xl font-extrabold">{q.card.english}</div>
            <button
              onClick={() => speak(q.card.english)}
              className="text-2xl hover:scale-110 transition-transform active:scale-95"
            >🔊</button>
          </div>
          {q.card.pronunciation && (
            <div className="text-sm text-[var(--color-text-muted)] mt-2 italic">{q.card.pronunciation}</div>
          )}
        </div>

        {/* Options — 3D Duolingo-style */}
        <div className="grid gap-3">
          {q.options.map((opt, idx) => {
            let cls = 'quiz-option';
            if (selected !== null) {
              if (opt.correct) cls += ' correct';
              else if (idx === selected && !opt.correct) cls += ' wrong';
              else cls += ' dimmed';
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={cls}
                disabled={selected !== null}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom feedback bar — Duolingo style */}
      {showFeedback && (
        <div className={`quiz-feedback ${isCorrect ? 'correct-bar' : 'wrong-bar'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
            <div>
              <div className="font-bold text-lg">{isCorrect ? 'სწორია!' : 'არასწორია!'}</div>
              {!isCorrect && (
                <div className="text-sm opacity-90">სწორი პასუხი: {q.options.find(o => o.correct)?.text}</div>
              )}
            </div>
          </div>
          <button
            onClick={handleContinue}
            className="bg-white/20 hover:bg-white/30 font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            გაგრძელება
          </button>
        </div>
      )}
    </div>
  );
}
