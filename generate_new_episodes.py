#!/usr/bin/env python3
"""Generate episodes 22-30 for FluentGe Podcast using edge-tts."""
import os
import subprocess
import time
from pathlib import Path

BASE_DIR = Path("/Users/aiagent/.openclaw/workspace/english-app/podcast")
OUTPUT_WEB = Path("/Users/aiagent/.openclaw/workspace/english-app/website/public/podcast")
OUTPUT_DIST = Path("/Users/aiagent/.openclaw/workspace/english-app/website/dist/podcast")

# Create output directories
OUTPUT_WEB.mkdir(parents=True, exist_ok=True)
OUTPUT_DIST.mkdir(parents=True, exist_ok=True)

def edge_tts(text, voice, output_path, rate="+0%"):
    """Generate speech using edge-tts."""
    if output_path.exists() and output_path.stat().st_size > 1000:
        print(f"  [skip] {output_path.name}")
        return
    
    print(f"  [tts] {output_path.name} ({voice}): {text[:60]}...")
    cmd = [
        "python3", "-m", "edge_tts",
        "--text", text,
        "--voice", voice,
        "--rate", rate,
        "--write-media", str(output_path)
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    time.sleep(0.1)

def create_silence(duration, output_path):
    """Create a silence file with given duration in seconds."""
    if output_path.exists():
        return
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono",
        "-t", str(duration), "-q:a", "9", str(output_path)
    ], capture_output=True, check=True)

def generate_episode(episode_data):
    """Generate a complete episode."""
    ep_num = episode_data["id"]
    title = episode_data["title"]
    slug = episode_data["slug"]
    vocab = episode_data["vocab"]
    dialogue = episode_data["dialogue"]
    
    print(f"\n🎙️ Generating Episode {ep_num}: {title}")
    
    # Create episode directory
    ep_dir = BASE_DIR / f"ep{ep_num}"
    ep_dir.mkdir(parents=True, exist_ok=True)
    
    clips = []
    male_voice = "en-US-AndrewMultilingualNeural" 
    female_voice = "en-US-AvaMultilingualNeural"
    narrator_voice = female_voice  # Using female as narrator
    
    # 00 - Intro
    intro_text = f"Welcome to FluentGe Podcast. Episode {ep_num}: {title}. Listen carefully. Let's begin."
    intro_file = ep_dir / "00_intro.mp3"
    edge_tts(intro_text, narrator_voice, intro_file)
    clips.append(intro_file)
    
    # 01 - Vocab intro
    vocab_intro = "First, let's learn some key words. Listen and repeat."
    vocab_intro_file = ep_dir / "01_vocab_intro.mp3"
    edge_tts(vocab_intro, narrator_voice, vocab_intro_file)
    clips.append(vocab_intro_file)
    
    # 02-09 - Vocabulary (8 words)
    for i, word in enumerate(vocab[:8]):  # Ensure only 8 words
        vocab_text = f"{word}. ... {word}."
        vocab_file = ep_dir / f"{i+2:02d}_v{i+1}.mp3"
        edge_tts(vocab_text, male_voice, vocab_file, rate="-10%")  # Slightly slower for vocab
        clips.append(vocab_file)
    
    # 10 - Slow dialogue intro
    slow_intro = "Now listen to a conversation. First, slowly."
    slow_intro_file = ep_dir / "10_slow_intro.mp3"
    edge_tts(slow_intro, narrator_voice, slow_intro_file)
    clips.append(slow_intro_file)
    
    # 11-18 - Slow dialogue (8 lines)
    for i, (speaker_type, line) in enumerate(dialogue[:8]):  # Ensure only 8 lines
        voice = male_voice if speaker_type == "M" else female_voice
        slow_file = ep_dir / f"{i+11:02d}_s{i+1}.mp3"
        edge_tts(line, voice, slow_file, rate="-20%")  # Slower for learning
        clips.append(slow_file)
    
    # 19 - Normal dialogue intro
    normal_intro = "Now listen again at normal speed."
    normal_intro_file = ep_dir / "19_normal_intro.mp3"
    edge_tts(normal_intro, narrator_voice, normal_intro_file)
    clips.append(normal_intro_file)
    
    # 20-27 - Normal dialogue (8 lines)
    for i, (speaker_type, line) in enumerate(dialogue[:8]):
        voice = male_voice if speaker_type == "M" else female_voice
        normal_file = ep_dir / f"{i+20:02d}_n{i+1}.mp3"
        edge_tts(line, voice, normal_file)
        clips.append(normal_file)
    
    # 28 - Outro
    outro_text = "Well done! You learned eight new words and practiced a real conversation. See you next time. This was FluentGe Podcast."
    outro_file = ep_dir / "28_outro.mp3"
    edge_tts(outro_text, narrator_voice, outro_file)
    clips.append(outro_file)
    
    # Create silence files
    silence1 = ep_dir / "silence1.mp3"
    silence2 = ep_dir / "silence2.mp3"
    create_silence(1, silence1)
    create_silence(2, silence2)
    
    # Create merge file list
    merge_file = ep_dir / "merge.txt"
    merge_lines = []
    
    def add_file(filename):
        merge_lines.append(f"file '{filename}'")
    
    def add_silence(duration):
        silence_file = "silence1.mp3" if duration == 1 else "silence2.mp3"
        merge_lines.append(f"file '{silence_file}'")
    
    # Build merge sequence
    add_file("00_intro.mp3"); add_silence(2)
    add_file("01_vocab_intro.mp3"); add_silence(1)
    
    # Vocabulary with pauses
    for i in range(8):
        add_file(f"{i+2:02d}_v{i+1}.mp3")
        add_silence(1)
    add_silence(2)  # Extra pause after vocab
    
    # Slow dialogue
    add_file("10_slow_intro.mp3"); add_silence(1)
    for i in range(8):
        add_file(f"{i+11:02d}_s{i+1}.mp3")
        add_silence(1)
    add_silence(2)  # Extra pause before normal speed
    
    # Normal dialogue
    add_file("19_normal_intro.mp3"); add_silence(1)
    for i in range(8):
        add_file(f"{i+20:02d}_n{i+1}.mp3")
        add_silence(1)
    add_silence(2)  # Pause before outro
    
    add_file("28_outro.mp3")
    
    merge_file.write_text("\n".join(merge_lines))
    
    # Concatenate all clips
    final_file = BASE_DIR / f"episode{ep_num}-{slug}.mp3"
    print(f"  [concat] Creating {final_file.name}")
    
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", 
        "-i", str(merge_file), "-c:a", "libmp3lame", 
        "-b:a", "128k", str(final_file)
    ], capture_output=True, check=True)
    
    # Copy to both output locations
    for output_dir in [OUTPUT_WEB, OUTPUT_DIST]:
        output_file = output_dir / f"episode{ep_num}-{slug}.mp3"
        subprocess.run(["cp", str(final_file), str(output_file)], check=True)
    
    print(f"  ✅ Episode {ep_num} complete: {final_file.name}")
    return final_file

