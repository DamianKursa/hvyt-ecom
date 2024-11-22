import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
            <a className="block px-4 py-2 hover:bg-gray-100">Moje zamówienia</a>
          </Link>
        </li>
        <li>
          <Link href="/kupione-produkty">
            <a className="block px-4 py-2 hover:bg-gray-100">
              Kupione produkty
            </a>
          </Link>
        </li>
        <li>
          <Link href="/moje-dane">
            <a className="block px-4 py-2 hover:bg-gray-100">Moje dane</a>
          </Link>
        </li>
        <li>
          <Link href="/moje-adresy">
            <a className="block px-4 py-2 hover:bg-gray-100">Moje adresy</a>
          </Link>
        </li>
        <li>
          <Link href="/dane-do-faktury">
            <a className="block px-4 py-2 hover:bg-gray-100">Dane do faktury</a>
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
