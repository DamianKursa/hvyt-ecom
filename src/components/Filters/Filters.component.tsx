import React, { useState, useEffect, useRef } from 'react';
import SkeletonFilter from '../Skeletons/SkeletonFilter.component';
import Snackbar from '../UI/Snackbar.component';
import PriceSlider from '@/components/UI/PriceSlider';

interface FilterOption {
  name: string;
  slug: string;
}

export interface FilterAttribute {
  name: string;
  slug: string;
  options?: FilterOption[];
}

interface FiltersProps {
  categoryId: number;
  activeFilters: { name: string; value: string }[];
  onFilterChange: (selectedFilters: { name: string; value: string }[]) => void;
  setProducts: (products: any[]) => void;
  setTotalProducts: (total: number) => void;
  filterOrder?: string[];
  initialAttributes?: FilterAttribute[];
}

const Filters: React.FC<FiltersProps> = ({
  categoryId,
  activeFilters,
  onFilterChange,
  setProducts,
  setTotalProducts,
  filterOrder = [],
  initialAttributes = [],
}) => {
  const [attributes, setAttributes] =
    useState<FilterAttribute[]>(initialAttributes);
  const [loading, setLoading] = useState(initialAttributes.length === 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedFilters, setExpandedFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [moreOptionsVisible, setMoreOptionsVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const previousCategoryId = useRef<number | null>(null);

  // Only fetch attributes if initialAttributes is not provided.
  useEffect(() => {
    // If initialAttributes exist, assume they’re fresh.
    if (initialAttributes && initialAttributes.length > 0) {
      const orderedAttributes =
        filterOrder.length > 0
          ? filterOrder
              .map((order) =>
                initialAttributes.find((attr) => attr.name === order),
              )
              .filter((attr): attr is FilterAttribute => !!attr)
          : initialAttributes;

      setAttributes(orderedAttributes);

      const initialExpandedFilters = orderedAttributes.slice(0, 3).reduce(
        (acc: { [key: string]: boolean }, attr: FilterAttribute) => ({
          ...acc,
          [attr.slug]: true,
        }),
        { price: false },
      );
      setExpandedFilters(initialExpandedFilters);
      return;
    }

    // Otherwise, fetch attributes from the API.
    const fetchAttributes = async () => {
      // Avoid re-fetching if category hasn't changed.
      if (previousCategoryId.current === categoryId) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/category?action=fetchProductAttributesWithTerms&categoryId=${categoryId}`,
        );
        if (!res.ok) throw new Error('Failed to fetch attributes');
        const fetchedAttributes: FilterAttribute[] = await res.json();
        // Order attributes using filterOrder if provided.
        const orderedAttributes =
          filterOrder.length > 0
            ? filterOrder
                .map((order) =>
                  fetchedAttributes.find((attr) => attr.name === order),
                )
                .filter((attr): attr is FilterAttribute => !!attr)
            : fetchedAttributes;
        setAttributes(orderedAttributes);
        setPriceRange([0, 500]);
        const initialExpandedFilters = orderedAttributes.slice(0, 3).reduce(
          (acc: { [key: string]: boolean }, attr: FilterAttribute) => ({
            ...acc,
            [attr.slug]: true,
          }),
          { price: false },
        );
        setExpandedFilters(initialExpandedFilters);
        previousCategoryId.current = categoryId;
      } catch (error) {
        setErrorMessage('Failed to load filters');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchAttributes();
    }
  }, [categoryId, filterOrder, initialAttributes]);

  const handleFilterChange = async (
    attributeSlug: string,
    optionSlug: string,
    checked: boolean,
  ) => {
    if (isFetchingProducts) return;

    const updatedFilters = checked
      ? [...activeFilters, { name: attributeSlug, value: optionSlug }]
      : activeFilters.filter(
          (filter) =>
            !(filter.name === attributeSlug && filter.value === optionSlug),
        );

    onFilterChange(updatedFilters);

    // If no filters remain, use the default products endpoint.
    if (updatedFilters.length === 0) {
      try {
        const res = await fetch(
          `/api/category?action=fetchProductsByCategoryId&categoryId=${categoryId}&page=1&perPage=12`,
        );
        if (!res.ok) throw new Error('Error fetching default products');
        const data = await res.json();
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
      } catch (error) {
        console.error('Error fetching default products:', error);
      }
      return;
    }

    const filtersParam = encodeURIComponent(JSON.stringify(updatedFilters));
    setIsFetchingProducts(true);
    try {
      const res = await fetch(
        `/api/category?action=fetchProductsWithFilters&categoryId=${categoryId}&filters=${filtersParam}&page=1&perPage=12`,
      );
      if (!res.ok) throw new Error('Error fetching filtered products');
      const data = await res.json();
      setProducts(data.products);
      setTotalProducts(data.totalProducts);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    } finally {
      setIsFetchingProducts(false);
    }
  };

  const handlePriceChange = async (newRange: [number, number]) => {
    setPriceRange(newRange);

    const priceFilter = {
      name: 'price',
      value: `${newRange[0]}-${newRange[1]}`,
    };

    const updatedFilters = [
      ...activeFilters.filter((filter) => filter.name !== 'price'),
      priceFilter,
    ];

    onFilterChange(updatedFilters);
    const filtersParam = encodeURIComponent(JSON.stringify(updatedFilters));

    setIsFetchingProducts(true);
    try {
      const res = await fetch(
        `/api/category?action=fetchProductsWithFilters&categoryId=${categoryId}&filters=${filtersParam}&page=1&perPage=12`,
      );
      if (!res.ok) throw new Error('Error applying price filter');
      const data = await res.json();
      setProducts(data.products);
      setTotalProducts(data.totalProducts);
    } catch (error) {
      console.error('Error applying price filter:', error);
    } finally {
      setIsFetchingProducts(false);
    }
  };

  const toggleFilter = (slug: string) => {
    setExpandedFilters((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const toggleMoreOptions = (slug: string) => {
    setMoreOptionsVisible((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  if (loading) {
    return (
      <div className="filters border p-4">
        <SkeletonFilter />
        <SkeletonFilter />
        <SkeletonFilter />
      </div>
    );
  }

  if (errorMessage) {
    return <Snackbar message={errorMessage} type="error" visible={true} />;
  }

  if (attributes.length === 0) {
    return (
      <div className="filters border p-4">
        <SkeletonFilter />
        <SkeletonFilter />
        <SkeletonFilter />
      </div>
    );
  }

  return (
    <div className="filters w-full rounded-[24px] p-[12px_16px] border border-beige-dark">
      {attributes.map((attribute) => (
        <div key={attribute.slug} className="mb-4">
          <button
            className="font-bold mb-2 flex items-center justify-between w-full"
            onClick={() => toggleFilter(attribute.slug)}
            disabled={isFetchingProducts}
          >
            <div className="flex items-center">
              <span>{attribute.name}</span>
              {attribute.name === 'Rozstaw' && (
                <div className="relative group ml-2">
                  <img
                    src="/icons/info.svg"
                    alt="Info"
                    className="w-6 h-6 cursor-pointer"
                  />
                  <div className="absolute left-full w-[160px] top-1/2 transform -translate-y-1/2 ml-2 bg-beige-dark text-black font-light text-[12px] rounded-[5px] px-4 py-2 hidden group-hover:block z-50 shadow-lg">
                    <div className="absolute -left-[6px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-beige-dark rotate-45"></div>
                    Rozstaw to odległość pomiędzy środkami otworów montażowych.
                  </div>
                </div>
              )}
            </div>
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
                  const isChecked = activeFilters.some(
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
                        checked={isChecked}
                        onChange={(e) =>
                          handleFilterChange(
                            attribute.slug,
                            option.slug,
                            e.target.checked,
                          )
                        }
                        disabled={isFetchingProducts}
                        className="hidden"
                      />
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
                            className="w-4 h-4"
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
                  disabled={isFetchingProducts}
                >
                  {moreOptionsVisible[attribute.slug] ? 'Mniej' : 'Wiecej'}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      <div className="mb-4">
        <div key="price" className="mb-4">
          <button
            className="font-bold mb-2 flex items-center justify-between w-full"
            onClick={() => toggleFilter('price')}
            disabled={isFetchingProducts}
          >
            <span>Cena</span>
            <img
              src={
                expandedFilters['price']
                  ? '/icons/arrow-up.svg'
                  : '/icons/arrow-down.svg'
              }
              alt={expandedFilters['price'] ? 'Arrow up' : 'Arrow down'}
              className="w-4 h-4"
            />
          </button>
          {expandedFilters['price'] && (
            <PriceSlider
              minPrice={0}
              maxPrice={300}
              currentRange={priceRange}
              onPriceChange={handlePriceChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
