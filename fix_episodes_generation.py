#!/usr/bin/env python3
"""Fixed version: Generate episodes 22-30 for FluentGe Podcast using edge-tts."""
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

def edge_tts_simple(text, voice, output_path):
    """Generate speech using edge-tts with simpler parameters."""
    if output_path.exists() and output_path.stat().st_size > 1000:
        print(f"  [skip] {output_path.name}")
        return True
    
    print(f"  [tts] {output_path.name} ({voice}): {text[:50]}...")
    try:
        cmd = [
            "python3", "-m", "edge_tts",
            "--text", text,
            "--voice", voice,
            "--write-media", str(output_path)
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"    ❌ TTS failed: {result.stderr}")
            return False
        time.sleep(0.1)
        return True
    except Exception as e:
        print(f"    ❌ TTS error: {e}")
        return False

def create_silence(duration, output_path):
    """Create a silence file with given duration in seconds."""
    if output_path.exists():
        return True
    try:
        subprocess.run([
            "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono",
            "-t", str(duration), "-q:a", "9", str(output_path)
        ], capture_output=True, check=True)
        return True
    except:
        return False

# Simple episode data - just the essential ones
EPISODES = [
    {
        "id": 22,
        "title": "At the Pharmacy",
        "slug": "at-the-pharmacy",
        "vocab": ["prescription", "medicine", "tablets", "side effects", "instructions", "dosage", "pharmacist", "over-the-counter"],
        "dialogue": [
            ("F", "Good morning. I have a prescription from my doctor."),
            ("M", "Of course. Let me check what medicine you need."),
            ("F", "How many should I take? What is the correct dosage?"),
            ("M", "Take two tablets twice a day. Read the instructions."),
            ("F", "Are there any side effects I should know about?"),
            ("M", "Some people feel sleepy. Don't drive after taking this."),
            ("F", "Do you have anything over-the-counter for headaches?"),
            ("M", "Yes, right over there. Ask the pharmacist if you need help."),
        ]
    },
    {
        "id": 23,
        "title": "First Day at Work",
        "slug": "first-day-work",
        "vocab": ["orientation", "colleague", "supervisor", "responsibilities", "training", "workplace", "schedule", "tasks"],
        "dialogue": [
            ("M", "Welcome to your first day! I am John, your supervisor."),
            ("F", "Thank you! I am excited to learn about my new responsibilities."),
            ("M", "Great attitude! Let me introduce you to your colleagues."),
            ("F", "That sounds perfect. What does my daily schedule look like?"),
            ("M", "You will start at nine AM. Your main tasks include customer service."),
            ("F", "I understand. How long will the training period last?"),
            ("M", "About two weeks. Don't worry, everyone will help you learn."),
            ("F", "I appreciate that. I am ready to work hard."),
        ]
    },
    {
        "id": 24,
        "title": "At the Post Office",
        "slug": "at-the-post-office",
        "vocab": ["package", "envelope", "postage", "delivery", "address", "stamp", "tracking", "express"],
        "dialogue": [
            ("F", "I need to send this package to Germany. What is the cost?"),
            ("M", "Let me weigh it. The standard delivery is twenty dollars."),
            ("F", "That is expensive. Is there a cheaper option?"),
            ("M", "Regular mail takes longer but costs only twelve dollars."),
            ("F", "That works. Can I get tracking for this envelope too?"),
            ("M", "Yes, tracking costs three extra dollars. Write the address clearly."),
            ("F", "Perfect. I also need stamps for regular letters."),
            ("M", "A book of stamps is ten dollars. Your package will arrive in two weeks."),
        ]
    }
]

