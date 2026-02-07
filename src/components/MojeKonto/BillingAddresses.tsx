import React, { useState, useEffect } from 'react';
import BillingModal from './BillingModal';
import LoadingModal from '@/components/UI/LoadingModal';
import { useI18n } from '@/utils/hooks/useI18n';

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

  const {t} = useI18n()

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
        billing_address_2: `${newBillingData.buildingNumber || ''}${newBillingData.apartmentNumber
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
        title={t.modal.loading}
        description={t.modal.messageWaitLoading}
      />
    );
  }

  return (
    <div className="rounded-[25px] bg-white px-4 md:p-8 shadow-sm">
      <h2 className="text-2xl font-semibold p-4 md:p-0 md:mb-8 text-[#661F30]">
        {t.checkout.billingData}
      </h2>

      <div className="md:border rounded-[25px]">
        {error ? (
          <p className="text-red-500 p-4">{error}</p>
        ) : (
          <>
            {/* Individual Address Section */}
            <div className="py-4 border-b border-t md:border-t-0 border-[#E9E5DF] flex items-center justify-between px-4">
              {individualAddress ? (
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-[18px] font-semibold mb-[32px]">
                      {t.checkout.billingData} - {t.checkout.personalData.customerTypeIndividual}
                    </p>
                    <p className="text-[18px]">
                      {individualAddress.firstName} {individualAddress.lastName}
                    </p>
                    <p className="text-[18px]">
                      {individualAddress.street},{' '}
                      {individualAddress.billing_address_2}
                    </p>
                    <p className="text-[18px]">
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
                    className="flex-shrink-0 text-black border border-black px-4 py-2 rounded-full flex items-center"
                  >
                    <span className="md:hidden">{t.common.edit}</span>
                    <span className="hidden md:inline">{t.account.editData}</span>
                    <img src="/icons/edit.svg" alt={t.common.edit} className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <p className="text-[18px] font-semibold mb-[32px]">
                    {t.checkout.billingData} - {t.checkout.personalData.customerTypeIndividual}
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
                    className="flex-shrink-0 text-white bg-black border border-black px-4 py-2 rounded-full flex items-center"
                  >
                    <span className="md:hidden">{t.common.add}</span>
                    <span className="hidden md:inline">{t.account.addData}</span>
                    <img src="/icons/edit.svg" alt={t.common.add} className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </div>

            {/* Company Address Section */}
            <div className="py-4 flex items-center border-b border-[#E9E5DF] md:border-b-0 justify-between px-4">
              {companyAddress ? (
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-[18px] font-semibold mb-[32px]">
                      {t.checkout.billingData} - {t.checkout.personalData.customerTypeCompany}
                    </p>
                    <p className="text-[18px]">
                      {companyAddress.companyName}, NIP: {companyAddress.nip}
                    </p>
                    <p className="text-[18px]">
                      {companyAddress.street},{' '}
                      {companyAddress.billing_address_2}
                    </p>
                    <p className="text-[18px]">
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
                    className="flex-shrink-0 text-black border border-black px-4 py-2 rounded-full flex items-center"
                  >
                    <span className="md:hidden">Edytuj</span>
                    <span className="hidden md:inline">Edytuj dane</span>
                    <img src="/icons/edit.svg" alt="Edytuj" className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <p className="text-[18px] font-semibold mb-[32px]">
                    {t.checkout.billingData} - {t.checkout.personalData.customerTypeCompany}
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
                    className="flex-shrink-0 text-white bg-black border border-black px-4 py-2 rounded-full flex items-center"
                  >
                    <span className="md:hidden">{t.common.add}</span>
                    <span className="hidden md:inline">{t.account.addData}</span>
                    <img src="/icons/edit.svg" alt={t.common.add} className="w-4 h-4 ml-2" />
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
