import { useState, useEffect } from 'react';
import SkeletonFilter from '../Product/SkeletonFilter.component';
import Snackbar from '../UI/Snackbar.component';

interface FiltersProps {
  attributes: { name: string; options?: string[] }[];
  errorMessage?: string;
  onFilterChange: (selectedFilters: { name: string; value: string }[]) => void;
}

const Filters = ({ attributes, errorMessage, onFilterChange }: FiltersProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({});
  const [moreOptionsVisible, setMoreOptionsVisible] = useState<{ [key: string]: boolean }>({});
  const [selectedFilters, setSelectedFilters] = useState<{ name: string; value: string }[]>([]);

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
    } else {
      setTimeout(() => setIsLoading(false), 1000);
      const defaultExpanded: { [key: string]: boolean } = {};
      attributes.slice(0, 3).forEach(attr => {
        defaultExpanded[attr.name] = true;
      });
      setExpandedFilters(defaultExpanded);
    }
  }, [errorMessage, attributes]);

  const handleFilterChange = (attributeName: string, optionValue: string, checked: boolean) => {
    const updatedFilters = checked
      ? [...selectedFilters, { name: attributeName, value: optionValue }]
      : selectedFilters.filter(filter => !(filter.name === attributeName && filter.value === optionValue));

    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleFilter = (name: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const toggleMoreOptions = (name: string) => {
    setMoreOptionsVisible((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  if (isLoading) {
    return (
      <div className="filters border p-4">
        <SkeletonFilter />
        <SkeletonFilter />
        <SkeletonFilter />
      </div>
    );
  }

  if (errorMessage) {
    return <Snackbar message={errorMessage} type="error" visible={showError} />;
  }

  return (
    <div className="filters w-full rounded-[24px] p-[12px_16px] border">
      {attributes.map((attribute) => (
        <div key={attribute.name} className="mb-4">
          <button
            className="font-bold mb-2 flex justify-between items-center w-full"
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
            <div className="pl-0">
              {attribute.options.slice(0, moreOptionsVisible[attribute.name] ? attribute.options.length : 4).map((option) => (
                <div key={option} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={option}
                    name={option}
                    value={option}
                    className="w-5 h-5 mr-2 rounded-tl-[4px] border-gray-300"
                    onChange={(e) => handleFilterChange(attribute.name, option, e.target.checked)}
                  />
                  <label htmlFor={option}>{option}</label>
                </div>
              ))}
              {attribute.options.length > 4 && (
                <button
                  className="underline text-[14px]"
                  onClick={() => toggleMoreOptions(attribute.name)}
                >
                  {moreOptionsVisible[attribute.name] ? 'Mniej' : 'Wiecej'}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Filters;
