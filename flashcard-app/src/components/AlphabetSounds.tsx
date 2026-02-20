import { useState } from 'react';

interface Letter {
  letter: string;
  upper: string;
  sound: string;
  soundKa: string;
  example: string;
  exampleKa: string;
  type: 'vowel' | 'consonant';
}

const alphabet: Letter[] = [
  { letter: 'a', upper: 'A', sound: '/eɪ/', soundKa: 'ეი', example: 'apple, cat, cake', exampleKa: 'ვაშლი, კატა, ტორტი', type: 'vowel' },
  { letter: 'b', upper: 'B', sound: '/biː/', soundKa: 'ბი', example: 'ball, book, baby', exampleKa: 'ბურთი, წიგნი, ბავშვი', type: 'consonant' },
  { letter: 'c', upper: 'C', sound: '/siː/', soundKa: 'სი', example: 'cat, city, cup', exampleKa: 'კატა, ქალაქი, ჭიქა', type: 'consonant' },
  { letter: 'd', upper: 'D', sound: '/diː/', soundKa: 'დი', example: 'dog, door, day', exampleKa: 'ძაღლი, კარი, დღე', type: 'consonant' },
  { letter: 'e', upper: 'E', sound: '/iː/', soundKa: 'ი', example: 'egg, elephant, eat', exampleKa: 'კვერცხი, სპილო, ჭამა', type: 'vowel' },
  { letter: 'f', upper: 'F', sound: '/ɛf/', soundKa: 'ეფ', example: 'fish, food, friend', exampleKa: 'თევზი, საჭმელი, მეგობარი', type: 'consonant' },
  { letter: 'g', upper: 'G', sound: '/dʒiː/', soundKa: 'ჯი', example: 'go, game, green', exampleKa: 'წასვლა, თამაში, მწვანე', type: 'consonant' },
  { letter: 'h', upper: 'H', sound: '/eɪtʃ/', soundKa: 'ეიჩ', example: 'house, happy, hello', exampleKa: 'სახლი, ბედნიერი, გამარჯობა', type: 'consonant' },
  { letter: 'i', upper: 'I', sound: '/aɪ/', soundKa: 'აი', example: 'ice, idea, island', exampleKa: 'ყინული, იდეა, კუნძული', type: 'vowel' },
  { letter: 'j', upper: 'J', sound: '/dʒeɪ/', soundKa: 'ჯეი', example: 'jump, job, juice', exampleKa: 'ხტომა, სამსახური, წვენი', type: 'consonant' },
  { letter: 'k', upper: 'K', sound: '/keɪ/', soundKa: 'ქეი', example: 'king, key, kind', exampleKa: 'მეფე, გასაღები, კეთილი', type: 'consonant' },
  { letter: 'l', upper: 'L', sound: '/ɛl/', soundKa: 'ელ', example: 'love, light, learn', exampleKa: 'სიყვარული, სინათლე, სწავლა', type: 'consonant' },
  { letter: 'm', upper: 'M', sound: '/ɛm/', soundKa: 'ემ', example: 'moon, music, money', exampleKa: 'მთვარე, მუსიკა, ფული', type: 'consonant' },
  { letter: 'n', upper: 'N', sound: '/ɛn/', soundKa: 'ენ', example: 'name, night, new', exampleKa: 'სახელი, ღამე, ახალი', type: 'consonant' },
  { letter: 'o', upper: 'O', sound: '/oʊ/', soundKa: 'ოუ', example: 'open, orange, old', exampleKa: 'ღია, ფორთოხალი, ძველი', type: 'vowel' },
  { letter: 'p', upper: 'P', sound: '/piː/', soundKa: 'ფი', example: 'pen, phone, play', exampleKa: 'კალამი, ტელეფონი, თამაში', type: 'consonant' },
  { letter: 'q', upper: 'Q', sound: '/kjuː/', soundKa: 'ქიუ', example: 'queen, question, quiet', exampleKa: 'დედოფალი, კითხვა, ჩუმი', type: 'consonant' },
  { letter: 'r', upper: 'R', sound: '/ɑːr/', soundKa: 'არ', example: 'red, run, rain', exampleKa: 'წითელი, სირბილი, წვიმა', type: 'consonant' },
  { letter: 's', upper: 'S', sound: '/ɛs/', soundKa: 'ეს', example: 'sun, school, smile', exampleKa: 'მზე, სკოლა, ღიმილი', type: 'consonant' },
  { letter: 't', upper: 'T', sound: '/tiː/', soundKa: 'თი', example: 'time, tree, talk', exampleKa: 'დრო, ხე, საუბარი', type: 'consonant' },
  { letter: 'u', upper: 'U', sound: '/juː/', soundKa: 'იუ', example: 'use, uncle, umbrella', exampleKa: 'გამოყენება, ბიძა, ქოლგა', type: 'vowel' },
  { letter: 'v', upper: 'V', sound: '/viː/', soundKa: 'ვი', example: 'very, voice, visit', exampleKa: 'ძალიან, ხმა, ვიზიტი', type: 'consonant' },
  { letter: 'w', upper: 'W', sound: '/dʌbljuː/', soundKa: 'დაბლიუ', example: 'water, work, world', exampleKa: 'წყალი, სამუშაო, სამყარო', type: 'consonant' },
  { letter: 'x', upper: 'X', sound: '/ɛks/', soundKa: 'ექს', example: 'box, six, fox', exampleKa: 'ყუთი, ექვსი, მელა', type: 'consonant' },
  { letter: 'y', upper: 'Y', sound: '/waɪ/', soundKa: 'უაი', example: 'yes, yellow, young', exampleKa: 'დიახ, ყვითელი, ახალგაზრდა', type: 'consonant' },
  { letter: 'z', upper: 'Z', sound: '/ziː/', soundKa: 'ზი', example: 'zero, zoo, zone', exampleKa: 'ნული, ზოოპარკი, ზონა', type: 'consonant' },
];

