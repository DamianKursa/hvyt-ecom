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
        console.log('Fetched addresses:', data); // Debugging log
        setAddresses(data || []); // Update state with fetched addresses
      } catch (err) {
        console.error('Error fetching addresses:', err);
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

      console.log('Payload to API:', payload);

      const response = await fetch('/api/moje-konto/adresy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to save addresses:', errorData);
        alert(errorData.error || 'Nie udało się zapisać adresu.');
        return;
      }

      const result = await response.json();
      console.log('Addresses saved successfully:', result);

      // Refresh the address list by re-fetching all addresses
      const refreshedAddresses = await fetch('/api/moje-konto/adresy', {
        method: 'GET',
        credentials: 'include',
      }).then((res) => res.json());

      console.log('Updated addresses:', refreshedAddresses);
      setAddresses(refreshedAddresses);

      setModalData(null); // Close modal
    } catch (error) {
      console.error('Error saving addresses:', error);
      alert('Wystąpił błąd podczas zapisywania adresu. Spróbuj ponownie.');
    }
  };

  // Open modal for adding a new address
  const handleAddAddress = () => {
    console.log('Opening modal for adding new address');
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
      <div className="mt-4">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : addresses.length === 0 ? (
          <button
            onClick={handleAddAddress} // Use the add address handler
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
                  className="mt-2 text-[#661F30] flex items-center"
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
            {addresses.length < 3 && (
              <button
                onClick={handleAddAddress} // Use the add address handler
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
