import { useState, useEffect, useMemo } from 'react';

const APP_URL = 'https://fluentge.surge.sh';

interface Question {
  id: number;
  type: 'vocab' | 'grammar';
  question: string;
  options: string[];
  correct: number; // index
  explanation: string;
}

const ALL_QUESTIONS: Question[] = [
  // VOCABULARY (A1-B2)
  { id: 1, type: 'vocab', question: 'რას ნიშნავს "abundant"?', options: ['ნაკლები', 'უხვი', 'ცარიელი', 'მცირე'], correct: 1, explanation: 'Abundant = უხვი, მრავალი' },
  { id: 2, type: 'vocab', question: 'რას ნიშნავს "persuade"?', options: ['დაშინება', 'დარწმუნება', 'დაჯილდოვება', 'დასჯა'], correct: 1, explanation: 'Persuade = დარწმუნება' },
  { id: 3, type: 'vocab', question: '"Obstacle" ნიშნავს:', options: ['გზა', 'შესაძლებლობა', 'დაბრკოლება', 'მიზანი'], correct: 2, explanation: 'Obstacle = დაბრკოლება' },
  { id: 4, type: 'vocab', question: 'რას ნიშნავს "reliable"?', options: ['საშიში', 'საიმედო', 'ძვირი', 'იშვიათი'], correct: 1, explanation: 'Reliable = საიმედო' },
  { id: 5, type: 'vocab', question: '"Curious" ქართულად:', options: ['ზარმაცი', 'ბრაზიანი', 'ცნობისმოყვარე', 'მოწყენილი'], correct: 2, explanation: 'Curious = ცნობისმოყვარე' },
  { id: 6, type: 'vocab', question: 'რას ნიშნავს "generous"?', options: ['ძუნწი', 'გულუხვი', 'ამაყი', 'მორცხვი'], correct: 1, explanation: 'Generous = გულუხვი' },
  { id: 7, type: 'vocab', question: '"Immediately" ნიშნავს:', options: ['ნელა', 'მოგვიანებით', 'დაუყოვნებლივ', 'ხშირად'], correct: 2, explanation: 'Immediately = დაუყოვნებლივ' },
  { id: 8, type: 'vocab', question: 'რას ნიშნავს "achieve"?', options: ['დაკარგვა', 'მიღწევა', 'უარყოფა', 'დავიწყება'], correct: 1, explanation: 'Achieve = მიღწევა' },
  { id: 9, type: 'vocab', question: '"Gradually" ქართულად:', options: ['უცებ', 'თანდათან', 'ხშირად', 'იშვიათად'], correct: 1, explanation: 'Gradually = თანდათან' },
  { id: 10, type: 'vocab', question: 'რას ნიშნავს "magnificent"?', options: ['საშინელი', 'ჩვეულებრივი', 'ბრწყინვალე', 'პატარა'], correct: 2, explanation: 'Magnificent = ბრწყინვალე' },
  { id: 11, type: 'vocab', question: '"Exhausted" ნიშნავს:', options: ['აღფრთოვანებული', 'გამოფიტული', 'მშვიდი', 'ბედნიერი'], correct: 1, explanation: 'Exhausted = გამოფიტული, ძალიან დაღლილი' },
  { id: 12, type: 'vocab', question: 'რას ნიშნავს "essential"?', options: ['არასაჭირო', 'აუცილებელი', 'ძვირი', 'მარტივი'], correct: 1, explanation: 'Essential = აუცილებელი' },
  { id: 13, type: 'vocab', question: '"Temporary" ქართულად:', options: ['მუდმივი', 'დროებითი', 'ძველი', 'ახალი'], correct: 1, explanation: 'Temporary = დროებითი' },
  { id: 14, type: 'vocab', question: 'რას ნიშნავს "recognize"?', options: ['დავიწყება', 'ამოცნობა', 'დამალვა', 'მოძებნა'], correct: 1, explanation: 'Recognize = ამოცნობა' },
  { id: 15, type: 'vocab', question: '"Consequence" ნიშნავს:', options: ['მიზეზი', 'შეკითხვა', 'შედეგი', 'დასაწყისი'], correct: 2, explanation: 'Consequence = შედეგი' },
  // GRAMMAR
  { id: 16, type: 'grammar', question: 'She ___ to Paris last summer.', options: ['has gone', 'went', 'goes', 'is going'], correct: 1, explanation: 'Past Simple: "went" — last summer = წარსული' },
  { id: 17, type: 'grammar', question: 'I ___ here since 2020.', options: ['live', 'lived', 'have lived', 'am living'], correct: 2, explanation: 'Present Perfect: "have lived" — since 2020' },
  { id: 18, type: 'grammar', question: 'If I ___ rich, I would travel the world.', options: ['am', 'was', 'were', 'will be'], correct: 2, explanation: 'Second Conditional: If I were...' },
  { id: 19, type: 'grammar', question: 'She is ___ student in the class.', options: ['good', 'better', 'the best', 'most good'], correct: 2, explanation: 'Superlative: "the best"' },
  { id: 20, type: 'grammar', question: 'They ___ TV when I arrived.', options: ['watch', 'watched', 'were watching', 'have watched'], correct: 2, explanation: 'Past Continuous: "were watching" — მიმდინარე მოქმედება წარსულში' },
  { id: 21, type: 'grammar', question: 'He ___ smoke anymore.', options: ["doesn't", "don't", "isn't", "hasn't"], correct: 0, explanation: "He doesn't — მესამე პირი მხოლობითი" },
  { id: 22, type: 'grammar', question: '___ you ever been to London?', options: ['Did', 'Have', 'Are', 'Do'], correct: 1, explanation: 'Present Perfect: "Have you ever been..."' },
  { id: 23, type: 'grammar', question: 'I wish I ___ harder last year.', options: ['study', 'studied', 'had studied', 'would study'], correct: 2, explanation: 'Wish + Past Perfect: "had studied" — ნანობა წარსულზე' },
  { id: 24, type: 'grammar', question: 'The book ___ by millions of people.', options: ['has read', 'has been read', 'have read', 'is reading'], correct: 1, explanation: 'Passive Voice: "has been read"' },
  { id: 25, type: 'grammar', question: 'She asked me where I ___.', options: ['live', 'lived', 'do live', 'am live'], correct: 1, explanation: 'Reported Speech: "lived" — დროის შეცვლა' },
  { id: 26, type: 'grammar', question: 'I ___ English for 3 years now.', options: ['study', 'studied', 'have been studying', 'am study'], correct: 2, explanation: 'Present Perfect Continuous: "have been studying"' },
  { id: 27, type: 'grammar', question: '___ it stops raining, we\'ll go out.', options: ['Unless', 'If', 'When', 'Although'], correct: 2, explanation: 'When = როდესაც — დროის პირობა' },
  { id: 28, type: 'grammar', question: 'She suggested ___ a movie.', options: ['to watch', 'watching', 'watch', 'watched'], correct: 1, explanation: 'Suggest + gerund: "watching"' },
  { id: 29, type: 'grammar', question: 'There aren\'t ___ eggs in the fridge.', options: ['some', 'any', 'no', 'much'], correct: 1, explanation: '"Any" უარყოფით წინადადებებში' },
  { id: 30, type: 'grammar', question: 'He\'s the man ___ car was stolen.', options: ['who', 'which', 'whose', 'whom'], correct: 2, explanation: 'Whose = ვისი — კუთვნილების ნაცვალსახელი' },
  { id: 31, type: 'grammar', question: 'You ___ wear a seatbelt. It\'s the law.', options: ['should', 'must', 'can', 'might'], correct: 1, explanation: 'Must = აუცილებელია (კანონი)' },
  { id: 32, type: 'grammar', question: 'I\'d rather ___ at home tonight.', options: ['to stay', 'staying', 'stay', 'stayed'], correct: 2, explanation: "I'd rather + bare infinitive: \"stay\"" },
  { id: 33, type: 'vocab', question: 'რას ნიშნავს "approach"?', options: ['გაქცევა', 'მიდგომა', 'დასრულება', 'დაწყება'], correct: 1, explanation: 'Approach = მიდგომა / მიახლოება' },
  { id: 34, type: 'vocab', question: '"Diverse" ქართულად:', options: ['ერთნაირი', 'მრავალფეროვანი', 'მარტივი', 'რთული'], correct: 1, explanation: 'Diverse = მრავალფეროვანი' },
  { id: 35, type: 'vocab', question: 'რას ნიშნავს "contribute"?', options: ['წაშლა', 'შეტანა/წვლილი', 'გაყიდვა', 'უარყოფა'], correct: 1, explanation: 'Contribute = წვლილის შეტანა' },
];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function encodeChallenge(seed: number, score: number, name: string): string {
  const data = JSON.stringify({ s: seed, sc: score, n: name });
  return btoa(unescape(encodeURIComponent(data)));
}

