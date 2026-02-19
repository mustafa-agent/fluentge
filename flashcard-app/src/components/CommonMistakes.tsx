import { useState } from 'react';

interface Mistake {
  wrong: string;
  correct: string;
  rule: string;
  ruleKa: string;
  tip: string;
}

const mistakes: Mistake[] = [
  { wrong: 'I am agree with you.', correct: 'I agree with you.', rule: '"Agree" is a verb, not adjective. No "am" needed.', ruleKa: '"Agree" ზმნაა, არა ზედსართავი. "Am" არ სჭირდება.', tip: '✅ I agree / I disagree' },
  { wrong: 'He is more taller than me.', correct: 'He is taller than me.', rule: 'Don\'t use "more" with -er comparatives.', ruleKa: 'ნუ გამოიყენებ "more"-ს "-er" შედარებით ხარისხთან ერთად.', tip: '✅ taller, NOT more taller' },
  { wrong: 'I have 20 years.', correct: 'I am 20 years old.', rule: 'In English, use "be" for age, not "have".', ruleKa: 'ინგლისურში ასაკისთვის "be" გამოიყენე, არა "have".', tip: '✅ I am 20 / She is 25' },
  { wrong: 'I am boring.', correct: 'I am bored.', rule: '-ED = how you feel. -ING = what causes the feeling.', ruleKa: '-ED = როგორ გრძნობ. -ING = რა იწვევს გრძნობას.', tip: '✅ I am bored (მობეზრდა). The movie is boring (საბეზრებელია).' },
  { wrong: 'He don\'t like coffee.', correct: 'He doesn\'t like coffee.', rule: 'Third person singular (he/she/it) uses "doesn\'t".', ruleKa: 'მესამე პირში (he/she/it) "doesn\'t" გამოიყენე.', tip: '✅ He doesn\'t / She doesn\'t / It doesn\'t' },
  { wrong: 'I went to there.', correct: 'I went there.', rule: '"There" is an adverb. No "to" needed.', ruleKa: '"There" ზმნიზედაა. "To" არ სჭირდება.', tip: '✅ Go there / Come here (not "to there" / "to here")' },
  { wrong: 'I must to go.', correct: 'I must go.', rule: 'After modal verbs (must, can, should), no "to".', ruleKa: 'მოდალური ზმნების შემდეგ (must, can, should) "to" არ იწერება.', tip: '✅ I must go / I can swim / You should study' },
  { wrong: 'I am interesting in music.', correct: 'I am interested in music.', rule: 'Use -ED for your feelings about something.', ruleKa: 'შენი გრძნობისთვის -ED გამოიყენე.', tip: '✅ interested in / excited about / surprised by' },
  { wrong: 'The informations are correct.', correct: 'The information is correct.', rule: '"Information" is uncountable. No plural form.', ruleKa: '"Information" უთვლადი არსებითია. მრავლობითი არ აქვს.', tip: '✅ Also: advice, furniture, homework, news' },
  { wrong: 'I very like it.', correct: 'I like it very much.', rule: '"Very" can\'t come before a verb. Use "very much" after.', ruleKa: '"Very" ზმნის წინ არ დგება. "Very much" ზმნის შემდეგ დაწერე.', tip: '✅ I like it very much / I really like it' },
  { wrong: 'Yesterday I go to school.', correct: 'Yesterday I went to school.', rule: 'Past time = past tense verb.', ruleKa: 'წარსული დრო = წარსულის ზმნა.', tip: '✅ Yesterday I went / Last week I studied' },
  { wrong: 'She said me to come.', correct: 'She told me to come.', rule: '"Say" = say something. "Tell" = tell someone.', ruleKa: '"Say" = თქმა. "Tell" = ვინმეს ეუბნები.', tip: '✅ She said hello / She told me hello' },
  { wrong: 'I am working here since 2020.', correct: 'I have been working here since 2020.', rule: 'Use present perfect (continuous) with "since/for".', ruleKa: '"Since/for"-თან present perfect გამოიყენე.', tip: '✅ I have lived here for 5 years' },
  { wrong: 'He suggested me to go.', correct: 'He suggested that I go.', rule: '"Suggest" uses "that + subject + base verb".', ruleKa: '"Suggest" შემდეგ "that + სუბიექტი + ზმნის ძირი".', tip: '✅ She suggested that we leave early' },
  { wrong: 'I have a good news.', correct: 'I have good news.', rule: '"News" is uncountable. No "a" before it.', ruleKa: '"News" უთვლადი სიტყვაა. "A" არ სჭირდება.', tip: '✅ Also: a piece of news / some news' },
  { wrong: 'I will can do it tomorrow.', correct: 'I will be able to do it tomorrow.', rule: 'Can\'t combine two modals. Use "be able to" for future.', ruleKa: 'ორი მოდალური ზმნა ერთად არ იწერება.', tip: '✅ I will be able to / I could do it' },
  { wrong: 'She make me happy.', correct: 'She makes me happy.', rule: 'Third person singular present needs -s.', ruleKa: 'მესამე პირი აწმყოში -s-ით მთავრდება.', tip: '✅ He runs / She plays / It works' },
  { wrong: 'I didn\'t went there.', correct: 'I didn\'t go there.', rule: 'After "didn\'t", use base form (not past tense).', ruleKa: '"Didn\'t"-ის შემდეგ ზმნის ძირი გამოიყენე.', tip: '✅ I didn\'t go / She didn\'t see / They didn\'t know' },
  { wrong: 'He is a honest man.', correct: 'He is an honest man.', rule: '"An" before vowel SOUNDS (honest = "onest").', ruleKa: '"An" ხმოვნის ბგერის წინ (honest = "onest").', tip: '✅ an hour / a university / an umbrella' },
  { wrong: 'Every students passed.', correct: 'Every student passed.', rule: '"Every" always takes a singular noun.', ruleKa: '"Every" ყოველთვის მხოლობითი რიცხვით.', tip: '✅ Every day / Every person / Each student' },
];

