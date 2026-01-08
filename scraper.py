import os
from pathlib import Path
from supabase import create_client
from GoogleNews import GoogleNews
from dotenv import load_dotenv

# 1. Load environment variables
env_path = Path('.') / 'my-website' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_KEY")

if not url or not key:
    if not os.environ.get("NEXT_PUBLIC_SUPABASE_URL"):
        print(f"❌ Error: Could not find API keys.")
        exit()

supabase = create_client(url, key)

# 2. Define Keywords
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

def fetch_harsh_news():
    # CRITICAL UPDATE: period='1d' (Last 24 hours only)
    googlenews = GoogleNews(lang='en', region='IN', period='1d')
    all_articles = []

    print("🔍 Starting Harsh Realities Search (Last 24 Hours)...")

    for keyword in KEYWORDS:
        print(f"   Searching for: {keyword}")
        googlenews.clear()
        googlenews.search(keyword)
        result = googlenews.result()
        
        for article in result:
            if article['title'] and article['link']:
                all_articles.append(article)

    # CRITICAL STEP: Reverse list for correct sorting order on website
    all_articles.reverse()

    print(f"✅ Found {len(all_articles)} stories. Uploading...")

    count = 0
    for news in all_articles:
        try:
            # Note: Ensure your table name is correct ('news' or 'harsh_news')
            existing = supabase.table("news").select("link").eq("link", news['link']).execute()
            
            if not existing.data:
                data = {
                    "title": news['title'],
                    "link": news['link'],
                    "source": news['media'],
                    "published_at": news['date']
                }
                supabase.table("news").insert(data).execute()
                count += 1
                print(f"   -> Added: {news['title'][:30]}...")
                
        except Exception as e:
            print(f"   ⚠️ Error inserting article: {e}")

    print(f"🎉 Success! {count} new harsh stories added.")

if __name__ == "__main__":
    fetch_harsh_news()