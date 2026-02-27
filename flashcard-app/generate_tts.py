#!/usr/bin/env python3
"""Batch TTS generation for FluentGe flashcard words using edge-tts."""

import asyncio
import json
import glob
import os
import re
import time
from pathlib import Path

CONTENT_DIR = "/Users/aiagent/.openclaw/workspace/english-app/flashcard-app/content"
OUTPUT_DIR = "/Users/aiagent/.openclaw/workspace/english-app/flashcard-app/public/audio/words"
EN_VOICE = "en-US-BrianMultilingualNeural"
KA_VOICE = "ka-GE-GiorgiNeural"
CONCURRENCY = 20  # parallel tasks

def sanitize(word):
    s = word.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s

def first_meaning(georgian_text):
    return georgian_text.split(';')[0].strip()

async def generate_one(voice, text, outpath, semaphore, failures):
    if os.path.exists(outpath):
        return False  # skipped
    async with semaphore:
        proc = await asyncio.create_subprocess_exec(
            'python3', '-m', 'edge_tts',
            '--voice', voice, '--text', text, '--write-media', outpath,
            stdout=asyncio.subprocess.DEVNULL, stderr=asyncio.subprocess.PIPE
        )
        _, stderr = await proc.communicate()
        if proc.returncode != 0:
            failures.append((outpath, stderr.decode().strip()))
            return False
        return True

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Collect all words
    json_files = sorted(glob.glob(os.path.join(CONTENT_DIR, "*.json")))
    print(f"Found {len(json_files)} JSON files")
    
    words = []
    seen = set()
    for jf in json_files:
        with open(jf, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for item in data:
            en = item.get('english', '').strip()
            ka = item.get('georgian', '').strip()
            if not en:
                continue
            key = sanitize(en)
            if key and key not in seen:
                seen.add(key)
                words.append((en, ka, key))
    
    print(f"Unique words: {len(words)}")
    
    semaphore = asyncio.Semaphore(CONCURRENCY)
    failures = []
    tasks = []
    
    for en, ka, key in words:
        en_path = os.path.join(OUTPUT_DIR, f"{key}_en.mp3")
        ka_path = os.path.join(OUTPUT_DIR, f"{key}_ka.mp3")
        tasks.append(generate_one(EN_VOICE, en, en_path, semaphore, failures))
        if ka:
            ka_text = first_meaning(ka)
            tasks.append(generate_one(KA_VOICE, ka_text, ka_path, semaphore, failures))
    
    print(f"Total tasks: {len(tasks)}")
    start = time.time()
    
    results = await asyncio.gather(*tasks)
    
    generated = sum(1 for r in results if r is True)
    skipped = sum(1 for r in results if r is False) - len(failures)
    elapsed = time.time() - start
    
    # Total size
    total_size = 0
    for f in os.listdir(OUTPUT_DIR):
        if f.endswith('.mp3'):
            total_size += os.path.getsize(os.path.join(OUTPUT_DIR, f))
    
    print(f"\n=== RESULTS ===")
    print(f"Time: {elapsed:.1f}s")
    print(f"Generated: {generated}")
    print(f"Skipped (existing): {skipped}")
    print(f"Failures: {len(failures)}")
    print(f"Total MP3 files: {len([f for f in os.listdir(OUTPUT_DIR) if f.endswith('.mp3')])}")
    print(f"Total size: {total_size / 1024 / 1024:.1f} MB")
    
    if failures:
        print(f"\nFailed files:")
        for path, err in failures[:20]:
            print(f"  {os.path.basename(path)}: {err[:100]}")
        if len(failures) > 20:
            print(f"  ... and {len(failures)-20} more")

if __name__ == '__main__':
    asyncio.run(main())
