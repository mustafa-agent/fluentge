import { useState } from 'react';

interface Verb {
  base: string;
  past: string;
  participle: string;
  ka: string;
  example: string;
}

const verbs: Verb[] = [
  { base: 'go', past: 'went', participle: 'gone', ka: 'წასვლა', example: 'I went to the store yesterday.' },
  { base: 'eat', past: 'ate', participle: 'eaten', ka: 'ჭამა', example: 'She has eaten lunch already.' },
  { base: 'drink', past: 'drank', participle: 'drunk', ka: 'დალევა', example: 'He drank water after running.' },
  { base: 'write', past: 'wrote', participle: 'written', ka: 'წერა', example: 'I have written three letters.' },
  { base: 'speak', past: 'spoke', participle: 'spoken', ka: 'ლაპარაკი', example: 'She spoke English fluently.' },
  { base: 'take', past: 'took', participle: 'taken', ka: 'აღება', example: 'He took the bus to work.' },
  { base: 'give', past: 'gave', participle: 'given', ka: 'მიცემა', example: 'She gave me a gift.' },
  { base: 'see', past: 'saw', participle: 'seen', ka: 'ნახვა', example: 'I have seen that movie twice.' },
  { base: 'buy', past: 'bought', participle: 'bought', ka: 'ყიდვა', example: 'They bought a new car.' },
  { base: 'think', past: 'thought', participle: 'thought', ka: 'ფიქრი', example: 'I thought about it all day.' },
  { base: 'bring', past: 'brought', participle: 'brought', ka: 'მოტანა', example: 'She brought flowers to the party.' },
  { base: 'teach', past: 'taught', participle: 'taught', ka: 'სწავლება', example: 'He taught math for 10 years.' },
  { base: 'catch', past: 'caught', participle: 'caught', ka: 'დაჭერა', example: 'The dog caught the ball.' },
  { base: 'feel', past: 'felt', participle: 'felt', ka: 'გრძნობა', example: 'I felt happy after the news.' },
  { base: 'find', past: 'found', participle: 'found', ka: 'პოვნა', example: 'She found her keys under the table.' },
  { base: 'know', past: 'knew', participle: 'known', ka: 'ცოდნა', example: 'I knew the answer immediately.' },
  { base: 'make', past: 'made', participle: 'made', ka: 'გაკეთება', example: 'She made a delicious cake.' },
  { base: 'run', past: 'ran', participle: 'run', ka: 'სირბილი', example: 'He ran five kilometers today.' },
  { base: 'sing', past: 'sang', participle: 'sung', ka: 'სიმღერა', example: 'They sang together at the concert.' },
  { base: 'swim', past: 'swam', participle: 'swum', ka: 'ცურვა', example: 'We swam in the lake all summer.' },
  { base: 'begin', past: 'began', participle: 'begun', ka: 'დაწყება', example: 'The movie has already begun.' },
  { base: 'break', past: 'broke', participle: 'broken', ka: 'გატეხვა', example: 'He broke the window by accident.' },
  { base: 'choose', past: 'chose', participle: 'chosen', ka: 'არჩევა', example: 'She chose the red dress.' },
  { base: 'drive', past: 'drove', participle: 'driven', ka: 'მართვა', example: 'He drove to the airport.' },
  { base: 'fly', past: 'flew', participle: 'flown', ka: 'ფრენა', example: 'The bird flew over the house.' },
  { base: 'forget', past: 'forgot', participle: 'forgotten', ka: 'დავიწყება', example: 'I forgot my password again.' },
  { base: 'grow', past: 'grew', participle: 'grown', ka: 'ზრდა', example: 'The flowers grew quickly in spring.' },
  { base: 'hide', past: 'hid', participle: 'hidden', ka: 'დამალვა', example: 'The cat hid under the bed.' },
  { base: 'lose', past: 'lost', participle: 'lost', ka: 'დაკარგვა', example: 'I lost my phone at the park.' },
  { base: 'wear', past: 'wore', participle: 'worn', ka: 'ჩაცმა', example: 'She wore a beautiful dress.' },
];

type Mode = 'learn' | 'quiz';
type QuizType = 'past' | 'participle' | 'base';

