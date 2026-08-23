import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  items = [],
  onRemoveItem,
  onMoveToCart,
  onNavigate
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-deep-charcoal/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[440px] max-w-[92vw] bg-warm-ivory z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Your Wishlist"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-subtle-border">
          <div className="flex items-center gap-2.5">
            <Heart size={20} className="text-red-500" fill="#EF4444" />
            <h2 className="font-serif text-lg font-medium text-deep-charcoal">
              My Saved Pieces ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-deep-charcoal hover:bg-champagne-gold/10 transition-colors"
            aria-label="Close Wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="grow flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-soft-beige flex items-center justify-center text-charcoal-light mb-4">
              <Heart size={28} />
            </div>
            <h3 className="font-serif text-xl text-deep-charcoal mb-2">Your wishlist is empty</h3>
            <p className="text-xs text-charcoal-muted max-w-xs mb-6 leading-relaxed">
              Explore our jewellery collections and click the heart icon to save your favorite earrings, necklaces, and rings.
            </p>
            <button
              className="bg-deep-charcoal hover:bg-champagne-gold text-white px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] rounded transition-colors cursor-pointer"
              onClick={() => {
                onClose();
                onNavigate('/shop');
              }}
            >
              EXPLORE COLLECTIONS
            </button>
          </div>
        ) : (
          <>
            <div className="grow overflow-y-auto p-6 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[72px_1fr_auto] gap-4 items-center p-3 bg-white border border-subtle-border rounded-md hover:border-champagne-gold transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[72px] h-[72px] object-cover rounded bg-soft-beige cursor-pointer"
                    onClick={() => {
                      onClose();
                      onNavigate(`/product/${item.id}`);
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/products/brac-1-main.jpg';
                    }}
                  />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-light block">
                      {item.category}
                    </span>
                    <h4
                      className="font-serif text-sm font-medium text-deep-charcoal hover:text-champagne-gold transition-colors cursor-pointer line-clamp-1"
                      onClick={() => {
                        onClose();
                        onNavigate(`/product/${item.id}`);
                      }}
                    >
                      {item.name}
                    </h4>
                    <div className="text-xs font-bold text-champagne-gold mt-1">
                      Rs. {item.price.toLocaleString()}
                    </div>

                    <button
                      onClick={() => onMoveToCart(item)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-deep-charcoal hover:text-champagne-gold mt-2 cursor-pointer transition-colors"
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Bag</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item)}
                    className="text-charcoal-light hover:text-red-500 p-2 cursor-pointer transition-colors"
                    aria-label={`Remove ${item.name} from wishlist`}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-subtle-border bg-white">
              <button
                className="w-full inline-flex items-center justify-center gap-2 bg-deep-charcoal hover:bg-champagne-gold text-white p-3.5 text-xs font-semibold uppercase tracking-[0.14em] rounded transition-colors shadow cursor-pointer"
                onClick={() => {
                  items.forEach((item) => onMoveToCart(item));
                  onClose();
                }}
              >
                <span>MOVE ALL ITEMS TO BAG</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
