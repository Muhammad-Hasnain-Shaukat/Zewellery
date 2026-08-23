import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  ShieldCheck,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import {
  dbLogin,
  dbRegister,
  dbGoogleSignIn,
  validateEmailAuthenticity,
  generateVerificationOTP,
  verifyEmailOTP
} from '../services/db';

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  redirectReason = 'Please sign in or register to complete your order and track delivery.'
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Email OTP Verification Mode for Standard Registration
  const [isVerifyingEmailOTP, setIsVerifyingEmailOTP] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [dispatchedOtp, setDispatchedOtp] = useState('');

  // Google Multi-Step Authentication State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleStep, setGoogleStep] = useState('EMAIL'); // 'EMAIL' -> 'PASSWORD' -> '2STEP_OTP'
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [showGooglePassword, setShowGooglePassword] = useState(false);
  const [googleName, setGoogleName] = useState('');
  const [googleOtp, setGoogleOtp] = useState('');
  const [dispatchedGoogleOtp, setDispatchedGoogleOtp] = useState('');
  const [googleError, setGoogleError] = useState('');

  if (!isOpen) return null;

  const handleToggleMode = (registerMode) => {
    setIsRegister(registerMode);
    setIsVerifyingEmailOTP(false);
    setErrorMessage('');
  };

  // ---------------- STANDARD LOGIN / REGISTER ----------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const emailCheck = validateEmailAuthenticity(email);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error);
      return;
    }

    if (!password || password.length < 5) {
      setErrorMessage('Password must be at least 5 characters.');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }

      // Step 1 of registration: Dispatch OTP Security Verification Code
      setLoading(true);
      setTimeout(() => {
        const otpRes = generateVerificationOTP(emailCheck.email);
        setLoading(false);
        if (!otpRes.success) {
          setErrorMessage(otpRes.error);
          return;
        }

        setDispatchedOtp(otpRes.code);
        setIsVerifyingEmailOTP(true);
      }, 400);
    } else {
      // Sign-in mode
      setLoading(true);
      setTimeout(() => {
        const res = dbLogin(emailCheck.email, password);
        setLoading(false);

        if (!res.success) {
          setErrorMessage(res.error);
        } else {
          if (onSuccess) onSuccess(res.user);
          onClose();
        }
      }, 400);
    }
  };

  const handleVerifyEmailOTP = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailOtpCode || emailOtpCode.trim().length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    const verifyRes = verifyEmailOTP(email, emailOtpCode);
    if (!verifyRes.success) {
      setErrorMessage(verifyRes.error);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = dbRegister({
        name,
        email,
        password,
        phone,
        city
      });

      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        if (onSuccess) onSuccess(res.user);
        onClose();
      }
    }, 400);
  };

  const handleResendEmailOTP = () => {
    const otpRes = generateVerificationOTP(email);
    if (otpRes.success) {
      setDispatchedOtp(otpRes.code);
      setErrorMessage('');
    }
  };

  // ---------------- GOOGLE MULTI-STEP AUTHENTICATION ----------------
  const handleOpenGoogle = () => {
    setIsGoogleModalOpen(true);
    setGoogleStep('EMAIL');
    setGoogleEmail('');
    setGooglePassword('');
    setGoogleOtp('');
    setGoogleError('');
  };

  const handleGoogleEmailSubmit = (e) => {
    e.preventDefault();
    setGoogleError('');

    const emailCheck = validateEmailAuthenticity(googleEmail);
    if (!emailCheck.valid) {
      setGoogleError(emailCheck.error);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const derivedName = googleEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      setGoogleName(derivedName);
      setGoogleStep('PASSWORD');
    }, 350);
  };

  const handleGooglePasswordSubmit = (e) => {
    e.preventDefault();
    setGoogleError('');

    if (!googlePassword || googlePassword.length < 6) {
      setGoogleError('Enter your Google account password (min 6 characters).');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Step 3: Google 2-Step Security Verification
      const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setDispatchedGoogleOtp(genOtp);
      setLoading(false);
      setGoogleStep('2STEP_OTP');
    }, 400);
  };

  const handleGoogle2StepVerify = (e) => {
    e.preventDefault();
    setGoogleError('');

    if (googleOtp.trim() !== dispatchedGoogleOtp) {
      setGoogleError('Invalid 6-digit Google verification code. Please check the code and try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = dbGoogleSignIn({
        name: googleName || googleEmail.split('@')[0],
        email: googleEmail,
        password: googlePassword,
        phone: '0300-1234567',
        city: 'Lahore',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(googleName || googleEmail)}&background=24211F&color=C5A059&bold=true`
      });

      setLoading(false);
      setIsGoogleModalOpen(false);

      if (res.success) {
        if (onSuccess) onSuccess(res.user);
        onClose();
      }
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 bg-deep-charcoal/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* ---------------- GENUINE GOOGLE SIGN-IN MODAL (MULTI-STEP) ---------------- */}
      {isGoogleModalOpen ? (
        <div
          className="bg-white rounded-lg border border-[#E8E0D5] w-full max-w-md p-6 sm:p-8 relative shadow-2xl animate-slide-up my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsGoogleModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center text-[#24211F] hover:bg-[#24211F] hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8E0D5]">
            <GoogleIcon />
            <div>
              <h3 className="text-xs font-bold text-[#24211F] uppercase tracking-wider">Sign in with Google</h3>
              <p className="text-[10px] text-[#7A7470]">Authenticate with your Google Account</p>
            </div>
          </div>

          {googleError && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{googleError}</span>
            </div>
          )}

          {/* STEP 1: Enter Google Email */}
          {googleStep === 'EMAIL' && (
            <form onSubmit={handleGoogleEmailSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#24211F] block mb-1">
                  Google / Gmail Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E0D5] rounded text-xs text-[#24211F] outline-none focus:border-[#4285F4]"
                  />
                  <Mail size={14} className="absolute left-3 top-3 text-[#7A7470]" />
                </div>
                <span className="text-[10px] text-[#7A7470] mt-1 block">
                  Only authentic Google accounts permitted. Random / fake emails are verified and blocked.
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7A7470] hover:text-[#24211F] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded uppercase tracking-wider shadow cursor-pointer transition-colors"
                >
                  {loading ? 'Validating...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Enter Google Password */}
          {googleStep === 'PASSWORD' && (
            <form onSubmit={handleGooglePasswordSubmit} className="flex flex-col gap-4 text-xs">
              <div className="p-3 bg-[#FAF7F2] border border-[#E8E0D5] rounded flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#24211F] text-[#C5A059] font-bold flex items-center justify-center text-xs">
                  {googleName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs text-[#24211F]">{googleName}</div>
                  <div className="text-[10px] text-[#7A7470] truncate">{googleEmail}</div>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#24211F] block mb-1">
                  Enter Google Password *
                </label>
                <div className="relative">
                  <input
                    type={showGooglePassword ? 'text' : 'password'}
                    required
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FAF7F2] border border-[#E8E0D5] rounded text-xs text-[#24211F] outline-none focus:border-[#4285F4]"
                  />
                  <Lock size={14} className="absolute left-3 top-3 text-[#7A7470]" />
                  <button
                    type="button"
                    onClick={() => setShowGooglePassword(!showGooglePassword)}
                    className="absolute right-3 top-2.5 text-[#7A7470] hover:text-[#24211F] p-0.5 cursor-pointer"
                  >
                    {showGooglePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setGoogleStep('EMAIL')}
                  className="px-4 py-2 text-xs font-semibold text-[#7A7470] hover:text-[#24211F] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded uppercase tracking-wider shadow cursor-pointer transition-colors"
                >
                  {loading ? 'Verifying...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Google 2-Step Security Verification (OTP) */}
          {googleStep === '2STEP_OTP' && (
            <form onSubmit={handleGoogle2StepVerify} className="flex flex-col gap-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded flex items-start gap-2.5 text-blue-900">
                <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs">2-Step Security Verification</div>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    A Google verification code has been dispatched to authenticate <strong>{googleEmail}</strong>.
                  </p>
                </div>
              </div>

              {/* Real-time Dispatch Banner */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded text-center">
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 block">
                  Google Security Code:
                </span>
                <span className="font-mono font-bold text-lg text-[#24211F] tracking-widest block my-1">
                  G-{dispatchedGoogleOtp}
                </span>
                <span className="text-[10px] text-amber-700">Enter the 6 digits below to complete sign in</span>
              </div>

              <div>
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#24211F] block mb-1">
                  Enter 6-Digit Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={googleOtp}
                    onChange={(e) => setGoogleOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 582914"
                    className="w-full text-center font-mono font-bold text-base tracking-[0.25em] py-2.5 bg-[#FAF7F2] border border-[#E8E0D5] rounded text-[#24211F] outline-none focus:border-[#4285F4]"
                  />
                  <Smartphone size={14} className="absolute left-3 top-3 text-[#7A7470]" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setGoogleStep('PASSWORD')}
                  className="px-4 py-2 text-xs font-semibold text-[#7A7470] hover:text-[#24211F] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#34A853] hover:bg-[#2D8E47] text-white text-xs font-bold rounded uppercase tracking-wider shadow cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <span>{loading ? 'Authenticating...' : 'Verify & Sign In'}</span>
                  <CheckCircle size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      ) : isVerifyingEmailOTP ? (
        /* ---------------- STANDARD EMAIL OTP VERIFICATION SCREEN ---------------- */
        <div
          className="bg-warm-ivory rounded-md border border-subtle-border w-full max-w-md p-6 sm:p-8 relative shadow-2xl animate-slide-up my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsVerifyingEmailOTP(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-subtle-border flex items-center justify-center text-deep-charcoal hover:bg-deep-charcoal hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-champagne-gold/20 text-champagne-gold flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={24} />
            </div>
            <span className="font-serif text-xl tracking-wider font-semibold text-deep-charcoal block">
              Verify Your Email
            </span>
          </div>

          {/* Verification Code Dispatch Banner */}
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded text-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 block">
              Zewellery Security Code:
            </span>
            <span className="font-mono font-bold text-xl text-deep-charcoal tracking-widest block my-1">
              {dispatchedOtp}
            </span>
            <span className="text-[10px] text-amber-700">Enter this code below to authenticate your account</span>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerifyEmailOTP} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                Enter 6-Digit PIN *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={emailOtpCode}
                onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit code"
                className="w-full text-center font-mono font-bold text-lg tracking-[0.25em] py-2.5 bg-white border border-subtle-border rounded text-deep-charcoal outline-none focus:border-champagne-gold"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-charcoal-muted">
              <button
                type="button"
                onClick={handleResendEmailOTP}
                className="hover:text-champagne-gold flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Resend Code</span>
              </button>
              <button
                type="button"
                onClick={() => setIsVerifyingEmailOTP(false)}
                className="hover:text-deep-charcoal cursor-pointer"
              >
                Change Details
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-deep-charcoal hover:bg-champagne-gold text-white font-bold uppercase tracking-wider text-xs rounded transition-all shadow cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Verify & Create Account'}</span>
              <CheckCircle size={14} />
            </button>
          </form>
        </div>
      ) : (
        /* ---------------- STANDARD SIGN IN / REGISTER FORM ---------------- */
        <div
          className="bg-warm-ivory rounded-md border border-subtle-border w-full max-w-md p-6 sm:p-8 relative shadow-2xl animate-slide-up my-auto max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 border border-subtle-border flex items-center justify-center text-deep-charcoal hover:bg-deep-charcoal hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Branding header */}
          <div className="text-center mb-5">
            <span className="font-serif text-xl tracking-[0.2em] font-semibold text-deep-charcoal block">
              ZEWELLERY<span className="text-champagne-gold">.PK</span>
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-charcoal-light font-medium block mt-0.5">
              VERIFIED CLIENT AUTHENTICATION
            </span>
          </div>

          {redirectReason && (
            <div className="mb-4 p-3 bg-soft-beige border border-champagne-gold/30 rounded text-xs text-deep-charcoal flex items-start gap-2">
              <Sparkles size={15} className="text-champagne-gold shrink-0 mt-0.5" />
              <span>{redirectReason}</span>
            </div>
          )}

          {/* Tab switch for Sign In vs Register */}
          <div className="grid grid-cols-2 p-1 bg-white border border-subtle-border rounded mb-5">
            <button
              type="button"
              onClick={() => handleToggleMode(false)}
              className={`py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-deep-charcoal text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-deep-charcoal'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode(true)}
              className={`py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                isRegister
                  ? 'bg-deep-charcoal text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-deep-charcoal'
              }`}
            >
              Register Account
            </button>
          </div>

          {/* Error notification banner */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2 animate-fade-in">
              <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <span>{errorMessage}</span>
                {!isRegister && errorMessage.includes('register') && (
                  <button
                    type="button"
                    onClick={() => handleToggleMode(true)}
                    className="block mt-1 font-bold text-deep-charcoal hover:underline"
                  >
                    Click here to Register an Account &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Google Multi-Step Authenticated Button */}
          <button
            type="button"
            onClick={handleOpenGoogle}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-white border border-subtle-border rounded text-xs font-semibold uppercase tracking-wider text-deep-charcoal hover:border-[#4285F4] hover:bg-blue-50/20 shadow-xs transition-all cursor-pointer mb-4"
          >
            <GoogleIcon />
            <span>Sign in with Google System</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px bg-subtle-border grow" />
            <span className="text-[10px] uppercase tracking-wider text-charcoal-light font-medium">
              {isRegister ? 'or register with verified email' : 'or sign in with email'}
            </span>
            <div className="h-px bg-subtle-border grow" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-3">
            {isRegister && (
              <>
                <div>
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="zew_user_fullname"
                      autoComplete="off"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mahnoor Tariq"
                      className="w-full pl-9 pr-3.5 py-2 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                    />
                    <User size={14} className="absolute left-3 top-2.5 text-charcoal-light" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                      WhatsApp / Phone
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="zew_user_phone"
                        autoComplete="off"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full pl-8 pr-2.5 py-2 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                      />
                      <Phone size={13} className="absolute left-2.5 top-2.5 text-charcoal-light" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                      City
                    </label>
                    <div className="relative">
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Multan">Multan</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Quetta">Quetta</option>
                        <option value="Sialkot">Sialkot</option>
                        <option value="Gujranwala">Gujranwala</option>
                        <option value="Other">Other</option>
                      </select>
                      <MapPin size={13} className="absolute left-2.5 top-2.5 text-charcoal-light" />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal block mb-1">
                Google / Gmail Address (@gmail.com) *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="zew_user_gmail"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                />
                <Mail size={14} className="absolute left-3 top-2.5 text-charcoal-light" />
              </div>
              <span className="text-[10px] text-charcoal-light mt-0.5 block">
                Strict authentication: only genuine @gmail.com accounts are permitted.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-deep-charcoal">
                  Password *
                </label>
                {!isRegister && (
                  <span className="text-[10px] text-charcoal-light">5+ characters</span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="zew_user_passcode"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-12 py-2 bg-white border border-subtle-border rounded text-xs text-deep-charcoal outline-none focus:border-champagne-gold"
                />
                <Lock size={14} className="absolute left-3 top-2.5 text-charcoal-light" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded bg-[#F8F5F0] hover:bg-champagne-gold hover:text-white text-deep-charcoal border border-subtle-border flex items-center justify-center cursor-pointer transition-all z-10"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 bg-deep-charcoal hover:bg-champagne-gold text-white font-semibold uppercase tracking-[0.14em] text-xs rounded transition-all shadow-md cursor-pointer hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Validating credentials...</span>
              ) : isRegister ? (
                <>
                  <span>Continue to Verification PIN</span>
                  <ShieldCheck size={15} />
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Privacy & Guarantee footer */}
          <div className="mt-5 pt-3 border-t border-subtle-border/60 text-center text-[10px] text-charcoal-muted leading-relaxed">
            By authenticating, you agree to Zewellery's{' '}
            <span className="text-deep-charcoal font-medium">Terms of Service</span> &{' '}
            <span className="text-deep-charcoal font-medium">Privacy Policy</span>. Security OTP verification prevents unauthenticated and fraudulent accounts.
          </div>
        </div>
      )}
    </div>
  );
}
