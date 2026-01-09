import os
import feedparser
import urllib.parse
from email.utils import parsedate_to_datetime # New Import
from pathlib import Path
from supabase import create_client
from dotenv import load_dotenv

# 1. Setup Supabase
env_path = Path('.') / 'my-website' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_KEY")

if not url or not key:
    if not os.environ.get("NEXT_PUBLIC_SUPABASE_URL"):
        exit()

supabase = create_client(url, key)

POSITIVE_KEYWORDS = [
    "Interfaith harmony India",
    "Hindu Muslim unity stories",
    "NGO impact stories India",
    "Crowdfunding success medical India",
    "Transgender employment success India",
    "Tree plantation drive record India",
    "River rejuvenation success India",
    "Police helping citizens viral India",
    "Indian Army rescue operation success",
    "Honest IAS officer stories",
    "Free education initiatives rural India"
]

def maintain_limit():
    try:
        # Sort by published_at now
        response = supabase.table("positive_news").select("id").order("published_at", desc=True).execute()
        all_rows = response.data
        if len(all_rows) > 50:
            ids_to_delete = [row['id'] for row in all_rows[50:]]
            print(f"🧹 Maintenance: Deleting {len(ids_to_delete)} old stories...")
            supabase.table("positive_news").delete().in_("id", ids_to_delete).execute()
    except Exception as e:
        print(f"⚠️ Maintenance Error: {e}")

def fetch_positive_news():
    print("🔍 Starting Positive News Search (Real-Time Sort)...")
    
    count = 0
    
    for keyword in POSITIVE_KEYWORDS:
        encoded_query = urllib.parse.quote(keyword)
        rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
        feed = feedparser.parse(rss_url)
        
        for entry in feed.entries[:5]: 
            try:
                final_link = entry.link
                title = entry.title
                source = entry.source.title if 'source' in entry else "Google News"
                
                # DATE FIX: Convert "Fri, 09 Jan..." to "2026-01-09 14:00:00"
                # This makes it sortable in the database.
                published_dt = parsedate_to_datetime(entry.published)
                published_iso = published_dt.isoformat()

                existing = supabase.table("positive_news").select("link").eq("link", final_link).execute()
                
                if not existing.data:
                    data = {
                        "title": title,
                        "link": final_link,
                        "source": source,
                        "published_at": published_iso # Save the ISO date
                    }
                    supabase.table("positive_news").insert(data).execute()
                    count += 1
                    print(f"   ✅ Added: {title[:30]}... ({published_iso})")

            except Exception as e:
                continue

    print(f"🎉 Success! {count} positive stories added.")
    maintain_limit()

if __name__ == "__main__":
    fetch_positive_news()