# Episode definitions with practical topics for Georgians
NEW_EPISODES = [
    {
        "id": 22,
        "title": "At the Pharmacy",
        "titleKa": "აფთიაქში", 
        "slug": "at-the-pharmacy",
        "icon": "💊",
        "vocab": ["prescription", "medicine", "tablets", "side effects", "instructions", "dosage", "pharmacist", "over-the-counter"],
        "vocabKa": ["რეცეპტი", "წამალი", "აბები", "გვერდითი მოვლენები", "ინსტრუქცია", "დოზა", "ფარმაცევტი", "უფასო გაცემა"],
        "descriptionKa": "იყიდე წამალი, იკითხე დოზის შესახებ და მიჰყევი ინსტრუქციას.",
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
        "titleKa": "პირველი სამუშაო დღე",
        "slug": "first-day-work",
        "icon": "👔",
        "vocab": ["orientation", "colleague", "supervisor", "responsibilities", "training", "workplace", "schedule", "tasks"],
        "vocabKa": ["ორიენტაცია", "კოლეგა", "ზედამხედველი", "პასუხისმგებლობები", "ტრენინგი", "სამუშაო ადგილი", "განრიგი", "ამოცანები"],
        "descriptionKa": "ისწავლე სამუშაო მოვალეობები, გაიცანი კოლეგები და მიიღე ინსტრუქციები.",
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
        "titleKa": "ფოსტაზე",
        "slug": "at-the-post-office",
        "icon": "📮",
        "vocab": ["package", "envelope", "postage", "delivery", "address", "stamp", "tracking", "express"],
        "vocabKa": ["ამანათი", "კონვერტი", "საფოსტო მოსაკრებელი", "მიწოდება", "მისამართი", "მარკა", "თვალთვალი", "სწრაფი"],
        "descriptionKa": "გაგზავნე ამანათი, იყიდე მარკები და იკითხე მიწოდების შესახებ.",
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
        "titleKa": "მანქანის დაქირავება",
        "slug": "car-rental",
        "icon": "🚗",
        "vocab": ["rental", "license", "insurance", "mileage", "fuel", "automatic", "manual", "deposit"],
        "vocabKa": ["დაქირავება", "მართვის მოწმობა", "დაზღვევა", "გარბენი", "საწვავი", "ავტომატი", "მექანიკური", "დეპოზიტი"],
        "descriptionKa": "იქირავე მანქანა, შეამოწმე დაზღვევა და ისწავლე პირობები.",
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
        "titleKa": "მეზობლებთან გაცნობა",
        "slug": "meeting-neighbors",
        "icon": "🏘️",
        "vocab": ["neighbor", "introduce", "community", "friendly", "apartment", "building", "welcome", "helpful"],
        "vocabKa": ["მეზობელი", "გაცნობა", "თემი", "მეგობრული", "ბინა", "შენობა", "კეთილი იყოს მობრძანება", "მსახური"],
        "descriptionKa": "გაიცანი ახალი მეზობლები, ისაუბრე საბინაო თემზე და დაამყარე ურთიერთობები.",
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
        "titleKa": "სტომატოლოგთან",
        "slug": "at-the-dentist",
        "icon": "🦷",
        "vocab": ["appointment", "toothache", "filling", "cleaning", "check-up", "X-ray", "cavity", "treatment"],
        "vocabKa": ["ვიზიტი", "კბილის ტკივილი", "პლომბა", "გაწმენდა", "შემოწმება", "რენტგენი", "ღრუ", "მკურნალობა"],
        "descriptionKa": "განიკურნე კბილები, გაიწმინდე და მიიღე რჩევები სტომატოლოგისგან.",
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
        "titleKa": "საზოგადოებრივი ტრანსპორტი",
        "slug": "public-transport",
        "icon": "🚌",
        "vocab": ["bus", "subway", "ticket", "transfer", "schedule", "route", "platform", "conductor"],
        "vocabKa": ["ავტობუსი", "მეტრო", "ბილეთი", "გადასვლა", "განრიგი", "მარშრუტი", "პლატფორმა", "კონდუქტორი"],
        "descriptionKa": "იყიდე ბილეთი, იპოვე სწორი მარშრუტი და გამოიყენე საზოგადოებრივი ტრანსპორტი.",
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
        "titleKa": "ონლაინ შეკვეთა",
        "slug": "ordering-online",
        "icon": "💻",
        "vocab": ["website", "cart", "checkout", "payment", "shipping", "delivery", "order", "confirmation"],
        "vocabKa": ["ვებსაიტი", "კალათა", "გადახდა", "გადასახდელი", "მიწოდება", "მიყვანა", "შეკვეთა", "დადასტურება"],
        "descriptionKa": "გააკეთე ონლაინ შეკვეთა, გადაიხადე და იპოვე მიწოდების ვარიანტები.",
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
        "titleKa": "საელჩოში / ვიზის გასაუბრება",
        "slug": "visa-interview",
        "icon": "🏛️",
        "vocab": ["embassy", "visa", "interview", "documents", "purpose", "stay", "passport", "application"],
        "vocabKa": ["საელჩო", "ვიზა", "გასაუბრება", "დოკუმენტები", "მიზანი", "ყოფნა", "პასპორტი", "განცხადება"],
        "descriptionKa": "ჩაბარე ვიზის განცხადება, გაიარე გასაუბრება და მიაწოდე საჭირო დოკუმენტები.",
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

def main():
    print("🚀 Starting generation of Episodes 22-30 with edge-tts")
    print("Using voices: AndrewMultilingualNeural (M) + AvaMultilingualNeural (F)")
    
    generated_files = []
    
    for episode in NEW_EPISODES:
        try:
            output_file = generate_episode(episode)
            generated_files.append(output_file)
        except Exception as e:
            print(f"❌ Error generating episode {episode['id']}: {e}")
            continue
    
    print(f"\n✅ Generated {len(generated_files)} episodes successfully!")
    print("\n🎉 Part 2 complete: Generated 9 NEW podcast episodes (22-30) with better audio")
    
    return generated_files

if __name__ == "__main__":
    main()