#!/usr/bin/env python3
import os, subprocess, time, sys
from pathlib import Path
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
BASE = Path("/Users/aiagent/.openclaw/workspace/english-app/podcast")

def tts(text, voice, speed, output_path):
    if output_path.exists() and output_path.stat().st_size > 100:
        return
    print(f"  {output_path.name} ({voice}, {speed})", flush=True)
    resp = client.audio.speech.create(model="tts-1-hd", voice=voice, input=text, speed=speed)
    resp.stream_to_file(str(output_path))
    time.sleep(0.3)

EPISODES = [
    {
        "num": 7, "slug": "episode7-airport", "title": "At the Airport",
        "vocab": ["boarding pass", "gate", "luggage", "customs", "departure", "arrival", "passport control", "turbulence"],
        "dialogue": [
            ("onyx", "Hello. I'd like to check in for my flight to London, please."),
            ("nova", "Sure. May I see your passport and boarding pass?"),
            ("onyx", "Here you go. I have one piece of luggage to check in."),
            ("nova", "Thank you. Your flight departs from gate twelve. Departure is at three fifteen."),
            ("onyx", "Do I need to go through passport control before the gate?"),
            ("nova", "Yes. Go through security first, then passport control. After that, follow the signs to gate twelve."),
            ("onyx", "Is there any turbulence expected on the flight?"),
            ("nova", "The pilot will inform you on board. Have a safe flight! Your arrival time in London is six thirty."),
        ],
    },
    {
        "num": 8, "slug": "episode8-making-friends", "title": "Making Friends",
        "vocab": ["introduce", "hobby", "personality", "hang out", "invite", "nickname", "similar", "trust"],
        "dialogue": [
            ("nova", "Hi! I'm Sarah. Let me introduce myself. I just moved here."),
            ("onyx", "Nice to meet you, Sarah. I'm David. Do you have a nickname?"),
            ("nova", "My friends call me Sari. What's your hobby?"),
            ("onyx", "I love hiking and reading. We have a similar personality, I think."),
            ("nova", "That's great! We should hang out sometime."),
            ("onyx", "Definitely. Can I invite you to a coffee this weekend?"),
            ("nova", "I'd love that. It takes time to build trust, but you seem really nice."),
            ("onyx", "Thanks! Let me give you my number so we can stay in touch."),
        ],
    },
    {
        "num": 9, "slug": "episode9-directions", "title": "Asking for Directions",
        "vocab": ["intersection", "straight ahead", "turn left", "crosswalk", "block", "corner", "opposite", "landmark"],
        "dialogue": [
            ("nova", "Excuse me. Can you tell me how to get to the city museum?"),
            ("onyx", "Sure. Go straight ahead for two blocks."),
            ("nova", "Okay. And then?"),
            ("onyx", "At the intersection, turn left. You'll see a crosswalk."),
            ("nova", "Is it on the corner?"),
            ("onyx", "No, it's opposite the big church. The church is a famous landmark. You can't miss it."),
            ("nova", "So, two blocks straight, turn left at the intersection, and it's opposite the church?"),
            ("onyx", "Exactly. It's about a five-minute walk from this corner."),
        ],
    },
    {
        "num": 10, "slug": "episode10-phone", "title": "Phone Conversations",
        "vocab": ["voicemail", "dial", "hang up", "signal", "text message", "missed call", "speaker", "ringtone"],
        "dialogue": [
            ("nova", "Hello, Doctor Brown's office. How can I help you?"),
            ("onyx", "Hi, I tried to dial earlier but got your voicemail. I had a missed call from this number."),
            ("nova", "Yes, we called to confirm your appointment. The signal was bad, so we couldn't reach you."),
            ("onyx", "Sorry about that. Can I make an appointment for next Tuesday?"),
            ("nova", "Of course. Ten o'clock works. We'll send you a text message to confirm."),
            ("onyx", "Perfect. Should I put you on speaker while I check my calendar?"),
            ("nova", "Take your time. Don't hang up."),
            ("onyx", "Tuesday at ten is fine. I'll set a ringtone reminder. Thank you!"),
        ],
    },
    {
        "num": 11, "slug": "episode11-bank", "title": "At the Bank",
        "vocab": ["account", "deposit", "withdrawal", "transfer", "balance", "loan", "interest", "statement"],
        "dialogue": [
            ("onyx", "Good morning. I'd like to open a new bank account, please."),
            ("nova", "Of course. Would you like a savings account or a checking account?"),
            ("onyx", "A savings account. What's the interest rate?"),
            ("nova", "The interest rate is two point five percent per year."),
            ("onyx", "That sounds good. Can I make a deposit today?"),
            ("nova", "Yes. The minimum deposit is fifty dollars. You can also set up a transfer from another bank."),
            ("onyx", "Can I check my balance and get a statement online?"),
            ("nova", "Absolutely. You'll have full access to your balance, withdrawal history, and monthly statement through our app. We also offer a loan service if you need it."),
        ],
    },
    {
        "num": 12, "slug": "episode12-apartment", "title": "Renting an Apartment",
        "vocab": ["lease", "tenant", "landlord", "deposit", "utilities", "furnished", "spacious", "neighborhood"],
        "dialogue": [
            ("nova", "Hi, I'm here to see the apartment. Are you the landlord?"),
            ("onyx", "Yes, welcome. Come in. As you can see, it's quite spacious."),
            ("nova", "It's lovely. Is it furnished?"),
            ("onyx", "Yes, fully furnished. The kitchen and bedroom have everything you need."),
            ("nova", "What about utilities? Are they included?"),
            ("onyx", "Water is included, but electricity and internet are paid by the tenant."),
            ("nova", "How much is the deposit, and how long is the lease?"),
            ("onyx", "The deposit is one month's rent, and the lease is for twelve months. It's a quiet neighborhood too."),
        ],
    },
    {
        "num": 13, "slug": "episode13-gym", "title": "At the Gym",
        "vocab": ["treadmill", "weights", "stretch", "membership", "trainer", "workout", "warm up", "cool down"],
        "dialogue": [
            ("onyx", "Hi, I'd like to sign up for a gym membership."),
            ("nova", "Welcome! We have monthly and yearly plans. Would you like a personal trainer?"),
            ("onyx", "Maybe later. What does a typical workout look like here?"),
            ("nova", "Most people warm up on the treadmill for ten minutes, then move to weights."),
            ("onyx", "That sounds good. Should I stretch before or after?"),
            ("nova", "Both! Stretch to warm up, and stretch again to cool down after your workout."),
            ("onyx", "Great. How much is the monthly membership?"),
            ("nova", "It's forty dollars a month. That includes access to all equipment and one free session with a trainer."),
        ],
    },
]

