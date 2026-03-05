import { useState, useMemo } from 'react';
import { getDailyHistory, type DailyActivity } from '../lib/gamification';

type Metric = 'xp' | 'cards' | 'minutes';

const METRIC_CONFIG: Record<Metric, { label: string; color: string; gradient: string; icon: string }> = {
  xp: { label: 'XP', color: '#22c55e', gradient: 'rgba(34,197,94,0.15)', icon: '⭐' },
  cards: { label: 'ბარათები', color: '#3b82f6', gradient: 'rgba(59,130,246,0.15)', icon: '📝' },
  minutes: { label: 'წუთები', color: '#f59e0b', gradient: 'rgba(245,158,11,0.15)', icon: '⏱️' },
};

export default function ProgressChart() {
  const [metric, setMetric] = useState<Metric>('xp');
  const [days, setDays] = useState(14);

  const history = useMemo(() => getDailyHistory(days), [days]);
  const config = METRIC_CONFIG[metric];

  // Compute cumulative data
  const data = useMemo(() => {
    let cumulative = 0;
    return history.map(day => {
      const val = day[metric];
      cumulative += val;
      return { ...day, value: val, cumulative };
    });
  }, [history, metric]);

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const totalVal = data.reduce((s, d) => s + d.value, 0);
  const avgVal = Math.round(totalVal / data.length);

  // SVG chart dimensions
  const W = 320;
  const H = 140;
  const PAD_X = 5;
  const PAD_Y = 10;
  const chartW = W - PAD_X * 2;
  const chartH = H - PAD_Y * 2;

  // Build SVG path
  const points = data.map((d, i) => {
    const x = PAD_X + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = PAD_Y + chartH - (d.value / maxVal) * chartH;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${(PAD_X + chartW).toFixed(1)},${(PAD_Y + chartH).toFixed(1)} L${PAD_X},${(PAD_Y + chartH).toFixed(1)} Z`;

  // Active days
  const activeDays = data.filter(d => d.value > 0).length;

  return (
    <div className="bg-[var(--color-card,var(--color-bg-card))] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          📈 პროგრესის გრაფიკი
        </h2>
        {/* Period toggle */}
        <div className="flex gap-1">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                days === d
                  ? 'bg-white/15 text-[var(--color-text)] font-bold'
                  : 'text-[var(--color-text-muted)] hover:bg-white/5'
              }`}
            >
              {d}დ
            </button>
          ))}
        </div>
      </div>

      {/* Metric toggle */}
      <div className="flex gap-2 mb-4">
        {(Object.keys(METRIC_CONFIG) as Metric[]).map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all ${
              metric === m
                ? 'font-bold border-2'
                : 'bg-white/5 text-[var(--color-text-muted)] border-2 border-transparent hover:bg-white/10'
            }`}
            style={metric === m ? { 
              background: METRIC_CONFIG[m].gradient, 
              color: METRIC_CONFIG[m].color,
              borderColor: METRIC_CONFIG[m].color + '40',
            } : undefined}
          >
            {METRIC_CONFIG[m].icon} {METRIC_CONFIG[m].label}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center bg-white/5 rounded-lg p-2">
          <div className="text-lg font-bold" style={{ color: config.color }}>{totalVal}</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">ჯამი</div>
        </div>
        <div className="text-center bg-white/5 rounded-lg p-2">
          <div className="text-lg font-bold" style={{ color: config.color }}>{avgVal}</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">საშუალო/დღე</div>
        </div>
        <div className="text-center bg-white/5 rounded-lg p-2">
          <div className="text-lg font-bold" style={{ color: config.color }}>{activeDays}/{days}</div>
          <div className="text-[10px] text-[var(--color-text-muted)]">აქტიური დღე</div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="bg-white/5 rounded-lg p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '140px' }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(frac => (
            <line
              key={frac}
              x1={PAD_X} y1={PAD_Y + chartH * (1 - frac)}
              x2={PAD_X + chartW} y2={PAD_Y + chartH * (1 - frac)}
              stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
            />
          ))}
          
          {/* Area fill */}
          <path d={areaPath} fill={config.gradient} />
          
          {/* Line */}
          <path d={linePath} fill="none" stroke={config.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Data points */}
          {points.map((p, i) => (
            data[i].value > 0 && (
              <circle
                key={i}
                cx={p.x} cy={p.y}
                r="3"
                fill={config.color}
                stroke="var(--color-bg-card,#242426)"
                strokeWidth="1.5"
              />
            )
          ))}
          
          {/* Baseline */}
          <line
            x1={PAD_X} y1={PAD_Y + chartH}
            x2={PAD_X + chartW} y2={PAD_Y + chartH}
            stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"
          />
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between px-1 mt-1">
          {data.filter((_, i) => {
            // Show first, last, and evenly spaced labels
            if (days <= 7) return true;
            if (days <= 14) return i % 2 === 0 || i === data.length - 1;
            return i % 5 === 0 || i === data.length - 1;
          }).map((d, i) => {
            const date = new Date(d.date);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <span key={i} className={`text-[9px] ${isToday ? 'text-green-400 font-bold' : 'text-[var(--color-text-muted)]'}`}>
                {isToday ? 'დღეს' : `${date.getDate()}/${date.getMonth() + 1}`}
              </span>
            );
          })}
        </div>
      </div>

      {/* No data message */}
      {totalVal === 0 && (
        <div className="text-center text-sm text-[var(--color-text-muted)] mt-3">
          📊 დაიწყე სწავლა და გრაფიკი შეივსება!
        </div>
      )}
    </div>
  );
}
