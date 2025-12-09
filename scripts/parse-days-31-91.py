#!/usr/bin/env python3
"""Parse playlist data to extract days 31-91 with video IDs and passages"""

import re
import json

# Read the playlist data
with open('/home/jdmldm/code/BibleProject/scripts/playlist-full-data.txt', 'r') as f:
    lines = f.readlines()

days_data = {}
video_ids = {}

for line in lines:
    # Parse format: 037:MWXH-0z3Cbw:Day 031 (Exodus 4-6)
    match = re.match(r'(\d+):([^:]+):Day (\d+) \(([^)]+)\)', line)
    if match:
        playlist_index = int(match.group(1))
        video_id = match.group(2)
        day_number = int(match.group(3))
        passages_str = match.group(4)

        if 31 <= day_number <= 91:
            days_data[day_number] = {
                'video_id': video_id,
                'passages_str': passages_str,
                'title': f'Day {day_number}: {passages_str}'
            }
            video_ids[day_number] = video_id

# Output video IDs mapping for TypeScript/JavaScript
print("// Video IDs for Days 31-91")
print("const videoIds: { [key: number]: string } = {")
for day in sorted(days_data.keys()):
    print(f"  {day}: '{days_data[day]['video_id']}',")
print("}")

print("\n\n// Reading data for Days 31-91")
print("const bibleRecapReadings31to91 = [")

for day in sorted(days_data.keys()):
    data = days_data[day]
    passages_str = data['passages_str']

    # Parse passages (e.g., "Exodus 4-6" or "Numbers 14-15, Psalm 90")
    # Split by comma first
    passage_parts = [p.strip() for p in passages_str.split(',')]

    passages = []
    for part in passage_parts:
        # Extract book and chapters
        # Patterns: "Exodus 4-6", "Psalm 90", "Numbers 14-15"
        match = re.match(r'(\w+\s?\w*)\s+(\d+)(?:-(\d+))?', part)
        if match:
            book = match.group(1).strip()
            start_chapter = int(match.group(2))
            end_chapter = int(match.group(3)) if match.group(3) else start_chapter

            # Create passage entries for each chapter
            for chapter in range(start_chapter, end_chapter + 1):
                passages.append({
                    'book': book,
                    'chapter': chapter,
                    'verseStart': 1,
                    'verseEnd': None,  # Will get all verses
                    'note': f'Day {day} reading from {passages_str}'
                })

    print(f"  {{ day: {day}, title: 'Day {day}: {passages_str}', passages: {json.dumps(passages)} }},")

print("];")

# Save to JSON for reference
output = {
    'video_ids': video_ids,
    'days': days_data
}

with open('/home/jdmldm/code/BibleProject/scripts/days-31-91.json', 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n\nSaved {len(days_data)} days to days-31-91.json")
