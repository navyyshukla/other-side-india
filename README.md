## The Other Sides of India

> **Two Worlds. One Nation.** > An AI-powered news aggregator that decouples India's news cycle into "Harsh Realities" and "Positive Stories" to provide a balanced, transparent view of the country.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Python%20%7C%20Supabase-blue)
![AI Model](https://img.shields.io/badge/AI-DistilBERT%20%7C%20Hugging%20Face-orange)

## 📖 About The Project

Modern news feeds are chaotic. **The Other Sides of India** solves this by using Artificial Intelligence to analyze news sentiment in real-time.

It scrapes major Indian news sources, processes the text using a **BERT-based Machine Learning model**, and classifies every story into one of two distinct feeds:
1.  **The Dark Reality:** Uncovering corruption, crime, and systemic issues.
2.  **The Bright Future:** Highlighting innovation, altruism, and development.

## ✨ Key Features

* **🧠 AI-Powered Sentiment Analysis:** Uses a custom-tuned `DistilBERT` model to classify news with high accuracy.
* **⚖️ Dual-Perspective Interface:** A "Flip" mechanism to switch between dark and bright themes instantly.
* **📸 Share as Image:** Integrated `html-to-image` generation allows users to instantly create and share Instagram-ready news cards.
* **🤖 Automated Pipelines:** A Python scraper runs automatically via GitHub Actions to fetch and categorize news every 6 hours.
* **📱 Responsive Design:** Built with Tailwind CSS for a flawless experience on mobile and desktop.

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS
* **Library:** React.js
* **Image Gen:** html-to-image

### **Backend & AI**
* **Database:** Supabase (PostgreSQL)
* **Language:** Python 3.9+
* **ML Libraries:** PyTorch, Transformers (Hugging Face)
* **Automation:** GitHub Actions (Cron Jobs)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/navyyshukla/other-side-india.git](https://github.com/navyyshukla/other-side-india.git)
cd other-side-india
```
### 2. Setup the Frontend
Navigate to the website directory and install dependencies:

```bash
cd my-website
npm install
```

Create a .env.local file in the my-website/ folder and add your Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Run the development server:
```bash
npm run dev
Open http://localhost:3000 to see the site.
```

### 3. Setup the AI Scraper (Backend)
If you want to run the news scraper manually:

```bash
# Go back to the root folder
cd ..

# Install Python dependencies
pip install -r requirements.txt

# Run the scraper
python ai_scraper.py
(Note: You need a .env file in the root with SUPABASE_URL and SUPABASE_KEY for the Python script to write to the DB).
```

📂 Project Structure
```bash
Plaintext
├── .github/workflows   # Automation scripts (Cron jobs)
├── my-website/         # Next.js Frontend
│   ├── app/            # App Router (Pages & Logic)
│   ├── components/     # Reusable UI (ShareButton, etc.)
│   └── public/         # Static assets
├── ai_scraper.py       # Python Script for Scraping & AI
└── requirements.txt    # Python Dependencies
```

# 🤖 How the AI Works
1. **Fetch:** The system pulls RSS feeds from major outlets (Times of India, The Hindu, NDTV).

2. **Clean:** HTML tags and noise are removed.

3. **Analyze:** The text is passed through distilbert-base-uncased-finetuned-sst-2-english.

4. **Classify:**

 - Negative Sentiment → Categorized into "Corruption", "Crime", etc.

 - Positive Sentiment → Categorized into "Innovation", "Growth", etc.

5. **Store:** Data is upserted into Supabase for the frontend to render.

# 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request.

**Fork the Project**

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.
