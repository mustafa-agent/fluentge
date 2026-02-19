import { useState, useMemo } from 'react';

interface BeeGame {
  center: string;
  letters: string[];
  words: { word: string; ka: string }[];
  pangram: string;
}

const games: BeeGame[] = [
  {
    center: 'A',
    letters: ['T','R','E','N','S','P'],
    words: [
      { word: 'PARENT', ka: 'მშობელი' }, { word: 'PASTE', ka: 'პასტა' },
      { word: 'ANTS', ka: 'ჭიანჭველები' }, { word: 'PANTS', ka: 'შარვალი' },
      { word: 'STARE', ka: 'შეხედვა' }, { word: 'SPARE', ka: 'სათადარიგო' },
      { word: 'PARSE', ka: 'გარჩევა' }, { word: 'PANT', ka: 'ხიხინი' },
      { word: 'RANT', ka: 'ლანძღვა' }, { word: 'TRAP', ka: 'ხაფანგი' },
      { word: 'STAR', ka: 'ვარსკვლავი' }, { word: 'PATS', ka: 'ხელის დაკვრა' },
      { word: 'RATS', ka: 'ვირთხები' }, { word: 'TSAR', ka: 'ცარი' },
      { word: 'SPAR', ka: 'სპარინგი' }, { word: 'SNAP', ka: 'ტკაცუნი' },
      { word: 'NAPS', ka: 'ძილი' }, { word: 'TAPE', ka: 'ფირი' },
      { word: 'PEAR', ka: 'მსხალი' }, { word: 'PARENTS', ka: 'მშობლები' },
    ],
    pangram: 'PARENTS'
  },
  {
    center: 'O',
    letters: ['H','M','E','W','R','K'],
    words: [
      { word: 'HOMEWORK', ka: 'საშინაო დავალება' }, { word: 'WORK', ka: 'სამუშაო' },
      { word: 'WORM', ka: 'ჭია' }, { word: 'MORE', ka: 'მეტი' },
      { word: 'WORE', ka: 'ეცვა' }, { word: 'HOME', ka: 'სახლი' },
      { word: 'REWORK', ka: 'გადამუშავება' }, { word: 'WOKE', ka: 'გაიღვიძა' },
      { word: 'SMOKE', ka: 'კვამლი' }, { word: 'JOKE', ka: 'ხუმრობა' },
      { word: 'HERO', ka: 'გმირი' }, { word: 'ZERO', ka: 'ნული' },
      { word: 'STORE', ka: 'მაღაზია' }, { word: 'CORE', ka: 'ბირთვი' },
      { word: 'HOMER', ka: 'ჰომერი' }, { word: 'MOWER', ka: 'სათიბი' },
    ],
    pangram: 'HOMEWORK'
  },
  {
    center: 'I',
    letters: ['L','G','H','T','N','S'],
    words: [
      { word: 'LIGHTING', ka: 'განათება' }, { word: 'NIGHT', ka: 'ღამე' },
      { word: 'LIGHT', ka: 'სინათლე' }, { word: 'SIGHT', ka: 'მხედველობა' },
      { word: 'SLIGHT', ka: 'მცირე' }, { word: 'TIGHT', ka: 'მჭიდრო' },
      { word: 'THIN', ka: 'თხელი' }, { word: 'THING', ka: 'რამე' },
      { word: 'STING', ka: 'ნესტარი' }, { word: 'SLING', ka: 'პროკა' },
      { word: 'LISTING', ka: 'სია' }, { word: 'SITTING', ka: 'ჯდომა' },
      { word: 'HITTING', ka: 'დარტყმა' }, { word: 'SLIGHTING', ka: 'უგულებელყოფა' },
      { word: 'TIGHTS', ka: 'კოლგოტი' }, { word: 'LIGHTS', ka: 'შუქები' },
    ],
    pangram: 'LIGHTING'
  },
  {
    center: 'E',
    letters: ['B','A','K','R','D','S'],
    words: [
      { word: 'BREADS', ka: 'პურები' }, { word: 'BAKED', ka: 'გამომცხვარი' },
      { word: 'BREAD', ka: 'პური' }, { word: 'BREAK', ka: 'შესვენება' },
      { word: 'STEAK', ka: 'სტეიკი' }, { word: 'BAKE', ka: 'გამოცხობა' },
      { word: 'SAKE', ka: 'გულისთვის' }, { word: 'DESK', ka: 'მაგიდა' },
      { word: 'SEEK', ka: 'ძიება' }, { word: 'SEED', ka: 'თესლი' },
      { word: 'REED', ka: 'ლერწამი' }, { word: 'DEER', ka: 'ირემი' },
      { word: 'BEER', ka: 'ლუდი' }, { word: 'DARK', ka: 'ბნელი' },
      { word: 'EARED', ka: 'ყურიანი' }, { word: 'RAKED', ka: 'გაზვერილი' },
    ],
    pangram: 'BREADS'
  },
];

