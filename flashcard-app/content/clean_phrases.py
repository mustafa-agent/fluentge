#!/usr/bin/env python3
"""Remove phrases (multi-word entries) from all category JSONs, report what was removed."""
import json, os, glob

content_dir = os.path.dirname(os.path.abspath(__file__))
skip_files = ['top-5000-words.json', 'top-2000-words.json']

total_removed = 0
total_kept = 0

for fpath in sorted(glob.glob(os.path.join(content_dir, '*.json'))):
    fname = os.path.basename(fpath)
    if fname in skip_files:
        continue
    
    with open(fpath, 'r') as f:
        cards = json.load(f)
    
    original_count = len(cards)
    # Keep only single words (no spaces in english field) 
    # Exception: allow very common 2-word phrases
    exceptions = {'thank you', 'good morning', 'good night', 'good evening', 'excuse me', 
                  'ice cream', 'high school', 'cell phone', 'credit card', 'living room',
                  'bedroom', 'bathroom'}
    
    kept = []
    removed = []
    for card in cards:
        eng = card.get('english', '').strip()
        if ' ' not in eng or eng.lower() in exceptions:
            kept.append(card)
        else:
            removed.append(eng)
    
    if removed:
        print(f"\n{fname}: {original_count} → {len(kept)} (removed {len(removed)})")
        for r in removed[:5]:
            print(f"  - {r}")
        if len(removed) > 5:
            print(f"  ... and {len(removed) - 5} more")
        
        with open(fpath, 'w') as f:
            json.dump(kept, f, ensure_ascii=False, indent=2)
    
    total_removed += len(removed)
    total_kept += len(kept)

print(f"\n\nTOTAL: Kept {total_kept}, Removed {total_removed} phrases")
