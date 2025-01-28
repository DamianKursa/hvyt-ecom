import React, { useState, useEffect } from 'react';

interface ProductVariationEditProps {
  variationName: string; // The name of the variation (e.g., "Rozstaw")
  currentValue: string; // The current value of the variation
  variationOptions: string[]; // List of available variation options
  onSave: (newValue: string) => void; // Callback to save the updated value
}

const ProductVariationEdit: React.FC<ProductVariationEditProps> = ({
  variationName,
  currentValue,
  variationOptions,
  onSave,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newValue, setNewValue] = useState(currentValue);
  const [options, setOptions] = useState<string[]>([]);

  // Update options when modal opens and variationOptions changes
  useEffect(() => {
    if (isModalOpen) {
      console.log('variationOptions:', variationOptions); // Debugging log
      setOptions(variationOptions || []);
    }
  }, [isModalOpen, variationOptions]);

  const handleSave = () => {
    onSave(newValue);
    setModalOpen(false);
  };

  return (
    <div className="mt-3 flex flex-wrap items-center">
      {/* Attribute name and value */}
      <p className="text-neutral-dark mr-4">
        {variationName}: <span className="font-medium">{currentValue}</span>
      </p>

      {/* "edytuj" button */}
      <button
        className=" font-light text-black underline flex items-center hover:text-gray-800 transition"
        onClick={() => setModalOpen(true)}
        style={{ fontSize: '16px' }}
      >
        edytuj
        <img src="/icons/edit.svg" alt="Edit Icon" className="w-4 h-4 ml-1" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-md rounded-lg relative">
            <button
              className="absolute top-2 right-2 text-black text-xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Edytuj {variationName}</h3>
            {options.length > 0 ? (
              <select
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-500">Brak dostępnych opcji</p>
            )}
            <div className="flex justify-between mt-4">
              <button
                className="py-2 px-4 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => setModalOpen(false)}
              >
                Anuluj
              </button>
              <button
                className="py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-900"
                onClick={handleSave}
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariationEdit;
