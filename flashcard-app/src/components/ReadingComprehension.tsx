import { useState } from 'react';
import { playCorrect, playWrong } from '../lib/sounds';

interface Props {
  onBack: () => void;
}

interface GlossaryItem {
  word: string;
  georgian: string;
}

interface Question {
  question: string;
  questionKa: string;
  options: string[];
  correct: number;
}

interface Story {
  id: string;
  title: string;
  titleKa: string;
  icon: string;
  text: string;
  glossary: GlossaryItem[];
  questions: Question[];
}

const stories: Story[] = [
  {
    id: 'daily1', title: 'Morning Routine', titleKa: 'დილის რუტინა', icon: '🌅',
    text: 'Maria wakes up at 7 AM every morning. She brushes her teeth and takes a shower. Then she makes coffee and eats toast with butter for breakfast. She leaves the house at 8 AM to catch the bus to work.',
    glossary: [
      { word: 'wakes up', georgian: 'იღვიძებს' },
      { word: 'brushes', georgian: 'იხეხს' },
      { word: 'shower', georgian: 'შხაპი' },
      { word: 'toast', georgian: 'ტოსტი' },
      { word: 'catch the bus', georgian: 'ავტობუსის დაჭერა' },
    ],
    questions: [
      { question: 'What time does Maria wake up?', questionKa: 'რომელ საათზე იღვიძებს მარია?', options: ['6 AM', '7 AM', '8 AM'], correct: 1 },
      { question: 'What does she eat for breakfast?', questionKa: 'რას ჭამს საუზმედ?', options: ['Eggs and bacon', 'Toast with butter', 'Cereal with milk'], correct: 1 },
      { question: 'How does she get to work?', questionKa: 'როგორ მიდის სამსახურში?', options: ['By car', 'By bus', 'On foot'], correct: 1 },
    ]
  },
  {
    id: 'travel1', title: 'A Trip to Paris', titleKa: 'მოგზაურობა პარიზში', icon: '🗼',
    text: 'Last summer, Tom visited Paris for the first time. He saw the Eiffel Tower and took many photos. He tried French food like croissants and onion soup. The trip lasted five days, and he wants to go back next year.',
    glossary: [
      { word: 'visited', georgian: 'ეწვია' },
      { word: 'Eiffel Tower', georgian: 'ეიფელის კოშკი' },
      { word: 'croissants', georgian: 'კრუასანები' },
      { word: 'lasted', georgian: 'გაგრძელდა' },
    ],
    questions: [
      { question: 'When did Tom visit Paris?', questionKa: 'როდის ეწვია ტომი პარიზს?', options: ['Last winter', 'Last summer', 'Last spring'], correct: 1 },
      { question: 'What food did he try?', questionKa: 'რა საჭმელი სცადა?', options: ['Pizza and pasta', 'Croissants and onion soup', 'Sushi and rice'], correct: 1 },
      { question: 'How long was the trip?', questionKa: 'რამდენ ხანს გაგრძელდა მოგზაურობა?', options: ['Three days', 'Five days', 'One week'], correct: 1 },
    ]
  },
  {
    id: 'work1', title: 'The New Job', titleKa: 'ახალი სამსახური', icon: '💼',
    text: 'Sarah started a new job at a technology company last month. Her colleagues are friendly and helpful. She works from 9 AM to 5 PM and sometimes works from home on Fridays. She enjoys learning new skills every day.',
    glossary: [
      { word: 'colleagues', georgian: 'კოლეგები' },
      { word: 'friendly', georgian: 'მეგობრული' },
      { word: 'helpful', georgian: 'დამხმარე' },
      { word: 'skills', georgian: 'უნარები' },
    ],
    questions: [
      { question: 'Where does Sarah work?', questionKa: 'სად მუშაობს სარა?', options: ['A hospital', 'A technology company', 'A school'], correct: 1 },
      { question: 'When does she work from home?', questionKa: 'როდის მუშაობს სახლიდან?', options: ['Mondays', 'Wednesdays', 'Fridays'], correct: 2 },
      { question: 'How are her colleagues?', questionKa: 'როგორები არიან კოლეგები?', options: ['Strict and quiet', 'Friendly and helpful', 'Lazy and rude'], correct: 1 },
    ]
  },
  {
    id: 'food1', title: 'Cooking Dinner', titleKa: 'ვახშმის მომზადება', icon: '🍳',
    text: 'David loves cooking Italian food. Tonight, he is making pasta with tomato sauce and fresh basil. He also prepared a green salad with olive oil. His family always enjoys his meals, especially his homemade garlic bread.',
    glossary: [
      { word: 'sauce', georgian: 'სოუსი' },
      { word: 'basil', georgian: 'რეჰანი' },
      { word: 'prepared', georgian: 'მოამზადა' },
      { word: 'homemade', georgian: 'სახლში გაკეთებული' },
      { word: 'garlic', georgian: 'ნიორი' },
    ],
    questions: [
      { question: 'What kind of food does David like to cook?', questionKa: 'რა სამზარეულო მოსწონს დევიდს?', options: ['Chinese', 'Italian', 'Mexican'], correct: 1 },
      { question: 'What is in the salad?', questionKa: 'რა არის სალათში?', options: ['Cheese and croutons', 'Olive oil', 'Butter and cream'], correct: 1 },
      { question: 'What does his family especially enjoy?', questionKa: 'რა მოსწონთ განსაკუთრებით ოჯახს?', options: ['The pasta', 'The salad', 'The garlic bread'], correct: 2 },
    ]
  },
  {
    id: 'sports1', title: 'Football Match', titleKa: 'ფეხბურთის მატჩი', icon: '⚽',
    text: 'Every Saturday, Alex plays football with his friends in the park. Last week, his team won 3 to 1. Alex scored two goals and was very happy. After the game, they went to a café and celebrated with cold drinks.',
    glossary: [
      { word: 'scored', georgian: 'გაიტანა (გოლი)' },
      { word: 'goals', georgian: 'გოლები' },
      { word: 'celebrated', georgian: 'იზეიმეს' },
      { word: 'won', georgian: 'მოიგეს' },
    ],
    questions: [
      { question: 'When does Alex play football?', questionKa: 'როდის თამაშობს ალექსი ფეხბურთს?', options: ['Every Sunday', 'Every Saturday', 'Every Friday'], correct: 1 },
      { question: 'What was the final score?', questionKa: 'რა იყო საბოლოო ანგარიში?', options: ['2 to 1', '3 to 1', '3 to 2'], correct: 1 },
      { question: 'What did they do after the game?', questionKa: 'რა გააკეთეს მატჩის შემდეგ?', options: ['Went home', 'Went to a café', 'Played another game'], correct: 1 },
    ]
  },
  {
    id: 'tech1', title: 'The Smartphone', titleKa: 'სმარტფონი', icon: '📱',
    text: 'Anna got a new smartphone for her birthday. It has a big screen and a great camera. She uses it to take photos, listen to music, and chat with friends. She also downloaded a language learning app to study English.',
    glossary: [
      { word: 'smartphone', georgian: 'სმარტფონი' },
      { word: 'screen', georgian: 'ეკრანი' },
      { word: 'downloaded', georgian: 'ჩამოტვირთა' },
      { word: 'language learning', georgian: 'ენის სწავლა' },
    ],
    questions: [
      { question: 'Why did Anna get a new phone?', questionKa: 'რატომ მიიღო ანამ ახალი ტელეფონი?', options: ['She bought it', 'For her birthday', 'She won it'], correct: 1 },
      { question: 'What does she use it for?', questionKa: 'რისთვის იყენებს?', options: ['Only calls', 'Photos, music, and chatting', 'Only games'], correct: 1 },
      { question: 'What app did she download?', questionKa: 'რა აპლიკაცია ჩამოტვირთა?', options: ['A game', 'A language learning app', 'A cooking app'], correct: 1 },
    ]
  },
  {
    id: 'nature1', title: 'A Walk in the Forest', titleKa: 'სეირნობა ტყეში', icon: '🌲',
    text: 'On Sunday, Lisa went for a walk in the forest near her village. The trees were tall and green. She saw a small deer drinking water from a stream. Birds were singing in the branches. It was a peaceful and beautiful day.',
    glossary: [
      { word: 'forest', georgian: 'ტყე' },
      { word: 'deer', georgian: 'ირემი' },
      { word: 'stream', georgian: 'ნაკადული' },
      { word: 'branches', georgian: 'ტოტები' },
      { word: 'peaceful', georgian: 'მშვიდი' },
    ],
    questions: [
      { question: 'When did Lisa go for a walk?', questionKa: 'როდის წავიდა ლიზა სეირნობაზე?', options: ['Saturday', 'Sunday', 'Monday'], correct: 1 },
      { question: 'What animal did she see?', questionKa: 'რა ცხოველი ნახა?', options: ['A rabbit', 'A deer', 'A fox'], correct: 1 },
      { question: 'How was the day described?', questionKa: 'როგორ აღწერეს დღე?', options: ['Rainy and cold', 'Peaceful and beautiful', 'Hot and windy'], correct: 1 },
    ]
  },
  {
    id: 'friend1', title: 'Best Friends', titleKa: 'საუკეთესო მეგობრები', icon: '👫',
    text: 'Nino and Kate have been best friends since school. They live in the same city but work in different places. Every weekend, they meet for coffee and talk about their week. Sometimes they go to the cinema or cook dinner together. Their friendship is very important to both of them.',
    glossary: [
      { word: 'since', georgian: '-დან' },
      { word: 'different', georgian: 'განსხვავებული' },
      { word: 'weekend', georgian: 'შაბათ-კვირა' },
      { word: 'cinema', georgian: 'კინო' },
      { word: 'friendship', georgian: 'მეგობრობა' },
    ],
    questions: [
      { question: 'How long have Nino and Kate been friends?', questionKa: 'რამდენი ხანია მეგობრები ნინო და ქეით?', options: ['Since university', 'Since school', 'Since last year'], correct: 1 },
      { question: 'What do they do every weekend?', questionKa: 'რას აკეთებენ ყოველ შაბათ-კვირას?', options: ['Go shopping', 'Meet for coffee', 'Play sports'], correct: 1 },
      { question: 'Do they work in the same place?', questionKa: 'ერთ ადგილას მუშაობენ?', options: ['Yes', 'No, different places', 'They don\'t work'], correct: 1 },
    ]
  },
];

