import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero({ onShopNow, onExploreCollection }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Autoplay prevented by browser:', err);
        });
      }
    }
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('new-collection-banner');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="bg-[#FAF7F2] text-[#24211F]" aria-label="Hero Experience">
      {/* 1. Full-Screen 4K UHD Video Section (Full Viewport - NOT Cut from Bottom) */}
      <div className="relative w-full h-[calc(100vh-92px)] min-h-[580px] max-h-[1080px] bg-[#1E1B18] overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>


        {/* Floating Scroll Indicator (Prompts User to Scroll Down) */}
        <button
          onClick={scrollToNextSection}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-all cursor-pointer group"
          aria-label="Scroll down to view collection"
        >
          <span className="text-[9px] font-bold tracking-[0.24em] uppercase text-white/70 group-hover:text-white transition-colors">
            SCROLL TO EXPLORE
          </span>
          <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs border border-white/30 flex items-center justify-center animate-bounce">
            <ChevronDown size={14} className="text-white" />
          </div>
        </button>
      </div>

      {/* 2. The Section After Video (Appears ONLY when user scrolls down - Uses Real Silk Flatlay Image) */}
      <div
        id="new-collection-banner"
        className="relative w-full bg-[#E5DCD2] overflow-hidden border-b border-[#D8CFC5]"
      >
        {/* Full Real Silk Flatlay Image Background */}
        <div
          className="w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] bg-cover bg-right sm:bg-center relative flex items-center"
          style={{
            backgroundImage: `url('/images/real-silk-flatlay.jpg')`
          }}
        >
          {/* Subtle Left Gradient Overlay for crisp text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EAE2D8]/95 via-[#EAE2D8]/80 to-transparent sm:w-2/3 lg:w-1/2 pointer-events-none" />

          {/* Left Text Content Overlay (Exact match to Reference Image 4) */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full py-14 sm:py-20">
            <div className="max-w-xl text-left">
              <span className="text-[11px] font-semibold tracking-[0.26em] uppercase text-[#3A3632] mb-3.5 block">
                THE NEW COLLECTION
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal leading-[1.08] text-[#1A1A1A] mb-4 sm:mb-5 tracking-tight uppercase">
                TIMELESS JEWELLERY,<br />
                <span className="font-serif">MADE TO SHINE</span>
              </h1>

              <p className="text-xs sm:text-[13.5px] text-[#4A4541] leading-relaxed mb-8 sm:mb-10 max-w-md font-normal">
                Discover elegant pieces designed to become part of your most beautiful moments.
              </p>

              <div className="flex items-center gap-3.5 flex-wrap">
                <button
                  onClick={onShopNow}
                  className="bg-[#1A1A1A] hover:bg-[#C5A059] text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5"
                >
                  SHOP NOW
                </button>

                <button
                  onClick={onExploreCollection}
                  className="bg-transparent hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] border border-[#1A1A1A] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                >
                  EXPLORE COLLECTION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
