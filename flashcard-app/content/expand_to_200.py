#!/usr/bin/env python3
"""Expand all categories to 200+ words with relevant single words."""
import json, glob, os

# Words to add per category (only single words, no phrases)
EXPANSIONS = {
    'work-business.json': [
        ('quota', 'კვოტა'), ('subordinate', 'დაქვემდებარებული'), ('tenure', 'თანამდებობის ვადა'),
        ('morale', 'მორალი'), ('synergy', 'სინერგია'), ('attrition', 'გადინება'),
        ('leverage', 'ბერკეტი'), ('benchmark', 'ნიშნული'), ('audit', 'აუდიტი'),
    ],
    'hobbies-free-time.json': [
        ('origami', 'ორიგამი'), ('pottery', 'კერამიკა'), ('archery', 'მშვილდოსნობა'),
        ('macrame', 'მაკრამე'), ('calligraphy', 'კალიგრაფია'), ('quilting', 'ქვილთინგი'),
        ('beading', 'მძივებით ქარგვა'), ('woodcarving', 'ხის კვეთა'), ('crochet', 'ხელით ქსოვა'),
        ('scrapbooking', 'ალბომის შექმნა'),
    ],
    'sports-games.json': [
        ('punt', 'დარტყმა'), ('rally', 'რალი'), ('bout', 'მატჩი'),
        ('stance', 'პოზიცია'), ('volley', 'ფრენით დარტყმა'), ('knockout', 'ნოკაუტი'),
        ('offside', 'ოფსაიდი'), ('overtime', 'დამატებითი დრო'), ('jersey', 'მაისური'),
    ],
    'gym-fitness.json': [
        ('plank', 'პლანკა'), ('lunge', 'ფეხის გადადგმა'), ('deadlift', 'დედლიფტი'),
        ('burpee', 'ბურპი'), ('crunch', 'კრანჩი'), ('pullup', 'შეკვრა'),
        ('pushup', 'ბიძგი'), ('squat', 'სქვატი'), ('cardio', 'კარდიო'),
        ('barbell', 'შტანგა'), ('dumbbell', 'ჰანტელი'), ('kettlebell', 'გირა'),
        ('treadmill', 'სარბენი ბილიკი'), ('elliptical', 'ელიპტური'), ('rowing', 'ნიჩბის ვარჯიში'),
        ('flexibility', 'მოქნილობა'), ('endurance', 'გამძლეობა'), ('intensity', 'ინტენსივობა'),
        ('resistance', 'წინააღმდეგობა'), ('repetition', 'გამეორება'),
    ],
    'music-genres.json': [
        ('tempo', 'ტემპო'), ('rhythm', 'რიტმი'), ('melody', 'მელოდია'),
        ('harmony', 'ჰარმონია'), ('bass', 'ბასი'), ('treble', 'დისკანტი'),
        ('pitch', 'სიმაღლე'), ('octave', 'ოქტავა'), ('chord', 'აკორდი'),
        ('riff', 'რიფი'), ('hook', 'ჰუკი'), ('bridge', 'ბრიჯი'),
        ('verse', 'კუპლეტი'), ('chorus', 'რეფრენი'), ('encore', 'ბისი'),
        ('ballad', 'ბალადა'), ('anthem', 'ჰიმნი'), ('lullaby', 'იავნანა'),
        ('serenade', 'სერენადა'), ('overture', 'უვერტიურა'), ('sonata', 'სონატა'),
        ('symphony', 'სიმფონია'), ('concerto', 'კონცერტო'), ('fugue', 'ფუგა'),
        ('prelude', 'პრელუდია'),
    ],
    'slang-informal.json': [
        ('vibe', 'ვაიბი'), ('flex', 'მოწონება'), ('salty', 'გაბრაზებული'),
        ('cap', 'ტყუილი'), ('ghosting', 'იგნორი'), ('cringe', 'სირცხვილი'),
        ('slay', 'მაგარი'), ('shade', 'შეურაცხყოფა'), ('receipts', 'მტკიცებულება'),
        ('lowkey', 'ფარულად'), ('highkey', 'აშკარად'), ('stan', 'ფანი'),
        ('clout', 'გავლენა'), ('drip', 'სტილი'), ('finesse', 'ოსტატობა'),
        ('glow', 'ბრწყინვა'), ('hustle', 'შრომა'), ('lit', 'მაგარი'),
        ('mood', 'განწყობა'), ('savage', 'უშიშარი'), ('shook', 'შოკში'),
        ('snack', 'ლამაზი'), ('tea', 'ჭორი'), ('thirsty', 'ყურადღების მოწყურებული'),
        ('woke', 'გაღვიძებული'), ('yeet', 'გადაგდება'), ('simp', 'დამორჩილებული'),
        ('bussin', 'გემრიელი'), ('sus', 'საეჭვო'), ('clutch', 'გადამწყვეტი'),
        ('bet', 'კარგი'), ('dope', 'მაგარი'), ('fam', 'ოჯახი'),
        ('goat', 'საუკეთესო'), ('snatched', 'იდეალური'),
    ],
    'nightlife-parties.json': [
        ('venue', 'ადგილი'), ('bouncer', 'დაცვა'), ('cocktail', 'კოქტეილი'),
        ('bartender', 'ბარმენი'), ('karaoke', 'კარაოკე'), ('strobe', 'სტრობი'),
        ('afterparty', 'ეფთერფარტი'), ('pregame', 'წინასწარი'), ('toast', 'სადღეგრძელო'),
        ('champagne', 'შამპანური'), ('hangover', 'ბოხი'), ('curfew', 'კომენდანტი'),
        ('lineup', 'რიგი'), ('guestlist', 'სტუმრების სია'), ('rave', 'რეივი'),
        ('festival', 'ფესტივალი'), ('encore', 'ბისი'), ('mingle', 'შერევა'),
        ('socialize', 'სოციალიზაცია'), ('dresscode', 'დრესკოდი'), ('cabaret', 'კაბარე'),
        ('reggae', 'რეგი'), ('salsa', 'სალსა'), ('limousine', 'ლიმუზინი'),
        ('sparkler', 'ბენგალური ცეცხლი'), ('confetti', 'კონფეტი'), ('streamer', 'ლენტი'),
        ('balloon', 'ბუშტი'), ('firework', 'ფეიერვერკი'), ('decoration', 'დეკორაცია'),
        ('invitation', 'მოწვევა'), ('celebration', 'ზეიმი'), ('anniversary', 'იუბილე'),
        ('milestone', 'მნიშვნელოვანი თარიღი'), ('reunion', 'შეხვედრა'), ('banquet', 'ბანკეტი'),
        ('buffet', 'ბუფეტი'),
    ],
    'motivation-success.json': [
        ('ambition', 'ამბიცია'), ('perseverance', 'შეუპოვრობა'), ('resilience', 'გამძლეობა'),
        ('tenacity', 'სიჟინჯე'), ('grit', 'სიმტკიცე'), ('hustle', 'შრომა'),
        ('grind', 'შრომა'), ('legacy', 'მემკვიდრეობა'), ('visionary', 'ხედვის მქონე'),
        ('breakthrough', 'გარღვევა'), ('milestone', 'ეტაპი'), ('momentum', 'იმპულსი'),
        ('catalyst', 'კატალიზატორი'), ('empowerment', 'გაძლიერება'), ('fulfillment', 'სრულყოფა'),
        ('accountability', 'პასუხისმგებლობა'), ('mindfulness', 'გონიერება'), ('gratitude', 'მადლიერება'),
        ('affirmation', 'დადასტურება'), ('intention', 'განზრახვა'), ('manifestation', 'მანიფესტაცია'),
        ('abundance', 'სიუხვე'), ('discipline', 'დისციპლინა'), ('consistency', 'თანმიმდევრობა'),
        ('sacrifice', 'მსხვერპლი'), ('willpower', 'ნებისყოფა'), ('stamina', 'გამძლეობა'),
        ('commitment', 'ერთგულება'), ('initiative', 'ინიციატივა'), ('innovation', 'ინოვაცია'),
        ('disruption', 'გარღვევა'), ('pivot', 'გადაბრუნება'), ('leverage', 'ბერკეტი'),
        ('optimization', 'ოპტიმიზაცია'), ('excellence', 'ბრწყინვალება'), ('mastery', 'ოსტატობა'),
        ('prowess', 'ოსტატობა'),
    ],
    'startup-business.json': [
        ('pivot', 'პივოტი'), ('valuation', 'შეფასება'), ('equity', 'წილი'),
        ('venture', 'ვენჩური'), ('incubator', 'ინკუბატორი'), ('accelerator', 'აქსელერატორი'),
        ('scalability', 'მასშტაბირება'), ('traction', 'ტრაქშენი'), ('acquisition', 'შეძენა'),
        ('disruption', 'დისრაფცია'), ('unicorn', 'უნიკორნი'), ('bootstrap', 'ბუტსტრაპი'),
        ('runway', 'რანვეი'), ('churn', 'გადინება'), ('retention', 'შენარჩუნება'),
        ('onboarding', 'ონბორდინგი'), ('iteration', 'იტერაცია'), ('prototype', 'პროტოტიპი'),
        ('stakeholder', 'დაინტერესებული'), ('pipeline', 'პაიპლაინი'), ('milestone', 'ეტაპი'),
        ('benchmark', 'ბენჩმარკი'), ('leverage', 'ბერკეტი'), ('outsource', 'აუთსორსი'),
        ('freelancer', 'ფრილანსერი'), ('consultant', 'კონსულტანტი'), ('advisory', 'საკონსულტაციო'),
        ('trademark', 'სავაჭრო ნიშანი'), ('patent', 'პატენტი'), ('copyright', 'საავტორო'),
        ('incorporation', 'რეგისტრაცია'), ('compliance', 'შესაბამისობა'), ('audit', 'აუდიტი'),
        ('dividend', 'დივიდენდი'), ('liquidation', 'ლიკვიდაცია'), ('bankruptcy', 'გაკოტრება'),
        ('restructuring', 'რესტრუქტურიზაცია'), ('merger', 'გაერთიანება'), ('subsidiary', 'შვილობილი'),
        ('conglomerate', 'კონგლომერატი'), ('franchise', 'ფრანჩაიზი'),
    ],
    'online-shopping.json': [
        ('checkout', 'გადახდა'), ('cart', 'კალათა'), ('wishlist', 'სურვილების სია'),
        ('coupon', 'კუპონი'), ('voucher', 'ვაუჩერი'), ('promo', 'პრომო'),
        ('cashback', 'ქეშბექი'), ('warranty', 'გარანტია'), ('refund', 'დაბრუნება'),
        ('tracking', 'თრექინგი'), ('shipment', 'გზავნილი'), ('dispatch', 'გაგზავნა'),
        ('inventory', 'ინვენტარი'), ('vendor', 'გამყიდველი'), ('supplier', 'მომწოდებელი'),
        ('marketplace', 'მარკეტპლეისი'), ('auction', 'აუქციონი'), ('bidding', 'ტენდერი'),
        ('subscription', 'გამოწერა'), ('membership', 'წევრობა'), ('premium', 'პრემიუმი'),
        ('wholesale', 'საბითუმო'), ('retail', 'საცალო'), ('markup', 'მარჟა'),
        ('clearance', 'გასუფთავება'), ('bestseller', 'ბესტსელერი'), ('preorder', 'წინასწარი შეკვეთა'),
        ('backorder', 'შეკვეთა'), ('stockout', 'ამოწურვა'), ('overstock', 'ჭარბი მარაგი'),
        ('dropshipping', 'დროპშიპინგი'), ('fulfillment', 'შესრულება'), ('logistics', 'ლოჯისტიკა'),
        ('packaging', 'შეფუთვა'), ('unboxing', 'ანბოქსინგი'), ('barcode', 'შტრიხკოდი'),
        ('receipt', 'ქვითარი'), ('invoice', 'ინვოისი'), ('installment', 'განვადება'),
        ('layaway', 'დაჯავშნა'), ('browse', 'დათვალიერება'), ('filter', 'ფილტრი'),
        ('sort', 'დალაგება'), ('comparison', 'შედარება'), ('recommendation', 'რეკომენდაცია'),
        ('notification', 'შეტყობინება'), ('newsletter', 'ნიუსლეთერი'), ('popup', 'პოპაპი'),
        ('banner', 'ბანერი'), ('affiliate', 'აფილიატი'), ('referral', 'რეფერალი'),
        ('loyalty', 'ლოიალობა'), ('rewards', 'ჯილდოები'), ('points', 'ქულები'),
        ('tier', 'საფეხური'), ('upgrade', 'გაუმჯობესება'),
    ],
    'emergency-safety.json': [
        ('evacuation', 'ევაკუაცია'), ('shelter', 'თავშესაფარი'), ('hazard', 'საფრთხე'),
        ('siren', 'სირენა'), ('alarm', 'განგაში'), ('extinguisher', 'ცეცხლმაქრი'),
        ('hydrant', 'ჰიდრანტი'), ('defibrillator', 'დეფიბრილატორი'), ('tourniquet', 'ტურნიკეტი'),
        ('splint', 'შინა'), ('gauze', 'მარლი'), ('bandage', 'ბინტი'),
        ('antiseptic', 'ანტისეპტიკი'), ('stretcher', 'სატრანსპორტო'), ('ambulance', 'სასწრაფო'),
        ('paramedic', 'პარამედიკოსი'), ('dispatcher', 'დისპეტჩერი'), ('responder', 'მაშველი'),
        ('casualty', 'მსხვერპლი'), ('triage', 'ტრიაჟი'), ('quarantine', 'კარანტინი'),
        ('lockdown', 'იზოლაცია'), ('blackout', 'გათიშვა'), ('outage', 'ავარია'),
        ('earthquake', 'მიწისძვრა'), ('tsunami', 'ცუნამი'), ('tornado', 'ტორნადო'),
        ('hurricane', 'ქარიშხალი'), ('avalanche', 'ზვავი'), ('landslide', 'მეწყერი'),
        ('wildfire', 'ტყის ხანძარი'), ('drought', 'გვალვა'), ('famine', 'შიმშილი'),
        ('epidemic', 'ეპიდემია'), ('pandemic', 'პანდემია'), ('contamination', 'დაბინძურება'),
        ('radiation', 'რადიაცია'), ('toxin', 'ტოქსინი'), ('antidote', 'ანტიდოტი'),
        ('vaccine', 'ვაქცინა'), ('inoculation', 'ინოკულაცია'), ('sanitation', 'სანიტარია'),
        ('disinfection', 'დეზინფექცია'), ('ventilation', 'ვენტილაცია'), ('surveillance', 'მეთვალყურეობა'),
        ('checkpoint', 'საგუშაგო'), ('barricade', 'ბარიკადა'), ('curfew', 'კომენდანტი'),
        ('reinforcement', 'გაძლიერება'), ('backup', 'სარეზერვო'), ('protocol', 'პროტოკოლი'),
        ('procedure', 'პროცედურა'), ('contingency', 'საგანგებო გეგმა'), ('preparedness', 'მზადყოფნა'),
        ('resilience', 'გამძლეობა'), ('recovery', 'აღდგენა'), ('reconstruction', 'რეკონსტრუქცია'),
        ('rehabilitation', 'რეაბილიტაცია'), ('relief', 'დახმარება'), ('donation', 'შემოწირულობა'),
    ],
    'music-art.json': [
        ('canvas', 'ტილო'), ('easel', 'მოლბერტი'), ('palette', 'პალიტრა'),
        ('brushstroke', 'ფუნჯის მოსმა'), ('pigment', 'პიგმენტი'), ('watercolor', 'აკვარელი'),
        ('acrylic', 'აკრილი'), ('charcoal', 'ნახშირი'), ('pastel', 'პასტელი'),
        ('sculpture', 'ქანდაკება'), ('mosaic', 'მოზაიკა'), ('fresco', 'ფრესკა'),
        ('mural', 'მურალი'), ('collage', 'კოლაჟი'), ('etching', 'გრავიურა'),
        ('lithograph', 'ლითოგრაფია'), ('silkscreen', 'შელკოგრაფია'), ('pottery', 'კერამიკა'),
        ('ceramics', 'კერამიკა'), ('glaze', 'მინანქარი'), ('kiln', 'ღუმელი'),
        ('loom', 'საქსოვი'), ('tapestry', 'გობელენი'), ('embroidery', 'ნაქარგი'),
        ('sketch', 'ესკიზი'), ('blueprint', 'ბლუპრინტი'), ('perspective', 'პერსპექტივა'),
        ('composition', 'კომპოზიცია'), ('contrast', 'კონტრასტი'), ('texture', 'ტექსტურა'),
        ('gradient', 'გრადიენტი'), ('silhouette', 'სილუეტი'), ('portrait', 'პორტრეტი'),
        ('landscape', 'პეიზაჟი'), ('abstract', 'აბსტრაქტი'), ('surrealism', 'სიურეალიზმი'),
        ('impressionism', 'იმპრესიონიზმი'), ('cubism', 'კუბიზმი'), ('minimalism', 'მინიმალიზმი'),
        ('baroque', 'ბაროკო'), ('renaissance', 'რენესანსი'), ('gothic', 'გოთური'),
        ('gallery', 'გალერეა'), ('exhibition', 'გამოფენა'), ('curator', 'კურატორი'),
        ('patron', 'პატრონი'), ('masterpiece', 'შედევრი'), ('replica', 'რეპლიკა'),
        ('forgery', 'გაყალბება'), ('restoration', 'რესტავრაცია'), ('installation', 'ინსტალაცია'),
        ('performance', 'პერფორმანსი'), ('aesthetic', 'ესთეტიკა'), ('avant-garde', 'ავანგარდი'),
        ('bohemian', 'ბოჰემური'), ('eclectic', 'ეკლექტიკური'), ('kitsch', 'კიტჩი'),
        ('provocative', 'პროვოკაციული'), ('evocative', 'შთამბეჭდავი'), ('whimsical', 'ფანტასტიკური'),
    ],
    'journalism-news.json': [
        ('headline', 'სათაური'), ('byline', 'ავტორი'), ('dateline', 'თარიღი'),
        ('editorial', 'სარედაქციო'), ('column', 'სვეტი'), ('op-ed', 'მოსაზრება'),
        ('obituary', 'ნეკროლოგი'), ('scoop', 'ექსკლუზივი'), ('leak', 'გაჟონვა'),
        ('whistleblower', 'მამხილებელი'), ('correspondent', 'კორესპონდენტი'), ('anchor', 'წამყვანი'),
        ('freelance', 'ფრილანსი'), ('stringer', 'სტრინგერი'), ('paparazzi', 'პაპარაცი'),
        ('tabloid', 'ტაბლოიდი'), ('broadsheet', 'ბროდშიტი'), ('circulation', 'ტირაჟი'),
        ('syndication', 'სინდიკაცია'), ('newsroom', 'ნიუსრუმი'), ('newscast', 'ახალი ამბები'),
        ('broadcast', 'მაუწყებლობა'), ('podcast', 'პოდკასტი'), ('livestream', 'პირდაპირი'),
        ('transcript', 'ტრანსკრიპტი'), ('caption', 'წარწერა'), ('infographic', 'ინფოგრაფიკა'),
        ('photojournalism', 'ფოტოჟურნალისტიკა'), ('investigative', 'საგამოძიებო'), ('expose', 'ექსპოზე'),
        ('retraction', 'უარყოფა'), ('correction', 'შესწორება'), ('defamation', 'ცილისწამება'),
        ('libel', 'ლიბელი'), ('slander', 'ცილისწამება'), ('censorship', 'ცენზურა'),
        ('propaganda', 'პროპაგანდა'), ('disinformation', 'დეზინფორმაცია'), ('misinformation', 'მცდარი ინფო'),
        ('factcheck', 'ფაქტების შემოწმება'), ('credibility', 'სანდოობა'), ('objectivity', 'ობიექტურობა'),
        ('impartiality', 'მიუკერძოებლობა'), ('accountability', 'ანგარიშვალდებულება'),
        ('transparency', 'გამჭვირვალობა'), ('ethics', 'ეთიკა'), ('confidentiality', 'კონფიდენციალურობა'),
        ('anonymity', 'ანონიმურობა'), ('plagiarism', 'პლაგიატი'), ('copyright', 'საავტორო'),
        ('paywall', 'პეივოლი'), ('subscription', 'გამოწერა'), ('advertisement', 'რეკლამა'),
        ('sponsorship', 'სპონსორობა'), ('clickbait', 'კლიკბეიტი'), ('sensationalism', 'სენსაციურობა'),
        ('bias', 'მიკერძოება'), ('narrative', 'ნარატივი'), ('perspective', 'პერსპექტივა'),
        ('coverage', 'გაშუქება'), ('briefing', 'ბრიფინგი'), ('press', 'პრესა'),
        ('embargo', 'ემბარგო'),
    ],
    'weather-detailed.json': [
        ('drizzle', 'წვიმა'), ('downpour', 'თავსხმა'), ('hailstone', 'სეტყვა'),
        ('sleet', 'ფიფქი'), ('blizzard', 'ქარბუქი'), ('frost', 'ყინვა'),
        ('thaw', 'დნობა'), ('humidity', 'ტენიანობა'), ('breeze', 'ნიავი'),
        ('gust', 'ქარი'), ('gale', 'ქარიშხალი'), ('cyclone', 'ციკლონი'),
        ('monsoon', 'მუსონი'), ('tornado', 'ტორნადო'), ('typhoon', 'ტაიფუნი'),
        ('barometer', 'ბარომეტრი'), ('thermometer', 'თერმომეტრი'), ('forecast', 'პროგნოზი'),
        ('precipitation', 'ნალექი'), ('condensation', 'კონდენსაცია'), ('evaporation', 'აორთქლება'),
        ('atmosphere', 'ატმოსფერო'), ('stratosphere', 'სტრატოსფერო'), ('troposphere', 'ტროპოსფერო'),
        ('celsius', 'ცელსიუსი'), ('fahrenheit', 'ფარენჰაიტი'), ('latitude', 'განედი'),
        ('longitude', 'გრძედი'), ('altitude', 'სიმაღლე'), ('climate', 'კლიმატი'),
        ('microclimate', 'მიკროკლიმატი'), ('arid', 'მშრალი'), ('humid', 'ტენიანი'),
        ('temperate', 'ზომიერი'), ('tropical', 'ტროპიკული'), ('polar', 'პოლარული'),
        ('equatorial', 'ეკვატორული'), ('continental', 'კონტინენტური'), ('maritime', 'საზღვაო'),
        ('solstice', 'მზებუდობა'), ('equinox', 'ბუნიობა'), ('aurora', 'ავრორა'),
        ('rainbow', 'ცისარტყელა'), ('haze', 'ნისლი'), ('smog', 'სმოგი'),
        ('overcast', 'მოღრუბლული'), ('clearing', 'გარკვევა'), ('sunshine', 'მზის სხივი'),
    ],
    'mental-health.json': [],  # Already at 200+
}

