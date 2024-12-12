import React from 'react';
import Filters from './Filters.component';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributes: {
    name: string;
    slug: string;
    options?: { name: string; slug: string }[];
  }[];
  onFilterChange: (selectedFilters: { name: string; value: string }[]) => void;
  activeFilters: { name: string; value: string }[];
  onApplyFilters: () => void; // Callback to apply filters and close the modal
  onClearFilters: () => void; // Clear all filters
  productsCount: number; // Total number of products
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  attributes,
  onFilterChange,
  activeFilters,
  onApplyFilters,
  onClearFilters,
  productsCount,
}) => {
  if (!isOpen) return null;

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
          {/* Display active filters */}
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={`${filter.name}-${filter.value}`}
                className="flex items-center px-3 py-1 bg-gray-200 text-sm rounded-full"
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
                  className="ml-2 text-red-500"
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
            attributes={attributes}
            onFilterChange={onFilterChange}
            activeFilters={activeFilters}
            categoryId={0} // Placeholder; not used here
            setProducts={() => {}} // No need for these in modal context
            setTotalProducts={() => {}}
          />
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
          <button
            onClick={onClearFilters}
            className="w-full mb-2 py-3 text-black border border-black rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            Wyczyść filtry
          </button>
          <button
            onClick={onApplyFilters}
            className="w-full py-3 text-white bg-black rounded-full text-lg font-semibold hover:bg-gray-800 transition"
          >
            Pokaż {productsCount} produktów
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