interface Props { onBack: () => void; }

export default function CommonMistakes({ onBack }: Props) {
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [current, setCurrent] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizItems] = useState(() => [...mistakes].sort(() => Math.random() - 0.5).slice(0, 10));

  if (mode === 'learn') {
    const m = mistakes[current];
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
        <h2 className="text-xl font-bold mb-2">⚠️ ხშირი შეცდომები</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">{current + 1} / {mistakes.length}</p>

        <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
          <div className="bg-red-600/20 rounded-xl p-3 mb-3">
            <div className="text-xs text-red-400 mb-1">❌ არასწორი:</div>
            <div className="text-lg font-bold text-red-400">{m.wrong}</div>
          </div>
          <div className="bg-green-600/20 rounded-xl p-3 mb-3">
            <div className="text-xs text-green-400 mb-1">✅ სწორი:</div>
            <div className="text-lg font-bold text-green-400">{m.correct}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 mb-2">
            <div className="text-sm mb-1">📏 {m.rule}</div>
            <div className="text-sm text-[var(--color-text-muted)]">{m.ruleKa}</div>
          </div>
          <div className="text-sm text-[var(--color-primary)] mt-2">{m.tip}</div>
        </div>

        <div className="flex gap-3">
          <button disabled={current === 0} onClick={() => setCurrent(c => c - 1)}
            className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] disabled:opacity-30">← წინა</button>
          <button onClick={() => setMode('quiz')} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold">ქვიზი 🧠</button>
          <button disabled={current === mistakes.length - 1} onClick={() => setCurrent(c => c + 1)}
            className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] disabled:opacity-30">შემდეგი →</button>
        </div>
      </div>
    );
  }

  // Quiz: which is correct?
  if (quizIdx >= quizItems.length) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 block">← უკან</button>
        <div className="text-5xl mb-4">{score >= 8 ? '🎉' : score >= 5 ? '👏' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2">შედეგი: {score}/{quizItems.length}</h2>
        <p className="text-[var(--color-text-muted)] mb-6">{score >= 8 ? 'შესანიშნავი!' : score >= 5 ? 'კარგი!' : 'კიდევ ივარჯიშე!'}</p>
        <button onClick={() => { setMode('learn'); setCurrent(0); }} className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold">
          თავიდან
        </button>
      </div>
    );
  }

  const q = quizItems[quizIdx];
  const opts = [q.wrong, q.correct].sort(() => Math.random() - 0.5);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
      <h2 className="text-xl font-bold mb-1">⚠️ ხშირი შეცდომები — ქვიზი</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">{quizIdx + 1}/{quizItems.length} • ✅ {score}</p>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <p className="text-lg font-bold mb-2">რომელია სწორი?</p>
      </div>

      <div className="space-y-3">
        {opts.map((o, i) => {
          const isCorrect = o === q.correct;
          const bg = selected !== null
            ? isCorrect ? 'bg-green-600' : o === selected ? 'bg-red-600' : 'bg-[var(--color-bg-card)]'
            : 'bg-[var(--color-bg-card)]';
          return (
            <button key={i} onClick={() => {
              if (selected) return;
              setSelected(o);
              if (isCorrect) setScore(s => s + 1);
              setTimeout(() => {
                setQuizIdx(qi => qi + 1);
                setSelected(null);
              }, 1200);
            }} className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${bg}`}>
              {o}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 bg-white/5 rounded-xl p-3">
          <div className="text-sm">{q.ruleKa}</div>
          <div className="text-sm text-[var(--color-primary)] mt-1">{q.tip}</div>
        </div>
      )}
    </div>
  );
}
