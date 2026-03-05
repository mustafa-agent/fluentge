import { useState, useMemo, useCallback } from 'react';
import { Deck, FlashCard } from '../lib/cards';
import { playCorrect, playWrong } from '../lib/sounds';

function awardXP(amount: number) {
  try {
    const current = parseInt(localStorage.getItem('totalXP') || '0');
    localStorage.setItem('totalXP', String(current + amount));
    // Record daily activity
    const today = new Date().toISOString().slice(0, 10);
    const histKey = `fluentge-daily-${today}`;
    try {
      const hist = JSON.parse(localStorage.getItem(histKey) || '{}');
      hist.xp = (hist.xp || 0) + amount;
      localStorage.setItem(histKey, JSON.stringify(hist));
    } catch {}
  } catch {}
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  deck: Deck;
  onBack: () => void;
}

interface Passage {
  sentences: { en: string; ka: string; card: FlashCard }[];
  questions: PassageQuestion[];
}

interface PassageQuestion {
  type: 'meaning' | 'fill' | 'true-false';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function buildPassage(deck: Deck): Passage | null {
  // Pick cards with example sentences
  const eligible = deck.cards.filter(c => c.example_en && c.example_ka && c.english && c.georgian);
  if (eligible.length < 5) return null;

  // Pick 5-7 sentences to form a "passage"
  const picked = shuffleArray(eligible).slice(0, Math.min(7, eligible.length));
  const sentences = picked.map(c => ({
    en: c.example_en!,
    ka: c.example_ka!,
    card: c
  }));

  const questions: PassageQuestion[] = [];

  // Q1: Meaning question — "What does [word] mean?"
  const q1Card = picked[0];
  const wrongMeanings = shuffleArray(eligible.filter(c => c.georgian !== q1Card.georgian)).slice(0, 3).map(c => c.georgian);
  if (wrongMeanings.length >= 3) {
    const opts = shuffleArray([q1Card.georgian, ...wrongMeanings]);
    questions.push({
      type: 'meaning',
      question: `რას ნიშნავს "${q1Card.english}"?`,
      options: opts,
      correctIndex: opts.indexOf(q1Card.georgian),
      explanation: `"${q1Card.english}" = "${q1Card.georgian}"`
    });
  }

  // Q2: Fill-in question — sentence with blank
  const q2Card = picked[1];
  if (q2Card.example_en) {
    const word = q2Card.english;
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(q2Card.example_en)) {
      const wrongWords = shuffleArray(eligible.filter(c => c.english !== q2Card.english)).slice(0, 3).map(c => c.english);
      if (wrongWords.length >= 3) {
        const opts = shuffleArray([q2Card.english, ...wrongWords]);
        questions.push({
          type: 'fill',
          question: `შეავსე: "${q2Card.example_en.replace(regex, '___')}"`,
          options: opts,
          correctIndex: opts.indexOf(q2Card.english),
          explanation: q2Card.example_en
        });
      }
    }
  }

  // Q3: True/False — "Does [word] mean [meaning]?"
  const q3Card = picked[2];
  const isTrue = Math.random() > 0.5;
  const fakeMeaning = shuffleArray(eligible.filter(c => c.georgian !== q3Card.georgian))[0]?.georgian;
  if (fakeMeaning) {
    const shownMeaning = isTrue ? q3Card.georgian : fakeMeaning;
    questions.push({
      type: 'true-false',
      question: `"${q3Card.english}" ნიშნავს "${shownMeaning}" — სწორია?`,
      options: ['✅ სწორია', '❌ არასწორია'],
      correctIndex: isTrue ? 0 : 1,
      explanation: `"${q3Card.english}" = "${q3Card.georgian}"`
    });
  }

  // Q4: Another meaning question from different card
  if (picked.length >= 4) {
    const q4Card = picked[3];
    const wrongMeanings4 = shuffleArray(eligible.filter(c => c.georgian !== q4Card.georgian)).slice(0, 3).map(c => c.georgian);
    if (wrongMeanings4.length >= 3) {
      const opts = shuffleArray([q4Card.georgian, ...wrongMeanings4]);
      questions.push({
        type: 'meaning',
        question: `ტექსტში რას ნიშნავს "${q4Card.english}"?`,
        options: opts,
        correctIndex: opts.indexOf(q4Card.georgian),
        explanation: `"${q4Card.english}" = "${q4Card.georgian}"`
      });
    }
  }

