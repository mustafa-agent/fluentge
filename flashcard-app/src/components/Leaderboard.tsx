import { useState, useEffect } from 'react';
import { getTotalXP, calculateLevel, getCurrentStreak } from '../lib/gamification';

// ── Types ────────────────────────────────────────────

interface LeaderboardUser {
  name: string;
  xp: number;
  level: number;
  streak: number;
  isCurrentUser: boolean;
}

interface LeaderboardData {
  weekStart: string;
  users: LeaderboardUser[];
  lastDailyUpdate: string;
}

// ── Helpers ──────────────────────────────────────────

const STORAGE_KEY = 'fluentge-leaderboard-v2';

const GEORGIAN_NAMES = [
  'ნიკა', 'მარიამი', 'გიორგი', 'ანა', 'დავითი',
  'თამარი', 'ლუკა', 'ნინო', 'ალექსი'
];

const AVATAR_GRADIENTS = [
  'from-rose-500 to-pink-600',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-green-600',
  'from-purple-500 to-violet-600',
  'from-cyan-500 to-teal-600',
  'from-red-500 to-rose-600',
  'from-indigo-500 to-blue-600',
  'from-lime-500 to-green-600',
  'from-fuchsia-500 to-pink-600',
  'from-yellow-500 to-amber-600',
];

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return monday.toISOString().split('T')[0];
}

function getWeeklyXP(): number {
  const weekKey = getWeekStart();
  return parseInt(localStorage.getItem(`fluentge-weekly-xp-${weekKey}`) || '0');
}

function generateSimulatedUsers(): LeaderboardUser[] {
  return GEORGIAN_NAMES.map(name => ({
    name,
    xp: Math.floor(Math.random() * 350) + 50, // 50-400
    level: Math.floor(Math.random() * 8) + 1,
    streak: Math.floor(Math.random() * 15),
    isCurrentUser: false,
  }));
}

function loadLeaderboard(): LeaderboardData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data: LeaderboardData = JSON.parse(raw);
      const currentWeek = getWeekStart();
      if (data.weekStart === currentWeek) {
        // Same week — check if simulated users need daily XP bump
        const today = new Date().toDateString();
        if (data.lastDailyUpdate !== today) {
          // Give simulated users 5-30 XP per day
          data.users = data.users.map(u => {
            if (u.isCurrentUser) return u;
            return { ...u, xp: u.xp + Math.floor(Math.random() * 25) + 5 };
          });
          data.lastDailyUpdate = today;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch {}

  // New week or first time — generate fresh
  const data: LeaderboardData = {
    weekStart: getWeekStart(),
    users: generateSimulatedUsers(),
    lastDailyUpdate: new Date().toDateString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

// ── Component ────────────────────────────────────────

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const data = loadLeaderboard();

    // Update current user
    const weeklyXP = getWeeklyXP();
    const totalXP = getTotalXP();
    const level = calculateLevel(totalXP);
    const streak = getCurrentStreak();

    const currentUser: LeaderboardUser = {
      name: 'შენ',
      xp: weeklyXP,
      level,
      streak,
      isCurrentUser: true,
    };

    // Merge: replace existing current user or add
    const others = data.users.filter(u => !u.isCurrentUser);
    const all = [...others, currentUser].sort((a, b) => b.xp - a.xp);
    setUsers(all.slice(0, 10));

    // Save back
    data.users = all;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  if (users.length === 0) return null;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-[var(--color-bg-card)] rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">🏆 ლიდერბორდი</h3>
            <p className="text-xs text-[var(--color-text-muted)]">ვინ ისწავლა ყველაზე მეტი ამ კვირაში?</p>
          </div>
          <span className="text-[10px] bg-[var(--color-bg)] px-2 py-1 rounded-full text-[var(--color-text-muted)]">
            განახლდება ორშაბათს
          </span>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-white/5">
        {users.map((user, i) => {
          const rank = i + 1;
          const gradientIdx = i % AVATAR_GRADIENTS.length;
          const initial = user.name.charAt(0);
          const isTop3 = rank <= 3;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                user.isCurrentUser
                  ? 'leaderboard-current bg-green-500/5 border-l-2 border-green-500'
                  : 'hover:bg-white/5'
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center flex-shrink-0">
                {isTop3 ? (
                  <span className="text-xl">{medals[rank - 1]}</span>
                ) : (
                  <span className="text-sm font-bold text-[var(--color-text-muted)]">#{rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[gradientIdx]} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-sm font-bold">{initial}</span>
              </div>

              {/* Name + streak */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${user.isCurrentUser ? 'text-green-400' : ''}`}>
                  {user.name} {user.isCurrentUser && '(შენ)'}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Lv.{user.level} {user.streak > 0 && `· 🔥${user.streak}`}
                </p>
              </div>

              {/* XP */}
              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-sm ${
                  rank === 1 ? 'text-yellow-400' :
                  rank === 2 ? 'text-gray-300' :
                  rank === 3 ? 'text-amber-600' :
                  user.isCurrentUser ? 'text-green-400' :
                  'text-[var(--color-text)]'
                }`}>
                  {user.xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
