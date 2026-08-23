import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ALL_PRODUCTS } from '../data/products';

export default function SearchModal({ isOpen, onClose, onSelectProduct }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return ALL_PRODUCTS.filter(
      p => p.name.toLowerCase().includes(q) ||
           p.category.toLowerCase().includes(q) ||
           p.description.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const quickTags = ['Earrings', 'Necklaces', 'Rings', 'Tennis Bracelet', 'Pearl', 'Gold Vermeil'];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-deep-charcoal/65 backdrop-blur-sm z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed top-0 inset-x-0 bg-warm-ivory border-b border-subtle-border p-6 sm:p-10 shadow-2xl animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-champagne-gold">
              SEARCH THE BOUTIQUE
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-deep-charcoal hover:bg-champagne-gold/10 transition-colors"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              className="w-full py-4 pr-12 pl-2 text-lg sm:text-xl font-serif text-deep-charcoal border-b-2 border-deep-charcoal bg-transparent outline-none placeholder:text-charcoal-light/60"
              placeholder="Search by jewellery piece, gemstone, or collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <Search size={22} className="absolute right-3 top-5 text-champagne-gold" />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap mt-5 text-xs text-charcoal-muted">
            <span>Popular Searches:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                className="py-1 px-3 bg-soft-beige hover:bg-champagne-gold hover:text-white rounded-full transition-colors cursor-pointer"
                onClick={() => setSearchTerm(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Live Search Results */}
          {searchTerm.trim() && (
            <div className="mt-6 max-h-80 overflow-y-auto pr-1">
              <p className="text-xs text-charcoal-light mb-3">
                {filteredProducts.length} product(s) found for "{searchTerm}"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 bg-white border border-subtle-border rounded hover:border-champagne-gold hover:shadow transition-all cursor-pointer"
                  >
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded bg-soft-beige" />
                    <div>
                      <div className="font-serif text-xs sm:text-sm font-medium text-deep-charcoal line-clamp-1">{p.name}</div>
                      <div className="text-xs font-bold text-champagne-gold">Rs. {p.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
