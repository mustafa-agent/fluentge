import { useState, useEffect, useRef, useCallback } from 'react';
import { Deck, FlashCard } from '../lib/cards';
import { playCorrect, playWrong } from '../lib/sounds';

interface Props {
  deck: Deck;
  onBack: () => void;
}

interface MatchCard {
  id: number;
  text: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
  type: 'en' | 'ka';
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MatchGame({ deck, onBack }: Props) {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [time, setTime] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalPairs = 6;

  const initGame = useCallback(() => {
    const picked = shuffle(deck.cards).slice(0, totalPairs);
    const matchCards: MatchCard[] = [];
    picked.forEach((card, i) => {
      matchCards.push({ id: i * 2, text: card.english, pairId: i, flipped: false, matched: false, type: 'en' });
      matchCards.push({ id: i * 2 + 1, text: card.georgian, pairId: i, flipped: false, matched: false, type: 'ka' });
    });
    setCards(shuffle(matchCards));
    setSelected([]);
    setMoves(0);
    setMatchedCount(0);
    setTime(0);
    setWon(false);
    setLocked(false);
  }, [deck]);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    if (won) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [won]);

  function handleFlip(id: number) {
    if (locked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (selected.includes(id)) return;

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);

    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newSelected.map(sid => newCards.find(c => c.id === sid)!);
      if (a.pairId === b.pairId) {
        playCorrect();
        const matched = newCards.map(c =>
          c.pairId === a.pairId ? { ...c, matched: true, flipped: true } : c
        );
        setCards(matched);
        setSelected([]);
        setLocked(false);
        const newCount = matchedCount + 1;
        setMatchedCount(newCount);
        if (newCount === totalPairs) setWon(true);
      } else {
        playWrong();
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newSelected.includes(c.id) && !c.matched ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setLocked(false);
        }, 800);
      }
    }
  }

  const accuracy = moves > 0 ? Math.round((matchedCount / moves) * 100) : 0;

  if (won) {
    return (
      <div className="px-4 py-8 max-w-lg mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">🎉 მოიგე!</h2>
        <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 space-y-3 mb-6">
          <div className="text-lg">🃏 სვლები: <span className="font-bold text-[var(--color-primary)]">{moves}</span></div>
          <div className="text-lg">⏱️ დრო: <span className="font-bold text-[var(--color-primary)]">{formatTime(time)}</span></div>
          <div className="text-lg">🎯 სიზუსტე: <span className="font-bold text-[var(--color-primary)]">{accuracy}%</span></div>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={initGame} className="bg-[var(--color-primary)] text-black font-bold py-3 px-6 rounded-xl">🔄 თავიდან</button>
          <button onClick={onBack} className="bg-white/10 hover:bg-white/20 py-3 px-6 rounded-xl font-medium transition-colors">← უკან</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white transition-colors">← უკან</button>
        <h2 className="text-lg font-bold">🃏 მეხსიერების თამაში</h2>
        <div className="w-12"></div>
      </div>

      <div className="flex justify-center gap-6 mb-4 text-sm text-[var(--color-text-muted)]">
        <span>სვლები: <span className="text-white font-bold">{moves}</span></span>
        <span>დრო: <span className="text-white font-bold">{formatTime(time)}</span></span>
        <span>{matchedCount}/{totalPairs} ✅</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className="aspect-[3/4] cursor-pointer"
            style={{ perspective: '600px' }}
          >
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Back (hidden side) */}
              <div
                className="absolute inset-0 rounded-xl bg-[var(--color-primary)]/20 border-2 border-[var(--color-primary)]/40 flex items-center justify-center text-3xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                ❓
              </div>
              {/* Front (revealed) */}
              <div
                className={`absolute inset-0 rounded-xl flex items-center justify-center p-2 text-center font-semibold text-sm
                  ${card.matched
                    ? 'bg-green-500/20 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                    : 'bg-[var(--color-bg-card)] border-2 border-white/10'
                  }
                  ${card.type === 'en' ? 'text-[var(--color-primary)]' : 'text-amber-400'}
                `}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                {card.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
