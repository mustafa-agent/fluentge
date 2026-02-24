#!/usr/bin/env python3
"""Generate missing podcast episodes 27-30 using edge-tts"""
import asyncio, os, subprocess, tempfile

PODCAST_DIR = "/Users/aiagent/.openclaw/workspace/english-app/podcast"
OUTPUT_DIR = "/Users/aiagent/.openclaw/workspace/english-app/website/public/podcast"

EPISODES = {
    27: {
        "title": "At the Dentist",
        "file": "episode27-at-the-dentist.mp3",
        "vocab": [
            ("Appointment", "ვიზიტი"),
            ("Toothache", "კბილის ტკივილი"),
            ("Filling", "პლომბა"),
            ("Cleaning", "გაწმენდა"),
            ("Check-up", "შემოწმება"),
            ("X-ray", "რენტგენი"),
            ("Cavity", "ღრუ"),
            ("Treatment", "მკურნალობა"),
        ],
        "slow_dialog": [
            "I have a toothache. Can I see the dentist today?",
            "Let me check. We have an opening at 3 PM.",
            "That works. Is it just a check-up?",
            "The doctor will do an X-ray first.",
            "Will I need a filling?",
            "We'll know after the check-up.",
            "How long is the treatment?",
            "Usually about 30 minutes.",
        ],
        "normal_dialog": [
            "Hi, I'd like to book an appointment for a dental cleaning.",
            "Sure, we have availability tomorrow morning at 10.",
            "Perfect. I also have a small cavity that needs treatment.",
            "The dentist will examine it and recommend the best filling option.",
            "Will the X-ray show everything?",
            "Yes, it gives us a complete picture of your dental health.",
            "Great, I'll be there at 10 tomorrow.",
            "See you then! Don't forget to bring your insurance card.",
        ],
    },
    28: {
        "title": "Public Transport",
        "file": "episode28-public-transport.mp3",
        "vocab": [
            ("Bus", "ავტობუსი"),
            ("Subway", "მეტრო"),
            ("Ticket", "ბილეთი"),
            ("Transfer", "გადასვლა"),
            ("Schedule", "განრიგი"),
            ("Route", "მარშრუტი"),
            ("Platform", "პლატფორმა"),
            ("Conductor", "კონდუქტორი"),
        ],
        "slow_dialog": [
            "Excuse me, which bus goes to the city center?",
            "You need bus number 5. It stops here.",
            "Where can I buy a ticket?",
            "You can buy it from the conductor on the bus.",
            "Do I need to transfer?",
            "No, it's a direct route.",
            "What's the schedule?",
            "Buses come every 15 minutes.",
        ],
        "normal_dialog": [
            "Hi, I'm trying to get to the main train station. What's the best route?",
            "Take the subway from here to Central Station, then transfer to line 3.",
            "How much is a ticket?",
            "A single ride is 2 dollars, or you can get a day pass for 5.",
            "Which platform do I need?",
            "Platform 2, on the other side. The next train arrives in 3 minutes.",
            "Thanks! Is the schedule the same on weekends?",
            "Trains run less frequently on weekends, about every 20 minutes.",
        ],
    },
    29: {
        "title": "Ordering Online",
        "file": "episode29-ordering-online.mp3",
        "vocab": [
            ("Website", "ვებსაიტი"),
            ("Cart", "კალათა"),
            ("Checkout", "გადახდა"),
            ("Payment", "გადასახდელი"),
            ("Shipping", "მიწოდება"),
            ("Delivery", "მიყვანა"),
            ("Order", "შეკვეთა"),
            ("Confirmation", "დადასტურება"),
        ],
        "slow_dialog": [
            "I found a nice jacket on this website.",
            "Add it to your cart and check the size.",
            "How do I pay?",
            "Go to checkout and enter your payment information.",
            "Is shipping free?",
            "Free shipping on orders over 50 dollars.",
            "When will my order arrive?",
            "You'll get a confirmation email with the delivery date.",
        ],
        "normal_dialog": [
            "I want to order a birthday gift online. Any website recommendations?",
            "Try this one. They have great products and fast delivery.",
            "I added a few things to my cart. The total is 75 dollars.",
            "That's good, you'll get free shipping since it's over 50.",
            "What payment methods do they accept?",
            "Credit card, PayPal, and bank transfer. Checkout is really easy.",
            "Done! I just placed the order.",
            "Check your email for the confirmation. It should arrive in 3 to 5 days.",
        ],
    },
    30: {
        "title": "At the Embassy / Visa Interview",
        "file": "episode30-visa-interview.mp3",
        "vocab": [
            ("Embassy", "საელჩო"),
            ("Visa", "ვიზა"),
            ("Interview", "გასაუბრება"),
            ("Documents", "დოკუმენტები"),
            ("Purpose", "მიზანი"),
            ("Stay", "ყოფნა"),
            ("Passport", "პასპორტი"),
            ("Application", "განცხადება"),
        ],
        "slow_dialog": [
            "Good morning. I'm here for my visa interview.",
            "Please have a seat. Do you have all your documents?",
            "Yes, here is my passport and application.",
            "What is the purpose of your visit?",
            "I'm going to study at a university.",
            "How long will you stay?",
            "About two years.",
            "Thank you. We will review your application.",
        ],
        "normal_dialog": [
            "Hello, I have an appointment at the embassy for a visa interview.",
            "Welcome. Please show me your passport and supporting documents.",
            "Here you go. I've also brought my bank statements and university acceptance letter.",
            "Good. What is the purpose of your trip and how long do you plan to stay?",
            "I've been accepted to a master's program. I'll be there for two years.",
            "Do you have accommodation arranged?",
            "Yes, the university provides student housing. Here's the confirmation.",
            "Everything looks good. Your visa application has been approved. You'll receive your passport in 5 business days.",
        ],
    },
}

