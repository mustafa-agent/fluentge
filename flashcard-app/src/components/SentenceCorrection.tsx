import { useState } from 'react';

interface Challenge {
  wrong: string;
  correct: string;
  hintKa: string;
  ruleKa: string;
}

const challenges: Challenge[] = [
  { wrong: "She don't like coffee.", correct: "She doesn't like coffee.", hintKa: "მესამე პირი მხოლობითში", ruleKa: "He/She/It + doesn't (არა don't)" },
  { wrong: "I have went to school.", correct: "I have gone to school.", hintKa: "Present Perfect-ის ფორმა", ruleKa: "Have/Has + past participle: gone (არა went)" },
  { wrong: "He is more taller than me.", correct: "He is taller than me.", hintKa: "შედარებითი ხარისხი", ruleKa: "მოკლე ზედსართავებთან: taller (არა more taller)" },
  { wrong: "I am agree with you.", correct: "I agree with you.", hintKa: "ზმნის ფორმა", ruleKa: "Agree ზმნაა — am არ სჭირდება" },
  { wrong: "She can to swim.", correct: "She can swim.", hintKa: "მოდალური ზმნა", ruleKa: "Can-ის შემდეგ to არ იწერება" },
  { wrong: "I have many informations.", correct: "I have a lot of information.", hintKa: "უთვლადი არსებითი", ruleKa: "Information უთვლადია — მრავლობითი არ აქვს" },
  { wrong: "He goed to the store.", correct: "He went to the store.", hintKa: "არარეგულარული ზმნა", ruleKa: "Go → went (არა goed)" },
  { wrong: "I didn't saw the movie.", correct: "I didn't see the movie.", hintKa: "უარყოფითი წარსული", ruleKa: "Didn't + base form: see (არა saw)" },
  { wrong: "She is more beautiful than her sister.", correct: "She is more beautiful than her sister.", hintKa: "ეს სწორია!", ruleKa: "გრძელ ზედსართავებთან more + adjective სწორია ✅" },
  { wrong: "Me and him went to the park.", correct: "He and I went to the park.", hintKa: "სუბიექტის ფორმა", ruleKa: "სუბიექტში: I (არა me), He (არა him)" },
  { wrong: "I am studying English since 2 years.", correct: "I have been studying English for 2 years.", hintKa: "დროის გამოსახვა", ruleKa: "Since + კონკრეტული დრო, For + პერიოდი. Present Perfect Continuous" },
  { wrong: "There is many people in the park.", correct: "There are many people in the park.", hintKa: "მრავლობითი რიცხვი", ruleKa: "People მრავლობითია → are (არა is)" },
  { wrong: "I must to go now.", correct: "I must go now.", hintKa: "მოდალური ზმნა", ruleKa: "Must-ის შემდეგ to არ იწერება" },
  { wrong: "She said me to come.", correct: "She told me to come.", hintKa: "Said vs Told", ruleKa: "Tell + person: She told me. Say: She said to come." },
  { wrong: "I'm interesting in music.", correct: "I'm interested in music.", hintKa: "-ed vs -ing", ruleKa: "Interested = შენ გრძნობ. Interesting = რაღაც საინტერესოა" },
  { wrong: "He always is late.", correct: "He is always late.", hintKa: "ზმნიზედის ადგილი", ruleKa: "Always/usually/often → be ზმნის შემდეგ" },
  { wrong: "I look forward to meet you.", correct: "I look forward to meeting you.", hintKa: "To + gerund", ruleKa: "Look forward to + -ing (არა base form)" },
  { wrong: "She has less friends than me.", correct: "She has fewer friends than me.", hintKa: "Less vs Fewer", ruleKa: "Fewer = თვლადი (friends). Less = უთვლადი (water)" },
  { wrong: "I've been here since 3 hours.", correct: "I've been here for 3 hours.", hintKa: "Since vs For", ruleKa: "For + პერიოდი (3 hours). Since + მომენტი (since Monday)" },
  { wrong: "Do you can help me?", correct: "Can you help me?", hintKa: "კითხვის ფორმა", ruleKa: "Can → Can you...? (Do არ სჭირდება)" },
  { wrong: "I have 20 years old.", correct: "I am 20 years old.", hintKa: "ასაკის გამოთქმა", ruleKa: "ინგლისურში ასაკს am/is/are-ით ამბობენ (არა have)" },
  { wrong: "She make a cake every Sunday.", correct: "She makes a cake every Sunday.", hintKa: "მესამე პირი", ruleKa: "He/She/It + verb-s: makes (არა make)" },
  { wrong: "I goed to the cinema yesterday.", correct: "I went to the cinema yesterday.", hintKa: "არარეგულარული ზმნა", ruleKa: "Go → went → gone" },
  { wrong: "The childrens are playing.", correct: "The children are playing.", hintKa: "არარეგულარული მრავლობითი", ruleKa: "Child → children (არა childrens)" },
  { wrong: "I'm used to wake up early.", correct: "I'm used to waking up early.", hintKa: "Used to + gerund", ruleKa: "Be used to + -ing = მიჩვეული ვარ" },
  { wrong: "He suggested me to go.", correct: "He suggested that I go.", hintKa: "Suggest-ის სტრუქტურა", ruleKa: "Suggest + (that) + subject + base verb" },
  { wrong: "I catched the ball.", correct: "I caught the ball.", hintKa: "არარეგულარული ზმნა", ruleKa: "Catch → caught → caught" },
  { wrong: "She is boring in class.", correct: "She is bored in class.", hintKa: "-ed vs -ing", ruleKa: "Bored = ის გრძნობს. Boring = რაღაც მოსაბეზრებელია" },
  { wrong: "I have a good news.", correct: "I have good news.", hintKa: "უთვლადი არსებითი", ruleKa: "News უთვლადია — a/an არ სჭირდება" },
  { wrong: "Where do you come from?", correct: "Where do you come from?", hintKa: "ეს სწორია!", ruleKa: "ეს სწორი წინადადებაა ✅ ყოველთვის არ არის შეცდომა!" },
];

