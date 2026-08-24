import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onCheckout
}) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 3000;
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      <div
        className={`fixed inset-0 bg-deep-charcoal/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-warm-ivory z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping Bag"
      >
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-subtle-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-champagne-gold" />
            <h2 className="font-serif text-base sm:text-lg font-medium text-deep-charcoal">
              Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-deep-charcoal hover:bg-champagne-gold/10 transition-colors"
            aria-label="Close Bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="p-3.5 sm:p-4 bg-soft-beige border-b border-subtle-border text-xs text-deep-charcoal">
          {remainingForFreeShipping > 0 ? (
            <span>
              Add <strong className="font-bold">Rs. {remainingForFreeShipping.toLocaleString()}</strong> more to unlock <strong className="font-bold">FREE EXPRESS SHIPPING</strong>
            </span>
          ) : (
            <span className="text-champagne-gold font-bold flex items-center gap-1">
              <Sparkles size={14} /> Congratulations! You have unlocked Free Nationwide Shipping
            </span>
          )}
          <div className="h-1 bg-subtle-border rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-champagne-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cart items */}
        {items.length === 0 ? (
          <div className="grow flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={48} strokeWidth={1} className="text-subtle-border mb-4" />
            <h3 className="font-serif text-lg text-deep-charcoal mb-2">Your bag is empty</h3>
            <p className="text-xs text-charcoal-light mb-6">
              Explore our collections and discover something exquisite.
            </p>
            <button
              className="bg-deep-charcoal hover:bg-champagne-gold text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="grow overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[64px_1fr_auto] sm:grid-cols-[70px_1fr_auto] gap-3 sm:gap-4 items-center pb-4 border-b border-subtle-border">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-18 sm:w-[70px] sm:h-20 object-cover rounded border border-subtle-border bg-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/products/brac-1-main.jpg';
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif text-xs sm:text-sm font-medium text-deep-charcoal mb-1 line-clamp-1">{item.name}</h4>
                    <div className="text-xs font-bold text-champagne-gold">Rs. {item.price.toLocaleString()}</div>
                    <div className="inline-flex items-center border border-subtle-border bg-white rounded mt-2">
                      <button
                        className="px-2 py-0.5 text-xs text-deep-charcoal hover:bg-warm-ivory cursor-pointer"
                        onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                      <button
                        className="px-2 py-0.5 text-xs text-deep-charcoal hover:bg-warm-ivory cursor-pointer"
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-charcoal-light hover:text-red-500 p-2 cursor-pointer transition-colors shrink-0"
                    aria-label={`Remove ${item.name}`}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-6 border-t border-subtle-border bg-white">
              <div className="flex justify-between text-base font-bold text-deep-charcoal mb-4">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-charcoal-light mb-4">
                Taxes and shipping calculated at checkout. Cash on Delivery (COD) & Online Bank Transfer available across Pakistan.
              </p>
              <button
                className="w-full inline-flex items-center justify-center gap-2 bg-deep-charcoal hover:bg-champagne-gold text-white p-4 text-xs font-semibold uppercase tracking-[0.12em] rounded transition-colors shadow cursor-pointer"
                onClick={onCheckout}
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
