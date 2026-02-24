#!/usr/bin/env python3
"""Regenerate ALL 30 episodes (1-30) with edge-tts voices for consistency."""
import os
import subprocess
import time
import shutil
from pathlib import Path

BASE_DIR = Path("/Users/aiagent/.openclaw/workspace/english-app/podcast")
OUTPUT_WEB = Path("/Users/aiagent/.openclaw/workspace/english-app/website/public/podcast")
OUTPUT_DIST = Path("/Users/aiagent/.openclaw/workspace/english-app/website/dist/podcast")

# Create output directories
OUTPUT_WEB.mkdir(parents=True, exist_ok=True)
OUTPUT_DIST.mkdir(parents=True, exist_ok=True)

# Use consistent, natural-sounding voices
MALE_VOICE = "en-US-GuyNeural"          # Reliable male voice
FEMALE_VOICE = "en-US-JennyNeural"      # Reliable female voice

def edge_tts_generate(text, voice, output_path):
    """Generate speech using edge-tts."""
    if output_path.exists() and output_path.stat().st_size > 1000:
        print(f"    [skip] {output_path.name}")
        return True
    
    print(f"    [tts] {output_path.name} ({voice})")
    try:
        cmd = [
            "python3", "-m", "edge_tts",
            "--text", text,
            "--voice", voice,
            "--write-media", str(output_path)
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            print(f"      ❌ TTS failed: {result.stderr}")
            return False
        time.sleep(0.2)
        return True
    except Exception as e:
        print(f"      ❌ TTS error: {e}")
        return False

def create_silence(duration, output_path):
    """Create a silence file."""
    if output_path.exists():
        return True
    try:
        subprocess.run([
            "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono",
            "-t", str(duration), "-q:a", "9", str(output_path)
        ], capture_output=True, check=True, timeout=10)
        return True
    except:
        return False

# Complete episode data for all 30 episodes
ALL_EPISODES = [
    # Episodes 1-21 (existing, now with edge-tts)
    {
        "id": 1,
        "title": "At the Airport",
        "slug": "at-the-airport",
        "vocab": ["boarding pass", "gate", "luggage", "passport", "check in", "departure", "arrival", "delay"],
        "dialogue": [
            ("F", "Good morning. Can I see your passport and boarding pass, please?"),
            ("M", "Of course. Here you go."),
            ("F", "Thank you. Are you checking in any luggage today?"),
            ("M", "Yes, I have one suitcase."),
            ("F", "Please place it on the scale. Your bag is twenty-two kilograms. That's fine."),
            ("M", "A window seat, please."),
            ("F", "Here is your boarding pass. Your flight departs from gate B7 at 3:45. Have a nice flight!"),
            ("M", "Thank you very much for your help."),
        ]
    },
    {
        "id": 2,
        "title": "At the Restaurant",
        "slug": "restaurant",
        "vocab": ["menu", "appetizer", "main course", "dessert", "bill", "tip", "reservation", "waiter"],
        "dialogue": [
            ("M", "Good evening. Welcome to our restaurant. Table for two?"),
            ("F", "Yes, please. Do you have the menu in English?"),
            ("M", "Of course. Here is the menu. Can I start you with an appetizer?"),
            ("F", "We'll have the soup. What's your main course recommendation?"),
            ("M", "The grilled chicken is very popular. It comes with vegetables."),
            ("F", "Perfect. And for dessert, what do you suggest?"),
            ("M", "Our chocolate cake is delicious. I'll bring your soup now."),
            ("F", "Thank you. Could we also have the bill, please?"),
        ]
    },
    {
        "id": 3,
        "title": "Job Interview",
        "slug": "job-interview",
        "vocab": ["resume", "experience", "salary", "position", "skills", "hire", "interview", "qualifications"],
        "dialogue": [
            ("F", "Good morning. Please have a seat. Tell me about yourself."),
            ("M", "Good morning. I have five years of experience in marketing."),
            ("F", "That's impressive. What are your main skills and qualifications?"),
            ("M", "I'm good with computers and I work well in teams."),
            ("F", "What position are you most interested in at our company?"),
            ("M", "I'd love to work as a marketing manager. It matches my experience."),
            ("F", "What are your salary expectations for this position?"),
            ("M", "I'm flexible, but I hope you'll hire me based on my skills."),
        ]
    },
    {
        "id": 4,
        "title": "At the Hotel",
        "slug": "hotel",
        "vocab": ["reception", "room key", "check-out", "single room", "double room", "breakfast", "elevator", "lobby"],
        "dialogue": [
            ("F", "Welcome to Grand Hotel. How can I help you today?"),
            ("M", "I have a reservation. A single room for three nights."),
            ("F", "Let me check. Yes, here it is. Here's your room key."),
            ("M", "What time is breakfast served? Is it included?"),
            ("F", "Breakfast is from 7 to 10 AM. Yes, it's included in your double room rate."),
            ("M", "Great! Where is the elevator to my floor?"),
            ("F", "The elevator is right there, past the lobby. Room 304."),
            ("M", "Thank you. What time is check-out tomorrow?"),
        ]
    },
    {
        "id": 5,
        "title": "Shopping",
        "slug": "shopping",
        "vocab": ["discount", "receipt", "fitting room", "size", "cash", "credit card", "refund", "exchange"],
        "dialogue": [
            ("F", "Excuse me, I'm looking for a blue dress, size medium."),
            ("M", "I'll help you find one. The fitting room is over there."),
            ("F", "This looks nice. Is there a discount on this item?"),
            ("M", "Yes, it's 30% off today. Would you like to try it?"),
            ("F", "Perfect! Can I pay with cash or credit card?"),
            ("M", "Both are fine. Do you need a receipt for exchange later?"),
            ("F", "Yes, please. Can I get a refund if it doesn't fit?"),
            ("M", "Of course. You have seven days for exchange or refund."),
        ]
    },
    {
        "id": 6,
        "title": "At the Doctor",
        "slug": "doctor",
        "vocab": ["appointment", "symptoms", "prescription", "fever", "headache", "allergic", "medicine", "pharmacy"],
        "dialogue": [
            ("M", "Good morning. What brings you here today?"),
            ("F", "I have a bad headache and fever. I feel terrible."),
            ("M", "How long have you had these symptoms? Any other issues?"),
            ("F", "Three days now. I'm also allergic to some medicines."),
            ("M", "I'll give you a prescription. Take this medicine twice a day."),
            ("F", "Should I make another appointment to check up?"),
            ("M", "Yes, come back in a week. Take the prescription to the pharmacy."),
            ("F", "Thank you, doctor. I'll get the medicine right away."),
        ]
    },
    {
        "id": 7,
        "title": "At the Airport",
        "slug": "airport",
        "vocab": ["boarding pass", "gate", "luggage", "customs", "departure", "arrival", "passport control", "turbulence"],
        "dialogue": [
            ("M", "Hello. I'd like to check in for my flight to London, please."),
            ("F", "Sure. May I see your passport and boarding pass?"),
            ("M", "Here you go. I have one piece of luggage to check in."),
            ("F", "Thank you. Your flight departs from gate twelve. Departure is at three fifteen."),
            ("M", "Do I need to go through passport control before the gate?"),
            ("F", "Yes. Go through security first, then passport control. Follow the signs."),
            ("M", "Is there any turbulence expected on the flight?"),
            ("F", "The pilot will inform you on board. Have a safe flight! Arrival time is six thirty."),
        ]
    },
    {
        "id": 8,
        "title": "Making Friends",
        "slug": "making-friends",
        "vocab": ["introduce", "hobby", "personality", "hang out", "invite", "nickname", "similar", "trust"],
        "dialogue": [
            ("F", "Hi! I'm Sarah. Let me introduce myself. I just moved here."),
            ("M", "Nice to meet you, Sarah. I'm David. Do you have a nickname?"),
            ("F", "My friends call me Sari. What's your hobby?"),
            ("M", "I love hiking and reading. We have a similar personality, I think."),
            ("F", "That's great! We should hang out sometime."),
            ("M", "Definitely. Can I invite you to a coffee this weekend?"),
            ("F", "I'd love that. It takes time to build trust, but you seem really nice."),
            ("M", "Thanks! Let me give you my number so we can stay in touch."),
        ]
    },
    {
        "id": 9,
        "title": "Asking for Directions",
        "slug": "directions",
        "vocab": ["intersection", "straight ahead", "turn left", "crosswalk", "block", "corner", "opposite", "landmark"],
        "dialogue": [
            ("F", "Excuse me. Can you tell me how to get to the city museum?"),
            ("M", "Sure. Go straight ahead for two blocks."),
            ("F", "Okay. And then?"),
            ("M", "At the intersection, turn left. You'll see a crosswalk."),
            ("F", "Is it on the corner?"),
            ("M", "No, it's opposite the big church. The church is a famous landmark."),
            ("F", "So, two blocks straight, turn left, and it's opposite the church?"),
            ("M", "Exactly. It's about a five-minute walk from this corner."),
        ]
    },
    {
        "id": 10,
        "title": "Phone Conversations",
        "slug": "phone",
        "vocab": ["voicemail", "dial", "hang up", "signal", "text message", "missed call", "speaker", "ringtone"],
        "dialogue": [
            ("F", "Hello, Doctor Brown's office. How can I help you?"),
            ("M", "Hi, I tried to dial earlier but got your voicemail. I had a missed call."),
            ("F", "Yes, we called to confirm your appointment. The signal was bad."),
            ("M", "Sorry about that. Can I make an appointment for next Tuesday?"),
            ("F", "Of course. Ten o'clock works. We'll send you a text message to confirm."),
            ("M", "Perfect. Should I put you on speaker while I check my calendar?"),
            ("F", "Take your time. Don't hang up."),
            ("M", "Tuesday at ten is fine. I'll set a ringtone reminder. Thank you!"),
        ]
    },
    {
        "id": 11,
        "title": "At the Bank",
        "slug": "bank",
        "vocab": ["account", "deposit", "withdrawal", "transfer", "balance", "loan", "interest", "statement"],
        "dialogue": [
            ("M", "Good morning. I'd like to open a new bank account, please."),
            ("F", "Of course. Would you like a savings account or a checking account?"),
            ("M", "A savings account. What's the interest rate?"),
            ("F", "The interest rate is two point five percent per year."),
            ("M", "That sounds good. Can I make a deposit today?"),
            ("F", "Yes. The minimum deposit is fifty dollars. You can set up a transfer."),
            ("M", "Can I check my balance and get a statement online?"),
            ("F", "Absolutely. You'll have full access through our app. We also offer loans."),
        ]
    },
    {
        "id": 12,
        "title": "Renting an Apartment",
        "slug": "apartment",
        "vocab": ["lease", "tenant", "landlord", "deposit", "utilities", "furnished", "spacious", "neighborhood"],
        "dialogue": [
            ("F", "Hi, I'm here to see the apartment. Are you the landlord?"),
            ("M", "Yes, welcome. Come in. As you can see, it's quite spacious."),
            ("F", "It's lovely. Is it furnished?"),
            ("M", "Yes, fully furnished. The kitchen and bedroom have everything you need."),
            ("F", "What about utilities? Are they included?"),
            ("M", "Water is included, but electricity and internet are paid by the tenant."),
            ("F", "How much is the deposit, and how long is the lease?"),
            ("M", "The deposit is one month's rent, and the lease is twelve months. It's a quiet neighborhood."),
        ]
    },
    {
        "id": 13,
        "title": "At the Gym",
        "slug": "gym",
        "vocab": ["treadmill", "weights", "stretch", "membership", "trainer", "workout", "warm up", "cool down"],
        "dialogue": [
            ("M", "Hi, I'd like to sign up for a gym membership."),
            ("F", "Welcome! We have monthly and yearly plans. Would you like a personal trainer?"),
            ("M", "Maybe later. What does a typical workout look like here?"),
            ("F", "Most people warm up on the treadmill for ten minutes, then move to weights."),
            ("M", "That sounds good. Should I stretch before or after?"),
            ("F", "Both! Stretch to warm up, and stretch again to cool down after your workout."),
            ("M", "Great. How much is the monthly membership?"),
            ("F", "It's forty dollars a month. That includes access to all equipment and one free trainer session."),
        ]
    },
    {
        "id": 14,
        "title": "Emergency Situations",
        "slug": "emergency",
        "vocab": ["ambulance", "fire truck", "accident", "injury", "first aid", "emergency room", "bandage", "911"],
        "dialogue": [
            ("F", "911, what's your emergency?"),
            ("M", "There's been a car accident on Main Street. Someone is injured."),
            ("F", "I'm sending an ambulance right away. Are you giving first aid?"),
            ("M", "Yes, I have a bandage on the injury. Should I call the fire truck too?"),
            ("F", "No, just the ambulance. Keep the person calm until help arrives."),
            ("M", "Okay. The ambulance should go to the emergency room after?"),
            ("F", "The paramedics will decide. You did great with the first aid."),
            ("M", "Thank you. I hear the sirens now. Help is coming."),
        ]
    },
    {
        "id": 15,
        "title": "At the Supermarket",
        "slug": "supermarket",
        "vocab": ["aisle", "checkout", "basket", "organic", "frozen", "canned", "expiration date", "coupon"],
        "dialogue": [
            ("F", "Excuse me, where can I find the frozen food aisle?"),
            ("M", "It's in aisle seven, next to the organic vegetables section."),
            ("F", "Great! I also need canned tomatoes. Do you have a basket I can use?"),
            ("M", "The baskets are at the entrance. Canned goods are in aisle three."),
            ("F", "Thank you. Could you check the expiration date on this milk?"),
            ("M", "This one expires next week, but here's a fresher one."),
            ("F", "Perfect! Where is the checkout? I have a coupon to use."),
            ("M", "Checkout is over there. The cashier will help you with your coupon."),
        ]
    },
    {
        "id": 16,
        "title": "Making Plans",
        "slug": "plans",
        "vocab": ["schedule", "available", "cancel", "postpone", "confirm", "flexible", "suggest", "definitely"],
        "dialogue": [
            ("F", "Are you available this weekend? I want to make some plans."),
            ("M", "I'm flexible Saturday, but Sunday I have to confirm with my family."),
            ("F", "Great! I suggest we go hiking. The weather should be nice."),
            ("M", "That sounds fun! What time should we start? I don't want to cancel."),
            ("F", "Let's definitely start early, maybe 8 AM? I'll check my schedule tonight."),
            ("M", "Perfect! Should we postpone if the weather changes?"),
            ("F", "We can be flexible. I'll text you Friday to confirm our plans."),
            ("M", "Sounds like a plan! I'm excited about our weekend adventure."),
        ]
    },
    {
        "id": 17,
        "title": "At School",
        "slug": "school",
        "vocab": ["semester", "lecture", "assignment", "grade", "professor", "deadline", "scholarship", "campus"],
        "dialogue": [
            ("M", "Professor, I have questions about this semester's assignments."),
            ("F", "Of course. Which assignment are you asking about?"),
            ("M", "The research paper. What's the deadline for submission?"),
            ("F", "The deadline is next Friday. Make sure to attend tomorrow's lecture for details."),
            ("M", "I will. Also, what grade do I need to get a scholarship?"),
            ("F", "You need at least an A- average. Are you planning to stay on campus next year?"),
            ("M", "Yes, definitely. I love the campus life and want to continue my studies here."),
            ("F", "Excellent! Keep up the good work, and you'll definitely qualify for the scholarship."),
        ]
    },
    {
        "id": 18,
        "title": "Cooking Together",
        "slug": "cooking",
        "vocab": ["recipe", "ingredient", "stir", "chop", "boil", "oven", "tablespoon", "seasoning"],
        "dialogue": [
            ("F", "Let's cook together! Do you have the recipe for pasta?"),
            ("M", "Yes! First, we need to chop the vegetables and boil water."),
            ("F", "What ingredients do we need? I'll help you stir the sauce."),
            ("M", "We need tomatoes, cheese, and herbs. Add a tablespoon of olive oil too."),
            ("F", "Should I preheat the oven? What temperature for the seasoning?"),
            ("M", "Yes, 350 degrees. Don't forget to add salt and pepper for seasoning."),
            ("F", "This smells amazing! How long should we cook in the oven?"),
            ("M", "About 20 minutes. Then we can enjoy our homemade pasta!"),
        ]
    },
    {
        "id": 19,
        "title": "At the Mechanic",
        "slug": "mechanic",
        "vocab": ["engine", "brake", "tire", "oil change", "inspection", "repair", "estimate", "warranty"],
        "dialogue": [
            ("F", "Hi, my car is making a strange noise. Can you take a look?"),
            ("M", "Of course. It might be the engine or the brakes. Let me inspect it."),
            ("F", "I also think one tire needs to be replaced. How much for repair?"),
            ("M", "I'll give you an estimate after inspection. When did you last have an oil change?"),
            ("F", "About six months ago. Do you think that's the problem?"),
            ("M", "Possibly. Regular oil changes help the engine run smoothly. This repair has a warranty."),
            ("F", "That's good to know. How long will the repair take?"),
            ("M", "About two hours for the engine check and oil change. I'll call you when it's done."),
        ]
    },
    {
        "id": 20,
        "title": "Birthday Party",
        "slug": "birthday",
        "vocab": ["celebrate", "surprise", "candle", "wish", "gift", "decoration", "invitation", "toast"],
        "dialogue": [
            ("F", "Hey! Are you coming to Sarah's birthday party tonight?"),
            ("M", "Of course! I bought a gift for her. It's a surprise."),
            ("F", "That's great! I sent the invitation last week. Did you get it?"),
            ("M", "Yes, I did. I also helped with the decorations at her house."),
            ("F", "Wonderful! We need to light the candles on the cake."),
            ("M", "And then she can make a wish before blowing them out."),
            ("F", "Let's celebrate together. It's going to be a fun night."),
            ("M", "Absolutely! I'll make a toast to her when we're all together."),
        ]
    },
    {
        "id": 21,
        "title": "Travel Stories",
        "slug": "travel",
        "vocab": ["adventure", "souvenir", "backpack", "culture", "tourist", "guide", "itinerary", "memorable"],
        "dialogue": [
            ("M", "I just came back from an amazing adventure in Japan."),
            ("F", "That sounds exciting! Did you buy any souvenirs?"),
            ("M", "Yes, I filled my backpack with gifts for everyone."),
            ("F", "What did you enjoy most about the culture there?"),
            ("M", "The food and the temples. Our guide was really helpful."),
            ("F", "Did you follow a strict itinerary or just explore freely?"),
            ("M", "A bit of both. Some days I was a tourist, other days I wandered."),
            ("F", "It sounds like a truly memorable trip. I'd love to go someday."),
        ]
    },
    
    # Episodes 22-30 (new episodes)
    {
        "id": 22,
        "title": "At the Pharmacy",
        "slug": "at-the-pharmacy",
        "vocab": ["prescription", "medicine", "tablets", "side effects", "instructions", "dosage", "pharmacist", "over-the-counter"],
        "dialogue": [
            ("F", "Good morning. I have a prescription from my doctor. Can you fill it?"),
            ("M", "Of course. Let me check what medicine you need. These are tablets."),
            ("F", "How many should I take? What's the correct dosage?"),
            ("M", "Take two tablets twice a day. Please read the instructions carefully."),
            ("F", "Are there any side effects I should know about?"),
            ("M", "Some people feel sleepy. Don't drive after taking this medicine."),
            ("F", "Do you have anything over-the-counter for headaches?"),
            ("M", "Yes, right over there. Ask the pharmacist if you need help choosing."),
        ]
    },
    {
        "id": 23,
        "title": "Job Training / First Day at Work",
        "slug": "first-day-work",
        "vocab": ["orientation", "colleague", "supervisor", "responsibilities", "training", "workplace", "schedule", "tasks"],
        "dialogue": [
            ("M", "Welcome to your first day! I'm John, your supervisor. Let's start the orientation."),
            ("F", "Thank you! I'm excited to learn about my new responsibilities here."),
            ("M", "Great attitude! Let me introduce you to your colleagues in the workplace."),
            ("F", "That sounds perfect. What does my daily schedule look like?"),
            ("M", "You'll start at 9 AM. Your main tasks include customer service and training."),
            ("F", "I understand. How long will the training period last?"),
            ("M", "About two weeks. Don't worry, everyone will help you learn quickly."),
            ("F", "I appreciate that. I'm ready to work hard and meet my responsibilities."),
        ]
    },
    {
        "id": 24,
        "title": "At the Post Office",
        "slug": "at-the-post-office",
        "vocab": ["package", "envelope", "postage", "delivery", "address", "stamp", "tracking", "express"],
        "dialogue": [
            ("F", "I need to send this package to Germany. What's the postage cost?"),
            ("M", "Let me weigh it. The standard delivery is twenty dollars."),
            ("F", "That's expensive. Is there a cheaper option than express delivery?"),
            ("M", "Regular mail takes longer but costs only twelve dollars."),
            ("F", "That works. Can I get tracking for this envelope too?"),
            ("M", "Yes, tracking costs three extra dollars. Please write the address clearly."),
            ("F", "Perfect. I also need stamps for regular letters."),
            ("M", "A book of stamps is ten dollars. Your package will arrive in two weeks."),
        ]
    },
    {
        "id": 25,
        "title": "Car Rental",
        "slug": "car-rental",
        "vocab": ["rental", "license", "insurance", "mileage", "fuel", "automatic", "manual", "deposit"],
        "dialogue": [
            ("M", "I'd like to rent a car for three days. Do you have automatic cars?"),
            ("F", "Yes, we do. I need to see your driver's license and credit card."),
            ("M", "Here they are. What's included in the rental price?"),
            ("F", "Basic insurance and unlimited mileage. Fuel is not included."),
            ("M", "What about a manual car? Is it cheaper than automatic?"),
            ("F", "Yes, manual is thirty dollars less per day. We need a deposit too."),
            ("M", "How much is the deposit? When do I return the car?"),
            ("F", "Two hundred dollar deposit. Return it with the same fuel level by noon."),
        ]
    },
    {
        "id": 26,
        "title": "Meeting Neighbors",
        "slug": "meeting-neighbors",
        "vocab": ["neighbor", "introduce", "community", "friendly", "apartment", "building", "welcome", "helpful"],
        "dialogue": [
            ("F", "Hello! I just moved into apartment 3B. I'm Lisa, your new neighbor."),
            ("M", "Welcome to the building! I'm Tom from 3A. The community here is very friendly."),
            ("F", "That's wonderful to hear. Is there anything I should know about living here?"),
            ("M", "The neighbors are all helpful. We have a WhatsApp group for the building."),
            ("F", "That sounds great! I'd love to join and introduce myself to everyone."),
            ("M", "Perfect! Most people here have been neighbors for years. You'll love it."),
            ("F", "Thank you for being so welcoming. It's nice to meet friendly people."),
            ("M", "Anytime! If you need anything, just knock on my door. Welcome again!"),
        ]
    },
    {
        "id": 27,
        "title": "At the Dentist",
        "slug": "at-the-dentist",
        "vocab": ["appointment", "toothache", "filling", "cleaning", "check-up", "x-ray", "cavity", "treatment"],
        "dialogue": [
            ("M", "Good morning. I have a terrible toothache. Can you help me?"),
            ("F", "Of course. Let me examine your teeth. When did the pain start?"),
            ("M", "Three days ago. It hurts when I eat or drink something cold."),
            ("F", "I see a cavity here. You'll need a filling and maybe an X-ray."),
            ("M", "Will the treatment hurt? I'm a bit nervous about dental work."),
            ("F", "Don't worry. I'll use local anesthesia. You'll just feel pressure, no pain."),
            ("M", "That's reassuring. How often should I come for a check-up?"),
            ("F", "Every six months for cleaning and examination. Take care of your teeth daily."),
        ]
    },
    {
        "id": 28,
        "title": "Public Transport",
        "slug": "public-transport",
        "vocab": ["bus", "subway", "ticket", "transfer", "schedule", "route", "platform", "conductor"],
        "dialogue": [
            ("F", "Excuse me, which bus goes to downtown? I need to buy a ticket."),
            ("M", "Bus number 15 or 22. You can buy tickets from the conductor on board."),
            ("F", "Great! What about the subway? Is there a transfer to the red line?"),
            ("M", "Yes, at Central Station. Check the schedule - trains run every ten minutes."),
            ("F", "Perfect! Which platform do I need for the airport route?"),
            ("M", "Platform B, but you might need to transfer once. It's clearly marked."),
            ("F", "Thank you so much! Is public transport reliable here?"),
            ("M", "Very reliable. Buses and subway usually run on time. Have a good trip!"),
        ]
    },
    {
        "id": 29,
        "title": "Ordering Online",
        "slug": "ordering-online",
        "vocab": ["website", "cart", "checkout", "payment", "shipping", "delivery", "order", "confirmation"],
        "dialogue": [
            ("M", "I'm trying to order something online, but the website is confusing."),
            ("F", "What do you need help with? Adding items to your cart?"),
            ("M", "Yes, and also the checkout process. How do I choose shipping options?"),
            ("F", "After you add items, click 'checkout'. You'll see delivery and payment choices."),
            ("M", "Perfect! What's the difference between standard and express delivery?"),
            ("F", "Express costs more but arrives in two days. Standard takes a week."),
            ("M", "I'll choose standard. Will I get a confirmation after my order?"),
            ("F", "Yes, by email. You can track your package using the confirmation number."),
        ]
    },
    {
        "id": 30,
        "title": "At the Embassy / Visa Interview",
        "slug": "visa-interview",
        "vocab": ["embassy", "visa", "interview", "documents", "purpose", "stay", "passport", "application"],
        "dialogue": [
            ("F", "Good morning. I'm here for my visa interview. I have all my documents."),
            ("M", "Welcome. Please show me your passport and application form."),
            ("F", "Here they are. I'm applying for a tourist visa for two weeks."),
            ("M", "What's the main purpose of your visit? Business or tourism?"),
            ("F", "Tourism. I want to visit museums and see historical sites."),
            ("M", "Do you have proof of your hotel reservations and return ticket?"),
            ("F", "Yes, everything is here. How long will I stay at the embassy today?"),
            ("M", "About thirty minutes. We'll process your application and contact you soon."),
        ]
    }
]

def generate_episode(episode_data):
    """Generate a complete episode with edge-tts."""
    ep_id = episode_data["id"]
    title = episode_data["title"]
    slug = episode_data["slug"]
    vocab = episode_data["vocab"]
    dialogue = episode_data["dialogue"]
    
    print(f"\n🎙️ Episode {ep_id}: {title}")
    
    # Clean up old episode directories
    old_ep_dir = BASE_DIR / f"episode{ep_id}"
    ep_dir = BASE_DIR / f"ep{ep_id}"
    
    if old_ep_dir.exists():
        shutil.rmtree(old_ep_dir)
    if ep_dir.exists():
        shutil.rmtree(ep_dir)
    
    ep_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate all audio clips
    clips = []
    
    # Intro
    intro_text = f"Welcome to FluentGe Podcast. Episode {ep_id}: {title}. Listen carefully. Let's begin."
    intro_file = ep_dir / "00_intro.mp3"
    if edge_tts_generate(intro_text, FEMALE_VOICE, intro_file):
        clips.append("00_intro.mp3")
    
    # Vocab intro
    vocab_intro = "Now let's learn eight new words. Listen and repeat."
    vocab_intro_file = ep_dir / "01_vocab_intro.mp3"
    if edge_tts_generate(vocab_intro, FEMALE_VOICE, vocab_intro_file):
        clips.append("01_vocab_intro.mp3")
    
    # Vocabulary (8 words)
    for i, word in enumerate(vocab[:8]):
        vocab_text = f"{word}. {word}."
        vocab_file = ep_dir / f"{i+2:02d}_v{i+1}.mp3"
        if edge_tts_generate(vocab_text, MALE_VOICE, vocab_file):
            clips.append(f"{i+2:02d}_v{i+1}.mp3")
    
    # Slow dialogue intro
    slow_intro = "Now listen to the dialogue. This is the slow version."
    slow_intro_file = ep_dir / "10_slow_intro.mp3"
    if edge_tts_generate(slow_intro, FEMALE_VOICE, slow_intro_file):
        clips.append("10_slow_intro.mp3")
    
    # Slow dialogue (8 lines)
    for i, (speaker_type, line) in enumerate(dialogue[:8]):
        voice = MALE_VOICE if speaker_type == "M" else FEMALE_VOICE
        slow_file = ep_dir / f"{i+11:02d}_s{i+1}.mp3"
        if edge_tts_generate(line, voice, slow_file):
            clips.append(f"{i+11:02d}_s{i+1}.mp3")
    
    # Normal dialogue intro
    normal_intro = "Now listen again at normal speed."
    normal_intro_file = ep_dir / "19_normal_intro.mp3"
    if edge_tts_generate(normal_intro, FEMALE_VOICE, normal_intro_file):
        clips.append("19_normal_intro.mp3")
    
    # Normal dialogue (8 lines)
    for i, (speaker_type, line) in enumerate(dialogue[:8]):
        voice = MALE_VOICE if speaker_type == "M" else FEMALE_VOICE
        normal_file = ep_dir / f"{i+20:02d}_n{i+1}.mp3"
        if edge_tts_generate(line, voice, normal_file):
            clips.append(f"{i+20:02d}_n{i+1}.mp3")
    
    # Outro
    outro_text = "Well done! You learned eight new words and practiced a real conversation. See you next time. This was FluentGe Podcast."
    outro_file = ep_dir / "28_outro.mp3"
    if edge_tts_generate(outro_text, FEMALE_VOICE, outro_file):
        clips.append("28_outro.mp3")
    
    # Create silence files
    silence1 = ep_dir / "silence1.mp3"
    silence2 = ep_dir / "silence2.mp3"
    create_silence(1, silence1)
    create_silence(2, silence2)
    
    # Create merge file with proper spacing
    merge_file = ep_dir / "merge.txt"
    merge_lines = []
    
    def add_file(filename):
        merge_lines.append(f"file '{filename}'")
    
    def add_silence(duration):
        silence_file = "silence1.mp3" if duration == 1 else "silence2.mp3"
        merge_lines.append(f"file '{silence_file}'")
    
    # Build the merge sequence with proper pacing
    add_file("00_intro.mp3"); add_silence(2)
    add_file("01_vocab_intro.mp3"); add_silence(1)
    
    # Vocabulary with 1s pauses
    for i in range(8):
        if f"{i+2:02d}_v{i+1}.mp3" in clips:
            add_file(f"{i+2:02d}_v{i+1}.mp3")
            add_silence(1)
    add_silence(2)  # Extra pause after vocab
    
    # Slow dialogue
    add_file("10_slow_intro.mp3"); add_silence(1)
    for i in range(8):
        if f"{i+11:02d}_s{i+1}.mp3" in clips:
            add_file(f"{i+11:02d}_s{i+1}.mp3")
            add_silence(1)
    add_silence(2)  # Extra pause before normal
    
    # Normal dialogue
    add_file("19_normal_intro.mp3"); add_silence(1)
    for i in range(8):
        if f"{i+20:02d}_n{i+1}.mp3" in clips:
            add_file(f"{i+20:02d}_n{i+1}.mp3")
            add_silence(1)
    add_silence(2)  # Pause before outro
    
    add_file("28_outro.mp3")
    
    merge_file.write_text("\n".join(merge_lines))
    
    # Concatenate all clips
    final_file = BASE_DIR / f"episode{ep_id}-{slug}.mp3"
    print(f"  [merge] Creating {final_file.name}")
    
    try:
        subprocess.run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", str(merge_file), "-c:a", "libmp3lame",
            "-b:a", "128k", str(final_file)
        ], capture_output=True, check=True, cwd=str(ep_dir), timeout=60)
        
        # Copy to output locations
        for output_dir in [OUTPUT_WEB, OUTPUT_DIST]:
            output_file = output_dir / f"episode{ep_id}-{slug}.mp3"
            subprocess.run(["cp", str(final_file), str(output_file)], check=True)
        
        print(f"  ✅ Complete: {final_file.name} ({final_file.stat().st_size // 1024}KB)")
        
        # Clean up working directory
        shutil.rmtree(ep_dir)
        return final_file
        
    except Exception as e:
        print(f"  ❌ Merge failed: {e}")
        return None

def main():
    print("🚀 REGENERATING ALL 30 EPISODES with edge-tts voices")
    print(f"Using voices: {MALE_VOICE} (M) + {FEMALE_VOICE} (F)")
    print("This will replace ALL existing audio files with new edge-tts versions\n")
    
    generated_files = []
    failed_episodes = []
    
    for episode in ALL_EPISODES:
        try:
            result = generate_episode(episode)
            if result:
                generated_files.append(result)
            else:
                failed_episodes.append(episode["id"])
        except Exception as e:
            print(f"❌ Error generating episode {episode['id']}: {e}")
            failed_episodes.append(episode["id"])
            continue
    
    print(f"\n🎉 REGENERATION COMPLETE!")
    print(f"✅ Successfully generated: {len(generated_files)} episodes")
    if failed_episodes:
        print(f"❌ Failed episodes: {failed_episodes}")
    
    print(f"\n📂 All 30 episodes now use consistent edge-tts voices:")
    print(f"   Male voice: {MALE_VOICE}")
    print(f"   Female voice: {FEMALE_VOICE}")
    print(f"   Output locations:")
    print(f"   - {OUTPUT_WEB}/")
    print(f"   - {OUTPUT_DIST}/")
    
    return generated_files

if __name__ == "__main__":
    main()