import { useState, useEffect, useRef } from 'react';

// Types
interface Phrase {
  id: string;
  english: string;
  georgian: string;
  literal?: string;
  context: string;
  level: string;
  category: string;
}

interface Category {
  id: string;
  name_ka: string;
  name_en: string;
  icon: string;
  level: string;
  free: boolean;
  phrases: Phrase[];
  file: string;
}

const CATEGORIES: Omit<Category, 'phrases'>[] = [
  // A1 - Basics
  { id: 'greetings-basics', name_ka: 'მისალმებები', name_en: 'Greetings & Basics', icon: '👋', level: 'A1', free: true, file: '01-greetings-basics.json' },
  { id: 'numbers-money', name_ka: 'რიცხვები და ფული', name_en: 'Numbers & Money', icon: '💰', level: 'A1', free: false, file: '02-numbers-money.json' },
  { id: 'food-restaurant', name_ka: 'საკვები და რესტორანი', name_en: 'Food & Restaurant', icon: '🍽️', level: 'A1', free: true, file: '03-food-restaurant.json' },
  { id: 'directions-transport', name_ka: 'მიმართულებები', name_en: 'Directions & Transport', icon: '🗺️', level: 'A1', free: false, file: '04-directions-transport.json' },
  { id: 'emergency-help', name_ka: 'გადაუდებელი დახმარება', name_en: 'Emergency & Help', icon: '🚨', level: 'A1', free: true, file: '05-emergency-help.json' },
  { id: 'shopping-basics', name_ka: 'შოპინგი', name_en: 'Shopping', icon: '🛍️', level: 'A1', free: false, file: '06-shopping-basics.json' },
  { id: 'time-dates', name_ka: 'დრო და თარიღები', name_en: 'Time & Dates', icon: '🕐', level: 'A1', free: false, file: '07-time-dates.json' },
  { id: 'family-people', name_ka: 'ოჯახი', name_en: 'Family & People', icon: '👨‍👩‍👧', level: 'A1', free: false, file: '08-family-people.json' },
  // A2 - Getting By
  { id: 'hotel-accommodation', name_ka: 'სასტუმრო', name_en: 'Hotel & Accommodation', icon: '🏨', level: 'A2', free: false, file: '09-hotel-accommodation.json' },
  { id: 'phone-internet', name_ka: 'ტელეფონი და ინტერნეტი', name_en: 'Phone & Internet', icon: '📱', level: 'A2', free: false, file: '10-phone-internet.json' },
  { id: 'weather-nature', name_ka: 'ამინდი', name_en: 'Weather & Nature', icon: '🌤️', level: 'A2', free: false, file: '11-weather-nature.json' },
  { id: 'health-doctor', name_ka: 'ჯანმრთელობა', name_en: 'Health & Doctor', icon: '🏥', level: 'A2', free: false, file: '12-health-doctor.json' },
  { id: 'home-apartment', name_ka: 'სახლი', name_en: 'Home & Apartment', icon: '🏠', level: 'A2', free: false, file: '13-home-apartment.json' },
  { id: 'work-office', name_ka: 'სამსახური', name_en: 'Work & Office', icon: '💼', level: 'A2', free: false, file: '14-work-office.json' },
  { id: 'school-education', name_ka: 'სკოლა', name_en: 'School & Education', icon: '🎓', level: 'A2', free: false, file: '15-school-education.json' },
  { id: 'hobbies-free-time', name_ka: 'ჰობი', name_en: 'Hobbies & Free Time', icon: '🎨', level: 'A2', free: false, file: '16-hobbies-free-time.json' },
  // B1 - Conversational
  { id: 'opinions-agreements', name_ka: 'მოსაზრებები', name_en: 'Opinions & Agreement', icon: '💭', level: 'B1', free: false, file: '17-opinions-agreements.json' },
  { id: 'emotions-feelings', name_ka: 'ემოციები', name_en: 'Emotions & Feelings', icon: '❤️', level: 'B1', free: false, file: '18-emotions-feelings.json' },
  { id: 'relationships-dating', name_ka: 'ურთიერთობები', name_en: 'Relationships & Dating', icon: '💑', level: 'B1', free: false, file: '19-relationships-dating.json' },
  { id: 'parties-social', name_ka: 'წვეულებები', name_en: 'Parties & Social', icon: '🎉', level: 'B1', free: false, file: '20-parties-social.json' },
  { id: 'complaints-problems', name_ka: 'საჩივრები', name_en: 'Complaints & Problems', icon: '😤', level: 'B1', free: false, file: '21-complaints-problems.json' },
  { id: 'plans-future', name_ka: 'გეგმები', name_en: 'Plans & Future', icon: '📅', level: 'B1', free: false, file: '22-plans-future.json' },
  { id: 'small-talk', name_ka: 'სმოლ თოქი', name_en: 'Small Talk', icon: '☕', level: 'B1', free: false, file: '23-small-talk.json' },
  { id: 'travel-vacation', name_ka: 'მოგზაურობა', name_en: 'Travel & Vacation', icon: '✈️', level: 'B1', free: false, file: '24-travel-vacation.json' },
  // B2 - Fluent
  { id: 'business-meetings', name_ka: 'ბიზნესი', name_en: 'Business & Meetings', icon: '🤝', level: 'B2', free: false, file: '25-business-meetings.json' },
  { id: 'debates-arguments', name_ka: 'დებატები', name_en: 'Debates & Arguments', icon: '⚖️', level: 'B2', free: false, file: '26-debates-arguments.json' },
  { id: 'idioms-expressions', name_ka: 'იდიომები', name_en: 'Idioms & Expressions', icon: '🗣️', level: 'B2', free: false, file: '27-idioms-expressions.json' },
  { id: 'humor-jokes', name_ka: 'იუმორი', name_en: 'Humor & Jokes', icon: '😂', level: 'B2', free: false, file: '28-humor-jokes.json' },
  { id: 'technology-apps', name_ka: 'ტექნოლოგიები', name_en: 'Technology & Apps', icon: '💻', level: 'B2', free: false, file: '29-technology-apps.json' },
  { id: 'news-politics', name_ka: 'ახალი ამბები', name_en: 'News & Politics', icon: '📰', level: 'B2', free: false, file: '30-news-politics.json' },
  { id: 'sports-fitness', name_ka: 'სპორტი', name_en: 'Sports & Fitness', icon: '⚽', level: 'B2', free: false, file: '31-sports-fitness.json' },
  { id: 'movies-entertainment', name_ka: 'ფილმები', name_en: 'Movies & Entertainment', icon: '🎬', level: 'B2', free: false, file: '32-movies-entertainment.json' },
  // C1 - Near Native
  { id: 'slang-informal', name_ka: 'სლენგი', name_en: 'Slang & Informal', icon: '🔥', level: 'C1', free: false, file: '33-slang-informal.json' },
  { id: 'professional-formal', name_ka: 'ფორმალური', name_en: 'Professional & Formal', icon: '👔', level: 'C1', free: false, file: '34-professional-formal.json' },
  { id: 'academic-intellectual', name_ka: 'აკადემიური', name_en: 'Academic', icon: '🎓', level: 'C1', free: false, file: '35-academic-intellectual.json' },
  { id: 'cultural-references', name_ka: 'კულტურა', name_en: 'Cultural References', icon: '🌍', level: 'C1', free: false, file: '36-cultural-references.json' },
  { id: 'sarcasm-irony', name_ka: 'სარკაზმი', name_en: 'Sarcasm & Irony', icon: '😏', level: 'C1', free: false, file: '37-sarcasm-irony.json' },
  { id: 'proverbs-wisdom', name_ka: 'ანდაზები', name_en: 'Proverbs & Wisdom', icon: '📜', level: 'C1', free: false, file: '38-proverbs-wisdom.json' },
  { id: 'negotiation-persuasion', name_ka: 'მოლაპარაკება', name_en: 'Negotiation', icon: '🎯', level: 'C1', free: false, file: '39-negotiation-persuasion.json' },
  { id: 'storytelling-narrative', name_ka: 'მოთხრობა', name_en: 'Storytelling', icon: '📖', level: 'C1', free: false, file: '40-storytelling-narrative.json' },
];

