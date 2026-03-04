import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserStats, getCurrentStreak, getTotalXP, calculateLevel, getXPProgress, getTodayStudyTime, getDailyHistory, type DailyActivity } from '../lib/gamification';
import { isDeckFree, deckIndex } from '../lib/deck-index';
import { useAllDecks } from '../lib/useDecks';
import { getCardProgress, getCardsInState } from '../lib/spaced-repetition';
import { getLocalStorageValue } from '../lib/storage';

interface DashboardProps {
  onNavigate: (screen: any, deck?: any) => void;
  onBack: () => void;
}

type ActivityData = DailyActivity;

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  streak: number;
  isCurrentUser: boolean;
}

export default function Dashboard({ onNavigate, onBack }: DashboardProps) {
  const { decks, loading: decksLoading } = useAllDecks();
  const { currentUser, userProfile } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    totalXP: 0,
    currentStreak: 0,
    lastPracticeDate: '',
    dailyGoalMinutes: 10,
    todayStudyTime: 0,
    level: 1
  });
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeDecks, setActiveDecks] = useState<any[]>([]);

  useEffect(() => {
    loadUserStats();
    loadActivityData();
    loadLeaderboard();
    loadActiveDecks();
  }, []);

  const loadUserStats = () => {
    const totalXP = getTotalXP();
    const currentStreak = getCurrentStreak();
    const todayStudyTime = getTodayStudyTime();
    const dailyGoalMinutes = parseInt(getLocalStorageValue('dailyGoalMinutes', '10'), 10);
    
    setUserStats({
      totalXP,
      currentStreak,
      lastPracticeDate: getLocalStorageValue('lastPracticeDate', ''),
      dailyGoalMinutes,
      todayStudyTime,
      level: calculateLevel(totalXP)
    });
  };

  const loadActivityData = () => {
    setActivityData(getDailyHistory(7));
  };

  const loadLeaderboard = () => {
    // Generate fake Georgian users for now
    const georgianNames = [
      'ნიკა მამალაძე', 'ანა ჩხეიძე', 'გიორგი კვარაცხელია', 'მარიამ შენგელია',
      'დავითი ლობჟანიძე', 'ნინო ღოღობერიძე', 'ლევანი რუხაძე', 'სოფო მაჭარაშვილი',
      'ზურა ცხოვრებაძე', 'თინა გოგიჩაიშვილი'
    ];
    
    const fakeUsers: LeaderboardEntry[] = georgianNames.map((name, index) => ({
      rank: index + 1,
      username: name,
      level: Math.max(1, Math.floor(Math.random() * 10)),
      xp: Math.floor(Math.random() * 2000) + 500,
      streak: Math.floor(Math.random() * 30),
      isCurrentUser: false
    }));
    
    // Add current user
    const currentUserEntry: LeaderboardEntry = {
      rank: 5,
      username: userProfile?.displayName || currentUser?.displayName || 'ანონიმური',
      level: userStats.level,
      xp: userStats.totalXP,
      streak: userStats.currentStreak,
      isCurrentUser: true
    };
    
    // Sort by XP and assign ranks
    const allUsers = [...fakeUsers, currentUserEntry].sort((a, b) => b.xp - a.xp);
    allUsers.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    setLeaderboard(allUsers.slice(0, 10));
  };

  const loadActiveDecks = () => {
    const userDecks = decks.filter(deck => {
      // Show free decks and any deck the user has progress in
      if (isDeckFree(deck.id)) return true;
      
      // Check if user has any progress in this deck
      const hasProgress = deck.cards.some(card => {
        const progress = getCardProgress(card.english, deck.id);
        return progress !== null;
      });
      
      return hasProgress;
    });
    
    // Add progress data to decks
    const decksWithProgress = userDecks.map(deck => {
      const newCards = deck.cards.filter(card => {
        const progress = getCardProgress(card.english, deck.id);
        return !progress || progress.state === 'new';
      }).length;
      
      const learningCards = getCardsInState(deck.id, 'learning').length;
      const reviewCards = getCardsInState(deck.id, 'review').length;
      const masteredCards = getCardsInState(deck.id, 'mastered').length;
      
      return {
        ...deck,
        progress: {
          new: newCards,
          learning: learningCards,
          review: reviewCards,
          mastered: masteredCards
        }
      };
    });
    
    setActiveDecks(decksWithProgress);
  };

  const getTotalCardsDue = () => {
    return activeDecks.reduce((total, deck) => {
      return total + deck.progress.learning + deck.progress.review;
    }, 0);
  };

  const getTotalWordsLearned = () => {
    return activeDecks.reduce((total, deck) => {
      return total + deck.progress.mastered;
    }, 0);
  };

  const dailyGoalProgress = Math.min(100, (userStats.todayStudyTime / userStats.dailyGoalMinutes) * 100);
  const xpProgress = getXPProgress(userStats.totalXP);

  // Achievements system
  const achievements = [
    { id: 'first-card', icon: '🎯', title: 'პირველი ნაბიჯი', desc: 'ისწავლე პირველი სიტყვა', gradient: 'from-sky-500 to-blue-600', check: () => getTotalWordsLearned() >= 1 },
    { id: 'ten-words', icon: '📚', title: '10 სიტყვა', desc: 'ისწავლე 10 სიტყვა', gradient: 'from-green-500 to-emerald-600', check: () => getTotalWordsLearned() >= 10 },
    { id: 'fifty-words', icon: '🧠', title: '50 სიტყვა', desc: 'ისწავლე 50 სიტყვა', gradient: 'from-purple-500 to-violet-600', check: () => getTotalWordsLearned() >= 50 },
    { id: 'hundred-words', icon: '💯', title: '100 სიტყვა', desc: 'ისწავლე 100 სიტყვა', gradient: 'from-amber-500 to-orange-600', check: () => getTotalWordsLearned() >= 100 },
    { id: 'streak-3', icon: '🔥', title: '3 დღე ზედიზედ', desc: 'იმეცადინე 3 დღე ზედიზედ', gradient: 'from-orange-500 to-red-600', check: () => userStats.currentStreak >= 3 },
    { id: 'streak-7', icon: '⚡', title: 'კვირის ჩემპიონი', desc: '7 დღიანი რიგითობა', gradient: 'from-red-500 to-pink-600', check: () => userStats.currentStreak >= 7 },
    { id: 'xp-100', icon: '⭐', title: 'XP შემგროვებელი', desc: 'დააგროვე 100 XP', gradient: 'from-yellow-500 to-amber-600', check: () => userStats.totalXP >= 100 },
    { id: 'xp-500', icon: '🌟', title: 'XP ვარსკვლავი', desc: 'დააგროვე 500 XP', gradient: 'from-cyan-500 to-teal-600', check: () => userStats.totalXP >= 500 },
    { id: 'grammar-1', icon: '✏️', title: 'გრამატიკოსი', desc: 'დაასრულე 1 გრამატიკის გაკვეთილი', gradient: 'from-indigo-500 to-blue-600', check: () => { try { return JSON.parse(localStorage.getItem('fluentge-learned-grammar') || '[]').length >= 1; } catch { return false; } } },
    { id: 'level-5', icon: '🏆', title: 'დონე 5', desc: 'მიაღწიე მე-5 დონეს', gradient: 'from-pink-500 to-rose-600', check: () => userStats.level >= 5 },
  ];

  const earnedCount = achievements.filter(a => a.check()).length;

  // Game stats from localStorage
  const getGameStats = () => {
    const gamesPlayed = parseInt(getLocalStorageValue('gamesPlayed', '0'), 10);
    const todayStr = new Date().toDateString();
    let todayGamesCount = 0;
    let todayGameXP = 0;
    try {
      const tg = JSON.parse(getLocalStorageValue('todayGames', '{}'));
      if (tg.date === todayStr) {
        todayGamesCount = tg.count || 0;
        todayGameXP = tg.xp || 0;
      }
    } catch {}
    const gameLevel = calculateLevel(userStats.totalXP);
    return { gamesPlayed, todayGamesCount, todayGameXP, gameLevel };
  };
  const gameStats = getGameStats();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-20">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">📊 დაშბორდი</h1>
          <button
            onClick={onBack}
            className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            ← უკან
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Today's Summary */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            📅 დღეს რა გვაქვს
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--color-primary)]">
                {getTotalCardsDue()}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">
                კარტები დღეს
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                {userStats.currentStreak} 🔥
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">
                რიგითობა
              </div>
            </div>
          </div>
          
          {/* Daily Goal Progress */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>დღეს მიზანი ({userStats.dailyGoalMinutes} წუთი)</span>
              <span>{Math.floor(dailyGoalProgress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, dailyGoalProgress)}%` }}
              />
            </div>
          </div>
        </div>

        {/* My Stats */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            ⭐ ჩემი სტატისტიკა
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {getTotalWordsLearned()}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">
                სიტყვები ნასწავლი
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--color-primary)]">
                {userStats.totalXP}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">
                XP ქულები
              </div>
            </div>
          </div>
          
          {/* Level Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>დონე {userStats.level}</span>
              <span>შემდეგი დონისთვის: {xpProgress.needed - xpProgress.current}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
                style={{ width: `${xpProgress.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            🎮 თამაშების სტატისტიკა
          </h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-indigo-400">
                {gameStats.todayGamesCount}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                დღეს ნათამაშები
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {gameStats.gamesPlayed}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                სულ ნათამაშები
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                +{gameStats.todayGameXP}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                დღეს XP თამაშებიდან
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                Lv.{gameStats.gameLevel}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                მიმდინარე დონე
              </div>
            </div>
          </div>

          {/* Play Games CTA */}
          <a
            href="/games/"
            className="block w-full text-center py-3 bg-indigo-600 hover:bg-indigo-700 border-b-4 border-indigo-700 active:border-b-0 rounded-xl font-bold text-white transition-all text-sm"
          >
            🎮 თამაშების გვერდზე გადასვლა
          </a>
        </div>

        {/* Achievements */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            🏅 მიღწევები
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            {earnedCount}/{achievements.length} მოპოვებული
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map(badge => {
              const earned = badge.check();
              return (
                <div
                  key={badge.id}
                  className={`badge-card ${earned ? 'earned' : 'locked'} rounded-xl p-3 text-center transition-all`}
                >
                  <div className={`badge-icon w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl ${
                    earned ? `bg-gradient-to-br ${badge.gradient} shadow-lg` : ''
                  }`}>
                    {earned ? badge.icon : '🔒'}
                  </div>
                  <div className={`text-sm font-semibold ${earned ? '' : 'text-[var(--color-text-muted)]'}`}>
                    {badge.title}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {badge.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Decks */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            📚 ჩემი თემები
          </h2>
          
          <div className="space-y-3">
            {activeDecks.map(deck => (
              <div
                key={deck.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => onNavigate('enhanced-study', deck)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{deck.icon}</span>
                  <div>
                    <div className="font-medium">{deck.nameKa}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      ახალი: {deck.progress.new} | 
                      სწავლა: {deck.progress.learning} | 
                      განმეორება: {deck.progress.review} | 
                      ნასწავლი: {deck.progress.mastered}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--color-primary)]">
                    {deck.progress.learning + deck.progress.review}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    დღეს
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            ⚡ სწრაფი მოქმედებები
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('review')}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-center transition-colors"
            >
              <div className="text-lg mb-1">📖</div>
              <div className="text-sm font-medium">განმეორება დაწყება</div>
              <div className="text-xs opacity-75">({getTotalCardsDue()} კარტი)</div>
            </button>
            
            <button
              onClick={() => onNavigate('home')}
              className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-center transition-colors"
            >
              <div className="text-lg mb-1">➕</div>
              <div className="text-sm font-medium">ახალი სიტყვები</div>
              <div className="text-xs opacity-75">სწავლა დაწყება</div>
            </button>
            
            <button
              onClick={() => onNavigate('spelling')}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-center transition-colors"
            >
              <div className="text-lg mb-1">⌨️</div>
              <div className="text-sm font-medium">წერა პრაქტიკა</div>
              <div className="text-xs opacity-75">ტაიპინგი</div>
            </button>
            
            <button
              onClick={() => onNavigate('quiz')}
              className="p-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-center transition-colors"
            >
              <div className="text-lg mb-1">🎯</div>
              <div className="text-sm font-medium">კვიზი</div>
              <div className="text-xs opacity-75">შემოწმება</div>
            </button>
          </div>
        </div>

        {/* Learning Path Roadmap */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            🗺️ სასწავლო გზა
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            ნაბიჯ-ნაბიჯ ისწავლე ინგლისური — დამწყებიდან საშუალომდე
          </p>
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-white/10" />
            
            {[
              { step: 1, icon: '👋', title: 'მისალმებები', desc: 'ძირითადი მისალმებები და გაცნობა', link: 'greetings', type: 'flashcard' as const, grammar: null },
              { step: 2, icon: '✏️', title: 'To Be ზმნა', desc: 'am, is, are — ყველაზე მნიშვნელოვანი ზმნა', link: '/grammar/to-be/', type: 'grammar' as const, grammar: 'to-be' },
              { step: 3, icon: '🔢', title: 'რიცხვები', desc: '1-100 და მეტი', link: 'numbers', type: 'flashcard' as const, grammar: null },
              { step: 4, icon: '📖', title: 'Articles', desc: 'a, an, the — როდის ვიყენებთ', link: '/grammar/articles/', type: 'grammar' as const, grammar: 'articles' },
              { step: 5, icon: '👨‍👩‍👧', title: 'ოჯახი', desc: 'ოჯახის წევრები', link: 'family', type: 'flashcard' as const, grammar: null },
              { step: 6, icon: '🍎', title: 'საჭმელი', desc: 'საკვები და სასმელი', link: 'food-drinks', type: 'flashcard' as const, grammar: null },
              { step: 7, icon: '📝', title: 'Plural Nouns', desc: 'მრავლობითი რიცხვი', link: '/grammar/plural-nouns/', type: 'grammar' as const, grammar: 'plural-nouns' },
              { step: 8, icon: '🏠', title: 'ყოველდღიურობა', desc: 'ყოველდღიური რუტინა', link: 'daily-routines', type: 'flashcard' as const, grammar: null },
              { step: 9, icon: '🎮', title: 'თამაშები', desc: 'გაიმეორე ნასწავლი თამაშებით!', link: '/games/', type: 'external' as const, grammar: null },
              { step: 10, icon: '🏆', title: 'კვიზი', desc: 'შეამოწმე რა ისწავლე!', link: 'quiz-all', type: 'quiz' as const, grammar: null },
            ].map((item) => {
              // Check completion
              const isCompleted = item.type === 'flashcard' 
                ? activeDecks.find(d => d.id === item.link)?.progress?.mastered > 0
                : item.type === 'grammar' && item.grammar
                ? (() => { try { const g = JSON.parse(localStorage.getItem('fluentge-learned-grammar') || '[]'); return g.includes(item.grammar); } catch { return false; } })()
                : false;

              return (
                <div key={item.step} className="relative flex items-start gap-4 mb-4 last:mb-0">
                  {/* Step circle */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[var(--color-bg)] border-2 border-white/20'
                  }`}>
                    {isCompleted ? '✅' : item.icon}
                  </div>
                  
                  {/* Content */}
                  <div 
                    className={`flex-1 p-3 rounded-lg cursor-pointer transition-all ${
                      isCompleted 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                    onClick={() => {
                      if (item.type === 'flashcard') {
                        const deck = decks.find(d => d.id === item.link);
                        if (deck) onNavigate('enhanced-study', deck);
                      } else if (item.type === 'grammar' || item.type === 'external') {
                        window.location.href = item.link;
                      } else if (item.type === 'quiz') {
                        onNavigate('quiz');
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">
                          <span className="text-[var(--color-text-muted)] mr-1">#{item.step}</span>
                          {item.title}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.desc}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.type === 'grammar' ? 'bg-sky-500/20 text-sky-400' :
                        item.type === 'flashcard' ? 'bg-green-500/20 text-green-400' :
                        item.type === 'quiz' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {item.type === 'grammar' ? 'გრამატიკა' : 
                         item.type === 'flashcard' ? 'სიტყვები' :
                         item.type === 'quiz' ? 'კვიზი' : 'თამაშები'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Day Activity Chart */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
            📈 ბოლო 7 დღის აქტივობა
          </h2>

          {/* Summary row */}
          <div className="flex items-center gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> XP
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> წუთი
            </span>
            <span className="ml-auto text-[var(--color-text-muted)]">
              ჯამი: {activityData.reduce((s, d) => s + d.xp, 0)} XP · {activityData.reduce((s, d) => s + d.cards, 0)} ბარათი
            </span>
          </div>

          {/* Bar chart */}
          <div className="flex items-end justify-between gap-2" style={{ height: '120px' }}>
            {activityData.map((day, index) => {
              const maxXP = Math.max(...activityData.map(d => d.xp), 1);
              const maxMin = Math.max(...activityData.map(d => d.minutes), 1);
              const xpH = (day.xp / maxXP) * 100;
              const minH = (day.minutes / maxMin) * 100;
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('ka-GE', { weekday: 'short' });
              const isToday = date.toDateString() === new Date().toDateString();
              const hasActivity = day.xp > 0 || day.minutes > 0;

              return (
                <div key={index} className="flex flex-col items-center flex-1 h-full justify-end">
                  {/* XP value on top */}
                  {day.xp > 0 && (
                    <div className="text-[10px] font-bold text-green-400 mb-1">{day.xp}</div>
                  )}
                  {/* Stacked bars */}
                  <div className="w-full flex gap-0.5 items-end" style={{ height: '80%' }}>
                    <div
                      className="flex-1 rounded-t-md transition-all duration-500"
                      style={{
                        height: `${Math.max(hasActivity ? xpH : 0, hasActivity ? 8 : 3)}%`,
                        minHeight: '3px',
                        background: hasActivity ? 'linear-gradient(to top, #22c55e, #4ade80)' : 'rgba(255,255,255,0.05)',
                      }}
                      title={`${day.xp} XP`}
                    />
                    <div
                      className="flex-1 rounded-t-md transition-all duration-500"
                      style={{
                        height: `${Math.max(hasActivity ? minH : 0, hasActivity ? 8 : 3)}%`,
                        minHeight: '3px',
                        background: hasActivity ? 'linear-gradient(to top, #0ea5e9, #38bdf8)' : 'rgba(255,255,255,0.05)',
                      }}
                      title={`${day.minutes} წუთი`}
                    />
                  </div>
                  {/* Day label */}
                  <div className={`text-[11px] mt-1.5 font-medium ${
                    isToday ? 'text-green-400' : 'text-[var(--color-text-muted)]'
                  }`}>
                    {isToday ? 'დღეს' : dayName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard — Redesigned with medals & avatars */}
        <div className="leaderboard-section bg-[var(--color-card)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold flex items-center gap-2">
              🏆 კვირის ლიდერბორდი
            </h2>
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] bg-white/5 px-2 py-0.5 rounded-full">
              განახლდება ორშაბათს
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">ვინ ისწავლა ყველაზე მეტი ამ კვირაში?</p>
          
          <div className="space-y-1.5">
            {leaderboard.map(entry => {
              const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
              const initials = entry.username.split(' ').map(n => n[0]).join('').slice(0, 2);
              const avatarColors = [
                'from-yellow-400 to-amber-500',   // 1st
                'from-gray-300 to-gray-400',       // 2nd
                'from-orange-400 to-orange-600',   // 3rd
                'from-sky-400 to-blue-500',
                'from-green-400 to-emerald-500',
                'from-purple-400 to-violet-500',
                'from-pink-400 to-rose-500',
                'from-cyan-400 to-teal-500',
                'from-indigo-400 to-blue-600',
                'from-red-400 to-rose-600',
                'from-lime-400 to-green-500',
              ];
              const avatarGradient = avatarColors[entry.rank - 1] || avatarColors[3];

              return (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    entry.isCurrentUser 
                      ? 'leaderboard-current bg-gradient-to-r from-green-500/12 to-emerald-500/8 border border-green-500/30' 
                      : entry.rank <= 3
                        ? 'bg-white/[0.03]'
                        : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="w-7 text-center flex-shrink-0">
                    {medal ? (
                      <span className="text-lg">{medal}</span>
                    ) : (
                      <span className="text-sm font-bold text-[var(--color-text-muted)]">{entry.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm`}>
                    {initials}
                  </div>

                  {/* Name + Level */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {entry.username}
                      {entry.isCurrentUser && (
                        <span className="text-[10px] text-green-400 ml-1.5 font-bold">(შენ)</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-2">
                      <span>Lv.{entry.level}</span>
                      {entry.streak > 0 && <span className="text-orange-400">🔥 {entry.streak}</span>}
                    </div>
                  </div>

                  {/* XP */}
                  <div className={`text-right flex-shrink-0 font-bold text-sm tabular-nums ${
                    entry.rank === 1 ? 'text-yellow-400' :
                    entry.rank === 2 ? 'text-gray-300' :
                    entry.rank === 3 ? 'text-orange-400' :
                    entry.isCurrentUser ? 'text-green-400' :
                    'text-[var(--color-text)]'
                  }`}>
                    {entry.xp.toLocaleString()} <span className="text-xs font-normal opacity-60">XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}