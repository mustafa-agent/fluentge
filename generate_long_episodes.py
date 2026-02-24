#!/usr/bin/env python3
"""Generate long-form podcast episodes (5-10 min) with edge-tts."""
import asyncio
import edge_tts
import os
import json

OUTPUT_DIR = "/Users/aiagent/.openclaw/workspace/english-app/podcast"

# Long-form episodes: teacher explains, gives examples, practice exercises
EPISODES = [
    {
        "id": 31,
        "title": "English Tenses Masterclass",
        "titleKa": "ინგლისური დროების მასტერკლასი",
        "icon": "📚",
        "filename": "episode31-tenses-masterclass.mp3",
        "voice": "en-US-GuyNeural",
        "script": """
Welcome to FluentGe Long Episode number one: English Tenses Masterclass.

Today we will learn the most important English tenses. This is a longer lesson, so get comfortable and listen carefully. I will explain each tense, give you examples, and then you can practice.

Let's start with the Present Simple.

We use Present Simple for habits, facts, and routines.
For example: I wake up at seven every morning.
She works in a bank.
Water boils at one hundred degrees.
The sun rises in the east.

To make Present Simple, use the base form of the verb. For he, she, and it, add S.
I work. You work. He works. She works. We work. They work.

For negative, use do not or does not.
I do not like coffee. She does not speak French.

For questions, use do or does at the beginning.
Do you like pizza? Does he play football?

Now let's practice. Listen and repeat after me.
I go to school every day.
She reads books before bed.
They play football on weekends.
He does not eat meat.
Do you speak English?

Great job! Now let's move to Present Continuous.

We use Present Continuous for actions happening right now, at this moment.
For example: I am studying English right now.
She is cooking dinner.
They are playing in the park.
Look! It is raining outside.

To make Present Continuous, use am, is, or are plus the verb with I-N-G.
I am working. You are working. He is working.

For negative, add not after am, is, or are.
I am not sleeping. She is not watching TV.

For questions, put am, is, or are before the subject.
Are you listening? Is she coming to the party?

Practice time! Repeat after me.
I am learning English.
She is talking on the phone.
We are not watching TV.
Are they coming to dinner?
Is it snowing outside?

Excellent! Now let's learn Past Simple.

We use Past Simple for finished actions in the past.
For example: I visited London last year.
She called me yesterday.
They played football on Saturday.
We watched a movie last night.

For regular verbs, add E-D to the base form.
Work becomes worked. Play becomes played. Visit becomes visited.

But many common verbs are irregular!
Go becomes went. Eat becomes ate. See becomes saw. Buy becomes bought. Come becomes came. Have becomes had.

For negative, use did not plus the base form.
I did not go to school yesterday. She did not call me.

For questions, use did at the beginning.
Did you eat breakfast? Did they finish the project?

Let's practice. Repeat after me.
I went to the store yesterday.
She bought a new phone.
We did not see the movie.
Did you finish your homework?
They came home late last night.

Now let's talk about Present Perfect.

We use Present Perfect for actions that started in the past and are still relevant now.
For example: I have lived in Tbilisi for five years. I still live there.
She has visited ten countries. She might visit more.
Have you ever eaten sushi? This is about your whole life experience.

To make Present Perfect, use have or has plus the past participle.
I have worked. She has finished. They have gone.

Important time words: ever, never, already, yet, just, since, for.
Have you ever been to Paris?
I have never seen snow.
She has already finished her homework.
I have just arrived.
We have lived here since two thousand twenty.
He has worked here for three years.

Practice time! Repeat after me.
I have studied English for two years.
She has never been to America.
Have you ever tried Georgian wine?
They have already left.
We have just finished dinner.

Now let's learn Future with Will.

We use will for predictions, promises, and quick decisions.
For example: I think it will rain tomorrow. That's a prediction.
I will help you with your homework. That's a promise.
The phone is ringing. I will answer it. That's a quick decision.

To make future with will, just add will before the base verb.
I will go. She will come. They will finish.

For negative, use will not or won't.
I will not forget. She won't be late.

For questions, put will before the subject.
Will you come to the party? Will it snow tomorrow?

Practice! Repeat after me.
I will call you tomorrow.
She will not forget your birthday.
Will you help me?
It will be sunny this weekend.
They won't arrive before six.

And finally, let's learn Future with Going To.

We use going to for plans and things we already decided.
For example: I am going to visit my parents this weekend. I already planned it.
She is going to start a new job next month.
We are going to buy a new car.

To make going to future, use am, is, or are plus going to plus the base verb.
I am going to study. She is going to travel. They are going to move.

Practice! Repeat after me.
I am going to learn English this year.
She is going to cook dinner tonight.
We are going to travel to Batumi.
Are you going to come to the party?
They are not going to sell their house.

Congratulations! You just learned five major English tenses.
Remember: Present Simple for habits. Present Continuous for now. Past Simple for finished past. Present Perfect for past connected to now. And Future with will and going to.

Practice every day, and your English will get better and better.
This was FluentGe Long Episode number one. See you in the next lesson!
"""
    },
    {
        "id": 32,
        "title": "50 Essential Phrases for Daily Life",
        "titleKa": "50 აუცილებელი ფრაზა ყოველდღიური ცხოვრებისთვის",
        "icon": "💬",
        "filename": "episode32-essential-phrases.mp3",
        "voice": "en-US-GuyNeural",
        "script": """
Welcome to FluentGe Long Episode number two: Fifty Essential Phrases for Daily Life.

In this lesson, I will teach you fifty phrases that English speakers use every single day. Listen carefully, and repeat after me. I will say each phrase twice, then give you the Georgian translation.

Let's begin with greetings and basic phrases.

Number one: How are you doing?
How are you doing?
In Georgian: როგორ ხარ?

Number two: I'm doing well, thanks.
I'm doing well, thanks.
კარგად ვარ, გმადლობთ.

Number three: Nice to meet you.
Nice to meet you.
სასიამოვნოა თქვენი გაცნობა.

Number four: What do you do for a living?
What do you do for a living?
რას საქმიანობთ?

Number five: I work in information technology.
I work in information technology.
ინფორმაციული ტექნოლოგიების სფეროში ვმუშაობ.

Now let's learn phrases for asking and giving directions.

Number six: Excuse me, where is the nearest metro station?
Excuse me, where is the nearest metro station?
უკაცრავად, სად არის უახლოესი მეტროსადგური?

Number seven: Go straight and turn left at the traffic light.
Go straight and turn left at the traffic light.
პირდაპირ წადით და შუქნიშანთან მარცხნივ მოუხვიეთ.

Number eight: It's about a ten minute walk from here.
It's about a ten minute walk from here.
აქედან დაახლოებით ათი წუთის სავალია.

Number nine: Is it far from here?
Is it far from here?
შორს არის აქედან?

Number ten: You can take the bus number thirty seven.
You can take the bus number thirty seven.
შეგიძლიათ ოცდაჩვიდმეტიანი ავტობუსით წახვიდეთ.

Now let's learn shopping phrases.

Number eleven: How much does this cost?
How much does this cost?
რა ღირს ეს?

Number twelve: Can I try this on?
Can I try this on?
შეიძლება ეს მოვიზომო?

Number thirteen: Do you have this in a larger size?
Do you have this in a larger size?
გაქვთ ეს უფრო დიდი ზომით?

Number fourteen: I'm just looking, thank you.
I'm just looking, thank you.
უბრალოდ ვათვალიერებ, გმადლობთ.

Number fifteen: Can I pay by card?
Can I pay by card?
შეიძლება ბარათით გადავიხადო?

Let's move to restaurant phrases.

Number sixteen: A table for two, please.
A table for two, please.
მაგიდა ორისთვის, გთხოვთ.

Number seventeen: Can I see the menu, please?
Can I see the menu, please?
შეიძლება მენიუ ვნახო?

Number eighteen: I'll have the chicken, please.
I'll have the chicken, please.
ქათამს შევუკვეთავ, გთხოვთ.

Number nineteen: Could we get the bill, please?
Could we get the bill, please?
შეგვიძლია ანგარიში მოგვიტანოთ?

Number twenty: The food was delicious, thank you.
The food was delicious, thank you.
საკვები გემრიელი იყო, გმადლობთ.

Now phrases for making plans and socializing.

Number twenty one: Would you like to grab a coffee sometime?
Would you like to grab a coffee sometime?
გინდა როდისმე ყავაზე წავიდეთ?

Number twenty two: I'm free this weekend.
I'm free this weekend.
ამ შაბათ-კვირას თავისუფალი ვარ.

Number twenty three: That sounds like a great idea.
That sounds like a great idea.
ეს კარგი იდეა ჟღერს.

Number twenty four: I'm sorry, I can't make it.
I'm sorry, I can't make it.
ბოდიში, ვერ მოვალ.

Number twenty five: Let's meet at six o'clock.
Let's meet at six o'clock.
ექვს საათზე შევხვდეთ.

Work and office phrases.

Number twenty six: I have a meeting at three.
I have a meeting at three.
სამ საათზე შეხვედრა მაქვს.

Number twenty seven: Could you send me that by email?
Could you send me that by email?
შეგიძლიათ ეს ელფოსტით გამომიგზავნოთ?

Number twenty eight: I need to finish this by Friday.
I need to finish this by Friday.
ეს პარასკევამდე უნდა დავამთავრო.

Number twenty nine: The deadline has been extended.
The deadline has been extended.
ვადა გაახანგრძლივეს.

Number thirty: I'll follow up on that tomorrow.
I'll follow up on that tomorrow.
ხვალ დავაკვირდები ამას.

Phrases for emergencies and problems.

Number thirty one: I need help, please.
I need help, please.
დახმარება მჭირდება, გთხოვთ.

Number thirty two: Can you call an ambulance?
Can you call an ambulance?
შეგიძლიათ სასწრაფო გამოიძახოთ?

Number thirty three: I've lost my wallet.
I've lost my wallet.
საფულე დავკარგე.

Number thirty four: Where is the nearest hospital?
Where is the nearest hospital?
სად არის უახლოესი საავადმყოფო?

Number thirty five: I don't feel well.
I don't feel well.
კარგად არ ვარ.

Phrases for expressing opinions.

Number thirty six: In my opinion, this is a good idea.
In my opinion, this is a good idea.
ჩემი აზრით, ეს კარგი იდეაა.

Number thirty seven: I completely agree with you.
I completely agree with you.
სრულიად გეთანხმები.

Number thirty eight: I'm not sure about that.
I'm not sure about that.
ამაში დარწმუნებული არ ვარ.

Number thirty nine: That's a good point.
That's a good point.
კარგ არგუმენტს ამბობ.

Number forty: I see what you mean, but I think differently.
I see what you mean, but I think differently.
მესმის რას ამბობ, მაგრამ სხვაგვარად ვფიქრობ.

Technology and modern life phrases.

Number forty one: What's the WiFi password?
What's the WiFi password?
რა არის ვაიფაის პაროლი?

Number forty two: My phone battery is dead.
My phone battery is dead.
ტელეფონის ბატარეა ამოიწურა.

Number forty three: Can you send me the link?
Can you send me the link?
შეგიძლია ლინკი გამომიგზავნო?

Number forty four: I'll text you later.
I'll text you later.
მოგვიანებით მოგწერ.

Number forty five: Have you seen the latest update?
Have you seen the latest update?
ნახე ბოლო განახლება?

And finally, polite expressions.

Number forty six: Thank you so much for your help.
Thank you so much for your help.
დიდი მადლობა დახმარებისთვის.

Number forty seven: I really appreciate it.
I really appreciate it.
ნამდვილად ვაფასებ ამას.

Number forty eight: No worries at all.
No worries at all.
არაფერია.

Number forty nine: It was lovely talking to you.
It was lovely talking to you.
სასიამოვნო იყო თქვენთან საუბარი.

Number fifty: Have a wonderful day!
Have a wonderful day!
გისურვებთ მშვენიერ დღეს!

Congratulations! You just learned fifty essential English phrases.
Try to use at least three of these phrases every day.
Practice makes perfect!

This was FluentGe Long Episode number two. See you next time!
"""
    },
    {
        "id": 33,
        "title": "Common Mistakes Georgians Make",
        "titleKa": "ხშირი შეცდომები რომლებსაც ქართველები უშვებენ",
        "icon": "⚠️",
        "filename": "episode33-common-mistakes.mp3",
        "voice": "en-US-GuyNeural",
        "script": """
Welcome to FluentGe Long Episode number three: Common Mistakes Georgians Make in English.

Georgian speakers often make the same mistakes when learning English. Today I will explain the top mistakes and teach you the correct way. Listen carefully!

Mistake number one: Articles. A, An, and The.

Georgian language does not have articles. So Georgians often forget to use them.

Wrong: I need computer.
Correct: I need a computer.

Wrong: Sun is shining.
Correct: The sun is shining.

Here's the rule: Use A or AN when talking about something for the first time, or any one of something.
I saw a dog in the park. Any dog, not specific.

Use THE when talking about something specific that both people know about.
I saw the dog again today. The same dog we talked about.

Use AN before words that start with a vowel sound: an apple, an umbrella, an hour.
Use A before consonant sounds: a book, a university, a European country.

Practice: 
I bought a new phone.
The phone is very fast.
She is an engineer.
The weather is nice today.
I need a glass of water.

Mistake number two: Word order.

In Georgian, word order is flexible. In English, it is strict.
The order is: Subject, Verb, Object.

Wrong: Yesterday I to the store went.
Correct: Yesterday I went to the store.

Wrong: English very well she speaks.
Correct: She speaks English very well.

Wrong: To my friend I gave the book.
Correct: I gave the book to my friend.

Always remember: Subject first, then verb, then object.

Practice:
I eat breakfast every morning.
She studies English at the university.
They bought a new car last week.
We watch movies on Friday nights.

Mistake number three: Present Simple versus Present Continuous.

Many Georgians say: I am work now. Or: I working.
Both are wrong!

Correct: I am working now. Use present continuous for right now.
Correct: I work every day. Use present simple for habits.

Wrong: I am go to school every day.
Correct: I go to school every day.

Wrong: She cook dinner right now.
Correct: She is cooking dinner right now.

The rule: For habits and routines, use Present Simple. No I-N-G.
For actions happening now, use am, is, are plus verb with I-N-G.

Practice:
I usually wake up at seven. That's a habit, present simple.
Right now I am listening to a podcast. That's now, present continuous.
She works in a hospital. Habit, present simple.
She is working late today. Now, present continuous.

Mistake number four: Pronunciation of TH sounds.

Georgian does not have the TH sound. So Georgians often say D or T or Z instead.

Wrong: I sink so. With an S sound.
Correct: I think so. With a TH sound.

Wrong: De weather is nice. With a D sound.
Correct: The weather is nice. With a TH sound.

To make the TH sound, put your tongue between your teeth and blow air.
Practice these words:
Think. Thank. Three. Through. Thursday.
The. This. That. There. They.

Say them slowly. Tongue between teeth. TH, TH, TH.

Mistake number five: He, She, and It confusion.

In Georgian, the word for he and she is the same: IS.
So Georgians sometimes mix up he and she in English.

Wrong: My mother, he is a teacher.
Correct: My mother, she is a teacher.

Wrong: My brother, she works in IT.
Correct: My brother, he works in IT.

Tip: Always think about the gender before you speak.
Male? Use HE.
Female? Use SHE.
Object or animal? Use IT.

Practice:
My father is a doctor. He works at a hospital.
My sister is a student. She studies law.
My phone is new. It was expensive.

Mistake number six: Prepositions.

Prepositions are different in every language. Georgian prepositions do not match English ones.

Wrong: I am interested for sports.
Correct: I am interested in sports.

Wrong: I depend from my parents.
Correct: I depend on my parents.

Wrong: She is married with a doctor.
Correct: She is married to a doctor.

Wrong: I am afraid from dogs.
Correct: I am afraid of dogs.

You must memorize these combinations. There is no logic, just practice!

Common ones to remember:
Interested IN something.
Good AT something.
Afraid OF something.
Married TO someone.
Depend ON something.
Listen TO something.
Look AT something.
Wait FOR someone.

Mistake number seven: Double negatives.

In Georgian, double negatives are normal and correct.
In English, double negatives are wrong!

Wrong: I don't know nothing.
Correct: I don't know anything.

Wrong: She never goes nowhere.
Correct: She never goes anywhere.

Wrong: I can't find nobody.
Correct: I can't find anybody.

The rule: Use only ONE negative word in a sentence.
Don't plus anything. Never plus anywhere. Can't plus anybody.

Mistake number eight: Forgetting the verb TO BE.

In Georgian, you can make sentences without a verb. In English, you always need a verb.

Wrong: She beautiful.
Correct: She is beautiful.

Wrong: I hungry.
Correct: I am hungry.

Wrong: They from Georgia.
Correct: They are from Georgia.

Always include am, is, or are in present tense sentences without action verbs.

Let's review all eight mistakes:
One: Use articles. A, an, the.
Two: Subject, verb, object order.
Three: Present simple for habits, present continuous for now.
Four: Practice the TH sound.
Five: He for males, she for females.
Six: Memorize preposition combinations.
Seven: Only one negative per sentence.
Eight: Always include the verb to be.

If you fix these eight mistakes, your English will improve dramatically.
Practice every day, and don't be afraid to make mistakes. Mistakes are how we learn!

This was FluentGe Long Episode number three. See you in the next lesson!
"""
    },
    {
        "id": 34,
        "title": "Job Interview Preparation",
        "titleKa": "სამსახურის გასაუბრებისთვის მომზადება",
        "icon": "💼",
        "filename": "episode34-job-interview-prep.mp3",
        "voice": "en-US-GuyNeural",
        "script": """
Welcome to FluentGe Long Episode number four: Job Interview Preparation.

This lesson will teach you how to ace a job interview in English. We will cover the most common questions and the best answers. Whether you are applying for a job in Georgia or abroad, these skills will help you.

First, let's talk about preparation.

Before the interview, research the company. Know what they do. Know their products or services. Know their mission.

Prepare your answers in advance. Practice saying them out loud. Record yourself and listen back.

Dress professionally. Arrive ten minutes early. Bring copies of your resume.

Now, let's practice the most common interview questions.

Question one: Tell me about yourself.

This is always the first question. Keep your answer short, about two minutes.

Here is a good structure: Present, Past, Future.

Example answer:
I am a software developer with three years of experience. Currently, I work at a tech startup where I build web applications.
Before that, I studied computer science at Tbilisi State University, where I graduated with honors.
I am looking for a new challenge where I can grow my skills and contribute to a larger team.

Notice: I talked about now, then my past, then my future goals. Simple and clear.

Now you try. Think about your own answer. Present, past, future.

Question two: Why do you want to work here?

This is where your research helps. Show that you know the company.

Example answer:
I have followed your company for two years. I am impressed by your innovative products and strong company culture.
I believe my skills in marketing would be a great fit for your growing team.
I want to work somewhere where I can make a real impact, and your company offers that opportunity.

Bad answer: I need money. Or: Because you are hiring.
Good answer: Connect your skills to their needs.

Question three: What are your strengths?

Pick two or three strengths that are relevant to the job.

Example answer:
My biggest strength is problem-solving. I enjoy finding creative solutions to difficult challenges.
I am also a strong communicator. I can explain complex ideas in simple terms.
Finally, I am very organized. I always meet my deadlines and keep my work structured.

Tip: Give a specific example for each strength.
For instance: Last year, I solved a bug that saved our company ten thousand dollars. That's problem-solving in action.

Question four: What are your weaknesses?

This is tricky. Never say you have no weaknesses. Never say something too negative.

The best strategy: Pick a real weakness, but show how you are improving it.

Example answer:
I used to have difficulty with public speaking. I would get nervous in front of groups.
But I recognized this and joined a speaking club. Now I present at team meetings regularly and feel much more confident.

Another example:
Sometimes I focus too much on details and spend extra time on tasks.
I have learned to set time limits for myself and prioritize what matters most.

Question five: Where do you see yourself in five years?

Show ambition, but be realistic. Connect it to the company.

Example answer:
In five years, I see myself in a senior position, leading a team of developers.
I want to grow within this company and take on more responsibility over time.
I am also interested in mentoring junior team members and helping them succeed.

Question six: Why should we hire you?

This is your chance to sell yourself. Be confident but not arrogant.

Example answer:
You should hire me because I bring a unique combination of technical skills and creativity.
I have a proven track record of delivering projects on time and exceeding expectations.
I am passionate about this industry and I am ready to contribute from day one.

Now let's talk about questions you should ask the interviewer.

Always prepare two or three questions. It shows you are interested.

Good questions to ask:
What does a typical day look like in this role?
What are the biggest challenges facing the team right now?
How do you measure success in this position?
What opportunities are there for professional development?
What is the company culture like?

Never ask about salary in the first interview unless they bring it up.

Let's also practice common phrases for during the interview.

To buy time when thinking: That's a great question. Let me think about that for a moment.
To ask for clarification: Could you please repeat the question? Or: Could you explain what you mean by that?
To show enthusiasm: That sounds very exciting. Or: I would love the opportunity to work on that.
To close the interview: Thank you for your time. I really enjoyed our conversation. I look forward to hearing from you.

Let's do a quick mock interview. I will ask, and you answer in your head.

Tell me about yourself. Think of your answer now.
Why do you want this job? What would you say?
What is your greatest strength? Think of an example.
Where do you see yourself in five years?

Great practice!

Remember these tips:
One: Research the company before the interview.
Two: Practice your answers out loud.
Three: Use the present, past, future structure for Tell me about yourself.
Four: Be honest about weaknesses but show improvement.
Five: Always ask questions at the end.
Six: Be confident, smile, and make eye contact.
Seven: Send a thank you email after the interview.

You are ready! Go get that job!

This was FluentGe Long Episode number four. Good luck with your interview!
"""
    },
    {
        "id": 35,
        "title": "English for Traveling Abroad",
        "titleKa": "ინგლისური საზღვარგარეთ მოგზაურობისთვის",
        "icon": "🌍",
        "filename": "episode35-travel-english.mp3",
        "voice": "en-US-GuyNeural",
        "script": """
Welcome to FluentGe Long Episode number five: English for Traveling Abroad.

Planning a trip? This lesson covers everything you need to know to travel confidently in English. We will go through the airport, hotel, transportation, sightseeing, and emergencies.

Part one: At the Airport.

When you arrive at the airport, first go to check-in.

You might hear: Good morning. May I see your passport and ticket?
You say: Here you go. Here is my passport.

They might ask: Are you checking any bags?
You say: Yes, I have one checked bag and one carry-on.
Or: No, just a carry-on.

They will say: Your gate is B twelve. Boarding starts at two thirty.
You say: Thank you. Where is gate B twelve?
They say: Go through security and turn right. It's at the end of the hall.

At security, they might say:
Please remove your laptop and liquids from your bag.
Please take off your belt and shoes.
Step through the scanner, please.

After security, you can relax at the gate.

Useful airport vocabulary:
Departure means leaving. Arrival means coming.
Boarding pass is your ticket to get on the plane.
Carry-on is the small bag you take on the plane.
Gate is where you wait for your plane.
Layover means you stop at another airport before your final destination.
Delay means the plane is late.

On the plane, the flight attendant might say:
Please fasten your seatbelt.
Would you like chicken or pasta?
We will be landing in approximately two hours.

You can say:
Could I have some water, please?
Excuse me, where is the restroom?
Could I have a blanket? I'm cold.

Part two: At Immigration and Customs.

When you arrive in a new country, you go through immigration.

The officer might ask:
What is the purpose of your visit? 
You say: I am here on vacation. Or: I am here for business. Or: I am visiting friends.

How long will you be staying?
You say: I will be here for one week. Or: About ten days.

Where will you be staying?
You say: I am staying at the Hilton Hotel. Or: I am staying with friends.

Do you have anything to declare?
You say: No, nothing to declare. Or: Yes, I have some gifts.

Part three: At the Hotel.

When you arrive at the hotel:
You say: Hello, I have a reservation under the name Tornike.
They say: Welcome! Let me check. Yes, I see your reservation for three nights.
You say: That's correct.
They say: Here is your room key. You are in room four fifteen on the fourth floor.

Useful hotel phrases:
What time is checkout? Usually it's eleven or twelve.
Is breakfast included?
Could I get a wake-up call at seven in the morning?
The air conditioning is not working. Could someone fix it?
Could I get extra towels, please?
Is there WiFi? What is the password?
I would like to extend my stay for one more night.

Part four: Getting Around.

Taking a taxi:
Could you take me to the city center, please?
How much will it cost to get to the airport?
Could you turn on the meter, please?
Please stop here. How much do I owe you?
Keep the change.

Taking public transport:
Where is the nearest bus stop?
Which bus goes to the museum?
How much is a single ticket?
Does this train go to the airport?
What time is the last train?

Renting a car:
I would like to rent a car for three days.
Do you have automatic transmission?
Is insurance included?
Where do I return the car?
Can I drop it off at a different location?

Part five: Sightseeing and Activities.

At a tourist information center:
What are the must-see attractions?
Do you have a city map?
Are there any guided tours?
How much is the entrance fee?
Is there a student discount?

At a museum or attraction:
Two adult tickets, please.
Is photography allowed?
What time does it close?
Where is the gift shop?
Is there an audio guide in English?

Part six: Emergencies.

These phrases could save your life:
Help! Please help me!
I need a doctor.
Call an ambulance, please.
I have been robbed. I need the police.
I lost my passport. Where is the embassy?
I am allergic to nuts. This is very important at restaurants.
Where is the nearest pharmacy?
I need to go to the hospital.

For less serious problems:
I am lost. Can you help me find this address?
My phone was stolen.
I missed my flight. What can I do?
I left my bag in the taxi.
I need to contact my embassy.

Part seven: Useful phrases for any situation.

Do you speak English?
I don't understand. Could you speak more slowly?
Could you write that down for me?
How do you say this in English?
Could you recommend a good restaurant?
Where is the nearest ATM?
Can I pay by credit card?
What is the exchange rate?
Is there a pharmacy nearby?
Could you take a photo of us, please?

Remember: When traveling, people appreciate when you try to speak their language. But if you need English, be polite and patient.

Always say please and thank you.
Smile. It is the universal language.
Don't be afraid to make mistakes. People will help you.

Pro tips for traveling:
Save your hotel address on your phone in case you get lost.
Keep copies of your passport and important documents.
Learn the emergency number of the country you are visiting.
Download an offline map before you go.
Carry a small phrase book or use a translation app.

You are now ready to travel the world in English!

This was FluentGe Long Episode number five. Safe travels and happy learning!
"""
    }
]

