import React, { useState } from 'react';
import { X, Truck, RotateCcw, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';

export default function PolicyModal({ isOpen, onClose, initialTab = 'shipping' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'shipping', label: 'Shipping & Delivery', icon: <Truck size={14} /> },
    { id: 'returns', label: '7-Day Exchange', icon: <RotateCcw size={14} /> },
    { id: 'care', label: 'Jewellery Care Guide', icon: <Sparkles size={14} /> },
    { id: 'faqs', label: 'Frequently Asked Questions', icon: <HelpCircle size={14} /> }
  ];

  return (
    <div
      className="fixed inset-0 bg-deep-charcoal/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-warm-ivory rounded-md border border-subtle-border w-full max-w-2xl max-h-[85vh] flex flex-col relative shadow-2xl animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-subtle-border flex items-center justify-between">
          <div>
            <span className="font-serif text-lg font-semibold text-deep-charcoal">
              ZEWELLERY<span className="text-champagne-gold">.PK</span> Concierge
            </span>
            <span className="text-[10px] tracking-widest uppercase text-charcoal-light block">
              CUSTOMER COMMITMENT & POLICIES
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-warm-ivory flex items-center justify-center text-deep-charcoal hover:bg-champagne-gold/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-subtle-border bg-soft-beige/50 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 sm:px-5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-champagne-gold text-champagne-gold bg-white'
                  : 'border-transparent text-charcoal-muted hover:text-deep-charcoal'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 overflow-y-auto grow text-sm text-charcoal-muted leading-relaxed">
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-deep-charcoal">Nationwide Express Delivery</h3>
              <p>
                We deliver to all cities, towns, and regions across Pakistan via our trusted logistics partners (TCS, Leopards, and Call Courier).
              </p>
              <div className="bg-white p-4 rounded border border-subtle-border space-y-2 text-xs text-deep-charcoal">
                <div><strong>Standard Delivery Timeline:</strong> 2 to 4 business days for major metropolitan hubs (Karachi, Lahore, Islamabad/Rawalpindi) and 3 to 5 days for other nationwide areas.</div>
                <div><strong>Shipping Charges:</strong> <span className="text-champagne-gold font-bold">COMPLIMENTARY FREE EXPRESS SHIPPING</span> on all orders exceeding Rs. 3,000. Flat Rs. 250 fee for orders under Rs. 3,000.</div>
                <div><strong>Cash on Delivery (COD):</strong> Available across 1,000+ pin codes in Pakistan with security tamper-evident seals.</div>
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-deep-charcoal">7-Day Hassle-Free Exchange</h3>
              <p>
                We want you to be absolutely captivated by your jewellery. If you wish to exchange a piece for another size or design, we offer a seamless 7-day exchange window from the date of delivery.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>Item must be unused, unblemished, and returned in its original velvet box and packaging.</li>
                <li>WhatsApp our concierge team at <strong>+92 300 1234567</strong> with your Order Reference ID.</li>
                <li>Our courier will arrange a reverse pickup or you may dispatch to our Lahore studio for instant exchange dispatch.</li>
              </ul>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-deep-charcoal">18K/24K Gold Micron Jewellery Care</h3>
              <p>
                Every Zewellery piece is engineered with a proprietary anti-tarnish protective micron sealant over high-grade brass and surgical steel.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded border border-subtle-border">
                  <strong className="text-deep-charcoal block mb-1">Avoid Direct Chemicals</strong>
                  Apply perfumes, body lotions, hairsprays, and sanitizers before wearing your jewellery.
                </div>
                <div className="p-3 bg-white rounded border border-subtle-border">
                  <strong className="text-deep-charcoal block mb-1">Gentle Cleansing</strong>
                  Wipe gently after each wear with the provided plush velvet polishing cloth.
                </div>
                <div className="p-3 bg-white rounded border border-subtle-border">
                  <strong className="text-deep-charcoal block mb-1">Keep Dry</strong>
                  Remove pieces before swimming in chlorinated pools or bathing.
                </div>
                <div className="p-3 bg-white rounded border border-subtle-border">
                  <strong className="text-deep-charcoal block mb-1">Individual Storage</strong>
                  Store in your Zewellery signature velvet pouch to prevent contact friction.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-deep-charcoal">Frequently Asked Questions</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-white rounded border border-subtle-border">
                  <strong className="text-deep-charcoal text-sm block mb-1">Are your stones authentic crystals?</strong>
                  Yes, we use 5A Austrian Cubic Zirconia, simulated diamonds with Hearts & Arrows symmetry, and genuine freshwater pearls.
                </div>
                <div className="p-3.5 bg-white rounded border border-subtle-border">
                  <strong className="text-deep-charcoal text-sm block mb-1">Is this jewellery hypoallergenic?</strong>
                  Absolutely. All our pieces are 100% nickel-free and lead-free, designed comfortably for sensitive skin.
                </div>
                <div className="p-3.5 bg-white rounded border border-subtle-border">
                  <strong className="text-deep-charcoal text-sm block mb-1">Can I order custom bridal sets?</strong>
                  Yes! Message our bespoke bridal team on WhatsApp (+92 300 1234567) to curate matching sets for your big day.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-subtle-border text-center text-xs text-charcoal-light flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-champagne-gold" />
          <span>Need further assistance? WhatsApp our Concierge: +92 300 1234567</span>
        </div>
      </div>
    </div>
  );
}
