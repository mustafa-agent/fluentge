import { useState } from 'react';

interface Phrase {
  en: string;
  ka: string;
  pronunciation: string;
}

interface Situation {
  emoji: string;
  title: string;
  titleKa: string;
  phrases: Phrase[];
}

const situations: Situation[] = [
  {
    emoji: '✈️',
    title: 'Airport',
    titleKa: 'აეროპორტი',
    phrases: [
      { en: "Where is the check-in counter?", ka: "სად არის რეგისტრაციის სადგური?", pronunciation: "ვეარ იზ ძე ჩეკ-ინ ქაუნთერ?" },
      { en: "I'd like a window seat, please.", ka: "ფანჯრასთან ადგილი მინდა, თუ შეიძლება.", pronunciation: "აიდ ლაიქ ე ვინდოუ სიტ, ფლიზ." },
      { en: "How long is the flight?", ka: "რამდენ ხანს გრძელდება ფრენა?", pronunciation: "ჰაუ ლონგ იზ ძე ფლაით?" },
      { en: "Where is gate number 5?", ka: "სად არის მე-5 გეითი?", pronunciation: "ვეარ იზ გეით ნამბერ ფაივ?" },
      { en: "My luggage is missing.", ka: "ჩემი ბარგი დაიკარგა.", pronunciation: "მაი ლაგიჯ იზ მისინგ." },
      { en: "Is the flight on time?", ka: "ფრენა დროულად არის?", pronunciation: "იზ ძე ფლაით ონ თაიმ?" },
    ]
  },
  {
    emoji: '🏨',
    title: 'Hotel',
    titleKa: 'სასტუმრო',
    phrases: [
      { en: "I have a reservation under my name.", ka: "ჩემი სახელით ჯავშანი მაქვს.", pronunciation: "აი ჰევ ე რეზერვეიშენ ანდერ მაი ნეიმ." },
      { en: "What time is checkout?", ka: "რომელ საათზეა გასვლა?", pronunciation: "ვოთ თაიმ იზ ჩექაუთ?" },
      { en: "Can I get an extra towel?", ka: "შეიძლება დამატებითი პირსახოცი?", pronunciation: "ქენ აი გეთ ენ ექსტრა თაუელ?" },
      { en: "Is breakfast included?", ka: "საუზმე შედის ფასში?", pronunciation: "იზ ბრეკფესთ ინქლუდიდ?" },
      { en: "The WiFi password, please.", ka: "WiFi-ს პაროლი, თუ შეიძლება.", pronunciation: "ძე ვაიფაი პასვორდ, ფლიზ." },
      { en: "Can I extend my stay?", ka: "შემიძლია დარჩენის გახანგრძლივება?", pronunciation: "ქენ აი ექსთენდ მაი სთეი?" },
    ]
  },
  {
    emoji: '🍽️',
    title: 'Restaurant',
    titleKa: 'რესტორანი',
    phrases: [
      { en: "A table for two, please.", ka: "მაგიდა ორისთვის, თუ შეიძლება.", pronunciation: "ე თეიბლ ფორ თუ, ფლიზ." },
      { en: "Can I see the menu?", ka: "შემიძლია მენიუს ნახვა?", pronunciation: "ქენ აი სი ძე მენიუ?" },
      { en: "I'm allergic to nuts.", ka: "თხილის ალერგია მაქვს.", pronunciation: "აიმ ალერჯიქ თუ ნათს." },
      { en: "The bill, please.", ka: "ანგარიში, თუ შეიძლება.", pronunciation: "ძე ბილ, ფლიზ." },
      { en: "What do you recommend?", ka: "რას გვირჩევთ?", pronunciation: "ვოთ დუ იუ რეკომენდ?" },
      { en: "Can I pay by card?", ka: "ბარათით შემიძლია გადახდა?", pronunciation: "ქენ აი ფეი ბაი ქარდ?" },
    ]
  },
  {
    emoji: '🚕',
    title: 'Transportation',
    titleKa: 'ტრანსპორტი',
    phrases: [
      { en: "How much is a taxi to the center?", ka: "რა ღირს ტაქსი ცენტრამდე?", pronunciation: "ჰაუ მაჩ იზ ე თექსი თუ ძე სენთერ?" },
      { en: "Where is the nearest bus stop?", ka: "სად არის უახლოესი ავტობუსის გაჩერება?", pronunciation: "ვეარ იზ ძე ნიარესთ ბას სთოფ?" },
      { en: "One ticket to the airport, please.", ka: "ერთი ბილეთი აეროპორტამდე, თუ შეიძლება.", pronunciation: "ვან თიქეთ თუ ძე ეარფორთ, ფლიზ." },
      { en: "Does this bus go to the museum?", ka: "ეს ავტობუსი მუზეუმამდე მიდის?", pronunciation: "დაზ ძის ბას გოუ თუ ძე მიუზიემ?" },
      { en: "Stop here, please.", ka: "აქ გაჩერდით, თუ შეიძლება.", pronunciation: "სთოფ ჰიარ, ფლიზ." },
      { en: "How long does it take?", ka: "რამდენ ხანს სჭირდება?", pronunciation: "ჰაუ ლონგ დაზ ით თეიქ?" },
    ]
  },
  {
    emoji: '🛍️',
    title: 'Shopping',
    titleKa: 'შოპინგი',
    phrases: [
      { en: "How much does this cost?", ka: "რა ღირს ეს?", pronunciation: "ჰაუ მაჩ დაზ ძის ქოსთ?" },
      { en: "Do you have a smaller size?", ka: "უფრო პატარა ზომა გაქვთ?", pronunciation: "დუ იუ ჰევ ე სმოლერ საიზ?" },
      { en: "Can I try this on?", ka: "შემიძლია მოვზომო?", pronunciation: "ქენ აი თრაი ძის ონ?" },
      { en: "I'm just looking, thanks.", ka: "უბრალოდ ვათვალიერებ, მადლობა.", pronunciation: "აიმ ჯასთ ლუქინგ, თენქს." },
      { en: "Do you accept credit cards?", ka: "საკრედიტო ბარათს იღებთ?", pronunciation: "დუ იუ ექსეფთ ქრედით ქარდს?" },
      { en: "Can I get a discount?", ka: "ფასდაკლება შეიძლება?", pronunciation: "ქენ აი გეთ ე დისქაუნთ?" },
    ]
  },
  {
    emoji: '🏥',
    title: 'Emergency',
    titleKa: 'გადაუდებელი',
    phrases: [
      { en: "I need help!", ka: "დახმარება მჭირდება!", pronunciation: "აი ნიდ ჰელფ!" },
      { en: "Call an ambulance, please!", ka: "სასწრაფოს გამოიძახეთ!", pronunciation: "ქოლ ენ ემბიულენს, ფლიზ!" },
      { en: "Where is the nearest hospital?", ka: "სად არის უახლოესი საავადმყოფო?", pronunciation: "ვეარ იზ ძე ნიარესთ ჰოსპითალ?" },
      { en: "I lost my passport.", ka: "პასპორტი დამეკარგა.", pronunciation: "აი ლოსთ მაი პასპორთ." },
      { en: "I don't feel well.", ka: "კარგად არ ვარ.", pronunciation: "აი დონთ ფილ ველ." },
      { en: "Can you help me find my hotel?", ka: "სასტუმროს პოვნაში დამეხმარებით?", pronunciation: "ქენ იუ ჰელფ მი ფაინდ მაი ჰოთელ?" },
    ]
  },
  {
    emoji: '👋',
    title: 'Meeting People',
    titleKa: 'ახალი ადამიანები',
    phrases: [
      { en: "Nice to meet you!", ka: "სასიამოვნოა შენი გაცნობა!", pronunciation: "ნაის თუ მით იუ!" },
      { en: "Where are you from?", ka: "საიდან ხარ?", pronunciation: "ვეარ არ იუ ფრომ?" },
      { en: "I'm from Georgia.", ka: "საქართველოდან ვარ.", pronunciation: "აიმ ფრომ ჯორჯია." },
      { en: "Do you speak English?", ka: "ინგლისურად ლაპარაკობ?", pronunciation: "დუ იუ სფიქ ინგლიშ?" },
      { en: "My name is...", ka: "მე მქვია...", pronunciation: "მაი ნეიმ იზ..." },
      { en: "Can we keep in touch?", ka: "შეგვიძლია კონტაქტის შენარჩუნება?", pronunciation: "ქენ ვი ქიფ ინ თაჩ?" },
    ]
  },
  {
    emoji: '📍',
    title: 'Directions',
    titleKa: 'მიმართულებები',
    phrases: [
      { en: "Excuse me, where is the train station?", ka: "უკაცრავად, სად არის მატარებლის სადგური?", pronunciation: "ექსქიუზ მი, ვეარ იზ ძე თრეინ სთეიშენ?" },
      { en: "Turn left at the traffic light.", ka: "შუქნიშანთან მარცხნივ მოუხვიე.", pronunciation: "თერნ ლეფთ ეთ ძე თრეფიქ ლაით." },
      { en: "Go straight for two blocks.", ka: "ორი კვარტალი პირდაპირ წადი.", pronunciation: "გოუ სთრეით ფორ თუ ბლოქს." },
      { en: "Is it far from here?", ka: "შორს არის აქედან?", pronunciation: "იზ ით ფარ ფრომ ჰიარ?" },
      { en: "Can you show me on the map?", ka: "რუკაზე მაჩვენებ?", pronunciation: "ქენ იუ შოუ მი ონ ძე მეფ?" },
      { en: "It's on the right side.", ka: "მარჯვენა მხარეს არის.", pronunciation: "იტს ონ ძე რაით საიდ." },
    ]
  },
];

