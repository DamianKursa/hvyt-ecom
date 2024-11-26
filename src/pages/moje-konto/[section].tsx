import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MojeKonto from './index';
import Link from 'next/link';

interface ContentData {
  id: number;
  [key: string]: any;
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

        const response = await fetch(`/api/moje-konto/${section}`, {
          method: 'GET',
          credentials: 'include', // Automatically includes cookies
        });

        if (response.ok) {
          const data = await response.json();
          setContent(data);
          setError(null);
        } else if (response.status === 401) {
          setError('Unauthorized. Redirecting to login...');
          router.push('/logowanie');
        } else {
          setError('Data not found for this section.');
        }
      } catch (error) {
        console.error('Error fetching section data:', error);
        setError('An error occurred while loading data.');
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
          No data available for this section.
        </div>
      </MojeKonto>
    );
  }

  const renderContent = () => {
    switch (section) {
      case 'moje-zamowienia':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>
            <ul className="space-y-4">
              {content.map((order) => (
                <li key={order.id} className="border p-4 rounded-lg">
                  <p>Order Number: {order.id}</p>
                  <p>Date: {order.date_created}</p>
                  <p>Payment Status: {order.payment_status}</p>
                  <p>Order Status: {order.status}</p>
                  <p>Total: {order.total} zł</p>
                  <Link
                    className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-lg"
                    href={`/moje-konto/moje-zamowienia/${order.id}`}
                  >
                    Details
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'kupione-produkty':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Purchased Products</h2>
            <ul className="space-y-4">
              {content.map((product) => (
                <li key={product.id} className="border p-4 rounded-lg">
                  <p>Product: {product.name}</p>
                  <p>Price: {product.price} zł</p>
                </li>
              ))}
            </ul>
          </div>
        );
      // Add more cases for other sections...
      default:
        return <p>Unknown section.</p>;
    }
  };

  return <MojeKonto>{renderContent()}</MojeKonto>;
};

export default SectionPage;
