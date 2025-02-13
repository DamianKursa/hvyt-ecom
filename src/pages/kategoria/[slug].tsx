import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Layout from '@/components/Layout/Layout.component';
import Filters from '@/components/Filters/Filters.component';
import ProductArchive from '@/components/Product/ProductArchive';
import FiltersControls from '@/components/Filters/FiltersControls';
import CategoryDescription from '@/components/Category/CategoryDescription.component';
import FilterModal from '@/components/Filters/FilterModal';
import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
  fetchProductsWithFilters,
  fetchSortedProducts,
} from '@/utils/api/category';

interface Category {
  id: number;
  name: string;
}

const icons: Record<string, string> = {
  'uchwyty-meblowe': '/icons/uchwyty-kształty.svg',
  klamki: '/icons/klamki-kształty.svg',
  wieszaki: '/icons/wieszaki-kształty.svg',
};

interface CategoryPageProps {
  category: Category;
  initialProducts: any[];
  initialTotalProducts: number;
}

const CategoryPage = ({
  category,
  initialProducts,
  initialTotalProducts,
}: CategoryPageProps) => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(!isMobile);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    { name: string; value: string }[]
  >([]);
  const [sortingOption, setSortingOption] = useState('Sortowanie');
  const [filteredProductCount, setFilteredProductCount] =
    useState(initialTotalProducts);
  const [loading, setLoading] = useState(false);

  const initialLoadRef = useRef(true); // Prevent resetting during the initial load
  const lastFetchParams = useRef<string | null>(null);

  const filterOrder: Record<string, string[]> = {
    'uchwyty-meblowe': [
      'Rodzaj',
      'Kolor OK',
      'Rozstaw',
      'Materiał',
      'Styl',
      'Kolekcja',
      'Przeznaczenie',
    ],
    klamki: ['Kształt rozety', 'Kolor OK', 'Materiał'],
    wieszaki: ['Kolor OK', 'Materiał'],
  };

  // Parse filters from URL query parameters
  useEffect(() => {
    const updateFiltersFromQuery = () => {
      const queryFilters: { name: string; value: string }[] = [];
      const queryKeys = Object.keys(router.query);
      let sortFromQuery = 'Sortowanie'; // default value

      queryKeys.forEach((key) => {
        if (key === 'sort') {
          // Save the sort query parameter separately
          sortFromQuery = router.query[key] as string;
        } else if (key !== 'slug') {
          // Treat other keys as filters
          const values = router.query[key];
          if (Array.isArray(values)) {
            values.forEach((value) => queryFilters.push({ name: key, value }));
          } else if (typeof values === 'string') {
            queryFilters.push({ name: key, value: values });
          }
        }
      });

      // Update the sorting option if provided
      if (sortFromQuery !== 'Sortowanie') {
        setSortingOption(sortFromQuery);
      }
      setActiveFilters(queryFilters);

      // Fetch products with the proper sorting option
      fetchProducts(queryFilters, sortFromQuery, 1);
    };

    if (router.isReady) {
      updateFiltersFromQuery();
    }
  }, [router.query, router.isReady]);

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

  // Prevent default category reset on first load
  useEffect(() => {
    if (!initialLoadRef.current) {
      setProducts(initialProducts);
      setFilteredProductCount(initialTotalProducts);
      setCurrentPage(1);
      setActiveFilters([]);
      setSortingOption('Sortowanie');
    } else {
      initialLoadRef.current = false; // Mark initial load as complete
    }
  }, [category.id]);

  const fetchProducts = async (
    filters: { name: string; value: string }[] = activeFilters,
    sortOption: string = sortingOption,
    page: number = currentPage,
  ) => {
    const fetchParams = JSON.stringify({ filters, sortOption, page });

    if (fetchParams === lastFetchParams.current) return;
    lastFetchParams.current = fetchParams;

    setLoading(true);

    try {
      if (filters.length > 0) {
        const { products: fetchedProducts, totalProducts } =
          await fetchProductsWithFilters(category.id, filters, page, 12);
        setProducts(fetchedProducts);
        setFilteredProductCount(totalProducts);
      } else if (sortOption !== 'Sortowanie') {
        const sortingMap: Record<string, { orderby: string; order: string }> = {
          Bestsellers: { orderby: 'popularity', order: 'asc' },
          'Najnowsze produkty': { orderby: 'date', order: 'desc' },
          'Najwyższa cena': { orderby: 'price', order: 'desc' },
          'Najniższa cena': { orderby: 'price', order: 'asc' },
        };

        const sortingParams = sortingMap[sortOption] || {
          orderby: 'menu_order',
          order: 'asc',
        };

        const { products: sortedProducts, totalProducts } =
          await fetchSortedProducts(
            category.id,
            sortingParams.orderby,
            sortingParams.order,
            page,
            12,
          );

        setProducts(sortedProducts);
        setFilteredProductCount(totalProducts);
      } else {
        const { products: fetchedProducts, totalProducts } =
          await fetchProductsByCategoryId(category.id, page, 12);
        setProducts(fetchedProducts);
        setFilteredProductCount(totalProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    selectedFilters: { name: string; value: string }[],
  ) => {
    setActiveFilters(selectedFilters);
    setCurrentPage(1);
    updateUrlWithFilters(selectedFilters);
    fetchProducts(selectedFilters, sortingOption, 1);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setFilteredProductCount(initialTotalProducts);
    setProducts(initialProducts);
    setCurrentPage(1);

    router.push({ pathname: router.pathname, query: { slug: slug || '' } });
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => !prev);
  };

  const handleSortingChange = (sortingValue: string) => {
    setCurrentPage(1);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, sort: sortingValue },
      },
      undefined,
      { shallow: true },
    );
  };

  const updateUrlWithFilters = (filters: { name: string; value: string }[]) => {
    const query: Record<string, string | string[]> = { slug: slug || '' };

    filters.forEach((filter) => {
      if (!query[filter.name]) {
        query[filter.name] = [];
      }

      if (Array.isArray(query[filter.name])) {
        if (!(query[filter.name] as string[]).includes(filter.value)) {
          query[filter.name] = [
            ...(query[filter.name] as string[]),
            filter.value,
          ];
        }
      } else {
        query[filter.name] = [filter.value];
      }
    });

    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return (
    <Layout title={`Hvyt | ${category.name || 'Loading...'}`}>
      <div className="container max-w-[1440px] mt-[115px] px-4 md:px-0 mx-auto">
        <nav className="breadcrumbs">{/* Breadcrumbs component */}</nav>

        <div className="flex items-center mb-8">
          <h1 className="text-[32px] mt-[24px] md:text-[40px] font-bold text-[#661F30] flex items-center gap-4">
            {category.name}
            {icons[slug || ''] && (
              <img
                src={icons[slug || '']}
                alt="Category Icon"
                className="ml-2 h-6 md:h-8"
              />
            )}
          </h1>
        </div>

        <FiltersControls
          filtersVisible={filtersVisible}
          toggleFilters={
            isMobile
              ? toggleFilterModal
              : () => setFiltersVisible(!filtersVisible)
          }
          filters={activeFilters}
          sorting={sortingOption}
          onSortingChange={handleSortingChange}
          onRemoveFilter={(filterToRemove) => {
            const updatedFilters = activeFilters.filter(
              (filter) =>
                filter.name !== filterToRemove.name ||
                filter.value !== filterToRemove.value,
            );
            handleFilterChange(updatedFilters);
          }}
          isMobile={isMobile}
        />

        <div className="flex">
          {!isMobile && filtersVisible && (
            <div className="w-1/4 pr-8">
              <Filters
                categoryId={category.id}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                setProducts={setProducts}
                setTotalProducts={setFilteredProductCount}
                filterOrder={filterOrder[slug || ''] || []}
              />
            </div>
          )}

          <div
            className={`w-full ${filtersVisible && !isMobile ? 'lg:w-3/4' : ''}`}
          >
            <ProductArchive
              products={products}
              totalProducts={filteredProductCount}
              loading={loading}
              perPage={12}
              currentPage={currentPage}
              onPageChange={(page) => {
                setCurrentPage(page);
                fetchProducts(activeFilters, sortingOption, page);
              }}
            />
          </div>
        </div>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categoryId={category.id}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => {
          setIsFilterModalOpen(false);
          fetchProducts(activeFilters, sortingOption, 1);
        }}
        onClearFilters={clearFilters}
        setProducts={setProducts}
        setTotalProducts={setFilteredProductCount}
        productsCount={filteredProductCount}
        initialProductCount={initialTotalProducts}
        filterOrder={filterOrder[slug || ''] || []}
      />

      <div className="w-full">
        <CategoryDescription category={slug || ''} />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;

  try {
    const fetchedCategory = await fetchCategoryBySlug(slug);
    const { products: fetchedProducts, totalProducts } =
      await fetchProductsByCategoryId(fetchedCategory.id, 1, 12);

    return {
      props: {
        category: fetchedCategory,
        initialProducts: fetchedProducts,
        initialTotalProducts: totalProducts,
      },
      revalidate: 60,
    };
  } catch (error) {
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    { params: { slug: 'uchwyty-meblowe' } },
    { params: { slug: 'klamki' } },
    { params: { slug: 'wieszaki' } },
  ];

  return { paths, fallback: 'blocking' };
};

export default CategoryPage;
