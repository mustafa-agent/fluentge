import { useState, useEffect } from 'react';
import { getStats } from '../lib/storage';
import { 
  getCurrentStreak, 
  getTotalXP, 
  calculateLevel, 
  getXPProgress, 
  getTodayCardsReviewed, 
  getDailyCardGoal,
  isDailyGoalMet 
} from '../lib/gamification';

export default function StatsBar() {
  const [stats, setStats] = useState(() => getStats());
  const [streak, setStreak] = useState(() => getCurrentStreak());
  const [totalXP, setTotalXP] = useState(() => getTotalXP());
  const [studyTime, setStudyTime] = useState(() => getTodayCardsReviewed());
  const [dailyGoal, setDailyGoal] = useState(() => getDailyCardGoal());

  // Refresh stats periodically (every 2s) to catch updates from study sessions
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getStats());
      setStreak(getCurrentStreak());
      setTotalXP(getTotalXP());
      setStudyTime(getTodayCardsReviewed());
      setDailyGoal(getDailyCardGoal());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const level = calculateLevel(totalXP);
  const xpProgress = getXPProgress(totalXP);
  const goalProgress = Math.min(100, dailyGoal > 0 ? (studyTime / dailyGoal) * 100 : 0);
  const goalMet = isDailyGoalMet();
  const streakActive = streak > 0;

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-3">
      {/* Top row: Streak, XP, Level */}
      <div className="grid grid-cols-3 gap-3">
        {/* Streak */}
        <div className={`streak-badge ${streakActive ? 'active' : 'inactive'} rounded-xl p-3 text-center`}>
          <div className="text-2xl font-bold flex items-center justify-center gap-1">
            <span className={streakActive ? 'animate-pulse' : ''}>🔥</span>
            <span>{streak}</span>
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {streak === 0 ? 'დაიწყე დღეს!' : streak === 1 ? 'პირველი დღე!' : `${streak} დღე!`}
          </div>
        </div>

        {/* XP */}
        <div className="xp-badge rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
            ⭐ {totalXP}
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">XP ქულები</div>
        </div>

        {/* Level */}
        <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">
            Lv.{level}
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">დონე</div>
        </div>
      </div>

      {/* XP Progress to next level */}
      <div className="bg-[var(--color-bg-card)] rounded-xl px-4 py-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--color-text-muted)]">დონე {level} → {level + 1}</span>
          <span className="text-yellow-400 font-semibold">{xpProgress.current}/{xpProgress.needed} XP</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${xpProgress.progress}%` }}
          />
        </div>
      </div>

      {/* Daily Goal */}
      <div className={`daily-goal-card rounded-xl px-4 py-3 ${goalMet ? 'complete' : ''}`}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold flex items-center gap-1">
            🎯 დღის მიზანი
            {goalMet && <span className="text-green-400 text-xs ml-1">✅ შესრულდა!</span>}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {studyTime}/{dailyGoal} ბარათი
          </span>
        </div>
        <div className="daily-goal-bar w-full bg-white/10 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${
              goalMet 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                : 'bg-gradient-to-r from-green-500 to-green-400'
            }`}
            style={{ width: `${goalProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
