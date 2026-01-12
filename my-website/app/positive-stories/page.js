import Link from "next/link";
import { createClient } from '@supabase/supabase-js';
import PositiveFeed from "./PositiveFeed"; // Import the new component

// 1. Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Refresh on every visit
export const revalidate = 0;

export default async function PositiveStories() {
  
  // 2. Fetch latest 100 articles (We fetch more now to fill the tabs)
  const { data: articles, error } = await supabase
    .from('positive_news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(100);

  if (error) console.error("Error fetching positive news:", error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-black text-white font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-wider uppercase">
          The Other Side
        </h1>
        <Link href="/">
          <button className="px-5 py-2 bg-white/5 border border-white/10 text-emerald-100 rounded-full hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all text-sm font-bold flex items-center gap-2">
            <span>←</span> Home
          </button>
        </Link>
      </nav>

      {/* Hero Header */}
      <div className="pt-32 pb-10 px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
          The <span className="text-emerald-400">Bright Side</span> of India.
        </h2>
        <p className="text-lg md:text-xl text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
          Real progress. Real heroes. Real change.
        </p>
      </div>

      {/* Interactive Tabs & Grid */}
      <PositiveFeed articles={articles || []} />

      <div className="pb-20"></div>
    </div>
  );
}