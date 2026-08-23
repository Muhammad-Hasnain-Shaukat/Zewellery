import React from 'react';
import { CheckCircle2, Package, ArrowRight, Copy, Check } from 'lucide-react';

export default function OrderConfirmationModal({
  order,
  onClose,
  onViewAccount,
  onContinueShopping
}) {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-deep-charcoal/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-warm-ivory rounded-md border border-subtle-border w-full max-w-xl p-6 sm:p-9 relative shadow-2xl animate-slide-up text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Gold Checkmark */}
        <div className="w-16 h-16 rounded-full bg-champagne-gold/15 text-champagne-gold border border-champagne-gold flex items-center justify-center mx-auto mb-4 animate-pulse">
          <CheckCircle2 size={36} />
        </div>

        <span className="text-[11px] font-bold tracking-[0.24em] uppercase text-champagne-gold block mb-1">
          SHUKRIYA &bull; ORDER CONFIRMED
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-deep-charcoal mb-2">
          Your Jewel is on its Way
        </h2>

        <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto mb-6 leading-relaxed">
          Thank you for choosing ZEWELLERY.PK. We have received your order and our master jewellers are preparing your velvet keepsake box.
        </p>

        {/* Order Card */}
        <div className="bg-white p-5 rounded-md border border-subtle-border text-left mb-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-subtle-border">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-light block">Order Reference</span>
              <span className="font-mono text-sm font-bold text-deep-charcoal">{order.id}</span>
            </div>
            <button
              onClick={copyOrderId}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-champagne-gold hover:text-deep-charcoal py-1 px-2.5 rounded bg-warm-ivory border border-subtle-border transition-colors cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3 border-b border-subtle-border text-xs">
            <div>
              <span className="text-[10px] text-charcoal-light uppercase block">Recipient</span>
              <strong className="text-deep-charcoal">{order.customerName}</strong>
              <div className="text-charcoal-muted text-[11px]">{order.city}, Pakistan</div>
            </div>
            <div>
              <span className="text-[10px] text-charcoal-light uppercase block">Payment Method</span>
              <strong className="text-deep-charcoal">{order.paymentMethod}</strong>
              <div className="text-champagne-gold font-bold text-[11px]">Rs. {order.total?.toLocaleString()}</div>
            </div>
          </div>

          <div className="pt-3">
            <span className="text-[10px] text-charcoal-light uppercase block mb-1">Items ({order.items?.length})</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {order.items?.map((item, idx) => (
                <img
                  key={idx}
                  src={item.image}
                  alt={item.name}
                  title={`${item.name} (${item.quantity}x)`}
                  className="w-12 h-12 object-cover rounded border border-subtle-border bg-soft-beige"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              onClose();
              if (onViewAccount) onViewAccount();
            }}
            className="inline-flex items-center justify-center gap-2 bg-deep-charcoal hover:bg-champagne-gold text-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] rounded transition-all cursor-pointer shadow"
          >
            <Package size={14} />
            <span>TRACK IN MY ACCOUNT</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onContinueShopping) onContinueShopping();
            }}
            className="inline-flex items-center justify-center gap-2 bg-white text-deep-charcoal border border-subtle-border hover:border-champagne-gold hover:text-champagne-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] rounded transition-all cursor-pointer"
          >
            <span>CONTINUE SHOPPING</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
