import React, { useState } from 'react';

interface BillingData {
  type: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  nip?: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
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
      alert('Please fill in all required fields.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-[25px] p-8 w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {billingData ? 'Edytuj dane do faktury' : 'Dodaj dane do faktury'}
        </h2>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
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
              />
              Klient indywidualny
            </label>
            <label>
              <input
                type="radio"
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
              />
              Firma
            </label>
          </div>

          {formData.type === 'individual' ? (
            <>
              <input
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                placeholder="Imię"
                className="w-full border rounded-md p-2"
              />
              <input
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                placeholder="Nazwisko"
                className="w-full border rounded-md p-2"
              />
            </>
          ) : (
            <>
              <input
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                placeholder="Nazwa firmy"
                className="w-full border rounded-md p-2"
              />
              <input
                name="nip"
                value={formData.nip || ''}
                onChange={handleChange}
                placeholder="NIP"
                className="w-full border rounded-md p-2"
              />
            </>
          )}

          {/* Address Fields */}
          <input
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Nazwa ulicy"
            className="w-full border rounded-md p-2"
          />
          <div className="flex space-x-4">
            <input
              name="buildingNumber"
              value={formData.buildingNumber}
              onChange={handleChange}
              placeholder="Nr budynku"
              className="w-full border rounded-md p-2"
            />
            <input
              name="apartmentNumber"
              value={formData.apartmentNumber}
              onChange={handleChange}
              placeholder="Nr lokalu"
              className="w-full border rounded-md p-2"
            />
          </div>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Miasto"
            className="w-full border rounded-md p-2"
          />
          <input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Kod pocztowy"
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:underline focus:outline-none"
          >
            Anuluj
          </button>
          <button
            onClick={handleSave}
            className="bg-[#661F30] text-white px-4 py-2 rounded-md"
          >
            Zapisz dane do faktury
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingModal;
