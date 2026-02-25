#!/usr/bin/env python3
"""
Expand all short podcasts (episodes 1-30) to 5-6 minutes using edge-tts.
Each episode gets an intro, vocabulary section, expanded dialogue, practice section, and outro.
"""

import subprocess
import os
import json

PODCAST_DIR = "/Users/aiagent/.openclaw/workspace/english-app/website/public/podcast"
VOICE = "en-US-GuyNeural"

# Episode data extracted from podcast.astro
episodes = [
    {
        "id": 1, "file": "episode1-at-the-airport.mp3",
        "title": "At the Airport",
        "vocab": ["Boarding pass", "Gate", "Luggage", "Passport", "Check in", "Departure", "Arrival", "Delay"],
        "transcript": [
            ("Agent", "Good morning. Can I see your passport and boarding pass, please?"),
            ("Traveler", "Of course. Here you go."),
            ("Agent", "Thank you. Are you checking in any luggage today?"),
            ("Traveler", "Yes, I have one suitcase."),
            ("Agent", "Please place it on the scale. Your bag is twenty-two kilograms. That's fine."),
            ("Traveler", "A window seat, please."),
            ("Agent", "Here is your boarding pass. Your flight departs from gate B7 at 3:45. Have a nice flight!"),
        ]
    },
    {
        "id": 2, "file": "episode2-restaurant.mp3",
        "title": "At the Restaurant",
        "vocab": ["Menu", "Appetizer", "Main course", "Dessert", "Bill", "Tip", "Reservation", "Waiter"],
        "transcript": [
            ("Waiter", "Good evening. Welcome to our restaurant. Table for two?"),
            ("Customer", "Yes, please. Do you have the menu in English?"),
            ("Waiter", "Of course. Here is the menu. Can I start you with an appetizer?"),
            ("Customer", "We'll have the soup. What's your main course recommendation?"),
            ("Waiter", "The grilled chicken is very popular. It comes with vegetables."),
            ("Customer", "Perfect. And for dessert, what do you suggest?"),
            ("Waiter", "Our chocolate cake is delicious. I'll bring your soup now."),
            ("Customer", "Thank you. Could we also have the bill, please?"),
        ]
    },
    {
        "id": 3, "file": "episode3-job-interview.mp3",
        "title": "Job Interview",
        "vocab": ["Resume", "Experience", "Salary", "Position", "Skills", "Hire", "Interview", "Qualifications"],
        "transcript": [
            ("Interviewer", "Good morning. Please have a seat. Tell me about yourself."),
            ("Candidate", "Good morning. I have five years of experience in marketing."),
            ("Interviewer", "That's impressive. What are your main skills and qualifications?"),
            ("Candidate", "I'm good with computers and I work well in teams."),
            ("Interviewer", "What position are you most interested in at our company?"),
            ("Candidate", "I'd love to work as a marketing manager. It matches my experience."),
            ("Interviewer", "What are your salary expectations for this position?"),
            ("Candidate", "I'm flexible, but I hope you'll hire me based on my skills."),
        ]
    },
    {
        "id": 4, "file": "episode4-hotel.mp3",
        "title": "At the Hotel",
        "vocab": ["Reception", "Room key", "Check-out", "Single room", "Double room", "Breakfast", "Elevator", "Lobby"],
        "transcript": [
            ("Receptionist", "Welcome to Grand Hotel. How can I help you today?"),
            ("Guest", "I have a reservation. A single room for three nights."),
            ("Receptionist", "Let me check. Yes, here it is. Here's your room key."),
            ("Guest", "What time is breakfast served? Is it included?"),
            ("Receptionist", "Breakfast is from 7 to 10 AM. Yes, it's included in your double room rate."),
            ("Guest", "Great! Where is the elevator to my floor?"),
            ("Receptionist", "The elevator is right there, past the lobby. Room 304."),
            ("Guest", "Thank you. What time is check-out tomorrow?"),
        ]
    },
    {
        "id": 5, "file": "episode5-shopping.mp3",
        "title": "Shopping",
        "vocab": ["Discount", "Receipt", "Fitting room", "Size", "Cash", "Credit card", "Refund", "Exchange"],
        "transcript": [
            ("Customer", "Excuse me, I'm looking for a blue dress, size medium."),
            ("Salesperson", "I'll help you find one. The fitting room is over there."),
            ("Customer", "This looks nice. Is there a discount on this item?"),
            ("Salesperson", "Yes, it's 30% off today. Would you like to try it?"),
            ("Customer", "Perfect! Can I pay with cash or credit card?"),
            ("Salesperson", "Both are fine. Do you need a receipt for exchange later?"),
            ("Customer", "Yes, please. Can I get a refund if it doesn't fit?"),
            ("Salesperson", "Of course. You have seven days for exchange or refund."),
        ]
    },
    {
        "id": 6, "file": "episode6-doctor.mp3",
        "title": "At the Doctor",
        "vocab": ["Appointment", "Symptoms", "Prescription", "Fever", "Headache", "Allergic", "Medicine", "Pharmacy"],
        "transcript": [
            ("Doctor", "Good morning. What brings you here today?"),
            ("Patient", "I have a bad headache and fever. I feel terrible."),
            ("Doctor", "How long have you had these symptoms? Any other issues?"),
            ("Patient", "Three days now. I'm also allergic to some medicines."),
            ("Doctor", "I'll give you a prescription. Take this medicine twice a day."),
            ("Patient", "Should I make another appointment to check up?"),
            ("Doctor", "Yes, come back in a week. Take the prescription to the pharmacy."),
            ("Patient", "Thank you, doctor. I'll get the medicine right away."),
        ]
    },
    {
        "id": 7, "file": "episode7-airport.mp3",
        "title": "At the Airport Part 2",
        "vocab": ["Boarding pass", "Gate", "Luggage", "Customs", "Departure", "Arrival", "Passport control", "Turbulence"],
        "transcript": [
            ("Agent", "Hello. I'd like to check in for my flight to London, please."),
            ("Staff", "Sure. May I see your passport and boarding pass?"),
            ("Agent", "Here you go. I have one piece of luggage to check in."),
            ("Staff", "Thank you. Your flight departs from gate twelve. Departure is at three fifteen."),
            ("Agent", "Do I need to go through passport control before the gate?"),
            ("Staff", "Yes. Go through security first, then passport control. After that, follow the signs."),
            ("Agent", "Is there any turbulence expected on the flight?"),
            ("Staff", "The pilot will inform you on board. Have a safe flight! Your arrival time is six thirty."),
        ]
    },
    {
        "id": 8, "file": "episode8-making-friends.mp3",
        "title": "Making Friends",
        "vocab": ["Introduce", "Hobby", "Personality", "Hang out", "Invite", "Nickname", "Similar", "Trust"],
        "transcript": [
            ("Sarah", "Hi! I'm Sarah. Let me introduce myself. I just moved here."),
            ("David", "Nice to meet you, Sarah. I'm David. Do you have a nickname?"),
            ("Sarah", "My friends call me Sari. What's your hobby?"),
            ("David", "I love hiking and reading. We have a similar personality, I think."),
            ("Sarah", "That's great! We should hang out sometime."),
            ("David", "Definitely. Can I invite you to a coffee this weekend?"),
            ("Sarah", "I'd love that. It takes time to build trust, but you seem really nice."),
            ("David", "Thanks! Let me give you my number so we can stay in touch."),
        ]
    },
    {
        "id": 9, "file": "episode9-directions.mp3",
        "title": "Asking for Directions",
        "vocab": ["Intersection", "Straight ahead", "Turn left", "Crosswalk", "Block", "Corner", "Opposite", "Landmark"],
        "transcript": [
            ("Tourist", "Excuse me. Can you tell me how to get to the city museum?"),
            ("Local", "Sure. Go straight ahead for two blocks."),
            ("Tourist", "Okay. And then?"),
            ("Local", "At the intersection, turn left. You'll see a crosswalk."),
            ("Tourist", "Is it on the corner?"),
            ("Local", "No, it's opposite the big church. The church is a famous landmark."),
            ("Tourist", "So, two blocks straight, turn left, and it's opposite the church?"),
            ("Local", "Exactly. It's about a five-minute walk from this corner."),
        ]
    },
    {
        "id": 10, "file": "episode10-phone.mp3",
        "title": "Phone Conversations",
        "vocab": ["Voicemail", "Dial", "Hang up", "Signal", "Text message", "Missed call", "Speaker", "Ringtone"],
        "transcript": [
            ("Receptionist", "Hello, Doctor Brown's office. How can I help you?"),
            ("Caller", "Hi, I tried to dial earlier but got your voicemail. I had a missed call."),
            ("Receptionist", "Yes, we called to confirm your appointment. The signal was bad."),
            ("Caller", "Sorry about that. Can I make an appointment for next Tuesday?"),
            ("Receptionist", "Of course. Ten o'clock works. We'll send you a text message to confirm."),
            ("Caller", "Perfect. Should I put you on speaker while I check my calendar?"),
            ("Receptionist", "Take your time. Don't hang up."),
            ("Caller", "Tuesday at ten is fine. I'll set a ringtone reminder. Thank you!"),
        ]
    },
    {
        "id": 11, "file": "episode11-bank.mp3",
        "title": "At the Bank",
        "vocab": ["Account", "Deposit", "Withdrawal", "Transfer", "Balance", "Loan", "Interest", "Statement"],
        "transcript": [
            ("Customer", "Good morning. I'd like to open a new bank account, please."),
            ("Bank Teller", "Of course. Would you like a savings account or a checking account?"),
            ("Customer", "A savings account. What's the interest rate?"),
            ("Bank Teller", "The interest rate is two point five percent per year."),
            ("Customer", "That sounds good. Can I make a deposit today?"),
            ("Bank Teller", "Yes. The minimum deposit is fifty dollars. You can also set up a transfer."),
            ("Customer", "Can I check my balance and get a statement online?"),
            ("Bank Teller", "Absolutely. You'll have full access through our app. We also offer loans."),
        ]
    },
    {
        "id": 12, "file": "episode12-apartment.mp3",
        "title": "Renting an Apartment",
        "vocab": ["Lease", "Tenant", "Landlord", "Deposit", "Utilities", "Furnished", "Spacious", "Neighborhood"],
        "transcript": [
            ("Tenant", "Hi, I'm here to see the apartment. Are you the landlord?"),
            ("Landlord", "Yes, welcome. Come in. As you can see, it's quite spacious."),
            ("Tenant", "It's lovely. Is it furnished?"),
            ("Landlord", "Yes, fully furnished. The kitchen and bedroom have everything you need."),
            ("Tenant", "What about utilities? Are they included?"),
            ("Landlord", "Water is included, but electricity and internet are paid by the tenant."),
            ("Tenant", "How much is the deposit, and how long is the lease?"),
            ("Landlord", "The deposit is one month's rent, and the lease is for twelve months. It's a quiet neighborhood too."),
        ]
    },
    {
        "id": 13, "file": "episode13-gym.mp3",
        "title": "At the Gym",
        "vocab": ["Treadmill", "Weights", "Stretch", "Membership", "Trainer", "Workout", "Warm up", "Cool down"],
        "transcript": [
            ("Customer", "Hi, I'd like to sign up for a gym membership."),
            ("Staff", "Welcome! We have monthly and yearly plans. Would you like a personal trainer?"),
            ("Customer", "Maybe later. What does a typical workout look like here?"),
            ("Staff", "Most people warm up on the treadmill for ten minutes, then move to weights."),
            ("Customer", "That sounds good. Should I stretch before or after?"),
            ("Staff", "Both! Stretch to warm up, and stretch again to cool down after your workout."),
            ("Customer", "Great. How much is the monthly membership?"),
            ("Staff", "It's forty dollars a month. That includes access to all equipment and one free session with a trainer."),
        ]
    },
    {
        "id": 14, "file": "episode14-emergency.mp3",
        "title": "Emergency Situations",
        "vocab": ["Ambulance", "Fire truck", "Accident", "Injury", "First aid", "Emergency room", "Bandage", "911"],
        "transcript": [
            ("Operator", "911, what's your emergency?"),
            ("Caller", "There's been a car accident on Main Street. Someone is injured."),
            ("Operator", "I'm sending an ambulance right away. Are you giving first aid?"),
            ("Caller", "Yes, I have a bandage on the injury. Should I call the fire truck too?"),
            ("Operator", "No, just the ambulance. Keep the person calm until help arrives."),
            ("Caller", "Okay. The ambulance should go to the emergency room after?"),
            ("Operator", "The paramedics will decide. You did great with the first aid."),
            ("Caller", "Thank you. I hear the sirens now. Help is coming."),
        ]
    },
    {
        "id": 15, "file": "episode15-supermarket.mp3",
        "title": "At the Supermarket",
        "vocab": ["Aisle", "Checkout", "Basket", "Organic", "Frozen", "Canned", "Expiration date", "Coupon"],
        "transcript": [
            ("Customer", "Excuse me, where can I find the frozen food aisle?"),
            ("Staff", "It's in aisle seven, next to the organic vegetables section."),
            ("Customer", "Great! I also need canned tomatoes. Do you have a basket I can use?"),
            ("Staff", "The baskets are at the entrance. Canned goods are in aisle three."),
            ("Customer", "Thank you. Could you check the expiration date on this milk?"),
            ("Staff", "This one expires next week, but here's a fresher one."),
            ("Customer", "Perfect! Where is the checkout? I have a coupon to use."),
            ("Staff", "Checkout is over there. The cashier will help you with your coupon."),
        ]
    },
    {
        "id": 16, "file": "episode16-plans.mp3",
        "title": "Making Plans",
        "vocab": ["Schedule", "Available", "Cancel", "Postpone", "Confirm", "Flexible", "Suggest", "Definitely"],
        "transcript": [
            ("Friend A", "Are you available this weekend? I want to make some plans."),
            ("Friend B", "I'm flexible Saturday, but Sunday I have to confirm with my family."),
            ("Friend A", "Great! I suggest we go hiking. The weather should be nice."),
            ("Friend B", "That sounds fun! What time should we start? I don't want to cancel."),
            ("Friend A", "Let's definitely start early, maybe 8 AM? I'll check my schedule tonight."),
            ("Friend B", "Perfect! Should we postpone if the weather changes?"),
            ("Friend A", "We can be flexible. I'll text you Friday to confirm our plans."),
            ("Friend B", "Sounds like a plan! I'm excited about our weekend adventure."),
        ]
    },
    {
        "id": 17, "file": "episode17-school.mp3",
        "title": "At School",
        "vocab": ["Semester", "Lecture", "Assignment", "Grade", "Professor", "Deadline", "Scholarship", "Campus"],
        "transcript": [
            ("Student", "Professor, I have questions about this semester's assignments."),
            ("Professor", "Of course. Which assignment are you asking about?"),
            ("Student", "The research paper. What's the deadline for submission?"),
            ("Professor", "The deadline is next Friday. Make sure to attend tomorrow's lecture for more details."),
            ("Student", "I will. Also, what grade do I need to get a scholarship?"),
            ("Professor", "You need at least an A- average. Are you planning to stay on campus next year?"),
            ("Student", "Yes, definitely. I love the campus life and want to continue my studies here."),
            ("Professor", "Excellent! Keep up the good work, and you'll definitely qualify for the scholarship."),
        ]
    },
    {
        "id": 18, "file": "episode18-cooking.mp3",
        "title": "Cooking Together",
        "vocab": ["Recipe", "Ingredient", "Stir", "Chop", "Boil", "Oven", "Tablespoon", "Seasoning"],
        "transcript": [
            ("Cook A", "Let's cook together! Do you have the recipe for pasta?"),
            ("Cook B", "Yes! First, we need to chop the vegetables and boil water."),
            ("Cook A", "What ingredients do we need? I'll help you stir the sauce."),
            ("Cook B", "We need tomatoes, cheese, and herbs. Add a tablespoon of olive oil too."),
            ("Cook A", "Should I preheat the oven? What temperature for the seasoning?"),
            ("Cook B", "Yes, 350 degrees. Don't forget to add salt and pepper for seasoning."),
            ("Cook A", "This smells amazing! How long should we cook in the oven?"),
            ("Cook B", "About 20 minutes. Then we can enjoy our homemade pasta!"),
        ]
    },
    {
        "id": 19, "file": "episode19-mechanic.mp3",
        "title": "At the Mechanic",
        "vocab": ["Engine", "Brake", "Tire", "Oil change", "Inspection", "Repair", "Estimate", "Warranty"],
        "transcript": [
            ("Customer", "Hi, my car is making a strange noise. Can you take a look?"),
            ("Mechanic", "Of course. It might be the engine or the brakes. Let me inspect it."),
            ("Customer", "I also think one tire needs to be replaced. How much for repair?"),
            ("Mechanic", "I'll give you an estimate after inspection. When did you last have an oil change?"),
            ("Customer", "About six months ago. Do you think that's the problem?"),
            ("Mechanic", "Possibly. Regular oil changes help the engine run smoothly. This repair has a warranty."),
            ("Customer", "That's good to know. How long will the repair take?"),
            ("Mechanic", "About two hours for the engine check and oil change. I'll call you when it's done."),
        ]
    },
    {
        "id": 20, "file": "episode20-birthday.mp3",
        "title": "Birthday Party",
        "vocab": ["Celebrate", "Surprise", "Candle", "Wish", "Gift", "Decoration", "Invitation", "Toast"],
        "transcript": [
            ("Friend A", "Hey! Are you coming to Sarah's birthday party tonight?"),
            ("Friend B", "Of course! I bought a gift for her. It's a surprise."),
            ("Friend A", "That's great! I sent the invitation last week. Did you get it?"),
            ("Friend B", "Yes, I did. I also helped with the decorations at her house."),
            ("Friend A", "Wonderful! We need to light the candles on the cake."),
            ("Friend B", "And then she can make a wish before blowing them out."),
            ("Friend A", "Let's celebrate together. It's going to be a fun night."),
            ("Friend B", "Absolutely! I'll make a toast to her when we're all together."),
        ]
    },
    {
        "id": 21, "file": "episode21-travel.mp3",
        "title": "Travel Stories",
        "vocab": ["Adventure", "Souvenir", "Backpack", "Culture", "Tourist", "Guide", "Itinerary", "Memorable"],
        "transcript": [
            ("Traveler A", "I just came back from an amazing adventure in Japan."),
            ("Friend", "That sounds exciting! Did you buy any souvenirs?"),
            ("Traveler A", "Yes, I filled my backpack with gifts for everyone."),
            ("Friend", "What did you enjoy most about the culture there?"),
            ("Traveler A", "The food and the temples. Our guide was really helpful."),
            ("Friend", "Did you follow a strict itinerary or just explore freely?"),
            ("Traveler A", "A bit of both. Some days I was a tourist, other days I wandered."),
            ("Friend", "It sounds like a truly memorable trip. I'd love to go someday."),
        ]
    },
    {
        "id": 22, "file": "episode22-at-the-pharmacy.mp3",
        "title": "At the Pharmacy",
        "vocab": ["Prescription", "Medicine", "Tablets", "Side effects", "Instructions", "Dosage", "Pharmacist", "Over-the-counter"],
        "transcript": [
            ("Customer", "Good morning. I have a prescription from my doctor. Can you fill it?"),
            ("Pharmacist", "Of course. Let me check what medicine you need. These are tablets."),
            ("Customer", "How many should I take? What's the correct dosage?"),
            ("Pharmacist", "Take two tablets twice a day. Please read the instructions carefully."),
            ("Customer", "Are there any side effects I should know about?"),
            ("Pharmacist", "Some people feel sleepy. Don't drive after taking this medicine."),
            ("Customer", "Do you have anything over-the-counter for headaches?"),
            ("Pharmacist", "Yes, right over there. Ask the pharmacist if you need help choosing."),
        ]
    },
    {
        "id": 23, "file": "episode23-first-day-work.mp3",
        "title": "First Day at Work",
        "vocab": ["Orientation", "Colleague", "Supervisor", "Responsibilities", "Training", "Workplace", "Schedule", "Tasks"],
        "transcript": [
            ("Supervisor", "Welcome to your first day! I'm John, your supervisor. Let's start the orientation."),
            ("New Employee", "Thank you! I'm excited to learn about my new responsibilities here."),
            ("Supervisor", "Great attitude! Let me introduce you to your colleagues in the workplace."),
            ("New Employee", "That sounds perfect. What does my daily schedule look like?"),
            ("Supervisor", "You'll start at 9 AM. Your main tasks include customer service and training."),
            ("New Employee", "I understand. How long will the training period last?"),
            ("Supervisor", "About two weeks. Don't worry, everyone will help you learn quickly."),
            ("New Employee", "I appreciate that. I'm ready to work hard and meet my responsibilities."),
        ]
    },
    {
        "id": 24, "file": "episode24-at-the-post-office.mp3",
        "title": "At the Post Office",
        "vocab": ["Package", "Envelope", "Postage", "Delivery", "Address", "Stamp", "Tracking", "Express"],
        "transcript": [
            ("Customer", "I need to send this package to Germany. What's the postage cost?"),
            ("Clerk", "Let me weigh it. The standard delivery is twenty dollars."),
            ("Customer", "That's expensive. Is there a cheaper option than express delivery?"),
            ("Clerk", "Regular mail takes longer but costs only twelve dollars."),
            ("Customer", "That works. Can I get tracking for this envelope too?"),
            ("Clerk", "Yes, tracking costs three extra dollars. Please write the address clearly."),
            ("Customer", "Perfect. I also need stamps for regular letters."),
            ("Clerk", "A book of stamps is ten dollars. Your package will arrive in two weeks."),
        ]
    },
    {
        "id": 25, "file": "episode25-car-rental.mp3",
        "title": "Car Rental",
        "vocab": ["Rental", "License", "Insurance", "Mileage", "Fuel", "Automatic", "Manual", "Deposit"],
        "transcript": [
            ("Customer", "I'd like to rent a car for three days. Do you have automatic cars?"),
            ("Agent", "Yes, we do. I need to see your driver's license and credit card."),
            ("Customer", "Here they are. What's included in the rental price?"),
            ("Agent", "Basic insurance and unlimited mileage. Fuel is not included."),
            ("Customer", "What about a manual car? Is it cheaper than automatic?"),
            ("Agent", "Yes, manual is thirty dollars less per day. We need a deposit too."),
            ("Customer", "How much is the deposit? When do I return the car?"),
            ("Agent", "Two hundred dollar deposit. Return it with the same fuel level by noon."),
        ]
    },
    {
        "id": 26, "file": "episode26-meeting-neighbors.mp3",
        "title": "Meeting Neighbors",
        "vocab": ["Neighbor", "Introduce", "Community", "Friendly", "Apartment", "Building", "Welcome", "Helpful"],
        "transcript": [
            ("New Resident", "Hello! I just moved into apartment 3B. I'm Lisa, your new neighbor."),
            ("Neighbor", "Welcome to the building! I'm Tom from 3A. The community here is very friendly."),
            ("New Resident", "That's wonderful to hear. Is there anything I should know about living here?"),
            ("Neighbor", "The neighbors are all helpful. We have a WhatsApp group for the building."),
            ("New Resident", "That sounds great! I'd love to join and introduce myself to everyone."),
            ("Neighbor", "Perfect! Most people here have been neighbors for years. You'll love it."),
            ("New Resident", "Thank you for being so welcoming. It's nice to meet friendly people."),
            ("Neighbor", "Anytime! If you need anything, just knock on my door. Welcome again!"),
        ]
    },
    {
        "id": 27, "file": "episode27-at-the-dentist.mp3",
        "title": "At the Dentist",
        "vocab": ["Appointment", "Toothache", "Filling", "Cleaning", "Check-up", "X-ray", "Cavity", "Treatment"],
        "transcript": [
            ("Patient", "Good morning. I have a terrible toothache. Can you help me?"),
            ("Dentist", "Of course. Let me examine your teeth. When did the pain start?"),
            ("Patient", "Three days ago. It hurts when I eat or drink something cold."),
            ("Dentist", "I see a cavity here. You'll need a filling and maybe an X-ray."),
            ("Patient", "Will the treatment hurt? I'm a bit nervous about dental work."),
            ("Dentist", "Don't worry. I'll use local anesthesia. You'll just feel pressure, no pain."),
            ("Patient", "That's reassuring. How often should I come for a check-up?"),
            ("Dentist", "Every six months for cleaning and examination. Take care of your teeth daily."),
        ]
    },
    {
        "id": 28, "file": "episode28-public-transport.mp3",
        "title": "Public Transport",
        "vocab": ["Bus", "Subway", "Ticket", "Transfer", "Schedule", "Route", "Platform", "Conductor"],
        "transcript": [
            ("Tourist", "Excuse me, which bus goes to downtown? I need to buy a ticket."),
            ("Local", "Bus number 15 or 22. You can buy tickets from the conductor on board."),
            ("Tourist", "Great! What about the subway? Is there a transfer to the red line?"),
            ("Local", "Yes, at Central Station. Check the schedule - trains run every ten minutes."),
            ("Tourist", "Perfect! Which platform do I need for the airport route?"),
            ("Local", "Platform B, but you might need to transfer once. It's clearly marked."),
            ("Tourist", "Thank you so much! Is public transport reliable here?"),
            ("Local", "Very reliable. Buses and subway usually run on time. Have a good trip!"),
        ]
    },
    {
        "id": 29, "file": "episode29-ordering-online.mp3",
        "title": "Ordering Online",
        "vocab": ["Website", "Cart", "Checkout", "Payment", "Shipping", "Delivery", "Order", "Confirmation"],
        "transcript": [
            ("Customer", "I'm trying to order something online, but the website is confusing."),
            ("Helper", "What do you need help with? Adding items to your cart?"),
            ("Customer", "Yes, and also the checkout process. How do I choose shipping options?"),
            ("Helper", "After you add items, click 'checkout'. You'll see delivery and payment choices."),
            ("Customer", "Perfect! What's the difference between standard and express delivery?"),
            ("Helper", "Express costs more but arrives in two days. Standard takes a week."),
            ("Customer", "I'll choose standard. Will I get a confirmation after my order?"),
            ("Helper", "Yes, by email. You can track your package using the confirmation number."),
        ]
    },
    {
        "id": 30, "file": "episode30-embassy.mp3",
        "title": "At the Embassy",
        "vocab": ["Embassy", "Visa", "Interview", "Documents", "Purpose", "Stay", "Passport", "Application"],
        "transcript": [
            ("Applicant", "Good morning. I'm here for my visa interview. I have all my documents."),
            ("Officer", "Welcome. Please show me your passport and application form."),
            ("Applicant", "Here they are. I'm applying for a tourist visa for two weeks."),
            ("Officer", "What's the main purpose of your visit? Business or tourism?"),
            ("Applicant", "Tourism. I want to visit museums and see historical sites."),
            ("Officer", "Do you have proof of your hotel reservations and return ticket?"),
            ("Applicant", "Yes, everything is here. How long will I stay at the embassy today?"),
            ("Officer", "About thirty minutes. We'll process your application and contact you soon."),
        ]
    },
]

