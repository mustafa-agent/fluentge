#!/usr/bin/env python3
"""
Generate audio files for all phrasebook phrases using edge-tts.
Creates MP3 files in website/public/flashcards/phrasebook/audio/{en,ka}/
"""
import asyncio
import json
import os
import sys
import glob

sys.path.insert(0, os.path.expanduser('~/Library/Python/3.9/lib/python/site-packages'))
import edge_tts

PHRASEBOOK_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'phrasebook')
AUDIO_OUT = os.path.join(os.path.dirname(__file__), '..', 'website', 'public', 'flashcards', 'phrasebook', 'audio')

EN_VOICE = 'en-US-BrianNeural'  # Approachable, casual
KA_VOICE = 'ka-GE-GiorgiNeural'  # Georgian male

async def generate_audio(text: str, voice: str, output_path: str):
    """Generate a single audio file."""
    if os.path.exists(output_path):
        return  # Skip existing
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    communicate = edge_tts.Communicate(text, voice, rate='-10%')
    await communicate.save(output_path)

async def process_file(filepath: str):
    """Process all phrases in a JSON file."""
    with open(filepath, 'r') as f:
        phrases = json.load(f)
    
    tasks = []
    for phrase in phrases:
        pid = phrase['id']
        # English audio
        en_path = os.path.join(AUDIO_OUT, 'en', f'{pid}.mp3')
        tasks.append(generate_audio(phrase['english'], EN_VOICE, en_path))
        # Georgian audio
        ka_path = os.path.join(AUDIO_OUT, 'ka', f'{pid}.mp3')
        tasks.append(generate_audio(phrase['georgian'], KA_VOICE, ka_path))
    
    # Process in batches of 10
    for i in range(0, len(tasks), 10):
        batch = tasks[i:i+10]
        await asyncio.gather(*batch)
        print(f"  Generated {min(i+10, len(tasks))}/{len(tasks)} audio files")

async def main():
    files = sorted(glob.glob(os.path.join(PHRASEBOOK_DIR, '*.json')))
    print(f"Found {len(files)} phrasebook files")
    
    total_phrases = 0
    for filepath in files:
        filename = os.path.basename(filepath)
        with open(filepath) as f:
            phrases = json.load(f)
        total_phrases += len(phrases)
        print(f"\nProcessing {filename} ({len(phrases)} phrases)...")
        await process_file(filepath)
    
    print(f"\n✅ Done! Generated audio for {total_phrases} phrases")
    
    # Count actual files
    en_count = len(glob.glob(os.path.join(AUDIO_OUT, 'en', '*.mp3')))
    ka_count = len(glob.glob(os.path.join(AUDIO_OUT, 'ka', '*.mp3')))
    print(f"   English: {en_count} files")
    print(f"   Georgian: {ka_count} files")

if __name__ == '__main__':
    asyncio.run(main())
