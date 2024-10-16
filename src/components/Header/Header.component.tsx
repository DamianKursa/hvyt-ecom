import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '../UI/Breadcrumbs.component'; // Import the Breadcrumbs component

// Utils
import useIsMobile from '@/utils/hooks/useIsMobile';
import { useRouter } from 'next/router'; // Import useRouter to conditionally show breadcrumbs

interface IHeaderProps {
  title?: string;
}

/**
 * Navigation for the application. Includes mobile menu.
 */
const Navbar: React.FC<IHeaderProps> = ({ title }) => {
  useEffect(() => {
    if (title) {
      document.title = title; // Update the document title dynamically
    }
  }, [title]);

  const isMobile = useIsMobile();
  const router = useRouter();

  // Check if the current page is the homepage
  const isHomePage = router.pathname === '/';

  return (
    <header className="fixed w-full top-0 z-50 bg-transparent">
      <nav className="w-full h-full">
        <div className="container mx-auto max-w-grid-desktop h-full flex flex-col justify-center items-center">
          <div className="w-full h-[78px] flex justify-between items-center">
            {/* Logo on the left */}
            <div className="flex items-center flex-none h-full">
              <Link href="/">
                <span className="flex items-center text-xl font-bold tracking-wide text-neutral-dark no-underline hover:no-underline">
                  <img src="/icons/Logo.svg" alt="HVYT Logo" className="h-10" />
                </span>
              </Link>
            </div>

            {/* Center Navigation */}
            <div className="flex-none mx-auto max-w-[630px] w-full">
              <div
                className="hidden md:flex md:items-center rounded-full justify-center h-[50px]"
                style={{ backgroundColor: '#E9E5DFCC' }} // Semi-transparent background
              >
                <ul className="flex items-center text-base text-neutral-darkest w-full justify-between text-[16px] whitespace-nowrap">
                  <li>
                    <Link href="/kategoria/uchwyty-meblowe">
                      <span className="px-3 py-2 font-semibold rounded-full hover:bg-[#DAD3C8] transition-all">
                        Uchwyty
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/kategoria/klamki">
                      <span className="px-3 py-2 font-semibold rounded-full hover:bg-[#DAD3C8] transition-all">
                        Klamki
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/kategoria/wieszaki">
                      <span className="px-3 py-2 font-semibold rounded-full hover:bg-[#DAD3C8] transition-all">
                        Wieszaki
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/hvyt-objects">
                      <span className="px-3 py-2 font-semibold rounded-full hover:bg-[#DAD3C8] transition-all">
                        Hvyt Objects
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/kolekcje">
                      <span className="px-3 py-2 font-semibold rounded-full hover:bg-[#DAD3C8] transition-all">
                        Kolekcje
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/o-nas">
                      <span className="px-3 py-2 font-semibold rounded-full hover:bg-[#DAD3C8] transition-all">
                        O nas
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/kontakt">
                      <span className="px-3 py-2 font-semibold rounded-full hover:bg-[#DAD3C8] transition-all">
                        Kontakt
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Icons on the right */}
            <div className="flex-none">
              <div
                className="flex items-center space-x-4 px-6 py-2 rounded-full h-[50px]"
                style={{ backgroundColor: '#E9E5DFCC' }} // Semi-transparent background
              >
                {isMobile ? (
                  // Mobile layout
                  <div className="flex items-center space-x-4">
                    <Link href="/search">
                      <img src="/icons/search.svg" alt="Search" className="h-6" />
                    </Link>
                    <Link href="/cart">
                      <img src="/icons/cart.svg" alt="Cart" className="h-6" />
                    </Link>
                    <Link href="/menu">
                      <img src="/icons/menu.svg" alt="Menu" className="h-6" />
                    </Link>
                  </div>
                ) : (
                  // Desktop layout for icons with background
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

          {/* Breadcrumbs below navigation */}
          {!isHomePage && (
            <div className="w-full">
              <Breadcrumbs />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
