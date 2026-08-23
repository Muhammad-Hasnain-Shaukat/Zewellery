import React from 'react';
import { BEST_SELLERS } from '../data/products';
import ProductCard from './ProductCard';

export default function BestSellers({
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  cartItems,
  onViewAll,
  onNavigate
}) {
  return (
    <section id="best-sellers" className="py-16 sm:py-20 bg-white" aria-label="Our Best Sellers">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#24211F] mb-2 tracking-normal">
            OUR BEST SELLERS
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7470]">
            Pieces everyone is loving.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {BEST_SELLERS.map((product) => {
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

        <div className="mt-10 sm:mt-12 text-center">
          <button
            className="inline-flex items-center justify-center bg-transparent hover:bg-[#24211F] hover:text-white text-[#24211F] border border-[#24211F] px-8 py-3 text-xs font-semibold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 cursor-pointer"
            onClick={onViewAll}
          >
            <span>VIEW ALL</span>
          </button>
        </div>
      </div>
    </section>
  );
}
