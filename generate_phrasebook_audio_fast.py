#!/usr/bin/env python3
"""Generate MP3 audio for phrasebook phrases using edge-tts (concurrent)."""
import json, os, asyncio, glob

PHRASEBOOK_DIR = "/Users/aiagent/.openclaw/workspace/english-app/content/phrasebook"
AUDIO_DIR = "/Users/aiagent/.openclaw/workspace/english-app/website/public/flashcards/phrasebook/audio/en"
VOICE = "en-US-GuyNeural"
CONCURRENCY = 10

async def generate_one(text, filepath, sem):
    import edge_tts
    async with sem:
        try:
            communicate = edge_tts.Communicate(text, VOICE, rate="-10%")
            await communicate.save(filepath)
            return True
        except Exception as e:
            print(f"  ERROR: {os.path.basename(filepath)}: {e}")
            return False

async def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    sem = asyncio.Semaphore(CONCURRENCY)
    
    files = sorted(glob.glob(os.path.join(PHRASEBOOK_DIR, "*.json")))
    tasks = []
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
            tasks.append(generate_one(phrase['english'], outpath, sem))
    
    print(f"Generating {len(tasks)} files ({skipped} already exist)...")
    results = await asyncio.gather(*tasks)
    success = sum(1 for r in results if r)
    print(f"Done! Generated {success}/{len(tasks)} files, {skipped} skipped.")

if __name__ == "__main__":
    asyncio.run(main())
