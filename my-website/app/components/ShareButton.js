'use client';

import { toPng } from 'html-to-image';
import { useState, useRef } from 'react';

export default function ShareButton({ title, category, source, side }) {
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  const isDark = side === 'dark';
  
  // Hardcoded Gradient styles (Safe and Reliable)
  const gradientStyle = isDark 
    ? { background: 'linear-gradient(135deg, #000000 0%, #1a0505 50%, #450a0a 100%)' }
    : { background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #000000 100%)' };

  const accentColor = isDark ? '#dc2626' : '#10b981'; // Red-600 vs Emerald-500
  const borderColor = isDark ? '#dc2626' : '#10b981';
  const labelBg = isDark ? '#7f1d1d' : '#064e3b'; // Darker backgrounds for labels
  const labelText = isDark ? '#fca5a5' : '#6ee7b7'; // Lighter text
  const dotColor = isDark ? '#dc2626' : '#10b981';

  const handleShare = async () => {
    setLoading(true);
    if (printRef.current) {
      try {
        // 1. Generate the image from the hidden DOM element
        const dataUrl = await toPng(printRef.current, {
          cacheBust: true,
          pixelRatio: 2, // High resolution for clear text
          backgroundColor: '#000000', // Ensure no transparency issues
        });

        // 2. Convert the Data URL (Base64) into a File object
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `India-Reality-${side}.png`, { type: 'image/png' });

        // 3. Check if the browser supports the native Share API with files
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'The Other Sides of India',
              text: `Check out this story: "${title}"`,
            });
          } catch (shareError) {
             // User closed the share sheet or it failed
             console.log('Share canceled or failed:', shareError);
          }
        } else {
          // 4. FALLBACK: If on a laptop/desktop without share support, download it instead
          const link = document.createElement('a');
          link.download = `India-Reality-${side}-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
        }
      } catch (err) {
        console.error("Failed to generate or share image", err);
      }
    }
    setLoading(false);
  };

  return (
    <>
      {/* --- VISIBLE BUTTON --- */}
      <button 
        onClick={handleShare}
        disabled={loading}
        className={`p-2 rounded-full transition-all duration-300 ${
           isDark 
           ? 'bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white' 
           : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
        }`}
        title="Share this story"
      >
        {loading ? (
           <span className="animate-spin block w-5 h-5 border-2 border-current border-t-transparent rounded-full"></span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        )}
      </button>

      {/* --- HIDDEN TEMPLATE (This is what gets captured as an image) --- */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        <div 
          ref={printRef}
          style={{
            width: '600px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            padding: '48px',
            fontFamily: 'sans-serif',
            overflow: 'hidden',
            ...gradientStyle
          }}
        >
          {/* Background Pattern */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
              zIndex: 0
            }}
          ></div>
          
          {/* Header */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
             <div>
                <h1 style={{ fontSize: '30px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '-1px', margin: 0 }}>THE OTHER SIDES</h1>
                <p style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '4px', color: accentColor, margin: 0 }}>
                  {isDark ? 'DARK REALITY' : 'BRIGHT FUTURE'}
                </p>
             </div>
             <div style={{ padding: '12px', borderRadius: '50%', border: `1px solid ${borderColor}`, backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: dotColor }}></div>
             </div>
          </div>

          {/* Main Content */}
          <div style={{ position: 'relative', zIndex: 10, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <span style={{ 
               alignSelf: 'flex-start', 
               padding: '6px 16px', 
               borderRadius: '9999px', 
               fontSize: '12px', 
               fontWeight: 'bold', 
               textTransform: 'uppercase', 
               letterSpacing: '0.05em', 
               marginBottom: '24px', 
               backgroundColor: labelBg, 
               color: labelText 
             }}>
                {category || 'News'}
             </span>
             
             <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', lineHeight: '1.2', marginBottom: '24px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
               "{title}"
             </h2>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7 }}>
                <span style={{ width: '32px', height: '1px', backgroundColor: 'white' }}></span>
                <p style={{ color: 'white', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', margin: 0 }}>{source}</p>
             </div>
          </div>

          {/* Footer */}
          <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <div>
                <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '500', marginBottom: '4px', margin: 0 }}>Read the full story at</p>
                <p style={{ color: 'white', fontWeight: 'bold', letterSpacing: '0.025em', margin: 0 }}>other-side-india.vercel.app</p>
             </div>
             <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, color: isDark ? '#fecaca' : '#a7f3d0', margin: 0 }}>
                   Two Worlds. One Nation.
                </p>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}