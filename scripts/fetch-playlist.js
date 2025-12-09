/**
 * Script to fetch YouTube playlist video IDs
 * Run this script to get all video IDs from The Bible Recap playlist
 *
 * Usage:
 *   node scripts/fetch-playlist.js
 */

const https = require('https');

const PLAYLIST_ID = 'PLkgWIAVOhHuAVwyG587rctAbAuWFtAv1D';
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

console.log('Fetching playlist data...');
console.log(`URL: ${PLAYLIST_URL}\n`);

https.get(PLAYLIST_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      // Extract video IDs from the page HTML
      // YouTube embeds video data in the page's initial data
      const videoIdMatches = data.matchAll(/"videoId":"([^"]+)"/g);
      const videoIds = new Set(); // Use Set to avoid duplicates

      for (const match of videoIdMatches) {
        videoIds.add(match[1]);
      }

      const uniqueIds = Array.from(videoIds);

      console.log(`Found ${uniqueIds.length} unique video IDs:\n`);

      // Output as JavaScript object for easy copy-paste into seed file
      console.log('const videoIds = {');
      uniqueIds.forEach((id, index) => {
        const dayNumber = index + 1;
        console.log(`  ${dayNumber}: '${id}',`);
      });
      console.log('};\n');

      console.log('\nCopy the videoIds object above and use it in the seed file.');

      // Also save to a file
      const fs = require('fs');
      const outputPath = './scripts/playlist-video-ids.json';
      fs.writeFileSync(outputPath, JSON.stringify(uniqueIds, null, 2));
      console.log(`\nAlso saved to: ${outputPath}`);

    } catch (error) {
      console.error('Error parsing playlist data:', error.message);
      console.log('\nNote: YouTube\'s HTML structure may have changed.');
      console.log('Alternative: Use yt-dlp or youtube-dl to fetch playlist info:');
      console.log(`  yt-dlp --flat-playlist --print id "${PLAYLIST_URL}"`);
    }
  });

}).on('error', (err) => {
  console.error('Error fetching playlist:', err.message);
});
