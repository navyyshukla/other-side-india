'use client';

import Link from "next/link";
import { useState } from "react";

export default function LandingSplit({ latestHarsh, latestBright }) {
  const [hovered, setHovered] = useState(null); // 'left', 'right', or null

  // Mobile Toggle: Since phones don't "hover", clicking a side expands it
  const handleMobileInteraction = (side) => {
    // If already active, close it (optional). If not, open it.
    if (hovered === side) setHovered(null);
    else setHovered(side);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-white selection:text-black">
      
      {/* =======================
          FIXED HEADER (RESPONSIVE)
         ======================= */}
      <header className="absolute top-0 w-full z-50 flex flex-col items-center py-4 md:py-6 pointer-events-none">
        <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase drop-shadow-2xl text-center px-4 leading-none">
          THE OTHER SIDES OF INDIA
        </h1>
        <div className="mt-2 md:mt-3 px-4 py-1 md:px-6 md:py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full">
          <p className="text-white/90 text-[8px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase">
            TWO WORLDS. ONE NATION.
          </p>
        </div>
      </header>

      {/* =======================
          SPLIT SCREEN CONTAINER
         ======================= */}
      <div className="flex flex-col md:flex-row h-full w-full relative">
        
        {/* --- DARK SIDE (LEFT/TOP) --- */}
        <div 
          onMouseEnter={() => setHovered('left')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleMobileInteraction('left')} // Tap to expand on mobile
          className={`relative transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border-b border-white/10 md:border-b-0 md:border-r overflow-hidden group will-change-[flex] cursor-pointer md:cursor-default ${
            // Mobile Logic: Flex-grow height
            hovered === 'left' ? 'flex-[1.5] md:flex-[1.8]' : hovered === 'right' ? 'flex-[0.5] md:flex-[0.6]' : 'flex-1'
          }`}
        >
          {/* Backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-950"></div>
          <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 transition-transform duration-1000 ${hovered === 'left' ? 'scale-105' : 'scale-100'}`}></div>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>

          {/* ABSOLUTE CONTENT CONTAINER */}
          {/* Mobile: 70% Width | Desktop: 600px Fixed Width */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] md:w-[600px] text-center pointer-events-none z-20">
            
            {/* DEFAULT STATE (Brand Title) */}
            <div className={`transition-all duration-500 transform ${hovered === 'left' ? 'opacity-0 translate-y-4 blur-sm scale-95' : 'opacity-100 translate-y-0 blur-0 scale-100'}`}>
              <div className="inline-block p-2 md:p-3 rounded-full bg-red-600/10 border border-red-500/20 mb-3 md:mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              
              {/* Responsive Text Sizes */}
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-1 md:mb-2 leading-none">
                DARK <span className="text-red-600">SIDE</span>
              </h2>
              <p className="text-red-200/60 font-medium tracking-widest text-[10px] md:text-sm uppercase mb-2 md:mb-4">
                The Silence We Break
              </p>
              
              {/* SUBHEADINGS (Hidden on very small screens to save space) */}
              <div className="hidden md:flex justify-center gap-3 text-[10px] font-bold text-red-500 uppercase tracking-wider opacity-60">
                <span>Dirty Politics</span> • <span>Impunity</span> • <span>Corruption</span> • <span>Atrocity</span>
              </div>
            </div>
          </div>

          {/* HOVER/ACTIVE STATE (News Headline) */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] md:w-[600px] text-center z-30 transition-all duration-500 delay-75 ${hovered === 'left' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3 md:mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span className="text-red-500 font-bold tracking-[0.2em] text-[8px] md:text-[10px] uppercase">Just Exposed</span>
                </div>
                
                {/* Responsive Headline Size */}
                <div className="min-h-[80px] md:min-h-[120px] flex items-center justify-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-3xl font-bold text-white leading-tight line-clamp-3 drop-shadow-lg">
                    "{latestHarsh?.title || "Scanning for reports..."}"
                  </h3>
                </div>

                <Link href="/harsh-realities">
                  <button className="px-5 py-2 md:px-8 md:py-3 bg-red-600 text-white text-xs md:text-base font-bold rounded-full hover:bg-red-500 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.4)] tracking-wide">
                    UNCOVER TRUTH
                  </button>
                </Link>
              </div>
          </div>
        </div>

        {/* --- BRIGHT SIDE (RIGHT/BOTTOM) --- */}
        <div 
          onMouseEnter={() => setHovered('right')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleMobileInteraction('right')}
          className={`relative transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden group will-change-[flex] cursor-pointer md:cursor-default ${
            hovered === 'right' ? 'flex-[1.5] md:flex-[1.8]' : hovered === 'left' ? 'flex-[0.5] md:flex-[0.6]' : 'flex-1'
          }`}
        >
          {/* Backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-black"></div>
          <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 transition-transform duration-1000 ${hovered === 'right' ? 'scale-105' : 'scale-100'}`}></div>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>

          {/* ABSOLUTE CONTENT */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] md:w-[600px] text-center pointer-events-none z-20">
            
            {/* DEFAULT STATE */}
            <div className={`transition-all duration-500 transform ${hovered === 'right' ? 'opacity-0 translate-y-4 blur-sm scale-95' : 'opacity-100 translate-y-0 blur-0 scale-100'}`}>
              <div className="inline-block p-2 md:p-3 rounded-full bg-emerald-500/10 border border-emerald-400/20 mb-3 md:mb-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-1 md:mb-2 leading-none">
                BRIGHT <span className="text-emerald-400">SIDE</span>
              </h2>
              <p className="text-emerald-200/60 font-medium tracking-widest text-[10px] md:text-sm uppercase mb-2 md:mb-4">
                The Future We Build
              </p>

              <div className="hidden md:flex justify-center gap-3 text-[10px] font-bold text-emerald-400 uppercase tracking-wider opacity-60">
                <span>Innovation</span> • <span>Altruism</span> • <span>Governance</span> • <span>Advocacy</span>
              </div>
            </div>
          </div>

          {/* HOVER/ACTIVE STATE */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] md:w-[600px] text-center z-30 transition-all duration-500 delay-75 ${hovered === 'right' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3 md:mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-bold tracking-[0.2em] text-[8px] md:text-[10px] uppercase">Latest Hope</span>
                </div>
                
                <div className="min-h-[80px] md:min-h-[120px] flex items-center justify-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-3xl font-bold text-white leading-tight line-clamp-3 drop-shadow-lg">
                    "{latestBright?.title || "Discovering innovation..."}"
                  </h3>
                </div>

                <Link href="/positive-stories">
                  <button className="px-5 py-2 md:px-8 md:py-3 bg-emerald-500 text-white text-xs md:text-base font-bold rounded-full hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] tracking-wide">
                    ENTER THE LIGHT
                  </button>
                </Link>
              </div>
          </div>
        </div>

      </div>

      {/* =======================
          CENTER BADGE
         ======================= */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${hovered ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 text-white/90 font-bold text-[8px] md:text-xs tracking-[0.2em] px-4 py-2 md:px-5 md:py-3 rounded-full shadow-2xl uppercase whitespace-nowrap">
          Pick Your Reality
        </div>
      </div>

    </main>
  );
}