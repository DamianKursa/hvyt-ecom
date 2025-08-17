import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MojeKonto from './index';
import LoadingModal from '@/components/UI/LoadingModal';
import OrderTable from '@/components/MojeKonto/OrderTable';
import OrderDetails from '@/components/MojeKonto/OrderDetails';
import BoughtProductsList from '@/components/UI/BoughtProductsList';
import MojeDane from '@/components/MojeKonto/MojeDane';
import MyAddresses from '@/components/MojeKonto/MyAdresses';
import BillingAddresses from '@/components/MojeKonto/BillingAddresses';
import { Order, Product } from '@/utils/functions/interfaces';

const SectionPage: React.FC = () => {
  const router = useRouter();
  const { section } = router.query;

  const [content, setContent] = useState<Order[] | Product[] | null>(null);
  const [user, setUser] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!section) return;

    const fetchSectionData = async () => {
      try {
        setLoading(true);

        if (section === 'moje-dane') {
          const response = await fetch(`/api/moje-konto/${section}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const userData = await response.json();

            setUser({
              id: userData.id || 0,
              firstName: userData.firstName || 'N/A',
              lastName: userData.lastName || 'N/A',
              email: userData.email || 'N/A',
              phone: userData.phone || 'N/A',
            });
            setContent(null);
          } else {
            throw new Error('Failed to fetch user data');
          }
        } else if (section === 'moje-adresy') {
          const response = await fetch(`/api/moje-konto/adresy`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const addresses = await response.json();
            setContent(addresses);
          } else {
            setContent([]);
          }
        } else if (section === 'dane-do-faktury') {
          const response = await fetch(`/api/moje-konto/billing-addresses`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const billingAddresses = await response.json();
            setContent(billingAddresses);
          } else {
            setContent([]);
          }
        } else {
          const response = await fetch(`/api/moje-konto/${section}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setContent(data);
          } else if (response.status === 401) {
            setError('Unauthorized. Redirecting to login...');
            router.push('/logowanie');
          } else {
            setError('Data not found for this section.');
          }
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching section data:', error);
        setError('An error occurred while loading data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [section, router]);

  const handleUserUpdate = async (updatedUser: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => {
    try {
      if (!updatedUser.id) {
        throw new Error('User ID is missing');
      }

      const response = await fetch(`/api/moje-konto/moje-dane`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating user');
      }

      const result = await response.json();
      console.log('User updated successfully:', result);

      setUser({
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone
      });
    } catch (error: any) {
      console.error('Error updating user:', error.message);
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  const renderContent = () => {
    if (selectedOrder) {
      return (
        <div className="rounded-[25px] bg-white p-4 md:p-8 shadow-sm">
          <button
            onClick={handleBackToOrders}
            className="mb-4 text-[#661F30] font-semibold"
          >
            ← Powrót do zamówień
          </button>
          <OrderDetails order={selectedOrder} />
        </div>
      );
    }

    if (section === 'moje-zamowienia') {
      return (
        <div className="rounded-[25px] bg-white p-4 md:p-8 shadow-sm">

          {content && Array.isArray(content) && (
            <OrderTable
              content={content as Order[]}
              onViewDetails={handleViewOrderDetails}
            />
          )}
        </div>
      );
    }

    if (section === 'kupione-produkty') {
      return (
        <div className="rounded-[25px] bg-white p-4 md:p-8 shadow-sm">
          {content && Array.isArray(content) && (
            <BoughtProductsList products={content as Product[]} />
          )}
        </div>
      );
    }

    if (section === 'moje-dane') {
      return <MojeDane user={user} onUpdate={handleUserUpdate} />;
    }

    if (section === 'moje-adresy') {
      return <MyAddresses />;
    }

    if (section === 'dane-do-faktury') {
      return <BillingAddresses />;
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

  if (
    !content &&
    section !== 'moje-dane' &&
    section !== 'moje-adresy' &&
    section !== 'dane-do-faktury'
  ) {
    return (
      <MojeKonto>
        <div className="text-center text-gray-500">
          {section === 'moje-zamowienia'
            ? 'Nie znaleziono żadnych zamówień.'
            : 'Nie znaleziono żadnych produktów.'}
        </div>
      </MojeKonto>
    );
  }

  return <MojeKonto>{renderContent()}</MojeKonto>;
};

export default SectionPage;
