#!/usr/bin/env python3
"""Generate TTS audio for all flashcard words using edge-tts."""
import asyncio
import json
import glob
import os
import re
import sys

CONTENT_DIR = "flashcard-app/content"
OUTPUT_DIR = "website/public/audio/words"
VOICE_EN = "en-US-ChristopherNeural"
BATCH_SIZE = 50

os.makedirs(OUTPUT_DIR, exist_ok=True)

def sanitize(word):
    """Match the JS sanitizeForAudio function."""
    w = word.strip().lower()
    w = re.sub(r'[^a-z0-9]', '_', w)
    w = re.sub(r'_+', '_', w)
    w = w.strip('_')
    return w

def get_all_words():
    words = set()
    for f in sorted(glob.glob(os.path.join(CONTENT_DIR, "*.json"))):
        if os.path.basename(f).startswith("_"):
            continue
        data = json.load(open(f))
        word_list = data if isinstance(data, list) else data.get("words", [])
        for w in word_list:
            if isinstance(w, dict):
                eng = w.get("english", w.get("en", "")).strip()
                if eng:
                    words.add(eng)
    return sorted(words)

async def generate_one(word, semaphore):
    import edge_tts
    safe = sanitize(word)
    if not safe:
        return "skip"
    out_path = os.path.join(OUTPUT_DIR, f"{safe}_en.mp3")
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100:
        return "skip"
    
    async with semaphore:
        try:
            comm = edge_tts.Communicate(word, VOICE_EN)
            await comm.save(out_path)
            return "ok"
        except Exception as e:
            print(f"  ERROR: {word}: {e}", file=sys.stderr)
            return "fail"

async def main():
    words = get_all_words()
    print(f"Total unique words: {len(words)}")
    
    existing = set()
    for f in os.listdir(OUTPUT_DIR):
        if f.endswith("_en.mp3"):
            existing.add(f[:-7])  # remove _en.mp3
    
    to_gen = [w for w in words if sanitize(w) not in existing]
    print(f"Already generated: {len(words) - len(to_gen)}")
    print(f"Need to generate: {len(to_gen)}")
    
    if not to_gen:
        print("All done!")
        return
    
    sem = asyncio.Semaphore(BATCH_SIZE)
    done = ok = fail = 0
    total = len(to_gen)
    
    for i in range(0, total, 500):
        chunk = to_gen[i:i+500]
        results = await asyncio.gather(*[generate_one(w, sem) for w in chunk])
        for r in results:
            done += 1
            if r == "ok": ok += 1
            elif r == "fail": fail += 1
        print(f"Progress: {done}/{total} ({ok} ok, {fail} fail)", flush=True)
    
    print(f"\nDone! Generated {ok}, failed {fail}")

if __name__ == "__main__":
    asyncio.run(main())
