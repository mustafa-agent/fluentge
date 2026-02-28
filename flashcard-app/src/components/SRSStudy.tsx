import { useState, useCallback, useRef, useEffect } from 'react';
import type { FlashCard } from '../lib/cards';
import { addXP, addStudyTime, updateStreak, XP_REWARDS } from '../lib/gamification';

interface SRSData {
  interval: number;
  easeFactor: number;
  nextReview: number;
  repetitions: number;
  lastSeen: number;
}

interface SRSStore {
  [word: string]: SRSData;
}

const SRS_KEY_PREFIX = 'fluentge-srs-';

function getSRSStore(deckId: string): SRSStore {
  try {
    return JSON.parse(localStorage.getItem(SRS_KEY_PREFIX + deckId) || '{}');
  } catch { return {}; }
}

function saveSRSStore(deckId: string, store: SRSStore) {
  localStorage.setItem(SRS_KEY_PREFIX + deckId, JSON.stringify(store));
}

function addToKnownCards(word: string, georgian: string) {
  try {
    const known: Array<{word: string, georgian: string}> = JSON.parse(localStorage.getItem('knownCards') || '[]');
    if (!known.some(k => k.word === word)) {
      known.push({ word, georgian });
      localStorage.setItem('knownCards', JSON.stringify(known));
    }
  } catch { /* ignore */ }
}

// Pick next card using weighted random — unknown/difficult words appear more often
function pickNextCard(allCards: FlashCard[], store: SRSStore, lastWord?: string): FlashCard {
  const now = Date.now();
  
  // Calculate weight for each card
  const weighted = allCards.map(card => {
    const data = store[card.english];
    let weight: number;
    
    if (!data) {
      // Never seen — medium-high weight
      weight = 5;
    } else if (data.repetitions === 0) {
      // Seen but not learned — highest weight
      weight = 10;
    } else if (data.nextReview <= now) {
      // Due for review — high weight
      weight = 8;
    } else {
      // Known — low weight based on how well known
      // More repetitions = lower weight
      weight = Math.max(0.5, 3 - data.repetitions * 0.5);
      // Lower ease factor = higher weight (harder words)
      weight *= Math.max(0.5, 3 - data.easeFactor);
    }
    
    return { card, weight };
  });
  
  // Filter out last shown word to avoid immediate repeat
  const filtered = lastWord 
    ? weighted.filter(w => w.card.english !== lastWord)
    : weighted;
  
  const pool = filtered.length > 0 ? filtered : weighted;
  
  // Weighted random selection
  const totalWeight = pool.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of pool) {
    random -= item.weight;
    if (random <= 0) return item.card;
  }
  
  return pool[pool.length - 1].card;
}

type Rating = 'know' | 'hard' | 'again';

function rateCard(store: SRSStore, word: string, rating: Rating): SRSStore {
  const data = store[word] || {
    interval: 0,
    easeFactor: 2.5,
    nextReview: 0,
    repetitions: 0,
    lastSeen: 0,
  };
  const now = Date.now();
  const DAY = 86400000;
  
  switch (rating) {
    case 'know':
      data.repetitions++;
      if (data.repetitions === 1) data.interval = 1;
      else if (data.repetitions === 2) data.interval = 3;
      else data.interval = Math.round(data.interval * data.easeFactor);
      data.easeFactor = Math.min(3.0, data.easeFactor + 0.1);
      data.nextReview = now + data.interval * DAY;
      break;
    case 'hard':
      data.interval = Math.max(1, Math.round(data.interval * 0.5));
      data.easeFactor = Math.max(1.3, data.easeFactor - 0.15);
      data.nextReview = now + data.interval * DAY;
      break;
    case 'again':
      data.repetitions = 0;
      data.interval = 0;
      data.easeFactor = Math.max(1.3, data.easeFactor - 0.2);
      data.nextReview = now + 60000;
      break;
  }
  
  data.lastSeen = now;
  return { ...store, [word]: data };
}

function getLearnedCount(store: SRSStore): number {
  return Object.values(store).filter(d => d.repetitions >= 2).length;
}

interface Props {
  cards: FlashCard[];
  deckId: string;
  onBack: () => void;
}