function decodeChallenge(hash: string): { s: number; sc: number; n: string } | null {
  try {
    const json = decodeURIComponent(escape(atob(hash)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function ChallengeFriend({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'name' | 'quiz' | 'result' | 'challenger'>('name');
  const [playerName, setPlayerName] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [challengeData, setChallengeData] = useState<{ s: number; sc: number; n: string } | null>(null);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000000));
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);

  // Check URL for challenge
  useEffect(() => {
    const hash = window.location.hash.replace('#challenge=', '');
    if (hash && hash !== window.location.hash) {
      const data = decodeChallenge(hash);
      if (data) {
        setChallengeData(data);
        setSeed(data.s);
        setPhase('name');
      }
    }
  }, []);

  const questions = useMemo(() => {
    return seededShuffle(ALL_QUESTIONS, seed).slice(0, 10);
  }, [seed]);

  const currentQuestion = questions[currentQ];

  // Timer
  useEffect(() => {
    if (phase !== 'quiz' || showAnswer) return;
    if (timeLeft <= 0) {
      setShowAnswer(true);
      setStreak(0);
      setTimeout(() => nextQuestion(), 1500);
      return;
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, showAnswer]);

  function startQuiz() {
    if (!playerName.trim()) return;
    setPhase('quiz');
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
    setTimeLeft(15);
    setStreak(0);
  }

  function handleAnswer(idx: number) {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    const isCorrect = idx === currentQuestion.correct;
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(st => st + 1);
    } else {
      setStreak(0);
    }
    setTimeout(() => nextQuestion(), 1800);
  }

  function nextQuestion() {
    if (currentQ + 1 >= 10) {
      setPhase('result');
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowAnswer(false);
      setTimeLeft(15);
    }
  }

  const challengeLink = `${APP_URL}/#challenge=${encodeChallenge(seed, score, playerName)}`;

  const getEmoji = (s: number) => s >= 9 ? '🏆' : s >= 7 ? '🔥' : s >= 5 ? '💪' : '📚';
  const getMessage = (s: number) => {
    if (s >= 9) return 'წარმოუდგენელია! 🧠✨';
    if (s >= 7) return 'შესანიშნავია! 🔥';
    if (s >= 5) return 'კარგია! 💪';
    return 'გაიმეორე და სცადე ხელახლა! 📖';
  };

  const shareText = challengeData
    ? `მე დავამარცხე ${challengeData.n} FluentGe-ზე! 🏆 ${score}/${10} vs ${challengeData.sc}/${10}. გამოწვევა მიღებულია? 👉`
    : `${getEmoji(score)} მე მივიღე ${score}/10 FluentGe ინგლისურის გამოწვევაში! შეგიძლია დამამარცხო? 🤔💥 გამოსცადე 👇`;

  const encodedText = encodeURIComponent(shareText + '\n' + challengeLink);
  const encodedUrl = encodeURIComponent(challengeLink);
  const telegramShareText = encodeURIComponent(shareText);

  function copyLink() {
    navigator.clipboard.writeText(shareText + '\n' + challengeLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  // NAME ENTRY
  if (phase === 'name') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white mb-6 text-sm flex items-center gap-1">
          ← უკან
        </button>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="text-2xl font-bold mb-2">გამოწვევა მეგობარს!</h2>
          <p className="text-[var(--color-text-muted)]">
            გაიარე ქვიზი და გაუგზავნე მეგობარს — ვნახოთ ვინ იცის ინგლისური უკეთ! 🎯
          </p>
        </div>

        {challengeData && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <p className="font-bold text-lg">{challengeData.n} გიწვევს!</p>
            <p className="text-[var(--color-text-muted)] mt-1">
              მისმა შედეგმა <span className="text-orange-400 font-bold">{challengeData.sc}/10</span> შეადგინა — შეგიძლია დაამარცხო? 💪
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">შენი სახელი:</label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && startQuiz()}
              placeholder="მაგ: გიორგი"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[var(--color-primary)] text-lg"
              autoFocus
            />
          </div>
          <button
            onClick={startQuiz}
            disabled={!playerName.trim()}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
          >
            {challengeData ? '⚔️ გამოწვევის მიღება!' : '🚀 დაწყება!'}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white/5">
            <div className="text-2xl">📝</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">10 კითხვა</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="text-2xl">⏱️</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">15 წამი თითო</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="text-2xl">🏆</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">შეჯიბრი!</div>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ
  if (phase === 'quiz' && currentQuestion) {
    const progress = ((currentQ) / 10) * 100;
    const timerColor = timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-yellow-400' : 'text-green-400';

    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--color-text-muted)]">კითხვა {currentQ + 1}/10</span>
            <div className="flex items-center gap-3">
              {streak >= 2 && <span className="text-sm font-bold text-orange-400">🔥 {streak}x სტრიკი!</span>}
              <span className={`text-lg font-bold ${timerColor}`}>⏱️ {timeLeft}</span>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Score */}
        <div className="text-center mb-4">
          <span className="text-sm text-[var(--color-text-muted)]">ქულა: </span>
          <span className="font-bold text-[var(--color-primary)]">{score}</span>
        </div>

        {/* Question */}
        <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
            {currentQuestion.type === 'vocab' ? '📖 ლექსიკა' : '📐 გრამატიკა'}
          </div>
          <h3 className="text-xl font-bold leading-relaxed">{currentQuestion.question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            let cls = 'w-full text-left px-5 py-4 rounded-xl border text-base font-medium transition-all duration-300 ';
            if (!showAnswer) {
              cls += 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 active:scale-[0.98]';
            } else if (idx === currentQuestion.correct) {
              cls += 'bg-green-500/20 border-green-500/50 text-green-300';
            } else if (idx === selected) {
              cls += 'bg-red-500/20 border-red-500/50 text-red-300';
            } else {
              cls += 'bg-white/5 border-white/5 opacity-50';
            }

            return (
              <button key={idx} onClick={() => handleAnswer(idx)} className={cls} disabled={showAnswer}>
                <span className="mr-3 text-[var(--color-text-muted)]">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showAnswer && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${selected === currentQuestion.correct ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
            {selected === currentQuestion.correct ? '✅ სწორია! ' : '❌ არასწორია. '}
            {currentQuestion.explanation}
          </div>
        )}
      </div>
    );
  }

  // RESULT
  if (phase === 'result') {
    const pct = Math.round((score / 10) * 100);
    const beat = challengeData ? score > challengeData.sc : false;
    const tie = challengeData ? score === challengeData.sc : false;

    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white mb-6 text-sm flex items-center gap-1">
          ← მთავარი
        </button>

        {/* Score display */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-4">{getEmoji(score)}</div>
          <h2 className="text-3xl font-bold mb-1">{score}/10</h2>
          <p className="text-lg text-[var(--color-text-muted)]">{getMessage(score)}</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{playerName} — {pct}% სისწორე</p>
        </div>

        {/* Score bar */}
        <div className="mb-6 p-4 rounded-2xl bg-white/5">
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[var(--color-primary)] to-emerald-400"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Comparison with challenger */}
        {challengeData && (
          <div className={`mb-6 p-5 rounded-2xl text-center border ${beat ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' : tie ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30'}`}>
            <div className="text-4xl mb-2">{beat ? '🎉🏆🎉' : tie ? '🤝' : '😤'}</div>
            <p className="text-xl font-bold mb-2">
              {beat ? 'დაამარცხე!' : tie ? 'ფრე!' : `${challengeData.n} მოიგო!`}
            </p>
            <div className="flex justify-center items-center gap-4 text-lg">
              <div>
                <div className="font-bold text-[var(--color-primary)]">{score}/10</div>
                <div className="text-xs text-[var(--color-text-muted)]">{playerName}</div>
              </div>
              <div className="text-2xl">⚔️</div>
              <div>
                <div className="font-bold text-orange-400">{challengeData.sc}/10</div>
                <div className="text-xs text-[var(--color-text-muted)]">{challengeData.n}</div>
              </div>
            </div>
          </div>
        )}

        {/* Share section */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30">
          <p className="text-center font-bold mb-1">
            {challengeData ? '🔄 გაუგზავნე სხვა მეგობარს!' : '⚔️ გამოუწვიე მეგობარი!'}
          </p>
          <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">
            გაუზიარე ლინკი — ვნახოთ დაგამარცხებს თუ არა! 😏
          </p>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://wa.me/?text=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors"
            >
              💬 WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${encodedUrl}&text=${telegramShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors"
            >
              ✈️ Telegram
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors"
            >
              👤 Facebook
            </a>
            <button
              onClick={copyLink}
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors"
            >
              {copied ? '✅ დაკოპირდა!' : '🔗 კოპირება'}
            </button>
          </div>
        </div>

        {/* Play again */}
        <button
          onClick={() => {
            setSeed(Math.floor(Math.random() * 1000000));
            setChallengeData(null);
            setPhase('name');
            setCurrentQ(0);
            setScore(0);
            window.location.hash = '';
          }}
          className="w-full mt-4 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 transition-colors"
        >
          🔄 ახალი გამოწვევა
        </button>
      </div>
    );
  }

  return null;
}
