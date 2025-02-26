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

  const handleFilterRemove = (filter: { name: string; value: string }) => {
    onRemoveFilter(filter);
    // Reset sorting to default ("Sortowanie") when a filter is removed
    onSortingChange('Sortowanie');
  };

  // --- Mobile View (unchanged from original) ---
  if (isMobile) {
    return (
      <div className="flex justify-between items-center mb-4">
        {/* Toggle Filters Button */}
        <button
          onClick={toggleFilters}
          className="filters-toggle border border-beige-dark rounded-[24px] p-[7px_16px] mr-[32px] font-bold flex justify-between items-center w-1/2"
        >
          <span className="font-semibold text-left">Filtry</span>
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
        {/* Sorting Dropdown */}
        <div className="relative w-1/2">
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
  }

  // --- Desktop View ---
  return (
    <div className="flex mb-4">
      {/* Left column: same width as your Filters sidebar (w-1/4) */}
      <div className="w-1/4 flex items-center pr-8">
        <button
          onClick={toggleFilters}
          className="filters-toggle border border-beige-dark rounded-[24px] p-[7px_16px] font-bold w-full flex justify-between items-center"
        >
          <span className="font-semibold text-left">Filtry</span>
          <img
            src={
              filtersVisible
                ? '/icons/arrow-left-black.svg'
                : '/icons/arrow-right-black.svg'
            }
            alt="Toggle Filters"
            className="w-[24px] h-[24px]"
          />
        </button>
      </div>
      {/* Right column (w-3/4): subdivided into active filters and sort dropdown */}
      <div className="w-3/4 flex items-center">
        {/* Active filters: occupies 2/3 of the product archive area with 16px left (pl-4) and 32px right (pr-8) padding */}
        <div className="w-2/3 pl-4 pr-8">
          {filters.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <span
                  key={`${filter.name}-${filter.value}`}
                  className="flex items-center text-sm bg-gray-100 rounded px-2 py-1"
                >
                  {filter.value}
                  <button
                    onClick={() => handleFilterRemove(filter)}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Sort dropdown: occupies the right 1/3 with 1.3rem left padding */}
        <div className="w-1/3 pl-[1.3rem] flex justify-end">
          <CustomDropdown
            options={sortingOptions}
            selectedValue={sorting}
            placeholder="Sortowanie"
            onChange={(value) => onSortingChange(value)}
            isProductPage={false}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersControls;
