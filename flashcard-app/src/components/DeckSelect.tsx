import { useState } from 'react';
import { decks, Deck, isDeckFree } from '../lib/cards';
import { getAllProgress } from '../lib/storage';

interface Props {
  onSelect: (deck: Deck, mode?: 'study' | 'quiz' | 'srs' | 'reverse' | 'mixed') => void;
}

const modes = [
  { id: 'study' as const, label: 'EN → KA', icon: '📝', desc: 'ინგლისურიდან ქართულზე' },
  { id: 'reverse' as const, label: 'KA → EN', icon: '🔄', desc: 'ქართულიდან ინგლისურზე' },
  { id: 'mixed' as const, label: 'შერეული', icon: '🔀', desc: 'ორივე მიმართულება' },
  { id: 'srs' as const, label: 'თავისუფალი', icon: '🃏', desc: 'გადააბრუნე და შეაფასე' },
  { id: 'quiz' as const, label: 'ქვიზი', icon: '⚡', desc: 'შეამოწმე ცოდნა' },
];

export default function DeckSelect({ onSelect }: Props) {
  const progress = getAllProgress();
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  function getDeckProgress(deck: Deck, suffix?: string) {
    const learned = deck.cards.filter(c => {
      const base = `${c.category}_${c.english.toLowerCase().replace(/\s+/g, '_')}`;
      const id = suffix ? `${base}_${suffix}` : base;
      const p = progress[id];
      if (p && p.repetitions >= 1) return true;
      // Also check old IDs without suffix (backwards compat)
      if (suffix) {
        const oldP = progress[base];
        return oldP && oldP.repetitions >= 1;
      }
      return false;
    }).length;
    return learned;
  }

  const isPremiumUser = localStorage.getItem('fluentge-premium') === 'true';
  const freeDecks = isPremiumUser ? decks : decks.filter(d => isDeckFree(d.id));
  const premiumDecks = isPremiumUser ? [] : decks.filter(d => !isDeckFree(d.id));

  // Mode selection overlay
  if (selectedDeck) {
    const learnedEnka = getDeckProgress(selectedDeck, 'enka');
    const learnedKaen = getDeckProgress(selectedDeck, 'kaen');
    const learnedMixed = getDeckProgress(selectedDeck, 'mixed');
    const total = selectedDeck.cards.length;
    const pctEnka = total > 0 ? Math.round((learnedEnka / total) * 100) : 0;
    const pctKaen = total > 0 ? Math.round((learnedKaen / total) * 100) : 0;
    const pctMixed = total > 0 ? Math.round((learnedMixed / total) * 100) : 0;
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <button
          onClick={() => setSelectedDeck(null)}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm mb-5 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          უკან
        </button>

        <div className="text-center mb-6">
          <span className="text-5xl block mb-3">{selectedDeck.icon}</span>
          <h2 className="text-xl font-bold">{selectedDeck.nameKa}</h2>
          <p className="text-[var(--color-text-muted)] text-sm">{selectedDeck.name} · {total} ბარათი</p>
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
              onClick={() => onSelect(selectedDeck, m.id)}
              className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-4 text-center transition-colors border border-white/5 hover:border-white/10"
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

  // Separate Top 2000 from other decks
  const top2000 = decks.find(d => d.id === 'top-2000');
  const otherFreeDecks = freeDecks.filter(d => d.id !== 'top-2000');
  
  // SRS progress for Top 2000
  const srsLearned = (() => {
    try {
      const data = JSON.parse(localStorage.getItem('fluentge-srs-data') || '{}');
      return Object.values(data).filter((d: any) => d.repetitions >= 2).length;
    } catch { return 0; }
  })();
  const srsTotal = top2000?.cards.length || 2000;
  const srsPct = Math.round(srsLearned / srsTotal * 100);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Featured: Top 2000 */}
      {top2000 && (
        <button
          onClick={() => setSelectedDeck(top2000)}
          className="w-full mb-8 relative overflow-hidden rounded-2xl text-left transition-all hover:scale-[1.01] group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#5B7F5E] via-[#3D5940] to-[#1C3A2E]"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80')] bg-cover bg-center opacity-15 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl">⭐</span>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full text-white uppercase tracking-wider">თავისუფალი</span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">ტოპ 2000 სიტყვა</h2>
                <p className="text-white/60 text-sm mt-1">Top 2000 English Words · თავისუფალი ბარათები</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{srsTotal.toLocaleString()}</p>
                <p className="text-white/50 text-xs">სიტყვა</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-white/70">{srsLearned} ნასწავლი</span>
                <span className="text-white/70">{srsPct}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div className="bg-white h-2.5 rounded-full transition-all" style={{ width: `${srsPct}%` }}></div>
              </div>
            </div>
            
            <div className="mt-4 bg-white/15 hover:bg-white/25 rounded-xl py-3 text-center transition-colors">
              <span className="text-white font-bold text-sm">🧠 დაიწყე სწავლა →</span>
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
        {otherFreeDecks.map(deck => {
          // Card is fully learned only when all 3 directions are learned
          const lEnka = getDeckProgress(deck, 'enka');
          const lKaen = getDeckProgress(deck, 'kaen');
          const lMixed = getDeckProgress(deck, 'mixed');
          const learned = Math.min(lEnka, lKaen, lMixed);
          const total = deck.cards.length;
          const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
          return (
            <button
              key={deck.id}
              onClick={() => setSelectedDeck(deck)}
              className="relative overflow-hidden rounded-xl text-center transition-all hover:scale-[1.02] group"
            >
              <img src={deck.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
              <div className="relative p-3 overflow-hidden">
                <span className="text-2xl block mb-1">{deck.icon}</span>
                <p className="text-[11px] font-semibold leading-tight mb-1 text-white line-clamp-2 break-words">{deck.nameKa}</p>
                <p className="text-[10px] text-white/60">{total} ბარათი</p>
                <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Premium decks */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">🔒 პრემიუმი</span>
        <div className="h-px flex-1 bg-white/10"></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {premiumDecks.map(deck => (
          <a
            key={deck.id}
            href="/premium/"
            className="relative overflow-hidden rounded-xl text-center opacity-60 hover:opacity-80 transition-opacity"
          >
            <img src={deck.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
            <div className="relative p-3 overflow-hidden">
              <span className="text-2xl block mb-1">{deck.icon}</span>
              <p className="text-[11px] font-semibold leading-tight mb-1 text-white line-clamp-2 break-words">{deck.nameKa}</p>
              <p className="text-[10px] text-white/60">{deck.cards.length} ბარათი</p>
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
