import { useState } from 'react';

interface PhrasalVerb {
  verb: string;
  meaning: string;
  meaningKa: string;
  example: string;
  exampleKa: string;
}

const phrasalVerbs: PhrasalVerb[] = [
  { verb: 'give up', meaning: 'stop trying', meaningKa: 'დანებება', example: "Don't give up on your dreams.", exampleKa: 'ოცნებებს ნუ დაანებებ თავს.' },
  { verb: 'look after', meaning: 'take care of', meaningKa: 'მოვლა, ზრუნვა', example: 'Can you look after my cat?', exampleKa: 'შეგიძლია ჩემს კატას მოუარო?' },
  { verb: 'turn on', meaning: 'start a device', meaningKa: 'ჩართვა', example: 'Turn on the light, please.', exampleKa: 'გთხოვ, შუქი ჩართე.' },
  { verb: 'turn off', meaning: 'stop a device', meaningKa: 'გამორთვა', example: 'Turn off the TV before bed.', exampleKa: 'ძილის წინ ტელევიზორი გამორთე.' },
  { verb: 'find out', meaning: 'discover information', meaningKa: 'გარკვევა, გაგება', example: 'I need to find out the truth.', exampleKa: 'სიმართლის გარკვევა მჭირდება.' },
  { verb: 'pick up', meaning: 'lift / collect someone', meaningKa: 'აღება / წაყვანა', example: "I'll pick you up at 8.", exampleKa: '8 საათზე წაგიყვან.' },
  { verb: 'put off', meaning: 'postpone', meaningKa: 'გადადება', example: "Don't put off your homework.", exampleKa: 'საშინაო დავალების გადადება ნუ მოგვიანდება.' },
  { verb: 'come across', meaning: 'find by chance', meaningKa: 'შემთხვევით პოვნა', example: 'I came across an old photo.', exampleKa: 'ძველ ფოტოს შემთხვევით წავაწყდი.' },
  { verb: 'break down', meaning: 'stop working / cry', meaningKa: 'გაფუჭება / ატირება', example: 'My car broke down on the highway.', exampleKa: 'მანქანა ავტობანზე გამიფუჭდა.' },
  { verb: 'get along', meaning: 'have a good relationship', meaningKa: 'კარგად გამოსვლა', example: 'Do you get along with your neighbors?', exampleKa: 'მეზობლებთან კარგად ხარ?' },
  { verb: 'run out of', meaning: 'have no more left', meaningKa: 'ამოწურვა', example: 'We ran out of milk.', exampleKa: 'რძე ამოგვეწურა.' },
  { verb: 'look forward to', meaning: 'be excited about future', meaningKa: 'მოუთმენლად ელოდება', example: 'I look forward to meeting you.', exampleKa: 'მოუთმენლად ველოდები შეხვედრას.' },
  { verb: 'set up', meaning: 'organize / establish', meaningKa: 'მოწყობა, დაარსება', example: 'She set up her own business.', exampleKa: 'მან საკუთარი ბიზნესი დააარსა.' },
  { verb: 'work out', meaning: 'exercise / solve', meaningKa: 'ვარჯიში / გადაჭრა', example: 'I work out every morning.', exampleKa: 'ყოველ დილით ვვარჯიშობ.' },
  { verb: 'bring up', meaning: 'mention / raise children', meaningKa: 'ახსენება / აღზრდა', example: "Don't bring up that topic.", exampleKa: 'იმ თემას ნუ ახსენებ.' },
  { verb: 'figure out', meaning: 'understand / solve', meaningKa: 'გარკვევა, გაგება', example: "I can't figure out this problem.", exampleKa: 'ამ პრობლემის გარკვევა არ შემიძლია.' },
  { verb: 'put on', meaning: 'wear clothing', meaningKa: 'ჩაცმა', example: 'Put on your jacket, it\'s cold.', exampleKa: 'ქურთუკი ჩაიცვი, ცივა.' },
  { verb: 'take off', meaning: 'remove clothing / plane leaves', meaningKa: 'გახდა / აფრენა', example: 'Take off your shoes inside.', exampleKa: 'შიგნით ფეხსაცმელი გაიხადე.' },
  { verb: 'go on', meaning: 'continue', meaningKa: 'გაგრძელება', example: 'Please go on with your story.', exampleKa: 'გთხოვ, ამბავი გააგრძელე.' },
  { verb: 'hang out', meaning: 'spend time casually', meaningKa: 'დროის გატარება', example: 'Let\'s hang out this weekend.', exampleKa: 'ამ შაბათ-კვირას ერთად გავატაროთ დრო.' },
  { verb: 'show up', meaning: 'arrive / appear', meaningKa: 'გამოჩენა, მოსვლა', example: 'He didn\'t show up to the meeting.', exampleKa: 'ის შეხვედრაზე არ გამოჩენილა.' },
  { verb: 'give back', meaning: 'return something', meaningKa: 'დაბრუნება', example: 'Give back my book, please.', exampleKa: 'გთხოვ, წიგნი დამიბრუნე.' },
  { verb: 'calm down', meaning: 'become relaxed', meaningKa: 'დამშვიდება', example: 'Calm down, everything is fine.', exampleKa: 'დამშვიდდი, ყველაფერი კარგად არის.' },
  { verb: 'check in', meaning: 'register at hotel/airport', meaningKa: 'რეგისტრაცია', example: 'We need to check in by 3 PM.', exampleKa: '3 საათამდე უნდა დავრეგისტრირდეთ.' },
];

