import { decks, Deck } from '../lib/cards';
import { getAllProgress } from '../lib/storage';

interface Props {
  onSelect: (deck: Deck, mode?: 'study' | 'quiz' | 'spelling') => void;
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
            <div
              key={deck.id}
              className="w-full bg-[var(--color-bg-card)] rounded-2xl p-5 transition-colors"
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
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onSelect(deck, 'study')}
                      className="flex-1 bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] font-medium py-2 rounded-xl text-sm transition-colors"
                    >📝 ბარათები</button>
                    <button
                      onClick={() => onSelect(deck, 'quiz')}
                      className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-medium py-2 rounded-xl text-sm transition-colors"
                    >🧠 ქვიზი</button>
                    <button
                      onClick={() => onSelect(deck, 'spelling')}
                      className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-medium py-2 rounded-xl text-sm transition-colors"
                    >✍️ წერა</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
