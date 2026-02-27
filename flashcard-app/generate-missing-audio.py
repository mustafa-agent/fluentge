#!/usr/bin/env python3
"""Generate TTS audio for words missing audio files using edge-tts."""
import asyncio
import json
import os
import re
import sys

CONTENT_DIR = os.path.join(os.path.dirname(__file__), 'content')
AUDIO_DIR = os.path.join(os.path.dirname(__file__), 'public', 'audio', 'words')

# High quality voices
EN_VOICE = "en-US-AndrewMultilingualNeural"  # Natural male voice
KA_VOICE = "ka-GE-GiorgiNeural"  # Georgian male voice

async def generate_audio(text, voice, output_path):
    """Generate TTS audio for a word."""
    import edge_tts
    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
        return True
    except Exception as e:
        print(f"  Error: {text} -> {e}")
        return False

async def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    
    # Collect all unique words
    all_words = set()
    word_georgian = {}  # english -> georgian translation
    
    for f in sorted(os.listdir(CONTENT_DIR)):
        if not f.endswith('.json'):
            continue
        try:
            data = json.load(open(os.path.join(CONTENT_DIR, f)))
            if isinstance(data, list):
                for item in data:
                    en = item.get('english', '').strip()
                    ka = item.get('georgian', '').strip()
                    if en and ' ' not in en:  # single words only
                        all_words.add(en.lower())
                        if ka:
                            word_georgian[en.lower()] = ka
        except:
            pass
    
    # Find missing audio
    existing = set()
    for f in os.listdir(AUDIO_DIR):
        if f.endswith('_en.mp3'):
            existing.add(f[:-7])
    
    missing = sorted(all_words - existing)
    print(f"Total words: {len(all_words)}, Existing audio: {len(existing)}, Missing: {len(missing)}")
    
    if not missing:
        print("All words have audio!")
        return
    
    # Generate in batches
    batch_size = 10
    generated = 0
    failed = 0
    
    for i in range(0, len(missing), batch_size):
        batch = missing[i:i+batch_size]
        tasks = []
        
        for word in batch:
            en_path = os.path.join(AUDIO_DIR, f"{word}_en.mp3")
            ka_path = os.path.join(AUDIO_DIR, f"{word}_ka.mp3")
            
            if not os.path.exists(en_path):
                tasks.append(('en', word, generate_audio(word, EN_VOICE, en_path)))
            
            ka_text = word_georgian.get(word, '')
            if ka_text and not os.path.exists(ka_path):
                tasks.append(('ka', word, generate_audio(ka_text, KA_VOICE, ka_path)))
        
        # Run batch concurrently
        results = await asyncio.gather(*[t[2] for t in tasks], return_exceptions=True)
        
        for (lang, word, _), result in zip(tasks, results):
            if result is True:
                generated += 1
            else:
                failed += 1
        
        done = min(i + batch_size, len(missing))
        print(f"Progress: {done}/{len(missing)} words ({generated} generated, {failed} failed)")
    
    print(f"\nDone! Generated {generated} audio files, {failed} failures")

if __name__ == '__main__':
    asyncio.run(main())
