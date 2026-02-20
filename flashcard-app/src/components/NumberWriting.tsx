import { useState, useMemo } from 'react';

interface NumberQ {
  num: number;
  word: string;
  georgian: string;
}

const ALL_NUMBERS: NumberQ[] = [
  { num: 1, word: 'one', georgian: 'ერთი' },
  { num: 2, word: 'two', georgian: 'ორი' },
  { num: 3, word: 'three', georgian: 'სამი' },
  { num: 5, word: 'five', georgian: 'ხუთი' },
  { num: 7, word: 'seven', georgian: 'შვიდი' },
  { num: 8, word: 'eight', georgian: 'რვა' },
  { num: 11, word: 'eleven', georgian: 'თერთმეტი' },
  { num: 12, word: 'twelve', georgian: 'თორმეტი' },
  { num: 13, word: 'thirteen', georgian: 'ცამეტი' },
  { num: 15, word: 'fifteen', georgian: 'თხუთმეტი' },
  { num: 20, word: 'twenty', georgian: 'ოცი' },
  { num: 21, word: 'twenty-one', georgian: 'ოცდაერთი' },
  { num: 30, word: 'thirty', georgian: 'ოცდაათი' },
  { num: 40, word: 'forty', georgian: 'ორმოცი' },
  { num: 50, word: 'fifty', georgian: 'ორმოცდაათი' },
  { num: 60, word: 'sixty', georgian: 'სამოცი' },
  { num: 70, word: 'seventy', georgian: 'სამოცდაათი' },
  { num: 80, word: 'eighty', georgian: 'ოთხმოცი' },
  { num: 90, word: 'ninety', georgian: 'ოთხმოცდაათი' },
  { num: 100, word: 'one hundred', georgian: 'ასი' },
  { num: 99, word: 'ninety-nine', georgian: 'ოთხმოცდაცხრამეტი' },
  { num: 44, word: 'forty-four', georgian: 'ორმოცდაოთხი' },
  { num: 55, word: 'fifty-five', georgian: 'ორმოცდათხუთმეტი' },
  { num: 16, word: 'sixteen', georgian: 'თექვსმეტი' },
  { num: 18, word: 'eighteen', georgian: 'თვრამეტი' },
  { num: 33, word: 'thirty-three', georgian: 'ოცდაცამეტი' },
  { num: 67, word: 'sixty-seven', georgian: 'სამოცდაშვიდი' },
  { num: 75, word: 'seventy-five', georgian: 'სამოცდათხუთმეტი' },
  { num: 200, word: 'two hundred', georgian: 'ორასი' },
  { num: 1000, word: 'one thousand', georgian: 'ერთი ათასი' },
];

function generateQuestions(): NumberQ[] {
  return [...ALL_NUMBERS].sort(() => Math.random() - 0.5).slice(0, 12);
}

export default function NumberWriting({ onBack }: { onBack: () => void }) {
  const questions = useMemo(generateQuestions, []);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  function normalize(s: string) {
    return s.toLowerCase().replace(/[-–—]/g, '-').replace(/\s+/g, ' ').trim();
  }

  function check() {
    if (normalize(input) === normalize(q.word)) {
      setScore(s => s + 1);
    }
    setShowAnswer(true);
  }

  function next() {
    if (idx + 1 >= questions.length) {
      setDone(true);
    } else {
      setIdx(i => i + 1);
      setInput('');
      setShowAnswer(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">🔢 რიცხვები — შედეგი</h2>
        <div className="text-5xl font-bold text-[var(--color-primary)] mb-4">{score}/{questions.length}</div>
        <p className="text-[var(--color-text-muted)] mb-6">
          {score >= 10 ? 'შესანიშნავი! 🎉' : score >= 7 ? 'კარგია! 👍' : 'კიდევ ივარჯიშე! 💪'}
        </p>
        <button onClick={onBack} className="px-6 py-3 bg-[var(--color-primary)] text-black font-bold rounded-xl">
          უკან
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)]">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">{idx + 1}/{questions.length}</span>
        <span className="text-sm font-bold text-[var(--color-primary)]">✓ {score}</span>
      </div>

      <h2 className="text-xl font-bold text-center mb-2">🔢 დაწერე რიცხვი სიტყვებით</h2>
      <p className="text-center text-sm text-[var(--color-text-muted)] mb-6">Write the number in English words</p>

      <div className="text-center text-6xl font-bold text-[var(--color-primary)] mb-2">{q.num}</div>
      <div className="text-center text-sm text-[var(--color-text-muted)] mb-6">ქართულად: {q.georgian}</div>

      {!showAnswer ? (
        <div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && input.trim() && check()}
            placeholder="e.g. forty-two"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-center text-lg mb-4"
            autoFocus
          />
          <button onClick={check} disabled={!input.trim()} className="w-full py-3 bg-[var(--color-primary)] text-black font-bold rounded-xl disabled:opacity-40">
            შემოწმება
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className={`text-lg font-bold mb-2 ${normalize(input) === normalize(q.word) ? 'text-green-400' : 'text-red-400'}`}>
            {normalize(input) === normalize(q.word) ? '✅ სწორია!' : '❌ არასწორია'}
          </div>
          <div className="bg-white/5 p-3 rounded-xl mb-3">
            <div className="text-[var(--color-primary)] font-bold text-xl">{q.word}</div>
          </div>
          <button onClick={next} className="w-full py-3 bg-[var(--color-primary)] text-black font-bold rounded-xl">
            {idx + 1 >= questions.length ? 'შედეგი' : 'შემდეგი →'}
          </button>
        </div>
      )}
    </div>
  );
}
