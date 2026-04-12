import yt_dlp
import sys
from youtube_transcript_api import YouTubeTranscriptApi

def main(handle="@tomscott"):
    # 1. Resolve Channel ID using search (bypasses the handle-tab 404)
    ydl_opts = {'quiet': True, 'extract_flat': True}
    search_url = f"ytsearch1:{handle} channel"
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            results = ydl.extract_info(search_url, download=False)
            channel_id = results['entries'][0].get('channel_id')
            if not channel_id:
                print("Could not find Channel ID.")
                return
        except Exception:
            print(f"Error finding channel {handle}.")
            return

        # 2. Get Top 5 Videos from the 'Uploads' playlist
        uploads_url = f"https://www.youtube.com/playlist?list=UU{channel_id[2:]}"
        playlist = ydl.extract_info(uploads_url, download=False)
        videos = sorted(playlist['entries'], key=lambda x: x.get('view_count', 0), reverse=True)[:5]

    print(f"\n--- Top 5 Videos for {handle} ---\n")
    for vid in videos:
        v_id = vid['id']
        url = f"https://www.youtube.com/watch?v={v_id}"
        title = vid['title']
        views = vid.get('view_count', 0)
        
        print(f"Title: {title}")
        print(f"Views: {views:,}")
        print(f"URL:   {url}")
        
        # 3. Quick Transcript Attempt
        try:
            # We try to get 'en' specifically
            transcript = YouTubeTranscriptApi.get_transcript(v_id, languages=['en', 'en-GB'])
            with open(f"{v_id}.txt", "w", encoding="utf-8") as f:
                f.write(" ".join([t['text'] for t in transcript]))
            print("Status: ✅ Script Saved Locally")
        except:
            print("Status: ❌ Transcript Blocked (Must do manually)")
        
        print("-" * 30)

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "@tomscott"
    main(target)
