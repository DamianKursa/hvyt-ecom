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

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
          <div className="relative">
            <input
              type="text"
              name="street"
              value={formData.street}
              onFocus={() => setFocusedField('street')}
              onBlur={() => setFocusedField(null)}
              onChange={handleChange}
              required
              className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
            />
            <span
              className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.street || focusedField === 'street' ? 'opacity-0' : 'opacity-100'
                }`}
            >
              Nazwa ulicy <span className="text-red-500">*</span>
            </span>
          </div>
          <div className="flex space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                name="buildingNumber"
                value={formData.buildingNumber}
                onFocus={() => setFocusedField('buildingNumber')}
                onBlur={() => setFocusedField(null)}
                onChange={handleChange}
                required
                className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
              />
              <span
                className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.buildingNumber || focusedField === 'buildingNumber'
                  ? 'opacity-0'
                  : 'opacity-100'
                  }`}
              >
                Nr budynku <span className="text-red-500">*</span>
              </span>
            </div>
            <input
              name="apartmentNumber"
              value={formData.apartmentNumber}
              onChange={handleChange}
              placeholder="Nr lokalu"
              className="w-full border-b border-black py-2 px-6 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
            />
          </div>
          <div className="flex space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                name="city"
                value={formData.city}
                onFocus={() => setFocusedField('city')}
                onBlur={() => setFocusedField(null)}
                onChange={handleChange}
                required
                className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
              />
              <span
                className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.city || focusedField === 'city' ? 'opacity-0' : 'opacity-100'
                  }`}
              >
                Miasto <span className="text-red-500">*</span>
              </span>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onFocus={() => setFocusedField('postalCode')}
                onBlur={() => setFocusedField(null)}
                onChange={handleChange}
                required
                className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
              />
              <span
                className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.postalCode || focusedField === 'postalCode'
                  ? 'opacity-0'
                  : 'opacity-100'
                  }`}
              >
                Kod pocztowy <span className="text-red-500">*</span>
              </span>
            </div>
          </div>
          <div className="relative">
            <select
              name="country"
              value={formData.country}
              onFocus={() => setFocusedField('country')}
              onBlur={() => setFocusedField(null)}
              onChange={handleChange}
              required
              className="appearance-none w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
            >

              <option value="Polska">Polska</option>
            </select>
            <span className="absolute right-2 top-2 pointer-events-none">
              <img src="/icons/arrow-down.svg" alt="" className="w-4 h-4" />
            </span>
            <span
              className={`absolute whitespace-nowrap left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.country || focusedField === 'country'
                ? 'opacity-0'
                : 'opacity-100'
                }`}
            >
              Kraj / Region <span className="text-red-500">*</span>
            </span>
          </div>
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
