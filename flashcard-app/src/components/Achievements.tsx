import { useState, useEffect } from 'react';
import { getStats, getAllProgress } from '../lib/storage';
import { deckIndex } from '../lib/deck-index';

interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  gradient: string;
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
      title: 'პირველი ნაბიჯები',
      description: '10 სიტყვა ისწავლე',
      gradient: 'from-sky-400 to-blue-500',
      check: () => stats.wordsLearned >= 10,
    },
    {
      id: 'words50',
      icon: '📚',
      title: 'სიტყვების შემგროვებელი',
      description: '50 სიტყვა ისწავლე',
      gradient: 'from-green-400 to-emerald-500',
      check: () => stats.wordsLearned >= 50,
    },
    {
      id: 'words100',
      icon: '🎓',
      title: 'სიტყვების ოსტატი',
      description: '100 სიტყვა ისწავლე',
      gradient: 'from-purple-400 to-indigo-500',
      check: () => stats.wordsLearned >= 100,
    },
    {
      id: 'words500',
      icon: '🧠',
      title: 'ლექსიკონი',
      description: '500 სიტყვა ისწავლე',
      gradient: 'from-amber-400 to-orange-500',
      check: () => stats.wordsLearned >= 500,
    },
    {
      id: 'streak3',
      icon: '🔥',
      title: '3-დღიანი სერია',
      description: '3 დღე ზედიზედ ისწავლე',
      gradient: 'from-orange-400 to-red-500',
      check: () => stats.streak >= 3,
    },
    {
      id: 'streak7',
      icon: '🔥',
      title: 'კვირის მეომარი',
      description: '7 დღე ზედიზედ ისწავლე',
      gradient: 'from-red-400 to-rose-600',
      check: () => stats.streak >= 7,
    },
    {
      id: 'streak30',
      icon: '💎',
      title: 'თვის ჩემპიონი',
      description: '30 დღე ზედიზედ ისწავლე',
      gradient: 'from-cyan-400 to-blue-600',
      check: () => stats.streak >= 30,
    },
    {
      id: 'perfect_quiz',
      icon: '💯',
      title: 'სრულყოფილი ქვიზი',
      description: 'ქვიზში 10/10 სწორი პასუხი',
      gradient: 'from-yellow-400 to-amber-500',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('fluentge_perfect_quiz') || 'false') === true;
        } catch { return false; }
      },
    },
    {
      id: 'speed_demon',
      icon: '⚡',
      title: 'სიჩქარის დემონი',
      description: 'Speed Round-ში 10 სწორი პასუხი',
      gradient: 'from-yellow-300 to-yellow-500',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('fluentge_speed_best') || '0') >= 10;
        } catch { return false; }
      },
    },
    {
      id: 'all_decks',
      icon: '🌟',
      title: 'ყველა კოლოდა',
      description: 'ყველა კოლოდა დაიწყე',
      gradient: 'from-pink-400 to-rose-500',
      check: () => startedDecks.size >= deckIndex.length,
    },
  ];
}

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
      {/* Achievement unlock toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center gap-3 border-b-4 border-amber-600">
          <span className="text-3xl">{toast.icon}</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">ახალი მიღწევა!</div>
            <div className="font-extrabold">{toast.title}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-xl">
          ✕
        </button>
        <div className="flex-1" />
        <span className="text-sm font-semibold text-[var(--color-text-muted)]">
          {earnedCount}/{badges.length}
        </span>
      </div>

      {/* Title + progress */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🏆</div>
        <h2 className="text-3xl font-extrabold mb-2">მიღწევები</h2>
        <p className="text-sm text-[var(--color-text-muted)]">შეაგროვე ყველა ბეჯი!</p>
        <div className="mt-4 max-w-xs mx-auto quiz-progress-track">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-500" style={{ width: `${badges.length > 0 ? (earnedCount / badges.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid gap-3">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}
          >
            <div className={`badge-icon ${badge.earned ? `bg-gradient-to-br ${badge.gradient}` : ''}`}>
              {badge.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[var(--color-text)]">{badge.title}</div>
              <div className="text-sm text-[var(--color-text-muted)]">{badge.description}</div>
            </div>
            {badge.earned ? (
              <span className="text-green-400 text-xl flex-shrink-0">✅</span>
            ) : (
              <span className="text-xl flex-shrink-0">🔒</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