export default function ReadingComprehension({ onBack }: Props) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [showingStory, setShowingStory] = useState(true);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try { const s = localStorage.getItem('fluentge_reading_completed'); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
  });

  function saveCompleted(ids: Set<string>) {
    localStorage.setItem('fluentge_reading_completed', JSON.stringify([...ids]));
    setCompletedIds(ids);
  }

  function startStory(s: Story) {
    setSelectedStory(s);
    setQuestionIndex(0);
    setScore(0);
    setAnswered(null);
    setFinished(false);
    setShowingStory(true);
  }

  // Story list
  if (!selectedStory) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
          <h2 className="text-xl font-bold">📖 კითხვის გაგება</h2>
          <div />
        </div>
        <p className="text-[var(--color-text-muted)] text-sm text-center mb-6">წაიკითხე მოთხრობა და უპასუხე კითხვებს</p>
        <div className="space-y-3">
          {stories.map(s => (
            <button key={s.id} onClick={() => startStory(s)} className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-2xl p-4 flex items-center gap-4 transition-colors text-left">
              <span className="text-3xl">{s.icon}</span>
              <div className="flex-1">
                <div className="font-semibold">{s.titleKa}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{s.title}</div>
              </div>
              {completedIds.has(s.id) && <span className="text-green-400">✅</span>}
            </button>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
          {completedIds.size}/{stories.length} დასრულებული
        </div>
      </div>
    );
  }

  // Finished
  if (finished) {
    const pct = Math.round((score / selectedStory.questions.length) * 100);
    return (
      <div className="px-4 py-8 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2">მოთხრობა დასრულდა!</h2>
        <p className="text-lg mb-1">{selectedStory.icon} {selectedStory.titleKa}</p>
        <p className="text-[var(--color-text-muted)] mb-6">{score}/{selectedStory.questions.length} სწორი ({pct}%)</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => startStory(selectedStory)} className="bg-[var(--color-primary)] text-black font-bold py-3 px-6 rounded-xl">🔁 თავიდან</button>
          <button onClick={() => setSelectedStory(null)} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] py-3 px-6 rounded-xl">📋 მოთხრობები</button>
        </div>
      </div>
    );
  }

  // Reading the story
  if (showingStory) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setSelectedStory(null)} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
          <span className="text-sm font-medium">{selectedStory.icon} {selectedStory.titleKa}</span>
          <div />
        </div>

        <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-lg mb-3">{selectedStory.title}</h3>
          <p className="text-[var(--color-text)] leading-relaxed text-base">{selectedStory.text}</p>
        </div>

        {/* Glossary */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 mb-6">
          <h4 className="text-sm font-bold text-[var(--color-primary)] mb-2">📚 ლექსიკონი:</h4>
          <div className="space-y-1">
            {selectedStory.glossary.map((g, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="font-medium">{g.word}</span>
                <span className="text-[var(--color-text-muted)]">{g.georgian}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setShowingStory(false)} className="w-full bg-[var(--color-primary)] text-black font-bold py-3 rounded-xl">
          📝 კითხვებზე გადასვლა
        </button>
      </div>
    );
  }

  // Questions
  const q = selectedStory.questions[questionIndex];

  function handleAnswer(idx: number) {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === q.correct) { setScore(s => s + 1); playCorrect(); } else { playWrong(); }
  }

  function handleNext() {
    setAnswered(null);
    if (questionIndex + 1 >= selectedStory!.questions.length) {
      setFinished(true);
      const newCompleted = new Set(completedIds);
      newCompleted.add(selectedStory!.id);
      saveCompleted(newCompleted);
      return;
    }
    setQuestionIndex(i => i + 1);
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setShowingStory(true)} className="text-[var(--color-text-muted)] hover:text-white">← ტექსტი</button>
        <span className="text-sm text-[var(--color-text-muted)]">კითხვა {questionIndex + 1}/{selectedStory.questions.length}</span>
        <span className="text-sm text-[var(--color-primary)]">✅ {score}</span>
      </div>
      <div className="h-2 bg-[var(--color-bg-card)] rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${((questionIndex + 1) / selectedStory.questions.length) * 100}%` }} />
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 mb-4">
        <div className="font-semibold text-lg mb-1">{q.question}</div>
        <div className="text-sm text-[var(--color-text-muted)]">{q.questionKa}</div>
      </div>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => {
          let cls = 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)]';
          if (answered !== null) {
            if (i === q.correct) cls = 'bg-green-500/20 border-green-500 text-green-400';
            else if (i === answered) cls = 'bg-red-500/20 border-red-500 text-red-400';
            else cls = 'bg-[var(--color-bg-card)] opacity-50';
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} disabled={answered !== null} className={`w-full text-left p-4 rounded-xl border border-white/5 transition-colors ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>

      {answered !== null && (
        <button onClick={handleNext} className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] py-3 rounded-xl font-medium transition-colors">
          {questionIndex + 1 >= selectedStory.questions.length ? '🏁 დასრულება' : '→ შემდეგი'}
        </button>
      )}
    </div>
  );
}