def build_expanded_script(ep):
    """Build an expanded 5-6 minute script for a podcast episode."""
    title = ep["title"]
    vocab = ep["vocab"]
    transcript = ep["transcript"]
    
    lines = []
    
    # 1. INTRO (~30 seconds)
    lines.append(f"Welcome to Fluent G E, your English learning podcast for Georgian speakers.")
    lines.append(f"Today's episode is: {title}.")
    lines.append(f"In this episode, you will learn useful English vocabulary and phrases for real-life situations.")
    lines.append(f"Listen carefully, repeat after the speakers, and practice the new words.")
    lines.append(f"Let's get started!")
    lines.append("")
    
    # 2. VOCABULARY SECTION (~90 seconds)
    lines.append(f"First, let's learn the key vocabulary for today's topic: {title}.")
    lines.append(f"I will say each word slowly. Try to repeat each word after me.")
    lines.append("")
    for i, word in enumerate(vocab):
        lines.append(f"Word number {i+1}: {word}.")
        lines.append(f"Again: {word}.")
        # Add a simple example sentence for each word
        example = _get_example(word, title)
        lines.append(f"Example: {example}")
        lines.append("")
    
    lines.append(f"Great job! Now you know {len(vocab)} important words for {title}.")
    lines.append(f"Let's hear them used in a real conversation.")
    lines.append("")
    
    # 3. MAIN DIALOGUE (~60 seconds - original)
    lines.append(f"Now, listen to the full dialogue. Pay attention to how the vocabulary words are used.")
    lines.append("")
    for speaker, text in transcript:
        lines.append(f"{speaker}: {text}")
    lines.append("")
    
    # 4. SLOW REPEAT SECTION (~60 seconds)
    lines.append(f"Excellent! Now let's go through the dialogue again, slowly. Repeat each sentence after you hear it.")
    lines.append("")
    for speaker, text in transcript:
        lines.append(f"{speaker} says: {text}")
        lines.append(f"Your turn. Repeat: {text}")
        lines.append("")
    
    # 5. EXTENDED DIALOGUE (~60 seconds)
    lines.append(f"Now, let's hear a continuation of this conversation with more useful phrases.")
    lines.append("")
    extended = _get_extended_dialogue(ep)
    for speaker, text in extended:
        lines.append(f"{speaker}: {text}")
    lines.append("")
    
    # 6. KEY PHRASES REVIEW (~30 seconds)
    lines.append(f"Let's review the most useful phrases from today's episode.")
    phrases = _get_key_phrases(ep)
    for i, phrase in enumerate(phrases):
        lines.append(f"Phrase {i+1}: {phrase}")
    lines.append("")
    
    # 7. OUTRO (~20 seconds)
    lines.append(f"That's the end of today's episode: {title}.")
    lines.append(f"Remember to practice these words and phrases every day.")
    lines.append(f"Thank you for listening to Fluent G E. See you in the next episode!")
    
    return "\n".join(lines)


