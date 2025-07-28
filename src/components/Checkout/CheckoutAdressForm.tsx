import React, { useState, useEffect } from 'react';
import Checkbox from '@/components/UI/Checkbox';

export interface CheckoutAddressFormProps {
  billingData: {
    firstName: string;
    lastName: string;
    phone: string;
    company: string;
    vatNumber: string;
    street: string;
    buildingNumber: string;
    apartmentNumber: string;
    city: string;
    postalCode: string;
    country: string;
  };
  setBillingData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      phone: string;
      company: string;
      vatNumber: string;
      street: string;
      buildingNumber: string;
      apartmentNumber: string;
      city: string;
      postalCode: string;
      country: string;
    }>
  >;
  shippingData: {
    street: string;
    buildingNumber: string;
    apartmentNumber: string;
    city: string;
    postalCode: string;
    country: string;
    additionalInfo: string;
  };
  setShippingData: React.Dispatch<
    React.SetStateAction<{
      street: string;
      buildingNumber: string;
      apartmentNumber: string;
      city: string;
      postalCode: string;
      country: string;
      additionalInfo: string;
    }>
  >;
  isShippingDifferent: boolean;
  setIsShippingDifferent: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckoutAddressForm: React.FC<CheckoutAddressFormProps> = ({
  shippingData,
  setShippingData,
  billingData,
  setBillingData,
  isShippingDifferent,
  setIsShippingDifferent,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [needVATInvoice, setNeedVATInvoice] = useState<boolean>(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/moje-konto/user-addresses', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch addresses: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched User Addresses:', data);

        if (data.length > 0) {
          const billingAddress = data[0];
          setBillingData((prev) => ({
            ...prev,
            street: billingAddress.street || '',
            buildingNumber: billingAddress.buildingNumber || '',
            apartmentNumber: billingAddress.apartmentNumber || '',
            city: billingAddress.city || '',
            postalCode: billingAddress.postalCode || '',
            country: billingAddress.country || 'Polska',
          }));
        }
        if (data.length > 1) {
          const shippingAddress = data[1];
          setShippingData({
            street: shippingAddress.street || '',
            buildingNumber: shippingAddress.buildingNumber || '',
            apartmentNumber: shippingAddress.apartmentNumber || '',
            city: shippingAddress.city || '',
            postalCode: shippingAddress.postalCode || '',
            country: shippingAddress.country || 'Polska',
            additionalInfo: shippingAddress.additionalInfo || '',
          });
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [setBillingData, setShippingData]);

  if (loading) {
    return <p>Ładowanie adresów...</p>;
  }

  return (
    <div className=" p-0 md:p-[24px_16px] md:border md:border-beige-dark rounded-[24px] bg-white mt-8">
      {/* Billing Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
        <input
          type="text"
          required
          placeholder="Nazwa ulicy*"
          value={billingData.street}
          onChange={(e) =>
            setBillingData((prev) => ({ ...prev, street: e.target.value }))
          }
          className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="text"
          required
          placeholder="Nr budynku*"
          value={billingData.buildingNumber}
          onChange={(e) =>
            setBillingData((prev) => ({
              ...prev,
              buildingNumber: e.target.value,
            }))
          }
          className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="text"
          placeholder="Nr lokalu"
          value={billingData.apartmentNumber}
          onChange={(e) =>
            setBillingData((prev) => ({
              ...prev,
              apartmentNumber: e.target.value,
            }))
          }
          className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="text"
          placeholder="Miasto*"
          required
          value={billingData.city}
          onChange={(e) =>
            setBillingData((prev) => ({ ...prev, city: e.target.value }))
          }
          className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="text"
          placeholder="Kod pocztowy*"
          required
          value={billingData.postalCode}
          onChange={(e) =>
            setBillingData((prev) => ({ ...prev, postalCode: e.target.value }))
          }
          className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="text"
          placeholder="Kraj / Region*"
          required
          value={billingData.country}
          onChange={(e) =>
            setBillingData((prev) => ({
              ...prev,
              country: e.target.value,
            }))
          }
          className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
      </div>

      {/* "Ship to a Different Address" */}
      <div className="mt-8">
        <Checkbox
          checked={isShippingDifferent}
          onChange={() => setIsShippingDifferent(!isShippingDifferent)}
          label="Dostawa pod inny adres"
        />
      </div>

      {isShippingDifferent && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-4">Wpisz inny adres</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
            <input
              type="text"
              placeholder="Nazwa ulicy*"
              required
              value={shippingData.street}
              onChange={(e) =>
                setShippingData((prev) => ({ ...prev, street: e.target.value }))
              }
              className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              type="text"
              placeholder="Nr budynku*"
              required
              value={shippingData.buildingNumber}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  buildingNumber: e.target.value,
                }))
              }
              className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              type="text"
              placeholder="Nr lokalu"
              value={shippingData.apartmentNumber}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  apartmentNumber: e.target.value,
                }))
              }
              className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              type="text"
              placeholder="Miasto*"
              required
              value={shippingData.city}
              onChange={(e) =>
                setShippingData((prev) => ({ ...prev, city: e.target.value }))
              }
              className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              type="text"
              placeholder="Kod pocztowy*"
              required
              value={shippingData.postalCode}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  postalCode: e.target.value,
                }))
              }
              className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              type="text"
              placeholder="Kraj / Region*"
              required
              value={shippingData.country}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
              className="w-full border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <textarea
              placeholder="Dodatkowe informacje do zamówienia (opcjonalnie)"
              value={shippingData.additionalInfo}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  additionalInfo: e.target.value,
                }))
              }
              className="col-span-1 md:col-span-2 border border-[#969394] rounded-[8px] p-4 bg-white focus:outline-none placeholder:font-light placeholder:text-black mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutAddressForm;
