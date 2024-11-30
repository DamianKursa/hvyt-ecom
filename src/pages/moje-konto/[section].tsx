import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MojeKonto from './index';
import LoadingModal from '@/components/UI/LoadingModal';
import OrderTable from '@/components/MojeKonto/OrderTable';
import OrderDetails from '@/components/MojeKonto/OrderDetails';
import { Order } from '@/utils/functions/interfaces';

const SectionPage: React.FC = () => {
  const router = useRouter();
  const { section, id } = router.query;

  const [content, setContent] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!section || id) return;

    const fetchSectionData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/moje-konto/${section}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data: Order[] = await response.json();
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
  }, [section, id, router]);

  const renderContent = () => {
    if (id && section === 'moje-zamowienia') {
      return <OrderDetails />;
    }

    if (section === 'moje-zamowienia') {
      return (
        <div className="rounded-[25px] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-[#661F30]">
            Moje zamówienia
          </h2>
          {content && <OrderTable content={content} />}
        </div>
      );
    }

    return <p>Unknown section.</p>;
  };

  if (loading) {
    return (
      <MojeKonto>
        <LoadingModal
          title="Ładowanie..."
          description="Proszę czekać, trwa ładowanie danych..."
        />
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

  return <MojeKonto>{renderContent()}</MojeKonto>;
};

export default SectionPage;
