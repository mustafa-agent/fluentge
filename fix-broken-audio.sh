#!/bin/bash
# Regenerate 63 broken 0-byte audio files
cd /Users/aiagent/.openclaw/workspace/english-app/flashcard-app/public/audio/words

EDGE_TTS="/Users/aiagent/Library/Python/3.9/bin/edge-tts"
EN_VOICE="en-US-ChristopherNeural"
KA_VOICE="ka-GE-GiorgiNeural"

FIXED=0
FAILED=0

for f in $(find . -name "*.mp3" -size 0 -print); do
  basename=$(basename "$f" .mp3)
  word="${basename%_*}"
  lang="${basename##*_}"
  
  # Clean word for TTS (remove hyphens, underscores)
  clean_word=$(echo "$word" | tr '-' ' ' | tr '_' ' ')
  
  if [ "$lang" = "en" ]; then
    voice="$EN_VOICE"
  else
    voice="$KA_VOICE"
  fi
  
  echo "Generating: $basename ($clean_word) [$lang]"
  $EDGE_TTS --voice "$voice" --text "$clean_word" --write-media "$f" 2>/dev/null
  
  if [ -s "$f" ]; then
    FIXED=$((FIXED + 1))
  else
    echo "  FAILED: $basename"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "Fixed: $FIXED / Failed: $FAILED"
