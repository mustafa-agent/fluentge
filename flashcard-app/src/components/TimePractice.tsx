import { useState, useMemo } from 'react';

interface TimeQuestion {
  hour: number;
  minute: number;
  answer: string;
  georgian: string;
}

function generateQuestions(): TimeQuestion[] {
  const questions: TimeQuestion[] = [
    { hour: 3, minute: 0, answer: "three o'clock", georgian: "სამი საათი" },
    { hour: 7, minute: 0, answer: "seven o'clock", georgian: "შვიდი საათი" },
    { hour: 12, minute: 0, answer: "twelve o'clock", georgian: "თორმეტი საათი" },
    { hour: 1, minute: 30, answer: "one thirty", georgian: "ერთი ოცდაათი / ნახევარი ორის" },
    { hour: 6, minute: 30, answer: "six thirty", georgian: "ექვსი ოცდაათი / ნახევარი შვიდის" },
    { hour: 9, minute: 15, answer: "nine fifteen", georgian: "ცხრა თხუთმეტი" },
    { hour: 2, minute: 45, answer: "two forty-five", georgian: "ორი ორმოცდახუთი" },
    { hour: 8, minute: 10, answer: "eight ten", georgian: "რვა ათი" },
    { hour: 4, minute: 20, answer: "four twenty", georgian: "ოთხი ოცი" },
    { hour: 11, minute: 5, answer: "eleven oh five", georgian: "თერთმეტი ხუთი" },
    { hour: 5, minute: 50, answer: "five fifty", georgian: "ხუთი ორმოცდაათი" },
    { hour: 10, minute: 40, answer: "ten forty", georgian: "ათი ორმოცი" },
    { hour: 1, minute: 0, answer: "one o'clock", georgian: "ერთი საათი" },
    { hour: 6, minute: 15, answer: "six fifteen", georgian: "ექვსი თხუთმეტი" },
    { hour: 3, minute: 45, answer: "three forty-five", georgian: "სამი ორმოცდახუთი" },
    { hour: 8, minute: 30, answer: "eight thirty", georgian: "რვა ოცდაათი" },
    { hour: 12, minute: 30, answer: "twelve thirty", georgian: "თორმეტი ოცდაათი" },
    { hour: 9, minute: 0, answer: "nine o'clock", georgian: "ცხრა საათი" },
    { hour: 7, minute: 25, answer: "seven twenty-five", georgian: "შვიდი ოცდახუთი" },
    { hour: 11, minute: 55, answer: "eleven fifty-five", georgian: "თერთმეტი ორმოცდათხუთმეტი" },
  ];
  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
}

function drawClock(hour: number, minute: number): React.ReactElement {
  const h = ((hour % 12) + minute / 60) * 30;
  const m = minute * 6;
  const hRad = (h - 90) * Math.PI / 180;
  const mRad = (m - 90) * Math.PI / 180;
  
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40 mx-auto">
      <circle cx="100" cy="100" r="90" fill="#1a1a2e" stroke="#22c55e" strokeWidth="3" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 60) * Math.PI / 180;
        const x = 100 + 75 * Math.cos(angle);
        const y = 100 + 75 * Math.sin(angle);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="14" fontWeight="bold">{i + 1}</text>;
      })}
      {/* Hour hand */}
      <line x1="100" y1="100" x2={100 + 45 * Math.cos(hRad)} y2={100 + 45 * Math.sin(hRad)} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1="100" y1="100" x2={100 + 65 * Math.cos(mRad)} y2={100 + 65 * Math.sin(mRad)} stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="4" fill="#22c55e" />
    </svg>
  );
}

export default function TimePractice({ onBack }: { onBack: () => void }) {
  const questions = useMemo(generateQuestions, []);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  function check() {
    const clean = (s: string) => s.toLowerCase().replace(/['']/g, "'").replace(/\s+/g, ' ').trim();
    if (clean(input) === clean(q.answer)) {
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
        <h2 className="text-2xl font-bold mb-4">🕐 დრო — შედეგი</h2>
        <div className="text-5xl font-bold text-[var(--color-primary)] mb-4">{score}/{questions.length}</div>
        <p className="text-[var(--color-text-muted)] mb-6">
          {score >= 8 ? 'შესანიშნავი! 🎉' : score >= 5 ? 'კარგია! 👍' : 'კიდევ ივარჯიშე! 💪'}
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
      
      <h2 className="text-xl font-bold text-center mb-2">🕐 რომელი საათია?</h2>
      <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">დაწერე დრო ინგლისურად</p>
      
      {drawClock(q.hour, q.minute)}
      
      <div className="text-center text-lg font-mono mt-3 mb-4 text-[var(--color-text-muted)]">
        {q.hour.toString().padStart(2, '0')}:{q.minute.toString().padStart(2, '0')}
      </div>

      {!showAnswer ? (
        <div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && input.trim() && check()}
            placeholder="e.g. three o'clock"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-center text-lg mb-4"
            autoFocus
          />
          <button onClick={check} disabled={!input.trim()} className="w-full py-3 bg-[var(--color-primary)] text-black font-bold rounded-xl disabled:opacity-40">
            შემოწმება
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className={`text-lg font-bold mb-2 ${input.toLowerCase().replace(/['']/g, "'").trim() === q.answer ? 'text-green-400' : 'text-red-400'}`}>
            {input.toLowerCase().replace(/['']/g, "'").trim() === q.answer ? '✅ სწორია!' : '❌ არასწორია'}
          </div>
          <div className="bg-white/5 p-3 rounded-xl mb-2">
            <div className="text-[var(--color-primary)] font-bold">{q.answer}</div>
            <div className="text-sm text-[var(--color-text-muted)]">{q.georgian}</div>
          </div>
          <button onClick={next} className="w-full py-3 bg-[var(--color-primary)] text-black font-bold rounded-xl mt-3">
            {idx + 1 >= questions.length ? 'შედეგი' : 'შემდეგი →'}
          </button>
        </div>
      )}
    </div>
  );
}
