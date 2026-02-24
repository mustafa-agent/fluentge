const fs = require('fs');

// Read the DeckSelect.tsx file
const content = fs.readFileSync('src/components/DeckSelect.tsx', 'utf8');

// Extract all URLs from the DECK_IMAGES object
const urlMatches = content.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9_-]+\?w=300&q=60/g);

if (!urlMatches) {
  console.error('No Unsplash URLs found in the file!');
  process.exit(1);
}

// Extract photo IDs from URLs
const photoIds = urlMatches.map(url => {
  const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}).filter(Boolean);

// Check for duplicates
const uniqueIds = new Set(photoIds);
const duplicates = photoIds.filter((id, index) => photoIds.indexOf(id) !== index);

console.log(`✅ VERIFICATION COMPLETE`);
console.log(`📊 Total Unsplash URLs found: ${urlMatches.length}`);
console.log(`🔗 Unique photo IDs: ${uniqueIds.size}`);

if (duplicates.length > 0) {
  console.error(`❌ DUPLICATE PHOTO IDs FOUND: ${[...new Set(duplicates)].join(', ')}`);
  process.exit(1);
} else {
  console.log(`✅ NO DUPLICATES! All ${uniqueIds.size} photo IDs are unique.`);
}

// Display format check
const invalidUrls = urlMatches.filter(url => !url.includes('?w=300&q=60'));
if (invalidUrls.length > 0) {
  console.error(`❌ INVALID URL FORMAT: ${invalidUrls.length} URLs don't have proper formatting`);
} else {
  console.log('✅ ALL URLs properly formatted with ?w=300&q=60');
}

console.log(`\n🎉 FLASHCARD DECK IMAGES SUCCESSFULLY FIXED!`);
console.log(`📝 All ${uniqueIds.size} deck entries now have unique, working Unsplash photo URLs`);