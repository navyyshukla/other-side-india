## The Other Sides of India

> **"Two Worlds. One Nation."**

A dual-perspective news aggregation platform that uncovers the hidden realities of India. It uses AI to autonomously scrape, classify, and present news in two contrasting dimensions:
* **The Dark Side:** Corruption, Impunity, Persecution, Atrocity.
* **The Bright Side:** Innovation, Altruism, Good Governance, Advocacy.

---

## 🚀 Features

* **Dual-Engine AI Scraper:** A Python-based scraper (DistilBERT) that hunts for specific "Dark" and "Bright" keywords across 100+ sub-topics.
* **Smart Classification:** Automatically tags news into specific buckets like *Dirty Politics* or *AI & Innovation*.
* **Interactive Split-Screen Home:** A responsive, animation-rich landing page that lets users "choose their reality."
* **Hero News Cards:** The latest impactful story in every category is highlighted as a massive "Hero Card."
* **Automated Updates:** A GitHub Actions robot runs every 3 hours to fetch fresh news without human intervention.
* **Mobile Optimized:** Fully responsive design with touch-friendly interactions and adaptive layouts.

---

## 🛠️ Tech Stack

* **Frontend:** [Next.js 14](https://nextjs.org/) (App Router), React, Tailwind CSS
* **Backend / Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **AI & Logic:** Python, Hugging Face Transformers (DistilBERT), Feedparser
* **Automation:** GitHub Actions (Cron Job)

---

## 📂 Project Structure

```bash
├── app/
│   ├── components/       # Shared UI components (LandingSplit.js)
│   ├── harsh-realities/  # The "Dark Side" page & feed logic
│   ├── positive-stories/ # The "Bright Side" page & feed logic
│   └── page.js           # Main Entry Point
├── ai_scraper.py         # The Python Brain (Scraper + Classifier)
├── requirements.txt      # Python dependencies (Lightweight CPU versions)
└── .github/workflows/    # Automation scripts

⚡ Getting Started

1. Clone the Repository

git clone [https://github.com/your-username/other-side-india.git](https://github.com/your-username/other-side-india.git)
cd other-side-india

2. Install Frontend Dependencies

npm install

3. Set Up Environment Variables

Create a .env.local file in the root directory:

Code snippet

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key

4. Run the Development Server

npm run dev
Open https://other-side-india.vercel.app/ to see the site.

🧠 The AI Scraper
The heart of this project is ai_scraper.py. It does not just "read news"; it understands it.

Deep Search: It queries Google News for specific combinations like "India bureaucracy reform" or "India caste violence".

Sentiment Analysis: It uses a local DistilBERT model to check the emotional tone of the headline.

Keyword Validation: It cross-references the AI's opinion with a strict list of "High Impact" keywords (e.g., rescue, scam, murder, breakthrough).

Categorization: It sorts the approved story into one of 9 specific database categories.

Clean Up: It automatically deletes old news to keep the database fresh and fast.

To run the scraper manually:

Bash

pip install -r requirements.txt
python ai_scraper.py
🤖 Automation (GitHub Actions)
The site updates itself automatically.

Schedule: Runs every 3 hours.

Workflow: .github/workflows/update_news.yml

Process: 1. Boots up a virtual machine. 2. Installs lightweight AI tools (CPU-only PyTorch). 3. Runs the scraper. 4. Pushes new data to Supabase.

🔮 Future Roadmap
[ ] Regional Filter: Allow users to filter news by State (e.g., "Show me Kerala").

[ ] Impact Score: Let users vote on how "impactful" a story is.

[ ] Newsletter: Auto-generate a weekly email summary of the top Dark vs. Bright stories.

📄 License
This project is open-source and available under the MIT License.](https://other-side-india.vercel.app/)
