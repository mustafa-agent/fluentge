import { useState, useEffect, useCallback } from 'react';
import { loadDeck, type FlashCard } from '../lib/deck-loader';
import { addXP, updateStreak, addStudyTime, addCardReview } from '../lib/gamification';

// Unit → deck mapping (matches courses.astro)
const UNIT_CONFIG: Record<number, { title: string; titleEn: string; icon: string; decks: string[]; grammar: string; color: string }> = {
  1: { title: 'საწყისი ნაბიჯები', titleEn: 'First Steps', icon: '🌱', decks: ['greetings', 'numbers'], grammar: 'to-be', color: 'unit-1' },
  2: { title: 'ყოველდღიური ცხოვრება', titleEn: 'Daily Life', icon: '☀️', decks: ['food', 'emotions'], grammar: 'present-simple', color: 'unit-2' },
  3: { title: 'მოგზაურობა', titleEn: 'Travel & Places', icon: '✈️', decks: ['travel', 'shopping'], grammar: 'past-simple', color: 'unit-3' },
  4: { title: 'სამსახური & კარიერა', titleEn: 'Work & Career', icon: '💼', decks: ['work', 'technology'], grammar: 'present-perfect', color: 'unit-4' },
  5: { title: 'ჯანმრთელობა & სპორტი', titleEn: 'Health & Sports', icon: '💪', decks: ['health', 'sports'], grammar: 'modal-verbs', color: 'unit-5' },
  6: { title: 'მოწინავე დონე', titleEn: 'Advanced Topics', icon: '🏆', decks: ['law', 'politics'], grammar: 'conditionals', color: 'unit-6' },
};

// Grammar questions per unit (hardcoded, 5 questions each, pick 3)
const GRAMMAR_QUESTIONS: Record<number, { question: string; options: string[]; correct: number }[]> = {
  1: [
    { question: 'She ___ a teacher.', options: ['am', 'is', 'are', 'be'], correct: 1 },
    { question: 'They ___ happy today.', options: ['is', 'am', 'are', 'be'], correct: 2 },
    { question: 'I ___ from Georgia.', options: ['is', 'are', 'am', 'be'], correct: 2 },
    { question: 'It ___ cold outside.', options: ['are', 'is', 'am', 'were'], correct: 1 },
    { question: 'We ___ students.', options: ['am', 'is', 'are', 'was'], correct: 2 },
  ],
  2: [
    { question: 'She ___ coffee every morning.', options: ['drink', 'drinks', 'drinking', 'drank'], correct: 1 },
    { question: 'They ___ to school by bus.', options: ['goes', 'going', 'go', 'gone'], correct: 2 },
    { question: 'He ___ TV in the evening.', options: ['watch', 'watches', 'watching', 'watched'], correct: 1 },
    { question: 'I ___ English on Mondays.', options: ['studies', 'studying', 'study', 'studied'], correct: 2 },
    { question: 'The cat ___ on the sofa.', options: ['sleep', 'sleeps', 'sleeping', 'slept'], correct: 1 },
  ],
  3: [
    { question: 'I ___ to Paris last summer.', options: ['go', 'goes', 'went', 'going'], correct: 2 },
    { question: 'She ___ a beautiful dress yesterday.', options: ['buys', 'bought', 'buying', 'buy'], correct: 1 },
    { question: 'They ___ the movie last night.', options: ['watch', 'watched', 'watches', 'watching'], correct: 1 },
    { question: 'We ___ at the hotel for three days.', options: ['stay', 'stays', 'stayed', 'staying'], correct: 2 },
    { question: 'He ___ his keys at the restaurant.', options: ['lose', 'lost', 'loses', 'losing'], correct: 1 },
  ],
  4: [
    { question: 'I ___ in this company for five years.', options: ['work', 'worked', 'have worked', 'working'], correct: 2 },
    { question: 'She ___ the report already.', options: ['finished', 'has finished', 'finishes', 'finishing'], correct: 1 },
    { question: 'They ___ never ___ to Japan.', options: ['have / been', 'has / been', 'have / went', 'has / gone'], correct: 0 },
    { question: 'He ___ just ___ the meeting.', options: ['have / left', 'has / left', 'has / leave', 'have / leave'], correct: 1 },
    { question: 'We ___ this project since January.', options: ['work on', 'worked on', 'have worked on', 'works on'], correct: 2 },
  ],
  5: [
    { question: 'You ___ see a doctor.', options: ['should', 'shoulding', 'shoulds', 'to should'], correct: 0 },
    { question: 'She ___ swim very well.', options: ['cans', 'can', 'could to', 'canning'], correct: 1 },
    { question: 'You ___ smoke here. It\'s forbidden.', options: ['mustn\'t', 'must', 'can', 'should'], correct: 0 },
    { question: 'I ___ run 5 km when I was young.', options: ['can', 'could', 'must', 'should'], correct: 1 },
    { question: '___ I open the window?', options: ['Must', 'Should', 'May', 'Will'], correct: 2 },
  ],
  6: [
    { question: 'If I ___ rich, I would travel the world.', options: ['am', 'was', 'were', 'be'], correct: 2 },
    { question: 'If it rains, we ___ stay home.', options: ['will', 'would', 'could have', 'were'], correct: 0 },
    { question: 'If she ___ harder, she would pass.', options: ['study', 'studies', 'studied', 'studying'], correct: 2 },
    { question: 'I will come if you ___ me.', options: ['invite', 'invited', 'invites', 'inviting'], correct: 0 },
    { question: 'If I had known, I ___ helped.', options: ['will have', 'would have', 'could', 'should'], correct: 1 },
  ],
};

