import React from 'react';
import { Star } from 'lucide-react';
import { REVIEWS } from '../data/products';

export default function CustomerReviews() {
  const displayReviews = REVIEWS.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-white" aria-label="Customer Testimonials">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#24211F] mb-1 tracking-normal">
            LOVED BY OUR CUSTOMERS
          </h2>
        </div>

        {/* 3-Column Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF7F2] rounded-xs border border-[#E8E0D5] p-7 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xs"
            >
              {/* 5 Stars */}
              <div className="flex gap-1 text-[#C5A059] mb-4" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#C5A059" color="#C5A059" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xs sm:text-[13px] text-[#24211F] font-normal leading-relaxed mb-4 grow">
                {rev.comment}
              </blockquote>

              {/* Author */}
              <div className="text-xs text-[#7A7470] font-medium mt-auto">
                - {rev.name}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots (Image 2 match) */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#24211F]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#D1C7BD]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#D1C7BD]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#D1C7BD]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#D1C7BD]" />
        </div>
      </div>
    </section>
  );
}
