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

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Trigger */}
      <button
        className="border rounded-[24px] w-full text-[16px] p-[7px_16px] font-bold flex justify-between items-center hover:bg-gray-100"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedValue || placeholder}</span>
        <img
          src={isOpen ? '/icons/arrow-up.svg' : '/icons/arrow-down.svg'}
          alt="Toggle"
          className="w-[16px] h-[16px]"
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-[16px]  z-20">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`cursor-pointer p-4 hover:bg-gray-100 ${
                selectedValue === option ? 'bg-gray-100' : ''
              } ${index === 0 ? 'rounded-t-[16px]' : ''} ${
                index === options.length - 1 ? 'rounded-b-[16px]' : ''
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
