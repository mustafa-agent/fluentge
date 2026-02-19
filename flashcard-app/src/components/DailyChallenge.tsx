import { useState, useEffect } from 'react';

interface ChallengeTask {
  type: 'translate' | 'spell' | 'unscramble' | 'truefalse' | 'fillblank';
  question: string;
  answer: string;
  options?: string[];
  hint?: string;
}

const allTasks: ChallengeTask[] = [
  // Translate English → Georgian meaning (pick correct)
  { type: 'translate', question: 'What does "brave" mean?', answer: 'მამაცი', options: ['მამაცი', 'ბნელი', 'სწრაფი', 'მძიმე'] },
  { type: 'translate', question: 'What does "ancient" mean?', answer: 'უძველესი', options: ['ახალი', 'უძველესი', 'პატარა', 'სწრაფი'] },
  { type: 'translate', question: 'What does "knowledge" mean?', answer: 'ცოდნა', options: ['სიმდიდრე', 'ცოდნა', 'სიმაღლე', 'სიჩქარე'] },
  { type: 'translate', question: 'What does "freedom" mean?', answer: 'თავისუფლება', options: ['ბედნიერება', 'მეგობრობა', 'თავისუფლება', 'სიმართლე'] },
  { type: 'translate', question: 'What does "journey" mean?', answer: 'მოგზაურობა', options: ['დასვენება', 'მოგზაურობა', 'საჩუქარი', 'გამოცდა'] },
  { type: 'translate', question: 'What does "strength" mean?', answer: 'ძალა', options: ['ძალა', 'სიხარული', 'წყალი', 'მიწა'] },
  { type: 'translate', question: 'What does "peaceful" mean?', answer: 'მშვიდობიანი', options: ['საშიში', 'მშვიდობიანი', 'ხმამაღალი', 'ბნელი'] },
  { type: 'translate', question: 'What does "opportunity" mean?', answer: 'შესაძლებლობა', options: ['პრობლემა', 'შესაძლებლობა', 'დაპირება', 'სირთულე'] },

  // Spell
  { type: 'spell', question: 'Type the English word: მეგობარი', answer: 'friend', hint: 'f_i_n_' },
  { type: 'spell', question: 'Type the English word: ბედნიერი', answer: 'happy', hint: 'h_p_y' },
  { type: 'spell', question: 'Type the English word: ლამაზი', answer: 'beautiful', hint: 'b_a_t_f_l' },
  { type: 'spell', question: 'Type the English word: მადლობა', answer: 'thank you', hint: 'th_n_ y_u' },
  { type: 'spell', question: 'Type the English word: ოჯახი', answer: 'family', hint: 'f_m_l_' },
  { type: 'spell', question: 'Type the English word: წიგნი', answer: 'book', hint: 'b_ _k' },

  // Unscramble
  { type: 'unscramble', question: 'Unscramble: "LOSCH"', answer: 'school', hint: 'სკოლა' },
  { type: 'unscramble', question: 'Unscramble: "RETAW"', answer: 'water', hint: 'წყალი' },
  { type: 'unscramble', question: 'Unscramble: "LEPAP"', answer: 'apple', hint: 'ვაშლი' },
  { type: 'unscramble', question: 'Unscramble: "OHSUE"', answer: 'house', hint: 'სახლი' },
  { type: 'unscramble', question: 'Unscramble: "SUMCI"', answer: 'music', hint: 'მუსიკა' },
  { type: 'unscramble', question: 'Unscramble: "NRGMOIN"', answer: 'morning', hint: 'დილა' },

  // True/False
  { type: 'truefalse', question: '"I am agree with you" — correct?', answer: 'false', hint: 'Correct: "I agree with you"' },
  { type: 'truefalse', question: '"She has been living here for 5 years" — correct?', answer: 'true', hint: 'Present perfect continuous ✅' },
  { type: 'truefalse', question: '"He don\'t like coffee" — correct?', answer: 'false', hint: 'Correct: "He doesn\'t like coffee"' },
  { type: 'truefalse', question: '"There are many people in the park" — correct?', answer: 'true', hint: 'Correct use of "there are" + plural ✅' },
  { type: 'truefalse', question: '"I have 25 years old" — correct?', answer: 'false', hint: 'Correct: "I am 25 years old"' },
  { type: 'truefalse', question: '"Would you like some tea?" — correct?', answer: 'true', hint: 'Polite offer with "would you like" ✅' },

  // Fill blank
  { type: 'fillblank', question: 'She ___ to school every day.', answer: 'goes', options: ['goes', 'go', 'going', 'gone'] },
  { type: 'fillblank', question: 'I have ___ finished my homework.', answer: 'already', options: ['yet', 'already', 'still', 'never'] },
  { type: 'fillblank', question: 'They are ___ than us at basketball.', answer: 'better', options: ['good', 'best', 'better', 'well'] },
  { type: 'fillblank', question: 'We ___ watching TV when the lights went out.', answer: 'were', options: ['was', 'were', 'are', 'been'] },
  { type: 'fillblank', question: 'Can you give ___ a glass of water?', answer: 'me', options: ['I', 'me', 'my', 'mine'] },
  { type: 'fillblank', question: 'This is the ___ movie I have ever seen.', answer: 'best', options: ['good', 'better', 'best', 'most good'] },
];

