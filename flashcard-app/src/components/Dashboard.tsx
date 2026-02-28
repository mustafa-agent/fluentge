import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserStats, getCurrentStreak, getTotalXP, calculateLevel, getXPProgress, getTodayStudyTime } from '../lib/gamification';
import { decks, isDeckFree } from '../lib/cards';
import { getCardProgress, getCardsInState } from '../lib/spaced-repetition';
import { getLocalStorageValue } from '../lib/storage';

interface DashboardProps {
  onNavigate: (screen: any, deck?: any) => void;
  onBack: () => void;
}

interface ActivityData {
  date: string;
  reviews: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  streak: number;
  isCurrentUser: boolean;
}

export default function Dashboard({ onNavigate, onBack }: DashboardProps) {
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
    const data: ActivityData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      // Get reviews from localStorage for this date
      const reviews = parseInt(getLocalStorageValue(`reviews_${dateStr}`, '0'), 10);
      
      data.push({
        date: dateStr,
        reviews
      });
    }
    
    setActivityData(data);
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

        {/* Activity Chart */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            📈 ბოლო 7 დღის აქტივობა
          </h2>
          
          <div className="flex items-end justify-between h-20 gap-1">
            {activityData.map((day, index) => {
              const maxReviews = Math.max(...activityData.map(d => d.reviews), 1);
              const height = (day.reviews / maxReviews) * 100;
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('ka-GE', { weekday: 'short' });
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-[var(--color-primary)] rounded-t transition-all"
                    style={{ height: `${Math.max(height, 5)}%`, minHeight: '4px' }}
                    title={`${day.reviews} განმეორება`}
                  />
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">
                    {dayName}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-2">
            <div className="text-xs text-[var(--color-text-muted)]">
              ჯამური განმეორებები: {activityData.reduce((sum, day) => sum + day.reviews, 0)}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-[var(--color-card)] rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              🏆 ლიდერბორდი
            </span>
            {!currentUser && (
              <span className="text-xs text-yellow-500">
                მალე ექაუნთებთან ერთად!
              </span>
            )}
          </h2>
          
          <div className="space-y-2">
            {leaderboard.map(entry => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  entry.isCurrentUser 
                    ? 'bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/50' 
                    : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-bold w-6 text-center ${
                    entry.rank === 1 ? 'text-yellow-500' :
                    entry.rank === 2 ? 'text-gray-400' :
                    entry.rank === 3 ? 'text-orange-600' :
                    'text-[var(--color-text-muted)]'
                  }`}>
                    #{entry.rank}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {entry.username}
                      {entry.isCurrentUser && (
                        <span className="text-xs text-[var(--color-primary)] ml-1">(თქვენ)</span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      დონე {entry.level}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-bold">{entry.xp} XP</div>
                  <div className="text-xs text-orange-500 flex items-center gap-1">
                    {entry.streak} 🔥
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}