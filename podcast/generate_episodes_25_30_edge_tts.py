#!/usr/bin/env python3
"""Generate episodes 25-30 for FluentGe Podcast using edge-tts."""
import os, subprocess, asyncio
from pathlib import Path
import edge_tts

BASE = Path("/Users/aiagent/.openclaw/workspace/english-app/podcast")

# Voices: en-US-AndrewMultilingualNeural (male), en-US-AvaMultilingualNeural (female)
MALE_VOICE = "en-US-AndrewMultilingualNeural"
FEMALE_VOICE = "en-US-AvaMultilingualNeural"

EPISODES = [
    {
        "num": 25, "title": "Car Rental", "file": "episode25-car-rental.mp3",
        "vocab": ["Rental", "License", "Insurance", "Mileage", "Fuel", "Automatic", "Manual", "Deposit"],
        "dialogue": [
            ("F", "I'd like to rent a car for three days. Do you have automatic cars?"),
            ("M", "Yes, we do. I need to see your driver's license and credit card."),
            ("F", "Here they are. What's included in the rental price?"),
            ("M", "Basic insurance and unlimited mileage. Fuel is not included."),
            ("F", "What about a manual car? Is it cheaper than automatic?"),
            ("M", "Yes, manual is thirty dollars less per day. We need a deposit too."),
            ("F", "How much is the deposit? When do I return the car?"),
            ("M", "Two hundred dollar deposit. Return it with the same fuel level by noon."),
        ],
    },
    {
        "num": 26, "title": "Meeting Neighbors", "file": "episode26-meeting-neighbors.mp3",
        "vocab": ["Neighbor", "Introduce", "Community", "Friendly", "Apartment", "Building", "Welcome", "Helpful"],
        "dialogue": [
            ("F", "Hello! I just moved into apartment 3B. I'm Lisa, your new neighbor."),
            ("M", "Welcome to the building! I'm Tom from 3A. The community here is very friendly."),
            ("F", "That's wonderful to hear. Is there anything I should know about living here?"),
            ("M", "The neighbors are all helpful. We have a WhatsApp group for the building."),
            ("F", "That sounds great! I'd love to join and introduce myself to everyone."),
            ("M", "Perfect! Most people here have been neighbors for years. You'll love it."),
            ("F", "Thank you for being so welcoming. It's nice to meet friendly people."),
            ("M", "Anytime! If you need anything, just knock on my door. Welcome again!"),
        ],
    },
    {
        "num": 27, "title": "At the Dentist", "file": "episode27-dentist.mp3",
        "vocab": ["Appointment", "Toothache", "Filling", "Cleaning", "Check-up", "X-ray", "Cavity", "Treatment"],
        "dialogue": [
            ("F", "Good morning. I have a terrible toothache. Can you help me?"),
            ("M", "Of course. Let me examine your teeth. When did the pain start?"),
            ("F", "Three days ago. It hurts when I eat or drink something cold."),
            ("M", "I see a cavity here. You'll need a filling and maybe an X-ray."),
            ("F", "Will the treatment hurt? I'm a bit nervous about dental work."),
            ("M", "Don't worry. I'll use local anesthesia. You'll just feel pressure, no pain."),
            ("F", "That's reassuring. How often should I come for a check-up?"),
            ("M", "Every six months for cleaning and examination. Take care of your teeth daily."),
        ],
    },
    {
        "num": 28, "title": "Public Transport", "file": "episode28-public-transport.mp3",
        "vocab": ["Bus", "Subway", "Ticket", "Transfer", "Schedule", "Route", "Platform", "Conductor"],
        "dialogue": [
            ("F", "Excuse me, which bus goes to downtown? I need to buy a ticket."),
            ("M", "Bus number 15 or 22. You can buy tickets from the conductor on board."),
            ("F", "Great! What about the subway? Is there a transfer to the red line?"),
            ("M", "Yes, at Central Station. Check the schedule - trains run every ten minutes."),
            ("F", "Perfect! Which platform do I need for the airport route?"),
            ("M", "Platform B, but you might need to transfer once. It's clearly marked."),
            ("F", "Thank you so much! Is public transport reliable here?"),
            ("M", "Very reliable. Buses and subway usually run on time. Have a good trip!"),
        ],
    },
    {
        "num": 29, "title": "Ordering Online", "file": "episode29-ordering-online.mp3",
        "vocab": ["Website", "Cart", "Checkout", "Payment", "Shipping", "Delivery", "Order", "Confirmation"],
        "dialogue": [
            ("F", "I'm trying to order something online, but the website is confusing."),
            ("M", "What do you need help with? Adding items to your cart?"),
            ("F", "Yes, and also the checkout process. How do I choose shipping options?"),
            ("M", "After you add items, click 'checkout'. You'll see delivery and payment choices."),
            ("F", "Perfect! What's the difference between standard and express delivery?"),
            ("M", "Express costs more but arrives in two days. Standard takes a week."),
            ("F", "I'll choose standard. Will I get a confirmation after my order?"),
            ("M", "Yes, by email. You can track your package using the confirmation number."),
        ],
    },
    {
        "num": 30, "title": "At the Embassy", "file": "episode30-embassy.mp3",
        "vocab": ["Embassy", "Visa", "Interview", "Documents", "Purpose", "Stay", "Passport", "Application"],
        "dialogue": [
            ("F", "Good morning. I'm here for my visa interview. I have all my documents."),
            ("M", "Welcome. Please show me your passport and application form."),
            ("F", "Here they are. I'm applying for a tourist visa for two weeks."),
            ("M", "What's the main purpose of your visit? Business or tourism?"),
            ("F", "Tourism. I want to visit museums and see historical sites."),
            ("M", "Do you have proof of your hotel reservations and return ticket?"),
            ("F", "Yes, everything is here. How long will I stay at the embassy today?"),
            ("M", "About thirty minutes. We'll process your application and contact you soon."),
        ],
    },
]

