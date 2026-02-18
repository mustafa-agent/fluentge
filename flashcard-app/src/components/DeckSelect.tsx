import { decks, Deck, isDeckFree } from '../lib/cards';
import { getAllProgress } from '../lib/storage';

interface Props {
  onSelect: (deck: Deck, mode?: 'study' | 'quiz' | 'spelling' | 'sentences') => void;
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

  const freeDecks = decks.filter(d => isDeckFree(d.id));
  const premiumDecks = decks.filter(d => !isDeckFree(d.id));

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📚 აირჩიე კატეგორია</h2>

      {/* Free decks */}
      <div className="mb-4">
        <div className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
          <span className="bg-green-500/20 px-2 py-0.5 rounded-full">✅ უფასო</span>
        </div>
        <div className="space-y-4">
          {freeDecks.map(deck => {
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
                      <button
                        onClick={() => onSelect(deck, 'sentences')}
                        className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-medium py-2 rounded-xl text-sm transition-colors"
                      >🔤 წინადადება</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium decks */}
      <div className="mt-8">
        <div className="text-sm font-medium text-amber-400 mb-3 flex items-center gap-2">
          <span className="bg-amber-500/20 px-2 py-0.5 rounded-full">🔒 პრემიუმი</span>
          <span className="text-[var(--color-text-muted)] text-xs">— გახსენი ყველა კატეგორია</span>
        </div>
        <div className="space-y-4">
          {premiumDecks.map(deck => {
            const total = deck.cards.length;
            return (
              <a
                key={deck.id}
                href="/register/"
                className="block w-full bg-[var(--color-bg-card)] rounded-2xl p-5 transition-colors opacity-60 hover:opacity-80 border border-white/5 hover:border-amber-500/30"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl grayscale">{deck.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-lg flex items-center gap-2">
                      {deck.nameKa}
                      <span className="text-amber-400 text-base">🔒</span>
                    </div>
                    <div className="text-[var(--color-text-muted)] text-sm">{deck.name} · {total} ბარათი</div>
                    <div className="mt-3">
                      <span className="bg-amber-500/20 text-amber-400 font-medium py-2 px-4 rounded-xl text-sm">
                        გახსნა →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
