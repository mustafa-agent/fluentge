#!/usr/bin/env python3
import json, os, glob, subprocess, sys
from concurrent.futures import ThreadPoolExecutor, as_completed

PHRASEBOOK_DIR = "/Users/aiagent/.openclaw/workspace/english-app/content/phrasebook"
OUTPUT_DIR = "/Users/aiagent/.openclaw/workspace/english-app/website/public/audio/phrases"
VOICE = "en-US-AndrewNeural"

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

print(f"Total phrases: {len(phrases)}")

def generate(p):
    pid = p["id"]
    text = p["english"]
    out = os.path.join(OUTPUT_DIR, f"{pid}.mp3")
    if os.path.exists(out) and os.path.getsize(out) > 100:
        return pid, True, "skipped"
    try:
        r = subprocess.run(
            [sys.executable, "-m", "edge_tts", "--voice", VOICE, "--text", text, "--write-media", out],
            capture_output=True, text=True, timeout=30
        )
        if r.returncode == 0 and os.path.exists(out) and os.path.getsize(out) > 100:
            return pid, True, ""
        return pid, False, r.stderr[:200]
    except Exception as e:
        return pid, False, str(e)[:200]

errors = []
done = 0
with ThreadPoolExecutor(max_workers=8) as ex:
    futs = {ex.submit(generate, p): p for p in phrases}
    for fut in as_completed(futs):
        pid, ok, msg = fut.result()
        done += 1
        if not ok:
            errors.append((pid, msg))
        if done % 50 == 0:
            print(f"Progress: {done}/{len(phrases)}")

print(f"\nDone: {done}/{len(phrases)}")
print(f"Errors: {len(errors)}")
for pid, msg in errors:
    print(f"  FAIL: {pid} - {msg}")

# Count actual files
files = glob.glob(os.path.join(OUTPUT_DIR, "*.mp3"))
print(f"Total MP3 files in output: {len(files)}")
