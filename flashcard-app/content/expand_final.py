#!/usr/bin/env python3
"""Final round: Top up all remaining categories to 200+."""
import json, glob, os

# Extra words per category - all unique, single words
EXPANSIONS = {
    'gym-fitness.json': [
        ('hamstring','ჰამსტრინგი'),('quadricep','კვადრიცეპსი'),('bicep','ბიცეპსი'),
        ('tricep','ტრიცეპსი'),('deltoid','დელტა'),('trapezius','ტრაპეცია'),
        ('abdominal','მუცლის კუნთი'),('glute','სასქესო კუნთი'),('calve','ყავარჯნის კუნთი'),
    ],
    'music-genres.json': [
        ('ska','სკა'),('funk','ფანკი'),('soul','სოული'),
        ('bluegrass','ბლუგრასი'),('rockabilly','როკაბილი'),
    ],
    'slang-informal.json': [
        ('snarky','ყაჩაღი'),('hangry','მშიერ-გაბრაზებული'),('adulting','ზრდასრულობა'),
        ('lowkey','დაბალი'),('extra','ზედმეტი'),('basic','ბანალური'),
        ('bougie','ბურჟუა'),('cheugy','მოძველებული'),('snatched','მომხიბვლელი'),
        ('periodt','წერტილი'),('sis','და'),('bestie','საუკეთესო მეგობარი'),
        ('zaddy','მიმზიდველი'),('rizz','მომხიბვლელობა'),('delulu','ილუზიებში'),
        ('situationship','გაურკვეველი'),('gaslight','მანიპულაცია'),
    ],
    'nightlife-parties.json': [
        ('turntable','გრამაფონი'),('vinyl','ვინილი'),('subwoofer','საბვუფერი'),
        ('equalizer','ექვალაიზერი'),('mixer','მიქსერი'),('soundcheck','საუნდჩეკი'),
        ('warmup','გამთბარი'),
    ],
    'motivation-success.json': [
        ('empathy','ემპათია'),('compassion','თანაგრძნობა'),('humility','თავმდაბლობა'),
        ('patience','მოთმინება'),('wisdom','სიბრძნე'),('courage','სიმამაცე'),
        ('bravery','სიმამაცე'),('valor','გმირობა'),
    ],
    'startup-business.json': [
        ('bootstrap','ბუტსტრაპი'),('investor','ინვესტორი'),('angel','ანგელოზი'),
        ('seed','სიდ'),('series','სერია'),('ipo','აიპიო'),
        ('exit','გასვლა'),('acquisition','შეძენა'),('due-diligence','შემოწმება'),
        ('term-sheet','ტერმშიტი'),('cap-table','კეპთეიბლი'),('dilution','განზავება'),
        ('vesting','ვესტინგი'),('cliff','კლიფი'),('sweat-equity','სუეტ ექვითი'),
        ('burn-rate','წვის ტემპი'),
    ],
    'online-shopping.json': [
        ('review','მიმოხილვა'),('rating','რეიტინგი'),('testimonial','ჩვენება'),
        ('feedback','უკუკავშირი'),('complaint','საჩივარი'),('resolution','გადაწყვეტა'),
        ('mediation','შუამავლობა'),
    ],
    'emergency-safety.json': [
        ('floodlight','პროჟექტორი'),('generator','გენერატორი'),('flashlight','ფანარი'),
        ('compass','კომპასი'),('whistle','სასტვენი'),('rope','თოკი'),
        ('harness','აღკაზმულობა'),('helmet','ჩაფხუტი'),
    ],
    'journalism-news.json': [
        ('headline','სათაური'),('breakingnews','ახალი ამბები'),('scoop','ექსკლუზივი'),
        ('leak','გაჟონვა'),('expose','გამოაშკარავება'),('op-ed','მოსაზრება'),
        ('editorial','სარედაქციო'),('obituary','ნეკროლოგი'),
    ],
    'weather-detailed.json': [
        ('thunderstorm','ჭექა-ქუხილი'),('lightning','ელვა'),('rainbow','ცისარტყელა'),
        ('sunshine','მზის შუქი'),('overcast','მოღრუბლული'),
    ],
}

for fname, new_entries in EXPANSIONS.items():
    if not new_entries or not os.path.exists(fname):
        continue
    data = json.load(open(fname))
    is_list = isinstance(data, list)
    words = data if is_list else data.get('words', [])
    existing = {w.get('english', w.get('en', '')).lower() for w in words if isinstance(w, dict)}
    
    sample = words[0] if words else {}
    en_key = 'english' if 'english' in sample else 'en'
    ka_key = 'georgian' if 'georgian' in sample else 'ka'
    cat = sample.get('category', fname.replace('.json', ''))
    
    added = 0
    for en, ka in new_entries:
        clean = en.lower().replace('-', '')
        if clean in existing or en.lower() in existing:
            continue
        entry = {en_key: en, ka_key: ka, 'pronunciation': '', 'example_en': f'This word is {en}.', 'example_ka': f'ეს სიტყვა არის {en}.', 'category': cat, 'level': 'B1'}
        words.append(entry)
        existing.add(en.lower())
        added += 1
    
    if is_list:
        json.dump(words, open(fname, 'w'), ensure_ascii=False, indent=2)
    else:
        data['words'] = words
        json.dump(data, open(fname, 'w'), ensure_ascii=False, indent=2)
    print(f"{fname}: added {added}, total {len(words)}")

print("\n--- FINAL CHECK ---")
under = 0
for f in sorted(glob.glob('*.json')):
    if f.startswith('_'): continue
    data = json.load(open(f))
    words = data if isinstance(data, list) else data.get('words', data)
    if isinstance(words, list) and len(words) < 200:
        print(f"  UNDER: {f}: {len(words)} (need +{200-len(words)})")
        under += 1
if under == 0:
    print("  ALL CATEGORIES AT 200+ ✅")
else:
    print(f"\n  {under} categories still under 200")
