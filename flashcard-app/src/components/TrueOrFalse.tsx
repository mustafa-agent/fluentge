import ShareResult from "./ShareResult";
import { useState } from 'react';

interface Question {
  statement: string;
  statementKa: string;
  answer: boolean;
  explanation: string;
  explanationKa: string;
}

const questions: Question[] = [
  { statement: '"I am agree" is correct English.', statementKa: '"I am agree" სწორი ინგლისურია.', answer: false, explanation: 'The correct form is "I agree" without "am".', explanationKa: 'სწორი ფორმაა "I agree" — "am"-ის გარეშე.' },
  { statement: '"Sheep" is both singular and plural.', statementKa: '"Sheep" არის ერთობლივი და მრავლობითი რიცხვი.', answer: true, explanation: 'One sheep, two sheep — the word stays the same.', explanationKa: 'ერთი sheep, ორი sheep — სიტყვა არ იცვლება.' },
  { statement: '"Fun" and "funny" mean the same thing.', statementKa: '"Fun" და "funny" ერთს და იგივეს ნიშნავს.', answer: false, explanation: '"Fun" means enjoyable. "Funny" means it makes you laugh.', explanationKa: '"Fun" ნიშნავს სასიამოვნო. "Funny" ნიშნავს სასაცილო.' },
  { statement: 'The past tense of "go" is "went".', statementKa: '"Go"-ს წარსული დრო არის "went".', answer: true, explanation: 'Go → went → gone. It\'s an irregular verb.', explanationKa: 'Go → went → gone. ეს არარეგულარული ზმნაა.' },
  { statement: '"It\'s" and "its" mean the same thing.', statementKa: '"It\'s" და "its" ერთს ნიშნავს.', answer: false, explanation: '"It\'s" = it is/it has. "Its" = belonging to it (possessive).', explanationKa: '"It\'s" = it is/it has. "Its" = მისი (კუთვნილება).' },
  { statement: '"Information" can be made plural as "informations".', statementKa: '"Information" შეიძლება მრავლობითში "informations" გახდეს.', answer: false, explanation: '"Information" is uncountable. Say "pieces of information".', explanationKa: '"Information" უთვლადი არსებითი სახელია. თქვით "pieces of information".' },
  { statement: 'You can say "I look forward to meet you."', statementKa: 'შეგიძლიათ თქვათ "I look forward to meet you."', answer: false, explanation: 'Correct: "I look forward to meeting you." (to + -ing)', explanationKa: 'სწორია: "I look forward to meeting you." (to + -ing)' },
  { statement: '"Advice" is an uncountable noun in English.', statementKa: '"Advice" უთვლადი არსებითი სახელია ინგლისურში.', answer: true, explanation: 'You can\'t say "an advice" or "advices". Say "a piece of advice".', explanationKa: 'არ შეიძლება "an advice" ან "advices". თქვით "a piece of advice".' },
  { statement: '"I have been to London" means I am in London now.', statementKa: '"I have been to London" ნიშნავს, რომ ახლა ლონდონში ვარ.', answer: false, explanation: 'It means you visited London before but are not there now.', explanationKa: 'ნიშნავს, რომ ლონდონში ყოფილხართ, მაგრამ ახლა იქ არ ხართ.' },
  { statement: 'The word "read" is pronounced differently in past and present tense.', statementKa: 'სიტყვა "read" სხვადასხვანაირად იკითხება წარსულსა და აწმყო დროში.', answer: true, explanation: 'Present: "reed". Past: "red". Same spelling, different pronunciation!', explanationKa: 'აწმყო: "რიდ". წარსული: "რედ". ერთნაირი მართლწერა, სხვადასხვა წარმოთქმა!' },
  { statement: '"Much" is used with countable nouns.', statementKa: '"Much" თვლად არსებით სახელებთან გამოიყენება.', answer: false, explanation: '"Much" is for uncountable (much water). "Many" is for countable (many books).', explanationKa: '"Much" უთვლადისთვის (much water). "Many" თვლადისთვის (many books).' },
  { statement: '"Could" is the past tense of "can".', statementKa: '"Could" არის "can"-ის წარსული დრო.', answer: true, explanation: '"I can swim now" → "I could swim when I was 5."', explanationKa: '"I can swim now" → "I could swim when I was 5."' },
  { statement: 'In English, adjectives come after the noun.', statementKa: 'ინგლისურში ზედსართავი სახელი არსებითის შემდეგ დგას.', answer: false, explanation: 'Adjectives come BEFORE the noun: "big house" not "house big".', explanationKa: 'ზედსართავი არსებითის წინ დგას: "big house" და არა "house big".' },
  { statement: '"I used to play" means I played regularly in the past.', statementKa: '"I used to play" ნიშნავს, რომ წარსულში რეგულარულად ვთამაშობდი.', answer: true, explanation: '"Used to" describes past habits that are no longer true.', explanationKa: '"Used to" აღწერს წარსულ ჩვევებს, რომლებიც აღარ არის სწორი.' },
  { statement: '"Less" and "fewer" can be used interchangeably.', statementKa: '"Less" და "fewer" ურთიერთშემცვლელად შეიძლება გამოყენება.', answer: false, explanation: '"Fewer" for countable (fewer people). "Less" for uncountable (less water).', explanationKa: '"Fewer" თვლადისთვის (fewer people). "Less" უთვლადისთვის (less water).' },
  { statement: '"The" is the most common word in English.', statementKa: '"The" ყველაზე გავრცელებული სიტყვაა ინგლისურში.', answer: true, explanation: '"The" is the most frequently used English word!', explanationKa: '"The" ინგლისურში ყველაზე ხშირად გამოყენებული სიტყვაა!' },
  { statement: '"Borrow" and "lend" mean the same thing.', statementKa: '"Borrow" და "lend" ერთს ნიშნავს.', answer: false, explanation: '"Borrow" = take from someone. "Lend" = give to someone temporarily.', explanationKa: '"Borrow" = ვინმესგან აიღო. "Lend" = ვინმეს დროებით მისცე.' },
  { statement: 'English has no grammatical gender for nouns.', statementKa: 'ინგლისურში არსებით სახელებს გრამატიკული სქესი არ აქვთ.', answer: true, explanation: 'Unlike French or German, English nouns don\'t have gender.', explanationKa: 'ფრანგულისგან ან გერმანულისგან განსხვავებით, ინგლისურ სახელებს სქესი არ აქვთ.' },
  { statement: '"I\'m going to shopping" is correct.', statementKa: '"I\'m going to shopping" სწორია.', answer: false, explanation: 'Correct: "I\'m going shopping" (no "to").', explanationKa: 'სწორია: "I\'m going shopping" ("to"-ს გარეშე).' },
  { statement: 'The letter combination "ough" can be pronounced 7+ different ways.', statementKa: 'ასოთა კომბინაცია "ough" 7+ სხვადასხვა წესით შეიძლება წაიკითხოს.', answer: true, explanation: 'through, though, thought, tough, cough, bough, thorough — all different!', explanationKa: 'through, though, thought, tough, cough, bough, thorough — ყველა განსხვავებული!' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TrueOrFalse({ onBack }: { onBack: () => void }) {
  const [pool] = useState(() => shuffle(questions).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);

  const q = pool[idx];

  function handleAnswer(choice: boolean) {
    if (answered !== null) return;
    setAnswered(choice);
    if (choice === q.answer) setScore(s => s + 1);
  }

  function handleNext() {
    if (idx + 1 >= pool.length) {
      setDone(true);
    } else {
      setIdx(i => i + 1);
      setAnswered(null);
    }
  }

  if (done) {
    const pct = Math.round((score / pool.length) * 100);
    return (
      <div className="px-4 py-8 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">✅ დასრულდა!</h2>
        <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
        <p className="text-xl mb-2">{score}/{pool.length} სწორი ({pct}%)</p>
        <p className="text-[var(--color-text-muted)] mb-6">
          {pct >= 80 ? 'შესანიშნავი! ძალიან კარგად იცი ინგლისური!' : pct >= 50 ? 'კარგი შედეგია! გააგრძელე სწავლა!' : 'არ დანებდე! პრაქტიკა სრულყოფილებას ქმნის!'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setIdx(0); setScore(0); setAnswered(null); setDone(false); }} className="px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-semibold">თავიდან</button>
          <button onClick={onBack} className="px-6 py-3 bg-[var(--color-bg-card)] rounded-xl">უკან</button>
        </div>
        <ShareResult score={score} total={pool.length} label="მართალი/მცდარი ტესტი" />
      </div>
    );
  }

  const isCorrect = answered === q.answer;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)]">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">{idx + 1}/{pool.length} | ✅ {score}</span>
      </div>

      <h2 className="text-xl font-bold mb-6 text-center">სიმართლე თუ ტყუილი? 🤔</h2>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4">
        <p className="text-lg font-medium mb-2">{q.statement}</p>
        <p className="text-sm text-[var(--color-text-muted)]">{q.statementKa}</p>
      </div>

      {answered === null ? (
        <div className="flex gap-3">
          <button onClick={() => handleAnswer(true)} className="flex-1 py-4 bg-green-600/20 border border-green-500/30 rounded-xl text-lg font-semibold hover:bg-green-600/40 transition-colors">✅ სიმართლე</button>
          <button onClick={() => handleAnswer(false)} className="flex-1 py-4 bg-red-600/20 border border-red-500/30 rounded-xl text-lg font-semibold hover:bg-red-600/40 transition-colors">❌ ტყუილი</button>
        </div>
      ) : (
        <div className={`rounded-2xl p-5 mb-4 ${isCorrect ? 'bg-green-600/20 border border-green-500/30' : 'bg-red-600/20 border border-red-500/30'}`}>
          <p className="text-lg font-bold mb-2">{isCorrect ? '✅ სწორია!' : '❌ არასწორია!'}</p>
          <p className="mb-1">{q.explanation}</p>
          <p className="text-sm text-[var(--color-text-muted)]">{q.explanationKa}</p>
          <button onClick={handleNext} className="mt-4 w-full py-3 bg-[var(--color-primary)] text-black rounded-xl font-semibold">შემდეგი →</button>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] transition-all" style={{ width: `${((idx + 1) / pool.length) * 100}%` }} />
      </div>
    </div>
  );
}
