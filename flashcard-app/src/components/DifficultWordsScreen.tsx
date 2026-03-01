import { useState, useMemo, useEffect, useRef } from 'react';
import { getTopDifficult, DifficultWord, recordRight, recordWrong } from '../lib/difficult-words';
import { playCorrect, playWrong } from '../lib/sounds';
import { addXP, XP_REWARDS } from '../lib/gamification';
import ShareResult from './ShareResult';

interface Props {
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

export default function DifficultWordsScreen({ onBack }: Props) {
  const allDifficult = useMemo(() => getTopDifficult(20), []);
  const [mode, setMode] = useState<'list' | 'practice'>('list');
  const [cards, setCards] = useState<DifficultWord[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  function startPractice() {
    setCards(shuffle(allDifficult).slice(0, Math.min(10, allDifficult.length)));
    setCurrent(0);
    setFlipped(false);
    setCorrect(0);
    setReviewed(0);
    setDone(false);
    setXpEarned(0);
    setMode('practice');
  }

  function handleRate(knew: boolean) {
    const card = cards[current];
    if (knew) {
      recordRight(card.english);
      setCorrect(c => c + 1);
      const xp = 20; // Extra XP for mastering difficult words
      setXpEarned(e => e + xp);
      addXP(xp);
      playCorrect();
    } else {
      recordWrong(card.english, card.georgian, card.category, card.pronunciation);
      playWrong();
    }
    
    setReviewed(r => r + 1);
    
    if (current + 1 >= cards.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setFlipped(false);
    }
  }

  // Empty state
  if (allDifficult.length === 0) {
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold mb-2">რთული სიტყვები არ გაქვს!</h2>
        <p className="text-[var(--color-text-muted)] mb-6">
          ქვიზში ან წერაში შეცდომები რომ დაუშვებ, ის სიტყვები აქ გამოჩნდება.
        </p>
        <button onClick={onBack} className="quiz-option px-6 py-3">← უკან</button>
      </div>
    );
  }

  // Result screen
  if (done) {
    const accuracy = cards.length > 0 ? Math.round((correct / cards.length) * 100) : 0;
    return (
      <div className="px-4 py-12 max-w-lg mx-auto text-center">
        <div className="result-pop">
          <div className="text-7xl mb-4">{accuracy >= 80 ? '🏆' : accuracy >= 50 ? '👍' : '💪'}</div>
          <h2 className="text-3xl font-extrabold mb-2">პრაქტიკა დასრულდა!</h2>
          <p className="text-[var(--color-text-muted)]">რთულ სიტყვებზე იმუშავე — ბრავო!</p>
        </div>

        <div className="grid grid-cols-3 gap-3 my-8">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border-b-4 border-green-500/30">
            <div className="text-2xl font-extrabold text-green-400">{correct}/{cards.length}</div>
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

        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="quiz-option px-6 py-3 text-base">უკან</button>
          <button onClick={startPractice} className="bg-red-500 border-red-600 border-2 border-b-4 active:border-b-2 text-white font-bold px-6 py-3 rounded-xl transition-all">
            თავიდან 🔄
          </button>
        </div>
        <ShareResult score={correct} total={cards.length} label="რთული სიტყვები" />
      </div>
    );
  }

  // Practice mode — flashcard style
  if (mode === 'practice') {
    const card = cards[current];
    return (
      <div className="px-4 py-6 max-w-lg mx-auto min-h-screen flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-xl">✕</button>
          <div className="flex-1 quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${((current + (flipped ? 0.5 : 0)) / cards.length) * 100}%` }} />
          </div>
          <span className="text-xs text-red-400 font-bold">❌ {card.wrongCount}x შეცდომა</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {!flipped ? (
            <div
              className="w-full bg-[var(--color-bg-card)] border-2 border-red-500/20 rounded-2xl p-8 text-center cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => setFlipped(true)}
            >
              <div className="text-xs text-red-400 mb-3 uppercase tracking-wider font-semibold">რთული სიტყვა</div>
              <h1 className="text-4xl font-extrabold mb-3">{card.english}</h1>
              {card.pronunciation && <p className="text-sm text-[var(--color-text-muted)] italic">[{card.pronunciation}]</p>}
              <button onClick={(e) => { e.stopPropagation(); speak(card.english); }} className="mt-3 text-2xl hover:scale-110 transition-transform">🔊</button>
              <p className="text-sm text-[var(--color-text-muted)] mt-4 animate-pulse">შეეხე გადასაბრუნებლად 👆</p>
            </div>
          ) : (
            <>
              <div className="w-full bg-[var(--color-bg-card)] border-2 border-green-500/20 rounded-2xl p-8 text-center">
                <h1 className="text-2xl font-bold mb-2">{card.english}</h1>
                <p className="text-xl text-green-400 font-bold">{card.georgian}</p>
                {card.pronunciation && <p className="text-sm text-[var(--color-text-muted)] italic mt-1">[{card.pronunciation}]</p>}
              </div>

              <div className="flex gap-3 mt-6 w-full">
                <button
                  onClick={() => handleRate(false)}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold py-4 rounded-xl transition-colors"
                >
                  ჯერ არა ❌
                </button>
                <button
                  onClick={() => handleRate(true)}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 font-bold py-4 rounded-xl transition-colors"
                >
                  უკვე ვიცი ✅
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // List mode — show all difficult words
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm mb-2 flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            უკან
          </button>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            😤 რთული სიტყვები
            <span className="text-sm font-normal bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{allDifficult.length}</span>
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">ეს სიტყვები ყველაზე ხშირად შეგეშალა</p>
        </div>
      </div>

      {/* Practice button */}
      <button
        onClick={startPractice}
        className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-4 rounded-xl mb-6 border-b-4 border-red-600 active:border-b-2 transition-all text-lg"
      >
        🔥 ივარჯიშე რთულ სიტყვებზე (+20 XP)
      </button>

      {/* Word list */}
      <div className="space-y-2">
        {allDifficult.map((word, i) => (
          <div
            key={word.english}
            className="bg-[var(--color-bg-card)] rounded-xl p-4 flex items-center justify-between border border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-[var(--color-text-muted)] w-6">{i + 1}</span>
              <div>
                <div className="font-bold">{word.english}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{word.georgian}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-red-400">❌ {word.wrongCount}</div>
              <div className="text-xs text-green-400">✅ {word.rightCount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
