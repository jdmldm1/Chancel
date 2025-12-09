#!/usr/bin/env python3
"""
Fetch all 365 videos from The Bible Recap YouTube playlist
This script handles YouTube's lazy loading by making multiple requests
"""

import subprocess
import json
import time

PLAYLIST_ID = "PLkgWIAVOhHuAVwyG587rctAbAuWFtAv1D"
PLAYLIST_URL = f"https://www.youtube.com/playlist?list={PLAYLIST_ID}"

print("Fetching complete playlist (this may take a few minutes)...")
print(f"Playlist: {PLAYLIST_URL}\n")

# Try different methods to get all videos
all_videos = {}

# Method 1: Use yt-dlp with JSON output
print("Method 1: Using yt-dlp JSON output...")
try:
    result = subprocess.run(
        [
            'yt-dlp',
            '--flat-playlist',
            '--dump-json',
            '--lazy-playlist', 'no',
            PLAYLIST_URL
        ],
        capture_output=True,
        text=True,
        timeout=300
    )

    for line in result.stdout.strip().split('\n'):
        if line:
            try:
                video = json.loads(line)
                playlist_index = video.get('playlist_index')
                video_id = video.get('id')
                title = video.get('title')
                if playlist_index and video_id:
                    all_videos[playlist_index] = {
                        'id': video_id,
                        'title': title
                    }
            except json.JSONDecodeError:
                continue

    print(f"Found {len(all_videos)} videos via JSON method")

except Exception as e:
    print(f"JSON method failed: {e}")

# If we still don't have 365 videos, try fetching in chunks
if len(all_videos) < 365:
    print(f"\nMethod 2: Fetching in chunks...")

    # YouTube typically loads 100 items at a time
    # We'll try to fetch multiple "pages"
    chunk_size = 100
    for start_index in range(1, 366, chunk_size):
        end_index = min(start_index + chunk_size - 1, 365)
        print(f"  Fetching videos {start_index}-{end_index}...")

        try:
            result = subprocess.run(
                [
                    'yt-dlp',
                    '--flat-playlist',
                    f'--playlist-start', str(start_index),
                    f'--playlist-end', str(end_index),
                    '--print', '%(playlist_index)s:%(id)s:%(title)s',
                    PLAYLIST_URL
                ],
                capture_output=True,
                text=True,
                timeout=60
            )

            for line in result.stdout.strip().split('\n'):
                if ':' in line:
                    parts = line.split(':', 2)
                    if len(parts) >= 3:
                        idx = int(parts[0])
                        vid_id = parts[1]
                        title = parts[2]
                        if idx not in all_videos:
                            all_videos[idx] = {'id': vid_id, 'title': title}

            time.sleep(1)  # Be nice to YouTube's servers

        except Exception as e:
            print(f"  Chunk {start_index}-{end_index} failed: {e}")
            continue

print(f"\n=== RESULTS ===")
print(f"Total videos found: {len(all_videos)}")

# Sort by playlist index
sorted_videos = sorted(all_videos.items())

# Save to file
output_file = '/home/jdmldm/code/BibleProject/scripts/playlist-all-videos.json'
with open(output_file, 'w') as f:
    json.dump(
        {str(idx): data for idx, data in sorted_videos},
        f,
        indent=2
    )

print(f"Saved to: {output_file}\n")

# Also print for manual verification
print("Video IDs (for seed file):")
print("const videoIds = {")
for idx, data in sorted_videos[:10]:  # First 10
    print(f"  {idx}: '{data['id']}',  // {data['title']}")
print("  ...")
if len(sorted_videos) > 10:
    for idx, data in sorted_videos[-5:]:  # Last 5
        print(f"  {idx}: '{data['id']}',  // {data['title']}")
print("};")

print(f"\nFound {len(sorted_videos)} videos total")
