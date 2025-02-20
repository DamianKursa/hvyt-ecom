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
  addressNumber?: number;
  onSave: (address: any) => void;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  address,
  addressNumber = 1,
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
            Dodaj adres dostawy #{addressNumber}
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
              value={formData.buildingNumber}
              onChange={handleChange}
              placeholder="Nr budynku"
              className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              name="apartmentNumber"
              value={formData.apartmentNumber}
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
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Kraj / Region"
            className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="w-[100%] md:w-[25%] py-3 font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-all"
          >
            Zapisz adres
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
