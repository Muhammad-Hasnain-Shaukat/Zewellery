import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) {
  const [selectedImg, setSelectedImg] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const images = [product.image, product.secondaryImage].filter(Boolean);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-deep-charcoal/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-warm-ivory rounded-md border border-subtle-border w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl grid grid-cols-1 md:grid-cols-[1fr_1.1fr] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 border border-subtle-border flex items-center justify-center text-deep-charcoal hover:bg-deep-charcoal hover:text-white transition-colors z-20 cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Gallery */}
        <div className="bg-[#F8F5F0] p-6 flex flex-col gap-3">
          <img
            src={selectedImg || product.image}
            alt={product.name}
            className="w-full aspect-[1/1.1] object-cover rounded border border-subtle-border bg-white"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/products/brac-1-main.jpg';
            }}
          />
          {images.length > 1 && (
            <div className="flex gap-2.5">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} angle ${idx + 1}`}
                  className={`w-14 h-14 object-cover rounded border cursor-pointer transition-all ${
                    selectedImg === img ? 'border-champagne-gold opacity-100' : 'border-subtle-border opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedImg(img)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/brac-1-main.jpg';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 sm:p-8 flex flex-col">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-champagne-gold mb-1.5">
            {product.category}
          </span>
          <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-deep-charcoal mb-3">
            {product.name}
          </h2>

          <div className="flex items-baseline gap-3 mb-5 pb-4 border-b border-subtle-border">
            <span className="text-xl sm:text-2xl font-bold text-deep-charcoal">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-charcoal-light line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-champagne-gold font-semibold ml-auto">
              &bull; In Stock
            </span>
          </div>

          <p className="text-sm text-charcoal-muted leading-relaxed mb-5">
            {product.description}
          </p>

          <div className="bg-soft-beige p-4 rounded mb-6 text-xs text-deep-charcoal flex flex-col gap-2">
            <div><strong className="font-semibold">Composition:</strong> {product.material}</div>
            <div><strong className="font-semibold">Dimensions:</strong> {product.dimensions}</div>
            <div><strong className="font-semibold">Care:</strong> Avoid direct perfume/water spray, wipe with velvet cloth.</div>
          </div>

          <div className="flex items-center gap-5 mb-6">
            <div className="inline-flex items-center border border-subtle-border bg-white rounded">
              <button
                className="px-3.5 py-2 text-sm text-deep-charcoal hover:bg-warm-ivory cursor-pointer"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 font-semibold text-sm">{quantity}</span>
              <button
                className="px-3.5 py-2 text-sm text-deep-charcoal hover:bg-warm-ivory cursor-pointer"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={() => onToggleWishlist(product)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                isWishlisted ? 'text-red-500' : 'text-charcoal-muted hover:text-red-500'
              }`}
            >
              <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
              <span>{isWishlisted ? 'Wishlisted' : 'Save to Wishlist'}</span>
            </button>
          </div>

          <div className="mt-auto">
            <button
              className="w-full inline-flex items-center justify-center gap-2 bg-deep-charcoal hover:bg-champagne-gold text-white p-3.5 text-xs font-semibold uppercase tracking-[0.12em] rounded transition-colors shadow cursor-pointer"
              onClick={handleAdd}
            >
              <ShoppingBag size={16} />
              <span>ADD TO BAG &bull; Rs. {(product.price * quantity).toLocaleString()}</span>
            </button>
          </div>

          <div className="flex gap-4 mt-5 text-[11px] text-charcoal-light">
            <span className="flex items-center gap-1">
              <Truck size={14} className="text-champagne-gold" /> 2-4 Days Nationwide Delivery
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-champagne-gold" /> 100% Authentic Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
