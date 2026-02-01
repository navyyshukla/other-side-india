import { createClient } from '@supabase/supabase-js';
import LandingSplit from "./components/LandingSplit"; 

// 1. Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Prevent caching so the score is always live
export const revalidate = 0;

export default async function Home() {
  
  // Calculate the timestamp for 24 hours ago
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateThreshold = yesterday.toISOString();

  // --- PARALLEL DATA FETCHING ---
  // We use Promise.all to fetch everything at once for speed
  const [harshRes, brightRes, darkStats, brightStats] = await Promise.all([
    // A. Latest Dark Story
    supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(1)
      .single(),

    // B. Latest Bright Story
    supabase
      .from('positive_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(1)
      .single(),

    // C. COUNT Dark stories from last 24h
    supabase
      .from('news')
      .select('*', { count: 'exact', head: true }) // 'head: true' means don't fetch data, just count
      .gte('published_at', dateThreshold),

    // D. COUNT Bright stories from last 24h
    supabase
      .from('positive_news')
      .select('*', { count: 'exact', head: true })
      .gte('published_at', dateThreshold)
  ]);

  // Extract data
  const harshData = harshRes.data;
  const brightData = brightRes.data;
  
  // Handle stats (default to 1 if empty to avoid division by zero errors)
  const darkCount = darkStats.count || 0;
  const brightCount = brightStats.count || 0;

  // 4. Render UI
  return (
    <LandingSplit 
      latestHarsh={harshData} 
      latestBright={brightData}
      stats={{ dark: darkCount, bright: brightCount }} // <--- Passing the new stats
    />
  );
}