#!/usr/bin/env python3
import os, subprocess, time
from pathlib import Path
from openai import OpenAI

# Load API key
from dotenv import load_dotenv
load_dotenv("/Users/aiagent/.openclaw/workspace/.env")
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

BASE = Path("/Users/aiagent/.openclaw/workspace/english-app/podcast")

def tts(text, voice, speed, outpath):
    print(f"  TTS: {outpath.name} [{voice} {speed}x] {text[:60]}...")
    resp = client.audio.speech.create(model="tts-1-hd", voice=voice, speed=speed, input=text)
    resp.stream_to_file(str(outpath))

def generate_episode(ep_num, title, slug, intro_text, vocab_words, dialogue_lines, outro_text):
    ep_dir = BASE / f"ep{ep_num}"
    ep_dir.mkdir(parents=True, exist_ok=True)
    
    clips = []
    
    # 00 intro
    f = ep_dir / "00_intro.mp3"
    tts(intro_text, "nova", 1.0, f)
    clips.append(f)
    
    # 01 vocab intro
    f = ep_dir / "01_vocab_intro.mp3"
    tts("Now, let's learn eight new words. Listen and repeat.", "nova", 1.0, f)
    clips.append(f)
    
    # 02-09 vocab words
    for i, word in enumerate(vocab_words):
        f = ep_dir / f"{i+2:02d}_v{i+1}.mp3"
        tts(f"{word}. ... {word}.", "onyx", 0.9, f)
        clips.append(f)
    
    # 10 slow intro
    f = ep_dir / "10_slow_intro.mp3"
    tts("Now listen to the dialogue. This is the slow version.", "nova", 1.0, f)
    clips.append(f)
    
    # 11-18 slow dialogue
    for i, (speaker, line) in enumerate(dialogue_lines):
        voice = "onyx" if speaker == "M" else "nova"
        f = ep_dir / f"{i+11:02d}_s{i+1}.mp3"
        tts(line, voice, 0.85, f)
        clips.append(f)
    
    # 19 normal intro
    f = ep_dir / "19_normal_intro.mp3"
    tts("Now listen again at normal speed.", "nova", 1.0, f)
    clips.append(f)
    
    # 20-27 normal dialogue
    for i, (speaker, line) in enumerate(dialogue_lines):
        voice = "onyx" if speaker == "M" else "nova"
        f = ep_dir / f"{i+20:02d}_n{i+1}.mp3"
        tts(line, voice, 1.0, f)
        clips.append(f)
    
    # 28 outro
    f = ep_dir / "28_outro.mp3"
    tts(outro_text, "nova", 1.0, f)
    clips.append(f)
    
    # Create silence files
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "1", "-q:a", "9", str(ep_dir / "silence1.mp3")], capture_output=True)
    subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "2", "-q:a", "9", str(ep_dir / "silence2.mp3")], capture_output=True)
    
    # Build merge.txt
    merge = ep_dir / "merge.txt"
    lines = []
    for j, clip in enumerate(clips):
        lines.append(f"file '{clip}'")
        # 2s silence after intro, vocab_intro, slow_intro, normal_intro; 1s between others; 2s before outro
        if j == len(clips) - 1:
            pass  # no silence after outro
        elif clip.name in ["00_intro.mp3", "01_vocab_intro.mp3", "10_slow_intro.mp3", "19_normal_intro.mp3"]:
            lines.append(f"file '{ep_dir}/silence2.mp3'")
        elif clip.name == "27_n8.mp3":
            lines.append(f"file '{ep_dir}/silence2.mp3'")
        else:
            lines.append(f"file '{ep_dir}/silence1.mp3'")
    merge.write_text("\n".join(lines))
    
    # Concat
    out = BASE / f"episode{ep_num}-{slug}.mp3"
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(merge), "-c:a", "libmp3lame", "-b:a", "128k", str(out)], capture_output=True)
    print(f"✅ {out}")

outro = "Well done! You learned eight new words and practiced a real conversation. See you next time. This was FluentGe Podcast."

# Episode 20
generate_episode(20, "Birthday Party", "birthday",
    "Welcome to FluentGe Podcast. Episode 20: Birthday Party. Listen carefully. Let's begin.",
    ["celebrate", "surprise", "candle", "wish", "gift", "decoration", "invitation", "toast"],
    [
        ("F", "Hey! Are you coming to Sarah's birthday party tonight?"),
        ("M", "Of course! I bought a gift for her. It's a surprise."),
        ("F", "That's great! I sent the invitation last week. Did you get it?"),
        ("M", "Yes, I did. I also helped with the decorations at her house."),
        ("F", "Wonderful! We need to light the candles on the cake."),
        ("M", "And then she can make a wish before blowing them out."),
        ("F", "Let's celebrate together. It's going to be a fun night."),
        ("M", "Absolutely! I'll make a toast to her when we're all together."),
    ],
    outro
)

# Episode 21
generate_episode(21, "Travel Stories", "travel",
    "Welcome to FluentGe Podcast. Episode 21: Travel Stories. Listen carefully. Let's begin.",
    ["adventure", "souvenir", "backpack", "culture", "tourist", "guide", "itinerary", "memorable"],
    [
        ("M", "I just came back from an amazing adventure in Japan."),
        ("F", "That sounds exciting! Did you buy any souvenirs?"),
        ("M", "Yes, I filled my backpack with gifts for everyone."),
        ("F", "What did you enjoy most about the culture there?"),
        ("M", "The food and the temples. Our guide was really helpful."),
        ("F", "Did you follow a strict itinerary or just explore freely?"),
        ("M", "A bit of both. Some days I was a tourist, other days I wandered."),
        ("F", "It sounds like a truly memorable trip. I'd love to go someday."),
    ],
    outro
)

print("\n🎉 Both episodes generated!")
