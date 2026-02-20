import { useState } from 'react';

interface WordPair {
  word1: string;
  word1Ka: string;
  word1Def: string;
  word1Example: string;
  word2: string;
  word2Ka: string;
  word2Def: string;
  word2Example: string;
  tip: string;
  tipKa: string;
}

const pairs: WordPair[] = [
  {
    word1: 'their', word1Ka: 'მათი', word1Def: 'Possessive — belongs to them',
    word1Example: 'Their house is big.',
    word2: 'there', word2Ka: 'იქ', word2Def: 'A place — location',
    word2Example: 'Put it over there.',
    tip: '"their" has "heir" (მემკვიდრე) = ownership', tipKa: '"their"-ში "heir" (მემკვიდრე) არის = საკუთრება'
  },
  {
    word1: 'affect', word1Ka: 'ზემოქმედება (ზმნა)', word1Def: 'Verb — to influence something',
    word1Example: 'Rain affects my mood.',
    word2: 'effect', word2Ka: 'ეფექტი (არსებითი)', word2Def: 'Noun — the result of a change',
    word2Example: 'The effect was amazing.',
    tip: 'A = Action (verb), E = End result (noun)', tipKa: 'A = მოქმედება (ზმნა), E = შედეგი (არსებითი)'
  },
  {
    word1: 'then', word1Ka: 'შემდეგ', word1Def: 'After that — time sequence',
    word1Example: 'I ate, then I left.',
    word2: 'than', word2Ka: 'ვიდრე', word2Def: 'Comparison word',
    word2Example: 'She is taller than me.',
    tip: '"then" = time (thEn = whEn), "than" = compare (thAn = compAre)', tipKa: '"then" = დრო, "than" = შედარება'
  },
  {
    word1: 'your', word1Ka: 'შენი', word1Def: 'Possessive — belongs to you',
    word1Example: 'Your phone is ringing.',
    word2: "you're", word2Ka: 'შენ ხარ', word2Def: 'Contraction of "you are"',
    word2Example: "You're very smart.",
    tip: 'Try replacing with "you are". If it works → you\'re', tipKa: 'სცადე "you are"-ით ჩანაცვლება. თუ მუშაობს → you\'re'
  },
  {
    word1: 'its', word1Ka: 'მისი (ნივთის)', word1Def: 'Possessive — belongs to it',
    word1Example: 'The dog wagged its tail.',
    word2: "it's", word2Ka: 'ეს არის', word2Def: 'Contraction of "it is" or "it has"',
    word2Example: "It's raining outside.",
    tip: 'Try "it is". Works? → it\'s. Doesn\'t? → its', tipKa: 'სცადე "it is". მუშაობს? → it\'s. არა? → its'
  },
  {
    word1: 'lose', word1Ka: 'დაკარგვა', word1Def: 'Verb — to not win or misplace',
    word1Example: "Don't lose your keys.",
    word2: 'loose', word2Ka: 'თავისუფალი/ფხვიერი', word2Def: 'Adjective — not tight',
    word2Example: 'These pants are too loose.',
    tip: 'Lose has LOST an O. Loose is LOOSE (long oo sound)', tipKa: '"Lose"-ს ერთი O აქვს, "loose"-ს ორი'
  },
  {
    word1: 'accept', word1Ka: 'მიღება', word1Def: 'Verb — to agree, receive',
    word1Example: 'I accept your offer.',
    word2: 'except', word2Ka: 'გარდა', word2Def: 'Preposition — excluding, but not',
    word2Example: 'Everyone came except Tom.',
    tip: 'Accept = agree. Except = exclude (EX = out)', tipKa: 'Accept = თანხმობა. Except = გამოკლება'
  },
  {
    word1: 'advice', word1Ka: 'რჩევა (არსებითი)', word1Def: 'Noun — recommendation',
    word1Example: 'She gave me good advice.',
    word2: 'advise', word2Ka: 'რჩევა (ზმნა)', word2Def: 'Verb — to give recommendation',
    word2Example: 'I advise you to study.',
    tip: 'Advice (noun) = ice. Advise (verb) = wise', tipKa: 'Advice = არსებითი. Advise = ზმნა'
  },
  {
    word1: 'who', word1Ka: 'ვინ (სუბიექტი)', word1Def: 'Subject — does the action',
    word1Example: 'Who called you?',
    word2: 'whom', word2Ka: 'ვის (ობიექტი)', word2Def: 'Object — receives the action',
    word2Example: 'To whom did you speak?',
    tip: 'who = he/she, whom = him/her (both end in M)', tipKa: 'who = ის (სუბიექტი), whom = მას (ობიექტი)'
  },
  {
    word1: 'borrow', word1Ka: 'სესხება (აიღო)', word1Def: 'Take something temporarily',
    word1Example: 'Can I borrow your pen?',
    word2: 'lend', word2Ka: 'სესხება (მისცა)', word2Def: 'Give something temporarily',
    word2Example: 'Can you lend me your pen?',
    tip: 'Borrow = take ← . Lend = give →', tipKa: 'Borrow = აიღე. Lend = მიეცი'
  },
  {
    word1: 'lay', word1Ka: 'დადება', word1Def: 'Put something down (needs object)',
    word1Example: 'Lay the book on the table.',
    word2: 'lie', word2Ka: 'წოლა', word2Def: 'Recline, rest (no object)',
    word2Example: 'I lie down on the bed.',
    tip: 'LAY = pLAce (needs object). LIE = reclIne (no object)', tipKa: 'Lay = დადება (ობიექტით). Lie = წოლა (ობიექტის გარეშე)'
  },
  {
    word1: 'principle', word1Ka: 'პრინციპი', word1Def: 'A rule, belief, or truth',
    word1Example: 'He is a man of principle.',
    word2: 'principal', word2Ka: 'დირექტორი / მთავარი', word2Def: 'Head of school / main',
    word2Example: 'The principal called a meeting.',
    tip: 'The principAL is your pAL (friend)', tipKa: 'PrincipAL = შენი მეგობარი (pAL)'
  },
  {
    word1: 'quite', word1Ka: 'საკმაოდ', word1Def: 'Fairly, rather',
    word1Example: "It's quite cold today.",
    word2: 'quiet', word2Ka: 'ჩუმი', word2Def: 'Not loud, silent',
    word2Example: 'Please be quiet in the library.',
    tip: 'quiET = sil-ENT (both end similarly)', tipKa: 'Quite = საკმაოდ. Quiet = ჩუმად'
  },
  {
    word1: 'weather', word1Ka: 'ამინდი', word1Def: 'Rain, sun, clouds, etc.',
    word1Example: 'The weather is nice today.',
    word2: 'whether', word2Ka: 'თუ არა', word2Def: 'If — expressing doubt or choice',
    word2Example: "I don't know whether to go.",
    tip: 'Weather = what you see outside. Whether = if/or', tipKa: 'Weather = ამინდი. Whether = თუ არა'
  },
  {
    word1: 'beside', word1Ka: 'გვერდით', word1Def: 'Next to',
    word1Example: 'Sit beside me.',
    word2: 'besides', word2Ka: 'გარდა ამისა', word2Def: 'In addition to, moreover',
    word2Example: 'Besides English, I speak French.',
    tip: 'Beside = by side. Besides = in addition (has S for "more stuff")', tipKa: 'Beside = გვერდით. Besides = გარდა ამისა'
  },
  {
    word1: 'farther', word1Ka: 'უფრო შორს (მანძილი)', word1Def: 'Physical distance',
    word1Example: 'The store is farther away.',
    word2: 'further', word2Ka: 'უფრო მეტად (ხარისხი)', word2Def: 'Additional, more (abstract)',
    word2Example: 'We need further discussion.',
    tip: 'fARther = fAR (distance). fURther = fUtURe (abstract)', tipKa: 'Farther = მანძილი. Further = დამატებითი'
  },
  {
    word1: 'fewer', word1Ka: 'ნაკლები (თვლადი)', word1Def: 'Less in number — countable nouns',
    word1Example: 'Fewer people came today.',
    word2: 'less', word2Ka: 'ნაკლები (უთვლადი)', word2Def: 'Smaller amount — uncountable nouns',
    word2Example: 'I have less time now.',
    tip: 'Can you count it? fewer. Can\'t? less', tipKa: 'თვლადი? fewer. უთვლადი? less'
  },
  {
    word1: 'historic', word1Ka: 'ისტორიული (მნიშვნელოვანი)', word1Def: 'Famous, important in history',
    word1Example: 'It was a historic moment.',
    word2: 'historical', word2Ka: 'ისტორიული (დაკავშირებული)', word2Def: 'Related to history',
    word2Example: 'I read a historical novel.',
    tip: 'Historic = important. Historical = about history', tipKa: 'Historic = მნიშვნელოვანი. Historical = ისტორიასთან დაკავშირებული'
  },
];

