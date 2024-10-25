// FiltersControls.tsx
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
}) => (
  <div className="flex justify-between items-center mb-4">
    {/* Filtry Button */}
    <button
      onClick={toggleFilters}
      className="filters-toggle border rounded-[24px] w-[352px] text-[24px] p-[7px_16px] flex justify-between items-center cursor-pointer"
    >
      <span className="font-semibold">Filtry</span>
      <img
        src={filtersVisible ? '/icons/arrow-left-black.svg' : '/icons/arrow-right-black.svg'}
        alt="Toggle Filters"
        className="w-[24px] h-[24px]"
      />
    </button>

    {/* Active Filters */}
    <div className="flex gap-2">
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

    {/* Sorting Button */}
    <div className="relative w-[340px]">
      <button
        className="border rounded-[24px] w-[340px] text-[16px] p-[12px_20px] font-bold flex justify-between items-center"
        onClick={() => setIsArrowDown(!isArrowDown)}
      >
        Sortowanie
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