import React from 'react';
import CustomDropdown from '@/components/UI/CustomDropdownWithLabels.component';
import { useI18n } from '@/utils/hooks/useI18n';
import { dropdownOption } from '@/types/filters';
import { getSortingOptions } from '@/utils/data/filters';
import { FilterAttribute } from '@/components/Filters/Filters.component';

interface FiltersControlsProps {
  filtersVisible: boolean;
  toggleFilters: () => void;
  filters: { name: string; value: string }[];
  attributes?: FilterAttribute[];
  sorting: dropdownOption;
  onSortingChange: (value: dropdownOption) => void;
  onRemoveFilter: (filter: { name: string; value: string }) => void;
  isMobile: boolean;
}

const FiltersControls: React.FC<FiltersControlsProps> = ({
  filtersVisible,
  toggleFilters,
  filters,
  attributes = [],
  sorting,
  onSortingChange,
  onRemoveFilter,
  isMobile,
}) => {

  const { t } = useI18n();

  const sortingOptions = getSortingOptions(t);

  const handleFilterRemove = (filter: { name: string; value: string }) => {
    onRemoveFilter(filter);
  };

  const getFilterLabel = (filter: { name: string; value: string }) => {
    const attribute = attributes.find((item) => item.slug === filter.name);
    const option = attribute?.options?.find((item) => item.slug === filter.value);
    return option?.name || filter.value;
  };

  if (isMobile) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          {/* Toggle Filters Button */}
          <button
            onClick={toggleFilters}
            className="filters-toggle border border-beige-dark rounded-[24px] px-4 h-12 mr-[32px] font-bold flex justify-center items-center w-1/2"
          >
            <span className="font-semibold text-center">{t.filters.filters}</span>
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
              className={`${sorting.key !== 'sort' ? 'border border-dark-pastel-red text-dark-pastel-red' : ''} h-12 flex items-center justify-center px-4 text-center`}
              options={sortingOptions}
              selectedValue={sorting}
              placeholder={t.filters.sorting}
              onChange={(value) => onSortingChange(value)}
              isProductPage={false}
            />
          </div>
        </div>
        {filters.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2 mb-4">
            {filters.map((filter) => (
              <span
                key={`${filter.name}-${filter.value}`}
                className="filter-item filter-item--mobile"
              >
                {getFilterLabel(filter)}
                <button
                  onClick={() => handleFilterRemove(filter)}
                  className="ml-2 shrink-0"
                  aria-label="Usuń filtr"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke="#363132" stroke-width="2" d="m.707.707 11.314 11.314M12.021.707.707 12.021"/></svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </>
    );
  }

  // --- Desktop View ---
  return (
    <div className="flex mb-4">
      <div className="w-1/4 flex items-center pr-8">
        <button
          onClick={toggleFilters}
          className="filters-toggle border border-beige-dark rounded-[24px] p-[7px_16px] font-bold w-full flex justify-between items-center"
        >
          <span className="font-semibold text-left">{t.filters.filters}</span>
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
        <div className="w-2/3 pr-8">
          {filters.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <span
                  key={`${filter.name}-${filter.value}`}
                  className="filter-item"
                >
                  {getFilterLabel(filter)}
                  <button
                    onClick={() => handleFilterRemove(filter)}
                    className="ml-2 shrink-0"
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke="#363132" stroke-width="2" d="m.707.707 11.314 11.314M12.021.707.707 12.021"/></svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="w-1/3 pl-[1.3rem] flex justify-end">
          <CustomDropdown
            options={sortingOptions}
            selectedValue={sorting}
            placeholder={t.filters.sorting}
            onChange={(value) => onSortingChange(value)}
            isProductPage={false}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersControls;
