import { createClient } from '@supabase/supabase-js';
import LandingSplit from "./components/LandingSplit"; 
// Note: We don't render ShareButton here directly because LandingSplit handles the UI
// But we need to fetch the correct data for it below.

// 1. Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Prevent caching so we always see the latest headline
export const revalidate = 0;

export default async function Home() {
  
  // 2. Fetch the Single Latest Story from Dark Side
  const { data: harshData } = await supabase
    .from('news')
    .select('*') // CHANGED: Fetch ALL fields (title, source, summary) for the Share Button
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  // 3. Fetch the Single Latest Story from Bright Side
  const { data: brightData } = await supabase
    .from('positive_news')
    .select('*') // CHANGED: Fetch ALL fields here too
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  // 4. Render the interactive UI
  return (
    <LandingSplit 
      latestHarsh={harshData} 
      latestBright={brightData} 
    />
  );
}