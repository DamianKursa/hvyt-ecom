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
import { useI18n } from '@/utils/hooks/useI18n';

const SectionPage: React.FC = () => {
  const { t, getPath } = useI18n();
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

    let cancelled = false;
    const isOrdersSection =
      section === 'moje-zamowienia' || section === 'kupione-produkty';

    const fetchNoStore = (url: string) =>
      fetch(url, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

    const fetchSectionData = async (showLoader: boolean) => {
      try {
        if (showLoader) setLoading(true);

        if (section === 'moje-dane') {
          const response = await fetchNoStore(`/api/moje-konto/${section}`);

          if (response.ok) {
            const userData = await response.json();
            if (cancelled) return;

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
          const response = await fetchNoStore(`/api/moje-konto/adresy`);

          if (response.ok) {
            const addresses = await response.json();
            if (cancelled) return;
            setContent(addresses);
          } else if (!cancelled) {
            setContent([]);
          }
        } else if (section === 'dane-do-faktury') {
          const response = await fetchNoStore(`/api/moje-konto/billing-addresses`);

          if (response.ok) {
            const billingAddresses = await response.json();
            if (cancelled) return;
            setContent(billingAddresses);
          } else if (!cancelled) {
            setContent([]);
          }
        } else {
          const cacheBust = isOrdersSection ? `?t=${Date.now()}` : '';
          const response = await fetchNoStore(`/api/moje-konto/${section}${cacheBust}`);

          if (response.ok) {
            const data = await response.json();
            if (cancelled) return;
            setContent(data);
          } else if (response.status === 401) {
            if (cancelled) return;
            setError('Unauthorized. Redirecting to login...');
            router.push(getPath('/logowanie'));
            return;
          } else if (!cancelled) {
            setError('Data not found for this section.');
            return;
          }
        }

        if (!cancelled) setError(null);
      } catch (error) {
        console.error('Error fetching section data:', error);
        if (!cancelled) setError('An error occurred while loading data.');
      } finally {
        if (!cancelled && showLoader) setLoading(false);
      }
    };

    fetchSectionData(true);

    const refetchOnFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchSectionData(false);
      }
    };

    if (isOrdersSection) {
      window.addEventListener('focus', refetchOnFocus);
      document.addEventListener('visibilitychange', refetchOnFocus);
    }

    return () => {
      cancelled = true;
      window.removeEventListener('focus', refetchOnFocus);
      document.removeEventListener('visibilitychange', refetchOnFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when the account section changes
  }, [section]);

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
            ← {t.order.backToOrders}
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
          title={t.modal.loading}
          description={t.modal.messageWaitLoading}
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
