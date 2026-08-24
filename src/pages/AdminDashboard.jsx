import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Eye,
  EyeOff,
  ArrowLeft,
  Lock,
  Mail,
  ShieldCheck,
  LogOut,
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import {
  dbGetProducts,
  dbAddProduct,
  dbUpdateProduct,
  dbDeleteProduct,
  dbGetOrders,
  dbUpdateOrderStatus,
  dbGetUsers,
  dbGetCurrentUser,
  dbLogin,
  dbLogout
} from '../services/db';

export default function AdminDashboard({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(() => dbGetCurrentUser());
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState(() => dbGetProducts());
  const [orders, setOrders] = useState(() => dbGetOrders());
  const [users, setUsers] = useState(() => dbGetUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('ALL');

  // Single Master Admin Credentials State (Never Auto-Filled)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Modal for Add / Edit Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Necklaces',
    price: '',
    originalPrice: '',
    badge: '',
    image: '',
    secondaryImage: '',
    extraImage3: '',
    description: '',
    material: '',
    dimensions: '',
    inStock: true
  });

  // Modal for View Order Details
  const [viewingOrder, setViewingOrder] = useState(null);

  const loadAllData = () => {
    setCurrentUser(dbGetCurrentUser());
    setProducts(dbGetProducts());
    setOrders(dbGetOrders());
    setUsers(dbGetUsers());
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleDBChange = () => loadAllData();
    window.addEventListener('zewellery_db_updated', handleDBChange);
    return () => window.removeEventListener('zewellery_db_updated', handleDBChange);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const res = dbLogin(adminEmail, adminPassword);
    if (!res.success) {
      setAuthError(res.error);
    } else if (res.user.role !== 'admin') {
      setAuthError('This account does not have Administrator privileges. Please sign in with the authorized Admin account.');
    } else {
      setCurrentUser(res.user);
      loadAllData();
    }
  };

  const handleAdminSignOut = () => {
    dbLogout();
    setCurrentUser(null);
  };

  // Compute analytics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = users.length;

  // Filtered lists
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status?.toUpperCase() === orderFilter;
  });

  // Handle Product Form
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'Necklaces',
      price: '',
      originalPrice: '',
      badge: '',
      image: '',
      secondaryImage: '',
      extraImage3: '',
      description: 'Handcrafted luxury jewellery with 18K gold micron plating.',
      material: '18K Gold Micron Finish & Austrian Cubic Zirconia',
      dimensions: 'Standard fit',
      inStock: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      badge: prod.badge || '',
      image: prod.image,
      secondaryImage: prod.secondaryImage || prod.images?.[1] || '',
      extraImage3: prod.images?.[2] || '',
      description: prod.description,
      material: prod.material,
      dimensions: prod.dimensions,
      inStock: prod.inStock !== false
    });
    setIsProductModalOpen(true);
  };

  // Upload Local Image File from Computer
  const handleImageFileUpload = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProductForm((prev) => ({
          ...prev,
          [field]: uploadEvent.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const imagesArray = [productForm.image, productForm.secondaryImage, productForm.extraImage3].filter(Boolean);

    if (editingProductId) {
      dbUpdateProduct(editingProductId, {
        ...productForm,
        images: imagesArray
      });
    } else {
      dbAddProduct({
        ...productForm,
        images: imagesArray
      });
    }

    setIsProductModalOpen(false);
    loadAllData();
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the boutique?`)) {
      dbDeleteProduct(id);
      loadAllData();
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    dbUpdateOrderStatus(orderId, newStatus);
    loadAllData();
  };

  // ---------------- ADMIN AUTHENTICATION GATE (SINGLE MASTER ADMIN ONLY) ----------------
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-warm-ivory flex items-center justify-center p-4 py-12 animate-fade-in">
        <div className="bg-deep-charcoal border border-champagne-gold/40 rounded-lg max-w-md w-full p-8 shadow-2xl relative">
          <div className="w-16 h-16 rounded-full bg-champagne-gold/15 border border-champagne-gold/40 flex items-center justify-center mx-auto mb-4 overflow-hidden p-2.5 shadow-md">
            <img src="/images/logo.png" alt="Zewellery.pk" className="w-full h-full object-contain drop-shadow-md" />
          </div>

          <div className="text-center mb-6">
            <span className="font-serif text-xl tracking-[0.2em] font-semibold text-warm-ivory block">
              ZEWELLERY<span className="text-champagne-gold">.PK</span>
            </span>
            <span className="text-[10px] tracking-[0.24em] uppercase text-champagne-gold font-bold block mt-1">
              ADMINISTRATOR MANAGEMENT PORTAL
            </span>
            <p className="text-xs text-warm-ivory/70 mt-2 leading-relaxed">
              Authentication required. Only the authorized boutique administrator can access the management console.
            </p>
          </div>

          {/* If logged in as customer */}
          {currentUser && currentUser.role !== 'admin' && (
            <div className="mb-4 p-3 bg-amber-900/30 border border-amber-500/40 rounded text-xs text-amber-200">
              Currently signed in as customer: <strong>{currentUser.email}</strong>. Please authenticate with administrator credentials below.
            </div>
          )}

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded text-xs text-red-200 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} autoComplete="off" className="flex flex-col gap-4 text-xs">
            <div>
              <label className="font-bold uppercase tracking-wider block mb-1.5 text-warm-ivory/90">
                Admin Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="zew_admin_identifier"
                  autoComplete="new-password"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@zewellery.pk"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white/10 border border-white/20 rounded text-warm-ivory outline-none focus:border-champagne-gold"
                />
                <Mail size={14} className="absolute left-3 top-3.5 text-champagne-gold" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold uppercase tracking-wider text-warm-ivory/90">
                  Admin Password *
                </label>
              </div>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  name="zew_admin_secret_key"
                  autoComplete="new-password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-12 py-2.5 bg-white/10 border border-white/20 rounded text-warm-ivory outline-none focus:border-champagne-gold"
                />
                <Lock size={14} className="absolute left-3 top-3.5 text-champagne-gold" />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-white/15 hover:bg-champagne-gold hover:text-deep-charcoal text-champagne-gold transition-all cursor-pointer z-10 flex items-center justify-center border border-white/15 shadow-sm"
                  title={showAdminPassword ? "Hide Password" : "Show Password"}
                  aria-label={showAdminPassword ? "Hide Password" : "Show Password"}
                >
                  {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3.5 bg-champagne-gold hover:bg-champagne-gold-hover text-deep-charcoal font-bold uppercase tracking-[0.16em] rounded transition-all shadow-lg cursor-pointer"
            >
              AUTHENTICATE & ENTER CONSOLE
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-warm-ivory/60">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-champagne-gold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Return to Storefront</span>
            </button>
            <span className="text-[10px] text-champagne-gold/70">Zewellery Master Console</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- LOGGED IN ADMIN DASHBOARD ----------------
  return (
    <div className="min-h-screen bg-soft-beige/40 text-deep-charcoal pb-20 animate-fade-in">
      {/* Top Header Bar */}
      <header className="bg-deep-charcoal text-warm-ivory py-3 sm:py-4 px-3 sm:px-8 border-b border-champagne-gold/30 flex items-center justify-between sticky top-0 z-40 shadow-md gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => onNavigate('/')}
            className="text-warm-ivory/70 hover:text-champagne-gold transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer shrink-0"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Storefront</span>
          </button>
          <span className="text-white/30 hidden sm:inline">&bull;</span>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <ShieldCheck size={17} className="text-champagne-gold shrink-0" />
            <span className="font-serif font-bold text-xs sm:text-base tracking-wider text-warm-ivory truncate">
              ZEWELLERY ADMIN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-warm-ivory">{currentUser.name}</div>
            <div className="text-[10px] text-champagne-gold uppercase tracking-wider">{currentUser.email}</div>
          </div>
          <button
            onClick={handleAdminSignOut}
            className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-red-900/40 hover:bg-red-900/70 border border-red-500/40 rounded text-red-200 text-xs font-semibold cursor-pointer transition-all shrink-0"
            title="Sign Out as Admin"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-md border border-subtle-border shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-champagne-gold/15 text-champagne-gold flex items-center justify-center shrink-0">
              <DollarSign size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-charcoal-muted block">
                Total Revenue
              </span>
              <span className="font-serif text-lg sm:text-2xl font-bold text-deep-charcoal">
                Rs. {totalRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-md border border-subtle-border shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-charcoal-muted block">
                Total Orders
              </span>
              <span className="font-serif text-lg sm:text-2xl font-bold text-deep-charcoal">
                {totalOrders}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-md border border-subtle-border shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
              <Package size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-charcoal-muted block">
                Active Products
              </span>
              <span className="font-serif text-lg sm:text-2xl font-bold text-deep-charcoal">
                {totalProducts}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-md border border-subtle-border shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/15 text-purple-600 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-charcoal-muted block">
                Registered Clients
              </span>
              <span className="font-serif text-lg sm:text-2xl font-bold text-deep-charcoal">
                {totalCustomers}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-subtle-border mb-6 gap-2 sm:gap-6 text-xs sm:text-sm font-semibold uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-champagne-gold text-deep-charcoal font-bold'
                : 'border-transparent text-charcoal-muted hover:text-deep-charcoal'
            }`}
          >
            <Package size={16} />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-champagne-gold text-deep-charcoal font-bold'
                : 'border-transparent text-charcoal-muted hover:text-deep-charcoal'
            }`}
          >
            <ShoppingBag size={16} />
            <span>Orders & Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-champagne-gold text-deep-charcoal font-bold'
                : 'border-transparent text-charcoal-muted hover:text-deep-charcoal'
            }`}
          >
            <Users size={16} />
            <span>Customer Accounts ({users.length})</span>
          </button>
        </div>

        {/* ---------------- TAB 1: PRODUCTS ---------------- */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-subtle-border">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by title or category..."
                  className="w-full pl-9 pr-4 py-2 bg-soft-beige/50 border border-subtle-border rounded text-xs outline-none focus:border-champagne-gold"
                />
                <Search size={15} className="absolute left-3 top-2.5 text-charcoal-light" />
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 bg-deep-charcoal hover:bg-champagne-gold text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow cursor-pointer"
              >
                <Plus size={16} />
                <span>Add New Jewellery Piece</span>
              </button>
            </div>

            <div className="bg-white rounded-md border border-subtle-border overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-soft-beige/70 border-b border-subtle-border text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
                      <th className="py-3 px-4">Piece</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Badge</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle-border">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-charcoal-muted">
                          No products found matching "{searchTerm}".
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-soft-beige/30 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded bg-soft-beige border border-subtle-border shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/products/ring-1-main.jpg';
                              }}
                            />
                            <div>
                              <div className="font-bold text-deep-charcoal text-xs">{prod.name}</div>
                              <div className="text-[10px] text-charcoal-light font-mono">ID: {prod.id}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{prod.category}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-deep-charcoal">Rs. {prod.price.toLocaleString()}</span>
                            {prod.originalPrice && (
                              <span className="text-[10px] text-charcoal-light line-through ml-1.5">
                                Rs. {prod.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {prod.badge ? (
                              <span className="px-2 py-0.5 bg-champagne-gold/20 text-deep-charcoal font-bold rounded text-[10px]">
                                {prod.badge}
                              </span>
                            ) : (
                              <span className="text-charcoal-light/50">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                prod.inStock !== false
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {prod.inStock !== false ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-1.5 bg-soft-beige hover:bg-champagne-gold hover:text-white rounded text-deep-charcoal transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded text-red-600 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: ORDERS ---------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-md border border-subtle-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">Filter:</span>
                {['ALL', 'PENDING', 'CONFIRMED', 'DISPATCHED', 'DELIVERED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`py-1 px-3 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      orderFilter === st
                        ? 'bg-deep-charcoal text-white'
                        : 'bg-soft-beige text-charcoal-muted hover:text-deep-charcoal'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-md border border-subtle-border overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-soft-beige/70 border-b border-subtle-border text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Client & Phone</th>
                      <th className="py-3 px-4">City / Address</th>
                      <th className="py-3 px-4">Items / Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle-border">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-charcoal-muted">
                          No orders found under "{orderFilter}".
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-soft-beige/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-deep-charcoal">{ord.id}</div>
                            <div className="text-[10px] text-charcoal-light">
                              {new Date(ord.createdAt).toLocaleDateString()} &bull; {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-deep-charcoal">{ord.customerName}</div>
                            <div className="text-[10px] text-charcoal-light font-mono">{ord.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-deep-charcoal">{ord.city}</div>
                            <div className="text-[10px] text-charcoal-light truncate max-w-xs">{ord.address}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-deep-charcoal">Rs. {ord.total?.toLocaleString()}</div>
                            <div className="text-[10px] text-charcoal-light">
                              {ord.items?.length || 0} items &bull; {ord.paymentMethod || 'COD'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                              className="text-xs py-1 px-2 rounded border border-subtle-border bg-white font-semibold outline-none focus:border-champagne-gold cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packaging">Packaging</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setViewingOrder(ord)}
                              className="py-1 px-2.5 bg-deep-charcoal text-white rounded text-[11px] font-semibold hover:bg-champagne-gold transition-colors cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: CUSTOMER ACCOUNTS ---------------- */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-md border border-subtle-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-soft-beige/70 border-b border-subtle-border text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-soft-beige/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-deep-charcoal flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-champagne-gold/20 text-deep-charcoal font-bold flex items-center justify-center text-xs">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">{u.email}</td>
                      <td className="py-3 px-4 font-mono">{u.phone || 'N/A'}</td>
                      <td className="py-3 px-4">{u.city || 'Pakistan'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {u.role || 'customer'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-charcoal-light text-[10px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active Member'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- MODAL: ADD / EDIT PRODUCT ---------------- */}
        {isProductModalOpen && (
          <div
            className="fixed inset-0 bg-deep-charcoal/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
            onClick={() => setIsProductModalOpen(false)}
          >
            <div
              className="bg-white rounded-md border border-subtle-border w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl animate-slide-up my-auto max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center text-deep-charcoal hover:bg-champagne-gold hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h2 className="font-serif text-2xl text-deep-charcoal mb-4">
                {editingProductId ? 'Edit Jewellery Piece' : 'Add New Jewellery Piece'}
              </h2>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold uppercase tracking-wider block mb-1">Piece Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2.5 bg-white border border-subtle-border rounded outline-none focus:border-champagne-gold"
                    placeholder="e.g. Royal Emerald Choker"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider block mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 bg-white border border-subtle-border rounded outline-none focus:border-champagne-gold"
                  >
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Rings">Rings</option>
                    <option value="Nose Rings">Nose Rings</option>
                    <option value="Bracelets">Bracelets</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider block mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full p-2.5 bg-white border border-subtle-border rounded outline-none focus:border-champagne-gold"
                    placeholder="e.g. NEW, BEST SELLER, HERITAGE"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider block mb-1">Price in PKR (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-subtle-border rounded outline-none focus:border-champagne-gold"
                    placeholder="3950"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider block mb-1">Original Price (Strike-through)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) || '' })}
                    className="w-full p-2.5 bg-white border border-subtle-border rounded outline-none focus:border-champagne-gold"
                    placeholder="4800"
                  />
                </div>

                {/* ---------------- 1. PRIMARY IMAGE FILE UPLOAD / URL ---------------- */}
                <div className="sm:col-span-2 p-3 bg-[#FAF7F2] border border-[#E8E0D5] rounded">
                  <label className="font-bold uppercase tracking-wider text-[#24211F] block mb-1">
                    Primary Image (Main Catalog Photo) *
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {productForm.image ? (
                      <div className="relative w-16 h-16 rounded overflow-hidden border border-[#E8E0D5] bg-white shrink-0">
                        <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProductForm({ ...productForm, image: '' })}
                          className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                          title="Remove image"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded border border-dashed border-[#C5A059] flex flex-col items-center justify-center bg-white text-[#7A7470] shrink-0">
                        <ImageIcon size={20} className="text-[#C5A059]" />
                        <span className="text-[9px] mt-0.5">No image</span>
                      </div>
                    )}

                    <div className="flex-1 w-full flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#24211F] hover:bg-[#C5A059] text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs">
                          <Upload size={13} />
                          <span>Upload From Computer</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload('image', e)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10px] text-[#7A7470]">or enter URL below</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="Paste image URL or upload from your computer"
                        className="w-full p-2 bg-white border border-[#E8E0D5] rounded text-xs outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>

                {/* ---------------- 2. ANGLE 2 IMAGE FILE UPLOAD / URL ---------------- */}
                <div className="p-3 bg-[#FAF7F2] border border-[#E8E0D5] rounded">
                  <label className="font-bold uppercase tracking-wider text-[#24211F] block mb-1">
                    Angle 2 Image (Detail View)
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    {productForm.secondaryImage && (
                      <img src={productForm.secondaryImage} alt="Angle 2" className="w-10 h-10 object-cover rounded border" />
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E0D5] hover:border-[#C5A059] text-[#24211F] rounded text-[11px] font-semibold transition-colors">
                      <Upload size={12} />
                      <span>Browse PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload('secondaryImage', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={productForm.secondaryImage}
                    onChange={(e) => setProductForm({ ...productForm, secondaryImage: e.target.value })}
                    placeholder="URL or Upload"
                    className="w-full p-2 bg-white border border-[#E8E0D5] rounded text-xs outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* ---------------- 3. ANGLE 3 IMAGE FILE UPLOAD / URL ---------------- */}
                <div className="p-3 bg-[#FAF7F2] border border-[#E8E0D5] rounded">
                  <label className="font-bold uppercase tracking-wider text-[#24211F] block mb-1">
                    Angle 3 Image (Styling / Scale)
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    {productForm.extraImage3 && (
                      <img src={productForm.extraImage3} alt="Angle 3" className="w-10 h-10 object-cover rounded border" />
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E0D5] hover:border-[#C5A059] text-[#24211F] rounded text-[11px] font-semibold transition-colors">
                      <Upload size={12} />
                      <span>Browse PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload('extraImage3', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={productForm.extraImage3}
                    onChange={(e) => setProductForm({ ...productForm, extraImage3: e.target.value })}
                    placeholder="URL or Upload"
                    className="w-full p-2 bg-white border border-[#E8E0D5] rounded text-xs outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold uppercase tracking-wider block mb-1">Composition / Material</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full p-2.5 bg-white border border-subtle-border rounded outline-none focus:border-champagne-gold"
                    placeholder="e.g. 18K Micron Gold Finish & Austrian Zirconia"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold uppercase tracking-wider block mb-1">Dimensions / Sizing</label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    className="w-full p-2.5 bg-white border border-subtle-border rounded outline-none focus:border-champagne-gold"
                    placeholder="e.g. 40cm chain + 5cm extender"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold uppercase tracking-wider block mb-1">Editorial Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2.5 bg-white border border-subtle-border rounded outline-none focus:border-champagne-gold"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="stockCheck"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="accent-[#C6A15B]"
                  />
                  <label htmlFor="stockCheck" className="font-medium text-xs">
                    Mark as In Stock & Ready to Dispatch
                  </label>
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-subtle-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="py-2.5 px-5 bg-white border border-subtle-border text-deep-charcoal rounded text-xs font-semibold uppercase tracking-wider hover:bg-soft-beige cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-deep-charcoal hover:bg-champagne-gold text-white rounded text-xs font-bold uppercase tracking-wider shadow cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- MODAL: VIEW ORDER DETAILS ---------------- */}
        {viewingOrder && (
          <div
            className="fixed inset-0 bg-deep-charcoal/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
            onClick={() => setViewingOrder(null)}
          >
            <div
              className="bg-white rounded-md border border-subtle-border w-full max-w-lg p-6 sm:p-8 relative shadow-2xl animate-slide-up my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewingOrder(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-warm-ivory flex items-center justify-center text-deep-charcoal hover:bg-champagne-gold hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="pb-4 border-b border-subtle-border mb-4">
                <span className="font-mono text-sm font-bold text-deep-charcoal">{viewingOrder.id}</span>
                <div className="text-xs text-charcoal-light">
                  Tracking: {viewingOrder.trackingNumber} &bull; Placed: {new Date(viewingOrder.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div><strong>Customer Name:</strong> {viewingOrder.customerName}</div>
                <div><strong>Phone / WhatsApp:</strong> {viewingOrder.phone}</div>
                <div><strong>Delivery Address:</strong> {viewingOrder.address}, {viewingOrder.city} ({viewingOrder.province || 'Pakistan'})</div>
                <div><strong>Payment Method:</strong> {viewingOrder.paymentMethod}</div>
                <div><strong>Payment Status:</strong> {viewingOrder.paymentStatus}</div>
                {viewingOrder.orderNotes && (
                  <div><strong>Special Instructions:</strong> {viewingOrder.orderNotes}</div>
                )}
              </div>

              <h4 className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted mb-2">
                Order Items ({viewingOrder.items?.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto border-t border-b border-subtle-border py-2 mb-4">
                {viewingOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded bg-soft-beige" />
                      <span>{item.name} (x{item.quantity})</span>
                    </div>
                    <span className="font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold text-sm text-deep-charcoal">
                <span>Grand Total</span>
                <span className="text-champagne-gold">Rs. {viewingOrder.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
