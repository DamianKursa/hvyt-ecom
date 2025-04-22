import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
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
}

interface SEOData {
  yoastTitle: string;
  yoastDescription: string;
  description: string;
}

interface CategoryPageProps {
  category: Category;
  initialProducts: any[];
  initialTotalProducts: number;
  seoData: SEOData | null;
  initialAttributes: any[];
}

const filterOrder: Record<string, string[]> = {
  'uchwyty-meblowe': [
    'Rodzaj',
    'Kolor',
    'Rozstaw',
    'Materiał',
    'Styl',
    'Kolekcja',
    'Przeznaczenie',
  ],
  klamki: ['Kształt rozety', 'Kolor', 'Materiał'],
  wieszaki: ['Kolor', 'Materiał'],
};

const icons: Record<string, string> = {
  'uchwyty-meblowe': '/icons/uchwyty-kształty.svg',
  klamki: '/icons/klamki-kształty.svg',
  wieszaki: '/icons/wieszaki-kształty.svg',
};

const ignoredParams = new Set([
  'slug',
  'gad_source',
  'gclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'srsltid',
  'gbraid',
]);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CategoryPage = ({
  category,
  initialProducts,
  initialTotalProducts,
  seoData,
  initialAttributes,
}: CategoryPageProps) => {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const seoTitle =
    seoData && seoData.yoastTitle
      ? seoData.yoastTitle
      : `HVYT | ${category.name}`;
  const seoDescription =
    seoData && seoData.yoastDescription ? seoData.yoastDescription : '';

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<
    { name: string; value: string }[]
  >([]);
  const [sortingOption, setSortingOption] = useState('Sortowanie');
  const [isMobile, setIsMobile] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Update filters from URL query parameters on initial load
  useEffect(() => {
    const updateFiltersFromQuery = () => {
      const queryFilters: { name: string; value: string }[] = [];
      let sortFromQuery = 'Sortowanie';
      Object.keys(router.query).forEach((key) => {
        if (ignoredParams.has(key)) return;
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
      setActiveFilters(queryFilters);
      if (sortFromQuery !== 'Sortowanie') {
        setSortingOption(sortFromQuery);
      }
      setCurrentPage(1);
    };

    if (router.isReady) {
      updateFiltersFromQuery();
    }
  }, [router.query, router.isReady]);

  // Handle resizing to update mobile state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setFiltersVisible(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build dynamic SWR key based on filters, sorting, and page
  const buildApiEndpoint = () => {
    if (activeFilters.length > 0) {
      return `/api/category?action=fetchProductsWithFilters&categoryId=${category.id}&filters=${encodeURIComponent(
        JSON.stringify(activeFilters),
      )}&page=${currentPage}&perPage=12`;
    } else if (sortingOption !== 'Sortowanie') {
      const sortingMap: Record<string, { orderby: string; order: string }> = {
        Bestsellers: { orderby: 'popularity', order: 'asc' },
        'Najnowsze produkty': { orderby: 'date', order: 'desc' },
        'Najwyższa cena': { orderby: 'price', order: 'desc' },
        'Najniższa cena': { orderby: 'price', order: 'asc' },
      };
      const sortingParams = sortingMap[sortingOption] || {
        orderby: 'menu_order',
        order: 'asc',
      };
      return `/api/category?action=fetchSortedProducts&categoryId=${category.id}&orderby=${sortingParams.orderby}&order=${sortingParams.order}&page=${currentPage}&perPage=12`;
    } else {
      return `/api/category?action=fetchProductsByCategoryId&categoryId=${category.id}&page=${currentPage}&perPage=12`;
    }
  };

  const swrKey = buildApiEndpoint();

  const fallback =
    activeFilters.length === 0 &&
    sortingOption === 'Sortowanie' &&
    currentPage === 1
      ? { products: initialProducts, totalProducts: initialTotalProducts }
      : undefined;

  const { data, error } = useSWR(swrKey, fetcher, {
    fallbackData: fallback,
    revalidateOnFocus: false,
    errorRetryCount: Infinity,
    errorRetryInterval: 30000,
  });
  const products = data?.products || [];
  const filteredProductCount = data?.totalProducts || 0;

  const handleFilterChange = (
    selectedFilters: { name: string; value: string }[],
  ) => {
    setActiveFilters(selectedFilters);
    setCurrentPage(1);
    updateUrlWithFilters(selectedFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setCurrentPage(1);
    router.push(
      { pathname: router.pathname, query: { slug: slug || '' } },
      undefined,
      {
        shallow: true,
      },
    );
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

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <Layout title={`Hvyt | ${category.name || 'Loading...'}`}>
      <Head>
        <title>{seoTitle}</title>
        {seoDescription && <meta name="description" content={seoDescription} />}
        {/* <meta rel="canonical" href={`https://hvyt.pl/kategoria/${slug}`} /> */}
        <link id="meta-cannonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL}/kategoria/${slug}`} />
      </Head>
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
                !(
                  filter.name === filterToRemove.name &&
                  filter.value === filterToRemove.value
                ),
            );
            setActiveFilters(updatedFilters);
            handleFilterChange(updatedFilters);
          }}
          isMobile={isMobile}
        />
        <div className="flex">
          {!isMobile && filtersVisible && (
            <div className={`w-1/4 pr-8 ${filtersVisible ? '' : 'hidden'}`}>
              <Filters
                categoryId={category.id}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                setProducts={() => {}}
                setTotalProducts={() => {}}
                filterOrder={filterOrder[slug || ''] || []}
                initialAttributes={initialAttributes}
              />
            </div>
          )}
          <div
            className={`w-full ${filtersVisible && !isMobile ? 'lg:w-3/4' : ''}`}
          >
            <ProductArchive
              products={products}
              totalProducts={filteredProductCount}
              loading={!data && !error}
              perPage={12}
              currentPage={currentPage}
              onPageChange={onPageChange}
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
          // SWR revalidates automatically on state change.
        }}
        onClearFilters={clearFilters}
        setProducts={() => {}}
        setTotalProducts={() => {}}
        productsCount={filteredProductCount}
        initialProductCount={initialTotalProducts}
        filterOrder={filterOrder[slug || ''] || []}
        initialAttributes={initialAttributes}
      />
      <div className="w-full">
        <CategoryDescription category={slug || ''} />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const aggregatorRes = await fetch(
      `${baseUrl}/api/category-aggregator?slug=${encodeURIComponent(slug)}&page=1&perPage=12`,
    );
    if (!aggregatorRes.ok) throw new Error('Error fetching aggregated data');
    const aggregatorData = await aggregatorRes.json();

    const fs = require('fs');
    const path = require('path');
    const seoFilePath = path.join(process.cwd(), 'data', 'seo-data.json');
    const seoContent = fs.readFileSync(seoFilePath, 'utf-8');
    const seoJSON = JSON.parse(seoContent);
    const seoArray: any[] = seoJSON.categories || [];
    const seoEntry = seoArray.find((entry) => entry.slug === slug);
    let seoData = null;
    if (seoEntry) {
      seoData = {
        yoastTitle: seoEntry.yoastTitle || '',
        yoastDescription: seoEntry.yoastDescription || '',
        description: seoEntry.description || '',
      };
    }

    return {
      props: {
        category: aggregatorData.category,
        initialProducts: aggregatorData.products,
        initialTotalProducts: aggregatorData.totalProducts,
        initialAttributes: aggregatorData.attributes,
        seoData,
      },
      revalidate: 21600,
    };
  } catch (error) {
    return {
      props: {
        category: { id: 0, name: 'Unknown', slug },
        initialProducts: [],
        initialTotalProducts: 0,
        initialAttributes: [],
        seoData: null,
      },
      revalidate: 60,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    { params: { slug: 'uchwyty-meblowe' } },
    { params: { slug: 'klamki' } },
    { params: { slug: 'wieszaki' } },
  ];

  return {
    paths,
    fallback: 'blocking',
  };
};

export default CategoryPage;