def _get_example(word, title):
    """Generate a simple example sentence for a vocabulary word."""
    examples = {
        # Episode 1 - Airport
        "Boarding pass": "Please show your boarding pass at the gate.",
        "Gate": "Our flight leaves from gate number twelve.",
        "Luggage": "I have two pieces of luggage to check in.",
        "Passport": "Don't forget your passport when you travel abroad.",
        "Check in": "We need to check in at least two hours before the flight.",
        "Departure": "The departure time has been changed to four o'clock.",
        "Arrival": "Our arrival in London is scheduled for nine PM.",
        "Delay": "There is a thirty minute delay on our flight today.",
        # Episode 2 - Restaurant
        "Menu": "Could you please bring us the menu?",
        "Appetizer": "Would you like an appetizer before the main course?",
        "Main course": "For the main course, I'll have the steak.",
        "Dessert": "We'd like to order dessert after dinner.",
        "Bill": "Excuse me, could we have the bill please?",
        "Tip": "In America, it's common to leave a fifteen percent tip.",
        "Reservation": "I made a reservation for seven o'clock tonight.",
        "Waiter": "The waiter recommended the fish.",
        # Episode 3 - Job Interview
        "Resume": "Please bring a copy of your resume to the interview.",
        "Experience": "I have three years of experience in sales.",
        "Salary": "What is the salary range for this position?",
        "Position": "I am applying for the manager position.",
        "Skills": "My skills include teamwork and communication.",
        "Hire": "We decided to hire the best candidate.",
        "Interview": "The interview will be at ten AM tomorrow.",
        "Qualifications": "Do you have the qualifications for this job?",
        # Episode 4 - Hotel
        "Reception": "Please go to the reception to get your room key.",
        "Room key": "I lost my room key. Can you give me a new one?",
        "Check-out": "Check-out time is at eleven in the morning.",
        "Single room": "I'd like to book a single room for two nights.",
        "Double room": "A double room costs more than a single room.",
        "Breakfast": "Breakfast is served in the restaurant on the first floor.",
        "Elevator": "Take the elevator to the third floor.",
        "Lobby": "I'll meet you in the lobby at eight o'clock.",
        # Episode 5 - Shopping
        "Discount": "There's a twenty percent discount on all items today.",
        "Receipt": "Please keep your receipt in case you want a refund.",
        "Fitting room": "The fitting room is at the back of the store.",
        "Size": "What size do you wear? Small, medium, or large?",
        "Cash": "Do you accept cash or only credit cards?",
        "Credit card": "I'll pay with my credit card.",
        "Refund": "Can I get a refund if the product is damaged?",
        "Exchange": "I'd like to exchange this shirt for a larger size.",
        # Episode 6 - Doctor
        "Appointment": "I need to make an appointment with the doctor.",
        "Symptoms": "What are your symptoms?",
        "Prescription": "The doctor wrote a prescription for antibiotics.",
        "Fever": "I have a high fever and a sore throat.",
        "Headache": "I've had a terrible headache since yesterday.",
        "Allergic": "I'm allergic to penicillin.",
        "Medicine": "Take this medicine three times a day.",
        "Pharmacy": "You can buy the medicine at the pharmacy.",
        # Episode 7 - Airport 2
        "Customs": "You need to go through customs when you arrive.",
        "Passport control": "Show your passport at passport control.",
        "Turbulence": "The pilot warned us about turbulence during the flight.",
        # Episode 8 - Friends
        "Introduce": "Let me introduce you to my friend Maria.",
        "Hobby": "My favorite hobby is playing guitar.",
        "Personality": "She has a very warm and friendly personality.",
        "Hang out": "Do you want to hang out after school?",
        "Invite": "I'd like to invite you to dinner on Saturday.",
        "Nickname": "His nickname is Mike, but his real name is Michael.",
        "Similar": "We have very similar interests in music.",
        "Trust": "Trust is the most important thing in a friendship.",
        # Episode 9 - Directions
        "Intersection": "Turn right at the next intersection.",
        "Straight ahead": "Go straight ahead for about two hundred meters.",
        "Turn left": "Turn left at the traffic light.",
        "Crosswalk": "Use the crosswalk to cross the street safely.",
        "Block": "The store is two blocks from here.",
        "Corner": "The cafe is on the corner of Main Street.",
        "Opposite": "The bank is opposite the post office.",
        "Landmark": "The church is a famous landmark in our city.",
        # Episode 10 - Phone
        "Voicemail": "I left a voicemail because nobody answered the phone.",
        "Dial": "Please dial the number and wait for someone to answer.",
        "Hang up": "Don't hang up. I'll transfer you now.",
        "Signal": "I can't hear you well. The signal is very weak.",
        "Text message": "I sent you a text message about the meeting.",
        "Missed call": "I saw your missed call and I'm calling you back.",
        "Speaker": "Let me put you on speaker so everyone can hear.",
        "Ringtone": "I changed my ringtone to a new song.",
        # Episode 11 - Bank
        "Account": "I want to open a new bank account.",
        "Deposit": "I'd like to make a deposit of five hundred dollars.",
        "Withdrawal": "I need to make a withdrawal from my savings account.",
        "Transfer": "Can I transfer money to another bank?",
        "Balance": "What is the current balance of my account?",
        "Loan": "I applied for a loan to buy a house.",
        "Interest": "The interest rate on savings accounts is quite low.",
        "Statement": "Can I receive my bank statement by email?",
        # Episode 12 - Apartment
        "Lease": "The lease agreement is for one year.",
        "Tenant": "The tenant must pay rent on the first of every month.",
        "Landlord": "The landlord is responsible for repairs in the building.",
        "Utilities": "Utilities like water and electricity are extra.",
        "Furnished": "The apartment comes fully furnished with new furniture.",
        "Spacious": "The living room is very spacious and bright.",
        "Neighborhood": "It's a quiet and safe neighborhood.",
        # Episode 13 - Gym
        "Treadmill": "I usually start my workout on the treadmill.",
        "Weights": "He lifts weights three times a week.",
        "Stretch": "Don't forget to stretch before you exercise.",
        "Membership": "The gym membership costs fifty dollars a month.",
        "Trainer": "A personal trainer can help you reach your fitness goals.",
        "Workout": "I had a great workout at the gym today.",
        "Warm up": "Always warm up before you start exercising.",
        "Cool down": "After exercise, take five minutes to cool down.",
        # Episode 14 - Emergency
        "Ambulance": "Call an ambulance immediately! Someone is hurt.",
        "Fire truck": "The fire truck arrived in less than five minutes.",
        "Accident": "There was a car accident on the highway.",
        "Injury": "He has a serious injury on his leg.",
        "First aid": "Do you know how to give first aid?",
        "Emergency room": "They took him to the emergency room at the hospital.",
        "Bandage": "Put a bandage on the wound to stop the bleeding.",
        "911": "In an emergency, call 911 for help.",
        # Episode 15 - Supermarket
        "Aisle": "The bread is in aisle four.",
        "Checkout": "There's a long line at the checkout today.",
        "Basket": "I only need a few things, so I'll use a basket.",
        "Organic": "I prefer to buy organic vegetables when possible.",
        "Frozen": "The frozen pizza is on sale this week.",
        "Canned": "We need canned beans for the recipe.",
        "Expiration date": "Always check the expiration date before you buy food.",
        "Coupon": "I have a coupon for ten percent off my total.",
        # Episode 16 - Plans
        "Schedule": "What does your schedule look like this week?",
        "Available": "Are you available on Thursday afternoon?",
        "Cancel": "I'm sorry, but I have to cancel our meeting.",
        "Postpone": "Can we postpone the dinner to next week?",
        "Confirm": "Please confirm your attendance by Friday.",
        "Flexible": "I'm flexible, so any time works for me.",
        "Suggest": "I suggest we meet at the coffee shop at three.",
        "Definitely": "I will definitely be there on time.",
        # Episode 17 - School
        "Semester": "This semester I'm taking five courses.",
        "Lecture": "The professor gave an interesting lecture today.",
        "Assignment": "The assignment is due next Monday.",
        "Grade": "I got an excellent grade on my exam.",
        "Professor": "The professor is very helpful and kind.",
        "Deadline": "Don't miss the deadline for your project.",
        "Scholarship": "She received a scholarship for her good grades.",
        "Campus": "The university campus is very beautiful in autumn.",
        # Episode 18 - Cooking
        "Recipe": "I found a great recipe for chocolate cake.",
        "Ingredient": "The main ingredient in this dish is chicken.",
        "Stir": "Stir the sauce slowly for five minutes.",
        "Chop": "Please chop the onions into small pieces.",
        "Boil": "Boil the water before adding the pasta.",
        "Oven": "Preheat the oven to three hundred and fifty degrees.",
        "Tablespoon": "Add one tablespoon of sugar to the mixture.",
        "Seasoning": "The right seasoning makes any dish taste better.",
        # Episode 19 - Mechanic
        "Engine": "The engine is making a strange noise.",
        "Brake": "I think the brakes need to be replaced.",
        "Tire": "One of my tires is flat and needs to be changed.",
        "Oil change": "You should get an oil change every six months.",
        "Inspection": "The car needs a full inspection before the road trip.",
        "Repair": "How much will the repair cost?",
        "Estimate": "Can you give me an estimate for the work?",
        "Warranty": "The repair comes with a six month warranty.",
        # Episode 20 - Birthday
        "Celebrate": "We're going to celebrate her birthday at a restaurant.",
        "Surprise": "We planned a surprise party for his birthday.",
        "Candle": "She blew out all the candles on her birthday cake.",
        "Wish": "Make a wish before you blow out the candles!",
        "Gift": "I bought a beautiful gift for my mother's birthday.",
        "Decoration": "The room was full of colorful decorations.",
        "Invitation": "Did you receive the invitation to the party?",
        "Toast": "Let's make a toast to the birthday girl!",
        # Episode 21 - Travel
        "Adventure": "Our trip to the mountains was a real adventure.",
        "Souvenir": "I bought a souvenir for each of my friends.",
        "Backpack": "Everything I need fits in my backpack.",
        "Culture": "Learning about the local culture is my favorite part of traveling.",
        "Tourist": "The city center was full of tourists.",
        "Guide": "Our tour guide was very knowledgeable.",
        "Itinerary": "Let me check the itinerary for tomorrow.",
        "Memorable": "It was the most memorable trip of my life.",
        # Episode 22 - Pharmacy
        "Prescription": "You need a doctor's prescription for this medicine.",
        "Tablets": "Take two tablets after each meal.",
        "Side effects": "This medicine may cause side effects like dizziness.",
        "Instructions": "Read the instructions on the box carefully.",
        "Dosage": "The dosage for adults is two pills per day.",
        "Pharmacist": "Ask the pharmacist if you have any questions.",
        "Over-the-counter": "You can buy aspirin over-the-counter without a prescription.",
        # Episode 23 - Work
        "Orientation": "All new employees attend an orientation on their first day.",
        "Colleague": "My colleague helped me with the project.",
        "Supervisor": "My supervisor is very supportive and helpful.",
        "Responsibilities": "My responsibilities include managing the team.",
        "Training": "The company provides excellent training for new hires.",
        "Workplace": "Our workplace has a very positive atmosphere.",
        "Tasks": "I completed all my tasks before the deadline.",
        # Episode 24 - Post Office
        "Package": "I need to send a package to my family.",
        "Envelope": "Put the letter in the envelope and seal it.",
        "Postage": "How much is the postage for this letter?",
        "Delivery": "Standard delivery takes about five business days.",
        "Address": "Please write the address clearly on the package.",
        "Stamp": "I need three stamps for these postcards.",
        "Tracking": "You can check the tracking number online.",
        "Express": "Express mail is faster but costs more money.",
        # Episode 25 - Car Rental
        "Rental": "The car rental office is near the airport.",
        "License": "You need a valid driver's license to rent a car.",
        "Insurance": "Full insurance is included in the rental price.",
        "Mileage": "The rental includes unlimited mileage.",
        "Fuel": "Please return the car with a full tank of fuel.",
        "Automatic": "I prefer an automatic car because it's easier to drive.",
        "Manual": "Manual cars are usually cheaper to rent.",
        # Episode 26 - Neighbors
        "Neighbor": "My neighbor is very kind and always says hello.",
        "Community": "We have a strong community in our building.",
        "Friendly": "Everyone in this neighborhood is very friendly.",
        "Apartment": "My apartment is on the third floor.",
        "Building": "The building has ten floors and an elevator.",
        "Welcome": "Welcome to our neighborhood!",
        "Helpful": "The neighbors are always helpful when you need something.",
        # Episode 27 - Dentist
        "Toothache": "I've had a toothache for three days.",
        "Filling": "The dentist said I need two fillings.",
        "Cleaning": "I go to the dentist for a cleaning twice a year.",
        "Check-up": "Regular check-ups can prevent serious dental problems.",
        "X-ray": "The dentist took an X-ray of my teeth.",
        "Cavity": "The dentist found a small cavity in my back tooth.",
        "Treatment": "The treatment will take about thirty minutes.",
        # Episode 28 - Transport
        "Bus": "The bus to the city center leaves every fifteen minutes.",
        "Subway": "The subway is the fastest way to travel in the city.",
        "Ticket": "A one-way ticket costs two dollars.",
        "Schedule": "Check the bus schedule before you leave home.",
        "Route": "Bus route number five goes to the airport.",
        "Platform": "The train leaves from platform three.",
        "Conductor": "Show your ticket to the conductor on the bus.",
        # Episode 29 - Online
        "Website": "The website has a great selection of products.",
        "Cart": "I added three items to my shopping cart.",
        "Payment": "You can choose your payment method at checkout.",
        "Shipping": "Free shipping is available on orders over fifty dollars.",
        "Order": "I placed an order for a new laptop yesterday.",
        "Confirmation": "You'll receive a confirmation email after your purchase.",
        # Episode 30 - Embassy
        "Embassy": "The embassy is open from Monday to Friday.",
        "Visa": "I need a visa to travel to the United States.",
        "Documents": "Please bring all the required documents to your appointment.",
        "Purpose": "The purpose of my visit is tourism.",
        "Stay": "I plan to stay for two weeks.",
        "Application": "I submitted my visa application online.",
    }
    return examples.get(word, f"I use the word {word} often in daily conversations.")


