import { useState } from 'react';

interface Challenge {
  wrong: string;
  correct: string;
  hintKa: string;
  ruleKa: string;
}

const challenges: Challenge[] = [
  { wrong: "She don't like coffee.", correct: "She doesn't like coffee.", hintKa: "მესამე პირი მხოლობითში", ruleKa: "He/She/It + doesn't (არა don't)" },
  { wrong: "I have went to school.", correct: "I have gone to school.", hintKa: "Present Perfect-ის ფორმა", ruleKa: "Have/Has + past participle: gone (არა went)" },
  { wrong: "He is more taller than me.", correct: "He is taller than me.", hintKa: "შედარებითი ხარისხი", ruleKa: "მოკლე ზედსართავებთან: taller (არა more taller)" },
  { wrong: "I am agree with you.", correct: "I agree with you.", hintKa: "ზმნის ფორმა", ruleKa: "Agree ზმნაა — am არ სჭირდება" },
  { wrong: "She can to swim.", correct: "She can swim.", hintKa: "მოდალური ზმნა", ruleKa: "Can-ის შემდეგ to არ იწერება" },
  { wrong: "I have many informations.", correct: "I have a lot of information.", hintKa: "უთვლადი არსებითი", ruleKa: "Information უთვლადია — მრავლობითი არ აქვს" },
  { wrong: "He goed to the store.", correct: "He went to the store.", hintKa: "არარეგულარული ზმნა", ruleKa: "Go → went (არა goed)" },
  { wrong: "I didn't saw the movie.", correct: "I didn't see the movie.", hintKa: "უარყოფითი წარსული", ruleKa: "Didn't + base form: see (არა saw)" },
  { wrong: "She is more beautiful than her sister.", correct: "She is more beautiful than her sister.", hintKa: "ეს სწორია!", ruleKa: "გრძელ ზედსართავებთან more + adjective სწორია ✅" },
  { wrong: "Me and him went to the park.", correct: "He and I went to the park.", hintKa: "სუბიექტის ფორმა", ruleKa: "სუბიექტში: I (არა me), He (არა him)" },
  { wrong: "I am studying English since 2 years.", correct: "I have been studying English for 2 years.", hintKa: "დროის გამოსახვა", ruleKa: "Since + კონკრეტული დრო, For + პერიოდი. Present Perfect Continuous" },
  { wrong: "There is many people in the park.", correct: "There are many people in the park.", hintKa: "მრავლობითი რიცხვი", ruleKa: "People მრავლობითია → are (არა is)" },
  { wrong: "I must to go now.", correct: "I must go now.", hintKa: "მოდალური ზმნა", ruleKa: "Must-ის შემდეგ to არ იწერება" },
  { wrong: "She said me to come.", correct: "She told me to come.", hintKa: "Said vs Told", ruleKa: "Tell + person: She told me. Say: She said to come." },
  { wrong: "I'm interesting in music.", correct: "I'm interested in music.", hintKa: "-ed vs -ing", ruleKa: "Interested = შენ გრძნობ. Interesting = რაღაც საინტერესოა" },
  { wrong: "He always is late.", correct: "He is always late.", hintKa: "ზმნიზედის ადგილი", ruleKa: "Always/usually/often → be ზმნის შემდეგ" },
  { wrong: "I look forward to meet you.", correct: "I look forward to meeting you.", hintKa: "To + gerund", ruleKa: "Look forward to + -ing (არა base form)" },
  { wrong: "She has less friends than me.", correct: "She has fewer friends than me.", hintKa: "Less vs Fewer", ruleKa: "Fewer = თვლადი (friends). Less = უთვლადი (water)" },
  { wrong: "I've been here since 3 hours.", correct: "I've been here for 3 hours.", hintKa: "Since vs For", ruleKa: "For + პერიოდი (3 hours). Since + მომენტი (since Monday)" },
  { wrong: "Do you can help me?", correct: "Can you help me?", hintKa: "კითხვის ფორმა", ruleKa: "Can → Can you...? (Do არ სჭირდება)" },
  { wrong: "I have 20 years old.", correct: "I am 20 years old.", hintKa: "ასაკის გამოთქმა", ruleKa: "ინგლისურში ასაკს am/is/are-ით ამბობენ (არა have)" },
  { wrong: "She make a cake every Sunday.", correct: "She makes a cake every Sunday.", hintKa: "მესამე პირი", ruleKa: "He/She/It + verb-s: makes (არა make)" },
  { wrong: "I goed to the cinema yesterday.", correct: "I went to the cinema yesterday.", hintKa: "არარეგულარული ზმნა", ruleKa: "Go → went → gone" },
  { wrong: "The childrens are playing.", correct: "The children are playing.", hintKa: "არარეგულარული მრავლობითი", ruleKa: "Child → children (არა childrens)" },
  { wrong: "I'm used to wake up early.", correct: "I'm used to waking up early.", hintKa: "Used to + gerund", ruleKa: "Be used to + -ing = მიჩვეული ვარ" },
  { wrong: "He suggested me to go.", correct: "He suggested that I go.", hintKa: "Suggest-ის სტრუქტურა", ruleKa: "Suggest + (that) + subject + base verb" },
  { wrong: "I catched the ball.", correct: "I caught the ball.", hintKa: "არარეგულარული ზმნა", ruleKa: "Catch → caught → caught" },
  { wrong: "She is boring in class.", correct: "She is bored in class.", hintKa: "-ed vs -ing", ruleKa: "Bored = ის გრძნობს. Boring = რაღაც მოსაბეზრებელია" },
  { wrong: "I have a good news.", correct: "I have good news.", hintKa: "უთვლადი არსებითი", ruleKa: "News უთვლადია — a/an არ სჭირდება" },
  { wrong: "Where do you come from?", correct: "Where do you come from?", hintKa: "ეს სწორია!", ruleKa: "ეს სწორი წინადადებაა ✅ ყოველთვის არ არის შეცდომა!" },
];

