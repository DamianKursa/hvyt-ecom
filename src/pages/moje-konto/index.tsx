import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';

const endpoints = [
  { key: 'orders', label: 'Moje zamówienia' },
  { key: 'downloads', label: 'Pliki do pobrania' },
  { key: 'edit-account', label: 'Edytuj konto' },
  { key: 'edit-address', label: 'Moje adresy' },
  { key: 'payment-methods', label: 'Metody płatności' },
  { key: 'customer-logout', label: 'Wyloguj się' },
];

const MojeKontoLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <Layout title="Moje konto">
      <div className="container mx-auto py-8 px-4 flex">
        {/* Sidebar */}
        <aside className="w-1/4 border-r border-gray-300 pr-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Moje konto</h2>
          </div>
          <ul className="space-y-2">
            {endpoints.map((endpoint) => (
              <li key={endpoint.key}>
                <Link
                  href={`/moje-konto/${endpoint.key}`}
                  className={`block px-4 py-2 rounded-lg text-lg font-medium ${
                    router.asPath === `/moje-konto/${endpoint.key}`
                      ? 'bg-primary text-white'
                      : 'hover:bg-beige-dark text-gray-700'
                  }`}
                >
                  {endpoint.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 pl-4">{children}</main>
      </div>
    </Layout>
  );
};

export default MojeKontoLayout;
