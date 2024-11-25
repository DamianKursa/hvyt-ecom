import React from 'react';
import Link from 'next/link';
import { useUserContext } from '../../context/UserContext';

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

  console.log('User in UserDropdown:', user); // Debug user data in the dropdown

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="bg-white shadow-lg rounded-[24px] p-4 w-[250px] text-sm"
    >
      {/* Greeting Section */}
      <div className="mb-4">
        <p className="font-bold text-[#661F30] text-[18px]">
          {user?.name ? user.name : 'Użytkownik'}
        </p>
        <p className="text-gray-500 text-[14px]">
          {user?.name ? `Witaj, ${user.name}!` : 'Fajnie, że jesteś z nami!'}
        </p>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-2">
        <li>
          <Link href="/moje-konto/moje-konto">
            <span className="block px-4 py-2 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Moje zamówienia
            </span>
          </Link>
        </li>
        <li>
          <Link href="/moje-konto/kupione-produkty">
            <span className="block px-4 py-2 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Kupione produkty
            </span>
          </Link>
        </li>
        <li>
          <Link href="/moje-konto/moje-dane">
            <span className="block px-4 py-2 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Moje dane
            </span>
          </Link>
        </li>
        <li>
          <Link href="/moje-konto/moje-adresy">
            <span className="block px-4 py-2 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Moje adresy
            </span>
          </Link>
        </li>
        <li>
          <Link href="/moje-konto/dane-do-faktury">
            <span className="block px-4 py-2 rounded-[24px] hover:bg-beige-dark text-[18px]">
              Dane do faktury
            </span>
          </Link>
        </li>
      </ul>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="block w-full text-left mt-4 text-red-500 px-4 py-2 border-t border-gray-200 rounded-[24px] hover:bg-beige-dark text-[18px]"
      >
        Wyloguj się
      </button>
    </div>
  );
};

export default UserDropdown;
