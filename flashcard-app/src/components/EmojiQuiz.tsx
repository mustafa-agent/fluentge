import { useState, useEffect } from 'react';

interface EmojiPuzzle {
  emojis: string;
  answer: string;
  hint: string;
  georgian: string;
}

const puzzles: EmojiPuzzle[] = [
  { emojis: '🌧️🌈', answer: 'rainbow', hint: 'Appears after rain', georgian: 'ცისარტყელა' },
  { emojis: '🏠🔑', answer: 'house key', hint: 'Opens your front door', georgian: 'სახლის გასაღები' },
  { emojis: '☀️🌻', answer: 'sunflower', hint: 'A yellow flower that follows the sun', georgian: 'მზესუმზირა' },
  { emojis: '🍎📱', answer: 'apple', hint: 'A fruit and a tech company', georgian: 'ვაშლი' },
  { emojis: '⏰💤', answer: 'alarm clock', hint: 'Wakes you up in the morning', georgian: 'მაღვიძარა' },
  { emojis: '✈️🧳', answer: 'travel', hint: 'Going to new places', georgian: 'მოგზაურობა' },
  { emojis: '📚🎓', answer: 'education', hint: 'Learning at school or university', georgian: 'განათლება' },
  { emojis: '🎂🎁', answer: 'birthday', hint: 'Celebrated once a year', georgian: 'დაბადების დღე' },
  { emojis: '❤️💍', answer: 'engagement', hint: 'Before the wedding', georgian: 'ნიშნობა' },
  { emojis: '🌊🏄', answer: 'surfing', hint: 'Riding ocean waves', georgian: 'სერფინგი' },
  { emojis: '🎄🎅', answer: 'christmas', hint: 'December 25th holiday', georgian: 'შობა' },
  { emojis: '🌙⭐', answer: 'night sky', hint: 'What you see when you look up at night', georgian: 'ღამის ცა' },
  { emojis: '🍕🇮🇹', answer: 'italian food', hint: 'Pizza and pasta come from here', georgian: 'იტალიური საჭმელი' },
  { emojis: '🏔️❄️', answer: 'mountain', hint: 'Tall, covered in snow', georgian: 'მთა' },
  { emojis: '🎬🍿', answer: 'movie', hint: 'Watch it in a cinema', georgian: 'ფილმი' },
  { emojis: '🔥🏕️', answer: 'campfire', hint: 'Burn wood outdoors at night', georgian: 'კოცონი' },
  { emojis: '🐶🦴', answer: 'dog', hint: 'Man\'s best friend', georgian: 'ძაღლი' },
  { emojis: '☕📰', answer: 'morning routine', hint: 'What many adults do first thing', georgian: 'დილის რუტინა' },
  { emojis: '🎸🎤', answer: 'concert', hint: 'Live music event', georgian: 'კონცერტი' },
  { emojis: '🧊🥤', answer: 'iced drink', hint: 'Cold beverage with ice', georgian: 'ცივი სასმელი' },
  { emojis: '🌍🤝', answer: 'peace', hint: 'World harmony', georgian: 'მშვიდობა' },
  { emojis: '💡🧠', answer: 'idea', hint: 'A thought or plan', georgian: 'იდეა' },
  { emojis: '🚗💨', answer: 'fast car', hint: 'Speeding vehicle', georgian: 'სწრაფი მანქანა' },
  { emojis: '📱💬', answer: 'text message', hint: 'Send words on your phone', georgian: 'ტექსტური შეტყობინება' },
  { emojis: '🎯🏆', answer: 'goal', hint: 'Something you aim to achieve', georgian: 'მიზანი' },
  { emojis: '🌺🐝', answer: 'pollination', hint: 'Bees help flowers reproduce', georgian: 'დამტვერვა' },
  { emojis: '👨‍🍳🍳', answer: 'cooking', hint: 'Preparing food', georgian: 'საჭმლის მომზადება' },
  { emojis: '🎮👾', answer: 'video game', hint: 'Play on console or PC', georgian: 'ვიდეო თამაში' },
  { emojis: '📸🏞️', answer: 'photography', hint: 'Taking pictures of landscapes', georgian: 'ფოტოგრაფია' },
  { emojis: '🧹✨', answer: 'cleaning', hint: 'Making things tidy and shiny', georgian: 'დალაგება' },
];

