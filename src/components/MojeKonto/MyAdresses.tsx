import React, { useState, useEffect } from 'react';
import AddressModal from './AddressModal'; // Import AddressModal
import LoadingModal from '@/components/UI/LoadingModal'; // Import LoadingModal

const MyAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch addresses on component mount
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
        setAddresses(data || []); // Update state with fetched addresses
      } catch (err) {
        setError('Nie udało się załadować adresów.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle save (add or update address)
  const handleSave = async (newAddress: any) => {
    try {
      let payload;

      if (modalData && Object.keys(modalData).length > 0) {
        // Update existing address
        payload = {
          action: 'update',
          addresses: addresses.map((addr) =>
            addr === modalData ? newAddress : addr,
          ),
        };
      } else {
        // Add new address
        payload = { action: 'add', address: newAddress };
      }

      const response = await fetch('/api/moje-konto/adresy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Nie udało się zapisać adresu.');
        return;
      }

      // Refresh the address list by re-fetching all addresses
      const refreshedAddresses = await fetch('/api/moje-konto/adresy', {
        method: 'GET',
        credentials: 'include',
      }).then((res) => res.json());

      setAddresses(refreshedAddresses);
      setModalData(null); // Close modal
    } catch {
      alert('Wystąpił błąd podczas zapisywania adresu. Spróbuj ponownie.');
    }
  };

  // Open modal for adding a new address
  const handleAddAddress = () => {
    setModalData({}); // Reset modalData for a fresh new address
  };

  // Show LoadingModal while loading data
  if (loading) {
    return (
      <LoadingModal
        title="Ładowanie..."
        description="Proszę czekać, trwa ładowanie adresów..."
      />
    );
  }

  return (
    <div className="rounded-[25px] bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-[#661F30]">
        Moje adresy
      </h2>
      <div className="border rounded-[25px]">
        {error ? (
          <p className="text-red-500 p-4">{error}</p>
        ) : (
          <>
            {addresses.map((address, index) => (
              <div
                key={index}
                className="py-4 border-b border-gray-300 last:border-none flex items-start justify-between px-4"
              >
                <div>
                  <p className="font-semibold mb-[32px]">
                    Adres dostawy #{index + 1}
                  </p>
                  <p>
                    {address.street}, {address.buildingNumber}
                    {address.apartmentNumber && `/${address.apartmentNumber}`}
                  </p>
                  <p>
                    {address.city}, {address.postalCode}, {address.country}
                  </p>
                </div>
                <button
                  onClick={() => setModalData(address)}
                  className="text-black border border-black px-4 py-2 rounded-full flex items-center"
                >
                  Edytuj Adres dostawy
                  <img
                    src="/icons/edit.svg"
                    alt="Edytuj"
                    className="w-4 h-4 ml-2"
                  />
                </button>
              </div>
            ))}
            {addresses.length < 3 && (
              <div className="py-4 flex items-start justify-between px-4">
                <p className="font-semibold mb-[32px]">
                  Adres dostawy #{addresses.length + 1}
                </p>
                <button
                  onClick={handleAddAddress}
                  className="text-white bg-[#000] border border-black px-4 py-2 rounded-full flex items-center"
                >
                  Dodaj Adres dostawy
                  <span className="ml-2">+</span>
                </button>
              </div>
            )}
          </>
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
