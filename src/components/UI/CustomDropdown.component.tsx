import React, { useState } from 'react';

interface CustomDropdownProps {
  options: string[]; // Array of dropdown options
  selectedValue: string | null; // Currently selected value
  placeholder?: string; // Placeholder text when no value is selected
  onChange: (value: string) => void; // Callback when an option is selected
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedValue,
  placeholder = 'Wybierz',
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (value: string) => {
    onChange(value); // Trigger callback with selected value
    setIsOpen(false); // Close dropdown
  };

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        className={`w-full px-[20px] py-3 text-[16px] font-bold flex justify-between items-center border ${
          isOpen
            ? 'border-dark-pastel-red border-b-0 rounded-t-[24px]'
            : 'border-gray-300 rounded-[24px]'
        } bg-beige-light`}
        onClick={toggleDropdown}
      >
        <span>{selectedValue || placeholder}</span>
        <img
          src={isOpen ? '/icons/arrow-up.svg' : '/icons/arrow-down.svg'}
          alt="Toggle"
          className="w-4 h-4"
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-beige-light border border-dark-pastel-red border-t-0 rounded-b-[24px] z-10">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`cursor-pointer px-[20px] py-3 text-[16px] flex justify-between items-center ${
                selectedValue === option ? 'font-bold' : ''
              }`}
            >
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