export default function SentenceCorrection({ onBack }: { onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const ch = challenges[idx];

  function normalize(s: string) {
    return s.trim().toLowerCase().replace(/['']/g, "'").replace(/\s+/g, ' ');
  }

  function check() {
    if (!input.trim()) return;
    const isCorrect = normalize(input) === normalize(ch.correct);
    if (isCorrect) setScore(s => s + 1);
    setAnswered(a => a + 1);
    setShowResult(true);
  }

  function next() {
    setIdx((idx + 1) % challenges.length);
    setInput('');
    setShowResult(false);
    setShowHint(false);
  }

  const isCorrect = normalize(input) === normalize(ch.correct);
  const isFinished = answered >= challenges.length;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-green-500 text-3xl font-bold mb-2">დასრულდა!</h2>
        <p className="text-xl mb-6">{score}/{challenges.length} სწორი</p>
        <div className="flex gap-3">
          <button onClick={() => { setIdx(0); setScore(0); setAnswered(0); setShowResult(false); setInput(''); }} className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl border-b-4 border-green-600 active:border-b-2 active:mt-0.5 text-base">🔄 თავიდან</button>
          <button onClick={onBack} className="px-6 py-3 bg-[var(--color-bg-card)] text-[var(--color-text)] border border-[var(--color-border,rgba(255,255,255,0.1))] rounded-xl text-base">🏠 მენიუ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="bg-[var(--color-bg-card)] text-[var(--color-text-muted)] border-none rounded-lg px-4 py-2 cursor-pointer">← უკან</button>
        <span className="text-[var(--color-text-muted)] text-sm">{idx + 1}/{challenges.length} | ✅ {score}</span>
      </div>

      <h2 className="text-center text-amber-500 text-xl font-bold my-3">✏️ გაასწორე წინადადება</h2>
      <p className="text-center text-[var(--color-text-muted)] text-sm mb-5">იპოვე შეცდომა და ჩაწერე სწორი ვარიანტი</p>

      <div className="bg-[var(--color-bg-card)] border-2 border-amber-500 rounded-2xl p-5 mb-4 text-center">
        <p className="text-xl font-semibold leading-relaxed">"{ch.wrong}"</p>
      </div>

      {!showHint && !showResult && (
        <button onClick={() => setShowHint(true)} className="block mx-auto mb-4 bg-transparent text-amber-500 border border-amber-500 rounded-lg px-4 py-1.5 cursor-pointer text-sm">💡 მინიშნება</button>
      )}

      {showHint && !showResult && (
        <p className="text-center text-amber-500 text-sm mb-4">💡 {ch.hintKa}</p>
      )}

      {!showResult ? (
        <div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="ჩაწერე სწორი წინადადება..."
            className="w-full p-3.5 text-base bg-[var(--color-bg)] text-[var(--color-text)] border-2 border-[var(--color-border,rgba(255,255,255,0.1))] rounded-xl mb-3 box-border focus:border-amber-500 focus:outline-none transition-colors"
            autoFocus
          />
          <button onClick={check} className="w-full p-3.5 bg-green-500 text-white border-none border-b-4 border-green-600 rounded-xl text-base font-bold cursor-pointer active:border-b-2 active:mt-0.5">შეამოწმე ✓</button>
        </div>
      ) : (
        <div className={`rounded-2xl p-5 mb-4 border-2 ${isCorrect ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
          <p className="text-2xl text-center mb-2">{isCorrect ? '✅ სწორია!' : '❌ არასწორია'}</p>
          {!isCorrect && (
            <div className="mb-3">
              <p className="text-[var(--color-text-muted)] text-sm mb-1">შენი პასუხი:</p>
              <p className="text-red-400 text-base">"{input}"</p>
              <p className="text-[var(--color-text-muted)] text-sm mb-1 mt-2">სწორი პასუხი:</p>
              <p className="text-green-400 text-base">"{ch.correct}"</p>
            </div>
          )}
          <div className="bg-[var(--color-bg)] rounded-lg p-3 mt-2">
            <p className="text-amber-500 text-sm font-semibold mb-1">📖 წესი:</p>
            <p className="text-[var(--color-text-muted)] text-sm">{ch.ruleKa}</p>
          </div>
          <button onClick={next} className="w-full mt-4 p-3.5 bg-blue-500 text-white border-none border-b-4 border-blue-600 rounded-xl text-base font-bold cursor-pointer active:border-b-2 active:mt-0.5">შემდეგი →</button>
        </div>
      )}
    </div>
  );
}