export default function TravelPhrases({ onBack }: { onBack: () => void }) {
  const [selectedSituation, setSelectedSituation] = useState<number | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.85;
    speechSynthesis.speak(u);
  };

  // Quiz: random phrases from all situations
  const [quizPhrases] = useState(() => {
    const all = situations.flatMap(s => s.phrases);
    return [...all].sort(() => Math.random() - 0.5).slice(0, 10);
  });

  if (quizDone) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">🗺️ შედეგი</h2>
        <div className="text-6xl mb-4">{score >= 8 ? '🌟' : score >= 5 ? '✈️' : '💪'}</div>
        <p className="text-3xl font-bold text-[var(--color-primary)] mb-2">{score}/10</p>
        <p className="text-[var(--color-text-muted)] mb-6">
          {score >= 8 ? 'მოგზაურობისთვის მზად ხარ!' : score >= 5 ? 'კარგი შედეგია!' : 'კიდევ ივარჯიშე!'}
        </p>
        <button onClick={onBack} className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold">დასრულება</button>
      </div>
    );
  }

  if (quizMode) {
    const phrase = quizPhrases[quizIndex];
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => { setQuizMode(false); setQuizIndex(0); setScore(0); }} className="text-[var(--color-primary)]">← უკან</button>
          <span className="text-sm text-[var(--color-text-muted)]">{quizIndex + 1}/10 | ✅ {score}</span>
        </div>
        <div className="bg-[var(--color-bg-card)] rounded-xl p-5 mb-4">
          <p className="text-sm text-[var(--color-text-muted)] mb-2">ქართულად:</p>
          <p className="text-lg font-bold mb-4">{phrase.ka}</p>
          {showAnswer ? (
            <>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">ინგლისურად:</p>
              <p className="text-lg text-[var(--color-primary)] font-bold mb-2">{phrase.en}</p>
              <button onClick={() => speak(phrase.en)} className="text-sm bg-[var(--color-bg-card-hover)] px-3 py-1 rounded-lg">🔊 მოსმენა</button>
            </>
          ) : (
            <p className="text-[var(--color-text-muted)] italic">დააჭირე სიტყვის სანახავად</p>
          )}
        </div>
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold mb-3">
            👀 პასუხის ნახვა
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (quizIndex + 1 >= 10) { setQuizDone(true); } else { setQuizIndex(i => i + 1); setShowAnswer(false); }
              }}
              className="bg-red-600/30 text-red-400 py-3 rounded-xl font-bold"
            >
              ❌ არ ვიცოდი
            </button>
            <button
              onClick={() => {
                setScore(s => s + 1);
                if (quizIndex + 1 >= 10) { setQuizDone(true); } else { setQuizIndex(i => i + 1); setShowAnswer(false); }
              }}
              className="bg-green-600/30 text-green-400 py-3 rounded-xl font-bold"
            >
              ✅ ვიცოდი!
            </button>
          </div>
        )}
      </div>
    );
  }

  if (selectedSituation !== null) {
    const sit = situations[selectedSituation];
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button onClick={() => setSelectedSituation(null)} className="text-[var(--color-primary)] mb-4">← უკან</button>
        <h2 className="text-xl font-bold mb-1">{sit.emoji} {sit.title}</h2>
        <p className="text-[var(--color-text-muted)] text-sm mb-4">{sit.titleKa}</p>
        <div className="space-y-3">
          {sit.phrases.map((p, i) => (
            <div key={i} className="bg-[var(--color-bg-card)] rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-white mb-1">{p.en}</p>
                  <p className="text-[var(--color-text-muted)] text-sm mb-1">🇬🇪 {p.ka}</p>
                  <p className="text-xs text-[var(--color-primary)]">🗣️ {p.pronunciation}</p>
                </div>
                <button onClick={() => speak(p.en)} className="ml-2 text-2xl">🔊</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-primary)] mb-4">← უკან</button>
      <h2 className="text-2xl font-bold mb-2">🗺️ სამოგზაურო ფრაზები</h2>
      <p className="text-[var(--color-text-muted)] mb-4">აუცილებელი ფრაზები მოგზაურობისთვის</p>
      
      <button
        onClick={() => setQuizMode(true)}
        className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold mb-4"
      >
        🧠 ქვიზი — შეამოწმე რამდენი იცი
      </button>

      <div className="grid grid-cols-2 gap-3">
        {situations.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelectedSituation(i)}
            className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-4 text-center transition-colors"
          >
            <div className="text-3xl mb-2">{s.emoji}</div>
            <div className="font-bold text-sm">{s.title}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{s.titleKa}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">{s.phrases.length} ფრაზა</div>
          </button>
        ))}
      </div>
    </div>
  );
}
