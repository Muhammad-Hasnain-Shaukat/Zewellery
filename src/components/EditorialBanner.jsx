import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function EditorialBanner({ onExploreCollection }) {
  return (
    <section id="featured-collection" className="py-6 sm:py-8 bg-[#FAF7F2]" aria-label="The Everyday Edit">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden bg-[#D8C7B5] border border-[#CBB8A4] grid grid-cols-1 md:grid-cols-12 min-h-[260px] sm:min-h-[300px] items-center">
          {/* Left Visual: Couple hands with rings */}
          <div className="md:col-span-5 lg:col-span-6 h-56 sm:h-72 md:h-full relative overflow-hidden">
            <img
              src="/images/banner-everyday-edit.jpg"
              alt="The Everyday Edit - Couple Hands with Rings"
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/products/ring-1-main.jpg';
              }}
            />
          </div>

          {/* Right Text & Feature Lines */}
          <div className="md:col-span-7 lg:col-span-6 p-6 sm:p-8 lg:p-12 text-center md:text-left flex flex-col justify-center relative">
            {/* Subtle background luxury flourish */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
              <svg width="180" height="180" viewBox="0 0 100 100" fill="none" stroke="#24211F" strokeWidth="0.8">
                <circle cx="50" cy="50" r="45" strokeDasharray="2 3" />
                <circle cx="50" cy="50" r="35" />
                <path d="M50 5 L50 95 M5 50 L95 50" />
                <path d="M18 18 L82 82 M18 82 L82 18" strokeDasharray="1 3" />
              </svg>
            </div>

            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-[#735A43] mb-1.5 flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles size={13} className="text-[#8C6D4F]" />
              TIMELESS ESSENTIALS
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal tracking-wide text-[#24211F] mb-2 uppercase leading-tight">
              THE EVERYDAY EDIT
            </h3>

            <p className="text-xs sm:text-sm text-[#4A4541] mb-4 font-normal leading-relaxed max-w-md mx-auto md:mx-0">
              Jewellery designed for everyday elegance—from morning meetings to evening celebrations.
            </p>

            {/* Elegant highlights covering blank space */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mb-6 text-left max-w-md mx-auto md:mx-0">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#38332E] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D4F] shrink-0" />
                <span>Triple-Micron Real Gold Plating</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#38332E] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D4F] shrink-0" />
                <span>100% Anti-Tarnish & Sweat Proof</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#38332E] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D4F] shrink-0" />
                <span>Hypoallergenic for Sensitive Skin</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#38332E] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D4F] shrink-0" />
                <span>Signature Velvet Keepsake Box</span>
              </div>
            </div>

            <div>
              <button
                className="inline-flex items-center gap-2 bg-[#24211F] hover:bg-[#8C6D4F] text-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 shadow-sm hover:shadow cursor-pointer"
                onClick={onExploreCollection}
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
