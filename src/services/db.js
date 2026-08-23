// LocalStorage Database & State Management for Zewellery.pk
import { ALL_PRODUCTS as initialProducts } from '../data/products';

const STORAGE_KEYS = {
  PRODUCTS: 'zewellery_products_v13',
  USERS: 'zewellery_users_v4',
  CURRENT_USER: 'zewellery_current_user_v4',
  ORDERS: 'zewellery_orders_v4',
  CART: 'zewellery_cart_v4',
  WISHLIST: 'zewellery_wishlist_v4',
  REVIEWS: 'zewellery_reviews_v4',
  OTPS: 'zewellery_otps_v4'
};

const notifyDBChange = (eventType, data = null) => {
  window.dispatchEvent(new CustomEvent('zewellery_db_updated', { detail: { eventType, data } }));
};

// --- STRICT GOOGLE EMAIL AUTHENTICITY VALIDATION ---
const ALLOWED_GOOGLE_DOMAINS = ['gmail.com', 'googlemail.com'];

export const validateEmailAuthenticity = (email, allowAdmin = false) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Please enter a valid Google email address.' };
  }

  const clean = email.trim().toLowerCase();

  // Allow boutique admin master account
  if (allowAdmin && clean === 'admin@zewellery.pk') {
    return { valid: true, email: clean };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, error: 'Invalid email syntax. Please use your official Google email (e.g. yourname@gmail.com).' };
  }

  const parts = clean.split('@');
  const domain = parts[1];
  const userPart = parts[0];

  // Strictly enforce Google accounts only
  if (!ALLOWED_GOOGLE_DOMAINS.includes(domain)) {
    return {
      valid: false,
      error: 'Only authentic Google / Gmail accounts (@gmail.com) are allowed. Random or non-Google emails are not permitted.'
    };
  }

  if (userPart.length < 3) {
    return { valid: false, error: 'Google username is too short. Please provide your real Gmail address.' };
  }

  // Reject random spam character mashings without vowels
  if (/^[bcdfghjklmnpqrstvwxyz]{6,}$/i.test(userPart)) {
    return { valid: false, error: 'Gmail address appears to be random or invalid. Please provide your genuine Google account.' };
  }

  return { valid: true, email: clean };
};

// --- OTP / SECURITY 2-STEP VERIFICATION ---
export const generateVerificationOTP = (email) => {
  const validation = validateEmailAuthenticity(email);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otps = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.OTPS) || '{}');
  otps[validation.email] = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  };
  sessionStorage.setItem(STORAGE_KEYS.OTPS, JSON.stringify(otps));

  return {
    success: true,
    code,
    email: validation.email,
    expiresIn: '10 minutes'
  };
};

export const verifyEmailOTP = (email, enteredCode) => {
  const validation = validateEmailAuthenticity(email);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const otps = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.OTPS) || '{}');
  const record = otps[validation.email];

  if (!record) {
    return { success: false, error: 'No verification credentials were sent to this Google email. Please request a code first.' };
  }

  if (Date.now() > record.expiresAt) {
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }

  if (record.code !== enteredCode.trim()) {
    return { success: false, error: 'Incorrect 6-digit credentials PIN. Please check the code sent to your Google email.' };
  }

  // Clear OTP once verified
  delete otps[validation.email];
  sessionStorage.setItem(STORAGE_KEYS.OTPS, JSON.stringify(otps));

  return { success: true };
};

// --- PRODUCTS ---
export const dbGetProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(data);
  } catch {
    return initialProducts;
  }
};

export const dbGetProductById = (id) => {
  const products = dbGetProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
};

