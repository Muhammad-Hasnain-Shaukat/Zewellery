import React from 'react';

const InstagramIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TikTokIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.96-4.48v-6.7a8.28 8.28 0 0 0 5.25 1.84v-3.48a4.85 4.85 0 0 1-1.44-.64z"/>
  </svg>
);

export default function Footer({ onNavigate, onOpenPolicy }) {
  const handleLink = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <footer className="bg-[#FAF7F2] text-[#24211F] pt-14 sm:pt-16 border-t border-[#E8E0D5]" aria-label="Site Footer">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-12">
          {/* 1. BRAND COLUMN */}
          <div>
            <h3 className="font-serif text-lg tracking-[0.2em] font-semibold text-[#24211F] mb-2 uppercase">
              ZEWELLERY<span className="text-champagne-gold">.PK</span>
            </h3>
            <p className="text-xs text-[#7A7470] leading-relaxed mb-4">
              Jewellery for every beautiful moment.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#D8CFC5] flex items-center justify-center text-[#24211F] hover:text-champagne-gold hover:border-champagne-gold transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#D8CFC5] flex items-center justify-center text-[#24211F] hover:text-champagne-gold hover:border-champagne-gold transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={14} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#D8CFC5] flex items-center justify-center text-[#24211F] hover:text-champagne-gold hover:border-champagne-gold transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon size={14} />
              </a>
            </div>
          </div>

          {/* 2. SHOP COLUMN */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#24211F] mb-3.5">
              SHOP
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#57524E]">
              <li>
                <a href="/shop" onClick={(e) => { e.preventDefault(); handleLink('/shop'); }} className="hover:text-champagne-gold transition-colors">
                  All Jewellery
                </a>
              </li>
              <li>
                <a href="/shop/necklaces" onClick={(e) => { e.preventDefault(); handleLink('/shop/necklaces'); }} className="hover:text-champagne-gold transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="/shop/earrings" onClick={(e) => { e.preventDefault(); handleLink('/shop/earrings'); }} className="hover:text-champagne-gold transition-colors">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="/shop" onClick={(e) => { e.preventDefault(); handleLink('/shop'); }} className="hover:text-champagne-gold transition-colors">
                  Collections
                </a>
              </li>
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); handleLink('/about'); }} className="hover:text-champagne-gold transition-colors">
                  Our Story
                </a>
              </li>
            </ul>
          </div>

          {/* 3. HELP COLUMN */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#24211F] mb-3.5">
              HELP
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#57524E]">
              <li>
                <button type="button" onClick={() => onOpenPolicy('faqs')} className="hover:text-champagne-gold transition-colors text-left cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenPolicy('shipping')} className="hover:text-champagne-gold transition-colors text-left cursor-pointer">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenPolicy('returns')} className="hover:text-champagne-gold transition-colors text-left cursor-pointer">
                  Return & Exchange
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenPolicy('faqs')} className="hover:text-champagne-gold transition-colors text-left cursor-pointer">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* 4. FOLLOW & ADMIN COLUMN */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#24211F] mb-3.5">
              FOLLOW
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#57524E]">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-champagne-gold transition-colors">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-champagne-gold transition-colors">Facebook</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-champagne-gold transition-colors">TikTok</a></li>
              <li className="pt-1">
                <a href="/admin" onClick={(e) => { e.preventDefault(); handleLink('/admin'); }} className="text-champagne-gold font-bold hover:underline">
                  Admin Portal &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FOOTER DARK BOTTOM BAR (Matching Image 2) */}
      <div className="bg-[#1A1A1A] text-white/70 py-4 px-4 text-center sm:text-left text-[11px]">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 px-4">
          <div>
            &copy; 2026 Zewellery.pk. All Rights Reserved.
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <button type="button" onClick={() => onOpenPolicy('faqs')} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>|</span>
            <button type="button" onClick={() => onOpenPolicy('returns')} className="hover:text-white transition-colors cursor-pointer">
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
