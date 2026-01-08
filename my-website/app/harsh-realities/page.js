import Link from "next/link";
import { createClient } from '@supabase/supabase-js';

// 1. Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Refresh on every visit
export const revalidate = 0;

export default async function HarshRealities() {
  
  // 2. Fetch latest 50 articles from the 'news' table
  const { data: articles, error } = await supabase
    .from('news') 
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching harsh news:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 text-gray-100 font-sans selection:bg-red-900 selection:text-white">
      
      {/* Navbar with Dark Glass Effect */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-black/60 backdrop-blur-md border-b border-white/10 flex justify-between items-center transition-all duration-300">
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 tracking-wider uppercase">
          The Other Side
        </h1>
        <Link href="/">
          <button className="px-5 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-sm font-bold shadow-sm flex items-center gap-2">
            <span>←</span> Home
          </button>
        </Link>
      </nav>

      {/* Hero Header */}
      <div className="pt-32 pb-16 px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Uncovering <span className="text-red-600">The Truth.</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The stories that often go unheard. 
          <br className="hidden md:block" />
          Corruption. Crime. Reality.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {articles?.map((news, index) => (
            <div 
              key={news.id} 
              className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/5 hover:border-red-500/50 hover:shadow-red-900/20 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden flex flex-col"
            >
              
              {/* "JUST REPORTED" Badge (Red Pulse) */}
              {index === 0 && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <span className="bg-red-950/80 border border-red-900 text-red-400 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Just Reported
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="p-8 flex-grow flex flex-col">
                {/* Meta Data */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-red-900/20 border border-red-900/30 text-red-400 text-xs font-bold rounded-md uppercase tracking-wide">
                    {news.source || "Report"}
                  </span>
                  <span className="text-gray-500 text-xs font-medium">
                    • {news.published_at}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-100 leading-snug group-hover:text-red-500 transition-colors duration-300">
                  {news.title}
                </h3>
              </div>
              
              {/* Card Footer (Button) */}
              <div className="px-8 pb-8 pt-0 mt-auto">
                <a 
                  href={news.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center gap-2 bg-white/5 text-gray-300 font-semibold py-3.5 rounded-xl border border-white/5 group-hover:bg-red-700 group-hover:text-white group-hover:border-red-700 transition-all duration-300"
                >
                  Read Full Report
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
          <div className="text-center py-20 opacity-50">
            <div className="inline-block p-4 rounded-full bg-gray-800 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-medium">Scanning for reports...</p>
          </div>
        )}
      </div>
    </div>
  );
}