import React from 'react';
import Link from 'next/link';
import { useUserContext } from '@/context/UserContext';

interface UserDropdownProps {
  onLogout: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  onLogout,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { user } = useUserContext();

  console.log('User in UserDropdown:', user);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="bg-beige rounded-[24px] w-[210px] text-[18px]"
    >
      {/* Greeting Section */}
      <div className="mb-4">
        <p className="font-bold px-4 pt-4 text-[#661F30] text-[18px]">
          {user?.name || 'Użytkownik'}
        </p>
        <p className="font-light px-4 text-[#661F30] text-[16px]">
          fajnie, że jesteś z nami!
        </p>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-2 pb-2 text-black font-light">
        <li>
          <Link href="/moje-konto/moje-zamowienia">
            <span className="block py-2 px-4 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Moje zamówienia
            </span>
          </Link>
        </li>
        <li>
          <Link href="/moje-konto/kupione-produkty">
            <span className="block py-2 px-4 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Kupione produkty
            </span>
          </Link>
        </li>
        <li>
          <Link href="/moje-konto/moje-dane">
            <span className="block py-2 px-4 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Moje dane
            </span>
          </Link>
        </li>
        <li>
          <Link href="/moje-konto/moje-adresy">
            <span className="block py-2 px-4 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Moje adresy
            </span>
          </Link>
        </li>
        <li>
          <Link href="/moje-konto/dane-do-faktury">
            <span className="block py-2 px-4 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Dane do faktury
            </span>
          </Link>
        </li>
        <div className="border-t border-neutral-light"></div>
        <li>
          <button
            onClick={onLogout}
            className="flex items-center w-full text-left text-black font-light px-4 py-2 rounded-[24px] hover:bg-beige-dark text-[16px]"
          >
            <img
              src="/icons/logout-02.svg"
              alt="Logout Icon"
              className="w-5 h-5 mr-2"
            />
            Wyloguj się
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;
