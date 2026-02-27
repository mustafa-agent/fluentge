#!/usr/bin/env python3
"""Helper to expand flashcard JSON files to 200 entries."""
import json, sys

def expand(filename, new_entries):
    with open(filename, 'r') as f:
        data = json.load(f)
    
    existing_words = {e['english'].lower() for e in data}
    category = data[0].get('category', '')
    
    added = 0
    for entry in new_entries:
        if entry['english'].lower() not in existing_words and ' ' not in entry['english']:
            entry['category'] = category
            entry['level'] = entry.get('level', 'B1')
            data.append(entry)
            existing_words.add(entry['english'].lower())
            added += 1
    
    with open(filename, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"{filename}: {len(data)} entries ({added} added)")
    return len(data)
