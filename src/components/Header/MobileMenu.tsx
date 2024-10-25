import React from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ menuOpen }) => {
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
            <Link href="/kategoria/uchwyty-meblowe">Uchwyty</Link>
          </li>
          <li className="font-bold">
            <Link href="/kategoria/klamki">Klamki</Link>
          </li>
          <li className="font-bold">
            <Link href="/kategoria/wieszaki">Wieszaki</Link>
          </li>
          <li className="font-bold">
            <Link href="/hvyt-objects">Hvyt Objects</Link>
          </li>
          <li className="font-bold">
            <Link href="/kolekcje">Kolekcje</Link>
          </li>
          <li className="font-bold">
            <Link href="/o-nas">O nas</Link>
          </li>
          <li className="font-bold">
            <Link href="/kontakt">Kontakt</Link>
          </li>
        </ul>
      </div>

      {/* Bottom section with rounded border and 16px padding */}
      <div className="mt-10 space-y-6 text-xl rounded-[25px] bg-[#E9E5DF] p-[16px]">
        <ul className="space-y-6 text-xl">
          <li>
            <Link className="font-bold" href="/login">
              <div className="flex items-center">
                <img src="/icons/user.svg" alt="User" className="h-6 mr-3" />
                Zaloguj się
              </div>
            </Link>
          </li>
          <li>
            <Link className="font-bold" href="/wishlist">
              <div className="flex items-center">
                <img src="/icons/heart.svg" alt="Wishlist" className="h-6 mr-3" />
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