async def generate_tts(text, voice, rate, outpath):
    """Generate TTS using edge-tts"""
    if outpath.exists():
        print(f"    [skip] {outpath.name}")
        return
    
    print(f"    [tts] {outpath.name}: {text[:50]}...")
    outpath.parent.mkdir(parents=True, exist_ok=True)
    
    # Rate: +0% (normal), -15% (slow)
    rate_str = f"{rate:+d}%"
    communicate = edge_tts.Communicate(text, voice, rate=rate_str)
    await communicate.save(str(outpath))

async def generate_episode(ep):
    num = ep["num"]
    title = ep["title"]
    fname = ep["file"]
    outfile = BASE / fname
    
    print(f"\n==== Episode {num}: {title} ====")
    
    if outfile.exists():
        print(f"  ✅ Already exists: {fname}")
        return
    
    workdir = BASE / f"ep{num}_clips"
    workdir.mkdir(parents=True, exist_ok=True)
    
    print("  📝 Generating intro and vocab...")
    # 00 intro
    await generate_tts(f"Welcome to FluentGe Podcast. Episode {num}: {title}. Listen carefully. Let's begin.", 
                       FEMALE_VOICE, 0, workdir / "00_intro.mp3")
    
    # 01 vocab intro
    await generate_tts("Now, let's learn eight new words. Listen and repeat.", 
                       FEMALE_VOICE, 0, workdir / "01_vocab_intro.mp3")
    
    # 02-09 vocab words (slow with pause)
    for i, word in enumerate(ep["vocab"]):
        await generate_tts(f"{word}. ... {word}.", 
                           MALE_VOICE, -15, workdir / f"{i+2:02d}_v{i+1}.mp3")
    
    print("  🗣️  Generating slow dialogue...")
    # 10 slow intro
    await generate_tts("Now listen to the dialogue. This is the slow version.", 
                       FEMALE_VOICE, 0, workdir / "10_slow_intro.mp3")
    
    # 11-18 slow dialogue
    for i, (speaker, line) in enumerate(ep["dialogue"]):
        voice = MALE_VOICE if speaker == "M" else FEMALE_VOICE
        await generate_tts(line, voice, -15, workdir / f"{i+11:02d}_s{i+1}.mp3")
    
    print("  🎯 Generating normal dialogue...")
    # 19 normal intro
    await generate_tts("Now listen again at normal speed.", 
                       FEMALE_VOICE, 0, workdir / "19_normal_intro.mp3")
    
    # 20-27 normal dialogue
    for i, (speaker, line) in enumerate(ep["dialogue"]):
        voice = MALE_VOICE if speaker == "M" else FEMALE_VOICE
        await generate_tts(line, voice, 0, workdir / f"{i+20:02d}_n{i+1}.mp3")
    
    # 28 outro
    await generate_tts("Well done! You learned eight new words and practiced a real conversation. See you next time. This was FluentGe Podcast.", 
                       FEMALE_VOICE, 0, workdir / "28_outro.mp3")
    
    print("  🔧 Creating silence files...")
    # Create silence files
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", 
                   "-t", "1", "-q:a", "9", str(workdir / "silence1.mp3")], capture_output=True)
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", 
                   "-t", "2", "-q:a", "9", str(workdir / "silence2.mp3")], capture_output=True)
    
    print("  🎵 Merging audio files...")
    # Build merge.txt
    merge = workdir / "merge.txt"
    lines = []
    for j, clip_name in enumerate([
        "00_intro.mp3", 
        "01_vocab_intro.mp3", 
        *[f"{i+2:02d}_v{i+1}.mp3" for i in range(8)],
        "10_slow_intro.mp3", 
        *[f"{i+11:02d}_s{i+1}.mp3" for i in range(8)],
        "19_normal_intro.mp3", 
        *[f"{i+20:02d}_n{i+1}.mp3" for i in range(8)],
        "28_outro.mp3"
    ]):
        lines.append(f"file '{clip_name}'")
        # Add silences: 2s after intro/section intros, 1s between others, 2s before outro
        if clip_name == "28_outro.mp3":
            pass  # no silence after outro
        elif clip_name in ["00_intro.mp3", "01_vocab_intro.mp3", "10_slow_intro.mp3", "19_normal_intro.mp3"] or clip_name == "27_n8.mp3":
            lines.append(f"file 'silence2.mp3'")
        else:
            lines.append(f"file 'silence1.mp3'")
    
    merge.write_text("\n".join(lines))
    
    # Concat
    result = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(merge), 
                           "-c:a", "libmp3lame", "-b:a", "128k", str(outfile)], 
                          capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ❌ ERROR: ffmpeg failed: {result.stderr}")
        return
    
    print(f"  ✅ Generated: {fname}")

async def main():
    """Generate episodes 25-30"""
    print("🎧 Generating episodes 25-30 with edge-tts...")
    
    for ep in EPISODES:
        await generate_episode(ep)
    
    print(f"\n🎉 Episodes 25-30 generated with edge-tts!")
    print(f"Files saved to: {BASE}")

if __name__ == "__main__":
    asyncio.run(main())