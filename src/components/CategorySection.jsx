import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function CategorySection({ onSelectCategory }) {
  return (
    <section id="categories" className="py-16 sm:py-20 bg-[#FAF7F2]" aria-label="Shop By Category">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#24211F] mb-2 tracking-normal">
            SHOP BY CATEGORY
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7470]">
            Find the perfect piece for every style and occasion.
          </p>
        </div>

        {/* 4/5-Column Category Showcase Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="group flex flex-col items-center bg-white border border-[#E8E0D5] rounded-sm overflow-hidden p-3 pb-5 transition-all duration-300 hover:shadow-md hover:border-champagne-gold/60 cursor-pointer"
              onClick={() => onSelectCategory(category.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectCategory(category.name);
                }
              }}
            >
              {/* Category Image Box */}
              <div className="w-full aspect-square bg-[#FAF7F2] rounded-xs overflow-hidden mb-4 relative">
                <img
                  src={category.image}
                  alt={`Zewellery ${category.name} Collection`}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/cat-earrings.jpg';
                  }}
                />
              </div>

              {/* Category Title & Link */}
              <h3 className="font-serif text-sm sm:text-base font-normal tracking-[0.14em] uppercase text-[#24211F] mb-1 group-hover:text-champagne-gold transition-colors text-center">
                {category.name}
              </h3>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase text-[#7A7470] group-hover:text-champagne-gold flex items-center gap-1 transition-colors">
                <span>SHOP NOW</span>
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
