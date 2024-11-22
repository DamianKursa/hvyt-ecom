import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumbs from '../UI/Breadcrumbs.component';
import useIsMobile from '@/utils/hooks/useIsMobile';
import MobileMenu from './MobileMenu';
import SearchComponent from '../Search/SearchResults.component';
import UserDropdown from './UserDropdown';
import { parseCookies } from '@/utils/cookies';

interface IHeaderProps {
  title?: string;
}

const Navbar: React.FC<IHeaderProps> = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const isHomePage = router.pathname === '/';

  // Check login state on component mount
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const verifyLoginState = async () => {
      try {
        const cookies = parseCookies(document.cookie);
        const token = cookies.token;

        if (token) {
          const response = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            setIsLoggedIn(true); // Token is valid, user is logged in
          } else {
            setIsLoggedIn(false); // Token invalid or expired
          }
        } else {
          setIsLoggedIn(false); // No token found
        }
      } catch (error) {
        setIsLoggedIn(false); // Error in validation
      }
    };

    verifyLoginState();
  }, [title]);

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      router.push('/logowanie'); // Redirect to login page if not logged in
    }
  };

  const handleMouseEnter = () => {
    if (isLoggedIn) {
      setDropdownOpen(true); // Show dropdown on hover if logged in
    }
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false); // Hide dropdown when leaving the icon or dropdown
  };

  const handleLogout = async () => {
    document.cookie = 'token=; Max-Age=0; path=/'; // Clear the token
    setIsLoggedIn(false); // Update state
    router.push('/logowanie'); // Redirect to login page
  };

  const getActiveClass = (path: string) => {
    return router.asPath === path
      ? 'bg-white text-[#661F30]'
      : 'hover:bg-[#DAD3C8] text-neutral-darkest';
  };

  const iconClass = 'w-6 h-6';

  return (
    <>
      {isMobile && menuOpen && (
        <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMobileMenu} />
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
                      className="h-10"
                    />
                  </span>
                </Link>
              </div>

              {/* Center Navigation Links */}
              {!isMobile && (
                <div className="flex-none mx-auto max-w-[530px] w-full">
                  <div
                    className="hidden md:flex md:items-center rounded-full justify-center h-[50px]"
                    style={{ backgroundColor: '#E9E5DFCC' }}
                  >
                    <ul className="flex items-center text-base w-full justify-center text-[16px] whitespace-nowrap">
                      <li>
                        <Link href="/kategoria/uchwyty-meblowe">
                          <span
                            className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kategoria/uchwyty-meblowe')}`}
                          >
                            Uchwyty
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kategoria/klamki">
                          <span
                            className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kategoria/klamki')}`}
                          >
                            Klamki
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kategoria/wieszaki">
                          <span
                            className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kategoria/wieszaki')}`}
                          >
                            Wieszaki
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kolekcje">
                          <span
                            className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kolekcje')}`}
                          >
                            Kolekcje
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/o-nas">
                          <span
                            className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/o-nas')}`}
                          >
                            O nas
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kontakt">
                          <span
                            className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kontakt')}`}
                          >
                            Kontakt
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
                  <button onClick={toggleSearch}>
                    <img
                      src="/icons/search.svg"
                      alt="Search"
                      className={iconClass}
                    />
                  </button>
                  <Link href="/wishlist">
                    <img
                      src="/icons/wishlist.svg"
                      alt="Wishlist"
                      className={iconClass}
                    />
                  </Link>
                  <div
                    onClick={handleUserClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                  >
                    <button>
                      <img
                        src="/icons/user.svg"
                        alt="User"
                        className={iconClass}
                      />
                    </button>
                    {dropdownOpen && isLoggedIn && (
                      <UserDropdown onLogout={handleLogout} />
                    )}
                  </div>
                  <Link href="/koszyk">
                    <img
                      src="/icons/cart.svg"
                      alt="Cart"
                      className={iconClass}
                    />
                  </Link>
                </div>
              </div>
            </div>

            {!isHomePage && !isMobile && (
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
