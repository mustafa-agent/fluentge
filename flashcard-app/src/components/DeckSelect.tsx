import { useState, useEffect, useMemo } from 'react';
import { deckIndex, isDeckFree, type DeckMeta } from '../lib/deck-index';
import { loadDeck, type Deck } from '../lib/deck-loader';
import { getAllProgress } from '../lib/storage';
import { getTotalXP, calculateLevel, getCurrentStreak, getDailyCardGoal, setDailyCardGoal, getTodayCardsReviewed } from '../lib/gamification';
import { getDueCount, getTotalDueCards } from '../lib/srs-engine';

interface Props {
  onSelect: (deck: Deck, mode?: 'study' | 'quiz' | 'typing' | 'srs' | 'reverse' | 'mixed' | 'sentence' | 'listening' | 'fillin' | 'reading' | 'speaking' | 'writing' | 'daily') => void;
}

const modes = [
  { id: 'study' as const, label: 'EN → GE', icon: '📝', desc: 'ინგლისურიდან ქართულად' },
  { id: 'reverse' as const, label: 'GE → EN', icon: '🔄', desc: 'ქართულიდან ინგლისურად' },
  { id: 'mixed' as const, label: 'შერეული', icon: '🔀', desc: 'ორივე მიმართულებით' },
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
    const keys = Object.keys(progress);
    let count = 0;
    for (const key of keys) {
      const p = progress[key];
      if (p && p.repetitions >= 1) count++;
    }
    return 0;
  }

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

  // Per-deck due counts (memoized for grid badges) — MUST be before any early return
  const deckDueCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const meta of deckIndex) {
      const c = getDueCount(meta.id);
      if (c > 0) map[meta.id] = c;
    }
    return map;
  }, []);

  // Words I Know counter — unified across all storage systems
  const totalMastered = useMemo(() => {
    const allWords = new Set<string>();
    // SRS stores — only count words with at least 1 successful repetition
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('fluentge-srs-')) {
        try {
          const store = JSON.parse(localStorage.getItem(key) || '{}');
          Object.keys(store).forEach(w => {
            if (store[w] && store[w].repetitions >= 1) allWords.add(w);
          });
        } catch {}
      }
    }
    // Known cards — explicitly marked as known
    try {
      const known = JSON.parse(localStorage.getItem('knownCards') || '[]');
      known.forEach((w: string) => allWords.add(w));
    } catch {}
    return allWords.size;
  }, [progress]);
  const totalXP = getTotalXP();
  const level = calculateLevel(totalXP);
  const streak = getCurrentStreak();
  const dailyGoal = getDailyCardGoal();
  const todayCards = getTodayCardsReviewed();
  const dailyPct = Math.min(100, Math.round((todayCards / dailyGoal) * 100));

  // Daily goal setting — MUST be before any early return
  const [showGoalModal, setShowGoalModal] = useState(false);
  const goalOptions = [20, 50, 100, 150, 200];

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

        <div className="text-center mb-8">
          <div className="fc-deck-detail-header inline-block rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 px-8 py-5 mb-1">
            <span className="text-6xl block mb-2 drop-shadow-lg">{String(loadedDeck.icon || '📚')}</span>
            <h2 className="text-2xl font-extrabold tracking-tight">{String(loadedDeck.nameKa || '')}</h2>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">{String(loadedDeck.name || '')} · {total} ბარათი</p>
          </div>
          <div className="mt-4 max-w-xs mx-auto space-y-3">
            <div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1.5 font-medium">
                <span>EN → GE</span>
                <span>{learnedEnka}/{total} ({pctEnka}%)</span>
              </div>
              <div className="h-3 bg-[var(--color-bg)] rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: `${pctEnka}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1.5 font-medium">
                <span>GE → EN</span>
                <span>{learnedKaen}/{total} ({pctKaen}%)</span>
              </div>
              <div className="h-3 bg-[var(--color-bg)] rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all" style={{ width: `${pctKaen}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1.5 font-medium">
                <span>🔀 შერეული</span>
                <span>{learnedMixed}/{total} ({pctMixed}%)</span>
              </div>
              <div className="h-3 bg-[var(--color-bg)] rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all" style={{ width: `${pctMixed}%` }} />
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-extrabold text-center mb-4 tracking-tight">აირჩიე რეჟიმი</h3>
        <div className="grid grid-cols-3 gap-3">
          {modes.map(m => {
            const gradients: Record<string, string> = {
              study: 'bg-gradient-to-br from-blue-500 to-indigo-600',
              reverse: 'bg-gradient-to-br from-emerald-500 to-teal-600',
              mixed: 'bg-gradient-to-br from-purple-500 to-violet-600',
            };
            const shadows: Record<string, string> = {
              study: 'shadow-[0_6px_0_0_#3730a3,0_8px_20px_rgba(99,102,241,0.4)]',
              reverse: 'shadow-[0_6px_0_0_#115e59,0_8px_20px_rgba(20,184,166,0.4)]',
              mixed: 'shadow-[0_6px_0_0_#5b21b6,0_8px_20px_rgba(139,92,246,0.4)]',
            };
            const activeShadows: Record<string, string> = {
              study: 'active:shadow-[0_2px_0_0_#3730a3,0_2px_8px_rgba(99,102,241,0.3)]',
              reverse: 'active:shadow-[0_2px_0_0_#115e59,0_2px_8px_rgba(20,184,166,0.3)]',
              mixed: 'active:shadow-[0_2px_0_0_#5b21b6,0_2px_8px_rgba(139,92,246,0.3)]',
            };
            return (
              <button
                key={m.id}
                onClick={() => onSelect(loadedDeck, m.id)}
                className={`${gradients[m.id]} ${shadows[m.id]} ${activeShadows[m.id]} rounded-2xl p-5 text-center transition-all hover:scale-[1.05] hover:brightness-110 active:translate-y-[4px] active:scale-100 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-2xl" />
                <span className="text-4xl block mb-2 drop-shadow-md relative z-10">{m.icon}</span>
                <span className="text-base font-bold text-white block relative z-10">{m.label}</span>
                <span className="text-[10px] block text-white/70 mt-1 relative z-10">{m.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const top2000 = deckIndex.find(d => d.id === 'top-2000')!;
  const freeDecksFiltered = freeDecks.filter(d => d.id !== 'top-2000');

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Daily lesson CTA removed — not working well */}

      {/* 📊 Words I Know Stats Banner */}
      <div className="fc-stat-banner mb-5 grid grid-cols-4 gap-2">
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
        <div className="bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30 rounded-xl p-3 text-center">
          <div className="text-xl font-extrabold text-sky-400">Lv.{level}</div>
          <div className="text-[10px] text-sky-400/70 font-medium mt-0.5">დონე</div>
        </div>
      </div>

      {/* Daily Goal removed */}

      {/* Review Reminder Banner — removed by request */}

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
              {/* due count removed */}
            </div>
            <div className="flex-shrink-0 bg-white/20 rounded-xl p-2.5 border-b-4 border-white/10 group-hover:bg-white/30 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </button>
      )}

      {/* IELTS/TOEFL Prep Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-full">📋 IELTS / TOEFL</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-3 mb-3">
          <p className="fc-ielts-desc text-[12px] text-white/70 leading-relaxed">
            <span className="text-indigo-400 font-bold">🎯 გამოცდისთვის მომზადება</span> — IELTS და TOEFL-ისთვის საჭირო ლექსიკა და ფრაზები
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {deckIndex.filter(d => ['ielts-reading', 'ielts-writing', 'toefl-speaking', 'academic-english'].includes(d.id)).map(meta => (
            <button
              key={meta.id}
              onClick={() => setSelectedMeta(meta)}
              className="relative overflow-hidden rounded-xl text-center transition-all hover:scale-[1.02] group"
            >
              <img src={meta.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-indigo-900/30"></div>
              {deckDueCounts[meta.id] && (
                <div className="absolute top-1.5 right-1.5 z-10 bg-amber-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg">
                  {deckDueCounts[meta.id]}
                </div>
              )}
              <div className="relative p-3 overflow-hidden">
                <span className="text-2xl block mb-1">{meta.icon}</span>
                <p className="text-[11px] font-semibold leading-tight mb-1 text-white line-clamp-2 break-words">{meta.nameKa}</p>
                <p className="text-[10px] text-indigo-300/80">{meta.cardCount} ბარათი</p>
              </div>
            </button>
          ))}
        </div>
      </div>

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
