import React, { useEffect, useState, useCallback, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumbs from '../UI/Breadcrumbs.component';
import useIsMobile from '@/utils/hooks/useIsMobile';
import MobileMenu from './MobileMenu';
import SearchComponent from '../Search/SearchResults.component';
import UserDropdown from './UserDropdown';
import { useUserContext } from '@/context/UserContext';
import { CartContext } from '@/stores/CartProvider'
import { useWishlist } from '@/context/WhishlistContext';
import { useI18n } from '@/utils/hooks/useI18n';
import LanguageSwitcher from '../UI/LanguageSwitcher';

interface IHeaderProps {
  title?: string;
}

const Navbar: React.FC<IHeaderProps> = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const [isTabletOrBelow, setIsTabletOrBelow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsTabletOrBelow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Treat tablets like mobile for menu/layout decisions
  const isCompact = isMobile || isTabletOrBelow;

  const isHomePage = router.pathname === '/';
  const isKoszykPage = router.pathname === '/koszyk';
  const isOnasPage = router.pathname === '/o-nas';
  const isKCheckoutPage = router.pathname === '/checkout';

  const { user, logout, fetchUser } = useUserContext();
  const { cart } = useContext(CartContext)
  const { wishlist } = useWishlist();
  const favoriteCount = wishlist.length;
  const count = cart?.totalProductsCount ?? 0
  const { language, getPath, t } = useI18n();
  const [alternateLangPath, setAlternateLangPath] = useState<string | null>(null);
  let dropdownTimeout: ReturnType<typeof setTimeout>;
  console.log('lang', router.locale);

  useEffect(() => {

  }, [router.query]);
  
  // Get alternate language path for product pages
  useEffect(() => {
    const updateAlternateLangPath = async () => {
      // Check if we're on a product page
      const isProductPage = router.pathname === '/produkt/[slug]' || router.pathname === '/product/[slug]';
      if (!isProductPage) {
        setAlternateLangPath(null);
        return;
      }
      
      // Get current URL path (without query/hash)
      const currentPath = router.asPath.split('?')[0].split('#')[0];
      const productSlug = router.query.slug as string;
      
      // Skip if path contains literal [slug] (SSR/hydration issue)
      if (currentPath.includes('[slug]')) {
        return;
      }
      
      const targetLang = language === 'pl' ? 'en' : 'pl';
      
      try {
        // Use WordPress endpoint that accepts full URL and returns translated URL
        const wpApiUrl = process.env.NEXT_PUBLIC_WP_REST_API || '';
        let wpBaseUrl = wpApiUrl.replace('/wp-json/wp/v2', '');
        wpBaseUrl = wpBaseUrl.replace(/\/$/, '');
        
        if (wpBaseUrl) {
          const endpointUrl = `${wpBaseUrl}/wp-json/custom/v1/translate-url?url=${encodeURIComponent(productSlug)}&to=${targetLang}`;
          const response = await fetch(endpointUrl);
          
          if (response.ok) {
            const data = await response.json();
            if (data.url) {
              console.log('[Header] ✅ Got translated URL:', data.url);
              setAlternateLangPath(data.url);
              return;
            }
          } else if (response.status === 404) {
            console.log('[Header] ⚠️ Translation not found');
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Header] ❌ WordPress endpoint error:', response.status, errorData);
          }
        }
      } catch (error: any) {
        console.error('[Header] ❌ Error getting translated URL:', error.message);
      }
      
      // Fallback: use getPath
      const fallbackPath = getPath(currentPath, targetLang);
      console.log('[Header] ⚠️ Using fallback path:', fallbackPath);
      setAlternateLangPath(fallbackPath);
    };
    
    updateAlternateLangPath();
  }, [router.asPath, router.pathname, language, getPath]);
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (!user) {
      fetchUser();
    }

    return () => clearTimeout(dropdownTimeout); // Cleanup timeout on unmount
  }, [title, user, fetchUser]);

  const toggleMobileMenu = () => setMenuOpen((prev) => !prev);

  const toggleSearch = () => setSearchOpen((prev) => !prev);

  const handleUserClick = () => {
    if (!user) {
      router.push('/logowanie');
    }
  };

  const handleMouseEnter = useCallback(() => {
    if (user) {
      clearTimeout(dropdownTimeout);
      dropdownTimeout = setTimeout(() => {
        setDropdownOpen(true);
      }, 200);
    }
  }, [user]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(dropdownTimeout);
    dropdownTimeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  }, []);

  const getActiveClass = (path: string) => {
    const currentPath = router.asPath.split('?')[0].split('#')[0];
    const pathsToCheck = [
      path,
      getPath(path),
      getPath(path, language === 'pl' ? 'en' : 'pl')
    ];
    const getSlug = (p: string) => p.replace(/^\/+|\/+$/g, '').replace(/^en\//, '').split('/').pop() || '';
    
    const currentSlug = getSlug(currentPath);
    const isActive = pathsToCheck.some(p => 
      currentPath === p || 
      currentPath.startsWith(p + '/') || 
      getSlug(p) === currentSlug
    );
    return isActive
      ? 'bg-white text-[#661F30]'
      : 'hover:bg-[#DAD3C8] text-neutral-darkest';
  };

  const iconClass = 'w-6 h-6';

  return (
    <>
      {/* DEBUG - usuń po testach
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 left-0 bg-black text-white p-2 text-xs z-[9999] max-w-xs">
          <div>Lang: {language}</div>
          <div>Path: {router.asPath}</div>
          <div>Handles: {t.links.categories.handles}</div>
          <div>About: {t.links.pages.about}</div>
        </div>
      )}
       */}
      {/* Mobile Menu Component */}
      {isCompact && menuOpen && (
        <MobileMenu
          menuOpen={menuOpen}
          isLoggedIn={!!user}
          toggleMenu={toggleMobileMenu}
        />
      )}

      <header className="fixed w-full top-0 z-50 bg-transparent px-4">
        <nav className="w-full h-full">
          <div className="container mx-auto max-w-grid-desktop h-full flex flex-col justify-center items-center">
            <div className="w-full h-[78px] flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center flex-none h-full">
                <Link href="/">
                  <span className="flex items-center text-xl font-bold tracking-wide text-neutral-dark no-underline hover:no-underline">
                    <img
                      src="/icons/Logo.svg"
                      alt="HVYT Logo"
                      className="h-6 md:h-10"
                    />
                  </span>
                </Link>
              </div>

              {/* Center Navigation Links for Desktop */}
              {!isCompact && (
                <div className="flex-none mx-auto ">
                  <div
                    className="hidden md:flex md:items-center px-1 rounded-full justify-center h-[50px]"
                    style={{ backgroundColor: '#E9E5DFCC' }}
                  >
                    <ul className="flex items-center  text-base w-full justify-center text-[16px] whitespace-nowrap">
                      <li>
                        <Link href={getPath('/kategoria/uchwyty-meblowe')}>
                          <span
                            className={`px-3 py-3 font-bold  rounded-full transition-all ${getActiveClass('/kategoria/uchwyty-meblowe')}`}
                          >
                            {t.links.categories.handles}
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href={getPath('/kategoria/klamki')}>
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/kategoria/klamki')}`}
                          >
                            {t.links.categories.doorHandles}
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href={getPath('/kategoria/wieszaki')}>
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/kategoria/wieszaki')}`}
                          >
                            {t.links.categories.wallHooks}
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href={getPath('/kategoria/meble')}>
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/kategoria/meble')}`}
                          >
                            {t.links.categories.furniture}
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href={getPath('/kolekcje')}>
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/kolekcje')}`}
                          >
                            {t.links.categories.collections}
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href={getPath('/o-nas')}>
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/o-nas')}`}
                          >
                            {t.links.pages.about}
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Right Icons */}
              <div className="flex-none">
                <div
                  className="flex items-center space-x-4 px-6 py-2 rounded-full h-[50px]"
                  style={{ backgroundColor: '#E9E5DFCC' }}
                >
                  {isCompact ? (
                    <div className="flex items-center space-x-4">
                      <button onClick={toggleSearch}>
                        <img
                          src="/icons/search.svg"
                          alt="Search"
                          className={iconClass}
                        />
                      </button>
                      {count > 0 ? (
                        <Link
                          href="/koszyk"
                          className="relative inline-flex items-center space-x-2 h-[40px] px-4 rounded-full transition-all bg-[#E95F7F] text-white"
                        >
                          <span className="text-lg font-medium">{count}</span>
                          <img
                            src="/icons/cart.svg"
                            alt="Cart"
                            className="w-6 h-6 filter invert"
                          />
                        </Link>
                      ) : (
                        <Link
                          href="/koszyk"
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#DAD3C8] transition-all"
                        >
                          <img
                            src="/icons/cart.svg"
                            alt="Cart"
                            className="w-full h-full"
                          />
                        </Link>
                      )}
                      <LanguageSwitcher />
                      <button onClick={toggleMobileMenu}>
                        <img
                          src={
                            menuOpen
                              ? '/icons/close-button.svg'
                              : '/icons/menu-icon.svg'
                          }
                          alt="Menu"
                          className={iconClass}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      {/* Search Icon */}
                      <button
                        onClick={toggleSearch}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#DAD3C8] hover:text-neutral-darkest transition-all"
                      >
                        <img
                          src="/icons/search.svg"
                          alt="Search"
                          className="w-full h-full"
                        />
                      </button>

                      {/* Wishlist Icon */}
                      <Link href="/ulubione">
                        <span className="relative w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#DAD3C8] transition-all">
                          <img src="/icons/wishlist.svg" alt="Wishlist" className="w-full h-full" />
                          {favoriteCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-dark-pastel-red text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                              {favoriteCount}
                            </span>
                          )}
                        </span>
                      </Link>

                      {/* User Icon */}
                      <div
                        onClick={handleUserClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={`relative w-6 h-6 flex items-center justify-center rounded-full cursor-pointer ${router.asPath.startsWith('/moje-konto') && user
                          ? 'bg-white'
                          : 'hover:bg-[#DAD3C8]'
                          }`}
                      >
                        <button
                          className={`w-full h-full flex items-center justify-center transition-all ${router.asPath.startsWith('/moje-konto') && user
                            ? 'text-dark-pastel-red'
                            : 'hover:text-neutral-darkest'
                            }`}
                        >
                          <img
                            src={
                              router.asPath.startsWith('/moje-konto') && user
                                ? '/icons/user-pastel.svg'
                                : '/icons/user.svg'
                            }
                            alt="User"
                            className="w-full h-full rounded-full transition-all"
                          />
                        </button>
                        {dropdownOpen && user && (
                          <div className="absolute left-[-120px] top-12 z-50">
                            <UserDropdown
                              onLogout={logout}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            />
                          </div>
                        )}
                      </div>

                      {/* Cart Icon */}
                      {count > 0 ? (
                        <Link
                          href="/koszyk"
                          className="relative inline-flex items-center space-x-2 h-[43px] px-4 rounded-full transition-all bg-[#E95F7F] text-white"
                        >
                          <span className="text-lg font-medium">{count}</span>
                          <img
                            src="/icons/cart.svg"
                            alt="Cart"
                            className="w-6 h-6 filter invert"
                          />
                        </Link>
                      ) : (
                        <Link
                          href="/koszyk"
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#DAD3C8] transition-all"
                        >
                          <img
                            src="/icons/cart.svg"
                            alt="Cart"
                            className="w-full h-full"
                          />
                        </Link>
                      )}
                      <LanguageSwitcher />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isHomePage &&
              !isOnasPage &&
              !isKoszykPage &&
              !isKCheckoutPage &&
              !menuOpen && (
                <div className="w-full">
                  <Breadcrumbs />
                </div>
              )}
          </div>
        </nav>
      </header>

      {searchOpen && <SearchComponent onClose={toggleSearch} />}
    </>
  );
};

export default Navbar;
