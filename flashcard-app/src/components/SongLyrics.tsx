import { useState } from 'react';

interface LyricLine {
  text: string;
  gap?: { word: string; options: string[] };
}

interface Song {
  title: string;
  artist: string;
  titleKa: string;
  level: string;
  lines: LyricLine[];
}

const songs: Song[] = [
  {
    title: "Imagine",
    artist: "John Lennon",
    titleKa: "წარმოიდგინე",
    level: "A2",
    lines: [
      { text: "Imagine there's no ___", gap: { word: "heaven", options: ["heaven", "garden", "river", "mountain"] } },
      { text: "It's easy if you try" },
      { text: "No hell ___ us", gap: { word: "below", options: ["below", "above", "around", "beside"] } },
      { text: "Above us only sky" },
      { text: "Imagine all the ___", gap: { word: "people", options: ["people", "animals", "children", "flowers"] } },
      { text: "Living for today" },
      { text: "Imagine there's no ___", gap: { word: "countries", options: ["countries", "cities", "houses", "schools"] } },
      { text: "It isn't hard to do" },
      { text: "Nothing to kill or ___ for", gap: { word: "die", options: ["die", "cry", "lie", "fly"] } },
      { text: "And no religion too" },
    ]
  },
  {
    title: "Let It Be",
    artist: "The Beatles",
    titleKa: "იყოს ასე",
    level: "A2",
    lines: [
      { text: "When I find myself in times of ___", gap: { word: "trouble", options: ["trouble", "sadness", "danger", "silence"] } },
      { text: "Mother Mary comes to me" },
      { text: "Speaking words of ___", gap: { word: "wisdom", options: ["wisdom", "kindness", "comfort", "silence"] } },
      { text: "Let it be" },
      { text: "And in my hour of ___", gap: { word: "darkness", options: ["darkness", "weakness", "sadness", "loneliness"] } },
      { text: "She is standing right in front of me" },
      { text: "Speaking words of wisdom", },
      { text: "Let it ___", gap: { word: "be", options: ["be", "go", "flow", "stay"] } },
      { text: "Let it be, let it be" },
      { text: "There will be an ___", gap: { word: "answer", options: ["answer", "ending", "option", "angel"] } },
    ]
  },
  {
    title: "Happy",
    artist: "Pharrell Williams",
    titleKa: "ბედნიერი",
    level: "A1",
    lines: [
      { text: "It might seem ___ what I'm about to say", gap: { word: "crazy", options: ["crazy", "funny", "silly", "happy"] } },
      { text: "Sunshine, she's here" },
      { text: "You can take a ___", gap: { word: "break", options: ["break", "walk", "seat", "chance"] } },
      { text: "Because I'm happy" },
      { text: "Clap along if you ___ like a room without a roof", gap: { word: "feel", options: ["feel", "look", "seem", "think"] } },
      { text: "Because I'm happy" },
      { text: "Clap along if you feel like ___ is the truth", gap: { word: "happiness", options: ["happiness", "sadness", "loneliness", "darkness"] } },
      { text: "Because I'm happy" },
      { text: "Can't nothing bring me ___", gap: { word: "down", options: ["down", "up", "back", "out"] } },
      { text: "My level's too high" },
    ]
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    titleKa: "შენი ფორმა",
    level: "B1",
    lines: [
      { text: "The club isn't the best ___ to find a lover", gap: { word: "place", options: ["place", "time", "way", "chance"] } },
      { text: "So the bar is where I go" },
      { text: "Me and my ___ at a table doing shots", gap: { word: "friends", options: ["friends", "family", "brothers", "sisters"] } },
      { text: "Drinking fast and then we talk slow" },
      { text: "And you come ___ and start up a conversation with just me", gap: { word: "over", options: ["over", "back", "here", "close"] } },
      { text: "And trust me I'll give it a chance now" },
      { text: "Take my ___ stop put Van the Man on the jukebox", gap: { word: "hand", options: ["hand", "heart", "phone", "time"] } },
      { text: "And then we start to dance" },
      { text: "And now I'm singing like", },
      { text: "I'm in ___ with the shape of you", gap: { word: "love", options: ["love", "tune", "touch", "line"] } },
    ]
  },
  {
    title: "Yesterday",
    artist: "The Beatles",
    titleKa: "გუშინ",
    level: "A2",
    lines: [
      { text: "Yesterday, all my ___ seemed so far away", gap: { word: "troubles", options: ["troubles", "friends", "dreams", "memories"] } },
      { text: "Now it looks as though they're here to stay" },
      { text: "Oh, I ___ in yesterday", gap: { word: "believe", options: ["believe", "lived", "stayed", "dreamed"] } },
      { text: "Suddenly" },
      { text: "I'm not ___ the man I used to be", gap: { word: "half", options: ["half", "quite", "still", "even"] } },
      { text: "There's a shadow hanging over me" },
      { text: "Oh, yesterday came ___", gap: { word: "suddenly", options: ["suddenly", "slowly", "quickly", "quietly"] } },
      { text: "Why she had to go" },
      { text: "I don't ___, she wouldn't say", gap: { word: "know", options: ["know", "care", "think", "mind"] } },
      { text: "I said something wrong" },
    ]
  },
  {
    title: "Count On Me",
    artist: "Bruno Mars",
    titleKa: "დამეყრდენი",
    level: "A1",
    lines: [
      { text: "If you ever find yourself stuck in the ___ of the sea", gap: { word: "middle", options: ["middle", "bottom", "edge", "center"] } },
      { text: "I'll sail the world to find you" },
      { text: "If you ever find yourself lost in the ___", gap: { word: "dark", options: ["dark", "rain", "cold", "woods"] } },
      { text: "And you can't see" },
      { text: "I'll be the ___ to guide you", gap: { word: "light", options: ["light", "star", "hand", "voice"] } },
      { text: "We find out what we're made of" },
      { text: "When we are ___ to help our friends in need", gap: { word: "called", options: ["called", "asked", "told", "ready"] } },
      { text: "You can count on me" },
      { text: "Like one, two, ___", gap: { word: "three", options: ["three", "four", "five", "ten"] } },
      { text: "I'll be there" },
    ]
  },
];

