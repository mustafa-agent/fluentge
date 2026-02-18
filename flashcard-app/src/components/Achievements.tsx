import { useState, useEffect } from 'react';
import { getStats, getAllProgress } from '../lib/storage';
import { decks } from '../lib/cards';

interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  check: () => boolean;
}

const ACHIEVEMENTS_KEY = 'fluentge_achievements';
const TOAST_KEY = 'fluentge_achievement_toast';

function getEarnedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '[]');
  } catch { return []; }
}

function saveEarnedIds(ids: string[]) {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(ids));
}

function getBadges(): Badge[] {
  const stats = getStats();
  const progress = getAllProgress();
  const startedDecks = new Set(
    Object.keys(progress).map(k => k.split('_')[0])
  );

  return [
    {
      id: 'words10',
      icon: '📖',
      title: 'პირველი 10 სიტყვა',
      description: '10 სიტყვა ისწავლე',
      check: () => stats.wordsLearned >= 10,
    },
    {
      id: 'words50',
      icon: '📚',
      title: '50 სიტყვა',
      description: '50 სიტყვა ისწავლე',
      check: () => stats.wordsLearned >= 50,
    },
    {
      id: 'words100',
      icon: '🎓',
      title: '100 სიტყვა',
      description: '100 სიტყვა ისწავლე',
      check: () => stats.wordsLearned >= 100,
    },
    {
      id: 'streak7',
      icon: '🔥',
      title: '7-დღიანი სტრიქი',
      description: '7 დღე ზედიზედ ისწავლე',
      check: () => stats.streak >= 7,
    },
    {
      id: 'speed_demon',
      icon: '⚡',
      title: 'სიჩქარის დემონი',
      description: 'Speed Round-ში 10 სწორი პასუხი',
      check: () => {
        try {
          const sr = JSON.parse(localStorage.getItem('fluentge_speed_best') || '0');
          return sr >= 10;
        } catch { return false; }
      },
    },
    {
      id: 'perfect_quiz',
      icon: '💯',
      title: 'სრულყოფილი ქვიზი',
      description: 'ქვიზში 10/10 სწორი პასუხი',
      check: () => {
        try {
          const pq = JSON.parse(localStorage.getItem('fluentge_perfect_quiz') || 'false');
          return pq === true;
        } catch { return false; }
      },
    },
    {
      id: 'all_decks',
      icon: '🌟',
      title: 'ყველა კოლოდა',
      description: 'ყველა კოლოდა დაიწყე',
      check: () => startedDecks.size >= decks.length,
    },
  ];
}

// Call this from other components to check for new achievements
export function checkAchievements() {
  const badges = getBadges();
  const earned = getEarnedIds();
  const newEarned: string[] = [];

  badges.forEach(b => {
    if (!earned.includes(b.id) && b.check()) {
      newEarned.push(b.id);
    }
  });

  if (newEarned.length > 0) {
    const allEarned = [...earned, ...newEarned];
    saveEarnedIds(allEarned);
    // Store toast for display
    const badge = badges.find(b => b.id === newEarned[0]);
    if (badge) {
      localStorage.setItem(TOAST_KEY, JSON.stringify({ icon: badge.icon, title: badge.title }));
    }
  }
}

interface Props {
  onBack: () => void;
}

export default function Achievements({ onBack }: Props) {
  const [badges, setBadges] = useState<(Badge & { earned: boolean })[]>([]);
  const [toast, setToast] = useState<{ icon: string; title: string } | null>(null);

  useEffect(() => {
    checkAchievements();
    const earned = getEarnedIds();
    const allBadges = getBadges().map(b => ({
      ...b,
      earned: earned.includes(b.id) || b.check(),
    }));
    setBadges(allBadges);

    // Check for toast
    try {
      const t = localStorage.getItem(TOAST_KEY);
      if (t) {
        setToast(JSON.parse(t));
        localStorage.removeItem(TOAST_KEY);
        setTimeout(() => setToast(null), 3000);
      }
    } catch {}
  }, []);

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-primary)] text-white px-5 py-3 rounded-xl shadow-lg animate-bounce flex items-center gap-2">
          <span className="text-2xl">{toast.icon}</span>
          <span className="font-semibold">ახალი მიღწევა: {toast.title}!</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
          ← უკან
        </button>
        <span className="text-sm text-[var(--color-text-muted)]">
          {earnedCount}/{badges.length} მიღწეული
        </span>
      </div>

      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🏆</div>
        <h2 className="text-2xl font-bold">მიღწევები</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">შეაგროვე ყველა ბეჯი!</p>
      </div>

      <div className="grid gap-3">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              badge.earned
                ? 'bg-[var(--color-bg-card)] border-[var(--color-primary)]/30'
                : 'bg-[var(--color-bg-card)] border-transparent opacity-50 grayscale'
            }`}
          >
            <div className="text-3xl">{badge.icon}</div>
            <div className="flex-1">
              <div className="font-semibold">{badge.title}</div>
              <div className="text-sm text-[var(--color-text-muted)]">{badge.description}</div>
            </div>
            {badge.earned ? (
              <div className="text-green-400 text-xl">✅</div>
            ) : (
              <div className="text-xl">🔒</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
