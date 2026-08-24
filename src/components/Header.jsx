import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { SHOP_CATEGORIES } from '../data/products';

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
  currentUser = null,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  onNavigate,
  currentPath = '/'
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setShopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShopDropdownOpen(false);
    }, 200);
  };

  const handleLinkClick = (href) => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);

    if (href.startsWith('/')) {
      onNavigate(href);
    } else if (href.startsWith('#')) {
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) {
            const offset = 70;
            const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
          }
        }, 150);
      } else {
        const el = document.querySelector(href);
        if (el) {
          const offset = 70;
          const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onOpenSearch) onOpenSearch();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-[#FAF7F2] border-b border-[#E8E0D5] ${
          isScrolled ? 'bg-[#FAF7F2]/98 backdrop-blur-md shadow-2xs' : ''
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[56px] sm:h-[62px] gap-2">
            {/* Left & Center-Left Flow: Navigation Links + Brand Logo (Image 1 Layout) */}
            <div className="flex items-center gap-1.5 sm:gap-6 xl:gap-8 min-w-0">
              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-5 xl:gap-6 shrink-0" aria-label="Main Navigation">
                <a
                  href="/"
                  className={`text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                    currentPath === '/' ? 'text-[#C5A059]' : 'text-[#24211F] hover:text-[#C5A059]'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/');
                  }}
                >
                  HOME
                </a>

                {/* SHOP with Dropdown */}
                <div
                  className="relative inline-block"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.14em] uppercase py-1 cursor-pointer transition-colors ${
                      currentPath.startsWith('/shop') ? 'text-[#C5A059]' : 'text-[#24211F] hover:text-[#C5A059]'
                    }`}
                    onClick={() => handleLinkClick('/shop')}
                    aria-expanded={shopDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span>SHOP</span>
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-200 ${
                        shopDropdownOpen ? 'rotate-180 text-[#C5A059]' : 'text-[#7A7470]'
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 mt-0.5 min-w-[220px] bg-white border border-[#E8E0D5] rounded-xs shadow-lg py-1.5 z-50 transition-all duration-200 ${
                      shopDropdownOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-1 pointer-events-none'
                    }`}
                    role="menu"
                  >
                    <div className="flex flex-col py-1 text-xs">
                      {SHOP_CATEGORIES.map((cat) => (
                        <a
                          key={cat.slug}
                          href={`/shop/${cat.slug}`}
                          className="group flex items-center justify-between px-4 py-2 font-medium text-[#24211F] hover:bg-[#FAF7F2] hover:text-[#C5A059] transition-all"
                          role="menuitem"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(`/shop/${cat.slug}`);
                          }}
                        >
                          <span>{cat.title}</span>
                          <ChevronRight
                            size={12}
                            className="opacity-0 group-hover:opacity-100 text-[#C5A059] transition-opacity"
                          />
                        </a>
                      ))}
                    </div>

                    <div className="p-2.5 bg-[#FAF7F2] border-t border-[#E8E0D5]">
                      <a
                        href="/shop"
                        className="flex items-center justify-between text-[10px] font-bold tracking-[0.14em] uppercase text-[#C5A059] hover:text-[#24211F] transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick('/shop');
                        }}
                      >
                        <span>ALL COLLECTIONS</span>
                        <ArrowRight size={12} />
                      </a>
                    </div>
                  </div>
                </div>

                <a
                  href="#new-arrivals"
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#24211F] hover:text-[#C5A059] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('#new-arrivals');
                  }}
                >
                  NEW ARRIVALS
                </a>

                <a
                  href="#best-sellers"
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#24211F] hover:text-[#C5A059] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('#best-sellers');
                  }}
                >
                  BEST SELLERS
                </a>

                <a
                  href="/shop"
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#24211F] hover:text-[#C5A059] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/shop');
                  }}
                >
                  COLLECTIONS
                </a>

                <a
                  href="/about"
                  className={`text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                    currentPath === '/about' ? 'text-[#C5A059]' : 'text-[#24211F] hover:text-[#C5A059]'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/about');
                  }}
                >
                  ABOUT
                </a>
              </nav>

              {/* Mobile Hamburger */}
              <div className="flex lg:hidden items-center shrink-0">
                <button
                  className="flex items-center justify-center w-8 h-8 text-[#24211F] hover:text-[#C5A059] cursor-pointer"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open Mobile Menu"
                >
                  <Menu size={19} />
                </button>
              </div>

              {/* Brand Logo - New Custom Emblem + Typography */}
              <a
                href="/"
                className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 min-w-0 hover:opacity-90 transition-opacity cursor-pointer group"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('/');
                }}
              >
                <img
                  src="/images/logo.png"
                  alt="Zewellery.pk Emblem"
                  className="h-7.5 xs:h-8.5 sm:h-10 w-auto object-contain shrink-0 drop-shadow-2xs group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col items-start justify-center min-w-0">
                  <span className="font-serif text-[15px] xs:text-[17px] sm:text-[21px] tracking-[0.12em] xs:tracking-[0.16em] sm:tracking-[0.22em] text-[#24211F] font-semibold uppercase leading-none whitespace-nowrap group-hover:text-[#C5A059] transition-colors">
                    ZEWELLERY<span className="text-[#C5A059] font-serif">.PK</span>
                  </span>
                  <span className="text-[5px] xs:text-[6px] sm:text-[7px] tracking-[0.12em] xs:tracking-[0.16em] sm:tracking-[0.24em] uppercase text-[#7A7470] font-medium mt-0.5 leading-none whitespace-nowrap">
                    TIMELESS BEAUTY. MADE FOR YOU.
                  </span>
                </div>
              </a>
            </div>

            {/* Right: Search Box + Action Icons (Fully Responsive, Never Cuts Off) */}
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 lg:gap-3.5 shrink-0">
              {/* Search Box with icon inside on right */}
              <form
                onSubmit={handleSearchSubmit}
                onClick={onOpenSearch}
                className="hidden md:flex items-center bg-white border border-[#DCD3C7] rounded-xs px-3 py-1.5 w-44 lg:w-56 cursor-pointer shadow-2xs hover:border-[#C5A059] transition-colors"
              >
                <input
                  type="text"
                  readOnly
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search jewellery..."
                  className="bg-transparent text-xs text-[#24211F] placeholder-[#9E9791] outline-none w-full cursor-pointer"
                />
                <button type="submit" className="text-[#7A7470] hover:text-[#C5A059] ml-1.5 shrink-0">
                  <Search size={14} />
                </button>
              </form>

              {/* Search icon for mobile */}
              <button
                className="md:hidden flex items-center justify-center w-7.5 h-7.5 sm:w-8 sm:h-8 text-[#24211F] hover:text-[#C5A059] shrink-0 cursor-pointer"
                onClick={onOpenSearch}
                aria-label="Search Boutique"
              >
                <Search size={17} />
              </button>

              {/* User Account */}
              <button
                className={`relative flex items-center justify-center w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full transition-colors cursor-pointer shrink-0 ${
                  currentUser
                    ? 'text-[#C5A059] bg-[#C5A059]/15'
                    : 'text-[#24211F] hover:text-[#C5A059]'
                }`}
                onClick={onOpenAccount}
                aria-label="Client Account"
                title={currentUser ? `Signed in as ${currentUser.name}` : 'Sign In / Register'}
              >
                <User size={17} strokeWidth={1.6} />
              </button>

              {/* Wishlist Heart */}
              <button
                className="relative flex items-center justify-center w-7.5 h-7.5 sm:w-8 sm:h-8 text-[#24211F] hover:text-[#C5A059] transition-colors cursor-pointer shrink-0"
                onClick={onOpenWishlist}
                aria-label="View Saved Pieces"
                title="Wishlist"
              >
                <Heart size={17} strokeWidth={1.6} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C5A059] text-white text-[8px] sm:text-[8.5px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag Drawer Button */}
              <button
                className="relative flex items-center justify-center w-7.5 h-7.5 sm:w-8 sm:h-8 text-[#24211F] hover:text-[#C5A059] transition-colors cursor-pointer shrink-0"
                onClick={onOpenCart}
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag size={17} strokeWidth={1.6} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#24211F] text-white text-[8px] sm:text-[8.5px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 bg-[#24211F]/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-[#FAF7F2] z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Menu"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8E0D5]">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo.png"
              alt="Zewellery.pk Emblem"
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-2xs"
            />
            <div className="flex flex-col items-start">
              <span className="font-serif text-lg tracking-[0.2em] font-semibold text-[#24211F]">
                ZEWELLERY<span className="text-[#C5A059]">.PK</span>
              </span>
              <span className="text-[7px] tracking-[0.22em] uppercase text-[#7A7470]">TIMELESS BEAUTY</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Menu"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[#24211F]"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-5 flex flex-col gap-3 overflow-y-auto">
          <a
            href="/"
            className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#24211F] py-1.5 border-b border-[#E8E0D5]/60 hover:text-[#C5A059]"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/');
            }}
          >
            <span>Home</span>
            <ChevronRight size={14} className="text-[#C5A059]" />
          </a>

          <div className="flex flex-col">
            <div
              className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#24211F] py-1.5 border-b border-[#E8E0D5]/60 cursor-pointer"
              onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
            >
              <span>Shop Collections</span>
              <ChevronDown
                size={14}
                className={`text-[#C5A059] transition-transform duration-200 ${
                  mobileShopExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>

            {mobileShopExpanded && (
              <div className="pl-3.5 mt-2 mb-2 flex flex-col gap-1.5 border-l-2 border-[#C5A059] text-xs">
                {SHOP_CATEGORIES.map((cat) => (
                  <a
                    key={cat.slug}
                    href={`/shop/${cat.slug}`}
                    className="flex items-center justify-between py-1 text-[#24211F] hover:text-[#C5A059]"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(`/shop/${cat.slug}`);
                    }}
                  >
                    <span>{cat.title}</span>
                    <ChevronRight size={11} className="text-[#C5A059]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#new-arrivals"
            className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#24211F] py-1.5 border-b border-[#E8E0D5]/60 hover:text-[#C5A059]"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#new-arrivals');
            }}
          >
            <span>New Arrivals</span>
            <ChevronRight size={14} className="text-[#C5A059]" />
          </a>

          <a
            href="#best-sellers"
            className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#24211F] py-1.5 border-b border-[#E8E0D5]/60 hover:text-[#C5A059]"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#best-sellers');
            }}
          >
            <span>Best Sellers</span>
            <ChevronRight size={14} className="text-[#C5A059]" />
          </a>

          <a
            href="/account"
            className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#24211F] py-1.5 border-b border-[#E8E0D5]/60 hover:text-[#C5A059]"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/account');
            }}
          >
            <span>My Account & Orders</span>
            <ChevronRight size={14} className="text-[#C5A059]" />
          </a>

          <a
            href="/admin"
            className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#C5A059] py-1.5 border-b border-[#E8E0D5]/60"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/admin');
            }}
          >
            <span>Admin Management Console</span>
            <ChevronRight size={14} />
          </a>
        </nav>
      </aside>
    </>
  );
}
