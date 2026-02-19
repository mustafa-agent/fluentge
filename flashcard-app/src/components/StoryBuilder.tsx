import { useState } from 'react';

interface StoryTemplate {
  title: string;
  titleKa: string;
  template: string; // Uses {noun}, {verb}, {adjective}, {place} etc.
  blanks: { key: string; type: string; typeKa: string }[];
}

const stories: StoryTemplate[] = [
  {
    title: "A Day at School",
    titleKa: "სკოლაში ერთი დღე",
    template: "Today I went to {place}. My teacher was very {adjective}. We learned about {noun}. At lunch, I ate a {adjective2} {food}. After school, I {verb} all the way home. It was a {adjective3} day!",
    blanks: [
      { key: 'place', type: 'Place', typeKa: 'ადგილი' },
      { key: 'adjective', type: 'Adjective', typeKa: 'ზედსართავი' },
      { key: 'noun', type: 'Noun', typeKa: 'არსებითი' },
      { key: 'adjective2', type: 'Adjective', typeKa: 'ზედსართავი' },
      { key: 'food', type: 'Food', typeKa: 'საჭმელი' },
      { key: 'verb', type: 'Past tense verb', typeKa: 'ზმნა (წარსული)' },
      { key: 'adjective3', type: 'Adjective', typeKa: 'ზედსართავი' },
    ],
  },
  {
    title: "The Supermarket Adventure",
    titleKa: "სუპერმარკეტის თავგადასავალი",
    template: "I went to the supermarket to buy {food}. But when I got there, I saw a {adjective} {animal} in the {place} section! It was {verb}ing very loudly. All the {noun}s were {adjective2}. The manager said \"Please take your {animal2} outside!\" I laughed and bought {number} {food2}s instead.",
    blanks: [
      { key: 'food', type: 'Food', typeKa: 'საჭმელი' },
      { key: 'adjective', type: 'Adjective', typeKa: 'ზედსართავი' },
      { key: 'animal', type: 'Animal', typeKa: 'ცხოველი' },
      { key: 'place', type: 'Store section', typeKa: 'განყოფილება' },
      { key: 'verb', type: 'Verb (-ing)', typeKa: 'ზმნა' },
      { key: 'noun', type: 'Noun (person)', typeKa: 'ადამიანი' },
      { key: 'adjective2', type: 'Emotion', typeKa: 'ემოცია' },
      { key: 'animal2', type: 'Animal', typeKa: 'ცხოველი' },
      { key: 'number', type: 'Number', typeKa: 'რიცხვი' },
      { key: 'food2', type: 'Food', typeKa: 'საჭმელი' },
    ],
  },
  {
    title: "My Dream Vacation",
    titleKa: "ჩემი საოცნებო შვებულება",
    template: "Last summer, I traveled to {place}. The weather was {adjective}. I stayed in a {adjective2} hotel near the {noun}. Every morning, I would {verb} and eat {food} for breakfast. The local people were very {adjective3}. I bought a {adjective4} {noun2} as a souvenir. I can't wait to go back!",
    blanks: [
      { key: 'place', type: 'Country/City', typeKa: 'ქვეყანა/ქალაქი' },
      { key: 'adjective', type: 'Weather word', typeKa: 'ამინდი' },
      { key: 'adjective2', type: 'Adjective (size)', typeKa: 'ზომა' },
      { key: 'noun', type: 'Nature word', typeKa: 'ბუნება' },
      { key: 'verb', type: 'Verb', typeKa: 'ზმნა' },
      { key: 'food', type: 'Food', typeKa: 'საჭმელი' },
      { key: 'adjective3', type: 'Personality', typeKa: 'პიროვნება' },
      { key: 'adjective4', type: 'Color', typeKa: 'ფერი' },
      { key: 'noun2', type: 'Object', typeKa: 'ნივთი' },
    ],
  },
  {
    title: "The Job Interview",
    titleKa: "გასაუბრება სამსახურში",
    template: "I had a job interview at {place}. I wore my {adjective} {clothing}. The interviewer asked me \"What is your best {noun}?\" I said \"I am very good at {verb}ing.\" Then they asked me to {verb2} a {noun2}. I did it {adverb}. They said \"You're {adjective2}! You start on {day}!\"",
    blanks: [
      { key: 'place', type: 'Company/Place', typeKa: 'კომპანია' },
      { key: 'adjective', type: 'Color', typeKa: 'ფერი' },
      { key: 'clothing', type: 'Clothing', typeKa: 'ტანსაცმელი' },
      { key: 'noun', type: 'Skill', typeKa: 'უნარი' },
      { key: 'verb', type: 'Verb (-ing)', typeKa: 'ზმნა' },
      { key: 'verb2', type: 'Verb', typeKa: 'ზმნა' },
      { key: 'noun2', type: 'Object', typeKa: 'ნივთი' },
      { key: 'adverb', type: 'Adverb (how?)', typeKa: 'ზმნიზედა' },
      { key: 'adjective2', type: 'Adjective', typeKa: 'ზედსართავი' },
      { key: 'day', type: 'Day of week', typeKa: 'კვირის დღე' },
    ],
  },
  {
    title: "Cooking Disaster",
    titleKa: "სამზარეულოს კატასტროფა",
    template: "I tried to cook {food} for dinner. First, I {verb}ed the {noun}. Then I added {number} cups of {food2}. It smelled {adjective}! When I put it in the oven, it turned {color}. My {family} tasted it and said it was the most {adjective2} thing they ever ate. We ordered {food3} instead.",
    blanks: [
      { key: 'food', type: 'Dish', typeKa: 'კერძი' },
      { key: 'verb', type: 'Past verb', typeKa: 'ზმნა (წარსული)' },
      { key: 'noun', type: 'Vegetable', typeKa: 'ბოსტნეული' },
      { key: 'number', type: 'Number', typeKa: 'რიცხვი' },
      { key: 'food2', type: 'Liquid', typeKa: 'სითხე' },
      { key: 'adjective', type: 'Smell word', typeKa: 'სუნი' },
      { key: 'color', type: 'Color', typeKa: 'ფერი' },
      { key: 'family', type: 'Family member', typeKa: 'ოჯახის წევრი' },
      { key: 'adjective2', type: 'Adjective', typeKa: 'ზედსართავი' },
      { key: 'food3', type: 'Fast food', typeKa: 'სწრაფი კვება' },
    ],
  },
];

