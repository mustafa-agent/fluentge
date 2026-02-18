import { useState, useEffect } from 'react';
import { getStats, getAllProgress } from '../lib/storage';

interface Props {
  onBack: () => void;
}

function getWeeklyData(): number[] {
  const progress = getAllProgress();
  const now = new Date();
  const weeks = [0, 0, 0, 0]; // last 4 weeks

  Object.values(progress).forEach((p: any) => {
    if (!p.lastReview) return;
    const reviewDate = new Date(p.lastReview);
    const diffDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
    const weekIdx = Math.floor(diffDays / 7);
    if (weekIdx >= 0 && weekIdx < 4) {
      weeks[weekIdx]++;
    }
  });

  return weeks.reverse(); // oldest first
}

export default function ProgressDashboard({ onBack }: Props) {
  const [stats, setStats] = useState(getStats());
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0]);
  const [totalCards, setTotalCards] = useState(0);

  useEffect(() => {
    setStats(getStats());
    setWeeklyData(getWeeklyData());
    const progress = getAllProgress();
    setTotalCards(Object.keys(progress).length);
  }, []);

  const accuracy = stats.totalReviews > 0
    ? Math.round((stats.correctReviews / stats.totalReviews) * 100)
    : 0;

  const maxWeekly = Math.max(...weeklyData, 1);
  const weekLabels = ['3 კვ. წინ', '2 კვ. წინ', 'წინა კვირა', 'ეს კვირა'];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
          ← უკან
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="text-4xl mb-2">📊</div>
        <h2 className="text-2xl font-bold">პროგრესის დაფა</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-[var(--color-primary)]">{stats.wordsLearned}</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">ნასწავლი სიტყვები</div>
        </div>
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-orange-400">{stats.streak}</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">დღის სტრიქი 🔥</div>
        </div>
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">სიზუსტე</div>
        </div>
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{totalCards}</div>
          <div className="text-sm text-[var(--color-text-muted)] mt-1">გამეორებული ბარათები</div>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-center">ბოლო 4 კვირის აქტივობა</h3>
        <div className="flex items-end justify-around gap-2" style={{ height: '140px' }}>
          {weeklyData.map((val, i) => (
            <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">{val}</div>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${Math.max((val / maxWeekly) * 100, 4)}%`,
                  background: 'var(--color-primary)',
                  minHeight: '4px',
                }}
              />
              <div className="text-xs text-[var(--color-text-muted)] mt-2 text-center whitespace-nowrap">
                {weekLabels[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Reviews */}
      <div className="mt-6 bg-[var(--color-bg-card)] rounded-xl p-4 text-center">
        <div className="text-sm text-[var(--color-text-muted)]">სულ გამეორებები</div>
        <div className="text-2xl font-bold mt-1">{stats.totalReviews}</div>
        <div className="text-xs text-[var(--color-text-muted)] mt-1">
          {stats.correctReviews} სწორი · {stats.totalReviews - stats.correctReviews} არასწორი
        </div>
      </div>
    </div>
  );
}
