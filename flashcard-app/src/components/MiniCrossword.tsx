import { useState, useEffect, useCallback } from 'react';
import { decks } from '../lib/cards';

interface Puzzle {
  grid: string[][];
  words: { word: string; row: number; col: number; dir: 'across' | 'down'; clue: string }[];
  size: number;
}

function generatePuzzle(): Puzzle {
  const allCards = decks.flatMap(d => d.cards).filter(c => c.english.length >= 3 && c.english.length <= 7 && /^[a-zA-Z]+$/.test(c.english));
  const shuffled = allCards.sort(() => Math.random() - 0.5);

  // Simple crossword: place 5-6 words
  const size = 9;
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
  const placed: { word: string; row: number; col: number; dir: 'across' | 'down'; clue: string }[] = [];

  // Place first word horizontally in middle
  const first = shuffled.find(c => c.english.length <= 7)!;
  const firstWord = first.english.toUpperCase();
  const startCol = Math.floor((size - firstWord.length) / 2);
  const midRow = Math.floor(size / 2);
  for (let i = 0; i < firstWord.length; i++) {
    grid[midRow][startCol + i] = firstWord[i];
  }
  placed.push({ word: firstWord, row: midRow, col: startCol, dir: 'across', clue: first.georgian });

  // Try to place more words crossing existing ones
  for (const card of shuffled.slice(0, 80)) {
    if (placed.length >= 5) break;
    const w = card.english.toUpperCase();
    if (placed.some(p => p.word === w)) continue;

    let bestPlacement: { row: number; col: number; dir: 'across' | 'down' } | null = null;

    // Try crossing existing letters
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c]) continue;
        const letter = grid[r][c];
        const idx = w.indexOf(letter);
        if (idx === -1) continue;

        // Try placing vertically through this point
        const startR = r - idx;
        if (startR >= 0 && startR + w.length <= size) {
          let canPlace = true;
          for (let i = 0; i < w.length; i++) {
            const cr = startR + i;
            if (grid[cr][c] && grid[cr][c] !== w[i]) { canPlace = false; break; }
            if (!grid[cr][c]) {
              // Check neighbors (left/right shouldn't have letters unless it's a crossing)
              if (c > 0 && grid[cr][c - 1] && cr !== r) { canPlace = false; break; }
              if (c < size - 1 && grid[cr][c + 1] && cr !== r) { canPlace = false; break; }
            }
          }
          // Check above/below
          if (canPlace && startR > 0 && grid[startR - 1][c]) canPlace = false;
          if (canPlace && startR + w.length < size && grid[startR + w.length][c]) canPlace = false;
          if (canPlace) { bestPlacement = { row: startR, col: c, dir: 'down' }; break; }
        }

        // Try placing horizontally through this point
        const startC = c - idx;
        if (startC >= 0 && startC + w.length <= size) {
          let canPlace = true;
          for (let i = 0; i < w.length; i++) {
            const cc = startC + i;
            if (grid[r][cc] && grid[r][cc] !== w[i]) { canPlace = false; break; }
            if (!grid[r][cc]) {
              if (r > 0 && grid[r - 1][cc] && cc !== c) { canPlace = false; break; }
              if (r < size - 1 && grid[r + 1][cc] && cc !== c) { canPlace = false; break; }
            }
          }
          if (canPlace && startC > 0 && grid[r][startC - 1]) canPlace = false;
          if (canPlace && startC + w.length < size && grid[r][startC + w.length]) canPlace = false;
          if (canPlace && !bestPlacement) { bestPlacement = { row: r, col: startC, dir: 'across' }; }
        }
        if (bestPlacement) break;
      }
      if (bestPlacement) break;
    }

    if (bestPlacement) {
      const { row, col, dir } = bestPlacement;
      for (let i = 0; i < w.length; i++) {
        if (dir === 'across') grid[row][col + i] = w[i];
        else grid[row + i][col] = w[i];
      }
      placed.push({ word: w, row, col, dir, clue: card.georgian });
    }
  }

  return { grid, words: placed, size };
}

