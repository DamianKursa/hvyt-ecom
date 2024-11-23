import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import Link from 'next/link';

const endpoints = [
  {
    key: 'orders',
    label: 'Moje zamówienia',
    path: '/moje-konto/moje-zamowienia',
  },
  {
    key: 'kupione-produkty',
    label: 'Kupione produkty',
    path: '/moje-konto/kupione-produkty',
  },
  { key: 'moje-dane', label: 'Moje dane', path: '/moje-konto/moje-dane' },
  { key: 'moje-adresy', label: 'Moje adresy', path: '/moje-konto/moje-adresy' },
  {
    key: 'dane-do-faktury',
    label: 'Dane do faktury',
    path: '/moje-konto/dane-do-faktury',
  },
];

interface MojeKontoProps {
  children?: React.ReactNode; // Allow children to be passed into the component
}

const MojeKonto: React.FC<MojeKontoProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // Replace `any` with proper typing
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.push('/logowanie');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        router.push('/logowanie');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src="/icons/spinner.gif"
          alt="Loading..."
          className="h-10 w-10 animate-spin"
        />
      </div>
    );
  }

  if (!user) {
    return null; // If user data isn't available, return null
  }

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
                <Link href={endpoint.path}>
                  <span className="block px-4 py-2 rounded-[24px] hover:bg-beige-dark text-[18px]">
                    {endpoint.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 pl-4">
          <h2 className="text-2xl font-bold mb-6">
            Witaj, {user.name || user.username}
          </h2>
          {children || (
            <p className="text-gray-500">
              Wybierz sekcję z menu, aby zobaczyć szczegóły.
            </p>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default MojeKonto;
