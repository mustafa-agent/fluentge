import { useState } from 'react';

interface Scene {
  emoji: string;
  title: string;
  titleKa: string;
  description: string;
  hints: string[];
  keywords: string[];
  sampleAnswer: string;
  sampleKa: string;
}

const scenes: Scene[] = [
  {
    emoji: '🏖️🌊☀️👨‍👩‍👧‍👦🏄‍♂️',
    title: 'Beach Day',
    titleKa: 'პლაჟზე',
    description: 'A family is at the beach. The sun is shining. Someone is surfing.',
    hints: ['Who is there?', 'What is the weather like?', 'What are they doing?'],
    keywords: ['family', 'beach', 'sun', 'surfing', 'water', 'sand'],
    sampleAnswer: 'A family is enjoying a sunny day at the beach. The father is surfing while the children play in the sand. The water is blue and the sun is shining brightly.',
    sampleKa: 'ოჯახი ზღვის სანაპიროზე მზიან დღეს ისვენებს. მამა სერფინგს აკეთებს, ბავშვები კი ქვიშაში თამაშობენ.'
  },
  {
    emoji: '🍳👩‍🍳🥘🔥🧅',
    title: 'Cooking',
    titleKa: 'სამზარეულოში',
    description: 'Someone is cooking in the kitchen. There is a pan on the fire.',
    hints: ['Who is cooking?', 'What are they making?', 'What ingredients do you see?'],
    keywords: ['cook', 'kitchen', 'pan', 'fire', 'onion', 'food'],
    sampleAnswer: 'A woman is cooking dinner in the kitchen. She is frying onions in a large pan. The kitchen smells delicious. She is making a traditional dish.',
    sampleKa: 'ქალი სამზარეულოში ვახშამს ამზადებს. ის დიდ ტაფაში ხახვს წვავს.'
  },
  {
    emoji: '🏫📚👨‍🏫✍️🎓',
    title: 'At School',
    titleKa: 'სკოლაში',
    description: 'Students are in a classroom. The teacher is writing on the board.',
    hints: ['Where are they?', 'What is the teacher doing?', 'How do the students feel?'],
    keywords: ['school', 'teacher', 'students', 'classroom', 'writing', 'board'],
    sampleAnswer: 'The students are sitting in a classroom. The teacher is writing a math problem on the whiteboard. Some students are taking notes while others are listening carefully.',
    sampleKa: 'მოსწავლეები საკლასო ოთახში სხედან. მასწავლებელი დაფაზე მათემატიკის ამოცანას წერს.'
  },
  {
    emoji: '🌧️🏠🐱📺🍵',
    title: 'Rainy Day at Home',
    titleKa: 'წვიმიანი დღე სახლში',
    description: 'It is raining outside. Someone is at home with a cat, watching TV and drinking tea.',
    hints: ['What is the weather?', 'Who is at home?', 'What are they doing?'],
    keywords: ['rain', 'home', 'cat', 'television', 'tea', 'cozy'],
    sampleAnswer: 'It is a rainy day outside. A person is sitting on the sofa at home with their cat. They are watching a movie on TV and drinking hot tea. It feels very cozy.',
    sampleKa: 'გარეთ წვიმს. ადამიანი სახლში დივანზე ზის კატასთან ერთად, ტელევიზორს უყურებს და ჩაის სვამს.'
  },
  {
    emoji: '🏋️‍♂️💪🏃‍♀️🎵😤',
    title: 'At the Gym',
    titleKa: 'სპორტდარბაზში',
    description: 'People are exercising at the gym. Music is playing.',
    hints: ['What exercises do you see?', 'How do people feel?', 'What do you hear?'],
    keywords: ['gym', 'exercise', 'running', 'music', 'strong', 'tired'],
    sampleAnswer: 'People are working out at the gym. A man is lifting heavy weights and a woman is running on the treadmill. Loud music is playing. Everyone looks focused and determined.',
    sampleKa: 'ხალხი სპორტდარბაზში ვარჯიშობს. კაცი მძიმე წონებს იწევს, ქალი კი ბილიკზე დარბის.'
  },
  {
    emoji: '🛒🥦🍎🧀💰',
    title: 'Grocery Shopping',
    titleKa: 'სუპერმარკეტში',
    description: 'Someone is shopping for groceries. They are buying fruits and vegetables.',
    hints: ['Where are they?', 'What are they buying?', 'Is it expensive?'],
    keywords: ['supermarket', 'shopping', 'vegetables', 'fruit', 'cheese', 'money'],
    sampleAnswer: 'A person is at the supermarket doing their weekly grocery shopping. They are putting fresh apples and broccoli in their cart. They also pick up some cheese. The prices are reasonable today.',
    sampleKa: 'ადამიანი სუპერმარკეტშია ყოველკვირეული საყიდლების სასყიდლად. ვაშლებსა და ბროკოლის ყიდულობს.'
  },
  {
    emoji: '🎂🎈🎁🥳👨‍👩‍👧',
    title: 'Birthday Party',
    titleKa: 'დაბადების დღის წვეულება',
    description: 'A birthday party with cake, balloons, and presents.',
    hints: ['Whose birthday is it?', 'What do you see?', 'How do people feel?'],
    keywords: ['birthday', 'cake', 'balloons', 'present', 'happy', 'party'],
    sampleAnswer: 'A little girl is celebrating her birthday. There is a big chocolate cake with candles on the table. Colorful balloons are everywhere. Her parents gave her many presents. Everyone is smiling and happy.',
    sampleKa: 'პატარა გოგონა დაბადების დღეს ზეიმობს. მაგიდაზე შოკოლადის ტორტია სანთლებით.'
  },
  {
    emoji: '🚗🗺️⛰️🌅📷',
    title: 'Road Trip',
    titleKa: 'მოგზაურობა მანქანით',
    description: 'Friends are on a road trip in the mountains. Beautiful sunset.',
    hints: ['Where are they going?', 'What can they see?', 'How do they feel?'],
    keywords: ['road trip', 'car', 'mountains', 'sunset', 'friends', 'photo'],
    sampleAnswer: 'Three friends are on a road trip through the mountains. The sunset is painting the sky orange and pink. They stop to take photos of the beautiful view. They are excited about their adventure.',
    sampleKa: 'სამი მეგობარი მთებში მანქანით მოგზაურობს. მზის ჩასვლა ცას ნარინჯისფრად ღებავს.'
  },
];

