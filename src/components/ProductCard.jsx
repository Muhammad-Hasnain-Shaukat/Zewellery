import React from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

export default function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  isInCart = false,
  onNavigate
}) {
  const handleCardClick = (e) => {
    // If clicking an interactive button inside the card, don't trigger PDP navigation
    if (e.target.closest('button')) return;
    if (onNavigate) {
      onNavigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#E8E0D5] rounded-sm p-3 pb-4 transition-all duration-300 hover:shadow-md hover:border-champagne-gold/60 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image Viewport */}
      <div className="relative aspect-square w-full bg-[#FAF7F2] rounded-xs overflow-hidden mb-3.5">
        {/* Badge (e.g. BEST SELLER / NEW) */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#C5A059] text-white text-[8.5px] sm:text-[9px] font-bold tracking-[0.14em] uppercase px-2 py-0.5 rounded-2xs shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer shadow-xs ${
            isWishlisted ? 'text-red-500 scale-110' : 'text-[#24211F] hover:text-red-500 hover:scale-105'
          }`}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={15} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
        </button>

        {/* Main Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/products/brac-1-main.jpg';
          }}
        />

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-2 bottom-2 z-10 hidden sm:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`grow py-2 px-2 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1 shadow-sm ${
              isInCart
                ? 'bg-champagne-gold text-white'
                : 'bg-[#24211F] hover:bg-[#B89758] text-white'
            }`}
          >
            <ShoppingBag size={12} />
            <span>{isInCart ? 'IN BAG' : 'ADD TO BAG'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 bg-white text-[#24211F] hover:bg-champagne-gold hover:text-white rounded-xs transition-colors shadow-sm"
            title="Quick View"
          >
            <Eye size={13} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col items-center text-center mt-auto">
        <h4 className="font-serif text-xs sm:text-[13.5px] font-normal text-[#24211F] mb-1 line-clamp-1 group-hover:text-champagne-gold transition-colors">
          {product.name}
        </h4>

        <div className="flex items-baseline gap-2">
          <span className="text-xs sm:text-[13px] font-medium text-[#24211F]">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#7A7470] line-through">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
