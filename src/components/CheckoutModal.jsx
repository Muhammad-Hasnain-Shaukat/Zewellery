import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import {
  dbCreateOrder,
  validateEmailAuthenticity,
  generateVerificationOTP,
  verifyEmailOTP
} from '../services/db';

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Jhelum',
  'Rahim Yar Khan',
  'Mardan'
];

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  currentUser,
  onOrderSuccess
}) {
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    city: currentUser?.city || 'Lahore',
    province: 'Punjab',
    postalCode: '',
    orderNotes: '',
    paymentMethod: 'Cash on Delivery (COD)',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    walletNumber: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Order Authenticity OTP Verification State
  const [isVerifyingOrderOTP, setIsVerifyingOrderOTP] = useState(false);
  const [orderOtpCode, setOrderOtpCode] = useState('');
  const [dispatchedOrderOtp, setDispatchedOrderOtp] = useState('');

  if (!isOpen || items.length === 0) return null;

  const rawSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * appliedDiscount);
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const shippingFee = subtotalAfterDiscount >= 3000 ? 0 : 250;
  const grandTotal = subtotalAfterDiscount + shippingFee;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'ZEWELLERY10' || code === 'WELCOME10') {
      setAppliedDiscount(0.1);
      setPromoMessage('10% VIP discount applied successfully!');
    } else {
      setPromoMessage('Invalid voucher code. Try ZEWELLERY10');
    }
  };

  const processOrderCreation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderPayload = {
        userId: currentUser?.id || 'guest',
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        orderNotes: formData.orderNotes,
        paymentMethod: formData.paymentMethod,
        paymentStatus:
          formData.paymentMethod === 'Cash on Delivery (COD)'
            ? 'Pending (COD)'
            : 'Paid Online (Verified)',
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          category: i.category
        })),
        subtotal: rawSubtotal,
        discount: discountAmount,
        shippingFee: shippingFee,
        total: grandTotal
      };

      const createdOrder = dbCreateOrder(orderPayload);
      setIsSubmitting(false);
      setIsVerifyingOrderOTP(false);
      onOrderSuccess(createdOrder);
    }, 800);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setCheckoutError('Please fill in all required delivery fields.');
      return;
    }

    const emailCheck = validateEmailAuthenticity(formData.email);
    if (!emailCheck.valid) {
      setCheckoutError(emailCheck.error);
      return;
    }

    // If user is already authenticated & verified, proceed immediately
    if (currentUser?.isVerified && currentUser?.email?.toLowerCase() === emailCheck.email) {
      processOrderCreation();
      return;
    }

    // Otherwise, dispatch 6-digit Order Authenticity Verification PIN to ensure only genuine buyers order
    setIsSubmitting(true);
    setTimeout(() => {
      const otpRes = generateVerificationOTP(emailCheck.email);
      setIsSubmitting(false);
      if (!otpRes.success) {
        setCheckoutError(otpRes.error);
        return;
      }

      setDispatchedOrderOtp(otpRes.code);
      setIsVerifyingOrderOTP(true);
    }, 400);
  };

  const handleVerifyOrderPIN = (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (!orderOtpCode || orderOtpCode.trim().length !== 6) {
      setCheckoutError('Please enter the 6-digit verification security PIN.');
      return;
    }

    const verifyRes = verifyEmailOTP(formData.email, orderOtpCode);
    if (!verifyRes.success) {
      setCheckoutError(verifyRes.error);
      return;
    }

    processOrderCreation();
  };

  return (
    <div
      className="fixed inset-0 bg-deep-charcoal/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-warm-ivory rounded-md border border-subtle-border w-full max-w-4xl max-h-[92vh] overflow-y-auto relative shadow-2xl animate-slide-up my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 border border-subtle-border flex items-center justify-center text-deep-charcoal hover:bg-deep-charcoal hover:text-white transition-colors z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-white border-b border-subtle-border">
          <span className="font-serif text-2xl font-semibold tracking-wider text-deep-charcoal block">
            ZEWELLERY<span className="text-champagne-gold">.PK</span>
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal-light font-medium block mt-0.5">
            AUTHENTICATED NATIONWIDE CHECKOUT &bull; VERIFIED BUYER SECURITY
          </span>
        </div>

        {/* ---------------- ORDER AUTHENTICITY PIN VERIFICATION MODAL OVERLAY ---------------- */}
        {isVerifyingOrderOTP ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto animate-fade-in text-center">
            <div className="w-14 h-14 rounded-full bg-champagne-gold/20 text-champagne-gold flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} />
            </div>

            <h3 className="font-serif text-2xl font-bold text-deep-charcoal mb-1">
              Order Security Verification
            </h3>
            <p className="text-xs text-charcoal-muted mb-4">
              To verify genuine buyer authenticity and prevent fraudulent spam orders, we sent a 6-digit confirmation PIN to <strong>{formData.email}</strong>.
            </p>

            {/* Simulated Live Security Dispatch Banner */}
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-300 rounded text-center">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 block">
                Zewellery Order Security PIN:
              </span>
              <span className="font-mono font-bold text-2xl text-deep-charcoal tracking-widest block my-1">
                {dispatchedOrderOtp}
              </span>
              <span className="text-[10px] text-amber-700">Enter this code below to authorize your purchase</span>
            </div>

            {checkoutError && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2 text-left">
                <AlertCircle size={14} className="shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOrderPIN} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                  Enter 6-Digit PIN *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={orderOtpCode}
                  onChange={(e) => setOrderOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit PIN"
                  className="w-full text-center font-mono font-bold text-lg tracking-[0.25em] py-3 bg-white border border-subtle-border rounded text-deep-charcoal outline-none focus:border-champagne-gold shadow-inner"
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-charcoal-muted">
                <button
                  type="button"
                  onClick={() => {
                    const otpRes = generateVerificationOTP(formData.email);
                    if (otpRes.success) setDispatchedOrderOtp(otpRes.code);
                  }}
                  className="hover:text-champagne-gold flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Resend PIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVerifyingOrderOTP(false)}
                  className="hover:text-deep-charcoal cursor-pointer"
                >
                  Edit Order Details
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-deep-charcoal hover:bg-champagne-gold text-white font-bold uppercase tracking-wider text-xs rounded transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Verifying & Confirming...' : 'Verify Authenticity & Place Order'}</span>
                <CheckCircle size={16} />
              </button>
            </form>
          </div>
        ) : (
          /* ---------------- MAIN CHECKOUT FORM ---------------- */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
            {/* Left Column: Shipping & Payment */}
            <div className="flex flex-col gap-6">
              {checkoutError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2 animate-fade-in">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <div>
                <h3 className="font-serif text-lg font-medium text-deep-charcoal mb-3 flex items-center gap-2">
                  <span>1. Delivery Destination</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Mahnoor Tariq"
                      className="w-full p-2.5 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0300-1234567"
                      className="w-full p-2.5 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                      Google / Gmail Address (@gmail.com) *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. yourname@gmail.com (Used for OTP PIN verification)"
                      className="w-full p-2.5 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                    />
                    <span className="text-[10px] text-charcoal-light mt-0.5 block">
                      A 6-digit security PIN will be sent to your Gmail to authenticate your order.
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                      Complete Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House/Apartment #, Street, Block, Area"
                      className="w-full p-2.5 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                      City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                      Province
                    </label>
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full p-2.5 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                      Special Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.orderNotes}
                      onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                      placeholder="e.g. Call before delivery / Gift packaging requested"
                      className="w-full p-2.5 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-serif text-lg font-medium text-deep-charcoal mb-3">
                  2. Select Payment Method
                </h3>

                <div className="space-y-2.5">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded border transition-all cursor-pointer ${
                      formData.paymentMethod === 'Cash on Delivery (COD)'
                        ? 'border-champagne-gold bg-soft-beige/60 shadow-xs'
                        : 'border-subtle-border bg-white hover:border-champagne-gold/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery (COD)"
                      checked={formData.paymentMethod === 'Cash on Delivery (COD)'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mt-1 accent-deep-charcoal"
                    />
                    <div className="grow">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-deep-charcoal flex items-center gap-2">
                          <Banknote size={15} className="text-champagne-gold" />
                          Cash on Delivery (Nationwide)
                        </span>
                        <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-muted mt-0.5">
                        Inspect your tamper-proof parcel and pay the courier upon receiving at your doorstep.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded border transition-all cursor-pointer ${
                      formData.paymentMethod === 'Credit / Debit Card'
                        ? 'border-champagne-gold bg-soft-beige/60 shadow-xs'
                        : 'border-subtle-border bg-white hover:border-champagne-gold/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit / Debit Card"
                      checked={formData.paymentMethod === 'Credit / Debit Card'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mt-1 accent-deep-charcoal"
                    />
                    <div className="grow">
                      <span className="text-xs font-bold text-deep-charcoal flex items-center gap-2">
                        <CreditCard size={15} className="text-champagne-gold" />
                        Visa / MasterCard / UnionPay (Encrypted)
                      </span>
                      <p className="text-[11px] text-charcoal-muted mt-0.5">
                        Instant 256-bit SSL secured transaction.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded border transition-all cursor-pointer ${
                      formData.paymentMethod === 'JazzCash / EasyPaisa'
                        ? 'border-champagne-gold bg-soft-beige/60 shadow-xs'
                        : 'border-subtle-border bg-white hover:border-champagne-gold/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="JazzCash / EasyPaisa"
                      checked={formData.paymentMethod === 'JazzCash / EasyPaisa'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mt-1 accent-deep-charcoal"
                    />
                    <div className="grow">
                      <span className="text-xs font-bold text-deep-charcoal flex items-center gap-2">
                        <Smartphone size={15} className="text-champagne-gold" />
                        JazzCash / EasyPaisa Mobile Wallet
                      </span>
                      <p className="text-[11px] text-charcoal-muted mt-0.5">
                        Direct merchant wallet prompt to your registered mobile number.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-white p-6 rounded-md border border-subtle-border h-fit flex flex-col gap-4 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-deep-charcoal border-b border-subtle-border pb-3">
                Order Summary ({items.length} {items.length === 1 ? 'Piece' : 'Pieces'})
              </h3>

              {/* Items List */}
              <div className="max-h-48 overflow-y-auto space-y-3 divide-y divide-subtle-border/40 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded bg-soft-beige border border-subtle-border shrink-0"
                    />
                    <div className="grow overflow-hidden">
                      <span className="text-xs font-medium text-deep-charcoal block truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-charcoal-light">
                        Qty: {item.quantity} &times; Rs. {item.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-deep-charcoal shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-subtle-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Voucher: ZEWELLERY10"
                    className="grow p-2 bg-soft-beige/50 border border-subtle-border rounded text-xs outline-none focus:border-champagne-gold uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="py-2 px-3 bg-deep-charcoal hover:bg-champagne-gold text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] mt-1 ${
                      appliedDiscount > 0 ? 'text-emerald-700 font-semibold' : 'text-red-600'
                    }`}
                  >
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-2 border-t border-subtle-border text-xs text-charcoal-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-deep-charcoal">
                    Rs. {rawSubtotal.toLocaleString()}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>VIP Voucher Discount (10%)</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Courier Delivery (TCS Express)</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[10px]">
                        FREE SHIPPING
                      </span>
                    ) : (
                      `Rs. ${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-deep-charcoal pt-3 border-t border-subtle-border">
                  <span>Total Amount</span>
                  <span className="text-base font-serif text-deep-charcoal">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-deep-charcoal hover:bg-champagne-gold text-white font-bold uppercase tracking-[0.16em] text-xs rounded transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? 'Verifying...' : 'Proceed to Security Verification'}</span>
                <ShieldCheck size={16} />
              </button>

              <div className="text-center text-[10px] text-charcoal-light space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-deep-charcoal font-medium">
                  <ShieldCheck size={13} className="text-champagne-gold" />
                  <span>Authenticity Guarantee &bull; 7-Day Exchange Policy</span>
                </div>
                <p>Triple-micron gold jewellery with signature gift box.</p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