  // Q5: Fill from another card
  if (picked.length >= 5) {
    const q5Card = picked[4];
    if (q5Card.example_en) {
      const word = q5Card.english;
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(q5Card.example_en)) {
        const wrongWords = shuffleArray(eligible.filter(c => c.english !== q5Card.english)).slice(0, 3).map(c => c.english);
        if (wrongWords.length >= 3) {
          const opts = shuffleArray([q5Card.english, ...wrongWords]);
          questions.push({
            type: 'fill',
            question: `შეავსე: "${q5Card.example_en.replace(regex, '___')}"`,
            options: opts,
            correctIndex: opts.indexOf(q5Card.english),
            explanation: q5Card.example_en
          });
        }
      }
    }
  }

  if (questions.length < 3) return null;

  return { sentences, questions };
}

export default function ReadingComprehension({ deck, onBack }: Props) {
  const passage = useMemo(() => buildPassage(deck), [deck]);
  const [phase, setPhase] = useState<'reading' | 'questions' | 'results'>('reading');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [xpFloat, setXpFloat] = useState<number | null>(null);

  const handleAnswer = useCallback((idx: number) => {
    if (showFeedback || !passage) return;
    setSelected(idx);
    setShowFeedback(true);

    const correct = idx === passage.questions[currentQ].correctIndex;
    if (correct) {
      playCorrect();
      setScore(s => s + 1);
      awardXP(15);
      setTotalXPEarned(x => x + 15);
      setXpFloat(15);
      setTimeout(() => setXpFloat(null), 1000);
    } else {
      playWrong();
    }
  }, [showFeedback, passage, currentQ]);

  const handleNext = useCallback(() => {
    if (!passage) return;
    if (currentQ + 1 < passage.questions.length) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setPhase('results');
    }
  }, [currentQ, passage]);

  if (!passage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">📖</div>
        <h2 className="text-xl font-bold mb-2">არ არის საკმარისი წინადადებები</h2>
        <p className="text-[var(--color-text-muted)] mb-6">
          ამ კატეგორიაში მინიმუმ 5 სიტყვა წინადადებებით სჭირდება
        </p>
        <button onClick={onBack} className="px-6 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 font-bold">
          ← უკან
        </button>
      </div>
    );
  }

  // Reading phase
  if (phase === 'reading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white text-lg">←</button>
          <h2 className="text-lg font-bold flex-1">📖 წაიკითხე ტექსტი</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">+15 XP</span>
        </div>

        {/* Passage card */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl border border-white/10 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-bold">{deck.name}</span>
          </div>
          <div className="space-y-3">
            {passage.sentences.map((s, i) => (
              <p key={i} className="text-base leading-relaxed">
                <span className="text-[var(--color-text)]">{s.en}</span>
                {showTranslation && (
                  <span className="block text-sm text-[var(--color-text-muted)] mt-0.5 italic">{s.ka}</span>
                )}
              </p>
            ))}
          </div>
        </div>

        {/* Translation toggle */}
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="w-full p-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-sm font-semibold mb-4 transition-all hover:border-sky-500/30"
        >
          {showTranslation ? '🙈 დამალე თარგმანი' : '🇬🇪 აჩვენე ქართული თარგმანი'}
        </button>

        {/* Key words */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl border border-white/10 p-4 mb-6">
          <h3 className="text-sm font-bold text-[var(--color-text-muted)] mb-3">📝 საკვანძო სიტყვები</h3>
          <div className="flex flex-wrap gap-2">
            {passage.sentences.map((s, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 text-sm font-medium border border-sky-500/20">
                {s.card.english} — {s.card.georgian}
              </span>
            ))}
          </div>
        </div>

        {/* Start questions button */}
        <button
          onClick={() => setPhase('questions')}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg border-b-4 border-emerald-700 active:border-b-2 active:mt-[2px] transition-all"
        >
          ✅ წავიკითხე — დავიწყო კითხვები ({passage.questions.length})
        </button>
      </div>
    );
  }

  // Results phase
  if (phase === 'results') {
    const accuracy = Math.round((score / passage.questions.length) * 100);
    const emoji = accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : accuracy >= 40 ? '💪' : '📚';

    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-2xl font-bold mb-2">
          {accuracy >= 80 ? 'შესანიშნავი!' : accuracy >= 60 ? 'კარგია!' : 'კარგი მცდელობა!'}
        </h2>

        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">{score}/{passage.questions.length}</div>
            <div className="text-xs text-[var(--color-text-muted)]">სწორი</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-sky-400">{accuracy}%</div>
            <div className="text-xs text-[var(--color-text-muted)]">სიზუსტე</div>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-yellow-400">+{totalXPEarned}</div>
            <div className="text-xs text-[var(--color-text-muted)]">XP</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 font-bold"
          >
            ← უკან
          </button>
          <button
            onClick={() => { window.location.reload(); }}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold border-b-4 border-emerald-700 active:border-b-2 active:mt-[2px]"
          >
            🔄 თავიდან
          </button>
        </div>
      </div>
    );
  }

  // Questions phase
  const q = passage.questions[currentQ];
  const isCorrect = selected !== null && selected === q.correctIndex;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white text-lg">←</button>
        <div className="flex-1">
          {/* Progress bar */}
          <div className="h-4 bg-[var(--color-bg-card)] rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${((currentQ + (showFeedback ? 1 : 0)) / passage.questions.length) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-bold tabular-nums text-[var(--color-text-muted)]">
          {currentQ + 1}/{passage.questions.length}
        </span>
      </div>

      {/* XP float */}
      {xpFloat && (
        <div className="fixed top-20 right-6 text-yellow-400 font-bold text-lg animate-bounce z-50">
          +{xpFloat} XP ⭐
        </div>
      )}

      {/* Mini passage reference (collapsible) */}
      <details className="bg-[var(--color-bg-card)] rounded-xl border border-white/10 mb-4 text-sm">
        <summary className="px-4 py-3 cursor-pointer font-semibold text-[var(--color-text-muted)]">
          📖 ტექსტი (დააჭირე სანახავად)
        </summary>
        <div className="px-4 pb-3 space-y-1">
          {passage.sentences.map((s, i) => (
            <p key={i} className="text-[var(--color-text)] text-sm">{s.en}</p>
          ))}
        </div>
      </details>

      {/* Question */}
      <div className="bg-[var(--color-bg-card)] rounded-2xl border border-white/10 p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold">
            {q.type === 'meaning' ? '📝 მნიშვნელობა' : q.type === 'fill' ? '✏️ შევსება' : '✅ სწორი/არასწორი'}
          </span>
        </div>
        <p className="text-lg font-semibold leading-relaxed">{q.question}</p>
      </div>

      {/* Options */}
      <div className={`grid ${q.options.length === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-4`}>
        {q.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (showFeedback) {
            if (i === q.correctIndex) cls += ' correct';
            else if (i === selected) cls += ' wrong';
            else cls += ' dimmed';
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showFeedback}
              className={`${cls} w-full p-4 rounded-xl border-b-4 font-semibold text-left transition-all ${
                showFeedback ? '' : 'hover:scale-[1.02] active:scale-[0.98] active:border-b-2 active:mt-[2px]'
              }`}
            >
              <span className="mr-2 text-[var(--color-text-muted)]">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback bar */}
      {showFeedback && (
        <div className={`quiz-feedback ${isCorrect ? 'correct' : 'wrong'} rounded-xl p-4 mb-4`}>
          <div className="font-bold mb-1">{isCorrect ? '✅ სწორია!' : '❌ არასწორია'}</div>
          <div className="text-sm opacity-80">{q.explanation}</div>
        </div>
      )}

      {/* Next button */}
      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg border-b-4 border-emerald-700 active:border-b-2 active:mt-[2px] transition-all"
        >
          {currentQ + 1 < passage.questions.length ? 'შემდეგი →' : 'შედეგები 🏆'}
        </button>
      )}
    </div>
  );
}
