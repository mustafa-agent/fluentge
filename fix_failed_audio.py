#!/usr/bin/env python3

import edge_tts
import asyncio
import os
import json
import glob

# Configuration
voice = "en-US-AndrewMultilingualNeural"
audio_dir = "/Users/aiagent/.openclaw/workspace/english-app/website/public/audio/phrases"
phrase_dir = "/Users/aiagent/.openclaw/workspace/english-app/content/phrasebook"

# Failed files that need to be regenerated
failed_files = [
    "slang-002.mp3",
    "slang-006.mp3", 
    "slang-007.mp3",
    "slang-008.mp3",
    "slang-010.mp3"
]

async def generate_one(text, outpath, retries=3):
    """Generate a single audio file with retries"""
    for attempt in range(retries):
        try:
            communicate = edge_tts.Communicate(text, voice, rate="-10%")
            await communicate.save(outpath)
            return True
        except Exception as e:
            print(f"Attempt {attempt+1} failed for {outpath}: {e}")
            if attempt < retries - 1:
                await asyncio.sleep(2)  # Wait before retry
    return False

async def main():
    """Main function to regenerate failed audio files"""
    print("Loading phrases from JSON files...")
    
    # Load all phrases from all JSON files
    files = sorted(glob.glob(os.path.join(phrase_dir, "*.json")))
    phrases = {}
    
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
            for p in data:
                if "id" in p and "english" in p:
                    phrases[f"{p['id']}.mp3"] = p["english"]
    
    print(f"Regenerating {len(failed_files)} failed audio files...")
    
    successful = 0
    for filename in failed_files:
        if filename in phrases:
            text = phrases[filename]
            audio_path = os.path.join(audio_dir, filename)
            print(f"Regenerating {filename}: {text}")
            
            success = await generate_one(text, audio_path)
            if success:
                successful += 1
                print(f"✅ Successfully generated {filename}")
            else:
                print(f"❌ Failed to generate {filename}")
        else:
            print(f"❌ Could not find phrase for {filename}")
    
    print(f"\nRegenerative {successful}/{len(failed_files)} failed files successfully")
    return successful == len(failed_files)

if __name__ == "__main__":
    print("=== Fixing Failed FluentGe Audio Files ===")
    success = asyncio.run(main())
    
    if success:
        print("\n✅ All failed audio files fixed successfully!")
    else:
        print("\n❌ Some files still failed to generate.")