interface Question {
  type: 'vocab' | 'grammar' | 'listening';
  question: string;
  options: string[];
  correctIndex: number;
  card?: FlashCard;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateVocabQuestion(card: FlashCard, allCards: FlashCard[]): Question {
  const wrongOptions = shuffle(allCards.filter(c => c.georgian !== card.georgian)).slice(0, 3).map(c => c.georgian);
  const options = shuffle([card.georgian, ...wrongOptions]);
  return {
    type: 'vocab',
    question: card.english,
    options,
    correctIndex: options.indexOf(card.georgian),
    card,
  };
}

function generateListeningQuestion(card: FlashCard, allCards: FlashCard[]): Question {
  const wrongOptions = shuffle(allCards.filter(c => c.georgian !== card.georgian)).slice(0, 3).map(c => c.georgian);
  const options = shuffle([card.georgian, ...wrongOptions]);
  return {
    type: 'listening',
    question: card.english,
    options,
    correctIndex: options.indexOf(card.georgian),
    card,
  };
}

export default function UnitQuiz({ unitId, onBack }: { unitId: number; onBack: () => void }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [startTime] = useState(Date.now());

  const config = UNIT_CONFIG[unitId] || UNIT_CONFIG[1];

  useEffect(() => {
    async function load() {
      try {
        // Load all deck cards for this unit
        const allCards: FlashCard[] = [];
        for (const deckId of config.decks) {
          const deck = await loadDeck(deckId);
          if (deck) allCards.push(...deck.cards);
        }

        if (allCards.length < 5) {
          setLoading(false);
          return;
        }

        const shuffled = shuffle(allCards);
        const qs: Question[] = [];

        // 5 vocab questions
        const vocabCards = shuffled.slice(0, 5);
        for (const card of vocabCards) {
          qs.push(generateVocabQuestion(card, allCards));
        }

        // 3 grammar questions
        const grammarPool = GRAMMAR_QUESTIONS[unitId] || GRAMMAR_QUESTIONS[1];
        const grammarPicks = shuffle(grammarPool).slice(0, 3);
        for (const gq of grammarPicks) {
          qs.push({
            type: 'grammar',
            question: gq.question,
            options: gq.options,
            correctIndex: gq.correct,
          });
        }

        // 2 listening questions
        const listenCards = shuffled.slice(5, 7);
        for (const card of listenCards) {
          qs.push(generateListeningQuestion(card, allCards));
        }

        setQuestions(shuffle(qs));
        setLoading(false);
      } catch (e) {
        console.error('UnitQuiz load error:', e);
        setLoading(false);
      }
    }
    load();
  }, [unitId]);

  const speak = useCallback((text: string, rate = 0.9) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = rate;
      speechSynthesis.speak(u);
    }
  }, []);

  // Auto-play for listening questions
  useEffect(() => {
    if (!loading && questions[current]?.type === 'listening' && selected === null) {
      const t = setTimeout(() => speak(questions[current].question), 400);
      return () => clearTimeout(t);
    }
  }, [current, loading, selected]);

  function handleAnswer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    addCardReview();
    const q = questions[current];
    const isCorrect = idx === q.correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
      const xp = q.type === 'listening' ? 15 : 10;
      addXP(xp);
      setXpEarned(prev => prev + xp);
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      // Quiz complete
      const passed = score + (selected === questions[current]?.correctIndex ? 1 : 0) >= 7;
      const finalScore = score + (selected === questions[current]?.correctIndex ? 1 : 0);
      setScore(finalScore);

      if (passed) {
        addXP(50); // bonus for passing
        setXpEarned(prev => prev + 50);
        // Mark unit quiz as completed
        try {
          const completed = JSON.parse(localStorage.getItem('fluentge-unit-quiz-completed') || '{}');
          completed[unitId] = { score: finalScore, date: new Date().toISOString() };
          localStorage.setItem('fluentge-unit-quiz-completed', JSON.stringify(completed));
        } catch (e) {}
      }

      updateStreak(true);
      const elapsed = Math.round((Date.now() - startTime) / 60000);
      if (elapsed > 0) addStudyTime(elapsed);

      setShowResult(true);
      return;
    }
    setCurrent(c => c + 1);
    setSelected(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">{config.icon}</div>
          <p className="text-[var(--color-text-muted)]">ტესტი იტვირთება...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-[var(--color-text-muted)]">ბარათები ვერ მოიძებნა</p>
          <button onClick={onBack} className="mt-4 px-6 py-2 rounded-xl bg-sky-500 text-white font-bold">უკან</button>
        </div>
      </div>
    );
  }

  // Result screen
  if (showResult) {
    const passed = score >= 7;
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 screen-enter">
        <div className="uq-result">
          <div className="uq-result-icon">{passed ? '🎉' : '😤'}</div>
          <div className={`uq-unit-badge ${config.color}`}>ერთეული {unitId}</div>
          <h2 className="text-2xl font-bold mt-4 mb-2">{passed ? 'ტესტი გავლილია!' : 'სცადე თავიდან'}</h2>
          <div className={`uq-result-badge ${passed ? 'pass' : 'fail'}`}>
            {passed ? '✅ გავლილი' : '❌ ვერ გაიარე'}
          </div>
          <p className="text-[var(--color-text-muted)] mt-2 text-sm">
            {passed ? 'შესანიშნავი! ეს ერთეული დასრულებულია.' : 'გჭირდება 7/10 ან მეტი. გაიმეორე მასალა და სცადე თავიდან.'}
          </p>

          <div className="uq-stat-grid">
            <div className="uq-stat-card">
              <div className="uq-stat-value" style={{ color: passed ? '#4ade80' : '#f87171' }}>{score}/{questions.length}</div>
              <div className="uq-stat-label">სწორი</div>
            </div>
            <div className="uq-stat-card">
              <div className="uq-stat-value" style={{ color: '#facc15' }}>{accuracy}%</div>
              <div className="uq-stat-label">სიზუსტე</div>
            </div>
            <div className="uq-stat-card">
              <div className="uq-stat-value" style={{ color: '#38bdf8' }}>+{xpEarned}</div>
              <div className="uq-stat-label">XP</div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 font-bold text-sm">
              უკან
            </button>
            {!passed && (
              <button onClick={() => { setShowResult(false); setCurrent(0); setScore(0); setSelected(null); setXpEarned(0); setQuestions(shuffle(questions)); }}
                className="flex-1 py-3 rounded-xl bg-sky-500 border-b-4 border-sky-600 active:border-b-2 text-white font-bold text-sm">
                🔄 თავიდან
              </button>
            )}
            {passed && (
              <a href="/courses/" className="flex-1 py-3 rounded-xl bg-green-500 border-b-4 border-green-600 active:border-b-2 text-white font-bold text-sm text-center">
                📚 კურსები
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const pct = ((current) / questions.length) * 100;
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 screen-enter">
      {/* Header */}
      <div className="uq-header">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white text-lg">✕</button>
        <div className={`uq-unit-badge ${config.color}`}>{config.icon} ერთეული {unitId}</div>
        <span className="text-sm font-bold text-[var(--color-text-muted)]">{current + 1}/{questions.length}</span>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-bar mt-3 mb-6">
        <div className="quiz-progress-fill" style={{ width: `${pct}%` }}></div>
      </div>

      {/* Question type badge */}
      <div className="flex justify-center mb-4">
        <span className={`uq-question-type ${q.type}`}>
          {q.type === 'vocab' ? '📚 ლექსიკა' : q.type === 'grammar' ? '📖 გრამატიკა' : '🎧 მოსმენა'}
        </span>
      </div>

      {/* Question */}
      <div className="uq-question-text">
        {q.type === 'listening' ? (
          <div className="text-center">
            <button onClick={() => speak(q.question)} className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-3xl mx-auto mb-3 hover:scale-105 active:scale-95 transition-transform shadow-lg">
              🔊
            </button>
            <p className="text-sm text-[var(--color-text-muted)]">მოუსმინე და აირჩიე სწორი</p>
            <button onClick={() => speak(q.question, 0.5)} className="mt-2 text-xs text-[var(--color-text-muted)] hover:text-sky-400 transition-colors">🐢 ნელა</button>
          </div>
        ) : q.type === 'grammar' ? (
          <div className="text-center">
            <p className="text-xl font-medium leading-relaxed">{q.question}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">შეავსე სწორი ვარიანტით</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-bold mb-2">{q.question}</p>
            <p className="text-sm text-[var(--color-text-muted)]">აირჩიე ქართული თარგმანი</p>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="uq-options">
        {q.options.map((opt, i) => {
          let cls = 'uq-option';
          if (selected !== null) {
            if (i === q.correctIndex) cls += ' correct';
            else if (i === selected && i !== q.correctIndex) cls += ' wrong';
            else cls += ' dimmed';
          }
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={selected !== null}>
              <span className="uq-option-letter">{letters[i]}</span>
              <span className="flex-1 text-left">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback + Continue */}
      {selected !== null && (
        <div className={`quiz-feedback ${selected === q.correctIndex ? 'correct' : 'wrong'}`} style={{ animation: 'slideUp 0.3s ease-out' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm">
                {selected === q.correctIndex ? '✅ სწორია!' : '❌ არასწორია'}
              </div>
              {selected !== q.correctIndex && (
                <div className="text-xs mt-0.5 opacity-80">სწორი: {q.options[q.correctIndex]}</div>
              )}
            </div>
            <button onClick={handleNext} className="px-6 py-2 rounded-xl bg-white/20 font-bold text-sm hover:bg-white/30 transition-colors">
              {current + 1 >= questions.length ? 'შედეგი' : 'გაგრძელება'} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
