import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout.component';
import Filters from '../../components/Filters/Filters.component';
import ProductArchive from '@/components/Product/ProductArchive';
import FiltersControls from '../../components/Filters/FiltersControls';
import Snackbar from '@/components/UI/Snackbar.component';
import CategoryDescription from '@/components/Category/CategoryDescription.component';
import {
  fetchCategoryBySlug,
  fetchProductAttributesWithTerms,
  fetchProductsByCategoryId,
} from '@/utils/api/category'; // Ensure these APIs are in the utils folder

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
        const { products: fetchedProducts } = await fetchProductsByCategoryId(
          category.id,
          1,
          12,
          activeFilters,
          sortingOption,
        );
        setProducts(fetchedProducts || []);
      } catch (error: any) {
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
        const attributes = await fetchProductAttributesWithTerms(category.id);
        setCurrentAttributes(attributes);
      } catch (error: any) {
        setErrorMessage(error.message || 'Error fetching attributes');
      }
    };

    fetchAttributes();
  }, [category, slug]);

  useEffect(() => {
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
    setActiveFilters(selectedFilters);

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
      <div className="container max-w-[1440px] mt-[88px] lg:mt-[115px] mx-auto">
        <nav className="breadcrumbs">{/* Breadcrumbs component */}</nav>

        <div className="flex items-center mb-8">
          <h1 className="text-[40px] font-bold text-[#661F30]">
            {category?.name}
          </h1>
          {getCategoryIcon()}
        </div>

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
            className={`${
              filtersVisible && !isMobile ? 'lg:w-3/4' : 'w-full'
            } w-full`}
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

      <div className="w-full">
        <CategoryDescription category={slug || ''} />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const category = await fetchCategoryBySlug(slug);
    const attributes = await fetchProductAttributesWithTerms(category.id);
    const { products, totalProducts } = await fetchProductsByCategoryId(
      category.id,
      1,
      12,
      [],
      'default',
    );

    return {
      props: {
        category,
        attributes,
        initialProducts: products,
        totalProducts,
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