def _get_extended_dialogue(ep):
    """Generate additional dialogue lines to extend the conversation."""
    extensions = {
        1: [  # Airport
            ("Traveler", "Excuse me, is there a duty-free shop near gate B7?"),
            ("Agent", "Yes, there's a duty-free shop right before the gate area. You'll see it on your left."),
            ("Traveler", "Thank you. Also, how long is the flight to my destination?"),
            ("Agent", "The flight is approximately three hours and twenty minutes."),
            ("Traveler", "Is there food service on the plane?"),
            ("Agent", "Yes, a meal will be served about one hour after takeoff. You can also buy snacks."),
            ("Traveler", "One more question. What happens if there's a delay?"),
            ("Agent", "If there's a delay, we will announce it on the screens and at the gate. Don't worry."),
        ],
        2: [  # Restaurant
            ("Customer", "The soup was delicious! Can we see the wine list?"),
            ("Waiter", "Of course. We have red wine, white wine, and local wines. What do you prefer?"),
            ("Customer", "I'll have a glass of red wine, please. Is the tip included in the bill?"),
            ("Waiter", "No, the tip is not included. Most guests leave about ten to fifteen percent."),
            ("Customer", "Good to know. Can we also get a table near the window next time?"),
            ("Waiter", "Certainly! Just mention it when you make your reservation."),
            ("Customer", "We really enjoyed everything. The service was excellent."),
            ("Waiter", "Thank you so much! We hope to see you again soon. Have a wonderful evening."),
        ],
        3: [  # Job Interview
            ("Interviewer", "Can you tell me about a challenge you faced at your previous job?"),
            ("Candidate", "Yes. We had a project with a tight deadline. I organized the team and we finished on time."),
            ("Interviewer", "That shows good leadership. Where do you see yourself in five years?"),
            ("Candidate", "I see myself growing with this company, maybe leading a larger team."),
            ("Interviewer", "Do you have any questions for us about the position?"),
            ("Candidate", "Yes. What does a typical day look like in this role?"),
            ("Interviewer", "You would attend meetings in the morning, and work on projects in the afternoon."),
            ("Candidate", "That sounds perfect. Thank you for this opportunity. I'm very interested in this position."),
        ],
        4: [  # Hotel
            ("Guest", "Is there a swimming pool in the hotel?"),
            ("Receptionist", "Yes, the swimming pool is on the fifth floor. It's open from seven AM to ten PM."),
            ("Guest", "Wonderful! Is room service available at any time?"),
            ("Receptionist", "Room service is available twenty-four hours a day. Here is the menu in your room."),
            ("Guest", "Can I extend my stay for one more night?"),
            ("Receptionist", "Let me check availability. Yes, we can extend your reservation. No problem at all."),
            ("Guest", "Is there a shuttle service to the airport?"),
            ("Receptionist", "Yes, the hotel shuttle runs every hour. I can book a seat for you when you're ready."),
        ],
        5: [  # Shopping
            ("Customer", "Do you have this dress in a different color? Maybe red or green?"),
            ("Salesperson", "We have it in red, green, and black. Would you like to try all three?"),
            ("Customer", "Just the red one, please. Where can I find shoes that match?"),
            ("Salesperson", "The shoe department is on the second floor. They have great options."),
            ("Customer", "Is there a special sale this weekend?"),
            ("Salesperson", "Yes, this weekend everything is fifty percent off. It's our biggest sale of the year."),
            ("Customer", "That's amazing! I'll definitely come back. Thank you for your help."),
            ("Salesperson", "You're welcome! Don't forget to sign up for our loyalty card for extra discounts."),
        ],
        6: [  # Doctor
            ("Patient", "Doctor, should I rest at home or can I go to work?"),
            ("Doctor", "You should rest at home for at least three days. Drink plenty of water and sleep well."),
            ("Patient", "What foods should I eat while I'm recovering?"),
            ("Doctor", "Eat light foods like soup and fruit. Avoid heavy or spicy food for now."),
            ("Patient", "Can I exercise while I'm taking the medicine?"),
            ("Doctor", "Light walking is fine, but avoid intense exercise until you feel completely better."),
            ("Patient", "If the symptoms don't improve in a week, should I be worried?"),
            ("Doctor", "Come back to see me if you're not better in a week. We may need to try a different medicine."),
        ],
        7: [  # Airport 2
            ("Agent", "What about carry-on luggage? Are there size restrictions?"),
            ("Staff", "Yes, carry-on bags must fit in the overhead bin. The maximum size is fifty-five centimeters."),
            ("Agent", "I have a laptop bag. Does that count as a second carry-on item?"),
            ("Staff", "A laptop bag and a small personal item are both allowed on board."),
            ("Agent", "Is there free WiFi in the terminal while I wait?"),
            ("Staff", "Yes, free WiFi is available throughout the terminal. The password is on the signs."),
            ("Agent", "Thank you for all the information. You've been very helpful."),
            ("Staff", "You're welcome. Enjoy your trip to London! The weather there should be lovely."),
        ],
        8: [  # Making Friends
            ("Sarah", "What kind of music do you like? I love pop and rock music."),
            ("David", "I'm into jazz and classical music, but I enjoy pop too. Maybe we can go to a concert sometime."),
            ("Sarah", "That would be amazing! Do you know any good restaurants in this area?"),
            ("David", "There's a great Italian restaurant two blocks from here. The pasta there is incredible."),
            ("Sarah", "I love Italian food! What about sports? Do you play anything?"),
            ("David", "I play basketball on weekends with some friends. You're welcome to join us!"),
            ("Sarah", "I'd love to try! I used to play volleyball in school."),
            ("David", "Great! I think we're going to be good friends. This neighborhood is lucky to have you."),
        ],
        9: [  # Directions
            ("Tourist", "Is there a bus that goes to the museum?"),
            ("Local", "Yes, bus number seven stops right in front of the museum. The bus stop is over there."),
            ("Tourist", "How often does the bus come?"),
            ("Local", "Every fifteen minutes during the day. It's very convenient."),
            ("Tourist", "Are there any good restaurants near the museum for lunch?"),
            ("Local", "There's a nice cafe right next to the museum entrance. They serve excellent sandwiches."),
            ("Tourist", "One more thing. Where is the nearest ATM? I need to get some cash."),
            ("Local", "There's an ATM at the corner of the next block, right next to the pharmacy. You can't miss it."),
        ],
        10: [  # Phone
            ("Caller", "Actually, I have another question. Do I need to bring anything to my appointment?"),
            ("Receptionist", "Please bring your insurance card and a list of any medicines you're currently taking."),
            ("Caller", "Got it. Can I also get directions to your office? I'm new to the area."),
            ("Receptionist", "We're on Main Street, next to the library. There's free parking behind the building."),
            ("Caller", "Is it okay to arrive early for my appointment?"),
            ("Receptionist", "Yes, we recommend arriving ten minutes early to fill out some forms."),
            ("Caller", "Perfect. If I need to reschedule, how much notice do I need to give?"),
            ("Receptionist", "Please call at least twenty-four hours before your appointment to reschedule. Thank you for calling!"),
        ],
        11: [  # Bank
            ("Customer", "Can I set up automatic payments for my bills?"),
            ("Bank Teller", "Yes, you can set up automatic bill payments through our online banking system."),
            ("Customer", "What about international money transfers? How long do they take?"),
            ("Bank Teller", "International transfers take three to five business days. There's a small fee."),
            ("Customer", "Is there a mobile app I can use to check my account?"),
            ("Bank Teller", "Yes, our mobile app is free to download. You can check your balance, make transfers, and pay bills."),
            ("Customer", "What happens if someone steals my credit card?"),
            ("Bank Teller", "Call us immediately and we'll block the card. You're protected against fraud with our security system."),
        ],
        12: [  # Apartment
            ("Tenant", "Is there a parking space included with the apartment?"),
            ("Landlord", "Yes, one parking space in the garage is included in the rent."),
            ("Tenant", "Are pets allowed in the building?"),
            ("Landlord", "Small pets like cats are allowed, but you need to inform me first."),
            ("Tenant", "What about maintenance? Who do I call if something breaks?"),
            ("Landlord", "Call me directly. I usually send a repair person within twenty-four hours."),
            ("Tenant", "The apartment looks perfect. When can I move in?"),
            ("Landlord", "The apartment is available from the first of next month. Just sign the lease and pay the deposit."),
        ],
        13: [  # Gym
            ("Customer", "Do you offer group fitness classes?"),
            ("Staff", "Yes, we have yoga, spinning, and aerobics classes every day. They're included in your membership."),
            ("Customer", "What time is the gym open?"),
            ("Staff", "We're open from six AM to eleven PM on weekdays, and eight AM to eight PM on weekends."),
            ("Customer", "Is there a locker room where I can keep my things?"),
            ("Staff", "Yes, we have locker rooms with showers. Bring your own lock for the lockers."),
            ("Customer", "Can I bring a friend for a free trial?"),
            ("Staff", "Absolutely! Every member can bring a guest once a week for free. It's a great way to share the experience."),
        ],
        14: [  # Emergency
            ("Caller", "The person is conscious but they're in a lot of pain. What should I do?"),
            ("Operator", "Keep them still and don't move them. The ambulance will be there in about five minutes."),
            ("Caller", "There are two other people in the car. They seem okay, just scared."),
            ("Operator", "That's good. Make sure everyone stays out of the road for safety."),
            ("Caller", "Should I call anyone else? The police maybe?"),
            ("Operator", "We've already notified the police. They're on their way too."),
            ("Caller", "I can see the ambulance now. They're turning onto Main Street."),
            ("Operator", "Great. You've done an excellent job helping. The paramedics will take it from here."),
        ],
        15: [  # Supermarket
            ("Customer", "Do you have fresh bread? The bakery section looks wonderful."),
            ("Staff", "Yes, we bake fresh bread every morning. It's right over there, near the deli counter."),
            ("Customer", "I also need cleaning products. Which aisle are they in?"),
            ("Staff", "Cleaning products are in aisle nine, next to the paper towels and toilet paper."),
            ("Customer", "Do you have a loyalty card program? I shop here every week."),
            ("Staff", "Yes! Sign up at the checkout and you'll earn points on every purchase."),
            ("Customer", "One last thing. Is there a pharmacy inside the supermarket?"),
            ("Staff", "Yes, the pharmacy is located at the back of the store, past the frozen food section."),
        ],
        16: [  # Plans
            ("Friend A", "Should we invite Maria and Jack to come hiking with us?"),
            ("Friend B", "Great idea! The more people, the more fun. I'll call them tonight."),
            ("Friend A", "We should also decide what to bring. I'll pack sandwiches and water."),
            ("Friend B", "Perfect. I'll bring fruits and some snacks. Don't forget sunscreen and a hat."),
            ("Friend A", "Good thinking! What about after the hike? Should we grab dinner somewhere?"),
            ("Friend B", "Let's play it by ear. If we're not too tired, we could try that new restaurant downtown."),
            ("Friend A", "Sounds perfect! This weekend is going to be so much fun."),
            ("Friend B", "I agree! It's been a while since we all spent time together. Can't wait!"),
        ],
        17: [  # School
            ("Student", "Professor, are there any study groups for this class?"),
            ("Professor", "Yes, several students meet in the library every Wednesday evening. You should join them."),
            ("Student", "That would be helpful. Where can I find past exam papers for practice?"),
            ("Professor", "They're available on the university website, under course materials."),
            ("Student", "I'm also thinking about doing an internship this summer. Do you have any advice?"),
            ("Professor", "Start applying early. I can write you a recommendation letter if you need one."),
            ("Student", "That would be amazing! Thank you so much, Professor."),
            ("Professor", "You're welcome. Remember, success in school comes from hard work and consistency. Keep it up!"),
        ],
        18: [  # Cooking
            ("Cook A", "The pasta is almost ready! Should we make a salad too?"),
            ("Cook B", "Good idea! Wash the lettuce and chop some tomatoes and cucumbers."),
            ("Cook A", "What about the salad dressing? Should I make one from scratch?"),
            ("Cook B", "Just mix olive oil, lemon juice, salt, and pepper. Simple and delicious!"),
            ("Cook A", "This looks like a restaurant meal! I'm so proud of us."),
            ("Cook B", "Cooking together makes it so much more fun. We should do this every week."),
            ("Cook A", "Absolutely! Next time, let's try making pizza from scratch."),
            ("Cook B", "Deal! I'll find a good recipe. Now, let's set the table and enjoy our dinner!"),
        ],
        19: [  # Mechanic
            ("Customer", "Do you also do car washing and detailing here?"),
            ("Mechanic", "We offer basic washing, but for full detailing, I recommend the shop next door."),
            ("Customer", "How often should I get my brakes checked?"),
            ("Mechanic", "Every twelve months or fifteen thousand miles, whichever comes first."),
            ("Customer", "My windshield wipers are also not working well. Can you replace them?"),
            ("Mechanic", "Sure, new wipers cost about twenty dollars installed. I'll add it to the estimate."),
            ("Customer", "Do you accept credit cards for payment?"),
            ("Mechanic", "Yes, we accept cash, credit cards, and debit cards. I'll have everything ready by three o'clock."),
        ],
        20: [  # Birthday
            ("Friend A", "What kind of cake did you order? Sarah loves chocolate."),
            ("Friend B", "I got a three-layer chocolate cake with strawberries on top. She'll love it."),
            ("Friend A", "Perfect choice! How many people are coming to the party?"),
            ("Friend B", "About twenty people. Sarah thinks it's just a small dinner, so she'll be very surprised."),
            ("Friend A", "Should we play music or party games?"),
            ("Friend B", "Both! I made a playlist of her favorite songs, and we have karaoke planned too."),
            ("Friend A", "This is going to be the best birthday party ever!"),
            ("Friend B", "I agree! Everyone put in so much effort. Sarah is going to be so happy."),
        ],
        21: [  # Travel
            ("Traveler A", "The best part was trying the local street food. It was so different from home."),
            ("Friend", "Did you have any problems with the language? Not many people speak English there."),
            ("Traveler A", "A little bit, but I used a translation app on my phone. It was very helpful."),
            ("Friend", "Smart! How long was your trip? Did you feel like it was enough time?"),
            ("Traveler A", "I was there for two weeks. I wish I had more time. There's so much to see and do."),
            ("Friend", "What advice would you give someone planning their first trip to Japan?"),
            ("Traveler A", "Learn a few basic phrases in Japanese, bring comfortable shoes, and be open to new experiences."),
            ("Friend", "Thanks for the tips! I'm going to start planning my trip right away."),
        ],
        22: [  # Pharmacy
            ("Customer", "Can I take this medicine with food or on an empty stomach?"),
            ("Pharmacist", "Take it after meals. This will reduce the chance of an upset stomach."),
            ("Customer", "How long should I continue taking the medicine?"),
            ("Pharmacist", "Complete the full course of seven days, even if you start feeling better earlier."),
            ("Customer", "Do you have any vitamins you would recommend?"),
            ("Pharmacist", "Vitamin C and Vitamin D are great for your immune system, especially in winter."),
            ("Customer", "I'll take both. Is there anything else I should know?"),
            ("Pharmacist", "Store the medicine in a cool, dry place away from children. And come back if symptoms don't improve."),
        ],
        23: [  # Work
            ("Supervisor", "Let me show you the break room. Lunch is from twelve to one o'clock."),
            ("New Employee", "Thank you. Is there a dress code at the workplace?"),
            ("Supervisor", "Business casual on most days. Fridays are casual dress days."),
            ("New Employee", "That's nice. When is my first team meeting?"),
            ("Supervisor", "This afternoon at two. It's a weekly meeting where everyone shares updates."),
            ("New Employee", "Perfect. Who should I contact if I have IT problems with my computer?"),
            ("Supervisor", "The IT department is on the second floor. They're very quick and helpful."),
            ("New Employee", "Thank you for everything, John. I'm really happy to be part of this team."),
        ],
        24: [  # Post Office
            ("Customer", "How long does express delivery take to Germany?"),
            ("Clerk", "Express delivery to Germany takes three to five business days."),
            ("Customer", "What if the package gets lost? Is there any protection?"),
            ("Clerk", "Yes, with tracking you can follow your package. We also offer insurance for valuable items."),
            ("Customer", "I'm sending a birthday gift. Can I add a fragile sticker?"),
            ("Clerk", "Of course. We also have special boxes for fragile items. Would you like one?"),
            ("Customer", "That would be great. How much is the insurance?"),
            ("Clerk", "Insurance costs five dollars for packages valued up to five hundred dollars. It's worth it for peace of mind."),
        ],
        25: [  # Car Rental
            ("Customer", "What happens if the car breaks down during my rental period?"),
            ("Agent", "Call our roadside assistance number. We'll send help or bring you a replacement car."),
            ("Customer", "Can I drive the rental car to another country?"),
            ("Agent", "Cross-border travel is allowed with prior notice. There's an additional fee of thirty dollars."),
            ("Customer", "Is there a GPS navigation system in the car?"),
            ("Agent", "Yes, all our automatic cars come with built-in GPS. I'll show you how to use it."),
            ("Customer", "Perfect. I'm ready to pick up the car. Where do I sign?"),
            ("Agent", "Right here. And here are the keys. The car is in parking spot number twelve. Enjoy your trip!"),
        ],
        26: [  # Neighbors
            ("New Resident", "Is there a laundry room in the building?"),
            ("Neighbor", "Yes, it's in the basement. Machines are coin-operated. I always do laundry on Sundays."),
            ("New Resident", "Good to know! What about garbage collection? Which day is it?"),
            ("Neighbor", "Garbage is collected on Tuesdays and Fridays. The bins are behind the building."),
            ("New Resident", "Is there a good supermarket near here?"),
            ("Neighbor", "There's one just five minutes away on foot. They have everything you need."),
            ("New Resident", "You've been so helpful, Tom. I feel much better about moving here now."),
            ("Neighbor", "That's what neighbors are for! Don't hesitate to ask if you need anything else. Cheers!"),
        ],
        27: [  # Dentist
            ("Patient", "Do you offer teeth whitening services?"),
            ("Dentist", "Yes, we do. Professional whitening takes about one hour and the results are excellent."),
            ("Patient", "How much does it cost?"),
            ("Dentist", "It's two hundred dollars per session. Many patients see a big difference after just one visit."),
            ("Patient", "What about dental insurance? Do you accept most plans?"),
            ("Dentist", "Yes, we accept most major dental insurance plans. Our receptionist can check your coverage."),
            ("Patient", "That's helpful. Any tips for keeping my teeth healthy at home?"),
            ("Dentist", "Brush twice a day, floss daily, and limit sugary foods. Simple habits make a big difference!"),
        ],
        28: [  # Transport
            ("Tourist", "How much does a daily bus pass cost?"),
            ("Local", "A daily pass is five dollars. It gives you unlimited rides on buses and the subway."),
            ("Tourist", "That's a great deal! Can I use a credit card to buy it?"),
            ("Local", "Yes, you can buy passes at any subway station using cash or credit card."),
            ("Tourist", "Is there a late-night service? I might stay out late tonight."),
            ("Local", "Buses stop at midnight, but the subway runs until one AM on weekends."),
            ("Tourist", "What about taxis or ride-sharing apps? Are they available here?"),
            ("Local", "Yes, taxi stands are everywhere, and popular ride-sharing apps work well in this city. Very convenient!"),
        ],
        29: [  # Online Shopping
            ("Customer", "What if I receive a damaged item? Can I return it easily?"),
            ("Helper", "Yes, most websites offer free returns within thirty days. Just print the return label."),
            ("Customer", "How do I know if a website is safe for online shopping?"),
            ("Helper", "Look for a lock icon in your browser and check that the website address starts with H T T P S."),
            ("Customer", "Can I save my credit card information for next time?"),
            ("Helper", "You can, but it's safer to use a payment service like PayPal for extra protection."),
            ("Customer", "Thanks for all the help! Online shopping seems much easier now."),
            ("Helper", "You're welcome! Once you get used to it, it's very convenient. Happy shopping!"),
        ],
        30: [  # Embassy
            ("Applicant", "How long does it usually take to process a visa application?"),
            ("Officer", "Processing usually takes five to ten business days. Sometimes it can take longer."),
            ("Applicant", "Will you contact me by email or phone when it's ready?"),
            ("Officer", "We'll send you an email notification. You can also check the status online."),
            ("Applicant", "If my visa is approved, where do I pick up my passport?"),
            ("Officer", "You can pick it up here at the embassy, or we can mail it to your address."),
            ("Applicant", "Thank you very much for your help. The process was very clear and easy."),
            ("Officer", "You're welcome. We try to make the process as simple as possible. Good luck with your trip!"),
        ],
    }
    return extensions.get(ep["id"], [])


