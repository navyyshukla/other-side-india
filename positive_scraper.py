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

# Safety Check
if not url or not key:
    # If .env isn't found, check if running in GitHub Actions (secrets are env vars)
    if not os.environ.get("NEXT_PUBLIC_SUPABASE_URL"):
        print(f"❌ Error: Could not find API keys.")
        exit()

supabase = create_client(url, key)

# 2. Define Keywords
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

def fetch_positive_news():
    # CRITICAL UPDATE: period='1d' (Last 24 hours only)
    googlenews = GoogleNews(lang='en', region='IN', period='1d')
    all_articles = []

    print("🔍 Starting Positive News Search (Last 24 Hours)...")

    for keyword in POSITIVE_KEYWORDS:
        print(f"   Searching for: {keyword}")
        googlenews.clear()
        googlenews.search(keyword)
        result = googlenews.result()
        
        for article in result:
            if article['title'] and article['link']:
                all_articles.append(article)

    # CRITICAL STEP: Reverse the list so the Newest article is inserted LAST.
    # This ensures it gets the latest timestamp and appears at the top of your site.
    all_articles.reverse()

    print(f"✅ Found {len(all_articles)} stories. Uploading...")

    count = 0
    for news in all_articles:
        try:
            # Check for duplicates
            existing = supabase.table("positive_news").select("link").eq("link", news['link']).execute()
            
            if not existing.data:
                data = {
                    "title": news['title'],
                    "link": news['link'],
                    "source": news['media'],
                    "published_at": news['date'] # Stores "5 mins ago", "1 hour ago" etc.
                }
                supabase.table("positive_news").insert(data).execute()
                count += 1
                print(f"   -> Added: {news['title'][:30]}...")
                
        except Exception as e:
            print(f"   ⚠️ Error inserting article: {e}")

    print(f"🎉 Success! {count} new positive stories added.")

if __name__ == "__main__":
    fetch_positive_news()