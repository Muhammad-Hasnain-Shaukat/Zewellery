import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function Newsletter({ onSubscribe }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    if (onSubscribe) onSubscribe(email);
  };

  return (
    <section className="py-10 sm:py-16 bg-[#FAF7F2] border-t border-[#E8E0D5] overflow-hidden" aria-label="Newsletter Subscription">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EFE8DE] border border-[#E0D7CB] rounded-sm p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Left: Icon & Copy */}
          <div className="flex items-center gap-3.5 sm:gap-5 text-center sm:text-left flex-col sm:flex-row w-full lg:w-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0 bg-white/60">
              <Mail size={20} strokeWidth={1.4} />
            </div>

            <div>
              <h3 className="font-serif text-base sm:text-lg lg:text-xl font-normal tracking-wide text-[#24211F] uppercase mb-1">
                STAY IN THE KNOW
              </h3>
              <p className="text-xs sm:text-[13px] text-[#57524E]">
                Be the first to discover new collections, special offers and jewellery inspiration.
              </p>
            </div>
          </div>

          {/* Right: Email Input Form (Responsive for all screen widths) */}
          <div className="w-full lg:w-auto max-w-full">
            {subscribed ? (
              <div className="py-2.5 px-4 bg-white border border-[#C5A059] rounded-xs flex items-center gap-2 text-xs text-[#24211F] font-medium">
                <Check size={16} className="text-[#C5A059]" />
                <span>Thank you! Your 10% voucher code is <strong>WELCOME10</strong></span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full sm:w-64 md:w-72 px-3.5 py-2.5 bg-white border border-[#D8CFC5] rounded-xs text-xs text-[#24211F] outline-none placeholder:text-[#9E9791] focus:border-[#24211F]"
                />
                <button
                  type="submit"
                  className="bg-[#24211F] hover:bg-[#B89758] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-xs transition-colors cursor-pointer shrink-0"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
