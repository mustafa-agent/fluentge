import { useState } from 'react';

interface SoundGroup {
  title: string;
  titleKa: string;
  description: string;
  descriptionKa: string;
  sounds: { symbol: string; examples: string[]; tip: string; tipKa: string }[];
}

const soundGroups: SoundGroup[] = [
  {
    title: 'Vowel Sounds',
    titleKa: 'ხმოვანი ბგერები',
    description: 'English has more vowel sounds than Georgian. These are the tricky ones.',
    descriptionKa: 'ინგლისურში ქართულზე მეტი ხმოვანი ბგერაა. ეს არის რთულები.',
    sounds: [
      { symbol: '/æ/', examples: ['cat', 'bad', 'man', 'hand'], tip: 'Open your mouth wide, like between "ე" and "ა"', tipKa: 'გააღე პირი ფართოდ, "ე"-სა და "ა"-ს შორის' },
      { symbol: '/ɪ/', examples: ['sit', 'big', 'fish', 'kit'], tip: 'Short and relaxed, NOT the same as "ი"', tipKa: 'მოკლე და მოდუნებული, არ არის "ი"-ს იდენტური' },
      { symbol: '/iː/', examples: ['see', 'key', 'team', 'beach'], tip: 'Long "ee" sound, stretch it out', tipKa: 'გრძელი "ი" ბგერა, გაწელე' },
      { symbol: '/ʌ/', examples: ['cup', 'bus', 'run', 'love'], tip: 'Short "ah" sound, mouth barely open', tipKa: 'მოკლე "ა" ბგერა, პირი ოდნავ გახსნილი' },
      { symbol: '/ɜː/', examples: ['bird', 'word', 'nurse', 'turn'], tip: 'No Georgian equivalent! Round your lips slightly', tipKa: 'ქართულში არ არსებობს! ტუჩები ოდნავ მომრგვალე' },
    ]
  },
  {
    title: 'Consonant Challenges',
    titleKa: 'თანხმოვანი გამოწვევები',
    description: 'Sounds that don\'t exist in Georgian or work differently.',
    descriptionKa: 'ბგერები, რომლებიც ქართულში არ არსებობს ან სხვანაირად მუშაობს.',
    sounds: [
      { symbol: '/θ/', examples: ['think', 'three', 'bath', 'math'], tip: 'Put tongue between teeth! Not "t" or "s"', tipKa: 'ენა კბილებს შორის! არც "თ" და არც "ს"' },
      { symbol: '/ð/', examples: ['this', 'the', 'that', 'mother'], tip: 'Like /θ/ but with voice vibration', tipKa: '/θ/-ის მსგავსი, მაგრამ ხმის ვიბრაციით' },
      { symbol: '/w/', examples: ['water', 'we', 'want', 'away'], tip: 'Round your lips into a small "O" first', tipKa: 'ჯერ ტუჩები პატარა "ო"-ში მომრგვალე' },
      { symbol: '/r/', examples: ['red', 'run', 'right', 'car'], tip: 'DON\'T roll it like Georgian "რ"! Curl tongue back', tipKa: 'არ ატრიალო ქართული "რ"-ის მსგავსად! ენა უკან მოახვიე' },
      { symbol: '/v/ vs /w/', examples: ['vine/wine', 'vet/wet', 'vest/west'], tip: '/v/ = teeth on lip. /w/ = round lips, no teeth', tipKa: '/v/ = კბილი ტუჩზე. /w/ = მრგვალი ტუჩები, კბილის გარეშე' },
    ]
  },
  {
    title: 'Word Stress',
    titleKa: 'სიტყვის მახვილი',
    description: 'English stress changes word meaning! Georgian stress is more even.',
    descriptionKa: 'ინგლისურში მახვილი სიტყვის მნიშვნელობას ცვლის!',
    sounds: [
      { symbol: 'RE-cord', examples: ['REcord (noun)', 'reCORD (verb)'], tip: 'Noun = stress on 1st syllable. Verb = stress on 2nd', tipKa: 'არსებითი = მახვილი 1-ელ მარცვალზე. ზმნა = მე-2-ეზე' },
      { symbol: 'PRE-sent', examples: ['PREsent (gift)', 'preSENT (to show)'], tip: 'Same word, different stress = different meaning!', tipKa: 'ერთი სიტყვა, სხვა მახვილი = სხვა მნიშვნელობა!' },
      { symbol: 'PER-mit', examples: ['PERmit (noun)', 'perMIT (verb)'], tip: 'Practice saying both versions', tipKa: 'ივარჯიშე ორივე ვერსიის თქმაზე' },
      { symbol: 'CON-duct', examples: ['CONduct (behavior)', 'conDUCT (to lead)'], tip: 'Listen carefully to native speakers', tipKa: 'ყურადღებით მოუსმინე მშობლიურ მოლაპარაკეებს' },
      { symbol: 'OB-ject', examples: ['OBject (thing)', 'obJECT (to disagree)'], tip: 'This pattern is very common in English', tipKa: 'ეს ნიმუში ძალიან გავრცელებულია ინგლისურში' },
    ]
  },
  {
    title: 'Silent Letters',
    titleKa: 'მუნჯი ასოები',
    description: 'English spelling is crazy — many letters are silent!',
    descriptionKa: 'ინგლისური მართლწერა გიჟურია — ბევრი ასო მუნჯია!',
    sounds: [
      { symbol: 'silent K', examples: ['knife', 'know', 'knee', 'knock'], tip: 'Never pronounce K before N', tipKa: 'K არასდროს წარმოთქვა N-ის წინ' },
      { symbol: 'silent W', examples: ['write', 'wrong', 'wrap', 'wrist'], tip: 'W is silent before R', tipKa: 'W მუნჯია R-ის წინ' },
      { symbol: 'silent B', examples: ['climb', 'comb', 'thumb', 'lamb'], tip: 'B is silent after M at word end', tipKa: 'B მუნჯია M-ის შემდეგ სიტყვის ბოლოს' },
      { symbol: 'silent GH', examples: ['night', 'light', 'thought', 'daughter'], tip: 'GH is usually silent in the middle/end', tipKa: 'GH ჩვეულებრივ მუნჯია შუაში/ბოლოს' },
      { symbol: 'silent L', examples: ['walk', 'talk', 'half', 'calm'], tip: 'L is silent in these common words', tipKa: 'L მუნჯია ამ გავრცელებულ სიტყვებში' },
    ]
  },
];

