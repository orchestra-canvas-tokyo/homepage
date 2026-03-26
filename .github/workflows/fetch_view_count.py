import os
import sys

import requests

API_KEY = os.getenv('YOUTUBE_API_KEY')
CHANNEL_ID = os.getenv('CHANNEL_ID')
VIEW_COUNT_FILE = 'src/routes/support-us/youtube_total_view_count.txt'
SIGNIFICANT_STEP = 100000
MAX_ALLOWED_INCREASE = int(os.getenv('MAX_ALLOWED_INCREASE', '5000000'))

if not API_KEY or not CHANNEL_ID:
    print('Error: Missing API key or channel ID.')
    sys.exit(1)

url = (
    'https://www.googleapis.com/youtube/v3/channels'
    f'?part=statistics&id={CHANNEL_ID}&key={API_KEY}'
)

try:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    data = response.json()
    total_views = int(data['items'][0]['statistics']['viewCount'])
except (requests.RequestException, KeyError, ValueError) as e:
    print(f'Error fetching YouTube data: {e}')
    sys.exit(1)

previous_views = 0
if os.path.exists(VIEW_COUNT_FILE):
    try:
        with open(VIEW_COUNT_FILE, 'r', encoding='utf-8') as f:
            previous_views = int(f.read().strip())
    except ValueError:
        print('Warning: Invalid value in view_count.txt, resetting to 0.')
        previous_views = 0

if total_views < previous_views:
    print(
        'Guardrail triggered: fetched view count is smaller than current value '
        f'({total_views} < {previous_views}).'
    )
    sys.exit(1)

if total_views - previous_views > MAX_ALLOWED_INCREASE:
    print(
        'Guardrail triggered: increase is too large '
        f'({total_views - previous_views} > {MAX_ALLOWED_INCREASE}).'
    )
    sys.exit(1)

if previous_views // SIGNIFICANT_STEP != total_views // SIGNIFICANT_STEP:
    with open(VIEW_COUNT_FILE, 'w', encoding='utf-8') as f:
        f.write(str(total_views))

    with open(os.environ['GITHUB_ENV'], 'a', encoding='utf-8') as env_file:
        env_file.write('SHOULD_COMMIT=true\n')
        env_file.write(f'TOTAL_VIEWS={total_views}\n')
        env_file.write(f'PREVIOUS_VIEWS={previous_views}\n')
else:
    print('No significant change in views.')
