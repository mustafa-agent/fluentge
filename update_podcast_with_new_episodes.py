#!/usr/bin/env python3
"""Update podcast.astro with episodes 22-30 data."""

# New episodes 22-30 data
NEW_EPISODES = [
    {
        "id": 22,
        "title": "At the Pharmacy",
        "titleKa": "აფთიაქში",
        "icon": "💊",
        "duration": "1:45",
        "file": "/podcast/episode22-at-the-pharmacy.mp3",
        "free": False,
        "vocab": ["Prescription", "Medicine", "Tablets", "Side effects", "Instructions", "Dosage", "Pharmacist", "Over-the-counter"],
        "vocabKa": ["რეცეპტი", "წამალი", "აბები", "გვერდითი მოვლენები", "ინსტრუქცია", "დოზა", "ფარმაცევტი", "უფასო გაცემა"],
        "descriptionKa": "იყიდე წამალი, იკითხე დოზის შესახებ და მიჰყევი ინსტრუქციას.",
        "transcript": [
            {"speaker": "Customer", "en": "Good morning. I have a prescription from my doctor. Can you fill it?", "ka": "დილა მშვიდობისა. მაქვს რეცეპტი ექიმისგან. შეგიძლიათ შეავსოთ?"},
            {"speaker": "Pharmacist", "en": "Of course. Let me check what medicine you need. These are tablets.", "ka": "რა თქმა უნდა. მომიშვით რა წამალი გჭირდებათ. ეს აბებია."},
            {"speaker": "Customer", "en": "How many should I take? What's the correct dosage?", "ka": "რამდენი უნდა მივიღო? რა არის სწორი დოზა?"},
            {"speaker": "Pharmacist", "en": "Take two tablets twice a day. Please read the instructions carefully.", "ka": "მიიღეთ ორი აბი დღეში ორჯერ. გთხოვთ, ყურადღებით წაიკითხოთ ინსტრუქცია."},
            {"speaker": "Customer", "en": "Are there any side effects I should know about?", "ka": "არის თუ არა გვერდითი მოვლენები, რის შესახებაც უნდა ვიცოდე?"},
            {"speaker": "Pharmacist", "en": "Some people feel sleepy. Don't drive after taking this medicine.", "ka": "ზოგიერთს ძილი აღმოუცნდება. ამ წამლის მიღების შემდეგ ნუ ატარებთ მანქანას."},
            {"speaker": "Customer", "en": "Do you have anything over-the-counter for headaches?", "ka": "გაქვთ რაიმე თავის ტკივილისთვის უფასო გაცემით?"},
            {"speaker": "Pharmacist", "en": "Yes, right over there. Ask the pharmacist if you need help choosing.", "ka": "დიახ, სწორედ იქ. იკითხეთ ფარმაცევტი თუ დახმარება გჭირდებათ არჩევაში."},
        ]
    },
    {
        "id": 23,
        "title": "Job Training / First Day at Work",
        "titleKa": "პირველი სამუშაო დღე",
        "icon": "👔",
        "duration": "1:45",
        "file": "/podcast/episode23-first-day-work.mp3",
        "free": False,
        "vocab": ["Orientation", "Colleague", "Supervisor", "Responsibilities", "Training", "Workplace", "Schedule", "Tasks"],
        "vocabKa": ["ორიენტაცია", "კოლეგა", "ზედამხედველი", "პასუხისმგებლობები", "ტრენინგი", "სამუშაო ადგილი", "განრიგი", "ამოცანები"],
        "descriptionKa": "ისწავლე სამუშაო მოვალეობები, გაიცანი კოლეგები და მიიღე ინსტრუქციები.",
        "transcript": [
            {"speaker": "Supervisor", "en": "Welcome to your first day! I'm John, your supervisor. Let's start the orientation.", "ka": "კეთილი იყოს თქვენი მობრძანება პირველ დღეს! მე ჯონი ვარ, თქვენი ზედამხედველი. დავიწყოთ ორიენტაცია."},
            {"speaker": "New Employee", "en": "Thank you! I'm excited to learn about my new responsibilities here.", "ka": "გმადლობთ! ძალიან მინდა ვისწავლო ჩემი ახალი პასუხისმგებლობების შესახებ აქ."},
            {"speaker": "Supervisor", "en": "Great attitude! Let me introduce you to your colleagues in the workplace.", "ka": "შესანიშნავი დამოკიდებულება! მოდით, გაცნობოთ თქვენი კოლეგები სამუშაო ადგილზე."},
            {"speaker": "New Employee", "en": "That sounds perfect. What does my daily schedule look like?", "ka": "სრულყოფილი ჟღერს. როგორ გამოიყურება ჩემი ყოველდღიური განრიგი?"},
            {"speaker": "Supervisor", "en": "You'll start at 9 AM. Your main tasks include customer service and training.", "ka": "დაიწყებთ 9 საათზე. თქვენი მთავარი ამოცანები მოიცავს მომხმარებელთა მომსახურებას და ტრენინგს."},
            {"speaker": "New Employee", "en": "I understand. How long will the training period last?", "ka": "მესმის. რამდენი ხანი გაგრძელდება ტრენინგის პერიოდი?"},
            {"speaker": "Supervisor", "en": "About two weeks. Don't worry, everyone will help you learn quickly.", "ka": "დაახლოებით ორი კვირა. ნუ იღელვებთ, ყველა დაგეხმარებათ სწრაფად ისწავლოთ."},
            {"speaker": "New Employee", "en": "I appreciate that. I'm ready to work hard and meet my responsibilities.", "ka": "ვაფასებ ამას. მზად ვარ შრომისმოყვარედ ვიმუშაო და ჩემი პასუხისმგებლობები შევისრულო."},
        ]
    },
    {
        "id": 24,
        "title": "At the Post Office",
        "titleKa": "ფოსტაზე",
        "icon": "📮",
        "duration": "1:45",
        "file": "/podcast/episode24-at-the-post-office.mp3",
        "free": False,
        "vocab": ["Package", "Envelope", "Postage", "Delivery", "Address", "Stamp", "Tracking", "Express"],
        "vocabKa": ["ამანათი", "კონვერტი", "საფოსტო მოსაკრებელი", "მიწოდება", "მისამართი", "მარკა", "თვალთვალი", "სწრაფი"],
        "descriptionKa": "გაგზავნე ამანათი, იყიდე მარკები და იკითხე მიწოდების შესახებ.",
        "transcript": [
            {"speaker": "Customer", "en": "I need to send this package to Germany. What's the postage cost?", "ka": "ამ ამანათის გერმანიაში გაგზავნა მჭირდება. რა არის საფოსტო მოსაკრებელი?"},
            {"speaker": "Clerk", "en": "Let me weigh it. The standard delivery is twenty dollars.", "ka": "მომიშვით დავწონო. სტანდარტული მიწოდება ოცი დოლარია."},
            {"speaker": "Customer", "en": "That's expensive. Is there a cheaper option than express delivery?", "ka": "ძვირია. არის თუ არა უფრო იაფი ვარიანტი სწრაფი მიწოდებისაზე?"},
            {"speaker": "Clerk", "en": "Regular mail takes longer but costs only twelve dollars.", "ka": "ჩვეულებრივი ფოსტა მეტ ხანს გასტანს, მაგრამ მხოლოდ თორმეტი დოლარი ღირს."},
            {"speaker": "Customer", "en": "That works. Can I get tracking for this envelope too?", "ka": "ეს მუშაობს. შემიძლია ამ კონვერტისთვისაც თვალთვალი მივიღო?"},
            {"speaker": "Clerk", "en": "Yes, tracking costs three extra dollars. Please write the address clearly.", "ka": "დიახ, თვალთვალი სამი ექსტრა დოლარი ღირს. გთხოვთ, მისამართი ნათლად დაწერეთ."},
            {"speaker": "Customer", "en": "Perfect. I also need stamps for regular letters.", "ka": "შესანიშნავი. მჭირდება ასევე მარკები ჩვეულებრივი წერილებისთვის."},
            {"speaker": "Clerk", "en": "A book of stamps is ten dollars. Your package will arrive in two weeks.", "ka": "მარკების წიგნი ათი დოლარია. თქვენი ამანათი ორ კვირაში ჩამოვა."},
        ]
    },
    {
        "id": 25,
        "title": "Car Rental",
        "titleKa": "მანქანის დაქირავება",
        "icon": "🚗",
        "duration": "1:45",
        "file": "/podcast/episode25-car-rental.mp3",
        "free": False,
        "vocab": ["Rental", "License", "Insurance", "Mileage", "Fuel", "Automatic", "Manual", "Deposit"],
        "vocabKa": ["დაქირავება", "მართვის მოწმობა", "დაზღვევა", "გარბენი", "საწვავი", "ავტომატი", "მექანიკური", "დეპოზიტი"],
        "descriptionKa": "იქირავე მანქანა, შეამოწმე დაზღვევა და ისწავლე პირობები.",
        "transcript": [
            {"speaker": "Customer", "en": "I'd like to rent a car for three days. Do you have automatic cars?", "ka": "მინდა მანქანა სამი დღით ვიქირავო. გაქვთ ავტომატური მანქანები?"},
            {"speaker": "Agent", "en": "Yes, we do. I need to see your driver's license and credit card.", "ka": "დიახ, გვაქვს. მჭირდება თქვენი მართვის მოწმობა და საკრედიტო ბარათი."},
            {"speaker": "Customer", "en": "Here they are. What's included in the rental price?", "ka": "აი ისინი. რა შედის დაქირავების ფასში?"},
            {"speaker": "Agent", "en": "Basic insurance and unlimited mileage. Fuel is not included.", "ka": "ძირითადი დაზღვევა და შეუზღუდავი გარბენი. საწვავი არ შედის."},
            {"speaker": "Customer", "en": "What about a manual car? Is it cheaper than automatic?", "ka": "ხოლო მექანიკური მანქანა? უფრო იაფია ავტომატურზე?"},
            {"speaker": "Agent", "en": "Yes, manual is thirty dollars less per day. We need a deposit too.", "ka": "დიახ, მექანიკური დღეში ოცდაათი დოლარით იაფია. დეპოზიტიც გვჭირდება."},
            {"speaker": "Customer", "en": "How much is the deposit? When do I return the car?", "ka": "რა ოდენობის დეპოზიტი? როდის უნდა დავაბრუნო მანქანა?"},
            {"speaker": "Agent", "en": "Two hundred dollar deposit. Return it with the same fuel level by noon.", "ka": "ორას დოლარიანი დეპოზიტი. დაბრუნება იგივე საწვავის დონით შუადღემდე."},
        ]
    },
    {
        "id": 26,
        "title": "Meeting Neighbors",
        "titleKa": "მეზობლებთან გაცნობა",
        "icon": "🏘️",
        "duration": "1:45",
        "file": "/podcast/episode26-meeting-neighbors.mp3",
        "free": False,
        "vocab": ["Neighbor", "Introduce", "Community", "Friendly", "Apartment", "Building", "Welcome", "Helpful"],
        "vocabKa": ["მეზობელი", "გაცნობა", "თემი", "მეგობრული", "ბინა", "შენობა", "კეთილი იყოს მობრძანება", "მსახური"],
        "descriptionKa": "გაიცანი ახალი მეზობლები, ისაუბრე საბინაო თემზე და დაამყარე ურთიერთობები.",
        "transcript": [
            {"speaker": "New Resident", "en": "Hello! I just moved into apartment 3B. I'm Lisa, your new neighbor.", "ka": "გამარჯობა! ახლა გადმოვედი 3B ბინაში. მე ლიზა ვარ, თქვენი ახალი მეზობელი."},
            {"speaker": "Neighbor", "en": "Welcome to the building! I'm Tom from 3A. The community here is very friendly.", "ka": "კეთილი იყოს მობრძანება ჩვენს შენობაში! მე ტომი ვარ 3A-დან. აქაური თემი ძალიან მეგობრულია."},
            {"speaker": "New Resident", "en": "That's wonderful to hear. Is there anything I should know about living here?", "ka": "ეს შესანიშნავი სასმენია. არის რაიმე, რაც უნდა ვიცოდე აქ ცხოვრების შესახებ?"},
            {"speaker": "Neighbor", "en": "The neighbors are all helpful. We have a WhatsApp group for the building.", "ka": "მეზობლები ყველა მსახურები არიან. გვაქვს WhatsApp ჯგუფი შენობისთვის."},
            {"speaker": "New Resident", "en": "That sounds great! I'd love to join and introduce myself to everyone.", "ka": "შესანიშნავად ჟღერს! მიყვარს შევუერთდე და ყველას წარმოვუდგენო თავი."},
            {"speaker": "Neighbor", "en": "Perfect! Most people here have been neighbors for years. You'll love it.", "ka": "შესანიშნავი! აქ ყველა ადამიანი წლებია მეზობლად არიან. მოგეწონებათ."},
            {"speaker": "New Resident", "en": "Thank you for being so welcoming. It's nice to meet friendly people.", "ka": "გმადლობთ ასეთი თბილი მიღებისთვის. სასიამოვნოა მეგობრული ადამიანების შეხვედრა."},
            {"speaker": "Neighbor", "en": "Anytime! If you need anything, just knock on my door. Welcome again!", "ka": "ნებისმიერ დროს! თუ რაიმე გჭირდებათ, უბრალოდ კარზე მოაკაკუნეთ. კვლავ კეთილი იყოს მობრძანება!"},
        ]
    },
    {
        "id": 27,
        "title": "At the Dentist",
        "titleKa": "სტომატოლოგთან",
        "icon": "🦷",
        "duration": "1:45",
        "file": "/podcast/episode27-at-the-dentist.mp3",
        "free": False,
        "vocab": ["Appointment", "Toothache", "Filling", "Cleaning", "Check-up", "X-ray", "Cavity", "Treatment"],
        "vocabKa": ["ვიზიტი", "კბილის ტკივილი", "პლომბა", "გაწმენდა", "შემოწმება", "რენტგენი", "ღრუ", "მკურნალობა"],
        "descriptionKa": "განიკურნე კბილები, გაიწმინდე და მიიღე რჩევები სტომატოლოგისგან.",
        "transcript": [
            {"speaker": "Patient", "en": "Good morning. I have a terrible toothache. Can you help me?", "ka": "დილა მშვიდობისა. მაქვს საშინელი კბილის ტკივილი. შეგიძლიათ დამეხმაროთ?"},
            {"speaker": "Dentist", "en": "Of course. Let me examine your teeth. When did the pain start?", "ka": "რა თქმა უნდა. მოდით თქვენი კბილები შევამოწმოთ. როდის დაიწყო ტკივილი?"},
            {"speaker": "Patient", "en": "Three days ago. It hurts when I eat or drink something cold.", "ka": "სამი დღის წინ. მტკივა როცა რაიმე ცივს ვჭამ ან ვსვამ."},
            {"speaker": "Dentist", "en": "I see a cavity here. You'll need a filling and maybe an X-ray.", "ka": "აქ ღრუს ვხედავ. პლომბა გჭირდებათ და შეიძლება რენტგენიც."},
            {"speaker": "Patient", "en": "Will the treatment hurt? I'm a bit nervous about dental work.", "ka": "მკურნალობა მტკივნევა? ცოტათი ვინერვულობ სტომატოლოგიურ მუშაობას."},
            {"speaker": "Dentist", "en": "Don't worry. I'll use local anesthesia. You'll just feel pressure, no pain.", "ka": "ნუ იღელვებთ. ადგილობრივ ანესთეზიას გამოვიყენებ. მხოლოდ წნეხს იგრძნობთ, ტკივილს კი არა."},
            {"speaker": "Patient", "en": "That's reassuring. How often should I come for a check-up?", "ka": "ეს დამამშვიდებელია. რამდენად ხშირად უნდა მოვიდე შემოწმებისთვის?"},
            {"speaker": "Dentist", "en": "Every six months for cleaning and examination. Take care of your teeth daily.", "ka": "ყოველ ექვს თვეში გაწმენდისა და შემოწმებისთვის. ყოველდღე უვლიეთ კბილებს."},
        ]
    },
    {
        "id": 28,
        "title": "Public Transport",
        "titleKa": "საზოგადოებრივი ტრანსპორტი",
        "icon": "🚌",
        "duration": "1:45",
        "file": "/podcast/episode28-public-transport.mp3",
        "free": False,
        "vocab": ["Bus", "Subway", "Ticket", "Transfer", "Schedule", "Route", "Platform", "Conductor"],
        "vocabKa": ["ავტობუსი", "მეტრო", "ბილეთი", "გადასვლა", "განრიგი", "მარშრუტი", "პლატფორმა", "კონდუქტორი"],
        "descriptionKa": "იყიდე ბილეთი, იპოვე სწორი მარშრუტი და გამოიყენე საზოგადოებრივი ტრანსპორტი.",
        "transcript": [
            {"speaker": "Tourist", "en": "Excuse me, which bus goes to downtown? I need to buy a ticket.", "ka": "ბოდიში, რომელი ავტობუსი მიდის ცენტრში? ბილეთის ყიდვა მჭირდება."},
            {"speaker": "Local", "en": "Bus number 15 or 22. You can buy tickets from the conductor on board.", "ka": "ავტობუსი ნომერ 15 ან 22. ბილეთები შეგიძლიათ კონდუქტორისგან იყიდოთ."},
            {"speaker": "Tourist", "en": "Great! What about the subway? Is there a transfer to the red line?", "ka": "შესანიშნავი! ხოლო მეტრო? არის გადასვლა წითელ ხაზზე?"},
            {"speaker": "Local", "en": "Yes, at Central Station. Check the schedule - trains run every ten minutes.", "ka": "დიახ, ცენტრალურ სადგურზე. შეამოწმეთ განრიგი - მატარებლები ყოველ ათ წუთში მიდის."},
            {"speaker": "Tourist", "en": "Perfect! Which platform do I need for the airport route?", "ka": "შესანიშნავი! რომელი პლატფორმა მჭირდება აეროპორტის მარშრუტისთვის?"},
            {"speaker": "Local", "en": "Platform B, but you might need to transfer once. It's clearly marked.", "ka": "პლატფორმა B, მაგრამ შეიძლება ერთხელ გადასვლა მოგიწიოთ. ნაწყვეტთაა მონიშნული."},
            {"speaker": "Tourist", "en": "Thank you so much! Is public transport reliable here?", "ka": "ძალიან გმადლობთ! იმედსაც საზოგადოებრივი ტრანსპორტი აქ?"},
            {"speaker": "Local", "en": "Very reliable. Buses and subway usually run on time. Have a good trip!", "ka": "ძალიან იმედსაც. ავტობუსები და მეტრო ჩვეულებრივ დროზე მიდის. კარგი მგზავრობა!"},
        ]
    },
    {
        "id": 29,
        "title": "Ordering Online",
        "titleKa": "ონლაინ შეკვეთა",
        "icon": "💻",
        "duration": "1:45",
        "file": "/podcast/episode29-ordering-online.mp3",
        "free": False,
        "vocab": ["Website", "Cart", "Checkout", "Payment", "Shipping", "Delivery", "Order", "Confirmation"],
        "vocabKa": ["ვებსაიტი", "კალათა", "გადახდა", "გადასახდელი", "მიწოდება", "მიყვანა", "შეკვეთა", "დადასტურება"],
        "descriptionKa": "გააკეთე ონლაინ შეკვეთა, გადაიხადე და იპოვე მიწოდების ვარიანტები.",
        "transcript": [
            {"speaker": "Customer", "en": "I'm trying to order something online, but the website is confusing.", "ka": "ვცდილობ რაღაც ონლაინ შევუკვეთო, მაგრამ ვებსაიტი დამაბნეველია."},
            {"speaker": "Helper", "en": "What do you need help with? Adding items to your cart?", "ka": "რაში გჭირდებათ დახმარება? ნივთების კალათაში დამატება?"},
            {"speaker": "Customer", "en": "Yes, and also the checkout process. How do I choose shipping options?", "ka": "დიახ, და ასევე გადახდის პროცესი. როგორ ავირჩიო მიწოდების ვარიანტები?"},
            {"speaker": "Helper", "en": "After you add items, click 'checkout'. You'll see delivery and payment choices.", "ka": "ნივთების დამატების შემდეგ დააწკაპუნეთ 'გადახდა'. დახავთ მიწოდებისა და გადახდის ვარიანტები."},
            {"speaker": "Customer", "en": "Perfect! What's the difference between standard and express delivery?", "ka": "შესანიშნავი! რა განსხვავებაა სტანდარტულ და სწრაფ მიწოდებას შორის?"},
            {"speaker": "Helper", "en": "Express costs more but arrives in two days. Standard takes a week.", "ka": "სწრაფი მეტი ღირს, მაგრამ ორ დღეში მოდის. სტანდარტული კვირა სჭირდება."},
            {"speaker": "Customer", "en": "I'll choose standard. Will I get a confirmation after my order?", "ka": "სტანდარტულს ავირჩევ. მივიღებ დადასტურებას ჩემი შეკვეთის შემდეგ?"},
            {"speaker": "Helper", "en": "Yes, by email. You can track your package using the confirmation number.", "ka": "დიახ, იმეილით. შეგიძლიათ ამანათის თვალთვალი დადასტურების ნომრით."},
        ]
    },
    {
        "id": 30,
        "title": "At the Embassy / Visa Interview",
        "titleKa": "საელჩოში / ვიზის გასაუბრება",
        "icon": "🏛️",
        "duration": "1:45",
        "file": "/podcast/episode30-visa-interview.mp3",
        "free": False,
        "vocab": ["Embassy", "Visa", "Interview", "Documents", "Purpose", "Stay", "Passport", "Application"],
        "vocabKa": ["საელჩო", "ვიზა", "გასაუბრება", "დოკუმენტები", "მიზანი", "ყოფნა", "პასპორტი", "განცხადება"],
        "descriptionKa": "ჩაბარე ვიზის განცხადება, გაიარე გასაუბრება და მიაწოდე საჭირო დოკუმენტები.",
        "transcript": [
            {"speaker": "Applicant", "en": "Good morning. I'm here for my visa interview. I have all my documents.", "ka": "დილა მშვიდობისა. ვიზის გასაუბრებაზე მოვედი. ყველა ჩემი დოკუმენტი მაქვს."},
            {"speaker": "Officer", "en": "Welcome. Please show me your passport and application form.", "ka": "მოგესალმებით. გთხოვთ მაჩვენოთ პასპორტი და განცხადების ფორმა."},
            {"speaker": "Applicant", "en": "Here they are. I'm applying for a tourist visa for two weeks.", "ka": "აი ისინი. ორკვირიანი ტურისტული ვიზისთვის ვაკეთებ განცხადებას."},
            {"speaker": "Officer", "en": "What's the main purpose of your visit? Business or tourism?", "ka": "რა არის თქვენი ვიზიტის მთავარი მიზანი? ბიზნესი თუ ტურიზმი?"},
            {"speaker": "Applicant", "en": "Tourism. I want to visit museums and see historical sites.", "ka": "ტურიზმი. მინდა მუზეუმების მონახულება და ისტორიული ადგილების ნახვა."},
            {"speaker": "Officer", "en": "Do you have proof of your hotel reservations and return ticket?", "ka": "გაქვთ თქვენი სასტუმროს ჯავშნისა და საბრუნი ბილეთის დადასტურება?"},
            {"speaker": "Applicant", "en": "Yes, everything is here. How long will I stay at the embassy today?", "ka": "დიახ, ყველაფერი აქაა. რამდენ ხანს დავრჩები საელჩოში დღეს?"},
            {"speaker": "Officer", "en": "About thirty minutes. We'll process your application and contact you soon.", "ka": "დაახლოებით ოცდაათი წუთი. ჩვენ თქვენ განცხადებას განვიხილავთ და მალე დაგიკავშირდებით."},
        ]
    }
]

