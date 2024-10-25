import React from 'react';
import Filters from './Filters.component';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributes: { name: string; options?: string[] }[];
  onFilterChange: (selectedFilters: { name: string; value: string }[]) => void;
  activeFilters: { name: string; value: string }[];
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, attributes, onFilterChange, activeFilters }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Filtry</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">&times;</button>
        </div>
        <Filters attributes={attributes} onFilterChange={onFilterChange} activeFilters={activeFilters} />
        <div className="mt-4 flex justify-between">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">Wyczysc filtry</button>
          <button onClick={onClose} className="bg-black text-white px-4 py-2 rounded-lg">Pokaż produkty</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
