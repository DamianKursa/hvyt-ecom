import React from 'react';

export interface CheckoutAddressFormProps {
  shippingData: {
    street: string;
    buildingNumber: string;
    city: string;
    postalCode: string;
    country: string;
    additionalInfo: string;
  };
  setShippingData: React.Dispatch<
    React.SetStateAction<{
      street: string;
      buildingNumber: string;
      city: string;
      postalCode: string;
      country: string;
      additionalInfo: string;
    }>
  >;
}

const CheckoutAddressForm: React.FC<CheckoutAddressFormProps> = ({
  shippingData,
  setShippingData,
}) => {
  return (
    <div className="p-[24px_16px] border border-beige-dark rounded-[24px] bg-white mt-8">
      <div className="grid grid-cols-2 gap-4">
        {/* Separate Street and Building Number */}
        <input
          type="text"
          placeholder="Nazwa ulicy*"
          value={shippingData.street}
          onChange={(e) =>
            setShippingData((prev) => ({ ...prev, street: e.target.value }))
          }
          className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="text"
          placeholder="Nr budynku*"
          value={shippingData.buildingNumber}
          onChange={(e) =>
            setShippingData((prev) => ({
              ...prev,
              buildingNumber: e.target.value,
            }))
          }
          className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="text"
          placeholder="Miasto*"
          value={shippingData.city}
          onChange={(e) =>
            setShippingData((prev) => ({ ...prev, city: e.target.value }))
          }
          className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="text"
          placeholder="Kod pocztowy*"
          value={shippingData.postalCode}
          onChange={(e) =>
            setShippingData((prev) => ({
              ...prev,
              postalCode: e.target.value,
            }))
          }
          className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <select
          value={shippingData.country}
          onChange={(e) =>
            setShippingData((prev) => ({ ...prev, country: e.target.value }))
          }
          className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        >
          <option value="Polska">Polska</option>
        </select>
      </div>

      {/* Additional Notes Section */}
      <textarea
        placeholder="Dodatkowe informacje do zamówienia (opcjonalnie)"
        value={shippingData.additionalInfo}
        onChange={(e) =>
          setShippingData((prev) => ({
            ...prev,
            additionalInfo: e.target.value,
          }))
        }
        className="w-full border border-black rounded-[8px] p-4 bg-white focus:outline-none placeholder:font-light placeholder:text-black mt-4"
      />
    </div>
  );
};

export default CheckoutAddressForm;
