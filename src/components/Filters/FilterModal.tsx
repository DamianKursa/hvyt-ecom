import React from 'react';
import Filters, { FilterAttribute } from './Filters.component';
import { useI18n } from '@/utils/hooks/useI18n';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
  activeFilters: { name: string; value: string }[];
  onFilterChange: (selectedFilters: { name: string; value: string }[]) => void;
  onApplyFilters: () => void; // Callback to apply filters and close the modal
  onClearFilters: () => void; // Clear all filters
  productsCount: number; // Total number of products
  initialProductCount: number; // Initial total product count
  setProducts: React.Dispatch<React.SetStateAction<any[]>>; // Update products when filters change
  setTotalProducts: React.Dispatch<React.SetStateAction<number>>; // Update total products count
  filterOrder: string[]; // Add filterOrder prop
  initialAttributes: FilterAttribute[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  categoryId,
  activeFilters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  productsCount,
  initialProductCount,
  setProducts,
  setTotalProducts,
  filterOrder,
  initialAttributes = [],
}) => {
  
  const {t} = useI18n();

  const getFilterLabel = (filter: { name: string; value: string }) => {
    const attribute = initialAttributes.find((item) => item.slug === filter.name);
    const option = attribute?.options?.find((item) => item.slug === filter.value);
    return option?.name || filter.value;
  };

  if (!isOpen) return null;


  const handleClearFilters = () => {
    onFilterChange([]);
    setProducts([]); // Clear product list
    setTotalProducts(initialProductCount); // Reset to initial total product count
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-lg flex flex-col h-full">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">{t.filters.filters}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
          </div>
          {/* Display Active Filters */}
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={`${filter.name}-${filter.value}`}
                className="filter-item filter-item--mobile"
              >
                {getFilterLabel(filter)}
                <button
                  onClick={() =>
                    onFilterChange(
                      activeFilters.filter(
                        (f) =>
                          f.name !== filter.name || f.value !== filter.value,
                      ),
                    )
                  }
                  className="ml-2 shrink-0"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke="#363132" stroke-width="2" d="m.707.707 11.314 11.314M12.021.707.707 12.021"/></svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex-grow overflow-y-auto p-4">
          <Filters
            categoryId={categoryId}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            setProducts={setProducts}
            setTotalProducts={setTotalProducts}
            filterOrder={filterOrder}
          />
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-beige z-10">
          <button
            onClick={handleClearFilters}
            disabled={activeFilters.length === 0} // Disable if no filters applied
            className={`w-full mb-2 py-3 text-black border border-black rounded-full text-lg font-light hover:bg-gray-100 transition ${
              activeFilters.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {t.filters.emptyFilter}
          </button>
          <button
            onClick={onApplyFilters}
            disabled={productsCount === 0 && activeFilters.length > 0} // Disable if no products found
            className={`w-full py-3 text-white bg-black rounded-full text-lg font-light hover:bg-gray-800 transition ${
              productsCount === 0 && activeFilters.length > 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {`${t.filters.show} ${
              activeFilters.length > 0 ? productsCount : initialProductCount
            } ${t.filters.products}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