def _get_key_phrases(ep):
    """Return key phrases for review section."""
    phrases_map = {
        1: ["Can I see your passport, please?", "I'd like a window seat.", "Your flight departs from gate B7.", "Have a nice flight!", "Is there a delay on my flight?"],
        2: ["Table for two, please.", "Can I see the menu?", "What do you recommend?", "Could we have the bill, please?", "Is the tip included?"],
        3: ["Tell me about yourself.", "I have five years of experience.", "What are your salary expectations?", "Where do you see yourself in five years?", "Do you have any questions for us?"],
        4: ["I have a reservation.", "What time is breakfast?", "Where is the elevator?", "What time is check-out?", "Is room service available?"],
        5: ["I'm looking for a blue dress.", "Is there a discount?", "Can I pay by credit card?", "Can I get a refund?", "Do you have this in a different size?"],
        6: ["I have a headache and fever.", "How long have you had these symptoms?", "Take this medicine twice a day.", "Should I make another appointment?", "You should rest at home."],
        7: ["I'd like to check in for my flight.", "Do I need to go through passport control?", "What time is the departure?", "Is there free WiFi in the terminal?", "Have a safe flight!"],
        8: ["Let me introduce myself.", "What's your hobby?", "We should hang out sometime.", "Can I invite you to coffee?", "Let me give you my number."],
        9: ["How do I get to the museum?", "Go straight ahead for two blocks.", "Turn left at the intersection.", "It's opposite the church.", "It's about a five-minute walk."],
        10: ["How can I help you?", "I'd like to make an appointment.", "We'll send you a text message.", "Don't hang up.", "Please arrive ten minutes early."],
        11: ["I'd like to open a bank account.", "What's the interest rate?", "Can I make a deposit?", "Can I check my balance online?", "We also offer loans."],
        12: ["I'm here to see the apartment.", "Is it furnished?", "Are utilities included?", "How much is the deposit?", "How long is the lease?"],
        13: ["I'd like a gym membership.", "What does a typical workout look like?", "Should I stretch before or after?", "How much is the monthly fee?", "Do you offer group classes?"],
        14: ["What's your emergency?", "Someone is injured.", "I'm sending an ambulance.", "Keep the person calm.", "You did great with the first aid."],
        15: ["Where is the frozen food aisle?", "Do you have a basket?", "Check the expiration date.", "Where is the checkout?", "I have a coupon."],
        16: ["Are you available this weekend?", "I suggest we go hiking.", "Should we postpone?", "I'll text you to confirm.", "Sounds like a plan!"],
        17: ["What's the deadline?", "What grade do I need?", "Are there study groups?", "Can you write a recommendation letter?", "Keep up the good work!"],
        18: ["Do you have the recipe?", "First, chop the vegetables.", "Add a tablespoon of olive oil.", "Preheat the oven to 350 degrees.", "Let's enjoy our homemade meal!"],
        19: ["My car is making a strange noise.", "Let me inspect it.", "When was your last oil change?", "How long will the repair take?", "This repair has a warranty."],
        20: ["Are you coming to the party?", "I bought a gift for her.", "Light the candles on the cake.", "Make a wish!", "Let's make a toast!"],
        21: ["I just came back from an adventure.", "Did you buy souvenirs?", "Did you follow a strict itinerary?", "The food and temples were amazing.", "It was a truly memorable trip."],
        22: ["I have a prescription.", "What's the correct dosage?", "Are there any side effects?", "Take it after meals.", "Complete the full course of medicine."],
        23: ["Welcome to your first day!", "Let me introduce you to your colleagues.", "What does my schedule look like?", "How long is the training period?", "I'm ready to work hard."],
        24: ["I need to send a package.", "What's the postage cost?", "Can I get tracking?", "How long does delivery take?", "I also need stamps."],
        25: ["I'd like to rent a car.", "What's included in the price?", "Is fuel included?", "How much is the deposit?", "When do I return the car?"],
        26: ["I just moved in.", "Welcome to the building!", "Is there anything I should know?", "We have a WhatsApp group.", "If you need anything, just knock."],
        27: ["I have a terrible toothache.", "You'll need a filling.", "Will the treatment hurt?", "How often should I come for a check-up?", "Brush twice a day and floss daily."],
        28: ["Which bus goes downtown?", "You can buy tickets from the conductor.", "Check the schedule.", "Which platform do I need?", "Buses usually run on time."],
        29: ["I'm trying to order online.", "How do I add items to my cart?", "What's the difference between standard and express?", "Will I get a confirmation?", "You can track your package."],
        30: ["I'm here for my visa interview.", "What's the purpose of your visit?", "Do you have proof of reservations?", "How long does processing take?", "We'll contact you by email."],
    }
    return phrases_map.get(ep["id"], [])


