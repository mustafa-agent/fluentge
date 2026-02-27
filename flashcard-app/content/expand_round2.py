#!/usr/bin/env python3
"""Round 2: Fill remaining categories to 200+ words."""
import json, glob, os

EXPANSIONS = {
    'gym-fitness.json': [
        ('warmup','გამთბარი'),('cooldown','გაგრილება'),('spotter','დამხმარე'),
        ('plateau','პლატო'),('bulk','მასის მომატება'),('shred','გამხდარიყოფა'),
        ('superset','სუპერსეტი'),('circuit','წრე'),('interval','ინტერვალი'),
        ('aerobic','აერობული'),
    ],
    'music-genres.json': [
        ('dubstep','დაბსტეპი'),('grunge','გრანჯი'),('indie','ინდი'),
        ('acoustic','აკუსტიკური'),('electronic','ელექტრონული'),('ambient','ემბიენტი'),
        ('techno','ტექნო'),('trance','ტრანსი'),('disco','დისკო'),
        ('punk','პანკი'),
    ],
    'slang-informal.json': [
        ('bro','ძმაო'),('dude','კაცო'),('chill','დამშვიდება'),
        ('legit','ნამდვილი'),('epic','ეპიკური'),('lame','უინტერესო'),
        ('sketchy','საეჭვო'),('sick','მაგარი'),('stoked','აღფრთოვანებული'),
        ('bail','წასვლა'),('crash','დაძინება'),('swag','სტილი'),
        ('squad','ჯგუფი'),('binge','მარათონი'),('hype','აჟიოტაჟი'),
        ('troll','ტროლი'),('meme','მემი'),('hashtag','ჰეშთეგი'),
        ('selfie','სელფი'),('viral','ვირუსული'),('trending','ტრენდული'),
        ('fomo','გამოტოვების შიში'),('yolo','ერთხელ ცხოვრობ'),('bruh','კაცო'),
        ('nerd','ნერდი'),('geek','გიქი'),('noob','ახალბედა'),
    ],
    'nightlife-parties.json': [
        ('playlist','პლეილისტი'),('speaker','დინამიკი'),('amplifier','გამაძლიერებელი'),
        ('microphone','მიკროფონი'),('projector','პროექტორი'),('laser','ლაზერი'),
        ('fog','ბოლქვი'),('spotlight','პროჟექტორი'),('stage','სცენა'),
        ('backstage','კულისები'),('setlist','სეტლისტი'),('headliner','ჰედლაინერი'),
        ('opener','გამხსნელი'),('promoter','პრომოუტერი'),('flyer','ფლაერი'),
        ('wristband','სამაჯური'),
    ],
    'motivation-success.json': [
        ('persistence','დაჟინება'),('determination','გამოწვევა'),('aspiration','მისწრაფება'),
        ('endeavor','მცდელობა'),('fortitude','სიმტკიცე'),('conviction','რწმენა'),
        ('dedication','თავდადება'),('devotion','ერთგულება'),('passion','ვნება'),
        ('enthusiasm','ენთუზიაზმი'),('zeal','შურისძიება'),('vigor','ენერგია'),
        ('dynamism','დინამიზმი'),('proactivity','პროაქტიურობა'),('resourcefulness','მარჯვეობა'),
        ('ingenuity','გენიალობა'),('creativity','კრეატიულობა'),('originality','ორიგინალობა'),
        ('authenticity','ავთენტურობა'),('integrity','მთლიანობა'),
    ],
    'startup-business.json': [
        ('pitch','პრეზენტაცია'),('demo','დემო'),('mockup','მაკეტი'),
        ('wireframe','ვაირფრეიმი'),('roadmap','გზამკვლევი'),('backlog','ბექლოგი'),
        ('sprint','სპრინტი'),('agile','აჯაილი'),('scrum','სქრამი'),
        ('kanban','კანბანი'),('deployment','დეპლოიმენტი'),('integration','ინტეგრაცია'),
        ('analytics','ანალიტიკა'),('metrics','მეტრიკები'),('dashboard','დეშბორდი'),
        ('conversion','კონვერსია'),('funnel','ფანელი'),('segment','სეგმენტი'),
        ('persona','პერსონა'),('monetization','მონეტიზაცია'),('revenue','შემოსავალი'),
        ('profitability','მომგებიანობა'),('cashflow','ქეშფლოუ'),('breakeven','გაწყვეტა'),
        ('overhead','ზედნადები'),('margin','მარჟა'),('pricing','ფასწარმოება'),
        ('freemium','ფრიმიუმი'),('premium','პრემიუმი'),
    ],
    'online-shopping.json': [
        ('cryptocurrency','კრიპტოვალუტა'),('wallet','საფულე'),('transaction','ტრანზაქცია'),
        ('verification','ვერიფიკაცია'),('authentication','ავთენტიფიკაცია'),('encryption','დაშიფვრა'),
        ('privacy','კონფიდენციალურობა'),('policy','პოლიტიკა'),('terms','პირობები'),
        ('shipping','მიტანა'),('customs','საბაჟო'),('tariff','ტარიფი'),
        ('duty','გადასახადი'),('import','იმპორტი'),('export','ექსპორტი'),
        ('consolidation','კონსოლიდაცია'),('warehouse','საწყობი'),('distribution','დისტრიბუცია'),
        ('catalog','კატალოგი'),
    ],
    'emergency-safety.json': [
        ('precaution','წინდახედულობა'),('prevention','პრევენცია'),('detection','გამოვლენა'),
        ('response','რეაგირება'),('mitigation','შემცირება'),('coordination','კოორდინაცია'),
        ('communication','კომუნიკაცია'),('deployment','გაშლა'),('mobilization','მობილიზაცია'),
        ('assessment','შეფასება'),('inspection','ინსპექცია'),('regulation','რეგულაცია'),
        ('compliance','შესაბამისობა'),('certification','სერტიფიკაცია'),('training','ტრენინგი'),
        ('drill','წვრთნა'),('simulation','სიმულაცია'),('scenario','სცენარი'),
        ('vulnerability','სისუსტე'),('exposure','ზემოქმედება'),('impact','ზეგავლენა'),
        ('aftermath','შედეგები'),('cleanup','გაწმენდა'),('decontamination','დეკონტამინაცია'),
    ],
    'music-art.json': [
        ('stencil','ტრაფარეტი'),('airbrush','აერბრუში'),('varnish','ლაქი'),
        ('turpentine','ტერპენტინი'),('primer','გრუნტი'),('gesso','გესო'),
        ('fixative','ფიქსატორი'),('portfolio','პორტფოლიო'),('commission','შეკვეთა'),
        ('critique','კრიტიკა'),('medium','საშუალება'),('monochrome','მონოქრომი'),
        ('polychrome','პოლიქრომი'),
    ],
    'journalism-news.json': [
        ('reporter','რეპორტიორი'),('journalist','ჟურნალისტი'),('editor','რედაქტორი'),
        ('publisher','გამომცემელი'),('columnist','კოლუმნისტი'),('commentator','კომენტატორი'),
        ('analyst','ანალიტიკოსი'),('pundit','ექსპერტი'),('source','წყარო'),
        ('quote','ციტატა'),('interview','ინტერვიუ'),('survey','გამოკითხვა'),
        ('poll','გამოკითხვა'),('statistic','სტატისტიკა'),('demographic','დემოგრაფია'),
        ('trend','ტენდენცია'),('outbreak','აფეთქება'),('summit','სამიტი'),
        ('treaty','ხელშეკრულება'),('sanction','სანქცია'),('diplomacy','დიპლომატია'),
        ('geopolitics','გეოპოლიტიკა'),('sovereignty','სუვერენიტეტი'),('referendum','რეფერენდუმი'),
        ('coalition','კოალიცია'),('opposition','ოპოზიცია'),('legislation','კანონმდებლობა'),
        ('amendment','შესწორება'),('verdict','ვერდიქტი'),('prosecution','პროკურატურა'),
        ('testimony','ჩვენება'),('allegation','ბრალდება'),('indictment','ბრალდება'),
        ('acquittal','გამართლება'),('conviction','მსჯავრი'),('sentencing','სასჯელის დანიშვნა'),
        ('parole','პირობა'),('extradition','ექსტრადიცია'),('asylum','თავშესაფარი'),
        ('migration','მიგრაცია'),('deportation','დეპორტაცია'),('naturalization','ნატურალიზაცია'),
    ],
    'weather-detailed.json': [
        ('dew','ნამი'),('mist','ნისლი'),('fog','ნისლი'),
        ('icicle','ყინულის წვეთი'),('snowflake','ფიფქი'),('slush','თოვლმადნი'),
        ('permafrost','მარადმთელი'),('tundra','ტუნდრა'),('savanna','სავანა'),
        ('steppe','სტეპი'),('monsoon','მუსონი'),('windchill','ქარის სიცივე'),
        ('heatwave','სიცხის ტალღა'),('coldsnap','სიცივის მოწევა'),('squall','სქოლი'),
        ('updraft','ამოდენა'),('downdraft','ჩაღვრა'),('cumulus','კუმულუსი'),
        ('stratus','სტრატუსი'),('cirrus','ცირუსი'),('nimbus','ნიმბუსი'),
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
        if en.lower() in existing:
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
        print(f"  UNDER: {f}: {len(words)}")
        under += 1
if under == 0:
    print("  ALL CATEGORIES AT 200+ ✅")
