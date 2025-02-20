import React, { useState } from 'react';

interface BillingData {
  type: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  nip?: string;
  street: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
}

interface BillingModalProps {
  billingData?: BillingData;
  onSave: (data: BillingData) => void;
  onClose: () => void;
}

const BillingModal: React.FC<BillingModalProps> = ({
  billingData,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<BillingData>({
    type: billingData?.type || 'individual',
    firstName: billingData?.firstName || '',
    lastName: billingData?.lastName || '',
    companyName: billingData?.companyName || '',
    nip: billingData?.nip || '',
    street: billingData?.street || '',
    buildingNumber: billingData?.buildingNumber || '',
    apartmentNumber: billingData?.apartmentNumber || '',
    city: billingData?.city || '',
    postalCode: billingData?.postalCode || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      (formData.type === 'individual' &&
        (!formData.firstName || !formData.lastName)) ||
      (formData.type === 'company' && (!formData.companyName || !formData.nip))
    ) {
      alert('Proszę wypełnić wszystkie wymagane pola.');
      return;
    }

    onSave({
      ...formData,
      buildingNumber: formData.buildingNumber || '',
      apartmentNumber: formData.apartmentNumber || '',
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(54, 49, 50, 0.4)' }}
    >
      <div
        className="bg-beige-light mx-4 md:mx-0 rounded-[25px] w-full max-w-[800px] relative"
        style={{ padding: '40px 32px', maxWidth: '650px' }}
      >
        {/* Title and Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {billingData ? 'Edytuj dane do faktury' : 'Dodaj dane do faktury'}
          </h2>
          <button onClick={onClose}>
            <img
              src="/icons/close-button.svg"
              alt="Close"
              className="w-3 h-3"
              style={{ filter: 'invert(0)' }}
            />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {/* Radio Buttons */}
          <div className="flex space-x-4">
            <div className="w-full flex items-center">
              <input
                type="radio"
                id="individual"
                name="type"
                value="individual"
                checked={formData.type === 'individual'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as 'individual' | 'company',
                    firstName: '',
                    lastName: '',
                    companyName: '',
                    nip: '',
                  }))
                }
                className="hidden"
              />
              <label
                htmlFor="individual"
                className={`flex items-center cursor-pointer`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 ${
                    formData.type === 'individual'
                      ? 'border-black border-[5px]'
                      : 'border-gray-400'
                  }`}
                ></span>
                <span className="ml-2">Klient indywidualny</span>
              </label>
            </div>
            <div className="w-full flex items-center">
              <input
                type="radio"
                id="company"
                name="type"
                value="company"
                checked={formData.type === 'company'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as 'individual' | 'company',
                    firstName: '',
                    lastName: '',
                    companyName: '',
                    nip: '',
                  }))
                }
                className="hidden"
              />
              <label
                htmlFor="company"
                className={`flex items-center cursor-pointer`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 ${
                    formData.type === 'company'
                      ? 'border-black border-[5px]'
                      : 'border-gray-400'
                  }`}
                ></span>
                <span className="ml-2">Firma</span>
              </label>
            </div>
          </div>

          {formData.type === 'individual' ? (
            <>
              <input
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                placeholder="Imię"
                className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
              />
              <input
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                placeholder="Nazwisko"
                className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
              />
            </>
          ) : (
            <>
              <input
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                placeholder="Nazwa firmy"
                className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
              />
              <input
                name="nip"
                value={formData.nip || ''}
                onChange={handleChange}
                placeholder="NIP"
                className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
              />
            </>
          )}

          {/* Address Fields */}
          <input
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Nazwa ulicy"
            className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
          />
          <div className="flex space-x-4">
            <input
              name="buildingNumber"
              value={formData.buildingNumber || ''}
              onChange={handleChange}
              placeholder="Nr budynku"
              className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              name="apartmentNumber"
              value={formData.apartmentNumber || ''}
              onChange={handleChange}
              placeholder="Nr lokalu"
              className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
            />
          </div>
          <div className="flex space-x-4">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Miasto"
              className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Kod pocztowy"
              className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="w-[100%] md:w-[35%] py-3 font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-all"
          >
            Zapisz dane do faktury
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingModal;