interface Props { onBack: () => void; }

export default function AlphabetSounds({ onBack }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<'grid' | 'quiz'>('grid');
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [quizItems] = useState(() => alphabet.sort(() => Math.random() - 0.5).map(l => ({
    letter: l,
    options: [l.soundKa, ...alphabet.filter(x => x.letter !== l.letter).sort(() => Math.random() - 0.5).slice(0, 2).map(x => x.soundKa)].sort(() => Math.random() - 0.5)
  })));

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.8;
    speechSynthesis.speak(u);
  };

  if (mode === 'grid') {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
        <h2 className="text-xl font-bold mb-1">🔤 ინგლისური ანბანი</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-2">დააჭირე ასოს მოსასმენად</p>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('grid')} className="px-3 py-1 rounded-full text-sm bg-[var(--color-primary)] text-black font-bold">ანბანი</button>
          <button onClick={() => setMode('quiz')} className="px-3 py-1 rounded-full text-sm bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">ქვიზი</button>
        </div>

        {/* Legend */}
        <div className="flex gap-3 mb-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/30 inline-block"></span> ხმოვანი (Vowel)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[var(--color-bg-card)] inline-block"></span> თანხმოვანი (Consonant)</span>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {alphabet.map((l, i) => (
            <button
              key={l.letter}
              onClick={() => { setSelected(i); speak(l.letter); }}
              className={`rounded-xl p-2 text-center transition-all border ${
                l.type === 'vowel' ? 'bg-amber-500/15 border-amber-500/20 hover:border-amber-500/40' : 'bg-[var(--color-bg-card)] border-white/5 hover:border-white/15'
              } ${selected === i ? 'ring-2 ring-[var(--color-primary)]' : ''}`}
            >
              <div className="text-lg font-bold">{l.upper}</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">{l.soundKa}</div>
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 animate-fade-in">
            <div className="flex items-center gap-4 mb-3">
              <div className="text-5xl font-bold">{alphabet[selected].upper}{alphabet[selected].letter}</div>
              <div>
                <div className="text-lg font-mono text-[var(--color-primary)]">{alphabet[selected].sound}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{alphabet[selected].soundKa}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${alphabet[selected].type === 'vowel' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {alphabet[selected].type === 'vowel' ? 'ხმოვანი' : 'თანხმოვანი'}
                </span>
              </div>
              <button onClick={() => speak(alphabet[selected].letter)} className="ml-auto text-2xl hover:scale-110 transition-transform">🔊</button>
            </div>
            <div className="text-sm mb-1"><span className="text-[var(--color-text-muted)]">მაგალითები:</span> {alphabet[selected].example}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{alphabet[selected].exampleKa}</div>
            <div className="flex gap-2 mt-3">
              {alphabet[selected].example.split(', ').map(w => (
                <button key={w} onClick={() => speak(w)} className="text-xs px-2 py-1 rounded-lg bg-[var(--color-bg-card-hover)] hover:bg-white/10">🔊 {w}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz mode
  if (quizIdx >= 26) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 block">← უკან</button>
        <div className="text-6xl mb-4">{score >= 22 ? '🏆' : score >= 15 ? '👏' : '📚'}</div>
        <h2 className="text-2xl font-bold mb-2">{score} / 26</h2>
        <p className="text-[var(--color-text-muted)] mb-6">{score >= 22 ? 'შესანიშნავი!' : 'კიდევ ივარჯიშე!'}</p>
        <button onClick={() => { setMode('grid'); setSelected(null); }} className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-black font-bold">თავიდან</button>
      </div>
    );
  }

  const q = quizItems[quizIdx];
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
      <h2 className="text-xl font-bold mb-2">🔤 ანბანის ქვიზი</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">{quizIdx + 1} / 26 · ქულა: {score}</p>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4 text-center">
        <p className="text-sm text-[var(--color-text-muted)] mb-2">როგორ იკითხება ეს ასო?</p>
        <div className="text-6xl font-bold mb-4">{q.letter.upper}</div>
        <button onClick={() => speak(q.letter.letter)} className="text-2xl mb-4 hover:scale-110 transition-transform">🔊</button>
        <div className="grid grid-cols-3 gap-3">
          {q.options.map(opt => {
            const isCorrect = opt === q.letter.soundKa;
            const chosen = answer === opt;
            let cls = 'py-3 rounded-xl font-bold transition-colors ';
            if (!answer) cls += 'bg-[var(--color-bg-card-hover)] hover:bg-white/10';
            else if (chosen && isCorrect) cls += 'bg-green-600/30 text-green-400';
            else if (chosen && !isCorrect) cls += 'bg-red-600/30 text-red-400';
            else if (isCorrect) cls += 'bg-green-600/20 text-green-400';
            else cls += 'bg-[var(--color-bg-card-hover)] opacity-50';
            return (
              <button key={opt} onClick={() => { if (!answer) { setAnswer(opt); if (isCorrect) setScore(s => s + 1); }}} className={cls}>{opt}</button>
            );
          })}
        </div>
      </div>
      {answer && (
        <button onClick={() => { setQuizIdx(i => i + 1); setAnswer(null); }} className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-black font-bold">შემდეგი →</button>
      )}
    </div>
  );
}
