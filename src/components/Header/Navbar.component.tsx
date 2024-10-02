import Link from 'next/link';

// Components
import Cart from './Cart.component';
import AlgoliaSearchBox from '../AlgoliaSearch/AlgoliaSearchBox.component';
import MobileSearch from '../AlgoliaSearch/MobileSearch.component';

// Utils
import useIsMobile from '@/utils/hooks/useIsMobile';

/**
 * Navigation for the application.
 * Includes mobile menu.
 */
const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <header className="fixed w-full top-0 z-50">
      <nav className="w-full bg-transparent py-2 backdrop-blur-md">
        <div className="container flex items-center justify-between px-6 py-3 mx-auto">

          {/* Logo on the left */}
          <div className="flex items-center order-1">
            <Link href="/">
              <span className="flex items-center text-xl font-bold tracking-wide text-neutral-dark no-underline hover:no-underline">
                <img src="/icons/Logo.svg" alt="HVYT Logo" className="h-10" />
              </span>
            </Link>
          </div>

          {/* Center navigation for desktop */}
          <div className="hidden md:flex md:items-center md:space-x-6 bg-neutral-lightest/80 px-6 py-2 rounded-full">
            <ul className="flex items-center space-x-4 text-base text-neutral-darkest">
              <li>
                <Link href="/kategoria/uchwyty-meblowe">
                  <span className="px-4 py-2 font-semibold rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    Uchwyty
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/kategoria/klamki">
                  <span className="px-4 py-2 font-semibold rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    Klamki
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/kategoria/wieszaki/">
                  <span className="px-4 py-2 font-semibold rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    Wieszaki
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/hvyt-objects">
                  <span className="px-4 py-2 font-semibold rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    Hvyt Objects
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/kolekcje">
                  <span className="px-4 py-2 font-semibold rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    Kolekcje
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/onas">
                  <span className="px-4 py-2 font-semibold rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    O nas
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/kontakt">
                  <span className="px-4 py-2 font-semibold rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    Kontakt
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop icons on the right */}
          <div className="flex items-center space-x-4 order-3">
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
              <div className="flex items-center space-x-4 bg-neutral-lightest/80 px-6 py-2 rounded-full">
                <Link href="/search">
                  <span className="p-2 rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    <img src="/icons/search.svg" alt="Search" className="h-6" />
                  </span>
                </Link>
                <Link href="/wishlist">
                  <span className="p-2 rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    <img src="/icons/wishlist.svg" alt="Wishlist" className="h-6" />
                  </span>
                </Link>
                <Link href="/profile">
                  <span className="p-2 rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    <img src="/icons/user.svg" alt="User" className="h-6" />
                  </span>
                </Link>
                <Link href="/cart">
                  <span className="p-2 rounded-full hover:bg-neutral-white hover:text-neutral-darkest transition-all">
                    <img src="/icons/cart.svg" alt="Cart" className="h-6" />
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
