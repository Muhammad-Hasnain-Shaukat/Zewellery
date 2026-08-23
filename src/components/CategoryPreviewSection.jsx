import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function CategoryPreviewSection({
  category,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  cartItems,
  onNavigate
}) {
  // Always slice exactly 4 products for the preview section
  const previewProducts = category.products.slice(0, 4);

  return (
    <section className="py-12 sm:py-16" aria-label={`${category.title} Preview`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-deep-charcoal mb-2">
            {category.title}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-light">
            {category.description}
          </p>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {previewProducts.map((product) => {
            const isWishlisted = wishlist.some((item) => item.id === product.id);
            const isInCart = cartItems.some((item) => item.id === product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={isWishlisted}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isInCart={isInCart}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>

        {/* Centered Shop More CTA */}
        <div className="mt-9 text-center">
          <button
            className="inline-flex items-center justify-center gap-2 bg-transparent text-deep-charcoal border border-deep-charcoal hover:bg-deep-charcoal hover:text-white px-7 py-3 rounded text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer"
            onClick={() => onNavigate(`/shop/${category.slug}`)}
            aria-label={`Shop more ${category.title}`}
          >
            <span>SHOP MORE {category.title.toUpperCase()}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Subtle Luxury Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-subtle-border to-transparent mt-12 sm:mt-16" aria-hidden="true" />
      </div>
    </section>
  );
}