export default function EmojiQuiz({ onBack }: { onBack: () => void }) {
  const [shuffled, setShuffled] = useState<EmojiPuzzle[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const total = 10;

  useEffect(() => {
    const s = [...puzzles].sort(() => Math.random() - 0.5).slice(0, total);
    setShuffled(s);
  }, []);

  if (shuffled.length === 0) return null;

  function check() {
    const correct = input.trim().toLowerCase() === shuffled[current].answer.toLowerCase();
    if (correct) {
      setScore(s => s + 1);
    }
    setRevealed(true);
  }

  function next() {
    if (current + 1 >= total) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setInput('');
      setShowHint(false);
      setRevealed(false);
    }
  }

  function restart() {
    const s = [...puzzles].sort(() => Math.random() - 0.5).slice(0, total);
    setShuffled(s);
    setCurrent(0);
    setInput('');
    setShowHint(false);
    setRevealed(false);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="px-4 py-8 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2">შედეგი</h2>
        <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">{score}/{total}</p>
        <p className="text-[var(--color-text-muted)] mb-6">{pct}% სწორი</p>
        <div className="flex gap-3 justify-center">
          <button onClick={restart} className="bg-[var(--color-primary)] text-black px-6 py-3 rounded-xl font-bold">
            თავიდან 🔄
          </button>
          <button onClick={onBack} className="bg-[var(--color-bg-card)] px-6 py-3 rounded-xl">
            მთავარი
          </button>
        </div>
      </div>
    );
  }

  const puzzle = shuffled[current];
  const isCorrect = input.trim().toLowerCase() === puzzle.answer.toLowerCase();

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">{current + 1}/{total} | ✅ {score}</span>
      </div>

      <h2 className="text-xl font-bold text-center mb-2">🎭 Emoji Quiz</h2>
      <p className="text-center text-[var(--color-text-muted)] text-sm mb-6">გამოიცანი სიტყვა ემოჯიდან!</p>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-8 text-center mb-4">
        <div className="text-7xl mb-6">{puzzle.emojis}</div>

        {!revealed ? (
          <>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && input.trim() && check()}
              placeholder="ჩაწერე ინგლისურად..."
              className="w-full bg-[var(--color-bg)] border border-white/20 rounded-xl px-4 py-3 text-center text-lg mb-4 focus:outline-none focus:border-[var(--color-primary)]"
              autoFocus
            />
            <div className="flex gap-3 justify-center">
              <button
                onClick={check}
                disabled={!input.trim()}
                className="bg-[var(--color-primary)] text-black px-6 py-2 rounded-xl font-bold disabled:opacity-50"
              >
                შემოწმება
              </button>
              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="bg-[var(--color-bg)] px-4 py-2 rounded-xl text-sm"
                >
                  💡 მინიშნება
                </button>
              )}
            </div>
            {showHint && (
              <p className="mt-3 text-yellow-400 text-sm">💡 {puzzle.hint}</p>
            )}
          </>
        ) : (
          <div>
            <div className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✅ სწორია!' : '❌ არასწორია'}
            </div>
            <p className="text-xl font-bold text-[var(--color-primary)] mb-1">{puzzle.answer}</p>
            <p className="text-[var(--color-text-muted)]">{puzzle.georgian}</p>
            {!isCorrect && input.trim() && (
              <p className="text-sm text-red-400/70 mt-1">შენი პასუხი: {input}</p>
            )}
            <button onClick={next} className="mt-4 bg-[var(--color-primary)] text-black px-6 py-2 rounded-xl font-bold">
              შემდეგი →
            </button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
