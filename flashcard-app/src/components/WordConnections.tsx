import { useState } from 'react';

interface Group {
  name: string;
  nameKa: string;
  color: string;
  words: string[];
}

interface Puzzle {
  groups: Group[];
}

const puzzles: Puzzle[] = [
  {
    groups: [
      { name: 'Fruits', nameKa: 'ხილი', color: 'bg-green-500/30 text-green-400', words: ['APPLE', 'BANANA', 'GRAPE', 'MANGO'] },
      { name: 'Colors', nameKa: 'ფერები', color: 'bg-purple-500/30 text-purple-400', words: ['RED', 'BLUE', 'GREEN', 'YELLOW'] },
      { name: 'Animals', nameKa: 'ცხოველები', color: 'bg-amber-500/30 text-amber-400', words: ['TIGER', 'EAGLE', 'WHALE', 'SNAKE'] },
      { name: 'Weather', nameKa: 'ამინდი', color: 'bg-cyan-500/30 text-cyan-400', words: ['RAIN', 'SNOW', 'WIND', 'STORM'] },
    ],
  },
  {
    groups: [
      { name: 'Body Parts', nameKa: 'სხეულის ნაწილები', color: 'bg-red-500/30 text-red-400', words: ['HEAD', 'HEART', 'HAND', 'FOOT'] },
      { name: 'Time', nameKa: 'დრო', color: 'bg-blue-500/30 text-blue-400', words: ['HOUR', 'MINUTE', 'SECOND', 'WEEK'] },
      { name: 'Clothes', nameKa: 'ტანსაცმელი', color: 'bg-pink-500/30 text-pink-400', words: ['SHIRT', 'PANTS', 'JACKET', 'DRESS'] },
      { name: 'School', nameKa: 'სკოლა', color: 'bg-emerald-500/30 text-emerald-400', words: ['PENCIL', 'TEACHER', 'LESSON', 'DESK'] },
    ],
  },
  {
    groups: [
      { name: 'Emotions', nameKa: 'ემოციები', color: 'bg-rose-500/30 text-rose-400', words: ['HAPPY', 'SAD', 'ANGRY', 'SCARED'] },
      { name: 'Sports', nameKa: 'სპორტი', color: 'bg-orange-500/30 text-orange-400', words: ['SOCCER', 'TENNIS', 'BOXING', 'GOLF'] },
      { name: 'Music', nameKa: 'მუსიკა', color: 'bg-violet-500/30 text-violet-400', words: ['GUITAR', 'PIANO', 'DRUMS', 'VIOLIN'] },
      { name: 'Food', nameKa: 'საკვები', color: 'bg-lime-500/30 text-lime-400', words: ['BREAD', 'CHEESE', 'RICE', 'SOUP'] },
    ],
  },
  {
    groups: [
      { name: 'Family', nameKa: 'ოჯახი', color: 'bg-pink-500/30 text-pink-400', words: ['MOTHER', 'FATHER', 'SISTER', 'BROTHER'] },
      { name: 'Rooms', nameKa: 'ოთახები', color: 'bg-teal-500/30 text-teal-400', words: ['KITCHEN', 'BEDROOM', 'BATHROOM', 'GARDEN'] },
      { name: 'Jobs', nameKa: 'პროფესიები', color: 'bg-indigo-500/30 text-indigo-400', words: ['DOCTOR', 'DRIVER', 'CHEF', 'PILOT'] },
      { name: 'Transport', nameKa: 'ტრანსპორტი', color: 'bg-sky-500/30 text-sky-400', words: ['TRAIN', 'BOAT', 'PLANE', 'BICYCLE'] },
    ],
  },
  {
    groups: [
      { name: 'Nature', nameKa: 'ბუნება', color: 'bg-green-500/30 text-green-400', words: ['MOUNTAIN', 'RIVER', 'FOREST', 'OCEAN'] },
      { name: 'Verbs of Movement', nameKa: 'მოძრაობის ზმნები', color: 'bg-amber-500/30 text-amber-400', words: ['RUN', 'JUMP', 'SWIM', 'CLIMB'] },
      { name: 'Materials', nameKa: 'მასალები', color: 'bg-stone-400/30 text-stone-300', words: ['WOOD', 'GLASS', 'METAL', 'STONE'] },
      { name: 'Shapes', nameKa: 'ფორმები', color: 'bg-fuchsia-500/30 text-fuchsia-400', words: ['CIRCLE', 'SQUARE', 'TRIANGLE', 'STAR'] },
    ],
  },
  {
    groups: [
      { name: 'Drinks', nameKa: 'სასმელები', color: 'bg-cyan-500/30 text-cyan-400', words: ['COFFEE', 'JUICE', 'MILK', 'WATER'] },
      { name: 'Seasons', nameKa: 'სეზონები', color: 'bg-yellow-500/30 text-yellow-400', words: ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'] },
      { name: 'Buildings', nameKa: 'შენობები', color: 'bg-gray-400/30 text-gray-300', words: ['CHURCH', 'SCHOOL', 'HOSPITAL', 'MUSEUM'] },
      { name: 'Feelings', nameKa: 'გრძნობები', color: 'bg-red-500/30 text-red-400', words: ['LOVE', 'HOPE', 'FEAR', 'JOY'] },
    ],
  },
];

function getDailyPuzzle(): Puzzle {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return puzzles[seed % puzzles.length];
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WordConnections({ onBack }: { onBack: () => void }) {
  const puzzle = getDailyPuzzle();
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const allWords = shuffle(puzzle.groups.flatMap(g => g.words), seed);

  const [selected, setSelected] = useState<string[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);
  const maxMistakes = 4;

  const remainingWords = allWords.filter(w => !found.some(gi => puzzle.groups[gi].words.includes(w)));
  const gameOver = found.length === 4 || mistakes >= maxMistakes;

  function toggleWord(word: string) {
    if (gameOver) return;
    if (selected.includes(word)) {
      setSelected(s => s.filter(w => w !== word));
    } else if (selected.length < 4) {
      setSelected(s => [...s, word]);
    }
  }

  function submit() {
    if (selected.length !== 4) return;
    const groupIdx = puzzle.groups.findIndex(g =>
      g.words.every(w => selected.includes(w))
    );
    if (groupIdx !== -1) {
      setFound(f => [...f, groupIdx]);
      setSelected([]);
    } else {
      setMistakes(m => m + 1);
      setShake(true);
      setTimeout(() => { setShake(false); setSelected([]); }, 600);
    }
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 hover:text-white">← უკან</button>
      <h2 className="text-xl font-bold mb-2">🔗 სიტყვების კავშირი</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">იპოვე 4 ჯგუფი, თითო 4 სიტყვით · Find 4 groups of 4 words</p>

      {/* Mistakes indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-[var(--color-text-muted)]">შეცდომები:</span>
        {Array.from({ length: maxMistakes }).map((_, i) => (
          <span key={i} className={`w-3 h-3 rounded-full ${i < mistakes ? 'bg-red-500' : 'bg-white/20'}`} />
        ))}
      </div>

      {/* Found groups */}
      {found.map(gi => (
        <div key={gi} className={`${puzzle.groups[gi].color} rounded-xl p-3 mb-3 text-center`}>
          <div className="font-bold text-sm">{puzzle.groups[gi].nameKa} — {puzzle.groups[gi].name}</div>
          <div className="text-sm mt-1">{puzzle.groups[gi].words.join(', ')}</div>
        </div>
      ))}

      {/* Word grid */}
      {!gameOver && (
        <>
          <div className={`grid grid-cols-4 gap-2 mb-4 ${shake ? 'animate-shake' : ''}`}>
            {remainingWords.map(word => (
              <button
                key={word}
                onClick={() => toggleWord(word)}
                className={`p-3 rounded-xl text-sm font-bold transition-all ${
                  selected.includes(word)
                    ? 'bg-[var(--color-primary)] text-black scale-95'
                    : 'bg-[var(--color-bg-card)] hover:bg-white/10'
                }`}
              >
                {word}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSelected([])}
              className="flex-1 p-3 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text-muted)] font-medium"
            >წაშლა</button>
            <button
              onClick={submit}
              disabled={selected.length !== 4}
              className="flex-1 p-3 rounded-xl bg-[var(--color-primary)] text-black font-bold disabled:opacity-40"
            >შეამოწმე</button>
          </div>
        </>
      )}

      {/* Game over */}
      {gameOver && (
        <div className="text-center py-8">
          {found.length === 4 ? (
            <>
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-xl font-bold mb-1">ყველა იპოვე!</h3>
              <p className="text-[var(--color-text-muted)]">You found all groups! Mistakes: {mistakes}</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">😔</div>
              <h3 className="text-xl font-bold mb-1">თამაში დასრულდა</h3>
              <p className="text-[var(--color-text-muted)] mb-4">Game over! You found {found.length}/4 groups</p>
              {/* Show remaining groups */}
              {puzzle.groups.filter((_, i) => !found.includes(i)).map((g, i) => (
                <div key={i} className={`${g.color} rounded-xl p-3 mb-2 text-center opacity-60`}>
                  <div className="font-bold text-sm">{g.nameKa} — {g.name}</div>
                  <div className="text-sm mt-1">{g.words.join(', ')}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out 2; }
      `}</style>
    </div>
  );
}
