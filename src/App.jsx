import React, { useState, useEffect } from 'react';
import './App.css';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import CategorySection from './components/CategorySection';
import NewArrivals from './components/NewArrivals';
import EditorialBanner from './components/EditorialBanner';
import BestSellers from './components/BestSellers';
import BrandStory from './components/BrandStory';
import OccasionBanner from './components/OccasionBanner';
import CustomerReviews from './components/CustomerReviews';
import InstagramShowcase from './components/InstagramShowcase';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import PolicyModal from './components/PolicyModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import Toast from './components/Toast';

import ShopPage from './pages/ShopPage';
import CategoryListingPage from './pages/CategoryListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AccountPage from './pages/AccountPage';
import AdminDashboard from './pages/AdminDashboard';
import AboutStoryPage from './pages/AboutStoryPage';

import {
  dbGetCart,
  dbSaveCart,
  dbGetWishlist,
  dbSaveWishlist,
  dbGetCurrentUser
} from './services/db';

export default function App() {
  // Routing State
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State Management linked to Persistent Database
  const [currentUser, setCurrentUser] = useState(() => dbGetCurrentUser());
  const [wishlist, setWishlist] = useState(() => dbGetWishlist());
  const [cartItems, setCartItems] = useState(() => dbGetCart());

  // Overlays & Modals State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authRedirectAction, setAuthRedirectAction] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState('shipping');
  const [toasts, setToasts] = useState([]);

  // Subscribe to DB reactive events
  useEffect(() => {
    const handleDBChange = () => {
      setCurrentUser(dbGetCurrentUser());
      setWishlist(dbGetWishlist());
      setCartItems(dbGetCart());
    };
    window.addEventListener('zewellery_db_updated', handleDBChange);
    return () => window.removeEventListener('zewellery_db_updated', handleDBChange);
  }, []);

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter((item) => item.id !== product.id);
      addToast(`Removed "${product.name}" from your wishlist.`);
    } else {
      updated = [...wishlist, product];
      addToast(`Saved "${product.name}" to your wishlist.`);
    }
    setWishlist(updated);
    dbSaveWishlist(updated);
  };

  // Cart Handlers
  const handleAddToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...cartItems, { ...product, quantity }];
    }
    setCartItems(updated);
    dbSaveCart(updated);
    addToast(`Added "${product.name}" (${quantity}x) to your bag.`);
    setCartOpen(true);
  };

  const handleUpdateQty = (productId, quantity) => {
    const updated = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(updated);
    dbSaveCart(updated);
  };

  const handleRemoveFromCart = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    const updated = cartItems.filter((i) => i.id !== productId);
    setCartItems(updated);
    dbSaveCart(updated);
    if (item) {
      addToast(`Removed "${item.name}" from your shopping bag.`);
    }
  };

  const handleMoveWishlistToCart = (item) => {
    handleAddToCart(item, 1);
    handleToggleWishlist(item);
  };

  // Checkout Flow & Auth Gate
  const handleInitiateCheckout = () => {
    setCartOpen(false);
    if (!currentUser) {
      setAuthRedirectAction('CHECKOUT');
      setAuthOpen(true);
    } else {
      setCheckoutOpen(true);
    }
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    addToast(`Welcome back, ${user.name}!`);
    if (authRedirectAction === 'CHECKOUT') {
      setCheckoutOpen(true);
      setAuthRedirectAction(null);
    } else if (authRedirectAction === 'ACCOUNT') {
      navigate('/account');
      setAuthRedirectAction(null);
    }
  };

  const handleOrderSuccess = (order) => {
    setCheckoutOpen(false);
    setCartItems([]);
    dbSaveCart([]);
    setConfirmedOrder(order);
    addToast(`Order ${order.id} placed successfully!`);
  };

  const openPolicyModal = (tab = 'shipping') => {
    setPolicyTab(tab);
    setPolicyOpen(true);
  };

  // Render Router View
  const renderCurrentView = () => {
    // 1. Admin Management Dashboard (/admin)
    if (currentPath === '/admin' || currentPath === '/admin/') {
      return <AdminDashboard onNavigate={navigate} />;
    }

    // 2. Client Account & Orders Dashboard (/account)
    if (currentPath === '/account' || currentPath === '/account/') {
      return (
        <AccountPage
          onNavigate={navigate}
          onOpenAuth={() => {
            setAuthRedirectAction('ACCOUNT');
            setAuthOpen(true);
          }}
        />
      );
    }

    // 3. Product Detail Page (/product/:id)
    if (currentPath.startsWith('/product/')) {
      const productId = currentPath.replace('/product/', '').replace('/', '');
      return (
        <ProductDetailPage
          productId={productId}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
          onNavigate={navigate}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      );
    }

    // 4. Category Listing Page (/shop/:slug)
    if (currentPath.startsWith('/shop/') && currentPath !== '/shop' && currentPath !== '/shop/') {
      const slug = currentPath.replace('/shop/', '').replace('/', '');
      return (
        <CategoryListingPage
          categorySlug={slug}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          cartItems={cartItems}
          onNavigate={navigate}
        />
      );
    }

    // 5. Shop Boutique Hub (/shop)
    if (currentPath === '/shop' || currentPath === '/shop/') {
      return (
        <ShopPage
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          cartItems={cartItems}
          onNavigate={navigate}
        />
      );
    }

    // 6. Our Brand Story Page (/about or /story)
    if (currentPath === '/about' || currentPath === '/about/' || currentPath === '/story' || currentPath === '/story/') {
      return <AboutStoryPage onNavigate={navigate} />;
    }

    // 7. Default: Storefront Landing Page (/)
    return (
      <main id="main-content">
        <Hero
          onShopNow={() => navigate('/shop')}
          onExploreCollection={() => navigate('/shop')}
        />

        <TrustStrip />

        <CategorySection
          onSelectCategory={(categoryName) => {
            const cat = categoryName.toLowerCase().replace(/\s+/g, '-');
            navigate(`/shop/${cat}`);
          }}
        />

        <NewArrivals
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          cartItems={cartItems}
          onViewAll={() => navigate('/shop')}
          onNavigate={navigate}
        />

        <EditorialBanner
          onExploreCollection={() => navigate('/shop')}
        />

        <BestSellers
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          cartItems={cartItems}
          onViewAll={() => navigate('/shop')}
          onNavigate={navigate}
        />

        <BrandStory
          onReadStory={() => navigate('/about')}
        />

        <OccasionBanner
          onShopOccasion={() => navigate('/shop')}
        />

        <CustomerReviews />

        <InstagramShowcase />

        <Newsletter
          onSubscribe={(email) => {
            addToast(`Welcome to the Zewellery Circle! Email voucher sent to ${email}`);
          }}
        />
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-warm-ivory text-deep-charcoal font-sans antialiased selection:bg-champagne-gold/20 flex flex-col justify-between">
      <div>
        {/* Global Announcement Bar */}
        <AnnouncementBar />

        {/* Global Sticky Luxury Header */}
        <Header
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          wishlistCount={wishlist.length}
          currentUser={currentUser}
          onOpenCart={() => setCartOpen(true)}
          onOpenWishlist={() => setWishlistOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAccount={() => {
            if (currentUser) {
              navigate('/account');
            } else {
              setAuthRedirectAction('ACCOUNT');
              setAuthOpen(true);
            }
          }}
          onNavigate={navigate}
          currentPath={currentPath}
        />

        {/* Dynamic Route View */}
        {renderCurrentView()}
      </div>

      {/* Global Luxury Footer */}
      <Footer onNavigate={navigate} onOpenPolicy={openPolicyModal} />

      {/* Interactive Overlays & Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={wishlist.some((i) => i.id === quickViewProduct?.id)}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleInitiateCheckout}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlist}
        onRemoveItem={handleToggleWishlist}
        onMoveToCart={handleMoveWishlistToCart}
        onNavigate={navigate}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(p) => navigate(`/product/${p.id}`)}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewAccount={() => navigate('/account')}
        onContinueShopping={() => navigate('/shop')}
      />

      <PolicyModal
        isOpen={policyOpen}
        initialTab={policyTab}
        onClose={() => setPolicyOpen(false)}
      />

      <WhatsAppFloatingButton />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
