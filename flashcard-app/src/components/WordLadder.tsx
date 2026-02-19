import { useState } from 'react';

interface Puzzle {
  start: string;
  end: string;
  steps: string[];
  hint: string;
  hintKa: string;
}

const puzzles: Puzzle[] = [
  { start: 'CAT', end: 'DOG', steps: ['CAT','COT','COG','DOG'], hint: 'Change one letter each step', hintKa: 'ყოველ ნაბიჯზე შეცვალე ერთი ასო' },
  { start: 'HOT', end: 'ICE', steps: ['HOT','HIT','HID','AID','AIE','ICE'], hint: 'From hot to cold!', hintKa: 'ცხელიდან ცივამდე!' },
  { start: 'MAN', end: 'BOY', steps: ['MAN','BAN','BAY','BOY'], hint: 'Adult to child', hintKa: 'მოზრდილიდან ბავშვამდე' },
  { start: 'BIG', end: 'TOY', steps: ['BIG','BIG','BOG','BOY','TOY'], hint: 'Size to play', hintKa: 'ზომიდან სათამაშოსკენ' },
  { start: 'SUN', end: 'FUN', steps: ['SUN','FUN'], hint: 'Just one step!', hintKa: 'მხოლოდ ერთი ნაბიჯი!' },
  { start: 'RED', end: 'BED', steps: ['RED','BED'], hint: 'Color to furniture', hintKa: 'ფერიდან ავეჯამდე' },
  { start: 'BAD', end: 'GOD', steps: ['BAD','GAD','GOD'], hint: 'Evil to divine', hintKa: 'ცუდიდან ღვთიურამდე' },
  { start: 'PEN', end: 'PIN', steps: ['PEN','PIN'], hint: 'Writing tool to sharp point', hintKa: 'საწერი კალმიდან ქინძისთავამდე' },
  { start: 'DAY', end: 'SUN', steps: ['DAY','DAN','SAN','SUN'], hint: 'Time to star', hintKa: 'დროიდან ვარსკვლავამდე' },
  { start: 'CUP', end: 'MUG', steps: ['CUP','CUG','MUG'], hint: 'Small to big drink holder', hintKa: 'პატარა ჭიქიდან დიდ ფინჯანამდე' },
];

export default function WordLadder({ onBack }: { onBack: () => void }) {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [userSteps, setUserSteps] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const puzzle = puzzles[puzzleIdx];

  function handleSubmitStep() {
    const word = currentInput.toUpperCase().trim();
    if (word.length !== puzzle.start.length) return;
    
    const prev = userSteps.length === 0 ? puzzle.start : userSteps[userSteps.length - 1];
    // Check only one letter changed
    let diff = 0;
    for (let i = 0; i < word.length; i++) {
      if (word[i] !== prev[i]) diff++;
    }
    if (diff !== 1) return; // must change exactly 1 letter
    
    const newSteps = [...userSteps, word];
    setUserSteps(newSteps);
    setCurrentInput('');
    
    if (word === puzzle.end) {
      setSolved(true);
      setScore(s => s + 1);
    }
  }

  function nextPuzzle() {
    const next = (puzzleIdx + 1) % puzzles.length;
    setPuzzleIdx(next);
    setUserSteps([]);
    setCurrentInput('');
    setSolved(false);
    setShowHint(false);
    setShowAnswer(false);
  }

  function resetPuzzle() {
    setUserSteps([]);
    setCurrentInput('');
    setSolved(false);
    setShowHint(false);
    setShowAnswer(false);
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-primary)]">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">ქულა: {score}/{puzzles.length}</span>
      </div>

      <h2 className="text-2xl font-bold mb-2">🪜 Word Ladder</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">შეცვალე ერთი ასო ყოველ ნაბიჯზე, რომ მიაღწიო სამიზნე სიტყვას</p>

      {/* Puzzle display */}
      <div className="bg-white/5 rounded-2xl p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <div className="text-xs text-[var(--color-text-muted)] mb-1">დასაწყისი</div>
            <div className="text-2xl font-bold text-[var(--color-primary)] tracking-widest">{puzzle.start}</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="text-center">
            <div className="text-xs text-[var(--color-text-muted)] mb-1">სამიზნე</div>
            <div className="text-2xl font-bold text-amber-400 tracking-widest">{puzzle.end}</div>
          </div>
        </div>

        {/* Steps so far */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)] w-6">0.</span>
            <span className="font-mono text-lg tracking-widest">{puzzle.start}</span>
          </div>
          {userSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)] w-6">{i+1}.</span>
              <span className={`font-mono text-lg tracking-widest ${step === puzzle.end ? 'text-[var(--color-primary)]' : ''}`}>{step}</span>
            </div>
          ))}
        </div>

        {!solved && !showAnswer && (
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={e => setCurrentInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleSubmitStep()}
              maxLength={puzzle.start.length}
              placeholder={`${puzzle.start.length} ასო...`}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center font-mono text-lg tracking-widest uppercase focus:outline-none focus:border-[var(--color-primary)]"
            />
            <button onClick={handleSubmitStep} className="bg-[var(--color-primary)] text-black font-bold px-4 rounded-xl">→</button>
          </div>
        )}

        {solved && (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-bold text-[var(--color-primary)]">გამოიცანი! {userSteps.length} ნაბიჯით</div>
          </div>
        )}

        {showAnswer && !solved && (
          <div className="mt-2">
            <div className="text-xs text-[var(--color-text-muted)] mb-1">პასუხი:</div>
            <div className="font-mono text-sm tracking-wider">{puzzle.steps.join(' → ')}</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!showHint && !solved && (
          <button onClick={() => setShowHint(true)} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-sm">
            💡 მინიშნება
          </button>
        )}
        {!solved && !showAnswer && (
          <button onClick={() => setShowAnswer(true)} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-sm">
            👁️ პასუხი
          </button>
        )}
        {!solved && userSteps.length > 0 && (
          <button onClick={resetPuzzle} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-sm">
            🔄 თავიდან
          </button>
        )}
        {(solved || showAnswer) && (
          <button onClick={nextPuzzle} className="flex-1 bg-[var(--color-primary)] text-black font-bold rounded-xl py-3 text-sm">
            შემდეგი →
          </button>
        )}
      </div>

      {showHint && (
        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm">
          <div>💡 {puzzle.hint}</div>
          <div className="text-[var(--color-text-muted)]">{puzzle.hintKa}</div>
        </div>
      )}

      {/* Puzzle selector */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {puzzles.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPuzzleIdx(i); resetPuzzle(); }}
            className={`w-8 h-8 rounded-full text-xs font-bold ${i === puzzleIdx ? 'bg-[var(--color-primary)] text-black' : 'bg-white/10'}`}
          >
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}