export const dbAddProduct = (newProduct) => {
  const products = dbGetProducts();
  const productWithId = {
    ...newProduct,
    id: newProduct.id || `prod-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [productWithId, ...products];
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  notifyDBChange('PRODUCT_ADDED', productWithId);
  return productWithId;
};

export const dbUpdateProduct = (id, updatedFields) => {
  const products = dbGetProducts();
  const index = products.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updatedFields,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  notifyDBChange('PRODUCT_UPDATED', products[index]);
  return products[index];
};

export const dbDeleteProduct = (id) => {
  const products = dbGetProducts();
  const filtered = products.filter((p) => String(p.id) !== String(id));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  notifyDBChange('PRODUCT_DELETED', id);
  return true;
};

// --- USERS & AUTHENTICATION ---
export const dbGetUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      // Default built-in verified admin and sample customer
      const defaultUsers = [
        {
          id: 'admin-1',
          name: 'Master Boutique Admin',
          email: 'admin@zewellery.pk',
          password: 'admin123',
          role: 'admin',
          isVerified: true,
          phone: '0300-9999999',
          city: 'Lahore',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const dbGetCurrentUser = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const dbSetCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
  notifyDBChange('USER_AUTH_CHANGED', user);
};

// User Registration with Strict Google Email Authenticity Checks
export const dbRegister = ({
  name,
  email,
  password,
  phone = '',
  city = 'Lahore',
  address = '',
  role = 'customer'
}) => {
  const validation = validateEmailAuthenticity(email, false);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const users = dbGetUsers();
  const normalizedEmail = validation.email;

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      error: 'A registered account with this Google email already exists. Please Sign In with your password.'
    };
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim() || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    password: password || '123456',
    role: role || 'customer',
    phone: phone || '0300-1234567',
    city: city || 'Lahore',
    address: address || '',
    isVerified: true,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}&backgroundColor=C6A15B`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  dbSetCurrentUser(newUser);

  return {
    success: true,
    user: newUser
  };
};

// User Login: MUST be registered before logging in
export const dbLogin = (email, password = '') => {
  const isMasterAdmin = email.trim().toLowerCase() === 'admin@zewellery.pk';
  const validation = validateEmailAuthenticity(email, isMasterAdmin);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const users = dbGetUsers();
  const normalizedEmail = validation.email;

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      error: 'No registered account found with this Google email. Please register/create an account first.'
    };
  }

  // Verify password if user has a stored password
  if (user.password && password && user.password !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify your credentials and try again.'
    };
  }

  dbSetCurrentUser(user);
  return {
    success: true,
    user
  };
};

// Google Multi-Step Authenticated Sign-In
export const dbGoogleSignIn = (googleProfile) => {
  if (!googleProfile || !googleProfile.email) {
    return { success: false, error: 'Google account details missing.' };
  }

  const validation = validateEmailAuthenticity(googleProfile.email, false);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const users = dbGetUsers();
  let user = users.find((u) => u.email.toLowerCase() === validation.email);

  if (!user) {
    user = {
      id: `usr-g-${Date.now()}`,
      name: googleProfile.name || validation.email.split('@')[0],
      email: validation.email,
      password: googleProfile.password || '',
      avatar: googleProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(googleProfile.name || 'G')}&background=24211F&color=C5A059&bold=true`,
      role: 'customer',
      provider: 'google',
      isVerified: true,
      phone: googleProfile.phone || '0300-1234567',
      city: googleProfile.city || 'Lahore',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } else {
    user.avatar = googleProfile.avatar || user.avatar;
    user.isVerified = true;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  dbSetCurrentUser(user);
  return {
    success: true,
    user
  };
};

export const dbLogout = () => {
  dbSetCurrentUser(null);
};

// --- ORDERS ---
export const dbGetOrders = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const dbGetOrdersByUserId = (userId, userEmail = '') => {
  const orders = dbGetOrders();
  return orders.filter(
    (o) => (userId && o.userId === userId) || (userEmail && o.email?.toLowerCase() === userEmail.toLowerCase())
  );
};

export const dbCreateOrder = (orderPayload) => {
  const orders = dbGetOrders();
  const orderId = `ZEW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    id: orderId,
    trackingNumber: `TCS-${Math.floor(100000000 + Math.random() * 900000000)}`,
    status: 'Pending',
    isVerified: true,
    createdAt: new Date().toISOString(),
    timeline: [
      { status: 'Order Placed', time: 'Just now', done: true },
      { status: 'Order Confirmation', time: 'Within 2 hours', done: false },
      { status: 'Packaging in Velvet Box', time: 'Pending', done: false },
      { status: 'Dispatched via Courier', time: 'Estimated 1-2 days', done: false }
    ],
    ...orderPayload
  };

  const updated = [newOrder, ...orders];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  notifyDBChange('ORDER_CREATED', newOrder);
  return newOrder;
};

export const dbUpdateOrderStatus = (orderId, newStatus) => {
  const orders = dbGetOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  orders[index].status = newStatus;
  if (newStatus === 'Dispatched' || newStatus === 'Delivered') {
    orders[index].timeline = orders[index].timeline.map((t) => ({ ...t, done: true }));
  }

  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  notifyDBChange('ORDER_STATUS_UPDATED', orders[index]);
  return orders[index];
};

// --- CART & WISHLIST PERSISTENCE ---
export const dbGetCart = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const dbSaveCart = (cartItems) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  notifyDBChange('CART_UPDATED', cartItems);
};

export const dbGetWishlist = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const dbSaveWishlist = (wishlistItems) => {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistItems));
  notifyDBChange('WISHLIST_UPDATED', wishlistItems);
};

// --- REVIEWS PERSISTENCE ---
export const dbGetReviews = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const dbAddReview = (review) => {
  const reviews = dbGetReviews();
  const newRev = {
    ...review,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString()
  };
  const updated = [newRev, ...reviews];
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
  notifyDBChange('REVIEW_ADDED', newRev);
  return newRev;
};