interface Props { onBack: () => void; }

export default function ConfusingWords({ onBack }: Props) {
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [current, setCurrent] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizItems] = useState(() => {
    const items: { sentence: string; answer: string; options: string[] }[] = [];
    pairs.forEach(p => {
      items.push({ sentence: p.word1Example.replace(new RegExp(p.word1, 'i'), '___'), answer: p.word1, options: [p.word1, p.word2].sort(() => Math.random() - 0.5) });
      items.push({ sentence: p.word2Example.replace(new RegExp(p.word2.replace("'", "'"), 'i'), '___'), answer: p.word2, options: [p.word1, p.word2].sort(() => Math.random() - 0.5) });
    });
    return items.sort(() => Math.random() - 0.5).slice(0, 15);
  });

  if (mode === 'learn') {
    const p = pairs[current];
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
        <h2 className="text-xl font-bold mb-2">🔀 დამაბნეველი სიტყვები</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('learn')} className="px-3 py-1 rounded-full text-sm bg-[var(--color-primary)] text-black font-bold">სწავლა</button>
          <button onClick={() => setMode('quiz')} className="px-3 py-1 rounded-full text-sm bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">ქვიზი</button>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">{current + 1} / {pairs.length}</p>

        <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-blue-500/15 rounded-xl p-3">
              <div className="text-lg font-bold text-blue-400">{p.word1}</div>
              <div className="text-sm text-[var(--color-text-muted)]">{p.word1Ka}</div>
              <div className="text-xs mt-1">{p.word1Def}</div>
              <div className="text-xs mt-2 italic text-blue-300">"{p.word1Example}"</div>
            </div>
            <div className="flex-1 bg-purple-500/15 rounded-xl p-3">
              <div className="text-lg font-bold text-purple-400">{p.word2}</div>
              <div className="text-sm text-[var(--color-text-muted)]">{p.word2Ka}</div>
              <div className="text-xs mt-1">{p.word2Def}</div>
              <div className="text-xs mt-2 italic text-purple-300">"{p.word2Example}"</div>
            </div>
          </div>
          <div className="bg-amber-500/15 rounded-xl p-3">
            <div className="text-xs text-amber-400 mb-1">💡 დაიმახსოვრე:</div>
            <div className="text-sm font-medium">{p.tip}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">{p.tipKa}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] disabled:opacity-30">← წინა</button>
          <button onClick={() => setCurrent(c => Math.min(pairs.length - 1, c + 1))} disabled={current === pairs.length - 1} className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] text-black font-bold disabled:opacity-30">შემდეგი →</button>
        </div>
      </div>
    );
  }

  // Quiz mode
  if (quizIdx >= quizItems.length) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 block">← უკან</button>
        <div className="text-6xl mb-4">{score >= 12 ? '🏆' : score >= 8 ? '👏' : '📚'}</div>
        <h2 className="text-2xl font-bold mb-2">{score} / {quizItems.length}</h2>
        <p className="text-[var(--color-text-muted)] mb-6">{score >= 12 ? 'შესანიშნავი! ბრავო!' : score >= 8 ? 'კარგია! კიდევ ივარჯიშე!' : 'გაიმეორე სწავლის რეჟიმში!'}</p>
        <button onClick={() => { setMode('learn'); setCurrent(0); }} className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-black font-bold">თავიდან</button>
      </div>
    );
  }

  const q = quizItems[quizIdx];
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
      <h2 className="text-xl font-bold mb-2">🔀 ქვიზი</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">{quizIdx + 1} / {quizItems.length} · ქულა: {score}</p>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <p className="text-lg mb-4">შეავსე: <span className="font-bold">"{q.sentence}"</span></p>
        <div className="grid grid-cols-2 gap-3">
          {q.options.map(opt => {
            const isCorrect = opt === q.answer;
            const chosen = selected === opt;
            let cls = 'py-3 rounded-xl text-center font-bold transition-colors ';
            if (!selected) cls += 'bg-[var(--color-bg-card-hover)] hover:bg-white/10';
            else if (chosen && isCorrect) cls += 'bg-green-600/30 text-green-400';
            else if (chosen && !isCorrect) cls += 'bg-red-600/30 text-red-400';
            else if (isCorrect) cls += 'bg-green-600/20 text-green-400';
            else cls += 'bg-[var(--color-bg-card-hover)] opacity-50';
            return (
              <button key={opt} onClick={() => { if (!selected) { setSelected(opt); if (isCorrect) setScore(s => s + 1); }}} className={cls}>{opt}</button>
            );
          })}
        </div>
      </div>
      {selected && (
        <button onClick={() => { setQuizIdx(i => i + 1); setSelected(null); }} className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-black font-bold">შემდეგი →</button>
      )}
    </div>
  );
}
