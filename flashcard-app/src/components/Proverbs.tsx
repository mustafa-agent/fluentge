import { useState, useMemo } from 'react';

interface Proverb {
  english: string;
  meaning: string;
  georgian: string;
  georgianEquivalent?: string;
  example: string;
}

const proverbs: Proverb[] = [
  { english: "Actions speak louder than words.", meaning: "What you do matters more than what you say.", georgian: "საქმე სიტყვაზე მეტს ამბობს.", georgianEquivalent: "სიტყვა სიტყვაა, საქმე — საქმე.", example: "He promised to help, but never showed up. Actions speak louder than words." },
  { english: "Don't judge a book by its cover.", meaning: "Don't form opinions based on appearance alone.", georgian: "ნუ განსჯი წიგნს ყდით.", example: "The restaurant looked old, but the food was amazing. Don't judge a book by its cover." },
  { english: "The early bird catches the worm.", meaning: "Those who start early have an advantage.", georgian: "ადრე მოსულს ადრე ეგებება.", example: "I arrived first at the sale and got the best deals. The early bird catches the worm." },
  { english: "When in Rome, do as the Romans do.", meaning: "Adapt to local customs when visiting somewhere.", georgian: "რომში რომაელებივით მოიქეცი.", example: "In Japan, we took off our shoes indoors. When in Rome, do as the Romans do." },
  { english: "Practice makes perfect.", meaning: "Repeating something makes you better at it.", georgian: "ვარჯიში სრულყოფილებას იძლევა.", example: "She practiced piano every day for a year and now plays beautifully. Practice makes perfect." },
  { english: "Better late than never.", meaning: "It's better to do something late than not at all.", georgian: "გვიან ჯობია არასდროს.", example: "He finally started exercising at 50. Better late than never!" },
  { english: "Two heads are better than one.", meaning: "Working together is more effective.", georgian: "ორი თავი ერთზე ჯობია.", example: "Let's solve this problem together. Two heads are better than one." },
  { english: "Rome wasn't built in a day.", meaning: "Important things take time.", georgian: "რომი ერთ დღეში არ აშენებულა.", example: "Learning English takes time. Rome wasn't built in a day." },
  { english: "Every cloud has a silver lining.", meaning: "Something good can come from a bad situation.", georgian: "ყოველ ღრუბელს ვერცხლის ფენა აქვს.", example: "I lost my job but found a better one. Every cloud has a silver lining." },
  { english: "A penny saved is a penny earned.", meaning: "Saving money is just as valuable as earning it.", georgian: "დაზოგილი თეთრი მოგებული თეთრია.", example: "Instead of buying coffee, I make it at home. A penny saved is a penny earned." },
  { english: "Don't put all your eggs in one basket.", meaning: "Don't risk everything on a single plan.", georgian: "ყველა კვერცხს ერთ კალათაში ნუ ჩადებ.", example: "I invested in three different companies. Don't put all your eggs in one basket." },
  { english: "Where there's a will, there's a way.", meaning: "Determination will help you find a solution.", georgian: "სადაც ნება არის, გზაც იქნება.", example: "Despite all obstacles, she graduated. Where there's a will, there's a way." },
  { english: "The pen is mightier than the sword.", meaning: "Words and ideas are more powerful than force.", georgian: "კალამი ხმალზე ძლიერია.", example: "Great writers change the world. The pen is mightier than the sword." },
  { english: "You can't have your cake and eat it too.", meaning: "You can't have two incompatible things at once.", georgian: "ტორტსაც ვერ შეინახავ და ვერც შეჭამ.", example: "You want to save money but also buy everything? You can't have your cake and eat it too." },
  { english: "Honesty is the best policy.", meaning: "Being truthful is always the best approach.", georgian: "პატიოსნება საუკეთესო პოლიტიკაა.", example: "I told my boss the truth about my mistake. Honesty is the best policy." },
  { english: "No pain, no gain.", meaning: "You need to work hard to achieve results.", georgian: "ტკივილის გარეშე მიღწევა არ არის.", example: "The workout was tough, but I'm getting stronger. No pain, no gain." },
  { english: "Curiosity killed the cat.", meaning: "Being too nosy can lead to trouble.", georgian: "ცნობისმოყვარეობამ კატა მოკლა.", example: "Stop asking so many personal questions. Curiosity killed the cat." },
  { english: "An apple a day keeps the doctor away.", meaning: "Healthy habits prevent illness.", georgian: "დღეში ერთი ვაშლი ექიმს შორს გაგიჩერებს.", example: "I eat fruit every morning. An apple a day keeps the doctor away." },
  { english: "Don't cry over spilled milk.", meaning: "Don't waste time being upset about things you can't change.", georgian: "დაღვრილ რძეზე ნუ იტირებ.", example: "The vase broke but we can buy a new one. Don't cry over spilled milk." },
  { english: "The grass is always greener on the other side.", meaning: "Other people's situations always seem better than yours.", georgian: "ბალახი მეორე მხარეს ყოველთვის უფრო მწვანეა.", example: "He envies his neighbor's life, but he has problems too. The grass is always greener on the other side." },
  { english: "You reap what you sow.", meaning: "Your actions determine your results.", georgian: "რასაც დათესავ, იმას მოიმკი.", example: "He was kind to everyone and now everyone helps him. You reap what you sow." },
  { english: "Time is money.", meaning: "Don't waste time because it's valuable.", georgian: "დრო ფულია.", example: "Stop procrastinating and start working. Time is money." },
  { english: "Knowledge is power.", meaning: "Education and learning give you advantages.", georgian: "ცოდნა ძალაა.", example: "The more you learn, the more opportunities you have. Knowledge is power." },
  { english: "Birds of a feather flock together.", meaning: "People with similar interests tend to group together.", georgian: "ერთი ბუმბულის ფრინველები ერთად დაფრინავენ.", example: "All the tech enthusiasts sit together at lunch. Birds of a feather flock together." },
];

