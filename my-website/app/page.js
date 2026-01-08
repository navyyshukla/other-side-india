import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      
      {/* Left Side: Harsh Realities */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen bg-black text-white flex flex-col justify-center items-center p-10 transition-all hover:bg-gray-900">
        <h2 className="text-4xl font-bold mb-4 tracking-wider">THE OTHER SIDE</h2>
        <p className="mb-8 text-gray-400 text-center max-w-md">
          Uncover the hidden, often ignored realities of society. 
          Corruption, crime, and systemic issues.
        </p>
        <Link href="/harsh-realities">
          <button className="px-8 py-3 border border-white text-white font-semibold hover:bg-white hover:text-black transition-colors duration-300">
            VIEW HARSH REALITIES
          </button>
        </Link>
      </div>

      {/* Right Side: Positive India */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen bg-white text-black flex flex-col justify-center items-center p-10 transition-all hover:bg-green-50">
        <h2 className="text-4xl font-bold mb-4 tracking-wider text-green-700">THE BRIGHT SIDE</h2>
        <p className="mb-8 text-gray-600 text-center max-w-md">
          Celebrate the heroes, the progress, and the unity. 
          Stories of hope and change.
        </p>
        <Link href="/positive-stories">
          <button className="px-8 py-3 border border-green-700 text-green-700 font-semibold hover:bg-green-700 hover:text-white transition-colors duration-300">
            VIEW POSITIVE INDIA
          </button>
        </Link>
      </div>

    </div>
  );
}