def generate_episode(ep):
    num, slug, title = ep["num"], ep["slug"], ep["title"]
    vocab, dialogue = ep["vocab"], ep["dialogue"]
    d = BASE / f"episode{num}"
    d.mkdir(exist_ok=True)
    
    print(f"\n=== EPISODE {num}: {title} ===", flush=True)
    
    tts(f"Welcome to FluentGe Podcast. Episode {num}: {title}. Listen carefully. Let's begin.", "onyx", 1.0, d/"00_intro.mp3")
    tts("First, let's learn some key words.", "onyx", 1.0, d/"01_vocab_intro.mp3")
    for i, w in enumerate(vocab):
        tts(f"{w}.", "onyx", 0.9, d/f"{i+2:02d}_v{i+1}.mp3")
    tts("Now listen to a conversation. First, slowly.", "onyx", 1.0, d/"10_slow_intro.mp3")
    for i, (v, line) in enumerate(dialogue):
        tts(line, v, 0.85, d/f"{i+11:02d}_s{i+1}.mp3")
    tts("Now listen again at normal speed.", "onyx", 1.0, d/"19_normal_intro.mp3")
    for i, (v, line) in enumerate(dialogue):
        tts(line, v, 1.0, d/f"{i+20:02d}_n{i+1}.mp3")
    tts("Well done! You learned eight new words and practiced a real conversation. See you next time. This was FluentGe Podcast.", "onyx", 1.0, d/"28_outro.mp3")
    
    # Silence files
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i","anullsrc=r=44100:cl=mono","-t","1","-q:a","9",str(d/"silence1.mp3")], capture_output=True)
    subprocess.run(["ffmpeg","-y","-f","lavfi","-i","anullsrc=r=44100:cl=mono","-t","2","-q:a","9",str(d/"silence2.mp3")], capture_output=True)
    
    # merge.txt
    parts = []
    def add(f): parts.append(f"file '{f}'")
    def s1(): add("silence1.mp3")
    def s2(): add("silence2.mp3")
    
    add("00_intro.mp3"); s2()
    add("01_vocab_intro.mp3"); s1()
    for i in range(8): add(f"{i+2:02d}_v{i+1}.mp3"); s1()
    s2()
    add("10_slow_intro.mp3"); s1()
    for i in range(8): add(f"{i+11:02d}_s{i+1}.mp3"); s1()
    s2()
    add("19_normal_intro.mp3"); s1()
    for i in range(8): add(f"{i+20:02d}_n{i+1}.mp3"); s1()
    s2()
    add("28_outro.mp3")
    
    (d/"merge.txt").write_text("\n".join(parts))
    
    out = BASE / f"{slug}.mp3"
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",str(d/"merge.txt"),"-c:a","libmp3lame","-b:a","128k",str(out)], capture_output=True, cwd=str(d))
    print(f"✅ {out.name} ({out.stat().st_size//1024}KB)", flush=True)

if __name__ == "__main__":
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 7
    for ep in EPISODES:
        if ep["num"] >= start:
            generate_episode(ep)
    print("\n🎉 Done!", flush=True)