async def generate_clip(text, filename, voice="en-US-GuyNeural", rate="+0%"):
    communicate = __import__('edge_tts').Communicate(text, voice, rate=rate)
    await communicate.save(filename)

async def generate_episode(ep_num, ep_data):
    print(f"\n=== Generating Episode {ep_num}: {ep_data['title']} ===")
    tmpdir = tempfile.mkdtemp()
    clips = []
    
    # Silence files
    silence1 = os.path.join(tmpdir, "silence1.mp3")
    silence2 = os.path.join(tmpdir, "silence2.mp3")
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", "0.8", "-c:a", "libmp3lame", "-b:a", "32k", silence1], capture_output=True)
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", "1.5", "-c:a", "libmp3lame", "-b:a", "32k", silence2], capture_output=True)

    # Intro
    intro_file = os.path.join(tmpdir, "00_intro.mp3")
    await generate_clip(f"Welcome to FluentGe Podcast, episode {ep_num}: {ep_data['title']}. Let's learn some useful English words and phrases!", intro_file)
    clips.append(intro_file)
    clips.append(silence2)
    
    # Vocabulary intro
    vocab_intro = os.path.join(tmpdir, "01_vocab_intro.mp3")
    await generate_clip("First, let's learn the key vocabulary for this topic.", vocab_intro)
    clips.append(vocab_intro)
    clips.append(silence2)
    
    # Vocab words
    for i, (eng, ka) in enumerate(ep_data["vocab"]):
        f = os.path.join(tmpdir, f"v{i}.mp3")
        await generate_clip(f"{eng}. {eng}.", f)
        clips.append(f)
        clips.append(silence1)
    
    # Slow dialog intro
    slow_intro = os.path.join(tmpdir, "slow_intro.mp3")
    await generate_clip("Now, listen to a slow conversation.", slow_intro)
    clips.append(slow_intro)
    clips.append(silence2)
    
    # Slow dialog
    voices = ["en-US-GuyNeural", "en-US-JennyNeural"]
    for i, line in enumerate(ep_data["slow_dialog"]):
        f = os.path.join(tmpdir, f"s{i}.mp3")
        await generate_clip(line, f, voice=voices[i % 2], rate="-15%")
        clips.append(f)
        clips.append(silence1)
    
    # Normal dialog intro
    normal_intro = os.path.join(tmpdir, "normal_intro.mp3")
    await generate_clip("Now, the same conversation at normal speed.", normal_intro)
    clips.append(normal_intro)
    clips.append(silence2)
    
    # Normal dialog
    for i, line in enumerate(ep_data["normal_dialog"]):
        f = os.path.join(tmpdir, f"n{i}.mp3")
        await generate_clip(line, f, voice=voices[i % 2])
        clips.append(f)
        clips.append(silence1)
    
    # Outro
    outro = os.path.join(tmpdir, "outro.mp3")
    await generate_clip(f"That's all for episode {ep_num}! Practice these words and come back for more. See you next time on FluentGe Podcast!", outro)
    clips.append(outro)
    
    # Merge
    merge_file = os.path.join(tmpdir, "merge.txt")
    with open(merge_file, "w") as mf:
        for c in clips:
            mf.write(f"file '{c}'\n")
    
    output = os.path.join(OUTPUT_DIR, ep_data["file"])
    result = subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", merge_file,
         "-c:a", "libmp3lame", "-b:a", "64k", "-ar", "22050", "-ac", "1", output],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        size = os.path.getsize(output) / 1024
        print(f"  ✅ {ep_data['file']} ({size:.0f} KB)")
    else:
        print(f"  ❌ Failed: {result.stderr[-200:]}")

async def main():
    for ep_num, ep_data in EPISODES.items():
        await generate_episode(ep_num, ep_data)
    print("\n🎉 All episodes generated!")

asyncio.run(main())
