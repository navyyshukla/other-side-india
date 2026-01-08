import os
from pathlib import Path
from supabase import create_client
from GoogleNews import GoogleNews
from datetime import datetime
from dotenv import load_dotenv

# 1. Load environment variables from the 'my-website' folder
# This fixes the "supabase_url is required" error by pointing to the right file
env_path = Path('.') / 'my-website' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_KEY")

# Safety Check: Stop if keys are missing
if not url or not key:
    print(f"❌ Error: Could not find API keys at: {env_path.absolute()}")
    print("   Make sure you have a '.env.local' file inside the 'my-website' folder.")
    exit()

supabase = create_client(url, key)

# 2. Define the "Positive India" Keywords
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
    googlenews = GoogleNews(lang='en', region='IN')
    all_articles = []

    print("🔍 Starting Positive News Search...")

    for keyword in POSITIVE_KEYWORDS:
        print(f"   Searching for: {keyword}")
        googlenews.clear()
        googlenews.search(keyword)
        result = googlenews.result()
        
        # Add valid articles to our list
        for article in result:
            if article['title'] and article['link']:
                all_articles.append(article)

    print(f"✅ Found {len(all_articles)} positive stories. Uploading to Supabase...")

    # 3. Upload to the 'positive_news' table
    count = 0
    for news in all_articles:
        # Check if news already exists to avoid duplicates
        try:
            existing = supabase.table("positive_news").select("link").eq("link", news['link']).execute()
            
            if not existing.data:
                data = {
                    "title": news['title'],
                    "link": news['link'],
                    "source": news['media'],
                    "published_at": news['date']
                }
                supabase.table("positive_news").insert(data).execute()
                count += 1
                print(f"   -> Added: {news['title'][:30]}...")
                
        except Exception as e:
            print(f"   ⚠️ Error inserting article: {e}")

    print(f"🎉 Success! {count} new positive stories added to the database.")

if __name__ == "__main__":
    fetch_positive_news()