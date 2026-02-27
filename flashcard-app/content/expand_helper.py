#!/usr/bin/env python3
"""Helper to check and deduplicate flashcard files."""
import json, sys, os

def check_file(filepath):
    with open(filepath) as f:
        data = json.load(f)
    seen = set()
    unique = []
    for entry in data:
        word = entry['english'].lower()
        if word not in seen:
            seen.add(word)
            unique.append(entry)
    print(f"{os.path.basename(filepath)}: {len(data)} total, {len(unique)} unique, {len(data)-len(unique)} dupes removed")
    return unique

def dedup_and_save(filepath):
    unique = check_file(filepath)
    with open(filepath, 'w') as f:
        json.dump(unique, f, ensure_ascii=False, indent=2)
    return len(unique)

if __name__ == '__main__':
    for f in sys.argv[1:]:
        count = dedup_and_save(f)
        print(f"  -> Saved {count} unique entries")
