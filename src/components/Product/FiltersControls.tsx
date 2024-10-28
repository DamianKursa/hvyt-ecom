import React, { useState } from 'react';

interface FiltersControlsProps {
  filtersVisible: boolean;
  toggleFilters: () => void;
  filters: { name: string; value: string }[];
  sorting: string;
  onSortingChange: (value: string) => void;
  onRemoveFilter: (filter: { name: string; value: string }) => void;
  isArrowDown: boolean;
  setIsArrowDown: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

const FiltersControls: React.FC<FiltersControlsProps> = ({
  filtersVisible,
  toggleFilters,
  filters,
  sorting,
  onSortingChange,
  onRemoveFilter,
  isArrowDown,
  setIsArrowDown,
  isMobile,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSortSelect = (value: string) => {
    onSortingChange(value); // Directly pass the string value
    setDropdownOpen(false);  // Close dropdown after selection
  };

  return (
    <div className={`flex ${isMobile ? 'justify-between' : 'justify-between'} items-center mb-4`}>
      {/* Filtry Button */}
      <button
        onClick={toggleFilters}
        className={`filters-toggle border rounded-[24px] ${isMobile ? 'w-1/2' : 'w-[328px] text-[16px]'} p-[7px_16px] mr-[32px] font-bold flex justify-between items-center`}
      >
        <span className="font-semibold text-center">Filtry</span>
        {!isMobile && (
          <img
            src={filtersVisible ? '/icons/arrow-left-black.svg' : '/icons/arrow-right-black.svg'}
            alt="Toggle Filters"
            className="w-[24px] h-[24px]"
          />
        )}
      </button>

      {/* Active Filters for Desktop */}
      {!isMobile && (
        <div className="flex gap-2 ml-4 flex-wrap">
          {filters.map((filter) => (
            <span key={`${filter.name}-${filter.value}`} className="flex items-center text-[14px]">
              {filter.value}
              <button
                onClick={() => onRemoveFilter(filter)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Sorting Button with Dropdown as Part of Button */}
      <div className={`relative ${isMobile ? 'w-1/2' : 'w-[352px] ml-auto'}`}>
        <button
          className={`border rounded-[24px] w-full text-[16px] p-[7px_16px] font-bold flex justify-between items-center`}
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
            setIsArrowDown(!dropdownOpen);
          }}
        >
          <span className="text-left">Sortowanie</span>
          <img
            src={isArrowDown ? '/icons/arrow-down.svg' : '/icons/arrow-up.svg'}
            alt="Arrow"
            className="w-[16px] h-[16px]"
          />
        </button>

        {/* Custom Dropdown Menu styled as part of button */}
        {dropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-[16px] shadow-lg z-20">
            <div
              onClick={() => handleSortSelect('bestsellers')}
              className={`cursor-pointer p-4 ${sorting === 'bestsellers' ? 'bg-gray-100' : ''} hover:bg-gray-100 rounded-t-[16px]`}
            >
              Bestsellers
            </div>
            <div
              onClick={() => handleSortSelect('newest')}
              className={`cursor-pointer p-4 ${sorting === 'newest' ? 'bg-gray-100' : ''} hover:bg-gray-100`}
            >
              Najnowsze produkty
            </div>
            <div
              onClick={() => handleSortSelect('price-desc')}
              className={`cursor-pointer p-4 ${sorting === 'price-desc' ? 'bg-gray-100' : ''} hover:bg-gray-100`}
            >
              Najwyższa cena
            </div>
            <div
              onClick={() => handleSortSelect('price-asc')}
              className={`cursor-pointer p-4 ${sorting === 'price-asc' ? 'bg-gray-100' : ''} hover:bg-gray-100 rounded-b-[16px]`}
            >
              Najniższa cena
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersControls;
