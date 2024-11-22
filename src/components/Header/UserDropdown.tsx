import React from 'react';
import Link from 'next/link';

interface UserDropdownProps {
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onLogout }) => {
  return (
    <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-48">
      {/* User Greeting */}
      <div className="p-4 text-sm">
        <p className="font-bold text-[#661F30]">Anna,</p>
        <p className="text-xs text-gray-500">Fajnie, że jesteś z nami!</p>
      </div>

      {/* Navigation Links */}
      <ul className="divide-y divide-gray-200 text-sm">
        <li>
          <Link href="/moje-konto">
            <span className="block px-4 py-2 hover:bg-gray-100">
              Moje zamówienia
            </span>
          </Link>
        </li>
        <li>
          <Link href="/kupione-produkty">
            <span className="block px-4 py-2 hover:bg-gray-100">
              Kupione produkty
            </span>
          </Link>
        </li>
        <li>
          <Link href="/moje-dane">
            <span className="block px-4 py-2 hover:bg-gray-100">Moje dane</span>
          </Link>
        </li>
        <li>
          <Link href="/moje-adresy">
            <span className="block px-4 py-2 hover:bg-gray-100">
              Moje adresy
            </span>
          </Link>
        </li>
        <li>
          <Link href="/dane-do-faktury">
            <span className="block px-4 py-2 hover:bg-gray-100">
              Dane do faktury
            </span>
          </Link>
        </li>
      </ul>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
      >
        Wyloguj się
      </button>
    </div>
  );
};

export default UserDropdown;
