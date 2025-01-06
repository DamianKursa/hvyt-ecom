import React, { useState } from 'react';

interface AddressModalProps {
  address?: {
    street: string;
    buildingNumber: string;
    apartmentNumber: string;
    city: string;
    postalCode: string;
    country: string;
  };
  onSave: (address: any) => void;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  address,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState(
    address || {
      street: '',
      buildingNumber: '',
      apartmentNumber: '',
      city: '',
      postalCode: '',
      country: '',
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.street || !formData.city || !formData.country) {
      alert('Please fill in all required fields.');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-[25px] p-8 w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {address ? 'Edytuj adres' : 'Dodaj adres'}
        </h2>
        <div className="space-y-4">
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
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Kraj / Region"
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
            Zapisz adres
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
