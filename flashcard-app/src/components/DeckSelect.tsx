import { decks, Deck } from '../lib/cards';
import { getAllProgress } from '../lib/storage';

interface Props {
  onSelect: (deck: Deck) => void;
}

export default function DeckSelect({ onSelect }: Props) {
  const progress = getAllProgress();

  function getDeckProgress(deck: Deck) {
    const learned = deck.cards.filter(c => {
      const id = `${c.category}_${c.english.toLowerCase().replace(/\s+/g, '_')}`;
      const p = progress[id];
      return p && p.repetitions >= 1;
    }).length;
    return learned;
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📚 აირჩიე კატეგორია</h2>
      <div className="space-y-4">
        {decks.map(deck => {
          const learned = getDeckProgress(deck);
          const total = deck.cards.length;
          const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
          return (
            <button
              key={deck.id}
              onClick={() => onSelect(deck)}
              className="w-full bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] rounded-2xl p-5 text-left transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{deck.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{deck.nameKa}</div>
                  <div className="text-[var(--color-text-muted)] text-sm">{deck.name} · {total} ბარათი</div>
                  <div className="mt-2 h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">{learned}/{total} ნასწავლი</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
