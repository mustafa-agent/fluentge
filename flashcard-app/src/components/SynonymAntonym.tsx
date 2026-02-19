import { useState } from 'react';

interface WordSet {
  word: string;
  ka: string;
  synonym: string;
  synonymKa: string;
  antonym: string;
  antonymKa: string;
}

const WORDS: WordSet[] = [
  { word: 'Happy', ka: 'ბედნიერი', synonym: 'Joyful', synonymKa: 'მხიარული', antonym: 'Sad', antonymKa: 'სევდიანი' },
  { word: 'Big', ka: 'დიდი', synonym: 'Large', synonymKa: 'ვრცელი', antonym: 'Small', antonymKa: 'პატარა' },
  { word: 'Fast', ka: 'სწრაფი', synonym: 'Quick', synonymKa: 'ჩქარი', antonym: 'Slow', antonymKa: 'ნელი' },
  { word: 'Beautiful', ka: 'ლამაზი', synonym: 'Pretty', synonymKa: 'მშვენიერი', antonym: 'Ugly', antonymKa: 'მახინჯი' },
  { word: 'Strong', ka: 'ძლიერი', synonym: 'Powerful', synonymKa: 'ძალიანი', antonym: 'Weak', antonymKa: 'სუსტი' },
  { word: 'Hot', ka: 'ცხელი', synonym: 'Warm', synonymKa: 'თბილი', antonym: 'Cold', antonymKa: 'ცივი' },
  { word: 'Rich', ka: 'მდიდარი', synonym: 'Wealthy', synonymKa: 'შეძლებული', antonym: 'Poor', antonymKa: 'ღარიბი' },
  { word: 'Brave', ka: 'მამაცი', synonym: 'Courageous', synonymKa: 'გამბედავი', antonym: 'Cowardly', antonymKa: 'მშიშარა' },
  { word: 'Smart', ka: 'ჭკვიანი', synonym: 'Clever', synonymKa: 'გონიერი', antonym: 'Foolish', antonymKa: 'სულელი' },
  { word: 'Ancient', ka: 'ძველი', synonym: 'Old', synonymKa: 'ძველი', antonym: 'Modern', antonymKa: 'თანამედროვე' },
  { word: 'Calm', ka: 'მშვიდი', synonym: 'Peaceful', synonymKa: 'წყნარი', antonym: 'Angry', antonymKa: 'გაბრაზებული' },
  { word: 'Dark', ka: 'ბნელი', synonym: 'Dim', synonymKa: 'ჩაბნელებული', antonym: 'Bright', antonymKa: 'ნათელი' },
  { word: 'Easy', ka: 'ადვილი', synonym: 'Simple', synonymKa: 'მარტივი', antonym: 'Difficult', antonymKa: 'რთული' },
  { word: 'Full', ka: 'სავსე', synonym: 'Complete', synonymKa: 'სრული', antonym: 'Empty', antonymKa: 'ცარიელი' },
  { word: 'Honest', ka: 'პატიოსანი', synonym: 'Truthful', synonymKa: 'გულწრფელი', antonym: 'Dishonest', antonymKa: 'არაკეთილსინდისიერი' },
  { word: 'Loud', ka: 'ხმამაღალი', synonym: 'Noisy', synonymKa: 'ხმაურიანი', antonym: 'Quiet', antonymKa: 'ჩუმი' },
  { word: 'Love', ka: 'სიყვარული', synonym: 'Adore', synonymKa: 'თაყვანისცემა', antonym: 'Hate', antonymKa: 'სიძულვილი' },
  { word: 'Narrow', ka: 'ვიწრო', synonym: 'Thin', synonymKa: 'წვრილი', antonym: 'Wide', antonymKa: 'ფართო' },
  { word: 'Safe', ka: 'უსაფრთხო', synonym: 'Secure', synonymKa: 'დაცული', antonym: 'Dangerous', antonymKa: 'საშიში' },
  { word: 'Young', ka: 'ახალგაზრდა', synonym: 'Youthful', synonymKa: 'ახალგაზრდული', antonym: 'Old', antonymKa: 'ხანდაზმული' },
];

