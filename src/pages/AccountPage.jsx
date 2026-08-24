import React, { useState, useEffect } from 'react';
import { User, Package, LogOut, CheckCircle2, ShoppingBag } from 'lucide-react';
import { dbGetCurrentUser, dbGetOrdersByUserId, dbLogout } from '../services/db';

export default function AccountPage({
  onNavigate,
  onOpenAuth
}) {
  const [currentUser, setCurrentUser] = useState(() => dbGetCurrentUser());
  const [userOrders, setUserOrders] = useState(() => {
    const user = dbGetCurrentUser();
    return user ? dbGetOrdersByUserId(user.id, user.email) : [];
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleDB = () => {
      const u = dbGetCurrentUser();
      setCurrentUser(u);
      if (u) {
        setUserOrders(dbGetOrdersByUserId(u.id, u.email));
      }
    };
    window.addEventListener('zewellery_db_updated', handleDB);
    return () => window.removeEventListener('zewellery_db_updated', handleDB);
  }, []);

  const handleSignOut = () => {
    dbLogout();
    setCurrentUser(null);
    setUserOrders([]);
    onNavigate('/');
  };

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] bg-warm-ivory flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 sm:p-12 rounded-md border border-subtle-border max-w-md w-full shadow-lg">
          <div className="w-16 h-16 rounded-full bg-champagne-gold/15 text-champagne-gold flex items-center justify-center mx-auto mb-4">
            <User size={30} />
          </div>
          <h2 className="font-serif text-2xl text-deep-charcoal mb-2">Welcome to Zewellery Circle</h2>
          <p className="text-xs text-charcoal-muted mb-6 leading-relaxed">
            Please sign in to view your orders, live courier tracking updates, and exclusive membership benefits.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-3.5 bg-deep-charcoal hover:bg-champagne-gold text-white text-xs font-bold uppercase tracking-[0.16em] rounded transition-all shadow cursor-pointer"
          >
            SIGN IN / CREATE ACCOUNT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory py-10 sm:py-14 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-subtle-border mb-8">
          <div>
            <span className="text-[10.5px] font-bold tracking-[0.24em] uppercase text-champagne-gold block mb-1">
              CLIENT DASHBOARD
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-deep-charcoal">
              Welcome, {currentUser.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => onNavigate('/admin')}
                className="py-2 px-3.5 sm:px-4 bg-champagne-gold text-deep-charcoal text-xs font-bold uppercase tracking-wider rounded hover:bg-champagne-gold-hover transition-colors cursor-pointer"
              >
                Admin Panel &rarr;
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-white border border-subtle-border rounded text-xs font-medium text-charcoal-muted hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          {/* Left Column: Customer Profile Card */}
          <div className="bg-white p-6 rounded-md border border-subtle-border flex flex-col items-center text-center shadow-xs">
            <img
              src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}&backgroundColor=C6A15B`}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-champagne-gold mb-3 bg-soft-beige"
            />
            <h3 className="font-serif text-lg font-medium text-deep-charcoal mb-0.5">{currentUser.name}</h3>
            <span className="text-xs text-charcoal-light mb-4">{currentUser.email}</span>

            <div className="w-full pt-4 border-t border-subtle-border text-left text-xs space-y-2 text-charcoal-muted">
              <div><strong>Status:</strong> <span className="text-champagne-gold font-bold uppercase">VIP Member</span></div>
              <div><strong>Contact:</strong> {currentUser.phone || '0300-1234567'}</div>
              <div><strong>Default City:</strong> {currentUser.city || 'Lahore, Pakistan'}</div>
              <div><strong>Member Since:</strong> {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'}</div>
            </div>

            <button
              onClick={() => onNavigate('/shop')}
              className="w-full mt-6 py-2.5 bg-warm-ivory border border-subtle-border hover:border-champagne-gold hover:text-champagne-gold text-deep-charcoal text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              Browse Collections
            </button>
          </div>

          {/* Right Column: Order History & Tracking */}
          <div className="bg-white p-6 sm:p-8 rounded-md border border-subtle-border shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-subtle-border">
              <h2 className="font-serif text-xl font-medium text-deep-charcoal flex items-center gap-2">
                <Package size={20} className="text-champagne-gold" />
                <span>My Orders ({userOrders.length})</span>
              </h2>
            </div>

            {userOrders.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag size={42} strokeWidth={1.2} className="text-subtle-border mx-auto mb-3" />
                <h3 className="font-serif text-lg text-deep-charcoal mb-1">No Orders Placed Yet</h3>
                <p className="text-xs text-charcoal-muted mb-6">
                  You haven't ordered any jewellery pieces yet. Explore our handcrafted Pakistani collections.
                </p>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="py-3 px-6 bg-deep-charcoal hover:bg-champagne-gold text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-warm-ivory/50 rounded border border-subtle-border flex flex-col gap-4"
                  >
                    {/* Order Meta Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-subtle-border">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-deep-charcoal">{order.id}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Dispatched'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-charcoal-light">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase text-charcoal-light block">Total Amount</span>
                        <span className="font-serif text-base font-bold text-champagne-gold">
                          Rs. {order.total?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Progress */}
                    <div className="bg-white p-4 rounded border border-subtle-border">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-charcoal-muted block mb-3">
                        Courier Tracking Timeline &bull; {order.trackingNumber}
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {order.timeline?.map((step, idx) => (
                          <div key={idx} className="flex flex-col">
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                step.done ? 'bg-champagne-gold text-white' : 'bg-soft-beige text-charcoal-light'
                              }`}>
                                {step.done ? <CheckCircle2 size={12} /> : idx + 1}
                              </div>
                              <span className={`text-[11px] font-semibold ${step.done ? 'text-deep-charcoal' : 'text-charcoal-light'}`}>
                                {step.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-charcoal-light pl-5">{step.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1.5">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-11 h-11 object-cover rounded bg-white border border-subtle-border" />
                            <div>
                              <div className="font-serif font-medium text-deep-charcoal">{item.name}</div>
                              <div className="text-[10px] text-charcoal-light">Quantity: {item.quantity}x</div>
                            </div>
                          </div>
                          <span className="font-bold text-deep-charcoal">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address Footer */}
                    <div className="pt-3 border-t border-subtle-border flex flex-col sm:flex-row justify-between text-[11px] text-charcoal-muted">
                      <div>
                        <strong>Delivery Address:</strong> {order.address}, {order.city} ({order.phone})
                      </div>
                      <div>
                        <strong>Payment:</strong> {order.paymentMethod}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
