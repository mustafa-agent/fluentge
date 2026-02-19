import { useState, useCallback } from 'react';

interface Sentence {
  english: string;
  georgian: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const sentences: Sentence[] = [
  // Easy
  { english: "The cat is sleeping on the bed.", georgian: "კატა საწოლზე სძინავს.", difficulty: 'easy' },
  { english: "I like to drink coffee in the morning.", georgian: "მე მიყვარს დილით ყავის დალევა.", difficulty: 'easy' },
  { english: "She is reading a book.", georgian: "ის წიგნს კითხულობს.", difficulty: 'easy' },
  { english: "We go to school every day.", georgian: "ჩვენ ყოველდღე სკოლაში მივდივართ.", difficulty: 'easy' },
  { english: "The weather is nice today.", georgian: "დღეს კარგი ამინდია.", difficulty: 'easy' },
  { english: "He has two brothers and one sister.", georgian: "მას ორი ძმა და ერთი და ჰყავს.", difficulty: 'easy' },
  { english: "My favorite color is blue.", georgian: "ჩემი საყვარელი ფერი ლურჯია.", difficulty: 'easy' },
  { english: "They are playing in the park.", georgian: "ისინი პარკში თამაშობენ.", difficulty: 'easy' },
  // Medium
  { english: "Could you please tell me where the train station is?", georgian: "შეგიძლიათ მითხრათ სად არის მატარებლის სადგური?", difficulty: 'medium' },
  { english: "I have been studying English for three years.", georgian: "სამი წელია ვსწავლობ ინგლისურს.", difficulty: 'medium' },
  { english: "If it rains tomorrow, we will stay at home.", georgian: "თუ ხვალ წვიმს, სახლში დავრჩებით.", difficulty: 'medium' },
  { english: "She decided to move to a different city for work.", georgian: "მან გადაწყვიტა სხვა ქალაქში გადასვლა სამუშაოსთვის.", difficulty: 'medium' },
  { english: "The restaurant around the corner serves great food.", georgian: "კუთხის მიღმა რესტორანი შესანიშნავ საჭმელს ემსახურება.", difficulty: 'medium' },
  { english: "Learning a new language takes time and patience.", georgian: "ახალი ენის სწავლას დრო და მოთმინება სჭირდება.", difficulty: 'medium' },
  { english: "Would you like to join us for dinner tonight?", georgian: "გსურთ ჩვენთან ერთად სადილი ამაღამ?", difficulty: 'medium' },
  { english: "The movie was so interesting that I watched it twice.", georgian: "ფილმი ისეთი საინტერესო იყო, რომ ორჯერ ვნახე.", difficulty: 'medium' },
  // Hard
  { english: "Despite the challenging circumstances, they managed to succeed.", georgian: "რთული გარემოებების მიუხედავად, მათ წარმატების მიღწევა შეძლეს.", difficulty: 'hard' },
  { english: "The government announced new regulations regarding environmental protection.", georgian: "მთავრობამ გარემოს დაცვის შესახებ ახალი რეგულაციები გამოაცხადა.", difficulty: 'hard' },
  { english: "Scientists have discovered a new species of butterfly in the Amazon rainforest.", georgian: "მეცნიერებმა ამაზონის ტროპიკულ ტყეში პეპლის ახალი სახეობა აღმოაჩინეს.", difficulty: 'hard' },
  { english: "The architecture of this building reflects the cultural heritage of the region.", georgian: "ამ შენობის არქიტექტურა რეგიონის კულტურულ მემკვიდრეობას ასახავს.", difficulty: 'hard' },
  { english: "Although she was exhausted, she continued working on her research project.", georgian: "მიუხედავად იმისა, რომ დაღლილი იყო, კვლევით პროექტზე მუშაობა გააგრძელა.", difficulty: 'hard' },
  { english: "The committee recommended several improvements to the transportation system.", georgian: "კომიტეტმა ტრანსპორტის სისტემის რამდენიმე გაუმჯობესება რეკომენდაცია გაუწია.", difficulty: 'hard' },
];

function speak(text: string, rate: number = 1) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  speechSynthesis.speak(u);
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function diffWords(correct: string, typed: string): { word: string; ok: boolean }[] {
  const cWords = correct.split(' ');
  const tWords = typed.split(' ');
  return cWords.map((w, i) => ({ word: w, ok: (tWords[i] || '').toLowerCase() === w.toLowerCase() }));
}

export default function Dictation({ onBack }: { onBack: () => void }) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [queue, setQueue] = useState<Sentence[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [played, setPlayed] = useState(0);

  const startGame = useCallback((diff: 'easy' | 'medium' | 'hard') => {
    setDifficulty(diff);
    const filtered = sentences.filter(s => s.difficulty === diff);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 5);
    setQueue(shuffled);
    setIdx(0);
    setInput('');
    setSubmitted(false);
    setScore(0);
    setShowHint(false);
    setPlayed(0);
  }, []);

  const current = queue[idx];
  const done = idx >= queue.length && queue.length > 0;

