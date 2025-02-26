import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  options: string[]; // Array of dropdown options
  selectedValue: string | null; // Currently selected value
  placeholder?: string; // Placeholder text when no value is selected
  onChange: (value: string) => void; // Callback when an option is selected
  isProductPage?: boolean; // Indicates if the dropdown is on a product page
  isCartPage?: boolean; // ✅ NEW: Indicates if it's on the cart page
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedValue,
  placeholder = 'Wybierz',
  onChange,
  isProductPage = false,
  isCartPage = false, // ✅ NEW PROP
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Attach event listener for outside clicks
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div
      className={`w-full ${isCartPage ? 'relative block' : 'relative'}`}
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        className={`w-full ${
          isProductPage ? 'px-[20px] py-3' : 'p-[7px_16px]'
        } text-[16px] font-bold flex justify-between items-center border  ${
          isOpen
            ? 'border-dark-pastel-red border-b-0 rounded-t-[24px]'
            : 'border-beige-dark rounded-[24px]'
        } bg-beige-light`}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
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
        <div
          className={`${
            isCartPage
              ? 'relative block w-full'
              : 'absolute top-full left-0 w-full'
          } bg-beige-light border border-dark-pastel-red border-t-0 rounded-b-[24px] z-50`}
          role="listbox"
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`cursor-pointer px-[20px] py-3 text-[16px] flex justify-between items-center ${
                selectedValue === option ? 'font-bold text-dark-pastel-red' : ''
              }`}
              role="option"
              aria-selected={selectedValue === option}
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
