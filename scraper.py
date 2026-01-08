import os
import feedparser
import urllib.parse
from pathlib import Path
from supabase import create_client
from dotenv import load_dotenv

env_path = Path('.') / 'my-website' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_KEY")

if not url or not key:
    if not os.environ.get("NEXT_PUBLIC_SUPABASE_URL"):
        exit()

supabase = create_client(url, key)

KEYWORDS = [
    "India corruption scam revealed",
    "Women safety issues India recent",
    "Caste discrimination incident India",
    "Legal loophole India case study",
    "Human trafficking India news",
    "Dowry death case India recent",
    "Sanitation worker death India",
    "Custodial death India report",
    "Cyber crime fraud India recent"
]

def maintain_limit():
    try:
        response = supabase.table("news").select("id").order("created_at", desc=True).execute()
        all_rows = response.data
        if len(all_rows) > 50:
            ids_to_delete = [row['id'] for row in all_rows[50:]]
            print(f"🧹 Maintenance: Deleting {len(ids_to_delete)} old stories...")
            supabase.table("news").delete().in_("id", ids_to_delete).execute()
    except Exception as e:
        print(f"⚠️ Maintenance Error: {e}")

def fetch_harsh_news():
    print("🔍 Starting Harsh Realities Search (via Official RSS)...")
    
    count = 0
    
    for keyword in KEYWORDS:
        # Construct RSS URL
        encoded_query = urllib.parse.quote(keyword)
        rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
        
        feed = feedparser.parse(rss_url)
        
        for entry in feed.entries[:5]: 
            try:
                final_link = entry.link
                title = entry.title
                published = entry.published
                source = entry.source.title if 'source' in entry else "News"

                existing = supabase.table("news").select("link").eq("link", final_link).execute()
                
                if not existing.data:
                    data = {
                        "title": title,
                        "link": final_link,
                        "source": source,
                        "published_at": published
                    }
                    supabase.table("news").insert(data).execute()
                    count += 1
                    print(f"   ✅ Added: {title[:30]}...")

            except Exception as e:
                continue

    print(f"🎉 Success! {count} harsh stories added.")
    maintain_limit()

if __name__ == "__main__":
    fetch_harsh_news()