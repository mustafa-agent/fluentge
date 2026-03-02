import { useState } from 'react';
import { setDailyGoal } from '../lib/gamification';

interface Props {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState(10);

  const paths = [
    { id: 'words', icon: '📚', label: 'სიტყვები', desc: 'ისწავლე ახალი სიტყვები ბარათებით', color: 'sky' },
    { id: 'grammar', icon: '📝', label: 'გრამატიკა', desc: 'ისწავლე ინგლისური გრამატიკა', color: 'purple' },
    { id: 'games', icon: '🎮', label: 'თამაშები', desc: 'ისწავლე სახალისო თამაშებით', color: 'green' },
  ];

  const goals = [
    { mins: 5, label: 'მსუბუქი', emoji: '🌱', desc: '5 წუთი/დღე' },
    { mins: 10, label: 'ჩვეული', emoji: '📖', desc: '10 წუთი/დღე' },
    { mins: 15, label: 'სერიოზული', emoji: '🔥', desc: '15 წუთი/დღე' },
    { mins: 20, label: 'ინტენსიური', emoji: '💪', desc: '20 წუთი/დღე' },
    { mins: 30, label: 'ჩემპიონი', emoji: '🏆', desc: '30 წუთი/დღე' },
  ];

  function handleFinish() {
    setDailyGoal(selectedGoal);
    localStorage.setItem('fluentge-onboarded', 'true');
    if (selectedPath) {
      localStorage.setItem('fluentge-path', selectedPath);
    }
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[var(--color-bg-card)] rounded-3xl max-w-md w-full border border-white/10 shadow-2xl overflow-hidden onboarding-modal">
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-5 pb-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-sky-500' : i < step ? 'w-2 bg-sky-500/50' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="p-6 pt-4">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center onboarding-step">
              <div className="text-6xl mb-4 animate-bounce">👋</div>
              <h2 className="text-2xl font-extrabold mb-2">მოგესალმებით!</h2>
              <p className="text-[var(--color-text-muted)] mb-2">
                FluentGe — საუკეთესო გზა ინგლისურის სასწავლად
              </p>
              <div className="flex items-center justify-center gap-3 my-5">
                <div className="flex items-center gap-1.5 text-sm text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full">
                  <span>✅</span> უფასო
                </div>
                <div className="flex items-center gap-1.5 text-sm text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-full">
                  <span>🇬🇪</span> ქართულად
                </div>
                <div className="flex items-center gap-1.5 text-sm text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
                  <span>🎮</span> სახალისო
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-sky-500 border-b-4 border-sky-600 active:border-b-0 active:mt-1 transition-all text-base uppercase tracking-wide"
              >
                დავიწყოთ! 🚀
              </button>
            </div>
          )}

          {/* Step 1: Choose path */}
          {step === 1 && (
            <div className="onboarding-step">
              <h2 className="text-xl font-extrabold text-center mb-1">რით გინდა დაიწყო?</h2>
              <p className="text-sm text-[var(--color-text-muted)] text-center mb-5">აირჩიე შენი გზა</p>
              
              <div className="space-y-3 mb-5">
                {paths.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPath(p.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-b-4 transition-all active:border-b-0 active:mt-1 text-left ${
                      selectedPath === p.id
                        ? p.color === 'sky' ? 'bg-sky-500/20 border-sky-500/40 ring-2 ring-sky-500/50'
                        : p.color === 'purple' ? 'bg-purple-500/20 border-purple-500/40 ring-2 ring-purple-500/50'
                        : 'bg-green-500/20 border-green-500/40 ring-2 ring-green-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-3xl">{p.icon}</span>
                    <div>
                      <div className="font-bold text-base">{p.label}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{p.desc}</div>
                    </div>
                    {selectedPath === p.id && (
                      <span className="ml-auto text-green-400 text-xl">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="py-3 px-5 rounded-xl font-bold bg-white/10 border-b-4 border-white/5 active:border-b-0 active:mt-1 transition-all text-sm"
                >
                  ←
                </button>
                <button
                  onClick={() => selectedPath && setStep(2)}
                  disabled={!selectedPath}
                  className={`flex-1 py-3 rounded-xl font-bold border-b-4 active:border-b-0 active:mt-1 transition-all text-sm uppercase tracking-wide ${
                    selectedPath
                      ? 'bg-sky-500 border-sky-600 text-white'
                      : 'bg-white/10 border-white/5 text-[var(--color-text-muted)] cursor-not-allowed'
                  }`}
                >
                  შემდეგი →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Daily goal */}
          {step === 2 && (
            <div className="onboarding-step">
              <h2 className="text-xl font-extrabold text-center mb-1">🎯 დღის მიზანი</h2>
              <p className="text-sm text-[var(--color-text-muted)] text-center mb-5">რამდენ ხანს ისწავლი ყოველ დღე?</p>
              
              <div className="space-y-2 mb-5">
                {goals.map(g => (
                  <button
                    key={g.mins}
                    onClick={() => setSelectedGoal(g.mins)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-b-4 transition-all active:border-b-0 active:mt-1 ${
                      selectedGoal === g.mins
                        ? 'bg-green-500/20 border-green-500/40 ring-2 ring-green-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <div className="flex-1 text-left">
                      <span className="font-bold">{g.label}</span>
                      <span className="text-xs text-[var(--color-text-muted)] ml-2">{g.desc}</span>
                    </div>
                    {selectedGoal === g.mins && (
                      <span className="text-green-400 text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-5 rounded-xl font-bold bg-white/10 border-b-4 border-white/5 active:border-b-0 active:mt-1 transition-all text-sm"
                >
                  ←
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-green-500 border-b-4 border-green-600 active:border-b-0 active:mt-1 transition-all text-base uppercase tracking-wide"
                >
                  დაწყება! 🎉
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
