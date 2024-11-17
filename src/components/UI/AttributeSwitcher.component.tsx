import React from 'react';
import CustomDropdown from '@/components/UI/CustomDropdown.component';

interface AttributeSwitcherProps {
  attributeName: string; // The name of the attribute (e.g., "Atrybut produktu: KULKA")
  options: string[]; // Available options for the attribute
  selectedValue: string | null; // Currently selected value
  onAttributeChange: (attributeName: string, value: string) => void; // Callback for handling changes
}

const AttributeSwitcher: React.FC<AttributeSwitcherProps> = ({
  attributeName,
  options,
  selectedValue,
  onAttributeChange,
}) => {
  // Remove "Atrybut produktu: " prefix dynamically
  const cleanedAttributeName = attributeName.replace(/^Atrybut produktu: /, '');

  return (
    <div className="mt-4">
      {/* Dropdown for Selecting Attribute */}
      <CustomDropdown
        options={options}
        selectedValue={selectedValue}
        placeholder={selectedValue || cleanedAttributeName} // Use the cleaned name as placeholder
        onChange={(value) => onAttributeChange(attributeName, value)}
      />
    </div>
  );
};

export default AttributeSwitcher;
///Price is not always changing.
