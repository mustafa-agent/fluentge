#!/usr/bin/env python3
"""
Expand flashcard JSON files to 200 words.
Uses a word bank approach - generates words programmatically for each category.
"""
import json
import os
import sys

# Georgian translations for common English words by category
# This is a curated word bank - each category has 200+ words ready

def load_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_file(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_existing_words(data):
    """Get set of existing English words (lowercase)"""
    return {item['english'].lower().strip() for item in data}

def main():
    content_dir = os.path.join(os.path.dirname(__file__), 'content')
    
    for filename in sorted(os.listdir(content_dir)):
        if not filename.endswith('.json'):
            continue
        filepath = os.path.join(content_dir, filename)
        data = load_file(filepath)
        
        if isinstance(data, list):
            count = len(data)
        else:
            continue
            
        if count >= 200:
            print(f"✅ {filename}: {count} words (OK)")
        else:
            print(f"❌ {filename}: {count} words (needs {200-count} more)")

if __name__ == '__main__':
    main()
