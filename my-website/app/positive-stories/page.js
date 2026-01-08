import Link from "next/link";

export default function PositiveNews() {
  return (
    <div className="min-h-screen bg-green-50 text-gray-800 p-8 font-sans">
      <nav className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-green-700">THE BRIGHT SIDE</h1>
        <Link href="/" className="text-green-600 hover:underline">
          Back to Home
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-6">Celebrating the Spirit of India</h2>
        <p className="text-lg mb-8">
          Stories of hope, unity, and progress. Coming soon...
        </p>
        
        {/* We will add the API integration here later */}
        <div className="grid gap-6 md:grid-cols-2">
           <div className="p-6 bg-white rounded-lg shadow-md">
             <h3 className="font-bold text-xl mb-2">Sample Positive Story</h3>
             <p>This is where the good news will appear.</p>
           </div>
        </div>
      </div>
    </div>
  );
}