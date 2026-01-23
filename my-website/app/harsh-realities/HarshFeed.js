'use client';

import { useState } from 'react';
import ShareButton from '../components/ShareButton';

export default function HarshFeed({ articles }) {
  const [activeTab, setActiveTab] = useState('All');

  // The 5 Dark Tabs + 'All'
  const tabs = [
    { id: 'All', label: 'All Reports' },
    { id: 'Dirty Politics', label: 'Dirty Politics' },
    { id: 'Impunity', label: 'Impunity' },
    { id: 'Persecution', label: 'Persecution' },
    { id: 'Corruption', label: 'Corruption' },
    { id: 'Atrocity', label: 'Atrocity' },
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
      <div className="flex flex-wrap justify-center gap-4 mb-12 border-b border-red-900/30 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 scale-105 border border-red-500'
                : 'bg-red-950/30 text-red-400 border border-red-900/30 hover:bg-red-900/40 hover:text-red-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- HERO SECTION (Only if stories exist) --- */}
      {heroStory && (
        <div className="mb-16 animate-fade-in-up">
          <div className="relative group w-full bg-gradient-to-r from-red-950/80 to-black border border-red-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)] hover:shadow-[0_0_80px_rgba(220,38,38,0.3)] transition-all duration-500">
            
            <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-red-600/20 group-hover:text-red-600/40 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
               </svg>
            </div>

            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <span className="text-red-500 font-black tracking-widest text-xs uppercase">JUST EXPOSED</span>
                  {/* FIXED DATE FORMAT HERE */}
                  <span className="text-gray-500 text-xs">| {new Date(heroStory.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 group-hover:text-red-500 transition-colors duration-300">
                  {heroStory.title}
                </h2>
                
                <div className="flex flex-wrap gap-3 mb-8">
                   <span className="px-4 py-1.5 bg-red-900/30 border border-red-800 text-red-300 text-xs font-bold rounded-full uppercase">
                      {heroStory.category || 'General'}
                   </span>
                   <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-400 text-xs font-bold rounded-full uppercase">
                      {heroStory.source}
                   </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a 
                    href={heroStory.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-red-900/50"
                  >
                    READ FULL INVESTIGATION
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>

                  <ShareButton 
                    title={heroStory.title} 
                    category={heroStory.category} 
                    source={heroStory.source} 
                    side="dark" 
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
            className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/5 hover:border-red-500/50 hover:shadow-red-900/20 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden flex flex-col"
          >
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-red-900/20 border border-red-900/30 text-red-400 text-[10px] font-extrabold rounded-md uppercase tracking-wide">
                  {news.category || 'Report'}
                </span>
                {/* FIXED DATE FORMAT HERE */}
                <span className="text-gray-500 text-xs font-medium">
                  {new Date(news.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-100 leading-snug group-hover:text-red-500 transition-colors duration-300 line-clamp-4">
                {news.title}
              </h3>
            </div>
            
            <div className="px-8 pb-8 pt-0 mt-auto flex gap-3 items-center">
              <a 
                href={news.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-grow inline-flex justify-center items-center gap-2 bg-white/5 text-gray-300 font-semibold py-3.5 rounded-xl border border-white/5 group-hover:bg-red-700 group-hover:text-white group-hover:border-red-700 transition-all duration-300 text-sm"
              >
                Read Report
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </a>

              <div className="flex-shrink-0">
                <ShareButton 
                  title={news.title} 
                  category={news.category} 
                  source={news.source} 
                  side="dark" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <p className="text-gray-400 text-lg font-medium">Scanning for reports...</p>
        </div>
      )}
    </div>
  );
}