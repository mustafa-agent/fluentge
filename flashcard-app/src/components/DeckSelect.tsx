import { useState, useEffect, useMemo } from 'react';
import { deckIndex, isDeckFree, type DeckMeta } from '../lib/deck-index';
import { loadDeck, type Deck } from '../lib/deck-loader';
import { getAllProgress } from '../lib/storage';
import { getTotalXP, calculateLevel, getCurrentStreak, getDailyGoal, setDailyGoal, getTodayStudyTime } from '../lib/gamification';
import { getDueCount, getTotalDueCards } from '../lib/srs-engine';

interface Props {
  onSelect: (deck: Deck, mode?: 'study' | 'quiz' | 'typing' | 'srs' | 'reverse' | 'mixed' | 'sentence' | 'listening' | 'fillin' | 'reading' | 'daily') => void;
}

const modes = [
  { id: 'study' as const, label: 'EN → KA', icon: '📝', desc: 'ინგლისურიდან ქართულად' },
  { id: 'reverse' as const, label: 'KA → EN', icon: '🔄', desc: 'ქართულიდან ინგლისურად' },
  { id: 'mixed' as const, label: 'შერეული', icon: '🔀', desc: 'ორივე მიმართულებით' },
  { id: 'srs' as const, label: 'გადახედვა', icon: '🃏', desc: 'გადააბრუნე და შეაფასე' },
  { id: 'quiz' as const, label: 'ქვიზი', icon: '⚡', desc: 'აირჩიე სწორი 4-დან' },
  { id: 'typing' as const, label: 'წერა', icon: '✍️', desc: 'ჩაწერე თარგმანი · +25 XP' },
  { id: 'sentence' as const, label: 'წინადადება', icon: '🔤', desc: 'დაალაგე სიტყვები · +15 XP' },
  { id: 'listening' as const, label: 'მოსმენა', icon: '🎧', desc: 'მოისმინე და აირჩიე · +10 XP' },
  { id: 'fillin' as const, label: 'შევსება', icon: '📝', desc: 'შეავსე გამოტოვებული · +10 XP' },
  { id: 'reading' as const, label: 'კითხვა', icon: '📖', desc: 'წაიკითხე და უპასუხე · +15 XP' },
];

