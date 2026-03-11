import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Deck, FlashCard } from '../lib/cards';
import { playCorrect, playWrong } from '../lib/sounds';
import { addCardReview } from '../lib/gamification';

function awardXP(amount: number) {
  try {
    const current = parseInt(localStorage.getItem('totalXP') || '0');
    localStorage.setItem('totalXP', String(current + amount));
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

// Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

type PromptType = 'translate' | 'describe' | 'complete';

interface Prompt {
  type: PromptType;
  card: FlashCard;
  instruction: string;     // Georgian instruction
  hint: string;            // Help text
  referenceAnswer: string; // Expected answer for comparison
  bonusWords: string[];    // Key words to look for
}

function buildPrompts(deck: Deck): Prompt[] {
  const cards = deck.cards.filter(c => c.english && c.georgian);
  if (cards.length < 5) return [];

  const picked = shuffleArray(cards).slice(0, Math.min(8, cards.length));
  const prompts: Prompt[] = [];

  picked.forEach((card, i) => {
    const mod = i % 3;
    if (mod === 0) {
      // Translate: write the English word/phrase
      prompts.push({
        type: 'translate',
        card,
        instruction: `✏️ დაწერე ინგლისურად: "${card.georgian}"`,
        hint: card.pronunciation || '',
        referenceAnswer: card.english.toLowerCase(),
        bonusWords: card.english.toLowerCase().split(/\s+/),
      });
    } else if (mod === 1 && card.example_en) {
      // Complete: finish the sentence
      const words = card.example_en.split(/\s+/);
      const cutAt = Math.max(2, Math.floor(words.length * 0.5));
      const start = words.slice(0, cutAt).join(' ');
      prompts.push({
        type: 'complete',
        card,
        instruction: `📝 დაასრულე წინადადება:`,
        hint: `"${start}..."`,
        referenceAnswer: card.example_en.toLowerCase(),
        bonusWords: words.slice(cutAt).map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean),
      });
    } else {
      // Describe: use the word in a sentence
      prompts.push({
        type: 'describe',
        card,
        instruction: `📖 გამოიყენე სიტყვა წინადადებაში:`,
        hint: `"${card.english}" — ${card.georgian}`,
        referenceAnswer: card.example_en?.toLowerCase() || card.english.toLowerCase(),
        bonusWords: [card.english.toLowerCase().replace(/[^a-z\s]/g, '')],
      });
    }
  });

  return prompts;
}

function scoreAnswer(input: string, prompt: Prompt): { score: number; feedback: string; matchedWords: string[] } {
  const cleaned = input.trim().toLowerCase();
  if (!cleaned) return { score: 0, feedback: 'ცარიელი პასუხი', matchedWords: [] };

  const matchedWords = prompt.bonusWords.filter(w => cleaned.includes(w));

  if (prompt.type === 'translate') {
    // Exact or near-exact match for translation
    const dist = levenshtein(cleaned, prompt.referenceAnswer);
    const maxLen = Math.max(cleaned.length, prompt.referenceAnswer.length);
    const similarity = maxLen > 0 ? 1 - dist / maxLen : 0;

    if (similarity >= 0.95) return { score: 3, feedback: '🎯 შესანიშნავი! სრულყოფილი პასუხი!', matchedWords };
    if (similarity >= 0.75) return { score: 2, feedback: '✅ კარგია! მცირე შეცდომით.', matchedWords };
    if (similarity >= 0.5) return { score: 1, feedback: '🟡 ახლოს ხარ, მაგრამ შეამოწმე მართლწერა.', matchedWords };
    if (matchedWords.length > 0) return { score: 1, feedback: '🟡 სწორი მიმართულებაა!', matchedWords };
    return { score: 0, feedback: '❌ სცადე თავიდან. სწორი პასუხი ქვემოთაა.', matchedWords };
  }

  if (prompt.type === 'complete') {
    // Check if they used the key missing words
    const ratio = matchedWords.length / Math.max(1, prompt.bonusWords.length);
    if (ratio >= 0.8 && cleaned.length > 10) return { score: 3, feedback: '🎯 შესანიშნავი! სწორად დაასრულე!', matchedWords };
    if (ratio >= 0.5) return { score: 2, feedback: '✅ კარგია! ძირითადი სიტყვები სწორად გამოიყენე.', matchedWords };
    if (matchedWords.length > 0) return { score: 1, feedback: '🟡 ნაწილობრივ სწორია.', matchedWords };
    return { score: 0, feedback: '❌ სცადე თავიდან. ნიმუშის პასუხი ქვემოთაა.', matchedWords };
  }

  // Describe: check if they used the word and wrote a real sentence
  const usedWord = matchedWords.length > 0;
  const hasLength = cleaned.split(/\s+/).length >= 3;

  if (usedWord && hasLength) return { score: 3, feedback: '🎯 შესანიშნავი! კარგი წინადადება!', matchedWords };
  if (usedWord) return { score: 2, feedback: '✅ სიტყვა სწორად გამოიყენე. სცადე უფრო გრძელი წინადადება!', matchedWords };
  if (hasLength) return { score: 1, feedback: '🟡 წინადადება კარგია, მაგრამ სიტყვა არ გამოიყენე.', matchedWords };
  return { score: 0, feedback: '❌ გამოიყენე სიტყვა წინადადებაში.', matchedWords };
}

interface Props {
  deck: Deck;
  onBack: () => void;
}

export default function WritingExercise({ deck, onBack }: Props) {
  const prompts = useMemo(() => buildPrompts(deck), [deck]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string; matchedWords: string[] } | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [startTime] = useState(Date.now());
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!submitted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [current, submitted]);

  const handleSubmit = useCallback(() => {
    if (submitted || !prompts[current]) return;
    const res = scoreAnswer(input, prompts[current]);
    setResult(res);
    setSubmitted(true);
    setScores(prev => [...prev, res.score]);

    const xp = res.score * 5; // 0, 5, 10, or 15 XP
    if (xp > 0) {
      awardXP(xp);
      setTotalXP(prev => prev + xp);
      addCardReview(1);
      playCorrect();
    } else {
      playWrong();
    }
  }, [input, submitted, current, prompts]);

  const handleNext = useCallback(() => {
    setSubmitted(false);
    setResult(null);
    setInput('');
    setCurrent(prev => prev + 1);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!submitted) handleSubmit();
      else if (current < prompts.length - 1) handleNext();
    }
  }, [submitted, handleSubmit, handleNext, current, prompts.length]);

  // Not enough cards
  if (prompts.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-xl font-bold mb-2">არ არის საკმარისი სიტყვები</h2>
        <p className="text-[var(--color-text-muted)] mb-6">ამ კოლოდას საკმარისი ბარათები არ აქვს წერის სავარჯიშოსთვის (მინიმუმ 5).</p>
        <button onClick={onBack} className="px-6 py-3 bg-[var(--color-bg-card)] rounded-xl font-bold hover:bg-white/10 transition-colors">
          ← უკან
        </button>
      </div>
    );
  }

  // Results screen
  if (current >= prompts.length) {
    const maxPossible = prompts.length * 3;
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const pct = Math.round((totalScore / maxPossible) * 100);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const perfect = scores.filter(s => s === 3).length;

    return (
      <div className="max-w-lg mx-auto px-4 py-8 screen-enter">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{pct >= 80 ? '🏆' : pct >= 50 ? '✅' : '📝'}</div>
          <h2 className="text-2xl font-bold mb-1">წერის სავარჯიშო დასრულდა!</h2>
          <p className="text-[var(--color-text-muted)]">{deck.name}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="we-stat-card">
            <div className="text-2xl font-bold" style={{ color: pct >= 80 ? '#4ade80' : pct >= 50 ? '#fbbf24' : '#f87171' }}>{pct}%</div>
            <div className="text-xs text-[var(--color-text-muted)]">ხარისხი</div>
          </div>
          <div className="we-stat-card">
            <div className="text-2xl font-bold text-yellow-400">+{totalXP}</div>
            <div className="text-xs text-[var(--color-text-muted)]">XP</div>
          </div>
          <div className="we-stat-card">
            <div className="text-2xl font-bold text-sky-400">{perfect}/{prompts.length}</div>
            <div className="text-xs text-[var(--color-text-muted)]">შესანიშნავი</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {scores.map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--color-bg-card)] border border-white/5">
              <span className={`text-lg ${s === 3 ? 'text-green-400' : s === 2 ? 'text-sky-400' : s === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                {s === 3 ? '🎯' : s === 2 ? '✅' : s === 1 ? '🟡' : '❌'}
              </span>
              <span className="text-sm flex-1 truncate">{prompts[i].card.english}</span>
              <span className="text-xs text-[var(--color-text-muted)]">+{s * 5} XP</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/5 font-bold hover:bg-white/10 transition-colors">
            ← უკან
          </button>
          <button onClick={() => { setCurrent(0); setScores([]); setTotalXP(0); setInput(''); setSubmitted(false); setResult(null); }} className="flex-1 py-3 rounded-xl bg-green-600 border-b-4 border-green-700 font-bold text-white hover:bg-green-500 transition-colors active:border-b-2 active:translate-y-[2px]">
            🔄 თავიდან
          </button>
        </div>
      </div>
    );
  }

  const prompt = prompts[current];
  const progress = ((current) / prompts.length) * 100;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 screen-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm flex items-center gap-1">
          ← უკან
        </button>
        <span className="text-sm font-bold">{current + 1}/{prompts.length}</span>
        <span className="text-sm text-yellow-400 font-bold">+{totalXP} XP</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Prompt card */}
      <div className="we-prompt-card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`we-type-badge ${prompt.type === 'translate' ? 'we-type-translate' : prompt.type === 'complete' ? 'we-type-complete' : 'we-type-describe'}`}>
            {prompt.type === 'translate' ? 'თარგმანი' : prompt.type === 'complete' ? 'დასრულება' : 'წინადადება'}
          </span>
        </div>
        <p className="text-lg font-bold mb-2">{prompt.instruction}</p>
        {prompt.hint && (
          <p className="text-base text-sky-400">{prompt.hint}</p>
        )}
      </div>

      {/* Input area */}
      <div className="mb-4">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitted}
          placeholder="ჩაწერე ინგლისურად..."
          className="we-textarea"
          rows={3}
        />
      </div>

      {/* Feedback */}
      {submitted && result && (
        <div className={`we-feedback ${result.score >= 2 ? 'we-feedback-good' : result.score === 1 ? 'we-feedback-ok' : 'we-feedback-bad'}`}>
          <p className="font-bold mb-1">{result.feedback}</p>
          {result.score < 3 && (
            <p className="text-sm opacity-80">
              💡 სწორი პასუხი: <span className="font-mono">{prompt.type === 'complete' ? prompt.referenceAnswer : prompt.card.english}</span>
            </p>
          )}
          {prompt.card.example_en && prompt.type !== 'complete' && (
            <p className="text-sm opacity-70 mt-1">
              📖 მაგალითი: {prompt.card.example_en}
            </p>
          )}
        </div>
      )}

      {/* Action button */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-3.5 rounded-xl bg-green-600 border-b-4 border-green-700 font-bold text-white hover:bg-green-500 transition-all active:border-b-2 active:translate-y-[2px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          შეამოწმე ✓
        </button>
      ) : (
        <button
          onClick={current < prompts.length - 1 ? handleNext : () => setCurrent(prompts.length)}
          className="w-full py-3.5 rounded-xl bg-sky-600 border-b-4 border-sky-700 font-bold text-white hover:bg-sky-500 transition-all active:border-b-2 active:translate-y-[2px]"
        >
          {current < prompts.length - 1 ? 'შემდეგი →' : 'შედეგები 📊'}
        </button>
      )}
    </div>
  );
}
