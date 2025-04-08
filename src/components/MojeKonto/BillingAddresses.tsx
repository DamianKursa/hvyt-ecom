import React, { useState, useEffect } from 'react';
import BillingModal from './BillingModal';
import LoadingModal from '@/components/UI/LoadingModal';

interface BillingData {
  type: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  nip?: string;
  street: string;
  billing_address_2?: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
}

const BillingAddresses: React.FC = () => {
  const [billingData, setBillingData] = useState<BillingData[]>([]);
  const [modalData, setModalData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

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

  const handleSave = async (newBillingData: BillingData) => {
    try {
      const formattedAddress = {
        ...newBillingData,
        billing_address_2: `${newBillingData.buildingNumber || ''}${
          newBillingData.apartmentNumber
            ? `/${newBillingData.apartmentNumber}`
            : ''
        }`,
      };

      const payload = {
        action: 'add',
        address: formattedAddress,
      };

      const response = await fetch('/api/moje-konto/billing-addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error response from server:', responseData);
        throw new Error(
          responseData.message || 'Failed to save billing address',
        );
      }

      await fetchBillingData();
      setModalData(null);
    } catch (err) {
      console.error('Error saving billing address:', err);
      alert('Nie udało się zapisać danych do faktury. Spróbuj ponownie.');
    }
  };

  const parseBillingAddress2 = (address2: string | undefined) => {
    if (!address2) return { buildingNumber: '', apartmentNumber: '' };
    const [buildingNumber, apartmentNumber] = address2.split('/');
    return {
      buildingNumber: buildingNumber || '',
      apartmentNumber: apartmentNumber || '',
    };
  };

  const individualAddress = billingData.find(
    (addr) => addr.type === 'individual',
  );
  const companyAddress = billingData.find((addr) => addr.type === 'company');

  if (loading) {
    return (
      <LoadingModal
        title="Ładowanie..."
        description="Proszę czekać, trwa ładowanie danych..."
      />
    );
  }

  return (
    <div className="rounded-[25px] bg-white p-8">
      <h2 className="text-2xl font-semibold text-[#661F30] mb-8">
        Dane do faktury
      </h2>

      <div className="border rounded-[25px]">
        {error ? (
          <p className="text-red-500 p-4">{error}</p>
        ) : (
          <>
            {/* Individual Address Section */}
            <div className="py-4 px-4 border-b border-[#E9E5DF] last:border-none">
              {individualAddress ? (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-black mb-2">
                      Dane do faktury - klient indywidualny
                    </p>
                    <p>
                      {individualAddress.firstName} {individualAddress.lastName}
                    </p>
                    <p>
                      {individualAddress.street},{' '}
                      {individualAddress.billing_address_2}
                    </p>
                    <p>
                      {individualAddress.city}, {individualAddress.postalCode}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const { buildingNumber, apartmentNumber } =
                        parseBillingAddress2(
                          individualAddress.billing_address_2 || '',
                        );
                      setModalData({
                        ...individualAddress,
                        buildingNumber,
                        apartmentNumber,
                      });
                    }}
                    className="text-black border border-black px-4 py-2 rounded-full flex items-center"
                  >
                    Edytuj
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-black">
                    Dane do faktury - klient indywidualny
                  </p>
                  <button
                    onClick={() =>
                      setModalData({
                        type: 'individual',
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
                    Dodaj dane
                  </button>
                </div>
              )}
            </div>

            {/* Company Address Section */}
            <div className="py-4 px-4 border-b border-[#E9E5DF] last:border-none">
              {companyAddress ? (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-black mb-2">
                      Dane do faktury - firma
                    </p>
                    <p>
                      {companyAddress.companyName}, NIP: {companyAddress.nip}
                    </p>
                    <p>
                      {companyAddress.street},{' '}
                      {companyAddress.billing_address_2}
                    </p>
                    <p>
                      {companyAddress.city}, {companyAddress.postalCode}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const { buildingNumber, apartmentNumber } =
                        parseBillingAddress2(
                          companyAddress.billing_address_2 || '',
                        );
                      setModalData({
                        ...companyAddress,
                        buildingNumber,
                        apartmentNumber,
                      });
                    }}
                    className="text-black border border-black px-4 py-2 rounded-full flex items-center"
                  >
                    Edytuj
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-black">
                    Dane do faktury - firma
                  </p>
                  <button
                    onClick={() =>
                      setModalData({
                        type: 'company',
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
                    Dodaj dane
                  </button>
                </div>
              )}
            </div>
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