function getDailyTasks(): ChallengeTask[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Seeded shuffle
  let s = seed;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const shuffled = [...allTasks].sort(() => rand() - 0.5);
  return shuffled.slice(0, 7); // 7 tasks per day
}

export default function DailyChallenge({ onBack }: { onBack: () => void }) {
  const [tasks] = useState(getDailyTasks);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  // Load streak from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dailychallenge_streak');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (data.lastDate === today) {
        setStreak(data.streak);
        setDone(true); // Already completed today
        setScore(data.score || 0);
      } else if (data.lastDate === yesterday) {
        setStreak(data.streak);
      } else {
        setStreak(0);
      }
    }
  }, []);

  const task = tasks[current];

  function checkAnswer(answer: string) {
    if (done) return;
    const correct = answer.toLowerCase().trim() === task.answer.toLowerCase().trim();
    setShowResult(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      setShowResult(null);
      setInput('');
      if (current + 1 >= tasks.length) {
        const finalScore = score + (correct ? 1 : 0);
        const newStreak = streak + 1;
        setScore(finalScore);
        setStreak(newStreak);
        setDone(true);
        localStorage.setItem('dailychallenge_streak', JSON.stringify({
          lastDate: new Date().toDateString(),
          streak: newStreak,
          score: finalScore,
        }));
      } else {
        setCurrent(c => c + 1);
      }
    }, 1200);
  }

  if (done) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 hover:text-white">← უკან</button>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{score >= 6 ? '🏆' : score >= 4 ? '⭐' : '💪'}</div>
          <h2 className="text-2xl font-bold mb-2">დღის გამოწვევა დასრულდა!</h2>
          <p className="text-[var(--color-text-muted)] mb-4">Daily Challenge Complete!</p>
          <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">{score}/{tasks.length}</div>
          <div className="flex items-center justify-center gap-2 text-amber-400 mb-6">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-bold">{streak} დღე სერია</span>
            <span className="text-sm text-[var(--color-text-muted)]">({streak} day streak)</span>
          </div>
          <p className="text-[var(--color-text-muted)] text-sm">ხვალ ახალი გამოწვევა გელის!</p>
          <p className="text-[var(--color-text-muted)] text-xs mt-1">New challenge tomorrow!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 hover:text-white">← უკან</button>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">🎯 დღის გამოწვევა</h2>
        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-sm">🔥 {streak}</span>
          <span className="text-[var(--color-text-muted)] text-sm">{current + 1}/{tasks.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[var(--color-bg-card)] rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500" style={{ width: `${(current / tasks.length) * 100}%` }} />
      </div>

      <div className={`bg-[var(--color-bg-card)] rounded-2xl p-6 ${showResult === 'correct' ? 'ring-2 ring-green-500' : showResult === 'wrong' ? 'ring-2 ring-red-500' : ''}`}>
        {/* Task type badge */}
        <div className="text-sm text-[var(--color-text-muted)] mb-3">
          {task.type === 'translate' && '🔄 თარგმნე'}
          {task.type === 'spell' && '✍️ დაწერე'}
          {task.type === 'unscramble' && '🔀 გაშიფრე'}
          {task.type === 'truefalse' && '✅ მართალია თუ არა?'}
          {task.type === 'fillblank' && '📝 შეავსე'}
        </div>

        <p className="text-lg font-semibold mb-4">{task.question}</p>

        {task.hint && task.type !== 'truefalse' && (
          <p className="text-sm text-[var(--color-text-muted)] mb-3">💡 {task.hint}</p>
        )}

        {/* Multiple choice (translate, fillblank) */}
        {(task.type === 'translate' || task.type === 'fillblank') && task.options && (
          <div className="grid grid-cols-2 gap-3">
            {task.options.map(opt => (
              <button
                key={opt}
                onClick={() => checkAnswer(opt)}
                disabled={showResult !== null}
                className={`p-3 rounded-xl text-center font-medium transition-all ${
                  showResult && opt.toLowerCase() === task.answer.toLowerCase()
                    ? 'bg-green-500/30 text-green-400'
                    : showResult === 'wrong' && opt.toLowerCase() === input.toLowerCase()
                    ? 'bg-red-500/30 text-red-400'
                    : 'bg-[var(--color-bg)] hover:bg-white/10'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* True/False */}
        {task.type === 'truefalse' && (
          <div className="flex gap-4">
            <button
              onClick={() => { setInput('true'); checkAnswer('true'); }}
              disabled={showResult !== null}
              className={`flex-1 p-4 rounded-xl text-center font-bold text-lg transition-all ${
                showResult && task.answer === 'true' ? 'bg-green-500/30 text-green-400' :
                showResult === 'wrong' && task.answer !== 'true' ? 'bg-red-500/30 text-red-400' :
                'bg-[var(--color-bg)] hover:bg-white/10'
              }`}
            >✅ True</button>
            <button
              onClick={() => { setInput('false'); checkAnswer('false'); }}
              disabled={showResult !== null}
              className={`flex-1 p-4 rounded-xl text-center font-bold text-lg transition-all ${
                showResult && task.answer === 'false' ? 'bg-green-500/30 text-green-400' :
                showResult === 'wrong' && task.answer !== 'false' ? 'bg-red-500/30 text-red-400' :
                'bg-[var(--color-bg)] hover:bg-white/10'
              }`}
            >❌ False</button>
          </div>
        )}

        {/* Text input (spell, unscramble) */}
        {(task.type === 'spell' || task.type === 'unscramble') && (
          <form onSubmit={(e) => { e.preventDefault(); checkAnswer(input); }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="ჩაწერე პასუხი..."
              disabled={showResult !== null}
              autoFocus
              className="w-full p-3 rounded-xl bg-[var(--color-bg)] border border-white/10 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <button
              type="submit"
              disabled={!input.trim() || showResult !== null}
              className="w-full mt-3 p-3 rounded-xl bg-[var(--color-primary)] text-black font-bold disabled:opacity-50"
            >შეამოწმე</button>
          </form>
        )}

        {/* Show explanation for true/false after answer */}
        {showResult && task.type === 'truefalse' && task.hint && (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">{task.hint}</p>
        )}

        {/* Show correct answer if wrong */}
        {showResult === 'wrong' && (
          <p className="mt-3 text-sm text-red-400">სწორი პასუხი: {task.answer}</p>
        )}
      </div>
    </div>
  );
}