interface Props { onBack: () => void; }

export default function PhrasalVerbs({ onBack }: Props) {
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizItems] = useState(() => [...phrasalVerbs].sort(() => Math.random() - 0.5).slice(0, 12));

  function getOptions(idx: number) {
    const correct = quizItems[idx];
    const others = phrasalVerbs.filter(v => v.verb !== correct.verb).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [correct, ...others].sort(() => Math.random() - 0.5);
    return opts;
  }

  const [options, setOptions] = useState(() => getOptions(0));

  function handleQuizSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (options[idx].verb === quizItems[quizIdx].verb) setScore(s => s + 1);
    setTimeout(() => {
      if (quizIdx + 1 < quizItems.length) {
        const next = quizIdx + 1;
        setQuizIdx(next);
        setOptions(getOptions(next));
        setSelected(null);
      } else {
        setQuizIdx(quizItems.length);
      }
    }, 1200);
  }

  if (mode === 'learn') {
    const v = phrasalVerbs[current];
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
        <h2 className="text-xl font-bold mb-2">🔗 ფრაზული ზმნები</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">{current + 1} / {phrasalVerbs.length}</p>

        <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4">
          <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">{v.verb}</div>
          {revealed ? (
            <>
              <div className="text-lg mb-1">🇬🇧 {v.meaning}</div>
              <div className="text-lg mb-3">🇬🇪 {v.meaningKa}</div>
              <div className="bg-white/5 rounded-xl p-3 mb-2">
                <div className="text-sm">📝 {v.example}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{v.exampleKa}</div>
              </div>
            </>
          ) : (
            <button onClick={() => setRevealed(true)} className="mt-2 bg-[var(--color-primary)] text-white px-6 py-2 rounded-xl font-bold">
              გახსნა 👀
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button disabled={current === 0} onClick={() => { setCurrent(c => c - 1); setRevealed(false); }}
            className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] disabled:opacity-30">← წინა</button>
          <button onClick={() => setMode('quiz')} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold">ქვიზი 🧠</button>
          <button disabled={current === phrasalVerbs.length - 1} onClick={() => { setCurrent(c => c + 1); setRevealed(false); }}
            className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] disabled:opacity-30">შემდეგი →</button>
        </div>
      </div>
    );
  }

  // Quiz mode
  if (quizIdx >= quizItems.length) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 block">← უკან</button>
        <div className="text-5xl mb-4">{score >= 10 ? '🎉' : score >= 7 ? '👏' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2">შედეგი: {score}/{quizItems.length}</h2>
        <p className="text-[var(--color-text-muted)] mb-6">{score >= 10 ? 'შესანიშნავი!' : score >= 7 ? 'კარგი!' : 'კიდევ ივარჯიშე!'}</p>
        <button onClick={() => { setMode('learn'); setCurrent(0); setRevealed(false); }} className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold">
          თავიდან
        </button>
      </div>
    );
  }

  const q = quizItems[quizIdx];
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
      <h2 className="text-xl font-bold mb-1">🔗 ფრაზული ზმნები — ქვიზი</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">{quizIdx + 1}/{quizItems.length} • ✅ {score}</p>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4">
        <p className="text-sm text-[var(--color-text-muted)] mb-2">რას ნიშნავს:</p>
        <div className="text-2xl font-bold text-[var(--color-primary)]">{q.meaning}</div>
        <div className="text-sm text-[var(--color-text-muted)] mt-1">{q.meaningKa}</div>
      </div>

      <div className="space-y-3">
        {options.map((o, i) => {
          const isCorrect = o.verb === q.verb;
          const bg = selected !== null
            ? isCorrect ? 'bg-green-600' : i === selected ? 'bg-red-600' : 'bg-[var(--color-bg-card)]'
            : 'bg-[var(--color-bg-card)]';
          return (
            <button key={i} onClick={() => handleQuizSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${bg}`}>
              {o.verb}
            </button>
          );
        })}
      </div>
    </div>
  );
}
