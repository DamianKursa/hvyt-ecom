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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
        <div className="relative w-full">
          <input
            type="text"
            required
            value={billingData.street}
            onFocus={() => setFocusedField('street')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) =>
              setBillingData((prev) => ({ ...prev, street: e.target.value }))
            }
            className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132]"
          />
          <span
            className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${billingData.street || focusedField === 'street' ? 'opacity-0' : 'opacity-100'
              }`}
          >
            Nazwa ulicy<span className="text-red-500">*</span>
          </span>
        </div>
        <div className="relative w-full">
          <input
            type="text"
            required
            value={billingData.buildingNumber}
            onFocus={() => setFocusedField('buildingNumber')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) =>
              setBillingData((prev) => ({
                ...prev,
                buildingNumber: e.target.value,
              }))
            }
            className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132]"
          />
          <span
            className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${billingData.buildingNumber || focusedField === 'buildingNumber'
              ? 'opacity-0'
              : 'opacity-100'
              }`}
          >
            Nr budynku<span className="text-red-500">*</span>
          </span>
        </div>
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
          className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132] placeholder:font-light placeholder-opacity-100"
        />
        <div className="relative w-full">
          <input
            type="text"
            required
            value={billingData.city}
            onFocus={() => setFocusedField('city')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) =>
              setBillingData((prev) => ({ ...prev, city: e.target.value }))
            }
            className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132]"
          />
          <span
            className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${billingData.city || focusedField === 'city' ? 'opacity-0' : 'opacity-100'
              }`}
          >
            Miasto<span className="text-red-500">*</span>
          </span>
        </div>
        <div className="relative w-full">
          <input
            type="text"
            required
            value={billingData.postalCode}
            onFocus={() => setFocusedField('postalCode')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) =>
              setBillingData((prev) => ({ ...prev, postalCode: e.target.value }))
            }
            className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132]"
          />
          <span
            className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${billingData.postalCode || focusedField === 'postalCode' ? 'opacity-0' : 'opacity-100'
              }`}
          >
            Kod pocztowy<span className="text-red-500">*</span>
          </span>
        </div>
        <div className="relative w-full">
          <select
            required
            value={billingData.country}
            onFocus={() => setFocusedField('country')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) =>
              setBillingData((prev) => ({ ...prev, country: e.target.value }))
            }
            className="w-full text-[#363132] font-light border-b border-[#969394] p-2 pr-8 bg-white focus:outline-none appearance-none"
          >
            <option value="Polska">Polska</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#969394] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span
            className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${billingData.country ? 'opacity-0' : 'opacity-100'}`}
          >
            Kraj / Region<span className="text-red-500">*</span>
          </span>
        </div>
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
            <div className="relative w-full">
              <input
                type="text"
                required
                value={shippingData.street}
                onFocus={() => setFocusedField('street')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) =>
                  setShippingData((prev) => ({ ...prev, street: e.target.value }))
                }
                className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132]"
              />
              <span
                className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${shippingData.street || focusedField === 'street' ? 'opacity-0' : 'opacity-100'
                  }`}
              >
                Nazwa ulicy<span className="text-red-500">*</span>
              </span>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                required
                value={shippingData.buildingNumber}
                onFocus={() => setFocusedField('buildingNumber')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) =>
                  setShippingData((prev) => ({
                    ...prev,
                    buildingNumber: e.target.value,
                  }))
                }
                className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132]"
              />
              <span
                className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${shippingData.buildingNumber || focusedField === 'buildingNumber'
                  ? 'opacity-0'
                  : 'opacity-100'
                  }`}
              >
                Nr budynku<span className="text-red-500">*</span>
              </span>
            </div>
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
              className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132] placeholder:font-light placeholder-opacity-100"
            />
            <div className="relative w-full">
              <input
                type="text"
                required
                value={shippingData.city}
                onFocus={() => setFocusedField('city')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) =>
                  setShippingData((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132]"
              />
              <span
                className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${shippingData.city || focusedField === 'city' ? 'opacity-0' : 'opacity-100'
                  }`}
              >
                Miasto<span className="text-red-500">*</span>
              </span>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                required
                value={shippingData.postalCode}
                onFocus={() => setFocusedField('postalCode')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) =>
                  setShippingData((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }))
                }
                className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132]"
              />
              <span
                className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${shippingData.postalCode || focusedField === 'postalCode' ? 'opacity-0' : 'opacity-100'
                  }`}
              >
                Kod pocztowy<span className="text-red-500">*</span>
              </span>
            </div>
            <div className="relative w-full">
              <select
                required
                value={shippingData.country}
                onFocus={() => setFocusedField('country')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) =>
                  setShippingData((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                className="w-full font-light text-[#363132] border-b border-[#969394] p-2 pr-8 bg-white focus:outline-none appearance-none"
              >
                <option value="Polska">Polska</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#969394] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span
                className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${shippingData.country ? 'opacity-0' : 'opacity-100'
                  }`}
              >
                Kraj / Region<span className="text-red-500">*</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Additional order notes */}
      <h3 className="text-[14px] font-bold mt-8 mb-2">
        Dodatkowe informacje do zamówienia (opcjonalnie)
      </h3>
      <textarea
        placeholder="Opis..."
        value={shippingData.additionalInfo}
        onChange={(e) =>
          setShippingData((prev) => ({
            ...prev,
            additionalInfo: e.target.value,
          }))
        }
        className="w-full text-[#363132] border border-[#969394] rounded-[8px] p-4 bg-white focus:outline-none placeholder:text-[#363132] mb-4 mt-4"
      />

    </div>
  );
};

export default CheckoutAddressForm;
