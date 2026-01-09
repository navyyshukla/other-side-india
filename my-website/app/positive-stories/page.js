import Link from "next/link";
import { createClient } from '@supabase/supabase-js';

// 1. Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Refresh on every visit
export const revalidate = 0;

export default async function PositiveNews() {
  
// 2. Fetch latest 50 articles
  const { data: articles, error } = await supabase
    .from('positive_news')
    .select('*')
    .order('published_at', { ascending: false }) // <--- CHANGED THIS
    .limit(50);

  if (error) {
    console.error("Error fetching positive news:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-gray-800 font-sans selection:bg-green-200">
      
      {/* Navbar with Glass Effect */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-white/70 backdrop-blur-md border-b border-green-100 flex justify-between items-center transition-all duration-300">
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 tracking-wider">
          THE BRIGHT SIDE
        </h1>
        <Link href="/">
          <button className="px-5 py-2 bg-white border border-green-200 text-green-700 rounded-full hover:bg-green-50 hover:border-green-400 transition-all text-sm font-bold shadow-sm flex items-center gap-2">
            <span>←</span> Home
          </button>
        </Link>
      </nav>

      {/* Hero Header */}
      <div className="pt-32 pb-16 px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-black text-green-900 mb-6 tracking-tight">
          Good News <span className="text-green-500">Only.</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Daily stories of hope, innovation, and humanity from across India.
          <br className="hidden md:block" />
          No politics. No crime. Just progress.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {articles?.map((news, index) => (
            <div 
              key={news.id} 
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out border border-green-50 overflow-hidden flex flex-col"
            >
              
              {/* "JUST ADDED" Badge (Pulse Effect) */}
              {index === 0 && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Just Now
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="p-8 flex-grow flex flex-col">
                {/* Meta Data */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md uppercase tracking-wide">
                    {news.source || "News"}
                  </span>
                  <span className="text-gray-400 text-xs font-medium">
                    • {news.published_at}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors duration-300">
                  {news.title}
                </h3>
              </div>
              
              {/* Card Footer (Button) */}
              <div className="px-8 pb-8 pt-0 mt-auto">
                <a 
                  href={news.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center gap-2 bg-gray-900 text-white font-semibold py-3.5 rounded-xl group-hover:bg-green-600 transition-colors duration-300"
                >
                  Read Full Story
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </a>
              </div>
            </div>
          ))}

        </div>

        {/* Empty State */}
        {(!articles || articles.length === 0) && (
          <div className="text-center py-20 opacity-60">
            <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">Loading fresh stories...</p>
          </div>
        )}
      </div>
    </div>
  );
}