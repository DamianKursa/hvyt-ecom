import React from 'react';
import Filters from './Filters.component';

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
  initialAttributes: any[];
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
}) => {
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
            <h3 className="text-xl font-bold">Filtry</h3>
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
                className="flex items-center px-3 py-1 text-[#661F30] capitalize bg-beige text-sm rounded-full"
              >
                {filter.value}
                <button
                  onClick={() =>
                    onFilterChange(
                      activeFilters.filter(
                        (f) =>
                          f.name !== filter.name || f.value !== filter.value,
                      ),
                    )
                  }
                  className="text-[#857C7F] ml-2 text-[20px]"
                >
                  &times;
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
            Wyczyść filtry
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
            {`Pokaż ${
              activeFilters.length > 0 ? productsCount : initialProductCount
            } produktów`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
