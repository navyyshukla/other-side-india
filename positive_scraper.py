import os
from pathlib import Path
from supabase import create_client
from GoogleNews import GoogleNews
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
    """
    Keeps only the latest 50 stories. Deletes the rest.
    """
    try:
        # 1. Fetch ALL IDs sorted by newest first
        response = supabase.table("positive_news").select("id").order("created_at", desc=True).execute()
        all_rows = response.data
        
        # 2. If we have more than 50, find the ones to delete
        if len(all_rows) > 50:
            ids_to_keep = [row['id'] for row in all_rows[:50]]
            ids_to_delete = [row['id'] for row in all_rows[50:]]
            
            print(f"🧹 Maintenance: Deleting {len(ids_to_delete)} old stories to keep limit at 50...")
            
            # 3. Delete the old ones
            supabase.table("positive_news").delete().in_("id", ids_to_delete).execute()
            print("✨ Cleanup complete. Database capped at 50.")
            
    except Exception as e:
        print(f"⚠️ Maintenance Error: {e}")

def fetch_positive_news():
    googlenews = GoogleNews(lang='en', region='IN', period='1d')
    all_articles = []

    print("🔍 Starting Positive News Search...")

    for keyword in POSITIVE_KEYWORDS:
        print(f"   Searching: {keyword}")
        googlenews.clear()
        googlenews.search(keyword)
        result = googlenews.result()
        for article in result:
            if article['title'] and article['link']:
                all_articles.append(article)

    all_articles.reverse()

    print(f"   Found {len(all_articles)} stories. Uploading...")

    count = 0
    for news in all_articles:
        try:
            final_link = news['link']
            existing = supabase.table("positive_news").select("link").eq("link", final_link).execute()
            
            if not existing.data:
                data = {
                    "title": news['title'],
                    "link": final_link,
                    "source": news['media'],
                    "published_at": news['date']
                }
                supabase.table("positive_news").insert(data).execute()
                count += 1
                print(f"   ✅ Added: {news['title'][:30]}...")
                
        except Exception as e:
            print(f"   ⚠️ Error: {e}")

    print(f"🎉 Success! {count} stories added.")
    
    # RUN CLEANUP
    maintain_limit()

if __name__ == "__main__":
    fetch_positive_news()