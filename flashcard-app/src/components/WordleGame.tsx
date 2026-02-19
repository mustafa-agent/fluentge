import { useState, useEffect, useCallback } from 'react';

const WORDS = [
  { word: 'BRAVE', ka: 'მამაცი' },
  { word: 'CLOUD', ka: 'ღრუბელი' },
  { word: 'DANCE', ka: 'ცეკვა' },
  { word: 'EARTH', ka: 'დედამიწა' },
  { word: 'FLAME', ka: 'ალი' },
  { word: 'GRAPE', ka: 'ყურძენი' },
  { word: 'HOUSE', ka: 'სახლი' },
  { word: 'JUDGE', ka: 'მოსამართლე' },
  { word: 'KNIFE', ka: 'დანა' },
  { word: 'LIGHT', ka: 'სინათლე' },
  { word: 'MONEY', ka: 'ფული' },
  { word: 'NIGHT', ka: 'ღამე' },
  { word: 'OCEAN', ka: 'ოკეანე' },
  { word: 'PIANO', ka: 'პიანინო' },
  { word: 'QUEEN', ka: 'დედოფალი' },
  { word: 'RIVER', ka: 'მდინარე' },
  { word: 'SMILE', ka: 'ღიმილი' },
  { word: 'TIGER', ka: 'ვეფხვი' },
  { word: 'UNITY', ka: 'ერთობა' },
  { word: 'VOICE', ka: 'ხმა' },
  { word: 'WORLD', ka: 'სამყარო' },
  { word: 'YOUTH', ka: 'ახალგაზრდობა' },
  { word: 'BRAIN', ka: 'ტვინი' },
  { word: 'CHAIR', ka: 'სკამი' },
  { word: 'DREAM', ka: 'ოცნება' },
  { word: 'FRESH', ka: 'ახალი' },
  { word: 'GREEN', ka: 'მწვანე' },
  { word: 'HEART', ka: 'გული' },
  { word: 'LEARN', ka: 'სწავლა' },
  { word: 'STORM', ka: 'ქარიშხალი' },
];

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

type CellState = 'correct' | 'present' | 'absent' | 'empty';

function getDailyWord() {
  const dayIndex = Math.floor(Date.now() / 86400000) % WORDS.length;
  return WORDS[dayIndex];
}

export default function WordleGame({ onBack }: { onBack: () => void }) {
  const target = getDailyWord();
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);

  const maxGuesses = 6;

  const getCellStates = (guess: string): CellState[] => {
    const states: CellState[] = Array(5).fill('absent');
    const targetArr = target.word.split('');
    const guessArr = guess.split('');
    // First pass: correct
    for (let i = 0; i < 5; i++) {
      if (guessArr[i] === targetArr[i]) {
        states[i] = 'correct';
        targetArr[i] = '#';
        guessArr[i] = '*';
      }
    }
    // Second pass: present
    for (let i = 0; i < 5; i++) {
      if (guessArr[i] !== '*') {
        const idx = targetArr.indexOf(guessArr[i]);
        if (idx !== -1) {
          states[i] = 'present';
          targetArr[idx] = '#';
        }
      }
    }
    return states;
  };

  const getKeyState = (letter: string): CellState => {
    let best: CellState = 'empty';
    for (const guess of guesses) {
      const states = getCellStates(guess);
      for (let i = 0; i < 5; i++) {
        if (guess[i] === letter) {
          if (states[i] === 'correct') return 'correct';
          if (states[i] === 'present') best = 'present';
          if (states[i] === 'absent' && best === 'empty') best = 'absent';
        }
      }
    }
    return best;
  };

  const submitGuess = useCallback(() => {
    if (current.length !== 5 || gameOver) return;
    const newGuesses = [...guesses, current];
    setGuesses(newGuesses);
    setCurrent('');
    if (current === target.word) {
      setWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= maxGuesses) {
      setGameOver(true);
    }
  }, [current, guesses, gameOver, target.word]);

  const handleKey = useCallback((key: string) => {
    if (gameOver) return;
    if (key === 'ENTER') {
      if (current.length === 5) submitGuess();
      else { setShake(true); setTimeout(() => setShake(false), 500); }
    } else if (key === '⌫' || key === 'BACKSPACE') {
      setCurrent(c => c.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && current.length < 5) {
      setCurrent(c => c + key);
    }
  }, [current, gameOver, submitGuess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key.toUpperCase());
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  const stateColor = (s: CellState) => {
    if (s === 'correct') return 'bg-green-600 border-green-600';
    if (s === 'present') return 'bg-yellow-600 border-yellow-600';
    if (s === 'absent') return 'bg-zinc-700 border-zinc-700';
    return 'border-zinc-600';
  };

  const keyColor = (s: CellState) => {
    if (s === 'correct') return 'bg-green-600';
    if (s === 'present') return 'bg-yellow-600';
    if (s === 'absent') return 'bg-zinc-700 text-zinc-400';
    return 'bg-zinc-600';
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-primary)] mb-4">← უკან</button>
      <h2 className="text-2xl font-bold mb-1">🟩 Wordle</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">გამოიცანი 5-ასოიანი სიტყვა 6 ცდაში</p>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">მინიშნება: <span className="text-white font-medium">{target.ka}</span></p>

      {/* Grid */}
      <div className="flex flex-col items-center gap-1.5 mb-6">
        {Array.from({ length: maxGuesses }).map((_, row) => {
          const guess = guesses[row];
          const isCurrent = row === guesses.length && !gameOver;
          const states = guess ? getCellStates(guess) : [];
          return (
            <div key={row} className={`flex gap-1.5 ${isCurrent && shake ? 'animate-[shake_0.5s]' : ''}`}>
              {Array.from({ length: 5 }).map((_, col) => {
                const letter = guess ? guess[col] : isCurrent ? current[col] || '' : '';
                const state = guess ? states[col] : 'empty';
                return (
                  <div key={col} className={`w-12 h-12 sm:w-14 sm:h-14 border-2 flex items-center justify-center text-xl font-bold rounded ${stateColor(state)} ${isCurrent && current[col] ? 'border-zinc-400' : ''} transition-all`}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Result */}
      {gameOver && (
        <div className={`text-center mb-4 p-4 rounded-xl ${won ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {won ? (
            <p className="text-lg font-bold text-green-400">🎉 გილოცავ! {guesses.length}/{maxGuesses} ცდაში!</p>
          ) : (
            <p className="text-lg font-bold text-red-400">სიტყვა იყო: <span className="text-white">{target.word}</span> ({target.ka})</p>
          )}
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-col items-center gap-1.5">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map(key => {
              const state = getKeyState(key);
              const wide = key === 'ENTER' || key === '⌫';
              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={`${wide ? 'px-3 text-xs' : 'w-8 sm:w-9'} h-12 rounded font-bold ${keyColor(state)} active:scale-95 transition-transform`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
