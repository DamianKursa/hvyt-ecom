import { useState, useEffect } from 'react';
import SkeletonFilter from '../Product/SkeletonFilter.component';
import Snackbar from '../UI/Snackbar.component';

// Importing your SVGs
import ArrowDown from '../../../public/icons/arrow-down.svg';
import ArrowUp from '../../../public/icons/arrow-up.svg';

interface FiltersProps {
  attributes: { name: string; options?: string[] }[]; // Ensure options can be undefined
  errorMessage?: string;
}

const Filters = ({ attributes, errorMessage }: FiltersProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({}); // Manage toggle state

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
    } else {
      setTimeout(() => setIsLoading(false), 1000); // Simulate loading
    }
  }, [errorMessage]);

  const toggleFilter = (name: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Show Skeleton while loading
  if (isLoading) {
    return (
      <div className="filters border p-4">
        <h3 className="text-xl font-semibold mb-4">Filtry</h3>
        <SkeletonFilter />
        <SkeletonFilter />
        <SkeletonFilter />
      </div>
    );
  }

  // Render Snackbar if there's an error
  if (errorMessage) {
    return <Snackbar message={errorMessage} type="error" visible={showError} />;
  }

  // Render filters when loaded
  return (
    <div className="filters border rounded-lg p-4 shadow-md w-full max-w-xs">
      <h3 className="text-xl font-semibold mb-4">Filtry</h3>
      {attributes.map((attribute) => (
        <div key={attribute.name} className="mb-4">
          <button
            className="font-medium mb-2 flex justify-between items-center w-full"
            onClick={() => toggleFilter(attribute.name)}
          >
            {attribute.name}
            <img
              src={expandedFilters[attribute.name] ? '/icons/arrow-up.svg' : '/icons/arrow-down.svg'}
              alt={expandedFilters[attribute.name] ? 'Arrow up' : 'Arrow down'}
              className="w-4 h-4"
            />
          </button>

          {expandedFilters[attribute.name] && attribute.options && attribute.options.length > 0 && (
            <div className="pl-4">
              {attribute.options.map((option) => (
                <div key={option} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={option}
                    name={option}
                    value={option}
                    className="mr-2"
                  />
                  <label htmlFor={option}>{option}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Filters;
