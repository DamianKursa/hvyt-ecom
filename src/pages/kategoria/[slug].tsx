import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Layout from '@/components/Layout/Layout.component';
import Filters from '@/components/Filters/Filters.component';
import ProductArchive from '@/components/Product/ProductArchive';
import FiltersControls from '@/components/Filters/FiltersControls';
import CategoryDescription from '@/components/Category/CategoryDescription.component';
import FilterModal from '@/components/Filters/FilterModal';

interface Category {
  id: number;
  name: string;
  slug: string;
  // include any other fields as needed
}

interface CategoryPageProps {
  category: Category;
  initialProducts: any[];
  initialTotalProducts: number;
}

const icons: Record<string, string> = {
  'uchwyty-meblowe': '/icons/uchwyty-kształty.svg',
  klamki: '/icons/klamki-kształty.svg',
  wieszaki: '/icons/wieszaki-kształty.svg',
};

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
  const ignoredParams = new Set([
    'slug',
    'sort',
    'gad_source',
    'gclid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
  ]);

  // Update filters from URL query parameters
  useEffect(() => {
    const updateFiltersFromQuery = () => {
      const queryFilters: { name: string; value: string }[] = [];
      const queryKeys = Object.keys(router.query);
      let sortFromQuery = 'Sortowanie';

      queryKeys.forEach((key) => {
        if (ignoredParams.has(key)) {
          return; // Skip these
        }
        // If the key is 'sort', handle sorting
        if (key === 'sort') {
          sortFromQuery = router.query[key] as string;
          return;
        }

        const values = router.query[key];
        if (Array.isArray(values)) {
          values.forEach((value) => queryFilters.push({ name: key, value }));
        } else if (typeof values === 'string') {
          queryFilters.push({ name: key, value: values });
        }
      });

      if (sortFromQuery !== 'Sortowanie') {
        setSortingOption(sortFromQuery);
      }
      setActiveFilters(queryFilters);
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

  // Prevent resetting on first load
  useEffect(() => {
    if (!initialLoadRef.current) {
      setProducts(initialProducts);
      setFilteredProductCount(initialTotalProducts);
      setCurrentPage(1);
      setActiveFilters([]);
      setSortingOption('Sortowanie');
    } else {
      initialLoadRef.current = false;
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
      let res;
      if (filters.length > 0) {
        // Call API route for filtered products
        res = await fetch(
          `/api/category?action=fetchProductsWithFilters&categoryId=${category.id}&filters=${encodeURIComponent(
            JSON.stringify(filters),
          )}&page=${page}&perPage=12`,
        );
      } else if (sortOption !== 'Sortowanie') {
        // Map sortOption to orderby and order parameters
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

        res = await fetch(
          `/api/category?action=fetchSortedProducts&categoryId=${category.id}&orderby=${sortingParams.orderby}&order=${sortingParams.order}&page=${page}&perPage=12`,
        );
      } else {
        res = await fetch(
          `/api/category?action=fetchProductsByCategoryId&categoryId=${category.id}&page=${page}&perPage=12`,
        );
      }
      if (!res.ok) throw new Error('Error fetching products');
      const data = await res.json();
      setProducts(data.products);
      setFilteredProductCount(data.totalProducts);
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
  // Build an absolute URL using an environment variable (or fallback to localhost)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const categoryRes = await fetch(
      `${baseUrl}/api/category?action=fetchCategoryBySlug&slug=${encodeURIComponent(
        slug,
      )}`,
    );
    if (!categoryRes.ok) throw new Error('Error fetching category');
    const fetchedCategory = await categoryRes.json();

    const productsRes = await fetch(
      `${baseUrl}/api/category?action=fetchProductsByCategoryId&categoryId=${fetchedCategory.id}&page=1&perPage=12`,
    );
    if (!productsRes.ok) throw new Error('Error fetching products');
    const productsData = await productsRes.json();

    return {
      props: {
        category: fetchedCategory,
        initialProducts: productsData.products,
        initialTotalProducts: productsData.totalProducts,
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
