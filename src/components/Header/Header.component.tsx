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

interface IHeaderProps {
  title?: string;
}

const Navbar: React.FC<IHeaderProps> = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const isHomePage = router.pathname === '/';
  const isKoszykPage = router.pathname === '/koszyk';
  const isOnasPage = router.pathname === '/o-nas';
  const isKCheckoutPage = router.pathname === '/checkout';

  const { user, logout, fetchUser } = useUserContext();
  const { cart } = useContext(CartContext)
  const { wishlist } = useWishlist();
  const favoriteCount = wishlist.length;
  const count = cart?.totalProductsCount ?? 0
  let dropdownTimeout: ReturnType<typeof setTimeout>;

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

  const getActiveClass = (path: string) =>
    router.asPath === path
      ? 'bg-white text-[#661F30]'
      : 'hover:bg-[#DAD3C8] text-neutral-darkest';

  const iconClass = 'w-6 h-6';

  return (
    <>
      {/* Mobile Menu Component */}
      {isMobile && menuOpen && (
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
              {!isMobile && (
                <div className="flex-none mx-auto ">
                  <div
                    className="hidden md:flex md:items-center px-1 rounded-full justify-center h-[50px]"
                    style={{ backgroundColor: '#E9E5DFCC' }}
                  >
                    <ul className="flex items-center  text-base w-full justify-center text-[16px] whitespace-nowrap">
                      <li>
                        <Link href="/kategoria/uchwyty-meblowe">
                          <span
                            className={`px-3 py-3 font-bold  rounded-full transition-all ${getActiveClass('/kategoria/uchwyty-meblowe')}`}
                          >
                            Uchwyty
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kategoria/klamki">
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/kategoria/klamki')}`}
                          >
                            Klamki
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kategoria/wieszaki">
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/kategoria/wieszaki')}`}
                          >
                            Wieszaki
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kategoria/meble">
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/kategoria/meble')}`}
                          >
                            Meble
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kolekcje">
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/kolekcje')}`}
                          >
                            Kolekcje
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/o-nas">
                          <span
                            className={`px-3 py-3 font-bold rounded-full transition-all ${getActiveClass('/o-nas')}`}
                          >
                            O nas
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
                  {isMobile ? (
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
