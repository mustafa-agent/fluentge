import json

with open('top-5000-words.json') as f:
    words = json.load(f)

existing = set(w['english'].lower() for w in words)
print(f"Before: {len(words)} words")

# Load new words from separate file
with open('new_words_batch2.json') as f:
    new_words = json.load(f)

added = 0
for w in new_words:
    if w['english'].lower() not in existing:
        words.append(w)
        existing.add(w['english'].lower())
        added += 1

print(f"Added: {added}, Total: {len(words)}")

with open('top-5000-words.json', 'w') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

print("Done!")