  const handlePlay = () => {
    if (!current) return;
    speak(current.english, difficulty === 'easy' ? 0.8 : difficulty === 'medium' ? 0.9 : 1);
    setPlayed(p => p + 1);
  };

  const handlePlaySlow = () => {
    if (!current) return;
    speak(current.english, 0.5);
    setPlayed(p => p + 1);
  };

  const handleSubmit = () => {
    if (!current || submitted) return;
    setSubmitted(true);
    const correct = normalize(current.english) === normalize(input);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    setIdx(i => i + 1);
    setInput('');
    setSubmitted(false);
    setShowHint(false);
    setPlayed(0);
  };

  if (!difficulty) {
    return (
      <div className="px-4 py-8 max-w-lg mx-auto">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-6 flex items-center gap-2 hover:text-white">
          ← უკან
        </button>
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎤</div>
          <h2 className="text-2xl font-bold mb-2">დიქტანტი</h2>
          <p className="text-[var(--color-text-muted)]">Dictation</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">მოისმინე წინადადება და ჩაწერე</p>
          <p className="text-xs text-[var(--color-text-muted)]">Listen to the sentence and type it</p>
        </div>
        <div className="space-y-3">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button key={d} onClick={() => startGame(d)}
              className="w-full p-4 rounded-xl border border-white/10 hover:border-[var(--color-primary)] transition-colors text-left">
              <span className="text-lg font-bold">{d === 'easy' ? '🟢 მარტივი' : d === 'medium' ? '🟡 საშუალო' : '🔴 რთული'}</span>
              <span className="text-sm text-[var(--color-text-muted)] block">
                {d === 'easy' ? 'Short simple sentences' : d === 'medium' ? 'Longer everyday sentences' : 'Complex academic sentences'}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="px-4 py-8 max-w-lg mx-auto text-center">
        <div className="text-5xl mb-4">{score >= 4 ? '🎉' : score >= 2 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2">შედეგი</h2>
        <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">{score}/{queue.length}</p>
        <p className="text-[var(--color-text-muted)] mb-6">
          {score >= 4 ? 'შესანიშნავი! Excellent!' : score >= 2 ? 'კარგი! Good job!' : 'გააგრძელე მეცადინეობა! Keep practicing!'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => startGame(difficulty)} className="px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold">
            🔄 თავიდან
          </button>
          <button onClick={() => setDifficulty(null)} className="px-6 py-3 bg-white/10 rounded-xl">
            დონის არჩევა
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-white/10 rounded-xl">
            უკან
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const isCorrect = submitted && normalize(current.english) === normalize(input);

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">{idx + 1}/{queue.length} | ქულა: {score}</span>
      </div>

      <div className="text-center mb-6">
        <div className="flex gap-3 justify-center mb-4">
          <button onClick={handlePlay} className="px-6 py-4 bg-[var(--color-primary)] text-black rounded-2xl font-bold text-lg hover:scale-105 transition-transform">
            🔊 მოისმინე
          </button>
          <button onClick={handlePlaySlow} className="px-4 py-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors">
            🐢 ნელა
          </button>
        </div>
        {played === 0 && <p className="text-sm text-[var(--color-text-muted)]">დააჭირე მოსასმენად • Press to listen</p>}
      </div>

      {!submitted && (
        <button onClick={() => setShowHint(!showHint)} className="text-sm text-[var(--color-text-muted)] mb-3 hover:text-white">
          {showHint ? '🙈 დამალე მინიშნება' : '💡 მინიშნება (Georgian)'}
        </button>
      )}
      {showHint && !submitted && (
        <div className="bg-white/5 rounded-xl p-3 mb-4 text-sm text-[var(--color-text-muted)]">
          🇬🇪 {current.georgian}
        </div>
      )}

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={submitted}
        placeholder="ჩაწერე რაც მოისმინე... / Type what you hear..."
        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
        rows={3}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !submitted) { e.preventDefault(); handleSubmit(); } }}
      />

      {!submitted && (
        <button onClick={handleSubmit} disabled={!input.trim()}
          className="w-full mt-4 py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold disabled:opacity-50">
          ✅ შემოწმება • Check
        </button>
      )}

      {submitted && (
        <div className="mt-4 space-y-3">
          <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
            <p className="font-bold mb-1">{isCorrect ? '✅ სწორია! Correct!' : '❌ არასწორია'}</p>
            {!isCorrect && (
              <div className="mt-2">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">სწორი პასუხი:</p>
                <p className="flex flex-wrap gap-1">
                  {diffWords(current.english, input).map((w, i) => (
                    <span key={i} className={w.ok ? 'text-green-400' : 'text-red-400 font-bold underline'}>{w.word}</span>
                  ))}
                </p>
              </div>
            )}
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-sm">
            <p>🇬🇪 {current.georgian}</p>
          </div>
          <button onClick={handleNext} className="w-full py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold">
            შემდეგი →
          </button>
        </div>
      )}
    </div>
  );
}
