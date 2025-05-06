import os
import requests
import datetime
import sys

API_KEY = os.getenv('YOUTUBE_API_KEY')
CHANNEL_ID = os.getenv('CHANNEL_ID')
VIEW_COUNT_FILE = 'src/routes/support-us/youtube_total_view_count.txt'

if not API_KEY or not CHANNEL_ID:
    print("Error: Missing API key or channel ID.")
    sys.exit(1)

url = f'https://www.googleapis.com/youtube/v3/channels?part=statistics&id={CHANNEL_ID}&key={API_KEY}'

try:
    response = requests.get(url)
    response.raise_for_status()  # HTTPエラーをキャッチ
    data = response.json()
    total_views = int(data['items'][0]['statistics']['viewCount'])
except (requests.RequestException, KeyError, ValueError) as e:
    print(f"Error fetching YouTube data: {e}")
    sys.exit(1)

previous_views = 0
if os.path.exists(VIEW_COUNT_FILE):
    try:
        with open(VIEW_COUNT_FILE, 'r') as f:
            previous_views = int(f.read().strip())
    except ValueError:
        print("Warning: Invalid value in view_count.txt, resetting to 0.")
        previous_views = 0

if previous_views // 100000 != total_views // 100000:
    with open(VIEW_COUNT_FILE, 'w') as f:
        f.write(str(total_views))
    new_branch = f"update-view-count-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    with open(os.environ['GITHUB_ENV'], 'a') as env_file:
        env_file.write(f"NEW_BRANCH={new_branch}\n")
        env_file.write(f"TOTAL_VIEWS={total_views}\n")
else:
    print("No significant change in views.")
    sys.exit(0)
