#!/usr/bin/env python3

import edge_tts
import asyncio
import os
import json
import glob
from pathlib import Path

# Configuration
voice = "en-US-AndrewMultilingualNeural"
audio_dir = "/Users/aiagent/.openclaw/workspace/english-app/website/public/audio/phrases"
phrase_dir = "/Users/aiagent/.openclaw/workspace/english-app/content/phrasebook"

async def generate_one(text, outpath):
    """Generate a single audio file with the specified voice"""
    try:
        communicate = edge_tts.Communicate(text, voice, rate="-10%")
        await communicate.save(outpath)
        return True
    except Exception as e:
        print(f"Error generating {outpath}: {e}")
        return False

async def main():
    """Main function to generate all audio files"""
    print("Loading phrases from JSON files...")
    
    # Load all phrases from all JSON files
    files = sorted(glob.glob(os.path.join(phrase_dir, "*.json")))
    phrases = []
    
    for f in files:
        print(f"Loading {os.path.basename(f)}...")
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
            # The JSON structure is a list of phrase objects
            for p in data:
                if "id" in p and "english" in p:
                    audio_path = os.path.join(audio_dir, f"{p['id']}.mp3")
                    phrases.append((p["english"], audio_path))
    
    print(f"Found {len(phrases)} phrases to generate")
    
    # Create audio directory if it doesn't exist
    os.makedirs(audio_dir, exist_ok=True)
    
    # Generate all audio files with concurrency control
    sem = asyncio.Semaphore(10)  # Limit to 10 concurrent tasks
    
    async def gen(text, path):
        async with sem:
            return await generate_one(text, path)
    
    print("Starting audio generation...")
    tasks = [gen(text, path) for text, path in phrases]
    results = await asyncio.gather(*tasks)
    
    # Count successes
    successful = sum(results)
    print(f"Generated {successful}/{len(phrases)} audio files successfully")
    
    return successful == len(phrases)

if __name__ == "__main__":
    print("=== FluentGe Phrasebook Audio Regeneration ===")
    print(f"Voice: {voice}")
    print(f"Audio Directory: {audio_dir}")
    print(f"Phrase Directory: {phrase_dir}")
    print()
    
    success = asyncio.run(main())
    
    if success:
        print("\n✅ All audio files generated successfully!")
    else:
        print("\n❌ Some audio files failed to generate. Check the errors above.")