import { useState, useCallback, useRef, useEffect } from 'react';
import type { FlashCard } from '../lib/cards';
import { addXP, addStudyTime, updateStreak, XP_REWARDS, addCardReview } from '../lib/gamification';
import {
  type SRSStore, type Rating, type CardSRS,
  getSRSStore, saveSRSStore, rateCard, getNextInterval, getLearnedCount,
} from '../lib/srs-engine';
import { recordWrong, recordRight } from '../lib/difficult-words';

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
  
  const weighted = allCards.map(card => {
    const data = store[card.english];
    let weight: number;
    
    if (!data) { weight = 5; }
    else if (data.repetitions === 0) { weight = 10; }
    else if (data.nextReview <= now) { weight = 8; }
    else {
      weight = Math.max(0.5, 3 - data.repetitions * 0.5);
      weight *= Math.max(0.5, 3 - data.easeFactor);
    }
    
    return { card, weight };
  });
  
  const filtered = lastWord 
    ? weighted.filter(w => w.card.english !== lastWord)
    : weighted;
  
  const pool = filtered.length > 0 ? filtered : weighted;
  
  const totalWeight = pool.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of pool) {
    random -= item.weight;
    if (random <= 0) return item.card;
  }
  
  return pool[pool.length - 1].card;
}

interface Props {
  cards: FlashCard[];
  deckId: string;
  onBack: () => void;
}

function sanitizeForAudio(word: string): string {
  return word.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

let currentAudio: HTMLAudioElement | null = null;

function speakWord(text: string) {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  const filename = sanitizeForAudio(text);
  if (filename) {
    const audio = new Audio(`/flashcards/audio/words/${filename}_en.mp3`);
    currentAudio = audio;
    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = 0.9;
        window.speechSynthesis.speak(u);
      }
    });
    return;
  }
}

export default function SRSStudy({ cards, deckId, onBack }: Props) {
  const [store, setStore] = useState<SRSStore>(() => getSRSStore(deckId));
  const [currentCard, setCurrentCard] = useState<FlashCard>(() => pickNextCard(cards, getSRSStore(deckId)));
  const [flipped, setFlipped] = useState(false);
  const [autoplay, setAutoplay] = useState(() => localStorage.getItem('fluentge-autoplay') === 'true');
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

  // Auto-play pronunciation when card changes
  useEffect(() => {
    if (autoplay && currentCard && !flipped) {
      const timer = setTimeout(() => speakWord(currentCard.english), 300);
      return () => clearTimeout(timer);
    }
  }, [currentCard?.english, autoplay]);

  function toggleAutoplay() {
    const next = !autoplay;
    setAutoplay(next);
    localStorage.setItem('fluentge-autoplay', next ? 'true' : 'false');
  }

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
    
    // Track difficult words
    if (rating === 'again' || rating === 'hard') {
      recordWrong(currentCard.english, currentCard.georgian, currentCard.category, currentCard.pronunciation);
    } else if (rating === 'good' || rating === 'easy') {
      recordRight(currentCard.english);
    }

    addCardReview();
    // Award XP
    let xpGain = XP_REWARDS.REVIEW_CARD;
    if (rating === 'good' || rating === 'easy') {
      xpGain += XP_REWARDS.CORRECT_ANSWER;
      if (rating === 'easy') xpGain += 5; // bonus for easy
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
          <div className="flex items-center gap-3 text-xs text-[#6B6B65]">
            <button
              onClick={toggleAutoplay}
              className={`px-2 py-1 rounded-lg transition-colors ${
                autoplay ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-[#2E2E30] text-[#6B6B65] border border-[#2E2E30]'
              }`}
              title={autoplay ? 'ავტო-მოსმენა ჩართულია' : 'ავტო-მოსმენა გამორთულია'}
            >{autoplay ? '🔊' : '🔇'}</button>
            <span>📊 {reviewed} გადახედილი</span>
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
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-[#F5F5F0] text-center break-words">
                  {currentCard.english}
                </h1>
                <button
                  onClick={(e) => { e.stopPropagation(); speakWord(currentCard.english); }}
                  className="text-2xl hover:scale-110 transition-transform active:scale-95"
                  title="მოისმინე გამოთქმა"
                >🔊</button>
              </div>
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

              {/* SM-2 Rating buttons — 4 options with 3D press effect */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                <button
                  onClick={() => handleRate('again')}
                  className="bg-rose-500 border-b-4 border-rose-700 active:border-b-0 active:mt-1 text-white font-bold py-3 rounded-xl transition-all text-xs"
                >
                  <span className="block text-base mb-0.5">❌</span>
                  თავიდან
                  <span className="block text-[10px] font-normal opacity-70 mt-0.5">{getNextInterval(store[currentCard.english], 'again')}</span>
                </button>
                <button
                  onClick={() => handleRate('hard')}
                  className="bg-orange-500 border-b-4 border-orange-700 active:border-b-0 active:mt-1 text-white font-bold py-3 rounded-xl transition-all text-xs"
                >
                  <span className="block text-base mb-0.5">🤔</span>
                  რთული
                  <span className="block text-[10px] font-normal opacity-70 mt-0.5">{getNextInterval(store[currentCard.english], 'hard')}</span>
                </button>
                <button
                  onClick={() => handleRate('good')}
                  className="bg-green-500 border-b-4 border-green-700 active:border-b-0 active:mt-1 text-white font-bold py-3 rounded-xl transition-all text-xs"
                >
                  <span className="block text-base mb-0.5">👍</span>
                  კარგი
                  <span className="block text-[10px] font-normal opacity-70 mt-0.5">{getNextInterval(store[currentCard.english], 'good')}</span>
                </button>
                <button
                  onClick={() => handleRate('easy')}
                  className="bg-sky-500 border-b-4 border-sky-700 active:border-b-0 active:mt-1 text-white font-bold py-3 rounded-xl transition-all text-xs"
                >
                  <span className="block text-base mb-0.5">🎯</span>
                  ადვილი
                  <span className="block text-[10px] font-normal opacity-70 mt-0.5">{getNextInterval(store[currentCard.english], 'easy')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