export default function SpellingBee({ onBack }: { onBack: () => void }) {
  const [gameIdx, setGameIdx] = useState(0);
  const [input, setInput] = useState('');
  const [found, setFound] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success'|'error'>('success');

  const game = games[gameIdx];
  const allLetters = useMemo(() => [game.center, ...game.letters], [game]);

  function addLetter(l: string) {
    setInput(prev => prev + l);
    setMessage('');
  }

  function deleteLetter() {
    setInput(prev => prev.slice(0, -1));
  }

  function shuffle() {
    // Just visual fun - doesn't change game
    setMessage('');
  }

  function submit() {
    const word = input.toUpperCase();
    if (word.length < 3) {
      setMessage('მინიმუმ 3 ასო!'); setMessageType('error'); return;
    }
    if (!word.includes(game.center)) {
      setMessage(`უნდა შეიცავდეს "${game.center}"!`); setMessageType('error'); return;
    }
    // Check all letters are valid
    for (const c of word) {
      if (!allLetters.includes(c)) {
        setMessage(`"${c}" არ არის ნებადართული!`); setMessageType('error'); return;
      }
    }
    if (found.includes(word)) {
      setMessage('უკვე ნაპოვნია!'); setMessageType('error'); return;
    }
    const match = game.words.find(w => w.word === word);
    if (!match) {
      setMessage('სიტყვა არ არის სიაში'); setMessageType('error'); return;
    }
    setFound(prev => [...prev, word]);
    setInput('');
    if (word === game.pangram) {
      setMessage(`🌟 პანგრამა! "${match.ka}"`); setMessageType('success');
    } else {
      setMessage(`✅ ${match.ka}`); setMessageType('success');
    }
  }

  function nextGame() {
    setGameIdx((gameIdx + 1) % games.length);
    setFound([]);
    setInput('');
    setMessage('');
  }

  const progress = Math.round((found.length / game.words.length) * 100);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-primary)]">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">{found.length}/{game.words.length} სიტყვა</span>
      </div>

      <h2 className="text-2xl font-bold mb-2">🐝 Spelling Bee</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">შექმენი სიტყვები ამ ასოებით. ცენტრალური ასო სავალდებულოა!</p>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-6">
        <div className="bg-[var(--color-primary)] h-2 rounded-full transition-all" style={{width:`${progress}%`}}></div>
      </div>

      {/* Input display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold tracking-widest min-h-[2.5rem] font-mono">
          {input.split('').map((c, i) => (
            <span key={i} className={c === game.center ? 'text-[var(--color-primary)]' : ''}>{c}</span>
          ))}
          <span className="animate-pulse text-white/30">|</span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`text-center text-sm mb-4 ${messageType === 'success' ? 'text-[var(--color-primary)]' : 'text-red-400'}`}>
          {message}
        </div>
      )}

      {/* Honeycomb layout */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <div className="flex gap-1">
          <button onClick={() => addLetter(game.letters[0])} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-lg transition-colors">{game.letters[0]}</button>
          <button onClick={() => addLetter(game.letters[1])} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-lg transition-colors">{game.letters[1]}</button>
        </div>
        <div className="flex gap-1">
          <button onClick={() => addLetter(game.letters[2])} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-lg transition-colors">{game.letters[2]}</button>
          <button onClick={() => addLetter(game.center)} className="w-14 h-14 bg-[var(--color-primary)] text-black rounded-xl font-bold text-lg">{game.center}</button>
          <button onClick={() => addLetter(game.letters[3])} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-lg transition-colors">{game.letters[3]}</button>
        </div>
        <div className="flex gap-1">
          <button onClick={() => addLetter(game.letters[4])} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-lg transition-colors">{game.letters[4]}</button>
          <button onClick={() => addLetter(game.letters[5])} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-lg transition-colors">{game.letters[5]}</button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-center mb-6">
        <button onClick={deleteLetter} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm">წაშლა</button>
        <button onClick={shuffle} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm">🔀</button>
        <button onClick={submit} className="bg-[var(--color-primary)] text-black font-bold rounded-xl px-6 py-3 text-sm">შეამოწმე</button>
      </div>

      {/* Found words */}
      {found.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <div className="text-xs text-[var(--color-text-muted)] mb-2">ნაპოვნი სიტყვები:</div>
          <div className="flex flex-wrap gap-2">
            {found.map((w, i) => {
              const match = game.words.find(gw => gw.word === w);
              return (
                <span key={i} className={`px-2 py-1 rounded-lg text-sm ${w === game.pangram ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10'}`}>
                  {w} <span className="text-[var(--color-text-muted)]">({match?.ka})</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Next game */}
      <button onClick={nextGame} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm mt-2">
        შემდეგი თამაში →
      </button>

      {/* Game selector */}
      <div className="mt-4 flex gap-2 justify-center">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => { setGameIdx(i); setFound([]); setInput(''); setMessage(''); }}
            className={`w-8 h-8 rounded-full text-xs font-bold ${i === gameIdx ? 'bg-[var(--color-primary)] text-black' : 'bg-white/10'}`}
          >
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}
