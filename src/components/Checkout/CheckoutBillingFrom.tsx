import React, { useState, useEffect } from 'react';
import CreateAccount from '@/components/UI/CreateAccount';

export interface CheckoutBillingFormProps {
  customerType: 'individual' | 'company';
  setCustomerType: React.Dispatch<
    React.SetStateAction<'individual' | 'company'>
  >;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  subscribeNewsletter: boolean;
  setSubscribeNewsletter: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
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
}

const CheckoutBillingForm: React.FC<CheckoutBillingFormProps> = ({
  customerType,
  setCustomerType,
  email,
  setEmail,
  setPassword,
  subscribeNewsletter,
  setSubscribeNewsletter,
  user,
  setBillingData,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    vatNumber: '',
  });

  // Fetch billing address data
  useEffect(() => {
    const fetchBillingAddress = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/moje-konto/billing-addresses?type=${customerType}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch billing addresses: ${response.status}`,
          );
        }

        const data = await response.json();
        const address = data.find((addr: any) => addr.type === customerType);

        if (address) {
          const updatedFormData = {
            firstName: address.firstName || '',
            lastName: address.lastName || '',
            phone: address.phone || '',
            company: address.companyName || '',
            vatNumber: address.nip || '',
          };

          setFormData(updatedFormData);
          setBillingData({
            firstName: address.firstName || '',
            lastName: address.lastName || '',
            phone: address.phone || '',
            company: address.companyName || '',
            vatNumber: address.nip || '',
            street: address.street || '',
            buildingNumber: address.buildingNumber || '',
            apartmentNumber: address.apartmentNumber || '',
            city: address.city || '',
            postalCode: address.postalCode || '',
            country: address.country || 'Polska',
          });

          if (address.email) {
            setEmail(address.email);
          }
        }
      } catch (err) {
        console.error('Error fetching billing address:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingAddress();
  }, [customerType, setBillingData, setEmail]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    setBillingData((prev) => ({
      ...prev,
      ...updatedFormData,
      email,
    }));
  };

  if (loading) {
    return <p>Ładowanie danych do faktury...</p>;
  }

  return (
    <div className="p-0 md:p-[24px_16px] md:border border-beige-dark rounded-[24px] bg-white">
      {error && <p className="text-red-500">{error}</p>}

      {/* Customer Type Toggle */}
      <div className="flex gap-6 md:gap-4 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="individual"
            checked={customerType === 'individual'}
            onChange={() => setCustomerType('individual')}
            className="hidden"
          />
          <span
            className={`w-5 h-5 rounded-full border-2 ${
              customerType === 'individual'
                ? 'border-black border-[5px]'
                : 'border-gray-400'
            }`}
          ></span>
          <span className="ml-2">Klient indywidualny</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="company"
            checked={customerType === 'company'}
            onChange={() => setCustomerType('company')}
            className="hidden"
          />
          <span
            className={`w-5 h-5 rounded-full border-2 ${
              customerType === 'company'
                ? 'border-black border-[5px]'
                : 'border-gray-400'
            }`}
          ></span>
          <span className="ml-2">Firma</span>
        </label>
      </div>
      {/* Dynamic Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customerType === 'individual' ? (
          <>
            <input
              type="text"
              required
              value={formData.firstName}
              placeholder="Imię*"
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              type="text"
              required
              value={formData.lastName}
              placeholder="Nazwisko*"
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              value={formData.company}
              placeholder="Nazwa firmy*"
              required
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              type="text"
              value={formData.vatNumber}
              placeholder="NIP*"
              required
              onChange={(e) => handleInputChange('vatNumber', e.target.value)}
              className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
          </>
        )}
        <input
          type="text"
          value={formData.phone}
          required
          placeholder="Numer telefonu*"
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="email"
          value={email}
          placeholder="Adres e-mail*"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="newsletter"
          checked={subscribeNewsletter}
          onChange={() => setSubscribeNewsletter((prev) => !prev)}
          className="hidden"
        />
        <label
          htmlFor="newsletter"
          className="flex items-center cursor-pointer w-5 h-5 border border-black rounded"
        >
          {subscribeNewsletter && (
            <img src="/icons/check.svg" alt="check" className="w-4 h-4" />
          )}
        </label>
        <span className="text-sm">Zapisz się do newslettera</span>
      </div>
    </div>
  );
};

export default CheckoutBillingForm;
