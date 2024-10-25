import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import Filters from '@/components/Product/Filters.component';
import ProductArchive from '@/components/Product/ProductArchive';
import FilterSkeleton from '@/components/Product/SkeletonFilter.component';
import Snackbar from '@/components/UI/Snackbar.component';
import { fetchCategoryBySlug, fetchProductAttributesWithTerms } from '../../utils/api/woocommerce';

const icons: { [key: string]: string } = {
  'uchwyty-meblowe': '/icons/uchwyty-kształty.svg',
  klamki: '/icons/klamki-kształty.svg',
  wieszaki: '/icons/wieszaki-kształty.svg',
};

const CategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [category, setCategory] = useState<any>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [activeFilters, setActiveFilters] = useState<{ name: string; value: string }[]>([]);
  const [sortingOption, setSortingOption] = useState('default'); // Default sorting

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryData = await fetchCategoryBySlug(slug as string);
        setCategory(categoryData);

        const attributesData = await fetchProductAttributesWithTerms();
        setAttributes(attributesData);

        setLoading(false);
      } catch (error: any) {
        console.error('Error loading category data:', error);
        setErrorMessage(error.message || 'Error loading category data');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleFilterChange = (selectedFilters: { name: string; value: string }[]) => {
    setActiveFilters(selectedFilters);
  };

  const handleRemoveFilter = (filterToRemove: { name: string; value: string }) => {
    setActiveFilters((currentFilters) =>
      currentFilters.filter(
        (filter) => filter.name !== filterToRemove.name || filter.value !== filterToRemove.value
      )
    );
  };

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const getCategoryIcon = () => {
    if (icons[slug as string]) {
      return (
        <Image
          src={icons[slug as string]}
          alt={`${slug} icon`}
          width={54}
          height={24}
          className="ml-2"
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="container mx-auto flex">
          <div className="w-1/4 pr-8">
            <FilterSkeleton />
            <FilterSkeleton />
          </div>
          <div className="w-3/4 grid grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton-product" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (errorMessage) {
    return (
      <Layout title="Error">
        <Snackbar message={errorMessage} type="error" visible={true} />
      </Layout>
    );
  }

  return (
    <Layout title={category?.name || 'Category'}>
      <div className="container mx-auto">
        <nav className="breadcrumbs">
          {/* Breadcrumbs component */}
        </nav>

        <div className="flex items-center mb-8">
          <h1 className="text-[40px] font-bold text-[#661F30]">{category?.name}</h1>
          {getCategoryIcon()}
        </div>

        <button
          onClick={toggleFilters}
          className="filters-toggle border rounded-[24px] w-[352px] text-[24px] p-[7px_16px] flex justify-between items-center cursor-pointer mb-4"
        >
          <span className="font-semibold">Filtry</span>
          <img
            src={filtersVisible ? '/icons/arrow-left-black.svg' : '/icons/arrow-right-black.svg'}
            alt="Toggle Filters"
            className="w-[24px] h-[24px]"
          />
        </button>

        <div className="flex">
          {filtersVisible && (
            <div className="w-1/4 pr-8">
              {attributes.length ? (
                <Filters
                  attributes={attributes}
                  errorMessage={errorMessage || undefined}
                  onFilterChange={handleFilterChange}
                  activeFilters={activeFilters} // Pass active filters to Filters
                />
                            
              ) : (
                <FilterSkeleton />
              )}
            </div>
          )}

          <div className={`${filtersVisible ? 'w-3/4' : 'w-full'} pl-8`}>
            <ProductArchive
              categoryId={category?.id}
              filters={activeFilters}
              sortingOption={sortingOption}
              onRemoveFilter={handleRemoveFilter}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