export default function SRSStudy({ cards, deckId, onBack }: Props) {
  const [store, setStore] = useState<SRSStore>(() => getSRSStore(deckId));
  const [currentCard, setCurrentCard] = useState<FlashCard>(() => pickNextCard(cards, getSRSStore(deckId)));
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const sessionStart = useRef(Date.now());
  const streakUpdated = useRef(false);

  // Update streak on first review
  useEffect(() => {
    if (reviewed > 0 && !streakUpdated.current) {
      streakUpdated.current = true;
      updateStreak(true);
    }
  }, [reviewed]);

  // Track study time when leaving
  useEffect(() => {
    return () => {
      const mins = Math.max(1, Math.round((Date.now() - sessionStart.current) / 60000));
      if (reviewed > 0) addStudyTime(mins);
    };
  }, [reviewed]);
  
  const learned = getLearnedCount(store);
  
  const handleRate = useCallback((rating: Rating) => {
    if (!currentCard) return;
    
    const newStore = rateCard(store, currentCard.english, rating);
    setStore(newStore);
    saveSRSStore(deckId, newStore);
    
    // Award XP
    let xpGain = XP_REWARDS.REVIEW_CARD;
    if (rating === 'know') {
      xpGain += XP_REWARDS.CORRECT_ANSWER;
      addToKnownCards(currentCard.english, currentCard.georgian);
      setCorrect(c => c + 1);
    }
    addXP(xpGain);
    setSessionXP(x => x + xpGain);
    
    // Show floating XP
    const el = document.createElement('div');
    el.textContent = `+${xpGain} XP`;
    el.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);font-weight:bold;font-size:1.25rem;color:#facc15;z-index:9999;pointer-events:none;animation:xpFloat 1.2s ease-out forwards;';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
    
    setReviewed(r => r + 1);
    setFlipped(false);
    
    // Pick next card
    const next = pickNextCard(cards, newStore, currentCard.english);
    setCurrentCard(next);
  }, [currentCard, store, cards, deckId]);
  
  if (!currentCard) return null;
  
  return (
    <div className="h-screen bg-[#1C1C1E] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="text-[#6B6B65] hover:text-[#C8C8C0] transition-colors text-sm flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            უკან
          </button>
          <div className="flex items-center gap-4 text-xs text-[#6B6B65]">
            <span>📊 {reviewed} გამეორებული</span>
            <span className="text-yellow-400">⭐ +{sessionXP}</span>
            <span>✅ {learned}/{cards.length} ნასწავლი</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-[#2E2E30] rounded-full h-1.5">
          <div className="bg-[#5B7F5E] h-1.5 rounded-full transition-all duration-300" style={{ width: `${Math.min(learned / cards.length * 100, 100)}%` }}></div>
        </div>
      </div>
      
      {/* Card + Buttons together, centered */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
        <div className="w-full max-w-sm">
          {!flipped ? (
            /* Front — tap to flip */
            <div 
              className="bg-[#242426] border border-[#2E2E30] rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer active:scale-[0.98] transition-transform"
              style={{ minHeight: '220px' }}
              onClick={() => setFlipped(true)}
            >
              <div className="text-xs text-[#6B6B65] mb-4 uppercase tracking-wider">
                {currentCard.level}
              </div>
              <h1 className="text-4xl font-bold text-[#F5F5F0] mb-4 text-center break-words">
                {currentCard.english}
              </h1>
              <p className="text-sm text-[#6B6B65] mt-4 animate-pulse">შეეხე გადასაბრუნებლად 👆</p>
            </div>
          ) : (
            /* Back — show answer */
            <>
              <div 
                className="bg-[#242426] border border-[#5B7F5E]/30 rounded-2xl flex flex-col items-center justify-center p-6"
              >
                <div className="text-xs text-[#6B6B65] mb-1 uppercase tracking-wider">
                  {currentCard.level}
                </div>
                <h1 className="text-2xl font-bold text-[#F5F5F0] mb-2 text-center break-words">
                  {currentCard.english}
                </h1>
                <p className="text-lg text-[#5B7F5E] font-bold mb-1 text-center break-words">
                  {currentCard.georgian}
                </p>
                <p className="text-sm text-[#8B8B85] mb-3">
                  [{currentCard.pronunciation}]
                </p>
                <div className="bg-[#1C1C1E] rounded-xl p-3 w-full">
                  <p className="text-sm text-[#C8C8C0] mb-1 break-words">{currentCard.example_en}</p>
                  <p className="text-xs text-[#6B6B65] break-words">{currentCard.example_ka}</p>
                </div>
              </div>

              {/* Rating buttons — right below the card */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleRate('again')}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold py-4 rounded-xl transition-colors text-sm"
                >
                  არ ვიცი ❌
                </button>
                <button
                  onClick={() => handleRate('hard')}
                  className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 font-bold py-4 rounded-xl transition-colors text-sm"
                >
                  რთულია 🤔
                </button>
                <button
                  onClick={() => handleRate('know')}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 font-bold py-4 rounded-xl transition-colors text-sm"
                >
                  ვიცი ✅
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
