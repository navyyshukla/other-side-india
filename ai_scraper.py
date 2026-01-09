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
    # Higher confidence required
    if score < 0.85:
        return "NEUTRAL", score
    return label, score

def maintain_limit(table_name):
    try:
        response = supabase.table(table_name).select("id").order("published_at", desc=True).execute()
        all_rows = response.data
        if len(all_rows) > 50:
            ids_to_delete = [row['id'] for row in all_rows[50:]]
            supabase.table(table_name).delete().in_("id", ids_to_delete).execute()
            print(f"   🧹 Cleaned {table_name}: Removed {len(ids_to_delete)} old stories.")
    except Exception as e:
        print(f"   ⚠️ Maintenance Error: {e}")

def fetch_and_classify_news():
    print("🚀 Deep Scraper Starting... Scanning 10+ topics for HIGH IMPACT news...")
    
    # We search specifically for these topics to get ~1000 candidate articles
    search_topics = [
        "India social issues", "India crime", "India human rights", "India tragedy",
        "India environment crisis", "India scams", "India rescue", "India inspiring",
        "India innovation social", "India rural success", "India heroism"
    ]
    
    # Store links we've seen to avoid duplicates across topics
    seen_links = set()
    
    count_positive = 0
    count_harsh = 0

    # STRICT "NO NOISE" FILTER
    # Removes politics, business, sports, and celebrity gossip.
    boring_triggers = [
        "market", "sensex", "nifty", "shares", "stock", "dividend", "quarterly", "profit",
        "sales", "price", "launch", "car", "phone", "specification", "review",
        "meeting", "talks", "visit", "schedule", "announce", "unveil", "remark",
        "forecast", "weather", "rain", "heatwave", "update", "likely", "expect",
        "poll", "vote", "election", "campaign", "seat", "candidate", "bjp", "congress", "party",
        "cricket", "match", "score", "highlight", "promo", "trailer", "teaser", "actor",
        "slam", "claim", "allege", "modi", "gandhi", "minister", "govt", "official"
    ]

    # HIGH IMPACT ONLY
    harsh_triggers = [
        "murder", "rape", "assault", "killed", "dead", "death", "suicide", 
        "scam", "fraud", "corruption", "bribe", "trapped", "starvation",
        "crisis", "collapse", "disaster", "tragedy", "horror", "shocking",
        "protest", "riot", "clash", "violence", "mob", "attack", "threat",
        "pollution", "toxic", "poison", "poverty", "betrayal", "victim", "drowning"
    ]
    
    positive_triggers = [
        "rescue", "save", "alive", "survive", "miracle", "hero", "brave",
        "reunite", "found", "cure", "heal", "transform", "change life",
        "donate", "gift", "charity", "kindness", "help", "support",
        "breakthrough", "innovation", "student creates", "farmer success",
        "honest", "integrity", "harmony", "unity", "peace", "love", "dream"
    ]

    # LOOP THROUGH TOPICS
    for topic in search_topics:
        # Check if we have enough stories
        if count_positive >= 25 and count_harsh >= 25:
            break

        print(f"\n🔎 Scanning Topic: '{topic}'...")
        encoded_query = urllib.parse.quote(topic)
        rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
        feed = feedparser.parse(rss_url)

        for entry in feed.entries:
            title = entry.title
            link = entry.link
            title_lower = title.lower()
            
            # Deduplication
            if link in seen_links:
                continue
            seen_links.add(link)

            try:
                published_dt = parsedate_to_datetime(entry.published)
                published_iso = published_dt.isoformat()
            except:
                continue

            # 1. BORING CHECK (Strict)
            if any(word in title_lower for word in boring_triggers):
                continue

            # 2. AI Sentiment Analysis
            sentiment, score = analyze_sentiment(title)
            target_table = None
            
            # 3. HARSH LOGIC
            if sentiment == "NEGATIVE":
                if any(word in title_lower for word in harsh_triggers):
                    target_table = "news"
                    print(f"   💀 HARSH: {title[:60]}...")
                    count_harsh += 1

            # 4. POSITIVE LOGIC
            elif not any(word in title_lower for word in harsh_triggers):
                if any(word in title_lower for word in positive_triggers):
                    target_table = "positive_news"
                    print(f"   💖 WHOLESOME: {title[:60]}...")
                    count_positive += 1
                
                # If AI is super confident (95%+) and passed boring check
                elif sentiment == "POSITIVE" and score > 0.95:
                    target_table = "positive_news"
                    print(f"   ✨ BRIGHT: {title[:60]}...")
                    count_positive += 1

            # SAVE TO DB
            if target_table:
                try:
                    existing = supabase.table(target_table).select("link").eq("link", link).execute()
                    if not existing.data:
                        data = {
                            "title": title,
                            "link": link,
                            "source": entry.source.title if 'source' in entry else "Google News",
                            "published_at": published_iso
                        }
                        supabase.table(target_table).insert(data).execute()
                except Exception as e:
                    pass

    print(f"\n🎉 Finished! Added {count_positive} Wholesome & {count_harsh} Harsh stories.")
    
    maintain_limit("positive_news")
    maintain_limit("news")

if __name__ == "__main__":
    fetch_and_classify_news()