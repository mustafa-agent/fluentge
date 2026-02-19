import { useState } from 'react';

interface Idiom {
  english: string;
  meaning: string;
  georgian: string;
  example: string;
  exampleKa: string;
}

const idioms: Idiom[] = [
  { english: "Break the ice", meaning: "Start a conversation in a social situation", georgian: "საუბრის დაწყება", example: "He told a joke to break the ice.", exampleKa: "მან ხუმრობა თქვა საუბრის დასაწყებად." },
  { english: "Piece of cake", meaning: "Something very easy", georgian: "ძალიან მარტივი რამ", example: "The test was a piece of cake.", exampleKa: "ტესტი ძალიან მარტივი იყო." },
  { english: "Hit the nail on the head", meaning: "Say exactly the right thing", georgian: "ზუსტად სწორი რამის თქმა", example: "You hit the nail on the head with that answer.", exampleKa: "შენ ზუსტად სწორი პასუხი გაეცი." },
  { english: "Under the weather", meaning: "Feeling sick or unwell", georgian: "ცუდად ყოფნა", example: "I'm feeling under the weather today.", exampleKa: "დღეს ცუდად ვარ." },
  { english: "Cost an arm and a leg", meaning: "Very expensive", georgian: "ძალიან ძვირი", example: "That car costs an arm and a leg.", exampleKa: "ის მანქანა ძალიან ძვირი ღირს." },
  { english: "Let the cat out of the bag", meaning: "Reveal a secret accidentally", georgian: "საიდუმლოს გამჟღავნება", example: "She let the cat out of the bag about the party.", exampleKa: "მან შემთხვევით გაამხილა წვეულების შესახებ." },
  { english: "Kill two birds with one stone", meaning: "Achieve two things at once", georgian: "ერთი მოქმედებით ორი საქმის გაკეთება", example: "By walking to work, I kill two birds with one stone.", exampleKa: "ფეხით სიარულით სამუშაოზე, ორ საქმეს ვაკეთებ ერთდროულად." },
  { english: "Bite the bullet", meaning: "Face a difficult situation bravely", georgian: "სირთულის გამბედაობით მიღება", example: "I had to bite the bullet and tell the truth.", exampleKa: "მომიწია გამბედაობა და სიმართლის თქმა." },
  { english: "Burn the midnight oil", meaning: "Work late into the night", georgian: "გვიან ღამემდე მუშაობა", example: "Students burn the midnight oil before exams.", exampleKa: "სტუდენტები გვიან ღამემდე მუშაობენ გამოცდების წინ." },
  { english: "A blessing in disguise", meaning: "Something bad that turns out good", georgian: "ცუდი რამ, რომელიც კარგად გადაიქცევა", example: "Losing that job was a blessing in disguise.", exampleKa: "ის სამსახურის დაკარგვა კარგი აღმოჩნდა." },
  { english: "Spill the beans", meaning: "Tell a secret", georgian: "საიდუმლოს გამჟღავნება", example: "Don't spill the beans about the surprise!", exampleKa: "არ გაამხილო სიურპრიზის შესახებ!" },
  { english: "Once in a blue moon", meaning: "Very rarely", georgian: "ძალიან იშვიათად", example: "I eat fast food once in a blue moon.", exampleKa: "ფასთფუდს ძალიან იშვიათად ვჭამ." },
  { english: "The ball is in your court", meaning: "It's your turn to take action", georgian: "შენი რიგია მოქმედებისთვის", example: "I've made my offer. The ball is in your court.", exampleKa: "ჩემი შეთავაზება გავაკეთე. ახლა შენი რიგია." },
  { english: "Speak of the devil", meaning: "The person you were talking about appears", georgian: "მგელი ხსენებაზე", example: "Speak of the devil! We were just talking about you.", exampleKa: "მგელი ხსენებაზე! შენზე ვსაუბრობდით." },
  { english: "Better late than never", meaning: "It's better to do something late than not at all", georgian: "გვიან ჯობია არასდროს", example: "You finally started exercising? Better late than never!", exampleKa: "საბოლოოდ დაიწყე ვარჯიში? გვიან ჯობია არასდროს!" },
  { english: "Actions speak louder than words", meaning: "What you do matters more than what you say", georgian: "საქმე სიტყვაზე მეტს ამბობს", example: "Don't just promise — actions speak louder than words.", exampleKa: "მხოლოდ დაპირება არ კმარა — საქმე სიტყვაზე მეტს ამბობს." },
  { english: "Every cloud has a silver lining", meaning: "There's something good in every bad situation", georgian: "ყველა ცუდში კარგიც არის", example: "I lost my job, but every cloud has a silver lining — I found a better one.", exampleKa: "სამსახური დავკარგე, მაგრამ უკეთესი ვიპოვე." },
  { english: "Get out of hand", meaning: "Become out of control", georgian: "კონტროლიდან გასვლა", example: "The party got out of hand.", exampleKa: "წვეულება კონტროლიდან გავიდა." },
  { english: "Hang in there", meaning: "Don't give up", georgian: "არ დანებდე", example: "Hang in there! Things will get better.", exampleKa: "არ დანებდე! ყველაფერი გამოსწორდება." },
  { english: "It's not rocket science", meaning: "It's not complicated", georgian: "რთული არ არის", example: "Making coffee is not rocket science.", exampleKa: "ყავის მომზადება რთული არ არის." },
  { english: "On the same page", meaning: "In agreement", georgian: "თანხმობაში ყოფნა", example: "Let's make sure we're on the same page.", exampleKa: "დავრწმუნდეთ რომ ერთნაირად ვფიქრობთ." },
  { english: "Pull someone's leg", meaning: "Joke with someone", georgian: "ვინმეს გახუმრება", example: "I'm just pulling your leg!", exampleKa: "უბრალოდ გეხუმრები!" },
  { english: "The best of both worlds", meaning: "Enjoy advantages of two things", georgian: "ორივეს უპირატესობით სარგებლობა", example: "Working from home gives me the best of both worlds.", exampleKa: "სახლიდან მუშაობა ორივეს უპირატესობას მაძლევს." },
  { english: "When pigs fly", meaning: "Something that will never happen", georgian: "არასდროს", example: "He'll clean his room when pigs fly.", exampleKa: "ის ოთახს არასდროს დალაგებს." },
];

