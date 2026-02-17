import { getStats } from '../lib/storage';

export default function StatsBar() {
  const stats = getStats();
  const accuracy = stats.totalReviews > 0 ? Math.round((stats.correctReviews / stats.totalReviews) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3 px-4 py-4 max-w-lg mx-auto">
      <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
        <div className="text-2xl font-bold text-[var(--color-primary)]">{stats.wordsLearned}</div>
        <div className="text-xs text-[var(--color-text-muted)]">ნასწავლი</div>
      </div>
      <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
        <div className="text-2xl font-bold text-[var(--color-primary)]">🔥 {stats.streak}</div>
        <div className="text-xs text-[var(--color-text-muted)]">სერია</div>
      </div>
      <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
        <div className="text-2xl font-bold text-[var(--color-primary)]">{accuracy}%</div>
        <div className="text-xs text-[var(--color-text-muted)]">სიზუსტე</div>
      </div>
    </div>
  );
}