export default function SentenceCorrection({ onBack }: { onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const ch = challenges[idx];

  function normalize(s: string) {
    return s.trim().toLowerCase().replace(/['']/g, "'").replace(/\s+/g, ' ');
  }

  function check() {
    if (!input.trim()) return;
    const isCorrect = normalize(input) === normalize(ch.correct);
    if (isCorrect) setScore(s => s + 1);
    setAnswered(a => a + 1);
    setShowResult(true);
  }

  function next() {
    setIdx((idx + 1) % challenges.length);
    setInput('');
    setShowResult(false);
    setShowHint(false);
  }

  const isCorrect = normalize(input) === normalize(ch.correct);
  const isFinished = answered >= challenges.length;

  if (isFinished) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: '#22c55e', fontSize: 28, marginBottom: 8 }}>დასრულდა!</h2>
        <p style={{ fontSize: 20, marginBottom: 24 }}>{score}/{challenges.length} სწორი</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setIdx(0); setScore(0); setAnswered(0); setShowResult(false); setInput(''); }} style={{ padding: '12px 24px', background: '#22c55e', color: '#0f172a', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>🔄 თავიდან</button>
          <button onClick={onBack} style={{ padding: '12px 24px', background: '#334155', color: '#f1f5f9', border: 'none', borderRadius: 12, fontSize: 16, cursor: 'pointer' }}>🏠 მენიუ</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#f1f5f9', padding: 16, fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>← უკან</button>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>{idx + 1}/{challenges.length} | ✅ {score}</span>
      </div>

      <h2 style={{ textAlign: 'center', color: '#f59e0b', fontSize: 22, margin: '12px 0' }}>✏️ გაასწორე წინადადება</h2>
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, margin: '0 0 20px' }}>იპოვე შეცდომა და ჩაწერე სწორი ვარიანტი</p>

      <div style={{ background: '#1e293b', border: '2px solid #f59e0b', borderRadius: 16, padding: 20, marginBottom: 16, textAlign: 'center' }}>
        <p style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.6 }}>"{ch.wrong}"</p>
      </div>

      {!showHint && !showResult && (
        <button onClick={() => setShowHint(true)} style={{ display: 'block', margin: '0 auto 16px', background: 'transparent', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontSize: 13 }}>💡 მინიშნება</button>
      )}

      {showHint && !showResult && (
        <p style={{ textAlign: 'center', color: '#f59e0b', fontSize: 14, marginBottom: 16 }}>💡 {ch.hintKa}</p>
      )}

      {!showResult ? (
        <div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="ჩაწერე სწორი წინადადება..."
            style={{ width: '100%', padding: 14, fontSize: 16, background: '#0f172a', color: '#f1f5f9', border: '2px solid #334155', borderRadius: 12, marginBottom: 12, boxSizing: 'border-box' }}
            autoFocus
          />
          <button onClick={check} style={{ width: '100%', padding: 14, background: '#22c55e', color: '#0f172a', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>შეამოწმე ✓</button>
        </div>
      ) : (
        <div style={{ background: isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `2px solid ${isCorrect ? '#22c55e' : '#ef4444'}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>{isCorrect ? '✅ სწორია!' : '❌ არასწორია'}</p>
          {!isCorrect && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>შენი პასუხი:</p>
              <p style={{ color: '#ef4444', fontSize: 16 }}>"{input}"</p>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4, marginTop: 8 }}>სწორი პასუხი:</p>
              <p style={{ color: '#22c55e', fontSize: 16 }}>"{ch.correct}"</p>
            </div>
          )}
          <div style={{ background: '#0f172a', borderRadius: 8, padding: 12, marginTop: 8 }}>
            <p style={{ color: '#f59e0b', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>📖 წესი:</p>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>{ch.ruleKa}</p>
          </div>
          <button onClick={next} style={{ width: '100%', marginTop: 16, padding: 14, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>შემდეგი →</button>
        </div>
      )}
    </div>
  );
}
