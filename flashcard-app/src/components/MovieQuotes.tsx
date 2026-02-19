import { useState } from 'react';

interface Quote {
  movie: string;
  year: number;
  full: string;
  blank: string;
  answer: string;
  options: string[];
  ka: string;
  trivia: string;
}

const quotes: Quote[] = [
  {
    movie: "The Godfather",
    year: 1972,
    full: "I'm gonna make him an offer he can't refuse.",
    blank: "I'm gonna make him an _____ he can't refuse.",
    answer: "offer",
    options: ["offer", "order", "option", "opinion"],
    ka: "მე მას შეთავაზებას გავუკეთებ, რომელზეც ვერ უარს იტყვის.",
    trivia: "'Offer' = შეთავაზება. When you give someone a deal or proposal."
  },
  {
    movie: "Forrest Gump",
    year: 1994,
    full: "Life is like a box of chocolates. You never know what you're gonna get.",
    blank: "Life is like a box of _____. You never know what you're gonna get.",
    answer: "chocolates",
    options: ["chocolates", "cookies", "flowers", "surprises"],
    ka: "ცხოვრება შოკოლადის ყუთს ჰგავს. არასდროს იცი რას მიიღებ.",
    trivia: "'Box of chocolates' = შოკოლადის ყუთი. A metaphor for life's surprises."
  },
  {
    movie: "The Lion King",
    year: 1994,
    full: "Oh yes, the past can hurt. But the way I see it, you can either run from it, or learn from it.",
    blank: "The past can hurt. But you can either run from it, or _____ from it.",
    answer: "learn",
    options: ["learn", "hide", "escape", "forget"],
    ka: "წარსული შეიძლება მტკივნეული იყოს. მაგრამ შეგიძლია გაიქცე ან ისწავლო.",
    trivia: "'Learn from it' = ისწავლე ამისგან. Important life lesson!"
  },
  {
    movie: "Titanic",
    year: 1997,
    full: "I'm the king of the world!",
    blank: "I'm the _____ of the world!",
    answer: "king",
    options: ["king", "ruler", "master", "champion"],
    ka: "მე ვარ მსოფლიოს მეფე!",
    trivia: "'King' = მეფე. Jack shouts this standing on the ship's bow."
  },
  {
    movie: "Star Wars",
    year: 1977,
    full: "May the Force be with you.",
    blank: "May the _____ be with you.",
    answer: "Force",
    options: ["Force", "Power", "Strength", "Light"],
    ka: "ძალა შენთან იყოს.",
    trivia: "'Force' = ძალა. The most famous sci-fi quote ever!"
  },
  {
    movie: "The Wizard of Oz",
    year: 1939,
    full: "There's no place like home.",
    blank: "There's no _____ like home.",
    answer: "place",
    options: ["place", "house", "room", "spot"],
    ka: "სახლს ვერაფერი შეედრება.",
    trivia: "'Place' = ადგილი. Dorothy clicks her ruby slippers saying this."
  },
  {
    movie: "Finding Nemo",
    year: 2003,
    full: "Just keep swimming, just keep swimming.",
    blank: "Just keep _____, just keep _____.",
    answer: "swimming",
    options: ["swimming", "running", "trying", "moving"],
    ka: "უბრალოდ განაგრძე ცურვა, განაგრძე ცურვა.",
    trivia: "'Keep swimming' = განაგრძე ცურვა. Dory's motto for never giving up!"
  },
  {
    movie: "Harry Potter",
    year: 2001,
    full: "It does not do to dwell on dreams and forget to live.",
    blank: "It does not do to dwell on _____ and forget to live.",
    answer: "dreams",
    options: ["dreams", "wishes", "hopes", "memories"],
    ka: "ოცნებებში ჩაძირვა და ცხოვრების დავიწყება არ ვარგა.",
    trivia: "'Dreams' = ოცნებები. Dumbledore's wise advice to Harry."
  },
  {
    movie: "Toy Story",
    year: 1995,
    full: "To infinity and beyond!",
    blank: "To _____ and beyond!",
    answer: "infinity",
    options: ["infinity", "space", "stars", "heaven"],
    ka: "უსასრულობისკენ და მის მიღმა!",
    trivia: "'Infinity' = უსასრულობა. Buzz Lightyear's famous catchphrase."
  },
  {
    movie: "Rocky",
    year: 1976,
    full: "It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.",
    blank: "It's about how hard you can get hit and keep moving _____.",
    answer: "forward",
    options: ["forward", "ahead", "on", "up"],
    ka: "მნიშვნელოვანია არა ის, რამდენად ძლიერად ურტყამ, არამედ რამდენად ძლიერ დარტყმას უძლებ და აგრძელებ წინსვლას.",
    trivia: "'Moving forward' = წინსვლა. Rocky's advice about perseverance."
  },
  {
    movie: "The Pursuit of Happyness",
    year: 2006,
    full: "Don't ever let somebody tell you that you can't do something.",
    blank: "Don't ever let somebody tell you that you _____ do something.",
    answer: "can't",
    options: ["can't", "won't", "shouldn't", "mustn't"],
    ka: "არასდროს მისცე ვინმეს უფლება გითხრას, რომ რაღაც არ შეგიძლია.",
    trivia: "'Can't' = არ შეგიძლია. Will Smith's powerful scene with his son."
  },
  {
    movie: "Shrek",
    year: 2001,
    full: "Ogres are like onions. They have layers.",
    blank: "Ogres are like onions. They have _____.",
    answer: "layers",
    options: ["layers", "feelings", "hearts", "secrets"],
    ka: "ოგრები ხახვს ჰგვანან. მათ ფენები აქვთ.",
    trivia: "'Layers' = ფენები. Shrek explains he's more complex than he looks!"
  },
];

