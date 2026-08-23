import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ArrowLeft, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { SHOP_CATEGORIES } from '../data/products';
import { dbGetProducts } from '../services/db';
import ProductCard from '../components/ProductCard';

export default function CategoryListingPage({
  categorySlug,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  cartItems,
  onNavigate
}) {
  const [allProducts, setAllProducts] = useState(() => dbGetProducts());
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all');

  const categoryMeta = SHOP_CATEGORIES.find((c) => c.slug === categorySlug) || SHOP_CATEGORIES[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleDB = () => setAllProducts(dbGetProducts());
    window.addEventListener('zewellery_db_updated', handleDB);
    return () => window.removeEventListener('zewellery_db_updated', handleDB);
  }, [categorySlug]);

  // Filter products by category title
  const categoryProducts = useMemo(() => {
    let list = allProducts.filter(
      (p) => p.category.toLowerCase() === categoryMeta.title.toLowerCase() ||
             p.category.toLowerCase().replace(/\s+/g, '-') === categorySlug
    );

    // Price filtering
    if (priceFilter === 'under3500') {
      list = list.filter((p) => p.price < 3500);
    } else if (priceFilter === '3500to5000') {
      list = list.filter((p) => p.price >= 3500 && p.price <= 5000);
    } else if (priceFilter === 'above5000') {
      list = list.filter((p) => p.price > 5000);
    }

    // Sorting
    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [allProducts, categoryMeta, categorySlug, priceFilter, sortBy]);

  return (
    <div className="min-h-screen bg-warm-ivory animate-fade-in pb-20">
      {/* Category Header */}
      <section className="pt-8 pb-10 sm:pb-12 border-b border-subtle-border bg-gradient-to-b from-soft-beige/40 to-warm-ivory" aria-label="Category Header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/shop');
              }}
              className="hover:text-champagne-gold transition-colors"
            >
              Shop
            </a>
            <ChevronRight size={12} className="text-charcoal-light/60" />
            <span className="text-deep-charcoal font-medium">{categoryMeta.title}</span>
          </nav>

          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="inline-block text-[11px] font-semibold tracking-[0.24em] uppercase text-champagne-gold mb-2">
              CURATED COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-deep-charcoal mb-3">
              {categoryMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto leading-relaxed">
              {categoryMeta.description}
            </p>
          </div>
        </div>
      </section>

      {/* Sorting & Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded border border-subtle-border shadow-xs">
          <div className="flex items-center gap-2 text-xs text-charcoal-muted">
            <SlidersHorizontal size={14} className="text-champagne-gold" />
            <span>Filter by Price:</span>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="py-1 px-2.5 bg-warm-ivory border border-subtle-border rounded text-xs text-deep-charcoal outline-none cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="under3500">Under Rs. 3,500</option>
              <option value="3500to5000">Rs. 3,500 – Rs. 5,000</option>
              <option value="above5000">Above Rs. 5,000</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-charcoal-light hidden sm:inline">
              Showing {categoryProducts.length} pieces
            </span>
            <div className="flex items-center gap-2 text-xs text-charcoal-muted">
              <ArrowUpDown size={14} className="text-champagne-gold" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1 px-2.5 bg-warm-ivory border border-subtle-border rounded text-xs text-deep-charcoal outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded border border-subtle-border p-8">
              <h3 className="font-serif text-lg text-deep-charcoal mb-2">No pieces found</h3>
              <p className="text-xs text-charcoal-muted mb-4">Try clearing your price filter to see more jewellery designs.</p>
              <button
                onClick={() => setPriceFilter('all')}
                className="py-2 px-5 bg-deep-charcoal text-white text-xs font-bold uppercase rounded hover:bg-champagne-gold transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categoryProducts.map((product) => {
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
          )}

          {/* Navigation Bar at Bottom */}
          <div className="mt-14 sm:mt-16 pt-8 border-t border-subtle-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              className="inline-flex items-center gap-2 bg-transparent text-deep-charcoal border border-deep-charcoal hover:bg-deep-charcoal hover:text-white px-6 py-2.5 rounded text-[11px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate('/shop')}
            >
              <ArrowLeft size={14} />
              <span>Back to All Collections</span>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-charcoal-muted">
              <span className="mr-1">Explore Others:</span>
              {SHOP_CATEGORIES.filter((c) => c.slug !== categorySlug).map((c) => (
                <button
                  key={c.slug}
                  className="py-1 px-3 rounded-full border border-subtle-border bg-white text-deep-charcoal hover:border-champagne-gold hover:bg-champagne-gold hover:text-white text-xs transition-colors cursor-pointer"
                  onClick={() => onNavigate(`/shop/${c.slug}`)}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
