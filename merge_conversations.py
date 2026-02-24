# -*- coding: utf-8 -*-
import json

with open('website/dist-lite-deploy/data/conversations.json') as f:
    data = json.load(f)

print(f'Loaded {len(data)} conversations')

# Read new conversations from file
with open('new_convs.json') as f:
    new_convs = json.load(f)

data.extend(new_convs)

with open('website/dist-lite-deploy/data/conversations.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False)

# Also copy to dist-deploy
with open('website/dist-deploy/data/conversations.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False)

print(f'Total: {len(data)} conversations saved')