export default function StoryBuilder({ onBack }: { onBack: () => void }) {
  const [storyIdx, setStoryIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentBlank, setCurrentBlank] = useState(0);

  const story = stories[storyIdx];

  const handleSubmitWord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('word') as HTMLInputElement;
    const val = input.value.trim();
    if (!val) return;

    const key = story.blanks[currentBlank].key;
    setAnswers(prev => ({ ...prev, [key]: val }));
    input.value = '';

    if (currentBlank + 1 >= story.blanks.length) {
      setSubmitted(true);
    } else {
      setCurrentBlank(prev => prev + 1);
    }
  };

  const buildStory = () => {
    let text = story.template;
    for (const [key, val] of Object.entries(answers)) {
      text = text.replace(`{${key}}`, `**${val}**`);
    }
    return text;
  };

  const nextStory = () => {
    setStoryIdx((storyIdx + 1) % stories.length);
    setAnswers({});
    setSubmitted(false);
    setCurrentBlank(0);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[var(--color-primary)]">← უკან</button>
        <h2 className="text-lg font-bold">📝 ამბის შემქმნელი</h2>
        <span className="text-sm">{storyIdx + 1}/{stories.length}</span>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-xl p-4 mb-4">
        <h3 className="font-bold text-lg">{story.title}</h3>
        <p className="text-sm text-[var(--color-text-muted)]">{story.titleKa}</p>
      </div>

      {!submitted ? (
        <>
          {/* Progress */}
          <div className="flex gap-1 mb-4">
            {story.blanks.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${i < currentBlank ? 'bg-green-500' : i === currentBlank ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`}
              />
            ))}
          </div>

          {/* Current blank */}
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6 mb-4 text-center">
            <p className="text-sm text-[var(--color-text-muted)] mb-2">
              {currentBlank + 1} / {story.blanks.length}
            </p>
            <p className="text-xl font-bold mb-1">
              {story.blanks[currentBlank].type}
            </p>
            <p className="text-[var(--color-text-muted)]">
              {story.blanks[currentBlank].typeKa}
            </p>

            <form onSubmit={handleSubmitWord} className="mt-4 flex gap-2">
              <input
                name="word"
                type="text"
                autoFocus
                autoComplete="off"
                placeholder="ჩაწერე სიტყვა..."
                className="flex-1 bg-white/10 rounded-lg px-4 py-3 text-white text-center text-lg outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button
                type="submit"
                className="bg-[var(--color-primary)] text-black px-4 py-3 rounded-lg font-bold"
              >
                →
              </button>
            </form>
          </div>

          {/* Already filled words */}
          {currentBlank > 0 && (
            <div className="bg-[var(--color-bg-card)] rounded-xl p-3">
              <p className="text-xs text-[var(--color-text-muted)] mb-2">შეყვანილი სიტყვები:</p>
              <div className="flex flex-wrap gap-2">
                {story.blanks.slice(0, currentBlank).map((b, i) => (
                  <span key={i} className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-1 rounded text-sm">
                    {b.typeKa}: {answers[b.key]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Show completed story */}
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6 mb-4">
            <h3 className="font-bold mb-3 text-[var(--color-primary)]">შენი ამბავი:</h3>
            <p className="text-lg leading-relaxed">
              {buildStory().split('**').map((part, i) =>
                i % 2 === 1 ? (
                  <span key={i} className="text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 px-1 rounded">
                    {part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </div>

          <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">
            💡 სიტყვები რომ ისწავლე: {story.blanks.map(b => b.type).join(', ')}
          </p>

          <button
            onClick={nextStory}
            className="w-full bg-[var(--color-primary)] text-black py-3 rounded-xl font-bold text-lg"
          >
            შემდეგი ამბავი →
          </button>
        </>
      )}
    </div>
  );
}
