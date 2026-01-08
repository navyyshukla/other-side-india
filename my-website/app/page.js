import Link from "next/link";
import { createClient } from '@supabase/supabase-js';

// 1. Connect to Supabase to fetch snippets
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Refresh data on every visit
export const revalidate = 0;

export default async function Home() {
  
  // 2. Fetch the ONE latest headline for each side
  const { data: harshNews } = await supabase
    .from('news') // Change to 'harsh_news' if that's your table name
    .select('title')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: positiveNews } = await supabase
    .from('positive_news')
    .select('title')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* LEFT SIDE: HARSH REALITIES */}
      {/* 'group' allows us to style children when hovering the parent */}
      <div className="group relative w-full md:w-1/2 h-[50vh] md:h-screen bg-black text-white flex flex-col justify-center items-center p-10 transition-all duration-700 ease-in-out hover:md:w-[65%] hover:z-10 border-r border-gray-800">
        
        {/* Background Image Effect (Optional - purely CSS gradient here) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-5xl font-extrabold mb-2 tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-gray-100 to-gray-500 group-hover:scale-110 transition-transform duration-500">
            The Other Side
          </h2>
          <p className="mb-8 text-gray-400 max-w-sm text-sm tracking-widest uppercase">
            The Unheard Reality
          </p>
          
          {/* Latest Snippet Display */}
          <div className="mb-8 p-4 bg-gray-900/80 border border-red-900/30 rounded-lg max-w-sm backdrop-blur-sm transform translate-y-4 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
              Latest Report
            </span>
            <p className="text-sm text-gray-300 italic line-clamp-2 mt-1">
              "{harshNews?.title || "Loading latest report..."}"
            </p>
          </div>

          <Link href="/harsh-realities">
            <button className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold tracking-widest hover:bg-white hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              ENTER DARKNESS
            </button>
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: POSITIVE INDIA */}
      <div className="group relative w-full md:w-1/2 h-[50vh] md:h-screen bg-white text-black flex flex-col justify-center items-center p-10 transition-all duration-700 ease-in-out hover:md:w-[65%] hover:z-10">
        
        {/* Subtle Green Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-50 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-5xl font-extrabold mb-2 tracking-tighter uppercase text-green-800 group-hover:scale-110 transition-transform duration-500">
            The Bright Side
          </h2>
          <p className="mb-8 text-green-600 max-w-sm text-sm tracking-widest uppercase">
            Hope & Progress
          </p>

          {/* Latest Snippet Display */}
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg max-w-sm transform translate-y-4 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
             <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
              Just Happened
            </span>
            <p className="text-sm text-gray-600 italic line-clamp-2 mt-1">
              "{positiveNews?.title || "Loading positive story..."}"
            </p>
          </div>

          <Link href="/positive-stories">
            <button className="px-10 py-4 bg-transparent border-2 border-green-700 text-green-700 font-bold tracking-widest hover:bg-green-700 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(21,128,61,0.4)]">
              ENTER LIGHT
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}