export default function PictureDescribe({ onBack }: { onBack: () => void }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [matchedWords, setMatchedWords] = useState<string[]>([]);

  const scene = scenes[sceneIdx];

  function checkText() {
    const lower = userText.toLowerCase();
    const matched = scene.keywords.filter(k => lower.includes(k));
    setMatchedWords(matched);
    setShowSample(true);
  }

  function nextScene() {
    setSceneIdx((sceneIdx + 1) % scenes.length);
    setUserText('');
    setShowSample(false);
    setShowHints(false);
    setMatchedWords([]);
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4">← უკან</button>
      <h2 className="text-2xl font-bold mb-4">🖼️ სურათის აღწერა</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        შეხედე ემოჯებს და აღწერე სცენა ინგლისურად. 3-5 წინადადება დაწერე.
      </p>

      <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 mb-4">
        <div className="text-sm text-[var(--color-text-muted)] mb-1">{sceneIdx + 1} / {scenes.length}</div>
        <div className="text-5xl text-center mb-3 tracking-wider">{scene.emoji}</div>
        <div className="text-xl font-bold text-center">{scene.title}</div>
        <div className="text-sm text-[var(--color-text-muted)] text-center">{scene.titleKa}</div>
      </div>

      {!showHints ? (
        <button onClick={() => setShowHints(true)} className="text-sm text-[var(--color-primary)] mb-3 block">
          💡 მინიშნებების ჩვენება
        </button>
      ) : (
        <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
          <div className="text-sm font-bold mb-2">💡 მინიშნებები:</div>
          {scene.hints.map((h, i) => (
            <div key={i} className="text-sm text-[var(--color-text-muted)] mb-1">• {h}</div>
          ))}
        </div>
      )}

      <textarea
        value={userText}
        onChange={e => setUserText(e.target.value)}
        placeholder="Describe what you see in English..."
        rows={4}
        className="w-full p-4 rounded-xl bg-[var(--color-bg-card)] text-white outline-none resize-none mb-4"
        disabled={showSample}
      />

      {!showSample ? (
        <button
          onClick={checkText}
          disabled={userText.trim().length < 10}
          className="w-full py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold disabled:opacity-30"
        >
          შეამოწმე ✓
        </button>
      ) : (
        <>
          <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
            <div className="text-sm font-bold mb-2">
              საკვანძო სიტყვები: {matchedWords.length}/{scene.keywords.length}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {scene.keywords.map(k => (
                <span key={k} className={`px-2 py-1 rounded text-xs ${matchedWords.includes(k) ? 'bg-green-500/30 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {k} {matchedWords.includes(k) ? '✅' : '❌'}
                </span>
              ))}
            </div>
            <div className="text-sm font-bold mb-1">📝 ნიმუში:</div>
            <div className="text-sm text-[var(--color-text-muted)] italic mb-2">"{scene.sampleAnswer}"</div>
            <div className="text-xs text-[var(--color-text-muted)]">🇬🇪 {scene.sampleKa}</div>
          </div>
          <button onClick={nextScene} className="w-full py-3 bg-[var(--color-primary)] text-black rounded-xl font-bold">
            შემდეგი სცენა →
          </button>
        </>
      )}
    </div>
  );
}
