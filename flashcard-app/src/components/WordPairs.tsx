import { useState, useEffect } from 'react';

interface CollocationSet {
  category: string;
  categoryGe: string;
  pairs: { left: string; right: string; georgian: string }[];
}

const collocationSets: CollocationSet[] = [
  {
    category: 'Make vs Do',
    categoryGe: 'Make თუ Do?',
    pairs: [
      { left: 'make', right: 'a decision', georgian: 'გადაწყვეტილების მიღება' },
      { left: 'make', right: 'a mistake', georgian: 'შეცდომის დაშვება' },
      { left: 'make', right: 'money', georgian: 'ფულის შოვნა' },
      { left: 'make', right: 'progress', georgian: 'პროგრესის მიღწევა' },
      { left: 'do', right: 'homework', georgian: 'საშინაო დავალების გაკეთება' },
      { left: 'do', right: 'the dishes', georgian: 'ჭურჭლის დარეცხვა' },
      { left: 'do', right: 'a favor', georgian: 'სიკეთის გაკეთება' },
      { left: 'do', right: 'your best', georgian: 'საუკეთესოს გაკეთება' },
    ]
  },
  {
    category: 'Take',
    categoryGe: 'Take-ის გამოყენება',
    pairs: [
      { left: 'take', right: 'a shower', georgian: 'შხაპის მიღება' },
      { left: 'take', right: 'a photo', georgian: 'ფოტოს გადაღება' },
      { left: 'take', right: 'a break', georgian: 'შესვენება' },
      { left: 'take', right: 'a risk', georgian: 'რისკის გაწევა' },
      { left: 'take', right: 'notes', georgian: 'ჩანაწერის გაკეთება' },
      { left: 'take', right: 'time', georgian: 'დროის დახარჯვა' },
      { left: 'take', right: 'care', georgian: 'ზრუნვა' },
      { left: 'take', right: 'advice', georgian: 'რჩევის მიღება' },
    ]
  },
  {
    category: 'Get',
    categoryGe: 'Get-ის გამოყენება',
    pairs: [
      { left: 'get', right: 'ready', georgian: 'მომზადება' },
      { left: 'get', right: 'married', georgian: 'დაქორწინება' },
      { left: 'get', right: 'lost', georgian: 'დაკარგვა' },
      { left: 'get', right: 'better', georgian: 'გაუმჯობესება' },
      { left: 'get', right: 'a job', georgian: 'სამსახურის შოვნა' },
      { left: 'get', right: 'angry', georgian: 'გაბრაზება' },
      { left: 'get', right: 'dressed', georgian: 'ჩაცმა' },
      { left: 'get', right: 'started', georgian: 'დაწყება' },
    ]
  },
  {
    category: 'Have',
    categoryGe: 'Have-ის გამოყენება',
    pairs: [
      { left: 'have', right: 'fun', georgian: 'გართობა' },
      { left: 'have', right: 'a good time', georgian: 'კარგად დროის გატარება' },
      { left: 'have', right: 'lunch', georgian: 'სადილის მიღება' },
      { left: 'have', right: 'a dream', georgian: 'ოცნების ქონა' },
      { left: 'have', right: 'an idea', georgian: 'იდეის ქონა' },
      { left: 'have', right: 'a problem', georgian: 'პრობლემის ქონა' },
      { left: 'have', right: 'a conversation', georgian: 'საუბარი' },
      { left: 'have', right: 'patience', georgian: 'მოთმინება' },
    ]
  },
  {
    category: 'Adjective + Noun',
    categoryGe: 'ზედსართავი + არსებითი',
    pairs: [
      { left: 'heavy', right: 'rain', georgian: 'ძლიერი წვიმა' },
      { left: 'strong', right: 'coffee', georgian: 'ძლიერი ყავა' },
      { left: 'fast', right: 'food', georgian: 'სწრაფი საჭმელი' },
      { left: 'deep', right: 'sleep', georgian: 'ღრმა ძილი' },
      { left: 'bright', right: 'future', georgian: 'ნათელი მომავალი' },
      { left: 'bitter', right: 'cold', georgian: 'ძლიერი სიცივე' },
      { left: 'broad', right: 'daylight', georgian: 'შუადღის სინათლე' },
      { left: 'high', right: 'speed', georgian: 'მაღალი სიჩქარე' },
    ]
  },
];

