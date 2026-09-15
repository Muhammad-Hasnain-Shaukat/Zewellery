import React from 'react';
import { ArrowRight } from 'lucide-react';

const DelicateLeafBranchSVG = () => (
  <svg className="w-24 sm:w-32 h-auto text-[#C5A059]/35" viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M50 120 C50 70 70 35 90 10" />
    <path d="M50 120 C50 80 30 45 10 20" />
    <path d="M50 95 C62 80 78 80 82 85 C78 95 62 95 50 95 Z" />
    <path d="M50 75 C36 65 22 70 18 75 C22 85 36 82 50 75 Z" />
    <path d="M62 58 C72 48 88 52 90 58 C84 65 72 63 62 58 Z" />
    <path d="M38 42 C28 32 16 38 12 42 C18 50 30 47 38 42 Z" />
    <path d="M72 32 C82 22 94 28 96 32 C92 40 82 37 72 32 Z" />
  </svg>
);

export default function BrandStory({ onReadStory }) {
  return (
    <section id="brand-story" className="py-16 sm:py-20 bg-[#FAF7F2] border-y border-[#E8E0D5] relative overflow-hidden" aria-label="Our Brand Story">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: The Real Muse with Geometric Statement Necklace, Compass & Journal (Image 3) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div className="rounded-sm overflow-hidden aspect-[16/10] sm:aspect-[16/10.5] w-full max-w-[560px] border border-[#E8E0D5] bg-[#EFE7DC] shadow-xs">
              <img
                src="/images/real-story-muse.jpg"
                alt="Jewellery With a Story - Zewellery.pk Muse"
                className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Right Column: Copy & Outline Button (Exact match to Reference Image 5) */}
          <div className="lg:col-span-6 flex items-center justify-between gap-6">
            <div className="max-w-md text-left">
              <span className="text-[10.5px] font-semibold tracking-[0.24em] uppercase text-[#7A7470] mb-2.5 block">
                OUR STORY
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[36px] font-normal text-[#24211F] mb-3 leading-tight">
                Jewellery With a Story
              </h2>

              <p className="text-xs sm:text-sm text-[#57524E] leading-relaxed mb-6 font-normal">
                At Zewellery.pk, we believe jewellery is more than an accessory. It is a reflection of your personality, your moments, and the memories you choose to carry with you.
              </p>

              <div>
                <button
                  className="inline-flex items-center gap-2 bg-transparent hover:bg-[#24211F] hover:text-white text-[#24211F] border border-[#24211F] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 cursor-pointer"
                  onClick={onReadStory}
                >
                  <span>OUR STORY</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Delicate Botanical Leaf Art on Far Right */}
            <div className="hidden sm:block shrink-0 pr-2 pointer-events-none">
              <DelicateLeafBranchSVG />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