for fname, new_entries in EXPANSIONS.items():
    if not new_entries:
        continue
    if not os.path.exists(fname):
        print(f"SKIP: {fname} not found")
        continue
    
    data = json.load(open(fname))
    is_list = isinstance(data, list)
    words = data if is_list else data.get('words', [])
    
    existing = {w.get('english', w.get('en', '')).lower() for w in words if isinstance(w, dict)}
    
    # Detect field names from first entry
    sample = words[0] if words else {}
    en_key = 'english' if 'english' in sample else 'en'
    ka_key = 'georgian' if 'georgian' in sample else 'ka'
    cat = sample.get('category', fname.replace('.json', ''))
    
    added = 0
    for en, ka in new_entries:
        if en.lower() in existing:
            continue
        entry = {
            en_key: en,
            ka_key: ka,
            'pronunciation': '',
            'example_en': f'This word is {en}.',
            'example_ka': f'ეს სიტყვა არის {en}.',
            'category': cat,
            'level': 'B1'
        }
        words.append(entry)
        existing.add(en.lower())
        added += 1
    
    if is_list:
        json.dump(words, open(fname, 'w'), ensure_ascii=False, indent=2)
    else:
        data['words'] = words
        json.dump(data, open(fname, 'w'), ensure_ascii=False, indent=2)
    
    print(f"{fname}: added {added}, total {len(words)}")

# Final check
print("\n--- FINAL CHECK ---")
for f in sorted(glob.glob('*.json')):
    if f.startswith('_'): continue
    data = json.load(open(f))
    words = data if isinstance(data, list) else data.get('words', data)
    if isinstance(words, list) and len(words) < 200:
        print(f"  STILL UNDER: {f}: {len(words)}")
