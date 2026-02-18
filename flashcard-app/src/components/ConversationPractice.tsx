import { useState } from 'react';
import { playCorrect, playWrong } from '../lib/sounds';

interface Props {
  onBack: () => void;
}

interface Exchange {
  speaker: string;
  line: string;
  lineKa: string;
  options?: string[];
  optionsKa?: string[];
  correct?: number; // index of correct option
}

interface Scenario {
  id: string;
  title: string;
  titleKa: string;
  icon: string;
  exchanges: Exchange[];
}

const scenarios: Scenario[] = [
  {
    id: 'restaurant', title: 'At the Restaurant', titleKa: 'რესტორანში', icon: '🍽️',
    exchanges: [
      { speaker: 'Waiter', line: 'Good evening! Welcome to our restaurant. Table for how many?', lineKa: 'საღამო მშვიდობისა! კეთილი იყოს თქვენი მობრძანება. მაგიდა რამდენისთვის?' },
      { speaker: 'You', line: '', lineKa: '', options: ['Table for two, please.', 'I want food now.', 'Yes, restaurant.'], optionsKa: ['მაგიდა ორისთვის, თუ შეიძლება.', 'ახლავე მინდა საჭმელი.', 'დიახ, რესტორანი.'], correct: 0 },
      { speaker: 'Waiter', line: 'Here is the menu. Can I get you something to drink?', lineKa: 'აი მენიუ. შემიძლია სასმელი მოგართვათ?' },
      { speaker: 'You', line: '', lineKa: '', options: ['I\'ll have water, please.', 'Menu is paper.', 'Drink is liquid.'], optionsKa: ['წყალს მივიღებ, თუ შეიძლება.', 'მენიუ ქაღალდია.', 'სასმელი სითხეა.'], correct: 0 },
      { speaker: 'Waiter', line: 'Are you ready to order?', lineKa: 'მზად ხართ შეკვეთისთვის?' },
      { speaker: 'You', line: '', lineKa: '', options: ['Yes, I\'d like the grilled chicken, please.', 'Order is a word.', 'I don\'t know what food is.'], optionsKa: ['დიახ, შემწვარი ქათამი მინდა, თუ შეიძლება.', 'შეკვეთა სიტყვაა.', 'არ ვიცი რა არის საჭმელი.'], correct: 0 },
      { speaker: 'Waiter', line: 'Excellent choice! Would you like any dessert?', lineKa: 'შესანიშნავი არჩევანი! დესერტს ხომ არ ისურვებთ?' },
      { speaker: 'You', line: '', lineKa: '', options: ['No, thank you. Just the check, please.', 'Dessert is sweet thing.', 'I want all desserts.'], optionsKa: ['არა, გმადლობთ. მხოლოდ ანგარიშს, თუ შეიძლება.', 'დესერტი ტკბილი რამეა.', 'ყველა დესერტი მინდა.'], correct: 0 },
    ]
  },
  {
    id: 'airport', title: 'At the Airport', titleKa: 'აეროპორტში', icon: '✈️',
    exchanges: [
      { speaker: 'Agent', line: 'Good morning. May I see your passport and boarding pass?', lineKa: 'დილა მშვიდობისა. შემიძლია თქვენი პასპორტი და ჩასხდომის ბარათი ვნახო?' },
      { speaker: 'You', line: '', lineKa: '', options: ['Here you go.', 'What is passport?', 'I fly airplane.'], optionsKa: ['აი, ბრძანდით.', 'რა არის პასპორტი?', 'მე ვფრინავ თვითმფრინავით.'], correct: 0 },
      { speaker: 'Agent', line: 'Are you checking any bags today?', lineKa: 'აბარებთ ბარგს დღეს?' },
      { speaker: 'You', line: '', lineKa: '', options: ['Yes, one suitcase, please.', 'Bags are for carrying things.', 'Today is a day.'], optionsKa: ['დიახ, ერთ ჩემოდანს, თუ შეიძლება.', 'ჩანთები ნივთების სატარებელია.', 'დღეს დღეა.'], correct: 0 },
      { speaker: 'Agent', line: 'Your gate is B12. Boarding starts at 3:15 PM.', lineKa: 'თქვენი კარიბჭეა B12. ჩასხდომა იწყება 3:15-ზე.' },
      { speaker: 'You', line: '', lineKa: '', options: ['Thank you. Where is gate B12?', 'B12 is a number.', 'I like gates.'], optionsKa: ['გმადლობთ. სად არის B12 კარიბჭე?', 'B12 რიცხვია.', 'კარიბჭეები მომწონს.'], correct: 0 },
      { speaker: 'Agent', line: 'Go straight, then turn left after security. Have a nice flight!', lineKa: 'პირდაპირ წადით, შემდეგ მარცხნივ მოუხვიეთ დაცვის შემდეგ. სასიამოვნო ფრენას გისურვებთ!' },
      { speaker: 'You', line: '', lineKa: '', options: ['Thank you very much!', 'Left is a direction.', 'Security is important.'], optionsKa: ['დიდი მადლობა!', 'მარცხნივ მიმართულებაა.', 'დაცვა მნიშვნელოვანია.'], correct: 0 },
    ]
  },
  {
    id: 'hotel', title: 'At the Hotel', titleKa: 'სასტუმროში', icon: '🏨',
    exchanges: [
      { speaker: 'Receptionist', line: 'Welcome! Do you have a reservation?', lineKa: 'მოგესალმებით! გაქვთ ჯავშანი?' },
      { speaker: 'You', line: '', lineKa: '', options: ['Yes, under the name Smith.', 'Hotel has rooms.', 'Reservation is a long word.'], optionsKa: ['დიახ, სმითის სახელზე.', 'სასტუმროში ოთახებია.', 'ჯავშანი გრძელი სიტყვაა.'], correct: 0 },
      { speaker: 'Receptionist', line: 'I found it. A double room for three nights. Is that correct?', lineKa: 'ვიპოვე. ორადგილიანი ოთახი სამი ღამით. სწორია?' },
      { speaker: 'You', line: '', lineKa: '', options: ['Yes, that\'s correct.', 'Three is a number.', 'Nights are dark.'], optionsKa: ['დიახ, სწორია.', 'სამი რიცხვია.', 'ღამეები ბნელია.'], correct: 0 },
      { speaker: 'Receptionist', line: 'Your room is on the 5th floor. Here is your key card. Breakfast is from 7 to 10 AM.', lineKa: 'თქვენი ოთახი მე-5 სართულზეა. აი თქვენი გასაღების ბარათი. საუზმე 7-დან 10 საათამდეა.' },
      { speaker: 'You', line: '', lineKa: '', options: ['Great, thank you! Is there Wi-Fi?', 'Floor is under my feet.', 'I eat breakfast every day.'], optionsKa: ['მშვენიერი, გმადლობთ! არის Wi-Fi?', 'იატაკი ჩემს ფეხებქვეშაა.', 'ყოველდღე ვსაუზმობ.'], correct: 0 },
      { speaker: 'Receptionist', line: 'Yes, the Wi-Fi password is on the card. Enjoy your stay!', lineKa: 'დიახ, Wi-Fi-ს პაროლი ბარათზეა. სასიამოვნო ყოფნას გისურვებთ!' },
      { speaker: 'You', line: '', lineKa: '', options: ['Thank you! Have a good day.', 'Password has letters.', 'Stay means not leave.'], optionsKa: ['გმადლობთ! კარგ დღეს გისურვებთ.', 'პაროლს ასოები აქვს.', 'ყოფნა ნიშნავს არ წახვიდე.'], correct: 0 },
    ]
  },
  {
    id: 'shopping', title: 'Shopping', titleKa: 'საყიდლებზე', icon: '🛍️',
    exchanges: [
      { speaker: 'Shop assistant', line: 'Hi there! Can I help you find something?', lineKa: 'გამარჯობა! შემიძლია რამეს პოვნაში დაგეხმაროთ?' },
      { speaker: 'You', line: '', lineKa: '', options: ['Yes, I\'m looking for a jacket.', 'Find means to discover.', 'Something is a thing.'], optionsKa: ['დიახ, ქურთუკს ვეძებ.', 'პოვნა ნიშნავს აღმოჩენას.', 'რაღაც არის ნივთი.'], correct: 0 },
      { speaker: 'Shop assistant', line: 'What size are you?', lineKa: 'რა ზომა გაქვთ?' },
      { speaker: 'You', line: '', lineKa: '', options: ['I\'m a medium.', 'Size is measurement.', 'I am a person.'], optionsKa: ['საშუალო ზომა.', 'ზომა გაზომვაა.', 'მე ადამიანი ვარ.'], correct: 0 },
      { speaker: 'Shop assistant', line: 'How about this one? It\'s on sale — 30% off!', lineKa: 'ეს როგორ მოგეწონებათ? ფასდაკლებულია — 30% ფასდაკლებით!' },
      { speaker: 'You', line: '', lineKa: '', options: ['That looks great! Can I try it on?', 'Sale means cheaper price.', '30 is a number.'], optionsKa: ['მშვენიერად გამოიყურება! შემიძლია მოვიზომო?', 'ფასდაკლება ნიშნავს იაფ ფასს.', '30 რიცხვია.'], correct: 0 },
      { speaker: 'Shop assistant', line: 'The fitting room is right there. How does it fit?', lineKa: 'გასახდელი აი იქ არის. როგორ მოგერგოთ?' },
      { speaker: 'You', line: '', lineKa: '', options: ['It fits perfectly. I\'ll take it!', 'Fitting room is a room.', 'Fit means correct size.'], optionsKa: ['იდეალურად მომერგო. ავიღებ!', 'გასახდელი ოთახია.', 'მორგება ნიშნავს სწორ ზომას.'], correct: 0 },
    ]
  },
  {
    id: 'doctor', title: 'At the Doctor', titleKa: 'ექიმთან', icon: '🏥',
    exchanges: [
      { speaker: 'Doctor', line: 'Hello. What brings you in today?', lineKa: 'გამარჯობა. რით მიმართეთ დღეს?' },
      { speaker: 'You', line: '', lineKa: '', options: ['I\'ve had a headache for two days.', 'Doctor is a profession.', 'Today is today.'], optionsKa: ['ორი დღეა თავი მტკივა.', 'ექიმი პროფესიაა.', 'დღეს დღეს არის.'], correct: 0 },
      { speaker: 'Doctor', line: 'I see. Do you have any other symptoms? Fever, nausea?', lineKa: 'გასაგებია. სხვა სიმპტომები ხომ არ გაქვთ? ტემპერატურა, გულისრევა?' },
      { speaker: 'You', line: '', lineKa: '', options: ['Yes, I also feel dizzy sometimes.', 'Symptoms are signs of illness.', 'Fever is hot temperature.'], optionsKa: ['დიახ, ხანდახან თავბრუსხვევაც მაქვს.', 'სიმპტომები ავადმყოფობის ნიშნებია.', 'ცხელება ცხელი ტემპერატურაა.'], correct: 0 },
      { speaker: 'Doctor', line: 'Let me check your blood pressure. It looks normal. I\'ll prescribe some medication.', lineKa: 'ნება მომეცით შეგიმოწმოთ წნევა. ნორმალურია. წამალს გამოგიწერთ.' },
      { speaker: 'You', line: '', lineKa: '', options: ['How often should I take it?', 'Blood pressure uses a machine.', 'Normal means not unusual.'], optionsKa: ['რამდენად ხშირად უნდა მივიღო?', 'წნევას აპარატით ზომავენ.', 'ნორმალური ნიშნავს ჩვეულებრივს.'], correct: 0 },
      { speaker: 'Doctor', line: 'Twice a day, after meals. Come back if it doesn\'t improve in a week.', lineKa: 'დღეში ორჯერ, საჭმლის შემდეგ. დაბრუნდით, თუ ერთ კვირაში არ გაუმჯობესდა.' },
      { speaker: 'You', line: '', lineKa: '', options: ['Thank you, doctor. I will.', 'A week has seven days.', 'Meals are food times.'], optionsKa: ['გმადლობთ, ექიმო. აუცილებლად.', 'კვირაში შვიდი დღეა.', 'კვება საჭმლის დროა.'], correct: 0 },
    ]
  },
  {
    id: 'interview', title: 'Job Interview', titleKa: 'გასაუბრებაზე', icon: '💼',
    exchanges: [
      { speaker: 'Interviewer', line: 'Thank you for coming. Please tell me about yourself.', lineKa: 'გმადლობთ რომ მოხვედით. გთხოვთ, მოგვიყევით თქვენს შესახებ.' },
      { speaker: 'You', line: '', lineKa: '', options: ['I\'m a software developer with 3 years of experience.', 'Myself is me.', 'I am a human being.'], optionsKa: ['მე ვარ პროგრამისტი 3 წლიანი გამოცდილებით.', 'მე არის მე.', 'მე ადამიანი ვარ.'], correct: 0 },
      { speaker: 'Interviewer', line: 'What interests you about this position?', lineKa: 'რა გაინტერესებთ ამ პოზიციაში?' },
      { speaker: 'You', line: '', lineKa: '', options: ['I\'m excited about the opportunity to work on innovative projects.', 'Position is a word for job.', 'Interest means I like.'], optionsKa: ['მაღელვებს შესაძლებლობა ინოვაციურ პროექტებზე მუშაობისა.', 'პოზიცია სამუშაოს სიტყვაა.', 'ინტერესი ნიშნავს მომწონს.'], correct: 0 },
      { speaker: 'Interviewer', line: 'What is your greatest strength?', lineKa: 'რა არის თქვენი ყველაზე ძლიერი მხარე?' },
      { speaker: 'You', line: '', lineKa: '', options: ['I\'m a quick learner and work well in teams.', 'Strength means being strong.', 'Greatest means the most.'], optionsKa: ['სწრაფად ვსწავლობ და კარგად ვმუშაობ გუნდში.', 'ძალა ნიშნავს ძლიერობას.', 'ყველაზე დიდი ნიშნავს მაქსიმუმს.'], correct: 0 },
      { speaker: 'Interviewer', line: 'Do you have any questions for us?', lineKa: 'გაქვთ რაიმე შეკითხვა ჩვენთვის?' },
      { speaker: 'You', line: '', lineKa: '', options: ['Yes, what does a typical day look like here?', 'Questions need answers.', 'Us means you and others.'], optionsKa: ['დიახ, როგორ გამოიყურება ტიპიური დღე აქ?', 'კითხვებს პასუხები სჭირდება.', 'ჩვენ ნიშნავს თქვენ და სხვები.'], correct: 0 },
    ]
  },
];

