import React, { useState, useEffect } from 'react';
import AddressModal from './AddressModal';

const MyAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/moje-konto/adresy', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }

        const data = await response.json();
        setAddresses(data || []);
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setError('Could not load addresses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleSave = async (newAddress: any) => {
    if (addresses.length >= 3 && !modalData) {
      alert('You can only add up to 3 addresses.');
      return;
    }

    const updatedAddresses = modalData
      ? addresses.map((addr) => (addr === modalData ? newAddress : addr))
      : [...addresses, newAddress];

    setAddresses(updatedAddresses);

    try {
      const response = await fetch('/api/moje-konto/adresy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });

      if (!response.ok) {
        throw new Error('Failed to save addresses');
      }

      setError(null);
      setModalData(null); // Close the modal after successful save
    } catch (err: any) {
      console.error('Error saving addresses:', err);
      setError('Could not save address. Please try again later.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Moje adresy</h2>
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : addresses.length === 0 ? (
          <button
            onClick={() => setModalData({})}
            className="mt-4 bg-[#661F30] text-white px-4 py-2 rounded-md"
          >
            Dodaj Adres dostawy
          </button>
        ) : (
          <div>
            {addresses.map((address, index) => (
              <div key={index} className="mb-4 border p-4 rounded-md shadow-sm">
                <p>
                  <strong>Adres #{index + 1}:</strong> {address.street},{' '}
                  {address.city}, {address.country}
                </p>
                <button
                  onClick={() => setModalData(address)}
                  className="mt-2 bg-gray-500 text-white px-2 py-1 rounded-md"
                >
                  Edytuj
                </button>
              </div>
            ))}
            {addresses.length < 3 && (
              <button
                onClick={() => setModalData({})}
                className="mt-4 bg-[#661F30] text-white px-4 py-2 rounded-md"
              >
                Dodaj Adres dostawy
              </button>
            )}
          </div>
        )}
      </div>
      {modalData !== null && (
        <AddressModal
          address={modalData}
          onSave={handleSave}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
};

export default MyAddresses;
