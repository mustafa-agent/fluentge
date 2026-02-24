import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Deck, FlashCard, getCardId } from '../lib/cards';
import { sm2 } from '../lib/sm2';
import { getCardProgress, saveCardProgress, updateStats, incrementWordsLearned } from '../lib/storage';
import { playCorrect, playWrong } from '../lib/sounds';
import { useStudySettings } from '../contexts/StudySettingsContext';
import { 
  addXP, 
  addStudyTime, 
  updateStreak, 
  isDailyGoalMet, 
  XP_REWARDS, 
  isAnswerCorrect,
  getUserStats
} from '../lib/gamification';
import { 
  triggerCorrectAnswerConfetti,
  triggerLevelUpConfetti,
  triggerDailyGoalConfetti,
  triggerStreakConfetti,
  addShakeAnimation,
  addGlowAnimation,
  createXPGainElement
} from '../lib/animations';

interface Props {
  deck: Deck;
  onBack: () => void;
}

interface StudySession {
  startTime: number;
  cardsReviewed: number;
  correctAnswers: number;
  xpEarned: number;
}

export default function EnhancedStudyScreen({ deck, onBack }: Props) {
  const { settings, setCardDirection, setStudyMode } = useStudySettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedbackColor, setFeedbackColor] = useState<'green' | 'red' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [session] = useState<StudySession>({ 
    startTime: Date.now(), 
    cardsReviewed: 0, 
    correctAnswers: 0, 
    xpEarned: 0 
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const studyCards = useMemo(() => {
    const now = Date.now();
    const due = deck.cards.filter(c => {
      const p = getCardProgress(getCardId(c));
      return p.nextReview <= now || p.repetitions === 0;
    });
    return due.length > 0 ? due.slice(0, 10) : deck.cards.slice(0, 10);
  }, [deck]);

  const card: FlashCard | undefined = studyCards[currentIndex];

  // Auto-play audio when card flips in reverse mode
  useEffect(() => {
    if (settings.cardDirection === 'georgian-to-english' && 
        settings.autoPlayAudio && 
        flipped && 
        card) {
      speak(card.english);
    }
  }, [flipped, settings, card]);

  // Focus input when in typing mode
  useEffect(() => {
    if (settings.studyMode === 'type' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, settings.studyMode]);

  function speak(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  function getQuestionSide(): { text: string; pronunciation?: string } {
    if (!card) return { text: '' };
    
    if (settings.cardDirection === 'english-to-georgian') {
      return { 
        text: card.english, 
        pronunciation: settings.showPronunciation ? card.pronunciation : undefined 
      };
    } else {
      return { text: card.georgian };
    }
  }

  function getAnswerSide(): { text: string; pronunciation?: string } {
    if (!card) return { text: '' };
    
    if (settings.cardDirection === 'english-to-georgian') {
      return { text: card.georgian };
    } else {
      return { 
        text: card.english, 
        pronunciation: settings.showPronunciation ? card.pronunciation : undefined 
      };
    }
  }

  async function handleTypeAnswer() {
    if (!card || userInput.trim() === '') return;

    const correctAnswer = getAnswerSide().text;
    const isCorrect = isAnswerCorrect(userInput.trim(), correctAnswer);
    
    setShowAnswer(true);
    setFeedbackColor(isCorrect ? 'green' : 'red');
    
    if (cardRef.current) {
      addGlowAnimation(cardRef.current, isCorrect ? 'green' : 'red');
    }

    if (isCorrect) {
      playCorrect();
      await triggerCorrectAnswerConfetti();
      await handleRateAnswer(3); // Good rating for correct answers
    } else {
      playWrong();
      if (cardRef.current) {
        addShakeAnimation(cardRef.current);
      }
      await handleRateAnswer(1); // Again rating for wrong answers
    }

    // Move to next card after brief delay
    setTimeout(() => {
      nextCard();
    }, 2000);
  }

  async function handleRateAnswer(quality: number) {
    if (!card) return;

    const id = getCardId(card);
    const progress = getCardProgress(id);
    const isCorrect = quality >= 3;
    
    // Update spaced repetition
    const updated = sm2(progress, quality);
    saveCardProgress(updated);
    updateStats(isCorrect);
    
    // Track if this is a new word learned
    if (isCorrect && progress.repetitions === 0) {
      incrementWordsLearned();
    }

    // Calculate XP reward
    let xpGained = XP_REWARDS.REVIEW_CARD;
    if (isCorrect) {
      xpGained += XP_REWARDS.CORRECT_ANSWER;
    }

    // Add XP and check for level up
    const { newTotal, levelUp } = addXP(xpGained);
    session.xpEarned += xpGained;

    // Show XP animation
    if (cardRef.current) {
      createXPGainElement(xpGained, cardRef.current);
    }

    // Level up celebration
    if (levelUp) {
      setTimeout(async () => {
        await triggerLevelUpConfetti();
        const levelUpXP = addXP(XP_REWARDS.LEVEL_UP);
        session.xpEarned += XP_REWARDS.LEVEL_UP;
      }, 500);
    }

    // Update session stats
    session.cardsReviewed++;
    if (isCorrect) session.correctAnswers++;

    // Update streak and check daily goal
    const streakBefore = getUserStats().currentStreak;
    const newStreak = updateStreak(true);
    
    if (newStreak > streakBefore) {
      setTimeout(async () => {
        await triggerStreakConfetti(newStreak);
      }, 1000);
    }

    // Check if daily goal was just met
    const studyTime = Math.round((Date.now() - session.startTime) / 60000); // minutes
    addStudyTime(studyTime);
    
    if (isDailyGoalMet()) {
      setTimeout(async () => {
        await triggerDailyGoalConfetti();
        addXP(XP_REWARDS.DAILY_GOAL_MET);
        session.xpEarned += XP_REWARDS.DAILY_GOAL_MET;
      }, 1500);
    }
  }

  function nextCard() {
    setFlipped(false);
    setUserInput('');
    setShowAnswer(false);
    setFeedbackColor(null);

    if (currentIndex + 1 >= studyCards.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  }

  function handleCardClick() {
    if (settings.studyMode === 'type') return;
    if (!flipped) {
      setFlipped(true);
    }
  }

  if (sessionDone) {
    const accuracy = session.cardsReviewed > 0 
      ? Math.round((session.correctAnswers / session.cardsReviewed) * 100) 
      : 0;
    const studyTimeMinutes = Math.round((Date.now() - session.startTime) / 60000);
    const stats = getUserStats();

    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="px-4 py-12 max-w-lg mx-auto text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-6">სესია დასრულდა!</h2>
          
          {/* Session Summary */}
          <div className="bg-[#242426] rounded-2xl p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-[#007AFF]">{session.cardsReviewed}</div>
                <div className="text-sm text-[#C8C8C0]">ბარათი</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#34C759]">{accuracy}%</div>
                <div className="text-sm text-[#C8C8C0]">სიზუსტე</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
              <div>
                <div className="text-lg font-bold text-[#FF9500]">+{session.xpEarned}</div>
                <div className="text-xs text-[#C8C8C0]">XP</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#FF6B00]">{stats.currentStreak}🔥</div>
                <div className="text-xs text-[#C8C8C0]">სერია</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#007AFF]">{studyTimeMinutes}წთ</div>
                <div className="text-xs text-[#C8C8C0]">დრო</div>
              </div>
            </div>

            {/* Daily Goal Progress */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#C8C8C0]">დღიური მიზანი</span>
                <span className="text-sm text-[#C8C8C0]">
                  {stats.todayStudyTime}/{stats.dailyGoalMinutes}წთ
                </span>
              </div>
              <div className="h-2 bg-[#1C1C1E] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#34C759] rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(100, (stats.todayStudyTime / stats.dailyGoalMinutes) * 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Level Progress */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#C8C8C0]">დონე {stats.level}</span>
                <span className="text-sm text-[#C8C8C0]">{stats.totalXP} XP</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onBack} 
            className="w-full bg-[#007AFF] hover:bg-[#0056CC] text-white font-semibold px-6 py-4 rounded-xl transition-colors"
          >
            მთავარ მენიუში დაბრუნება
          </button>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-[#C8C8C0] mb-4">ბარათები არ მოიძებნა</p>
          <button onClick={onBack} className="text-[#007AFF]">← უკან</button>
        </div>
      </div>
    );
  }

  const questionSide = getQuestionSide();
  const answerSide = getAnswerSide();

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <button 
          onClick={onBack} 
          className="text-[#C8C8C0] hover:text-white transition-colors"
        >
          ← უკან
        </button>
        
        <span className="text-sm text-[#C8C8C0]">
          {currentIndex + 1}/{studyCards.length}
        </span>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-[#C8C8C0] hover:text-white transition-colors"
        >
          ⚙️
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-[#242426] mx-4 rounded-xl p-4 mb-4">
          <h3 className="font-bold mb-3">პარამეტრები</h3>
          
          {/* Card Direction */}
          <div className="mb-3">
            <label className="block text-sm text-[#C8C8C0] mb-2">ბარათის მიმართულება</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCardDirection('english-to-georgian')}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  settings.cardDirection === 'english-to-georgian'
                    ? 'bg-[#007AFF] text-white'
                    : 'bg-[#1C1C1E] text-[#C8C8C0]'
                }`}
              >
                🇬🇧 → 🇬🇪
              </button>
              <button
                onClick={() => setCardDirection('georgian-to-english')}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  settings.cardDirection === 'georgian-to-english'
                    ? 'bg-[#007AFF] text-white'
                    : 'bg-[#1C1C1E] text-[#C8C8C0]'
                }`}
              >
                🇬🇪 → 🇬🇧
              </button>
            </div>
          </div>

          {/* Study Mode */}
          <div className="mb-3">
            <label className="block text-sm text-[#C8C8C0] mb-2">სწავლის რეჟიმი</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setStudyMode('flip')}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  settings.studyMode === 'flip'
                    ? 'bg-[#007AFF] text-white'
                    : 'bg-[#1C1C1E] text-[#C8C8C0]'
                }`}
              >
                🔄 ბრუნვა
              </button>
              <button
                onClick={() => setStudyMode('type')}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  settings.studyMode === 'type'
                    ? 'bg-[#007AFF] text-white'
                    : 'bg-[#1C1C1E] text-[#C8C8C0]'
                }`}
              >
                ⌨️ ტაიპინგი
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="px-4 mb-6">
        <div className="h-2 bg-[#242426] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#007AFF] rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / studyCards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="px-4">
        <div
          ref={cardRef}
          onClick={handleCardClick}
          className={`bg-[#242426] rounded-3xl p-8 min-h-[320px] flex flex-col items-center justify-center transition-all ${
            settings.studyMode === 'flip' ? 'cursor-pointer hover:bg-[#2A2A2C]' : ''
          } ${feedbackColor === 'green' ? 'ring-2 ring-[#34C759]' : ''} ${
            feedbackColor === 'red' ? 'ring-2 ring-[#FF453A]' : ''
          }`}
        >
          {/* Question Side */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold mb-2">{questionSide.text}</div>
            {questionSide.pronunciation && (
              <div className="text-[#C8C8C0] text-sm mb-4">/{questionSide.pronunciation}/</div>
            )}
            
            {/* Audio button for question side */}
            {settings.cardDirection === 'english-to-georgian' && (
              <button
                onClick={(e) => { e.stopPropagation(); speak(card.english); }}
                className="text-2xl hover:scale-110 transition-transform"
                title="მოისმინე გამოთქმა"
              >
                🔊
              </button>
            )}
          </div>

          {/* Answer/Input Section */}
          {settings.studyMode === 'type' ? (
            <div className="w-full max-w-sm">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTypeAnswer()}
                placeholder="თქვენი პასუხი..."
                className="w-full bg-[#1C1C1E] text-white px-4 py-3 rounded-xl border border-[#3A3A3C] focus:border-[#007AFF] outline-none text-center"
                disabled={showAnswer}
              />
              
              {!showAnswer ? (
                <button
                  onClick={handleTypeAnswer}
                  disabled={userInput.trim() === ''}
                  className="w-full mt-3 bg-[#007AFF] hover:bg-[#0056CC] disabled:bg-[#1C1C1E] disabled:text-[#666] text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  შემოწმება
                </button>
              ) : (
                <div className="mt-4 text-center">
                  <div className={`text-lg font-bold ${feedbackColor === 'green' ? 'text-[#34C759]' : 'text-[#FF453A]'}`}>
                    {feedbackColor === 'green' ? '✓ სწორია!' : '✗ არასწორია'}
                  </div>
                  <div className="text-[#C8C8C0] mt-2">
                    სწორი პასუხი: <span className="text-white font-medium">{answerSide.text}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Flip mode
            <>
              {!flipped && (
                <div className="text-[#C8C8C0] text-sm animate-pulse">
                  შეეხე თარგმანის სანახავად 👆
                </div>
              )}

              {flipped && (
                <div className="text-center animate-[fadeIn_0.3s_ease-in]">
                  <div className="text-2xl font-bold text-[#007AFF] mb-3">
                    {answerSide.text}
                  </div>
                  {answerSide.pronunciation && (
                    <div className="text-[#C8C8C0] text-sm mb-4">
                      /{answerSide.pronunciation}/
                    </div>
                  )}
                  
                  {/* Example sentences */}
                  {card.example_en && (
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <div className="text-sm text-[#C8C8C0] mb-1 flex items-center justify-center gap-2">
                        <span>📖 {card.example_en}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); speak(card.example_en); }}
                          className="text-base hover:scale-110 transition-transform"
                        >🔊</button>
                      </div>
                      <div className="text-sm text-[#C8C8C0]">📖 {card.example_ka}</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Rating Buttons for Flip Mode */}
        {flipped && settings.studyMode === 'flip' && (
          <div className="mt-6 grid grid-cols-4 gap-3">
            <button
              onClick={() => handleRateAnswer(1)}
              className="bg-[#FF453A] hover:bg-[#FF3B30] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              😕 თავიდან
            </button>
            <button
              onClick={() => handleRateAnswer(2)}
              className="bg-[#FF9500] hover:bg-[#FF8C00] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              🤔 რთული
            </button>
            <button
              onClick={() => handleRateAnswer(3)}
              className="bg-[#34C759] hover:bg-[#32D74B] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              😄 კარგი
            </button>
            <button
              onClick={() => handleRateAnswer(4)}
              className="bg-[#007AFF] hover:bg-[#0056CC] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              🚀 მარტივი
            </button>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="bg-[#242426] rounded-xl p-3 flex justify-between items-center text-sm">
          <div className="text-[#FF9500]">
            +{session.xpEarned} XP
          </div>
          <div className="text-[#34C759]">
            {session.correctAnswers}/{session.cardsReviewed}
          </div>
          <div className="text-[#FF6B00]">
            {getUserStats().currentStreak}🔥
          </div>
        </div>
      </div>
    </div>
  );
}