async def generate_episode(ep):
    """Generate a single long-form episode."""
    text = ep["script"].strip()
    output_path = os.path.join(OUTPUT_DIR, ep["filename"])
    
    if os.path.exists(output_path):
        size = os.path.getsize(output_path)
        if size > 100000:  # Skip if already exists and > 100KB
            print(f"  ⏭️  Episode {ep['id']} already exists ({size//1024}KB), skipping")
            return
    
    print(f"  🎙️  Generating episode {ep['id']}: {ep['title']}...")
    communicate = edge_tts.Communicate(text, ep["voice"], rate="-10%")
    await communicate.save(output_path)
    size = os.path.getsize(output_path)
    print(f"  ✅ Episode {ep['id']} done: {size//1024}KB")

async def main():
    print("🎙️ Generating Long-Form Podcast Episodes")
    print("=" * 50)
    
    for ep in EPISODES:
        await generate_episode(ep)
    
    print("\n✅ All episodes generated!")
    
    # Print summary
    print("\nSummary:")
    for ep in EPISODES:
        path = os.path.join(OUTPUT_DIR, ep["filename"])
        if os.path.exists(path):
            size = os.path.getsize(path)
            words = len(ep["script"].split())
            est_min = words / 130  # ~130 words per minute at -10% speed
            print(f"  Episode {ep['id']}: {ep['title']} - {size//1024}KB, ~{est_min:.0f} min")

if __name__ == "__main__":
    asyncio.run(main())
