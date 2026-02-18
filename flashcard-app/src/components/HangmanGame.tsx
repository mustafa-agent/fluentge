import { useState, useEffect, useCallback } from 'react';
import { decks } from '../lib/cards';

interface Props {
  onBack: () => void;
}

const allWords = decks.flatMap(d => d.cards).filter(c => c.english.length >= 3 && !c.english.includes(' '));

const HANGMAN_PARTS = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
const MAX_WRONG = HANGMAN_PARTS.length;

function HangmanSvg({ wrongCount }: { wrongCount: number }) {
  return (
    <svg viewBox="0 0 200 220" className="w-48 h-48 mx-auto">
      {/* Gallows */}
      <line x1="20" y1="210" x2="180" y2="210" stroke="#4b5563" strokeWidth="4" />
      <line x1="60" y1="210" x2="60" y2="20" stroke="#4b5563" strokeWidth="4" />
      <line x1="60" y1="20" x2="140" y2="20" stroke="#4b5563" strokeWidth="4" />
      <line x1="140" y1="20" x2="140" y2="50" stroke="#4b5563" strokeWidth="4" />
      {/* Head */}
      {wrongCount >= 1 && <circle cx="140" cy="65" r="15" stroke="#f87171" strokeWidth="3" fill="none" />}
      {/* Body */}
      {wrongCount >= 2 && <line x1="140" y1="80" x2="140" y2="140" stroke="#f87171" strokeWidth="3" />}
      {/* Left arm */}
      {wrongCount >= 3 && <line x1="140" y1="95" x2="115" y2="120" stroke="#f87171" strokeWidth="3" />}
      {/* Right arm */}
      {wrongCount >= 4 && <line x1="140" y1="95" x2="165" y2="120" stroke="#f87171" strokeWidth="3" />}
      {/* Left leg */}
      {wrongCount >= 5 && <line x1="140" y1="140" x2="115" y2="175" stroke="#f87171" strokeWidth="3" />}
      {/* Right leg */}
      {wrongCount >= 6 && <line x1="140" y1="140" x2="165" y2="175" stroke="#f87171" strokeWidth="3" />}
    </svg>
  );
}

export default function HangmanGame({ onBack }: Props) {
  const [wordData, setWordData] = useState(() => allWords[Math.floor(Math.random() * allWords.length)]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const word = wordData.english.toUpperCase();
  const wrongGuesses = [...guessed].filter(l => !word.includes(l));
  const wrongCount = wrongGuesses.length;
  const isWon = word.split('').every(l => guessed.has(l));
  const isLost = wrongCount >= MAX_WRONG;
  const isOver = isWon || isLost;

  const handleGuess = useCallback((letter: string) => {
    if (isOver || guessed.has(letter)) return;
    setGuessed(prev => new Set([...prev, letter]));
  }, [isOver, guessed]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const l = e.key.toUpperCase();
      if (/^[A-Z]$/.test(l)) handleGuess(l);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleGuess]);

  useEffect(() => {
    if (isWon) setScore(s => s + 1);
  }, [isWon]);

  function nextWord() {
    setWordData(allWords[Math.floor(Math.random() * allWords.length)]);
    setGuessed(new Set());
    setRound(r => r + 1);
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[var(--color-primary)]">← უკან</button>
        <h2 className="text-xl font-bold">🎯 ჰენგმენი</h2>
        <div className="text-sm text-[var(--color-text-muted)]">{score}/{round}</div>
      </div>

      {/* Hint */}
      <div className="text-center mb-2">
        <span className="text-sm text-[var(--color-text-muted)]">მინიშნება: </span>
        <span className="text-sm font-medium text-[var(--color-primary)]">{wordData.georgian}</span>
      </div>

      <HangmanSvg wrongCount={wrongCount} />

      {/* Word display */}
      <div className="flex justify-center gap-2 my-4 flex-wrap">
        {word.split('').map((letter, i) => (
          <div key={i} className="w-8 h-10 border-b-2 border-[var(--color-primary)] flex items-center justify-center text-xl font-bold">
            {guessed.has(letter) || isLost ? (
              <span className={isLost && !guessed.has(letter) ? 'text-red-400' : ''}>{letter}</span>
            ) : ''}
          </div>
        ))}
      </div>

      {/* Wrong guesses remaining */}
      <div className="text-center text-sm text-[var(--color-text-muted)] mb-3">
        დარჩენილი ცდა: {MAX_WRONG - wrongCount}
      </div>

      {/* Result */}
      {isOver && (
        <div className={`text-center p-4 rounded-xl mb-4 ${isWon ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
          <div className="text-2xl mb-1">{isWon ? '🎉 გილოცავ!' : '😢 წააგე!'}</div>
          <div className="text-sm">
            {wordData.english} = {wordData.georgian}
          </div>
          {wordData.pronunciation && (
            <div className="text-xs text-[var(--color-text-muted)] mt-1">[{wordData.pronunciation}]</div>
          )}
          <button onClick={nextWord} className="mt-3 px-6 py-2 bg-[var(--color-primary)] text-black rounded-full font-bold">
            შემდეგი სიტყვა →
          </button>
        </div>
      )}

      {/* Keyboard */}
      {!isOver && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {alphabet.map(letter => {
            const used = guessed.has(letter);
            const isWrong = used && !word.includes(letter);
            const isCorrect = used && word.includes(letter);
            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={used}
                className={`w-9 h-9 rounded-lg font-bold text-sm transition-all
                  ${isCorrect ? 'bg-green-600 text-white' : ''}
                  ${isWrong ? 'bg-red-900/50 text-red-400 opacity-50' : ''}
                  ${!used ? 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] active:scale-95' : ''}
                `}
              >
                {letter}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
