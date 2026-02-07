import React, { useState, useEffect } from 'react';
import AddressModal from './AddressModal';
import LoadingModal from '@/components/UI/LoadingModal';
import { useI18n } from '@/utils/hooks/useI18n';

const MyAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {t} = useI18n();

  // Parse address_line_2 into buildingNumber and apartmentNumber
  const parseAddressLine2 = (addressLine2: string) => {
    if (!addressLine2) return { buildingNumber: '', apartmentNumber: '' };
    const [buildingNumber, apartmentNumber] = addressLine2.split('/');
    return { buildingNumber, apartmentNumber: apartmentNumber || '' };
  };

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

        // Transform the addresses to include buildingNumber and apartmentNumber
        const transformedAddresses = data.map((address: any) => ({
          ...address,
          ...parseAddressLine2(address.address_line_2 || ''),
        }));

        setAddresses(transformedAddresses);
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
      const isEdit = modalType === 'edit';
      const payload = isEdit
        ? {
            action: 'update',
            addresses: addresses.map((addr) =>
              addr === modalData ? newAddress : addr,
            ),
          }
        : { action: 'add', address: newAddress };

      const response = await fetch('/api/moje-konto/adresy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || t.modal.messagePasswordUpdateError);
        return;
      }

      // Refresh the address list by re-fetching all addresses
      const refreshedAddresses = await fetch('/api/moje-konto/adresy', {
        method: 'GET',
        credentials: 'include',
      }).then((res) => res.json());

      const transformedAddresses = refreshedAddresses.map((address: any) => ({
        ...address,
        ...parseAddressLine2(address.address_line_2 || ''),
      }));

      setAddresses(transformedAddresses);
      setModalData(null); // Close modal
      setSuccessMessage(
        isEdit
          ? t.modal.messageShippingAddressUpdated
          : t.modal.messageShippingAddressAdded,
      );

      // Clear the success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch {
      alert(t.modal.messageShippingAddressUpdateError);
    }
  };

  // Open modal for adding a new address
  const handleAddAddress = () => {
    setModalData({});
    setModalType('add');
  };

  // Open modal for editing an existing address
  const handleEditAddress = (address: any) => {
    setModalData(address);
    setModalType('edit');
  };

  // Show LoadingModal while loading data
  if (loading) {
    return (
      <LoadingModal
        title={t.modal.loading}
        description={t.modal.messageLoadingAddresses}
      />
    );
  }

  return (
    <div className="rounded-[25px] bg-white p-8 shadow-sm relative">
      <h2 className="text-2xl font-semibold mb-4 text-[#661F30]">
        {t.account.myAddresses}
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
                    {t.account.shippingAddress} #{index + 1}
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
                  onClick={() => handleEditAddress(address)}
                  className="text-black border border-black px-4 py-2 rounded-full flex items-center"
                >
                  {/* Mobile: show "Edytuj", Desktop: show full text */}
                  <span className="md:hidden">{t.common.edit}</span>
                  <span className="hidden md:inline">{t.account.editShippingAddress}</span>
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
                  {t.account.shippingAddress} #{addresses.length + 1}
                </p>
                <button
                  onClick={handleAddAddress}
                  className="text-white bg-[#000] border border-black px-4 py-2 rounded-full flex items-center"
                >
                  <span className="md:hidden">{t.common.add}</span>
                  <span className="hidden md:inline">{t.account.addShippingAddress}</span>
                  <span className="ml-2">+</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Success Message Below the Section */}
      {successMessage && (
        <div className="bg-[#2A5E45] text-white px-4 py-2 rounded-lg mt-4 flex items-center">
          <img
            src="/icons/circle-check.svg"
            alt="Success"
            className="w-5 h-5 mr-2"
          />
          <span>{successMessage}</span>
        </div>
      )}

      {modalData !== null && (
        <AddressModal
          address={modalData}
          addressNumber={
            modalType === 'edit'
              ? addresses.findIndex((addr) => addr === modalData) + 1
              : addresses.length + 1
          }
          onSave={(address) => handleSave(address)}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
};

export default MyAddresses;
