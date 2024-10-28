import React from 'react';

interface FiltersControlsProps {
  filtersVisible: boolean;
  toggleFilters: () => void;
  filters: { name: string; value: string }[];
  sorting: string;
  onSortingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
}) => (
  <div className={`flex ${isMobile ? 'justify-between' : 'justify-between'} items-center mb-4`}>
    {/* Filtry Button */}
    <button
      onClick={toggleFilters}
      className={`filters-toggle border rounded-[24px] ${isMobile ? 'w-1/2' : 'w-[352px] text-[16px]'} p-[7px_16px] mr-[32px] font-bold flex justify-between items-center`}
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

    {/* Sorting Button with Text Left-Aligned and Icon on Right */}
    <div className={`relative ${isMobile ? 'w-1/2' : 'w-[352px] ml-auto'}`}>
      <button
        className={`border rounded-[24px] w-full text-[16px] p-[7px_16px] font-bold flex justify-between items-center`}
        onClick={() => setIsArrowDown(!isArrowDown)}
      >
        <span className="text-left">Sortowanie</span>
        <img
          src={isArrowDown ? '/icons/arrow-down.svg' : '/icons/arrow-up.svg'}
          alt="Arrow"
          className="w-[16px] h-[16px]"
        />
      </button>
      <select
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
        value={sorting}
        onChange={onSortingChange}
      >
        <option value="bestsellers">Bestsellers</option>
        <option value="newest">Najnowsze produkty</option>
        <option value="price-desc">Najwyższa cena</option>
        <option value="price-asc">Najniższa cena</option>
      </select>
    </div>
  </div>
);

export default FiltersControls;
