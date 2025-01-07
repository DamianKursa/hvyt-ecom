import React, { useState, useEffect } from 'react';
import BillingModal from './BillingModal'; // Import the new BillingModal

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
      // Check if adding a duplicate type
      if (
        newBillingData.type === 'individual' &&
        billingData.some((addr) => addr.type === 'individual') &&
        !modalData
      ) {
        alert('Możesz dodać tylko jeden adres indywidualny.');
        return;
      }
      if (
        newBillingData.type === 'company' &&
        billingData.some((addr) => addr.type === 'company') &&
        !modalData
      ) {
        alert('Możesz dodać tylko jeden adres firmowy.');
        return;
      }

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Dane do faktury</h2>
      {loading ? (
        <p>Ładowanie...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : billingData && billingData.length > 0 ? (
        billingData.map((data, index) => (
          <div key={index} className="mb-4 border p-4 rounded-md shadow-sm">
            <p>
              <strong>
                {data.type === 'individual'
                  ? 'Dane do faktury - klient indywidualny'
                  : 'Dane do faktury - firma'}
              </strong>
            </p>
            {data.type === 'individual' ? (
              <p>
                {data.firstName} {data.lastName}
              </p>
            ) : (
              <p>
                {data.companyName}, NIP: {data.nip}
              </p>
            )}
            <p>
              {data.street}, {data.buildingNumber}
              {data.apartmentNumber && `/${data.apartmentNumber}`}, {data.city},{' '}
              {data.postalCode}
            </p>
            <button
              onClick={() => setModalData(data)}
              className="mt-2 bg-gray-500 text-white px-2 py-1 rounded-md"
            >
              Edytuj
            </button>
          </div>
        ))
      ) : (
        <p>Nie znaleziono danych do faktury.</p>
      )}
      <button
        onClick={() =>
          setModalData({
            type: billingData.some((addr) => addr.type === 'individual')
              ? 'company'
              : 'individual',
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
        className="mt-4 bg-[#661F30] text-white px-4 py-2 rounded-md"
      >
        Dodaj dane
      </button>
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
