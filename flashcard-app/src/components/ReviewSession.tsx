import { useState, useEffect } from 'react';
import { Deck, FlashCard, getCardId } from '../lib/cards';
import { useAuth } from '../contexts/AuthContext';
import { 
  CardProgress, 
  processCardReview, 
  Rating, 
  getDueCards, 
  getNewCards, 
  getStudyStats 
} from '../lib/spaced-repetition';
import { 
  getDeckCardProgress, 
  updateCardProgress, 
  updateDeckProgress, 
  updateUserXP 
} from '../lib/firebase-service';

interface Props {
  deck: Deck;
  onBack: () => void;
}

interface SessionCard {
  card: FlashCard;
  progress: CardProgress;
}

export default function ReviewSession({ deck, onBack }: Props) {
  const { currentUser, isGuest, getUserId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionCards, setSessionCards] = useState<SessionCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    cardsStudied: 0,
    correctAnswers: 0,
    xpEarned: 0,
  });

  useEffect(() => {
    if (currentUser || isGuest) {
      loadSession();
    } else {
      // No user - redirect to auth
      setLoading(false);
      onBack();
    }
  }, [currentUser, isGuest, deck.id]);

  async function loadSession() {
    const userId = getUserId();
    if (!userId) return;

    try {
      setLoading(true);
      
      // Get all card progress for this deck
      const allCardProgress = await getDeckCardProgress(userId, deck.id);
      
      // Get due cards first (most important)
      const dueCards = getDueCards(allCardProgress);
      
      // Get new cards (limit to 20 per session)
      const newCards = getNewCards(allCardProgress).slice(0, 20);
      
      // Combine due cards + some new cards
      const cardsToStudy = [...dueCards, ...newCards.slice(0, 10)];
      
      if (cardsToStudy.length === 0) {
        // No cards to study
        alert('ყველა ბარათი ისწავლეს! თავიდან მოგვიანებით სცადეთ.');
        onBack();
        return;
      }

      // Map progress to actual cards
      const sessionCards: SessionCard[] = cardsToStudy
        .map(progress => {
          const card = deck.cards.find(c => getCardId(c) === progress.cardId);
          return card ? { card, progress } : null;
        })
        .filter(Boolean) as SessionCard[];

      setSessionCards(sessionCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error loading review session:', error);
      alert('სესიის ჩატვირთვა ვერ მოხერხდა.');
      onBack();
    } finally {
      setLoading(false);
    }
  }

  async function handleRating(rating: Rating) {
    const userId = getUserId();
    if (!userId || currentCardIndex >= sessionCards.length) return;

    const currentSession = sessionCards[currentCardIndex];
    const updatedProgress = processCardReview(currentSession.progress, rating);

    try {
      // Update card progress
      await updateCardProgress(userId, updatedProgress);

      // Calculate XP gained
      let xpGained = 10; // Base XP for reviewing
      if (rating >= 3) {
        xpGained += 5; // Bonus for correct answer
        setSessionStats(prev => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
        }));
      }

      // Update session stats
      setSessionStats(prev => ({
        cardsStudied: prev.cardsStudied + 1,
        correctAnswers: prev.correctAnswers,
        xpEarned: prev.xpEarned + xpGained,
      }));

      // Update user XP (guests don't save XP)
      if (!isGuest) {
        await updateUserXP(userId, xpGained);
      }

      // Update the progress in our local state
      const updatedSessionCards = [...sessionCards];
      updatedSessionCards[currentCardIndex].progress = updatedProgress;
      setSessionCards(updatedSessionCards);

      // Move to next card or finish session
      if (currentCardIndex + 1 < sessionCards.length) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else {
        // Session complete
        await finishSession(updatedSessionCards.map(s => s.progress));
        setSessionComplete(true);
      }
    } catch (error) {
      console.error('Error updating card progress:', error);
      alert('პროგრესის ახლება ვერ მოხერხდა.');
    }
  }

  async function finishSession(allProgress: CardProgress[]) {
    const userId = getUserId();
    if (!userId) return;

    try {
      // Update deck progress statistics
      await updateDeckProgress(userId, deck.id, allProgress);
    } catch (error) {
      console.error('Error updating deck progress:', error);
    }
  }

  function getRatingColor(rating: Rating): string {
    switch (rating) {
      case 1: return 'bg-red-500 hover:bg-red-600'; // Again
      case 2: return 'bg-orange-500 hover:bg-orange-600'; // Hard
      case 3: return 'bg-green-500 hover:bg-green-600'; // Good
      case 4: return 'bg-blue-500 hover:bg-blue-600'; // Easy
      default: return 'bg-gray-500';
    }
  }

  function getRatingText(rating: Rating): string {
    switch (rating) {
      case 1: return 'თავიდან';
      case 2: return 'რთული';
      case 3: return 'კარგი';
      case 4: return 'მარტივი';
      default: return '';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AFF] mx-auto mb-4"></div>
          <p className="text-[#C8C8C0]">სესიის ჩატვირთვა...</p>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        {/* Header */}
        <header className="px-4 py-4 border-b border-white/10">
          <div className="max-w-lg mx-auto flex items-center">
            <h1 className="text-lg font-bold">სესია დასრულდა! 🎉</h1>
          </div>
        </header>

        <div className="px-4 py-8 max-w-lg mx-auto text-center">
          {/* Success icon */}
          <div className="text-6xl mb-6">🎊</div>
          
          <h2 className="text-2xl font-bold mb-4">გილოცავთ!</h2>
          
          {/* Stats */}
          <div className="bg-[#242426] rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-[#007AFF]">{sessionStats.cardsStudied}</div>
                <div className="text-sm text-[#C8C8C0]">ბარათი</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#34C759]">
                  {sessionStats.cardsStudied > 0 
                    ? Math.round((sessionStats.correctAnswers / sessionStats.cardsStudied) * 100) 
                    : 0}%
                </div>
                <div className="text-sm text-[#C8C8C0]">სიზუსტე</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#FF9500]">{sessionStats.xpEarned}</div>
                <div className="text-sm text-[#C8C8C0]">XP</div>
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-[#007AFF] hover:bg-[#0056CC] rounded-xl py-4 font-semibold text-lg transition-colors"
          >
            მთავარ მენიუში დაბრუნება
          </button>
        </div>
      </div>
    );
  }

  if (sessionCards.length === 0) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-[#C8C8C0] mb-4">არ არის ბარათები გასამეორებლად</p>
          <button
            onClick={onBack}
            className="bg-[#007AFF] hover:bg-[#0056CC] px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            უკან
          </button>
        </div>
      </div>
    );
  }

  const currentSession = sessionCards[currentCardIndex];
  const progress = Math.round(((currentCardIndex + 1) / sessionCards.length) * 100);

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white">
      {/* Header */}
      <header className="px-4 py-4 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#C8C8C0] hover:text-white text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
            უკან
          </button>
          
          <div className="text-sm text-[#C8C8C0]">
            {currentCardIndex + 1} / {sessionCards.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 py-2 max-w-lg mx-auto">
        <div className="h-2 bg-[#242426] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#007AFF] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-4 py-8 max-w-lg mx-auto">
        {/* Card */}
        <div 
          className="bg-[#242426] rounded-2xl min-h-[300px] flex flex-col justify-center items-center p-8 mb-8 cursor-pointer transition-transform active:scale-[0.98]"
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {!isFlipped ? (
            // Front side
            <div className="text-center">
              <p className="text-2xl font-bold mb-4">{currentSession.card.english}</p>
              <p className="text-[#C8C8C0] text-sm mb-6">/{currentSession.card.pronunciation}/</p>
              <div className="text-[#C8C8C0] text-sm">👆 ნახეთ თარგმანი</div>
            </div>
          ) : (
            // Back side
            <div className="text-center">
              <p className="text-2xl font-bold mb-2 text-[#007AFF]">{currentSession.card.english}</p>
              <p className="text-xl font-bold mb-4">{currentSession.card.georgian}</p>
              <p className="text-[#C8C8C0] text-sm mb-4">/{currentSession.card.pronunciation}/</p>
              {currentSession.card.example_en && (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <p className="text-sm text-[#C8C8C0] mb-2">{currentSession.card.example_en}</p>
                  <p className="text-sm">{currentSession.card.example_ka}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rating Buttons */}
        {isFlipped && (
          <div className="grid grid-cols-4 gap-3">
            {([1, 2, 3, 4] as Rating[]).map(rating => (
              <button
                key={rating}
                onClick={() => handleRating(rating)}
                className={`${getRatingColor(rating)} text-white py-4 px-2 rounded-xl font-semibold text-sm transition-colors`}
              >
                {getRatingText(rating)}
              </button>
            ))}
          </div>
        )}

        {/* Instructions */}
        {!isFlipped && (
          <div className="text-center text-[#C8C8C0] text-sm">
            დაფიქრდით პასუხზე, შემდეგ ბარათზე დაკლიკეთ
          </div>
        )}
      </div>
    </div>
  );
}