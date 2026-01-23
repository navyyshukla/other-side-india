'use client';

import { useState } from 'react';
import ShareButton from '../components/ShareButton';

export default function PositiveFeed({ articles }) {
  const [activeTab, setActiveTab] = useState('All');

  // The 4 Tabs + 'All'
  const tabs = [
    { id: 'All', label: 'All Stories' },
    { id: 'AI & Innovation', label: 'AI & Innovation' },
    { id: 'Altruism', label: 'Altruism' },
    { id: 'Good Governance', label: 'Good Governance' },
    { id: 'Advocacy', label: 'Advocacy' },
  ];

  // Filter logic
  const filteredArticles = activeTab === 'All' 
    ? articles 
    : articles.filter(news => news.category === activeTab);

  // Logic to separate the Hero story from the rest
  const heroStory = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridStories = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      
      {/* --- TAB NAVIGATION BAR --- */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 border-b border-green-800/30 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 scale-105'
                : 'bg-emerald-900/20 text-emerald-200 hover:bg-emerald-800/40 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- HERO SECTION (Only if stories exist) --- */}
      {heroStory && (
        <div className="mb-16 animate-fade-in-up">
          <div className="relative group w-full bg-gradient-to-r from-emerald-950/80 to-black border border-emerald-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] hover:shadow-[0_0_80px_rgba(16,185,129,0.3)] transition-all duration-500">
            
            <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
               </svg>
            </div>

            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-black tracking-widest text-xs uppercase">LATEST HOPE</span>
                  {/* FIXED DATE FORMAT HERE */}
                  <span className="text-emerald-200/50 text-xs">| {new Date(heroStory.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 group-hover:text-emerald-400 transition-colors duration-300">
                  {heroStory.title}
                </h2>
                
                <div className="flex flex-wrap gap-3 mb-8">
                   <span className="px-4 py-1.5 bg-emerald-900/30 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-full uppercase">
                      {heroStory.category || 'General'}
                   </span>
                   <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-emerald-100/60 text-xs font-bold rounded-full uppercase">
                      {heroStory.source}
                   </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a 
                    href={heroStory.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-900/50"
                  >
                    READ INSPIRING STORY
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>

                  <ShareButton 
                    title={heroStory.title} 
                    category={heroStory.category} 
                    source={heroStory.source} 
                    side="bright" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- GRID SECTION (Remaining Stories) --- */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {gridStories?.map((news) => (
          <div 
            key={news.id} 
            className="group relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col overflow-hidden"
          >
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                  {news.category || 'Story'}
                </span>
                {/* FIXED DATE FORMAT HERE */}
                <span className="text-emerald-100/40 text-xs font-medium">
                  {new Date(news.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors duration-300 line-clamp-4">
                {news.title}
              </h3>
            </div>
            
            <div className="px-8 pb-8 pt-0 mt-auto flex gap-3 items-center">
              <a 
                href={news.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-grow inline-flex justify-center items-center gap-2 bg-emerald-500/10 text-emerald-100 font-semibold py-3.5 rounded-xl border border-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300 text-sm"
              >
                Read Story
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </a>

              <div className="flex-shrink-0">
                <ShareButton 
                    title={news.title} 
                    category={news.category} 
                    source={news.source} 
                    side="bright" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-20 opacity-60">
          <p className="text-emerald-200 text-lg">No stories found in this category yet.</p>
        </div>
      )}
    </div>
  );
}