import { createClient } from '@supabase/supabase-js';

// 1. Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// This ensures the page refreshes with new data every time someone visits
export const revalidate = 0;

export default async function Home() {
  // 2. Fetch the news from your database
  const { data: articles, error } = await supabase
    .from('news')
    .select('*')
    .order('id', { ascending: false }); // Show newest first

  if (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* --- HEADER --- */}
      <header className="bg-red-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tighter uppercase">
            The Other Side of India
          </h1>
          <nav className="hidden md:flex space-x-6 text-sm font-semibold uppercase">
            <a href="#" className="hover:text-red-200">Caste Reality</a>
            <a href="#" className="hover:text-red-200">Women's Safety</a>
            <a href="#" className="hover:text-red-200">Corruption</a>
            <a href="#" className="hover:text-red-200">Legal Loopholes</a>
          </nav>
        </div>
      </header>

      {/* --- MAIN NEWS GRID --- */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="mb-8 border-l-4 border-red-700 pl-4">
          <h2 className="text-xl font-bold uppercase text-gray-700">Latest Reports</h2>
          <p className="text-sm text-gray-500">Uncovering the stories that go unheard.</p>
        </div>

        {/* If no articles found */}
        {(!articles || articles.length === 0) && (
          <div className="text-center py-20 text-gray-500">
            <p>No reports filed yet. Run the Python script to fetch news.</p>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles && articles.map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase">
                    {article.source || 'News Report'}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {article.date || 'Just Now'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold leading-tight mb-3 text-gray-900">
                  {article.title}
                </h3>
              </div>

              <div className="px-6 pb-6 mt-auto">
                <a 
                  href={article.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-gray-900 text-white font-bold py-2 text-sm hover:bg-red-700 transition-colors"
                >
                  READ ORIGINAL REPORT
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} The Other Side of India. All rights reserved.</p>
          <p className="text-xs mt-2 text-gray-600">This is an automated aggregation project.</p>
        </div>
      </footer>
    </div>
  );
}