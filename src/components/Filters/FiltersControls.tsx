import React from 'react';
import CustomDropdown from '@/components/UI/CustomDropdown.component';

interface FiltersControlsProps {
  filtersVisible: boolean;
  toggleFilters: () => void;
  filters: { name: string; value: string }[];
  sorting: string;
  onSortingChange: (value: string) => void;
  onRemoveFilter: (filter: { name: string; value: string }) => void;
  isMobile: boolean;
}

const FiltersControls: React.FC<FiltersControlsProps> = ({
  filtersVisible,
  toggleFilters,
  filters,
  sorting,
  onSortingChange,
  onRemoveFilter,
  isMobile,
}) => {
  const sortingOptions = [
    'Bestsellers',
    'Najnowsze produkty',
    'Najwyższa cena',
    'Najniższa cena',
  ];

  return (
    <div
      className={`flex ${isMobile ? 'justify-between' : 'justify-between'} items-center mb-4`}
    >
      {/* Toggle Filters Button */}
      <button
        onClick={toggleFilters}
        className={`filters-toggle border rounded-[24px] ${
          isMobile ? 'w-1/2' : 'w-[328px] text-[16px]'
        } p-[7px_16px] mr-[32px] font-bold flex justify-between items-center`}
      >
        <span className="font-semibold text-center">Filtry</span>
        {!isMobile && (
          <img
            src={
              filtersVisible
                ? '/icons/arrow-left-black.svg'
                : '/icons/arrow-right-black.svg'
            }
            alt="Toggle Filters"
            className="w-[24px] h-[24px]"
          />
        )}
      </button>

      {/* Display Active Filters */}
      {!isMobile && (
        <div className="flex gap-2 ml-4 flex-wrap">
          {filters.map((filter) => (
            <span
              key={`${filter.name}-${filter.value}`}
              className="flex items-center text-[14px]"
            >
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

      {/* Sorting Dropdown */}
      <div className={`relative ${isMobile ? 'w-1/2' : 'w-[352px] ml-auto'}`}>
        <CustomDropdown
          options={sortingOptions}
          selectedValue={sorting}
          placeholder="Sortowanie"
          onChange={(value) => onSortingChange(value)}
          isProductPage={false}
        />
      </div>
    </div>
  );
};

export default FiltersControls;