export default function ConversationPractice({ onBack }: Props) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [exchangeIndex, setExchangeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try { const s = localStorage.getItem('fluentge_conv_completed'); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
  });

  function saveCompleted(ids: Set<string>) {
    localStorage.setItem('fluentge_conv_completed', JSON.stringify([...ids]));
    setCompletedIds(ids);
  }

  function startScenario(s: Scenario) {
    setSelectedScenario(s);
    setExchangeIndex(0);
    setScore(0);
    setTotalQuestions(0);
    setAnswered(null);
    setFinished(false);
  }

  // Scenario selection screen
  if (!selectedScenario) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
          <h2 className="text-xl font-bold">💬 საუბრის პრაქტიკა</h2>
          <div />
        </div>
        <p className="text-[var(--color-text-muted)] text-sm text-center mb-6">აირჩიე სიტუაცია და ივარჯიშე ინგლისურ დიალოგებში</p>
        <div className="space-y-3">
          {scenarios.map(s => (
            <button key={s.id} onClick={() => startScenario(s)} className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-2xl p-4 flex items-center gap-4 transition-colors text-left">
              <span className="text-3xl">{s.icon}</span>
              <div className="flex-1">
                <div className="font-semibold">{s.titleKa}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{s.title}</div>
              </div>
              {completedIds.has(s.id) && <span className="text-green-400">✅</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const exchanges = selectedScenario.exchanges;

  // Finished
  if (finished) {
    const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    return (
      <div className="px-4 py-8 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : '👍'}</div>
        <h2 className="text-2xl font-bold mb-2">დიალოგი დასრულდა!</h2>
        <p className="text-lg mb-1">{selectedScenario.titleKa} {selectedScenario.icon}</p>
        <p className="text-[var(--color-text-muted)] mb-6">{score}/{totalQuestions} სწორი ({pct}%)</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => startScenario(selectedScenario)} className="bg-[var(--color-primary)] text-black font-bold py-3 px-6 rounded-xl">🔁 თავიდან</button>
          <button onClick={() => setSelectedScenario(null)} className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] py-3 px-6 rounded-xl">📋 სიტუაციები</button>
        </div>
      </div>
    );
  }

  const exchange = exchanges[exchangeIndex];
  const isUserTurn = !!exchange.options;

  function handleChoice(idx: number) {
    if (answered !== null) return;
    setAnswered(idx);
    setTotalQuestions(t => t + 1);
    if (idx === exchange.correct) { setScore(s => s + 1); playCorrect(); } else { playWrong(); }
  }

  function handleNext() {
    setAnswered(null);
    let next = exchangeIndex + 1;
    if (next >= exchanges.length) {
      setFinished(true);
      const newCompleted = new Set(completedIds);
      newCompleted.add(selectedScenario!.id);
      saveCompleted(newCompleted);
      return;
    }
    setExchangeIndex(next);
  }

  // Auto-advance non-interactive exchanges
  const isNarrative = !isUserTurn;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setSelectedScenario(null)} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
        <span className="text-sm font-medium">{selectedScenario.icon} {selectedScenario.titleKa}</span>
        <span className="text-sm text-[var(--color-primary)]">✅ {score}</span>
      </div>
      <div className="h-2 bg-[var(--color-bg-card)] rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${((exchangeIndex + 1) / exchanges.length) * 100}%` }} />
      </div>

      {/* Conversation bubble */}
      <div className={`rounded-2xl p-5 mb-4 ${isUserTurn ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20' : 'bg-[var(--color-bg-card)]'}`}>
        <div className="text-xs text-[var(--color-text-muted)] mb-2 font-medium">{exchange.speaker === 'You' ? '👤 შენ' : `🗣️ ${exchange.speaker}`}</div>
        {isNarrative && (
          <>
            <div className="text-lg mb-1">{exchange.line}</div>
            <div className="text-sm text-[var(--color-text-muted)]">{exchange.lineKa}</div>
          </>
        )}
        {isUserTurn && <div className="text-sm text-[var(--color-text-muted)] mb-3">აირჩიე სწორი პასუხი:</div>}
      </div>

      {/* Options for user turn */}
      {isUserTurn && exchange.options && (
        <div className="space-y-2 mb-4">
          {exchange.options.map((opt, i) => {
            let cls = 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)]';
            if (answered !== null) {
              if (i === exchange.correct) cls = 'bg-green-500/20 border-green-500 text-green-400';
              else if (i === answered) cls = 'bg-red-500/20 border-red-500 text-red-400';
              else cls = 'bg-[var(--color-bg-card)] opacity-50';
            }
            return (
              <button key={i} onClick={() => handleChoice(i)} disabled={answered !== null} className={`w-full text-left p-4 rounded-xl border border-white/5 transition-colors ${cls}`}>
                <div className="font-medium">{opt}</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">{exchange.optionsKa?.[i]}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Next button */}
      {(isNarrative || answered !== null) && (
        <button onClick={handleNext} className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] py-3 rounded-xl font-medium transition-colors">
          {exchangeIndex + 1 >= exchanges.length ? '🏁 დასრულება' : '→ შემდეგი'}
        </button>
      )}
    </div>
  );
}
