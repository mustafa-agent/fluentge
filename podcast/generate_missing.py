#!/usr/bin/env python3
"""Generate missing episodes 8-13 for FluentGe Podcast."""
import os, subprocess, shutil
from pathlib import Path
from openai import OpenAI

from dotenv import load_dotenv
load_dotenv("/Users/aiagent/.openclaw/workspace/.env")
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

BASE = Path("/Users/aiagent/.openclaw/workspace/english-app/podcast")

EPISODES = [
    {
        "num": 8, "title": "Making Friends", "file": "episode8-making-friends.mp3",
        "vocab_sentences": [
            "Introduce. Let me introduce myself.",
            "Hobby. What's your hobby?",
            "Personality. We have a similar personality.",
            "Hang out. We should hang out sometime.",
            "Invite. Can I invite you to a coffee?",
            "Nickname. My friends call me Sari.",
            "Similar. We are very similar.",
            "Trust. It takes time to build trust.",
        ],
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
        "num": 9, "title": "Asking for Directions", "file": "episode9-directions.mp3",
        "vocab_sentences": [
            "Intersection. Turn at the intersection.",
            "Straight ahead. Go straight ahead for two blocks.",
            "Turn left. Turn left at the traffic light.",
            "Crosswalk. Use the crosswalk to cross.",
            "Block. Walk two blocks north.",
            "Corner. The shop is on the corner.",
            "Opposite. It's opposite the church.",
            "Landmark. The church is a famous landmark.",
        ],
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
        "num": 10, "title": "Phone Conversations", "file": "episode10-phone.mp3",
        "vocab_sentences": [
            "Voicemail. I left a voicemail for you.",
            "Dial. Dial the number and press call.",
            "Hang up. Don't hang up, I'll be right back.",
            "Signal. The signal is bad here.",
            "Text message. I'll send you a text message.",
            "Missed call. You have a missed call.",
            "Speaker. Put it on speaker please.",
            "Ringtone. I like your ringtone.",
        ],
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
        "num": 11, "title": "At the Bank", "file": "episode11-bank.mp3",
        "vocab_sentences": [
            "Account. I'd like to open an account.",
            "Deposit. I want to make a deposit.",
            "Withdrawal. I need to make a withdrawal.",
            "Transfer. Can I transfer money online?",
            "Balance. What's my current balance?",
            "Loan. I'm applying for a loan.",
            "Interest. The interest rate is low.",
            "Statement. I need a bank statement.",
        ],
        "dialogue": [
            ("onyx", "Good morning. I'd like to open a new bank account, please."),
            ("nova", "Of course. Would you like a savings account or a checking account?"),
            ("onyx", "A savings account. What's the interest rate?"),
            ("nova", "The interest rate is two point five percent per year."),
            ("onyx", "That sounds good. Can I make a deposit today?"),
            ("nova", "Yes. The minimum deposit is fifty dollars. You can also set up a transfer from another bank."),
            ("onyx", "Can I check my balance and get a statement online?"),
            ("nova", "Absolutely. You'll have full access to your balance, withdrawal history, and monthly statement through our app."),
        ],
    },
    {
        "num": 12, "title": "Renting an Apartment", "file": "episode12-apartment.mp3",
        "vocab_sentences": [
            "Lease. The lease is for twelve months.",
            "Tenant. The previous tenant was very clean.",
            "Landlord. The landlord lives upstairs.",
            "Deposit. The deposit is one month's rent.",
            "Utilities. Are utilities included?",
            "Furnished. The apartment is fully furnished.",
            "Spacious. The living room is very spacious.",
            "Neighborhood. It's a quiet neighborhood.",
        ],
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
        "num": 13, "title": "At the Gym", "file": "episode13-gym.mp3",
        "vocab_sentences": [
            "Treadmill. I ran on the treadmill for twenty minutes.",
            "Weights. He's lifting weights over there.",
            "Stretch. Always stretch before exercise.",
            "Membership. I need a gym membership.",
            "Trainer. My trainer pushed me hard today.",
            "Workout. That was a great workout!",
            "Warm up. Let's warm up first.",
            "Cool down. Don't forget to cool down after.",
        ],
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

def tts(text, voice, speed, outpath):
    if outpath.exists():
        print(f"  [skip] {outpath.name}", flush=True)
        return
    print(f"  [tts] {outpath.name} ({voice}): {text[:50]}...", flush=True)
    response = client.audio.speech.create(model="tts-1", voice=voice, input=text, speed=speed, response_format="mp3")
    outpath.parent.mkdir(parents=True, exist_ok=True)
    with open(str(outpath), "wb") as f:
        f.write(response.content)

def generate_episode(ep):
    num = ep["num"]
    title = ep["title"]
    fname = ep["file"]
    outfile = BASE / fname
    
    print(f"\n{'='*50}")
    print(f"Episode {num}: {title}")
    print(f"{'='*50}", flush=True)
    
    if outfile.exists():
        print(f"  [skip] Already exists", flush=True)
        return
    
    workdir = BASE / f"ep{num}_clips"
    workdir.mkdir(parents=True, exist_ok=True)
    
    tts(f"Welcome to FluentGe Podcast. Episode {num}: {title}. Listen carefully. Let's begin.", "nova", 1.0, workdir / "00_intro.mp3")
    tts("First, let's learn some key words.", "nova", 1.0, workdir / "01_vocab_intro.mp3")
    
    for i, sent in enumerate(ep["vocab_sentences"]):
        tts(sent, "onyx", 0.9, workdir / f"{i+2:02d}_v{i+1}.mp3")
    
    tts("Now listen to a conversation. First, slowly.", "nova", 1.0, workdir / "10_slow_intro.mp3")
    for i, (voice, line) in enumerate(ep["dialogue"]):
        tts(line, voice, 0.85, workdir / f"{i+11:02d}_s{i+1}.mp3")
    
    tts("Now listen again at normal speed.", "nova", 1.0, workdir / "19_normal_intro.mp3")
    for i, (voice, line) in enumerate(ep["dialogue"]):
        tts(line, voice, 1.0, workdir / f"{i+20:02d}_n{i+1}.mp3")
    
    tts("Well done! You learned eight new words and practiced a real conversation. See you next time. This was FluentGe Podcast.", "nova", 1.0, workdir / "28_outro.mp3")
    
    # Silence files
    for dur, name in [(1, "silence1.mp3"), (2, "silence2.mp3")]:
        sf = workdir / name
        if not sf.exists():
            subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(dur), "-q:a", "9", str(sf)], capture_output=True)
    
    # Merge
    lines = []
    def add(f): lines.append(f"file '{f}'")
    def s1(): add("silence1.mp3")
    def s2(): add("silence2.mp3")
    
    add("00_intro.mp3"); s2()
    add("01_vocab_intro.mp3"); s1()
    for i in range(8):
        add(f"{i+2:02d}_v{i+1}.mp3"); s1()
    s2()
    add("10_slow_intro.mp3"); s1()
    for i in range(8):
        add(f"{i+11:02d}_s{i+1}.mp3"); s1()
    s2()
    add("19_normal_intro.mp3"); s1()
    for i in range(8):
        add(f"{i+20:02d}_n{i+1}.mp3"); s1()
    s2()
    add("28_outro.mp3")
    
    merge = workdir / "merge.txt"
    merge.write_text("\n".join(lines))
    
    print(f"  [merge] → {fname}", flush=True)
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(merge), "-c:a", "libmp3lame", "-b:a", "128k", str(outfile)], capture_output=True)
    
    shutil.rmtree(workdir)
    print(f"  ✅ Done: {fname}", flush=True)

if __name__ == "__main__":
    # Clean up partial episode 8
    partial = BASE / "episode8"
    if partial.exists():
        shutil.rmtree(partial)
        print("Cleaned up partial episode8 dir")
    
    for ep in EPISODES:
        generate_episode(ep)
    print("\n🎉 Episodes 8-13 generated!")
