#!/usr/bin/env python3
import json, os, glob, asyncio
import edge_tts

PHRASEBOOK_DIR = "/Users/aiagent/.openclaw/workspace/english-app/content/phrasebook"
OUTPUT_DIR = "/Users/aiagent/.openclaw/workspace/english-app/website/public/audio/phrases"
VOICE = "en-US-AndrewNeural"
CONCURRENCY = 20

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Collect all phrases
phrases = []
for f in sorted(glob.glob(os.path.join(PHRASEBOOK_DIR, "*.json"))):
    with open(f) as fh:
        data = json.load(fh)
        if isinstance(data, list):
            phrases.extend(data)
        elif isinstance(data, dict) and "phrases" in data:
            phrases.extend(data["phrases"])

print(f"Total phrases: {len(phrases)}", flush=True)

# Filter already done
todo = []
for p in phrases:
    out = os.path.join(OUTPUT_DIR, f"{p['id']}.mp3")
    if os.path.exists(out) and os.path.getsize(out) > 100:
        continue
    todo.append(p)

print(f"Already done: {len(phrases) - len(todo)}, remaining: {len(todo)}", flush=True)

errors = []
done = [0]

async def generate(p, sem):
    pid = p["id"]
    text = p["english"]
    out = os.path.join(OUTPUT_DIR, f"{pid}.mp3")
    async with sem:
        try:
            comm = edge_tts.Communicate(text, VOICE)
            await comm.save(out)
            done[0] += 1
            if done[0] % 100 == 0:
                print(f"Progress: {done[0]}/{len(todo)}", flush=True)
        except Exception as e:
            errors.append((pid, str(e)[:200]))

async def main():
    sem = asyncio.Semaphore(CONCURRENCY)
    tasks = [generate(p, sem) for p in todo]
    await asyncio.gather(*tasks)

asyncio.run(main())

files = glob.glob(os.path.join(OUTPUT_DIR, "*.mp3"))
print(f"\nDone: {done[0]}/{len(todo)}")
print(f"Errors: {len(errors)}")
for pid, msg in errors:
    print(f"  FAIL: {pid} - {msg}")
print(f"Total MP3 files: {len(files)}")
