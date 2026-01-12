import os
import feedparser
import urllib.parse
from email.utils import parsedate_to_datetime
from pathlib import Path
from supabase import create_client
from dotenv import load_dotenv
from transformers import pipeline

# 1. Setup Environment
env_path = Path('.') / 'my-website' / '.env.local'
load_dotenv(dotenv_path=env_path)

supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_KEY")

if not supabase_url or not supabase_key:
    # Check OS environ for GitHub Actions
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("❌ Error: Missing Supabase Keys.")
    exit()

supabase = create_client(supabase_url, supabase_key)

# 2. Load Local AI Model
print("🧠 Loading AI Model (DistilBERT)...")
classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

def analyze_sentiment(text):
    result = classifier(text)[0]
    label = result['label']
    score = result['score']
    if score < 0.70: # Relaxed slightly to catch more news
        return "NEUTRAL", score
    return label, score

def maintain_per_category_limit(table_name, category_list):
    """
    Ensures EACH category has at least 20 items. 
    Only deletes items if a specific category has > 30 items.
    """
    print(f"   🧹 Maintenance: Checking {table_name}...")
    
    for cat in category_list:
        try:
            # Fetch all items for this specific category
            response = supabase.table(table_name).select("id").eq("category", cat).order("published_at", desc=True).execute()
            rows = response.data
            
            # If we have too many, delete the oldest ones for THIS category only
            if len(rows) > 30:
                ids_to_delete = [row['id'] for row in rows[30:]]
                supabase.table(table_name).delete().in_("id", ids_to_delete).execute()
                print(f"      - {cat}: Cleaned {len(ids_to_delete)} old stories (Kept newest 30).")
            else:
                print(f"      - {cat}: Healthy ({len(rows)} stories).")
                
        except Exception as e:
            print(f"      ⚠️ Error cleaning {cat}: {e}")

def fetch_and_classify_news():
    print("🚀 Backend Starting... Hunting for categorized India news...")
    
    # --- SEARCH CONFIGURATION (Expanded Queries) ---
    
    positive_map = {
        "AI & Innovation": [
            "India AI startup", "India space ISRO launch", "India science breakthrough", "India patent granted",
            "India student invention", "India medical tech", "India drone delivery", "India IIT innovation"
        ],
        "Altruism": [
            "India stranger saves", "India police helps", "India donates organ", "India humanitarian award",
            "India rescues animal", "India kindness viral", "India community kitchen", "India hero driver"
        ],
        "Good Governance": [
            "India sanitation milestone", "India highway complete", "India digital india success", 
            "India village electrified", "India scheme beneficiary", "India corruption crackdown success",
            "India smart city award", "India railway upgrade"
        ],
        "Advocacy": [
            "India high court justice", "India human rights win", "India tribal rights granted", 
            "India environment protection", "India women safety initiative", "India child labour rescue"
        ]
    }

    dark_map = {
        "Dirty Politics": [
            "India politician scam", "India MLA FIR", "India election bribe", "India leader hate speech",
            "India political row", "India vote bank politics", "India party worker clash"
        ],
        "Impunity": [
            "India accused acquitted lack evidence", "India police inaction", "India justice denied", 
            "India powerful accused bail", "India witness hostile", "India case pending years"
        ],
        "Persecution": [
            "India caste violence", "India dalit attack", "India religious intolerance", 
            "India mob lynching", "India activist jailed", "India journalist arrested"
        ],
        "Corruption": [
            "India officer bribe caught", "India raid cash seizure", "India tender scam", 
            "India bank fraud fugitive", "India recruitment scam", "India money laundering ED"
        ],
        "Atrocity": [
            "India gangrape case", "India custodial death", "India acid attack", "India honor killing", 
            "India gruesome murder", "India child abuse ring", "India dowry death"
        ]
    }

    seen_links = set()
    count_positive = 0
    count_harsh = 0

    # Relaxed "Boring Filter" (Removed 'meeting', 'talks' to allow governance news)
    boring_triggers = [
        "sensex", "nifty", "shares", "dividend", "quarterly", "profit",
        "sales", "price", "specification", "review", "box office",
        "cricket", "match", "score", "highlight", "promo", "trailer", "teaser"
    ]

    # --- ENGINE A: POSITIVE HUNT ---
    print("\n🔎 --- FILLING BRIGHT SIDE ---")
    for category, queries in positive_map.items():
        print(f"   Searching: '{category}'...")
        for query in queries:
            encoded_query = urllib.parse.quote(query)
            rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
            feed = feedparser.parse(rss_url)

            # Check TOP 15 to ensure we find enough
            for entry in feed.entries[:15]: 
                title = entry.title
                link = entry.link
                title_lower = title.lower()

                if link in seen_links: continue
                seen_links.add(link)

                if any(word in title_lower for word in boring_triggers): continue

                sentiment, score = analyze_sentiment(title)

                # Accept if POSITIVE OR if it contains key "win" words even if neutral
                if sentiment != "NEGATIVE": 
                    try:
                        existing = supabase.table("positive_news").select("link").eq("link", link).execute()
                        if not existing.data:
                            published_iso = parsedate_to_datetime(entry.published).isoformat()
                            data = {
                                "title": title,
                                "link": link,
                                "source": entry.source.title if 'source' in entry else "Google News",
                                "published_at": published_iso,
                                "category": category
                            }
                            supabase.table("positive_news").insert(data).execute()
                            print(f"      ✨ Added: {title[:40]}...")
                            count_positive += 1
                    except Exception: pass

    # --- ENGINE B: DARK HUNT ---
    print("\n🔎 --- FILLING DARK SIDE ---")
    for category, queries in dark_map.items():
        print(f"   Searching: '{category}'...")
        for query in queries:
            encoded_query = urllib.parse.quote(query)
            rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
            feed = feedparser.parse(rss_url)

            for entry in feed.entries[:15]:
                title = entry.title
                link = entry.link
                title_lower = title.lower()

                if link in seen_links: continue
                seen_links.add(link)

                if any(word in title_lower for word in boring_triggers): continue

                sentiment, score = analyze_sentiment(title)

                if sentiment != "POSITIVE":
                    try:
                        existing = supabase.table("news").select("link").eq("link", link).execute()
                        if not existing.data:
                            published_iso = parsedate_to_datetime(entry.published).isoformat()
                            data = {
                                "title": title,
                                "link": link,
                                "source": entry.source.title if 'source' in entry else "Google News",
                                "published_at": published_iso,
                                "category": category
                            }
                            supabase.table("news").insert(data).execute()
                            print(f"      💀 Added: {title[:40]}...")
                            count_harsh += 1
                    except Exception: pass

    print(f"\n🎉 Finished! Added {count_positive} Positive & {count_harsh} Harsh stories.")
    
    # Run Smart Maintenance
    maintain_per_category_limit("positive_news", positive_map.keys())
    maintain_per_category_limit("news", dark_map.keys())

if __name__ == "__main__":
    fetch_and_classify_news()