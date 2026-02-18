import { useState } from 'react';

interface GrammarQuestion {
  sentence: string;
  options: string[];
  correct: number;
  explanation: string;
  explanationKa: string;
}

interface GrammarLesson {
  id: string;
  title: string;
  titleKa: string;
  icon: string;
  level: string;
  theory: string;
  theoryKa: string;
  questions: GrammarQuestion[];
}

const lessons: GrammarLesson[] = [
  {
    id: 'articles',
    title: 'Articles: A, An, The',
    titleKa: 'არტიკლები: A, An, The',
    icon: '📰',
    level: 'A1',
    theory: `"A" is used before consonant sounds: a dog, a house.
"An" is used before vowel sounds: an apple, an egg.
"The" is used for specific things: the sun, the book on the table.`,
    theoryKa: `"A" გამოიყენება თანხმოვანი ბგერების წინ: a dog, a house.
"An" გამოიყენება ხმოვანი ბგერების წინ: an apple, an egg.
"The" გამოიყენება კონკრეტული საგნებისთვის: the sun, the book on the table.`,
    questions: [
      { sentence: 'I saw ___ elephant at the zoo.', options: ['a', 'an', 'the'], correct: 1, explanation: '"An" because "elephant" starts with a vowel sound.', explanationKa: '"An" რადგან "elephant" ხმოვნით იწყება.' },
      { sentence: 'She is ___ teacher.', options: ['a', 'an', 'the'], correct: 0, explanation: '"A" because "teacher" starts with a consonant sound.', explanationKa: '"A" რადგან "teacher" თანხმოვნით იწყება.' },
      { sentence: '___ moon is very bright tonight.', options: ['A', 'An', 'The'], correct: 2, explanation: '"The" because there is only one moon — it\'s specific.', explanationKa: '"The" რადგან მხოლოდ ერთი მთვარეა — კონკრეტულია.' },
      { sentence: 'I need ___ umbrella.', options: ['a', 'an', 'the'], correct: 1, explanation: '"An" because "umbrella" starts with a vowel sound.', explanationKa: '"An" რადგან "umbrella" ხმოვნით იწყება.' },
      { sentence: 'He bought ___ new car yesterday.', options: ['a', 'an', 'the'], correct: 0, explanation: '"A" because we\'re talking about any new car, not a specific one.', explanationKa: '"A" რადგან ნებისმიერ ახალ მანქანაზეა საუბარი.' },
    ]
  },
  {
    id: 'to-be-present',
    title: 'To Be: Am, Is, Are',
    titleKa: 'ზმნა "ყოფნა": Am, Is, Are',
    icon: '🔤',
    level: 'A1',
    theory: `I am (I'm) — მე ვარ
You are (You're) — შენ ხარ
He/She/It is (He's/She's/It's) — ის არის
We are (We're) — ჩვენ ვართ
They are (They're) — ისინი არიან`,
    theoryKa: `"Am" მხოლოდ "I"-სთან გამოიყენება.
"Is" მხოლოდ he/she/it-თან.
"Are" — you/we/they-სთან.`,
    questions: [
      { sentence: 'I ___ a student.', options: ['am', 'is', 'are'], correct: 0, explanation: 'Use "am" with "I".', explanationKa: '"I"-სთან "am" გამოიყენება.' },
      { sentence: 'They ___ from Georgia.', options: ['am', 'is', 'are'], correct: 2, explanation: 'Use "are" with "they".', explanationKa: '"They"-სთან "are" გამოიყენება.' },
      { sentence: 'She ___ very happy.', options: ['am', 'is', 'are'], correct: 1, explanation: 'Use "is" with "she".', explanationKa: '"She"-სთან "is" გამოიყენება.' },
      { sentence: 'We ___ best friends.', options: ['am', 'is', 'are'], correct: 2, explanation: 'Use "are" with "we".', explanationKa: '"We"-სთან "are" გამოიყენება.' },
      { sentence: 'The cat ___ on the table.', options: ['am', 'is', 'are'], correct: 1, explanation: 'Use "is" with "the cat" (it).', explanationKa: '"The cat" (it) — "is" გამოიყენება.' },
    ]
  },
  {
    id: 'simple-present',
    title: 'Simple Present Tense',
    titleKa: 'მარტივი აწმყო დრო',
    icon: '⏰',
    level: 'A1',
    theory: `For habits and facts. Add -s/-es for he/she/it:
I work → He works
I watch → She watches
I study → He studies (y → ies)
Negative: I don't / He doesn't + base verb
Question: Do you...? / Does he...?`,
    theoryKa: `ჩვევებისა და ფაქტებისთვის. He/she/it-სთვის დაამატე -s/-es:
I work → He works
I watch → She watches
უარყოფითი: I don't / He doesn't + ზმნა
კითხვითი: Do you...? / Does he...?`,
    questions: [
      { sentence: 'She ___ to school every day.', options: ['go', 'goes', 'going'], correct: 1, explanation: 'Add -es for "she" + go → goes.', explanationKa: '"She"-სთვის go → goes.' },
      { sentence: 'They ___ coffee in the morning.', options: ['drinks', 'drink', 'drinking'], correct: 1, explanation: '"They" uses base form: drink.', explanationKa: '"They"-სთან საბაზისო ფორმა: drink.' },
      { sentence: 'He ___ not like spicy food.', options: ['do', 'does', 'is'], correct: 1, explanation: '"He" uses "does" for negatives.', explanationKa: '"He"-სთან უარყოფითში "does" გამოიყენება.' },
      { sentence: '___ you speak English?', options: ['Do', 'Does', 'Are'], correct: 0, explanation: '"You" uses "Do" for questions.', explanationKa: '"You"-სთან კითხვაში "Do" გამოიყენება.' },
      { sentence: 'My mother ___ delicious food.', options: ['cook', 'cooks', 'cooking'], correct: 1, explanation: '"My mother" = she → cooks.', explanationKa: '"My mother" = she → cooks.' },
    ]
  },
  {
    id: 'simple-past',
    title: 'Simple Past Tense',
    titleKa: 'მარტივი წარსული დრო',
    icon: '⏪',
    level: 'A2',
    theory: `For completed actions. Regular verbs: add -ed.
work → worked, play → played, study → studied
Irregular verbs: go → went, eat → ate, see → saw, buy → bought
Negative: didn't + base verb (He didn't go)
Question: Did you...? (Did you eat?)`,
    theoryKa: `დასრულებული მოქმედებებისთვის. რეგულარული: დაამატე -ed.
work → worked, play → played
არარეგულარული: go → went, eat → ate, see → saw
უარყოფითი: didn't + ზმნა
კითხვითი: Did you...?`,
    questions: [
      { sentence: 'I ___ to the store yesterday.', options: ['go', 'went', 'going'], correct: 1, explanation: 'Go → went (irregular past).', explanationKa: 'Go → went (არარეგულარული).' },
      { sentence: 'She ___ a great movie last night.', options: ['watched', 'watches', 'watching'], correct: 0, explanation: 'Watch → watched (regular: add -ed).', explanationKa: 'Watch → watched (რეგულარული: +ed).' },
      { sentence: 'They ___ not come to the party.', options: ['do', 'did', 'were'], correct: 1, explanation: 'Past negative uses "did not".', explanationKa: 'წარსული უარყოფითი: "did not".' },
      { sentence: 'We ___ pizza for dinner.', options: ['eat', 'ate', 'eaten'], correct: 1, explanation: 'Eat → ate (irregular past).', explanationKa: 'Eat → ate (არარეგულარული).' },
      { sentence: '___ he finish the homework?', options: ['Do', 'Did', 'Was'], correct: 1, explanation: 'Past question uses "Did".', explanationKa: 'წარსულის კითხვა: "Did".' },
    ]
  },
  {
    id: 'pronouns',
    title: 'Personal Pronouns',
    titleKa: 'პირის ნაცვალსახელები',
    icon: '👤',
    level: 'A1',
    theory: `Subject: I, you, he, she, it, we, they
Object: me, you, him, her, it, us, them
Possessive: my, your, his, her, its, our, their

Subject does the action: He likes coffee.
Object receives the action: She called him.
Possessive shows ownership: That is my book.`,
    theoryKa: `სუბიექტი: I, you, he, she, it, we, they
ობიექტი: me, you, him, her, it, us, them
კუთვნილებითი: my, your, his, her, its, our, their

სუბიექტი მოქმედებს: He likes coffee.
ობიექტი იღებს მოქმედებას: She called him.
კუთვნილებითი: That is my book.`,
    questions: [
      { sentence: 'Can you give ___ the book?', options: ['I', 'me', 'my'], correct: 1, explanation: '"Me" is the object pronoun for "I".', explanationKa: '"Me" არის "I"-ს ობიექტური ფორმა.' },
      { sentence: '___ house is very big.', options: ['They', 'Them', 'Their'], correct: 2, explanation: '"Their" shows possession.', explanationKa: '"Their" კუთვნილებას აჩვენებს.' },
      { sentence: 'She loves ___ dog very much.', options: ['she', 'her', 'hers'], correct: 1, explanation: '"Her" is the possessive adjective.', explanationKa: '"Her" კუთვნილებითი ზედსართავია.' },
      { sentence: '___ are going to the cinema.', options: ['Us', 'We', 'Our'], correct: 1, explanation: '"We" is the subject pronoun.', explanationKa: '"We" სუბიექტური ნაცვალსახელია.' },
      { sentence: 'I saw ___ at the park.', options: ['they', 'them', 'their'], correct: 1, explanation: '"Them" is the object pronoun for "they".', explanationKa: '"Them" არის "they"-ს ობიექტური ფორმა.' },
    ]
  },
  {
    id: 'comparatives',
    title: 'Comparatives & Superlatives',
    titleKa: 'შედარებითი და აღმატებითი ხარისხი',
    icon: '📏',
    level: 'A2',
    theory: `Short words: add -er/-est
tall → taller → tallest
big → bigger → biggest

Long words: use more/most
beautiful → more beautiful → most beautiful

Irregular:
good → better → best
bad → worse → worst`,
    theoryKa: `მოკლე სიტყვები: დაამატე -er/-est
tall → taller → tallest

გრძელი სიტყვები: more/most
beautiful → more beautiful → most beautiful

არარეგულარული:
good → better → best
bad → worse → worst`,
    questions: [
      { sentence: 'She is ___ than her sister.', options: ['tall', 'taller', 'tallest'], correct: 1, explanation: 'Comparing two people: use -er form.', explanationKa: 'ორის შედარება: -er ფორმა.' },
      { sentence: 'This is the ___ movie I\'ve ever seen.', options: ['good', 'better', 'best'], correct: 2, explanation: 'Superlative (the best) for "the most".', explanationKa: 'აღმატებითი ხარისხი: the best.' },
      { sentence: 'My car is ___ than yours.', options: ['fast', 'faster', 'fastest'], correct: 1, explanation: 'Comparing two: use -er.', explanationKa: 'ორის შედარება: -er.' },
      { sentence: 'English is ___ than math for me.', options: ['more interesting', 'most interesting', 'interesting'], correct: 0, explanation: 'Long word: use "more" for comparisons.', explanationKa: 'გრძელი სიტყვა: "more" შედარებისთვის.' },
      { sentence: 'Today is the ___ day of the year.', options: ['worse', 'worst', 'bad'], correct: 1, explanation: 'Superlative of "bad" = worst.', explanationKa: '"Bad"-ის აღმატებითი = worst.' },
    ]
  },
  {
    id: 'prepositions',
    title: 'Prepositions: In, On, At',
    titleKa: 'წინდებულები: In, On, At',
    icon: '📍',
    level: 'A1',
    theory: `Time:
at + exact time: at 5 o'clock, at noon
on + days/dates: on Monday, on March 5
in + months/years/parts of day: in January, in 2026, in the morning

Place:
at + specific point: at school, at the door
on + surface: on the table, on the wall
in + enclosed space: in the room, in the box`,
    theoryKa: `დრო:
at + ზუსტი დრო: at 5 o'clock
on + დღეები: on Monday
in + თვეები/წლები: in January, in the morning

ადგილი:
at + კონკრეტული წერტილი: at school
on + ზედაპირი: on the table
in + დახურული სივრცე: in the room`,
    questions: [
      { sentence: 'I wake up ___ 7 o\'clock.', options: ['in', 'on', 'at'], correct: 2, explanation: 'Use "at" for exact times.', explanationKa: 'ზუსტი დროსთან "at" გამოიყენება.' },
      { sentence: 'The meeting is ___ Monday.', options: ['in', 'on', 'at'], correct: 1, explanation: 'Use "on" for days of the week.', explanationKa: 'კვირის დღეებთან "on" გამოიყენება.' },
      { sentence: 'She was born ___ 1999.', options: ['in', 'on', 'at'], correct: 0, explanation: 'Use "in" for years.', explanationKa: 'წლებთან "in" გამოიყენება.' },
      { sentence: 'The book is ___ the table.', options: ['in', 'on', 'at'], correct: 1, explanation: 'Use "on" for surfaces.', explanationKa: 'ზედაპირზე "on" გამოიყენება.' },
      { sentence: 'He is ___ the kitchen.', options: ['in', 'on', 'at'], correct: 0, explanation: 'Use "in" for enclosed spaces/rooms.', explanationKa: 'დახურულ სივრცეში "in" გამოიყენება.' },
    ]
  },
  {
    id: 'present-continuous',
    title: 'Present Continuous',
    titleKa: 'აწმყო განგრძობითი დრო',
    icon: '🔄',
    level: 'A2',
    theory: `For actions happening NOW or temporary situations.
Form: am/is/are + verb-ing

I am working. She is eating. They are playing.
Negative: I am not working. She isn't eating.
Question: Are you working? Is she eating?

Spelling: write → writing (drop e), run → running (double consonant), play → playing`,
    theoryKa: `ახლა მიმდინარე მოქმედებებისთვის.
ფორმულა: am/is/are + ზმნა-ing

I am working. She is eating. They are playing.
უარყოფითი: I am not working.
კითხვითი: Are you working?`,
    questions: [
      { sentence: 'I ___ reading a book right now.', options: ['am', 'is', 'are'], correct: 0, explanation: '"I" uses "am".', explanationKa: '"I"-სთან "am".' },
      { sentence: 'The children ___ playing outside.', options: ['am', 'is', 'are'], correct: 2, explanation: '"Children" (they) uses "are".', explanationKa: '"Children" (they) — "are".' },
      { sentence: 'She is ___ dinner now.', options: ['cook', 'cooks', 'cooking'], correct: 2, explanation: 'Present continuous: am/is/are + verb-ing.', explanationKa: 'განგრძობითი: am/is/are + ზმნა-ing.' },
      { sentence: '___ they watching TV?', options: ['Am', 'Is', 'Are'], correct: 2, explanation: '"They" uses "Are" in questions.', explanationKa: '"They"-სთან კითხვაში "Are".' },
      { sentence: 'He is not ___ today.', options: ['work', 'works', 'working'], correct: 2, explanation: 'Negative continuous: not + verb-ing.', explanationKa: 'უარყოფითი განგრძობითი: not + ზმნა-ing.' },
    ]
  },
  {
    id: 'can-could',
    title: 'Can & Could',
    titleKa: 'Can და Could',
    icon: '💪',
    level: 'A2',
    theory: `Can = ability/permission (present)
I can swim. Can I go? She can't drive.

Could = past ability / polite request
I could run fast when I was young.
Could you help me, please?

No -s for he/she: He can (NOT "He cans")
Negative: cannot / can't, could not / couldn't`,
    theoryKa: `Can = შესაძლებლობა/ნებართვა (აწმყო)
I can swim. Can I go?

Could = წარსული შესაძლებლობა / თავაზიანი თხოვნა
I could run fast when I was young.
Could you help me?

He/she-სთანაც იგივე ფორმა: He can (არა "He cans")`,
    questions: [
      { sentence: 'She ___ speak three languages.', options: ['can', 'cans', 'could'], correct: 0, explanation: '"Can" — no -s even with she/he.', explanationKa: '"Can" — she/he-სთანაც -s არ დაემატება.' },
      { sentence: '___ you open the window, please?', options: ['Can', 'Could', 'Both are correct'], correct: 2, explanation: 'Both work, "could" is more polite.', explanationKa: 'ორივე სწორია, "could" უფრო თავაზიანია.' },
      { sentence: 'I ___ swim when I was five years old.', options: ['can', 'could', 'can\'t'], correct: 1, explanation: '"Could" for past ability.', explanationKa: '"Could" წარსული შესაძლებლობისთვის.' },
      { sentence: 'He ___ come to the party. He is sick.', options: ['can', 'can\'t', 'could'], correct: 1, explanation: '"Can\'t" for inability.', explanationKa: '"Can\'t" შეუძლებლობისთვის.' },
      { sentence: '___ I use your phone?', options: ['Can', 'Am', 'Do'], correct: 0, explanation: '"Can" for asking permission.', explanationKa: '"Can" ნებართვის სათხოვნელად.' },
    ]
  },
  {
    id: 'future-will-going',
    title: 'Future: Will & Going to',
    titleKa: 'მომავალი: Will და Going to',
    icon: '🚀',
    level: 'A2',
    theory: `Will = spontaneous decisions, promises, predictions
I'll help you. It will rain tomorrow.

Going to = planned actions, obvious predictions
I'm going to study medicine. Look at those clouds — it's going to rain!

Negative: won't / not going to
Question: Will you...? / Are you going to...?`,
    theoryKa: `Will = სპონტანური გადაწყვეტილება, დაპირება
I'll help you. It will rain tomorrow.

Going to = დაგეგმილი მოქმედება
I'm going to study medicine.

უარყოფითი: won't / not going to
კითხვითი: Will you...? / Are you going to...?`,
    questions: [
      { sentence: 'I ___ call you tomorrow.', options: ['will', 'going to', 'am'], correct: 0, explanation: '"Will" for promises/decisions.', explanationKa: '"Will" დაპირებისთვის.' },
      { sentence: 'She is ___ visit her grandma next week.', options: ['will', 'going to', 'goes'], correct: 1, explanation: '"Going to" for planned actions.', explanationKa: '"Going to" დაგეგმილი მოქმედებისთვის.' },
      { sentence: 'I think it ___ be a great day.', options: ['will', 'is going to', 'does'], correct: 0, explanation: '"Will" for predictions with "I think".', explanationKa: '"Will" პროგნოზისთვის "I think"-თან.' },
      { sentence: 'They ___ not come to the meeting.', options: ['will', 'are', 'do'], correct: 0, explanation: '"Will not" (won\'t) for future negative.', explanationKa: '"Will not" (won\'t) მომავლის უარყოფითი.' },
      { sentence: 'Look! The bus ___! Run!', options: ['will leave', 'is going to leave', 'leaves'], correct: 1, explanation: '"Going to" for obvious/imminent events.', explanationKa: '"Going to" აშკარა/მოახლოებული მოვლენისთვის.' },
    ]
  },
];

