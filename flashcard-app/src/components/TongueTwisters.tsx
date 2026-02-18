import { useState } from 'react';

interface TongueTwister {
  text: string;
  translation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tip: string;
  sound: string; // The sound being practiced
}

const twisters: TongueTwister[] = [
  {
    text: "She sells seashells by the seashore.",
    translation: "ის ყიდის ნიჟარებს ზღვის ნაპირზე.",
    difficulty: 'Easy',
    tip: 'ყურადღება მიაქციე "sh" და "s" ბგერების განსხვავებას',
    sound: 'sh / s'
  },
  {
    text: "Peter Piper picked a peck of pickled peppers.",
    translation: "პიტერ პაიპერმა აკრიფა ერთი ზომა დამარინადებული წიწაკა.",
    difficulty: 'Medium',
    tip: '"P" ბგერა ძლიერად წარმოთქვი',
    sound: 'p'
  },
  {
    text: "How much wood would a woodchuck chuck?",
    translation: "რამდენ ხეს გადააგდებდა ზაზუნა?",
    difficulty: 'Medium',
    tip: '"W" და "ch" ბგერებზე იმუშავე',
    sound: 'w / ch'
  },
  {
    text: "Red lorry, yellow lorry.",
    translation: "წითელი სატვირთო, ყვითელი სატვირთო.",
    difficulty: 'Easy',
    tip: '"R", "L" და "Y" ბგერების გადართვა',
    sound: 'r / l / y'
  },
  {
    text: "Unique New York, unique New York, you know you need unique New York.",
    translation: "უნიკალური ნიუ-იორკი, შენ იცი რომ გჭირდება უნიკალური ნიუ-იორკი.",
    difficulty: 'Hard',
    tip: '"N" და "Y" ბგერების კომბინაცია',
    sound: 'n / y'
  },
  {
    text: "The thirty-three thieves thought that they thrilled the throne throughout Thursday.",
    translation: "ოცდაცამეტმა ქურდმა იფიქრა, რომ ტახტი აღაფრთოვანეს ხუთშაბათს.",
    difficulty: 'Hard',
    tip: '"Th" ბგერა — ენა კბილებს შორის',
    sound: 'th'
  },
  {
    text: "I scream, you scream, we all scream for ice cream.",
    translation: "მე ვყვირი, შენ ყვირი, ჩვენ ყველა ვყვირით ნაყინისთვის.",
    difficulty: 'Easy',
    tip: '"Scream" და "ice cream" ერთნაირად ჟღერს!',
    sound: 'scr / cr'
  },
  {
    text: "Betty Botter bought some butter, but she said the butter's bitter.",
    translation: "ბეტი ბოტერმა იყიდა კარაქი, მაგრამ თქვა კარაქი მწარეაო.",
    difficulty: 'Medium',
    tip: '"B" და "T" ბგერების სწრაფი გადართვა',
    sound: 'b / t'
  },
  {
    text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.",
    translation: "ფაზი ვაზი დათვი იყო. ფაზი ვაზის თმა არ ჰქონდა.",
    difficulty: 'Easy',
    tip: '"Z" ბგერა ხმოვანია, "S" კი უხმო',
    sound: 'z / s'
  },
  {
    text: "Can you can a can as a canner can can a can?",
    translation: "შეგიძლია კონსერვი გააკეთო ისე, როგორც კონსერვატორს შეუძლია?",
    difficulty: 'Hard',
    tip: '"Can" სამ სხვადასხვა მნიშვნელობით გამოიყენება',
    sound: 'k / æ'
  },
  {
    text: "Six slippery snails slid slowly seaward.",
    translation: "ექვსი მოცურავე ლოკოკინა ნელა მიცურავდა ზღვისკენ.",
    difficulty: 'Medium',
    tip: '"S" და "SL" კლასტერი',
    sound: 's / sl'
  },
  {
    text: "A proper copper coffee pot.",
    translation: "სათანადო სპილენძის ყავის ქვაბი.",
    difficulty: 'Easy',
    tip: '"P" და "C/K" ბგერების მონაცვლეობა',
    sound: 'p / k'
  }
];

export default function TongueTwisters({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  const twister = twisters[current];

  function speak() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(twister.text);
      utterance.lang = 'en-US';
      utterance.rate = speed === 'slow' ? 0.6 : speed === 'fast' ? 1.3 : 0.9;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }

  function next() {
    setCurrent((current + 1) % twisters.length);
    setShowTranslation(false);
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  function prev() {
    setCurrent((current - 1 + twisters.length) % twisters.length);
    setShowTranslation(false);
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  const diffColor = twister.difficulty === 'Easy' ? 'text-green-400' : twister.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
        <h2 className="text-lg font-bold">👅 ენის გასატეხები</h2>
        <div className="text-sm text-[var(--color-text-muted)]">{current + 1}/{twisters.length}</div>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4">
        {/* Difficulty + Sound */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-sm font-semibold ${diffColor}`}>{twister.difficulty}</span>
          <span className="text-sm text-[var(--color-text-muted)]">🔊 {twister.sound}</span>
        </div>

        {/* The twister text */}
        <p className="text-xl font-semibold leading-relaxed mb-4">{twister.text}</p>

        {/* Translation toggle */}
        {showTranslation ? (
          <p className="text-[var(--color-text-muted)] text-sm mb-4">{twister.translation}</p>
        ) : (
          <button
            onClick={() => setShowTranslation(true)}
            className="text-sm text-[var(--color-primary)] mb-4"
          >
            🇬🇪 თარგმანის ნახვა
          </button>
        )}

        {/* Tip */}
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <p className="text-sm">💡 {twister.tip}</p>
        </div>

        {/* Speed selector */}
        <div className="flex gap-2 mb-4">
          {(['slow', 'normal', 'fast'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                speed === s ? 'bg-[var(--color-primary)] text-black' : 'bg-white/10'
              }`}
            >
              {s === 'slow' ? '🐢 ნელი' : s === 'normal' ? '🚶 ჩვეული' : '🏃 სწრაფი'}
            </button>
          ))}
        </div>

        {/* Listen button */}
        <button
          onClick={speak}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
            speaking
              ? 'bg-yellow-500 text-black animate-pulse'
              : 'bg-[var(--color-primary)] text-black hover:opacity-90'
          }`}
        >
          {speaking ? '🔊 ლაპარაკობს...' : '🎧 მოსმენა'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={prev}
          className="flex-1 bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] py-3 rounded-xl font-medium transition-colors"
        >
          ← წინა
        </button>
        <button
          onClick={next}
          className="flex-1 bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] py-3 rounded-xl font-medium transition-colors"
        >
          შემდეგი →
        </button>
      </div>

      <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
        სცადე თითოეული 3-ჯერ სწრაფად წარმოთქვა! 🚀
      </p>
    </div>
  );
}
