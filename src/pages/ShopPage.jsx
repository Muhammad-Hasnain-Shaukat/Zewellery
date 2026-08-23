import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { SHOP_CATEGORIES } from '../data/products';
import { dbGetProducts } from '../services/db';
import CategoryPreviewSection from '../components/CategoryPreviewSection';

export default function ShopPage({
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  cartItems,
  onNavigate
}) {
  const [products, setProducts] = useState(() => dbGetProducts());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleDB = () => setProducts(dbGetProducts());
    window.addEventListener('zewellery_db_updated', handleDB);
    return () => window.removeEventListener('zewellery_db_updated', handleDB);
  }, []);

  // Enrich SHOP_CATEGORIES with dynamic products from DB
  const dynamicCategories = SHOP_CATEGORIES.map((cat) => {
    const matchedProducts = products.filter(
      (p) => p.category.toLowerCase() === cat.title.toLowerCase() ||
             p.category.toLowerCase().replace(/\s+/g, '-') === cat.slug
    );
    return {
      ...cat,
      products: matchedProducts.length > 0 ? matchedProducts : cat.products
    };
  });

  return (
    <div className="min-h-screen bg-warm-ivory animate-fade-in pb-20">
      {/* Compact Shop Page Introduction Header */}
      <section className="pt-8 pb-10 sm:pb-14 border-b border-subtle-border bg-gradient-to-b from-soft-beige/40 to-warm-ivory" aria-label="Shop Introduction">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-charcoal-light mb-6" aria-label="Breadcrumb">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="hover:text-champagne-gold transition-colors"
            >
              Home
            </a>
            <ChevronRight size={12} className="text-charcoal-light/60" />
            <span className="text-deep-charcoal font-medium">Shop</span>
          </nav>

          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.24em] uppercase text-champagne-gold mb-3">
              <Sparkles size={13} />
              THE BOUTIQUE COLLECTIONS
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-deep-charcoal mb-3">
              Find Your Perfect Piece
            </h1>

            <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto mb-7 leading-relaxed">
              Explore our handcrafted Pakistani collections and discover designs made for everyday luxury and grand wedding celebrations.
            </p>

            {/* Quick Category Anchor Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat.slug}
                  className="py-1.5 px-4 rounded-full border border-subtle-border bg-white text-deep-charcoal hover:border-champagne-gold hover:bg-champagne-gold hover:text-white text-xs font-medium tracking-wide transition-all shadow-xs cursor-pointer"
                  onClick={() => onNavigate(`/shop/${cat.slug}`)}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 Dynamic Category Preview Sections */}
      <div className="pb-16 sm:pb-24">
        {dynamicCategories.map((category) => (
          <CategoryPreviewSection
            key={category.slug}
            category={category}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            cartItems={cartItems}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
