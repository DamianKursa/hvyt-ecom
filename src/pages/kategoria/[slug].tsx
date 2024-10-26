import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import Filters from '@/components/Product/Filters.component';
import ProductArchive from '@/components/Product/ProductArchive';
import FiltersControls from '@/components/Product/FiltersControls';
import FilterSkeleton from '@/components/Product/SkeletonFilter.component';
import Snackbar from '@/components/UI/Snackbar.component';
import { fetchCategoryBySlug, fetchProductAttributesWithTerms } from '../../utils/api/woocommerce';

interface Attribute {
  id: number;
  name: string;
  options?: any[];
}

interface Category {
  id: number;
  name: string;
}

const icons: Record<string, string> = {
  'uchwyty-meblowe': '/icons/uchwyty-kształty.svg',
  klamki: '/icons/klamki-kształty.svg',
  wieszaki: '/icons/wieszaki-kształty.svg',
};

const CategoryPage = () => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ name: string; value: string }[]>([]);
  const [sortingOption, setSortingOption] = useState('default');
  const [isArrowDown, setIsArrowDown] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryData = await fetchCategoryBySlug(slug as string);
        setCategory(categoryData);

        const attributesData: Attribute[] = await fetchProductAttributesWithTerms();
        setAttributes(attributesData);

        setLoading(false);
      } catch (error: any) {
        console.error('Error loading category data:', error);
        setErrorMessage(error.message || 'Error loading category data');
        setLoading(false);
      }
    };

    fetchData();

    // Media query for detecting mobile
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slug]);

  const handleFilterChange = (selectedFilters: { name: string; value: string }[]) => {
    setActiveFilters(selectedFilters);
  };

  const handleRemoveFilter = (filterToRemove: { name: string; value: string }) => {
    setActiveFilters(currentFilters =>
      currentFilters.filter(
        filter => filter.name !== filterToRemove.name || filter.value !== filterToRemove.value
      )
    );
  };

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const getCategoryIcon = () => {
    if (slug && icons[slug as string]) {
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

        {/* FiltersControls */}
        <FiltersControls
          filtersVisible={filtersVisible}
          toggleFilters={toggleFilters}
          filters={activeFilters}
          sorting={sortingOption}
          onSortingChange={(e) => setSortingOption(e.target.value)}
          onRemoveFilter={handleRemoveFilter}
          isArrowDown={isArrowDown}
          setIsArrowDown={setIsArrowDown}
          isMobile={isMobile}
        />

        <div className="flex">
          {/* Filters Section for Desktop */}
          {!isMobile && filtersVisible && (
            <div className="w-1/4 pr-8">
              {attributes.length ? (
                <Filters
                  attributes={attributes}
                  errorMessage={errorMessage || undefined}
                  onFilterChange={handleFilterChange}
                  activeFilters={activeFilters}
                />
              ) : (
                <FilterSkeleton />
              )}
            </div>
          )}

          {/* Product Archive */}
          <div className={`${filtersVisible && !isMobile ? 'lg:w-3/4' : 'w-full'} w-full lg:pl-8`}>
            <ProductArchive
              categoryId={category?.id || 0}
              filters={activeFilters}
              sortingOption={sortingOption}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobile && filtersVisible && (
        <div className="fixed inset-0 bg-white z-50 p-4 rounded-lg overflow-y-scroll">
          <div className="flex justify-between items-center">
            <h2 className="text-[24px] font-semibold">Filtry</h2>
            <button onClick={toggleFilters} className="text-[24px]">&times;</button>
          </div>
          <div className="mt-4">
            <Filters
              attributes={attributes}
              errorMessage={errorMessage || undefined}
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={toggleFilters} className="border px-4 py-2 rounded-lg">
              Wyczysc filtry
            </button>
            <button onClick={toggleFilters} className="bg-black text-white px-4 py-2 rounded-lg">
              Pokaż produkty
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CategoryPage;
