import { useState, useMemo, useRef, useCallback } from 'react';
import { decks, FlashCard, Deck } from '../lib/cards';

interface Props {
  onClose: () => void;
  onSelectDeck?: (deck: Deck) => void;
}

interface SearchResult {
  card: FlashCard;
  deck: Deck;
  matchField: 'english' | 'georgian' | 'example';
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

// Build flat index once
const allCards: { card: FlashCard; deck: Deck }[] = decks.flatMap(deck =>
  deck.cards.map(card => ({ card, deck }))
);

const totalWords = allCards.length;

export default function WordSearch({ onClose, onSelectDeck }: Props) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const found: SearchResult[] = [];
    const seen = new Set<string>();

    for (const { card, deck } of allCards) {
      const key = `${card.english}_${deck.id}`;
      if (seen.has(key)) continue;

      if (card.english.toLowerCase().includes(q)) {
        found.push({ card, deck, matchField: 'english' });
        seen.add(key);
      } else if (card.georgian.toLowerCase().includes(q)) {
        found.push({ card, deck, matchField: 'georgian' });
        seen.add(key);
      } else if (
        card.example_en?.toLowerCase().includes(q) ||
        card.example_ka?.toLowerCase().includes(q)
      ) {
        found.push({ card, deck, matchField: 'example' });
        seen.add(key);
      }

      if (found.length >= 50) break;
    }

    return found;
  }, [query]);

  const highlight = useCallback((text: string, q: string) => {
    if (!q || q.length < 2) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-400/30 text-yellow-300 rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col">
      {/* Search header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xl transition-colors">✕</button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ძიება... (ინგლისურად ან ქართულად)"
                className="w-full bg-[var(--color-bg-card)] rounded-xl px-4 py-3 pl-10 text-[var(--color-text)] placeholder-[var(--color-text-muted)] border border-white/10 focus:border-sky-500/50 outline-none transition-colors"
                autoFocus
                autoComplete="off"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">🔍</span>
            </div>
          </div>
          <div className="text-xs text-[var(--color-text-muted)] mt-2">
            {query.length >= 2
              ? `${results.length} შედეგი ${totalWords.toLocaleString()} სიტყვიდან`
              : `${totalWords.toLocaleString()} სიტყვა ${decks.length} თემაში`}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4">
          {query.length < 2 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-[var(--color-text-muted)]">ჩაწერე მინიმუმ 2 ასო</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">ინგლისურად ან ქართულად</p>
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">😕</div>
              <p className="text-[var(--color-text-muted)]">არაფერი მოიძებნა</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">სცადე სხვა სიტყვა</p>
            </div>
          )}

          <div className="space-y-2">
            {results.map(({ card, deck, matchField }, i) => {
              const key = `${card.english}_${deck.id}_${i}`;
              const isExpanded = expanded === key;

              return (
                <div
                  key={key}
                  className="bg-[var(--color-bg-card)] rounded-xl border border-white/5 overflow-hidden transition-all"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-[var(--color-bg-card-hover)] transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : key)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-bold text-base">
                          {matchField === 'english'
                            ? highlight(card.english, query)
                            : card.english}
                        </div>
                        <div className="text-sm text-green-400">
                          {matchField === 'georgian'
                            ? highlight(card.georgian, query)
                            : card.georgian}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-[var(--color-text-muted)]">
                          {deck.icon} {deck.nameKa}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); speak(card.english); }}
                          className="text-lg hover:scale-110 transition-transform"
                        >🔊</button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-white/5">
                      {card.pronunciation && (
                        <p className="text-sm text-[var(--color-text-muted)] italic mb-2">[{card.pronunciation}]</p>
                      )}
                      {card.example_en && (
                        <div className="bg-[var(--color-bg)] rounded-lg p-3 mb-3">
                          <p className="text-sm text-[var(--color-text)]">
                            {matchField === 'example' ? highlight(card.example_en, query) : card.example_en}
                          </p>
                          {card.example_ka && (
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                              {matchField === 'example' ? highlight(card.example_ka, query) : card.example_ka}
                            </p>
                          )}
                        </div>
                      )}
                      {card.level && (
                        <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full mr-2">{card.level}</span>
                      )}
                      {onSelectDeck && (
                        <button
                          onClick={() => onSelectDeck(deck)}
                          className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full hover:bg-green-500/30 transition-colors"
                        >
                          📚 ისწავლე ეს თემა
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