export default function PronunciationGuide({ onBack }: { onBack: () => void }) {
  const [groupIdx, setGroupIdx] = useState(0);
  const [expandedSound, setExpandedSound] = useState<number | null>(null);

  const group = soundGroups[groupIdx];

  function speak(text: string, rate = 0.8) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[var(--color-text-muted)]">← უკან</button>
        <span className="text-sm text-[var(--color-text-muted)]">{groupIdx + 1}/{soundGroups.length}</span>
      </div>

      <h2 className="text-xl font-bold mb-2 text-center">🔊 წარმოთქმის გზამკვლევი</h2>

      {/* Group tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {soundGroups.map((g, i) => (
          <button
            key={i}
            onClick={() => { setGroupIdx(i); setExpandedSound(null); }}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${i === groupIdx ? 'bg-[var(--color-primary)] text-black' : 'bg-[var(--color-bg-card)]'}`}
          >
            {g.titleKa}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 mb-4">
        <h3 className="font-bold text-lg">{group.title}</h3>
        <p className="text-sm text-[var(--color-text-muted)]">{group.descriptionKa}</p>
      </div>

      <div className="space-y-3">
        {group.sounds.map((s, i) => (
          <div key={i} className="bg-[var(--color-bg-card)] rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedSound(expandedSound === i ? null : i)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div>
                <span className="text-lg font-mono font-bold text-[var(--color-primary)]">{s.symbol}</span>
                <span className="ml-3 text-sm text-[var(--color-text-muted)]">{s.examples.slice(0, 2).join(', ')}</span>
              </div>
              <span className="text-[var(--color-text-muted)]">{expandedSound === i ? '▲' : '▼'}</span>
            </button>
            {expandedSound === i && (
              <div className="px-4 pb-4 border-t border-white/5 pt-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {s.examples.map((ex, j) => (
                    <button
                      key={j}
                      onClick={() => speak(ex)}
                      className="px-3 py-1.5 bg-[var(--color-primary)]/20 rounded-lg text-sm hover:bg-[var(--color-primary)]/40 transition-colors"
                    >
                      🔊 {ex}
                    </button>
                  ))}
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm font-medium">💡 {s.tip}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{s.tipKa}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => { setGroupIdx(Math.max(0, groupIdx - 1)); setExpandedSound(null); }}
          disabled={groupIdx === 0}
          className="flex-1 py-3 bg-[var(--color-bg-card)] rounded-xl disabled:opacity-30"
        >
          ← წინა
        </button>
        <button
          onClick={() => { setGroupIdx(Math.min(soundGroups.length - 1, groupIdx + 1)); setExpandedSound(null); }}
          disabled={groupIdx === soundGroups.length - 1}
          className="flex-1 py-3 bg-[var(--color-primary)] text-black rounded-xl font-semibold disabled:opacity-30"
        >
          შემდეგი →
        </button>
      </div>
    </div>
  );
}