const LEVEL_COLORS: Record<string, string> = {
  'A1': '#22c55e',
  'A2': '#3b82f6',
  'B1': '#f59e0b',
  'B2': '#f97316',
  'C1': '#ef4444',
};

const LEVEL_LABELS: Record<string, string> = {
  'A1': 'დამწყები',
  'A2': 'ელემენტარული',
  'B1': 'საშუალო',
  'B2': 'საშუალოზე მაღალი',
  'C1': 'მოწინავე',
};

// TTS using Web Speech API (free, works offline on most devices)
function speak(text: string, lang: 'en' | 'ka') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === 'en' ? 'en-US' : 'ka-GE';
  utter.rate = 0.85;
  // Try to find a good voice
  const voices = window.speechSynthesis.getVoices();
  const langCode = lang === 'en' ? 'en' : 'ka';
  const voice = voices.find(v => v.lang.startsWith(langCode));
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

// Check premium status
function isPremiumUser(): boolean {
  return localStorage.getItem('fluentge_premium') === 'true';
}

export default function Phrasebook({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'categories' | 'phrases'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedPhrase, setExpandedPhrase] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  const [loadedCategories, setLoadedCategories] = useState<Record<string, Phrase[]>>({});
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [learnedPhrases, setLearnedPhrases] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('fluentge_learned_phrases');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioCache = useRef<Record<string, string>>({});

  // Save learned phrases
  useEffect(() => {
    localStorage.setItem('fluentge_learned_phrases', JSON.stringify([...learnedPhrases]));
  }, [learnedPhrases]);

  // Load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Load category phrases
  async function loadCategory(cat: Omit<Category, 'phrases'>) {
    if (loadedCategories[cat.id]) {
      setSelectedCategory({ ...cat, phrases: loadedCategories[cat.id] });
      setView('phrases');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/flashcards/phrasebook/${cat.file}`);
      const phrases: Phrase[] = await res.json();
      setLoadedCategories(prev => ({ ...prev, [cat.id]: phrases }));
      setSelectedCategory({ ...cat, phrases });
      setView('phrases');
    } catch (e) {
      console.error('Failed to load phrases:', e);
    }
    setLoading(false);
  }

  function handleCategoryClick(cat: Omit<Category, 'phrases'>) {
    if (!cat.free && !isPremiumUser()) {
      setShowPremiumModal(true);
      return;
    }
    loadCategory(cat);
  }

  function toggleLearned(id: string) {
    setLearnedPhrases(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Play audio using edge-tts generated files or Web Speech API fallback
  async function playAudio(text: string, lang: 'en' | 'ka', phraseId: string) {
    const cacheKey = `${phraseId}-${lang}`;
    setPlayingId(cacheKey);
    
    // Try pre-generated audio first
    const audioPath = `/flashcards/phrasebook/audio/${lang}/${phraseId}.mp3`;
    try {
      const audio = new Audio(audioPath);
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject();
        audio.play();
      });
      setPlayingId(null);
      return;
    } catch {
      // Fallback to Web Speech API
      speak(text, lang);
      setTimeout(() => setPlayingId(null), 2000);
    }
  }

  // Stats
  const totalPhrases = CATEGORIES.reduce((sum, c) => sum + (loadedCategories[c.id]?.length || 0), 0);
  const learnedCount = learnedPhrases.size;

  // Filter categories
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const filteredCategories = CATEGORIES.filter(c => !filterLevel || c.level === filterLevel);

  // Search across loaded phrases
  const searchResults = searchQuery.length >= 2 
    ? Object.values(loadedCategories).flat().filter(p => 
        p.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.georgian.includes(searchQuery)
      ).slice(0, 20)
    : [];

  return (
    <div className="max-w-lg mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <button onClick={view === 'phrases' ? () => setView('categories') : onBack} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
          ← {view === 'phrases' ? 'კატეგორიები' : 'უკან'}
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-lg font-bold">📖 ფრაზარიუმი</h2>
          {view === 'categories' && (
            <p className="text-xs text-[var(--color-text-muted)]">
              {CATEGORIES.length} კატეგორია • ~1,700 ფრაზა
            </p>
          )}
        </div>
        <div className="w-8" />
      </div>

      {/* Stats bar */}
      {view === 'categories' && learnedCount > 0 && (
        <div className="bg-[var(--color-bg-card)] rounded-xl p-3 mb-4 flex items-center gap-3 border border-white/5">
          <div className="text-2xl">🏆</div>
          <div className="flex-1">
            <div className="text-sm font-medium">{learnedCount} ფრაზა ისწავლე</div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
              <div className="bg-[var(--color-primary)] h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, (learnedCount / 1700) * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {view === 'categories' && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 ძებნა / Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--color-bg-card)] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)]/50 placeholder:text-[var(--color-text-muted)]"
            />
          </div>
          
          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-[var(--color-bg-card)] rounded-xl border border-white/10 overflow-hidden">
              {searchResults.map(phrase => (
                <div key={phrase.id} className="p-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <button onClick={() => playAudio(phrase.english, 'en', phrase.id)} className="text-lg">🔊</button>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{phrase.english}</div>
                      <div className="text-[var(--color-primary)] text-sm">{phrase.georgian}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: LEVEL_COLORS[phrase.level] + '20', color: LEVEL_COLORS[phrase.level] }}>{phrase.level}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Level filter */}
      {view === 'categories' && !searchQuery && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterLevel(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${!filterLevel ? 'bg-[var(--color-primary)] text-black' : 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)]'}`}
          >
            ყველა
          </button>
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setFilterLevel(filterLevel === level ? null : level)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors`}
              style={{
                backgroundColor: filterLevel === level ? LEVEL_COLORS[level] : 'var(--color-bg-card)',
                color: filterLevel === level ? '#000' : LEVEL_COLORS[level],
              }}
            >
              {level} — {LEVEL_LABELS[level]}
            </button>
          ))}
        </div>
      )}

      {/* Categories list */}
      {view === 'categories' && !searchQuery && (
        <div>
          {levels.filter(l => !filterLevel || filterLevel === l).map(level => (
            <div key={level} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: LEVEL_COLORS[level] + '20', color: LEVEL_COLORS[level] }}>
                  {level}
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">{LEVEL_LABELS[level]}</span>
              </div>
              <div className="grid gap-2">
                {filteredCategories.filter(c => c.level === level).map(cat => {
                  const loaded = loadedCategories[cat.id];
                  const catLearned = loaded ? loaded.filter(p => learnedPhrases.has(p.id)).length : 0;
                  const isLocked = !cat.free && !isPremiumUser();
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isLocked ? 'bg-[var(--color-bg-card)]/50 border-white/5 opacity-70' : 'bg-[var(--color-bg-card)] border-white/5 hover:border-white/20 active:scale-[0.98]'}`}
                    >
                      <div className="text-2xl w-10 text-center">{cat.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{cat.name_ka}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{cat.name_en}</div>
                        {loaded && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-white/10 rounded-full h-1">
                              <div className="bg-[var(--color-primary)] h-1 rounded-full" style={{ width: `${(catLearned / loaded.length) * 100}%` }} />
                            </div>
                            <span className="text-[10px] text-[var(--color-text-muted)]">{catLearned}/{loaded.length}</span>
                          </div>
                        )}
                      </div>
                      {isLocked ? (
                        <div className="text-lg">🔒</div>
                      ) : cat.free ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]">FREE</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phrases view */}
      {view === 'phrases' && selectedCategory && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedCategory.icon}</span>
            <div>
              <h3 className="font-bold">{selectedCategory.name_ka}</h3>
              <p className="text-xs text-[var(--color-text-muted)]">{selectedCategory.name_en} • {selectedCategory.phrases.length} ფრაზა</p>
            </div>
          </div>

          <div className="grid gap-2">
            {selectedCategory.phrases.map((phrase, i) => {
              const isExpanded = expandedPhrase === phrase.id;
              const isLearned = learnedPhrases.has(phrase.id);
              
              return (
                <div
                  key={phrase.id}
                  className={`bg-[var(--color-bg-card)] rounded-xl border transition-all ${isExpanded ? 'border-[var(--color-primary)]/30' : 'border-white/5'} ${isLearned ? 'border-l-2 border-l-[var(--color-primary)]' : ''}`}
                >
                  <button
                    onClick={() => setExpandedPhrase(isExpanded ? null : phrase.id)}
                    className="w-full p-3 text-left flex items-center gap-3"
                  >
                    <span className="text-xs text-[var(--color-text-muted)] w-6 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{phrase.english}</div>
                      <div className="text-[var(--color-primary)] text-sm mt-0.5">{phrase.georgian}</div>
                    </div>
                    <span className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t border-white/5">
                      {/* Literal translation */}
                      {phrase.literal && (
                        <div className="mt-2 text-xs text-[var(--color-text-muted)]">
                          <span className="opacity-60">სიტყვასიტყვით:</span> {phrase.literal}
                        </div>
                      )}
                      
                      {/* Context */}
                      <div className="mt-2 text-xs text-[var(--color-text-muted)] bg-white/5 rounded-lg p-2">
                        💡 {phrase.context}
                      </div>

                      {/* Audio buttons */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => playAudio(phrase.english, 'en', phrase.id)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${playingId === `${phrase.id}-en` ? 'bg-blue-500/30 text-blue-400' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}
                        >
                          {playingId === `${phrase.id}-en` ? '🔊' : '🇬🇧'} English
                        </button>
                        <button
                          onClick={() => playAudio(phrase.georgian, 'ka', phrase.id)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${playingId === `${phrase.id}-ka` ? 'bg-red-500/30 text-red-400' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                        >
                          {playingId === `${phrase.id}-ka` ? '🔊' : '🇬🇪'} ქართული
                        </button>
                      </div>

                      {/* Learned toggle */}
                      <button
                        onClick={() => toggleLearned(phrase.id)}
                        className={`w-full mt-2 py-2 rounded-lg text-xs font-medium transition-colors ${isLearned ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-white/5 text-[var(--color-text-muted)] hover:bg-white/10'}`}
                      >
                        {isLearned ? '✅ ვისწავლე!' : '📌 ისწავლე'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3 animate-pulse">📖</div>
            <div className="text-sm">იტვირთება...</div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowPremiumModal(false)}>
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 max-w-sm w-full border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">პრემიუმ კატეგორია</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                ეს კატეგორია ხელმისაწვდომია მხოლოდ პრემიუმ მომხმარებლებისთვის
              </p>
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 mb-4 border border-amber-500/20">
                <div className="font-bold text-lg mb-1">FluentGe Premium</div>
                <div className="text-2xl font-bold text-amber-400">₾9.99<span className="text-sm font-normal text-[var(--color-text-muted)]">/თვეში</span></div>
                <ul className="text-xs text-left mt-3 space-y-1.5">
                  <li>✅ 40 კატეგორია (1,700+ ფრაზა)</li>
                  <li>✅ აუდიო ყველა ფრაზისთვის</li>
                  <li>✅ ახალი კატეგორიები ყოველთვე</li>
                  <li>✅ რეკლამების გარეშე</li>
                </ul>
              </div>
              <button
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl text-sm"
                onClick={() => {
                  // TODO: Payment integration
                  alert('მალე დაემატება! / Coming soon!');
                }}
              >
                გააქტიურე პრემიუმი ✨
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-2 mt-2 text-sm text-[var(--color-text-muted)]"
              >
                დახურვა
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