type Mode = 'menu' | 'learn' | 'quiz';
type QuizType = 'synonym' | 'antonym';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SynonymAntonym({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('menu');
  const [learnIdx, setLearnIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Quiz state
  const [quizWords] = useState(() => shuffle(WORDS).slice(0, 10));
  const [qIdx, setQIdx] = useState(0);
  const [quizType, setQuizType] = useState<QuizType>('synonym');
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const generateOptions = (idx: number, type: QuizType) => {
    const correct = type === 'synonym' ? quizWords[idx].synonym : quizWords[idx].antonym;
    const wrongs = shuffle(WORDS.filter(w => w.word !== quizWords[idx].word))
      .slice(0, 3)
      .map(w => type === 'synonym' ? w.synonym : w.antonym);
    setOptions(shuffle([correct, ...wrongs]));
    setQuizType(type);
  };

  const startQuiz = () => {
    setQIdx(0);
    setScore(0);
    setSelected(null);
    setQuizDone(false);
    const type: QuizType = Math.random() > 0.5 ? 'synonym' : 'antonym';
    generateOptions(0, type);
    setMode('quiz');
  };

  const handleAnswer = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    const correct = quizType === 'synonym' ? quizWords[qIdx].synonym : quizWords[qIdx].antonym;
    if (opt === correct) setScore(s => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= quizWords.length) {
        setQuizDone(true);
      } else {
        const next = qIdx + 1;
        setQIdx(next);
        setSelected(null);
        const type: QuizType = Math.random() > 0.5 ? 'synonym' : 'antonym';
        generateOptions(next, type);
      }
    }, 1200);
  };

  if (mode === 'menu') {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={onBack} className="text-[var(--color-primary)] mb-4">← უკან</button>
        <h2 className="text-2xl font-bold mb-1">🔄 სინონიმები & ანტონიმები</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">Synonyms & Antonyms — ისწავლე მსგავსი და საწინააღმდეგო სიტყვები</p>
        <div className="space-y-3">
          <button onClick={() => { setLearnIdx(0); setRevealed(false); setMode('learn'); }} className="w-full bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-left hover:border-blue-400 transition-colors">
            <div className="font-bold">📖 სწავლა</div>
            <div className="text-sm text-[var(--color-text-muted)]">გადახედე {WORDS.length} სიტყვის წყვილს</div>
          </button>
          <button onClick={startQuiz} className="w-full bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-left hover:border-green-400 transition-colors">
            <div className="font-bold">🧠 ქვიზი</div>
            <div className="text-sm text-[var(--color-text-muted)]">10 შემთხვევითი კითხვა</div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'learn') {
    const w = WORDS[learnIdx];
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={() => setMode('menu')} className="text-[var(--color-primary)] mb-4">← მენიუ</button>
        <div className="text-sm text-[var(--color-text-muted)] mb-4">{learnIdx + 1} / {WORDS.length}</div>
        
        <div className="bg-white/5 rounded-2xl p-6 text-center mb-4">
          <div className="text-3xl font-bold mb-2">{w.word}</div>
          <div className="text-[var(--color-text-muted)]">{w.ka}</div>
        </div>

        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="w-full bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl mb-4">
            აჩვენე სინონიმი & ანტონიმი
          </button>
        ) : (
          <div className="space-y-3 mb-4">
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
              <div className="text-xs text-green-400 mb-1">სინონიმი (Synonym)</div>
              <div className="text-xl font-bold">{w.synonym}</div>
              <div className="text-sm text-[var(--color-text-muted)]">{w.synonymKa}</div>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <div className="text-xs text-red-400 mb-1">ანტონიმი (Antonym)</div>
              <div className="text-xl font-bold">{w.antonym}</div>
              <div className="text-sm text-[var(--color-text-muted)]">{w.antonymKa}</div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button disabled={learnIdx === 0} onClick={() => { setLearnIdx(i => i - 1); setRevealed(false); }} className="flex-1 bg-white/10 py-3 rounded-xl disabled:opacity-30">← წინა</button>
          <button disabled={learnIdx === WORDS.length - 1} onClick={() => { setLearnIdx(i => i + 1); setRevealed(false); }} className="flex-1 bg-white/10 py-3 rounded-xl disabled:opacity-30">შემდეგი →</button>
        </div>
      </div>
    );
  }

  // Quiz mode
  if (quizDone) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">🎯 შედეგი</h2>
        <div className="text-5xl font-bold mb-2">{score}/{quizWords.length}</div>
        <div className="text-[var(--color-text-muted)] mb-6">
          {score >= 8 ? '🌟 შესანიშნავი!' : score >= 5 ? '👍 კარგია!' : '💪 სცადე ხელახლა!'}
        </div>
        <div className="space-y-3">
          <button onClick={startQuiz} className="w-full bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl">ხელახლა</button>
          <button onClick={() => setMode('menu')} className="w-full bg-white/10 py-3 rounded-xl">მენიუ</button>
        </div>
      </div>
    );
  }

  const w = quizWords[qIdx];
  const correct = quizType === 'synonym' ? w.synonym : w.antonym;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={() => setMode('menu')} className="text-[var(--color-primary)] mb-4">← მენიუ</button>
      <div className="flex justify-between text-sm text-[var(--color-text-muted)] mb-4">
        <span>{qIdx + 1}/{quizWords.length}</span>
        <span>✅ {score}</span>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 text-center mb-2">
        <div className="text-xs text-[var(--color-text-muted)] mb-2">
          იპოვე <span className={quizType === 'synonym' ? 'text-green-400' : 'text-red-400'}>
            {quizType === 'synonym' ? 'სინონიმი' : 'ანტონიმი'}
          </span>:
        </div>
        <div className="text-3xl font-bold">{w.word}</div>
        <div className="text-sm text-[var(--color-text-muted)]">{w.ka}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {options.map(opt => {
          let bg = 'bg-white/10';
          if (selected) {
            if (opt === correct) bg = 'bg-green-500/30 border-green-500';
            else if (opt === selected) bg = 'bg-red-500/30 border-red-500';
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)} className={`${bg} border border-white/10 rounded-xl p-4 text-center font-medium transition-all`}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