export default function DeckSelect({ onSelect }: Props) {
  let progress: Record<string, any> = {};
  try {
    progress = getAllProgress();
  } catch (e) {
    console.error('DeckSelect: getAllProgress failed:', e);
  }
  const [selectedMeta, setSelectedMeta] = useState<DeckMeta | null>(null);
  const [loadedDeck, setLoadedDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(false);

  const isPremiumUser = localStorage.getItem('fluentge-premium') === 'true';
  const freeDecks = isPremiumUser ? deckIndex : deckIndex.filter(d => isDeckFree(d.id));
  const premiumDecks = isPremiumUser ? [] : deckIndex.filter(d => !isDeckFree(d.id));

  // Load deck cards when a deck is selected for mode chooser
  useEffect(() => {
    if (!selectedMeta) { setLoadedDeck(null); return; }
    setLoading(true);
    loadDeck(selectedMeta.id).then(deck => {
      setLoadedDeck(deck);
      setLoading(false);
    });
  }, [selectedMeta]);

  function getDeckProgress(deck: Deck, suffix?: string) {
    return deck.cards.filter(c => {
      const base = `${c.category}_${c.english.toLowerCase().replace(/\s+/g, '_')}`;
      const id = suffix ? `${base}_${suffix}` : base;
      const p = progress[id];
      if (p && p.repetitions >= 1) return true;
      if (suffix) {
        const oldP = progress[base];
        return oldP && oldP.repetitions >= 1;
      }
      return false;
    }).length;
  }

  // Estimate progress from localStorage without card data (for grid view)
  function getEstimatedProgress(deckId: string): number {
    // Count progress keys that match this deck's categories
    const keys = Object.keys(progress);
    let count = 0;
    for (const key of keys) {
      const p = progress[key];
      if (p && p.repetitions >= 1) count++;
    }
    // Simple heuristic: we can't easily map without card data, show 0 for now
    // Full progress shown when deck is selected
    return 0;
  }

  // Mode selection overlay
  if (selectedMeta) {
    if (loading || !loadedDeck) {
      return (
        <div className="px-4 py-6 max-w-lg mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="text-5xl">{String(selectedMeta.icon || '📚')}</div>
            <div className="h-6 bg-[var(--color-bg-card)] rounded w-48 mx-auto"></div>
            <div className="h-4 bg-[var(--color-bg-card)] rounded w-32 mx-auto"></div>
            <div className="grid grid-cols-3 gap-2 mt-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-[var(--color-bg-card)] rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const learnedEnka = getDeckProgress(loadedDeck, 'enka');
    const learnedKaen = getDeckProgress(loadedDeck, 'kaen');
    const learnedMixed = getDeckProgress(loadedDeck, 'mixed');
    const total = loadedDeck.cards.length;
    const pctEnka = total > 0 ? Math.round((learnedEnka / total) * 100) : 0;
    const pctKaen = total > 0 ? Math.round((learnedKaen / total) * 100) : 0;
    const pctMixed = total > 0 ? Math.round((learnedMixed / total) * 100) : 0;

    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button
          onClick={() => setSelectedMeta(null)}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm mb-5 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          უკან
        </button>

        <div className="text-center mb-6">
          <span className="text-5xl block mb-3">{loadedDeck.icon}</span>
          <h2 className="text-xl font-bold">{loadedDeck.nameKa}</h2>
          <p className="text-[var(--color-text-muted)] text-sm">{loadedDeck.name} · {total} ბარათი</p>
          <div className="mt-3 max-w-xs mx-auto space-y-2">
            <div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                <span>EN → KA</span>
                <span>{learnedEnka}/{total} ({pctEnka}%)</span>
              </div>
              <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${pctEnka}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                <span>KA → EN</span>
                <span>{learnedKaen}/{total} ({pctKaen}%)</span>
              </div>
              <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pctKaen}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                <span>🔀 შერეული</span>
                <span>{learnedMixed}/{total} ({pctMixed}%)</span>
              </div>
              <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${pctMixed}%` }} />
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 text-center">აირჩიე რეჟიმი</h3>
        <div className="grid grid-cols-3 gap-2">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => onSelect(loadedDeck, m.id)}
              className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-4 text-center transition-all border-2 border-white/10 border-b-4 border-b-white/15 active:border-b-2 active:mt-[2px] hover:scale-[1.03]"
            >
              <span className="text-2xl block mb-1">{m.icon}</span>
              <span className="text-sm font-medium">{m.label}</span>
              <span className="text-[10px] block text-[var(--color-text-muted)] mt-0.5">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const top2000 = deckIndex.find(d => d.id === 'top-2000')!;
  const freeDecksFiltered = freeDecks.filter(d => d.id !== 'top-2000');

  // Level-based personalization
  const placementLevel = localStorage.getItem('fluentge-placement-level');
  const levelConfig: Record<string, { label: string; labelKa: string; color: string; border: string; bg: string; deckIds: string[] }> = {
    'A1': { label: 'A1', labelKa: 'დამწყები', color: 'text-green-400', border: 'border-green-500/30', bg: 'from-green-500/15 to-emerald-500/10', deckIds: ['greetings', 'numbers-counting', 'colors', 'family-people', 'food-cooking', 'animals-nature'] },
    'A2': { label: 'A2', labelKa: 'ელემენტარული', color: 'text-sky-400', border: 'border-sky-500/30', bg: 'from-sky-500/15 to-blue-500/10', deckIds: ['daily-life', 'shopping-money', 'travel-transport', 'feelings-moods', 'weather-seasons'] },
    'B1': { label: 'B1', labelKa: 'საშუალო', color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'from-indigo-500/15 to-purple-500/10', deckIds: ['business-work', 'technology', 'health-body', 'education', 'culture-art'] },
    'B2': { label: 'B2', labelKa: 'მაღალი', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'from-purple-500/15 to-pink-500/10', deckIds: ['academic', 'idioms-expressions', 'phrasal-verbs', 'science-math'] },
  };
  const levelInfo = placementLevel ? levelConfig[placementLevel] : null;
  const recommendedDecks = levelInfo ? deckIndex.filter(d => levelInfo.deckIds.includes(d.id)) : [];

  // Count due SRS cards across all decks
  const totalDueCards = getTotalDueCards();

  // Per-deck due counts (memoized for grid badges)
  const deckDueCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const meta of deckIndex) {
      const c = getDueCount(meta.id);
      if (c > 0) map[meta.id] = c;
    }
    return map;
  }, []);

  // Words I Know counter
  const totalMastered = Object.values(progress).filter(p => p.repetitions >= 1).length;
  const totalXP = getTotalXP();
  const level = calculateLevel(totalXP);
  const streak = getCurrentStreak();
  const dailyGoal = getDailyGoal();
  const todayMinutes = getTodayStudyTime();
  const dailyPct = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100));

  // Daily goal setting
  const [showGoalModal, setShowGoalModal] = useState(false);
  const goalOptions = [5, 10, 15, 20, 30];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* 📅 Daily Lesson CTA */}
      <button
        onClick={() => {
          // Launch Daily Lesson
          loadDeck('top-2000-words').then(deck => {
            if (deck) onSelect(deck, 'daily');
          });
        }}
        className="daily-lesson-cta w-full mb-5 relative overflow-hidden rounded-2xl text-left transition-all hover:scale-[1.01] active:scale-[0.99] group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 opacity-90" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-8 -translate-x-8" />
        <div className="relative p-5 flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl border-b-4 border-white/10 group-hover:bg-white/25 transition-colors">
            🎯
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">ყოველდღიური</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">~5 წთ</span>
            </div>
            <h2 className="text-lg font-extrabold text-white leading-tight">დღის გაკვეთილი</h2>
            <p className="text-white/70 text-xs mt-0.5">
              {totalDueCards > 0 
                ? `📚 3 ახალი + 🧠 ${Math.min(totalDueCards, 3)} გადახედვა + 🔤 წინადადება + 🎧 მოსმენა`
                : '📚 ახალი სიტყვები + 🔤 წინადადებები + 🎧 მოსმენა'}
            </p>
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-b-4 border-white/10 group-hover:bg-white/30 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      </button>

      {/* 📊 Words I Know Stats Banner */}
      <div className="mb-5 grid grid-cols-4 gap-2">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-3 text-center">
          <div className="text-xl font-extrabold text-green-400">{totalMastered}</div>
          <div className="text-[10px] text-green-400/70 font-medium mt-0.5">ნასწავლი</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-3 text-center">
          <div className="text-xl font-extrabold text-yellow-400">{totalXP}</div>
          <div className="text-[10px] text-yellow-400/70 font-medium mt-0.5">XP ⭐</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-3 text-center">
          <div className="text-xl font-extrabold text-orange-400">{streak}</div>
          <div className="text-[10px] text-orange-400/70 font-medium mt-0.5">დღე 🔥</div>
        </div>
        <button
          onClick={() => setShowGoalModal(true)}
          className="bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30 rounded-xl p-3 text-center hover:scale-[1.03] active:scale-[0.97] transition-transform"
        >
          <div className="text-xl font-extrabold text-sky-400">Lv.{level}</div>
          <div className="text-[10px] text-sky-400/70 font-medium mt-0.5">დონე</div>
        </button>
      </div>

      {/* Daily Goal Progress Bar */}
      <button
        onClick={() => setShowGoalModal(true)}
        className="w-full mb-5 bg-[var(--color-bg-card)] rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors text-left"
      >
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[var(--color-text-muted)]">🎯 დღის მიზანი · {dailyGoal} წთ</span>
          <span className={`font-bold ${dailyPct >= 100 ? 'text-green-400' : 'text-[var(--color-text-muted)]'}`}>
            {dailyPct >= 100 ? '✅ შესრულდა!' : `${Math.round(todayMinutes)}/${dailyGoal} წუთი`}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${dailyPct >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-sky-500 to-blue-500'}`}
            style={{ width: `${dailyPct}%` }}
          />
        </div>
      </button>

      {/* Daily Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowGoalModal(false)}>
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 max-w-sm w-full border border-white/10 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center mb-1">🎯 დღის მიზანი</h3>
            <p className="text-sm text-[var(--color-text-muted)] text-center mb-5">რამდენი წუთი გინდა ისწავლო ყოველ დღე?</p>
            <div className="grid grid-cols-5 gap-2 mb-5">
              {goalOptions.map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    setDailyGoal(mins);
                    setShowGoalModal(false);
                  }}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border-b-4 active:border-b-0 active:mt-1 ${
                    mins === dailyGoal
                      ? 'bg-green-500 border-green-700 text-white'
                      : 'bg-white/10 border-white/5 text-[var(--color-text)] hover:bg-white/20'
                  }`}
                >
                  {mins}
                  <span className="block text-[10px] font-normal opacity-70">წთ</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowGoalModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
            >
              დახურვა
            </button>
          </div>
        </div>
      )}

      {/* 🔔 Review Reminder Banner */}
      {totalDueCards > 0 && (
        <div className="mb-5 relative overflow-hidden rounded-xl border border-amber-500/30"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))' }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-xl -translate-y-4 translate-x-4" />
          <div className="relative p-4 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">
              🧠
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-amber-400">
                {totalDueCards} ბარათი გადასახედია!
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {streak > 0
                  ? `🔥 ${streak}-დღიანი სერია — არ დაკარგო!`
                  : 'გადახედე სიტყვებს რომ არ დაგავიწყდეს'}
              </div>
            </div>
            <div className="flex-shrink-0 bg-amber-500 text-white font-extrabold text-lg w-10 h-10 rounded-full flex items-center justify-center border-b-2 border-amber-700">
              {totalDueCards > 99 ? '99+' : totalDueCards}
            </div>
          </div>
        </div>
      )}

      {/* 🎯 Recommended for Your Level */}
      {levelInfo && recommendedDecks.length > 0 && (
        <div className={`mb-5 rounded-2xl border ${levelInfo.border} overflow-hidden`}>
          <div className={`bg-gradient-to-r ${levelInfo.bg} p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${levelInfo.color} bg-white/10 px-2.5 py-1 rounded-full border-b-2 border-white/5`}>
                  {levelInfo.label}
                </span>
                <span className="text-sm font-bold">შენი დონისთვის რეკომენდებული</span>
              </div>
              <a href="/placement/" className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline">შეცვალე</a>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {recommendedDecks.slice(0, 6).map(meta => (
                <button
                  key={meta.id}
                  onClick={() => setSelectedMeta(meta)}
                  className="relative overflow-hidden rounded-xl text-center transition-all hover:scale-[1.03] active:scale-[0.97] group bg-black/20 backdrop-blur-sm"
                >
                  <img src={meta.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {deckDueCounts[meta.id] && (
                    <div className="absolute top-1.5 right-1.5 z-10 bg-amber-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg">
                      {deckDueCounts[meta.id]}
                    </div>
                  )}
                  <div className="relative p-2.5">
                    <span className="text-xl block mb-0.5">{meta.icon}</span>
                    <p className="text-[10px] font-semibold text-white leading-tight line-clamp-2">{meta.nameKa}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ⭐ Top 2000 Hero Card */}
      {top2000 && (
        <button
          onClick={() => setSelectedMeta(top2000)}
          className="w-full mb-6 relative overflow-hidden rounded-2xl text-left transition-all hover:scale-[1.01] active:scale-[0.99] group"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)' }}
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=60')] bg-cover bg-center opacity-15 group-hover:opacity-20 transition-opacity" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-300/15 rounded-full blur-xl translate-y-6 -translate-x-6" />
          <div className="relative p-5 flex items-center gap-4">
            <div className="text-5xl flex-shrink-0 drop-shadow-lg">⭐</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">უფასო</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">🔥 #1 პოპულარული</span>
              </div>
              <h2 className="text-lg font-extrabold text-white leading-tight">ტოპ 2000 სიტყვა</h2>
              <p className="text-white/80 text-xs mt-0.5">ყველაზე მნიშვნელოვანი ინგლისური სიტყვები · 2000 ბარათი</p>
              <p className="text-white/60 text-[10px] mt-1">📊 ფარავს ინგლისური საუბრის ~80%-ს</p>
              {deckDueCounts['top-2000'] && (
                <p className="text-yellow-200 text-[10px] mt-1 font-semibold">🧠 {deckDueCounts['top-2000']} ბარათი გადასახედია</p>
              )}
            </div>
            <div className="flex-shrink-0 bg-white/20 rounded-xl p-2.5 border-b-4 border-white/10 group-hover:bg-white/30 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </button>
      )}

      {/* Free decks */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">უფასო</span>
        <div className="h-px flex-1 bg-white/10"></div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {freeDecksFiltered.map(meta => (
          <button
            key={meta.id}
            onClick={() => setSelectedMeta(meta)}
            className="relative overflow-hidden rounded-xl text-center transition-all hover:scale-[1.02] group"
          >
            <img src={meta.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
            {deckDueCounts[meta.id] && (
              <div className="absolute top-1.5 right-1.5 z-10 bg-amber-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg">
                {deckDueCounts[meta.id]}
              </div>
            )}
            <div className="relative p-3 overflow-hidden">
              <span className="text-2xl block mb-1">{meta.icon}</span>
              <p className="text-[11px] font-semibold leading-tight mb-1 text-white line-clamp-2 break-words">{meta.nameKa}</p>
              <p className="text-[10px] text-white/60">{meta.cardCount} ბარათი</p>
            </div>
          </button>
        ))}
      </div>

      {/* Premium decks */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">🔒 პრემიუმი</span>
        <div className="h-px flex-1 bg-white/10"></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {premiumDecks.map(meta => (
          <a
            key={meta.id}
            href="/premium/"
            className="relative overflow-hidden rounded-xl text-center opacity-60 hover:opacity-80 transition-opacity"
          >
            <img src={meta.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
            <div className="relative p-3 overflow-hidden">
              <span className="text-2xl block mb-1">{meta.icon}</span>
              <p className="text-[11px] font-semibold leading-tight mb-1 text-white line-clamp-2 break-words">{meta.nameKa}</p>
              <p className="text-[10px] text-white/60">{meta.cardCount} ბარათი</p>
              <div className="mt-2">
                <span className="text-amber-400 text-[10px]">🔒</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
