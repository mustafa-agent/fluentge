import { useState } from 'react';
import { decks, Deck, isDeckFree } from '../lib/cards';
import { getAllProgress } from '../lib/storage';

interface Props {
  onSelect: (deck: Deck, mode?: 'study' | 'quiz' | 'spelling' | 'sentences' | 'match' | 'speed' | 'scramble' | 'reverse') => void;
}

const modes = [
  { id: 'study' as const, label: 'ბარათები', icon: '📝' },
  { id: 'quiz' as const, label: 'ქვიზი', icon: '🧠' },
  { id: 'spelling' as const, label: 'წერა', icon: '✍️' },
  { id: 'sentences' as const, label: 'წინადადება', icon: '🔤' },
  { id: 'match' as const, label: 'თამაში', icon: '🃏' },
  { id: 'speed' as const, label: 'სიჩქარე', icon: '⚡' },
  { id: 'scramble' as const, label: 'გაშიფვრა', icon: '🔀' },
  { id: 'reverse' as const, label: 'შებრუნება', icon: '🔄' },
];

export default function DeckSelect({ onSelect }: Props) {
  const progress = getAllProgress();
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  function getDeckProgress(deck: Deck) {
    const learned = deck.cards.filter(c => {
      const id = `${c.category}_${c.english.toLowerCase().replace(/\s+/g, '_')}`;
      const p = progress[id];
      return p && p.repetitions >= 1;
    }).length;
    return learned;
  }

  const freeDecks = decks.filter(d => isDeckFree(d.id));
  const premiumDecks = decks.filter(d => !isDeckFree(d.id));

  // Mode selection overlay
  if (selectedDeck) {
    const learned = getDeckProgress(selectedDeck);
    const total = selectedDeck.cards.length;
    const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
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
          <div className="mt-3 max-w-xs mx-auto">
            <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{learned}/{total} ნასწავლი ({pct}%)</p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 text-center">აირჩიე რეჟიმი</h3>
        <div className="grid grid-cols-2 gap-3">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => onSelect(selectedDeck, m.id)}
              className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-4 text-center transition-colors border border-white/5 hover:border-white/10"
            >
              <span className="text-2xl block mb-1">{m.icon}</span>
              <span className="text-sm font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Free decks */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">უფასო</span>
        <div className="h-px flex-1 bg-white/10"></div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {freeDecks.map(deck => {
          const learned = getDeckProgress(deck);
          const total = deck.cards.length;
          const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
          return (
            <button
              key={deck.id}
              onClick={() => setSelectedDeck(deck)}
              className="bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-xl p-3 text-center transition-colors"
            >
              <span className="text-3xl block mb-2">{deck.icon}</span>
              <p className="text-xs font-semibold leading-tight mb-1">{deck.nameKa}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">{total} ბარათი</p>
              <div className="mt-2 h-1.5 bg-[var(--color-bg)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${pct}%` }} />
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
            className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center opacity-50 hover:opacity-70 transition-opacity"
          >
            <span className="text-3xl block mb-2 grayscale">{deck.icon}</span>
            <p className="text-xs font-semibold leading-tight mb-1">{deck.nameKa}</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">{deck.cards.length} ბარათი</p>
            <div className="mt-2">
              <span className="text-amber-400 text-[10px]">🔒</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
