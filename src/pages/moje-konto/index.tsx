import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import Link from 'next/link';
import Image from 'next/image';

const endpoints = [
  {
    key: 'orders',
    label: 'Moje zamówienia',
    path: '/moje-konto/moje-zamowienia',
    icon: '/icons/cart.svg',
  },
  {
    key: 'kupione-produkty',
    label: 'Kupione produkty',
    path: '/moje-konto/kupione-produkty',
    icon: '/icons/kupione.svg',
  },
  {
    key: 'moje-dane',
    label: 'Moje dane',
    path: '/moje-konto/moje-dane',
    icon: '/icons/user.svg',
  },
  {
    key: 'moje-adresy',
    label: 'Moje adresy',
    path: '/moje-konto/moje-adresy',
    icon: '/icons/home.svg',
  },
  {
    key: 'dane-do-faktury',
    label: 'Dane do faktury',
    path: '/moje-konto/dane-do-faktury',
    icon: '/icons/do-faktury.svg',
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
      <div className="container mx-auto py-8  flex">
        {/* Sidebar */}
        <aside className="w-1/4 bg-beige p-8  max-h-[410px]  rounded-[25px]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Moje konto</h2>
          </div>
          <ul className="space-y-4">
            {endpoints.map((endpoint) => (
              <li key={endpoint.key}>
                <Link href={endpoint.path}>
                  <div className="flex items-center py-2 rounded-[25px] hover:bg-gray-100 cursor-pointer">
                    <Image
                      src={endpoint.icon}
                      alt={endpoint.label}
                      width={24}
                      height={24}
                      className="mr-3"
                    />
                    <span className="text-[18px]">{endpoint.label}</span>
                  </div>
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