export default function GrammarExercises({ onBack }: { onBack: () => void }) {
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson | null>(null);
  const [showTheory, setShowTheory] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Lesson list
  if (!selectedLesson) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={onBack} className="text-[var(--color-primary)] mb-4 text-sm">← უკან</button>
        <h2 className="text-2xl font-bold mb-2">🏋️ გრამატიკა</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">აირჩიე თემა და ივარჯიშე</p>
        <div className="space-y-3">
          {lessons.map(l => (
            <button
              key={l.id}
              onClick={() => { setSelectedLesson(l); setShowTheory(true); setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); }}
              className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-4 text-left transition-colors flex items-center gap-3"
            >
              <span className="text-3xl">{l.icon}</span>
              <div className="flex-1">
                <div className="font-semibold">{l.titleKa}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{l.title}</div>
              </div>
              <span className="text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-1 rounded-full">{l.level}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Theory page
  if (showTheory) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={() => setSelectedLesson(null)} className="text-[var(--color-primary)] mb-4 text-sm">← თემები</button>
        <h2 className="text-xl font-bold mb-1">{selectedLesson.icon} {selectedLesson.titleKa}</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">{selectedLesson.title}</p>
        
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-[var(--color-primary)] mb-2">📖 წესი</h3>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{selectedLesson.theory}</pre>
        </div>
        
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-[var(--color-primary)] mb-2">🇬🇪 ქართულად</h3>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{selectedLesson.theoryKa}</pre>
        </div>

        <button
          onClick={() => setShowTheory(false)}
          className="w-full bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl text-lg"
        >
          ვარჯიშის დაწყება →
        </button>
      </div>
    );
  }

  // Finished
  if (finished) {
    const total = selectedLesson.questions.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
        <h2 className="text-2xl font-bold mb-2">
          {pct >= 80 ? 'შესანიშნავი!' : pct >= 50 ? 'კარგია!' : 'გაიმეორე!'}
        </h2>
        <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">{score}/{total}</p>
        <p className="text-[var(--color-text-muted)] mb-6">{pct}% სწორი</p>
        <div className="space-y-3">
          <button
            onClick={() => { setShowTheory(true); setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); }}
            className="w-full bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl"
          >
            🔄 თავიდან სცადე
          </button>
          <button
            onClick={() => setSelectedLesson(null)}
            className="w-full bg-[var(--color-bg-card)] py-3 rounded-xl"
          >
            სხვა თემა
          </button>
        </div>
      </div>
    );
  }

  // Quiz
  const q = selectedLesson.questions[currentQ];
  const isCorrect = selected !== null ? selected === q.correct : null;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setSelectedLesson(null)} className="text-[var(--color-primary)] text-sm">← თემები</button>
        <span className="text-sm text-[var(--color-text-muted)]">{currentQ + 1}/{selectedLesson.questions.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-6">
        <div
          className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
          style={{ width: `${((currentQ) / selectedLesson.questions.length) * 100}%` }}
        />
      </div>

      <p className="text-lg font-semibold mb-6">{q.sentence}</p>

      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => {
          let cls = 'w-full py-3 px-4 rounded-xl text-left font-medium transition-colors ';
          if (selected === null) {
            cls += 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)]';
          } else if (i === q.correct) {
            cls += 'bg-green-600/30 border-2 border-green-500';
          } else if (i === selected && i !== q.correct) {
            cls += 'bg-red-600/30 border-2 border-red-500';
          } else {
            cls += 'bg-[var(--color-bg-card)] opacity-50';
          }
          return (
            <button
              key={i}
              onClick={() => {
                if (selected !== null) return;
                setSelected(i);
                if (i === q.correct) setScore(s => s + 1);
              }}
              className={cls}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className={`rounded-xl p-4 mb-4 ${isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
          <p className="font-semibold mb-1">{isCorrect ? '✅ სწორია!' : '❌ არასწორია'}</p>
          <p className="text-sm">{q.explanationKa}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{q.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={() => {
            if (currentQ + 1 >= selectedLesson.questions.length) {
              setFinished(true);
            } else {
              setCurrentQ(c => c + 1);
              setSelected(null);
            }
          }}
          className="w-full bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl"
        >
          {currentQ + 1 >= selectedLesson.questions.length ? 'შედეგი →' : 'შემდეგი →'}
        </button>
      )}
    </div>
  );
}
