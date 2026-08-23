import React, { useState, useEffect } from 'react';
import { ChevronRight, Heart, ShoppingBag, Truck, ShieldCheck, Sparkles, Star, CheckCircle2, RotateCcw, Share2, Check } from 'lucide-react';
import { dbGetProductById, dbGetProducts, dbGetReviews, dbAddReview } from '../services/db';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({
  productId,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  cartItems,
  onNavigate,
  onQuickView
}) {
  const [product, setProduct] = useState(() => dbGetProductById(productId));
  const [selectedImage, setSelectedImage] = useState(() => {
    const p = dbGetProductById(productId);
    return p?.images?.[0] || p?.image || '';
  });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [allReviews, setAllReviews] = useState(() => dbGetReviews());
  const [shareCopied, setShareCopied] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleDB = () => {
      const p = dbGetProductById(productId);
      if (p) {
        setProduct(p);
        setSelectedImage(p.images?.[0] || p.image);
      }
      setAllReviews(dbGetReviews());
    };
    window.addEventListener('zewellery_db_updated', handleDB);
    return () => window.removeEventListener('zewellery_db_updated', handleDB);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-warm-ivory">
        <h2 className="font-serif text-2xl text-deep-charcoal mb-3">Product Not Found</h2>
        <p className="text-xs text-charcoal-muted mb-6">The jewellery piece you are seeking may be vaulted or unavailable.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="bg-deep-charcoal text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded hover:bg-champagne-gold transition-colors cursor-pointer"
        >
          Return to Boutique
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isInCart = cartItems.some((item) => item.id === product.id);
  const allProducts = dbGetProducts();
  const relatedProducts = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image, product.secondaryImage].filter(Boolean);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2200);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const added = dbAddReview({
      name: newAuthor,
      city: newCity,
      rating: newRating,
      title: `${product.name} Review`,
      comment: `“${newComment.slice(0, 60)}...”`,
      fullComment: newComment,
      product: product.name
    });

    setAllReviews((prev) => [added, ...prev]);
    setReviewSubmitted(true);
    setNewAuthor('');
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-warm-ivory animate-fade-in pb-20">
      {/* Breadcrumb Navigation */}
      <section className="pt-6 pb-4 border-b border-subtle-border bg-white/50" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-charcoal-light flex-wrap">
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
            <a
              href={`/shop/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/shop/${product.category.toLowerCase().replace(/\s+/g, '-')}`);
              }}
              className="hover:text-champagne-gold transition-colors"
            >
              {product.category}
            </a>
            <ChevronRight size={12} className="text-charcoal-light/60" />
            <span className="text-deep-charcoal font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Product Showcase Section */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-start">
            {/* Left: Multi-Image Gallery */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 static lg:sticky lg:top-24">
              {/* Thumbnails list */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px] pb-2 sm:pb-0 shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 sm:w-20 aspect-square rounded overflow-hidden border-2 transition-all cursor-pointer bg-white shrink-0 ${
                      selectedImage === img
                        ? 'border-champagne-gold shadow-md scale-95'
                        : 'border-subtle-border opacity-70 hover:opacity-100 hover:border-champagne-gold/60'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} perspective ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/products/brac-1-main.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Main Viewport */}
              <div className="relative grow aspect-square sm:aspect-[1/1.05] bg-[#F8F5F0] rounded-lg border border-subtle-border overflow-hidden group shadow-md flex items-center justify-center">
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-champagne-gold text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded z-10 shadow-sm">
                    {product.badge}
                  </span>
                )}

                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/brac-1-main.jpg';
                  }}
                />

                {/* Floating Share button */}
                <button
                  onClick={handleShare}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full border border-subtle-border text-deep-charcoal hover:bg-champagne-gold hover:text-white transition-all shadow-sm cursor-pointer"
                  title="Share this Piece"
                  aria-label="Share Link"
                >
                  {shareCopied ? <Check size={16} /> : <Share2 size={16} />}
                </button>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[11px] font-bold tracking-[0.24em] uppercase text-champagne-gold">
                  {product.category} &bull; {product.sku || `ZEW-${product.id.toUpperCase()}`}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full font-medium">
                  <CheckCircle2 size={12} /> In Stock (Lahore Vault)
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-deep-charcoal font-medium mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Social Proof */}
              <div className="flex items-center gap-3 mb-5 text-xs text-charcoal-muted">
                <div className="flex text-champagne-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#C6A15B" color="#C6A15B" />
                  ))}
                </div>
                <span>4.9 / 5.0 ({product.reviewsCount || 38} verified Pakistani reviews)</span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 p-4 bg-white rounded border border-subtle-border mb-6">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-deep-charcoal">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-charcoal-light line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-bold text-champagne-gold ml-auto bg-champagne-gold/10 px-2 py-1 rounded">
                    SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Editorial Description */}
              <p className="text-sm text-charcoal-muted leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Highlights Feature Pills */}
              <div className="grid grid-cols-2 gap-2.5 mb-7 text-xs">
                <div className="p-3 bg-white rounded border border-subtle-border flex items-center gap-2.5">
                  <Sparkles size={16} className="text-champagne-gold shrink-0" />
                  <span>Triple 18K Micron Gold Finish</span>
                </div>
                <div className="p-3 bg-white rounded border border-subtle-border flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-champagne-gold shrink-0" />
                  <span>100% Hypoallergenic & Lead-Free</span>
                </div>
              </div>

              {/* Quantity Selector & Action CTAs */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="inline-flex items-center border border-subtle-border bg-white rounded p-1">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center text-sm text-deep-charcoal hover:bg-warm-ivory rounded cursor-pointer"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center text-sm text-deep-charcoal hover:bg-warm-ivory rounded cursor-pointer"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart(product, quantity)}
                  className="grow inline-flex items-center justify-center gap-2 bg-deep-charcoal hover:bg-champagne-gold text-white py-3.5 px-6 text-xs font-bold uppercase tracking-[0.14em] rounded transition-all duration-300 shadow-md cursor-pointer"
                >
                  <ShoppingBag size={15} />
                  <span>{isInCart ? 'ADD ANOTHER TO BAG' : 'ADD TO SHOPPING BAG'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3.5 rounded border border-subtle-border bg-white transition-all cursor-pointer ${
                    isWishlisted ? 'text-red-500 border-red-200' : 'text-deep-charcoal hover:text-red-500'
                  }`}
                  aria-label="Save to Wishlist"
                  title={isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                >
                  <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
                </button>
              </div>

              {/* Guarantee Bar */}
              <div className="p-4 bg-soft-beige rounded border border-subtle-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-charcoal-muted">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-champagne-gold shrink-0" />
                  <span>Free Express Nationwide Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-champagne-gold shrink-0" />
                  <span>7-Day Hassle-Free Exchange</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications, Dimensions & Reviews Tabs */}
          <div className="mt-16 sm:mt-20 border-t border-subtle-border pt-10">
            <div className="flex border-b border-subtle-border mb-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-6 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                  activeTab === 'details'
                    ? 'border-champagne-gold text-champagne-gold'
                    : 'border-transparent text-charcoal-muted hover:text-deep-charcoal'
                }`}
              >
                Specifications & Craftsmanship
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`py-3 px-6 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                  activeTab === 'care'
                    ? 'border-champagne-gold text-champagne-gold'
                    : 'border-transparent text-charcoal-muted hover:text-deep-charcoal'
                }`}
              >
                Jewellery Care & Packaging
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3 px-6 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                  activeTab === 'reviews'
                    ? 'border-champagne-gold text-champagne-gold'
                    : 'border-transparent text-charcoal-muted hover:text-deep-charcoal'
                }`}
              >
                Customer Reviews ({allReviews.length})
              </button>
            </div>

            {/* Tab: Details */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-charcoal-muted">
                <div className="space-y-3 bg-white p-6 rounded border border-subtle-border">
                  <h3 className="font-serif text-lg font-medium text-deep-charcoal mb-2">Technical Details</h3>
                  <div><strong className="text-deep-charcoal">Composition:</strong> {product.material}</div>
                  <div><strong className="text-deep-charcoal">Dimensions / Size:</strong> {product.dimensions}</div>
                  <div><strong className="text-deep-charcoal">Finish:</strong> Anti-Tarnish 18K/24K Gold Micron Vermeil</div>
                  <div><strong className="text-deep-charcoal">Stones:</strong> AAA+ Hand-Selected Austrian Cubic Zirconia & Cultured Pearls</div>
                </div>

                <div className="space-y-3 bg-white p-6 rounded border border-subtle-border">
                  <h3 className="font-serif text-lg font-medium text-deep-charcoal mb-2">Artisan Promise</h3>
                  <p className="text-xs leading-relaxed">
                    Every piece is crafted in limited artisan runs. We enforce rigorous quality benchmarks to ensure that clasps, prongs, and filigree motifs endure everyday wear while retaining radiant luster.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Care & Packaging */}
            {activeTab === 'care' && (
              <div className="bg-white p-6 rounded border border-subtle-border grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-charcoal-muted leading-relaxed">
                <div>
                  <h4 className="font-serif text-base font-medium text-deep-charcoal mb-2">The Signature Unboxing</h4>
                  <p className="mb-2">Your order arrives in our signature Zewellery velvet keepsake box with:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Velvet lined travel pouch</li>
                    <li>Microfiber gold polishing cloth</li>
                    <li>Certificate of authenticity card</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-deep-charcoal mb-2">Care Recommendations</h4>
                  <p>
                    Store in the provided pouch. Avoid direct application of perfumes, lotions, and chlorine. Gently wipe with the polishing cloth to maintain brilliance.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Submit review */}
                <div className="bg-white p-6 rounded border border-subtle-border max-w-xl">
                  <h4 className="font-serif text-base font-medium text-deep-charcoal mb-3">Write a Customer Review</h4>
                  {reviewSubmitted ? (
                    <div className="p-3 bg-green-50 text-green-800 text-xs rounded border border-green-200 flex items-center gap-2">
                      <Check size={16} />
                      <span>Shukriya! Your verified review has been submitted.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
                      <div>
                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                          Star Rating
                        </label>
                        <div className="flex gap-1 text-champagne-gold">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="cursor-pointer"
                            >
                              <Star size={18} fill={star <= newRating ? '#C6A15B' : 'none'} color="#C6A15B" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          placeholder="Your Name"
                          className="px-3 py-2 bg-warm-ivory border border-subtle-border rounded text-xs outline-none"
                        />
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          placeholder="Your City (e.g. Lahore)"
                          className="px-3 py-2 bg-warm-ivory border border-subtle-border rounded text-xs outline-none"
                        />
                      </div>

                      <textarea
                        required
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your experience regarding craftsmanship, packaging, and delivery..."
                        rows={3}
                        className="px-3 py-2 bg-warm-ivory border border-subtle-border rounded text-xs outline-none"
                      />

                      <button
                        type="submit"
                        className="py-2.5 px-5 bg-deep-charcoal hover:bg-champagne-gold text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer w-fit"
                      >
                        Submit Review
                      </button>
                    </form>
                  )}
                </div>

                {/* Reviews List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allReviews.map((rev) => (
                    <div key={rev.id} className="p-5 bg-white rounded border border-subtle-border">
                      <div className="flex text-champagne-gold mb-2">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} size={13} fill="#C6A15B" color="#C6A15B" />
                        ))}
                      </div>
                      <p className="text-xs font-serif italic text-deep-charcoal mb-2">{rev.comment}</p>
                      <p className="text-xs text-charcoal-muted mb-3">{rev.fullComment}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-subtle-border text-[11px] text-charcoal-light">
                        <span className="font-bold text-deep-charcoal">{rev.name} ({rev.city})</span>
                        <span className="text-champagne-gold font-medium flex items-center gap-1">
                          <CheckCircle2 size={11} /> Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Pieces Showcase */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 border-t border-subtle-border pt-12">
              <div className="text-center mb-10">
                <span className="text-[11px] font-bold tracking-[0.24em] uppercase text-champagne-gold block mb-2">
                  PAIR IT WITH
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-deep-charcoal">
                  Complete Your Look
                </h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard
                    key={rel.id}
                    product={rel}
                    isWishlisted={wishlist.some((i) => i.id === rel.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                    isInCart={cartItems.some((i) => i.id === rel.id)}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
