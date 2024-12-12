import { useState, useEffect } from 'react';
import SkeletonFilter from '../Skeletons/SkeletonFilter.component';
import Snackbar from '../UI/Snackbar.component';
import { fetchProductsWithFilters } from '@/utils/api/category';

interface FiltersProps {
  attributes: {
    name: string;
    slug: string;
    options?: { name: string; slug: string }[];
  }[];
  errorMessage?: string;
  activeFilters: { name: string; value: string }[];
  onFilterChange: (selectedFilters: { name: string; value: string }[]) => void;
  categoryId: number;
  setProducts: (products: any[]) => void;
  setTotalProducts: (total: number) => void;
}

const Filters = ({
  attributes,
  errorMessage,
  activeFilters,
  onFilterChange,
  categoryId,
  setProducts,
  setTotalProducts,
}: FiltersProps) => {
  const [showError, setShowError] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [moreOptionsVisible, setMoreOptionsVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedFilters, setSelectedFilters] =
    useState<{ name: string; value: string }[]>(activeFilters);

  useEffect(() => {
    setSelectedFilters(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
    } else {
      const defaultExpanded: { [key: string]: boolean } = {};
      attributes.slice(0, 3).forEach((attr) => {
        defaultExpanded[attr.slug] = true;
      });
      setExpandedFilters(defaultExpanded);
    }
  }, [errorMessage, attributes]);

  const handleFilterChange = async (
    attributeSlug: string,
    optionSlug: string,
    checked: boolean,
  ) => {
    const updatedFilters = checked
      ? [...selectedFilters, { name: attributeSlug, value: optionSlug }]
      : selectedFilters.filter(
          (filter) =>
            !(filter.name === attributeSlug && filter.value === optionSlug),
        );

    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);

    if (updatedFilters.length > 0) {
      try {
        const { products, totalProducts } = await fetchProductsWithFilters(
          categoryId,
          updatedFilters,
          1,
          12,
        );
        setProducts(products);
        setTotalProducts(totalProducts);
      } catch (error) {
        console.error('Error fetching products with filters:', error);
      }
    } else {
      setProducts([]);
      setTotalProducts(0);
    }
  };

  const toggleFilter = (slug: string) => {
    setExpandedFilters((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const toggleMoreOptions = (slug: string) => {
    setMoreOptionsVisible((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  if (attributes.length === 0) {
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
        <div key={attribute.slug} className="mb-4">
          <button
            className="font-bold mb-2 flex justify-between items-center w-full"
            onClick={() => toggleFilter(attribute.slug)}
          >
            {attribute.name}
            <img
              src={
                expandedFilters[attribute.slug]
                  ? '/icons/arrow-up.svg'
                  : '/icons/arrow-down.svg'
              }
              alt={expandedFilters[attribute.slug] ? 'Arrow up' : 'Arrow down'}
              className="w-4 h-4"
            />
          </button>

          {expandedFilters[attribute.slug] && attribute.options && (
            <div className="pl-0">
              {attribute.options
                .slice(
                  0,
                  moreOptionsVisible[attribute.slug]
                    ? attribute.options.length
                    : 4,
                )
                .map((option) => {
                  const isChecked = selectedFilters.some(
                    (filter) =>
                      filter.name === attribute.slug &&
                      filter.value === option.slug,
                  );
                  return (
                    <div key={option.slug} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`${attribute.slug}-${option.slug}`}
                        name={option.slug}
                        value={option.slug}
                        className="hidden"
                        checked={isChecked}
                        onChange={(e) =>
                          handleFilterChange(
                            attribute.slug,
                            option.slug,
                            e.target.checked,
                          )
                        }
                      />
                      <label
                        htmlFor={`${attribute.slug}-${option.slug}`}
                        className={`flex items-center cursor-pointer w-5 h-5 border border-black rounded ${
                          isChecked ? 'bg-black' : 'border-black'
                        }`}
                      >
                        {isChecked && (
                          <img
                            src="/icons/check.svg"
                            alt="check"
                            className="w-4 h-4 text-white"
                          />
                        )}
                      </label>
                      <span className="ml-2">{option.name}</span>
                    </div>
                  );
                })}
              {attribute.options.length > 4 && (
                <button
                  className="underline text-[14px]"
                  onClick={() => toggleMoreOptions(attribute.slug)}
                >
                  {moreOptionsVisible[attribute.slug] ? 'Mniej' : 'Wiecej'}
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
