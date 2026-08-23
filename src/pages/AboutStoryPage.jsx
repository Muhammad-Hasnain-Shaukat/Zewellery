import React from 'react';
import { ArrowRight, Sparkles, Gem, ShieldCheck, Heart, Award, ChevronRight } from 'lucide-react';

export default function AboutStoryPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24211F] animate-fade-in pb-20">
      {/* Breadcrumb Navigation */}
      <section className="pt-6 pb-4 border-b border-[#E8E0D5] bg-white/70 backdrop-blur-xs" aria-label="Breadcrumb">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#7A7470]">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="hover:text-[#C5A059] transition-colors"
            >
              Home
            </a>
            <ChevronRight size={12} className="text-[#C5A059]" />
            <span className="text-[#24211F] font-semibold">Our Story</span>
          </nav>
        </div>
      </section>

      {/* Hero Header */}
      <section className="py-14 sm:py-20 text-center max-w-4xl mx-auto px-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.28em] uppercase text-[#C5A059] mb-4">
          <Sparkles size={14} />
          OUR HERITAGE & JOURNEY
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-normal leading-[1.12] text-[#24211F] mb-6 tracking-tight">
          Jewellery With a Story
        </h1>
        <p className="text-sm sm:text-base text-[#57524E] leading-relaxed max-w-2xl mx-auto font-normal">
          At Zewellery.pk, we believe jewellery is far more than an ornament. It is a reflection of your personality, your cherished moments, and the memories you choose to carry with you.
        </p>
      </section>

      {/* Main Chapter 1: The Founding Vision */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="bg-white border border-[#E8E0D5] rounded-sm p-6 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center shadow-xs">
          {/* Left: Muse Image (Real Muse Image) */}
          <div className="lg:col-span-6 rounded-xs overflow-hidden aspect-[16/11] bg-[#EFE7DC] border border-[#E8E0D5] shadow-xs">
            <img
              src="/images/real-story-muse.jpg"
              alt="Zewellery.pk Brand Story Muse"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/story-woman-compass.jpg';
              }}
            />
          </div>

          {/* Right: Chapter Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#C5A059] mb-2 block">
              CHAPTER ONE &bull; THE GENESIS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#24211F] mb-4 leading-snug">
              Born From Heritage, Refined for Modern Life
            </h2>
            <p className="text-xs sm:text-sm text-[#57524E] leading-relaxed mb-4">
              Zewellery.pk was founded in Lahore with a singular, passionate dream: to bridge the regal grandeur of traditional subcontinental goldsmithing with the minimalist silhouette demanded by modern life.
            </p>
            <p className="text-xs sm:text-sm text-[#57524E] leading-relaxed mb-6">
              For generations, fine jewellery in Pakistan was reserved almost exclusively for bridal suites and wedding halls. We reimagined this paradigm, engineering lightweight, hypoallergenic heirlooms that look just as effortless in a morning boardroom as they do at an evening gala dinner.
            </p>

            <div className="border-l-2 border-[#C5A059] pl-4 py-1 italic text-xs sm:text-sm text-[#24211F] font-serif">
              "We craft pieces that celebrate you—not just on the grandest days of your life, but in the quiet, beautiful everyday moments in between."
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: Artisan Craftsmanship & Innovation */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Details & Pillars */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#C5A059] mb-2 block">
              CHAPTER TWO &bull; MASTER CRAFTSMANSHIP
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#24211F] mb-4 leading-snug">
              Uncompromising Quality & Triple-Micron Plating
            </h2>
            <p className="text-xs sm:text-sm text-[#57524E] leading-relaxed mb-6">
              Each Zewellery.pk piece undergoes rigorous multi-stage hand finishing by master artisans. From handset 5A Austrian zirconia stones to hand-selected cultured freshwater pearls, our jewelry is made to endure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white border border-[#E8E0D5] rounded-xs">
                <ShieldCheck size={20} className="text-[#C5A059] mb-2" />
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#24211F] mb-1">
                  Anti-Tarnish Coating
                </h4>
                <p className="text-[11px] text-[#7A7470]">
                  Triple-sealed 18K/24K micron plating engineered to resist humidity, heat, and daily wear.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#E8E0D5] rounded-xs">
                <Heart size={20} className="text-[#C5A059] mb-2" />
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#24211F] mb-1">
                  Hypoallergenic Care
                </h4>
                <p className="text-[11px] text-[#7A7470]">
                  100% nickel-free and lead-free precious alloys safe for sensitive skin.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#E8E0D5] rounded-xs">
                <Gem size={20} className="text-[#C5A059] mb-2" />
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#24211F] mb-1">
                  Ethical Gemstones
                </h4>
                <p className="text-[11px] text-[#7A7470]">
                  Conflict-free Austrian crystals, lab emeralds, and real freshwater baroque pearls.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#E8E0D5] rounded-xs">
                <Award size={20} className="text-[#C5A059] mb-2" />
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#24211F] mb-1">
                  Velvet Keepsake Box
                </h4>
                <p className="text-[11px] text-[#7A7470]">
                  Every parcel arrives in our signature velvet keepsake packaging with certificate.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Flatlay Craftsmanship Visual */}
          <div className="lg:col-span-6 order-1 lg:order-2 rounded-xs overflow-hidden aspect-[16/11] bg-[#EFE7DC] border border-[#E8E0D5] shadow-xs">
            <img
              src="/images/about-craftsmanship.jpg"
              alt="Zewellery Fine Jewellery Flatlay"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/real-silk-flatlay.jpg';
              }}
            />
          </div>
        </div>
      </section>

      {/* Visual Showcase Gallery */}
      <section className="bg-white py-14 sm:py-20 border-y border-[#E8E0D5] mb-16 sm:mb-24">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10.5px] font-bold tracking-[0.24em] uppercase text-[#C5A059] mb-2 block">
              THE ATELIER LOOK
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#24211F]">
              Handcrafted in Pakistan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative aspect-square rounded-xs overflow-hidden border border-[#E8E0D5] bg-[#FAF7F2] group">
              <img
                src="/images/about-atelier-1.jpg"
                alt="Master Artisan Crafting"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/products/neck-2-main.jpg';
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-serif">
                Hand-setting each Austrian crystal with micro-pave precision
              </div>
            </div>

            <div className="relative aspect-square rounded-xs overflow-hidden border border-[#E8E0D5] bg-[#FAF7F2] group">
              <img
                src="/images/about-atelier-2.jpg"
                alt="Fine Jewellery Workbench"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/products/ear-1-main.jpg';
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-serif">
                Carefully selected cultured freshwater baroque pearls
              </div>
            </div>

            <div className="relative aspect-square rounded-xs overflow-hidden border border-[#E8E0D5] bg-[#FAF7F2] group">
              <img
                src="/images/about-atelier-3.jpg"
                alt="Luxury Velvet Keepsake Box"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/products/brac-2-main.jpg';
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-serif">
                Signature packaging ready for gifting and treasured keepsakes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center max-w-xl mx-auto px-4">
        <h3 className="font-serif text-2xl sm:text-3xl text-[#24211F] mb-3">
          Discover Pieces Designed for You
        </h3>
        <p className="text-xs sm:text-sm text-[#7A7470] mb-8">
          Explore our collection of necklaces, earrings, rings, and bracelets crafted to elevate your every day.
        </p>

        <button
          onClick={() => onNavigate('/shop')}
          className="inline-flex items-center gap-2 bg-[#24211F] hover:bg-[#C5A059] text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 shadow-md cursor-pointer hover:-translate-y-0.5"
        >
          <span>EXPLORE OUR COLLECTIONS</span>
          <ArrowRight size={14} />
        </button>
      </section>
    </div>
  );
}
