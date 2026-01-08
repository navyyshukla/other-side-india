import Link from "next/link";
import { createClient } from '@supabase/supabase-js';

// 1. Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Ensure the page refreshes on every visit
export const revalidate = 0;

export default async function PositiveNews() {
  
  // 2. Fetch latest 50 articles from 'positive_news'
  const { data: articles, error } = await supabase
    .from('positive_news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50); // LIMIT TO 50

  if (error) {
    console.error("Error fetching positive news:", error);
  }

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 font-sans">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-green-700 tracking-wider">THE BRIGHT SIDE</h1>
        <Link href="/">
          <button className="px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all text-sm font-semibold">
            ← BACK TO HOME
          </button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-green-800 mb-4">Celebrating the Spirit of India</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stories of unity, progress, and hope.
          </p>
        </header>

        {/* News Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles?.map((news, index) => (
            <div key={news.id} className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col border-t-4 border-green-500">
              
              {/* "JUST ADDED" BADGE (Only for the first item) */}
              {index === 0 && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse z-10 shadow-sm">
                  JUST ADDED
                </span>
              )}

              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase">
                    {news.source || "News"}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {news.published_at}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {news.title}
                </h3>
              </div>
              
              <div className="p-6 pt-0 mt-auto">
                <a 
                  href={news.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  READ FULL STORY
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!articles || articles.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">Loading positive vibes...</p>
          </div>
        )}
      </div>
    </div>
  );
}