export default function IrregularVerbs({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('learn');
  const [learnIdx, setLearnIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [quizVerbs, setQuizVerbs] = useState<Verb[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [qType, setQType] = useState<QuizType>('past');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);

  function startQuiz() {
    const shuffled = [...verbs].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizVerbs(shuffled);
    setQIdx(0);
    setScore(0);
    setTotal(0);
    setDone(false);
    setFeedback(null);
    setAnswer('');
    setMode('quiz');
    setQType(['past', 'participle', 'base'][Math.floor(Math.random() * 3)] as QuizType);
  }

  function checkAnswer() {
    const v = quizVerbs[qIdx];
    const correct = qType === 'past' ? v.past : qType === 'participle' ? v.participle : v.base;
    if (answer.trim().toLowerCase() === correct.toLowerCase()) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('wrong');
    }
    setTotal(t => t + 1);
  }

  function nextQuestion() {
    if (qIdx + 1 >= quizVerbs.length) {
      setDone(true);
    } else {
      setQIdx(qIdx + 1);
      setAnswer('');
      setFeedback(null);
      setQType(['past', 'participle', 'base'][Math.floor(Math.random() * 3)] as QuizType);
    }
  }

  const v = mode === 'learn' ? verbs[learnIdx] : quizVerbs[qIdx];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
      <h2 className="text-2xl font-bold mb-4">🔀 არაწესიერი ზმნები</h2>

      {mode === 'learn' && (
        <>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode('learn')} className="px-3 py-1 bg-[var(--color-primary)] text-black rounded-lg text-sm font-bold">სწავლა</button>
            <button onClick={startQuiz} className="px-3 py-1 bg-[var(--color-bg-card)] rounded-lg text-sm">ქვიზი</button>
          </div>

          <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4">
            <div className="text-sm text-[var(--color-text-muted)] mb-1">{learnIdx + 1} / {verbs.length}</div>
            <div className="text-lg text-[var(--color-text-muted)] mb-2">{v.ka}</div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-[var(--color-text-muted)]">
                  <th className="pb-2">Base</th>
                  <th className="pb-2">Past</th>
                  <th className="pb-2">Past Participle</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-xl font-bold">
                  <td className="text-[var(--color-primary)]">{v.base}</td>
                  <td>{revealed ? v.past : <button onClick={() => setRevealed(true)} className="text-[var(--color-primary)]/50 text-base">👁 აჩვენე</button>}</td>
                  <td>{revealed ? v.participle : '•••'}</td>
                </tr>
              </tbody>
            </table>
            {revealed && (
              <div className="mt-4 p-3 bg-black/20 rounded-lg text-sm italic">
                "{v.example}"
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setLearnIdx(Math.max(0, learnIdx - 1)); setRevealed(false); }}
              disabled={learnIdx === 0}
              className="flex-1 py-3 bg-[var(--color-bg-card)] rounded-xl disabled:opacity-30"
            >← წინა</button>
            <button
              onClick={() => { setLearnIdx(Math.min(verbs.length - 1, learnIdx + 1)); setRevealed(false); }}
              disabled={learnIdx === verbs.length - 1}
              className="flex-1 py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold disabled:opacity-30"
            >შემდეგი →</button>
          </div>
        </>
      )}

      {mode === 'quiz' && !done && v && (
        <>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode('learn')} className="px-3 py-1 bg-[var(--color-bg-card)] rounded-lg text-sm">სწავლა</button>
            <button className="px-3 py-1 bg-[var(--color-primary)] text-black rounded-lg text-sm font-bold">ქვიზი</button>
          </div>

          <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4">
            <div className="text-sm text-[var(--color-text-muted)] mb-2">{qIdx + 1} / {quizVerbs.length}</div>
            <div className="text-lg mb-1">{v.ka}</div>
            <div className="text-sm text-[var(--color-text-muted)] mb-4">
              {qType === 'past' && <>დაწერე <strong>Past</strong> ფორმა: <span className="text-[var(--color-primary)]">{v.base}</span></>}
              {qType === 'participle' && <>დაწერე <strong>Past Participle</strong>: <span className="text-[var(--color-primary)]">{v.base}</span></>}
              {qType === 'base' && <>დაწერე <strong>Base</strong> ფორმა. Past: <span className="text-[var(--color-primary)]">{v.past}</span></>}
            </div>

            <input
              type="text"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !feedback && checkAnswer()}
              placeholder="ჩაწერე პასუხი..."
              className="w-full p-3 rounded-lg bg-black/30 text-white text-lg outline-none"
              disabled={!!feedback}
              autoFocus
            />

            {feedback === 'correct' && (
              <div className="mt-3 p-3 bg-green-500/20 text-green-400 rounded-lg">
                ✅ სწორია! {v.base} → {v.past} → {v.participle}
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="mt-3 p-3 bg-red-500/20 text-red-400 rounded-lg">
                ❌ პასუხი: <strong>{qType === 'past' ? v.past : qType === 'participle' ? v.participle : v.base}</strong>
                <div className="text-xs mt-1">{v.base} → {v.past} → {v.participle}</div>
              </div>
            )}
          </div>

          {!feedback ? (
            <button onClick={checkAnswer} className="w-full py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold">
              შეამოწმე
            </button>
          ) : (
            <button onClick={nextQuestion} className="w-full py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold">
              შემდეგი →
            </button>
          )}
        </>
      )}

      {mode === 'quiz' && done && (
        <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">{score >= 8 ? '🏆' : score >= 5 ? '👍' : '📚'}</div>
          <div className="text-2xl font-bold mb-2">{score} / {total}</div>
          <div className="text-[var(--color-text-muted)] mb-4">
            {score >= 8 ? 'შესანიშნავი! 🎉' : score >= 5 ? 'კარგი შედეგი!' : 'გააგრძელე ვარჯიში!'}
          </div>
          <button onClick={startQuiz} className="px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold">
            თავიდან 🔄
          </button>
        </div>
      )}
    </div>
  );
}