export default function Proverbs({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [learnIdx, setLearnIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const quizQuestions = useMemo(() => {
    const shuffled = [...proverbs].sort(() => Math.random() - 0.5).slice(0, 10);
    return shuffled.map(p => {
      const others = proverbs.filter(o => o.english !== p.english).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [p, ...others].sort(() => Math.random() - 0.5);
      return { proverb: p, options };
    });
  }, [mode]); // eslint-disable-line

  const quizDone = quizIdx >= quizQuestions.length;

  if (mode === 'learn') {
    const p = proverbs[learnIdx];
    return (
      <div className="px-4 py-8 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
          <button onClick={() => { setMode('quiz'); setQuizIdx(0); setQuizScore(0); setSelected(null); }}
            className="text-sm px-3 py-1 bg-white/10 rounded-lg">🧠 ქვიზი</button>
        </div>
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📜</div>
          <h2 className="text-xl font-bold">ანდაზები</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Proverbs & Wisdom • {learnIdx + 1}/{proverbs.length}</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-4">
          <p className="text-xl font-bold text-center mb-4 leading-relaxed">"{p.english}"</p>
          
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="w-full py-3 bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 rounded-xl text-[var(--color-primary)] font-medium">
              👆 დააჭირე მნიშვნელობისთვის • Tap to reveal
            </button>
          ) : (
            <div className="space-y-3 animate-[fadeIn_0.3s]">
              <div className="bg-blue-500/10 rounded-xl p-3">
                <p className="text-xs text-blue-400 mb-1">💡 Meaning:</p>
                <p className="text-sm">{p.meaning}</p>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-3">
                <p className="text-xs text-purple-400 mb-1">🇬🇪 ქართულად:</p>
                <p className="text-sm">{p.georgian}</p>
                {p.georgianEquivalent && <p className="text-xs text-[var(--color-text-muted)] mt-1">ქართული ანდაზა: {p.georgianEquivalent}</p>}
              </div>
              <div className="bg-green-500/10 rounded-xl p-3">
                <p className="text-xs text-green-400 mb-1">📝 Example:</p>
                <p className="text-sm italic">{p.example}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setLearnIdx(i => Math.max(0, i - 1)); setRevealed(false); }}
            disabled={learnIdx === 0}
            className="flex-1 py-3 bg-white/10 rounded-xl disabled:opacity-30">← წინა</button>
          <button onClick={() => { setLearnIdx(i => Math.min(proverbs.length - 1, i + 1)); setRevealed(false); }}
            disabled={learnIdx === proverbs.length - 1}
            className="flex-1 py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold disabled:opacity-30">შემდეგი →</button>
        </div>
      </div>
    );
  }

  // Quiz mode
  if (quizDone) {
    return (
      <div className="px-4 py-8 max-w-lg mx-auto text-center">
        <div className="text-5xl mb-4">{quizScore >= 8 ? '🏆' : quizScore >= 5 ? '👍' : '📚'}</div>
        <h2 className="text-2xl font-bold mb-2">შედეგი</h2>
        <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">{quizScore}/{quizQuestions.length}</p>
        <p className="text-[var(--color-text-muted)] mb-6">
          {quizScore >= 8 ? 'ანდაზების ოსტატი! Proverb master!' : quizScore >= 5 ? 'კარგია! Good job!' : 'ისწავლე მეტი! Learn more!'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setMode('learn'); setLearnIdx(0); setRevealed(false); }}
            className="px-6 py-3 bg-white/10 rounded-xl">📖 სწავლა</button>
          <button onClick={() => { setQuizIdx(0); setQuizScore(0); setSelected(null); }}
            className="px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold">🔄 თავიდან</button>
          <button onClick={onBack} className="px-6 py-3 bg-white/10 rounded-xl">უკან</button>
        </div>
      </div>
    );
  }

  const q = quizQuestions[quizIdx];

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-white">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">{quizIdx + 1}/{quizQuestions.length} | ქულა: {quizScore}</span>
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-[var(--color-text-muted)] mb-2">რას ნიშნავს? • What does it mean?</p>
        <p className="text-lg font-bold">"{q.proverb.english}"</p>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isAnswer = opt.english === q.proverb.english;
          const isSelected = selected === i;
          let bg = 'bg-white/5 border-white/10';
          if (selected !== null) {
            if (isAnswer) bg = 'bg-green-500/20 border-green-500/30';
            else if (isSelected && !isAnswer) bg = 'bg-red-500/20 border-red-500/30';
          }
          return (
            <button key={i} disabled={selected !== null}
              onClick={() => { setSelected(i); if (isAnswer) setQuizScore(s => s + 1); }}
              className={`w-full p-4 rounded-xl border ${bg} text-left transition-colors`}>
              <p className="text-sm">{opt.meaning}</p>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-4 space-y-3">
          <div className="bg-white/5 rounded-xl p-3 text-sm">
            <p>🇬🇪 {q.proverb.georgian}</p>
          </div>
          <button onClick={() => { setQuizIdx(i => i + 1); setSelected(null); }}
            className="w-full py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold">
            შემდეგი →
          </button>
        </div>
      )}
    </div>
  );
}
