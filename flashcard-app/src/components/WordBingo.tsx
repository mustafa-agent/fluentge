import { useState, useEffect, useCallback } from 'react';
import { decks } from '../lib/cards';

interface BingoCell {
  english: string;
  georgian: string;
  called: boolean;
  marked: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SIZE = 4; // 4x4 bingo
const TOTAL = SIZE * SIZE;

export default function WordBingo({ onBack }: { onBack: () => void }) {
  const [grid, setGrid] = useState<BingoCell[]>([]);
  const [callQueue, setCallQueue] = useState<{ english: string; georgian: string }[]>([]);
  const [currentCall, setCurrentCall] = useState<{ english: string; georgian: string } | null>(null);
  const [callIdx, setCallIdx] = useState(-1);
  const [won, setWon] = useState(false);
  const [wrongMark, setWrongMark] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    const allCards = decks.flatMap(d => d.cards).map(c => ({ english: c.english, georgian: c.georgian }));
    const shuffled = shuffle(allCards);
    const boardWords = shuffled.slice(0, TOTAL);
    const extraWords = shuffled.slice(TOTAL, TOTAL + 8); // extra distractors for call queue
    
    const newGrid: BingoCell[] = boardWords.map(w => ({
      english: w.english,
      georgian: w.georgian,
      called: false,
      marked: false,
    }));

    // Call queue: all board words + some extras, shuffled
    const queue = shuffle([...boardWords, ...extraWords]);
    
    setGrid(newGrid);
    setCallQueue(queue);
    setCallIdx(-1);
    setCurrentCall(null);
    setWon(false);
    setWrongMark(null);
    setScore(0);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  function nextCall() {
    const next = callIdx + 1;
    if (next >= callQueue.length) return;
    setCallIdx(next);
    const call = callQueue[next];
    setCurrentCall(call);
    setWrongMark(null);
    
    // Mark which grid cells match this call
    setGrid(prev => prev.map(cell => ({
      ...cell,
      called: cell.called || cell.english === call.english,
    })));
  }

  function markCell(idx: number) {
    if (won || !currentCall) return;
    const cell = grid[idx];
    if (cell.marked) return;
    
    if (cell.english === currentCall.english) {
      // Correct!
      const newGrid = [...grid];
      newGrid[idx] = { ...cell, marked: true };
      setGrid(newGrid);
      setScore(s => s + 1);
      setWrongMark(null);
      
      // Check bingo (any row or column complete)
      if (checkBingo(newGrid)) {
        setWon(true);
      }
    } else {
      setWrongMark(idx);
      setTimeout(() => setWrongMark(null), 800);
    }
  }

  function checkBingo(g: BingoCell[]): boolean {
    // Check rows
    for (let r = 0; r < SIZE; r++) {
      if (g.slice(r * SIZE, r * SIZE + SIZE).every(c => c.marked)) return true;
    }
    // Check columns
    for (let c = 0; c < SIZE; c++) {
      let col = true;
      for (let r = 0; r < SIZE; r++) {
        if (!g[r * SIZE + c].marked) { col = false; break; }
      }
      if (col) return true;
    }
    // Diagonals
    let d1 = true, d2 = true;
    for (let i = 0; i < SIZE; i++) {
      if (!g[i * SIZE + i].marked) d1 = false;
      if (!g[i * SIZE + (SIZE - 1 - i)].marked) d2 = false;
    }
    return d1 || d2;
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 hover:text-white">← უკან</button>
      <h2 className="text-2xl font-bold mb-1">🎲 სიტყვების ბინგო</h2>
      <p className="text-[var(--color-text-muted)] text-sm mb-4">მოისმინე ქართული სიტყვა, იპოვე ინგლისური!</p>

      {/* Current call */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4 text-center">
        {currentCall ? (
          <>
            <div className="text-xs text-[var(--color-text-muted)] mb-1">იპოვე ეს სიტყვა:</div>
            <div className="text-2xl font-bold text-[var(--color-primary)]">{currentCall.georgian}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">ქვემოთ აირჩიე ინგლისური</div>
          </>
        ) : (
          <div className="text-[var(--color-text-muted)]">დააჭირე "შემდეგი სიტყვა" დასაწყებად</div>
        )}
      </div>

      {!won && (
        <button
          onClick={nextCall}
          disabled={callIdx >= callQueue.length - 1}
          className="w-full py-2 mb-4 rounded-xl bg-[var(--color-primary)] text-black font-bold disabled:opacity-40"
        >
          შემდეგი სიტყვა →
        </button>
      )}

      {/* Bingo grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {grid.map((cell, idx) => {
          let cls = "aspect-square rounded-lg flex items-center justify-center text-center p-1 text-xs font-medium transition-all ";
          if (cell.marked) {
            cls += "bg-green-600 text-white scale-95";
          } else if (wrongMark === idx) {
            cls += "bg-red-600 text-white animate-pulse";
          } else {
            cls += "bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] text-white cursor-pointer";
          }
          return (
            <button key={idx} onClick={() => markCell(idx)} className={cls}>
              {cell.english}
            </button>
          );
        })}
      </div>

      {/* Score */}
      <div className="text-center text-sm text-[var(--color-text-muted)]">
        ქულა: {score} | სიტყვები: {callIdx + 1}/{callQueue.length}
      </div>

      {won && (
        <div className="mt-4 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-2xl font-bold text-green-400 mb-2">ბინგო!</div>
          <p className="text-[var(--color-text-muted)] text-sm mb-3">{score} სიტყვა გამოიცანი!</p>
          <button onClick={initGame} className="px-6 py-2 rounded-xl bg-[var(--color-primary)] text-black font-bold">
            ხელახლა თამაში 🔄
          </button>
        </div>
      )}
    </div>
  );
}
