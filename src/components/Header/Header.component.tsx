import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumbs from '../UI/Breadcrumbs.component'; // Import Breadcrumbs
import useIsMobile from '@/utils/hooks/useIsMobile'; // Hook to check mobile view
import MobileMenu from './MobileMenu'; // Import MobileMenu component

interface IHeaderProps {
  title?: string;
}

const Navbar: React.FC<IHeaderProps> = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false); // State to handle mobile menu

  useEffect(() => {
    if (title) {
      document.title = title; // Dynamically update document title
    }
  }, [title]);

  const isMobile = useIsMobile();
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen); // Toggle mobile menu
  };

  return (
    <>
      {/* MobileMenu Component */}
      {isMobile && (
        <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMobileMenu} />
      )}

      <header className="fixed w-full top-0 z-50 bg-transparent px-4"> {/* Added 16px padding */}
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

              {/* Right Icons (Cart, Wishlist, Menu) */}
              <div className="flex-none">
                <div
                  className="flex items-center space-x-4 px-6 py-2 rounded-full h-[50px]"
                  style={{ backgroundColor: '#E9E5DFCC' }} // Semi-transparent background
                >
                  {isMobile ? (
                    // Mobile Icons and Menu Button
                    <div className="flex items-center space-x-4">
                      <Link href="/search">
                        <img src="/icons/search.svg" alt="Search" className="h-6" />
                      </Link>
                      <Link href="/cart">
                        <img src="/icons/cart.svg" alt="Cart" className="h-6" />
                      </Link>
                      {/* Menu toggle button */}
                      <button onClick={toggleMobileMenu}>
                        <img
                          src={menuOpen ? '/icons/close-menu.svg' : '/icons/menu.svg'}
                          alt="Menu"
                          className="h-6"
                        />
                      </button>
                    </div>
                  ) : (
                    // Desktop Layout
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