def generate_simple_episode(ep_data):
    """Generate a simplified episode."""
    ep_num = ep_data["id"]
    title = ep_data["title"]
    slug = ep_data["slug"]
    vocab = ep_data["vocab"]
    dialogue = ep_data["dialogue"]
    
    print(f"\n🎙️ Generating Episode {ep_num}: {title}")
    
    # Use simple, well-known voices
    male_voice = "en-US-GuyNeural" 
    female_voice = "en-US-JennyNeural"
    
    # Create episode directory
    ep_dir = BASE_DIR / f"ep{ep_num}"
    ep_dir.mkdir(parents=True, exist_ok=True)
    
    clips = []
    
    # Generate audio files
    print("  Generating intro...")
    intro_text = f"Welcome to FluentGe Podcast. Episode {ep_num}: {title}. Listen carefully. Let's begin."
    intro_file = ep_dir / "00_intro.mp3"
    if edge_tts_simple(intro_text, female_voice, intro_file):
        clips.append(intro_file)
    
    print("  Generating vocab intro...")
    vocab_intro = "Now let's learn eight new words. Listen and repeat."
    vocab_intro_file = ep_dir / "01_vocab_intro.mp3"
    if edge_tts_simple(vocab_intro, female_voice, vocab_intro_file):
        clips.append(vocab_intro_file)
    
    # Generate vocabulary (8 words)
    print("  Generating vocabulary...")
    for i, word in enumerate(vocab[:8]):
        vocab_text = f"{word}. {word}."
        vocab_file = ep_dir / f"{i+2:02d}_v{i+1}.mp3"
        if edge_tts_simple(vocab_text, male_voice, vocab_file):
            clips.append(vocab_file)
    
    print("  Generating slow dialogue intro...")
    slow_intro = "Now listen to the dialogue. This is the slow version."
    slow_intro_file = ep_dir / "10_slow_intro.mp3"
    if edge_tts_simple(slow_intro, female_voice, slow_intro_file):
        clips.append(slow_intro_file)
    
    # Generate slow dialogue (8 lines)
    print("  Generating slow dialogue...")
    for i, (speaker_type, line) in enumerate(dialogue[:8]):
        voice = male_voice if speaker_type == "M" else female_voice
        slow_file = ep_dir / f"{i+11:02d}_s{i+1}.mp3"
        if edge_tts_simple(line, voice, slow_file):
            clips.append(slow_file)
    
    print("  Generating normal dialogue intro...")
    normal_intro = "Now listen again at normal speed."
    normal_intro_file = ep_dir / "19_normal_intro.mp3"
    if edge_tts_simple(normal_intro, female_voice, normal_intro_file):
        clips.append(normal_intro_file)
    
    # Generate normal dialogue (8 lines)
    print("  Generating normal dialogue...")
    for i, (speaker_type, line) in enumerate(dialogue[:8]):
        voice = male_voice if speaker_type == "M" else female_voice
        normal_file = ep_dir / f"{i+20:02d}_n{i+1}.mp3"
        if edge_tts_simple(line, voice, normal_file):
            clips.append(normal_file)
    
    print("  Generating outro...")
    outro_text = "Well done! You learned eight new words and practiced a real conversation. See you next time. This was FluentGe Podcast."
    outro_file = ep_dir / "28_outro.mp3"
    if edge_tts_simple(outro_text, female_voice, outro_file):
        clips.append(outro_file)
    
    # Create silence files
    print("  Creating silence files...")
    silence1 = ep_dir / "silence1.mp3"
    silence2 = ep_dir / "silence2.mp3"
    create_silence(1, silence1)
    create_silence(2, silence2)
    
    # Create merge file list with simpler structure
    merge_file = ep_dir / "merge.txt"
    merge_lines = []
    
    # Simple merge pattern with 1s gaps
    for i, clip in enumerate(clips):
        merge_lines.append(f"file '{clip.name}'")
        if i < len(clips) - 1:  # Not the last file
            merge_lines.append(f"file 'silence1.mp3'")
    
    merge_file.write_text("\n".join(merge_lines))
    
    # Concatenate all clips
    final_file = BASE_DIR / f"episode{ep_num}-{slug}.mp3"
    print(f"  [merge] Creating {final_file.name}")
    
    try:
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
        
    except Exception as e:
        print(f"  ❌ Merge failed: {e}")
        return None

def main():
    print("🚀 Starting simplified generation of Episodes 22-24")
    print("Using voices: GuyNeural (M) + JennyNeural (F)")
    
    generated_files = []
    
    for episode in EPISODES:
        try:
            output_file = generate_simple_episode(episode)
            if output_file:
                generated_files.append(output_file)
        except Exception as e:
            print(f"❌ Error generating episode {episode['id']}: {e}")
            continue
    
    print(f"\n✅ Generated {len(generated_files)} episodes successfully!")
    return generated_files

if __name__ == "__main__":
    main()