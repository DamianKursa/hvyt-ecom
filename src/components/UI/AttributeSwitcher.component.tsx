import React from 'react';
import CustomDropdown from '@/components/UI/CustomDropdown.component';

interface AttributeSwitcherProps {
  attributeName: string; // Attribute name, e.g., "Rozstaw"
  options: string[]; // Available options
  selectedValue: string | null; // Currently selected value
  onAttributeChange: (attributeName: string, value: string) => void; // Callback for attribute changes
  pricesMap?: { [key: string]: string }; // Optional map of prices
  isCartPage?: boolean; // ✅ NEW PROP to detect cart page
}

const AttributeSwitcher: React.FC<AttributeSwitcherProps> = ({
  attributeName,
  options,
  selectedValue,
  onAttributeChange,
  pricesMap = {},
  isCartPage = false, // ✅ Default to false
}) => {
  const cleanedAttributeName = attributeName.replace(/^Atrybut produktu: /, '');

  // Map options to display with prices if available
  const displayOptions = options.map((option) => {
    const price = pricesMap[option];
    return price ? `${option} | ${price} zł` : option;
  });

  return (
    <div>
      <CustomDropdown
        options={displayOptions}
        selectedValue={selectedValue}
        isProductPage={!isCartPage} // ✅ Prevents conflict with `isCartPage`
        isCartPage={isCartPage} // ✅ Pass isCartPage
        placeholder={selectedValue || cleanedAttributeName}
        onChange={(value) =>
          onAttributeChange(
            attributeName,
            value.split(' | ')[0], // Extract the selected option only
          )
        }
      />
    </div>
  );
};

export default AttributeSwitcher;
