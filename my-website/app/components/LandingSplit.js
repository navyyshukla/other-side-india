'use client';

import ShareButton from './ShareButton';
import Link from "next/link";
import { useState, useEffect } from "react";
// We use '../actions' because your file is named actions.js
import { submitVote } from '../actions'; 

export default function LandingSplit({ latestHarsh, latestBright, stats }) {
  const [hovered, setHovered] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(stats?.votes || { grim: 0, hopeful: 0 });

  // Check LocalStorage on mount
  useEffect(() => {
    const votedDate = localStorage.getItem('voted_date');
    const today = new Date().toISOString().split('T')[0];
    if (votedDate === today) setHasVoted(true);
  }, []);

  // --- CALCULATION LOGIC ---
  const mediaTotal = (stats?.dark || 0) + (stats?.bright || 0);
  const mediaSafeTotal = mediaTotal === 0 ? 1 : mediaTotal;
  const mediaGrimPct = Math.round(((stats?.dark || 0) / mediaSafeTotal) * 100);
  const mediaHopePct = 100 - mediaGrimPct;

  const voteTotal = (localVotes.grim || 0) + (localVotes.hopeful || 0);
  const voteSafeTotal = voteTotal === 0 ? 1 : voteTotal;
  const voteGrimPct = Math.round(((localVotes.grim || 0) / voteSafeTotal) * 100);
  const voteHopePct = 100 - voteGrimPct;

  // --- HANDLERS ---
  const handleVote = async (type) => {
    if (hasVoted) return;
    setLocalVotes(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setHasVoted(true);
    localStorage.setItem('voted_date', new Date().toISOString().split('T')[0]);
    await submitVote(type);
  };

  const handleMobileInteraction = (side) => {
    if (hovered === side) setHovered(null);
    else setHovered(side);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-white selection:text-black">
      
      {/* HEADER */}
      <header className="absolute top-0 w-full z-50 flex flex-col items-center py-4 md:py-6 pointer-events-auto">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase drop-shadow-2xl text-center px-4 leading-none pointer-events-none">
          THE OTHER SIDES OF INDIA
        </h1>
        
        {/* --- STATS DASHBOARD (High Visibility Version) --- */}
        <div className="mt-6 flex flex-col gap-4 w-full max-w-[320px] md:max-w-[420px] bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl transition-all duration-500 hover:bg-black/80">
          
          {/* 1. MEDIA REALITY BAR */}
          <div className="flex flex-col gap-2 w-full opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Media Reports
              </span>
              <span>Last 24h</span>
            </div>
            {/* Taller Bar (h-4) with TEXT OVERLAY */}
            <div className="relative h-4 w-full bg-gray-800 rounded-lg overflow-hidden border border-white/10 shadow-inner">
               {/* Red Bar */}
               <div className="absolute left-0 h-full bg-gradient-to-r from-red-700 to-red-500 flex items-center pl-2" style={{ width: `${mediaGrimPct}%` }}>
                 {mediaGrimPct > 10 && <span className="text-[9px] font-black text-white drop-shadow-md">{mediaGrimPct}%</span>}
               </div>
               
               {/* Green Bar */}
               <div className="absolute right-0 h-full bg-gradient-to-l from-emerald-700 to-emerald-500 flex items-center justify-end pr-2" style={{ width: `${mediaHopePct}%` }}>
                 {mediaHopePct > 10 && <span className="text-[9px] font-black text-black drop-shadow-md">{mediaHopePct}%</span>}
               </div>
            </div>
          </div>

          {/* 2. COMMUNITY PULSE */}
          <div className="flex flex-col gap-2 w-full border-t border-white/10 pt-3">
            <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/90">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Public Mood
              </span>
              {hasVoted ? <span>{voteTotal} Votes</span> : <span className="text-yellow-400 animate-pulse">Your Turn</span>}
            </div>

            {hasVoted ? (
              // RESULT BAR (Taller)
              <div className="relative h-4 w-full bg-gray-800 rounded-lg overflow-hidden border border-white/10 shadow-inner">
                 <div className="absolute left-0 h-full bg-red-500/80 flex items-center pl-2" style={{ width: `${voteGrimPct}%` }}>
                    {voteGrimPct > 10 && <span className="text-[9px] font-black text-white drop-shadow-md">{voteGrimPct}%</span>}
                 </div>
                 <div className="absolute right-0 h-full bg-emerald-400/80 flex items-center justify-end pr-2" style={{ width: `${voteHopePct}%` }}>
                    {voteHopePct > 10 && <span className="text-[9px] font-black text-black drop-shadow-md">{voteHopePct}%</span>}
                 </div>
              </div>
            ) : (
              // VOTING BUTTONS (Bigger & Clearer)
              <div className="flex gap-3 h-10">
                <button 
                  onClick={() => handleVote('grim')}
                  className="flex-1 bg-red-950/50 hover:bg-red-600 border border-red-500/30 hover:border-red-400 rounded-lg text-[10px] md:text-xs font-bold text-red-200 hover:text-white uppercase transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span className="group-hover:scale-125 transition-transform">👎</span> Grim
                </button>
                <button 
                  onClick={() => handleVote('hopeful')}
                  className="flex-1 bg-emerald-950/50 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-400 rounded-lg text-[10px] md:text-xs font-bold text-emerald-200 hover:text-white uppercase transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span className="group-hover:scale-125 transition-transform">👍</span> Hopeful
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* =======================
          SPLIT SCREEN CONTAINER
         ======================= */}
      <div className="flex flex-col md:flex-row h-full w-full relative">
        
        {/* --- DARK SIDE --- */}
        <div 
          onMouseEnter={() => setHovered('left')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleMobileInteraction('left')}
          className={`relative transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border-b border-white/10 md:border-b-0 md:border-r overflow-hidden group will-change-[flex] cursor-pointer md:cursor-default ${
            hovered === 'left' ? 'flex-[1.5] md:flex-[1.8]' : hovered === 'right' ? 'flex-[0.5] md:flex-[0.6]' : 'flex-1'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-950"></div>
          <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 transition-transform duration-1000 ${hovered === 'left' ? 'scale-105' : 'scale-100'}`}></div>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] md:w-[600px] text-center pointer-events-none z-20">
            <div className={`transition-all duration-500 transform ${hovered === 'left' ? 'opacity-0 translate-y-4 blur-sm scale-95' : 'opacity-100 translate-y-0 blur-0 scale-100'}`}>
              <div className="inline-block p-2 md:p-3 rounded-full bg-red-600/10 border border-red-500/20 mb-3 md:mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-1 md:mb-2 leading-none">
                DARK <span className="text-red-600">SIDE</span>
              </h2>
              <p className="text-red-200/60 font-medium tracking-widest text-[10px] md:text-sm uppercase mb-2 md:mb-4">
                The Silence We Break
              </p>
              <div className="hidden md:flex justify-center gap-3 text-[10px] font-bold text-red-500 uppercase tracking-wider opacity-60">
                <span>Dirty Politics</span> • <span>Impunity</span> • <span>Corruption</span> • <span>Atrocity</span>
              </div>
            </div>
          </div>

          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] md:w-[600px] text-center z-30 transition-all duration-500 delay-75 ${hovered === 'left' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3 md:mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span className="text-red-500 font-bold tracking-[0.2em] text-[8px] md:text-[10px] uppercase">Just Exposed</span>
                </div>
                
                <div className="min-h-[80px] md:min-h-[120px] flex items-center justify-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-3xl font-bold text-white leading-tight line-clamp-3 drop-shadow-lg">
                    "{latestHarsh?.title || "Scanning for reports..."}"
                  </h3>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Link href="/harsh-realities">
                    <button className="px-5 py-2 md:px-8 md:py-3 bg-red-600 text-white text-xs md:text-base font-bold rounded-full hover:bg-red-500 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.4)] tracking-wide whitespace-nowrap">
                      UNCOVER THE TRUTH
                    </button>
                  </Link>
                  <ShareButton 
                    title={latestHarsh?.title || "Dark Reality"} 
                    category="Reality" 
                    source={latestHarsh?.source || "The Other Side"} 
                    side="dark" 
                  />
                </div>
              </div>
          </div>
        </div>

        {/* --- BRIGHT SIDE --- */}
        <div 
          onMouseEnter={() => setHovered('right')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleMobileInteraction('right')}
          className={`relative transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden group will-change-[flex] cursor-pointer md:cursor-default ${
            hovered === 'right' ? 'flex-[1.5] md:flex-[1.8]' : hovered === 'left' ? 'flex-[0.5] md:flex-[0.6]' : 'flex-1'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-black"></div>
          <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 transition-transform duration-1000 ${hovered === 'right' ? 'scale-105' : 'scale-100'}`}></div>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] md:w-[600px] text-center pointer-events-none z-20">
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

          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] md:w-[600px] text-center z-30 transition-all duration-500 delay-75 ${hovered === 'right' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
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

                <div className="flex items-center justify-center gap-4">
                  <Link href="/positive-stories">
                    <button className="px-5 py-2 md:px-8 md:py-3 bg-emerald-500 text-white text-xs md:text-base font-bold rounded-full hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] tracking-wide whitespace-nowrap">
                      ENTER THE LIGHT
                    </button>
                  </Link>
                  <ShareButton 
                    title={latestBright?.title || "Bright Future"} 
                    category="Hope" 
                    source={latestBright?.source || "The Other Side"} 
                    side="bright" 
                  />
                </div>
              </div>
          </div>
        </div>

        {/* --- CENTER BADGE --- */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${hovered ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 text-white/90 font-bold text-[8px] md:text-xs tracking-[0.2em] px-4 py-2 md:px-5 md:py-3 rounded-full shadow-2xl uppercase whitespace-nowrap">
            Pick Your Reality
          </div>
        </div>
      </div>    
    </main>
  );
}