import React from 'react';
import CustomDropdown from '@/components/UI/CustomDropdown.component';

interface AttributeSwitcherProps {
  attributeName: string;
  options: string[];
  selectedValue: string | null;
  onAttributeChange: (attributeName: string, value: string) => void;
  pricesMap?: { [key: string]: string };
  isCartPage?: boolean;
}

const AttributeSwitcher: React.FC<AttributeSwitcherProps> = ({
  attributeName,
  options,
  selectedValue,
  onAttributeChange,
  pricesMap = {},
  isCartPage = false,
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
        isProductPage={!isCartPage}
        isCartPage={isCartPage}
        placeholder={selectedValue || cleanedAttributeName}
        onChange={(value) =>
          onAttributeChange(attributeName, value.split(' | ')[0])
        }
      />
    </div>
  );
};

export default AttributeSwitcher;
