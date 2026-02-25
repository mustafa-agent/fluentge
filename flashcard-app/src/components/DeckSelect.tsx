import { useState } from 'react';
import { decks, Deck, isDeckFree } from '../lib/cards';
import { getAllProgress } from '../lib/storage';

interface Props {
  onSelect: (deck: Deck, mode?: 'study' | 'quiz') => void;
}

const modes = [
  { id: 'study' as const, label: 'ბარათები', icon: '📝' },
  { id: 'quiz' as const, label: 'ქვიზი', icon: '🧠' },
];

const deckImages: Record<string, string> = {
  'top-5000': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&q=60',
  'greetings': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=60',
  'numbers': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&q=60',
  'family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&q=60',
  'food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=60',
  'home': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&q=60',
  'travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&q=60',
  'work': 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=300&q=60',
  'shopping': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&q=60',
  'health': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=60',
  'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=60',
  'nature': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=60',
  'emotions': 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=300&q=60',
  'education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=60',
  'entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=60',
  'idioms': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=60',
  'politics': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=300&q=60',
  'daily-conversations': 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=300&q=60',
  'sports': 'https://images.unsplash.com/photo-1461896836934-bd45ea8b5a0a?w=300&q=60',
  'music': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=60',
  'animals': 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=300&q=60',
  'colors': 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=300&q=60',
  'body-parts': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=60',
  'professions': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&q=60',
  'social-media': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=60',
  'clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=60',
  'kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=60',
  'law': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&q=60',
  'relationships': 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&q=60',
  'environment': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=60',
  'airport': 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=300&q=60',
  'computers': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&q=60',
  'movies': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=60',
  'holidays': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=300&q=60',
  'hygiene': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=60',
  'routine': 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=300&q=60',
  'directions': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=300&q=60',
  'verbs': 'https://images.unsplash.com/photo-1526485856375-9110812aa008?w=300&q=60',
  'science': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=300&q=60',
  'religion': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=300&q=60',
  'garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=60',
  'banking': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&q=60',
  'social-relationships': 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=300&q=60',
  'emergency': 'https://images.unsplash.com/photo-1587556930799-8dca4fbe3d48?w=300&q=60',
  'slang': 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=300&q=60',
  'adjectives': 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&q=60',
  'driving': 'https://images.unsplash.com/photo-1449965408869-ebd13bc9e5c6?w=300&q=60',
  'prepositions': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&q=60',
  'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=60',
};
const defaultImg = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=60';

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

  const isPremiumUser = localStorage.getItem('fluentge-premium') === 'true';
  const freeDecks = isPremiumUser ? decks : decks.filter(d => isDeckFree(d.id));
  const premiumDecks = isPremiumUser ? [] : decks.filter(d => !isDeckFree(d.id));

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
              className="relative overflow-hidden rounded-xl text-center transition-all hover:scale-[1.02] group"
            >
              <img src={deckImages[deck.id] || defaultImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
              <div className="relative p-3">
                <span className="text-3xl block mb-2">{deck.icon}</span>
                <p className="text-xs font-semibold leading-tight mb-1 text-white">{deck.nameKa}</p>
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
            <img src={deckImages[deck.id] || defaultImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
            <div className="relative p-3">
              <span className="text-3xl block mb-2">{deck.icon}</span>
              <p className="text-xs font-semibold leading-tight mb-1 text-white">{deck.nameKa}</p>
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
