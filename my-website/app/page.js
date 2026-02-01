import { createClient } from '@supabase/supabase-js';
import LandingSplit from "./components/LandingSplit"; 

// 1. Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Prevent caching so the score is always live
export const revalidate = 0;

export default async function Home() {
  
  // Calculate 24h threshold
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateThreshold = yesterday.toISOString();

  // --- PARALLEL DATA FETCHING ---
  const [harshRes, brightRes, darkStats, brightStats, sentimentRes] = await Promise.all([
    // A. Latest Dark Story
    supabase.from('news').select('*').order('published_at', { ascending: false }).limit(1).single(),

    // B. Latest Bright Story
    supabase.from('positive_news').select('*').order('published_at', { ascending: false }).limit(1).single(),

    // C. COUNT Dark stories from last 24h
    supabase.from('news').select('*', { count: 'exact', head: true }).gte('published_at', dateThreshold),

    // D. COUNT Bright stories from last 24h
    supabase.from('positive_news').select('*', { count: 'exact', head: true }).gte('published_at', dateThreshold),

    // E. NEW: Fetch Today's Sentiment Votes
    supabase
      .from('sentiment_votes')
      .select('*')
      .eq('date', new Date().toISOString().split('T')[0]) 
      .single()
  ]);

  // Extract Vote Data (Safe fallback if no votes yet)
  const votes = sentimentRes.data || { grim_count: 0, hopeful_count: 0 };

  // 4. Render UI
  return (
    <LandingSplit 
      latestHarsh={harshRes.data} 
      latestBright={brightRes.data}
      stats={{ 
        dark: darkStats.count || 0, 
        bright: brightStats.count || 0,
        votes: { grim: votes.grim_count, hopeful: votes.hopeful_count } // <--- Passing votes here
      }} 
    />
  );
}