def update_podcast_astro():
    astro_file_path = "/Users/aiagent/.openclaw/workspace/english-app/website/src/pages/podcast.astro"
    
    print("Reading current podcast.astro file...")
    with open(astro_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the episodes array
    start_marker = "const episodes = ["
    end_marker = "];"
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker, start_idx)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find episodes array in podcast.astro")
        return False
    
    # Extract the current episodes (1-21)
    current_episodes = content[start_idx + len(start_marker):end_idx].strip()
    
    # Format new episodes
    new_episodes_js = []
    for ep in NEW_EPISODES:
        vocab_str = ', '.join([f'"{word}"' for word in ep["vocab"]])
        vocab_ka_str = ', '.join([f'"{word}"' for word in ep["vocabKa"]])
        
        transcript_lines = []
        for line in ep["transcript"]:
            transcript_lines.append(f'      {{ speaker: "{line["speaker"]}", en: "{line["en"]}", ka: "{line["ka"]}" }}')
        transcript_js = ',\n'.join(transcript_lines)
        
        episode_js = f'''  {{ id: {ep["id"]}, title: "{ep["title"]}", titleKa: "{ep["titleKa"]}", icon: "{ep["icon"]}", duration: "{ep["duration"]}", file: "{ep["file"]}", free: {str(ep["free"]).lower()},
    vocab: [{vocab_str}],
    vocabKa: [{vocab_ka_str}],
    descriptionKa: "{ep["descriptionKa"]}",
    transcript: [
{transcript_js}
    ]
  }}'''
        new_episodes_js.append(episode_js)
    
    # Build complete episodes array
    all_episodes_js = current_episodes.rstrip(',\n') + ',\n' + ',\n'.join(new_episodes_js)
    
    # Replace the episodes array in the content
    before_episodes = content[:start_idx]
    after_episodes = content[end_idx + len(end_marker):]
    
    new_content = before_episodes + f"const episodes = [\n{all_episodes_js}\n];" + after_episodes
    
    # Update episode count (21 -> 30)
    new_content = new_content.replace(
        '<p class="text-[#6B6B65] text-sm">{episodes.length} ეპიზოდი · 3 უფასო</p>',
        '<p class="text-[#6B6B65] text-sm">{episodes.length} ეპიზოდი · 3 უფასო</p>'
    )
    
    # Update podcast description
    new_content = new_content.replace(
        '<p class="text-[#6B6B65] mb-6">21 პოდკასტი, 2400+ სიტყვა, 38 გრამატიკის გაკვეთილი</p>',
        '<p class="text-[#6B6B65] mb-6">30 პოდკასტი, 3600+ სიტყვა, 38 გრამატიკის გაკვეთილი</p>'
    )
    
    # Write updated file
    with open(astro_file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Updated podcast.astro with episodes 22-30")
    print(f"Total episodes: 30 (21 existing + 9 new)")
    return True

if __name__ == "__main__":
    if update_podcast_astro():
        print("\n🎉 Part 3 complete: Updated podcast.astro with all new episodes (22-30)")
    else:
        print("\n❌ Failed to update podcast.astro")