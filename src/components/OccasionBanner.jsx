import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function OccasionBanner({ onShopOccasion }) {
  return (
    <section className="py-6 sm:py-8 bg-[#FAF7F2]" aria-label="Special Moments Collection">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden bg-[#D8C7B5] border border-[#CBB8A4] grid grid-cols-1 md:grid-cols-12 min-h-[220px] sm:min-h-[260px] items-center">
          {/* Left Text & CTA */}
          <div className="md:col-span-7 lg:col-span-6 p-6 sm:p-8 lg:p-12 text-center md:text-left flex flex-col justify-center order-2 md:order-1">
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal tracking-wide text-[#24211F] mb-1.5 uppercase">
              FOR YOUR SPECIAL MOMENTS
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4541] mb-5 font-normal">
              Find something beautiful for birthdays, celebrations, weddings and everything in between.
            </p>
            <div>
              <button
                className="inline-flex items-center gap-1.5 bg-transparent hover:bg-[#24211F] hover:text-white text-[#24211F] border border-[#24211F] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 cursor-pointer"
                onClick={onShopOccasion}
              >
                <span>SHOP OCCASION EDIT</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Right Visual: Gold Necklace & Earrings on Silk */}
          <div className="md:col-span-5 lg:col-span-6 h-48 md:h-full relative overflow-hidden order-1 md:order-2">
            <img
              src="/images/banner-special-moments.jpg"
              alt="Luxury Jewellery on Silk"
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/products/ear-1-main.jpg';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
