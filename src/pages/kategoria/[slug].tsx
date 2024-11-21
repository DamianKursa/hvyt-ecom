import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import Filters from '../../components/Filter/Filters.component';

import ProductArchive from '@/components/Product/ProductArchive';
import FiltersControls from '@/components/Filter/FiltersControls';
import Snackbar from '@/components/UI/Snackbar.component';
import CategoryDescription from '@/components/Category/CategoryDescription.component';
import { fetchCategoryData } from '../../utils/api/woocommerce';

interface Attribute {
  id: number;
  name: string;
  options?: any[];
}

interface Category {
  id: number;
  name: string;
}

interface CategoryPageProps {
  category: Category;
  attributes: Attribute[];
  initialProducts: any[];
  totalProducts: number;
}

const icons: Record<string, string> = {
  'uchwyty-meblowe': '/icons/uchwyty-kształty.svg',
  klamki: '/icons/klamki-kształty.svg',
  wieszaki: '/icons/wieszaki-kształty.svg',
};

const CategoryPage = ({
  category,
  attributes,
  initialProducts,
  totalProducts,
}: CategoryPageProps) => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const [products, setProducts] = useState(initialProducts);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(!isMobile);
  const [activeFilters, setActiveFilters] = useState<
    { name: string; value: string }[]
  >([]);
  const [sortingOption, setSortingOption] = useState('default');
  const [isArrowDown, setIsArrowDown] = useState(true);
  const [currentAttributes, setCurrentAttributes] = useState(attributes);

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth <= 768;
      setIsMobile(isCurrentlyMobile);
      setFiltersVisible(!isCurrentlyMobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (!slug || !category) return;

      try {
        console.log('Fetching filtered products with params:', {
          categoryId: category.id,
          filters: activeFilters,
          sortingOption,
        });

        const data = await fetchCategoryData(
          slug,
          1,
          12,
          activeFilters,
          sortingOption,
        );
        console.log('Fetched filtered products:', data.products);
        setProducts(data.products || []);
      } catch (error: any) {
        console.error('Error fetching filtered products:', error);
        setErrorMessage(error.message || 'Error fetching filtered products');
        setProducts([]);
      }
    };

    fetchFilteredProducts();
  }, [activeFilters, sortingOption, category, slug]);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (!slug || !category) return;

      try {
        console.log('Fetching attributes for category:', category.id);
        const data = await fetchCategoryData(slug);
        console.log('Fetched attributes:', data.attributes);
        setCurrentAttributes(data.attributes);
      } catch (error: any) {
        console.error('Error fetching attributes:', error);
        setErrorMessage(error.message || 'Error fetching attributes');
      }
    };

    fetchAttributes();
  }, [category, slug]);

  useEffect(() => {
    // Parse filters from URL
    const queryFilters = router.query.filters;
    if (queryFilters) {
      try {
        const parsedFilters = JSON.parse(queryFilters as string);
        setActiveFilters(parsedFilters);
      } catch (error) {
        console.error('Error parsing filters from URL:', error);
      }
    }
  }, [router.query.filters]);

  const handleFilterChange = (
    selectedFilters: { name: string; value: string }[],
  ) => {
    console.log('Filter change:', selectedFilters);
    setActiveFilters(selectedFilters);

    // Update URL with filters
    const query = {
      ...router.query,
      filters: JSON.stringify(selectedFilters),
    };
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const handleRemoveFilter = (filterToRemove: {
    name: string;
    value: string;
  }) => {
    const updatedFilters = activeFilters.filter(
      (filter) =>
        filter.name !== filterToRemove.name ||
        filter.value !== filterToRemove.value,
    );
    setActiveFilters(updatedFilters);

    // Update URL with filters
    const query = {
      ...router.query,
      filters: JSON.stringify(updatedFilters),
    };
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const getCategoryIcon = () => {
    if (slug && icons[slug]) {
      return (
        <Image
          src={icons[slug]}
          alt={`${slug} icon`}
          width={54}
          height={24}
          className="ml-2"
        />
      );
    }
    return null;
  };

  if (errorMessage) {
    return (
      <Layout title="Error">
        <Snackbar message={errorMessage} type="error" visible={true} />
      </Layout>
    );
  }

  return (
    <Layout title={category?.name || 'Category'}>
      <div className="container px-4 max-w-[1440px] mt-[88px] lg:mt-[115px] mx-auto">
        <nav className="breadcrumbs">{/* Breadcrumbs component */}</nav>

        <div className="flex items-center mb-8">
          <h1 className="text-[40px] font-bold text-[#661F30]">
            {category?.name}
          </h1>
          {getCategoryIcon()}
        </div>

        {/* FiltersControls */}
        <FiltersControls
          filtersVisible={filtersVisible}
          toggleFilters={toggleFilters}
          filters={activeFilters}
          sorting={sortingOption}
          onSortingChange={setSortingOption}
          onRemoveFilter={handleRemoveFilter}
          isArrowDown={isArrowDown}
          setIsArrowDown={setIsArrowDown}
          isMobile={isMobile}
        />

        <div className="flex">
          {!isMobile && filtersVisible && (
            <div className="w-1/4 pr-8">
              <Filters
                attributes={currentAttributes}
                errorMessage={errorMessage || undefined}
                onFilterChange={handleFilterChange}
                activeFilters={activeFilters}
              />
            </div>
          )}

          <div
            className={`${filtersVisible && !isMobile ? 'lg:w-3/4' : 'w-full'} w-full`}
          >
            <ProductArchive
              categoryId={category?.id || 0}
              filters={activeFilters}
              sortingOption={sortingOption}
              initialProducts={products}
              totalProducts={totalProducts}
            />
          </div>
        </div>
      </div>

      {/* Full-width Category Description Section */}
      <div className="w-full">
        <CategoryDescription category={slug || ''} />
      </div>

      {isMobile && filtersVisible && (
        <div className="fixed inset-0 bg-white z-50 p-4 flex flex-col rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[24px] font-semibold">Filtry</h2>
            <button onClick={toggleFilters} className="text-[24px]">
              &times;
            </button>
          </div>

          <div className="flex-grow overflow-y-auto mb-4">
            <Filters
              attributes={currentAttributes}
              errorMessage={errorMessage || undefined}
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
            />
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex flex-col gap-4">
            <button
              onClick={() => setActiveFilters([])}
              className="inline-block w-full px-6 py-4 text-lg text-black bg-white border border-black rounded-full hover:bg-gray-100 transition-colors"
            >
              Wyczysc filtry
            </button>
            <button
              onClick={toggleFilters}
              className="inline-block w-full px-6 py-4 text-lg text-white bg-black rounded-full hover:bg-dark-pastel-red transition-colors"
            >
              Pokaż produkty
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const data = await fetchCategoryData(slug);

    return {
      props: {
        category: data.category,
        attributes: data.attributes,
        initialProducts: data.products,
        totalProducts: data.totalProducts,
      },
    };
  } catch (error: any) {
    console.error('Error loading category data:', error);
    return {
      props: {
        category: null,
        attributes: [],
        initialProducts: [],
        totalProducts: 0,
        errorMessage: error.message || 'Error loading category data',
      },
    };
  }
};

export default CategoryPage;
