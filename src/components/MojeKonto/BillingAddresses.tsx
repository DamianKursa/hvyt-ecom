import React, { useState, useEffect } from 'react';
import BillingModal from './BillingModal'; // Import the BillingModal component
import LoadingModal from '@/components/UI/LoadingModal'; // Import the LoadingModal component

interface BillingData {
  type: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  nip?: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  city: string;
  postalCode: string;
}

const BillingAddresses: React.FC = () => {
  const [billingData, setBillingData] = useState<BillingData[]>([]); // Array of billing addresses
  const [modalData, setModalData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/moje-konto/billing-addresses', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch billing addresses');
        const data = await response.json();
        setBillingData(data || []);
      } catch (err) {
        console.error(err);
        setError('Nie udało się załadować danych do faktury.');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const handleSave = async (newBillingData: BillingData) => {
    try {
      const payload = modalData
        ? {
            action: 'update',
            addresses: billingData.map((addr) =>
              addr === modalData ? newBillingData : addr,
            ),
          }
        : { action: 'add', address: newBillingData };

      const response = await fetch('/api/moje-konto/billing-addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save billing address');
      }

      // Refresh the data after successful save
      const updatedBillingData = await fetch(
        '/api/moje-konto/billing-addresses',
        {
          method: 'GET',
          credentials: 'include',
        },
      ).then((res) => res.json());

      setBillingData(updatedBillingData);
      setModalData(null); // Close the modal
    } catch (err) {
      console.error(err);
      alert('Nie udało się zapisać danych do faktury. Spróbuj ponownie.');
    }
  };

  // Show LoadingModal until data is fully loaded
  if (loading) {
    return (
      <LoadingModal
        title="Ładowanie..."
        description="Proszę czekać, trwa ładowanie danych..."
      />
    );
  }

  const availableType =
    billingData.some((addr) => addr.type === 'individual') &&
    billingData.length < 2
      ? 'company'
      : 'individual';

  return (
    <div className="rounded-[25px] bg-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-[#661F30]">
          Dane do faktury
        </h2>
      </div>
      <div className="border rounded-[25px]">
        {error ? (
          <p className="text-red-500 p-4">{error}</p>
        ) : (
          <>
            {billingData.map((data, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-4 px-4 border-b border-[#E9E5DF] last:border-none"
              >
                <div>
                  <p className="font-semibold text-black mb-2">
                    {data.type === 'individual'
                      ? 'Dane do faktury - klient indywidualny'
                      : 'Dane do faktury - firma'}
                  </p>
                  <p>
                    {data.type === 'individual'
                      ? `${data.firstName} ${data.lastName}`
                      : `${data.companyName}, NIP: ${data.nip}`}
                  </p>
                  <p>
                    {data.street}, {data.buildingNumber}
                    {data.apartmentNumber && `/${data.apartmentNumber}`},{' '}
                    {data.city}, {data.postalCode}
                  </p>
                </div>
                <button
                  onClick={() => setModalData(data)}
                  className="text-black border border-black px-4 py-2 rounded-full flex items-center"
                >
                  Edytuj
                  <img
                    src="/icons/edit.svg"
                    alt="Edytuj"
                    className="w-4 h-4 ml-2"
                  />
                </button>
              </div>
            ))}
            {billingData.length < 2 && (
              <div className="flex justify-between items-center py-4 px-4">
                <p className="font-semibold text-black">
                  {availableType === 'individual'
                    ? 'Dane do faktury - klient indywidualny'
                    : 'Dane do faktury - firma'}
                </p>
                <button
                  onClick={() =>
                    setModalData({
                      type: availableType,
                      firstName: '',
                      lastName: '',
                      companyName: '',
                      nip: '',
                      street: '',
                      buildingNumber: '',
                      apartmentNumber: '',
                      city: '',
                      postalCode: '',
                    })
                  }
                  className="text-white bg-black border border-black px-4 py-2 rounded-full flex items-center"
                >
                  Dodaj{' '}
                  {availableType === 'individual' ? 'indywidualny' : 'firmowy'}
                  <span className="ml-2">+</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {modalData && (
        <BillingModal
          billingData={modalData}
          onSave={handleSave}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
};

export default BillingAddresses;
