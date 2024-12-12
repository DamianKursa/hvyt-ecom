import { useState, useEffect, useRef } from 'react';
import SkeletonFilter from '../Skeletons/SkeletonFilter.component';
import Snackbar from '../UI/Snackbar.component';
import {
  fetchProductsWithFilters,
  fetchProductAttributesWithTerms,
} from '@/utils/api/category';

interface FiltersProps {
  categoryId: number;
  activeFilters: { name: string; value: string }[];
  onFilterChange: (selectedFilters: { name: string; value: string }[]) => void;
  setProducts: (products: any[]) => void;
  setTotalProducts: (total: number) => void;
}

const Filters = ({
  categoryId,
  activeFilters,
  onFilterChange,
  setProducts,
  setTotalProducts,
}: FiltersProps) => {
  const [attributes, setAttributes] = useState<
    { name: string; slug: string; options?: { name: string; slug: string }[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedFilters, setExpandedFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [moreOptionsVisible, setMoreOptionsVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const previousCategoryId = useRef<number | null>(null);

  // Fetch product attributes when the category changes
  useEffect(() => {
    const fetchAttributes = async () => {
      if (previousCategoryId.current === categoryId) return; // Skip if attributes already fetched for this category

      setLoading(true);
      try {
        const fetchedAttributes =
          await fetchProductAttributesWithTerms(categoryId);
        setAttributes(fetchedAttributes);

        // Initialize the expanded state for the first 3 attributes
        const initialExpandedFilters = fetchedAttributes.slice(0, 3).reduce(
          (acc: { [key: string]: boolean }, attribute: { slug: string }) => ({
            ...acc,
            [attribute.slug]: true,
          }),
          {},
        );
        setExpandedFilters(initialExpandedFilters);

        previousCategoryId.current = categoryId; // Cache the fetched category ID
        setLoading(false);
      } catch (error) {
        setErrorMessage('Failed to load filters');
        setLoading(false);
      }
    };

    if (categoryId) fetchAttributes();
  }, [categoryId]);

  // Handle changes to filter selections
  const handleFilterChange = async (
    attributeSlug: string,
    optionSlug: string,
    checked: boolean,
  ) => {
    const updatedFilters = checked
      ? [...activeFilters, { name: attributeSlug, value: optionSlug }]
      : activeFilters.filter(
          (filter) =>
            !(filter.name === attributeSlug && filter.value === optionSlug),
        );

    onFilterChange(updatedFilters); // Update active filters state

    try {
      const { products, totalProducts } = await fetchProductsWithFilters(
        categoryId,
        updatedFilters,
        1,
        12,
      );
      setProducts(products); // Update the product list
      setTotalProducts(totalProducts); // Update the total products count
      console.log('Filtered products fetched:', { products, totalProducts }); // Debug log
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  // Expand or collapse a filter section
  const toggleFilter = (slug: string) => {
    setExpandedFilters((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Show more or fewer options for a filter
  const toggleMoreOptions = (slug: string) => {
    setMoreOptionsVisible((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Render loading skeleton while fetching attributes
  if (loading) {
    return (
      <div className="filters border p-4">
        <SkeletonFilter />
        <SkeletonFilter />
        <SkeletonFilter />
      </div>
    );
  }

  // Render error message if there is an error
  if (errorMessage) {
    return <Snackbar message={errorMessage} type="error" visible={true} />;
  }

  return (
    <div className="filters w-full rounded-[24px] p-[12px_16px] border">
      {attributes.map((attribute) => (
        <div key={attribute.slug} className="mb-4">
          {/* Filter Title */}
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

          {/* Filter Options */}
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
                  const isChecked = activeFilters.some(
                    (filter) =>
                      filter.name === attribute.slug &&
                      filter.value === option.slug,
                  );
                  return (
                    <div key={option.slug} className="flex items-center mb-2">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        id={`${attribute.slug}-${option.slug}`}
                        name={option.slug}
                        value={option.slug}
                        checked={isChecked}
                        onChange={(e) =>
                          handleFilterChange(
                            attribute.slug,
                            option.slug,
                            e.target.checked,
                          )
                        }
                        className="hidden"
                      />
                      {/* Label */}
                      <label
                        htmlFor={`${attribute.slug}-${option.slug}`}
                        className={`flex items-center cursor-pointer w-5 h-5 border border-black rounded ${
                          isChecked ? 'bg-black' : ''
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
              {/* Show More/Less Button */}
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