export default function SongLyrics({ onBack }: { onBack: () => void }) {
  const [songIdx, setSongIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const song = songs[songIdx];
  const gapLines = song.lines.filter(l => l.gap).map((l, i) => ({ ...l, originalIdx: song.lines.indexOf(l), gapIdx: i }));
  const totalGaps = gapLines.length;
  const correct = gapLines.filter((l, i) => answers[i] === l.gap!.word).length;

  function selectAnswer(gapIdx: number, word: string) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [gapIdx]: word }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  function nextSong() {
    setSongIdx(prev => (prev + 1) % songs.length);
    setAnswers({});
    setSubmitted(false);
  }

  function prevSong() {
    setSongIdx(prev => (prev - 1 + songs.length) % songs.length);
    setAnswers({});
    setSubmitted(false);
  }

  let gapCounter = 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={onBack} className="text-[var(--color-text-muted)] mb-4 hover:text-white">← უკან</button>
      <h2 className="text-2xl font-bold mb-1">🎵 სიმღერის ტექსტები</h2>
      <p className="text-[var(--color-text-muted)] text-sm mb-4">შეავსე გამოტოვებული სიტყვები სიმღერაში</p>

      {/* Song selector */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevSong} className="text-2xl px-2">◀</button>
        <div className="text-center">
          <div className="font-bold text-lg">{song.title}</div>
          <div className="text-[var(--color-text-muted)] text-sm">{song.artist} • {song.titleKa} • {song.level}</div>
        </div>
        <button onClick={nextSong} className="text-2xl px-2">▶</button>
      </div>

      {/* Lyrics */}
      <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4 space-y-2">
        {song.lines.map((line, lineIdx) => {
          if (!line.gap) {
            return <p key={lineIdx} className="text-[var(--color-text-muted)] italic text-sm">{line.text}</p>;
          }
          const gi = gapCounter++;
          const answered = answers[gi];
          const isCorrect = answered === line.gap.word;

          return (
            <div key={lineIdx} className="mb-3">
              <p className="text-sm mb-1">
                {line.text.replace('___',
                  submitted
                    ? (answered || '___')
                    : (answered || '___')
                )}
              </p>
              <div className="flex flex-wrap gap-1">
                {line.gap.options.map(opt => {
                  const selected = answered === opt;
                  let cls = "px-2 py-1 rounded text-xs transition-colors ";
                  if (submitted) {
                    if (opt === line.gap!.word) cls += "bg-green-600 text-white";
                    else if (selected && !isCorrect) cls += "bg-red-600 text-white";
                    else cls += "bg-white/5 text-[var(--color-text-muted)]";
                  } else {
                    cls += selected
                      ? "bg-[var(--color-primary)] text-black font-bold"
                      : "bg-white/10 text-white hover:bg-white/20";
                  }
                  return (
                    <button key={opt} onClick={() => selectAnswer(gi, opt)} className={cls}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < totalGaps}
          className="w-full py-3 rounded-xl font-bold bg-[var(--color-primary)] text-black disabled:opacity-40"
        >
          შემოწმება ✓
        </button>
      ) : (
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${correct === totalGaps ? 'text-green-400' : correct >= totalGaps / 2 ? 'text-yellow-400' : 'text-red-400'}`}>
            {correct}/{totalGaps}
          </div>
          <p className="text-[var(--color-text-muted)] text-sm mb-3">
            {correct === totalGaps ? '🎉 სრულყოფილი!' : correct >= totalGaps / 2 ? '👍 კარგია!' : '💪 სცადე ხელახლა!'}
          </p>
          <button onClick={nextSong} className="px-6 py-2 rounded-xl bg-[var(--color-primary)] text-black font-bold">
            შემდეგი სიმღერა →
          </button>
        </div>
      )}

      <div className="text-center mt-4 text-[var(--color-text-muted)] text-xs">
        {songIdx + 1} / {songs.length} სიმღერა
      </div>
    </div>
  );
}
