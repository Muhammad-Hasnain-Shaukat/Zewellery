import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement"
      className="bg-deep-charcoal text-warm-ivory text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase py-2 px-2.5 sm:px-4 text-center flex justify-center items-center gap-1.5 sm:gap-3 font-medium border-b border-champagne-gold/20 w-full max-w-full overflow-hidden"
    >
      <Sparkles size={12} className="text-champagne-gold shrink-0 hidden xs:inline" aria-hidden="true" />
      <span className="leading-snug">
        Complimentary Nationwide Express Shipping Above Rs. 3,000 &bull;{' '}
        <span className="text-champagne-gold font-semibold">CODE: ZEWELLERY10 FOR 10% OFF</span>
      </span>
      <Sparkles size={12} className="text-champagne-gold shrink-0 hidden xs:inline" aria-hidden="true" />
    </aside>
  );
}