export default function MovieQuotes({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'menu' | 'quiz' | 'browse'>('menu');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizOrder] = useState(() => [...quotes].sort(() => Math.random() - 0.5).slice(0, 10));

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === quizOrder[current].answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= quizOrder.length) {
      setShowResult(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  if (mode === 'menu') {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={onBack} className="text-[var(--color-primary)] mb-4">← უკან</button>
        <h2 className="text-2xl font-bold mb-2">🎬 ფილმის ციტატები</h2>
        <p className="text-[var(--color-text-muted)] mb-6">ისწავლე ინგლისური ცნობილი ფილმების ციტატებით!</p>
        <div className="space-y-3">
          <button onClick={() => setMode('browse')} className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-4 text-left transition-colors">
            <div className="text-lg font-bold">📖 დათვალიერება</div>
            <div className="text-sm text-[var(--color-text-muted)]">წაიკითხე ციტატები თარგმანებით</div>
          </button>
          <button onClick={() => setMode('quiz')} className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-4 text-left transition-colors">
            <div className="text-lg font-bold">🧠 ქვიზი</div>
            <div className="text-sm text-[var(--color-text-muted)]">შეავსე გამოტოვებული სიტყვა</div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'browse') {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={() => setMode('menu')} className="text-[var(--color-primary)] mb-4">← უკან</button>
        <h2 className="text-xl font-bold mb-4">📖 ფილმის ციტატები</h2>
        <div className="space-y-4">
          {quotes.map((q, i) => (
            <div key={i} className="bg-[var(--color-bg-card)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎬</span>
                <span className="font-bold">{q.movie}</span>
                <span className="text-xs text-[var(--color-text-muted)]">({q.year})</span>
              </div>
              <p className="text-white mb-2 italic">"{q.full}"</p>
              <p className="text-[var(--color-text-muted)] text-sm mb-2">🇬🇪 {q.ka}</p>
              <p className="text-xs text-[var(--color-primary)]">💡 {q.trivia}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">🎬 შედეგი</h2>
        <div className="text-6xl mb-4">{score >= 8 ? '🌟' : score >= 5 ? '👏' : '💪'}</div>
        <p className="text-3xl font-bold text-[var(--color-primary)] mb-2">{score}/{quizOrder.length}</p>
        <p className="text-[var(--color-text-muted)] mb-6">
          {score >= 8 ? 'ფილმების ექსპერტი ხარ!' : score >= 5 ? 'კარგი შედეგია!' : 'კიდევ სცადე!'}
        </p>
        <button onClick={onBack} className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold">დასრულება</button>
      </div>
    );
  }

  const q = quizOrder[current];
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setMode('menu')} className="text-[var(--color-primary)]">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">{current + 1}/{quizOrder.length} | ✅ {score}</span>
      </div>
      <div className="bg-[var(--color-bg-card)] rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎬</span>
          <span className="font-bold">{q.movie}</span>
          <span className="text-xs text-[var(--color-text-muted)]">({q.year})</span>
        </div>
        <p className="text-lg italic mb-3">"{q.blank}"</p>
        <p className="text-sm text-[var(--color-text-muted)]">🇬🇪 {q.ka}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={!!selected}
            className={`p-3 rounded-xl font-bold text-sm transition-colors ${
              selected
                ? opt === q.answer
                  ? 'bg-green-600 text-white'
                  : opt === selected
                    ? 'bg-red-600 text-white'
                    : 'bg-[var(--color-bg-card)] opacity-50'
                : 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mb-4">
          <p className="text-xs text-[var(--color-primary)] mb-3">💡 {q.trivia}</p>
          <button onClick={handleNext} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold">
            {current + 1 >= quizOrder.length ? 'შედეგი' : 'შემდეგი →'}
          </button>
        </div>
      )}
    </div>
  );
}
