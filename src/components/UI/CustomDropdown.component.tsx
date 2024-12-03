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
        className={`w-full min-h-[50px] text-[16px] p-[8px] font-bold flex justify-between items-center border border-neutral-light rounded-[24px] ${
          isOpen ? 'rounded-b-none' : ''
        }`}
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
        <div
          className={`absolute top-full w-full border border-dark-pastel-red rounded-b-[24px] bg-beige-light`}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`cursor-pointer px-4 py-2 text-neutral-darkest ${
                selectedValue === option ? 'bg-gray-100 font-medium' : ''
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
