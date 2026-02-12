import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/utils/hooks/useI18n';

const Sidebar = ({ section }: { section: string }) => {
  const { t, getPath } = useI18n();
  
  const menuItems = [
    {
      label: t.account.myData,
      href: getPath('/moje-konto/moje-dane'),
      icon: '/icons/user.svg',
    },
    {
      label: t.account.myOrders,
      href: getPath('/moje-konto/moje-zamowienia'),
      icon: '/icons/cart.svg',
    },
    {
      label: t.account.boughtProducts,
      href: getPath('/moje-konto/kupione-produkty'),
      icon: '/icons/kupione.svg',
    },
    {
      label: t.account.billingData,
      href: getPath('/moje-konto/dane-do-faktury'),
      icon: '/icons/do-faktury.svg',
    },
    {
      label: t.account.logout,
      href: getPath('/logowanie'),
      icon: '/icons/logout-01.svg',
    },
  ];

  return (
    <div className="bg-beige-dark p-6 rounded-lg w-full md:w-64">
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`flex items-center p-3 rounded-lg ${
              section === item.href.split('/').pop()
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={24}
              height={24}
              className="mr-3"
            />
            <Link href={item.href} className="text-lg font-medium">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