type Mode = 'browse' | 'quiz';

export default function IdiomsPhrases({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('browse');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // Quiz state
  const [quizIdioms, setQuizIdioms] = useState<Idiom[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const idiom = idioms[currentIdx];

  function startQuiz() {
    const shuffled = [...idioms].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizIdioms(shuffled);
    setQuizIdx(0);
    setScore(0);
    setQuizDone(false);
    setSelected(null);
    setMode('quiz');
    generateOptions(shuffled, 0);
  }

  function generateOptions(list: Idiom[], idx: number) {
    const correct = list[idx].meaning;
    const wrong = idioms
      .filter(i => i.meaning !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(i => i.meaning);
    setOptions([correct, ...wrong].sort(() => Math.random() - 0.5));
    setSelected(null);
  }

  function handleQuizSelect(opt: string) {
    if (selected) return;
    setSelected(opt);
    const correct = quizIdioms[quizIdx].meaning;
    if (opt === correct) setScore(s => s + 1);
    setTimeout(() => {
      if (quizIdx + 1 >= quizIdioms.length) {
        setQuizDone(true);
      } else {
        const next = quizIdx + 1;
        setQuizIdx(next);
        generateOptions(quizIdioms, next);
      }
    }, 1200);
  }

  if (mode === 'quiz' && !quizDone) {
    const qi = quizIdioms[quizIdx];
    const correct = qi.meaning;
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
        <div className="text-sm text-[var(--color-text-muted)] mb-2">{quizIdx + 1} / {quizIdioms.length} • ქულა: {score}</div>
        <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4">
          <div className="text-xl font-bold text-center mb-2">"{qi.english}"</div>
          <div className="text-sm text-[var(--color-text-muted)] text-center">რას ნიშნავს?</div>
        </div>
        <div className="space-y-3">
          {options.map((opt, i) => {
            let cls = "bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)]";
            if (selected) {
              if (opt === correct) cls = "bg-green-600/30 border-green-500";
              else if (opt === selected) cls = "bg-red-600/30 border-red-500";
            }
            return (
              <button
                key={i}
                onClick={() => handleQuizSelect(opt)}
                className={`w-full text-left p-4 rounded-xl border border-white/10 transition-colors ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'quiz' && quizDone) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 block">← უკან</button>
        <div className="text-4xl mb-4">{score >= 8 ? '🎉' : score >= 5 ? '👍' : '💪'}</div>
        <div className="text-2xl font-bold mb-2">{score} / {quizIdioms.length}</div>
        <div className="text-[var(--color-text-muted)] mb-6">
          {score >= 8 ? 'შესანიშნავი! ფრაზეოლოგიზმები კარგად იცი!' : score >= 5 ? 'კარგია! განაგრძე სწავლა!' : 'არაუშავს! კიდევ სცადე!'}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={startQuiz} className="bg-[var(--color-primary)] text-black font-bold px-6 py-3 rounded-xl">თავიდან</button>
          <button onClick={() => setMode('browse')} className="bg-[var(--color-bg-card)] px-6 py-3 rounded-xl">დათვალიერება</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">🗣️ იდიომები & ფრაზები</h2>
        <button onClick={startQuiz} className="bg-[var(--color-primary)] text-black text-sm font-bold px-4 py-2 rounded-xl">ქვიზი</button>
      </div>
      <div className="text-sm text-[var(--color-text-muted)] mb-4">{currentIdx + 1} / {idioms.length}</div>

      <div
        className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4 cursor-pointer"
        onClick={() => setRevealed(!revealed)}
      >
        <div className="text-2xl font-bold text-center mb-3">"{idiom.english}"</div>
        {revealed ? (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-[var(--color-primary)]/10 rounded-xl p-3">
              <div className="text-sm text-[var(--color-text-muted)]">მნიშვნელობა:</div>
              <div className="font-medium">{idiom.meaning}</div>
              <div className="text-[var(--color-primary)]">{idiom.georgian}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-sm text-[var(--color-text-muted)]">მაგალითი:</div>
              <div className="italic">"{idiom.example}"</div>
              <div className="text-[var(--color-text-muted)] text-sm mt-1">{idiom.exampleKa}</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-[var(--color-text-muted)]">👆 დააჭირე გასახსნელად</div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setRevealed(false); }}
          disabled={currentIdx === 0}
          className="bg-[var(--color-bg-card)] px-6 py-3 rounded-xl disabled:opacity-30"
        >
          ← წინა
        </button>
        <button
          onClick={() => { setCurrentIdx(Math.min(idioms.length - 1, currentIdx + 1)); setRevealed(false); }}
          disabled={currentIdx === idioms.length - 1}
          className="bg-[var(--color-bg-card)] px-6 py-3 rounded-xl disabled:opacity-30"
        >
          შემდეგი →
        </button>
      </div>
    </div>
  );
}
