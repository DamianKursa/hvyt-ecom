import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWishlist } from '@/context/WhishlistContext';
import { useI18n } from '@/utils/hooks/useI18n';

interface MobileMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  isLoggedIn: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  menuOpen,
  toggleMenu,
  isLoggedIn,
}) => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const router = useRouter();
  const { t, getPath } = useI18n();
  const currentPath = router.asPath.split('?')[0];
  const { wishlist } = useWishlist();
  const favoriteCount = wishlist.length;

  // Handle click on "Moje konto"
  const handleAccountClick = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      e.preventDefault();
      setAccountDropdownOpen(!accountDropdownOpen);
    } else {
      toggleMenu();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-white z-50 w-full overflow-y-auto max-h-full transition-transform duration-300 ease-in-out p-4 ${menuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      {/* Main Menu links with 16px padding */}
      <div className="rounded-[25px] bg-[#E9E5DF] p-2 mt-[78px]">
        <ul className="space-y-4 text-xl">
          {/* Category links with hover/active styles */}
          <li className="font-bold">
            <Link href="/kategoria/uchwyty-meblowe" legacyBehavior>
              <a
                onClick={toggleMenu}
                className={`group flex items-center justify-between rounded-[25px] transition-colors duration-200 hover:bg-beige-light hover:text-dark-pastel-red ${currentPath === '/kategoria/uchwyty-meblowe'
                  ? 'bg-beige-light text-dark-pastel-red'
                  : ''
                  }`}
              >
                <span className="p-2">Uchwyty</span>
                <span
                  className={`ml-2 ${currentPath === '/kategoria/uchwyty-meblowe'
                    ? 'inline'
                    : 'hidden group-hover:inline'
                    }`}
                >
                  <img
                    src="/icons/uchwyty-kształty.svg"
                    alt="Uchwyty icon"
                    className="h-6 pr-2"
                  />
                </span>
              </a>
            </Link>
          </li>
          <li className="font-bold">
            <Link href="/kategoria/klamki" legacyBehavior>
              <a
                onClick={toggleMenu}
                className={`group flex items-center justify-between rounded-[25px] transition-colors duration-200 hover:bg-beige-light hover:text-dark-pastel-red ${currentPath === '/kategoria/klamki'
                  ? 'bg-beige-light text-dark-pastel-red'
                  : ''
                  }`}
              >
                <span className="p-2">Klamki</span>
                <span
                  className={`ml-2 ${currentPath === '/kategoria/klamki'
                    ? 'inline'
                    : 'hidden group-hover:inline'
                    }`}
                >
                  <img
                    src="/icons/klamki-kształty.svg"
                    alt="Klamki icon"
                    className="h-6 pr-2"
                  />
                </span>
              </a>
            </Link>
          </li>
          <li className="font-bold">
            <Link href="/kategoria/wieszaki" legacyBehavior>
              <a
                onClick={toggleMenu}
                className={`group flex items-center justify-between rounded-[25px] transition-colors duration-200 hover:bg-beige-light hover:text-dark-pastel-red ${currentPath === '/kategoria/wieszaki'
                  ? 'bg-beige-light text-dark-pastel-red'
                  : ''
                  }`}
              >
                <span className="p-2">Wieszaki</span>
                <span
                  className={`ml-2 ${currentPath === '/kategoria/wieszaki'
                    ? 'inline'
                    : 'hidden group-hover:inline'
                    }`}
                >
                  <img
                    src="/icons/wieszaki-kształty.svg"
                    alt="Wieszaki icon"
                    className="h-6 pr-2"
                  />
                </span>
              </a>
            </Link>
          </li>
          <li className="font-bold">
            <Link href="/kategoria/meble" legacyBehavior>
              <a
                onClick={toggleMenu}
                className={`group flex items-center justify-between rounded-[25px] transition-colors duration-200 hover:bg-beige-light hover:text-dark-pastel-red ${currentPath === '/kategoria/meble'
                  ? 'bg-beige-light text-dark-pastel-red'
                  : ''
                  }`}
              >
                <span className="p-2">Meble</span>
                <span
                  className={`ml-2 ${currentPath === '/kategoria/meble'
                    ? 'inline'
                    : 'hidden group-hover:inline'
                    }`}
                >
                  <img
                    src="/images/HVYT_meble_znak graficzny_burgundy.png"
                    alt="Meble icon"
                    className="h-6 pr-2"
                  />
                </span>
              </a>
            </Link>
          </li>
          {/* Non-category links with same active/hover styles */}
          <li className="font-bold">
            <Link href="/kolekcje" legacyBehavior>
              <a
                onClick={toggleMenu}
                className={`group flex items-center justify-between rounded-[25px] transition-colors duration-200 hover:bg-beige-light hover:text-dark-pastel-red ${currentPath === '/kolekcje'
                  ? 'bg-beige-light text-dark-pastel-red'
                  : ''
                  }`}
              >
                <span className="p-2">Kolekcje</span>
              </a>
            </Link>
          </li>
          <li className="font-bold">
            <Link href="/o-nas" legacyBehavior>
              <a
                onClick={toggleMenu}
                className={`group flex items-center justify-between rounded-[25px] transition-colors duration-200 hover:bg-beige-light hover:text-dark-pastel-red ${currentPath === '/o-nas'
                  ? 'bg-beige-light text-dark-pastel-red'
                  : ''
                  }`}
              >
                <span className="p-2">O nas</span>
              </a>
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom section with rounded border and 16px padding */}
      <div className="mt-10 space-y-6 text-xl rounded-[25px] bg-[#E9E5DF] p-[16px]">
        <ul className="space-y-6 text-xl">
          <li>
            {isLoggedIn ? (
              <div>
                {/* Dropdown trigger for "Moje konto" */}
                <button
                  onClick={handleAccountClick}
                  className="font-bold flex items-center w-full text-left"
                >
                  <img src="/icons/user.svg" alt="User" className="h-6 mr-3" />
                  {t.account.myAccount}
                  {/* Optional arrow icon for visual feedback */}
                  <svg
                    className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {/* Dropdown links */}
                {accountDropdownOpen && (
                  <ul className="mt-4 space-y-4 text-lg">
                    <li>
                      <Link href={getPath('/moje-konto/moje-zamowienia')} legacyBehavior>
                        <a
                          onClick={() => {
                            toggleMenu();
                            setAccountDropdownOpen(false);
                          }}
                          className="flex items-center py-2 rounded-[25px] cursor-pointer hover:bg-gray-100 text-[18px]"
                        >
                          <img
                            src="/icons/cart.svg"
                            alt={t.account.myOrders}
                            className="h-6 mr-3"
                          />
                          {t.account.myOrders}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={getPath('/moje-konto/kupione-produkty')} legacyBehavior>
                        <a
                          onClick={() => {
                            toggleMenu();
                            setAccountDropdownOpen(false);
                          }}
                          className="flex items-center py-2 rounded-[25px] cursor-pointer hover:bg-gray-100 text-[18px]"
                        >
                          <img
                            src="/icons/kupione.svg"
                            alt={t.account.boughtProducts}
                            className="h-6 mr-3"
                          />
                          {t.account.boughtProducts}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={getPath('/moje-konto/moje-dane')} legacyBehavior>
                        <a
                          onClick={() => {
                            toggleMenu();
                            setAccountDropdownOpen(false);
                          }}
                          className="flex items-center py-2 rounded-[25px] cursor-pointer hover:bg-gray-100 text-[18px]"
                        >
                          <img
                            src="/icons/user.svg"
                            alt={t.account.myData}
                            className="h-6 mr-3"
                          />
                          {t.account.myData}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={getPath('/moje-konto/moje-adresy')} legacyBehavior>
                        <a
                          onClick={() => {
                            toggleMenu();
                            setAccountDropdownOpen(false);
                          }}
                          className="flex items-center py-2 rounded-[25px] cursor-pointer hover:bg-gray-100 text-[18px]"
                        >
                          <img
                            src="/icons/home.svg"
                            alt={t.account.myAddresses}
                            className="h-6 mr-3"
                          />
                          {t.account.myAddresses}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={getPath('/moje-konto/dane-do-faktury')} legacyBehavior>
                        <a
                          onClick={() => {
                            toggleMenu();
                            setAccountDropdownOpen(false);
                          }}
                          className="flex items-center py-2 rounded-[25px] cursor-pointer hover:bg-gray-100 text-[18px]"
                        >
                          <img
                            src="/icons/do-faktury.svg"
                            alt="Dane do faktury"
                            className="h-6 mr-3"
                          />
                          Dane do faktury
                        </a>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                          toggleMenu();
                          router.push('/logowanie');
                        }}
                        className="flex items-center py-2 rounded-[25px] cursor-pointer hover:bg-gray-100 text-[18px]"
                      >
                        <img
                          src="/icons/logout-01.svg"
                          alt={t.account.logoutFull}
                          className="h-6 mr-3"
                        />
                        {t.account.logoutFull}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link href={getPath('/logowanie')} legacyBehavior>
                <a
                  onClick={handleAccountClick}
                  className="font-bold flex items-center"
                >
                  <img src="/icons/user.svg" alt="User" className="h-6 mr-3" />
                  {t.auth.login}
                </a>
              </Link>
            )}
          </li>
          <li>
            <Link href={getPath('/ulubione')} legacyBehavior>
              <a onClick={toggleMenu} className="font-bold">
                <div className="flex items-center">
                  <img src="/icons/heart.svg" alt="Wishlist" className="h-6 mr-3" />
                  <span>
                    {t.wishlist.wishlist}{favoriteCount > 0 && ` (${favoriteCount})`}
                  </span>
                </div>
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
