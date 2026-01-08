import feedparser
import dateparser
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

rss_urls = [
    "https://news.google.com/rss/search?q=India&hl=en-IN&gl=IN&ceid=IN:en",
    "https://www.thehindu.com/news/national/feeder/default.rss",
    "https://timesofindia.indiatimes.com/rssfeedstopstories.cms"
]

keywords = [
    "rape", "dowry", "harassment", "molestation", "bribe", "bribery", 
    "corruption", "scam", "dalit", "untouchable", "caste", "suicide", 
    "honor killing", "trafficking", "acid attack", "domestic violence",
    "alimony", "false accusation"
]

# NEW: Helper function to clean source names
def get_source_name(feed_url):
    if "google" in feed_url:
        return "Google News"
    elif "thehindu" in feed_url:
        return "The Hindu"
    elif "timesofindia" in feed_url:
        return "Times of India"
    return "News Source"

def fetch_and_save_news():
    print(f"--- STARTING SCRAPE ---")
    
    for url in rss_urls:
        print(f"Scanning: {url}...")
        feed = feedparser.parse(url)
        source_name = get_source_name(url) # Use clean name
        
        for entry in feed.entries:
            title = entry.title.lower()
            summary = entry.get('summary', '').lower()
            
            if any(word in title for word in keywords) or any(word in summary for word in keywords):
                published_date = "Unknown"
                if hasattr(entry, 'published'):
                    dt = dateparser.parse(entry.published)
                    if dt:
                        published_date = dt.strftime("%Y-%m-%d %H:%M")

                article_data = {
                    "title": entry.title,
                    "link": entry.link,
                    "date": published_date,
                    "source": source_name # Save the clean name
                }
                
                try:
                    data = supabase.table("news").upsert(article_data, on_conflict="link").execute()
                    print(f"✅ Saved: {entry.title[:30]}...")
                except Exception as e:
                    print(f"❌ Error saving {entry.title[:30]}: {e}")

if __name__ == "__main__":
    fetch_and_save_news()
    print("\n--- DONE. CHECK YOUR SUPABASE DASHBOARD ---")