import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MojeKonto from './index';
import Link from 'next/link';

interface ContentData {
  id: number;
  [key: string]: any; // Flexible type for API data
}

const SectionPage = () => {
  const router = useRouter();
  const { section } = router.query;

  const [content, setContent] = useState<ContentData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!section) return;

    const fetchSectionData = async () => {
      try {
        setLoading(true);

        // Get the user's token from cookies
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          setError('Brak autoryzacji.');
          router.push('/logowanie'); // Redirect to login if no token
          return;
        }

        const response = await fetch(`/api/moje-konto/${section}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Pass the token for authorization
          },
        });

        if (response.ok) {
          const data = await response.json();
          setContent(data);
          setError(null);
        } else {
          setError('Nie znaleziono danych dla tej sekcji.');
        }
      } catch (error) {
        console.error('Error fetching section data:', error);
        setError('Wystąpił błąd podczas ładowania danych.');
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [section, router]);

  if (loading) {
    return (
      <MojeKonto>
        <div className="flex justify-center items-center h-full">
          <img
            src="/icons/spinner.gif"
            alt="Loading..."
            className="h-10 w-10 animate-spin"
          />
        </div>
      </MojeKonto>
    );
  }

  if (error) {
    return (
      <MojeKonto>
        <div className="text-center text-red-500">{error}</div>
      </MojeKonto>
    );
  }

  if (!content || content.length === 0) {
    return (
      <MojeKonto>
        <div className="text-center text-gray-500">
          Brak danych do wyświetlenia dla tej sekcji.
        </div>
      </MojeKonto>
    );
  }

  const renderContent = () => {
    switch (section) {
      case 'moje-zamowienia':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Moje zamówienia</h2>
            <ul className="space-y-4">
              {content.map((order: any) => (
                <li key={order.id} className="border p-4 rounded-lg">
                  <p>Numer zamówienia: {order.id}</p>
                  <p>Data: {order.date_created}</p>
                  <p>Status płatności: {order.payment_status}</p>
                  <p>Status zamówienia: {order.status}</p>
                  <p>Razem: {order.total} zł</p>
                  <Link
                    className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-lg"
                    href={`/moje-konto/moje-zamowienia/${order.id}`}
                  >
                    Szczegóły
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'kupione-produkty':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Kupione produkty</h2>
            <ul className="space-y-4">
              {content.map((product: any) => (
                <li key={product.id} className="border p-4 rounded-lg">
                  <p>Produkt: {product.name}</p>
                  <p>Cena: {product.price} zł</p>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'moje-dane':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Moje dane</h2>
            <p>Email: {content[0]?.email}</p>
            <p>Imię i nazwisko: {content[0]?.name}</p>
            <Link
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg"
              href="/moje-konto/zmien-haslo"
            >
              Zmień hasło
            </Link>
          </div>
        );
      case 'moje-adresy':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Moje adresy</h2>
            <ul className="space-y-4">
              {content.map((address: any) => (
                <li key={address.id} className="border p-4 rounded-lg">
                  <p>
                    Adres: {address.street}, {address.city}
                  </p>
                  <p>Kraj: {address.country}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'dane-do-faktury':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dane do faktury</h2>
            <ul className="space-y-4">
              {content.map((billing: any) => (
                <li key={billing.id} className="border p-4 rounded-lg">
                  <p>Nazwa: {billing.name}</p>
                  <p>NIP: {billing.tax_id}</p>
                  <p>Adres: {billing.address}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return <p>Nieznana sekcja.</p>;
    }
  };

  return <MojeKonto>{renderContent()}</MojeKonto>;
};

export default SectionPage;
