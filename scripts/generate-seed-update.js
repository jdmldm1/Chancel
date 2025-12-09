const fs = require('fs');

// Read the parsed days 31-91 data
const data = JSON.parse(fs.readFileSync('/home/jdmldm/code/BibleProject/scripts/days-31-91.json', 'utf8'));

// Generate video IDs additions (days 31-91)
console.log('// Add these to videoIds object (after day 30):');
const sortedDays = Object.keys(data.video_ids).map(Number).sort((a, b) => a - b);
sortedDays.forEach(day => {
  const videoId = data.video_ids[day];
  console.log(`    ${day}: '${videoId}',`);
});

console.log('\n\n// Add these readings after day 30 in bibleRecapReadings array:');

sortedDays.forEach(day => {
  const dayData = data.days[day];
  const passagesStr = dayData.passages_str;

  // Parse passages from the string
  const passageParts = passagesStr.split(',').map(p => p.trim());
  const passages = [];

  passageParts.forEach(part => {
    const match = part.match(/(\w+(?:\s+\w+)?)\s+(\d+)(?:-(\d+))?/);
    if (match) {
      const book = match[1].trim();
      const startChapter = parseInt(match[2]);
      const endChapter = match[3] ? parseInt(match[3]) : startChapter;

      for (let chapter = startChapter; chapter <= endChapter; chapter++) {
        passages.push({
          book,
          chapter,
          verseStart: 1,
          verseEnd: null,
          note: `Day ${day} reading from ${passagesStr}`
        });
      }
    }
  });

  console.log(`    { day: ${day}, title: 'Day ${day}: ${passagesStr}', passages: ${JSON.stringify(passages)} },`);
});

console.log('\n\nGeneration complete!');