export default function MiniCrossword({ onBack }: { onBack: () => void }) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [solved, setSolved] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const newPuzzle = useCallback(() => {
    const p = generatePuzzle();
    setPuzzle(p);
    setUserGrid(p.grid.map(row => row.map(cell => cell ? '' : '')));
    setSolved(false);
    setSelectedCell(null);
  }, []);

  useEffect(() => { newPuzzle(); }, [newPuzzle]);

  function handleInput(r: number, c: number, val: string) {
    if (!puzzle || !puzzle.grid[r][c]) return;
    const v = val.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
    const ng = userGrid.map(row => [...row]);
    ng[r][c] = v;
    setUserGrid(ng);

    // Check if solved
    let allCorrect = true;
    for (let i = 0; i < puzzle.size; i++) {
      for (let j = 0; j < puzzle.size; j++) {
        if (puzzle.grid[i][j] && ng[i][j] !== puzzle.grid[i][j]) {
          allCorrect = false;
        }
      }
    }
    if (allCorrect) setSolved(true);
  }

  function revealAll() {
    if (!puzzle) return;
    setUserGrid(puzzle.grid.map(row => [...row]));
    setSolved(true);
  }

  if (!puzzle) return null;

  // Number the cells
  const numbers: Record<string, number> = {};
  puzzle.words.forEach((w, i) => {
    const key = `${w.row}-${w.col}`;
    if (!(key in numbers)) numbers[key] = i + 1;
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">🧩 მინი კროსვორდი</h2>
        <div className="flex gap-2">
          <button onClick={revealAll} className="text-sm bg-[var(--color-bg-card)] px-3 py-1 rounded-lg">გამოავლინე</button>
          <button onClick={newPuzzle} className="text-sm bg-[var(--color-primary)] text-black px-3 py-1 rounded-lg font-bold">ახალი</button>
        </div>
      </div>

      {solved && (
        <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4 mb-4 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-bold text-green-400">გილოცავ! კროსვორდი ამოხსნილია!</div>
        </div>
      )}

      {/* Grid */}
      <div className="flex justify-center mb-4">
        <div className="inline-grid gap-[2px] bg-[var(--color-bg-card)]" style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}>
          {puzzle.grid.map((row, r) =>
            row.map((cell, c) => {
              const num = numbers[`${r}-${c}`];
              const isActive = cell !== '';
              const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
              return (
                <div
                  key={`${r}-${c}`}
                  className={`relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm font-bold
                    ${isActive ? 'bg-white/10 cursor-pointer' : 'bg-[var(--color-bg)]'}
                    ${isSelected ? 'ring-2 ring-[var(--color-primary)]' : ''}
                    ${solved && isActive ? 'bg-green-600/20' : ''}`}
                  onClick={() => isActive && setSelectedCell([r, c])}
                >
                  {num && <span className="absolute top-0 left-0.5 text-[8px] text-[var(--color-text-muted)]">{num}</span>}
                  {isActive && (
                    <input
                      type="text"
                      value={userGrid[r]?.[c] || ''}
                      onChange={(e) => handleInput(r, c, e.target.value)}
                      className="w-full h-full text-center bg-transparent outline-none text-white font-bold text-sm sm:text-base uppercase"
                      maxLength={1}
                      disabled={solved}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Clues */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-sm mb-2 text-[var(--color-primary)]">→ ჰორიზონტალური</h3>
          {puzzle.words.filter(w => w.dir === 'across').map((w, i) => (
            <div key={i} className="text-sm mb-1">
              <span className="font-bold">{numbers[`${w.row}-${w.col}`]}.</span> {w.clue} <span className="text-[var(--color-text-muted)]">({w.word.length} ასო)</span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-bold text-sm mb-2 text-[var(--color-primary)]">↓ ვერტიკალური</h3>
          {puzzle.words.filter(w => w.dir === 'down').map((w, i) => (
            <div key={i} className="text-sm mb-1">
              <span className="font-bold">{numbers[`${w.row}-${w.col}`]}.</span> {w.clue} <span className="text-[var(--color-text-muted)]">({w.word.length} ასო)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
