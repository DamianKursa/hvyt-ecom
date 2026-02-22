import React, { useState, useEffect } from 'react';
import Checkbox from '@/components/UI/Checkbox';
import { useI18n } from '@/utils/hooks/useI18n';

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
  saveAddress: boolean;
  setSaveAddress: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedZone: React.Dispatch<React.SetStateAction<string>>;
  user: any;
}

const CheckoutAddressForm: React.FC<CheckoutAddressFormProps> = ({
  shippingData,
  setShippingData,
  billingData,
  setBillingData,
  isShippingDifferent,
  setIsShippingDifferent,
  saveAddress,
  setSaveAddress,
  setSelectedZone,
  user,
}) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState<boolean>(true);
  const [needVATInvoice, setNeedVATInvoice] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // user‑saved addresses fetched from API
  const [savedAddresses, setSavedAddresses] = useState<Array<{
    street: string;
    buildingNumber: string;
    apartmentNumber: string;
    city: string;
    postalCode: string;
    country: string;
    additionalInfo?: string;
  }>>([]);

  /**
   * Some addresses coming from the API embed the building and apartment
   * numbers inside the `street` string (e.g. "Jasnaqa, 2223e/4211wsa").
   * This helper splits them out so we always have explicit fields.
   */
  const normaliseAddress = (addr: any) => {
    let street = addr.street || '';
    let buildingNumber = addr.buildingNumber || '';
    let apartmentNumber = addr.apartmentNumber || '';

    // WordPress stores building/apartment in address_line_2
    if (!buildingNumber && addr.address_line_2) {
      const [bn, apt] = addr.address_line_2.split('/');
      buildingNumber = (bn || '').trim();
      apartmentNumber = (apt || '').trim();
    }

    // If the API didn't give us building / apartment separately, try to parse
    // them from the street string. Common patterns observed:
    //  1. "StreetName, 123/45"
    //  2. "StreetName 123/45"
    //  3. "StreetName 123"
    if (!buildingNumber && street) {
      // Split at comma first
      const commaParts = street.split(',');
      if (commaParts.length > 1) {
        street = commaParts[0].trim();
        const rest = commaParts.slice(1).join(',').trim();
        const slashParts = rest.split('/');
        buildingNumber = slashParts[0].trim();
        if (slashParts.length > 1) {
          apartmentNumber = slashParts[1].trim();
        }
      } else {
        // No comma, try last token as building number
        const words = street.trim().split(' ');
        if (words.length > 1) {
          const last = words.pop() as string;
          buildingNumber = last.trim();
          street = words.join(' ');
        }
      }
    }

    // If buildingNumber still contains a '/', split out apartment part
    if (buildingNumber.includes('/') && !apartmentNumber) {
      const [bn, apt] = buildingNumber.split('/');
      buildingNumber = bn.trim();
      apartmentNumber = apt.trim();
    }

    return {
      street,
      buildingNumber,
      apartmentNumber,
      city: addr.city || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'Polska',
      additionalInfo: addr.additionalInfo || '',
    };
  };

  // controls visibility of the suggestion dropdown
  const [showAddressSuggestions, setShowAddressSuggestions] = useState<boolean>(false);

  const handlePickSavedAddress = (addr: typeof savedAddresses[number]) => {
    setBillingData(prev => ({
      ...prev,
      street: addr.street,
      buildingNumber: addr.buildingNumber,
      apartmentNumber: addr.apartmentNumber,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
    }));
    setShowAddressSuggestions(false);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/moje-konto/adresy', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch addresses: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched User Addresses:', data);

        setSavedAddresses(
          data.slice(0, 3).map(normaliseAddress)
        );

        if (data.length > 0) {
          const billingAddress = normaliseAddress(data[0]);
          setBillingData((prev) => ({
            ...prev,
            street: billingAddress.street,
            buildingNumber: billingAddress.buildingNumber,
            apartmentNumber: billingAddress.apartmentNumber,
            city: billingAddress.city,
            postalCode: billingAddress.postalCode,
            country: billingAddress.country,
          }));
        }
        if (data.length > 1) {
          const shippingAddress = normaliseAddress(data[1]);
          setShippingData({
            street: shippingAddress.street,
            buildingNumber: shippingAddress.buildingNumber,
            apartmentNumber: shippingAddress.apartmentNumber,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            additionalInfo: shippingAddress.additionalInfo,
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

  // Hide/disable the checkbox when the user already has 3 saved addresses
  useEffect(() => {
    if (savedAddresses.length >= 3 && saveAddress) {
      // uncheck if it was previously selected
      setSaveAddress(false);
    }
  }, [savedAddresses.length, saveAddress, setSaveAddress]);


  if (loading) {
    return <p>{t.checkout.shippingAddress.loadingAddresses}</p>;
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
            onFocus={() => {
              setFocusedField('street');
              setShowAddressSuggestions(true);
            }}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => {
              setBillingData(prev => ({ ...prev, street: e.target.value }));
              setShowAddressSuggestions(true);
            }}
            className="w-full text-[#363132] border-b border-[#969394] p-2 bg-white focus:outline-none placeholder:text-[#363132]"
          />
          <span
            className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${billingData.street || focusedField === 'street' ? 'opacity-0' : 'opacity-100'
              }`}
          >
            {t.checkout.shippingAddress.streetName}<span className="text-red-500">*</span>
          </span>
          {showAddressSuggestions && savedAddresses.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-dark-pastel-red rounded-[24px] mt-2 z-50 max-h-60 overflow-y-auto shadow">
              {savedAddresses.map((a) => (
                <div
                  key={`${a.street}-${a.buildingNumber}`}
                  className="px-4 py-2 cursor-pointer hover:bg-beige-light"
                  onMouseDown={() => handlePickSavedAddress(a)}
                >
                  {`${a.street} ${a.buildingNumber}`}
                </div>
              ))}
            </div>
          )}
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
            {t.checkout.shippingAddress.buildingNumber}<span className="text-red-500">*</span>
          </span>
        </div>
        <input
          type="text"
          placeholder={t.checkout.shippingAddress.apartmentNumber}
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
            {t.checkout.shippingAddress.city}<span className="text-red-500">*</span>
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
            {t.checkout.shippingAddress.postalCode}<span className="text-red-500">*</span>
          </span>
        </div>
        <div className="relative w-full">
          <select
            required
            value={billingData.country}
            onFocus={() => setFocusedField('country')}
            onBlur={() => setFocusedField(null)}
            onChange={
              (e) => {
                setBillingData((prev) => ({ ...prev, country: e.target.value })); 
                setSelectedZone(e.target.value); console.log('shipping: ' , e.target.value); 
              }
            }
            className="w-full text-[#363132] font-light border-b border-[#969394] p-2 pr-8 bg-white focus:outline-none appearance-none"
          >
            <option value="poland">{t.checkout.shippingLocationPoland}</option>
            <option value="other">{t.checkout.shippingLocationOther}</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#969394] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span
            className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${billingData.country ? 'opacity-0' : 'opacity-100'}`}
          >
            {t.checkout.shippingAddress.country}<span className="text-red-500">*</span>
          </span>
        </div>
      </div>

      {/* "Ship to a Different Address" */}
      <div className="mt-8">
        <Checkbox
          checked={isShippingDifferent}
          onChange={() => setIsShippingDifferent(!isShippingDifferent)}
          label={t.checkout.shippingAddress.differentAddress}
        />
      </div>

      {isShippingDifferent && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-4">{t.checkout.shippingAddress.enterDifferentAddress}</h3>
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
                {t.checkout.shippingAddress.streetName}<span className="text-red-500">*</span>
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
                {t.checkout.shippingAddress.buildingNumber}<span className="text-red-500">*</span>
              </span>
            </div>
            <input
              type="text"
              placeholder={t.checkout.shippingAddress.apartmentNumber}
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
                {t.checkout.shippingAddress.city}<span className="text-red-500">*</span>
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
                {t.checkout.shippingAddress.postalCode}<span className="text-red-500">*</span>
              </span>
            </div>
            <div className="relative w-full">
              <select
                required
                value={shippingData.country}
                onFocus={() => setFocusedField('country')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => {
                    setShippingData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }));
                  }
                }
                className="w-full font-light text-[#363132] border-b border-[#969394] p-2 pr-8 bg-white focus:outline-none appearance-none"
              >
                <option value="poland">{t.checkout.shippingLocationPoland}</option>
                <option value="other">{t.checkout.shippingLocationOther}</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#969394] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span
                className={`absolute left-2 top-2 text-[#363132] font-light pointer-events-none transition-all duration-200 ${shippingData.country ? 'opacity-0' : 'opacity-100'
                  }`}
              >
                {t.checkout.shippingAddress.country}<span className="text-red-500">*</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Save address checkbox (visible for logged‑in users only and if user has fewer than 3 addresses) */}
      {user && savedAddresses.length < 3 && (
        <div className="mt-8">
          <Checkbox
            checked={saveAddress}
            onChange={() => setSaveAddress(prev => !prev)}
            label={t.checkout.shippingAddress.saveAddress}
          />
        </div>
      )}
      {/* Additional order notes */}
      <h3 className="text-[14px] font-bold mt-8 mb-2">
        {t.checkout.shippingAddress.additionalInfo}
      </h3>
      <textarea
        placeholder={t.checkout.shippingAddress.additionalInfoPlaceholder}
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
