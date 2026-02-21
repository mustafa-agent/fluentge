#!/usr/bin/env python3
"""Generate MP3 audio for phrasebook phrases using edge-tts."""
import json, os, asyncio, glob

PHRASEBOOK_DIR = "/Users/aiagent/.openclaw/workspace/english-app/content/phrasebook"
AUDIO_DIR = "/Users/aiagent/.openclaw/workspace/english-app/website/public/flashcards/phrasebook/audio/en"
VOICE = "en-US-GuyNeural"  # Clear male voice

async def generate_audio(text, filepath):
    """Generate audio for a single phrase."""
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE, rate="-10%")  # Slightly slower for learners
    await communicate.save(filepath)

async def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    
    files = sorted(glob.glob(os.path.join(PHRASEBOOK_DIR, "*.json")))
    total = 0
    skipped = 0
    
    for f in files:
        with open(f) as fh:
            phrases = json.load(fh)
        
        for phrase in phrases:
            pid = phrase['id']
            outpath = os.path.join(AUDIO_DIR, f"{pid}.mp3")
            
            if os.path.exists(outpath) and os.path.getsize(outpath) > 100:
                skipped += 1
                continue
            
            try:
                await generate_audio(phrase['english'], outpath)
                total += 1
                if total % 10 == 0:
                    print(f"  Generated {total} files...")
            except Exception as e:
                print(f"  ERROR: {pid}: {e}")
    
    print(f"\nDone! Generated {total} new files, skipped {skipped} existing.")

if __name__ == "__main__":
    asyncio.run(main())
