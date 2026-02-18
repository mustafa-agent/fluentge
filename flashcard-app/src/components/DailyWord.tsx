import { useState } from 'react';
import { decks } from '../lib/cards';

const allCards = decks.flatMap(d => d.cards);

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getStreak(): number {
  const today = new Date().toISOString().slice(0, 10);
  const raw = localStorage.getItem('dailyword_streak');
  const data = raw ? JSON.parse(raw) : { date: '', streak: 0 };
  if (data.date === today) return data.streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = data.date === yesterday ? data.streak + 1 : 1;
  localStorage.setItem('dailyword_streak', JSON.stringify({ date: today, streak: newStreak }));
  return newStreak;
}

export default function DailyWord() {
  const [revealed, setRevealed] = useState(false);

  const dayIndex = getDayOfYear() % allCards.length;
  const card = allCards[dayIndex];
  const streak = getStreak();

  if (!card) return null;

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div
        onClick={() => setRevealed(!revealed)}
        className="bg-[var(--color-bg-card)] rounded-2xl p-5 cursor-pointer border border-white/5 hover:border-[var(--color-primary)]/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[var(--color-text-muted)]">📅 დღის სიტყვა</span>
          <span className="text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-0.5 rounded-full">🔥 {streak} დღე</span>
        </div>
        <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">{card.english}</div>
        <div className="text-sm text-[var(--color-text-muted)] mb-2">/{card.pronunciation}/</div>
        {revealed ? (
          <div className="space-y-2 animate-fadeIn">
            <div className="text-lg font-semibold text-amber-400">{card.georgian}</div>
            {card.example_en && (
              <div className="text-sm text-[var(--color-text-muted)] italic">"{card.example_en}"</div>
            )}
            {card.example_ka && (
              <div className="text-sm text-[var(--color-text-muted)]">"{card.example_ka}"</div>
            )}
          </div>
        ) : (
          <div className="text-sm text-[var(--color-text-muted)]">👆 შეეხე თარგმანის სანახავად</div>
        )}
      </div>
    </div>
  );
}
