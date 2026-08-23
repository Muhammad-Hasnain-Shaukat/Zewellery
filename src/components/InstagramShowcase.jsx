import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function InstagramShowcase() {
  const posts = [
    { id: 1, image: '/images/social/insta-1.jpg', alt: 'Luxury Kundan Necklace' },
    { id: 2, image: '/images/social/insta-2.jpg', alt: 'Velvet Packaging Box' },
    { id: 3, image: '/images/social/insta-3.jpg', alt: 'Pakistani Muse styling Zewellery' },
    { id: 4, image: '/images/social/insta-4.jpg', alt: 'Handcrafted Polki Choker' },
    { id: 5, image: '/images/social/insta-5.jpg', alt: 'Diamond Rings Array' },
    { id: 6, image: '/images/social/insta-6.jpg', alt: 'Festive Jewellery Look' }
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-t border-[#E8E0D5]" aria-label="Social Media Showcase">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#24211F] mb-1.5 tracking-normal">
            FOLLOW THE ZEWELLERY LOOK
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7470] font-medium">
            @zewellery.pk
          </p>
        </div>

        {/* 6-Column Photo Grid (Matching Image 2) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square rounded-xs overflow-hidden bg-white border border-[#E8E0D5] group shadow-2xs cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.alt}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/products/brac-1-main.jpg';
                }}
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-transparent hover:bg-[#24211F] hover:text-white text-[#24211F] border border-[#24211F] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 cursor-pointer"
          >
            <span>FOLLOW US</span>
            <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