export default function WordPairs({ onBack }: { onBack: () => void }) {
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<'learn' | 'match' | 'results'>('learn');
  const [learnIndex, setLearnIndex] = useState(0);
  const [leftOptions, setLeftOptions] = useState<string[]>([]);
  const [rightOptions, setRightOptions] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<[number, number] | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);

  const currentSet = collocationSets[setIndex];
  const pairs = currentSet.pairs;

  useEffect(() => {
    if (phase === 'match') {
      // Shuffle right side
      const rights = pairs.map((p, i) => ({ text: p.right, idx: i }));
      const shuffled = [...rights].sort(() => Math.random() - 0.5);
      setLeftOptions(pairs.map(p => p.left));
      setRightOptions(shuffled.map(s => s.text));
      setSelectedLeft(null);
      setMatched(new Set());
      setWrong(null);
      setAttempts(0);
      setErrors(0);
    }
  }, [phase, setIndex]);

  function handleRightClick(rightIdx: number) {
    if (selectedLeft === null) return;
    const rightText = rightOptions[rightIdx];
    const correctRight = pairs[selectedLeft].right;

    setAttempts(a => a + 1);

    if (rightText === correctRight) {
      setMatched(prev => new Set([...prev, selectedLeft]));
      setSelectedLeft(null);
      setWrong(null);

      if (matched.size + 1 === pairs.length) {
        setTimeout(() => setPhase('results'), 500);
      }
    } else {
      setErrors(e => e + 1);
      setWrong([selectedLeft, rightIdx]);
      setTimeout(() => setWrong(null), 800);
    }
  }

  // Learn phase
  if (phase === 'learn') {
    const pair = pairs[learnIndex];
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
          <span className="text-sm text-[var(--color-text-muted)]">{learnIndex + 1}/{pairs.length}</span>
        </div>

        <h2 className="text-xl font-bold text-center mb-1">🔗 სიტყვების წყვილები</h2>
        <p className="text-center text-[var(--color-primary)] text-sm mb-6">{currentSet.category} — {currentSet.categoryGe}</p>

        <div className="bg-[var(--color-bg-card)] rounded-2xl p-8 text-center mb-4">
          <div className="text-3xl font-bold mb-2">
            <span className="text-[var(--color-primary)]">{pair.left}</span> {pair.right}
          </div>
          <p className="text-[var(--color-text-muted)] text-lg mb-4">{pair.georgian}</p>
        </div>

        <div className="flex gap-3 justify-center">
          {learnIndex > 0 && (
            <button onClick={() => setLearnIndex(i => i - 1)} className="bg-[var(--color-bg-card)] px-4 py-2 rounded-xl">
              ← წინა
            </button>
          )}
          {learnIndex < pairs.length - 1 ? (
            <button onClick={() => setLearnIndex(i => i + 1)} className="bg-[var(--color-primary)] text-black px-6 py-2 rounded-xl font-bold">
              შემდეგი →
            </button>
          ) : (
            <button onClick={() => setPhase('match')} className="bg-[var(--color-primary)] text-black px-6 py-2 rounded-xl font-bold">
              🎮 დაწყვილება!
            </button>
          )}
        </div>

        {/* Set selector */}
        <div className="mt-8">
          <p className="text-xs text-[var(--color-text-muted)] text-center mb-2">კატეგორია:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {collocationSets.map((s, i) => (
              <button
                key={i}
                onClick={() => { setSetIndex(i); setLearnIndex(0); setPhase('learn'); }}
                className={`text-xs px-3 py-1 rounded-full ${i === setIndex ? 'bg-[var(--color-primary)] text-black' : 'bg-[var(--color-bg-card)]'}`}
              >
                {s.category}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results phase
  if (phase === 'results') {
    const accuracy = attempts > 0 ? Math.round(((attempts - errors) / attempts) * 100) : 100;
    return (
      <div className="px-4 py-8 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">{accuracy >= 80 ? '🎉' : '👍'}</div>
        <h2 className="text-2xl font-bold mb-2">{currentSet.category}</h2>
        <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">{accuracy}%</p>
        <p className="text-[var(--color-text-muted)] mb-6">{errors} შეცდომა {attempts} მცდელობიდან</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => { setPhase('match'); }} className="bg-[var(--color-primary)] text-black px-6 py-3 rounded-xl font-bold">
            თავიდან 🔄
          </button>
          {setIndex < collocationSets.length - 1 && (
            <button onClick={() => { setSetIndex(i => i + 1); setLearnIndex(0); setPhase('learn'); }} className="bg-[var(--color-bg-card)] px-6 py-3 rounded-xl">
              შემდეგი კატეგორია →
            </button>
          )}
          <button onClick={onBack} className="bg-[var(--color-bg-card)] px-6 py-3 rounded-xl">
            მთავარი
          </button>
        </div>
      </div>
    );
  }

  // Match phase
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">✅ {matched.size}/{pairs.length}</span>
      </div>

      <h2 className="text-xl font-bold text-center mb-1">🔗 დააწყვილე!</h2>
      <p className="text-center text-[var(--color-text-muted)] text-sm mb-6">{currentSet.category} — აირჩიე მარცხნივ, შემდეგ მარჯვნივ</p>

      <div className="grid grid-cols-2 gap-3">
        {/* Left column */}
        <div className="space-y-2">
          {pairs.map((p, i) => (
            <button
              key={i}
              onClick={() => !matched.has(i) && setSelectedLeft(i)}
              disabled={matched.has(i)}
              className={`w-full py-3 px-3 rounded-xl text-sm font-bold transition-all ${
                matched.has(i)
                  ? 'bg-green-500/20 text-green-400 opacity-60'
                  : selectedLeft === i
                  ? 'bg-[var(--color-primary)] text-black scale-105'
                  : wrong && wrong[0] === i
                  ? 'bg-red-500/30 text-red-400'
                  : 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)]'
              }`}
            >
              {p.left}
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {rightOptions.map((text, i) => {
            const matchedRight = [...matched].some(m => pairs[m].right === text);
            return (
              <button
                key={i}
                onClick={() => !matchedRight && selectedLeft !== null && handleRightClick(i)}
                disabled={matchedRight}
                className={`w-full py-3 px-3 rounded-xl text-sm transition-all ${
                  matchedRight
                    ? 'bg-green-500/20 text-green-400 opacity-60'
                    : wrong && wrong[1] === i
                    ? 'bg-red-500/30 text-red-400'
                    : 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)]'
                }`}
              >
                {text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
