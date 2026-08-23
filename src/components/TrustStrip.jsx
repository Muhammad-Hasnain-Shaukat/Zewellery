import React from 'react';
import { Truck, ShieldCheck, Award, Headphones } from 'lucide-react';

export default function TrustStrip() {
  const benefits = [
    {
      icon: <Truck size={22} strokeWidth={1.4} className="text-[#C5A059]" />,
      title: 'FREE SHIPPING',
      subtitle: 'on all orders'
    },
    {
      icon: <ShieldCheck size={22} strokeWidth={1.4} className="text-[#C5A059]" />,
      title: 'SECURE PAYMENTS',
      subtitle: '100% secure & safe'
    },
    {
      icon: <Award size={22} strokeWidth={1.4} className="text-[#C5A059]" />,
      title: 'PREMIUM QUALITY',
      subtitle: 'finest craftsmanship'
    },
    {
      icon: <Headphones size={22} strokeWidth={1.4} className="text-[#C5A059]" />,
      title: 'EASY SUPPORT',
      subtitle: '24/7 customer care'
    }
  ];

  return (
    <section className="bg-white border-y border-[#E8E0D5] py-6 sm:py-7" aria-label="Customer Benefits and Guarantees">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center sm:justify-items-start">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3.5 w-full justify-center sm:justify-start"
            >
              <div className="shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#24211F] leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#7A7470] mt-0.5 font-normal">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
