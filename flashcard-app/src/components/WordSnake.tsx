import { useState, useCallback } from 'react';
import { decks } from '../lib/cards';

// Get words that fit nicely in a grid (3-8 letters)
const allWords = decks.flatMap(d => d.cards)
  .filter(c => c.english.length >= 3 && c.english.length <= 8 && /^[a-z]+$/i.test(c.english))
  .map(c => ({ en: c.english.toUpperCase(), ka: c.georgian }));

type Cell = { letter: string; row: number; col: number; partOfWord: boolean; selected: boolean; found: boolean };

function generateGrid(size: number): { grid: Cell[][]; words: { en: string; ka: string; cells: [number, number][] }[] } {
  const grid: Cell[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({
      letter: '', row: r, col: c, partOfWord: false, selected: false, found: false,
    }))
  );

  const directions = [
    [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1],
  ];

  const placedWords: { en: string; ka: string; cells: [number, number][] }[] = [];
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);

  for (const word of shuffled) {
    if (placedWords.length >= 6) break;
    const w = word.en;
    const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
    let placed = false;

    for (const [dr, dc] of shuffledDirs) {
      if (placed) break;
      const startRows = Array.from({ length: size }, (_, i) => i).sort(() => Math.random() - 0.5);
      const startCols = Array.from({ length: size }, (_, i) => i).sort(() => Math.random() - 0.5);

      for (const sr of startRows) {
        if (placed) break;
        for (const sc of startCols) {
          if (placed) break;
          const endR = sr + dr * (w.length - 1);
          const endC = sc + dc * (w.length - 1);
          if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

          let canPlace = true;
          const cells: [number, number][] = [];
          for (let i = 0; i < w.length; i++) {
            const r = sr + dr * i;
            const c = sc + dc * i;
            if (grid[r][c].letter !== '' && grid[r][c].letter !== w[i]) {
              canPlace = false;
              break;
            }
            cells.push([r, c]);
          }

          if (canPlace) {
            for (let i = 0; i < w.length; i++) {
              const [r, c] = cells[i];
              grid[r][c].letter = w[i];
              grid[r][c].partOfWord = true;
            }
            placedWords.push({ en: w, ka: word.ka, cells });
            placed = true;
          }
        }
      }
    }
  }

  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPRSTUVW';
  for (const row of grid) {
    for (const cell of row) {
      if (cell.letter === '') {
        cell.letter = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, words: placedWords };
}

export default function WordSnake({ onBack }: { onBack: () => void }) {
  const [gridSize] = useState(8);
  const [{ grid, words }, setData] = useState(() => generateGrid(8));
  const [selected, setSelected] = useState<[number, number][]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');

  const isAdjacent = (r1: number, c1: number, r2: number, c2: number) =>
    Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);

  const handleCellClick = useCallback((r: number, c: number) => {
    setSelected(prev => {
      // If already selected last, deselect
      if (prev.length > 0 && prev[prev.length - 1][0] === r && prev[prev.length - 1][1] === c) {
        return prev.slice(0, -1);
      }
      // If already in path, truncate to that point
      const idx = prev.findIndex(([pr, pc]) => pr === r && pc === c);
      if (idx >= 0) return prev.slice(0, idx + 1);
      // Must be adjacent to last
      if (prev.length > 0) {
        const [lr, lc] = prev[prev.length - 1];
        if (!isAdjacent(lr, lc, r, c)) return prev;
      }
      return [...prev, [r, c]];
    });
    setMessage('');
  }, []);

  const checkWord = () => {
    const selectedWord = selected.map(([r, c]) => grid[r][c].letter).join('');
    const match = words.find(w => w.en === selectedWord && !found.has(w.en));

    if (match) {
      setFound(prev => new Set([...prev, match.en]));
      setMessage(`✅ ${match.en} = ${match.ka}`);
    } else {
      setMessage('❌ სცადე თავიდან');
    }
    setSelected([]);
  };

  const newGame = () => {
    setData(generateGrid(gridSize));
    setSelected([]);
    setFound(new Set());
    setMessage('');
  };

  const selectedSet = new Set(selected.map(([r, c]) => `${r},${c}`));
  const allFound = found.size === words.length && words.length > 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[var(--color-primary)]">← უკან</button>
        <h2 className="text-lg font-bold">🐍 სიტყვის გველი</h2>
        <span className="text-sm">{found.size}/{words.length}</span>
      </div>

      <p className="text-sm text-[var(--color-text-muted)] mb-3 text-center">
        შეაერთე ასოები სიტყვის შესაქმნელად. მიყევი მიმდებარე უჯრებს.
      </p>

      {/* Grid */}
      <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {grid.flat().map((cell, i) => {
          const key = `${cell.row},${cell.col}`;
          const isSelected = selectedSet.has(key);
          const isFound = found.size > 0 && words.some(w => w.cells.some(([r, c]) => r === cell.row && c === cell.col) && found.has(w.en));

          return (
            <button
              key={i}
              onClick={() => handleCellClick(cell.row, cell.col)}
              className={`aspect-square rounded-lg font-bold text-sm flex items-center justify-center transition-all
                ${isFound ? 'bg-green-600/40 text-green-300' : ''}
                ${isSelected && !isFound ? 'bg-[var(--color-primary)] text-black scale-110' : ''}
                ${!isSelected && !isFound ? 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)]' : ''}
              `}
            >
              {cell.letter}
            </button>
          );
        })}
      </div>

      {/* Selected word preview */}
      {selected.length > 0 && (
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-lg font-bold tracking-widest">
            {selected.map(([r, c]) => grid[r][c].letter).join('')}
          </span>
          <button
            onClick={checkWord}
            className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-lg font-bold text-sm"
          >
            შეამოწმე ✓
          </button>
          <button
            onClick={() => setSelected([])}
            className="text-red-400 text-sm"
          >
            წაშალე
          </button>
        </div>
      )}

      {message && (
        <p className="text-center text-lg mb-3">{message}</p>
      )}

      {/* Word list */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
        <h3 className="font-bold mb-2 text-sm">იპოვე ეს სიტყვები:</h3>
        <div className="grid grid-cols-2 gap-2">
          {words.map((w, i) => (
            <div key={i} className={`text-sm ${found.has(w.en) ? 'line-through text-green-400' : 'text-[var(--color-text-muted)]'}`}>
              {found.has(w.en) ? `${w.en} = ${w.ka}` : `??? (${w.ka})`}
            </div>
          ))}
        </div>
      </div>

      {allFound && (
        <div className="text-center mb-4">
          <p className="text-2xl mb-2">🎉 ყოჩაღ!</p>
          <p className="text-[var(--color-text-muted)]">ყველა სიტყვა იპოვე!</p>
          <button onClick={newGame} className="mt-3 bg-[var(--color-primary)] text-black px-6 py-2 rounded-lg font-bold">
            ახალი თამაში
          </button>
        </div>
      )}

      {!allFound && (
        <button onClick={newGame} className="w-full py-2 text-sm text-[var(--color-text-muted)] hover:text-white">
          🔄 ახალი თამაში
        </button>
      )}
    </div>
  );
}
