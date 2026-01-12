import Link from "next/link";
import { createClient } from '@supabase/supabase-js';
import HarshFeed from "./HarshFeed"; // Import the new component

// 1. Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Refresh on every visit
export const revalidate = 0;

export default async function HarshRealities() {
  
  // 2. Fetch latest 100 harsh articles
  const { data: articles, error } = await supabase
    .from('news') // Note: Table name is 'news' for harsh side
    .select('*')
    .order('published_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching harsh news:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 text-gray-100 font-sans selection:bg-red-900 selection:text-white">
      
      {/* Navbar with Dark Glass Effect */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-black/60 backdrop-blur-md border-b border-white/10 flex justify-between items-center transition-all duration-300">
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 tracking-wider uppercase">
          The Dark Side
        </h1>
        <Link href="/">
          <button className="px-5 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-sm font-bold shadow-sm flex items-center gap-2">
            <span>←</span> Home
          </button>
        </Link>
      </nav>

      {/* Hero Header */}
      <div className="pt-32 pb-10 px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Uncovering <span className="text-red-600">The Truth.</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The stories that often go unheard. 
          <br className="hidden md:block" />
          Corruption. Crime. Reality.
        </p>
      </div>

      {/* Interactive Tabs & Grid */}
      <HarshFeed articles={articles || []} />

      <div className="pb-20"></div>
    </div>
  );
}