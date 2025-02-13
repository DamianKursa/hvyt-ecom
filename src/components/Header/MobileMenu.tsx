import React, { useState } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  isLoggedIn: boolean; // Pass logged-in status as a prop
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  menuOpen,
  toggleMenu,
  isLoggedIn,
}) => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // Handle click on "Moje konto"
  const handleAccountClick = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      // Prevent default link behavior if logged in to toggle dropdown instead
      e.preventDefault();
      setAccountDropdownOpen(!accountDropdownOpen);
    } else {
      // If not logged in, let the Link work normally (navigates to /logowanie)
      toggleMenu();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-white z-50 w-full transition-transform duration-300 ease-in-out p-4 ${
        menuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Main Menu links with 16px padding */}
      <div className="rounded-[25px] bg-[#E9E5DF] p-[16px] mt-[78px]">
        <ul className="space-y-6 text-xl">
          <li className="font-bold">
            <Link href="/kategoria/uchwyty-meblowe" onClick={toggleMenu}>
              Uchwyty
            </Link>
          </li>
          <li className="font-bold">
            <Link href="/kategoria/klamki" onClick={toggleMenu}>
              Klamki
            </Link>
          </li>
          <li className="font-bold">
            <Link href="/kategoria/wieszaki" onClick={toggleMenu}>
              Wieszaki
            </Link>
          </li>
          <li className="font-bold">
            <Link href="/kolekcje" onClick={toggleMenu}>
              Kolekcje
            </Link>
          </li>
          <li className="font-bold">
            <Link href="/o-nas" onClick={toggleMenu}>
              O nas
            </Link>
          </li>
          <li className="font-bold">
            <Link href="/kontakt" onClick={toggleMenu}>
              Kontakt
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
                  Moje konto
                  {/* Optional arrow icon for visual feedback */}
                  <svg
                    className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
                      accountDropdownOpen ? 'rotate-180' : 'rotate-0'
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
                  <ul className="mt-4 ml-8 space-y-4 text-lg">
                    <li>
                      <Link
                        href="/moje-konto/moje-zamowienia"
                        onClick={() => {
                          toggleMenu();
                          setAccountDropdownOpen(false);
                        }}
                        className="block"
                      >
                        Moje zamówienia
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/moje-konto/kupione-produkty"
                        onClick={() => {
                          toggleMenu();
                          setAccountDropdownOpen(false);
                        }}
                        className="block"
                      >
                        Kupione produkty
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="moje-konto/moje-dane"
                        onClick={() => {
                          toggleMenu();
                          setAccountDropdownOpen(false);
                        }}
                        className="block"
                      >
                        Moje dane
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/moje-konto/moje-adresy"
                        onClick={() => {
                          toggleMenu();
                          setAccountDropdownOpen(false);
                        }}
                        className="block"
                      >
                        Moje adresy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/moje-konto/dane-do-faktury"
                        onClick={() => {
                          toggleMenu();
                          setAccountDropdownOpen(false);
                        }}
                        className="block"
                      >
                        Dane do faktury
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              // If not logged in, navigate to the login page
              <Link
                href="/logowanie"
                onClick={handleAccountClick}
                className="font-bold flex items-center"
              >
                <img src="/icons/user.svg" alt="User" className="h-6 mr-3" />
                Zaloguj się
              </Link>
            )}
          </li>
          <li>
            <Link href="/ulubione" onClick={toggleMenu} className="font-bold">
              <div className="flex items-center">
                <img
                  src="/icons/heart.svg"
                  alt="Wishlist"
                  className="h-6 mr-3"
                />
                Ulubione
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
