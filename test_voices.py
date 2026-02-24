#!/usr/bin/env python3

import edge_tts
import asyncio
import os

# Test phrase
test_phrase = "Hello, how are you today? I hope you're having a wonderful time learning English with FluentGe."

# Voices to test
voices = {
    "ava": "en-US-AvaMultilingualNeural",
    "jenny": "en-US-JennyNeural", 
    "aria": "en-US-AriaNeural"
}

output_dir = "/Users/aiagent/.openclaw/workspace/english-app/podcast"

async def generate_test_voice(voice_name, voice_id):
    """Generate a test audio file with the specified voice"""
    try:
        communicate = edge_tts.Communicate(test_phrase, voice_id, rate="-10%")
        output_path = os.path.join(output_dir, f"test_{voice_name}.mp3")
        await communicate.save(output_path)
        print(f"✅ Generated test_{voice_name}.mp3 with {voice_id}")
        return True
    except Exception as e:
        print(f"❌ Error generating test_{voice_name}.mp3: {e}")
        return False

async def main():
    """Generate test files for all three voices"""
    print("=== Testing Female Voices for FluentGe ===")
    print(f"Test phrase: {test_phrase}")
    print()
    
    tasks = []
    for voice_name, voice_id in voices.items():
        tasks.append(generate_test_voice(voice_name, voice_id))
    
    results = await asyncio.gather(*tasks)
    
    successful = sum(results)
    print(f"\n✅ Generated {successful}/{len(voices)} test files successfully!")
    print("\nTest files created:")
    for voice_name in voices.keys():
        print(f"  - test_{voice_name}.mp3")
    
    print("\nPlease listen to each test file and choose which voice sounds most natural and warm.")

if __name__ == "__main__":
    asyncio.run(main())