def generate_audio(text, output_path, voice=VOICE):
    """Generate audio using edge-tts."""
    cmd = [
        "python3", "-m", "edge_tts",
        "--text", text,
        "--voice", voice,
        "--write-media", output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def get_duration(filepath):
    """Get duration in seconds using ffprobe."""
    result = subprocess.run(
        ["ffprobe", "-i", filepath, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())


def main():
    results = []
    
    for ep in episodes:
        filepath = os.path.join(PODCAST_DIR, ep["file"])
        old_duration = get_duration(filepath)
        
        if old_duration >= 300:  # Already 5+ minutes
            print(f"Episode {ep['id']}: Already {old_duration:.0f}s, skipping.")
            results.append({"id": ep["id"], "status": "skipped", "old": old_duration})
            continue
        
        print(f"Episode {ep['id']} ({ep['title']}): {old_duration:.0f}s -> Expanding...")
        
        # Build expanded script
        script = build_expanded_script(ep)
        
        # Save script for reference
        script_path = f"/tmp/podcast_script_ep{ep['id']}.txt"
        with open(script_path, "w") as f:
            f.write(script)
        
        # Generate audio
        temp_path = f"/tmp/podcast_temp_ep{ep['id']}.mp3"
        try:
            generate_audio(script, temp_path)
            new_duration = get_duration(temp_path)
            print(f"  Generated: {new_duration:.0f}s")
            
            # Replace original
            os.replace(temp_path, filepath)
            results.append({"id": ep["id"], "status": "expanded", "old": old_duration, "new": new_duration})
            
        except Exception as e:
            print(f"  ERROR: {e}")
            results.append({"id": ep["id"], "status": "error", "error": str(e)})
    
    # Summary
    print("\n=== SUMMARY ===")
    for r in results:
        if r["status"] == "expanded":
            print(f"Episode {r['id']}: {r['old']:.0f}s -> {r['new']:.0f}s ✅")
        elif r["status"] == "skipped":
            print(f"Episode {r['id']}: {r['old']:.0f}s (already long enough) ⏭️")
        else:
            print(f"Episode {r['id']}: ERROR - {r.get('error', 'unknown')} ❌")


if __name__ == "__main__":
    main()
