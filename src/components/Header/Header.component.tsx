import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumbs from '../UI/Breadcrumbs.component';
import useIsMobile from '@/utils/hooks/useIsMobile';
import MobileMenu from './MobileMenu';

interface IHeaderProps {
  title?: string;
}

const Navbar: React.FC<IHeaderProps> = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const isHomePage = router.pathname === '/';

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getActiveClass = (path: string) => {
    return router.asPath === path
      ? 'bg-white text-[#661F30]'
      : 'hover:bg-[#DAD3C8] text-neutral-darkest';
  };

  return (
    <>
      {/* MobileMenu Component */}
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
                    <img src="/icons/Logo.svg" alt="HVYT Logo" className="h-10" />
                  </span>
                </Link>
              </div>

              {/* Center Navigation Links for Desktop with Styling */}
              {!isMobile && (
                <div className="flex-none mx-auto max-w-[630px] w-full">
                  <div className="hidden md:flex md:items-center rounded-full justify-center h-[50px]" style={{ backgroundColor: '#E9E5DFCC' }}>
                    <ul className="flex items-center text-base w-full justify-center text-[16px] whitespace-nowrap">
                      <li>
                        <Link href="/kategoria/uchwyty-meblowe">
                          <span className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kategoria/uchwyty-meblowe')}`}>
                            Uchwyty
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kategoria/klamki">
                          <span className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kategoria/klamki')}`}>
                            Klamki
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kategoria/wieszaki">
                          <span className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kategoria/wieszaki')}`}>
                            Wieszaki
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kolekcje">
                          <span className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kolekcje')}`}>
                            Kolekcje
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/o-nas">
                          <span className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/o-nas')}`}>
                            O nas
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/kontakt">
                          <span className={`px-3 py-2 font-semibold rounded-full transition-all ${getActiveClass('/kontakt')}`}>
                            Kontakt
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Right Icons (Cart, Wishlist, Menu) */}
              <div className="flex-none">
                <div
                  className="flex items-center space-x-4 px-6 py-2 rounded-full h-[50px]"
                  style={{ backgroundColor: '#E9E5DFCC' }}
                >
                  {isMobile ? (
                    <div className="flex items-center space-x-4">
                      <Link href="/search">
                        <img src="/icons/search.svg" alt="Search" className="h-6" />
                      </Link>
                      <Link href="/cart">
                        <img src="/icons/cart.svg" alt="Cart" className="h-6" />
                      </Link>
                      <button onClick={toggleMobileMenu}>
                        <img src={menuOpen ? '/icons/close-button.svg' : '/icons/menu-icon.svg'} alt="Menu" className="h-6" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Link href="/search">
                        <span className="p-2 rounded-full hover:bg-[#DAD3C8] hover:text-neutral-darkest transition-all">
                          <img src="/icons/search.svg" alt="Search" className="h-6" />
                        </span>
                      </Link>
                      <Link href="/wishlist">
                        <span className="p-2 rounded-full hover:bg-[#DAD3C8] hover:text-neutral-darkest transition-all">
                          <img src="/icons/wishlist.svg" alt="Wishlist" className="h-6" />
                        </span>
                      </Link>
                      <Link href="/profile">
                        <span className="p-2 rounded-full hover:bg-[#DAD3C8] hover:text-neutral-darkest transition-all">
                          <img src="/icons/user.svg" alt="User" className="h-6" />
                        </span>
                      </Link>
                      <Link href="/cart">
                        <span className="p-2 rounded-full hover:bg-[#DAD3C8] hover:text-neutral-darkest transition-all">
                          <img src="/icons/cart.svg" alt="Cart" className="h-6" />
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Breadcrumbs */}
            {!isHomePage && !isMobile && (
              <div className="w-full">
                <Breadcrumbs />
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
