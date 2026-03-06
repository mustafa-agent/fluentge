import { useState, useEffect } from 'react';
import { getUserStats, getDailyCardGoal, setDailyCardGoal, getTodayCardsReviewed } from '../lib/gamification';

interface Props {
  onBack?: () => void;
}

export default function GameStats({ onBack }: Props) {
  const [stats, setStats] = useState(() => getUserStats());
  const [showGoalSettings, setShowGoalSettings] = useState(false);
  const [newGoal, setNewGoal] = useState(getDailyCardGoal());
  const [todayCards, setTodayCards] = useState(getTodayCardsReviewed());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getUserStats());
      setTodayCards(getTodayCardsReviewed());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const cardGoal = getDailyCardGoal();
  const dailyGoalProgress = Math.min(100, (todayCards / cardGoal) * 100);
  const levelProgress = ((stats.totalXP % 200) / 200) * 100;
  const nextLevelXP = stats.level * 200;
  const currentLevelXP = stats.totalXP - ((stats.level - 1) * 200);

  function handleGoalChange(cards: number) {
    setDailyCardGoal(cards);
    setNewGoal(cards);
    setStats(getUserStats());
    setShowGoalSettings(false);
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white">
      {/* Header */}
      {onBack && (
        <header className="px-4 py-4 border-b border-white/10">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#C8C8C0] hover:text-white text-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
              უკან
            </button>
            <h1 className="text-lg font-bold">📊 პროგრესი</h1>
            <div></div>
          </div>
        </header>
      )}
      
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-6">📊 თქვენი პროგრესი</h2>
      
      {/* Level & XP */}
      <div className="bg-[#242426] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full flex items-center justify-center font-bold text-lg">
              {stats.level}
            </div>
            <div>
              <div className="font-bold">დონე {stats.level}</div>
              <div className="text-sm text-[#C8C8C0]">{stats.totalXP} XP</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[#C8C8C0]">შემდეგ დონეზე</div>
            <div className="text-sm font-medium">{200 - currentLevelXP} XP</div>
          </div>
        </div>
        
        {/* Level Progress Bar */}
        <div className="h-2 bg-[#1C1C1E] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      {/* Daily Goal */}
      <div className="bg-[#242426] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <div>
              <div className="font-bold">დღიური მიზანი</div>
              <div className="text-sm text-[#C8C8C0]">
                {todayCards}/{cardGoal} ბარათი
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowGoalSettings(!showGoalSettings)}
            className="text-[#007AFF] hover:text-[#5AC8FA] transition-colors"
          >
            ⚙️
          </button>
        </div>

        {/* Daily Goal Progress */}
        <div className="h-3 bg-[#1C1C1E] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              dailyGoalProgress >= 100 
                ? 'bg-gradient-to-r from-[#34C759] to-[#32D74B]' 
                : 'bg-gradient-to-r from-[#FF9500] to-[#FFCC02]'
            }`}
            style={{ width: `${dailyGoalProgress}%` }}
          />
        </div>

        {/* Goal achieved message */}
        {dailyGoalProgress >= 100 && (
          <div className="text-[#34C759] text-sm font-medium mt-2 flex items-center gap-2">
            ✅ დღიური მიზანი მიღწეულია! 🎉
          </div>
        )}

        {/* Goal Settings */}
        {showGoalSettings && (
          <div className="mt-4 p-3 bg-[#1C1C1E] rounded-lg">
            <div className="text-sm font-medium mb-3">აირჩიეთ დღიური მიზანი:</div>
            <div className="grid grid-cols-5 gap-2">
              {[20, 50, 100, 150, 200].map(num => (
                <button
                  key={num}
                  onClick={() => handleGoalChange(num)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    cardGoal === num
                      ? 'bg-[#007AFF] text-white'
                      : 'bg-[#242426] text-[#C8C8C0] hover:bg-[#2A2A2C]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Streak */}
      <div className="bg-[#242426] rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔥</div>
          <div>
            <div className="font-bold">{stats.currentStreak} დღიანი სერია</div>
            <div className="text-sm text-[#C8C8C0]">
              {stats.currentStreak > 0 
                ? 'გაგრძელეთ ყოველდღიური სწავლა!' 
                : 'დაიწყეთ თქვენი სერია დღესვე!'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#242426] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#007AFF]">{stats.level}</div>
          <div className="text-sm text-[#C8C8C0]">დონე</div>
        </div>
        
        <div className="bg-[#242426] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#FF9500]">{stats.totalXP}</div>
          <div className="text-sm text-[#C8C8C0]">სულ XP</div>
        </div>
      </div>

      {/* Motivational Messages */}
      <div className="mt-4 p-3 bg-gradient-to-r from-[#007AFF]/20 to-[#5AC8FA]/20 rounded-lg border border-[#007AFF]/30">
        <div className="text-sm text-center">
          {stats.currentStreak >= 7 ? (
            <span>🏆 შესანიშნავია! 7+ დღიანი სერია!</span>
          ) : stats.currentStreak >= 3 ? (
            <span>🔥 კარგად გქონიათ! გააგრძელეთ!</span>
          ) : todayCards > 0 ? (
            <span>💪 კარგი დაწყება! გაანახვარეთ!</span>
          ) : (
            <span>🚀 დაიწყეთ სწავლა და შექმენით სერია!</span>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}